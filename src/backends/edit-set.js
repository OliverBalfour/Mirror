
import { shallowEqual } from '../common';

export default class EditSet {
  constructor () {
    this.set = [];
    this.inv = [];
  }
  add (namespace, object) {
    this.set.push({ type: 'add', namespace, object });
    this.inv.push({ type: 'delete', namespace, id: object.id });
    return this;
  }
  edit (namespace, object, old) {
    this.set.push({ type: 'edit', namespace, object });
    this.inv.push({ type: 'edit', namespace, object: old });
    return this;
  }
  delete (namespace, id, old) {
    this.set.push({ type: 'delete', namespace, id });
    this.inv.push({ type: 'add', namespace, object: old });
    return this;
  }
  param (namespace, value, old) {
    // Params are always present, this updates a param
    this.set.push({ type: 'param', namespace, value });
    this.inv.push({ type: 'param', namespace, value: old });
    return this;
  }
  concat (other) {
    // Cancel out inverse operations (remove both operations)
    for (let i = other.inv.length - 1; i >= 0; i--) {
      for (let j = this.set.length - 1; j >= 0; j--) {
        if (shallowEqual(other.inv[i], this.set[j])) {
          other.inv.splice(i, 1);
          other.set.splice(i, 1);
          this.inv.splice(j, 1);
          this.set.splice(j, 1);
        }
      }
    }
    // Combine the sets
    this.set.push(...other.set);
    this.inv.push(...other.inv);
    // Prune duplicates (later edits should override earlier ones)
    const ids = [];
    for (let i = this.set.length - 1; i >= 0; i--) {
      const id = getEditID(this.set[i]);
      if (ids.indexOf(id) !== -1) {
        this.set.splice(i, 1);
      } else {
        ids.push(id);
      }
    }
    return this;
  }
  concatSimple (other) {
    this.set.push(...other.set);
    this.inv.push(...other.inv);
    return this;
  }
  editAll (namespace, objectDict, oldDict) {
    for (let id in objectDict) {
      this.edit(namespace, objectDict[id], oldDict[id]);
    }
    return this;
  }
  editAllByID (namespace, objectDict, arrayOfIDs, oldDict) {
    for (let id of arrayOfIDs) {
      this.edit(namespace, objectDict[id], oldDict[id]);
    }
    return this;
  }
  deleteAllByID (namespace, arrayOfIDs, oldDict) {
    for (let id of arrayOfIDs) {
      this.delete(namespace, id, oldDict[id]);
    }
    return this;
  }
  invert () {
    const other = new EditSet();
    other.set = this.inv;
    other.inv = this.set;
    return other;
  }
}

const getEditID = edit => {
  switch (edit.type) {
    case 'add':
    case 'edit':
      return edit.object.id;
    case 'delete':
      return edit.id;
    case 'param':
      return edit.namespace;
    default:
  }
}
