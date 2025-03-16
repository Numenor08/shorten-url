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
    res.send(`
    <script>
        window.opener.postMessage('login-google-success', '*');
        window.close();
    </script>    
    `);
});
router.get("/google/failure", (req: Request, res: Response) => {
    res.send(`
    <script>
        alert('Google login failed');
        window.opener.postMessage('login-google-failure', '*');
        window.close();
    </script>    
    `);
});

router.post("/login", login);
router.post("/register", register);
router.get("/session", getSession);
router.get("/logout", logout);

export default router;
