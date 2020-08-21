
import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Button } from 'react-native-paper';

const styles = StyleSheet.create({
  button: Platform.OS === "web" ? {
    cursor: "pointer"
  } : {},
});

export default props => (
  <Button style={styles.button} mode='contained' {...props}></Button>
);
