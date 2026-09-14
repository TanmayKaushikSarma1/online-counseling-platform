const jwt = require("jsonwebtoken");

function protect(req, res, next) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const actualToken = token.split(" ")[1];

    const decoded = jwt.verify(
      actualToken,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

function counselorOnly(req, res, next) {
  if (req.user.role !== "counselor") {
    return res.status(403).json({
      message: "Counselor access required",
    });
  }

  next();
}

module.exports = {
  protect,
  counselorOnly,
};