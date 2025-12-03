"use client";
import React, { useEffect, useState } from "react";
import "../admin.css";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/orders", { cache: "no-store" });
        const data = await res.json().catch(() => []);
        if (res.ok && Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  async function markShipped(id) {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "shipped" }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(body.error || "Erreur lors de la mise à jour de la commande");
        return;
      }
      setOrders((prev) =>
        prev.map((o) => (o.order_id === id ? body : o)),
      );
    } catch (err) {
      console.error(err);
      alert("Impossible de mettre à jour la commande.");
    }
  }

  function exportOrders() {
    const header = ["order_id", "user_id", "total_amount", "status", "created_at"].join(
      ",",
    );
    const body = orders
      .map((o) =>
        [
          o.order_id,
          o.user_id,
          o.total_amount,
          o.status,
          o.created_at,
        ]
          .map((v) => `"${v ?? ""}"`)
          .join(","),
      )
      .join("\n");
    const csv = header + "\n" + body;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Commandes</h2>
      <div
        style={{
          margin: "12px 0 18px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="small">
          {loading ? "Chargement…" : `${orders.length} commandes`}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-plain" onClick={exportOrders}>
            Exporter CSV
          </button>
        </div>
      </div>

      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Commande</th>
              <th>Client (ID)</th>
              <th>Total</th>
              <th>Date</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.order_id}>
                <td>#{o.order_id}</td>
                <td>{o.user_id}</td>
                <td>{Number(o.total_amount || 0).toFixed(2)} €</td>
                <td>{o.created_at}</td>
                <td>
                  <span
                    className={`status ${
                      o.status === "pending" ? "pending" : "shipped"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td>
                  {o.status === "pending" && (
                    <button
                      className="btn btn-primary"
                      onClick={() => markShipped(o.order_id)}
                    >
                      Marquer expédiée
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
