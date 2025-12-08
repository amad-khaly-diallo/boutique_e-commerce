"use client";
import React, { useEffect, useState } from "react";
import "../admin.css";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
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

  async function loadOrderDetails(orderId) {
    if (orderDetails[orderId]) {
      setOrderDetails(prev => {
        const newDetails = { ...prev };
        delete newDetails[orderId];
        return newDetails;
      });
      return;
    }
    try {
      const res = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.items) {
        setOrderDetails(prev => ({ ...prev, [orderId]: data.items }));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(body.error || "Erreur lors de la mise à jour de la commande");
        return;
      }

      setOrders((prev) =>
        prev.map((o) => (o.order_id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error(err);
      alert("Impossible de mettre à jour la commande.");
    }
  }

  async function deleteOrder(orderId) {
    if (!confirm("Supprimer cette commande ? Cette action est irréversible.")) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(body.error || "Erreur lors de la suppression");
        return;
      }
      setOrders((prev) => prev.filter((o) => o.order_id !== orderId));
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer la commande.");
    }
  }

  function exportOrders() {
    const header = ["order_id", "user_id", "client", "email", "total_amount", "status", "created_at"].join(",");

    const body = orders
      .map((o) =>
        [
          o.order_id,
          o.user_id,
          `${o.first_name || ""} ${o.last_name || ""}`.trim(),
          o.email || "",
          o.total_amount,
          o.status,
          o.created_at,
        ]
          .map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`)
          .join(",")
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

  const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled", "completed"];

  return (
    <div style={{ padding: 24 }}>
      <h2>Gestion des Commandes</h2>

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

        <button className="btn btn-plain" onClick={exportOrders}>
          Exporter CSV
        </button>
      </div>

      <div className="panel">
        {loading ? (
          <div className="small">Chargement…</div>
        ) : orders.length === 0 ? (
          <div className="small">Aucune commande</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Commande</th>
                <th>Client</th>
                <th>Email</th>
                <th>Total</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <React.Fragment key={o.order_id}>
                  <tr>
                    <td>#{o.order_id}</td>
                    <td>
                      {o.first_name || o.last_name
                        ? `${o.first_name || ""} ${o.last_name || ""}`.trim()
                        : `ID: ${o.user_id}`}
                    </td>
                    <td>{o.email || "-"}</td>
                    <td>{Number(o.total_amount || 0).toFixed(2)} €</td>
                    <td suppressHydrationWarning>
                      {o.created_at ? new Date(o.created_at).toLocaleDateString("fr-FR") : "-"}
                    </td>
                    <td>
                      <select
                        value={o.status || "pending"}
                        onChange={(e) => updateOrderStatus(o.order_id, e.target.value)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: 4,
                          border: "1px solid #ddd",
                        }}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          className="btn btn-plain"
                          onClick={() => loadOrderDetails(o.order_id)}
                        >
                          {orderDetails[o.order_id] ? "Masquer" : "Détails"}
                        </button>
                        <button
                          className="btn"
                          onClick={() => deleteOrder(o.order_id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                  {orderDetails[o.order_id] && (
                    <tr>
                      <td colSpan="7" style={{ backgroundColor: "#f9f9f9", padding: "12px" }}>
                        <div style={{ marginLeft: 24 }}>
                          <strong>Articles de la commande:</strong>
                          <table style={{ marginTop: 8, width: "100%" }}>
                            <thead>
                              <tr>
                                <th>Produit ID</th>
                                <th>Quantité</th>
                                <th>Prix unitaire</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orderDetails[o.order_id].map((item, idx) => (
                                <tr key={idx}>
                                  <td>{item.product_id}</td>
                                  <td>{item.quantity}</td>
                                  <td>{Number(item.price_unit || 0).toFixed(2)} €</td>
                                  <td>
                                    {Number((item.quantity || 0) * (item.price_unit || 0)).toFixed(2)} €
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {o.address && (
                            <div style={{ marginTop: 8 }}>
                              <strong>Adresse:</strong> {o.address}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
