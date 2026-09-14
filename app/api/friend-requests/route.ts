import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';
import FriendRequest from '../../../models/FriendRequest';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
    }

    await connectToDatabase();

    const [incoming, outgoing] = await Promise.all([
        FriendRequest.find({ to: session.user.id }).populate('from', 'username'),
        FriendRequest.find({ from: session.user.id }).populate('to', 'username'),
    ]);

    return NextResponse.json({ incoming, outgoing });
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'You must be logged in to send a friend request.' }, { status: 401 });
    }

    await connectToDatabase();

    const { to } = await req.json();
    const targetUser = await User.findOne({ username: to });
    if (!targetUser) {
        return NextResponse.json({ error: 'No user found with that username.' }, { status: 404 });
    }

    if (targetUser._id.toString() === session.user.id) {
        return NextResponse.json({ error: "You can't friend yourself." }, { status: 400 });
    }

    const me = await User.findById(session.user.id);
    if (!me) {
        return NextResponse.json({ error: 'Account not found.' }, { status: 401 });
    }
    if (me.friends.some((friendId: mongoose.Types.ObjectId) => friendId.toString() === targetUser._id.toString())) {
        return NextResponse.json({ error: 'You are already friends.' }, { status: 400 });
    }

    const reverseRequest = await FriendRequest.findOne({ from: targetUser._id, to: session.user.id });
    if (reverseRequest) {
        me.friends.push(targetUser._id);
        targetUser.friends.push(me._id);
        await Promise.all([
            me.save(),
            targetUser.save(),
            reverseRequest.deleteOne(),
        ]);
        return NextResponse.json({ status: 'accepted' }, { status: 200 });
    }

    try {
        const request = await FriendRequest.create({ from: session.user.id, to: targetUser._id });
        const populated = await request.populate('to', 'username');
        return NextResponse.json(populated, { status: 201 });
    } catch (err: any) {
        if (err.code === 11000) {
            return NextResponse.json({ error: 'You already sent a request to this user.' }, { status: 400 });
        }
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}
