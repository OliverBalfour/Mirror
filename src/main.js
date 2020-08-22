
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Button from './comps/button';
import TabView from './comps/tabview';

const Application = () => (
  <PaperProvider>
    {/*<View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <Button>Press</Button>
    </View>*/}
    <TabView
      tabs={["one", "two"]}
      render={i => (
        <View style={{ backgroundColor: ['#ff4081', '#673ab7'][i], flex: 1 }}>
          <Text>{i}</Text>
        </View>
      )}
    />
  </PaperProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Application;
