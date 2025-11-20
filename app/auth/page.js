'use client'

import { useState } from 'react'
import './auth.css'

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    function validate() {
        const e = {}
        if (!isLogin && !form.fullName.trim()) e.fullName = 'Le nom est requis.'
        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Email invalide."
        if (form.password.length < 6) e.password = 'Le mot de passe doit contenir au moins 6 caractères.'
        if (!isLogin && form.password !== form.confirm) e.confirm = 'Les mots de passe ne correspondent pas.'
        return e
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const v = validate()
        setErrors(v)
        if (Object.keys(v).length) return

        setLoading(true)
        try {
            const endpoint = isLogin ? '/api/login' : '/api/register'
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(isLogin ?
                    { email: form.email, password: form.password } :
                    { name: form.fullName, email: form.email, password: form.password }
                )
            })

            if (res.ok) {
                setForm({ fullName: '', email: '', password: '', confirm: '' })
            } else {
                const data = await res.json().catch(() => ({}))
                setErrors({ form: data?.message || 'Une erreur est survenue.' })
            }
        } catch (err) {
            setErrors({ form: 'Impossible de contacter le serveur.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">

            {/* Main Content */}
            <div className="auth-main">
                {/* Left Side - Image */}
                <div className="auth-image">
                    <div className="shopping-illustration">
                        <div className="phone-frame"></div>
                        <div className="cart-graphic"></div>
                        <div className="shopping-bag"></div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="auth-form-container">
                    <div className="form-wrapper">
                        <h1>{isLogin ? 'Connexion à Exclusive' : 'Créer un compte'}</h1>
                        <p>{isLogin ? 'Connectez-vous à votre compte' : 'Entrez vos informations pour créer un nouveau compte.'}</p>

                        {errors.form && <div className="error-box">{errors.form}</div>}

                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Nom"
                                        value={form.fullName}
                                        onChange={e => setForm({ ...form, fullName: e.target.value })}
                                        className={errors.fullName ? 'error' : ''}
                                    />
                                    {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                                </div>
                            )}

                            <div className="form-group">
                                <input
                                    type="email"
                                    placeholder="Email ou numéro de téléphone"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className={errors.email ? 'error' : ''}
                                />
                                {errors.email && <span className="error-text">{errors.email}</span>}
                            </div>

                            <div className="form-group">
                                <input
                                    type="password"
                                    placeholder="Mot de passe"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    className={errors.password ? 'error' : ''}
                                />
                                {errors.password && <span className="error-text">{errors.password}</span>}
                            </div>

                            {!isLogin && (
                                <div className="form-group">
                                    <input
                                        type="password"
                                        placeholder="Confirmer le mot de passe"
                                        value={form.confirm}
                                        onChange={e => setForm({ ...form, confirm: e.target.value })}
                                        className={errors.confirm ? 'error' : ''}
                                    />
                                    {errors.confirm && <span className="error-text">{errors.confirm}</span>}
                                </div>
                            )}

                            <div className="form-buttons">
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'Créer un compte'}
                                </button>
                                {isLogin && <button type="button" className="btn-google">S'inscrire avec Google</button>}
                            </div>
                        </form>

                        <div className="auth-toggle">
                            {isLogin ? (
                                <p>Pas de compte ? <button type="button" onClick={() => {
                                    setIsLogin(false)
                                    setForm({ fullName: '', email: '', password: '', confirm: '' })
                                    setErrors({})
                                }}>S'inscrire</button></p>
                            ) : (
                                <p>Vous avez déjà un compte ? <button type="button" onClick={() => {
                                    setIsLogin(true)
                                    setForm({ fullName: '', email: '', password: '', confirm: '' })
                                    setErrors({})
                                }}>Se connecter</button></p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="auth-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Exclusive</h3>
                        <ul>
                            <li><a href="#"> abonnez-vous </a></li>
                            <li><input type="email" placeholder="Enter your email" /></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Support</h3>
                        <ul>
                            <li><a href="#">111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</a></li>
                            <li><a href="tel:+8801688888899">+330693191813</a></li>
                            <li><a href="mailto:exclusive@gmail.com">ahmed.Support@gmail.com</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>conte   </h3>
                        <ul>
                            <li><a href="#">Mon conte </a></li>
                            <li><a href="#">connetion  / enregistrement </a></li>
                            <li><a href="#">Cart</a></li>
                            <li><a href="#">Liste de souhaits</a></li>
                            <li><a href="#">Shop</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Lien rapide</h3>
                        <ul>
                            <li><a href="#">politique de confidentialité</a></li>
                            <li><a href="#">Conditions d'utilisation</a></li>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Télécharger l'application</h3>
                        <p>Économisez 3 $ avec l'application pour les nouveaux utilisateurs uniquement</p>
                        <div className="qr-code">QR</div>
                        <div className="app-links">
                            <button>Google Play</button>
                            <button>App Store</button>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© Copyright Exclusive 2024. Tous droits réservés</p>
                </div>
            </footer>
        </div>
    )
}
