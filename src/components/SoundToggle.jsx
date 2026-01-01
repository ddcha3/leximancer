import React from 'react';
import { useSound } from '../contexts/SoundContext';
import PixelEmoji from '../components/PixelEmoji';


export default function SoundToggle() {
  const { isMuted, setIsMuted } = useSound();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
      }}
      style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        fontSize: '1.2rem',
        cursor: 'pointer',
        zIndex: 1000,
        padding: '5px'
      }}
      title={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? <PixelEmoji icon="🔇" size="1rem" /> : <PixelEmoji icon="🔊" size="1rem" />}
    </button>
  );
}
