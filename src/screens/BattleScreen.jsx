import { useEffect, useState } from 'react';
import { DndContext, useDroppable, DragOverlay, useSensor, useSensors, PointerSensor, closestCenter, pointerWithin } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import Rune from "../components/Rune";
import CombatLog from "../components/CombatLog";
import { TAG_EMOJIS } from "../data/tags"; 
import { STATUS_PROPERTIES, STATUS_EFFECTS } from "../data/statusEffects"; 
import PixelEmoji from '../components/PixelEmoji';
import HelpModal from '../components/HelpModal';
import SoundToggle from '../components/SoundToggle';
import Modal from '../components/Modal';

const formatMultiplier = (mult) => {
  if (mult === undefined || mult === null) return null;
  const rounded = Math.round(mult * 100) / 100;
  return `x${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded}`;
};

function Droppable({ id, children, className, style }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const droppableStyle = {
    ...style,
    backgroundColor: isOver ? 'rgba(255, 255, 255, 0.1)' : undefined,
    transition: 'background-color 0.2s ease',
    borderRadius: '8px'
  };
  
  return (
    <div ref={setNodeRef} className={className} style={droppableStyle}>
      {children}
    </div>
  );
}


export default function BattleScreen({ 
  playerAvatar, 
  playerHp,      
  maxPlayerHp,   
  inventory,     
  playerStatusEffects, 
  revealWeaknesses,
  enemy,
  familiars,
  logs, 
  hand, 
  spellSlots,
  resolvedSpell,
  actions,
  isValidWord,
  shakeError,
  animState, 
  spellEffect,
  awaitingGameOver,
  onProceedToGameOver
}) {
  const { onMoveRune, onReturnRune, onCast, onClear, onDiscard, onShuffle, onSort, setSpellSlots } = actions;
  const [showHelp, setShowHelp] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [activeRune, setActiveRune] = useState(null);
  const [showMulliganConfirm, setShowMulliganConfirm] = useState(false);
  const [skipMulliganWarning, setSkipMulliganWarning] = useState(false);
  const [persistSkip, setPersistSkip] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('leximancer-skip-mulligan-warning') : null;
    if (stored === '1') {
      setSkipMulliganWarning(true);
      setPersistSkip(true);
    }
  }, []);

  // Keyboard shortcuts: type runes, backspace to undo last rune, enter to cast
  useEffect(() => {
    const handler = (event) => {
      if (awaitingGameOver) return;
      if (showMulliganConfirm || showHelp) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const activeTag = document.activeElement?.tagName;
      const isTypingField = activeTag === 'INPUT' || activeTag === 'TEXTAREA' || (document.activeElement?.isContentEditable);
      if (isTypingField) return;

      // Backspace: remove rightmost staged rune
      if (event.key === 'Backspace') {
        const lastRune = spellSlots[spellSlots.length - 1];
        if (lastRune) {
          event.preventDefault();
          onReturnRune(lastRune);
        }
        return;
      }

      // Enter: cast if any runes are staged
      if (event.key === 'Enter') {
        if (spellSlots.length > 0) {
          event.preventDefault();
          onCast();
        }
        return;
      }

      // Letter keys: play matching rune from hand
      if (/^[a-zA-Z]$/.test(event.key)) {
        const letter = event.key.toUpperCase();
        const match = hand.find(t => t && t.char.toUpperCase() === letter);
        if (match) {
          event.preventDefault();
          onMoveRune(match);
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [hand, spellSlots, onMoveRune, onReturnRune, onCast, showMulliganConfirm, showHelp, awaitingGameOver]);

  useEffect(() => {
    if (awaitingGameOver) {
      setShowMulliganConfirm(false);
    }
  }, [awaitingGameOver]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const clearActiveDrag = () => {
    setActiveId(null);
    setActiveRune(null);
  };

  // Make the hand droppable respond to pointer position across its whole area
  const collisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length) return pointerCollisions;
    return closestCenter(args);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setActiveRune(event.active.data.current?.rune);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    clearActiveDrag();

    if (!over) return;

    const rune = active.data.current?.rune;
    if (!rune) return;

    // 1. Reordering within Spell Zone
    if (active.data.current?.sortable?.containerId === 'spell-zone' && over.id !== 'hand-zone') {
      const oldIndex = spellSlots.findIndex(t => t.id === active.id);
      const pointerPosition = getPointerPosition(event);
      let newIndex;

      if (over.id === 'spell-zone') {
        newIndex = computeInsertIndex(over, pointerPosition, spellSlots);
      } else {
        newIndex = spellSlots.findIndex(t => t.id === over.id);
      }

      if (oldIndex !== -1 && newIndex !== undefined && newIndex !== -1 && newIndex !== oldIndex) {
        setSpellSlots(arrayMove(spellSlots, oldIndex, newIndex));
      }
      return;
    }

    // 2. Dragging from Hand to Spell Zone
    if (over.data.current?.sortable?.containerId === 'spell-zone' || over.id === 'spell-zone') {
      const isInHand = hand.find(t => t && t.id === rune.id);
      if (isInHand) {
        const pointerPosition = getPointerPosition(event);
        const insertIndex = computeInsertIndex(over, pointerPosition, spellSlots);
        onMoveRune(rune, insertIndex);
      }
    } 
    // 3. Dragging from Spell Zone to Hand
    else if (over.id === 'hand-zone') {
      const isInSpellSlots = spellSlots.find(t => t.id === rune.id);
      if (isInSpellSlots) {
        onReturnRune(rune);
      }
    }
    };

  const handleDragCancel = () => {
    clearActiveDrag();
  };

  const handleMulliganClick = () => {
    if (skipMulliganWarning) {
      onDiscard();
      return;
    }
    setShowMulliganConfirm(true);
  };

  const confirmMulligan = () => {
    if (persistSkip) {
      window.localStorage.setItem('leximancer-skip-mulligan-warning', '1');
      setSkipMulliganWarning(true);
    }
    setShowMulliganConfirm(false);
    onDiscard();
  };

  const cancelMulligan = () => {
    if (persistSkip) {
      window.localStorage.setItem('leximancer-skip-mulligan-warning', '1');
      setSkipMulliganWarning(true);
    }
    setShowMulliganConfirm(false);
  };

  const enemyHpPct = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
  const enemyWpPct = Math.max(0, (enemy.wp / enemy.maxWp) * 100);
  const playerHpPct = Math.max(0, (playerHp / maxPlayerHp) * 100);

  const feedbackColor = isValidWord ? '#4e6d46' : (spellSlots.length > 0 ? '#b85c50' : '#8b735b');

  const enemySize = `${3 + (enemy.level || 1) * 0.7}rem`;

  const primaryEmoji = enemy.emoji;
  const secondaryEmoji = enemy.affixEmoji || '';

  const maxArtifacts = 3;

  const tagsToIgnoreInPreview = ['concrete', 'abstract'];
  const unfriendlyStatusEffects = [STATUS_EFFECTS.POISON, STATUS_EFFECTS.BLEED, STATUS_EFFECTS.STUN, STATUS_EFFECTS.CHARM, STATUS_EFFECTS.FREEZE, STATUS_EFFECTS.SILENCE, STATUS_EFFECTS.CONFUSION, STATUS_EFFECTS.FEAR];
  const friendlyStatusEffects = [STATUS_EFFECTS.POWER_BUFF, STATUS_EFFECTS.INTELLIGENCE_BUFF, STATUS_EFFECTS.SHIELD];
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
      case 'power buff':
        return `Power: +${eff.damageMult ? `${Math.round((eff.damageMult - 1) * 100)}%` : '50%'} HP damage for ${eff.ticks || 1} turn(s)`;
      case 'intelligence buff':
        return `Intelligence: +${eff.damageMult ? `${Math.round((eff.damageMult - 1) * 100)}%` : '50%'} WP damage for ${eff.ticks || 1} turn(s)`;
      default:
        if (eff.ticks) return `${eff.tag.toUpperCase()}: ${eff.ticks} turn(s)`;
        return eff.tag.toUpperCase();
    }
  };

  return (
    <div className="app">
      <SoundToggle />
      <Modal 
        isOpen={showMulliganConfirm} 
        onClose={cancelMulligan} 
        title="Are you sure?"
      >
        <p style={{ marginTop: 0 }}>Mulligan discards your hand and SKIPS YOUR TURN. Proceed?</p>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', userSelect: 'none' }}>
          <input
            type="checkbox"
            checked={persistSkip}
            onChange={(e) => setPersistSkip(e.target.checked)}
          />
          OK yeah I KNOW
        </label>
        <div className="modal-actions">
          <button onClick={cancelMulligan} style={{ backgroundColor: '#917976ff', color: '#fff', fontFamily: "ari-bold, monospace" }}>CANCEL</button>
          <button onClick={confirmMulligan} style={{ color: '#fff', fontFamily: "ari-bold, monospace" }}>MULLIGAN</button>
        </div>
      </Modal>
      <div className="arena">
        
        {/* --- SPELL EFFECT OVERLAY --- */}
        {spellEffect && <div className="spell-overlay"><PixelEmoji icon={spellEffect} size="10rem" /></div>}

        {/* --- ENEMY SECTION --- */}
        <div className="enemy-position">
          <h3>
            <span style={{fontSize: '0.5rem', color: '#8b735b', marginRight: '6px'}}>
              LV.{enemy.level || 1}
            </span> 
            <span style={{fontSize: '0.7rem'}}>{enemy.name}</span>
          </h3>
        {/* TODO: REFACTOR STATUS EFFECTS THEY ARE A COMPLETE MESS OMG */}
        {/* --- DAMAGE PREVIEW --- */}
        {
          resolvedSpell && 
          resolvedSpell.isValid && (
            resolvedSpell.damage > 0 || (
              resolvedSpell.status && unfriendlyStatusEffects.includes(resolvedSpell.status)
            ) || 
            resolvedSpell.dot || (
              resolvedSpell.statusEffect && unfriendlyStatusEffects.includes(resolvedSpell.statusEffect.tag)
            )
          ) && 
          (
            <div className="enemy-damage-preview">
              {resolvedSpell.tags && resolvedSpell.tags.length > 0 && (
                <div title={`Tags: ${resolvedSpell.tags.join(', ')}`}>
                  {resolvedSpell.tags.filter(t => TAG_EMOJIS[t]).slice(0, 3).map((tag, i) => (
                    !tagsToIgnoreInPreview.includes(tag) && (<PixelEmoji key={i} icon={TAG_EMOJIS[tag]} title={tag}/>)
                  ))}
                  {resolvedSpell.affinityMult !== undefined && (
                    <span style={{fontWeight: 'bold', color: '#f3c969'}}> ({formatMultiplier(resolvedSpell.affinityMult)})</span>
                  )}
                </div>
              )}
              {resolvedSpell.damage > 0 && (
                <div 
                  title={`Deals ${resolvedSpell.damage} ${resolvedSpell.targetStat === 'hp' ? 'HP' : 'WP'} damage`}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 2px',}}
                >
                  <PixelEmoji icon={resolvedSpell.targetStat === 'hp' ? '❤️' : '🧠'}/>
                  <span style={{fontWeight: 'bold', color: resolvedSpell.targetStat === 'hp' ? '#ff6b6b' : '#4949f3ff'}}>-{resolvedSpell.damage}</span>
                </div>
              )}
              {resolvedSpell.status && unfriendlyStatusEffects.includes(resolvedSpell.status) && (
                <div
                  title={`Status: ${resolvedSpell.status}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 2px',}}
                >
                  {/* <PixelEmoji icon={STATUS_PROPERTIES[resolvedSpell.status]?.emoji || '😵‍💫'}/> */}
                  <span style={{color:'white'}}> {resolvedSpell.status}</span>
                </div>
              )}
              {resolvedSpell.statusEffect && unfriendlyStatusEffects.includes(resolvedSpell.statusEffect.tag) && (
                <div 
                  title={`Status: ${resolvedSpell.statusEffect.tag}${resolvedSpell.statusEffect.ticks ? ` (${resolvedSpell.statusEffect.ticks} turn${resolvedSpell.statusEffect.ticks > 1 ? 's' : ''})` : ''}${resolvedSpell.statusEffect.block ? `, blocks ${resolvedSpell.statusEffect.block}` : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 2px',}}
                >
                  {/* <PixelEmoji icon={STATUS_PROPERTIES[resolvedSpell.statusEffect.tag]?.emoji || '✨'}/> */}
                  <span style={{color:'white'}}>{resolvedSpell.statusEffect.tag} {resolvedSpell.statusEffect.block}</span>
                </div>
              )}
              {resolvedSpell.dot && (
                <div title={`${resolvedSpell.dot.tag}: ${resolvedSpell.dot.damagePerTick} dmg/turn for ${resolvedSpell.dot.ticks} turns`}>
                  <PixelEmoji icon={STATUS_PROPERTIES[resolvedSpell.dot.tag]?.emoji || '🩸'}/>
                  <span style={{color:'white'}}> {resolvedSpell.dot.damagePerTick}×{resolvedSpell.dot.ticks}</span>
                </div>
              )}
            </div>
        )}
          
          <div className="enemy-bars">
            <div className="bar">
              <div className="bar-text" style={{ textAlign: 'left', paddingLeft: '5px' }}><PixelEmoji icon="❤️" size="0.8rem"/> {enemy.hp}</div>
              <div className="bar-fill hp-fill" style={{ width: `${enemyHpPct}%` }}></div>
            </div>
            <div className="bar">
              <div className="bar-text" style={{ textAlign: 'left', paddingLeft: '5px' }}><PixelEmoji icon="🧠" size="0.8rem"/> {enemy.wp}</div>
              <div className="bar-fill wp-fill" style={{ width: `${enemyWpPct}%` }}></div>
            </div>
          </div>

          <div 
            className={`enemy-emoji ${animState.enemy}`} 
            style={{ fontSize: enemySize }}
          >
            <span className="emoji-primary"><PixelEmoji icon={primaryEmoji} size={enemySize}/></span>
            {secondaryEmoji && <span className="emoji-secondary" aria-hidden><PixelEmoji icon={secondaryEmoji} size={"2rem"}/></span>}
          </div>

          {enemy.statusEffects && enemy.statusEffects.length > 0 && (
            <div className="enemy-status-effects">
              {Array.from(new Set(enemy.statusEffects.map(s => s.tag))).map((tag, i) => {
                const title = tooltipFor(enemy.statusEffects, tag);
                const emoji = STATUS_PROPERTIES[tag]?.emoji || TAG_EMOJIS[tag] || '•';
                return (
                  <div key={i} className="dot-pill" title={title}>
                    <span className="dot-emoji"><PixelEmoji icon={emoji} size="1.2rem"/></span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* --- FAMILIAR SECTION --- */}
        {familiars && familiars.length > 0 && (
          <div className="familiar-position">
            {familiars.map((familiar, index) => {
              const familiarAnim = (animState.familiars && animState.familiars[familiar.id]) || '';
              return (
                <div 
                  key={familiar.id} 
                  className={`familiar-avatar ${familiarAnim}`} 
                  title={`${familiar.name} - ${familiar.turnsLeft} turns left`}
                  style={{ marginLeft: index > 0 ? '10px' : '0' }}
                >
                  <PixelEmoji icon={familiar.emoji} size="3rem"/>
                </div>
              );
            })}
          </div>
        )}
      
        {/* --- GAME OVER TEXT --- */}
        {awaitingGameOver && (
          <div className="game-over-text">
            REST IN PROSE.
          </div>
        )}

        {/* --- PLAYER SECTION --- */}
        <div className="player-position">
          {
            resolvedSpell && 
            resolvedSpell.isValid && (
              resolvedSpell.heal > 0 ||
              resolvedSpell.cleanse || 
              resolvedSpell.isSummon || (
                resolvedSpell.status && friendlyStatusEffects.includes(resolvedSpell.status)
              ) || (
                resolvedSpell.statusEffect && friendlyStatusEffects.includes(resolvedSpell.statusEffect.tag)
              )
            ) && (
              <div className="player-buff-preview">
                  {resolvedSpell.tags && resolvedSpell.tags.length > 0 && (
                    <div title={`Tags: ${resolvedSpell.tags.join(', ')}`}>
                      {resolvedSpell.tags.filter(t => TAG_EMOJIS[t]).slice(0, 3).map((tag, i) => (
                        !tagsToIgnoreInPreview.includes(tag) && (<PixelEmoji key={i} icon={TAG_EMOJIS[tag]} title={tag}/>)
                      ))}
                    </div>
                  )}
                  {resolvedSpell.heal > 0 && (
                    <div title={`Heals ${resolvedSpell.heal} HP`}>
                      <PixelEmoji icon="❤️"/>
                      <span style={{fontWeight: 'bold', color: '#82e9a8ff'}}> +{resolvedSpell.heal}</span>
                    </div>
                  )}
                  {resolvedSpell.cleanse && (
                    <div title="Cleanses negative effects on player">
                      <span style={{color:'#ffffffff'}}>cleanse</span>
                    </div>
                  )}
                  {resolvedSpell.isSummon && (
                    <div title="Summons a familiar">
                      <span style={{color:'black', fontSize:'1.7rem'}}>+</span>
                      <PixelEmoji icon={resolvedSpell.emoji || '✨'} size='1.5rem'/>
                    </div>
                  )}
                  {resolvedSpell.statusEffect && friendlyStatusEffects.includes(resolvedSpell.statusEffect.tag) && (
                    <div 
                      title={`Status: ${resolvedSpell.statusEffect.tag}${resolvedSpell.statusEffect.ticks ? ` (${resolvedSpell.statusEffect.ticks} turn${resolvedSpell.statusEffect.ticks > 1 ? 's' : ''})` : ''}${resolvedSpell.statusEffect.block ? `, blocks ${resolvedSpell.statusEffect.block}` : ''}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 2px',}}
                    >
                      {/* <PixelEmoji icon={STATUS_PROPERTIES[resolvedSpell.statusEffect.tag]?.emoji || '✨'}/> */}
                      <span style={{color:'white'}}>{resolvedSpell.statusEffect.block}</span>
                      <PixelEmoji icon={'⬆️'}/>
                    </div>
                  )}
              </div>
          )}
          <div className="player-row">
            <div className={`player-avatar ${animState.player}`} style={{ visibility: awaitingGameOver ? 'hidden' : 'visible' }}>
              <PixelEmoji icon={playerAvatar} size="4.5rem"/>
            </div>
            
            <div className="player-stats">
               {playerStatusEffects && playerStatusEffects.length > 0 && (
                 <div className="player-status-effects">
                   {Array.from(new Set(playerStatusEffects.map(s => s.tag))).map((tag, i) => {
                     const title = tooltipFor(playerStatusEffects, tag);
                     const emoji = STATUS_PROPERTIES[tag]?.emoji || TAG_EMOJIS[tag] || '•';
                     return (
                       <div key={i} className="dot-pill" title={title}>
                         <span className="dot-emoji"><PixelEmoji icon={emoji} size="1.2rem"/></span>
                       </div>
                     );
                   })}
                 </div>
               )}
               <div className="bar">
                 <div className="bar-text" style={{ textAlign: 'left', paddingLeft: '5px' }}><PixelEmoji icon="❤️" size="0.8rem"/> {playerHp}/{maxPlayerHp}</div>
                 <div className="bar-fill hp-fill" style={{ width: `${playerHpPct}%` }}></div>
               </div>

               <div className="inventory">
                 {inventory.map((item, i) => {
                   const isObj = item && typeof item === 'object';
                   const key = isObj ? item.id : `inv-${i}`;
                   const title = isObj ? `${item.name}: ${item.desc}` : 'Artifact';
                   const content = isObj ? <PixelEmoji icon={item.emoji} size="1rem"/> : item;
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
            <div className="weakness-crystal" title="Crystal Ball reveals weaknesses"> <PixelEmoji icon={"🔮"} size="0.8rem"/></div>
            <div className="weakness-list">
              {enemy.weaknesses.map((w, i) => (
                <span key={i} className="weakness-emoji" title={`weak to ${w}`}>
                  <PixelEmoji icon={TAG_EMOJIS[w] || w} size="1rem"/>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="log-controls-row">
        <CombatLog logs={logs} />
        <div className="controls-stack">
          {awaitingGameOver ? (
            <>
              <div className="controls-block controls-game-over">
                <button className="game-over-btn" onClick={onProceedToGameOver} title="Proceed to summary">
                  VIEW STATS
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="controls-row controls-small">
                <button onClick={handleMulliganClick} title="Discard hand and skip turn">
                  <PixelEmoji icon="♻" size="1.2rem"/>
                </button>
                <button onClick={onShuffle} title="Shuffle rune order in hand">
                  <PixelEmoji icon="🔀" size="1.2rem"/>
                </button>
                <button onClick={onSort} title="Sort hand alphabetically">
                  <PixelEmoji icon="🔡" size="1.2rem"/>
                </button>
              </div>
              <div className="controls-row controls-primary">
                <button className="clear-btn" onClick={onClear} title="Clear staged runes">
                  <PixelEmoji icon="🗑️" size="1.2rem"/>
                </button>
                <button 
                  className="cast-btn" 
                  disabled={spellSlots.length === 0} 
                  onClick={onCast}
                  title="Cast Spell"
                >
                  <PixelEmoji icon="🪄" size="1.2rem"/>
                </button>
              </div>
            </>
          )}
        </div>
      </div>


      <DndContext 
        sensors={sensors} 
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext 
            id="spell-zone"
            items={spellSlots.map(t => t.id)}
            strategy={horizontalListSortingStrategy}
        >
            <Droppable 
            id="spell-zone"
            className={`spell-slot ${shakeError ? 'shake' : ''}`} 
            style={{ borderColor: feedbackColor }}
            >
            {spellSlots.length === 0 && <span style={{color: 'rgba(139, 115, 91, 0.5)', fontSize: '2rem'}}>?</span>}
            {spellSlots.map(t => (
                <Rune 
                  key={t.id} 
                  rune={t} 
                  onClick={onReturnRune} 
                  sortable 
                  isActive={activeId === t.id} 
                />
            ))}
            </Droppable>
        </SortableContext>

        <Droppable id="hand-zone" className="hand">
          {hand.map((t, i) => (
            t ? (
              <Rune 
                key={t.id} 
                rune={t} 
                onClick={onMoveRune} 
                isActive={activeId === t.id} 
                showGhostPlaceholder 
              />
            ) : (
              <div key={`empty-${i}`} className="rune empty" />
            )
          ))}
        </Droppable>

        <DragOverlay>
          {activeRune ? <Rune rune={activeRune} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {/* HELP BUTTON */}
      <button  
        className="help-btn" 
        onClick={() => setShowHelp(true)} title="How to Play"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          fontSize: '0.8em',
          cursor: 'pointer',
          zIndex: 1000,
          padding: '4px'
        }}>
        <PixelEmoji icon="❓" size="1.2rem"/>
      </button>

      {/* --- HELP MODAL --- */}
      <HelpModal 
        isOpen={showHelp} 
        onClose={() => setShowHelp(false)} 
      />
    </div>
  );
}

const extractClientPoint = (event) => {
  if (!event) return null;
  if ('clientX' in event && 'clientY' in event) {
    return { x: event.clientX, y: event.clientY };
  }
  if ('touches' in event && event.touches?.length > 0) {
    const touch = event.touches[0];
    return { x: touch.clientX, y: touch.clientY };
  }
  if ('changedTouches' in event && event.changedTouches?.length > 0) {
    const touch = event.changedTouches[0];
    return { x: touch.clientX, y: touch.clientY };
  }
  return null;
};

const getPointerPosition = (event) => {
  const basePoint = extractClientPoint(event.activatorEvent);
  if (basePoint && event?.delta) {
    return {
      x: basePoint.x + event.delta.x,
      y: basePoint.y + event.delta.y
    };
  }

  // Fallback: use the current center of the dragged element
  const activeRect = event?.active?.rect?.current?.translated || event?.active?.rect?.current?.initial;
  if (activeRect) {
    return {
      x: activeRect.left + (activeRect.width / 2),
      y: activeRect.top + (activeRect.height / 2)
    };
  }

  return null;
};

const computeInsertIndex = (over, pointerPosition, spellSlots) => {
  if (!over) return undefined;
  if (over.id === 'spell-zone') {
    if (spellSlots.length === 0) return 0;
    if (pointerPosition && over.rect) {
      const midpoint = over.rect.left + (over.rect.width / 2);
      return pointerPosition.x < midpoint ? 0 : spellSlots.length;
    }
    // Default to start to avoid failing to move when dropping on empty area
    return 0;
  }

  const overIndex = spellSlots.findIndex(t => t.id === over.id);
  if (overIndex === -1) {
    return undefined;
  }

  if (pointerPosition && over.rect) {
    const rect = over.rect;
    const midpoint = rect.left + (rect.width / 2);
    if (pointerPosition.x > midpoint) {
      return overIndex + 1;
    }
  } else if (overIndex === spellSlots.length - 1) {
    return spellSlots.length;
  }

  return overIndex;
};