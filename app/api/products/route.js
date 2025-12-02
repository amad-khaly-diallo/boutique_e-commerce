import { connect } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const conn = await connect();

  try {
    const url = new URL(request.url);

    const productId = url.searchParams.get("id");
    const category = url.searchParams.get("category");
    const vedettes = url.searchParams.get("vedettes");
    const last = url.searchParams.get("last");
    const pageParam = url.searchParams.get("page");
    const limitParam = url.searchParams.get("limit");

    // === Pagination safe ===
    const page = Math.max(1, parseInt(pageParam || "1", 10));
    const limit = Math.max(1, parseInt(limitParam || "12", 10));
    const offset = (page - 1) * limit;

    if (productId) {
      const [rows] = await conn.execute(
        "SELECT * FROM Product WHERE product_id = ?",
        [productId]
      );

      if (!rows.length) {
        await conn.end();
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      await conn.end();
      return NextResponse.json(rows[0]);
    }

    if (category) {
      // Liste blanche = protection contre injection + meilleure cohérence
      const allowedCategories = ["Bijoux", "Montre", "Sac"];
      if (!allowedCategories.includes(category)) {
        await conn.end();
        return NextResponse.json(
          { error: "Catégorie invalide" },
          { status: 400 }
        );
      }

      const [countRows] = await conn.execute(
        "SELECT COUNT(*) AS total FROM Product WHERE category = ?", [category]
      );
      const total = countRows[0]?.total || 0;

      // Prepared statement 🔥 (aucune injection possible)
      const [rows] = await conn.execute(
        `SELECT * FROM Product WHERE category = ? LIMIT ${limit} OFFSET ${offset}`,
        [category]
      );

      await conn.end();
      return NextResponse.json({ data: rows, total });
    }

    if (vedettes === "true") {
      const [rows] = await conn.execute(
        "SELECT * FROM Product ORDER BY product_id DESC LIMIT 4"
      );

      await conn.end();
      return NextResponse.json(rows);
    }

    if (last === "4") {
      const [rows] = await conn.execute(
        "SELECT * FROM Product ORDER BY product_id DESC LIMIT 4"
      );
      await conn.end();
      return NextResponse.json(rows);
    }


    // Total produits
    const [countRows] = await conn.execute(
      "SELECT COUNT(*) AS total FROM Product"
    );
    const total = countRows[0]?.total || 0;

    // Data paginée — entièrement sécurisée
    const [rows] = await conn.execute(`SELECT * FROM Product LIMIT ${limit} OFFSET ${offset}`);

    await conn.end();
    return NextResponse.json({ data: rows, total });
  } catch (err) {
    console.error("Erreur GET /api/products:", err);
    await conn.end();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function POST(request) {
  try {
    const {
      product_name = null,
      description = null,
      price = null,
      stock = 0,
      category = null,
      image = null,
      note = null,
    } = await request.json();

    if (!product_name || !description || price == null || !category) {
      return NextResponse.json(
        { error: "Les champs product_name, description, price et category sont requis" },
        { status: 400 },
      );
    }

    const conn = await connect();

    const [result] = await conn.execute(
      `INSERT INTO Product (product_name, description, price, stock, category, image, note)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [product_name, description, price, stock, category, image, note],
    );

    const [rows] = await conn.execute("SELECT * FROM Product WHERE product_id = ?", [result.insertId]);

    await conn.end();

    if (!rows[0]) {
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
