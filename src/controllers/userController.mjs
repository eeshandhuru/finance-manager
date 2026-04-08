import * as userServices from "../services/userServices.mjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validationResult } from "express-validator";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

export const createUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json(errors.array());
        else {
            const newUser = await userServices.createUser(req.body);
            return res.status(201).json({ message: "User created successfully", user: newUser});
        }
    }
    catch(err) {
        console.error(err.stack);
        return res.status(500).json(err.message);
    }
}

export const createViewer = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json(errors.array());
        else {
            const newUser = await userServices.createViewer(req.body);
            return res.status(201).json({ message: "Viewer created successfully", user: newUser});
        }
    }
    catch(err) {
        console.error(err.stack);
        return res.status(500).json(err.message);
    }
}

export const changeName = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json(errors.array());
        else {
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
            const userInfo = await userServices.changeName(decoded.email_id, req.body.name);
            return res.status(200).json({ message: "Name changed successfully", user: userInfo});
        }
    }
    catch(err) {
        console.error(err.stack);
        return res.status(500).json(err.message);
    }
}

export const changeRole = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json(errors.array());
        else {
            const userInfo = await userServices.changeRole(req.body);
            return res.status(200).json({ message: "Role changed successfully", user: userInfo});
        }
    }
    catch(err) {
        console.error(err.stack);
        return res.status(500).json(err.message);
    }
}

export const changePassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json(errors.array());
        else {
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
            const userInfo = await userServices.changeName(decoded.email_id, req.body.password);
            return res.status(200).json({ message: "Password changed successfully", user: userInfo});
        }
    }
    catch(err) {
        console.error(err.stack);
        return res.status(500).json(err.message);
    }
}

export const deleteUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json(errors.array());
        else {
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
            await userServices.deleteUser(decoded.email_id);
            return res.status(200).json("User deleted successfully");
        }
    }
    catch(err) {
        console.error(err.stack);
        return res.status(500).json(err.message);
    }
}

export const getUserList = async (req, res) => {
    try {
        const { page, limit, role } = req.query;
        if(role) {
            const errors = validationResult(req);
            if(!errors.isEmpty() && role)
                return res.status(400).json(errors.array());
            else
                return res.status(200).json(await userServices.getUserList(role, limit, page));
        }
        else {
            return res.status(200).json(await userServices.getUserList(null, limit, page));
        }
    }
    catch(err) {
        console.error(err.stack);
        return res.status(500).json(err.message);
    }
}

export const getUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json(errors.array());
        else {
            const output = await userServices.getUser(req.params.email_id);
            if(output) 
                return res.status(200).json(output);
            else
                return res.status(404).json("User not found");
        }
    }
    catch(err) {
        console.error(err.stack);
        return res.status(500).json(err.message);
    }
}
