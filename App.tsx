import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [file, setFile] = React.useState<DocumentPicker.DocumentResult>(null);
  const [content, setContent] = React.useState(null);

  async function onPress() {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });
    setFile(result);
  }

  React.useEffect(() => {
    if (!file) {
      return;
    }
    FileSystem.readAsStringAsync(file.uri, { encoding: 'utf8' }).then(
      result => {
        setContent(result);
      },
    );
  }, [file]);

  console.log({ file, content });

  return (
    <View style={styles.container}>
      {file && <Text>Filename: {file.name}</Text>}

      <Button onPress={onPress} title="Select a file"></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
