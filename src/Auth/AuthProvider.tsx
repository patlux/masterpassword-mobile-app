import React, { ReactNode } from 'react';
import { AppLoading, SplashScreen } from 'expo';
import * as SecureStore from 'expo-secure-store';

import MPW from '../Utils/mpw/mpw';
import AuthContext, { IAuthUser } from './AuthContext';

export interface Props {
  children: ReactNode;
}

function AuthProvider({ children }: Props) {
  const [isReady, setIsReady] = React.useState(false);
  React.useEffect(() => {
    if (isReady) {
      SplashScreen.hide();
    }
  }, [isReady]);

  const [user, setUser] = React.useState<IAuthUser>(null);

  const mpwRef = React.useRef<MPW>();
  React.useEffect(() => {
    console.log('user changed:', user);
    if (user && user.name && user.password) {
      mpwRef.current = new MPW(user.name, user.password);
      setIsReady(true);
    } else {
      // TODO: show error?
      setIsReady(true);
    }
  }, [user]);

  React.useEffect(() => {
    Promise.all([
      SecureStore.getItemAsync('name'),
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

  console.log('AuthProvider', 'render()', { isReady, user });

  if (!isReady) {
    return <AppLoading autoHideSplash={false} />;
  }

  function login(newUser) {
    setUser(newUser);
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        name: user && user.name,
        password: user && user.password,
        login,
        logout,
        mpwRef,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
