'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, Star, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './productCard.module.css';
import Golden from '../GoldenBotton/GoldenBotton';
import { useToastContext } from '@/app/contexts/ToastContext';

export function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const toast = useToastContext();
  const [notification, setNotification] = useState(null); // { message, type }

useEffect(() => {
  const fetchFavoriteStatus = async () => {
    try {
      const res = await fetch(`/api/favorites/check?productId=${product.product_id}`, {
        credentials: "include"
      });

      if (!res.ok) return;

      const data = await res.json();

      setIsFavorite(data.favorite);
    } catch (err) {
      console.error("Erreur récupération favoris :", err);
    }
  };

  fetchFavoriteStatus();
}, [product.product_id]);


  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    try {
      const res = await fetch("/api/carts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          productId: product.product_id,
          quantity: 1
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        toast.warning("Vous devez être connecté pour ajouter au panier");
        return;
      }

      if (!res.ok) {
        toast.error(data.error || "Erreur lors de l'ajout au panier");
        return;
      }

      toast.success("Produit ajouté au panier avec succès");

    } catch (error) {
      console.error("Erreur réseau :", error);
      toast.error("Impossible de contacter le serveur");
    } finally {
      setTimeout(()=>setIsAdding(false), 1000);
    }
  };


const handleToggleFavorite = async (e) => {
  e.preventDefault();
  e.stopPropagation();

  const previousState = isFavorite; 

  setIsFavorite(!isFavorite); 

  try {
    const res = await fetch("/api/favorites/toggle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        productId: product.product_id,
      })
    });

    const data = await res.json();

    // Pas connecté
    if (res.status === 401) {
      toast.warning("Vous devez être connecté pour ajouter aux favoris");
      setIsFavorite(previousState);
      return;
    }

    // Erreur serveur
    if (!res.ok) {
      toast.error(data.error || "Erreur lors de la mise à jour des favoris");
      setIsFavorite(previousState);
      return;
    }
    setIsFavorite(data.favorite);

    // Afficher notification au lieu d'alert
    setNotification({
      message: `Produit ${data.favorite ? 'ajouté' : 'retiré'} des favoris`,
      type: data.favorite ? 'success' : 'info'
    });
    // auto-hide
    setTimeout(() => setNotification(null), 3000);

    console.log(data)

  } catch (error) {
    console.error("Erreur réseau :", error);
    setIsFavorite(previousState);
  }
};


  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (!product) return null;
  const rating = product.note || 0;
  const reviews = rating; 
  const currentPrice = parseFloat(product.price || 0);
  const originalPrice = product.original_price ? parseFloat(product.original_price) : null;
  const hasDiscount = originalPrice && originalPrice > currentPrice;


  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className={styles.starFull} fill="currentColor" size={16} />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className={styles.starHalf} fill="currentColor" size={16} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className={styles.starEmpty} size={16} />);
    }

    return stars;
  };

  return (
    <Link href={`/products/${product.product_id}`} className={styles.card} style={{ position: 'relative' }}>
      {/* Notification toast */}
      {notification && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 18, 
            backgroundColor: notification.type === 'success' ? 'rgba(34,197,94,0.95)' : 'rgba(248, 22, 22, 0.95)',
            color: '#fff',
            padding: '6px 10px',
            borderRadius: 6,
            fontSize: 12,
            zIndex: 50,
            pointerEvents: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          {notification.message}
        </div>
      )}

      <div className={styles.imageWrapper}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.product_name}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className={styles.placeholderImage}>
            <span>Image</span>
          </div>
        )}

        {/* Icônes d'action en haut à droite */}
        <div className={styles.actionIcons}>
          <button
            type="button"
            className={`${styles.actionButton} ${isFavorite ? styles.favoriteActive : ''}`}
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart className={styles.actionIcon} key={product.product_id} fill={isFavorite ? 'currentColor' : 'none'} size={18} />
          </button>
          <button
            type="button"
            className={styles.actionButton}
            onClick={handleQuickView}
            aria-label="Vue rapide"
          >
            <Eye className={styles.actionIcon} size={18} />
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{product.product_name || 'Nom du produit'}</h3>

        {/* Prix */}
        <div className={styles.priceContainer}>
          <span className={styles.currentPrice}>{currentPrice.toFixed(0)}€</span>
          {hasDiscount && (
            <span className={styles.originalPrice}>{originalPrice.toFixed(0)}€</span>
          )}
        </div>

        {/* Rating */}
        <div className={styles.ratingContainer}>
          <div className={styles.stars}>
            {renderStars()}
          </div>
          <span className={styles.reviewsCount}>({reviews})</span>
        </div>

        {/* Bouton Add to Cart */}
        <Golden
          type="button"
          className={`${styles.addButton} ${isAdding ? styles.adding : ''}`}
          onClick={handleAddToCart}
          disabled={isAdding || product.stock === 0}
        >
          <ShoppingCart className={styles.addIcon} size={20} />

          {isAdding ? 'Ajout...' : 'Ajouter au panier'}
        </Golden>
      </div>
    </Link>
  );


}

