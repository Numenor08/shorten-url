import { Router } from "express";
import { createShortUrl, redirectShortUrl } from "../controllers/url.controller.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(isAuthenticated);

router.post('/shorten', createShortUrl);
router.get('/:shortUrl', redirectShortUrl);

export default router;