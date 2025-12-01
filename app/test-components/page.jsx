"use client";
import { useState, useEffect } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 12;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?page=${page}&limit=${limit}`);
        const json = await res.json();

        if (!isMounted) return;

        setProducts(Array.isArray(json.data) ? json.data : []);
        setTotal(typeof json.total === "number" ? json.total : 0);
      } catch (err) {
        console.error("Erreur fetch produits:", err);
        if (isMounted) {
          setProducts([]);
          setTotal(0);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [page]);

  return (
    <div>
      <h1>Produits</h1>

      <div className="grid">
        {loading ? (
          <p>Chargement...</p>
        ) : products.length > 0 ? (
          products.map((p) => (
            <div key={p.product_id}>
              <h3>{p.product_name}</h3>
              <p>{p.price} €</p>
            </div>
          ))
        ) : (
          <p>Aucun produit disponible.</p>
        )}
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px", alignItems: "center" }}>
        <button
          disabled={page <= 1 || loading}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Précédent
        </button>

        <span>
          Page {page} / {totalPages || 1}
        </span>

        <button
          disabled={page >= totalPages || loading}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
