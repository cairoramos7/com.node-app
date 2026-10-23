/**
 * @file task.schemas.ts
 * @description Validation schemas for task routes.
 */

import Joi from 'joi';

export const createTaskSchema = Joi.object({
    title: Joi.string().min(3).max(200).required().messages({
        'string.min': 'Title must be at least 3 characters',
        'string.max': 'Title must not exceed 200 characters',
        'any.required': 'Title is required',
    }),
    description: Joi.string().allow('').optional().messages({
        'string.base': 'Description must be a string',
    }),
    isCompleted: Joi.boolean().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
});

export const updateTaskSchema = Joi.object({
    title: Joi.string().min(3).max(200).optional(),
    description: Joi.string().allow('').optional(),
    isCompleted: Joi.boolean().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
})
    .min(1)
    .messages({
        'object.min': 'At least one field must be provided for update',
    });
