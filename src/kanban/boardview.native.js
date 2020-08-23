
import * as React from 'react';
import { View, Text } from 'react-native';

export default ({ index }) => (
  <View style={{ backgroundColor: ['#ff4081', '#673ab7'][index], flex: 1 }}>
    <Text>Native placeholder. Tab {index}</Text>
  </View>
);
