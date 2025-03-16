import { Request, Response } from "express";
import User from '../models/user.model.js'
import { validationResult } from "express-validator";
import passport from "passport";

export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] })

export const googleAuthCallback = passport.authenticate('google', {
    failureRedirect: '/google/failure',
    session: true,
});

export const register = async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const filteredErrors = errors.array().map((error) => ({field: (error as any).path, msg: error.msg}));
        return res.status(400).json({ error: filteredErrors });
    }
    
    try {
        const { name, email, password }: { name: string, email: string, password: string } = req.body;

        if (!name || !email || !password) return res.status(400).json({ error: 'All field are required' })

        const userExists = await User.findOne({ where: { email } })

        if (userExists) return res.status(400).json({ error: "Email already registered" })
        
        const newUser = await User.create({name: name.trim(), email, password})

        req.logIn(newUser, (err) => {
            if (err) {
                console.error(err)
                return res.status(500).json({ error: 'Server Error'})
            }
            res.status(201).json({ 
                message: "User registered successfully", 
                user: {
                    email,
                    name,
                } 
            });
        });
        
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ error: 'Server Error'})
    }
}

export const login = (req: Request, res: Response, next: any) => {
    passport.authenticate('local', (err: Error | null, user: User, info: any) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ error: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.json({ message: "Login successful", user: {
                name: user.name,
                email: user.email
            } });
        });
    })(req, res, next);
};

export const getSession = (req: Request, res: Response) => {
    if (req.user) {
        const user = req.user as User;
        res.json({ user });
    }else {
        res.status(401).json({ error: "Not authenticated" });
    }
};

export const logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Logout failed" });
        }
        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Logout successful" });
    });
}