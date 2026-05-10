// Server-side game logic (authoritative)

const RECIPES = [
  { id: 'r1',  name: 'Le Quatuor',           sub: 'house tasting',   ing: { meat:1, fish:1, veg:1, sauce:1 } },
  { id: 'r2',  name: 'Surf & Turf',          sub: 'classic',         ing: { meat:2, fish:2 } },
  { id: 'r3',  name: 'Chop & Garden',        sub: 'rustic',          ing: { meat:2, veg:2 } },
  { id: 'r4',  name: 'Beef au Jus',          sub: 'reduction',       ing: { meat:2, sauce:2 } },
  { id: 'r5',  name: 'Steak Riviera',        sub: 'with seabass',    ing: { meat:2, fish:1, veg:1 } },
  { id: 'r6',  name: 'Filet Marin',          sub: 'glazed',          ing: { meat:2, fish:1, sauce:1 } },
  { id: 'r7',  name: 'Boeuf en Bourgogne',   sub: 'braised',         ing: { meat:2, veg:1, sauce:1 } },
  { id: 'r8',  name: 'Mer Verte',            sub: 'fish & garden',   ing: { fish:2, veg:2 } },
  { id: 'r9',  name: 'Sole Beurre Blanc',    sub: 'butter sauce',    ing: { fish:2, sauce:2 } },
  { id: 'r10', name: 'Bouillabaisse',        sub: 'twin catch',      ing: { fish:2, meat:1, veg:1 } },
  { id: 'r11', name: 'Saumon Fumé',          sub: 'smoked',          ing: { fish:2, meat:1, sauce:1 } },
  { id: 'r12', name: 'Poisson Provençal',    sub: 'sun & sea',       ing: { fish:2, veg:1, sauce:1 } },
  { id: 'r13', name: 'Ratatouille Royale',   sub: 'simmered',        ing: { veg:2, sauce:2 } },
  { id: 'r14', name: 'Jardinière',           sub: 'with pavé',       ing: { veg:2, meat:1, fish:1 } },
  { id: 'r15', name: 'Légumes Glacés',       sub: 'glazed roots',    ing: { veg:2, meat:1, sauce:1 } },
  { id: 'r16', name: 'Salade Niçoise',       sub: 'composed',        ing: { veg:2, fish:1, sauce:1 } },
  { id: 'r17', name: 'Steak au Poivre',      sub: 'twice-sauced',    ing: { sauce:2, meat:1, fish:1 } },
  { id: 'r18', name: 'Daube Provençal',      sub: 'slow stew',       ing: { sauce:2, meat:1, veg:1 } },
  { id: 'r19', name: 'Coquilles Gratin',     sub: 'baked',           ing: { sauce:2, fish:1, veg:1 } },
];

const ABILITY_IDS = ['snack', 'stock', 'market', 'imp', 'head', 'app', 'swap', 'reset'];

function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function makeDeck() {
  const out = [];
  for (const k of ['meat', 'fish', 'veg', 'sauce'])
    for (let i = 0; i < 24; i++) out.push(k);
  return shuffle(out);
}

export function makeRecipeDeck() {
  return shuffle([...RECIPES]);
}

export function checkSlot(slot) {
  const need = { ...slot.recipe.ing };
  const counts = {};
  let bad = false;
  for (const s of slot.placed) {
    counts[s] = (counts[s] || 0) + 1;
    if (!need[s] || counts[s] > need[s]) { bad = true; break; }
  }
  const totalNeeded = Object.values(slot.recipe.ing).reduce((a, b) => a + b, 0);
  if (bad) return 'trashed';
  if (slot.placed.length === totalNeeded) return 'served';
  return 'ongoing';
}

export function checkWin(served, trashed) {
  if (served >= 5) return 'cook';
  if (trashed >= 4) return 'traitor';
  return null;
}

