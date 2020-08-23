
/**
 * MenuBar component
 *
 * <MenuBar active={0} setActive={...} />
 *  (active is index of current screen)
 *
 */

import * as React from 'react';
import { Appbar, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';
const Action = Appbar.Action;

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0
  },
  label: {
    color: 'white',
    fontSize: 16
  }
});

export default ({ active, setActive }) => (
  <Appbar style={styles.bottom}>
    <Action onPress={() => console.log("open menu")}   icon='menu' />

    <Action onPress={() => setActive(0)} icon='developer-board' />
    <Text   onPress={() => setActive(0)} style={styles.label}>Board</Text>

    <Action onPress={() => setActive(1)} icon='text' />
    <Text   onPress={() => setActive(1)} style={styles.label}>Notes</Text>
  </Appbar>
);
