import { Router } from "express";
import { createShortUrl, getAllShortUrl, deleteShortUrl, getShortUrlById } from "../controllers/url.controller.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { UrlValidation } from "../middlewares/urlMiddleware.js";

const router = Router();

router.use(isAuthenticated);

router.post('/shorten', UrlValidation, createShortUrl);
router.get('/shorten', getAllShortUrl);
router.delete('/shorten/:id', deleteShortUrl);
router.get('/shorten/:id', getShortUrlById);

export default router;