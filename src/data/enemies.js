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
      resistances: []
    },
    {
      id: 'hamster',
      name: 'hamster',
      emoji: '🐹',
      level: 1,
      hp: 8,
      wp: 20,
      vocabulary: ['NYUM', 'BRO', 'SUP', 'HUH', 'HELP'],
      weaknesses: ['intelligence', 'charm', 'sorrow'],
      resistances: []
    }
  ],

  2: [
    {
      id: 'birb',
      name: 'birb',
      emoji: '🐦',
      level: 2,
      hp: 22,
      wp: 15,
      vocabulary: ['HUM', 'PECK', 'FLY', 'NEST', 'SING', 'NYUM', 'CHIRP'],
      weaknesses: ['loud', 'electric'],
      resistances: []
    },
    {
      id: 'snek',
      name: 'snek',
      emoji: '🐍',
      level: 2,
      hp: 16,
      wp: 24,
      vocabulary: ['BITE', 'HISS', 'SNEK', 'COIL', 'SLIDE', 'WAIT'],
      weaknesses: [],
      resistances: []
    },
    {
      id: 'kitty',
      name: 'kitty',
      emoji: '🐈',
      level: 2,
      hp: 20,
      wp: 20,
      vocabulary: ['NYAN', 'SIT', 'PURR', 'LEAP', 'HISS', 'STALK'],
      weaknesses: ['loud', 'heavy'],
      resistances: []
    },
    {
      id: 'pup',
      name: 'pup',
      emoji: '🐕',
      level: 2,
      hp: 25,
      wp: 15,
      vocabulary: ['ARF', 'RUN', 'SNIFF', 'TAIL', 'HOWL', 'LICK', 'SIT'],
      weaknesses: ['taunt', 'charm'],
      resistances: []
    },
    {
      id: 'tortoise',
      name: 'tortoise',
      emoji: '🐢',
      level: 2,
      hp: 30,
      wp: 20,
      vocabulary: ['SHELL', 'SHIELD', 'DEFEND', 'HIDE'],
      weaknesses: ['fire', 'charm', 'negotiate'],
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
      resistances: []
    },
    {
      id: 'goblin',
      name: 'goblin',
      emoji: '👺',
      level: 3,
      hp: 35,
      wp: 25,
      vocabulary: ['RUN', 'SHIELD', 'GUARD', 'STAB', 'STEAL', 'SHOUT', 'BACKSTAB', 'SNEAK', 'MURDER'],
      weaknesses: ['negotiate', 'taunt', 'charm'],
      resistances: []
    },
    {
      id: 'ape',
      name: 'ape',
      emoji: '🦍',
      level: 3,
      hp: 40,
      wp: 22,
      vocabulary: ['HIT', 'BITE', 'THUMP', 'SMASH', 'BEAT', 'ROAR', 'POUND', 'PRIMATE'],
      weaknesses: ['sharp', 'taunt', 'tech'],
      resistances: []
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
      resistances: []
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
      vocabulary: ['LAUGH', 'DANCE', 'HEY', 'SUP', 'JEST', 'GUFFAW', 'HEE', 'TEEHEE', 'GRIN', 'LEER', 'PANDEMONIUM'],
      weaknesses: ['taunt', 'blunt', 'sharp', 'creature'],
      resistances: []
    },
    {
      id: 'alien',
      name: 'alien',
      emoji: '👽',
      level: 4,
      hp: 40,
      wp: 55,
      vocabulary: ['NYUM', 'ZAP', 'PROBE', 'HUM', 'FLOAT', 'SCAN', 'WAIT', 'STARE', 'EXTRATERRESTRIAL'],
      weaknesses: ['intelligence', 'poison', 'charm', 'negotiate'],
      resistances: []
    },
    {
      id: 'zombie',
      name: 'zombie',
      emoji: '🧟',
      level: 4,
      hp: 65,
      wp: 40,
      vocabulary: ['CHEW', 'BITE', 'MUNCH', 'SHAMBLE', 'MOAN', 'LURCH', 'UNDEAD', 'DRAG', 'DECAY'],
      weaknesses: ['fire', 'holy', 'sharp', 'blunt'],
      resistances: []
    },
    {
      id: 'looker',
      name: 'looker',
      emoji: '👁️‍🗨️',
      level: 4,
      hp: 50,
      wp: 50,
      vocabulary: ['GLANCE', 'PEEK', 'STARE', 'GAZE', 'OBSERVE', 'PETRIFY', 'OBSERVANT', 'OMNISCIENT'],
      weaknesses: ['projectile', 'art', 'sorrow', 'electric'],
      resistances: []
    }
  ],

  5: [
    {
      id: 'troll',
      name: 'troll',
      emoji: '🧌',
      level: 5,
      hp: 140,
      wp: 50,
      vocabulary: ['SMASH', 'THUMP', 'ROAR', 'CRUSH', 'TROLLING', 'GRUMBLE', 'BELLOW'],
      weaknesses: ['taunt','intelligence','charm', 'projectile', 'sharp'],
      resistances: []
    },
    {
      id: 'camel',
      name: 'camel',
      emoji: '🐫',
      level: 5,
      hp: 70,
      wp: 90,
      vocabulary: ['MASTICATE', 'TRUDGING', 'REGURGITATE', 'MIRAGE', 'HUMP', 'CARAVAN', 'DRINK', 'OASIS'],
      weaknesses: ['ice', 'sharp', 'negotiate', 'poison'],
      resistances: []
    },
    {
      id: 'croc',
      name: 'croc',
      emoji: '🐊',
      level: 5,
      hp: 100,
      wp: 60,
      vocabulary: ['SNAP', 'BITE', 'AMBUSH', 'SCALE', 'TAIL', 'SLICE', 'DICE', 'SUBMERGE', 'DOMINUS', 'BUTCHER', 'RUTHLESS', 'PREDATOR'],
      weaknesses: ['fire','ice','tech', 'sorrow'],
      resistances: []
    },
    {
      id: 'maw',
      name: 'maw',
      emoji: '👄',
      level: 5,
      hp: 85,
      wp: 85,
      vocabulary: ['SUCK', 'TASTE', 'TASTE', 'LICK', 'SPEAK', 'YAWN', 'NIBBLE', 'TONGUE', 'SLURP'],
      weaknesses: ['sharp', 'fire', 'ice', 'poison'],
      resistances: []
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
      vocabulary: ['FLAME', 'SOAR', 'ROAR', 'SCALE', 'INFERNO', 'DRACONIC', 'DIVINITY', 'ANCIENT', 'TREASURE', 'YOLO', 'VIBES', 'CERTIFIED'],
      weaknesses: ['ice','holy','electric', 'negotiate'],
      resistances: []
    },
    {
      id: 'vampire',
      name: 'vampire',
      emoji: '🧑‍⚖️',
      level: 6,
      hp: 100,
      wp: 200,
      vocabulary: ['BLOOD', 'NIGHT', 'SIP', 'TRANSFORM', 'SIPHON', 'DRAIN', 'THIRST', 'ETERNAL', 'TWILIGHT', 'SPARKLE', 'SURVIVORS', 'SANGUINE'],
      weaknesses: ['sharp','holy','negotiate', 'art', 'plant'],
      resistances: []
    },
    {
      id: 'phoenix',
      name: 'phoenix',
      emoji: '🦚',
      level: 6,
      hp: 150,
      wp: 150,
      vocabulary: ['REBIRTH', 'FLAME', 'SOAR', 'BURST', 'IMMORTAL', 'INFERNO', 'MYTHICAL', 'REVITALIZE', 'MAJESTIC', 'ETHEREAL', 'TIMELESS', 'ETERNAL'],
      weaknesses: ['water','electric','dark', 'sorrow'],
      resistances: []
    }
  ],

  7: [
    {
      id: 'leximancer',
      name: 'leximancer',
      emoji: '🧙‍♂️',
      level: 7,
      hp: 160,
      wp: 240,
      vocabulary: ['WORDSMITH', 'INCANTATION', 'ENCHANTMENT', 'LEXICON', 'OMNISCIENT', 'SOLILOQUY', 'SPELLCRAFT', 'ARTICULATE', 'DIVINATION', 'DICTIONARY', 'INTELLECT'],
      weaknesses: ['tech','holy','intelligence','poison', 'art'],
      resistances: []
    }
  ]
};

