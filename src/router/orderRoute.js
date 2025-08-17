import express from "express";

const router = express.Router();

const orderRoutes = (
  orderController,
  authenticationMiddleware,
  roleMiddleware,
  orderValidator
) => {
  // Create a new order (only authenticated users can do this)
  router.post(
    "/",
    [
      authenticationMiddleware.authenticate(),
      orderValidator.validateCreateOrder(),
    ],
    orderController.createOrder()
  );

  // Get all orders (only admins or super admins)
  router.get(
    "/",
    [
      authenticationMiddleware.authenticate(),
      roleMiddleware.isAdminOrSuperAdmin(),
    ],
    orderController.getAllOrders()
  );

  // Get order by ID (admins or the owner can view)
  router.get(
    "/:id",
    [
      authenticationMiddleware.authenticate(),
      roleMiddleware.isAdminOrSuperAdmin(),
    ],
    orderController.getOrderById()
  );

  // Update order
  router.put(
    "/update/:id",
    [
      authenticationMiddleware.authenticate(),
      roleMiddleware.isAdminOrSuperAdmin(),
      orderValidator.validateUpdateOrder(),
    ],
    orderController.updateOrder()
  );

  // Delete order
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
