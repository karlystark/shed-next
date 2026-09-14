import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import connectToDatabase from '../../../../lib/mongoose';
import User from '../../../../models/User';

export async function DELETE(req: NextRequest, { params }: { params: { username: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
    }

    await connectToDatabase();

    const other = await User.findOne({ username: params.username });
    if (!other) {
        return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const me = await User.findById(session.user.id);
    if (!me) {
        return NextResponse.json({ error: 'Account not found.' }, { status: 401 });
    }

    me.friends = me.friends.filter((id: any) => id.toString() !== other._id.toString());
    other.friends = other.friends.filter((id: any) => id.toString() !== me._id.toString());

    await Promise.all([me.save(), other.save()]);

    return new NextResponse(null, { status: 204 });
}
