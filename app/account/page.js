'use client';
import React, { useState } from 'react'
import './page.css'

export default function AccountPage() {
    const [form, setForm] = useState({
        firstName: 'Md',
        lastName: 'Rimel',
        email: 'rimelllll@gmail.com',
        address: 'Kingston, 5236, United State',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [saving, setSaving] = useState(false)

    function onChange(e) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    async function onSave(e) {
        e.preventDefault()
        setSaving(true)
        try {
            // Simulation d'enregistrement
            await new Promise(r => setTimeout(r, 700))
            alert('Modifications enregistrées')
        } catch (err) {
            console.error(err)
            alert('Erreur lors de l\'enregistrement')
        } finally {
            setSaving(false)
        }
    }

    return (
        <main className="account-page">
            <div className="breadcrumb">Accueil / Mon compte</div>

            <div className="account-grid">
                <aside className="sidebar">
                    <h3>Gérer mon compte</h3>
                    <ul className="nav-list">
                        <li className="active">Mon profil</li>
                        <li>Carnet d'adresses</li>
                        <li>Mes méthodes de paiement</li>
                    </ul>

                    <h3 style={{ marginTop: '1.25rem' }}>Mes commandes</h3>
                    <ul className="nav-list">
                        <li>Mes retours</li>
                        <li>Mes annulations</li>
                    </ul>

                    <h3 style={{ marginTop: '1.25rem' }}>Ma liste de souhaits</h3>
                </aside>

                <section className="main-card">
                    <h2>Modifier votre profil</h2>
                    <form onSubmit={onSave} style={{ marginTop: '0.75rem' }}>
                        <div className="field-grid">
                            <div className="field">
                                <label>Prénom</label>
                                <input name="firstName" value={form.firstName} onChange={onChange} />
                            </div>

                            <div className="field">
                                <label>Nom</label>
                                <input name="lastName" value={form.lastName} onChange={onChange} />
                            </div>

                            <div className="field full-width">
                                <label>Email</label>
                                <input name="email" value={form.email} onChange={onChange} />
                            </div>

                            <div className="field full-width">
                                <label>Adresse</label>
                                <input name="address" value={form.address} onChange={onChange} />
                            </div>
                        </div>

                        <div className="password-section">
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>Modifications du mot de passe</h4>
                            <div className="field-grid">
                                <div className="field">
                                    <label>Mot de passe actuel</label>
                                    <input type="password" name="currentPassword" value={form.currentPassword} onChange={onChange} />
                                </div>
                                <div className="field">
                                    <label>Nouveau mot de passe</label>
                                    <input type="password" name="newPassword" value={form.newPassword} onChange={onChange} />
                                </div>
                                <div className="field">
                                    <label>Confirmer le nouveau mot de passe</label>
                                    <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={onChange} />
                                </div>
                            </div>
                        </div>

                        <div className="btn-row">
                            <button type="button" className="btn-cancel" onClick={() => window.location.reload()}>Annuler</button>
                            <button type="submit" className="btn-save" disabled={saving}>{saving ? 'Enregistrement...' : "Enregistrer les modifications"}</button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    )
}
