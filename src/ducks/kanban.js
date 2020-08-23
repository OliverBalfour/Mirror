
/**
 * Kanban boards core Redux logic
 *
 * State is normalised as { tabs, columns, cards }
 *  where each tab has several columns which contain cards
 *  each has a unique ID as a key in the respective object
 */

const initialState = {
  tabs: { "a": { name: "Main" }, "b": { name: "Secondary" } },
  columns: {},
  cards: {}
};

// ignore the action for now and return state
export default (state = initialState, action) => state;
