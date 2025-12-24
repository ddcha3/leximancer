import Tile from "../components/Tile";
import EnemyDisplay from "../components/EnemyDisplay";
import CombatLog from "../components/CombatLog";

export default function BattleScreen({ 
  playerAvatar, 
  encounterIndex, 
  totalEncounters,
  enemy, 
  logs, 
  hand, 
  spellSlots, 
  actions,
  isValidWord,
  shakeError
}) {
  const { onMoveTile, onReturnTile, onCast, onClear, onDiscard } = actions;

  const feedbackColor = isValidWord ? '#2ecc71' : (spellSlots.length > 0 ? '#e74c3c' : '#666');
  const feedbackText = spellSlots.length > 0 ? (isValidWord ? "VALID" : "INVALID") : "EMPTY";

  return (
    <div className="app">
      <div className="header">
        <div>{playerAvatar} Leximancer</div>
        <div className="stats">Encounter {encounterIndex + 1}/{totalEncounters}</div>
      </div>

      <EnemyDisplay enemy={enemy} />
      <CombatLog logs={logs} />

      {/* Validation Feedback Text */}
      <div style={{ 
        height: '20px', 
        color: feedbackColor, 
        fontWeight: 'bold', 
        fontSize: '0.9em',
        marginBottom: '5px'
      }}>
        {feedbackText}
      </div>

      {/* Spell Slot Container with Shake Effect */}
      <div 
        className={`spell-slot ${shakeError ? 'shake' : ''}`} 
        style={{ borderColor: feedbackColor }}
      >
        {spellSlots.length === 0 && <Tile empty />}
        {spellSlots.map(t => (
          <Tile key={t.id} tile={t} onClick={onReturnTile} />
        ))}
      </div>

      <div className="hand">
        {hand.map(t => (
          <Tile key={t.id} tile={t} onClick={onMoveTile} />
        ))}
      </div>

      <div className="controls">
        <button onClick={onClear}>Clear</button>
        <button 
          onClick={onDiscard} 
          style={{ border: '1px solid #e74c3c', color: '#e74c3c' }}
        >
          Discard Hand ♻
        </button>
        
        <button 
          className="cast-btn" 
          disabled={spellSlots.length === 0} 
          onClick={onCast}
        >
          CAST
        </button>
      </div>
    </div>
  );
}