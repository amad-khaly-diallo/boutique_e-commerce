import { NextResponse } from "next/server";
import { connect } from "@/lib/db";

export async function GET(_req, { params }) {
    try {
        const conn = await connect()
        const { id } = await params;
        const [row] = await conn.execute("SELECT * FROM Product WHERE product_id =?", [id]);
        await conn.end();
        if (row.length === 0) return NextResponse.json({ error: "Product not found" }, { status: 404 });
        return NextResponse.json(row[0]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
export async function PUT(req, { params }) {
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

        const conn = await connect();
        const [result] = await conn.execute(
            `UPDATE Product SET ${fields.join(", ")} WHERE product_id = ?`,
            [...values, id]
        );

        if (result.affectedRows === 0) {
            await conn.end();
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const [rows] = await conn.execute("SELECT * FROM Product WHERE product_id = ?", [id]);
        await conn.end();

        return NextResponse.json(rows[0]);

    } catch (error) {
        const status = error.code === "ER_DUP_ENTRY" ? 409 : 500;
        const message = status === 409 ? "Duplicate entry" : error.message;
        return NextResponse.json({ error: message }, { status });
    }
}

export async function DELETE(_req, { params }) {
    try {
        const { id } = await params;
        const conn = await connect();
        const [result] = await conn.execute("DELETE FROM Product WHERE product_id = ?", [id]);
        await conn.end();
        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
