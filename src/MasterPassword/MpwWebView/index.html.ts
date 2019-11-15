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
  `;
}
