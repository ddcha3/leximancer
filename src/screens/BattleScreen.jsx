import Tile from "../components/Tile";
import CombatLog from "../components/CombatLog";
import { TAG_EMOJIS } from "../data/tags"; 
import { STATUS_PROPERTIES } from "../data/statusEffects"; 

export default function BattleScreen({ 
  playerAvatar, 
  playerHp,      
  maxPlayerHp,   
  inventory,     
  playerStatusEffects, 
  revealWeaknesses, 
  encounterIndex, 
  totalEncounters,
  enemy,
  familiars,
  logs, 
  hand, 
  spellSlots, 
  actions,
  isValidWord,
  shakeError,
  animState, 
  spellEffect 
}) {
  const { onMoveTile, onReturnTile, onCast, onClear, onDiscard, onShuffle } = actions;

  const enemyHpPct = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
  const enemyWpPct = Math.max(0, (enemy.wp / enemy.maxWp) * 100);
  const playerHpPct = Math.max(0, (playerHp / maxPlayerHp) * 100);

  const feedbackColor = isValidWord ? '#4e6d46' : (spellSlots.length > 0 ? '#b85c50' : '#8b735b');
  // const feedbackText = spellSlots.length > 2 ? (isValidWord ? "VALID SPELL" : "") : "PREPARE SPELL";

  const enemySize = `${3 + (enemy.level || 1) * 0.7}rem`;

  // split combined emoji string into primary + secondary pieces
  const emojis = Array.from(enemy.emoji || '');
  const primaryEmoji = emojis[0] || '';
  const secondaryEmoji = emojis.slice(1).join('');

  const maxArtifacts = 3;

  const tooltipFor = (effects, tag) => {
    const eff = effects && effects.find(s => s.tag === tag);
    if (!eff) return tag.toUpperCase();

    switch (eff.tag) {
      case 'poison':
        return `${eff.tag.toUpperCase()}: ${eff.damagePerTick || 0} dmg/turn, ${eff.ticks || 0} turn(s)`;
      case 'bleed':
        return `${eff.tag.toUpperCase()}: ${eff.damagePerTick || 0} dmg/turn, ${eff.ticks || 0} turn(s)`;
      case 'shield':
        return `Shield: blocks ${eff.block || 0} damage (next hit)`;
      case 'stun':
        return `Stunned: ${eff.ticks || 1} turn(s)`;
      case 'sleep':
        return `Sleeping: ${eff.ticks || 1} turn(s)`;
      case 'charm':
        return `Charmed: target deals ${eff.reduceMult ? `${Math.round(eff.reduceMult * 100)}%` : 'reduced'} damage for ${eff.ticks || 1} turn(s)`;
      case 'confusion':
        return `Confused: 50% chance to attack self for ${eff.ticks || 1} turn(s)`;
      case 'fear':
        return `Fear: +50% damage taken for ${eff.ticks || 1} turn(s)`;
      case 'power_buff':
        return `Power: +${eff.damageMult ? `${Math.round((eff.damageMult - 1) * 100)}%` : '50%'} HP damage for ${eff.ticks || 1} turn(s)`;
      case 'intelligence_buff':
        return `Intelligence: +${eff.damageMult ? `${Math.round((eff.damageMult - 1) * 100)}%` : '50%'} WP damage for ${eff.ticks || 1} turn(s)`;
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

          <div 
            className={`enemy-emoji ${animState.enemy}`} 
            style={{ fontSize: enemySize }}
          >
            <span className="emoji-primary">{primaryEmoji}</span>
            {secondaryEmoji && <span className="emoji-secondary" aria-hidden>{secondaryEmoji}</span>}
          </div>



          {enemy.statusEffects && enemy.statusEffects.length > 0 && (
            <div className="enemy-status-effects">
              {Array.from(new Set(enemy.statusEffects.map(s => s.tag))).map((tag, i) => {
                const title = tooltipFor(enemy.statusEffects, tag);
                const emoji = STATUS_PROPERTIES[tag]?.emoji || TAG_EMOJIS[tag] || '•';
                return (
                  <div key={i} className="dot-pill" title={title}>
                    <span className="dot-emoji">{emoji}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* --- FAMILIAR SECTION --- */}
        {familiars && familiars.length > 0 && (
          <div className="familiar-position">
            {familiars.map((familiar, index) => (
              <div 
                key={familiar.id} 
                className={`familiar-avatar ${animState.familiars?.[familiar.id] || ''}`} 
                title={`${familiar.name} - ${familiar.turnsLeft} turns left`}
                style={{ marginLeft: index > 0 ? '10px' : '0' }}
              >
                {familiar.emoji}
              </div>
            ))}
          </div>
        )}

        {/* --- PLAYER SECTION --- */}
        <div className="player-position">
          <div className="player-row">
            <div className={`player-avatar ${animState.player}`}>
              {playerAvatar}
            </div>
            
            <div className="player-stats">
               {playerStatusEffects && playerStatusEffects.length > 0 && (
                 <div className="player-status-effects">
                   {Array.from(new Set(playerStatusEffects.map(s => s.tag))).map((tag, i) => {
                     const title = tooltipFor(playerStatusEffects, tag);
                     const emoji = STATUS_PROPERTIES[tag]?.emoji || TAG_EMOJIS[tag] || '•';
                     return (
                       <div key={i} className="dot-pill" title={title}>
                         <span className="dot-emoji">{emoji}</span>
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
                 {inventory.map((item, i) => {
                   const isObj = item && typeof item === 'object';
                   const key = isObj ? item.id : `inv-${i}`;
                   const title = isObj ? `${item.name}: ${item.desc}` : 'Artifact';
                   const content = isObj ? item.emoji : item;
                   return (
                     <div key={key} className="artifact" title={title}>{content}</div>
                   );
                 })}
                 {[...Array(Math.max(0, maxArtifacts - inventory.length))].map((_, i) => (
                    <div key={`empty-${i}`} className="artifact" style={{opacity: 0.3}}></div>
                 ))}
               </div>
            </div>
          </div>
        </div>


        {revealWeaknesses && enemy && enemy.weaknesses && (
          <div className="enemy-weaknesses">
            <div className="weakness-crystal" title="Crystal Ball reveals weaknesses">🔮</div>
            <div className="weakness-list">
              {enemy.weaknesses.map((w, i) => (
                <span key={i} className="weakness-emoji" title={`weak to ${w}`}>
                  {TAG_EMOJIS[w] || w}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      <CombatLog logs={logs} />
      
      {/* <div style={{ 
        height: '20px', 
        color: feedbackColor, 
        fontWeight: 'bold', 
        fontSize: '0.8rem',
        marginBottom: '5px',
        letterSpacing: '1px'
      }}>
        {feedbackText}
      </div> */}

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
        {hand.map((t, i) => (
          t ? <Tile key={t.id} tile={t} onClick={onMoveTile} /> : <div key={`empty-${i}`} className="tile empty" />
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