import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { addToCart } from '@/lib/cart';

export async function POST(request) {
    try {
        // ⛔ Vérifie si l'utilisateur est connecté
        const { user } = verifyAuth(request);

        if (!user) {
            return NextResponse.json(
                { error: "Non autorisé — vous devez être connecté" },
                { status: 401 }
            );
        }

        // 📝 Récupère les données envoyées
        const { productId, quantity } = await request.json();

        if (!productId) {
            return NextResponse.json(
                { error: "productId requis" },
                { status: 400 }
            );
        }

        // 🛒 user.user_id vient du JWT !
        const result = await addToCart(user.user_id, productId, quantity ?? 1);

        return NextResponse.json({ success: true, ...result });

    } catch (err) {
        console.error("Erreur add/cart:", err);
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}
