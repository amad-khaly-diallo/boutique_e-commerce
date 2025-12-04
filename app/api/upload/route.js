import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { verifyAuth } from "@/lib/auth";

export async function POST(request) {
  try {
    // Vérifier que l'utilisateur est admin
    const { user } = await verifyAuth(request);
    
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Non autorisé - Admin uniquement" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé. Utilisez JPEG, PNG ou WebP." },
        { status: 400 }
      );
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Fichier trop volumineux. Taille maximale: 5MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop();
    const filename = `${timestamp}_${randomString}.${extension}`;

    // Chemin de destination
    const publicDir = join(process.cwd(), "public", "images");
    const filepath = join(publicDir, filename);

    // Créer le dossier s'il n'existe pas
    try {
      await mkdir(publicDir, { recursive: true });
    } catch (err) {
      // Le dossier existe déjà, c'est OK
    }

    // Écrire le fichier
    await writeFile(filepath, buffer);

    // Retourner le chemin relatif pour la DB
    const imagePath = `/images/${filename}`;

    return NextResponse.json(
      { success: true, path: imagePath, filename },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur upload:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}

