// Base enemies (single-word names). Affixes can be applied to these.
const BASES = {
  1: [
    {
      id: 'rat',
      name: 'rat',
      emoji: '🐀',
      level: 1,
      hp: 15,
      wp: 10,
      vocabulary: ['BITE', 'GNAW', 'CHEW', 'RAT', 'CHIT', 'EEK', 'TOE'],
      weaknesses: ['earth', 'heavy', 'electric'],
      resistances: ['poison']
    },
    {
      id: 'roach',
      name: 'roach',
      emoji: '🪳',
      level: 1,
      hp: 12,
      wp: 12,
      vocabulary: ['BUG', 'HOLE', "ROOM", "ANT", "RUG"],
      weaknesses: ['holy', 'blunt'],
      immunities: [],
      resistances: []
    },
    {
      id: 'snail',
      name: 'snail',
      emoji: '🐌',
      level: 1,
      hp: 18,
      wp: 8,
      vocabulary: ['SLIME', 'SHELL', 'CREEP', 'SNAIL'],
      weaknesses: ['heavy', 'blunt'],
      resistances: ['poison']
    },
    {
      id: 'crab',
      name: 'crab',
      emoji: '🦀',
      level: 1,
      hp: 20,
      wp: 10,
      vocabulary: ['CLAW', 'SAND', 'SHELL'],
      weaknesses: ['charm', 'heavy', 'chaos'],
      resistances: []
    }
  ],

  2: [
    {
      id: 'warbler',
      name: 'warbler',
      emoji: '🐦',
      level: 2,
      hp: 22,
      wp: 15,
      vocabulary: ['CHIRP', 'PECK', 'FLY', 'NEST', 'WING'],
      weaknesses: ['loud', 'electric'],
      resistances: ['air']
    },
    {
      id: 'snek',
      name: 'snek',
      emoji: '🐍',
      level: 2,
      hp: 24,
      wp: 16,
      vocabulary: ['BITE', 'HISS', 'SNEK', 'COIL', 'STRIKE'],
      weaknesses: ['earth', 'dark'],
      resistances: ['poison']
    },
    {
      id: 'kitty',
      name: 'kitty',
      emoji: '🐈',
      level: 2,
      hp: 20,
      wp: 20,
      vocabulary: ['MEOW', 'SCRATCH', 'PURR', 'LEAP', 'CLAW', 'STALK'],
      weaknesses: ['loud', 'charm'],
      resistances: []
    },
    {
      id: 'pup',
      name: 'pup',
      emoji: '🐕',
      level: 2,
      hp: 25,
      wp: 15,
      vocabulary: ['BARK', 'GROWL', 'FETCH', 'SNARL', 'HOWL', 'CHASE'],
      weaknesses: ['taunt', 'chaos', 'charm'],
      resistances: []
    }
  ],

  3: [
    {
      id: 'pumpkin',
      name: 'pumpkin',
      emoji: '🎃',
      level: 3,
      hp: 30,
      wp: 45,
      vocabulary: ['ROLL', 'ROLLING', 'SMASH', 'ORANGE', 'LANTERN', 'VEGETATIVE'],
      weaknesses: ['sharp', 'fire', 'ice'],
      resistances: ['dark']
    },
    {
      id: 'goblin',
      name: 'goblin',
      emoji: '👺',
      level: 3,
      hp: 35,
      wp: 25,
      vocabulary: ['RUN', 'SHIELD', 'GUARD', 'STAB', 'STEAL', 'SHOUT', 'BACKSTAB', 'SNEAK', 'MURDEROUS'],
      weaknesses: ['negotiatie', 'taunt', 'charm'],
      resistances: ['dark']
    },
    {
      id: 'ape',
      name: 'ape',
      emoji: '🦍',
      level: 3,
      hp: 40,
      wp: 20,
      vocabulary: ['HIT', 'BITE', 'THUMP', 'SMASH', 'BEAT', 'ROAR', 'POUND', 'PRIMATE'],
      weaknesses: ['sharp', 'taunt', 'tech'],
      resistances: ['blunt']
    },
    {
      id: 'owl',
      name: 'owl',
      emoji: '🦉',
      level: 3,
      hp: 30,
      wp: 45,
      vocabulary: ['HOOT', 'FLY', 'STARE', 'NIGHT', 'WISE', 'SILENT'],
      weaknesses: ['loud', 'electric', 'intelligence'],
      resistances: ['dark', 'air']
    }
  ],

  4: [
    {
      id: 'jester',
      name: 'jester',
      emoji: '🤡',
      level: 4,
      hp: 50,
      wp: 40,
      vocabulary: ['LAUGH', 'DANCE', 'HEY', 'SUP', 'JEST', 'GUFFAW', 'LAUGHING', 'PANDEMONIUM'],
      weaknesses: ['taunt', 'blunt', 'sharp'],
      resistances: ['negotiate']
    },
    {
      id: 'alien',
      name: 'alien',
      emoji: '👽',
      level: 4,
      hp: 40,
      wp: 55,
      vocabulary: ['NYUM', 'ZAP', 'PROBE', 'HUM', 'FLOAT', 'EXTRATERRESTRIAL'],
      weaknesses: ['intelligence', 'poison', 'charm', 'negotiate'],
      resistances: ['chaos', 'tech']
    },
    {
      id: 'zombie',
      name: 'zombie',
      emoji: '🧟',
      level: 4,
      hp: 55,
      wp: 35,
      vocabulary: ['CHEW', 'BITE', 'MUNCH', 'SHAMBLE', 'MOAN', 'LURCH', 'UNDEAD'],
      weaknesses: ['fire', 'holy', 'sharp', 'blunt'],
      resistances: ['dark']
    }
  ],

  5: [
    {
      id: 'troll',
      name: 'troll',
      emoji: '🧌',
      level: 5,
      hp: 140,
      wp: 40,
      vocabulary: ['SMASH', 'THUMP', 'ROAR', 'CRUSH', 'TROLLING', 'GRUMBLE'],
      weaknesses: ['taunt','intelligence','charm'],
      resistances: ['blunt','earth']
    },
    {
      id: 'camel',
      name: 'camel',
      emoji: '🐫',
      level: 5,
      hp: 90,
      wp: 80,
      vocabulary: ['MASTICATE', 'TRUDGING', 'REGURGITATE', 'MIRAGE'],
      weaknesses: ['ice', 'sharp'],
      resistances: ['earth']
    },
    {
      id: 'croc',
      name: 'croc',
      emoji: '🐊',
      level: 5,
      hp: 100,
      wp: 60,
      vocabulary: ['SNAP', 'BITE', 'AMBUSH', 'SCALE', 'SUBMERGE'],
      weaknesses: ['fire','ice','tech'],
      resistances: ['sharp']
    }
  ],

  6: [
    {
      id: 'drake',
      name: 'drake',
      emoji: '🐉',
      level: 6,
      hp: 200,
      wp: 100,
      vocabulary: ['FLAME', 'SOAR', 'ROAR', 'SCALE', 'INFERNO', 'DRACONIC', 'DIVINITY', 'ANCIENT'],
      weaknesses: ['ice','holy','electric'],
      resistances: ['earth']
    },
    {
      id: 'vampire',
      name: 'vampire',
      emoji: '🧛',
      level: 6,
      hp: 160,
      wp: 140,
      vocabulary: ['BLOOD', 'NIGHT', 'SIP', 'TRANSFORM', 'HYPNOTIZE', 'UNDEAD', 'ETERNAL'],
      weaknesses: ['sharp','holy','negotiate'],
      resistances: ['dark','charm']
    },
    {
      id: 'phoenix',
      name: 'phoenix',
      emoji: '🦚',
      level: 6,
      hp: 180,
      wp: 120,
      vocabulary: ['REBIRTH', 'FLAME', 'SOAR', 'BURST', 'IMMORTAL', 'INFERNO', 'MYTHICAL'],
      weaknesses: ['water','electric','dark'],
      resistances: ['air']
    }
  ],

  7: [
    {
      id: 'leximancer',
      name: 'leximancer',
      emoji: '🧙🏻‍♂️',
      level: 7,
      hp: 300,
      wp: 200,
      vocabulary: ['WORDSMITH', 'INCANTATION', 'ENCHANTMENT', 'LEXICON', 'OMNISCIENT', 'SOLILOQUY', 'SPELLCRAFT', 'ARTICULATE'],
      weaknesses: ['tech','holy','intelligence'],
      resistances: ['chaos','dark','negotiate']
    }
  ]
};

