
/**
 * Kanban boards core Redux logic
 *
 * State is normalised as { tabs, columns, cards }
 *  where each tab has several columns which contain cards
 *  each has a unique ID as a key in the respective object
 */

import { createReducer, createAction, createSelector } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import { loadState, generateID } from '../common/utils';

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

// Helpers

const indexFromID = (list, id) => list.map(item => item.id === id).indexOf(true);
const deleteByID = (list, id) => list.splice(indexFromID(list, id), 1);
const deleteInList = (list, elem) => {
  let index = list.indexOf(elem);
  if (index !== -1) list.splice(index, 1); // undesired behaviour when splicing at (-1, 1)
  return index !== -1;
};
const _deleteColumn = (s, id) => {
  const colIdx = indexFromID(s.columns, id);
  s.columns[colIdx].items.forEach(cardID => deleteByID(s.cards, cardID));
  s.tabs.forEach(tab => deleteInList(tab.columns, id));
  deleteByID(s.columns, id);
};

// Selectors

export const selectors = {
  // higher order function which creates a selector for a specific tab
  // it un-normalises the state for that tab, returning:
  // return :: List[column], column :: { id, items: List[card] }, card :: { id, content }
  getColumnsInTabs: state =>
    state.tabs.map((_, tab) => state.tabs[tab].columns.map(col => state.columns[indexFromID(state.columns, col)])
      .map(col => ({
        ...col, items: col.items.map(card => state.cards[indexFromID(state.cards, card)])
      }))),
  columns: state => state.columns,
  tabs: state => state.tabs,
  cards: state => state.cards,
  archivedCards: state => state.cards.filter(card => Object.keys(card).indexOf("archived") !== -1),
  activeCards:   state => state.cards.filter(card => Object.keys(card).indexOf("archived") === -1),
};

// Reducers

const initialState = loadState();

const reducer = createReducer(initialState, {
  [transferCard]: (s, a) => {
    const srcColIdx = indexFromID(s.columns, a.payload.srcColID);
    const dstColIdx = indexFromID(s.columns, a.payload.dstColID);

    let srcCol = s.columns[srcColIdx].items;
    let dstCol = s.columns[dstColIdx].items;
    const [removed] = srcCol.splice(a.payload.srcIndex, 1);
    const epochms = new Date().getTime();
    s.cards[indexFromID(s.cards, removed)].moved = epochms;
    s.columns[srcColIdx].edited = epochms;
    s.columns[dstColIdx].edited = epochms;
    dstCol.splice(a.payload.dstIndex, 0, removed);
  },
  [reorderCard]: (s, a) => {
    const colIdx = indexFromID(s.columns, a.payload.colID);
    const epochms = new Date().getTime();
    s.columns[colIdx].edited = epochms;
    let newitems = s.columns[colIdx].items;
    const [removed] = newitems.splice(a.payload.srcIndex, 1);
    s.cards[indexFromID(s.cards, removed)].moved = epochms;
    newitems.splice(a.payload.dstIndex, 0, removed);
    s.columns[colIdx].items = newitems;
  },
  [addCard]: (s, a) => {
    const { content, colID } = a.payload;
    const colIdx = indexFromID(s.columns, a.payload.colID);
    const cardID = generateID();
    const epochms = new Date().getTime();
    // add to cards list
    s.cards.push({ id: cardID, content,
      created: epochms,  edited: epochms, moved: epochms });
    s.columns[colIdx].items.unshift(cardID); // add to top of column
    s.columns[colIdx].edited = epochms;
  },
  [deleteColumn]: (s, a) => {
    const tabIdx = s.tabs.map(tab => tab.columns.indexOf(a.payload) !== -1).indexOf(true);
    if (tabIdx >= 0) s.tabs[tabIdx].edited = new Date().getTime();
    _deleteColumn(s, a.payload);
  },
  [renameColumn]: (s, a) => {
    const idx = indexFromID(s.columns, a.payload.colID);
    s.columns[idx].name = a.payload.name;
    s.columns[idx].edited = new Date().getTime();
  },
  [editCardContent]: (s, a) => {
    const idx = indexFromID(s.cards, a.payload.cardID);
    s.cards[idx].content = a.payload.content;
    s.cards[idx].edited = new Date().getTime();
  },
  [deleteCard]: (s, a) => {
    const cardIdx = indexFromID(s.cards, a.payload);
    s.columns.forEach(col => {
      if (deleteInList(col.items, a.payload))
        col.edited = new Date().getTime();
    });
    deleteByID(s.cards, a.payload);
  },
  [addColumn]: (s, a) => {
    const id = generateID();
    const epochms = new Date().getTime();
    s.columns.push({ id, items: [], name: a.payload.name, created: epochms, edited: epochms });
    const idx = indexFromID(s.tabs, a.payload.tabID);
    s.tabs[idx].columns.push(id);
    s.tabs[idx].edited = epochms;
  },
  [editCard]: (s, a) => {
    const cardIdx = indexFromID(s.cards, a.payload.card.id);
    const epochms = new Date().getTime();
    s.cards[cardIdx] = a.payload.card;
    s.cards[cardIdx].edited = epochms;
    const srcColIdx = s.columns.map(col => col.items.indexOf(a.payload.card.id) !== -1).indexOf(true);
    const dstColIdx = indexFromID(s.columns, a.payload.colID);
    if (srcColIdx !== dstColIdx) {
      deleteInList(s.columns[srcColIdx].items, a.payload.card.id);
      s.columns[dstColIdx].items.unshift(a.payload.card.id);
      s.columns[srcColIdx].edited = s.columns[dstColIdx].edited = epochms;
    }
  },
  [deleteTab]: (s, a) => {
    while (s.tabs[a.payload].columns.length)
      _deleteColumn(s, s.tabs[a.payload].columns[0]);
    s.tabs.splice(a.payload, 1);
  },
  [addTab]: (s, a) => {
    s.tabs.push({ name: a.payload, id: generateID(), columns: [], created: new Date().getTime() });
  },
  [renameTab]: (s, a) => {
    const idx = indexFromID(s.tabs, a.payload.tabID);
    s.tabs[idx].name = a.payload.name;
    s.tabs[idx].edited = new Date().getTime();
  },
  [moveColumn]: (s, a) => {
    const [srcIdx, dstIdx, tabIdx] = a.payload;
    let newitems = s.tabs[tabIdx].columns;
    const [removed] = newitems.splice(srcIdx, 1);
    newitems.splice(dstIdx, 0, removed);
    s.tabs[tabIdx].columns = newitems;
    s.tabs[tabIdx].edited = new Date().getTime();
  },
  [moveTab]: (s, a) => {
    const [srcIdx, dstIdx] = a.payload;
    if (dstIdx < 0 || dstIdx >= s.tabs.length) return;
    let newitems = s.tabs;
    const [removed] = newitems.splice(srcIdx, 1);
    newitems.splice(dstIdx, 0, removed);
    s.tabs = newitems;
  },
  [archiveCardsInColumn]: (s, a) => {
    // archived cards still exist in memory but are not listed in a column's items
    const colIdx = indexFromID(s.columns, a.payload);
    const epochms = new Date().getTime();
    s.columns[colIdx].items.forEach(cardID => {
      let card = s.cards[indexFromID(s.cards, cardID)];
      card.moved = card.edited = card.archived = epochms;
      card.archivedFromColID = a.payload;
    });
    s.columns[colIdx].items = [];
    s.columns[colIdx].edited = epochms;
  },
});

export default undoable(reducer, {limit:20});
