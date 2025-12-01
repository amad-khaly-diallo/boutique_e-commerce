'use client'
import './details.css';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useParams } from 'next/navigation';
import { ProductCard } from '../../components/ProductCard/ProductCard';

export default function ProductsDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [favoris, setFavoris] = useState(false);
    const [error, setError] = useState('');
    const [sampleProducts, setSampleProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);

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

    //  Charger favoris depuis localStorage
    useEffect(() => {
        const saved = localStorage.getItem(`favoris_${id}`);
        if (saved) {
            setFavoris(JSON.parse(saved));
        }
    }, [id]);

    //  Sauvegarde toggle favoris
    const toggleFavoris = () => {
        const newValue = !favoris;
        setFavoris(newValue);
        localStorage.setItem(`favoris_${id}`, JSON.stringify(newValue));
    };

    

    //  Fetch du produit principal
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) throw new Error('Produit non trouvé');
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchProduct();
    }, [id]);

    //  Fetch produits similaires
    useEffect(() => {
        if (!product?.category) return;

        const fetchSampleProducts = async () => {
            try {
                const res = await fetch(`/api/products?category=${product.category}`);
                if (!res.ok) throw new Error('Produits similaires non trouvés');
                const data = await res.json();
                setSampleProducts(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchSampleProducts();
    }, [product]);

    if (error) return <p>{error}</p>;
    if (!product) return <p>Chargement du produit...</p>;

    return (
        <div className="container">
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
                        ⭐⭐⭐⭐⭐ <span>{product.reviews || 150} reviews</span>
                        <p className="stock">{product.stock > 0 ? "En stock" : "Rupture de stock"}</p>
                    </div>
                    <p className="price">{product.price}€</p>
                    <p className="description">{product.description}</p>

                    <div className="actions">
                        <div className="quantity-box">
                            <button className="minus" onClick={decrease}>−</button>
                            <span className="number">{quantity}</span>
                            <button className="plus" onClick={increase}>+</button>
                        </div>

                        <button className="buy">Ajouter au Panier</button>

                        {/* FAVORIS */}
                        <a className="favoris" onClick={toggleFavoris} style={{ cursor: "pointer" }}>
                            <Heart
                                fill={favoris ? "red" : "none"}
                                stroke={favoris ? "red" : "currentColor"}
                            />
                        </a>
                    </div>
                </div>
            </div>

            {/* PRODUITS ASSOCIÉS */}
            <h2 className="related-title">PRODUITS SIMILAIRES</h2>

            <div className="products-grid">
                {sampleProducts &&
                    sampleProducts.map((product) => (
                        <ProductCard key={product.product_id} product={product} />
                    ))
                }
            </div>
        </div>
    );
}
