// src/gameData.js

// --- 1. The Player Archetypes ---
export const WIZARDS = ["🧙‍♂️", "🧙‍♀️", "🧙", "🧙🏿‍♂️", "🧙🏻‍♀️"];

// --- 2. The Letter Bag (Simplified Scrabble Distribution) ---
export const STARTING_DECK = [
  ..."AAAAAAAAABBCCDDDDEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRSSSSTTTTTTUUUUVVWWXYYZ".split("")
];

// --- 3. The Bestiary (Enemies) ---
// HP = Physical Health, WP = Willpower (Mental Health)
export const ENCOUNTERS = [
  {
    id: "goblin",
    name: "Sniveling Goblin",
    emoji: "👺",
    level: 1, // New
    hp: 20,
    wp: 10,
    desc: "A small, greedy creature. Loves gold, fears bigger things.",
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
    level: 3, // New
    hp: 50,
    wp: 100,
    desc: "Made of wood. Hates fire. Doesn't care about money.",
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
    level: 5, // New
    hp: 80,
    wp: 40,
    desc: "A magical construct. Immune to blades.",
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

// --- 4. The Magic Dictionary ---
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
};