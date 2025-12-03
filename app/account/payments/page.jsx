"use client";
import { useEffect, useState } from "react";
import "./payments.css";
import Link from "next/link";

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
    if (!data.titulaire || !data.numero || !data.expiry) return alert("Veuillez remplir les champs requis.");

    // CVV validation: Amex typically 4 digits, others 3 digits
    const cvvClean = String(data.cvv || "").trim();
    const requires4 = data.type === "American Express";
    if (cvvClean.length === 0) {
      return alert("Le CVV est requis pour valider la carte (il ne sera pas enregistré).");
    }
    if (requires4) {
      if (!/^\d{4}$/.test(cvvClean)) return alert("Le CVV pour American Express doit contenir 4 chiffres.");
    } else {
      if (!/^\d{3}$/.test(cvvClean)) return alert("Le CVV doit contenir 3 chiffres.");
    }

    if (data.parDefaut) setCards((prev) => prev.map((c) => ({ ...c, parDefaut: false })));

    // Do NOT persist CVV. Remove it before envoyer vers l'API.
    const { cvv, ...payload } = data;

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
            <input name="titulaire" value={form.titulaire} onChange={onChange} placeholder="Nom sur la carte" />

            <label>Numéro de carte</label>
            <input name="numero" value={form.numero} onChange={onChange} placeholder="1234 5678 9012 3456" />

            <div className="row">
              <div>
                <label>Expiration (MM/AA)</label>
                <input name="expiry" value={form.expiry} onChange={onChange} placeholder="MM/AA" />
              </div>
              <div>
                <label>CVV</label>
                <input name="cvv" value={form.cvv} onChange={onChange} placeholder={form.type === 'American Express' ? '4 chiffres' : '3 chiffres'} />
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
