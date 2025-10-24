import express from "express";

const router = express.Router();

const authRoutes = (
  authController,
  authenticationMiddleware,
  userMiddleware,
  userValidator
) => {
  router.post(
    "/register",
    userValidator.validateUserRegistration(),
    authController.register()
  );

  router.post(
    "/login",
    userValidator.validateUserLogin(),
    authController.login()
  );

  router.get(
    "/profile/me",
    authenticationMiddleware.authenticate(),
    userMiddleware.authorize(),
    authController.getUserById()
  );

  router.put(
    "/update/me",
    authenticationMiddleware.authenticate(),
    userMiddleware.authorize(),
    authController.updateUser()
  );

  router.post("/forgot-password", authController.forgotPassword());

  router.put(
    "/reset-password",
    authenticationMiddleware.authenticate(),
    authController.resetPassword()
  );

  router.put(
    "/change-password",
    authenticationMiddleware.authenticate(),
    userMiddleware.verifyEmailMatchFromToken(),
    authController.changePassword()
  );

  return router;
};

export default authRoutes;
