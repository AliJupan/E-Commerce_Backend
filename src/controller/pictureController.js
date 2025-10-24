class PictureController {
  constructor(pictureService, logger) {
    this.pictureService = pictureService;
    this.logger = logger;
  }

  uploadAndSavePicture() {
    return [
      async (req, res) => {
        try {
          const { productId, isThumbnail } = req.body;
          const picture = req.files?.pictures;

          if (!picture) {
            this.logger.error({
              module: "PictureController",
              fn: "uploadAndSavePicture",
              message: "No picture provided",
              productId,
            });
            return res.status(400).json({ message: "No picture provided" });
          }

          const uploadedPicture =
            await this.pictureService.uploadAndSavePicture(
              picture,
              productId,
              isThumbnail
            );

          this.logger.info({
            module: "PictureController",
            fn: "uploadAndSavePicture",
            message: "Uploaded and saved picture",
            productId,
            isThumbnail,
          });

          res.status(201).json(uploadedPicture);
        } catch (error) {
          this.logger.error({
            module: "PictureController",
            fn: "uploadAndSavePicture",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }

  getPicturesByProductId() {
    return [
      async (req, res) => {
        try {
          const { productId } = req.params;
          const pictures = await this.pictureService.getPicturesByProductId(
            productId
          );

          this.logger.info({
            module: "PictureController",
            fn: "getPicturesByProductId",
            message: "Fetched pictures for product",
            productId,
          });

          res.status(200).json(pictures);
        } catch (error) {
          this.logger.error({
            module: "PictureController",
            fn: "getPicturesByProductId",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }

  toggleIsThumbnail() {
    return [
      async (req, res) => {
        try {
          const { id } = req.params;
          const updated = await this.pictureService.updateIsThumbnail(id);

          this.logger.info({
            module: "PictureController",
            fn: "toggleIsThumbnail",
            message: "Toggled isThumbnail",
            id,
            isThumbnail: updated.isThumbnail,
          });

          res.status(200).json(updated);
        } catch (error) {
          this.logger.error({
            module: "PictureController",
            fn: "toggleIsThumbnail",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }

  deletePicture() {
    return [
      async (req, res) => {
        try {
          const { id } = req.params;
          await this.pictureService.deletePicture(id);

          this.logger.info({
            module: "PictureController",
            fn: "deletePicture",
            message: "Deleted picture",
            id,
          });

          res
            .status(200)
            .json({ message: `Picture ${id} deleted successfully` });
        } catch (error) {
          this.logger.error({
            module: "PictureController",
            fn: "deletePicture",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }

  deletePicturesByProductId() {
    return [
      async (req, res) => {
        try {
          const { productId } = req.params;
          await this.pictureService.deletePicturesByProductId(productId);

          this.logger.info({
            module: "PictureController",
            fn: "deletePicturesByProductId",
            message: "Deleted all pictures for product",
            productId,
          });

          res.status(200).json({
            message: `All pictures for product ${productId} deleted successfully`,
          });
        } catch (error) {
          this.logger.error({
            module: "PictureController",
            fn: "deletePicturesByProductId",
            message: error.message,
          });
          res.status(500).json({ error: "Internal server error" });
        }
      },
    ];
  }
}

export default PictureController;
