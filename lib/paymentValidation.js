/**
 * Fonctions de validation pour les champs de paiement
 * Sécurise les entrées utilisateur pour éviter les injections et les données invalides
 */

// Types de cartes autorisés
const VALID_CARD_TYPES = ["Visa", "MasterCard", "American Express"];

/**
 * Valide le numéro de carte avec l'algorithme de Luhn
 * @param {string} numero - Numéro de carte (peut contenir des espaces)
 * @param {string} type - Type de carte
 * @returns {{valid: boolean, error?: string, cleaned?: string}}
 */
export function validateCardNumber(numero, type) {
  if (!numero || typeof numero !== "string") {
    return { valid: false, error: "Le numéro de carte est requis." };
  }

  // Nettoyer le numéro (supprimer les espaces et caractères non numériques)
  const cleaned = numero.replace(/\s+/g, "").replace(/\D/g, "");

  if (cleaned.length === 0) {
    return { valid: false, error: "Le numéro de carte ne peut contenir que des chiffres." };
  }

  // Vérifier la longueur selon le type
  if (type === "American Express") {
    if (cleaned.length !== 15) {
      return { valid: false, error: "Le numéro de carte American Express doit contenir 15 chiffres." };
    }
    // American Express commence par 34 ou 37
    if (!/^3[47]/.test(cleaned)) {
      return { valid: false, error: "Le numéro de carte American Express doit commencer par 34 ou 37." };
    }
  } else {
    if (cleaned.length !== 16) {
      return { valid: false, error: "Le numéro de carte doit contenir 16 chiffres." };
    }
    // Visa commence par 4
    if (type === "Visa" && !cleaned.startsWith("4")) {
      return { valid: false, error: "Le numéro de carte Visa doit commencer par 4." };
    }
    // MasterCard commence par 51-55 ou 2221-2720
    if (type === "MasterCard") {
      const firstTwo = parseInt(cleaned.substring(0, 2));
      const firstFour = parseInt(cleaned.substring(0, 4));
      if (!((firstTwo >= 51 && firstTwo <= 55) || (firstFour >= 2221 && firstFour <= 2720))) {
        return { valid: false, error: "Le numéro de carte MasterCard n'est pas valide." };
      }
    }
  }

  // Algorithme de Luhn
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) {
    return { valid: false, error: "Le numéro de carte n'est pas valide (algorithme de Luhn)." };
  }

  return { valid: true, cleaned };
}

/**
 * Valide le nom du titulaire de la carte
 * @param {string} titulaire - Nom du titulaire
 * @returns {{valid: boolean, error?: string, cleaned?: string}}
 */
export function validateCardHolder(titulaire) {
  if (!titulaire || typeof titulaire !== "string") {
    return { valid: false, error: "Le nom du titulaire est requis." };
  }

  const trimmed = titulaire.trim();

  if (trimmed.length < 2) {
    return { valid: false, error: "Le nom du titulaire doit contenir au moins 2 caractères." };
  }

  if (trimmed.length > 50) {
    return { valid: false, error: "Le nom du titulaire ne peut pas dépasser 50 caractères." };
  }

  // Autoriser lettres, espaces, tirets, apostrophes et accents
  // Protection contre XSS et caractères spéciaux dangereux
  if (!/^[a-zA-ZÀ-ÿ\s\-'\.]+$/.test(trimmed)) {
    return {
      valid: false,
      error: "Le nom du titulaire ne peut contenir que des lettres, espaces, tirets et apostrophes.",
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
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmed)) {
      return { valid: false, error: "Le nom du titulaire contient des caractères non autorisés." };
    }
  }

  return { valid: true, cleaned: trimmed };
}

/**
 * Valide la date d'expiration
 * @param {string} expiry - Date au format MM/AA
 * @returns {{valid: boolean, error?: string, cleaned?: string}}
 */
export function validateExpiryDate(expiry) {
  if (!expiry || typeof expiry !== "string") {
    return { valid: false, error: "La date d'expiration est requise." };
  }

  const trimmed = expiry.trim();

  // Format MM/AA
  if (!/^\d{2}\/\d{2}$/.test(trimmed)) {
    return { valid: false, error: "La date d'expiration doit être au format MM/AA (ex: 12/25)." };
  }

  const [monthStr, yearStr] = trimmed.split("/");
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  // Vérifier le mois (01-12)
  if (month < 1 || month > 12) {
    return { valid: false, error: "Le mois doit être entre 01 et 12." };
  }

  // Convertir l'année en format complet (AA -> 20AA)
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const fullYear = 2000 + year;

  // Vérifier que la carte n'est pas expirée
  if (fullYear < currentYear || (fullYear === currentYear && month < currentMonth)) {
    return { valid: false, error: "La carte est expirée." };
  }

  // Vérifier que la date n'est pas trop lointaine (max 20 ans)
  if (fullYear > currentYear + 20) {
    return { valid: false, error: "La date d'expiration est trop lointaine." };
  }

  return { valid: true, cleaned: trimmed };
}

