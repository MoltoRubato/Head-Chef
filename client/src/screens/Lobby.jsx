import { useState, useEffect } from 'react';
import { ChefAvatar, Ornament } from '../Icons.jsx';
import { socket } from '../socket.js';
import { PLAYER_ACCENTS } from '../data.js';

export function LobbyScreen({ onShowReference }) {
  const [tab, setTab] = useState('host');
  const [myName, setMyName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [room, setRoom] = useState(null);
  const [error, setError] = useState('');
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    socket.connect();
    socket.on('room-update', setRoom);
    socket.on('error', ({ message }) => { setError(message); setConnecting(false); });
    return () => {
      socket.off('room-update');
      socket.off('error');
    };
  }, []);

  const handleHost = () => {
    if (!myName.trim()) { setError('Enter your name first'); return; }
    setError('');
    setConnecting(true);
    socket.emit('create-room', { name: myName.trim() });
  };

  const handleJoin = () => {
    if (!myName.trim()) { setError('Enter your name first'); return; }
    if (!joinCode.trim()) { setError('Enter a room code'); return; }
    setError('');
    setConnecting(true);
    socket.emit('join-room', { name: myName.trim(), code: joinCode.trim().toUpperCase() });
  };

  const handleReady = () => socket.emit('set-ready', { ready: true });
  const handleUnready = () => socket.emit('set-ready', { ready: false });

  const handleStartGame = () => socket.emit('start-game');

  const handleSetTraitors = (n) => socket.emit('set-settings', { traitorCount: n });
  const handleSetHush = (v) => socket.emit('set-settings', { kitchenHush: v });

  const me = room?.players.find(p => p.id === socket.id);
  const isHost = me?.isHost;
  const allReady = room?.players.length >= 3 && room.players.every(p => p.ready);

  return (
    <div className="wood-bg" style={{ width:'100%', height:'100%', position:'relative', overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div className="candle-glow" style={{ position:'absolute', top:-100, left:-100, width:500, height:500 }}/>
      <div className="candle-glow" style={{ position:'absolute', bottom:-150, right:-100, width:600, height:600 }}/>

      <div style={{ textAlign:'center', padding:'36px 0 18px', position:'relative', zIndex:1 }}>
        <div className="label-caps" style={{ color:'var(--brass)', fontSize:11 }}>Maison des Cinq · est. 1923</div>
        <div style={{ fontFamily:'var(--font-display)', fontSize:84, color:'var(--brass-bright)', letterSpacing:'0.04em', lineHeight:0.95, fontWeight:500, textShadow:'0 0 30px rgba(255,174,92,0.3)' }}>
          Head Chef
        </div>
        <div style={{ display:'flex', justifyContent:'center', marginTop:4 }}>
          <Ornament color="var(--brass)" size={14}/>
        </div>
        <div style={{ fontFamily:'var(--font-script)', color:'var(--brass-bright)', fontSize:26, marginTop:4 }}>
          a delicious deduction
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 480px 1fr', gap:32, padding:'0 60px 40px', flex:1, position:'relative', zIndex:1 }}>
        {/* left */}
        <div style={{ padding:'20px 16px' }}>
          <div className="label-caps" style={{ color:'var(--brass)', fontSize:11, marginBottom:14 }}>The night ahead</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:22, lineHeight:1.25, color:'var(--parchment)', marginBottom:16, fontWeight:400 }}>
            A famous critic is dining tonight. Together, your kitchen must serve five flawless dishes — but a rival has paid one of you to ruin the meal.
          </div>
          <div style={{ height:1, background:'linear-gradient(90deg, transparent, var(--brass-deep), transparent)', margin:'20px 0' }}/>
          <button className="btn-ghost" onClick={onShowReference}>Browse the Card Library →</button>
        </div>

        {/* center: room card */}
        {!room ? (
          <div className="parchment" style={{ borderRadius:4, padding:28, boxShadow:'0 30px 80px rgba(0,0,0,0.5)', border:'1px solid var(--brass-deep)', position:'relative' }}>
            <div style={{ position:'absolute', inset:8, border:'1px solid var(--ink-dim)', borderRadius:2, opacity:0.3, pointerEvents:'none' }}/>
            <div style={{ display:'flex', borderBottom:'1px solid var(--ink-dim)', marginBottom:18 }}>
              {['host','join'].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  flex:1, padding:'8px 0',
                  fontFamily:'var(--font-label)', textTransform:'uppercase', letterSpacing:'0.2em', fontSize:11,
                  color: tab===t ? 'var(--ink)' : 'var(--ink-dim)',
                  borderBottom: tab===t ? '2px solid var(--ink)' : '2px solid transparent',
                  marginBottom:-1,
                }}>{t==='host' ? 'Host a Service' : 'Join a Kitchen'}</button>
              ))}
            </div>

            <div style={{ marginBottom:16 }}>
              <div className="label-caps" style={{ fontSize:9, color:'var(--ink-dim)', marginBottom:4 }}>Your name</div>
              <input
                data-testid="name-input"
                value={myName}
                onChange={e => setMyName(e.target.value)}
                onKeyDown={e => e.key==='Enter' && (tab==='host' ? handleHost() : handleJoin())}
                placeholder="Chef name…"
                style={{ width:'100%', background:'transparent', border:'none', borderBottom:'1px solid var(--ink-dim)', fontFamily:'var(--font-display)', fontSize:22, color:'var(--ink)', padding:'4px 0', outline:'none' }}
              />
            </div>

            {tab==='join' && (
              <div style={{ marginBottom:14 }}>
                <div className="label-caps" style={{ fontSize:9, color:'var(--ink-dim)', marginBottom:4 }}>Room code</div>
                <input
                  data-testid="join-code-input"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key==='Enter' && handleJoin()}
                  placeholder="SAUCE-49"
                  style={{ width:'100%', background:'transparent', border:'1px solid var(--ink-soft)', borderRadius:2, fontFamily:'var(--font-display)', fontSize:28, color:'var(--ink)', padding:'8px 14px', outline:'none', letterSpacing:'0.1em' }}
                />
              </div>
            )}

            {error && <div style={{ color:'var(--traitor-red)', fontSize:12, marginBottom:10 }}>{error}</div>}

            <button
              data-testid={tab==='host' ? 'host-btn' : 'join-btn'}
              className="btn-brass"
              onClick={tab==='host' ? handleHost : handleJoin}
              disabled={connecting}
              style={{ width:'100%', padding:'14px 0', fontSize:13, marginTop:8 }}
            >
              {connecting ? 'Connecting…' : tab==='host' ? 'Open the Kitchen' : 'Enter the Kitchen'}
            </button>
          </div>
        ) : (
          /* room lobby */
          <div className="parchment" style={{ borderRadius:4, padding:28, boxShadow:'0 30px 80px rgba(0,0,0,0.5)', border:'1px solid var(--brass-deep)', position:'relative', display:'flex', flexDirection:'column' }}>
            <div style={{ position:'absolute', inset:8, border:'1px solid var(--ink-dim)', borderRadius:2, opacity:0.3, pointerEvents:'none' }}/>

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:16 }}>
              <div>
                <div className="label-caps" style={{ fontSize:9, color:'var(--ink-dim)' }}>Room code</div>
                <div data-testid="room-code" style={{ fontFamily:'var(--font-display)', fontSize:32, color:'var(--ink)', letterSpacing:'0.1em', fontWeight:600 }}>{room.code}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div className="label-caps" style={{ fontSize:9, color:'var(--ink-dim)' }}>Seats</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:24, color:'var(--ink)' }}>{room.players.length}<span style={{ color:'var(--ink-dim)', fontSize:16 }}>/6</span></div>
              </div>
            </div>

            {isHost && (
              <>
                <div className="label-caps" style={{ fontSize:9, color:'var(--ink-dim)', marginBottom:6 }}>Traitors</div>
                <div style={{ display:'flex', gap:6, marginBottom:14 }}>
                  {[1,2].map(n => (
                    <button key={n} onClick={() => handleSetTraitors(n)} style={{
                      flex:1, padding:'8px 0',
                      background: room.settings.traitorCount===n ? 'var(--ink)' : 'transparent',
                      color: room.settings.traitorCount===n ? 'var(--parchment)' : 'var(--ink)',
                      border:'1px solid var(--ink-soft)',
                      fontFamily:'var(--font-label)', textTransform:'uppercase', letterSpacing:'0.2em', fontSize:11,
                    }}>{n} {n===2 ? '· Rival × 2' : '· Standard'}</button>
                  ))}
                </div>
                <label style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14, cursor:'pointer' }}>
                  <div onClick={() => handleSetHush(!room.settings.kitchenHush)} style={{ width:18, height:18, border:'1px solid var(--ink)', borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center', background: room.settings.kitchenHush ? 'var(--ink)' : 'transparent' }}>
                    {room.settings.kitchenHush && <div style={{ color:'var(--parchment)', fontSize:12 }}>✓</div>}
                  </div>
                  <div>
                    <div style={{ fontFamily:'var(--font-display)', fontSize:16, color:'var(--ink)' }}>Kitchen Hush variant</div>
                    <div style={{ fontSize:11, color:'var(--ink-soft)', fontStyle:'italic' }}>No talk of held cards outside a De-Toque.</div>
                  </div>
                </label>
              </>
            )}

            <div className="label-caps" style={{ fontSize:9, color:'var(--ink-dim)', marginBottom:8 }}>Tonight's brigade</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6, flex:1 }}>
              {room.players.map((p, i) => (
                <div key={p.id} style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <ChefAvatar size={32} accent={PLAYER_ACCENTS[i % PLAYER_ACCENTS.length]} tone={i}/>
                  <div style={{ flex:1 }}>
                    <span style={{ fontFamily:'var(--font-display)', fontSize:16, color:'var(--ink)' }}>{p.name}</span>
                    {p.isHost && <span className="label-caps" style={{ fontSize:9, color:'var(--brass-deep)', marginLeft:8 }}>· host</span>}
                  </div>
                  <div className="label-caps" style={{ fontSize:9, color: p.ready ? 'var(--cook-green)' : 'var(--ink-dim)' }}>
                    {p.ready ? '● ready' : '○ waiting'}
                  </div>
                </div>
              ))}
              {Array.from({ length: Math.max(0, 3 - room.players.length) }).map((_, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, opacity:0.45 }}>
                  <div style={{ width:32, height:32, borderRadius:'50%', border:'1px dashed var(--ink-dim)' }}/>
                  <div style={{ fontFamily:'var(--font-script)', fontSize:18, color:'var(--ink-dim)' }}>seat open…</div>
                </div>
              ))}
            </div>

            <div style={{ height:1, background:'var(--ink-dim)', opacity:0.3, margin:'14px 0 12px' }}/>

            {!me?.ready ? (
              <button data-testid="ready-btn" className="btn-brass" onClick={handleReady} style={{ width:'100%', padding:'14px 0', fontSize:13, marginBottom:8 }}>I'm Ready</button>
            ) : (
              <button className="btn-ghost" onClick={handleUnready} style={{ width:'100%', padding:'14px 0', marginBottom:8 }}>Not Ready</button>
            )}

            {isHost && (
              <button
                data-testid="start-btn"
                className="btn-brass"
                onClick={handleStartGame}
                disabled={!allReady || room.players.length < 3}
                style={{ width:'100%', padding:'14px 0', fontSize:13 }}
              >
                {room.players.length < 3 ? 'Need 3+ players' : allReady ? 'Begin Service' : 'Waiting for all players…'}
              </button>
            )}
          </div>
        )}

        {/* right */}
        <div style={{ padding:'20px 16px' }}>
          <div className="label-caps" style={{ color:'var(--brass)', fontSize:11, marginBottom:14 }}>Tonight's table</div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              { k:'Win at',    v:'5 served · 4 trashed' },
              { k:'De-Toque',  v:'unlocks after 3 dishes' },
              { k:'Max dishes', v:'8 total' },
              { k:'Estimated', v:'25–40 minutes' },
            ].map(r => (
              <div key={r.k} style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', borderBottom:'1px solid rgba(201,163,82,0.18)', paddingBottom:6 }}>
                <div className="label-caps" style={{ fontSize:10, color:'var(--ink-dim)' }}>{r.k}</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:18, color:'var(--parchment)' }}>{r.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
