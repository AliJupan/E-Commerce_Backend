import express from "express";

const router = express.Router();

const userRoutes = (
  userController,
  authenticationMiddleware,
  roleMiddleware,
  userMiddleware,
  superAdminMiddleware,
//   adminMiddleware,
  userValidator
) => {
  router.post(
    "/login",
    [userValidator.validateUserLogin()],
    userController.login()
  );
  router.post(
    "/",
    [
      authenticationMiddleware.authenticate(),
      roleMiddleware.isAdminOrSuperAdmin(),
      userValidator.validateUserRegistration(),
    ],
    userController.registerUser()
  );

  router.get(
    "/",
    [
      authenticationMiddleware.authenticate(),
      roleMiddleware.isAdminOrSuperAdmin(),
    ],
    userController.getAllUsers()
  );
  router.get(
    "/:id",
    [authenticationMiddleware.authenticate(), userMiddleware.authorize()],
    userController.getUserById()
  );

  router.put(
    "/update/:id",
    [
      authenticationMiddleware.authenticate(),
      userMiddleware.authorize(),
      userValidator.validateUpdateUser(),
    ],
    userController.updateUser()
  );
//   router.put(
//     "/make-admin/:id",
//     [authenticationMiddleware.authenticate(), adminMiddleware.authorize()],
//     userController.promoteToAdmin()
//   );
  router.put(
    "/make-super-admin/:id",
    [authenticationMiddleware.authenticate(), superAdminMiddleware.authorize()],
    userController.promoteToSuperAdmin()
  );
  router.put(
    "/change-password",
    [
      authenticationMiddleware.authenticate(),
      userMiddleware.verifyEmailMatchFromToken(),
    ],
    userController.changePassword()
  );
  router.post("/forgot-password", userController.forgotPassword());
  router.put(
    "/reset-password",
    [authenticationMiddleware.authenticate()],
    userController.resetPassword()
  );
  router.put(
    "/disable/:id",
    [
      authenticationMiddleware.authenticate(),
      roleMiddleware.isAdminOrSuperAdmin(),
    ],
    userController.disableUser()
  );

  router.delete(
    "/:id",
    [authenticationMiddleware.authenticate(), superAdminMiddleware.authorize()],
    userController.deleteUser()
  );

  return router;
};

export default userRoutes;
