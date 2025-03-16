import { Router } from "express";
import { createShortUrl, redirectShortUrl } from "../controllers/url.controller.js";

const router = Router();

router.post('/api/shorten', createShortUrl);
router.get('/:shortUrl', redirectShortUrl);

export default router;