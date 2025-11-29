'use client'

import { useState } from 'react'
import '../auth.css'
import Image from 'next/image'
import Golden from '@/app/components/GoldenBotton/GoldenBotton';

const INITIAL_FORM = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
    address: '',
}

export default function RegisterPage() {
    const [form, setForm] = useState(INITIAL_FORM)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    function validate() {
        const e = {}
        if (!form.firstName.trim()) e.firstName = 'Le prénom est requis.'
        if (!form.lastName.trim()) e.lastName = 'Le nom est requis.'
        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Email invalide."
        if (form.password.length < 8) e.password = 'Le mot de passe doit contenir au moins 8 caractères.'
        if (form.password !== form.confirm) e.confirm = 'Les mots de passe ne correspondent pas.'
        if (!form.address.trim()) e.address = 'L’adresse postale est requise.'
        return e
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const v = validate()
        setErrors(v)
        if (Object.keys(v).length) return

        setLoading(true)
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: form.firstName.trim(),
                    last_name: form.lastName.trim(),
                    email: form.email,
                    password: form.password,
                    address: form.address.trim(),
                })
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                setErrors({ form: data?.message || 'Une erreur est survenue.' })
            } else {
                setForm(INITIAL_FORM)
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
                        <h1>Créer un compte</h1>
                        <p>Entrez vos informations pour créer un nouveau compte.</p>

                        {errors.form && <div className="error-box">{errors.form}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Prénom"
                                        value={form.firstName}
                                        onChange={e => setForm({ ...form, firstName: e.target.value })}
                                        className={errors.firstName ? 'error' : ''}
                                    />
                                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Nom"
                                        value={form.lastName}
                                        onChange={e => setForm({ ...form, lastName: e.target.value })}
                                        className={errors.lastName ? 'error' : ''}
                                    />
                                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <input
                                    type="email"
                                    placeholder="Email"
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

                            <div className="form-group">
                                <textarea
                                    placeholder="Adresse postale complète"
                                    value={form.address}
                                    onChange={e => setForm({ ...form, address: e.target.value })}
                                    className={errors.address ? 'error' : ''}
                                    rows={3}
                                />
                                {errors.address && <span className="error-text">{errors.address}</span>}
                            </div>

                            <div className="form-buttons">
                                <Golden type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Chargement...' : 'Créer un compte'}
                                </Golden>
                            </div>
                        </form>

                        <div className="auth-toggle">
                            <p>Vous avez déjà un compte ? <a href="/login">Se connecter</a></p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
