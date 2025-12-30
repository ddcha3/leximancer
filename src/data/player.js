// Common elemental tags for the Elementalist
const ELEMENTAL_TAGS = ['fire', 'water', 'ice', 'earth', 'air', 'lightning'];

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
    avatar: '🧙🏿‍♂️',
    desc: 'Summon familiars to aid in battle.',
    starting_items: []
  },
  {
    id: 'elementalist',
    name: 'Elementalist',
    avatar: '🧘🏻‍♂️',
    desc: 'Elemental spells deal double damage.',
    onCast: (stats, tags, word) => {
      // Check if any tag on the word matches the elemental list
      const isElemental = tags.some(t => ELEMENTAL_TAGS.includes(t));
      if (isElemental) {
        stats.multiplier *= 2;
        stats.logs.push(">(Elementalist) Elemental Mastery x2");
      }
      return stats;
    },
    starting_items: []
  },
  {
    id: 'seer',
    name: 'Seer',
    avatar: '🧙‍♀️',
    desc: 'Knows enemy weaknesses. +3 damage when exploiting them.',
    starting_items: ['crystal_ball'],
  }
];

export const PLAYER_DEFENSE = {
  weaknesses: [],
  resistances: []
};

export const STARTING_DECK = [
  ..."AAAAAAAAABBCCDDDDEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRSSSSTTTTTTUUUUVVWWXYYZ".split("")
];
