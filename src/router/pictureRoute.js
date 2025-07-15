import express from "express";

const router = express.Router();

const pictureRoutes = (
  pictureController,
  authenticationMiddleware,
  roleMiddleware,
  pictureValidator
) => {
  router.post(
    "/upload",
    [
      authenticationMiddleware.authenticate(),
      roleMiddleware.authorize(),
      pictureValidator.validateUploadPicture(),
    ],
    pictureController.uploadAndSavePicture()
  );

  router.get(
    "/product/:productId",
    [authenticationMiddleware.authenticate(), roleMiddleware.authorize()],
    pictureController.getPicturesByProductId()
  );

  router.patch(
    "/:id/toggle-thumbnail",
    [
      authenticationMiddleware.authenticate(),
      roleMiddleware.authorize(),
      pictureValidator.validateUpdatePicture(),
    ],
    pictureController.toggleIsThumbnail()
  );

  router.delete(
    "/:id",
    [authenticationMiddleware.authenticate(), roleMiddleware.authorize()],
    pictureController.deletePicture()
  );

  router.delete(
    "/product/:productId",
    [authenticationMiddleware.authenticate(), roleMiddleware.authorize()],
    pictureController.deletePicturesByProductId()
  );

  return router;
};

export default pictureRoutes;
