import { NextResponse } from "next/server";
import { connect } from "@/lib/db";

async function fetchCartWithItems(conn, cartId) {
  const [carts] = await conn.execute("SELECT * FROM Cart WHERE cart_id = ?", [cartId]);
  if (!carts.length) return null;
  const [items] = await conn.execute("SELECT * FROM Cart_item WHERE cart_id = ?", [cartId]);
  return { ...carts[0], items };
}

export async function GET(_request, { params }) {
  try {
    const conn = await connect();
    const cart = await fetchCartWithItems(conn, params.id);
    await conn.end();
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { user_id, items } = await request.json();

    if (user_id == null && !Array.isArray(items)) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    if (Array.isArray(items)) {
      for (const [index, item] of items.entries()) {
        const { product_id, quantity } = item ?? {};
        if (!product_id || quantity == null) {
          return NextResponse.json(
            { error: `Invalid item at index ${index}: product_id and quantity are required` },
            { status: 400 },
          );
        }
      }
    }

    const conn = await connect();

    try {
      await conn.beginTransaction();

      const [existing] = await conn.execute("SELECT cart_id FROM Cart WHERE cart_id = ?", [params.id]);
      if (!existing.length) {
        await conn.rollback();
        await conn.end();
        return NextResponse.json({ error: "Cart not found" }, { status: 404 });
      }

      if (user_id != null) {
        await conn.execute("UPDATE Cart SET user_id = ? WHERE cart_id = ?", [user_id, params.id]);
      }

      if (Array.isArray(items)) {
        await conn.execute("DELETE FROM Cart_item WHERE cart_id = ?", [params.id]);
        for (const item of items) {
          const { product_id, quantity } = item;
          await conn.execute(
            "INSERT INTO Cart_item (cart_id, product_id, quantity) VALUES (?, ?, ?)",
            [params.id, product_id, quantity],
          );
        }
      }

      await conn.commit();
      const cart = await fetchCartWithItems(conn, params.id);
      await conn.end();
      return NextResponse.json(cart);
    } catch (transactionError) {
      await conn.rollback();
      await conn.end();
      throw transactionError;
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const conn = await connect();
    const [result] = await conn.execute("DELETE FROM Cart WHERE cart_id = ?", [params.id]);
    await conn.end();
    if (!result.affectedRows) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

