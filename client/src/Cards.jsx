import { SuitIcon, AbilityIcon, ChefHat, Ornament } from './Icons.jsx';
import { DishIcon } from './DishIcons.jsx';
import { SUITS, ROLES, ABILITIES } from './data.js';

export function IngredientCard({ suit, size = 'md', faceDown = false, dim = false, onClick, selected, style = {}, 'data-testid': dataTestId }) {
  const dims = {
    sm: { w: 60,  h: 90,  pad: 6,  big: 22, name: 9  },
    md: { w: 96,  h: 140, pad: 10, big: 36, name: 11 },
    lg: { w: 130, h: 190, pad: 14, big: 50, name: 13 },
  }[size];
  const meta = SUITS[suit];

  if (faceDown) return (
    <div data-testid={dataTestId} onClick={onClick} style={{
      width: dims.w, height: dims.h, borderRadius: 6,
      background: 'linear-gradient(135deg, #5a3a1f 0%, #2e1810 100%)',
      border: '1px solid #8a6a2e', position: 'relative',
      boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
      cursor: onClick ? 'pointer' : 'default', flexShrink: 0, ...style,
    }}>
      <div style={{ position: 'absolute', inset: 4, border: '1px solid var(--brass-deep)', borderRadius: 4, opacity: 0.6 }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ChefHat size={dims.big} color="var(--brass)"/>
      </div>
    </div>
  );

  return (
    <div data-testid={dataTestId} onClick={onClick} className="parchment" style={{
      width: dims.w, height: dims.h, borderRadius: 6, padding: dims.pad,
      position: 'relative', overflow: 'hidden',
      border: `1.5px solid ${meta.color}`,
      boxShadow: selected ? `0 0 0 3px var(--brass-bright), 0 8px 20px rgba(0,0,0,0.5)` : '0 2px 8px rgba(0,0,0,0.4)',
      transform: selected ? 'translateY(-8px)' : 'none',
      transition: 'transform 0.18s, box-shadow 0.18s',
      cursor: onClick ? 'pointer' : 'default',
      opacity: dim ? 0.5 : 1, flexShrink: 0,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      ...style,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="label-caps" style={{ fontSize: dims.name, color: meta.color }}>{meta.name}</div>
        <SuitIcon suit={suit} size={dims.big * 0.4} color={meta.color}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <SuitIcon suit={suit} size={dims.big} color={meta.color}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', transform: 'rotate(180deg)' }}>
        <div className="label-caps" style={{ fontSize: dims.name, color: meta.color }}>{meta.name}</div>
        <SuitIcon suit={suit} size={dims.big * 0.4} color={meta.color}/>
      </div>
    </div>
  );
}

export function RecipeCard({ recipe, size = 'md', placedIngredients = [], status = 'kitchen', glow = false, style = {} }) {
  const dims = {
    sm: { w: 110, h: 160, pad: 8,  title: 12, ico: 16, dish: 32 },
    md: { w: 168, h: 232, pad: 12, title: 17, ico: 20, dish: 48 },
    lg: { w: 240, h: 360, pad: 18, title: 24, ico: 28, dish: 90 },
  }[size];

  const need = [];
  for (const [k, v] of Object.entries(recipe.ing)) for (let i = 0; i < v; i++) need.push(k);
  const remaining = [...need];
  const placedFlags = placedIngredients.map(s => {
    const idx = remaining.indexOf(s);
    if (idx >= 0) { remaining.splice(idx, 1); return true; }
    return false;
  });

  const accent = status === 'served' ? 'var(--cook-green)'
    : status === 'trashed' ? 'var(--traitor-red)'
    : 'var(--brass-deep)';

  return (
    <div className="parchment" style={{
      width: dims.w, height: dims.h, padding: dims.pad,
      borderRadius: 4, position: 'relative', flexShrink: 0,
      border: `1.5px solid ${accent}`,
      boxShadow: glow ? '0 0 0 2px var(--brass-bright), 0 12px 30px rgba(255,174,92,0.3)' : '0 4px 16px rgba(0,0,0,0.4)',
      animation: glow ? 'pulse-glow 2s ease-in-out infinite' : undefined,
      ...style,
    }}>
      <div style={{ position: 'absolute', top:4, left:4,   width:12, height:12, borderTop:`1px solid ${accent}`,    borderLeft:`1px solid ${accent}`,  opacity:0.7 }}/>
      <div style={{ position: 'absolute', top:4, right:4,  width:12, height:12, borderTop:`1px solid ${accent}`,    borderRight:`1px solid ${accent}`, opacity:0.7 }}/>
      <div style={{ position: 'absolute', bottom:4, left:4,  width:12, height:12, borderBottom:`1px solid ${accent}`, borderLeft:`1px solid ${accent}`,  opacity:0.7 }}/>
      <div style={{ position: 'absolute', bottom:4, right:4, width:12, height:12, borderBottom:`1px solid ${accent}`, borderRight:`1px solid ${accent}`, opacity:0.7 }}/>

      <div className="label-caps" style={{ fontSize: 9, color: 'var(--ink-dim)', textAlign: 'center' }}>Recipe</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: dims.title, color: 'var(--ink)', textAlign: 'center', lineHeight: 1.05, marginTop: 4, fontWeight: 500 }}>{recipe.name}</div>
      <div style={{ fontFamily: 'var(--font-script)', fontSize: dims.title * 0.7, color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1, marginTop: 2 }}>{recipe.sub}</div>
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
        <Ornament color="var(--ink-dim)" size={size === 'sm' ? 6 : 10}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: size === 'sm' ? 1 : 2 }}>
        <DishIcon recipeId={recipe.id} size={dims.dish} stroke="var(--ink-soft)"/>
      </div>
      <div style={{ marginTop: size === 'sm' ? 2 : 4, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        {Object.entries(recipe.ing).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: dims.title * 0.7, color: SUITS[k].color, fontWeight: 600, minWidth: 14 }}>{v}×</span>
            <SuitIcon suit={k} size={dims.ico} color={SUITS[k].color}/>
            <span className="label-caps" style={{ fontSize: 10, color: 'var(--ink-soft)' }}>{SUITS[k].name}</span>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: dims.pad, left: dims.pad, right: dims.pad, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 4 }}>
        {need.map((s, i) => (
          <span key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: i < placedFlags.length ? (placedFlags[i] ? SUITS[s].color : 'var(--traitor-red)') : 'transparent',
            border: `1px solid ${SUITS[s].color}`, opacity: 0.9,
          }}/>
        ))}
      </div>
      {status === 'served' && (
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%) rotate(-12deg)', fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--cook-green)', border: '2px solid var(--cook-green)', padding: '2px 12px', letterSpacing: '0.18em', opacity: 0.85 }}>SERVED</div>
      )}
      {status === 'trashed' && (
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%) rotate(-12deg)', fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--traitor-red)', border: '2px solid var(--traitor-red)', padding: '2px 12px', letterSpacing: '0.18em', opacity: 0.85 }}>TRASHED</div>
      )}
    </div>
  );
}

