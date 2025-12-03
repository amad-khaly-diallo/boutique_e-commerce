"use client"
import React, { useState } from 'react'
import '../admin.css'

export default function SettingsPage(){
  const [siteName, setSiteName] = useState('Boutique')
  const [currency, setCurrency] = useState('EUR')

  function save(e){ e.preventDefault(); alert('Paramètres enregistrés (mock)') }

  return (
    <div style={{ padding:24 }}>
      <h2>Paramètres</h2>
      <form onSubmit={save} style={{ maxWidth:700 }}>
        <div className="form-row">
          <input value={siteName} onChange={e=>setSiteName(e.target.value)} placeholder="Nom du site" />
          <select value={currency} onChange={e=>setCurrency(e.target.value)}>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:12 }}>
          <button className="btn btn-plain" type="button" onClick={()=>{ setSiteName('Boutique'); setCurrency('EUR') }}>Réinitialiser</button>
          <button className="btn btn-primary" type="submit">Enregistrer</button>
        </div>
      </form>
    </div>
  ) 
}
