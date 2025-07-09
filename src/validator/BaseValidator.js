/**
 * Class representing a base validator.
 */
class BaseValidator {
  /**
   * Create a base validator.Base
   * @param  {Object}    logger The logger instance.
   * @throws {TypeError}        If some required property is missing.
   */
  constructor(logger) {
    this.logger = logger;
  }

  validateWithSchema(value, schema) {
    const validatorOptions = {
      abortEarly: false,
    };

    const { error } = schema.validate(value, validatorOptions);

    if (error && error.details) {
      throw new Error(error.details[0].message);
    }

    return null;
  }

  validateAndContinue(schema, paramsSchema) {
    return [
      async (req, res, next) => {
        try {
          if (paramsSchema && req.params) {
            this.validate(req.params, paramsSchema);
          }
          this.validate(req.body, schema);
        } catch (error) {
          this.logger.error(error.message);
          return res.status(403).json({
            success: false,
            error: error.message,
          });
        }

        return next();
      },
    ];
  }

  validateParamsAndContinue(paramsSchema) {
    return [
      async (req, res, next) => {
        try {
          this.validate(req.params, paramsSchema);
        } catch (error) {
          this.logger.error(error.message);
          return res.status(403).json({
            success: false,
            error: error.message,
          });
        }

        return next();
      },
    ];
  }

  validateQueryParamsAndContinue(paramsSchema) {
    return [
      async (req, res, next) => {
        try {
          this.validate(req.query, paramsSchema);
        } catch (error) {
          this.logger.error(error.message);
          return res.status(403).json({
            success: false,
            error: error.message,
          });
        }

        return next();
      },
    ];
  }

  validate(data, schema) {
    let errors;
    const validatorOptions = {
      abortEarly: false,
    };

    const { error } = schema.validate(data, validatorOptions);

    if (error && error.details) {
      errors = error.details.map((item) => item.message);

      throw new Error(errors.join(", "));
    }

    return data;
  }
}

export default BaseValidator;
