import BaseController from "./BaseController.js";

class OrderController extends BaseController {
  constructor(orderService, logger) {
    super(logger, "OrderController");
    this.orderService = orderService;
  }

  createOrder() {
    return this.handleRequest("createOrder", async (req) => {
      const data = req.body;
      const order = await this.orderService.createOrder(data);

      this.logInfo("createOrder", "Order created successfully", {
        name: data.name,
        email: data.email,
        totalPrice: data.totalPrice,
      });

      return { status: 201, data: order };
    });
  }

  getOrderById() {
    return this.handleRequest("getOrderById", async (req) => {
      const { id } = req.params;
      const order = await this.orderService.getOrderById(id);
      return { status: 200, data: order };
    });
  }

  getAllOrders() {
    return this.handleRequest("getAllOrders", async () => {
      const orders = await this.orderService.getAllOrders();
      return { status: 200, data: orders };
    });
  }

  updateOrder() {
    return this.handleRequest("updateOrder", async (req) => {
      const { id } = req.params;
      const data = req.body;
      const updatedOrder = await this.orderService.updateOrder(id, data);

      this.logInfo("updateOrder", "Order updated successfully", { id });
      return { status: 200, data: updatedOrder };
    });
  }

  deleteOrder() {
    return this.handleRequest("deleteOrder", async (req) => {
      const { id } = req.params;
      await this.orderService.deleteOrder(id);

      this.logInfo("deleteOrder", "Order deleted successfully", { id });
      return { status: 204, data: null };
    });
  }
}

export default OrderController;