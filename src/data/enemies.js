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
      vocabulary: ['BITE', 'TAIL', 'EAT', 'RAT', 'EEK', 'TOE', 'RUN'],
      weaknesses: ['heavy', 'electric', 'poison'],
      resistances: []
    },
    {
      id: 'roach',
      name: 'roach',
      emoji: '🪳',
      level: 1,
      hp: 10,
      wp: 15,
      vocabulary: ['BUG', 'HOLE', "ROOM", "ANT", "RUG", "TAP"],
      weaknesses: ['heavy', 'blunt'],
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
      vocabulary: ['SLIME', 'SHELL', 'CREEP', 'SNAIL', 'DEFEND', 'BLOCK', 'SLOW'],
      weaknesses: ['heavy', 'blunt'],
      resistances: []
    },
    {
      id: 'crab',
      name: 'crab',
      emoji: '🦀',
      level: 1,
      hp: 20,
      wp: 5,
      vocabulary: ['CLAW', 'SAND', 'SHELL', 'SIDE', 'TAP'],
      weaknesses: [],
      resistances: ['water']
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
      weaknesses: [],
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
      weaknesses: ['loud'],
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
      weaknesses: ['taunt', 'charm'],
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
      weaknesses: ['sharp', 'fire'],
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
      weaknesses: ['negotiate', 'taunt', 'charm'],
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
      vocabulary: ['MASTICATE', 'TRUDGING', 'REGURGITATE', 'MIRAGE', 'HUMP', 'CARAVAN'],
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
      vocabulary: ['SNAP', 'BITE', 'AMBUSH', 'SCALE', 'SUBMERGE', 'REPTILE'],
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
      emoji: '🧑‍⚖️',
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
      emoji: '🧙‍♂️',
      level: 7,
      hp: 300,
      wp: 200,
      vocabulary: ['WORDSMITH', 'INCANTATION', 'ENCHANTMENT', 'LEXICON', 'OMNISCIENT', 'SOLILOQUY', 'SPELLCRAFT', 'ARTICULATE', 'DIVINATION', 'DICTIONARY', 'INTELLECT'],
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
      2: ['BURN', 'EMBER', 'FIRE'],
      3: ['BLAZE', 'EMBER', 'INFERNO', 'SCORCH'],
      4: ['INCENDIARY', 'CONFLARE', 'FLAMING'],
      5: ['CONFLAGRATE', 'INCINERATE', 'FIRESTORM'],
      6: ['IMMOLATION', 'PYROCLASM', 'FLAMETHROWER'],
      7: []
    },
    weaknesses: ['water'],
    resistances: ['fire'],
    immunities: []
  },
  {
    id: 'water',
    name: 'water',
    emoji: '💧',
    vocabByLevel: {
      1: ['WET', 'DRIP'],
      2: ['WATER', 'FLOOD'],
      3: ['WAVES', 'SPLASH', 'RIPPLE'],
      4: ['TSUNAMI', 'CASCADING', 'DROWNING'],
      5: ['DELUGE', 'MONSOON', 'DRENCHED', 'FLOODING'],
      6: ['AQUATIC', 'SUBMERGED', 'UNDERWATER', 'WATERLOGGED'],
      7: []
    },
    weaknesses: ['electric'],
    resistances: ['water'],
    immunities: []
  },
  {
    id: 'wind',
    name: 'wind',
    emoji: '💨',
    vocabByLevel: {
      1: ['AIR', "GALE"],
      2: ['GUST', 'BLOW', ],
      3: ['WHIRL', 'TORNADO'],
      4: ['CYCLONE', 'TEMPEST'],
      5: ['HURRICANE', 'STORMCALL'],
      6: ['WHIRLWIND', 'ZEPHYRS', 'AERODYNAMIC'],
      7: []
    },
    weaknesses: [],
    resistances: ['air']
  },
  {
    id: 'dark',
    name: 'dark',
    emoji: '♠️',
    vocabByLevel: {
      1: ['DUSK'],
      2: ['HEX', 'VOID', 'DARK'],
      3: ['CURSE', 'NOCTURNAL', 'SHADOW'],
      4: ['DARKNESS', 'GLOOMY', 'TERRIBLE'],
      5: ['OBLIVION', 'HORRIFIC', 'GHASTLY'],
      6: ['NIGHTMARE', 'MALEVOLENCE', 'TENEBROUS'],
      7: []
    },
    weaknesses: ['holy'],
    resistances: ['dark'],
    immunities: []
  },
  {
    id: 'lightning',
    name: 'lightning',
    emoji: '⚡',
    vocabByLevel: {
      1: ['ARC', 'BOLT'],
      2: ['SPARK', 'ZAP', 'CHARGE'],
      3: ['SHOCK', 'ELECTRIC', 'CONDUIT'],
      4: ['THUNDER', 'VOLTAGE', 'JOLT'],
      5: ['THUNDERCLAP', 'ELECTROCUTE', 'LIGHTNING'],
      6: ['ELECTRIFYING', 'ZAPPER', 'IONIZATION'],
      7: []
    },
    weaknesses: ['earth'],
    resistances: ['electric'],
    immunities: []
  },
  {
    id: 'verdant',
    name: 'verdant',
    emoji: '🍃',
    vocabByLevel: {
      1: ['SAP', 'SEED', 'ROOT'],
      2: ['SPROUT', 'BLOOM', 'LEAF'],
      3: ['ENTANGLE', 'VINE', 'BLOSSOM'],
      4: ['BAMBOO', 'GARDEN', 'THICKET'],
      5: ['AZALEA', 'FLOWERING', 'ORCHARD'],
      6: ['VERDANT', 'JACKFRUIT', 'PHOTOSYNTHESIS'],
      7: []
    },
    weaknesses: ['fire'],
    resistances: ['plant']
  },
  {
    id: 'stone',
    name: 'stone',
    emoji: '🪨',
    vocabByLevel: {
      1: ['SAND', 'DUST'],
      2: ['ROCKY', 'GRAVEL', 'SLATE'],
      3: ['BOULDER', 'PEBBLE', 'GRANITE'],
      4: ['LANDSLIDE', 'LIMESTONE', 'QUARRY', 'BEDROCK'],
      5: ['CATACLYSM', 'QUARTZ', 'MARBLE', 'ONYX'],
      6: ['EARTHQUAKE', 'FELDSPAR', 'OBSIDIAN', 'XENOLITH'],
      7: []
    },
    weaknesses: ['ice'],
    resistances: ['earth'],
    immunities: []
  },
  {
    id: 'archer',
    name: 'archer',
    emoji: '🏹',
    vocabByLevel: {
      1: ['AIM', 'SHOT'],
      2: ['ARROW', 'BOW', 'TARGET'],
      3: ['BOLT', 'SNIPER', 'AIMING'],
      4: ['QUIVER', 'MARKSMAN', 'LONGSHOT'],
      5: ['CROSSBOW', 'LONGBOW', 'RECURVE'],
      6: ['LACERATION', 'PRECISION', 'HEADSHOT', 'BULLSEYE'],
      7: []
    },
    weaknesses: ['blunt'],
    resistances: []
  },
  {
    id: 'toxic',
    name: 'toxic',
    emoji: '☣️',
    vocabByLevel: {
      1: ['ROT','ILL'],
      2: ['FUMES', 'SICK', 'AILED'],
      3: ['TOXIC', 'POISON', 'VIRUS'],
      4: ['VENOMOUS', 'BLIGHTED', 'POLLUTED'],
      5: ['NECROSIS', 'INFECTION', 'CONTAMINATE'],
      6: ['BIOHAZARD', 'PATHOGEN', 'VIRULENT', 'TOXICOLOGY'],
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
      1: ['COO', 'BUN'],
      2: ['CUDDLE', 'KISS', 'HAPPY'],
      3: ['CHUBBY', 'CHARM', 'SNUGGLE'],
      4: ['ADORABLE', 'FUZZY', 'BUBBLY', 'BUTTON'],
      5: ['ENDEARING', 'WHIMSICAL', 'LOVEABLE', 'PRECIOUS'],
      6: ['IRRESISTIBLE', 'HEARTTHROB', 'SWEETHEART', 'DARLING'],
      7: []
    },
    weaknesses: ['sorrow'],
    resistances: ['charm']
  },
  {
    id: 'cold',
    name: 'cold',
    emoji: '❄️',
    vocabByLevel: {
      1: ['ICE'],
      2: ['ICE', 'COLD', 'COOL'],
      3: ['FROST', 'CHILL', 'SNOWY'],
      4: ['GLACIER', 'ICICLE', 'FLURRY', 'FREEZE'],
      5: ['HAILSTORM', 'FROSTBITE', 'PERMAFROST'], 
      6: ['BLIZZARD', 'HYPOTHERMIA', 'CRYOGENIC', 'SUBLIMATION'],
      7: []
    },
    weaknesses: ['fire'],
    resistances: ['ice'],
    immunities: []
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
  const emoji = base.emoji;
  const affixEmoji = affix ? affix.emoji : '';

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
    affixEmoji,
    level: base.level,
    hp: base.hp,
    maxHp: base.hp,
    wp: base.wp,
    maxWp: base.wp,
    vocabulary,
    weaknesses,
    resistances,
    immunities
  };
}