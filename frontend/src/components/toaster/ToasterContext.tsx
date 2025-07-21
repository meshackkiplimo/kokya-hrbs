import React, { createContext, useContext, useState } from 'react';
import Toaster from './Toaster';

type ToastContextType = {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
};

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const ToastProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({
    isVisible: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toaster
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={3000}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);