export function AbilityCard({ ability, size = 'md', onClick, used = false, selected = false, style = {} }) {
  const dims = {
    sm: { w: 110, h: 150, pad: 8  },
    md: { w: 160, h: 220, pad: 14 },
    lg: { w: 220, h: 300, pad: 20 },
  }[size];
  return (
    <div onClick={onClick} style={{
      width: dims.w, height: dims.h, padding: dims.pad,
      borderRadius: 4, flexShrink: 0,
      background: 'linear-gradient(180deg, #2a1810 0%, #1a0e08 100%)',
      border: '1.5px solid var(--brass-deep)', color: 'var(--brass-bright)',
      boxShadow: selected ? '0 0 0 2px var(--brass-bright), 0 8px 20px rgba(0,0,0,0.5)' : '0 4px 14px rgba(0,0,0,0.4)',
      transform: selected ? 'translateY(-6px)' : 'none',
      transition: 'transform 0.15s',
      opacity: used ? 0.4 : 1,
      cursor: onClick && !used ? 'pointer' : 'default',
      position: 'relative', display: 'flex', flexDirection: 'column',
      ...style,
    }}>
      <div style={{ position: 'absolute', inset: 4, border: '1px solid var(--brass-deep)', borderRadius: 2, opacity: 0.4 }}/>
      <div className="label-caps" style={{ fontSize: 9, color: 'var(--brass-deep)', textAlign: 'center' }}>Ability</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: size === 'lg' ? 22 : size === 'md' ? 18 : 13, textAlign: 'center', marginTop: 4, fontWeight: 500 }}>{ability.name}</div>
      <div style={{ fontFamily: 'var(--font-script)', fontSize: size === 'lg' ? 18 : 14, textAlign: 'center', color: 'var(--brass)', lineHeight: 1, marginTop: -2 }}>"{ability.alt}"</div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 8px' }}>
        <Ornament color="var(--brass-deep)" size={size === 'sm' ? 5 : 8}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <AbilityIcon id={ability.id} size={size === 'lg' ? 64 : size === 'md' ? 46 : 30} color="var(--brass-bright)"/>
      </div>
      {size !== 'sm' && (
        <div style={{ fontSize: size === 'lg' ? 12 : 10, color: 'var(--parchment-mid)', textAlign: 'center', lineHeight: 1.3, opacity: 0.85, marginTop: 6 }}>{ability.text}</div>
      )}
      {size === 'lg' && (
        <div style={{ fontSize: 10, color: 'var(--brass)', textAlign: 'center', marginTop: 8, fontStyle: 'italic', borderTop: '1px solid var(--brass-deep)', paddingTop: 6 }}>Trigger: {ability.trigger}</div>
      )}
      {used && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-10deg)', color: 'var(--traitor-red-bright)', border: '2px solid var(--traitor-red-bright)', padding: '2px 10px', letterSpacing: '0.2em', fontSize: 11, fontFamily: 'var(--font-display)' }}>USED</div>
      )}
    </div>
  );
}

