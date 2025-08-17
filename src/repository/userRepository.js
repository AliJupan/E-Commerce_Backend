class UserRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async createUser(data) {
    const user = await this.prisma.user.create({ data });
    return user;
  }

  async findUserByEmail(email) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }

  async findUserById(userId) {
    const id = parseInt(userId, 10);
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        isEnabled: true,
      },
    });
    return user;
  }

  async updateUserPassword(email, newPassword) {
    const user = await this.prisma.user.update({
      where: { email },
      data: { password: newPassword },
    });
    return user;
  }

  async resetUserPassword(userId, newPassword) {
    const id = parseInt(userId, 10);
    const user = await this.prisma.user.update({
      where: { id },
      data: { password: newPassword },
    });
    return user;
  }

  async getAllUsers({ page = 1, limit = 10 } = {}) {
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const users = await this.prisma.user.findMany({
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
    return users;
  }

  async updateUser(userId, data) {
    const id = parseInt(userId, 10);
    const updated = await this.prisma.user.update({
      where: { id },
      data,
    });
    return updated;
  }

  async makeUserAdmin(userId) {
    const id = parseInt(userId, 10);
    const updated = await this.prisma.user.update({
      where: { id },
      data: { role: "ADMIN" },
    });
    return updated;
  }

  async makeUserSuperAdmin(userId) {
    const id = parseInt(userId, 10);
    const updated = await this.prisma.user.update({
      where: { id },
      data: { role: "SUPER_ADMIN" },
    });
    return updated;
  }

  async toggleUserEnabled(userId) {
    const id = parseInt(userId, 10);
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { isEnabled: true },
    });
    if (!user) return null;

    const updated = await this.prisma.user.update({
      where: { id },
      data: { isEnabled: !user.isEnabled },
    });
    return updated;
  }

  async deleteUser(userId) {
    const id = parseInt(userId, 10);
    const deleted = await this.prisma.user.delete({ where: { id } });
    return deleted;
  }

  async getAdmins() {
    const admins = await this.prisma.user.findMany({
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

    return admins;
  }
}

export default UserRepository;
