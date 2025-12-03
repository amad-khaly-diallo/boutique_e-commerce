"use client";
import React, { useEffect, useState } from "react";
import "../admin.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState({ product_name: "", price: "", stock: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products?limit=200", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (res.ok && Array.isArray(data.data)) {
          setProducts(data.data);
        } else if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  function startEdit(p) {
    setEditing(p.product_id);
    setValues({
      product_name: p.product_name,
      price: String(p.price ?? ""),
      stock: String(p.stock ?? 0),
    });
  }

  async function saveEdit(e) {
    e.preventDefault();
    if (!editing) return;
    try {
      const payload = {
        product_name: values.product_name,
        price: Number(values.price) || 0,
        stock: Number(values.stock) || 0,
      };
      const res = await fetch(`/api/products/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(body.error || "Erreur lors de la mise à jour du produit");
        return;
      }
      setProducts((prev) =>
        prev.map((p) => (p.product_id === editing ? body : p)),
      );
      setEditing(null);
      setValues({ product_name: "", price: "", stock: "" });
    } catch (err) {
      console.error(err);
      alert("Impossible de mettre à jour le produit.");
    }
  }

  async function removeProduct(id) {
    if (!confirm("Supprimer ce produit ?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(body.error || "Erreur lors de la suppression");
        return;
      }
      setProducts((prev) => prev.filter((p) => p.product_id !== id));
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer le produit.");
    }
  }

  async function addProduct(e) {
    e.preventDefault();
    if (!values.product_name) return;
    try {
      const payload = {
        product_name: values.product_name,
        description: "Produit ajouté depuis l'admin.",
        price: Number(values.price) || 0,
        stock: Number(values.stock) || 0,
        category: "Montre",
        image: null,
        note: null,
      };
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(body.error || "Erreur lors de la création du produit");
        return;
      }
      setProducts((prev) => [body, ...prev]);
      setValues({ product_name: "", price: "", stock: "" });
    } catch (err) {
      console.error(err);
      alert("Impossible de créer le produit.");
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Produits</h2>
      <div style={{ display: "flex", gap: 12, margin: "12px 0 18px 0" }}>
        <form onSubmit={addProduct} style={{ display: "flex", gap: 8 }}>
          <input
            placeholder="Nom"
            value={values.product_name}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, product_name: e.target.value }))
            }
          />
          <input
            placeholder="Prix (ex: 99.00)"
            value={values.price}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, price: e.target.value }))
            }
          />
          <input
            placeholder="Stock"
            value={values.stock}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, stock: e.target.value }))
            }
          />
          <button className="btn btn-primary" type="submit">
            Ajouter
          </button>
        </form>
      </div>

      <div className="panel">
        {loading ? (
          <div className="small">Chargement…</div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {products.map((p) => (
              <div key={p.product_id} className="product-item">
                {editing === p.product_id ? (
                  <form
                    style={{ display: "flex", gap: 8, width: "100%" }}
                    onSubmit={saveEdit}
                  >
                    <input
                      value={values.product_name}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          product_name: e.target.value,
                        }))
                      }
                    />
                    <input
                      value={values.price}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                    />
                    <input
                      value={values.stock}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          stock: e.target.value,
                        }))
                      }
                    />
                    <div
                      style={{
                        marginLeft: "auto",
                        display: "flex",
                        gap: 6,
                      }}
                    >
                      <button
                        className="btn btn-plain"
                        type="button"
                        onClick={() => setEditing(null)}
                      >
                        Annuler
                      </button>
                      <button className="btn btn-primary" type="submit">
                        Enregistrer
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div>
                      <div style={{ fontWeight: 700 }}>
                        {p.product_name}
                      </div>
                      <div className="meta">
                        {Number(p.price || 0).toFixed(2)} € • Stock:{" "}
                        {p.stock}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        className="btn btn-plain"
                        onClick={() => startEdit(p)}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn"
                        onClick={() => removeProduct(p.product_id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
