const manualSpells = {};
const register = (words, tags) => {
  words.forEach(word => {
    manualSpells[word] = tags;
  });
};

// --- OVERRIDES ---

export const CUSTOM_SPELLS = manualSpells;