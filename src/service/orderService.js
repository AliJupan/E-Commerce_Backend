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
    this.orderRepository = orderRepository;
    this.fileUploadLib = fileUploadLib;
    this.orderDetailsService = orderDetailsService;
    this.productService = productService;
    this.emailService = emailService;
    this.userService = userService;
    this.invoiceService = invoiceService;
    this.logger = logger;
  }

  async createOrder(data) {
    try {
      const { items, ...orderInfo } = data;
      if (!items?.length)
        throw new Error("Order must include at least one item.");

      this.logger?.info({
        module: "OrderService",
        fn: "createOrder",
        message: "Fetching products",
      });
      const products = await this.productService.getProductsByIds(
        items.map((i) => i.productId)
      );

      const orderItems = items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product)
          throw new Error(`Product with ID ${item.productId} not found`);
        if (item.quantity > product.quantity)
          throw new Error(
            `Not enough quantity for product "${product.name}". Available: ${product.quantity}, requested: ${item.quantity}`
          );

        return {
          ...item,
          price: product.price,
          totalPrice: product.price * item.quantity,
        };
      });

      const totalPrice = orderItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );

      this.logger?.info({
        module: "OrderService",
        fn: "createOrder",
        message: "Creating order record",
      });
      let order = await this.orderRepository.createOrder({
        ...orderInfo,
        totalPrice,
        isDelivered: false,
        isPaid: false,
      });

      await this.orderDetailsService.addOrderDetails(order.id, orderItems);

      this.logger?.info({
        module: "OrderService",
        fn: "createOrder",
        message: "Updating product quantities",
      });
      await Promise.all(
        orderItems.map((item) =>
          this.productService.updateProductQuantity(
            item.productId,
            item.quantity
          )
        )
      );

      this.logger?.info({
        module: "OrderService",
        fn: "createOrder",
        message: "Generating invoice",
      });
      await this.invoiceService.createInvoice(order.id);

      order = await this.orderRepository.getOrderById(parseInt(order.id));
      const admins = await this.userService.getAdmins();

      this.logger?.info({
        module: "OrderService",
        fn: "createOrder",
        message: `Sending notifications to ${admins.length} admins`,
      });
      await Promise.all(
        admins.map((admin) =>
          this.emailService.sendOrderNotificationAdmin(admin.email, order.id)
        )
      );

      this.logger?.info({
        module: "OrderService",
        fn: "createOrder",
        message: "Sending confirmation email to customer",
      });
      await this.emailService.sendOrderConfirmationCustomer(
        order.email,
        order.name,
        order.id,
        order.invoice?.pdfUrl
      );

      this.logger?.info({
        module: "OrderService",
        fn: "createOrder",
        message: "Order created successfully",
        orderId: order.id,
      });
      return order;
    } catch (error) {
      this.logger.error({
        module: "OrderService",
        fn: "createOrder",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getOrderById(id) {
    try {
      const order = await this.orderRepository.getOrderById(parseInt(id));
      if (!order) throw new Error(`Order with id ${id} not found`);

      if (order.invoice?.pdfUrl) {
        const invoiceFile = await this.fileUploadLib.get(order.invoice.pdfUrl);
        order.invoice.pdfUrl = invoiceFile
          ? `/uploads/${invoiceFile.fileName}`
          : null;
      }

      this.logger?.info({
        module: "OrderService",
        fn: "getOrderById",
        message: "Order fetched successfully",
        orderId: id,
      });
      return order;
    } catch (error) {
      this.logger?.error({
        module: "OrderService",
        fn: "getOrderById",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getOrdersByUserId(id) {
    try {
      const orders = await this.orderRepository.getOrdersByUserId(parseInt(id));
      if (!orders?.length) {
        this.logger?.warn({
          module: "OrderService",
          fn: "getOrdersByUserId",
          message: `No orders found for user ${id}`,
        });
        return [];
      }

      await Promise.all(
        orders.map(async (order) => {
          if (order.invoice?.pdfUrl) {
            const invoiceFile = await this.fileUploadLib.get(
              order.invoice.pdfUrl
            );
            order.invoice.pdfUrl = invoiceFile
              ? `/uploads/${invoiceFile.fileName}`
              : null;
          }
        })
      );

      this.logger?.info({
        module: "OrderService",
        fn: "getOrdersByUserId",
        message: "Orders fetched successfully",
        userId: id,
      });
      return orders;
    } catch (error) {
      this.logger?.error({
        module: "OrderService",
        fn: "getOrdersByUserId",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getAllOrders() {
    try {
      const orders = await this.orderRepository.getAllOrders();
      if (!orders?.length)
        this.logger?.warn({
          module: "OrderService",
          fn: "getAllOrders",
          message: "No orders found in database",
        });
      this.logger?.info({
        module: "OrderService",
        fn: "getAllOrders",
        message: "Orders fetched successfully",
      });
      return orders;
    } catch (error) {
      this.logger?.error({
        module: "OrderService",
        fn: "getAllOrders",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async updateOrder(id, data) {
    try {
      this.logger?.info({
        module: "OrderService",
        fn: "updateOrder",
        message: "Updating order",
        orderId: id,
      });
      const updatedOrder = await this.orderRepository.updateOrder(
        parseInt(id),
        data
      );
      this.logger?.info({
        module: "OrderService",
        fn: "updateOrder",
        message: "Order updated successfully",
        orderId: id,
      });
      return updatedOrder;
    } catch (error) {
      this.logger?.error({
        module: "OrderService",
        fn: "updateOrder",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async deleteOrder(id) {
    try {
      this.logger?.info({
        module: "OrderService",
        fn: "deleteOrder",
        message: "Deleting order",
        orderId: parsedId,
      });
      await this.orderRepository.deleteOrder(parseInt(id));
      this.logger?.info({
        module: "OrderService",
        fn: "deleteOrder",
        message: "Order deleted successfully",
        orderId: id,
      });
      return true;
    } catch (error) {
      this.logger?.error({
        module: "OrderService",
        fn: "deleteOrder",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  setInvoiceService(invoiceService) {
    this.invoiceService = invoiceService;
  }
}

export default OrderService;
