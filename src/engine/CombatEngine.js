// --- IMPORTS ---
import { PLAYER_DEFENSE, LETTER_SCORES } from "../data/player";
import { TAG_EMOJIS } from "../data/tags";
import { ENCOUNTERS } from '../data/enemies';
import { SPELLBOOK } from '../data/spells';

// Add imports for stemming and NLP
import natural from 'natural';
import compromise from 'compromise';

// --- STEMMER INITIALIZATION ---
const stemmer = natural.PorterStemmer; // You can choose other stemmers if needed

// --- DAMAGE HELPER (MODIFIED) ---
export const calculateWordPower = (word) => {
  const upper = word.toUpperCase();
  const len = upper.length;
  
  let baseScore = 0;
  for (let i = 0; i < len; i++) {
    const char = upper[i];
    baseScore += LETTER_SCORES[char] || 1; 
  }
  
  if (len > 4) baseScore += (len - 4) * 2;
  return baseScore;
};

// --- SPELL RESOLUTION LOGIC ---
export function resolveSpell(word, caster, target, isPlayerCasting = true) {
  const upperWord = word.toUpperCase();
  
 // 1. STEMMING
  const stemmedWord = stemmer.stem(upperWord); // (Assumes you are using the 'stemmer' lib or similar)

  // 3. DETERMINE SPELL DATA (CHECK STEMMED WORD FIRST)
  const spellData = SPELLBOOK[stemmedWord] || SPELLBOOK[upperWord]; // Check stem, then original
  
  let basePower = 0;
  let tags = [...(spellData?.tags || [])];
  
   // 2. PART-OF-SPEECH TAGGING (Fixed)
  const doc = compromise(word); 
  const json = doc.json();
  
  // Safely extract tags from the first word of the first sentence found
  let posTags = [];
  if (json[0] && json[0].terms[0]) {
      // .tags is an Array like ["Noun", "Singular", "Person"]
      posTags = json[0].terms[0].tags.map(t => t.toLowerCase());
  }

  // Filter out the 'common' tags compromise adds that we don't care about
  // (We usually just want Noun, Verb, Adjective)
  const meaningfulPos = posTags.find(t => ['noun', 'verb', 'adjective', 'adverb'].includes(t));
  
  if (meaningfulPos) {
      tags.push(meaningfulPos);
  } // Start with tags from spellbook
  
  if (isPlayerCasting) {
    basePower = calculateWordPower(upperWord);
  } else {
    // Enemy Casting: Use explicit power, or length if not in book
    basePower = spellData?.power || upperWord.length;
  }

  // 4. INITIALIZE RESULT OBJECT
  const result = {
    damage: 0, targetStat: 'hp', heal: 0, status: null,
    logs: [], tags: tags, emoji: "✨"
  };

  // Filter out duplicates if any from multiple sources
  result.tags = [...new Set(result.tags)];

  // --- SPECIAL TAG LOGIC ---
  // (This part remains largely the same, but now uses result.tags)
  let isAttack = true;
  
  if (tags.includes("flee")) {
    result.status = "flee";
    result.logs.push(`> Attempting to escape...`);
    result.emoji = "🏃";
    return result;
  }

  if (tags.includes("heal")) {
    result.heal = basePower * 2;
	isAttack = false;
    result.emoji = "💖";
    result.logs.push(`> Restoration magic!`);
  }

  if (tags.includes("food")) {
    // Check if target wants food
    if (target.weaknesses && target.weaknesses["food"]) {
      isAttack = true; // It's a bribe/distraction attack!
      result.emoji = "🍖";
    } else {
      isAttack = false; // Eat it yourself
      result.heal = basePower * 1.5;
      result.emoji = "🍎";
      result.logs.push(`> A delicious snack.`);
    }
  }

  // STUN / ICE
  if (tags.includes("stun") || tags.includes("ice")) {
    // 50% chance to stun? Or guaranteed? Let's say guaranteed for now.
    result.status = "stun";
    result.logs.push(`> Freezing effect!`);
    result.emoji = "🧊";
  }

  // CALCULATE DAMAGE
  if (isAttack) {
    let multipliers = 1.0;
    
    // CHECK TAGS AGAINST TARGET'S WEAKNESSES/RESISTANCES
    tags.forEach(tag => {
      // Apply Player Defense logic here IF ENEMY IS TARGETING PLAYER
      if (isPlayerCasting && target.weaknesses && target.weaknesses[tag]) {
          const weak = target.weaknesses[tag]; multipliers *= weak.mult;
          result.logs.push(`> ${weak.msg} (x${weak.mult})`);
          if (weak.target) result.targetStat = weak.target;
      }
      // Apply Enemy Defense logic here IF PLAYER IS TARGETING ENEMY
      else if (!isPlayerCasting && target.weaknesses && target.weaknesses[tag]) {
          const weak = target.weaknesses[tag];
		  multipliers *= weak.mult;
          result.logs.push(`> ${weak.msg} (x${weak.mult})`);
          if (weak.target) result.targetStat = weak.target;
      }
      // Handle Resistances (for both player and enemy)
      else if (target.resistances && target.resistances[tag]) {
          const res = target.resistances[tag];
		  multipliers *= res.mult;
          result.logs.push(`> ${res.msg} (x${res.mult})`);
      }
    });

    result.damage = Math.max(0, Math.floor(basePower * multipliers));
  }
  
  return result;
}