import express from "express";

const router = express.Router();

const orderRoutes = (
  orderController,
  authenticationMiddleware,
  roleMiddleware,
  orderValidator
) => {
  router.post(
    "/",
    [
      // authenticationMiddleware.authenticate(),
      orderValidator.validateCreateOrder(),
    ],
    orderController.createOrder()
  );
  router.get(
    "/",
    [
      authenticationMiddleware.authenticate(),
      roleMiddleware.isAdminOrSuperAdmin(),
    ],
    orderController.getAllOrders()
  );
  router.get(
    "/:id",
    [
      authenticationMiddleware.authenticate(),
      roleMiddleware.isAdminOrSuperAdmin(),
    ],
    orderController.getOrderById()
  );
  router.get(
    "/user/me",
    [
      authenticationMiddleware.authenticate(),
    ],
    orderController.getOrdersByUserId()
  );
  router.put(
    "/update/:id",
    [
      authenticationMiddleware.authenticate(),
      roleMiddleware.isAdminOrSuperAdmin(),
      orderValidator.validateUpdateOrder(),
    ],
    orderController.updateOrder()
  );
  router.delete(
    "/:id",
    [
      authenticationMiddleware.authenticate(),
      roleMiddleware.isAdminOrSuperAdmin(),
    ],
    orderController.deleteOrder()
  );

  return router;
};

export default orderRoutes;
