import React, { ReactNode } from 'react';
import { View, ViewProps } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import raw from 'raw.macro';

const createHtml = () => `
<html>
  <head>
    <title>mpw</title>
  </head>
  <body>

    <script>
      window.mpwInstance = null;

      function postJson(data) {
        if (!window || !window.ReactNativeWebView || !window.ReactNativeWebView.postMessage) {
          return;
        }
        window.ReactNativeWebView.postMessage(JSON.stringify(data))
      }

      function postError(error) {
        postJson({
          error: error && error.message
        });
      }

      document.addEventListener("DOMContentLoaded", () => {
        postJson({ domContentLoaded: true, mpw: window.MPW })
      });

      window.onerror = function(message, source, lineno, colno, error) {
        postJson({ error: error, errorMessage: error && error.message, message: message, source: source, lineno: lineno, colno: colno })
      }
    </script>
    <script>
      ${raw('./js/typedarray-polyfill.js')}
      ${raw('./js/encoding-polyfill.js')}
    </script>
    <script>
      ${raw('./js/hmac-sha256.js')}
      ${raw('./js/crypto-pbkdf2.js')}
      ${raw('./js/lib-typedarrays-min.js')}
    </script>
    <script>
      ${raw('./js/setImmediate-polyfill.js')}
      ${raw('./js/pbkdf2.js')}
      ${raw('./js/scrypt.js')}
      ${raw('./js/mpw.js')}
    </script>
  </body>
</html>
`;

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
  name: string;
  password: string;
}

export interface State {
  isReady: boolean;
  isInitialized: boolean;
}

class MpwWebView extends React.PureComponent<Props & ViewProps, State> {
  webViewRef: React.RefObject<WebView>;
  callbacks: {
    [key: string]: {
      successCallback: (data: any) => void;
      errorCallback: (error: Error) => void;
    };
  } = {};

  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      isInitialized: false,
    };
    this.webViewRef = React.createRef<WebView>();
  }

  componentDidMount() {
    const { name, password } = this.props;
    if (name && password) {
      this.webViewRef.current.injectJavaScript(runInitMpw(name, password));
    }
  }

  componentDidUpdate(prevProps: Props & ViewProps, prevState: State) {
    const { name, password } = this.props;
    const { isReady } = this.state;
    if (prevState.isReady === false && isReady === true && name && password) {
      this.initMpw(name, password);
    } else if (name !== prevProps.name || password !== prevProps.password) {
      if (this.state.isInitialized) {
        this.setState({ isInitialized: false }, () => this.initMpw(name, password));
      } else {
        this.initMpw(name, password);
      }
    }
  }

  initMpw = (name, password) => {
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
    if (messageId && this.callbacks[messageId]) {
      const callback = this.callbacks[messageId];
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

      this.webViewRef.current.injectJavaScript(
        runGeneratePassword(messageId, site, '' + counter, template)
      );

      let timeoutId = setTimeout(() => {
        reject(new Error('Timeout: Callback takes to much time to respond'));
        this.callbacks[messageId] = null;
      }, 30000);

      const successCallback = (data: any) => {
        clearTimeout(timeoutId);
        resolve(data.password as string);
        this.callbacks[messageId] = null;
      };

      function errorCallback(error: Error) {
        clearTimeout(timeoutId);
        reject(error);
        this.callbacks[messageId] = null;
      }

      this.callbacks[messageId] = { successCallback, errorCallback };
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
