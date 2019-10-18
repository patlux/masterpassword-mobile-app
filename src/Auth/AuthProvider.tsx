import React, { ReactNode } from 'react';
import { AppLoading } from 'expo';
import * as SecureStore from 'expo-secure-store';

import MPW from '../Utils/mpw/mpw';
import AuthContext, { IAuthUser } from './AuthContext';

export interface Props {
  children: ReactNode;
}

function AuthProvider({ children }: Props) {
  const [isReady, setIsReady] = React.useState(false);
  const [user, setUser] = React.useState<IAuthUser>(null);

  const mpwRef = React.useRef<MPW>();
  React.useEffect(() => {
    console.log('user changed:', user);
    if (user && user.name && user.password) {
      console.log('calculate with mpw ...');
      const start = new Date().getTime();
      mpwRef.current = new MPW(user.name, user.password);
      const end = new Date().getTime();
      console.log('calculation finished in:', end - start);
    }
  }, [user]);

  React.useEffect(() => {
    Promise.all([
      SecureStore.getItemAsync('name'),
      SecureStore.getItemAsync('password'),
    ])
      .then(([name, password]) => {
        setUser(user => ({ ...user, name, password }));
        setIsReady(true);
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
    return <AppLoading autoHideSplash={true} />;
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
