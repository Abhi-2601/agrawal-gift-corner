import React from 'react';
import '../ui/styles.css';

interface TextareaProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  id?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  value = '',
  onChange,
  placeholder = '',
  rows = 4,
  error,
  id = 'textarea-' + Math.random().toString(36).slice(2)
}) => {
  return (
    <div className="input-group">
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <textarea
        id={id}
        className={`input-field ${error ? 'input-error' : ''}`}
        rows={rows}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        style={{ resize: 'vertical' }}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};