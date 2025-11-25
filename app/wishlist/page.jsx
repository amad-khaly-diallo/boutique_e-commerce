import React from 'react';
import "./wishlist.css";
import Link from 'next/link';

export default function Wishlist() {
    return (
        <main className="wishlist-container">

            {/* --- En-tête de page --- */}
            <h1 className="wishlist-title">Votre Wishlist</h1>

            {/* --- Bloc Vide --- */}
            <section className="wishlist-empty">
                <h2>Votre liste de souhaits est vide</h2>
                <p>
                    Explorez nos produits et ajoutez vos articles préférés pour les retrouver facilement plus tard.
                </p>
                <button className="btn-return">Retourner à la boutique</button>
            </section>

            {/* --- Produits populaires --- */}
            <section className="wishlist-popular">
                <h2>Articles populaires</h2>

                <div className="products-grid">

                    {/* --- Produit 1 --- */}
                    <Link href='/details-product' className="product-card">
                        <img 
                            src="/img/gucci.jpg" 
                            alt="Sac Gucci" 
                            className="product-image"
                            width={200} 
                            height={200}
                        />
                        <h3>Sac Gucci</h3>
                        <p className="price">€2650</p>
                        <button className="btn-add">Ajouter au panier</button>
                    </Link>

                    {/* --- Produit 2 --- */}
                    <Link href='/details-product' className="product-card">
                        <img 
                            src="/img/montre-patek-philippe-aquanaut-5261r-prix-avis.jpg" 
                            alt="Montre Patek Philippe"
                            className="product-image"
                            width={200} 
                            height={200}
                        />
                        <h3>Montre Patek Philippe</h3>
                        <p className="price">€5950</p>
                        <button className="btn-add">Ajouter au panier</button>
                    </Link>

                </div>
            </section>

        </main>
    );
}
