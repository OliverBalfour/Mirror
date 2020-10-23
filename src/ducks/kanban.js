
/**
 * Kanban boards core Redux logic
 *
 * State is normalised as { tabs, columns, cards }
 *  where each tab has several columns which contain cards
 *  each has a unique ID as a key in the respective object
 */

import { createReducer, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import { generateID, objectMap, deleteInList } from '../common';
import { EditSet, commit, load } from '../backends';

// Action creators

export const unsafeSetState = createAction('mirror/SET_STATE');  // Used for async initial state

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

const reducer = createReducer(loadingState, {
  [unsafeSetState]: (s, a) => {
    for (let key in s) {
      delete s[key];
    }
    for (let key in a.payload) {
      s[key] = a.payload[key];
    }
  },
  [transferCard]: (s, a) => {
    const { srcColID, dstColID, srcIndex, dstIndex } = a.payload;
    let srcCol = s.columns[srcColID].items;
    let dstCol = s.columns[dstColID].items;
    const [removed] = srcCol.splice(srcIndex, 1);
    const epochms = new Date().getTime();
    s.cards[removed].moved = epochms;
    s.columns[srcColID].edited = epochms;
    s.columns[dstColID].edited = epochms;
    dstCol.splice(dstIndex, 0, removed);
  },
  [reorderCard]: (s, a) => {
    const { colID, srcIndex, dstIndex } = a.payload;
    const epochms = new Date().getTime();
    s.columns[colID].edited = epochms;
    let newitems = s.columns[colID].items;
    const [removed] = newitems.splice(srcIndex, 1);
    s.cards[removed].moved = epochms;
    newitems.splice(dstIndex, 0, removed);
    s.columns[colID].items = newitems;
  },
  [addCard]: (s, a) => {
    const { content, colID } = a.payload;
    const id = generateID();
    const epochms = new Date().getTime();
    // add to cards list
    s.cards[id] = { id, content, type: KANBAN_CARD_TYPE,
      created: epochms,  edited: epochms, moved: epochms };
    s.columns[colID].items.unshift(id); // add to top of column
    s.columns[colID].edited = epochms;
  },
  [deleteColumn]: (s, a) => {
    // TODO: edit set
    const colID = a.payload;
    const ms = new Date().getTime();
    const tabIdx = Object.values(s.tabs).map(tab => tab.columns.indexOf(a.payload) !== -1).indexOf(true);
    if (tabIdx >= 0) s.tabs[s.tabOrder[tabIdx]].edited = ms;
    s.columns[colID].items.forEach(cardID => delete s.cards[cardID]);
    Object.values(s.tabs).forEach(tab => deleteInList(tab.columns, colID));
    delete s.columns[colID];
  },
  [renameColumn]: (s, a) => {
    const { colID, name } = a.payload;
    s.columns[colID].name = name;
    s.columns[colID].edited = new Date().getTime();
  },
  [editCardContent]: (s, a) => {
    const { cardID, content } = a.payload;
    s.cards[cardID].content = content;
    s.cards[cardID].edited = new Date().getTime();
  },
  [deleteCard]: (s, a) => {
    // TODO: edit set
    const ms = new Date().getTime();
    Object.values(s.columns).forEach(col => {
      if (deleteInList(col.items, a.payload))
        col.edited = ms;
    });
    delete s.cards[a.payload];
  },
  [addColumn]: (s, a) => {
    const { tabID, name } = a.payload;
    const id = generateID();
    const epochms = new Date().getTime();
    s.columns[id] = { id, items: [], name, created: epochms, edited: epochms };
    s.tabs[tabID].columns.push(id);
    s.tabs[tabID].edited = epochms;
  },
  [editCard]: (s, a) => {
    const { card, colID } = a.payload;
    const epochms = new Date().getTime();
    s.cards[card.id] = a.payload.card;
    s.cards[card.id].edited = epochms;
    const srcColID = Object.keys(s.columns).filter(colID => s.columns[colID].items.indexOf(card.id) !== -1)[0];
    const dstColID = colID;
    if (srcColID !== dstColID) {
      deleteInList(s.columns[srcColID].items, card.id);
      s.columns[dstColID].items.unshift(card.id);
      s.columns[srcColID].edited = s.columns[dstColID].edited = epochms;
    }
  },
  [deleteTab]: (s, a) => {
    // TODO: edit set
    const tabIdx = a.payload;
    const tab = s.tabs[s.tabOrder[tabIdx]];
    while (tab.columns.length) {
      const colID = tab.columns[0];
      s.columns[colID].items.forEach(cardID => delete s.cards[cardID]);
      delete s.columns[colID];
      tab.columns.shift();
    }
    delete s.tabs[s.tabOrder[tabIdx]];
    s.tabOrder.splice(tabIdx, 1);
  },
  [addTab]: (s, a) => {
    const id = generateID();
    const name = a.payload;
    s.tabs[id] = { name, id, columns: [], created: new Date().getTime() };
    s.tabOrder.push(id);
  },
  [renameTab]: (s, a) => {
    const { tabID, name } = a.payload;
    s.tabs[tabID].name = name;
    s.tabs[tabID].edited = new Date().getTime();
  },
  [moveColumn]: (s, a) => {
    const [srcIdx, dstIdx, tabIdx] = a.payload;
    const tabID = s.tabOrder[tabIdx];
    let newitems = s.tabs[tabID].columns;
    const [removed] = newitems.splice(srcIdx, 1);
    newitems.splice(dstIdx, 0, removed);
    s.tabs[tabID].columns = newitems;
    s.tabs[tabID].edited = new Date().getTime();
  },
  [moveTab]: (s, a) => {
    const [srcIdx, dstIdx] = a.payload;
    if (dstIdx < 0 || dstIdx >= s.tabs.length) return;
    let newitems = s.tabOrder;
    const [removed] = newitems.splice(srcIdx, 1);
    newitems.splice(dstIdx, 0, removed);
    s.tabOrder = newitems;
  },
  [archiveCardsInColumn]: (s, a) => {
    // archived cards still exist in memory but are not listed in a column's items
    const colID = a.payload;
    const epochms = new Date().getTime();
    s.columns[colID].items.forEach(cardID => {
      let card = s.cards[cardID];
      card.moved = card.edited = card.archived = epochms;
      card.archivedFromColID = a.payload;
    });
    s.columns[colID].items = [];
    s.columns[colID].edited = epochms;
  },
  [addZettel]: (s, a) => {
    const { zettel } = a.payload;
    const id = zettel.id || generateID();
    const epochms = new Date().getTime();
    s.cards[id] = { id, type: ZETTEL_NOTE_TYPE, created: epochms,  edited: epochms, moved: epochms,
      ...zettel };
  },
  [editZettel]: (s, a) => {
    const { zettel } = a.payload;
    const epochms = new Date().getTime();
    // editZettel does not add new zettels
    if (Object.keys(s.cards).indexOf(zettel.id) === -1) return;
    s.cards[zettel.id] = zettel;
    s.cards[zettel.id].edited = epochms;
  },
  [deleteZettel]: (s, a) => {
    // TODO: edit set
    deleteInList(s.starredZettels, a.payload);
    delete s.cards[a.payload];
  },
  [toggleZettelStarred]: (s, a) => {
    if (!s.starredZettels) s.starredZettels = [];
    if (s.starredZettels.indexOf(a.payload) === -1)
      s.starredZettels.push(a.payload);
    else
      deleteInList(s.starredZettels, a.payload);
  },
  [sortColByTime]: (s, a) => {
    // This sorts by epoch millisecond time; anything without a time is at the end in the same order
    // As a bug meant card.time is sometimes a string, we must wrap in new Date(x).getTime() instead of just x
    s.columns[a.payload].items.sort(
      (a, b) => {
        let aMS = new Date(s.cards[b].time || null).getTime();
        let bMS = new Date(s.cards[a].time || null).getTime();
        if (bMS === 0 && aMS === 0) return 0;
        if (bMS === 0) return 1;
        if (aMS === 0) return -1;
        return bMS - aMS;
    });
  },
  [loadZettel.pending]: (s, a) => {
    s.loadingZettel = true;
  },
  [loadZettel.fulfilled]: (s, a) => {
    s.cards[a.payload.id] = a.payload;
    delete s.loadingZettel;
  },
  [loadZettel.rejected]: (s, a) => {
    s.loadingZettel = a.payload;
  },
});

// Undoable reducer
export default undoable(reducer, {limit:20});
