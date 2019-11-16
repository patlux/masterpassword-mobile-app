import React from 'react';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

import AuthContext from '../Auth/AuthContext';
import { useSites, ISite } from '../Site/SitesContext';
import Home from './Home';

const HomeScreen: NavigationStackScreenComponent = ({ navigation }) => {
  const { logout } = React.useContext(AuthContext);
  const { sites } = useSites();

  function onPressFab() {
    navigation.navigate('Site');
  }

  const onPressLogout = React.useCallback(() => {
    if (logout) {
      logout();
    }
    navigation.navigate('Auth');
  }, [logout]);

  React.useEffect(() => {
    navigation.setParams({ logout: onPressLogout });
  }, [logout]);

  function onPressSite(site: ISite) {
    navigation.navigate('Site', { site });
  }

  function onPressImportSites() {
    navigation.navigate('Import');
  }

  return (
    <Home
      sites={sites}
      onPressSite={onPressSite}
      onPressAddSite={onPressFab}
      onPressImportSites={onPressImportSites}
    />
  );
};

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

export default HomeScreen;
