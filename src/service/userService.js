import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import BaseService from "./BaseService.js";

class UserService extends BaseService {
  constructor(userRepository, emailService, logger) {
    super(logger);
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  registerUser(data) {
    return this.wrapAsync("registerUser", async () => {
      const existingUser = await this.userRepository.findUserByEmail(
        data.email
      );
      if (existingUser) {
        this.logError("registerUser", "Email already exists", {
          email: data.email,
        });
        return null;
      }

      let generatedPassword = null;
      if (!data.password) {
        generatedPassword = Math.random().toString(36).slice(-8);
        data.password = generatedPassword;
      }

      data.password = await bcrypt.hash(data.password, 10);
      data.birthday = dayjs(data.birthday).format("YYYY-MM-DDTHH:mm:ss[Z]");

      const user = await this.userRepository.createUser(data);

      if (user && generatedPassword) {
        await this.emailService.sendRandomPassword(
          user.email,
          user.name,
          generatedPassword
        );
      }

      this.logInfo("registerUser", "User registered successfully", {
        email: data.email,
      });
      return user;
    });
  }

  getUserByEmail(email) {
    return this.wrapAsync("getUserByEmail", async () => {
      const user = await this.userRepository.findUserByEmail(email);
      this.logInfo("getUserByEmail", "User fetched by email", { email });
      return user;
    });
  }

  login(email, password, req) {
    return this.wrapAsync("login", async () => {
      const ip =
        req.ip ||
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress;
      const userAgent = req.headers["user-agent"];

      const user = await this.userRepository.findUserByEmail(email);
      if (!user || !user.isEnabled) {
        this.logError("login", "Login failed: user not found or disabled", {
          email,
          ip,
          userAgent,
        });
        throw new Error("Invalid email or password");
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        this.logError("login", "Login failed: incorrect password", {
          email,
          ip,
          userAgent,
        });
        throw new Error("Invalid email or password");
      }

      this.logInfo("login", "User logged in successfully", {
        email,
        ip,
        userAgent,
      });
      return user;
    });
  }

  getUserById(userId) {
    return this.wrapAsync("getUserById", async () => {
      const user = await this.userRepository.findUserById(userId);
      this.logInfo("getUserById", "User fetched by ID", { userId });
      return user;
    });
  }

  changeUserPassword(email, oldPassword, newPassword) {
    return this.wrapAsync("changeUserPassword", async () => {
      const user = await this.userRepository.findUserByEmail(email);
      if (!user) {
        this.logError("changeUserPassword", "User not found", { email });
        throw new Error("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        this.logError("changeUserPassword", "Incorrect old password", {
          email,
        });
        throw new Error("Invalid email or password");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updated = await this.userRepository.updateUserPassword(
        email,
        hashedPassword
      );

      this.logInfo("changeUserPassword", "Password updated successfully", {
        email,
      });
      return updated;
    });
  }

  forgotPassword(email) {
    return this.wrapAsync("forgotPassword", async () => {
      const user = await this.userRepository.findUserByEmail(email);
      if (!user) throw new Error(`Email not found: ${email}`);

      const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "24h",
      });

      await this.emailService.sendForgotPasswordMail(email, resetToken);

      this.logInfo("forgotPassword", "Password reset token sent", { email });
      return user;
    });
  }

  resetPassword(token, newPassword) {
    return this.wrapAsync("resetPassword", async () => {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const userId = decoded.id;
      if (!userId) throw new Error("Invalid token data");

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updated = await this.userRepository.resetUserPassword(
        userId,
        hashedPassword
      );

      this.logInfo("resetPassword", "Password reset successfully", { userId });
      return updated;
    });
  }

  listAllUsers(filters) {
    return this.wrapAsync("listAllUsers", async () => {
      if (filters.take) filters.take = parseInt(filters.take);
      if (filters.limit) filters.limit = parseInt(filters.limit);

      const users = await this.userRepository.getAllUsers(filters);
      this.logInfo("listAllUsers", "Fetched all users", {
        count: users.length,
      });
      return users;
    });
  }

  updateUser(userId, data) {
    return this.wrapAsync("updateUser", async () => {
      const updated = await this.userRepository.updateUser(userId, data);
      this.logInfo("updateUser", "User updated successfully", { userId });
      return updated;
    });
  }

  promoteToAdmin(userId) {
    return this.wrapAsync("promoteToAdmin", async () => {
      const updated = await this.userRepository.makeUserAdmin(userId);
      this.logInfo("promoteToAdmin", "User promoted to ADMIN", { userId });
      return updated;
    });
  }

  promoteToSuperAdmin(userId) {
    return this.wrapAsync("promoteToSuperAdmin", async () => {
      const updated = await this.userRepository.makeUserSuperAdmin(userId);
      this.logInfo("promoteToSuperAdmin", "User promoted to SUPER_ADMIN", {
        userId,
      });
      return updated;
    });
  }

  disableUser(id) {
    return this.wrapAsync("disableUser", async () => {
      const user = await this.getUserById(id);

      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        this.logInfo(
          "disableUser",
          `Cannot disable user with role: ${user.role}`,
          { userId: id }
        );
        return null;
      }

      const disabledUser = await this.userRepository.disableUser(id);
      this.logInfo("disableUser", "User disabled successfully", { userId: id });
      return disabledUser;
    });
  }

  removeUser(userId) {
    return this.wrapAsync("removeUser", async () => {
      const deleted = await this.userRepository.deleteUser(userId);
      this.logInfo("removeUser", "User deleted successfully", { userId });
      return deleted;
    });
  }

  getAdmins() {
    return this.wrapAsync("getAdmins", async () => {
      const admins = await this.userRepository.getAdmins();
      this.logInfo("getAdmins", "Fetched all admins", {
        count: admins.length,
      });
      return admins;
    });
  }
}

export default UserService;
