import BaseService from "./BaseService.js";

export default class OrderDetailsService extends BaseService {
  constructor(logger, orderDetailsRepository) {
    super(logger);
    this.orderDetailsRepository = orderDetailsRepository;
  }

  addOrderDetails(orderId, items) {
    return this.wrapAsync("addOrderDetails", async () => {
      const detailsData = items.map((item) => ({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.price * item.quantity,
      }));

      return this.orderDetailsRepository.createManyOrderDetails(detailsData);
    });
  }

  getOrderDetails(orderId) {
    return this.wrapAsync("getOrderDetails", async () => {
      return this.orderDetailsRepository.getOrderDetailsByOrderId(orderId);
    });
  }

  getOrderDetailById(id) {
    return this.wrapAsync("getOrderDetailById", async () => {
      return this.orderDetailsRepository.getOrderDetailById(this.parseId(id));
    });
  }

  updateOrderDetail(id, updateData) {
    return this.wrapAsync("updateOrderDetail", async () => {
      return this.orderDetailsRepository.updateOrderDetail(
        this.parseId(id),
        updateData
      );
    });
  }

  removeOrderDetail(id) {
    return this.wrapAsync("removeOrderDetail", async () => {
      return this.orderDetailsRepository.deleteOrderDetail(this.parseId(id));
    });
  }

  removeAllDetailsForOrder(orderId) {
    return this.wrapAsync("removeAllDetailsForOrder", async () => {
      return this.orderDetailsRepository.deleteOrderDetailsByOrderId(orderId);
    });
  }
}
