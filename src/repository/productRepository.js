class ProductRepository {
  constructor(prismaClient, logger) {
    this.prisma = prismaClient;
    this.logger = logger;
  }

  async createProduct(data) {
    try {
      data.price = parseFloat(data.price);
      data.quantity = parseInt(data.quantity);
      data.addedById = parseInt(data.addedById);
      const product = await this.prisma.product.create({ data });
      this.logger.info({
        module: "ProductRepository",
        fn: "createProduct",
        message: "Product created successfully",
        name: data.name,
        addedById: data.addedById,
      });
      return product;
    } catch (error) {
      this.logger.error({
        module: "ProductRepository",
        fn: "createProduct",
        message: error.message,
        name: data.name,
      });
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const id = parseInt(productId);
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          pictures: true,
          addedBy: true,
        },
      });
      this.logger.info({
        module: "ProductRepository",
        fn: "getProductById",
        message: "Product fetched by ID",
        productId: id,
      });
      return product;
    } catch (error) {
      this.logger.error({
        module: "ProductRepository",
        fn: "getProductById",
        message: error.message,
        productId,
      });
      throw error;
    }
  }

  async getAllProducts({ page = 1, limit = 10 }) {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          quantity: {
            gt: 0,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          category: true,
          price: true,
          pictures: {
            where: {
              isThumbnail: true,
            },
            select: {
              url: true,
            },
          },
        },
      });

      this.logger.info({
        module: "ProductRepository",
        fn: "getAllProducts",
        message: "All products fetched",
        count: products.length,
      });

      return products;
    } catch (error) {
      this.logger.error({
        module: "ProductRepository",
        fn: "getAllProducts",
        message: error.message,
      });
      throw error;
    }
  }

  async updateProduct(productId, data) {
    try {
      const id = parseInt(productId);
      const product = await this.prisma.product.update({
        where: { id },
        data,
      });

      this.logger.info({
        module: "ProductRepository",
        fn: "updateProduct",
        message: "Product updated",
        productId: id,
      });

      return product;
    } catch (error) {
      this.logger.error({
        module: "ProductRepository",
        fn: "updateProduct",
        message: error.message,
        productId,
      });
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      const id = parseInt(productId);
      const product = await this.prisma.product.delete({ where: { id } });

      this.logger.info({
        module: "ProductRepository",
        fn: "deleteProduct",
        message: "Product deleted",
        productId: id,
      });

      return product;
    } catch (error) {
      this.logger.error({
        module: "ProductRepository",
        fn: "deleteProduct",
        message: error.message,
        productId,
      });
      throw error;
    }
  }

  async getProductsByUser(userId, { page = 1, limit = 10 }) {
    try {
      const id = parseInt(userId);
      const products = await this.prisma.product.findMany({
        where: { addedById: id },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      });

      this.logger.info({
        module: "ProductRepository",
        fn: "getProductsByUser",
        message: "Products by user fetched",
        userId: id,
        count: products.length,
      });

      return products;
    } catch (error) {
      this.logger.error({
        module: "ProductRepository",
        fn: "getProductsByUser",
        message: error.message,
        userId,
      });
      throw error;
    }
  }
}

export default ProductRepository;
