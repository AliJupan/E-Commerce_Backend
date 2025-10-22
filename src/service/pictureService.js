import path from "path";

class PictureService {
  constructor( pictureRepository, fileUploadLib, logger ) {
    this.pictureRepository = pictureRepository;
    this.fileUploadLib = fileUploadLib;
    this.logger = logger;
  }

  async uploadAndSavePicture(picture, productId, isThumbnail, addedById) {
    try {
      const uploaded = await this.fileUploadLib.upload(picture);
      const originalExtension = path.extname(picture.name);
      const pictureName = uploaded.fileID + originalExtension;

      const result = await this.pictureRepository.createPicture({
        url: pictureName,
        isThumbnail,
        productId: parseInt(addedById),
        addedById: parseInt(addedById),
      });

      this.logger?.info({
        module: "PictureService",
        fn: "uploadAndSavePicture",
        message: "Uploaded and saved picture",
        productId,
        isThumbnail,
        url: pictureName,
      });

      return result;
    } catch (error) {
      this.logger?.error({
        module: "PictureService",
        fn: "uploadAndSavePicture",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getPicturesByProductId(productId) {
    try {
      const result = await this.pictureRepository.getPicturesByProductId(
        parseInt(productId)
      );
      this.logger?.info({
        module: "PictureService",
        fn: "getPicturesByProductId",
        message: "Fetched pictures by product ID",
        productId,
        count: result.length,
      });
      return result;
    } catch (error) {
      this.logger?.error({
        module: "PictureService",
        fn: "getPicturesByProductId",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getThumbnailByProductId(productId) {
    try {
      const result = await this.pictureRepository.getThumbnailByProductId(
        parseInt(productId)
      );
      this.logger?.info({
        module: "PictureService",
        fn: "getThumbnailByProductId",
        message: "Fetched thumbnail by product ID",
        productId,
        thumbnailId: result?.id,
      });
      return result;
    } catch (error) {
      this.logger?.error({
        module: "PictureService",
        fn: "getThumbnailByProductId",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async toggleIsThumbnail(pictureId) {
    try {
      const currentPic = await this.pictureRepository.getPictureById(
        parseInt(pictureId)
      );
      if (!currentPic)
        throw new Error(`Picture with id ${pictureId} not found`);

      if (!currentPic.isThumbnail) {
        const otherPictures =
          await this.pictureRepository.getPicturesByProductId(
            parseInt(currentPic.productId)
          );
        await Promise.all(
          otherPictures
            .filter((pic) => pic.isThumbnail && pic.id !== pictureId)
            .map((pic) =>
              this.pictureRepository.toggleIsThumbnail(parseInt(pic.id))
            )
        );
      }

      const result = await this.pictureRepository.toggleIsThumbnail(
        parseInt(pictureId)
      );
      this.logger?.info({
        module: "PictureService",
        fn: "toggleIsThumbnail",
        message: "Toggled isThumbnail",
        pictureId,
        isThumbnail: result.isThumbnail,
      });
      return result;
    } catch (error) {
      this.logger?.error({
        module: "PictureService",
        fn: "toggleIsThumbnail",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async deletePicture(id) {
    try {
      const picture = await this.pictureRepository.getPictureById(parseInt(id));
      if (!picture) throw new Error(`Picture with id ${id} not found`);

      await this.fileUploadLib.delete(picture.url);
      await this.pictureRepository.deletePicture(parseInt(id));

      if (picture.isThumbnail) {
        const otherPictures = await this.getPicturesByProductId(
          picture.productId
        );
        if (otherPictures.length > 0) {
          await this.toggleIsThumbnail(otherPictures[0].id);
          this.logger?.info({
            module: "PictureService",
            fn: "deletePicture",
            message: "Assigned new thumbnail after deletion",
            productId: picture.productId,
            newThumbnailId: otherPictures[0].id,
          });
        }
      }

      this.logger?.info({
        module: "PictureService",
        fn: "deletePicture",
        message: "Deleted picture",
        pictureId: id,
      });
      return { success: true };
    } catch (error) {
      this.logger?.error({
        module: "PictureService",
        fn: "deletePicture",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async deletePicturesByProductId(productId) {
    try {
      const pictures = await this.getPicturesByProductId(parseInt(productId));
      await Promise.all(
        pictures.map((pic) => this.fileUploadLib.delete(pic.url))
      );

      const result = await this.pictureRepository.deletePicturesByProductId(
        parseInt(productId)
      );

      this.logger?.info({
        module: "PictureService",
        fn: "deletePicturesByProductId",
        message: "Deleted all pictures for product",
        productId,
        count: pictures.length,
      });

      return result;
    } catch (error) {
      this.logger?.error({
        module: "PictureService",
        fn: "deletePicturesByProductId",
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}

export default PictureService;
