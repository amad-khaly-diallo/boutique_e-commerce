"use client";
import React, { useState } from 'react';
import { Heart } from 'lucide-react';

export default function ProductActions({ product }) {
    const [qty, setQty] = useState(1);
    const [fav, setFav] = useState(false);

    const increase = () => setQty((q) => Math.min(q + 1, product.stock || 99));
    const decrease = () => setQty((q) => Math.max(1, q - 1));

    const addToCart = () => {
        // placeholder: integrate with cart API or context
        alert(`Ajouté ${qty} × ${product.product_name} au panier`);
    };

    return (
        <div className="actions">
            <div className="quantity-box">
                <button className="minus" onClick={decrease} aria-label="Reduce quantity">−</button>
                <span className="number">{qty}</span>
                <button className="plus" onClick={increase} aria-label="Increase quantity">+</button>
            </div>

            <button className="buy" onClick={addToCart}>Acheter</button>

            <button className="favoris" onClick={() => setFav(!fav)} aria-pressed={fav} style={{ background: 'transparent', border: 'none' }}>
                <Heart fill={fav ? 'red' : 'none'} stroke={fav ? 'red' : 'currentColor'} />
            </button>
        </div>
    );
}
