'use client';
import React, { useEffect, useState } from 'react';
import "./wishlist.css";
import Link from 'next/link';
import Golden from '../components/GoldenBotton/GoldenBotton';
import LuxuryLoader from "@/app/components/LuxuryLoader/LuxuryLoader";

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
          <Golden className="btn-return">Retourner à la boutique</Golden>
        </section>
      )}

      {wishlist.length > 0 && !luxeLoading && (
        <section className="wishlist-items">
          {wishlist.map((item) => (
            <li key={item.favorite_id} className="wishlist-item">
              <img src={item.image} alt={item.product_name} className="wishlist-item-image" />
              <div className="wishlist-item-info">
                <h3>{item.product_name}</h3>
                <p>{item.description}</p>
                <p>Prix : {item.price} €</p>
                <Link href={`/products/${item.product_id}`} className="btn-details">
                  <Golden>Ajouter au panier</Golden>
                </Link>
              </div>
            </li>
          ))}
        </section>
      )}
    </main>
  );
}
