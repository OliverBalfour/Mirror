
/**
 * BoardView component
 *
 * <BoardView
 *   index={1}
 *   boards={[ exampleBoardObject ]}
 *   render={i => (<SomeComponent index={i} />)}
 * />
 *
 */

import * as React from 'react';
import { View, Text } from 'react-native';

export default ({ index }) => (
  <View style={{ backgroundColor: ['#ff4081', '#673ab7'][index], flex: 1 }}>
    <Text>{index}</Text>
  </View>
);
