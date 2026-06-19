const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. Token Missing.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
console.log("Token:", token);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
console.log("Decoded:", decoded);
    req.user = decoded;

    next();

  } catch (error) {
  console.error("JWT Error:", error);

  return res.status(401).json({
    success: false,
    message: error.message,
  });
}
};

module.exports = verifyToken;