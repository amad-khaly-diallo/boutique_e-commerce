'use client'

import { useState } from 'react'
import '../auth.css'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Validation côté client
    const validate = () => {
        const e = {}
        if (!form.email) e.email = 'L’email est requis.'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide."
        if (!form.password) e.password = 'Le mot de passe est requis.'
        else if (form.password.length < 8) e.password = 'Le mot de passe doit contenir au moins 8 caractères.'
        return e
    }

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
        // Supprime l'erreur en temps réel
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
        if (errors.form) setErrors(prev => ({ ...prev, form: undefined }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = validate()
        setErrors(validationErrors)
        if (Object.keys(validationErrors).length > 0) return

        setLoading(true)
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: form.email.trim(),
                    password: form.password
                })
            })

            const data = await res.json().catch(() => ({}))

            if (!data.success) {
                // Gestion uniforme des erreurs serveur
                setErrors({ form: data.message || data.error || 'Une erreur est survenue.' })
            } else {
                setForm({ email: '', password: '' })
                router.push('/')
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
                    <Image src="/images/lux.png" alt="Auth" width={500} height={500} />
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
                                    placeholder="Email..."
                                    value={form.email}
                                    onChange={e => handleChange('email', e.target.value)}
                                    className={errors.email ? 'error' : ''}
                                />
                                {errors.email && <span className="error-text">{errors.email}</span>}
                            </div>

                            <div className="form-group">
                                <input
                                    type="password"
                                    placeholder="Mot de passe"
                                    value={form.password}
                                    onChange={e => handleChange('password', e.target.value)}
                                    className={errors.password ? 'error' : ''}
                                />
                                {errors.password && <span className="error-text">{errors.password}</span>}
                            </div>

                            <div className="form-buttons">
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Chargement...' : 'Se connecter'}
                                </button>
                            </div>
                        </form>

                        <div className="auth-toggle">
                            <p>Pas de compte ? <Link href="/register">S'inscrire</Link></p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
