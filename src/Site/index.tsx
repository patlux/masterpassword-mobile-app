import React from 'react';
import { View, StyleSheet, Clipboard, Alert } from 'react-native';
import {
  TextInput,
  Portal,
  withTheme,
  Theme,
  Button,
} from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSafeArea } from 'react-native-safe-area-context';
import {
  HeaderButtons,
  HeaderButton,
  Item,
  HeaderButtonProps,
} from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

import { useMPWPassword } from '../Auth/AuthContext';
import ScreenHeader from '../components/ScreenHeader';
import DialogPasswordType from '../components/DialogPasswordType';
import { NavigationInjectedProps } from 'react-navigation';
import { useSites, ISite } from './SitesContext';
import PasswordText from '../components/PasswordText';

const isValidNumber = (numStr: any): boolean => {
  return !isNaN(numStr);
};

export interface Props {
  theme: Theme;
}

function SiteScreen({ theme, navigation }: Props & NavigationInjectedProps) {
  const { sites, addSite, updateSite, removeSite } = useSites();
  const insets = useSafeArea();
  const [visibleDialog, setVisibleDialog] = React.useState(null);
  const [formValues, setFormValues] = React.useState<ISite>(
    navigation.getParam('site') || {
      name: '',
      counter: '1',
      type: 'maximum',
    },
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
    return sites.some(itemSite => itemSite.name === site.name);
  }, [sites, navigation.getParam('site')]);

  React.useEffect(() => {
    navigation.setParams({ exists });
  }, [exists]);

  function toggleDialog(dialogType: string) {
    return () => {
      if (visibleDialog === dialogType) {
        hideDialog();
      } else {
        setVisibleDialog(dialogType);
      }
    };
  }

  function hideDialog() {
    setVisibleDialog(null);
  }

  function setPasswordType(passwordType) {
    setFormValues({ ...formValues, type: passwordType });
    hideDialog();
  }

  function decreaseCounter() {
    setFormValues(formValues => {
      if (formValues.counter === '1') {
        return formValues;
      }
      const nextNumber = isValidNumber(formValues.counter)
        ? parseInt(formValues.counter, 10) - 1
        : '';
      return { ...formValues, counter: '' + nextNumber };
    });
  }
  function increaseCounter() {
    setFormValues(formValues => {
      const nextNumber = isValidNumber(formValues.counter)
        ? parseInt(formValues.counter, 10) + 1
        : '';
      return { ...formValues, counter: '' + nextNumber };
    });
  }

  const submit = React.useCallback(() => {
    if (formValues.name.trim().length === 0) {
      Alert.alert('Missing name', 'Please enter a name');
      return;
    }

    if (exists) {
      updateSite(navigation.getParam('site'), formValues);
    } else {
      addSite(formValues);
    }
    navigation.navigate('Home');
  }, [addSite, formValues]);

  React.useEffect(() => {
    navigation.setParams({ submit });
  }, [submit]);

  const deleteSite = React.useCallback(() => {
    if (exists) {
      removeSite(formValues);
    }
    navigation.navigate('Home');
  }, [removeSite, formValues]);

  React.useEffect(() => {
    navigation.setParams({ delete: deleteSite });
  }, [deleteSite]);

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader>{exists ? 'Edit' : 'Add'} site</ScreenHeader>
      <View style={{ flex: 1, paddingHorizontal: 15 }}>
        <TextInput
          mode="flat"
          label="Name"
          value={formValues.name}
          onChangeText={name => setFormValues({ ...formValues, name })}
          style={{ marginBottom: 10 }}
          autoFocus={true}
          autoCompleteType="off"
          autoCorrect={false}
          autoCapitalize="none"
          numberOfLines={1}
          multiline={false}
        />
        <TouchableOpacity onPress={toggleDialog('type')}>
          <TextInput
            mode="flat"
            label="Type"
            value={formValues.type}
            style={{ marginBottom: 10 }}
            autoFocus={false}
            multiline={false}
            disabled={true}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            onPress={decreaseCounter}
            disabled={formValues.counter === '1'}
            mode="contained"
            style={{ marginRight: 10 }}
          >
            -
          </Button>
          <TextInput
            mode="flat"
            label="Counter"
            value={'' + formValues.counter}
            onChangeText={counter =>
              setFormValues({ ...formValues, counter: counter })
            }
            style={{ marginBottom: 10, flex: 1 }}
            autoFocus={false}
            selectTextOnFocus={true}
            multiline={false}
            keyboardType="number-pad"
          />
          <Button
            onPress={increaseCounter}
            mode="contained"
            style={{ marginLeft: 10 }}
          >
            +
          </Button>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.passwordContainer,
          {
            backgroundColor: password
              ? theme.colors.accent
              : theme.colors.disabled,
          },
        ]}
        onPress={() => {
          if (!password) {
            return;
          }
          Clipboard.setString(password);
        }}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'nowrap' }}>
          <PasswordText
            style={[
              styles.passwordText,
              {
                paddingBottom: insets.bottom,
                color: theme.colors.text,
                opacity: password ? 1 : 0.5,
              },
            ]}
          >
            {password || 'Enter a name'}
          </PasswordText>
        </View>
      </TouchableOpacity>

      <Portal>
        <DialogPasswordType
          visible={visibleDialog === 'type'}
          onDismiss={hideDialog}
          onDone={setPasswordType}
        />
      </Portal>
    </View>
  );
}

const IoniconsHeaderButton = (headerButtonProps: HeaderButtonProps) => (
  <HeaderButton IconComponent={Ionicons} iconSize={23} {...headerButtonProps} />
);

SiteScreen.navigationOptions = ({ navigation }) => {
  return {
    title: 'Add site',
    headerRight: (
      <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
        <Item
          title="Delete"
          iconName={navigation.getParam('site') ? 'md-trash' : 'md-close'}
          onPress={navigation.getParam('delete')}
        />
        <Item
          title="Save"
          iconName="md-checkmark"
          onPress={navigation.getParam('submit')}
        />
      </HeaderButtons>
    ),
  };
};

const SiteScreenExtended = withTheme(SiteScreen);

export default SiteScreenExtended;

const styles = StyleSheet.create({
  container: {},
  passwordContainer: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordText: {
    fontSize: 24,
  },
});
