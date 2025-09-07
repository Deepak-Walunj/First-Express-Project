class AppError extends Error {
    constructor(message, statusCode = 500, errorCode = 'INTERNAL_SERVER_ERROR', details = {}) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;
    }
}

class ValidationError extends AppError {
    constructor(message = 'Validation Error', statusCode = 400, errorCode='VALIDATION_ERROR', details = {}) {
        super(message, statusCode, errorCode, details);
    }
}

class InvalidCredentialsError extends AppError{
    constructor(message='Invalid Credentials', statusCode = 401, errorCode = 'INVALID_CREDENTIALS' ,details={}) {
        super(message, statusCode, errorCode, details);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized access', statusCode = 401, errorCode= 'UNAUTHORIZED', details = {}) {
        super(message, statusCode, errorCode, details);
    }
}

class DuplicateRequestException extends AppError {
    constructor(message = 'Duplicate request', statusCode = 409, errorCode = 'DUPLICATE_REQUEST', details = {}) {
        super(message, statusCode, errorCode, details);
    }
}

class MissingRequiredFields extends AppError {
    constructor(message = 'Missing required fields', statusCode = 400, errorCode = 'MISSING_FIELDS', details = {}) {
        super(message, statusCode, errorCode, details);
    }
}

module.exports = {
    AppError,
    InvalidCredentialsError,
    UnauthorizedError,
    DuplicateRequestException,
    ValidationError,
    MissingRequiredFields
};