import { NextResponse } from "next/server";
import { connect } from "@/lib/db";

async function fetchOrderWithItems(conn, orderId) {
  const [orders] = await conn.execute("SELECT * FROM `Order` WHERE order_id = ?", [orderId]);
  if (!orders.length) return null;
  const [items] = await conn.execute("SELECT * FROM Order_item WHERE order_id = ?", [orderId]);
  return { ...orders[0], items };
}

export async function GET(request) {
  let conn = null;
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const status = url.searchParams.get("status");

    const where = [];
    const values = [];
    if (userId) {
      where.push("user_id = ?");
      values.push(userId);
    }
    if (status) {
      where.push("status = ?");
      values.push(status);
    }
    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    conn = await connect();
    const [orders] = await conn.execute(
      `SELECT o.*, u.first_name, u.last_name, u.email 
       FROM \`Order\` o 
       LEFT JOIN User u ON o.user_id = u.user_id 
       ${whereClause} ORDER BY o.created_at DESC`.trim(),
      values,
    );
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (conn) await conn.end();
  }
}

export async function POST(request) {
  let conn = null;
  try {
    const {
      user_id,
      total_amount,
      status = "pending",
      address = null,
      items = [],
    } = await request.json();

    if (!user_id || total_amount == null) {
      return NextResponse.json({ error: "user_id and total_amount are required" }, { status: 400 });
    }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "items must be an array" }, { status: 400 });
    }

    for (const [index, item] of items.entries()) {
      const { product_id, quantity, price_unit } = item ?? {};
      if (!product_id || quantity == null || price_unit == null) {
        return NextResponse.json(
          { error: `Invalid item at index ${index}: product_id, quantity and price_unit are required` },
          { status: 400 },
        );
      }
    }

    conn = await connect();
    try {
      await conn.beginTransaction();

      const [result] = await conn.execute(
        "INSERT INTO `Order` (user_id, address, total_amount, status) VALUES (?, ?, ?, ?)",
        [user_id, address, total_amount, status],
      );

      const orderId = result.insertId;

      for (const item of items) {
        const { product_id, quantity, price_unit } = item;
        await conn.execute(
          "INSERT INTO Order_item (order_id, product_id, quantity, price_unit) VALUES (?, ?, ?, ?)",
          [orderId, product_id, quantity, price_unit],
        );
      }

      await conn.commit();
      const order = await fetchOrderWithItems(conn, orderId);

      return NextResponse.json(order, { status: 201 });
    } catch (transactionError) {
      await conn.rollback();
      throw transactionError;
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (conn) await conn.end();
  }
}

