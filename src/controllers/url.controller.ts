import { Request, Response } from 'express'
import URL from '../models/url.model.js'
import { nanoid } from 'nanoid'
import { validationResult } from 'express-validator'

export const createShortUrl = async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const filteredErrors = errors.array().map((error) => ({field: (error as any).path, msg: error.msg}));
        return res.status(400).json({ error: filteredErrors });
    }
    try {
        const { originalUrl, customUrl }: { originalUrl: string, customUrl: string } = req.body;
        if (!originalUrl) return res.status(400).json({ error: 'URL is required' })
        
        let shortUrl: string;
        
        if (customUrl) {
            shortUrl = customUrl.trim()
        } else {
            shortUrl = nanoid(6)
        }

        const urlExists = await URL.findOne({ where: { short_url: shortUrl } })
        if (urlExists) return res.status(400).json({ error: "Short URL already exists" })

        const newUrl = await URL.create({ original_url: originalUrl, short_url: shortUrl })
        await newUrl.save()

        res.status(201).json({ data: newUrl })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Server error' })
    }
}

export const redirectShortUrl = async (req: Request, res: Response): Promise<any> => {
    const { shortUrl } = req.params as { shortUrl: string };

    const urlEntry = await URL.findOne({ where: { short_url: shortUrl } })

    if (!urlEntry || urlEntry === null) {
        res.status(404).json({ error: " URL not found " })
    } else {
        urlEntry.increment('clicks');
        res.redirect(urlEntry.original_url);
    }
}