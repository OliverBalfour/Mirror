
/**
 * app.js
 * Main JSX source file for the app
 * Details like screen size and renderer are abstracted away by index.[platform].js
 * and ../index.js
 */

import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { useHashLocation } from './common/utils';
// import { createMuiTheme, ThemeProvider } from '@material-ui/core';

import { Button, MenuBar } from './components';
import Kanban from './kanban';
import Zettelkasten from './zettelkasten';
import store, { globalSelectors as sel } from './store';

const screenNames = ["/boards", "/notes"];
const getScreen = loc => {
  const name = "/" + loc.split("/")[1]; // strip to / or /boards, etc
  return Math.max(screenNames.indexOf(name), 0);
};
const getScreenName = n => {
  if (n === 0) {
    // boards get special treatment of /boards/FIRST_TAB
    const state = sel.boards(store.getState());
    return "/boards/" + state.tabs[state.tabOrder[0]].name.toLowerCase();;
  } else return screenNames[n];
}

// const theme = createMuiTheme({
//   palette: {
//     // primary: { main: '#1976d2', dark: '#1466b8' },
//   },
// });

export default () => {
  const [loc, setLoc] = useHashLocation();
  const active = getScreen(loc);
  const setActive = n => setLoc(getScreenName(n));
  const style = Platform.OS === "web"
    ? { height: "calc(100% - 48px)" }
    : { flexGrow: 1 };

  return (
    <Provider store={store}>
      {/*<ThemeProvider theme={theme}>*/}
        <View style={{ top: 0, left: 0, height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>

          <View style={style}>
            { active === 0 && (
              <Kanban />
            )}
            { active === 1 && (
              <Zettelkasten />
            )}
          </View>

          <MenuBar active={active} setActive={setActive} />

        </View>
      {/*</ThemeProvider>*/}
    </Provider>
  );
}
