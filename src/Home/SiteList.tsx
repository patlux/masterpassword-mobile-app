import React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

import { useSites, ISite } from '../Site/SitesContext';
import SiteCard from './SiteCard';

export interface Props {
  onPressSite?: (site: ISite) => void;
}

function SiteList({ onPressSite }: Props) {
  const { sites } = useSites();

  function onPressCard(site: ISite) {
    if (!onPressSite) {
      return;
    }
    onPressSite(site);
  }

  function renderItem({ item: site }: ListRenderItemInfo<ISite>) {
    return <SiteCard site={site} onPress={onPressCard} />;
  }

  return <FlatList keyExtractor={keyExtractorForSite} data={sites} renderItem={renderItem} />;
}

function keyExtractorForSite(site: ISite): string {
  return `site-${site.name}`;
}

export default SiteList;
