"use client";
import React, { useEffect, useState } from "react";
import "../admin.css";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "user",
  });
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

  function startEdit(u) {
    setEditing(u.user_id);
    setValues({
      first_name: u.first_name || "",
      last_name: u.last_name || "",
      email: u.email || "",
      role: u.role || "user",
    });
  }

  async function saveEdit(e) {
    e.preventDefault();
    if (!editing) return;
    try {
      const payload = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        role: values.role,
      };
      const res = await fetch(`/api/users/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(body.error || "Erreur lors de la mise à jour de l'utilisateur");
        return;
      }
      setUsers((prev) =>
        prev.map((u) => (u.user_id === editing ? body : u)),
      );
      setEditing(null);
      setValues({ first_name: "", last_name: "", email: "", role: "user" });
    } catch (err) {
      console.error(err);
      alert("Impossible de mettre à jour l'utilisateur.");
    }
  }

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
    if (!confirm("Supprimer cet utilisateur ? Cette action est irréversible.")) return;
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
      <h2>Gestion des Clients</h2>
      <div style={{ margin: "12px 0 18px 0" }} className="small">
        {loading ? "Chargement…" : `${users.length} utilisateurs`}
      </div>

      <div className="panel">
        {loading ? (
          <div className="small">Chargement…</div>
        ) : users.length === 0 ? (
          <div className="small">Aucun utilisateur</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Prénom</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Créé le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_id}>
                  {editing === u.user_id ? (
                    <>
                      <td>{u.user_id}</td>
                      <td colSpan="5">
                        <form onSubmit={saveEdit} style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr 2fr 1fr 1fr" }}>
                          <input
                            value={values.first_name}
                            onChange={(e) =>
                              setValues((prev) => ({ ...prev, first_name: e.target.value }))
                            }
                            placeholder="Prénom"
                            required
                          />
                          <input
                            value={values.last_name}
                            onChange={(e) =>
                              setValues((prev) => ({ ...prev, last_name: e.target.value }))
                            }
                            placeholder="Nom"
                            required
                          />
                          <input
                            type="email"
                            value={values.email}
                            onChange={(e) =>
                              setValues((prev) => ({ ...prev, email: e.target.value }))
                            }
                            placeholder="Email"
                            required
                          />
                          <select
                            value={values.role}
                            onChange={(e) =>
                              setValues((prev) => ({ ...prev, role: e.target.value }))
                            }
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn btn-primary" type="submit">
                              Enregistrer
                            </button>
                            <button
                              className="btn btn-plain"
                              type="button"
                              onClick={() => setEditing(null)}
                            >
                              Annuler
                            </button>
                          </div>
                        </form>
                      </td>
                      <td></td>
                    </>
                  ) : (
                    <>
                      <td>{u.user_id}</td>
                      <td>{u.first_name || "-"}</td>
                      <td>{u.last_name || "-"}</td>
                      <td>{u.email}</td>
                      <td>
                        <span
                          className={`status ${
                            u.role === "admin" ? "shipped" : "pending"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td suppressHydrationWarning>
                        {u.created_at
                          ? new Date(u.created_at).toLocaleDateString("fr-FR")
                          : "-"}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            className="btn btn-plain"
                            onClick={() => startEdit(u)}
                          >
                            Modifier
                          </button>
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
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
