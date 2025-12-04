import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { connect } from "@/lib/db";
import { verifyPassword } from "@/lib/helpers";

export async function POST(request) {
  let conn = null;
  try {
    const { user } = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Mot de passe requis" },
        { status: 400 }
      );
    }

    // Récupérer le hash du mot de passe de l'utilisateur
    conn = await connect();
    const [rows] = await conn.execute(
      "SELECT password FROM User WHERE user_id = ?",
      [user.user_id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const isValid = await verifyPassword(password, rows[0].password);

    return NextResponse.json(
      { valid: isValid },
      { status: 200 }
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

