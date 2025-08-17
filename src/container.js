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

import OrderRepository from "./repository/orderRepository.js";
import OrderService from "./service/orderService.js";
import OrderController from "./controller/orderController.js";

import OrderDetailsRepository from "./repository/orderDetailsRepository.js";
import OrderDetailsService from "./service/orderDetailsService.js";

import InvoiceRepository from "./repository/invoiceRepository.js";
import InvoiceService from "./service/InvoiceService.js";

import EmailService from "./service/emailService.js";
import EmailTemplate from "./static/email/EmailTemplate.js";

import FileUploadLib from "./service/FileUploadLib.js";

import UserValidator from "./validator/UserValidator.js";
import ProductValidator from "./validator/ProductValidator.js";
import OrderValidator from "./validator/OrderValidator.js";

const userValidator = new UserValidator(logger);
const productValidator = new ProductValidator(logger);
const orderValidator = new OrderValidator(logger);

const emailTemplate = new EmailTemplate(logger);
const emailService = new EmailService(logger, emailTemplate);

const fileUploadLib = new FileUploadLib("../uploads", logger);

const pictureRepository = new PictureRepository(prisma);
const pictureService = new PictureService(
  pictureRepository,
  logger,
  fileUploadLib
);
const pictureController = new PictureController(pictureService, logger);

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository, emailService, logger);
const userController = new UserController(userService, logger);

const productRepository = new ProductRepository(prisma);
const productService = new ProductService(
  productRepository,
  pictureService,
  logger
);
const productController = new ProductController(productService, logger);

const orderDetailsRepository = new OrderDetailsRepository(prisma);
const orderDetailsService = new OrderDetailsService(logger,orderDetailsRepository);

const orderRepository = new OrderRepository(prisma);
const orderService = new OrderService(orderRepository,logger,fileUploadLib,orderDetailsService,productService,emailService,userService);
const orderController = new OrderController(orderService,logger);

const invoiceRepository = new InvoiceRepository(prisma);
const invoiceService = new InvoiceService(invoiceRepository, orderService, fileUploadLib, logger);

orderService.setInvoiceService(invoiceService);

export {
  userController,
  productController,
  pictureController,
  orderController,
  userValidator,
  productValidator,
  orderValidator
};
