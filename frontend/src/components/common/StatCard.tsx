import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'primary',
  subtitle
}) => {
  const colors = {
    primary: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    secondary: {
      bg: 'bg-gray-50',
      icon: 'text-gray-600',
      iconBg: 'bg-gray-100'
    },
    success: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    warning: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      iconBg: 'bg-yellow-100'
    },
    danger: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      iconBg: 'bg-red-100'
    },
    info: {
      bg: 'bg-indigo-50',
      icon: 'text-indigo-600',
      iconBg: 'bg-indigo-100'
    }
  };

  const { bg, icon: iconColor, iconBg } = colors[color];

  return (
    <div className={`${bg} rounded-lg p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {value}
          </p>
          
          {trend && (
            <div className="flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp size={16} className="text-green-600" />
              ) : (
                <TrendingDown size={16} className="text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          )}
          
          {subtitle && !trend && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
        
        {Icon && (
          <div className={`${iconBg} p-3 rounded-lg`}>
            <Icon size={24} className={iconColor} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;