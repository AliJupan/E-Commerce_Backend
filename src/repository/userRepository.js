class UserRepository {
  constructor(prismaClient, logger) {
    this.prisma = prismaClient;
    this.logger = logger;
  }

  async createUser(data) {
    try {
      const user = await this.prisma.user.create({ data });
      this.logger.info({
        module: "UserRepository",
        fn: "createUser",
        message: "User created successfully",
        email: data.email,
      });
      return user;
    } catch (error) {
      this.logger.error({
        module: "UserRepository",
        fn: "createUser",
        message: error.message,
        email: data.email,
      });
      throw error;
    }
  }

  async findUserByEmail(email) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      this.logger.info({
        module: "UserRepository",
        fn: "findUserByEmail",
        message: "User fetched by email",
        email,
      });
      return user;
    } catch (error) {
      this.logger.error({
        module: "UserRepository",
        fn: "findUserByEmail",
        message: error.message,
        email,
      });
      throw error;
    }
  }

  async findUserById(userId) {
    try {
      const id = parseInt(userId);
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });
      this.logger.info({
        module: "UserRepository",
        fn: "findUserById",
        message: "User fetched by ID",
        userId,
      });
      return user;
    } catch (error) {
      this.logger.error({
        module: "UserRepository",
        fn: "findUserById",
        message: error.message,
        userId,
      });
      throw error;
    }
  }

  async updateUserPassword(email, newPassword) {
    try {
      const user = await this.prisma.user.update({
        where: { email },
        data: { password: newPassword },
      });
      this.logger.info({
        module: "UserRepository",
        fn: "updateUserPassword",
        message: "Password updated",
        email,
      });
      return user;
    } catch (error) {
      this.logger.error({
        module: "UserRepository",
        fn: "updateUserPassword",
        message: error.message,
        email,
      });
      throw error;
    }
  }

  async resetUserPassword(userId, newPassword) {
    try {
      const id = parseInt(userId);
      const user = await this.prisma.user.update({
        where: { id },
        data: { password: newPassword },
      });
      this.logger.info({
        module: "UserRepository",
        fn: "resetUserPassword",
        message: "Password reset",
        userId,
      });
      return user;
    } catch (error) {
      this.logger.error({
        module: "UserRepository",
        fn: "resetUserPassword",
        message: error.message,
        userId,
      });
      throw error;
    }
  }

  async getAllUsers({ page = 1, limit = 9 }) {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          NOT: {
            role: "SUPER_ADMIN",
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          isEnabled: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      });
      this.logger.info({
        module: "UserRepository",
        fn: "getAllUsers",
        message: "All users fetched",
        count: users.length,
      });
      return users;
    } catch (error) {
      this.logger.error({
        module: "UserRepository",
        fn: "getAllUsers",
        message: error.message,
      });
      throw error;
    }
  }

  async updateUser(userId, data) {
    try {
      const id = parseInt(userId);
      const user = await this.prisma.user.update({
        where: { id },
        data,
      });
      this.logger.info({
        module: "UserRepository",
        fn: "updateUser",
        message: "User updated",
        userId,
      });
      return user;
    } catch (error) {
      this.logger.error({
        module: "UserRepository",
        fn: "updateUser",
        message: error.message,
        userId,
      });
      throw error;
    }
  }

  async makeUserAdmin(userId) {
    try {
      const id = parseInt(userId);
      const user = await this.prisma.user.update({
        where: { id },
        data: { role: "ADMIN" },
      });
      this.logger.info({
        module: "UserRepository",
        fn: "makeUserAdmin",
        message: "User promoted to ADMIN",
        userId,
      });
      return user;
    } catch (error) {
      this.logger.error({
        module: "UserRepository",
        fn: "makeUserAdmin",
        message: error.message,
        userId,
      });
      throw error;
    }
  }

  async makeUserSuperAdmin(userId) {
    try {
      const id = parseInt(userId);
      const user = await this.prisma.user.update({
        where: { id },
        data: { role: "SUPER_ADMIN" },
      });
      this.logger.info({
        module: "UserRepository",
        fn: "makeUserSuperAdmin",
        message: "User promoted to SUPER_ADMIN",
        userId,
      });
      return user;
    } catch (error) {
      this.logger.error({
        module: "UserRepository",
        fn: "makeUserSuperAdmin",
        message: error.message,
        userId,
      });
      throw error;
    }
  }

  async disableUser(id) {
    try {
      id = parseInt(id);

      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { isEnabled: true },
      });

      if (!user) {
        this.logger.warn({
          module: "UserRepository",
          fn: "disableUser",
          message: "User not found",
          userId: id,
        });
        return null;
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: { isEnabled: !user.isEnabled },
      });

      this.logger.info({
        module: "UserRepository",
        fn: "disableUser",
        message: "User isEnabled toggled successfully",
        userId: id,
        newStatus: updatedUser.isEnabled,
      });

      return updatedUser;
    } catch (error) {
      this.logger.error({
        module: "UserRepository",
        fn: "disableUser",
        message: error.message,
        userId: id,
      });
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const id = parseInt(userId);
      const user = await this.prisma.user.delete({ where: { id } });
      this.logger.info({
        module: "UserRepository",
        fn: "deleteUser",
        message: "User deleted",
        userId,
      });
      return user;
    } catch (error) {
      this.logger.error({
        module: "UserRepository",
        fn: "deleteUser",
        message: error.message,
        userId,
      });
      throw error;
    }
  }
}

export default UserRepository;
