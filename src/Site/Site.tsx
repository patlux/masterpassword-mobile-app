import React from 'react';
import { View, StyleSheet, Clipboard } from 'react-native';
import { TextInput, Portal, Button, useTheme } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSafeArea } from 'react-native-safe-area-context';

import ScreenHeader from '../components/ScreenHeader';
import DialogPasswordType from '../components/DialogPasswordType';
import { ISite } from './SitesContext';
import PasswordText from '../components/PasswordText';
import { PasswordType } from '../Utils/mpw/templates';

export interface Props {
  site: ISite;
  onChange: (newSite: ISite) => void;
  isNew?: boolean;
  password?: string;
}

type DialogOpenType = undefined | null | 'type';

function Site({ site, onChange, isNew, password }: Props) {
  const insets = useSafeArea();
  const [visibleDialog, setVisibleDialog] = React.useState<DialogOpenType>();

  function toggleDialog(dialogType: DialogOpenType) {
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

  function setPasswordType(passwordType: PasswordType) {
    onChange({ ...site, type: passwordType });
    hideDialog();
  }

  function decreaseCounter() {
    if (site.counter === '1') {
      return;
    }
    const nextNumber = isValidNumber(site.counter) ? parseInt(site.counter, 10) - 1 : '';
    onChange({ ...site, counter: '' + nextNumber });
  }
  function increaseCounter() {
    const nextNumber = isValidNumber(site.counter) ? parseInt(site.counter, 10) + 1 : '';
    onChange({ ...site, counter: '' + nextNumber });
  }

  const theme = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader>{isNew ? 'Add' : 'Edit'} site</ScreenHeader>
      <View style={{ flex: 1, paddingHorizontal: 15 }}>
        <TextInput
          mode="flat"
          label="Name"
          value={site.name}
          onChangeText={name => onChange({ ...site, name })}
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
            value={site.type}
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
            disabled={site.counter === '1'}
            mode="contained"
            style={{ marginRight: 10 }}
          >
            -
          </Button>
          <TextInput
            mode="flat"
            label="Counter"
            value={'' + site.counter}
            onChangeText={counter => onChange({ ...site, counter: counter })}
            style={{ marginBottom: 10, flex: 1 }}
            autoFocus={false}
            selectTextOnFocus={true}
            multiline={false}
            keyboardType="number-pad"
          />
          <Button onPress={increaseCounter} mode="contained" style={{ marginLeft: 10 }}>
            +
          </Button>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.passwordContainer,
          {
            backgroundColor: password ? theme.colors.accent : theme.colors.disabled,
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

export default Site;

const styles = StyleSheet.create({
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidNumber(numStr: any): boolean {
  return !isNaN(numStr);
}
