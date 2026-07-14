import ApiError from "../utils/ApiError.js";

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          "You are not authorized"
        )
      );
    }

    next();
  };
};

export default roleMiddleware;