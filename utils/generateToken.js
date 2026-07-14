import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET || "my_access_secret_key",
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "15m",
    }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_REFRESH_SECRET || "my_refresh_secret_key",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d",
    }
  );
};