import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export async function PUT(request, { params }) {
  try {
    const { user } = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé — vous devez être connecté" },
        { status: 401 },
      );
    }

    const addressId = params.id;
    const payload = await request.json();

    const {
      prenom,
      nom,
      societe,
      adresse,
      apt,
      ville,
      codePostal,
      pays,
      telephone,
      parDefaut,
    } = payload;

    const conn = await connect();

    try {
      if (parDefaut) {
        await conn.execute(
          "UPDATE Address SET parDefaut = 0 WHERE user_id = ?",
          [user.user_id],
        );
      }

      const fields = [];
      const values = [];

      const mapping = {
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

      for (const [key, value] of Object.entries(mapping)) {
        if (value !== undefined) {
          fields.push(`${key} = ?`);
          values.push(value);
        }
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
        `UPDATE Address SET ${fields.join(", ")} WHERE address_id = ? AND user_id = ?`,
        [...values, addressId, user.user_id],
      );

      if (!result.affectedRows) {
        await conn.end();
        return NextResponse.json(
          { error: "Adresse introuvable" },
          { status: 404 },
        );
      }

      const [rows] = await conn.execute(
        "SELECT * FROM Address WHERE address_id = ?",
        [addressId],
      );
      await conn.end();

      return NextResponse.json(rows[0]);
    } catch (err) {
      await conn.end();
      throw err;
    }
  } catch (error) {
    console.error("PUT /api/addresses/[id] error:", error);
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

    const addressId = params.id;
    const conn = await connect();

    const [result] = await conn.execute(
      "DELETE FROM Address WHERE address_id = ? AND user_id = ?",
      [addressId, user.user_id],
    );

    await conn.end();

    if (!result.affectedRows) {
      return NextResponse.json(
        { error: "Adresse introuvable" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/addresses/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


