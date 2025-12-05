import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import {
  validatePaymentData,
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

export async function GET(request) {
  let conn = null;
  try {
    const { user } = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé — vous devez être connecté" },
        { status: 401 },
      );
    }

    conn = await connect();
    const [rows] = await conn.execute(
      "SELECT * FROM PaymentMethod WHERE user_id = ? ORDER BY parDefaut DESC, payment_id DESC",
      [user.user_id],
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/payments error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (conn) await conn.end();
  }
}

export async function POST(request) {
  let conn = null;
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

    // Validation complète des données avec les fonctions de sécurité
    const validation = validatePaymentData({ titulaire, type, numero, expiry });
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      return NextResponse.json(
        { error: firstError || "Données de paiement invalides." },
        { status: 400 },
      );
    }

    // Nettoyer et valider chaque champ individuellement
    const cardNumberValidation = validateCardNumber(numero, type);
    const holderValidation = validateCardHolder(titulaire);
    const expiryValidation = validateExpiryDate(expiry);
    const typeValidation = validateCardType(type);

    if (!cardNumberValidation.valid || !holderValidation.valid || !expiryValidation.valid || !typeValidation.valid) {
      return NextResponse.json(
        { error: "Données de paiement invalides après validation." },
        { status: 400 },
      );
    }

    // Utiliser les valeurs nettoyées
    const cleanedNumero = cardNumberValidation.cleaned;
    const cleanedTitulaire = holderValidation.cleaned;
    const cleanedExpiry = expiryValidation.cleaned;

    const numero_masque = maskCardNumber(cleanedNumero);

    conn = await connect();

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
        cleanedTitulaire,
        type,
        numero_masque,
        cleanedExpiry,
        parDefaut ? 1 : 0,
      ],
    );

    const [rows] = await conn.execute(
      "SELECT * FROM PaymentMethod WHERE payment_id = ?",
      [result.insertId],
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/payments error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (conn) await conn.end();
  }
}


