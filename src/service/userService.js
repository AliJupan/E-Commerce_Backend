import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {
  constructor(userRepository, emailService, logger) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.logger = logger;
  }

  async registerUser(data) {
    try {
      let user = await this.userRepository.findUserByEmail(data.email);

      if (user) {
        this.logger.error({
          module: "UserService",
          fn: "registerUser",
          message: "Email already exists",
          email: data.email,
        });
        return null;
      }

      var randomstring = Math.random().toString(36).slice(-8);

      const hashedPassword = await bcrypt.hash(randomstring, 10);
      data.password = hashedPassword;
      user = await this.userRepository.createUser(data);

      if (user) {
        this.emailService.sendRandomPassword(
          user.email,
          user.name,
          randomstring
        );
        this.logger.info({
          module: "UserService",
          fn: "registerUser",
          message: "User registered successfully",
          email: data.email,
        });
      }
      return user;
    } catch (error) {
      this.logger.error({
        module: "UserService",
        fn: "registerUser",
        message: error.message,
        email: data.email,
      });
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await this.userRepository.findUserByEmail(email);
      this.logger.info({
        module: "UserService",
        fn: "getUserByEmail",
        message: "User fetched by email",
        email,
      });
      return user;
    } catch (error) {
      this.logger.error({
        module: "UserService",
        fn: "getUserByEmail",
        message: error.message,
        email,
      });
      throw error;
    }
  }

  async login(email, password, req) {
    const ip =
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];

    try {
      const user = await this.userRepository.findUserByEmail(email);

      if (!user || !user.isEnabled) {
        this.logger.warn({
          module: "UserService",
          fn: "login",
          message: "Login failed: user not found or disabled",
          email,
          ip,
          userAgent,
        });
        throw new Error("Invalid email or password");
      }

      if (!(await bcrypt.compare(password, user.password))) {
        this.logger.warn({
          module: "UserService",
          fn: "login",
          message: "Login failed: incorrect password",
          email,
          ip,
          userAgent,
        });
        throw new Error("Invalid email or password");
      }

      this.logger.info({
        module: "UserService",
        fn: "login",
        message: "User logged in successfully",
        email,
        ip,
        userAgent,
      });

      return user;
    } catch (error) {
      this.logger.error({
        module: "UserService",
        fn: "login",
        message: error.message,
        email,
        ip,
        userAgent,
      });
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const user = await this.userRepository.findUserById(userId);
      this.logger.info({
        module: "UserService",
        fn: "getUserById",
        message: "User fetched by ID",
        userId,
      });
      return user;
    } catch (error) {
      this.logger.error({
        module: "UserService",
        fn: "getUserById",
        message: error.message,
        userId,
      });
      throw error;
    }
  }

  async changeUserPassword(email, oldPassword, newPassword) {
    try {
      const user = await this.userRepository.findUserByEmail(email);

      if (!user) {
        this.logger.warn({
          module: "UserService",
          fn: "login",
          message: "Login failed: user not found",
          email,
        });
        throw new Error("Invalid email or password");
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        this.logger.warn({
          module: "UserService",
          fn: "login",
          message: "Login failed: incorrect password",
          email,
        });
        throw new Error("Invalid email or password");
      }
      newPassword = await bcrypt.hash(newPassword, 10);
      const updated = await this.userRepository.updateUserPassword(
        email,
        newPassword
      );
      this.logger.info({
        module: "UserService",
        fn: "changeUserPassword",
        message: "Password updated successfully",
        email,
      });
      return updated;
    } catch (error) {
      this.logger.error({
        module: "UserService",
        fn: "changeUserPassword",
        message: error.message,
        email,
      });
      throw error;
    }
  }

  async forgotPassword(email) {
    try {
      const user = await this.userRepository.findUserByEmail(email);
      if (!user) {
        throw new Error(`Email not found: ${email}`);
      }

      const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "24h",
      });

      await this.emailService.sendForgotPasswordMail(email, resetToken);

      this.logger.info({
        module: "UserService",
        fn: "forgotPassword",
        message: "Forgot password requested",
        email,
      });

      return user;
    } catch (error) {
      this.logger.error({
        module: "UserService",
        fn: "forgotPassword",
        message: error.message,
        email,
      });
      throw error;
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const userId = decoded.id;
      if (!userId) {
        throw new Error("Invalid token data");
      }
      newPassword = await bcrypt.hash(newPassword, 10);
      const updated = await this.userRepository.resetUserPassword(
        userId,
        newPassword
      );
      this.logger.info({
        module: "UserService",
        fn: "resetPassword",
        message: "Password reset successfully",
        userId,
      });
      return updated;
    } catch (error) {
      this.logger.error({
        module: "UserService",
        fn: "resetPassword",
        message: error.message,
        userId,
      });
      throw error;
    }
  }

  async listAllUsers(filters) {
    try {
      if (filters.take) filters.take = parseInt(filters.take);
      if (filters.limit) filters.limit = parseInt(filters.limit);
      const users = await this.userRepository.getAllUsers(filters);
      this.logger.info({
        module: "UserService",
        fn: "listAllUsers",
        message: "Fetched all users",
        count: users.length,
      });
      return users;
    } catch (error) {
      this.logger.error({
        module: "UserService",
        fn: "listAllUsers",
        message: error.message,
      });
      throw error;
    }
  }

  async updateUser(userId, data) {
    try {
      const updated = await this.userRepository.updateUser(userId, data);
      this.logger.info({
        module: "UserService",
        fn: "updateUser",
        message: "User updated successfully",
        userId,
      });
      return updated;
    } catch (error) {
      this.logger.error({
        module: "UserService",
        fn: "updateUser",
        message: error.message,
        userId,
      });
      throw error;
    }
  }

  async promoteToAdmin(userId) {
    try {
      const updated = await this.userRepository.makeUserAdmin(userId);
      this.logger.info({
        module: "UserService",
        fn: "promoteToAdmin",
        message: "User promoted to ADMIN",
        userId,
      });
      return updated;
    } catch (error) {
      this.logger.error({
        module: "UserService",
        fn: "promoteToAdmin",
        message: error.message,
        userId,
      });
      throw error;
    }
  }

  async promoteToSuperAdmin(userId) {
    try {
      const updated = await this.userRepository.makeUserSuperAdmin(userId);
      this.logger.info({
        module: "UserService",
        fn: "promoteToSuperAdmin",
        message: "User promoted to SUPER_ADMIN",
        userId,
      });
      return updated;
    } catch (error) {
      this.logger.error({
        module: "UserService",
        fn: "promoteToSuperAdmin",
        message: error.message,
        userId,
      });
      throw error;
    }
  }

  async disableUser(id) {
    try {
      const user = await this.getUserById(id);

      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        this.logger.info({
          module: "UserService",
          fn: "disableUser",
          message: `Cannot disable user with role: ${user.role}`,
          userId: id,
        });
        return;
      }

      const disabledUser = await this.userRepository.disableUser(id);

      this.logger.info({
        module: "UserService",
        fn: "disableUser",
        message: "User disabled successfully",
        userId: id,
      });

      return disabledUser;
    } catch (error) {
      this.logger.error({
        module: "UserService",
        fn: "disableUser",
        message: error.message,
        userId: id,
      });
      throw error;
    }
  }

  async removeUser(userId) {
    try {
      const deleted = await this.userRepository.deleteUser(userId);
      this.logger.info({
        module: "UserService",
        fn: "removeUser",
        message: "User deleted successfully",
        userId,
      });
      return deleted;
    } catch (error) {
      this.logger.error({
        module: "UserService",
        fn: "removeUser",
        message: error.message,
        userId,
      });
      throw error;
    }
  }
}

export default UserService;
