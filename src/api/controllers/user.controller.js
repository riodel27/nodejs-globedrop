const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Container } = require("typedi");

const { body, validationResult, param } = require("express-validator");
const { not } = require("ramda");

const { jwtVerifyRefreshToken } = require("../../utils/helper");

const {
  UserInputError,
  CustomError,
  ForbiddenError,
} = require("../../utils/error");

module.exports = {
  validate: (method) => {
    switch (method) {
      case "createUser": {
        return [
          body("email", "Valid email address is required.").isEmail(),
          body("confirmPassword", "Confirm password is required").custom(
            (value, { req }) => {
              const { password, confirmPassword } = req.body;

              if (password && password !== "") {
                if (password !== confirmPassword)
                  throw new Error(
                    "Confirm password did not match the password."
                  );
              }

              return true;
            }
          ),
        ];
      }
      case "deleteUser": {
        return [
          param("id", "User ID is required").custom((id) => {
            if (not(id)) return false;

            if (id === "") return false;

            if (not(mongoose.Types.ObjectId.isValid(id)))
              throw new Error(`Invalid User ID: ${id}`);

            return true;
          }),
        ];
      }
      case "getUserById": {
        return [
          param("id", "User ID is required").custom((id) => {
            if (not(id)) return false;

            if (id === "") return false;

            if (not(mongoose.Types.ObjectId.isValid(id)))
              throw new Error(`Invalid User ID: ${id}`);

            return true;
          }),
        ];
      }
      case "updateUser": {
        return [
          param("id", "User ID is required").custom((id) => {
            if (not(id)) return false;

            if (id === "") return false;

            if (not(mongoose.Types.ObjectId.isValid(id)))
              throw new Error(`Invalid User ID: ${id}`);

            return true;
          }),
          body("email", "Valid email address is required.")
            .isEmail()
            .optional(),
          body("password", "Password is not allowed to be empty.")
            .notEmpty()
            .optional(),
          body("confirmPassword").custom((value, { req }) => {
            const { password, confirmPassword } = req.body;

            if (password && not(confirmPassword))
              throw new Error("Confirm password did not match the password.");

            if (password && password !== confirmPassword)
              throw new Error("Confirm password did not match the password.");

            return true;
          }),
        ];
      }

      default:
        break;
    }
  },
  createUser: async (req, res, next) => {
    const logger = Container.get("logger");
    logger.debug("Calling create user endpoint with body: %o", req.body);

    try {
      const { body: userInput } = req;

      const errors = validationResult(req);

      // validation error
      if (not(errors.isEmpty())) {
        return next(new UserInputError(422, JSON.stringify(errors.array())));
      }

      const UserServiceInstance = Container.get("user.service");

      const user = await UserServiceInstance.createUser(userInput);

      logger.info(`${req.method} ${req.originalUrl} ${200}`);

      return res.status(201).json({
        message: "User Inserted",
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  },
  deleteUser: async (req, res, next) => {
    const logger = Container.get("logger");
    logger.debug("Calling delete user endpoint");

    try {
      const { id } = req.params;

      const errors = validationResult(req);

      if (not(errors.isEmpty())) {
        const error = errors.errors[0];

        if (error.param === "id")
          return next(new CustomError("INVALID_USER_ID", 422, error.msg));
      }

      const UserServiceInstance = Container.get("user.service");

      await UserServiceInstance.deleteUser({ _id: id });

      logger.info(`${req.method} ${req.originalUrl} ${200}`);
      return res.status(202).json({ message: "delete successful" });
    } catch (error) {
      return next(new Error(error.message));
    }
  },
  getUserById: async (req, res, next) => {
    const logger = Container.get("logger");
    logger.debug("Calling get user by id endpoint");

    try {
      const { id } = req.params;
      const errors = validationResult(req);

      if (not(errors.isEmpty())) {
        const error = errors.errors[0];
        if (error.param === "id")
          return next(new CustomError("INVALID_USER_ID", 422, error.msg));
      }

      const UserServiceInstance = Container.get("user.service");

      const user = await UserServiceInstance.findOneUser(
        { _id: id },
        { populate: true }
      );

      if (not(user))
        return next(new CustomError("USER_NOT_FOUND", 404, "User Not Found"));

      return res.status(200).json({ message: "Ok", data: user });
    } catch (error) {
      return next(new Error(error.message));
    }
  },
  getUsers: async (req, res, next) => {
    const logger = Container.get("logger");
    logger.debug("Calling get users endpoint");

    try {
      const UserServiceInstance = Container.get("user.service");

      const users = await UserServiceInstance.list(req.query);

      logger.info(`${req.method} ${req.originalUrl} ${200}`);
      return res.status(200).json({ message: "Ok", data: users });
    } catch (error) {
      return next(new Error(error.message));
    }
  },
  getOrganizationsByUser: async (req, res, next) => {
    const logger = Container.get("logger");
    logger.debug("Calling get organizations by user endpoint");

    try {
      const UserServiceInstance = Container.get("user.service");

      const users = await UserServiceInstance.findOrganizationsByUser(
        req.query
      );

      logger.info(`${req.method} ${req.originalUrl} ${200}`);
      return res.status(200).json({ message: "Ok", data: users });
    } catch (error) {
      return next(new Error(error.message));
    }
  },
  getUsersByUserType: async (req, res, next) => {
    const logger = Container.get("logger");
    logger.debug("Calling get users by use type endpoint");

    try {
      const { user_type } = req.params;

      const UserServiceInstance = Container.get("user.service");

      const users = await UserServiceInstance.listUsersByUserType({
        userType: user_type,
      });

      logger.info(`${req.method} ${req.originalUrl} ${200}`);
      return res.status(200).json({ message: "Ok", data: users });
    } catch (error) {
      return next(new Error(error.message));
    }
  },
  login: async (req, res, next) => {
    const logger = Container.get("logger");
    logger.debug("Calling user login endpoint");

    try {
      const { email, password } = req.body;

      const UserServiceInstance = Container.get("user.service");

      const {
        user,
        access_token,
        refresh_token,
        expires_in,
      } = await UserServiceInstance.login(email, password);

      logger.info(`${req.method} ${req.originalUrl} ${200}`);

      return res.status(200).json({
        user: user,
        access_token,
        refresh_token: refresh_token,
        expires_in, // return in hours.
      });
    } catch (error) {
      return next(error);
    }
  },
  logout: async (req, res, next) => {
    const logger = Container.get("logger");
    logger.debug("Calling user logout endpoint");

    try {
      const authorization =
        req.headers["x-access-token"] || req.headers.authorization;
      const token =
        authorization &&
        authorization.startsWith("Bearer") &&
        authorization.slice(7, authorization.length);

      // await BlackListTokenService.createBlackListToken({
      //   access_token: token,
      // });

      // logger.info(`${req.method} ${req.originalUrl} ${200}`);
      return res.status(200).json({ success: true });
    } catch (error) {
      return next(new Error(error.message));
    }
  },
  refreshToken: async (req, res, next) => {
    const logger = Container.get("logger");
    logger.debug("Calling user refresh token endpoint");

    try {
      const { refresh_token: refreshToken } = req.params;

      const decoded = await jwtVerifyRefreshToken(refreshToken);
      const { iat, exp, ...user } = decoded;

      const config = Container.get("config");

      const accessToken = jwt.sign(user, config.secretToken, {
        expiresIn: `${config.accessTokenTtl}h`, // make sure that unit is in h(Hour)
      });

      const refresh_token = jwt.sign(user, config.secretRefreshToken, {
        expiresIn: `${config.refreshTokenTtl}`,
      });

      // logger.info(`${req.method} ${req.originalUrl} ${200}`);
      return res.status(200).json({
        access_token: accessToken,
        refresh_token,
      });
    } catch (error) {
      return next(new CustomError("INVALID_REFRESH_TOKEN", 400, error.message));
    }
  },
  updateUser: async (req, res, next) => {
    const logger = Container.get("logger");
    logger.debug("Calling update user endpoint");

    try {
      const { id } = req.params;
      const { body: userInput } = req;

      const errors = validationResult(req);

      if (not(errors.isEmpty())) {
        return next(new UserInputError(422, JSON.stringify(errors.array())));
      }

      const UserServiceInstance = Container.get("user.service");

      if (userInput.email) {
        const existingUserEmail = await UserServiceInstance.findOneUser({
          email: userInput.email,
        });

        if (existingUserEmail && existingUserEmail.id !== id)
          return next(
            new CustomError("EMAIL_ALREADY_EXIST", 400, "Email already exist.")
          );
      }

      const password =
        userInput.password &&
        userInput.password.trim() &&
        (await bcrypt.hash(userInput.password.trim(), 12));

      const user = await UserServiceInstance.findOneUserAndUpdate(
        { _id: id },
        { ...userInput, ...(password && { password }) }
      );

      logger.info(`${req.method} ${req.originalUrl} ${200}`);
      return res.status(200).json({ message: "User Updated", data: user });
    } catch (error) {
      return next(new Error(error.message));
    }
  },
};
