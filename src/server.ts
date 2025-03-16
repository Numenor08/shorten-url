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

dotenv.config()

const PORT = process.env.PORT
const app = express();

app.use(cors())
app.use(express.json())
app.use(
    session({
        secret: process.env.SESSION_SECRET || "supersecret",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use('/', urlRouter)

app.listen(PORT, async () => {
    await db()
    console.log(colors.green(`🚀 Server running at http://localhost:${PORT}`))
})