const spellList = {};

const register = (words, tags = [], opts = {}) => {
  words.forEach(word => {
    spellList[word] = { tags, ...opts };
  });
};

// --- CONTENT DEFINITION ---

// FIRE
register(
  ["FIRE", "BURN", "HEAT", "HOT", "LAVA", "ASH", "COAL", "SEAR", "CHAR", "PYRE", "FLAME", "BLAZE", "IGNITE", "INFERNO", "HELLFIRE", "SCORCH", "EMBER", "SMOKE", "TORCH", "CHARCOAL"], 
  ["fire"]
);

// WATER & ICE
register(
  ["WATER", "AQUA", "RAIN", "MIST", "SOAK", "FLOOD", "TSUNAMI", "STEAM", "DEW", "POOL", "SPLASH", "DRENCH", "DRIP", "DRIZZLE"], 
  ["water"]
);
register(
  ["POND", "LAKE", "RIVER", "OCEAN", "SEA", "WAVE", "SURGE", "CURRENT", "STREAM", "CREEK", "BROOK", "FALLS"], 
  ["water"]
)
register(
  ["WASH", "BATH", "SHOWER", "RINSE", "BATHE", "LATHER"],
  ["water", "clean"]
)
register(
  ["ICE", "SNOW", "COLD", "FROST", "FREEZE", "CHILL", "GLACIER", "BLIZZARD", "SLEET", "AVALANCHE", "HAIL", "PERMAFROST", "ICICLE", "FROSTBITE"], 
  ["ice"]
);

// PHYSICAL (Merged force, weapon -> blunt/blade)
register(
  ["HIT", "BASH", "BEAT", "KICK", "PUNCH", "STRIKE", "SMASH", "CRUSH", "SLAM", "BREAK", "STICK", "ROD", "STAFF", "CLUB", "MACE", "HAMMER", "FIST", "GAUNTLET", "BAT", "CUDGEL", "SLEDGE"], 
  ["blunt"]
);
register(
  ["CUT", "SLICE", "STAB", "SLASH", "CHOP", "CLEAVE", "SWORD", "AXE", "KNIFE", "DAGGER", "SABER", "MACHEETE", "SICKLE", "SCYTHE", "BLADE", "HACK", "REAP", "FELL", "GASH", "RIP", "REND", "SLAUGHTER"], 
  ["blade"]
);

// UTILITY
register(
  ["HEAL", "HEALTH", "MEND", "CURE", "REST", "POTION", "REGEN"], 
  ["heal"]
);

// LIFESTEAL / DRAIN
register(
  ["DRAIN", "SIPHON", "LIFESTEAL", "CONSUME", "DEVOUR", "LEECH", "ABSORB"],
  ["lifesteal"]
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
  ["PIZZA", "BURGER", "SANDWICH", "PASTA", "SOUP", "SALAD", "CAKE", "COOKIE", "CANDY", "CHOCOLATE", "ICECREAM", "DESSERT", "BREAKFAST", "LUNCH", "DINNER", "SUPPER"], 
  ["food"]
)
register(
  ["RUN", "FLEE", "ESCAPE", "LEAVE", "BOLT", "SPRINT"], 
  ["motion"] // mapped to 'flee' logic in engine
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
  ["DAMN", "DARN", "DRAT", "DANG", "FRICK", "HECK"],
  ["profanity"]
);
register(
  ["FUCK", "FUCKING", "FUCKER", "FUCKED", "FUCKS", "FUCKY", "MOTHERFUCKER"],
  ["profanity"]
);

// CLEAN / SANITIZE
register(
  ["CLEAN", "CLEANSE", "RINSE", "SCRUB", "SANITIZE", "BLEACH", "SOAP", "SUDS", "MOP", "SWEEP", "BROOM", "POLISH", "DEODORIZE", "PURGE"],
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
  ["ROOT", "VINE", "GROW", "SEED", "BLOOM", "LEAF", "SPROUT", "NECTAR"], 
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
  ["mind", "psychic"],
  { target: 'wp' }
);

