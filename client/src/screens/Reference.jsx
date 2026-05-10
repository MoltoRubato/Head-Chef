import { useState } from 'react';
import { IngredientCard, RecipeCard, AbilityCard, RoleCard } from '../Cards.jsx';
import { RECIPES, ABILITIES, SUITS } from '../data.js';

export function ReferenceScreen({ onClose }) {
  const [tab, setTab] = useState('recipes');
  const [flipped, setFlipped] = useState({});
  const tabs = [
    { id: 'recipes',     name: 'Recipes',     count: 19 },
    { id: 'ingredients', name: 'Ingredients', count: 4  },
    { id: 'abilities',   name: 'Abilities',   count: 8  },
    { id: 'roles',       name: 'Roles',       count: 2  },
  ];

  return (
    <div className="wood-bg" style={{ width:'100%', height:'100%', overflow:'hidden', display:'flex', flexDirection:'column', position:'relative' }}>
      <div className="candle-glow" style={{ position:'absolute', top:'-15%', left:'50%', transform:'translateX(-50%)', width:700, height:500 }}/>

      <div style={{ padding:'28px 40px 14px', display:'flex', alignItems:'center', gap:24, position:'relative', zIndex:1 }}>
        <div>
          <div className="label-caps" style={{ fontSize:10, color:'var(--brass)' }}>Head Chef · Card Library</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:36, color:'var(--parchment)', lineHeight:1, fontWeight:500 }}>The Pantry</div>
        </div>
        <div style={{ flex:1, display:'flex', gap:4, justifyContent:'center' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding:'10px 18px',
              borderBottom: tab===t.id ? '2px solid var(--brass-bright)' : '2px solid transparent',
              fontFamily:'var(--font-label)', textTransform:'uppercase', letterSpacing:'0.2em', fontSize:11,
              color: tab===t.id ? 'var(--brass-bright)' : 'var(--ink-dim)',
              display:'flex', alignItems:'baseline', gap:6,
            }}>{t.name} <span style={{ fontFamily:'var(--font-mono)', fontSize:10, opacity:0.7 }}>{t.count}</span></button>
          ))}
        </div>
        <button className="btn-ghost" onClick={onClose}>Back to Service ←</button>
      </div>

      <div className="scroll-warm" style={{ flex:1, padding:'14px 40px 40px', overflowY:'auto', position:'relative', zIndex:1 }}>
        {tab==='recipes' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:18 }}>
            {RECIPES.map(r => (
              <div key={r.id} style={{ display:'flex', justifyContent:'center' }}>
                <RecipeCard recipe={r} size="md"/>
              </div>
            ))}
          </div>
        )}
        {tab==='ingredients' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:28, maxWidth:1100, margin:'0 auto' }}>
            {Object.values(SUITS).map(s => {
              const usage = RECIPES.reduce((a, r) => a + (r.ing[s.id] || 0), 0);
              return (
                <div key={s.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:18, background:'rgba(20,9,10,0.4)', borderRadius:4, border:'1px solid rgba(201,163,82,0.18)' }}>
                  <IngredientCard suit={s.id} size="lg"/>
                  <div className="label-caps" style={{ fontSize:11, color:s.color }}>{s.name}</div>
                  <div style={{ fontSize:12, color:'var(--parchment-deep)', textAlign:'center', lineHeight:1.45, opacity:0.85, fontStyle:'italic' }}>
                    24 cards in the deck. Appears in {usage} of 19 recipes.
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {tab==='abilities' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:22 }}>
            {ABILITIES.map(a => (
              <div key={a.id} style={{ display:'flex', justifyContent:'center' }}>
                <AbilityCard ability={a} size="lg"/>
              </div>
            ))}
          </div>
        )}
        {tab==='roles' && (
          <div style={{ display:'flex', justifyContent:'center', gap:40, marginTop:30 }}>
            {['cook','traitor'].map(r => (
              <div key={r} onClick={() => setFlipped({...flipped, [r]: !flipped[r]})} style={{ perspective:1200, cursor:'pointer' }}>
                <div style={{ transform: flipped[r] ? 'rotateY(180deg)' : 'rotateY(0)', transition:'transform 0.7s', transformStyle:'preserve-3d', position:'relative', width:300, height:420 }}>
                  <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden' }}><RoleCard role={r} size="lg" revealed={false}/></div>
                  <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', transform:'rotateY(180deg)' }}><RoleCard role={r} size="lg" revealed={true}/></div>
                </div>
                <div style={{ textAlign:'center', marginTop:10, fontFamily:'var(--font-script)', fontSize:22, color:'var(--brass)' }}>click to flip</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
