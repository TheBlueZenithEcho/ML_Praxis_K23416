import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Alert: React.FC<AlertProps> = ({
  type,
  message,
  onClose,
  autoClose = true,
  duration = 3000
}) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const config = {
    success: {
      icon: <CheckCircle size={20} />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
      iconColor: 'text-green-500'
    },
    error: {
      icon: <XCircle size={20} />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500'
    },
    warning: {
      icon: <AlertCircle size={20} />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-500'
    },
    info: {
      icon: <Info size={20} />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-500'
    }
  };

  const { icon, bgColor, textColor, borderColor, iconColor } = config[type];

  return (
    <div
      className={`
        ${bgColor} ${textColor} ${borderColor}
        border rounded-lg p-4 mb-4
        flex items-start gap-3
        animate-in slide-in-from-top duration-300
      `}
    >
      <div className={iconColor}>{icon}</div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={`${textColor} hover:opacity-70 transition-opacity`}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default Alert;