import BaseService from "./BaseService.js";

class OrderService extends BaseService {
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
    super(logger);
    this.orderRepository = orderRepository;
    this.fileUploadLib = fileUploadLib;
    this.orderDetailsService = orderDetailsService;
    this.productService = productService;
    this.emailService = emailService;
    this.userService = userService;
    this.invoiceService = invoiceService;
  }

  async createOrder(data) {
    return this.wrapAsync("createOrder", async () => {
      const { items, ...orderInfo } = data;

      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error("Order must include at least one item.");
      }

      // Fetch product prices and available quantities from database
      const products = await this.productService.getProductsByIds(
        items.map((i) => i.productId)
      );

      const orderItems = items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product)
          throw new Error(`Product with ID ${item.productId} not found`);

        // Check available quantity
        if (item.quantity > product.quantity) {
          throw new Error(
            `Not enough quantity for product "${product.name}". Available: ${product.quantity}, requested: ${item.quantity}`
          );
        }

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

      var order = await this.orderRepository.createOrder({
        ...orderInfo,
        totalPrice,
        isDelivered: false,
        isPaid: false,
      });

      await this.orderDetailsService.addOrderDetails(order.id, orderItems);

      // Update product quantities after order is created
      for (const item of orderItems) {
        await this.productService.updateProductQuantity(
          item.productId,
          item.quantity
        );
      }

      await this.invoiceService.createInvoice(order.id);

      order = await this.orderRepository.getOrderById(order.id);

      const admins = await this.userService.getAdmins();
      for (const admin of admins) {
        await this.emailService.sendOrderNotificationAdmin(
          admin.email,
          order.id
        );
      }

      this.emailService.sendOrderConfirmationCustomer(
        order.email,
        order.name,
        order.id,
        order.invoice.pdfUrl
      );
      return order;
    });
  }

  async getOrderById(id) {
    return this.wrapAsync("getOrderById", async () => {
      const parsedId = this.parseId(id);
      const order = await this.orderRepository.getOrderById(parsedId);

      if (!order) {
        throw new Error(`Order with id ${parsedId} not found`);
      }

      // If there's an invoice, fetch its PDF details using FileUploadLib
      if (order.invoice?.pdfUrl) {
        const invoiceFile = await this.fileUploadLib.get(order.invoice.pdfUrl);

        if (invoiceFile != null) {
          // Set a URL path for frontend access
          order.invoice.pdfUrl = `/uploads/${invoiceFile.fileName}`;
        } else {
          order.invoice.pdfUrl = null;
        }
      }

      return order;
    });
  }

  getAllOrders() {
    return this.wrapAsync("getAllOrders", async () => {
      return this.orderRepository.getAllOrders();
    });
  }

  updateOrder(id, data) {
    return this.wrapAsync("updateOrder", async () => {
      const parsedId = this.parseId(id);
      return this.orderRepository.updateOrder(parsedId, data);
    });
  }

  deleteOrder(id) {
    return this.wrapAsync("deleteOrder", async () => {
      const parsedId = this.parseId(id);
      return this.orderRepository.deleteOrder(parsedId);
    });
  }

  setInvoiceService(invoiceService) {
    this.invoiceService = invoiceService;
  }
}

export default OrderService;
