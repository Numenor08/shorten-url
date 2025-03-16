import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
import { UUID } from 'crypto';
import bcrypt from 'bcryptjs';

dotenv.config();

const PORT = process.env.PORT;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: `http://localhost:${PORT}/api/auth/google/callback`,
        },
        async (_, __, profile, done) => {
            try {
                // Cari atau buat user di database
                const [user] = await User.findOrCreate({
                    where: { google_id: profile.id },
                    defaults: {
                        name: profile.displayName,
                        email: profile.emails?.[0].value || '',
                    },
                });
                return done(null, user); // Pastikan hanya instance User yang dikembalikan
            } catch (err: any) {
                console.error('Error in GoogleStrategy:', err);
                return done(err, false);
            }
        }
    )
);

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {

                const user = await User.findOne({ where: { email } });
                if (!user) {
                    return done(null, false, { message: 'Incorrect email or password.' });
                }

                const isMatch = await bcrypt.compare(password, user.password || '');
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password.' });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.serializeUser((user: User, done) => {
    if (!user || !user.id) {
        return done(new Error('Invalid user object'), null);
    }
    done(null, user.id); // Simpan user.id ke dalam session
});

passport.deserializeUser(async (id: UUID, done) => {
    try {
        const user = await User.findByPk(id, { attributes: ['id', 'email', 'name'] });
        if (!user) {
            return done(new Error('User not found'), null);
        }
        done(null, user);
    } catch (err) {
        console.error('Error in deserializeUser:', err);
        done(err, null);
    }
});