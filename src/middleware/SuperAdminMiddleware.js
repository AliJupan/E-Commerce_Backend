class SuperAdminMiddleware {
  authorize() {
    return [
      async (req, res, next) => {
        const userRole = req.user?.role;

        if (userRole === 'SUPER_ADMIN') {
          next();
        } else {
          return res.status(403).json({ message: 'Only SUPER_ADMIN can access this resource' });
        }
      },
    ];
  }
}

export default new SuperAdminMiddleware();
