import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';

export async function POST(req: NextRequest) {
    await connectToDatabase();

    const { username, email, password, color, icon } = await req.json();

    if (!username || !email || !password) {
        return NextResponse.json({ error: 'Username, email, and password are required.' }, { status: 400 });
    }

    const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    if (existingUser) {
        const field = existingUser.email === email.toLowerCase() ? 'email' : 'username';
        return NextResponse.json({ error: `That ${field} is already taken.` }, { status: 409 });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, passwordHash, color, icon });

        return NextResponse.json({
            id: user._id,
            username: user.username,
            email: user.email,
            color: user.color,
            icon: user.icon,
        }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}
