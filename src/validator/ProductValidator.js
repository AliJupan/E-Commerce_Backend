import JoiBase from "joi";
import JoiDate from "@joi/date";
import BaseValidator from "./BaseValidator.js";

const Joi = JoiBase.extend(JoiDate);

export default class ProductValidator extends BaseValidator {
  constructor(logger) {
    super(logger);
  }

  validateCreateProduct() {
    const schema = Joi.object({
      name: Joi.string().max(20).required(),
      category: Joi.string().max(20).required(),
      price: Joi.number().min(0).required(),
      description: Joi.string().required(),
      quantity: Joi.number().integer().min(0).required(),
      // addedById: Joi.number().integer().required(),
    });

    return this.validateAndContinue(schema);
  }

  validateUpdateProduct() {
    const schema = Joi.object({
      name: Joi.string().max(20).optional(),
      category: Joi.string().max(20).optional(),
      price: Joi.number().min(0).optional(),
      description: Joi.string().max(100).optional(),
      quantity: Joi.number().integer().min(0).optional(),
    });

    return this.validateAndContinue(schema);
  }
}
