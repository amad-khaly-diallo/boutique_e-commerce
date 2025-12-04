import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

function maskCardNumber(numero) {
  const s = String(numero).replace(/\s+/g, "");
  if (s.length <= 4) return s;
  return "•••• •••• •••• " + s.slice(-4);
}

export async function PUT(request, { params }) {
  try {
    const { user } = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé — vous devez être connecté" },
        { status: 401 },
      );
    }

    const paymentId = params.id;
    const payload = await request.json();

    const {
      titulaire,
      type,
      numero,
      expiry,
      parDefaut,
    } = payload;

    if (type && !["Visa", "MasterCard", "American Express"].includes(type)) {
      return NextResponse.json(
        { error: "Type de carte invalide." },
        { status: 400 },
      );
    }

    const conn = await connect();

    try {
      if (parDefaut) {
        await conn.execute(
          "UPDATE PaymentMethod SET parDefaut = 0 WHERE user_id = ?",
          [user.user_id],
        );
      }

      const fields = [];
      const values = [];

      if (titulaire !== undefined) {
        fields.push("titulaire = ?");
        values.push(titulaire);
      }
      if (type !== undefined) {
        fields.push("type = ?");
        values.push(type);
      }
      if (numero !== undefined) {
        fields.push("numero_masque = ?");
        values.push(maskCardNumber(numero));
      }
      if (expiry !== undefined) {
        fields.push("expiry = ?");
        values.push(expiry);
      }
      if (parDefaut !== undefined) {
        fields.push("parDefaut = ?");
        values.push(parDefaut ? 1 : 0);
      }

      if (!fields.length) {
        await conn.end();
        return NextResponse.json(
          { error: "Aucun champ valide fourni" },
          { status: 400 },
        );
      }

      const [result] = await conn.execute(
        `UPDATE PaymentMethod SET ${fields.join(", ")} WHERE payment_id = ? AND user_id = ?`,
        [...values, paymentId, user.user_id],
      );

      if (!result.affectedRows) {
        await conn.end();
        return NextResponse.json(
          { error: "Méthode de paiement introuvable" },
          { status: 404 },
        );
      }

      const [rows] = await conn.execute(
        "SELECT * FROM PaymentMethod WHERE payment_id = ?",
        [paymentId],
      );
      await conn.end();

      return NextResponse.json(rows[0]);
    } catch (err) {
      await conn.end();
      throw err;
    }
  } catch (error) {
    console.error("PUT /api/payments/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { user } = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé — vous devez être connecté" },
        { status: 401 },
      );
    }

    const paymentId = params.id;
    const conn = await connect();

    const [result] = await conn.execute(
      "DELETE FROM PaymentMethod WHERE payment_id = ? AND user_id = ?",
      [paymentId, user.user_id],
    );

    await conn.end();

    if (!result.affectedRows) {
      return NextResponse.json(
        { error: "Méthode de paiement introuvable" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/payments/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


