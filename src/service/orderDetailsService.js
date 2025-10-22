export default class OrderDetailsService {
  constructor(orderDetailsRepository, logger) {
    this.orderDetailsRepository = orderDetailsRepository;
    this.logger = logger;
  }

  async addOrderDetails(orderId, items) {
    try {
      const detailsData = items.map((item) => ({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.price * item.quantity,
      }));

      const created = await this.orderDetailsRepository.createManyOrderDetails(detailsData);

      this.logger?.info({
        module: "OrderDetailsService",
        fn: "addOrderDetails",
        message: "Order details added successfully",
        orderId,
        count: created.length,
      });

      return created;
    } catch (error) {
      this.logger?.error({
        module: "OrderDetailsService",
        fn: "addOrderDetails",
        message: error.message,
        orderId,
      });
      throw error;
    }
  }

  async getOrderDetails(orderId) {
    try {
      return await this.orderDetailsRepository.getOrderDetailsByOrderId(orderId);
    } catch (error) {
      this.logger?.error({
        module: "OrderDetailsService",
        fn: "getOrderDetails",
        message: error.message,
        orderId,
      });
      throw error;
    }
  }

  async getOrderDetailById(id) {
    try {
      return await this.orderDetailsRepository.getOrderDetailById(parseInt(id));
    } catch (error) {
      this.logger?.error({
        module: "OrderDetailsService",
        fn: "getOrderDetailById",
        message: error.message,
        id,
      });
      throw error;
    }
  }

  async updateOrderDetail(id, updateData) {
    try {
      return await this.orderDetailsRepository.updateOrderDetail(parseInt(id), updateData);
    } catch (error) {
      this.logger?.error({
        module: "OrderDetailsService",
        fn: "updateOrderDetail",
        message: error.message,
        id,
      });
      throw error;
    }
  }

  async removeOrderDetail(id) {
    try {
      return await this.orderDetailsRepository.deleteOrderDetail(parseInt(id));
    } catch (error) {
      this.logger?.error({
        module: "OrderDetailsService",
        fn: "removeOrderDetail",
        message: error.message,
        id,
      });
      throw error;
    }
  }

  async removeAllDetailsForOrder(orderId) {
    try {
      return await this.orderDetailsRepository.deleteOrderDetailsByOrderId(parseInt(orderId));
    } catch (error) {
      this.logger?.error({
        module: "OrderDetailsService",
        fn: "removeAllDetailsForOrder",
        message: error.message,
        orderId,
      });
      throw error;
    }
  }
}
