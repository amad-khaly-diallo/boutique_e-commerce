/**
 * Fonctions de validation pour les champs d'adresse
 * Sécurise les entrées utilisateur pour éviter les injections et les données invalides
 */

/**
 * Valide un prénom ou nom pour une adresse
 * @param {string} name - Prénom ou nom
 * @param {string} fieldName - Nom du champ pour les messages d'erreur
 * @param {boolean} required - Si le champ est requis
 * @returns {{valid: boolean, error?: string, cleaned?: string}}
 */
export function validateAddressName(name, fieldName = "Nom", required = true) {
  if (!name || typeof name !== "string") {
    if (required) {
      return { valid: false, error: `${fieldName} est requis.` };
    }
    return { valid: true, cleaned: "" };
  }

  const trimmed = name.trim();

  if (trimmed.length === 0) {
    if (required) {
      return { valid: false, error: `${fieldName} est requis.` };
    }
    return { valid: true, cleaned: "" };
  }

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
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmed)) {
      return { valid: false, error: `${fieldName} contient des caractères non autorisés.` };
    }
  }

  return { valid: true, cleaned: trimmed };
}

/**
 * Valide une adresse (rue, numéro)
 * @param {string} address - Adresse
 * @returns {{valid: boolean, error?: string, cleaned?: string}}
 */
