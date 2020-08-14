const mongoose = require("mongoose");
const { body, validationResult, param } = require("express-validator");
const { not } = require("ramda");

const {
  UserInputError,
  CustomError,
  ForbiddenError,
} = require("../utils/error");

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
  createUser: (UserService) => async (req, res, next) => {
    try {
      const { body: userInput } = req;

      const errors = validationResult(req);

      // validation error
      if (not(errors.isEmpty())) {
        return next(new UserInputError(422, JSON.stringify(errors.array())));
      }

      const existingUserEmail = await UserService.findOneUser({
        email: userInput.email,
      });

      if (existingUserEmail)
        return next(
          new CustomError(
            "EMAIL_ALREADY_EXIST",
            400,
            "User with this email already exist."
          )
        );

      const user = await UserService.createUser(userInput);

      // logger.info(`${req.method} ${req.originalUrl} ${200}`);
      return res.status(201).json({
        message: "User Inserted",
        data: user,
      });
    } catch (error) {
      return next(new Error(error.message));
    }
  },
  deleteUser: (UserService) => async (req, res, next) => {
    try {
      const { id } = req.params;
      const errors = validationResult(req);

      if (not(errors.isEmpty())) {
        const error = errors.errors[0];

        if (error.param === "id")
          return next(new CustomError("INVALID_USER_ID", 422, error.msg));
      }

      await UserService.deleteUser({ _id: id });

      // logger.info(`${req.method} ${req.originalUrl} ${200}`);
      return res.status(202).json({ message: "delete successful" });
    } catch (error) {
      return next(new Error(error.message));
    }
  },
  getUserById: (UserService) => async (req, res, next) => {
    try {
      const { id } = req.params;
      const errors = validationResult(req);

      if (not(errors.isEmpty())) {
        const error = errors.errors[0];
        if (error.param === "id")
          return next(new CustomError("INVALID_USER_ID", 422, error.msg));
      }

      const user = await UserService.findOneUser(
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
  getUsers: (UserService) => async (req, res, next) => {
    try {
      const users = await UserService.list(req.query);

      // logger.info(`${req.method} ${req.originalUrl} ${200}`);
      return res.status(200).json({ message: "Ok", data: users });
    } catch (error) {
      return next(new Error(error.message));
    }
  },
  getUsersByUserType: (UserService) => async (req, res, next) => {
    try {
      const { user_type } = req.params;

      const users = await UserService.listUsersByUserType({
        userType: user_type,
      });

      // logger.info(`${req.method} ${req.originalUrl} ${200}`);
      return res.status(200).json({ message: "Ok", data: users });
    } catch (error) {
      return next(new Error(error.message));
    }
  },
  updateUser: (UserService) => async (req, res, next) => {
    try {
      const { id } = req.params;
      const { body: userInput } = req;

      const errors = validationResult(req);

      if (not(errors.isEmpty())) {
        return next(new UserInputError(422, JSON.stringify(errors.array())));
      }

      if (userInput.email) {
        const existingUserEmail = await UserService.findOneUser({
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

      const user = await UserService.findOneUserAndUpdate(
        { _id: id },
        { ...userInput, ...(password && { password }) }
      );

      // logger.info(`${req.method} ${req.originalUrl} ${200}`);
      return res.status(200).json({ message: "User Updated", data: user });
    } catch (error) {
      return next(new Error(error.message));
    }
  },
};
