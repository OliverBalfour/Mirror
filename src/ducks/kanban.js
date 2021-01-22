
/**
 * Kanban boards core Redux logic
 *
 * State is normalised as { tabs, columns, cards }
 *  where each tab has several columns which contain cards
 *  each has a unique ID as a key in the respective object
 */

import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import undoable, { ActionTypes } from 'redux-undo';
import produce from 'immer';
import { generateID, objectMap, deleteInList, createReducer, shallowEqual,
  structuredClone, deepMerge } from '../common';
import { EditSet, load, namespaceNames as c, hist, UNDO_LIMIT } from '../backends';

// Action creators

export const unsafeSetState = createAction('mirror/SET_STATE');  // Used for async initial state
// TODO: how should overwriteState be treated by undo/redo?
// Used to overwrite local data with updates from remote
export const overwriteState = createAction('mirror/OVERWRITE_STATE');

export const transferCard = createAction('kanban/TRANSFER_CARD');
export const reorderCard = createAction('kanban/REORDER_CARD');
export const addCard = createAction('kanban/ADD_CARD'); // takes { content, colID }
export const editCardContent = createAction('kanban/EDIT_CARD_CONTENT');//takes {content, cardID}
export const editCard = createAction('kanban/EDIT_CARD'); // takes a card object; allows editing all of a card's params
export const deleteCard = createAction('kanban/DELETE_CARD');//takes cardID

export const moveCard = ([srcColID, dstColID, srcIndex, dstIndex]) =>
  srcColID === dstColID
    ? reorderCard({ colID: srcColID, srcIndex, dstIndex })
    : transferCard({ srcColID, dstColID, srcIndex, dstIndex });

export const addColumn = createAction('kanban/ADD_COLUMN'); // takes { name, tabID }
export const deleteColumn = createAction('kanban/DELETE_COLUMN'); // takes string column ID
export const renameColumn = createAction('kanban/RENAME_COLUMN'); // takes { colID, name }
export const moveColumn = createAction('kanban/MOVE_COLUMN'); // takes [srcIdx, dstIdx, tabIdx]
export const archiveCardsInColumn = createAction('kanban/ARCHIVE_ALL_COLUMN'); // takes colID
export const sortColByTime = createAction('kanban/SORT_COLUMN_BY_CARD_TIME_ATTRIBUTE');

export const addTab = createAction('kanban/ADD_TAB'); // takes name
export const deleteTab = createAction('kanban/DELETE_TAB'); // takes tabIdx
export const renameTab = createAction('kanban/RENAME_TAB'); // takes { tabID, name }
export const moveTab = createAction('kanban/MOVE_TAB'); // takes [srcIdx, dstIdx]

export const addZettel = createAction('zettelkasten/ADD_ZETTEL'); // takes { zettel: {...} }
export const editZettel = createAction('zettelkasten/EDIT_ZETTEL'); // takes { zettel }
export const deleteZettel = createAction('zettelkasten/DELETE_ZETTEL'); // takes zettelID
export const toggleZettelStarred = createAction('zettelkasten/TOGGLE_STARRED'); // takes zettelID

// createAsyncThunk a normal action creator creator you dispatch as usual with .pending,
// .fulfilled and .rejected action types for handling by a reducer
export const loadZettel = createAsyncThunk(
  'zettelkasten/LOAD_ZETTEL', async (cardID, thunkAPI) => {
    const card = await load('cards', cardID);
    if (!card) {
      // Reject if the card couldn't be loaded
      return thunkAPI.rejectWithValue(cardID);
    } else {
      return card;
    }
  }
);

// Selectors

export const selectors = {
  // Map[TabID, Column], Column :: { id, items: List[Card] }, not List[CardID]
  getColumnsInTabs: state =>
    objectMap(state.tabs, tab =>
      tab.columns.map(colID => state.columns[colID]).map(col => ({
        ...col, items: col.items.map(card => state.cards[card])
      }))),
  columns: state => state.columns,
  tabs: state => state.tabs,
  tabOrder: state => state.tabOrder,
  cards: state => state.cards,
  archivedCards: state => Object.values(state.cards).filter(card => Object.keys(card).indexOf("archived") !== -1),
  activeCards:   state => Object.values(state.cards).filter(card => Object.keys(card).indexOf("archived") === -1),
  starredZettels: state => state.starredZettels ? state.starredZettels : [],
  // gets { [tabID]: list_of_cardIDs }
  cardsByTab: state => objectMap(state.tabs, tab =>
    tab.columns.flatMap(colID => state.columns[colID].items)),
  loadingZettel: state => state.loadingZettel,
};

