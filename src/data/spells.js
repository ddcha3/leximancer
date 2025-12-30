import { CUSTOM_SPELLS } from './manual_spells';

export const SPELLBOOK = { ...CUSTOM_SPELLS };

export async function loadSpellbook() {
  try {
    const baseUrl = import.meta.env.BASE_URL;
    const url = `${baseUrl}generated_dictionary.json`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    Object.assign(SPELLBOOK, data);
    Object.assign(SPELLBOOK, CUSTOM_SPELLS);
    
    console.log("Spellbook loaded with " + Object.keys(SPELLBOOK).length + " words.");
    return true;
  } catch (e) {
    console.error("Failed to load spellbook:", e);
    return false;
  }
}