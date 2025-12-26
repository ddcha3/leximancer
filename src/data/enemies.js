export const ENCOUNTERS = [
  // Stage 1 (Level 1)
  [
    {
      id: "rat",
      name: "Plague Rat",
      emoji: "🐀",
      level: 1,
      hp: 15, wp: 5,
      desc: "A filthy rodent spreading disease.",
      vocabulary: ["BITE", "GNAW", "SQUEAK", "FILTH", "RUN"],
      weaknesses: {
        "fire": { mult: 1.5, msg: "It squeals!" },
        "fear": { mult: 2.0, target: "wp", msg: "It scampers away!" }
      },
      resistances: {
        "poison": { mult: 0.0, msg: "It eats poison for breakfast." }
      }
    },
    {
      id: "urchin",
      name: "Street Urchin",
      emoji: "🧒",
      level: 1,
      hp: 12, wp: 8,
      desc: "Quick hands, quicker feet.",
      vocabulary: ["PICK", "STEAL", "SLIP", "HIDE", "PLEAD"],
      weaknesses: {
        "bribe": { mult: 2.0, target: "wp", msg: "Ooh! Shiny!" }
      },
      resistances: {
        "blunt": { mult: 0.5, msg: "Takes the hit on the small frame." }
      }
    },
    {
      id: "rabid_dog",
      name: "Rabid Dog",
      emoji: "🐕",
      level: 1,
      hp: 20, wp: 5,
      desc: "Foaming and fierce.",
      vocabulary: ["BITE", "SNAP", "GROWL", "FRENZY"],
      weaknesses: {
        "fire": { mult: 1.5, msg: "It recoils from the flame." }
      },
      resistances: {}
    }
  ],

  // Stage 2 (Level 2)
  [
    {
      id: "goblin",
      name: "Sniveling Goblin",
      emoji: "👺",
      level: 2,
      hp: 25, wp: 10,
      desc: "Greedy and cowardly.",
      vocabulary: ["STAB", "COIN", "GREED", "SHOUT", "TRAP"],
      weaknesses: {
        "bribe": { mult: 2.5, target: "wp", msg: "Ooh! Shiny!" },
        "fear": { mult: 1.5, target: "wp", msg: "Don't hurt me!" }
      },
      resistances: {}
    },
    {
      id: "goblin_shank",
      name: "Goblin Shank",
      emoji: "👺🗡️",
      level: 2,
      hp: 22, wp: 10,
      desc: "Sharp and sneaky.",
      vocabulary: ["STAB", "SLASH", "SNEAK"],
      weaknesses: {
        "blunt": { mult: 2.0, msg: "It stumbles from the blow." }
      },
      resistances: {
        "bribe": { mult: 0.5, msg: "Not easily bought off." }
      }
    },
    {
      id: "goblin_shaman",
      name: "Goblin Shaman",
      emoji: "👺🪄",
      level: 2,
      hp: 18, wp: 20,
      desc: "A small one with big tricks.",
      vocabulary: ["HEX", "POISON", "WHISPER", "CURSE"],
      weaknesses: {
        "holy": { mult: 2.5, msg: "Light sears its skin!" }
      },
      resistances: {
        "dark": { mult: 0.5, msg: "Shadows cling." }
      }
    }
  ],

  // Stage 3 (Level 3)
  [
    {
      id: "skeleton",
      name: "Rattlebones",
      emoji: "💀",
      level: 3,
      hp: 40, wp: 100, // Fearless
      desc: "Bones held together by hate.",
      vocabulary: ["BONE", "RATTLE", "FEAR", "DEATH", "CLACK"],
      weaknesses: {
        "blunt": { mult: 2.0, msg: "CRACK! Bones shatter." },
        "holy": { mult: 3.0, msg: "The light burns it!" }
      },
      resistances: {
        "blade": { mult: 0.5, msg: "Slashing air..." },
        "pierce": { mult: 0.2, msg: "Goes right through the ribs." },
        "fear": { mult: 0.0, target: "wp", msg: "It feels nothing." }
      }
    },
    {
      id: "skeleton_archer",
      name: "Bone Archer",
      emoji: "💀🏹",
      level: 3,
      hp: 35, wp: 60,
      desc: "Ranged bones with a keen aim.",
      vocabulary: ["SHOOT", "BONE", "AIM", "ARCHERY"],
      weaknesses: {
        "blunt": { mult: 2.0, msg: "Arrow bones crack." }
      },
      resistances: {
        "pierce": { mult: 0.2, msg: "Arrows pass right through." }
      }
    },
    {
      id: "skeleton_mage",
      name: "Bone Magus",
      emoji: "💀🪄",
      level: 3,
      hp: 30, wp: 80,
      desc: "A living conduit of dark rites.",
      vocabulary: ["HEX", "DARK", "RAISE", "BONE"],
      weaknesses: {
        "holy": { mult: 3.0, msg: "The light burns it!" }
      },
      resistances: {
        "ice": { mult: 0.8, msg: "Cold does little." }
      }
    }
  ],

  // Stage 5 (Level 5)
  [
    {
      id: "treant",
      name: "Elder Treant",
      emoji: "🌳",
      level: 5,
      hp: 80, wp: 50,
      desc: "Ancient wood, slow anger.",
      vocabulary: ["ROOT", "CRUSH", "GROW", "STOMP", "BRANCH"],
      weaknesses: {
        "fire": { mult: 3.0, msg: "TIMBERRR!" },
      "blade": { mult: 2.0, msg: "Chop chop!" }
      },
      resistances: {
        "water": { mult: -1.0, msg: "It drinks deeply." },
        "blunt": { mult: 0.8, msg: "Thud." }
      }
    },
    {
      id: "spriggan",
      name: "Young Spriggan",
      emoji: "🌱",
      level: 5,
      hp: 50, wp: 30,
      desc: "A mischievous sapling spirit.",
      vocabulary: ["GROW", "ROOT", "SPROUT", "SEED"],
      weaknesses: {
        "fire": { mult: 2.0, msg: "Leaves scorch!" }
      },
      resistances: {
        "earth": { mult: 0.5, msg: "Roots shield it." }
      }
    },
    {
      id: "forest_spider",
      name: "Forest Spider",
      emoji: "🕷️",
      level: 5,
      hp: 40, wp: 20,
      desc: "A venomous hunter among the leaves.",
      vocabulary: ["WEB", "BITE", "LURK", "VENOM"],
      weaknesses: {
        "fire": { mult: 2.0, msg: "The web ignites!" }
      },
      resistances: {
        "poison": { mult: 0.0, msg: "It is one with the venom." }
      }
    }
  ],

  // Stage 10 (Level 10)
  [
    {
      id: "dragon",
      name: "Ember Drake",
      emoji: "🐉🔥",
      level: 10,
      hp: 200, wp: 80,
      desc: "The lord of the volcano.",
      vocabulary: ["INFERNO", "ROAR", "FLY", "BURN", "CLAW"],
      weaknesses: {
        "water": { mult: 2.0, msg: "Steam hisses violently!" },
        "ice": { mult: 2.0, msg: "Thermal shock!" },
        "bribe": { mult: 1.5, target: "wp", msg: "A tribute for the hoard?" }
      },
      resistances: {
        "fire": { mult: 0.0, msg: "It bathes in flame." }
      }
    },
    {
      id: "frost_drake",
      name: "Frost Drake",
      emoji: "🐉❄️",
      level: 10,
      hp: 180, wp: 90,
      desc: "A drake born from the iceflow.",
      vocabulary: ["BLIZZARD", "ROAR", "FREEZE", "ICE"],
      weaknesses: {
        "fire": { mult: 2.0, msg: "Flames sear it!" }
      },
      resistances: {
        "ice": { mult: 0.0, msg: "It is born of cold." }
      }
    },
    {
      id: "magma_wyrm",
      name: "Magma Wyrm",
      emoji: "🐉🔥",
      level: 10,
      hp: 220, wp: 60,
      desc: "A molten serpent of the deep crust.",
      vocabulary: ["LAVA", "ERUPT", "SPLASH", "BURN"],
      weaknesses: {
        "water": { mult: 3.0, msg: "Thermal shock!" }
      },
      resistances: {
        "fire": { mult: 0.0, msg: "It glows with flame." }
      }
    }
  ]
];