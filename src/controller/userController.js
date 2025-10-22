class UserController {
  constructor(userService, logger) {
    this.userService = userService;
    this.logger = logger;
  }

  async getAllUsers(req, res) {
    try {
      const filters = req.query;
      const users = await this.userService.listAllUsers(filters);

      this.logger.info({
        module: "UserController",
        fn: "getAllUsers",
        message: "All users retrieved",
        count: users.length,
      });

      return res.status(200).json(users);
    } catch (error) {
      this.logger.error({
        module: "UserController",
        fn: "getAllUsers",
        message: error.message,
      });
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);

      if (!user) {
        this.logger.error({
          module: "UserController",
          fn: "getUserById",
          message: "User not found",
          userId: id,
        });
        return res.status(404).json({ error: "User not found" });
      }

      this.logger.info({
        module: "UserController",
        fn: "getUserById",
        message: "User fetched successfully",
        userId: id,
      });

      return res.status(200).json(user);
    } catch (error) {
      this.logger.error({
        module: "UserController",
        fn: "getUserById",
        message: error.message,
      });
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async promoteToAdmin(req, res) {
    try {
      const { id } = req.params;
      const user = await this.userService.promoteToAdmin(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      this.logger.info({
        module: "UserController",
        fn: "promoteToAdmin",
        message: "User promoted to ADMIN",
        userId: id,
      });

      return res.status(200).json(user);
    } catch (error) {
      this.logger.error({
        module: "UserController",
        fn: "promoteToAdmin",
        message: error.message,
      });
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async promoteToSuperAdmin(req, res) {
    try {
      const { id } = req.params;
      const user = await this.userService.promoteToSuperAdmin(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      this.logger.info({
        module: "UserController",
        fn: "promoteToSuperAdmin",
        message: "User promoted to SUPER_ADMIN",
        userId: id,
      });

      return res.status(200).json(user);
    } catch (error) {
      this.logger.error({
        module: "UserController",
        fn: "promoteToSuperAdmin",
        message: error.message,
      });
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async disableUser(req, res) {
    try {
      const { id } = req.params;
      const user = await this.userService.disableUser(id);

      if (!user) {
        this.logger.warn({
          module: "UserController",
          fn: "disableUser",
          message: "Attempted to disable non-existent or protected user",
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

      return res.status(200).json(user);
    } catch (error) {
      this.logger.error({
        module: "UserController",
        fn: "disableUser",
        message: error.message,
      });
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await this.userService.removeUser(id);

      this.logger.info({
        module: "UserController",
        fn: "deleteUser",
        message: "User deleted successfully",
        userId: id,
      });

      return res
        .status(200)
        .json({ message: `User ${id} deleted successfully` });
    } catch (error) {
      this.logger.error({
        module: "UserController",
        fn: "deleteUser",
        message: error.message,
      });
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAdmins(req, res) {
    try {
      const admins = await this.userService.getAdmins();

      this.logger.info({
        module: "UserController",
        fn: "getAdmins",
        message: "Admins retrieved",
        count: admins.length,
      });

      return res.status(200).json(admins);
    } catch (error) {
      this.logger.error({
        module: "UserController",
        fn: "getAdmins",
        message: error.message,
      });
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default UserController;
