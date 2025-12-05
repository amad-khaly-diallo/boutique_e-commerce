/**
 * Fonctions de validation pour les champs de profil utilisateur
 * Sécurise les entrées utilisateur pour éviter les injections et les données invalides
 */

/**
 * Valide un prénom ou nom
 * @param {string} name - Prénom ou nom
 * @param {string} fieldName - Nom du champ pour les messages d'erreur
 * @returns {{valid: boolean, error?: string, cleaned?: string}}
 */
export function validateName(name, fieldName = "Nom") {
  if (!name || typeof name !== "string") {
    return { valid: false, error: `${fieldName} est requis.` };
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return { valid: false, error: `${fieldName} doit contenir au moins 2 caractères.` };
  }

  if (trimmed.length > 50) {
    return { valid: false, error: `${fieldName} ne peut pas dépasser 50 caractères.` };
  }

  // Autoriser lettres, espaces, tirets, apostrophes et accents
  if (!/^[a-zA-ZÀ-ÿ\s\-'\.]+$/.test(trimmed)) {
    return {
      valid: false,
      error: `${fieldName} ne peut contenir que des lettres, espaces, tirets et apostrophes.`,
    };
  }

  // Protection contre les tentatives d'injection
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<img/i,
    /<svg/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmed)) {
      return { valid: false, error: `${fieldName} contient des caractères non autorisés.` };
    }
  }

  return { valid: true, cleaned: trimmed };
}

/**
 * Valide une adresse email
 * @param {string} email - Adresse email
 * @returns {{valid: boolean, error?: string, cleaned?: string}}
 */
export function validateEmail(email) {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "L'adresse email est requise." };
  }

  const trimmed = email.trim().toLowerCase();

  if (trimmed.length === 0) {
    return { valid: false, error: "L'adresse email est requise." };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: "L'adresse email ne peut pas dépasser 100 caractères." };
  }

  // Validation du format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: "Format d'adresse email invalide." };
  }

  // Protection contre les caractères dangereux
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmed)) {
      return { valid: false, error: "L'adresse email contient des caractères non autorisés." };
    }
  }

  // Vérifier qu'il n'y a pas de caractères de contrôle
  if (/[\x00-\x1F\x7F]/.test(trimmed)) {
    return { valid: false, error: "L'adresse email contient des caractères non autorisés." };
  }

  return { valid: true, cleaned: trimmed };
}

/**
 * Valide un mot de passe
 * @param {string} password - Mot de passe
 * @param {boolean} isNewPassword - Si true, applique des règles plus strictes
 * @returns {{valid: boolean, error?: string}}
 */
export function validatePassword(password, isNewPassword = false) {
  if (!password || typeof password !== "string") {
    return { valid: false, error: "Le mot de passe est requis." };
  }

  if (password.length < 8) {
    return { valid: false, error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  if (password.length > 128) {
    return { valid: false, error: "Le mot de passe ne peut pas dépasser 128 caractères." };
  }

  // Vérifier qu'il n'y a pas de caractères de contrôle (sauf espaces qui sont autorisés)
  if (/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/.test(password)) {
    return { valid: false, error: "Le mot de passe contient des caractères non autorisés." };
  }

  // Pour les nouveaux mots de passe, vérifier la complexité
  if (isNewPassword) {
    // Au moins une lettre minuscule
    if (!/[a-z]/.test(password)) {
      return {
        valid: false,
        error: "Le mot de passe doit contenir au moins une lettre minuscule.",
      };
    }

    // Au moins une lettre majuscule
    if (!/[A-Z]/.test(password)) {
      return {
        valid: false,
        error: "Le mot de passe doit contenir au moins une lettre majuscule.",
      };
    }

    // Au moins un chiffre
    if (!/\d/.test(password)) {
      return {
        valid: false,
        error: "Le mot de passe doit contenir au moins un chiffre.",
      };
    }

    // Au moins un caractère spécial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return {
        valid: false,
        error: "Le mot de passe doit contenir au moins un caractère spécial.",
      };
    }
  }

  return { valid: true };
}

/**
 * Valide les données de profil utilisateur
 * @param {Object} userData - Données utilisateur
 * @param {boolean} includePassword - Si true, valide aussi le mot de passe
 * @returns {{valid: boolean, errors: Object}}
 */
export function validateUserProfile(userData, includePassword = false) {
  const errors = {};
  let isValid = true;

  // Valider le prénom
  if (userData.firstName !== undefined) {
    const firstNameValidation = validateName(userData.firstName, "Le prénom");
    if (!firstNameValidation.valid) {
      errors.firstName = firstNameValidation.error;
      isValid = false;
    }
  }

  // Valider le nom
  if (userData.lastName !== undefined) {
    const lastNameValidation = validateName(userData.lastName, "Le nom");
    if (!lastNameValidation.valid) {
      errors.lastName = lastNameValidation.error;
      isValid = false;
    }
  }

  // Valider l'email
  if (userData.email !== undefined) {
    const emailValidation = validateEmail(userData.email);
    if (!emailValidation.valid) {
      errors.email = emailValidation.error;
      isValid = false;
    }
  }

  // Valider le mot de passe si nécessaire
  if (includePassword && userData.password !== undefined) {
    const passwordValidation = validatePassword(userData.password, true);
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.error;
      isValid = false;
    }
  }

  return { valid: isValid, errors };
}

