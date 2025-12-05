import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { validateAddressData, cleanAddressData } from "@/lib/addressValidation";

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
      "SELECT * FROM Address WHERE address_id = ? AND user_id = ?",
      [id, user.user_id],
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: "Adresse introuvable" },
        { status: 404 },
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("GET /api/addresses/[id] error:", error);
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

    const { id: addressId } = await params;
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

    // Construire l'objet de données pour validation
    const addressData = {};
    if (prenom !== undefined) addressData.prenom = prenom;
    if (nom !== undefined) addressData.nom = nom;
    if (societe !== undefined) addressData.societe = societe;
    if (adresse !== undefined) addressData.adresse = adresse;
    if (apt !== undefined) addressData.apt = apt;
    if (ville !== undefined) addressData.ville = ville;
    if (codePostal !== undefined) addressData.codePostal = codePostal;
    if (pays !== undefined) addressData.pays = pays;
    if (telephone !== undefined) addressData.telephone = telephone;

    // Récupérer l'adresse existante pour compléter les champs manquants
    conn = await connect();
    const [existingRows] = await conn.execute(
      "SELECT * FROM Address WHERE address_id = ? AND user_id = ?",
      [addressId, user.user_id],
    );

    if (!existingRows.length) {
      return NextResponse.json(
        { error: "Adresse introuvable" },
        { status: 404 },
      );
    }

    const existing = existingRows[0];

    // Compléter avec les valeurs existantes pour la validation complète
    const fullAddressData = {
      prenom: addressData.prenom !== undefined ? addressData.prenom : existing.prenom,
      nom: addressData.nom !== undefined ? addressData.nom : existing.nom,
      societe: addressData.societe !== undefined ? addressData.societe : (existing.societe || ""),
      adresse: addressData.adresse !== undefined ? addressData.adresse : existing.adresse,
      apt: addressData.apt !== undefined ? addressData.apt : (existing.apt || ""),
      ville: addressData.ville !== undefined ? addressData.ville : (existing.ville || ""),
      codePostal: addressData.codePostal !== undefined ? addressData.codePostal : (existing.codePostal || ""),
      pays: addressData.pays !== undefined ? addressData.pays : (existing.pays || ""),
      telephone: addressData.telephone !== undefined ? addressData.telephone : (existing.telephone || ""),
    };

    // Validation complète
    const validation = validateAddressData(fullAddressData);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      return NextResponse.json(
        { error: firstError || "Données d'adresse invalides." },
        { status: 400 },
      );
    }

    // Nettoyer les données
    const cleanedData = cleanAddressData(fullAddressData);

    if (parDefaut) {
      await conn.execute(
        "UPDATE Address SET parDefaut = 0 WHERE user_id = ?",
        [user.user_id],
      );
    }

    const fields = [];
    const values = [];

    // Utiliser les valeurs nettoyées pour les champs fournis
    if (prenom !== undefined) {
      fields.push("prenom = ?");
      values.push(cleanedData.cleaned.prenom);
    }
    if (nom !== undefined) {
      fields.push("nom = ?");
      values.push(cleanedData.cleaned.nom);
    }
    if (societe !== undefined) {
      fields.push("societe = ?");
      values.push(cleanedData.cleaned.societe);
    }
    if (adresse !== undefined) {
      fields.push("adresse = ?");
      values.push(cleanedData.cleaned.adresse);
    }
    if (apt !== undefined) {
      fields.push("apt = ?");
      values.push(cleanedData.cleaned.apt);
    }
    if (ville !== undefined) {
      fields.push("ville = ?");
      values.push(cleanedData.cleaned.ville);
    }
    if (codePostal !== undefined) {
      fields.push("codePostal = ?");
      values.push(cleanedData.cleaned.codePostal);
    }
    if (pays !== undefined) {
      fields.push("pays = ?");
      values.push(cleanedData.cleaned.pays);
    }
    if (telephone !== undefined) {
      fields.push("telephone = ?");
      values.push(cleanedData.cleaned.telephone);
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
      `UPDATE Address SET ${fields.join(", ")} WHERE address_id = ? AND user_id = ?`,
      [...values, addressId, user.user_id],
    );

    if (!result.affectedRows) {
      return NextResponse.json(
        { error: "Adresse introuvable" },
        { status: 404 },
      );
    }

    const [rows] = await conn.execute(
      "SELECT * FROM Address WHERE address_id = ?",
      [addressId],
    );

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("PUT /api/addresses/[id] error:", error);
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

    const { id: addressId } = await params;
    conn = await connect();

    const [result] = await conn.execute(
      "DELETE FROM Address WHERE address_id = ? AND user_id = ?",
      [addressId, user.user_id],
    );

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
  } finally {
    if (conn) await conn.end();
  }
}


