
/**
 * index.native.js
 * Wraps strange quirks of native apps into one place
 * Fixes app bleeding into status bar, app resizing, adds React Native Paper provider
 */

import { setStatusBarStyle } from 'expo-status-bar';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Constants from 'expo-constants';

import Application from './app';

setStatusBarStyle("dark");

export default class Root extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      screen: Dimensions.get('window')
    };

    Dimensions.addEventListener('change', e => this.resize());
  }

  resize () {
    // rerender on mobile orientation change
    // force update on native to update ALL components
    this.state.screen = Dimensions.get('window');
    this.forceUpdate();
  }

  render () {
    const style = {
      top: Constants.statusBarHeight,
      left: 0,
      height: this.state.screen.height - Constants.statusBarHeight,
      width: "100%"
    }

    return (
      <PaperProvider>
        <View style={style}>
          <Application />
        </View>
      </PaperProvider>
    );
  }
};
