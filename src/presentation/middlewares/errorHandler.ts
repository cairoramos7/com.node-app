/**
 * @file errorHandler.ts
 * @description Global error handling middleware for Express.
 */

import { Request, Response, NextFunction } from 'express';
import AppError from '../../shared/errors/AppError';

interface ErrorResponse {
    success: boolean;
    error: {
        code: string;
        message: string;
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
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let code = err.code || 'INTERNAL_ERROR';

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        code = 'VALIDATION_ERROR';
        message = Object.values(err.errors)
            .map((e: any) => e.message)
            .join(', ');
    }

    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 409;
        code = 'DUPLICATE_KEY';
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
    }

    // Handle Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        code = 'INVALID_ID';
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        code = 'INVALID_TOKEN';
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        code = 'TOKEN_EXPIRED';
        message = 'Token has expired';
    }

    // Log error in development or test
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        console.error('Error:', {
            message: err.message,
            stack: err.stack,
            statusCode,
            code,
        });
    }

    // Send error response
    const errorResponse: ErrorResponse = {
        success: false,
        error: {
            code,
            message,
        },
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development' && !(err instanceof AppError)) {
        errorResponse.error.stack = err.stack;
    }

    res.status(statusCode).json(errorResponse);
};

export default errorHandler;
