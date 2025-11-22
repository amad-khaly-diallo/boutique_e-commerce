'use client'

import { useState } from 'react'
import './auth.css'
import Image from 'next/image'

const INITIAL_FORM = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
    address: '',
}

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [form, setForm] = useState(INITIAL_FORM)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    function validate() {
        const e = {}
        if (!isLogin && !form.firstName.trim()) e.firstName = 'Le prénom est requis.'
        if (!isLogin && !form.lastName.trim()) e.lastName = 'Le nom est requis.'
        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Email invalide."
        if (form.password.length < 6) e.password = 'Le mot de passe doit contenir au moins 6 caractères.'
        if (!isLogin && form.password !== form.confirm) e.confirm = 'Les mots de passe ne correspondent pas.'
        if (!isLogin && !form.address.trim()) e.address = 'L’adresse postale est requise.'
        return e
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const v = validate()
        setErrors(v)
        if (Object.keys(v).length) return

        setLoading(true)
        try {
            const endpoint = isLogin ? '/api/login' : '/api/users'
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(isLogin ?
                    { email: form.email, password: form.password } :
                    {
                        first_name: form.firstName.trim(),
                        last_name: form.lastName.trim(),
                        email: form.email,
                        password: form.password,
                        address: form.address.trim(),
                    }
                )
            })

            if (res.ok) {
                setForm(INITIAL_FORM)
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
                    <Image
                        className=''
                        src="/lux.png"
                        alt="Next.js logo"
                        width={500}
                        height={500}
                        priority
                    />
                </div>

                {/* Right Side - Form */}
                <div className="auth-form-container">
                    <div className="form-wrapper">
                        <h1>{isLogin ? 'Connexion à Exclusive' : 'Créer un compte'}</h1>
                        <p>{isLogin ? 'Connectez-vous à votre compte' : 'Entrez vos informations pour créer un nouveau compte.'}</p>

                        {errors.form && <div className="error-box">{errors.form}</div>}

                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
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
                                <>
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
                                </>
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
                                    setForm(INITIAL_FORM)
                                    setErrors({})
                                }}>S'inscrire</button></p>
                            ) : (
                                <p>Vous avez déjà un compte ? <button type="button" onClick={() => {
                                    setIsLogin(true)
                                    setForm(INITIAL_FORM)
                                    setErrors({})
                                }}>Se connecter</button></p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
