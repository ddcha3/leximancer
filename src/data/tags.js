// src/data/tags.js

export const TAGS = [
  // --- 1. ELEMENTAL ---
  {
    id: 'fire',
    emoji: '🔥',
    target: 'hp',
    desc: 'Heat, burn, lava, ash, flame, scorch, ember',
    sound: 'abilities/fire_a'
  },
  {
    id: 'water',
    emoji: '💧',
    target: 'hp',
    desc: 'Rain, river, soak, flood, liquid, ocean, wave',
    sound: 'misc/drip'
  },
  {
    id: 'ice',
    emoji: '❄️',
    target: 'hp',
    desc: 'Cold, frost, snow, freeze, chill, glacier',
    sound: 'status/freeze'
  },
  {
    id: 'air',
    emoji: '🌪️',
    target: 'hp',
    desc: 'Wind, storm, gust, blow, breeze, tornado',
    sound: 'abilities/woosh_a'
  },
  {
    id: 'earth',
    emoji: '🌍',
    target: 'hp',
    desc: 'Rock, stone, mud, quake, sand, mountain, soil',
    sound: 'impacts/pit_trap_damage'
  },
  {
    id: 'electric',
    emoji: '⚡',
    target: 'hp',
    desc: 'Lightning, spark, shock, volt, energy, zap',
    sound: 'abilities/lightning_a'
  },
  {
    id: 'plant',
    emoji: '🌿',
    target: 'hp',
    desc: 'Leaf, vine, root, wood, tree, flower, seed',
    sound: 'misc/chime'
  },
  {
    id: 'creature',
    emoji: '🐾',
    target: 'hp',
    desc: 'Beast, animal, monster, wild, fauna, critter, unicorn',
    sound: 'creatures/mouse'
  },

  // --- 2. PHYSICAL ---
  {
    id: 'sharp',
    emoji: '🗡️',
    target: 'hp',
    desc: 'Cut, slice, stab, pierce, bleed, sword, blade, bite',
    sound: 'abilities/attack_b'
  },
  {
    id: 'blunt',
    emoji: '👊',
    target: 'hp',
    desc: 'Smash, hit, bash, hammer, crush, force, pound',
    sound: 'impacts/hit'
  },
  {
    id: 'projectile',
    emoji: '🏹',
    target: 'hp',
    desc: 'Throw, shoot, launch, hurl, toss, catapult, sling, bullet, ball, arrow',
    sound: 'impacts/impact_b'
  },
  {
    id: 'heavy',
    emoji: '🪨',
    target: 'hp',
    desc: 'Fall, weight, crush, drop, table, car, sofa',
    sound: 'impacts/pit_trap_damage'
  },

  // --- 3. MENTAL & SOCIAL ---
  {
    id: 'dark',
    emoji: '♠️',
    target: 'wp',
    desc: 'Shadow, curse, void, night, evil, terror, nightmare, scare, ghost, spooky, fear, dread, blind, backstab',
    sound: 'status/curse'
  },
  {
    id: 'taunt',
    emoji: '🤬',
    target: 'wp',
    desc: 'Insult, mock, rude, anger, provoke, profanity, rage',
    sound: 'status/curse'
  },
  {
    id: 'charm',
    emoji: '😍',
    target: 'wp',
    desc: 'Love, cute, attract, seduce, calm, soothe, comfort, peace, praise, friend, gift, give, fluffy, soft',
    sound: 'status/charm'
  },
  {
    id: 'negotiate',
    emoji: '🤝',
    target: 'wp',
    desc: 'Trade, bargain, deal, bribe, diplomacy, agreement, treaty, persuade, money',
    sound: 'status/charm'
  },
  {
    id: 'sorrow',
    emoji: '😢',
    target: 'wp',
    desc: 'Sad, cry, grief, regret, tears, loss, mourn',
    sound: 'status/confuse'
  },
  {
    id: 'loud',
    emoji: '📢',
    target: 'hp',
    desc: 'Loud, scream, noise, shout, thunder, roar, blast',
    sound: 'abilities/bazooka'
  },
  {
    id: 'intelligence',
    emoji: '📚',
    target: 'wp',
    desc: 'Learn, study, book, wisdom, fact, discover, reveal, truth, science, logic, mind, smart, brain, analyze, prepare, magic, arcane',
    sound: 'misc/computer_e'
  },
  {
    id: 'art',
    emoji: '🎨',
    target: 'wp',
    desc: 'Create, draw, paint, music, craft, design, sculpt, profound, expressive, poetry',
    sound: 'misc/computer_a'
  },
  {
    id: 'luck',
    emoji: '🎲',
    target: 'wp',
    desc: 'Chance, gamble, random, fortune, risk, fate',
    sound: 'misc/whistle'
  },

  // --- 4. STATUS & UTILITY ---
  {
    id: 'poison',
    emoji: '☣️',
    target: 'hp',
    desc: 'Venom, disgust, toxic, virus, sick, disease, contaminate, rot, vomit, scum, slime, filth, trash, decay',
    sound: 'status/poison'
  },
  {
    id: 'stun',
    emoji: '😵‍💫',
    target: 'wp',
    desc: 'Stop, paralysis, bind, trap, hold, immobilize, petrify, snared, stuck',
    sound: 'status/mutation'
  },
  {
    id: 'silence',
    emoji: '🔇',
    target: 'wp',
    desc: 'Mute, quiet, hush, soundless, speechless',
    sound: 'status/mutation'
  },
  {
    id: 'chaos',
    emoji: '🌀',
    target: 'wp',
    desc: 'Confuse, illusion, trick, puzzle, dizzy, fake, deceive, disorder, scramble, mirage',
    sound: 'status/confuse'
  },
  {
    id: 'motion',
    emoji: '💨',
    target: 'hp',
    desc: 'Run, flee, speed, fast, travel, dash, escape, movement',
    sound: 'abilities/woosh_b'
  },
  {
    id: 'heal',
    emoji: '💖',
    target: 'hp',
    desc: 'Health, cure, mend, restore, life, potion, recovery',
    sound: 'abilities/heal_a'
  },
  {
    id: 'shield',
    emoji: '🛡️',
    target: 'hp',
    desc: 'Guard, protect, armor, wall, block, defend',
    sound: 'impacts/hit'
  },
  {
    id: 'food',
    emoji: '😋',
    target: 'hp',
    desc: 'Eat, meat, fruit, snack, delicious, meal, feast',
    sound: 'interface/1up_b'
  },
  {
    id: 'lifesteal',
    emoji: '💞',
    target: 'hp',
    desc: 'Drain, absorb, leech, vampire, suck, siphon, blood',
    sound: 'creatures/claw'
  },

  // --- 5. META / SPECIAL ---
  {
    id: 'metal',
    emoji: '⚙️',
    target: 'hp',
    desc: 'Iron, steel, alloy, robot, anvil, forge',
    sound: 'impacts/spike_trap_b'
  },
  {
    id: 'tech',
    emoji: '⚙️',
    target: 'hp',
    desc: 'Computer, machine, tool, gadget, digital, device',
    sound: 'misc/computer_b'
  },
  {
    id: 'holy',
    emoji: '🪬',
    target: 'wp',
    desc: 'Divine, bless, radiant, angel, god, purify, sacred, wash, cleanse',
    sound: 'misc/dong'
  },
  {
    id: 'time',
    emoji: '⏳',
    target: 'wp',
    desc: 'Clock, age, moment, future, past, delay, schedule, eternal, slow',
    sound: 'misc/shriek'
  },
  {
    id: 'space',
    emoji: '🌌',
    target: 'hp',
    desc: 'Galaxy, cosmos, void, distance, dimension, universe, star',
    sound: 'misc/wave'
  },
  {
    id: 'power',
    emoji: '💪',
    target: 'hp',
    desc: 'Strong, buff, might, courage, force, vigor, fortitude',
    sound: 'interface/1up_a'
  },

  // --- 6. FALLBACKS (The Two-Layer Logic) ---
  {
    id: 'concrete',
    emoji: '💥',
    target: 'hp',
    desc: 'Physical Object (Default HP)',
    sound: 'abilities/attack_b'
  },
  {
    id: 'abstract',
    emoji: '✨',
    target: 'wp',
    desc: 'Mental Concept (Default WP)',
    sound: 'impacts/magic_dust_b'
  }
];

// Helper Exports
export const TAG_EMOJIS = Object.fromEntries(TAGS.map(t => [t.id, t.emoji]));
export const TAG_TARGETS = Object.fromEntries(TAGS.map(t => [t.id, t.target]));
export const TAG_SOUNDS = Object.fromEntries(TAGS.map(t => [t.id, t.sound]));