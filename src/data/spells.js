import { CUSTOM_SPELLS } from './manual_spells';

// Initialize with custom spells. 
// The generated spells will be merged in asynchronously.
export const SPELLBOOK = { ...CUSTOM_SPELLS };

export async function loadSpellbook() {
  try {
    // Use Vite's BASE_URL to construct the correct path
    const baseUrl = import.meta.env.BASE_URL;
    const url = `${baseUrl}generated_dictionary.json`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Merge generated spells into SPELLBOOK
    Object.assign(SPELLBOOK, data);
    
    // Re-apply custom spells to ensure they override generated ones if there are collisions
    Object.assign(SPELLBOOK, CUSTOM_SPELLS);
    
    console.log("Spellbook loaded with " + Object.keys(SPELLBOOK).length + " words.");
    return true;
  } catch (e) {
    console.error("Failed to load spellbook:", e);
    return false;
  }
}