import React from 'react';
import { FlatList } from 'react-native';

import { useSites, ISite } from '../Site/SitesContext';
import SiteCard from './SiteCard';

export interface Props {
  onPressSite?: (site: ISite) => void;
}

function SiteList({ onPressSite }: Props) {
  const { sites } = useSites();

  function onPressCard(site: ISite) {
    if (onPressSite) {
      onPressSite(site);
    }
  }

  return (
    <FlatList
      keyExtractor={site => site.name}
      data={sites}
      renderItem={({ item: site }) => (
        <SiteCard site={site} onPress={() => onPressCard(site)} />
      )}
    />
  );
}

export default SiteList;
