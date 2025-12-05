import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { validateAddressData, cleanAddressData } from "@/lib/addressValidation";

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
      "SELECT * FROM Address WHERE user_id = ? ORDER BY parDefaut DESC, address_id DESC",
      [user.user_id],
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/addresses error:", error);
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
      prenom,
      nom,
      societe = "",
      adresse,
      apt = "",
      ville = "",
      codePostal = "",
      pays = "",
      telephone = "",
      parDefaut = false,
    } = payload;

    // Validation complète des données avec les fonctions de sécurité
    const addressData = {
      prenom,
      nom,
      societe,
      adresse,
      apt,
      ville,
      codePostal,
      pays,
      telephone,
    };

    const validation = validateAddressData(addressData);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      return NextResponse.json(
        { error: firstError || "Données d'adresse invalides." },
        { status: 400 },
      );
    }

    // Nettoyer les données
    const cleanedData = cleanAddressData(addressData);

    conn = await connect();

    if (parDefaut) {
      await conn.execute(
        "UPDATE Address SET parDefaut = 0 WHERE user_id = ?",
        [user.user_id],
      );
    }

    const [result] = await conn.execute(
      `INSERT INTO Address 
        (user_id, prenom, nom, societe, adresse, apt, ville, codePostal, pays, telephone, parDefaut)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.user_id,
        cleanedData.cleaned.prenom,
        cleanedData.cleaned.nom,
        cleanedData.cleaned.societe,
        cleanedData.cleaned.adresse,
        cleanedData.cleaned.apt,
        cleanedData.cleaned.ville,
        cleanedData.cleaned.codePostal,
        cleanedData.cleaned.pays,
        cleanedData.cleaned.telephone,
        parDefaut ? 1 : 0,
      ],
    );

    const [rows] = await conn.execute(
      "SELECT * FROM Address WHERE address_id = ?",
      [result.insertId],
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/addresses error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (conn) await conn.end();
  }
}


