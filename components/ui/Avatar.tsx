import React from 'react';

export interface AvatarProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'alt'> {
  alt: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-9 w-9',
};

export function Avatar({ size = 'sm', className = '', alt, ...props }: AvatarProps) {
  return (
    <img
      alt={alt}
      className={`${sizes[size]} rounded-full object-cover ${className}`}
      {...props}
    />
  );
}
