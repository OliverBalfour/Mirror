
import { configureStore } from '@reduxjs/toolkit';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import * as kanban from './ducks/kanban';
import { objectMap } from './common';
import { loadState } from './backends';

const store = configureStore({
  // DEBUG:
  // reducer: (s, a) => { console.log(a); kanban.default(s, a) },
  reducer: kanban.default,
});

// Load state. Ignore lazy loading for now.
loadState(true).then(state => {
  store.dispatch(kanban.unsafeSetState(state));
});

// Undo/redo keyboard shortcuts if supported
try {
  document.addEventListener('keyup', e => {
    const ignored = ['input', 'textarea'];
    if (ignored.indexOf(document.activeElement.tagName.toLowerCase()) !== -1) return;
    if (e.ctrlKey && e.which === 90 && !e.shiftKey)
      store.dispatch(UndoActionCreators.undo());
    else if ((e.ctrlKey && e.shiftKey && e.which === 90) || (e.ctrlKey && e.which === 89))
      store.dispatch(UndoActionCreators.redo());
  });
} catch (e) {}

export default store;

// produce global selectors
export const globalSelectors = {
  boards: state => state.present
}
export const selectors = {
  boards: objectMap(kanban.selectors, localSelector => state => localSelector(globalSelectors.boards(state)))
};
