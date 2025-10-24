class AuthRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async createUser(data) {
    try {
      return await this.prisma.user.create({ data });
    } catch (error) {
      throw new Error("Failed to create user");
    }
  }

  async findUserByEmail(email) {
    try {
      return await this.prisma.user.findUnique({ where: { email } });
    } catch (error) {
      throw new Error("Failed to find user by email");
    }
  }

  async findUserById(id) {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
          role: true,
          country: true,
          city: true,
          postCode: true,
          address: true,
          createdAt: true,
          isEnabled: true,
        },
      });
    } catch (error) {
      throw new Error("Failed to find user by ID");
    }
  }

  async updateUserPassword(email, newPassword) {
    try {
      return await this.prisma.user.update({
        where: { email },
        data: { password: newPassword },
      });
    } catch (error) {
      throw new Error("Failed to update user password");
    }
  }

  // async resetUserPassword(userId, newPassword) {
  //   try {
  //     return await this.prisma.user.update({
  //       where: { userId },
  //       data: { password: newPassword },
  //     });
  //   } catch (error) {
  //     throw new Error("Failed to reset user password");
  //   }
  // }

  async updateUser(id, data) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error("Failed to update user");
    }
  }
}

export default AuthRepository;
