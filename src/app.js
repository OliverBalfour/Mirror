
/**
 * app.js
 * Main JSX source file for the app
 * Details like screen size and renderer are abstracted away by index.[platform].js
 * and ../index.js
 */

import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Provider } from 'react-redux';

import { Button, MenuBar } from './components';
import Kanban from './kanban';
import store from './store';

export default () => {
  const [active, setActive] = React.useState(0);
  const style = Platform.OS === "web"
    ? { maxHeight: "calc(100% - 48px)" }
    : { flexGrow: 1 };

  return (
    <Provider store={store}>
      <View style={{ top: 0, left: 0, height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>

        <View style={style}>
          { active === 0 && (
            <Kanban />
          )}
        </View>

        <MenuBar active={active} setActive={setActive} />

      </View>
    </Provider>
  );
}
