import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import HackText, { Props as HackTextProps } from './HackText';

function PasswordText({ style, ...hackTextProps }: HackTextProps) {
  return (
    <HackText
      style={[styles.text, style]}
      numberOfLines={1}
      adjustsFontSizeToFit={true}
      selectable={true}
      {...hackTextProps}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    letterSpacing: 1.5,
  },
});

export default PasswordText;
