import React from 'react';

import MPW from '../Utils/mpw/mpw';

export interface IAuthUser {
  name: string;
  password: string;
}

export interface IAuthContext extends IAuthUser {
  login: (user: IAuthUser) => void;
  logout: () => void;
  mpwRef: MPW;
}

const AuthContext = React.createContext<IAuthContext>({
  name: null,
  password: null,
  login: (user: IAuthUser) => {},
  logout: () => {},
  mpwRef: null,
});

export const useAuth = (): IAuthUser => {
  const { name, password } = React.useContext(AuthContext);
  return { name, password };
};

export const useMPW = (): MPW => {
  const { mpwRef } = React.useContext(AuthContext);
  return mpwRef;
};

export interface IUseMPWPassword {
  name: string;
  counter: number | string;
  type: string;
}

export const useMPWPassword = (
  { name, counter, type }: IUseMPWPassword,
  generate: boolean = true,
): string => {
  const mpwRef = useMPW();
  const [password, setPassword] = React.useState<string>(null);

  React.useEffect(() => {
    if (!generate) {
      return;
    }
    if (!mpwRef.current) {
      console.warn('mpwRef.current is not defined');
    }
    if (!name || name.trim().length === 0) {
      setPassword('');
      return;
    }
    mpwRef.current
      .generateAuthentication(
        name,
        counter,
        '', // context
        type,
      )
      .then(password => setPassword(password));
  }, [name, counter, type, generate]);

  return password;
};

export default AuthContext;
