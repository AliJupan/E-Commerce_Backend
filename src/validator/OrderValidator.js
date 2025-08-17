import JoiBase from "joi";
import JoiDate from "@joi/date";
import BaseValidator from "./BaseValidator.js";

const Joi = JoiBase.extend(JoiDate);

export default class OrderValidator extends BaseValidator {
  constructor(logger) {
    super(logger);
  }

  validateCreateOrder() {
    const schema = Joi.object({
      name: Joi.string().max(20).required(),
      surname: Joi.string().max(20).required(),
      email: Joi.string().email().max(40).required(),
      country: Joi.string().max(40).required(),
      city: Joi.string().max(20).required(),
      postalCode: Joi.string().max(20).required(),
      address: Joi.string().max(40).required(),
      // Order items
      items: Joi.array()
        .items(
          Joi.object({
            productId: Joi.number().integer().required(),
            quantity: Joi.number().integer().min(1).required(),
          })
        )
        .min(1)
        .required(),
    });

    return this.validateAndContinue(schema);
  }

  validateUpdateOrder() {
    const schema = Joi.object({
      name: Joi.string().max(20).optional(),
      surname: Joi.string().max(20).optional(),
      email: Joi.string().email().max(40).optional(),
      country: Joi.string().max(40).optional(),
      city: Joi.string().max(20).optional(),
      postalCode: Joi.string().max(20).optional(),
      address: Joi.string().max(40).optional(),
      isDelivered: Joi.boolean().optional(),
      isPaid: Joi.boolean().optional(),
    });

    return this.validateAndContinue(schema);
  }
}
