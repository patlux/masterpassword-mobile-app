import React from 'react';

export interface IAuthUser {
  name?: string;
  password?: string;
}

export interface IAuthContext extends IAuthUser {
  login: (user: IAuthUser) => void | Promise<void>;
  logout: () => void | Promise<void>;
}

const AuthContext = React.createContext<IAuthContext>({
  login: () => Promise.reject('Not provided'),
  logout: () => Promise.reject('Not provided'),
});

export const useAuth = (): IAuthContext => {
  return React.useContext(AuthContext);
};

export default AuthContext;
