'use client'
import './details.css';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useParams } from 'next/navigation';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import LuxuryLoader from '@/app/components/LuxuryLoader/LuxuryLoader';

export default function ProductsDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [favoris, setFavoris] = useState(false);
    const [error, setError] = useState('');
    const [sampleProducts, setSampleProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    // Fetch du produit principal
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products?id=${id}`);
                if (!res.ok) throw new Error('Produit non trouvé');
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchProduct();
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [id]);

    // Fetch des produits similaires **après que le produit soit chargé**
    useEffect(() => {
        if (!product?.category) return;

        const fetchSampleProducts = async () => {
            try {
                const res = await fetch(`/api/products?category=${product.category}`);
                if (!res.ok) throw new Error('Produits similaires non trouvés');
                const data = await res.json();
                setSampleProducts(data.data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchSampleProducts();
    }, [product]);

    const toggleFavoris = () => setFavoris(!favoris);

    if (error) return <p>{error}</p>;
    if (!product) return <p>Chargement du produit...</p>;

    return (
        <div className="container">
            {loading && <LuxuryLoader />}
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
                        <Image src={product.image} alt="" width={450} height={450} />
                    </div>
                </div>

                {/* Infos produit */}
                <div className="product-info">
                    <h1>{product.product_name}</h1>
                    <div className="rating">
                        ⭐⭐⭐⭐⭐ <span>({product.reviews || 150} reviews)</span>
                        <p className="stock">{product.stock > 0 ? "En stock" : "Rupture de stock"}</p>
                    </div>
                    <p className="price">{product.price}€</p>
                    <p className="description">{product.description}</p>

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
                {
                    sampleProducts && (
                        sampleProducts.map((product) => (
                            <ProductCard key={product.product_id} product={product} />
                        )))
                }
            </div>

        </div>
    );
}
