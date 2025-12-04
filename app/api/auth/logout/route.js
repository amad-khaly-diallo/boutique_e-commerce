import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const response = NextResponse.json(
      { success: true, message: "Déconnexion réussie" },
      { status: 200 }
    );

    // Supprimer le cookie token
    response.cookies.set("token", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Méthode non autorisée. Utilisez POST." },
    { status: 405 }
  );
}

