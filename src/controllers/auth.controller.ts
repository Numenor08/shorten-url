import { Request, Response } from "express";
import User from '../models/user.model.js'
import passport from "passport";
import bcrypt from "bcryptjs";

export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] })

export const googleAuthCallback = passport.authenticate('google', {
    failureRedirect: '/login',
    session: true,
});

export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, password }: { name: string, email: string, password: string } = req.body;

        if (!name || !email || !password) return res.status(400).json({ error: 'All field are required' })

        const userExists = await User.findOne({ where: { email } })

        if (userExists) return res.status(400).json({ error: "Email already registered" })
        
        const newUser = await User.create({name, email, password})

        req.session.user = {
            name: newUser.name,
            email: newUser.email,
        };

        res.status(201).json({ 
            message: "User registered successfully", 
            user: {
                email,
                name,
            } 
        });
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ error: 'Server Error'})
    }
}

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await User.findOne({ where: { email } });

        let isMatch: boolean;

        if (user?.password) {
            isMatch = bcrypt.compareSync(password, user.password);
        } else {
            isMatch = true;
        }

        if (!user || !isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        req.session.user = {
            name: user.name,
            email: user.email,
        };

        res.status(200).json({ message: "Login successful", userId: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getSession = (req: Request, res: Response) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else if (req.user) {
        const user = req.user as User;
        res.json({ user: {
            name: user.name,
            email: user.email
        }})
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