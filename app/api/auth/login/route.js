import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';
import { formatErrorMessage } from '@/lib/helpers';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ success: false, error: 'Email et mot de passe sont requis'}, { status: 400 });
        }

        // Appeler la fonction d'authentification
        const result = await loginUser({ email, password });

        // Créer une réponse avec un cookie (optionnel - pour sessions)
        const response = NextResponse.json(result, { status: 200 });
        return response;
    } catch (error) {
        console.error('Erreur login:', error);

        let statusCode = 500;
        let errorMessage = formatErrorMessage(error);

        if (error.message.includes('Email ou mot de passe incorrect')) {
            statusCode = 401;
        }

        if (error.message.includes('requis')) {
            statusCode = 400;
        }

        return NextResponse.json(
            {
                success: false,
                error: errorMessage
            },
            { status: statusCode }
        );
    }
}

export async function GET() {
    return NextResponse.json(
        {
            error: 'Méthode non autorisée. Utilisez POST.'
        },
        { status: 405 }
    );
}
