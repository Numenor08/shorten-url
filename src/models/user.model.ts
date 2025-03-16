import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

class User extends Model {
    declare id: number;
    declare google_id: string;
    declare name: string;
}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    google_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: "users",
})