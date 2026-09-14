import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';
import Resource from '../../../models/Resource';
import FriendRequest from '../../../models/FriendRequest';

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findById(session.user.id);
    if (!user) {
        return NextResponse.json({ error: 'Account not found.' }, { status: 401 });
    }

    const { username, email, password, currentPassword } = await req.json();

    if (username && username !== user.username) {
        const existing = await User.findOne({ username, _id: { $ne: user._id } });
        if (existing) {
            return NextResponse.json({ error: 'That username is already taken.' }, { status: 409 });
        }
        user.username = username;
    }

    if (email && email.toLowerCase() !== user.email) {
        const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
        if (existing) {
            return NextResponse.json({ error: 'That email is already taken.' }, { status: 409 });
        }
        user.email = email.toLowerCase();
    }

    if (password) {
        if (!currentPassword) {
            return NextResponse.json({ error: 'Please enter your current password to set a new one.' }, { status: 400 });
        }
        const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isValid) {
            return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 403 });
        }
        user.passwordHash = await bcrypt.hash(password, 10);
    }

    try {
        await user.save();
    } catch (err: any) {
        if (err.code === 11000) {
            return NextResponse.json({ error: 'That username or email is already taken.' }, { status: 409 });
        }
        return NextResponse.json({ error: err.message }, { status: 400 });
    }

    return NextResponse.json({
        id: user._id,
        username: user.username,
        email: user.email,
        color: user.color,
        icon: user.icon,
    });
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
    }

    const { password } = await req.json();
    if (!password) {
        return NextResponse.json({ error: 'Please enter your password to confirm.' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById(session.user.id);
    if (!user) {
        return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
        return NextResponse.json({ error: 'Incorrect password.' }, { status: 403 });
    }

    await Promise.all([
        Resource.deleteMany({ owner: user._id }),
        FriendRequest.deleteMany({ $or: [{ from: user._id }, { to: user._id }] }),
        User.updateMany({ friends: user._id }, { $pull: { friends: user._id } }),
    ]);

    await user.deleteOne();

    return new NextResponse(null, { status: 204 });
}
