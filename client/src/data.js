export const SUITS = {
  meat:  { id: 'meat',  name: 'Meat',  color: 'var(--meat)',  bg: 'var(--meat-bg)'  },
  fish:  { id: 'fish',  name: 'Fish',  color: 'var(--fish)',  bg: 'var(--fish-bg)'  },
  veg:   { id: 'veg',   name: 'Veg',   color: 'var(--veg)',   bg: 'var(--veg-bg)'   },
  sauce: { id: 'sauce', name: 'Sauce', color: 'var(--sauce)', bg: 'var(--sauce-bg)' },
};

export const RECIPES = [
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

export const ABILITIES = [
  { id: 'snack',  name: 'Snack Break',   alt: 'Take a Break',
    text: 'Skip another player\'s turn so they do not play an ingredient. Play passes to their left.',
    trigger: 'On any other player\'s turn, before they play an ingredient.' },
  { id: 'stock',  name: 'Stock Check',   alt: 'Sneak a Taste',
    text: 'Privately inspect a player\'s remaining ingredient after they have just played one.',
    trigger: 'When a player has played, before they draw.' },
  { id: 'market', name: 'Food Market',   alt: 'Exchange',
    text: 'Choose a player. Each of you blindly takes one of the other\'s ingredient cards.',
    trigger: 'At any time. Both players must hold two ingredients.' },
  { id: 'imp',    name: 'Improvise',     alt: 'Gamble',
    text: 'On your turn, instead of playing from hand, flip the top of the deck onto a chosen recipe.',
    trigger: 'On your own turn, in place of playing an ingredient.' },
  { id: 'head',   name: 'Head Chef',     alt: 'Mutiny',
    text: 'You are given the Chef Token after the next dish is completed, regardless of who completes it.',
    trigger: 'At any time. Has no effect if the next dish would end the game.' },
  { id: 'app',    name: 'Apprentice',    alt: 'Copy',
    text: 'Copy the most recent ability another player has used in this game.',
    trigger: 'Matching the trigger of the ability you are copying.' },
  { id: 'swap',   name: 'Swap Recipes',  alt: 'Swap',
    text: 'Remove a face-up recipe (discarding any ingredients) and replace it from the deck. Reshuffle the old recipe in.',
    trigger: 'On your own turn, before playing.' },
  { id: 'reset',  name: 'New Shipment',  alt: 'Reset',
    text: 'Every player face-down discards their hand and draws back up to two.',
    trigger: 'At any time.' },
];

export const ROLES = {
  cook: {
    id: 'cook', name: 'Cook', tagline: 'Loyal to the kitchen',
    objective: 'Serve five Dishes to the Critic — or expose a Traitor in a De-Toque.',
    color: 'var(--cook-green-bright)', bg: 'var(--cook-green)',
  },
  traitor: {
    id: 'traitor', name: 'Traitor', tagline: 'Bought by a rival house',
    objective: 'Sabotage four Dishes to the Trash — or get a Cook De-Toqued by mistake.',
    color: 'var(--traitor-red-bright)', bg: 'var(--traitor-red)',
  },
};

export const PLAYER_ACCENTS = ['#c9a352','#a13c2d','#4a6b8c','#5a7042','#8b2a2f','#b8862a'];
