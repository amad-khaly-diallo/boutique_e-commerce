"use client";
import { useState } from "react";
import { Trash } from "lucide-react";
import "./cart.css";
import Image from "next/image";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Sac Gucci",
      price: 2650,
      qty: 1,
      image: "/img/gucci.jpg",
    },
    {
      id: 2,
      name: "Montre Patek Philippe",
      price: 5950,
      qty: 2,
      image: "/img/montre-patek-philippe-aquanaut-5261r-prix-avis.jpg",
    },
  ]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  function removeItem(id) {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
  }

  return (
    <main className="cart-container">
      <h1 className="title">Votre panier</h1>

      <div className="cart-table">
        <div className="cart-header">
          <span>Produit</span>
          <span>Prix</span>
          <span>Quantité</span>
          <span>Total</span>
          <span></span>
        </div>

        {cartItems.map((item) => (
          <div className="cart-row" key={item.id}>
            <div className="product-info">
              <Image src={item.image} width={70} height={70} alt={item.name} />
              <span>{item.name}</span>
            </div>

            <span className="price">€{item.price}</span>

            <input type="number" min={1} className="qty-select" defaultValue={item.qty} />

            <span className="subtotal">€{item.price * item.qty}</span>

            <button
              className="remove-btn"
              onClick={() => removeItem(item.id)}
              aria-label={`Supprimer ${item.name}`}
              title="Supprimer"
            >
                <Trash size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Boutons */}
      <div className="cart-buttons">
        <button className="btn-return" onClick={() => (window.location.href = "/")}>Return To Shop</button>
      </div>

      {/* Coupon + Résumé total */}
      <div className="cart-bottom">
        <div className="cart-total-box">
          <h3>Total du Panier</h3>
          <div className="total-line">
            <span>Sous-total:</span>
            <span>€{subtotal}</span>
          </div>
          <div className="total-line">
            <span>Transport:</span>
            <span>Gratuit</span>
          </div>
          <div className="total-line total-final">
            <span>Total:</span>
            <span>€{subtotal}</span>
          </div>

          <button className="btn-checkout" onClick={() => (window.location.href = "/checkout")}>Proceed to checkout</button>
        </div>
      </div>

    </main>
  );
}
