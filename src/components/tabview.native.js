
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
import { TabView, TabBar } from 'react-native-tab-view';

const initialLayout = { width: Dimensions.get('window').width };

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: '#3f51b5' }}
    style={{ backgroundColor: 'white' }}
    activeColor="#3f51b5"
    inactiveColor="#777"
  />
);

export default ({ tabs, render, index, setIndex }) => {
  const [routes] = React.useState(tabs.map((tab, i) => ({ key: i, title: tab })));

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={({ route }) => render(route.key)}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      swipeEnabled={false}
      renderTabBar={renderTabBar}
    />
  );
}
