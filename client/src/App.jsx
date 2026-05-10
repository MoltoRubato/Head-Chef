import { useState, useEffect } from 'react';
import { socket } from './socket.js';
import { ABILITIES } from './data.js';
import { LobbyScreen } from './screens/Lobby.jsx';
import { RoleRevealScreen } from './screens/RoleReveal.jsx';
import { GameTableScreen } from './screens/GameTable.jsx';
import { DeToqueScreen, DeToqueRevealScreen } from './screens/DeToque.jsx';
import { EndScreen } from './screens/EndScreen.jsx';
import { ReferenceScreen } from './screens/Reference.jsx';

export default function App() {
  const [screen, setScreen] = useState('lobby');
  const [returnTo, setReturnTo] = useState('lobby');

  // Private state (only this player knows)
  const [myRole, setMyRole] = useState(null);
  const [myHand, setMyHand] = useState([]);
  const [myAbilityId, setMyAbilityId] = useState(null);
  const [myAbilityUsed, setMyAbilityUsed] = useState(false);

  // Shared game state (broadcast to all)
  const [gameState, setGameState] = useState(null);
  const [detoqueState, setDetoqueState] = useState(null);
  const [endState, setEndState] = useState(null);

  // Role-reveal ready flag
  const [roleReadyAcked, setRoleReadyAcked] = useState(false);

  useEffect(() => {
    socket.on('game-started', ({ role, abilityId, hand }) => {
      setMyRole(role);
      setMyAbilityId(abilityId);
      setMyHand(hand);
      setMyAbilityUsed(false);
      setRoleReadyAcked(false);
      setScreen('role');
    });

    socket.on('game-state', (state) => {
      setGameState(state);
      if (screen !== 'game' && screen !== 'lobby' && screen !== 'role' && screen !== 'reference') {
        setScreen('game');
      }
    });

    socket.on('hand-update', ({ hand }) => {
      setMyHand(hand);
    });

    socket.on('ability-used', () => {
      setMyAbilityUsed(true);
    });

    socket.on('detoque-state', (state) => {
      setDetoqueState(state);
      if (state.phase !== 'reveal') {
        setScreen('detoque');
      } else {
        setScreen('detoque-reveal');
      }
    });

    socket.on('game-over', (state) => {
      setEndState(state);
      setScreen('end');
    });

    socket.on('game-reset', () => {
      setScreen('lobby');
      setGameState(null);
      setDetoqueState(null);
      setEndState(null);
      setMyRole(null);
      setMyHand([]);
      setMyAbilityId(null);
    });

    return () => {
      socket.off('game-started');
      socket.off('game-state');
      socket.off('hand-update');
      socket.off('ability-used');
      socket.off('detoque-state');
      socket.off('game-over');
      socket.off('game-reset');
    };
  }, [screen]);

  // Sync screen with game phase from server
  useEffect(() => {
    if (!gameState) return;
    const { phase } = gameState;
    if (phase === 'game' && screen === 'role' && roleReadyAcked) setScreen('game');
  }, [gameState, screen, roleReadyAcked]);

  const handleRoleReady = () => {
    setRoleReadyAcked(true);
    socket.emit('role-acknowledged');
    setScreen('game');
  };

  const handleCallDeToque = () => {
    socket.emit('call-detoque');
  };

  const handleReplay = () => {
    socket.emit('request-reset');
  };

  const goRef = (from) => { setReturnTo(from); setScreen('reference'); };

  const myAbility = ABILITIES.find(a => a.id === myAbilityId) || null;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {screen === 'lobby' && (
        <LobbyScreen onShowReference={() => goRef('lobby')}/>
      )}
      {screen === 'role' && myRole && (
        <RoleRevealScreen
          myRole={myRole}
          myAbility={myAbility}
          players={gameState?.players || []}
          traitorCount={gameState?.traitorCount || 1}
          onContinue={handleRoleReady}
        />
      )}
      {screen === 'game' && gameState && (
        <GameTableScreen
          gameState={gameState}
          myHand={myHand}
          myRole={myRole}
          myAbility={myAbilityId}
          myAbilityUsed={myAbilityUsed}
          onCallDeToque={handleCallDeToque}
          onShowReference={() => goRef('game')}
        />
      )}
      {screen === 'detoque' && detoqueState && gameState && (
        <DeToqueScreen
          players={gameState.players}
          votes={detoqueState.votes}
          phase={detoqueState.phase}
          accused={detoqueState.accused}
          yourVote={detoqueState.yourVotes?.[socket.id]}
          onDismiss={() => setScreen('game')}
        />
      )}
      {screen === 'detoque-reveal' && detoqueState && (
        <DeToqueRevealScreen
          accusedPlayer={detoqueState.accusedPlayer}
          wasTraitor={detoqueState.wasTraitor}
          onContinue={() => setScreen('end')}
        />
      )}
      {screen === 'end' && endState && (
        <EndScreen
          result={endState.result}
          players={endState.players}
          served={endState.served}
          trashed={endState.trashed}
          onReplay={handleReplay}
        />
      )}
      {screen === 'reference' && (
        <ReferenceScreen onClose={() => setScreen(returnTo)}/>
      )}
    </div>
  );
}
