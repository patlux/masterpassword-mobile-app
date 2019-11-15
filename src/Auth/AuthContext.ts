import React from 'react';

export interface IAuthUser {
  name?: string;
  password?: string;
}

export interface IAuthContext extends IAuthUser {
  login?: (user: IAuthUser) => void;
  logout?: () => void;
}

const AuthContext = React.createContext<IAuthContext>({});

export const useAuth = (): IAuthContext => {
  return React.useContext(AuthContext);
};

export default AuthContext;
