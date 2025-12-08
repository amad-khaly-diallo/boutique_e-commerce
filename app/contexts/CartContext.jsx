'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Éviter les problèmes d'hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fonction pour charger le nombre d'articles dans le panier
  const loadCartCount = useCallback(async () => {
    if (!mounted) return;
    
    try {
      const res = await fetch("/api/carts", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data.cart)) {
        setCartCount(data.cart.length);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error("Erreur chargement panier:", err);
      setCartCount(0);
    }
  }, [mounted]);

  // Charger le nombre d'articles au montage
  useEffect(() => {
    if (mounted) {
      loadCartCount();
    }
  }, [mounted, loadCartCount]);

  // Fonction pour mettre à jour le nombre d'articles (appelée après ajout/suppression)
  const refreshCartCount = useCallback(async () => {
    await loadCartCount();
  }, [loadCartCount]);

  // Fonction pour incrémenter le compteur (optimiste)
  const incrementCartCount = useCallback(() => {
    setCartCount(prev => prev + 1);
  }, []);

  // Fonction pour décrémenter le compteur (optimiste)
  const decrementCartCount = useCallback(() => {
    setCartCount(prev => Math.max(0, prev - 1));
  }, []);

  // Fonction pour réinitialiser le compteur
  const resetCartCount = useCallback(() => {
    setCartCount(0);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        refreshCartCount,
        incrementCartCount,
        decrementCartCount,
        resetCartCount,
        loadCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}

