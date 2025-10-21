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
        .email({ tlds: { allow: false } })
        .required(),
      password: Joi.string()
        .min(8)
        .pattern(/[A-Z]/, "uppercase")
        .pattern(/[a-z]/, "lowercase")
        .pattern(/[0-9]/, "number")
        .pattern(/[\W_]/, "special character")
        .optional(),
      name: Joi.string().trim().required(),

      surname: Joi.string().trim().required(),

      role: Joi.string()
        .valid("ADMIN", "SUPER_ADMIN", "EMPLOYEE", "CUSTOMER")
        .optional(),

      // Optional extra fields (if you’re sending them)
      address: Joi.string().optional().allow(""),
      city: Joi.string().optional().allow(""),
      country: Joi.string().optional().allow(""),
      postCode: Joi.string().optional().allow(""),
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
