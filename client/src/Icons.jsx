export function SuitIcon({ suit, size = 28, color = 'currentColor' }) {
  const s = size;
  if (suit === 'meat') return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path d="M9 14c-2-3 0-7 4-8s9 1 11 5 1 9-3 11-9 0-11-3" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M11 14c-1.5-2 0-5 3-5.5s7 1 8 3.5" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="9" cy="14" r="2.4" fill={color}/>
      <path d="M5 17c2-1 3-1 4 0" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M6 19c1.5-.5 2.5-.3 3 .3" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
  if (suit === 'fish') return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path d="M3 16c4-6 11-7 17-4 3 1.5 5 4 7 4-2 0-4 2.5-7 4-6 3-13 2-17-4z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M22 12l5-3v14l-5-3" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
      <circle cx="9" cy="15.5" r="0.9" fill={color}/>
      <path d="M12 14c2 1 2 3 0 4" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
  if (suit === 'veg') return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path d="M14 9c-3 1-6 5-7 10-1 5 1 7 4 6 4-1 9-5 11-9 2-3 1-6-2-7-2-1-4 0-6 0z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M19 11l3-5M21 11l4-3M19 9l1-5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M11 17l-3 1M12 20l-2 1M14 22l-2 0" stroke={color} strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  );
  if (suit === 'sauce') return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path d="M6 22c5-1 8-5 11-9 2-3 5-6 8-5-1 4-3 8-7 11-3 2-7 4-12 3z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M12 18c2 0 3-1 4-2.5" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="22" cy="11" r="1.2" fill={color}/>
      <circle cx="9" cy="24" r="0.8" fill={color}/>
    </svg>
  );
  return null;
}

