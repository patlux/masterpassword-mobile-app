import React from 'react';

import MPW from '../Utils/mpw/mpw';

export interface IMasterPasswordContext {
  mpwRef: React.MutableRefObject<MPW>;
}

const MasterPasswordContext = React.createContext<IMasterPasswordContext>({
  mpwRef: null,
});

export const useMPW = (): IMasterPasswordContext => {
  return React.useContext(MasterPasswordContext);
};

export default MasterPasswordContext;
