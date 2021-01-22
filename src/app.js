
/**
 * app.js
 * Main JSX source
 */

import React from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import * as duck from './ducks/kanban';
import { synchroniseState, loggedIn } from './backends/github';
import { useHashLocation, useInterval, Hidden } from './common';
import { SnackbarProvider, useSnackbar } from 'notistack';

import { MenuBar, LoadingScreen } from './components';
import Kanban from './kanban';
import Zettelkasten from './zettelkasten';
import store, { globalSelectors as sel } from './store';

const baseTabNames = ["boards", "notes"];
// Get the nth segment of a slash separated list
const getURLPart = (str, n) =>
  str.split("/").filter(s=>s.length)[n < 0 ? str.length + n : n];
const getScreen = loc =>
  Math.max(baseTabNames.indexOf(getURLPart(loc, 0)), 0);
const getScreenNames = () => ["/boards/", "/notes/main"];

const ComponentsContainer = ({ active, setActive }) => {
  return (
    <React.Fragment>
      <Hidden show={active === 0} className='app-section'>
        <Kanban active={active === 0} />
      </Hidden>
      <Hidden show={active === 1} className='app-section'>
        <Zettelkasten active={active === 1} />
      </Hidden>
    </React.Fragment>
  );
};

const Root = () => {
  const dispatch = useDispatch();
  // Update state cache every little while to support concurrent changes across devices
  // It usually takes up to 30 seconds for the revisions to become available so
  // more frequent querying is pointless
  useInterval(() => {
    if (loggedIn()) {
      synchroniseState().then(diff => dispatch(duck.overwriteState(diff)));
    }
  }, 15000);
  const [loc, setLoc] = useHashLocation();
  const [tabURLs, setTabURLs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { enqueueSnackbar } = useSnackbar();
  window.snackbar = enqueueSnackbar;
  // BUG: for some reason the intial state is not the loading state
  // in our createReducer shim and the prevState at first is the empty undoable state
  // The below `state.present === undefined` is a temporary workaround
  // useSelector(console.log);
  const currentlyLoading = useSelector(state => state.present === undefined || sel.boards(state).loading);
  if (loading && !currentlyLoading) {
    setTabURLs(getScreenNames());
    setLoading(false);
  }
  if (currentlyLoading) return <LoadingScreen />;
  const setTabURL = (newURL, i, move) => {
    let newTabURLs = tabURLs.slice(0);
    newTabURLs[i] = newURL;
    setTabURLs(newTabURLs);
    if (move) setLoc(newURL);
  };
  const active = getScreen(loc);
  const setActive = n => {
    if (n === active) {
      // Return to the base page of this tab
      setTabURL(getScreenNames()[active], active, true);
    } else {
      // Save the current URL as the return URL for this tab
      setTabURL(loc, active);
      // Set the location to the saved URL for the new tab
      setLoc(tabURLs[n]);
    }
  }

  return (
    <div id="jsx-root">
      <ComponentsContainer active={active} setActive={setActive} />
      <MenuBar active={active} setActive={setActive} />
    </div>
  );
}

export default () =>
  <Provider store={store}>
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}
      classes={{ containerRoot: 'snackbar-root' }}>
      <Root />
    </SnackbarProvider>
  </Provider>
