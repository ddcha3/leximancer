
import { useState, useEffect } from 'react'
import './App.css'

import { createEnemy, MAX_STAGE } from './data/enemies';
import { SPELLBOOK } from './data/spells';
import { TAG_EMOJIS } from './data/tags';
import { ARTIFACTS } from './data/artifacts';
import { FAMILIARS } from './data/familiars';
import { PLAYER_DEFENSE, STARTING_DECK } from './data/player';
// import dictionaryText from './data/dictionary.txt?raw';

import { resolveSpell } from './engine/CombatEngine'
import { STATUS_EFFECTS, STATUS_PROPERTIES } from './data/statusEffects';

import StartScreen from './screens/StartScreen'
import BattleScreen from './screens/BattleScreen'
import RewardScreen from './screens/RewardScreen'

const POS_TAG_MAP = {
    noun: 'noun',
    verb: 'verb',
    adjective: 'adjective',
    adverb: 'adverb',
};

const HAND_SIZE = 45;
const MAX_PLAYER_HP = 100;

const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Processes status effects at the start of a turn.
 * Handles DOT damage, tick reduction, and stun checks.
 */
function processTurnStart(currentEffects, logCallback) {
    if (!currentEffects || currentEffects.length === 0) {
        return { totalDamage: 0, newStatusEffects: [], skipTurnEffect: null };
    }

    let totalDamage = 0;
    let newStatusEffects = [];
    let skipTurnEffect = null;

    currentEffects.forEach(effect => {
        // Handle DOTs
        if (effect.damagePerTick) {
            const dmg = effect.damagePerTick;
            totalDamage += dmg;
            if (logCallback) {
                logCallback(`Takes *${dmg}* ${effect.tag} damage (ongoing).`);
            }
        }

        // Handle CC
        if (effect.tag === STATUS_EFFECTS.STUN || effect.tag === STATUS_EFFECTS.FREEZE || effect.tag === STATUS_EFFECTS.SILENCE) {
            if (!skipTurnEffect) {
                skipTurnEffect = effect.tag;
            }
        }

        // Decrement ticks and keep if still active
        const newTicks = effect.ticks - 1;
        if (newTicks > 0) {
            newStatusEffects.push({ ...effect, ticks: newTicks });
        }
    });

    return { totalDamage, newStatusEffects, skipTurnEffect };
}

function addStatusEffect(currentEffects, newEffect, logCallback) {
    const effects = currentEffects ? [...currentEffects] : [];
    const existingIndex = effects.findIndex(e => e.tag === newEffect.tag);
    if (existingIndex !== -1) {
        // Refresh: overwrite with new effect (resets ticks and updates values)
        effects[existingIndex] = { ...newEffect };
    } else {
        effects.push(newEffect);
    }
    return effects;
}

function applyStatusDamageMultipliers(currentEffects, incomingDamage, logCallback) {
    if (!currentEffects || currentEffects.length === 0) {
        return { remainingDamage: incomingDamage, newStatusEffects: [] };
    }
    let damage = incomingDamage;
    let newEffects = [...currentEffects];
    
    // Check for FEAR (increases damage taken by 50%)
    const fearEffect = newEffects.find(s => s.tag === STATUS_EFFECTS.FEAR);
    if (fearEffect) {
        const originalDamage = damage;
        damage = Math.floor(damage * 1.5);
        if (damage > originalDamage && logCallback) {
             logCallback(`Fear increases damage by ${damage - originalDamage}!`);
        }
    }

    // Find shield
    const shieldIndex = newEffects.findIndex(s => s.tag === STATUS_EFFECTS.SHIELD);
    if (shieldIndex >= 0) {
        const shield = newEffects[shieldIndex];
        const block = shield.block || 0;
        const consumed = Math.min(block, damage);
        damage -= consumed;
        
        if (logCallback && consumed > 0) {
            logCallback(`Shield blocks *${consumed}* damage!`);
        }
        newEffects.splice(shieldIndex, 1);
    }

    return { remainingDamage: damage, newStatusEffects: newEffects };
}

