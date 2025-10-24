import path from "path";

class ProductService {
  constructor(productRepository, pictureService, logger) {
    this.productRepository = productRepository;
    this.pictureService = pictureService;
    this.logger = logger;
  }

  normalizeFilters(filters = {}) {
    if (filters.page) filters.page = parseInt(filters.page);
    if (filters.limit) filters.limit = parseInt(filters.limit);
    if (filters.maxPrice) filters.maxPrice = parseFloat(filters.maxPrice);
    if (filters.minPrice) filters.minPrice = parseFloat(filters.minPrice);
    return filters;
  }

  async handlePictures(productId, addedById, pictures, thumbnail) {
    try {
      if (thumbnail) {
        await this.pictureService.uploadAndSavePicture(
          thumbnail,
          productId,
          true,
          addedById
        );
      }
      const picturesArray = Array.isArray(pictures) ? pictures : [pictures];
      for (const picture of picturesArray) {
        if (picture) {
          await this.pictureService.uploadAndSavePicture(
            picture,
            productId,
            false,
            addedById
          );
        }
      }
      this.logger?.info({
        module: "ProductService",
        fn: "handlePictures",
        message: "Handled product pictures",
        productId,
        addedById,
        pictureCount: picturesArray.length + (thumbnail ? 1 : 0),
      });
    } catch (error) {
      this.logger?.error({
        module: "ProductService",
        fn: "handlePictures",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async createProduct(data, pictures, thumbnail) {
    try {
      data.price = parseFloat(data.price);
      data.quantity = parseInt(data.quantity);
      data.addedById = parseInt(data.addedById);
      const product = await this.productRepository.createProduct(data);
      await this.handlePictures(
        parseInt(product.id),
        data.addedById,
        pictures,
        thumbnail
      );

      this.logger?.info({
        module: "ProductService",
        fn: "createProduct",
        message: "Product created successfully",
        productId: product.id,
      });

      return product;
    } catch (error) {
      this.logger?.error({
        module: "ProductService",
        fn: "createProduct",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const product = await this.productRepository.getProductById(
        parseInt(productId)
      );

      this.logger?.info({
        module: "ProductService",
        fn: "getProductById",
        message: "Fetched product by ID",
        productId: productId,
      });

      return product;
    } catch (error) {
      this.logger?.error({
        module: "ProductService",
        fn: "getProductById",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async listAllProducts(filters = {}) {
    try {
      const normalized = this.normalizeFilters(filters);
      const products = await this.productRepository.getAllProducts(normalized);

      this.logger?.info({
        module: "ProductService",
        fn: "listAllProducts",
        message: "Listed all products",
        count: products.length,
      });

      return products;
    } catch (error) {
      this.logger?.error({
        module: "ProductService",
        fn: "listAllProducts",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async updateProduct(productId, data, pictures, thumbnail, addedById) {
    try {
      if (thumbnail) {
        const oldThumbnails = await this.pictureService.getThumbnailByProductId(
          parseInt(productId)
        );
        for (const oldThumbnail of oldThumbnails) {
          await this.pictureService.toggleIsThumbnail(
            parseInt(oldThumbnail.id)
          );
        }
      }

      await this.handlePictures(
        parseInt(productId),
        parseInt(addedById),
        pictures,
        thumbnail
      );

      const updated = await this.productRepository.updateProduct(
        parseInt(productId),
        data || {}
      );

      this.logger?.info({
        module: "ProductService",
        fn: "updateProduct",
        message: "Product updated successfully",
        productId: productId,
      });

      return updated;
    } catch (error) {
      this.logger?.error({
        module: "ProductService",
        fn: "updateProduct",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      await this.pictureService.deletePicturesByProductId(parseInt(productId));
      await this.productRepository.deleteProduct(parseInt(productId));

      this.logger?.info({
        module: "ProductService",
        fn: "deleteProduct",
        message: "Product deleted successfully",
        productId: productId,
      });

      return true;
    } catch (error) {
      this.logger?.error({
        module: "ProductService",
        fn: "deleteProduct",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getProductsByUser(userId, filters = {}) {
    try {
      const normalized = this.normalizeFilters(filters);
      const products = await this.productRepository.getProductsByUser(
        parseInt(userId),
        normalized
      );

      this.logger?.info({
        module: "ProductService",
        fn: "getProductsByUser",
        message: "Fetched products by user",
        userId: userId,
        count: products.length,
      });

      return products;
    } catch (error) {
      this.logger?.error({
        module: "ProductService",
        fn: "getProductsByUser",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async updateProductQuantity(productId, quantityOrdered) {
    try {
      const product = await this.productRepository.getProductById(
        parseInt(productId)
      );
      if (!product) throw new Error(`Product with ID ${productId} not found`);

      const newQuantity = product.quantity - quantityOrdered;
      if (newQuantity < 0) throw new Error("Quantity cannot be negative");

      const updated = await this.productRepository.updateProduct(
        parseInt(productId),
        {
          quantity: newQuantity,
        }
      );

      this.logger?.info({
        module: "ProductService",
        fn: "updateProductQuantity",
        message: "Product quantity updated",
        productId: productId,
        quantity: newQuantity,
      });

      return updated;
    } catch (error) {
      this.logger?.error({
        module: "ProductService",
        fn: "updateProductQuantity",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getProductsByIds(productIds) {
    try {
      const products = [];
      for (const id of productIds) {
        const product = await this.getProductById(id);
        if (product) products.push(product);
      }

      this.logger?.info({
        module: "ProductService",
        fn: "getProductsByIds",
        message: "Fetched products by IDs",
        count: products.length,
      });

      return products;
    } catch (error) {
      this.logger?.error({
        module: "ProductService",
        fn: "getProductsByIds",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}

export default ProductService;
