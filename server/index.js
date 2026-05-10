import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import {
  createRoom, joinRoom, removePlayer, getRoomByPlayer,
  setReady, setSettings, attachGame, getGame, resetRoom, getRoom,
} from './src/rooms.js';
import {
  initGame, playIngredient, doImprovise, doNewShipment, doSwapRecipe,
  initDeToque, castVote, resolveVote, checkWin,
} from './src/gameLogic.js';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  transports: ['websocket', 'polling'],
});

const PORT = process.env.PORT || 3001;

app.get('/health', (_, res) => res.json({ ok: true }));

// ─── helpers ─────────────────────────────────────────────────────────────────

function publicRoom(room) {
  return {
    code: room.code,
    players: room.players.map(p => ({ id: p.id, name: p.name, isHost: p.isHost, ready: p.ready, seat: p.seat })),
    settings: room.settings,
  };
}

function publicGame(game, mySocketId) {
  // Build player-facing view: hide other players' roles/hands
  return {
    phase: game.phase,
    traitorCount: game.traitorCount,
    kitchen: game.kitchen,
    served: game.served,
    trashed: game.trashed,
    ingDeckSize: game.ingDeck.length,
    recDeckSize: game.recDeck.length,
    chef: game.chef,
    activeSeat: game.activeSeat,
    log: game.log.slice(0, 30),
    players: game.players.map(p => ({
      id: p.id,
      name: p.name,
      seat: p.seat,
      accent: p.accent,
      abilityUsed: p.abilityUsed,
      cardCount: p.hand.length,
      isMe: p.id === mySocketId,
    })),
  };
}

function broadcastGame(code, game) {
  const room = getRoom(code);
  if (!room) return;
  room.players.forEach(p => {
    const sock = io.sockets.sockets.get(p.id);
    if (sock) sock.emit('game-state', publicGame(game, p.id));
  });
}

// ─── socket events ────────────────────────────────────────────────────────────

