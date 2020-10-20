
// Common interface for different backends
// including IndexedDB & the GitHub Gist API

export class BackendBase {
  async commit (editSet) {}
}

export class EditSet {
  constructor () { this.set = [] }
  add (cardID, content="") { this.set.push({ type: 'add', node: cardID, content }); return this }
  edit (cardID, content="") { this.set.push({ type: 'edit', node: cardID, content }); return this }
  delete (cardID) { this.set.push({ type: 'delete', node: cardID }); return this }
}

export const generateInitialState = () =>
  fetch("./initial-state.json")
    .then(res => res.json())
    .catch(e => alert("Could not load initial state. Error: " + e));
