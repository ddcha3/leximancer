const spellList = {};

const register = (words, tags = [], opts = {}) => {
  words.forEach(word => {
    spellList[word] = { tags, ...opts };
  });
};

// --- CONTENT DEFINITION ---

// FIRE
register(
  ["FIRE", "BURN", "HEAT", "HOT", "LIT", "LAVA", "ASH", "COAL", "SEAR", "CHAR", "PYRE", "FLAME", "BLAZE", "IGNITE", "INFERNO", "HELLFIRE", "SCORCH", "EMBER", "SMOKE", "TORCH", "CHARCOAL", "ROAST", "BAKE", "SIZZLE", "CINDER", "SINGE", "FIREBRAND", "MELT"], 
  ["fire"]
);

// WATER & ICE
register(
  ["WATER", "AQUA", "RAIN", "MIST", "SOAK", "FLOOD", "TSUNAMI", "STEAM", "DEW", "POOL", "SPLASH", "DRENCH", "DRIP", "DRIZZLE"], 
  ["water"],
);
register(
  ["POND", "LAKE", "RIVER", "OCEAN", "SEA", "WAVE", "SURGE", "CURRENT", "STREAM", "CREEK", "BROOK", "FALLS", "WET"], 
  ["water"]
)
register(
  ["WASH", "BATH", "SHOWER", "RINSE", "BATHE", "LATHER"],
  ["water", "clean"]
)
register(
  ["ICE", "SNOW", "COLD", "FROST", "FREEZE", "CHILL", "GLACIER", "BLIZZARD", "SLEET", "AVALANCHE", "HAIL", "PERMAFROST", "ICICLE", "FROSTBITE", "SHIVER", "SLEETSTORM"], 
  ["ice"]
);

// PHYSICAL (Merged force, weapon -> blunt/blade)
register(
  ["HIT", "BASH", "BEAT", "KICK", "PUNCH", "STRIKE", "SMASH", "CRUSH", "SLAM", "BREAK", "STICK", "ROD", "STAFF", "CLUB", "MACE", "HAMMER", "FIST", "GAUNTLET", "BAT", "CUDGEL", "SLEDGE"], 
  ["blunt"]
);
register(
  ["CUT", "SLICE", "STAB", "SLASH", "CHOP", "CLEAVE", "SWORD", "AX", "AXE", "KNIFE", "DAGGER", "SABER", "MACHEETE", "SICKLE", "SCYTHE", "BLADE", "HACK", "REAP", "FELL", "GASH", "RIP", "REND", "SLAUGHTER", "SAW", "SHIV"], 
  ["blade"]
);

// UTILITY
register(
  ["HEAL", "HEALTH", "MEND", "CURE", "REST", "POTION", "REGEN", "HEALER", "RECOVER"], 
  ["heal"]
);

// LIFESTEAL / DRAIN
register(
  ["DRAIN", "SIPHON", "LIFESTEAL", "CONSUME", "DEVOUR", "LEECH", "ABSORB", "SAP"],
  ["lifesteal",]
);
register(
  [
  "SUCK", "SLURP", "GULP", "SWALLOW", "INGEST", "BITE", "NIBBLE", "CHEW", "GNAW", "MUNCH", "CRUNCH"],
  ["lifesteal"]
)
register(
  ["FOOD", "EAT", "MEAL", "BREAD", "FRUIT", "VEGGIE", "MEAT", "APPLE", "BERRY", "HUNT", "GATHER", "FORAGE", "SNACK", "FEAST", "DINE"], 
  ["food"]
)
register(
  ["PIZZA", "PATE", "QUICHE","BURGER", "SANDWICH", "PASTA", "SOUP", "SALAD", "CAKE", "COOKIE", "CANDY", "CHOCOLATE", "ICECREAM", "DESSERT", "BREAKFAST", "LUNCH", "DINNER", "SUPPER"], 
  ["food"]
)
register(
  ["MILK", "JUICE", "BOBA", "SMOOTHIE", "TEA", "COFFEE", "MILKSHAKE", "BEVERAGE", "DRINK", "SODA", "POP", "COLA"],
  ["food"]
)
register(
  ["GRAPE", "ORANGE", "BANANA", "MANGO", "PINEAPPLE", "PEACH", "PEAR", "PLUM", "CHERRY", "STRAWBERRY", "BLUEBERRY", "RASPBERRY", "WATERMELON", "KIWI"],
  ["food"]
)
register(
  ["RUN", "FLEE", "ESCAPE", "LEAVE", "BOLT", "SPRINT"], 
  ["motion"]
);
register(
  ["STUN", "STOP", "HALT", "TRAP", "PARALYZE", "DAZE", "BIND", "PETRIFY", "IMMOBILIZE"], 
  ["stun"]
);

