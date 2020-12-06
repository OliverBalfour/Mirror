
import * as ghb from './github';
import * as idb from './indexeddb';

export const namespaceNames = {
  cards: 'cards',
  columns: 'columns',
  tabs: 'tabs',
  tabOrder: 'tabOrder',
  starredZettels: 'starredZettels',
}

export class EditSet {
  constructor (other) { this.set = [] }
  add    (namespace, object) { this.set.push({ type: 'add',    namespace, object }); return this }
  edit   (namespace, object) { this.set.push({ type: 'edit',   namespace, object }); return this }
  delete (namespace, id    ) { this.set.push({ type: 'delete', namespace, id     }); return this }
  // params are always present, this edit updates a param
  param  (namespace, value ) { this.set.push({ type: 'param',  namespace, value  }); return this }
  concat (produceOther) { this.set.push(...produceOther().set); return this }
  editAll (namespace, objectDict) {
    for (let id in objectDict) {
      this.edit(namespace, objectDict[id]);
    }
  }
  editAllByID (namespace, objectDict, arrayOfIDs) {
    for (let id of arrayOfIDs) {
      this.edit(namespace, objectDict[id]);
    }
  }
  deleteAllByID (namespace, arrayOfIDs) {
    for (let id of arrayOfIDs) {
      this.delete(namespace, id);
    }
  }
  commit () { commit(this) }
}

export async function loadState () {
  return await idb.loadState();
}

// TODO: save state should use edit sets instead of saving everything each edit
export async function saveState (state) {
  return await Promise.all([idb.saveState(state)]);
}

// Load tabOrder: await load('tabOrder')
// Load card: await load('cards', cardID)
export async function load (namespace, id = null) {
  // Assumes the cache is up-to-date with the remote
  return await idb.load(namespace, id);
}

export async function commit (editSet) {
  const promises = [
    idb.commit(editSet)
  ];
  if (localStorage["__GITHUB_TOKEN"]) {
    promises.push(ghb.commit(editSet));
  }
  return await Promise.all(promises);
}

export const generateInitialState = () =>
  fetch("./initial-state.json")
    .then(res => res.json())
    .catch(e => alert("Could not load initial state. Perhaps you forgot a trailing slash in the URL? Error: " + e));
