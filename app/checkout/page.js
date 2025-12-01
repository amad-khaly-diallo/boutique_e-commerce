"use client";
"use client";
import { useEffect, useState } from "react";
import Golden from "../components/GoldenBotton/GoldenBotton";
import Image from "next/image";
import "./checkout.css";
import LuxuryLoader from "@/app/components/LuxuryLoader/LuxuryLoader";

const mockProducts = [
  { id: 1, title: "Écran LCD", price: 650, img: "/images/prod1.svg" },
  { id: 2, title: "Manette H1", price: 1100, img: "/images/prod2.svg" },
];

export default function Checkout() {
  const [luxeLoading, setluxeLoading] = useState(true);
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    societe: "",
    adresse: "",
    apt: "",
    ville: "",
    telephone: "",
    email: "",
    saveInfo: false,
    payment: "cod",
    coupon: "",
  });

  const subtotal = mockProducts.reduce((s, p) => s + p.price, 0);
  const shipping = 0; // mock
  const total = subtotal + shipping;

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function placeOrder(e) {
    e.preventDefault();
    const order = { form, items: mockProducts, subtotal, shipping, total };
    try {
      localStorage.setItem("lastOrder", JSON.stringify(order));
    } catch (err) {
      console.warn("localStorage not available", err);
    }
    console.log("Commande enregistrée (simulation):", order);
    alert(
      "Commande enregistrée (simulation). Vérifiez la console pour les détails."
    );
  }

  useEffect(() => {
    setTimeout(() => {
      setluxeLoading(false)
    }, 1000);
  }, [])

  return (
    <div className="checkout-container">
      {luxeLoading && <LuxuryLoader />}
      <div className="breadcrumb">
        Compte / Mon compte / Voir panier / <strong>Paiement</strong>
      </div>

      <div className="checkout-grid">
        <form className="billing" onSubmit={placeOrder}>
          <h2>Détails de facturation</h2>

          <label className="form-group">
            <span>Prénom *</span>
            <input
              name="prenom"
              value={form.prenom}
              onChange={onChange}
              required
            />
          </label>

          <label className="form-group">
            <span>Nom *</span>
            <input name="nom" value={form.nom} onChange={onChange} required />
          </label>

          <label className="form-group">
            <span>Adresse *</span>
            <input
              name="adresse"
              value={form.adresse}
              onChange={onChange}
              required
            />
          </label>

          <label className="form-group">
            <span>Appartement, étage, etc. (optionnel)</span>
            <input name="apt" value={form.apt} onChange={onChange} />
          </label>

          <label className="form-group">
            <span>Ville *</span>
            <input
              name="ville"
              value={form.ville}
              onChange={onChange}
              required
            />
          </label>

          <label className="form-group">
            <span>Numéro de téléphone *</span>
            <input
              name="telephone"
              value={form.telephone}
              onChange={onChange}
              required
            />
          </label>

          <label className="form-group">
            <span>Adresse e-mail *</span>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              type="email"
              required
            />
          </label>

          <label className="form-group checkbox">
            <input
              name="saveInfo"
              type="checkbox"
              checked={form.saveInfo}
              onChange={onChange}
            />
            <span>
              Enregistrer ces informations pour un prochain paiement plus rapide
            </span>
          </label>

          <div className="mobile-only">
            <Golden type="submit" className="place-order">
              Passer la commande
            </Golden>
          </div>
        </form>

        <aside className="summary">
          <div className="cart-items">
            {mockProducts.map((p) => (
              <div key={p.id} className="cart-row">
                <Image src={p.img} alt={p.title} width={60} height={60} />
                <div className="cart-info">
                  <div className="cart-title">{p.title}</div>
                </div>
                <div className="cart-price">€{p.price}</div>
              </div>
            ))}
          </div>

          <div className="totals">
            <div className="totals-row">
              <span>Sous-total :</span>
              <span>€{subtotal}</span>
            </div>
            <div className="totals-row">
              <span>Livraison :</span>
              <span>{shipping === 0 ? "Gratuite" : `€${shipping}`}</span>
            </div>
            <div className="totals-row total">
              <span>Total :</span>
              <span>€{total}</span>
            </div>
          </div>

          <div className="desktop-only">
            <Golden className="place-order" onClick={placeOrder}>
              Passer la commande
            </Golden>
          </div>
        </aside>
      </div>
    </div>
  );
}
