import { NextResponse } from 'next/server';
import { Problem } from '../../utils/problem';

export async function GET() {
    const url = process.env.API_ENDPOINT;
    if (!url) {
        throw new Error('API_ENDPOINT is not defined');
    }
    const res = await fetch(url);
    const data: Problem[] = await res.json();
    return NextResponse.json(data);
}