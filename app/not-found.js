import Link from 'next/link';
import styles from './not-found.module.css';
import Golden from './components/GoldenBotton/GoldenBotton';

export default function NotFound() {
    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <nav className={styles.breadcrumb}>Home <span>/</span> 404 Error</nav>

                <section className={styles.hero}>
                    <h1 className={styles.title}>404 Not Found</h1>
                    <p className={styles.subtitle}>Your visited page not found. You may go home page.</p>
                    <Link href="/" className={styles.cta}><Golden>Back to home page</Golden></Link>
                </section>
            </div>
        </main>
    );
}
