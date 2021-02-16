
/**
 * IndexedDB backend for offline use and caching (98% browser support via caniuse)
 *
 * Cards, columns and tabs are stored individually indexed with "mirror.namespace.id"
 * eg you could get card ID 12345 via get("mirror.cards.12345").then(card => doStuff())
 */

// IndexedDB wrapper with a simple async key-value storage API
import { get, set, keys, del } from 'idb-keyval';
import { generateInitialState, standaloneNamespaces, shallowNamespaces } from './index';
import { downloadData } from '../common';

// If loadAll is false, zettels other than main are not loaded (need lazy loading)
export async function loadState (loadAll = true) {
  const initial = async () => {
    const state = await generateInitialState();
    await saveState(state);
    return state;
  };
  const idbKeys = await keys();
  if (!idbKeys.length) {
    const state = loadLegacyLocalStorageState();
    if (state) {
      await saveState(state);
      return state;
    }
    return await initial();
  }
  try {
    return await loadIDBState(loadAll);
  } catch (e) {
    console.error(e);
    return await initial();
  }
}

const getAllInNamespace = async (state, namespace, whitelist = null) => {
  let promises = [];
  for (let key of await keys()) {
    let chunks = key.split('.');
    if (chunks[1] === namespace) {
      let id = chunks[2];
      if (whitelist && whitelist.indexOf(id) === -1) continue;
      promises.push(
        get(key).then(key => state[namespace][id] = key)
      );
    }
  }
  await Promise.all(promises);
  return state;
}

async function loadIDBState (loadAll = true) {
  const state = {
    cards: {},
    columns: {},
    tabs: {},
  };
  for (let key of standaloneNamespaces) {
    state[key] = await get(`mirror.${key}`) || [];
  }
  let promises = [
    getAllInNamespace(state, 'tabs'),
    getAllInNamespace(state, 'columns').then(() => {
      if (!loadAll) {
        // Only load cards in the Kanban boards and the main Zettelkasten note
        let whitelist = ['main'];
        for (let colID in state.columns) {
          whitelist.push(...state.columns[colID].items);
        }
        return getAllInNamespace(state, 'cards', whitelist);
      } else {
        return getAllInNamespace(state, 'cards');
      }
    })
  ];
  await Promise.all(promises);
  return state;
}

function loadLegacyLocalStorageState () {
  try {
    if (Object.prototype.hasOwnProperty.call(localStorage, 'kanban')) {
      const result = JSON.parse(localStorage.kanban);
      delete localStorage.kanban;
      return result;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function saveState (state) {
  try {
    if (!state || state.loading) return;
    if (await get('mirror.starredZettels') == null)
      await set('mirror.starredZettels', []);
    for (let key of standaloneNamespaces) {
      if (Object.prototype.hasOwnProperty.call(state, key))
        await set(`mirror.${key}`, state[key]);
    }
    let promises = [];
    for (let namespace of shallowNamespaces) {
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
  const promises = [];
  for (let edit of editSet.set) {
    switch (edit.type) {
      case 'add':
      case 'edit':
        promises.push(set(`mirror.${edit.namespace}.${edit.object.id}`, edit.object));
        break;
      case 'delete':
        promises.push(del(`mirror.${edit.namespace}.${edit.id}`));
        break;
      case 'param':
        promises.push(set(`mirror.${edit.namespace}`, edit.value));
        break;
      default:
    }
  }
  return await Promise.all(promises);
}

// For manual intervention of corrupted state
window.deleteAllState = async () => {
  let res = await Promise.all((await keys()).map(key => del(key)));
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key.startsWith('__GITHUB')) {
      delete localStorage[key];
    }
  }
  return res;
};

window.__idb = { get, set, keys, del };
window.__idb.getAll = async () => Promise.all(
  (await window.__idb.keys()).map(async x => [x, await window.__idb.get(x)])
);

window.exportIDBState = async () => {
  const obj = {};
  const values = await window.__idb.getAll();
  values.forEach(([key, val]) => obj[key] = val);
  const json = JSON.stringify(obj);
  downloadData(json, "mirror-backup.json", "application/json");
};

window.importIDBState = async () => {
  // Temporary hack
  // Long term solution is to write an imperative API for creating file upload dialogs
  // on the fly and use that here
  document.body.innerHTML = "Choose a file to upload, or reload to cancel.&nbsp;<input type='file' id='fileinput'/>";
  const input = document.getElementById('fileinput');
  input.addEventListener("change", async () => {
    const reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onloadend = async () => {
      const obj = JSON.parse(reader.result);
      const promises = [];
      for (let key in obj) {
        promises.push(set(key, obj[key]));
      }
      await Promise.all(promises);
      window.location.reload();
    }
  });
};
