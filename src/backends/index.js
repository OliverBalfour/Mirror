
import * as ghb from './github';
import * as idb from './indexeddb';

export class EditSet {
  constructor (other) { this.set = [] }
  add    (namespace, id, object) { this.set.push({ type: 'add',    namespace, id, object }); return this }
  edit   (namespace, id, object) { this.set.push({ type: 'edit',   namespace, id, object }); return this }
  delete (namespace, id        ) { this.set.push({ type: 'delete', namespace, id         }); return this }
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
  return await Promise.all([
    ghb.commit(editSet),
    idb.commit(editSet),
  ])
}

export const generateInitialState = () =>
  fetch("./initial-state.json")
    .then(res => res.json())
    .catch(e => alert("Could not load initial state. Error: " + e));
