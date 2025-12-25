// --- IMPORTS ---
import { PLAYER_DEFENSE, LETTER_SCORES } from "../data/player";
import { TAG_EMOJIS } from "../data/tags";
import { ENCOUNTERS } from '../data/enemies';
import { SPELLBOOK } from '../data/spells';
import { stemmer } from 'stemmer';
import compromise from 'compromise';

// Default scoring strategy (The "Ramp")
const defaultCalculatePower = (word) => {
  const upper = word.toUpperCase();
  let score = 0;
  for (let char of upper) {
    score += LETTER_SCORES[char] || 1;
  }
  // Standard Ramp: Bonus for length > 4
  if (upper.length > 4) score += (upper.length - 4) * 2;
  return score;
};

export function resolveSpell(word, caster, target, isPlayerCasting = true) {
  const upperWord = word.toUpperCase();
  const stemmedWord = stemmer(upperWord);
  
  // 1. NLP TAGGING
  const doc = compromise(word);
  const json = doc.json();
  let posTags = [];
  if (json[0] && json[0].terms[0]) {
      posTags = json[0].terms[0].tags.map(t => t.toLowerCase());
  }
  const meaningfulPos = posTags.find(t => ['noun', 'verb', 'adjective'].includes(t));

  // 2. GET BASE DATA
  const spellData = SPELLBOOK[stemmedWord] || SPELLBOOK[upperWord];
  let tags = [...(spellData?.tags || [])];
  if (meaningfulPos) tags.push(meaningfulPos);
  
  // 3. CALCULATE BASE POWER
  let basePower = 0;
  
  if (isPlayerCasting) {
    // CHECK FOR DUELIST OVERRIDE
    if (caster.calculateBasePower) {
        basePower = caster.calculateBasePower(upperWord);
    } else {
        basePower = defaultCalculatePower(upperWord);
    }
  } else {
    // Enemy logic remains simple
    basePower = spellData?.power || upperWord.length;
  }

  // 4. APPLY CHARACTER HOOKS 
  let stats = {
      multiplier: 1.0,
      flatBonus: 0,
      logs: []
  };

  // If the Caster has an 'onCast' hook, run it
  if (caster.onCast) {
      stats = caster.onCast(stats, tags, upperWord);
  }

  // 5. SETUP RESULT
  const result = {
    damage: 0, targetStat: 'hp', heal: 0, status: null,
    logs: [...stats.logs], // Add class-specific logs
    tags: tags, emoji: "✨"
  };

  // --- STANDARD LOGIC (Simplified for brevity) ---
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

  // 6. FINAL DAMAGE CALCULATION
  if (isAttack) {
    let finalMult = stats.multiplier; // Start with Class Multiplier

    // Target Weakness/Resistance
    tags.forEach(tag => {
      if (target.weaknesses && target.weaknesses[tag]) {
        const weak = target.weaknesses[tag];
        finalMult *= weak.mult;
        result.logs.push(`> ${weak.msg} (x${weak.mult})`);
        if (weak.target) result.targetStat = weak.target;
      } else if (target.resistances && target.resistances[tag]) {
        const res = target.resistances[tag];
        finalMult *= res.mult;
        result.logs.push(`> ${res.msg} (x${res.mult})`);
      }
    });

    // Formula: (Base + FlatBonus) * Multiplier
    result.damage = Math.floor((basePower + stats.flatBonus) * finalMult);
  }

  return result;
}