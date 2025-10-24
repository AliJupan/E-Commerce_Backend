class UserRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async getAllUsers({ page = 1, limit = 10 } = {}) {
    try {
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);

      return await this.prisma.user.findMany({
        where: { NOT: { role: "SUPER_ADMIN" } },
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
    } catch (error) {
      throw new Error("Failed to fetch users");
    }
  }

  async makeUserAdmin(id) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { role: "ADMIN" },
      });
    } catch (error) {
      throw new Error("Failed to make user admin");
    }
  }

  async makeUserSuperAdmin(id) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { role: "SUPER_ADMIN" },
      });
    } catch (error) {
      throw new Error("Failed to make user super admin");
    }
  }

  async toggleUserEnabled(id) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { isEnabled: true },
      });
      if (!user) return null;

      return await this.prisma.user.update({
        where: { id },
        data: { isEnabled: !user.isEnabled },
      });
    } catch (error) {
      throw new Error("Failed to toggle user enabled status");
    }
  }

  async deleteUser(id) {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      throw new Error("Failed to delete user");
    }
  }

  async getAdmins() {
    try {
      return await this.prisma.user.findMany({
        where: { role: "ADMIN" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          isEnabled: true,
        },
      });
    } catch (error) {
      throw new Error("Failed to fetch admins");
    }
  }
}

export default UserRepository;
