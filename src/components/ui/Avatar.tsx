'use client';

import Image from 'next/image';
import { clsx } from 'clsx';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
}

export default function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  className,
}: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const imageSizes = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };

  const getInitials = () => {
    if (fallback) {
      return fallback.slice(0, 2).toUpperCase();
    }
    if (alt) {
      return alt
        .split(' ')
        .map((word) => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }
    return '?';
  };

  if (!src) {
    return (
      <div
        className={clsx(
          'flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-medium',
          sizes[size],
          className
        )}
      >
        {getInitials()}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'relative rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700',
        sizes[size],
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={imageSizes[size]}
        height={imageSizes[size]}
        className="object-cover w-full h-full"
      />
    </div>
  );
}
