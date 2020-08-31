
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
    if (localStorage.hasOwnProperty("kanban"))
      return JSON.parse(localStorage.getItem("kanban"));
    else
      return dummyState();
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
