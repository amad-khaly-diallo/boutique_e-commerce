import jwt from 'jsonwebtoken';
import { connect } from './db';
import { hashPassword, verifyPassword, validateEmail, validatePassword } from './helpers';
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from 'jose';

/**
 * Enregistre un nouvel utilisateur
 * @param {Object} userData - Données de l'utilisateur {first_name, last_name, email, password}
 * @returns {Promise<Object>} - Utilisateur créé ou erreur
 */
export async function registerUser(userData) {
    const { first_name, last_name, email, password } = userData;

    // Validations
    if (!email || !password || !first_name || !last_name) {
        throw new Error('Tous les champs sont requis');
    }

    if (!validateEmail(email)) {
        throw new Error('Email invalide');
    }

    if (!validatePassword(password)) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre');
    }

    const conn = await connect();

    try {
        // Vérifier si l'email existe déjà
        const [existingUser] = await conn.execute(
            'SELECT user_id FROM User WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            throw new Error('Cet email est déjà utilisé');
        }

        // Hacher le mot de passe
        const hashedPassword = await hashPassword(password);

        // Insérer le nouvel utilisateur
        const [result] = await conn.execute(
            `INSERT INTO User (first_name, last_name, email, password) 
       VALUES (?, ?, ?, ?)`,
            [first_name, last_name, email, hashedPassword]
        );

        // Récupérer l'utilisateur créé
        const [rows] = await conn.execute(
            'SELECT user_id, first_name, last_name, email, created_at FROM User WHERE user_id = ?',
            [result.insertId]
        );

        return {
            success: true,
            user: rows[0],
            message: 'Utilisateur créé avec succès'
        };
    } finally {
        await conn.end();
    }
}

/**
 * Connecte un utilisateur
 * @param {Object} credentials - Identifiants {email, password}
 * @returns {Promise<Object>} - Données utilisateur ou erreur
 */
export async function loginUser(credentials) {
    const { email, password } = credentials;

    // Validations
    if (!email || !password) {
        throw new Error('Email et mot de passe requis');
    }

    if (!validateEmail(email)) {
        throw new Error('Email invalide');
    }

    const conn = await connect();

    try {
        // Trouver l'utilisateur par email
        const [rows] = await conn.execute(
            'SELECT user_id, first_name, last_name, email, password FROM User WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            throw new Error('Email ou mot de passe incorrect');
        }

        const user = rows[0];

        // Vérifier le mot de passe
        const isPasswordValid = await verifyPassword(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Email ou mot de passe incorrect');
        }

        const token = await generateToken(user);

        delete user.password;

        // Retourner les données de l'utilisateur (sans le mot de passe)
        return {
            success: true,
            message: 'Connexion réussie',
            user,
            token
        };
    } finally {
        await conn.end();
    }
}

/**
 * Récupère un utilisateur par ID
 * @param {number} userId - ID de l'utilisateur
 * @returns {Promise<Object>} - Données utilisateur
 */
export async function getUserById(userId) {
    const conn = await connect();

    try {
        const [rows] = await conn.execute(
            'SELECT user_id, first_name, last_name, email, address, created_at, updated_at FROM User WHERE user_id = ?',
            [userId]
        );

        if (rows.length === 0) {
            throw new Error('Utilisateur non trouvé');
        }

        return rows[0];
    } finally {
        await conn.end();
    }
}

/**
 * Vérifie si un email existe déjà
 * @param {string} email - Email à vérifier
 * @returns {Promise<boolean>}
 */
export async function emailExists(email) {
    const conn = await connect();

    try {
        const [rows] = await conn.execute(
            'SELECT user_id FROM User WHERE email = ?',
            [email]
        );

        return rows.length > 0;
    } finally {
        await conn.end();
    }
}


export async function generateToken(user) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  return await new SignJWT({
    user_id: user.user_id,
    email: user.email,
    role: user.role
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(secret);
}


export async function verifyAuth(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) return { user: null };

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret);

    return { user: payload };
  } catch (err) {
    return { user: null };
  }
}
