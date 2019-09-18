import React from 'react';

const AuthContext = React.createContext({
  name: null,
  password: null,
  login: ({ name, password }) => {},
});

export default AuthContext;
