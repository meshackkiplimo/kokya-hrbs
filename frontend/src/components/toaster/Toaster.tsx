import React, { useEffect, useState } from 'react';

type ToasterProps = {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  isVisible: boolean;
  onClose?: () => void;
};

const Toaster: React.FC<ToasterProps> = ({ message, type = 'success', duration = 3000, isVisible, onClose }) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
    if (isVisible && duration) {
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!show) return null;

  const typeStyles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  const typeIcons = {
    success: '✔',
    error: '✖',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className="fixed top-5 right-5 z-50">
      <div
        className={`flex items-center px-4 py-3 rounded-md shadow-lg text-white text-sm font-semibold ${typeStyles[type]} transition-all duration-300 transform ${
          show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <span className="mr-2">{typeIcons[type]}</span>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toaster;