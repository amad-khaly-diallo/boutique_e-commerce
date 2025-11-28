import { connect } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET(request) {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.get("id");
    const category = url.searchParams.get("category");
    const vedettes = url.searchParams.get("vedettes");
    const last = url.searchParams.get('last');
    const pageParam = url.searchParams.get('page');
    const limitParam = url.searchParams.get('limit');
    const maxPrice = url.searchParams.get('maxPrice');
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
      const [rows] = await conn.execute("SELECT * FROM Product LIMIT 4");
      await conn.end();
      return NextResponse.json(rows);
    }

    if (last) {
      const [rows] = await conn.execute("SELECT * FROM Product ORDER BY product_id DESC LIMIT 4");
      await conn.end();
      return NextResponse.json(rows);
    }

    // Pagination & filtering support
    const page = Math.max(1, parseInt(pageParam || '1', 10));
    const limit = Math.max(1, parseInt(limitParam || '12', 10));
    const offset = (page - 1) * limit;

    // Build WHERE clause if needed
    const whereClauses = [];
    const params = [];
    if (category) {
      whereClauses.push('category = ?');
      params.push(category);
    }
    if (maxPrice) {
      whereClauses.push('price <= ?');
      params.push(Number(maxPrice));
    }

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Get total count for pagination
    const [countRows] = await conn.execute(`SELECT COUNT(*) as total FROM Product ${whereSQL}`, params);
    const total = countRows && countRows[0] ? countRows[0].total : 0;

    const [rows] = await conn.execute(
      `SELECT * FROM Product ${whereSQL} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    await conn.end();
    return NextResponse.json({ data: rows, total });
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
