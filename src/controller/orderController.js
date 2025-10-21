import jwt from "jsonwebtoken";

class OrderController {
  constructor(orderService, logger) {
    this.orderService = orderService;
    this.logger = logger;
  }

  createOrder() {
    return [
      async (req, res) => {
        try {
          const data = req.body;
          const order = await this.orderService.createOrder(data);

          this.logger.info({
            module: "OrderController",
            fn: "createOrder",
            message: "Order created successfully",
            extra: {
              name: data.name,
              email: data.email,
              totalPrice: data.totalPrice,
            },
          });

          res.status(201).json(order);
        } catch (error) {
          this.logger.error({
            module: "OrderController",
            fn: "createOrder",
            message: `Error creating order: ${error.message}`,
          });
          res.status(500).json({ error: error.message });
        }
      },
    ];
  }

  getOrderById() {
    return [
      async (req, res) => {
        try {
          const { id } = req.params;
          const order = await this.orderService.getOrderById(id);
          res.status(200).json(order);
        } catch (error) {
          this.logger.error({
            module: "OrderController",
            fn: "getOrderById",
            message: `Error fetching order: ${error.message}`,
          });
          res.status(500).json({ error: error.message });
        }
      },
    ];
  }

  getOrdersByUserId() {
    return [
      async (req, res) => {
        try {
          const order = await this.orderService.getOrdersByUserId(req.user.id);
          res.status(200).json(order);
        } catch (error) {
          this.logger.error({
            module: "OrderController",
            fn: "getOrdersByUserId",
            message: `Error fetching user orders: ${error.message}`,
          });
          res.status(500).json({ error: error.message });
        }
      },
    ];
  }

  getAllOrders() {
    return [
      async (req, res) => {
        try {
          const orders = await this.orderService.getAllOrders();
          res.status(200).json(orders);
        } catch (error) {
          this.logger.error({
            module: "OrderController",
            fn: "getAllOrders",
            message: `Error fetching all orders: ${error.message}`,
          });
          res.status(500).json({ error: error.message });
        }
      },
    ];
  }

  updateOrder() {
    return [
      async (req, res) => {
        try {
          const { id } = req.params;
          const data = req.body;
          const updatedOrder = await this.orderService.updateOrder(id, data);

          this.logger.info({
            module: "OrderController",
            fn: "updateOrder",
            message: "Order updated successfully",
            extra: { id },
          });

          res.status(200).json(updatedOrder);
        } catch (error) {
          this.logger.error({
            module: "OrderController",
            fn: "updateOrder",
            message: `Error updating order: ${error.message}`,
          });
          res.status(500).json({ error: error.message });
        }
      },
    ];
  }

  deleteOrder() {
    return [
      async (req, res) => {
        try {
          const { id } = req.params;
          await this.orderService.deleteOrder(id);

          this.logger.info({
            module: "OrderController",
            fn: "deleteOrder",
            message: "Order deleted successfully",
            extra: { id },
          });

          res.status(204).json();
        } catch (error) {
          this.logger.error({
            module: "OrderController",
            fn: "deleteOrder",
            message: `Error deleting order: ${error.message}`,
          });
          res.status(500).json({ error: error.message });
        }
      },
    ];
  }
}

export default OrderController;
