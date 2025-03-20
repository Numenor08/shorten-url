import { BaseApiType } from '../types/baseApiType.js';
import { Request, Response } from 'express'
import URL from '../models/url.model.js'
import { nanoid } from 'nanoid'
import { validationResult } from 'express-validator'
import User from '../models/user.model.js';
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path';
import QRCode from 'qrcode';

dotenv.config()

export const getAllShortUrl = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.user as User
        const urlList = await URL.findAll({ where: { id_user: id } })
        res.status(200).json({
            status: "success",
            message: 'Get all URL Successful',
            data: urlList
        } satisfies BaseApiType)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: 'error',
            error: 'Server error'
        } satisfies BaseApiType)
    }
}

export const getShortUrlById = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id)
        if (isNaN(id)) return res.status(400).json({ status: 'fail', error: 'Invalid ID format' } satisfies BaseApiType)

        const { id: request_id_user } = req.user as User

        const url = await URL.findByPk(id)

        if (!url) return res.status(404).json({ status: 'fail', error: 'URL not found' } satisfies BaseApiType)

        const { id_user } = url.dataValues as URL

        if (id_user !== request_id_user) return res.status(403).json({ status: 'fail', error: 'The user does not own this URL' } satisfies BaseApiType)

        return res.status(200).json({
            status: 'success',
            message: 'Get URL by id Succesful',
            data: url.dataValues
        } satisfies BaseApiType)

    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: 'error',
            error: 'Server error'
        } satisfies BaseApiType)
    }
}

export const createShortUrl = async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const filteredErrors = errors.array().map((error) => ({ field: (error as any).path, msg: error.msg }));
        return res.status(400).json({
            status: 'fail',
            error: filteredErrors
        } satisfies BaseApiType);
    }
    try {
        const { id } = req.user as User;
        const { originalUrl, customUrl }: { originalUrl: string, customUrl: string } = req.body;

        if (!originalUrl) return res.status(400).json({
            status: 'fail',
            error: 'URL is required'
        } satisfies BaseApiType)

        let shortUrl: string;

        if (customUrl) {
            shortUrl = customUrl.trim()
        } else {
            shortUrl = nanoid(6)
        }

        const urlExists = await URL.findOne({ where: { short_url: shortUrl } })
        if (urlExists) return res.status(400).json({
            status: 'fail',
            error: "Short URL already exists"
        })

        const newUrl = await URL.create({ id_user: id, original_url: originalUrl, short_url: shortUrl })
        await newUrl.save()

        res.status(201).json({
            status: 'success',
            message: "Short URL created successfully",
            data: newUrl,
        } satisfies BaseApiType)

    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: 'error',
            error: 'Server error'
        } satisfies BaseApiType)
    }
}

export const deleteShortUrl = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id)
        if (isNaN(id)) return res.status(400).json({ status: 'fail', error: 'Invalid ID format' } satisfies BaseApiType)

        const { id: request_id_user } = req.user as User

        const url = await URL.findByPk(id)

        if (!url) return res.status(404).json({ status: 'fail', error: 'URL not found' } satisfies BaseApiType)

        const { id_user, image_path } = url.dataValues as URL

        if (id_user !== request_id_user) return res.status(403).json({ status: 'fail', error: 'The user does not own this URL' } satisfies BaseApiType)

        if (image_path && fs.existsSync(image_path)) fs.unlinkSync(image_path)

        await URL.destroy({ where: { id: id } })

        return res.status(200).json({
            status: 'success',
            message: 'Delete Succesful'
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: 'error',
            error: 'Server error'
        } satisfies BaseApiType)
    }
}

export const createQRCode = async (req: Request, res: Response): Promise<any> => {
    try {
        const { shortUrl }: { shortUrl: string } = req.body;
        const { id: request_id_user } = req.user as User;

        const url = await URL.findOne({ where: { short_url: shortUrl } });
        if (!url) return res.status(400).json({ status: 'fail', error: 'URL not found' } satisfies BaseApiType);

        if (url.dataValues.image_path) {
            return res.status(400).json({
                status: 'fail',
                error: 'QR Code already exists for this URL'
            } satisfies BaseApiType);
        }

        const { id_user } = url.dataValues as URL;
        if (id_user !== request_id_user) return res.status(403).json({ status: 'fail', error: 'The user does not own this URL' } satisfies BaseApiType)

        const qrCodePath = path.join('public', 'qrcodes');

        if (!fs.existsSync(qrCodePath)) fs.mkdirSync(qrCodePath, { recursive: true });

        const qrCodeFileName = `${shortUrl}.png`;
        const qrCodeFilePath = path.join(qrCodePath, qrCodeFileName);

        await QRCode.toFile(qrCodeFilePath, `${process.env.BASE_URL}:${process.env.PORT}/${shortUrl}`);

        const isUpdated = await URL.update({ image_path: qrCodeFilePath }, { where: { short_url: shortUrl } });

        if (!isUpdated) return res.status(500).json({
            status: 'error',
            error: 'Failed to save QR Code to the database'
        } satisfies BaseApiType);

        return res.status(200).json({
            status: 'success',
            message: 'QR Code created and saved successfully',
            data: {
                shortUrl,
                qrCodePath: qrCodeFilePath,
            },
        } satisfies BaseApiType);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            error: 'Server error',
        } satisfies BaseApiType);
    }
};

export const getQRCode = async (req: Request, res: Response): Promise<any> => {
    try {
        const { shortUrl } = req.params as { shortUrl: string };
        const { id: request_id_user } = req.user as User;

        const url = await URL.findOne({ where: { short_url: shortUrl } });

        if (!url) return res.status(404).json({ status: 'fail', error: 'URL not found' } satisfies BaseApiType);

        const { id_user, image_path } = url.dataValues as URL;

        if (id_user !== request_id_user) return res.status(403).json({ status: 'fail', error: 'The user does not own this URL' } satisfies BaseApiType);

        if (!image_path || !fs.existsSync(image_path)) return res.status(404).json({ status: 'fail', error: 'QR Code not found' } satisfies BaseApiType);

        return res.status(200).sendFile(path.resolve(image_path));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            error: 'Server error',
        } satisfies BaseApiType);
    }
};

export const redirectShortUrl = async (req: Request, res: Response): Promise<any> => {
    const { shortUrl } = req.params as { shortUrl: string };

    const urlEntry = await URL.findOne({ where: { short_url: shortUrl } })

    if (!urlEntry || urlEntry === null) {
        const response: BaseApiType = {
            status: 'fail',
            error: 'URL not found'
        }
        res.status(404).json(response)
    } else {
        urlEntry.increment('clicks');
        res.redirect(urlEntry.original_url);
    }
}