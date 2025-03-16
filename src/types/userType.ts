import UserModel from '../models/user.model.js';

declare global {
    namespace Express {
        interface User extends UserModel {}
    }
}