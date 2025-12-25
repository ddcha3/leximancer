import { useState, useEffect } from 'react'
import './App.css'
import { STARTING_DECK, ENCOUNTERS, SPELLBOOK, WIZARDS, TAG_EMOJIS } from './gameData'

import StartScreen from './screens/StartScreen'
import BattleScreen from './screens/BattleScreen'
import RewardScreen from './screens/RewardScreen'

const HAND_SIZE = 18;
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

  // Stats
  const [playerHp, setPlayerHp] = useState(MAX_PLAYER_HP);
  const [inventory, setInventory] = useState(["🪄"]); 

  // Combat Data
  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [spellSlots, setSpellSlots] = useState([]);
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [enemyIndex, setEnemyIndex] = useState(0);
  const [logs, setLogs] = useState([]);
  
  // Visuals / Animations
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
        console.error("Failed to load dictionary", err);
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
    setLogs(["The Leximancer enters the archive..."]);
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
    
    setCurrentEnemy(enemyData);
    setGameState('BATTLE');
    drawHand(HAND_SIZE, shuffle(STARTING_DECK), []);
    setSpellSlots([]);
    setAnimState({ player: '', enemy: '' }); // Reset anims
    addLog(`A wild #${enemyData.name}# appears!`);  };

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
      addLog(`"${currentWordStr}" fizzles! Not a word.`);
      setShakeError(true);
      setTimeout(() => setShakeError(false), 400);
      return;
    }

    // 1. TRIGGER PLAYER ACTION ANIMATION
    setAnimState(prev => ({ ...prev, player: 'anim-action' }));

    // 2. WAIT FOR ACTION ANIMATION TO FINISH, THEN RESOLVE EFFECT (500ms)
    setTimeout(() => {
      // Clear player animation
      setAnimState(prev => ({ ...prev, player: '' }));

      const word = currentWordStr;
      const wordData = SPELLBOOK[word]; 
      
      let power = word.length;
      let tags = [];
      let isMagic = false;

      if (wordData) {
        power = wordData.power;
        tags = wordData.tags;
        isMagic = true;
      }

      // DETERMINE VISUAL EFFECT
      // Find first tag that has an emoji, or default to Sparkle
      let effectEmoji = "✨";
      if (tags.length > 0) {
        const found = tags.find(t => TAG_EMOJIS[t]);
        if (found) effectEmoji = TAG_EMOJIS[found];
      }
      
      // TRIGGER SPELL VISUAL
      setSpellEffect(effectEmoji);
      // Remove visual after 1s
      setTimeout(() => setSpellEffect(null), 1000);

      // TRIGGER ENEMY DAMAGE ANIMATION
      setAnimState(prev => ({ ...prev, enemy: 'anim-damage' }));
      setTimeout(() => setAnimState(prev => ({ ...prev, enemy: '' })), 400);

      // --- CALCULATIONS ---
      let multipliers = 1.0;
      let targetStat = 'hp';
      let battleLog = [`You cast ^${word}^!`];

      if (isMagic) {
        tags.forEach(tag => {
          if (currentEnemy.weaknesses[tag]) {
            const weak = currentEnemy.weaknesses[tag];
            multipliers *= weak.mult;
            battleLog.push(`> ${weak.msg} (x${weak.mult})`);
            if (weak.target) targetStat = weak.target;
          }
          if (currentEnemy.resistances[tag]) {
            const res = currentEnemy.resistances[tag];
            multipliers *= res.mult;
            battleLog.push(`> ${res.msg} (x${res.mult})`);
          }
        });
      }

      const finalDamage = Math.floor(power * multipliers);
      const newEnemy = { ...currentEnemy };
      
      if (targetStat === 'hp') newEnemy.hp -= finalDamage;
      else newEnemy.wp -= finalDamage;

      battleLog.push(`Dealt *${finalDamage}* ${targetStat.toUpperCase()} damage!`);
      addLog(...battleLog);
      setCurrentEnemy(newEnemy);
      setSpellSlots([]);

      // --- CHECK WIN ---
      if (newEnemy.hp <= 0 || newEnemy.wp <= 0) {
        setTimeout(() => {
           addLog(`The #${newEnemy.name}# is vanquished!`);
           setTimeout(() => setGameState('REWARD'), 1000);
        }, 500); // Small delay after hit
        return;
      }

      // --- ENEMY TURN (Delay for readability) ---
      setTimeout(() => {
        handleEnemyAttack(newEnemy);
      }, 1500);

    }, 500); // End of Player Action Delay
  };

  const handleEnemyAttack = (enemyEntity) => {
    // 1. Enemy Action Animation
    setAnimState(prev => ({ ...prev, enemy: 'anim-action' }));

    setTimeout(() => {
        setAnimState(prev => ({ ...prev, enemy: '' }));
        
        // 2. Player Damage Animation
        setAnimState(prev => ({ ...prev, player: 'anim-damage' }));
        setTimeout(() => setAnimState(prev => ({ ...prev, player: '' })), 400);

        const dmg = Math.floor(Math.random() * 6) + 5; 
        setPlayerHp(prev => {
            const newHp = Math.max(0, prev - dmg);
            if (newHp === 0) setGameState('GAMEOVER');
            return newHp;
        });
        addLog(`#${enemyEntity.name}# attacks you for *${dmg}* damage!`);
        
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
  const handleDiscard = () => {
    setSpellSlots([]);
    drawHand(HAND_SIZE, deck, []);
    addLog("Mulligan! Hand discarded.");
    handleEnemyAttack(currentEnemy);
  };
  const handleShuffle = () => {
    setHand(prev => shuffle([...prev]));
  };
  const addLog = (...messages) => setLogs(prev => [...prev, ...messages]);

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