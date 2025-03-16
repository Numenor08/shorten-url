import { Error, Sequelize } from "sequelize";
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