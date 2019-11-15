import React, { ReactNode } from 'react';
import { View, ViewProps } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

const createHtml = (): string => {
  const indexHtml = require('./index.html.ts');
  return indexHtml.default();
};

const runInitMpw = (name: string, password: string) => `
  try {
    window.mpwInstance = new MPW("${name}", "${password}");
    window.mpwInstance.key
      .then(function (key) {
        postJson({ key: key });
      })
      .catch(postError);
  } catch (exception) {
    postError(exception);
  }
`;

const runGeneratePassword = (
  messageId: string,
  site: string,
  counter: string,
  template: string = 'long'
) => `
  window.mpwInstance.generatePassword("${site}", "${counter}", "${template}")
    .then(function (password) {
      postJson({ messageId: "${messageId}", password: password });
    })
    .catch(postError);
`;

export interface Props {
  name?: string;
  password?: string;
}

export interface State {
  isReady: boolean;
  isInitialized: boolean;
}

export interface BridgeMessage {
  successCallback: (data: any) => void;
  errorCallback: (error: Error) => void;
}

class MpwWebView extends React.PureComponent<Props & ViewProps, State> {
  webViewRef: React.RefObject<WebView>;
  callbacks: Map<string, BridgeMessage> = new Map();

  constructor(props: Props & ViewProps) {
    super(props);
    this.state = {
      isReady: false,
      isInitialized: false,
    };
    this.webViewRef = React.createRef<WebView>();
  }

  componentDidMount() {
    const { name, password } = this.props;
    if (this.webViewRef?.current && name && password) {
      this.webViewRef.current.injectJavaScript(runInitMpw(name, password));
    }
  }

  componentWillUnmount() {
    if (this.callbacks) {
      this.callbacks.clear();
    }
  }

  componentDidUpdate(prevProps: Props & ViewProps, prevState: State) {
    const { name, password } = this.props;
    const { isReady } = this.state;
    if (prevState.isReady === false && isReady === true && name && password) {
      this.initMpw(name, password);
    } else if (name && password && (name !== prevProps.name || password !== prevProps.password)) {
      if (this.state.isInitialized) {
        this.setState({ isInitialized: false }, () => this.initMpw(name, password));
      } else {
        this.initMpw(name, password);
      }
    }
  }

  initMpw = (name: string, password: string) => {
    if (!this.webViewRef.current) {
      throw new Error('this.webViewRef is not defined');
    }
    this.webViewRef.current.injectJavaScript(runInitMpw(name, password));
  };

  onMessage = (event: WebViewMessageEvent) => {
    const data = event?.nativeEvent?.data;
    console.log('event:', typeof data, '' + data);
    let parsedData = null;
    try {
      parsedData = JSON.parse(data);
    } catch (exception) {
      console.log('Error while parsing data:', data + '');
    }
    const { messageId, error, ...restData } = parsedData;
    if (messageId) {
      const callback = this.callbacks.get(messageId);
      if (!callback) {
        if (__DEV__) {
          console.warn('Received a bridge message which was not found in the queue', messageId);
        }
        return;
      }
      if (error) {
        callback.errorCallback(error);
      } else {
        callback.successCallback(restData);
      }
    } else if (parsedData.domContentLoaded === true) {
      this.setState({ isReady: true });
    } else if (parsedData.key) {
      this.setState({ isInitialized: true });
    }
  };

  generatePassword = (site: string, counter: number, template: string = 'long'): Promise<string> =>
    new Promise((resolve, reject) => {
      const messageId = Math.random()
        .toString(36)
        .substr(2, 12);

      if (!this.webViewRef.current) {
        throw new Error('this.webViewRef is not defined');
      }

      this.webViewRef.current.injectJavaScript(
        runGeneratePassword(messageId, site, '' + counter, template)
      );

      let timeoutId = window.setTimeout(() => {
        this.callbacks.delete(messageId);
        reject(new Error('Timeout: Callback takes to much time to respond'));
      }, 5000);

      const successCallback = (data: any) => {
        this.callbacks.delete(messageId);
        clearTimeout(timeoutId);
        resolve(data.password as string);
      };

      const errorCallback = (error: Error) => {
        this.callbacks.delete(messageId);
        clearTimeout(timeoutId);
        reject(error);
      };

      this.callbacks.set(messageId, { successCallback, errorCallback });
    });

  render() {
    const { name, password, ...restProps } = this.props;
    return (
      <Hide {...restProps}>
        <WebView
          ref={this.webViewRef}
          originWhitelist={['about:blank']}
          source={{ html: createHtml() }}
          onMessage={this.onMessage}
          domStorageEnabled={false}
          javaScriptEnabled={true}
          thirdPartyCookiesEnabled={false}
          bounces={false}
          overScrollMode="never"
          dataDetectorTypes="none"
          scrollEnabled={false}
          geolocationEnabled={false}
          incognito={true}
          cacheEnabled={false}
        />
      </Hide>
    );
  }
}

function Hide({ style, ...restProps }: { children: ReactNode } & ViewProps) {
  return <View {...restProps} style={[{ height: 0, width: 0, overflow: 'hidden' }, style]} />;
}

export default MpwWebView;
