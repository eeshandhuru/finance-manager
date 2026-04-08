import { check } from "express-validator";
import { roles } from "../utils/constants.mjs";

export const validateRole = check("role").isString().withMessage("Role should be a string.")
                        .toLowerCase().isIn(roles).withMessage("Role should be either VIEWER, ANALYST, or ADMIN.");
export const validateMail = check("email_id").isEmail().withMessage("Invalid Email Address.");
export const validateName = check("name").isString().withMessage("Name should be a string.")
                        .notEmpty().withMessage("Name should not be empty.");
export const validatePass = check("password").notEmpty().withMessage("Password should not be empty.")
                        .isLength({min: 8}).withMessage("Minimum Length of Password should be 8 characters.");
export const validateMailNotEmpty = validateMail.notEmpty().withMessage("Email Address should not be empty.");
export const validateRoleNotEmpty = validateRole.notEmpty().withMessage("Role should not be empty.");
export const validateRoleOptional = validateRole.optional();
