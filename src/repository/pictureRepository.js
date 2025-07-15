class PictureRepository {
  constructor(prisma, logger) {
    this.prisma = prisma;
    this.logger = logger;
  }

  async createPicture(data) {
    try {
      const picture = await this.prisma.picture.create({ data });

      this.logger.info({
        module: "PictureRepository",
        fn: "createPicture",
        message: "Created picture",
        productId: data.productId,
        isThumbnail: data.isThumbnail,
      });

      return picture;
    } catch (error) {
      this.logger.error({
        module: "PictureRepository",
        fn: "createPicture",
        message: "Error creating picture",
        listingId: data?.productId,
        error: error.message,
      });
      throw error;
    }
  }

  async getPictureById(id) {
    try {
      const picture = await this.prisma.picture.findUnique({
        where: { id },
      });

      this.logger.info({
        module: "PictureRepository",
        fn: "getPictureById",
        message: "Fetched picture by ID",
        id,
      });

      return picture;
    } catch (error) {
      this.logger.error({
        module: "PictureRepository",
        fn: "getPictureById",
        message: "Error fetching picture by ID",
        id,
        error: error.message,
      });
      throw error;
    }
  }

  async getPicturesByProductId(productId) {
    try {
      const pictures = await this.prisma.picture.findMany({
        where: { productId },
        orderBy: { createdAt: "asc" },
      });

      this.logger.info({
        module: "PictureRepository",
        fn: "getPicturesByProductId",
        message: "Fetched pictures by product ID",
        productId,
        count: pictures.length,
      });

      return pictures;
    } catch (error) {
      this.logger.error({
        module: "PictureRepository",
        fn: "getPicturesByProductId",
        message: "Error fetching pictures for product",
        productId,
        error: error.message,
      });
      throw error;
    }
  }

  async toggleIsThumbnail(id) {
    try {
      const picture = await this.prisma.picture.findUnique({
        where: { id },
        select: { isThumbnail: true },
      });

      if (!picture) {
        throw new Error(`Picture with id ${id} not found`);
      }

      const updated = await this.prisma.picture.update({
        where: { id },
        data: { isThumbnail: !picture.isThumbnail },
      });

      this.logger.info({
        module: "PictureRepository",
        fn: "toggleIsThumbnail",
        message: `Toggled isThumbnail from ${
          picture.isThumbnail
        } to ${!picture.isThumbnail}`,
        id,
      });

      return updated;
    } catch (error) {
      this.logger.error({
        module: "PictureRepository",
        fn: "toggleIsThumbnail",
        message: "Error toggling isThumbnail",
        id,
        error: error.message,
      });
      throw error;
    }
  }

  async deletePicture(id) {
    try {
      await this.prisma.picture.delete({
        where: { id },
      });

      this.logger.info({
        module: "PictureRepository",
        fn: "deletePicture",
        message: "Deleted picture",
        id,
      });

      return { message: `Picture ${id} deleted successfully` };
    } catch (error) {
      this.logger.error({
        module: "PictureRepository",
        fn: "deletePicture",
        message: "Error deleting picture",
        id,
        error: error.message,
      });
      throw error;
    }
  }

  async deletePicturesByProductId(productId) {
    try {
      const deleted = await this.prisma.picture.deleteMany({
        where: { productId },
      });

      this.logger.info({
        module: "PictureRepository",
        fn: "deletePicturesByProductId",
        message: "Deleted all pictures for product",
        productId,
        deletedCount: deleted.count,
      });

      return deleted;
    } catch (error) {
      this.logger.error({
        module: "PictureRepository",
        fn: "deletePicturesByProductId",
        message: "Error deleting pictures for product",
        productId,
        error: error.message,
      });
      throw error;
    }
  }
}

export default PictureRepository;
