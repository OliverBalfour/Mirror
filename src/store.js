
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import boards from './ducks/kanban';

const reducer = combineReducers({
  boards,
  // notes,
});

export default configureStore({ reducer });
