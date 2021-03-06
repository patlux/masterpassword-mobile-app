import React from 'react';

export interface IMasterPasswordContext {
  generatePassword: (site: string, counter: number, template: string) => Promise<string>;
}

const MasterPasswordContext = React.createContext<IMasterPasswordContext>({
  generatePassword: () => Promise.reject('Not provided'),
});

export const useMPW = (): IMasterPasswordContext => {
  return React.useContext(MasterPasswordContext);
};

export default MasterPasswordContext;
