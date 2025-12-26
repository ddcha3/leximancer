// --- IMPORTS ---
import { PLAYER_DEFENSE, LETTER_SCORES } from "../data/player";
import { TAG_EMOJIS } from "../data/tags";
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
  const stemmedWord = stemmer(word).toUpperCase();
  const upperWord = word.toUpperCase();
  console.log(`Resolving spell: "${word}" (stem: "${stemmedWord}")`);
  // 1. NLP TAGGING
  const doc = compromise(word);
  const json = doc.json();
  let posTags = [];
  if (json[0] && json[0].terms[0]) {
      posTags = json[0].terms[0].tags.map(t => t.toLowerCase());
  }
  const meaningfulPos = posTags.find(t => ['noun', 'verb', 'adjective', 'adverb'].includes(t));
  
  // 2. GET BASE DATA
  const spellData = SPELLBOOK[stemmedWord] || SPELLBOOK[upperWord];
  let tags = [...(spellData?.tags || [])];
  if (meaningfulPos) tags.push(meaningfulPos);

  // Determine target stat (hp vs wp): explicit spell setting wins, otherwise POS rules
  let inferredTarget = 'hp';
  if (spellData?.target) {
    inferredTarget = spellData.target;
  } else if (meaningfulPos) {
    inferredTarget = (['adjective', 'adverb'].includes(meaningfulPos) ? 'wp' : 'hp');
  }
  
  // 3. CALCULATE BASE POWER
  let basePower = 0;
  
  if (isPlayerCasting) {
    // CHECK FOR CHARACTER OVERRIDES (e.g., custom calculateBasePower)
    if (caster.calculateBasePower) {
        basePower = caster.calculateBasePower(upperWord);
    } else {
        basePower = defaultCalculatePower(upperWord);
    }
  } else {
    // Enemy logic remains simple
     basePower = upperWord.length;
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
    damage: 0, targetStat: inferredTarget, heal: 0, status: null,
    logs: [...stats.logs], // Add class-specific logs
    tags: tags, emoji: "✨"
  };

  // --- STANDARD LOGIC (Simplified for brevity) ---
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
    result.emoji = "💖";
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
    // result.emoji = "😋";
    result.logs.push(`> A delicious snack.`);
    // }
  }

  // CC
  if (tags.includes("ice")) {
    // 50% chance to stun? Or guaranteed? Let's say guaranteed for now.
    result.status = "stun";
    result.logs.push(`> Freezing effect!`);
    // result.emoji = "🧊";
  }

  if (tags.includes("stun")) {
    result.status = "stun";
    result.logs.push(`> Stunned!`);
    // result.emoji = "😵‍💫";
  }

  if (tags.includes("silence")) {
    result.status = "silence";
    result.logs.push(`> Magical silence!`);
    // result.emoji = "🔇";
  }

  // 6. FINAL DAMAGE CALCULATION
  if (isAttack) {
    let finalMult = stats.multiplier; // Start with Class Multiplier
    let seerTriggered = false;

    // Target Weakness/Resistance
    tags.forEach(tag => {
      if (target.weaknesses && target.weaknesses[tag]) {
        const weak = target.weaknesses[tag];
        finalMult *= weak.mult;
        result.logs.push(`> ${weak.msg} (x${weak.mult})`);
        if (weak.target) result.targetStat = weak.target;
        // Seer bonus: +3 flat damage if the caster is the Seer and a weakness matched
        if (caster && caster.id === 'seer') seerTriggered = true;
      } else if (target.resistances && target.resistances[tag]) {
        const res = target.resistances[tag];
        finalMult *= res.mult;
        result.logs.push(`> ${res.msg} (x${res.mult})`);
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
      const res = target.resistances && target.resistances[dotTag];
      if (res && res.mult === 0) {
        result.logs.push(`> ${res.msg} (immune to ${dotTag}).`);
      } else {
        const duration = 3; // turns
        // base per-tick scaled from basePower (spread over duration)
        let perTick = Math.max(1, Math.floor((basePower + stats.flatBonus) / Math.max(1, duration)));
        let mult = 1.0;
        if (target.weaknesses && target.weaknesses[dotTag]) {
          mult *= target.weaknesses[dotTag].mult;
          result.logs.push(`> ${target.weaknesses[dotTag].msg} (x${target.weaknesses[dotTag].mult})`);
          if (target.weaknesses[dotTag].target) result.targetStat = target.weaknesses[dotTag].target;
        } else if (res) {
          mult *= res.mult;
          result.logs.push(`> ${res.msg} (x${res.mult})`);
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
    }
  });

  // 8. SHIELD: protective status that blocks a small amount of damage from next hit
  if (tags.includes('shield')) {
    const blockAmount = 2;
    const duration = 1; // next hit
    // Default: shield applies to the caster (self-buff)
    result.statusEffect = { tag: 'shield', ticks: duration, block: blockAmount, applyTo: 'caster' };
    result.logs.push(`> A protective barrier forms, blocking ${blockAmount} damage from the next attack.`);
    result.emoji = result.emoji || '🛡️';
  }
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