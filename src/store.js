
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import boards, { selectors as boardSelectors } from './ducks/kanban';
import { saveState, objectMap } from './common/utils';

const store = configureStore({ reducer: boards });

// Undo/redo keyboard shortcuts if supported
try {
  document.addEventListener('keyup', e => {
    if (e.ctrlKey && e.which === 90)
      store.dispatch(UndoActionCreators.undo());
    else if (e.ctrlKey && e.shiftKey && e.which === 90 || e.ctrlKey && e.which === 89)
      store.dispatch(UndoActionCreators.redo());
  });
} catch (e) {}

export default store;

// produce global selectors
export const globalSelectors = {
  boards: state => state.present
}
export const selectors = {
  boards: objectMap(boardSelectors, localSelector => state => localSelector(globalSelectors.boards(state)))
};

// Save board state (excluding history)
// to save history efficiently we would need to store a state 50 states ago, the 50 actions since,
// and the current state; this would require a rewrite of redux-undo
const localStorageSubscriber = () => saveState(globalSelectors.boards(store.getState()));
store.subscribe(localStorageSubscriber);
localStorageSubscriber(); // save data generated on first run
