import { useState } from 'react';
import { DndContext, useDroppable, DragOverlay, useSensor, useSensors, PointerSensor, closestCenter, pointerWithin } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import Tile from "../components/Tile";
import CombatLog from "../components/CombatLog";
import { TAG_EMOJIS } from "../data/tags"; 
import { STATUS_PROPERTIES } from "../data/statusEffects"; 
import PixelEmoji from '../components/PixelEmoji';
import HelpModal from '../components/HelpModal';
import SoundToggle from '../components/SoundToggle';

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
  spellEffect 
}) {
  const { onMoveTile, onReturnTile, onCast, onClear, onDiscard, onShuffle, onSort, setSpellSlots } = actions;
  const [showHelp, setShowHelp] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [activeTile, setActiveTile] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Make the hand droppable respond to pointer position across its whole area
  const collisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length) return pointerCollisions;
    return closestCenter(args);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setActiveTile(event.active.data.current?.tile);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveTile(null);

    if (!over) return;

    const tile = active.data.current?.tile;
    if (!tile) return;

    // 1. Reordering within Spell Zone
    if (active.data.current?.sortable?.containerId === 'spell-zone' && over.id !== 'hand-zone') {
      if (active.id !== over.id) {
        const oldIndex = spellSlots.findIndex(t => t.id === active.id);
        const newIndex = spellSlots.findIndex(t => t.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          setSpellSlots(arrayMove(spellSlots, oldIndex, newIndex));
        }
      }
      return;
    }

    // 2. Dragging from Hand to Spell Zone (Insert at precise position)
    if (over.data.current?.sortable?.containerId === 'spell-zone' || over.id === 'spell-zone') {
      const isInHand = hand.find(t => t && t.id === tile.id);
      if (isInHand) {
        const pointerPosition = getPointerPosition(event);
        const insertIndex = computeInsertIndex(over, pointerPosition, spellSlots);
        onMoveTile(tile, insertIndex);
      }
    } 
    // 3. Dragging from Spell Zone to Hand
    else if (over.id === 'hand-zone') {
      const isInSpellSlots = spellSlots.find(t => t.id === tile.id);
      if (isInSpellSlots) {
        onReturnTile(tile);
      }
    }
    };

  const enemyHpPct = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
  const enemyWpPct = Math.max(0, (enemy.wp / enemy.maxWp) * 100);
  const playerHpPct = Math.max(0, (playerHp / maxPlayerHp) * 100);

  const feedbackColor = isValidWord ? '#4e6d46' : (spellSlots.length > 0 ? '#b85c50' : '#8b735b');

  const enemySize = `${3 + (enemy.level || 1) * 0.7}rem`;

  const primaryEmoji = enemy.emoji;
  const secondaryEmoji = enemy.affixEmoji || '';

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
      <div className="arena">
        
        {/* --- SPELL EFFECT OVERLAY --- */}
        {spellEffect && <div className="spell-overlay"><PixelEmoji icon={spellEffect} size="10rem" /></div>}

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

        {/* --- PLAYER SECTION --- */}
        <div className="player-position">
          <div className="player-row">
            <div className={`player-avatar ${animState.player}`}>
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

      <CombatLog logs={logs} />

       {/* --- SPELL PREVIEW INFO --- */}
        {resolvedSpell && spellSlots.length > 0 && resolvedSpell.isValid && (
          <div className="spell-preview" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '8px',
            padding: '8px',
            // backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#c9ad8a',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {resolvedSpell.isConfused && (
              <div title="Confused: 50% chance to hit self" style={{
                padding: '4px 8px',
                backgroundColor: 'rgba(147, 51, 234, 0.5)',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: '#e9d5ff'
              }}>
                CONFUSED
              </div>
            )}
            {resolvedSpell.damage > 0 && (
              <div title={`Deals ${resolvedSpell.damage} ${resolvedSpell.targetStat === 'hp' ? 'HP' : 'WP'} damage`}
                style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: 'rgba(90, 75, 73, 0.3)',
                borderRadius: '4px'
              }}>
                <PixelEmoji icon={resolvedSpell.targetStat === 'hp' ? '❤️' : '🧠'} size="1rem"/>
                <span style={{fontWeight: 'bold', color: resolvedSpell.targetStat === 'hp' ? '#ff6b6b' : '#4949f3ff'}}>{resolvedSpell.damage}</span>
              </div>
            )}
            {resolvedSpell.heal > 0 && (
              <div title={`Heals ${resolvedSpell.heal} HP`}
                style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: 'rgba(78, 109, 70, 0.3)',
                borderRadius: '4px'
              }}>
                <PixelEmoji icon="💚" size="1rem"/>
                <span style={{fontWeight: 'bold', color: '#4ade80'}}>+{resolvedSpell.heal}</span>
              </div>
            )}
            {resolvedSpell.tags && resolvedSpell.tags.length > 0 && (
              <div title={`Tags: ${resolvedSpell.tags.join(', ')}`}
                style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: 'rgba(139, 115, 91, 0.3)',
                borderRadius: '4px'
              }}>
                {resolvedSpell.tags.filter(t => TAG_EMOJIS[t]).slice(0, 3).map((tag, i) => (
                  <PixelEmoji key={i} icon={TAG_EMOJIS[tag]} size="1rem" title={tag}/>
                ))}
              </div>
            )}
            {resolvedSpell.statusEffect && (
              <div title={`Status: ${resolvedSpell.statusEffect.tag}${resolvedSpell.statusEffect.ticks ? ` (${resolvedSpell.statusEffect.ticks} turn${resolvedSpell.statusEffect.ticks > 1 ? 's' : ''})` : ''}${resolvedSpell.statusEffect.block ? `, blocks ${resolvedSpell.statusEffect.block}` : ''}`}
                style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: 'rgba(147, 51, 234, 0.3)',
                borderRadius: '4px'
              }}>
                <PixelEmoji icon={STATUS_PROPERTIES[resolvedSpell.statusEffect.tag]?.emoji || '✨'} size="1rem"/>
                <span style={{fontSize: '0.8rem'}}>{resolvedSpell.statusEffect.tag} {resolvedSpell.statusEffect.block}</span>
              </div>
            )}
            {resolvedSpell.dot && (
              <div title={`${resolvedSpell.dot.tag}: ${resolvedSpell.dot.damagePerTick} dmg/turn for ${resolvedSpell.dot.ticks} turns`}
                style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: 'rgba(147, 51, 234, 0.3)',
                borderRadius: '4px'
              }}>
                <PixelEmoji icon={STATUS_PROPERTIES[resolvedSpell.dot.tag]?.emoji || '🩸'} size="1rem"/>
                <span style={{fontSize: '0.8rem'}}>{resolvedSpell.dot.damagePerTick}×{resolvedSpell.dot.ticks}</span>
              </div>
            )}
            {resolvedSpell.status && (
              <div title={`Status: ${resolvedSpell.status}`}
                style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: 'rgba(147, 51, 234, 0.3)',
                borderRadius: '4px'
              }}>
                <PixelEmoji icon={STATUS_PROPERTIES[resolvedSpell.status]?.emoji || '😵‍💫'} size="1rem"/>
                <span style={{fontSize: '0.8rem'}}>{resolvedSpell.status}</span>
              </div>
            )}
            {resolvedSpell.cleanse && (
              <div title="Cleanses negative effects"
                style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: 'rgba(250, 204, 21, 0.3)',
                borderRadius: '4px'
              }}>
                <PixelEmoji icon="✨" size="1rem"/>
                <span style={{fontSize: '0.8rem'}}>cleanse</span>
              </div>
            )}
            {/* {resolvedSpell.instantKill && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: 'rgba(250, 204, 21, 0.3)',
                borderRadius: '4px'
              }}>
                <PixelEmoji icon="💀" size="1rem"/>
                <span style={{fontSize: '0.8rem', fontWeight: 'bold'}}>INSTANT KILL</span>
              </div>
            )} */}
            {/* {!resolvedSpell.isValid && (
              <div style={{
                padding: '4px 8px',
                backgroundColor: 'rgba(184, 92, 80, 0.3)',
                borderRadius: '4px',
                fontSize: '0.8rem',
                color: '#ff6b6b'
              }}>
                Invalid word - will fizzle!
              </div>
            )} */}
          </div>
        )}

      <DndContext 
        sensors={sensors} 
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
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
                <Tile 
                  key={t.id} 
                  tile={t} 
                  onClick={onReturnTile} 
                  sortable 
                  isActive={activeId === t.id} 
                />
            ))}
            </Droppable>
        </SortableContext>

        <Droppable id="hand-zone" className="hand">
          {hand.map((t, i) => (
            t ? (
              <Tile 
                key={t.id} 
                tile={t} 
                onClick={onMoveTile} 
                isActive={activeId === t.id} 
                showGhostPlaceholder 
              />
            ) : (
              <div key={`empty-${i}`} className="tile empty" />
            )
          ))}
        </Droppable>

        <DragOverlay>
          {activeTile ? <Tile tile={activeTile} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      <div className="controls">
        {/* HELP BUTTON */}
        <button  
          className="help-btn" 
          onClick={() => setShowHelp(true)} title="How to Play"
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            zIndex: 1000,
            padding: '5px'
          }}>
          <PixelEmoji icon="❓" size="1.2rem"/>
        </button>
        <button onClick={onDiscard} title="Discard hand and skip turn">
          <PixelEmoji icon="♻" size="1.2rem"/>
        </button>
        <button onClick={onShuffle} title="Shuffle tile order in hand">
          <PixelEmoji icon="🔀" size="1.2rem"/>
        </button>
        <button onClick={onSort} title="Sort hand alphabetically">
          <PixelEmoji icon="🔡" size="1.2rem"/>
        </button>
        <button onClick={onClear} title="Clear staged tiles">
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
  if (!basePoint || !event?.delta) return null;
  return {
    x: basePoint.x + event.delta.x,
    y: basePoint.y + event.delta.y
  };
};

const computeInsertIndex = (over, pointerPosition, spellSlots) => {
  if (!over) return undefined;
  if (over.id === 'spell-zone') {
    return spellSlots.length;
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