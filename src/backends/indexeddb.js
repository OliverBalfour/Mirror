
// IndexedDB wrapper with a simple async key-value storage API
import { get, set, keys } from 'idb-keyval';

import { generateInitialState } from '../common/initial-state.js';

/**
 * IndexedDB backend for offline use and caching (98% browser support via caniuse)
 *
 * Cards, columns and tabs are stored individually indexed with "namespace.id"
 * eg you could get card ID 12345 via get("cards.12345").then(card => doStuff())
 */

// TODO: the code does not work with an async loadState
export const loadState = async () => {
  const idbKeys = await keys();
  if (!idbKeys.length) return generateInitialState();
  try {
    return await loadIDBState(idbKeys);
  } catch (e) {
    return generateInitialState();
  }
}

async function loadIDBState (idbKeys) {
  const state = {
    tabOrder: await get('mirror.tabOrder'),
    cards: {},
    columns: {},
    tabs: {},
  };
  let namespaces = ['cards', 'columns', 'tabs'];
  for (let key of idbKeys) {
    let chunks = key.split('.');
    let namespaceIndex = namespaces.indexOf(chunks[1]);
    if (namespaceIndex !== -1) {
      let id = chunks[2];
      state[namespaces[namespaceIndex]][id] = await get(key);
    }
  }
  return state;
}

export const saveState = state => {
  try {
    if (localStorage) {
      const serialised = JSON.stringify(state);
      localStorage.setItem("kanban", serialised);
    }
  } catch (e) {}
}
