import { Router, Response, Request } from "express";
import {
    googleAuth,
    googleAuthCallback,
    login,
    register,
    getSession,
    logout
} from "../controllers/auth.controller.js";

const router = Router();

router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback, (req: Request, res: Response) => {
    console.log('Authentication Google successful');
    res.redirect('/');
});

router.post("/login", login);
router.post("/register", register);
router.get("/session", getSession);
router.get("/logout", logout);

export default router;
