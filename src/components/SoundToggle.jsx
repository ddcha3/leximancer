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
        position: 'fixed',
        top: '5px',
        right: '5px',
        fontSize: '0.8rem',
        cursor: 'pointer',
        zIndex: 1000,
        padding: '4px'
      }}
      title={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? <PixelEmoji icon="🔇"/> : <PixelEmoji icon="🔊"/>}
    </button>
  );
}