/**
 * Valide le CVV
 * @param {string} cvv - Code CVV
 * @param {string} type - Type de carte
 * @returns {{valid: boolean, error?: string, cleaned?: string}}
 */
export function validateCVV(cvv, type) {
  if (!cvv || typeof cvv !== "string") {
    return { valid: false, error: "Le CVV est requis." };
  }

  const cleaned = cvv.trim().replace(/\D/g, "");

  if (cleaned.length === 0) {
    return { valid: false, error: "Le CVV ne peut contenir que des chiffres." };
  }

  const requires4 = type === "American Express";

  if (requires4) {
    if (cleaned.length !== 4) {
      return { valid: false, error: "Le CVV pour American Express doit contenir 4 chiffres." };
    }
  } else {
    if (cleaned.length !== 3) {
      return { valid: false, error: "Le CVV doit contenir 3 chiffres." };
    }
  }

  return { valid: true, cleaned };
}

/**
 * Valide le type de carte
 * @param {string} type - Type de carte
 * @returns {{valid: boolean, error?: string}}
 */
export function validateCardType(type) {
  if (!type || typeof type !== "string") {
    return { valid: false, error: "Le type de carte est requis." };
  }

  if (!VALID_CARD_TYPES.includes(type)) {
    return {
      valid: false,
      error: `Le type de carte doit être l'un des suivants: ${VALID_CARD_TYPES.join(", ")}.`,
    };
  }

  return { valid: true };
}

/**
 * Valide tous les champs de paiement
 * @param {Object} paymentData - Données de paiement
 * @returns {{valid: boolean, errors: Object}}
 */
export function validatePaymentData(paymentData) {
  const errors = {};
  let isValid = true;

  // Valider le type
  const typeValidation = validateCardType(paymentData.type);
  if (!typeValidation.valid) {
    errors.type = typeValidation.error;
    isValid = false;
  }

  // Valider le titulaire
  const holderValidation = validateCardHolder(paymentData.titulaire);
  if (!holderValidation.valid) {
    errors.titulaire = holderValidation.error;
    isValid = false;
  }

  // Valider le numéro de carte
  const numberValidation = validateCardNumber(paymentData.numero, paymentData.type);
  if (!numberValidation.valid) {
    errors.numero = numberValidation.error;
    isValid = false;
  }

  // Valider la date d'expiration
  const expiryValidation = validateExpiryDate(paymentData.expiry);
  if (!expiryValidation.valid) {
    errors.expiry = expiryValidation.error;
    isValid = false;
  }

  // Valider le CVV (si fourni)
  if (paymentData.cvv !== undefined) {
    const cvvValidation = validateCVV(paymentData.cvv, paymentData.type);
    if (!cvvValidation.valid) {
      errors.cvv = cvvValidation.error;
      isValid = false;
    }
  }

  return { valid: isValid, errors };
}

/**
 * Nettoie et formate le numéro de carte pour l'affichage
 * @param {string} numero - Numéro de carte
 * @returns {string} - Numéro formaté avec espaces
 */
export function formatCardNumber(numero) {
  if (!numero) return "";
  const cleaned = numero.replace(/\s+/g, "").replace(/\D/g, "");
  // Formater avec des espaces tous les 4 chiffres, puis supprimer l'espace final
  return cleaned.replace(/(.{4})/g, "$1 ").trim();
}

/**
 * Nettoie et formate la date d'expiration
 * @param {string} expiry - Date d'expiration
 * @returns {string} - Date formatée MM/AA
 */
export function formatExpiryDate(expiry) {
  if (!expiry) return "";
  // Si déjà au format MM/AA, nettoyer et reformater
  const cleaned = expiry.replace(/\D/g, "");
  if (cleaned.length === 0) return "";
  if (cleaned.length <= 2) {
    return cleaned;
  }
  // Formater MM/AA
  return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
}

