import { useState } from 'react';
import { CHARACTERS } from '../data/player';
import Title from '../components/Title';
import HelpModal from '../components/HelpModal';
import PixelEmoji from '../components/PixelEmoji';
import { useSound } from '../contexts/SoundContext';
import SoundToggle from '../components/SoundToggle';
import Modal from '../components/Modal';

export default function StartScreen({ onStart, onStartDaily, isLoading }) {
  const [selectedCharId, setSelectedCharId] = useState(CHARACTERS[0].id);
  const [showHelp, setShowHelp] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const { playSound } = useSound();

  const handleStart = (isDaily = false) => {
    playSound('interface/bonus');
    const char = CHARACTERS.find(c => c.id === selectedCharId);
    if (isDaily && onStartDaily) onStartDaily(char);
    else onStart(char);
  };

  return (
    <div className="start-screen" style={{ position: 'relative' }}>
      <SoundToggle />
      <Title text="LEXIMANCER" />
      
      <button 
        onClick={() => {
          playSound('interface/click');
          setShowHelp(true);
        }}
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
            onClick={() => {
              playSound('interface/click');
              setSelectedCharId(char.id);
            }}
          >
            <div className="char-avatar"><PixelEmoji icon={char.avatar} size="4rem" /> </div>
            <h3>{char.name}</h3>
            <p>{char.desc}</p>
          </div>
        ))}
      </div>

      <div style={{display: 'flex', gap: '10px', marginTop: '30px'}}>
        <button 
          className="cast-btn" 
          onClick={() => handleStart(false)} 
          disabled={isLoading}
          style={{flex: 1, fontSize: '1rem', fontFamily: 'FFFFORWA', background: 'var(--accent-red)'}}
        >
          {isLoading ? "Loading..." : "CLASSIC"}
        </button>
        <button 
          className="cast-btn" 
          onClick={() => handleStart(true)} 
          disabled={isLoading}
          style={{flex: 1, fontSize: '1rem', fontFamily: 'FFFFORWA', background: '#4e6d46'}}
        >
          DAILY RUN
        </button>
      </div>

      {/* --- THE MODAL --- */}
      <HelpModal 
        isOpen={showHelp} 
        onClose={() => setShowHelp(false)} 
      />

      <Modal 
        isOpen={showCredits} 
        onClose={() => setShowCredits(false)} 
        title="Credits"
      >
        <p style={{ marginTop: 0 }}><strong>LEXIMANCER</strong></p>
        <p style={{ margin: '4px 0' }}>Created by Venkata Poreddy</p>
        <p style={{ margin: '8px 0 4px' }}><strong>Assets & Licenses</strong></p>
        <ul style={{ marginTop: 0 }}>
          <li>Graphics: Pixel Emojis by SerenityOS (BSD 2-Clause License).</li>
          <li>Audio: Sound Effects by Oryx Design Lab.</li>
          <li>Music: Fesliyan Studios.</li>
        </ul>
        <p style={{ marginBottom: 0 }}>All licenses are available in the licenses folder.</p>
      </Modal>

      <button
        onClick={() => {
          playSound('interface/click');
          setShowCredits(true);
        }}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          fontSize: '0.5rem',
          padding: '4px',
          backgroundColor: '#8b735b',
          color: '#fff',
          borderColor: '#3c2f23',
          fontFamily: 'FFFFORWA',
          cursor: 'pointer'
        }}
      >
        CREDITS
      </button>

    </div>
  );
}