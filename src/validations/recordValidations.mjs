import { check } from "express-validator";
import { transactionTypes } from "../utils/constants.mjs";

export const validateID = check("id").isNumeric().withMessage("ID should be numeric.");
export const validateAmount = check("amount").isNumeric().withMessage("Amount should be only numeric.");
export const validateType = check("type").isString().withMessage("Transaction type should be a string.")
                        .toLowerCase().isIn(transactionTypes).withMessage("Transaction type should be either INCOME or EXPENSE.");
export const validateCategory = check("category").isString().withMessage("Category should be a string.");

export function validateDate(dateLabel) { 
    return check(dateLabel).isDate({ format: 'YYYY-MM-DD' }).withMessage('Invalid date format, use YYYY-MM-DD.');
};

export function validateDateOptional(dateLabel) {
    return validateDate(dateLabel).optional();
};

export function validateDateCompulsory(dateLabel) {
    return validateDate(dateLabel).notEmpty().withMessage(`${dateLabel} should not be empty`);
};

export const validateAmountOptional = validateAmount.optional();
export const validateAmountCompulsory = validateAmount.notEmpty().withMessage("Amount should not be empty.");

export const validateTypeOptional = validateType.optional();
export const validateTypeCompulsory = validateType.notEmpty().withMessage("Type should not be empty.");

export const validateCategoryOptional = validateCategory.optional();
export const validateCategoryCompulsory = validateCategory.notEmpty().withMessage("Category should not be empty.");