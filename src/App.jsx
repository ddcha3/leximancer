import natural from 'natural';
import compromise from 'compromise';

import { useState, useEffect } from 'react'
import './App.css'

import { ENCOUNTERS } from './data/enemies';
import { SPELLBOOK } from './data/spells';
import { TAG_EMOJIS } from './data/tags';
import { WIZARDS, PLAYER_DEFENSE, STARTING_DECK } from './data/player';

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
  const [playerAvatar] = useState(WIZARDS[0]);
  const [dictionary, setDictionary] = useState(new Set());
  const [isDictLoading, setIsDictLoading] = useState(true);

  const [playerHp, setPlayerHp] = useState(MAX_PLAYER_HP);
  const [inventory, setInventory] = useState(["🪄"]); 

  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [spellSlots, setSpellSlots] = useState([]);
  
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [enemyIndex, setEnemyIndex] = useState(0);
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
  const isValidWord = currentWordStr.length > 0 && 
                     (dictionary.has(currentWordStr) || SPELLBOOK[currentWordStr]);

  const startGame = () => {
    setDeck(shuffle(STARTING_DECK));
    setEnemyIndex(0);
    setPlayerHp(MAX_PLAYER_HP);
    setLogs(["The Leximancer enters the archives..."]);
    startEncounter(0);
  };

  const startEncounter = (index) => {
    if (index >= ENCOUNTERS.length) {
      setGameState('VICTORY');
      return;
    }
    const enemyData = JSON.parse(JSON.stringify(ENCOUNTERS[index]));
    enemyData.maxHp = enemyData.hp;
    enemyData.maxWp = enemyData.wp;
    enemyData.isStunned = false; // Initialize stun state
    
    setCurrentEnemy(enemyData);
    setGameState('BATTLE');
    drawHand(HAND_SIZE, shuffle(STARTING_DECK), []);
    setSpellSlots([]);
    setAnimState({ player: '', enemy: '' });
    addLog(`A wild #${enemyData.name}# appears!`);
  };

  const drawHand = (count, currentDeck, currentHand) => {
    const newHand = [...currentHand];
    let deckCopy = [...currentDeck];
    for (let i = 0; i < count; i++) {
      if (deckCopy.length === 0) {
        addLog("Deck empty. Reshuffling...");
        deckCopy = shuffle(STARTING_DECK);
      }
      newHand.push({ id: Math.random(), char: deckCopy.pop() });
    }
    setDeck(deckCopy);
    setHand(newHand);
  };

  const handleCast = () => {
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
      const result = resolveSpell(currentWordStr, { name: "You" }, currentEnemy, true);

      // 2. SHOW VISUALS
      // Use Engine emoji or fallback to Tag lookup
      let visualEmoji = result.emoji;
      if (!visualEmoji && result.tags.length > 0) {
         const found = result.tags.find(t => TAG_EMOJIS[t]);
         if (found) visualEmoji = TAG_EMOJIS[found];
      }
      setSpellEffect(visualEmoji || "✨");
      setTimeout(() => setSpellEffect(null), 1000);

      // 3. LOGGING
      if (result.tags.includes(POS_TAG_MAP.noun)) {
          addLog(`You conjured a ^${currentWordStr}^!`);
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
          setPlayerHp(prev => Math.min(MAX_PLAYER_HP, prev + result.heal));
          addLog(`Restored *${result.heal}* HP.`);
      }

      // C. DAMAGE (Enemy)
      let nextEnemyState = { ...currentEnemy };
      if (result.damage > 0) {
          setAnimState(prev => ({ ...prev, enemy: 'anim-damage' }));
          setTimeout(() => setAnimState(prev => ({ ...prev, enemy: '' })), 400);
          
          if (result.targetStat === 'hp') nextEnemyState.hp -= result.damage;
          else nextEnemyState.wp -= result.damage;
          
          addLog(`Dealt *${result.damage}* ${result.targetStat.toUpperCase()} damage!`);
      }

      // D. STUN (Enemy)
      if (result.status === 'stun') {
          nextEnemyState.isStunned = true;
          addLog(`#${currentEnemy.name}# is stunned!`);
      }

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
    // CHECK STUN
    if (enemyEntity.isStunned) {
        addLog(`#${enemyEntity.name}# is stunned and cannot act!`);
        // Clear stun for next turn
        setCurrentEnemy(prev => ({ ...prev, isStunned: false }));
        // Refill hand anyway so player can play
        const tilesNeeded = HAND_SIZE - hand.length;
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

        // Damage (Player)
        if (result.damage > 0) {
            setAnimState(prev => ({ ...prev, player: 'anim-damage' }));
            setTimeout(() => setAnimState(prev => ({ ...prev, player: '' })), 400);

            setPlayerHp(prev => {
                const newHp = Math.max(0, prev - result.damage);
                if (newHp === 0) setGameState('GAMEOVER');
                return newHp;
            });
            addLog(`You take *${result.damage}* damage!`);
        }
        
        // Stun (Player)
        if (result.status === 'stun') {
            addLog("You are stunned! (Logic not implemented yet for player skip)");
            // If you implement this, you'd need a isPlayerStunned state and skip controls.
        }

        // 3. REFILL HAND
        const tilesNeeded = HAND_SIZE - hand.length;
        if (tilesNeeded > 0) drawHand(tilesNeeded, deck, hand);

    }, 500);
  };

  const handleMoveTile = (tile) => {
    setHand(hand.filter(t => t.id !== tile.id));
    setSpellSlots([...spellSlots, tile]);
  };
  const handleReturnTile = (tile) => {
    setSpellSlots(spellSlots.filter(t => t.id !== tile.id));
    setHand([...hand, tile]);
  };
  const handleClear = () => {
    setSpellSlots([]); 
    setHand([...hand, ...spellSlots]);
  };
  const handleShuffle = () => {
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
  if (gameState === 'START') return <StartScreen onStart={startGame} avatar={playerAvatar} isLoading={isDictLoading} />;
  
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
      playerAvatar={playerAvatar}
      playerHp={playerHp}       
      maxPlayerHp={MAX_PLAYER_HP} 
      inventory={inventory}     
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