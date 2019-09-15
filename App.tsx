import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import Root from './src';

export default function App() {
  return (
    <PaperProvider>
      <Root />
    </PaperProvider>
  );
}
