import { Request, Response } from "express";
import User from "../models/user.model.js";
import { validationResult } from "express-validator";
import passport from "passport";
import { BaseApiType } from "../types/baseApiType.js";
import { error } from "console";

export const googleAuth = passport.authenticate("google", {
    scope: ["profile", "email"],
});

export const googleAuthCallback = passport.authenticate("google", {
    failureRedirect: "/google/failure",
    session: true,
});

export const register = async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const filteredErrors = errors
            .array()
            .map((error) => ({ field: (error as any).path, msg: error.msg }));
        return res
            .status(400)
            .json({ status: "fail", error: filteredErrors } satisfies BaseApiType);
    }

    try {
        const {
            name,
            email,
            password,
        }: { name: string; email: string; password: string } = req.body;

        if (!name || !email || !password)
            return res
                .status(400)
                .json({
                    status: "fail",
                    error: "All field are required",
                } satisfies BaseApiType);

        const userExists = await User.findOne({ where: { email } });

        if (userExists)
            return res
                .status(400)
                .json({
                    status: "fail",
                    error: "Email already registered",
                } satisfies BaseApiType);

        const newUser = await User.create({ name: name.trim(), email, password });

        req.logIn(newUser, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    status: "error",
                    error: "Server Error",
                } satisfies BaseApiType);
            }
            res.status(201).json({
                status: "success",
                message: "User registered successfully",
                data: {
                    email,
                    name,
                },
            } satisfies BaseApiType);
        });
    } catch (err: any) {
        console.error(err);
        res
            .status(500)
            .json({ status: "error", error: "Server Error" } satisfies BaseApiType);
    }
};

export const login = (req: Request, res: Response, next: any) => {
    passport.authenticate("local", (err: Error | null, user: User, info: any) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res
                .status(401)
                .json({ status: "fail", error: info.message } satisfies BaseApiType);
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.json({
                status: "success",
                message: "Login successful",
                data: {
                    name: user.name,
                    email: user.email,
                },
            } satisfies BaseApiType);
        });
    })(req, res, next);
};

export const getSession = (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        const user = req.user as User;
        res.json({
            status: "success",
            message: "Get Session Successful",
            data: user,
        } satisfies BaseApiType);
    } else {
        res.status(401).json({
            status: "fail",
            message: "Not authenticated",
        } satisfies BaseApiType);
    }
};

export const logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                error: "Logout failed",
            } satisfies BaseApiType);
        }
        res.clearCookie("connect.sid");
        res.status(200).json({
            status: 'success',
            message: "Logout successful"
        } satisfies BaseApiType);
    });
};