io.on('connection', (socket) => {
  console.log('connect', socket.id);

  socket.on('create-room', ({ name }) => {
    const room = createRoom(socket.id, name);
    socket.join(room.code);
    socket.emit('room-update', publicRoom(room));
    console.log('room created', room.code);
  });

  socket.on('join-room', ({ name, code }) => {
    const result = joinRoom(code, socket.id, name);
    if (result.error) { socket.emit('error', { message: result.error }); return; }
    socket.join(code);
    io.to(code).emit('room-update', publicRoom(result.room));
  });

  socket.on('set-ready', ({ ready }) => {
    const found = getRoomByPlayer(socket.id);
    if (!found) return;
    const room = setReady(found.code, socket.id, ready);
    if (room) io.to(found.code).emit('room-update', publicRoom(room));
  });

  socket.on('set-settings', (settings) => {
    const found = getRoomByPlayer(socket.id);
    if (!found) return;
    if (found.room.host !== socket.id) return;
    const room = setSettings(found.code, settings);
    if (room) io.to(found.code).emit('room-update', publicRoom(room));
  });

  socket.on('start-game', () => {
    const found = getRoomByPlayer(socket.id);
    if (!found) return;
    if (found.room.host !== socket.id) return;
    if (found.room.players.length < 3) { socket.emit('error', { message: 'Need at least 3 players' }); return; }

    const { room } = found;
    const game = initGame(room.players, room.settings.traitorCount);
    attachGame(found.code, game);

    // Send private info to each player
    game.players.forEach(p => {
      const sock = io.sockets.sockets.get(p.id);
      if (sock) {
        sock.emit('game-started', {
          role: p.role,
          abilityId: p.abilityId,
          hand: p.hand,
        });
      }
    });

    // Broadcast public game state
    broadcastGame(found.code, game);
  });

  socket.on('role-acknowledged', () => {
    // No-op — client handles transition locally
  });

  socket.on('play-ingredient', ({ kitchenIdx, handIdx }) => {
    const found = getRoomByPlayer(socket.id);
    if (!found) return;
    const game = getGame(found.code);
    if (!game || game.phase !== 'game') return;

    const player = game.players.find(p => p.id === socket.id);
    if (!player) return;

    const result = playIngredient(game, player.seat, kitchenIdx, handIdx);
    if (result.error) { socket.emit('error', { message: result.error }); return; }

    // Send updated hand to the player
    socket.emit('hand-update', { hand: player.hand });

    // Broadcast updated game state
    broadcastGame(found.code, game);

    if (result.win) {
      io.to(found.code).emit('game-over', buildEndState(game));
    }
  });

  socket.on('use-ability', ({ extra } = {}) => {
    const found = getRoomByPlayer(socket.id);
    if (!found) return;
    const game = getGame(found.code);
    if (!game || game.phase !== 'game') return;

    const player = game.players.find(p => p.id === socket.id);
    if (!player || player.abilityUsed) return;

    // Handle improvise specially (requires kitchenIdx)
    if (player.abilityId === 'imp' && extra?.kitchenIdx != null) {
      const result = doImprovise(game, player.seat, extra.kitchenIdx);
      if (result.error) { socket.emit('error', { message: result.error }); return; }
      socket.emit('hand-update', { hand: player.hand });
      socket.emit('ability-used');
      broadcastGame(found.code, game);
      if (result.win) io.to(found.code).emit('game-over', buildEndState(game));
      return;
    }

    // Handle new shipment
    if (player.abilityId === 'reset') {
      doNewShipment(game, player.seat);
      game.players.forEach(p => {
        const sock = io.sockets.sockets.get(p.id);
        if (sock) sock.emit('hand-update', { hand: p.hand });
      });
      socket.emit('ability-used');
      broadcastGame(found.code, game);
      return;
    }

    // Handle swap recipe
    if (player.abilityId === 'swap' && extra?.kitchenIdx != null) {
      const result = doSwapRecipe(game, player.seat, extra.kitchenIdx);
      if (result.error) { socket.emit('error', { message: result.error }); return; }
      socket.emit('ability-used');
      broadcastGame(found.code, game);
      return;
    }

    // Generic: mark ability as used and log it
    player.abilityUsed = true;
    game.log.unshift({ kind: 'act', text: `${player.name} used their ability: ${player.abilityId}.` });
    socket.emit('ability-used');
    broadcastGame(found.code, game);
  });

  socket.on('call-detoque', () => {
    const found = getRoomByPlayer(socket.id);
    if (!found) return;
    const game = getGame(found.code);
    if (!game || game.phase !== 'game') return;

    const player = game.players.find(p => p.id === socket.id);
    if (!player || player.seat !== game.chef) return;

    const totalDishes = game.served.length + game.trashed.length;
    if (totalDishes < 3) { socket.emit('error', { message: 'De-Toque requires 3+ dishes' }); return; }

    initDeToque(game, player.seat);
    game.log.unshift({ kind: 'sys', text: `${player.name} called a De-Toque!` });

    io.to(found.code).emit('detoque-state', {
      phase: 'discussion',
      votes: {},
      accused: null,
      yourVotes: {},
    });
    broadcastGame(found.code, game);
  });

  socket.on('detoque-advance', () => {
    const found = getRoomByPlayer(socket.id);
    if (!found) return;
    const game = getGame(found.code);
    if (!game || !game.detoque) return;

    if (game.detoque.phase === 'discussion') {
      game.detoque.phase = 'vote';
      io.to(found.code).emit('detoque-state', {
        phase: 'vote',
        votes: game.detoque.votes,
        accused: game.detoque.accused,
        yourVotes: game.detoque.votes,
      });
    } else if (game.detoque.phase === 'vote') {
      const { resolved, accusedPlayer, wasTraitor, result } = resolveVote(game);
      if (resolved) {
        io.to(found.code).emit('detoque-state', {
          phase: 'reveal',
          votes: game.detoque?.votes || {},
          accused: accusedPlayer?.seat,
          accusedPlayer: { name: accusedPlayer?.name, seat: accusedPlayer?.seat },
          wasTraitor,
        });
        setTimeout(() => {
          if (game.phase === 'over') {
            io.to(found.code).emit('game-over', buildEndState(game));
          }
        }, 3000);
      } else {
        // Tie — no one eliminated, continue game
        game.phase = 'game';
        game.detoque = null;
        broadcastGame(found.code, game);
      }
    }
  });

  socket.on('cast-vote', ({ targetSeat }) => {
    const found = getRoomByPlayer(socket.id);
    if (!found) return;
    const game = getGame(found.code);
    if (!game || !game.detoque || game.detoque.phase !== 'vote') return;

    castVote(game, socket.id, targetSeat);

    io.to(found.code).emit('detoque-state', {
      phase: 'vote',
      votes: game.detoque.votes,
      accused: game.detoque.accused,
      yourVotes: game.detoque.votes,
    });
  });

  socket.on('request-reset', () => {
    const found = getRoomByPlayer(socket.id);
    if (!found) return;
    if (found.room.host !== socket.id) return;
    const room = resetRoom(found.code);
    if (room) io.to(found.code).emit('game-reset');
  });

  socket.on('disconnect', () => {
    console.log('disconnect', socket.id);
    const result = removePlayer(socket.id);
    if (result && !result.empty) {
      io.to(result.code).emit('room-update', publicRoom(result.room));
    }
  });
});

function buildEndState(game) {
  return {
    result: game.result,
    served: game.served.length,
    trashed: game.trashed.length,
    players: game.players.map(p => ({
      id: p.id,
      name: p.name,
      role: p.role,
      seat: p.seat,
      accent: p.accent,
    })),
  };
}

server.listen(PORT, () => {
  console.log(`Head Chef server running on port ${PORT}`);
});
