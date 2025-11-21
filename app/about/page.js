'use client'
import Image from 'next/image';

import './page.css'
export default function About() {
    return (
        <main>
            <div className="about-container">
                <div className="about-text">
                    <h1>Our Story  </h1>
                    <p className="p1"> Lancé en 2015, Exclusive est le premier site de vente en ligne d'Asie du Sud,avec une présence
                        active au Bangladesh. Soutenu par une large gamme de solutions de marketing,de données et de services sur mesure,
                        Exclusive compte 10 500 salles et 300 marques et sert 3 millions de clients dans la région.</p>
                    <p className="p1">Exclusive propose plus d'un million de produits et connaît une croissance très rapide. Exclusive propose un assortiment diversifié dans des catégories allant du consommateur.</p>
                </div>
                <div className="about-image">
                    <Image src="/about-us.jpg" alt="About Us" width={550} height={300} />
                </div>
                <div>
                </div>
            </div>

            <div className='about-container2'>
                <div className='logo'>
                    <div>
                        <Image src="/image.png" alt="About Us" width={100} height={60} />
                    <h2>10.5k </h2>
                    <p>Sallers actif notre site</p>
                    </div>
                </div>
                 <div>
                    <div className='logo'>
                         <Image src="/2.png" alt="About Us" width={100} height={60} />
                    <h2>33k</h2>
                    <p>Sallers actif notre site</p>
                    </div>
                </div>
                 <div>
                    <div className='logo'>
                            <Image src="/33.png" alt="About Us" width={100} height={60} />
                    <h2>45.5k</h2>
                    <p>Sallers actif notre site</p>
                    </div>
                </div>
                 <div>
                    <div className='logo'>
                            <Image src="/4.png" alt="About Us" width={100} height={60} />
                    <h2>25k</h2>
                    <p>Sallers actif notre site</p>
                    </div>
                </div>

            </div >
            <div className='about-container3'>
                <div>

                    <div>
                    <Image src="/about-bottom.jpg" alt="About Us" width={1200} height={400} />
                    </div>
                </div>
                 <div>

                    <div>
                    <Image src="/about-bottom.jpg" alt="About Us" width={1200} height={400} />
                    </div>
                </div>
                <div>

                 <div>
                <Image src="/about-bottom.jpg" alt="About Us" width={1200} height={400} />
                 </div>
                </div>
                <div>

                 <div>
                    <Image src="/about-bottom.jpg" alt="About Us" width={1200} height={400} />
                 </div>
                 </div>
           </div>






        </main>



    );
}