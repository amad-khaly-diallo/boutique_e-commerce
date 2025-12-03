"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import './admin.css'

export default function AdminPage() {
    const [orders, setOrders] = useState([
        { id: 101, customer: 'Alice Dupont', total: '129.00€', status: 'pending' },
        { id: 102, customer: 'Jean Martin', total: '59.00€', status: 'shipped' },
        { id: 103, customer: 'Sophie Laurent', total: '210.50€', status: 'pending' }
    ])

    const [products, setProducts] = useState([
        { id: 1, name: 'Montre Classique', price: '129.00€', stock: 12 },
        { id: 2, name: 'Sac à main cuir', price: '199.00€', stock: 4 },
    ])

    const [users] = useState([
        { id: 1, name: 'Alice Dupont', email: 'alice@example.com' },
        { id: 2, name: 'Jean Martin', email: 'jean@example.com' }
    ])

    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' })
    const [editingProductId, setEditingProductId] = useState(null)
    const [editValues, setEditValues] = useState({ name: '', price: '', stock: '' })

    function markShipped(id) {
        setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: 'shipped' } : o)))
    }

    function markAllShipped() {
        setOrders(prev => prev.map(o => ({ ...o, status: 'shipped' })))
    }

    function removeProduct(id) {
        setProducts(prev => prev.filter(p => p.id !== id))
    }

    function startEdit(p) {
        setEditingProductId(p.id)
        setEditValues({ name: p.name, price: p.price, stock: String(p.stock) })
    }

    function cancelEdit() {
        setEditingProductId(null)
        setEditValues({ name: '', price: '', stock: '' })
    }

    function saveEdit(e) {
        e.preventDefault()
        if (editingProductId == null) return
        setProducts(prev => prev.map(p => (p.id === editingProductId ? { ...p, name: editValues.name, price: editValues.price, stock: Number(editValues.stock) || 0 } : p)))
        cancelEdit()
    }

    function exportCSV(rows, columns, filename = 'export.csv') {
        const header = columns.join(',')
        const body = rows.map(r => columns.map(c => `"${(r[c] ?? '')}"`).join(',')).join('\n')
        const csv = header + '\n' + body
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }

    function exportProducts() {
        exportCSV(products, ['id', 'name', 'price', 'stock'], 'products.csv')
    }

    function exportOrders() {
        exportCSV(orders, ['id', 'customer', 'total', 'status'], 'orders.csv')
    }

    function handleSidebarClick(targetId) {
        const el = document.getElementById(targetId)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    function addProduct(e) {
        e.preventDefault()
        if (!newProduct.name) return
        const next = { id: Date.now(), name: newProduct.name, price: newProduct.price || '0.00€', stock: Number(newProduct.stock) || 0 }
        setProducts(prev => [next, ...prev])
        setNewProduct({ name: '', price: '', stock: '' })
    }

    return (
        <div className="admin-root">
            <aside className="admin-sidebar">
                <div className="brand">Boutique Admin</div>
                <nav className="side-nav">
                    <Link href="/admin" className="active">Tableau de bord</Link>
                    <Link href="/admin/orders">Commandes</Link>
                    <Link href="/admin/products">Produits</Link>
                    <Link href="/admin/users">Clients</Link>
                    <Link href="/admin/settings">Paramètres</Link>
                </nav>

                <div style={{ marginTop: '1.25rem' }} className="small">Connecté en tant qu'administrateur</div>
            </aside>

            <main className="admin-main">
                <div className="topbar">
                    <h1>Tableau de bord</h1>
                    <div className="controls">
                        <input className="search-input" placeholder="Rechercher..." />
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-plain" onClick={exportProducts}>Exporter produits</button>
                            <button className="btn btn-plain" onClick={exportOrders}>Exporter commandes</button>
                        </div>
                        <button className="btn btn-primary" onClick={markAllShipped}>Marquer tout expédié</button>
                    </div>
                </div>

                <div className="grid-3">
                    <div className="card">
                        <h3>Ventes (ce mois)</h3>
                        <div className="value">12 450€</div>
                        <div className="small">+8% par rapport au mois dernier</div>
                    </div>

                    <div className="card">
                        <h3>Nouvelles commandes</h3>
                        <div className="value">{orders.length}</div>
                        <div className="small">À traiter</div>
                    </div>

                    <div className="card">
                        <h3>Produits en stock</h3>
                        <div className="value">{products.reduce((s, p) => s + (p.stock || 0), 0)}</div>
                        <div className="small">Alertes de stock disponibles</div>
                    </div>
                </div>

                <div className="layout-columns">
                    <section className="panel">
                        <h3 id="orders">Commandes récentes</h3>
                        <table className="table">
                            <thead>
                                <tr><th>Commande</th><th>Client</th><th>Total</th><th>Statut</th><th></th></tr>
                            </thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o.id}>
                                        <td>#{o.id}</td>
                                        <td>{o.customer}</td>
                                        <td>{o.total}</td>
                                        <td><span className={`status ${o.status === 'pending' ? 'pending' : 'shipped'}`}>{o.status}</span></td>
                                        <td>
                                            {o.status === 'pending' && <button className="btn btn-primary" onClick={() => markShipped(o.id)}>Marquer expédiée</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    <aside className="panel" id="products">
                        <h3>Ajouter un produit</h3>
                        <form onSubmit={addProduct}>
                            <div className="form-row">
                                <input value={newProduct.name} onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))} placeholder="Nom du produit" />
                                <input value={newProduct.price} onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))} placeholder="Prix (ex: 99.00€)" />
                            </div>
                            <div className="form-row">
                                <input value={newProduct.stock} onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))} placeholder="Stock" />
                                <select className="" defaultValue="1">
                                    <option value="1">En vente</option>
                                    <option value="0">Brouillon</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-plain" onClick={() => setNewProduct({ name: '', price: '', stock: '' })}>Réinitialiser</button>
                                <button type="submit" className="btn btn-primary">Ajouter</button>
                            </div>
                        </form>

                        <hr style={{ margin: '1rem 0' }} />

                        <h4>Produits</h4>
                        <div className="product-list">
                            {products.map(p => (
                                <div className="product-item" key={p.id}>
                                    {editingProductId === p.id ? (
                                        <form style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }} onSubmit={saveEdit}>
                                            <input value={editValues.name} onChange={(e) => setEditValues(prev => ({ ...prev, name: e.target.value }))} />
                                            <input value={editValues.price} onChange={(e) => setEditValues(prev => ({ ...prev, price: e.target.value }))} />
                                            <input value={editValues.stock} onChange={(e) => setEditValues(prev => ({ ...prev, stock: e.target.value }))} />
                                            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                                                <button className="btn btn-plain" type="button" onClick={cancelEdit}>Annuler</button>
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
                    </aside>
                </div>

                <div style={{ marginTop: '1rem' }} className="panel" id="users">
                    <h3>Utilisateurs récents</h3>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {users.map(u => (
                            <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: '#fff', borderRadius: 6 }}>
                                <div>
                                    <div style={{ fontWeight: 700 }}>{u.name}</div>
                                    <div className="small">{u.email}</div>
                                </div>
                                <div className="small">ID: {u.id}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
