import { DefaultTheme, Theme } from 'react-native-paper';
import Constants from 'expo-constants';

const theme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Constants.manifest.primaryColor,
    accent: '#877697',
  },
};

export default theme;