function getOutgoingDamageMultiplier(currentEffects, logCallback, spellTargetType = null) {
    if (!currentEffects) return 1.0;

    let multiplier = 1.0;
    const charmEffect = currentEffects.find(s => s.tag === STATUS_EFFECTS.CHARM);
    
    if (charmEffect && charmEffect.reduceMult) {
        multiplier *= charmEffect.reduceMult;
        if (logCallback) {
            logCallback(`Damage reduced by ${(1 - charmEffect.reduceMult) * 100}% due to charm.`);
        }
    }

    // Power buff: increases damage for hp-targeting spells
    const powerBuff = currentEffects.find(s => s.tag === STATUS_EFFECTS.POWER_BUFF);
    if (powerBuff && powerBuff.damageMult && spellTargetType === 'hp') {
        multiplier *= powerBuff.damageMult;
        if (logCallback) {
            logCallback(`Physical damage increased by ${(powerBuff.damageMult - 1) * 100}% due to power buff!`);
        }
    }

    // Intelligence buff: increases damage for wp-targeting spells
    const intelligenceBuff = currentEffects.find(s => s.tag === STATUS_EFFECTS.INTELLIGENCE_BUFF);
    if (intelligenceBuff && intelligenceBuff.damageMult && spellTargetType === 'wp') {
        multiplier *= intelligenceBuff.damageMult;
        if (logCallback) {
            logCallback(`Mental damage increased by ${(intelligenceBuff.damageMult - 1) * 100}% due to intelligence buff!`);
        }
    }

    return multiplier;
}

