"use client"

import { useState } from "react"
import styles from "./page.module.css"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("sending")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus("success")
        setForm({ name: "", email: "", message: "" })
      } else {
        setStatus("error")
      }
    } catch (err) {
      setStatus("error")
    }
  }

  return (
    <main className={styles.container}>
      <h1>Contact</h1>
      <p>Si vous avez une question, envoyez-nous un message via le formulaire ci-dessous.</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Nom
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        <label className={styles.label}>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        <label className={styles.label}>
          Message
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className={styles.textarea}
            rows={6}
            required
          />
        </label>

        <button className={styles.button} type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Envoi…" : "Envoyer"}
        </button>

        {status === "success" && <p className={styles.success}>Message envoyé. Merci !</p>}
        {status === "error" && <p className={styles.error}>Erreur lors de l'envoi. Réessayez.</p>}
      </form>
    </main>
  )
}