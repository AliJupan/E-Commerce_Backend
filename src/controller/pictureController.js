import BaseController from "./BaseController.js";

class PictureController extends BaseController {
  constructor(pictureService, logger) {
    super(logger, "PictureController");
    this.pictureService = pictureService;
  }

  uploadAndSavePicture() {
    return this.handleRequest("uploadAndSavePicture", async (req) => {
      const { productId, isThumbnail } = req.body;
      const picture = req.files?.pictures;

      if (!picture) {
        return { status: 400, data: { message: "No picture provided" } };
      }

      const uploadedPicture = await this.pictureService.uploadAndSavePicture(
        picture,
        parseInt(productId),
        isThumbnail
      );

      this.logInfo("uploadAndSavePicture", "Uploaded and saved picture", {
        productId,
        isThumbnail,
      });

      return { status: 201, data: uploadedPicture };
    });
  }

  getPicturesByProductId() {
    return this.handleRequest("getPicturesByProductId", async (req) => {
      const { productId } = req.params;
      const pictures = await this.pictureService.getPicturesByProductId(
        parseInt(productId)
      );

      this.logInfo("getPicturesByProductId", "Fetched pictures for product", {
        productId,
      });

      return { data: pictures };
    });
  }

  toggleIsThumbnail() {
    return this.handleRequest("toggleIsThumbnail", async (req) => {
      const { id } = req.params;
      const updated = await this.pictureService.updateIsThumbnail(parseInt(id));

      this.logInfo("toggleIsThumbnail", "Toggled isThumbnail", {
        id,
        isThumbnail: updated.isThumbnail,
      });

      return { data: updated };
    });
  }

  deletePicture() {
    return this.handleRequest("deletePicture", async (req) => {
      const { id } = req.params;
      await this.pictureService.deletePicture(parseInt(id));

      this.logInfo("deletePicture", "Deleted picture", { id });

      return { data: { message: `Picture ${id} deleted successfully` } };
    });
  }

  deletePicturesByProductId() {
    return this.handleRequest("deletePicturesByProductId", async (req) => {
      const { productId } = req.params;
      await this.pictureService.deletePicturesByProductId(parseInt(productId));

      this.logInfo(
        "deletePicturesByProductId",
        "Deleted all pictures for product",
        { productId }
      );

      return {
        data: {
          message: `All pictures for product ${productId} deleted successfully`,
        },
      };
    });
  }
}

export default PictureController;
