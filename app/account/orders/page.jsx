"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./orders.css";

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/orders/me", {
          credentials: "include",
        });

        if (res.status === 401) {
          setOrders([]);
          setError(
            "Vous devez être connecté pour consulter vos commandes.",
          );
          return;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Erreur lors du chargement des commandes");
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  function toggleExpand(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <main className="orders-page">
      <div className="breadcrumb">
        <Link href="/">Accueil</Link> /{" "}
        <Link href="/account">Mon compte</Link> / Mes commandes
      </div>

      <div className="header">
        <h1>Mes commandes</h1>
        <div className="actions">
          <Link href="/products" className="btn">
            Continuer mes achats{" "}
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="empty">Chargement…</div>
      ) : error ? (
        <div className="empty">{error}</div>
      ) : orders.length === 0 ? (
        <div className="empty">
          Vous n&apos;avez aucune commande pour le moment.
        </div>
      ) : (
        <ul className="list-orders">
          {orders.map((o) => (
            <li
              key={o.order_id}
              className={`order-item status-${String(o.status || "")
                .replace(/\s+/g, "-")
                .toLowerCase()}`}
            >
              <div className="order-row">
                <div className="order-meta">
                  <div className="oid">#{o.order_id}</div>
                  <div className="date">
                    {o.created_at ? formatDate(o.created_at) : "-"}
                  </div>
                </div>
                <div className="order-right">
                  <div className="total">
                    {Number(o.total_amount || 0).toFixed(2)} €
                  </div>
                  <div className="status">{o.status}</div>
                  <div className="controls">
                    <button
                      className="link"
                      onClick={() => toggleExpand(o.order_id)}
                    >
                      {expandedId === o.order_id ? "Masquer" : "Détails"}
                    </button>
                  </div>
                </div>
              </div>

              {expandedId === o.order_id && (
                <div className="order-details">
                  <h4>Articles</h4>
                  <ul className="items">
                    {(o.items || []).map((it) => (
                      <li key={it.order_item_id} className="item">
                        <div className="name">
                          Produit #{it.product_id} × {it.quantity}
                        </div>
                        <div className="price">
                          {(Number(it.price_unit || 0) * Number(it.quantity || 0)).toFixed(2)} €
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="detail-row">
                    <div>Montant total</div>
                    <div className="bold">
                      {Number(o.total_amount || 0).toFixed(2)} €
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

