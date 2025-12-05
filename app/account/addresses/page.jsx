"use client";
import { useEffect, useState } from "react";
import "./addresses.css";
import Link from "next/link";
import { validateAddressData, cleanAddressData } from "@/lib/addressValidation";

function emptyAddress() {
  return {
    address_id: null,
    prenom: "",
    nom: "",
    societe: "",
    adresse: "",
    apt: "",
    ville: "",
    codePostal: "",
    pays: "",
    telephone: "",
    parDefaut: 0,
  };
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [editing, setEditing] = useState(null); // address_id or null
  const [form, setForm] = useState(emptyAddress());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/addresses", {
          credentials: "include",
        });

        if (res.status === 401) {
          setAddresses([]);
          setError(
            "Vous devez être connecté pour gérer votre carnet d'adresses.",
          );
          return;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            data.error || "Erreur lors du chargement des adresses",
          );
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setAddresses(data);
        } else {
          setAddresses([]);
        }
      } catch (e) {
        console.warn(e);
        setError(e.message);
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setForm((f) => ({
        ...f,
        [name]: checked ? 1 : 0,
      }));
      return;
    }

    // Limiter la longueur selon le champ
    let processedValue = value;
    const maxLengths = {
      prenom: 50,
      nom: 50,
      societe: 100,
      adresse: 200,
      apt: 50,
      ville: 100,
      codePostal: 20,
      pays: 100,
      telephone: 20,
    };

    if (maxLengths[name] && value.length > maxLengths[name]) {
      return; // Ignorer si trop long
    }

    setForm((f) => ({
      ...f,
      [name]: processedValue,
    }));
  }

  function startAdd() {
    setEditing(null);
    setForm(emptyAddress());
  }

  function startEdit(addr) {
    setEditing(addr.address_id);
    setForm({
      ...addr,
      parDefaut: addr.parDefaut ? 1 : 0,
    });
  }

  async function saveAddress(e) {
    e.preventDefault();
    const data = { ...form };

    // Validation complète avec les fonctions de sécurité
    const validation = validateAddressData(data);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      alert(firstError || "Veuillez corriger les erreurs dans le formulaire.");
      return;
    }

    setSaving(true);
    try {
      // Nettoyer et préparer les données avec les valeurs validées
      const cleanedData = cleanAddressData(data);
      const payload = {
        ...cleanedData.cleaned,
        parDefaut: data.parDefaut ? 1 : 0,
      };

      let res;
      if (editing) {
        res = await fetch(`/api/addresses/${editing}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      }

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(body.error || "Erreur lors de l'enregistrement");
      }

      // On recharge la liste depuis l'API pour refléter parDefaut, etc.
      const listRes = await fetch("/api/addresses", {
        credentials: "include",
      });
      const listData = await listRes.json().catch(() => []);

      if (Array.isArray(listData)) {
        setAddresses(listData);
      }

      setEditing(null);
      setForm(emptyAddress());
    } catch (err) {
      console.error(err);
      alert(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  async function removeAddress(id) {
    if (!confirm("Supprimer cette adresse ?")) return;
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la suppression");
      }
      setAddresses((prev) => prev.filter((p) => p.address_id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Impossible de supprimer l'adresse");
    }
  }

  async function setDefault(id) {
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ parDefaut: 1 }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      const listRes = await fetch("/api/addresses", {
        credentials: "include",
      });
      const listData = await listRes.json().catch(() => []);
      if (Array.isArray(listData)) {
        setAddresses(listData);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Impossible de mettre à jour l'adresse par défaut");
    }
  }

  return (
    <main className="addresses-page">
      <div className="breadcrumb">
        {" "}
        <Link href="/">Accueil</Link> /{" "}
        <Link href="/account">Mon compte</Link> / Carnet d&apos;adresses
      </div>

      <div className="addresses-grid">
        <section className="list">
          <div className="list-header">
            <h2>Mes adresses</h2>
            <button className="btn" onClick={startAdd}>
              Ajouter une adresse
            </button>
          </div>

          {loading ? (
            <div className="empty">Chargement…</div>
          ) : error ? (
            <div className="empty">{error}</div>
          ) : addresses.length === 0 ? (
            <div className="empty">Aucune adresse enregistrée.</div>
          ) : (
            <ul className="addresses-list">
              {addresses.map((a) => (
                <li
                  key={a.address_id}
                  className={`address-item ${a.parDefaut ? "default" : ""}`}
                >
                  <div className="addr-main">
                    <div className="addr-name">
                      {a.prenom} {a.nom} {a.societe ? `- ${a.societe}` : ""}
                    </div>
                    <div className="addr-line">
                      {a.adresse} {a.apt}
                    </div>
                    <div className="addr-line">
                      {a.ville} {a.codePostal} {a.pays}
                    </div>
                    <div className="addr-line">{a.telephone}</div>
                  </div>
                  <div className="addr-actions">
                    {!a.parDefaut && (
                      <button
                        className="link"
                        onClick={() => setDefault(a.address_id)}
                      >
                        Définir par défaut
                      </button>
                    )}
                    <button
                      className="link"
                      onClick={() => startEdit(a)}
                    >
                      Éditer
                    </button>
                    <button
                      className="link danger"
                      onClick={() => removeAddress(a.address_id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="form-box">
          <h3>{editing ? "Modifier l'adresse" : "Nouvelle adresse"}</h3>
          <form onSubmit={saveAddress} className="addr-form">
            <div className="row">
              <input
                name="prenom"
                value={form.prenom}
                onChange={onChange}
                placeholder="Prénom"
                maxLength={50}
                required
              />
              <input
                name="nom"
                value={form.nom}
                onChange={onChange}
                placeholder="Nom"
                maxLength={50}
                required
              />
            </div>
            <input
              name="societe"
              value={form.societe}
              onChange={onChange}
              placeholder="Société (optionnel)"
              maxLength={100}
            />
            <input
              name="adresse"
              value={form.adresse}
              onChange={onChange}
              placeholder="Adresse (rue, numéro)"
              maxLength={200}
              required
            />
            <input
              name="apt"
              value={form.apt}
              onChange={onChange}
              placeholder="Appartement, étage (optionnel)"
              maxLength={50}
            />
            <div className="row">
              <input
                name="ville"
                value={form.ville}
                onChange={onChange}
                placeholder="Ville"
                maxLength={100}
              />
              <input
                name="codePostal"
                value={form.codePostal}
                onChange={onChange}
                placeholder="Code postal"
                maxLength={20}
              />
            </div>
            <div className="row">
              <input
                name="pays"
                value={form.pays}
                onChange={onChange}
                placeholder="Pays"
                maxLength={100}
              />
              <input
                name="telephone"
                value={form.telephone}
                onChange={onChange}
                placeholder="Téléphone"
                maxLength={20}
              />
            </div>
            <label className="checkbox">
              <input
                type="checkbox"
                name="parDefaut"
                checked={!!form.parDefaut}
                onChange={onChange}
              />{" "}
              Définir comme adresse par défaut
            </label>

            <div className="form-actions">
              <button
                type="submit"
                className="btn primary"
                disabled={saving}
              >
                {saving
                  ? "Enregistrement..."
                  : editing
                  ? "Enregistrer"
                  : "Ajouter"}
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setForm(emptyAddress());
                  setEditing(null);
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        </aside>
      </div>
    </main>
  );
}

