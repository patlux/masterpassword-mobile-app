import React from 'react';

import { getPersistenceFunctions } from './Utils/Navigation';
import { useAuth } from './Auth/AuthContext';
import AuthenticatedApp from './AuthenticatedApp';
import LoginScreen from './Auth/Login';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Index(props: any) {
  const { name, password } = useAuth();
  return name && password ? (
    <AuthenticatedApp {...getPersistenceFunctions()} {...props} />
  ) : (
    <LoginScreen {...props} />
  );
}

export default Index;
