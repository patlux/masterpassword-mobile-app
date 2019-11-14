import React from 'react';
import { StyleSheet, TouchableHighlight, View, Clipboard, Alert } from 'react-native';
import { Card } from 'react-native-paper';

import { ISite } from '../Site/SitesContext';
import useMPWPassword from '../MasterPassword/usePassword';
import PasswordText from '../components/PasswordText';
import { Ionicons } from '@expo/vector-icons';

export interface Props {
  site: ISite;
}

function SiteCard({ site, style, ...cardProps }: Props & React.ComponentProps<typeof Card>) {
  const [showPassword, setShowPassword] = React.useState(false);
  const password = useMPWPassword(site, showPassword);

  function togglePasswordVisibility() {
    setShowPassword(prevState => !prevState);
  }

  React.useEffect(() => {
    if (showPassword) {
      Clipboard.setString(password);
      Alert.alert('Password copied');
    }
  }, [showPassword]);

  return (
    <Card {...cardProps} style={[styles.container, style]}>
      <Card.Title title={site.name} />
      <Card.Content>
        <TouchableHighlight onPress={togglePasswordVisibility}>
          <View style={styles.password}>
            <PasswordText style={styles.passwordText}>
              {showPassword ? password : '********'}
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
