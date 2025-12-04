import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { connect } from "@/lib/db";

export async function GET(request) {
  const { user } = await verifyAuth(request);

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  let conn = null;
  try {
    // Récupérer les informations complètes de l'utilisateur depuis la DB
    conn = await connect();
    const [rows] = await conn.execute(
      "SELECT user_id, first_name, last_name, email, role, created_at, updated_at FROM User WHERE user_id = ?",
      [user.user_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json(
      {
        user: rows[0],
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  } finally {
    if (conn) await conn.end();
  }
}