// TAUNT / PROVOKE (verbal mind attacks)
register(
  ["TAUNT", "INSULT", "JEER", "PROVOKE", "DERIDE", "RIDICULE"],
  ["taunt"],
  { target: 'wp' }
);

// LOUD / SONIC (WP damage)
register(
  ["YELL", "SHOUT", "ROAR", "SCREECH", "SCREAM", "BOOM", "BELLOW", "CRASH", "CLAMOR", "RESONATE", "DIN"],
  ["loud"],
  { target: 'wp' }
);

// STATUS / MISC
register(
  ["FEAR", "TERROR", "SCARE", "PANIC", "FRIGHT", "DREAD", "DANGER", "ALARM"], 
  ["fear"],
  { target: 'wp' }
);
register(
  ["SILENCE", "MUTE", "HUSH", "SHUSH", "QUIET", "STIFLE", "SQUELCH"], 
  ["silence"],
  { target: 'wp' }
);
register(
  ["SLEEP", "NAP", "SLUMBER", "SNOOZE", "DREAM", "ZZZ"], 
  ["sleep"],
  { target: 'wp' }
);
register(
  ["NIGHTMARE"],
  ["sleep", "fear", "dark"],
  { target: 'wp' }
)
register(
  ["ARMOR", "SHIELD", "PROTECT", "GUARD", "BARRIER"], 
  ["shield"]
);
register(
  ["SUMMON", "CALL", "CONJURE", "BECKON", "FAMILIAR"], 
  ["summon"]
);
register(
  ["BLEED", "GASH", "WOUND", "GORE"], 
  ["bleed"]
);
register(
  ["PIERCE", "PUNCTURE", "THRUST", "SPEAR", "LANCE"], 
  ["pierce"]
);
register(
  ["BRIBE", "COIN", "GOLD", "TREAT"], 
  ["bribe"],
  { target: 'wp' }
);

// --- MORE PHYSICAL / STANDARD ATTACKS (HP) ---
register(
  ["SMITE", "WHACK", "BLOW", "JAB", "PUMMEL", "CLUB", "HEAVE", "SHOVE", "RAM", "SLUG", "THUMP", "POUND"],
  ["blunt"]
);
register(
  ["RIP", "REND", "HACK", "HEW", "FELL", "SLAUGHTER", "GORE", "GASH"],
  ["blade", "bleed"]
);
register(
  ["ARROW", "BOLT", "BULLET", "SHOT", "FIREARROW", "DART", "SPEAR", "LANCE"],
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
  ["DELUGE", "DROWN", "TSUNAMI", "WAVE", "SURGE", "FLOOD"],
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
  ["mind", "psychic"],
  { target: 'wp' }
);
register(
  ["CONFUSE", "BOGGLE", "HALLUCINATE", "DELIRIUM", "PARANOIA", "DELUSION", "MADNESS"],
  ["mind"],
  { target: 'wp' }
);
register(
  ["WHISPER", "WHISPERED", "MURMUR", "INSINUATE", "PSYCHOWHISPER"],
  ["taunt", "mind"],
  { target: 'wp' }
);
register(
  ["INSULT", "TAUNT", "JEER", "PROVOKE", "DERIDE", "RIDICULE", "SNEER"],
  ["taunt"],
  { target: 'wp' }
);
register(
  ["ENRAGE", "SUBVERT", "SABOTAGE", "MANIPULATE", "COERCE"],
  ["mind", "dark"],
  { target: 'wp' }
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
  ["bribe"],
  { target: 'wp' }
);
register(
  ["GIFT", "OFFER", "TRIBUTE", "PRESENT"],
  ["bribe", "holy"],
  { target: 'wp' }
);

// --- EXTRA FLAVOR WORDS (mixed)
register(
  ["ROAR", "BELLOW", "HOWL", "SCREAM"],
  ["blunt"],
);
register(
  ["SIGH", "BREATH", "INHALE", "EXHALE"],
  ["air"]
);
register(
  ["GLARE", "STARE", "GAPE", "SCOWL"],
  ["mind", "taunt"],
  { target: 'wp' }
);

export const SPELLBOOK = spellList;