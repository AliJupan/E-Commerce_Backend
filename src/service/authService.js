import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";

class AuthService {
  constructor(authRepository, emailService, logger) {
    this.authRepository = authRepository;
    this.emailService = emailService;
    this.logger = logger;
  }

  // Register a user
  async register(data) {
    try {
      const existingUser = await this.authRepository.findUserByEmail(data.email);
      if (existingUser) {
        this.logger.error({
          module: "AuthService",
          fn: "register",
          message: "Email already exists",
          email: data.email,
        });
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
        await this.emailService.sendRandomPassword(user.email, user.name, generatedPassword);
      }

      this.logger.info({
        module: "AuthService",
        fn: "register",
        message: "User registered successfully",
        email: data.email,
      });

      return user;
    } catch (error) {
      this.logger.error({
        module: "AuthService",
        fn: "register",
        message: error.message,
        email: data.email,
      });
      throw error;
    }
  }

  // Login a user
  async login(email, password, req) {
    try {
      const ip = req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress;
      const userAgent = req.headers["user-agent"];

      const user = await this.authRepository.findUserByEmail(email);
      if (!user || !user.isEnabled) {
        this.logger.error({
          module: "AuthService",
          fn: "login",
          message: "User not found or disabled",
          email,
          ip,
          userAgent,
        });
        throw new Error("Invalid email or password");
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        this.logger.error({
          module: "AuthService",
          fn: "login",
          message: "Incorrect password",
          email,
          ip,
          userAgent,
        });
        throw new Error("Invalid email or password");
      }

      this.logger.info({
        module: "AuthService",
        fn: "login",
        message: "User logged in successfully",
        email,
        ip,
        userAgent,
      });

      return user;
    } catch (error) {
      this.logger.error({
        module: "AuthService",
        fn: "login",
        message: error.message,
      });
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await this.authRepository.findUserById(parseInt(id));

      this.logger.info({
        module: "AuthService",
        fn: "getUserById",
        message: "User fetched successfully",
        userId: id,
      });

      return user;
    } catch (error) {
      this.logger.error({
        module: "AuthService",
        fn: "getUserById",
        message: error.message,
        userId: id,
      });
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await this.authRepository.findUserByEmail(email);

      this.logger.info({
        module: "AuthService",
        fn: "getUserByEmail",
        message: "User fetched successfully",
        email,
      });

      return user;
    } catch (error) {
      this.logger.error({
        module: "AuthService",
        fn: "getUserByEmail",
        message: error.message,
        email,
      });
      throw error;
    }
  }

  async forgotPassword(email) {
    try {
      const user = await this.authRepository.findUserByEmail(email);
      if (!user) throw new Error(`Email not found: ${email}`);

      const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
      await this.emailService.sendForgotPasswordMail(email, resetToken);

      this.logger.info({
        module: "AuthService",
        fn: "forgotPassword",
        message: "Password reset token sent",
        email,
      });

      return user;
    } catch (error) {
      this.logger.error({
        module: "AuthService",
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
      if (!userId) throw new Error("Invalid token");

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updated = await this.authRepository.resetUserPassword(userId, hashedPassword);

      this.logger.info({
        module: "AuthService",
        fn: "resetPassword",
        message: "Password reset successfully",
        userId,
      });

      return updated;
    } catch (error) {
      this.logger.error({
        module: "AuthService",
        fn: "resetPassword",
        message: error.message,
      });
      throw error;
    }
  }

  async changePassword(email, oldPassword, newPassword) {
    try {
      const user = await this.authRepository.findUserByEmail(email);
      if (!user) throw new Error("Invalid email or password");

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) throw new Error("Invalid email or password");

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updated = await this.authRepository.updateUserPassword(email, hashedPassword);

      this.logger.info({
        module: "AuthService",
        fn: "changePassword",
        message: "Password changed successfully",
        email,
      });

      return updated;
    } catch (error) {
      this.logger.error({
        module: "AuthService",
        fn: "changePassword",
        message: error.message,
        email,
      });
      throw error;
    }
  }
}

export default AuthService;