export function initGame(players, traitorCount) {
  const ingDeck = makeDeck();
  const recDeck = makeRecipeDeck();

  // Assign roles
  const roles = shuffle([...Array(traitorCount).fill('traitor'), ...Array(players.length - traitorCount).fill('cook')]);

  // Assign abilities (one per player from shuffled pool)
  const abilityPool = shuffle([...ABILITY_IDS]);

  const playerStates = players.map((p, i) => ({
    id: p.id,
    name: p.name,
    seat: i,
    role: roles[i],
    abilityId: abilityPool[i % ABILITY_IDS.length],
    abilityUsed: false,
    hand: [ingDeck.shift(), ingDeck.shift()],
    accent: p.accent,
  }));

  return {
    phase: 'game',
    players: playerStates,
    kitchen: [
      { recipe: recDeck.shift(), placed: [] },
      { recipe: recDeck.shift(), placed: [] },
    ],
    served: [],
    trashed: [],
    ingDeck,
    recDeck,
    chef: 0,
    activeSeat: 0,
    traitorCount,
    log: [{ kind: 'sys', text: 'A famous critic has been seated. Service begins.' }],
    detoque: null,
    result: null,
  };
}

export function playIngredient(state, seat, kitchenIdx, handIdx) {
  if (state.activeSeat !== seat) return { error: 'Not your turn' };
  if (kitchenIdx < 0 || kitchenIdx > 1) return { error: 'Invalid kitchen slot' };

  const player = state.players.find(p => p.seat === seat);
  if (!player) return { error: 'Player not found' };
  if (handIdx < 0 || handIdx >= player.hand.length) return { error: 'Invalid hand index' };

  const suit = player.hand[handIdx];
  const slot = state.kitchen[kitchenIdx];
  slot.placed.push(suit);

  // Remove from hand and refill
  player.hand.splice(handIdx, 1);
  if (state.ingDeck.length > 0) player.hand.push(state.ingDeck.shift());

  // Check completion
  const result = checkSlot(slot);
  let dishCompleted = false;
  let dishKind = null;

  if (result === 'trashed') {
    state.trashed.push({ recipe: slot.recipe, ingredients: [...slot.placed] });
    state.kitchen[kitchenIdx] = { recipe: state.recDeck.shift() || RECIPES[0], placed: [] };
    state.log.unshift({ kind: 'sys', text: `${slot.recipe.name} is Trashed by ${player.name}!` });
    dishCompleted = true;
    dishKind = 'trashed';
    state.chef = seat; // Player who completed gets the bell
  } else if (result === 'served') {
    state.served.push({ recipe: slot.recipe, ingredients: [...slot.placed] });
    state.kitchen[kitchenIdx] = { recipe: state.recDeck.shift() || RECIPES[0], placed: [] };
    state.log.unshift({ kind: 'sys', text: `${slot.recipe.name} is Served by ${player.name}!` });
    dishCompleted = true;
    dishKind = 'served';
    state.chef = seat;
  } else {
    state.log.unshift({ kind: 'act', text: `${player.name} placed ${suit} on ${slot.recipe.name}.` });
  }

  // Check win condition
  const win = checkWin(state.served.length, state.trashed.length);
  if (win) {
    state.result = win;
    state.phase = 'over';
    return { state, dishCompleted, dishKind, win };
  }

  // Check dish limit
  const totalDishes = state.served.length + state.trashed.length;
  if (totalDishes >= 8) {
    state.result = state.served.length >= 5 ? 'cook' : 'traitor';
    state.phase = 'over';
    return { state, dishCompleted, dishKind, win: state.result };
  }

  // Advance turn
  state.activeSeat = (seat + 1) % state.players.length;

  return { state, dishCompleted, dishKind, win: null };
}

