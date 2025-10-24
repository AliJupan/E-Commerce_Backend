export default class OrderDetailsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createOrderDetail(data) {
    try {
      return await this.prisma.orderDetails.create({ data });
    } catch (error) {
      throw new Error("Failed to create order detail");
    }
  }

  async createManyOrderDetails(detailsArray) {
    try {
      return await this.prisma.orderDetails.createMany({ data: detailsArray });
    } catch (error) {
      throw new Error("Failed to create multiple order details");
    }
  }

  async getOrderDetailById(id) {
    try {
      return await this.prisma.orderDetails.findUnique({
        where: { id },
        include: { product: true, order: true },
      });
    } catch (error) {
      throw new Error("Failed to fetch order detail by ID");
    }
  }

  async getOrderDetailsByOrderId(orderId) {
    try {
      return await this.prisma.orderDetails.findMany({
        where: { orderId },
        include: { product: true },
      });
    } catch (error) {
      throw new Error("Failed to fetch order details by order ID");
    }
  }

  async updateOrderDetail(id, data) {
    try {
      return await this.prisma.orderDetails.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error("Failed to update order detail");
    }
  }

  async deleteOrderDetail(id) {
    try {
      return await this.prisma.orderDetails.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error("Failed to delete order detail");
    }
  }

  async deleteOrderDetailsByOrderId(orderId) {
    try {
      return await this.prisma.orderDetails.deleteMany({
        where: { orderId },
      });
    } catch (error) {
      throw new Error("Failed to delete order details by order ID");
    }
  }
}
