import BaseController from "./BaseController.js";
import jwt from "jsonwebtoken";

class AuthController extends BaseController {
  constructor(authService, logger) {
    super(logger, "AuthController");
    this.authService = authService;
  }

  register() {
    return this.handleRequest("register", async (req) => {
      const data = req.body;
      const user = await this.authService.register(data);
      if (!user) {
        this.logWarn("register", "Registration failed: Email already exists", {
          email: data.email,
        });
        return { status: 400, data: { error: "Email already exists" } };
      }
      this.logInfo("register", "User registered successfully", {
        email: data.email,
      });
      return { status: 201, data: user };
    });
  }

  login() {
    return this.handleRequest("login", async (req) => {
      const { email, password } = req.body;
      const user = await this.authService.login(email, password, req);

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "24h" }
      );

      this.logInfo("login", "User logged in successfully", { email });
      return {
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        },
      };
    });
  }

  forgotPassword() {
    return this.handleRequest("forgotPassword", async (req) => {
      const { email } = req.body;
      const user = await this.authService.forgotPassword(email);
      if (!user) {
        this.logError("forgotPassword", "Failed to generate reset token", {
          email,
        });
        return {
          status: 400,
          data: { error: "Error generating password reset token" },
        };
      }
      this.logInfo("forgotPassword", "Password reset token sent", { email });
      return { data: { message: "Password reset token sent" } };
    });
  }

  resetPassword() {
    return this.handleRequest("resetPassword", async (req) => {
      const { token, newPassword } = req.body;
      const result = await this.authService.resetPassword(token, newPassword);
      this.logInfo("resetPassword", "Password reset successfully");
      return { data: result };
    });
  }

  changePassword() {
    return this.handleRequest("changePassword", async (req) => {
      const { email, oldPassword, newPassword } = req.body;
      const result = await this.authService.changePassword(
        email,
        oldPassword,
        newPassword
      );
      this.logInfo("changePassword", "Password changed", { email });
      return { data: result };
    });
  }

  getUserById() {
    return this.handleRequest("getUserById", async (req) => {
      const { id } = req.params;
      const user = await this.authService.getUserById(id); // optional: you can rename for clarity
      this.logInfo("getUserById", "User fetched", { id });
      return { data: user };
    });
  }
}

export default AuthController;
