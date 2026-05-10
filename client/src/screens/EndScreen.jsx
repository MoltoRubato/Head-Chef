import { ChefAvatar, Ornament } from '../Icons.jsx';
import { PLAYER_ACCENTS } from '../data.js';

export function EndScreen({ result, players, served, trashed, onReplay }) {
  const cookWin = result === 'cook';
  const verdict = cookWin ? '★★★★★' : '☆☆☆☆☆';

  return (
    <div className="wood-bg" style={{ width:'100%', height:'100%', position:'relative', overflow:'hidden', display:'flex' }}>
      <div className="candle-glow" style={{ position:'absolute', top:'-15%', left:'50%', transform:'translateX(-50%)', width:900, height:600 }}/>

      {/* left: critic verdict */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
        <div className="parchment" style={{ width:'min(440px, 100%)', padding:'36px 32px', borderRadius:2, boxShadow:'0 30px 80px rgba(0,0,0,0.6)', position:'relative', border:'1px solid var(--ink-dim)', overflow:'hidden' }}>
          <div className="label-caps" style={{ fontSize:9, color:'var(--ink-dim)', textAlign:'center' }}>Le Gourmand · Volume IV</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:56, color:'var(--ink)', textAlign:'center', lineHeight:0.95, fontWeight:600, fontStyle:'italic', margin:'8px 0' }}>The Review</div>
          <div style={{ display:'flex', justifyContent:'center', margin:'4px 0 18px' }}>
            <Ornament color="var(--ink-dim)" size={12}/>
          </div>
          <div style={{ textAlign:'center', fontFamily:'var(--font-display)', fontSize:30, color: cookWin ? 'var(--cook-green)' : 'var(--traitor-red)', letterSpacing:'0.3em', marginBottom:18 }}>
            {verdict}
          </div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:20, lineHeight:1.4, color:'var(--ink)', textAlign:'left', fontStyle:'italic', overflowWrap:'break-word', hyphens:'auto' }}>
            {cookWin
              ? '"A flawless evening at Maison des Cinq. Five dishes in succession, each more inspired than the last. The brigade moves as one — a kitchen worth its candle."'
              : '"What was meant to be a feast became a parade of misfires. One wonders whether the Chef noticed the saboteur in his own kitchen. A scolding is the kindest word."'}
          </div>
          <div style={{ marginTop:20, fontFamily:'var(--font-script)', fontSize:28, color:'var(--ink-soft)', textAlign:'right' }}>— Mme. Dubois</div>
          <div style={{ marginTop:16, display:'flex', gap:12, fontSize:13, color:'var(--ink-soft)', justifyContent:'center' }}>
            <span>Served: <strong>{served}</strong></span>
            <span>·</span>
            <span>Trashed: <strong>{trashed}</strong></span>
          </div>
        </div>
      </div>

      {/* right: roster reveal */}
      <div style={{ width:380, padding:'60px 32px', borderLeft:'1px solid rgba(201,163,82,0.18)', background:'rgba(0,0,0,0.35)', display:'flex', flexDirection:'column' }}>
        <div className="label-caps" style={{ fontSize:10, color:'var(--brass)' }}>Reveal · Tonight's brigade</div>
        <div style={{ fontFamily:'var(--font-display)', fontSize:36, color: cookWin ? 'var(--cook-green-bright)' : 'var(--traitor-red-bright)', lineHeight:1, marginBottom:18, fontWeight:500 }}>
          {cookWin ? 'Cooks Win' : 'Traitors Win'}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:12, flex:1 }}>
          {players.map((p, i) => (
            <div key={p.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 12px', borderRadius:2, background: p.role==='traitor' ? 'rgba(139,42,47,0.25)' : 'rgba(74,103,65,0.18)', border:`1px solid ${p.role==='traitor' ? 'var(--traitor-red)' : 'var(--cook-green)'}` }}>
              <ChefAvatar size={42} accent={PLAYER_ACCENTS[i % PLAYER_ACCENTS.length]} tone={i} traitor={p.role==='traitor'}/>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:'var(--font-display)', fontSize:18, color:'var(--parchment)', fontWeight:500 }}>{p.name}</div>
                <div className="label-caps" style={{ fontSize:9, color: p.role==='traitor' ? 'var(--traitor-red-bright)' : 'var(--cook-green-bright)' }}>
                  {p.role==='traitor' ? 'Bought · Traitor' : 'Loyal · Cook'}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button data-testid="replay-btn" className="btn-brass" onClick={onReplay} style={{ marginTop:18, padding:'12px 0' }}>Another Service</button>
      </div>
    </div>
  );
}
