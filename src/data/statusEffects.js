export const STATUS_EFFECTS = {
    POISON: 'poison',
    BLEED: 'bleed',
    STUN: 'stun',
    SHIELD: 'shield',
    CHARM: 'charm',
    FREEZE: 'freeze',
    SILENCE: 'silence',
    CONFUSION: 'confusion',
};

export const STATUS_PROPERTIES = {
    [STATUS_EFFECTS.POISON]: { type: 'dot', emoji: '☠️' },
    [STATUS_EFFECTS.BLEED]: { type: 'dot', emoji: '🩸' },
    [STATUS_EFFECTS.STUN]: { type: 'cc', emoji: '💫' },
    [STATUS_EFFECTS.FREEZE]: { type: 'cc', emoji: '🧊' },
    [STATUS_EFFECTS.SILENCE]: { type: 'cc', emoji: '😶' },
    [STATUS_EFFECTS.CONFUSION]: { type: 'cc', emoji: '🌀' },
    [STATUS_EFFECTS.SHIELD]: { type: 'buff', emoji: '🛡️' },
    [STATUS_EFFECTS.CHARM]: { type: 'debuff', emoji: '😍' },
};
