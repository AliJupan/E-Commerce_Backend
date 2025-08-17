class ProductRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
    this.productIncludes = {
      pictures: true,
      addedBy: { select: { id: true } },
    };
  }

  async createProduct(data) {
    const prepared = {
      ...data,
      price: data.price !== undefined ? parseFloat(data.price) : undefined,
      quantity:
        data.quantity !== undefined ? parseInt(data.quantity, 10) : undefined,
      addedById:
        data.addedById !== undefined ? parseInt(data.addedById, 10) : undefined,
    };

    const product = await this.prisma.product.create({ data: prepared });
    return product;
  }

  async getProductById(productId) {
    const id = parseInt(productId, 10);
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: this.productIncludes,
    });
    return product;
  }

  async getAllProducts({ page = 1, limit = 10, where = {} } = {}) {
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const products = await this.prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        category: true,
        price: true,
        pictures: {
          where: { isThumbnail: true },
          select: { url: true },
        },
      },
    });
    return products;
  }

  async updateProduct(productId, data) {
    const id = parseInt(productId, 10);
    const updated = await this.prisma.product.update({
      where: { id },
      data,
      include: this.productIncludes,
    });
    return updated;
  }

  async deleteProduct(productId) {
    const id = parseInt(productId, 10);
    const deleted = await this.prisma.product.delete({ where: { id } });
    return deleted;
  }

  async getProductsByUser(userId, { page = 1, limit = 10 } = {}) {
    const id = parseInt(userId, 10);
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const products = await this.prisma.product.findMany({
      where: { addedById: id },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: this.productIncludes,
    });
    return products;
  }
}

export default ProductRepository;