export function doImprovise(state, seat, kitchenIdx) {
  if (state.activeSeat !== seat) return { error: 'Not your turn' };
  if (state.ingDeck.length === 0) return { error: 'Ingredient deck empty' };

  const suit = state.ingDeck.shift();
  const player = state.players.find(p => p.seat === seat);
  const slot = state.kitchen[kitchenIdx];
  slot.placed.push(suit);

  state.log.unshift({ kind: 'act', text: `${player.name} improvised — flipped ${suit} onto ${slot.recipe.name}.` });
  player.abilityUsed = true;

  const result = checkSlot(slot);
  if (result === 'trashed') {
    state.trashed.push({ recipe: slot.recipe, ingredients: [...slot.placed] });
    state.kitchen[kitchenIdx] = { recipe: state.recDeck.shift() || RECIPES[0], placed: [] };
    state.log.unshift({ kind: 'sys', text: `${slot.recipe.name} is Trashed!` });
    state.chef = seat;
  } else if (result === 'served') {
    state.served.push({ recipe: slot.recipe, ingredients: [...slot.placed] });
    state.kitchen[kitchenIdx] = { recipe: state.recDeck.shift() || RECIPES[0], placed: [] };
    state.log.unshift({ kind: 'sys', text: `${slot.recipe.name} is Served!` });
    state.chef = seat;
  }

  const win = checkWin(state.served.length, state.trashed.length);
  if (win) { state.result = win; state.phase = 'over'; }
  state.activeSeat = (seat + 1) % state.players.length;

  return { state, win };
}

export function doNewShipment(state, seat) {
  const newIngDeck = makeDeck();
  state.players.forEach(p => {
    p.hand = [newIngDeck.shift(), newIngDeck.shift()];
  });
  // Put remaining back
  state.ingDeck = newIngDeck;
  const player = state.players.find(p => p.seat === seat);
  if (player) player.abilityUsed = true;
  state.log.unshift({ kind: 'sys', text: `${state.players.find(p => p.seat === seat)?.name} called New Shipment — all hands refreshed.` });
  return { state };
}

export function doSwapRecipe(state, seat, kitchenIdx) {
  const player = state.players.find(p => p.seat === seat);
  const old = state.kitchen[kitchenIdx];
  const newRec = state.recDeck.shift();
  if (!newRec) return { error: 'Recipe deck empty' };
  state.recDeck.push(old.recipe);
  // Shuffle recipe deck
  for (let i = state.recDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [state.recDeck[i], state.recDeck[j]] = [state.recDeck[j], state.recDeck[i]];
  }
  state.kitchen[kitchenIdx] = { recipe: newRec, placed: [] };
  if (player) player.abilityUsed = true;
  state.log.unshift({ kind: 'sys', text: `${player?.name} swapped a recipe in Station ${kitchenIdx + 1}.` });
  return { state };
}

export function initDeToque(state, callerSeat) {
  state.detoque = {
    callerSeat,
    phase: 'discussion',
    votes: {},
    accused: null,
  };
  state.phase = 'detoque';
  return state;
}

export function castVote(state, voterId, targetSeat) {
  if (!state.detoque) return state;
  state.detoque.votes[voterId] = targetSeat;

  // Tally
  const tally = {};
  Object.values(state.detoque.votes).forEach(t => { tally[t] = (tally[t] || 0) + 1; });
  const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  state.detoque.accused = sorted[0]?.[0] != null ? parseInt(sorted[0][0]) : null;

  return state;
}

export function resolveVote(state) {
  if (!state.detoque || state.detoque.accused == null) {
    state.phase = 'game';
    state.detoque = null;
    return { state, resolved: false };
  }

  const accused = state.players.find(p => p.seat === state.detoque.accused);
  if (!accused) {
    state.phase = 'game';
    state.detoque = null;
    return { state, resolved: false };
  }

  const wasTraitor = accused.role === 'traitor';
  const result = wasTraitor ? 'cook' : 'traitor';
  state.result = result;
  state.phase = 'over';

  return { state, resolved: true, accusedPlayer: accused, wasTraitor, result };
}

export { RECIPES };
