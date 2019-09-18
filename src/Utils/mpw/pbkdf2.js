/*! by Tom Thorogood <me@tomthorogood.co.uk> */
/*! This work is licensed under the Creative Commons Attribution 4.0
International License. To view a copy of this license, visit
http://creativecommons.org/licenses/by/4.0/ or see LICENSE. */

const CryptoJS = require('crypto-js');

// https://bugzilla.mozilla.org/show_bug.cgi?id=554827
module.exports.default = (function() {
  return function(password, salt, iter, keyLen, hash) {
    switch ((hash.name || hash).toUpperCase()) {
      case 'SHA1':
        var hashAlg = CryptoJS.algo.SHA;
        break;
      case 'SHA224':
      case 'SHA-224':
        var hashAlg = CryptoJS.algo.SHA224;
        break;
      case 'SHA256':
      case 'SHA-256':
        var hashAlg = CryptoJS.algo.SHA256;
        break;
      case 'SHA384':
      case 'SHA-384':
        var hashAlg = CryptoJS.algo.SHA384;
        break;
      case 'SHA512':
      case 'SHA-512':
        var hashAlg = CryptoJS.algo.SHA512;
        break;
      default:
        let err = new Error(
          'A parameter or an operation is not supported by the underlying object',
        );
        err.name = 'InvalidAccessError';
        return Promise.reject(err);
    }

    return new Promise(function(resolve, reject) {
      // setImmediate (a 0-delay setTimeout of sorts) is needed
      // here so that this code is asynchronous and will not block
      // the UI thread
      window.setImmediate(function() {
        // Create crypto-js WordArrays from Uint8Arrays password and salt
        password = CryptoJS.lib.WordArray.create(password);
        salt = CryptoJS.lib.WordArray.create(salt);

        // Derive key using PBKDF2 w/ password and salt
        let Ckey = CryptoJS.PBKDF2(password, salt, {
          keySize: (keyLen * 8) / 32,
          iterations: iter,
          hasher: hashAlg,
        });

        // Create key array and a DataView representing it
        let key = new Uint8Array(Ckey.words.length * 4 /*sizeof(int32)*/);
        let keyView = new DataView(key.buffer, key.byteOffset, key.byteLength);

        // Loop over Ckey.words which are INT32
        for (let i = 0; i < Ckey.words.length; i++) {
          // Set key[i*4,i*4+4] to Ckey.words[i] INT32 in big-endian form
          keyView.setInt32(
            i * 4 /*sizeof(int32)*/,
            Ckey.words[i],
            false /*big-endian*/,
          );
        }

        // Return the key Uint8Array
        resolve(key);
      });
    });
  };
})();
