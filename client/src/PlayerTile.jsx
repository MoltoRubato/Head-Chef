import { ChefAvatar, BellIcon } from './Icons.jsx';

export function PlayerTile({ player, isYou, hasChef, isActive, traitor, hand = 2, used = false, mood = 'neutral', compact = false, style = {} }) {
  const W = compact ? 130 : 170;
  return (
    <div style={{
      width: W, padding: 10, borderRadius: 4,
      background: isActive
        ? 'linear-gradient(180deg, rgba(201,163,82,0.25) 0%, rgba(20,9,10,0.6) 100%)'
        : 'rgba(20,9,10,0.55)',
      border: isActive ? '1.5px solid var(--brass-bright)' : '1px solid rgba(201,163,82,0.25)',
      boxShadow: isActive ? '0 0 24px rgba(255,174,92,0.25)' : 'none',
      transition: 'all 0.2s', position: 'relative',
      ...style,
    }}>
      {hasChef && (
        <div title="Chef Token" style={{
          position: 'absolute', top: -10, right: -10,
          width: 36, height: 36, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--brass-bright) 0%, var(--brass) 60%, var(--brass-deep) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 18px rgba(255,174,92,0.7), 0 2px 4px rgba(0,0,0,0.5)',
          border: '1px solid var(--brass-deep)',
        }}>
          <BellIcon size={20} color="var(--bg-deep)"/>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <ChefAvatar accent={player.accent} tone={player.seat || 0} size={compact ? 40 : 52} mood={mood} traitor={traitor}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: compact ? 14 : 18, color: isYou ? 'var(--brass-bright)' : 'var(--parchment)', lineHeight: 1, fontWeight: 500 }}>
            {player.name}{isYou ? ' (you)' : ''}
          </div>
          <div className="label-caps" style={{ fontSize: 9, color: 'var(--ink-dim)', marginTop: 3 }}>
            {used ? 'ability used' : 'ability ready'}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 8 }}>
        {Array.from({ length: Math.max(0, hand) }).map((_, i) => (
          <div key={i} style={{
            width: 22, height: 32, borderRadius: 2,
            background: 'linear-gradient(135deg, #5a3a1f 0%, #2e1810 100%)',
            border: '1px solid var(--brass-deep)',
            transform: `rotate(${i % 2 ? 4 : -4}deg) translateX(${i * -4}px)`,
          }}/>
        ))}
        <div style={{
          width: 22, height: 32, borderRadius: 2,
          background: used ? 'rgba(0,0,0,0.4)' : 'linear-gradient(135deg, #c9a352 0%, #8a6a2e 100%)',
          border: '1px solid var(--brass-bright)',
          transform: 'rotate(8deg) translateX(-2px)',
          marginLeft: 4, position: 'relative',
        }}>
          {!used && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-deep)', fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 600 }}>A</div>}
        </div>
      </div>
    </div>
  );
}
