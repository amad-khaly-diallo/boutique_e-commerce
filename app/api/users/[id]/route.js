import { NextResponse } from "next/server";
import { connect } from "@/lib/db";

async function findUser(conn, userId) {
  const [rows] = await conn.execute("SELECT user_id, first_name, last_name, email, role, created_at, updated_at FROM User WHERE user_id = ?", [userId]);
  return rows[0] ?? null;
}

export async function GET(_request, { params }) {
  let conn = null;
  try {
    conn = await connect();
    const { id } = await params;
    const user = await findUser(conn, id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (conn) await conn.end();
  }
}

export async function PUT(request, { params }) {
  let conn = null;
  try {
    const { id } = await params;
    const payload = await request.json();
    const allowedFields = ["first_name", "last_name", "email", "password", "role"];
    const fields = [];
    const values = [];
    
    // Si le mot de passe est fourni, le hasher avant de l'ajouter
    if (payload.password && allowedFields.includes("password")) {
      const { hashPassword } = await import("@/lib/helpers");
      const hashedPassword = await hashPassword(payload.password);
      fields.push("password = ?");
      values.push(hashedPassword);
    }
    
    for (const [key, value] of Object.entries(payload)) {
      if (allowedFields.includes(key) && key !== "password") {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (!fields.length) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    conn = await connect();
    const [result] = await conn.execute(
      `UPDATE User SET ${fields.join(", ")} WHERE user_id = ?`,
      [...values, id],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = await findUser(conn, id);
    return NextResponse.json(user);
  } catch (error) {
    const status = error.code === "ER_DUP_ENTRY" ? 409 : 500;
    const message = status === 409 ? "Email already exists" : error.message;
    return NextResponse.json({ error: message }, { status });
  } finally {
    if (conn) await conn.end();
  }
}

export async function DELETE(_request, { params }) {
  let conn = null;
  try {
    const { id } = await params;
    conn = await connect();
    const [result] = await conn.execute("DELETE FROM User WHERE user_id = ?", [id]);
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (conn) await conn.end();
  }
}

