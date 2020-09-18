
import * as fn from 'date-fns';
import * as React from 'react';

let __lastGeneratedID = null;
export const generateID = () => {
  const format = "yyyyMMdd-hhmmss";
  let newID = fn.format(new Date(), format);
  // if we generate multiple IDs in one second, we add "-n" where n is 1,2,...
  // the only time this causes collisions is if you add a card, refresh, add a card within 1s
  if (__lastGeneratedID !== null && __lastGeneratedID.substring(0, format.length) === newID) {
    if (__lastGeneratedID.length === format.length) newID += "-1";
    else newID += '-' + (parseInt(__lastGeneratedID.substring(format.length + 1, __lastGeneratedID.length)) + 1)
  }
  __lastGeneratedID = newID;
  return newID;
}

// generate { cards, columns } where each column has colnum[i] cards
// both of these are objects where the keys are unique IDs
// cards are { id, content } structs
// todo: make them arrays containing their IDs and write selectors instead
// columns are { id, items: [ id ] } structs
// Example: {
//   cards: [{ id: "a", content: "Item 1" }],
//   columns: [{ id: "b", items: ["a"] }],
//   tabs: [{ name: "Main", columns: ["b"] }]
// }
export const dummyCols = (colnums, colnames) => {
  let numcards = colnums.reduce((a, b) => a + b, 0);
  let cards = {};
  let sampleCards = [
    "Wash the dishes",
    "Make cool app",
    "Run out of ideas for sample tasks for the app you're making",
    "Cook pizza for dinner",
    "Finish your chemistry homework",
    "Write a tutorial explaining how monads are isomorphic to burritos in the category of food",
    "Forget to wrap a line at 300 characters",
    "Learn Common Lisp",
    "Do normal human things",
    "Prove P=NP for N=1",
    "Eat some chocolate",
    "Stop eating so much chocolate",
    "Write witty comment",
    "🙂"];
  const epochms = new Date().getTime();
  for (let i = 0; i < numcards; i++) {
    let id = generateID();
    cards[id] = { id, content: sampleCards[Math.floor(Math.random()*sampleCards.length)],
      created: epochms, edited: epochms, moved: epochms };
  }
  let columns = {};
  for (let i = 0, cnt = 0; i < colnums.length; i++) {
    let items = Object.keys(cards).slice(cnt, cnt + colnums[i]);
    let id = generateID();
    columns[id] = { id, items, name: colnames[i], created: epochms, edited: epochms };
    cnt += colnums[i];
  }
  return { cards, columns };
};

// generate initial dummy state
export const dummyState = () => {
  const epochms = new Date().getTime();
  const ids = [generateID(), generateID()];
  let initial = {
    tabs: {
      [ids[0]]: { name: "Main",      id: ids[0], created: epochms, edited: epochms },
      [ids[1]]: { name: "Secondary", id: ids[1], created: epochms, edited: epochms }
    },
    ...dummyCols([9,2,6,5,4], ["To Do","Doing","Done","Misc 1","Misc 2"])
  };
  const colIDs = Object.keys(initial.columns);
  initial.tabs[ids[0]].columns = [colIDs[0], colIDs[1], colIDs[2]];
  initial.tabs[ids[1]].columns = [colIDs[3], colIDs[4]];
  initial.tabOrder = ids;
  initial.cards['main'] = { id:'main', content: 'Welcome', description: 'Welcome to your Zettelkasten! You can edit this and use `[[wikilink]]` syntax to link to other nodes.',
    created: epochms, edited: epochms }
  return initial;
}

const modifyVersion = (oldSemver, newSemver, mutation) => {
  if (localStorage.version === oldSemver) {
    let state = JSON.parse(localStorage.kanban);
    mutation(state);
    localStorage.kanban = JSON.stringify(state);
    localStorage.version = newSemver;
  }
};

