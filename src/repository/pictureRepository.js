class PictureRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async createPicture(data) {
    try {
      return await this.prisma.picture.create({ data });
    } catch (error) {
      throw new Error("Failed to create picture");
    }
  }

  async getPictureById(id) {
    try {
      return await this.prisma.picture.findUnique({ where: { id } });
    } catch (error) {
      throw new Error("Failed to fetch picture by ID");
    }
  }

  async getPicturesByProductId(id) {
    try {
      return await this.prisma.picture.findMany({
        where: { productId: id },
        orderBy: { uploadedAt: "asc" },
      });
    } catch (error) {
      throw new Error("Failed to fetch pictures by product ID");
    }
  }

  async getThumbnailByProductId(id) {
    try {
      return await this.prisma.picture.findMany({
        where: { productId: id, isThumbnail: true },
        orderBy: { uploadedAt: "asc" },
      });
    } catch (error) {
      throw new Error("Failed to fetch thumbnail by product ID");
    }
  }

  async toggleIsThumbnail(id) {
    try {
      const picture = await this.prisma.picture.findUnique({
        where: { id },
        select: { isThumbnail: true, productId: true },
      });
      if (!picture) return null;

      return await this.prisma.picture.update({
        where: { id },
        data: { isThumbnail: !picture.isThumbnail },
      });
    } catch (error) {
      throw new Error("Failed to toggle thumbnail status");
    }
  }

  async deletePicture(id) {
    try {
      return await this.prisma.picture.delete({ where: { id } });
    } catch (error) {
      throw new Error("Failed to delete picture");
    }
  }

  async deletePicturesByProductId(id) {
    try {
      return await this.prisma.picture.deleteMany({ where: { productId: id } });
    } catch (error) {
      throw new Error("Failed to delete pictures by product ID");
    }
  }
}

export default PictureRepository;
