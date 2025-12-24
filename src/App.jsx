import { useState, useEffect, useRef } from 'react'
import './App.css'
import { STARTING_DECK, ENCOUNTERS, SPELLBOOK, WIZARDS } from './gameData'

// Helper to shuffle array
const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

function App() {
  // --- STATE ---
  const [gameState, setGameState] = useState('START'); // START, BATTLE, REWARD, GAMEOVER, VICTORY
  const [playerAvatar, setPlayerAvatar] = useState(WIZARDS[0]);
  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [spellSlots, setSpellSlots] = useState([]);
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [enemyIndex, setEnemyIndex] = useState(0);
  const [logs, setLogs] = useState(["Welcome, Leximancer."]);
  
  // Refs for scrolling log
  const logEndRef = useRef(null);

  // --- INITIALIZATION ---
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
    // Deep copy enemy so we don't mutate the base data between runs
    const enemyData = JSON.parse(JSON.stringify(ENCOUNTERS[index]));
    enemyData.maxHp = enemyData.hp;
    enemyData.maxWp = enemyData.wp;
    
    setCurrentEnemy(enemyData);
    setGameState('BATTLE');
    drawHand(7, shuffle(STARTING_DECK)); // Simple reshuffle for prototype
    setSpellSlots([]);
    addLog(`A wild ${enemyData.name} appears!`);
  };

  // --- HAND MANAGEMENT ---
  const drawHand = (count, currentDeck) => {
    const newHand = [];
    const deckCopy = [...currentDeck];
    for (let i = 0; i < count; i++) {
      if (deckCopy.length > 0) {
        // Create unique ID for every tile to handle duplicate letters
        newHand.push({ id: Math.random(), char: deckCopy.pop() });
      }
    }
    setDeck(deckCopy);
    setHand(newHand);
  };

  const moveTileToSlot = (tile) => {
    setHand(hand.filter(t => t.id !== tile.id));
    setSpellSlots([...spellSlots, tile]);
  };

  const returnTileToHand = (tile) => {
    setSpellSlots(spellSlots.filter(t => t.id !== tile.id));
    setHand([...hand, tile]);
  };

  // --- COMBAT LOGIC ---
  const castSpell = () => {
    if (spellSlots.length === 0) return;

    const word = spellSlots.map(t => t.char).join("");
    const wordData = SPELLBOOK[word]; // Check magic dictionary
    
    // Default stats for non-magic words
    let power = word.length; // 1 dmg per letter
    let tags = [];
    let isMagic = false;

    if (wordData) {
      power = wordData.power;
      tags = wordData.tags;
      isMagic = true;
    }

    // Process against Enemy
    let multipliers = 1.0;
    let targetStat = 'hp'; // default physical
    let battleLog = [`You cast "${word}"!`];

    if (isMagic) {
      battleLog.push(`It pulsates with [${tags.join(", ")}] energy.`);
      
      tags.forEach(tag => {
        // Weaknesses
        if (currentEnemy.weaknesses[tag]) {
          const weak = currentEnemy.weaknesses[tag];
          multipliers *= weak.mult;
          battleLog.push(`> ${weak.msg} (x${weak.mult})`);
          if (weak.target) targetStat = weak.target;
        }
        // Resistances
        if (currentEnemy.resistances[tag]) {
          const res = currentEnemy.resistances[tag];
          multipliers *= res.mult;
          battleLog.push(`> ${res.msg} (x${res.mult})`);
        }
      });
    } else {
      battleLog.push("It's a mundane collection of letters.");
    }

    const finalDamage = Math.floor(power * multipliers);
    
    // Apply Damage
    const newEnemy = { ...currentEnemy };
    if (targetStat === 'hp') {
      newEnemy.hp -= finalDamage;
      battleLog.push(`Dealt ${finalDamage} Physical DMG!`);
    } else {
      newEnemy.wp -= finalDamage;
      battleLog.push(`Dealt ${finalDamage} Willpower DMG!`);
    }

    // Update State
    addLog(...battleLog);
    setCurrentEnemy(newEnemy);
    setSpellSlots([]); // discard played tiles
    
    // Check Win/Loss conditions
    if (newEnemy.hp <= 0 || newEnemy.wp <= 0) {
      addLog(`The ${newEnemy.name} is defeated!`);
      setTimeout(() => setGameState('REWARD'), 1000);
    } else {
      // Enemy Turn (Simplified)
      setTimeout(() => {
        addLog(`${newEnemy.name} attacks!`);
        // In full game, player has HP. For now, endless loop until win.
        drawCardsIfNeeded();
      }, 1000);
    }
  };

  const drawCardsIfNeeded = () => {
    // Refill hand to 7
    const needed = 7 - hand.length;
    if (needed > 0) {
      drawHand(needed, deck.length > 0 ? deck : shuffle(STARTING_DECK));
    }
  };

  const addLog = (...messages) => {
    setLogs(prev => [...prev, ...messages]);
  };

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // --- RENDER HELPERS ---
  const renderTile = (tile, onClick) => (
    <div key={tile.id} className="tile" onClick={() => onClick(tile)}>
      {tile.char}
    </div>
  );

  // --- SCREENS ---
  if (gameState === 'START') {
    return (
      <div className="start-screen">
        <h1>LEXIMANCER</h1>
        <div style={{fontSize: '4rem', marginBottom: '20px'}}>{playerAvatar}</div>
        <p>Spell words. Exploit weaknesses. Survive.</p>
        <button className="cast-btn" onClick={startGame}>Enter Dungeon</button>
      </div>
    );
  }

  if (gameState === 'REWARD') {
    return (
      <div className="reward-screen">
        <h2>VICTORY!</h2>
        <p>The {currentEnemy.name} is vanquished.</p>
        <div className="controls">
          <button className="cast-btn" onClick={() => {
            setEnemyIndex(prev => prev + 1);
            startEncounter(enemyIndex + 1);
          }}>
            Next Encounter ➡
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'VICTORY') {
    return (
      <div>
        <h1>YOU WIN!</h1>
        <p>The dungeon is cleared.</p>
        <button onClick={() => setGameState('START')}>Play Again</button>
      </div>
    );
  }

  // BATTLE SCREEN
  return (
    <div className="app">
      <div className="header">
        <div>{playerAvatar} Leximancer</div>
        <div className="stats">Encounter {enemyIndex + 1}/{ENCOUNTERS.length}</div>
      </div>

      {currentEnemy && (
        <div className="battle-area">
          <div className="enemy-emoji">{currentEnemy.emoji}</div>
          <h3>{currentEnemy.name}</h3>
          <div className="bars">
            <div className="bar">
              <div className="bar-fill hp-fill" style={{width: `${Math.max(0, (currentEnemy.hp / currentEnemy.maxHp) * 100)}%`}}></div>
              <span className="bar-text">HP: {currentEnemy.hp}</span>
            </div>
            <div className="bar">
              <div className="bar-fill wp-fill" style={{width: `${Math.max(0, (currentEnemy.wp / currentEnemy.maxWp) * 100)}%`}}></div>
              <span className="bar-text">WP: {currentEnemy.wp}</span>
            </div>
          </div>
          <p style={{fontSize: '0.8em', color: '#888', marginTop: '10px'}}>{currentEnemy.desc}</p>
        </div>
      )}

      <div className="log">
        {logs.map((l, i) => <div key={i}>{l}</div>)}
        <div ref={logEndRef} />
      </div>

      <div className="spell-slot">
        {spellSlots.length === 0 && <span className="tile empty">?</span>}
        {spellSlots.map(t => renderTile(t, returnTileToHand))}
      </div>

      <div className="hand">
        {hand.map(t => renderTile(t, moveTileToSlot))}
      </div>

      <div className="controls">
        <button onClick={() => { setSpellSlots([]); setHand([...hand, ...spellSlots]); }}>Clear</button>
        <button onClick={() => { setHand([]); drawCardsIfNeeded(); }}>Shuffle (-5HP)</button>
        <button className="cast-btn" disabled={spellSlots.length === 0} onClick={castSpell}>CAST</button>
      </div>
    </div>
  )
}

export default App