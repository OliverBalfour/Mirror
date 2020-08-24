
// random ID: base64 encoded 8 char string of random number and current time
export const generateID = () => Math.random().toString().substring(15);

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
export const dummyCols = colnums => {
  let numcards = colnums.reduce((a, b) => a + b, 0);
  let cards = [];
  for (let i = 0; i < numcards; i++) {
    let id = (i+1).toString() + "-" + generateID();
    cards.push({ id, content: `Item ${i+1}` });
  }
  let columns = [];
  for (let i = 0, cnt = 0; i < colnums.length; i++) {
    let items = cards.slice(cnt, cnt + colnums[i]).map(card => card.id);
    let id = (i + 1).toString() + "-" + generateID();
    columns.push({ id, items });
    cnt += colnums[i];
  }
  return { cards, columns };
};

export const dummyState = () => {
  let initial = {
    tabs: [{ name: "Main" }, { name: "Secondary" }],
    ...dummyCols([8,5,6])
  };
  const colIDs = initial.columns.map(col => col.id);
  initial.tabs[0].columns = [colIDs[0]];
  initial.tabs[1].columns = [colIDs[1], colIDs[2]];
  return initial;
}