// load persisted state
const currentVersion = "0.2.0"; // IMPORTANT
export const loadState = () => {
  try {

    // web
    if (!localStorage.version) throw new Error();

    // avert breaking changes
    modifyVersion("0.1.0", "0.2.0", state => {
      const epochms = new Date().getTime();
      state.cards['main'] = { id:'main', content: 'Welcome', description: 'Welcome to your Zettelkasten! You can edit this and use `[[wikilink]]` syntax to link to other nodes.',
      created: epochms, edited: epochms }
      return state;
    });

    if (localStorage.hasOwnProperty('kanban'))
      return JSON.parse(localStorage.kanban) || dummyState();

  } catch (e) {}
  return dummyState();
}

export const saveState = state => {
  try {
    if (localStorage) {
      const serialised = JSON.stringify(state);
      localStorage.setItem("kanban", serialised);
      localStorage.setItem("version", currentVersion);
    }
  } catch (e) {}
}

// Source: https://stackoverflow.com/a/14810722/4642943
// returns a new object with the values at each key mapped using mapFn(value)
export const objectMap = (object, mapFn) =>
  Object.keys(object).reduce(function(result, key) {
    result[key] = mapFn(object[key])
    return result
  }, {});

/**
 * Returns a heavily abbreviated pretty printed date using date-fns
 * - Only includes time if within a week and not midnight
 * - Only includes minutes if nonzero
 * - Replaces date with "Tomorrow" or "Next Fri" for days within a fortnight
 */
export const prettyPrintDate = epochMilliseconds => {
  const date = new Date(epochMilliseconds);
  const now = new Date();

  const getDate = date => {
    const diff = fn.differenceInCalendarDays(date, now);
    if (diff === 0) return "Today";
    else if (diff === -1) return "Yesterday";
    else if (diff === 1) return "Tomorrow";
    else if (diff > 0 && diff < 7) return fn.format(date, "EEE"); // ex: Wed
    else if (diff > 0 && diff < 14) return fn.format(date, "EEE") + " Week"; // ex: Fri Week
    else if (diff > -7 && diff < 0) return "Last " + fn.format(date, "EEE"); // ex: Last Fri
    return fn.format(date, "MMM do"); // ex: Sep 17th
  }

  const getTime = date => {
    if (date.getHours() === 0 && date.getMinutes() === 0) return null; // ignore time if midnight
    if (date.getMinutes() === 0) return fn.format(date, "haaa"); // ex: 4PM
    return fn.format(date, "h:mmaaa");
  }

  const time = getTime(date);
  return getDate(date) + (time ? " " + time : "");
};

// Download content as filename with specificed MIME type
export const downloadData = (content, filename, type) => {
    if(!type) type = 'application/octet-stream';
    const a = document.createElement('a');
    const blob = new Blob([content], { type });
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();
}

// Web only
// returns the current hash location (excluding the '#' symbol)
// Based on Wouter: https://codesandbox.io/s/wouter-hash-based-hook-5fp9g?file=/index.js
const currentLoc = () => window.location.hash.replace("#", "") || "/";
export const useHashLocation = () => {
  const [loc, setLoc] = React.useState(currentLoc());
  React.useEffect(() => {
    const handler = () => setLoc(currentLoc());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  const navigate = React.useCallback(to => window.location.hash = to, []);
  return [loc, navigate];
};

const linkName = card => {
  if (!card) return 'unknown';
  if (card.name) return card.name;
  const firstLine = card.content.split('\n')[0];
  if (firstLine.length > 40) return firstLine.substring(0,37) + '...';
  return firstLine;
};
export const parseWikilinks = (source, cards, prefix = '#/notes/') => {
  const regex = /(\[\[[A-Za-z0-9_-]+\]\])/gm;
  let m;
  while ((m = regex.exec(source)) !== null) {
    if (m.index === regex.lastIndex) regex.lastIndex++;
    // m.index is the index in 'source'
    const parseable = (source.substring(0, m.index).match(/`/gm) || []).length % 2 === 0;
    if (!parseable) continue;
    // m[1] is the actual match
    let cardID = m[1].substring(2, m[1].length - 2);
    source = source.substring(0, m.index) + '[' + linkName(cards[cardID]) + '](' + prefix + cardID + ')' + source.substring(m.index + m[1].length, source.length);
  }
  return source;
};
