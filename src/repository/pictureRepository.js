class PictureRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async createPicture(data) {
    const picture = await this.prisma.picture.create({ data });
    return picture;
  }

  async getPictureById(pictureId) {
    const id = parseInt(pictureId, 10);
    const picture = await this.prisma.picture.findUnique({ where: { id } });
    return picture;
  }

  async getPicturesByProductId(productId) {
    const id = parseInt(productId, 10);
    const pictures = await this.prisma.picture.findMany({
      where: { productId: id },
      orderBy: { uploadedAt: "asc" },
    });
    return pictures;
  }

  async getThumbnailByProductId(productId) {
    const id = parseInt(productId, 10);
    const pictures = await this.prisma.picture.findMany({
      where: { productId: id, isThumbnail: true },
      orderBy: { uploadedAt: "asc" },
    });
    return pictures;
  }

  async toggleIsThumbnail(pictureId) {
    const id = parseInt(pictureId, 10);
    const picture = await this.prisma.picture.findUnique({
      where: { id },
      select: { isThumbnail: true, productId: true },
    });
    if (!picture) return null;

    // Toggle the current picture's isThumbnail
    const updated = await this.prisma.picture.update({
      where: { id },
      data: { isThumbnail: !picture.isThumbnail },
    });

    return updated;
  }

  async deletePicture(pictureId) {
    const id = parseInt(pictureId, 10);
    const deleted = await this.prisma.picture.delete({ where: { id } });
    return deleted;
  }

  async deletePicturesByProductId(productId) {
    const id = parseInt(productId, 10);
    const deleted = await this.prisma.picture.deleteMany({
      where: { productId: id },
    });
    return deleted;
  }
}

export default PictureRepository;
