// src/data/tags.js

export const TAGS = [
  // --- 1. ELEMENTAL ---
  {
    id: 'fire',
    emoji: '🔥',
    target: 'hp',
    desc: 'Heat, burn, lava, ash, flame, scorch, ember'
  },
  {
    id: 'water',
    emoji: '💧',
    target: 'hp',
    desc: 'Rain, river, soak, flood, liquid, ocean, wave'
  },
  {
    id: 'ice',
    emoji: '❄️',
    target: 'hp',
    desc: 'Cold, frost, snow, freeze, chill, glacier'
  },
  {
    id: 'air',
    emoji: '💨',
    target: 'hp',
    desc: 'Wind, storm, gust, blow, breeze, tornado'
  },
  {
    id: 'earth',
    emoji: '🪨',
    target: 'hp',
    desc: 'Rock, stone, mud, quake, sand, mountain, soil'
  },
  {
    id: 'electric',
    emoji: '⚡',
    target: 'hp',
    desc: 'Lightning, spark, shock, volt, energy, zap'
  },
  {
    id: 'plant',
    emoji: '🌿',
    target: 'hp',
    desc: 'Leaf, vine, root, wood, tree, flower, seed'
  },
  {
    id: 'creature',
    emoji: '🐾',
    target: 'hp',
    desc: 'Beast, animal, monster, wild, fauna, critter, unicorn'
  },

  // --- 2. PHYSICAL ---
  {
    id: 'sharp',
    emoji: '🗡️',
    target: 'hp',
    desc: 'Cut, slice, stab, pierce, bleed, sword, blade, bite'
  },
  {
    id: 'blunt',
    emoji: '👊',
    target: 'hp',
    desc: 'Smash, hit, bash, hammer, crush, force, pound'
  },
  {
    id: 'projectile',
    emoji: '🏹',
    target: 'hp',
    desc: 'Throw, shoot, launch, hurl, toss, catapult, sling, bullet, ball, arrow'
  },
  {
    id: 'heavy',
    emoji: '🪨',
    target: 'hp',
    desc: 'Fall, weight, crush, drop, table, car, sofa'
  },

  // --- 3. MENTAL & SOCIAL ---
  {
    id: 'dark',
    emoji: '🌑',
    target: 'wp',
    desc: 'Shadow, curse, void, night, evil, terror, nightmare, scare, ghost, spooky, fear, dread, blind, backstab'
  },
  {
    id: 'taunt',
    emoji: '🤬',
    target: 'wp',
    desc: 'Insult, mock, rude, anger, provoke, profanity, rage'
  },
  {
    id: 'charm',
    emoji: '😍',
    target: 'wp',
    desc: 'Love, cute, attract, seduce, calm, soothe, comfort, peace, praise, friend, gift, give, fluffy, soft'
  },
  {
    id: 'negotiate',
    emoji: '🤝',
    target: 'wp',
    desc: 'Trade, bargain, deal, bribe, diplomacy, agreement, treaty, persuade, money'
  },
  {
    id: 'sorrow',
    emoji: '😢',
    target: 'wp',
    desc: 'Sad, cry, grief, regret, tears, loss, mourn'
  },
  {
    id: 'loud',
    emoji: '📢',
    target: 'wp',
    desc: 'Loud, scream, noise, shout, thunder, roar, blast'
  },
  {
    id: 'intelligence',
    emoji: '📚',
    target: 'wp',
    desc: 'Learn, study, book, wisdom, fact, discover, reveal, truth, science, logic, mind, smart, brain, analyze, prepare, magic, arcane'
  },
  {
    id: 'art',
    emoji: '🎨',
    target: 'wp',
    desc: 'Create, draw, paint, music, craft, design, sculpt, profound, expressive, poetry'
  },
  {
    id: 'luck',
    emoji: '🎲',
    target: 'wp',
    desc: 'Chance, gamble, random, fortune, risk, fate'
  },

  // --- 4. STATUS & UTILITY ---
  {
    id: 'poison',
    emoji: '☣️',
    target: 'hp',
    desc: 'Venom, disgust, toxic, virus, sick, disease, contaminate, rot, vomit, scum, slime, filth, trash, decay'
  },
  {
    id: 'stun',
    emoji: '😵‍💫',
    target: 'wp',
    desc: 'Stop, paralysis, bind, trap, hold, immobilize, petrify, snared, stuck'
  },
  {
    id: 'silence',
    emoji: '🔇',
    target: 'wp',
    desc: 'Mute, quiet, hush, soundless, speechless'
  },
  {
    id: 'chaos',
    emoji: '🌀',
    target: 'wp',
    desc: 'Confuse, illusion, trick, puzzle, dizzy, fake, deceive, disorder, scramble, mirage'
  },
  {
    id: 'motion',
    emoji: '🏃',
    target: 'wp',
    desc: 'Run, flee, speed, fast, travel, dash, escape, movement'
  },
  {
    id: 'heal',
    emoji: '💖',
    target: 'hp',
    desc: 'Health, cure, mend, restore, life, potion, recovery'
  },
  {
    id: 'shield',
    emoji: '🛡️',
    target: 'hp',
    desc: 'Guard, protect, armor, wall, block, defend'
  },
  {
    id: 'food',
    emoji: '😋',
    target: 'hp',
    desc: 'Eat, meat, fruit, snack, delicious, meal, feast'
  },
  {
    id: 'lifesteal',
    emoji: '💞',
    target: 'hp',
    desc: 'Drain, absorb, leech, vampire, suck, siphon, blood'
  },

  // --- 5. META / SPECIAL ---
  {
    id: 'metal',
    emoji: '⚙️',
    target: 'hp',
    desc: 'Iron, steel, alloy, robot, anvil, forge'
  },
  {
    id: 'tech',
    emoji: '⚙️',
    target: 'hp',
    desc: 'Computer, machine, tool, gadget, digital, device'
  },
  {
    id: 'holy',
    emoji: '😇',
    target: 'wp',
    desc: 'Divine, bless, radiant, angel, god, purify, sacred, wash, cleanse'
  },
  {
    id: 'time',
    emoji: '⏰',
    target: 'wp',
    desc: 'Clock, age, moment, future, past, delay, schedule, eternal, slow'
  },
  {
    id: 'space',
    emoji: '🌌',
    target: 'wp',
    desc: 'Galaxy, cosmos, void, distance, dimension, universe, star'
  },
  {
    id: 'power',
    emoji: '💪',
    target: 'wp',
    desc: 'Strong, buff, might, courage, force, vigor, fortitude'
  },

  // --- 6. FALLBACKS (The Two-Layer Logic) ---
  {
    id: 'concrete',
    emoji: '💥',
    target: 'hp',
    desc: 'Physical Object (Default HP)'
  },
  {
    id: 'abstract',
    emoji: '✨',
    target: 'wp',
    desc: 'Mental Concept (Default WP)'
  }
];

// Helper Exports
export const TAG_EMOJIS = Object.fromEntries(TAGS.map(t => [t.id, t.emoji]));
export const TAG_TARGETS = Object.fromEntries(TAGS.map(t => [t.id, t.target]));