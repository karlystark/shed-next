import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { password } = await req.json();

    if (!password || password !== process.env.SITE_PASSWORD) {
        return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set('shed_access', 'granted', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 90,
        path: '/',
    });
    return response;
}
