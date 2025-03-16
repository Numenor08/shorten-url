import { Request, Response } from 'express'
import URL from '../models/url.model.js'
import { nanoid } from 'nanoid'

export const createShortUrl = async (req: Request, res: Response): Promise<any> => {
    try {
        const { originalUrl }: { originalUrl: string } = req.body;
        
        if (!originalUrl) return res.status(400).json({ error: 'URL is required' })
    
        const shortUrl = nanoid(6)
        
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