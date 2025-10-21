import BaseService from "./BaseService.js";

class UserService extends BaseService {
  constructor(userRepository, logger) {
    super(logger);
    this.userRepository = userRepository;
  }

  listAllUsers(filters) {
    return this.wrapAsync("listAllUsers", async () => {
      if (filters.take) filters.take = parseInt(filters.take);
      if (filters.limit) filters.limit = parseInt(filters.limit);

      const users = await this.userRepository.getAllUsers(filters);
      this.logInfo("listAllUsers", "Fetched all users", { count: users.length });
      return users;
    });
  }

  getUserById(userId) {
    return this.wrapAsync("getUserById", async () => {
      const user = await this.userRepository.findUserById(userId);
      this.logInfo("getUserById", "User fetched by ID", { userId });
      return user;
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
      this.logInfo("promoteToSuperAdmin", "User promoted to SUPER_ADMIN", { userId });
      return updated;
    });
  }

  disableUser(userId) {
    return this.wrapAsync("disableUser", async () => {
      const user = await this.getUserById(userId);

      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        this.logInfo("disableUser", `Cannot disable user with role: ${user.role}`, { userId });
        return null;
      }

      const disabledUser = await this.userRepository.toggleUserEnabled(userId);
      this.logInfo("disableUser", "User disabled successfully", { userId });
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
      this.logInfo("getAdmins", "Fetched all admins", { count: admins.length });
      return admins;
    });
  }
}

export default UserService;
