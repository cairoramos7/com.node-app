/**
 * @file AppError.js
 * @description Custom application error class for consistent error handling.
 */

class AppError extends Error {
  /**
   * Creates an instance of AppError.
   * @param {string} message - Error message.
   * @param {number} statusCode - HTTP status code.
   * @param {string} [code] - Optional error code for client identification.
   */
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Creates a Bad Request error (400).
   * @param {string} message - Error message.
   * @param {string} [code] - Optional error code.
   * @returns {AppError}
   */
  static badRequest(message, code = 'BAD_REQUEST') {
    return new AppError(message, 400, code);
  }

  /**
   * Creates an Unauthorized error (401).
   * @param {string} message - Error message.
   * @param {string} [code] - Optional error code.
   * @returns {AppError}
   */
  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    return new AppError(message, 401, code);
  }

  /**
   * Creates a Forbidden error (403).
   * @param {string} message - Error message.
   * @param {string} [code] - Optional error code.
   * @returns {AppError}
   */
  static forbidden(message = 'Forbidden', code = 'FORBIDDEN') {
    return new AppError(message, 403, code);
  }

  /**
   * Creates a Not Found error (404).
   * @param {string} message - Error message.
   * @param {string} [code] - Optional error code.
   * @returns {AppError}
   */
  static notFound(message = 'Resource not found', code = 'NOT_FOUND') {
    return new AppError(message, 404, code);
  }

  /**
   * Creates a Conflict error (409).
   * @param {string} message - Error message.
   * @param {string} [code] - Optional error code.
   * @returns {AppError}
   */
  static conflict(message, code = 'CONFLICT') {
    return new AppError(message, 409, code);
  }

  /**
   * Creates an Internal Server Error (500).
   * @param {string} message - Error message.
   * @param {string} [code] - Optional error code.
   * @returns {AppError}
   */
  static internal(message = 'Internal server error', code = 'INTERNAL_ERROR') {
    return new AppError(message, 500, code);
  }
}

module.exports = AppError;
