import { NextResponse } from "next/server";
import { getUserCart } from "@/lib/cart";
import { verifyAuth } from "@/lib/auth";

export async function GET(request) {
    try {

        const { user } = await verifyAuth(request);
        const userId = user.user_id;

        if (!user) {
            return NextResponse.json(
                { error: "Non autorisé — vous devez être connecté" },
                { status: 401 }
            );
        }

        if (!userId) {
            return NextResponse.json({ error: "userId manquant" }, { status: 400 });
        }

        const cart = await getUserCart(userId);
        return NextResponse.json({ success: true, cart });

    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
