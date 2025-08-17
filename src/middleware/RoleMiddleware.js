class RoleMiddleware {
  authorize() {
    return [
      async (req, res, next) => {
        const userRole = req.user?.role;

        if (!userRole) {
          return res
            .status(401)
            .json({ message: "Token is missing or invalid" });
        }

        if (
          userRole === "ADMIN" ||
          userRole === "SUPER_ADMIN" ||
          userRole === "EMPLOYEE"
        ) {
          next();
        } else {
          return res.status(403).json({ message: "Unauthorized access" });
        }
      },
    ];
  }

  isAdminOrSuperAdmin() {
    return [
      async (req, res, next) => {
        const userRole = req.user?.role;

        if (!userRole) {
          return res
            .status(401)
            .json({ message: "Token is missing or invalid" });
        }

        if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
          next();
        } else {
          return res.status(403).json({ message: "Unauthorized access" });
        }
      },
    ];
  }
}

export default new RoleMiddleware();
