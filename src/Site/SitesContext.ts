import React from 'react';
import { PasswordType } from '../Utils/mpw/templates';

export interface ISite {
  name: string;
  counter: string;
  type: PasswordType;
}

export interface ISitesContext {
  sites: ISite[];
  addSite: (site: ISite) => void | Promise<void>;
  updateSite: (prevSite: ISite, newSite: ISite) => void | Promise<void>;
  removeSite: (site: ISite) => void | Promise<void>;
}

const SitesContext = React.createContext<ISitesContext>({
  sites: [],
  addSite: () => Promise.reject('Not provided'),
  updateSite: () => Promise.reject('Not provided'),
  removeSite: () => Promise.reject('Not provided'),
});

export default SitesContext;

export function useSites(): ISitesContext {
  return React.useContext(SitesContext);
}
