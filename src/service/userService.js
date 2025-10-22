class UserService {
  constructor( userRepository, logger ) {
    this.userRepository = userRepository;
    this.logger = logger;
  }

  async listAllUsers(filters = {}) {
    try {
      if (filters.take) filters.take = parseInt(filters.take);
      if (filters.limit) filters.limit = parseInt(filters.limit);

      const users = await this.userRepository.getAllUsers(filters);

      this.logger?.info({
        module: "UserService",
        fn: "listAllUsers",
        message: "Fetched all users",
        count: users.length,
      });

      return users;
    } catch (error) {
      this.logger?.error({
        module: "UserService",
        fn: "listAllUsers",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const user = await this.userRepository.findUserById(parseInt(userId));

      this.logger?.info({
        module: "UserService",
        fn: "getUserById",
        message: "User fetched by ID",
        userId: userId,
      });

      return user;
    } catch (error) {
      this.logger?.error({
        module: "UserService",
        fn: "getUserById",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async promoteToAdmin(userId) {
    try {
      const updated = await this.userRepository.makeUserAdmin(parseInt(userId));

      this.logger?.info({
        module: "UserService",
        fn: "promoteToAdmin",
        message: "User promoted to ADMIN",
        userId: userId,
      });

      return updated;
    } catch (error) {
      this.logger?.error({
        module: "UserService",
        fn: "promoteToAdmin",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async promoteToSuperAdmin(userId) {
    try {
      const updated = await this.userRepository.makeUserSuperAdmin(parseInt(userId));

      this.logger?.info({
        module: "UserService",
        fn: "promoteToSuperAdmin",
        message: "User promoted to SUPER_ADMIN",
        userId: userId,
      });

      return updated;
    } catch (error) {
      this.logger?.error({
        module: "UserService",
        fn: "promoteToSuperAdmin",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async disableUser(userId) {
    try {
      const user = await this.getUserById(userId);

      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        this.logger?.info({
          module: "UserService",
          fn: "disableUser",
          message: `Cannot disable user with role: ${user.role}`,
          userId,
        });
        return null;
      }

      const disabledUser = await this.userRepository.toggleUserEnabled(parseInt(userId));

      this.logger?.info({
        module: "UserService",
        fn: "disableUser",
        message: "User disabled successfully",
        userId,
      });

      return disabledUser;
    } catch (error) {
      this.logger?.error({
        module: "UserService",
        fn: "disableUser",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async removeUser(userId) {
    try {
      const deleted = await this.userRepository.deleteUser(parseInt(userId));

      this.logger?.info({
        module: "UserService",
        fn: "removeUser",
        message: "User deleted successfully",
        userId: userId,
      });

      return deleted;
    } catch (error) {
      this.logger?.error({
        module: "UserService",
        fn: "removeUser",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getAdmins() {
    try {
      const admins = await this.userRepository.getAdmins();

      this.logger?.info({
        module: "UserService",
        fn: "getAdmins",
        message: "Fetched all admins",
        count: admins.length,
      });

      return admins;
    } catch (error) {
      this.logger?.error({
        module: "UserService",
        fn: "getAdmins",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}

export default UserService;
