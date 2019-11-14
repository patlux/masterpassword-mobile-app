import { AsyncStorage } from 'react-native';

export const navigationPersistenceKey = 'navigationState';

export const persistNavigationState = async navState => {
  try {
    return await AsyncStorage.setItem(navigationPersistenceKey, JSON.stringify(navState));
  } catch (err) {
    if (__DEV__) {
      console.error('Error white peristing navigation state:', err);
    }
  }
};
export const loadNavigationState = async () => {
  const jsonString = await AsyncStorage.getItem(navigationPersistenceKey);
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
