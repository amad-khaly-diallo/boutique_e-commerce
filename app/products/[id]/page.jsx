'use client'
import "./details.css";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { useParams } from "next/navigation";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import LuxuryLoader from "@/app/components/LuxuryLoader/LuxuryLoader";
import { useLuxuryLoader } from "@/lib/useLuxuryLoader";
import { useToastContext } from "@/app/contexts/ToastContext";

export default function ProductsDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [favoris, setFavoris] = useState(false);
  const [error, setError] = useState("");
  const [sampleProducts, setSampleProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const showLoader = useLuxuryLoader(loading, 1000);
  const toast = useToastContext();
  const [isAdding, setIsAdding] = useState(false)

  const increase = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Charger l'état favoris depuis l'API
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const res = await fetch(`/api/favorites/check?productId=${id}`, {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        setFavoris(!!data.favorite);
      } catch (err) {
        console.error("Erreur récupération favoris :", err);
      }
    };
    if (id) {
      fetchFavoriteStatus();
    }
  }, [id]);

  const toggleFavoris = async () => {
    const previous = favoris;
    setFavoris(!previous);
    try {
      const res = await fetch("/api/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: Number(id) }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        toast.warning("Vous devez être connecté pour gérer vos favoris.");
        setFavoris(previous);
        return;
      }
      if (!res.ok) {
        toast.error(data.error || "Erreur lors de la mise à jour des favoris.");
        setFavoris(previous);
        return;
      }
      setFavoris(!!data.favorite);
    } catch (err) {
      console.error("Erreur favoris :", err);
      setFavoris(previous);
    }
  };

  // Fetch du produit principal
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products?id=${id}`);
        if (!res.ok) throw new Error("Produit non trouvé");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      }
    };
    if (id) {
      fetchProduct();
      // Le loader sera visible au minimum 1000ms grâce à useLuxuryLoader
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500); // Temps réel de chargement (peut être rapide)
      return () => clearTimeout(timer);
    }
  }, [id]);
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    try {
      const res = await fetch("/api/carts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: product.product_id,
          quantity: quantity
        })
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

      toast.success("Produit ajouté au panier !");
    } catch (error) {
      console.error("Erreur réseau :", error);
      toast.error("Impossible de contacter le serveur");
    } finally {
      setTimeout(() => setIsAdding(false), 1000);
    }
  };


  // Fetch produits similaires
  useEffect(() => {
    if (!product?.category) return;

    const fetchSampleProducts = async () => {
      try {
        const res = await fetch(
          `/api/products?category=${product.category}`,
        );
        if (!res.ok) throw new Error("Produits similaires non trouvés");
        const data = await res.json();
        setSampleProducts(data.data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchSampleProducts();
  }, [product]);

  if (error) return <p>{error}</p>;
  if (!product) return <p>Chargement du produit...</p>;

  // Fonction pour afficher les étoiles comme dans ProductCard
  const renderStars = () => {
    const rating = Number(product.note) || 0;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="star-full" fill="currentColor" size={18} />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="star-half" fill="currentColor" size={18} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="star-empty" size={18} />);
    }

    return stars;
  };

  return (
    <div className="container">
      {showLoader && <LuxuryLoader />}
      <div className="details-product">
        {/* Images à gauche */}
        <div className="product-images">
          <div className="thumbs">
            <div className="thumb">
              <Image src={product.image} alt="" width={90} height={90} />
            </div>
            <div className="thumb">
              <Image src={product.image} alt="" width={90} height={90} />
            </div>
            <div className="thumb">
              <Image src={product.image} alt="" width={90} height={90} />
            </div>
            <div className="thumb">
              <Image src={product.image} alt="" width={90} height={90} />
            </div>
          </div>

          <div className="main-image">
            <Image src={product.image} alt="" width={450} height={450} />
          </div>
        </div>

        {/* Infos produit */}
        <div className="product-info">
          <h1>{product.product_name}</h1>
          <div className="rating">
            {product.note != null ? (
              <div className="rating-stars">
                <div className="stars-container">
                  {renderStars()}
                </div>
                <span className="rating-value">{(Number(product.note) || 0).toFixed(1)}/5</span>
              </div>
            ) : (
              <span>Aucune note</span>
            )}
            <p style={{ color: "white", borderRadius: "5px", padding: "5px", backgroundColor: product.stock > 0 ? "green" : "red" }} className="stock">
              {product.stock > 0 ? "En stock" : "Rupture de stock"}
            </p>
          </div>
          <p className="price">{product.price}€</p>
          <p className="description">{product.description}</p>

          <div className="actions">
            <div className="quantity-box">
              <button className="minus" onClick={decrease}>
                −
              </button>
              <span className="number">{quantity}</span>
              <button className="plus" onClick={increase}>
                +
              </button>
            </div>

            <button onClick={handleAddToCart} className="buy">
              {isAdding ? "Ajout..." : "Ajouter au Panier"}
            </button>


            {/* FAVORIS */}
            <button
              type="button"
              className="favoris"
              onClick={toggleFavoris}
              style={{ cursor: "pointer", background: "none", border: "none" }}
            >
              <Heart
                fill={favoris ? "red" : "none"}
                stroke={favoris ? "red" : "currentColor"}
              />
            </button>
          </div>
        </div>
      </div>

      {/* PRODUITS ASSOCIÉS */}
      <h2 className="related-title">PRODUITS SIMILAIRES</h2>

      <div className="products-grid">
        {sampleProducts &&
          sampleProducts.map((p) => (
            <ProductCard key={p.product_id} product={p} />
          ))}
      </div>
    </div>
  );
}
