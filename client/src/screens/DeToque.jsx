import { useState, useEffect } from 'react';
import { ChefAvatar, Ornament } from '../Icons.jsx';
import { RoleCard } from '../Cards.jsx';
import { socket } from '../socket.js';
import { PLAYER_ACCENTS } from '../data.js';

export function DeToqueScreen({ players, votes, phase, accused, yourVote, onDismiss }) {
  const [timer, setTimer] = useState(180);

  useEffect(() => {
    if (phase !== 'discussion') return;
    const t = setInterval(() => setTimer(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const tally = {};
  Object.values(votes || {}).forEach(t => { tally[t] = (tally[t] || 0) + 1; });

  const m = String(Math.floor(timer / 60));
  const s = String(timer % 60).padStart(2, '0');
  const me = players.find(p => p.isMe);

  const castVote = (targetSeat) => {
    if (phase !== 'vote' || me?.seat === targetSeat) return;
    socket.emit('cast-vote', { targetSeat });
  };

  const advancePhase = () => socket.emit('detoque-advance');

  return (
    <div className="wood-bg" style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
      <div className="candle-glow" style={{ position:'absolute', top:'-20%', left:'20%', width:700, height:700 }}/>
      <div className="candle-glow" style={{ position:'absolute', bottom:'-30%', right:'10%', width:800, height:800 }}/>

      <div style={{ textAlign:'center', padding:'36px 40px 12px', position:'relative', zIndex:1 }}>
        <div className="label-caps" style={{ fontSize:11, color:'var(--traitor-red-bright)' }}>De-Toque — Whose toque shall we lift?</div>
        <div style={{ fontFamily:'var(--font-display)', fontSize:56, color:'var(--parchment)', lineHeight:1, fontWeight:500, marginTop:4 }}>
          "Whose toque shall we lift?"
        </div>
        <div style={{ fontFamily:'var(--font-script)', fontSize:22, color:'var(--brass-bright)', marginTop:4 }}>
          a vote before the critic
        </div>
      </div>

      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:28, position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', gap:16, flexWrap:'wrap', justifyContent:'center' }}>
          {players.map((p, i) => {
            const count = tally[p.seat] || 0;
            const youVotedThis = yourVote === p.seat;
            return (
              <div key={p.id}
                data-testid={`vote-player-${p.seat}`}
                onClick={() => castVote(p.seat)}
                style={{
                  padding:16, borderRadius:4, width:180,
                  background:'rgba(20,9,10,0.55)',
                  border: youVotedThis ? '2px solid var(--traitor-red-bright)' : '1px solid rgba(201,163,82,0.25)',
                  cursor: phase==='vote' && !p.isMe ? 'pointer' : 'default',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:10,
                  transform: youVotedThis ? 'translateY(-6px)' : 'none',
                  transition:'all 0.2s',
                }}>
                <ChefAvatar size={84} accent={PLAYER_ACCENTS[i % PLAYER_ACCENTS.length]} tone={i}/>
                <div style={{ fontFamily:'var(--font-display)', fontSize:22, color:'var(--parchment)', fontWeight:500 }}>{p.name}{p.isMe ? ' (you)' : ''}</div>
                <div className="label-caps" style={{ fontSize:9, color:'var(--ink-dim)' }}>seat {i+1}</div>
                <div style={{ display:'flex', gap:4, minHeight:22, alignItems:'center' }}>
                  {Array.from({ length: count }).map((_, j) => (
                    <div key={j} style={{ width:18, height:18, borderRadius:'50%', background:'radial-gradient(circle, var(--brass-bright), var(--brass-deep))', border:'1px solid var(--brass-deep)' }}/>
                  ))}
                </div>
                {youVotedThis && <div className="label-caps" style={{ fontSize:9, color:'var(--traitor-red-bright)' }}>Your vote</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding:'24px 40px', display:'flex', alignItems:'center', gap:24, borderTop:'1px solid rgba(201,163,82,0.18)', background:'rgba(0,0,0,0.4)', position:'relative', zIndex:1 }}>
        {phase === 'discussion' ? (
          <>
            <div>
              <div className="label-caps" style={{ fontSize:10, color:'var(--brass)' }}>Discussion phase</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:28, color:'var(--parchment)' }}>{m}:{s}</div>
            </div>
            <div style={{ flex:1, fontSize:13, color:'var(--parchment-deep)', lineHeight:1.5, fontStyle:'italic', maxWidth:600 }}>
              Speak freely. Cards held in your hand may now be discussed openly. When ready, move to the vote.
            </div>
            <button className="btn-brass" onClick={advancePhase} style={{ padding:'12px 28px' }}>Begin Voting →</button>
          </>
        ) : (
          <>
            <div>
              <div className="label-caps" style={{ fontSize:10, color:'var(--brass)' }}>Voting</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:22, color:'var(--parchment)' }}>
                {yourVote != null ? `You voted for seat ${yourVote + 1}` : 'Cast your vote'}
              </div>
            </div>
            <div style={{ flex:1, fontSize:13, color:'var(--parchment-deep)', fontStyle:'italic' }}>
              {accused != null
                ? `${players.find(p => p.seat === accused)?.name || '?'} is most accused — ${tally[accused] || 0} vote(s).`
                : 'No votes yet.'}
            </div>
            <button
              data-testid="lift-toque-btn"
              className="btn-brass"
              disabled={yourVote == null}
              onClick={advancePhase}
              style={{ padding:'12px 28px' }}
            >
              Lift the Toque →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function DeToqueRevealScreen({ accusedPlayer, wasTraitor, onContinue }) {
  return (
    <div className="wood-bg" style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
      <div className="candle-glow" style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)', width:800, height:600 }}/>
      <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
        <div className="label-caps" style={{ fontSize:11, color:'var(--brass)' }}>The toque is lifted</div>
        <div style={{ fontFamily:'var(--font-display)', fontSize:56, color:'var(--parchment)', margin:'8px 0 24px', fontWeight:500 }}>
          {accusedPlayer?.name} reveals…
        </div>
        <RoleCard role={wasTraitor ? 'traitor' : 'cook'} size="lg" revealed={true} style={{ margin:'0 auto' }}/>
        <div style={{ fontFamily:'var(--font-script)', fontSize:32, color: wasTraitor ? 'var(--cook-green-bright)' : 'var(--traitor-red-bright)', marginTop:24 }}>
          {wasTraitor ? 'Cooks win the night.' : 'Traitors win the night.'}
        </div>
        <button className="btn-brass" onClick={onContinue} style={{ marginTop:24, padding:'14px 36px' }}>
          See the Critic's Review →
        </button>
      </div>
    </div>
  );
}
