import '@expo/browser-polyfill';

import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AsyncStorage } from 'react-native';
import { AppLoading, SplashScreen } from 'expo';

import AuthContext from './src/Auth/AuthContext';
import Root from './src';

export default function App() {
  const [isReady, setIsReady] = React.useState(false);
  const [user, setUser] = React.useState({ name: null, password: null });

  function login(newUser) {
    setUser(newUser);
  }

  React.useEffect(() => {
    AsyncStorage.getItem('name')
      .then(name => {
        console.log('name received:', name);
        setUser(user => ({ ...user, name }));
        setIsReady(true);
      })
      .catch(error => {
        console.error(error);
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

  if (!isReady) {
    return <AppLoading autoHideSplash={false} />;
  }

  return (
    <AuthContext.Provider
      value={{ name: user.name, password: user.password, login }}
    >
      <PaperProvider>
        <Root />
      </PaperProvider>
    </AuthContext.Provider>
  );
}
