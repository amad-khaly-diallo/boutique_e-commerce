"use client";
import React, { useEffect, useState } from "react";
import "./page.css";
import LuxuryLoader from "@/app/components/LuxuryLoader/LuxuryLoader";
import Link from "next/link";
import { useLuxuryLoader } from "@/lib/useLuxuryLoader";
import { useToastContext } from "@/app/contexts/ToastContext";
import {
  validateUserProfile,
  validateName,
  validateEmail,
  validatePassword,
} from "@/lib/userValidation";

export default function AccountPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const showLoader = useLuxuryLoader(loading, 1000);
  const toast = useToastContext();

  function onChange(e) {
    const { name, value } = e.target;
    // Limiter la longueur selon le champ
    let processedValue = value;
    if (name === "firstName" || name === "lastName") {
      if (value.length <= 50) {
        processedValue = value;
      } else {
        return; // Ignorer si trop long
      }
    } else if (name === "email") {
      if (value.length <= 100) {
        processedValue = value.toLowerCase();
      } else {
        return;
      }
    } else if (name === "currentPassword" || name === "newPassword" || name === "confirmPassword") {
      if (value.length <= 128) {
        processedValue = value;
      } else {
        return;
      }
    }
    setForm((prev) => ({ ...prev, [name]: processedValue }));
  }

  // Charger les données de l'utilisateur
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.user) {
          setUser(data.user);
          // Préremplir le formulaire avec les données de l'utilisateur
          setForm({
            firstName: data.user.first_name || "",
            lastName: data.user.last_name || "",
            email: data.user.email || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        } else {
          // Rediriger vers login si non connecté
          window.location.href = "/login";
        }
      } catch (err) {
        console.error(err);
        toast.error("Erreur lors du chargement des données utilisateur");
      } finally {
        // Le loader sera visible au minimum 1000ms grâce à useLuxuryLoader
        setTimeout(() => {
          setLoading(false);
        }, 500); // Temps réel de chargement (peut être rapide)
      }
    };
    loadUser();
  }, []);

  async function onSave(e) {
    e.preventDefault();

    // Validation complète avec les fonctions de sécurité
    const userData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
    };

    const validation = validateUserProfile(userData, false);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      toast.warning(firstError || "Veuillez corriger les erreurs dans le formulaire.");
      return;
    }

    // Validation du mot de passe si fourni
    if (form.newPassword) {
      if (form.newPassword !== form.confirmPassword) {
        toast.warning("Les nouveaux mots de passe ne correspondent pas.");
        return;
      }

      const passwordValidation = validatePassword(form.newPassword, true);
      if (!passwordValidation.valid) {
        toast.warning(passwordValidation.error || "Le mot de passe n'est pas valide.");
        return;
      }
    }

    setSaving(true);
    try {
      if (!user || !user.user_id) {
        toast.error("Erreur: utilisateur non identifié.");
        setSaving(false);
        return;
      }

      // Utiliser les valeurs nettoyées de la validation
      const firstNameValidation = validateName(form.firstName, "Le prénom");
      const lastNameValidation = validateName(form.lastName, "Le nom");
      const emailValidation = validateEmail(form.email);

      const payload = {
        first_name: firstNameValidation.cleaned,
        last_name: lastNameValidation.cleaned,
        email: emailValidation.cleaned,
      };

      // Si un nouveau mot de passe est fourni, vérifier l'ancien d'abord
      if (form.newPassword) {
        if (!form.currentPassword) {
          toast.warning("Veuillez entrer votre mot de passe actuel pour le modifier.");
          setSaving(false);
          return;
        }
        // Vérifier le mot de passe actuel
        const verifyRes = await fetch("/api/auth/verify-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            password: form.currentPassword,
          }),
        });

        const verifyData = await verifyRes.json().catch(() => ({}));
        if (!verifyRes.ok || !verifyData.valid) {
          toast.error("Mot de passe actuel incorrect.");
          setSaving(false);
          return;
        }

        payload.password = form.newPassword;
      }

      // Mettre à jour le profil
      const res = await fetch(`/api/users/${user.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Erreur lors de l'enregistrement");
        setSaving(false);
        return;
      }

      // Mettre à jour les données utilisateur
      setUser(data);
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      toast.success("Modifications enregistrées avec succès !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    if (!confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      return;
    }

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Déconnexion réussie");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        toast.error(data.error || "Erreur lors de la déconnexion");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la déconnexion");
    }
  }

  async function handleDeleteAccount() {
    if (!confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et supprimera toutes vos données.")) {
      return;
    }

    const password = prompt("Veuillez entrer votre mot de passe pour confirmer la suppression :");
    if (!password) {
      return;
    }

    try {
      // Vérifier le mot de passe
      const verifyRes = await fetch("/api/auth/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      const verifyData = await verifyRes.json().catch(() => ({}));
      if (!verifyRes.ok || !verifyData.valid) {
        toast.error("Mot de passe incorrect. Suppression annulée.");
        return;
      }

      // Supprimer le compte
      if (!user || !user.user_id) {
        toast.error("Erreur: utilisateur non identifié.");
        return;
      }

      const res = await fetch(`/api/users/${user.user_id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Erreur lors de la suppression du compte");
        return;
      }

      // Déconnecter l'utilisateur
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      toast.success("Votre compte a été supprimé avec succès.");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression du compte");
    }
  }

  return (
    <main className="account-page">
      {" "}
      {showLoader && <LuxuryLoader />}
      <div className="breadcrumb"><Link href="/">Accueil</Link> /  <Link href="/account">Mon compte</Link> </div>
      <div className="account-grid">
        <aside className="sidebar">
          <h3>Gérer mon compte</h3>
          <ul className="nav-list">
            <li className="active">Mon profil</li>
            <li>
              <Link href="/account/addresses">Carnet d'adresses</Link>
            </li>
            <li>
              <Link href="/account/payments">Mes méthodes de paiement</Link>
            </li>
          </ul>

          <ul className="nav-list">
            <li>
              <Link href="/account/orders">Mes commandes</Link>
            </li>
          </ul>
          <h3 style={{ marginTop: "1.25rem" }}> <Link href="/wishlist">Ma liste de souhaits</Link></h3>
        </aside>

        <section className="main-card">
          <h2>Modifier votre profil</h2>
          <form onSubmit={onSave} style={{ marginTop: "0.75rem" }}>
            <div className="field-grid">
              <div className="field">
                <label>Prénom</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={onChange}
                  maxLength={50}
                  required
                />
              </div>

              <div className="field">
                <label>Nom</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={onChange}
                  maxLength={50}
                  required
                />
              </div>

              <div className="field full-width">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  maxLength={100}
                  required
                />
              </div>

            </div>

            <div className="password-section">
              <h4 style={{ margin: "0 0 0.5rem 0", color: "#374151" }}>
                Modifications du mot de passe
              </h4>
              <div className="field-grid">
                <div className="field">
                  <label>Mot de passe actuel</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={onChange}
                    maxLength={128}
                  />
                </div>
                <div className="field">
                  <label>Nouveau mot de passe</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={onChange}
                    maxLength={128}
                    minLength={8}
                  />
                </div>
                <div className="field">
                  <label>Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={onChange}
                    maxLength={128}
                    minLength={8}
                  />
                </div>
              </div>
            </div>

            <div className="btn-row">
              <button type="submit" className="btn-save" disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </div>
          </form>

          <div className="account-actions" style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid #e5e7eb" }}>
            <h3 style={{ marginBottom: "1rem", color: "#374151" }}>Actions du compte</h3>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn-logout"
                onClick={handleLogout}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#6b7280",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                }}
              >
                Se déconnecter
              </button>

              <button
                type="button"
                className="btn-delete"
                onClick={handleDeleteAccount}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                }}
              >
                Supprimer le compte
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
