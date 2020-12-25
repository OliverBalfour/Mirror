
export { linkName, abbreviatedDescription, parseWikilinks, parseLaTeX } from './string';
export { mergeRefs, useHashLocation, useTitle, ReloadProtect, Hidden, RawHTMLElement, RawHTMLString } from './react';
export { prettyPrintDate, generateID, timeUrgencyClassName } from './time';

// Source: https://stackoverflow.com/a/14810722/4642943
// returns a new object with the values at each key mapped using mapFn(value)
export const objectMap = (object, mapFn) =>
  Object.keys(object).reduce(function(result, key) {
    result[key] = mapFn(object[key])
    return result
  }, {});

// Source: https://stackoverflow.com/a/52323412/4642943
export const shallowEqual = (obj1, obj2) =>
  Object.keys(obj1).length === Object.keys(obj2).length &&
  Object.keys(obj1).every(key => obj1[key] === obj2[key]);

export const deleteInList = (list, elem) => {
  let index = list.indexOf(elem);
  if (index !== -1) list.splice(index, 1); // undesired behaviour when splicing at (-1, 1)
  return index !== -1;
};

// Deep copy synchronously via structured clone algorithm
// Source: https://twitter.com/DasSurma/status/955484341358022657
export const structuredClone = obj => {
  const oldState = window.history.state;
  window.history.replaceState(obj, window.title);
  const copy = window.history.state;
  window.history.replaceState(oldState, window.title);
  return copy;
};

// Deep merge two objects
// Source: https://stackoverflow.com/a/34749873/4642943
export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}
export function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return mergeDeep(target, ...sources);
}

// Web: Download content as filename with specificed MIME type
export const downloadData = (content, filename, type) => {
  if(!type) type = 'application/octet-stream';
  const a = document.createElement('a');
  const blob = new Blob([content], { type });
  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

// Simple card search; searches titles then descriptions then IDs for case insensitive exact matches
export const searchCards = (term, cards, limit=10) => {
  let matches = [];
  let tl = term.toLowerCase();
  for (const cardID in cards) {
    if (cards[cardID].content.toLowerCase().includes(tl)) {
      matches.push(cardID);
      if (matches.length === limit) return matches;
    }
  }
  for (const cardID in cards) {
    if (cards[cardID].description && cards[cardID].description.toLowerCase().includes(tl)) {
      matches.push(cardID);
      if (matches.length === limit) return matches;
    }
  }
  for (const cardID in cards) {
    if (cardID.toLowerCase().includes(tl)) {
      matches.push(cardID);
      if (matches.length === limit) return matches;
    }
  }
  return matches;
}

// @reduxjs/toolkit's createReducer uses Immer internally which is great
// until you need to access the mutated piece of state directly to send it
// to the backend, when Immer only supplies a Proxy instead of an Object
// This variant has opt-in Immer support (you can call produce if desired)
export function createReducer (initialState, actionMap) {
  return (prevState = initialState, action) => {
    if (Object.prototype.hasOwnProperty.call(actionMap, action.type)) {
      const nextState = actionMap[action.type](prevState, action);
      if (!nextState)
        console.error(`Invalid state produced by createReducer for ${action.type}: ${nextState}`);
      return nextState;
    }
  }
}