export function RoleCard({ role, size = 'md', revealed = true, onClick, style = {} }) {
  const meta = ROLES[role];
  const dims = { sm: { w: 130, h: 180 }, md: { w: 220, h: 310 }, lg: { w: 300, h: 420 } }[size];
  if (!revealed) return (
    <div onClick={onClick} style={{
      width: dims.w, height: dims.h, borderRadius: 6,
      background: 'linear-gradient(135deg, #5a3a1f 0%, #2e1810 100%)',
      border: '1.5px solid var(--brass)', cursor: onClick ? 'pointer' : 'default',
      position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 8px 30px rgba(0,0,0,0.6)', ...style,
    }}>
      <div style={{ position: 'absolute', inset: 8, border: '1px solid var(--brass-deep)', borderRadius: 4 }}/>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--brass)' }}>
        <ChefHat size={size === 'lg' ? 80 : 50} color="var(--brass)"/>
        <div className="label-caps" style={{ fontSize: 11, color: 'var(--brass-bright)' }}>Your Role</div>
      </div>
    </div>
  );
  return (
    <div onClick={onClick} style={{
      width: dims.w, height: dims.h, borderRadius: 6, padding: 18,
      background: `linear-gradient(180deg, ${meta.bg} 0%, ${role === 'traitor' ? '#3a0e10' : '#1f3a1c'} 100%)`,
      border: `1.5px solid ${meta.color}`, color: 'var(--parchment)',
      boxShadow: `0 8px 30px rgba(0,0,0,0.6), 0 0 40px ${meta.color}33`,
      position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
      cursor: onClick ? 'pointer' : 'default', ...style,
    }}>
      <div style={{ position: 'absolute', inset: 6, border: `1px solid ${meta.color}`, borderRadius: 4, opacity: 0.5 }}/>
      <div className="label-caps" style={{ fontSize: 10, color: meta.color, opacity: 0.8 }}>You are a</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: size === 'lg' ? 56 : 42, fontWeight: 500, lineHeight: 1, textAlign: 'center' }}>{meta.name}</div>
      <div style={{ fontFamily: 'var(--font-script)', fontSize: size === 'lg' ? 26 : 20, color: meta.color, textAlign: 'center' }}>{meta.tagline}</div>
      <ChefHat size={size === 'lg' ? 80 : 60} color={meta.color}/>
      <div style={{ borderTop: `1px solid ${meta.color}`, paddingTop: 10, fontSize: size === 'lg' ? 13 : 11, lineHeight: 1.4, textAlign: 'center', fontStyle: 'italic', opacity: 0.95 }}>{meta.objective}</div>
    </div>
  );
}
