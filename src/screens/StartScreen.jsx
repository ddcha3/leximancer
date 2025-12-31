import { useState } from 'react';
import { CHARACTERS } from '../data/player';
import Title from '../components/Title';
import HelpModal from '../components/HelpModal'; // Import the new component
import PixelEmoji from '../components/PixelEmoji';

export default function StartScreen({ onStart, isLoading }) {
  const [selectedCharId, setSelectedCharId] = useState(CHARACTERS[0].id);
  const [showHelp, setShowHelp] = useState(false); // State for modal

  const handleStart = () => {
    const char = CHARACTERS.find(c => c.id === selectedCharId);
    onStart(char);
  };

  return (
    <div className="start-screen">
      <Title text="LEXIMANCER" />
      
      {/* --- INSTRUCTION BUTTON --- */}
      <button 
        onClick={() => setShowHelp(true)}
        style={{
          marginBottom: '20px', 
          fontSize: '1rem', 
          padding: '8px 16px',
          borderColor: '#000000ff',
          color: '#fff',
          backgroundColor: 'var(--accent-red)',
          fontFamily: 'FFFFORWA',
        }}
      >
        HOW TO PLAY
      </button>

      <p style={{marginBottom: '20px', fontSize: '0.8rem', fontFamily: 'FFFFORWA'}}>CHOOSE YOUR CLASS:</p>
      
      <div className="char-select-container">
        {CHARACTERS.map(char => (
          <div 
            key={char.id}
            className={`char-card ${selectedCharId === char.id ? 'selected' : ''}`}
            onClick={() => setSelectedCharId(char.id)}
          >
            <div className="char-avatar"><PixelEmoji icon={char.avatar} size="4rem" /> </div>
            <h3>{char.name}</h3>
            <p>{char.desc}</p>
          </div>
        ))}
      </div>

      <button 
        className="cast-btn" 
        onClick={handleStart} 
        disabled={isLoading}
        style={{marginTop: '30px', fontSize: '1rem', fontFamily: 'FFFFORWA', background: 'var(--accent-red)'}}
      >
        {isLoading ? "Loading..." : "START"}
      </button>

      {/* --- THE MODAL --- */}
      <HelpModal 
        isOpen={showHelp} 
        onClose={() => setShowHelp(false)} 
      />

    </div>
  );
}