const Plate = ({ stroke = '#2a1a10' }) => (
  <>
    <ellipse cx="32" cy="44" rx="26" ry="6" fill="rgba(0,0,0,0.05)" stroke={stroke}/>
    <ellipse cx="32" cy="42" rx="22" ry="4.5" fill="none" stroke={stroke} strokeOpacity="0.5"/>
  </>
);

const ICONS = {
  r1: ({ stroke, size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Plate stroke={stroke}/>
      <g stroke={stroke} strokeWidth="1.5" fill="none">
        <circle cx="22" cy="36" r="5"/><circle cx="42" cy="36" r="5"/>
        <circle cx="32" cy="28" r="5"/><circle cx="32" cy="44" r="3" fill="rgba(0,0,0,0.05)"/>
      </g>
    </svg>
  ),
  r2: ({ stroke, size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Plate stroke={stroke}/>
      <g stroke={stroke} strokeWidth="1.5" fill="rgba(0,0,0,0.05)" strokeLinejoin="round">
        <path d="M14 32q4-8 14-8t12 6q-2 6-12 8t-14-6z"/>
        <path d="M40 28c4-2 8-1 9 2s-1 6-5 7-7-1-7-3" fill="none"/>
        <circle cx="46" cy="29" r="0.8" fill={stroke}/>
      </g>
    </svg>
  ),
  r3: ({ stroke, size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Plate stroke={stroke}/>
      <path d="M22 36c-2-6 4-12 11-11s12 6 11 12-7 9-13 7-7-3-9-8z" stroke={stroke} strokeWidth="1.5" fill="rgba(0,0,0,0.05)"/>
      <path d="M18 24q-2-6 2-7t6 3M14 28q-3-3-1-6" stroke={stroke} strokeWidth="1.3" fill="none"/>
    </svg>
  ),
  r4: ({ stroke, size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Plate stroke={stroke}/>
      <path d="M16 32q4-7 16-7t16 6q-2 7-16 8t-16-7z" stroke={stroke} strokeWidth="1.5" fill="rgba(0,0,0,0.05)"/>
      <path d="M20 38q4 3 8 0t8 3 8-2" stroke={stroke} strokeWidth="1.3" fill="none"/>
    </svg>
  ),
  r5: ({ stroke, size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Plate stroke={stroke}/>
      <path d="M14 38q4-6 14-6t14 4q-2 5-14 6t-14-4z" stroke={stroke} strokeWidth="1.5" fill="rgba(0,0,0,0.05)"/>
      <path d="M24 28q4-4 12-4t10 2-10 4-12-2z" stroke={stroke} strokeWidth="1.5" fill="rgba(0,0,0,0.04)"/>
      <circle cx="28" cy="27" r="0.6" fill={stroke}/>
    </svg>
  ),
  r6: ({ stroke, size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Plate stroke={stroke}/>
      <path d="M18 30q3-5 14-5t14 4q-2 6-14 7t-14-6z" stroke={stroke} strokeWidth="1.5" fill="rgba(0,0,0,0.05)"/>
      <path d="M20 30q4-2 8 0t8-1 6 1" stroke={stroke} strokeWidth="1.2" fill="none"/>
      <circle cx="48" cy="28" r="1" fill={stroke}/>
    </svg>
  ),
  r7: ({ stroke, size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M10 30h44q-2 18-22 18t-22-18z" stroke={stroke} strokeWidth="1.5" fill="rgba(0,0,0,0.05)"/>
      <path d="M8 30h48" stroke={stroke} strokeWidth="1.5"/>
      <circle cx="22" cy="38" r="2.5" stroke={stroke} fill="rgba(0,0,0,0.06)"/>
      <circle cx="34" cy="40" r="2" stroke={stroke} fill="rgba(0,0,0,0.06)"/>
      <circle cx="44" cy="36" r="2" stroke={stroke} fill="rgba(0,0,0,0.06)"/>
      <path d="M16 22q3-4 0-6M22 22q3-4 0-6M28 22q3-4 0-6" stroke={stroke} strokeWidth="1.2" fill="none"/>
    </svg>
  ),
  r8: ({ stroke, size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Plate stroke={stroke}/>
      <path d="M10 36q8-8 24-6t20 4l-6 4 6 4-20 2q-16 2-24-8z" stroke={stroke} strokeWidth="1.5" fill="rgba(0,0,0,0.05)"/>
      <circle cx="18" cy="35" r="0.8" fill={stroke}/>
      <path d="M14 28q-2-4 2-6M22 26q-2-4 2-5" stroke={stroke} strokeWidth="1.2" fill="none"/>
    </svg>
  ),
  r9: ({ stroke, size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Plate stroke={stroke}/>
      <ellipse cx="32" cy="36" rx="22" ry="6" stroke={stroke} strokeWidth="1.5" fill="rgba(0,0,0,0.04)"/>
      <path d="M14 38q6 3 18 1t18 1" stroke={stroke} strokeWidth="1.2" fill="none"/>
      <circle cx="20" cy="35" r="0.7" fill={stroke}/>
    </svg>
  ),
  r10: ({ stroke, size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M10 30h44q-2 18-22 18t-22-18z" stroke={stroke} strokeWidth="1.5" fill="rgba(0,0,0,0.05)"/>
      <path d="M8 30h48" stroke={stroke} strokeWidth="1.5"/>
      <path d="M16 38c4-2 8 0 12-2s10 2 14-1" stroke={stroke} strokeWidth="1.2" fill="none"/>
      <circle cx="22" cy="40" r="0.7" fill={stroke}/>
      <circle cx="42" cy="40" r="0.7" fill={stroke}/>
      <path d="M14 24q3-3 0-5M22 24q3-3 0-5" stroke={stroke} strokeWidth="1.2" fill="none"/>
    </svg>
  ),
  r11: ({ stroke, size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Plate stroke={stroke}/>
      <path d="M14 34c4-3 12-3 16 0s10 0 14 2-6 6-14 6-12 2-16 0-4-6 0-8z" stroke={stroke} strokeWidth="1.5" fill="rgba(0,0,0,0.05)"/>
      <path d="M16 36q5-1 10 0t10-1 10 1" stroke={stroke} strokeWidth="1" fill="none" strokeDasharray="2 2"/>
    </svg>
  ),
  r12: ({ stroke, size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Plate stroke={stroke}/>
      <path d="M12 36q8-7 22-5t20 3l-6 3 6 3-20 2q-14 2-22-6z" stroke={stroke} strokeWidth="1.5" fill="rgba(0,0,0,0.05)"/>
      <circle cx="20" cy="36" r="0.7" fill={stroke}/>
      <circle cx="28" cy="30" r="2.5" stroke={stroke} fill="rgba(0,0,0,0.05)"/>
      <path d="M28 27v-3" stroke={stroke}/>
    </svg>
  ),
  r13: ({ stroke, size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Plate stroke={stroke}/>
      <ellipse cx="32" cy="36" rx="22" ry="5" stroke={stroke} strokeWidth="1.5" fill="rgba(0,0,0,0.04)"/>
      <g stroke={stroke} strokeWidth="1.2" fill="rgba(0,0,0,0.05)">
        <ellipse cx="14" cy="36" rx="3" ry="2.5"/>
        <ellipse cx="22" cy="36" rx="3" ry="2.5"/>
        <ellipse cx="30" cy="36" rx="3" ry="2.5"/>
        <ellipse cx="38" cy="36" rx="3" ry="2.5"/>
        <ellipse cx="46" cy="36" rx="3" ry="2.5"/>
      </g>
    </svg>
  ),
  r14: ({ stroke, size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Plate stroke={stroke}/>
      <rect x="22" y="28" width="20" height="12" rx="2" stroke={stroke} strokeWidth="1.5" fill="rgba(0,0,0,0.05)"/>
      <ellipse cx="14" cy="36" rx="3" ry="2.5" stroke={stroke} fill="rgba(0,0,0,0.04)"/>
      <ellipse cx="50" cy="36" rx="3" ry="2.5" stroke={stroke} fill="rgba(0,0,0,0.04)"/>
      <path d="M14 30c0-3 4-3 4 0M50 30c0-3 4-3 4 0" stroke={stroke} strokeWidth="1.2" fill="none"/>
    </svg>
  ),
  r15: ({ stroke, size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Plate stroke={stroke}/>
      <g stroke={stroke} strokeWidth="1.5" fill="rgba(0,0,0,0.05)">
        <path d="M14 36c-2 4 0 6 4 6s4-3 4-6-2-5-4-5-3 1-4 5z"/>
        <path d="M30 36c-2 4 0 6 4 6s4-3 4-6-2-5-4-5-3 1-4 5z"/>
        <path d="M46 36c-2 4 0 6 4 6s4-3 4-6-2-5-4-5-3 1-4 5z"/>
      </g>
      <path d="M16 30q2-4 0-5M32 30q2-4 0-5M48 30q2-4 0-5" stroke={stroke} strokeWidth="1.2" fill="none"/>
    </svg>
  ),
  r16: ({ stroke, size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Plate stroke={stroke}/>
      <ellipse cx="32" cy="36" rx="22" ry="6" stroke={stroke} strokeWidth="1.5" fill="rgba(0,0,0,0.04)"/>
      <circle cx="18" cy="34" r="2" stroke={stroke} fill="rgba(0,0,0,0.06)"/>
      <ellipse cx="28" cy="36" rx="3" ry="1.5" stroke={stroke} fill="rgba(0,0,0,0.06)"/>
      <circle cx="40" cy="34" r="1.5" stroke={stroke} fill="rgba(0,0,0,0.06)"/>
      <ellipse cx="48" cy="37" rx="2.5" ry="1.5" stroke={stroke} fill="rgba(0,0,0,0.06)"/>
    </svg>
  ),
  r17: ({ stroke, size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Plate stroke={stroke}/>
      <path d="M16 32q4-7 16-7t16 6q-2 7-16 8t-16-7z" stroke={stroke} strokeWidth="1.5" fill="rgba(0,0,0,0.05)"/>
      <circle cx="22" cy="32" r="0.8" fill={stroke}/>
      <circle cx="30" cy="34" r="0.8" fill={stroke}/>
      <circle cx="40" cy="33" r="0.8" fill={stroke}/>
      <circle cx="36" cy="38" r="0.8" fill={stroke}/>
      <circle cx="46" cy="36" r="0.8" fill={stroke}/>
    </svg>
  ),
  r18: ({ stroke, size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M10 30h44q-2 18-22 18t-22-18z" stroke={stroke} strokeWidth="1.5" fill="rgba(0,0,0,0.05)"/>
      <path d="M8 30h48" stroke={stroke} strokeWidth="1.5"/>
      <ellipse cx="32" cy="34" rx="6" ry="2" stroke={stroke} fill="rgba(0,0,0,0.05)" transform="rotate(20 32 34)"/>
      <path d="M27 33l10 2" stroke={stroke} strokeWidth="1"/>
      <path d="M16 24q4-4 0-7M22 24q4-4 0-7" stroke={stroke} strokeWidth="1.2" fill="none"/>
    </svg>
  ),
  r19: ({ stroke, size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M16 22q16-12 32 0c0 12-8 22-16 22s-16-10-16-22z" stroke={stroke} strokeWidth="1.5" fill="rgba(0,0,0,0.05)"/>
      <path d="M20 22l4 16M28 18l2 22M36 18l-2 22M44 22l-4 16" stroke={stroke} strokeWidth="1" fill="none"/>
      <path d="M16 22q16-3 32 0" stroke={stroke} strokeWidth="1.5"/>
    </svg>
  ),
};

export function DishIcon({ recipeId, size = 64, stroke = '#2a1a10' }) {
  const Icon = ICONS[recipeId];
  return Icon ? <Icon size={size} stroke={stroke}/> : null;
}
