import bcrypt from 'bcrypt';

/**
 * Hache un mot de passe
 * @param {string} password - Mot de passe en clair
 * @returns {Promise<string>} - Mot de passe haché
 */
export async function hashPassword(password) {
    const saltRounds = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, saltRounds);
}

/**
 * Vérifie si un mot de passe correspond au hash
 * @param {string} password - Mot de passe en clair
 * @param {string} hash - Hash du mot de passe
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

/**
 * Valide le format d'un email
 * @param {string} email - Email à valider
 * @returns {boolean}
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 150;
}

/**
 * Valide la force d'un mot de passe
 * Minimum 8 caractères, 1 majuscule, 1 chiffre
 * @param {string} password - Mot de passe à valider
 * @returns {boolean}
 */
export function validatePassword(password) {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/\d/.test(password)) return false;
    return true;
}

/**
 * Valide les données de l'utilisateur
 * @param {Object} userData - Données à valider
 * @returns {Object} - {isValid: boolean, errors: []}
 */
export function validateUserData(userData) {
    const errors = [];

    if (!userData.first_name?.trim()) {
        errors.push('Le prénom est requis');
    }

    if (!userData.last_name?.trim()) {
        errors.push('Le nom de famille est requis');
    }

    if (!userData.email?.trim()) {
        errors.push('L\'email est requis');
    } else if (!validateEmail(userData.email)) {
        errors.push('Email invalide');
    }

    if (!userData.password) {
        errors.push('Le mot de passe est requis');
    } else if (!validatePassword(userData.password)) {
        errors.push('Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Formate les réponses d'erreur
 * @param {Error} error - L'erreur à formater
 * @returns {string} - Message d'erreur formaté
 */
export function formatErrorMessage(error) {
    if (error.message.includes('email')) {
        return error.message;
    }
    if (error.message.includes('mot de passe')) {
        return error.message;
    }
    return 'Une erreur s\'est produite. Veuillez réessayer.';
}
