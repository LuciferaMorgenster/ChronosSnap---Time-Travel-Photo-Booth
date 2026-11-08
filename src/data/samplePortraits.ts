// High quality sample portraits for instant time travel testing

function createPortraitSvg(bgColor: string, skinColor: string, hairColor: string, shirtColor: string, name: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <linearGradient id="bg-${name}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bgColor}" />
        <stop offset="100%" stop-color="#111827" />
      </linearGradient>
      <radialGradient id="skinGrad-${name}" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="${skinColor}" />
        <stop offset="100%" stop-color="${skinColor}cc" />
      </radialGradient>
      <filter id="shadow-${name}" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.3"/>
      </filter>
    </defs>
    <!-- Background -->
    <rect width="400" height="400" fill="url(#bg-${name})" />
    <circle cx="200" cy="180" r="140" fill="#ffffff" opacity="0.04" />
    
    <!-- Torso / Clothes -->
    <path d="M 90 380 Q 200 320 310 380 L 310 400 L 90 400 Z" fill="${shirtColor}" filter="url(#shadow-${name})" />
    <path d="M 170 335 L 200 365 L 230 335 Z" fill="${skinColor}" />
    <path d="M 160 330 Q 200 370 240 330" stroke="#ffffff33" stroke-width="2" fill="none" />

    <!-- Neck -->
    <rect x="175" y="240" width="50" height="70" rx="10" fill="${skinColor}" />

    <!-- Head / Face -->
    <ellipse cx="200" cy="200" rx="72" ry="88" fill="url(#skinGrad-${name})" filter="url(#shadow-${name})" />
    
    <!-- Hair -->
    <path d="M 125 190 C 120 120, 160 90, 200 90 C 240 90, 280 120, 275 190 C 265 150, 250 130, 200 130 C 150 130, 135 150, 125 190 Z" fill="${hairColor}" />

    <!-- Eyebrows -->
    <path d="M 155 165 Q 170 160 185 165" stroke="${hairColor}" stroke-width="4" stroke-linecap="round" fill="none" />
    <path d="M 215 165 Q 230 160 245 165" stroke="${hairColor}" stroke-width="4" stroke-linecap="round" fill="none" />

    <!-- Eyes -->
    <ellipse cx="170" cy="182" rx="12" ry="7" fill="#ffffff" />
    <ellipse cx="230" cy="182" rx="12" ry="7" fill="#ffffff" />
    <circle cx="170" cy="182" r="5" fill="#2d3748" />
    <circle cx="230" cy="182" r="5" fill="#2d3748" />
    <circle cx="172" cy="180" r="1.8" fill="#ffffff" />
    <circle cx="232" cy="180" r="1.8" fill="#ffffff" />

    <!-- Nose -->
    <path d="M 200 180 L 196 215 L 206 215 Z" fill="#00000015" />
    <path d="M 197 215 Q 200 219 203 215" stroke="#00000030" stroke-width="2" fill="none" stroke-linecap="round" />

    <!-- Lips -->
    <path d="M 185 240 Q 200 248 215 240" stroke="#b91c1c" stroke-width="3" stroke-linecap="round" fill="none" />
    <path d="M 188 240 Q 200 236 212 240" stroke="#ef4444" stroke-width="1.5" fill="none" />

    <!-- Subtle blush -->
    <circle cx="155" cy="215" r="14" fill="#f87171" opacity="0.15" />
    <circle cx="245" cy="215" r="14" fill="#f87171" opacity="0.15" />
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export interface SamplePortrait {
  id: string;
  name: string;
  title: string;
  dataUrl: string;
}

export const SAMPLE_PORTRAITS: SamplePortrait[] = [
  {
    id: 'sample_elena',
    name: 'Elena Rostova',
    title: 'Warm Natural Light',
    dataUrl: createPortraitSvg('#1e293b', '#fbd38d', '#2b1d0c', '#334155', 'elena'),
  },
  {
    id: 'sample_marcus',
    name: 'Marcus Vance',
    title: 'High Contrast Poise',
    dataUrl: createPortraitSvg('#312e81', '#ecc94b', '#18181b', '#1e1b4b', 'marcus'),
  },
  {
    id: 'sample_amara',
    name: 'Amara Diallo',
    title: 'Golden Radiance',
    dataUrl: createPortraitSvg('#701a75', '#9c4221', '#09090b', '#4a044e', 'amara'),
  },
  {
    id: 'sample_kai',
    name: 'Kai Nakamura',
    title: 'Contemporary Studio',
    dataUrl: createPortraitSvg('#064e3b', '#fed7aa', '#1c1917', '#065f46', 'kai'),
  },
];
