
/*
 * Exports generateInitialState :: () -> state
 */

import initialState from '../../public/initial-state.json';

// generate initial dummy state
export const generateInitialState = () => {
  return initialState;

  // TODO: async fetch
  // This is tricky because the Redux store may use it for initialisation
  // and many parts of the app (foolishly) directly import the store

  // fetch("./initial-state.json")
  //   .then(res => res.json())
  //   .catch(e => alert("Could not load initial state. Error: " + e));
}