// Affixes add vocabulary and can add weaknesses/resistances
const AFFIXES = [
  {
    id: 'ember',
    name: 'ember',
    emoji: '🔥',
    vocabByLevel: {
      1: ['BURN', 'ASH'],
      2: ['BURN', 'EMBER'],
      3: ['BLAZE', 'EMBER', 'INFERNO'],
      4: ['INCENDIO', 'CONFLARE'],
      5: ['CONFLAGRATE', 'INCINERATE'],
      6: ['IMMOLATION', 'PYROCLASM'],
      7: []
    },
    weaknesses: ['water'],
    resistances: [],
    immunities: ['fire']
  },
  {
    id: 'water',
    name: 'water',
    emoji: '💧',
    vocabByLevel: {
      1: ['SPLASH', 'DRIP'],
      2: ['SPLASH', 'DRENCH'],
      3: ['WAVE', 'SURGE'],
      4: ['TSUNAMI'],
      5: ['DELUGE', 'MONSOON'],
      6: ['AQUATIC'],
      7: []
    },
    weaknesses: ['ice'],
    resistances: [],
    immunities: ['water']
  },
  {
    id: 'wind',
    name: 'wind',
    emoji: '💨',
    vocabByLevel: {
      1: ['GUST'],
      2: ['GUST', 'BREEZE'],
      3: ['WHIRL', 'TORNADO'],
      4: ['CYCLONE'],
      5: ['TEMPEST'],
      6: ['WHIRLWIND'],
      7: []
    },
    weaknesses: [],
    resistances: ['air']
  },
  {
    id: 'dark',
    name: 'dark',
    emoji: '🌑',
    vocabByLevel: {
      1: ['HEX'],
      2: ['HEX', 'SHADOW'],
      3: ['CURSE', 'NOCTURNAL'],
      4: ['OBLIVION'],
      5: ['DARKNESS'],
      6: ['NIGHTMARE'],
      7: []
    },
    weaknesses: ['holy'],
    resistances: [],
    immunities: ['dark']
  },
  {
    id: 'lightning',
    name: 'lightning',
    emoji: '⚡',
    vocabByLevel: {
      1: ['ZAP'],
      2: ['SPARK'],
      3: ['SHOCK', 'CHAIN'],
      4: ['STORMY'],
      5: ['THUNDERCLAP'],
      6: ['ELECTRICAL'],
      7: []
    },
    weaknesses: ['earth'],
    resistances: [],
    immunities: ['electric']
  },
  {
    id: 'verdant',
    name: 'verdant',
    emoji: '🍃',
    vocabByLevel: {
      1: ['GROW', 'SAP'],
      2: ['SPROUT'],
      3: ['ENTANGLE', 'VINE'],
      4: ['OVERGROWTH'],
      5: ['FORESTCALL'],
      6: ['VERDANT'],
      7: []
    },
    weaknesses: ['fire'],
    resistances: ['earth']
  },
  {
    id: 'stone',
    name: 'stone',
    emoji: '🪨',
    vocabByLevel: {
      1: ['CRUSH'],
      2: ['BOULDER'],
      3: ['QUAKE', 'RUPTURE'],
      4: ['LANDSLIDE'],
      5: ['CATACLYSM'],
      6: ['EARTHQUAKE'],
      7: []
    },
    weaknesses: ['ice'],
    resistances: [],
    immunities: ['earth']
  },
  {
    id: 'archer',
    name: 'archer',
    emoji: '🏹',
    vocabByLevel: {
      1: ['AIM'],
      2: ['ARROW'],
      3: ['BOLT', 'SNIPER'],
      4: ['VOLLEY'],
      5: ['CROSSBOW'],
      6: ['LACERATION'],
      7: []
    },
    weaknesses: ['blunt'],
    resistances: ['sharp']
  },
  {
    id: 'toxic',
    name: 'toxic',
    emoji: '☣️',
    vocabByLevel: {
      1: ['ROT'],
      2: ['FUMES', 'ROT'],
      3: ['TOXIC', 'POISON'],
      4: ['VENOMOUS'],
      5: ['ROTTENBITE'],
      6: ['CONTAMINATE'],
      7: []
    },
    weaknesses: ['earth'],
    resistances: [],
    immunities: ['poison']
  },
  {
    id: 'cute',
    name: 'cute',
    emoji: '💕',
    vocabByLevel: {
      1: ['KISS'],
      2: ['CUDDLE', 'KISS'],
      3: ['HUG', 'CHARM'],
      4: ['ADORABLE'],
      5: ['ENDEARING'],
      6: ['IRRESISTIBLE'],
      7: []
    },
    weaknesses: ['taunt'],
    resistances: ['charm']
  },
  {
    id: 'cold',
    name: 'cold',
    emoji: '❄️',
    vocabByLevel: {
      1: ['ICE'],
      2: ['ICE', 'FROST'],
      3: ['COLD', 'BLIZZARD'],
      4: ['SNOWSTORM'],
      5: ['HAILSTORM'], 
      6: ['FROSTBITE'],
      7: []
    },
    weaknesses: ['fire'],
    resistances: [],
    immunities: ['ice']
  }
];