// HOLY / LIGHT
register(
  ["LIGHT", "HOLY", "RADIANT", "BLESS", "BLESSING", "DIVINE", "LUMEN", "SUN"], 
  ["holy"]
);

// POISON / TOXIN
register(
  ["POISON", "TOXIN", "VENOM", "BLIGHT", "FUMES", "ROT"], 
  ["poison"]
);
register(
  ["SICK", "AIL", "ILL", "DISEASE", "FEVER", "VIRUS", "PLAGUE", "MALADY", "CONTAGION"], 
  ["poison"]
)

// DISGUST (vomit, poo, pee, scum, slime)
register(
  ["VOMIT", "VOMITATE", "PUKE", "BARF", "RETCH", "SPEW", "UPCHUCK", "GURGLE"],
  ["disgust"]
);
register(
  ["POO", "POOP", "TURD", "FECES", "DUNG", "MANURE", "EXCREMENT", "WASTE", "DROPPINGS"],
  ["disgust"]
);
register(
  ["PEE", "URINE", "WEE"],
  ["disgust"]
);
register(
  ["SCUM", "SLUDGE", "OOZE", "SLIME"],
  ["disgust"]
);
register(
  ["TRASH", "GARBAGE", "RUBBISH", "JUNK", "DEBRIS"],
  ["disgust"]
);

// CUTE / CHARM
register(
  ["CUTE", "FLUFFY", "AWW", "KAWAII", "ADORABLE", "FUZZY"],
  ["cute"]
);

// SWEAR / PROFANITY
// Some vulgar words also imply disgust; register them with both tags where appropriate.
register(
  ["CRAP", "SHIT", "PISS"],
  ["disgust", "profanity"]
);
register(
  ["DAMN", "DARN", "DRAT", "DANG", "FRICK", "HECK", "FUCK", "CUNT", "BITCH", "ASSHOLE", "BULLSHIT", "BASTARD", "DICK", "PRICK"],
  ["profanity"]
);

// CLEAN / SANITIZE
register(
  ["CLEAN", "CLEANSE", "RINSE", "SCRUB", "SANITIZE", "BLEACH", "SOAP", "SUDS", "MOP", "SWEEP", "BROOM", "POLISH", "DEODORIZE", "PURGE", "DRY"],
  ["clean"]
);

// ELECTRIC
register(
  ["THUNDER", "LIGHTNING", "SHOCK", "SPARK", "ZAP", "BOLT", "STORM"], 
  ["electric"]
);

// AIR / WIND
register(
  ["WIND", "GUST", "BREEZE", "GALE", "ZEPHYR", "BREATH", "WHIRL", "AIR", "STORM", "TORNADO", "CYCLONE", "HURRICANE", "VACUUM", "WHIRLWIND"], 
  ["air"]
);

// EARTH / STONE
register(
  ["EARTH", "STONE", "ROCK", "QUAKE", "RUMBLE", "TREMOR", "BOULDER", "CLAY", "DUST", "GRAVEL", "SAND", "SOIL", "MUD", "DIRT", "CRAG", "CANYON", "CAVE", "MOUNTAIN", "HILL"], 
  ["earth"]
);

// NATURE / PLANT
register(
  ["ROOT", "VINE", "GROW", "SEED", "BLOOM", "LEAF", "SPROUT", "NECTAR", "WOOD", "TREE"], 
  ["nature"]
);

