import BaseController from "./BaseController.js";

class ProductController extends BaseController {
  constructor(productService, logger) {
    super(logger, "ProductController");
    this.productService = productService;
  }

  validateDocumentType(file) {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    return validTypes.includes(file.mimetype);
  }

  createProduct() {
    return this.handleRequest("createProduct", async (req) => {
      const data = req.body;
      let pictures = req.files?.pictures || [];
      const thumbnail = req.files?.thumbnail || null;
      data.addedById = req.user.id;

      if (!Array.isArray(pictures)) pictures = [pictures];

      for (const pic of pictures) {
        if (!this.validateDocumentType(pic)) {
          return {
            status: 400,
            data: {
              error: `Invalid file type for ${pic.name}. Only JPEG, PNG, and GIF are allowed.`,
            },
          };
        }
      }

      if (thumbnail) {
        if (Array.isArray(thumbnail)) {
          return {
            status: 400,
            data: { error: "Only one thumbnail file is allowed." },
          };
        }
        if (!this.validateDocumentType(thumbnail)) {
          return {
            status: 400,
            data: {
              error: `Invalid file type for ${thumbnail.name}. Only JPEG, PNG, and GIF are allowed.`,
            },
          };
        }
      }

      const product = await this.productService.createProduct(
        data,
        pictures,
        thumbnail
      );

      this.logInfo("createProduct", "Product created successfully", {
        name: data.name,
        addedById: data.addedById,
      });

      return { status: 201, data: product };
    });
  }

  getProductById() {
    return this.handleRequest("getProductById", async (req) => {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);

      this.logInfo("getProductById", "Fetched product by ID", {
        productId: id,
      });
      return { data: product };
    });
  }

  getAllProducts() {
    return this.handleRequest("getAllProducts", async (req) => {
      const filters = req.query;
      const result = await this.productService.listAllProducts(filters);

      this.logInfo("getAllProducts", "All products fetched", {
        count: result.pagination.total,
      });

      return result;
    });
  }

  updateProduct() {
    return this.handleRequest("updateProduct", async (req) => {
      const { id } = req.params;
      const data = req.body;
      let pictures = req.files?.pictures || [];
      const thumbnail = req.files?.thumbnail || null;

      if (!Array.isArray(pictures)) pictures = [pictures];

      for (const pic of pictures) {
        if (!this.validateDocumentType(pic)) {
          return {
            status: 400,
            data: {
              error: `Invalid file type for ${pic.name}. Only JPEG, PNG, and GIF are allowed.`,
            },
          };
        }
      }

      if (thumbnail) {
        if (Array.isArray(thumbnail)) {
          return {
            status: 400,
            data: { error: "Only one thumbnail file is allowed." },
          };
        }
        if (!this.validateDocumentType(thumbnail)) {
          return {
            status: 400,
            data: {
              error: `Invalid file type for ${thumbnail.name}. Only JPEG, PNG, and GIF are allowed.`,
            },
          };
        }
      }

      const updated = await this.productService.updateProduct(
        id,
        data,
        pictures,
        thumbnail,
        req.user.id
      );

      this.logInfo("updateProduct", "Product updated successfully", {
        productId: id,
      });

      return { data: updated };
    });
  }

  deleteProduct() {
    return this.handleRequest("deleteProduct", async (req) => {
      const { id } = req.params;
      await this.productService.deleteProduct(id);

      this.logInfo("deleteProduct", "Product deleted successfully", {
        productId: id,
      });

      return { data: { message: `Product ${id} deleted successfully` } };
    });
  }

  getProductsByUser() {
    return this.handleRequest("getProductsByUser", async (req) => {
      const { userId } = req.params;
      const filters = req.query;
      const products = await this.productService.getProductsByUser(
        userId,
        filters
      );

      this.logInfo("getProductsByUser", "Fetched products by user", {
        userId,
        count: products.length,
      });

      return { data: products };
    });
  }
}

export default ProductController;
