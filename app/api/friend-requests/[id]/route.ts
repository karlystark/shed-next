import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import connectToDatabase from '../../../../lib/mongoose';
import User from '../../../../models/User';
import FriendRequest from '../../../../models/FriendRequest';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
    }

    await connectToDatabase();

    const request = await FriendRequest.findById(params.id);
    if (!request) {
        return NextResponse.json({ error: 'Friend request not found.' }, { status: 404 });
    }
    if (request.to.toString() !== session.user.id) {
        return NextResponse.json({ error: 'You can only accept requests sent to you.' }, { status: 403 });
    }

    const [me, sender] = await Promise.all([
        User.findById(request.to),
        User.findById(request.from),
    ]);

    me.friends.push(sender._id);
    sender.friends.push(me._id);

    await Promise.all([
        me.save(),
        sender.save(),
        request.deleteOne(),
    ]);

    return NextResponse.json({ status: 'accepted' });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
    }

    await connectToDatabase();

    const request = await FriendRequest.findById(params.id);
    if (!request) {
        return NextResponse.json({ error: 'Friend request not found.' }, { status: 404 });
    }
    if (request.to.toString() !== session.user.id && request.from.toString() !== session.user.id) {
        return NextResponse.json({ error: 'You can only remove your own requests.' }, { status: 403 });
    }

    await request.deleteOne();
    return new NextResponse(null, { status: 204 });
}
