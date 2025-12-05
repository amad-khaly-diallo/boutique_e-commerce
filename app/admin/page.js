"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./admin.css";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          fetch("/api/orders", { cache: "no-store" }),
          fetch("/api/products?limit=100", { cache: "no-store" }),
          fetch("/api/users", { cache: "no-store" }),
        ]);

        const ordersData = await ordersRes.json().catch(() => []);
        const productsData = await productsRes.json().catch(() => ({}));
        const usersData = await usersRes.json().catch(() => []);

        setOrders(Array.isArray(ordersData) ? ordersData : []);

        if (Array.isArray(productsData.data)) {
          setProducts(productsData.data);
        } else if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          setProducts([]);
        }

        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        console.error(err);
        setOrders([]);
        setProducts([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const totalStock = products.reduce((s, p) => s + (Number(p.stock) || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const totalSales = orders.reduce(
    (s, o) => s + Number(o.total_amount || 0),
    0
  );

  function exportCSV(rows, columns, filename = "export.csv") {
    const header = columns.join(",");
    const body = rows
      .map((r) =>
        columns
          .map((c) => `"${(r[c] ?? "").toString().replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const csv = header + "\n" + body;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function exportProducts() {
    exportCSV(
      products,
      ["product_id", "product_name", "price", "stock", "category"],
      "products.csv"
    );
  }

  function exportOrders() {
    exportCSV(
      orders,
      ["order_id", "user_id", "total_amount", "status", "created_at"],
      "orders.csv"
    );
  }

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="brand">Boutique Admin</div>
        <nav className="side-nav">
          <Link href="/admin" className="active">
            Tableau de bord
          </Link>
          <Link href="/admin/orders">Commandes</Link>
          <Link href="/admin/products">Produits</Link>
          <Link href="/admin/users">Clients</Link>
          <Link href="/admin/settings">Paramètres</Link>
        </nav>

        <div style={{ marginTop: "1.25rem" }} className="small">
          Connecté en tant qu&apos;administrateur
        </div>
      </aside>

      <main className="admin-main">
        <div className="topbar">
          <h1>Tableau de bord</h1>

          <div className="controls">
            <input className="search-input" placeholder="Rechercher..." />

            <Link
              href="/admin/orders"
              className="btn btn-primary manage-orders"
            >
              Gérer les commandes
            </Link>
          </div>
        </div>

        <div className="grid-3">
          <div className="card">
            <h3>Ventes totales</h3>
            <div className="value">
              {totalSales.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </div>
            <div className="small">
              Basé sur toutes les commandes en base de données
            </div>
          </div>

          <div className="card">
            <h3>Nouvelles commandes</h3>
            <div className="value">{loading ? "…" : pendingOrders}</div>
            <div className="small">Commandes en statut &quot;pending&quot;</div>
          </div>

          <div className="card">
            <h3>Produits en stock</h3>
            <div className="value">{totalStock}</div>
            <div className="small">Stock global de la table Product</div>
          </div>
        </div>

        <div className="layout-columns">
          <section className="panel">
            <h3 id="orders">Commandes récentes</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Commande</th>
                  <th>Client</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.order_id}>
                    <td>#{o.order_id}</td>
                    <td>
                      {o.first_name || o.last_name
                        ? `${o.first_name || ""} ${o.last_name || ""}`.trim()
                        : `ID: ${o.user_id}`}
                    </td>
                    <td>{Number(o.total_amount || 0).toFixed(2)} €</td>
                    <td>
                      {o.created_at
                        ? new Date(o.created_at).toLocaleDateString("fr-FR")
                        : o.created_at}
                    </td>
                    <td>
                      <span
                        className={`status ${
                          o.status === "pending" ? "pending" : "shipped"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <aside className="panel" id="products">
            <h3>Produits récents</h3>
            <div className="product-list">
              {products.slice(0, 5).map((p) => (
                <div className="product-item" key={p.product_id}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{p.product_name}</div>
                    <div className="meta">
                      {Number(p.price || 0).toFixed(2)} € • Stock: {p.stock}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
          <Link
            href="/admin/products"
            className="btn-admin-manage"
            style={{ marginTop: "1rem" }}
          >
            Gérer les produits
          </Link>
        </div>

        <div style={{ marginTop: "1rem" }} className="panel" id="users">
          <h3>Utilisateurs récents</h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {users.slice(0, 5).map((u) => (
              <div
                key={u.user_id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem",
                  background: "#fff",
                  borderRadius: 6,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {u.first_name} {u.last_name}
                  </div>
                  <div className="small">{u.email}</div>
                </div>
                <div className="small">ID: {u.user_id}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
