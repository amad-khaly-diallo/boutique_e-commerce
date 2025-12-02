import { getWishlist } from '@/lib/wishlist.js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

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


export async function POST(request) {
    const { userId, productId } = await request.json();
    if (!userId || !productId) {
        return NextResponse.json({ error: 'Missing userId or productId' }, { status: 400 });
    }
    try {
        const insertId = await addToWishlist(userId, productId);
        return NextResponse.json({ insertId });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
    }
}

export async function DELETE(request) {
    const { userId, productId } = await request.json();
    if (!userId || !productId) {
        return NextResponse.json({ error: 'Missing userId or productId' }, { status: 400 });
    }
    try {
        const success = await removeFromWishlist(userId, productId);
        if (success) {
            return NextResponse.json({ message: 'Removed from wishlist' });
        } else {
            return NextResponse.json({ error: 'Item not found in wishlist' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
    }
}

