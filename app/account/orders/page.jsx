"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./orders.css";

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" });
}

const SAMPLE_ORDERS = [
  {
    id: "ORD-1001",
    date: Date.now() - 1000 * 60 * 60 * 24 * 12,
    total: 89.9,
    status: "Livrée",
    items: [
      { id: "p1", name: "Pull en laine", qty: 1, price: 49.9 },
      { id: "p2", name: "Chaussettes luxe", qty: 2, price: 20 },
    ],
  },
  {
    id: "ORD-1002",
    date: Date.now() - 1000 * 60 * 60 * 24 * 3,
    total: 45.0,
    status: "En préparation",
    items: [{ id: "p3", name: "Chemise blanche", qty: 1, price: 45 }],
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("userOrders");
      if (raw) {
        setOrders(JSON.parse(raw));
      } else {
        // seed with samples for first-time users
        setOrders(SAMPLE_ORDERS);
        localStorage.setItem("userOrders", JSON.stringify(SAMPLE_ORDERS));
      }
    } catch (err) {
      console.error(err);
      setOrders(SAMPLE_ORDERS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) localStorage.setItem("userOrders", JSON.stringify(orders));
  }, [orders, loading]);

  function toggleExpand(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function cancelOrder(id) {
    if (!confirm("Annuler cette commande ?")) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Annulée" } : o))
    );
    setExpandedId(null);
  }

  return (
    <main className="orders-page">
      <div className="breadcrumb">
        <Link href="/">Accueil</Link> / <Link href="/account">Mon compte</Link> / Mes commandes
      </div>

      <div className="header">
        <h1>Mes commandes</h1>
        <div className="actions">
          <Link href="/products" className="btn">Continuer mes achats </Link> 
        </div>
      </div>

      {loading ? (
        <div className="empty">Chargement…</div>
      ) : orders.length === 0 ? (
        <div className="empty">Vous n'avez aucune commande pour le moment.</div>
      ) : (
        <ul className="list-orders">
          {orders.map((o) => (
            <li key={o.id} className={`order-item status-${o.status.replace(/\s+/g, "-").toLowerCase()}`}>
              <div className="order-row">
                <div className="order-meta">
                  <div className="oid">{o.id}</div>
                  <div className="date">{formatDate(o.date)}</div>
                </div>
                <div className="order-right">
                  <div className="total">{o.total.toFixed(2)} €</div>
                  <div className="status">{o.status}</div>
                  <div className="controls">
                    <button className="link" onClick={() => toggleExpand(o.id)}>
                      {expandedId === o.id ? "Masquer" : "Détails"}
                    </button>
                    {(o.status === "En attente" || o.status === "En préparation") && (
                      <button className="link danger" onClick={() => cancelOrder(o.id)}>
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {expandedId === o.id && (
                <div className="order-details">
                  <h4>Articles</h4>
                  <ul className="items">
                    {o.items.map((it) => (
                      <li key={it.id} className="item">
                        <div className="name">{it.name} × {it.qty}</div>
                        <div className="price">{(it.price * it.qty).toFixed(2)} €</div>
                      </li>
                    ))}
                  </ul>
                  <div className="detail-row">
                    <div>Montant total</div>
                    <div className="bold">{o.total.toFixed(2)} €</div>
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
