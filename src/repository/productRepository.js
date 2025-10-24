class ProductRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async createProduct(data) {
    try {
      return await this.prisma.product.create({ data });
    } catch (error) {
      throw new Error("Failed to create product");
    }
  }

  async getProductById(id) {
    try {
      return await this.prisma.product.findUnique({
        where: { id },
        include: { pictures: true, addedBy: { select: { id: true } } },
      });
    } catch (error) {
      throw new Error("Failed to fetch product by ID");
    }
  }

  async getAllProducts({
    page = 1,
    limit = 10,
    minPrice,
    maxPrice,
    category,
    search,
    isFeatured,
  } = {}) {
    try {
      const filters = {
        ...(category && { category }),
        ...(search && { OR: [{ name: { contains: search } }] }),
        ...(minPrice || maxPrice
          ? {
              price: {
                ...(minPrice && { gte: Number(minPrice) }),
                ...(maxPrice && { lte: Number(maxPrice) }),
              },
            }
          : {}),
        ...(isFeatured !== undefined && { isFeatured: isFeatured === "true" }),
      };

      const [products, totalCount, priceRange, categories] = await Promise.all([
        this.prisma.product.findMany({
          where: filters,
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
        }),
        this.prisma.product.count({ where: filters }),
        this.prisma.product.aggregate({
          _min: { price: true },
          _max: { price: true },
        }),
        this.prisma.product.findMany({
          select: { category: true },
          distinct: ["category"],
        }),
      ]);

      return {
        products,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
        filters: {
          min: priceRange._min.price,
          max: priceRange._max.price,
          categories: categories.map((c) => c.category),
        },
      };
    } catch (error) {
      throw new Error("Failed to fetch products");
    }
  }

  async updateProduct(id, data) {
    try {
      return await this.prisma.product.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error("Failed to update product");
    }
  }

  async deleteProduct(id) {
    try {
      return await this.prisma.product.delete({ where: { id } });
    } catch (error) {
      throw new Error("Failed to delete product");
    }
  }

  async getProductsByUser(id, { page = 1, limit = 10 } = {}) {
    try {
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);

      return await this.prisma.product.findMany({
        where: { addedById: id },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { pictures: true, addedBy: { select: { id: true } } },
      });
    } catch (error) {
      throw new Error("Failed to fetch products by user");
    }
  }
}

export default ProductRepository;