// Reducers

export const
  KANBAN_CARD_TYPE = 0,
  ZETTEL_NOTE_TYPE = 1;

const loadingState = {
  loading: true
};

// Use our version of createReducer that does not enable Immer by default
// Note that these reducers are not pure, they commit changes to IndexedDB
// and the GitHub Gist API. As the app cannot function without these features,
// these side effects have to happen somewhere, and none of the features
// impure reducers break are relevant or would work anyway, the rule of pure
// reducers is intentionally broken.
// Note: ps is previous state, s is draft state, ns is next state, a is action
const reducer = createReducer(loadingState, {
  // Only used for updating the initial state from the loading state
  // Makes no changes to the remote (pure functional reducer)
  [unsafeSetState]: (ps, a) => a.payload,
  // Update the state, for loading remote state on top of existing state
  // This does not copy everything into memory, it only overwrites existing state keys
  [overwriteState]: (ps, a) => {
    if (JSON.stringify(a.payload) === "{}") return ps;
    const ns = structuredClone(ps);
    deepMerge(ns, a.payload);
    return ns;
  },
  // Invert the edit sets for IndexedDB and GitHub
  // Every other action clears the redo stack if present
  [ActionTypes.UNDO]: (ps, a) => {
    hist.undo.commit();
    return ps;
  },
  [ActionTypes.REDO]: (ps, a) => {
    hist.redo.commit();
    return ps;
  },
  [transferCard]: (ps, a) => {
    const epochms = new Date().getTime();
    const { srcColID, dstColID, srcIndex, dstIndex } = a.payload;
    if (srcColID === dstColID && srcIndex === dstIndex)
      return ps;
    const cardID = ps.columns[srcColID].items[srcIndex];
    const ns = produce(ps, s => {
      s.columns[srcColID].items.splice(srcIndex, 1);
      s.cards[cardID].moved = epochms;
      s.columns[srcColID].edited = epochms;
      s.columns[dstColID].edited = epochms;
      s.columns[dstColID].items.splice(dstIndex, 0, cardID);
    });
    new EditSet()
      .edit(c.cards, ns.cards[cardID], ps.cards[cardID])
      .edit(c.columns, ns.columns[srcColID], ps.columns[srcColID])
      .edit(c.columns, ns.columns[dstColID], ps.columns[dstColID])
      .commit();
    return ns;
  },
  [reorderCard]: (ps, a) => {
    const { colID, srcIndex, dstIndex } = a.payload;
    if (srcIndex === dstIndex)
      return ps;
    const epochms = new Date().getTime();
    const cardID = ps.columns[colID].items[srcIndex];
    const ns = produce(ps, s => {
      s.columns[colID].edited = epochms;
      s.columns[colID].items.splice(srcIndex, 1);
      s.cards[cardID].moved = epochms;
      s.columns[colID].items.splice(dstIndex, 0, cardID);
    });
    new EditSet()
      .edit(c.columns, ns.columns[colID], ps.columns[colID])
      .edit(c.cards, ns.cards[cardID], ps.cards[cardID])
      .commit();
    return ns;
  },
  [addCard]: (ps, a) => {
    const { content, colID } = a.payload;
    const id = generateID();
    const epochms = new Date().getTime();
    const card = { id, content, type: KANBAN_CARD_TYPE,
      created: epochms,  edited: epochms, moved: epochms };
    const ns = produce(ps, s => {
      s.cards[id] = card;
      // Add to top of column
      s.columns[colID].items.unshift(id);
      s.columns[colID].edited = epochms;
    });
    new EditSet()
      .add(c.cards, card)
      .edit(c.columns, ns.columns[colID], ps.columns[colID])
      .commit();
    return ns;
  },
  [deleteColumn]: (ps, a) => {
    const colID = a.payload;
    const ms = new Date().getTime();
    const tabIdx = ps.tabOrder.map(tabID => ps.tabs[tabID].columns.indexOf(colID) !== -1).indexOf(true);
    const ns = produce(ps, s => {
      if (tabIdx >= 0) s.tabs[s.tabOrder[tabIdx]].edited = ms;
      s.columns[colID].items.forEach(cardID => delete s.cards[cardID]);
      Object.values(s.tabs).forEach(tab => deleteInList(tab.columns, colID));
      delete s.columns[colID];
    });
    new EditSet()
      .editAll(c.tabs, ns.tabs, ps.tabs)
      .deleteAllByID(c.cards, ps.columns[colID].items, ps.cards)
      .commit();
    return ns;
  },
  [renameColumn]: (ps, a) => {
    const { colID, name } = a.payload;
    if (ps.columns[colID].name === name)
      return ps;
    const ns = produce(ps, s => {
      s.columns[colID].name = name;
      s.columns[colID].edited = new Date().getTime();
    });
    new EditSet()
      .edit(c.columns, ns.columns[colID], ps.columns[colID])
      .commit();
    return ns;
  },
  [editCardContent]: (ps, a) => {
    const { cardID, content } = a.payload;
    if (ps.cards[cardID].content === content)
      return ps;
    const ns = produce(ps, s => {
      s.cards[cardID].content = content;
      s.cards[cardID].edited = new Date().getTime();
    });
    new EditSet()
      .edit(c.cards, ns.cards[cardID], ps.cards[cardID])
      .commit();
    return ns;
  },
  [deleteCard]: (ps, a) => {
    const cardID = a.payload;
    const ms = new Date().getTime();
    const colIDs = [];
    const ns = produce(ps, s => {
      Object.values(s.columns).forEach(col => {
        if (deleteInList(col.items, cardID)) {
          col.edited = ms;
          colIDs.push(col.id);
        }
      });
      delete s.cards[a.payload];
    });
    new EditSet()
      .delete(c.cards, cardID, ps.cards[cardID])
      .editAllByID(c.columns, ns.columns, colIDs, ps.columns)
      .commit();
    return ns;
  },
  [addColumn]: (ps, a) => {
    const { tabID, name } = a.payload;
    const id = generateID();
    const epochms = new Date().getTime();
    const column = { id, items: [], name, created: epochms, edited: epochms };
    const ns = produce(ps, s => {
      s.columns[id] = column;
      s.tabs[tabID].columns.push(id);
      s.tabs[tabID].edited = epochms;
    });
    new EditSet()
      .add(c.columns, column)
      .edit(c.tabs, ns.tabs[tabID], ps.tabs[tabID])
      .commit();
    return ns;
  },
  [editCard]: (ps, a) => {
    const { card, colID: dstColID } = a.payload;
    // Assume card is a flat struct
    if (shallowEqual(ps.cards[card.id], card))
      return ps;
    const epochms = new Date().getTime();
    const srcColID = Object.keys(ps.columns).filter(colID => ps.columns[colID].items.indexOf(card.id) !== -1)[0];
    const ns = produce(ps, s => {
      s.cards[card.id] = JSON.parse(JSON.stringify(a.payload.card));
      s.cards[card.id].edited = epochms;
      if (srcColID !== dstColID) {
        deleteInList(s.columns[srcColID].items, card.id);
        s.columns[dstColID].items.unshift(card.id);
        s.columns[srcColID].edited = s.columns[dstColID].edited = epochms;
      }
    });
    new EditSet()
      .edit(c.cards, ns.cards[card.id], ps.cards[card.id])
      .concatSimple((() => {
        // Update columns if changed
        const set = new EditSet();
        if (srcColID !== dstColID) {
          set.edit(c.columns, ns.columns[srcColID], ps.columns[srcColID]);
          set.edit(c.columns, ns.columns[dstColID], ps.columns[dstColID]);
        }
        return set;
      })())
      .commit();
    return ns;
  },
  [deleteTab]: (ps, a) => {
    const tabIdx = a.payload;
    const cardIDs = [];
    const tabID = ps.tabOrder[tabIdx];
    const ns = produce(ps, s => {
      const tab = s.tabs[tabID];
      while (tab.columns.length) {
        const colID = tab.columns[0];
        cardIDs.push(...s.columns[colID].items);
        s.columns[colID].items.forEach(cardID => delete s.cards[cardID]);
        delete s.columns[colID];
        tab.columns.shift();
      }
      delete s.tabs[tab.id];
      s.tabOrder.splice(tabIdx, 1);
    });
    const tab = ps.tabs[tabID];
    new EditSet()
      .deleteAllByID(c.cards, cardIDs, ps.cards)
      .deleteAllByID(c.columns, tab.columns, ps.columns)
      .delete(c.tabs, tabID, tab)
      .param(c.tabOrder, ns.tabOrder, ps.tabOrder)
      .commit();
    return ns;
  },
  [addTab]: (ps, a) => {
    const name = a.payload;
    if (!name.length) {
      window.snackbar("Tab name cannot be empty", { variant: 'warning' });
      return ps;
    }
    const tabNames = Object.values(ps.tabs).map(tab => tab.name.toLowerCase());
    if (tabNames.indexOf(name.toLowerCase()) !== -1 || tabNames.map(encodeURIComponent).indexOf(encodeURIComponent(name.toLowerCase())) !== -1) {
      window.snackbar("Tab name already exists", { variant: 'warning' });
      return ps;
    }
    const id = generateID();
    const tab = { name, id, columns: [], created: new Date().getTime() };
    const ns = produce(ps, s => {
      s.tabs[id] = tab;
      s.tabOrder.push(id);
    });
    new EditSet()
      .add(c.tabs, tab)
      .param(c.tabOrder, ns.tabOrder, ps.tabOrder)
      .commit();
    return ns;
  },
  [renameTab]: (ps, a) => {
    const { tabID, name } = a.payload;
    if (ps.tabs[tabID].namd === name)
      return ps;
    const ns = produce(ps, s => {
      s.tabs[tabID].name = name;
      s.tabs[tabID].edited = new Date().getTime();
    });
    new EditSet()
      .edit(c.tabs, ns.tabs[tabID], ps.tabs[tabID])
      .commit();
    return ns;
  },
  [moveColumn]: (ps, a) => {
    const [srcIdx, dstIdx, tabIdx] = a.payload;
    if (srcIdx === dstIdx) return ps;
    const tabID = ps.tabOrder[tabIdx];
    const colID = ps.tabs[tabID].columns[srcIdx];
    const ns = produce(ps, s => {
      s.tabs[tabID].columns.splice(srcIdx, 1);
      s.tabs[tabID].columns.splice(dstIdx, 0, colID);
      s.tabs[tabID].edited = new Date().getTime();
    });
    new EditSet()
      .edit(c.tabs, ns.tabs[tabID], ps.tabs[tabID])
      .commit();
    return ns;
  },
  [moveTab]: (ps, a) => {
    const [srcIdx, dstIdx] = a.payload;
    if (srcIdx === dstIdx) return ps;
    const tabID = ps.tabOrder[srcIdx];
    if (dstIdx < 0 || dstIdx >= ps.tabs.length) return ps;
    const ns = produce(ps, s => {
      s.tabOrder.splice(srcIdx, 1);
      s.tabOrder.splice(dstIdx, 0, tabID);
    });
    new EditSet()
      .param(c.tabOrder, ns.tabOrder, ps.tabOrder)
      .commit();
    return ns;
  },
  [archiveCardsInColumn]: (ps, a) => {
    // Archived cards are stored in IndexedDB and the Gist
    const colID = a.payload;
    if (ps.columns[colID].items.length === 0) return ps;
    const epochms = new Date().getTime();
    // Detach cards from column, edit cards
    const ns = produce(ps, s => {
      s.columns[colID].items.forEach(cardID => {
        let card = s.cards[cardID];
        card.moved = card.edited = card.archived = epochms;
        card.archivedFromColID = colID;
      });
      s.columns[colID].items = [];
      s.columns[colID].edited = epochms;
    });
    new EditSet()
      .editAllByID(c.cards, ns.cards, ps.columns[colID].items, ps.cards)
      .edit(c.columns, ns.columns[colID], ps.columns[colID])
      .commit();
    return ns;
  },
  [addZettel]: (ps, a) => {
    const { zettel } = a.payload;
    const id = zettel.id || generateID();
    const epochms = new Date().getTime();
    const fullZettel = {
      id, type: ZETTEL_NOTE_TYPE,
      created: epochms,  edited: epochms, moved: epochms,
      ...zettel
    };
    const ns = produce(ps, s => {
      s.cards[id] = fullZettel;
    });
    new EditSet()
      .add(c.cards, fullZettel)
      .commit();
    return ns;
  },
  [editZettel]: (ps, a) => {
    const { zettel } = a.payload;
    if (shallowEqual(ps.cards[zettel.id], zettel)) return ps;
    const epochms = new Date().getTime();
    // editZettel will not add new zettels
    if (Object.keys(ps.cards).indexOf(zettel.id) === -1) return ps;
    const ns = produce(ps, s => {
      s.cards[zettel.id] = zettel;
      s.cards[zettel.id].edited = epochms;
    });
    new EditSet()
      .edit(c.cards, zettel, ps.cards[zettel.id])
      .commit();
    return ns;
  },
  [deleteZettel]: (ps, a) => {
    const cardID = a.payload;
    const ns = produce(ps, s => {
      deleteInList(s.starredZettels, a.payload);
      delete s.cards[cardID];
    });
    new EditSet
      .param(c.starredZettels, ns.starredZettels, ps.starredZettels)
      .delete(c.cards, cardID, ps.cards[cardID])
      .commit();
    return ns;
  },
  [toggleZettelStarred]: (ps, a) => {
    const cardID = a.payload;
    const ns = produce(ps, s => {
      if (!s.starredZettels) s.starredZettels = [];
      if (s.starredZettels.indexOf(cardID) === -1)
        s.starredZettels.push(cardID);
      else
        deleteInList(s.starredZettels, cardID);
    });
    new EditSet()
      .param(c.starredZettels, ns.starredZettels, ps.starredZettels)
      .commit();
    return ns;
  },
  [sortColByTime]: (ps, a) => {
    const colID = a.payload;
    const ns = produce(ps, s => {
      // This sorts by epoch millisecond time; anything without a time is at the end in the same order
      // As a bug meant card.time is sometimes a string, we must wrap in new Date(x).getTime() instead of just x
      s.columns[colID].items.sort(
        (a, b) => {
          let aMS = new Date(s.cards[b].time || null).getTime();
          let bMS = new Date(s.cards[a].time || null).getTime();
          if (bMS === 0 && aMS === 0) return 0;
          if (bMS === 0) return 1;
          if (aMS === 0) return -1;
          return bMS - aMS;
        });
    });
    new EditSet()
      .edit(c.columns, ns.columns[colID], ps.columns[colID])
      .commit();
    return ns;
  },
  [loadZettel.pending]: (ps, a) =>
    produce(ps, s => s.loadingZettel = true),
  [loadZettel.fulfilled]: (ps, a) =>
    produce(ps, s => {
      s.cards[a.payload.id] = a.payload;
      delete s.loadingZettel;
    }),
  [loadZettel.rejected]: (ps, a) =>
    produce(ps, s => s.loadingZettel = a.payload),
});
// Actions which do not mutate external state and thus cannot be undone
const undoBlacklist = [
  unsafeSetState.type,
  loadZettel.pending.type,
  loadZettel.fulfilled.type,
  loadZettel.rejected.type,
];

// Undoable reducer
// Note that if an identical state is produced (via ===) the action is ignored
// The app depends on this behaviour
const undoableReducer = undoable(reducer, {
  // Keep in sync with editSetBuffer max size
  limit: UNDO_LIMIT,
  // So we can listen to UNDO events and call commit(set.invert())
  neverSkipReducer: true,
  filter: (action, currentState, previousHistory) => {
    return undoBlacklist.indexOf(action.type) === -1;
  }
});

export default (s, a) => {
  if (a.type === ActionTypes.UNDO && !hist.undo.allowed())
    return s;

  if (a.type === ActionTypes.REDO && !hist.redo.allowed())
    return s;

  if (undoBlacklist.indexOf(a.type) !== -1) {
    // Simulate undoable reducer
    // We can't use the filter because the filter doesn't let us
    // selectively stop undo from applying
    return {...s, present: reducer(s.present, a)};
  }

  return undoableReducer(s, a);
};
