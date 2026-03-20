const { verifyToken } = require("../utils/jwt");
const AppError = require("../utils/AppError");

const auth = (role) => async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      throw new AppError(401, "You are not authorized!");
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // Verify Token
    const verifiedUser = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verifiedUser;

    // Optional Role Check
    if (role && verifiedUser.role !== role) {
      throw new AppError(403, "Forbidden access!");
    }

    next();
  } catch (error) {
    next(new AppError(401, "Token is invalid or expired"));
  }
};

module.exports = auth;
