import Tile from "../components/Tile";
import CombatLog from "../components/CombatLog";

export default function BattleScreen({ 
  playerAvatar, 
  playerHp,      
  maxPlayerHp,   
  inventory,     
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

  const enemyHpPct = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
  const enemyWpPct = Math.max(0, (enemy.wp / enemy.maxWp) * 100);
  const playerHpPct = Math.max(0, (playerHp / maxPlayerHp) * 100);

  const feedbackColor = isValidWord ? '#4e6d46' : (spellSlots.length > 0 ? '#b85c50' : '#8b735b');
  const feedbackText = spellSlots.length > 0 ? (isValidWord ? "VALID SPELL" : "INVALID GIBBERISH") : "PREPARE SPELL";

  // --- DYNAMIC SCALING ---
  // Base 4rem + 0.8rem per level. Caps around level 10 visually.
  const enemySize = `${4 + (enemy.level || 1) * 0.8}rem`;

  return (
    <div className="app">
      <div className="arena">
        
        {/* --- ENEMY SECTION --- */}
        <div className="enemy-position">
          {/* 1. NAME + LEVEL */}
          <h3>
            <span style={{fontSize: '0.7em', color: '#8b735b', marginRight: '6px'}}>
              LV.{enemy.level || 1}
            </span> 
            {enemy.name}
          </h3>
          
          {/* 2. EMOJI (Dynamic Size) */}
          <div 
            className="enemy-emoji" 
            style={{ fontSize: enemySize }}
          >
            {enemy.emoji}
          </div>
          
          {/* 3. BARS */}
          <div className="enemy-bars">
            <div className="bar">
              <div className="bar-text">HP {enemy.hp}</div>
              <div className="bar-fill hp-fill" style={{ width: `${enemyHpPct}%` }}></div>
            </div>
            <div className="bar">
              <div className="bar-text">WP {enemy.wp}</div>
              <div className="bar-fill wp-fill" style={{ width: `${enemyWpPct}%` }}></div>
            </div>
          </div>
        </div>

        {/* --- PLAYER SECTION --- */}
        <div className="player-position">
          <div className="player-row">
            <div className="player-avatar">{playerAvatar}</div>
            <div className="player-stats">
               <div className="bar">
                 <div className="bar-text" style={{ textAlign: 'left', paddingLeft: '5px' }}>HP {playerHp}/{maxPlayerHp}</div>
                 <div className="bar-fill hp-fill" style={{ width: `${playerHpPct}%` }}></div>
               </div>
               
               <div className="inventory">
                 {inventory.map((item, i) => (
                   <div key={i} className="artifact" title="Artifact">{item}</div>
                 ))}
                 {[...Array(Math.max(0, 3 - inventory.length))].map((_, i) => (
                    <div key={`empty-${i}`} className="artifact" style={{opacity: 0.3}}></div>
                 ))}
               </div>
            </div>
          </div>
        </div>

      </div>

      <CombatLog logs={logs} />
      
      {/* ... Rest of the file remains identical ... */}
      <div style={{ 
        height: '20px', 
        color: feedbackColor, 
        fontWeight: 'bold', 
        fontSize: '0.8rem',
        marginBottom: '5px',
        letterSpacing: '1px'
      }}>
        {feedbackText}
      </div>

      <div 
        className={`spell-slot ${shakeError ? 'shake' : ''}`} 
        style={{ borderColor: feedbackColor }}
      >
        {spellSlots.length === 0 && <span style={{color: 'rgba(139, 115, 91, 0.5)', fontSize: '2rem'}}>?</span>}
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
          style={{ borderColor: '#b85c50', color: '#b85c50' }}
        >
          Redraw ♻
        </button>
        <button 
          className="cast-btn" 
          disabled={spellSlots.length === 0} 
          onClick={onCast}
        >
          CAST SPELL
        </button>
      </div>
    </div>
  );
}