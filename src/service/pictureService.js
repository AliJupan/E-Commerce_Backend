class PictureService {
  constructor(pictureRepository, logger, fileUploadLib) {
    this.pictureRepository = pictureRepository;
    this.fileUploadLib = fileUploadLib;
    this.logger = logger;
  }

  async uploadAndSavePicture(picture, productId, isThumbnail,addedById) {
    try {
      const uploaded = await this.fileUploadLib.upload(picture);

      const pictureName = uploaded.fileID;

      const result = await this.pictureRepository.createPicture({
        url: pictureName,
        isThumbnail,
        productId,
        addedById
      });

      this.logger.info({
        module: "PictureService",
        fn: "uploadAndSavePicture",
        message: "Uploaded and saved picture",
        productId,
        isThumbnail,
        url: pictureName,
      });

      return result;
    } catch (error) {
      this.logger.error({
        module: "PictureService",
        fn: "uploadAndSavePicture",
        message: "Failed to upload and save picture",
        productId,
        error: error.message,
      });
      throw error;
    }
  }

  async getPicturesByProductId(productId) {
    try {
      const result = await this.pictureRepository.getPicturesByProductId(
        productId
      );

      this.logger.info({
        module: "PictureService",
        fn: "getPicturesByProductId",
        message: "Fetched pictures by product ID",
        productId,
      });

      return result;
    } catch (error) {
      this.logger.error({
        module: "PictureService",
        fn: "getPicturesByProductId",
        message: "Failed to get pictures",
        listingId,
        error: error.message,
      });
      throw error;
    }
  }

  async updateIsThumbnail(id) {
    try {
      const currentPic = await this.pictureRepository.getPictureById(id);

      if (!currentPic) {
        throw new Error(`Picture with id ${id} not found`);
      }

      if (!currentPic.isThumbnail) {
        const otherPictures =
          await this.pictureRepository.getPicturesByProductId(
            currentPic.productId
          );

        for (const pic of otherPictures) {
          if (pic.isThumbnail && pic.id !== id) {
            await this.pictureRepository.updateIsThumbnail(pic.id);
          }
        }
      }

      const result = await this.pictureRepository.updateIsThumbnail(id);

      this.logger.info({
        module: "PictureService",
        fn: "updateIsThumbnail",
        message: "Toggled isThumbnail",
        id,
        isThumbnail: result.isThumbnail,
      });

      return result;
    } catch (error) {
      this.logger.error({
        module: "PictureService",
        fn: "updateIsThumbnail",
        message: "Failed to toggle isThumbnail",
        id,
        error: error.message,
      });
      throw error;
    }
  }

  async deletePicture(id) {
    try {
      const picture = await this.pictureRepository.getPictureById(id);

      //   const marker = "/listing-images";
      //   const idx = picture.url.indexOf(marker);

      //   const relativePath =
      //     idx !== -1 ? picture.url.substring(idx + marker.length) : null;

      //   if (relativePath) {
      //     const cleanPath = relativePath.startsWith("/")
      //       ? relativePath.slice(1)
      //       : relativePath;
      //     await this.fileUploadLib.delete(cleanPath);
      //   } else {
      //     this.logger.warn({
      //       module: "PictureService",
      //       fn: "deletePicture",
      //       message: "Invalid picture URL path",
      //       url: picture.url,
      //     });
      //   }

      await this.fileUploadLib.delete(picture.url);
      await this.pictureRepository.deletePicture(id);

      if (picture.isThumbnail) {
        const otherPictures = await this.getPicturesByProductId(
          picture.productId
        );
        if (otherPictures.length > 0) {
          const newThumbnail = otherPictures[0];
          await this.updateIsThumbnail(newThumbnail.id);

          this.logger.info({
            module: "PictureService",
            fn: "deletePicture",
            message: "Assigned new thumbnail after deletion",
            productId: picture.productId,
            newThumbnailId: newThumbnail.id,
          });
        }
      }

      this.logger.info({
        module: "PictureService",
        fn: "deletePicture",
        message: "Deleted picture",
        id,
      });

      return { success: true };
    } catch (error) {
      this.logger.error({
        module: "PictureService",
        fn: "deletePicture",
        message: "Failed to delete picture",
        id,
        error: error.message,
      });
      throw error;
    }
  }

  async deletePicturesByProductId(productId) {
    try {
      const pictures = await this.getPicturesByProductId(productId);

      for (const pic of pictures) {
        await this.fileUploadLib.delete(pic.url);
      }

      const result = await this.pictureRepository.deletePicturesByProductId(
        productId
      );

      this.logger.info({
        module: "PictureService",
        fn: "deletePicturesByProductId",
        message: "Deleted all pictures for product",
        productId,
        count: pictures.length,
      });

      return result;
    } catch (error) {
      this.logger.error({
        module: "PictureService",
        fn: "deletePicturesByListingId",
        message: "Failed to delete pictures for listing",
        listingId,
        error: error.message,
      });
      throw error;
    }
  }
}

export default PictureService;
