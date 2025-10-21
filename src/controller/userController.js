import BaseController from "./BaseController.js";

class UserController extends BaseController {
  constructor(userService, logger) {
    super(logger, "UserController");
    this.userService = userService;
  }

  getAllUsers() {
    return this.handleRequest("getAllUsers", async (req) => {
      const filters = req.query;
      const users = await this.userService.listAllUsers(filters);
      this.logInfo("getAllUsers", "All users retrieved", { count: users.length });
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

      if (req.user.id !== parseInt(id, 10)) {
        this.logWarn("updateUser", "Unauthorized update attempt", { userId: id });
        return { status: 403, data: { error: "You can only update your own profile." } };
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
      this.logInfo("promoteToSuperAdmin", "User promoted to SUPER_ADMIN", { userId: id });
      return { data: user };
    });
  }

  disableUser() {
    return this.handleRequest("disableUser", async (req) => {
      const { id } = req.params;
      const user = await this.userService.disableUser(id);
      if (!user) {
        this.logWarn("disableUser", "Attempted to disable non-existent or protected user", { userId: id });
        return { status: 404, data: { error: "User not found or cannot be disabled" } };
      }
      this.logInfo("disableUser", "User disabled successfully", { userId: id });
      return { data: user };
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

  getAdmins() {
    return this.handleRequest("getAdmins", async () => {
      const admins = await this.userService.getAdmins();
      this.logInfo("getAdmins", "Admins retrieved", { count: admins.length });
      return { data: admins };
    });
  }
}

export default UserController;
