import React from 'react';
import { FlatList, ListRenderItemInfo, FlatListProps } from 'react-native';

import { ISite } from '../Site/SitesContext';
import SiteCard from './SiteCard';

export interface Props<T> extends Omit<FlatListProps<T>, 'data' | 'keyExtractor' | 'renderItem'> {
  sites: ISite[];
  onPressSite?: (site: ISite) => void;
}

function SiteList<T>({ sites, onPressSite, ...listProps }: Props<T>) {
  function onPressCard(site: ISite) {
    if (!onPressSite) {
      return;
    }
    onPressSite(site);
  }

  function renderItem({ item: site }: ListRenderItemInfo<ISite>) {
    return <SiteCard site={site} onPress={onPressCard} />;
  }

  return (
    <FlatList
      {...(listProps as any)} // FIXME
      keyExtractor={keyExtractorForSite}
      data={sites}
      renderItem={renderItem}
    />
  );
}

function keyExtractorForSite(site: ISite): string {
  return `site-${site.name}`;
}

export default SiteList;
