"use client";
import { useEffect, useState } from "react";
import Golden from "../components/GoldenBotton/GoldenBotton";
import { Trash } from "lucide-react";
import "./cart.css";
import Image from "next/image";
import LuxuryLoader from "@/app/components/LuxuryLoader/LuxuryLoader";

export default function CartPage() {
  const [luxeLoading, setLuxeLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/carts", { cache: "no-store" });
      if (!res.ok) throw new Error("Erreur lors du chargement du panier");

      const data = await res.json();
      setCartItems(data.cart || []);
    } catch (err) {
      console.error(err);
    }
  };

  // 👇 Recalcule le subtotal uniquement quand cartItems change
  useEffect(() => {
    const newSubtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(newSubtotal);
  }, [cartItems]);

  async function removeItem(cartItemId) {
    try {
      const res = await fetch("/api/carts/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      // Supprime localement après confirmation côté serveur
      setCartItems((prev) => prev.filter((it) => it.cart_item_id !== cartItemId));
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer l'article, réessayez.");
    }
  }

  useEffect(() => {
    fetchProducts();
    const t = setTimeout(() => setLuxeLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="cart-container">
      {luxeLoading ? <LuxuryLoader /> : (
        <>
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
              <div className="cart-row" key={item.cart_item_id}>
                <div className="product-info">
                  <Image
                    src={item.image}
                    width={70}
                    height={70}
                    alt={item.product_name}
                  />
                  <span>{item.product_name}</span>
                </div>

                <span className="price">€{item.price}</span>

                <input
                  type="number"
                  min={1}
                  className="qty-select"
                  value={item.quantity}
                  onChange={(e) => {
                    const newQty = Number(e.target.value);
                    setCartItems((prev) =>
                      prev.map((p) =>
                        p.cart_item_id === item.cart_item_id
                          ? { ...p, quantity: newQty }
                          : p
                      )
                    );
                  }}
                />

                <span className="subtotal">
                  €{item.price * item.quantity}
                </span>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.cart_item_id)}
                  aria-label={`Supprimer ${item.product_name}`}
                >
                  <Trash size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-buttons">
            <Golden className="btn-return" onClick={() => (window.location.href = "/")}>
              Retour à la boutique
            </Golden>
          </div>

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

              <Golden
                className="btn-checkout"
                onClick={() => (window.location.href = "/checkout")}
              >
                Proceed to checkout
              </Golden>
            </div>
          </div>
        </>
      )}


    </main>
  );
}