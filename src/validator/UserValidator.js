import JoiBase from "joi";
import JoiDate from "@joi/date";
import BaseValidator from "./BaseValidator.js";

const Joi = JoiBase.extend(JoiDate);

export default class UserValidator extends BaseValidator {
  constructor(logger) {
    super(logger);
  }

  validateUserRegistration() {
    const schema = Joi.object({
      email: Joi.string()
        .email()
        // .pattern(new RegExp("^[a-zA-Z0-9._%+-]+@gmail\\.com$"))
        .required(),
      //   password: Joi.string().min(8).required(),
      name: Joi.string().required(),
      role: Joi.string().valid("ADMIN", "SUPER_ADMIN").optional(),
    });

    return this.validateAndContinue(schema);
  }

  validateUserLogin() {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    return this.validateAndContinue(schema);
  }

  validateUpdateUser() {
    const schema = Joi.object({
      // email: Joi.string()
      //   .email()
      //   .pattern(new RegExp("^[a-zA-Z0-9._%+-]+@gmail\\.com$"))
      //   .optional(),
      password: Joi.string().min(8).optional(),
      name: Joi.string().optional(),
      // role: Joi.string().valid("ADMIN", "SUPER_ADMIN").optional(),
    });

    return this.validateAndContinue(schema);
  }
}
