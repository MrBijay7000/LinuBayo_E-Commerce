const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Authentication failed: No token provided.");
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, "supersecret_dont_share");
    req.userData = {
      userId: decodedToken.userId,
      role: decodedToken.role,
    };
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(403).json({ message: "Authentication failed" });
  }
};
