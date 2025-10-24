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
            name: data.name,
            email: data.email,
            totalPrice: data.totalPrice,
          });

          res.status(201).json({ message: "Order created successfully" });
        } catch (error) {
          this.logger.error({
            module: "OrderController",
            fn: "createOrder",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
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

          if (!order) {
            this.logger.error({
              module: "OrderController",
              fn: "getOrderById",
              message: "Order not found",
              id,
            });
            return res.status(404).json({ error: "Order not found" });
          }

          this.logger.info({
            module: "OrderController",
            fn: "getOrderById",
            message: "Order fetched successfully",
            id,
          });

          res.status(200).json(order);
        } catch (error) {
          this.logger.error({
            module: "OrderController",
            fn: "getOrderById",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }

  getOrdersByUserId() {
    return [
      async (req, res) => {
        try {
          const id = req.user.id;
          const orders = await this.orderService.getOrdersByUserId(id);

          if (!orders || orders.length === 0) {
            this.logger.info({
              module: "OrderController",
              fn: "getOrdersByUserId",
              message: "No orders found for user",
              id,
            });
            return res.status(200).json([]);
          }

          this.logger.info({
            module: "OrderController",
            fn: "getOrdersByUserId",
            message: "User orders fetched successfully",
            id,
          });

          res.status(200).json(orders);
        } catch (error) {
          this.logger.error({
            module: "OrderController",
            fn: "getOrdersByUserId",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }

  getAllOrders() {
    return [
      async (req, res) => {
        try {
          const orders = await this.orderService.getAllOrders();

          this.logger.info({
            module: "OrderController",
            fn: "getAllOrders",
            message: "All orders fetched successfully",
          });

          res.status(200).json(orders);
        } catch (error) {
          this.logger.error({
            module: "OrderController",
            fn: "getAllOrders",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
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

          if (!updatedOrder) {
            this.logger.error({
              module: "OrderController",
              fn: "updateOrder",
              message: "Order not found or update failed",
              id,
            });
            return res
              .status(404)
              .json({ error: "Order not found or update failed" });
          }

          this.logger.info({
            module: "OrderController",
            fn: "updateOrder",
            message: "Order updated successfully",
            id,
          });

          res.status(200).json(updatedOrder);
        } catch (error) {
          this.logger.error({
            module: "OrderController",
            fn: "updateOrder",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }

  deleteOrder() {
    return [
      async (req, res) => {
        try {
          const { id } = req.params;
          const deleted = await this.orderService.deleteOrder(id);

          if (!deleted) {
            this.logger.error({
              module: "OrderController",
              fn: "deleteOrder",
              message: "Order not found or delete failed",
              id,
            });
            return res
              .status(404)
              .json({ error: "Order not found or delete failed" });
          }

          this.logger.info({
            module: "OrderController",
            fn: "deleteOrder",
            message: "Order deleted successfully",
            id,
          });

          res.status(204).json({ message: "Order deleted successfully" });
        } catch (error) {
          this.logger.error({
            module: "OrderController",
            fn: "deleteOrder",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }
}

export default OrderController;
