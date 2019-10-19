import React, { ReactNode } from 'react';

import MPW from '../Utils/mpw/mpw';
import { useAuth } from '../Auth/AuthContext';
import MasterPasswordContext from './MasterPasswordContext';

export interface Props {
  children: ReactNode;
}

function MasterPasswordProvider({ children }: Props) {
  const mpwRef = React.useRef<MPW>();
  const { name, password } = useAuth();

  React.useEffect(() => {
    console.log('MasterPasswordProvider', 'useEffect() ...', {
      name,
      password,
    });
    if (name && password) {
      console.log('calculate with mpw ...');
      const start = new Date().getTime();
      mpwRef.current = new MPW(name, password);
      const end = new Date().getTime();
      console.log('calculation finished in:', end - start);
    }
  }, [name, password]);

  console.log('MasterPasswordProvider', 'render()', { name, password });

  return (
    <MasterPasswordContext.Provider value={{ mpwRef }}>
      {children}
    </MasterPasswordContext.Provider>
  );
}

export default MasterPasswordProvider;
