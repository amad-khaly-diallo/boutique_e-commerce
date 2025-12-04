import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode("maPhraseQuiEstSenseEtreSecret");

export async function middleware(request) {
  const url = request.nextUrl.pathname;

  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Vérification du token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Routes admin
    if (url.startsWith("/admin") && payload.role?.toLowerCase() !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (
      (url.startsWith("/cart") ||
        url.startsWith("/dashboard") ||
        url.startsWith("/profile")) &&
      !payload.user_id
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// ⚡ Seulement appliquer le middleware sur ces routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/cart/:path*",
  ],
};
