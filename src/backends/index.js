
// TODO: design storage backend API which can be used for IndexedDB cache (fall back on localStorage) and GitHub Gist API remote
// This file will combine all backends into one interface which uses a store.subscribe() to update all
// If neither is initialised then it will generate an initial state
// The load and save functions will be async

import './github';
export { loadState, saveState } from './localstorage';
