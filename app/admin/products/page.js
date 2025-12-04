"use client";
import React, { useEffect, useState } from "react";
import "../admin.css";

const CATEGORIES = ["Montre", "Sac", "Bijoux"];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState({ 
    product_name: "", 
    description: "",
    price: "", 
    stock: "",
    category: "Montre",
    image: "",
    note: ""
  });
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
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
      product_name: p.product_name || "",
      description: p.description || "",
      price: String(p.price ?? ""),
      stock: String(p.stock ?? 0),
      category: p.category || "Montre",
      image: p.image || "",
      note: p.note ? String(p.note) : "",
    });
    setPreviewImage(p.image || null);
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image");
      return;
    }

    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image est trop volumineuse (max 5MB)");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Erreur lors de l'upload de l'image");
        setUploading(false);
        return;
      }

      // Mettre à jour le chemin de l'image
      setValues((prev) => ({ ...prev, image: data.path }));
      setPreviewImage(data.path);
      alert("Image uploadée avec succès !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'upload de l'image");
    } finally {
      setUploading(false);
    }
  }

  async function saveEdit(e) {
    e.preventDefault();
    if (!editing) return;
    try {
      const payload = {
        product_name: values.product_name,
        description: values.description,
        price: Number(values.price) || 0,
        stock: Number(values.stock) || 0,
        category: values.category,
        image: values.image || null,
        note: values.note ? Number(values.note) : null,
      };
      const res = await fetch(`/api/products/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      setValues({ product_name: "", description: "", price: "", stock: "", category: "Montre", image: "", note: "" });
      setPreviewImage(null);
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
    if (!values.product_name || !values.description) {
      alert("Le nom et la description sont requis");
      return;
    }
    try {
      const payload = {
        product_name: values.product_name,
        description: values.description,
        price: Number(values.price) || 0,
        stock: Number(values.stock) || 0,
        category: values.category,
        image: values.image || null,
        note: values.note ? Number(values.note) : null,
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
      setValues({ product_name: "", description: "", price: "", stock: "", category: "Montre", image: "", note: "" });
      setPreviewImage(null);
    } catch (err) {
      console.error(err);
      alert("Impossible de créer le produit.");
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Gestion des Produits</h2>
      
      <div style={{ margin: "12px 0 18px 0" }} className="small">
        {loading ? "Chargement…" : `${products.length} produits`}
      </div>

      <div className="panel" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Ajouter un produit</h3>
        <form onSubmit={addProduct} style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <input
            placeholder="Nom du produit *"
            value={values.product_name}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, product_name: e.target.value }))
            }
            required
          />
          <textarea
            placeholder="Description *"
            value={values.description}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, description: e.target.value }))
            }
            required
            style={{ gridColumn: "1 / -1", minHeight: 60 }}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Prix *"
            value={values.price}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, price: e.target.value }))
            }
            required
          />
          <input
            type="number"
            placeholder="Stock *"
            value={values.stock}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, stock: e.target.value }))
            }
            required
          />
          <select
            value={values.category}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, category: e.target.value }))
            }
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
              Image du produit
            </label>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={uploading}
                style={{ flex: 1 }}
              />
              {uploading && <span className="small">Upload en cours...</span>}
            </div>
            {previewImage && (
              <div style={{ marginTop: 12 }}>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ maxWidth: 200, maxHeight: 200, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    setValues((prev) => ({ ...prev, image: "" }));
                  }}
                  style={{ marginLeft: 8, padding: "4px 8px", fontSize: "0.85rem" }}
                >
                  Supprimer
                </button>
              </div>
            )}
            <input
              type="text"
              placeholder="Ou entrer le chemin manuellement"
              value={values.image}
              onChange={(e) => {
                setValues((prev) => ({ ...prev, image: e.target.value }));
                setPreviewImage(e.target.value || null);
              }}
              style={{ marginTop: 8 }}
            />
          </div>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            placeholder="Note (0-5)"
            value={values.note}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, note: e.target.value }))
            }
          />
          <button className="btn btn-primary" type="submit" style={{ gridColumn: "1 / -1" }}>
            Ajouter le produit
          </button>
        </form>
      </div>

      <div className="panel">
        {loading ? (
          <div className="small">Chargement…</div>
        ) : products.length === 0 ? (
          <div className="small">Aucun produit</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Description</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Catégorie</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.product_id}>
                  {editing === p.product_id ? (
                    <>
                      <td>{p.product_id}</td>
                      <td colSpan="6">
                        <form onSubmit={saveEdit} style={{ display: "grid", gap: 8, gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr" }}>
                          <input
                            value={values.product_name}
                            onChange={(e) =>
                              setValues((prev) => ({ ...prev, product_name: e.target.value }))
                            }
                            placeholder="Nom"
                            required
                          />
                          <input
                            value={values.description}
                            onChange={(e) =>
                              setValues((prev) => ({ ...prev, description: e.target.value }))
                            }
                            placeholder="Description"
                            required
                          />
                          <input
                            type="number"
                            step="0.01"
                            value={values.price}
                            onChange={(e) =>
                              setValues((prev) => ({ ...prev, price: e.target.value }))
                            }
                            placeholder="Prix"
                            required
                          />
                          <input
                            type="number"
                            value={values.stock}
                            onChange={(e) =>
                              setValues((prev) => ({ ...prev, stock: e.target.value }))
                            }
                            placeholder="Stock"
                            required
                          />
                          <select
                            value={values.category}
                            onChange={(e) =>
                              setValues((prev) => ({ ...prev, category: e.target.value }))
                            }
                          >
                            {CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          <input
                            type="number"
                            step="0.1"
                            value={values.note}
                            onChange={(e) =>
                              setValues((prev) => ({ ...prev, note: e.target.value }))
                            }
                            placeholder="Note"
                          />
                          <div style={{ gridColumn: "1 / -1" }}>
                            <label style={{ display: "block", marginBottom: 4, fontSize: "0.9rem" }}>Image</label>
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              onChange={handleImageUpload}
                              disabled={uploading}
                              style={{ width: "100%" }}
                            />
                            {previewImage && (
                              <div style={{ marginTop: 8 }}>
                                <img
                                  src={previewImage}
                                  alt="Preview"
                                  style={{ maxWidth: 150, maxHeight: 150, objectFit: "cover", borderRadius: 4 }}
                                />
                              </div>
                            )}
                            <input
                              type="text"
                              placeholder="Chemin image"
                              value={values.image}
                              onChange={(e) => {
                                setValues((prev) => ({ ...prev, image: e.target.value }));
                                setPreviewImage(e.target.value || null);
                              }}
                              style={{ marginTop: 8, width: "100%" }}
                            />
                          </div>
                          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 6 }}>
                            <button className="btn btn-primary" type="submit">
                              Enregistrer
                            </button>
                            <button
                              className="btn btn-plain"
                              type="button"
                              onClick={() => setEditing(null)}
                            >
                              Annuler
                            </button>
                          </div>
                        </form>
                      </td>
                      <td></td>
                    </>
                  ) : (
                    <>
                      <td>{p.product_id}</td>
                      <td>{p.product_name}</td>
                      <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.description}
                      </td>
                      <td>{Number(p.price || 0).toFixed(2)} €</td>
                      <td>{p.stock}</td>
                      <td>{p.category}</td>
                      <td>{p.note || "-"}</td>
                      <td>
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
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
