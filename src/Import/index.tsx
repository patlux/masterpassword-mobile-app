import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Button } from 'react-native-paper';

import { parse, IMpwAppCliConfigFile, IMpwAppCliConfigSite } from '../Utils/Import';

export interface SiteExtended extends IMpwAppCliConfigSite {
  __siteName: string;
}

function ImportScreen() {
  const [file, setFile] = React.useState<DocumentPicker.DocumentResult>();
  const [content, setContent] = React.useState<string>();
  const [mpwCliConfig, setMpwCliConfig] = React.useState<IMpwAppCliConfigFile>();
  const [sites, setSites] = React.useState<SiteExtended[]>();

  async function onPress() {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });
    setFile(result);
  }

  React.useEffect(() => {
    if (!file?.uri) {
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
    <View style={styles.container}>
      {file && <Text>Filename: {file.name}</Text>}
      <Button onPress={onPress} mode="outlined" style={styles.importButton}>
        Choose file
      </Button>
      {Array.isArray(sites) && <Text>Sites count: {sites.length}</Text>}
    </View>
  );
}

ImportScreen.navigationOptions = {
  title: 'Sites',
};

export default ImportScreen;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  importButton: {
    marginTop: 15,
  },
});
