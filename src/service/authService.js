import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import BaseService from "./BaseService.js";

class AuthService extends BaseService {
  constructor(authRepository, emailService, logger) {
    super(logger);
    this.authRepository = authRepository;
    this.emailService = emailService;
  }

  register(data) {
    return this.wrapAsync("register", async () => {
      const existingUser = await this.authRepository.findUserByEmail(
        data.email
      );
      if (existingUser) {
        this.logError("register", "Email already exists", { email: data.email });
        return null;
      }

      let generatedPassword = null;
      if (!data.password || data.password.trim() === "") {
        generatedPassword = Math.random().toString(36).slice(-8);
        data.password = generatedPassword;
      }

      data.password = await bcrypt.hash(data.password, 10);
      if (data.birthday) {
        data.birthday = dayjs(data.birthday).format("YYYY-MM-DDTHH:mm:ss[Z]");
      }

      const user = await this.authRepository.createUser(data);

      if (user && generatedPassword) {
        await this.emailService.sendRandomPassword(
          user.email,
          user.name,
          generatedPassword
        );
      }

      this.logInfo("register", "User registered successfully", { email: data.email });
      return user;
    });
  }

  login(email, password, req) {
    return this.wrapAsync("login", async () => {
      const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      const userAgent = req.headers["user-agent"];

      const user = await this.authRepository.findUserByEmail(email);
      if (!user || !user.isEnabled) {
        this.logError("login", "Login failed: user not found or disabled", { email, ip, userAgent });
        throw new Error("Invalid email or password");
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        this.logError("login", "Login failed: incorrect password", { email, ip, userAgent });
        throw new Error("Invalid email or password");
      }

      this.logInfo("login", "User logged in successfully", { email, ip, userAgent });
      return user;
    });
  }

  getUserById(id) {
    return this.wrapAsync("getUserById", async () => {
      const user = await this.authRepository.findUserById(id);
      this.logInfo("getUserById", "User fetched by id", { id });
      return user;
    });
  }

  getUserByEmail(email) {
    return this.wrapAsync("getUserByEmail", async () => {
      const user = await this.authRepository.findUserByEmail(email);
      this.logInfo("getUserByEmail", "User fetched by email", { email });
      return user;
    });
  }

  forgotPassword(email) {
    return this.wrapAsync("forgotPassword", async () => {
      const user = await this.authRepository.findUserByEmail(email);
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
      const updated = await this.authRepository.resetUserPassword(userId, hashedPassword);

      this.logInfo("resetPassword", "Password reset successfully", { userId });
      return updated;
    });
  }

  changePassword(email, oldPassword, newPassword) {
    return this.wrapAsync("changePassword", async () => {
      const user = await this.authRepository.findUserByEmail(email);
      if (!user) {
        this.logError("changePassword", "User not found", { email });
        throw new Error("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        this.logError("changePassword", "Incorrect old password", { email });
        throw new Error("Invalid email or password");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updated = await this.authRepository.updateUserPassword(email, hashedPassword);

      this.logInfo("changePassword", "Password updated successfully", { email });
      return updated;
    });
  }
}

export default AuthService;
