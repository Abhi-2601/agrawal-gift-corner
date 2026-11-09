import React from 'react';

interface CardProps {
  image: string;
  title: string;
  price: string;
  badges?: string[];
  onClick?: () => void;
  className?: string;
  imageClassName?: string;
  bodyClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  image,
  title,
  price,
  badges = [],
  onClick,
  className = '',
  imageClassName = '',
  bodyClassName = '',
}) => (
  <div
    className={`card group ${className}`}
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <div className="image-wrapper">
      <img
        src={image}
        alt={title}
        loading="lazy"
        className={imageClassName}
      />
      {badges && badges.length > 0 && (
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          {badges.map((b) => (
            <span
              key={b}
              className="badge badge-sale"
            >
              {b}
            </span>
          ))}
        </div>
      )}
    </div>
    <div className={`p-5 ${bodyClassName}`}>
      <h3 className="font-playfair text-xl text-plum mb-2 leading-tight group-hover:text-muted-rose transition-colors">
        {title}
      </h3>
      <p className="font-semibold text-ink text-lg">{price}</p>
    </div>
  </div>
);

Card.displayName = 'Card';