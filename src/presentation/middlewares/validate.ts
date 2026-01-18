/**
 * @file validate.ts
 * @description Request validation middleware using Joi.
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi from 'joi';
import AppError from '../../shared/errors/AppError';

// Define strict types for source
type ValidationSource = 'body' | 'query' | 'params';

/**
 * Creates a validation middleware for request data.
 * @param {Joi.Schema} schema - Joi schema for validation.
 * @param {ValidationSource} source - Request property to validate.
 * @returns {RequestHandler}
 */
const validate = (schema: Joi.Schema, source: ValidationSource = 'body'): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
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

export default validate;
