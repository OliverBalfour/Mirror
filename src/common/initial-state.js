
/*
 * Exports dummyState :: () -> state
 */

import { generateID } from './time';

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
    cards[id] = { id, type: 0, content: sampleCards[Math.floor(Math.random()*sampleCards.length)],
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
  initial.cards['main'] = { id:'main', content: 'Welcome', type: 1, description: 'Welcome to your Zettelkasten! You can edit this and use `[[wikilink]]` syntax to link to other nodes.',
    created: epochms, edited: epochms }
  return initial;
}
