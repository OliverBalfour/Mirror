
/**
 * app.js
 * Main JSX source file for the app
 * Details like screen size and renderer are abstracted away by index.[platform].js
 * and ../index.js
 */

import React from 'react';
import { Provider } from 'react-redux';
import { useHashLocation, Hidden } from './common';
// import { createMuiTheme, ThemeProvider } from '@material-ui/core';

import { MenuBar } from './components';
import Kanban from './kanban';
import Zettelkasten from './zettelkasten';
import store, { globalSelectors as sel } from './store';

const baseTabNames = ["boards", "notes"];
// Get the nth segment of a slash separated list
const getURLPart = (str, n) =>
  str.split("/").filter(s=>s.length)[n < 0 ? str.length + n : n];
const getScreen = loc =>
  Math.max(baseTabNames.indexOf(getURLPart(loc, 0)), 0);
const getScreenNames = () => {
  let screenNames = ["/boards/", "/notes/main"];
  // boards get special treatment of /boards/FIRST_TAB
  const state = sel.boards(store.getState());
  screenNames[0] += state.tabs[state.tabOrder[0]].name.toLowerCase();
  return screenNames;
}

export default () => {
  const [loc, setLoc] = useHashLocation();
  const [tabURLs, setTabURLs] = React.useState(getScreenNames());
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
      setTabURL("/" + baseTabNames[active], active, true);
    } else {
      // Save the current URL as the return URL for this tab
      setTabURL(loc, active);
      // Set the location to the saved URL for the new tab
      setLoc(tabURLs[n]);
    }
  }

  const style = { height: "calc(100% - 48px)" };

  return (
    <Provider store={store}>
      <div id="jsx-root">
        <div style={style}>
          <Hidden show={active === 0}>
            <Kanban active={active === 0} />
          </Hidden>
          <Hidden show={active === 1}>
            <Zettelkasten active={active === 1} />
          </Hidden>
        </div>
        <MenuBar active={active} setActive={setActive} />
      </div>
    </Provider>
  );
}
