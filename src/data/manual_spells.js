const manualSpells = {};
const register = (words, tags) => {
  words.forEach(word => {
    manualSpells[word] = tags;
  });
};

// --- OVERRIDES ---
register(
  ['NYUM', 'BRO', 'SUP', 'HUH', 'UWU', 'UGUU', 'KAWAII'],
  ['charm']
);

register(
  ['DOMINUS'],
  ['creature', 'power']
);

export const CUSTOM_SPELLS = manualSpells;