export function AbilityIcon({ id, size = 36, color = 'currentColor' }) {
  const s = size;
  const W = { stroke: color, strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (id) {
    case 'snack': return (
      <svg width={s} height={s} viewBox="0 0 36 36">
        <path d="M11 8v8a4 4 0 008 0V8M11 12h8M14 8v-2M19 8v-2" {...W}/>
        <path d="M22 28h-8a2 2 0 01-2-2v-2h12v2a2 2 0 01-2 2z" {...W}/>
      </svg>
    );
    case 'stock': return (
      <svg width={s} height={s} viewBox="0 0 36 36">
        <ellipse cx="18" cy="18" rx="12" ry="7" {...W}/>
        <circle cx="18" cy="18" r="4" {...W}/>
        <circle cx="18" cy="18" r="1.5" fill={color}/>
      </svg>
    );
    case 'market': return (
      <svg width={s} height={s} viewBox="0 0 36 36">
        <path d="M7 14l4-5h14l4 5M7 14h22M9 14v14h18V14M14 18v8M22 18v8M9 28h18" {...W}/>
      </svg>
    );
    case 'imp': return (
      <svg width={s} height={s} viewBox="0 0 36 36">
        <rect x="9" y="9" width="18" height="18" rx="2" {...W}/>
        <circle cx="13" cy="13" r="1.4" fill={color}/>
        <circle cx="23" cy="23" r="1.4" fill={color}/>
        <circle cx="18" cy="18" r="1.4" fill={color}/>
        <circle cx="13" cy="23" r="1.4" fill={color}/>
        <circle cx="23" cy="13" r="1.4" fill={color}/>
      </svg>
    );
    case 'head': return (
      <svg width={s} height={s} viewBox="0 0 36 36">
        <path d="M11 22c-3-1-4-4-2-7s5-2 6 0c0-3 4-5 7-3s3 6 1 8c2 1 2 4 0 5H10c-2-1-2-3 1-3z" {...W}/>
        <path d="M11 26h14v3H11z" {...W}/>
      </svg>
    );
    case 'app': return (
      <svg width={s} height={s} viewBox="0 0 36 36">
        <rect x="7" y="9" width="14" height="18" rx="2" {...W}/>
        <rect x="15" y="13" width="14" height="18" rx="2" {...W} fill="rgba(0,0,0,0.05)"/>
      </svg>
    );
    case 'swap': return (
      <svg width={s} height={s} viewBox="0 0 36 36">
        <path d="M8 13h18l-4-4M28 23H10l4 4" {...W}/>
      </svg>
    );
    case 'reset': return (
      <svg width={s} height={s} viewBox="0 0 36 36">
        <path d="M27 14a10 10 0 10.5 6M27 9v5h-5" {...W}/>
      </svg>
    );
    default: return null;
  }
}

export function ChefHat({ size = 40, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M9 22c-3-1-4-5-2-8s6-3 7-1c-1-3 3-6 7-5s5 5 4 7c3-1 5 2 4 5s-3 4-5 4H10z" stroke={color} strokeWidth="1.5"/>
      <path d="M9 22h22v6c0 1-1 2-2 2H11c-1 0-2-1-2-2v-6z" stroke={color} strokeWidth="1.5" fill="rgba(0,0,0,0.05)"/>
      <path d="M14 22v-3M20 22v-4M26 22v-3" stroke={color} strokeWidth="1.2"/>
    </svg>
  );
}

export function ChefAvatar({ accent = '#c9a352', tone = 0, size = 56, mood = 'neutral', traitor = false }) {
  const skins = ['#e8c89a', '#c89878', '#8c5a3a', '#6a3e22', '#d8a878', '#a87858'];
  const skin = skins[tone % skins.length];
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: 'block', flexShrink: 0 }}>
      <circle cx="32" cy="32" r="32" fill={traitor ? 'rgba(139,42,47,0.3)' : 'rgba(20,9,10,0.4)'}/>
      <path d="M16 28c-4-1-5-7-2-10s8-3 10-1c-1-4 4-8 10-7s8 6 6 9c4-1 6 3 4 7s-4 5-7 5H18z" fill="#f6efde" stroke="#3d271e" strokeWidth="1.2"/>
      <rect x="14" y="30" width="36" height="6" fill="#f6efde" stroke="#3d271e" strokeWidth="1.2"/>
      <ellipse cx="32" cy="48" rx="14" ry="13" fill={skin} stroke="#3d271e" strokeWidth="1.2"/>
      <circle cx="27" cy="46" r="1.4" fill="#1a1010"/>
      <circle cx="37" cy="46" r="1.4" fill="#1a1010"/>
      {mood === 'smile'   && <path d="M27 53q5 4 10 0"  stroke="#1a1010" strokeWidth="1.4" fill="none" strokeLinecap="round"/>}
      {mood === 'neutral' && <path d="M28 54h8"          stroke="#1a1010" strokeWidth="1.4" strokeLinecap="round"/>}
      {mood === 'frown'   && <path d="M27 56q5-4 10 0"  stroke="#1a1010" strokeWidth="1.4" fill="none" strokeLinecap="round"/>}
      {mood === 'whistle' && <ellipse cx="32" cy="55" rx="1.6" ry="2" fill="#1a1010"/>}
      <path d="M27 51q5 1 10 0" stroke={accent} strokeWidth="2" strokeLinecap="round" fill="none"/>
      {traitor && <circle cx="32" cy="46" r="13" fill="none" stroke="#c14248" strokeWidth="1" strokeDasharray="2 2" opacity="0.6"/>}
    </svg>
  );
}

export function BellIcon({ size = 28, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 5l1 1c5 1 9 5 9 11v6l2 3H4l2-3v-6c0-6 4-10 9-11l1-1z" stroke={color} strokeWidth="1.6"/>
      <circle cx="16" cy="4" r="1.6" fill={color}/>
      <path d="M13 26c0 2 1 3 3 3s3-1 3-3" stroke={color} strokeWidth="1.6"/>
    </svg>
  );
}

export function Ornament({ color = 'currentColor', size = 20 }) {
  return (
    <svg width={size * 3} height={size} viewBox="0 0 60 20" fill="none">
      <path d="M2 10h18M40 10h18" stroke={color} strokeWidth="1"/>
      <path d="M20 10c2-3 4-3 6 0s4 3 6 0M28 10c2-3 4-3 6 0" stroke={color} strokeWidth="1" fill="none"/>
      <circle cx="30" cy="10" r="1.4" fill={color}/>
    </svg>
  );
}
