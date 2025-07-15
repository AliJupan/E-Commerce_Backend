class ProductService {
  constructor(productRepository, pictureService, logger) {
    this.productRepository = productRepository;
    this.logger = logger;
    this.pictureService = pictureService;
  }

  async createProduct(data, pictures, thumbnail) {
    try {
      const product = await this.productRepository.createProduct(data);

      if (thumbnail) {
        await this.pictureService.uploadAndSavePicture(
          thumbnail,
          product.id,
          true,
          data.addedById
        );
      }

      const picturesArray = Array.isArray(pictures) ? pictures : [pictures];
      for (const picture of picturesArray) {
        if (picture) {
          await this.pictureService.uploadAndSavePicture(
            picture,
            product.id,
            false,
            data.addedById
          );
        }
      }

      this.logger.info({
        module: "ProductService",
        fn: "createProduct",
        message: "Product created successfully",
        addedById: data.addedById,
      });
      return product;
    } catch (error) {
      this.logger.error({
        module: "ProductService",
        fn: "createProduct",
        message: error.message,
      });
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const product = await this.productRepository.getProductById(productId);
      this.logger.info({
        module: "ProductService",
        fn: "getProductById",
        message: "Fetched product by ID",
        productId,
      });
      return product;
    } catch (error) {
      this.logger.error({
        module: "ProductService",
        fn: "getProductById",
        message: error.message,
        productId,
      });
      throw error;
    }
  }

  async listAllProducts(filters) {
    try {
      if (filters.page) filters.page = parseInt(filters.page);
      if (filters.limit) filters.limit = parseInt(filters.limit);

      const products = await this.productRepository.getAllProducts(filters);

      this.logger.info({
        module: "ProductService",
        fn: "listAllProducts",
        message: "Fetched all products",
        count: products.length,
      });

      return products;
    } catch (error) {
      this.logger.error({
        module: "ProductService",
        fn: "listAllProducts",
        message: error.message,
      });
      throw error;
    }
  }

  async updateProduct(productId, data) {
    try {
      const updated = await this.productRepository.updateProduct(
        productId,
        data
      );
      this.logger.info({
        module: "ProductService",
        fn: "updateProduct",
        message: "Product updated successfully",
        productId,
      });
      return updated;
    } catch (error) {
      this.logger.error({
        module: "ProductService",
        fn: "updateProduct",
        message: error.message,
        productId,
      });
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      const deleted = await this.productRepository.deleteProduct(productId);
      this.logger.info({
        module: "ProductService",
        fn: "deleteProduct",
        message: "Product deleted successfully",
        productId,
      });
      return deleted;
    } catch (error) {
      this.logger.error({
        module: "ProductService",
        fn: "deleteProduct",
        message: error.message,
        productId,
      });
      throw error;
    }
  }

  async getProductsByUser(userId, filters = {}) {
    try {
      if (filters.page) filters.page = parseInt(filters.page);
      if (filters.limit) filters.limit = parseInt(filters.limit);

      const products = await this.productRepository.getProductsByUser(
        userId,
        filters
      );

      this.logger.info({
        module: "ProductService",
        fn: "getProductsByUser",
        message: "Fetched products by user ID",
        userId,
        count: products.length,
      });

      return products;
    } catch (error) {
      this.logger.error({
        module: "ProductService",
        fn: "getProductsByUser",
        message: error.message,
        userId,
      });
      throw error;
    }
  }
}

export default ProductService;