// DARK / CURSE
register(
  ["DARK", "SHADOW", "CURSE", "VOID", "NIGHT", "HEX"], 
  ["dark"]
);

// PSYCHIC / MIND (Willpower / WP-focused)
register(
  ["MIND", "PSYCHIC", "PSY", "THOUGHT", "HAUNT", "INVADE", "MANIPULATE", "CONTROL", "BRAIN", "INSANE"],
  ["mind", "psychic"]
);

// TAUNT / PROVOKE (verbal mind attacks)
register(
  ["TAUNT", "INSULT", "JEER", "PROVOKE", "DERIDE", "RIDICULE"],
  ["taunt"]
);

// LOUD / SONIC (WP damage)
register(
  ["YELL", "SHOUT", "ROAR", "SCREECH", "SCREAM", "BOOM", "BELLOW", "HOWL", "CRASH", "CLAMOR", "RESONATE", "DIN", "BANG", "BLARE", "BLAST", "BLUSTER", "THUNDER", "NOISE", "CACOPHONY", "SOUND"],
  ["loud"]
);

// STATUS / MISC
register(
  ["FEAR", "TERROR", "SCARE", "PANIC", "FRIGHT", "DREAD", "DANGER", "ALARM"], 
  ["fear"]
);
register(
  ["SILENCE", "MUTE", "HUSH", "SHUSH", "QUIET", "STIFLE", "SQUELCH"], 
  ["silence"]
);
register(
  ["SLEEP", "NAP", "SLUMBER", "SNOOZE", "DREAM", "ZZZ"], 
  ["sleep"]
);
register(
  ["NIGHTMARE"],
  ["sleep", "fear", "dark"]
)
register(
  ["ARMOR", "SHIELD", "PROTECT", "GUARD", "BARRIER", "SHELL", "WARD", "AEGIS", "DEFEND", "CLOAK", "COVERING"], 
  ["shield"]
);
register(
  ["SUMMON", "CALL", "CONJURE", "BECKON", "FAMILIAR"], 
  ["summon"]
);
register(
  ["BLEED", "GASH", "WOUND", "GORE", "BLOOD", "HEMORRHAGE"], 
  ["bleed"]
);
register(
  ["PIERCE", "PUNCTURE", "THRUST", "SPEAR", "LANCE"], 
  ["pierce"]
);
register(
  ["BRIBE", "COIN", "GOLD", "TREAT", "MONEY", "PAY", "RICHES", "WEALTH", "TREASURE"], 
  ["bribe"]
);

// --- MORE PHYSICAL / STANDARD ATTACKS (HP) ---
register(
  ["SMITE", "BONK", "WHACK", "JAB", "PUMMEL", "CLUB", "HEAVE", "SHOVE", "RAM", "SLUG", "THUMP", "POUND"],
  ["blunt"]
);
register(
  ["RIP", "REND", "HACK", "HEW", "FELL", "SLAUGHTER", "GORE", "GASH"],
  ["blade", "bleed"]
);
register(
  ["ARROW", "BOLT", "BULLET", "SHOT", "DART", "SPEAR", "LANCE"],
  ["pierce"]
);
register(
  ["STRIKE", "ASSAULT", "AMBUSH", "BRAWL", "SKIRMISH"],
  ["blunt"]
);

// --- ELEMENTAL / MAGIC EXPANSIONS (HP unless otherwise specified) ---
register(
  ["FIREBALL", "INCINERATE", "CINDER", "SCORCHED", "SINGE", "FIREBRAND", "EMBERSTORM"],
  ["fire"]
);
register(
  ["DELUGE", "DROWN", "TSUNAMI", "WAVE", "FLOOD"],
  ["water"]
);
register(
  ["ICICLE", "FROSTBITE", "HAIL", "SLEETSTORM", "PERMAFROST"],
  ["ice"]
);
register(
  ["SHOCKWAVE", "ELECTROCUTE", "SURGE", "CURRENT", "SPARKS", "ARC", "LIGHTNING", "THUNDER"],
  ["electric"]
);
register(
  ["TORNADO", "WHIRLWIND", "VACUUM", "GALEFORCE", "TURBULENCE"],
  ["air"]
);
register(
  ["EARTHCRACK", "QUAKE", "BOULDER", "ROCKSLIDE", "STONEFALL"],
  ["earth"]
);
register(
  ["ENTANGLE", "VINESPRING", "BRAMBLE", "THORNS"],
  ["nature"]
);
register(
  ["ROTTENBITE", "FESTER", "MOLD", "BLIGHT", "PUTRID"],
  ["poison"]
);

