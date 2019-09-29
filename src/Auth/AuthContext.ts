import React from 'react';

import MPW from '../Utils/mpw/mpw';

export interface IAuthUser {
  name: string;
  password: string;
}

export interface IAuthContext extends IAuthUser {
  login: (user: IAuthUser) => void;
  mpwRef: MPW;
}

const AuthContext = React.createContext<IAuthContext>({
  name: null,
  password: null,
  login: (user: IAuthUser) => {},
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
  counter: number;
  type: string;
}

export const useMPWPassword = ({
  name,
  counter,
  type,
}: IUseMPWPassword): string => {
  console.log('useMPWPassword()', { name, counter, type });

  const mpwRef = useMPW();
  const [password, setPassword] = React.useState<string>(null);

  React.useEffect(() => {
    if (!mpwRef.current) {
      console.warn('mpwRef is not defined');
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
  }, [name, counter, type]);

  return password;
};

export default AuthContext;
