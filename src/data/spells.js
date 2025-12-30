import generatedSpells from './generated_dictionary.json';
import { CUSTOM_SPELLS } from './manual_spells';

// 1. Merge the data
const mergedSpellbook = Object.assign({}, generatedSpells, CUSTOM_SPELLS);

export const SPELLBOOK = mergedSpellbook;