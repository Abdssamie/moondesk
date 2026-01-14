/**
 * Base error class for domain errors
 */
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = "DomainError";
  }
}

/**
 * Error thrown when a resource is not found
 */
export class NotFoundError extends DomainError {
  constructor(resource: string, id: string | number) {
    super(`${resource} with id '${id}' not found`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends DomainError {
  constructor(
    message: string,
    public readonly field?: string,
  ) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

/**
 * Error thrown when user is not authorized
 */
export class UnauthorizedError extends DomainError {
  constructor(message = "Unauthorized") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "UnauthorizedError";
  }
}

/**
 * Error thrown when user doesn't have permission
 */
export class ForbiddenError extends DomainError {
  constructor(message = "Access forbidden") {
    super(message, "FORBIDDEN", 403);
    this.name = "ForbiddenError";
  }
}

/**
 * Error thrown when a conflict occurs (e.g., duplicate entry)
 */
export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, "CONFLICT", 409);
    this.name = "ConflictError";
  }
}
