import logger from "./utils/logger.js";
import { prisma } from "./config/database.js";

import UserRepository from "./repository/userRepository.js";
import UserService from "./service/userService.js";
import UserController from "./controller/userController.js";

import ProductRepository from "./repository/productRepository.js";
import ProductService from "./service/productService.js";
import ProductController from "./controller/productController.js";

import PictureRepository from "./repository/pictureRepository.js";
import PictureService from "./service/pictureService.js";
import PictureController from "./controller/pictureController.js";

import EmailService from "./service/emailService.js";
import EmailTemplate from "./static/email/EmailTemplate.js";

import FileUploadLib from "./service/FileUploadLib.js";

import UserValidator from "./validator/UserValidator.js";
import ProductValidator from "./validator/ProductValidator.js";

const userValidator = new UserValidator(logger);
const productValidator = new ProductValidator(logger);

const emailTemplate = new EmailTemplate(logger);
const emailService = new EmailService(logger, emailTemplate);

const fileUploadLib = new FileUploadLib("../uploads", logger);

const pictureRepository = new PictureRepository(prisma, logger);
const pictureService = new PictureService(
  pictureRepository,
  logger,
  fileUploadLib
);
const pictureController = new PictureController(pictureService, logger);

const userRepository = new UserRepository(prisma, logger);
const userService = new UserService(userRepository, emailService, logger);
const userController = new UserController(userService, logger);

const productRepository = new ProductRepository(prisma, logger);
const productService = new ProductService(
  productRepository,
  pictureService,
  logger
);
const productController = new ProductController(productService, logger);

export {
  userController,
  productController,
  pictureController,
  userValidator,
  productValidator,
};
