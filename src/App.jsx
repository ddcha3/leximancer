
import { useState, useEffect, useRef } from 'react'
import './App.css'
import { useSound } from './contexts/SoundContext';

import { createEnemy, MAX_STAGE } from './data/enemies';
import { SPELLBOOK, loadSpellbook } from './data/spells';
import { TAG_EMOJIS, TAG_SOUNDS } from './data/tags';
import { ARTIFACTS } from './data/artifacts';
import { FAMILIARS } from './data/familiars';
import { PLAYER_DEFENSE, STARTING_DECK } from './data/player';

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

const HAND_SIZE = 18;
const MAX_PLAYER_HP = 100;

const mulberry32 = (a) => {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
};

const seedFromString = (str) => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const makeSeededRng = (seedStr) => mulberry32(seedFromString(seedStr));

const getEasternDateString = () => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(new Date());
};

const shuffle = (array, randFn = Math.random) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(randFn() * (i + 1));
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
            logCallback(`HP damage increased by ${(powerBuff.damageMult - 1) * 100}% due to power buff!`);
        }
    }

    // Intelligence buff: increases damage for wp-targeting spells
    const intelligenceBuff = currentEffects.find(s => s.tag === STATUS_EFFECTS.INTELLIGENCE_BUFF);
    if (intelligenceBuff && intelligenceBuff.damageMult && spellTargetType === 'wp') {
        multiplier *= intelligenceBuff.damageMult;
        if (logCallback) {
            logCallback(`WP damage increased by ${(intelligenceBuff.damageMult - 1) * 100}% due to intelligence buff!`);
        }
    }

    return multiplier;
}

