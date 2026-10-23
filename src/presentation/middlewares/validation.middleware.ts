/**
 * @file validation.middleware.ts
 * @description Middleware for request validation using Joi schemas.
 */

import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ValidationError } from '../../shared/errors';

export const validate = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const fields: Record<string, string> = {};
            error.details.forEach((detail) => {
                const fieldName = detail.path.join('.');
                fields[fieldName] = detail.message;
            });

            throw new ValidationError('Validation failed', fields);
        }

        req.body = value;
        next();
    };
};
