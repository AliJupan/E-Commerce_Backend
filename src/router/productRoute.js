import express from "express";

const router = express.Router();

const productRoutes = (
  productController,
  authenticationMiddleware,
  roleMiddleware,
  productValidator
) => {
  router.post(
    "/",
    [
      authenticationMiddleware.authenticate(),
      roleMiddleware.isAdminOrSuperAdmin(),
      productValidator.validateCreateProduct(),
    ],
    productController.createProduct()
  );

  router.get("/", productController.getAllProducts());

  router.get("/:id", productController.getProductById());

  router.put(
    "/update/:id",
    [
      authenticationMiddleware.authenticate(),
      roleMiddleware.isAdminOrSuperAdmin(),
      productValidator.validateUpdateProduct(),
    ],
    productController.updateProduct()
  );

  router.get(
    "/user/:userId",
    productController.getProductsByUser()
  );

  router.delete(
    "/:id",
    [
      authenticationMiddleware.authenticate(),
      roleMiddleware.isAdminOrSuperAdmin(),
    ],
    productController.deleteProduct()
  );

  return router;
};

export default productRoutes;
