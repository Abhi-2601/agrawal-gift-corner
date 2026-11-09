import React from 'react';
import { Gift } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nothing here yet',
  description = 'Try adjusting your filters or check back later.',
  action,
  icon,
  className = '',
}) => (
  <div className={`text-center py-16 px-4 ${className}`}>
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-soft-blush text-muted-rose mb-6">
      {icon || <Gift size={32} />}
    </div>
    <h3 className="font-playfair text-2xl text-ink mb-3">{title}</h3>
    <p className="text-secondary-text max-w-md mx-auto mb-6">{description}</p>
    {action}
  </div>
);

EmptyState.displayName = 'EmptyState';