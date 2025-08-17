import BaseController from "./BaseController.js";
import jwt from "jsonwebtoken";

class UserController extends BaseController {
  constructor(userService, logger) {
    super(logger, "UserController");
    this.userService = userService;
  }

  registerUser() {
    return this.handleRequest("registerUser", async (req) => {
      const data = req.body;
      const user = await this.userService.registerUser(data);
      if (!user) {
        this.logWarn(
          "registerUser",
          "Registration failed: Email already exists",
          {
            email: data.email,
          }
        );
        return { status: 400, data: { error: "Email already exists" } };
      }
      this.logInfo("registerUser", "User registered successfully", {
        email: data.email,
      });
      return { status: 201, data: user };
    });
  }

  login() {
    return this.handleRequest("login", async (req) => {
      const { email, password } = req.body;
      const user = await this.userService.login(email, password, req);

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

  getAllUsers() {
    return this.handleRequest("getAllUsers", async (req) => {
      const filters = req.query;
      const users = await this.userService.listAllUsers(filters);
      this.logInfo("getAllUsers", "All users retrieved", {
        count: users.length,
      });
      return { data: users };
    });
  }

  getUserById() {
    return this.handleRequest("getUserById", async (req) => {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      this.logInfo("getUserById", "User fetched by ID", { userId: id });
      return { data: user };
    });
  }

  updateUser() {
    return this.handleRequest("updateUser", async (req) => {
      const { id } = req.params;
      const data = req.body;

      if (id !== req.user.id) {
        this.logWarn("updateUser", "Unauthorized update attempt", {
          userId: id,
        });
        return {
          status: 403,
          data: { error: "You can only update your own profile." },
        };
      }

      const updated = await this.userService.updateUser(id, data);
      this.logInfo("updateUser", "User updated successfully", { userId: id });
      return { data: updated };
    });
  }

  promoteToAdmin() {
    return this.handleRequest("promoteToAdmin", async (req) => {
      const { id } = req.params;
      const user = await this.userService.promoteToAdmin(id);
      this.logInfo("promoteToAdmin", "User promoted to ADMIN", { userId: id });
      return { data: user };
    });
  }

  promoteToSuperAdmin() {
    return this.handleRequest("promoteToSuperAdmin", async (req) => {
      const { id } = req.params;
      const user = await this.userService.promoteToSuperAdmin(id);
      this.logInfo("promoteToSuperAdmin", "User promoted to SUPER_ADMIN", {
        userId: id,
      });
      return { data: user };
    });
  }

  changePassword() {
    return this.handleRequest("changePassword", async (req) => {
      const { email, oldPassword, newPassword } = req.body;
      const result = await this.userService.changeUserPassword(
        email,
        oldPassword,
        newPassword
      );
      this.logInfo("changePassword", "Password changed", { email });
      return { data: result };
    });
  }

  forgotPassword() {
    return this.handleRequest("forgotPassword", async (req) => {
      const { email } = req.body;
      const user = await this.userService.forgotPassword(email);
      if (!user) {
        this.logError(
          "forgotPassword",
          "Error processing forgot password request: token generation failed",
          { email }
        );
        return {
          status: 400,
          data: {
            error:
              "Error processing forgot password request: token generation failed",
          },
        };
      }
      this.logInfo("forgotPassword", "Password reset token sent", { email });
      return { data: { message: "Password reset token sent" } };
    });
  }

  resetPassword() {
    return this.handleRequest("resetPassword", async (req) => {
      const { token, newPassword } = req.body;
      const result = await this.userService.resetPassword(token, newPassword);
      this.logInfo("resetPassword", "Password reset successfully");
      return { data: result };
    });
  }

  deleteUser() {
    return this.handleRequest("deleteUser", async (req) => {
      const { id } = req.params;
      await this.userService.removeUser(id);
      this.logInfo("deleteUser", "User deleted successfully", { userId: id });
      return { data: { message: `User ${id} deleted successfully` } };
    });
  }

  disableUser() {
    return this.handleRequest("disableUser", async (req) => {
      const { id } = req.params;
      const user = await this.userService.disableUser(id);
      if (!user) {
        this.logWarn(
          "disableUser",
          "Attempted to disable non-existent or protected user",
          { userId: id }
        );
        return {
          status: 404,
          data: { error: "User not found or cannot be disabled" },
        };
      }
      this.logInfo("disableUser", "User disabled successfully", { userId: id });
      return { data: user };
    });
  }
}

export default UserController;
