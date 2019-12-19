import React, { ReactNode } from 'react';

import { useAuth } from '../Auth/AuthContext';
import MasterPasswordContext from './MasterPasswordContext';
import MpwWebView from './MpwWebView/MpwWebView';

export interface Props {
  children: ReactNode;
}

function MasterPasswordProvider({ children }: Props) {
  const { name, password } = useAuth();
  const mpwWebViewRef = React.useRef<MpwWebView>(null);

  async function generatePassword(
    site: string,
    counter: number,
    template = 'long'
  ): Promise<string> {
    if (!mpwWebViewRef?.current) {
      return Promise.reject('no instance of MpwWebView found');
    }
    return await mpwWebViewRef.current.generatePassword(site, counter, template);
  }

  console.log('MasterPasswordProvider', 'render()', { name, password });

  return (
    <MasterPasswordContext.Provider value={{ generatePassword }}>
      <MpwWebView ref={mpwWebViewRef} name={name} password={password} />
      {children}
    </MasterPasswordContext.Provider>
  );
}

export default MasterPasswordProvider;
