# API d'Authentification - Documentation

## Structure

### `lib/auth.js`
Contient toutes les fonctions d'authentification principales :
- `registerUser()` - Enregistre un nouvel utilisateur
- `loginUser()` - Authentifie un utilisateur
- `getUserById()` - Récupère les infos d'un utilisateur
- `emailExists()` - Vérifie si un email existe

### `lib/helpers.js`
Fonctions utilitaires :
- `hashPassword()` - Hache un mot de passe avec bcrypt
- `verifyPassword()` - Vérifie un mot de passe
- `validateEmail()` - Valide le format d'un email
- `validatePassword()` - Valide la force d'un mot de passe (min 8 caractères, 1 majuscule, 1 chiffre)
- `validateUserData()` - Valide l'ensemble des données utilisateur
- `formatErrorMessage()` - Formate les messages d'erreur

### Routes API

#### POST `/api/auth/register`
**Enregistrement d'un nouvel utilisateur**

**Request body:**
```json
{
  "first_name": "Jean",
  "last_name": "Dupont",
  "email": "jean@example.com",
  "password": "SecurePass123",
  "passwordConfirm": "SecurePass123"
}
```

**Success response (201):**
```json
{
  "success": true,
  "user": {
    "user_id": 4,
    "first_name": "Jean",
    "last_name": "Dupont",
    "email": "jean@example.com",
    "created_at": "2025-11-30T10:30:00.000Z"
  },
  "message": "Utilisateur créé avec succès"
}
```

**Error responses:**
- `400` - Données invalides ou manquantes
- `409` - Email déjà utilisé

---

#### POST `/api/auth/login`
**Connexion d'un utilisateur**

**Request body:**
```json
{
  "email": "jean@example.com",
  "password": "SecurePass123"
}
```

**Success response (200):**
```json
{
  "success": true,
  "user": {
    "user_id": 4,
    "first_name": "Jean",
    "last_name": "Dupont",
    "email": "jean@example.com"
  },
  "message": "Connexion réussie"
}
```

**Error responses:**
- `400` - Email ou mot de passe manquant
- `401` - Email ou mot de passe incorrect

---

## Validation des mots de passe

Le mot de passe doit respecter les critères suivants :
- ✅ Minimum 8 caractères
- ✅ Au moins 1 lettre majuscule
- ✅ Au moins 1 chiffre

Exemples valides :
- `SecurePass123`
- `MyPassword2024`
- `Admin@Pass99`

---

## Sécurité

1. **Hachage**: Les mots de passe sont hachés avec bcrypt (10 salts)
2. **Validation**: Validation stricte de tous les inputs
3. **Protection**: Aucun mot de passe n'est renvoyé en réponse
4. **Email unique**: Contrôle d'unicité sur la table User

---

## Prochaines étapes (optionnelles)

Pour une meilleure sécurité en production :
- Ajouter JWT tokens pour les sessions
- Implémenter CSRF protection
- Ajouter rate limiting sur les endpoints
- Ajouter 2FA (authentification double facteur)
- Implémenter password reset par email
