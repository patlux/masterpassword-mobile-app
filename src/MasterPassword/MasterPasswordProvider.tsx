import React, { ReactNode } from 'react';

import { useAuth } from '../Auth/AuthContext';
import MasterPasswordContext from './MasterPasswordContext';
import MpwWebView from './MpwWebView/MpwWebView';

export interface Props {
  children: ReactNode;
}

function MasterPasswordProvider({ children }: Props) {
  const { name, password } = useAuth();
  const mpwWebViewRef = React.useRef<MpwWebView>();

  async function generatePassword(
    site: string,
    counter: number,
    template: string = 'long'
  ): Promise<string> {
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
