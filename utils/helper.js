const jwt = require("jsonwebtoken");

const jwtVerifyRefreshToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_SECRET_TOKEN, (error, decoded) => {
      if (error) {
        reject(new Error(error.message));
      }
      resolve(decoded);
    });
  });

const jwtVerify = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET_TOKEN, (error, decoded) => {
      if (error) {
        reject(new Error(error.message));
      }
      resolve(decoded);
    });
  });

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
};

module.exports = {
  jwtVerifyRefreshToken,
  jwtVerify,
  normalizePort,
};
