
/**
 * IndexedDB backend for offline use and caching (98% browser support via caniuse)
 *
 * Cards, columns and tabs are stored individually indexed with "namespace.id"
 * eg you could get card ID 12345 via get("cards.12345").then(card => doStuff())
 */

// IndexedDB wrapper with a simple async key-value storage API
import { get, set, keys } from 'idb-keyval';
import { generateInitialState } from './base';

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
    starredZettels: await get('mirror.starredZettels') || [],
    cards: {},
    columns: {},
    tabs: {},
  };
  let namespaces = ['cards', 'columns', 'tabs'];
  const getAllInNamespace = (namespace, whitelist = null) => {
    let promises = [];
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
    return Promise.all(promises);
  }
  let promises = [
    getAllInNamespace('tabs'),
    getAllInNamespace('columns').then(() => {
      // Only load cards in the Kanban boards and the main Zettelkasten card
      let whitelist = ['main'];
      console.log(state.columns)
      /*
      TODO:
      All of the cards are being loaded, whitelisted or otherwise
      Ctrl+F, delete console.log's
      */
      for (let colID in state.columns) {
        whitelist.push(...state.columns[colID].items);
      }
      console.log(whitelist);
      return getAllInNamespace('cards', whitelist);
    })
  ];
  return await Promise.all(promises).then(() => (console.log(state), state));
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

/*
TODO:
- The IndexedDB API should operate using edit sets rather than rewriting everything every time
- The main Zettelkasten card and all cards in columns should be loaded immediately, all other cards should load lazily from IndexedDB
- Decouple zettelkasten view from controller
*/

export async function loadCard (cardID) {
  try {
    return await get('mirror.cards.'+cardID);
  } catch (e) {
    return null;
  }
}
