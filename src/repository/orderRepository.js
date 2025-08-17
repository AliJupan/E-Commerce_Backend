class OrderRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createOrder(data) {
    return this.prisma.order.create({
      data,
      include: {
        orderDetails: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                category: true,
              },
            },
          },
        },
        invoice: true,
      },
    });
  }

  async getOrderById(id) {
    return this.prisma.order.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        orderDetails: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                category: true,
              },
            },
          },
        },
        invoice: true,
      },
    });
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        orderDetails: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                category: true,
              },
            },
          },
        },
        invoice: true,
      },
    });
  }

  async updateOrder(id, data) {
    return this.prisma.order.update({
      where: { id: parseInt(id, 10) },
      data,
      include: {
        orderDetails: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                category: true,
              },
            },
          },
        },
        invoice: true,
      },
    });
  }

  async deleteOrder(id) {
    return this.prisma.order.delete({
      where: { id: parseInt(id, 10) },
    });
  }
}

export default OrderRepository;
