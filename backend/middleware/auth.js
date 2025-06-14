const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Authentication Failed!");
    }
    const decodedToken = jwt.verify(token, "supersecret_dont_share");
    req.user = { id: decodedToken.userId }; // Add user ID to request
    next();
  } catch (err) {
    const error = new HttpError("Authentication Failed", 403);
    return next(error);
  }
};
