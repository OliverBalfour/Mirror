
import * as ghb from './github';
import * as idb from './indexeddb';

import EditSet from './edit-set';
export const UNDO_LIMIT = 20;
let editSetHistory = {
  past: [],    // [oldest edit,  ..., 1 edit ago]
  future: [],  // [1 edit ahead, ..., n edits ahead]
}
EditSet.prototype.commit = function () {
  commit(this);
  editSetHistory.past.push(this);
  if (editSetHistory.past.length > UNDO_LIMIT)
    editSetHistory.past.shift();
  // Clear the future for any state mutating actions
  editSetHistory.future = [];
}
const undoCommit = () => {
  const set = editSetHistory.past.pop();
  editSetHistory.future.unshift(set);
  if (editSetHistory.future.length > UNDO_LIMIT)
    editSetHistory.future.pop();
  commit(set.invert());
};
const redoCommit = () => {
  const set = editSetHistory.future.shift();
  editSetHistory.past.push(set);
  if (editSetHistory.past.length > UNDO_LIMIT)
    editSetHistory.past.shift();
  commit(set);
};
export { EditSet, undoCommit, redoCommit };

export const namespaceNames = {
  cards: 'cards',
  columns: 'columns',
  tabs: 'tabs',
  tabOrder: 'tabOrder',
  starredZettels: 'starredZettels',
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
const commit = editSet => new Promise((resolve, reject) => {
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
    .catch(e => alert("Could not load initial state. Perhaps you forgot a trailing slash in the URL? Error: " + e));
