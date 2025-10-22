import express from "express";

const router = express.Router();

const authRoutes = (
  authController,
  authenticationMiddleware,
  userMiddleware,
  userValidator
) => {
  // 🔹 Register new user
  router.post(
    "/register",
    userValidator.validateUserRegistration(),
    authController.register()
  );

  // 🔹 Login existing user
  router.post(
    "/login",
    userValidator.validateUserLogin(),
    authController.login()
  );

  // 🔹 Get profile of authenticated user
  router.get(
    "/profile/me",
    authenticationMiddleware.authenticate(),
    userMiddleware.authorize(),
    authController.getUserById()
  );

  // 🔹 Forgot password (send reset email)
  router.post("/forgot-password", authController.forgotPassword());

  // 🔹 Reset password (authenticated)
  router.put(
    "/reset-password",
    authenticationMiddleware.authenticate(),
    authController.resetPassword()
  );

  // 🔹 Change password (verify email from token)
  router.put(
    "/change-password",
    authenticationMiddleware.authenticate(),
    userMiddleware.verifyEmailMatchFromToken(),
    authController.changePassword()
  );

  return router;
};

export default authRoutes;
