import { RECIPES, ABILITIES } from './data.js';

export function shuffle(arr, seed = Math.random() * 1e9 | 0) {
  const out = [...arr];
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
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

/** Check if placing `suit` on `slot` would trash immediately */
export function wouldTrash(slot, suit) {
  const test = [...slot.placed, suit];
  const need = { ...slot.recipe.ing };
  const counts = {};
  for (const s of test) {
    counts[s] = (counts[s] || 0) + 1;
    if (!need[s] || counts[s] > need[s]) return true;
  }
  return false;
}

/** After placing, check if recipe is complete (served) or trashed */
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

/** Win condition: returns 'cook' | 'traitor' | null */
export function checkWin(served, trashed) {
  if (served >= 5) return 'cook';
  if (trashed >= 4) return 'traitor';
  return null;
}

export function assignAbilities(playerCount) {
  const shuffled = shuffle(ABILITIES.map(a => a.id));
  return shuffled.slice(0, playerCount);
}

export function assignRoles(playerCount, traitorCount) {
  const roles = Array(playerCount).fill('cook');
  for (let i = 0; i < traitorCount; i++) roles[i] = 'traitor';
  return shuffle(roles);
}
