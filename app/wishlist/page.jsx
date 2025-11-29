import React from 'react';
import "./wishlist.css";
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import Golden from '../components/GoldenBotton/GoldenBotton';

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
                <Golden className="btn-return">Retourner à la boutique</Golden>
            </section>

            {/* --- Produits populaires --- */}
            <section className="wishlist-popular">
  <h2>Articles populaires</h2>

  <div className="products-grid">

    {/* Produit 1 */}
    <div className="product-card">

      <Link href="/details-product">
        <img src="/images/gucci_marmont.jpg" className="product-image" />
        <h3>Sac Gucci</h3>
      </Link>

      <p className="price">€2650</p>

      <Golden >
          <ShoppingCart className="addIcon" size={20} />
        Ajouter au panier
      </Golden>
    </div>

    {/* Produit 2 */}
    <div className="product-card">

      <Link href="/details-product">
        <img src="/images/patek_nautilus.png" className="product-image" />
        <h3>Montre Patek Philippe</h3>
      </Link>

      <p className="price">€5950</p>

      <Golden className="btn-add">
      <ShoppingCart className="addIcon" size={20} />
        Ajouter au panier
      </Golden>
    </div>

    {/* Produit 3 */}
    <div className="product-card">

      <Link href="/details-product">
        <img src="/images/breitling.png" className="product-image" />
        <h3>Air Jordan 1 Retro High</h3>
      </Link>

      <p className="price">€350</p>

      <Golden >
      <ShoppingCart className="addIcon" size={20} />
        Ajouter au panier
      </Golden>
    </div>

    {/* Produit 4 */}
    <div className="product-card">

      <Link href="/details-product">
        <img src="/images/cartier_love.png" className="product-image" />
        <h3>iPhone 14 Pro</h3>
      </Link>

      <p className="price">€1250</p>

      <Golden >
      <ShoppingCart className="addIcon" size={20} />
        Ajouter au panier
      </Golden>
    </div>

          {/* Produit 5 */}
    <div className="product-card">

      <Link href="/details-product">
        <img src="/images/chanel_gabrielle.png" className="product-image" />
        <h3>iPhone 14 Pro</h3>
      </Link>

      <p className="price">€1250</p>

      <Golden className="btn-add">
      <ShoppingCart className="addIcon" size={20} />
        Ajouter au panier
      </Golden>
    </div>

      {/* Produit 6 */}
    <div className="product-card">

      <Link href="/details-product">
        <img src="/images/dior_book_tote.jpeg" className="product-image" />
        <h3>iPhone 14 Pro</h3>
      </Link>

      <p className="price">€1250</p>

      <Golden >
      <ShoppingCart className="addIcon" size={20} />
        Ajouter au panier
      </Golden>
    </div>

      {/* Produit 7 */}
    <div className="product-card">

      <Link href="/details-product">
        <img src="/images/bulgari_bzero1.png" className="product-image" />
        <h3>iPhone 14 Pro</h3>
      </Link>

      <p className="price">€1250</p>

      <Golden >
      <ShoppingCart className="addIcon" size={20} />
        Ajouter au panier
      </Golden>
    </div>

      {/* Produit 8 */}
    <div className="product-card">

      <Link href="/details-product">
        <img src="/images/balenciaga_hourglass.png" className="product-image" />
        <h3>iPhone 14 Pro</h3>
      </Link>

      <p className="price">€1250</p>

      <Golden >
      <ShoppingCart className="addIcon" size={20} />
        Ajouter au panier
      </Golden>
    </div>
    



  </div>
</section>


        </main>
    );
}
