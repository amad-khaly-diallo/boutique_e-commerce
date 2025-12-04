"use client";
import { useEffect, useState } from "react";
import Golden from "../components/GoldenBotton/GoldenBotton";
import Image from "next/image";
import "./checkout.css";
import LuxuryLoader from "@/app/components/LuxuryLoader/LuxuryLoader";

export default function Checkout() {
  const [luxeLoading, setluxeLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [subtotals, setSubtotals] = useState({ subtotal: 0, shipping: 0 });
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
  const [placing, setPlacing] = useState(false);

  const subtotal = subtotals.subtotal;
  const shipping = subtotals.shipping;
  const total = subtotal + shipping;

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function placeOrder(e) {
    e.preventDefault();
    if (!cartItems.length) {
      alert("Votre panier est vide.");
      return;
    }

    setPlacing(true);
    try {
      const meRes = await fetch("/api/auth/me", {
        credentials: "include",
      });
      const meData = await meRes.json().catch(() => ({}));
      if (!meRes.ok || !meData.user) {
        alert("Vous devez être connecté pour passer commande.");
        setPlacing(false);
        return;
      }

      const orderPayload = {
        user_id: meData.user.user_id,
        address: `${form.prenom} ${form.nom}, ${form.adresse} ${form.apt || ""}, ${form.ville} - ${form.telephone}`,
        total_amount: subtotal,
        status: "pending",
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price_unit: item.price,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Erreur lors de la création de la commande.");
        setPlacing(false);
        return;
      }

      alert("Commande enregistrée avec succès.");
      window.location.href = "/account/orders";
    } catch (err) {
      console.error(err);
      alert("Impossible de passer la commande pour le moment.");
    } finally {
      setPlacing(false);
    }
  }

  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await fetch("/api/carts", {
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && Array.isArray(data.cart)) {
          setCartItems(data.cart);
          const s = data.cart.reduce(
            (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1),
            0,
          );
          setSubtotals({ subtotal: s, shipping: 0 });
        } else {
          setCartItems([]);
          setSubtotals({ subtotal: 0, shipping: 0 });
        }
      } catch (err) {
        console.error(err);
        setCartItems([]);
        setSubtotals({ subtotal: 0, shipping: 0 });
      } finally {
        setTimeout(() => {
          setluxeLoading(false);
        }, 1000);
      }
    };
    loadCart();
  }, []);

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
            <Golden type="submit" className="place-order" disabled={placing}>
              {placing ? "Traitement..." : "Passer la commande"}
            </Golden>
          </div>
        </form>

        <aside className="summary">
          <div className="cart-items">
            {cartItems.map((p) => (
              <div key={p.cart_item_id} className="cart-row">
                <Image src={p.image} alt={p.product_name} width={60} height={60} />
                <div className="cart-info">
                  <div className="cart-title">{p.product_name}</div>
                  <div className="small">Qté : {p.quantity}</div>
                </div>
                <div className="cart-price">
                  €{Number(p.price || 0) * Number(p.quantity || 1)}
                </div>
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
            <Golden className="place-order" onClick={placeOrder} disabled={placing}>
              {placing ? "Traitement..." : "Passer la commande"}
            </Golden>
          </div>
        </aside>
      </div>
    </div>
  );
}
