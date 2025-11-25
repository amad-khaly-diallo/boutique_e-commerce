import { NextResponse } from "next/server";
import { connect } from "@/lib/db";

async function fetchCartWithItems(conn, cartId) {
  const [carts] = await conn.execute("SELECT * FROM Cart WHERE cart_id = ?", [cartId]);
  if (!carts.length) return null;
  const [items] = await conn.execute("SELECT * FROM Cart_item WHERE cart_id = ?", [cartId]);
  return { ...carts[0], items };
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const conn = await connect();

    const [rows] = userId
      ? await conn.execute("SELECT * FROM Cart WHERE user_id = ?", [userId])
      : await conn.execute("SELECT * FROM Cart");

    await conn.end();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { user_id, items = [] } = await request.json();

    if (!user_id) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "items must be an array" }, { status: 400 });
    }

    for (const [index, item] of items.entries()) {
      const { product_id, quantity } = item ?? {};
      if (!product_id || quantity == null) {
        return NextResponse.json(
          { error: `Invalid item at index ${index}: product_id and quantity are required` },
          { status: 400 },
        );
      }
    }

    const conn = await connect();
    try {
      await conn.beginTransaction();
      const [result] = await conn.execute("INSERT INTO Cart (user_id) VALUES (?)", [user_id]);
      const cartId = result.insertId;

      for (const item of items) {
        const { product_id, quantity } = item;
        await conn.execute(
          "INSERT INTO Cart_item (cart_id, product_id, quantity) VALUES (?, ?, ?)",
          [cartId, product_id, quantity],
        );
      }

      await conn.commit();
      const cart = await fetchCartWithItems(conn, cartId);
      await conn.end();
      return NextResponse.json(cart, { status: 201 });
    } catch (transactionError) {
      await conn.rollback();
      await conn.end();
      throw transactionError;
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

