import React, { useState, useEffect } from 'react';
import spriteData from '../data/emoji-map.json'; 

const PixelEmoji = ({ icon, size = "1.5rem", className = "", style = {} }) => {
  const getHexSequence = (str) => {
    if (!str) return "";
    const hexList = [];
    for (const char of str) {
      hexList.push(char.codePointAt(0).toString(16).toUpperCase());
    }
    return hexList.join('_');
  };

  const hex = getHexSequence(icon);
  const coords = spriteData.map[hex];

  if (!coords) {
    return (
      <span style={{ fontSize: size, lineHeight: 1, ...style }} className={className}>
        {icon}
      </span>
    );
  }


  const bgSize = `${spriteData.cols * 100}%`;
  const xPos = (coords.x / ( (spriteData.cols * spriteData.spriteSize) - spriteData.spriteSize )) * 100;
  const yPos = (coords.y / ( (spriteData.rows * spriteData.spriteSize) - spriteData.spriteSize )) * 100;

  return (
    <div 
      className={`pixel-emoji ${className}`}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        imageRendering: 'pixelated',
        
        backgroundImage: 'url(/leximancer/public/emoji-sheet.png)',
        backgroundSize: bgSize,
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