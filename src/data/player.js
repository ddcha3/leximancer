// Common elemental tags for the Elementalist
const ELEMENTAL_TAGS = ['fire', 'water', 'ice', 'earth', 'air', 'lightning', 'cold', 'heat', 'storm', 'burn'];

export const LETTER_SCORES = {
  // Common (1 pt)
  A: 1, E: 1, I: 1, O: 1, U: 1, L: 1, N: 1, R: 1, S: 1, T: 1,
  // Medium (2 pts)
  D: 2, G: 2,
  // Rare (3 pts) - Merged Scrabble's 3 & 4 tiers
  B: 3, C: 3, M: 3, P: 3, F: 3, H: 3, V: 3, W: 3, Y: 3,
  // Epic (4 pts) - Merged Scrabble's 5, 8, & 10 tiers
  K: 4, J: 4, X: 4, Q: 4, Z: 4
};

export const CHARACTERS = [
  {
    id: 'conjurer',
    name: 'Conjurer',
    avatar: '🧞',
    desc: 'Nouns deal +2 damage.',
    // HOOK: Modify the calculated stats before damage is dealt
    onCast: (stats, tags, word) => {
      if (tags.includes('noun')) {
        stats.flatBonus += 2;
        stats.logs.push(">(Conjurer) Noun Bonus +2");
      }
      return stats;
    }
  },
  {
    id: 'elementalist',
    name: 'Elementalist',
    avatar: '🧙🏾‍♂️',
    desc: 'Elemental spells deal x2 damage.',
    onCast: (stats, tags, word) => {
      // Check if any tag on the word matches the elemental list
      const isElemental = tags.some(t => ELEMENTAL_TAGS.includes(t));
      if (isElemental) {
        stats.multiplier *= 2;
        stats.logs.push(">(Elementalist) Elemental Mastery x2");
      }
      return stats;
    }
  },
  {
    id: 'duelist',
    name: 'Duelist',
    avatar: '🧙🏻‍♀️',
    desc: 'Short words (≤4) deal +2 damage. No bonus for long words.',
    // HOOK: Override the base power calculation completely
    calculateBasePower: (word) => {
      const upper = word.toUpperCase();
      let score = 0;
      // 1. Standard Letter Scoring
      for (let char of upper) {
        score += LETTER_SCORES[char] || 1;
      }
      
      // 2. Duelist Special: No Ramp, but bonus for short words
      if (upper.length <= 4) {
        score += 2;
      }
      
      return score;
    }
  }
];

export const PLAYER_DEFENSE = {
  weaknesses: {
    "fear": { mult: 1.5, msg: "Your resolve shakes!" },
    "blunt": { mult: 1.2, msg: "Oof! Heavy hit." }
  },
  resistances: {
    "bribe": { mult: 0.0, msg: "You cannot be bought." }
  }
};

export const STARTING_DECK = [
  ..."AAAAAAAAABBCCDDDDEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRSSSSTTTTTTUUUUVVWWXYYZ".split("")
];
