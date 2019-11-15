import React from 'react';

import { useMPW } from './MasterPasswordContext';

export interface IUsePassword {
  name: string;
  counter: number | string;
  type: string;
}

export const usePassword = (
  { name, counter, type }: IUsePassword,
  generate: boolean = true
): undefined | string => {
  const { generatePassword } = useMPW();
  const [password, setPassword] = React.useState<undefined | string>();

  React.useEffect(() => {
    if (!generate) {
      return;
    }
    if (!name || name.trim().length === 0) {
      setPassword(undefined);
      return;
    }
    generatePassword(name, +counter, type).then(password => setPassword(password));
  }, [name, counter, type, generate]);

  return password;
};

export default usePassword;
