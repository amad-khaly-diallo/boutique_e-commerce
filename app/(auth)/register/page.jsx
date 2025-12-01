'use client'

import { useState } from 'react'
import '../auth.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const INITIAL_FORM = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: ''
}

export default function RegisterPage() {
    const [form, setForm] = useState(INITIAL_FORM)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Validation côté client
    const validate = () => {
        const e = {}
        if (!form.firstName.trim()) e.firstName = 'Le prénom est requis.'
        if (!form.lastName.trim()) e.lastName = 'Le nom est requis.'
        if (!form.email) e.email = 'L’email est requis.'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide.'
        if (!form.password) e.password = 'Le mot de passe est requis.'
        else if (form.password.length < 8) e.password = 'Le mot de passe doit contenir au moins 8 caractères.'
        if (form.confirm !== form.password) e.confirm = 'Les mots de passe ne correspondent pas.'
        return e
    }

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value })
        // On peut supprimer l’erreur sur le champ quand l’utilisateur corrige
        if (errors[field]) setErrors({ ...errors, [field]: undefined })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = validate()
        setErrors(validationErrors)
        if (Object.keys(validationErrors).length > 0) return

        setLoading(true)
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: form.firstName.trim(),
                    last_name: form.lastName.trim(),
                    email: form.email.trim(),
                    password: form.password,
                    passwordConfirm: form.confirm
                })
            })

            const data = await res.json()

            if (!data.success) {
                const serverErrors = {}

                if (data.errors && Array.isArray(data.errors)) {
                    data.errors.forEach(err => {
                        if (err.toLowerCase().includes('prénom')) serverErrors.firstName = err
                        else if (err.toLowerCase().includes('nom')) serverErrors.lastName = err
                        else if (err.toLowerCase().includes('email')) serverErrors.email = err
                        else serverErrors.form = err
                    })
                }
                else if (data.error) {
                    serverErrors.form = data.error
                }
                else if (data.message) {
                    serverErrors.form = data.message
                }

                setErrors(serverErrors)
            } else {
                setForm(INITIAL_FORM)
                router.push('/login')
            }
        } catch (err) {
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
                                        onChange={e => handleChange('firstName', e.target.value)}
                                        className={errors.firstName ? 'error' : ''}
                                    />
                                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Nom"
                                        value={form.lastName}
                                        onChange={e => handleChange('lastName', e.target.value)}
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

                            <div className="form-group">
                                <input
                                    type="password"
                                    placeholder="Confirmer le mot de passe"
                                    value={form.confirm}
                                    onChange={e => handleChange('confirm', e.target.value)}
                                    className={errors.confirm ? 'error' : ''}
                                />
                                {errors.confirm && <span className="error-text">{errors.confirm}</span>}
                            </div>

                            <div className="form-buttons">
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Chargement...' : 'Créer un compte'}
                                </button>
                            </div>
                        </form>

                        <div className="auth-toggle">
                            <p>Vous avez déjà un compte ? <Link href="/login">Se connecter</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
