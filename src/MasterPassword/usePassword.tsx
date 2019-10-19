import React from 'react';

import { useMPW } from './MasterPasswordContext';

export interface IUsePassword {
  name: string;
  counter: number | string;
  type: string;
}

export const usePassword = (
  { name, counter, type }: IUsePassword,
  generate: boolean = true,
): string => {
  const { mpwRef } = useMPW();
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
        +counter,
        '', // context
        type,
      )
      .then(password => setPassword(password));
  }, [name, counter, type, generate]);

  return password;
};

export default usePassword;
