import { useState } from 'react';
import { ChefAvatar, Ornament } from '../Icons.jsx';
import { RoleCard } from '../Cards.jsx';
import { PLAYER_ACCENTS } from '../data.js';

export function RoleRevealScreen({ myRole, myAbility, players, traitorCount, onContinue }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="wood-bg" style={{ width:'100%', height:'100%', position:'relative', overflow:'hidden', display:'flex', alignItems:'stretch', justifyContent:'center' }}>
      <div className="candle-glow" style={{ position:'absolute', top:'-20%', left:'50%', transform:'translateX(-50%)', width:800, height:600 }}/>

      {/* left: rules */}
      <div style={{ width:380, padding:'60px 36px', position:'relative', zIndex:1, borderRight:'1px solid rgba(201,163,82,0.15)', overflowY:'auto' }}>
        <div className="label-caps" style={{ color:'var(--brass)', fontSize:11, marginBottom:8 }}>House Rules · Refresher</div>
        <div style={{ fontFamily:'var(--font-display)', fontSize:36, color:'var(--parchment)', lineHeight:1.05, marginBottom:18, fontWeight:500 }}>The full course</div>
        <ol style={{ listStyle:'none', counterReset:'step', display:'flex', flexDirection:'column', gap:14 }}>
          {[
            ['Take a turn', 'Play one ingredient face up under one of the two recipes in the kitchen, then refill to two cards.'],
            ['Build dishes', 'A recipe completes the moment its exact four ingredients are placed — or a single wrong ingredient turns it into a Trashed Dish.'],
            ['Pass the bell', 'After each dish, the player who completed it gets the Chef Token. 5 Served wins for Cooks; 4 Trashed wins for Traitors.'],
            ['De-Toque', 'After the third dish, the Chef may call a vote to expose a Traitor. If the accused is a Traitor, Cooks win. If a Cook is wrongly hatted, Traitors do.'],
          ].map(([h, d], i) => (
            <li key={i} style={{ position:'relative', paddingLeft:36 }}>
              <div style={{ position:'absolute', left:0, top:0, width:26, height:26, borderRadius:'50%', border:'1px solid var(--brass)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:14, color:'var(--brass-bright)' }}>{i+1}</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:18, color:'var(--parchment)', lineHeight:1.1, fontWeight:500 }}>{h}</div>
              <div style={{ fontSize:12, color:'var(--parchment-deep)', marginTop:4, lineHeight:1.45, opacity:0.85 }}>{d}</div>
            </li>
          ))}
        </ol>
      </div>

      {/* center: card flip */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40, position:'relative', zIndex:1 }}>
        <div className="label-caps" style={{ color:'var(--brass)', fontSize:11, marginBottom:10 }}>Your secret role</div>
        <div style={{ fontFamily:'var(--font-display)', fontSize:32, color:'var(--parchment)', textAlign:'center', maxWidth:460, lineHeight:1.1, marginBottom:28, fontWeight:400 }}>
          {revealed ? (myRole==='cook' ? 'You are loyal to the kitchen.' : 'A rival house has bought you.') : 'Lift your apron — quietly.'}
        </div>

        <div onClick={() => setRevealed(true)} style={{ perspective:1200, width:300, height:420, cursor:'pointer' }}>
          <div style={{ transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)', transition:'transform 0.8s cubic-bezier(0.4,0,0.2,1)', transformStyle:'preserve-3d', position:'relative', width:'100%', height:'100%' }}>
            <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden' }}>
              <RoleCard role={myRole} size="lg" revealed={false}/>
            </div>
            <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden', transform:'rotateY(180deg)' }}>
              <RoleCard role={myRole} size="lg" revealed={true}/>
            </div>
          </div>
        </div>

        {revealed && myAbility && (
          <div style={{ marginTop:16, padding:'8px 18px', background:'rgba(201,163,82,0.12)', border:'1px solid var(--brass-deep)', borderRadius:2, fontSize:12, color:'var(--brass-bright)', textAlign:'center' }}>
            Your ability: <strong>{myAbility.name}</strong> — {myAbility.alt}
          </div>
        )}

        <div style={{ marginTop:16, fontSize:13, color:'var(--ink-dim)', fontStyle:'italic' }}>
          {revealed ? 'No one else may see this card. Memorise it.' : 'Click the card when no one is looking.'}
        </div>
        <button data-testid="take-station-btn" onClick={onContinue} disabled={!revealed} className="btn-brass" style={{ marginTop:24, padding:'14px 32px' }}>
          {revealed ? 'Take My Station →' : 'Reveal First'}
        </button>
      </div>

      {/* right: brigade */}
      <div style={{ width:320, padding:'60px 32px', position:'relative', zIndex:1, borderLeft:'1px solid rgba(201,163,82,0.15)', overflowY:'auto' }}>
        <div className="label-caps" style={{ color:'var(--brass)', fontSize:11, marginBottom:12 }}>Tonight's brigade</div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {players.map((p, i) => (
            <div key={p.id} style={{ display:'flex', alignItems:'center', gap:12 }}>
              <ChefAvatar size={42} accent={PLAYER_ACCENTS[i % PLAYER_ACCENTS.length]} tone={i}/>
              <div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:17, color:'var(--parchment)', fontWeight:500 }}>{p.name}{p.isMe ? ' (you)' : ''}</div>
                <div className="label-caps" style={{ fontSize:9, color:'var(--ink-dim)' }}>seat {i+1}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height:1, background:'rgba(201,163,82,0.18)', margin:'24px 0' }}/>
        <div style={{ fontSize:11, color:'var(--parchment-deep)', lineHeight:1.5, fontStyle:'italic' }}>
          Among the {players.length} chefs, exactly {traitorCount} {traitorCount===1?'has':'have'} been bought by a rival house. Watch carefully.
        </div>
      </div>
    </div>
  );
}
