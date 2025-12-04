import { NextResponse } from "next/server";
import { connect } from "@/lib/db";

export async function GET(request) {
  let conn = null;
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    conn = await connect();
    const [rows] = email
      ? await conn.execute("SELECT user_id, first_name, last_name, email, role, created_at, updated_at FROM User WHERE email = ?", [email])
      : await conn.execute("SELECT user_id, first_name, last_name, email, role, created_at, updated_at FROM User");
    return NextResponse.json(rows);
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
      first_name = null,
      last_name = null,
      email,
      password,
      role = 'user',
    } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "email and password are required" }, { status: 400 });
    }

    // Hasher le mot de passe
    const { hashPassword } = await import("@/lib/helpers");
    const hashedPassword = await hashPassword(password);

    conn = await connect();
    const [result] = await conn.execute(
      `INSERT INTO User (first_name, last_name, email, password, role)
       VALUES (?, ?, ?, ?, ?)`,
      [first_name, last_name, email, hashedPassword, role],
    );
    const [rows] = await conn.execute("SELECT user_id, first_name, last_name, email, role, created_at, updated_at FROM User WHERE user_id = ?", [result.insertId]);
    if (!rows[0]) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    const status = error.code === "ER_DUP_ENTRY" ? 409 : 500;
    const message = status === 409 ? "Email already exists" : error.message;
    return NextResponse.json({ error: message }, { status });
  } finally {
    if (conn) await conn.end();
  }
}

