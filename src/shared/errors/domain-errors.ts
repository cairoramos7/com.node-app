/**
 * @file domain-errors.ts
 * @description Domain-specific error classes.
 */

import { AppError } from './app-error';

export class NotFoundError extends AppError {
    constructor(resource: string, identifier?: string) {
        const message = identifier
            ? `${resource} with identifier '${identifier}' not found`
            : `${resource} not found`;
        super(message, 404, 'NOT_FOUND');
    }
}

export class ValidationError extends AppError {
    constructor(
        message: string,
        public readonly fields?: Record<string, string>
    ) {
        super(message, 400, 'VALIDATION_ERROR');
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401, 'UNAUTHORIZED');
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(message, 403, 'FORBIDDEN');
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409, 'CONFLICT');
    }
}

export class BadRequestError extends AppError {
    constructor(message: string) {
        super(message, 400, 'BAD_REQUEST');
    }
}
