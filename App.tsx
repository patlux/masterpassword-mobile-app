import '@expo/browser-polyfill';
import React from 'react';

import AppProviders from './src/AppProviders';
import Root from './src';

export default function App() {
  console.log('App', 'render()');
  return (
    <AppProviders>
      <Root />
    </AppProviders>
  );
}
