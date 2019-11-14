import React, { ReactNode } from 'react';
import { AsyncStorage } from 'react-native';

import SitesContext, { ISite } from './SitesContext';
import { updateItem, removeItem } from '../Utils';

export interface Props {
  children: ReactNode;
}

function SitesProvider({ children }: Props) {
  const [sites, setSites] = React.useState<ISite[]>([]);
  React.useEffect(() => {
    if (Array.isArray(sites) && sites.length > 0) {
      AsyncStorage.setItem('sites', JSON.stringify(sites));
    }
  }, [sites]);

  React.useEffect(() => {
    async function fetchSites() {
      try {
        const sitesJson = await AsyncStorage.getItem('sites');
        if (sitesJson) {
          setSites(JSON.parse(sitesJson));
        }
      } catch (exception) {
        console.error("Error white loading 'sites' from storage:", exception);
      }
    }

    fetchSites();
  }, []);

  function addSite(site: ISite) {
    console.log('addSite', site);
    setSites(prevSites => {
      const index = prevSites.findIndex(itemSite => itemSite.name === site.name);

      if (index === -1) {
        return Array.isArray(prevSites) ? [...prevSites, site] : [site];
      }

      return updateItem(prevSites, index, site);
    });
  }

  function updateSite(prevSite: ISite, newSite: ISite) {
    console.log('updateSite', { prevSite, newSite });
    setSites(prevSites => {
      const prevSiteIndex = prevSites.findIndex(itemSite => itemSite.name === prevSite.name);

      if (prevSiteIndex === -1) {
        return prevSites;
      }

      return updateItem(prevSites, prevSiteIndex, newSite);
    });
  }

  function removeSite(site: ISite) {
    console.log('removeSite', site);
    setSites(prevSites => {
      if (!Array.isArray(prevSites)) {
        return prevSites;
      }
      const indexToRemove = prevSites.findIndex(itemSite => itemSite.name === site.name);
      if (indexToRemove === -1) {
        return prevSites;
      }
      return removeItem(prevSites, indexToRemove);
    });
  }

  return (
    <SitesContext.Provider value={{ sites, addSite, updateSite, removeSite }}>
      {children}
    </SitesContext.Provider>
  );
}

export default SitesProvider;
