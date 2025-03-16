import { Request, Response, NextFunction } from "express";
import { check } from "express-validator";

export const isAuthenticated = ( req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: "Unauthorized. Please log in to access this resource." });
}

export const registerValidation = [
    check("email")
        .isEmail()
        .withMessage("Email must be a valid email address"),
    check("password")
        .isLength({ min: 8, max: 15 })
        .withMessage("Password must be between 8 and 15 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/\d/)
        .withMessage("Password must contain at least one number"),
    check("name")
        .isLength({ max: 100 })
        .withMessage("Name must be less than 100 characters")
        .notEmpty()
        .withMessage("Name is required"),
];