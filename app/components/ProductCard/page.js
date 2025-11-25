'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, Star } from 'lucide-react';
import { useState } from 'react';
import styles from './productCard.module.css';

export function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    // TODO: Implémenter l'ajout au panier via API
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implémenter la vue rapide
  };

  if (!product) return null;

  // Calculer le rating (par défaut 4.5 si non défini)
  const rating = product.rating || 4.5;
  const reviews = product.reviews || 65;
  const currentPrice = parseFloat(product.price || 0);
  const originalPrice = product.original_price ? parseFloat(product.original_price) : null;
  const hasDiscount = originalPrice && originalPrice > currentPrice;

  // Rendre les étoiles
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
    <Link href={`/products/${product.product_id}`} className={styles.card}>
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
            <Heart className={styles.actionIcon} fill={isFavorite ? 'currentColor' : 'none'} size={18} />
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
        <button
          type="button"
          className={`${styles.addButton} ${isAdding ? styles.adding : ''}`}
          onClick={handleAddToCart}
          disabled={isAdding || product.stock === 0}
        >
          {isAdding ? 'Ajout...' : 'Ajouter au panier'}
        </button>
      </div>
    </Link>
  );

  
}

