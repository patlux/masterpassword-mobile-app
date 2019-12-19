import React, { ReactNode } from 'react';
import { AppLoading } from 'expo';
import * as SecureStore from 'expo-secure-store';

import AuthContext, { IAuthUser } from './AuthContext';

export interface Props {
  children: ReactNode;
}

function AuthProvider({ children }: Props) {
  const [isReady, setIsReady] = React.useState(false);
  const [user, setUser] = React.useState<IAuthUser>();

  React.useEffect(() => {
    console.log('AuthProvider', 'Loading name, password ...');
    Promise.all([SecureStore.getItemAsync('name'), SecureStore.getItemAsync('password')])
      .then(([name, password]) => {
        if (name && password) {
          setUser(user => ({ ...user, name, password }));
        }
        setIsReady(true);
      })
      .catch(error => {
        console.error("Error white loading 'name'/'password' from storage:", error);
        setIsReady(true);
      });
  }, []);

  console.log('AuthProvider', 'render()', { isReady, user });

  if (!isReady) {
    return <AppLoading autoHideSplash={true} />;
  }

  function login(newUser: IAuthUser) {
    setUser(newUser);
  }

  function logout() {
    setUser(undefined);
  }

  return (
    <AuthContext.Provider
      value={{
        name: user?.name,
        password: user?.password,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
