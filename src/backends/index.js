
import * as ghb from './github';
import * as idb from './indexeddb';
import { set } from 'idb-keyval';

import EditSet from './edit-set';
export const UNDO_LIMIT = 20;
EditSet.prototype.commit = function () {
  commit(this);
  hist.editSetHistory.past.push(this);
  if (hist.editSetHistory.past.length > UNDO_LIMIT)
    hist.editSetHistory.past.shift();
  // Clear the future for any state mutating actions
  hist.editSetHistory.future = [];
}
const hist = {
  editSetHistory: {
    past: [],    // [oldest edit,  ..., 1 edit ago]
    future: [],  // [1 edit ahead, ..., n edits ahead]
  },
  undo: {
    allowed: () => hist.editSetHistory.past.length > 0,
    commit: () => {
      const set = hist.editSetHistory.past.pop();
      hist.editSetHistory.future.unshift(set);
      if (hist.editSetHistory.future.length > UNDO_LIMIT)
        hist.editSetHistory.future.pop();
      commit(set.invert());
    },
  },
  redo: {
    allowed: () => hist.editSetHistory.future.length > 0,
    commit: () => {
      const set = hist.editSetHistory.future.shift();
      hist.editSetHistory.past.push(set);
      if (hist.editSetHistory.past.length > UNDO_LIMIT)
        hist.editSetHistory.past.shift();
      commit(set);
    }
  }
}
export { EditSet, hist };

export const namespaceNames = {
  cards: 'cards',
  columns: 'columns',
  tabs: 'tabs',
  tabOrder: 'tabOrder',
  starredZettels: 'starredZettels',
}

// Namespaces that are not objects but not necessarily primitives
export const standaloneNamespaces = [
  'tabOrder',
  'starredZettels',
];

// Namespaces that are dictionaries of depth one
export const shallowNamespaces = [
  'cards',
  'columns',
  'tabs',
];

export async function loadState (loadAll = true) {
  // Return the IndexedDB state with GitHub mutations too
  // TODO: load state async and have loading status indicator rather than blocking
  // this needs to give the user an indication of when it's done
  let state = await idb.loadState(loadAll);
  if (ghb.loggedIn()) {
    state = { ...state, ...await ghb.synchroniseState() };
  }
  return state;
}

export async function saveState (state) {
  return await Promise.all([idb.saveState(state), ghb.saveState(state)]);
}

// Load tabOrder: await load('tabOrder')
// Load card: await load('cards', cardID)
export async function load (namespace, id = null) {
  const local = await idb.load(namespace, id);
  if (local) return local;
  return ghb.load(namespace, id);
}

// To avoid data races, we rate limit edits to 5s intervals where extra
// edits are concat'd onto the buffer
// Data races could occur when quickly undoing an edit if the packets arrive in
// the wrong order.
let editSetBuffer = new EditSet();
let timer = null;
let waitingOn = [];
const commit = editSet => new Promise((resolve, reject) => {
  const promises = [
    idb.commit(editSet)
  ];
  if (ghb.loggedIn()) {
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
      editSetBuffer.concat(editSet);
      waitingOn.push(resolve);
    }
  } else {
    Promise.all(promises).then(resolve);
  }
});

export const generateInitialState = () =>
  fetch("./initial-state.json")
    .then(res => res.json())
    .then(obj => {
      const promises = [];
      for (let key in obj) {
        promises.push(set(key, obj[key]));
      }
      return Promise.all(promises);
    })
    .then(x => idb.loadIDBState(true))
    .catch(e => alert("Could not load initial state. Perhaps you forgot a trailing slash in the URL? Error: " + e));
