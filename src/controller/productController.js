class ProductController {
  constructor(productService, logger) {
    this.productService = productService;
    this.logger = logger;
  }

  validateImageType(file) {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    return validTypes.includes(file.mimetype);
  }

  validateFiles(pictures = [], thumbnail = null) {
    if (!Array.isArray(pictures)) pictures = [pictures];

    for (const pic of pictures) {
      if (!this.validateImageType(pic)) {
        return `Invalid file type for ${pic.name}. Only JPEG, PNG, and GIF are allowed.`;
      }
    }

    if (thumbnail) {
      if (Array.isArray(thumbnail)) {
        return "Only one thumbnail file is allowed.";
      }
      if (!this.validateImageType(thumbnail)) {
        return `Invalid file type for ${thumbnail.name}. Only JPEG, PNG, and GIF are allowed.`;
      }
    }

    return null;
  }

  createProduct() {
    return [
      async (req, res) => {
        try {
          const data = req.body;
          let pictures = req.files?.pictures || [];
          const thumbnail = req.files?.thumbnail || null;
          data.addedById = req.user.id;

          const validationError = this.validateFiles(pictures, thumbnail);
          if (validationError) {
            return res.status(400).json({ message: validationError });
          }

          const product = await this.productService.createProduct(
            data,
            pictures,
            thumbnail
          );

          if (!product) {
            this.logger.error({
              module: "ProductController",
              fn: "createProduct",
              message: "Failed to create product",
              addedById: data.addedById,
            });
            return res.status(500).json({ error: "Failed to create product" });
          }

          this.logger.info({
            module: "ProductController",
            fn: "createProduct",
            message: "Product created successfully",
            name: data.name,
            addedById: data.addedById,
          });

          res.status(201).json(product);
        } catch (error) {
          this.logger.error({
            module: "ProductController",
            fn: "createProduct",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }

  getProductById() {
    return [
      async (req, res) => {
        try {
          const { id } = req.params;
          const product = await this.productService.getProductById(id);

          if (!product) {
            this.logger.error({
              module: "ProductController",
              fn: "getProductById",
              message: "Product not found",
              productId: id,
            });
            return res.status(404).json({ error: "Product not found" });
          }

          this.logger.info({
            module: "ProductController",
            fn: "getProductById",
            message: "Product fetched successfully",
            productId: id,
          });

          res.status(200).json(product);
        } catch (error) {
          this.logger.error({
            module: "ProductController",
            fn: "getProductById",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }

  getAllProducts() {
    return [
      async (req, res) => {
        try {
          const filters = req.query;
          const result = await this.productService.listAllProducts(filters);

          this.logger.info({
            module: "ProductController",
            fn: "getAllProducts",
            message: "All products fetched",
            count: result.pagination?.total || result.length || 0,
          });

          res.status(200).json(result);
        } catch (error) {
          this.logger.error({
            module: "ProductController",
            fn: "getAllProducts",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }

  updateProduct() {
    return [
      async (req, res) => {
        try {
          const { id } = req.params;
          const data = req.body;
          let pictures = req.files?.pictures || [];
          const thumbnail = req.files?.thumbnail || null;

          const validationError = this.validateFiles(pictures, thumbnail);
          if (validationError) {
            return res.status(400).json({ message: validationError });
          }

          const updated = await this.productService.updateProduct(
            id,
            data,
            pictures,
            thumbnail,
            req.user.id
          );

          if (!updated) {
            this.logger.error({
              module: "ProductController",
              fn: "updateProduct",
              message: "Product update failed",
              productId: id,
            });
            return res
              .status(404)
              .json({ error: "Product not found or update failed" });
          }

          this.logger.info({
            module: "ProductController",
            fn: "updateProduct",
            message: "Product updated successfully",
            productId: id,
          });

          res.status(200).json(updated);
        } catch (error) {
          this.logger.error({
            module: "ProductController",
            fn: "updateProduct",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }

  deleteProduct() {
    return [
      async (req, res) => {
        try {
          const { id } = req.params;
          const deleted = await this.productService.deleteProduct(id);

          if (!deleted) {
            this.logger.error({
              module: "ProductController",
              fn: "deleteProduct",
              message: "Product delete failed",
              productId: id,
            });
            return res
              .status(404)
              .json({ error: "Product not found or delete failed" });
          }

          this.logger.info({
            module: "ProductController",
            fn: "deleteProduct",
            message: "Product deleted successfully",
            productId: id,
          });

          res.status(200).json({ message: "Product deleted successfully" });
        } catch (error) {
          this.logger.error({
            module: "ProductController",
            fn: "deleteProduct",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }

  getProductsByUser() {
    return [
      async (req, res) => {
        try {
          const { userId } = req.params;
          const filters = req.query;
          const products = await this.productService.getProductsByUser(
            userId,
            filters
          );

          this.logger.info({
            module: "ProductController",
            fn: "getProductsByUser",
            message: "Fetched products by user",
            userId,
            count: products.length,
          });

          res.status(200).json(products);
        } catch (error) {
          this.logger.error({
            module: "ProductController",
            fn: "getProductsByUser",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }
}

export default ProductController;
