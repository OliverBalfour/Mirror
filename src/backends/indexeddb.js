
/**
 * IndexedDB backend for offline use and caching (98% browser support via caniuse)
 *
 * Cards, columns and tabs are stored individually indexed with "mirror.namespace.id"
 * eg you could get card ID 12345 via get("mirror.cards.12345").then(card => doStuff())
 */


/*
TODO:
- The IndexedDB API should operate using edit sets rather than rewriting everything every time
- The main Zettelkasten card and all cards in columns should be loaded immediately, all other cards should load lazily from IndexedDB
- Decouple zettelkasten view from controller
*/


// IndexedDB wrapper with a simple async key-value storage API
import { get, set, keys, del } from 'idb-keyval';
import { generateInitialState } from './index';

let idbKeys = [];

export async function loadState () {
  idbKeys = await keys();
  if (!idbKeys.length) {
    let state = loadLegacyLocalStorageState();
    if (state) return state;
    return await generateInitialState();
  }
  try {
    return await loadIDBState();
  } catch (e) {
    console.error(e);
    return await generateInitialState();
  }
}

const getAllInNamespace = (state, namespace, whitelist = null) => {
  let promises = [];
  let namespaces = ['cards', 'columns', 'tabs'];
  for (let key of idbKeys) {
    let chunks = key.split('.');
    let namespaceIndex = namespaces.indexOf(chunks[1]);
    if (namespaceIndex !== -1) {
      let id = chunks[2];
      if (whitelist && whitelist.indexOf(id) === -1) continue;
      promises.push(
        get(key).then(key => state[namespaces[namespaceIndex]][id] = key)
      );
    }
  }
  return Promise.all(promises).then(() => state);
}

async function loadIDBState () {
  const state = {
    tabOrder: await get('mirror.tabOrder'),
    starredZettels: await get('mirror.starredZettels') || [],
    cards: {},
    columns: {},
    tabs: {},
  };
  let promises = [
    getAllInNamespace(state, 'tabs'),
    getAllInNamespace(state, 'columns').then(() => {
      // Only load cards in the Kanban boards and the main Zettelkasten note
      let whitelist = ['main'];
      for (let colID in state.columns) {
        whitelist.push(...state.columns[colID].items);
      }
      return getAllInNamespace(state, 'cards', whitelist);
    })
  ];
  await Promise.all(promises);
  return state;
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
    if (!state || state.loading) return;
    set('mirror.tabOrder', state.tabOrder);
    set('mirror.starredZettels', state.starredZettels);
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

// Combinators

// Delete a specific object in a namespace without removing
// references to it in other objects
export async function deleteAtomically (namespace, id) {
  return await del('mirror.'+namespace+'.'+id);
}

export async function load (namespace, id = null) {
  try {
    if (!id) { // eg tabOrder
      return await get('mirror.'+namespace);
    } else { // eg cards
      return await get('mirror.'+namespace+'.'+id);
    }
  } catch (e) {
    return null;
  }
}

export async function commit (editSet) {
  // TODO: IndexedDB::commit
  // needs to update idbKeys
  return null;
}

// For manual intervention of corrupted state
window.deleteAllState = async () => {
  let res = await Promise.all(idbKeys.map(key => del(key)));
  idbKeys = [];
  return res;
};
