"use client"
import React, { useState } from 'react'
import '../admin.css'

export default function ProductsPage() {
    const [products, setProducts] = useState([
        { id: 1, name: 'Montre Classique', price: '129.00€', stock: 12 },
        { id: 2, name: 'Sac à main cuir', price: '199.00€', stock: 4 },
    ])
    const [editing, setEditing] = useState(null)
    const [values, setValues] = useState({ name: '', price: '', stock: '' })

    function startEdit(p) { setEditing(p.id); setValues({ name: p.name, price: p.price, stock: String(p.stock) }) }
    function saveEdit(e) { e.preventDefault(); setProducts(prev => prev.map(p => p.id === editing ? { ...p, name: values.name, price: values.price, stock: Number(values.stock) || 0 } : p)); setEditing(null) }
    function removeProduct(id) { setProducts(prev => prev.filter(p => p.id !== id)) }
    function addProduct(e) { e.preventDefault(); const next = { id: Date.now(), name: values.name || 'Nouveau', price: values.price || '0.00€', stock: Number(values.stock) || 0 }; setProducts(prev => [next, ...prev]); setValues({ name: '', price: '', stock: '' }) }

    return (
        <div style={{ padding: 24 }}>
            <h2>Produits</h2>
            <div style={{ display: 'flex', gap: 12, margin: '12px 0 18px 0' }}>
                <form onSubmit={addProduct} style={{ display: 'flex', gap: 8 }}>
                    <input placeholder="Nom" value={values.name} onChange={e => setValues(prev => ({ ...prev, name: e.target.value }))} />
                    <input placeholder="Prix (ex: 99.00€)" value={values.price} onChange={e => setValues(prev => ({ ...prev, price: e.target.value }))} />
                    <input placeholder="Stock" value={values.stock} onChange={e => setValues(prev => ({ ...prev, stock: e.target.value }))} />
                    <button className="btn btn-primary" type="submit">Ajouter</button>
                </form>
                <div style={{ marginLeft: 'auto' }}>
                    <button className="btn btn-plain" onClick={() => alert('Importer CSV - fonctionnalité mock')}>Importer</button>
                </div>
            </div>

            <div className="panel">
                <div style={{ display: 'grid', gap: 8 }}>
                    {products.map(p => (
                        <div key={p.id} className="product-item">
                            {editing === p.id ? (
                                <form style={{ display: 'flex', gap: 8, width: '100%' }} onSubmit={saveEdit}>
                                    <input value={values.name} onChange={e => setValues(prev => ({ ...prev, name: e.target.value }))} />
                                    <input value={values.price} onChange={e => setValues(prev => ({ ...prev, price: e.target.value }))} />
                                    <input value={values.stock} onChange={e => setValues(prev => ({ ...prev, stock: e.target.value }))} />
                                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                                        <button className="btn btn-plain" type="button" onClick={() => setEditing(null)}>Annuler</button>
                                        <button className="btn btn-primary" type="submit">Enregistrer</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{p.name}</div>
                                        <div className="meta">{p.price} • Stock: {p.stock}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn btn-plain" onClick={() => startEdit(p)}>Modifier</button>
                                        <button className="btn" onClick={() => removeProduct(p.id)}>Supprimer</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
