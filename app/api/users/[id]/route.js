import { NextResponse } from "next/server";
import { connect } from "@/lib/db";

async function findUser(conn, userId) {
  const [rows] = await conn.execute("SELECT * FROM User WHERE user_id = ?", [userId]);
  return rows[0] ?? null;
}

export async function GET(_request, { params }) {
  try {
    const conn = await connect();
    const user = await findUser(conn, params.id);
    await conn.end();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const payload = await request.json();
    const allowedFields = ["first_name", "last_name", "email", "password", "address"];
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(payload)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (!fields.length) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    const conn = await connect();
    const [result] = await conn.execute(
      `UPDATE User SET ${fields.join(", ")} WHERE user_id = ?`,
      [...values, params.id],
    );

    if (result.affectedRows === 0) {
      await conn.end();
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = await findUser(conn, params.id);
    await conn.end();
    return NextResponse.json(user);
  } catch (error) {
    const status = error.code === "ER_DUP_ENTRY" ? 409 : 500;
    const message = status === 409 ? "Email already exists" : error.message;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const conn = await connect();
    const [result] = await conn.execute("DELETE FROM User WHERE user_id = ?", [params.id]);
    await conn.end();
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

