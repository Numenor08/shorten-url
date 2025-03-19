import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
import { UUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { BaseApiType } from '../types/baseApiType.js';

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
                const email = profile.emails?.[0]?.value || '';
                if (!email) {
                    return done(null, false, { status: 'success', message: 'Email not found in Google profile' } satisfies BaseApiType);
                }

                const existingUser = await User.findOne({ where: { email } } );

                if (existingUser) {
                    if (!existingUser.google_id) {
                        existingUser.google_id = profile.id;
                        await existingUser.save();
                        return done(null, existingUser, { status: 'success', message: 'Email already exist. Now Google account is linked' } satisfies BaseApiType);
                    }

                    return done(null, existingUser, { status: 'success', message: 'You are logged in successfully.' } satisfies BaseApiType);
                }

                const user = await User.create({
                    google_id: profile.id,
                    name: profile.displayName,
                    email,
                });

                return done(null, user, { status: 'success', message: 'You are logged in successfully.' } satisfies BaseApiType);
            } catch (err) {
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