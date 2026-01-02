import { LETTER_SCORES } from "../data/player";
import { TAG_EMOJIS, TAG_TARGETS, TAG_SOUNDS } from "../data/tags";
import { SPELLBOOK } from '../data/spells';
import { STATUS_EFFECTS } from '../data/statusEffects';
import { FAMILIARS } from '../data/familiars';

console.log("Loaded SPELLBOOK with", Object.keys(SPELLBOOK).length, "spells.");

// Standardized multipliers (weakness/resistance/immunity)
const WEAKNESS_MULT = 2.0;
const RESISTANCE_MULT = 0.5;
const IMMUNITY_MULT = 0.0;

const defaultCalculatePower = (word) => {
  const upper = word.toUpperCase();
  let score = 0;
  for (let char of upper) {
    score += LETTER_SCORES[char] || 1;
  }
  // Remove length bonuses for now
  // if (upper.length > 4) score += (upper.length - 4) * 2;
  return score;
};

export function resolveSpell(word, caster, target, isPlayerCasting = true, playSound = null) {
  const upperWord = word.toUpperCase();
  let tags = SPELLBOOK[upperWord] ? SPELLBOOK[upperWord] : ['concrete'];
  console.log(`Spell data for "${word}":`, tags);

  // PLAY SOUND EFFECT
  if (playSound) {
    const soundTag = tags.find(t => TAG_SOUNDS[t]);
    if (soundTag) {
      playSound(TAG_SOUNDS[soundTag], { volume: 0.7 });
    } else {
      playSound('abilities/woosh_b', { volume: 0.5 });
    }
  }

  // Determine target stat (hp vs wp)
  let inferredTarget = 'hp';
  // Infer target from tag if possible. 
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
  if (caster.id === 'summoner') {
    // If summoner is summoning a familiar, don't attack
    const familiarData = FAMILIARS.find(f => f.name.toUpperCase() === word);
    if (familiarData) {
      isAttack = false;
      result.emoji = familiarData.emoji;
      result.isSummon = true;
    }
  }

  if (tags.includes("motion")) {
    result.logs.push(`> Increased speed!`);
    // result.emoji = "🏃";
  }

  if (tags.includes("heal")) {
    result.heal = basePower * 2;
    isAttack = false;
    result.logs.push(`> Restoration magic!`);
  }

  if (tags.includes("food")) {
    isAttack = false;
    result.heal = Math.round(basePower * 1.5);
    result.logs.push(`> A delicious snack!`);
  }

  // CC
  // Helper to check tag immunities on the target
  const isImmuneTo = (t) => Array.isArray(target.immunities) && target.immunities.includes(t);

  if (tags.includes("ice")) {
    if (!isImmuneTo('ice')) {
      // 50% chance to stun
      if (Math.random() < 0.5) {
        result.status = STATUS_EFFECTS.FREEZE;
        // result.logs.push(`> Freezing effect!`);
      }
    } else {
      result.logs.push(`> Immune to ice.`);
    }
  }

  if (tags.includes("stun")) {
    if (!isImmuneTo('stun')) {
      result.status = STATUS_EFFECTS.STUN;
      // result.logs.push(`> Stunned!`);
    } else {
      result.logs.push(`> Immune to stun.`);
    }
    // result.emoji = "😵‍💫";
  }

  if (tags.includes("silence")) {
    if (!isImmuneTo('silence')) {
      result.status = STATUS_EFFECTS.SILENCE;
      // result.logs.push(`> Magical silence!`);
    } else {
      result.logs.push(`> Immune to silence.`);
    }
    // result.emoji = "🔇";
  }

  if (tags.includes("chaos")) {
    if (!isImmuneTo('confusion')) {
      result.status = STATUS_EFFECTS.CONFUSION;
      // result.logs.push(`> Confusion!`);
    } else {
      result.logs.push(`> Immune to confusion.`);
    }
  }

  if (tags.includes('dark')) {
    const duration = 3;
    result.statusEffect = { tag: STATUS_EFFECTS.FEAR, ticks: duration };
    // result.logs.push(`> Fear! Defense lowered for ${duration} turns.`);
  }

  if (tags.includes('luck')) {
    if (Math.random() < 0.05) {
      result.instantKill = true;
      result.logs.push(`> 🎲 JACKPOT! Instant defeat!`);
      result.emoji = '🎰';
    }
  }

  if (tags.includes('holy')) {
    result.cleanse = true;
    result.logs.push(`> Divine purification!`);
  }

  if (tags.includes('shield')) {
    isAttack = false;
    const blockAmount = Math.round(basePower * 1.5);
    const duration = 1; // next hit
    // Default: shield applies to the caster (self-buff)
    result.statusEffect = { tag: STATUS_EFFECTS.SHIELD, ticks: duration, block: blockAmount, applyTo: 'caster' };
    result.logs.push(`> Blocks ${blockAmount} damage from the next attack.`);
    result.emoji = result.emoji || '🛡️';
  }

  // 6. FINAL DAMAGE CALCULATION
  if (isAttack) {
    let finalMult = stats.multiplier; // Start with Class Multiplier
    let knowerTriggered = false;

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
        // Knower bonus: +3 flat damage if the caster is the Knower and a weakness matched
        if (caster && caster.id === 'knower') knowerTriggered = true;
      } else if (Array.isArray(target.resistances) && target.resistances.includes(tag)) {
        finalMult *= RESISTANCE_MULT;
        result.logs.push(`> Resistant to ${tag}! (x${RESISTANCE_MULT})`);
      }
    });

    // Formula: (Base + FlatBonus) * Multiplier
    result.damage = Math.floor((basePower + stats.flatBonus) * finalMult);

    if (knowerTriggered) {
      result.damage += 3;
      result.logs.push(`> (Knower) Weakness Bonus +3`);
    }
    
    // For Blood Mage, heal half of the damage dealt. Only for physical damage.
    if (caster && caster.id === 'bloodmage' && inferredTarget === 'hp')
    {
        result.heal = Math.floor(result.damage / 4);
    }
  }

  // 7. DOT EFFECTS (bleed / poison): create a small lingering effect unless target is immune
  const dotTags = ["sharp", "poison"];
  dotTags.forEach(dotTag => {
    if (tags.includes(dotTag)) {
      const effectTag = dotTag === 'sharp' ? STATUS_EFFECTS.BLEED : STATUS_EFFECTS.POISON;

      // Immunity trumps DOT
      if (Array.isArray(target.immunities) && target.immunities.includes(dotTag)) {
        result.logs.push(`> Immune to ${dotTag}! (immune).`);
        return;
      }
      
      const duration = 3; // turns
      // base per-tick scaled from basePower (spread over duration)
      let perTick = Math.max(1, Math.floor((basePower + stats.flatBonus) / Math.max(1, duration)));
      let mult = 1.0;
      if (target.weaknesses.includes(dotTag)) {
        mult *= WEAKNESS_MULT;
        result.logs.push(`> Weak to ${dotTag}! (x${WEAKNESS_MULT})`);
      } else if (target.resistances.includes(dotTag)) {
        mult *= RESISTANCE_MULT;
        result.logs.push(`> Resistant to ${dotTag}! (x${RESISTANCE_MULT})`);
      }

      // Apply multiplier to per-tick (use absolute so negative multipliers become negative ticks which can heal)
      perTick = Math.floor(perTick * Math.abs(mult));
      if (perTick > 0) {
        result.dot = { tag: effectTag, ticks: duration, damagePerTick: perTick, mult };
        result.logs.push(`> ${effectTag.charAt(0).toUpperCase() + effectTag.slice(1)} will deal *${perTick}* for ${duration} turns.`);
      } else {
        result.logs.push(`> No lasting ${dotTag} effect.`);
      }
    }
  });

  // CHARM: reduce target's outgoing damage for a few turns
  if (tags.includes('charm')) {
    const duration = 3;
    // reduceMult is the multiplier to multiply outgoing damage by (0.5 = half damage)
    result.statusEffect = { tag: STATUS_EFFECTS.CHARM, ticks: duration, reduceMult: 0.5 };
    result.logs.push(`> The target is charmed and will deal reduced damage for ${duration} turns.`);
  }

  // POWER: increase damage for hp-targeting spells for the next 2 turns
  if (tags.includes('power')) {
    const duration = 3;
    result.statusEffect = { tag: STATUS_EFFECTS.POWER_BUFF, ticks: duration, damageMult: 1.5, targetType: 'hp', applyTo: 'caster' };
    result.logs.push(`> Physical might increased!`);
  }

  // INTELLIGENCE: increase damage for wp-targeting spells for the next 2 turns
  if (tags.includes('intelligence')) {
    const duration = 3;
    result.statusEffect = { tag: STATUS_EFFECTS.INTELLIGENCE_BUFF, ticks: duration, damageMult: 1.5, targetType: 'wp', applyTo: 'caster' };
    result.logs.push(`> Mental prowess increased!`);
  }
  // Prefer an elemental tag emoji when multiple tags are present (elemental > physical)
  const elementalPriority = ['fire','water','ice','electric','air','earth','plant','poison'];
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

  return result;
}