export function validateStreetAddress(address) {
  if (!address || typeof address !== "string" || address.trim().length === 0) {
    return { valid: false, error: "L'adresse est requise." };
  }

  const trimmed = address.trim();

  if (trimmed.length < 5) {
    return { valid: false, error: "L'adresse doit contenir au moins 5 caractères." };
  }

  if (trimmed.length > 200) {
    return { valid: false, error: "L'adresse ne peut pas dépasser 200 caractères." };
  }

  // Autoriser lettres, chiffres, espaces, tirets, apostrophes, virgules, points et accents
  if (!/^[a-zA-ZÀ-ÿ0-9\s\-',\.#]+$/.test(trimmed)) {
    return {
      valid: false,
      error: "L'adresse contient des caractères non autorisés.",
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
      return { valid: false, error: "L'adresse contient des caractères non autorisés." };
    }
  }

  return { valid: true, cleaned: trimmed };
}

/**
 * Valide un champ optionnel d'adresse (société, appartement, etc.)
 * @param {string} value - Valeur du champ
 * @param {string} fieldName - Nom du champ
 * @param {number} maxLength - Longueur maximale
 * @returns {{valid: boolean, error?: string, cleaned?: string}}
 */
export function validateOptionalAddressField(value, fieldName = "Champ", maxLength = 100) {
  if (!value || typeof value !== "string") {
    return { valid: true, cleaned: "" };
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return { valid: true, cleaned: "" };
  }

  if (trimmed.length > maxLength) {
    return { valid: false, error: `${fieldName} ne peut pas dépasser ${maxLength} caractères.` };
  }

  // Autoriser lettres, chiffres, espaces, tirets, apostrophes, virgules, points et accents
  if (!/^[a-zA-ZÀ-ÿ0-9\s\-',\.#]+$/.test(trimmed)) {
    return {
      valid: false,
      error: `${fieldName} contient des caractères non autorisés.`,
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
      return { valid: false, error: `${fieldName} contient des caractères non autorisés.` };
    }
  }

  return { valid: true, cleaned: trimmed };
}

/**
 * Valide une ville
 * @param {string} city - Ville
 * @param {boolean} required - Si le champ est requis
 * @returns {{valid: boolean, error?: string, cleaned?: string}}
 */
export function validateCity(city, required = false) {
  if (required && (!city || typeof city !== "string" || city.trim().length === 0)) {
    return { valid: false, error: "La ville est requise." };
  }

  if (!city || typeof city !== "string") {
    return { valid: true, cleaned: "" };
  }

  const trimmed = city.trim();

  if (trimmed.length === 0 && !required) {
    return { valid: true, cleaned: "" };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: "La ville ne peut pas dépasser 100 caractères." };
  }

  // Autoriser lettres, espaces, tirets, apostrophes et accents
  if (!/^[a-zA-ZÀ-ÿ\s\-'\.]+$/.test(trimmed)) {
    return {
      valid: false,
      error: "La ville ne peut contenir que des lettres, espaces, tirets et apostrophes.",
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
      return { valid: false, error: "La ville contient des caractères non autorisés." };
    }
  }

  return { valid: true, cleaned: trimmed };
}

/**
 * Valide un code postal
 * @param {string} postalCode - Code postal
 * @param {boolean} required - Si le champ est requis
 * @returns {{valid: boolean, error?: string, cleaned?: string}}
 */
export function validatePostalCode(postalCode, required = false) {
  if (required && (!postalCode || typeof postalCode !== "string" || postalCode.trim().length === 0)) {
    return { valid: false, error: "Le code postal est requis." };
  }

  if (!postalCode || typeof postalCode !== "string") {
    return { valid: true, cleaned: "" };
  }

  const trimmed = postalCode.trim();

  if (trimmed.length === 0 && !required) {
    return { valid: true, cleaned: "" };
  }

  // Code postal français: 5 chiffres
  // Code postal international: peut varier, accepter lettres et chiffres
  if (trimmed.length > 20) {
    return { valid: false, error: "Le code postal ne peut pas dépasser 20 caractères." };
  }

  // Autoriser lettres, chiffres, espaces et tirets (pour formats internationaux)
  if (!/^[a-zA-Z0-9\s\-]+$/.test(trimmed)) {
    return {
      valid: false,
      error: "Le code postal ne peut contenir que des lettres, chiffres, espaces et tirets.",
    };
  }

  return { valid: true, cleaned: trimmed.toUpperCase() };
}

/**
 * Valide un pays
 * @param {string} country - Pays
 * @param {boolean} required - Si le champ est requis
 * @returns {{valid: boolean, error?: string, cleaned?: string}}
 */
export function validateCountry(country, required = false) {
  if (required && (!country || typeof country !== "string" || country.trim().length === 0)) {
    return { valid: false, error: "Le pays est requis." };
  }

  if (!country || typeof country !== "string") {
    return { valid: true, cleaned: "" };
  }

  const trimmed = country.trim();

  if (trimmed.length === 0 && !required) {
    return { valid: true, cleaned: "" };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: "Le pays ne peut pas dépasser 100 caractères." };
  }

  // Autoriser lettres, espaces, tirets, apostrophes et accents
  if (!/^[a-zA-ZÀ-ÿ\s\-'\.]+$/.test(trimmed)) {
    return {
      valid: false,
      error: "Le pays ne peut contenir que des lettres, espaces, tirets et apostrophes.",
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
      return { valid: false, error: "Le pays contient des caractères non autorisés." };
    }
  }

  return { valid: true, cleaned: trimmed };
}

/**
 * Valide un numéro de téléphone
 * @param {string} phone - Numéro de téléphone
 * @param {boolean} required - Si le champ est requis
 * @returns {{valid: boolean, error?: string, cleaned?: string}}
 */
export function validatePhone(phone, required = false) {
  if (required && (!phone || typeof phone !== "string" || phone.trim().length === 0)) {
    return { valid: false, error: "Le numéro de téléphone est requis." };
  }

  if (!phone || typeof phone !== "string") {
    return { valid: true, cleaned: "" };
  }

  const trimmed = phone.trim();

  if (trimmed.length === 0 && !required) {
    return { valid: true, cleaned: "" };
  }

  // Nettoyer le numéro (supprimer espaces, tirets, points, parenthèses)
  const cleaned = trimmed.replace(/[\s\-\.\(\)]/g, "");

  // Vérifier qu'il ne contient que des chiffres et éventuellement un + au début
  if (!/^\+?[0-9]+$/.test(cleaned)) {
    return {
      valid: false,
      error: "Le numéro de téléphone ne peut contenir que des chiffres et éventuellement un + au début.",
    };
  }

  // Longueur minimale et maximale
  if (cleaned.length < 8) {
    return { valid: false, error: "Le numéro de téléphone doit contenir au moins 8 chiffres." };
  }

  if (cleaned.length > 20) {
    return { valid: false, error: "Le numéro de téléphone ne peut pas dépasser 20 chiffres." };
  }

  return { valid: true, cleaned };
}

/**
 * Valide toutes les données d'une adresse
 * @param {Object} addressData - Données d'adresse
 * @returns {{valid: boolean, errors: Object}}
 */
export function validateAddressData(addressData) {
  const errors = {};
  let isValid = true;

  // Valider le prénom
  const prenomValidation = validateAddressName(addressData.prenom, "Le prénom", true);
  if (!prenomValidation.valid) {
    errors.prenom = prenomValidation.error;
    isValid = false;
  }

  // Valider le nom
  const nomValidation = validateAddressName(addressData.nom, "Le nom", true);
  if (!nomValidation.valid) {
    errors.nom = nomValidation.error;
    isValid = false;
  }

  // Valider la société (optionnel)
  const societeValidation = validateOptionalAddressField(addressData.societe, "La société", 100);
  if (!societeValidation.valid) {
    errors.societe = societeValidation.error;
    isValid = false;
  }

  // Valider l'adresse
  const adresseValidation = validateStreetAddress(addressData.adresse);
  if (!adresseValidation.valid) {
    errors.adresse = adresseValidation.error;
    isValid = false;
  }

  // Valider l'appartement (optionnel)
  const aptValidation = validateOptionalAddressField(addressData.apt, "L'appartement", 50);
  if (!aptValidation.valid) {
    errors.apt = aptValidation.error;
    isValid = false;
  }

  // Valider la ville (optionnel mais recommandé)
  const villeValidation = validateCity(addressData.ville, false);
  if (!villeValidation.valid) {
    errors.ville = villeValidation.error;
    isValid = false;
  }

  // Valider le code postal (optionnel)
  const codePostalValidation = validatePostalCode(addressData.codePostal, false);
  if (!codePostalValidation.valid) {
    errors.codePostal = codePostalValidation.error;
    isValid = false;
  }

  // Valider le pays (optionnel)
  const paysValidation = validateCountry(addressData.pays, false);
  if (!paysValidation.valid) {
    errors.pays = paysValidation.error;
    isValid = false;
  }

  // Valider le téléphone (optionnel)
  const telephoneValidation = validatePhone(addressData.telephone, false);
  if (!telephoneValidation.valid) {
    errors.telephone = telephoneValidation.error;
    isValid = false;
  }

  return { valid: isValid, errors };
}

/**
 * Nettoie et valide les données d'adresse, retourne les valeurs nettoyées
 * @param {Object} addressData - Données d'adresse
 * @returns {{valid: boolean, errors: Object, cleaned: Object}}
 */
export function cleanAddressData(addressData) {
  const cleaned = {};
  const errors = {};
  let isValid = true;

  // Valider et nettoyer chaque champ
  const prenomValidation = validateAddressName(addressData.prenom, "Le prénom", true);
  if (!prenomValidation.valid) {
    errors.prenom = prenomValidation.error;
    isValid = false;
  } else {
    cleaned.prenom = prenomValidation.cleaned;
  }

  const nomValidation = validateAddressName(addressData.nom, "Le nom", true);
  if (!nomValidation.valid) {
    errors.nom = nomValidation.error;
    isValid = false;
  } else {
    cleaned.nom = nomValidation.cleaned;
  }

  const societeValidation = validateOptionalAddressField(addressData.societe, "La société", 100);
  if (!societeValidation.valid) {
    errors.societe = societeValidation.error;
    isValid = false;
  } else {
    cleaned.societe = societeValidation.cleaned;
  }

  const adresseValidation = validateStreetAddress(addressData.adresse);
  if (!adresseValidation.valid) {
    errors.adresse = adresseValidation.error;
    isValid = false;
  } else {
    cleaned.adresse = adresseValidation.cleaned;
  }

  const aptValidation = validateOptionalAddressField(addressData.apt, "L'appartement", 50);
  if (!aptValidation.valid) {
    errors.apt = aptValidation.error;
    isValid = false;
  } else {
    cleaned.apt = aptValidation.cleaned;
  }

  const villeValidation = validateCity(addressData.ville, false);
  if (!villeValidation.valid) {
    errors.ville = villeValidation.error;
    isValid = false;
  } else {
    cleaned.ville = villeValidation.cleaned;
  }

  const codePostalValidation = validatePostalCode(addressData.codePostal, false);
  if (!codePostalValidation.valid) {
    errors.codePostal = codePostalValidation.error;
    isValid = false;
  } else {
    cleaned.codePostal = codePostalValidation.cleaned;
  }

  const paysValidation = validateCountry(addressData.pays, false);
  if (!paysValidation.valid) {
    errors.pays = paysValidation.error;
    isValid = false;
  } else {
    cleaned.pays = paysValidation.cleaned;
  }

  const telephoneValidation = validatePhone(addressData.telephone, false);
  if (!telephoneValidation.valid) {
    errors.telephone = telephoneValidation.error;
    isValid = false;
  } else {
    cleaned.telephone = telephoneValidation.cleaned;
  }

  return { valid: isValid, errors, cleaned };
}

