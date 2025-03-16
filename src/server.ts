import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import urlRouter from './routes/urlRoute.js'

dotenv.config()

const PORT = process.env.PORT
const app = express();

app.use(express.json())

app.use('/', urlRouter)

app.listen(PORT, () => {
    console.log(colors.green(`Server is Listening at ${PORT}`))
})