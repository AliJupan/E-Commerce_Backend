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
            return res.status(400).json({ message: "No picture provided" });
          }

          const uploadedPicture =
            await this.pictureService.uploadAndSavePicture(
              picture,
              parseInt(productId),
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
            message: "Error uploading and saving picture",
            productId: req.body?.productId,
            error: error.message,
          });
          res.status(500).json({ error: error.message });
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
            parseInt(productId)
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
            message: "Error fetching pictures by product ID",
            listingId: req.params?.productId,
            error: error.message,
          });
          res.status(500).json({ error: error.message });
        }
      },
    ];
  }

  toggleIsThumbnail() {
    return [
      async (req, res) => {
        try {
          const { id } = req.params;

          const updated = await this.pictureService.updateIsThumbnail(
            parseInt(id)
          );

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
            message: "Error toggling isThumbnail",
            id: req.params?.id,
            error: error.message,
          });
          res.status(500).json({ error: error.message });
        }
      },
    ];
  }

  deletePicture() {
    return [
      async (req, res) => {
        try {
          const { id } = req.params;
          await this.pictureService.deletePicture(parseInt(id));

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
            message: "Error deleting picture",
            id: req.params?.id,
            error: error.message,
          });
          res.status(500).json({ error: error.message });
        }
      },
    ];
  }

  deletePicturesByProductId() {
    return [
      async (req, res) => {
        try {
          const { productId } = req.params;
          await this.pictureService.deletePicturesByProductId(
            parseInt(productId)
          );

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
            message: "Error deleting pictures for product",
            productId: req.params?.productId,
            error: error.message,
          });
          res.status(500).json({ error: error.message });
        }
      },
    ];
  }
}

export default PictureController;
