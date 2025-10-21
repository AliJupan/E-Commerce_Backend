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
  // 🔹 Get all users (Admin or Super Admin)
  router.get(
    "/",
    authenticationMiddleware.authenticate(),
    roleMiddleware.isAdminOrSuperAdmin(),
    userController.getAllUsers()
  );

  // 🔹 Get single user by ID (Authorized)
  router.get(
    "/:id",
    authenticationMiddleware.authenticate(),
    userMiddleware.authorize(),
    userController.getUserById()
  );

  // 🔹 Update user (Authorized)
  router.put(
    "/update/:id",
    authenticationMiddleware.authenticate(),
    userMiddleware.authorize(),
    userValidator.validateUpdateUser(),
    userController.updateUser()
  );

  // 🔹 Promote user to Super Admin (Only Super Admins)
  router.put(
    "/make-super-admin/:id",
    authenticationMiddleware.authenticate(),
    superAdminMiddleware.authorize(),
    userController.promoteToSuperAdmin()
  );

  // 🔹 Disable user (Admin or Super Admin)
  router.put(
    "/disable/:id",
    authenticationMiddleware.authenticate(),
    roleMiddleware.isAdminOrSuperAdmin(),
    userController.disableUser()
  );

  // 🔹 Delete user (Only Super Admins)
  router.delete(
    "/:id",
    authenticationMiddleware.authenticate(),
    superAdminMiddleware.authorize(),
    userController.deleteUser()
  );

  return router;
};

export default userRoutes;
