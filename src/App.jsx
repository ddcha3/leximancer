import { useState, useEffect } from 'react'
import './App.css'
import { STARTING_DECK, ENCOUNTERS, SPELLBOOK, WIZARDS } from './gameData'

import StartScreen from './screens/StartScreen'
import BattleScreen from './screens/BattleScreen'
import RewardScreen from './screens/RewardScreen'

const HAND_SIZE = 12;

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

  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [spellSlots, setSpellSlots] = useState([]);
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [enemyIndex, setEnemyIndex] = useState(0);
  const [logs, setLogs] = useState([]);
  
  // --- NEW STATE ---
  const [shakeError, setShakeError] = useState(false);

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
    setLogs(["Welcome, Leximancer.", "The dungeon awaits..."]);
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
    addLog(`A wild ${enemyData.name} appears!`);
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
    // --- VALIDATION LOGIC ---
    if (!isValidWord) {
      addLog(`"${currentWordStr}" is not a recognized spell.`);
      setShakeError(true);
      // Remove shake class after animation plays (400ms)
      setTimeout(() => setShakeError(false), 400);
      return;
    }

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

    let multipliers = 1.0;
    let targetStat = 'hp';
    let battleLog = [`You cast "${word}"!`];

    if (isMagic) {
      battleLog.push(`It pulsates with [${tags.join(", ")}] energy.`);
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
    } else {
      battleLog.push("It's a mundane attack.");
    }

    const finalDamage = Math.floor(power * multipliers);
    
    const newEnemy = { ...currentEnemy };
    if (targetStat === 'hp') newEnemy.hp -= finalDamage;
    else newEnemy.wp -= finalDamage;

    battleLog.push(`Dealt ${finalDamage} ${targetStat.toUpperCase()} DMG!`);
    
    addLog(...battleLog);
    setCurrentEnemy(newEnemy);
    setSpellSlots([]);
    
    const tilesNeeded = HAND_SIZE - hand.length;
    if (tilesNeeded > 0) drawHand(tilesNeeded, deck, hand);
    
    if (newEnemy.hp <= 0 || newEnemy.wp <= 0) {
      addLog(`The ${newEnemy.name} is defeated!`);
      setTimeout(() => setGameState('REWARD'), 1000);
    } else {
      setTimeout(() => addLog(`${newEnemy.name} attacks!`), 1000);
    }
  };

  // ... (Rest of handlers: handleMoveTile, handleReturnTile, etc.) ...
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
    addLog("Mulligan! You drew a fresh hand.");
  };
  const addLog = (...messages) => setLogs(prev => [...prev, ...messages]);

  // --- RENDER ---
  if (gameState === 'START') {
    return <StartScreen onStart={startGame} avatar={playerAvatar} isLoading={isDictLoading} />;
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
        <h1>YOU WIN!</h1>
        <button onClick={() => setGameState('START')}>Play Again</button>
      </div>
    );
  }

  return (
    <BattleScreen 
      playerAvatar={playerAvatar}
      encounterIndex={enemyIndex}
      totalEncounters={ENCOUNTERS.length}
      enemy={currentEnemy}
      logs={logs}
      hand={hand}
      spellSlots={spellSlots}
      isValidWord={!!isValidWord}
      shakeError={shakeError} // <--- PASSING THE STATE
      actions={{
        onMoveTile: handleMoveTile,
        onReturnTile: handleReturnTile,
        onCast: handleCast,
        onClear: handleClear,
        onDiscard: handleDiscard
      }}
    />
  );
}

export default App