import { check } from "express-validator";

export const validateLimit = check("limit").isInt().withMessage("Limit should only be an integer.").optional();
export const validatePageNo = check("page").isInt().withMessage("Page number should only be an integer.").optional();