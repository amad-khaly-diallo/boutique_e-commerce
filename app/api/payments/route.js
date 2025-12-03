import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

function maskCardNumber(numero) {
  const s = String(numero).replace(/\s+/g, "");
  if (s.length <= 4) return s;
  return "•••• •••• •••• " + s.slice(-4);
}

export async function GET(request) {
  try {
    const { user } = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé — vous devez être connecté" },
        { status: 401 },
      );
    }

    const conn = await connect();
    const [rows] = await conn.execute(
      "SELECT * FROM PaymentMethod WHERE user_id = ? ORDER BY parDefaut DESC, payment_id DESC",
      [user.user_id],
    );
    await conn.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/payments error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { user } = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé — vous devez être connecté" },
        { status: 401 },
      );
    }

    const payload = await request.json();
    const {
      titulaire,
      type,
      numero,
      expiry,
      parDefaut = false,
    } = payload;

    if (!titulaire || !numero || !expiry) {
      return NextResponse.json(
        { error: "Titulaire, numéro et date d'expiration sont requis." },
        { status: 400 },
      );
    }

    if (!["Visa", "MasterCard", "American Express"].includes(type)) {
      return NextResponse.json(
        { error: "Type de carte invalide." },
        { status: 400 },
      );
    }

    const numero_masque = maskCardNumber(numero);

    const conn = await connect();

    try {
      if (parDefaut) {
        await conn.execute(
          "UPDATE PaymentMethod SET parDefaut = 0 WHERE user_id = ?",
          [user.user_id],
        );
      }

      const [result] = await conn.execute(
        `INSERT INTO PaymentMethod
          (user_id, titulaire, type, numero_masque, expiry, parDefaut)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          user.user_id,
          titulaire,
          type,
          numero_masque,
          expiry,
          parDefaut ? 1 : 0,
        ],
      );

      const [rows] = await conn.execute(
        "SELECT * FROM PaymentMethod WHERE payment_id = ?",
        [result.insertId],
      );

      await conn.end();

      return NextResponse.json(rows[0], { status: 201 });
    } catch (err) {
      await conn.end();
      throw err;
    }
  } catch (error) {
    console.error("POST /api/payments error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


