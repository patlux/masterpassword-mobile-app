import React from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
} from 'react-native';
import { TextInput, Button, Checkbox, Text } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';

import AuthContext from '../Auth/AuthContext';
import ScreenHeader from '../components/ScreenHeader';

function LoginScreen({ style, ...viewProps }: KeyboardAvoidingViewProps) {
  const { name, password, login } = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    name: name || '',
    password: password || '',
    rememberPassword: false,
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
      await SecureStore.setItemAsync('name', formValues.name);
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
      await SecureStore.setItemAsync(
        'rememberPassword',
        formValues.rememberPassword ? 'yes' : 'no',
      );
      setLoading(false);
      login({ name: formValues.name, password: formValues.password });
    } catch (exception) {
      if (__DEV__) {
        console.error('Error while `onSubmit`:', exception);
      }
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[style, { flex: 1, backgroundColor: '#fff' }]}
      behavior="padding"
      enabled
      {...viewProps}
    >
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
          autoCapitalize="none"
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
    </KeyboardAvoidingView>
  );
}

LoginScreen.navigationOptions = {
  header: null,
};

export default LoginScreen;
