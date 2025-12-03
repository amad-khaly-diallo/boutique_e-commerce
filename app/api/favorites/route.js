import { getWishlist } from '@/lib/wishlist.js';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
  const url = new URL(request.url);
    const { user } = await verifyAuth(request);
    const userId = user.user_id;

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const id = parseInt(userId, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
  }

  try {
    const wishlist = await getWishlist(id);
    return NextResponse.json(wishlist);
  } catch (error) {
    console.error("GET /api/favorites error:", error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

