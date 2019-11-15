import { AsyncStorage } from 'react-native';
import { NavigationState } from 'react-navigation';

export const navigationPersistenceKey = 'navigationState';

export const persistNavigationState = async (navState: NavigationState): Promise<any> => {
  try {
    return await AsyncStorage.setItem(navigationPersistenceKey, JSON.stringify(navState));
  } catch (err) {
    if (__DEV__) {
      console.error('Error white peristing navigation state:', err);
    }
  }
};
export const loadNavigationState = async (): Promise<NavigationState | undefined> => {
  const jsonString = await AsyncStorage.getItem(navigationPersistenceKey);
  if (!jsonString) {
    return undefined;
  }
  return JSON.parse(jsonString);
};

export function getPersistenceFunctions() {
  return __DEV__
    ? {
        persistNavigationState,
        loadNavigationState,
      }
    : undefined;
}
