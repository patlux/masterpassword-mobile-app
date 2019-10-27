import React from 'react';

import { getPersistenceFunctions } from './Utils/Navigation';
import { useAuth } from './Auth/AuthContext';
import AuthenticatedApp from './AuthenticatedApp';
import LoginScreen from './Auth/Login';

function Index(props) {
  const { name, password } = useAuth();
  return name && password ? (
    <AuthenticatedApp {...getPersistenceFunctions()} {...props} />
  ) : (
    <LoginScreen {...props} />
  );
}

export default Index;
