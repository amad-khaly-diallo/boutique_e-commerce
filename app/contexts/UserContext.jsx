'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Éviter les problèmes d'hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fonction pour charger les informations de l'utilisateur
  const loadUser = useCallback(async () => {
    if (!mounted) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Erreur chargement utilisateur:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [mounted]);

  // Charger l'utilisateur au montage
  useEffect(() => {
    if (mounted) {
      loadUser();
    }
  }, [mounted, loadUser]);

  // Fonction pour mettre à jour l'utilisateur (appelée après login)
  const refreshUser = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  // Fonction pour déconnecter l'utilisateur
  const logout = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setUser(null);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Erreur lors de la déconnexion" };
      }
    } catch (err) {
      console.error("Erreur déconnexion:", err);
      return { success: false, error: "Erreur lors de la déconnexion" };
    }
  }, []);

  // Fonction pour définir l'utilisateur directement (après login réussi)
  const setUserData = useCallback((userData) => {
    setUser(userData);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        logout,
        setUserData,
        loadUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}

