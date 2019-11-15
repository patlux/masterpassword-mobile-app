import React from 'react';
import { PasswordType } from '../Utils/mpw/templates';

export interface ISite {
  name: string;
  counter: string;
  type: PasswordType;
}

export interface ISitesContext {
  sites: ISite[];
  addSite?: (site: ISite) => void;
  updateSite?: (prevSite: ISite, newSite: ISite) => void;
  removeSite?: (site: ISite) => void;
}

const SitesContext = React.createContext<ISitesContext>({
  sites: [],
});

export default SitesContext;

export function useSites(): ISitesContext {
  return React.useContext(SitesContext);
}
