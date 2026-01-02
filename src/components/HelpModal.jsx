import React from 'react';
import Modal from './Modal';
import PixelEmoji from './PixelEmoji';

export default function HelpModal({ isOpen, onClose }) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Grimoire of Rules"
    >
      <div className="modal-body">
        <p>You are a Leximancer, a mage who weaves reality through language.</p>
        
        <h4>COMBAT</h4>
        <ul>
          <li><strong>Spellcasting:</strong> Click tiles to form words. Words must be at least three letters long. Longer words generally deal more damage.</li>
          <li><strong>Enemies</strong> have both health (<PixelEmoji icon="❤️" size="0.8rem"/>) and willpower (<PixelEmoji icon="🧠" size="0.8rem"/>). Concrete words damage HP, and abstract words damage WP. Reduce either to zero, or both to one third, to win.</li>
          <li><strong>Tags:</strong> Words like <em>FIRE</em>, <em>ICE</em>, and <em>POISON</em> have elemental affinities or special effects.</li>
          <li><strong>Utility:</strong> Words like <em>HEAL</em> and <em>FOOD</em> restore your health. Words like <em>STUN</em> prevent enemies from attacking.</li>
        </ul>

        <h4>CONTROLS</h4>
        <ul>
          <li><strong><PixelEmoji icon="♻" size="0.8rem"/> Mulligan:</strong> Discard your entire hand and redraw from your tile bag (skips your turn).</li>
          <li><strong><PixelEmoji icon="🔀" size="0.8rem"/> Shuffle:</strong> Randomly rearrange the order of your tiles for a fresh perspective.</li>
          <li><strong><PixelEmoji icon="🔡" size="0.8rem"/> Alphabetize: </strong> Sort your tiles alphabetically.</li>
          <li><strong><PixelEmoji icon="🗑️" size="0.8rem"/> Clear:</strong> Remove all staged tiles to start forming a new word.</li>
          <li><strong><PixelEmoji icon="🪄" size="0.8rem"/> Cast:</strong> Complete your staged word and cast a spell!</li>
        </ul>
      </div>
    </Modal>
  );
}
