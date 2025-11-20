import { NextResponse } from "next/server";
import { connect } from "@/lib/db";

async function fetchOrderWithItems(conn, orderId) {
  const [orders] = await conn.execute("SELECT * FROM `Order` WHERE order_id = ?", [orderId]);
  if (!orders.length) return null;
  const [items] = await conn.execute("SELECT * FROM Order_item WHERE order_id = ?", [orderId]);
  return { ...orders[0], items };
}

export async function GET(_request, { params }) {
  try {
    const conn = await connect();
    const order = await fetchOrderWithItems(conn, params.id);
    await conn.end();
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const payload = await request.json();
    const fields = [];
    const values = [];

    if (payload.status) {
      fields.push("status = ?");
      values.push(payload.status);
    }

    if (payload.total_amount != null) {
      fields.push("total_amount = ?");
      values.push(payload.total_amount);
    }

    if (!fields.length) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    const conn = await connect();
    const [result] = await conn.execute(
      `UPDATE \`Order\` SET ${fields.join(", ")} WHERE order_id = ?`,
      [...values, params.id],
    );

    if (!result.affectedRows) {
      await conn.end();
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = await fetchOrderWithItems(conn, params.id);
    await conn.end();
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const conn = await connect();
    const [result] = await conn.execute("DELETE FROM `Order` WHERE order_id = ?", [params.id]);
    await conn.end();
    if (!result.affectedRows) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

