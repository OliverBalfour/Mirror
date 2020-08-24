
/**
 * Kanban boards core Redux logic
 *
 * State is normalised as { tabs, columns, cards }
 *  where each tab has several columns which contain cards
 *  each has a unique ID as a key in the respective object
 */

import { createReducer, createAction, createSelector } from '@reduxjs/toolkit';
import { dummyState } from '../common/utils';

// Action creators

export const transferCard = createAction('kanban/TRANSFER_CARD');
export const reorderCard = createAction('kanban/REORDER_CARD');

export const moveCard = (srcColID, dstColID, srcIndex, dstIndex) =>
  srcColID === dstColID
    ? reorderCard({ colID: srcColID, srcIndex, dstIndex })
    : transferCard({ srcColID, dstColID, srcIndex, dstIndex });

// Selectors

const _getColByID = state => id => state.columns.filter(col => col.id === id)[0];
const _getCardByID = state => id => state.cards.filter(card => card.id === id)[0];

const indexFromID = (list, id) => list.map(item => item.id === id).indexOf(true);

// higher order function which creates a selector for a specific tab
// it un-normalises the state for that tab, returning:
// return :: List[column], column :: { id, items: List[card] }, card :: { id, content }
export const getColumnsInTab = tab => state =>
  state.tabs[tab].columns.map(_getColByID(state))
    .map(col => ({
      id: col.id,
      items: col.items.map(_getCardByID(state))
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
  }
});

export default reducer;
