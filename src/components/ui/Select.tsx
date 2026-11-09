import React from 'react';

interface Option { value: string; label: string }
interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Option[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, value, onChange, options, error }) => (
  <div className="input-group">
    {label && <label className="input-label">{label}</label>}
    <select className={`input-field ${error ? 'input-error' : ''}`} value={value} onChange={e => onChange && onChange(e.target.value)}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    {error && <span className="error-text">{error}</span>}
  </div>
);