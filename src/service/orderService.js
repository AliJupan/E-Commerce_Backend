class OrderService {
  constructor(
    orderRepository,
    logger,
    fileUploadLib,
    orderDetailsService,
    productService,
    emailService,
    userService,
    invoiceService
  ) {
    this.logger = logger;
    this.orderRepository = orderRepository;
    this.fileUploadLib = fileUploadLib;
    this.orderDetailsService = orderDetailsService;
    this.productService = productService;
    this.emailService = emailService;
    this.userService = userService;
    this.invoiceService = invoiceService;
  }

  logInfo(fn, message, extra = {}) {
    this.logger.info({
      module: "OrderService",
      fn,
      message,
      ...extra,
    });
  }

  logError(fn, message, extra = {}) {
    this.logger.error({
      module: "OrderService",
      fn,
      message,
      ...extra,
    });
  }

  logWarn(fn, message, extra = {}) {
    this.logger.warn({
      module: "OrderService",
      fn,
      message,
      ...extra,
    });
  }

  parseId(id) {
    const parsed = parseInt(id, 10);
    if (isNaN(parsed)) throw new Error("Invalid ID format");
    return parsed;
  }

  async createOrder(data) {
    const fn = "createOrder";
    try {
      const { items, ...orderInfo } = data;

      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error("Order must include at least one item.");
      }

      this.logInfo(fn, "Fetching products for order");
      const products = await this.productService.getProductsByIds(
        items.map((i) => i.productId)
      );

      const orderItems = [];
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        if (item.quantity > product.quantity) {
          throw new Error(
            `Not enough quantity for product "${product.name}". Available: ${product.quantity}, requested: ${item.quantity}`
          );
        }

        orderItems.push({
          ...item,
          price: product.price,
          totalPrice: product.price * item.quantity,
        });
      }

      const totalPrice = orderItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );

      this.logInfo(fn, "Creating order record");
      let order = await this.orderRepository.createOrder({
        ...orderInfo,
        totalPrice,
        isDelivered: false,
        isPaid: false,
      });

      await this.orderDetailsService.addOrderDetails(order.id, orderItems);

      this.logInfo(fn, "Updating product quantities");
      for (const item of orderItems) {
        await this.productService.updateProductQuantity(
          item.productId,
          item.quantity
        );
      }

      this.logInfo(fn, "Generating invoice");
      await this.invoiceService.createInvoice(order.id);

      order = await this.orderRepository.getOrderById(order.id);

      const admins = await this.userService.getAdmins();
      this.logInfo(fn, `Sending notifications to ${admins.length} admins`);

      for (const admin of admins) {
        await this.emailService.sendOrderNotificationAdmin(
          admin.email,
          order.id
        );
      }

      this.logInfo(fn, "Sending confirmation email to customer");
      await this.emailService.sendOrderConfirmationCustomer(
        order.email,
        order.name,
        order.id,
        order.invoice?.pdfUrl
      );

      this.logInfo(fn, "Order created successfully", { orderId: order.id });
      return order;
    } catch (error) {
      this.logError(fn, error.message, { stack: error.stack });
      throw error;
    }
  }

  async getOrderById(id) {
    const fn = "getOrderById";
    try {
      const parsedId = this.parseId(id);
      const order = await this.orderRepository.getOrderById(parsedId);

      if (!order) {
        throw new Error(`Order with id ${parsedId} not found`);
      }

      if (order.invoice?.pdfUrl) {
        const invoiceFile = await this.fileUploadLib.get(order.invoice.pdfUrl);
        order.invoice.pdfUrl = invoiceFile
          ? `/uploads/${invoiceFile.fileName}`
          : null;
      }

      this.logInfo(fn, "Order fetched successfully", { orderId: parsedId });
      return order;
    } catch (error) {
      this.logError(fn, error.message, { stack: error.stack });
      throw error;
    }
  }

  async getOrdersByUserId(id) {
    const fn = "getOrdersByUserId";
    try {
      const parsedId = this.parseId(id);
      const orders = await this.orderRepository.getOrdersByUserId(parsedId);

      if (!orders || orders.length === 0) {
        this.logWarn(fn, `No orders found for user ${parsedId}`);
        return [];
      }

      for (const order of orders) {
        if (order.invoice?.pdfUrl) {
          const invoiceFile = await this.fileUploadLib.get(order.invoice.pdfUrl);
          order.invoice.pdfUrl = invoiceFile
            ? `/uploads/${invoiceFile.fileName}`
            : null;
        }
      }

      this.logInfo(fn, "Orders fetched successfully", { userId: parsedId });
      return orders;
    } catch (error) {
      this.logError(fn, error.message, { stack: error.stack });
      throw error;
    }
  }

  async getAllOrders() {
    const fn = "getAllOrders";
    try {
      const orders = await this.orderRepository.getAllOrders();
      if (!orders || orders.length === 0) {
        this.logWarn(fn, "No orders found in database");
      }
      this.logInfo(fn, "Orders fetched successfully");
      return orders;
    } catch (error) {
      this.logError(fn, error.message, { stack: error.stack });
      throw error;
    }
  }

  async updateOrder(id, data) {
    const fn = "updateOrder";
    try {
      const parsedId = this.parseId(id);
      this.logInfo(fn, "Updating order", { orderId: parsedId });
      const updatedOrder = await this.orderRepository.updateOrder(
        parsedId,
        data
      );
      this.logInfo(fn, "Order updated successfully", { orderId: parsedId });
      return updatedOrder;
    } catch (error) {
      this.logError(fn, error.message, { stack: error.stack });
      throw error;
    }
  }

  async deleteOrder(id) {
    const fn = "deleteOrder";
    try {
      const parsedId = this.parseId(id);
      this.logInfo(fn, "Deleting order", { orderId: parsedId });
      await this.orderRepository.deleteOrder(parsedId);
      this.logInfo(fn, "Order deleted successfully", { orderId: parsedId });
      return true;
    } catch (error) {
      this.logError(fn, error.message, { stack: error.stack });
      throw error;
    }
  }

  setInvoiceService(invoiceService) {
    this.invoiceService = invoiceService;
  }
}

export default OrderService;
