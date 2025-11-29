'use client'

import { useState } from 'react'
import '../auth.css'
import Image from 'next/image'
import Golden from '@/app/components/GoldenBotton/GoldenBotton';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    function validate() {
        const e = {}
        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Email invalide."
        if (form.password.length < 8) e.password = 'Le mot de passe doit contenir au moins 8 caractères.'
        return e
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const v = validate()
        setErrors(v)
        if (Object.keys(v).length) return

        setLoading(true)
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password
                })
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                setErrors({ form: data?.message || 'Une erreur est survenue.' })
            } else {
                setForm({ email: '', password: '' })
            }
        } catch {
            setErrors({ form: 'Impossible de contacter le serveur.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-main">

                <div className="auth-image">
                    <Image src="/lux.png" alt="Auth" width={500} height={500} />
                </div>

                <div className="auth-form-container">
                    <div className="form-wrapper">
                        <h1>Connexion à Exclusive</h1>
                        <p>Connectez-vous à votre compte</p>

                        {errors.form && <div className="error-box">{errors.form}</div>}

                        <form onSubmit={handleSubmit}>
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

                            <div className="form-buttons">
                                <Golden type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Chargement...' : 'Se connecter'}
                                </Golden>
                                <button type="button" className="btn-google">S'inscrire avec Google</button>
                            </div>
                        </form>

                        <div className="auth-toggle">
                            <p>Pas de compte ? <a href="/register">S'inscrire</a></p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
