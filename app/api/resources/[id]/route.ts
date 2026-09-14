import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import connectToDatabase from '../../../../lib/mongoose';
import Resource from '../../../../models/Resource';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await connectToDatabase();

    const resource = await Resource.findById(params.id).populate('owner', 'username');
    if (!resource) {
        return NextResponse.json({ error: 'Resource not found.' }, { status: 404 });
    }
    return NextResponse.json(resource);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'You must be logged in to edit a resource.' }, { status: 401 });
    }

    await connectToDatabase();

    const resource = await Resource.findById(params.id);
    if (!resource) {
        return NextResponse.json({ error: 'Resource not found.' }, { status: 404 });
    }
    if (resource.owner.toString() !== session.user.id) {
        return NextResponse.json({ error: 'You can only edit your own resources.' }, { status: 403 });
    }

    const { title, quantity, description, category } = await req.json();

    try {
        resource.title = title;
        resource.quantity = quantity;
        resource.description = description;
        resource.category = category;
        await resource.save();
        const populated = await resource.populate('owner', 'username');
        return NextResponse.json(populated);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'You must be logged in to delete a resource.' }, { status: 401 });
    }

    await connectToDatabase();

    const resource = await Resource.findById(params.id);
    if (!resource) {
        return NextResponse.json({ error: 'Resource not found.' }, { status: 404 });
    }
    if (resource.owner.toString() !== session.user.id) {
        return NextResponse.json({ error: 'You can only delete your own resources.' }, { status: 403 });
    }

    await resource.deleteOne();
    return new NextResponse(null, { status: 204 });
}
