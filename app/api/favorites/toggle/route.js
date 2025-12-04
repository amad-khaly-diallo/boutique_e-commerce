import { NextResponse } from "next/server";
import { toggleFavorite } from "@/lib/wishlist";
import { verifyAuth } from "@/lib/auth";

export async function POST(request) {
  try {
    const { user } = await verifyAuth(request);
    const { productId } = await request.json();
    const userId = user.user_id;

    if (!productId) return NextResponse.json({ error: "productId requis" }, { status: 400 });

    if(!userId) return NextResponse.json({ error: "User_id requis" }, { status: 400 })

    const result = await toggleFavorite(userId, productId);

    return NextResponse.json(result, { status: 200 });

  } catch (err) {
    console.error("Erreur favoris :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
