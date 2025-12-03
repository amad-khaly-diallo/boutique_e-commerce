import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

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
      "SELECT * FROM Address WHERE user_id = ? ORDER BY parDefaut DESC, address_id DESC",
      [user.user_id],
    );
    await conn.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/addresses error:", error);
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

    if (!prenom || !nom || !adresse) {
      return NextResponse.json(
        { error: "Prénom, nom et adresse sont requis." },
        { status: 400 },
      );
    }

    const conn = await connect();

    try {
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
          prenom,
          nom,
          societe,
          adresse,
          apt,
          ville,
          codePostal,
          pays,
          telephone,
          parDefaut ? 1 : 0,
        ],
      );

      const [rows] = await conn.execute(
        "SELECT * FROM Address WHERE address_id = ?",
        [result.insertId],
      );

      await conn.end();

      return NextResponse.json(rows[0], { status: 201 });
    } catch (err) {
      await conn.end();
      throw err;
    }
  } catch (error) {
    console.error("POST /api/addresses error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


