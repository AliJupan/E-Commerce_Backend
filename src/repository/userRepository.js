class UserRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  // Get all non-SUPER_ADMIN users with pagination
  async getAllUsers({ page = 1, limit = 10 } = {}) {
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    return this.prisma.user.findMany({
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
  }

  // Update user info (excluding password)
  async updateUser(userId, data) {
    const id = parseInt(userId, 10);
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // Make user ADMIN
  async makeUserAdmin(userId) {
    const id = parseInt(userId, 10);
    return this.prisma.user.update({
      where: { id },
      data: { role: "ADMIN" },
    });
  }

  // Make user SUPER_ADMIN
  async makeUserSuperAdmin(userId) {
    const id = parseInt(userId, 10);
    return this.prisma.user.update({
      where: { id },
      data: { role: "SUPER_ADMIN" },
    });
  }

  // Toggle user enabled/disabled
  async toggleUserEnabled(userId) {
    const id = parseInt(userId, 10);

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { isEnabled: true },
    });
    if (!user) return null;

    return this.prisma.user.update({
      where: { id },
      data: { isEnabled: !user.isEnabled },
    });
  }

  // Delete user
  async deleteUser(userId) {
    const id = parseInt(userId, 10);
    return this.prisma.user.delete({ where: { id } });
  }

  // Get all admins
  async getAdmins() {
    return this.prisma.user.findMany({
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
  }
}

export default UserRepository;
