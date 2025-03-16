import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
import { UUID } from 'crypto';

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

passport.serializeUser((user: User, done) => {
    if (!user || !user.id) {
        return done(new Error('Invalid user object'), null);
    }
    done(null, user.id); // Simpan user.id ke dalam session
});

passport.deserializeUser(async (id: UUID, done) => {
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return done(new Error('User not found'), null);
        }
        done(null, user);
    } catch (err) {
        console.error('Error in deserializeUser:', err);
        done(err, null);
    }
});