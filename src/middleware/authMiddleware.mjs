import jwt from "jsonwebtoken";
import { sendToken } from "../utils/authUtils.mjs";
import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

export const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json("Unauthorized");

  try {
    const decoded = jwt.verify(token, jwtSecret);

    req.user = decoded;

    // 🔥 Refresh token on every request (sliding session)
    await sendToken(res, decoded)

    next();
  } catch (err) {
    return res.status(401).json("Token expired" );
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json("Access denied");
    next();
  };
};