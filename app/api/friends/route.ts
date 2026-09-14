import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
    }

    await connectToDatabase();

    const me = await User.findById(session.user.id).populate('friends', 'username');
    if (!me) {
        return NextResponse.json({ error: 'Account not found.' }, { status: 401 });
    }
    return NextResponse.json(me.friends);
}
