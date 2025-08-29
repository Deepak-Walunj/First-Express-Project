class AppError extends Error {
    constructor(message, statusCode = 500, errorCode = 'INTERNAL_SERVER_ERROR', details = {}) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;
    }
}

class ValidationError extends AppError {
    constructor(message = 'Validation Error') {
        super(message, 400, 'VALIDATION_ERROR');
    }
}

class InvalidCredentialsError extends AppError{
    constructor(message='Invalid Credentials'){
        super(message, 401, 'INVALID_CREDENTIALS');
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized access') {
        super(message, 401, 'UNAUTHORIZED');
    }
}

class DuplicateRequestException extends AppError {
    constructor(message = 'Duplicate request') {
        super(message, 409, 'DUPLICATE_REQUEST');
    }
}

module.exports = {
    AppError,
    InvalidCredentialsError,
    UnauthorizedError,
    DuplicateRequestException,
    ValidationError
};