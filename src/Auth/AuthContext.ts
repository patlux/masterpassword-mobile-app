import React from 'react';

export interface IAuthUser {
  name: string;
  password: string;
}

export interface IAuthContext extends IAuthUser {
  login: (user: IAuthUser) => void;
  logout: () => void;
}

const AuthContext = React.createContext<IAuthContext>({
  name: null,
  password: null,
  login: (user: IAuthUser) => {},
  logout: () => {},
});

export const useAuth = (): IAuthUser => {
  return React.useContext(AuthContext);
};

export default AuthContext;