// --- HOLY / UNHOLY ---
register(
  ["SMITE", "EXORCISE", "BAPTIZE", "SANCTIFY", "ANNOINT"],
  ["holy"]
);
register(
  ["HEX", "DEFILE", "DREADCURSE", "MALISON", "BANISH"],
  ["dark"]
);

// --- PSYCHIC / WP-Focused (target: wp) ---
register(
  ["CHARM", "ENCHANT", "BEWITCH", "FASCINATE", "MESMERIZE", "LURE", "TEMPT"],
  ["mind", "psychic"]
);
register(
  ["CONFUSE", "QUIZ", "BOGGLE", "HALLUCINATE", "DELIRIUM", "PARANOIA", "DELUSION", "MADNESS", "PAIN", "AGONY", "TORMENT", "ANGUISH", "SUFFERING"],
  ["mind"]
);
register(
  ["WHISPER", "WHISPERED", "MURMUR", "INSINUATE", "PSYCHOWHISPER"],
  ["taunt", "mind"]
);
register(
  ["INSULT", "TAUNT", "JEER", "PROVOKE", "DERIDE", "RIDICULE", "SNEER", "BULLY"],
  ["taunt"]
);
register(
  ["ENRAGE", "SUBVERT", "SABOTAGE", "MANIPULATE", "COERCE"],
  ["mind", "dark"]
);

// --- STATUS / UTILITY EXTENSIONS ---
register(
  ["REPEL", "WARD", "BARRIER", "Aegis".toUpperCase()],
  ["shield"]
);
register(
  ["REJUVENATE", "REVIVE", "REVITALIZE", "RENEW"],
  ["heal"]
);
register(
  ["SNEAK", "HIDE", "VANISH", "CAMOUFLAGE", "SHADOWSTEP"],
  ["motion", "stealth"]
);
register(
  ["BIND", "TETHER", "SNARE", "TRAP", "STOP", "HALT", "RESTRAIN"],
  ["stun"]
);
register(
  ["CALL", "SUMMON", "CONJURE", "BECKON", "FAMILIAR", "SPIRIT"],
  ["summon"]
);

// --- SOCIAL / ECONOMIC ---
register(
  ["HAGGLE", "BARGAIN", "NEGOTIATE", "PLEAD"],
  ["bribe"]
);
register(
  ["GIFT", "OFFER", "TRIBUTE", "PRESENT"],
  ["bribe", "holy"]
);

register(
  ["SIGH", "BREATH", "INHALE", "EXHALE", "BLOW"],
  ["air"]
);
register(
  ["GLARE", "STARE", "GAPE", "SCOWL"],
  ["mind", "taunt"]
);

// --- AFFIX-LEVEL VOCABULARY (from enemy affixes) ---
register(["INCENDIO", "CONFLARE", "CONFLAGRATE", "APOCALYPSE"], ["fire"]);
register(["MONSOON"], ["water"]);
register(["TEMPEST"], ["air"]);
register(["NOCTURNAL", "OBLIVION", "DARKNESS"], ["dark"]);
register(["CHAIN", "THUNDERCLAP"], ["electric"]);
register(["OVERGROWTH", "FORESTCALL"], ["nature"]);
register(["RUPTURE", "LANDSLIDE", "CATACLYSM"], ["earth"]);
register(["SNIPER", "VOLLEY"], ["pierce"]);

export const SPELLBOOK = spellList;