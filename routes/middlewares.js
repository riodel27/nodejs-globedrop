/* eslint-disable no-underscore-dangle */

const { find: _find, has: _has } = require("lodash");
const { not } = require("ramda");

const { jwtVerify } = require("../utils/helper");
const { CustomError, AuthenticationError } = require("../utils/error");

/** Route/s level middlware */

module.exports.isAuthenticated = async (req, res, next) => {
  const authorization =
    req.headers["x-access-token"] || req.headers.authorization;
  const token =
    authorization &&
    authorization.startsWith("Bearer") &&
    authorization.slice(7, authorization.length);
  if (token) {
    try {
      req.decoded = await jwtVerify(token);
      return next();
    } catch (error) {
      return next(
        new CustomError(
          "INVALID_ACCESS_TOKEN",
          401,
          "Invalid access token is supplied."
        )
      );
    }
  }
  return next(
    new AuthenticationError(401, "Authentication access token is not supplied.")
  );
};
