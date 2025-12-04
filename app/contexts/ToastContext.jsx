'use client';
import { createContext, useContext } from 'react';
import { useToast } from '@/lib/useToast';
import ToastContainer from '@/app/components/ToastContainer/ToastContainer';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
}

