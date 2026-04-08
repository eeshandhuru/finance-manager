import jwt from "jsonwebtoken";
import User from "../models/userModels.mjs";
import { comparePassword } from "../utils/authUtils.mjs";
import { sendToken } from "../utils/authUtils.mjs";
import { validationResult } from "express-validator";
import * as userServices from "../services/userServices.mjs";
import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

export const login = async (req, res) => {
    try {
        const token = req.cookies.token;

        // Step 1: Check existing token
        if (token) {
            try {
                const decoded = jwt.verify(token, jwtSecret);

                // If token is valid → block login
                return res.status(409).json("User already logged in");

            } catch (err) {
                // Token invalid/expired → allow login
            }
        }

        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json(errors.array());
        
        const { email_id, password } = req.body;

        const user = await User.findOne({ email_id });
        if (!user) return res.status(401).json("Invalid credentials");

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(401).json("Invalid credentials");

        await User.updateOne(
            {email_id}, 
            { $set: { login_time: Date.now() } }
        );

        await sendToken(res, user);
        res.status(200).json("Login successful");

    } catch (err) {
        console.log(err.stack)
        res.status(500).json(err.message);
    }
};

export const logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        if(!token) 
            return res.status(401).json("Unauthorized");
        let decoded = null;
        try {
            decoded = jwt.verify(token, jwtSecret);
        }
        catch {
            return res.status(401).json("Token expired or invalid");
        }
        await User.updateOne(
            { email_id: decoded.email_id },
            { $set: { logout_time: Date.now() } }
        );

        res.clearCookie("token");

        res.status(200).json("Logged out successfully");
    } catch (err) {
        console.log(err.stack)
        return res.status(500).json(err.message);
    }
};

export const me = async (req, res) => {
    try {
        const token = req.cookies.token;
        if(!token) 
            return res.status(401).json("Unauthorized");
        let decoded = null;
        try {
            decoded = jwt.verify(token, jwtSecret);
        }
        catch {
            return res.status(401).json("Token expired or invalid");
        }
        const output = await userServices.getUser(decoded.email_id);
        return res.status(200).json(output);
    } catch (err) {
        console.log(err.stack)
        return res.status(500).json(err.message);
    }
};
