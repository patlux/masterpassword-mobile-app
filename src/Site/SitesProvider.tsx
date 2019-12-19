import React, { ReactNode } from 'react';
import { AsyncStorage, Text, View } from 'react-native';

import SitesContext, { ISite } from './SitesContext';
import SitesReducer, { SitesInitialState } from './SitesReducer';

export interface Props {
  children: ReactNode;
}

function SitesProvider({ children }: Props) {
  const [state, dispatch] = React.useReducer(SitesReducer, SitesInitialState);

  React.useEffect(() => {
    if (Array.isArray(state.sites)) {
      AsyncStorage.setItem('sites', JSON.stringify(state.sites));
    }
  }, [state.sites]);

  React.useEffect(() => {
    dispatch({ type: 'LOADING_REQUEST' });
  }, []);

  React.useEffect(() => {
    async function fetchSites() {
      try {
        const sitesJson = await AsyncStorage.getItem('sites');
        const sites = sitesJson ? JSON.parse(sitesJson) : [];
        dispatch({ type: 'LOADING_SUCCESS', payload: sites });
      } catch (exception) {
        console.error("Error white loading 'sites' from storage:", exception);
        dispatch({ type: 'LOADING_FAILURE', error: exception });
      }
    }

    if (state.status === 'loading') {
      fetchSites();
    }
  }, [state.status]);

  function addSite(site: ISite) {
    dispatch({ type: 'SITE_ADD', site });
  }

  function updateSite(prevSite: ISite, newSite: ISite) {
    dispatch({ type: 'SITE_UPDATE', site: prevSite, newSite });
  }

  function removeSite(site: ISite) {
    dispatch({ type: 'SITE_REMOVE', site });
  }

  if (!Array.isArray(state.sites)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading sites...</Text>
      </View>
    );
  }

  return (
    <SitesContext.Provider value={{ sites: state.sites, addSite, updateSite, removeSite }}>
      {children}
    </SitesContext.Provider>
  );
}

export default SitesProvider;
