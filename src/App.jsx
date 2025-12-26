
import { useState, useEffect } from 'react'
import './App.css'

import { ENCOUNTERS } from './data/enemies';
import { SPELLBOOK } from './data/spells';
import { TAG_EMOJIS } from './data/tags';
import { ARTIFACTS } from './data/artifacts';
import { CHARACTERS, PLAYER_DEFENSE, STARTING_DECK } from './data/player';

import { resolveSpell } from './engine/CombatEngine'

import StartScreen from './screens/StartScreen'
import BattleScreen from './screens/BattleScreen'
import RewardScreen from './screens/RewardScreen'

const POS_TAG_MAP = {
    noun: 'noun',
    verb: 'verb',
    adjective: 'adjective',
    adverb: 'adverb',
};

const HAND_SIZE = 16;
const MAX_PLAYER_HP = 100;

const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

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
  
  // Effective maxHP includes artifact bonuses
  const effectiveMaxHp = MAX_PLAYER_HP + inventory.reduce((s,a)=> s + (a.maxHpBonus || 0), 0);

  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [enemyIndex, setEnemyIndex] = useState(0);
  const [playerDots, setPlayerDots] = useState([]); // Ongoing effects on player (poison/bleed)
  const [logs, setLogs] = useState([]);
  
  const [shakeError, setShakeError] = useState(false);
  const [animState, setAnimState] = useState({ player: '', enemy: '' });
  const [spellEffect, setSpellEffect] = useState(null);

  useEffect(() => {
      const loadDictionary = async () => {
        try {
          const response = await fetch('https://raw.githubusercontent.com/redbo/scrabble/master/dictionary.txt');
          const text = await response.text();
          const words = text.split('\n').map(w => w.trim().toUpperCase());
          const dictSet = new Set(words);
          Object.keys(SPELLBOOK).forEach(w => dictSet.add(w));
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
    setEnemyIndex(0);
    setLogs(["The Leximancer enters the archives..."]);

    const starter = character && character.id === 'seer' ? ARTIFACTS.find(a => a.id === 'crystal_ball') : null;
    setInventory(starter ? [starter] : []);

    // Set player HP to reflect starting artifacts (tomato gives max HP bonus)
    // const startMax = MAX_PLAYER_HP + (starter && starter.maxHpBonus ? starter.maxHpBonus : 0);
    // setPlayerHp(startMax);

    startEncounter(0);
  };

  const startEncounter = (index) => {
    if (index >= ENCOUNTERS.length) {
      setGameState('VICTORY');
      return;
    }
    // ENCOUNTERS can be an array of candidate enemies per stage. Pick one randomly if so.
    let candidate = ENCOUNTERS[index];
    if (Array.isArray(candidate)) {
      candidate = candidate[Math.floor(Math.random() * candidate.length)];
    }
    const enemyData = JSON.parse(JSON.stringify(candidate));
    enemyData.maxHp = enemyData.hp;
    enemyData.maxWp = enemyData.wp;
    enemyData.isStunned = false; // Initialize stun state
    enemyData.statusEffects = []; // Ongoing status effects (poison, bleed, stun, etc)

    setCurrentEnemy(enemyData);
    setGameState('BATTLE');
    drawHand(HAND_SIZE, shuffle(STARTING_DECK), []);
    setSpellSlots([]);
    setAnimState({ player: '', enemy: '' });
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
    // addLog("Current deck: " + deckCopy);
    setHand(newHand);
  };

  const handleCast = () => {
    // Apply ongoing effects on player at start of player's turn
    if (playerDots.length > 0) {
      let totalDamage = 0;
      let remaining = [];
      playerDots.forEach(effect => {
        // Only apply per-turn damage for effects that deal damage
        if (effect.damagePerTick) {
          const dmg = effect.damagePerTick;
          totalDamage += dmg;
          addLog(`You suffer *${dmg}* ${effect.tag} damage (ongoing).`);
        }
        if (effect.ticks > 1) remaining.push({...effect, ticks: effect.ticks - 1});
      });
      setPlayerDots(remaining);
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

      // 1. CALL THE ENGINE
     const result = resolveSpell(currentWordStr, playerChar, currentEnemy, true);

      // Artifact: Fairy Wings (+verb damage)
      const fairy = inventory.find(a => a.id === 'fairy_wings');
      if (fairy && result.tags.includes(POS_TAG_MAP.verb)) {
        const bonus = fairy.verbBonusDamage || 0;
        if (bonus > 0) {
          result.damage = (result.damage || 0) + bonus;
          addLog(`(Fairy Wings) Verbs deal +${bonus} damage.`);
        }
      }

      // 2. SHOW VISUALS
      // Use Engine emoji or fallback to Tag lookup
      let visualEmoji = result.emoji;
      if (!visualEmoji && result.tags.length > 0) {
         const found = result.tags.find(t => TAG_EMOJIS[t]);
         if (found) visualEmoji = TAG_EMOJIS[found];
      }
      setSpellEffect(visualEmoji || "✨");
      setTimeout(() => setSpellEffect(null), 1000);


      console.log("Spell Result:", result);
      // 3. LOGGING
      if (result.tags.includes(POS_TAG_MAP.noun)) {
          addLog(`You conjured ^${currentWordStr}^!`);
      } else {
        addLog(`You cast ^${currentWordStr}^!`);
      }
      if (result.tags.length > 0) {
          const meaningfulTags = result.tags.filter(t => !['the', 'a', 'an', 'noun', 'verb', 'adjective', 'adverb'].includes(t)); // Filter out common ones for cleaner logs
          if (meaningfulTags.length > 0) {
             addLog(`(Tags: ${meaningfulTags.join(', ')})`);
          }
      }
      addLog(...result.logs);

      // 4. APPLY EFFECTS
      
      // A. FLEE
      if (result.status === 'flee') {
         addLog(`You fled from the #${currentEnemy.name}#!`);
         setTimeout(() => {
             // Skip to next encounter immediately (No reward)
             setEnemyIndex(prev => prev + 1);
             startEncounter(enemyIndex + 1);
         }, 1500);
         return; // Stop here
      }

      // B. HEAL (Self)
      if (result.heal > 0) {
          setPlayerHp(prev => Math.min(effectiveMaxHp, prev + result.heal));
          addLog(`Restored *${result.heal}* HP.`);
      }

      // C. DAMAGE (Enemy)
      let nextEnemyState = { ...currentEnemy };

      // Apply any statusEffect that targets the caster (e.g., shield cast on self)
      if (result.statusEffect && result.statusEffect.applyTo === 'caster') {
          // Apply to player
          setPlayerDots(prev => ([...prev, {...result.statusEffect}]));
          addLog(`You gain ${result.statusEffect.tag}!`);
      }

      // Attach statusEffects to the enemy if effect intends target
      if (result.statusEffect && (!result.statusEffect.applyTo || result.statusEffect.applyTo === 'target')) {
          nextEnemyState.statusEffects = nextEnemyState.statusEffects || [];
          nextEnemyState.statusEffects.push({...result.statusEffect});
          addLog(`#${nextEnemyState.name}# gains ${result.statusEffect.tag}!`);
      }

      // Attach DOTs to enemy
      if (result.dot) {
          nextEnemyState.statusEffects = nextEnemyState.statusEffects || [];
          nextEnemyState.statusEffects.push({...result.dot});
          addLog(`#${nextEnemyState.name}# is afflicted with ${result.dot.tag}!`);
      }

      if (result.damage > 0) {
          setAnimState(prev => ({ ...prev, enemy: 'anim-damage' }));
          setTimeout(() => setAnimState(prev => ({ ...prev, enemy: '' })), 400);

          // Check for shield on enemy
          let damageToApply = result.damage;
          const shieldIndex = nextEnemyState.statusEffects ? nextEnemyState.statusEffects.findIndex(s => s.tag === 'shield') : -1;
          if (shieldIndex >= 0) {
              const shield = nextEnemyState.statusEffects[shieldIndex];
              const block = shield.block || 2;
              const consumed = Math.min(block, damageToApply);
              damageToApply -= consumed;
              addLog(`#${nextEnemyState.name}#'s shield blocks *${consumed}* damage!`);
              // remove shield effect
              nextEnemyState.statusEffects.splice(shieldIndex, 1);
          }

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

      // D. STUN (Enemy)
      if (result.status === 'stun' || result.status == 'freeze' || result.status == 'silence') {
          nextEnemyState.statusEffects = nextEnemyState.statusEffects || [];
          nextEnemyState.statusEffects.push({ tag: 'stun', ticks: 1 });
          nextEnemyState.isStunned = true;
          addLog(`#${currentEnemy.name}# is stunned!`);
      }

      // Keep isStunned derived for compatibility
      nextEnemyState.isStunned = !!(nextEnemyState.statusEffects && nextEnemyState.statusEffects.find(s => s.tag === 'stun'));

      setCurrentEnemy(nextEnemyState);
      setSpellSlots([]);

      // 5. CHECK DEATH
      if (nextEnemyState.hp <= 0 || nextEnemyState.wp <= 0) {
          setTimeout(() => {
             addLog(`The #${nextEnemyState.name}# is vanquished!`);
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
    if (enemyEntity.statusEffects && enemyEntity.statusEffects.length > 0) {
      let total = 0;
      let newStatus = [];
      let stunnedThisTurn = false;

      enemyEntity.statusEffects.forEach(effect => {
         if (effect.tag === 'bleed' || effect.tag === 'poison') {
           const dmg = effect.damagePerTick || 0;
           total += dmg;
           addLog(`#${enemyEntity.name}# takes *${dmg}* ${effect.tag} damage (ongoing).`);
         }
         if (effect.tag === 'stun') {
           stunnedThisTurn = true;
         }

         if (effect.ticks > 1) newStatus.push({...effect, ticks: effect.ticks - 1});
      });

      // Apply accumulated damage from effects
      if (total > 0) {
         const newHp = enemyEntity.hp - total;
         setCurrentEnemy(prev => ({ ...prev, statusEffects: newStatus, hp: newHp }));
         addLog(`#${enemyEntity.name}# takes *${total}* damage from ongoing effects.`);
         if (newHp <= 0) {
            setTimeout(() => { addLog(`The #${enemyEntity.name}# is vanquished!`); setTimeout(() => setGameState('REWARD'), 1000); }, 500);
            return; // enemy died from DOT, skip its action
         }
      } else {
         setCurrentEnemy(prev => ({ ...prev, statusEffects: newStatus }));
      }

      // If stunned effect present, they skip action this turn
      if (stunnedThisTurn) {
        addLog(`#${enemyEntity.name}# is stunned and cannot act!`);
        // Clear a stun (it was decremented above)
        setCurrentEnemy(prev => ({ ...prev, isStunned: false }));
        // Refill hand anyway so player can play
        const tilesNeeded = HAND_SIZE - hand.filter(Boolean).length;
        if (tilesNeeded > 0) drawHand(tilesNeeded, deck, hand);
        return;
      }
    }

    // CHECK STUN (legacy)
    if (enemyEntity.isStunned) {
        addLog(`#${enemyEntity.name}# is stunned and cannot act!`);
        // Clear stun for next turn
        setCurrentEnemy(prev => ({ ...prev, isStunned: false }));
        // Refill hand anyway so player can play
        const tilesNeeded = HAND_SIZE - hand.filter(Boolean).length;
        if (tilesNeeded > 0) drawHand(tilesNeeded, deck, hand);
        return;
    }

    setAnimState(prev => ({ ...prev, enemy: 'anim-action' }));

    setTimeout(() => {
        setAnimState(prev => ({ ...prev, enemy: '' }));
        
        const vocab = enemyEntity.vocabulary || ["HIT"];
        const word = vocab[Math.floor(Math.random() * vocab.length)];
        
        // 1. CALL ENGINE (isPlayerCasting = false)
        const result = resolveSpell(word, enemyEntity, PLAYER_DEFENSE, false);

        setSpellEffect(result.emoji || "💥");
        setTimeout(() => setSpellEffect(null), 1000);

        addLog(`#${enemyEntity.name}# casts ^${word}^!`);
        addLog(...result.logs);

        // 2. APPLY EFFECTS TO PLAYER
        
        // Flee (Enemy runs away)
        if (result.status === 'flee') {
            addLog(`#${enemyEntity.name}# fled the battle!`);
            setTimeout(() => {
                // Victory, but maybe different flavor text?
                setGameState('REWARD');
            }, 1000);
            return;
        }

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
                setCurrentEnemy(prev => ({ ...prev, statusEffects: [...(prev.statusEffects || []), {...result.statusEffect}] }));
                addLog(`#${enemyEntity.name}# gains ${result.statusEffect.tag}!`);
            } else {
                // Apply to player
                setPlayerDots(prev => ([...prev, {...result.statusEffect}]));
                addLog(`You are afflicted with ${result.statusEffect.tag}!`);
            }
        }

        // Damage (Player)
        if (result.damage > 0) {
            let damageToApply = result.damage;

            // Artifact passive block (e.g., helmet)
            const artifactBlock = inventory.reduce((s,a) => s + (a.incomingDamageBlock || 0), 0);
            if (artifactBlock > 0) {
                const reduced = Math.min(artifactBlock, damageToApply);
                damageToApply -= reduced;
                if (reduced > 0) addLog(`Your artifacts block *${reduced}* damage!`);
            }

            // Check for shield on player
            const shieldIndex = playerDots ? playerDots.findIndex(s => s.tag === 'shield') : -1;
            if (shieldIndex >= 0) {
                const shield = playerDots[shieldIndex];
                const block = shield.block || 2;
                const consumed = Math.min(block, damageToApply);
                damageToApply -= consumed;
                addLog(`Your shield blocks *${consumed}* damage!`);
                // remove the shield
                setPlayerDots(prev => {
                    const copy = [...prev];
                    copy.splice(shieldIndex, 1);
                    return copy;
                });
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
        
        // Stun (Player)
        if (result.status === 'stun') {
            addLog("You are stunned! (Logic not implemented yet for player skip)");
            // If you implement this, you'd need a isPlayerStunned state and skip controls.
        }

        // Ongoing DOT (to player)
        if (result.dot) {
            setPlayerDots(prev => ([...prev, {...result.dot}]));
            addLog(`You are afflicted with ${result.dot.tag}!`);
        }

        // 3. REFILL HAND
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
      playerStatusEffects={playerDots}
      revealWeaknesses={inventory.some(a => a.revealWeaknesses)}
      encounterIndex={enemyIndex}
      totalEncounters={ENCOUNTERS.length}
      enemy={currentEnemy}
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