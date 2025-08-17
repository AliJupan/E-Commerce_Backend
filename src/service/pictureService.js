import path from "path";
import BaseService from "./BaseService.js"; // Adjust path as needed

class PictureService extends BaseService {
  constructor(pictureRepository, logger, fileUploadLib) {
    super(logger);
    this.pictureRepository = pictureRepository;
    this.fileUploadLib = fileUploadLib;
  }

  uploadAndSavePicture(picture, productId, isThumbnail, addedById) {
    return this.wrapAsync("uploadAndSavePicture", async () => {
      const uploaded = await this.fileUploadLib.upload(picture);
      const originalExtension = path.extname(picture.name);
      const pictureName = uploaded.fileID + originalExtension;

      const result = await this.pictureRepository.createPicture({
        url: pictureName,
        isThumbnail,
        productId,
        addedById,
      });

      this.logInfo("uploadAndSavePicture", "Uploaded and saved picture", {
        productId,
        isThumbnail,
        url: pictureName,
      });

      return result;
    });
  }

  getPicturesByProductId(productId) {
    return this.wrapAsync("getPicturesByProductId", async () => {
      const result = await this.pictureRepository.getPicturesByProductId(
        productId
      );

      this.logInfo("getPicturesByProductId", "Fetched pictures by product ID", {
        productId,
      });

      return result;
    });
  }

  getThumbnailByProductId(productId) {
    return this.wrapAsync("getThumbnailByProductId", async () => {
      const result = await this.pictureRepository.getThumbnailByProductId(
        productId
      );

      this.logInfo(
        "getThumbnailByProductId",
        "Fetched thumbnail by product ID",
        {
          productId,
        }
      );

      return result;
    });
  }

  async toggleIsThumbnail(pictureId) {
    const currentPic = await this.pictureRepository.getPictureById(pictureId);
    if (!currentPic) throw new Error(`Picture with id ${pictureId} not found`);

    // If current picture is NOT a thumbnail, find any other thumbnails and unset them
    if (!currentPic.isThumbnail) {
      const otherPictures = await this.pictureRepository.getPicturesByProductId(
        currentPic.productId
      );
      for (const pic of otherPictures) {
        if (pic.isThumbnail && pic.id !== pictureId) {
          // Unset other thumbnails by toggling them off only if they are ON
          await this.pictureRepository.toggleIsThumbnail(pic.id);
        }
      }
    }

    // Toggle the thumbnail flag for current picture
    const result = await this.pictureRepository.toggleIsThumbnail(pictureId);

    this.logger.info("toggleIsThumbnail", "Toggled isThumbnail", {
      id: pictureId,
      isThumbnail: result.isThumbnail,
    });

    return result;
  }

  deletePicture(id) {
    return this.wrapAsync("deletePicture", async () => {
      const picture = await this.pictureRepository.getPictureById(id);

      await this.fileUploadLib.delete(picture.url);
      await this.pictureRepository.deletePicture(id);

      if (picture.isThumbnail) {
        const otherPictures = await this.getPicturesByProductId(
          picture.productId
        );
        if (otherPictures.length > 0) {
          const newThumbnail = otherPictures[0];
          await this.updateIsThumbnail(newThumbnail.id);

          this.logInfo(
            "deletePicture",
            "Assigned new thumbnail after deletion",
            {
              productId: picture.productId,
              newThumbnailId: newThumbnail.id,
            }
          );
        }
      }

      this.logInfo("deletePicture", "Deleted picture", { id });
      return { success: true };
    });
  }

  deletePicturesByProductId(productId) {
    return this.wrapAsync("deletePicturesByProductId", async () => {
      const pictures = await this.getPicturesByProductId(productId);
      for (const pic of pictures) {
        await this.fileUploadLib.delete(pic.url);
      }

      const result = await this.pictureRepository.deletePicturesByProductId(
        productId
      );

      this.logInfo(
        "deletePicturesByProductId",
        "Deleted all pictures for product",
        {
          productId,
          count: pictures.length,
        }
      );

      return result;
    });
  }
}

export default PictureService;
