import { useState } from 'react';
import { Ornament } from '../Icons.jsx';
import { IngredientCard, RecipeCard, AbilityCard } from '../Cards.jsx';
import { PlayerTile } from '../PlayerTile.jsx';
import { SUITS, ABILITIES } from '../data.js';
import { wouldTrash } from '../gameLogic.js';
import { socket } from '../socket.js';

function ServedSlot({ kind, count, max }) {
  const isServed = kind === 'served';
  const c = isServed ? 'var(--cook-green-bright)' : 'var(--traitor-red-bright)';
  return (
    <div style={{ flex:1, padding:'8px 14px', borderRadius:2, border:`1px solid ${c}`, background:'rgba(0,0,0,0.35)' }}>
      <div className="label-caps" style={{ fontSize:9, color:c, opacity:0.85 }}>{isServed ? 'Served to Critic' : 'Trashed'}</div>
      <div style={{ display:'flex', alignItems:'baseline', gap:8, marginTop:2 }}>
        <div style={{ fontFamily:'var(--font-display)', fontSize:32, color:c, lineHeight:1, fontWeight:500 }}>{count}</div>
        <div style={{ fontSize:11, color:'var(--ink-dim)' }}>of {max}</div>
        <div style={{ flex:1, display:'flex', gap:4, justifyContent:'flex-end' }}>
          {Array.from({ length: max }).map((_, i) => (
            <div key={i} style={{ width:8, height:8, borderRadius:'50%', background: i<count ? c : 'rgba(0,0,0,0.4)', border:`1px solid ${c}` }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActionLog({ entries }) {
  return (
    <div className="scroll-warm" style={{ overflowY:'auto', flex:1, padding:'8px 14px' }}>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {entries.map((e, i) => (
          <div key={i} style={{ display:'flex', gap:8, fontSize:12, color: e.kind==='sys' ? 'var(--brass)' : 'var(--parchment)', fontStyle: e.kind==='sys' ? 'italic' : 'normal', lineHeight:1.45, opacity: i===0 ? 1 : Math.max(0.3, 0.9 - i*0.05) }}>
            <div style={{ flexShrink:0, color:'var(--ink-dim)', fontFamily:'var(--font-mono)', fontSize:10, marginTop:2 }}>{String(entries.length-i).padStart(2,'0')}</div>
            <div>{e.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlacedStack({ ingredients, recipe }) {
  const need = { ...recipe.ing };
  const placedCount = {};
  return (
    <div style={{ display:'flex', gap:6, flexWrap:'wrap', minHeight:36 }}>
      {ingredients.map((s, i) => {
        placedCount[s] = (placedCount[s] || 0) + 1;
        const wrong = !need[s] || placedCount[s] > need[s];
        return (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 8px', borderRadius:2, background:SUITS[s].bg, color:SUITS[s].color, border:`1px solid ${SUITS[s].color}`, opacity: wrong?0.6:1, position:'relative' }}>
            <span className="label-caps" style={{ fontSize:9 }}>{SUITS[s].name}</span>
            {wrong && <div style={{ position:'absolute', inset:0, border:'1.5px solid var(--traitor-red)', borderRadius:2, pointerEvents:'none' }}/>}
          </div>
        );
      })}
      {ingredients.length===0 && <div style={{ fontSize:11, color:'var(--ink-dim)', fontStyle:'italic', padding:'4px 8px' }}>No ingredients placed yet.</div>}
    </div>
  );
}

export function GameTableScreen({ gameState, myHand, myRole, myAbility, myAbilityUsed, onCallDeToque, onShowReference }) {
  const [selectedHand, setSelectedHand] = useState(null);
  const [hoverRecipe, setHoverRecipe] = useState(null);
  const [showAbility, setShowAbility] = useState(false);

  const { kitchen, served, trashed, players, chef, activeSeat, log, ingDeckSize, recDeckSize } = gameState;
  const me = players.find(p => p.isMe);
  const others = players.filter(p => !p.isMe);
  const yourTurn = activeSeat === me?.seat;
  const dishes = served.length + trashed.length;
  const canDeToque = me?.seat === chef && dishes >= 3 && served.length < 5 && trashed.length < 4;
  const ability = ABILITIES.find(a => a.id === myAbility);

  const playIngredient = (kitchenIdx) => {
    if (!yourTurn || selectedHand === null) return;
    socket.emit('play-ingredient', { kitchenIdx, handIdx: selectedHand });
    setSelectedHand(null);
  };

  const useAbility = () => {
    socket.emit('use-ability');
    setShowAbility(false);
  };

  return (
    <div className="wood-bg" style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
      <div className="candle-glow" style={{ position:'absolute', top:'30%', left:'50%', transform:'translateX(-50%)', width:800, height:400 }}/>

      {/* HEADER */}
      <div style={{ display:'flex', alignItems:'center', padding:'14px 22px', borderBottom:'1px solid rgba(201,163,82,0.18)', background:'rgba(0,0,0,0.35)', position:'relative', zIndex:2 }}>
        <div>
          <div className="label-caps" style={{ fontSize:9, color:'var(--brass)' }}>Maison des Cinq · The Critic's Table</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:22, color:'var(--parchment)', lineHeight:1, fontWeight:500 }}>Head Chef</div>
        </div>
        <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', gap:12 }}>
          <ServedSlot kind="served" count={served.length} max={5}/>
          <div style={{ fontFamily:'var(--font-script)', fontSize:28, color:'var(--brass)' }}>·</div>
          <ServedSlot kind="trashed" count={trashed.length} max={4}/>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <div style={{ textAlign:'right' }}>
            <div className="label-caps" style={{ fontSize:9, color:'var(--ink-dim)' }}>Dishes</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:20, color:'var(--parchment)' }}>{dishes}<span style={{ color:'var(--ink-dim)', fontSize:12 }}>/8</span></div>
          </div>
          <button className="btn-ghost" onClick={onShowReference}>Cards</button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'260px 1fr 280px', gap:0, overflow:'hidden', position:'relative', zIndex:1 }}>
        {/* LEFT: brigade */}
        <div style={{ padding:'20px 14px', display:'flex', flexDirection:'column', gap:10, borderRight:'1px solid rgba(201,163,82,0.12)', overflowY:'auto' }}>
          <div className="label-caps" style={{ fontSize:10, color:'var(--brass)', marginBottom:4 }}>The Brigade</div>
          {others.map((p, i) => (
            <PlayerTile
              key={p.id}
              player={p}
              hasChef={p.seat === chef}
              isActive={p.seat === activeSeat}
              used={p.abilityUsed}
              hand={p.cardCount}
              mood="neutral"
            />
          ))}
        </div>

        {/* CENTER: kitchen */}
        <div style={{ padding:'20px 22px', display:'flex', flexDirection:'column', gap:16, overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <Ornament color="var(--brass)" size={10}/>
            <div className="label-caps" style={{ fontSize:10, color:'var(--brass)' }}>The Kitchen</div>
            <div style={{ flex:1, height:1, background:'linear-gradient(90deg, var(--brass-deep), transparent)' }}/>
          </div>
          <div style={{ display:'flex', gap:24, flex:1, alignItems:'flex-start' }}>
            {kitchen.map((slot, idx) => {
              const willTrashNow = selectedHand !== null && hoverRecipe === idx
                ? wouldTrash(slot, myHand[selectedHand])
                : false;
              return (
                <div key={idx}
                  data-testid={`kitchen-slot-${idx}`}
                  onMouseEnter={() => setHoverRecipe(idx)}
                  onMouseLeave={() => setHoverRecipe(null)}
                  onClick={() => playIngredient(idx)}
                  style={{
                    flex:1, padding:16, borderRadius:4,
                    background:'rgba(20,9,10,0.35)',
                    border: hoverRecipe===idx && selectedHand!==null
                      ? `1.5px dashed ${willTrashNow ? 'var(--traitor-red-bright)' : 'var(--cook-green-bright)'}`
                      : '1px solid rgba(201,163,82,0.18)',
                    display:'flex', flexDirection:'column', gap:14,
                    cursor: yourTurn && selectedHand!==null ? 'pointer' : 'default',
                    transition:'border-color 0.15s',
                  }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                    <div className="label-caps" style={{ fontSize:9, color:'var(--ink-dim)' }}>Station {idx+1}</div>
                    {hoverRecipe===idx && selectedHand!==null && (
                      <div className="label-caps" style={{ fontSize:9, color: willTrashNow ? 'var(--traitor-red-bright)' : 'var(--cook-green-bright)' }}>
                        {willTrashNow ? '✕ Will Trash' : '✓ Continues'}
                      </div>
                    )}
                  </div>
                  <div style={{ display:'flex', justifyContent:'center' }}>
                    <RecipeCard recipe={slot.recipe} placedIngredients={slot.placed} size="md"/>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    <div className="label-caps" style={{ fontSize:9, color:'var(--ink-dim)' }}>Placed so far</div>
                    <PlacedStack ingredients={slot.placed} recipe={slot.recipe}/>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display:'flex', gap:16, alignItems:'center', justifyContent:'center', fontSize:11, color:'var(--ink-dim)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:18, height:24, background:'linear-gradient(135deg, #5a3a1f, #2e1810)', border:'1px solid var(--brass-deep)', borderRadius:2 }}/>
              <span className="label-caps" style={{ fontSize:9 }}>Ingredients · {ingDeckSize}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:18, height:24, background:'var(--parchment)', border:'1px solid var(--ink-soft)', borderRadius:2 }}/>
              <span className="label-caps" style={{ fontSize:9 }}>Recipes · {recDeckSize}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: log + actions */}
        <div style={{ display:'flex', flexDirection:'column', borderLeft:'1px solid rgba(201,163,82,0.12)', background:'rgba(0,0,0,0.25)' }}>
          <div style={{ padding:'16px 14px 8px' }}>
            <div className="label-caps" style={{ fontSize:10, color:'var(--brass)' }}>Service Log</div>
          </div>
          <ActionLog entries={log}/>
          <div style={{ borderTop:'1px solid rgba(201,163,82,0.12)', padding:14, display:'flex', flexDirection:'column', gap:10 }}>
            <button className="btn-ghost" onClick={() => setShowAbility(true)} disabled={myAbilityUsed || !ability}>
              {myAbilityUsed ? 'Ability used' : ability ? `Use Ability · ${ability.name}` : 'No ability'}
            </button>
            <button
              data-testid="detoque-btn"
              className="btn-brass"
              onClick={onCallDeToque}
              disabled={!canDeToque}
              style={{ padding:'10px 0' }}
            >
              {canDeToque ? '🛎 Call De-Toque' : `De-Toque · ${dishes}/3 dishes`}
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM: your hand */}
      <div style={{ background:'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.7) 100%)', borderTop:'1px solid rgba(201,163,82,0.25)', padding:'14px 22px', display:'flex', alignItems:'center', gap:24 }}>
        <div style={{ minWidth:200 }}>
          {me && <PlayerTile player={me} isYou hasChef={me.seat===chef} isActive={yourTurn} used={myAbilityUsed} hand={myHand.length}/>}
        </div>
        <div style={{ flex:1, display:'flex', alignItems:'flex-end', gap:14 }}>
          <div>
            <div className="label-caps" style={{ fontSize:9, color:'var(--brass)', marginBottom:6 }}>Your hand</div>
            <div style={{ display:'flex', gap:12 }}>
              {myHand.map((s, i) => (
                <IngredientCard
                  key={i}
                  suit={s}
                  size="md"
                  selected={selectedHand===i}
                  onClick={() => yourTurn && setSelectedHand(selectedHand===i ? null : i)}
                  dim={!yourTurn}
                  data-testid={`hand-card-${i}`}
                />
              ))}
            </div>
          </div>
          {ability && (
            <div style={{ marginLeft:24 }}>
              <div className="label-caps" style={{ fontSize:9, color:'var(--brass)', marginBottom:6 }}>Your ability</div>
              <AbilityCard ability={ability} size="sm" used={myAbilityUsed} onClick={() => !myAbilityUsed && setShowAbility(true)}/>
            </div>
          )}
        </div>
        <div style={{ textAlign:'right' }}>
          <div className="label-caps" style={{ fontSize:9, color:'var(--brass)' }}>Status</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:22, color: yourTurn ? 'var(--brass-bright)' : 'var(--parchment-deep)', fontWeight:500, lineHeight:1.1 }}>
            {yourTurn
              ? (selectedHand===null ? 'Choose an ingredient' : 'Place it on a recipe')
              : `Waiting on ${players.find(p => p.seat===activeSeat)?.name || '…'}`}
          </div>
          <div style={{ fontFamily:'var(--font-script)', fontSize:18, color:'var(--brass)', marginTop:2 }}>
            {me?.seat===chef ? 'you hold the bell' : `${players.find(p => p.seat===chef)?.name || '…'} holds the bell`}
          </div>
        </div>
      </div>

      {/* ABILITY MODAL */}
      {showAbility && ability && (
        <div onClick={() => setShowAbility(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:5 }}>
          <div onClick={e => e.stopPropagation()} style={{ display:'flex', gap:32, alignItems:'center', maxWidth:720 }}>
            <AbilityCard ability={ability} size="lg"/>
            <div style={{ maxWidth:280, color:'var(--parchment)' }}>
              <div className="label-caps" style={{ fontSize:10, color:'var(--brass)' }}>Your single-use ability</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:30, color:'var(--brass-bright)', lineHeight:1.1, fontWeight:500, margin:'6px 0 12px' }}>{ability.name}</div>
              <div style={{ fontSize:13, lineHeight:1.5 }}>{ability.text}</div>
              <div style={{ fontSize:11, color:'var(--brass)', fontStyle:'italic', marginTop:10, paddingTop:10, borderTop:'1px solid var(--brass-deep)' }}>Trigger · {ability.trigger}</div>
              <div style={{ display:'flex', gap:8, marginTop:22 }}>
                <button className="btn-brass" style={{ flex:1, padding:'12px 0' }} onClick={useAbility}>Reveal & Play</button>
                <button className="btn-ghost" onClick={() => setShowAbility(false)}>Hold</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
