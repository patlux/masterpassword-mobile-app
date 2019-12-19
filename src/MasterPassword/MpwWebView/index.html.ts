// @ts-nocheck
import raw from 'raw.macro';

export default () => {
  const indexHtml: string = raw('./index.html');
  const scriptsTags = getScriptDependencies();
  return indexHtml.split('</body>').join(scriptsTags + '</body>');
};

function getScriptDependencies(): string {
  return `
    <script>
      ${raw('../../../assets/mpw-js/typedarray-polyfill.js')}
      ${raw('../../../assets/mpw-js/encoding-polyfill.js')}
    </script>
    <script>
      ${raw('../../../assets/mpw-js/hmac-sha256.js')}
      ${raw('../../../assets/mpw-js/crypto-pbkdf2.js')}
      ${raw('../../../assets/mpw-js/lib-typedarrays-min.js')}
    </script>
    <script>
      ${raw('../../../assets/mpw-js/setImmediate-polyfill.js')}
      ${raw('../../../assets/mpw-js/pbkdf2.js')}
      ${raw('../../../assets/mpw-js/scrypt.js')}
      ${raw('../../../assets/mpw-js/mpw.js')}
    </script>
  `;
}
