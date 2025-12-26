import Tile from "../components/Tile";
import CombatLog from "../components/CombatLog";
import { TAG_EMOJIS } from "../data/tags"; 

export default function BattleScreen({ 
  playerAvatar, 
  playerHp,      
  maxPlayerHp,   
  inventory,     
  playerStatusEffects, 
  encounterIndex, 
  totalEncounters,
  enemy, 
  logs, 
  hand, 
  spellSlots, 
  actions,
  isValidWord,
  shakeError,
  // NEW PROPS
  animState, // { player: '', enemy: '' }
  spellEffect // Emoji char or null
}) {
  const { onMoveTile, onReturnTile, onCast, onClear, onDiscard, onShuffle } = actions;

  const enemyHpPct = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
  const enemyWpPct = Math.max(0, (enemy.wp / enemy.maxWp) * 100);
  const playerHpPct = Math.max(0, (playerHp / maxPlayerHp) * 100);

  const feedbackColor = isValidWord ? '#4e6d46' : (spellSlots.length > 0 ? '#b85c50' : '#8b735b');
  const feedbackText = spellSlots.length > 2 ? (isValidWord ? "VALID SPELL" : "") : "PREPARE SPELL";

  const enemySize = `${4 + (enemy.level || 1) * 0.8}rem`;

  // split combined emoji string into primary + secondary pieces
  const emojis = Array.from(enemy.emoji || '');
  const primaryEmoji = emojis[0] || '';
  const secondaryEmoji = emojis.slice(1).join('');

  const maxArtifacts = 5;

  const tooltipFor = (effects, tag) => {
    const eff = effects && effects.find(s => s.tag === tag);
    if (!eff) return tag.toUpperCase();

    switch (eff.tag) {
      case 'poison':
      case 'bleed':
        return `${eff.tag.toUpperCase()}: ${eff.damagePerTick || 0} dmg/turn, ${eff.ticks || 0} turn(s)`;
      case 'shield':
        return `Shield: blocks ${eff.block || 0} damage (next hit)`;
      case 'stun':
        return `Stunned: ${eff.ticks || 1} turn(s)`;
      case 'sleep':
        return `Sleeping: ${eff.ticks || 1} turn(s)`;
      default:
        if (eff.ticks) return `${eff.tag.toUpperCase()}: ${eff.ticks} turn(s)`;
        return eff.tag.toUpperCase();
    }
  };

  return (
    <div className="app">
      <div className="arena">
        
        {/* --- SPELL EFFECT OVERLAY --- */}
        {spellEffect && <div className="spell-overlay">{spellEffect}</div>}

        {/* --- ENEMY SECTION --- */}
        <div className="enemy-position">
          <h3>
            <span style={{fontSize: '0.7em', color: '#8b735b', marginRight: '6px'}}>
              LV.{enemy.level || 1}
            </span> 
            {enemy.name}
          </h3>
          
          {/* Apply animation class here */}
          <div 
            className={`enemy-emoji ${animState.enemy}`} 
            style={{ fontSize: enemySize }}
          >
            <span className="emoji-primary">{primaryEmoji}</span>
            {secondaryEmoji && <span className="emoji-secondary" aria-hidden>{secondaryEmoji}</span>}
          </div>
          
          <div className="enemy-bars">
            <div className="bar">
              <div className="bar-text">❤️ {enemy.hp}</div>
              <div className="bar-fill hp-fill" style={{ width: `${enemyHpPct}%` }}></div>
            </div>
            <div className="bar">
              <div className="bar-text">🧠 {enemy.wp}</div>
              <div className="bar-fill wp-fill" style={{ width: `${enemyWpPct}%` }}></div>
            </div>
          </div>

          {enemy.statusEffects && enemy.statusEffects.length > 0 && (
            <div className="enemy-status-effects">
              {Array.from(new Set(enemy.statusEffects.map(s => s.tag))).map((tag, i) => {
                const title = tooltipFor(enemy.statusEffects, tag);
                return (
                  <div key={i} className="dot-pill" title={title}>
                    <span className="dot-emoji">{TAG_EMOJIS[tag] || '•'}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* --- PLAYER SECTION --- */}
        <div className="player-position">
          <div className="player-row">
            {/* Apply animation class here */}
            <div className={`player-avatar ${animState.player}`}>
              {playerAvatar}
            </div>
            
            <div className="player-stats">
               {playerStatusEffects && playerStatusEffects.length > 0 && (
                 <div className="player-status-effects">
                   {Array.from(new Set(playerStatusEffects.map(s => s.tag))).map((tag, i) => {
                     const title = tooltipFor(playerStatusEffects, tag);
                     return (
                       <div key={i} className="dot-pill" title={title}>
                         <span className="dot-emoji">{TAG_EMOJIS[tag] || '•'}</span>
                       </div>
                     );
                   })}
                 </div>
               )}
               <div className="bar">
                 <div className="bar-text" style={{ textAlign: 'left', paddingLeft: '5px' }}>❤️ {playerHp}/{maxPlayerHp}</div>
                 <div className="bar-fill hp-fill" style={{ width: `${playerHpPct}%` }}></div>
               </div>
               
               <div className="inventory">
                 {inventory.map((item, i) => (
                   <div key={i} className="artifact" title="Artifact">{item}</div>
                 ))}
                 {[...Array(Math.max(0, maxArtifacts - inventory.length))].map((_, i) => (
                    <div key={`empty-${i}`} className="artifact" style={{opacity: 0.3}}></div>
                 ))}
               </div>
            </div>
          </div>
        </div>

      </div>

      <CombatLog logs={logs} />
      
      {/* ... Rest of Controls ... */}
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
        {/* SHUFFLE BUTTON */}
        <button onClick={onShuffle} title="Shuffle tile order in hand">🔀</button>
        <button onClick={onClear} title="Clear staged tiles">✖</button>
        <button 
          onClick={onDiscard} 
          style={{ borderColor: '#b85c50', color: '#b85c50' }}
          title="Discard hand and skip turn"	
        >
          ♻
        </button>
        <button 
          className="cast-btn" 
          disabled={spellSlots.length === 0} 
          onClick={onCast}
          title="Cast Spell"
        >
          🪄
        </button>
      </div>
    </div>
  );
}