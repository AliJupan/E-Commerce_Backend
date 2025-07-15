class ProductController {
  constructor(productService, logger) {
    this.productService = productService;
    this.logger = logger;
  }

  createProduct() {
    return [
      async (req, res) => {
        try {
          const data  = req.body;
          const pictures = req.files.pictures || [];
          const thumbnail = req.files.thumbnail || null;
          const product = await this.productService.createProduct(data, pictures, thumbnail);

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
            name: req.body.name,
          });

          res.status(500).json({ error: error.message });
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

          this.logger.info({
            module: "ProductController",
            fn: "getProductById",
            message: "Fetched product by ID",
            productId: id,
          });

          res.status(200).json(product);
        } catch (error) {
          this.logger.error({
            module: "ProductController",
            fn: "getProductById",
            message: error.message,
            productId: req.params.id,
          });

          res.status(500).json({ error: error.message });
        }
      },
    ];
  }

  getAllProducts() {
    return [
      async (req, res) => {
        try {
          const filters = req.query;
          const products = await this.productService.listAllProducts(filters);

          this.logger.info({
            module: "ProductController",
            fn: "getAllProducts",
            message: "All products fetched",
            count: products.length,
          });

          res.status(200).json(products);
        } catch (error) {
          this.logger.error({
            module: "ProductController",
            fn: "getAllProducts",
            message: error.message,
          });

          res.status(500).json({ error: error.message });
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

          const updated = await this.productService.updateProduct(id, data);

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
            productId: req.params.id,
          });

          res.status(500).json({ error: error.message });
        }
      },
    ];
  }

  deleteProduct() {
    return [
      async (req, res) => {
        try {
          const { id } = req.params;

          await this.productService.deleteProduct(id);

          this.logger.info({
            module: "ProductController",
            fn: "deleteProduct",
            message: "Product deleted successfully",
            productId: id,
          });

          res.status(200).json({ message: `Product ${id} deleted successfully` });
        } catch (error) {
          this.logger.error({
            module: "ProductController",
            fn: "deleteProduct",
            message: error.message,
            productId: req.params.id,
          });

          res.status(500).json({ error: error.message });
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

          const products = await this.productService.getProductsByUser(userId, filters);

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
            userId: req.params.userId,
          });

          res.status(500).json({ error: error.message });
        }
      },
    ];
  }
}

export default ProductController;
