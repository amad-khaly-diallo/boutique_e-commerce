"use client"
import React, { useState } from 'react'
import '../admin.css'

export default function UsersPage() {
    const [users, setUsers] = useState([
        { id: 1, name: 'Alice Dupont', email: 'alice@example.com', role: 'customer' },
        { id: 2, name: 'Jean Martin', email: 'jean@example.com', role: 'customer' },
        { id: 3, name: 'Admin', email: 'admin@example.com', role: 'admin' }
    ])

    function promote(id) { setUsers(prev => prev.map(u => u.id === id ? { ...u, role: 'admin' } : u)) }
    function removeUser(id) { setUsers(prev => prev.filter(u => u.id !== id)) }

    return (
        <div style={{ padding: 24 }}>
            <h2>Clients</h2>
            <div style={{ margin: '12px 0 18px 0' }} className="small">{users.length} utilisateurs</div>

            <div className="panel">
                <table className="table">
                    <thead>
                        <tr><th>ID</th><th>Nom</th><th>Email</th><th>Rôle</th><th></th></tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.role}</td>
                                <td>
                                    {u.role !== 'admin' && <button className="btn btn-plain" onClick={() => promote(u.id)}>Promouvoir</button>}
                                    <button className="btn" onClick={() => removeUser(u.id)}>Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
