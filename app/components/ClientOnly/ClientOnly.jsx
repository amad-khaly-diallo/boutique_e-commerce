'use client';
import { useEffect, useState } from 'react';

/**
 * Composant qui ne rend son contenu que côté client
 * Évite les problèmes d'hydration mismatch
 */
export default function ClientOnly({ children, fallback = null }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback;
  }

  return <>{children}</>;
}

