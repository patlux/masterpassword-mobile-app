import React from 'react';
import { Alert } from 'react-native';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import {
  HeaderButtons,
  HeaderButton,
  Item,
  HeaderButtonProps,
} from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

import useMPWPassword from '../MasterPassword/usePassword';
import { useSites, ISite } from './SitesContext';
import Site from './Site';

export interface NavParams {
  site?: ISite;
  exists?: boolean; // TODO: necessary?
  submit?: () => void;
  delete?: () => void;
}

const SiteScreen: NavigationStackScreenComponent<NavParams> = ({ navigation }) => {
  const { sites, addSite, updateSite, removeSite } = useSites();
  const [formValues, setFormValues] = React.useState<ISite>(
    navigation.getParam('site') || {
      name: '',
      counter: '1',
      type: 'maximum',
    }
  );

  const password = useMPWPassword({
    name: formValues.name,
    counter: +formValues.counter,
    type: formValues.type,
  });

  const exists = React.useMemo(() => {
    const site = navigation.getParam('site');
    if (!site) {
      return false;
    }
    return sites.some((itemSite: ISite) => itemSite.name === site.name);
  }, [sites, navigation.getParam('site')]);

  React.useEffect(() => {
    navigation.setParams({ exists });
  }, [exists]);

  const submit = React.useCallback(() => {
    if (formValues.name.trim().length === 0) {
      Alert.alert('Missing name', 'Please enter a name');
      return;
    }

    if (updateSite && exists) {
      const site = navigation.getParam('site');
      if (site) {
        updateSite(site, formValues);
      }
    } else if (addSite) {
      addSite(formValues);
    }
    navigation.navigate('Home');
  }, [addSite, formValues]);

  React.useEffect(() => {
    navigation.setParams({ submit });
  }, [submit]);

  const deleteSite = React.useCallback(() => {
    if (removeSite && exists) {
      removeSite(formValues);
    }
    navigation.navigate('Home');
  }, [removeSite, formValues]);

  React.useEffect(() => {
    navigation.setParams({ delete: deleteSite });
  }, [deleteSite]);

  return <Site site={formValues} onChange={setFormValues} isNew={!exists} password={password} />;
};

const IoniconsHeaderButton = (headerButtonProps: HeaderButtonProps) => (
  <HeaderButton IconComponent={Ionicons} iconSize={23} {...headerButtonProps} />
);

SiteScreen.navigationOptions = ({ navigation }) => {
  const site = navigation.getParam('site');
  return {
    title: site ? site.name : 'Add site',
    headerRight: (
      <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
        <Item
          title="Delete"
          iconName={navigation.getParam('site') ? 'md-trash' : 'md-close'}
          onPress={navigation.getParam('delete')}
        />
        <Item title="Save" iconName="md-checkmark" onPress={navigation.getParam('submit')} />
      </HeaderButtons>
    ),
  };
};

export default SiteScreen;
