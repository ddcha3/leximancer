import React, { useState, useEffect } from 'react';

const PixelEmoji = ({ icon, size = "1.5rem", className = "" }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [hasError, setHasError] = useState(false);

  // Helper: Convert emoji string to hex sequence (e.g. "1F600" or "1F9D9_200D_2642")
  const getHexSequence = (str) => {
    if (!str) return "";
    const hexList = [];
    for (const char of str) {
      hexList.push(char.codePointAt(0).toString(16).toUpperCase());
    }
    return hexList.join('_');
  };

  useEffect(() => {
    if (!icon) return;

    const hex = getHexSequence(icon);
    setImgSrc(`public/emojis/${hex}.png`);
    setHasError(false);
  }, [icon]);

  const handleError = () => {
    if (!imgSrc) return;


    if (imgSrc.includes('_FE0F')) {
      const strippedSrc = imgSrc.replace(/_FE0F/g, '');
      if (strippedSrc !== imgSrc) {
        setImgSrc(strippedSrc);
        return;
      }
    }
    setHasError(true);
  };

  if (hasError || !icon) {
    return (
      <span 
        style={{ fontSize: size, lineHeight: 1 }} 
        className={className} 
        role="img" 
        aria-label={icon}
      >
        {icon}
      </span>
    );
  }

  return (
    <img 
      src={imgSrc}
      alt={icon}
      onError={handleError}
      className={`pixel-emoji ${className}`}
      style={{ 
        width: size, 
        height: size, 
        imageRendering: "pixelated", 
        verticalAlign: "middle",
        display: "inline-block"
      }} 
    />
  );
};

export default PixelEmoji;