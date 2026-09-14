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

    const users = await User.find(
        { _id: { $ne: session.user.id } },
        'username color icon'
    ).sort({ username: 1 });

    return NextResponse.json(users);
}
