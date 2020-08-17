/* eslint-disable no-underscore-dangle */

const { find: _find, has: _has } = require("lodash");
const { not } = require("ramda");

const { jwtVerify } = require("../../utils/helper");
const { CustomError, AuthenticationError } = require("../../utils/error");

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

/**
 * 
 * const attachCurrentUser = async (req, res, next) => {
  const Logger = Container.get('logger');
  try {
    const UserModel = Container.get('userModel') as mongoose.Model<IUser & mongoose.Document>;
    const userRecord = await UserModel.findById(req.token._id);
    if (!userRecord) {
      return res.sendStatus(401);
    }
    const currentUser = userRecord.toObject();
    Reflect.deleteProperty(currentUser, 'password');
    Reflect.deleteProperty(currentUser, 'salt');
    req.currentUser = currentUser;
    return next();
  } catch (e) {
    Logger.error('🔥 Error attaching user to req: %o', e);
    return next(e);
  }
};
*/
