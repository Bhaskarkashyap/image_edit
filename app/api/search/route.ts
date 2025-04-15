import { NextResponse } from 'next/server';
import { searchImages } from '../../../lib/pixabay';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    try {
        const images = await searchImages(query);
        return NextResponse.json(images);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch images' },
            { status: 500 }
        );
    }
}