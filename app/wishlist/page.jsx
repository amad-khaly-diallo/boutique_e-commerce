'use client';
import React, { useEffect, useState } from 'react';
import "./wishlist.css";
import Link from 'next/link';
import Golden from '../components/GoldenBotton/GoldenBotton';
import LuxuryLoader from "@/app/components/LuxuryLoader/LuxuryLoader";
import { ProductCard } from "@/app/components/ProductCard/ProductCard";
import { useLuxuryLoader } from "@/lib/useLuxuryLoader";


export default function Wishlist() {
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const showLoader = useLuxuryLoader(loading, 1000);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/favorites');
      const data = await response.json();
      setWishlist(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error.message);
    } finally {
      // Le loader sera visible au minimum 1000ms grâce à useLuxuryLoader
      setTimeout(() => setLoading(false), 500); // Temps réel de chargement (peut être rapide)
    }
  };
  // retire au favorits
  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(`/api/favorites/toggle`, {
        method: 'POST',
        body: JSON.stringify({ productId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setWishlist((prevWishlist) =>
          prevWishlist.filter((item) => item.product_id !== productId)
        );
        fetchWishlist();
      } else {
        alert('Failed to remove item from wishlist');
      }
    } catch (error) {
      console.error('Error removing item from wishlist:', error.message);
    }
  };


  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <main className="wishlist-container">
      {showLoader && <LuxuryLoader />}

      <h1 className="wishlist-title">Votre Wishlist</h1>

      {wishlist.length === 0 && !showLoader && (
        <section className="wishlist-empty">
          <h2>Votre liste de souhaits est vide</h2>
          <p>Explorez nos produits et ajoutez vos articles préférés pour les retrouver facilement plus tard.</p>
          <Golden className="btn-return" onClick={() => (window.location.href = "/")}>
            Retourner à la boutique</Golden>
        </section>
      )}

     {wishlist.length > 0 && !showLoader && (
  <section className="wishlist-items">
    {wishlist.map((item) => (
      <div className="wishlist-item" key={item.product_id}>
        <ProductCard product={item} />
        <button
          className="remove-btn"
          onClick={() => removeFromWishlist(item.product_id)}
        >
          Retirer des favoris
        </button>
      </div>
    ))}
  </section>
)}

    </main>
  );
}
