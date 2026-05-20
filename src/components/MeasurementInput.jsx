import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function MeasurementInput({
  id, label, hint, min, max, unit = 'cm', value, onChange, warningRange,
}) {
  const [touched, setTouched] = useState(false);
  const num = value === '' ? null : Number(value);
  const outOfRange = num !== null && (num < min || num > max);
  const warning = warningRange && num !== null && (num < warningRange[0] || num > warningRange[1]);

  return (
    <div>
      <label htmlFor={id} className="label flex items-center gap-1">
        {label}
        {hint && (
          <span className="group relative inline-flex">
            <HelpCircle size={14} className="text-primary-300" />
            <span className="absolute left-5 top-0 hidden group-hover:block z-10 w-56 bg-primary text-cream text-xs rounded p-2 shadow-lg">
              {hint}
            </span>
          </span>
        )}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step="0.5"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
          className={`input pr-12 ${outOfRange && touched ? 'border-red-400' : ''} ${warning && touched && !outOfRange ? 'border-amber-400' : ''}`}
          placeholder={`${min}–${max}`}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-300 text-sm">{unit}</span>
      </div>
      {touched && outOfRange && (
        <p className="text-red-500 text-xs mt-1">Bitte Wert zwischen {min} und {max} {unit} eingeben.</p>
      )}
      {touched && warning && !outOfRange && (
        <p className="text-amber-600 text-xs mt-1">Ungewoehnlicher Wert — bitte kontrolliere die Messung.</p>
      )}
    </div>
  );
}
