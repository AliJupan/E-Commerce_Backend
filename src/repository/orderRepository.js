class OrderRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createOrder(data) {
    try {
      return await this.prisma.order.create({
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
    } catch (error) {
      throw new Error("Failed to create order");
    }
  }

  async getOrderById(id) {
    try {
      return await this.prisma.order.findUnique({
        where: { id },
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
    } catch (error) {
      throw new Error("Failed to fetch order by ID");
    }
  }

  async getOrdersByUserId(userId) {
    try {
      return await this.prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
          orderDetails: {
            include: {
              product: {
                select: { id: true, name: true, price: true, category: true },
              },
            },
          },
          invoice: true,
        },
      });
    } catch (error) {
      throw new Error("Failed to fetch orders for user");
    }
  }

  async getAllOrders() {
    try {
      return await this.prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          orderDetails: {
            include: {
              product: {
                select: { id: true, name: true, price: true, category: true },
              },
            },
          },
          invoice: true,
        },
      });
    } catch (error) {
      throw new Error("Failed to fetch all orders");
    }
  }

  async updateOrder(id, data) {
    try {
      return await this.prisma.order.update({
        where: { id },
        data,
        include: {
          orderDetails: {
            include: {
              product: {
                select: { id: true, name: true, price: true, category: true },
              },
            },
          },
          invoice: true,
        },
      });
    } catch (error) {
      throw new Error("Failed to update order");
    }
  }

  async deleteOrder(id) {
    try {
      return await this.prisma.order.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error("Failed to delete order");
    }
  }
}

export default OrderRepository;
