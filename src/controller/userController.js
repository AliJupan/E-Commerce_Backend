import jwt from "jsonwebtoken";

class UserController {
  constructor(userService, logger) {
    this.userService = userService;
    this.logger = logger;
  }

  registerUser() {
    return [
      async (req, res) => {
        try {
          const data = req.body;
          const user = await this.userService.registerUser(data);
          if (!user) {
            this.logger.warn({
              module: "UserController",
              fn: "registerUser",
              message: "Registration failed: Email already exists",
              email: data.email,
            });
            return res.status(400).json({ error: "Email already exists" });
          }
          this.logger.info({
            module: "UserController",
            fn: "registerUser",
            message: "User registered successfully",
            email: data.email,
          });
          res.status(201).json(user);
        } catch (error) {
          this.logger.error({
            module: "UserController",
            fn: "registerUser",
            message: error.message,
            email: req.body.email,
          });
          res.status(500).json({ error: error.message });
        }
      },
    ];
  }

  login() {
    return [
      async (req, res) => {
        const { email, password } = req.body;

        try {
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

          this.logger.info({
            module: "UserController",
            fn: "login",
            message: "User logged in successfully",
            email,
          });

          // You could return a JWT here if you have auth set up
          res.status(200).json({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
            token,
          });
        } catch (error) {
          this.logger.error({
            module: "UserController",
            fn: "login",
            message: error.message,
            email,
          });

          res.status(401).json({ error: "Invalid email or password" });
        }
      },
    ];
  }

  getAllUsers() {
    return [
      async (req, res) => {
        try {
          const filters = req.query;
          const users = await this.userService.listAllUsers(filters);
          this.logger.info({
            module: "UserController",
            fn: "getAllUsers",
            message: "All users retrieved",
            count: users.length,
          });
          res.status(200).json(users);
        } catch (error) {
          this.logger.error({
            module: "UserController",
            fn: "getAllUsers",
            message: error.message,
          });
          res.status(500).json({ error: error.message });
        }
      },
    ];
  }

  getUserById() {
    return [
      async (req, res) => {
        try {
          const { id } = req.params;
          const user = await this.userService.getUserById(id);
          this.logger.info({
            module: "UserController",
            fn: "getUserById",
            message: "User fetched by ID",
            userId: id,
          });
          res.status(200).json(user);
        } catch (error) {
          this.logger.error({
            module: "UserController",
            fn: "getUserById",
            message: error.message,
            userId: req.params.id,
          });
          res.status(500).json({ error: error.message });
        }
      },
    ];
  }

  updateUser() {
    return [
      async (req, res) => {
        try {
          const { id } = req.params;
          const data = req.body;
          const updated = await this.userService.updateUser(id, data);
          this.logger.info({
            module: "UserController",
            fn: "updateUser",
            message: "User updated successfully",
            userId: id,
          });
          res.status(200).json(updated);
        } catch (error) {
          this.logger.error({
            module: "UserController",
            fn: "updateUser",
            message: error.message,
            userId: req.params.id,
          });
          res.status(500).json({ error: error.message });
        }
      },
    ];
  }

  promoteToAdmin() {
    return [
      async (req, res) => {
        try {
          const { id } = req.params;
          const user = await this.userService.promoteToAdmin(id);
          this.logger.info({
            module: "UserController",
            fn: "promoteToAdmin",
            message: "User promoted to ADMIN",
            userId: id,
          });
          res.status(200).json(user);
        } catch (error) {
          this.logger.error({
            module: "UserController",
            fn: "promoteToAdmin",
            message: error.message,
            userId: req.params.id,
          });
          res.status(500).json({ error: error.message });
        }
      },
    ];
  }

  promoteToSuperAdmin() {
    return [
      async (req, res) => {
        try {
          const { id } = req.params;
          const user = await this.userService.promoteToSuperAdmin(id);
          this.logger.info({
            module: "UserController",
            fn: "promoteToSuperAdmin",
            message: "User promoted to SUPER_ADMIN",
            userId: id,
          });
          res.status(200).json(user);
        } catch (error) {
          this.logger.error({
            module: "UserController",
            fn: "promoteToSuperAdmin",
            message: error.message,
            userId: req.params.id,
          });
          res.status(500).json({ error: error.message });
        }
      },
    ];
  }

  changePassword() {
    return [
      async (req, res) => {
        try {
          const { email, oldPassword, newPassword } = req.body;
          const result = await this.userService.changeUserPassword(
            email,
            oldPassword,
            newPassword
          );
          this.logger.info({
            module: "UserController",
            fn: "changePassword",
            message: "Password changed",
            email,
          });
          res.status(200).json(result);
        } catch (error) {
          this.logger.error({
            module: "UserController",
            fn: "changePassword",
            message: error.message,
            email: req.body.email,
          });
          res.status(500).json({ error: error.message });
        }
      },
    ];
  }

  forgotPassword() {
    return [
      async (req, res) => {
        const { email } = req.body;

        try {
          const user = await this.userService.forgotPassword(email);

          if (!user) {
            this.logger.error({
              module: "UserController",
              fn: "forgotPassword",
              message:
                "Error processing forgot password request: token generation failed",
              email,
            });

            return res.status(400).json({
              error:
                "Error processing forgot password request: token generation failed",
            });
          }

          this.logger.info({
            module: "UserController",
            fn: "forgotPassword",
            message: "Password reset token sent",
            email,
          });

          return res.status(200).json({ message: "Password reset token sent" });
        } catch (error) {
          this.logger.error({
            module: "UserController",
            fn: "forgotPassword",
            message: error.message,
            email,
          });

          res.status(500).json({ error: error.message });
        }
      },
    ];
  }

  resetPassword() {
    return [
      async (req, res) => {
        try {
          const { token, newPassword } = req.body;
          const result = await this.userService.resetPassword(
            token,
            newPassword
          );
          this.logger.info({
            module: "UserController",
            fn: "resetPassword",
            message: "Password reset successfully"
          });
          res.status(200).json(result);
        } catch (error) {
          this.logger.error({
            module: "UserController",
            fn: "resetPassword",
            message: error.message,
          });
          res.status(500).json({ error: error.message });
        }
      },
    ];
  }

  deleteUser() {
    return [
      async (req, res) => {
        try {
          const { id } = req.params;
          await this.userService.removeUser(id);
          this.logger.info({
            module: "UserController",
            fn: "deleteUser",
            message: "User deleted successfully",
            userId: id,
          });
          res.status(200).json({ message: `User ${id} deleted successfully` });
        } catch (error) {
          this.logger.error({
            module: "UserController",
            fn: "deleteUser",
            message: error.message,
            userId: req.params.id,
          });
          res.status(500).json({ error: error.message });
        }
      },
    ];
  }

  disableUser() {
    return [
      async (req, res) => {
        try {
          const { id } = req.params;
          const user = await this.userService.disableUser(id);

          if (!user) {
            // User not found or couldn't disable (like admin roles)
            this.logger.warn({
              module: "UserController",
              fn: "disableUser",
              message: `Attempted to disable non-existent or protected user`,
              userId: id,
            });
            return res
              .status(404)
              .json({ error: "User not found or cannot be disabled" });
          }

          this.logger.info({
            module: "UserController",
            fn: "disableUser",
            message: "User disabled successfully",
            userId: id,
          });

          res.status(200).json(user);
        } catch (error) {
          this.logger.error({
            module: "UserController",
            fn: "disableUser",
            message: error.message,
            userId: req.params.id,
          });
          res.status(500).json({ error: error.message });
        }
      },
    ];
  }
}

export default UserController;