export const MAX_STAGE = 7;

// Create a new enemy instance by combining a base (by level) and a random affix
export function createEnemy(stageIndex) {
  const level = Math.min(7, stageIndex + 1);
  const bases = BASES[level] || BASES[7];
  const base = bases[Math.floor(Math.random() * bases.length)];

  // 25% chance to spawn without an affix
  const useAffix = Math.random() >= 0.25;
  const affix = useAffix ? AFFIXES[Math.floor(Math.random() * AFFIXES.length)] : null;

  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
  const id = affix ? `${base.id}_${affix.id}` : base.id;
  const name = affix ? `${capitalize(affix.name)} ${capitalize(base.name)}` : capitalize(base.name);
  const emoji = affix ? `${base.emoji}${affix.emoji ? affix.emoji : ''}` : base.emoji;

  // Merge vocabulary and tags; choose affix vocab based on base level (longer words for higher levels)
  let affixVocab = [];
  if (affix) {
    if (affix.vocabByLevel) {
      affixVocab = affix.vocabByLevel[base.level] || affix.vocabByLevel[5] || [];
    } else {
      affixVocab = affix.vocab || [];
    }
  }
  const vocabulary = Array.from(new Set([...(base.vocabulary || []), ...affixVocab]));

  // Merge weaknesses and resistances (affix overrides base where specified)
  const weaknesses = Array.from(new Set([...(base.weaknesses || []), ...(affix && affix.weaknesses ? affix.weaknesses : [])]));
  const resistances = Array.from(new Set([...(base.resistances || []), ...(affix && affix.resistances ? affix.resistances : [])]));
  const immunities = Array.from(new Set([...(base.immunities || []), ...(affix && affix.immunities ? affix.immunities : [])]));

  return {
    id,
    name,
    emoji,
    level: base.level,
    hp: base.hp,
    wp: base.wp,
    vocabulary,
    weaknesses,
    resistances,
    immunities
  };
}