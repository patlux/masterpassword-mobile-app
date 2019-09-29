import '@expo/browser-polyfill';

import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AsyncStorage } from 'react-native';
import { AppLoading, SplashScreen } from 'expo';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MPW from './src/Utils/mpw/mpw';
import AuthContext from './src/Auth/AuthContext';
import { getPersistenceFunctions } from './src/Utils/Navigation';
import Root from './src';

export default function App() {
  const [isReady, setIsReady] = React.useState(false);
  const [user, setUser] = React.useState({ name: null, password: null });
  const mpwRef = React.useRef<MPW>();

  function login(newUser) {
    setUser(newUser);
  }

  React.useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('name'),
      SecureStore.getItemAsync('password'),
    ])
      .then(([name, password]) => {
        setUser(user => ({ ...user, name, password }));
      })
      .catch(error => {
        console.error(
          "Error white loading 'name'/'password' from storage:",
          error,
        );
        setIsReady(true);
      });
  }, []);

  React.useEffect(() => {
    if (user.name) {
      AsyncStorage.setItem('name', user.name);
    } else {
      AsyncStorage.removeItem('name');
    }
  }, [user && user.name]);

  React.useEffect(() => {
    if (isReady) {
      SplashScreen.hide();
    }
  }, [isReady]);

  React.useEffect(() => {
    if (user.name && user.password) {
      mpwRef.current = new MPW(user.name, user.password);
      setIsReady(true);
    }
  }, [user]);

  if (!isReady) {
    return <AppLoading autoHideSplash={false} />;
  }

  return (
    <AuthContext.Provider
      value={{ name: user.name, password: user.password, login, mpwRef }}
    >
      <PaperProvider>
        <SafeAreaProvider>
          <Root {...getPersistenceFunctions()} />
        </SafeAreaProvider>
      </PaperProvider>
    </AuthContext.Provider>
  );
}
