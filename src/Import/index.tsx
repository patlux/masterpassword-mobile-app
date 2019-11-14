import React from 'react';
import { Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Button, Paragraph } from 'react-native-paper';

import { parse, IMpwAppCliConfigFile, IMpwAppCliConfigSite } from '../Utils/Import';

function ImportScreen() {
  const [file, setFile] = React.useState<DocumentPicker.DocumentResult>(null);
  const [content, setContent] = React.useState(null);
  const [mpwCliConfig, setMpwCliConfig] = React.useState<IMpwAppCliConfigFile>(null);
  const [sites, setSites] = React.useState<Array<IMpwAppCliConfigSite & { __siteName: string }>>(
    []
  );

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
    FileSystem.readAsStringAsync(file.uri, { encoding: 'utf8' }).then(result => {
      setContent(result);
    });
  }, [file]);

  React.useEffect(() => {
    if (!content) {
      return;
    }
    const result = parse(content);
    if (result) {
      setMpwCliConfig(result);
    }
  }, [content]);

  React.useEffect(() => {
    if (!mpwCliConfig) {
      return;
    }
    setSites(
      Object.keys(mpwCliConfig.sites).map(siteName => ({
        __siteName: siteName,
        ...mpwCliConfig.sites[siteName],
      }))
    );
  }, [mpwCliConfig]);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {file && <Text>Filename: {file.name}</Text>}
      <Button onPress={onPress} mode="outlined" style={{ marginTop: 15 }}>
        Choose file
      </Button>
    </View>
  );
}

ImportScreen.navigationOptions = {
  title: 'Sites',
};

export default ImportScreen;
