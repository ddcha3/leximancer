import { useState } from 'react';
import { CHARACTERS } from '../data/player';
import Title from '../components/Title';
import Modal from '../components/Modal'; // Import the new component
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

      <p style={{marginBottom: '20px', fontSize: '0.8rem', fontFamily: 'FFFFORWA'}}>CHOOSE YOUR CHARACTER:</p>
      
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
      <Modal 
        isOpen={showHelp} 
        onClose={() => setShowHelp(false)} 
        title="Grimoire of Rules"
      >
        <div className="modal-body">
          <p>You are a Leximancer, a mage who weaves reality through language.</p>
          
          <h4>COMBAT</h4>
          <ul>
            <li><strong>Spellcasting:</strong> Click tiles to form words. Words must be at least 3 letters long. Longer words generally deal more damage.</li>
            <li><strong>Tags:</strong> Words like <em>FIRE</em>, <em>ICE</em>, or <em>POISON</em> have elemental affinities or special effects. Use them to exploit enemy weaknesses.</li>
            <li><strong>Utility:</strong> Words like <em>HEAL</em> or <em>FOOD</em> can restore your health. Words like <em>TRAP</em> can stun enemies.</li>
          </ul>

          <h4>HAND MANAGEMENT</h4>
          <ul>
            <li><strong>🔀 Shuffle:</strong> Rearrange the order of your tiles (free).</li>
            <li><strong>♻ Mulligan:</strong> Discard your hand for 16 new tiles (skips your turn).</li>
          </ul>

          <h4>ENEMIES</h4>
          <ul>
            <li>Enemies have their own vocabulary and will attack you with words.</li>
            <li>Enemies have both health (❤️) and willpower (🧠). Reduce either to zero to win.</li>
            <li>Some enemies are resistant to physical attacks but weak to psychological spells like <em>FEAR</em> or <em>BRIBE</em>.</li>
          </ul>
        </div>
      </Modal>

    </div>
  );
}