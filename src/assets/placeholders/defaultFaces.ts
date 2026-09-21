// Clean SVG Data-URIs for default placeholder faces (no external network needed)

const encodeSvg = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

// Friend 1: Cool floating face with sunglasses and happy smile
const friend1Svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="skin1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FED7AA" />
      <stop offset="100%" stop-color="#FDBA74" />
    </linearGradient>
    <linearGradient id="hair1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#374151" />
      <stop offset="100%" stop-color="#1F2937" />
    </linearGradient>
    <linearGradient id="glasses" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#3B82F6" />
    </linearGradient>
  </defs>

  <!-- Background Circle Mask -->
  <circle cx="60" cy="60" r="58" fill="#1E293B" stroke="#6366F1" stroke-width="4" />

  <!-- Head Base -->
  <circle cx="60" cy="64" r="38" fill="url(#skin1)" />

  <!-- Ears -->
  <circle cx="21" cy="64" r="9" fill="url(#skin1)" />
  <circle cx="99" cy="64" r="9" fill="url(#skin1)" />

  <!-- Stylish Hair -->
  <path d="M 24 54 C 24 30, 40 22, 60 22 C 80 22, 96 30, 96 54 C 92 48, 86 44, 76 44 C 64 44, 56 46, 44 44 C 34 44, 28 48, 24 54 Z" fill="url(#hair1)" />
  <path d="M 28 32 C 40 20, 70 18, 90 28 C 80 22, 60 20, 36 28 Z" fill="#4B5563" />

  <!-- Sunglasses Frame & Lenses -->
  <rect x="30" y="52" width="26" height="18" rx="5" fill="url(#glasses)" stroke="#111827" stroke-width="3" />
  <rect x="64" y="52" width="26" height="18" rx="5" fill="url(#glasses)" stroke="#111827" stroke-width="3" />
  <line x1="56" y1="58" x2="64" y2="58" stroke="#111827" stroke-width="4" stroke-linecap="round" />
  <!-- Glass highlights -->
  <line x1="33" y1="55" x2="43" y2="55" stroke="#E0E7FF" stroke-width="2" stroke-linecap="round" opacity="0.8" />
  <line x1="67" y1="55" x2="77" y2="55" stroke="#E0E7FF" stroke-width="2" stroke-linecap="round" opacity="0.8" />

  <!-- Nose -->
  <path d="M 58 71 Q 60 74 62 71" stroke="#EA580C" stroke-width="2.5" fill="none" stroke-linecap="round" />

  <!-- Wide Grin -->
  <path d="M 44 79 Q 60 94 76 79" fill="#991B1B" stroke="#1F2937" stroke-width="2.5" />
  <path d="M 47 80 Q 60 86 73 80" fill="#FFFFFF" />

  <!-- Cheerful Cheeks -->
  <circle cx="36" cy="74" r="5" fill="#F43F5E" opacity="0.4" />
  <circle cx="84" cy="74" r="5" fill="#F43F5E" opacity="0.4" />
</svg>
`;

// Friend 2: Expressive surprised/grumpy face with raised brows, perfect for obstacle towers
const friend2Svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="skin2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="100%" stop-color="#FACC15" />
    </linearGradient>
    <linearGradient id="brickBorder" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#EF4444" />
      <stop offset="100%" stop-color="#DC2626" />
    </linearGradient>
  </defs>

  <!-- Square/Round Tile Base for solid tower stacking -->
  <rect x="2" y="2" width="116" height="116" rx="16" fill="#1F2937" stroke="url(#brickBorder)" stroke-width="4" />

  <!-- Big Face -->
  <circle cx="60" cy="60" r="42" fill="url(#skin2)" stroke="#CA8A04" stroke-width="2" />

  <!-- Ears -->
  <circle cx="17" cy="60" r="8" fill="url(#skin2)" />
  <circle cx="103" cy="60" r="8" fill="url(#skin2)" />

  <!-- Hair (Messy Spikes) -->
  <path d="M 30 40 L 40 20 L 50 34 L 60 16 L 70 34 L 80 20 L 90 40 Z" fill="#B91C1C" />

  <!-- Thick Expressive Eyebrows (Slanted) -->
  <line x1="32" y1="42" x2="52" y2="48" stroke="#7F1D1D" stroke-width="5" stroke-linecap="round" />
  <line x1="88" y1="42" x2="68" y2="48" stroke="#7F1D1D" stroke-width="5" stroke-linecap="round" />

  <!-- Eyes (Intense Wide Stare) -->
  <circle cx="42" cy="56" r="10" fill="#FFFFFF" stroke="#1F2937" stroke-width="2" />
  <circle cx="78" cy="56" r="10" fill="#FFFFFF" stroke="#1F2937" stroke-width="2" />
  <circle cx="43" cy="56" r="4.5" fill="#0F172A" />
  <circle cx="77" cy="56" r="4.5" fill="#0F172A" />
  <circle cx="44.5" cy="54.5" r="1.5" fill="#FFFFFF" />
  <circle cx="78.5" cy="54.5" r="1.5" fill="#FFFFFF" />

  <!-- Nose -->
  <ellipse cx="60" cy="66" rx="4" ry="3" fill="#D97706" />

  <!-- O-shaped shocked / roaring mouth -->
  <ellipse cx="60" cy="80" rx="11" ry="13" fill="#881337" stroke="#1F2937" stroke-width="2.5" />
  <path d="M 52 74 Q 60 76 68 74" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round" />
  <!-- Tongue -->
  <ellipse cx="60" cy="87" rx="6" ry="4" fill="#F43F5E" />
</svg>
`;

export const DEFAULT_FRIEND_1_URI = encodeSvg(friend1Svg);
export const DEFAULT_FRIEND_2_URI = encodeSvg(friend2Svg);
