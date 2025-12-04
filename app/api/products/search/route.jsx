import { connect } from '@/lib/db';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    if (query.length < 2) {
        return new Response(JSON.stringify([]), { status: 200 });
    }
    let conn = null;
    try {
        conn = await connect();
        const [rows] = await conn.execute( `SELECT * FROM Product WHERE product_name LIKE ? LIMIT 10`, [`%${query}%`] );
        return Response.json(rows);
    } catch (error) {
        console.error("Search error:", error);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    } finally {
        if (conn) await conn.end();
    }
}
