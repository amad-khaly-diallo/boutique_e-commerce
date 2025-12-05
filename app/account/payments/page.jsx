"use client";
import { useEffect, useState } from "react";
import "./payments.css";
import Link from "next/link";
import {
  validatePaymentData,
  validateCardNumber,
  validateCardHolder,
  validateExpiryDate,
  validateCVV,
  formatCardNumber,
  formatExpiryDate,
} from "@/lib/paymentValidation";

function emptyCard() {
  return {
    payment_id: null,
    titulaire: "",
    type: "Visa",
    numero: "",
    expiry: "",
    cvv: "",
    parDefaut: false,
  };
}

export default function PaymentsPage() {
  const [cards, setCards] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyCard());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const fetchCards = async () => {
        setLoading(true);
        const res = await fetch("/api/payments", {
          credentials: "include",
        });

        if (res.status === 401) {
          setCards([]);
          return;
        }

        if (!res.ok) {
          console.warn("Erreur chargement paiements");
          setCards([]);
          return;
        }

        const data = await res.json().catch(() => []);
        if (Array.isArray(data)) setCards(data);
        else setCards([]);
      };

      fetchCards();
    } catch (e) {
      console.warn(e);
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function startAdd() {
    setEditing(null);
    setForm(emptyCard());
  }

  function startEdit(card) {
    setEditing(card.payment_id);
    // do not preload CVV for security - leave empty
    setForm({ ...card, numero: "", cvv: "" });
  }

  async function saveCard(e) {
    e.preventDefault();
    const data = { ...form };

    // Validation complète avec les fonctions de sécurité
    const validation = validatePaymentData(data);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      alert(firstError || "Veuillez corriger les erreurs dans le formulaire.");
      return;
    }

    // Validation CVV (requis mais ne sera pas enregistré)
    const cvvValidation = validateCVV(data.cvv, data.type);
    if (!cvvValidation.valid) {
      alert(cvvValidation.error || "Le CVV est requis pour valider la carte (il ne sera pas enregistré).");
      return;
    }

    if (data.parDefaut) setCards((prev) => prev.map((c) => ({ ...c, parDefaut: false })));

    // Nettoyer et préparer les données
    const cardNumberValidation = validateCardNumber(data.numero, data.type);
    const holderValidation = validateCardHolder(data.titulaire);
    const expiryValidation = validateExpiryDate(data.expiry);

    // Do NOT persist CVV. Remove it before envoyer vers l'API.
    const { cvv, ...payload } = data;
    
    // Utiliser les valeurs nettoyées
    payload.numero = cardNumberValidation.cleaned;
    payload.titulaire = holderValidation.cleaned;
    payload.expiry = expiryValidation.cleaned;

    try {
      let res;
      if (editing) {
        res = await fetch(`/api/payments/${editing}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      }

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(body.error || "Erreur lors de l'enregistrement de la carte.");
        return;
      }

      // Recharger la liste depuis l'API
      const listRes = await fetch("/api/payments", {
        credentials: "include",
      });
      const listData = await listRes.json().catch(() => []);
      if (Array.isArray(listData)) {
        setCards(listData);
      }

      setEditing(null);
      setForm(emptyCard());
    } catch (err) {
      console.error(err);
      alert("Impossible d'enregistrer la carte.");
    }
  }

  async function removeCard(id) {
    if (!confirm("Supprimer cette méthode de paiement ?")) return;
    try {
      const res = await fetch(`/api/payments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Erreur lors de la suppression.");
        return;
      }
      setCards((prev) => prev.filter((c) => c.payment_id !== id));
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer la carte.");
    }
  }

  async function setDefault(id) {
    try {
      const res = await fetch(`/api/payments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ parDefaut: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Erreur lors de la mise à jour.");
        return;
      }

      const listRes = await fetch("/api/payments", {
        credentials: "include",
      });
      const listData = await listRes.json().catch(() => []);
      if (Array.isArray(listData)) setCards(listData);
    } catch (err) {
      console.error(err);
      alert("Impossible de mettre à jour la carte par défaut.");
    }
  }

  return (
    <main className="payments-page">
      <div className="breadcrumb"><Link href="/">Accueil</Link> /  <Link href="/account">Mon compte</Link> / <Link href="/account/payments">Méthodes de paiement</Link></div>

      <div className="payments-grid">
        <section className="list">
          <div className="list-header">
            <h2>Mes moyens de paiement</h2>
            <button className="btn" onClick={startAdd}>Ajouter une carte</button>
          </div>

          {loading ? (
            <div className="empty">Chargement…</div>
          ) : cards.length === 0 ? (
            <div className="empty">Aucune méthode enregistrée.</div>
          ) : (
            <ul className="cards-list">
              {cards.map((c) => (
                <li key={c.payment_id} className={`card-item ${c.parDefaut ? 'default' : ''}`}>
                  <div className="card-main">
                    <div className="card-type">{c.type} {c.parDefaut && <span className="badge">Par défaut</span>}</div>
                    <div className="card-number">{c.numero_masque}</div>
                    <div className="card-holder">{c.titulaire} • {c.expiry}</div>
                  </div>
                  <div className="card-actions">
                    {!c.parDefaut && <button className="link" onClick={() => setDefault(c.payment_id)}>Définir par défaut</button>}
                    <button className="link" onClick={() => startEdit(c)}>Éditer</button>
                    <button className="link danger" onClick={() => removeCard(c.payment_id)}>Supprimer</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="form-box">
          <h3>{editing ? 'Modifier la carte' : 'Nouvelle carte'}</h3>
          <form className="card-form" onSubmit={saveCard}>
            <label>Type</label>
            <select name="type" value={form.type} onChange={onChange}>
              <option>Visa</option>
              <option>MasterCard</option>
              <option>American Express</option>
            </select>

            <label>Titulaire</label>
            <input
              name="titulaire"
              value={form.titulaire}
              onChange={(e) => {
                const value = e.target.value;
                // Limiter la longueur et nettoyer les caractères dangereux
                if (value.length <= 50) {
                  onChange(e);
                }
              }}
              maxLength={50}
              placeholder="Nom sur la carte"
            />

            <label>Numéro de carte</label>
            <input
              name="numero"
              value={form.numero}
              onChange={(e) => {
                const value = e.target.value;
                // Nettoyer et formater le numéro de carte
                const formatted = formatCardNumber(value);
                // Limiter à 19 caractères (16 chiffres + 3 espaces)
                if (formatted.replace(/\s/g, "").length <= 16) {
                  setForm((f) => ({ ...f, numero: formatted }));
                }
              }}
              maxLength={19}
              placeholder="1234 5678 9012 3456"
            />

            <div className="row">
              <div>
                <label>Expiration (MM/AA)</label>
                <input
                  name="expiry"
                  value={form.expiry}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Formater automatiquement la date
                    const formatted = formatExpiryDate(value);
                    if (formatted.length <= 5) {
                      setForm((f) => ({ ...f, expiry: formatted }));
                    }
                  }}
                  maxLength={5}
                  placeholder="MM/AA"
                />
              </div>
              <div>
                <label>CVV</label>
                <input
                  name="cvv"
                  type="password"
                  value={form.cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    // Limiter selon le type de carte
                    const maxLength = form.type === "American Express" ? 4 : 3;
                    if (value.length <= maxLength) {
                      setForm((f) => ({ ...f, cvv: value }));
                    }
                  }}
                  maxLength={4}
                  placeholder={form.type === "American Express" ? "4 chiffres" : "3 chiffres"}
                />
              </div>
            </div>
            <div>
              <label className="checkbox small"><input type="checkbox" name="parDefaut" checked={form.parDefaut} onChange={onChange} /> Définir par défaut</label>
            </div>

            <div className="form-actions">
              <button className="btn primary" type="submit">{editing ? 'Enregistrer' : 'Ajouter'}</button>
              <button className="btn" type="button" onClick={() => { setForm(emptyCard()); setEditing(null); }}>Annuler</button>
            </div>
          </form>
        </aside>
      </div>
    </main>
  );
}
