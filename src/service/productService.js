import BaseService from "./BaseService.js";

class ProductService extends BaseService {
  constructor(productRepository, pictureService, logger) {
    super(logger);
    this.productRepository = productRepository;
    this.pictureService = pictureService;
  }

  normalizeFilters(filters) {
    if (filters.page) filters.page = parseInt(filters.page);
    if (filters.limit) filters.limit = parseInt(filters.limit);
    if (filters.maxPrice) filters.maxPrice = parseFloat(filters.maxPrice);
    if (filters.minPrice) filters.minPrice = parseFloat(filters.minPrice);
    return filters;
  }

  async handlePictures(productId, addedById, pictures, thumbnail) {
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
  }

  createProduct(data, pictures, thumbnail) {
    return this.wrapAsync("createProduct", async () => {
      const product = await this.productRepository.createProduct(data);
      await this.handlePictures(
        product.id,
        data.addedById,
        pictures,
        thumbnail
      );
      return product;
    });
  }

  getProductById(productId) {
    return this.wrapAsync("getProductById", () =>
      this.productRepository.getProductById(this.parseId(productId))
    );
  }

  listAllProducts(filters) {
    return this.wrapAsync("listAllProducts", () =>
      this.productRepository.getAllProducts(this.normalizeFilters(filters))
    );
  }

  updateProduct(id, data, pictures, thumbnail, addedById) {
    return this.wrapAsync("updateProduct", async () => {
      const parsedId = this.parseId(id);
      const parsedAddedById = this.parseId(addedById);
      if (thumbnail) {
        const oldThumbnails = await this.pictureService.getThumbnailByProductId(
          parsedId
        );
        for (const oldThumbnail of oldThumbnails) {
          await this.pictureService.toggleIsThumbnail(oldThumbnail.id);
        }
      }
      await this.handlePictures(parsedId, parsedAddedById, pictures, thumbnail);
      return this.productRepository.updateProduct(parsedId, data || {});
    });
  }

  deleteProduct(productId) {
    return this.wrapAsync("deleteProduct", async () => {
      const parsedId = this.parseId(productId);
      await this.pictureService.deletePicturesByProductId(parsedId);
      return this.productRepository.deleteProduct(parsedId);
    });
  }

  getProductsByUser(userId, filters = {}) {
    return this.wrapAsync("getProductsByUser", () =>
      this.productRepository.getProductsByUser(
        this.parseId(userId),
        this.normalizeFilters(filters)
      )
    );
  }

  async updateProductQuantity(productId, quantityOrdered) {
    return this.wrapAsync("updateProductQuantity", async () => {
      const product = await this.productRepository.getProductById(productId);
      if (!product) throw new Error(`Product with ID ${productId} not found`);

      const newQuantity = product.quantity - quantityOrdered;
      if (newQuantity < 0) throw new Error("Quantity cannot be negative");

      return this.productRepository.updateProduct(productId, {
        quantity: newQuantity,
      });
    });
  }

  async getProductsByIds(productIds) {
    const products = [];
    for (const id of productIds) {
      const product = await this.getProductById(id);
      if (product) {
        products.push(product);
      }
    }
    return products;
  }
}

export default ProductService;
