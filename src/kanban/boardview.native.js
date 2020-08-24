
import * as React from 'react';
import { View, Text } from 'react-native';

export default ({ tab }) => (
  <View style={{ backgroundColor: ['#ff4081', '#673ab7'][tab], flex: 1, border: '5px inset black' }}>
    <View style={{flex: 1, margin: 10, backgroundColor: 'red'}}>

      <Text>Native placeholder. Tab {tab}</Text>
    </View>
  </View>
);
