import jwt from "jsonwebtoken";

class AuthController {
  constructor(authService, logger) {
    this.authService = authService;
    this.logger = logger;
  }

  register() {
    return [
      async (req, res) => {
        try {
          const data = req.body;
          const user = await this.authService.register(data);

          if (!user) {
            this.logger.warn({
              module: "AuthController",
              fn: "register",
              message: "Registration failed: Email already exists",
              email: data.email,
            });
            return res.status(400).json({ error: "Email already exists" });
          }

          this.logger.info({
            module: "AuthController",
            fn: "register",
            message: "User registered successfully",
            email: data.email,
          });

          res.status(201).json(user);
        } catch (error) {
          this.logger.error({
            module: "AuthController",
            fn: "register",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }

  login() {
    return [
      async (req, res) => {
        try {
          const { email, password } = req.body;
          const user = await this.authService.login(email, password, req);

          if (!user) {
            this.logger.warn({
              module: "AuthController",
              fn: "login",
              message: "Login failed: Invalid credentials",
              email,
            });
            return res.status(401).json({ error: "Invalid credentials" });
          }

          const token = jwt.sign(
            {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "24h" }
          );

          this.logger.info({
            module: "AuthController",
            fn: "login",
            message: "User logged in successfully",
            email,
          });

          res.status(200).json({ token });
        } catch (error) {
          this.logger.error({
            module: "AuthController",
            fn: "login",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }

  forgotPassword() {
    return [
      async (req, res) => {
        try {
          const { email } = req.body;
          const user = await this.authService.forgotPassword(email);

          if (!user) {
            this.logger.error({
              module: "AuthController",
              fn: "forgotPassword",
              message: "No user found for email",
              email,
            });
            return res
              .status(404)
              .json({ error: "No account found with that email" });
          }

          this.logger.info({
            module: "AuthController",
            fn: "forgotPassword",
            message: "Password reset token sent",
            email,
          });

          res
            .status(200)
            .json({ message: "Password reset token sent successfully" });
        } catch (error) {
          this.logger.error({
            module: "AuthController",
            fn: "forgotPassword",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }

  resetPassword() {
    return [
      async (req, res) => {
        try {
          const { token, newPassword } = req.body;
          const result = await this.authService.resetPassword(
            token,
            newPassword
          );

          if (!result) {
            this.logger.error({
              module: "AuthController",
              fn: "resetPassword",
              message: "Invalid or expired token",
              token,
            });
            return res.status(400).json({ error: "Invalid or expired token" });
          }

          this.logger.info({
            module: "AuthController",
            fn: "resetPassword",
            message: "Password reset successfully",
            token,
          });

          res
            .status(200)
            .json({ message: "Password has been reset successfully" });
        } catch (error) {
          this.logger.error({
            module: "AuthController",
            fn: "resetPassword",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }

  changePassword() {
    return [
      async (req, res) => {
        try {
          const { email, oldPassword, newPassword } = req.body;
          const result = await this.authService.changePassword(
            email,
            oldPassword,
            newPassword
          );

          if (!result) {
            this.logger.error({
              module: "AuthController",
              fn: "changePassword",
              message: "Invalid credentials or update failed",
              email,
            });
            return res
              .status(400)
              .json({ error: "Old password is incorrect or update failed" });
          }

          this.logger.info({
            module: "AuthController",
            fn: "changePassword",
            message: "Password changed successfully",
            email,
          });

          res.status(200).json({ message: "Password changed successfully" });
        } catch (error) {
          this.logger.error({
            module: "AuthController",
            fn: "changePassword",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }

  getUserById() {
    return [
      async (req, res) => {
        try {
          const id = req.user.id;
          const user = await this.authService.getUserById(id);

          if (!user) {
            this.logger.error({
              module: "AuthController",
              fn: "getUserById",
              message: "User not found",
              id,
            });
            return res.status(404).json({ error: "User not found" });
          }

          this.logger.info({
            module: "AuthController",
            fn: "getUserById",
            message: "User fetched successfully",
            id,
          });

          res.status(200).json(user);
        } catch (error) {
          this.logger.error({
            module: "AuthController",
            fn: "getUserById",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }

  updateUser() {
    return [
      async (req, res) => {
        try {
          const id = req.user.id;
          const data = req.body;
          const updatedUser = await this.authService.updateUser(id, data);

          if (!updatedUser) {
            this.logger.error({
              module: "AuthController",
              fn: "updateUser",
              message: "User update failed or not found",
              id,
            });
            return res
              .status(404)
              .json({ error: "User not found or update failed" });
          }

          this.logger.info({
            module: "AuthController",
            fn: "updateUser",
            message: "User updated successfully",
            id,
          });

          res
            .status(200)
            .json({ message: "User updated successfully", user: updatedUser });
        } catch (error) {
          this.logger.error({
            module: "AuthController",
            fn: "updateUser",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }
}

export default AuthController;
