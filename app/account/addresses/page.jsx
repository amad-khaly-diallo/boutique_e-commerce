"use client";
import { useEffect, useState } from "react";
import "./addresses.css";
import Link from "next/link";

const STORAGE_KEY = "userAddresses";

function emptyAddress() {
  return {
    id: null,
    prenom: "",
    nom: "",
    societe: "",
    adresse: "",
    apt: "",
    ville: "",
    codePostal: "",
    pays: "",
    telephone: "",
    parDefaut: false,
  };
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [editing, setEditing] = useState(null); // id or null
  const [form, setForm] = useState(emptyAddress());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAddresses(JSON.parse(raw));
      else setAddresses([]);
    } catch (e) {
      console.warn(e);
      setAddresses([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    } catch (e) {
      /* ignore */
    }
  }, [addresses]);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function startAdd() {
    setEditing(null);
    setForm(emptyAddress());
  }

  function startEdit(addr) {
    setEditing(addr.id);
    setForm({ ...addr });
  }

  function saveAddress(e) {
    e.preventDefault();
    const data = { ...form };
    if (!data.prenom || !data.nom || !data.adresse) {
      return alert("Prénom, nom et adresse sont requis.");
    }

    if (data.parDefaut) {
      // unset previous
      setAddresses((prev) => prev.map((p) => ({ ...p, parDefaut: false })));
    }

    if (editing) {
      setAddresses((prev) => prev.map((p) => (p.id === editing ? { ...data, id: editing } : p)));
      setEditing(null);
    } else {
      const id = Date.now();
      setAddresses((prev) => [{ ...data, id }, ...prev]);
    }

    setForm(emptyAddress());
  }

  function removeAddress(id) {
    if (!confirm("Supprimer cette adresse ?")) return;
    setAddresses((prev) => prev.filter((p) => p.id !== id));
  }

  function setDefault(id) {
    setAddresses((prev) => prev.map((p) => ({ ...p, parDefaut: p.id === id })));
  }

  return (
    <main className="addresses-page">
      <div className="breadcrumb"> <Link href="/">Accueil</Link> /  <Link href="/account">Mon compte</Link> / Carnet d'adresses</div>

      <div className="addresses-grid">
        <section className="list">
          <div className="list-header">
            <h2>Mes adresses</h2>
            <button className="btn" onClick={startAdd}>Ajouter une adresse</button>
          </div>

          {addresses.length === 0 ? (
            <div className="empty">Aucune adresse enregistrée.</div>
          ) : (
            <ul className="addresses-list">
              {addresses.map((a) => (
                <li key={a.id} className={`address-item ${a.parDefaut ? "default" : ""}`}>
                  <div className="addr-main">
                    <div className="addr-name">{a.prenom} {a.nom} {a.societe ? `- ${a.societe}` : ""}</div>
                    <div className="addr-line">{a.adresse} {a.apt}</div>
                    <div className="addr-line">{a.ville} {a.codePostal} {a.pays}</div>
                    <div className="addr-line">{a.telephone}</div>
                  </div>
                  <div className="addr-actions">
                    {!a.parDefaut && <button className="link" onClick={() => setDefault(a.id)}>Définir par défaut</button>}
                    <button className="link" onClick={() => startEdit(a)}>Éditer</button>
                    <button className="link danger" onClick={() => removeAddress(a.id)}>Supprimer</button>
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
              <input name="prenom" value={form.prenom} onChange={onChange} placeholder="Prénom" />
              <input name="nom" value={form.nom} onChange={onChange} placeholder="Nom" />
            </div>
            <input name="societe" value={form.societe} onChange={onChange} placeholder="Société (optionnel)" />
            <input name="adresse" value={form.adresse} onChange={onChange} placeholder="Adresse (rue, numéro)" />
            <input name="apt" value={form.apt} onChange={onChange} placeholder="Appartement, étage (optionnel)" />
            <div className="row">
              <input name="ville" value={form.ville} onChange={onChange} placeholder="Ville" />
              <input name="codePostal" value={form.codePostal} onChange={onChange} placeholder="Code postal" />
            </div>
            <div className="row">
              <input name="pays" value={form.pays} onChange={onChange} placeholder="Pays" />
              <input name="telephone" value={form.telephone} onChange={onChange} placeholder="Téléphone" />
            </div>
            <label className="checkbox">
              <input type="checkbox" name="parDefaut" checked={form.parDefaut} onChange={onChange} /> Définir comme adresse par défaut
            </label>

            <div className="form-actions">
              <button type="submit" className="btn primary">{editing ? "Enregistrer" : "Ajouter"}</button>
              <button type="button" className="btn" onClick={() => { setForm(emptyAddress()); setEditing(null); }}>Annuler</button>
            </div>
          </form>
        </aside>
      </div>
    </main>
  );
}
