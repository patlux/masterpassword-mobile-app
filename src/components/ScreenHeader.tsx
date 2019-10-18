import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Headline } from 'react-native-paper';

export interface Props {
  children: any;
}

function ScreenHeader({ children }: Props) {
  return (
    <View style={styles.container}>
      <Headline>{children}</Headline>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScreenHeader;
