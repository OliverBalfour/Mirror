
import * as fn from 'date-fns';

export const generateID = () => Math.random().toString().substring(2);

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
  let cards = [];
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
  for (let i = 0; i < numcards; i++) {
    let id = (i+1).toString() + "-" + generateID();
    cards.push({ id, content: sampleCards[Math.floor(Math.random()*sampleCards.length)] });
  }
  let columns = [];
  for (let i = 0, cnt = 0; i < colnums.length; i++) {
    let items = cards.slice(cnt, cnt + colnums[i]).map(card => card.id);
    let id = (i + 1).toString() + "-" + generateID();
    columns.push({ id, items, name: colnames[i] });
    cnt += colnums[i];
  }
  return { cards, columns };
};

// generate initial dummy state
export const dummyState = () => {
  let initial = {
    tabs: [{ name: "Main", id: generateID() }, { name: "Secondary", id: generateID() }],
    ...dummyCols([9,2,6,5,4], ["To Do","Doing","Done","Misc 1","Misc 2"])
  };
  const colIDs = initial.columns.map(col => col.id);
  initial.tabs[0].columns = [colIDs[0], colIDs[1], colIDs[2]];
  initial.tabs[1].columns = [colIDs[3], colIDs[4]];
  return initial;
}

// load persisted state
export const loadState = () => {
  try {
    // web
    if (localStorage.hasOwnProperty("kanban")) {
      const state = JSON.parse(localStorage.getItem("kanban"));
      if (state !== null) return state;
    } else return dummyState();
  } catch (e) {
    // native
    return dummyState();
  }
}

export const saveState = state => {
  try {
    if (localStorage) {
      const serialised = JSON.stringify(state);
      localStorage.setItem("kanban", serialised);
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
    // else if (diff < 14) return fn.format(date, "EEE") + " Week"; // ex: Fri Week
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
