
/**
 * IndexedDB backend for offline use and caching (98% browser support via caniuse)
 *
 * Cards, columns and tabs are stored individually indexed with "namespace.id"
 * eg you could get card ID 12345 via get("cards.12345").then(card => doStuff())
 */

// IndexedDB wrapper with a simple async key-value storage API
import { get, set, keys } from 'idb-keyval';
import { generateInitialState } from './base';

// TODO: support async loadState and saveState functions
// TODO: don't load archived cards in memory

export async function loadState () {
  const idbKeys = await keys();
  if (!idbKeys.length) {
    let state = loadLegacyLocalStorageState();
    if (state) return state;
    return await generateInitialState();
  }
  try {
    return await loadIDBState(idbKeys);
  } catch (e) {
    console.error(e);
    return await generateInitialState();
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
  let promises = [];
  for (let key of idbKeys) {
    let chunks = key.split('.');
    let namespaceIndex = namespaces.indexOf(chunks[1]);
    if (namespaceIndex !== -1) {
      let id = chunks[2];
      promises.push(
        get(key).then(key => state[namespaces[namespaceIndex]][id] = key)
      );
    }
  }
  return await Promise.all(promises).then(() => state);
}

function loadLegacyLocalStorageState () {
  try {
    if (Object.prototype.hasOwnProperty.call(localStorage, 'kanban'))
      return JSON.parse(localStorage.kanban);
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function saveState (state) {
  try {
    if (state.loading) return;
    set('mirror.tabOrder', state.tabOrder);
    let namespaces = ['cards', 'columns', 'tabs'];
    let promises = [];
    for (let namespace of namespaces) {
      for (let id in state[namespace]) {
        promises.push(
          set(`mirror.${namespace}.${id}`, state[namespace][id])
        );
      }
    }
    return await Promise.all(promises);
  } catch (e) {
    console.error(e);
  }
}
