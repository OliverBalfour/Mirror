
/**
 * Kanban boards core Redux logic
 *
 * State is normalised as { tabs, columns, cards }
 *  where each tab has several columns which contain cards
 *  each has a unique ID as a key in the respective object
 */

import { createReducer, createAction, createSelector } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import { loadState, generateID, objectMap } from '../common/utils';

// Action creators

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

export const addTab = createAction('kanban/ADD_TAB'); // takes name
export const deleteTab = createAction('kanban/DELETE_TAB'); // takes tabIdx
export const renameTab = createAction('kanban/RENAME_TAB'); // takes { tabID, name }
export const moveTab = createAction('kanban/MOVE_TAB'); // takes [srcIdx, dstIdx]

export const addZettel = createAction('zettelkasten/ADD_ZETTEL'); // takes { zettel: {...} }
export const editZettel = createAction('zettelkasten/EDIT_ZETTEL'); // takes { zettel }
export const deleteZettel = createAction('zettelkasten/DELETE_ZETTEL'); // takes zettelID

// Helpers

// const indexFromID = (list, id) => list.map(item => item.id === id).indexOf(true);
// const deleteByID = (list, id) => list.splice(indexFromID(list, id), 1);
const deleteInList = (list, elem) => {
  let index = list.indexOf(elem);
  if (index !== -1) list.splice(index, 1); // undesired behaviour when splicing at (-1, 1)
  return index !== -1;
};
// const _deleteColumn = (s, id) => {
//   const colIdx = indexFromID(s.columns, id);
//   s.columns[colIdx].items.forEach(cardID => deleteByID(s.cards, cardID));
//   s.tabs.forEach(tab => deleteInList(tab.columns, id));
//   deleteByID(s.columns, id);
// };

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
};

// Reducers

const initialState = loadState();

const reducer = createReducer(initialState, {
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
    s.cards[id] = { id, content,
      created: epochms,  edited: epochms, moved: epochms };
    s.columns[colID].items.unshift(id); // add to top of column
    s.columns[colID].edited = epochms;
  },
  [deleteColumn]: (s, a) => {
    const colID = a.payload;
    const tabIdx = Object.values(s.tabs).map(tab => tab.columns.indexOf(a.payload) !== -1).indexOf(true);
    if (tabIdx >= 0) s.tabs[s.tabOrder[tabIdx]].edited = new Date().getTime();
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
    Object.values(s.columns).forEach(col => {
      if (deleteInList(col.items, a.payload))
        col.edited = new Date().getTime();
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
    s.cards[id] = { id, created: epochms,  edited: epochms, moved: epochms,
      ...zettel };
  },
  [editZettel]: (s, a) => {
    const { zettel } = a.payload;
    const epochms = new Date().getTime();
    s.cards[zettel.id] = zettel;
    s.cards[zettel.id].edited = epochms;
  },
  [deleteZettel]: (s, a) => {
    // TODO: clean up links?
    delete s.cards[a.payload];
  },
});

export default undoable(reducer, {limit:20});
