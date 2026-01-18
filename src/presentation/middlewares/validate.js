/**
 * @file validate.js
 * @description Request validation middleware using Joi.
 */

const AppError = require('../../shared/errors/AppError');

/**
 * Creates a validation middleware for request data.
 * @param {Joi.Schema} schema - Joi schema for validation.
 * @param {'body' | 'query' | 'params'} source - Request property to validate.
 * @returns {import('express').RequestHandler}
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source];

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      return next(AppError.badRequest(message, 'VALIDATION_ERROR'));
    }

    // Replace request data with validated and sanitized data
    req[source] = value;
    next();
  };
};

module.exports = validate;
