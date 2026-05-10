// Room management

const rooms = new Map(); // code -> room

function generateCode() {
  const words = ['MEAT', 'FISH', 'HERB', 'SALT', 'CHEF', 'DISH', 'SAUCE', 'BROTH'];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${word}-${num}`;
}

export function createRoom(hostId, hostName) {
  let code = generateCode();
  while (rooms.has(code)) code = generateCode();

  const room = {
    code,
    host: hostId,
    players: [{
      id: hostId,
      name: hostName,
      isHost: true,
      ready: false,
      seat: 0,
      accent: '#c9a352',
    }],
    settings: {
      traitorCount: 1,
      kitchenHush: false,
    },
    game: null,
  };
  rooms.set(code, room);
  return room;
}

export function joinRoom(code, playerId, playerName) {
  const room = rooms.get(code);
  if (!room) return { error: 'Room not found' };
  if (room.players.length >= 6) return { error: 'Room is full' };
  if (room.game) return { error: 'Game already in progress' };
  if (room.players.find(p => p.id === playerId)) return { room }; // already in

  const accents = ['#c9a352','#a13c2d','#4a6b8c','#5a7042','#8b2a2f','#b8862a'];
  room.players.push({
    id: playerId,
    name: playerName,
    isHost: false,
    ready: false,
    seat: room.players.length,
    accent: accents[room.players.length % accents.length],
  });
  return { room };
}

export function removePlayer(playerId) {
  for (const [code, room] of rooms) {
    const idx = room.players.findIndex(p => p.id === playerId);
    if (idx === -1) continue;

    room.players.splice(idx, 1);
    // Reassign seats
    room.players.forEach((p, i) => { p.seat = i; p.isHost = i === 0; });
    if (room.players.length === 0) {
      rooms.delete(code);
      return { code, empty: true };
    }
    if (room.host === playerId) room.host = room.players[0].id;
    return { code, room };
  }
  return null;
}

export function getRoom(code) {
  return rooms.get(code) || null;
}

export function getRoomByPlayer(playerId) {
  for (const [code, room] of rooms) {
    if (room.players.find(p => p.id === playerId)) return { code, room };
  }
  return null;
}

export function setReady(code, playerId, ready) {
  const room = rooms.get(code);
  if (!room) return null;
  const p = room.players.find(p => p.id === playerId);
  if (p) p.ready = ready;
  return room;
}

export function setSettings(code, settings) {
  const room = rooms.get(code);
  if (!room) return null;
  Object.assign(room.settings, settings);
  return room;
}

export function attachGame(code, game) {
  const room = rooms.get(code);
  if (!room) return null;
  room.game = game;
  return room;
}

export function getGame(code) {
  return rooms.get(code)?.game || null;
}

export function resetRoom(code) {
  const room = rooms.get(code);
  if (!room) return null;
  room.game = null;
  room.players.forEach(p => { p.ready = false; });
  return room;
}
