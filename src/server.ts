import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import urlRouter from './routes/urlRoute.js'
import authRoutes from './routes/authRoutes.js'
import cors from 'cors'
import session from 'express-session'
import { db } from './config/db.js'
import passport from 'passport'
import './config/passport.js'
import pgSession from 'connect-pg-simple'
import { pgPool } from './config/db.js'
import { rateLimit } from 'express-rate-limit'
import { redirectShortUrl } from './controllers/url.controller.js'
import { isAuthenticated } from './middlewares/authMiddleware.js'

dotenv.config()

const PORT = process.env.PORT
const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 250,
    message: { error: 'Too many requests from this IP, please try again later'}
})

app.use(cors())
app.use(express.json())
app.use(limiter)
app.use(
    session({
        store: new (pgSession(session))({
            pool: pgPool,
            tableName: 'session',
            pruneSessionInterval: 60 * 5,
        }),
        secret: process.env.SESSION_SECRET || "supersecret",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
}))
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use('/api', urlRouter)
app.use('/:shortUrl',isAuthenticated, redirectShortUrl)

app.listen(PORT, async () => {
    await db()
    console.log(colors.green(`🚀 Server running at http://localhost:${PORT}`))
})