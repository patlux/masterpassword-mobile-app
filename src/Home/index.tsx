import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { Button, Paragraph, FAB } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import AuthContext from '../Auth/AuthContext';
import { useSites, ISite } from '../Site/SitesContext';
import SiteList from './SiteList';

function HomeScreen({ navigation }: NavigationInjectedProps) {
  const { logout } = React.useContext(AuthContext);
  const { sites } = useSites();
  const insets = useSafeArea();

  function onPressFab() {
    navigation.navigate('Site');
  }

  const onPressLogout = React.useCallback(() => {
    logout();
    navigation.navigate('Auth');
  }, [logout]);

  React.useEffect(() => {
    navigation.setParams({ logout: onPressLogout });
  }, [logout]);

  function onPressSite(site: ISite) {
    navigation.navigate('Site', { site });
  }

  return (
    <>
      {Array.isArray(sites) && sites.length > 0 ? (
        <SiteList onPressSite={onPressSite} />
      ) : (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Paragraph>It seems you didn't added sites yet.</Paragraph>
          <Button
            onPress={() => navigation.navigate('Import')}
            mode="outlined"
            style={{ marginTop: 15 }}
          >
            Import sites from file
          </Button>
        </View>
      )}
      <FAB
        style={[styles.fab, { bottom: insets.bottom }]}
        icon={({ size, color }) => (
          <Ionicons size={size} color={color} name="md-add" style={{ alignSelf: 'center' }} />
        )}
        onPress={onPressFab}
      />
    </>
  );
}

HomeScreen.navigationOptions = ({ navigation }) => {
  return {
    title: 'Sites',
    headerRight: (
      <Button onPress={navigation.getParam('logout')}>
        <Ionicons name="md-exit" size={24} />
      </Button>
    ),
  };
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
