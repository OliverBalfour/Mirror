
import { setStatusBarStyle } from 'expo-status-bar';
import React from 'react';
import { Platform, Dimensions, StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Constants from 'expo-constants';

import Button from './comps/button';
import TabView from './comps/tabview';
import BoardView from './comps/boardview';
import MenuBar from './menubar';

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

    return (
      <PaperProvider>
        <View style={style}>
          { this.state.active === 0 && (
            <TabView
              tabs={["one", "two"]}
              render={i => (<BoardView index={i} />)} />
          )}
          <MenuBar active={this.state.active} setActive={x => this.setState({ active: x })} />
        </View>
      </PaperProvider>
    );
  }
};
