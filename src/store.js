
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import boards from './ducks/kanban';

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

export default store;
