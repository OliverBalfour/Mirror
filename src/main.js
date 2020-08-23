
import { setStatusBarStyle } from 'expo-status-bar';
import React from 'react';
import { Platform, Dimensions, StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import Constants from 'expo-constants';

import { Button, MenuBar } from './components';
import Kanban from './kanban';
import store from './store';

setStatusBarStyle("dark");

export default class Application extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      screen: Dimensions.get('window'),
      active: 0, // 0 is board, 1 is notes
    };

    Dimensions.addEventListener('change', e => this.onLayout());
  }

  onLayout () {
    // rerender on mobile orientation change
    // force update on native to update ALL components
    this.state.screen = Dimensions.get('window');
    if (Platform.OS === "web")
      this.setState({ screen: this.state.screen });
    else
      this.forceUpdate();
  }

  render () {
    const style = {
      top: Constants.statusBarHeight,
      left: 0,
      height: Platform.OS === "web" ? "100%"
        : this.state.screen.height - Constants.statusBarHeight,
      width: "100%"
    }

    // Note: PaperProvider is not needed for web
    // TODO: create index.native.js that uses PaperProvider and handles status bar height
    // and rename this to app.js
    return (
      <PaperProvider>
        <Provider store={store}>
          <View style={style}>

            {/*
              This approach renders only the active screen, and leads to lag when changing screens.
              Another approach is to load the active screen, then using componentDidMount load all
              the others inside the following snippet:
              <View style={active ? {height: "100%", width: "100%"} : {
                width: 0,
                height: 0,
              }}> ... </View>
            */}

            { this.state.active === 0 && (
              <Kanban />
            )}

            <MenuBar active={this.state.active} setActive={x => this.setState({ active: x })} />

          </View>
        </Provider>
      </PaperProvider>
    );
  }
};
