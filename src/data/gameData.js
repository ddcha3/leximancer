// src/gameData.js

export const WIZARDS = ["🧙‍♂️", "🧙‍♀️", "🧙", "🧙🏿‍♂️", "🧙🏻‍♀️"];

export const STARTING_DECK = [
  ..."AAAAAAAAABBCCDDDDEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRSSSSTTTTTTUUUUVVWWXYYZ".split("")
];

export const PLAYER_DEFENSE = {
  weaknesses: {
    "fear": { mult: 1.5, msg: "You flinch!" },
    "blunt": { mult: 1.2, msg: "Oof! Heavy hit." } // Wizards are squishy
  },
  resistances: {
    "bribe": { mult: 0.0, msg: "You cannot be bought." }, // Immune to bribery
    "emotion": { mult: 0.8, msg: "You stay focused." }
  }
};

// --- The Bestiary (Enemies) ---
// HP = Physical Health, WP = Willpower (Mental Health)
export const ENCOUNTERS = [
  {
    id: "rat",
    name: "Dirty Rat",
    emoji: "🐀",
    level: 1,
    hp: 5,
    wp: 3,
    desc: "A dirty rat.",
    vocabulary: ["BITE", "SCRATCH", "RUN", "SQUEAK", "FLEE"],
    weaknesses: {},
    resistances: {}
  },
  {
    id: "goblin",
    name: "Sniveling Goblin",
    emoji: "👺",
    level: 2,
    hp: 20,
    wp: 10,
    desc: "A small, greedy creature.",
    vocabulary: ["BITE", "SCRATCH", "GREED", "COIN", "RUN"],
    weaknesses: {
      "bribe": { mult: 2.0, target: "wp", msg: "It grabs the coin!" },
      "fear": { mult: 1.5, target: "wp", msg: "It cowers!" }
    },
    resistances: {}
  },
  {
    id: "treant",
    name: "Old Treant",
    emoji: "🌳",
    level: 3,
    hp: 50,
    wp: 100,
    desc: "Made of wood. Hates fire.",
    vocabulary: ["ROOT", "BRANCH", "CRUSH", "GROW", "LEAF"],
    weaknesses: {
      "fire": { mult: 2.5, target: "hp", msg: "It catches fire!" },
      "blade": { mult: 1.2, target: "hp", msg: "Timber!" }
    },
    resistances: {
      "water": { mult: -0.5, target: "hp", msg: "It heals from the water." },
      "bribe": { mult: 0.0, target: "wp", msg: "It has no need for wealth." }
    }
  },
  {
    id: "golem",
    name: "Iron Golem",
    emoji: "🤖",
    level: 5,
    hp: 80,
    wp: 40,
    desc: "A magical construct.",
    vocabulary: ["SMASH", "IRON", "METAL", "STOMP", "GUARD"],
    weaknesses: {
      "water": { mult: 1.5, target: "hp", msg: "Rust forms instantly." },
      "lightning": { mult: 2.0, target: "hp", msg: "Circuits overloaded!" }
    },
    resistances: {
      "blade": { mult: 0.1, target: "hp", msg: "Clang! No effect." },
      "poison": { mult: 0.0, target: "hp", msg: "It has no veins." }
    }
  }
];

// --- The Magic Dictionary ---
// If a word isn't here, it deals 1 damage per letter (Physical).
// If it is here, it adds tags and power.
export const SPELLBOOK = {
  // Fire
  "FIRE": { tags: ["fire"], power: 4 },
  "BURN": { tags: ["fire"], power: 4 },
  "FLAME": { tags: ["fire", "light"], power: 5 },
  "ASH": { tags: ["fire"], power: 3 },
  "INFERNO": { tags: ["fire", "destruction"], power: 10 },
  
  // Water/Ice
  "WATER": { tags: ["water"], power: 5 },
  "ICE": { tags: ["water", "cold"], power: 3 },
  "RAIN": { tags: ["water"], power: 4 },
  
  // Combat
  "SWORD": { tags: ["blade"], power: 5 },
  "AXE": { tags: ["blade"], power: 3 },
  "CUT": { tags: ["blade"], power: 3 },
  "PUNCH": { tags: ["blunt"], power: 4 },
  
  // Social / Mental
  "GOLD": { tags: ["bribe"], power: 4 },
  "COIN": { tags: ["bribe"], power: 4 },
  "PAY": { tags: ["bribe"], power: 3 },
  "BUY": { tags: ["bribe"], power: 3 },
  "LOVE": { tags: ["emotion"], power: 8 },
  "HATE": { tags: ["emotion"], power: 6 },
  "BOO": { tags: ["fear"], power: 2 },
  "GHOST": { tags: ["fear", "undead"], power: 5 },
  
  // Elements
  "WIND": { tags: ["air"], power: 4 },
  "ROCK": { tags: ["earth"], power: 4 },

  // Enemy attacks
  "BITE": { tags: ["physical", "blade"], power: 4 },
  "SCRATCH": { tags: ["physical", "blade"], power: 3 },
  "GREED": { tags: ["sin"], power: 5 },
  "RUN": { tags: ["motion"], power: 2 },
  
  "ROOT": { tags: ["plant", "earth"], power: 5 },
  "BRANCH": { tags: ["plant", "blunt"], power: 4 },
  "CRUSH": { tags: ["blunt"], power: 6 },
  "GROW": { tags: ["plant", "heal"], power: 3 }, // Could add healing logic later
  
  "SMASH": { tags: ["blunt", "force"], power: 7 },
  "IRON": { tags: ["metal"], power: 4 },
  "STOMP": { tags: ["blunt", "earth"], power: 6 },
};

export const TAG_EMOJIS = {
  fire: "🔥",
  heat: "🔥",
  water: "💧",
  ice: "❄️",
  cold: "❄️",
  blade: "⚔️",
  axe: "🪓",
  blunt: "🔨",
  bribe: "💰",
  fear: "💀",
  undead: "👻",
  light: "✨",
  plant: "🌿",
  wood: "🪵",
  lightning: "⚡",
  air: "💨",
  earth: "🪨",
  physical: "👊",
  plant: "🌿",
  metal: "⚙️"
};