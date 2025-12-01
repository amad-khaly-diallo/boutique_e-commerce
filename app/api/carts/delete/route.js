import { NextResponse } from "next/server";
import { deleteCartItem } from "@/lib/cart";

export async function DELETE(request) {
    try {
        const { cartItemId } = await request.json();

        if (!cartItemId)
            return NextResponse.json({ error: "cartItemId requis" }, { status: 400 });

        await deleteCartItem(cartItemId);

        return NextResponse.json({ success: true });

    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
