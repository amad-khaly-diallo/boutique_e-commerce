'use client'
import './details.css';
import React from 'react';
import Image from 'next/image';
import { Heart, Star } from 'lucide-react';
import { useState } from "react";
import { ProductCard } from '../components/ProductCard/productCard';

export default function ProductsDetail() {
    const [favoris, setFavoris] = useState(false);

    const sampleProducts = [
        {
            product_id: 1,
            product_name: 'Montre Chanel Premium',
            description: 'Montre de luxe avec bracelet en chaîne dorée et cadran noir élégant',
            price: 960,
            original_price: 1160,
            stock: 5,
            category: 'Montres',
            rating: 4.5,
            reviews: 65,
            image: '/img/img-1.png',
        },
        {
            product_id: 2,
            product_name: 'Sac à Main Cuir',
            description: 'Sac à main en cuir véritable avec finition premium',
            price: 450,
            original_price: 599,
            stock: 12,
            category: 'Accessoires',
            rating: 4.8,
            reviews: 128,
            image: '/img/img-2.png',
        },
        {
            product_id: 3,
            product_name: 'Parfum Exclusif',
            description: 'Parfum de luxe avec notes florales et boisées',
            price: 120,
            original_price: null,
            stock: 20,
            category: 'Parfums',
            rating: 4.2,
            reviews: 43,
            image: '/img/img-3.png',
        },
        {
            product_id: 4,
            product_name: 'Bracelet Diamant',
            description: 'Bracelet en or blanc avec diamants sertis',
            price: 2500,
            original_price: 3200,
            stock: 3,
            category: 'Bijoux',
            rating: 5.0,
            reviews: 25,
            image: '/img/img-4.png',
        },
        {
            product_id: 5,
            product_name: ' Sac Diore',
            description: 'Sac à main en cuir véritable avec finition premium',
            price: 2500,
            original_price: 3200,
            stock: 3,
            category: 'Sac',
            rating: 5.0,
            reviews: 25,
            image: '/img/img-5.png',
        },

    ];

    const toggleFavoris = () => {
        setFavoris(!favoris);
    };
    return (
        <div className="container">
            <div className="details-product">

                {/* Images à gauche */}
                <div className="product-images">
                    <div className="thumbs">
                        <Image src="/img/Montre-Luxe-Occasion-Rolex-Submariner-bleu-or-acier.jpg" alt="" width={90} height={90} />
                        <Image src="/img/montre-omega-de-ville-prestige-.jpg" alt="" width={90} height={90} />
                        <Image src="/img/montre-patek-philippe-aquanaut-5261r-prix-avis.jpg" alt="" width={90} height={90} />
                        <Image src="/img/tag-Heuer.jpg" alt="" width={90} height={90} />
                    </div>

                    <div className="main-image">
                        <Image src="/img/img-3-removebg-preview.png" alt="" width={450} height={450} />
                    </div>
                </div>

                {/* Infos produit */}
                <div className="product-info">
                    <h1>ROLEX</h1>

                    <div className="rating">
                        ⭐⭐⭐⭐⭐ <span>(150 reviews)</span>
                        <p className="stock">In stock</p>
                    </div>

                    <p className="price">1998.67€</p>

                    <p className="description">
                        Montre plongée iconique, boîtier acier, mouvement automatique.
                    </p>


                    <div className="actions">
                        <div className="quantity-box">
                            <button className="minus">−</button>
                            <span className="number">1</span>
                            <button className="plus">+</button>
                        </div>
                        <button className="buy">Acheter</button>
                        <a className="favoris" onClick={toggleFavoris} style={{ cursor: "pointer" }}>
                            <Heart fill={favoris ? "red" : "none"} stroke={favoris ? "red" : "currentColor"} />
                        </a>
                    </div>

                </div>
            </div>

            {/* PRODUITS ASSOCIÉS */}
            <h2 className="related-title">PRODUITS SIMILAIRES</h2>

            <div className="products-grid">
                {sampleProducts.map((product) => (
                    <ProductCard key={product.product_id} product={product} />
                ))}
            </div>

        </div>
    );
}
