import { NextResponse } from "next/server";
import { connect } from "@/lib/db";

export async function GET(_req, { params }) {
    let conn = null;
    try {
        conn = await connect();
        const { id } = await params;
        const [row] = await conn.execute("SELECT * FROM Product WHERE product_id = ?", [id]);
        if (row.length === 0) return NextResponse.json({ error: "Product not found" }, { status: 404 });
        return NextResponse.json(row[0]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        if (conn) await conn.end();
    }
}
export async function PUT(req, { params }) {
    let conn = null;
    try {
        const { id } = await params;
        const payload = await req.json();
        const allowedFields = ["product_name", "description", "price", "stock", "category", "image", "note"];
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(payload)) {
            if (allowedFields.includes(key)) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) {
            return NextResponse.json({ error: "No fields to update" }, { status: 400 });
        }

        conn = await connect();
        const [result] = await conn.execute(
            `UPDATE Product SET ${fields.join(", ")} WHERE product_id = ?`,
            [...values, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const [rows] = await conn.execute("SELECT * FROM Product WHERE product_id = ?", [id]);
        return NextResponse.json(rows[0]);

    } catch (error) {
        const status = error.code === "ER_DUP_ENTRY" ? 409 : 500;
        const message = status === 409 ? "Duplicate entry" : error.message;
        return NextResponse.json({ error: message }, { status });
    } finally {
        if (conn) await conn.end();
    }
}

export async function DELETE(_req, { params }) {
    let conn = null;
    try {
        const { id } = await params;
        conn = await connect();
        const [result] = await conn.execute("DELETE FROM Product WHERE product_id = ?", [id]);
        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        if (conn) await conn.end();
    }
}
