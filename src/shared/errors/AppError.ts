/**
 * @file AppError.ts
 * @description Custom application error class for consistent error handling.
 */

export default class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: string | null;
    public readonly isOperational: boolean;

    /**
     * Creates an instance of AppError.
     * @param {string} message - Error message.
     * @param {number} statusCode - HTTP status code.
     * @param {string} [code] - Optional error code for client identification.
     */
    constructor(message: string, statusCode: number = 500, code: string | null = null) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Creates a Bad Request error (400).
     */
    static badRequest(message: string, code: string = 'BAD_REQUEST'): AppError {
        return new AppError(message, 400, code);
    }

    /**
     * Creates an Unauthorized error (401).
     */
    static unauthorized(message: string = 'Unauthorized', code: string = 'UNAUTHORIZED'): AppError {
        return new AppError(message, 401, code);
    }

    /**
     * Creates a Forbidden error (403).
     */
    static forbidden(message: string = 'Forbidden', code: string = 'FORBIDDEN'): AppError {
        return new AppError(message, 403, code);
    }

    /**
     * Creates a Not Found error (404).
     */
    static notFound(message: string = 'Resource not found', code: string = 'NOT_FOUND'): AppError {
        return new AppError(message, 404, code);
    }

    /**
     * Creates a Conflict error (409).
     */
    static conflict(message: string, code: string = 'CONFLICT'): AppError {
        return new AppError(message, 409, code);
    }

    /**
     * Creates an Internal Server Error (500).
     */
    static internal(
        message: string = 'Internal server error',
        code: string = 'INTERNAL_ERROR'
    ): AppError {
        return new AppError(message, 500, code);
    }
}
