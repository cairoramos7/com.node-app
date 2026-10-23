/**
 * @file app-error.ts
 * @description Base class for all application errors.
 */

export class AppError extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: number = 500,
        public readonly code: string = 'INTERNAL_ERROR',
        public readonly isOperational: boolean = true
    ) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}
