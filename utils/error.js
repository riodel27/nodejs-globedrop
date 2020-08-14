class AuthenticationError extends Error {
  constructor(status = 500, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthenticationError);
    }

    this.code = "UNAUTHENTICATED";
    this.status = status;
  }
}

class CustomError extends Error {
  constructor(code = "GENERIC", status = 500, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.code = code;
    this.status = status;
  }
}

class DatabaseError extends Error {
  constructor(status = 500, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }

    this.code = "DATABASE_ERROR";
    this.status = status;
  }
}

class ForbiddenError extends Error {
  constructor(status = 500, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ForbiddenError);
    }

    this.code = "UNAUTHORIZED";
    this.status = status;
  }
}

class InputValidationError extends Error {
  constructor(status = 500, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InputValidationError);
    }

    this.code = "BAD_INPUT";
    this.status = status;
  }
}

class UserInputError extends Error {
  constructor(status = 500, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserInputError);
    }

    this.code = "BAD_USER_INPUT";
    this.status = status;
  }
}

module.exports = {
  AuthenticationError,
  CustomError,
  DatabaseError,
  ForbiddenError,
  InputValidationError,
  UserInputError,
};
