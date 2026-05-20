// Five very simple shirt silhouettes with different widths for the fit choice.

const SHAPES = {
  slim:      'M70 30 L100 22 L130 30 L155 45 L160 70 L150 78 L150 175 L50 175 L50 78 L40 70 L45 45 Z',
  athletic:  'M65 30 L100 22 L135 30 L162 48 L168 72 L155 80 L150 175 L50 175 L45 80 L32 72 L38 48 Z',
  regular:   'M60 30 L100 22 L140 30 L165 50 L170 75 L160 82 L155 178 L45 178 L40 82 L30 75 L35 50 Z',
  relaxed:   'M55 30 L100 20 L145 30 L170 50 L178 78 L165 85 L165 185 L35 185 L35 85 L22 78 L30 50 Z',
  oversized: 'M48 32 L100 18 L152 32 L180 50 L188 80 L172 88 L175 195 L25 195 L28 88 L12 80 L20 50 Z',
};

export default function FitSilhouette({ fit, active }) {
  const shape = SHAPES[fit] || SHAPES.regular;
  return (
    <svg viewBox="0 0 200 200" className={`w-20 h-20 ${active ? 'text-primary' : 'text-primary-300'} transition-colors`}>
      <path d={shape} fill="currentColor" fillOpacity="0.85" />
      <circle cx="100" cy="14" r="9" fill="currentColor" fillOpacity="0.85" />
    </svg>
  );
}
