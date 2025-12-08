/**
 * Composant pour injecter des schémas Schema.org dans le head
 * Utilisé pour les pages client-side
 */
"use client";
import { useEffect } from 'react';

export default function SchemaInjector({ schemas = [] }) {
  useEffect(() => {
    // Supprimer les anciens schémas si présents
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"][data-schema-injected]');
    existingScripts.forEach(script => script.remove());

    // Ajouter les nouveaux schémas
    schemas.forEach((schema, index) => {
      if (!schema) return;
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema-injected', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // Cleanup
    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"][data-schema-injected]');
      scripts.forEach(script => script.remove());
    };
  }, [schemas]);

  return null;
}