function App() {
  const { playMusic, playSound } = useSound();
  const [gameState, setGameState] = useState('START'); 

  useEffect(() => {
    if (gameState === 'BATTLE') {
      const battleTracks = ['music/battle1', 'music/battle2', 'music/battle3'];
      const track = battleTracks[enemyIndex % battleTracks.length];
      playMusic(track, { volume: 0.1 });
    } else {
      playMusic('music/menu', { volume: 0.1 });
    }
  }, [gameState, playMusic]);

  const [playerChar, setPlayerChar] = useState(null); 
  const [dictionary, setDictionary] = useState(new Set());
  const [isDictLoading, setIsDictLoading] = useState(true);

  const [playerHp, setPlayerHp] = useState(MAX_PLAYER_HP);
  const [inventory, setInventory] = useState([]);

  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [spellSlots, setSpellSlots] = useState([]);
  const [resolvedSpell, setResolvedSpell] = useState(null);
  const [dailyMode, setDailyMode] = useState(false);
  const [dailySeed, setDailySeed] = useState(null);
  const [runHistory, setRunHistory] = useState([]); // { stage, name }

  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [enemyIndex, setEnemyIndex] = useState(0);
  const [playerStatusEffects, setPlayerStatusEffects] = useState([]);
  const [familiars, setFamiliars] = useState([]); // Array of { id, emoji, spell, turnsLeft, name }
  const [logs, setLogs] = useState([]);
  
  const [shakeError, setShakeError] = useState(false);
  const [animState, setAnimState] = useState({ player: '', enemy: '', familiars: {} });
  const [spellEffect, setSpellEffect] = useState(null);
  
  const isProcessingDeath = useRef(false);
  const rngRef = useRef(() => Math.random());

  let effectiveMaxHp = MAX_PLAYER_HP;

  useEffect(() => {
      const loadDictionary = async () => {
        try {
          await loadSpellbook();
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

  // Check for enemy death (from any source: player, familiar, DOTs)
  useEffect(() => {
    // If either HP or WP is zero or below, enemy is defeated
    if (gameState === 'BATTLE' && currentEnemy && (currentEnemy.hp <= 0 || currentEnemy.wp <= 0)) {
        if (isProcessingDeath.current) return;
        isProcessingDeath.current = true;
        
        setTimeout(() => {
             addLog(`The #${currentEnemy.name}# is defeated!`);
             setTimeout(() => setGameState('REWARD'), 1000);
        }, 500);
    }

    // If both HP and WP are below 25%, enemy surrenders
    if (gameState === 'BATTLE' && currentEnemy && (currentEnemy.hp <= currentEnemy.maxHp * 0.25 && currentEnemy.wp <= currentEnemy.maxWp * 0.25)) {
        if (isProcessingDeath.current) return;
        isProcessingDeath.current = true;
        
        setTimeout(() => {
             addLog(`The #${currentEnemy.name}# surrenders!`);
             setTimeout(() => setGameState('REWARD'), 1000);
        }, 500);
    }
  }, [currentEnemy, gameState]);

  const currentWordStr = spellSlots.map(t => t.char).join("");
  const isValidWord = currentWordStr.length > 2 && 
                     (dictionary.has(currentWordStr) || SPELLBOOK[currentWordStr]);

  // Resolve spell preview whenever spell slots change
  useEffect(() => {
    if (spellSlots.length === 0) {
      setResolvedSpell(null);
      return;
    }

    if (!currentEnemy || !playerChar) {
      setResolvedSpell(null);
      return;
    }

    const word = currentWordStr;
    if (word.length === 0) {
      setResolvedSpell(null);
      return;
    }

    // Always preview against the enemy (confusion is resolved during actual cast)
    const spellTarget = currentEnemy;
    const isConfused = playerStatusEffects.some(e => e.tag === STATUS_EFFECTS.CONFUSION);

    // Resolve the spell (don't play sound during preview)
    let result = resolveSpell(word, playerChar, spellTarget, true, null);

    // Apply fairy wings bonus if applicable
    const fairy = inventory.find(a => a.id === 'fairy_wings');
    if (fairy && result.tags.includes(POS_TAG_MAP.verb)) {
      const bonus = fairy.verbBonusDamage || 0;
      if (bonus > 0) {
        result = { ...result, damage: (result.damage || 0) + bonus };
      }
    }

    // Apply power/intelligence buffs to damage preview
    if (result.damage > 0) {
      const damageMult = getOutgoingDamageMultiplier(playerStatusEffects, null, result.targetStat);
      if (damageMult !== 1.0) {
        result = { ...result, damage: Math.floor(result.damage * damageMult) };
      }
    }

    setResolvedSpell({ ...result, isConfused, isValid: isValidWord });
  }, [spellSlots, currentEnemy, playerChar, playerStatusEffects, inventory, currentWordStr, isValidWord]);

  const startGame = (character, { isDaily = false, seed = null } = {}) => {
    const chosenSeed = seed || getEasternDateString();
    rngRef.current = isDaily ? makeSeededRng(chosenSeed) : () => Math.random();

    setDailyMode(isDaily);
    setDailySeed(isDaily ? chosenSeed : null);
    setRunHistory([]);

    setPlayerChar(character);
    const initialDeck = shuffle(STARTING_DECK, rngRef.current);
    setDeck(initialDeck);
    setLogs([isDaily ? `Daily run ${chosenSeed}` : "Entering the archives..."]);
    setInventory(character.starting_items.map(itemId => ARTIFACTS.find(a => a.id === itemId)));
    effectiveMaxHp = MAX_PLAYER_HP + inventory.reduce((s,a)=> s + (a.maxHpBonus || 0), 0);
    setPlayerHp(effectiveMaxHp);
    setPlayerStatusEffects([]);
    setFamiliars([]);
    startEncounter(0, initialDeck);
  };

  const startDailyGame = (character) => startGame(character, { isDaily: true, seed: getEasternDateString() });

  const startEncounter = (index, startingDeck = null) => {
    isProcessingDeath.current = false;
    setEnemyIndex(index);
    if (index >= MAX_STAGE) {
      setGameState('VICTORY');
      return;
    }

    const enemyData = createEnemy(index, rngRef.current);
    enemyData.maxHp = enemyData.hp;
    enemyData.maxWp = enemyData.wp;
    enemyData.statusEffects = [];

    setRunHistory(prev => [...prev, { 
      stage: index + 1, 
      name: enemyData.name, 
      emoji: enemyData.emoji,
      affixEmoji: enemyData.affixEmoji 
    }]);

    setCurrentEnemy(enemyData);
    setGameState('BATTLE');
    const deckSource = startingDeck || shuffle(STARTING_DECK, rngRef.current);
    drawHand(HAND_SIZE, deckSource, []);
    setSpellSlots([]);
    setFamiliars([]);
    setPlayerStatusEffects([]);
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
        deckCopy = shuffle(STARTING_DECK, rngRef.current);
      }
      const tile = { id: rngRef.current(), char: deckCopy.pop() };
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
      playSound('abilities/summon')
      addLog(`"${currentWordStr}" fizzles!`);
      setShakeError(true);
      setTimeout(() => setShakeError(false), 400);
      return;
    }

    playSound('misc/wave');
    setAnimState(prev => ({ ...prev, player: 'anim-action' }));
    setTimeout(() => {
      setAnimState(prev => ({ ...prev, player: '' }));

      // Use the pre-resolved spell data
      if (!resolvedSpell) {
        addLog(`Something went wrong!`);
        return;
      }

      // Check confusion for actual targeting during cast
      const isConfused = playerStatusEffects.some(e => e.tag === STATUS_EFFECTS.CONFUSION);
      let isSelfHit = false;

      if (isConfused) {
          if (rngRef.current() < 0.5) {
              isSelfHit = true;
              addLog("You are confused and attack yourself!");
          }
      }

      // Use the already resolved spell data
      const result = { ...resolvedSpell };
      
      // Play sound effect based on tags
      const soundTag = result.tags.find(t => TAG_SOUNDS[t]);
      if (soundTag) {
        playSound(TAG_SOUNDS[soundTag], { volume: 0.7 });
      } else {
        playSound('abilities/woosh_b', { volume: 0.5 });
      }

      // Check if Conjurer is summoning a familiar
      let updatedFamiliars = [...familiars];
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
              updatedFamiliars.push(newFamiliar);
              setFamiliars(prev => [...prev, newFamiliar]);
              addLog(`Summoned #${familiarData.name}#`);
              setSpellEffect(familiarData.emoji);
              setTimeout(() => setSpellEffect(null), 1000);
          }
      }

      // Show visual effects
      let visualEmoji = result.emoji;
      if (!visualEmoji && result.tags.length > 0) {
         const found = result.tags.find(t => TAG_EMOJIS[t]);
         if (found) visualEmoji = TAG_EMOJIS[found];
      }
      setSpellEffect(visualEmoji || "✨");
      setTimeout(() => setSpellEffect(null), 1000);

      console.log("Spell Result:", result);
      
      // Logging
      addLog(`You cast ^${currentWordStr}^!`);
      if (result.tags.length > 0) {
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
          // Handled by useEffect
          return;
      }

      // 6. ENEMY TURN
      setTimeout(() => {
          handleEnemyAttack(nextEnemyState, updatedFamiliars);
      }, 1500);

    }, 500);
  };

  const handleEnemyAttack = (enemyEntity, currentFamiliars) => {
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
                // Handled by useEffect
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
        const word = vocab[Math.floor(rngRef.current() * vocab.length)];
        
        // Check confusion
        const isConfused = enemyEntity.statusEffects && enemyEntity.statusEffects.some(e => e.tag === STATUS_EFFECTS.CONFUSION);
        let spellTarget = PLAYER_DEFENSE;
        let isSelfHit = false;

        if (isConfused) {
          if (rngRef.current() < 0.5) {
                spellTarget = enemyEntity;
                isSelfHit = true;
                addLog(`#${enemyEntity.name}# is confused and attacks itself!`);
            }
        }

        // 1. CALL ENGINE (isPlayerCasting = false)
        const result = resolveSpell(word, enemyEntity, spellTarget, false, playSound);

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
        const activeFamiliars = currentFamiliars || familiars;
        if (activeFamiliars.length > 0) {
            activeFamiliars.forEach((familiar, index) => {
                setTimeout(() => {
                    setAnimState(prev => {
                        const newFamiliars = Object.assign({}, prev.familiars);
                        newFamiliars[familiar.id] = 'anim-action';
                        return { ...prev, familiars: newFamiliars };
                    });
                    setTimeout(() => {
                        setAnimState(prev => {
                            const newFamiliars = Object.assign({}, prev.familiars);
                            newFamiliars[familiar.id] = '';
                            return { ...prev, familiars: newFamiliars };
                        });
                    }, 400);
                    
                    addLog(`#${familiar.name}# casts ^${familiar.spell}^!`);
                    const familiarResult = resolveSpell(familiar.spell, playerChar, currentEnemy, true, playSound);
                    
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
                            addLog(`${f.name} vanishes...`);
                            return false;
                        }
                        return true;
                    });
                    return updated;
                });
            }, 1000 + (activeFamiliars.length * 500));
        }

        // 4. REFILL HAND
        const tilesNeeded = HAND_SIZE - hand.filter(Boolean).length;
        if (tilesNeeded > 0) drawHand(tilesNeeded, deck, hand);

    }, 500);
  };

  const handleMoveTile = (tile, insertIndex = undefined) => {
    setHand(prev => prev.map(h => (h && h.id === tile.id) ? null : h));
    setSpellSlots(prev => {
        if (insertIndex !== undefined && insertIndex >= 0) {
            const newSlots = [...prev];
            const clampedIndex = Math.min(insertIndex, newSlots.length);
            newSlots.splice(clampedIndex, 0, tile);
            return newSlots;
        }
        return [...prev, tile];
    });
    playSound('interface/click');
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
    playSound('interface/paper');
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
    playSound('interface/paper');
  };
  const handleShuffle = () => {
    setHand(prev => {
      const slots = [...prev];
      const tiles = slots.filter(Boolean);
      const shuffled = shuffle(tiles, rngRef.current);
      return slots.map(s => s ? shuffled.shift() : null);
    });
    setHand(prev => shuffle([...prev], rngRef.current));

    // Play the paper sound three times
    playSound('interface/paper', { volume: 0.8 });
    setTimeout(() => playSound('interface/paper', { volume: 0.8 }), 100);
    setTimeout(() => playSound('interface/paper', { volume: 0.8 }), 200);
  };
  const handleSort = () => {
    setHand(prev => {
      const slots = [...prev];
      const tiles = slots.filter(Boolean).sort((a, b) => a.char.localeCompare(b.char));
      return slots.map(s => s ? tiles.shift() : null);
    });
    playSound('interface/paper', { volume: 0.8 });
  };
  const handleDiscard = () => {
    setSpellSlots([]);
    drawHand(HAND_SIZE, deck, []);
    addLog("Mulligan! You waste a turn.");
    handleEnemyAttack(currentEnemy);

    // Play the paper sound 7 times
    playSound('interface/paper', { volume: 0.8 });
    setTimeout(() => playSound('interface/paper', { volume: 0.8 }), 100);
    setTimeout(() => playSound('interface/paper', { volume: 0.8 }), 200);
    setTimeout(() => playSound('interface/paper', { volume: 0.8 }), 300);
    setTimeout(() => playSound('interface/paper', { volume: 0.8 }), 400);
    setTimeout(() => playSound('interface/paper', { volume: 0.8 }), 500);
    setTimeout(() => playSound('interface/paper', { volume: 0.8 }), 600);
    setTimeout(() => playSound('interface/paper', { volume: 0.8 }), 700);
  };
  const copyRunSummary = (outcomeLabel) => {
    const playerEmoji = playerChar?.avatar || '🧙‍♂️';
    const isVictory = outcomeLabel === 'Victory';
    const outcomeEmoji = isVictory ? '🏆' : '💀';
    const enemiesText = runHistory.map((r, idx) => {
      const isLastEnemy = idx === runHistory.length - 1;
      const statusEmoji = (isLastEnemy && !isVictory) ? '❌' : '✅';
      return `${r.emoji} ${statusEmoji}`;
    }).join('\n');
    const header = dailyMode ? `📅 LEXIMANCER\n${dailySeed}` : 'LEXIMANCER';
    const body = `${header}\n${playerEmoji} ${outcomeEmoji}\n${enemiesText || 'None'}\nhttps://vsporeddy.github.io/leximancer/`;
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(body).then(() => addLog('Run summary copied to clipboard.'));
    }
  };
  const addLog = (...messages) => setLogs(prev => [...prev, ...messages]);

  // ... render ...
  if (gameState === 'START') {
      return <StartScreen onStart={startGame} onStartDaily={startDailyGame} isLoading={isDictLoading} />;
  }
  
  if (gameState === 'GAMEOVER') {
    return (
        <div className="reward-screen">
            <h1>DEFEAT</h1>
            <p>Your journey ends here.</p>
        {dailyMode && (
          <button 
            className="cast-btn" 
            style={{marginRight: '10px', fontSize: '1.2rem', fontFamily: 'FFFFORWA'}}
            onClick={() => copyRunSummary('Defeat')}>SHARE</button>
        )}
            <button 
                className="cast-btn" 
                style={{fontSize: '1.2rem', fontFamily: 'FFFFORWA', background: 'var(--accent-red)'}}
                onClick={() => setGameState('START')}>TRY AGAIN</button>
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
        {dailyMode && (
          <button 
            className="cast-btn" 
            style={{marginRight: '10px', fontSize: '1.2rem', fontFamily: 'FFFFORWA'}}
            onClick={() => copyRunSummary('Victory')}>SHARE</button>
        )}
        <button 
            className="cast-btn" 
            style={{fontSize: '1.2rem', fontFamily: 'FFFFORWA', background: 'var(--accent-red)'}}
            onClick={() => setGameState('START')}>NEW RUN</button>
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
      resolvedSpell={resolvedSpell}
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
        onShuffle: handleShuffle,
        onSort: handleSort,
        setSpellSlots: setSpellSlots
      }}
    />
  );
}

export default App