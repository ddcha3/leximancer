// Single source of truth for tags: export a list of tag objects with emoji and target
export const TAGS = [
  // CORE ELEMENTS
  { id: 'fire', emoji: '🔥', target: 'hp' },  // Covers: heat, burn, lava, ash
  { id: 'water', emoji: '💧', target: 'hp' }, // Covers: rain, mist, river
  { id: 'ice', emoji: '❄️', target: 'hp' },   // Covers: cold, frost, snow
  { id: 'earth', emoji: '🪨', target: 'hp' }, // Covers: rock, stone, mountain
  { id: 'air', emoji: '💨', target: 'hp' },   // Covers: wind, storm, gas
  { id: 'nature', emoji: '🌱', target: 'hp' },

  // PHYSICAL
  { id: 'blade', emoji: '⚔️', target: 'hp' }, // Covers: cut, sharp, axe
  { id: 'blunt', emoji: '🔨', target: 'hp' }, // Covers: smash, force, heavy
  { id: 'metal', emoji: '⚙️', target: 'hp' }, // Covers: iron, steel
  { id: 'pierce', emoji: '🏹', target: 'hp' },
  { id: 'bleed', emoji: '🩸', target: 'hp' },

  // ELEMENTAL / STATUS
  { id: 'poison', emoji: '☣️', target: 'hp' },
  { id: 'electric', emoji: '⚡', target: 'hp' },
  { id: 'dark', emoji: '🌑', target: 'hp' },
  { id: 'holy', emoji: '✨', target: 'hp' },
  { id: 'mind', emoji: '🧠', target: 'wp' },
  { id: 'taunt', emoji: '💬', target: 'wp' },

  // ABSTRACT / UTILITY
  { id: 'bribe', emoji: '💰', target: 'wp' }, // Covers: greed, gold, wealth
  { id: 'fear', emoji: '😱', target: 'wp' },  // Covers: terror, undead, scare
  { id: 'heal', emoji: '💖', target: 'hp' },  // Covers: health, cure
  { id: 'food', emoji: '😋', target: 'hp' },  // Covers: eat, fruit, meat
  { id: 'motion', emoji: '🏃', target: 'wp' }, // Covers: run, flee, speed
  { id: 'stun', emoji: '😵‍💫', target: 'wp' },  // Covers: stop, trap
  { id: 'silence', emoji: '🔇', target: 'wp' },
  { id: 'sleep', emoji: '💤', target: 'wp' },
  { id: 'shield', emoji: '🛡️', target: 'hp' },
  { id: 'summon', emoji: '🪄', target: 'hp' },

  // DISGUST
  { id: 'disgust', emoji: '🤢', target: 'wp' },

  // LIFESTEAL (Heal for damage dealt)
  { id: 'lifesteal', emoji: '💞', target: 'hp' },

  // SWEARING / PROFANITY
  { id: 'profanity', emoji: '🤬', target: 'wp' },

  // LOUD / SONIC
  { id: 'loud', emoji: '📢', target: 'wp' },

  // CUTE / CHARM
  { id: 'cute', emoji: '🥹', target: 'wp' },

  // CLEAN
  { id: 'clean', emoji: '🧼', target: 'hp' }
];

// Backwards-compatible lookup maps derived from the single TAGS list
export const TAG_EMOJIS = Object.fromEntries(TAGS.map(t => [t.id, t.emoji]));
export const TAG_TARGETS = Object.fromEntries(TAGS.map(t => [t.id, t.target]));