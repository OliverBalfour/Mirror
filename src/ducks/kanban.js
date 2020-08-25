
/**
 * Kanban boards core Redux logic
 *
 * State is normalised as { tabs, columns, cards }
 *  where each tab has several columns which contain cards
 *  each has a unique ID as a key in the respective object
 */

import { createReducer, createAction, createSelector } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import { dummyState, generateID } from '../common/utils';

// Action creators

export const transferCard = createAction('kanban/TRANSFER_CARD');
export const reorderCard = createAction('kanban/REORDER_CARD');
export const addCard = createAction('kanban/ADD_CARD'); // takes { content, colID }
export const editCardContent = createAction('kanban/EDIT_CARD_CONTENT');//takes {content, cardID}

export const moveCard = (srcColID, dstColID, srcIndex, dstIndex) =>
  srcColID === dstColID
    ? reorderCard({ colID: srcColID, srcIndex, dstIndex })
    : transferCard({ srcColID, dstColID, srcIndex, dstIndex });

export const deleteColumn = createAction('kanban/DELETE_COLUMN'); // takes string column ID
export const renameColumn = createAction('kanban/RENAME_COLUMN'); // takes { colID, name }

// Selectors

const _getColByID = state => id => state.columns.filter(col => col.id === id)[0];
const _getCardByID = state => id => state.cards.filter(card => card.id === id)[0];

const indexFromID = (list, id) => list.map(item => item.id === id).indexOf(true);
const deleteByID = list => id => list.splice(indexFromID(list, id), 1);
const deleteInList = (list, elem) => {
  let index = list.indexOf(elem);
  if (index !== -1) list.splice(index, 1); // undesired behaviour when splicing at (-1, 1)
};

// higher order function which creates a selector for a specific tab
// it un-normalises the state for that tab, returning:
// return :: List[column], column :: { id, items: List[card] }, card :: { id, content }
export const getColumnsInTab = tab => state =>
  state.tabs[tab].columns.map(_getColByID(state))
    .map(col => ({
      ...col, items: col.items.map(_getCardByID(state))
    }));

// Reducers

const initialState = dummyState();

const reducer = createReducer(initialState, {
  [transferCard]: (s, a) => {
    const srcColIdx = indexFromID(s.columns, a.payload.srcColID);
    const dstColIdx = indexFromID(s.columns, a.payload.dstColID);

    let srcCol = s.columns[srcColIdx].items;
    let dstCol = s.columns[dstColIdx].items;
    const [removed] = srcCol.splice(a.payload.srcIndex, 1);
    dstCol.splice(a.payload.dstIndex, 0, removed);
  },
  [reorderCard]: (s, a) => {
    const colIdx = indexFromID(s.columns, a.payload.colID);
    let newitems = s.columns[colIdx].items;
    const [removed] = newitems.splice(a.payload.srcIndex, 1);
    newitems.splice(a.payload.dstIndex, 0, removed);
    s.columns[colIdx].items = newitems;
  },
  [addCard]: (s, a) => {
    const { content, colID } = a.payload;
    const colIdx = indexFromID(s.columns, a.payload.colID);
    const cardID = generateID();
    s.cards.push({ id: cardID, content });   // add to cards list
    s.columns[colIdx].items.unshift(cardID); // add to top of column
  },
  [deleteColumn]: (s, a) => {
    const colIdx = indexFromID(s.columns, a.payload);
    s.columns[colIdx].items.forEach(deleteByID(s.cards));
    s.tabs.forEach(tab => deleteInList(tab.columns, a.payload));
    deleteByID(s.columns)(a.payload);
  },
  [renameColumn]: (s, a) => {
    s.columns[indexFromID(s.columns, a.payload.colID)].name = a.payload.name;
  },
  [editCardContent]: (s, a) => {
    s.cards[indexFromID(s.cards, a.payload.cardID)].content = a.payload.content;
  }
});

export default undoable(reducer);
