
// TODO: design storage backend API which can be used for IndexedDB cache (fall back on localStorage) and GitHub Gist API remote
// This file will combine all backends into one interface which uses a store.subscribe() to update all
// If neither is initialised then it will generate an initial state
// The load and save functions will be async

// The interface must support loading cards not in memory (first from IndexedDB then the remote)
// It must support synchronising all edited notes to the IndexedDB cache in the background
// It must support rectifying divergent branches (via interactive merge dialog?)

import './github';
import * as idb from './indexeddb';

export async function loadState () {
  return await idb.loadState();
}

export async function saveState (state) {
  return await Promise.all([idb.saveState(state)]);
}
