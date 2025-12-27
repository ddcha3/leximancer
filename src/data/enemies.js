// Base enemies (single-word names). Affixes can be applied to these.
const BASES = {
  1: [
    {
      id: 'rat',
      name: 'rat',
      emoji: '🐀',
      level: 1,
      hp: 15,
      wp: 5,
      vocabulary: ['BITE', 'GNAW', 'CHEW'],
      weaknesses: ['fear', 'earth'],
      resistances: ['poison']
    },
    {
      id: 'roach',
      name: 'roach',
      emoji: '🪳',
      level: 1,
      hp: 12,
      wp: 4,
      vocabulary: ['BUG', 'CRAWL'],
      weaknesses: ['clean', 'blunt'],
      immunities: ['loud', 'silence'],
      resistances: []
    },
    {
      id: 'snail',
      name: 'snail',
      emoji: '🐌',
      level: 1,
      hp: 18,
      wp: 6,
      vocabulary: ['SLIME', 'SHELL'],
      weaknesses: [],
      resistances: ['water', 'pierce']
    }
  ],

  2: [
    {
      id: 'bird',
      name: 'bird',
      emoji: '🐦',
      level: 2,
      hp: 22,
      wp: 15,
      vocabulary: ['CHIRP', 'PECK', 'FLY'],
      weaknesses: ['loud'],
      resistances: ['earth', 'air']
    },
    {
      id: 'snake',
      name: 'snake',
      emoji: '🐍',
      level: 2,
      hp: 24,
      wp: 12,
      vocabulary: ['BITE', 'HISS', 'VENOM'],
      weaknesses: ['fire'],
      resistances: ['poison']
    }
  ],

  3: [
    {
      id: 'pumpkin',
      name: 'pumpkin',
      emoji: '🎃',
      level: 3,
      hp: 35,
      wp: 20,
      vocabulary: ['ROLL', 'SMASH', 'GLOW'],
      weaknesses: ['blade'],
      resistances: []
    },
    {
      id: 'goblin',
      name: 'goblin',
      emoji: '👺',
      level: 3,
      hp: 30,
      wp: 25,
      vocabulary: ['STAB', 'STEAL', 'SHOUT'],
      weaknesses: ['bribe'],
      resistances: []
    }
  ],

  4: [
    {
      id: 'clown',
      name: 'clown',
      emoji: '🤡',
      level: 4,
      hp: 50,
      wp: 40,
      vocabulary: ['JEST', 'SQUEAK', 'BOOM'],
      weaknesses: ['taunt'],
      resistances: []
    },
    {
      id: 'alien',
      name: 'alien',
      emoji: '👽',
      level: 4,
      hp: 55,
      wp: 45,
      vocabulary: ['ZAP', 'PROBE', 'HUM'],
      weaknesses: ['mind'],
      resistances: []
    },
  ],

  5: [
    {
      id: 'troll',
      name: 'troll',
      emoji: '🧌',
      level: 5,
      hp: 140,
      wp: 40,
      vocabulary: ['SMASH', 'THUMP', 'ROAR'],
      weaknesses: ['taunt','mind','cute'],
      resistances: ['blunt','earth']
    },
    {
      id: 'camel',
      name: 'camel',
      emoji: '🐫',
      level: 5,
      hp: 90,
      wp: 40,
      vocabulary: ['MASTICATE', 'TRUDGING', 'REGURGITATE', 'MIRAGE'],
      weaknesses: ['ice'],
      resistances: ['earth','water']
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
      5: ['CONFLAGRATE', 'INCINERATE', 'APOCALYPSE']
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
      5: ['DELUGE', 'MONSOON']
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
      5: ['TEMPEST']
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
      5: ['DARKNESS']
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
      5: ['THUNDERCLAP']
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
      5: ['FORESTCALL']
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
      5: ['CATACLYSM']
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
      1: ['SHOOT'],
      2: ['AIM'],
      3: ['BOLT', 'SNIPER'],
      4: ['VOLLEY'],
      5: ['RAIN']
    },
    weaknesses: ['blunt'],
    resistances: ['pierce']
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
      5: ['ROTTENBITE']
    },
    weaknesses: ['earth'],
    resistances: [],
    immunities: ['poison']
  }
];

export const MAX_STAGE = 5;

// Create a new enemy instance by combining a base (by level) and a random affix
export function createEnemy(stageIndex) {
  const level = Math.min(5, stageIndex + 1);
  const bases = BASES[level] || BASES[5];
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