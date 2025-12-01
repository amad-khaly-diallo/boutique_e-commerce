import { NextResponse } from "next/server";
import { updateCartItem } from "@/lib/cart";

export async function PUT(request) {
    try {
        const { cartItemId, quantity } = await request.json();

        if (!cartItemId || quantity === undefined) {
            return NextResponse.json(
                { error: "cartItemId et quantity requis" },
                { status: 400 }
            );
        }

        await updateCartItem(cartItemId, quantity);

        return NextResponse.json({ success: true });

    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
