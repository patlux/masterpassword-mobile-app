import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import HomeScreen from './Home';
import SiteScreen from './Site';
import ImportScreen from './Import';

const AppStack = createStackNavigator({
  Home: HomeScreen,
  Site: SiteScreen,
  Import: ImportScreen,
});

export default createAppContainer(AppStack);
