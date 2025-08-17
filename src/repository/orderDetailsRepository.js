export default class OrderDetailsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createOrderDetail(data) {
    return this.prisma.orderDetails.create({
      data,
    });
  }

  async createManyOrderDetails(detailsArray) {
    return this.prisma.orderDetails.createMany({
      data: detailsArray,
    });
  }

  async getOrderDetailById(id) {
    return this.prisma.orderDetails.findUnique({
      where: { id },
      include: { product: true, order: true },
    });
  }

  async getOrderDetailsByOrderId(orderId) {
    return this.prisma.orderDetails.findMany({
      where: { orderId },
      include: { product: true },
    });
  }

  async updateOrderDetail(id, data) {
    return this.prisma.orderDetails.update({
      where: { id },
      data,
    });
  }

  async deleteOrderDetail(id) {
    return this.prisma.orderDetails.delete({
      where: { id },
    });
  }

  async deleteOrderDetailsByOrderId(orderId) {
    return this.prisma.orderDetails.deleteMany({
      where: { orderId },
    });
  }
}
