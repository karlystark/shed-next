import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import connectToDatabase from '../../../lib/mongoose';
import Resource from '../../../models/Resource';
import User from '../../../models/User';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'You must be logged in to view resources.' }, { status: 401 });
    }

    await connectToDatabase();

    const me = await User.findById(session.user.id);
    if (!me) {
        return NextResponse.json({ error: 'Account not found.' }, { status: 401 });
    }
    const friendIds = me.friends.map((id: any) => id.toString());

    const owner = req.nextUrl.searchParams.get('owner');
    const filter: Record<string, unknown> = {};

    if (owner) {
        const ownerUser = await User.findOne({ username: owner });
        if (!ownerUser) {
            return NextResponse.json([], { status: 200 });
        }
        const isSelf = ownerUser._id.toString() === session.user.id;
        const isFriend = friendIds.includes(ownerUser._id.toString());
        if (!isSelf && !isFriend) {
            return NextResponse.json({ error: 'You can only view resources from friends.' }, { status: 403 });
        }
        filter.owner = ownerUser._id;
    } else {
        filter.owner = { $in: [session.user.id, ...friendIds] };
    }

    const resources = await Resource.find(filter).populate('owner', 'username').sort({ createdAt: -1 });
    return NextResponse.json(resources);
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'You must be logged in to add a resource.' }, { status: 401 });
    }

    await connectToDatabase();

    const { title, quantity, description, category } = await req.json();

    try {
        const resource = await Resource.create({
            title,
            quantity,
            description,
            category,
            owner: session.user.id,
        });
        const populated = await resource.populate('owner', 'username');
        return NextResponse.json(populated, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}
