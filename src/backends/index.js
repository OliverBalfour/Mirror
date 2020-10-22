
// TODO
// It must support synchronising all edited notes to the IndexedDB cache in the background
// It must support rectifying divergent branches (via interactive merge dialog?)

import './github';
import * as idb from './indexeddb';

export async function loadState () {
  return await idb.loadState();
}

// TODO: save state should use edit sets instead of saving everything each edit
export async function saveState (state) {
  return await Promise.all([idb.saveState(state)]);
}

export async function loadCard (cardID) {
  // Assumes the cache is up-to-date with the remote
  return await idb.loadCard(cardID);
}

// TODO: deletion functions (apply to all remotes)

// remove from cards, column items
export async function deleteCard (cardID) {}
// delete contained cards, column, tab column entries
export async function deleteColumn (colID) {}
// delete everything contained, update tabOrder
export async function deleteTab (tabIdx) {}
// needs to remove from starredZettels and cards
export async function deleteZettel (cardID) {}
