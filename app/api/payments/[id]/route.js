import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import {
  validateCardNumber,
  validateCardHolder,
  validateExpiryDate,
  validateCardType,
} from "@/lib/paymentValidation";

function maskCardNumber(numero) {
  const s = String(numero).replace(/\s+/g, "");
  if (s.length <= 4) return s;
  return "•••• •••• •••• " + s.slice(-4);
}

export async function GET(request, { params }) {
  let conn = null;
  try {
    const { user } = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé — vous devez être connecté" },
        { status: 401 },
      );
    }

    const { id } = await params;
    conn = await connect();
    const [rows] = await conn.execute(
      "SELECT * FROM PaymentMethod WHERE payment_id = ? AND user_id = ?",
      [id, user.user_id],
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: "Méthode de paiement introuvable" },
        { status: 404 },
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("GET /api/payments/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (conn) await conn.end();
  }
}

export async function PUT(request, { params }) {
  let conn = null;
  try {
    const { user } = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé — vous devez être connecté" },
        { status: 401 },
      );
    }

    const { id: paymentId } = await params;
    const payload = await request.json();

    const {
      titulaire,
      type,
      numero,
      expiry,
      parDefaut,
    } = payload;

    // Valider le type si fourni
    if (type !== undefined) {
      const typeValidation = validateCardType(type);
      if (!typeValidation.valid) {
        return NextResponse.json(
          { error: typeValidation.error || "Type de carte invalide." },
          { status: 400 },
        );
      }
    }

    // Valider le titulaire si fourni
    if (titulaire !== undefined) {
      const holderValidation = validateCardHolder(titulaire);
      if (!holderValidation.valid) {
        return NextResponse.json(
          { error: holderValidation.error || "Nom du titulaire invalide." },
          { status: 400 },
        );
      }
    }

    conn = await connect();

    // Récupérer le type existant si nécessaire pour valider le numéro
    let existingType = type;
    if (numero !== undefined && !type) {
      const [existingRows] = await conn.execute(
        "SELECT type FROM PaymentMethod WHERE payment_id = ? AND user_id = ?",
        [paymentId, user.user_id],
      );
      if (existingRows.length > 0) {
        existingType = existingRows[0].type;
      }
    }

    // Valider le numéro de carte si fourni
    if (numero !== undefined) {
      const cardType = existingType || "Visa"; // Utiliser le type fourni, existant ou un défaut
      const numberValidation = validateCardNumber(numero, cardType);
      if (!numberValidation.valid) {
        return NextResponse.json(
          { error: numberValidation.error || "Numéro de carte invalide." },
          { status: 400 },
        );
      }
    }

    // Valider la date d'expiration si fournie
    if (expiry !== undefined) {
      const expiryValidation = validateExpiryDate(expiry);
      if (!expiryValidation.valid) {
        return NextResponse.json(
          { error: expiryValidation.error || "Date d'expiration invalide." },
          { status: 400 },
        );
      }
    }

    if (parDefaut) {
      await conn.execute(
        "UPDATE PaymentMethod SET parDefaut = 0 WHERE user_id = ?",
        [user.user_id],
      );
    }

    const fields = [];
    const values = [];

    if (titulaire !== undefined) {
      const holderValidation = validateCardHolder(titulaire);
      fields.push("titulaire = ?");
      values.push(holderValidation.cleaned);
    }
    if (type !== undefined) {
      fields.push("type = ?");
      values.push(type);
    }
    if (numero !== undefined) {
      const cardType = existingType || "Visa";
      const numberValidation = validateCardNumber(numero, cardType);
      fields.push("numero_masque = ?");
      values.push(maskCardNumber(numberValidation.cleaned));
    }
    if (expiry !== undefined) {
      const expiryValidation = validateExpiryDate(expiry);
      fields.push("expiry = ?");
      values.push(expiryValidation.cleaned);
    }
    if (parDefaut !== undefined) {
      fields.push("parDefaut = ?");
      values.push(parDefaut ? 1 : 0);
    }

    if (!fields.length) {
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
      return NextResponse.json(
        { error: "Méthode de paiement introuvable" },
        { status: 404 },
      );
    }

    const [rows] = await conn.execute(
      "SELECT * FROM PaymentMethod WHERE payment_id = ?",
      [paymentId],
    );

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("PUT /api/payments/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (conn) await conn.end();
  }
}

export async function DELETE(request, { params }) {
  let conn = null;
  try {
    const { user } = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé — vous devez être connecté" },
        { status: 401 },
      );
    }

    const { id: paymentId } = await params;
    conn = await connect();

    const [result] = await conn.execute(
      "DELETE FROM PaymentMethod WHERE payment_id = ? AND user_id = ?",
      [paymentId, user.user_id],
    );

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
  } finally {
    if (conn) await conn.end();
  }
}


