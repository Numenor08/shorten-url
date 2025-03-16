import { Router } from "express";
import { createShortUrl, redirectShortUrl } from "../controllers/url.controller.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { UrlValidation } from "../middlewares/urlMiddleware.js";

const router = Router();

router.use(isAuthenticated);

router.post('/shorten', UrlValidation, createShortUrl);
router.get('/:shortUrl', redirectShortUrl);

export default router;