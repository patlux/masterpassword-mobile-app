import React from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

import AppProviders from './src/AppProviders';
import Root from './src';

export default function App() {
  console.log('App', 'render()');
  return (
    <AppProviders>
      <View style={styles.statusBar} />
      <StatusBar barStyle="light-content" />
      <Root />
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: Constants.manifest.primaryColor,
    height: Constants.statusBarHeight,
  },
});
