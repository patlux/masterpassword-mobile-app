import React from 'react';

export interface ISite {
  name: string;
  counter: string;
  type: string;
}

export interface ISitesContext {
  sites: ISite[];
  addSite: (site: ISite) => void;
  updateSite: (prevSite: ISite, newSite: ISite) => void;
  removeSite: (site: ISite) => void;
}

const SitesContext = React.createContext<ISitesContext>({
  sites: [],
  addSite: null,
  updateSite: null,
  removeSite: null,
});

export default SitesContext;

export function useSites() {
  return React.useContext(SitesContext);
}
