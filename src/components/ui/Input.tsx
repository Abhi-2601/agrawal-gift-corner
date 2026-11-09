import React from 'react';
import '../ui/styles.css';

interface InputProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  id?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  value = '',
  onChange,
  placeholder = '',
  type = 'text',
  error,
  id = 'input-' + Math.random().toString(36).slice(2)
}) => {
  return (
    <div className="input-group">
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <input
        id={id}
        className={`input-field ${error ? 'input-error' : ''}`}
        type={type}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};