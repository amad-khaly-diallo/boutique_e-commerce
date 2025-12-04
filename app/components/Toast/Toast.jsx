'use client';
import { useEffect } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import './Toast.css';

const TOAST_TYPES = {
  success: { icon: CheckCircle, color: '#10b981', bgColor: '#d1fae5', textColor: '#065f46' },
  error: { icon: XCircle, color: '#ef4444', bgColor: '#fee2e2', textColor: '#991b1b' },
  warning: { icon: AlertCircle, color: '#f59e0b', bgColor: '#fef3c7', textColor: '#92400e' },
  info: { icon: Info, color: '#3b82f6', bgColor: '#dbeafe', textColor: '#1e40af' },
};

export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  const config = TOAST_TYPES[type] || TOAST_TYPES.info;
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type} toast-show`}>
      <div className="toast-content">
        <Icon className="toast-icon" size={20} style={{ color: config.color }} />
        <span className="toast-message">{message}</span>
        <button
          className="toast-close"
          onClick={onClose}
          aria-label="Fermer"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

