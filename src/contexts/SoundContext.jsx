import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const SoundContext = createContext();

// ALL MUSIC IS FROM https://www.fesliyanstudios.com/royalty-free-music/downloads-c/8-bit-music/6
// SOUNDS: https://www.oryxdesignlab.com/products/p/8-bit-sounds

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

export const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const currentMusicRef = useRef(null);
  const currentMusicPathRef = useRef(null);
  
  const soundModules = import.meta.glob('../assets/sounds/**/*.{wav,mp3}', { eager: true });

  const getModule = (path) => {
    let fullPath = `../assets/sounds/${path}`;
    if (soundModules[fullPath]) return soundModules[fullPath];

    if (soundModules[`${fullPath}.wav`]) return soundModules[`${fullPath}.wav`];
    if (soundModules[`${fullPath}.mp3`]) return soundModules[`${fullPath}.mp3`];

    return null;
  };

  const playSound = (path, options = {}) => {
    if (isMuted) return;

    const module = getModule(path);

    if (!module) {
      console.warn(`Sound not found: ${path}`);
      return;
    }

    const src = module.default;
    
    try {
      const audio = new Audio(src);
      audio.volume = (options.volume !== undefined ? options.volume : 1) * volume;
      
      if (options.loop) {
        audio.loop = true;
      }

      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Audio playback failed:", error);
        });
      }
      
      return audio;
    } catch (e) {
      console.error("Error creating Audio object:", e);
    }
  };

  const playMusic = (path, options = {}) => {
    if (currentMusicPathRef.current === path && currentMusicRef.current) {
        if (!isMuted && currentMusicRef.current.paused) {
            currentMusicRef.current.play().catch(e => console.warn("Music resume failed", e));
        }
        return;
    }

    if (currentMusicRef.current) {
        currentMusicRef.current.pause();
        currentMusicRef.current = null;
    }

    currentMusicPathRef.current = path;

    if (!path) return; // Stop music if path is null

    const module = getModule(path);
    if (!module) {
        console.warn(`Music not found: ${path}`);
        return;
    }

    const src = module.default;
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = (options.volume !== undefined ? options.volume : 0.25) * volume; // Default music volume lower
    
    currentMusicRef.current = audio;

    if (!isMuted) {
        audio.play().catch(e => console.warn("Music play failed", e));
    }
  };

  // Handle mute toggling for music
  useEffect(() => {
    if (currentMusicRef.current) {
        if (isMuted) {
            currentMusicRef.current.pause();
        } else {
            currentMusicRef.current.play().catch(e => console.warn("Music resume failed", e));
        }
    }
  }, [isMuted]);

  // Handle volume changes for music
  useEffect(() => {
    if (currentMusicRef.current) {
        currentMusicRef.current.volume = 0.25 * volume;
    }
  }, [volume]);

  // Handle autoplay policy
  useEffect(() => {
    const handleUserInteraction = () => {
      if (currentMusicRef.current && currentMusicRef.current.paused && !isMuted) {
        currentMusicRef.current.play().catch(e => console.warn("Music resume on interaction failed", e));
      }
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, [isMuted]);

  const value = {
    playSound,
    playMusic,
    isMuted,
    setIsMuted,
    volume,
    setVolume
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};
