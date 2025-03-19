import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import bcrypt from "bcryptjs";

class User extends Model {
    declare id: string;
    declare google_id?: string | null;
    declare email: string;
    declare name: string;
    declare password?: string | null;
}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    google_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    tableName: "users",
    timestamps: false,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10)
            }
        }
    }
})

export default User;