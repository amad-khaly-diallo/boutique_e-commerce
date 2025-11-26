import { connect } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET(request) {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.get("id");
    const category = url.searchParams.get("category");
    const vedettes = url.searchParams.get("vedettes");
    const conn = await connect();

    if (productId) {
      const [rows] = await conn.execute("SELECT * FROM Product WHERE product_id = ?", [productId]);
      await conn.end();
      if (!rows.length) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(rows[0]);
    }

    if (category) {
      const [rows] = await conn.execute("SELECT * FROM Product WHERE category = ?", [category]);
      await conn.end();
      return NextResponse.json(rows);
    }

    if (vedettes === 'true') {
      const [rows] = await conn.execute("SELECT * FROM Product LIMIT 4", [category]);
      await conn.end();
      return NextResponse.json(rows);
    }

    const [rows] = await conn.execute("SELECT * FROM Product");
    await conn.end();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
