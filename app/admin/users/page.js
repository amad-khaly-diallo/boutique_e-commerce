"use client";
import React, { useEffect, useState } from "react";
import "../admin.css";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/users", { cache: "no-store" });
        const data = await res.json().catch(() => []);
        if (res.ok && Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error(err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  async function promote(id) {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "admin" }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(body.error || "Erreur lors de la mise à jour de l'utilisateur");
        return;
      }
      setUsers((prev) =>
        prev.map((u) => (u.user_id === id ? body : u)),
      );
    } catch (err) {
      console.error(err);
      alert("Impossible de mettre à jour l'utilisateur.");
    }
  }

  async function removeUser(id) {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(body.error || "Erreur lors de la suppression");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.user_id !== id));
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer l'utilisateur.");
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Clients</h2>
      <div style={{ margin: "12px 0 18px 0" }} className="small">
        {loading ? "Chargement…" : `${users.length} utilisateurs`}
      </div>

      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id}>
                <td>{u.user_id}</td>
                <td>{u.first_name}</td>
                <td>{u.last_name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  {u.role !== "admin" && (
                    <button
                      className="btn btn-plain"
                      onClick={() => promote(u.user_id)}
                    >
                      Promouvoir
                    </button>
                  )}
                  <button
                    className="btn"
                    onClick={() => removeUser(u.user_id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
