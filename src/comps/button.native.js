
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const styles = StyleSheet.create({ button: {} });

export default props => (
  <Button style={styles.button} mode='contained' {...props}></Button>
);