// Affixes add vocabulary and can add weaknesses/resistances
const AFFIXES = [
  {
    id: 'hot',
    name: 'hot',
    emoji: '🔥',
    vocabByLevel: {
      1: ['BURN', 'ASH', 'HEAT'],
      2: ['BURN', 'EMBER', 'FIRE', 'BURN', 'HEAT'],
      3: ['BLAZE', 'EMBER', 'INFERNO', 'SCORCH', 'FIRE', 'FLAMES'],
      4: ['INCENDIARY', 'CONFLARE', 'FLAMING', 'BLAZING', 'FLAMES'],
      5: ['CONFLAGRATE', 'INCINERATE', 'FIRESTORM', 'FLAMING', 'BLAZING'],
      6: ['IMMOLATION', 'PYROCLASM', 'FLAMETHROWER', 'COMBUSTION', 'INCENDIARY'],
      7: ['IMMOLATION', 'PYROCLASM', 'FLAMETHROWER', 'COMBUSTION', 'INCENDIARY']
    },
    weaknesses: ['water'],
    resistances: [],
    immunities: []
  },
  {
    id: 'wet',
    name: 'wet',
    emoji: '💧',
    vocabByLevel: {
      1: ['WET', 'DRIP'],
      2: ['WATER', 'FLOOD'],
      3: ['WAVES', 'SPLASH', 'RIPPLE'],
      4: ['TSUNAMI', 'CASCADING', 'DROWNING'],
      5: ['DELUGE', 'MONSOON', 'DRENCHED', 'FLOODING'],
      6: ['AQUATIC', 'SUBMERGED', 'UNDERWATER', 'WATERLOGGED'],
      7: ['AQUATIC', 'SUBMERGED', 'UNDERWATER', 'WATERLOGGED']
    },
    weaknesses: ['electric'],
    resistances: [],
    immunities: []
  },
  {
    id: 'gusty',
    name: 'gusty',
    emoji: '💨',
    vocabByLevel: {
      1: ['AIR', "GALE", 'WIND'],
      2: ['GUST', 'BLOW', 'WINDY', 'GALE'],
      3: ['WHIRL', 'TORNADO', 'BREEZE', 'WINDY'],
      4: ['CYCLONE', 'TEMPEST', 'STORMY', 'WINDY', 'BREEZY'],
      5: ['HURRICANE', 'WINDSTORM', 'TYPHOON', 'TEMPEST'],
      6: ['WHIRLWIND', 'ZEPHYRS', 'AERODYNAMIC', 'HURRICANE', 'VENTILATE'],
      7: ['WHIRLWIND', 'ZEPHYRS', 'AERODYNAMIC', 'HURRICANE', 'VENTILATE']
    },
    weaknesses: ['earth', 'heavy'],
    resistances: []
  },
  {
    id: 'cursed',
    name: 'cursed',
    emoji: '♠️',
    vocabByLevel: {
      1: ['DUSK', 'SUS'],
      2: ['HEX', 'VOID', 'DARK', 'SUSSY'],
      3: ['CURSE', 'NOCTURNAL', 'SHADOW', 'HEXED'],
      4: ['DARKNESS', 'GLOOMY', 'TERRIBLE', 'FORSAKEN'],
      5: ['OBLIVION', 'HORRIFIC', 'GHASTLY', 'TORMENT'],
      6: ['NIGHTMARE', 'MALEVOLENCE', 'TENEBROUS', 'GOTHIC'],
      7: []
    },
    weaknesses: ['holy', 'time'],
    resistances: [],
    immunities: []
  },
  {
    id: 'amped',
    name: 'amped',
    emoji: '⚡',
    vocabByLevel: {
      1: ['ARC', 'BOLT'],
      2: ['SPARK', 'ZAP', 'CHARGE', 'BOLT'],
      3: ['SHOCK', 'ELECTRIC', 'CONDUIT', 'CURRENT'],
      4: ['THUNDER', 'VOLTAGE', 'JOLT', 'SHOCKING'],
      5: ['THUNDERCLAP', 'ELECTROCUTE', 'LIGHTNING', 'VOLTAGE'],
      6: ['ELECTRIFYING', 'ZAPPER', 'IONIZATION', 'LIGHTNING'],
      7: []
    },
    weaknesses: ['earth', 'tech'],
    resistances: [],
    immunities: []
  },
  {
    id: 'lush',
    name: 'lush',
    emoji: '🍃',
    vocabByLevel: {
      1: ['SAP', 'SEED', 'ROOT'],
      2: ['SPROUT', 'BLOOM', 'LEAF', 'GRASS'],
      3: ['ENTANGLE', 'VINE', 'BLOSSOM', 'GROWTH'],
      4: ['BAMBOO', 'GARDEN', 'THICKET', 'BLOSSOM', 'FOREST'],
      5: ['AZALEA', 'FLOWERING', 'ORCHARD', 'FOLIAGE', 'MEADOW'],
      6: ['VERDANT', 'JACKFRUIT', 'PHOTOSYNTHESIS', 'EVERGREEN', 'BOTANICAL'],
      7: []
    },
    weaknesses: ['fire', 'creature'],
    resistances: []
  },
  {
    id: 'rocky',
    name: 'rocky',
    emoji: '🪨',
    vocabByLevel: {
      1: ['SAND', 'DUST'],
      2: ['ROCKY', 'CRAG', 'SLATE', 'DUST'],
      3: ['BOULDER', 'PEBBLE', 'GRANITE', 'GRAVEL'],
      4: ['LANDSLIDE', 'LIMESTONE', 'QUARRY', 'BEDROCK'],
      5: ['CATACLYSM', 'QUARTZ', 'MARBLE', 'ONYX', 'QUARRY'],
      6: ['EARTHQUAKE', 'FELDSPAR', 'OBSIDIAN', 'XENOLITH', 'TECTONIC'],
      7: []
    },
    weaknesses: ['ice', 'plant'],
    resistances: [],
    immunities: []
  },
  {
    id: 'aimer',
    name: 'aimer',
    emoji: '🏹',
    vocabByLevel: {
      1: ['AIM', 'SHOT'],
      2: ['ARROW', 'BOW', 'TARGET', 'SHOOT'],
      3: ['BOLT', 'SNIPER', 'AIMING', 'RELEASE'],
      4: ['QUIVER', 'MARKSMAN', 'LONGSHOT', 'CRACKED'],
      5: ['CROSSBOW', 'LONGBOW', 'RECURVE', 'OPERATOR'],
      6: ['LACERATION', 'PRECISION', 'HEADSHOT', 'BULLSEYE'],
      7: []
    },
    weaknesses: ['blunt', 'motion'],
    resistances: []
  },
  {
    id: 'toxic',
    name: 'toxic',
    emoji: '☣️',
    vocabByLevel: {
      1: ['ROT','ILL'],
      2: ['FUMES', 'SICK', 'AILED'],
      3: ['TOXIC', 'POISON', 'VIRUS', 'ROTTING'],
      4: ['VENOMOUS', 'BLIGHTED', 'POLLUTED', 'INFESTED'],
      5: ['NECROSIS', 'INFECTION', 'CONTAMINATE', 'POISONOUS'],
      6: ['BIOHAZARD', 'PATHOGEN', 'VIRULENT', 'TOXICOLOGY', 'INFESTATION'],
      7: []
    },
    weaknesses: ['earth', 'holy'],
    resistances: [],
    immunities: []
  },
  {
    id: 'cute',
    name: 'cute',
    emoji: '💕',
    vocabByLevel: {
      1: ['COO', 'BUN', 'UWU'],
      2: ['CUDDLE', 'KISS', 'HAPPY', 'UWU', 'UGUU'],
      3: ['CHUBBY', 'CHARM', 'SNUGGLE', 'UWU', 'UGUU'],
      4: ['ADORABLE', 'FUZZY', 'BUBBLY', 'BUTTON', 'UWU', 'UGUU', 'KAWAII'],
      5: ['ENDEARING', 'WHIMSICAL', 'LOVEABLE', 'PRECIOUS', 'UWU', 'UGUU', 'KAWAII'],
      6: ['IRRESISTIBLE', 'HEARTTHROB', 'SWEETHEART', 'DARLING', 'KAWAII'],
      7: []
    },
    weaknesses: ['sorrow', 'loud'],
    resistances: []
  },
  {
    id: 'frosty',
    name: 'frosty',
    emoji: '❄️',
    vocabByLevel: {
      1: ['ICE', 'SLEET'],
      2: ['ICE', 'COLD', 'COOL', 'HAIL'],
      3: ['FROST', 'CHILL', 'SNOWY', 'NIPPY'],
      4: ['GLACIER', 'ICICLE', 'FLURRY', 'FREEZE'],
      5: ['HAILSTORM', 'FROSTBITE', 'PERMAFROST', 'SNOWSTORM'], 
      6: ['BLIZZARD', 'HYPOTHERMIA', 'CRYOGENIC', 'SUBLIMATION'],
      7: []
    },
    weaknesses: ['fire'],
    resistances: [],
    immunities: []
  },
  {
    id: 'educated',
    name: 'educated',
    emoji: '📚',
    vocabByLevel: {
      1: ['READ', 'DATA'],
      2: ['STUDY', 'LEARN', 'TOME', 'TEXT'],
      3: ['PEDANTIC', 'BRAIN', 'WOKE', 'SMART', 'PROOF', 'AXIOM', 'THESIS'],
      4: ['GALAXY', 'PRETENTIOUS', 'MANUSCRIPT', 'DOCTORATE', 'COLLEGE'],
      5: ['ENCYCLOPEDIA', 'ANNOTATION', 'VERBOSE', 'PRETENTIOUS', 'UNIVERSITY'],
      6: ['COMPENDIUM', 'BIBLIOGRAPHY', 'EXPOSITION', 'SCHOLARLY', 'PARADIGM'],
      7: ['COMPENDIUM', 'BIBLIOGRAPHY', 'EXPOSITION', 'SCHOLARLY', 'PARADIGM']
    },
    weaknesses: ['blunt', 'creature', 'heavy'],
    resistances: []
  }
];

export const MAX_STAGE = 7;

// Create a new enemy instance by combining a base (by level) and a random affix
export function createEnemy(stageIndex, rand = Math.random) {
  const level = Math.min(7, stageIndex + 1);
  const bases = BASES[level] || BASES[7];
  const base = bases[Math.floor(rand() * bases.length)];

  // 25% chance to spawn without an affix
  const useAffix = rand() >= 0.25;
  const affix = useAffix ? AFFIXES[Math.floor(rand() * AFFIXES.length)] : null;

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