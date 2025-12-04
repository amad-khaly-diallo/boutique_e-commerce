import { useState, useEffect, useRef } from 'react';

/**
 * Hook personnalisé pour gérer le LuxuryLoader avec un délai minimum d'affichage
 * @param {boolean} isLoading - État de chargement
 * @param {number} minDisplayTime - Temps minimum d'affichage en ms (défaut: 800ms)
 * @returns {boolean} - État du loader à afficher
 */
export function useLuxuryLoader(isLoading, minDisplayTime = 800) {
  const [showLoader, setShowLoader] = useState(false);
  const startTimeRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isLoading) {
      // Démarrer le loader immédiatement
      startTimeRef.current = Date.now();
      setShowLoader(true);
    } else {
      // Calculer le temps restant pour atteindre le minimum
      if (startTimeRef.current !== null) {
        const elapsed = Date.now() - startTimeRef.current;
        const remaining = Math.max(0, minDisplayTime - elapsed);

        // Attendre le temps restant avant de cacher le loader
        timeoutRef.current = setTimeout(() => {
          setShowLoader(false);
          startTimeRef.current = null;
        }, remaining);
      } else {
        // Si pas de startTime, cacher immédiatement
        setShowLoader(false);
      }
    }

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading, minDisplayTime]);

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return showLoader;
}

