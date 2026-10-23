/**
 * @file user.schemas.ts
 * @description Validation schemas for user routes.
 */

import Joi from 'joi';

export const updateNameSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name must not exceed 100 characters',
        'any.required': 'Name is required',
    }),
});

export const updateEmailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
});

export const confirmEmailSchema = Joi.object({
    token: Joi.string().required().messages({
        'any.required': 'Confirmation token is required',
    }),
});

export const updatePasswordSchema = Joi.object({
    oldPassword: Joi.string().required().messages({
        'any.required': 'Old password is required',
    }),
    newPassword: Joi.string()
        .min(8)
        .max(100)
        .required()
        .pattern(/[A-Z]/)
        .pattern(/[a-z]/)
        .pattern(/[0-9]/)
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.max': 'Password must not exceed 100 characters',
            'string.pattern.base':
                'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            'any.required': 'New password is required',
        }),
});
