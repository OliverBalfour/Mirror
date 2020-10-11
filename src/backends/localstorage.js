
import { generateInitialState } from '../common/initial-state.js';

const modifyVersion = (oldSemver, newSemver, mutation) => {
  if (localStorage.version === oldSemver) {
    let state = JSON.parse(localStorage.kanban);
    mutation(state);
    localStorage.kanban = JSON.stringify(state);
    localStorage.version = newSemver;
  }
};

// load persisted state
const currentVersion = "0.2.1"; // IMPORTANT
export const loadState = () => {
  try {
    if (!localStorage.version) throw new Error();

    // avert breaking changes
    modifyVersion("0.1.0", "0.2.0", state => {
      const epochms = new Date().getTime();
      state.cards['main'] = { id:'main', content: 'Welcome', description: 'Welcome to your Zettelkasten! You can edit this and use `[[wikilink]]` syntax to link to other nodes.',
      created: epochms, edited: epochms }
      return state;
    });
    modifyVersion("0.2.0", "0.2.1", state => {
      for (const cardID in state.cards) {
        const numCols = Object.values(state.columns).filter(col => col.items.indexOf(cardID) !== -1).length;
        state.cards[cardID].type = numCols ? 0 : 1;
      }
      state.cards['main'].type = 1;
      return state;
    });

    if (localStorage.hasOwnProperty('kanban'))
      return JSON.parse(localStorage.kanban) || generateInitialState();

  } catch (e) {}
  return generateInitialState();
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
