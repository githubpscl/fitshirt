import { Check } from 'lucide-react';

export default function WizardSteps({ current }) {
  const steps = ['Koerpermasse', 'Fit-Praeferenz', 'Farbe & Bestellung'];
  return (
    <div className="mb-12">
      <ol className="grid grid-cols-3 gap-2">
        {steps.map((label, i) => {
          const n = i + 1;
          const isActive = current === n;
          const isDone = current > n;
          return (
            <li key={label} className="flex flex-col items-center text-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium mb-2
                ${isDone ? 'bg-primary text-cream' : isActive ? 'bg-primary text-cream' : 'bg-primary-100 text-primary-400'}`}>
                {isDone ? <Check size={16} /> : n}
              </div>
              <span className={`text-xs sm:text-sm ${isActive ? 'text-primary font-medium' : 'text-primary-400'}`}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="relative h-1 bg-primary-100 rounded-full mt-4">
        <div
          className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
          style={{ width: `${((current - 1) / 2) * 100}%` }}
        />
      </div>
    </div>
  );
}
