import { Sequelize } from "sequelize";
import colors from "colors"
import dotenv from 'dotenv'

dotenv.config();

export const sequelize = new Sequelize(process.env.DB_URI!, {
    dialect: 'postgres',
    logging: false
});

export const db = async () => {
    try {
        await sequelize.authenticate();
        console.log(colors.bgWhite('PostgreSQL Connected'))
    } catch (err) {
        console.error(colors.red(`Database Connection Failed: ${err}`))
        process.exit(1);
    }
}