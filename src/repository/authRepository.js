class AuthRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  // Create a new user (used during registration)
  async createUser(data) {
    return this.prisma.user.create({ data });
  }

  // Find user by email (for login or password reset)
  async findUserByEmail(email) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  // Find user by ID (profile)
  async findUserById(userId) {
    const id = parseInt(userId, 10);
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        surname:true,
        role: true,
        country:true,
        city:true,
        postCode:true,
        address:true,
        createdAt: true,
        isEnabled: true,
      },
    });
  }

  // Update password using email (forgot password flow)
  async updateUserPassword(email, newPassword) {
    return this.prisma.user.update({
      where: { email },
      data: { password: newPassword },
    });
  }

  // Reset password using user ID (admin flow)
  async resetUserPassword(userId, newPassword) {
    const id = parseInt(userId, 10);
    return this.prisma.user.update({
      where: { id },
      data: { password: newPassword },
    });
  }
}

export default AuthRepository;
