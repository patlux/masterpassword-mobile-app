import React from 'react';

import { getPersistenceFunctions } from './Utils/Navigation';
import { useAuth } from './Auth/AuthContext';
import AuthenticatedApp from './AuthenticatedApp';
import LoginScreen from './Auth/Login';

function Index() {
  const { name, password } = useAuth();
  return name && password ? (
    <AuthenticatedApp {...getPersistenceFunctions()} />
  ) : (
    <LoginScreen />
  );
}

export default Index;
