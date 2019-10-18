import React, { ReactNode } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import SitesProvider from './Site/SitesProvider';
import AuthProvider from './Auth/AuthProvider';
import Theme from './Theme';

export interface Props {
  children: ReactNode;
}

function AppProviders({ children }: Props) {
  return (
    <AuthProvider>
      <SitesProvider>
        <PaperProvider theme={Theme}>
          <SafeAreaProvider>{children}</SafeAreaProvider>
        </PaperProvider>
      </SitesProvider>
    </AuthProvider>
  );
}

export default AppProviders;
