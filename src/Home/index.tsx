import React from 'react';
import { Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { FlatList } from 'react-navigation';
import { Button, Card, Paragraph } from 'react-native-paper';

import MPW from '../Utils/mpw/mpw';

import {
  parse,
  IMpwAppCliConfigFile,
  IMpwAppCliConfigSite,
} from '../Utils/Import';
import AuthContext from '../Auth/AuthContext';

function HomeScreen() {
  const { name, password } = React.useContext(AuthContext);
  console.log('HomeScreen', { name, password });

  const mpwRef = React.useRef<MPW>();
  React.useEffect(() => {
    console.time('mpw::init');
    mpwRef.current = new MPW(name, password);
    console.timeEnd('mpw::init');
  }, [name, password]);

  const [file, setFile] = React.useState<DocumentPicker.DocumentResult>(null);
  const [content, setContent] = React.useState(null);
  const [mpwCliConfig, setMpwCliConfig] = React.useState<IMpwAppCliConfigFile>(
    null,
  );
  const [sites, setSites] = React.useState<
    Array<IMpwAppCliConfigSite & { __siteName: string }>
  >([]);

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
      })),
    );
  }, [mpwCliConfig]);

  console.log({ sites });

  if (!Array.isArray(sites) || sites.length === 0) {
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
        <Paragraph>It seems you didn't added sites yet.</Paragraph>
        <Button onPress={onPress} mode="outlined" style={{ marginTop: 15 }}>
          Import sites from file
        </Button>
      </View>
    );
  }

  return (
    <FlatList
      keyExtractor={item => item.__siteName}
      data={sites}
      renderItem={({ item: site }) => (
        <Card
          key={site.__siteName}
          style={{ marginHorizontal: 10, marginVertical: 5 }}
          onPress={() => {
            console.log('Card:', 'onPress');
            if (mpwRef.current) {
              console.log(`generate password for ${site.__siteName}`);
              mpwRef.current
                .generateAuthentication(
                  site.__siteName,
                  site.counter,
                  '',
                  site.algorithm,
                )
                .then(password => {
                  console.log({ password });
                });
            }
          }}
        >
          <Card.Title title={site.__siteName} subtitle={site.counter} />
          <Card.Content>
            <Paragraph>****</Paragraph>
          </Card.Content>
        </Card>
      )}
    />
  );
}

HomeScreen.navigationOptions = {
  title: 'Passwords',
};

export default HomeScreen;
