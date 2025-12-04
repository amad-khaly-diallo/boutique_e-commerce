import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export async function GET(request) {
  const { user } = await verifyAuth(request);

  if (!user) {
    return NextResponse.json({ favorite: false }, { status: 200 });
  }

  const productId = request.nextUrl.searchParams.get("productId");

  try {
    const db = await connect();

    const [rows] = await db.execute(
      "SELECT * FROM favorites WHERE user_id = ? AND product_id = ?", 
      [user.user_id, productId]
    );

    return NextResponse.json({
      favorite: rows.length > 0
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ favorite: false }, { status: 200 });
  }
}
