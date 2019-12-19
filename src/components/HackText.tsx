import React from 'react';
import { StyleSheet, Text, TextProps, StyleProp, TextStyle } from 'react-native';
import * as Font from 'expo-font';

export interface Props {
  children: string;
  style?: StyleProp<TextStyle>;
}

const FONT_NAME = 'hack-regular';

function HackText({ children, style }: Props & Omit<TextProps, 'children'>) {
  const [fontLoaded, setFontLoaded] = React.useState(false);

  React.useEffect(() => {
    if (fontLoaded) {
      return;
    }

    async function loadFontIfNecessary() {
      const isLoaded = await Font.isLoaded(FONT_NAME);

      if (!isLoaded) {
        await Font.loadAsync({
          [FONT_NAME]: require('../../assets/fonts/hack/Hack-Regular.ttf'),
        });
      }

      setFontLoaded(true);
    }

    loadFontIfNecessary();
  }, []);

  return <Text style={[fontLoaded && styles.hackFont, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  hackFont: {
    fontFamily: 'hack-regular',
  },
});

export default HackText;
