import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js"; // Koneksi ke PostgreSQL
import User from "./user.model.js";

class URL extends Model {
    declare id: number;
    declare original_url: string;
    declare shortUrl: string;
    declare clicks: number;
    declare id_user: string
}

URL.init(
    {
        id: {
            type: DataTypes.BIGINT,
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
            unique: true,
        },
        clicks: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        id_user: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    },
    {
        sequelize,
        tableName: "urls",
        createdAt: "created_at",
        updatedAt: false,
    }
);

User.hasMany(URL, {
    foreignKey: "id_user",
    as: "urls",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

URL.belongsTo(User, {
    foreignKey: "id_user",
    as: "user",
});

export default URL;