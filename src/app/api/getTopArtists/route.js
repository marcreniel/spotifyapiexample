import { authOptions } from '../auth/[...nextauth]/route'
import { getTopArtists } from '../../handlers/handler';
import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'

export async function GET() {
    const session = await getServerSession(authOptions)    

    if (!session || !session.user) {
        return NextResponse.json({ error: '404 Unauthorized' });
    }

    const accessToken = session.user.accessToken;
    
    try {
        const response = await getTopArtists(accessToken);
        const {items} = await response.json();
        
        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching API' });
    }
}