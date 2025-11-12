import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
  className?: string;
  showBorder?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  size = 'md',
  name,
  className = '',
  showBorder = false
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 32,
    xl: 48
  };

  const borderClass = showBorder ? 'ring-2 ring-[#2B7516] ring-offset-2' : '';

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`${sizes[size]} ${borderClass} rounded-full overflow-hidden bg-gray-300 flex items-center justify-center ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : name ? (
        <span className="text-gray-700 font-semibold text-sm">
          {getInitials(name)}
        </span>
      ) : (
        <User size={iconSizes[size]} className="text-gray-600" />
      )}
    </div>
  );
};

export default Avatar;