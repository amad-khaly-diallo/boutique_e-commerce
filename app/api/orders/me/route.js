import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

async function fetchOrderWithItems(conn, orderId) {
  const [orders] = await conn.execute("SELECT * FROM `Order` WHERE order_id = ?", [orderId]);
  if (!orders.length) return null;
  const [items] = await conn.execute("SELECT * FROM Order_item WHERE order_id = ?", [orderId]);
  return { ...orders[0], items };
}

export async function GET(request) {
  try {
    const { user } = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé — vous devez être connecté" },
        { status: 401 },
      );
    }

    const conn = await connect();

    const [orders] = await conn.execute(
      "SELECT * FROM `Order` WHERE user_id = ? ORDER BY created_at DESC",
      [user.user_id],
    );

    const detailed = [];

    for (const order of orders) {
      const full = await fetchOrderWithItems(conn, order.order_id);
      if (full) detailed.push(full);
    }

    await conn.end();

    return NextResponse.json(detailed);
  } catch (error) {
    console.error("GET /api/orders/me error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


