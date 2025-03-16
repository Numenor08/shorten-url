import { Sequelize } from "sequelize";
import pg from 'pg'
import colors from "colors"
import dotenv from 'dotenv'

dotenv.config();

export const sequelize = new Sequelize({
    dialect: 'postgres',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: false,
});

export const pgPool = new pg.Pool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
});

export const db = async () => {
    try {
        await sequelize.authenticate();
        console.log(colors.bgGreen.black(' PostgreSQL Connected '))
    } catch (err: any) {
        console.error(colors.bgRed.black(` Database Connection Failed: `))
        console.error(colors.red(err))
        process.exit(1);
    }
}