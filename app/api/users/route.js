import { NextResponse } from "next/server";
import { connect } from "@/lib/db";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const conn = await connect();
    const [rows] = email
      ? await conn.execute("SELECT * FROM User WHERE email = ?", [email])
      : await conn.execute("SELECT * FROM User");
    await conn.end();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const {
      first_name = null,
      last_name = null,
      email,
      password,
      address = null,
    } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "email and password are required" }, { status: 400 });
    }

    const conn = await connect();
    const [result] = await conn.execute(
      `INSERT INTO User (first_name, last_name, email, password, address)
       VALUES (?, ?, ?, ?, ?)`,
      [first_name, last_name, email, password, address],
    );
    const [rows] = await conn.execute("SELECT * FROM User WHERE user_id = ?", [result.insertId]);
    await conn.end();
    if (!rows[0]) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    const status = error.code === "ER_DUP_ENTRY" ? 409 : 500;
    const message = status === 409 ? "Email already exists" : error.message;
    return NextResponse.json({ error: message }, { status });
  }
}

