import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import {
  validateUserProfile,
  validateName,
  validateEmail,
  validatePassword,
} from "@/lib/userValidation";

async function findUser(conn, userId) {
  const [rows] = await conn.execute("SELECT user_id, first_name, last_name, email, role, created_at, updated_at FROM User WHERE user_id = ?", [userId]);
  return rows[0] ?? null;
}

export async function GET(_request, { params }) {
  let conn = null;
  try {
    conn = await connect();
    const { id } = await params;
    const user = await findUser(conn, id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (conn) await conn.end();
  }
}

export async function PUT(request, { params }) {
  let conn = null;
  try {
    // Vérifier l'authentification
    const { user } = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé — vous devez être connecté" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const payload = await request.json();
    
    // Vérifier que l'utilisateur modifie son propre profil ou est admin
    if (user.user_id !== parseInt(id) && user.role !== "admin") {
      return NextResponse.json(
        { error: "Non autorisé — vous ne pouvez modifier que votre propre profil" },
        { status: 403 },
      );
    }

    const allowedFields = ["first_name", "last_name", "email", "password", "role"];
    const fields = [];
    const values = [];

    // Validation des champs fournis
    const userData = {};
    if (payload.first_name !== undefined) {
      userData.firstName = payload.first_name;
    }
    if (payload.last_name !== undefined) {
      userData.lastName = payload.last_name;
    }
    if (payload.email !== undefined) {
      userData.email = payload.email;
    }

    // Valider les données de profil (sans mot de passe pour l'instant)
    if (Object.keys(userData).length > 0) {
      const validation = validateUserProfile(userData, false);
      if (!validation.valid) {
        const firstError = Object.values(validation.errors)[0];
        return NextResponse.json(
          { error: firstError || "Données invalides." },
          { status: 400 },
        );
      }
    }

    // Valider le mot de passe si fourni
    if (payload.password) {
      const passwordValidation = validatePassword(payload.password, true);
      if (!passwordValidation.valid) {
        return NextResponse.json(
          { error: passwordValidation.error || "Mot de passe invalide." },
          { status: 400 },
        );
      }
    }

    // Si le mot de passe est fourni, le hasher avant de l'ajouter
    if (payload.password && allowedFields.includes("password")) {
      const { hashPassword } = await import("@/lib/helpers");
      const hashedPassword = await hashPassword(payload.password);
      fields.push("password = ?");
      values.push(hashedPassword);
    }
    
    // Utiliser les valeurs nettoyées de la validation
    for (const [key, value] of Object.entries(payload)) {
      if (allowedFields.includes(key) && key !== "password" && key !== "role") {
        let cleanedValue = value;
        
        // Nettoyer selon le type de champ
        if (key === "first_name") {
          const nameValidation = validateName(value, "Le prénom");
          if (nameValidation.valid) {
            cleanedValue = nameValidation.cleaned;
          }
        } else if (key === "last_name") {
          const nameValidation = validateName(value, "Le nom");
          if (nameValidation.valid) {
            cleanedValue = nameValidation.cleaned;
          }
        } else if (key === "email") {
          const emailValidation = validateEmail(value);
          if (emailValidation.valid) {
            cleanedValue = emailValidation.cleaned;
          }
        }
        
        fields.push(`${key} = ?`);
        values.push(cleanedValue);
      } else if (key === "role" && user.role === "admin") {
        // Seuls les admins peuvent modifier le rôle
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (!fields.length) {
      return NextResponse.json({ error: "Aucun champ valide fourni" }, { status: 400 });
    }

    conn = await connect();
    const [result] = await conn.execute(
      `UPDATE User SET ${fields.join(", ")} WHERE user_id = ?`,
      [...values, id],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userFound = await findUser(conn, id);
    return NextResponse.json(userFound);
  } catch (error) {
    const status = error.code === "ER_DUP_ENTRY" ? 409 : 500;
    const message = status === 409 ? "Email already exists" : error.message;
    return NextResponse.json({ error: message }, { status });
  } finally {
    if (conn) await conn.end();
  }
}

export async function DELETE(_request, { params }) {
  let conn = null;
  try {
    const { id } = await params;
    conn = await connect();
    const [result] = await conn.execute("DELETE FROM User WHERE user_id = ?", [id]);
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (conn) await conn.end();
  }
}

