import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Paragraph, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSafeArea } from 'react-native-safe-area-context';

import SiteList from './SiteList';
import { ISite, useSites } from '../Site/SitesContext';

export interface Props {
  sites: ISite[];
  onPressSite?: (site: ISite) => void;
  onPressAddSite?: () => void;
  onPressImportSites?: () => void;
}

function Home(props: Props): JSX.Element {
  const insets = useSafeArea();
  const { sites } = useSites();

  const renderEmptyList = () => {
    return (
      <View style={styles.emptyContainer}>
        <Paragraph>{"It seems you didn't added sites yet."}</Paragraph>
        {props.onPressImportSites && (
          <Button onPress={props.onPressImportSites} mode="outlined" style={styles.emptyButton}>
            Import sites from file
          </Button>
        )}
      </View>
    );
  };

  return (
    <>
      <SiteList
        sites={sites}
        onPressSite={props.onPressSite}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={styles.listContentContainer}
      />
      {props.onPressAddSite && (
        <FAB
          style={[styles.fab, { bottom: insets.bottom }]}
          icon={({ size, color }) => (
            <Ionicons size={size} color={color} name="md-add" style={{ alignSelf: 'center' }} />
          )}
          onPress={props.onPressAddSite}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyButton: { marginTop: 15 },
  listContentContainer: { flex: 1 },
});

export default Home;
