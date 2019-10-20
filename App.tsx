import '@expo/browser-polyfill';
import React from 'react';
import { StatusBar } from 'react-native';

import AppProviders from './src/AppProviders';
import Root from './src';

export default function App() {
  console.log('App', 'render()');
  return (
    <AppProviders>
      <StatusBar barStyle="dark-content" />
      <Root />
    </AppProviders>
  );
}
