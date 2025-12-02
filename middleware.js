import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
    const token = req.cookies.get("token")?.value;

    // Si pas de token, redirige vers login
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Tu peux vérifier un rôle (admin, etc.)
        if (decoded.role === "admin") {
            return NextResponse.next();
        }

        // Exemple : protéger une route admin :
        if (req.nextUrl.pathname.startsWith("/admin") && decoded.role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        // Si tout va bien :
        return NextResponse.next();
    } catch (error) {
        console.error("JWT invalid:", error);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

// Sélectionner les routes protégées
export const config = {
    matcher: [
        "/dashboard/:path*",   // protéger le dashboard
        "/profile/:path*",     // protéger profile
       // "/admin/:path*",       // protéger admin
    ],
};
