"use client"
import React, { useState } from 'react'
import '../admin.css'

export default function OrdersPage() {
    const [orders, setOrders] = useState([
        { id: 101, customer: 'Alice Dupont', items: 2, total: '129.00€', status: 'pending', date: '2025-11-25' },
        { id: 102, customer: 'Jean Martin', items: 1, total: '59.00€', status: 'shipped', date: '2025-11-24' },
        { id: 103, customer: 'Sophie Laurent', items: 3, total: '210.50€', status: 'pending', date: '2025-11-23' }
    ])

    function markShipped(id) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'shipped' } : o))
    }

    function exportOrders() {
        const header = ['id', 'customer', 'items', 'total', 'status', 'date'].join(',')
        const body = orders.map(o => [o.id, o.customer, o.items, o.total, o.status, o.date].map(v => `"${v}"`).join(',')).join('\n')
        const csv = header + '\n' + body
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'orders.csv'
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }

    return (
        <div style={{ padding: 24 }}>
            <h2>Commandes</h2>
            <div style={{ margin: '12px 0 18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="small">{orders.length} commandes</div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-plain" onClick={exportOrders}>Exporter CSV</button>
                    <button className="btn btn-primary" onClick={() => setOrders([])}>Vider liste (mock)</button>
                </div>
            </div>

            <div className="panel">
                <table className="table">
                    <thead>
                        <tr><th>Commande</th><th>Client</th><th>Articles</th><th>Total</th><th>Date</th><th>Statut</th><th></th></tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id}>
                                <td>#{o.id}</td>
                                <td>{o.customer}</td>
                                <td>{o.items}</td>
                                <td>{o.total}</td>
                                <td>{o.date}</td>
                                <td><span className={`status ${o.status === 'pending' ? 'pending' : 'shipped'}`}>{o.status}</span></td>
                                <td>
                                    {o.status === 'pending' && <button className="btn btn-primary" onClick={() => markShipped(o.id)}>Marquer expédiée</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
