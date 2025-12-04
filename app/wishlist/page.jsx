'use client';
import React, { useEffect, useState } from 'react';
import "./wishlist.css";
import Link from 'next/link';
import Golden from '../components/GoldenBotton/GoldenBotton';
import LuxuryLoader from "@/app/components/LuxuryLoader/LuxuryLoader";
import { ProductCard } from "@/app/components/ProductCard/ProductCard";


export default function Wishlist() {
  const [luxeLoading, setluxeLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/favorites');
      const data = await response.json();
      setWishlist(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error.message);
    } finally {
      setluxeLoading(false);
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
          prevWishlist.filter((item) => item.id !== productId)
        );
        fetchWishlist();
      } else {
        alert('Failed to remove item from wishlist');
      }
    } catch (error) {
      console.error('Error removing item from wishlist:', error.message);
    }
  };

  // notification pour ajout ou retrait
 



  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <main className="wishlist-container">
      {luxeLoading && <LuxuryLoader />}

      <h1 className="wishlist-title">Votre Wishlist</h1>

      {wishlist.length === 0 && !luxeLoading && (
        <section className="wishlist-empty">
          <h2>Votre liste de souhaits est vide</h2>
          <p>Explorez nos produits et ajoutez vos articles préférés pour les retrouver facilement plus tard.</p>
          <Golden className="btn-return" onClick={() => (window.location.href = "/")}>
            Retourner à la boutique</Golden>
        </section>
      )}

     {wishlist.length > 0 && !luxeLoading && (
  <section className="wishlist-items">
    {wishlist.map((item) => (
      <div className="wishlist-item" key={item.id}>
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
