import React from 'react';
import {
  createAppContainer,
  createSwitchNavigator,
  NavigationInjectedProps,
} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { ActivityIndicator } from 'react-native-paper';

import LoginScreen from './Auth/Login';
import AuthContext from './Auth/AuthContext';
import HomeScreen from './Home';
import { View, StatusBar } from 'react-native';

function AuthLoadingScreen({ navigation }: NavigationInjectedProps) {
  const { name, password } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (name && password) {
      navigation.navigate('App');
      return;
    }

    navigation.navigate('Auth');
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color="black" size="large" />
      <StatusBar barStyle="default" />
    </View>
  );
}

const AppStack = createStackNavigator({ Home: HomeScreen });
const AuthStack = createStackNavigator({ Login: LoginScreen });

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
