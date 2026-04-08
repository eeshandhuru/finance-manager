import { genSalt, hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtExpiry, maxTokenAge } from "./constants.mjs";
import User from "../models/userModels.mjs";
import dotenv from 'dotenv';
dotenv.config()

const jwtSecret = process.env.JWT_SECRET;

export const generateToken = async (user) => {
  await User.updateOne(
      { email_id: user.email_id }, 
      { $set: { last_active: Date.now(), logout_time: (Date.now() + maxTokenAge) } }
    );
  return jwt.sign(
    {
      id: user._id,
      email_id: user.email_id,
      role: user.role
    },
    jwtSecret,
    { expiresIn: jwtExpiry }
  );
};

export const sendToken = async (res, user) => {
  const token = await generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    maxAge: maxTokenAge // 2 mins
  });

  return token;
};

export const hashPassword = async (password) => {
    const salt = await genSalt(10);
    return await hash(password, salt);
};

export const comparePassword = async (password, hash) => {
    return await compare(password, hash);
};