function App() {
  const [gameState, setGameState] = useState('START'); 
  const [playerChar, setPlayerChar] = useState(null); 
  const [dictionary, setDictionary] = useState(new Set());
  const [isDictLoading, setIsDictLoading] = useState(true);

  const [playerHp, setPlayerHp] = useState(MAX_PLAYER_HP);
  const [inventory, setInventory] = useState([]);

  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [spellSlots, setSpellSlots] = useState([]);

  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [enemyIndex, setEnemyIndex] = useState(0);
  const [playerStatusEffects, setPlayerStatusEffects] = useState([]);
  const [familiars, setFamiliars] = useState([]); // Array of { id, emoji, spell, turnsLeft, name }
  const [logs, setLogs] = useState([]);
  
  const [shakeError, setShakeError] = useState(false);
  const [animState, setAnimState] = useState({ player: '', enemy: '', familiars: {} });
  const [spellEffect, setSpellEffect] = useState(null);

  let effectiveMaxHp = MAX_PLAYER_HP;

  useEffect(() => {
      const loadDictionary = async () => {
        try {
          const dictSet = new Set(Object.keys(SPELLBOOK));
          setDictionary(dictSet);
          setIsDictLoading(false);
        } catch (err) {
          console.error("Failed", err);
          setIsDictLoading(false);
        }
      };
      loadDictionary();
  }, []);

  const currentWordStr = spellSlots.map(t => t.char).join("");
  const isValidWord = currentWordStr.length > 2 && 
                     (dictionary.has(currentWordStr) || SPELLBOOK[currentWordStr]);

  const startGame = (character) => {
    setPlayerChar(character);
    setDeck(shuffle(STARTING_DECK));
    setLogs(["Entering the archives..."]);
    setInventory(character.starting_items.map(itemId => ARTIFACTS.find(a => a.id === itemId)));
    effectiveMaxHp = MAX_PLAYER_HP + inventory.reduce((s,a)=> s + (a.maxHpBonus || 0), 0);
    setPlayerHp(effectiveMaxHp);
    setPlayerStatusEffects([]);
    setFamiliars([]);
    startEncounter(0);
  };

  const startEncounter = (index) => {
    setEnemyIndex(index);
    if (index >= MAX_STAGE) {
      setGameState('VICTORY');
      return;
    }

    const enemyData = createEnemy(index);
    enemyData.maxHp = enemyData.hp;
    enemyData.maxWp = enemyData.wp;
    enemyData.statusEffects = [];

    setCurrentEnemy(enemyData);
    setGameState('BATTLE');
    drawHand(HAND_SIZE, shuffle(STARTING_DECK), []);
    setSpellSlots([]);
    setFamiliars([]); // Clear familiars for new encounter
    setAnimState({ player: '', enemy: '', familiars: {} });
    addLog(`A wild #${enemyData.name}# appears!`);
  };

  const drawHand = (count, currentDeck, currentHand) => {
    // Fill existing null slots first, then append if needed
    const newHand = currentHand ? [...currentHand] : [];
    let deckCopy = [...currentDeck];
    for (let i = 0; i < count; i++) {
      if (deckCopy.length === 0) {
        addLog("Deck empty. Reshuffling...");
        deckCopy = shuffle(STARTING_DECK);
      }
      const tile = { id: Math.random(), char: deckCopy.pop() };
      const nullIndex = newHand.findIndex(s => !s);
      if (nullIndex >= 0) newHand[nullIndex] = tile;
      else newHand.push(tile);
    }
    setDeck(deckCopy);
    setHand(newHand);
  };

  const handleCast = () => {
    // Apply ongoing effects on player at start of player's turn
    const { totalDamage, newStatusEffects } = processTurnStart(playerStatusEffects, (msg) => addLog(`You: ${msg}`));
    
    if (playerStatusEffects.length > 0) {
        setPlayerStatusEffects(newStatusEffects);
        if (totalDamage > 0) {
            setPlayerHp(prev => {
                const newHp = Math.max(0, prev - totalDamage);
                if (newHp === 0) setGameState('GAMEOVER');
                return newHp;
            });
            addLog(`You take *${totalDamage}* damage from ongoing effects.`);
        }
    }

    if (!isValidWord) {
      addLog(`"${currentWordStr}" fizzles!`);
      setShakeError(true);
      setTimeout(() => setShakeError(false), 400);
      return;
    }

    setAnimState(prev => ({ ...prev, player: 'anim-action' }));
    setTimeout(() => {
      setAnimState(prev => ({ ...prev, player: '' }));

      // Check confusion
      const isConfused = playerStatusEffects.some(e => e.tag === STATUS_EFFECTS.CONFUSION);
      let spellTarget = currentEnemy;
      let isSelfHit = false;

      if (isConfused) {
          if (Math.random() < 0.5) {
              spellTarget = PLAYER_DEFENSE; // Use player defense stats
              isSelfHit = true;
              addLog("You are confused and attack yourself!");
          }
      }

      // 1. CALL THE ENGINE
     const result = resolveSpell(currentWordStr, playerChar, spellTarget, true);

      // Check if Conjurer is summoning a familiar
      if (playerChar.id === 'conjurer') {
          const familiarData = FAMILIARS.find(f => f.name.toUpperCase() === currentWordStr);
          if (familiarData) {
              const newFamiliar = {
                  id: Date.now(),
                  emoji: familiarData.emoji, 
                  spell: familiarData.vocabulary[0], 
                  turnsLeft: 3,
                  name: familiarData.name
              };
              setFamiliars(prev => [...prev, newFamiliar]);
              addLog(`Summoned ${familiarData.name}! ${familiarData.emoji}`);
              setSpellEffect(familiarData.emoji);
              setTimeout(() => setSpellEffect(null), 1000);
          }
      }

      // Artifact: Fairy Wings (+verb damage)
      const fairy = inventory.find(a => a.id === 'fairy_wings');
      if (fairy && result.tags.includes(POS_TAG_MAP.verb)) {
        const bonus = fairy.verbBonusDamage || 0;
        if (bonus > 0) {
          result.damage = (result.damage || 0) + bonus;
          addLog(`(Fairy Wings) Verbs deal +${bonus} damage.`);
        }
      }

      // Apply power/intelligence buffs to outgoing damage
      if (result.damage > 0) {
        const damageMult = getOutgoingDamageMultiplier(playerStatusEffects, (msg) => addLog(`You: ${msg}`), result.targetStat);
        if (damageMult !== 1.0) {
          result.damage = Math.floor(result.damage * damageMult);
        }
      }

      // 2. SHOW VISUALS
      let visualEmoji = result.emoji;
      if (!visualEmoji && result.tags.length > 0) {
         const found = result.tags.find(t => TAG_EMOJIS[t]);
         if (found) visualEmoji = TAG_EMOJIS[found];
      }
      setSpellEffect(visualEmoji || "✨");
      setTimeout(() => setSpellEffect(null), 1000);


      console.log("Spell Result:", result);
      // 3. LOGGING
      addLog(`You cast ^${currentWordStr}^!`);
      if (result.tags.length > 0) {
          // Filter out common ones for cleaner logs
          const meaningfulTags = result.tags.filter(t => !['concrete', 'abstract', 'noun', 'verb', 'adjective', 'adverb'].includes(t));
          if (meaningfulTags.length > 0) {
             addLog(`(Tags: ${meaningfulTags.join(', ')})`);
          }
      }
      addLog(...result.logs);

      // 4. APPLY EFFECTS
      
      // A. HEAL (Self)
      if (result.heal > 0) {
          setPlayerHp(prev => Math.min(effectiveMaxHp, prev + result.heal));
          addLog(`Restored *${result.heal}* HP.`);
      }

      // B. CLEANSE (Self)
      if (result.cleanse) {
          setPlayerStatusEffects(prev => {
              const newEffects = prev.filter(e => {
                  const props = STATUS_PROPERTIES[e.tag];
                  return props && props.type === 'buff';
              });
              
              if (prev.length > newEffects.length) {
                  addLog(`You are purified of all negative effects!`);
              }
              return newEffects;
          });
      }

      // C. DAMAGE (Enemy or Self)
      let nextEnemyState = { ...currentEnemy };

      // Apply any statusEffect that targets the caster (e.g., shield cast on self)
        if (result.statusEffect && result.statusEffect.applyTo === 'caster') {
          // Apply to player
          setPlayerStatusEffects(prev => addStatusEffect(prev, result.statusEffect));
          addLog(`You gain ${result.statusEffect.tag}!`);
      }

      // Attach statusEffects to the target (Enemy or Self)
      if (result.statusEffect && (!result.statusEffect.applyTo || result.statusEffect.applyTo === 'target')) {
          if (isSelfHit) {
              setPlayerStatusEffects(prev => addStatusEffect(prev, result.statusEffect));
              addLog(`You are afflicted with ${result.statusEffect.tag}!`);
          } else {
              nextEnemyState.statusEffects = addStatusEffect(nextEnemyState.statusEffects, result.statusEffect);
              addLog(`#${nextEnemyState.name}# gains ${result.statusEffect.tag}!`);
          }
      }

      // Attach DOTs to target
      if (result.dot) {
          if (isSelfHit) {
              setPlayerStatusEffects(prev => addStatusEffect(prev, result.dot));
              addLog(`You are afflicted with ${result.dot.tag}!`);
          } else {
              nextEnemyState.statusEffects = addStatusEffect(nextEnemyState.statusEffects, result.dot);
              addLog(`#${nextEnemyState.name}# is afflicted with ${result.dot.tag}!`);
          }
      }

      if (result.instantKill) {
          if (isSelfHit) {
              // Player instant kill on self? Unlikely but possible with confusion
              setPlayerHp(0);
              setGameState('GAMEOVER');
              addLog(`You accidentally defeated yourself instantly!`);
          } else {
              nextEnemyState.wp = 0;
              addLog(`#${nextEnemyState.name}# was instantly defeated!`);
          }
      } else if (result.damage > 0) {
          if (isSelfHit) {
              setAnimState(prev => ({ ...prev, player: 'anim-damage' }));
              setTimeout(() => setAnimState(prev => ({ ...prev, player: '' })), 400);
              
              // Check for shield on player
              const { remainingDamage, newStatusEffects } = applyStatusDamageMultipliers(
                  playerStatusEffects, 
                  result.damage, 
                  (msg) => addLog(`You: ${msg}`)
              );
              let damageToApply = remainingDamage;
              if (newStatusEffects !== playerStatusEffects) setPlayerStatusEffects(newStatusEffects);

              if (damageToApply > 0) {
                  setPlayerHp(prev => {
                      const newHp = Math.max(0, prev - damageToApply);
                      if (newHp === 0) setGameState('GAMEOVER');
                      return newHp;
                  });
                  addLog(`You take *${damageToApply}* damage in confusion!`);
              } else {
                  addLog(`You blocked your own attack!`);
              }

          } else {
              setAnimState(prev => ({ ...prev, enemy: 'anim-damage' }));
              setTimeout(() => setAnimState(prev => ({ ...prev, enemy: '' })), 400);

              // Check for shield on enemy
              const { remainingDamage, newStatusEffects } = applyStatusDamageMultipliers(
                  nextEnemyState.statusEffects, 
                  result.damage, 
                  (msg) => addLog(`#${nextEnemyState.name}#: ${msg}`)
              );
              let damageToApply = remainingDamage;
              nextEnemyState.statusEffects = newStatusEffects;

              if (damageToApply > 0) {
                  if (result.targetStat === 'hp') nextEnemyState.hp -= damageToApply;
                  else nextEnemyState.wp -= damageToApply;
                  addLog(`Dealt *${damageToApply}* ${result.targetStat.toUpperCase()} damage!`);

                  // LIFESTEAL: heal caster for the amount of damage actually dealt
                  if (result.tags.includes('lifesteal') && damageToApply > 0) {
                    setPlayerHp(prev => Math.min(effectiveMaxHp, prev + damageToApply));
                    addLog(`You siphon *${damageToApply}* HP!`);
                  }
              } else {
                  addLog(`No damage dealt (blocked).`);
              }
          }
      }

      // D. STUN / CC (Enemy)
      if (result.status === STATUS_EFFECTS.STUN || result.status == STATUS_EFFECTS.FREEZE || result.status == STATUS_EFFECTS.SILENCE || result.status === STATUS_EFFECTS.CONFUSION) {
          const ticks = (result.status === STATUS_EFFECTS.CONFUSION) ? 2 : 1;
          nextEnemyState.statusEffects = addStatusEffect(nextEnemyState.statusEffects, { tag: result.status, ticks: ticks });
          
          if (result.status === STATUS_EFFECTS.FREEZE) addLog(`#${currentEnemy.name}# is frozen!`);
          else if (result.status === STATUS_EFFECTS.SILENCE) addLog(`#${currentEnemy.name}# is silenced!`);
          else if (result.status === STATUS_EFFECTS.CONFUSION) addLog(`#${currentEnemy.name}# is confused!`);
          else addLog(`#${currentEnemy.name}# is stunned!`);
      }

      setCurrentEnemy(nextEnemyState);
      setSpellSlots([]);

      // 5. CHECK DEATH
      if (nextEnemyState.hp <= 0 || nextEnemyState.wp <= 0) {
          setTimeout(() => {
             addLog(`The #${nextEnemyState.name}# is defeated!`);
             setTimeout(() => setGameState('REWARD'), 1000);
          }, 500);
          return;
      }

      // 6. ENEMY TURN
      setTimeout(() => {
          handleEnemyAttack(nextEnemyState);
      }, 1500);

    }, 500);
  };

  const handleEnemyAttack = (enemyEntity) => {
    // Process ongoing statusEffects on enemy at start of its turn
    const { totalDamage, newStatusEffects, skipTurnEffect } = processTurnStart(
        enemyEntity.statusEffects, 
        (msg) => addLog(`#${enemyEntity.name}# ${msg}`)
    );

    console.log("Enemy turn start processing:", { totalDamage, newStatusEffects, skipTurnEffect });

    if (enemyEntity.statusEffects && enemyEntity.statusEffects.length > 0) {
        // Apply updates (always update status effects to reflect tick changes)
         const newHp = enemyEntity.hp - totalDamage;
         setCurrentEnemy(prev => ({ ...prev, statusEffects: newStatusEffects, hp: newHp }));
         
         if (totalDamage > 0) {
             addLog(`#${enemyEntity.name}# takes *${totalDamage}* damage from ongoing effects.`);
             if (newHp <= 0) {
                setTimeout(() => { addLog(`The #${enemyEntity.name}# is defeated!`); setTimeout(() => setGameState('REWARD'), 1000); }, 500);
                return; // enemy died from DOT, skip its action
             }
         }

        if (skipTurnEffect) {
            if (skipTurnEffect === STATUS_EFFECTS.FREEZE) {
                 addLog(`#${enemyEntity.name}# is frozen solid and cannot act!`);
            } else if (skipTurnEffect === STATUS_EFFECTS.SILENCE) {
                 addLog(`#${enemyEntity.name}# is silenced and cannot cast!`);
            } else {
                 addLog(`#${enemyEntity.name}# is stunned and cannot act!`);
            }

            // Refill hand anyway so player can play
            const tilesNeeded = HAND_SIZE - hand.filter(Boolean).length;
            if (tilesNeeded > 0) drawHand(tilesNeeded, deck, hand);
            return;
        }
    }
    setAnimState(prev => ({ ...prev, enemy: 'anim-action' }));

    setTimeout(() => {
        setAnimState(prev => ({ ...prev, enemy: '' }));
        
        const vocab = enemyEntity.vocabulary || ["HIT"];
        const word = vocab[Math.floor(Math.random() * vocab.length)];
        
        // Check confusion
        const isConfused = enemyEntity.statusEffects && enemyEntity.statusEffects.some(e => e.tag === STATUS_EFFECTS.CONFUSION);
        let spellTarget = PLAYER_DEFENSE;
        let isSelfHit = false;

        if (isConfused) {
            if (Math.random() < 0.5) {
                spellTarget = enemyEntity;
                isSelfHit = true;
                addLog(`#${enemyEntity.name}# is confused and attacks itself!`);
            }
        }

        // 1. CALL ENGINE (isPlayerCasting = false)
        const result = resolveSpell(word, enemyEntity, spellTarget, false);

        setSpellEffect(result.emoji || "💥");
        setTimeout(() => setSpellEffect(null), 1000);

        addLog(`#${enemyEntity.name}# casts ^${word}^!`);
        addLog(...result.logs);

        // 2. APPLY EFFECTS TO TARGET (Player or Self)
        
        // Heal (Enemy heals self)
        if (result.heal > 0) {
             setCurrentEnemy(prev => ({
                 ...prev,
                 hp: Math.min(prev.maxHp, prev.hp + result.heal)
             }));
             addLog(`#${enemyEntity.name}# healed *${result.heal}* HP.`);
        }

        // Apply status effects (shield, etc.) returned by the enemy's spell
        if (result.statusEffect) {
          if (result.statusEffect.applyTo === 'caster') {
            // Apply to enemy itself
            setCurrentEnemy(prev => ({ ...prev, statusEffects: addStatusEffect(prev.statusEffects, result.statusEffect) }));
            addLog(`#${enemyEntity.name}# gains ${result.statusEffect.tag}!`);
          } else {
            // Apply to target (Player or Self)
            if (isSelfHit) {
                setCurrentEnemy(prev => ({ ...prev, statusEffects: addStatusEffect(prev.statusEffects, result.statusEffect) }));
                addLog(`#${enemyEntity.name}# is afflicted with ${result.statusEffect.tag}!`);
            } else {
                setPlayerStatusEffects(prev => addStatusEffect(prev, result.statusEffect));
                addLog(`You are afflicted with ${result.statusEffect.tag}!`);
            }
          }
        }

        // Damage (Target)
        if (result.damage > 0) {
            let damageToApply = result.damage;

            // Apply charm reduction on the attacker if present (enemy statusEffects reducing outgoing damage)
            const outgoingMult = getOutgoingDamageMultiplier(enemyEntity.statusEffects, (msg) => addLog(`#${enemyEntity.name}#: ${msg}`), result.targetStat);
            if (outgoingMult !== 1.0) {
                damageToApply = Math.max(0, Math.floor(damageToApply * outgoingMult));
            }

            if (isSelfHit) {
                // Enemy hits self
                setAnimState(prev => ({ ...prev, enemy: 'anim-damage' }));
                setTimeout(() => setAnimState(prev => ({ ...prev, enemy: '' })), 400);

                // Check for shield on enemy
                const { remainingDamage, newStatusEffects } = applyStatusDamageMultipliers(
                    enemyEntity.statusEffects, 
                    damageToApply, 
                    (msg) => addLog(`#${enemyEntity.name}#: ${msg}`)
                );
                damageToApply = remainingDamage;
                
                if (damageToApply > 0) {
                    setCurrentEnemy(prev => ({ 
                        ...prev, 
                        hp: Math.max(0, prev.hp - damageToApply),
                        statusEffects: newStatusEffects // Update shield consumption
                    }));
                    addLog(`#${enemyEntity.name}# takes *${damageToApply}* damage in confusion!`);
                } else {
                    addLog(`#${enemyEntity.name}# blocked its own attack!`);
                    setCurrentEnemy(prev => ({ ...prev, statusEffects: newStatusEffects }));
                }

            } else {
                // Enemy hits Player
                // Artifact passive block (e.g., helmet)
                const artifactBlock = inventory.reduce((s,a) => s + (a.incomingDamageBlock || 0), 0);
                if (artifactBlock > 0) {
                    const reduced = Math.min(artifactBlock, damageToApply);
                    damageToApply -= reduced;
                    if (reduced > 0) addLog(`Your artifacts block *${reduced}* damage!`);
                }

                // Check for shield on player
                const { remainingDamage, newStatusEffects } = applyStatusDamageMultipliers(
                    playerStatusEffects, 
                    damageToApply, 
                    (msg) => addLog(`You: ${msg}`)
                );
                damageToApply = remainingDamage;
                
                // Only update if effects changed (shield consumed)
                if (newStatusEffects !== playerStatusEffects) {
                     setPlayerStatusEffects(newStatusEffects);
                }

                if (damageToApply > 0) {
                    setAnimState(prev => ({ ...prev, player: 'anim-damage' }));
                    setTimeout(() => setAnimState(prev => ({ ...prev, player: '' })), 400);

                    setPlayerHp(prev => {
                        const newHp = Math.max(0, prev - damageToApply);
                        if (newHp === 0) setGameState('GAMEOVER');
                        return newHp;
                    });
                    addLog(`You take *${damageToApply}* damage!`);

                    // LIFESTEAL: enemy heals for damage dealt
                    if (result.tags.includes('lifesteal') && damageToApply > 0) {
                      setCurrentEnemy(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + damageToApply) }));
                      addLog(`#${enemyEntity.name}# siphons *${damageToApply}* HP!`);
                    }
                } else {
                    addLog('The attack was fully blocked!');
                }
            }
        }
        
        // Stun (Player)
        if (result.status === STATUS_EFFECTS.STUN) {
            addLog("You are stunned! (Logic not implemented yet for player skip)");
        }
        // Freeze (Player)
        if (result.status === STATUS_EFFECTS.FREEZE) {
            addLog("You are frozen! (Logic not implemented yet for player skip)");
        }
        // Silence (Player)
        if (result.status === STATUS_EFFECTS.SILENCE) {
            addLog("You are silenced! (Logic not implemented yet for player skip)");
        }
        // Confusion (Player)
        if (result.status === STATUS_EFFECTS.CONFUSION) {
            setPlayerStatusEffects(prev => addStatusEffect(prev, { tag: STATUS_EFFECTS.CONFUSION, ticks: 2 }));
            addLog("You are confused!");
        }

        // Ongoing DOT (to player)
        if (result.dot) {
          setPlayerStatusEffects(prev => addStatusEffect(prev, result.dot));
          addLog(`You are afflicted with ${result.dot.tag}!`);
        }

        // 3. FAMILIAR ATTACKS (if any summoned)
        if (familiars.length > 0) {
            familiars.forEach((familiar, index) => {
                setTimeout(() => {
                    setAnimState(prev => ({ ...prev, familiars: { ...prev.familiars, [familiar.id]: 'anim-action' } }));
                    setTimeout(() => setAnimState(prev => ({ ...prev, familiars: { ...prev.familiars, [familiar.id]: '' } })), 400);
                    
                    addLog(`${familiar.emoji} ${familiar.name} attacks with ${familiar.spell}!`);
                    const familiarResult = resolveSpell(familiar.spell, playerChar, currentEnemy, true);
                    
                    // Apply familiar damage
                    if (familiarResult.damage > 0) {
                        const { remainingDamage, newStatusEffects } = applyStatusDamageMultipliers(
                            currentEnemy.statusEffects,
                            familiarResult.damage,
                            (msg) => addLog(`#${currentEnemy.name}#: ${msg}`)
                        );
                        
                        if (remainingDamage > 0) {
                            setCurrentEnemy(prev => {
                                const newEnemy = { ...prev, statusEffects: newStatusEffects };
                                if (familiarResult.targetStat === 'hp') {
                                    newEnemy.hp = Math.max(0, newEnemy.hp - remainingDamage);
                                } else {
                                    newEnemy.wp = Math.max(0, newEnemy.wp - remainingDamage);
                                }
                                return newEnemy;
                            });
                            addLog(`Familiar dealt *${remainingDamage}* ${familiarResult.targetStat.toUpperCase()} damage!`);
                        }
                    }
                }, 1000 + (index * 500));
            });
            
            // Decrement all familiar turns after all attacks
            setTimeout(() => {
                setFamiliars(prev => {
                    const updated = prev.map(f => ({
                        ...f,
                        turnsLeft: f.turnsLeft - 1
                    })).filter(f => {
                        if (f.turnsLeft <= 0) {
                            addLog(`${f.emoji} ${f.name} vanishes...`);
                            return false;
                        }
                        return true;
                    });
                    return updated;
                });
            }, 1000 + (familiars.length * 500));
        }

        // 4. REFILL HAND
        const tilesNeeded = HAND_SIZE - hand.filter(Boolean).length;
        if (tilesNeeded > 0) drawHand(tilesNeeded, deck, hand);

    }, 500);
  };

  const handleMoveTile = (tile) => {
    setHand(prev => prev.map(h => (h && h.id === tile.id) ? null : h));
    setSpellSlots(prev => [...prev, tile]);
  };
  const handleReturnTile = (tile) => {
    setSpellSlots(prev => prev.filter(t => t.id !== tile.id));
    setHand(prev => {
      const res = [...prev];
      const idx = res.findIndex(s => !s);
      if (idx >= 0) res[idx] = tile;
      else res.push(tile);
      return res;
    });
  };
  const handleClear = () => {
    setHand(prev => {
      const res = [...prev];
      spellSlots.forEach(tile => {
        const idx = res.findIndex(s => !s);
        if (idx >= 0) res[idx] = tile;
        else res.push(tile);
      });
      return res;
    });
    setSpellSlots([]);
  };
  const handleShuffle = () => {
    setHand(prev => {
      const slots = [...prev];
      const tiles = slots.filter(Boolean);
      const shuffled = shuffle(tiles);
      return slots.map(s => s ? shuffled.shift() : null);
    });
    setHand(prev => shuffle([...prev]));
  };
  const handleDiscard = () => {
    setSpellSlots([]);
    drawHand(HAND_SIZE, deck, []);
    addLog("Mulligan! You waste a turn.");
    handleEnemyAttack(currentEnemy);
  };
  const addLog = (...messages) => setLogs(prev => [...prev, ...messages]);

  // ... render ...
  if (gameState === 'START') {
     return <StartScreen onStart={startGame} isLoading={isDictLoading} />;
  }
  
  if (gameState === 'GAMEOVER') {
    return (
        <div className="reward-screen">
            <h1>DEFEAT</h1>
            <p>Your journey ends here.</p>
            <button className="cast-btn" onClick={() => setGameState('START')}>Try Again</button>
        </div>
    );
  }

  if (gameState === 'REWARD') {
    return (
      <RewardScreen 
        enemy={currentEnemy} 
        onNext={() => {
          setEnemyIndex(prev => prev + 1);
          startEncounter(enemyIndex + 1);
        }} 
      />
    );
  }

  if (gameState === 'VICTORY') {
    return (
      <div className="reward-screen">
        <h1>LEGENDARY!</h1>
        <p>You have cleared the archives.</p>
        <button className="cast-btn" onClick={() => setGameState('START')}>New Run</button>
      </div>
    );
  }

  return (
    <BattleScreen 
      playerAvatar={playerChar?.avatar || "🧙‍♂️"} 
      playerHp={playerHp}       
      maxPlayerHp={effectiveMaxHp} 
      inventory={inventory}     
      playerStatusEffects={playerStatusEffects}
      revealWeaknesses={inventory.some(a => a.revealWeaknesses)}
      encounterIndex={enemyIndex}
      totalEncounters={MAX_STAGE}
      enemy={currentEnemy}
      familiars={familiars}
      logs={logs}
      hand={hand}
      spellSlots={spellSlots}
      isValidWord={!!isValidWord}
      shakeError={shakeError} 
      animState={animState}
      spellEffect={spellEffect}
      actions={{
        onMoveTile: handleMoveTile,
        onReturnTile: handleReturnTile,
        onCast: handleCast,
        onClear: handleClear,
        onDiscard: handleDiscard,
        onShuffle: handleShuffle
      }}
    />
  );
}

export default App