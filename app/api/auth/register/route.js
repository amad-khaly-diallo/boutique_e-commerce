import { NextResponse } from 'next/server';
import { registerUser, emailExists } from '@/lib/auth';
import { validateUserData, formatErrorMessage } from '@/lib/helpers';

export async function POST(request) {
    try {
        const body = await request.json();
        const { first_name, last_name, email, password, passwordConfirm } = body;

        // Validations basiques
        const validation = validateUserData({
            first_name,
            last_name,
            email,
            password
        });

        if (!validation.isValid) {
            return NextResponse.json(
                {
                    success: false,
                    errors: validation.errors
                },
                { status: 400 }
            );
        }

        // Vérifier que les mots de passe correspondent
        if (password !== passwordConfirm) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Les mots de passe ne correspondent pas'
                },
                { status: 400 }
            );
        }

        // Vérifier si l'email existe déjà
        const emailAlreadyExists = await emailExists(email);
        if (emailAlreadyExists) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Cet email est déjà utilisé'
                },
                { status: 409 }
            );
        }

        // enregistrement
        const result = await registerUser({
            first_name,
            last_name,
            email,
            password
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error('Erreur register:', error);

        let statusCode = 500;
        let errorMessage = formatErrorMessage(error);

        if (error.message.includes('déjà utilisé')) {
            statusCode = 409;
        }

        if (error.message.includes('requis') || error.message.includes('invalide')) {
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
