class PictureController {
  constructor(pictureService, logger) {
    this.pictureService = pictureService;
    this.logger = logger;
  }

  async uploadAndSavePicture(req, res) {
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

      const uploadedPicture = await this.pictureService.uploadAndSavePicture(
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

      return res.status(201).json(uploadedPicture);
    } catch (error) {
      this.logger.error({
        module: "PictureController",
        fn: "uploadAndSavePicture",
        message: error.message,
      });
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getPicturesByProductId(req, res) {
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

      return res.status(200).json(pictures);
    } catch (error) {
      this.logger.error({
        module: "PictureController",
        fn: "getPicturesByProductId",
        message: error.message,
      });
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async toggleIsThumbnail(req, res) {
    try {
      const { id } = req.params;
      const updated = await this.pictureService.updateIsThumbnail(parseInt(id));

      this.logger.info({
        module: "PictureController",
        fn: "toggleIsThumbnail",
        message: "Toggled isThumbnail",
        id,
        isThumbnail: updated.isThumbnail,
      });

      return res.status(200).json(updated);
    } catch (error) {
      this.logger.error({
        module: "PictureController",
        fn: "toggleIsThumbnail",
        message: error.message,
      });
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async deletePicture(req, res) {
    try {
      const { id } = req.params;
      await this.pictureService.deletePicture(parseInt(id));

      this.logger.info({
        module: "PictureController",
        fn: "deletePicture",
        message: "Deleted picture",
        id,
      });

      return res
        .status(200)
        .json({ message: `Picture ${id} deleted successfully` });
    } catch (error) {
      this.logger.error({
        module: "PictureController",
        fn: "deletePicture",
        message: error.message,
      });
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async deletePicturesByProductId(req, res) {
    try {
      const { productId } = req.params;
      await this.pictureService.deletePicturesByProductId(parseInt(productId));

      this.logger.info({
        module: "PictureController",
        fn: "deletePicturesByProductId",
        message: "Deleted all pictures for product",
        productId,
      });

      return res.status(200).json({
        message: `All pictures for product ${productId} deleted successfully`,
      });
    } catch (error) {
      this.logger.error({
        module: "PictureController",
        fn: "deletePicturesByProductId",
        message: error.message,
      });
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default PictureController;
