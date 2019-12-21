import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Paragraph, FAB, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSafeArea } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

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

  function renderListFooter() {
    return (
      <View style={styles.footer}>
        <Text>v{Constants.manifest.version}</Text>
      </View>
    );
  }

  return (
    <>
      <SiteList
        sites={sites}
        onPressSite={props.onPressSite}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={styles.listContentContainer}
        ListFooterComponent={renderListFooter}
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
  listContentContainer: {},
  footer: {
    padding: 15,
    opacity: 0.5,
    alignItems: 'center',
  },
});

export default Home;
