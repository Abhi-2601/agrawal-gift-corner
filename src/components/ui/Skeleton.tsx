import React from 'react';

interface SkeletonProps {
  type?: 'card' | 'text' | 'image';
  lines?: number;
  width?: string;
  height?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  type = 'text',
  lines = 3,
  width = '100%',
  height = '1rem',
  className = '',
}) => {
  if (type === 'card') {
    return (
      <div className={`skeleton-card ${className}`}>
        <div className="skeleton skeleton-image" />
        <div className="p-4 space-y-3">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-text" style={{ width: '60%' }} />
          <div className="skeleton skeleton-text" style={{ width: '40%' }} />
        </div>
      </div>
    );
  }

  if (type === 'image') {
    return (
      <div
        className={`skeleton skeleton-image ${className}`}
        style={{ height: height || '250px' }}
      />
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`} style={{ width }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton skeleton-text"
          style={{
            width: i === 0 ? '100%' : `${70 - i * 15}%`,
            height,
          }}
        />
      ))}
    </div>
  );
};

Skeleton.displayName = 'Skeleton';