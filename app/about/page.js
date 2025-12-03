'use client'
import Image from 'next/image';
import { Users, DollarSign, ShoppingCart, TrendingUp, Truck, Headphones, ShieldCheck } from 'lucide-react';
import './page.css'
import { useEffect, useState } from 'react';
import LuxuryLoader from "@/app/components/LuxuryLoader/LuxuryLoader";


export default function About() {
    const [luxeLoading, setluxeLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setluxeLoading(false)
        }, 1000);
    }, [])
    return (
        <main className="about-page">
            {luxeLoading && <LuxuryLoader />}
            <div className="container">
                <nav className="breadcrumb">Home <span>/</span> About</nav>

                <section className="hero">
                    <div className="hero-left">
                        <h1 className="hero-title">A propos des nous </h1>
                        <p className="lead">Lancé en 2015, Exclusive est le premier site de vente en ligne d'Asie du Sud, avec une présence
                            active au Bangladesh. Soutenu par une large gamme de solutions de marketing, de données et de services sur mesure,
                            Exclusive compte 10 500 sellers et 300 marques et sert 3 millions de clients dans la région.</p>

                        <p className="lead">Exclusive propose plus d'un million de produits et connaît une croissance très rapide. Exclusive propose un assortiment diversifié dans des catégories variées.</p>
                    </div>

                    <div className="hero-right">
                        <Image src="/about-us.jpg" alt="About Us" width={720} height={480} />
                    </div>
                </section>

                <section className="stats">
                    <div className="stat">
                        <div className="stat-icon">
                            <Users size={40} />
                        </div>
                        <h3>10.5k</h3>
                        <p>Sellers active our site</p>
                    </div>

                    <div className="stat stat-highlight">
                        <div className="stat-icon">
                            <DollarSign size={40} color="#fff" />
                        </div>
                        <h3>33k</h3>
                        <p>Monthly Product Sale</p>
                    </div>

                    <div className="stat">
                        <div className="stat-icon">
                            <ShoppingCart size={40} />
                        </div>
                        <h3>45.5k</h3>
                        <p>Customer active in our site</p>
                    </div>

                    <div className="stat">
                        <div className="stat-icon">
                            <TrendingUp size={40} />
                        </div>
                        <h3>25k</h3>
                        <p>Annual gross sale in our site</p>
                    </div>
                </section>

                <section className="team">
                    <div className="team-member">
                        <div className="avatar"><Image src="/person.png" alt="Tom Cruise" width={380} height={380} /></div>
                        <h4>Tom Cruise</h4>
                        <p className="role">Founder & Chairman</p>
                    </div>

                    <div className="team-member">
                        <div className="avatar"><Image src="/person.png" alt="Emma Watson" width={380} height={380} /></div>
                        <h4>Emma Watson</h4>
                        <p className="role">Managing Director</p>
                    </div>

                    <div className="team-member">
                        <div className="avatar"><Image src="/person.png" alt="Will Smith" width={380} height={380} /></div>
                        <h4>Will Smith</h4>
                        <p className="role">Product Designer</p>
                    </div>
                </section>

                <section className="features">
                    <div className="feature">
                        <div className="feature-icon"><Truck /></div>
                        <h5>Free And Fast Delivery</h5>
                        <p className="muted">Free delivery for all orders over $140</p>
                    </div>

                    <div className="feature">
                        <div className="feature-icon"><Headphones /></div>
                        <h5>24/7 Customer Service</h5>
                        <p className="muted">Friendly 24/7 customer support</p>
                    </div>

                    <div className="feature">
                        <div className="feature-icon"><ShieldCheck /></div>
                        <h5>Money Back Guarantee</h5>
                        <p className="muted">We return money within 30 days</p>
                    </div>
                </section>
            </div>
        </main>
    )
}