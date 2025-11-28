import Image from 'next/image';
import { ProductCard } from '../../components/ProductCard/productCard';
import DetailsClient from './DetailsClient';
import ProductActions from '../../components/ProductActions/client';

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

async function fetchProduct(id) {
    try {
        // fetch on server; relative URL works from server components
        const res = await fetch(`/api/products?id=${id}`, { next: { revalidate: 60 } });
        if (!res.ok) throw new Error('API fetch failed');
        const data = await res.json();
        return data;
    } catch (err) {
        // fallback to sampleProducts when API fails
        const found = sampleProducts.find((p) => String(p.product_id) === String(id));
        return found || sampleProducts[0];
    }
}

export default async function ProductsDetail({ params }) {
    const { id } = params;
    const product = await fetchProduct(id);

    return (
        <DetailsClient>
            <div className="container">
                <div className="details-product">
                    <div className="product-images">
                        <div className="thumbs">
                            <Image src="/img/Montre-Luxe-Occasion-Rolex-Submariner-bleu-or-acier.jpg" alt="" width={90} height={90} />
                            <Image src="/img/montre-omega-de-ville-prestige-.jpg" alt="" width={90} height={90} />
                            <Image src="/img/montre-patek-philippe-aquanaut-5261r-prix-avis.jpg" alt="" width={90} height={90} />
                            <Image src="/img/tag-Heuer.jpg" alt="" width={90} height={90} />
                        </div>

                        <div className="main-image">
                            <Image src={product.image} alt={product.product_name || 'product'} width={450} height={450} priority />
                        </div>
                    </div>

                    <div className="product-info">
                        <h1>{product.product_name}</h1>

                        <div className="rating">
                            <span aria-hidden>⭐⭐⭐⭐⭐</span>
                            <span className="reviews">({product.reviews ?? 0} reviews)</span>
                            <p className="stock">Stock: {product.stock}</p>
                        </div>

                        <p className="price">{product.price} € </p>

                        <p className="description">{product.description}</p>

                        <ProductActions product={product} />

                    </div>
                </div>

                <h2 className="related-title">PRODUITS SIMILAIRES</h2>
                <div className="related">
                    {sampleProducts.map((p) => (
                        <ProductCard key={p.product_id} product={p} />
                    ))}
                </div>
            </div>
        </DetailsClient>
    );
}
