import { check } from "express-validator";

export const UrlValidation = [
    check("originalUrl")
        .isURL()
        .withMessage("URL must be a valid URL"),
    check("customUrl")
        .optional()
        .isLength({ min: 6, max: 15 })
        .withMessage("Custom URL must be between 6 and 15 characters"),
]