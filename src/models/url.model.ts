import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js"; // Koneksi ke PostgreSQL

class URL extends Model {
    declare id: number;
    declare original_url: string;
    declare shortUrl: string;
    declare clicks: number;
}

URL.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        original_url: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        short_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        clicks: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        tableName: "urls",
        createdAt: "created_at",
        updatedAt: false,
    }
);

export default URL;