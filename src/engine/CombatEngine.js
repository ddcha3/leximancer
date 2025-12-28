import { PLAYER_DEFENSE, LETTER_SCORES } from "../data/player";
import { TAG_EMOJIS, TAG_TARGETS } from "../data/tags";
import { SPELLBOOK } from '../data/spells';

// Standardized multipliers (weakness/resistance/immunity)
const WEAKNESS_MULT = 2.0;
const RESISTANCE_MULT = 0.5;
const IMMUNITY_MULT = 0.0;
import { stemmer } from 'stemmer';
import compromise from 'compromise';

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
  const stemmedWord = stemmer(word).toUpperCase();
  const upperWord = word.toUpperCase();
  console.log(`Resolving spell: "${word}" (stem: "${stemmedWord}")`);
  // NLP TAGGING
  const doc = compromise(word);
  const json = doc.json();
  let posTags = [];
  if (json[0] && json[0].terms[0]) {
      posTags = json[0].terms[0].tags.map(t => t.toLowerCase());
  }
  const meaningfulPos = posTags.find(t => ['noun', 'verb', 'adjective', 'adverb'].includes(t));
  
  // GET BASE DATA
  const spellData = SPELLBOOK[stemmedWord] || SPELLBOOK[upperWord];
  let tags = [...(spellData?.tags || [])];
  // if (meaningfulPos) tags.push(meaningfulPos);

  // Determine target stat (hp vs wp)
  let inferredTarget = 'hp';
  // Choose the first tag target
  const tagWithTarget = tags.find(t => TAG_TARGETS[t]);
  if (tagWithTarget) {
    inferredTarget = TAG_TARGETS[tagWithTarget];
  } else if (meaningfulPos) {
    inferredTarget = (['adjective', 'adverb'].includes(meaningfulPos) ? 'wp' : 'hp');
  }
  
  // CALCULATE BASE POWER
  let basePower = 0;
  
  // CHECK FOR CHARACTER OVERRIDES (e.g., custom calculateBasePower)
  if (caster.calculateBasePower) {
      basePower = caster.calculateBasePower(upperWord);
  } else {
      basePower = defaultCalculatePower(upperWord);
  }

  // APPLY CHARACTER HOOKS 
  let stats = {
      multiplier: 1.0,
      flatBonus: 0,
      logs: []
  };

  // If the Caster has an 'onCast' hook, run it
  if (caster.onCast) {
      stats = caster.onCast(stats, tags, upperWord);
  }

  // SET UP RESULT
  const result = {
    damage: 0, targetStat: inferredTarget, heal: 0, status: null,
    logs: [...stats.logs], // Add class-specific logs
    tags: tags, emoji: "✨"
  };

  let isAttack = true;
  if (tags.includes("motion")) {
    result.status = "flee";
    result.logs.push(`> Attempting to escape...`);
    result.emoji = "🏃";
    return result;
  }

  if (tags.includes("heal")) {
    result.heal = basePower * 2;
    isAttack = false;
    // result.emoji = "💖";
    result.logs.push(`> Restoration magic!`);
  }

  if (tags.includes("food")) {
    // Check if target wants food
    // if (target.weaknesses && target.weaknesses["food"]) {
    //   isAttack = true; // It's a bribe/distraction attack!
    //   result.emoji = "🍖";
    // } else {
    isAttack = false; // Eat it yourself
    result.heal = Math.round(basePower * 2);
    result.logs.push(`> A delicious snack.`);
    // }
  }

  // CC
  // Helper to check tag immunities on the target
  const isImmuneTo = (t) => Array.isArray(target.immunities) && target.immunities.includes(t);

  if (tags.includes("ice")) {
    if (!isImmuneTo('ice')) {
      // 50% chance to stun? Or guaranteed? Let's say guaranteed for now.
      result.status = "stun";
      result.logs.push(`> Freezing effect!`);
    } else {
      result.logs.push(`> Immune to ice.`);
    }
    // result.emoji = "🧊";
  }

  if (tags.includes("stun")) {
    if (!isImmuneTo('stun')) {
      result.status = "stun";
      result.logs.push(`> Stunned!`);
    } else {
      result.logs.push(`> Immune to stun.`);
    }
    // result.emoji = "😵‍💫";
  }

  if (tags.includes("silence")) {
    if (!isImmuneTo('silence')) {
      result.status = "silence";
      result.logs.push(`> Magical silence!`);
    } else {
      result.logs.push(`> Immune to silence.`);
    }
    // result.emoji = "🔇";
  }

  if (tags.includes('shield')) {
    isAttack = false;
    const blockAmount = basePower * 1.5;
    const duration = 1; // next hit
    // Default: shield applies to the caster (self-buff)
    result.statusEffect = { tag: 'shield', ticks: duration, block: blockAmount, applyTo: 'caster' };
    result.logs.push(`> Blocks ${blockAmount} damage from the next attack.`);
    result.emoji = result.emoji || '🛡️';
  }

  // 6. FINAL DAMAGE CALCULATION
  if (isAttack) {
    let finalMult = stats.multiplier; // Start with Class Multiplier
    let seerTriggered = false;

    // Target Weakness/Resistance (using standardized multipliers and immunities)
    tags.forEach(tag => {
      // Immunity overrides everything
      if (Array.isArray(target.immunities) && target.immunities.includes(tag)) {
        finalMult *= IMMUNITY_MULT;
        result.logs.push(`> Immune to ${tag}! (no effect)`);
        return;
      }

      if (Array.isArray(target.weaknesses) && target.weaknesses.includes(tag)) {
        finalMult *= WEAKNESS_MULT;
        result.logs.push(`> Weak to ${tag}! (x${WEAKNESS_MULT})`);
        // Seer bonus: +3 flat damage if the caster is the Seer and a weakness matched
        if (caster && caster.id === 'seer') seerTriggered = true;
      } else if (Array.isArray(target.resistances) && target.resistances.includes(tag)) {
        finalMult *= RESISTANCE_MULT;
        result.logs.push(`> Resistant to ${tag}! (x${RESISTANCE_MULT})`);
      }
    });

    // Formula: (Base + FlatBonus) * Multiplier
    result.damage = Math.floor((basePower + stats.flatBonus) * finalMult);

    if (seerTriggered) {
      result.damage += 3;
      result.logs.push(`>(Seer) Weakness Bonus +3`);
    }
  }

  // 7. DOT EFFECTS (bleed / poison): create a small lingering effect unless target is immune
  const dotTags = ["bleed", "poison"];
  dotTags.forEach(dotTag => {
    if (tags.includes(dotTag)) {
      // Immunity trumps DOT
      if (Array.isArray(target.immunities) && target.immunities.includes(dotTag)) {
        result.logs.push(`> Immune to ${dotTag}! (immune).`);
        return;
      }

      const duration = 3; // turns
      // base per-tick scaled from basePower (spread over duration)
      let perTick = Math.max(1, Math.floor((basePower + stats.flatBonus) / Math.max(1, duration)));
      let mult = 1.0;
      if (Array.isArray(target.weaknesses) && target.weaknesses.includes(dotTag)) {
        mult *= WEAKNESS_MULT;
        result.logs.push(`> Weak to ${dotTag}! (x${WEAKNESS_MULT})`);
      } else if (target.weaknesses && target.weaknesses[dotTag]) {
        // Back-compat for object-style weaknesses
        dotMult *= WEAKNESS_MULT;
        result.logs.push(`> Weak to ${dotTag}! (x${WEAKNESS_MULT})`);
      } else if (Array.isArray(target.resistances) && target.resistances.includes(dotTag)) {
        dotMult *= RESISTANCE_MULT;
        result.logs.push(`> Resistant to ${dotTag}! (x${RESISTANCE_MULT})`);
      } else if (target.resistances && target.resistances[dotTag]) {
        // Back-compat for object-style resistances
        mult *= RESISTANCE_MULT;
        result.logs.push(`> Resistant to ${dotTag}! (x${RESISTANCE_MULT})`);
      }
      // Apply multiplier to per-tick (use absolute so negative multipliers become negative ticks which can heal)
      perTick = Math.floor(perTick * Math.abs(mult));
      if (perTick > 0) {
        result.dot = { tag: dotTag, ticks: duration, damagePerTick: perTick, mult };
        result.logs.push(`> ${dotTag.charAt(0).toUpperCase() + dotTag.slice(1)} will deal *${perTick}* for ${duration} turns.`);
      } else {
        result.logs.push(`> No lasting ${dotTag} effect.`);
      }
    }
  });

  // CUTE: reduce target's outgoing damage for a few turns
  if (tags.includes('cute')) {
    const duration = 3;
    // reduceMult is the multiplier to multiply outgoing damage by (0.5 = half damage)
    result.statusEffect = { tag: 'cute', ticks: duration, reduceMult: 0.5 };
    result.logs.push(`> The target is charmed and will deal reduced damage for ${duration} turns.`);
    result.emoji = result.emoji || '🥹';
  }
  // Prefer an elemental tag emoji when multiple tags are present (elemental > physical)
  const elementalPriority = ['fire','water','ice','electric','air','earth','nature','poison'];
  let chosenTag = null;
  for (let el of elementalPriority) {
    if (tags.includes(el) && TAG_EMOJIS[el]) { chosenTag = el; break; }
  }
  // Fallback: any tag that has an emoji
  if (!chosenTag) {
    chosenTag = tags.find(t => TAG_EMOJIS[t]);
  }
  if (chosenTag && result.emoji === '✨') {
    result.emoji = TAG_EMOJIS[chosenTag];
  }

  // Default visual feedback by target stat (HP/WP) for both player and enemy if still using the generic emoji
  if (result.emoji === '✨') {
    if (result.targetStat === 'hp') result.emoji = '💥';
    else if (result.targetStat === 'wp') result.emoji = '🌀';
  }

  return result;
}