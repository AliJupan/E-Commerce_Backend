import logger from "./utils/logger.js";
import { prisma } from "./config/database.js";

import UserRepository from "./repository/userRepository.js";
import UserService from "./service/userService.js";
import UserController from "./controller/userController.js";

import EmailService from "./service/emailService.js";
import EmailTemplate from "./static/email/EmailTemplate.js";

import UserValidator from "./validator/UserValidator.js";

const userValidator = new UserValidator(logger);

const emailTemplate = new EmailTemplate(logger);
const emailService = new EmailService(logger,emailTemplate);

const userRepository = new UserRepository(prisma,logger);
const userService = new UserService(userRepository,emailService,logger);
const userController = new UserController(userService,logger);

export {
    userController,
    userValidator
}