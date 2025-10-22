class OrderController {
  constructor(orderService, logger) {
    this.orderService = orderService;
    this.logger = logger;
  }

  async createOrder(req, res) {
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

      return res.status(201).json(order);
    } catch (error) {
      this.logger.error({
        module: "OrderController",
        fn: "createOrder",
        message: error.message,
      });
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getOrderById(req, res) {
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

      return res.status(200).json(order);
    } catch (error) {
      this.logger.error({
        module: "OrderController",
        fn: "getOrderById",
        message: error.message,
      });
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getOrdersByUserId(req, res) {
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

      return res.status(200).json(orders);
    } catch (error) {
      this.logger.error({
        module: "OrderController",
        fn: "getOrdersByUserId",
        message: error.message,
      });
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await this.orderService.getAllOrders();

      this.logger.info({
        module: "OrderController",
        fn: "getAllOrders",
        message: "All orders fetched successfully",
      });

      return res.status(200).json(orders);
    } catch (error) {
      this.logger.error({
        module: "OrderController",
        fn: "getAllOrders",
        message: error.message,
      });
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateOrder(req, res) {
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

      return res.status(200).json(updatedOrder);
    } catch (error) {
      this.logger.error({
        module: "OrderController",
        fn: "updateOrder",
        message: error.message,
      });
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteOrder(req, res) {
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

      return res.status(204).json({ message: "Order deleted successfully" });
    } catch (error) {
      this.logger.error({
        module: "OrderController",
        fn: "deleteOrder",
        message: error.message,
      });
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default OrderController;
