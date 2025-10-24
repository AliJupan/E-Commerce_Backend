import express from "express";

const router = express.Router();

const userRoutes = (
  userController,
  authenticationMiddleware,
  roleMiddleware,
  userMiddleware,
  superAdminMiddleware,
  userValidator
) => {
  router.get(
    "/",
    authenticationMiddleware.authenticate(),
    roleMiddleware.isAdminOrSuperAdmin(),
    userController.getAllUsers()
  );

  router.get(
    "/:id",
    authenticationMiddleware.authenticate(),
    userMiddleware.authorize(),
    userController.getUserById()
  );

  router.put(
    "/make-super-admin/:id",
    authenticationMiddleware.authenticate(),
    superAdminMiddleware.authorize(),
    userController.promoteToSuperAdmin()
  );

  router.put(
    "/disable/:id",
    authenticationMiddleware.authenticate(),
    roleMiddleware.isAdminOrSuperAdmin(),
    userController.disableUser()
  );

  router.delete(
    "/:id",
    authenticationMiddleware.authenticate(),
    superAdminMiddleware.authorize(),
    userController.deleteUser()
  );

  return router;
};

export default userRoutes;
