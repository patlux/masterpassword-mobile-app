import React from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { NavigationInjectedProps } from 'react-navigation';

import AuthContext from '../Auth/AuthContext';
import ScreenHeader from '../components/ScreenHeader';

function LoginScreen({ navigation }: NavigationInjectedProps) {
  const { name, password, login } = React.useContext(AuthContext);
  console.log('LoginScreen', { name, password });

  const [formValues, setFormValues] = React.useState({
    name: name || '',
    password: password || '',
  });

  function onSubmit() {
    console.log('onSubmit', { name, password });
    login({ name: formValues.name, password: formValues.password });
  }

  React.useEffect(() => {
    if (name && password) {
      navigation.navigate('App');
    }
  }, [navigation, name, password]);

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
        />
        <Button mode="contained" onPress={onSubmit}>
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
