import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';
import { formatErrorMessage } from '@/lib/helpers';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email et mot de passe sont requis' },
                { status: 400 }
            );
        }

        const result = await loginUser({ email, password });

        // Supprimer le mot de passe pour la réponse
        delete result.user?.password;

        const response = NextResponse.json(
            { success: true, user: result.user },
            { status: 200 }
        );

        response.cookies.set('token', result.token, {
            httpOnly: true,
            path: '/',        // accessible sur tout le site
            maxAge: 60 * 60 * 24, // 1 jour
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
        });

        return response;
    } catch (error) {
        console.error('Erreur login:', error);

        let statusCode = 500;
        let errorMessage = formatErrorMessage(error);

        if (error.message.includes('Email ou mot de passe incorrect')) statusCode = 401;
        if (error.message.includes('requis')) statusCode = 400;

        return NextResponse.json({ success: false, error: errorMessage }, { status: statusCode });
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
