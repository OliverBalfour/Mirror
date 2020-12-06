
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
  concat (produceOther) {
    this.set.push(...produceOther().set);
    // Prune duplicates (later edits should override earlier ones)
    const ids = [];
    for (let i = this.set.length - 1; i >= 0; i--) {
      const edit = this.set[i];
      let id;
      switch (edit.type) {
        case 'add':
        case 'edit':
          id = edit.object.id;
          break;
        case 'delete':
          id = edit.id;
          break;
        case 'param':
          id = edit.namespace;
          break;
        default:
      }
      if (ids.indexOf(id) !== -1) {
        this.set.splice(i, 1);
      } else {
        ids.push(id);
      }
    }
    return this;
  }
  editAll (namespace, objectDict) {
    for (let id in objectDict) {
      this.edit(namespace, objectDict[id]);
    }
    return this;
  }
  editAllByID (namespace, objectDict, arrayOfIDs) {
    for (let id of arrayOfIDs) {
      this.edit(namespace, objectDict[id]);
    }
    return this;
  }
  deleteAllByID (namespace, arrayOfIDs) {
    for (let id of arrayOfIDs) {
      this.delete(namespace, id);
    }
    return this;
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

// To avoid data races, we rate limit edits to 5s intervals where extra
// edits are concat'd onto the buffer
// Data races could occur when quickly undoing an edit if the packets arrive in
// the wrong order.
let editSetBuffer = new EditSet();
let timer = null;
let waitingOn = [];
export const commit = editSet => new Promise((resolve, reject) => {
  const promises = [
    idb.commit(editSet)
  ];
  if (localStorage["__GITHUB_TOKEN"]) {
    if (!timer) {
      promises.push(ghb.commit(editSet));
      timer = setTimeout(() => {
        ghb.commit(editSetBuffer);
        timer = null;
        editSetBuffer = new EditSet();
        waitingOn.forEach(f => f());
        waitingOn = [];
      }, 5000);
      Promise.all(promises).then(resolve);
    } else {
      editSetBuffer.concat(() => editSet);
      waitingOn.push(resolve);
    }
  } else {
    Promise.all(promises).then(resolve);
  }
});

export const generateInitialState = () =>
  fetch("./initial-state.json")
    .then(res => res.json())
    .catch(e => alert("Could not load initial state. Perhaps you forgot a trailing slash in the URL? Error: " + e));
