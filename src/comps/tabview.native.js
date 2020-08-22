
/**
 * TabView component
 *
 * <TabView
 *   tabs={["one", "two", "three"]}
 *   render={i => (<SomeComponent index={i} />)}
 * />
 *
 */

import * as React from 'react';
import { Dimensions } from 'react-native';
import { TabView } from 'react-native-tab-view';

const initialLayout = { width: Dimensions.get('window').width };

export default ({ tabs, render }) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState(tabs.map((tab, i) => ({ key: i, title: tab })));

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={({ route }) => render(route.key)}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      swipeEnabled={false}
    />
  );
}
