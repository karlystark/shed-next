import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectToDatabase from './mongoose';
import User from '../models/User';

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                await connectToDatabase();
                const user = await User.findOne({ email: credentials.email.toLowerCase() });
                if (!user) {
                    return null;
                }

                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!isValid) {
                    return null;
                }

                return {
                    id: user._id.toString(),
                    username: user.username,
                    email: user.email,
                    color: user.color,
                    icon: user.icon,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.color = user.color;
                token.icon = user.icon;
            }
            if (trigger === 'update' && session) {
                if (session.username) token.username = session.username;
                if (session.email) token.email = session.email;
                if (session.color) token.color = session.color;
                if (session.icon) token.icon = session.icon;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.color = token.color;
                session.user.icon = token.icon;
            }
            return session;
        },
    },
};
