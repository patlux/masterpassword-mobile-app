import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TextInput, Button, Checkbox, Text } from 'react-native-paper';
import { NavigationInjectedProps } from 'react-navigation';
import * as SecureStore from 'expo-secure-store';

import AuthContext from '../Auth/AuthContext';
import ScreenHeader from '../components/ScreenHeader';

function LoginScreen({ navigation }: NavigationInjectedProps) {
  const { name, password, login } = React.useContext(AuthContext);

  const [loading, setLoading] = React.useState(false);

  const [formValues, setFormValues] = React.useState({
    name: name || '',
    password: password || '',
    rememberPassword: null,
  });

  function toggleRememberPassword() {
    setFormValues({
      ...formValues,
      rememberPassword: !formValues.rememberPassword,
    });
  }

  async function onSubmit() {
    try {
      setLoading(true);
      if (formValues.rememberPassword) {
        // TODO: ask for fingerprint to store the password
        //       there is no way to encrypt the password with the fingerprint
        //       but it's necessary to give the user a feeling of security
        await SecureStore.setItemAsync('password', formValues.password, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED,
        });
      } else {
        // TODO: check if a stored password exists,
        //       and ask the user if its ok to delete it
        await SecureStore.deleteItemAsync('password');
      }
      setLoading(false);
      login({ name: formValues.name, password: formValues.password });
    } catch (exception) {
      if (__DEV__) {
        console.error('Error while `onSubmit`:', exception);
      }
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (name && password) {
      navigation.navigate('App');
    }
  }, [navigation, name, password]);

  React.useEffect(() => {
    // TODO: ask first for fingerprint
    SecureStore.getItemAsync('password').then(password => {
      if (password) {
        setFormValues(formValues => ({
          ...formValues,
          password,
          rememberPassword: true,
        }));
      }
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader>Login</ScreenHeader>
      <View style={{ flex: 1, paddingHorizontal: '10%' }}>
        <TextInput
          mode="flat"
          label="Name"
          value={formValues.name}
          onChangeText={name => setFormValues({ ...formValues, name })}
          style={{ marginBottom: 10 }}
          autoFocus={name ? false : true}
          autoCompleteType="username"
          autoCorrect={false}
          autoCapitalize="none"
          disabled={loading}
        />
        <TextInput
          mode="flat"
          label="Password"
          value={formValues.password}
          onChangeText={password => setFormValues({ ...formValues, password })}
          style={{ marginBottom: 10 }}
          secureTextEntry={true}
          autoFocus={name ? true : false}
          autoCompleteType="password"
          autoCorrect={false}
          textContentType="password"
          disabled={loading}
        />
        <TouchableOpacity
          style={{
            marginBottom: 10,
          }}
          onPress={toggleRememberPassword}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Checkbox.Android
              status={formValues.rememberPassword ? 'checked' : 'unchecked'}
              onPress={toggleRememberPassword}
              disabled={loading}
            />
            <Text>Remember password</Text>
          </View>
        </TouchableOpacity>
        <Button mode="contained" onPress={onSubmit} loading={loading}>
          Sign In
        </Button>
      </View>
    </View>
  );
}

LoginScreen.navigationOptions = {
  header: null,
};

export default LoginScreen;
