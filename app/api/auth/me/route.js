import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function GET(request) {
  const { user } = await verifyAuth(request);

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // On renvoie uniquement les infos utiles côté client
  return NextResponse.json(
    {
      user: {
        user_id: user.user_id,
        email: user.email,
        role: user.role ?? "user",
      },
    },
    { status: 200 },
  );
}


