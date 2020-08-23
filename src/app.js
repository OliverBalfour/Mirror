
/**
 * app.js
 * Main JSX source file for the app
 * Details like screen size and renderer are abstracted away by index.[platform].js
 * and ../index.js
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';

import { Button, MenuBar } from './components';
import Kanban from './kanban';
import store from './store';

export default () => {
  const [active, setActive] = React.useState(0);

  return (
    <Provider store={store}>
      <View style={{ top: 0, left: 0, height: "100%", width: "100%" }}>

        { active === 0 && (
          <Kanban />
        )}

        <MenuBar active={active} setActive={setActive} />

      </View>
    </Provider>
  );
}
