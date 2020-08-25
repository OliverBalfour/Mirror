
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import boards from './ducks/kanban';
import { saveState } from './common/utils';

const reducer = combineReducers({
  boards,
  // notes,
});

const store = configureStore({ reducer });

// Undo/redo keyboard shortcuts if supported
try {
  document.addEventListener('keyup', e => {
    if (e.ctrlKey && e.which === 90)
      store.dispatch(UndoActionCreators.undo());
    else if (e.ctrlKey && e.shiftKey && e.which === 90 || e.ctrlKey && e.which === 89)
      store.dispatch(UndoActionCreators.redo());
  });
} catch (e) {}

// Save board state (excluding history)
// TODO: how can we include history? We cannot serialise all state easily with our combineReducers
// approach unfortunately
store.subscribe(() => saveState(store.getState().boards.present));

export default store;
