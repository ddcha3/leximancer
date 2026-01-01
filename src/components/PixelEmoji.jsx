import React from 'react';
import spriteData from '../data/emoji-map.json'; 

const PixelEmoji = ({ icon, size = "1rem", className = "", style = {} }) => {
  
  const getHexSequence = (str) => {
    if (!str) return "";
    const hexList = [];
    for (const char of str) {
      const code = char.codePointAt(0).toString(16).toUpperCase();
      if (code !== 'FE0F') {
        hexList.push(code);
      }
    }
    return hexList.join('_');
  };

  const hex = getHexSequence(icon);
  const coords = spriteData.map[hex];

  // Fallback if not found
  if (!coords) {
    return (
      <span style={{ fontSize: size, lineHeight: 1, ...style }} className={className}>
        {icon}
      </span>
    );
  }

  const bgWidth = (spriteData.sheetWidth / spriteData.spriteSize) * 100;
  const bgHeight = (spriteData.sheetHeight / spriteData.spriteSize) * 100;

  const xDenom = spriteData.sheetWidth - spriteData.spriteSize;
  const yDenom = spriteData.sheetHeight - spriteData.spriteSize;

  const xPos = xDenom > 0 ? (coords.x / xDenom) * 100 : 0;
  const yPos = yDenom > 0 ? (coords.y / yDenom) * 100 : 0;

  const sheetUrl = `${import.meta.env.BASE_URL}emoji-sheet.png`;

  return (
    <div 
      className={`pixel-emoji ${className}`}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        imageRendering: 'pixelated',
        
        backgroundImage: `url(${sheetUrl})`,
        backgroundSize: `${bgWidth}% ${bgHeight}%`,
        backgroundPosition: `${xPos}% ${yPos}%`,
        backgroundRepeat: 'no-repeat',
        
        verticalAlign: 'middle',
        position: 'relative',
        ...style
      }}
      role="img"
      aria-label={icon}
    />
  );
};

export default PixelEmoji;