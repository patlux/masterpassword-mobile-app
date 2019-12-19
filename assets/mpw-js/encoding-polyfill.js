'use strict';
(function(f) {
  function h(b) {
    var a = b.charCodeAt(0) | 0;
    if (55296 <= a && 56319 >= a) {
      var c = b.charCodeAt(1) | 0;
      if (c === c && 56320 <= c && 57343 >= c) {
        if (((a = (((a - 55296) << 10) + c - 56320 + 65536) | 0), 65535 < a))
          return e(
            240 | (a >>> 18),
            128 | ((a >>> 12) & 63),
            128 | ((a >>> 6) & 63),
            128 | (a & 63)
          );
      } else return e(239, 191, 189);
    }
    return 127 >= a
      ? b
      : 2047 >= a
      ? e(192 | (a >>> 6), 128 | (a & 63))
      : e(224 | (a >>> 12), 128 | ((a >>> 6) & 63), 128 | (a & 63));
  }
  function g() {}
  var e = String.fromCharCode,
    k = f.Uint8Array || Array;
  g.prototype.encode = function(b) {
    b =
      void 0 === b
        ? ''
        : ('' + b).replace(/[\x80-\uD7ff\uDC00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]?/g, h);
    for (var a = b.length | 0, c = new k(a), d = 0; d < a; d = (d + 1) | 0) c[d] = b.charCodeAt(d);
    return c;
  };
  f.TextEncoder || (f.TextEncoder = g);
})('' + void 0 == typeof global ? ('' + void 0 == typeof self ? this : self) : global); //anonyco
