import React from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  View,
  Clipboard,
  Alert,
  ToastAndroid,
  Platform,
} from 'react-native';
import { Card } from 'react-native-paper';

import { ISite } from '../Site/SitesContext';
import useMPWPassword from '../MasterPassword/usePassword';
import PasswordText from '../components/PasswordText';
import { Ionicons } from '@expo/vector-icons';

export interface Props {
  site: ISite;
  onPress: (site: ISite) => void;
}

type CardProps = React.ComponentProps<typeof Card>;

function SiteCard({
  site,
  onPress,
  style,
  ...cardProps
}: Props & Omit<CardProps, 'children' | 'onPress'>) {
  const [showPassword, setShowPassword] = React.useState(false);
  const password = useMPWPassword(site, showPassword);

  function togglePasswordVisibility() {
    setShowPassword(prevState => !prevState);
  }

  const showPasswordCopiedInfo = Platform.select({
    android: () => ToastAndroid.show('Password copied', ToastAndroid.SHORT),
    ios: () => Alert.alert('Password copied'),
  });

  React.useEffect(() => {
    if (password && showPassword) {
      Clipboard.setString(password);
      showPasswordCopiedInfo();
    }
  }, [password, showPassword]);

  function onPressWithSite() {
    if (!onPress) {
      return;
    }
    onPress(site);
  }

  return (
    <Card {...cardProps} onPress={onPressWithSite} style={[styles.container, style]}>
      <Card.Title title={site.name} />
      <Card.Content>
        <TouchableHighlight onPress={togglePasswordVisibility}>
          <View style={styles.password}>
            <PasswordText style={styles.passwordText}>
              {password && showPassword ? password : '********'}
            </PasswordText>
            <Ionicons size={18} color="#000" name="md-copy" style={{ alignSelf: 'center' }} />
          </View>
        </TouchableHighlight>
      </Card.Content>
    </Card>
  );
}

export default SiteCard;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  password: {
    backgroundColor: '#ddd',
    paddingHorizontal: 15,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  passwordText: {
    color: '#000',
    fontSize: 18,
  },
});
