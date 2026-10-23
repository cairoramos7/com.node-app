/**
 * @file errorHandler.ts
 * @description Global error handling middleware for Express.
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors';
import { Logger } from '../../infrastructure/logger/logger';

interface ErrorResponse {
    success: boolean;
    error: {
        code: string;
        message: string;
        statusCode: number;
        timestamp: string;
        fields?: Record<string, string>;
        stack?: string;
    };
}

/**
 * Global error handler middleware.
 * @param {any} err - The error object.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} _next - Express next function.
 */
const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction): void => {
    // Default error values
    let statusCode = 500;
    let message = 'Internal Server Error';
    let code = 'INTERNAL_ERROR';
    let isOperational = false;
    let fields: Record<string, string> | undefined;

    // Handle our custom AppError instances
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        code = err.code;
        isOperational = err.isOperational;
        // Handle ValidationError fields
        if ('fields' in err && typeof err.fields === 'object' && err.fields !== null) {
            fields = err.fields as Record<string, string>;
        }
    }
    // Handle Mongoose validation errors
    else if (err.name === 'ValidationError') {
        statusCode = 400;
        code = 'VALIDATION_ERROR';
        message = 'Validation failed';
        isOperational = true;
        fields = {} as Record<string, string>;
        Object.keys(err.errors).forEach((key) => {
            if (fields) {
                fields[key] = err.errors[key].message;
            }
        });
    }
    // Handle Mongoose duplicate key error
    else if (err.code === 11000) {
        statusCode = 409;
        code = 'DUPLICATE_KEY';
        isOperational = true;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
    }
    // Handle Mongoose cast error (invalid ObjectId)
    else if (err.name === 'CastError') {
        statusCode = 400;
        code = 'INVALID_ID';
        isOperational = true;
        message = `Invalid ${err.path}: ${err.value}`;
    }
    // Handle JWT errors
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        code = 'INVALID_TOKEN';
        isOperational = true;
        message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        code = 'TOKEN_EXPIRED';
        isOperational = true;
        message = 'Token has expired';
    } else {
        // Unknown/programming error
        statusCode = err.statusCode || 500;
        message = err.message || 'Internal Server Error';
        code = err.code || 'INTERNAL_ERROR';
    }

    // Log errors appropriately
    if (!isOperational || process.env.NODE_ENV === 'development') {
        Logger.error('Error:', {
            name: err.name,
            message: err.message,
            code,
            statusCode,
            stack: err.stack,
            isOperational,
        });
    } else {
        // Log operational errors without stack trace
        Logger.warn('Operational Error:', {
            code,
            message,
            statusCode,
            path: req.path,
            method: req.method,
        });
    }

    // Build error response
    const errorResponse: ErrorResponse = {
        success: false,
        error: {
            code,
            message,
            statusCode,
            timestamp: new Date().toISOString(),
        },
    };

    // Include validation fields if present
    if (fields) {
        errorResponse.error.fields = fields;
    }

    // Include stack trace only in development for non-operational errors
    if (process.env.NODE_ENV === 'development' && !isOperational) {
        errorResponse.error.stack = err.stack;
    }

    res.status(statusCode).json(errorResponse);
};

export default errorHandler;
