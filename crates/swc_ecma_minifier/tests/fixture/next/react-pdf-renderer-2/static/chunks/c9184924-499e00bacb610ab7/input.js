"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[186],{

/***/ 6054:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MR": function() { return /* binding */ PDFFont; },
/* harmony export */   "ZP": function() { return /* binding */ PDFDocument; }
/* harmony export */ });
/* unused harmony exports EmbeddedFont, StandardFont */
/* harmony import */ var _babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5068);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(7326);
/* harmony import */ var pako_lib_zlib_zstream__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2292);
/* harmony import */ var pako_lib_zlib_zstream__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pako_lib_zlib_zstream__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var pako_lib_zlib_deflate_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(405);
/* harmony import */ var pako_lib_zlib_inflate_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7948);
/* harmony import */ var pako_lib_zlib_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1619);
/* harmony import */ var pako_lib_zlib_constants__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(pako_lib_zlib_constants__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(7855);
/* harmony import */ var crypto_js_md5__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8214);
/* harmony import */ var crypto_js_md5__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(crypto_js_md5__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var fontkit__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4201);
/* harmony import */ var _react_pdf_png_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1852);
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(7462);












var global$1 = (typeof __webpack_require__.g !== "undefined" ? __webpack_require__.g :
  typeof self !== "undefined" ? self :
  typeof window !== "undefined" ? window : {});

var lookup$1 = [];
var revLookup$1 = [];
var Arr$1 = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;
function init () {
  inited = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup$1[i] = code[i];
    revLookup$1[code.charCodeAt(i)] = i;
  }

  revLookup$1['-'.charCodeAt(0)] = 62;
  revLookup$1['_'.charCodeAt(0)] = 63;
}

function toByteArray$1 (b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr$1(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup$1[b64.charCodeAt(i)] << 18) | (revLookup$1[b64.charCodeAt(i + 1)] << 12) | (revLookup$1[b64.charCodeAt(i + 2)] << 6) | revLookup$1[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xFF;
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = (revLookup$1[b64.charCodeAt(i)] << 2) | (revLookup$1[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = (revLookup$1[b64.charCodeAt(i)] << 10) | (revLookup$1[b64.charCodeAt(i + 1)] << 4) | (revLookup$1[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64$1 (num) {
  return lookup$1[num >> 18 & 0x3F] + lookup$1[num >> 12 & 0x3F] + lookup$1[num >> 6 & 0x3F] + lookup$1[num & 0x3F]
}

function encodeChunk$1 (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    output.push(tripletToBase64$1(tmp));
  }
  return output.join('')
}

function fromByteArray$1 (uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk$1(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup$1[tmp >> 2];
    output += lookup$1[(tmp << 4) & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
    output += lookup$1[tmp >> 10];
    output += lookup$1[(tmp >> 4) & 0x3F];
    output += lookup$1[(tmp << 2) & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('')
}

function read (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

function write (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString$1 = {}.toString;

var isArray = Array.isArray || function (arr) {
  return toString$1.call(arr) == '[object Array]';
};

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer$4.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
  ? global$1.TYPED_ARRAY_SUPPORT
  : true;

function kMaxLength () {
  return Buffer$4.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer$4.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer$4.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer$4(length);
    }
    that.length = length;
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer$4 (arg, encodingOrOffset, length) {
  if (!Buffer$4.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer$4)) {
    return new Buffer$4(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from$1(this, arg, encodingOrOffset, length)
}

Buffer$4.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer$4._augment = function (arr) {
  arr.__proto__ = Buffer$4.prototype;
  return arr
};

function from$1 (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer$4.from = function (value, encodingOrOffset, length) {
  return from$1(null, value, encodingOrOffset, length)
};

if (Buffer$4.TYPED_ARRAY_SUPPORT) {
  Buffer$4.prototype.__proto__ = Uint8Array.prototype;
  Buffer$4.__proto__ = Uint8Array;
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer$4.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
};

function allocUnsafe (that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer$4.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer$4.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer$4.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
};

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer$4.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength$1(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer$4.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer$4.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that
}

function fromObject (that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len);
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}
Buffer$4.isBuffer = isBuffer;
function internalIsBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer$4.compare = function compare (a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

Buffer$4.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer$4.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer$4.alloc(0)
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer$4.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer
};

function byteLength$1 (string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer$4.byteLength = byteLength$1;

function slowToString (encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer$4.prototype._isBuffer = true;

function swap (b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer$4.prototype.swap16 = function swap16 () {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this
};

Buffer$4.prototype.swap32 = function swap32 () {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this
};

Buffer$4.prototype.swap64 = function swap64 () {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this
};

Buffer$4.prototype.toString = function toString () {
  var length = this.length | 0;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
};

Buffer$4.prototype.equals = function equals (b) {
  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer$4.compare(this, b) === 0
};

Buffer$4.prototype.inspect = function inspect () {
  var str = '';
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>'
};

Buffer$4.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset;  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer$4.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer$4.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer$4.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer$4.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
};

Buffer$4.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
};

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer$4.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer$4.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray$1(buf)
  } else {
    return fromByteArray$1(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex$1(buf[i]);
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res
}

Buffer$4.prototype.slice = function slice (start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer$4.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer$4.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer$4(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer$4.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer$4.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val
};

Buffer$4.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset]
};

Buffer$4.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer$4.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer$4.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer$4.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer$4.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer$4.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer$4.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer$4.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer$4.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer$4.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer$4.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer$4.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4)
};

Buffer$4.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4)
};

Buffer$4.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8)
};

Buffer$4.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer$4.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer$4.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer$4.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer$4.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = (value & 0xff);
  return offset + 1
};

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer$4.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer$4.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer$4.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer$4.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
  }
}

Buffer$4.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer$4.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer$4.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer$4.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

Buffer$4.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer$4.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer$4.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer$4.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer$4.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer$4.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer$4.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer$4.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

Buffer$4.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer$4.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer$4.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer$4.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer$4.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer$4.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer$4.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
};

Buffer$4.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer$4.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer$4.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer$4.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer$4.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val)
      ? val
      : utf8ToBytes(new Buffer$4(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex$1 (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}


function base64ToBytes (str) {
  return toByteArray$1(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
}

function isFastBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : typeof self !== 'undefined' ? self : {};

function getAugmentedNamespace(n) {
	if (n.__esModule) return n;
	var a = Object.defineProperty({}, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

var readableBrowser = {exports: {}};

var _registry = {};

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser$1 = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config$1 = {};

function noop$2() {}

var on = noop$2;
var addListener = noop$2;
var once$3 = noop$2;
var off = noop$2;
var removeListener = noop$2;
var removeAllListeners = noop$2;
var emit = noop$2;

function binding$1(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var browser$1$1 = {
  nextTick: nextTick,
  title: title,
  browser: browser$1,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once$3,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding$1,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config$1,
  uptime: uptime
};

var events = {exports: {}};

var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;

if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}

events.exports = EventEmitter;
events.exports.once = once$2; // Backwards-compat with node 0.10.x

EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.

var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function get() {
    return defaultMaxListeners;
  },
  set: function set(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }

    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}; // Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.


EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }

  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];

  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }

  var doError = type === 'error';
  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false; // If there is no 'error' event listener then throw.

  if (doError) {
    var er;
    if (args.length > 0) er = args[0];

    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    } // At least give some kind of context to the user


    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];
  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) {
      ReflectApply(listeners[i], this, args);
    }
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  checkListener(listener);
  events = target._events;

  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object

      events = target._events;
    }

    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener]; // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    } // Check for listener leak


    m = _getMaxListeners(target);

    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true; // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax

      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0) return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
}; // Emits a 'removeListener' event if and only if the listener was removed.


EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;
  checkListener(listener);
  events = this._events;
  if (events === undefined) return this;
  list = events[type];
  if (list === undefined) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;
    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }
    if (list.length === 1) events[type] = list[0];
    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;
  events = this._events;
  if (events === undefined) return this; // not listening for removeListener, no need to emit

  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }

    return this;
  } // emit removeListener for all listeners on all events


  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;

    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }

    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;
  if (events === undefined) return [];
  var evlistener = events[type];
  if (evlistener === undefined) return [];
  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;

function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);

  for (var i = 0; i < n; ++i) {
    copy[i] = arr[i];
  }

  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) {
    list[index] = list[index + 1];
  }

  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);

  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }

  return ret;
}

function once$2(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }

      resolve([].slice.call(arguments));
    }
    eventTargetAgnosticAddListener(emitter, name, resolver, {
      once: true
    });

    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, {
        once: true
      });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }

      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

var streamBrowser = events.exports.EventEmitter;

var buffer = {};

var base64Js = {};

base64Js.byteLength = byteLength;
base64Js.toByteArray = toByteArray;
base64Js.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
} // Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications


revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;

function getLens(b64) {
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  } // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42


  var validLen = b64.indexOf('=');
  if (validLen === -1) validLen = len;
  var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
} // base64 is 4/3 + up to two characters of the original data


function byteLength(b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}

function _byteLength(b64, validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}

function toByteArray(b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
  var curByte = 0; // if there are placeholders, only get up to the last complete 4 chars

  var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
  var i;

  for (i = 0; i < len; i += 4) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = tmp >> 16 & 0xFF;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  return arr;
}

function tripletToBase64(num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}

function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];

  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
    output.push(tripletToBase64(tmp));
  }

  return output.join('');
}

function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes

  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3
  // go through the array every three bytes, we'll deal with trailing stuff later

  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  } // pad the end with zeros, but make sure to not forget the extra bytes


  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
  }

  return parts.join('');
}

var ieee754 = {};

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */

ieee754.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];
  i += d;
  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;

  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;

  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }

  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

ieee754.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);

    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }

    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }

    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = e << mLen | m;
  eLen += mLen;

  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
};

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

(function (exports) {

  var base64 = base64Js;
  var ieee754$1 = ieee754;
  var customInspectSymbol = typeof Symbol === 'function' && typeof Symbol['for'] === 'function' // eslint-disable-line dot-notation
  ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
  : null;
  exports.Buffer = Buffer;
  exports.SlowBuffer = SlowBuffer;
  exports.INSPECT_MAX_BYTES = 50;
  var K_MAX_LENGTH = 0x7fffffff;
  exports.kMaxLength = K_MAX_LENGTH;
  /**
   * If `Buffer.TYPED_ARRAY_SUPPORT`:
   *   === true    Use Uint8Array implementation (fastest)
   *   === false   Print warning and recommend using `buffer` v4.x which has an Object
   *               implementation (most compatible, even IE6)
   *
   * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
   * Opera 11.6+, iOS 4.2+.
   *
   * We report that the browser does not support typed arrays if the are not subclassable
   * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
   * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
   * for __proto__ and has a buggy typed array implementation.
   */

  Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();

  if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error('This browser lacks typed array (Uint8Array) support which is required by ' + '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.');
  }

  function typedArraySupport() {
    // Can typed array instances can be augmented?
    try {
      var arr = new Uint8Array(1);
      var proto = {
        foo: function foo() {
          return 42;
        }
      };
      Object.setPrototypeOf(proto, Uint8Array.prototype);
      Object.setPrototypeOf(arr, proto);
      return arr.foo() === 42;
    } catch (e) {
      return false;
    }
  }

  Object.defineProperty(Buffer.prototype, 'parent', {
    enumerable: true,
    get: function get() {
      if (!Buffer.isBuffer(this)) return undefined;
      return this.buffer;
    }
  });
  Object.defineProperty(Buffer.prototype, 'offset', {
    enumerable: true,
    get: function get() {
      if (!Buffer.isBuffer(this)) return undefined;
      return this.byteOffset;
    }
  });

  function createBuffer(length) {
    if (length > K_MAX_LENGTH) {
      throw new RangeError('The value "' + length + '" is invalid for option "size"');
    } // Return an augmented `Uint8Array` instance


    var buf = new Uint8Array(length);
    Object.setPrototypeOf(buf, Buffer.prototype);
    return buf;
  }
  /**
   * The Buffer constructor returns instances of `Uint8Array` that have their
   * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
   * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
   * and the `Uint8Array` methods. Square bracket notation works as expected -- it
   * returns a single octet.
   *
   * The `Uint8Array` prototype remains unmodified.
   */


  function Buffer(arg, encodingOrOffset, length) {
    // Common case.
    if (typeof arg === 'number') {
      if (typeof encodingOrOffset === 'string') {
        throw new TypeError('The "string" argument must be of type string. Received type number');
      }

      return allocUnsafe(arg);
    }

    return from(arg, encodingOrOffset, length);
  }

  Buffer.poolSize = 8192; // not used by this implementation

  function from(value, encodingOrOffset, length) {
    if (typeof value === 'string') {
      return fromString(value, encodingOrOffset);
    }

    if (ArrayBuffer.isView(value)) {
      return fromArrayView(value);
    }

    if (value == null) {
      throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + typeof value);
    }

    if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
      return fromArrayBuffer(value, encodingOrOffset, length);
    }

    if (typeof SharedArrayBuffer !== 'undefined' && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
      return fromArrayBuffer(value, encodingOrOffset, length);
    }

    if (typeof value === 'number') {
      throw new TypeError('The "value" argument must not be of type number. Received type number');
    }

    var valueOf = value.valueOf && value.valueOf();

    if (valueOf != null && valueOf !== value) {
      return Buffer.from(valueOf, encodingOrOffset, length);
    }

    var b = fromObject(value);
    if (b) return b;

    if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === 'function') {
      return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length);
    }

    throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + typeof value);
  }
  /**
   * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
   * if value is a number.
   * Buffer.from(str[, encoding])
   * Buffer.from(array)
   * Buffer.from(buffer)
   * Buffer.from(arrayBuffer[, byteOffset[, length]])
   **/


  Buffer.from = function (value, encodingOrOffset, length) {
    return from(value, encodingOrOffset, length);
  }; // Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
  // https://github.com/feross/buffer/pull/148


  Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
  Object.setPrototypeOf(Buffer, Uint8Array);

  function assertSize(size) {
    if (typeof size !== 'number') {
      throw new TypeError('"size" argument must be of type number');
    } else if (size < 0) {
      throw new RangeError('The value "' + size + '" is invalid for option "size"');
    }
  }

  function alloc(size, fill, encoding) {
    assertSize(size);

    if (size <= 0) {
      return createBuffer(size);
    }

    if (fill !== undefined) {
      // Only pay attention to encoding if it's a string. This
      // prevents accidentally sending in a number that would
      // be interpreted as a start offset.
      return typeof encoding === 'string' ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
    }

    return createBuffer(size);
  }
  /**
   * Creates a new filled Buffer instance.
   * alloc(size[, fill[, encoding]])
   **/


  Buffer.alloc = function (size, fill, encoding) {
    return alloc(size, fill, encoding);
  };

  function allocUnsafe(size) {
    assertSize(size);
    return createBuffer(size < 0 ? 0 : checked(size) | 0);
  }
  /**
   * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
   * */


  Buffer.allocUnsafe = function (size) {
    return allocUnsafe(size);
  };
  /**
   * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
   */


  Buffer.allocUnsafeSlow = function (size) {
    return allocUnsafe(size);
  };

  function fromString(string, encoding) {
    if (typeof encoding !== 'string' || encoding === '') {
      encoding = 'utf8';
    }

    if (!Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding);
    }

    var length = byteLength(string, encoding) | 0;
    var buf = createBuffer(length);
    var actual = buf.write(string, encoding);

    if (actual !== length) {
      // Writing a hex string, for example, that contains invalid characters will
      // cause everything after the first invalid character to be ignored. (e.g.
      // 'abxxcd' will be treated as 'ab')
      buf = buf.slice(0, actual);
    }

    return buf;
  }

  function fromArrayLike(array) {
    var length = array.length < 0 ? 0 : checked(array.length) | 0;
    var buf = createBuffer(length);

    for (var i = 0; i < length; i += 1) {
      buf[i] = array[i] & 255;
    }

    return buf;
  }

  function fromArrayView(arrayView) {
    if (isInstance(arrayView, Uint8Array)) {
      var copy = new Uint8Array(arrayView);
      return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
    }

    return fromArrayLike(arrayView);
  }

  function fromArrayBuffer(array, byteOffset, length) {
    if (byteOffset < 0 || array.byteLength < byteOffset) {
      throw new RangeError('"offset" is outside of buffer bounds');
    }

    if (array.byteLength < byteOffset + (length || 0)) {
      throw new RangeError('"length" is outside of buffer bounds');
    }

    var buf;

    if (byteOffset === undefined && length === undefined) {
      buf = new Uint8Array(array);
    } else if (length === undefined) {
      buf = new Uint8Array(array, byteOffset);
    } else {
      buf = new Uint8Array(array, byteOffset, length);
    } // Return an augmented `Uint8Array` instance


    Object.setPrototypeOf(buf, Buffer.prototype);
    return buf;
  }

  function fromObject(obj) {
    if (Buffer.isBuffer(obj)) {
      var len = checked(obj.length) | 0;
      var buf = createBuffer(len);

      if (buf.length === 0) {
        return buf;
      }

      obj.copy(buf, 0, 0, len);
      return buf;
    }

    if (obj.length !== undefined) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0);
      }

      return fromArrayLike(obj);
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data);
    }
  }

  function checked(length) {
    // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
    // length is NaN (which is otherwise coerced to zero.)
    if (length >= K_MAX_LENGTH) {
      throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes');
    }

    return length | 0;
  }

  function SlowBuffer(length) {
    if (+length != length) {
      // eslint-disable-line eqeqeq
      length = 0;
    }

    return Buffer.alloc(+length);
  }

  Buffer.isBuffer = function isBuffer(b) {
    return b != null && b._isBuffer === true && b !== Buffer.prototype; // so Buffer.isBuffer(Buffer.prototype) will be false
  };

  Buffer.compare = function compare(a, b) {
    if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
    if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);

    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
      throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
    }

    if (a === b) return 0;
    var x = a.length;
    var y = b.length;

    for (var i = 0, len = Math.min(x, y); i < len; ++i) {
      if (a[i] !== b[i]) {
        x = a[i];
        y = b[i];
        break;
      }
    }

    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
  };

  Buffer.isEncoding = function isEncoding(encoding) {
    switch (String(encoding).toLowerCase()) {
      case 'hex':
      case 'utf8':
      case 'utf-8':
      case 'ascii':
      case 'latin1':
      case 'binary':
      case 'base64':
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return true;

      default:
        return false;
    }
  };

  Buffer.concat = function concat(list, length) {
    if (!Array.isArray(list)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }

    if (list.length === 0) {
      return Buffer.alloc(0);
    }

    var i;

    if (length === undefined) {
      length = 0;

      for (i = 0; i < list.length; ++i) {
        length += list[i].length;
      }
    }

    var buffer = Buffer.allocUnsafe(length);
    var pos = 0;

    for (i = 0; i < list.length; ++i) {
      var buf = list[i];

      if (isInstance(buf, Uint8Array)) {
        if (pos + buf.length > buffer.length) {
          Buffer.from(buf).copy(buffer, pos);
        } else {
          Uint8Array.prototype.set.call(buffer, buf, pos);
        }
      } else if (!Buffer.isBuffer(buf)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      } else {
        buf.copy(buffer, pos);
      }

      pos += buf.length;
    }

    return buffer;
  };

  function byteLength(string, encoding) {
    if (Buffer.isBuffer(string)) {
      return string.length;
    }

    if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
      return string.byteLength;
    }

    if (typeof string !== 'string') {
      throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + 'Received type ' + typeof string);
    }

    var len = string.length;
    var mustMatch = arguments.length > 2 && arguments[2] === true;
    if (!mustMatch && len === 0) return 0; // Use a for loop to avoid recursion

    var loweredCase = false;

    for (;;) {
      switch (encoding) {
        case 'ascii':
        case 'latin1':
        case 'binary':
          return len;

        case 'utf8':
        case 'utf-8':
          return utf8ToBytes(string).length;

        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return len * 2;

        case 'hex':
          return len >>> 1;

        case 'base64':
          return base64ToBytes(string).length;

        default:
          if (loweredCase) {
            return mustMatch ? -1 : utf8ToBytes(string).length; // assume utf8
          }

          encoding = ('' + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  }

  Buffer.byteLength = byteLength;

  function slowToString(encoding, start, end) {
    var loweredCase = false; // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
    // property of a typed array.
    // This behaves neither like String nor Uint8Array in that we set start/end
    // to their upper/lower bounds if the value passed is out of range.
    // undefined is handled specially as per ECMA-262 6th Edition,
    // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.

    if (start === undefined || start < 0) {
      start = 0;
    } // Return early if start > this.length. Done here to prevent potential uint32
    // coercion fail below.


    if (start > this.length) {
      return '';
    }

    if (end === undefined || end > this.length) {
      end = this.length;
    }

    if (end <= 0) {
      return '';
    } // Force coercion to uint32. This will also coerce falsey/NaN values to 0.


    end >>>= 0;
    start >>>= 0;

    if (end <= start) {
      return '';
    }

    if (!encoding) encoding = 'utf8';

    while (true) {
      switch (encoding) {
        case 'hex':
          return hexSlice(this, start, end);

        case 'utf8':
        case 'utf-8':
          return utf8Slice(this, start, end);

        case 'ascii':
          return asciiSlice(this, start, end);

        case 'latin1':
        case 'binary':
          return latin1Slice(this, start, end);

        case 'base64':
          return base64Slice(this, start, end);

        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return utf16leSlice(this, start, end);

        default:
          if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
          encoding = (encoding + '').toLowerCase();
          loweredCase = true;
      }
    }
  } // This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
  // to detect a Buffer instance. It's not possible to use `instanceof Buffer`
  // reliably in a browserify context because there could be multiple different
  // copies of the 'buffer' package in use. This method works even for Buffer
  // instances that were created from another copy of the `buffer` package.
  // See: https://github.com/feross/buffer/issues/154


  Buffer.prototype._isBuffer = true;

  function swap(b, n, m) {
    var i = b[n];
    b[n] = b[m];
    b[m] = i;
  }

  Buffer.prototype.swap16 = function swap16() {
    var len = this.length;

    if (len % 2 !== 0) {
      throw new RangeError('Buffer size must be a multiple of 16-bits');
    }

    for (var i = 0; i < len; i += 2) {
      swap(this, i, i + 1);
    }

    return this;
  };

  Buffer.prototype.swap32 = function swap32() {
    var len = this.length;

    if (len % 4 !== 0) {
      throw new RangeError('Buffer size must be a multiple of 32-bits');
    }

    for (var i = 0; i < len; i += 4) {
      swap(this, i, i + 3);
      swap(this, i + 1, i + 2);
    }

    return this;
  };

  Buffer.prototype.swap64 = function swap64() {
    var len = this.length;

    if (len % 8 !== 0) {
      throw new RangeError('Buffer size must be a multiple of 64-bits');
    }

    for (var i = 0; i < len; i += 8) {
      swap(this, i, i + 7);
      swap(this, i + 1, i + 6);
      swap(this, i + 2, i + 5);
      swap(this, i + 3, i + 4);
    }

    return this;
  };

  Buffer.prototype.toString = function toString() {
    var length = this.length;
    if (length === 0) return '';
    if (arguments.length === 0) return utf8Slice(this, 0, length);
    return slowToString.apply(this, arguments);
  };

  Buffer.prototype.toLocaleString = Buffer.prototype.toString;

  Buffer.prototype.equals = function equals(b) {
    if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
    if (this === b) return true;
    return Buffer.compare(this, b) === 0;
  };

  Buffer.prototype.inspect = function inspect() {
    var str = '';
    var max = exports.INSPECT_MAX_BYTES;
    str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim();
    if (this.length > max) str += ' ... ';
    return '<Buffer ' + str + '>';
  };

  if (customInspectSymbol) {
    Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
  }

  Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
    if (isInstance(target, Uint8Array)) {
      target = Buffer.from(target, target.offset, target.byteLength);
    }

    if (!Buffer.isBuffer(target)) {
      throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. ' + 'Received type ' + typeof target);
    }

    if (start === undefined) {
      start = 0;
    }

    if (end === undefined) {
      end = target ? target.length : 0;
    }

    if (thisStart === undefined) {
      thisStart = 0;
    }

    if (thisEnd === undefined) {
      thisEnd = this.length;
    }

    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
      throw new RangeError('out of range index');
    }

    if (thisStart >= thisEnd && start >= end) {
      return 0;
    }

    if (thisStart >= thisEnd) {
      return -1;
    }

    if (start >= end) {
      return 1;
    }

    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;
    if (this === target) return 0;
    var x = thisEnd - thisStart;
    var y = end - start;
    var len = Math.min(x, y);
    var thisCopy = this.slice(thisStart, thisEnd);
    var targetCopy = target.slice(start, end);

    for (var i = 0; i < len; ++i) {
      if (thisCopy[i] !== targetCopy[i]) {
        x = thisCopy[i];
        y = targetCopy[i];
        break;
      }
    }

    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
  }; // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
  // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
  //
  // Arguments:
  // - buffer - a Buffer to search
  // - val - a string, Buffer, or number
  // - byteOffset - an index into `buffer`; will be clamped to an int32
  // - encoding - an optional encoding, relevant is val is a string
  // - dir - true for indexOf, false for lastIndexOf


  function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
    // Empty buffer means no match
    if (buffer.length === 0) return -1; // Normalize byteOffset

    if (typeof byteOffset === 'string') {
      encoding = byteOffset;
      byteOffset = 0;
    } else if (byteOffset > 0x7fffffff) {
      byteOffset = 0x7fffffff;
    } else if (byteOffset < -0x80000000) {
      byteOffset = -0x80000000;
    }

    byteOffset = +byteOffset; // Coerce to Number.

    if (numberIsNaN(byteOffset)) {
      // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
      byteOffset = dir ? 0 : buffer.length - 1;
    } // Normalize byteOffset: negative offsets start from the end of the buffer


    if (byteOffset < 0) byteOffset = buffer.length + byteOffset;

    if (byteOffset >= buffer.length) {
      if (dir) return -1;else byteOffset = buffer.length - 1;
    } else if (byteOffset < 0) {
      if (dir) byteOffset = 0;else return -1;
    } // Normalize val


    if (typeof val === 'string') {
      val = Buffer.from(val, encoding);
    } // Finally, search either indexOf (if dir is true) or lastIndexOf


    if (Buffer.isBuffer(val)) {
      // Special case: looking for empty string/buffer always fails
      if (val.length === 0) {
        return -1;
      }

      return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
    } else if (typeof val === 'number') {
      val = val & 0xFF; // Search for a byte value [0-255]

      if (typeof Uint8Array.prototype.indexOf === 'function') {
        if (dir) {
          return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
        } else {
          return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
        }
      }

      return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
    }

    throw new TypeError('val must be string, number or Buffer');
  }

  function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
    var indexSize = 1;
    var arrLength = arr.length;
    var valLength = val.length;

    if (encoding !== undefined) {
      encoding = String(encoding).toLowerCase();

      if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
        if (arr.length < 2 || val.length < 2) {
          return -1;
        }

        indexSize = 2;
        arrLength /= 2;
        valLength /= 2;
        byteOffset /= 2;
      }
    }

    function read(buf, i) {
      if (indexSize === 1) {
        return buf[i];
      } else {
        return buf.readUInt16BE(i * indexSize);
      }
    }

    var i;

    if (dir) {
      var foundIndex = -1;

      for (i = byteOffset; i < arrLength; i++) {
        if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
          if (foundIndex === -1) foundIndex = i;
          if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
        } else {
          if (foundIndex !== -1) i -= i - foundIndex;
          foundIndex = -1;
        }
      }
    } else {
      if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;

      for (i = byteOffset; i >= 0; i--) {
        var found = true;

        for (var j = 0; j < valLength; j++) {
          if (read(arr, i + j) !== read(val, j)) {
            found = false;
            break;
          }
        }

        if (found) return i;
      }
    }

    return -1;
  }

  Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
  };

  Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
  };

  Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
  };

  function hexWrite(buf, string, offset, length) {
    offset = Number(offset) || 0;
    var remaining = buf.length - offset;

    if (!length) {
      length = remaining;
    } else {
      length = Number(length);

      if (length > remaining) {
        length = remaining;
      }
    }

    var strLen = string.length;

    if (length > strLen / 2) {
      length = strLen / 2;
    }

    for (var i = 0; i < length; ++i) {
      var parsed = parseInt(string.substr(i * 2, 2), 16);
      if (numberIsNaN(parsed)) return i;
      buf[offset + i] = parsed;
    }

    return i;
  }

  function utf8Write(buf, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
  }

  function asciiWrite(buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length);
  }

  function base64Write(buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length);
  }

  function ucs2Write(buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
  }

  Buffer.prototype.write = function write(string, offset, length, encoding) {
    // Buffer#write(string)
    if (offset === undefined) {
      encoding = 'utf8';
      length = this.length;
      offset = 0; // Buffer#write(string, encoding)
    } else if (length === undefined && typeof offset === 'string') {
      encoding = offset;
      length = this.length;
      offset = 0; // Buffer#write(string, offset[, length][, encoding])
    } else if (isFinite(offset)) {
      offset = offset >>> 0;

      if (isFinite(length)) {
        length = length >>> 0;
        if (encoding === undefined) encoding = 'utf8';
      } else {
        encoding = length;
        length = undefined;
      }
    } else {
      throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
    }

    var remaining = this.length - offset;
    if (length === undefined || length > remaining) length = remaining;

    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
      throw new RangeError('Attempt to write outside buffer bounds');
    }

    if (!encoding) encoding = 'utf8';
    var loweredCase = false;

    for (;;) {
      switch (encoding) {
        case 'hex':
          return hexWrite(this, string, offset, length);

        case 'utf8':
        case 'utf-8':
          return utf8Write(this, string, offset, length);

        case 'ascii':
        case 'latin1':
        case 'binary':
          return asciiWrite(this, string, offset, length);

        case 'base64':
          // Warning: maxLength not taken into account in base64Write
          return base64Write(this, string, offset, length);

        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return ucs2Write(this, string, offset, length);

        default:
          if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
          encoding = ('' + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  };

  Buffer.prototype.toJSON = function toJSON() {
    return {
      type: 'Buffer',
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };

  function base64Slice(buf, start, end) {
    if (start === 0 && end === buf.length) {
      return base64.fromByteArray(buf);
    } else {
      return base64.fromByteArray(buf.slice(start, end));
    }
  }

  function utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end);
    var res = [];
    var i = start;

    while (i < end) {
      var firstByte = buf[i];
      var codePoint = null;
      var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

      if (i + bytesPerSequence <= end) {
        var secondByte, thirdByte, fourthByte, tempCodePoint;

        switch (bytesPerSequence) {
          case 1:
            if (firstByte < 0x80) {
              codePoint = firstByte;
            }

            break;

          case 2:
            secondByte = buf[i + 1];

            if ((secondByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;

              if (tempCodePoint > 0x7F) {
                codePoint = tempCodePoint;
              }
            }

            break;

          case 3:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];

            if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;

              if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                codePoint = tempCodePoint;
              }
            }

            break;

          case 4:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            fourthByte = buf[i + 3];

            if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;

              if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                codePoint = tempCodePoint;
              }
            }

        }
      }

      if (codePoint === null) {
        // we did not generate a valid codePoint so insert a
        // replacement char (U+FFFD) and advance only 1 byte
        codePoint = 0xFFFD;
        bytesPerSequence = 1;
      } else if (codePoint > 0xFFFF) {
        // encode to utf16 (surrogate pair dance)
        codePoint -= 0x10000;
        res.push(codePoint >>> 10 & 0x3FF | 0xD800);
        codePoint = 0xDC00 | codePoint & 0x3FF;
      }

      res.push(codePoint);
      i += bytesPerSequence;
    }

    return decodeCodePointsArray(res);
  } // Based on http://stackoverflow.com/a/22747272/680742, the browser with
  // the lowest limit is Chrome, with 0x10000 args.
  // We go 1 magnitude less, for safety


  var MAX_ARGUMENTS_LENGTH = 0x1000;

  function decodeCodePointsArray(codePoints) {
    var len = codePoints.length;

    if (len <= MAX_ARGUMENTS_LENGTH) {
      return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
    } // Decode in chunks to avoid "call stack size exceeded".


    var res = '';
    var i = 0;

    while (i < len) {
      res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
    }

    return res;
  }

  function asciiSlice(buf, start, end) {
    var ret = '';
    end = Math.min(buf.length, end);

    for (var i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i] & 0x7F);
    }

    return ret;
  }

  function latin1Slice(buf, start, end) {
    var ret = '';
    end = Math.min(buf.length, end);

    for (var i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i]);
    }

    return ret;
  }

  function hexSlice(buf, start, end) {
    var len = buf.length;
    if (!start || start < 0) start = 0;
    if (!end || end < 0 || end > len) end = len;
    var out = '';

    for (var i = start; i < end; ++i) {
      out += hexSliceLookupTable[buf[i]];
    }

    return out;
  }

  function utf16leSlice(buf, start, end) {
    var bytes = buf.slice(start, end);
    var res = ''; // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)

    for (var i = 0; i < bytes.length - 1; i += 2) {
      res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    }

    return res;
  }

  Buffer.prototype.slice = function slice(start, end) {
    var len = this.length;
    start = ~~start;
    end = end === undefined ? len : ~~end;

    if (start < 0) {
      start += len;
      if (start < 0) start = 0;
    } else if (start > len) {
      start = len;
    }

    if (end < 0) {
      end += len;
      if (end < 0) end = 0;
    } else if (end > len) {
      end = len;
    }

    if (end < start) end = start;
    var newBuf = this.subarray(start, end); // Return an augmented `Uint8Array` instance

    Object.setPrototypeOf(newBuf, Buffer.prototype);
    return newBuf;
  };
  /*
   * Need to make sure that buffer isn't trying to write out of bounds.
   */


  function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
    if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
  }

  Buffer.prototype.readUintLE = Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    var val = this[offset];
    var mul = 1;
    var i = 0;

    while (++i < byteLength && (mul *= 0x100)) {
      val += this[offset + i] * mul;
    }

    return val;
  };

  Buffer.prototype.readUintBE = Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;

    if (!noAssert) {
      checkOffset(offset, byteLength, this.length);
    }

    var val = this[offset + --byteLength];
    var mul = 1;

    while (byteLength > 0 && (mul *= 0x100)) {
      val += this[offset + --byteLength] * mul;
    }

    return val;
  };

  Buffer.prototype.readUint8 = Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 1, this.length);
    return this[offset];
  };

  Buffer.prototype.readUint16LE = Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
  };

  Buffer.prototype.readUint16BE = Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
  };

  Buffer.prototype.readUint32LE = Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
  };

  Buffer.prototype.readUint32BE = Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
  };

  Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    var val = this[offset];
    var mul = 1;
    var i = 0;

    while (++i < byteLength && (mul *= 0x100)) {
      val += this[offset + i] * mul;
    }

    mul *= 0x80;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength);
    return val;
  };

  Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    var i = byteLength;
    var mul = 1;
    var val = this[offset + --i];

    while (i > 0 && (mul *= 0x100)) {
      val += this[offset + --i] * mul;
    }

    mul *= 0x80;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength);
    return val;
  };

  Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 1, this.length);
    if (!(this[offset] & 0x80)) return this[offset];
    return (0xff - this[offset] + 1) * -1;
  };

  Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    var val = this[offset] | this[offset + 1] << 8;
    return val & 0x8000 ? val | 0xFFFF0000 : val;
  };

  Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    var val = this[offset + 1] | this[offset] << 8;
    return val & 0x8000 ? val | 0xFFFF0000 : val;
  };

  Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
  };

  Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
  };

  Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754$1.read(this, offset, true, 23, 4);
  };

  Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754$1.read(this, offset, false, 23, 4);
  };

  Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754$1.read(this, offset, true, 52, 8);
  };

  Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754$1.read(this, offset, false, 52, 8);
  };

  function checkInt(buf, value, offset, ext, max, min) {
    if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length) throw new RangeError('Index out of range');
  }

  Buffer.prototype.writeUintLE = Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;

    if (!noAssert) {
      var maxBytes = Math.pow(2, 8 * byteLength) - 1;
      checkInt(this, value, offset, byteLength, maxBytes, 0);
    }

    var mul = 1;
    var i = 0;
    this[offset] = value & 0xFF;

    while (++i < byteLength && (mul *= 0x100)) {
      this[offset + i] = value / mul & 0xFF;
    }

    return offset + byteLength;
  };

  Buffer.prototype.writeUintBE = Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;

    if (!noAssert) {
      var maxBytes = Math.pow(2, 8 * byteLength) - 1;
      checkInt(this, value, offset, byteLength, maxBytes, 0);
    }

    var i = byteLength - 1;
    var mul = 1;
    this[offset + i] = value & 0xFF;

    while (--i >= 0 && (mul *= 0x100)) {
      this[offset + i] = value / mul & 0xFF;
    }

    return offset + byteLength;
  };

  Buffer.prototype.writeUint8 = Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
    this[offset] = value & 0xff;
    return offset + 1;
  };

  Buffer.prototype.writeUint16LE = Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    return offset + 2;
  };

  Buffer.prototype.writeUint16BE = Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
    return offset + 2;
  };

  Buffer.prototype.writeUint32LE = Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 0xff;
    return offset + 4;
  };

  Buffer.prototype.writeUint32BE = Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
    return offset + 4;
  };

  Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;

    if (!noAssert) {
      var limit = Math.pow(2, 8 * byteLength - 1);
      checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }

    var i = 0;
    var mul = 1;
    var sub = 0;
    this[offset] = value & 0xFF;

    while (++i < byteLength && (mul *= 0x100)) {
      if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
        sub = 1;
      }

      this[offset + i] = (value / mul >> 0) - sub & 0xFF;
    }

    return offset + byteLength;
  };

  Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;

    if (!noAssert) {
      var limit = Math.pow(2, 8 * byteLength - 1);
      checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }

    var i = byteLength - 1;
    var mul = 1;
    var sub = 0;
    this[offset + i] = value & 0xFF;

    while (--i >= 0 && (mul *= 0x100)) {
      if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
        sub = 1;
      }

      this[offset + i] = (value / mul >> 0) - sub & 0xFF;
    }

    return offset + byteLength;
  };

  Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
    if (value < 0) value = 0xff + value + 1;
    this[offset] = value & 0xff;
    return offset + 1;
  };

  Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    return offset + 2;
  };

  Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
    return offset + 2;
  };

  Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
    return offset + 4;
  };

  Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
    if (value < 0) value = 0xffffffff + value + 1;
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
    return offset + 4;
  };

  function checkIEEE754(buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length) throw new RangeError('Index out of range');
    if (offset < 0) throw new RangeError('Index out of range');
  }

  function writeFloat(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;

    if (!noAssert) {
      checkIEEE754(buf, value, offset, 4);
    }

    ieee754$1.write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
  }

  Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert);
  };

  Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert);
  };

  function writeDouble(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;

    if (!noAssert) {
      checkIEEE754(buf, value, offset, 8);
    }

    ieee754$1.write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
  }

  Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert);
  };

  Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert);
  }; // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)


  Buffer.prototype.copy = function copy(target, targetStart, start, end) {
    if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer');
    if (!start) start = 0;
    if (!end && end !== 0) end = this.length;
    if (targetStart >= target.length) targetStart = target.length;
    if (!targetStart) targetStart = 0;
    if (end > 0 && end < start) end = start; // Copy 0 bytes; we're done

    if (end === start) return 0;
    if (target.length === 0 || this.length === 0) return 0; // Fatal error conditions

    if (targetStart < 0) {
      throw new RangeError('targetStart out of bounds');
    }

    if (start < 0 || start >= this.length) throw new RangeError('Index out of range');
    if (end < 0) throw new RangeError('sourceEnd out of bounds'); // Are we oob?

    if (end > this.length) end = this.length;

    if (target.length - targetStart < end - start) {
      end = target.length - targetStart + start;
    }

    var len = end - start;

    if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
      // Use built-in when available, missing from IE11
      this.copyWithin(targetStart, start, end);
    } else {
      Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
    }

    return len;
  }; // Usage:
  //    buffer.fill(number[, offset[, end]])
  //    buffer.fill(buffer[, offset[, end]])
  //    buffer.fill(string[, offset[, end]][, encoding])


  Buffer.prototype.fill = function fill(val, start, end, encoding) {
    // Handle string cases:
    if (typeof val === 'string') {
      if (typeof start === 'string') {
        encoding = start;
        start = 0;
        end = this.length;
      } else if (typeof end === 'string') {
        encoding = end;
        end = this.length;
      }

      if (encoding !== undefined && typeof encoding !== 'string') {
        throw new TypeError('encoding must be a string');
      }

      if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
        throw new TypeError('Unknown encoding: ' + encoding);
      }

      if (val.length === 1) {
        var code = val.charCodeAt(0);

        if (encoding === 'utf8' && code < 128 || encoding === 'latin1') {
          // Fast path: If `val` fits into a single byte, use that numeric value.
          val = code;
        }
      }
    } else if (typeof val === 'number') {
      val = val & 255;
    } else if (typeof val === 'boolean') {
      val = Number(val);
    } // Invalid ranges are not set to a default, so can range check early.


    if (start < 0 || this.length < start || this.length < end) {
      throw new RangeError('Out of range index');
    }

    if (end <= start) {
      return this;
    }

    start = start >>> 0;
    end = end === undefined ? this.length : end >>> 0;
    if (!val) val = 0;
    var i;

    if (typeof val === 'number') {
      for (i = start; i < end; ++i) {
        this[i] = val;
      }
    } else {
      var bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, encoding);
      var len = bytes.length;

      if (len === 0) {
        throw new TypeError('The value "' + val + '" is invalid for argument "value"');
      }

      for (i = 0; i < end - start; ++i) {
        this[i + start] = bytes[i % len];
      }
    }

    return this;
  }; // HELPER FUNCTIONS
  // ================


  var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;

  function base64clean(str) {
    // Node takes equal signs as end of the Base64 encoding
    str = str.split('=')[0]; // Node strips out invalid characters like \n and \t from the string, base64-js does not

    str = str.trim().replace(INVALID_BASE64_RE, ''); // Node converts strings with length < 2 to ''

    if (str.length < 2) return ''; // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not

    while (str.length % 4 !== 0) {
      str = str + '=';
    }

    return str;
  }

  function utf8ToBytes(string, units) {
    units = units || Infinity;
    var codePoint;
    var length = string.length;
    var leadSurrogate = null;
    var bytes = [];

    for (var i = 0; i < length; ++i) {
      codePoint = string.charCodeAt(i); // is surrogate component

      if (codePoint > 0xD7FF && codePoint < 0xE000) {
        // last char was a lead
        if (!leadSurrogate) {
          // no lead yet
          if (codePoint > 0xDBFF) {
            // unexpected trail
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
            continue;
          } else if (i + 1 === length) {
            // unpaired lead
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
            continue;
          } // valid lead


          leadSurrogate = codePoint;
          continue;
        } // 2 leads in a row


        if (codePoint < 0xDC00) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          leadSurrogate = codePoint;
          continue;
        } // valid surrogate pair


        codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
      } else if (leadSurrogate) {
        // valid bmp char, but last char was a lead
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
      }

      leadSurrogate = null; // encode utf8

      if (codePoint < 0x80) {
        if ((units -= 1) < 0) break;
        bytes.push(codePoint);
      } else if (codePoint < 0x800) {
        if ((units -= 2) < 0) break;
        bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
      } else if (codePoint < 0x10000) {
        if ((units -= 3) < 0) break;
        bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
      } else if (codePoint < 0x110000) {
        if ((units -= 4) < 0) break;
        bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
      } else {
        throw new Error('Invalid code point');
      }
    }

    return bytes;
  }

  function asciiToBytes(str) {
    var byteArray = [];

    for (var i = 0; i < str.length; ++i) {
      // Node's code seems to be doing this and not & 0x7F..
      byteArray.push(str.charCodeAt(i) & 0xFF);
    }

    return byteArray;
  }

  function utf16leToBytes(str, units) {
    var c, hi, lo;
    var byteArray = [];

    for (var i = 0; i < str.length; ++i) {
      if ((units -= 2) < 0) break;
      c = str.charCodeAt(i);
      hi = c >> 8;
      lo = c % 256;
      byteArray.push(lo);
      byteArray.push(hi);
    }

    return byteArray;
  }

  function base64ToBytes(str) {
    return base64.toByteArray(base64clean(str));
  }

  function blitBuffer(src, dst, offset, length) {
    for (var i = 0; i < length; ++i) {
      if (i + offset >= dst.length || i >= src.length) break;
      dst[i + offset] = src[i];
    }

    return i;
  } // ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
  // the `instanceof` check but they should be treated as of that type.
  // See: https://github.com/feross/buffer/issues/166


  function isInstance(obj, type) {
    return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
  }

  function numberIsNaN(obj) {
    // For IE11 support
    return obj !== obj; // eslint-disable-line no-self-compare
  } // Create lookup table for `toString('hex')`
  // See: https://github.com/feross/buffer/issues/219


  var hexSliceLookupTable = function () {
    var alphabet = '0123456789abcdef';
    var table = new Array(256);

    for (var i = 0; i < 16; ++i) {
      var i16 = i * 16;

      for (var j = 0; j < 16; ++j) {
        table[i16 + j] = alphabet[i] + alphabet[j];
      }
    }

    return table;
  }();
})(buffer);

var _nodeResolve_empty = {};

var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': _nodeResolve_empty
});

var require$$4 = /*@__PURE__*/getAugmentedNamespace(_nodeResolve_empty$1);

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread$1(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty$2(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty$2(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _classCallCheck$3(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties$2(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass$2(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties$2(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties$2(Constructor, staticProps);
  return Constructor;
}

var _require$4 = buffer,
    Buffer$3 = _require$4.Buffer;
var _require2$2 = require$$4,
    inspect$2 = _require2$2.inspect;
var custom = inspect$2 && inspect$2.custom || 'inspect';

function copyBuffer(src, target, offset) {
  Buffer$3.prototype.copy.call(src, target, offset);
}

var buffer_list = /*#__PURE__*/function () {
  function BufferList() {
    _classCallCheck$3(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  _createClass$2(BufferList, [{
    key: "push",
    value: function push(v) {
      var entry = {
        data: v,
        next: null
      };
      if (this.length > 0) this.tail.next = entry;else this.head = entry;
      this.tail = entry;
      ++this.length;
    }
  }, {
    key: "unshift",
    value: function unshift(v) {
      var entry = {
        data: v,
        next: this.head
      };
      if (this.length === 0) this.tail = entry;
      this.head = entry;
      ++this.length;
    }
  }, {
    key: "shift",
    value: function shift() {
      if (this.length === 0) return;
      var ret = this.head.data;
      if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
      --this.length;
      return ret;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.head = this.tail = null;
      this.length = 0;
    }
  }, {
    key: "join",
    value: function join(s) {
      if (this.length === 0) return '';
      var p = this.head;
      var ret = '' + p.data;

      while (p = p.next) {
        ret += s + p.data;
      }

      return ret;
    }
  }, {
    key: "concat",
    value: function concat(n) {
      if (this.length === 0) return Buffer$3.alloc(0);
      var ret = Buffer$3.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;

      while (p) {
        copyBuffer(p.data, ret, i);
        i += p.data.length;
        p = p.next;
      }

      return ret;
    } // Consumes a specified amount of bytes or characters from the buffered data.

  }, {
    key: "consume",
    value: function consume(n, hasStrings) {
      var ret;

      if (n < this.head.data.length) {
        // `slice` is the same for buffers and strings.
        ret = this.head.data.slice(0, n);
        this.head.data = this.head.data.slice(n);
      } else if (n === this.head.data.length) {
        // First chunk is a perfect match.
        ret = this.shift();
      } else {
        // Result spans more than one buffer.
        ret = hasStrings ? this._getString(n) : this._getBuffer(n);
      }

      return ret;
    }
  }, {
    key: "first",
    value: function first() {
      return this.head.data;
    } // Consumes a specified amount of characters from the buffered data.

  }, {
    key: "_getString",
    value: function _getString(n) {
      var p = this.head;
      var c = 1;
      var ret = p.data;
      n -= ret.length;

      while (p = p.next) {
        var str = p.data;
        var nb = n > str.length ? str.length : n;
        if (nb === str.length) ret += str;else ret += str.slice(0, n);
        n -= nb;

        if (n === 0) {
          if (nb === str.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = str.slice(nb);
          }

          break;
        }

        ++c;
      }

      this.length -= c;
      return ret;
    } // Consumes a specified amount of bytes from the buffered data.

  }, {
    key: "_getBuffer",
    value: function _getBuffer(n) {
      var ret = Buffer$3.allocUnsafe(n);
      var p = this.head;
      var c = 1;
      p.data.copy(ret);
      n -= p.data.length;

      while (p = p.next) {
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret, ret.length - n, 0, nb);
        n -= nb;

        if (n === 0) {
          if (nb === buf.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = buf.slice(nb);
          }

          break;
        }

        ++c;
      }

      this.length -= c;
      return ret;
    } // Make sure the linked list only shows the minimal necessary information.

  }, {
    key: custom,
    value: function value(_, options) {
      return inspect$2(this, _objectSpread$1({}, options, {
        // Only inspect one level.
        depth: 0,
        // It should not recurse.
        customInspect: false
      }));
    }
  }]);

  return BufferList;
}();

function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err) {
      if (!this._writableState) {
        browser$1$1.nextTick(emitErrorNT, this, err);
      } else if (!this._writableState.errorEmitted) {
        this._writableState.errorEmitted = true;
        browser$1$1.nextTick(emitErrorNT, this, err);
      }
    }

    return this;
  } // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks


  if (this._readableState) {
    this._readableState.destroyed = true;
  } // if this is a duplex stream mark the writable part as destroyed as well


  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      if (!_this._writableState) {
        browser$1$1.nextTick(emitErrorAndCloseNT, _this, err);
      } else if (!_this._writableState.errorEmitted) {
        _this._writableState.errorEmitted = true;
        browser$1$1.nextTick(emitErrorAndCloseNT, _this, err);
      } else {
        browser$1$1.nextTick(emitCloseNT, _this);
      }
    } else if (cb) {
      browser$1$1.nextTick(emitCloseNT, _this);
      cb(err);
    } else {
      browser$1$1.nextTick(emitCloseNT, _this);
    }
  });

  return this;
}

function emitErrorAndCloseNT(self, err) {
  emitErrorNT(self, err);
  emitCloseNT(self);
}

function emitCloseNT(self) {
  if (self._writableState && !self._writableState.emitClose) return;
  if (self._readableState && !self._readableState.emitClose) return;
  self.emit('close');
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finalCalled = false;
    this._writableState.prefinished = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

function errorOrDestroy$2(stream, err) {
  // We have tests that rely on errors being emitted
  // in the same tick, so changing this is semver major.
  // For now when you opt-in to autoDestroy we allow
  // the error to be emitted nextTick. In a future
  // semver major update we should change the default to this.
  var rState = stream._readableState;
  var wState = stream._writableState;
  if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream.destroy(err);else stream.emit('error', err);
}

var destroy_1 = {
  destroy: destroy,
  undestroy: undestroy,
  errorOrDestroy: errorOrDestroy$2
};

var errorsBrowser = {};

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var codes$1 = {};

function createErrorType$1(code, message, Base) {
  if (!Base) {
    Base = Error;
  }

  function getMessage(arg1, arg2, arg3) {
    if (typeof message === 'string') {
      return message;
    } else {
      return message(arg1, arg2, arg3);
    }
  }

  var NodeError = /*#__PURE__*/function (_Base) {
    _inheritsLoose(NodeError, _Base);

    function NodeError(arg1, arg2, arg3) {
      return _Base.call(this, getMessage(arg1, arg2, arg3)) || this;
    }

    return NodeError;
  }(Base);

  NodeError.prototype.name = Base.name;
  NodeError.prototype.code = code;
  codes$1[code] = NodeError;
} // https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js


function oneOf$1(expected, thing) {
  if (Array.isArray(expected)) {
    var len = expected.length;
    expected = expected.map(function (i) {
      return String(i);
    });

    if (len > 2) {
      return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(', '), ", or ") + expected[len - 1];
    } else if (len === 2) {
      return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
    } else {
      return "of ".concat(thing, " ").concat(expected[0]);
    }
  } else {
    return "of ".concat(thing, " ").concat(String(expected));
  }
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith


function startsWith$1(str, search, pos) {
  return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith


function endsWith$2(str, search, this_len) {
  if (this_len === undefined || this_len > str.length) {
    this_len = str.length;
  }

  return str.substring(this_len - search.length, this_len) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes


function includes$1(str, search, start) {
  if (typeof start !== 'number') {
    start = 0;
  }

  if (start + search.length > str.length) {
    return false;
  } else {
    return str.indexOf(search, start) !== -1;
  }
}

createErrorType$1('ERR_INVALID_OPT_VALUE', function (name, value) {
  return 'The value "' + value + '" is invalid for option "' + name + '"';
}, TypeError);
createErrorType$1('ERR_INVALID_ARG_TYPE', function (name, expected, actual) {
  // determiner: 'must be' or 'must not be'
  var determiner;

  if (typeof expected === 'string' && startsWith$1(expected, 'not ')) {
    determiner = 'must not be';
    expected = expected.replace(/^not /, '');
  } else {
    determiner = 'must be';
  }

  var msg;

  if (endsWith$2(name, ' argument')) {
    // For cases like 'first argument'
    msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf$1(expected, 'type'));
  } else {
    var type = includes$1(name, '.') ? 'property' : 'argument';
    msg = "The \"".concat(name, "\" ").concat(type, " ").concat(determiner, " ").concat(oneOf$1(expected, 'type'));
  }

  msg += ". Received type ".concat(typeof actual);
  return msg;
}, TypeError);
createErrorType$1('ERR_STREAM_PUSH_AFTER_EOF', 'stream.push() after EOF');
createErrorType$1('ERR_METHOD_NOT_IMPLEMENTED', function (name) {
  return 'The ' + name + ' method is not implemented';
});
createErrorType$1('ERR_STREAM_PREMATURE_CLOSE', 'Premature close');
createErrorType$1('ERR_STREAM_DESTROYED', function (name) {
  return 'Cannot call ' + name + ' after a stream was destroyed';
});
createErrorType$1('ERR_MULTIPLE_CALLBACK', 'Callback called multiple times');
createErrorType$1('ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable');
createErrorType$1('ERR_STREAM_WRITE_AFTER_END', 'write after end');
createErrorType$1('ERR_STREAM_NULL_VALUES', 'May not write null values to stream', TypeError);
createErrorType$1('ERR_UNKNOWN_ENCODING', function (arg) {
  return 'Unknown encoding: ' + arg;
}, TypeError);
createErrorType$1('ERR_STREAM_UNSHIFT_AFTER_END_EVENT', 'stream.unshift() after end event');
errorsBrowser.codes = codes$1;

var ERR_INVALID_OPT_VALUE = errorsBrowser.codes.ERR_INVALID_OPT_VALUE;

function highWaterMarkFrom(options, isDuplex, duplexKey) {
  return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
}

function getHighWaterMark$2(state, options, duplexKey, isDuplex) {
  var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);

  if (hwm != null) {
    if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
      var name = isDuplex ? duplexKey : 'highWaterMark';
      throw new ERR_INVALID_OPT_VALUE(name, hwm);
    }

    return Math.floor(hwm);
  } // Default value


  return state.objectMode ? 16 : 16 * 1024;
}

var state = {
  getHighWaterMark: getHighWaterMark$2
};

var inherits_browser = {exports: {}};

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  inherits_browser.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
  };
} else {
  // old school shim for old browsers
  inherits_browser.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;

      var TempCtor = function TempCtor() {};

      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }
  };
}

var string_decoder = {};

var safeBuffer = {exports: {}};

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */

(function (module, exports) {
  /* eslint-disable node/no-deprecated-api */
  var buffer$1 = buffer;
  var Buffer = buffer$1.Buffer; // alternative to using Object.keys for old browsers

  function copyProps(src, dst) {
    for (var key in src) {
      dst[key] = src[key];
    }
  }

  if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
    module.exports = buffer$1;
  } else {
    // Copy properties from require('buffer')
    copyProps(buffer$1, exports);
    exports.Buffer = SafeBuffer;
  }

  function SafeBuffer(arg, encodingOrOffset, length) {
    return Buffer(arg, encodingOrOffset, length);
  }

  SafeBuffer.prototype = Object.create(Buffer.prototype); // Copy static methods from Buffer

  copyProps(Buffer, SafeBuffer);

  SafeBuffer.from = function (arg, encodingOrOffset, length) {
    if (typeof arg === 'number') {
      throw new TypeError('Argument must not be a number');
    }

    return Buffer(arg, encodingOrOffset, length);
  };

  SafeBuffer.alloc = function (size, fill, encoding) {
    if (typeof size !== 'number') {
      throw new TypeError('Argument must be a number');
    }

    var buf = Buffer(size);

    if (fill !== undefined) {
      if (typeof encoding === 'string') {
        buf.fill(fill, encoding);
      } else {
        buf.fill(fill);
      }
    } else {
      buf.fill(0);
    }

    return buf;
  };

  SafeBuffer.allocUnsafe = function (size) {
    if (typeof size !== 'number') {
      throw new TypeError('Argument must be a number');
    }

    return Buffer(size);
  };

  SafeBuffer.allocUnsafeSlow = function (size) {
    if (typeof size !== 'number') {
      throw new TypeError('Argument must be a number');
    }

    return buffer$1.SlowBuffer(size);
  };
})(safeBuffer, safeBuffer.exports);

/*<replacement>*/


var Buffer$2 = safeBuffer.exports.Buffer;
/*</replacement>*/

var isEncoding = Buffer$2.isEncoding || function (encoding) {
  encoding = '' + encoding;

  switch (encoding && encoding.toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
    case 'raw':
      return true;

    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;

  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';

      case 'latin1':
      case 'binary':
        return 'latin1';

      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;

      default:
        if (retried) return; // undefined

        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
}
// modules monkey-patch it to support additional encodings

function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);

  if (typeof nenc !== 'string' && (Buffer$2.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
} // StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.


string_decoder.StringDecoder = StringDecoder$1;

function StringDecoder$1(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;

  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;

    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;

    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;

    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }

  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer$2.allocUnsafe(nb);
}

StringDecoder$1.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;

  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }

  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder$1.prototype.end = utf8End; // Returns only complete characters in a Buffer

StringDecoder$1.prototype.text = utf8Text; // Attempts to complete a partial non-UTF-8 character using bytes from a Buffer

StringDecoder$1.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }

  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
}; // Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.


function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
} // Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.


function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);

  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }

  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);

  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }

  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);

  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }

    return nb;
  }

  return 0;
} // Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.


function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return "\uFFFD";
  }

  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return "\uFFFD";
    }

    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return "\uFFFD";
      }
    }
  }
} // Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.


function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf);
  if (r !== undefined) return r;

  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }

  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
} // Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.


function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
} // For UTF-8, a replacement character is added when ending on a partial
// character.


function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + "\uFFFD";
  return r;
} // UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.


function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);

    if (r) {
      var c = r.charCodeAt(r.length - 1);

      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }

    return r;
  }

  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
} // For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.


function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';

  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }

  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;

  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }

  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
} // Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)


function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}

var ERR_STREAM_PREMATURE_CLOSE = errorsBrowser.codes.ERR_STREAM_PREMATURE_CLOSE;

function once$1(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    callback.apply(this, args);
  };
}

function noop$1() {}

function isRequest$1(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}

function eos$1(stream, opts, callback) {
  if (typeof opts === 'function') return eos$1(stream, null, opts);
  if (!opts) opts = {};
  callback = once$1(callback || noop$1);
  var readable = opts.readable || opts.readable !== false && stream.readable;
  var writable = opts.writable || opts.writable !== false && stream.writable;

  var onlegacyfinish = function onlegacyfinish() {
    if (!stream.writable) onfinish();
  };

  var writableEnded = stream._writableState && stream._writableState.finished;

  var onfinish = function onfinish() {
    writable = false;
    writableEnded = true;
    if (!readable) callback.call(stream);
  };

  var readableEnded = stream._readableState && stream._readableState.endEmitted;

  var onend = function onend() {
    readable = false;
    readableEnded = true;
    if (!writable) callback.call(stream);
  };

  var onerror = function onerror(err) {
    callback.call(stream, err);
  };

  var onclose = function onclose() {
    var err;

    if (readable && !readableEnded) {
      if (!stream._readableState || !stream._readableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }

    if (writable && !writableEnded) {
      if (!stream._writableState || !stream._writableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }
  };

  var onrequest = function onrequest() {
    stream.req.on('finish', onfinish);
  };

  if (isRequest$1(stream)) {
    stream.on('complete', onfinish);
    stream.on('abort', onclose);
    if (stream.req) onrequest();else stream.on('request', onrequest);
  } else if (writable && !stream._writableState) {
    // legacy streams
    stream.on('end', onlegacyfinish);
    stream.on('close', onlegacyfinish);
  }

  stream.on('end', onend);
  stream.on('finish', onfinish);
  if (opts.error !== false) stream.on('error', onerror);
  stream.on('close', onclose);
  return function () {
    stream.removeListener('complete', onfinish);
    stream.removeListener('abort', onclose);
    stream.removeListener('request', onrequest);
    if (stream.req) stream.req.removeListener('finish', onfinish);
    stream.removeListener('end', onlegacyfinish);
    stream.removeListener('close', onlegacyfinish);
    stream.removeListener('finish', onfinish);
    stream.removeListener('end', onend);
    stream.removeListener('error', onerror);
    stream.removeListener('close', onclose);
  };
}

var endOfStream = eos$1;

var _Object$setPrototypeO;

function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var finished = endOfStream;
var kLastResolve = Symbol('lastResolve');
var kLastReject = Symbol('lastReject');
var kError = Symbol('error');
var kEnded = Symbol('ended');
var kLastPromise = Symbol('lastPromise');
var kHandlePromise = Symbol('handlePromise');
var kStream = Symbol('stream');

function createIterResult(value, done) {
  return {
    value: value,
    done: done
  };
}

function readAndResolve(iter) {
  var resolve = iter[kLastResolve];

  if (resolve !== null) {
    var data = iter[kStream].read(); // we defer if data is null
    // we can be expecting either 'end' or
    // 'error'

    if (data !== null) {
      iter[kLastPromise] = null;
      iter[kLastResolve] = null;
      iter[kLastReject] = null;
      resolve(createIterResult(data, false));
    }
  }
}

function onReadable(iter) {
  // we wait for the next tick, because it might
  // emit an error with process.nextTick
  browser$1$1.nextTick(readAndResolve, iter);
}

function wrapForNext(lastPromise, iter) {
  return function (resolve, reject) {
    lastPromise.then(function () {
      if (iter[kEnded]) {
        resolve(createIterResult(undefined, true));
        return;
      }

      iter[kHandlePromise](resolve, reject);
    }, reject);
  };
}

var AsyncIteratorPrototype = Object.getPrototypeOf(function () {});
var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
  get stream() {
    return this[kStream];
  },

  next: function next() {
    var _this = this; // if we have detected an error in the meanwhile
    // reject straight away


    var error = this[kError];

    if (error !== null) {
      return Promise.reject(error);
    }

    if (this[kEnded]) {
      return Promise.resolve(createIterResult(undefined, true));
    }

    if (this[kStream].destroyed) {
      // We need to defer via nextTick because if .destroy(err) is
      // called, the error will be emitted via nextTick, and
      // we cannot guarantee that there is no error lingering around
      // waiting to be emitted.
      return new Promise(function (resolve, reject) {
        browser$1$1.nextTick(function () {
          if (_this[kError]) {
            reject(_this[kError]);
          } else {
            resolve(createIterResult(undefined, true));
          }
        });
      });
    } // if we have multiple next() calls
    // we will wait for the previous Promise to finish
    // this logic is optimized to support for await loops,
    // where next() is only called once at a time


    var lastPromise = this[kLastPromise];
    var promise;

    if (lastPromise) {
      promise = new Promise(wrapForNext(lastPromise, this));
    } else {
      // fast path needed to support multiple this.push()
      // without triggering the next() queue
      var data = this[kStream].read();

      if (data !== null) {
        return Promise.resolve(createIterResult(data, false));
      }

      promise = new Promise(this[kHandlePromise]);
    }

    this[kLastPromise] = promise;
    return promise;
  }
}, _defineProperty$1(_Object$setPrototypeO, Symbol.asyncIterator, function () {
  return this;
}), _defineProperty$1(_Object$setPrototypeO, "return", function _return() {
  var _this2 = this; // destroy(err, cb) is a private API
  // we can guarantee we have that here, because we control the
  // Readable class this is attached to


  return new Promise(function (resolve, reject) {
    _this2[kStream].destroy(null, function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve(createIterResult(undefined, true));
    });
  });
}), _Object$setPrototypeO), AsyncIteratorPrototype);

var createReadableStreamAsyncIterator$1 = function createReadableStreamAsyncIterator(stream) {
  var _Object$create;

  var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty$1(_Object$create, kStream, {
    value: stream,
    writable: true
  }), _defineProperty$1(_Object$create, kLastResolve, {
    value: null,
    writable: true
  }), _defineProperty$1(_Object$create, kLastReject, {
    value: null,
    writable: true
  }), _defineProperty$1(_Object$create, kError, {
    value: null,
    writable: true
  }), _defineProperty$1(_Object$create, kEnded, {
    value: stream._readableState.endEmitted,
    writable: true
  }), _defineProperty$1(_Object$create, kHandlePromise, {
    value: function value(resolve, reject) {
      var data = iterator[kStream].read();

      if (data) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        resolve(createIterResult(data, false));
      } else {
        iterator[kLastResolve] = resolve;
        iterator[kLastReject] = reject;
      }
    },
    writable: true
  }), _Object$create));
  iterator[kLastPromise] = null;
  finished(stream, function (err) {
    if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
      var reject = iterator[kLastReject]; // reject if we are waiting for data in the Promise
      // returned by next() and store the error

      if (reject !== null) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        reject(err);
      }

      iterator[kError] = err;
      return;
    }

    var resolve = iterator[kLastResolve];

    if (resolve !== null) {
      iterator[kLastPromise] = null;
      iterator[kLastResolve] = null;
      iterator[kLastReject] = null;
      resolve(createIterResult(undefined, true));
    }

    iterator[kEnded] = true;
  });
  stream.on('readable', onReadable.bind(null, iterator));
  return iterator;
};

var async_iterator = createReadableStreamAsyncIterator$1;

var fromBrowser = function fromBrowser() {
  throw new Error('Readable.from is not available in the browser');
};

var Registry$4 = _registry;
Registry$4.Readable = Readable;
Readable.ReadableState = ReadableState;
/*<replacement>*/

events.exports.EventEmitter;

var EElistenerCount = function EElistenerCount(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/


var Stream$1 = streamBrowser;
/*</replacement>*/

var Buffer$1 = buffer.Buffer;

var OurUint8Array$1 = commonjsGlobal.Uint8Array || function () {};

function _uint8ArrayToBuffer$1(chunk) {
  return Buffer$1.from(chunk);
}

function _isUint8Array$1(obj) {
  return Buffer$1.isBuffer(obj) || obj instanceof OurUint8Array$1;
}
/*<replacement>*/


var debugUtil = require$$4;
var debug;

if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function debug() {};
}
/*</replacement>*/


var BufferList = buffer_list;
var destroyImpl$1 = destroy_1;
var _require$3 = state,
    getHighWaterMark$1 = _require$3.getHighWaterMark;
var _require$codes$4 = errorsBrowser.codes,
    ERR_INVALID_ARG_TYPE$3 = _require$codes$4.ERR_INVALID_ARG_TYPE,
    ERR_STREAM_PUSH_AFTER_EOF = _require$codes$4.ERR_STREAM_PUSH_AFTER_EOF,
    ERR_METHOD_NOT_IMPLEMENTED$2 = _require$codes$4.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes$4.ERR_STREAM_UNSHIFT_AFTER_END_EVENT; // Lazy loaded to improve the startup performance.

var StringDecoder;
var createReadableStreamAsyncIterator;
var from;
inherits_browser.exports(Readable, Stream$1);
var errorOrDestroy$1 = destroyImpl$1.errorOrDestroy;
var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn); // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.

  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream, isDuplex) {
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.

  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Registry$4.Duplex; // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode; // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"

  this.highWaterMark = getHighWaterMark$1(this, options, 'readableHighWaterMark', isDuplex); // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()

  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false; // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.

  this.sync = true; // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.

  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;
  this.paused = true; // Should close be emitted on destroy. Defaults to true.

  this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'end' (and potentially 'finish')

  this.autoDestroy = !!options.autoDestroy; // has it been destroyed

  this.destroyed = false; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // the number of writers that are awaiting a drain event in .pipe()s

  this.awaitDrain = 0; // if true, a maybeReadMore has been scheduled

  this.readingMore = false;
  this.decoder = null;
  this.encoding = null;

  if (options.encoding) {
    if (!StringDecoder) StringDecoder = string_decoder.StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  if (!(this instanceof Readable)) return new Readable(options); // Checking for a Stream.Duplex instance is faster here instead of inside
  // the ReadableState constructor, at least with V8 6.5

  var isDuplex = this instanceof Registry$4.Duplex;
  this._readableState = new ReadableState(options, this, isDuplex); // legacy

  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream$1.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined) {
      return false;
    }

    return this._readableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
  }
});
Readable.prototype.destroy = destroyImpl$1.destroy;
Readable.prototype._undestroy = destroyImpl$1.undestroy;

Readable.prototype._destroy = function (err, cb) {
  cb(err);
}; // Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.


Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;

      if (encoding !== state.encoding) {
        chunk = Buffer$1.from(chunk, encoding);
        encoding = '';
      }

      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
}; // Unshift should *always* be something directly out of read()


Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  debug('readableAddChunk', chunk);
  var state = stream._readableState;

  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);

    if (er) {
      errorOrDestroy$1(stream, er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer$1.prototype) {
        chunk = _uint8ArrayToBuffer$1(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) errorOrDestroy$1(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        errorOrDestroy$1(stream, new ERR_STREAM_PUSH_AFTER_EOF());
      } else if (state.destroyed) {
        return false;
      } else {
        state.reading = false;

        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
      maybeReadMore(stream, state);
    }
  } // We can push more data if we are below the highWaterMark.
  // Also, if we have no data yet, we can stand some more bytes.
  // This is to work around cases where hwm=0, such as the repl.


  return !state.ended && (state.length < state.highWaterMark || state.length === 0);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    state.awaitDrain = 0;
    stream.emit('data', chunk);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
    if (state.needReadable) emitReadable(stream);
  }

  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;

  if (!_isUint8Array$1(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE$3('chunk', ['string', 'Buffer', 'Uint8Array'], chunk);
  }

  return er;
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
}; // backwards compatibility.


Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = string_decoder.StringDecoder;
  var decoder = new StringDecoder(enc);
  this._readableState.decoder = decoder; // If setEncoding(null), decoder.encoding equals utf8

  this._readableState.encoding = this._readableState.decoder.encoding; // Iterate over current buffer to convert already stored Buffers:

  var p = this._readableState.buffer.head;
  var content = '';

  while (p !== null) {
    content += decoder.write(p.data);
    p = p.next;
  }

  this._readableState.buffer.clear();

  if (content !== '') this._readableState.buffer.push(content);
  this._readableState.length = content.length;
  return this;
}; // Don't raise the hwm > 1GB


var MAX_HWM = 0x40000000;

function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    // TODO(ronag): Throw ERR_VALUE_OUT_OF_RANGE.
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }

  return n;
} // This function is designed to be inlinable, so please take care when making
// changes to the function body.


function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;

  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  } // If we're asking for more than the current hwm, then raise the hwm.


  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n; // Don't have enough

  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }

  return state.length;
} // you can override either this method, or the async _read(n) below.


Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;
  if (n !== 0) state.emittedReadable = false; // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.

  if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state); // if we've ended, and we're now clear, then finish it up.

  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  } // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.
  // if we need a readable event, then we need to do some reading.


  var doRead = state.needReadable;
  debug('need readable', doRead); // if we currently have less than the highWaterMark, then also read some

  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  } // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.


  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true; // if the length is currently zero, then we *need* a readable event.

    if (state.length === 0) state.needReadable = true; // call internal read method

    this._read(state.highWaterMark);

    state.sync = false; // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.

    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = state.length <= state.highWaterMark;
    n = 0;
  } else {
    state.length -= n;
    state.awaitDrain = 0;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true; // If we tried to read() past the EOF, then emit end on the next tick.

    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);
  return ret;
};

function onEofChunk(stream, state) {
  debug('onEofChunk');
  if (state.ended) return;

  if (state.decoder) {
    var chunk = state.decoder.end();

    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }

  state.ended = true;

  if (state.sync) {
    // if we are sync, wait until next tick to emit the data.
    // Otherwise we risk emitting data in the flow()
    // the readable code triggers during a read() call
    emitReadable(stream);
  } else {
    // emit 'readable' now to make sure it gets picked up.
    state.needReadable = false;

    if (!state.emittedReadable) {
      state.emittedReadable = true;
      emitReadable_(stream);
    }
  }
} // Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.


function emitReadable(stream) {
  var state = stream._readableState;
  debug('emitReadable', state.needReadable, state.emittedReadable);
  state.needReadable = false;

  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    browser$1$1.nextTick(emitReadable_, stream);
  }
}

function emitReadable_(stream) {
  var state = stream._readableState;
  debug('emitReadable_', state.destroyed, state.length, state.ended);

  if (!state.destroyed && (state.length || state.ended)) {
    stream.emit('readable');
    state.emittedReadable = false;
  } // The stream needs another readable event if
  // 1. It is not flowing, as the flow mechanism will take
  //    care of it.
  // 2. It is not ended.
  // 3. It is below the highWaterMark, so we can schedule
  //    another readable later.


  state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
  flow(stream);
} // at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.


function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    browser$1$1.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  // Attempt to read more data if we should.
  //
  // The conditions for reading more data are (one of):
  // - Not enough data buffered (state.length < state.highWaterMark). The loop
  //   is responsible for filling the buffer with enough data if such data
  //   is available. If highWaterMark is 0 and we are not in the flowing mode
  //   we should _not_ attempt to buffer any extra data. We'll get more data
  //   when the stream consumer calls read() instead.
  // - No data in the buffer, and the stream is in flowing mode. In this mode
  //   the loop below is responsible for ensuring read() is called. Failing to
  //   call read here would abort the flow and there's no other mechanism for
  //   continuing the flow if the stream consumer has just subscribed to the
  //   'data' event.
  //
  // In addition to the above conditions to keep reading data, the following
  // conditions prevent the data from being read:
  // - The stream has ended (state.ended).
  // - There is already a pending 'read' operation (state.reading). This is a
  //   case where the the stream has called the implementation defined _read()
  //   method, but they are processing the call asynchronously and have _not_
  //   called push() with new data. In this case we skip performing more
  //   read()s. The execution ends in this method again after the _read() ends
  //   up calling push() with more data.
  while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
    var len = state.length;
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length) // didn't get any data, stop spinning.
      break;
  }

  state.readingMore = false;
} // abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.


Readable.prototype._read = function (n) {
  errorOrDestroy$1(this, new ERR_METHOD_NOT_IMPLEMENTED$2('_read()'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;

    case 1:
      state.pipes = [state.pipes, dest];
      break;

    default:
      state.pipes.push(dest);
      break;
  }

  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== browser$1$1.stdout && dest !== browser$1$1.stderr;
  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) browser$1$1.nextTick(endFn);else src.once('end', endFn);
  dest.on('unpipe', onunpipe);

  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');

    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  } // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.


  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);
  var cleanedUp = false;

  function cleanup() {
    debug('cleanup'); // cleanup event handlers once the pipe is broken

    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);
    cleanedUp = true; // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.

    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  src.on('data', ondata);

  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    debug('dest.write', ret);

    if (ret === false) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', state.awaitDrain);
        state.awaitDrain++;
      }

      src.pause();
    }
  } // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.


  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) errorOrDestroy$1(dest, er);
  } // Make sure our error handler is attached before userland ones.


  prependListener(dest, 'error', onerror); // Both close and finish should trigger unpipe, but only once.

  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }

  dest.once('close', onclose);

  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }

  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  } // tell the dest that it's being piped to


  dest.emit('pipe', src); // start the flow if it hasn't been started already.

  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function pipeOnDrainFunctionResult() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;

    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = {
    hasUnpiped: false
  }; // if we're not piping anywhere, then do nothing.

  if (state.pipesCount === 0) return this; // just one destination.  most common case.

  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;
    if (!dest) dest = state.pipes; // got a match.

    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  } // slow case. multiple pipe destinations.


  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, {
        hasUnpiped: false
      });
    }

    return this;
  } // try to find the right one.


  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;
  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];
  dest.emit('unpipe', this, unpipeInfo);
  return this;
}; // set up data events if they are asked for
// Ensure readable listeners eventually get something


Readable.prototype.on = function (ev, fn) {
  var res = Stream$1.prototype.on.call(this, ev, fn);
  var state = this._readableState;

  if (ev === 'data') {
    // update readableListening so that resume() may be a no-op
    // a few lines down. This is needed to support once('readable').
    state.readableListening = this.listenerCount('readable') > 0; // Try start flowing on next tick if stream isn't explicitly paused

    if (state.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.flowing = false;
      state.emittedReadable = false;
      debug('on readable', state.length, state.reading);

      if (state.length) {
        emitReadable(this);
      } else if (!state.reading) {
        browser$1$1.nextTick(nReadingNextTick, this);
      }
    }
  }

  return res;
};

Readable.prototype.addListener = Readable.prototype.on;

Readable.prototype.removeListener = function (ev, fn) {
  var res = Stream$1.prototype.removeListener.call(this, ev, fn);

  if (ev === 'readable') {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    browser$1$1.nextTick(updateReadableListening, this);
  }

  return res;
};

Readable.prototype.removeAllListeners = function (ev) {
  var res = Stream$1.prototype.removeAllListeners.apply(this, arguments);

  if (ev === 'readable' || ev === undefined) {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    browser$1$1.nextTick(updateReadableListening, this);
  }

  return res;
};

function updateReadableListening(self) {
  var state = self._readableState;
  state.readableListening = self.listenerCount('readable') > 0;

  if (state.resumeScheduled && !state.paused) {
    // flowing needs to be set to true now, otherwise
    // the upcoming resume will not flow.
    state.flowing = true; // crude way to check if we should resume
  } else if (self.listenerCount('data') > 0) {
    self.resume();
  }
}

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
} // pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.


Readable.prototype.resume = function () {
  var state = this._readableState;

  if (!state.flowing) {
    debug('resume'); // we flow only if there is no one listening
    // for readable, but we still have to call
    // resume()

    state.flowing = !state.readableListening;
    resume(this, state);
  }

  state.paused = false;
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    browser$1$1.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  debug('resume', state.reading);

  if (!state.reading) {
    stream.read(0);
  }

  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);

  if (this._readableState.flowing !== false) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }

  this._readableState.paused = true;
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);

  while (state.flowing && stream.read() !== null) {
  }
} // wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.


Readable.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;
  stream.on('end', function () {
    debug('wrapped end');

    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });
  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk); // don't skip over falsy values in objectMode

    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);

    if (!ret) {
      paused = true;
      stream.pause();
    }
  }); // proxy all the other methods.
  // important when wrapping filters and duplexes.

  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function methodWrap(method) {
        return function methodWrapReturnFunction() {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  } // proxy certain important events.


  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  } // when we try to consume some more bytes, simply unpause the
  // underlying stream.


  this._read = function (n) {
    debug('wrapped _read', n);

    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

if (typeof Symbol === 'function') {
  Readable.prototype[Symbol.asyncIterator] = function () {
    if (createReadableStreamAsyncIterator === undefined) {
      createReadableStreamAsyncIterator = async_iterator;
    }

    return createReadableStreamAsyncIterator(this);
  };
}

Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.highWaterMark;
  }
});
Object.defineProperty(Readable.prototype, 'readableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState && this._readableState.buffer;
  }
});
Object.defineProperty(Readable.prototype, 'readableFlowing', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.flowing;
  },
  set: function set(state) {
    if (this._readableState) {
      this._readableState.flowing = state;
    }
  }
}); // exposed for testing purposes only.

Readable._fromList = fromList;
Object.defineProperty(Readable.prototype, 'readableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.length;
  }
}); // Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.

function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;
  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.first();else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = state.buffer.consume(n, state.decoder);
  }
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;
  debug('endReadable', state.endEmitted);

  if (!state.endEmitted) {
    state.ended = true;
    browser$1$1.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  debug('endReadableNT', state.endEmitted, state.length); // Check that we didn't get one last unshift.

  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');

    if (state.autoDestroy) {
      // In case of duplex streams we need a way to detect
      // if the writable side is ready for autoDestroy as well
      var wState = stream._writableState;

      if (!wState || wState.autoDestroy && wState.finished) {
        stream.destroy();
      }
    }
  }
}

if (typeof Symbol === 'function') {
  Readable.from = function (iterable, opts) {
    if (from === undefined) {
      from = fromBrowser;
    }

    return from(Readable, iterable, opts);
  };
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }

  return -1;
}

/**
 * Module exports.
 */

var browser = deprecate;
/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate(fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;

  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }

      warned = true;
    }

    return fn.apply(this, arguments);
  }

  return deprecated;
}
/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */


function config(name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!commonjsGlobal.localStorage) return false;
  } catch (_) {
    return false;
  }

  var val = commonjsGlobal.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

var Registry$3 = _registry;
Registry$3.Writable = Writable;
// there will be only 2 of these for each stream


function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;

  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/

/*</replacement>*/


Writable.WritableState = WritableState;
/*<replacement>*/

var internalUtil = {
  deprecate: browser
};
/*</replacement>*/

/*<replacement>*/

var Stream = streamBrowser;
/*</replacement>*/

var Buffer = buffer.Buffer;

var OurUint8Array = commonjsGlobal.Uint8Array || function () {};

function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}

function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

var destroyImpl = destroy_1;
var _require$2 = state,
    getHighWaterMark = _require$2.getHighWaterMark;
var _require$codes$3 = errorsBrowser.codes,
    ERR_INVALID_ARG_TYPE$2 = _require$codes$3.ERR_INVALID_ARG_TYPE,
    ERR_METHOD_NOT_IMPLEMENTED$1 = _require$codes$3.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_MULTIPLE_CALLBACK$1 = _require$codes$3.ERR_MULTIPLE_CALLBACK,
    ERR_STREAM_CANNOT_PIPE = _require$codes$3.ERR_STREAM_CANNOT_PIPE,
    ERR_STREAM_DESTROYED$1 = _require$codes$3.ERR_STREAM_DESTROYED,
    ERR_STREAM_NULL_VALUES = _require$codes$3.ERR_STREAM_NULL_VALUES,
    ERR_STREAM_WRITE_AFTER_END = _require$codes$3.ERR_STREAM_WRITE_AFTER_END,
    ERR_UNKNOWN_ENCODING = _require$codes$3.ERR_UNKNOWN_ENCODING;
var errorOrDestroy = destroyImpl.errorOrDestroy;
inherits_browser.exports(Writable, Stream);

function nop() {}

function WritableState(options, stream, isDuplex) {
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream,
  // e.g. options.readableObjectMode vs. options.writableObjectMode, etc.

  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Registry$3.Duplex; // object stream flag to indicate whether or not this stream
  // contains buffers or objects.

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode; // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()

  this.highWaterMark = getHighWaterMark(this, options, 'writableHighWaterMark', isDuplex); // if _final has been called

  this.finalCalled = false; // drain event flag.

  this.needDrain = false; // at the start of calling end()

  this.ending = false; // when end() has been called, and returned

  this.ended = false; // when 'finish' is emitted

  this.finished = false; // has it been destroyed

  this.destroyed = false; // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.

  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.

  this.length = 0; // a flag to see when we're in the middle of a write.

  this.writing = false; // when true all writes will be buffered until .uncork() call

  this.corked = 0; // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.

  this.sync = true; // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.

  this.bufferProcessing = false; // the callback that's passed to _write(chunk,cb)

  this.onwrite = function (er) {
    onwrite(stream, er);
  }; // the callback that the user supplies to write(chunk,encoding,cb)


  this.writecb = null; // the amount that is being written when _write is called.

  this.writelen = 0;
  this.bufferedRequest = null;
  this.lastBufferedRequest = null; // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted

  this.pendingcb = 0; // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams

  this.prefinished = false; // True if the error was already emitted and should not be thrown again

  this.errorEmitted = false; // Should close be emitted on destroy. Defaults to true.

  this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'finish' (and potentially 'end')

  this.autoDestroy = !!options.autoDestroy; // count buffered requests

  this.bufferedRequestCount = 0; // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two

  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];

  while (current) {
    out.push(current);
    current = current.next;
  }

  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function writableStateBufferGetter() {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})(); // Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.


var realHasInstance;

if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function value(object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;
      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function realHasInstance(object) {
    return object instanceof this;
  };
}

function Writable(options) {
  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.
  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  // Checking for a Stream.Duplex instance is faster here instead of inside
  // the WritableState constructor, at least with V8 6.5
  var isDuplex = this instanceof Registry$3.Duplex;
  if (!isDuplex && !realHasInstance.call(Writable, this)) return new Writable(options);
  this._writableState = new WritableState(options, this, isDuplex); // legacy.

  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;
    if (typeof options.writev === 'function') this._writev = options.writev;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
} // Otherwise people can pipe Writable streams, which is just wrong.


Writable.prototype.pipe = function () {
  errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
};

function writeAfterEnd(stream, cb) {
  var er = new ERR_STREAM_WRITE_AFTER_END(); // TODO: defer error events consistently everywhere, not just the cb

  errorOrDestroy(stream, er);
  browser$1$1.nextTick(cb, er);
} // Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.


function validChunk(stream, state, chunk, cb) {
  var er;

  if (chunk === null) {
    er = new ERR_STREAM_NULL_VALUES();
  } else if (typeof chunk !== 'string' && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE$2('chunk', ['string', 'Buffer'], chunk);
  }

  if (er) {
    errorOrDestroy(stream, er);
    browser$1$1.nextTick(cb, er);
    return false;
  }

  return true;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  var isBuf = !state.objectMode && _isUint8Array(chunk);

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;
  if (typeof cb !== 'function') cb = nop;
  if (state.ending) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }
  return ret;
};

Writable.prototype.cork = function () {
  this._writableState.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;
    if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

Object.defineProperty(Writable.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }

  return chunk;
}

Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
}); // if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.

function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);

    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }

  var len = state.objectMode ? 1 : chunk.length;
  state.length += len;
  var ret = state.length < state.highWaterMark; // we must ensure that previous needDrain will not be reset to false.

  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };

    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }

    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED$1('write'));else if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    browser$1$1.nextTick(cb, er); // this can emit finish, and it will always happen
    // after error

    browser$1$1.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    errorOrDestroy(stream, er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    errorOrDestroy(stream, er); // this can emit finish, but finish must
    // always follow error

    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;
  if (typeof cb !== 'function') throw new ERR_MULTIPLE_CALLBACK$1();
  onwriteStateUpdate(state);
  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state) || stream.destroyed;

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      browser$1$1.nextTick(afterWrite, stream, state, finished, cb);
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
} // Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.


function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
} // if there's something in the buffer waiting, then process it


function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;
    var count = 0;
    var allBuffers = true;

    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }

    buffer.allBuffers = allBuffers;
    doWrite(stream, state, true, state.length, buffer, '', holder.finish); // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite

    state.pendingcb++;
    state.lastBufferedRequest = null;

    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }

    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;
      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--; // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.

      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED$1('_write()'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding); // .end() fully uncorks

  if (state.corked) {
    state.corked = 1;
    this.uncork();
  } // ignore unnecessary end() calls.


  if (!state.ending) endWritable(this, state, cb);
  return this;
};

Object.defineProperty(Writable.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
});

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;

    if (err) {
      errorOrDestroy(stream, err);
    }

    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}

function prefinish$1(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function' && !state.destroyed) {
      state.pendingcb++;
      state.finalCalled = true;
      browser$1$1.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);

  if (need) {
    prefinish$1(stream, state);

    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');

      if (state.autoDestroy) {
        // In case of duplex streams we need a way to detect
        // if the readable side is ready for autoDestroy as well
        var rState = stream._readableState;

        if (!rState || rState.autoDestroy && rState.endEmitted) {
          stream.destroy();
        }
      }
    }
  }

  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);

  if (cb) {
    if (state.finished) browser$1$1.nextTick(cb);else stream.once('finish', cb);
  }

  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;

  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  } // reuse the free corkReq.


  state.corkedRequestsFree.next = corkReq;
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._writableState === undefined) {
      return false;
    }

    return this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._writableState.destroyed = value;
  }
});
Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;

Writable.prototype._destroy = function (err, cb) {
  cb(err);
};

/*<replacement>*/


var objectKeys$1 = Object.keys || function (obj) {
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  return keys;
};
/*</replacement>*/


var Registry$2 = _registry;
Registry$2.Duplex = Duplex;
inherits_browser.exports(Duplex, Registry$2.Readable);
{
  // Allow the keys array to be GC'ed.
  var keys$1 = objectKeys$1(Registry$2.Writable.prototype);

  for (var v = 0; v < keys$1.length; v++) {
    var method = keys$1[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Registry$2.Writable.prototype[method];
  }
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);
  Registry$2.Readable.call(this, options);
  Registry$2.Writable.call(this, options);
  this.allowHalfOpen = true;

  if (options) {
    if (options.readable === false) this.readable = false;
    if (options.writable === false) this.writable = false;

    if (options.allowHalfOpen === false) {
      this.allowHalfOpen = false;
      this.once('end', onend);
    }
  }
}

Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
});
Object.defineProperty(Duplex.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});
Object.defineProperty(Duplex.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
}); // the no-half-open enforcer

function onend() {
  // If the writable side ended, then we're ok.
  if (this._writableState.ended) return; // no more data can be written.
  // But allow more writes to happen in this tick.

  browser$1$1.nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }

    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

var Registry$1 = _registry;
Registry$1.Transform = Transform$1;
var _require$codes$2 = errorsBrowser.codes,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes$2.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_MULTIPLE_CALLBACK = _require$codes$2.ERR_MULTIPLE_CALLBACK,
    ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes$2.ERR_TRANSFORM_ALREADY_TRANSFORMING,
    ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes$2.ERR_TRANSFORM_WITH_LENGTH_0;
inherits_browser.exports(Transform$1, Registry$1.Duplex);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;
  var cb = ts.writecb;

  if (cb === null) {
    return this.emit('error', new ERR_MULTIPLE_CALLBACK());
  }

  ts.writechunk = null;
  ts.writecb = null;
  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);
  cb(er);
  var rs = this._readableState;
  rs.reading = false;

  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform$1(options) {
  if (!(this instanceof Transform$1)) return new Transform$1(options);
  Registry$1.Duplex.call(this, options);
  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  }; // start out asking for a readable event once data is transformed.

  this._readableState.needReadable = true; // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.

  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;
    if (typeof options.flush === 'function') this._flush = options.flush;
  } // When the writable side finishes, then flush out anything remaining.


  this.on('prefinish', prefinish);
}

function prefinish() {
  var _this = this;

  if (typeof this._flush === 'function' && !this._readableState.destroyed) {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}

Transform$1.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Registry$1.Duplex.prototype.push.call(this, chunk, encoding);
}; // This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.


Transform$1.prototype._transform = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_transform()'));
};

Transform$1.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;

  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
}; // Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.


Transform$1.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && !ts.transforming) {
    ts.transforming = true;

    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform$1.prototype._destroy = function (err, cb) {
  Registry$1.Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);
  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data); // TODO(BridgeAR): Write a test for these two error cases
  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided

  if (stream._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0();
  if (stream._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
  return stream.push(null);
}

var Registry = _registry;
Registry.PassThrough = PassThrough;
inherits_browser.exports(PassThrough, Registry.Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);
  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

var eos;

function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;
    callback.apply(void 0, arguments);
  };
}

var _require$codes$1 = errorsBrowser.codes,
    ERR_MISSING_ARGS$1 = _require$codes$1.ERR_MISSING_ARGS,
    ERR_STREAM_DESTROYED = _require$codes$1.ERR_STREAM_DESTROYED;

function noop(err) {
  // Rethrow the error if it exists to avoid swallowing it
  if (err) throw err;
}

function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}

function destroyer(stream, reading, writing, callback) {
  callback = once(callback);
  var closed = false;
  stream.on('close', function () {
    closed = true;
  });
  if (eos === undefined) eos = endOfStream;
  eos(stream, {
    readable: reading,
    writable: writing
  }, function (err) {
    if (err) return callback(err);
    closed = true;
    callback();
  });
  var destroyed = false;
  return function (err) {
    if (closed) return;
    if (destroyed) return;
    destroyed = true; // request.destroy just do .end - .abort is what we want

    if (isRequest(stream)) return stream.abort();
    if (typeof stream.destroy === 'function') return stream.destroy();
    callback(err || new ERR_STREAM_DESTROYED('pipe'));
  };
}

function call(fn) {
  fn();
}

function pipe(from, to) {
  return from.pipe(to);
}

function popCallback(streams) {
  if (!streams.length) return noop;
  if (typeof streams[streams.length - 1] !== 'function') return noop;
  return streams.pop();
}

function pipeline() {
  for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
    streams[_key] = arguments[_key];
  }

  var callback = popCallback(streams);
  if (Array.isArray(streams[0])) streams = streams[0];

  if (streams.length < 2) {
    throw new ERR_MISSING_ARGS$1('streams');
  }

  var error;
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1;
    var writing = i > 0;
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err;
      if (err) destroys.forEach(call);
      if (reading) return;
      destroys.forEach(call);
      callback(error);
    });
  });
  return streams.reduce(pipe);
}

var pipeline_1 = pipeline;

(function (module, exports) {
  var Registry = _registry;
  exports = module.exports = Registry.Readable;
  exports.Stream = Registry.Readable;
  exports.Readable = Registry.Readable;
  exports.Writable = Registry.Writable;
  exports.Duplex = Registry.Duplex;
  exports.Transform = Registry.Transform;
  exports.PassThrough = Registry.PassThrough;
  exports.finished = endOfStream;
  exports.pipeline = pipeline_1;
})(readableBrowser, readableBrowser.exports);

var stream = readableBrowser.exports;

var lib = {};

var binding = {};

var assert$2 = {exports: {}};

var errors = {};

var util$1 = {};

var types = {};

/* eslint complexity: [2, 18], max-statements: [2, 33] */


var shams$1 = function hasSymbols() {
  if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') {
    return false;
  }

  if (typeof Symbol.iterator === 'symbol') {
    return true;
  }

  var obj = {};
  var sym = Symbol('test');
  var symObj = Object(sym);

  if (typeof sym === 'string') {
    return false;
  }

  if (Object.prototype.toString.call(sym) !== '[object Symbol]') {
    return false;
  }

  if (Object.prototype.toString.call(symObj) !== '[object Symbol]') {
    return false;
  } // temp disabled per https://github.com/ljharb/object.assign/issues/17
  // if (sym instanceof Symbol) { return false; }
  // temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
  // if (!(symObj instanceof Symbol)) { return false; }
  // if (typeof Symbol.prototype.toString !== 'function') { return false; }
  // if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }


  var symVal = 42;
  obj[sym] = symVal;

  for (sym in obj) {
    return false;
  } // eslint-disable-line no-restricted-syntax, no-unreachable-loop


  if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) {
    return false;
  }

  if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) {
    return false;
  }

  var syms = Object.getOwnPropertySymbols(obj);

  if (syms.length !== 1 || syms[0] !== sym) {
    return false;
  }

  if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
    return false;
  }

  if (typeof Object.getOwnPropertyDescriptor === 'function') {
    var descriptor = Object.getOwnPropertyDescriptor(obj, sym);

    if (descriptor.value !== symVal || descriptor.enumerable !== true) {
      return false;
    }
  }

  return true;
};

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = shams$1;

var hasSymbols$3 = function hasNativeSymbols() {
  if (typeof origSymbol !== 'function') {
    return false;
  }

  if (typeof Symbol !== 'function') {
    return false;
  }

  if (typeof origSymbol('foo') !== 'symbol') {
    return false;
  }

  if (typeof Symbol('bar') !== 'symbol') {
    return false;
  }

  return hasSymbolSham();
};

/* eslint no-invalid-this: 1 */


var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice$1 = Array.prototype.slice;
var toStr$4 = Object.prototype.toString;
var funcType = '[object Function]';

var implementation$8 = function bind(that) {
  var target = this;

  if (typeof target !== 'function' || toStr$4.call(target) !== funcType) {
    throw new TypeError(ERROR_MESSAGE + target);
  }

  var args = slice$1.call(arguments, 1);
  var bound;

  var binder = function binder() {
    if (this instanceof bound) {
      var result = target.apply(this, args.concat(slice$1.call(arguments)));

      if (Object(result) === result) {
        return result;
      }

      return this;
    } else {
      return target.apply(that, args.concat(slice$1.call(arguments)));
    }
  };

  var boundLength = Math.max(0, target.length - args.length);
  var boundArgs = [];

  for (var i = 0; i < boundLength; i++) {
    boundArgs.push('$' + i);
  }

  bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

  if (target.prototype) {
    var Empty = function Empty() {};

    Empty.prototype = target.prototype;
    bound.prototype = new Empty();
    Empty.prototype = null;
  }

  return bound;
};

var implementation$7 = implementation$8;
var functionBind = Function.prototype.bind || implementation$7;

var bind$1 = functionBind;
var src = bind$1.call(Function.call, Object.prototype.hasOwnProperty);

var undefined$1;
var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError; // eslint-disable-next-line consistent-return

var getEvalledConstructor = function getEvalledConstructor(expressionSyntax) {
  try {
    return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
  } catch (e) {}
};

var $gOPD$1 = Object.getOwnPropertyDescriptor;

if ($gOPD$1) {
  try {
    $gOPD$1({}, '');
  } catch (e) {
    $gOPD$1 = null; // this is IE 8, which has a broken gOPD
  }
}

var throwTypeError = function throwTypeError() {
  throw new $TypeError();
};

var ThrowTypeError = $gOPD$1 ? function () {
  try {
    // eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
    arguments.callee; // IE 8 does not throw here

    return throwTypeError;
  } catch (calleeThrows) {
    try {
      // IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
      return $gOPD$1(arguments, 'callee').get;
    } catch (gOPDthrows) {
      return throwTypeError;
    }
  }
}() : throwTypeError;
var hasSymbols$2 = hasSymbols$3();

var getProto$1 = Object.getPrototypeOf || function (x) {
  return x.__proto__;
}; // eslint-disable-line no-proto


var needsEval = {};
var TypedArray = typeof Uint8Array === 'undefined' ? undefined$1 : getProto$1(Uint8Array);
var INTRINSICS = {
  '%AggregateError%': typeof AggregateError === 'undefined' ? undefined$1 : AggregateError,
  '%Array%': Array,
  '%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined$1 : ArrayBuffer,
  '%ArrayIteratorPrototype%': hasSymbols$2 ? getProto$1([][Symbol.iterator]()) : undefined$1,
  '%AsyncFromSyncIteratorPrototype%': undefined$1,
  '%AsyncFunction%': needsEval,
  '%AsyncGenerator%': needsEval,
  '%AsyncGeneratorFunction%': needsEval,
  '%AsyncIteratorPrototype%': needsEval,
  '%Atomics%': typeof Atomics === 'undefined' ? undefined$1 : Atomics,
  '%BigInt%': typeof BigInt === 'undefined' ? undefined$1 : BigInt,
  '%Boolean%': Boolean,
  '%DataView%': typeof DataView === 'undefined' ? undefined$1 : DataView,
  '%Date%': Date,
  '%decodeURI%': decodeURI,
  '%decodeURIComponent%': decodeURIComponent,
  '%encodeURI%': encodeURI,
  '%encodeURIComponent%': encodeURIComponent,
  '%Error%': Error,
  '%eval%': eval,
  // eslint-disable-line no-eval
  '%EvalError%': EvalError,
  '%Float32Array%': typeof Float32Array === 'undefined' ? undefined$1 : Float32Array,
  '%Float64Array%': typeof Float64Array === 'undefined' ? undefined$1 : Float64Array,
  '%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined$1 : FinalizationRegistry,
  '%Function%': $Function,
  '%GeneratorFunction%': needsEval,
  '%Int8Array%': typeof Int8Array === 'undefined' ? undefined$1 : Int8Array,
  '%Int16Array%': typeof Int16Array === 'undefined' ? undefined$1 : Int16Array,
  '%Int32Array%': typeof Int32Array === 'undefined' ? undefined$1 : Int32Array,
  '%isFinite%': isFinite,
  '%isNaN%': isNaN,
  '%IteratorPrototype%': hasSymbols$2 ? getProto$1(getProto$1([][Symbol.iterator]())) : undefined$1,
  '%JSON%': typeof JSON === 'object' ? JSON : undefined$1,
  '%Map%': typeof Map === 'undefined' ? undefined$1 : Map,
  '%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols$2 ? undefined$1 : getProto$1(new Map()[Symbol.iterator]()),
  '%Math%': Math,
  '%Number%': Number,
  '%Object%': Object,
  '%parseFloat%': parseFloat,
  '%parseInt%': parseInt,
  '%Promise%': typeof Promise === 'undefined' ? undefined$1 : Promise,
  '%Proxy%': typeof Proxy === 'undefined' ? undefined$1 : Proxy,
  '%RangeError%': RangeError,
  '%ReferenceError%': ReferenceError,
  '%Reflect%': typeof Reflect === 'undefined' ? undefined$1 : Reflect,
  '%RegExp%': RegExp,
  '%Set%': typeof Set === 'undefined' ? undefined$1 : Set,
  '%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols$2 ? undefined$1 : getProto$1(new Set()[Symbol.iterator]()),
  '%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined$1 : SharedArrayBuffer,
  '%String%': String,
  '%StringIteratorPrototype%': hasSymbols$2 ? getProto$1(''[Symbol.iterator]()) : undefined$1,
  '%Symbol%': hasSymbols$2 ? Symbol : undefined$1,
  '%SyntaxError%': $SyntaxError,
  '%ThrowTypeError%': ThrowTypeError,
  '%TypedArray%': TypedArray,
  '%TypeError%': $TypeError,
  '%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined$1 : Uint8Array,
  '%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined$1 : Uint8ClampedArray,
  '%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined$1 : Uint16Array,
  '%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined$1 : Uint32Array,
  '%URIError%': URIError,
  '%WeakMap%': typeof WeakMap === 'undefined' ? undefined$1 : WeakMap,
  '%WeakRef%': typeof WeakRef === 'undefined' ? undefined$1 : WeakRef,
  '%WeakSet%': typeof WeakSet === 'undefined' ? undefined$1 : WeakSet
};

var doEval = function doEval(name) {
  var value;

  if (name === '%AsyncFunction%') {
    value = getEvalledConstructor('async function () {}');
  } else if (name === '%GeneratorFunction%') {
    value = getEvalledConstructor('function* () {}');
  } else if (name === '%AsyncGeneratorFunction%') {
    value = getEvalledConstructor('async function* () {}');
  } else if (name === '%AsyncGenerator%') {
    var fn = doEval('%AsyncGeneratorFunction%');

    if (fn) {
      value = fn.prototype;
    }
  } else if (name === '%AsyncIteratorPrototype%') {
    var gen = doEval('%AsyncGenerator%');

    if (gen) {
      value = getProto$1(gen.prototype);
    }
  }

  INTRINSICS[name] = value;
  return value;
};

var LEGACY_ALIASES = {
  '%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
  '%ArrayPrototype%': ['Array', 'prototype'],
  '%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
  '%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
  '%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
  '%ArrayProto_values%': ['Array', 'prototype', 'values'],
  '%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
  '%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
  '%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
  '%BooleanPrototype%': ['Boolean', 'prototype'],
  '%DataViewPrototype%': ['DataView', 'prototype'],
  '%DatePrototype%': ['Date', 'prototype'],
  '%ErrorPrototype%': ['Error', 'prototype'],
  '%EvalErrorPrototype%': ['EvalError', 'prototype'],
  '%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
  '%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
  '%FunctionPrototype%': ['Function', 'prototype'],
  '%Generator%': ['GeneratorFunction', 'prototype'],
  '%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
  '%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
  '%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
  '%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
  '%JSONParse%': ['JSON', 'parse'],
  '%JSONStringify%': ['JSON', 'stringify'],
  '%MapPrototype%': ['Map', 'prototype'],
  '%NumberPrototype%': ['Number', 'prototype'],
  '%ObjectPrototype%': ['Object', 'prototype'],
  '%ObjProto_toString%': ['Object', 'prototype', 'toString'],
  '%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
  '%PromisePrototype%': ['Promise', 'prototype'],
  '%PromiseProto_then%': ['Promise', 'prototype', 'then'],
  '%Promise_all%': ['Promise', 'all'],
  '%Promise_reject%': ['Promise', 'reject'],
  '%Promise_resolve%': ['Promise', 'resolve'],
  '%RangeErrorPrototype%': ['RangeError', 'prototype'],
  '%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
  '%RegExpPrototype%': ['RegExp', 'prototype'],
  '%SetPrototype%': ['Set', 'prototype'],
  '%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
  '%StringPrototype%': ['String', 'prototype'],
  '%SymbolPrototype%': ['Symbol', 'prototype'],
  '%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
  '%TypedArrayPrototype%': ['TypedArray', 'prototype'],
  '%TypeErrorPrototype%': ['TypeError', 'prototype'],
  '%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
  '%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
  '%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
  '%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
  '%URIErrorPrototype%': ['URIError', 'prototype'],
  '%WeakMapPrototype%': ['WeakMap', 'prototype'],
  '%WeakSetPrototype%': ['WeakSet', 'prototype']
};
var bind = functionBind;
var hasOwn$1 = src;
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);
/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */

var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g;
/** Used to match backslashes in property paths. */

var stringToPath = function stringToPath(string) {
  var first = $strSlice(string, 0, 1);
  var last = $strSlice(string, -1);

  if (first === '%' && last !== '%') {
    throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
  } else if (last === '%' && first !== '%') {
    throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
  }

  var result = [];
  $replace(string, rePropName, function (match, number, quote, subString) {
    result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
  });
  return result;
};
/* end adaptation */


var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
  var intrinsicName = name;
  var alias;

  if (hasOwn$1(LEGACY_ALIASES, intrinsicName)) {
    alias = LEGACY_ALIASES[intrinsicName];
    intrinsicName = '%' + alias[0] + '%';
  }

  if (hasOwn$1(INTRINSICS, intrinsicName)) {
    var value = INTRINSICS[intrinsicName];

    if (value === needsEval) {
      value = doEval(intrinsicName);
    }

    if (typeof value === 'undefined' && !allowMissing) {
      throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
    }

    return {
      alias: alias,
      name: intrinsicName,
      value: value
    };
  }

  throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

var getIntrinsic = function GetIntrinsic(name, allowMissing) {
  if (typeof name !== 'string' || name.length === 0) {
    throw new $TypeError('intrinsic name must be a non-empty string');
  }

  if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
    throw new $TypeError('"allowMissing" argument must be a boolean');
  }

  var parts = stringToPath(name);
  var intrinsicBaseName = parts.length > 0 ? parts[0] : '';
  var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
  var intrinsicRealName = intrinsic.name;
  var value = intrinsic.value;
  var skipFurtherCaching = false;
  var alias = intrinsic.alias;

  if (alias) {
    intrinsicBaseName = alias[0];
    $spliceApply(parts, $concat([0, 1], alias));
  }

  for (var i = 1, isOwn = true; i < parts.length; i += 1) {
    var part = parts[i];
    var first = $strSlice(part, 0, 1);
    var last = $strSlice(part, -1);

    if ((first === '"' || first === "'" || first === '`' || last === '"' || last === "'" || last === '`') && first !== last) {
      throw new $SyntaxError('property names with quotes must have matching quotes');
    }

    if (part === 'constructor' || !isOwn) {
      skipFurtherCaching = true;
    }

    intrinsicBaseName += '.' + part;
    intrinsicRealName = '%' + intrinsicBaseName + '%';

    if (hasOwn$1(INTRINSICS, intrinsicRealName)) {
      value = INTRINSICS[intrinsicRealName];
    } else if (value != null) {
      if (!(part in value)) {
        if (!allowMissing) {
          throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
        }

        return void undefined$1;
      }

      if ($gOPD$1 && i + 1 >= parts.length) {
        var desc = $gOPD$1(value, part);
        isOwn = !!desc; // By convention, when a data property is converted to an accessor
        // property to emulate a data property that does not suffer from
        // the override mistake, that accessor's getter is marked with
        // an `originalValue` property. Here, when we detect this, we
        // uphold the illusion by pretending to see that original data
        // property, i.e., returning the value rather than the getter
        // itself.

        if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
          value = desc.get;
        } else {
          value = value[part];
        }
      } else {
        isOwn = hasOwn$1(value, part);
        value = value[part];
      }

      if (isOwn && !skipFurtherCaching) {
        INTRINSICS[intrinsicRealName] = value;
      }
    }
  }

  return value;
};

var callBind$3 = {exports: {}};

(function (module) {

  var bind = functionBind;
  var GetIntrinsic = getIntrinsic;
  var $apply = GetIntrinsic('%Function.prototype.apply%');
  var $call = GetIntrinsic('%Function.prototype.call%');
  var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);
  var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
  var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
  var $max = GetIntrinsic('%Math.max%');

  if ($defineProperty) {
    try {
      $defineProperty({}, 'a', {
        value: 1
      });
    } catch (e) {
      // IE 8 has a broken defineProperty
      $defineProperty = null;
    }
  }

  module.exports = function callBind(originalFunction) {
    var func = $reflectApply(bind, $call, arguments);

    if ($gOPD && $defineProperty) {
      var desc = $gOPD(func, 'length');

      if (desc.configurable) {
        // original length, plus the receiver, minus any additional arguments (after the receiver)
        $defineProperty(func, 'length', {
          value: 1 + $max(0, originalFunction.length - (arguments.length - 1))
        });
      }
    }

    return func;
  };

  var applyBind = function applyBind() {
    return $reflectApply(bind, $apply, arguments);
  };

  if ($defineProperty) {
    $defineProperty(module.exports, 'apply', {
      value: applyBind
    });
  } else {
    module.exports.apply = applyBind;
  }
})(callBind$3);

var GetIntrinsic$1 = getIntrinsic;
var callBind$2 = callBind$3.exports;
var $indexOf$1 = callBind$2(GetIntrinsic$1('String.prototype.indexOf'));

var callBound$3 = function callBoundIntrinsic(name, allowMissing) {
  var intrinsic = GetIntrinsic$1(name, !!allowMissing);

  if (typeof intrinsic === 'function' && $indexOf$1(name, '.prototype.') > -1) {
    return callBind$2(intrinsic);
  }

  return intrinsic;
};

var hasToStringTag$3 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
var callBound$2 = callBound$3;
var $toString$2 = callBound$2('Object.prototype.toString');

var isStandardArguments = function isArguments(value) {
  if (hasToStringTag$3 && value && typeof value === 'object' && Symbol.toStringTag in value) {
    return false;
  }

  return $toString$2(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
  if (isStandardArguments(value)) {
    return true;
  }

  return value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && $toString$2(value) !== '[object Array]' && $toString$2(value.callee) === '[object Function]';
};

var supportsStandardArguments = function () {
  return isStandardArguments(arguments);
}();

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

var isArguments$1 = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

var hasSymbols$1 = shams$1;

var shams = function hasToStringTagShams() {
  return hasSymbols$1() && !!Symbol.toStringTag;
};

var toStr$3 = Object.prototype.toString;
var fnToStr = Function.prototype.toString;
var isFnRegex = /^\s*(?:function)?\*/;
var hasToStringTag$2 = shams();
var getProto = Object.getPrototypeOf;

var getGeneratorFunc = function getGeneratorFunc() {
  // eslint-disable-line consistent-return
  if (!hasToStringTag$2) {
    return false;
  }

  try {
    return Function('return function*() {}')();
  } catch (e) {}
};

var GeneratorFunction;

var isGeneratorFunction = function isGeneratorFunction(fn) {
  if (typeof fn !== 'function') {
    return false;
  }

  if (isFnRegex.test(fnToStr.call(fn))) {
    return true;
  }

  if (!hasToStringTag$2) {
    var str = toStr$3.call(fn);
    return str === '[object GeneratorFunction]';
  }

  if (!getProto) {
    return false;
  }

  if (typeof GeneratorFunction === 'undefined') {
    var generatorFunc = getGeneratorFunc();
    GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
  }

  return getProto(fn) === GeneratorFunction;
};

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

var foreach = function forEach(obj, fn, ctx) {
  if (toString.call(fn) !== '[object Function]') {
    throw new TypeError('iterator must be a function');
  }

  var l = obj.length;

  if (l === +l) {
    for (var i = 0; i < l; i++) {
      fn.call(ctx, obj[i], i, obj);
    }
  } else {
    for (var k in obj) {
      if (hasOwn.call(obj, k)) {
        fn.call(ctx, obj[k], k, obj);
      }
    }
  }
};

var possibleNames = ['BigInt64Array', 'BigUint64Array', 'Float32Array', 'Float64Array', 'Int16Array', 'Int32Array', 'Int8Array', 'Uint16Array', 'Uint32Array', 'Uint8Array', 'Uint8ClampedArray'];
var g$2 = typeof globalThis === 'undefined' ? commonjsGlobal : globalThis;

var availableTypedArrays$2 = function availableTypedArrays() {
  var out = [];

  for (var i = 0; i < possibleNames.length; i++) {
    if (typeof g$2[possibleNames[i]] === 'function') {
      out[out.length] = possibleNames[i];
    }
  }

  return out;
};

var GetIntrinsic = getIntrinsic;
var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);

if ($gOPD) {
  try {
    $gOPD([], 'length');
  } catch (e) {
    // IE 8 has a broken gOPD
    $gOPD = null;
  }
}

var getOwnPropertyDescriptor = $gOPD;

var forEach$1 = foreach;
var availableTypedArrays$1 = availableTypedArrays$2;
var callBound$1 = callBound$3;
var $toString$1 = callBound$1('Object.prototype.toString');
var hasToStringTag$1 = shams();
var g$1 = typeof globalThis === 'undefined' ? commonjsGlobal : globalThis;
var typedArrays$1 = availableTypedArrays$1();

var $indexOf = callBound$1('Array.prototype.indexOf', true) || function indexOf(array, value) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i] === value) {
      return i;
    }
  }

  return -1;
};

var $slice$1 = callBound$1('String.prototype.slice');
var toStrTags$1 = {};
var gOPD$1 = getOwnPropertyDescriptor;
var getPrototypeOf$1 = Object.getPrototypeOf; // require('getprototypeof');

if (hasToStringTag$1 && gOPD$1 && getPrototypeOf$1) {
  forEach$1(typedArrays$1, function (typedArray) {
    var arr = new g$1[typedArray]();

    if (Symbol.toStringTag in arr) {
      var proto = getPrototypeOf$1(arr);
      var descriptor = gOPD$1(proto, Symbol.toStringTag);

      if (!descriptor) {
        var superProto = getPrototypeOf$1(proto);
        descriptor = gOPD$1(superProto, Symbol.toStringTag);
      }

      toStrTags$1[typedArray] = descriptor.get;
    }
  });
}

var tryTypedArrays$1 = function tryAllTypedArrays(value) {
  var anyTrue = false;
  forEach$1(toStrTags$1, function (getter, typedArray) {
    if (!anyTrue) {
      try {
        anyTrue = getter.call(value) === typedArray;
      } catch (e) {
        /**/
      }
    }
  });
  return anyTrue;
};

var isTypedArray$1 = function isTypedArray(value) {
  if (!value || typeof value !== 'object') {
    return false;
  }

  if (!hasToStringTag$1 || !(Symbol.toStringTag in value)) {
    var tag = $slice$1($toString$1(value), 8, -1);
    return $indexOf(typedArrays$1, tag) > -1;
  }

  if (!gOPD$1) {
    return false;
  }

  return tryTypedArrays$1(value);
};

var forEach = foreach;
var availableTypedArrays = availableTypedArrays$2;
var callBound = callBound$3;
var $toString = callBound('Object.prototype.toString');
var hasToStringTag = shams();
var g = typeof globalThis === 'undefined' ? commonjsGlobal : globalThis;
var typedArrays = availableTypedArrays();
var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');

if (hasToStringTag && gOPD && getPrototypeOf) {
  forEach(typedArrays, function (typedArray) {
    if (typeof g[typedArray] === 'function') {
      var arr = new g[typedArray]();

      if (Symbol.toStringTag in arr) {
        var proto = getPrototypeOf(arr);
        var descriptor = gOPD(proto, Symbol.toStringTag);

        if (!descriptor) {
          var superProto = getPrototypeOf(proto);
          descriptor = gOPD(superProto, Symbol.toStringTag);
        }

        toStrTags[typedArray] = descriptor.get;
      }
    }
  });
}

var tryTypedArrays = function tryAllTypedArrays(value) {
  var foundName = false;
  forEach(toStrTags, function (getter, typedArray) {
    if (!foundName) {
      try {
        var name = getter.call(value);

        if (name === typedArray) {
          foundName = name;
        }
      } catch (e) {}
    }
  });
  return foundName;
};

var isTypedArray = isTypedArray$1;

var whichTypedArray = function whichTypedArray(value) {
  if (!isTypedArray(value)) {
    return false;
  }

  if (!hasToStringTag || !(Symbol.toStringTag in value)) {
    return $slice($toString(value), 8, -1);
  }

  return tryTypedArrays(value);
};

(function (exports) {

  var isArgumentsObject = isArguments$1;
  var isGeneratorFunction$1 = isGeneratorFunction;
  var whichTypedArray$1 = whichTypedArray;
  var isTypedArray = isTypedArray$1;

  function uncurryThis(f) {
    return f.call.bind(f);
  }

  var BigIntSupported = typeof BigInt !== 'undefined';
  var SymbolSupported = typeof Symbol !== 'undefined';
  var ObjectToString = uncurryThis(Object.prototype.toString);
  var numberValue = uncurryThis(Number.prototype.valueOf);
  var stringValue = uncurryThis(String.prototype.valueOf);
  var booleanValue = uncurryThis(Boolean.prototype.valueOf);

  if (BigIntSupported) {
    var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
  }

  if (SymbolSupported) {
    var symbolValue = uncurryThis(Symbol.prototype.valueOf);
  }

  function checkBoxedPrimitive(value, prototypeValueOf) {
    if (typeof value !== 'object') {
      return false;
    }

    try {
      prototypeValueOf(value);
      return true;
    } catch (e) {
      return false;
    }
  }

  exports.isArgumentsObject = isArgumentsObject;
  exports.isGeneratorFunction = isGeneratorFunction$1;
  exports.isTypedArray = isTypedArray; // Taken from here and modified for better browser support
  // https://github.com/sindresorhus/p-is-promise/blob/cda35a513bda03f977ad5cde3a079d237e82d7ef/index.js

  function isPromise(input) {
    return typeof Promise !== 'undefined' && input instanceof Promise || input !== null && typeof input === 'object' && typeof input.then === 'function' && typeof input.catch === 'function';
  }

  exports.isPromise = isPromise;

  function isArrayBufferView(value) {
    if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
      return ArrayBuffer.isView(value);
    }

    return isTypedArray(value) || isDataView(value);
  }

  exports.isArrayBufferView = isArrayBufferView;

  function isUint8Array(value) {
    return whichTypedArray$1(value) === 'Uint8Array';
  }

  exports.isUint8Array = isUint8Array;

  function isUint8ClampedArray(value) {
    return whichTypedArray$1(value) === 'Uint8ClampedArray';
  }

  exports.isUint8ClampedArray = isUint8ClampedArray;

  function isUint16Array(value) {
    return whichTypedArray$1(value) === 'Uint16Array';
  }

  exports.isUint16Array = isUint16Array;

  function isUint32Array(value) {
    return whichTypedArray$1(value) === 'Uint32Array';
  }

  exports.isUint32Array = isUint32Array;

  function isInt8Array(value) {
    return whichTypedArray$1(value) === 'Int8Array';
  }

  exports.isInt8Array = isInt8Array;

  function isInt16Array(value) {
    return whichTypedArray$1(value) === 'Int16Array';
  }

  exports.isInt16Array = isInt16Array;

  function isInt32Array(value) {
    return whichTypedArray$1(value) === 'Int32Array';
  }

  exports.isInt32Array = isInt32Array;

  function isFloat32Array(value) {
    return whichTypedArray$1(value) === 'Float32Array';
  }

  exports.isFloat32Array = isFloat32Array;

  function isFloat64Array(value) {
    return whichTypedArray$1(value) === 'Float64Array';
  }

  exports.isFloat64Array = isFloat64Array;

  function isBigInt64Array(value) {
    return whichTypedArray$1(value) === 'BigInt64Array';
  }

  exports.isBigInt64Array = isBigInt64Array;

  function isBigUint64Array(value) {
    return whichTypedArray$1(value) === 'BigUint64Array';
  }

  exports.isBigUint64Array = isBigUint64Array;

  function isMapToString(value) {
    return ObjectToString(value) === '[object Map]';
  }

  isMapToString.working = typeof Map !== 'undefined' && isMapToString(new Map());

  function isMap(value) {
    if (typeof Map === 'undefined') {
      return false;
    }

    return isMapToString.working ? isMapToString(value) : value instanceof Map;
  }

  exports.isMap = isMap;

  function isSetToString(value) {
    return ObjectToString(value) === '[object Set]';
  }

  isSetToString.working = typeof Set !== 'undefined' && isSetToString(new Set());

  function isSet(value) {
    if (typeof Set === 'undefined') {
      return false;
    }

    return isSetToString.working ? isSetToString(value) : value instanceof Set;
  }

  exports.isSet = isSet;

  function isWeakMapToString(value) {
    return ObjectToString(value) === '[object WeakMap]';
  }

  isWeakMapToString.working = typeof WeakMap !== 'undefined' && isWeakMapToString(new WeakMap());

  function isWeakMap(value) {
    if (typeof WeakMap === 'undefined') {
      return false;
    }

    return isWeakMapToString.working ? isWeakMapToString(value) : value instanceof WeakMap;
  }

  exports.isWeakMap = isWeakMap;

  function isWeakSetToString(value) {
    return ObjectToString(value) === '[object WeakSet]';
  }

  isWeakSetToString.working = typeof WeakSet !== 'undefined' && isWeakSetToString(new WeakSet());

  function isWeakSet(value) {
    return isWeakSetToString(value);
  }

  exports.isWeakSet = isWeakSet;

  function isArrayBufferToString(value) {
    return ObjectToString(value) === '[object ArrayBuffer]';
  }

  isArrayBufferToString.working = typeof ArrayBuffer !== 'undefined' && isArrayBufferToString(new ArrayBuffer());

  function isArrayBuffer(value) {
    if (typeof ArrayBuffer === 'undefined') {
      return false;
    }

    return isArrayBufferToString.working ? isArrayBufferToString(value) : value instanceof ArrayBuffer;
  }

  exports.isArrayBuffer = isArrayBuffer;

  function isDataViewToString(value) {
    return ObjectToString(value) === '[object DataView]';
  }

  isDataViewToString.working = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined' && isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1));

  function isDataView(value) {
    if (typeof DataView === 'undefined') {
      return false;
    }

    return isDataViewToString.working ? isDataViewToString(value) : value instanceof DataView;
  }

  exports.isDataView = isDataView; // Store a copy of SharedArrayBuffer in case it's deleted elsewhere

  var SharedArrayBufferCopy = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : undefined;

  function isSharedArrayBufferToString(value) {
    return ObjectToString(value) === '[object SharedArrayBuffer]';
  }

  function isSharedArrayBuffer(value) {
    if (typeof SharedArrayBufferCopy === 'undefined') {
      return false;
    }

    if (typeof isSharedArrayBufferToString.working === 'undefined') {
      isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
    }

    return isSharedArrayBufferToString.working ? isSharedArrayBufferToString(value) : value instanceof SharedArrayBufferCopy;
  }

  exports.isSharedArrayBuffer = isSharedArrayBuffer;

  function isAsyncFunction(value) {
    return ObjectToString(value) === '[object AsyncFunction]';
  }

  exports.isAsyncFunction = isAsyncFunction;

  function isMapIterator(value) {
    return ObjectToString(value) === '[object Map Iterator]';
  }

  exports.isMapIterator = isMapIterator;

  function isSetIterator(value) {
    return ObjectToString(value) === '[object Set Iterator]';
  }

  exports.isSetIterator = isSetIterator;

  function isGeneratorObject(value) {
    return ObjectToString(value) === '[object Generator]';
  }

  exports.isGeneratorObject = isGeneratorObject;

  function isWebAssemblyCompiledModule(value) {
    return ObjectToString(value) === '[object WebAssembly.Module]';
  }

  exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;

  function isNumberObject(value) {
    return checkBoxedPrimitive(value, numberValue);
  }

  exports.isNumberObject = isNumberObject;

  function isStringObject(value) {
    return checkBoxedPrimitive(value, stringValue);
  }

  exports.isStringObject = isStringObject;

  function isBooleanObject(value) {
    return checkBoxedPrimitive(value, booleanValue);
  }

  exports.isBooleanObject = isBooleanObject;

  function isBigIntObject(value) {
    return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
  }

  exports.isBigIntObject = isBigIntObject;

  function isSymbolObject(value) {
    return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
  }

  exports.isSymbolObject = isSymbolObject;

  function isBoxedPrimitive(value) {
    return isNumberObject(value) || isStringObject(value) || isBooleanObject(value) || isBigIntObject(value) || isSymbolObject(value);
  }

  exports.isBoxedPrimitive = isBoxedPrimitive;

  function isAnyArrayBuffer(value) {
    return typeof Uint8Array !== 'undefined' && (isArrayBuffer(value) || isSharedArrayBuffer(value));
  }

  exports.isAnyArrayBuffer = isAnyArrayBuffer;
  ['isProxy', 'isExternal', 'isModuleNamespaceObject'].forEach(function (method) {
    Object.defineProperty(exports, method, {
      enumerable: false,
      value: function value() {
        throw new Error(method + ' is not supported in userland');
      }
    });
  });
})(types);

var isBufferBrowser = function isBuffer(arg) {
  return arg && typeof arg === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
};

(function (exports) {
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors(obj) {
    var keys = Object.keys(obj);
    var descriptors = {};

    for (var i = 0; i < keys.length; i++) {
      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }

    return descriptors;
  };

  var formatRegExp = /%[sdj%]/g;

  exports.format = function (f) {
    if (!isString(f)) {
      var objects = [];

      for (var i = 0; i < arguments.length; i++) {
        objects.push(inspect(arguments[i]));
      }

      return objects.join(' ');
    }

    var i = 1;
    var args = arguments;
    var len = args.length;
    var str = String(f).replace(formatRegExp, function (x) {
      if (x === '%%') return '%';
      if (i >= len) return x;

      switch (x) {
        case '%s':
          return String(args[i++]);

        case '%d':
          return Number(args[i++]);

        case '%j':
          try {
            return JSON.stringify(args[i++]);
          } catch (_) {
            return '[Circular]';
          }

        default:
          return x;
      }
    });

    for (var x = args[i]; i < len; x = args[++i]) {
      if (isNull(x) || !isObject(x)) {
        str += ' ' + x;
      } else {
        str += ' ' + inspect(x);
      }
    }

    return str;
  }; // Mark that a method should not be used.
  // Returns a modified function which warns once by default.
  // If --no-deprecation is set, then it is a no-op.


  exports.deprecate = function (fn, msg) {
    if (typeof browser$1$1 !== 'undefined' && browser$1$1.noDeprecation === true) {
      return fn;
    } // Allow for deprecating things in the process of starting up.


    if (typeof browser$1$1 === 'undefined') {
      return function () {
        return exports.deprecate(fn, msg).apply(this, arguments);
      };
    }

    var warned = false;

    function deprecated() {
      if (!warned) {
        {
          console.error(msg);
        }

        warned = true;
      }

      return fn.apply(this, arguments);
    }

    return deprecated;
  };

  var debugs = {};
  var debugEnvRegex = /^$/;

  if (browser$1$1.env.NODE_DEBUG) {
    var debugEnv = browser$1$1.env.NODE_DEBUG;
    debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&').replace(/\*/g, '.*').replace(/,/g, '$|^').toUpperCase();
    debugEnvRegex = new RegExp('^' + debugEnv + '$', 'i');
  }

  exports.debuglog = function (set) {
    set = set.toUpperCase();

    if (!debugs[set]) {
      if (debugEnvRegex.test(set)) {
        var pid = browser$1$1.pid;

        debugs[set] = function () {
          var msg = exports.format.apply(exports, arguments);
          console.error('%s %d: %s', set, pid, msg);
        };
      } else {
        debugs[set] = function () {};
      }
    }

    return debugs[set];
  };
  /**
   * Echos the value of a value. Trys to print the value out
   * in the best way possible given the different types.
   *
   * @param {Object} obj The object to print out.
   * @param {Object} opts Optional options object that alters the output.
   */

  /* legacy: obj, showHidden, depth, colors*/


  function inspect(obj, opts) {
    // default options
    var ctx = {
      seen: [],
      stylize: stylizeNoColor
    }; // legacy...

    if (arguments.length >= 3) ctx.depth = arguments[2];
    if (arguments.length >= 4) ctx.colors = arguments[3];

    if (isBoolean(opts)) {
      // legacy...
      ctx.showHidden = opts;
    } else if (opts) {
      // got an "options" object
      exports._extend(ctx, opts);
    } // set default options


    if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
    if (isUndefined(ctx.depth)) ctx.depth = 2;
    if (isUndefined(ctx.colors)) ctx.colors = false;
    if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
    if (ctx.colors) ctx.stylize = stylizeWithColor;
    return formatValue(ctx, obj, ctx.depth);
  }

  exports.inspect = inspect; // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics

  inspect.colors = {
    'bold': [1, 22],
    'italic': [3, 23],
    'underline': [4, 24],
    'inverse': [7, 27],
    'white': [37, 39],
    'grey': [90, 39],
    'black': [30, 39],
    'blue': [34, 39],
    'cyan': [36, 39],
    'green': [32, 39],
    'magenta': [35, 39],
    'red': [31, 39],
    'yellow': [33, 39]
  }; // Don't use 'blue' not visible on cmd.exe

  inspect.styles = {
    'special': 'cyan',
    'number': 'yellow',
    'boolean': 'yellow',
    'undefined': 'grey',
    'null': 'bold',
    'string': 'green',
    'date': 'magenta',
    // "name": intentionally not styling
    'regexp': 'red'
  };

  function stylizeWithColor(str, styleType) {
    var style = inspect.styles[styleType];

    if (style) {
      return "\x1B[" + inspect.colors[style][0] + 'm' + str + "\x1B[" + inspect.colors[style][1] + 'm';
    } else {
      return str;
    }
  }

  function stylizeNoColor(str, styleType) {
    return str;
  }

  function arrayToHash(array) {
    var hash = {};
    array.forEach(function (val, idx) {
      hash[val] = true;
    });
    return hash;
  }

  function formatValue(ctx, value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
    value.inspect !== exports.inspect && // Also filter out any prototype objects using the circular check.
    !(value.constructor && value.constructor.prototype === value)) {
      var ret = value.inspect(recurseTimes, ctx);

      if (!isString(ret)) {
        ret = formatValue(ctx, ret, recurseTimes);
      }

      return ret;
    } // Primitive types cannot have properties


    var primitive = formatPrimitive(ctx, value);

    if (primitive) {
      return primitive;
    } // Look up the keys of the object.


    var keys = Object.keys(value);
    var visibleKeys = arrayToHash(keys);

    if (ctx.showHidden) {
      keys = Object.getOwnPropertyNames(value);
    } // IE doesn't make error fields non-enumerable
    // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx


    if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
      return formatError(value);
    } // Some type of object without properties can be shortcutted.


    if (keys.length === 0) {
      if (isFunction(value)) {
        var name = value.name ? ': ' + value.name : '';
        return ctx.stylize('[Function' + name + ']', 'special');
      }

      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
      }

      if (isDate(value)) {
        return ctx.stylize(Date.prototype.toString.call(value), 'date');
      }

      if (isError(value)) {
        return formatError(value);
      }
    }

    var base = '',
        array = false,
        braces = ['{', '}']; // Make Array say that they are Array

    if (isArray(value)) {
      array = true;
      braces = ['[', ']'];
    } // Make functions say that they are functions


    if (isFunction(value)) {
      var n = value.name ? ': ' + value.name : '';
      base = ' [Function' + n + ']';
    } // Make RegExps say that they are RegExps


    if (isRegExp(value)) {
      base = ' ' + RegExp.prototype.toString.call(value);
    } // Make dates with properties first say the date


    if (isDate(value)) {
      base = ' ' + Date.prototype.toUTCString.call(value);
    } // Make error with message first say the error


    if (isError(value)) {
      base = ' ' + formatError(value);
    }

    if (keys.length === 0 && (!array || value.length == 0)) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
      } else {
        return ctx.stylize('[Object]', 'special');
      }
    }

    ctx.seen.push(value);
    var output;

    if (array) {
      output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
    } else {
      output = keys.map(function (key) {
        return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
      });
    }

    ctx.seen.pop();
    return reduceToSingleString(output, base, braces);
  }

  function formatPrimitive(ctx, value) {
    if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');

    if (isString(value)) {
      var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
      return ctx.stylize(simple, 'string');
    }

    if (isNumber(value)) return ctx.stylize('' + value, 'number');
    if (isBoolean(value)) return ctx.stylize('' + value, 'boolean'); // For some reason typeof null is "object", so special case here.

    if (isNull(value)) return ctx.stylize('null', 'null');
  }

  function formatError(value) {
    return '[' + Error.prototype.toString.call(value) + ']';
  }

  function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = [];

    for (var i = 0, l = value.length; i < l; ++i) {
      if (hasOwnProperty(value, String(i))) {
        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
      } else {
        output.push('');
      }
    }

    keys.forEach(function (key) {
      if (!key.match(/^\d+$/)) {
        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
      }
    });
    return output;
  }

  function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
    var name, str, desc;
    desc = Object.getOwnPropertyDescriptor(value, key) || {
      value: value[key]
    };

    if (desc.get) {
      if (desc.set) {
        str = ctx.stylize('[Getter/Setter]', 'special');
      } else {
        str = ctx.stylize('[Getter]', 'special');
      }
    } else {
      if (desc.set) {
        str = ctx.stylize('[Setter]', 'special');
      }
    }

    if (!hasOwnProperty(visibleKeys, key)) {
      name = '[' + key + ']';
    }

    if (!str) {
      if (ctx.seen.indexOf(desc.value) < 0) {
        if (isNull(recurseTimes)) {
          str = formatValue(ctx, desc.value, null);
        } else {
          str = formatValue(ctx, desc.value, recurseTimes - 1);
        }

        if (str.indexOf('\n') > -1) {
          if (array) {
            str = str.split('\n').map(function (line) {
              return '  ' + line;
            }).join('\n').substr(2);
          } else {
            str = '\n' + str.split('\n').map(function (line) {
              return '   ' + line;
            }).join('\n');
          }
        }
      } else {
        str = ctx.stylize('[Circular]', 'special');
      }
    }

    if (isUndefined(name)) {
      if (array && key.match(/^\d+$/)) {
        return str;
      }

      name = JSON.stringify('' + key);

      if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
        name = name.substr(1, name.length - 2);
        name = ctx.stylize(name, 'name');
      } else {
        name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
        name = ctx.stylize(name, 'string');
      }
    }

    return name + ': ' + str;
  }

  function reduceToSingleString(output, base, braces) {
    var length = output.reduce(function (prev, cur) {
      if (cur.indexOf('\n') >= 0) ;
      return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
    }, 0);

    if (length > 60) {
      return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
    }

    return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
  } // NOTE: These type checking functions intentionally don't use `instanceof`
  // because it is fragile and can be easily faked with `Object.create()`.


  exports.types = types;

  function isArray(ar) {
    return Array.isArray(ar);
  }

  exports.isArray = isArray;

  function isBoolean(arg) {
    return typeof arg === 'boolean';
  }

  exports.isBoolean = isBoolean;

  function isNull(arg) {
    return arg === null;
  }

  exports.isNull = isNull;

  function isNullOrUndefined(arg) {
    return arg == null;
  }

  exports.isNullOrUndefined = isNullOrUndefined;

  function isNumber(arg) {
    return typeof arg === 'number';
  }

  exports.isNumber = isNumber;

  function isString(arg) {
    return typeof arg === 'string';
  }

  exports.isString = isString;

  function isSymbol(arg) {
    return typeof arg === 'symbol';
  }

  exports.isSymbol = isSymbol;

  function isUndefined(arg) {
    return arg === void 0;
  }

  exports.isUndefined = isUndefined;

  function isRegExp(re) {
    return isObject(re) && objectToString(re) === '[object RegExp]';
  }

  exports.isRegExp = isRegExp;
  exports.types.isRegExp = isRegExp;

  function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
  }

  exports.isObject = isObject;

  function isDate(d) {
    return isObject(d) && objectToString(d) === '[object Date]';
  }

  exports.isDate = isDate;
  exports.types.isDate = isDate;

  function isError(e) {
    return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
  }

  exports.isError = isError;
  exports.types.isNativeError = isError;

  function isFunction(arg) {
    return typeof arg === 'function';
  }

  exports.isFunction = isFunction;

  function isPrimitive(arg) {
    return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
    typeof arg === 'undefined';
  }

  exports.isPrimitive = isPrimitive;
  exports.isBuffer = isBufferBrowser;

  function objectToString(o) {
    return Object.prototype.toString.call(o);
  }

  function pad(n) {
    return n < 10 ? '0' + n.toString(10) : n.toString(10);
  }

  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // 26 Feb 16:19:34

  function timestamp() {
    var d = new Date();
    var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
    return [d.getDate(), months[d.getMonth()], time].join(' ');
  } // log is just a thin wrapper to console.log that prepends a timestamp


  exports.log = function () {
    console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
  };
  /**
   * Inherit the prototype methods from one constructor into another.
   *
   * The Function.prototype.inherits from lang.js rewritten as a standalone
   * function (not on Function.prototype). NOTE: If this file is to be loaded
   * during bootstrapping this function needs to be rewritten using some native
   * functions as prototype setup using normal JavaScript does not work as
   * expected during bootstrapping (see mirror.js in r114903).
   *
   * @param {function} ctor Constructor function which needs to inherit the
   *     prototype.
   * @param {function} superCtor Constructor function to inherit prototype from.
   */


  exports.inherits = inherits_browser.exports;

  exports._extend = function (origin, add) {
    // Don't do anything if add isn't an object
    if (!add || !isObject(add)) return origin;
    var keys = Object.keys(add);
    var i = keys.length;

    while (i--) {
      origin[keys[i]] = add[keys[i]];
    }

    return origin;
  };

  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

  exports.promisify = function promisify(original) {
    if (typeof original !== 'function') throw new TypeError('The "original" argument must be of type Function');

    if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
      var fn = original[kCustomPromisifiedSymbol];

      if (typeof fn !== 'function') {
        throw new TypeError('The "util.promisify.custom" argument must be of type Function');
      }

      Object.defineProperty(fn, kCustomPromisifiedSymbol, {
        value: fn,
        enumerable: false,
        writable: false,
        configurable: true
      });
      return fn;
    }

    function fn() {
      var promiseResolve, promiseReject;
      var promise = new Promise(function (resolve, reject) {
        promiseResolve = resolve;
        promiseReject = reject;
      });
      var args = [];

      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }

      args.push(function (err, value) {
        if (err) {
          promiseReject(err);
        } else {
          promiseResolve(value);
        }
      });

      try {
        original.apply(this, args);
      } catch (err) {
        promiseReject(err);
      }

      return promise;
    }

    Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
    if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn,
      enumerable: false,
      writable: false,
      configurable: true
    });
    return Object.defineProperties(fn, getOwnPropertyDescriptors(original));
  };

  exports.promisify.custom = kCustomPromisifiedSymbol;

  function callbackifyOnRejected(reason, cb) {
    // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
    // Because `null` is a special error value in callbacks which means "no error
    // occurred", we error-wrap so the callback consumer can distinguish between
    // "the promise rejected with null" or "the promise fulfilled with undefined".
    if (!reason) {
      var newReason = new Error('Promise was rejected with a falsy value');
      newReason.reason = reason;
      reason = newReason;
    }

    return cb(reason);
  }

  function callbackify(original) {
    if (typeof original !== 'function') {
      throw new TypeError('The "original" argument must be of type Function');
    } // We DO NOT return the promise as it gives the user a false sense that
    // the promise is actually somehow related to the callback's execution
    // and that the callback throwing will reject the promise.


    function callbackified() {
      var args = [];

      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }

      var maybeCb = args.pop();

      if (typeof maybeCb !== 'function') {
        throw new TypeError('The last argument must be of type Function');
      }

      var self = this;

      var cb = function cb() {
        return maybeCb.apply(self, arguments);
      }; // In true node style we process the callback on `nextTick` with all the
      // implications (stack, `uncaughtException`, `async_hooks`)


      original.apply(this, args).then(function (ret) {
        browser$1$1.nextTick(cb.bind(null, null, ret));
      }, function (rej) {
        browser$1$1.nextTick(callbackifyOnRejected.bind(null, rej, cb));
      });
    }

    Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
    Object.defineProperties(callbackified, getOwnPropertyDescriptors(original));
    return callbackified;
  }

  exports.callbackify = callbackify;
})(util$1);

// longer be forced to treat every error message change as a semver-major
// change. The NodeError classes here all expose a `code` property whose
// value statically and permanently identifies the error. While the error
// message may change, the code should not.


function _typeof$3(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$3 = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof$3 = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof$3(obj);
}

function _classCallCheck$2(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn$1(self, call) {
  if (call && (_typeof$3(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized$1(self);
}

function _assertThisInitialized$1(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _getPrototypeOf$1(o) {
  _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf$1(o);
}

function _inherits$1(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf$1(subClass, superClass);
}

function _setPrototypeOf$1(o, p) {
  _setPrototypeOf$1 = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf$1(o, p);
}

var codes = {}; // Lazy loaded

var assert$1;
var util;

function createErrorType(code, message, Base) {
  if (!Base) {
    Base = Error;
  }

  function getMessage(arg1, arg2, arg3) {
    if (typeof message === 'string') {
      return message;
    } else {
      return message(arg1, arg2, arg3);
    }
  }

  var NodeError = /*#__PURE__*/function (_Base) {
    _inherits$1(NodeError, _Base);

    function NodeError(arg1, arg2, arg3) {
      var _this;

      _classCallCheck$2(this, NodeError);

      _this = _possibleConstructorReturn$1(this, _getPrototypeOf$1(NodeError).call(this, getMessage(arg1, arg2, arg3)));
      _this.code = code;
      return _this;
    }

    return NodeError;
  }(Base);

  codes[code] = NodeError;
} // https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js


function oneOf(expected, thing) {
  if (Array.isArray(expected)) {
    var len = expected.length;
    expected = expected.map(function (i) {
      return String(i);
    });

    if (len > 2) {
      return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(', '), ", or ") + expected[len - 1];
    } else if (len === 2) {
      return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
    } else {
      return "of ".concat(thing, " ").concat(expected[0]);
    }
  } else {
    return "of ".concat(thing, " ").concat(String(expected));
  }
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith


function startsWith(str, search, pos) {
  return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith


function endsWith$1(str, search, this_len) {
  if (this_len === undefined || this_len > str.length) {
    this_len = str.length;
  }

  return str.substring(this_len - search.length, this_len) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes


function includes(str, search, start) {
  if (typeof start !== 'number') {
    start = 0;
  }

  if (start + search.length > str.length) {
    return false;
  } else {
    return str.indexOf(search, start) !== -1;
  }
}

createErrorType('ERR_AMBIGUOUS_ARGUMENT', 'The "%s" argument is ambiguous. %s', TypeError);
createErrorType('ERR_INVALID_ARG_TYPE', function (name, expected, actual) {
  if (assert$1 === undefined) assert$1 = assert$2.exports;
  assert$1(typeof name === 'string', "'name' must be a string"); // determiner: 'must be' or 'must not be'

  var determiner;

  if (typeof expected === 'string' && startsWith(expected, 'not ')) {
    determiner = 'must not be';
    expected = expected.replace(/^not /, '');
  } else {
    determiner = 'must be';
  }

  var msg;

  if (endsWith$1(name, ' argument')) {
    // For cases like 'first argument'
    msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  } else {
    var type = includes(name, '.') ? 'property' : 'argument';
    msg = "The \"".concat(name, "\" ").concat(type, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  } // TODO(BridgeAR): Improve the output by showing `null` and similar.


  msg += ". Received type ".concat(_typeof$3(actual));
  return msg;
}, TypeError);
createErrorType('ERR_INVALID_ARG_VALUE', function (name, value) {
  var reason = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'is invalid';
  if (util === undefined) util = util$1;
  var inspected = util.inspect(value);

  if (inspected.length > 128) {
    inspected = "".concat(inspected.slice(0, 128), "...");
  }

  return "The argument '".concat(name, "' ").concat(reason, ". Received ").concat(inspected);
}, TypeError);
createErrorType('ERR_INVALID_RETURN_VALUE', function (input, name, value) {
  var type;

  if (value && value.constructor && value.constructor.name) {
    type = "instance of ".concat(value.constructor.name);
  } else {
    type = "type ".concat(_typeof$3(value));
  }

  return "Expected ".concat(input, " to be returned from the \"").concat(name, "\"") + " function but got ".concat(type, ".");
}, TypeError);
createErrorType('ERR_MISSING_ARGS', function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (assert$1 === undefined) assert$1 = assert$2.exports;
  assert$1(args.length > 0, 'At least one arg needs to be specified');
  var msg = 'The ';
  var len = args.length;
  args = args.map(function (a) {
    return "\"".concat(a, "\"");
  });

  switch (len) {
    case 1:
      msg += "".concat(args[0], " argument");
      break;

    case 2:
      msg += "".concat(args[0], " and ").concat(args[1], " arguments");
      break;

    default:
      msg += args.slice(0, len - 1).join(', ');
      msg += ", and ".concat(args[len - 1], " arguments");
      break;
  }

  return "".concat(msg, " must be specified");
}, TypeError);
errors.codes = codes;

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _classCallCheck$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties$1(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass$1(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties$1(Constructor, staticProps);
  return Constructor;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof$2(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _typeof$2(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$2 = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof$2 = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof$2(obj);
}

var _require$1 = util$1,
    inspect$1 = _require$1.inspect;
var _require2$1 = errors,
    ERR_INVALID_ARG_TYPE$1 = _require2$1.codes.ERR_INVALID_ARG_TYPE; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith

function endsWith(str, search, this_len) {
  if (this_len === undefined || this_len > str.length) {
    this_len = str.length;
  }

  return str.substring(this_len - search.length, this_len) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat


function repeat(str, count) {
  count = Math.floor(count);
  if (str.length == 0 || count == 0) return '';
  var maxCount = str.length * count;
  count = Math.floor(Math.log(count) / Math.log(2));

  while (count) {
    str += str;
    count--;
  }

  str += str.substring(0, maxCount - str.length);
  return str;
}

var blue = '';
var green = '';
var red = '';
var white = '';
var kReadableOperator = {
  deepStrictEqual: 'Expected values to be strictly deep-equal:',
  strictEqual: 'Expected values to be strictly equal:',
  strictEqualObject: 'Expected "actual" to be reference-equal to "expected":',
  deepEqual: 'Expected values to be loosely deep-equal:',
  equal: 'Expected values to be loosely equal:',
  notDeepStrictEqual: 'Expected "actual" not to be strictly deep-equal to:',
  notStrictEqual: 'Expected "actual" to be strictly unequal to:',
  notStrictEqualObject: 'Expected "actual" not to be reference-equal to "expected":',
  notDeepEqual: 'Expected "actual" not to be loosely deep-equal to:',
  notEqual: 'Expected "actual" to be loosely unequal to:',
  notIdentical: 'Values identical but not reference-equal:'
}; // Comparing short primitives should just show === / !== instead of using the
// diff.

var kMaxShortLength = 10;

function copyError(source) {
  var keys = Object.keys(source);
  var target = Object.create(Object.getPrototypeOf(source));
  keys.forEach(function (key) {
    target[key] = source[key];
  });
  Object.defineProperty(target, 'message', {
    value: source.message
  });
  return target;
}

function inspectValue(val) {
  // The util.inspect default values could be changed. This makes sure the
  // error messages contain the necessary information nevertheless.
  return inspect$1(val, {
    compact: false,
    customInspect: false,
    depth: 1000,
    maxArrayLength: Infinity,
    // Assert compares only enumerable properties (with a few exceptions).
    showHidden: false,
    // Having a long line as error is better than wrapping the line for
    // comparison for now.
    // TODO(BridgeAR): `breakLength` should be limited as soon as soon as we
    // have meta information about the inspected properties (i.e., know where
    // in what line the property starts and ends).
    breakLength: Infinity,
    // Assert does not detect proxies currently.
    showProxy: false,
    sorted: true,
    // Inspect getters as we also check them when comparing entries.
    getters: true
  });
}

function createErrDiff(actual, expected, operator) {
  var other = '';
  var res = '';
  var lastPos = 0;
  var end = '';
  var skipped = false;
  var actualInspected = inspectValue(actual);
  var actualLines = actualInspected.split('\n');
  var expectedLines = inspectValue(expected).split('\n');
  var i = 0;
  var indicator = ''; // In case both values are objects explicitly mark them as not reference equal
  // for the `strictEqual` operator.

  if (operator === 'strictEqual' && _typeof$2(actual) === 'object' && _typeof$2(expected) === 'object' && actual !== null && expected !== null) {
    operator = 'strictEqualObject';
  } // If "actual" and "expected" fit on a single line and they are not strictly
  // equal, check further special handling.


  if (actualLines.length === 1 && expectedLines.length === 1 && actualLines[0] !== expectedLines[0]) {
    var inputLength = actualLines[0].length + expectedLines[0].length; // If the character length of "actual" and "expected" together is less than
    // kMaxShortLength and if neither is an object and at least one of them is
    // not `zero`, use the strict equal comparison to visualize the output.

    if (inputLength <= kMaxShortLength) {
      if ((_typeof$2(actual) !== 'object' || actual === null) && (_typeof$2(expected) !== 'object' || expected === null) && (actual !== 0 || expected !== 0)) {
        // -0 === +0
        return "".concat(kReadableOperator[operator], "\n\n") + "".concat(actualLines[0], " !== ").concat(expectedLines[0], "\n");
      }
    } else if (operator !== 'strictEqualObject') {
      // If the stderr is a tty and the input length is lower than the current
      // columns per line, add a mismatch indicator below the output. If it is
      // not a tty, use a default value of 80 characters.
      var maxLength = 80;

      if (inputLength < maxLength) {
        while (actualLines[0][i] === expectedLines[0][i]) {
          i++;
        } // Ignore the first characters.


        if (i > 2) {
          // Add position indicator for the first mismatch in case it is a
          // single line and the input length is less than the column length.
          indicator = "\n  ".concat(repeat(' ', i), "^");
          i = 0;
        }
      }
    }
  } // Remove all ending lines that match (this optimizes the output for
  // readability by reducing the number of total changed lines).


  var a = actualLines[actualLines.length - 1];
  var b = expectedLines[expectedLines.length - 1];

  while (a === b) {
    if (i++ < 2) {
      end = "\n  ".concat(a).concat(end);
    } else {
      other = a;
    }

    actualLines.pop();
    expectedLines.pop();
    if (actualLines.length === 0 || expectedLines.length === 0) break;
    a = actualLines[actualLines.length - 1];
    b = expectedLines[expectedLines.length - 1];
  }

  var maxLines = Math.max(actualLines.length, expectedLines.length); // Strict equal with identical objects that are not identical by reference.
  // E.g., assert.deepStrictEqual({ a: Symbol() }, { a: Symbol() })

  if (maxLines === 0) {
    // We have to get the result again. The lines were all removed before.
    var _actualLines = actualInspected.split('\n'); // Only remove lines in case it makes sense to collapse those.
    // TODO: Accept env to always show the full error.


    if (_actualLines.length > 30) {
      _actualLines[26] = "".concat(blue, "...").concat(white);

      while (_actualLines.length > 27) {
        _actualLines.pop();
      }
    }

    return "".concat(kReadableOperator.notIdentical, "\n\n").concat(_actualLines.join('\n'), "\n");
  }

  if (i > 3) {
    end = "\n".concat(blue, "...").concat(white).concat(end);
    skipped = true;
  }

  if (other !== '') {
    end = "\n  ".concat(other).concat(end);
    other = '';
  }

  var printedLines = 0;
  var msg = kReadableOperator[operator] + "\n".concat(green, "+ actual").concat(white, " ").concat(red, "- expected").concat(white);
  var skippedMsg = " ".concat(blue, "...").concat(white, " Lines skipped");

  for (i = 0; i < maxLines; i++) {
    // Only extra expected lines exist
    var cur = i - lastPos;

    if (actualLines.length < i + 1) {
      // If the last diverging line is more than one line above and the
      // current line is at least line three, add some of the former lines and
      // also add dots to indicate skipped entries.
      if (cur > 1 && i > 2) {
        if (cur > 4) {
          res += "\n".concat(blue, "...").concat(white);
          skipped = true;
        } else if (cur > 3) {
          res += "\n  ".concat(expectedLines[i - 2]);
          printedLines++;
        }

        res += "\n  ".concat(expectedLines[i - 1]);
        printedLines++;
      } // Mark the current line as the last diverging one.


      lastPos = i; // Add the expected line to the cache.

      other += "\n".concat(red, "-").concat(white, " ").concat(expectedLines[i]);
      printedLines++; // Only extra actual lines exist
    } else if (expectedLines.length < i + 1) {
      // If the last diverging line is more than one line above and the
      // current line is at least line three, add some of the former lines and
      // also add dots to indicate skipped entries.
      if (cur > 1 && i > 2) {
        if (cur > 4) {
          res += "\n".concat(blue, "...").concat(white);
          skipped = true;
        } else if (cur > 3) {
          res += "\n  ".concat(actualLines[i - 2]);
          printedLines++;
        }

        res += "\n  ".concat(actualLines[i - 1]);
        printedLines++;
      } // Mark the current line as the last diverging one.


      lastPos = i; // Add the actual line to the result.

      res += "\n".concat(green, "+").concat(white, " ").concat(actualLines[i]);
      printedLines++; // Lines diverge
    } else {
      var expectedLine = expectedLines[i];
      var actualLine = actualLines[i]; // If the lines diverge, specifically check for lines that only diverge by
      // a trailing comma. In that case it is actually identical and we should
      // mark it as such.

      var divergingLines = actualLine !== expectedLine && (!endsWith(actualLine, ',') || actualLine.slice(0, -1) !== expectedLine); // If the expected line has a trailing comma but is otherwise identical,
      // add a comma at the end of the actual line. Otherwise the output could
      // look weird as in:
      //
      //   [
      //     1         // No comma at the end!
      // +   2
      //   ]
      //

      if (divergingLines && endsWith(expectedLine, ',') && expectedLine.slice(0, -1) === actualLine) {
        divergingLines = false;
        actualLine += ',';
      }

      if (divergingLines) {
        // If the last diverging line is more than one line above and the
        // current line is at least line three, add some of the former lines and
        // also add dots to indicate skipped entries.
        if (cur > 1 && i > 2) {
          if (cur > 4) {
            res += "\n".concat(blue, "...").concat(white);
            skipped = true;
          } else if (cur > 3) {
            res += "\n  ".concat(actualLines[i - 2]);
            printedLines++;
          }

          res += "\n  ".concat(actualLines[i - 1]);
          printedLines++;
        } // Mark the current line as the last diverging one.


        lastPos = i; // Add the actual line to the result and cache the expected diverging
        // line so consecutive diverging lines show up as +++--- and not +-+-+-.

        res += "\n".concat(green, "+").concat(white, " ").concat(actualLine);
        other += "\n".concat(red, "-").concat(white, " ").concat(expectedLine);
        printedLines += 2; // Lines are identical
      } else {
        // Add all cached information to the result before adding other things
        // and reset the cache.
        res += other;
        other = ''; // If the last diverging line is exactly one line above or if it is the
        // very first line, add the line to the result.

        if (cur === 1 || i === 0) {
          res += "\n  ".concat(actualLine);
          printedLines++;
        }
      }
    } // Inspected object to big (Show ~20 rows max)


    if (printedLines > 20 && i < maxLines - 2) {
      return "".concat(msg).concat(skippedMsg, "\n").concat(res, "\n").concat(blue, "...").concat(white).concat(other, "\n") + "".concat(blue, "...").concat(white);
    }
  }

  return "".concat(msg).concat(skipped ? skippedMsg : '', "\n").concat(res).concat(other).concat(end).concat(indicator);
}

var AssertionError$1 = /*#__PURE__*/function (_Error) {
  _inherits(AssertionError, _Error);

  function AssertionError(options) {
    var _this;

    _classCallCheck$1(this, AssertionError);

    if (_typeof$2(options) !== 'object' || options === null) {
      throw new ERR_INVALID_ARG_TYPE$1('options', 'Object', options);
    }

    var message = options.message,
        operator = options.operator,
        stackStartFn = options.stackStartFn;
    var actual = options.actual,
        expected = options.expected;
    var limit = Error.stackTraceLimit;
    Error.stackTraceLimit = 0;

    if (message != null) {
      _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, String(message)));
    } else {
      // in a very close way to the original in case both sides are actually
      // instances of Error.


      if (_typeof$2(actual) === 'object' && actual !== null && _typeof$2(expected) === 'object' && expected !== null && 'stack' in actual && actual instanceof Error && 'stack' in expected && expected instanceof Error) {
        actual = copyError(actual);
        expected = copyError(expected);
      }

      if (operator === 'deepStrictEqual' || operator === 'strictEqual') {
        _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, createErrDiff(actual, expected, operator)));
      } else if (operator === 'notDeepStrictEqual' || operator === 'notStrictEqual') {
        // In case the objects are equal but the operator requires unequal, show
        // the first object and say A equals B
        var base = kReadableOperator[operator];
        var res = inspectValue(actual).split('\n'); // In case "actual" is an object, it should not be reference equal.

        if (operator === 'notStrictEqual' && _typeof$2(actual) === 'object' && actual !== null) {
          base = kReadableOperator.notStrictEqualObject;
        } // Only remove lines in case it makes sense to collapse those.
        // TODO: Accept env to always show the full error.


        if (res.length > 30) {
          res[26] = "".concat(blue, "...").concat(white);

          while (res.length > 27) {
            res.pop();
          }
        } // Only print a single input.


        if (res.length === 1) {
          _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, "".concat(base, " ").concat(res[0])));
        } else {
          _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, "".concat(base, "\n\n").concat(res.join('\n'), "\n")));
        }
      } else {
        var _res = inspectValue(actual);

        var other = '';
        var knownOperators = kReadableOperator[operator];

        if (operator === 'notDeepEqual' || operator === 'notEqual') {
          _res = "".concat(kReadableOperator[operator], "\n\n").concat(_res);

          if (_res.length > 1024) {
            _res = "".concat(_res.slice(0, 1021), "...");
          }
        } else {
          other = "".concat(inspectValue(expected));

          if (_res.length > 512) {
            _res = "".concat(_res.slice(0, 509), "...");
          }

          if (other.length > 512) {
            other = "".concat(other.slice(0, 509), "...");
          }

          if (operator === 'deepEqual' || operator === 'equal') {
            _res = "".concat(knownOperators, "\n\n").concat(_res, "\n\nshould equal\n\n");
          } else {
            other = " ".concat(operator, " ").concat(other);
          }
        }

        _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, "".concat(_res).concat(other)));
      }
    }

    Error.stackTraceLimit = limit;
    _this.generatedMessage = !message;
    Object.defineProperty(_assertThisInitialized(_this), 'name', {
      value: 'AssertionError [ERR_ASSERTION]',
      enumerable: false,
      writable: true,
      configurable: true
    });
    _this.code = 'ERR_ASSERTION';
    _this.actual = actual;
    _this.expected = expected;
    _this.operator = operator;

    if (Error.captureStackTrace) {
      // eslint-disable-next-line no-restricted-syntax
      Error.captureStackTrace(_assertThisInitialized(_this), stackStartFn);
    } // Create error message including the error code in the name.


    _this.stack; // Reset the name.

    _this.name = 'AssertionError';
    return _possibleConstructorReturn(_this);
  }

  _createClass$1(AssertionError, [{
    key: "toString",
    value: function toString() {
      return "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message);
    }
  }, {
    key: inspect$1.custom,
    value: function value(recurseTimes, ctx) {
      // This limits the `actual` and `expected` property default inspection to
      // the minimum depth. Otherwise those values would be too verbose compared
      // to the actual error message which contains a combined view of these two
      // input values.
      return inspect$1(this, _objectSpread({}, ctx, {
        customInspect: false,
        depth: 0
      }));
    }
  }]);

  return AssertionError;
}(_wrapNativeSuper(Error));

var assertion_error = AssertionError$1;

/**
 * Code refactored from Mozilla Developer Network:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */

function assign(target, firstSource) {
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert first argument to object');
  }

  var to = Object(target);

  for (var i = 1; i < arguments.length; i++) {
    var nextSource = arguments[i];

    if (nextSource === undefined || nextSource === null) {
      continue;
    }

    var keysArray = Object.keys(Object(nextSource));

    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
      var nextKey = keysArray[nextIndex];
      var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

      if (desc !== undefined && desc.enumerable) {
        to[nextKey] = nextSource[nextKey];
      }
    }
  }

  return to;
}

function polyfill$4() {
  if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: assign
    });
  }
}

var es6ObjectAssign = {
  assign: assign,
  polyfill: polyfill$4
};

var toStr$2 = Object.prototype.toString;

var isArguments = function isArguments(value) {
  var str = toStr$2.call(value);
  var isArgs = str === '[object Arguments]';

  if (!isArgs) {
    isArgs = str !== '[object Array]' && value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && toStr$2.call(value.callee) === '[object Function]';
  }

  return isArgs;
};

var keysShim$1;

if (!Object.keys) {
  // modified from https://github.com/es-shims/es5-shim
  var has = Object.prototype.hasOwnProperty;
  var toStr$1 = Object.prototype.toString;
  var isArgs$1 = isArguments; // eslint-disable-line global-require

  var isEnumerable = Object.prototype.propertyIsEnumerable;
  var hasDontEnumBug = !isEnumerable.call({
    toString: null
  }, 'toString');
  var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
  var dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];

  var equalsConstructorPrototype = function equalsConstructorPrototype(o) {
    var ctor = o.constructor;
    return ctor && ctor.prototype === o;
  };

  var excludedKeys = {
    $applicationCache: true,
    $console: true,
    $external: true,
    $frame: true,
    $frameElement: true,
    $frames: true,
    $innerHeight: true,
    $innerWidth: true,
    $onmozfullscreenchange: true,
    $onmozfullscreenerror: true,
    $outerHeight: true,
    $outerWidth: true,
    $pageXOffset: true,
    $pageYOffset: true,
    $parent: true,
    $scrollLeft: true,
    $scrollTop: true,
    $scrollX: true,
    $scrollY: true,
    $self: true,
    $webkitIndexedDB: true,
    $webkitStorageInfo: true,
    $window: true
  };

  var hasAutomationEqualityBug = function () {
    /* global window */
    if (typeof window === 'undefined') {
      return false;
    }

    for (var k in window) {
      try {
        if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
          try {
            equalsConstructorPrototype(window[k]);
          } catch (e) {
            return true;
          }
        }
      } catch (e) {
        return true;
      }
    }

    return false;
  }();

  var equalsConstructorPrototypeIfNotBuggy = function equalsConstructorPrototypeIfNotBuggy(o) {
    /* global window */
    if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
      return equalsConstructorPrototype(o);
    }

    try {
      return equalsConstructorPrototype(o);
    } catch (e) {
      return false;
    }
  };

  keysShim$1 = function keys(object) {
    var isObject = object !== null && typeof object === 'object';
    var isFunction = toStr$1.call(object) === '[object Function]';
    var isArguments = isArgs$1(object);
    var isString = isObject && toStr$1.call(object) === '[object String]';
    var theKeys = [];

    if (!isObject && !isFunction && !isArguments) {
      throw new TypeError('Object.keys called on a non-object');
    }

    var skipProto = hasProtoEnumBug && isFunction;

    if (isString && object.length > 0 && !has.call(object, 0)) {
      for (var i = 0; i < object.length; ++i) {
        theKeys.push(String(i));
      }
    }

    if (isArguments && object.length > 0) {
      for (var j = 0; j < object.length; ++j) {
        theKeys.push(String(j));
      }
    } else {
      for (var name in object) {
        if (!(skipProto && name === 'prototype') && has.call(object, name)) {
          theKeys.push(String(name));
        }
      }
    }

    if (hasDontEnumBug) {
      var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

      for (var k = 0; k < dontEnums.length; ++k) {
        if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
          theKeys.push(dontEnums[k]);
        }
      }
    }

    return theKeys;
  };
}

var implementation$6 = keysShim$1;

var slice = Array.prototype.slice;
var isArgs = isArguments;
var origKeys = Object.keys;
var keysShim = origKeys ? function keys(o) {
  return origKeys(o);
} : implementation$6;
var originalKeys = Object.keys;

keysShim.shim = function shimObjectKeys() {
  if (Object.keys) {
    var keysWorksWithArguments = function () {
      // Safari 5.0 bug
      var args = Object.keys(arguments);
      return args && args.length === arguments.length;
    }(1, 2);

    if (!keysWorksWithArguments) {
      Object.keys = function keys(object) {
        // eslint-disable-line func-name-matching
        if (isArgs(object)) {
          return originalKeys(slice.call(object));
        }

        return originalKeys(object);
      };
    }
  } else {
    Object.keys = keysShim;
  }

  return Object.keys || keysShim;
};

var objectKeys = keysShim;

var keys = objectKeys;
var hasSymbols = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';
var toStr = Object.prototype.toString;
var concat = Array.prototype.concat;
var origDefineProperty = Object.defineProperty;

var isFunction = function isFunction(fn) {
  return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function arePropertyDescriptorsSupported() {
  var obj = {};

  try {
    origDefineProperty(obj, 'x', {
      enumerable: false,
      value: obj
    }); // eslint-disable-next-line no-unused-vars, no-restricted-syntax

    for (var _ in obj) {
      // jscs:ignore disallowUnusedVariables
      return false;
    }

    return obj.x === obj;
  } catch (e) {
    /* this is IE 8. */
    return false;
  }
};

var supportsDescriptors = origDefineProperty && arePropertyDescriptorsSupported();

var defineProperty = function defineProperty(object, name, value, predicate) {
  if (name in object && (!isFunction(predicate) || !predicate())) {
    return;
  }

  if (supportsDescriptors) {
    origDefineProperty(object, name, {
      configurable: true,
      enumerable: false,
      value: value,
      writable: true
    });
  } else {
    object[name] = value;
  }
};

var defineProperties = function defineProperties(object, map) {
  var predicates = arguments.length > 2 ? arguments[2] : {};
  var props = keys(map);

  if (hasSymbols) {
    props = concat.call(props, Object.getOwnPropertySymbols(map));
  }

  for (var i = 0; i < props.length; i += 1) {
    defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
  }
};

defineProperties.supportsDescriptors = !!supportsDescriptors;
var defineProperties_1 = defineProperties;

var numberIsNaN$1 = function numberIsNaN(value) {
  return value !== value;
};

var implementation$5 = function is(a, b) {
  if (a === 0 && b === 0) {
    return 1 / a === 1 / b;
  }

  if (a === b) {
    return true;
  }

  if (numberIsNaN$1(a) && numberIsNaN$1(b)) {
    return true;
  }

  return false;
};

var implementation$4 = implementation$5;

var polyfill$3 = function getPolyfill() {
  return typeof Object.is === 'function' ? Object.is : implementation$4;
};

var getPolyfill$3 = polyfill$3;
var define$3 = defineProperties_1;

var shim$3 = function shimObjectIs() {
  var polyfill = getPolyfill$3();
  define$3(Object, {
    is: polyfill
  }, {
    is: function testObjectIs() {
      return Object.is !== polyfill;
    }
  });
  return polyfill;
};

var define$2 = defineProperties_1;
var callBind$1 = callBind$3.exports;
var implementation$3 = implementation$5;
var getPolyfill$2 = polyfill$3;
var shim$2 = shim$3;
var polyfill$2 = callBind$1(getPolyfill$2(), Object);
define$2(polyfill$2, {
  getPolyfill: getPolyfill$2,
  implementation: implementation$3,
  shim: shim$2
});
var objectIs$2 = polyfill$2;

/* http://www.ecma-international.org/ecma-262/6.0/#sec-number.isnan */


var implementation$2 = function isNaN(value) {
  return value !== value;
};

var implementation$1 = implementation$2;

var polyfill$1 = function getPolyfill() {
  if (Number.isNaN && Number.isNaN(NaN) && !Number.isNaN('a')) {
    return Number.isNaN;
  }

  return implementation$1;
};

var define$1 = defineProperties_1;
var getPolyfill$1 = polyfill$1;
/* http://www.ecma-international.org/ecma-262/6.0/#sec-number.isnan */

var shim$1 = function shimNumberIsNaN() {
  var polyfill = getPolyfill$1();
  define$1(Number, {
    isNaN: polyfill
  }, {
    isNaN: function testIsNaN() {
      return Number.isNaN !== polyfill;
    }
  });
  return polyfill;
};

var callBind = callBind$3.exports;
var define = defineProperties_1;
var implementation = implementation$2;
var getPolyfill = polyfill$1;
var shim = shim$1;
var polyfill = callBind(getPolyfill(), Number);
/* http://www.ecma-international.org/ecma-262/6.0/#sec-number.isnan */

define(polyfill, {
  getPolyfill: getPolyfill,
  implementation: implementation,
  shim: shim
});
var isNan = polyfill;

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _typeof$1(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$1 = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof$1 = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof$1(obj);
}

var regexFlagsSupported = /a/g.flags !== undefined;

var arrayFromSet = function arrayFromSet(set) {
  var array = [];
  set.forEach(function (value) {
    return array.push(value);
  });
  return array;
};

var arrayFromMap = function arrayFromMap(map) {
  var array = [];
  map.forEach(function (value, key) {
    return array.push([key, value]);
  });
  return array;
};

var objectIs$1 = Object.is ? Object.is : objectIs$2;
var objectGetOwnPropertySymbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols : function () {
  return [];
};
var numberIsNaN = Number.isNaN ? Number.isNaN : isNan;

function uncurryThis(f) {
  return f.call.bind(f);
}

var hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);
var propertyIsEnumerable = uncurryThis(Object.prototype.propertyIsEnumerable);
var objectToString = uncurryThis(Object.prototype.toString);
var _require$types$1 = util$1.types,
    isAnyArrayBuffer = _require$types$1.isAnyArrayBuffer,
    isArrayBufferView = _require$types$1.isArrayBufferView,
    isDate = _require$types$1.isDate,
    isMap = _require$types$1.isMap,
    isRegExp$1 = _require$types$1.isRegExp,
    isSet = _require$types$1.isSet,
    isNativeError = _require$types$1.isNativeError,
    isBoxedPrimitive = _require$types$1.isBoxedPrimitive,
    isNumberObject = _require$types$1.isNumberObject,
    isStringObject = _require$types$1.isStringObject,
    isBooleanObject = _require$types$1.isBooleanObject,
    isBigIntObject = _require$types$1.isBigIntObject,
    isSymbolObject = _require$types$1.isSymbolObject,
    isFloat32Array = _require$types$1.isFloat32Array,
    isFloat64Array = _require$types$1.isFloat64Array;

function isNonIndex(key) {
  if (key.length === 0 || key.length > 10) return true;

  for (var i = 0; i < key.length; i++) {
    var code = key.charCodeAt(i);
    if (code < 48 || code > 57) return true;
  } // The maximum size for an array is 2 ** 32 -1.


  return key.length === 10 && key >= Math.pow(2, 32);
}

function getOwnNonIndexProperties(value) {
  return Object.keys(value).filter(isNonIndex).concat(objectGetOwnPropertySymbols(value).filter(Object.prototype.propertyIsEnumerable.bind(value)));
} // Taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */


function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }

  if (y < x) {
    return 1;
  }

  return 0;
}
var kStrict = true;
var kLoose = false;
var kNoIterator = 0;
var kIsArray = 1;
var kIsSet = 2;
var kIsMap = 3; // Check if they have the same source and flags

function areSimilarRegExps(a, b) {
  return regexFlagsSupported ? a.source === b.source && a.flags === b.flags : RegExp.prototype.toString.call(a) === RegExp.prototype.toString.call(b);
}

function areSimilarFloatArrays(a, b) {
  if (a.byteLength !== b.byteLength) {
    return false;
  }

  for (var offset = 0; offset < a.byteLength; offset++) {
    if (a[offset] !== b[offset]) {
      return false;
    }
  }

  return true;
}

function areSimilarTypedArrays(a, b) {
  if (a.byteLength !== b.byteLength) {
    return false;
  }

  return compare(new Uint8Array(a.buffer, a.byteOffset, a.byteLength), new Uint8Array(b.buffer, b.byteOffset, b.byteLength)) === 0;
}

function areEqualArrayBuffers(buf1, buf2) {
  return buf1.byteLength === buf2.byteLength && compare(new Uint8Array(buf1), new Uint8Array(buf2)) === 0;
}

function isEqualBoxedPrimitive(val1, val2) {
  if (isNumberObject(val1)) {
    return isNumberObject(val2) && objectIs$1(Number.prototype.valueOf.call(val1), Number.prototype.valueOf.call(val2));
  }

  if (isStringObject(val1)) {
    return isStringObject(val2) && String.prototype.valueOf.call(val1) === String.prototype.valueOf.call(val2);
  }

  if (isBooleanObject(val1)) {
    return isBooleanObject(val2) && Boolean.prototype.valueOf.call(val1) === Boolean.prototype.valueOf.call(val2);
  }

  if (isBigIntObject(val1)) {
    return isBigIntObject(val2) && BigInt.prototype.valueOf.call(val1) === BigInt.prototype.valueOf.call(val2);
  }

  return isSymbolObject(val2) && Symbol.prototype.valueOf.call(val1) === Symbol.prototype.valueOf.call(val2);
} // Notes: Type tags are historical [[Class]] properties that can be set by
// FunctionTemplate::SetClassName() in C++ or Symbol.toStringTag in JS
// and retrieved using Object.prototype.toString.call(obj) in JS
// See https://tc39.github.io/ecma262/#sec-object.prototype.tostring
// for a list of tags pre-defined in the spec.
// There are some unspecified tags in the wild too (e.g. typed array tags).
// Since tags can be altered, they only serve fast failures
//
// Typed arrays and buffers are checked by comparing the content in their
// underlying ArrayBuffer. This optimization requires that it's
// reasonable to interpret their underlying memory in the same way,
// which is checked by comparing their type tags.
// (e.g. a Uint8Array and a Uint16Array with the same memory content
// could still be different because they will be interpreted differently).
//
// For strict comparison, objects should have
// a) The same built-in type tags
// b) The same prototypes.


function innerDeepEqual(val1, val2, strict, memos) {
  // All identical values are equivalent, as determined by ===.
  if (val1 === val2) {
    if (val1 !== 0) return true;
    return strict ? objectIs$1(val1, val2) : true;
  } // Check more closely if val1 and val2 are equal.


  if (strict) {
    if (_typeof$1(val1) !== 'object') {
      return typeof val1 === 'number' && numberIsNaN(val1) && numberIsNaN(val2);
    }

    if (_typeof$1(val2) !== 'object' || val1 === null || val2 === null) {
      return false;
    }

    if (Object.getPrototypeOf(val1) !== Object.getPrototypeOf(val2)) {
      return false;
    }
  } else {
    if (val1 === null || _typeof$1(val1) !== 'object') {
      if (val2 === null || _typeof$1(val2) !== 'object') {
        // eslint-disable-next-line eqeqeq
        return val1 == val2;
      }

      return false;
    }

    if (val2 === null || _typeof$1(val2) !== 'object') {
      return false;
    }
  }

  var val1Tag = objectToString(val1);
  var val2Tag = objectToString(val2);

  if (val1Tag !== val2Tag) {
    return false;
  }

  if (Array.isArray(val1)) {
    // Check for sparse arrays and general fast path
    if (val1.length !== val2.length) {
      return false;
    }

    var keys1 = getOwnNonIndexProperties(val1);
    var keys2 = getOwnNonIndexProperties(val2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    return keyCheck(val1, val2, strict, memos, kIsArray, keys1);
  } // [browserify] This triggers on certain types in IE (Map/Set) so we don't
  // wan't to early return out of the rest of the checks. However we can check
  // if the second value is one of these values and the first isn't.


  if (val1Tag === '[object Object]') {
    // return keyCheck(val1, val2, strict, memos, kNoIterator);
    if (!isMap(val1) && isMap(val2) || !isSet(val1) && isSet(val2)) {
      return false;
    }
  }

  if (isDate(val1)) {
    if (!isDate(val2) || Date.prototype.getTime.call(val1) !== Date.prototype.getTime.call(val2)) {
      return false;
    }
  } else if (isRegExp$1(val1)) {
    if (!isRegExp$1(val2) || !areSimilarRegExps(val1, val2)) {
      return false;
    }
  } else if (isNativeError(val1) || val1 instanceof Error) {
    // Do not compare the stack as it might differ even though the error itself
    // is otherwise identical.
    if (val1.message !== val2.message || val1.name !== val2.name) {
      return false;
    }
  } else if (isArrayBufferView(val1)) {
    if (!strict && (isFloat32Array(val1) || isFloat64Array(val1))) {
      if (!areSimilarFloatArrays(val1, val2)) {
        return false;
      }
    } else if (!areSimilarTypedArrays(val1, val2)) {
      return false;
    } // Buffer.compare returns true, so val1.length === val2.length. If they both
    // only contain numeric keys, we don't need to exam further than checking
    // the symbols.


    var _keys = getOwnNonIndexProperties(val1);

    var _keys2 = getOwnNonIndexProperties(val2);

    if (_keys.length !== _keys2.length) {
      return false;
    }

    return keyCheck(val1, val2, strict, memos, kNoIterator, _keys);
  } else if (isSet(val1)) {
    if (!isSet(val2) || val1.size !== val2.size) {
      return false;
    }

    return keyCheck(val1, val2, strict, memos, kIsSet);
  } else if (isMap(val1)) {
    if (!isMap(val2) || val1.size !== val2.size) {
      return false;
    }

    return keyCheck(val1, val2, strict, memos, kIsMap);
  } else if (isAnyArrayBuffer(val1)) {
    if (!areEqualArrayBuffers(val1, val2)) {
      return false;
    }
  } else if (isBoxedPrimitive(val1) && !isEqualBoxedPrimitive(val1, val2)) {
    return false;
  }

  return keyCheck(val1, val2, strict, memos, kNoIterator);
}

function getEnumerables(val, keys) {
  return keys.filter(function (k) {
    return propertyIsEnumerable(val, k);
  });
}

function keyCheck(val1, val2, strict, memos, iterationType, aKeys) {
  // For all remaining Object pairs, including Array, objects and Maps,
  // equivalence is determined by having:
  // a) The same number of owned enumerable properties
  // b) The same set of keys/indexes (although not necessarily the same order)
  // c) Equivalent values for every corresponding key/index
  // d) For Sets and Maps, equal contents
  // Note: this accounts for both named and indexed properties on Arrays.
  if (arguments.length === 5) {
    aKeys = Object.keys(val1);
    var bKeys = Object.keys(val2); // The pair must have the same number of owned properties.

    if (aKeys.length !== bKeys.length) {
      return false;
    }
  } // Cheap key test


  var i = 0;

  for (; i < aKeys.length; i++) {
    if (!hasOwnProperty(val2, aKeys[i])) {
      return false;
    }
  }

  if (strict && arguments.length === 5) {
    var symbolKeysA = objectGetOwnPropertySymbols(val1);

    if (symbolKeysA.length !== 0) {
      var count = 0;

      for (i = 0; i < symbolKeysA.length; i++) {
        var key = symbolKeysA[i];

        if (propertyIsEnumerable(val1, key)) {
          if (!propertyIsEnumerable(val2, key)) {
            return false;
          }

          aKeys.push(key);
          count++;
        } else if (propertyIsEnumerable(val2, key)) {
          return false;
        }
      }

      var symbolKeysB = objectGetOwnPropertySymbols(val2);

      if (symbolKeysA.length !== symbolKeysB.length && getEnumerables(val2, symbolKeysB).length !== count) {
        return false;
      }
    } else {
      var _symbolKeysB = objectGetOwnPropertySymbols(val2);

      if (_symbolKeysB.length !== 0 && getEnumerables(val2, _symbolKeysB).length !== 0) {
        return false;
      }
    }
  }

  if (aKeys.length === 0 && (iterationType === kNoIterator || iterationType === kIsArray && val1.length === 0 || val1.size === 0)) {
    return true;
  } // Use memos to handle cycles.


  if (memos === undefined) {
    memos = {
      val1: new Map(),
      val2: new Map(),
      position: 0
    };
  } else {
    // We prevent up to two map.has(x) calls by directly retrieving the value
    // and checking for undefined. The map can only contain numbers, so it is
    // safe to check for undefined only.
    var val2MemoA = memos.val1.get(val1);

    if (val2MemoA !== undefined) {
      var val2MemoB = memos.val2.get(val2);

      if (val2MemoB !== undefined) {
        return val2MemoA === val2MemoB;
      }
    }

    memos.position++;
  }

  memos.val1.set(val1, memos.position);
  memos.val2.set(val2, memos.position);
  var areEq = objEquiv(val1, val2, strict, aKeys, memos, iterationType);
  memos.val1.delete(val1);
  memos.val2.delete(val2);
  return areEq;
}

function setHasEqualElement(set, val1, strict, memo) {
  // Go looking.
  var setValues = arrayFromSet(set);

  for (var i = 0; i < setValues.length; i++) {
    var val2 = setValues[i];

    if (innerDeepEqual(val1, val2, strict, memo)) {
      // Remove the matching element to make sure we do not check that again.
      set.delete(val2);
      return true;
    }
  }

  return false;
} // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Loose_equality_using
// Sadly it is not possible to detect corresponding values properly in case the
// type is a string, number, bigint or boolean. The reason is that those values
// can match lots of different string values (e.g., 1n == '+00001').


function findLooseMatchingPrimitives(prim) {
  switch (_typeof$1(prim)) {
    case 'undefined':
      return null;

    case 'object':
      // Only pass in null as object!
      return undefined;

    case 'symbol':
      return false;

    case 'string':
      prim = +prim;
    // Loose equal entries exist only if the string is possible to convert to
    // a regular number and not NaN.
    // Fall through

    case 'number':
      if (numberIsNaN(prim)) {
        return false;
      }

  }

  return true;
}

function setMightHaveLoosePrim(a, b, prim) {
  var altValue = findLooseMatchingPrimitives(prim);
  if (altValue != null) return altValue;
  return b.has(altValue) && !a.has(altValue);
}

function mapMightHaveLoosePrim(a, b, prim, item, memo) {
  var altValue = findLooseMatchingPrimitives(prim);

  if (altValue != null) {
    return altValue;
  }

  var curB = b.get(altValue);

  if (curB === undefined && !b.has(altValue) || !innerDeepEqual(item, curB, false, memo)) {
    return false;
  }

  return !a.has(altValue) && innerDeepEqual(item, curB, false, memo);
}

function setEquiv(a, b, strict, memo) {
  // This is a lazily initiated Set of entries which have to be compared
  // pairwise.
  var set = null;
  var aValues = arrayFromSet(a);

  for (var i = 0; i < aValues.length; i++) {
    var val = aValues[i]; // Note: Checking for the objects first improves the performance for object
    // heavy sets but it is a minor slow down for primitives. As they are fast
    // to check this improves the worst case scenario instead.

    if (_typeof$1(val) === 'object' && val !== null) {
      if (set === null) {
        set = new Set();
      } // If the specified value doesn't exist in the second set its an not null
      // object (or non strict only: a not matching primitive) we'll need to go
      // hunting for something thats deep-(strict-)equal to it. To make this
      // O(n log n) complexity we have to copy these values in a new set first.


      set.add(val);
    } else if (!b.has(val)) {
      if (strict) return false; // Fast path to detect missing string, symbol, undefined and null values.

      if (!setMightHaveLoosePrim(a, b, val)) {
        return false;
      }

      if (set === null) {
        set = new Set();
      }

      set.add(val);
    }
  }

  if (set !== null) {
    var bValues = arrayFromSet(b);

    for (var _i = 0; _i < bValues.length; _i++) {
      var _val = bValues[_i]; // We have to check if a primitive value is already
      // matching and only if it's not, go hunting for it.

      if (_typeof$1(_val) === 'object' && _val !== null) {
        if (!setHasEqualElement(set, _val, strict, memo)) return false;
      } else if (!strict && !a.has(_val) && !setHasEqualElement(set, _val, strict, memo)) {
        return false;
      }
    }

    return set.size === 0;
  }

  return true;
}

function mapHasEqualEntry(set, map, key1, item1, strict, memo) {
  // To be able to handle cases like:
  //   Map([[{}, 'a'], [{}, 'b']]) vs Map([[{}, 'b'], [{}, 'a']])
  // ... we need to consider *all* matching keys, not just the first we find.
  var setValues = arrayFromSet(set);

  for (var i = 0; i < setValues.length; i++) {
    var key2 = setValues[i];

    if (innerDeepEqual(key1, key2, strict, memo) && innerDeepEqual(item1, map.get(key2), strict, memo)) {
      set.delete(key2);
      return true;
    }
  }

  return false;
}

function mapEquiv(a, b, strict, memo) {
  var set = null;
  var aEntries = arrayFromMap(a);

  for (var i = 0; i < aEntries.length; i++) {
    var _aEntries$i = _slicedToArray(aEntries[i], 2),
        key = _aEntries$i[0],
        item1 = _aEntries$i[1];

    if (_typeof$1(key) === 'object' && key !== null) {
      if (set === null) {
        set = new Set();
      }

      set.add(key);
    } else {
      // By directly retrieving the value we prevent another b.has(key) check in
      // almost all possible cases.
      var item2 = b.get(key);

      if (item2 === undefined && !b.has(key) || !innerDeepEqual(item1, item2, strict, memo)) {
        if (strict) return false; // Fast path to detect missing string, symbol, undefined and null
        // keys.

        if (!mapMightHaveLoosePrim(a, b, key, item1, memo)) return false;

        if (set === null) {
          set = new Set();
        }

        set.add(key);
      }
    }
  }

  if (set !== null) {
    var bEntries = arrayFromMap(b);

    for (var _i2 = 0; _i2 < bEntries.length; _i2++) {
      var _bEntries$_i = _slicedToArray(bEntries[_i2], 2),
          key = _bEntries$_i[0],
          item = _bEntries$_i[1];

      if (_typeof$1(key) === 'object' && key !== null) {
        if (!mapHasEqualEntry(set, a, key, item, strict, memo)) return false;
      } else if (!strict && (!a.has(key) || !innerDeepEqual(a.get(key), item, false, memo)) && !mapHasEqualEntry(set, a, key, item, false, memo)) {
        return false;
      }
    }

    return set.size === 0;
  }

  return true;
}

function objEquiv(a, b, strict, keys, memos, iterationType) {
  // Sets and maps don't have their entries accessible via normal object
  // properties.
  var i = 0;

  if (iterationType === kIsSet) {
    if (!setEquiv(a, b, strict, memos)) {
      return false;
    }
  } else if (iterationType === kIsMap) {
    if (!mapEquiv(a, b, strict, memos)) {
      return false;
    }
  } else if (iterationType === kIsArray) {
    for (; i < a.length; i++) {
      if (hasOwnProperty(a, i)) {
        if (!hasOwnProperty(b, i) || !innerDeepEqual(a[i], b[i], strict, memos)) {
          return false;
        }
      } else if (hasOwnProperty(b, i)) {
        return false;
      } else {
        // Array is sparse.
        var keysA = Object.keys(a);

        for (; i < keysA.length; i++) {
          var key = keysA[i];

          if (!hasOwnProperty(b, key) || !innerDeepEqual(a[key], b[key], strict, memos)) {
            return false;
          }
        }

        if (keysA.length !== Object.keys(b).length) {
          return false;
        }

        return true;
      }
    }
  } // The pair must have equivalent values for every corresponding key.
  // Possibly expensive deep test:


  for (i = 0; i < keys.length; i++) {
    var _key = keys[i];

    if (!innerDeepEqual(a[_key], b[_key], strict, memos)) {
      return false;
    }
  }

  return true;
}

function isDeepEqual$1(val1, val2) {
  return innerDeepEqual(val1, val2, kLoose);
}

function isDeepStrictEqual$1(val1, val2) {
  return innerDeepEqual(val1, val2, kStrict);
}

var comparisons = {
  isDeepEqual: isDeepEqual$1,
  isDeepStrictEqual: isDeepStrictEqual$1
};

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var _require = errors,
    _require$codes = _require.codes,
    ERR_AMBIGUOUS_ARGUMENT = _require$codes.ERR_AMBIGUOUS_ARGUMENT,
    ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
    ERR_INVALID_ARG_VALUE = _require$codes.ERR_INVALID_ARG_VALUE,
    ERR_INVALID_RETURN_VALUE = _require$codes.ERR_INVALID_RETURN_VALUE,
    ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS;
var AssertionError = assertion_error;
var _require2 = util$1,
    inspect = _require2.inspect;
var _require$types = util$1.types,
    isPromise = _require$types.isPromise,
    isRegExp = _require$types.isRegExp;
var objectAssign = Object.assign ? Object.assign : es6ObjectAssign.assign;
var objectIs = Object.is ? Object.is : objectIs$2;
var isDeepEqual;
var isDeepStrictEqual;

function lazyLoadComparison() {
  var comparison = comparisons;
  isDeepEqual = comparison.isDeepEqual;
  isDeepStrictEqual = comparison.isDeepStrictEqual;
} // Escape control characters but not \n and \t to keep the line breaks and

var warned = false; // The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = assert$2.exports = ok;
var NO_EXCEPTION_SENTINEL = {}; // All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided. All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function innerFail(obj) {
  if (obj.message instanceof Error) throw obj.message;
  throw new AssertionError(obj);
}

function fail(actual, expected, message, operator, stackStartFn) {
  var argsLen = arguments.length;
  var internalMessage;

  if (argsLen === 0) {
    internalMessage = 'Failed';
  } else if (argsLen === 1) {
    message = actual;
    actual = undefined;
  } else {
    if (warned === false) {
      warned = true;
      var warn = console.warn.bind(console);
      warn('assert.fail() with more than one argument is deprecated. ' + 'Please use assert.strictEqual() instead or only pass a message.', 'DeprecationWarning', 'DEP0094');
    }

    if (argsLen === 2) operator = '!=';
  }

  if (message instanceof Error) throw message;
  var errArgs = {
    actual: actual,
    expected: expected,
    operator: operator === undefined ? 'fail' : operator,
    stackStartFn: stackStartFn || fail
  };

  if (message !== undefined) {
    errArgs.message = message;
  }

  var err = new AssertionError(errArgs);

  if (internalMessage) {
    err.message = internalMessage;
    err.generatedMessage = true;
  }

  throw err;
}

assert.fail = fail; // The AssertionError is defined in internal/error.

assert.AssertionError = AssertionError;

function innerOk(fn, argLen, value, message) {
  if (!value) {
    var generatedMessage = false;

    if (argLen === 0) {
      generatedMessage = true;
      message = 'No value argument passed to `assert.ok()`';
    } else if (message instanceof Error) {
      throw message;
    }

    var err = new AssertionError({
      actual: value,
      expected: true,
      message: message,
      operator: '==',
      stackStartFn: fn
    });
    err.generatedMessage = generatedMessage;
    throw err;
  }
} // Pure assertion tests whether a value is truthy, as determined
// by !!value.


function ok() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  innerOk.apply(void 0, [ok, args.length].concat(args));
}

assert.ok = ok; // The equality assertion tests shallow, coercive equality with ==.

/* eslint-disable no-restricted-properties */

assert.equal = function equal(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  } // eslint-disable-next-line eqeqeq


  if (actual != expected) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: '==',
      stackStartFn: equal
    });
  }
}; // The non-equality assertion tests for whether two objects are not
// equal with !=.


assert.notEqual = function notEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  } // eslint-disable-next-line eqeqeq


  if (actual == expected) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: '!=',
      stackStartFn: notEqual
    });
  }
}; // The equivalence assertion tests a deep equality relation.


assert.deepEqual = function deepEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  }

  if (isDeepEqual === undefined) lazyLoadComparison();

  if (!isDeepEqual(actual, expected)) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: 'deepEqual',
      stackStartFn: deepEqual
    });
  }
}; // The non-equivalence assertion tests for any deep inequality.


assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  }

  if (isDeepEqual === undefined) lazyLoadComparison();

  if (isDeepEqual(actual, expected)) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: 'notDeepEqual',
      stackStartFn: notDeepEqual
    });
  }
};
/* eslint-enable */


assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  }

  if (isDeepEqual === undefined) lazyLoadComparison();

  if (!isDeepStrictEqual(actual, expected)) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: 'deepStrictEqual',
      stackStartFn: deepStrictEqual
    });
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;

function notDeepStrictEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  }

  if (isDeepEqual === undefined) lazyLoadComparison();

  if (isDeepStrictEqual(actual, expected)) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: 'notDeepStrictEqual',
      stackStartFn: notDeepStrictEqual
    });
  }
}

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  }

  if (!objectIs(actual, expected)) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: 'strictEqual',
      stackStartFn: strictEqual
    });
  }
};

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  }

  if (objectIs(actual, expected)) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: 'notStrictEqual',
      stackStartFn: notStrictEqual
    });
  }
};

var Comparison = function Comparison(obj, keys, actual) {
  var _this = this;

  _classCallCheck(this, Comparison);

  keys.forEach(function (key) {
    if (key in obj) {
      if (actual !== undefined && typeof actual[key] === 'string' && isRegExp(obj[key]) && obj[key].test(actual[key])) {
        _this[key] = actual[key];
      } else {
        _this[key] = obj[key];
      }
    }
  });
};

function compareExceptionKey(actual, expected, key, message, keys, fn) {
  if (!(key in actual) || !isDeepStrictEqual(actual[key], expected[key])) {
    if (!message) {
      // Create placeholder objects to create a nice output.
      var a = new Comparison(actual, keys);
      var b = new Comparison(expected, keys, actual);
      var err = new AssertionError({
        actual: a,
        expected: b,
        operator: 'deepStrictEqual',
        stackStartFn: fn
      });
      err.actual = actual;
      err.expected = expected;
      err.operator = fn.name;
      throw err;
    }

    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: fn.name,
      stackStartFn: fn
    });
  }
}

function expectedException(actual, expected, msg, fn) {
  if (typeof expected !== 'function') {
    if (isRegExp(expected)) return expected.test(actual); // assert.doesNotThrow does not accept objects.

    if (arguments.length === 2) {
      throw new ERR_INVALID_ARG_TYPE('expected', ['Function', 'RegExp'], expected);
    } // Handle primitives properly.


    if (_typeof(actual) !== 'object' || actual === null) {
      var err = new AssertionError({
        actual: actual,
        expected: expected,
        message: msg,
        operator: 'deepStrictEqual',
        stackStartFn: fn
      });
      err.operator = fn.name;
      throw err;
    }

    var keys = Object.keys(expected); // Special handle errors to make sure the name and the message are compared
    // as well.

    if (expected instanceof Error) {
      keys.push('name', 'message');
    } else if (keys.length === 0) {
      throw new ERR_INVALID_ARG_VALUE('error', expected, 'may not be an empty object');
    }

    if (isDeepEqual === undefined) lazyLoadComparison();
    keys.forEach(function (key) {
      if (typeof actual[key] === 'string' && isRegExp(expected[key]) && expected[key].test(actual[key])) {
        return;
      }

      compareExceptionKey(actual, expected, key, msg, keys, fn);
    });
    return true;
  } // Guard instanceof against arrow functions as they don't have a prototype.


  if (expected.prototype !== undefined && actual instanceof expected) {
    return true;
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function getActual(fn) {
  if (typeof fn !== 'function') {
    throw new ERR_INVALID_ARG_TYPE('fn', 'Function', fn);
  }

  try {
    fn();
  } catch (e) {
    return e;
  }

  return NO_EXCEPTION_SENTINEL;
}

function checkIsPromise(obj) {
  // Accept native ES6 promises and promises that are implemented in a similar
  // way. Do not accept thenables that use a function as `obj` and that have no
  // `catch` handler.
  // TODO: thenables are checked up until they have the correct methods,
  // but according to documentation, the `then` method should receive
  // the `fulfill` and `reject` arguments as well or it may be never resolved.
  return isPromise(obj) || obj !== null && _typeof(obj) === 'object' && typeof obj.then === 'function' && typeof obj.catch === 'function';
}

function waitForActual(promiseFn) {
  return Promise.resolve().then(function () {
    var resultPromise;

    if (typeof promiseFn === 'function') {
      // Return a rejected promise if `promiseFn` throws synchronously.
      resultPromise = promiseFn(); // Fail in case no promise is returned.

      if (!checkIsPromise(resultPromise)) {
        throw new ERR_INVALID_RETURN_VALUE('instance of Promise', 'promiseFn', resultPromise);
      }
    } else if (checkIsPromise(promiseFn)) {
      resultPromise = promiseFn;
    } else {
      throw new ERR_INVALID_ARG_TYPE('promiseFn', ['Function', 'Promise'], promiseFn);
    }

    return Promise.resolve().then(function () {
      return resultPromise;
    }).then(function () {
      return NO_EXCEPTION_SENTINEL;
    }).catch(function (e) {
      return e;
    });
  });
}

function expectsError(stackStartFn, actual, error, message) {
  if (typeof error === 'string') {
    if (arguments.length === 4) {
      throw new ERR_INVALID_ARG_TYPE('error', ['Object', 'Error', 'Function', 'RegExp'], error);
    }

    if (_typeof(actual) === 'object' && actual !== null) {
      if (actual.message === error) {
        throw new ERR_AMBIGUOUS_ARGUMENT('error/message', "The error message \"".concat(actual.message, "\" is identical to the message."));
      }
    } else if (actual === error) {
      throw new ERR_AMBIGUOUS_ARGUMENT('error/message', "The error \"".concat(actual, "\" is identical to the message."));
    }

    message = error;
    error = undefined;
  } else if (error != null && _typeof(error) !== 'object' && typeof error !== 'function') {
    throw new ERR_INVALID_ARG_TYPE('error', ['Object', 'Error', 'Function', 'RegExp'], error);
  }

  if (actual === NO_EXCEPTION_SENTINEL) {
    var details = '';

    if (error && error.name) {
      details += " (".concat(error.name, ")");
    }

    details += message ? ": ".concat(message) : '.';
    var fnType = stackStartFn.name === 'rejects' ? 'rejection' : 'exception';
    innerFail({
      actual: undefined,
      expected: error,
      operator: stackStartFn.name,
      message: "Missing expected ".concat(fnType).concat(details),
      stackStartFn: stackStartFn
    });
  }

  if (error && !expectedException(actual, error, message, stackStartFn)) {
    throw actual;
  }
}

function expectsNoError(stackStartFn, actual, error, message) {
  if (actual === NO_EXCEPTION_SENTINEL) return;

  if (typeof error === 'string') {
    message = error;
    error = undefined;
  }

  if (!error || expectedException(actual, error)) {
    var details = message ? ": ".concat(message) : '.';
    var fnType = stackStartFn.name === 'doesNotReject' ? 'rejection' : 'exception';
    innerFail({
      actual: actual,
      expected: error,
      operator: stackStartFn.name,
      message: "Got unwanted ".concat(fnType).concat(details, "\n") + "Actual message: \"".concat(actual && actual.message, "\""),
      stackStartFn: stackStartFn
    });
  }

  throw actual;
}

assert.throws = function throws(promiseFn) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  expectsError.apply(void 0, [throws, getActual(promiseFn)].concat(args));
};

assert.rejects = function rejects(promiseFn) {
  for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  return waitForActual(promiseFn).then(function (result) {
    return expectsError.apply(void 0, [rejects, result].concat(args));
  });
};

assert.doesNotThrow = function doesNotThrow(fn) {
  for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
  }

  expectsNoError.apply(void 0, [doesNotThrow, getActual(fn)].concat(args));
};

assert.doesNotReject = function doesNotReject(fn) {
  for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    args[_key5 - 1] = arguments[_key5];
  }

  return waitForActual(fn).then(function (result) {
    return expectsNoError.apply(void 0, [doesNotReject, result].concat(args));
  });
};

assert.ifError = function ifError(err) {
  if (err !== null && err !== undefined) {
    var message = 'ifError got unwanted exception: ';

    if (_typeof(err) === 'object' && typeof err.message === 'string') {
      if (err.message.length === 0 && err.constructor) {
        message += err.constructor.name;
      } else {
        message += err.message;
      }
    } else {
      message += inspect(err);
    }

    var newErr = new AssertionError({
      actual: err,
      expected: null,
      operator: 'ifError',
      message: message,
      stackStartFn: ifError
    }); // Make sure we actually have a stack trace!

    var origStack = err.stack;

    if (typeof origStack === 'string') {
      // This will remove any duplicated frames from the error frames taken
      // from within `ifError` and add the original error frames to the newly
      // created ones.
      var tmp2 = origStack.split('\n');
      tmp2.shift(); // Filter all frames existing in err.stack.

      var tmp1 = newErr.stack.split('\n');

      for (var i = 0; i < tmp2.length; i++) {
        // Find the first occurrence of the frame.
        var pos = tmp1.indexOf(tmp2[i]);

        if (pos !== -1) {
          // Only keep new frames.
          tmp1 = tmp1.slice(0, pos);
          break;
        }
      }

      newErr.stack = "".concat(tmp1.join('\n'), "\n").concat(tmp2.join('\n'));
    }

    throw newErr;
  }
}; // Expose a strict only variant of assert


function strict() {
  for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    args[_key6] = arguments[_key6];
  }

  innerOk.apply(void 0, [strict, args.length].concat(args));
}

assert.strict = objectAssign(strict, assert, {
  equal: assert.strictEqual,
  deepEqual: assert.deepStrictEqual,
  notEqual: assert.notStrictEqual,
  notDeepEqual: assert.notDeepStrictEqual
});
assert.strict.strict = assert.strict;

(function (exports) {
  /* eslint camelcase: "off" */

  var assert = assert$2.exports;
  var Zstream = (pako_lib_zlib_zstream__WEBPACK_IMPORTED_MODULE_0___default());
  var zlib_deflate = pako_lib_zlib_deflate_js__WEBPACK_IMPORTED_MODULE_1__;
  var zlib_inflate = pako_lib_zlib_inflate_js__WEBPACK_IMPORTED_MODULE_2__;
  var constants = (pako_lib_zlib_constants__WEBPACK_IMPORTED_MODULE_3___default());

  for (var key in constants) {
    exports[key] = constants[key];
  } // zlib modes


  exports.NONE = 0;
  exports.DEFLATE = 1;
  exports.INFLATE = 2;
  exports.GZIP = 3;
  exports.GUNZIP = 4;
  exports.DEFLATERAW = 5;
  exports.INFLATERAW = 6;
  exports.UNZIP = 7;
  var GZIP_HEADER_ID1 = 0x1f;
  var GZIP_HEADER_ID2 = 0x8b;
  /**
   * Emulate Node's zlib C++ layer for use by the JS layer in index.js
   */

  function Zlib(mode) {
    if (typeof mode !== 'number' || mode < exports.DEFLATE || mode > exports.UNZIP) {
      throw new TypeError('Bad argument');
    }

    this.dictionary = null;
    this.err = 0;
    this.flush = 0;
    this.init_done = false;
    this.level = 0;
    this.memLevel = 0;
    this.mode = mode;
    this.strategy = 0;
    this.windowBits = 0;
    this.write_in_progress = false;
    this.pending_close = false;
    this.gzip_id_bytes_read = 0;
  }

  Zlib.prototype.close = function () {
    if (this.write_in_progress) {
      this.pending_close = true;
      return;
    }

    this.pending_close = false;
    assert(this.init_done, 'close before init');
    assert(this.mode <= exports.UNZIP);

    if (this.mode === exports.DEFLATE || this.mode === exports.GZIP || this.mode === exports.DEFLATERAW) {
      zlib_deflate.deflateEnd(this.strm);
    } else if (this.mode === exports.INFLATE || this.mode === exports.GUNZIP || this.mode === exports.INFLATERAW || this.mode === exports.UNZIP) {
      zlib_inflate.inflateEnd(this.strm);
    }

    this.mode = exports.NONE;
    this.dictionary = null;
  };

  Zlib.prototype.write = function (flush, input, in_off, in_len, out, out_off, out_len) {
    return this._write(true, flush, input, in_off, in_len, out, out_off, out_len);
  };

  Zlib.prototype.writeSync = function (flush, input, in_off, in_len, out, out_off, out_len) {
    return this._write(false, flush, input, in_off, in_len, out, out_off, out_len);
  };

  Zlib.prototype._write = function (async, flush, input, in_off, in_len, out, out_off, out_len) {
    assert.equal(arguments.length, 8);
    assert(this.init_done, 'write before init');
    assert(this.mode !== exports.NONE, 'already finalized');
    assert.equal(false, this.write_in_progress, 'write already in progress');
    assert.equal(false, this.pending_close, 'close is pending');
    this.write_in_progress = true;
    assert.equal(false, flush === undefined, 'must provide flush value');
    this.write_in_progress = true;

    if (flush !== exports.Z_NO_FLUSH && flush !== exports.Z_PARTIAL_FLUSH && flush !== exports.Z_SYNC_FLUSH && flush !== exports.Z_FULL_FLUSH && flush !== exports.Z_FINISH && flush !== exports.Z_BLOCK) {
      throw new Error('Invalid flush value');
    }

    if (input == null) {
      input = Buffer$4.alloc(0);
      in_len = 0;
      in_off = 0;
    }

    this.strm.avail_in = in_len;
    this.strm.input = input;
    this.strm.next_in = in_off;
    this.strm.avail_out = out_len;
    this.strm.output = out;
    this.strm.next_out = out_off;
    this.flush = flush;

    if (!async) {
      // sync version
      this._process();

      if (this._checkError()) {
        return this._afterSync();
      }

      return;
    } // async version


    var self = this;
    browser$1$1.nextTick(function () {
      self._process();

      self._after();
    });
    return this;
  };

  Zlib.prototype._afterSync = function () {
    var avail_out = this.strm.avail_out;
    var avail_in = this.strm.avail_in;
    this.write_in_progress = false;
    return [avail_in, avail_out];
  };

  Zlib.prototype._process = function () {
    var next_expected_header_byte = null; // If the avail_out is left at 0, then it means that it ran out
    // of room.  If there was avail_out left over, then it means
    // that all of the input was consumed.

    switch (this.mode) {
      case exports.DEFLATE:
      case exports.GZIP:
      case exports.DEFLATERAW:
        this.err = zlib_deflate.deflate(this.strm, this.flush);
        break;

      case exports.UNZIP:
        if (this.strm.avail_in > 0) {
          next_expected_header_byte = this.strm.next_in;
        }

        switch (this.gzip_id_bytes_read) {
          case 0:
            if (next_expected_header_byte === null) {
              break;
            }

            if (this.strm.input[next_expected_header_byte] === GZIP_HEADER_ID1) {
              this.gzip_id_bytes_read = 1;
              next_expected_header_byte++;

              if (this.strm.avail_in === 1) {
                // The only available byte was already read.
                break;
              }
            } else {
              this.mode = exports.INFLATE;
              break;
            }

          // fallthrough

          case 1:
            if (next_expected_header_byte === null) {
              break;
            }

            if (this.strm.input[next_expected_header_byte] === GZIP_HEADER_ID2) {
              this.gzip_id_bytes_read = 2;
              this.mode = exports.GUNZIP;
            } else {
              // There is no actual difference between INFLATE and INFLATERAW
              // (after initialization).
              this.mode = exports.INFLATE;
            }

            break;

          default:
            throw new Error('invalid number of gzip magic number bytes read');
        }

      // fallthrough

      case exports.INFLATE:
      case exports.GUNZIP:
      case exports.INFLATERAW:
        this.err = zlib_inflate.inflate(this.strm, this.flush // If data was encoded with dictionary
        );

        if (this.err === exports.Z_NEED_DICT && this.dictionary) {
          // Load it
          this.err = zlib_inflate.inflateSetDictionary(this.strm, this.dictionary);

          if (this.err === exports.Z_OK) {
            // And try to decode again
            this.err = zlib_inflate.inflate(this.strm, this.flush);
          } else if (this.err === exports.Z_DATA_ERROR) {
            // Both inflateSetDictionary() and inflate() return Z_DATA_ERROR.
            // Make it possible for After() to tell a bad dictionary from bad
            // input.
            this.err = exports.Z_NEED_DICT;
          }
        }

        while (this.strm.avail_in > 0 && this.mode === exports.GUNZIP && this.err === exports.Z_STREAM_END && this.strm.next_in[0] !== 0x00) {
          // Bytes remain in input buffer. Perhaps this is another compressed
          // member in the same archive, or just trailing garbage.
          // Trailing zero bytes are okay, though, since they are frequently
          // used for padding.
          this.reset();
          this.err = zlib_inflate.inflate(this.strm, this.flush);
        }

        break;

      default:
        throw new Error('Unknown mode ' + this.mode);
    }
  };

  Zlib.prototype._checkError = function () {
    // Acceptable error states depend on the type of zlib stream.
    switch (this.err) {
      case exports.Z_OK:
      case exports.Z_BUF_ERROR:
        if (this.strm.avail_out !== 0 && this.flush === exports.Z_FINISH) {
          this._error('unexpected end of file');

          return false;
        }

        break;

      case exports.Z_STREAM_END:
        // normal statuses, not fatal
        break;

      case exports.Z_NEED_DICT:
        if (this.dictionary == null) {
          this._error('Missing dictionary');
        } else {
          this._error('Bad dictionary');
        }

        return false;

      default:
        // something else.
        this._error('Zlib error');

        return false;
    }

    return true;
  };

  Zlib.prototype._after = function () {
    if (!this._checkError()) {
      return;
    }

    var avail_out = this.strm.avail_out;
    var avail_in = this.strm.avail_in;
    this.write_in_progress = false; // call the write() cb

    this.callback(avail_in, avail_out);

    if (this.pending_close) {
      this.close();
    }
  };

  Zlib.prototype._error = function (message) {
    if (this.strm.msg) {
      message = this.strm.msg;
    }

    this.onerror(message, this.err // no hope of rescue.
    );
    this.write_in_progress = false;

    if (this.pending_close) {
      this.close();
    }
  };

  Zlib.prototype.init = function (windowBits, level, memLevel, strategy, dictionary) {
    assert(arguments.length === 4 || arguments.length === 5, 'init(windowBits, level, memLevel, strategy, [dictionary])');
    assert(windowBits >= 8 && windowBits <= 15, 'invalid windowBits');
    assert(level >= -1 && level <= 9, 'invalid compression level');
    assert(memLevel >= 1 && memLevel <= 9, 'invalid memlevel');
    assert(strategy === exports.Z_FILTERED || strategy === exports.Z_HUFFMAN_ONLY || strategy === exports.Z_RLE || strategy === exports.Z_FIXED || strategy === exports.Z_DEFAULT_STRATEGY, 'invalid strategy');

    this._init(level, windowBits, memLevel, strategy, dictionary);

    this._setDictionary();
  };

  Zlib.prototype.params = function () {
    throw new Error('deflateParams Not supported');
  };

  Zlib.prototype.reset = function () {
    this._reset();

    this._setDictionary();
  };

  Zlib.prototype._init = function (level, windowBits, memLevel, strategy, dictionary) {
    this.level = level;
    this.windowBits = windowBits;
    this.memLevel = memLevel;
    this.strategy = strategy;
    this.flush = exports.Z_NO_FLUSH;
    this.err = exports.Z_OK;

    if (this.mode === exports.GZIP || this.mode === exports.GUNZIP) {
      this.windowBits += 16;
    }

    if (this.mode === exports.UNZIP) {
      this.windowBits += 32;
    }

    if (this.mode === exports.DEFLATERAW || this.mode === exports.INFLATERAW) {
      this.windowBits = -1 * this.windowBits;
    }

    this.strm = new Zstream();

    switch (this.mode) {
      case exports.DEFLATE:
      case exports.GZIP:
      case exports.DEFLATERAW:
        this.err = zlib_deflate.deflateInit2(this.strm, this.level, exports.Z_DEFLATED, this.windowBits, this.memLevel, this.strategy);
        break;

      case exports.INFLATE:
      case exports.GUNZIP:
      case exports.INFLATERAW:
      case exports.UNZIP:
        this.err = zlib_inflate.inflateInit2(this.strm, this.windowBits);
        break;

      default:
        throw new Error('Unknown mode ' + this.mode);
    }

    if (this.err !== exports.Z_OK) {
      this._error('Init error');
    }

    this.dictionary = dictionary;
    this.write_in_progress = false;
    this.init_done = true;
  };

  Zlib.prototype._setDictionary = function () {
    if (this.dictionary == null) {
      return;
    }

    this.err = exports.Z_OK;

    switch (this.mode) {
      case exports.DEFLATE:
      case exports.DEFLATERAW:
        this.err = zlib_deflate.deflateSetDictionary(this.strm, this.dictionary);
        break;
    }

    if (this.err !== exports.Z_OK) {
      this._error('Failed to set dictionary');
    }
  };

  Zlib.prototype._reset = function () {
    this.err = exports.Z_OK;

    switch (this.mode) {
      case exports.DEFLATE:
      case exports.DEFLATERAW:
      case exports.GZIP:
        this.err = zlib_deflate.deflateReset(this.strm);
        break;

      case exports.INFLATE:
      case exports.INFLATERAW:
      case exports.GUNZIP:
        this.err = zlib_inflate.inflateReset(this.strm);
        break;
    }

    if (this.err !== exports.Z_OK) {
      this._error('Failed to reset stream');
    }
  };

  exports.Zlib = Zlib;
})(binding);

(function (exports) {

  var Buffer = buffer.Buffer;
  var Transform = readableBrowser.exports.Transform;
  var binding$1 = binding;
  var util = util$1;
  var assert = assert$2.exports.ok;
  var kMaxLength = buffer.kMaxLength;
  var kRangeErrorMessage = 'Cannot create final Buffer. It would be larger ' + 'than 0x' + kMaxLength.toString(16) + ' bytes'; // zlib doesn't provide these, so kludge them in following the same
  // const naming scheme zlib uses.

  binding$1.Z_MIN_WINDOWBITS = 8;
  binding$1.Z_MAX_WINDOWBITS = 15;
  binding$1.Z_DEFAULT_WINDOWBITS = 15; // fewer than 64 bytes per chunk is stupid.
  // technically it could work with as few as 8, but even 64 bytes
  // is absurdly low.  Usually a MB or more is best.

  binding$1.Z_MIN_CHUNK = 64;
  binding$1.Z_MAX_CHUNK = Infinity;
  binding$1.Z_DEFAULT_CHUNK = 16 * 1024;
  binding$1.Z_MIN_MEMLEVEL = 1;
  binding$1.Z_MAX_MEMLEVEL = 9;
  binding$1.Z_DEFAULT_MEMLEVEL = 8;
  binding$1.Z_MIN_LEVEL = -1;
  binding$1.Z_MAX_LEVEL = 9;
  binding$1.Z_DEFAULT_LEVEL = binding$1.Z_DEFAULT_COMPRESSION; // expose all the zlib constants

  var bkeys = Object.keys(binding$1);

  for (var bk = 0; bk < bkeys.length; bk++) {
    var bkey = bkeys[bk];

    if (bkey.match(/^Z/)) {
      Object.defineProperty(exports, bkey, {
        enumerable: true,
        value: binding$1[bkey],
        writable: false
      });
    }
  } // translation table for return codes.


  var codes = {
    Z_OK: binding$1.Z_OK,
    Z_STREAM_END: binding$1.Z_STREAM_END,
    Z_NEED_DICT: binding$1.Z_NEED_DICT,
    Z_ERRNO: binding$1.Z_ERRNO,
    Z_STREAM_ERROR: binding$1.Z_STREAM_ERROR,
    Z_DATA_ERROR: binding$1.Z_DATA_ERROR,
    Z_MEM_ERROR: binding$1.Z_MEM_ERROR,
    Z_BUF_ERROR: binding$1.Z_BUF_ERROR,
    Z_VERSION_ERROR: binding$1.Z_VERSION_ERROR
  };
  var ckeys = Object.keys(codes);

  for (var ck = 0; ck < ckeys.length; ck++) {
    var ckey = ckeys[ck];
    codes[codes[ckey]] = ckey;
  }

  Object.defineProperty(exports, 'codes', {
    enumerable: true,
    value: Object.freeze(codes),
    writable: false
  });
  exports.Deflate = Deflate;
  exports.Inflate = Inflate;
  exports.Gzip = Gzip;
  exports.Gunzip = Gunzip;
  exports.DeflateRaw = DeflateRaw;
  exports.InflateRaw = InflateRaw;
  exports.Unzip = Unzip;

  exports.createDeflate = function (o) {
    return new Deflate(o);
  };

  exports.createInflate = function (o) {
    return new Inflate(o);
  };

  exports.createDeflateRaw = function (o) {
    return new DeflateRaw(o);
  };

  exports.createInflateRaw = function (o) {
    return new InflateRaw(o);
  };

  exports.createGzip = function (o) {
    return new Gzip(o);
  };

  exports.createGunzip = function (o) {
    return new Gunzip(o);
  };

  exports.createUnzip = function (o) {
    return new Unzip(o);
  }; // Convenience methods.
  // compress/decompress a string or buffer in one step.


  exports.deflate = function (buffer, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }

    return zlibBuffer(new Deflate(opts), buffer, callback);
  };

  exports.deflateSync = function (buffer, opts) {
    return zlibBufferSync(new Deflate(opts), buffer);
  };

  exports.gzip = function (buffer, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }

    return zlibBuffer(new Gzip(opts), buffer, callback);
  };

  exports.gzipSync = function (buffer, opts) {
    return zlibBufferSync(new Gzip(opts), buffer);
  };

  exports.deflateRaw = function (buffer, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }

    return zlibBuffer(new DeflateRaw(opts), buffer, callback);
  };

  exports.deflateRawSync = function (buffer, opts) {
    return zlibBufferSync(new DeflateRaw(opts), buffer);
  };

  exports.unzip = function (buffer, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }

    return zlibBuffer(new Unzip(opts), buffer, callback);
  };

  exports.unzipSync = function (buffer, opts) {
    return zlibBufferSync(new Unzip(opts), buffer);
  };

  exports.inflate = function (buffer, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }

    return zlibBuffer(new Inflate(opts), buffer, callback);
  };

  exports.inflateSync = function (buffer, opts) {
    return zlibBufferSync(new Inflate(opts), buffer);
  };

  exports.gunzip = function (buffer, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }

    return zlibBuffer(new Gunzip(opts), buffer, callback);
  };

  exports.gunzipSync = function (buffer, opts) {
    return zlibBufferSync(new Gunzip(opts), buffer);
  };

  exports.inflateRaw = function (buffer, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }

    return zlibBuffer(new InflateRaw(opts), buffer, callback);
  };

  exports.inflateRawSync = function (buffer, opts) {
    return zlibBufferSync(new InflateRaw(opts), buffer);
  };

  function zlibBuffer(engine, buffer, callback) {
    var buffers = [];
    var nread = 0;
    engine.on('error', onError);
    engine.on('end', onEnd);
    engine.end(buffer);
    flow();

    function flow() {
      var chunk;

      while (null !== (chunk = engine.read())) {
        buffers.push(chunk);
        nread += chunk.length;
      }

      engine.once('readable', flow);
    }

    function onError(err) {
      engine.removeListener('end', onEnd);
      engine.removeListener('readable', flow);
      callback(err);
    }

    function onEnd() {
      var buf;
      var err = null;

      if (nread >= kMaxLength) {
        err = new RangeError(kRangeErrorMessage);
      } else {
        buf = Buffer.concat(buffers, nread);
      }

      buffers = [];
      engine.close();
      callback(err, buf);
    }
  }

  function zlibBufferSync(engine, buffer) {
    if (typeof buffer === 'string') buffer = Buffer.from(buffer);
    if (!Buffer.isBuffer(buffer)) throw new TypeError('Not a string or buffer');
    var flushFlag = engine._finishFlushFlag;
    return engine._processChunk(buffer, flushFlag);
  } // generic zlib
  // minimal 2-byte header


  function Deflate(opts) {
    if (!(this instanceof Deflate)) return new Deflate(opts);
    Zlib.call(this, opts, binding$1.DEFLATE);
  }

  function Inflate(opts) {
    if (!(this instanceof Inflate)) return new Inflate(opts);
    Zlib.call(this, opts, binding$1.INFLATE);
  } // gzip - bigger header, same deflate compression


  function Gzip(opts) {
    if (!(this instanceof Gzip)) return new Gzip(opts);
    Zlib.call(this, opts, binding$1.GZIP);
  }

  function Gunzip(opts) {
    if (!(this instanceof Gunzip)) return new Gunzip(opts);
    Zlib.call(this, opts, binding$1.GUNZIP);
  } // raw - no header


  function DeflateRaw(opts) {
    if (!(this instanceof DeflateRaw)) return new DeflateRaw(opts);
    Zlib.call(this, opts, binding$1.DEFLATERAW);
  }

  function InflateRaw(opts) {
    if (!(this instanceof InflateRaw)) return new InflateRaw(opts);
    Zlib.call(this, opts, binding$1.INFLATERAW);
  } // auto-detect header.


  function Unzip(opts) {
    if (!(this instanceof Unzip)) return new Unzip(opts);
    Zlib.call(this, opts, binding$1.UNZIP);
  }

  function isValidFlushFlag(flag) {
    return flag === binding$1.Z_NO_FLUSH || flag === binding$1.Z_PARTIAL_FLUSH || flag === binding$1.Z_SYNC_FLUSH || flag === binding$1.Z_FULL_FLUSH || flag === binding$1.Z_FINISH || flag === binding$1.Z_BLOCK;
  } // the Zlib class they all inherit from
  // This thing manages the queue of requests, and returns
  // true or false if there is anything in the queue when
  // you call the .write() method.


  function Zlib(opts, mode) {
    var _this = this;

    this._opts = opts = opts || {};
    this._chunkSize = opts.chunkSize || exports.Z_DEFAULT_CHUNK;
    Transform.call(this, opts);

    if (opts.flush && !isValidFlushFlag(opts.flush)) {
      throw new Error('Invalid flush flag: ' + opts.flush);
    }

    if (opts.finishFlush && !isValidFlushFlag(opts.finishFlush)) {
      throw new Error('Invalid flush flag: ' + opts.finishFlush);
    }

    this._flushFlag = opts.flush || binding$1.Z_NO_FLUSH;
    this._finishFlushFlag = typeof opts.finishFlush !== 'undefined' ? opts.finishFlush : binding$1.Z_FINISH;

    if (opts.chunkSize) {
      if (opts.chunkSize < exports.Z_MIN_CHUNK || opts.chunkSize > exports.Z_MAX_CHUNK) {
        throw new Error('Invalid chunk size: ' + opts.chunkSize);
      }
    }

    if (opts.windowBits) {
      if (opts.windowBits < exports.Z_MIN_WINDOWBITS || opts.windowBits > exports.Z_MAX_WINDOWBITS) {
        throw new Error('Invalid windowBits: ' + opts.windowBits);
      }
    }

    if (opts.level) {
      if (opts.level < exports.Z_MIN_LEVEL || opts.level > exports.Z_MAX_LEVEL) {
        throw new Error('Invalid compression level: ' + opts.level);
      }
    }

    if (opts.memLevel) {
      if (opts.memLevel < exports.Z_MIN_MEMLEVEL || opts.memLevel > exports.Z_MAX_MEMLEVEL) {
        throw new Error('Invalid memLevel: ' + opts.memLevel);
      }
    }

    if (opts.strategy) {
      if (opts.strategy != exports.Z_FILTERED && opts.strategy != exports.Z_HUFFMAN_ONLY && opts.strategy != exports.Z_RLE && opts.strategy != exports.Z_FIXED && opts.strategy != exports.Z_DEFAULT_STRATEGY) {
        throw new Error('Invalid strategy: ' + opts.strategy);
      }
    }

    if (opts.dictionary) {
      if (!Buffer.isBuffer(opts.dictionary)) {
        throw new Error('Invalid dictionary: it should be a Buffer instance');
      }
    }

    this._handle = new binding$1.Zlib(mode);
    var self = this;
    this._hadError = false;

    this._handle.onerror = function (message, errno) {
      // there is no way to cleanly recover.
      // continuing only obscures problems.
      _close(self);

      self._hadError = true;
      var error = new Error(message);
      error.errno = errno;
      error.code = exports.codes[errno];
      self.emit('error', error);
    };

    var level = exports.Z_DEFAULT_COMPRESSION;
    if (typeof opts.level === 'number') level = opts.level;
    var strategy = exports.Z_DEFAULT_STRATEGY;
    if (typeof opts.strategy === 'number') strategy = opts.strategy;

    this._handle.init(opts.windowBits || exports.Z_DEFAULT_WINDOWBITS, level, opts.memLevel || exports.Z_DEFAULT_MEMLEVEL, strategy, opts.dictionary);

    this._buffer = Buffer.allocUnsafe(this._chunkSize);
    this._offset = 0;
    this._level = level;
    this._strategy = strategy;
    this.once('end', this.close);
    Object.defineProperty(this, '_closed', {
      get: function get() {
        return !_this._handle;
      },
      configurable: true,
      enumerable: true
    });
  }

  util.inherits(Zlib, Transform);

  Zlib.prototype.params = function (level, strategy, callback) {
    if (level < exports.Z_MIN_LEVEL || level > exports.Z_MAX_LEVEL) {
      throw new RangeError('Invalid compression level: ' + level);
    }

    if (strategy != exports.Z_FILTERED && strategy != exports.Z_HUFFMAN_ONLY && strategy != exports.Z_RLE && strategy != exports.Z_FIXED && strategy != exports.Z_DEFAULT_STRATEGY) {
      throw new TypeError('Invalid strategy: ' + strategy);
    }

    if (this._level !== level || this._strategy !== strategy) {
      var self = this;
      this.flush(binding$1.Z_SYNC_FLUSH, function () {
        assert(self._handle, 'zlib binding closed');

        self._handle.params(level, strategy);

        if (!self._hadError) {
          self._level = level;
          self._strategy = strategy;
          if (callback) callback();
        }
      });
    } else {
      browser$1$1.nextTick(callback);
    }
  };

  Zlib.prototype.reset = function () {
    assert(this._handle, 'zlib binding closed');
    return this._handle.reset();
  }; // This is the _flush function called by the transform class,
  // internally, when the last chunk has been written.


  Zlib.prototype._flush = function (callback) {
    this._transform(Buffer.alloc(0), '', callback);
  };

  Zlib.prototype.flush = function (kind, callback) {
    var _this2 = this;

    var ws = this._writableState;

    if (typeof kind === 'function' || kind === undefined && !callback) {
      callback = kind;
      kind = binding$1.Z_FULL_FLUSH;
    }

    if (ws.ended) {
      if (callback) browser$1$1.nextTick(callback);
    } else if (ws.ending) {
      if (callback) this.once('end', callback);
    } else if (ws.needDrain) {
      if (callback) {
        this.once('drain', function () {
          return _this2.flush(kind, callback);
        });
      }
    } else {
      this._flushFlag = kind;
      this.write(Buffer.alloc(0), '', callback);
    }
  };

  Zlib.prototype.close = function (callback) {
    _close(this, callback);

    browser$1$1.nextTick(emitCloseNT, this);
  };

  function _close(engine, callback) {
    if (callback) browser$1$1.nextTick(callback); // Caller may invoke .close after a zlib error (which will null _handle).

    if (!engine._handle) return;

    engine._handle.close();

    engine._handle = null;
  }

  function emitCloseNT(self) {
    self.emit('close');
  }

  Zlib.prototype._transform = function (chunk, encoding, cb) {
    var flushFlag;
    var ws = this._writableState;
    var ending = ws.ending || ws.ended;
    var last = ending && (!chunk || ws.length === chunk.length);
    if (chunk !== null && !Buffer.isBuffer(chunk)) return cb(new Error('invalid input'));
    if (!this._handle) return cb(new Error('zlib binding closed')); // If it's the last chunk, or a final flush, we use the Z_FINISH flush flag
    // (or whatever flag was provided using opts.finishFlush).
    // If it's explicitly flushing at some other time, then we use
    // Z_FULL_FLUSH. Otherwise, use Z_NO_FLUSH for maximum compression
    // goodness.

    if (last) flushFlag = this._finishFlushFlag;else {
      flushFlag = this._flushFlag; // once we've flushed the last of the queue, stop flushing and
      // go back to the normal behavior.

      if (chunk.length >= ws.length) {
        this._flushFlag = this._opts.flush || binding$1.Z_NO_FLUSH;
      }
    }

    this._processChunk(chunk, flushFlag, cb);
  };

  Zlib.prototype._processChunk = function (chunk, flushFlag, cb) {
    var availInBefore = chunk && chunk.length;
    var availOutBefore = this._chunkSize - this._offset;
    var inOff = 0;
    var self = this;
    var async = typeof cb === 'function';

    if (!async) {
      var buffers = [];
      var nread = 0;
      var error;
      this.on('error', function (er) {
        error = er;
      });
      assert(this._handle, 'zlib binding closed');

      do {
        var res = this._handle.writeSync(flushFlag, chunk, // in
        inOff, // in_off
        availInBefore, // in_len
        this._buffer, // out
        this._offset, //out_off
        availOutBefore); // out_len

      } while (!this._hadError && callback(res[0], res[1]));

      if (this._hadError) {
        throw error;
      }

      if (nread >= kMaxLength) {
        _close(this);

        throw new RangeError(kRangeErrorMessage);
      }

      var buf = Buffer.concat(buffers, nread);

      _close(this);

      return buf;
    }

    assert(this._handle, 'zlib binding closed');

    var req = this._handle.write(flushFlag, chunk, // in
    inOff, // in_off
    availInBefore, // in_len
    this._buffer, // out
    this._offset, //out_off
    availOutBefore); // out_len


    req.buffer = chunk;
    req.callback = callback;

    function callback(availInAfter, availOutAfter) {
      // When the callback is used in an async write, the callback's
      // context is the `req` object that was created. The req object
      // is === this._handle, and that's why it's important to null
      // out the values after they are done being used. `this._handle`
      // can stay in memory longer than the callback and buffer are needed.
      if (this) {
        this.buffer = null;
        this.callback = null;
      }

      if (self._hadError) return;
      var have = availOutBefore - availOutAfter;
      assert(have >= 0, 'have should not go down');

      if (have > 0) {
        var out = self._buffer.slice(self._offset, self._offset + have);

        self._offset += have; // serve some output to the consumer.

        if (async) {
          self.push(out);
        } else {
          buffers.push(out);
          nread += out.length;
        }
      } // exhausted the output buffer, or used all the input create a new one.


      if (availOutAfter === 0 || self._offset >= self._chunkSize) {
        availOutBefore = self._chunkSize;
        self._offset = 0;
        self._buffer = Buffer.allocUnsafe(self._chunkSize);
      }

      if (availOutAfter === 0) {
        // Not actually done.  Need to reprocess.
        // Also, update the availInBefore to the availInAfter value,
        // so that if we have to hit it a third (fourth, etc.) time,
        // it'll have the correct byte counts.
        inOff += availInBefore - availInAfter;
        availInBefore = availInAfter;
        if (!async) return true;

        var newReq = self._handle.write(flushFlag, chunk, inOff, availInBefore, self._buffer, self._offset, self._chunkSize);

        newReq.callback = callback; // this same function

        newReq.buffer = chunk;
        return;
      }

      if (!async) return false; // finished with the chunk.

      cb();
    }
  };

  util.inherits(Deflate, Zlib);
  util.inherits(Inflate, Zlib);
  util.inherits(Gzip, Zlib);
  util.inherits(Gunzip, Zlib);
  util.inherits(DeflateRaw, Zlib);
  util.inherits(InflateRaw, Zlib);
  util.inherits(Unzip, Zlib);
})(lib);

var PDFReference = /*#__PURE__*/function (_stream$Writable) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z)(PDFReference, _stream$Writable);

  function PDFReference(document, id, data) {
    var _this;

    _this = _stream$Writable.call(this, {
      decodeStrings: false
    }) || this;
    _this.finalize = _this.finalize.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(_this));
    _this.document = document;
    _this.id = id;

    if (data == null) {
      data = {};
    }

    _this.data = data;
    _this.gen = 0;
    _this.deflate = null;
    _this.compress = _this.document.compress && !_this.data.Filter;
    _this.uncompressedLength = 0;
    _this.chunks = [];
    return _this;
  }

  var _proto = PDFReference.prototype;

  _proto.initDeflate = function initDeflate() {
    var _this2 = this;

    this.data.Filter = 'FlateDecode';
    this.deflate = lib.createDeflate();
    this.deflate.on('data', function (chunk) {
      _this2.chunks.push(chunk);

      return _this2.data.Length += chunk.length;
    });
    return this.deflate.on('end', this.finalize);
  };

  _proto._write = function _write(chunk, encoding, callback) {
    if (!(chunk instanceof Uint8Array)) {
      chunk = Buffer$4.from(chunk + '\n', 'binary');
    }

    this.uncompressedLength += chunk.length;

    if (this.data.Length == null) {
      this.data.Length = 0;
    }

    if (this.compress) {
      if (!this.deflate) {
        this.initDeflate();
      }

      this.deflate.write(chunk);
    } else {
      this.chunks.push(chunk);
      this.data.Length += chunk.length;
    }

    return callback();
  };

  _proto.end = function end() {
    _stream$Writable.prototype.end.apply(this, arguments);

    if (this.deflate) {
      return this.deflate.end();
    }

    return this.finalize();
  };

  _proto.finalize = function finalize() {
    this.offset = this.document._offset;

    this.document._write(this.id + " " + this.gen + " obj");

    this.document._write(PDFObject$1.convert(this.data));

    if (this.chunks.length) {
      this.document._write('stream');

      for (var _i = 0, _Array$from = Array.from(this.chunks); _i < _Array$from.length; _i++) {
        var chunk = _Array$from[_i];

        this.document._write(chunk);
      }

      this.chunks.length = 0; // free up memory

      this.document._write('\nendstream');
    }

    this.document._write('endobj');

    return this.document._refEnd(this);
  };

  _proto.toString = function toString() {
    return this.id + " " + this.gen + " R";
  };

  return PDFReference;
}(stream.Writable);

var PDFTree = /*#__PURE__*/function () {
  function PDFTree(options) {
    if (options === void 0) {
      options = {};
    }

    this._items = {}; // disable /Limits output for this tree

    this.limits = typeof options.limits === 'boolean' ? options.limits : true;
  }

  var _proto = PDFTree.prototype;

  _proto.add = function add(key, val) {
    return this._items[key] = val;
  };

  _proto.get = function get(key) {
    return this._items[key];
  };

  _proto.toString = function toString() {
    var _this = this;

    // Needs to be sorted by key
    var sortedKeys = Object.keys(this._items).sort(function (a, b) {
      return _this._compareKeys(a, b);
    });
    var out = ['<<'];

    if (this.limits && sortedKeys.length > 1) {
      var first = sortedKeys[0];
      var last = sortedKeys[sortedKeys.length - 1];
      out.push("  /Limits " + PDFObject$1.convert([this._dataForKey(first), this._dataForKey(last)]));
    }

    out.push("  /" + this._keysName() + " [");

    for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(sortedKeys), _step; !(_step = _iterator()).done;) {
      var key = _step.value;
      out.push("    " + PDFObject$1.convert(this._dataForKey(key)) + " " + PDFObject$1.convert(this._items[key]));
    }

    out.push(']');
    out.push('>>');
    return out.join('\n');
  };

  _proto._compareKeys = function _compareKeys() {
    throw new Error('Must be implemented by subclasses');
  };

  _proto._keysName = function _keysName() {
    throw new Error('Must be implemented by subclasses');
  };

  _proto._dataForKey = function _dataForKey() {
    throw new Error('Must be implemented by subclasses');
  };

  return PDFTree;
}();

var PDFNameTree = /*#__PURE__*/function (_PDFTree) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z)(PDFNameTree, _PDFTree);

  function PDFNameTree() {
    return _PDFTree.apply(this, arguments) || this;
  }

  var _proto = PDFNameTree.prototype;

  _proto._compareKeys = function _compareKeys(a, b) {
    return a.localeCompare(b);
  };

  _proto._keysName = function _keysName() {
    return 'Names';
  };

  _proto._dataForKey = function _dataForKey(k) {
    return new String(k);
  };

  return PDFNameTree;
}(PDFTree);

var escapableRe = /[\n\r\t\b\f\(\)\\]/g;
var escapable = {
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
  '\b': '\\b',
  '\f': '\\f',
  '\\': '\\\\',
  '(': '\\(',
  ')': '\\)'
};

var pad = function pad(str, length) {
  return (Array(length + 1).join('0') + str).slice(-length);
}; // Convert little endian UTF-16 to big endian


var swapBytes = function swapBytes(buff) {
  var l = buff.length;

  if (l & 0x01) {
    throw new Error('Buffer length must be even');
  } else {
    for (var i = 0, end = l - 1; i < end; i += 2) {
      var a = buff[i];
      buff[i] = buff[i + 1];
      buff[i + 1] = a;
    }
  }

  return buff;
};

var PDFObject = /*#__PURE__*/function () {
  function PDFObject() {}

  PDFObject.convert = function convert(object) {
    // String literals are converted to the PDF name type
    if (typeof object === 'string') {
      return "/" + object;
    } // String objects are converted to PDF strings (UTF-16)


    if (object instanceof String) {
      var string = object; // Detect if this is a unicode string

      var isUnicode = false;

      for (var i = 0, end = string.length; i < end; i++) {
        if (string.charCodeAt(i) > 0x7f) {
          isUnicode = true;
          break;
        }
      } // If so, encode it as big endian UTF-16


      if (isUnicode) {
        string = swapBytes(Buffer$4.from("\uFEFF" + string, 'utf16le')).toString('binary');
      } // Escape characters as required by the spec


      string = string.replace(escapableRe, function (c) {
        return escapable[c];
      });
      return "(" + string + ")"; // Buffers are converted to PDF hex strings
    }

    if (Buffer$4.isBuffer(object)) {
      return "<" + object.toString('hex') + ">";
    }

    if (object instanceof PDFReference || object instanceof PDFNameTree) {
      return object.toString();
    }

    if (object instanceof Date) {
      return "(D:" + pad(object.getUTCFullYear(), 4) + pad(object.getUTCMonth() + 1, 2) + pad(object.getUTCDate(), 2) + pad(object.getUTCHours(), 2) + pad(object.getUTCMinutes(), 2) + pad(object.getUTCSeconds(), 2) + 'Z)';
    }

    if (Array.isArray(object)) {
      var items = Array.from(object).map(function (e) {
        return PDFObject.convert(e);
      }).join(' ');
      return "[" + items + "]";
    }

    if ({}.toString.call(object) === '[object Object]') {
      var out = ['<<'];

      for (var key in object) {
        var val = object[key];
        out.push("/" + key + " " + PDFObject.convert(val));
      }

      out.push('>>');
      return out.join('\n');
    }

    if (typeof object === 'number') {
      return PDFObject.number(object);
    }

    return "" + object;
  };

  PDFObject.number = function number(n) {
    if (n > -1e21 && n < 1e21) {
      return Math.round(n * 1e6) / 1e6;
    }

    throw new Error("unsupported number: " + n);
  };

  return PDFObject;
}();

var PDFObject$1 = PDFObject;

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

var DEFAULT_MARGINS = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
};
var SIZES = {
  '4A0': [4767.87, 6740.79],
  '2A0': [3370.39, 4767.87],
  A0: [2383.94, 3370.39],
  A1: [1683.78, 2383.94],
  A2: [1190.55, 1683.78],
  A3: [841.89, 1190.55],
  A4: [595.28, 841.89],
  A5: [419.53, 595.28],
  A6: [297.64, 419.53],
  A7: [209.76, 297.64],
  A8: [147.4, 209.76],
  A9: [104.88, 147.4],
  A10: [73.7, 104.88],
  B0: [2834.65, 4008.19],
  B1: [2004.09, 2834.65],
  B2: [1417.32, 2004.09],
  B3: [1000.63, 1417.32],
  B4: [708.66, 1000.63],
  B5: [498.9, 708.66],
  B6: [354.33, 498.9],
  B7: [249.45, 354.33],
  B8: [175.75, 249.45],
  B9: [124.72, 175.75],
  B10: [87.87, 124.72],
  C0: [2599.37, 3676.54],
  C1: [1836.85, 2599.37],
  C2: [1298.27, 1836.85],
  C3: [918.43, 1298.27],
  C4: [649.13, 918.43],
  C5: [459.21, 649.13],
  C6: [323.15, 459.21],
  C7: [229.61, 323.15],
  C8: [161.57, 229.61],
  C9: [113.39, 161.57],
  C10: [79.37, 113.39],
  RA0: [2437.8, 3458.27],
  RA1: [1729.13, 2437.8],
  RA2: [1218.9, 1729.13],
  RA3: [864.57, 1218.9],
  RA4: [609.45, 864.57],
  SRA0: [2551.18, 3628.35],
  SRA1: [1814.17, 2551.18],
  SRA2: [1275.59, 1814.17],
  SRA3: [907.09, 1275.59],
  SRA4: [637.8, 907.09],
  EXECUTIVE: [521.86, 756.0],
  FOLIO: [612.0, 936.0],
  LEGAL: [612.0, 1008.0],
  LETTER: [612.0, 792.0],
  TABLOID: [792.0, 1224.0]
};

var PDFPage = /*#__PURE__*/function () {
  function PDFPage(document, options) {
    if (options === void 0) {
      options = {};
    }

    this.document = document;
    this.size = options.size || 'letter';
    this.layout = options.layout || 'portrait';
    this.userUnit = options.userUnit || 1.0;
    this.margins = DEFAULT_MARGINS; // calculate page dimensions

    var dimensions = Array.isArray(this.size) ? this.size : SIZES[this.size.toUpperCase()];
    this.width = dimensions[this.layout === 'portrait' ? 0 : 1];
    this.height = dimensions[this.layout === 'portrait' ? 1 : 0];
    this.content = this.document.ref(); // Initialize the Font, XObject, and ExtGState dictionaries

    this.resources = this.document.ref({
      ProcSet: ['PDF', 'Text', 'ImageB', 'ImageC', 'ImageI']
    }); // The page dictionary

    this.dictionary = this.document.ref({
      Type: 'Page',
      Parent: this.document._root.data.Pages,
      MediaBox: [0, 0, this.width, this.height],
      Contents: this.content,
      Resources: this.resources,
      UserUnit: this.userUnit
    });
  } // Lazily create these objects


  var _proto = PDFPage.prototype;

  _proto.maxY = function maxY() {
    return this.height;
  };

  _proto.write = function write(chunk) {
    return this.content.write(chunk);
  };

  _proto.end = function end() {
    this.dictionary.end();
    this.resources.end();
    return this.content.end();
  };

  _createClass(PDFPage, [{
    key: "fonts",
    get: function get() {
      var data = this.resources.data;
      return data.Font != null ? data.Font : data.Font = {};
    }
  }, {
    key: "xobjects",
    get: function get() {
      var data = this.resources.data;
      return data.XObject != null ? data.XObject : data.XObject = {};
    }
  }, {
    key: "ext_gstates",
    get: function get() {
      var data = this.resources.data;
      return data.ExtGState != null ? data.ExtGState : data.ExtGState = {};
    }
  }, {
    key: "patterns",
    get: function get() {
      var data = this.resources.data;
      return data.Pattern != null ? data.Pattern : data.Pattern = {};
    }
  }, {
    key: "colorSpaces",
    get: function get() {
      var data = this.resources.data;
      return data.ColorSpace || (data.ColorSpace = {});
    }
  }, {
    key: "annotations",
    get: function get() {
      var data = this.dictionary.data;
      return data.Annots != null ? data.Annots : data.Annots = [];
    }
  }, {
    key: "structParentTreeKey",
    get: function get() {
      var data = this.dictionary.data;
      return data.StructParents != null ? data.StructParents : data.StructParents = this.document.createStructParentTreeNextKey();
    }
  }]);

  return PDFPage;
}();

var wordArrayToBuffer = function wordArrayToBuffer(wordArray) {
  var byteArray = [];

  for (var i = 0; i < wordArray.sigBytes; i++) {
    byteArray.push(wordArray.words[Math.floor(i / 4)] >> 8 * (3 - i % 4) & 0xff);
  }

  return Buffer$4.from(byteArray);
};

var PDFSecurity = /*#__PURE__*/function () {
  function PDFSecurity() {}

  PDFSecurity.generateFileID = function generateFileID(info) {
    if (info === void 0) {
      info = {};
    }

    var infoStr = info.CreationDate.getTime() + "\n";

    for (var key in info) {
      if (!info.hasOwnProperty(key)) continue;
      infoStr += key + ": " + info[key].valueOf() + "\n";
    }

    return wordArrayToBuffer(crypto_js_md5__WEBPACK_IMPORTED_MODULE_4___default()(infoStr));
  };

  return PDFSecurity;
}();

var number$2 = PDFObject$1.number;

var PDFGradient$1 = /*#__PURE__*/function () {
  function PDFGradient(doc) {
    this.doc = doc;
    this.stops = [];
    this.embedded = false;
    this.transform = [1, 0, 0, 1, 0, 0];
  }

  var _proto = PDFGradient.prototype;

  _proto.stop = function stop(pos, color, opacity) {
    if (opacity == null) {
      opacity = 1;
    }

    color = this.doc._normalizeColor(color);

    if (this.stops.length === 0) {
      if (color.length === 3) {
        this._colorSpace = 'DeviceRGB';
      } else if (color.length === 4) {
        this._colorSpace = 'DeviceCMYK';
      } else if (color.length === 1) {
        this._colorSpace = 'DeviceGray';
      } else {
        throw new Error('Unknown color space');
      }
    } else if (this._colorSpace === 'DeviceRGB' && color.length !== 3 || this._colorSpace === 'DeviceCMYK' && color.length !== 4 || this._colorSpace === 'DeviceGray' && color.length !== 1) {
      throw new Error('All gradient stops must use the same color space');
    }

    opacity = Math.max(0, Math.min(1, opacity));
    this.stops.push([pos, color, opacity]);
    return this;
  };

  _proto.setTransform = function setTransform(m11, m12, m21, m22, dx, dy) {
    this.transform = [m11, m12, m21, m22, dx, dy];
    return this;
  };

  _proto.embed = function embed(m) {
    var fn;
    var stopsLength = this.stops.length;

    if (stopsLength === 0) {
      return;
    }

    this.embedded = true;
    this.matrix = m; // if the last stop comes before 100%, add a copy at 100%

    var last = this.stops[stopsLength - 1];

    if (last[0] < 1) {
      this.stops.push([1, last[1], last[2]]);
    }

    var bounds = [];
    var encode = [];
    var stops = [];

    for (var i = 0; i < stopsLength - 1; i++) {
      encode.push(0, 1);

      if (i + 2 !== stopsLength) {
        bounds.push(this.stops[i + 1][0]);
      }

      fn = this.doc.ref({
        FunctionType: 2,
        Domain: [0, 1],
        C0: this.stops[i + 0][1],
        C1: this.stops[i + 1][1],
        N: 1
      });
      stops.push(fn);
      fn.end();
    } // if there are only two stops, we don't need a stitching function


    if (stopsLength === 1) {
      fn = stops[0];
    } else {
      fn = this.doc.ref({
        FunctionType: 3,
        // stitching function
        Domain: [0, 1],
        Functions: stops,
        Bounds: bounds,
        Encode: encode
      });
      fn.end();
    }

    this.id = "Sh" + ++this.doc._gradCount;
    var shader = this.shader(fn);
    shader.end();
    var pattern = this.doc.ref({
      Type: 'Pattern',
      PatternType: 2,
      Shading: shader,
      Matrix: this.matrix.map(number$2)
    });
    pattern.end();

    if (this.stops.some(function (stop) {
      return stop[2] < 1;
    })) {
      var grad = this.opacityGradient();
      grad._colorSpace = 'DeviceGray';

      for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(this.stops), _step; !(_step = _iterator()).done;) {
        var stop = _step.value;
        grad.stop(stop[0], [stop[2]]);
      }

      grad = grad.embed(this.matrix);
      var pageBBox = [0, 0, this.doc.page.width, this.doc.page.height];
      var form = this.doc.ref({
        Type: 'XObject',
        Subtype: 'Form',
        FormType: 1,
        BBox: pageBBox,
        Group: {
          Type: 'Group',
          S: 'Transparency',
          CS: 'DeviceGray'
        },
        Resources: {
          ProcSet: ['PDF', 'Text', 'ImageB', 'ImageC', 'ImageI'],
          Pattern: {
            Sh1: grad
          }
        }
      });
      form.write('/Pattern cs /Sh1 scn');
      form.end(pageBBox.join(' ') + " re f");
      var gstate = this.doc.ref({
        Type: 'ExtGState',
        SMask: {
          Type: 'Mask',
          S: 'Luminosity',
          G: form
        }
      });
      gstate.end();
      var opacityPattern = this.doc.ref({
        Type: 'Pattern',
        PatternType: 1,
        PaintType: 1,
        TilingType: 2,
        BBox: pageBBox,
        XStep: pageBBox[2],
        YStep: pageBBox[3],
        Resources: {
          ProcSet: ['PDF', 'Text', 'ImageB', 'ImageC', 'ImageI'],
          Pattern: {
            Sh1: pattern
          },
          ExtGState: {
            Gs1: gstate
          }
        }
      });
      opacityPattern.write('/Gs1 gs /Pattern cs /Sh1 scn');
      opacityPattern.end(pageBBox.join(' ') + " re f");
      this.doc.page.patterns[this.id] = opacityPattern;
    } else {
      this.doc.page.patterns[this.id] = pattern;
    }

    return pattern;
  };

  _proto.apply = function apply(op) {
    // apply gradient transform to existing document ctm
    var _this$doc$_ctm = this.doc._ctm,
        m0 = _this$doc$_ctm[0],
        m1 = _this$doc$_ctm[1],
        m2 = _this$doc$_ctm[2],
        m3 = _this$doc$_ctm[3],
        m4 = _this$doc$_ctm[4],
        m5 = _this$doc$_ctm[5];
    var _this$transform = this.transform,
        m11 = _this$transform[0],
        m12 = _this$transform[1],
        m21 = _this$transform[2],
        m22 = _this$transform[3],
        dx = _this$transform[4],
        dy = _this$transform[5];
    var m = [m0 * m11 + m2 * m12, m1 * m11 + m3 * m12, m0 * m21 + m2 * m22, m1 * m21 + m3 * m22, m0 * dx + m2 * dy + m4, m1 * dx + m3 * dy + m5];

    if (!this.embedded || m.join(' ') !== this.matrix.join(' ')) {
      this.embed(m);
    }

    return this.doc.addContent("/" + this.id + " " + op);
  };

  return PDFGradient;
}();

var PDFLinearGradient$1 = /*#__PURE__*/function (_PDFGradient) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z)(PDFLinearGradient, _PDFGradient);

  function PDFLinearGradient(doc, x1, y1, x2, y2) {
    var _this;

    _this = _PDFGradient.call(this, doc) || this;
    _this.x1 = x1;
    _this.y1 = y1;
    _this.x2 = x2;
    _this.y2 = y2;
    return _this;
  }

  var _proto2 = PDFLinearGradient.prototype;

  _proto2.shader = function shader(fn) {
    return this.doc.ref({
      ShadingType: 2,
      ColorSpace: this._colorSpace,
      Coords: [this.x1, this.y1, this.x2, this.y2],
      Function: fn,
      Extend: [true, true]
    });
  };

  _proto2.opacityGradient = function opacityGradient() {
    return new PDFLinearGradient(this.doc, this.x1, this.y1, this.x2, this.y2);
  };

  return PDFLinearGradient;
}(PDFGradient$1);

var PDFRadialGradient$1 = /*#__PURE__*/function (_PDFGradient2) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z)(PDFRadialGradient, _PDFGradient2);

  function PDFRadialGradient(doc, x1, y1, r1, x2, y2, r2) {
    var _this2;

    _this2 = _PDFGradient2.call(this, doc) || this;
    _this2.doc = doc;
    _this2.x1 = x1;
    _this2.y1 = y1;
    _this2.r1 = r1;
    _this2.x2 = x2;
    _this2.y2 = y2;
    _this2.r2 = r2;
    return _this2;
  }

  var _proto3 = PDFRadialGradient.prototype;

  _proto3.shader = function shader(fn) {
    return this.doc.ref({
      ShadingType: 3,
      ColorSpace: this._colorSpace,
      Coords: [this.x1, this.y1, this.r1, this.x2, this.y2, this.r2],
      Function: fn,
      Extend: [true, true]
    });
  };

  _proto3.opacityGradient = function opacityGradient() {
    return new PDFRadialGradient(this.doc, this.x1, this.y1, this.r1, this.x2, this.y2, this.r2);
  };

  return PDFRadialGradient;
}(PDFGradient$1);

var Gradient = {
  PDFGradient: PDFGradient$1,
  PDFLinearGradient: PDFLinearGradient$1,
  PDFRadialGradient: PDFRadialGradient$1
};

var PDFGradient = Gradient.PDFGradient,
    PDFLinearGradient = Gradient.PDFLinearGradient,
    PDFRadialGradient = Gradient.PDFRadialGradient;
var ColorMixin = {
  initColor: function initColor() {
    // The opacity dictionaries
    this._opacityRegistry = {};
    this._opacityCount = 0;
    return this._gradCount = 0;
  },
  _normalizeColor: function _normalizeColor(color) {
    if (color instanceof PDFGradient) {
      return color;
    }

    var part;

    if (typeof color === 'string') {
      if (color.charAt(0) === '#') {
        if (color.length === 4) {
          color = color.replace(/#([0-9A-F])([0-9A-F])([0-9A-F])/i, '#$1$1$2$2$3$3');
        }

        var hex = parseInt(color.slice(1), 16);
        color = [hex >> 16, hex >> 8 & 0xff, hex & 0xff];
      } else if (namedColors[color]) {
        color = namedColors[color];
      }
    }

    if (Array.isArray(color)) {
      // RGB
      if (color.length === 3) {
        color = function () {
          var result = [];

          for (var _i = 0, _Array$from = Array.from(color); _i < _Array$from.length; _i++) {
            part = _Array$from[_i];
            result.push(part / 255);
          }

          return result;
        }(); // CMYK

      } else if (color.length === 4) {
        color = function () {
          var result1 = [];

          for (var _i2 = 0, _Array$from2 = Array.from(color); _i2 < _Array$from2.length; _i2++) {
            part = _Array$from2[_i2];
            result1.push(part / 100);
          }

          return result1;
        }();
      }

      return color;
    }

    return null;
  },
  _setColor: function _setColor(color, stroke) {
    color = this._normalizeColor(color);

    if (!color) {
      return false;
    }

    var op = stroke ? 'SCN' : 'scn';

    if (color instanceof PDFGradient) {
      this._setColorSpace('Pattern', stroke);

      color.apply(op);
    } else {
      var space = color.length === 4 ? 'DeviceCMYK' : 'DeviceRGB';

      this._setColorSpace(space, stroke);

      color = color.join(' ');
      this.addContent(color + " " + op);
    }

    return true;
  },
  _setColorSpace: function _setColorSpace(space, stroke) {
    var op = stroke ? 'CS' : 'cs';
    return this.addContent("/" + space + " " + op);
  },
  fillColor: function fillColor(color, opacity) {
    var set = this._setColor(color, false);

    if (set) {
      this.fillOpacity(opacity);
    } // save this for text wrapper, which needs to reset
    // the fill color on new pages


    this._fillColor = [color, opacity];
    return this;
  },
  strokeColor: function strokeColor(color, opacity) {
    var set = this._setColor(color, true);

    if (set) {
      this.strokeOpacity(opacity);
    }

    return this;
  },
  opacity: function opacity(_opacity) {
    this._doOpacity(_opacity, _opacity);

    return this;
  },
  fillOpacity: function fillOpacity(opacity) {
    this._doOpacity(opacity, null);

    return this;
  },
  strokeOpacity: function strokeOpacity(opacity) {
    this._doOpacity(null, opacity);

    return this;
  },
  _doOpacity: function _doOpacity(fillOpacity, strokeOpacity) {
    var dictionary, name;

    if (fillOpacity == null && strokeOpacity == null) {
      return;
    }

    if (fillOpacity != null) {
      fillOpacity = Math.max(0, Math.min(1, fillOpacity));
    }

    if (strokeOpacity != null) {
      strokeOpacity = Math.max(0, Math.min(1, strokeOpacity));
    }

    var key = fillOpacity + "_" + strokeOpacity;

    if (this._opacityRegistry[key]) {
      var _Array$from3 = Array.from(this._opacityRegistry[key]);

      dictionary = _Array$from3[0];
      name = _Array$from3[1];
    } else {
      dictionary = {
        Type: 'ExtGState'
      };

      if (fillOpacity != null) {
        dictionary.ca = fillOpacity;
      }

      if (strokeOpacity != null) {
        dictionary.CA = strokeOpacity;
      }

      dictionary = this.ref(dictionary);
      dictionary.end();
      var id = ++this._opacityCount;
      name = "Gs" + id;
      this._opacityRegistry[key] = [dictionary, name];
    }

    this.page.ext_gstates[name] = dictionary;
    return this.addContent("/" + name + " gs");
  },
  linearGradient: function linearGradient(x1, y1, x2, y2) {
    return new PDFLinearGradient(this, x1, y1, x2, y2);
  },
  radialGradient: function radialGradient(x1, y1, r1, x2, y2, r2) {
    return new PDFRadialGradient(this, x1, y1, r1, x2, y2, r2);
  }
};
var namedColors = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
};

/* eslint-disable no-lonely-if */
var cx, cy, px, py, sx, sy;
cx = cy = px = py = sx = sy = 0; // parseDataPath copy pasted from svgo
// https://github.com/svg/svgo/blob/e4918ccdd1a2b5831defe0f00c1286744b479448/lib/path.js

var argsCountPerCommand = {
  M: 2,
  m: 2,
  Z: 0,
  z: 0,
  L: 2,
  l: 2,
  H: 1,
  h: 1,
  V: 1,
  v: 1,
  C: 6,
  c: 6,
  S: 4,
  s: 4,
  Q: 4,
  q: 4,
  T: 2,
  t: 2,
  A: 7,
  a: 7
};
/**
 * @type {(c: string) => c is PathDataCommand}
 */

var isCommand = function isCommand(c) {
  return c in argsCountPerCommand;
};
/**
 * @type {(c: string) => boolean}
 */


var isWsp = function isWsp(c) {
  var codePoint = c.codePointAt(0);
  return codePoint === 0x20 || codePoint === 0x9 || codePoint === 0xd || codePoint === 0xa;
};
/**
 * @type {(c: string) => boolean}
 */


var isDigit = function isDigit(c) {
  var codePoint = c.codePointAt(0);

  if (codePoint == null) {
    return false;
  }

  return 48 <= codePoint && codePoint <= 57;
};
/**
 * @typedef {'none' | 'sign' | 'whole' | 'decimal_point' | 'decimal' | 'e' | 'exponent_sign' | 'exponent'} ReadNumberState
 */

/**
 * @type {(string: string, cursor: number) => [number, number | null]}
 */


var readNumber = function readNumber(string, cursor) {
  var i = cursor;
  var value = '';
  var state =
  /** @type {ReadNumberState} */
  'none';

  for (; i < string.length; i += 1) {
    var c = string[i];

    if (c === '+' || c === '-') {
      if (state === 'none') {
        state = 'sign';
        value += c;
        continue;
      }

      if (state === 'e') {
        state = 'exponent_sign';
        value += c;
        continue;
      }
    }

    if (isDigit(c)) {
      if (state === 'none' || state === 'sign' || state === 'whole') {
        state = 'whole';
        value += c;
        continue;
      }

      if (state === 'decimal_point' || state === 'decimal') {
        state = 'decimal';
        value += c;
        continue;
      }

      if (state === 'e' || state === 'exponent_sign' || state === 'exponent') {
        state = 'exponent';
        value += c;
        continue;
      }
    }

    if (c === '.') {
      if (state === 'none' || state === 'sign' || state === 'whole') {
        state = 'decimal_point';
        value += c;
        continue;
      }
    }

    if (c === 'E' || c === 'e') {
      if (state === 'whole' || state === 'decimal_point' || state === 'decimal') {
        state = 'e';
        value += c;
        continue;
      }
    }

    break;
  }

  var number = Number.parseFloat(value);

  if (Number.isNaN(number)) {
    return [cursor, null];
  } else {
    // step back to delegate iteration to parent loop
    return [i - 1, number];
  }
};
/**
 * @type {(string: string) => Array<PathDataItem>}
 */


var parsePathData = function parsePathData(string) {
  /**
   * @type {Array<PathDataItem>}
   */
  var pathData = [];
  /**
   * @type {null | PathDataCommand}
   */

  var command = null;
  var args =
  /** @type {number[]} */
  [];
  var argsCount = 0;
  var canHaveComma = false;
  var hadComma = false;

  for (var i = 0; i < string.length; i += 1) {
    var c = string.charAt(i);

    if (isWsp(c)) {
      continue;
    } // allow comma only between arguments


    if (canHaveComma && c === ',') {
      if (hadComma) {
        break;
      }

      hadComma = true;
      continue;
    }

    if (isCommand(c)) {
      if (hadComma) {
        return pathData;
      }

      if (command == null) {
        // moveto should be leading command
        if (c !== 'M' && c !== 'm') {
          return pathData;
        }
      } else {
        // stop if previous command arguments are not flushed
        if (args.length !== 0) {
          return pathData;
        }
      }

      command = c;
      args = [];
      argsCount = argsCountPerCommand[command];
      canHaveComma = false; // flush command without arguments

      if (argsCount === 0) {
        pathData.push({
          command: command,
          args: args
        });
      }

      continue;
    } // avoid parsing arguments if no command detected


    if (command == null) {
      return pathData;
    } // read next argument


    var newCursor = i;
    var number = null;

    if (command === 'A' || command === 'a') {
      var position = args.length;

      if (position === 0 || position === 1) {
        // allow only positive number without sign as first two arguments
        if (c !== '+' && c !== '-') {
          var _readNumber = readNumber(string, i);

          newCursor = _readNumber[0];
          number = _readNumber[1];
        }
      }

      if (position === 2 || position === 5 || position === 6) {
        var _readNumber2 = readNumber(string, i);

        newCursor = _readNumber2[0];
        number = _readNumber2[1];
      }

      if (position === 3 || position === 4) {
        // read flags
        if (c === '0') {
          number = 0;
        }

        if (c === '1') {
          number = 1;
        }
      }
    } else {
      var _readNumber3 = readNumber(string, i);

      newCursor = _readNumber3[0];
      number = _readNumber3[1];
    }

    if (number == null) {
      return pathData;
    }

    args.push(number);
    canHaveComma = true;
    hadComma = false;
    i = newCursor; // flush arguments when necessary count is reached

    if (args.length === argsCount) {
      pathData.push({
        command: command,
        args: args
      }); // subsequent moveto coordinates are threated as implicit lineto commands

      if (command === 'M') {
        command = 'L';
      }

      if (command === 'm') {
        command = 'l';
      }

      args = [];
    }
  }

  return pathData;
};

var _apply = function apply(commands, doc) {
  // current point, control point, and subpath starting point
  cx = cy = px = py = sx = sy = 0; // run the commands

  for (var i = 0; i < commands.length; i++) {
    var _commands$i = commands[i],
        command = _commands$i.command,
        args = _commands$i.args;

    if (typeof runners[command] === 'function') {
      runners[command](doc, args);
    }
  }
};

var runners = {
  M: function M(doc, a) {
    cx = a[0];
    cy = a[1];
    px = py = null;
    sx = cx;
    sy = cy;
    return doc.moveTo(cx, cy);
  },
  m: function m(doc, a) {
    cx += a[0];
    cy += a[1];
    px = py = null;
    sx = cx;
    sy = cy;
    return doc.moveTo(cx, cy);
  },
  C: function C(doc, a) {
    cx = a[4];
    cy = a[5];
    px = a[2];
    py = a[3];
    return doc.bezierCurveTo.apply(doc, a);
  },
  c: function c(doc, a) {
    doc.bezierCurveTo(a[0] + cx, a[1] + cy, a[2] + cx, a[3] + cy, a[4] + cx, a[5] + cy);
    px = cx + a[2];
    py = cy + a[3];
    cx += a[4];
    return cy += a[5];
  },
  S: function S(doc, a) {
    if (px === null) {
      px = cx;
      py = cy;
    }

    doc.bezierCurveTo(cx - (px - cx), cy - (py - cy), a[0], a[1], a[2], a[3]);
    px = a[0];
    py = a[1];
    cx = a[2];
    return cy = a[3];
  },
  s: function s(doc, a) {
    if (px === null) {
      px = cx;
      py = cy;
    }

    doc.bezierCurveTo(cx - (px - cx), cy - (py - cy), cx + a[0], cy + a[1], cx + a[2], cy + a[3]);
    px = cx + a[0];
    py = cy + a[1];
    cx += a[2];
    return cy += a[3];
  },
  Q: function Q(doc, a) {
    px = a[0];
    py = a[1];
    cx = a[2];
    cy = a[3];
    return doc.quadraticCurveTo(a[0], a[1], cx, cy);
  },
  q: function q(doc, a) {
    doc.quadraticCurveTo(a[0] + cx, a[1] + cy, a[2] + cx, a[3] + cy);
    px = cx + a[0];
    py = cy + a[1];
    cx += a[2];
    return cy += a[3];
  },
  T: function T(doc, a) {
    if (px === null) {
      px = cx;
      py = cy;
    } else {
      px = cx - (px - cx);
      py = cy - (py - cy);
    }

    doc.quadraticCurveTo(px, py, a[0], a[1]);
    px = cx - (px - cx);
    py = cy - (py - cy);
    cx = a[0];
    return cy = a[1];
  },
  t: function t(doc, a) {
    if (px === null) {
      px = cx;
      py = cy;
    } else {
      px = cx - (px - cx);
      py = cy - (py - cy);
    }

    doc.quadraticCurveTo(px, py, cx + a[0], cy + a[1]);
    cx += a[0];
    return cy += a[1];
  },
  A: function A(doc, a) {
    solveArc(doc, cx, cy, a);
    cx = a[5];
    return cy = a[6];
  },
  a: function a(doc, _a) {
    _a[5] += cx;
    _a[6] += cy;
    solveArc(doc, cx, cy, _a);
    cx = _a[5];
    return cy = _a[6];
  },
  L: function L(doc, a) {
    cx = a[0];
    cy = a[1];
    px = py = null;
    return doc.lineTo(cx, cy);
  },
  l: function l(doc, a) {
    cx += a[0];
    cy += a[1];
    px = py = null;
    return doc.lineTo(cx, cy);
  },
  H: function H(doc, a) {
    cx = a[0];
    px = py = null;
    return doc.lineTo(cx, cy);
  },
  h: function h(doc, a) {
    cx += a[0];
    px = py = null;
    return doc.lineTo(cx, cy);
  },
  V: function V(doc, a) {
    cy = a[0];
    px = py = null;
    return doc.lineTo(cx, cy);
  },
  v: function v(doc, a) {
    cy += a[0];
    px = py = null;
    return doc.lineTo(cx, cy);
  },
  Z: function Z(doc) {
    doc.closePath();
    cx = sx;
    return cy = sy;
  },
  z: function z(doc) {
    doc.closePath();
    cx = sx;
    return cy = sy;
  }
};

var solveArc = function solveArc(doc, x, y, coords) {
  var rx = coords[0],
      ry = coords[1],
      rot = coords[2],
      large = coords[3],
      sweep = coords[4],
      ex = coords[5],
      ey = coords[6];
  var segs = arcToSegments(ex, ey, rx, ry, large, sweep, rot, x, y);

  for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(segs), _step; !(_step = _iterator()).done;) {
    var seg = _step.value;
    var bez = segmentToBezier.apply(void 0, seg);
    doc.bezierCurveTo.apply(doc, bez);
  }
}; // from Inkscape svgtopdf, thanks!


var arcToSegments = function arcToSegments(x, y, rx, ry, large, sweep, rotateX, ox, oy) {
  var th = rotateX * (Math.PI / 180);
  var sin_th = Math.sin(th);
  var cos_th = Math.cos(th);
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  px = cos_th * (ox - x) * 0.5 + sin_th * (oy - y) * 0.5;
  py = cos_th * (oy - y) * 0.5 - sin_th * (ox - x) * 0.5;
  var pl = px * px / (rx * rx) + py * py / (ry * ry);

  if (pl > 1) {
    pl = Math.sqrt(pl);
    rx *= pl;
    ry *= pl;
  }

  var a00 = cos_th / rx;
  var a01 = sin_th / rx;
  var a10 = -sin_th / ry;
  var a11 = cos_th / ry;
  var x0 = a00 * ox + a01 * oy;
  var y0 = a10 * ox + a11 * oy;
  var x1 = a00 * x + a01 * y;
  var y1 = a10 * x + a11 * y;
  var d = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
  var sfactor_sq = 1 / d - 0.25;

  if (sfactor_sq < 0) {
    sfactor_sq = 0;
  }

  var sfactor = Math.sqrt(sfactor_sq);

  if (sweep === large) {
    sfactor = -sfactor;
  }

  var xc = 0.5 * (x0 + x1) - sfactor * (y1 - y0);
  var yc = 0.5 * (y0 + y1) + sfactor * (x1 - x0);
  var th0 = Math.atan2(y0 - yc, x0 - xc);
  var th1 = Math.atan2(y1 - yc, x1 - xc);
  var th_arc = th1 - th0;

  if (th_arc < 0 && sweep === 1) {
    th_arc += 2 * Math.PI;
  } else if (th_arc > 0 && sweep === 0) {
    th_arc -= 2 * Math.PI;
  }

  var segments = Math.ceil(Math.abs(th_arc / (Math.PI * 0.5 + 0.001)));
  var result = [];

  for (var i = 0; i < segments; i++) {
    var th2 = th0 + i * th_arc / segments;
    var th3 = th0 + (i + 1) * th_arc / segments;
    result[i] = [xc, yc, th2, th3, rx, ry, sin_th, cos_th];
  }

  return result;
};

var segmentToBezier = function segmentToBezier(cx, cy, th0, th1, rx, ry, sin_th, cos_th) {
  var a00 = cos_th * rx;
  var a01 = -sin_th * ry;
  var a10 = sin_th * rx;
  var a11 = cos_th * ry;
  var th_half = 0.5 * (th1 - th0);
  var t = 8 / 3 * Math.sin(th_half * 0.5) * Math.sin(th_half * 0.5) / Math.sin(th_half);
  var x1 = cx + Math.cos(th0) - t * Math.sin(th0);
  var y1 = cy + Math.sin(th0) + t * Math.cos(th0);
  var x3 = cx + Math.cos(th1);
  var y3 = cy + Math.sin(th1);
  var x2 = x3 + t * Math.sin(th1);
  var y2 = y3 - t * Math.cos(th1);
  return [a00 * x1 + a01 * y1, a10 * x1 + a11 * y1, a00 * x2 + a01 * y2, a10 * x2 + a11 * y2, a00 * x3 + a01 * y3, a10 * x3 + a11 * y3];
};

var SVGPath = /*#__PURE__*/function () {
  function SVGPath() {}

  SVGPath.apply = function apply(doc, path) {
    var commands = parsePathData(path);

    _apply(commands, doc);
  };

  return SVGPath;
}();

var number$1 = PDFObject$1.number; // This constant is used to approximate a symmetrical arc using a cubic
// Bezier curve.

var KAPPA = 4.0 * ((Math.sqrt(2) - 1.0) / 3.0);
var VectorMixin = {
  initVector: function initVector() {
    this._ctm = [1, 0, 0, 1, 0, 0]; // current transformation matrix

    return this._ctmStack = [];
  },
  save: function save() {
    this._ctmStack.push(this._ctm.slice()); // TODO: save/restore colorspace and styles so not setting it unnessesarily all the time?


    return this.addContent('q');
  },
  restore: function restore() {
    this._ctm = this._ctmStack.pop() || [1, 0, 0, 1, 0, 0];
    return this.addContent('Q');
  },
  closePath: function closePath() {
    return this.addContent('h');
  },
  lineWidth: function lineWidth(w) {
    return this.addContent(number$1(w) + " w");
  },
  _CAP_STYLES: {
    BUTT: 0,
    ROUND: 1,
    SQUARE: 2
  },
  lineCap: function lineCap(c) {
    if (typeof c === 'string') {
      c = this._CAP_STYLES[c.toUpperCase()];
    }

    return this.addContent(c + " J");
  },
  _JOIN_STYLES: {
    MITER: 0,
    ROUND: 1,
    BEVEL: 2
  },
  lineJoin: function lineJoin(j) {
    if (typeof j === 'string') {
      j = this._JOIN_STYLES[j.toUpperCase()];
    }

    return this.addContent(j + " j");
  },
  miterLimit: function miterLimit(m) {
    return this.addContent(number$1(m) + " M");
  },
  dash: function dash(length, options) {
    var phase;

    if (options == null) {
      options = {};
    }

    if (length == null) {
      return this;
    }

    if (Array.isArray(length)) {
      length = Array.from(length).map(function (v) {
        return PDFObject$1.number(v);
      }).join(' ');
      phase = options.phase || 0;
      return this.addContent("[" + length + "] " + PDFObject$1.number(phase) + " d");
    }

    var space = options.space != null ? options.space : length;
    phase = options.phase || 0;
    return this.addContent("[" + PDFObject$1.number(length) + " " + PDFObject$1.number(space) + "] " + PDFObject$1.number(phase) + " d");
  },
  undash: function undash() {
    return this.addContent('[] 0 d');
  },
  moveTo: function moveTo(x, y) {
    return this.addContent(number$1(x) + " " + number$1(y) + " m");
  },
  lineTo: function lineTo(x, y) {
    return this.addContent(number$1(x) + " " + number$1(y) + " l");
  },
  bezierCurveTo: function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    return this.addContent(number$1(cp1x) + " " + number$1(cp1y) + " " + number$1(cp2x) + " " + number$1(cp2y) + " " + number$1(x) + " " + number$1(y) + " c");
  },
  quadraticCurveTo: function quadraticCurveTo(cpx, cpy, x, y) {
    return this.addContent(number$1(cpx) + " " + number$1(cpy) + " " + number$1(x) + " " + number$1(y) + " v");
  },
  rect: function rect(x, y, w, h) {
    return this.addContent(number$1(x) + " " + number$1(y) + " " + number$1(w) + " " + number$1(h) + " re");
  },
  roundedRect: function roundedRect(x, y, w, h, r) {
    if (r == null) {
      r = 0;
    }

    r = Math.min(r, 0.5 * w, 0.5 * h); // amount to inset control points from corners (see `ellipse`)

    var c = r * (1.0 - KAPPA);
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.bezierCurveTo(x + w - c, y, x + w, y + c, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.bezierCurveTo(x + w, y + h - c, x + w - c, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.bezierCurveTo(x + c, y + h, x, y + h - c, x, y + h - r);
    this.lineTo(x, y + r);
    this.bezierCurveTo(x, y + c, x + c, y, x + r, y);
    return this.closePath();
  },
  ellipse: function ellipse(x, y, r1, r2) {
    // based on http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas/2173084#2173084
    if (r2 == null) {
      r2 = r1;
    }

    x -= r1;
    y -= r2;
    var ox = r1 * KAPPA;
    var oy = r2 * KAPPA;
    var xe = x + r1 * 2;
    var ye = y + r2 * 2;
    var xm = x + r1;
    var ym = y + r2;
    this.moveTo(x, ym);
    this.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    this.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    this.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    this.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    return this.closePath();
  },
  circle: function circle(x, y, radius) {
    return this.ellipse(x, y, radius);
  },
  arc: function arc(x, y, radius, startAngle, endAngle, anticlockwise) {
    if (anticlockwise == null) {
      anticlockwise = false;
    }

    var TWO_PI = 2.0 * Math.PI;
    var HALF_PI = 0.5 * Math.PI;
    var deltaAng = endAngle - startAngle;

    if (Math.abs(deltaAng) > TWO_PI) {
      // draw only full circle if more than that is specified
      deltaAng = TWO_PI;
    } else if (deltaAng !== 0 && anticlockwise !== deltaAng < 0) {
      // necessary to flip direction of rendering
      var dir = anticlockwise ? -1 : 1;
      deltaAng = dir * TWO_PI + deltaAng;
    }

    var numSegs = Math.ceil(Math.abs(deltaAng) / HALF_PI);
    var segAng = deltaAng / numSegs;
    var handleLen = segAng / HALF_PI * KAPPA * radius;
    var curAng = startAngle; // component distances between anchor point and control point

    var deltaCx = -Math.sin(curAng) * handleLen;
    var deltaCy = Math.cos(curAng) * handleLen; // anchor point

    var ax = x + Math.cos(curAng) * radius;
    var ay = y + Math.sin(curAng) * radius; // calculate and render segments

    this.moveTo(ax, ay);

    for (var segIdx = 0, end = numSegs, asc = 0 <= end; asc ? segIdx < end : segIdx > end; asc ? segIdx++ : segIdx--) {
      // starting control point
      var cp1x = ax + deltaCx;
      var cp1y = ay + deltaCy; // step angle

      curAng += segAng; // next anchor point

      ax = x + Math.cos(curAng) * radius;
      ay = y + Math.sin(curAng) * radius; // next control point delta

      deltaCx = -Math.sin(curAng) * handleLen;
      deltaCy = Math.cos(curAng) * handleLen; // ending control point

      var cp2x = ax - deltaCx;
      var cp2y = ay - deltaCy; // render segment

      this.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, ax, ay);
    }

    return this;
  },
  polygon: function polygon() {
    for (var _len = arguments.length, points = new Array(_len), _key = 0; _key < _len; _key++) {
      points[_key] = arguments[_key];
    }

    this.moveTo.apply(this, Array.from(points.shift() || []));

    for (var _i = 0, _Array$from = Array.from(points); _i < _Array$from.length; _i++) {
      var point = _Array$from[_i];
      this.lineTo.apply(this, Array.from(point || []));
    }

    return this.closePath();
  },
  path: function path(_path) {
    SVGPath.apply(this, _path);
    return this;
  },
  _windingRule: function _windingRule(rule) {
    if (/even-?odd/.test(rule)) {
      return '*';
    }

    return '';
  },
  fill: function fill(color, rule) {
    if (/(even-?odd)|(non-?zero)/.test(color)) {
      rule = color;
      color = null;
    }

    if (color) {
      this.fillColor(color);
    }

    return this.addContent("f" + this._windingRule(rule));
  },
  stroke: function stroke(color) {
    if (color) {
      this.strokeColor(color);
    }

    return this.addContent('S');
  },
  fillAndStroke: function fillAndStroke(fillColor, strokeColor, rule) {
    if (strokeColor == null) {
      strokeColor = fillColor;
    }

    var isFillRule = /(even-?odd)|(non-?zero)/;

    if (isFillRule.test(fillColor)) {
      rule = fillColor;
      fillColor = null;
    }

    if (isFillRule.test(strokeColor)) {
      rule = strokeColor;
      strokeColor = fillColor;
    }

    if (fillColor) {
      this.fillColor(fillColor);
      this.strokeColor(strokeColor);
    }

    return this.addContent("B" + this._windingRule(rule));
  },
  clip: function clip(rule) {
    return this.addContent("W" + this._windingRule(rule) + " n");
  },
  transform: function transform(m11, m12, m21, m22, dx, dy) {
    // keep track of the current transformation matrix
    var m = this._ctm;

    var _Array$from2 = Array.from(m),
        m0 = _Array$from2[0],
        m1 = _Array$from2[1],
        m2 = _Array$from2[2],
        m3 = _Array$from2[3],
        m4 = _Array$from2[4],
        m5 = _Array$from2[5];

    m[0] = m0 * m11 + m2 * m12;
    m[1] = m1 * m11 + m3 * m12;
    m[2] = m0 * m21 + m2 * m22;
    m[3] = m1 * m21 + m3 * m22;
    m[4] = m0 * dx + m2 * dy + m4;
    m[5] = m1 * dx + m3 * dy + m5;
    var values = [m11, m12, m21, m22, dx, dy].map(function (v) {
      return PDFObject$1.number(v);
    }).join(' ');
    return this.addContent(values + " cm");
  },
  translate: function translate(x, y) {
    return this.transform(1, 0, 0, 1, x, y);
  },
  rotate: function rotate(angle, options) {
    if (options === void 0) {
      options = {};
    }

    var rad = angle * Math.PI / 180;
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    var x = 0;
    var y = 0;

    if (options.origin != null) {
      var _Array$from3 = Array.from(options.origin);

      x = _Array$from3[0];
      y = _Array$from3[1];
      var x1 = x * cos - y * sin;
      var y1 = x * sin + y * cos;
      x -= x1;
      y -= y1;
    }

    return this.transform(cos, sin, -sin, cos, x, y);
  },
  scale: function scale(xFactor, yFactor, options) {
    if (options === void 0) {
      options = {};
    }

    if (yFactor == null) {
      yFactor = xFactor;
    }

    if (typeof yFactor === 'object') {
      options = yFactor;
      yFactor = xFactor;
    }

    var x = 0;
    var y = 0;

    if (options.origin != null) {
      var _Array$from4 = Array.from(options.origin);

      x = _Array$from4[0];
      y = _Array$from4[1];
      x -= xFactor * x;
      y -= yFactor * y;
    }

    return this.transform(xFactor, 0, 0, yFactor, x, y);
  },
  skew: function skew(xAngle, yAngle, options) {
    if (xAngle === void 0) {
      xAngle = 0;
    }

    if (yAngle === void 0) {
      yAngle = 0;
    }

    var radx = xAngle * Math.PI / 180;
    var rady = yAngle * Math.PI / 180;
    var tanx = Math.tan(radx);
    var tany = Math.tan(rady);
    var x = 0;
    var y = 0;

    if (options.origin != null) {
      var _Array$from5 = Array.from(options.origin);

      x = _Array$from5[0];
      y = _Array$from5[1];
      var x1 = x + tanx * y;
      var y1 = y + tany * x;
      x -= x1;
      y -= y1;
    }

    return this.transform(1, tany, tanx, 1, x, y);
  }
};

var range = function range(left, right, inclusive) {
  var range = [];
  var ascending = left < right;
  var end = !inclusive ? right : ascending ? right + 1 : right - 1;

  for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }

  return range;
};

var WIN_ANSI_MAP = {
  402: 131,
  8211: 150,
  8212: 151,
  8216: 145,
  8217: 146,
  8218: 130,
  8220: 147,
  8221: 148,
  8222: 132,
  8224: 134,
  8225: 135,
  8226: 149,
  8230: 133,
  8364: 128,
  8240: 137,
  8249: 139,
  8250: 155,
  710: 136,
  8482: 153,
  338: 140,
  339: 156,
  732: 152,
  352: 138,
  353: 154,
  376: 159,
  381: 142,
  382: 158
};
var characters = ".notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n\nspace         exclam         quotedbl       numbersign\ndollar        percent        ampersand      quotesingle\nparenleft     parenright     asterisk       plus\ncomma         hyphen         period         slash\nzero          one            two            three\nfour          five           six            seven\neight         nine           colon          semicolon\nless          equal          greater        question\n\nat            A              B              C\nD             E              F              G\nH             I              J              K\nL             M              N              O\nP             Q              R              S\nT             U              V              W\nX             Y              Z              bracketleft\nbackslash     bracketright   asciicircum    underscore\n\ngrave         a              b              c\nd             e              f              g\nh             i              j              k\nl             m              n              o\np             q              r              s\nt             u              v              w\nx             y              z              braceleft\nbar           braceright     asciitilde     .notdef\n\nEuro          .notdef        quotesinglbase florin\nquotedblbase  ellipsis       dagger         daggerdbl\ncircumflex    perthousand    Scaron         guilsinglleft\nOE            .notdef        Zcaron         .notdef\n.notdef       quoteleft      quoteright     quotedblleft\nquotedblright bullet         endash         emdash\ntilde         trademark      scaron         guilsinglright\noe            .notdef        zcaron         ydieresis\n\nspace         exclamdown     cent           sterling\ncurrency      yen            brokenbar      section\ndieresis      copyright      ordfeminine    guillemotleft\nlogicalnot    hyphen         registered     macron\ndegree        plusminus      twosuperior    threesuperior\nacute         mu             paragraph      periodcentered\ncedilla       onesuperior    ordmasculine   guillemotright\nonequarter    onehalf        threequarters  questiondown\n\nAgrave        Aacute         Acircumflex    Atilde\nAdieresis     Aring          AE             Ccedilla\nEgrave        Eacute         Ecircumflex    Edieresis\nIgrave        Iacute         Icircumflex    Idieresis\nEth           Ntilde         Ograve         Oacute\nOcircumflex   Otilde         Odieresis      multiply\nOslash        Ugrave         Uacute         Ucircumflex\nUdieresis     Yacute         Thorn          germandbls\n\nagrave        aacute         acircumflex    atilde\nadieresis     aring          ae             ccedilla\negrave        eacute         ecircumflex    edieresis\nigrave        iacute         icircumflex    idieresis\neth           ntilde         ograve         oacute\nocircumflex   otilde         odieresis      divide\noslash        ugrave         uacute         ucircumflex\nudieresis     yacute         thorn          ydieresis".split(/\s+/);

function _parse(contents) {
  var obj = {
    attributes: {},
    glyphWidths: {},
    kernPairs: {}
  };
  var section = '';

  for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(contents.split('\n')), _step; !(_step = _iterator()).done;) {
    var line = _step.value;
    var match;
    var a;

    if (match = line.match(/^Start(\w+)/)) {
      section = match[1];
      continue;
    } else if (match = line.match(/^End(\w+)/)) {
      section = '';
      continue;
    }

    switch (section) {
      case 'FontMetrics':
        match = line.match(/(^\w+)\s+(.*)/);
        var key = match[1];
        var value = match[2];

        if (a = obj.attributes[key]) {
          if (!Array.isArray(a)) {
            a = obj.attributes[key] = [a];
          }

          a.push(value);
        } else {
          obj.attributes[key] = value;
        }

        break;

      case 'CharMetrics':
        if (!/^CH?\s/.test(line)) {
          continue;
        }

        var name = line.match(/\bN\s+(\.?\w+)\s*;/)[1];
        obj.glyphWidths[name] = +line.match(/\bWX\s+(\d+)\s*;/)[1];
        break;

      case 'KernPairs':
        match = line.match(/^KPX\s+(\.?\w+)\s+(\.?\w+)\s+(-?\d+)/);

        if (match) {
          obj.kernPairs[match[1] + match[2]] = parseInt(match[3]);
        }

        break;
    }
  }

  return obj;
}

var AFMFont = /*#__PURE__*/function () {
  AFMFont.open = function open(filename) {
    {
      throw new Error('AFMFont.open not available on browser build');
    }
  };

  AFMFont.fromJson = function fromJson(json) {
    return new AFMFont(json);
  };

  function AFMFont(contents) {
    var _this = this;

    if (typeof contents === 'string') {
      this.contents = contents;
      this.parse();
    } else {
      this.attributes = contents.attributes;
      this.glyphWidths = contents.glyphWidths;
      this.kernPairs = contents.kernPairs;
    }

    this.charWidths = range(0, 255, true).map(function (i) {
      return _this.glyphWidths[characters[i]];
    });
    this.bbox = Array.from(this.attributes.FontBBox.split(/\s+/)).map(function (e) {
      return +e;
    });
    this.ascender = +(this.attributes.Ascender || 0);
    this.descender = +(this.attributes.Descender || 0);
    this.xHeight = +(this.attributes.XHeight || 0);
    this.capHeight = +(this.attributes.CapHeight || 0);
    this.lineGap = this.bbox[3] - this.bbox[1] - (this.ascender - this.descender);
  }

  var _proto = AFMFont.prototype;

  _proto.parse = function parse() {
    var parsed = _parse(this.contents);

    this.attributes = parsed.attributes;
    this.glyphWidths = parsed.glyphWidths;
    this.kernPairs = parsed.kernPairs;
  };

  _proto.encodeText = function encodeText(text) {
    var res = [];

    for (var i = 0, end = text.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      var char = text.charCodeAt(i);
      char = WIN_ANSI_MAP[char] || char;
      res.push(char.toString(16));
    }

    return res;
  };

  _proto.glyphsForString = function glyphsForString(string) {
    var glyphs = [];

    for (var i = 0, end = string.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      var charCode = string.charCodeAt(i);
      glyphs.push(this.characterToGlyph(charCode));
    }

    return glyphs;
  };

  _proto.characterToGlyph = function characterToGlyph(character) {
    return characters[WIN_ANSI_MAP[character] || character] || '.notdef';
  };

  _proto.widthOfGlyph = function widthOfGlyph(glyph) {
    return this.glyphWidths[glyph] || 0;
  };

  _proto.getKernPair = function getKernPair(left, right) {
    return this.kernPairs[left + right] || 0;
  };

  _proto.advancesForGlyphs = function advancesForGlyphs(glyphs) {
    var advances = [];

    for (var index = 0; index < glyphs.length; index++) {
      var left = glyphs[index];
      var right = glyphs[index + 1];
      advances.push(this.widthOfGlyph(left) + this.getKernPair(left, right));
    }

    return advances;
  };

  return AFMFont;
}();

var attributes = [
	{
		Comment: [
			"Copyright (c) 1985, 1987, 1989, 1990, 1997 Adobe Systems Incorporated.  All Rights Reserved.",
			"Creation Date: Thu May  1 12:43:52 1997",
			"UniqueID 43052",
			"VMusage 37169 48194"
		],
		FontName: "Helvetica-Bold",
		FullName: "Helvetica Bold",
		FamilyName: "Helvetica",
		Weight: "Bold",
		ItalicAngle: "0",
		IsFixedPitch: "false",
		CharacterSet: "ExtendedRoman",
		FontBBox: "-170 -228 1003 962 ",
		UnderlinePosition: "-100",
		UnderlineThickness: "50",
		Version: "002.000",
		Notice: "Copyright (c) 1985, 1987, 1989, 1990, 1997 Adobe Systems Incorporated.  All Rights Reserved.Helvetica is a trademark of Linotype-Hell AG and/or its subsidiaries.",
		EncodingScheme: "AdobeStandardEncoding",
		CapHeight: "718",
		XHeight: "532",
		Ascender: "718",
		Descender: "-207",
		StdHW: "118",
		StdVW: "140"
	},
	{
		Comment: [
			"Copyright (c) 1985, 1987, 1989, 1990, 1997 Adobe Systems Incorporated.  All Rights Reserved.",
			"Creation Date: Thu May  1 12:45:12 1997",
			"UniqueID 43053",
			"VMusage 14482 68586"
		],
		FontName: "Helvetica-BoldOblique",
		FullName: "Helvetica Bold Oblique",
		FamilyName: "Helvetica",
		Weight: "Bold",
		ItalicAngle: "-12",
		IsFixedPitch: "false",
		CharacterSet: "ExtendedRoman",
		FontBBox: "-174 -228 1114 962",
		UnderlinePosition: "-100",
		UnderlineThickness: "50",
		Version: "002.000",
		Notice: "Copyright (c) 1985, 1987, 1989, 1990, 1997 Adobe Systems Incorporated.  All Rights Reserved.Helvetica is a trademark of Linotype-Hell AG and/or its subsidiaries.",
		EncodingScheme: "AdobeStandardEncoding",
		CapHeight: "718",
		XHeight: "532",
		Ascender: "718",
		Descender: "-207",
		StdHW: "118",
		StdVW: "140"
	},
	{
		Comment: [
			"Copyright (c) 1985, 1987, 1989, 1990, 1997 Adobe Systems Incorporated.  All Rights Reserved.",
			"Creation Date: Thu May  1 12:44:31 1997",
			"UniqueID 43055",
			"VMusage 14960 69346"
		],
		FontName: "Helvetica-Oblique",
		FullName: "Helvetica Oblique",
		FamilyName: "Helvetica",
		Weight: "Medium",
		ItalicAngle: "-12",
		IsFixedPitch: "false",
		CharacterSet: "ExtendedRoman",
		FontBBox: "-170 -225 1116 931 ",
		UnderlinePosition: "-100",
		UnderlineThickness: "50",
		Version: "002.000",
		Notice: "Copyright (c) 1985, 1987, 1989, 1990, 1997 Adobe Systems Incorporated.  All Rights Reserved.Helvetica is a trademark of Linotype-Hell AG and/or its subsidiaries.",
		EncodingScheme: "AdobeStandardEncoding",
		CapHeight: "718",
		XHeight: "523",
		Ascender: "718",
		Descender: "-207",
		StdHW: "76",
		StdVW: "88"
	},
	{
		Comment: [
			"Copyright (c) 1985, 1987, 1989, 1990, 1997 Adobe Systems Incorporated.  All Rights Reserved.",
			"Creation Date: Thu May  1 12:38:23 1997",
			"UniqueID 43054",
			"VMusage 37069 48094"
		],
		FontName: "Helvetica",
		FullName: "Helvetica",
		FamilyName: "Helvetica",
		Weight: "Medium",
		ItalicAngle: "0",
		IsFixedPitch: "false",
		CharacterSet: "ExtendedRoman",
		FontBBox: "-166 -225 1000 931 ",
		UnderlinePosition: "-100",
		UnderlineThickness: "50",
		Version: "002.000",
		Notice: "Copyright (c) 1985, 1987, 1989, 1990, 1997 Adobe Systems Incorporated.  All Rights Reserved.Helvetica is a trademark of Linotype-Hell AG and/or its subsidiaries.",
		EncodingScheme: "AdobeStandardEncoding",
		CapHeight: "718",
		XHeight: "523",
		Ascender: "718",
		Descender: "-207",
		StdHW: "76",
		StdVW: "88"
	},
	{
		Comment: [
			"Copyright (c) 1985, 1987, 1989, 1990, 1993, 1997 Adobe Systems Incorporated.  All Rights Reserved.",
			"Creation Date: Thu May  1 12:52:56 1997",
			"UniqueID 43065",
			"VMusage 41636 52661"
		],
		FontName: "Times-Bold",
		FullName: "Times Bold",
		FamilyName: "Times",
		Weight: "Bold",
		ItalicAngle: "0",
		IsFixedPitch: "false",
		CharacterSet: "ExtendedRoman",
		FontBBox: "-168 -218 1000 935 ",
		UnderlinePosition: "-100",
		UnderlineThickness: "50",
		Version: "002.000",
		Notice: "Copyright (c) 1985, 1987, 1989, 1990, 1993, 1997 Adobe Systems Incorporated.  All Rights Reserved.Times is a trademark of Linotype-Hell AG and/or its subsidiaries.",
		EncodingScheme: "AdobeStandardEncoding",
		CapHeight: "676",
		XHeight: "461",
		Ascender: "683",
		Descender: "-217",
		StdHW: "44",
		StdVW: "139"
	},
	{
		Comment: [
			"Copyright (c) 1985, 1987, 1989, 1990, 1993, 1997 Adobe Systems Incorporated.  All Rights Reserved.",
			"Creation Date: Thu May  1 13:04:06 1997",
			"UniqueID 43066",
			"VMusage 45874 56899"
		],
		FontName: "Times-BoldItalic",
		FullName: "Times Bold Italic",
		FamilyName: "Times",
		Weight: "Bold",
		ItalicAngle: "-15",
		IsFixedPitch: "false",
		CharacterSet: "ExtendedRoman",
		FontBBox: "-200 -218 996 921",
		UnderlinePosition: "-100",
		UnderlineThickness: "50",
		Version: "002.000",
		Notice: "Copyright (c) 1985, 1987, 1989, 1990, 1993, 1997 Adobe Systems Incorporated.  All Rights Reserved.Times is a trademark of Linotype-Hell AG and/or its subsidiaries.",
		EncodingScheme: "AdobeStandardEncoding",
		CapHeight: "669",
		XHeight: "462",
		Ascender: "683",
		Descender: "-217",
		StdHW: "42",
		StdVW: "121"
	},
	{
		Comment: [
			"Copyright (c) 1985, 1987, 1989, 1990, 1993, 1997 Adobe Systems Incorporated.  All Rights Reserved.",
			"Creation Date: Thu May  1 12:56:55 1997",
			"UniqueID 43067",
			"VMusage 47727 58752"
		],
		FontName: "Times-Italic",
		FullName: "Times Italic",
		FamilyName: "Times",
		Weight: "Medium",
		ItalicAngle: "-15.5",
		IsFixedPitch: "false",
		CharacterSet: "ExtendedRoman",
		FontBBox: "-169 -217 1010 883 ",
		UnderlinePosition: "-100",
		UnderlineThickness: "50",
		Version: "002.000",
		Notice: "Copyright (c) 1985, 1987, 1989, 1990, 1993, 1997 Adobe Systems Incorporated.  All Rights Reserved.Times is a trademark of Linotype-Hell AG and/or its subsidiaries.",
		EncodingScheme: "AdobeStandardEncoding",
		CapHeight: "653",
		XHeight: "441",
		Ascender: "683",
		Descender: "-217",
		StdHW: "32",
		StdVW: "76"
	},
	{
		Comment: [
			"Copyright (c) 1985, 1987, 1989, 1990, 1993, 1997 Adobe Systems Incorporated.  All Rights Reserved.",
			"Creation Date: Thu May  1 12:49:17 1997",
			"UniqueID 43068",
			"VMusage 43909 54934"
		],
		FontName: "Times-Roman",
		FullName: "Times Roman",
		FamilyName: "Times",
		Weight: "Roman",
		ItalicAngle: "0",
		IsFixedPitch: "false",
		CharacterSet: "ExtendedRoman",
		FontBBox: "-168 -218 1000 898 ",
		UnderlinePosition: "-100",
		UnderlineThickness: "50",
		Version: "002.000",
		Notice: "Copyright (c) 1985, 1987, 1989, 1990, 1993, 1997 Adobe Systems Incorporated.  All Rights Reserved.Times is a trademark of Linotype-Hell AG and/or its subsidiaries.",
		EncodingScheme: "AdobeStandardEncoding",
		CapHeight: "662",
		XHeight: "450",
		Ascender: "683",
		Descender: "-217",
		StdHW: "28",
		StdVW: "84"
	},
	{
		Comment: [
			"Copyright (c) 1989, 1990, 1991, 1993, 1997 Adobe Systems Incorporated.  All Rights Reserved.",
			"Creation Date: Mon Jun 23 16:28:00 1997",
			"UniqueID 43048",
			"VMusage 41139 52164"
		],
		FontName: "Courier-Bold",
		FullName: "Courier Bold",
		FamilyName: "Courier",
		Weight: "Bold",
		ItalicAngle: "0",
		IsFixedPitch: "true",
		CharacterSet: "ExtendedRoman",
		FontBBox: "-113 -250 749 801 ",
		UnderlinePosition: "-100",
		UnderlineThickness: "50",
		Version: "003.000",
		Notice: "Copyright (c) 1989, 1990, 1991, 1993, 1997 Adobe Systems Incorporated.  All Rights Reserved.",
		EncodingScheme: "AdobeStandardEncoding",
		CapHeight: "562",
		XHeight: "439",
		Ascender: "629",
		Descender: "-157",
		StdHW: "84",
		StdVW: "106"
	},
	{
		Comment: [
			"Copyright (c) 1989, 1990, 1991, 1993, 1997 Adobe Systems Incorporated.  All Rights Reserved.",
			"Creation Date: Mon Jun 23 16:28:46 1997",
			"UniqueID 43049",
			"VMusage 17529 79244"
		],
		FontName: "Courier-BoldOblique",
		FullName: "Courier Bold Oblique",
		FamilyName: "Courier",
		Weight: "Bold",
		ItalicAngle: "-12",
		IsFixedPitch: "true",
		CharacterSet: "ExtendedRoman",
		FontBBox: "-57 -250 869 801",
		UnderlinePosition: "-100",
		UnderlineThickness: "50",
		Version: "003.000",
		Notice: "Copyright (c) 1989, 1990, 1991, 1993, 1997 Adobe Systems Incorporated.  All Rights Reserved.",
		EncodingScheme: "AdobeStandardEncoding",
		CapHeight: "562",
		XHeight: "439",
		Ascender: "629",
		Descender: "-157",
		StdHW: "84",
		StdVW: "106"
	},
	{
		Comment: [
			"Copyright (c) 1989, 1990, 1991, 1992, 1993, 1997 Adobe Systems Incorporated.  All Rights Reserved.",
			"Creation Date: Thu May  1 17:37:52 1997",
			"UniqueID 43051",
			"VMusage 16248 75829"
		],
		FontName: "Courier-Oblique",
		FullName: "Courier Oblique",
		FamilyName: "Courier",
		Weight: "Medium",
		ItalicAngle: "-12",
		IsFixedPitch: "true",
		CharacterSet: "ExtendedRoman",
		FontBBox: "-27 -250 849 805 ",
		UnderlinePosition: "-100",
		UnderlineThickness: "50",
		Version: "003.000",
		Notice: "Copyright (c) 1989, 1990, 1991, 1992, 1993, 1997 Adobe Systems Incorporated.  All Rights Reserved.",
		EncodingScheme: "AdobeStandardEncoding",
		CapHeight: "562",
		XHeight: "426",
		Ascender: "629",
		Descender: "-157",
		StdHW: "51",
		StdVW: "51"
	},
	{
		Comment: [
			"Copyright (c) 1989, 1990, 1991, 1992, 1993, 1997 Adobe Systems Incorporated.  All Rights Reserved.",
			"Creation Date: Thu May  1 17:27:09 1997",
			"UniqueID 43050",
			"VMusage 39754 50779"
		],
		FontName: "Courier",
		FullName: "Courier",
		FamilyName: "Courier",
		Weight: "Medium",
		ItalicAngle: "0",
		IsFixedPitch: "true",
		CharacterSet: "ExtendedRoman",
		FontBBox: "-23 -250 715 805 ",
		UnderlinePosition: "-100",
		UnderlineThickness: "50",
		Version: "003.000",
		Notice: "Copyright (c) 1989, 1990, 1991, 1992, 1993, 1997 Adobe Systems Incorporated.  All Rights Reserved.",
		EncodingScheme: "AdobeStandardEncoding",
		CapHeight: "562",
		XHeight: "426",
		Ascender: "629",
		Descender: "-157",
		StdHW: "51",
		StdVW: "51"
	}
];
var glyphWidths = {
	space: [
		278,
		278,
		278,
		278,
		250,
		250,
		250,
		250,
		600,
		600,
		600,
		600
	],
	exclam: [
		333,
		333,
		278,
		278,
		333,
		389,
		333,
		333,
		600,
		600,
		600,
		600
	],
	quotedbl: [
		474,
		474,
		355,
		355,
		555,
		555,
		420,
		408,
		600,
		600,
		600,
		600
	],
	numbersign: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	dollar: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	percent: [
		889,
		889,
		889,
		889,
		1000,
		833,
		833,
		833,
		600,
		600,
		600,
		600
	],
	ampersand: [
		722,
		722,
		667,
		667,
		833,
		778,
		778,
		778,
		600,
		600,
		600,
		600
	],
	quoteright: [
		278,
		278,
		222,
		222,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	parenleft: [
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	parenright: [
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	asterisk: [
		389,
		389,
		389,
		389,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	plus: [
		584,
		584,
		584,
		584,
		570,
		570,
		675,
		564,
		600,
		600,
		600,
		600
	],
	comma: [
		278,
		278,
		278,
		278,
		250,
		250,
		250,
		250,
		600,
		600,
		600,
		600
	],
	hyphen: [
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	period: [
		278,
		278,
		278,
		278,
		250,
		250,
		250,
		250,
		600,
		600,
		600,
		600
	],
	slash: [
		278,
		278,
		278,
		278,
		278,
		278,
		278,
		278,
		600,
		600,
		600,
		600
	],
	zero: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	one: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	two: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	three: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	four: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	five: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	six: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	seven: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	eight: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	nine: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	colon: [
		333,
		333,
		278,
		278,
		333,
		333,
		333,
		278,
		600,
		600,
		600,
		600
	],
	semicolon: [
		333,
		333,
		278,
		278,
		333,
		333,
		333,
		278,
		600,
		600,
		600,
		600
	],
	less: [
		584,
		584,
		584,
		584,
		570,
		570,
		675,
		564,
		600,
		600,
		600,
		600
	],
	equal: [
		584,
		584,
		584,
		584,
		570,
		570,
		675,
		564,
		600,
		600,
		600,
		600
	],
	greater: [
		584,
		584,
		584,
		584,
		570,
		570,
		675,
		564,
		600,
		600,
		600,
		600
	],
	question: [
		611,
		611,
		556,
		556,
		500,
		500,
		500,
		444,
		600,
		600,
		600,
		600
	],
	at: [
		975,
		975,
		1015,
		1015,
		930,
		832,
		920,
		921,
		600,
		600,
		600,
		600
	],
	A: [
		722,
		722,
		667,
		667,
		722,
		667,
		611,
		722,
		600,
		600,
		600,
		600
	],
	B: [
		722,
		722,
		667,
		667,
		667,
		667,
		611,
		667,
		600,
		600,
		600,
		600
	],
	C: [
		722,
		722,
		722,
		722,
		722,
		667,
		667,
		667,
		600,
		600,
		600,
		600
	],
	D: [
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	E: [
		667,
		667,
		667,
		667,
		667,
		667,
		611,
		611,
		600,
		600,
		600,
		600
	],
	F: [
		611,
		611,
		611,
		611,
		611,
		667,
		611,
		556,
		600,
		600,
		600,
		600
	],
	G: [
		778,
		778,
		778,
		778,
		778,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	H: [
		722,
		722,
		722,
		722,
		778,
		778,
		722,
		722,
		600,
		600,
		600,
		600
	],
	I: [
		278,
		278,
		278,
		278,
		389,
		389,
		333,
		333,
		600,
		600,
		600,
		600
	],
	J: [
		556,
		556,
		500,
		500,
		500,
		500,
		444,
		389,
		600,
		600,
		600,
		600
	],
	K: [
		722,
		722,
		667,
		667,
		778,
		667,
		667,
		722,
		600,
		600,
		600,
		600
	],
	L: [
		611,
		611,
		556,
		556,
		667,
		611,
		556,
		611,
		600,
		600,
		600,
		600
	],
	M: [
		833,
		833,
		833,
		833,
		944,
		889,
		833,
		889,
		600,
		600,
		600,
		600
	],
	N: [
		722,
		722,
		722,
		722,
		722,
		722,
		667,
		722,
		600,
		600,
		600,
		600
	],
	O: [
		778,
		778,
		778,
		778,
		778,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	P: [
		667,
		667,
		667,
		667,
		611,
		611,
		611,
		556,
		600,
		600,
		600,
		600
	],
	Q: [
		778,
		778,
		778,
		778,
		778,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	R: [
		722,
		722,
		722,
		722,
		722,
		667,
		611,
		667,
		600,
		600,
		600,
		600
	],
	S: [
		667,
		667,
		667,
		667,
		556,
		556,
		500,
		556,
		600,
		600,
		600,
		600
	],
	T: [
		611,
		611,
		611,
		611,
		667,
		611,
		556,
		611,
		600,
		600,
		600,
		600
	],
	U: [
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	V: [
		667,
		667,
		667,
		667,
		722,
		667,
		611,
		722,
		600,
		600,
		600,
		600
	],
	W: [
		944,
		944,
		944,
		944,
		1000,
		889,
		833,
		944,
		600,
		600,
		600,
		600
	],
	X: [
		667,
		667,
		667,
		667,
		722,
		667,
		611,
		722,
		600,
		600,
		600,
		600
	],
	Y: [
		667,
		667,
		667,
		667,
		722,
		611,
		556,
		722,
		600,
		600,
		600,
		600
	],
	Z: [
		611,
		611,
		611,
		611,
		667,
		611,
		556,
		611,
		600,
		600,
		600,
		600
	],
	bracketleft: [
		333,
		333,
		278,
		278,
		333,
		333,
		389,
		333,
		600,
		600,
		600,
		600
	],
	backslash: [
		278,
		278,
		278,
		278,
		278,
		278,
		278,
		278,
		600,
		600,
		600,
		600
	],
	bracketright: [
		333,
		333,
		278,
		278,
		333,
		333,
		389,
		333,
		600,
		600,
		600,
		600
	],
	asciicircum: [
		584,
		584,
		469,
		469,
		581,
		570,
		422,
		469,
		600,
		600,
		600,
		600
	],
	underscore: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	quoteleft: [
		278,
		278,
		222,
		222,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	a: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		444,
		600,
		600,
		600,
		600
	],
	b: [
		611,
		611,
		556,
		556,
		556,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	c: [
		556,
		556,
		500,
		500,
		444,
		444,
		444,
		444,
		600,
		600,
		600,
		600
	],
	d: [
		611,
		611,
		556,
		556,
		556,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	e: [
		556,
		556,
		556,
		556,
		444,
		444,
		444,
		444,
		600,
		600,
		600,
		600
	],
	f: [
		333,
		333,
		278,
		278,
		333,
		333,
		278,
		333,
		600,
		600,
		600,
		600
	],
	g: [
		611,
		611,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	h: [
		611,
		611,
		556,
		556,
		556,
		556,
		500,
		500,
		600,
		600,
		600,
		600
	],
	i: [
		278,
		278,
		222,
		222,
		278,
		278,
		278,
		278,
		600,
		600,
		600,
		600
	],
	j: [
		278,
		278,
		222,
		222,
		333,
		278,
		278,
		278,
		600,
		600,
		600,
		600
	],
	k: [
		556,
		556,
		500,
		500,
		556,
		500,
		444,
		500,
		600,
		600,
		600,
		600
	],
	l: [
		278,
		278,
		222,
		222,
		278,
		278,
		278,
		278,
		600,
		600,
		600,
		600
	],
	m: [
		889,
		889,
		833,
		833,
		833,
		778,
		722,
		778,
		600,
		600,
		600,
		600
	],
	n: [
		611,
		611,
		556,
		556,
		556,
		556,
		500,
		500,
		600,
		600,
		600,
		600
	],
	o: [
		611,
		611,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	p: [
		611,
		611,
		556,
		556,
		556,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	q: [
		611,
		611,
		556,
		556,
		556,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	r: [
		389,
		389,
		333,
		333,
		444,
		389,
		389,
		333,
		600,
		600,
		600,
		600
	],
	s: [
		556,
		556,
		500,
		500,
		389,
		389,
		389,
		389,
		600,
		600,
		600,
		600
	],
	t: [
		333,
		333,
		278,
		278,
		333,
		278,
		278,
		278,
		600,
		600,
		600,
		600
	],
	u: [
		611,
		611,
		556,
		556,
		556,
		556,
		500,
		500,
		600,
		600,
		600,
		600
	],
	v: [
		556,
		556,
		500,
		500,
		500,
		444,
		444,
		500,
		600,
		600,
		600,
		600
	],
	w: [
		778,
		778,
		722,
		722,
		722,
		667,
		667,
		722,
		600,
		600,
		600,
		600
	],
	x: [
		556,
		556,
		500,
		500,
		500,
		500,
		444,
		500,
		600,
		600,
		600,
		600
	],
	y: [
		556,
		556,
		500,
		500,
		500,
		444,
		444,
		500,
		600,
		600,
		600,
		600
	],
	z: [
		500,
		500,
		500,
		500,
		444,
		389,
		389,
		444,
		600,
		600,
		600,
		600
	],
	braceleft: [
		389,
		389,
		334,
		334,
		394,
		348,
		400,
		480,
		600,
		600,
		600,
		600
	],
	bar: [
		280,
		280,
		260,
		260,
		220,
		220,
		275,
		200,
		600,
		600,
		600,
		600
	],
	braceright: [
		389,
		389,
		334,
		334,
		394,
		348,
		400,
		480,
		600,
		600,
		600,
		600
	],
	asciitilde: [
		584,
		584,
		584,
		584,
		520,
		570,
		541,
		541,
		600,
		600,
		600,
		600
	],
	exclamdown: [
		333,
		333,
		333,
		333,
		333,
		389,
		389,
		333,
		600,
		600,
		600,
		600
	],
	cent: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	sterling: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	fraction: [
		167,
		167,
		167,
		167,
		167,
		167,
		167,
		167,
		600,
		600,
		600,
		600
	],
	yen: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	florin: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	section: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	currency: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	quotesingle: [
		238,
		238,
		191,
		191,
		278,
		278,
		214,
		180,
		600,
		600,
		600,
		600
	],
	quotedblleft: [
		500,
		500,
		333,
		333,
		500,
		500,
		556,
		444,
		600,
		600,
		600,
		600
	],
	guillemotleft: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	guilsinglleft: [
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	guilsinglright: [
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	fi: [
		611,
		611,
		500,
		500,
		556,
		556,
		500,
		556,
		600,
		600,
		600,
		600
	],
	fl: [
		611,
		611,
		500,
		500,
		556,
		556,
		500,
		556,
		600,
		600,
		600,
		600
	],
	endash: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	dagger: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	daggerdbl: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	periodcentered: [
		278,
		278,
		278,
		278,
		250,
		250,
		250,
		250,
		600,
		600,
		600,
		600
	],
	paragraph: [
		556,
		556,
		537,
		537,
		540,
		500,
		523,
		453,
		600,
		600,
		600,
		600
	],
	bullet: [
		350,
		350,
		350,
		350,
		350,
		350,
		350,
		350,
		600,
		600,
		600,
		600
	],
	quotesinglbase: [
		278,
		278,
		222,
		222,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	quotedblbase: [
		500,
		500,
		333,
		333,
		500,
		500,
		556,
		444,
		600,
		600,
		600,
		600
	],
	quotedblright: [
		500,
		500,
		333,
		333,
		500,
		500,
		556,
		444,
		600,
		600,
		600,
		600
	],
	guillemotright: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	ellipsis: [
		1000,
		1000,
		1000,
		1000,
		1000,
		1000,
		889,
		1000,
		600,
		600,
		600,
		600
	],
	perthousand: [
		1000,
		1000,
		1000,
		1000,
		1000,
		1000,
		1000,
		1000,
		600,
		600,
		600,
		600
	],
	questiondown: [
		611,
		611,
		611,
		611,
		500,
		500,
		500,
		444,
		600,
		600,
		600,
		600
	],
	grave: [
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	acute: [
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	circumflex: [
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	tilde: [
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	macron: [
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	breve: [
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	dotaccent: [
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	dieresis: [
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	ring: [
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	cedilla: [
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	hungarumlaut: [
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	ogonek: [
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	caron: [
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		333,
		600,
		600,
		600,
		600
	],
	emdash: [
		1000,
		1000,
		1000,
		1000,
		1000,
		1000,
		889,
		1000,
		600,
		600,
		600,
		600
	],
	AE: [
		1000,
		1000,
		1000,
		1000,
		1000,
		944,
		889,
		889,
		600,
		600,
		600,
		600
	],
	ordfeminine: [
		370,
		370,
		370,
		370,
		300,
		266,
		276,
		276,
		600,
		600,
		600,
		600
	],
	Lslash: [
		611,
		611,
		556,
		556,
		667,
		611,
		556,
		611,
		600,
		600,
		600,
		600
	],
	Oslash: [
		778,
		778,
		778,
		778,
		778,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	OE: [
		1000,
		1000,
		1000,
		1000,
		1000,
		944,
		944,
		889,
		600,
		600,
		600,
		600
	],
	ordmasculine: [
		365,
		365,
		365,
		365,
		330,
		300,
		310,
		310,
		600,
		600,
		600,
		600
	],
	ae: [
		889,
		889,
		889,
		889,
		722,
		722,
		667,
		667,
		600,
		600,
		600,
		600
	],
	dotlessi: [
		278,
		278,
		278,
		278,
		278,
		278,
		278,
		278,
		600,
		600,
		600,
		600
	],
	lslash: [
		278,
		278,
		222,
		222,
		278,
		278,
		278,
		278,
		600,
		600,
		600,
		600
	],
	oslash: [
		611,
		611,
		611,
		611,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	oe: [
		944,
		944,
		944,
		944,
		722,
		722,
		667,
		722,
		600,
		600,
		600,
		600
	],
	germandbls: [
		611,
		611,
		611,
		611,
		556,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	Idieresis: [
		278,
		278,
		278,
		278,
		389,
		389,
		333,
		333,
		600,
		600,
		600,
		600
	],
	eacute: [
		556,
		556,
		556,
		556,
		444,
		444,
		444,
		444,
		600,
		600,
		600,
		600
	],
	abreve: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		444,
		600,
		600,
		600,
		600
	],
	uhungarumlaut: [
		611,
		611,
		556,
		556,
		556,
		556,
		500,
		500,
		600,
		600,
		600,
		600
	],
	ecaron: [
		556,
		556,
		556,
		556,
		444,
		444,
		444,
		444,
		600,
		600,
		600,
		600
	],
	Ydieresis: [
		667,
		667,
		667,
		667,
		722,
		611,
		556,
		722,
		600,
		600,
		600,
		600
	],
	divide: [
		584,
		584,
		584,
		584,
		570,
		570,
		675,
		564,
		600,
		600,
		600,
		600
	],
	Yacute: [
		667,
		667,
		667,
		667,
		722,
		611,
		556,
		722,
		600,
		600,
		600,
		600
	],
	Acircumflex: [
		722,
		722,
		667,
		667,
		722,
		667,
		611,
		722,
		600,
		600,
		600,
		600
	],
	aacute: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		444,
		600,
		600,
		600,
		600
	],
	Ucircumflex: [
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	yacute: [
		556,
		556,
		500,
		500,
		500,
		444,
		444,
		500,
		600,
		600,
		600,
		600
	],
	scommaaccent: [
		556,
		556,
		500,
		500,
		389,
		389,
		389,
		389,
		600,
		600,
		600,
		600
	],
	ecircumflex: [
		556,
		556,
		556,
		556,
		444,
		444,
		444,
		444,
		600,
		600,
		600,
		600
	],
	Uring: [
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	Udieresis: [
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	aogonek: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		444,
		600,
		600,
		600,
		600
	],
	Uacute: [
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	uogonek: [
		611,
		611,
		556,
		556,
		556,
		556,
		500,
		500,
		600,
		600,
		600,
		600
	],
	Edieresis: [
		667,
		667,
		667,
		667,
		667,
		667,
		611,
		611,
		600,
		600,
		600,
		600
	],
	Dcroat: [
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	commaaccent: [
		250,
		250,
		250,
		250,
		250,
		250,
		250,
		250,
		600,
		600,
		600,
		600
	],
	copyright: [
		737,
		737,
		737,
		737,
		747,
		747,
		760,
		760,
		600,
		600,
		600,
		600
	],
	Emacron: [
		667,
		667,
		667,
		667,
		667,
		667,
		611,
		611,
		600,
		600,
		600,
		600
	],
	ccaron: [
		556,
		556,
		500,
		500,
		444,
		444,
		444,
		444,
		600,
		600,
		600,
		600
	],
	aring: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		444,
		600,
		600,
		600,
		600
	],
	Ncommaaccent: [
		722,
		722,
		722,
		722,
		722,
		722,
		667,
		722,
		600,
		600,
		600,
		600
	],
	lacute: [
		278,
		278,
		222,
		222,
		278,
		278,
		278,
		278,
		600,
		600,
		600,
		600
	],
	agrave: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		444,
		600,
		600,
		600,
		600
	],
	Tcommaaccent: [
		611,
		611,
		611,
		611,
		667,
		611,
		556,
		611,
		600,
		600,
		600,
		600
	],
	Cacute: [
		722,
		722,
		722,
		722,
		722,
		667,
		667,
		667,
		600,
		600,
		600,
		600
	],
	atilde: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		444,
		600,
		600,
		600,
		600
	],
	Edotaccent: [
		667,
		667,
		667,
		667,
		667,
		667,
		611,
		611,
		600,
		600,
		600,
		600
	],
	scaron: [
		556,
		556,
		500,
		500,
		389,
		389,
		389,
		389,
		600,
		600,
		600,
		600
	],
	scedilla: [
		556,
		556,
		500,
		500,
		389,
		389,
		389,
		389,
		600,
		600,
		600,
		600
	],
	iacute: [
		278,
		278,
		278,
		278,
		278,
		278,
		278,
		278,
		600,
		600,
		600,
		600
	],
	lozenge: [
		494,
		494,
		471,
		471,
		494,
		494,
		471,
		471,
		600,
		600,
		600,
		600
	],
	Rcaron: [
		722,
		722,
		722,
		722,
		722,
		667,
		611,
		667,
		600,
		600,
		600,
		600
	],
	Gcommaaccent: [
		778,
		778,
		778,
		778,
		778,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	ucircumflex: [
		611,
		611,
		556,
		556,
		556,
		556,
		500,
		500,
		600,
		600,
		600,
		600
	],
	acircumflex: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		444,
		600,
		600,
		600,
		600
	],
	Amacron: [
		722,
		722,
		667,
		667,
		722,
		667,
		611,
		722,
		600,
		600,
		600,
		600
	],
	rcaron: [
		389,
		389,
		333,
		333,
		444,
		389,
		389,
		333,
		600,
		600,
		600,
		600
	],
	ccedilla: [
		556,
		556,
		500,
		500,
		444,
		444,
		444,
		444,
		600,
		600,
		600,
		600
	],
	Zdotaccent: [
		611,
		611,
		611,
		611,
		667,
		611,
		556,
		611,
		600,
		600,
		600,
		600
	],
	Thorn: [
		667,
		667,
		667,
		667,
		611,
		611,
		611,
		556,
		600,
		600,
		600,
		600
	],
	Omacron: [
		778,
		778,
		778,
		778,
		778,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	Racute: [
		722,
		722,
		722,
		722,
		722,
		667,
		611,
		667,
		600,
		600,
		600,
		600
	],
	Sacute: [
		667,
		667,
		667,
		667,
		556,
		556,
		500,
		556,
		600,
		600,
		600,
		600
	],
	dcaron: [
		743,
		743,
		643,
		643,
		672,
		608,
		544,
		588,
		600,
		600,
		600,
		600
	],
	Umacron: [
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	uring: [
		611,
		611,
		556,
		556,
		556,
		556,
		500,
		500,
		600,
		600,
		600,
		600
	],
	threesuperior: [
		333,
		333,
		333,
		333,
		300,
		300,
		300,
		300,
		600,
		600,
		600,
		600
	],
	Ograve: [
		778,
		778,
		778,
		778,
		778,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	Agrave: [
		722,
		722,
		667,
		667,
		722,
		667,
		611,
		722,
		600,
		600,
		600,
		600
	],
	Abreve: [
		722,
		722,
		667,
		667,
		722,
		667,
		611,
		722,
		600,
		600,
		600,
		600
	],
	multiply: [
		584,
		584,
		584,
		584,
		570,
		570,
		675,
		564,
		600,
		600,
		600,
		600
	],
	uacute: [
		611,
		611,
		556,
		556,
		556,
		556,
		500,
		500,
		600,
		600,
		600,
		600
	],
	Tcaron: [
		611,
		611,
		611,
		611,
		667,
		611,
		556,
		611,
		600,
		600,
		600,
		600
	],
	partialdiff: [
		494,
		494,
		476,
		476,
		494,
		494,
		476,
		476,
		600,
		600,
		600,
		600
	],
	ydieresis: [
		556,
		556,
		500,
		500,
		500,
		444,
		444,
		500,
		600,
		600,
		600,
		600
	],
	Nacute: [
		722,
		722,
		722,
		722,
		722,
		722,
		667,
		722,
		600,
		600,
		600,
		600
	],
	icircumflex: [
		278,
		278,
		278,
		278,
		278,
		278,
		278,
		278,
		600,
		600,
		600,
		600
	],
	Ecircumflex: [
		667,
		667,
		667,
		667,
		667,
		667,
		611,
		611,
		600,
		600,
		600,
		600
	],
	adieresis: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		444,
		600,
		600,
		600,
		600
	],
	edieresis: [
		556,
		556,
		556,
		556,
		444,
		444,
		444,
		444,
		600,
		600,
		600,
		600
	],
	cacute: [
		556,
		556,
		500,
		500,
		444,
		444,
		444,
		444,
		600,
		600,
		600,
		600
	],
	nacute: [
		611,
		611,
		556,
		556,
		556,
		556,
		500,
		500,
		600,
		600,
		600,
		600
	],
	umacron: [
		611,
		611,
		556,
		556,
		556,
		556,
		500,
		500,
		600,
		600,
		600,
		600
	],
	Ncaron: [
		722,
		722,
		722,
		722,
		722,
		722,
		667,
		722,
		600,
		600,
		600,
		600
	],
	Iacute: [
		278,
		278,
		278,
		278,
		389,
		389,
		333,
		333,
		600,
		600,
		600,
		600
	],
	plusminus: [
		584,
		584,
		584,
		584,
		570,
		570,
		675,
		564,
		600,
		600,
		600,
		600
	],
	brokenbar: [
		280,
		280,
		260,
		260,
		220,
		220,
		275,
		200,
		600,
		600,
		600,
		600
	],
	registered: [
		737,
		737,
		737,
		737,
		747,
		747,
		760,
		760,
		600,
		600,
		600,
		600
	],
	Gbreve: [
		778,
		778,
		778,
		778,
		778,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	Idotaccent: [
		278,
		278,
		278,
		278,
		389,
		389,
		333,
		333,
		600,
		600,
		600,
		600
	],
	summation: [
		600,
		600,
		600,
		600,
		600,
		600,
		600,
		600,
		600,
		600,
		600,
		600
	],
	Egrave: [
		667,
		667,
		667,
		667,
		667,
		667,
		611,
		611,
		600,
		600,
		600,
		600
	],
	racute: [
		389,
		389,
		333,
		333,
		444,
		389,
		389,
		333,
		600,
		600,
		600,
		600
	],
	omacron: [
		611,
		611,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	Zacute: [
		611,
		611,
		611,
		611,
		667,
		611,
		556,
		611,
		600,
		600,
		600,
		600
	],
	Zcaron: [
		611,
		611,
		611,
		611,
		667,
		611,
		556,
		611,
		600,
		600,
		600,
		600
	],
	greaterequal: [
		549,
		549,
		549,
		549,
		549,
		549,
		549,
		549,
		600,
		600,
		600,
		600
	],
	Eth: [
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	Ccedilla: [
		722,
		722,
		722,
		722,
		722,
		667,
		667,
		667,
		600,
		600,
		600,
		600
	],
	lcommaaccent: [
		278,
		278,
		222,
		222,
		278,
		278,
		278,
		278,
		600,
		600,
		600,
		600
	],
	tcaron: [
		389,
		389,
		317,
		317,
		416,
		366,
		300,
		326,
		600,
		600,
		600,
		600
	],
	eogonek: [
		556,
		556,
		556,
		556,
		444,
		444,
		444,
		444,
		600,
		600,
		600,
		600
	],
	Uogonek: [
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	Aacute: [
		722,
		722,
		667,
		667,
		722,
		667,
		611,
		722,
		600,
		600,
		600,
		600
	],
	Adieresis: [
		722,
		722,
		667,
		667,
		722,
		667,
		611,
		722,
		600,
		600,
		600,
		600
	],
	egrave: [
		556,
		556,
		556,
		556,
		444,
		444,
		444,
		444,
		600,
		600,
		600,
		600
	],
	zacute: [
		500,
		500,
		500,
		500,
		444,
		389,
		389,
		444,
		600,
		600,
		600,
		600
	],
	iogonek: [
		278,
		278,
		222,
		222,
		278,
		278,
		278,
		278,
		600,
		600,
		600,
		600
	],
	Oacute: [
		778,
		778,
		778,
		778,
		778,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	oacute: [
		611,
		611,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	amacron: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		444,
		600,
		600,
		600,
		600
	],
	sacute: [
		556,
		556,
		500,
		500,
		389,
		389,
		389,
		389,
		600,
		600,
		600,
		600
	],
	idieresis: [
		278,
		278,
		278,
		278,
		278,
		278,
		278,
		278,
		600,
		600,
		600,
		600
	],
	Ocircumflex: [
		778,
		778,
		778,
		778,
		778,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	Ugrave: [
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	Delta: [
		612,
		612,
		612,
		612,
		612,
		612,
		612,
		612,
		600,
		600,
		600,
		600
	],
	thorn: [
		611,
		611,
		556,
		556,
		556,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	twosuperior: [
		333,
		333,
		333,
		333,
		300,
		300,
		300,
		300,
		600,
		600,
		600,
		600
	],
	Odieresis: [
		778,
		778,
		778,
		778,
		778,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	mu: [
		611,
		611,
		556,
		556,
		556,
		576,
		500,
		500,
		600,
		600,
		600,
		600
	],
	igrave: [
		278,
		278,
		278,
		278,
		278,
		278,
		278,
		278,
		600,
		600,
		600,
		600
	],
	ohungarumlaut: [
		611,
		611,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	Eogonek: [
		667,
		667,
		667,
		667,
		667,
		667,
		611,
		611,
		600,
		600,
		600,
		600
	],
	dcroat: [
		611,
		611,
		556,
		556,
		556,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	threequarters: [
		834,
		834,
		834,
		834,
		750,
		750,
		750,
		750,
		600,
		600,
		600,
		600
	],
	Scedilla: [
		667,
		667,
		667,
		667,
		556,
		556,
		500,
		556,
		600,
		600,
		600,
		600
	],
	lcaron: [
		400,
		400,
		299,
		299,
		394,
		382,
		300,
		344,
		600,
		600,
		600,
		600
	],
	Kcommaaccent: [
		722,
		722,
		667,
		667,
		778,
		667,
		667,
		722,
		600,
		600,
		600,
		600
	],
	Lacute: [
		611,
		611,
		556,
		556,
		667,
		611,
		556,
		611,
		600,
		600,
		600,
		600
	],
	trademark: [
		1000,
		1000,
		1000,
		1000,
		1000,
		1000,
		980,
		980,
		600,
		600,
		600,
		600
	],
	edotaccent: [
		556,
		556,
		556,
		556,
		444,
		444,
		444,
		444,
		600,
		600,
		600,
		600
	],
	Igrave: [
		278,
		278,
		278,
		278,
		389,
		389,
		333,
		333,
		600,
		600,
		600,
		600
	],
	Imacron: [
		278,
		278,
		278,
		278,
		389,
		389,
		333,
		333,
		600,
		600,
		600,
		600
	],
	Lcaron: [
		611,
		611,
		556,
		556,
		667,
		611,
		611,
		611,
		600,
		600,
		600,
		600
	],
	onehalf: [
		834,
		834,
		834,
		834,
		750,
		750,
		750,
		750,
		600,
		600,
		600,
		600
	],
	lessequal: [
		549,
		549,
		549,
		549,
		549,
		549,
		549,
		549,
		600,
		600,
		600,
		600
	],
	ocircumflex: [
		611,
		611,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	ntilde: [
		611,
		611,
		556,
		556,
		556,
		556,
		500,
		500,
		600,
		600,
		600,
		600
	],
	Uhungarumlaut: [
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	Eacute: [
		667,
		667,
		667,
		667,
		667,
		667,
		611,
		611,
		600,
		600,
		600,
		600
	],
	emacron: [
		556,
		556,
		556,
		556,
		444,
		444,
		444,
		444,
		600,
		600,
		600,
		600
	],
	gbreve: [
		611,
		611,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	onequarter: [
		834,
		834,
		834,
		834,
		750,
		750,
		750,
		750,
		600,
		600,
		600,
		600
	],
	Scaron: [
		667,
		667,
		667,
		667,
		556,
		556,
		500,
		556,
		600,
		600,
		600,
		600
	],
	Scommaaccent: [
		667,
		667,
		667,
		667,
		556,
		556,
		500,
		556,
		600,
		600,
		600,
		600
	],
	Ohungarumlaut: [
		778,
		778,
		778,
		778,
		778,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	degree: [
		400,
		400,
		400,
		400,
		400,
		400,
		400,
		400,
		600,
		600,
		600,
		600
	],
	ograve: [
		611,
		611,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	Ccaron: [
		722,
		722,
		722,
		722,
		722,
		667,
		667,
		667,
		600,
		600,
		600,
		600
	],
	ugrave: [
		611,
		611,
		556,
		556,
		556,
		556,
		500,
		500,
		600,
		600,
		600,
		600
	],
	radical: [
		549,
		549,
		453,
		453,
		549,
		549,
		453,
		453,
		600,
		600,
		600,
		600
	],
	Dcaron: [
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	rcommaaccent: [
		389,
		389,
		333,
		333,
		444,
		389,
		389,
		333,
		600,
		600,
		600,
		600
	],
	Ntilde: [
		722,
		722,
		722,
		722,
		722,
		722,
		667,
		722,
		600,
		600,
		600,
		600
	],
	otilde: [
		611,
		611,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	Rcommaaccent: [
		722,
		722,
		722,
		722,
		722,
		667,
		611,
		667,
		600,
		600,
		600,
		600
	],
	Lcommaaccent: [
		611,
		611,
		556,
		556,
		667,
		611,
		556,
		611,
		600,
		600,
		600,
		600
	],
	Atilde: [
		722,
		722,
		667,
		667,
		722,
		667,
		611,
		722,
		600,
		600,
		600,
		600
	],
	Aogonek: [
		722,
		722,
		667,
		667,
		722,
		667,
		611,
		722,
		600,
		600,
		600,
		600
	],
	Aring: [
		722,
		722,
		667,
		667,
		722,
		667,
		611,
		722,
		600,
		600,
		600,
		600
	],
	Otilde: [
		778,
		778,
		778,
		778,
		778,
		722,
		722,
		722,
		600,
		600,
		600,
		600
	],
	zdotaccent: [
		500,
		500,
		500,
		500,
		444,
		389,
		389,
		444,
		600,
		600,
		600,
		600
	],
	Ecaron: [
		667,
		667,
		667,
		667,
		667,
		667,
		611,
		611,
		600,
		600,
		600,
		600
	],
	Iogonek: [
		278,
		278,
		278,
		278,
		389,
		389,
		333,
		333,
		600,
		600,
		600,
		600
	],
	kcommaaccent: [
		556,
		556,
		500,
		500,
		556,
		500,
		444,
		500,
		600,
		600,
		600,
		600
	],
	minus: [
		584,
		584,
		584,
		584,
		570,
		606,
		675,
		564,
		600,
		600,
		600,
		600
	],
	Icircumflex: [
		278,
		278,
		278,
		278,
		389,
		389,
		333,
		333,
		600,
		600,
		600,
		600
	],
	ncaron: [
		611,
		611,
		556,
		556,
		556,
		556,
		500,
		500,
		600,
		600,
		600,
		600
	],
	tcommaaccent: [
		333,
		333,
		278,
		278,
		333,
		278,
		278,
		278,
		600,
		600,
		600,
		600
	],
	logicalnot: [
		584,
		584,
		584,
		584,
		570,
		606,
		675,
		564,
		600,
		600,
		600,
		600
	],
	odieresis: [
		611,
		611,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	udieresis: [
		611,
		611,
		556,
		556,
		556,
		556,
		500,
		500,
		600,
		600,
		600,
		600
	],
	notequal: [
		549,
		549,
		549,
		549,
		549,
		549,
		549,
		549,
		600,
		600,
		600,
		600
	],
	gcommaaccent: [
		611,
		611,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	eth: [
		611,
		611,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	],
	zcaron: [
		500,
		500,
		500,
		500,
		444,
		389,
		389,
		444,
		600,
		600,
		600,
		600
	],
	ncommaaccent: [
		611,
		611,
		556,
		556,
		556,
		556,
		500,
		500,
		600,
		600,
		600,
		600
	],
	onesuperior: [
		333,
		333,
		333,
		333,
		300,
		300,
		300,
		300,
		600,
		600,
		600,
		600
	],
	imacron: [
		278,
		278,
		278,
		278,
		278,
		278,
		278,
		278,
		600,
		600,
		600,
		600
	],
	Euro: [
		556,
		556,
		556,
		556,
		500,
		500,
		500,
		500,
		600,
		600,
		600,
		600
	]
};
var kernPairs = {
	AC: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	ACacute: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	ACcaron: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	ACcedilla: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AG: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AGbreve: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AGcommaaccent: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AO: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AOacute: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AOcircumflex: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AOdieresis: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AOgrave: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AOhungarumlaut: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AOmacron: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AOslash: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AOtilde: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AQ: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-55,
		-40,
		-55
	],
	AT: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	ATcaron: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	ATcommaaccent: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AU: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AUacute: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AUcircumflex: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AUdieresis: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AUgrave: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AUhungarumlaut: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AUmacron: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AUogonek: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AUring: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AV: [
		-80,
		-80,
		-70,
		-70,
		-145,
		-95,
		-105,
		-135
	],
	AW: [
		-60,
		-60,
		-50,
		-50,
		-130,
		-100,
		-95,
		-90
	],
	AY: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	AYacute: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	AYdieresis: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	Au: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Auacute: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aucircumflex: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Audieresis: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Augrave: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Auhungarumlaut: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aumacron: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Auogonek: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Auring: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Av: [
		-40,
		-40,
		-40,
		-40,
		-100,
		-74,
		-55,
		-74
	],
	Aw: [
		-30,
		-30,
		-40,
		-40,
		-90,
		-74,
		-55,
		-92
	],
	Ay: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	Ayacute: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	Aydieresis: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	AacuteC: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AacuteCacute: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AacuteCcaron: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AacuteCcedilla: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AacuteG: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AacuteGbreve: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AacuteGcommaaccent: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AacuteO: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AacuteOacute: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AacuteOcircumflex: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AacuteOdieresis: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AacuteOgrave: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AacuteOhungarumlaut: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AacuteOmacron: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AacuteOslash: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AacuteOtilde: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AacuteQ: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-55,
		-40,
		-55
	],
	AacuteT: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AacuteTcaron: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AacuteTcommaaccent: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AacuteU: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AacuteUacute: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AacuteUcircumflex: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AacuteUdieresis: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AacuteUgrave: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AacuteUhungarumlaut: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AacuteUmacron: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AacuteUogonek: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AacuteUring: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AacuteV: [
		-80,
		-80,
		-70,
		-70,
		-145,
		-95,
		-105,
		-135
	],
	AacuteW: [
		-60,
		-60,
		-50,
		-50,
		-130,
		-100,
		-95,
		-90
	],
	AacuteY: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	AacuteYacute: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	AacuteYdieresis: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	Aacuteu: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aacuteuacute: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aacuteucircumflex: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aacuteudieresis: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aacuteugrave: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aacuteuhungarumlaut: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aacuteumacron: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aacuteuogonek: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aacuteuring: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aacutev: [
		-40,
		-40,
		-40,
		-40,
		-100,
		-74,
		-55,
		-74
	],
	Aacutew: [
		-30,
		-30,
		-40,
		-40,
		-90,
		-74,
		-55,
		-92
	],
	Aacutey: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	Aacuteyacute: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	Aacuteydieresis: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	AbreveC: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AbreveCacute: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AbreveCcaron: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AbreveCcedilla: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AbreveG: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AbreveGbreve: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AbreveGcommaaccent: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AbreveO: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AbreveOacute: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AbreveOcircumflex: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AbreveOdieresis: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AbreveOgrave: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AbreveOhungarumlaut: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AbreveOmacron: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AbreveOslash: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AbreveOtilde: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AbreveQ: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-55,
		-40,
		-55
	],
	AbreveT: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AbreveTcaron: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AbreveTcommaaccent: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AbreveU: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AbreveUacute: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AbreveUcircumflex: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AbreveUdieresis: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AbreveUgrave: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AbreveUhungarumlaut: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AbreveUmacron: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AbreveUogonek: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AbreveUring: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AbreveV: [
		-80,
		-80,
		-70,
		-70,
		-145,
		-95,
		-105,
		-135
	],
	AbreveW: [
		-60,
		-60,
		-50,
		-50,
		-130,
		-100,
		-95,
		-90
	],
	AbreveY: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	AbreveYacute: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	AbreveYdieresis: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	Abreveu: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Abreveuacute: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Abreveucircumflex: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Abreveudieresis: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Abreveugrave: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Abreveuhungarumlaut: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Abreveumacron: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Abreveuogonek: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Abreveuring: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Abrevev: [
		-40,
		-40,
		-40,
		-40,
		-100,
		-74,
		-55,
		-74
	],
	Abrevew: [
		-30,
		-30,
		-40,
		-40,
		-90,
		-74,
		-55,
		-92
	],
	Abrevey: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	Abreveyacute: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	Abreveydieresis: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	AcircumflexC: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AcircumflexCacute: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AcircumflexCcaron: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AcircumflexCcedilla: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AcircumflexG: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AcircumflexGbreve: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AcircumflexGcommaaccent: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AcircumflexO: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AcircumflexOacute: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AcircumflexOcircumflex: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AcircumflexOdieresis: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AcircumflexOgrave: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AcircumflexOhungarumlaut: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AcircumflexOmacron: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AcircumflexOslash: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AcircumflexOtilde: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AcircumflexQ: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-55,
		-40,
		-55
	],
	AcircumflexT: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AcircumflexTcaron: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AcircumflexTcommaaccent: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AcircumflexU: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AcircumflexUacute: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AcircumflexUcircumflex: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AcircumflexUdieresis: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AcircumflexUgrave: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AcircumflexUhungarumlaut: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AcircumflexUmacron: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AcircumflexUogonek: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AcircumflexUring: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AcircumflexV: [
		-80,
		-80,
		-70,
		-70,
		-145,
		-95,
		-105,
		-135
	],
	AcircumflexW: [
		-60,
		-60,
		-50,
		-50,
		-130,
		-100,
		-95,
		-90
	],
	AcircumflexY: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	AcircumflexYacute: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	AcircumflexYdieresis: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	Acircumflexu: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Acircumflexuacute: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Acircumflexucircumflex: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Acircumflexudieresis: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Acircumflexugrave: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Acircumflexuhungarumlaut: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Acircumflexumacron: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Acircumflexuogonek: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Acircumflexuring: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Acircumflexv: [
		-40,
		-40,
		-40,
		-40,
		-100,
		-74,
		-55,
		-74
	],
	Acircumflexw: [
		-30,
		-30,
		-40,
		-40,
		-90,
		-74,
		-55,
		-92
	],
	Acircumflexy: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	Acircumflexyacute: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	Acircumflexydieresis: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	AdieresisC: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AdieresisCacute: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AdieresisCcaron: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AdieresisCcedilla: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AdieresisG: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AdieresisGbreve: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AdieresisGcommaaccent: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AdieresisO: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AdieresisOacute: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AdieresisOcircumflex: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AdieresisOdieresis: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AdieresisOgrave: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AdieresisOhungarumlaut: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AdieresisOmacron: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AdieresisOslash: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AdieresisOtilde: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AdieresisQ: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-55,
		-40,
		-55
	],
	AdieresisT: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AdieresisTcaron: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AdieresisTcommaaccent: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AdieresisU: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AdieresisUacute: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AdieresisUcircumflex: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AdieresisUdieresis: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AdieresisUgrave: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AdieresisUhungarumlaut: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AdieresisUmacron: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AdieresisUogonek: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AdieresisUring: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AdieresisV: [
		-80,
		-80,
		-70,
		-70,
		-145,
		-95,
		-105,
		-135
	],
	AdieresisW: [
		-60,
		-60,
		-50,
		-50,
		-130,
		-100,
		-95,
		-90
	],
	AdieresisY: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	AdieresisYacute: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	AdieresisYdieresis: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	Adieresisu: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Adieresisuacute: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Adieresisucircumflex: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Adieresisudieresis: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Adieresisugrave: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Adieresisuhungarumlaut: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Adieresisumacron: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Adieresisuogonek: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Adieresisuring: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Adieresisv: [
		-40,
		-40,
		-40,
		-40,
		-100,
		-74,
		-55,
		-74
	],
	Adieresisw: [
		-30,
		-30,
		-40,
		-40,
		-90,
		-74,
		-55,
		-92
	],
	Adieresisy: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	Adieresisyacute: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	Adieresisydieresis: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	AgraveC: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AgraveCacute: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AgraveCcaron: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AgraveCcedilla: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AgraveG: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AgraveGbreve: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AgraveGcommaaccent: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AgraveO: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AgraveOacute: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AgraveOcircumflex: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AgraveOdieresis: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AgraveOgrave: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AgraveOhungarumlaut: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AgraveOmacron: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AgraveOslash: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AgraveOtilde: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AgraveQ: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-55,
		-40,
		-55
	],
	AgraveT: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AgraveTcaron: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AgraveTcommaaccent: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AgraveU: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AgraveUacute: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AgraveUcircumflex: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AgraveUdieresis: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AgraveUgrave: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AgraveUhungarumlaut: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AgraveUmacron: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AgraveUogonek: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AgraveUring: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AgraveV: [
		-80,
		-80,
		-70,
		-70,
		-145,
		-95,
		-105,
		-135
	],
	AgraveW: [
		-60,
		-60,
		-50,
		-50,
		-130,
		-100,
		-95,
		-90
	],
	AgraveY: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	AgraveYacute: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	AgraveYdieresis: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	Agraveu: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Agraveuacute: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Agraveucircumflex: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Agraveudieresis: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Agraveugrave: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Agraveuhungarumlaut: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Agraveumacron: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Agraveuogonek: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Agraveuring: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Agravev: [
		-40,
		-40,
		-40,
		-40,
		-100,
		-74,
		-55,
		-74
	],
	Agravew: [
		-30,
		-30,
		-40,
		-40,
		-90,
		-74,
		-55,
		-92
	],
	Agravey: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	Agraveyacute: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	Agraveydieresis: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	AmacronC: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AmacronCacute: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AmacronCcaron: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AmacronCcedilla: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AmacronG: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AmacronGbreve: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AmacronGcommaaccent: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AmacronO: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AmacronOacute: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AmacronOcircumflex: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AmacronOdieresis: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AmacronOgrave: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AmacronOhungarumlaut: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AmacronOmacron: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AmacronOslash: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AmacronOtilde: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AmacronQ: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-55,
		-40,
		-55
	],
	AmacronT: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AmacronTcaron: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AmacronTcommaaccent: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AmacronU: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AmacronUacute: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AmacronUcircumflex: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AmacronUdieresis: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AmacronUgrave: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AmacronUhungarumlaut: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AmacronUmacron: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AmacronUogonek: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AmacronUring: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AmacronV: [
		-80,
		-80,
		-70,
		-70,
		-145,
		-95,
		-105,
		-135
	],
	AmacronW: [
		-60,
		-60,
		-50,
		-50,
		-130,
		-100,
		-95,
		-90
	],
	AmacronY: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	AmacronYacute: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	AmacronYdieresis: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	Amacronu: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Amacronuacute: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Amacronucircumflex: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Amacronudieresis: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Amacronugrave: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Amacronuhungarumlaut: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Amacronumacron: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Amacronuogonek: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Amacronuring: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Amacronv: [
		-40,
		-40,
		-40,
		-40,
		-100,
		-74,
		-55,
		-74
	],
	Amacronw: [
		-30,
		-30,
		-40,
		-40,
		-90,
		-74,
		-55,
		-92
	],
	Amacrony: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	Amacronyacute: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	Amacronydieresis: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	AogonekC: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AogonekCacute: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AogonekCcaron: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AogonekCcedilla: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AogonekG: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AogonekGbreve: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AogonekGcommaaccent: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AogonekO: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AogonekOacute: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AogonekOcircumflex: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AogonekOdieresis: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AogonekOgrave: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AogonekOhungarumlaut: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AogonekOmacron: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AogonekOslash: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AogonekOtilde: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AogonekQ: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-55,
		-40,
		-55
	],
	AogonekT: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AogonekTcaron: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AogonekTcommaaccent: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AogonekU: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AogonekUacute: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AogonekUcircumflex: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AogonekUdieresis: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AogonekUgrave: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AogonekUhungarumlaut: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AogonekUmacron: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AogonekUogonek: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AogonekUring: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AogonekV: [
		-80,
		-80,
		-70,
		-70,
		-145,
		-95,
		-105,
		-135
	],
	AogonekW: [
		-60,
		-60,
		-50,
		-50,
		-130,
		-100,
		-95,
		-90
	],
	AogonekY: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	AogonekYacute: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	AogonekYdieresis: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	Aogoneku: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aogonekuacute: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aogonekucircumflex: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aogonekudieresis: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aogonekugrave: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aogonekuhungarumlaut: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aogonekumacron: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aogonekuogonek: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aogonekuring: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aogonekv: [
		-40,
		-40,
		-40,
		-40,
		-100,
		-74,
		-55,
		-74
	],
	Aogonekw: [
		-30,
		-30,
		-40,
		-40,
		-90,
		-74,
		-55,
		-52
	],
	Aogoneky: [
		-30,
		-30,
		-40,
		-40,
		-34,
		-34,
		-55,
		-52
	],
	Aogonekyacute: [
		-30,
		-30,
		-40,
		-40,
		-34,
		-34,
		-55,
		-52
	],
	Aogonekydieresis: [
		-30,
		-30,
		-40,
		-40,
		-34,
		-34,
		-55,
		-52
	],
	AringC: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AringCacute: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AringCcaron: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AringCcedilla: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AringG: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AringGbreve: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AringGcommaaccent: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AringO: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AringOacute: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AringOcircumflex: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AringOdieresis: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AringOgrave: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AringOhungarumlaut: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AringOmacron: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AringOslash: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AringOtilde: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AringQ: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-55,
		-40,
		-55
	],
	AringT: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AringTcaron: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AringTcommaaccent: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AringU: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AringUacute: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AringUcircumflex: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AringUdieresis: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AringUgrave: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AringUhungarumlaut: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AringUmacron: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AringUogonek: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AringUring: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AringV: [
		-80,
		-80,
		-70,
		-70,
		-145,
		-95,
		-105,
		-135
	],
	AringW: [
		-60,
		-60,
		-50,
		-50,
		-130,
		-100,
		-95,
		-90
	],
	AringY: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	AringYacute: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	AringYdieresis: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	Aringu: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aringuacute: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aringucircumflex: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aringudieresis: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aringugrave: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aringuhungarumlaut: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aringumacron: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aringuogonek: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aringuring: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Aringv: [
		-40,
		-40,
		-40,
		-40,
		-100,
		-74,
		-55,
		-74
	],
	Aringw: [
		-30,
		-30,
		-40,
		-40,
		-90,
		-74,
		-55,
		-92
	],
	Aringy: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	Aringyacute: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	Aringydieresis: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	AtildeC: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AtildeCacute: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AtildeCcaron: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AtildeCcedilla: [
		-40,
		-40,
		-30,
		-30,
		-55,
		-65,
		-30,
		-40
	],
	AtildeG: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AtildeGbreve: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AtildeGcommaaccent: [
		-50,
		-50,
		-30,
		-30,
		-55,
		-60,
		-35,
		-40
	],
	AtildeO: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AtildeOacute: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AtildeOcircumflex: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AtildeOdieresis: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AtildeOgrave: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AtildeOhungarumlaut: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AtildeOmacron: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AtildeOslash: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AtildeOtilde: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-50,
		-40,
		-55
	],
	AtildeQ: [
		-40,
		-40,
		-30,
		-30,
		-45,
		-55,
		-40,
		-55
	],
	AtildeT: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AtildeTcaron: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AtildeTcommaaccent: [
		-90,
		-90,
		-120,
		-120,
		-95,
		-55,
		-37,
		-111
	],
	AtildeU: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AtildeUacute: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AtildeUcircumflex: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AtildeUdieresis: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AtildeUgrave: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AtildeUhungarumlaut: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AtildeUmacron: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AtildeUogonek: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AtildeUring: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-55
	],
	AtildeV: [
		-80,
		-80,
		-70,
		-70,
		-145,
		-95,
		-105,
		-135
	],
	AtildeW: [
		-60,
		-60,
		-50,
		-50,
		-130,
		-100,
		-95,
		-90
	],
	AtildeY: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	AtildeYacute: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	AtildeYdieresis: [
		-110,
		-110,
		-100,
		-100,
		-100,
		-70,
		-55,
		-105
	],
	Atildeu: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Atildeuacute: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Atildeucircumflex: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Atildeudieresis: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Atildeugrave: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Atildeuhungarumlaut: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Atildeumacron: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Atildeuogonek: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Atildeuring: [
		-30,
		-30,
		-30,
		-30,
		-50,
		-30,
		-20
	],
	Atildev: [
		-40,
		-40,
		-40,
		-40,
		-100,
		-74,
		-55,
		-74
	],
	Atildew: [
		-30,
		-30,
		-40,
		-40,
		-90,
		-74,
		-55,
		-92
	],
	Atildey: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	Atildeyacute: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	Atildeydieresis: [
		-30,
		-30,
		-40,
		-40,
		-74,
		-74,
		-55,
		-92
	],
	BA: [
		-30,
		-30,
		0,
		0,
		-30,
		-25,
		-25,
		-35
	],
	BAacute: [
		-30,
		-30,
		0,
		0,
		-30,
		-25,
		-25,
		-35
	],
	BAbreve: [
		-30,
		-30,
		0,
		0,
		-30,
		-25,
		-25,
		-35
	],
	BAcircumflex: [
		-30,
		-30,
		0,
		0,
		-30,
		-25,
		-25,
		-35
	],
	BAdieresis: [
		-30,
		-30,
		0,
		0,
		-30,
		-25,
		-25,
		-35
	],
	BAgrave: [
		-30,
		-30,
		0,
		0,
		-30,
		-25,
		-25,
		-35
	],
	BAmacron: [
		-30,
		-30,
		0,
		0,
		-30,
		-25,
		-25,
		-35
	],
	BAogonek: [
		-30,
		-30,
		0,
		0,
		-30,
		-25,
		-25,
		-35
	],
	BAring: [
		-30,
		-30,
		0,
		0,
		-30,
		-25,
		-25,
		-35
	],
	BAtilde: [
		-30,
		-30,
		0,
		0,
		-30,
		-25,
		-25,
		-35
	],
	BU: [
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10
	],
	BUacute: [
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10
	],
	BUcircumflex: [
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10
	],
	BUdieresis: [
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10
	],
	BUgrave: [
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10
	],
	BUhungarumlaut: [
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10
	],
	BUmacron: [
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10
	],
	BUogonek: [
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10
	],
	BUring: [
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10
	],
	DA: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DAacute: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DAbreve: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DAcircumflex: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DAdieresis: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DAgrave: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DAmacron: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DAogonek: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DAring: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DAtilde: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DV: [
		-40,
		-40,
		-70,
		-70,
		-40,
		-50,
		-40,
		-40
	],
	DW: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-30
	],
	DY: [
		-70,
		-70,
		-90,
		-90,
		-40,
		-50,
		-40,
		-55
	],
	DYacute: [
		-70,
		-70,
		-90,
		-90,
		-40,
		-50,
		-40,
		-55
	],
	DYdieresis: [
		-70,
		-70,
		-90,
		-90,
		-40,
		-50,
		-40,
		-55
	],
	Dcomma: [
		-30,
		-30,
		-70,
		-70
	],
	Dperiod: [
		-30,
		-30,
		-70,
		-70,
		-20
	],
	DcaronA: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DcaronAacute: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DcaronAbreve: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DcaronAcircumflex: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DcaronAdieresis: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DcaronAgrave: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DcaronAmacron: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DcaronAogonek: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DcaronAring: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DcaronAtilde: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DcaronV: [
		-40,
		-40,
		-70,
		-70,
		-40,
		-50,
		-40,
		-40
	],
	DcaronW: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-30
	],
	DcaronY: [
		-70,
		-70,
		-90,
		-90,
		-40,
		-50,
		-40,
		-55
	],
	DcaronYacute: [
		-70,
		-70,
		-90,
		-90,
		-40,
		-50,
		-40,
		-55
	],
	DcaronYdieresis: [
		-70,
		-70,
		-90,
		-90,
		-40,
		-50,
		-40,
		-55
	],
	Dcaroncomma: [
		-30,
		-30,
		-70,
		-70
	],
	Dcaronperiod: [
		-30,
		-30,
		-70,
		-70,
		-20
	],
	DcroatA: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DcroatAacute: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DcroatAbreve: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DcroatAcircumflex: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DcroatAdieresis: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DcroatAgrave: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DcroatAmacron: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DcroatAogonek: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DcroatAring: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DcroatAtilde: [
		-40,
		-40,
		-40,
		-40,
		-35,
		-25,
		-35,
		-40
	],
	DcroatV: [
		-40,
		-40,
		-70,
		-70,
		-40,
		-50,
		-40,
		-40
	],
	DcroatW: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-30
	],
	DcroatY: [
		-70,
		-70,
		-90,
		-90,
		-40,
		-50,
		-40,
		-55
	],
	DcroatYacute: [
		-70,
		-70,
		-90,
		-90,
		-40,
		-50,
		-40,
		-55
	],
	DcroatYdieresis: [
		-70,
		-70,
		-90,
		-90,
		-40,
		-50,
		-40,
		-55
	],
	Dcroatcomma: [
		-30,
		-30,
		-70,
		-70
	],
	Dcroatperiod: [
		-30,
		-30,
		-70,
		-70,
		-20
	],
	FA: [
		-80,
		-80,
		-80,
		-80,
		-90,
		-100,
		-115,
		-74
	],
	FAacute: [
		-80,
		-80,
		-80,
		-80,
		-90,
		-100,
		-115,
		-74
	],
	FAbreve: [
		-80,
		-80,
		-80,
		-80,
		-90,
		-100,
		-115,
		-74
	],
	FAcircumflex: [
		-80,
		-80,
		-80,
		-80,
		-90,
		-100,
		-115,
		-74
	],
	FAdieresis: [
		-80,
		-80,
		-80,
		-80,
		-90,
		-100,
		-115,
		-74
	],
	FAgrave: [
		-80,
		-80,
		-80,
		-80,
		-90,
		-100,
		-115,
		-74
	],
	FAmacron: [
		-80,
		-80,
		-80,
		-80,
		-90,
		-100,
		-115,
		-74
	],
	FAogonek: [
		-80,
		-80,
		-80,
		-80,
		-90,
		-100,
		-115,
		-74
	],
	FAring: [
		-80,
		-80,
		-80,
		-80,
		-90,
		-100,
		-115,
		-74
	],
	FAtilde: [
		-80,
		-80,
		-80,
		-80,
		-90,
		-100,
		-115,
		-74
	],
	Fa: [
		-20,
		-20,
		-50,
		-50,
		-25,
		-95,
		-75,
		-15
	],
	Faacute: [
		-20,
		-20,
		-50,
		-50,
		-25,
		-95,
		-75,
		-15
	],
	Fabreve: [
		-20,
		-20,
		-50,
		-50,
		-25,
		-95,
		-75,
		-15
	],
	Facircumflex: [
		-20,
		-20,
		-50,
		-50,
		-25,
		-95,
		-75,
		-15
	],
	Fadieresis: [
		-20,
		-20,
		-50,
		-50,
		-25,
		-95,
		-75,
		-15
	],
	Fagrave: [
		-20,
		-20,
		-50,
		-50,
		-25,
		-95,
		-75,
		-15
	],
	Famacron: [
		-20,
		-20,
		-50,
		-50,
		-25,
		-95,
		-75,
		-15
	],
	Faogonek: [
		-20,
		-20,
		-50,
		-50,
		-25,
		-95,
		-75,
		-15
	],
	Faring: [
		-20,
		-20,
		-50,
		-50,
		-25,
		-95,
		-75,
		-15
	],
	Fatilde: [
		-20,
		-20,
		-50,
		-50,
		-25,
		-95,
		-75,
		-15
	],
	Fcomma: [
		-100,
		-100,
		-150,
		-150,
		-92,
		-129,
		-135,
		-80
	],
	Fperiod: [
		-100,
		-100,
		-150,
		-150,
		-110,
		-129,
		-135,
		-80
	],
	JA: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-25,
		-40,
		-60
	],
	JAacute: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-25,
		-40,
		-60
	],
	JAbreve: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-25,
		-40,
		-60
	],
	JAcircumflex: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-25,
		-40,
		-60
	],
	JAdieresis: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-25,
		-40,
		-60
	],
	JAgrave: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-25,
		-40,
		-60
	],
	JAmacron: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-25,
		-40,
		-60
	],
	JAogonek: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-25,
		-40,
		-60
	],
	JAring: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-25,
		-40,
		-60
	],
	JAtilde: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-25,
		-40,
		-60
	],
	Jcomma: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		-25
	],
	Jperiod: [
		-20,
		-20,
		-30,
		-30,
		-20,
		-10,
		-25
	],
	Ju: [
		-20,
		-20,
		-20,
		-20,
		-15,
		-40,
		-35
	],
	Juacute: [
		-20,
		-20,
		-20,
		-20,
		-15,
		-40,
		-35
	],
	Jucircumflex: [
		-20,
		-20,
		-20,
		-20,
		-15,
		-40,
		-35
	],
	Judieresis: [
		-20,
		-20,
		-20,
		-20,
		-15,
		-40,
		-35
	],
	Jugrave: [
		-20,
		-20,
		-20,
		-20,
		-15,
		-40,
		-35
	],
	Juhungarumlaut: [
		-20,
		-20,
		-20,
		-20,
		-15,
		-40,
		-35
	],
	Jumacron: [
		-20,
		-20,
		-20,
		-20,
		-15,
		-40,
		-35
	],
	Juogonek: [
		-20,
		-20,
		-20,
		-20,
		-15,
		-40,
		-35
	],
	Juring: [
		-20,
		-20,
		-20,
		-20,
		-15,
		-40,
		-35
	],
	KO: [
		-30,
		-30,
		-50,
		-50,
		-30,
		-30,
		-50,
		-30
	],
	KOacute: [
		-30,
		-30,
		-50,
		-50,
		-30,
		-30,
		-50,
		-30
	],
	KOcircumflex: [
		-30,
		-30,
		-50,
		-50,
		-30,
		-30,
		-50,
		-30
	],
	KOdieresis: [
		-30,
		-30,
		-50,
		-50,
		-30,
		-30,
		-50,
		-30
	],
	KOgrave: [
		-30,
		-30,
		-50,
		-50,
		-30,
		-30,
		-50,
		-30
	],
	KOhungarumlaut: [
		-30,
		-30,
		-50,
		-50,
		-30,
		-30,
		-50,
		-30
	],
	KOmacron: [
		-30,
		-30,
		-50,
		-50,
		-30,
		-30,
		-50,
		-30
	],
	KOslash: [
		-30,
		-30,
		-50,
		-50,
		-30,
		-30,
		-50,
		-30
	],
	KOtilde: [
		-30,
		-30,
		-50,
		-50,
		-30,
		-30,
		-50,
		-30
	],
	Ke: [
		-15,
		-15,
		-40,
		-40,
		-25,
		-25,
		-35,
		-25
	],
	Keacute: [
		-15,
		-15,
		-40,
		-40,
		-25,
		-25,
		-35,
		-25
	],
	Kecaron: [
		-15,
		-15,
		-40,
		-40,
		-25,
		-25,
		-35,
		-25
	],
	Kecircumflex: [
		-15,
		-15,
		-40,
		-40,
		-25,
		-25,
		-35,
		-25
	],
	Kedieresis: [
		-15,
		-15,
		-40,
		-40,
		-25,
		-25,
		-35,
		-25
	],
	Kedotaccent: [
		-15,
		-15,
		-40,
		-40,
		-25,
		-25,
		-35,
		-25
	],
	Kegrave: [
		-15,
		-15,
		-40,
		-40,
		-25,
		-25,
		-35,
		-25
	],
	Kemacron: [
		-15,
		-15,
		-40,
		-40,
		-25,
		-25,
		-35,
		-25
	],
	Keogonek: [
		-15,
		-15,
		-40,
		-40,
		-25,
		-25,
		-35,
		-25
	],
	Ko: [
		-35,
		-35,
		-40,
		-40,
		-25,
		-25,
		-40,
		-35
	],
	Koacute: [
		-35,
		-35,
		-40,
		-40,
		-25,
		-25,
		-40,
		-35
	],
	Kocircumflex: [
		-35,
		-35,
		-40,
		-40,
		-25,
		-25,
		-40,
		-35
	],
	Kodieresis: [
		-35,
		-35,
		-40,
		-40,
		-25,
		-25,
		-40,
		-35
	],
	Kograve: [
		-35,
		-35,
		-40,
		-40,
		-25,
		-25,
		-40,
		-35
	],
	Kohungarumlaut: [
		-35,
		-35,
		-40,
		-40,
		-25,
		-25,
		-40,
		-35
	],
	Komacron: [
		-35,
		-35,
		-40,
		-40,
		-25,
		-25,
		-40,
		-35
	],
	Koslash: [
		-35,
		-35,
		-40,
		-40,
		-25,
		-25,
		-40,
		-35
	],
	Kotilde: [
		-35,
		-35,
		-40,
		-40,
		-25,
		-25,
		-40,
		-35
	],
	Ku: [
		-30,
		-30,
		-30,
		-30,
		-15,
		-20,
		-40,
		-15
	],
	Kuacute: [
		-30,
		-30,
		-30,
		-30,
		-15,
		-20,
		-40,
		-15
	],
	Kucircumflex: [
		-30,
		-30,
		-30,
		-30,
		-15,
		-20,
		-40,
		-15
	],
	Kudieresis: [
		-30,
		-30,
		-30,
		-30,
		-15,
		-20,
		-40,
		-15
	],
	Kugrave: [
		-30,
		-30,
		-30,
		-30,
		-15,
		-20,
		-40,
		-15
	],
	Kuhungarumlaut: [
		-30,
		-30,
		-30,
		-30,
		-15,
		-20,
		-40,
		-15
	],
	Kumacron: [
		-30,
		-30,
		-30,
		-30,
		-15,
		-20,
		-40,
		-15
	],
	Kuogonek: [
		-30,
		-30,
		-30,
		-30,
		-15,
		-20,
		-40,
		-15
	],
	Kuring: [
		-30,
		-30,
		-30,
		-30,
		-15,
		-20,
		-40,
		-15
	],
	Ky: [
		-40,
		-40,
		-50,
		-50,
		-45,
		-20,
		-40,
		-25
	],
	Kyacute: [
		-40,
		-40,
		-50,
		-50,
		-45,
		-20,
		-40,
		-25
	],
	Kydieresis: [
		-40,
		-40,
		-50,
		-50,
		-45,
		-20,
		-40,
		-25
	],
	KcommaaccentO: [
		-30,
		-30,
		-50,
		-50,
		-30,
		-30,
		-50,
		-30
	],
	KcommaaccentOacute: [
		-30,
		-30,
		-50,
		-50,
		-30,
		-30,
		-50,
		-30
	],
	KcommaaccentOcircumflex: [
		-30,
		-30,
		-50,
		-50,
		-30,
		-30,
		-50,
		-30
	],
	KcommaaccentOdieresis: [
		-30,
		-30,
		-50,
		-50,
		-30,
		-30,
		-50,
		-30
	],
	KcommaaccentOgrave: [
		-30,
		-30,
		-50,
		-50,
		-30,
		-30,
		-50,
		-30
	],
	KcommaaccentOhungarumlaut: [
		-30,
		-30,
		-50,
		-50,
		-30,
		-30,
		-50,
		-30
	],
	KcommaaccentOmacron: [
		-30,
		-30,
		-50,
		-50,
		-30,
		-30,
		-50,
		-30
	],
	KcommaaccentOslash: [
		-30,
		-30,
		-50,
		-50,
		-30,
		-30,
		-50,
		-30
	],
	KcommaaccentOtilde: [
		-30,
		-30,
		-50,
		-50,
		-30,
		-30,
		-50,
		-30
	],
	Kcommaaccente: [
		-15,
		-15,
		-40,
		-40,
		-25,
		-25,
		-35,
		-25
	],
	Kcommaaccenteacute: [
		-15,
		-15,
		-40,
		-40,
		-25,
		-25,
		-35,
		-25
	],
	Kcommaaccentecaron: [
		-15,
		-15,
		-40,
		-40,
		-25,
		-25,
		-35,
		-25
	],
	Kcommaaccentecircumflex: [
		-15,
		-15,
		-40,
		-40,
		-25,
		-25,
		-35,
		-25
	],
	Kcommaaccentedieresis: [
		-15,
		-15,
		-40,
		-40,
		-25,
		-25,
		-35,
		-25
	],
	Kcommaaccentedotaccent: [
		-15,
		-15,
		-40,
		-40,
		-25,
		-25,
		-35,
		-25
	],
	Kcommaaccentegrave: [
		-15,
		-15,
		-40,
		-40,
		-25,
		-25,
		-35,
		-25
	],
	Kcommaaccentemacron: [
		-15,
		-15,
		-40,
		-40,
		-25,
		-25,
		-35,
		-25
	],
	Kcommaaccenteogonek: [
		-15,
		-15,
		-40,
		-40,
		-25,
		-25,
		-35,
		-25
	],
	Kcommaaccento: [
		-35,
		-35,
		-40,
		-40,
		-25,
		-25,
		-40,
		-35
	],
	Kcommaaccentoacute: [
		-35,
		-35,
		-40,
		-40,
		-25,
		-25,
		-40,
		-35
	],
	Kcommaaccentocircumflex: [
		-35,
		-35,
		-40,
		-40,
		-25,
		-25,
		-40,
		-35
	],
	Kcommaaccentodieresis: [
		-35,
		-35,
		-40,
		-40,
		-25,
		-25,
		-40,
		-35
	],
	Kcommaaccentograve: [
		-35,
		-35,
		-40,
		-40,
		-25,
		-25,
		-40,
		-35
	],
	Kcommaaccentohungarumlaut: [
		-35,
		-35,
		-40,
		-40,
		-25,
		-25,
		-40,
		-35
	],
	Kcommaaccentomacron: [
		-35,
		-35,
		-40,
		-40,
		-25,
		-25,
		-40,
		-35
	],
	Kcommaaccentoslash: [
		-35,
		-35,
		-40,
		-40,
		-25,
		-25,
		-40,
		-35
	],
	Kcommaaccentotilde: [
		-35,
		-35,
		-40,
		-40,
		-25,
		-25,
		-40,
		-35
	],
	Kcommaaccentu: [
		-30,
		-30,
		-30,
		-30,
		-15,
		-20,
		-40,
		-15
	],
	Kcommaaccentuacute: [
		-30,
		-30,
		-30,
		-30,
		-15,
		-20,
		-40,
		-15
	],
	Kcommaaccentucircumflex: [
		-30,
		-30,
		-30,
		-30,
		-15,
		-20,
		-40,
		-15
	],
	Kcommaaccentudieresis: [
		-30,
		-30,
		-30,
		-30,
		-15,
		-20,
		-40,
		-15
	],
	Kcommaaccentugrave: [
		-30,
		-30,
		-30,
		-30,
		-15,
		-20,
		-40,
		-15
	],
	Kcommaaccentuhungarumlaut: [
		-30,
		-30,
		-30,
		-30,
		-15,
		-20,
		-40,
		-15
	],
	Kcommaaccentumacron: [
		-30,
		-30,
		-30,
		-30,
		-15,
		-20,
		-40,
		-15
	],
	Kcommaaccentuogonek: [
		-30,
		-30,
		-30,
		-30,
		-15,
		-20,
		-40,
		-15
	],
	Kcommaaccenturing: [
		-30,
		-30,
		-30,
		-30,
		-15,
		-20,
		-40,
		-15
	],
	Kcommaaccenty: [
		-40,
		-40,
		-50,
		-50,
		-45,
		-20,
		-40,
		-25
	],
	Kcommaaccentyacute: [
		-40,
		-40,
		-50,
		-50,
		-45,
		-20,
		-40,
		-25
	],
	Kcommaaccentydieresis: [
		-40,
		-40,
		-50,
		-50,
		-45,
		-20,
		-40,
		-25
	],
	LT: [
		-90,
		-90,
		-110,
		-110,
		-92,
		-18,
		-20,
		-92
	],
	LTcaron: [
		-90,
		-90,
		-110,
		-110,
		-92,
		-18,
		-20,
		-92
	],
	LTcommaaccent: [
		-90,
		-90,
		-110,
		-110,
		-92,
		-18,
		-20,
		-92
	],
	LV: [
		-110,
		-110,
		-110,
		-110,
		-92,
		-37,
		-55,
		-100
	],
	LW: [
		-80,
		-80,
		-70,
		-70,
		-92,
		-37,
		-55,
		-74
	],
	LY: [
		-120,
		-120,
		-140,
		-140,
		-92,
		-37,
		-20,
		-100
	],
	LYacute: [
		-120,
		-120,
		-140,
		-140,
		-92,
		-37,
		-20,
		-100
	],
	LYdieresis: [
		-120,
		-120,
		-140,
		-140,
		-92,
		-37,
		-20,
		-100
	],
	Lquotedblright: [
		-140,
		-140,
		-140,
		-140,
		-20
	],
	Lquoteright: [
		-140,
		-140,
		-160,
		-160,
		-110,
		-55,
		-37,
		-92
	],
	Ly: [
		-30,
		-30,
		-30,
		-30,
		-55,
		-37,
		-30,
		-55
	],
	Lyacute: [
		-30,
		-30,
		-30,
		-30,
		-55,
		-37,
		-30,
		-55
	],
	Lydieresis: [
		-30,
		-30,
		-30,
		-30,
		-55,
		-37,
		-30,
		-55
	],
	LacuteT: [
		-90,
		-90,
		-110,
		-110,
		-92,
		-18,
		-20,
		-92
	],
	LacuteTcaron: [
		-90,
		-90,
		-110,
		-110,
		-92,
		-18,
		-20,
		-92
	],
	LacuteTcommaaccent: [
		-90,
		-90,
		-110,
		-110,
		-92,
		-18,
		-20,
		-92
	],
	LacuteV: [
		-110,
		-110,
		-110,
		-110,
		-92,
		-37,
		-55,
		-100
	],
	LacuteW: [
		-80,
		-80,
		-70,
		-70,
		-92,
		-37,
		-55,
		-74
	],
	LacuteY: [
		-120,
		-120,
		-140,
		-140,
		-92,
		-37,
		-20,
		-100
	],
	LacuteYacute: [
		-120,
		-120,
		-140,
		-140,
		-92,
		-37,
		-20,
		-100
	],
	LacuteYdieresis: [
		-120,
		-120,
		-140,
		-140,
		-92,
		-37,
		-20,
		-100
	],
	Lacutequotedblright: [
		-140,
		-140,
		-140,
		-140,
		-20
	],
	Lacutequoteright: [
		-140,
		-140,
		-160,
		-160,
		-110,
		-55,
		-37,
		-92
	],
	Lacutey: [
		-30,
		-30,
		-30,
		-30,
		-55,
		-37,
		-30,
		-55
	],
	Lacuteyacute: [
		-30,
		-30,
		-30,
		-30,
		-55,
		-37,
		-30,
		-55
	],
	Lacuteydieresis: [
		-30,
		-30,
		-30,
		-30,
		-55,
		-37,
		-30,
		-55
	],
	LcommaaccentT: [
		-90,
		-90,
		-110,
		-110,
		-92,
		-18,
		-20,
		-92
	],
	LcommaaccentTcaron: [
		-90,
		-90,
		-110,
		-110,
		-92,
		-18,
		-20,
		-92
	],
	LcommaaccentTcommaaccent: [
		-90,
		-90,
		-110,
		-110,
		-92,
		-18,
		-20,
		-92
	],
	LcommaaccentV: [
		-110,
		-110,
		-110,
		-110,
		-92,
		-37,
		-55,
		-100
	],
	LcommaaccentW: [
		-80,
		-80,
		-70,
		-70,
		-92,
		-37,
		-55,
		-74
	],
	LcommaaccentY: [
		-120,
		-120,
		-140,
		-140,
		-92,
		-37,
		-20,
		-100
	],
	LcommaaccentYacute: [
		-120,
		-120,
		-140,
		-140,
		-92,
		-37,
		-20,
		-100
	],
	LcommaaccentYdieresis: [
		-120,
		-120,
		-140,
		-140,
		-92,
		-37,
		-20,
		-100
	],
	Lcommaaccentquotedblright: [
		-140,
		-140,
		-140,
		-140,
		-20
	],
	Lcommaaccentquoteright: [
		-140,
		-140,
		-160,
		-160,
		-110,
		-55,
		-37,
		-92
	],
	Lcommaaccenty: [
		-30,
		-30,
		-30,
		-30,
		-55,
		-37,
		-30,
		-55
	],
	Lcommaaccentyacute: [
		-30,
		-30,
		-30,
		-30,
		-55,
		-37,
		-30,
		-55
	],
	Lcommaaccentydieresis: [
		-30,
		-30,
		-30,
		-30,
		-55,
		-37,
		-30,
		-55
	],
	LslashT: [
		-90,
		-90,
		-110,
		-110,
		-92,
		-18,
		-20,
		-92
	],
	LslashTcaron: [
		-90,
		-90,
		-110,
		-110,
		-92,
		-18,
		-20,
		-92
	],
	LslashTcommaaccent: [
		-90,
		-90,
		-110,
		-110,
		-92,
		-18,
		-20,
		-92
	],
	LslashV: [
		-110,
		-110,
		-110,
		-110,
		-92,
		-37,
		-55,
		-100
	],
	LslashW: [
		-80,
		-80,
		-70,
		-70,
		-92,
		-37,
		-55,
		-74
	],
	LslashY: [
		-120,
		-120,
		-140,
		-140,
		-92,
		-37,
		-20,
		-100
	],
	LslashYacute: [
		-120,
		-120,
		-140,
		-140,
		-92,
		-37,
		-20,
		-100
	],
	LslashYdieresis: [
		-120,
		-120,
		-140,
		-140,
		-92,
		-37,
		-20,
		-100
	],
	Lslashquotedblright: [
		-140,
		-140,
		-140,
		-140,
		-20
	],
	Lslashquoteright: [
		-140,
		-140,
		-160,
		-160,
		-110,
		-55,
		-37,
		-92
	],
	Lslashy: [
		-30,
		-30,
		-30,
		-30,
		-55,
		-37,
		-30,
		-55
	],
	Lslashyacute: [
		-30,
		-30,
		-30,
		-30,
		-55,
		-37,
		-30,
		-55
	],
	Lslashydieresis: [
		-30,
		-30,
		-30,
		-30,
		-55,
		-37,
		-30,
		-55
	],
	OA: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OAacute: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OAbreve: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OAcircumflex: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OAdieresis: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OAgrave: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OAmacron: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OAogonek: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OAring: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OAtilde: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OT: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OTcaron: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OTcommaaccent: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OV: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50
	],
	OW: [
		-50,
		-50,
		-30,
		-30,
		-50,
		-50,
		-50,
		-35
	],
	OX: [
		-50,
		-50,
		-60,
		-60,
		-40,
		-40,
		-40,
		-40
	],
	OY: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	OYacute: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	OYdieresis: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	Ocomma: [
		-40,
		-40,
		-40,
		-40
	],
	Operiod: [
		-40,
		-40,
		-40,
		-40
	],
	OacuteA: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OacuteAacute: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OacuteAbreve: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OacuteAcircumflex: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OacuteAdieresis: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OacuteAgrave: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OacuteAmacron: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OacuteAogonek: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OacuteAring: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OacuteAtilde: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OacuteT: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OacuteTcaron: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OacuteTcommaaccent: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OacuteV: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50
	],
	OacuteW: [
		-50,
		-50,
		-30,
		-30,
		-50,
		-50,
		-50,
		-35
	],
	OacuteX: [
		-50,
		-50,
		-60,
		-60,
		-40,
		-40,
		-40,
		-40
	],
	OacuteY: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	OacuteYacute: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	OacuteYdieresis: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	Oacutecomma: [
		-40,
		-40,
		-40,
		-40
	],
	Oacuteperiod: [
		-40,
		-40,
		-40,
		-40
	],
	OcircumflexA: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OcircumflexAacute: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OcircumflexAbreve: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OcircumflexAcircumflex: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OcircumflexAdieresis: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OcircumflexAgrave: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OcircumflexAmacron: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OcircumflexAogonek: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OcircumflexAring: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OcircumflexAtilde: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OcircumflexT: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OcircumflexTcaron: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OcircumflexTcommaaccent: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OcircumflexV: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50
	],
	OcircumflexW: [
		-50,
		-50,
		-30,
		-30,
		-50,
		-50,
		-50,
		-35
	],
	OcircumflexX: [
		-50,
		-50,
		-60,
		-60,
		-40,
		-40,
		-40,
		-40
	],
	OcircumflexY: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	OcircumflexYacute: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	OcircumflexYdieresis: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	Ocircumflexcomma: [
		-40,
		-40,
		-40,
		-40
	],
	Ocircumflexperiod: [
		-40,
		-40,
		-40,
		-40
	],
	OdieresisA: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OdieresisAacute: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OdieresisAbreve: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OdieresisAcircumflex: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OdieresisAdieresis: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OdieresisAgrave: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OdieresisAmacron: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OdieresisAogonek: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OdieresisAring: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OdieresisAtilde: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OdieresisT: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OdieresisTcaron: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OdieresisTcommaaccent: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OdieresisV: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50
	],
	OdieresisW: [
		-50,
		-50,
		-30,
		-30,
		-50,
		-50,
		-50,
		-35
	],
	OdieresisX: [
		-50,
		-50,
		-60,
		-60,
		-40,
		-40,
		-40,
		-40
	],
	OdieresisY: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	OdieresisYacute: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	OdieresisYdieresis: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	Odieresiscomma: [
		-40,
		-40,
		-40,
		-40
	],
	Odieresisperiod: [
		-40,
		-40,
		-40,
		-40
	],
	OgraveA: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OgraveAacute: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OgraveAbreve: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OgraveAcircumflex: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OgraveAdieresis: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OgraveAgrave: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OgraveAmacron: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OgraveAogonek: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OgraveAring: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OgraveAtilde: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OgraveT: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OgraveTcaron: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OgraveTcommaaccent: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OgraveV: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50
	],
	OgraveW: [
		-50,
		-50,
		-30,
		-30,
		-50,
		-50,
		-50,
		-35
	],
	OgraveX: [
		-50,
		-50,
		-60,
		-60,
		-40,
		-40,
		-40,
		-40
	],
	OgraveY: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	OgraveYacute: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	OgraveYdieresis: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	Ogravecomma: [
		-40,
		-40,
		-40,
		-40
	],
	Ograveperiod: [
		-40,
		-40,
		-40,
		-40
	],
	OhungarumlautA: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OhungarumlautAacute: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OhungarumlautAbreve: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OhungarumlautAcircumflex: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OhungarumlautAdieresis: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OhungarumlautAgrave: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OhungarumlautAmacron: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OhungarumlautAogonek: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OhungarumlautAring: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OhungarumlautAtilde: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OhungarumlautT: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OhungarumlautTcaron: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OhungarumlautTcommaaccent: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OhungarumlautV: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50
	],
	OhungarumlautW: [
		-50,
		-50,
		-30,
		-30,
		-50,
		-50,
		-50,
		-35
	],
	OhungarumlautX: [
		-50,
		-50,
		-60,
		-60,
		-40,
		-40,
		-40,
		-40
	],
	OhungarumlautY: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	OhungarumlautYacute: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	OhungarumlautYdieresis: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	Ohungarumlautcomma: [
		-40,
		-40,
		-40,
		-40
	],
	Ohungarumlautperiod: [
		-40,
		-40,
		-40,
		-40
	],
	OmacronA: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OmacronAacute: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OmacronAbreve: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OmacronAcircumflex: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OmacronAdieresis: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OmacronAgrave: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OmacronAmacron: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OmacronAogonek: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OmacronAring: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OmacronAtilde: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OmacronT: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OmacronTcaron: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OmacronTcommaaccent: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OmacronV: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50
	],
	OmacronW: [
		-50,
		-50,
		-30,
		-30,
		-50,
		-50,
		-50,
		-35
	],
	OmacronX: [
		-50,
		-50,
		-60,
		-60,
		-40,
		-40,
		-40,
		-40
	],
	OmacronY: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	OmacronYacute: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	OmacronYdieresis: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	Omacroncomma: [
		-40,
		-40,
		-40,
		-40
	],
	Omacronperiod: [
		-40,
		-40,
		-40,
		-40
	],
	OslashA: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OslashAacute: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OslashAbreve: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OslashAcircumflex: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OslashAdieresis: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OslashAgrave: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OslashAmacron: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OslashAogonek: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OslashAring: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OslashAtilde: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OslashT: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OslashTcaron: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OslashTcommaaccent: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OslashV: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50
	],
	OslashW: [
		-50,
		-50,
		-30,
		-30,
		-50,
		-50,
		-50,
		-35
	],
	OslashX: [
		-50,
		-50,
		-60,
		-60,
		-40,
		-40,
		-40,
		-40
	],
	OslashY: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	OslashYacute: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	OslashYdieresis: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	Oslashcomma: [
		-40,
		-40,
		-40,
		-40
	],
	Oslashperiod: [
		-40,
		-40,
		-40,
		-40
	],
	OtildeA: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OtildeAacute: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OtildeAbreve: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OtildeAcircumflex: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OtildeAdieresis: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OtildeAgrave: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OtildeAmacron: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OtildeAogonek: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OtildeAring: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OtildeAtilde: [
		-50,
		-50,
		-20,
		-20,
		-40,
		-40,
		-55,
		-35
	],
	OtildeT: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OtildeTcaron: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OtildeTcommaaccent: [
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	OtildeV: [
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50,
		-50
	],
	OtildeW: [
		-50,
		-50,
		-30,
		-30,
		-50,
		-50,
		-50,
		-35
	],
	OtildeX: [
		-50,
		-50,
		-60,
		-60,
		-40,
		-40,
		-40,
		-40
	],
	OtildeY: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	OtildeYacute: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	OtildeYdieresis: [
		-70,
		-70,
		-70,
		-70,
		-50,
		-50,
		-50,
		-50
	],
	Otildecomma: [
		-40,
		-40,
		-40,
		-40
	],
	Otildeperiod: [
		-40,
		-40,
		-40,
		-40
	],
	PA: [
		-100,
		-100,
		-120,
		-120,
		-74,
		-85,
		-90,
		-92
	],
	PAacute: [
		-100,
		-100,
		-120,
		-120,
		-74,
		-85,
		-90,
		-92
	],
	PAbreve: [
		-100,
		-100,
		-120,
		-120,
		-74,
		-85,
		-90,
		-92
	],
	PAcircumflex: [
		-100,
		-100,
		-120,
		-120,
		-74,
		-85,
		-90,
		-92
	],
	PAdieresis: [
		-100,
		-100,
		-120,
		-120,
		-74,
		-85,
		-90,
		-92
	],
	PAgrave: [
		-100,
		-100,
		-120,
		-120,
		-74,
		-85,
		-90,
		-92
	],
	PAmacron: [
		-100,
		-100,
		-120,
		-120,
		-74,
		-85,
		-90,
		-92
	],
	PAogonek: [
		-100,
		-100,
		-120,
		-120,
		-74,
		-85,
		-90,
		-92
	],
	PAring: [
		-100,
		-100,
		-120,
		-120,
		-74,
		-85,
		-90,
		-92
	],
	PAtilde: [
		-100,
		-100,
		-120,
		-120,
		-74,
		-85,
		-90,
		-92
	],
	Pa: [
		-30,
		-30,
		-40,
		-40,
		-10,
		-40,
		-80,
		-15
	],
	Paacute: [
		-30,
		-30,
		-40,
		-40,
		-10,
		-40,
		-80,
		-15
	],
	Pabreve: [
		-30,
		-30,
		-40,
		-40,
		-10,
		-40,
		-80,
		-15
	],
	Pacircumflex: [
		-30,
		-30,
		-40,
		-40,
		-10,
		-40,
		-80,
		-15
	],
	Padieresis: [
		-30,
		-30,
		-40,
		-40,
		-10,
		-40,
		-80,
		-15
	],
	Pagrave: [
		-30,
		-30,
		-40,
		-40,
		-10,
		-40,
		-80,
		-15
	],
	Pamacron: [
		-30,
		-30,
		-40,
		-40,
		-10,
		-40,
		-80,
		-15
	],
	Paogonek: [
		-30,
		-30,
		-40,
		-40,
		-10,
		-40,
		-80,
		-15
	],
	Paring: [
		-30,
		-30,
		-40,
		-40,
		-10,
		-40,
		-80,
		-15
	],
	Patilde: [
		-30,
		-30,
		-40,
		-40,
		-10,
		-40,
		-80,
		-15
	],
	Pcomma: [
		-120,
		-120,
		-180,
		-180,
		-92,
		-129,
		-135,
		-111
	],
	Pe: [
		-30,
		-30,
		-50,
		-50,
		-20,
		-50,
		-80
	],
	Peacute: [
		-30,
		-30,
		-50,
		-50,
		-20,
		-50,
		-80
	],
	Pecaron: [
		-30,
		-30,
		-50,
		-50,
		-20,
		-50,
		-80
	],
	Pecircumflex: [
		-30,
		-30,
		-50,
		-50,
		-20,
		-50,
		-80
	],
	Pedieresis: [
		-30,
		-30,
		-50,
		-50,
		-20,
		-50,
		-80
	],
	Pedotaccent: [
		-30,
		-30,
		-50,
		-50,
		-20,
		-50,
		-80
	],
	Pegrave: [
		-30,
		-30,
		-50,
		-50,
		-20,
		-50,
		-80
	],
	Pemacron: [
		-30,
		-30,
		-50,
		-50,
		-20,
		-50,
		-80
	],
	Peogonek: [
		-30,
		-30,
		-50,
		-50,
		-20,
		-50,
		-80
	],
	Po: [
		-40,
		-40,
		-50,
		-50,
		-20,
		-55,
		-80
	],
	Poacute: [
		-40,
		-40,
		-50,
		-50,
		-20,
		-55,
		-80
	],
	Pocircumflex: [
		-40,
		-40,
		-50,
		-50,
		-20,
		-55,
		-80
	],
	Podieresis: [
		-40,
		-40,
		-50,
		-50,
		-20,
		-55,
		-80
	],
	Pograve: [
		-40,
		-40,
		-50,
		-50,
		-20,
		-55,
		-80
	],
	Pohungarumlaut: [
		-40,
		-40,
		-50,
		-50,
		-20,
		-55,
		-80
	],
	Pomacron: [
		-40,
		-40,
		-50,
		-50,
		-20,
		-55,
		-80
	],
	Poslash: [
		-40,
		-40,
		-50,
		-50,
		-20,
		-55,
		-80
	],
	Potilde: [
		-40,
		-40,
		-50,
		-50,
		-20,
		-55,
		-80
	],
	Pperiod: [
		-120,
		-120,
		-180,
		-180,
		-110,
		-129,
		-135,
		-111
	],
	QU: [
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10
	],
	QUacute: [
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10
	],
	QUcircumflex: [
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10
	],
	QUdieresis: [
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10
	],
	QUgrave: [
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10
	],
	QUhungarumlaut: [
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10
	],
	QUmacron: [
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10
	],
	QUogonek: [
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10
	],
	QUring: [
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10,
		-10
	],
	Qcomma: [
		20,
		20
	],
	Qperiod: [
		20,
		20,
		0,
		0,
		-20
	],
	RO: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	ROacute: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	ROcircumflex: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	ROdieresis: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	ROgrave: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	ROhungarumlaut: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	ROmacron: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	ROslash: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	ROtilde: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RT: [
		-20,
		-20,
		-30,
		-30,
		-40,
		-30,
		0,
		-60
	],
	RTcaron: [
		-20,
		-20,
		-30,
		-30,
		-40,
		-30,
		0,
		-60
	],
	RTcommaaccent: [
		-20,
		-20,
		-30,
		-30,
		-40,
		-30,
		0,
		-60
	],
	RU: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RUacute: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RUcircumflex: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RUdieresis: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RUgrave: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RUhungarumlaut: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RUmacron: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RUogonek: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RUring: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RV: [
		-50,
		-50,
		-50,
		-50,
		-55,
		-18,
		-18,
		-80
	],
	RW: [
		-40,
		-40,
		-30,
		-30,
		-35,
		-18,
		-18,
		-55
	],
	RY: [
		-50,
		-50,
		-50,
		-50,
		-35,
		-18,
		-18,
		-65
	],
	RYacute: [
		-50,
		-50,
		-50,
		-50,
		-35,
		-18,
		-18,
		-65
	],
	RYdieresis: [
		-50,
		-50,
		-50,
		-50,
		-35,
		-18,
		-18,
		-65
	],
	RacuteO: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RacuteOacute: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RacuteOcircumflex: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RacuteOdieresis: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RacuteOgrave: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RacuteOhungarumlaut: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RacuteOmacron: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RacuteOslash: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RacuteOtilde: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RacuteT: [
		-20,
		-20,
		-30,
		-30,
		-40,
		-30,
		0,
		-60
	],
	RacuteTcaron: [
		-20,
		-20,
		-30,
		-30,
		-40,
		-30,
		0,
		-60
	],
	RacuteTcommaaccent: [
		-20,
		-20,
		-30,
		-30,
		-40,
		-30,
		0,
		-60
	],
	RacuteU: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RacuteUacute: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RacuteUcircumflex: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RacuteUdieresis: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RacuteUgrave: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RacuteUhungarumlaut: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RacuteUmacron: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RacuteUogonek: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RacuteUring: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RacuteV: [
		-50,
		-50,
		-50,
		-50,
		-55,
		-18,
		-18,
		-80
	],
	RacuteW: [
		-40,
		-40,
		-30,
		-30,
		-35,
		-18,
		-18,
		-55
	],
	RacuteY: [
		-50,
		-50,
		-50,
		-50,
		-35,
		-18,
		-18,
		-65
	],
	RacuteYacute: [
		-50,
		-50,
		-50,
		-50,
		-35,
		-18,
		-18,
		-65
	],
	RacuteYdieresis: [
		-50,
		-50,
		-50,
		-50,
		-35,
		-18,
		-18,
		-65
	],
	RcaronO: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RcaronOacute: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RcaronOcircumflex: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RcaronOdieresis: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RcaronOgrave: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RcaronOhungarumlaut: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RcaronOmacron: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RcaronOslash: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RcaronOtilde: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RcaronT: [
		-20,
		-20,
		-30,
		-30,
		-40,
		-30,
		0,
		-60
	],
	RcaronTcaron: [
		-20,
		-20,
		-30,
		-30,
		-40,
		-30,
		0,
		-60
	],
	RcaronTcommaaccent: [
		-20,
		-20,
		-30,
		-30,
		-40,
		-30,
		0,
		-60
	],
	RcaronU: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RcaronUacute: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RcaronUcircumflex: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RcaronUdieresis: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RcaronUgrave: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RcaronUhungarumlaut: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RcaronUmacron: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RcaronUogonek: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RcaronUring: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RcaronV: [
		-50,
		-50,
		-50,
		-50,
		-55,
		-18,
		-18,
		-80
	],
	RcaronW: [
		-40,
		-40,
		-30,
		-30,
		-35,
		-18,
		-18,
		-55
	],
	RcaronY: [
		-50,
		-50,
		-50,
		-50,
		-35,
		-18,
		-18,
		-65
	],
	RcaronYacute: [
		-50,
		-50,
		-50,
		-50,
		-35,
		-18,
		-18,
		-65
	],
	RcaronYdieresis: [
		-50,
		-50,
		-50,
		-50,
		-35,
		-18,
		-18,
		-65
	],
	RcommaaccentO: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RcommaaccentOacute: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RcommaaccentOcircumflex: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RcommaaccentOdieresis: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RcommaaccentOgrave: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RcommaaccentOhungarumlaut: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RcommaaccentOmacron: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RcommaaccentOslash: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RcommaaccentOtilde: [
		-20,
		-20,
		-20,
		-20,
		-30,
		-40,
		-40,
		-40
	],
	RcommaaccentT: [
		-20,
		-20,
		-30,
		-30,
		-40,
		-30,
		0,
		-60
	],
	RcommaaccentTcaron: [
		-20,
		-20,
		-30,
		-30,
		-40,
		-30,
		0,
		-60
	],
	RcommaaccentTcommaaccent: [
		-20,
		-20,
		-30,
		-30,
		-40,
		-30,
		0,
		-60
	],
	RcommaaccentU: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RcommaaccentUacute: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RcommaaccentUcircumflex: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RcommaaccentUdieresis: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RcommaaccentUgrave: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RcommaaccentUhungarumlaut: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RcommaaccentUmacron: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RcommaaccentUogonek: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RcommaaccentUring: [
		-20,
		-20,
		-40,
		-40,
		-30,
		-40,
		-40,
		-40
	],
	RcommaaccentV: [
		-50,
		-50,
		-50,
		-50,
		-55,
		-18,
		-18,
		-80
	],
	RcommaaccentW: [
		-40,
		-40,
		-30,
		-30,
		-35,
		-18,
		-18,
		-55
	],
	RcommaaccentY: [
		-50,
		-50,
		-50,
		-50,
		-35,
		-18,
		-18,
		-65
	],
	RcommaaccentYacute: [
		-50,
		-50,
		-50,
		-50,
		-35,
		-18,
		-18,
		-65
	],
	RcommaaccentYdieresis: [
		-50,
		-50,
		-50,
		-50,
		-35,
		-18,
		-18,
		-65
	],
	TA: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TAacute: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TAbreve: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TAcircumflex: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TAdieresis: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TAgrave: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TAmacron: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TAogonek: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TAring: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TAtilde: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TO: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TOacute: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TOcircumflex: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TOdieresis: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TOgrave: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TOhungarumlaut: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TOmacron: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TOslash: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TOtilde: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	Ta: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-92,
		-92,
		-80
	],
	Taacute: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-92,
		-92,
		-80
	],
	Tabreve: [
		-80,
		-80,
		-60,
		-60,
		-52,
		-92,
		-92,
		-80
	],
	Tacircumflex: [
		-80,
		-80,
		-120,
		-120,
		-52,
		-92,
		-92,
		-80
	],
	Tadieresis: [
		-80,
		-80,
		-120,
		-120,
		-52,
		-92,
		-92,
		-40
	],
	Tagrave: [
		-80,
		-80,
		-120,
		-120,
		-52,
		-92,
		-92,
		-40
	],
	Tamacron: [
		-80,
		-80,
		-60,
		-60,
		-52,
		-92,
		-92,
		-40
	],
	Taogonek: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-92,
		-92,
		-80
	],
	Taring: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-92,
		-92,
		-80
	],
	Tatilde: [
		-80,
		-80,
		-60,
		-60,
		-52,
		-92,
		-92,
		-40
	],
	Tcolon: [
		-40,
		-40,
		-20,
		-20,
		-74,
		-74,
		-55,
		-50
	],
	Tcomma: [
		-80,
		-80,
		-120,
		-120,
		-74,
		-92,
		-74,
		-74
	],
	Te: [
		-60,
		-60,
		-120,
		-120,
		-92,
		-92,
		-92,
		-70
	],
	Teacute: [
		-60,
		-60,
		-120,
		-120,
		-92,
		-92,
		-92,
		-70
	],
	Tecaron: [
		-60,
		-60,
		-120,
		-120,
		-92,
		-92,
		-92,
		-70
	],
	Tecircumflex: [
		-60,
		-60,
		-120,
		-120,
		-92,
		-92,
		-52,
		-70
	],
	Tedieresis: [
		-60,
		-60,
		-120,
		-120,
		-52,
		-52,
		-52,
		-30
	],
	Tedotaccent: [
		-60,
		-60,
		-120,
		-120,
		-92,
		-92,
		-92,
		-70
	],
	Tegrave: [
		-60,
		-60,
		-60,
		-60,
		-52,
		-52,
		-52,
		-70
	],
	Temacron: [
		-60,
		-60,
		-60,
		-60,
		-52,
		-52,
		-52,
		-30
	],
	Teogonek: [
		-60,
		-60,
		-120,
		-120,
		-92,
		-92,
		-92,
		-70
	],
	Thyphen: [
		-120,
		-120,
		-140,
		-140,
		-92,
		-92,
		-74,
		-92
	],
	To: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Toacute: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Tocircumflex: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Todieresis: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Tograve: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Tohungarumlaut: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Tomacron: [
		-80,
		-80,
		-60,
		-60,
		-92,
		-95,
		-92,
		-80
	],
	Toslash: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Totilde: [
		-80,
		-80,
		-60,
		-60,
		-92,
		-95,
		-92,
		-80
	],
	Tperiod: [
		-80,
		-80,
		-120,
		-120,
		-90,
		-92,
		-74,
		-74
	],
	Tr: [
		-80,
		-80,
		-120,
		-120,
		-74,
		-37,
		-55,
		-35
	],
	Tracute: [
		-80,
		-80,
		-120,
		-120,
		-74,
		-37,
		-55,
		-35
	],
	Trcommaaccent: [
		-80,
		-80,
		-120,
		-120,
		-74,
		-37,
		-55,
		-35
	],
	Tsemicolon: [
		-40,
		-40,
		-20,
		-20,
		-74,
		-74,
		-65,
		-55
	],
	Tu: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tuacute: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tucircumflex: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tudieresis: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tugrave: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tuhungarumlaut: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tumacron: [
		-90,
		-90,
		-60,
		-60,
		-92,
		-37,
		-55,
		-45
	],
	Tuogonek: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Turing: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tw: [
		-60,
		-60,
		-120,
		-120,
		-74,
		-37,
		-74,
		-80
	],
	Ty: [
		-60,
		-60,
		-120,
		-120,
		-34,
		-37,
		-74,
		-80
	],
	Tyacute: [
		-60,
		-60,
		-120,
		-120,
		-34,
		-37,
		-74,
		-80
	],
	Tydieresis: [
		-60,
		-60,
		-60,
		-60,
		-34,
		-37,
		-34,
		-80
	],
	TcaronA: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TcaronAacute: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TcaronAbreve: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TcaronAcircumflex: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TcaronAdieresis: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TcaronAgrave: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TcaronAmacron: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TcaronAogonek: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TcaronAring: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TcaronAtilde: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TcaronO: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TcaronOacute: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TcaronOcircumflex: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TcaronOdieresis: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TcaronOgrave: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TcaronOhungarumlaut: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TcaronOmacron: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TcaronOslash: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TcaronOtilde: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	Tcarona: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-92,
		-92,
		-80
	],
	Tcaronaacute: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-92,
		-92,
		-80
	],
	Tcaronabreve: [
		-80,
		-80,
		-60,
		-60,
		-52,
		-92,
		-92,
		-80
	],
	Tcaronacircumflex: [
		-80,
		-80,
		-120,
		-120,
		-52,
		-92,
		-92,
		-80
	],
	Tcaronadieresis: [
		-80,
		-80,
		-120,
		-120,
		-52,
		-92,
		-92,
		-40
	],
	Tcaronagrave: [
		-80,
		-80,
		-120,
		-120,
		-52,
		-92,
		-92,
		-40
	],
	Tcaronamacron: [
		-80,
		-80,
		-60,
		-60,
		-52,
		-92,
		-92,
		-40
	],
	Tcaronaogonek: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-92,
		-92,
		-80
	],
	Tcaronaring: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-92,
		-92,
		-80
	],
	Tcaronatilde: [
		-80,
		-80,
		-60,
		-60,
		-52,
		-92,
		-92,
		-40
	],
	Tcaroncolon: [
		-40,
		-40,
		-20,
		-20,
		-74,
		-74,
		-55,
		-50
	],
	Tcaroncomma: [
		-80,
		-80,
		-120,
		-120,
		-74,
		-92,
		-74,
		-74
	],
	Tcarone: [
		-60,
		-60,
		-120,
		-120,
		-92,
		-92,
		-92,
		-70
	],
	Tcaroneacute: [
		-60,
		-60,
		-120,
		-120,
		-92,
		-92,
		-92,
		-70
	],
	Tcaronecaron: [
		-60,
		-60,
		-120,
		-120,
		-92,
		-92,
		-92,
		-70
	],
	Tcaronecircumflex: [
		-60,
		-60,
		-120,
		-120,
		-92,
		-92,
		-52,
		-30
	],
	Tcaronedieresis: [
		-60,
		-60,
		-120,
		-120,
		-52,
		-52,
		-52,
		-30
	],
	Tcaronedotaccent: [
		-60,
		-60,
		-120,
		-120,
		-92,
		-92,
		-92,
		-70
	],
	Tcaronegrave: [
		-60,
		-60,
		-60,
		-60,
		-52,
		-52,
		-52,
		-70
	],
	Tcaronemacron: [
		-60,
		-60,
		-60,
		-60,
		-52,
		-52,
		-52,
		-30
	],
	Tcaroneogonek: [
		-60,
		-60,
		-120,
		-120,
		-92,
		-92,
		-92,
		-70
	],
	Tcaronhyphen: [
		-120,
		-120,
		-140,
		-140,
		-92,
		-92,
		-74,
		-92
	],
	Tcarono: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Tcaronoacute: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Tcaronocircumflex: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Tcaronodieresis: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Tcaronograve: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Tcaronohungarumlaut: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Tcaronomacron: [
		-80,
		-80,
		-60,
		-60,
		-92,
		-95,
		-92,
		-80
	],
	Tcaronoslash: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Tcaronotilde: [
		-80,
		-80,
		-60,
		-60,
		-92,
		-95,
		-92,
		-80
	],
	Tcaronperiod: [
		-80,
		-80,
		-120,
		-120,
		-90,
		-92,
		-74,
		-74
	],
	Tcaronr: [
		-80,
		-80,
		-120,
		-120,
		-74,
		-37,
		-55,
		-35
	],
	Tcaronracute: [
		-80,
		-80,
		-120,
		-120,
		-74,
		-37,
		-55,
		-35
	],
	Tcaronrcommaaccent: [
		-80,
		-80,
		-120,
		-120,
		-74,
		-37,
		-55,
		-35
	],
	Tcaronsemicolon: [
		-40,
		-40,
		-20,
		-20,
		-74,
		-74,
		-65,
		-55
	],
	Tcaronu: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tcaronuacute: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tcaronucircumflex: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tcaronudieresis: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tcaronugrave: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tcaronuhungarumlaut: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tcaronumacron: [
		-90,
		-90,
		-60,
		-60,
		-92,
		-37,
		-55,
		-45
	],
	Tcaronuogonek: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tcaronuring: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tcaronw: [
		-60,
		-60,
		-120,
		-120,
		-74,
		-37,
		-74,
		-80
	],
	Tcarony: [
		-60,
		-60,
		-120,
		-120,
		-34,
		-37,
		-74,
		-80
	],
	Tcaronyacute: [
		-60,
		-60,
		-120,
		-120,
		-34,
		-37,
		-74,
		-80
	],
	Tcaronydieresis: [
		-60,
		-60,
		-60,
		-60,
		-34,
		-37,
		-34,
		-80
	],
	TcommaaccentA: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TcommaaccentAacute: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TcommaaccentAbreve: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TcommaaccentAcircumflex: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TcommaaccentAdieresis: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TcommaaccentAgrave: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TcommaaccentAmacron: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TcommaaccentAogonek: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TcommaaccentAring: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TcommaaccentAtilde: [
		-90,
		-90,
		-120,
		-120,
		-90,
		-55,
		-50,
		-93
	],
	TcommaaccentO: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TcommaaccentOacute: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TcommaaccentOcircumflex: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TcommaaccentOdieresis: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TcommaaccentOgrave: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TcommaaccentOhungarumlaut: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TcommaaccentOmacron: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TcommaaccentOslash: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	TcommaaccentOtilde: [
		-40,
		-40,
		-40,
		-40,
		-18,
		-18,
		-18,
		-18
	],
	Tcommaaccenta: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-92,
		-92,
		-80
	],
	Tcommaaccentaacute: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-92,
		-92,
		-80
	],
	Tcommaaccentabreve: [
		-80,
		-80,
		-60,
		-60,
		-52,
		-92,
		-92,
		-80
	],
	Tcommaaccentacircumflex: [
		-80,
		-80,
		-120,
		-120,
		-52,
		-92,
		-92,
		-80
	],
	Tcommaaccentadieresis: [
		-80,
		-80,
		-120,
		-120,
		-52,
		-92,
		-92,
		-40
	],
	Tcommaaccentagrave: [
		-80,
		-80,
		-120,
		-120,
		-52,
		-92,
		-92,
		-40
	],
	Tcommaaccentamacron: [
		-80,
		-80,
		-60,
		-60,
		-52,
		-92,
		-92,
		-40
	],
	Tcommaaccentaogonek: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-92,
		-92,
		-80
	],
	Tcommaaccentaring: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-92,
		-92,
		-80
	],
	Tcommaaccentatilde: [
		-80,
		-80,
		-60,
		-60,
		-52,
		-92,
		-92,
		-40
	],
	Tcommaaccentcolon: [
		-40,
		-40,
		-20,
		-20,
		-74,
		-74,
		-55,
		-50
	],
	Tcommaaccentcomma: [
		-80,
		-80,
		-120,
		-120,
		-74,
		-92,
		-74,
		-74
	],
	Tcommaaccente: [
		-60,
		-60,
		-120,
		-120,
		-92,
		-92,
		-92,
		-70
	],
	Tcommaaccenteacute: [
		-60,
		-60,
		-120,
		-120,
		-92,
		-92,
		-92,
		-70
	],
	Tcommaaccentecaron: [
		-60,
		-60,
		-120,
		-120,
		-92,
		-92,
		-92,
		-70
	],
	Tcommaaccentecircumflex: [
		-60,
		-60,
		-120,
		-120,
		-92,
		-92,
		-52,
		-30
	],
	Tcommaaccentedieresis: [
		-60,
		-60,
		-120,
		-120,
		-52,
		-52,
		-52,
		-30
	],
	Tcommaaccentedotaccent: [
		-60,
		-60,
		-120,
		-120,
		-92,
		-92,
		-92,
		-70
	],
	Tcommaaccentegrave: [
		-60,
		-60,
		-60,
		-60,
		-52,
		-52,
		-52,
		-30
	],
	Tcommaaccentemacron: [
		-60,
		-60,
		-60,
		-60,
		-52,
		-52,
		-52,
		-70
	],
	Tcommaaccenteogonek: [
		-60,
		-60,
		-120,
		-120,
		-92,
		-92,
		-92,
		-70
	],
	Tcommaaccenthyphen: [
		-120,
		-120,
		-140,
		-140,
		-92,
		-92,
		-74,
		-92
	],
	Tcommaaccento: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Tcommaaccentoacute: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Tcommaaccentocircumflex: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Tcommaaccentodieresis: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Tcommaaccentograve: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Tcommaaccentohungarumlaut: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Tcommaaccentomacron: [
		-80,
		-80,
		-60,
		-60,
		-92,
		-95,
		-92,
		-80
	],
	Tcommaaccentoslash: [
		-80,
		-80,
		-120,
		-120,
		-92,
		-95,
		-92,
		-80
	],
	Tcommaaccentotilde: [
		-80,
		-80,
		-60,
		-60,
		-92,
		-95,
		-92,
		-80
	],
	Tcommaaccentperiod: [
		-80,
		-80,
		-120,
		-120,
		-90,
		-92,
		-74,
		-74
	],
	Tcommaaccentr: [
		-80,
		-80,
		-120,
		-120,
		-74,
		-37,
		-55,
		-35
	],
	Tcommaaccentracute: [
		-80,
		-80,
		-120,
		-120,
		-74,
		-37,
		-55,
		-35
	],
	Tcommaaccentrcommaaccent: [
		-80,
		-80,
		-120,
		-120,
		-74,
		-37,
		-55,
		-35
	],
	Tcommaaccentsemicolon: [
		-40,
		-40,
		-20,
		-20,
		-74,
		-74,
		-65,
		-55
	],
	Tcommaaccentu: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tcommaaccentuacute: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tcommaaccentucircumflex: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tcommaaccentudieresis: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tcommaaccentugrave: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tcommaaccentuhungarumlaut: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tcommaaccentumacron: [
		-90,
		-90,
		-60,
		-60,
		-92,
		-37,
		-55,
		-45
	],
	Tcommaaccentuogonek: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tcommaaccenturing: [
		-90,
		-90,
		-120,
		-120,
		-92,
		-37,
		-55,
		-45
	],
	Tcommaaccentw: [
		-60,
		-60,
		-120,
		-120,
		-74,
		-37,
		-74,
		-80
	],
	Tcommaaccenty: [
		-60,
		-60,
		-120,
		-120,
		-34,
		-37,
		-74,
		-80
	],
	Tcommaaccentyacute: [
		-60,
		-60,
		-120,
		-120,
		-34,
		-37,
		-74,
		-80
	],
	Tcommaaccentydieresis: [
		-60,
		-60,
		-60,
		-60,
		-34,
		-37,
		-34,
		-80
	],
	UA: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UAacute: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UAbreve: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UAcircumflex: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UAdieresis: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UAgrave: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UAmacron: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UAogonek: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UAring: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UAtilde: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	Ucomma: [
		-30,
		-30,
		-40,
		-40,
		-50,
		0,
		-25
	],
	Uperiod: [
		-30,
		-30,
		-40,
		-40,
		-50,
		0,
		-25
	],
	UacuteA: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UacuteAacute: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UacuteAbreve: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UacuteAcircumflex: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UacuteAdieresis: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UacuteAgrave: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UacuteAmacron: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UacuteAogonek: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UacuteAring: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UacuteAtilde: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	Uacutecomma: [
		-30,
		-30,
		-40,
		-40,
		-50,
		0,
		-25
	],
	Uacuteperiod: [
		-30,
		-30,
		-40,
		-40,
		-50,
		0,
		-25
	],
	UcircumflexA: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UcircumflexAacute: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UcircumflexAbreve: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UcircumflexAcircumflex: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UcircumflexAdieresis: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UcircumflexAgrave: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UcircumflexAmacron: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UcircumflexAogonek: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UcircumflexAring: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UcircumflexAtilde: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	Ucircumflexcomma: [
		-30,
		-30,
		-40,
		-40,
		-50,
		0,
		-25
	],
	Ucircumflexperiod: [
		-30,
		-30,
		-40,
		-40,
		-50,
		0,
		-25
	],
	UdieresisA: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UdieresisAacute: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UdieresisAbreve: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UdieresisAcircumflex: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UdieresisAdieresis: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UdieresisAgrave: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UdieresisAmacron: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UdieresisAogonek: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UdieresisAring: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UdieresisAtilde: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	Udieresiscomma: [
		-30,
		-30,
		-40,
		-40,
		-50,
		0,
		-25
	],
	Udieresisperiod: [
		-30,
		-30,
		-40,
		-40,
		-50,
		0,
		-25
	],
	UgraveA: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UgraveAacute: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UgraveAbreve: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UgraveAcircumflex: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UgraveAdieresis: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UgraveAgrave: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UgraveAmacron: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UgraveAogonek: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UgraveAring: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UgraveAtilde: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	Ugravecomma: [
		-30,
		-30,
		-40,
		-40,
		-50,
		0,
		-25
	],
	Ugraveperiod: [
		-30,
		-30,
		-40,
		-40,
		-50,
		0,
		-25
	],
	UhungarumlautA: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UhungarumlautAacute: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UhungarumlautAbreve: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UhungarumlautAcircumflex: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UhungarumlautAdieresis: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UhungarumlautAgrave: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UhungarumlautAmacron: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UhungarumlautAogonek: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UhungarumlautAring: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UhungarumlautAtilde: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	Uhungarumlautcomma: [
		-30,
		-30,
		-40,
		-40,
		-50,
		0,
		-25
	],
	Uhungarumlautperiod: [
		-30,
		-30,
		-40,
		-40,
		-50,
		0,
		-25
	],
	UmacronA: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UmacronAacute: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UmacronAbreve: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UmacronAcircumflex: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UmacronAdieresis: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UmacronAgrave: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UmacronAmacron: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UmacronAogonek: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UmacronAring: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UmacronAtilde: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	Umacroncomma: [
		-30,
		-30,
		-40,
		-40,
		-50,
		0,
		-25
	],
	Umacronperiod: [
		-30,
		-30,
		-40,
		-40,
		-50,
		0,
		-25
	],
	UogonekA: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UogonekAacute: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UogonekAbreve: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UogonekAcircumflex: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UogonekAdieresis: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UogonekAgrave: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UogonekAmacron: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UogonekAogonek: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UogonekAring: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UogonekAtilde: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	Uogonekcomma: [
		-30,
		-30,
		-40,
		-40,
		-50,
		0,
		-25
	],
	Uogonekperiod: [
		-30,
		-30,
		-40,
		-40,
		-50,
		0,
		-25
	],
	UringA: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UringAacute: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UringAbreve: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UringAcircumflex: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UringAdieresis: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UringAgrave: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UringAmacron: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UringAogonek: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UringAring: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	UringAtilde: [
		-50,
		-50,
		-40,
		-40,
		-60,
		-45,
		-40,
		-40
	],
	Uringcomma: [
		-30,
		-30,
		-40,
		-40,
		-50,
		0,
		-25
	],
	Uringperiod: [
		-30,
		-30,
		-40,
		-40,
		-50,
		0,
		-25
	],
	VA: [
		-80,
		-80,
		-80,
		-80,
		-135,
		-85,
		-60,
		-135
	],
	VAacute: [
		-80,
		-80,
		-80,
		-80,
		-135,
		-85,
		-60,
		-135
	],
	VAbreve: [
		-80,
		-80,
		-80,
		-80,
		-135,
		-85,
		-60,
		-135
	],
	VAcircumflex: [
		-80,
		-80,
		-80,
		-80,
		-135,
		-85,
		-60,
		-135
	],
	VAdieresis: [
		-80,
		-80,
		-80,
		-80,
		-135,
		-85,
		-60,
		-135
	],
	VAgrave: [
		-80,
		-80,
		-80,
		-80,
		-135,
		-85,
		-60,
		-135
	],
	VAmacron: [
		-80,
		-80,
		-80,
		-80,
		-135,
		-85,
		-60,
		-135
	],
	VAogonek: [
		-80,
		-80,
		-80,
		-80,
		-135,
		-85,
		-60,
		-135
	],
	VAring: [
		-80,
		-80,
		-80,
		-80,
		-135,
		-85,
		-60,
		-135
	],
	VAtilde: [
		-80,
		-80,
		-80,
		-80,
		-135,
		-85,
		-60,
		-135
	],
	VG: [
		-50,
		-50,
		-40,
		-40,
		-30,
		-10,
		0,
		-15
	],
	VGbreve: [
		-50,
		-50,
		-40,
		-40,
		-30,
		-10,
		0,
		-15
	],
	VGcommaaccent: [
		-50,
		-50,
		-40,
		-40,
		-30,
		-10,
		0,
		-15
	],
	VO: [
		-50,
		-50,
		-40,
		-40,
		-45,
		-30,
		-30,
		-40
	],
	VOacute: [
		-50,
		-50,
		-40,
		-40,
		-45,
		-30,
		-30,
		-40
	],
	VOcircumflex: [
		-50,
		-50,
		-40,
		-40,
		-45,
		-30,
		-30,
		-40
	],
	VOdieresis: [
		-50,
		-50,
		-40,
		-40,
		-45,
		-30,
		-30,
		-40
	],
	VOgrave: [
		-50,
		-50,
		-40,
		-40,
		-45,
		-30,
		-30,
		-40
	],
	VOhungarumlaut: [
		-50,
		-50,
		-40,
		-40,
		-45,
		-30,
		-30,
		-40
	],
	VOmacron: [
		-50,
		-50,
		-40,
		-40,
		-45,
		-30,
		-30,
		-40
	],
	VOslash: [
		-50,
		-50,
		-40,
		-40,
		-45,
		-30,
		-30,
		-40
	],
	VOtilde: [
		-50,
		-50,
		-40,
		-40,
		-45,
		-30,
		-30,
		-40
	],
	Va: [
		-60,
		-60,
		-70,
		-70,
		-92,
		-111,
		-111,
		-111
	],
	Vaacute: [
		-60,
		-60,
		-70,
		-70,
		-92,
		-111,
		-111,
		-111
	],
	Vabreve: [
		-60,
		-60,
		-70,
		-70,
		-92,
		-111,
		-111,
		-111
	],
	Vacircumflex: [
		-60,
		-60,
		-70,
		-70,
		-92,
		-111,
		-111,
		-71
	],
	Vadieresis: [
		-60,
		-60,
		-70,
		-70,
		-92,
		-111,
		-111,
		-71
	],
	Vagrave: [
		-60,
		-60,
		-70,
		-70,
		-92,
		-111,
		-111,
		-71
	],
	Vamacron: [
		-60,
		-60,
		-70,
		-70,
		-92,
		-111,
		-111,
		-71
	],
	Vaogonek: [
		-60,
		-60,
		-70,
		-70,
		-92,
		-111,
		-111,
		-111
	],
	Varing: [
		-60,
		-60,
		-70,
		-70,
		-92,
		-111,
		-111,
		-111
	],
	Vatilde: [
		-60,
		-60,
		-70,
		-70,
		-92,
		-111,
		-111,
		-71
	],
	Vcolon: [
		-40,
		-40,
		-40,
		-40,
		-92,
		-74,
		-65,
		-74
	],
	Vcomma: [
		-120,
		-120,
		-125,
		-125,
		-129,
		-129,
		-129,
		-129
	],
	Ve: [
		-50,
		-50,
		-80,
		-80,
		-100,
		-111,
		-111,
		-111
	],
	Veacute: [
		-50,
		-50,
		-80,
		-80,
		-100,
		-111,
		-111,
		-111
	],
	Vecaron: [
		-50,
		-50,
		-80,
		-80,
		-100,
		-111,
		-111,
		-71
	],
	Vecircumflex: [
		-50,
		-50,
		-80,
		-80,
		-100,
		-111,
		-111,
		-71
	],
	Vedieresis: [
		-50,
		-50,
		-80,
		-80,
		-100,
		-71,
		-71,
		-71
	],
	Vedotaccent: [
		-50,
		-50,
		-80,
		-80,
		-100,
		-111,
		-111,
		-111
	],
	Vegrave: [
		-50,
		-50,
		-80,
		-80,
		-100,
		-71,
		-71,
		-71
	],
	Vemacron: [
		-50,
		-50,
		-80,
		-80,
		-100,
		-71,
		-71,
		-71
	],
	Veogonek: [
		-50,
		-50,
		-80,
		-80,
		-100,
		-111,
		-111,
		-111
	],
	Vhyphen: [
		-80,
		-80,
		-80,
		-80,
		-74,
		-70,
		-55,
		-100
	],
	Vo: [
		-90,
		-90,
		-80,
		-80,
		-100,
		-111,
		-111,
		-129
	],
	Voacute: [
		-90,
		-90,
		-80,
		-80,
		-100,
		-111,
		-111,
		-129
	],
	Vocircumflex: [
		-90,
		-90,
		-80,
		-80,
		-100,
		-111,
		-111,
		-129
	],
	Vodieresis: [
		-90,
		-90,
		-80,
		-80,
		-100,
		-111,
		-111,
		-89
	],
	Vograve: [
		-90,
		-90,
		-80,
		-80,
		-100,
		-111,
		-111,
		-89
	],
	Vohungarumlaut: [
		-90,
		-90,
		-80,
		-80,
		-100,
		-111,
		-111,
		-129
	],
	Vomacron: [
		-90,
		-90,
		-80,
		-80,
		-100,
		-111,
		-111,
		-89
	],
	Voslash: [
		-90,
		-90,
		-80,
		-80,
		-100,
		-111,
		-111,
		-129
	],
	Votilde: [
		-90,
		-90,
		-80,
		-80,
		-100,
		-111,
		-111,
		-89
	],
	Vperiod: [
		-120,
		-120,
		-125,
		-125,
		-145,
		-129,
		-129,
		-129
	],
	Vsemicolon: [
		-40,
		-40,
		-40,
		-40,
		-92,
		-74,
		-74,
		-74
	],
	Vu: [
		-60,
		-60,
		-70,
		-70,
		-92,
		-55,
		-74,
		-75
	],
	Vuacute: [
		-60,
		-60,
		-70,
		-70,
		-92,
		-55,
		-74,
		-75
	],
	Vucircumflex: [
		-60,
		-60,
		-70,
		-70,
		-92,
		-55,
		-74,
		-75
	],
	Vudieresis: [
		-60,
		-60,
		-70,
		-70,
		-92,
		-55,
		-74,
		-75
	],
	Vugrave: [
		-60,
		-60,
		-70,
		-70,
		-92,
		-55,
		-74,
		-75
	],
	Vuhungarumlaut: [
		-60,
		-60,
		-70,
		-70,
		-92,
		-55,
		-74,
		-75
	],
	Vumacron: [
		-60,
		-60,
		-70,
		-70,
		-92,
		-55,
		-74,
		-75
	],
	Vuogonek: [
		-60,
		-60,
		-70,
		-70,
		-92,
		-55,
		-74,
		-75
	],
	Vuring: [
		-60,
		-60,
		-70,
		-70,
		-92,
		-55,
		-74,
		-75
	],
	WA: [
		-60,
		-60,
		-50,
		-50,
		-120,
		-74,
		-60,
		-120
	],
	WAacute: [
		-60,
		-60,
		-50,
		-50,
		-120,
		-74,
		-60,
		-120
	],
	WAbreve: [
		-60,
		-60,
		-50,
		-50,
		-120,
		-74,
		-60,
		-120
	],
	WAcircumflex: [
		-60,
		-60,
		-50,
		-50,
		-120,
		-74,
		-60,
		-120
	],
	WAdieresis: [
		-60,
		-60,
		-50,
		-50,
		-120,
		-74,
		-60,
		-120
	],
	WAgrave: [
		-60,
		-60,
		-50,
		-50,
		-120,
		-74,
		-60,
		-120
	],
	WAmacron: [
		-60,
		-60,
		-50,
		-50,
		-120,
		-74,
		-60,
		-120
	],
	WAogonek: [
		-60,
		-60,
		-50,
		-50,
		-120,
		-74,
		-60,
		-120
	],
	WAring: [
		-60,
		-60,
		-50,
		-50,
		-120,
		-74,
		-60,
		-120
	],
	WAtilde: [
		-60,
		-60,
		-50,
		-50,
		-120,
		-74,
		-60,
		-120
	],
	WO: [
		-20,
		-20,
		-20,
		-20,
		-10,
		-15,
		-25,
		-10
	],
	WOacute: [
		-20,
		-20,
		-20,
		-20,
		-10,
		-15,
		-25,
		-10
	],
	WOcircumflex: [
		-20,
		-20,
		-20,
		-20,
		-10,
		-15,
		-25,
		-10
	],
	WOdieresis: [
		-20,
		-20,
		-20,
		-20,
		-10,
		-15,
		-25,
		-10
	],
	WOgrave: [
		-20,
		-20,
		-20,
		-20,
		-10,
		-15,
		-25,
		-10
	],
	WOhungarumlaut: [
		-20,
		-20,
		-20,
		-20,
		-10,
		-15,
		-25,
		-10
	],
	WOmacron: [
		-20,
		-20,
		-20,
		-20,
		-10,
		-15,
		-25,
		-10
	],
	WOslash: [
		-20,
		-20,
		-20,
		-20,
		-10,
		-15,
		-25,
		-10
	],
	WOtilde: [
		-20,
		-20,
		-20,
		-20,
		-10,
		-15,
		-25,
		-10
	],
	Wa: [
		-40,
		-40,
		-40,
		-40,
		-65,
		-85,
		-92,
		-80
	],
	Waacute: [
		-40,
		-40,
		-40,
		-40,
		-65,
		-85,
		-92,
		-80
	],
	Wabreve: [
		-40,
		-40,
		-40,
		-40,
		-65,
		-85,
		-92,
		-80
	],
	Wacircumflex: [
		-40,
		-40,
		-40,
		-40,
		-65,
		-85,
		-92,
		-80
	],
	Wadieresis: [
		-40,
		-40,
		-40,
		-40,
		-65,
		-85,
		-92,
		-80
	],
	Wagrave: [
		-40,
		-40,
		-40,
		-40,
		-65,
		-85,
		-92,
		-80
	],
	Wamacron: [
		-40,
		-40,
		-40,
		-40,
		-65,
		-85,
		-92,
		-80
	],
	Waogonek: [
		-40,
		-40,
		-40,
		-40,
		-65,
		-85,
		-92,
		-80
	],
	Waring: [
		-40,
		-40,
		-40,
		-40,
		-65,
		-85,
		-92,
		-80
	],
	Watilde: [
		-40,
		-40,
		-40,
		-40,
		-65,
		-85,
		-92,
		-80
	],
	Wcolon: [
		-10,
		-10,
		0,
		0,
		-55,
		-55,
		-65,
		-37
	],
	Wcomma: [
		-80,
		-80,
		-80,
		-80,
		-92,
		-74,
		-92,
		-92
	],
	We: [
		-35,
		-35,
		-30,
		-30,
		-65,
		-90,
		-92,
		-80
	],
	Weacute: [
		-35,
		-35,
		-30,
		-30,
		-65,
		-90,
		-92,
		-80
	],
	Wecaron: [
		-35,
		-35,
		-30,
		-30,
		-65,
		-90,
		-92,
		-80
	],
	Wecircumflex: [
		-35,
		-35,
		-30,
		-30,
		-65,
		-90,
		-92,
		-80
	],
	Wedieresis: [
		-35,
		-35,
		-30,
		-30,
		-65,
		-50,
		-52,
		-40
	],
	Wedotaccent: [
		-35,
		-35,
		-30,
		-30,
		-65,
		-90,
		-92,
		-80
	],
	Wegrave: [
		-35,
		-35,
		-30,
		-30,
		-65,
		-50,
		-52,
		-40
	],
	Wemacron: [
		-35,
		-35,
		-30,
		-30,
		-65,
		-50,
		-52,
		-40
	],
	Weogonek: [
		-35,
		-35,
		-30,
		-30,
		-65,
		-90,
		-92,
		-80
	],
	Whyphen: [
		-40,
		-40,
		-40,
		-40,
		-37,
		-50,
		-37,
		-65
	],
	Wo: [
		-60,
		-60,
		-30,
		-30,
		-75,
		-80,
		-92,
		-80
	],
	Woacute: [
		-60,
		-60,
		-30,
		-30,
		-75,
		-80,
		-92,
		-80
	],
	Wocircumflex: [
		-60,
		-60,
		-30,
		-30,
		-75,
		-80,
		-92,
		-80
	],
	Wodieresis: [
		-60,
		-60,
		-30,
		-30,
		-75,
		-80,
		-92,
		-80
	],
	Wograve: [
		-60,
		-60,
		-30,
		-30,
		-75,
		-80,
		-92,
		-80
	],
	Wohungarumlaut: [
		-60,
		-60,
		-30,
		-30,
		-75,
		-80,
		-92,
		-80
	],
	Womacron: [
		-60,
		-60,
		-30,
		-30,
		-75,
		-80,
		-92,
		-80
	],
	Woslash: [
		-60,
		-60,
		-30,
		-30,
		-75,
		-80,
		-92,
		-80
	],
	Wotilde: [
		-60,
		-60,
		-30,
		-30,
		-75,
		-80,
		-92,
		-80
	],
	Wperiod: [
		-80,
		-80,
		-80,
		-80,
		-92,
		-74,
		-92,
		-92
	],
	Wsemicolon: [
		-10,
		-10,
		0,
		0,
		-55,
		-55,
		-65,
		-37
	],
	Wu: [
		-45,
		-45,
		-30,
		-30,
		-50,
		-55,
		-55,
		-50
	],
	Wuacute: [
		-45,
		-45,
		-30,
		-30,
		-50,
		-55,
		-55,
		-50
	],
	Wucircumflex: [
		-45,
		-45,
		-30,
		-30,
		-50,
		-55,
		-55,
		-50
	],
	Wudieresis: [
		-45,
		-45,
		-30,
		-30,
		-50,
		-55,
		-55,
		-50
	],
	Wugrave: [
		-45,
		-45,
		-30,
		-30,
		-50,
		-55,
		-55,
		-50
	],
	Wuhungarumlaut: [
		-45,
		-45,
		-30,
		-30,
		-50,
		-55,
		-55,
		-50
	],
	Wumacron: [
		-45,
		-45,
		-30,
		-30,
		-50,
		-55,
		-55,
		-50
	],
	Wuogonek: [
		-45,
		-45,
		-30,
		-30,
		-50,
		-55,
		-55,
		-50
	],
	Wuring: [
		-45,
		-45,
		-30,
		-30,
		-50,
		-55,
		-55,
		-50
	],
	Wy: [
		-20,
		-20,
		-20,
		-20,
		-60,
		-55,
		-70,
		-73
	],
	Wyacute: [
		-20,
		-20,
		-20,
		-20,
		-60,
		-55,
		-70,
		-73
	],
	Wydieresis: [
		-20,
		-20,
		-20,
		-20,
		-60,
		-55,
		-70,
		-73
	],
	YA: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YAacute: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YAbreve: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YAcircumflex: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YAdieresis: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YAgrave: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YAmacron: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YAogonek: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YAring: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YAtilde: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YO: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YOacute: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YOcircumflex: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YOdieresis: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YOgrave: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YOhungarumlaut: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YOmacron: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YOslash: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YOtilde: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	Ya: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-100
	],
	Yaacute: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-100
	],
	Yabreve: [
		-90,
		-90,
		-70,
		-70,
		-85,
		-92,
		-92,
		-100
	],
	Yacircumflex: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-100
	],
	Yadieresis: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-60
	],
	Yagrave: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-60
	],
	Yamacron: [
		-90,
		-90,
		-70,
		-70,
		-85,
		-92,
		-92,
		-60
	],
	Yaogonek: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-100
	],
	Yaring: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-100
	],
	Yatilde: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-60
	],
	Ycolon: [
		-50,
		-50,
		-60,
		-60,
		-92,
		-92,
		-65,
		-92
	],
	Ycomma: [
		-100,
		-100,
		-140,
		-140,
		-92,
		-92,
		-92,
		-129
	],
	Ye: [
		-80,
		-80,
		-140,
		-140,
		-111,
		-111,
		-92,
		-100
	],
	Yeacute: [
		-80,
		-80,
		-140,
		-140,
		-111,
		-111,
		-92,
		-100
	],
	Yecaron: [
		-80,
		-80,
		-140,
		-140,
		-111,
		-111,
		-92,
		-100
	],
	Yecircumflex: [
		-80,
		-80,
		-140,
		-140,
		-111,
		-71,
		-92,
		-100
	],
	Yedieresis: [
		-80,
		-80,
		-140,
		-140,
		-71,
		-71,
		-52,
		-60
	],
	Yedotaccent: [
		-80,
		-80,
		-140,
		-140,
		-111,
		-111,
		-92,
		-100
	],
	Yegrave: [
		-80,
		-80,
		-140,
		-140,
		-71,
		-71,
		-52,
		-60
	],
	Yemacron: [
		-80,
		-80,
		-70,
		-70,
		-71,
		-71,
		-52,
		-60
	],
	Yeogonek: [
		-80,
		-80,
		-140,
		-140,
		-111,
		-111,
		-92,
		-100
	],
	Yo: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-110
	],
	Yoacute: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-110
	],
	Yocircumflex: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-110
	],
	Yodieresis: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-70
	],
	Yograve: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-70
	],
	Yohungarumlaut: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-110
	],
	Yomacron: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-70
	],
	Yoslash: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-110
	],
	Yotilde: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-70
	],
	Yperiod: [
		-100,
		-100,
		-140,
		-140,
		-92,
		-74,
		-92,
		-129
	],
	Ysemicolon: [
		-50,
		-50,
		-60,
		-60,
		-92,
		-92,
		-65,
		-92
	],
	Yu: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-111
	],
	Yuacute: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-111
	],
	Yucircumflex: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-111
	],
	Yudieresis: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-71
	],
	Yugrave: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-71
	],
	Yuhungarumlaut: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-111
	],
	Yumacron: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-71
	],
	Yuogonek: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-111
	],
	Yuring: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-111
	],
	YacuteA: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YacuteAacute: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YacuteAbreve: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YacuteAcircumflex: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YacuteAdieresis: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YacuteAgrave: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YacuteAmacron: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YacuteAogonek: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YacuteAring: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YacuteAtilde: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YacuteO: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YacuteOacute: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YacuteOcircumflex: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YacuteOdieresis: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YacuteOgrave: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YacuteOhungarumlaut: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YacuteOmacron: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YacuteOslash: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YacuteOtilde: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	Yacutea: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-100
	],
	Yacuteaacute: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-100
	],
	Yacuteabreve: [
		-90,
		-90,
		-70,
		-70,
		-85,
		-92,
		-92,
		-100
	],
	Yacuteacircumflex: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-100
	],
	Yacuteadieresis: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-60
	],
	Yacuteagrave: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-60
	],
	Yacuteamacron: [
		-90,
		-90,
		-70,
		-70,
		-85,
		-92,
		-92,
		-60
	],
	Yacuteaogonek: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-100
	],
	Yacutearing: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-100
	],
	Yacuteatilde: [
		-90,
		-90,
		-70,
		-70,
		-85,
		-92,
		-92,
		-60
	],
	Yacutecolon: [
		-50,
		-50,
		-60,
		-60,
		-92,
		-92,
		-65,
		-92
	],
	Yacutecomma: [
		-100,
		-100,
		-140,
		-140,
		-92,
		-92,
		-92,
		-129
	],
	Yacutee: [
		-80,
		-80,
		-140,
		-140,
		-111,
		-111,
		-92,
		-100
	],
	Yacuteeacute: [
		-80,
		-80,
		-140,
		-140,
		-111,
		-111,
		-92,
		-100
	],
	Yacuteecaron: [
		-80,
		-80,
		-140,
		-140,
		-111,
		-111,
		-92,
		-100
	],
	Yacuteecircumflex: [
		-80,
		-80,
		-140,
		-140,
		-111,
		-71,
		-92,
		-100
	],
	Yacuteedieresis: [
		-80,
		-80,
		-140,
		-140,
		-71,
		-71,
		-52,
		-60
	],
	Yacuteedotaccent: [
		-80,
		-80,
		-140,
		-140,
		-111,
		-111,
		-92,
		-100
	],
	Yacuteegrave: [
		-80,
		-80,
		-140,
		-140,
		-71,
		-71,
		-52,
		-60
	],
	Yacuteemacron: [
		-80,
		-80,
		-70,
		-70,
		-71,
		-71,
		-52,
		-60
	],
	Yacuteeogonek: [
		-80,
		-80,
		-140,
		-140,
		-111,
		-111,
		-92,
		-100
	],
	Yacuteo: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-110
	],
	Yacuteoacute: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-110
	],
	Yacuteocircumflex: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-110
	],
	Yacuteodieresis: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-70
	],
	Yacuteograve: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-70
	],
	Yacuteohungarumlaut: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-110
	],
	Yacuteomacron: [
		-100,
		-100,
		-70,
		-70,
		-111,
		-111,
		-92,
		-70
	],
	Yacuteoslash: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-110
	],
	Yacuteotilde: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-70
	],
	Yacuteperiod: [
		-100,
		-100,
		-140,
		-140,
		-92,
		-74,
		-92,
		-129
	],
	Yacutesemicolon: [
		-50,
		-50,
		-60,
		-60,
		-92,
		-92,
		-65,
		-92
	],
	Yacuteu: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-111
	],
	Yacuteuacute: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-111
	],
	Yacuteucircumflex: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-111
	],
	Yacuteudieresis: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-71
	],
	Yacuteugrave: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-71
	],
	Yacuteuhungarumlaut: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-111
	],
	Yacuteumacron: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-71
	],
	Yacuteuogonek: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-111
	],
	Yacuteuring: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-111
	],
	YdieresisA: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YdieresisAacute: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YdieresisAbreve: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YdieresisAcircumflex: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YdieresisAdieresis: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YdieresisAgrave: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YdieresisAmacron: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YdieresisAogonek: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YdieresisAring: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YdieresisAtilde: [
		-110,
		-110,
		-110,
		-110,
		-110,
		-74,
		-50,
		-120
	],
	YdieresisO: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YdieresisOacute: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YdieresisOcircumflex: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YdieresisOdieresis: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YdieresisOgrave: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YdieresisOhungarumlaut: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YdieresisOmacron: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YdieresisOslash: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	YdieresisOtilde: [
		-70,
		-70,
		-85,
		-85,
		-35,
		-25,
		-15,
		-30
	],
	Ydieresisa: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-100
	],
	Ydieresisaacute: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-100
	],
	Ydieresisabreve: [
		-90,
		-90,
		-70,
		-70,
		-85,
		-92,
		-92,
		-100
	],
	Ydieresisacircumflex: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-100
	],
	Ydieresisadieresis: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-60
	],
	Ydieresisagrave: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-60
	],
	Ydieresisamacron: [
		-90,
		-90,
		-70,
		-70,
		-85,
		-92,
		-92,
		-60
	],
	Ydieresisaogonek: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-100
	],
	Ydieresisaring: [
		-90,
		-90,
		-140,
		-140,
		-85,
		-92,
		-92,
		-100
	],
	Ydieresisatilde: [
		-90,
		-90,
		-70,
		-70,
		-85,
		-92,
		-92,
		-100
	],
	Ydieresiscolon: [
		-50,
		-50,
		-60,
		-60,
		-92,
		-92,
		-65,
		-92
	],
	Ydieresiscomma: [
		-100,
		-100,
		-140,
		-140,
		-92,
		-92,
		-92,
		-129
	],
	Ydieresise: [
		-80,
		-80,
		-140,
		-140,
		-111,
		-111,
		-92,
		-100
	],
	Ydieresiseacute: [
		-80,
		-80,
		-140,
		-140,
		-111,
		-111,
		-92,
		-100
	],
	Ydieresisecaron: [
		-80,
		-80,
		-140,
		-140,
		-111,
		-111,
		-92,
		-100
	],
	Ydieresisecircumflex: [
		-80,
		-80,
		-140,
		-140,
		-111,
		-71,
		-92,
		-100
	],
	Ydieresisedieresis: [
		-80,
		-80,
		-140,
		-140,
		-71,
		-71,
		-52,
		-60
	],
	Ydieresisedotaccent: [
		-80,
		-80,
		-140,
		-140,
		-111,
		-111,
		-92,
		-100
	],
	Ydieresisegrave: [
		-80,
		-80,
		-140,
		-140,
		-71,
		-71,
		-52,
		-60
	],
	Ydieresisemacron: [
		-80,
		-80,
		-70,
		-70,
		-71,
		-71,
		-52,
		-60
	],
	Ydieresiseogonek: [
		-80,
		-80,
		-140,
		-140,
		-111,
		-111,
		-92,
		-100
	],
	Ydieresiso: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-110
	],
	Ydieresisoacute: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-110
	],
	Ydieresisocircumflex: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-110
	],
	Ydieresisodieresis: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-70
	],
	Ydieresisograve: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-70
	],
	Ydieresisohungarumlaut: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-110
	],
	Ydieresisomacron: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-70
	],
	Ydieresisoslash: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-110
	],
	Ydieresisotilde: [
		-100,
		-100,
		-140,
		-140,
		-111,
		-111,
		-92,
		-70
	],
	Ydieresisperiod: [
		-100,
		-100,
		-140,
		-140,
		-92,
		-74,
		-92,
		-129
	],
	Ydieresissemicolon: [
		-50,
		-50,
		-60,
		-60,
		-92,
		-92,
		-65,
		-92
	],
	Ydieresisu: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-111
	],
	Ydieresisuacute: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-111
	],
	Ydieresisucircumflex: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-111
	],
	Ydieresisudieresis: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-71
	],
	Ydieresisugrave: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-71
	],
	Ydieresisuhungarumlaut: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-111
	],
	Ydieresisumacron: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-71
	],
	Ydieresisuogonek: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-111
	],
	Ydieresisuring: [
		-100,
		-100,
		-110,
		-110,
		-92,
		-92,
		-92,
		-111
	],
	ag: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	agbreve: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	agcommaaccent: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	av: [
		-15,
		-15,
		-20,
		-20,
		-25,
		0,
		0,
		-20
	],
	aw: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		0,
		-15
	],
	ay: [
		-20,
		-20,
		-30,
		-30
	],
	ayacute: [
		-20,
		-20,
		-30,
		-30
	],
	aydieresis: [
		-20,
		-20,
		-30,
		-30
	],
	aacuteg: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	aacutegbreve: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	aacutegcommaaccent: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	aacutev: [
		-15,
		-15,
		-20,
		-20,
		-25,
		0,
		0,
		-20
	],
	aacutew: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		0,
		-15
	],
	aacutey: [
		-20,
		-20,
		-30,
		-30
	],
	aacuteyacute: [
		-20,
		-20,
		-30,
		-30
	],
	aacuteydieresis: [
		-20,
		-20,
		-30,
		-30
	],
	abreveg: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	abrevegbreve: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	abrevegcommaaccent: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	abrevev: [
		-15,
		-15,
		-20,
		-20,
		-25,
		0,
		0,
		-20
	],
	abrevew: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		0,
		-15
	],
	abrevey: [
		-20,
		-20,
		-30,
		-30
	],
	abreveyacute: [
		-20,
		-20,
		-30,
		-30
	],
	abreveydieresis: [
		-20,
		-20,
		-30,
		-30
	],
	acircumflexg: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	acircumflexgbreve: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	acircumflexgcommaaccent: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	acircumflexv: [
		-15,
		-15,
		-20,
		-20,
		-25,
		0,
		0,
		-20
	],
	acircumflexw: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		0,
		-15
	],
	acircumflexy: [
		-20,
		-20,
		-30,
		-30
	],
	acircumflexyacute: [
		-20,
		-20,
		-30,
		-30
	],
	acircumflexydieresis: [
		-20,
		-20,
		-30,
		-30
	],
	adieresisg: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	adieresisgbreve: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	adieresisgcommaaccent: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	adieresisv: [
		-15,
		-15,
		-20,
		-20,
		-25,
		0,
		0,
		-20
	],
	adieresisw: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		0,
		-15
	],
	adieresisy: [
		-20,
		-20,
		-30,
		-30
	],
	adieresisyacute: [
		-20,
		-20,
		-30,
		-30
	],
	adieresisydieresis: [
		-20,
		-20,
		-30,
		-30
	],
	agraveg: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	agravegbreve: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	agravegcommaaccent: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	agravev: [
		-15,
		-15,
		-20,
		-20,
		-25,
		0,
		0,
		-20
	],
	agravew: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		0,
		-15
	],
	agravey: [
		-20,
		-20,
		-30,
		-30
	],
	agraveyacute: [
		-20,
		-20,
		-30,
		-30
	],
	agraveydieresis: [
		-20,
		-20,
		-30,
		-30
	],
	amacrong: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	amacrongbreve: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	amacrongcommaaccent: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	amacronv: [
		-15,
		-15,
		-20,
		-20,
		-25,
		0,
		0,
		-20
	],
	amacronw: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		0,
		-15
	],
	amacrony: [
		-20,
		-20,
		-30,
		-30
	],
	amacronyacute: [
		-20,
		-20,
		-30,
		-30
	],
	amacronydieresis: [
		-20,
		-20,
		-30,
		-30
	],
	aogonekg: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	aogonekgbreve: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	aogonekgcommaaccent: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	aogonekv: [
		-15,
		-15,
		-20,
		-20,
		-25,
		0,
		0,
		-20
	],
	aogonekw: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		0,
		-15
	],
	aogoneky: [
		-20,
		-20,
		-30,
		-30
	],
	aogonekyacute: [
		-20,
		-20,
		-30,
		-30
	],
	aogonekydieresis: [
		-20,
		-20,
		-30,
		-30
	],
	aringg: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	aringgbreve: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	aringgcommaaccent: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	aringv: [
		-15,
		-15,
		-20,
		-20,
		-25,
		0,
		0,
		-20
	],
	aringw: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		0,
		-15
	],
	aringy: [
		-20,
		-20,
		-30,
		-30
	],
	aringyacute: [
		-20,
		-20,
		-30,
		-30
	],
	aringydieresis: [
		-20,
		-20,
		-30,
		-30
	],
	atildeg: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	atildegbreve: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	atildegcommaaccent: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	atildev: [
		-15,
		-15,
		-20,
		-20,
		-25,
		0,
		0,
		-20
	],
	atildew: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		0,
		-15
	],
	atildey: [
		-20,
		-20,
		-30,
		-30
	],
	atildeyacute: [
		-20,
		-20,
		-30,
		-30
	],
	atildeydieresis: [
		-20,
		-20,
		-30,
		-30
	],
	bl: [
		-10,
		-10,
		-20,
		-20
	],
	blacute: [
		-10,
		-10,
		-20,
		-20
	],
	blcommaaccent: [
		-10,
		-10,
		-20,
		-20
	],
	blslash: [
		-10,
		-10,
		-20,
		-20
	],
	bu: [
		-20,
		-20,
		-20,
		-20,
		-20,
		-20,
		-20,
		-20
	],
	buacute: [
		-20,
		-20,
		-20,
		-20,
		-20,
		-20,
		-20,
		-20
	],
	bucircumflex: [
		-20,
		-20,
		-20,
		-20,
		-20,
		-20,
		-20,
		-20
	],
	budieresis: [
		-20,
		-20,
		-20,
		-20,
		-20,
		-20,
		-20,
		-20
	],
	bugrave: [
		-20,
		-20,
		-20,
		-20,
		-20,
		-20,
		-20,
		-20
	],
	buhungarumlaut: [
		-20,
		-20,
		-20,
		-20,
		-20,
		-20,
		-20,
		-20
	],
	bumacron: [
		-20,
		-20,
		-20,
		-20,
		-20,
		-20,
		-20,
		-20
	],
	buogonek: [
		-20,
		-20,
		-20,
		-20,
		-20,
		-20,
		-20,
		-20
	],
	buring: [
		-20,
		-20,
		-20,
		-20,
		-20,
		-20,
		-20,
		-20
	],
	bv: [
		-20,
		-20,
		-20,
		-20,
		-15,
		0,
		0,
		-15
	],
	by: [
		-20,
		-20,
		-20,
		-20
	],
	byacute: [
		-20,
		-20,
		-20,
		-20
	],
	bydieresis: [
		-20,
		-20,
		-20,
		-20
	],
	ch: [
		-10,
		-10,
		0,
		0,
		0,
		-10,
		-15
	],
	ck: [
		-20,
		-20,
		-20,
		-20,
		0,
		-10,
		-20
	],
	ckcommaaccent: [
		-20,
		-20,
		-20,
		-20,
		0,
		-10,
		-20
	],
	cl: [
		-20,
		-20
	],
	clacute: [
		-20,
		-20
	],
	clcommaaccent: [
		-20,
		-20
	],
	clslash: [
		-20,
		-20
	],
	cy: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		0,
		-15
	],
	cyacute: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		0,
		-15
	],
	cydieresis: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		0,
		-15
	],
	cacuteh: [
		-10,
		-10,
		0,
		0,
		0,
		-10,
		-15
	],
	cacutek: [
		-20,
		-20,
		-20,
		-20,
		0,
		-10,
		-20
	],
	cacutekcommaaccent: [
		-20,
		-20,
		-20,
		-20,
		0,
		-10,
		-20
	],
	cacutel: [
		-20,
		-20
	],
	cacutelacute: [
		-20,
		-20
	],
	cacutelcommaaccent: [
		-20,
		-20
	],
	cacutelslash: [
		-20,
		-20
	],
	cacutey: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		0,
		-15
	],
	cacuteyacute: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		0,
		-15
	],
	cacuteydieresis: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		0,
		-15
	],
	ccaronh: [
		-10,
		-10,
		0,
		0,
		0,
		-10,
		-15
	],
	ccaronk: [
		-20,
		-20,
		-20,
		-20,
		0,
		-10,
		-20
	],
	ccaronkcommaaccent: [
		-20,
		-20,
		-20,
		-20,
		0,
		-10,
		-20
	],
	ccaronl: [
		-20,
		-20
	],
	ccaronlacute: [
		-20,
		-20
	],
	ccaronlcommaaccent: [
		-20,
		-20
	],
	ccaronlslash: [
		-20,
		-20
	],
	ccarony: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		0,
		-15
	],
	ccaronyacute: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		0,
		-15
	],
	ccaronydieresis: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		0,
		-15
	],
	ccedillah: [
		-10,
		-10,
		0,
		0,
		0,
		-10,
		-15
	],
	ccedillak: [
		-20,
		-20,
		-20,
		-20,
		0,
		-10,
		-20
	],
	ccedillakcommaaccent: [
		-20,
		-20,
		-20,
		-20,
		0,
		-10,
		-20
	],
	ccedillal: [
		-20,
		-20
	],
	ccedillalacute: [
		-20,
		-20
	],
	ccedillalcommaaccent: [
		-20,
		-20
	],
	ccedillalslash: [
		-20,
		-20
	],
	ccedillay: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		0,
		-15
	],
	ccedillayacute: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		0,
		-15
	],
	ccedillaydieresis: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		0,
		-15
	],
	colonspace: [
		-40,
		-40,
		-50,
		-50
	],
	commaquotedblright: [
		-120,
		-120,
		-100,
		-100,
		-45,
		-95,
		-140,
		-70
	],
	commaquoteright: [
		-120,
		-120,
		-100,
		-100,
		-55,
		-95,
		-140,
		-70
	],
	commaspace: [
		-40,
		-40
	],
	dd: [
		-10,
		-10
	],
	ddcroat: [
		-10,
		-10
	],
	dv: [
		-15,
		-15
	],
	dw: [
		-15,
		-15,
		0,
		0,
		-15
	],
	dy: [
		-15,
		-15
	],
	dyacute: [
		-15,
		-15
	],
	dydieresis: [
		-15,
		-15
	],
	dcroatd: [
		-10,
		-10
	],
	dcroatdcroat: [
		-10,
		-10
	],
	dcroatv: [
		-15,
		-15
	],
	dcroatw: [
		-15,
		-15,
		0,
		0,
		-15
	],
	dcroaty: [
		-15,
		-15
	],
	dcroatyacute: [
		-15,
		-15
	],
	dcroatydieresis: [
		-15,
		-15
	],
	ecomma: [
		10,
		10,
		-15,
		-15,
		0,
		0,
		-10
	],
	eperiod: [
		20,
		20,
		-15,
		-15,
		0,
		0,
		-15
	],
	ev: [
		-15,
		-15,
		-30,
		-30,
		-15,
		0,
		-15,
		-25
	],
	ew: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-15,
		-25
	],
	ex: [
		-15,
		-15,
		-30,
		-30,
		0,
		0,
		-20,
		-15
	],
	ey: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	eyacute: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	eydieresis: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	eacutecomma: [
		10,
		10,
		-15,
		-15,
		0,
		0,
		-10
	],
	eacuteperiod: [
		20,
		20,
		-15,
		-15,
		0,
		0,
		-15
	],
	eacutev: [
		-15,
		-15,
		-30,
		-30,
		-15,
		0,
		-15,
		-25
	],
	eacutew: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-15,
		-25
	],
	eacutex: [
		-15,
		-15,
		-30,
		-30,
		0,
		0,
		-20,
		-15
	],
	eacutey: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	eacuteyacute: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	eacuteydieresis: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	ecaroncomma: [
		10,
		10,
		-15,
		-15,
		0,
		0,
		-10
	],
	ecaronperiod: [
		20,
		20,
		-15,
		-15,
		0,
		0,
		-15
	],
	ecaronv: [
		-15,
		-15,
		-30,
		-30,
		-15,
		0,
		-15,
		-25
	],
	ecaronw: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-15,
		-25
	],
	ecaronx: [
		-15,
		-15,
		-30,
		-30,
		0,
		0,
		-20,
		-15
	],
	ecarony: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	ecaronyacute: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	ecaronydieresis: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	ecircumflexcomma: [
		10,
		10,
		-15,
		-15,
		0,
		0,
		-10
	],
	ecircumflexperiod: [
		20,
		20,
		-15,
		-15,
		0,
		0,
		-15
	],
	ecircumflexv: [
		-15,
		-15,
		-30,
		-30,
		-15,
		0,
		-15,
		-25
	],
	ecircumflexw: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-15,
		-25
	],
	ecircumflexx: [
		-15,
		-15,
		-30,
		-30,
		0,
		0,
		-20,
		-15
	],
	ecircumflexy: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	ecircumflexyacute: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	ecircumflexydieresis: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	edieresiscomma: [
		10,
		10,
		-15,
		-15,
		0,
		0,
		-10
	],
	edieresisperiod: [
		20,
		20,
		-15,
		-15,
		0,
		0,
		-15
	],
	edieresisv: [
		-15,
		-15,
		-30,
		-30,
		-15,
		0,
		-15,
		-25
	],
	edieresisw: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-15,
		-25
	],
	edieresisx: [
		-15,
		-15,
		-30,
		-30,
		0,
		0,
		-20,
		-15
	],
	edieresisy: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	edieresisyacute: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	edieresisydieresis: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	edotaccentcomma: [
		10,
		10,
		-15,
		-15,
		0,
		0,
		-10
	],
	edotaccentperiod: [
		20,
		20,
		-15,
		-15,
		0,
		0,
		-15
	],
	edotaccentv: [
		-15,
		-15,
		-30,
		-30,
		-15,
		0,
		-15,
		-25
	],
	edotaccentw: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-15,
		-25
	],
	edotaccentx: [
		-15,
		-15,
		-30,
		-30,
		0,
		0,
		-20,
		-15
	],
	edotaccenty: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	edotaccentyacute: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	edotaccentydieresis: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	egravecomma: [
		10,
		10,
		-15,
		-15,
		0,
		0,
		-10
	],
	egraveperiod: [
		20,
		20,
		-15,
		-15,
		0,
		0,
		-15
	],
	egravev: [
		-15,
		-15,
		-30,
		-30,
		-15,
		0,
		-15,
		-25
	],
	egravew: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-15,
		-25
	],
	egravex: [
		-15,
		-15,
		-30,
		-30,
		0,
		0,
		-20,
		-15
	],
	egravey: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	egraveyacute: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	egraveydieresis: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	emacroncomma: [
		10,
		10,
		-15,
		-15,
		0,
		0,
		-10
	],
	emacronperiod: [
		20,
		20,
		-15,
		-15,
		0,
		0,
		-15
	],
	emacronv: [
		-15,
		-15,
		-30,
		-30,
		-15,
		0,
		-15,
		-25
	],
	emacronw: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-15,
		-25
	],
	emacronx: [
		-15,
		-15,
		-30,
		-30,
		0,
		0,
		-20,
		-15
	],
	emacrony: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	emacronyacute: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	emacronydieresis: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	eogonekcomma: [
		10,
		10,
		-15,
		-15,
		0,
		0,
		-10
	],
	eogonekperiod: [
		20,
		20,
		-15,
		-15,
		0,
		0,
		-15
	],
	eogonekv: [
		-15,
		-15,
		-30,
		-30,
		-15,
		0,
		-15,
		-25
	],
	eogonekw: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-15,
		-25
	],
	eogonekx: [
		-15,
		-15,
		-30,
		-30,
		0,
		0,
		-20,
		-15
	],
	eogoneky: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	eogonekyacute: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	eogonekydieresis: [
		-15,
		-15,
		-20,
		-20,
		0,
		0,
		-30,
		-15
	],
	fcomma: [
		-10,
		-10,
		-30,
		-30,
		-15,
		-10,
		-10
	],
	fe: [
		-10,
		-10,
		-30,
		-30,
		0,
		-10
	],
	feacute: [
		-10,
		-10,
		-30,
		-30,
		0,
		-10
	],
	fecaron: [
		-10,
		-10,
		-30,
		-30
	],
	fecircumflex: [
		-10,
		-10,
		-30,
		-30
	],
	fedieresis: [
		-10,
		-10,
		-30,
		-30
	],
	fedotaccent: [
		-10,
		-10,
		-30,
		-30,
		0,
		-10
	],
	fegrave: [
		-10,
		-10,
		-30,
		-30
	],
	femacron: [
		-10,
		-10,
		-30,
		-30
	],
	feogonek: [
		-10,
		-10,
		-30,
		-30,
		0,
		-10
	],
	fo: [
		-20,
		-20,
		-30,
		-30,
		-25,
		-10
	],
	foacute: [
		-20,
		-20,
		-30,
		-30,
		-25,
		-10
	],
	focircumflex: [
		-20,
		-20,
		-30,
		-30,
		-25,
		-10
	],
	fodieresis: [
		-20,
		-20,
		-30,
		-30,
		-25
	],
	fograve: [
		-20,
		-20,
		-30,
		-30,
		-25,
		-10
	],
	fohungarumlaut: [
		-20,
		-20,
		-30,
		-30,
		-25,
		-10
	],
	fomacron: [
		-20,
		-20,
		-30,
		-30,
		-25
	],
	foslash: [
		-20,
		-20,
		-30,
		-30,
		-25,
		-10
	],
	fotilde: [
		-20,
		-20,
		-30,
		-30,
		-25,
		-10
	],
	fperiod: [
		-10,
		-10,
		-30,
		-30,
		-15,
		-10,
		-15
	],
	fquotedblright: [
		30,
		30,
		60,
		60,
		50
	],
	fquoteright: [
		30,
		30,
		50,
		50,
		55,
		55,
		92,
		55
	],
	ge: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	geacute: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gecaron: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gecircumflex: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gedieresis: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gedotaccent: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gegrave: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gemacron: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	geogonek: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gg: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	ggbreve: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	ggcommaaccent: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	gbrevee: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gbreveeacute: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gbreveecaron: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gbreveecircumflex: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gbreveedieresis: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gbreveedotaccent: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gbreveegrave: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gbreveemacron: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gbreveeogonek: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gbreveg: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	gbrevegbreve: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	gbrevegcommaaccent: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	gcommaaccente: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gcommaaccenteacute: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gcommaaccentecaron: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gcommaaccentecircumflex: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gcommaaccentedieresis: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gcommaaccentedotaccent: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gcommaaccentegrave: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gcommaaccentemacron: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gcommaaccenteogonek: [
		10,
		10,
		0,
		0,
		0,
		0,
		-10
	],
	gcommaaccentg: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	gcommaaccentgbreve: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	gcommaaccentgcommaaccent: [
		-10,
		-10,
		0,
		0,
		0,
		0,
		-10
	],
	hy: [
		-20,
		-20,
		-30,
		-30,
		-15,
		0,
		0,
		-5
	],
	hyacute: [
		-20,
		-20,
		-30,
		-30,
		-15,
		0,
		0,
		-5
	],
	hydieresis: [
		-20,
		-20,
		-30,
		-30,
		-15,
		0,
		0,
		-5
	],
	ko: [
		-15,
		-15,
		-20,
		-20,
		-15,
		-10,
		-10,
		-10
	],
	koacute: [
		-15,
		-15,
		-20,
		-20,
		-15,
		-10,
		-10,
		-10
	],
	kocircumflex: [
		-15,
		-15,
		-20,
		-20,
		-15,
		-10,
		-10,
		-10
	],
	kodieresis: [
		-15,
		-15,
		-20,
		-20,
		-15,
		-10,
		-10,
		-10
	],
	kograve: [
		-15,
		-15,
		-20,
		-20,
		-15,
		-10,
		-10,
		-10
	],
	kohungarumlaut: [
		-15,
		-15,
		-20,
		-20,
		-15,
		-10,
		-10,
		-10
	],
	komacron: [
		-15,
		-15,
		-20,
		-20,
		-15,
		-10,
		-10,
		-10
	],
	koslash: [
		-15,
		-15,
		-20,
		-20,
		-15,
		-10,
		-10,
		-10
	],
	kotilde: [
		-15,
		-15,
		-20,
		-20,
		-15,
		-10,
		-10,
		-10
	],
	kcommaaccento: [
		-15,
		-15,
		-20,
		-20,
		-15,
		-10,
		-10,
		-10
	],
	kcommaaccentoacute: [
		-15,
		-15,
		-20,
		-20,
		-15,
		-10,
		-10,
		-10
	],
	kcommaaccentocircumflex: [
		-15,
		-15,
		-20,
		-20,
		-15,
		-10,
		-10,
		-10
	],
	kcommaaccentodieresis: [
		-15,
		-15,
		-20,
		-20,
		-15,
		-10,
		-10,
		-10
	],
	kcommaaccentograve: [
		-15,
		-15,
		-20,
		-20,
		-15,
		-10,
		-10,
		-10
	],
	kcommaaccentohungarumlaut: [
		-15,
		-15,
		-20,
		-20,
		-15,
		-10,
		-10,
		-10
	],
	kcommaaccentomacron: [
		-15,
		-15,
		-20,
		-20,
		-15,
		-10,
		-10,
		-10
	],
	kcommaaccentoslash: [
		-15,
		-15,
		-20,
		-20,
		-15,
		-10,
		-10,
		-10
	],
	kcommaaccentotilde: [
		-15,
		-15,
		-20,
		-20,
		-15,
		-10,
		-10,
		-10
	],
	lw: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	ly: [
		-15,
		-15
	],
	lyacute: [
		-15,
		-15
	],
	lydieresis: [
		-15,
		-15
	],
	lacutew: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	lacutey: [
		-15,
		-15
	],
	lacuteyacute: [
		-15,
		-15
	],
	lacuteydieresis: [
		-15,
		-15
	],
	lcommaaccentw: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	lcommaaccenty: [
		-15,
		-15
	],
	lcommaaccentyacute: [
		-15,
		-15
	],
	lcommaaccentydieresis: [
		-15,
		-15
	],
	lslashw: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	lslashy: [
		-15,
		-15
	],
	lslashyacute: [
		-15,
		-15
	],
	lslashydieresis: [
		-15,
		-15
	],
	mu: [
		-20,
		-20,
		-10,
		-10
	],
	muacute: [
		-20,
		-20,
		-10,
		-10
	],
	mucircumflex: [
		-20,
		-20,
		-10,
		-10
	],
	mudieresis: [
		-20,
		-20,
		-10,
		-10
	],
	mugrave: [
		-20,
		-20,
		-10,
		-10
	],
	muhungarumlaut: [
		-20,
		-20,
		-10,
		-10
	],
	mumacron: [
		-20,
		-20,
		-10,
		-10
	],
	muogonek: [
		-20,
		-20,
		-10,
		-10
	],
	muring: [
		-20,
		-20,
		-10,
		-10
	],
	my: [
		-30,
		-30,
		-15,
		-15
	],
	myacute: [
		-30,
		-30,
		-15,
		-15
	],
	mydieresis: [
		-30,
		-30,
		-15,
		-15
	],
	nu: [
		-10,
		-10,
		-10,
		-10
	],
	nuacute: [
		-10,
		-10,
		-10,
		-10
	],
	nucircumflex: [
		-10,
		-10,
		-10,
		-10
	],
	nudieresis: [
		-10,
		-10,
		-10,
		-10
	],
	nugrave: [
		-10,
		-10,
		-10,
		-10
	],
	nuhungarumlaut: [
		-10,
		-10,
		-10,
		-10
	],
	numacron: [
		-10,
		-10,
		-10,
		-10
	],
	nuogonek: [
		-10,
		-10,
		-10,
		-10
	],
	nuring: [
		-10,
		-10,
		-10,
		-10
	],
	nv: [
		-40,
		-40,
		-20,
		-20,
		-40,
		-40,
		-40,
		-40
	],
	ny: [
		-20,
		-20,
		-15,
		-15,
		0,
		0,
		0,
		-15
	],
	nyacute: [
		-20,
		-20,
		-15,
		-15,
		0,
		0,
		0,
		-15
	],
	nydieresis: [
		-20,
		-20,
		-15,
		-15,
		0,
		0,
		0,
		-15
	],
	nacuteu: [
		-10,
		-10,
		-10,
		-10
	],
	nacuteuacute: [
		-10,
		-10,
		-10,
		-10
	],
	nacuteucircumflex: [
		-10,
		-10,
		-10,
		-10
	],
	nacuteudieresis: [
		-10,
		-10,
		-10,
		-10
	],
	nacuteugrave: [
		-10,
		-10,
		-10,
		-10
	],
	nacuteuhungarumlaut: [
		-10,
		-10,
		-10,
		-10
	],
	nacuteumacron: [
		-10,
		-10,
		-10,
		-10
	],
	nacuteuogonek: [
		-10,
		-10,
		-10,
		-10
	],
	nacuteuring: [
		-10,
		-10,
		-10,
		-10
	],
	nacutev: [
		-40,
		-40,
		-20,
		-20,
		-40,
		-40,
		-40,
		-40
	],
	nacutey: [
		-20,
		-20,
		-15,
		-15,
		0,
		0,
		0,
		-15
	],
	nacuteyacute: [
		-20,
		-20,
		-15,
		-15,
		0,
		0,
		0,
		-15
	],
	nacuteydieresis: [
		-20,
		-20,
		-15,
		-15,
		0,
		0,
		0,
		-15
	],
	ncaronu: [
		-10,
		-10,
		-10,
		-10
	],
	ncaronuacute: [
		-10,
		-10,
		-10,
		-10
	],
	ncaronucircumflex: [
		-10,
		-10,
		-10,
		-10
	],
	ncaronudieresis: [
		-10,
		-10,
		-10,
		-10
	],
	ncaronugrave: [
		-10,
		-10,
		-10,
		-10
	],
	ncaronuhungarumlaut: [
		-10,
		-10,
		-10,
		-10
	],
	ncaronumacron: [
		-10,
		-10,
		-10,
		-10
	],
	ncaronuogonek: [
		-10,
		-10,
		-10,
		-10
	],
	ncaronuring: [
		-10,
		-10,
		-10,
		-10
	],
	ncaronv: [
		-40,
		-40,
		-20,
		-20,
		-40,
		-40,
		-40,
		-40
	],
	ncarony: [
		-20,
		-20,
		-15,
		-15,
		0,
		0,
		0,
		-15
	],
	ncaronyacute: [
		-20,
		-20,
		-15,
		-15,
		0,
		0,
		0,
		-15
	],
	ncaronydieresis: [
		-20,
		-20,
		-15,
		-15,
		0,
		0,
		0,
		-15
	],
	ncommaaccentu: [
		-10,
		-10,
		-10,
		-10
	],
	ncommaaccentuacute: [
		-10,
		-10,
		-10,
		-10
	],
	ncommaaccentucircumflex: [
		-10,
		-10,
		-10,
		-10
	],
	ncommaaccentudieresis: [
		-10,
		-10,
		-10,
		-10
	],
	ncommaaccentugrave: [
		-10,
		-10,
		-10,
		-10
	],
	ncommaaccentuhungarumlaut: [
		-10,
		-10,
		-10,
		-10
	],
	ncommaaccentumacron: [
		-10,
		-10,
		-10,
		-10
	],
	ncommaaccentuogonek: [
		-10,
		-10,
		-10,
		-10
	],
	ncommaaccenturing: [
		-10,
		-10,
		-10,
		-10
	],
	ncommaaccentv: [
		-40,
		-40,
		-20,
		-20,
		-40,
		-40,
		-40,
		-40
	],
	ncommaaccenty: [
		-20,
		-20,
		-15,
		-15,
		0,
		0,
		0,
		-15
	],
	ncommaaccentyacute: [
		-20,
		-20,
		-15,
		-15,
		0,
		0,
		0,
		-15
	],
	ncommaaccentydieresis: [
		-20,
		-20,
		-15,
		-15,
		0,
		0,
		0,
		-15
	],
	ntildeu: [
		-10,
		-10,
		-10,
		-10
	],
	ntildeuacute: [
		-10,
		-10,
		-10,
		-10
	],
	ntildeucircumflex: [
		-10,
		-10,
		-10,
		-10
	],
	ntildeudieresis: [
		-10,
		-10,
		-10,
		-10
	],
	ntildeugrave: [
		-10,
		-10,
		-10,
		-10
	],
	ntildeuhungarumlaut: [
		-10,
		-10,
		-10,
		-10
	],
	ntildeumacron: [
		-10,
		-10,
		-10,
		-10
	],
	ntildeuogonek: [
		-10,
		-10,
		-10,
		-10
	],
	ntildeuring: [
		-10,
		-10,
		-10,
		-10
	],
	ntildev: [
		-40,
		-40,
		-20,
		-20,
		-40,
		-40,
		-40,
		-40
	],
	ntildey: [
		-20,
		-20,
		-15,
		-15,
		0,
		0,
		0,
		-15
	],
	ntildeyacute: [
		-20,
		-20,
		-15,
		-15,
		0,
		0,
		0,
		-15
	],
	ntildeydieresis: [
		-20,
		-20,
		-15,
		-15,
		0,
		0,
		0,
		-15
	],
	ov: [
		-20,
		-20,
		-15,
		-15,
		-10,
		-15,
		-10,
		-15
	],
	ow: [
		-15,
		-15,
		-15,
		-15,
		-10,
		-25,
		0,
		-25
	],
	ox: [
		-30,
		-30,
		-30,
		-30,
		0,
		-10
	],
	oy: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	oyacute: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	oydieresis: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	oacutev: [
		-20,
		-20,
		-15,
		-15,
		-10,
		-15,
		-10,
		-15
	],
	oacutew: [
		-15,
		-15,
		-15,
		-15,
		-10,
		-25,
		0,
		-25
	],
	oacutex: [
		-30,
		-30,
		-30,
		-30,
		0,
		-10
	],
	oacutey: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	oacuteyacute: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	oacuteydieresis: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	ocircumflexv: [
		-20,
		-20,
		-15,
		-15,
		-10,
		-15,
		-10,
		-15
	],
	ocircumflexw: [
		-15,
		-15,
		-15,
		-15,
		-10,
		-25,
		0,
		-25
	],
	ocircumflexx: [
		-30,
		-30,
		-30,
		-30,
		0,
		-10
	],
	ocircumflexy: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	ocircumflexyacute: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	ocircumflexydieresis: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	odieresisv: [
		-20,
		-20,
		-15,
		-15,
		-10,
		-15,
		-10,
		-15
	],
	odieresisw: [
		-15,
		-15,
		-15,
		-15,
		-10,
		-25,
		0,
		-25
	],
	odieresisx: [
		-30,
		-30,
		-30,
		-30,
		0,
		-10
	],
	odieresisy: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	odieresisyacute: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	odieresisydieresis: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	ogravev: [
		-20,
		-20,
		-15,
		-15,
		-10,
		-15,
		-10,
		-15
	],
	ogravew: [
		-15,
		-15,
		-15,
		-15,
		-10,
		-25,
		0,
		-25
	],
	ogravex: [
		-30,
		-30,
		-30,
		-30,
		0,
		-10
	],
	ogravey: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	ograveyacute: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	ograveydieresis: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	ohungarumlautv: [
		-20,
		-20,
		-15,
		-15,
		-10,
		-15,
		-10,
		-15
	],
	ohungarumlautw: [
		-15,
		-15,
		-15,
		-15,
		-10,
		-25,
		0,
		-25
	],
	ohungarumlautx: [
		-30,
		-30,
		-30,
		-30,
		0,
		-10
	],
	ohungarumlauty: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	ohungarumlautyacute: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	ohungarumlautydieresis: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	omacronv: [
		-20,
		-20,
		-15,
		-15,
		-10,
		-15,
		-10,
		-15
	],
	omacronw: [
		-15,
		-15,
		-15,
		-15,
		-10,
		-25,
		0,
		-25
	],
	omacronx: [
		-30,
		-30,
		-30,
		-30,
		0,
		-10
	],
	omacrony: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	omacronyacute: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	omacronydieresis: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	oslashv: [
		-20,
		-20,
		-70,
		-70,
		-10,
		-15,
		-10,
		-15
	],
	oslashw: [
		-15,
		-15,
		-70,
		-70,
		-10,
		-25,
		0,
		-25
	],
	oslashx: [
		-30,
		-30,
		-85,
		-85,
		0,
		-10
	],
	oslashy: [
		-20,
		-20,
		-70,
		-70,
		0,
		-10,
		0,
		-10
	],
	oslashyacute: [
		-20,
		-20,
		-70,
		-70,
		0,
		-10,
		0,
		-10
	],
	oslashydieresis: [
		-20,
		-20,
		-70,
		-70,
		0,
		-10,
		0,
		-10
	],
	otildev: [
		-20,
		-20,
		-15,
		-15,
		-10,
		-15,
		-10,
		-15
	],
	otildew: [
		-15,
		-15,
		-15,
		-15,
		-10,
		-25,
		0,
		-25
	],
	otildex: [
		-30,
		-30,
		-30,
		-30,
		0,
		-10
	],
	otildey: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	otildeyacute: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	otildeydieresis: [
		-20,
		-20,
		-30,
		-30,
		0,
		-10,
		0,
		-10
	],
	py: [
		-15,
		-15,
		-30,
		-30,
		0,
		0,
		0,
		-10
	],
	pyacute: [
		-15,
		-15,
		-30,
		-30,
		0,
		0,
		0,
		-10
	],
	pydieresis: [
		-15,
		-15,
		-30,
		-30,
		0,
		0,
		0,
		-10
	],
	periodquotedblright: [
		-120,
		-120,
		-100,
		-100,
		-55,
		-95,
		-140,
		-70
	],
	periodquoteright: [
		-120,
		-120,
		-100,
		-100,
		-55,
		-95,
		-140,
		-70
	],
	periodspace: [
		-40,
		-40,
		-60,
		-60
	],
	quotedblrightspace: [
		-80,
		-80,
		-40,
		-40
	],
	quoteleftquoteleft: [
		-46,
		-46,
		-57,
		-57,
		-63,
		-74,
		-111,
		-74
	],
	quoterightd: [
		-80,
		-80,
		-50,
		-50,
		-20,
		-15,
		-25,
		-50
	],
	quoterightdcroat: [
		-80,
		-80,
		-50,
		-50,
		-20,
		-15,
		-25,
		-50
	],
	quoterightl: [
		-20,
		-20,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	quoterightlacute: [
		-20,
		-20,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	quoterightlcommaaccent: [
		-20,
		-20,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	quoterightlslash: [
		-20,
		-20,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	quoterightquoteright: [
		-46,
		-46,
		-57,
		-57,
		-63,
		-74,
		-111,
		-74
	],
	quoterightr: [
		-40,
		-40,
		-50,
		-50,
		-20,
		-15,
		-25,
		-50
	],
	quoterightracute: [
		-40,
		-40,
		-50,
		-50,
		-20,
		-15,
		-25,
		-50
	],
	quoterightrcaron: [
		-40,
		-40,
		-50,
		-50,
		-20,
		-15,
		-25,
		-50
	],
	quoterightrcommaaccent: [
		-40,
		-40,
		-50,
		-50,
		-20,
		-15,
		-25,
		-50
	],
	quoterights: [
		-60,
		-60,
		-50,
		-50,
		-37,
		-74,
		-40,
		-55
	],
	quoterightsacute: [
		-60,
		-60,
		-50,
		-50,
		-37,
		-74,
		-40,
		-55
	],
	quoterightscaron: [
		-60,
		-60,
		-50,
		-50,
		-37,
		-74,
		-40,
		-55
	],
	quoterightscedilla: [
		-60,
		-60,
		-50,
		-50,
		-37,
		-74,
		-40,
		-55
	],
	quoterightscommaaccent: [
		-60,
		-60,
		-50,
		-50,
		-37,
		-74,
		-40,
		-55
	],
	quoterightspace: [
		-80,
		-80,
		-70,
		-70,
		-74,
		-74,
		-111,
		-74
	],
	quoterightv: [
		-20,
		-20,
		0,
		0,
		-20,
		-15,
		-10,
		-50
	],
	rc: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-37
	],
	rcacute: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-37
	],
	rccaron: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-37
	],
	rccedilla: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-37
	],
	rcomma: [
		-60,
		-60,
		-50,
		-50,
		-92,
		-65,
		-111,
		-40
	],
	rd: [
		-20,
		-20,
		0,
		0,
		0,
		0,
		-37
	],
	rdcroat: [
		-20,
		-20,
		0,
		0,
		0,
		0,
		-37
	],
	rg: [
		-15,
		-15,
		0,
		0,
		-10,
		0,
		-37,
		-18
	],
	rgbreve: [
		-15,
		-15,
		0,
		0,
		-10,
		0,
		-37,
		-18
	],
	rgcommaaccent: [
		-15,
		-15,
		0,
		0,
		-10,
		0,
		-37,
		-18
	],
	rhyphen: [
		-20,
		-20,
		0,
		0,
		-37,
		0,
		-20,
		-20
	],
	ro: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	roacute: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rocircumflex: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rodieresis: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rograve: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rohungarumlaut: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	romacron: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	roslash: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rotilde: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rperiod: [
		-60,
		-60,
		-50,
		-50,
		-100,
		-65,
		-111,
		-55
	],
	rq: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-37
	],
	rs: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		-10
	],
	rsacute: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		-10
	],
	rscaron: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		-10
	],
	rscedilla: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		-10
	],
	rscommaaccent: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		-10
	],
	rt: [
		20,
		20,
		40,
		40
	],
	rtcommaaccent: [
		20,
		20,
		40,
		40
	],
	rv: [
		10,
		10,
		30,
		30,
		-10
	],
	ry: [
		10,
		10,
		30,
		30
	],
	ryacute: [
		10,
		10,
		30,
		30
	],
	rydieresis: [
		10,
		10,
		30,
		30
	],
	racutec: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-37
	],
	racutecacute: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-37
	],
	racuteccaron: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-37
	],
	racuteccedilla: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-37
	],
	racutecomma: [
		-60,
		-60,
		-50,
		-50,
		-92,
		-65,
		-111,
		-40
	],
	racuted: [
		-20,
		-20,
		0,
		0,
		0,
		0,
		-37
	],
	racutedcroat: [
		-20,
		-20,
		0,
		0,
		0,
		0,
		-37
	],
	racuteg: [
		-15,
		-15,
		0,
		0,
		-10,
		0,
		-37,
		-18
	],
	racutegbreve: [
		-15,
		-15,
		0,
		0,
		-10,
		0,
		-37,
		-18
	],
	racutegcommaaccent: [
		-15,
		-15,
		0,
		0,
		-10,
		0,
		-37,
		-18
	],
	racutehyphen: [
		-20,
		-20,
		0,
		0,
		-37,
		0,
		-20,
		-20
	],
	racuteo: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	racuteoacute: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	racuteocircumflex: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	racuteodieresis: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	racuteograve: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	racuteohungarumlaut: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	racuteomacron: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	racuteoslash: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	racuteotilde: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	racuteperiod: [
		-60,
		-60,
		-50,
		-50,
		-100,
		-65,
		-111,
		-55
	],
	racuteq: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-37
	],
	racutes: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		-10
	],
	racutesacute: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		-10
	],
	racutescaron: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		-10
	],
	racutescedilla: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		-10
	],
	racutescommaaccent: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		-10
	],
	racutet: [
		20,
		20,
		40,
		40
	],
	racutetcommaaccent: [
		20,
		20,
		40,
		40
	],
	racutev: [
		10,
		10,
		30,
		30,
		-10
	],
	racutey: [
		10,
		10,
		30,
		30
	],
	racuteyacute: [
		10,
		10,
		30,
		30
	],
	racuteydieresis: [
		10,
		10,
		30,
		30
	],
	rcaronc: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-37
	],
	rcaroncacute: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-37
	],
	rcaronccaron: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-37
	],
	rcaronccedilla: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-37
	],
	rcaroncomma: [
		-60,
		-60,
		-50,
		-50,
		-92,
		-65,
		-111,
		-40
	],
	rcarond: [
		-20,
		-20,
		0,
		0,
		0,
		0,
		-37
	],
	rcarondcroat: [
		-20,
		-20,
		0,
		0,
		0,
		0,
		-37
	],
	rcarong: [
		-15,
		-15,
		0,
		0,
		-10,
		0,
		-37,
		-18
	],
	rcarongbreve: [
		-15,
		-15,
		0,
		0,
		-10,
		0,
		-37,
		-18
	],
	rcarongcommaaccent: [
		-15,
		-15,
		0,
		0,
		-10,
		0,
		-37,
		-18
	],
	rcaronhyphen: [
		-20,
		-20,
		0,
		0,
		-37,
		0,
		-20,
		-20
	],
	rcarono: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rcaronoacute: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rcaronocircumflex: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rcaronodieresis: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rcaronograve: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rcaronohungarumlaut: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rcaronomacron: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rcaronoslash: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rcaronotilde: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rcaronperiod: [
		-60,
		-60,
		-50,
		-50,
		-100,
		-65,
		-111,
		-55
	],
	rcaronq: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-37
	],
	rcarons: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		-10
	],
	rcaronsacute: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		-10
	],
	rcaronscaron: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		-10
	],
	rcaronscedilla: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		-10
	],
	rcaronscommaaccent: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		-10
	],
	rcaront: [
		20,
		20,
		40,
		40
	],
	rcarontcommaaccent: [
		20,
		20,
		40,
		40
	],
	rcaronv: [
		10,
		10,
		30,
		30,
		-10
	],
	rcarony: [
		10,
		10,
		30,
		30
	],
	rcaronyacute: [
		10,
		10,
		30,
		30
	],
	rcaronydieresis: [
		10,
		10,
		30,
		30
	],
	rcommaaccentc: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-37
	],
	rcommaaccentcacute: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-37
	],
	rcommaaccentccaron: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-37
	],
	rcommaaccentccedilla: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-37
	],
	rcommaaccentcomma: [
		-60,
		-60,
		-50,
		-50,
		-92,
		-65,
		-111,
		-40
	],
	rcommaaccentd: [
		-20,
		-20,
		0,
		0,
		0,
		0,
		-37
	],
	rcommaaccentdcroat: [
		-20,
		-20,
		0,
		0,
		0,
		0,
		-37
	],
	rcommaaccentg: [
		-15,
		-15,
		0,
		0,
		-10,
		0,
		-37,
		-18
	],
	rcommaaccentgbreve: [
		-15,
		-15,
		0,
		0,
		-10,
		0,
		-37,
		-18
	],
	rcommaaccentgcommaaccent: [
		-15,
		-15,
		0,
		0,
		-10,
		0,
		-37,
		-18
	],
	rcommaaccenthyphen: [
		-20,
		-20,
		0,
		0,
		-37,
		0,
		-20,
		-20
	],
	rcommaaccento: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rcommaaccentoacute: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rcommaaccentocircumflex: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rcommaaccentodieresis: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rcommaaccentograve: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rcommaaccentohungarumlaut: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rcommaaccentomacron: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rcommaaccentoslash: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rcommaaccentotilde: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-45
	],
	rcommaaccentperiod: [
		-60,
		-60,
		-50,
		-50,
		-100,
		-65,
		-111,
		-55
	],
	rcommaaccentq: [
		-20,
		-20,
		0,
		0,
		-18,
		0,
		-37
	],
	rcommaaccents: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		-10
	],
	rcommaaccentsacute: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		-10
	],
	rcommaaccentscaron: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		-10
	],
	rcommaaccentscedilla: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		-10
	],
	rcommaaccentscommaaccent: [
		-15,
		-15,
		0,
		0,
		0,
		0,
		-10
	],
	rcommaaccentt: [
		20,
		20,
		40,
		40
	],
	rcommaaccenttcommaaccent: [
		20,
		20,
		40,
		40
	],
	rcommaaccentv: [
		10,
		10,
		30,
		30,
		-10
	],
	rcommaaccenty: [
		10,
		10,
		30,
		30
	],
	rcommaaccentyacute: [
		10,
		10,
		30,
		30
	],
	rcommaaccentydieresis: [
		10,
		10,
		30,
		30
	],
	sw: [
		-15,
		-15,
		-30,
		-30
	],
	sacutew: [
		-15,
		-15,
		-30,
		-30
	],
	scaronw: [
		-15,
		-15,
		-30,
		-30
	],
	scedillaw: [
		-15,
		-15,
		-30,
		-30
	],
	scommaaccentw: [
		-15,
		-15,
		-30,
		-30
	],
	semicolonspace: [
		-40,
		-40,
		-50,
		-50
	],
	spaceT: [
		-100,
		-100,
		-50,
		-50,
		-30,
		0,
		-18,
		-18
	],
	spaceTcaron: [
		-100,
		-100,
		-50,
		-50,
		-30,
		0,
		-18,
		-18
	],
	spaceTcommaaccent: [
		-100,
		-100,
		-50,
		-50,
		-30,
		0,
		-18,
		-18
	],
	spaceV: [
		-80,
		-80,
		-50,
		-50,
		-45,
		-70,
		-35,
		-50
	],
	spaceW: [
		-80,
		-80,
		-40,
		-40,
		-30,
		-70,
		-40,
		-30
	],
	spaceY: [
		-120,
		-120,
		-90,
		-90,
		-55,
		-70,
		-75,
		-90
	],
	spaceYacute: [
		-120,
		-120,
		-90,
		-90,
		-55,
		-70,
		-75,
		-90
	],
	spaceYdieresis: [
		-120,
		-120,
		-90,
		-90,
		-55,
		-70,
		-75,
		-90
	],
	spacequotedblleft: [
		-80,
		-80,
		-30,
		-30
	],
	spacequoteleft: [
		-60,
		-60,
		-60,
		-60
	],
	va: [
		-20,
		-20,
		-25,
		-25,
		-10,
		0,
		0,
		-25
	],
	vaacute: [
		-20,
		-20,
		-25,
		-25,
		-10,
		0,
		0,
		-25
	],
	vabreve: [
		-20,
		-20,
		-25,
		-25,
		-10,
		0,
		0,
		-25
	],
	vacircumflex: [
		-20,
		-20,
		-25,
		-25,
		-10,
		0,
		0,
		-25
	],
	vadieresis: [
		-20,
		-20,
		-25,
		-25,
		-10,
		0,
		0,
		-25
	],
	vagrave: [
		-20,
		-20,
		-25,
		-25,
		-10,
		0,
		0,
		-25
	],
	vamacron: [
		-20,
		-20,
		-25,
		-25,
		-10,
		0,
		0,
		-25
	],
	vaogonek: [
		-20,
		-20,
		-25,
		-25,
		-10,
		0,
		0,
		-25
	],
	varing: [
		-20,
		-20,
		-25,
		-25,
		-10,
		0,
		0,
		-25
	],
	vatilde: [
		-20,
		-20,
		-25,
		-25,
		-10,
		0,
		0,
		-25
	],
	vcomma: [
		-80,
		-80,
		-80,
		-80,
		-55,
		-37,
		-74,
		-65
	],
	vo: [
		-30,
		-30,
		-25,
		-25,
		-10,
		-15,
		0,
		-20
	],
	voacute: [
		-30,
		-30,
		-25,
		-25,
		-10,
		-15,
		0,
		-20
	],
	vocircumflex: [
		-30,
		-30,
		-25,
		-25,
		-10,
		-15,
		0,
		-20
	],
	vodieresis: [
		-30,
		-30,
		-25,
		-25,
		-10,
		-15,
		0,
		-20
	],
	vograve: [
		-30,
		-30,
		-25,
		-25,
		-10,
		-15,
		0,
		-20
	],
	vohungarumlaut: [
		-30,
		-30,
		-25,
		-25,
		-10,
		-15,
		0,
		-20
	],
	vomacron: [
		-30,
		-30,
		-25,
		-25,
		-10,
		-15,
		0,
		-20
	],
	voslash: [
		-30,
		-30,
		-25,
		-25,
		-10,
		-15,
		0,
		-20
	],
	votilde: [
		-30,
		-30,
		-25,
		-25,
		-10,
		-15,
		0,
		-20
	],
	vperiod: [
		-80,
		-80,
		-80,
		-80,
		-70,
		-37,
		-74,
		-65
	],
	wcomma: [
		-40,
		-40,
		-60,
		-60,
		-55,
		-37,
		-74,
		-65
	],
	wo: [
		-20,
		-20,
		-10,
		-10,
		-10,
		-15,
		0,
		-10
	],
	woacute: [
		-20,
		-20,
		-10,
		-10,
		-10,
		-15,
		0,
		-10
	],
	wocircumflex: [
		-20,
		-20,
		-10,
		-10,
		-10,
		-15,
		0,
		-10
	],
	wodieresis: [
		-20,
		-20,
		-10,
		-10,
		-10,
		-15,
		0,
		-10
	],
	wograve: [
		-20,
		-20,
		-10,
		-10,
		-10,
		-15,
		0,
		-10
	],
	wohungarumlaut: [
		-20,
		-20,
		-10,
		-10,
		-10,
		-15,
		0,
		-10
	],
	womacron: [
		-20,
		-20,
		-10,
		-10,
		-10,
		-15,
		0,
		-10
	],
	woslash: [
		-20,
		-20,
		-10,
		-10,
		-10,
		-15,
		0,
		-10
	],
	wotilde: [
		-20,
		-20,
		-10,
		-10,
		-10,
		-15,
		0,
		-10
	],
	wperiod: [
		-40,
		-40,
		-60,
		-60,
		-70,
		-37,
		-74,
		-65
	],
	xe: [
		-10,
		-10,
		-30,
		-30,
		0,
		-10,
		0,
		-15
	],
	xeacute: [
		-10,
		-10,
		-30,
		-30,
		0,
		-10,
		0,
		-15
	],
	xecaron: [
		-10,
		-10,
		-30,
		-30,
		0,
		-10,
		0,
		-15
	],
	xecircumflex: [
		-10,
		-10,
		-30,
		-30,
		0,
		-10,
		0,
		-15
	],
	xedieresis: [
		-10,
		-10,
		-30,
		-30,
		0,
		-10,
		0,
		-15
	],
	xedotaccent: [
		-10,
		-10,
		-30,
		-30,
		0,
		-10,
		0,
		-15
	],
	xegrave: [
		-10,
		-10,
		-30,
		-30,
		0,
		-10,
		0,
		-15
	],
	xemacron: [
		-10,
		-10,
		-30,
		-30,
		0,
		-10,
		0,
		-15
	],
	xeogonek: [
		-10,
		-10,
		-30,
		-30,
		0,
		-10,
		0,
		-15
	],
	ya: [
		-30,
		-30,
		-20,
		-20
	],
	yaacute: [
		-30,
		-30,
		-20,
		-20
	],
	yabreve: [
		-30,
		-30,
		-20,
		-20
	],
	yacircumflex: [
		-30,
		-30,
		-20,
		-20
	],
	yadieresis: [
		-30,
		-30,
		-20,
		-20
	],
	yagrave: [
		-30,
		-30,
		-20,
		-20
	],
	yamacron: [
		-30,
		-30,
		-20,
		-20
	],
	yaogonek: [
		-30,
		-30,
		-20,
		-20
	],
	yaring: [
		-30,
		-30,
		-20,
		-20
	],
	yatilde: [
		-30,
		-30,
		-20,
		-20
	],
	ycomma: [
		-80,
		-80,
		-100,
		-100,
		-55,
		-37,
		-55,
		-65
	],
	ye: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	yeacute: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	yecaron: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	yecircumflex: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	yedieresis: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	yedotaccent: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	yegrave: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	yemacron: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	yeogonek: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	yo: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	yoacute: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	yocircumflex: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	yodieresis: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	yograve: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	yohungarumlaut: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	yomacron: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	yoslash: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	yotilde: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	yperiod: [
		-80,
		-80,
		-100,
		-100,
		-70,
		-37,
		-55,
		-65
	],
	yacutea: [
		-30,
		-30,
		-20,
		-20
	],
	yacuteaacute: [
		-30,
		-30,
		-20,
		-20
	],
	yacuteabreve: [
		-30,
		-30,
		-20,
		-20
	],
	yacuteacircumflex: [
		-30,
		-30,
		-20,
		-20
	],
	yacuteadieresis: [
		-30,
		-30,
		-20,
		-20
	],
	yacuteagrave: [
		-30,
		-30,
		-20,
		-20
	],
	yacuteamacron: [
		-30,
		-30,
		-20,
		-20
	],
	yacuteaogonek: [
		-30,
		-30,
		-20,
		-20
	],
	yacutearing: [
		-30,
		-30,
		-20,
		-20
	],
	yacuteatilde: [
		-30,
		-30,
		-20,
		-20
	],
	yacutecomma: [
		-80,
		-80,
		-100,
		-100,
		-55,
		-37,
		-55,
		-65
	],
	yacutee: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	yacuteeacute: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	yacuteecaron: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	yacuteecircumflex: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	yacuteedieresis: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	yacuteedotaccent: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	yacuteegrave: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	yacuteemacron: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	yacuteeogonek: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	yacuteo: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	yacuteoacute: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	yacuteocircumflex: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	yacuteodieresis: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	yacuteograve: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	yacuteohungarumlaut: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	yacuteomacron: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	yacuteoslash: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	yacuteotilde: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	yacuteperiod: [
		-80,
		-80,
		-100,
		-100,
		-70,
		-37,
		-55,
		-65
	],
	ydieresisa: [
		-30,
		-30,
		-20,
		-20
	],
	ydieresisaacute: [
		-30,
		-30,
		-20,
		-20
	],
	ydieresisabreve: [
		-30,
		-30,
		-20,
		-20
	],
	ydieresisacircumflex: [
		-30,
		-30,
		-20,
		-20
	],
	ydieresisadieresis: [
		-30,
		-30,
		-20,
		-20
	],
	ydieresisagrave: [
		-30,
		-30,
		-20,
		-20
	],
	ydieresisamacron: [
		-30,
		-30,
		-20,
		-20
	],
	ydieresisaogonek: [
		-30,
		-30,
		-20,
		-20
	],
	ydieresisaring: [
		-30,
		-30,
		-20,
		-20
	],
	ydieresisatilde: [
		-30,
		-30,
		-20,
		-20
	],
	ydieresiscomma: [
		-80,
		-80,
		-100,
		-100,
		-55,
		-37,
		-55,
		-65
	],
	ydieresise: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	ydieresiseacute: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	ydieresisecaron: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	ydieresisecircumflex: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	ydieresisedieresis: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	ydieresisedotaccent: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	ydieresisegrave: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	ydieresisemacron: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	ydieresiseogonek: [
		-10,
		-10,
		-20,
		-20,
		-10
	],
	ydieresiso: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	ydieresisoacute: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	ydieresisocircumflex: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	ydieresisodieresis: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	ydieresisograve: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	ydieresisohungarumlaut: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	ydieresisomacron: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	ydieresisoslash: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	ydieresisotilde: [
		-25,
		-25,
		-20,
		-20,
		-25
	],
	ydieresisperiod: [
		-80,
		-80,
		-100,
		-100,
		-70,
		-37,
		-55,
		-65
	],
	ze: [
		10,
		10,
		-15,
		-15
	],
	zeacute: [
		10,
		10,
		-15,
		-15
	],
	zecaron: [
		10,
		10,
		-15,
		-15
	],
	zecircumflex: [
		10,
		10,
		-15,
		-15
	],
	zedieresis: [
		10,
		10,
		-15,
		-15
	],
	zedotaccent: [
		10,
		10,
		-15,
		-15
	],
	zegrave: [
		10,
		10,
		-15,
		-15
	],
	zemacron: [
		10,
		10,
		-15,
		-15
	],
	zeogonek: [
		10,
		10,
		-15,
		-15
	],
	zacutee: [
		10,
		10,
		-15,
		-15
	],
	zacuteeacute: [
		10,
		10,
		-15,
		-15
	],
	zacuteecaron: [
		10,
		10,
		-15,
		-15
	],
	zacuteecircumflex: [
		10,
		10,
		-15,
		-15
	],
	zacuteedieresis: [
		10,
		10,
		-15,
		-15
	],
	zacuteedotaccent: [
		10,
		10,
		-15,
		-15
	],
	zacuteegrave: [
		10,
		10,
		-15,
		-15
	],
	zacuteemacron: [
		10,
		10,
		-15,
		-15
	],
	zacuteeogonek: [
		10,
		10,
		-15,
		-15
	],
	zcarone: [
		10,
		10,
		-15,
		-15
	],
	zcaroneacute: [
		10,
		10,
		-15,
		-15
	],
	zcaronecaron: [
		10,
		10,
		-15,
		-15
	],
	zcaronecircumflex: [
		10,
		10,
		-15,
		-15
	],
	zcaronedieresis: [
		10,
		10,
		-15,
		-15
	],
	zcaronedotaccent: [
		10,
		10,
		-15,
		-15
	],
	zcaronegrave: [
		10,
		10,
		-15,
		-15
	],
	zcaronemacron: [
		10,
		10,
		-15,
		-15
	],
	zcaroneogonek: [
		10,
		10,
		-15,
		-15
	],
	zdotaccente: [
		10,
		10,
		-15,
		-15
	],
	zdotaccenteacute: [
		10,
		10,
		-15,
		-15
	],
	zdotaccentecaron: [
		10,
		10,
		-15,
		-15
	],
	zdotaccentecircumflex: [
		10,
		10,
		-15,
		-15
	],
	zdotaccentedieresis: [
		10,
		10,
		-15,
		-15
	],
	zdotaccentedotaccent: [
		10,
		10,
		-15,
		-15
	],
	zdotaccentegrave: [
		10,
		10,
		-15,
		-15
	],
	zdotaccentemacron: [
		10,
		10,
		-15,
		-15
	],
	zdotaccenteogonek: [
		10,
		10,
		-15,
		-15
	],
	Bcomma: [
		0,
		0,
		-20,
		-20
	],
	Bperiod: [
		0,
		0,
		-20,
		-20
	],
	Ccomma: [
		0,
		0,
		-30,
		-30
	],
	Cperiod: [
		0,
		0,
		-30,
		-30
	],
	Cacutecomma: [
		0,
		0,
		-30,
		-30
	],
	Cacuteperiod: [
		0,
		0,
		-30,
		-30
	],
	Ccaroncomma: [
		0,
		0,
		-30,
		-30
	],
	Ccaronperiod: [
		0,
		0,
		-30,
		-30
	],
	Ccedillacomma: [
		0,
		0,
		-30,
		-30
	],
	Ccedillaperiod: [
		0,
		0,
		-30,
		-30
	],
	Fe: [
		0,
		0,
		-30,
		-30,
		-25,
		-100,
		-75
	],
	Feacute: [
		0,
		0,
		-30,
		-30,
		-25,
		-100,
		-75
	],
	Fecaron: [
		0,
		0,
		-30,
		-30,
		-25,
		-100,
		-75
	],
	Fecircumflex: [
		0,
		0,
		-30,
		-30,
		-25,
		-100,
		-75
	],
	Fedieresis: [
		0,
		0,
		-30,
		-30,
		-25,
		-100,
		-75
	],
	Fedotaccent: [
		0,
		0,
		-30,
		-30,
		-25,
		-100,
		-75
	],
	Fegrave: [
		0,
		0,
		-30,
		-30,
		-25,
		-100,
		-75
	],
	Femacron: [
		0,
		0,
		-30,
		-30,
		-25,
		-100,
		-75
	],
	Feogonek: [
		0,
		0,
		-30,
		-30,
		-25,
		-100,
		-75
	],
	Fo: [
		0,
		0,
		-30,
		-30,
		-25,
		-70,
		-105,
		-15
	],
	Foacute: [
		0,
		0,
		-30,
		-30,
		-25,
		-70,
		-105,
		-15
	],
	Focircumflex: [
		0,
		0,
		-30,
		-30,
		-25,
		-70,
		-105,
		-15
	],
	Fodieresis: [
		0,
		0,
		-30,
		-30,
		-25,
		-70,
		-105,
		-15
	],
	Fograve: [
		0,
		0,
		-30,
		-30,
		-25,
		-70,
		-105,
		-15
	],
	Fohungarumlaut: [
		0,
		0,
		-30,
		-30,
		-25,
		-70,
		-105,
		-15
	],
	Fomacron: [
		0,
		0,
		-30,
		-30,
		-25,
		-70,
		-105,
		-15
	],
	Foslash: [
		0,
		0,
		-30,
		-30,
		-25,
		-70,
		-105,
		-15
	],
	Fotilde: [
		0,
		0,
		-30,
		-30,
		-25,
		-70,
		-105,
		-15
	],
	Fr: [
		0,
		0,
		-45,
		-45,
		0,
		-50,
		-55
	],
	Fracute: [
		0,
		0,
		-45,
		-45,
		0,
		-50,
		-55
	],
	Frcaron: [
		0,
		0,
		-45,
		-45,
		0,
		-50,
		-55
	],
	Frcommaaccent: [
		0,
		0,
		-45,
		-45,
		0,
		-50,
		-55
	],
	Ja: [
		0,
		0,
		-20,
		-20,
		-15,
		-40,
		-35
	],
	Jaacute: [
		0,
		0,
		-20,
		-20,
		-15,
		-40,
		-35
	],
	Jabreve: [
		0,
		0,
		-20,
		-20,
		-15,
		-40,
		-35
	],
	Jacircumflex: [
		0,
		0,
		-20,
		-20,
		-15,
		-40,
		-35
	],
	Jadieresis: [
		0,
		0,
		-20,
		-20,
		-15,
		-40,
		-35
	],
	Jagrave: [
		0,
		0,
		-20,
		-20,
		-15,
		-40,
		-35
	],
	Jamacron: [
		0,
		0,
		-20,
		-20,
		-15,
		-40,
		-35
	],
	Jaogonek: [
		0,
		0,
		-20,
		-20,
		-15,
		-40,
		-35
	],
	Jaring: [
		0,
		0,
		-20,
		-20,
		-15,
		-40,
		-35
	],
	Jatilde: [
		0,
		0,
		-20,
		-20,
		-15,
		-40,
		-35
	],
	LcaronT: [
		0,
		0,
		-110,
		-110
	],
	LcaronTcaron: [
		0,
		0,
		-110,
		-110
	],
	LcaronTcommaaccent: [
		0,
		0,
		-110,
		-110
	],
	LcaronV: [
		0,
		0,
		-110,
		-110
	],
	LcaronW: [
		0,
		0,
		-70,
		-70
	],
	LcaronY: [
		0,
		0,
		-140,
		-140
	],
	LcaronYacute: [
		0,
		0,
		-140,
		-140
	],
	LcaronYdieresis: [
		0,
		0,
		-140,
		-140
	],
	Lcaronquotedblright: [
		0,
		0,
		-140,
		-140
	],
	Lcaronquoteright: [
		0,
		0,
		-160,
		-160,
		0,
		0,
		0,
		-92
	],
	Lcarony: [
		0,
		0,
		-30,
		-30,
		0,
		0,
		0,
		-55
	],
	Lcaronyacute: [
		0,
		0,
		-30,
		-30,
		0,
		0,
		0,
		-55
	],
	Lcaronydieresis: [
		0,
		0,
		-30,
		-30,
		0,
		0,
		0,
		-55
	],
	Scomma: [
		0,
		0,
		-20,
		-20
	],
	Speriod: [
		0,
		0,
		-20,
		-20
	],
	Sacutecomma: [
		0,
		0,
		-20,
		-20
	],
	Sacuteperiod: [
		0,
		0,
		-20,
		-20
	],
	Scaroncomma: [
		0,
		0,
		-20,
		-20
	],
	Scaronperiod: [
		0,
		0,
		-20,
		-20
	],
	Scedillacomma: [
		0,
		0,
		-20,
		-20
	],
	Scedillaperiod: [
		0,
		0,
		-20,
		-20
	],
	Scommaaccentcomma: [
		0,
		0,
		-20,
		-20
	],
	Scommaaccentperiod: [
		0,
		0,
		-20,
		-20
	],
	Trcaron: [
		0,
		0,
		-120,
		-120,
		-74,
		-37,
		-55,
		-35
	],
	Tcaronrcaron: [
		0,
		0,
		-120,
		-120,
		-74,
		-37,
		-55,
		-35
	],
	Tcommaaccentrcaron: [
		0,
		0,
		-120,
		-120,
		-74,
		-37,
		-55,
		-35
	],
	Yhyphen: [
		0,
		0,
		-140,
		-140,
		-92,
		-92,
		-74,
		-111
	],
	Yi: [
		0,
		0,
		-20,
		-20,
		-37,
		-55,
		-74,
		-55
	],
	Yiacute: [
		0,
		0,
		-20,
		-20,
		-37,
		-55,
		-74,
		-55
	],
	Yiogonek: [
		0,
		0,
		-20,
		-20,
		-37,
		-55,
		-74,
		-55
	],
	Yacutehyphen: [
		0,
		0,
		-140,
		-140,
		-92,
		-92,
		-74,
		-111
	],
	Yacutei: [
		0,
		0,
		-20,
		-20,
		-37,
		-55,
		-74,
		-55
	],
	Yacuteiacute: [
		0,
		0,
		-20,
		-20,
		-37,
		-55,
		-74,
		-55
	],
	Yacuteiogonek: [
		0,
		0,
		-20,
		-20,
		-37,
		-55,
		-74,
		-55
	],
	Ydieresishyphen: [
		0,
		0,
		-140,
		-140,
		-92,
		-92,
		-74,
		-111
	],
	Ydieresisi: [
		0,
		0,
		-20,
		-20,
		-37,
		-55,
		-74,
		-55
	],
	Ydieresisiacute: [
		0,
		0,
		-20,
		-20,
		-37,
		-55,
		-74,
		-55
	],
	Ydieresisiogonek: [
		0,
		0,
		-20,
		-20,
		-37,
		-55,
		-74,
		-55
	],
	bb: [
		0,
		0,
		-10,
		-10,
		-10,
		-10
	],
	bcomma: [
		0,
		0,
		-40,
		-40
	],
	bperiod: [
		0,
		0,
		-40,
		-40,
		-40,
		-40,
		-40,
		-40
	],
	ccomma: [
		0,
		0,
		-15,
		-15
	],
	cacutecomma: [
		0,
		0,
		-15,
		-15
	],
	ccaroncomma: [
		0,
		0,
		-15,
		-15
	],
	ccedillacomma: [
		0,
		0,
		-15,
		-15
	],
	fa: [
		0,
		0,
		-30,
		-30,
		0,
		0,
		0,
		-10
	],
	faacute: [
		0,
		0,
		-30,
		-30,
		0,
		0,
		0,
		-10
	],
	fabreve: [
		0,
		0,
		-30,
		-30,
		0,
		0,
		0,
		-10
	],
	facircumflex: [
		0,
		0,
		-30,
		-30,
		0,
		0,
		0,
		-10
	],
	fadieresis: [
		0,
		0,
		-30,
		-30,
		0,
		0,
		0,
		-10
	],
	fagrave: [
		0,
		0,
		-30,
		-30,
		0,
		0,
		0,
		-10
	],
	famacron: [
		0,
		0,
		-30,
		-30,
		0,
		0,
		0,
		-10
	],
	faogonek: [
		0,
		0,
		-30,
		-30,
		0,
		0,
		0,
		-10
	],
	faring: [
		0,
		0,
		-30,
		-30,
		0,
		0,
		0,
		-10
	],
	fatilde: [
		0,
		0,
		-30,
		-30,
		0,
		0,
		0,
		-10
	],
	fdotlessi: [
		0,
		0,
		-28,
		-28,
		-35,
		-30,
		-60,
		-50
	],
	gr: [
		0,
		0,
		-10,
		-10
	],
	gracute: [
		0,
		0,
		-10,
		-10
	],
	grcaron: [
		0,
		0,
		-10,
		-10
	],
	grcommaaccent: [
		0,
		0,
		-10,
		-10
	],
	gbrever: [
		0,
		0,
		-10,
		-10
	],
	gbreveracute: [
		0,
		0,
		-10,
		-10
	],
	gbrevercaron: [
		0,
		0,
		-10,
		-10
	],
	gbrevercommaaccent: [
		0,
		0,
		-10,
		-10
	],
	gcommaaccentr: [
		0,
		0,
		-10,
		-10
	],
	gcommaaccentracute: [
		0,
		0,
		-10,
		-10
	],
	gcommaaccentrcaron: [
		0,
		0,
		-10,
		-10
	],
	gcommaaccentrcommaaccent: [
		0,
		0,
		-10,
		-10
	],
	ke: [
		0,
		0,
		-20,
		-20,
		-10,
		-30,
		-10,
		-10
	],
	keacute: [
		0,
		0,
		-20,
		-20,
		-10,
		-30,
		-10,
		-10
	],
	kecaron: [
		0,
		0,
		-20,
		-20,
		-10,
		-30,
		-10,
		-10
	],
	kecircumflex: [
		0,
		0,
		-20,
		-20,
		-10,
		-30,
		-10,
		-10
	],
	kedieresis: [
		0,
		0,
		-20,
		-20,
		-10,
		-30,
		-10,
		-10
	],
	kedotaccent: [
		0,
		0,
		-20,
		-20,
		-10,
		-30,
		-10,
		-10
	],
	kegrave: [
		0,
		0,
		-20,
		-20,
		-10,
		-30,
		-10,
		-10
	],
	kemacron: [
		0,
		0,
		-20,
		-20,
		-10,
		-30,
		-10,
		-10
	],
	keogonek: [
		0,
		0,
		-20,
		-20,
		-10,
		-30,
		-10,
		-10
	],
	kcommaaccente: [
		0,
		0,
		-20,
		-20,
		-10,
		-30,
		-10,
		-10
	],
	kcommaaccenteacute: [
		0,
		0,
		-20,
		-20,
		-10,
		-30,
		-10,
		-10
	],
	kcommaaccentecaron: [
		0,
		0,
		-20,
		-20,
		-10,
		-30,
		-10,
		-10
	],
	kcommaaccentecircumflex: [
		0,
		0,
		-20,
		-20,
		-10,
		-30,
		-10,
		-10
	],
	kcommaaccentedieresis: [
		0,
		0,
		-20,
		-20,
		-10,
		-30,
		-10,
		-10
	],
	kcommaaccentedotaccent: [
		0,
		0,
		-20,
		-20,
		-10,
		-30,
		-10,
		-10
	],
	kcommaaccentegrave: [
		0,
		0,
		-20,
		-20,
		-10,
		-30,
		-10,
		-10
	],
	kcommaaccentemacron: [
		0,
		0,
		-20,
		-20,
		-10,
		-30,
		-10,
		-10
	],
	kcommaaccenteogonek: [
		0,
		0,
		-20,
		-20,
		-10,
		-30,
		-10,
		-10
	],
	ocomma: [
		0,
		0,
		-40,
		-40
	],
	operiod: [
		0,
		0,
		-40,
		-40
	],
	oacutecomma: [
		0,
		0,
		-40,
		-40
	],
	oacuteperiod: [
		0,
		0,
		-40,
		-40
	],
	ocircumflexcomma: [
		0,
		0,
		-40,
		-40
	],
	ocircumflexperiod: [
		0,
		0,
		-40,
		-40
	],
	odieresiscomma: [
		0,
		0,
		-40,
		-40
	],
	odieresisperiod: [
		0,
		0,
		-40,
		-40
	],
	ogravecomma: [
		0,
		0,
		-40,
		-40
	],
	ograveperiod: [
		0,
		0,
		-40,
		-40
	],
	ohungarumlautcomma: [
		0,
		0,
		-40,
		-40
	],
	ohungarumlautperiod: [
		0,
		0,
		-40,
		-40
	],
	omacroncomma: [
		0,
		0,
		-40,
		-40
	],
	omacronperiod: [
		0,
		0,
		-40,
		-40
	],
	oslasha: [
		0,
		0,
		-55,
		-55
	],
	oslashaacute: [
		0,
		0,
		-55,
		-55
	],
	oslashabreve: [
		0,
		0,
		-55,
		-55
	],
	oslashacircumflex: [
		0,
		0,
		-55,
		-55
	],
	oslashadieresis: [
		0,
		0,
		-55,
		-55
	],
	oslashagrave: [
		0,
		0,
		-55,
		-55
	],
	oslashamacron: [
		0,
		0,
		-55,
		-55
	],
	oslashaogonek: [
		0,
		0,
		-55,
		-55
	],
	oslasharing: [
		0,
		0,
		-55,
		-55
	],
	oslashatilde: [
		0,
		0,
		-55,
		-55
	],
	oslashb: [
		0,
		0,
		-55,
		-55
	],
	oslashc: [
		0,
		0,
		-55,
		-55
	],
	oslashcacute: [
		0,
		0,
		-55,
		-55
	],
	oslashccaron: [
		0,
		0,
		-55,
		-55
	],
	oslashccedilla: [
		0,
		0,
		-55,
		-55
	],
	oslashcomma: [
		0,
		0,
		-95,
		-95
	],
	oslashd: [
		0,
		0,
		-55,
		-55
	],
	oslashdcroat: [
		0,
		0,
		-55,
		-55
	],
	oslashe: [
		0,
		0,
		-55,
		-55
	],
	oslasheacute: [
		0,
		0,
		-55,
		-55
	],
	oslashecaron: [
		0,
		0,
		-55,
		-55
	],
	oslashecircumflex: [
		0,
		0,
		-55,
		-55
	],
	oslashedieresis: [
		0,
		0,
		-55,
		-55
	],
	oslashedotaccent: [
		0,
		0,
		-55,
		-55
	],
	oslashegrave: [
		0,
		0,
		-55,
		-55
	],
	oslashemacron: [
		0,
		0,
		-55,
		-55
	],
	oslasheogonek: [
		0,
		0,
		-55,
		-55
	],
	oslashf: [
		0,
		0,
		-55,
		-55
	],
	oslashg: [
		0,
		0,
		-55,
		-55,
		0,
		0,
		-10
	],
	oslashgbreve: [
		0,
		0,
		-55,
		-55,
		0,
		0,
		-10
	],
	oslashgcommaaccent: [
		0,
		0,
		-55,
		-55,
		0,
		0,
		-10
	],
	oslashh: [
		0,
		0,
		-55,
		-55
	],
	oslashi: [
		0,
		0,
		-55,
		-55
	],
	oslashiacute: [
		0,
		0,
		-55,
		-55
	],
	oslashicircumflex: [
		0,
		0,
		-55,
		-55
	],
	oslashidieresis: [
		0,
		0,
		-55,
		-55
	],
	oslashigrave: [
		0,
		0,
		-55,
		-55
	],
	oslashimacron: [
		0,
		0,
		-55,
		-55
	],
	oslashiogonek: [
		0,
		0,
		-55,
		-55
	],
	oslashj: [
		0,
		0,
		-55,
		-55
	],
	oslashk: [
		0,
		0,
		-55,
		-55
	],
	oslashkcommaaccent: [
		0,
		0,
		-55,
		-55
	],
	oslashl: [
		0,
		0,
		-55,
		-55
	],
	oslashlacute: [
		0,
		0,
		-55,
		-55
	],
	oslashlcommaaccent: [
		0,
		0,
		-55,
		-55
	],
	oslashlslash: [
		0,
		0,
		-55,
		-55
	],
	oslashm: [
		0,
		0,
		-55,
		-55
	],
	oslashn: [
		0,
		0,
		-55,
		-55
	],
	oslashnacute: [
		0,
		0,
		-55,
		-55
	],
	oslashncaron: [
		0,
		0,
		-55,
		-55
	],
	oslashncommaaccent: [
		0,
		0,
		-55,
		-55
	],
	oslashntilde: [
		0,
		0,
		-55,
		-55
	],
	oslasho: [
		0,
		0,
		-55,
		-55
	],
	oslashoacute: [
		0,
		0,
		-55,
		-55
	],
	oslashocircumflex: [
		0,
		0,
		-55,
		-55
	],
	oslashodieresis: [
		0,
		0,
		-55,
		-55
	],
	oslashograve: [
		0,
		0,
		-55,
		-55
	],
	oslashohungarumlaut: [
		0,
		0,
		-55,
		-55
	],
	oslashomacron: [
		0,
		0,
		-55,
		-55
	],
	oslashoslash: [
		0,
		0,
		-55,
		-55
	],
	oslashotilde: [
		0,
		0,
		-55,
		-55
	],
	oslashp: [
		0,
		0,
		-55,
		-55
	],
	oslashperiod: [
		0,
		0,
		-95,
		-95
	],
	oslashq: [
		0,
		0,
		-55,
		-55
	],
	oslashr: [
		0,
		0,
		-55,
		-55
	],
	oslashracute: [
		0,
		0,
		-55,
		-55
	],
	oslashrcaron: [
		0,
		0,
		-55,
		-55
	],
	oslashrcommaaccent: [
		0,
		0,
		-55,
		-55
	],
	oslashs: [
		0,
		0,
		-55,
		-55
	],
	oslashsacute: [
		0,
		0,
		-55,
		-55
	],
	oslashscaron: [
		0,
		0,
		-55,
		-55
	],
	oslashscedilla: [
		0,
		0,
		-55,
		-55
	],
	oslashscommaaccent: [
		0,
		0,
		-55,
		-55
	],
	oslasht: [
		0,
		0,
		-55,
		-55
	],
	oslashtcommaaccent: [
		0,
		0,
		-55,
		-55
	],
	oslashu: [
		0,
		0,
		-55,
		-55
	],
	oslashuacute: [
		0,
		0,
		-55,
		-55
	],
	oslashucircumflex: [
		0,
		0,
		-55,
		-55
	],
	oslashudieresis: [
		0,
		0,
		-55,
		-55
	],
	oslashugrave: [
		0,
		0,
		-55,
		-55
	],
	oslashuhungarumlaut: [
		0,
		0,
		-55,
		-55
	],
	oslashumacron: [
		0,
		0,
		-55,
		-55
	],
	oslashuogonek: [
		0,
		0,
		-55,
		-55
	],
	oslashuring: [
		0,
		0,
		-55,
		-55
	],
	oslashz: [
		0,
		0,
		-55,
		-55
	],
	oslashzacute: [
		0,
		0,
		-55,
		-55
	],
	oslashzcaron: [
		0,
		0,
		-55,
		-55
	],
	oslashzdotaccent: [
		0,
		0,
		-55,
		-55
	],
	otildecomma: [
		0,
		0,
		-40,
		-40
	],
	otildeperiod: [
		0,
		0,
		-40,
		-40
	],
	pcomma: [
		0,
		0,
		-35,
		-35
	],
	pperiod: [
		0,
		0,
		-35,
		-35
	],
	ra: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	raacute: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rabreve: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	racircumflex: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	radieresis: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	ragrave: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	ramacron: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	raogonek: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	raring: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	ratilde: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcolon: [
		0,
		0,
		30,
		30
	],
	ri: [
		0,
		0,
		15,
		15
	],
	riacute: [
		0,
		0,
		15,
		15
	],
	ricircumflex: [
		0,
		0,
		15,
		15
	],
	ridieresis: [
		0,
		0,
		15,
		15
	],
	rigrave: [
		0,
		0,
		15,
		15
	],
	rimacron: [
		0,
		0,
		15,
		15
	],
	riogonek: [
		0,
		0,
		15,
		15
	],
	rk: [
		0,
		0,
		15,
		15
	],
	rkcommaaccent: [
		0,
		0,
		15,
		15
	],
	rl: [
		0,
		0,
		15,
		15
	],
	rlacute: [
		0,
		0,
		15,
		15
	],
	rlcommaaccent: [
		0,
		0,
		15,
		15
	],
	rlslash: [
		0,
		0,
		15,
		15
	],
	rm: [
		0,
		0,
		25,
		25
	],
	rn: [
		0,
		0,
		25,
		25,
		-15
	],
	rnacute: [
		0,
		0,
		25,
		25,
		-15
	],
	rncaron: [
		0,
		0,
		25,
		25,
		-15
	],
	rncommaaccent: [
		0,
		0,
		25,
		25,
		-15
	],
	rntilde: [
		0,
		0,
		25,
		25,
		-15
	],
	rp: [
		0,
		0,
		30,
		30,
		-10
	],
	rsemicolon: [
		0,
		0,
		30,
		30
	],
	ru: [
		0,
		0,
		15,
		15
	],
	ruacute: [
		0,
		0,
		15,
		15
	],
	rucircumflex: [
		0,
		0,
		15,
		15
	],
	rudieresis: [
		0,
		0,
		15,
		15
	],
	rugrave: [
		0,
		0,
		15,
		15
	],
	ruhungarumlaut: [
		0,
		0,
		15,
		15
	],
	rumacron: [
		0,
		0,
		15,
		15
	],
	ruogonek: [
		0,
		0,
		15,
		15
	],
	ruring: [
		0,
		0,
		15,
		15
	],
	racutea: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	racuteaacute: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	racuteabreve: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	racuteacircumflex: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	racuteadieresis: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	racuteagrave: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	racuteamacron: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	racuteaogonek: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	racutearing: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	racuteatilde: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	racutecolon: [
		0,
		0,
		30,
		30
	],
	racutei: [
		0,
		0,
		15,
		15
	],
	racuteiacute: [
		0,
		0,
		15,
		15
	],
	racuteicircumflex: [
		0,
		0,
		15,
		15
	],
	racuteidieresis: [
		0,
		0,
		15,
		15
	],
	racuteigrave: [
		0,
		0,
		15,
		15
	],
	racuteimacron: [
		0,
		0,
		15,
		15
	],
	racuteiogonek: [
		0,
		0,
		15,
		15
	],
	racutek: [
		0,
		0,
		15,
		15
	],
	racutekcommaaccent: [
		0,
		0,
		15,
		15
	],
	racutel: [
		0,
		0,
		15,
		15
	],
	racutelacute: [
		0,
		0,
		15,
		15
	],
	racutelcommaaccent: [
		0,
		0,
		15,
		15
	],
	racutelslash: [
		0,
		0,
		15,
		15
	],
	racutem: [
		0,
		0,
		25,
		25
	],
	racuten: [
		0,
		0,
		25,
		25,
		-15
	],
	racutenacute: [
		0,
		0,
		25,
		25,
		-15
	],
	racutencaron: [
		0,
		0,
		25,
		25,
		-15
	],
	racutencommaaccent: [
		0,
		0,
		25,
		25,
		-15
	],
	racutentilde: [
		0,
		0,
		25,
		25,
		-15
	],
	racutep: [
		0,
		0,
		30,
		30,
		-10
	],
	racutesemicolon: [
		0,
		0,
		30,
		30
	],
	racuteu: [
		0,
		0,
		15,
		15
	],
	racuteuacute: [
		0,
		0,
		15,
		15
	],
	racuteucircumflex: [
		0,
		0,
		15,
		15
	],
	racuteudieresis: [
		0,
		0,
		15,
		15
	],
	racuteugrave: [
		0,
		0,
		15,
		15
	],
	racuteuhungarumlaut: [
		0,
		0,
		15,
		15
	],
	racuteumacron: [
		0,
		0,
		15,
		15
	],
	racuteuogonek: [
		0,
		0,
		15,
		15
	],
	racuteuring: [
		0,
		0,
		15,
		15
	],
	rcarona: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcaronaacute: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcaronabreve: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcaronacircumflex: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcaronadieresis: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcaronagrave: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcaronamacron: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcaronaogonek: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcaronaring: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcaronatilde: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcaroncolon: [
		0,
		0,
		30,
		30
	],
	rcaroni: [
		0,
		0,
		15,
		15
	],
	rcaroniacute: [
		0,
		0,
		15,
		15
	],
	rcaronicircumflex: [
		0,
		0,
		15,
		15
	],
	rcaronidieresis: [
		0,
		0,
		15,
		15
	],
	rcaronigrave: [
		0,
		0,
		15,
		15
	],
	rcaronimacron: [
		0,
		0,
		15,
		15
	],
	rcaroniogonek: [
		0,
		0,
		15,
		15
	],
	rcaronk: [
		0,
		0,
		15,
		15
	],
	rcaronkcommaaccent: [
		0,
		0,
		15,
		15
	],
	rcaronl: [
		0,
		0,
		15,
		15
	],
	rcaronlacute: [
		0,
		0,
		15,
		15
	],
	rcaronlcommaaccent: [
		0,
		0,
		15,
		15
	],
	rcaronlslash: [
		0,
		0,
		15,
		15
	],
	rcaronm: [
		0,
		0,
		25,
		25
	],
	rcaronn: [
		0,
		0,
		25,
		25,
		-15
	],
	rcaronnacute: [
		0,
		0,
		25,
		25,
		-15
	],
	rcaronncaron: [
		0,
		0,
		25,
		25,
		-15
	],
	rcaronncommaaccent: [
		0,
		0,
		25,
		25,
		-15
	],
	rcaronntilde: [
		0,
		0,
		25,
		25,
		-15
	],
	rcaronp: [
		0,
		0,
		30,
		30,
		-10
	],
	rcaronsemicolon: [
		0,
		0,
		30,
		30
	],
	rcaronu: [
		0,
		0,
		15,
		15
	],
	rcaronuacute: [
		0,
		0,
		15,
		15
	],
	rcaronucircumflex: [
		0,
		0,
		15,
		15
	],
	rcaronudieresis: [
		0,
		0,
		15,
		15
	],
	rcaronugrave: [
		0,
		0,
		15,
		15
	],
	rcaronuhungarumlaut: [
		0,
		0,
		15,
		15
	],
	rcaronumacron: [
		0,
		0,
		15,
		15
	],
	rcaronuogonek: [
		0,
		0,
		15,
		15
	],
	rcaronuring: [
		0,
		0,
		15,
		15
	],
	rcommaaccenta: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcommaaccentaacute: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcommaaccentabreve: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcommaaccentacircumflex: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcommaaccentadieresis: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcommaaccentagrave: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcommaaccentamacron: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcommaaccentaogonek: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcommaaccentaring: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcommaaccentatilde: [
		0,
		0,
		-10,
		-10,
		0,
		0,
		-15
	],
	rcommaaccentcolon: [
		0,
		0,
		30,
		30
	],
	rcommaaccenti: [
		0,
		0,
		15,
		15
	],
	rcommaaccentiacute: [
		0,
		0,
		15,
		15
	],
	rcommaaccenticircumflex: [
		0,
		0,
		15,
		15
	],
	rcommaaccentidieresis: [
		0,
		0,
		15,
		15
	],
	rcommaaccentigrave: [
		0,
		0,
		15,
		15
	],
	rcommaaccentimacron: [
		0,
		0,
		15,
		15
	],
	rcommaaccentiogonek: [
		0,
		0,
		15,
		15
	],
	rcommaaccentk: [
		0,
		0,
		15,
		15
	],
	rcommaaccentkcommaaccent: [
		0,
		0,
		15,
		15
	],
	rcommaaccentl: [
		0,
		0,
		15,
		15
	],
	rcommaaccentlacute: [
		0,
		0,
		15,
		15
	],
	rcommaaccentlcommaaccent: [
		0,
		0,
		15,
		15
	],
	rcommaaccentlslash: [
		0,
		0,
		15,
		15
	],
	rcommaaccentm: [
		0,
		0,
		25,
		25
	],
	rcommaaccentn: [
		0,
		0,
		25,
		25,
		-15
	],
	rcommaaccentnacute: [
		0,
		0,
		25,
		25,
		-15
	],
	rcommaaccentncaron: [
		0,
		0,
		25,
		25,
		-15
	],
	rcommaaccentncommaaccent: [
		0,
		0,
		25,
		25,
		-15
	],
	rcommaaccentntilde: [
		0,
		0,
		25,
		25,
		-15
	],
	rcommaaccentp: [
		0,
		0,
		30,
		30,
		-10
	],
	rcommaaccentsemicolon: [
		0,
		0,
		30,
		30
	],
	rcommaaccentu: [
		0,
		0,
		15,
		15
	],
	rcommaaccentuacute: [
		0,
		0,
		15,
		15
	],
	rcommaaccentucircumflex: [
		0,
		0,
		15,
		15
	],
	rcommaaccentudieresis: [
		0,
		0,
		15,
		15
	],
	rcommaaccentugrave: [
		0,
		0,
		15,
		15
	],
	rcommaaccentuhungarumlaut: [
		0,
		0,
		15,
		15
	],
	rcommaaccentumacron: [
		0,
		0,
		15,
		15
	],
	rcommaaccentuogonek: [
		0,
		0,
		15,
		15
	],
	rcommaaccenturing: [
		0,
		0,
		15,
		15
	],
	scomma: [
		0,
		0,
		-15,
		-15
	],
	speriod: [
		0,
		0,
		-15,
		-15
	],
	sacutecomma: [
		0,
		0,
		-15,
		-15
	],
	sacuteperiod: [
		0,
		0,
		-15,
		-15
	],
	scaroncomma: [
		0,
		0,
		-15,
		-15
	],
	scaronperiod: [
		0,
		0,
		-15,
		-15
	],
	scedillacomma: [
		0,
		0,
		-15,
		-15
	],
	scedillaperiod: [
		0,
		0,
		-15,
		-15
	],
	scommaaccentcomma: [
		0,
		0,
		-15,
		-15
	],
	scommaaccentperiod: [
		0,
		0,
		-15,
		-15
	],
	ve: [
		0,
		0,
		-25,
		-25,
		-10,
		-15,
		0,
		-15
	],
	veacute: [
		0,
		0,
		-25,
		-25,
		-10,
		-15,
		0,
		-15
	],
	vecaron: [
		0,
		0,
		-25,
		-25,
		-10,
		-15,
		0,
		-15
	],
	vecircumflex: [
		0,
		0,
		-25,
		-25,
		-10,
		-15,
		0,
		-15
	],
	vedieresis: [
		0,
		0,
		-25,
		-25,
		-10,
		-15,
		0,
		-15
	],
	vedotaccent: [
		0,
		0,
		-25,
		-25,
		-10,
		-15,
		0,
		-15
	],
	vegrave: [
		0,
		0,
		-25,
		-25,
		-10,
		-15,
		0,
		-15
	],
	vemacron: [
		0,
		0,
		-25,
		-25,
		-10,
		-15,
		0,
		-15
	],
	veogonek: [
		0,
		0,
		-25,
		-25,
		-10,
		-15,
		0,
		-15
	],
	wa: [
		0,
		0,
		-15,
		-15,
		0,
		-10,
		0,
		-10
	],
	waacute: [
		0,
		0,
		-15,
		-15,
		0,
		-10,
		0,
		-10
	],
	wabreve: [
		0,
		0,
		-15,
		-15,
		0,
		-10,
		0,
		-10
	],
	wacircumflex: [
		0,
		0,
		-15,
		-15,
		0,
		-10,
		0,
		-10
	],
	wadieresis: [
		0,
		0,
		-15,
		-15,
		0,
		-10,
		0,
		-10
	],
	wagrave: [
		0,
		0,
		-15,
		-15,
		0,
		-10,
		0,
		-10
	],
	wamacron: [
		0,
		0,
		-15,
		-15,
		0,
		-10,
		0,
		-10
	],
	waogonek: [
		0,
		0,
		-15,
		-15,
		0,
		-10,
		0,
		-10
	],
	waring: [
		0,
		0,
		-15,
		-15,
		0,
		-10,
		0,
		-10
	],
	watilde: [
		0,
		0,
		-15,
		-15,
		0,
		-10,
		0,
		-10
	],
	we: [
		0,
		0,
		-10,
		-10,
		0,
		-10
	],
	weacute: [
		0,
		0,
		-10,
		-10,
		0,
		-10
	],
	wecaron: [
		0,
		0,
		-10,
		-10,
		0,
		-10
	],
	wecircumflex: [
		0,
		0,
		-10,
		-10,
		0,
		-10
	],
	wedieresis: [
		0,
		0,
		-10,
		-10,
		0,
		-10
	],
	wedotaccent: [
		0,
		0,
		-10,
		-10,
		0,
		-10
	],
	wegrave: [
		0,
		0,
		-10,
		-10,
		0,
		-10
	],
	wemacron: [
		0,
		0,
		-10,
		-10,
		0,
		-10
	],
	weogonek: [
		0,
		0,
		-10,
		-10,
		0,
		-10
	],
	zo: [
		0,
		0,
		-15,
		-15
	],
	zoacute: [
		0,
		0,
		-15,
		-15
	],
	zocircumflex: [
		0,
		0,
		-15,
		-15
	],
	zodieresis: [
		0,
		0,
		-15,
		-15
	],
	zograve: [
		0,
		0,
		-15,
		-15
	],
	zohungarumlaut: [
		0,
		0,
		-15,
		-15
	],
	zomacron: [
		0,
		0,
		-15,
		-15
	],
	zoslash: [
		0,
		0,
		-15,
		-15
	],
	zotilde: [
		0,
		0,
		-15,
		-15
	],
	zacuteo: [
		0,
		0,
		-15,
		-15
	],
	zacuteoacute: [
		0,
		0,
		-15,
		-15
	],
	zacuteocircumflex: [
		0,
		0,
		-15,
		-15
	],
	zacuteodieresis: [
		0,
		0,
		-15,
		-15
	],
	zacuteograve: [
		0,
		0,
		-15,
		-15
	],
	zacuteohungarumlaut: [
		0,
		0,
		-15,
		-15
	],
	zacuteomacron: [
		0,
		0,
		-15,
		-15
	],
	zacuteoslash: [
		0,
		0,
		-15,
		-15
	],
	zacuteotilde: [
		0,
		0,
		-15,
		-15
	],
	zcarono: [
		0,
		0,
		-15,
		-15
	],
	zcaronoacute: [
		0,
		0,
		-15,
		-15
	],
	zcaronocircumflex: [
		0,
		0,
		-15,
		-15
	],
	zcaronodieresis: [
		0,
		0,
		-15,
		-15
	],
	zcaronograve: [
		0,
		0,
		-15,
		-15
	],
	zcaronohungarumlaut: [
		0,
		0,
		-15,
		-15
	],
	zcaronomacron: [
		0,
		0,
		-15,
		-15
	],
	zcaronoslash: [
		0,
		0,
		-15,
		-15
	],
	zcaronotilde: [
		0,
		0,
		-15,
		-15
	],
	zdotaccento: [
		0,
		0,
		-15,
		-15
	],
	zdotaccentoacute: [
		0,
		0,
		-15,
		-15
	],
	zdotaccentocircumflex: [
		0,
		0,
		-15,
		-15
	],
	zdotaccentodieresis: [
		0,
		0,
		-15,
		-15
	],
	zdotaccentograve: [
		0,
		0,
		-15,
		-15
	],
	zdotaccentohungarumlaut: [
		0,
		0,
		-15,
		-15
	],
	zdotaccentomacron: [
		0,
		0,
		-15,
		-15
	],
	zdotaccentoslash: [
		0,
		0,
		-15,
		-15
	],
	zdotaccentotilde: [
		0,
		0,
		-15,
		-15
	],
	Ap: [
		0,
		0,
		0,
		0,
		-25
	],
	Aquoteright: [
		0,
		0,
		0,
		0,
		-74,
		-74,
		-37,
		-111
	],
	Aacutep: [
		0,
		0,
		0,
		0,
		-25
	],
	Aacutequoteright: [
		0,
		0,
		0,
		0,
		-74,
		-74,
		-37,
		-111
	],
	Abrevep: [
		0,
		0,
		0,
		0,
		-25
	],
	Abrevequoteright: [
		0,
		0,
		0,
		0,
		-74,
		-74,
		-37,
		-111
	],
	Acircumflexp: [
		0,
		0,
		0,
		0,
		-25
	],
	Acircumflexquoteright: [
		0,
		0,
		0,
		0,
		-74,
		-74,
		-37,
		-111
	],
	Adieresisp: [
		0,
		0,
		0,
		0,
		-25
	],
	Adieresisquoteright: [
		0,
		0,
		0,
		0,
		-74,
		-74,
		-37,
		-111
	],
	Agravep: [
		0,
		0,
		0,
		0,
		-25
	],
	Agravequoteright: [
		0,
		0,
		0,
		0,
		-74,
		-74,
		-37,
		-111
	],
	Amacronp: [
		0,
		0,
		0,
		0,
		-25
	],
	Amacronquoteright: [
		0,
		0,
		0,
		0,
		-74,
		-74,
		-37,
		-111
	],
	Aogonekp: [
		0,
		0,
		0,
		0,
		-25
	],
	Aogonekquoteright: [
		0,
		0,
		0,
		0,
		-74,
		-74,
		-37,
		-111
	],
	Aringp: [
		0,
		0,
		0,
		0,
		-25
	],
	Aringquoteright: [
		0,
		0,
		0,
		0,
		-74,
		-74,
		-37,
		-111
	],
	Atildep: [
		0,
		0,
		0,
		0,
		-25
	],
	Atildequoteright: [
		0,
		0,
		0,
		0,
		-74,
		-74,
		-37,
		-111
	],
	Je: [
		0,
		0,
		0,
		0,
		-15,
		-40,
		-25
	],
	Jeacute: [
		0,
		0,
		0,
		0,
		-15,
		-40,
		-25
	],
	Jecaron: [
		0,
		0,
		0,
		0,
		-15,
		-40,
		-25
	],
	Jecircumflex: [
		0,
		0,
		0,
		0,
		-15,
		-40,
		-25
	],
	Jedieresis: [
		0,
		0,
		0,
		0,
		-15,
		-40,
		-25
	],
	Jedotaccent: [
		0,
		0,
		0,
		0,
		-15,
		-40,
		-25
	],
	Jegrave: [
		0,
		0,
		0,
		0,
		-15,
		-40,
		-25
	],
	Jemacron: [
		0,
		0,
		0,
		0,
		-15,
		-40,
		-25
	],
	Jeogonek: [
		0,
		0,
		0,
		0,
		-15,
		-40,
		-25
	],
	Jo: [
		0,
		0,
		0,
		0,
		-15,
		-40,
		-25
	],
	Joacute: [
		0,
		0,
		0,
		0,
		-15,
		-40,
		-25
	],
	Jocircumflex: [
		0,
		0,
		0,
		0,
		-15,
		-40,
		-25
	],
	Jodieresis: [
		0,
		0,
		0,
		0,
		-15,
		-40,
		-25
	],
	Jograve: [
		0,
		0,
		0,
		0,
		-15,
		-40,
		-25
	],
	Johungarumlaut: [
		0,
		0,
		0,
		0,
		-15,
		-40,
		-25
	],
	Jomacron: [
		0,
		0,
		0,
		0,
		-15,
		-40,
		-25
	],
	Joslash: [
		0,
		0,
		0,
		0,
		-15,
		-40,
		-25
	],
	Jotilde: [
		0,
		0,
		0,
		0,
		-15,
		-40,
		-25
	],
	NA: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NAacute: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NAbreve: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NAcircumflex: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NAdieresis: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NAgrave: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NAmacron: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NAogonek: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NAring: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NAtilde: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NacuteA: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NacuteAacute: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NacuteAbreve: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NacuteAcircumflex: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NacuteAdieresis: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NacuteAgrave: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NacuteAmacron: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NacuteAogonek: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NacuteAring: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NacuteAtilde: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NcaronA: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NcaronAacute: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NcaronAbreve: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NcaronAcircumflex: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NcaronAdieresis: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NcaronAgrave: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NcaronAmacron: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NcaronAogonek: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NcaronAring: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NcaronAtilde: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NcommaaccentA: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NcommaaccentAacute: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NcommaaccentAbreve: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NcommaaccentAcircumflex: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NcommaaccentAdieresis: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NcommaaccentAgrave: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NcommaaccentAmacron: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NcommaaccentAogonek: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NcommaaccentAring: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NcommaaccentAtilde: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NtildeA: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NtildeAacute: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NtildeAbreve: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NtildeAcircumflex: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NtildeAdieresis: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NtildeAgrave: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NtildeAmacron: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NtildeAogonek: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NtildeAring: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	NtildeAtilde: [
		0,
		0,
		0,
		0,
		-20,
		-30,
		-27,
		-35
	],
	Ti: [
		0,
		0,
		0,
		0,
		-18,
		-37,
		-55,
		-35
	],
	Tiacute: [
		0,
		0,
		0,
		0,
		-18,
		-37,
		-55,
		-35
	],
	Tiogonek: [
		0,
		0,
		0,
		0,
		-18,
		-37,
		-55,
		-35
	],
	Tcaroni: [
		0,
		0,
		0,
		0,
		-18,
		-37,
		-55,
		-35
	],
	Tcaroniacute: [
		0,
		0,
		0,
		0,
		-18,
		-37,
		-55,
		-35
	],
	Tcaroniogonek: [
		0,
		0,
		0,
		0,
		-18,
		-37,
		-55,
		-35
	],
	Tcommaaccenti: [
		0,
		0,
		0,
		0,
		-18,
		-37,
		-55,
		-35
	],
	Tcommaaccentiacute: [
		0,
		0,
		0,
		0,
		-18,
		-37,
		-55,
		-35
	],
	Tcommaaccentiogonek: [
		0,
		0,
		0,
		0,
		-18,
		-37,
		-55,
		-35
	],
	Vi: [
		0,
		0,
		0,
		0,
		-37,
		-55,
		-74,
		-60
	],
	Viacute: [
		0,
		0,
		0,
		0,
		-37,
		-55,
		-74,
		-60
	],
	Vicircumflex: [
		0,
		0,
		0,
		0,
		-37,
		0,
		-34,
		-20
	],
	Vidieresis: [
		0,
		0,
		0,
		0,
		-37,
		0,
		-34,
		-20
	],
	Vigrave: [
		0,
		0,
		0,
		0,
		-37,
		0,
		-34,
		-20
	],
	Vimacron: [
		0,
		0,
		0,
		0,
		-37,
		0,
		-34,
		-20
	],
	Viogonek: [
		0,
		0,
		0,
		0,
		-37,
		-55,
		-74,
		-60
	],
	Wi: [
		0,
		0,
		0,
		0,
		-18,
		-37,
		-55,
		-40
	],
	Wiacute: [
		0,
		0,
		0,
		0,
		-18,
		-37,
		-55,
		-40
	],
	Wiogonek: [
		0,
		0,
		0,
		0,
		-18,
		-37,
		-55,
		-40
	],
	fi: [
		0,
		0,
		0,
		0,
		-25,
		0,
		-20,
		-20
	],
	gperiod: [
		0,
		0,
		0,
		0,
		-15,
		0,
		-15
	],
	gbreveperiod: [
		0,
		0,
		0,
		0,
		-15,
		0,
		-15
	],
	gcommaaccentperiod: [
		0,
		0,
		0,
		0,
		-15,
		0,
		-15
	],
	iv: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-25
	],
	iacutev: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-25
	],
	icircumflexv: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-25
	],
	idieresisv: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-25
	],
	igravev: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-25
	],
	imacronv: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-25
	],
	iogonekv: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-25
	],
	ky: [
		0,
		0,
		0,
		0,
		-15,
		0,
		-10,
		-15
	],
	kyacute: [
		0,
		0,
		0,
		0,
		-15,
		0,
		-10,
		-15
	],
	kydieresis: [
		0,
		0,
		0,
		0,
		-15,
		0,
		-10,
		-15
	],
	kcommaaccenty: [
		0,
		0,
		0,
		0,
		-15,
		0,
		-10,
		-15
	],
	kcommaaccentyacute: [
		0,
		0,
		0,
		0,
		-15,
		0,
		-10,
		-15
	],
	kcommaaccentydieresis: [
		0,
		0,
		0,
		0,
		-15,
		0,
		-10,
		-15
	],
	quotedblleftA: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-80
	],
	quotedblleftAacute: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-80
	],
	quotedblleftAbreve: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-80
	],
	quotedblleftAcircumflex: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-80
	],
	quotedblleftAdieresis: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-80
	],
	quotedblleftAgrave: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-80
	],
	quotedblleftAmacron: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-80
	],
	quotedblleftAogonek: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-80
	],
	quotedblleftAring: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-80
	],
	quotedblleftAtilde: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-80
	],
	quoteleftA: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-80
	],
	quoteleftAacute: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-80
	],
	quoteleftAbreve: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-80
	],
	quoteleftAcircumflex: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-80
	],
	quoteleftAdieresis: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-80
	],
	quoteleftAgrave: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-80
	],
	quoteleftAmacron: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-80
	],
	quoteleftAogonek: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-80
	],
	quoteleftAring: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-80
	],
	quoteleftAtilde: [
		0,
		0,
		0,
		0,
		-10,
		0,
		0,
		-80
	],
	re: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	reacute: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	recaron: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	recircumflex: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	redieresis: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	redotaccent: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	regrave: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	remacron: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	reogonek: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	racutee: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	racuteeacute: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	racuteecaron: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	racuteecircumflex: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	racuteedieresis: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	racuteedotaccent: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	racuteegrave: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	racuteemacron: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	racuteeogonek: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	rcarone: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	rcaroneacute: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	rcaronecaron: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	rcaronecircumflex: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	rcaronedieresis: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	rcaronedotaccent: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	rcaronegrave: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	rcaronemacron: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	rcaroneogonek: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	rcommaaccente: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	rcommaaccenteacute: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	rcommaaccentecaron: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	rcommaaccentecircumflex: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	rcommaaccentedieresis: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	rcommaaccentedotaccent: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	rcommaaccentegrave: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	rcommaaccentemacron: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	rcommaaccenteogonek: [
		0,
		0,
		0,
		0,
		-18,
		0,
		-37
	],
	spaceA: [
		0,
		0,
		0,
		0,
		-55,
		-37,
		-18,
		-55
	],
	spaceAacute: [
		0,
		0,
		0,
		0,
		-55,
		-37,
		-18,
		-55
	],
	spaceAbreve: [
		0,
		0,
		0,
		0,
		-55,
		-37,
		-18,
		-55
	],
	spaceAcircumflex: [
		0,
		0,
		0,
		0,
		-55,
		-37,
		-18,
		-55
	],
	spaceAdieresis: [
		0,
		0,
		0,
		0,
		-55,
		-37,
		-18,
		-55
	],
	spaceAgrave: [
		0,
		0,
		0,
		0,
		-55,
		-37,
		-18,
		-55
	],
	spaceAmacron: [
		0,
		0,
		0,
		0,
		-55,
		-37,
		-18,
		-55
	],
	spaceAogonek: [
		0,
		0,
		0,
		0,
		-55,
		-37,
		-18,
		-55
	],
	spaceAring: [
		0,
		0,
		0,
		0,
		-55,
		-37,
		-18,
		-55
	],
	spaceAtilde: [
		0,
		0,
		0,
		0,
		-55,
		-37,
		-18,
		-55
	],
	Fi: [
		0,
		0,
		0,
		0,
		0,
		-40,
		-45
	],
	Fiacute: [
		0,
		0,
		0,
		0,
		0,
		-40,
		-45
	],
	Ficircumflex: [
		0,
		0,
		0,
		0,
		0,
		-40,
		-45
	],
	Fidieresis: [
		0,
		0,
		0,
		0,
		0,
		-40,
		-45
	],
	Figrave: [
		0,
		0,
		0,
		0,
		0,
		-40,
		-45
	],
	Fimacron: [
		0,
		0,
		0,
		0,
		0,
		-40,
		-45
	],
	Fiogonek: [
		0,
		0,
		0,
		0,
		0,
		-40,
		-45
	],
	eb: [
		0,
		0,
		0,
		0,
		0,
		-10
	],
	eacuteb: [
		0,
		0,
		0,
		0,
		0,
		-10
	],
	ecaronb: [
		0,
		0,
		0,
		0,
		0,
		-10
	],
	ecircumflexb: [
		0,
		0,
		0,
		0,
		0,
		-10
	],
	edieresisb: [
		0,
		0,
		0,
		0,
		0,
		-10
	],
	edotaccentb: [
		0,
		0,
		0,
		0,
		0,
		-10
	],
	egraveb: [
		0,
		0,
		0,
		0,
		0,
		-10
	],
	emacronb: [
		0,
		0,
		0,
		0,
		0,
		-10
	],
	eogonekb: [
		0,
		0,
		0,
		0,
		0,
		-10
	],
	ff: [
		0,
		0,
		0,
		0,
		0,
		-18,
		-18,
		-25
	],
	quoterightt: [
		0,
		0,
		0,
		0,
		0,
		-37,
		-30,
		-18
	],
	quoterighttcommaaccent: [
		0,
		0,
		0,
		0,
		0,
		-37,
		-30,
		-18
	],
	Yicircumflex: [
		0,
		0,
		0,
		0,
		0,
		0,
		-34
	],
	Yidieresis: [
		0,
		0,
		0,
		0,
		0,
		0,
		-34
	],
	Yigrave: [
		0,
		0,
		0,
		0,
		0,
		0,
		-34
	],
	Yimacron: [
		0,
		0,
		0,
		0,
		0,
		0,
		-34
	],
	Yacuteicircumflex: [
		0,
		0,
		0,
		0,
		0,
		0,
		-34
	],
	Yacuteidieresis: [
		0,
		0,
		0,
		0,
		0,
		0,
		-34
	],
	Yacuteigrave: [
		0,
		0,
		0,
		0,
		0,
		0,
		-34
	],
	Yacuteimacron: [
		0,
		0,
		0,
		0,
		0,
		0,
		-34
	],
	Ydieresisicircumflex: [
		0,
		0,
		0,
		0,
		0,
		0,
		-34
	],
	Ydieresisidieresis: [
		0,
		0,
		0,
		0,
		0,
		0,
		-34
	],
	Ydieresisigrave: [
		0,
		0,
		0,
		0,
		0,
		0,
		-34
	],
	Ydieresisimacron: [
		0,
		0,
		0,
		0,
		0,
		0,
		-34
	],
	eg: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	egbreve: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	egcommaaccent: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	eacuteg: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	eacutegbreve: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	eacutegcommaaccent: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	ecarong: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	ecarongbreve: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	ecarongcommaaccent: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	ecircumflexg: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	ecircumflexgbreve: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	ecircumflexgcommaaccent: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	edieresisg: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	edieresisgbreve: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	edieresisgcommaaccent: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	edotaccentg: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	edotaccentgbreve: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	edotaccentgcommaaccent: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	egraveg: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	egravegbreve: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	egravegcommaaccent: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	emacrong: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	emacrongbreve: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	emacrongcommaaccent: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	eogonekg: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	eogonekgbreve: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	eogonekgcommaaccent: [
		0,
		0,
		0,
		0,
		0,
		0,
		-40,
		-15
	],
	fiogonek: [
		0,
		0,
		0,
		0,
		0,
		0,
		-20
	],
	gcomma: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	gbrevecomma: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	gcommaaccentcomma: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	og: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	ogbreve: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	ogcommaaccent: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	oacuteg: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	oacutegbreve: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	oacutegcommaaccent: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	ocircumflexg: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	ocircumflexgbreve: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	ocircumflexgcommaaccent: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	odieresisg: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	odieresisgbreve: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	odieresisgcommaaccent: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	ograveg: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	ogravegbreve: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	ogravegcommaaccent: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	ohungarumlautg: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	ohungarumlautgbreve: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	ohungarumlautgcommaaccent: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	omacrong: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	omacrongbreve: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	omacrongcommaaccent: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	otildeg: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	otildegbreve: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	otildegcommaaccent: [
		0,
		0,
		0,
		0,
		0,
		0,
		-10
	],
	fiacute: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-20
	],
	ga: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gaacute: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gabreve: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gacircumflex: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gadieresis: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gagrave: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gamacron: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gaogonek: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	garing: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gatilde: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gbrevea: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gbreveaacute: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gbreveabreve: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gbreveacircumflex: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gbreveadieresis: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gbreveagrave: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gbreveamacron: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gbreveaogonek: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gbrevearing: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gbreveatilde: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gcommaaccenta: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gcommaaccentaacute: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gcommaaccentabreve: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gcommaaccentacircumflex: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gcommaaccentadieresis: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gcommaaccentagrave: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gcommaaccentamacron: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gcommaaccentaogonek: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gcommaaccentaring: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	],
	gcommaaccentatilde: [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		-5
	]
};
var data = {
	attributes: attributes,
	glyphWidths: glyphWidths,
	kernPairs: kernPairs
};

var initFont = function initFont(font) {
  return [font.FontName, {
    attributes: font,
    glyphWidths: {},
    kernPairs: {}
  }];
};

var expandData = function expandData(data) {
  var attributes = data.attributes,
      glyphWidths = data.glyphWidths,
      kernPairs = data.kernPairs;
  var fonts = attributes.map(initFont);
  Object.keys(glyphWidths).forEach(function (key) {
    glyphWidths[key].forEach(function (value, index) {
      if (value) fonts[index][1].glyphWidths[key] = value;
    });
  });
  Object.keys(kernPairs).forEach(function (key) {
    kernPairs[key].forEach(function (value, index) {
      if (value) fonts[index][1].kernPairs[key] = value;
    });
  });
  return Object.fromEntries(fonts);
};

var STANDARD_FONTS = expandData(data);

var createStandardFont = function createStandardFont(PDFFont) {
  return /*#__PURE__*/function (_PDFFont) {
    (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z)(StandardFont, _PDFFont);

    function StandardFont(document, name, id) {
      var _this;

      _this = _PDFFont.call(this) || this;
      _this.document = document;
      _this.name = name;
      _this.id = id;
      _this.font = AFMFont.fromJson(STANDARD_FONTS[_this.name]);
      _this.ascender = _this.font.ascender;
      _this.descender = _this.font.descender;
      _this.bbox = _this.font.bbox;
      _this.lineGap = _this.font.lineGap;
      return _this;
    }

    var _proto = StandardFont.prototype;

    _proto.embed = function embed() {
      this.dictionary.data = {
        Type: 'Font',
        BaseFont: this.name,
        Subtype: 'Type1',
        Encoding: 'WinAnsiEncoding'
      };
      return this.dictionary.end();
    };

    _proto.encode = function encode(text) {
      var encoded = this.font.encodeText(text);
      var glyphs = this.font.glyphsForString("" + text);
      var advances = this.font.advancesForGlyphs(glyphs);
      var positions = [];

      for (var i = 0; i < glyphs.length; i++) {
        var glyph = glyphs[i];
        positions.push({
          xAdvance: advances[i],
          yAdvance: 0,
          xOffset: 0,
          yOffset: 0,
          advanceWidth: this.font.widthOfGlyph(glyph)
        });
      }

      return [encoded, positions];
    };

    _proto.encodeGlyphs = function encodeGlyphs(glyphs) {
      var res = [];

      for (var _i = 0, _Array$from = Array.from(glyphs); _i < _Array$from.length; _i++) {
        var glyph = _Array$from[_i];
        res.push(("00" + glyph.id.toString(16)).slice(-2));
      }

      return res;
    };

    _proto.widthOfString = function widthOfString(string, size) {
      var glyphs = this.font.glyphsForString("" + string);
      var advances = this.font.advancesForGlyphs(glyphs);
      var width = 0;

      for (var _i2 = 0, _Array$from2 = Array.from(advances); _i2 < _Array$from2.length; _i2++) {
        var advance = _Array$from2[_i2];
        width += advance;
      }

      var scale = size / 1000;
      return width * scale;
    };

    StandardFont.isStandardFont = function isStandardFont(name) {
      return name in STANDARD_FONTS;
    };

    return StandardFont;
  }(PDFFont);
};

var toHex = function toHex() {
  for (var _len = arguments.length, codePoints = new Array(_len), _key = 0; _key < _len; _key++) {
    codePoints[_key] = arguments[_key];
  }

  var codes = Array.from(codePoints).map(function (code) {
    return ("0000" + code.toString(16)).slice(-4);
  });
  return codes.join('');
};

var createEmbeddedFont = function createEmbeddedFont(PDFFont) {
  return /*#__PURE__*/function (_PDFFont) {
    (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z)(EmbeddedFont, _PDFFont);

    function EmbeddedFont(document, font, id) {
      var _this;

      _this = _PDFFont.call(this) || this;
      _this.document = document;
      _this.font = font;
      _this.id = id;
      _this.subset = _this.font.createSubset();
      _this.unicode = [[0]];
      _this.widths = [_this.font.getGlyph(0).advanceWidth];
      _this.name = _this.font.postscriptName;
      _this.scale = 1000 / _this.font.unitsPerEm;
      _this.ascender = _this.font.ascent * _this.scale;
      _this.descender = _this.font.descent * _this.scale;
      _this.xHeight = _this.font.xHeight * _this.scale;
      _this.capHeight = _this.font.capHeight * _this.scale;
      _this.lineGap = _this.font.lineGap * _this.scale;
      _this.bbox = _this.font.bbox;
      _this.layoutCache = Object.create(null);
      return _this;
    }

    var _proto = EmbeddedFont.prototype;

    _proto.layoutRun = function layoutRun(text, features) {
      var run = this.font.layout(text, features); // Normalize position values

      for (var i = 0; i < run.positions.length; i++) {
        var position = run.positions[i];

        for (var key in position) {
          position[key] *= this.scale;
        }

        position.advanceWidth = run.glyphs[i].advanceWidth * this.scale;
      }

      return run;
    };

    _proto.layoutCached = function layoutCached(text) {
      var cached;

      if (cached = this.layoutCache[text]) {
        return cached;
      }

      var run = this.layoutRun(text);
      this.layoutCache[text] = run;
      return run;
    };

    _proto.layout = function layout(text, features, onlyWidth) {
      // Skip the cache if any user defined features are applied
      if (onlyWidth == null) {
        onlyWidth = false;
      }

      if (features) {
        return this.layoutRun(text, features);
      }

      var glyphs = onlyWidth ? null : [];
      var positions = onlyWidth ? null : [];
      var advanceWidth = 0; // Split the string by words to increase cache efficiency.
      // For this purpose, spaces and tabs are a good enough delimeter.

      var last = 0;
      var index = 0;

      while (index <= text.length) {
        var needle;

        if (index === text.length && last < index || (needle = text.charAt(index), [' ', '\t'].includes(needle))) {
          var run = this.layoutCached(text.slice(last, ++index));

          if (!onlyWidth) {
            glyphs.push.apply(glyphs, Array.from(run.glyphs || []));
            positions.push.apply(positions, Array.from(run.positions || []));
          }

          advanceWidth += run.advanceWidth;
          last = index;
        } else {
          index++;
        }
      }

      return {
        glyphs: glyphs,
        positions: positions,
        advanceWidth: advanceWidth
      };
    };

    _proto.encode = function encode(text, features) {
      var _this$layout = this.layout(text, features),
          glyphs = _this$layout.glyphs,
          positions = _this$layout.positions;

      var res = [];

      for (var i = 0; i < glyphs.length; i++) {
        var glyph = glyphs[i];
        var gid = this.subset.includeGlyph(glyph.id);
        res.push(("0000" + gid.toString(16)).slice(-4));

        if (this.widths[gid] == null) {
          this.widths[gid] = glyph.advanceWidth * this.scale;
        }

        if (this.unicode[gid] == null) {
          this.unicode[gid] = this.font._cmapProcessor.codePointsForGlyph(glyph.id);
        }
      }

      return [res, positions];
    };

    _proto.encodeGlyphs = function encodeGlyphs(glyphs) {
      var res = [];

      for (var i = 0; i < glyphs.length; i++) {
        var glyph = glyphs[i];
        var gid = this.subset.includeGlyph(glyph.id);
        res.push(("0000" + gid.toString(16)).slice(-4));

        if (this.widths[gid] == null) {
          this.widths[gid] = glyph.advanceWidth * this.scale;
        }

        if (this.unicode[gid] == null) {
          this.unicode[gid] = this.font._cmapProcessor.codePointsForGlyph(glyph.id);
        }
      }

      return res;
    };

    _proto.widthOfString = function widthOfString(string, size, features) {
      var width = this.layout(string, features, true).advanceWidth;
      var scale = size / 1000;
      return width * scale;
    };

    _proto.embed = function embed() {
      var isCFF = this.subset.cff != null;
      var fontFile = this.document.ref();

      if (isCFF) {
        fontFile.data.Subtype = 'CIDFontType0C';
      }

      fontFile.end(this.subset.encode());
      var familyClass = ((this.font['OS/2'] != null ? this.font['OS/2'].sFamilyClass : undefined) || 0) >> 8;
      var flags = 0;

      if (this.font.post.isFixedPitch) {
        flags |= 1 << 0;
      }

      if (1 <= familyClass && familyClass <= 7) {
        flags |= 1 << 1;
      }

      flags |= 1 << 2; // assume the font uses non-latin characters

      if (familyClass === 10) {
        flags |= 1 << 3;
      }

      if (this.font.head.macStyle.italic) {
        flags |= 1 << 6;
      } // generate a random tag (6 uppercase letters. 65 is the char code for 'A')


      var tag = [0, 1, 2, 3, 4, 5].map(function (i) {
        return String.fromCharCode(Math.random() * 26 + 65);
      }).join('');
      var name = tag + '+' + this.font.postscriptName;
      var bbox = this.font.bbox;
      var descriptor = this.document.ref({
        Type: 'FontDescriptor',
        FontName: name,
        Flags: flags,
        FontBBox: [bbox.minX * this.scale, bbox.minY * this.scale, bbox.maxX * this.scale, bbox.maxY * this.scale],
        ItalicAngle: this.font.italicAngle,
        Ascent: this.ascender,
        Descent: this.descender,
        CapHeight: (this.font.capHeight || this.font.ascent) * this.scale,
        XHeight: (this.font.xHeight || 0) * this.scale,
        StemV: 0
      }); // not sure how to calculate this

      if (isCFF) {
        descriptor.data.FontFile3 = fontFile;
      } else {
        descriptor.data.FontFile2 = fontFile;
      }

      descriptor.end();
      var descendantFont = this.document.ref({
        Type: 'Font',
        Subtype: isCFF ? 'CIDFontType0' : 'CIDFontType2',
        BaseFont: name,
        CIDSystemInfo: {
          Registry: new String('Adobe'),
          Ordering: new String('Identity'),
          Supplement: 0
        },
        FontDescriptor: descriptor,
        W: [0, this.widths]
      });
      descendantFont.end();
      this.dictionary.data = {
        Type: 'Font',
        Subtype: 'Type0',
        BaseFont: name,
        Encoding: 'Identity-H',
        DescendantFonts: [descendantFont],
        ToUnicode: this.toUnicodeCmap()
      };
      return this.dictionary.end();
    } // Maps the glyph ids encoded in the PDF back to unicode strings
    // Because of ligature substitutions and the like, there may be one or more
    // unicode characters represented by each glyph.
    ;

    _proto.toUnicodeCmap = function toUnicodeCmap() {
      var cmap = this.document.ref();
      var entries = [];

      for (var _i = 0, _Array$from = Array.from(this.unicode); _i < _Array$from.length; _i++) {
        var codePoints = _Array$from[_i];
        var encoded = [];

        for (var _i2 = 0, _Array$from2 = Array.from(codePoints); _i2 < _Array$from2.length; _i2++) {
          var value = _Array$from2[_i2];

          if (value > 0xffff) {
            value -= 0x10000;
            encoded.push(toHex(value >>> 10 & 0x3ff | 0xd800));
            value = 0xdc00 | value & 0x3ff;
          }

          encoded.push(toHex(value));
          entries.push("<" + encoded.join(' ') + ">");
        }
      }

      cmap.end("  /CIDInit /ProcSet findresource begin\n  12 dict begin\n  begincmap\n  /CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n  >> def\n  /CMapName /Adobe-Identity-UCS def\n  /CMapType 2 def\n  1 begincodespacerange\n  <0000><ffff>\n  endcodespacerange\n  1 beginbfrange\n  <0000> <" + toHex(entries.length - 1) + "> [" + entries.join(' ') + "]\n  endbfrange\n  endcmap\n  CMapName currentdict /CMap defineresource pop\n  end\n  end  ");
      return cmap;
    };

    return EmbeddedFont;
  }(PDFFont);
};

var PDFFont = /*#__PURE__*/function () {
  function PDFFont() {}

  PDFFont.open = function open(document, src, family, id) {
    var font;

    if (typeof src === 'string') {
      if (StandardFont.isStandardFont(src)) {
        return new StandardFont(document, src, id);
      }

      {
        throw new Error("Can't open " + src + " in browser build");
      }
    } else if (src instanceof Uint8Array) {
      font = fontkit__WEBPACK_IMPORTED_MODULE_5__/* .create */ .Ue(src, family);
    } else if (src instanceof ArrayBuffer) {
      font = fontkit__WEBPACK_IMPORTED_MODULE_5__/* .create */ .Ue(new Uint8Array(src), family);
    } else if (typeof src === 'object') {
      font = src;
    }

    if (font == null) {
      throw new Error('Not a supported font format or standard PDF font.');
    }

    return new EmbeddedFont(document, font, id);
  };

  var _proto = PDFFont.prototype;

  _proto.encode = function encode() {
    throw new Error('Must be implemented by subclasses');
  };

  _proto.widthOfString = function widthOfString() {
    throw new Error('Must be implemented by subclasses');
  };

  _proto.ref = function ref() {
    return this.dictionary != null ? this.dictionary : this.dictionary = this.document.ref();
  };

  _proto.finalize = function finalize() {
    if (this.embedded || this.dictionary == null) {
      return;
    }

    this.embed();
    return this.embedded = true;
  };

  _proto.embed = function embed() {
    throw new Error('Must be implemented by subclasses');
  };

  _proto.lineHeight = function lineHeight(size, includeGap) {
    if (includeGap == null) {
      includeGap = false;
    }

    var gap = includeGap ? this.lineGap : 0;
    return (this.ascender + gap - this.descender) / 1000 * size;
  };

  return PDFFont;
}();
var StandardFont = createStandardFont(PDFFont);
var EmbeddedFont = createEmbeddedFont(PDFFont);

var FontsMixin = {
  initFonts: function initFonts() {
    // Lookup table for embedded fonts
    this._fontFamilies = {};
    this._fontCount = 0; // Font state

    this._fontSize = 12;
    this._font = null;
    this._registeredFonts = {}; // Set the default font

    return this.font('Helvetica');
  },
  font: function font(src, family, size) {
    var cacheKey, font;

    if (typeof family === 'number') {
      size = family;
      family = null;
    } // check registered fonts if src is a string


    if (typeof src === 'string' && this._registeredFonts[src]) {
      cacheKey = src;
      var _this$_registeredFont = this._registeredFonts[src];
      src = _this$_registeredFont.src;
      family = _this$_registeredFont.family;
    } else {
      cacheKey = family || src;

      if (typeof cacheKey !== 'string') {
        cacheKey = null;
      }
    }

    if (size != null) {
      this.fontSize(size);
    } // fast path: check if the font is already in the PDF


    if (font = this._fontFamilies[cacheKey]) {
      this._font = font;
      return this;
    } // load the font


    var id = "F" + ++this._fontCount;
    this._font = PDFFont.open(this, src, family, id); // check for existing font familes with the same name already in the PDF
    // useful if the font was passed as a buffer

    if (font = this._fontFamilies[this._font.name]) {
      this._font = font;
      return this;
    } // save the font for reuse later


    if (cacheKey) {
      this._fontFamilies[cacheKey] = this._font;
    }

    if (this._font.name) {
      this._fontFamilies[this._font.name] = this._font;
    }

    return this;
  },
  fontSize: function fontSize(_fontSize) {
    this._fontSize = _fontSize;
    return this;
  },
  currentLineHeight: function currentLineHeight(includeGap) {
    if (includeGap == null) {
      includeGap = false;
    }

    return this._font.lineHeight(this._fontSize, includeGap);
  },
  registerFont: function registerFont(name, src, family) {
    this._registeredFonts[name] = {
      src: src,
      family: family
    };
    return this;
  }
};

var number = PDFObject$1.number;
var TextMixin = {
  initText: function initText() {
    this._line = this._line.bind(this); // Current coordinates

    this.x = 0;
    this.y = 0;
    return this._lineGap = 0;
  },
  _text: function _text(text, x, y, options, lineCallback) {
    var _this = this;

    options = this._initOptions(x, y, options); // Convert text to a string

    text = text == null ? '' : "" + text; // if the wordSpacing option is specified, remove multiple consecutive spaces

    if (options.wordSpacing) {
      text = text.replace(/\s{2,}/g, ' ');
    }

    var addStructure = function addStructure() {
      if (options.structParent) {
        options.structParent.add(_this.struct(options.structType || 'P', [_this.markStructureContent(options.structType || 'P')]));
      }
    };

    for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(text.split('\n')), _step; !(_step = _iterator()).done;) {
      var line = _step.value;
      addStructure();
      lineCallback(line, options);
    }

    return this;
  },
  text: function text(_text2, x, y, options) {
    return this._text(_text2, x, y, options, this._line);
  },
  widthOfString: function widthOfString(string, options) {
    if (options === void 0) {
      options = {};
    }

    return this._font.widthOfString(string, this._fontSize, options.features) + (options.characterSpacing || 0) * (string.length - 1);
  },
  _initOptions: function _initOptions(x, y, options) {
    if (x === void 0) {
      x = {};
    }

    if (options === void 0) {
      options = {};
    }

    if (typeof x === 'object') {
      options = x;
      x = null;
    } // clone options object


    var result = Object.assign({}, options); // extend options with previous values for continued text

    if (this._textOptions) {
      for (var key in this._textOptions) {
        var val = this._textOptions[key];

        if (key !== 'continued') {
          if (result[key] === undefined) {
            result[key] = val;
          }
        }
      }
    } // Update the current position


    if (x != null) {
      this.x = x;
    }

    if (y != null) {
      this.y = y;
    } // wrap to margins if no x or y position passed


    if (result.lineBreak !== false) {
      if (result.width == null) {
        result.width = this.page.width - this.x - this.page.margins.right;
      }

      result.width = Math.max(result.width, 0);
    }

    if (!result.columns) {
      result.columns = 0;
    }

    if (result.columnGap == null) {
      result.columnGap = 18;
    } // 1/4 inch


    return result;
  },
  _line: function _line(text, options) {
    if (options === void 0) {
      options = {};
    }

    this._fragment(text, this.x, this.y, options);

    return this.x += this.widthOfString(text);
  },
  _fragment: function _fragment(text, x, y, options) {
    text = ("" + text).replace(/\n/g, '');
    if (text.length === 0) return;

    var _this$_font$encode = this._font.encode(text, options.features),
        encoded = _this$_font$encode[0],
        positions = _this$_font$encode[1];

    var dy = this._font.ascender / 1000 * this._fontSize;

    this._glyphs(encoded, positions, x, y + dy, options);
  },
  _glyphs: function _glyphs(encoded, positions, x, y, options) {
    var _this2 = this;

    var commands = [];
    var scale = this._fontSize / 1000;
    var i;
    var last = 0;
    var hadOffset = false;
    this.save(); // flip coordinate system

    this.transform(1, 0, 0, -1, 0, this.page.height);
    y = this.page.height - y; // add current font to page if necessary

    if (this.page.fonts[this._font.id] == null) {
      this.page.fonts[this._font.id] = this._font.ref();
    } // begin the text object


    this.addContent('BT'); // text position

    this.addContent("1 0 0 1 " + number(x) + " " + number(y) + " Tm"); // font and font size

    this.addContent("/" + this._font.id + " " + number(this._fontSize) + " Tf"); // rendering mode

    var mode = options.fill && options.stroke ? 2 : options.stroke ? 1 : 0;

    if (mode) {
      this.addContent(mode + " Tr");
    } // Adds a segment of text to the TJ command buffer


    var addSegment = function addSegment(cur) {
      if (last < cur) {
        var hex = encoded.slice(last, cur).join('');
        var advance = positions[cur - 1].xAdvance - positions[cur - 1].advanceWidth;
        commands.push("<" + hex + "> " + number(-advance));
      }

      return last = cur;
    }; // Flushes the current TJ commands to the output stream


    var flush = function flush(i) {
      addSegment(i);

      if (commands.length > 0) {
        _this2.addContent("[" + commands.join(' ') + "] TJ");

        return commands.length = 0;
      }
    };

    for (i = 0; i < positions.length; i++) {
      // If we have an x or y offset, we have to break out of the current TJ command
      // so we can move the text position.
      var pos = positions[i];

      if (pos.xOffset || pos.yOffset) {
        // Flush the current buffer
        flush(i); // Move the text position and flush just the current character

        this.addContent("1 0 0 1 " + number(x + pos.xOffset * scale) + " " + number(y + pos.yOffset * scale) + " Tm");
        flush(i + 1);
        hadOffset = true;
      } else {
        // If the last character had an offset, reset the text position
        if (hadOffset) {
          this.addContent("1 0 0 1 " + number(x) + " " + number(y) + " Tm");
          hadOffset = false;
        } // Group segments that don't have any advance adjustments


        if (pos.xAdvance - pos.advanceWidth !== 0) {
          addSegment(i + 1);
        }
      }

      x += pos.xAdvance * scale;
    } // Flush any remaining commands


    flush(i); // end the text object

    this.addContent('ET'); // restore flipped coordinate system

    return this.restore();
  }
};

var MARKERS = [0xffc0, 0xffc1, 0xffc2, 0xffc3, 0xffc5, 0xffc6, 0xffc7, 0xffc8, 0xffc9, 0xffca, 0xffcb, 0xffcc, 0xffcd, 0xffce, 0xffcf];

var JPEG = /*#__PURE__*/function () {
  function JPEG(data, label) {
    var marker;
    this.data = data;
    this.label = label;

    if (this.data.readUInt16BE(0) !== 0xffd8) {
      throw 'SOI not found in JPEG';
    }

    var pos = 2;

    while (pos < this.data.length) {
      marker = this.data.readUInt16BE(pos);
      pos += 2;

      if (Array.from(MARKERS).includes(marker)) {
        break;
      }

      pos += this.data.readUInt16BE(pos);
    }

    if (!Array.from(MARKERS).includes(marker)) {
      throw 'Invalid JPEG.';
    }

    pos += 2;
    this.bits = this.data[pos++];
    this.height = this.data.readUInt16BE(pos);
    pos += 2;
    this.width = this.data.readUInt16BE(pos);
    pos += 2;
    var channels = this.data[pos++];

    this.colorSpace = function () {
      switch (channels) {
        case 1:
          return 'DeviceGray';

        case 3:
          return 'DeviceRGB';

        case 4:
          return 'DeviceCMYK';
      }
    }();

    this.obj = null;
  }

  var _proto = JPEG.prototype;

  _proto.embed = function embed(document) {
    if (this.obj) {
      return;
    }

    this.obj = document.ref({
      Type: 'XObject',
      Subtype: 'Image',
      BitsPerComponent: this.bits,
      Width: this.width,
      Height: this.height,
      ColorSpace: this.colorSpace,
      Filter: 'DCTDecode'
    }); // add extra decode params for CMYK images. By swapping the
    // min and max values from the default, we invert the colors. See
    // section 4.8.4 of the spec.

    if (this.colorSpace === 'DeviceCMYK') {
      this.obj.data['Decode'] = [1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0];
    }

    this.obj.end(this.data); // free memory

    this.data = null;
  };

  return JPEG;
}();

var PNGImage = /*#__PURE__*/function () {
  function PNGImage(data, label) {
    this.label = label;
    this.image = new _react_pdf_png_js__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z(data);
    this.width = this.image.width;
    this.height = this.image.height;
    this.imgData = this.image.imgData;
    this.obj = null;
  }

  var _proto = PNGImage.prototype;

  _proto.embed = function embed(document) {
    var dataDecoded = false;
    this.document = document;
    if (this.obj) return;
    var hasAlphaChannel = this.image.hasAlphaChannel;
    var isInterlaced = this.image.interlaceMethod === 1;
    this.obj = this.document.ref({
      Type: 'XObject',
      Subtype: 'Image',
      BitsPerComponent: hasAlphaChannel ? 8 : this.image.bits,
      Width: this.width,
      Height: this.height,
      Filter: 'FlateDecode'
    });

    if (!hasAlphaChannel) {
      var params = this.document.ref({
        Predictor: isInterlaced ? 1 : 15,
        Colors: this.image.colors,
        BitsPerComponent: this.image.bits,
        Columns: this.width
      });
      this.obj.data['DecodeParms'] = params;
      params.end();
    }

    if (this.image.palette.length === 0) {
      this.obj.data['ColorSpace'] = this.image.colorSpace;
    } else {
      // embed the color palette in the PDF as an object stream
      var palette = this.document.ref();
      palette.end(Buffer$4.from(this.image.palette)); // build the color space array for the image

      this.obj.data['ColorSpace'] = ['Indexed', 'DeviceRGB', this.image.palette.length / 3 - 1, palette];
    } // For PNG color types 0, 2 and 3, the transparency data is stored in
    // a dedicated PNG chunk.


    if (this.image.transparency.grayscale != null) {
      // Use Color Key Masking (spec section 4.8.5)
      // An array with N elements, where N is two times the number of color components.
      var val = this.image.transparency.grayscale;
      this.obj.data['Mask'] = [val, val];
    } else if (this.image.transparency.rgb) {
      // Use Color Key Masking (spec section 4.8.5)
      // An array with N elements, where N is two times the number of color components.
      var rgb = this.image.transparency.rgb;
      var mask = [];

      for (var _iterator = (0,_babel_runtime_helpers_createForOfIteratorHelperLoose__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(rgb), _step; !(_step = _iterator()).done;) {
        var x = _step.value;
        mask.push(x, x);
      }

      this.obj.data['Mask'] = mask;
    } else if (this.image.transparency.indexed) {
      // Create a transparency SMask for the image based on the data
      // in the PLTE and tRNS sections. See below for details on SMasks.
      dataDecoded = true;
      return this.loadIndexedAlphaChannel();
    } else if (hasAlphaChannel) {
      // For PNG color types 4 and 6, the transparency data is stored as a alpha
      // channel mixed in with the main image data. Separate this data out into an
      // SMask object and store it separately in the PDF.
      dataDecoded = true;
      return this.splitAlphaChannel();
    }

    if (isInterlaced && !dataDecoded) {
      return this.decodeData();
    }

    this.finalize();
  };

  _proto.finalize = function finalize() {
    if (this.alphaChannel) {
      var sMask = this.document.ref({
        Type: 'XObject',
        Subtype: 'Image',
        Height: this.height,
        Width: this.width,
        BitsPerComponent: 8,
        Filter: 'FlateDecode',
        ColorSpace: 'DeviceGray',
        Decode: [0, 1]
      });
      sMask.end(this.alphaChannel);
      this.obj.data['SMask'] = sMask;
    } // add the actual image data


    this.obj.end(this.imgData); // free memory

    this.image = null;
    this.imgData = null;
  };

  _proto.splitAlphaChannel = function splitAlphaChannel() {
    var _this = this;

    return this.image.decodePixels(function (pixels) {
      var a;
      var p;
      var colorCount = _this.image.colors;
      var pixelCount = _this.width * _this.height;
      var imgData = Buffer$4.alloc(pixelCount * colorCount);
      var alphaChannel = Buffer$4.alloc(pixelCount);
      var i = p = a = 0;
      var len = pixels.length; // For 16bit images copy only most significant byte (MSB) - PNG data is always stored in network byte order (MSB first)

      var skipByteCount = _this.image.bits === 16 ? 1 : 0;

      while (i < len) {
        for (var colorIndex = 0; colorIndex < colorCount; colorIndex++) {
          imgData[p++] = pixels[i++];
          i += skipByteCount;
        }

        alphaChannel[a++] = pixels[i++];
        i += skipByteCount;
      }

      _this.imgData = lib.deflateSync(imgData);
      _this.alphaChannel = lib.deflateSync(alphaChannel);
      return _this.finalize();
    });
  };

  _proto.loadIndexedAlphaChannel = function loadIndexedAlphaChannel() {
    var _this2 = this;

    var transparency = this.image.transparency.indexed;
    return this.image.decodePixels(function (pixels) {
      var alphaChannel = Buffer$4.alloc(_this2.width * _this2.height);
      var i = 0;

      for (var j = 0, end = pixels.length; j < end; j++) {
        alphaChannel[i++] = transparency[pixels[j]];
      }

      _this2.alphaChannel = lib.deflateSync(alphaChannel);
      return _this2.finalize();
    });
  };

  _proto.decodeData = function decodeData() {
    var _this3 = this;

    this.image.decodePixels(function (pixels) {
      _this3.imgData = lib.deflateSync(pixels);

      _this3.finalize();
    });
  };

  return PNGImage;
}();

var PDFImage = /*#__PURE__*/function () {
  function PDFImage() {}

  PDFImage.open = function open(src, label) {
    var data;

    if (Buffer$4.isBuffer(src)) {
      data = src;
    } else if (src instanceof ArrayBuffer) {
      data = Buffer$4.from(new Uint8Array(src));
    } else {
      var match = /^data:.+;base64,(.*)$/.exec(src);

      if (match) {
        data = Buffer$4.from(match[1], 'base64');
      }
    }

    if (data[0] === 0xff && data[1] === 0xd8) {
      return new JPEG(data, label);
    }

    if (data[0] === 0x89 && data.toString('ascii', 1, 4) === 'PNG') {
      return new PNGImage(data, label);
    }

    throw new Error('Unknown image format.');
  };

  return PDFImage;
}();

var ImagesMixin = {
  initImages: function initImages() {
    this._imageRegistry = {};
    this._imageCount = 0;
  },
  embedImage: function embedImage(src) {
    var image;

    if (typeof src === 'string') {
      image = this._imageRegistry[src];
    }

    if (!image) {
      if (src.width && src.height) {
        image = src;
      } else {
        image = this.openImage(src);
      }
    }

    if (!image.obj) {
      image.embed(this);
    }

    return image;
  },
  image: function image(src, x, y, options) {
    if (options === void 0) {
      options = {};
    }

    var bh;
    var bp;
    var bw;
    var ip;
    var left;
    var left1;

    if (typeof x === 'object') {
      options = x;
      x = null;
    }

    var image = src instanceof PDFImage ? src : this.embedImage(src);
    x = (left = x != null ? x : options.x) != null ? left : this.x;
    y = (left1 = y != null ? y : options.y) != null ? left1 : this.y;

    if (this.page.xobjects[image.label] == null) {
      this.page.xobjects[image.label] = image.obj;
    }

    var w = options.width || image.width;
    var h = options.height || image.height;

    if (options.width && !options.height) {
      var wp = w / image.width;
      w = image.width * wp;
      h = image.height * wp;
    } else if (options.height && !options.width) {
      var hp = h / image.height;
      w = image.width * hp;
      h = image.height * hp;
    } else if (options.scale) {
      w = image.width * options.scale;
      h = image.height * options.scale;
    } else if (options.fit) {
      var _Array$from = Array.from(options.fit);

      bw = _Array$from[0];
      bh = _Array$from[1];
      bp = bw / bh;
      ip = image.width / image.height;

      if (ip > bp) {
        w = bw;
        h = bw / ip;
      } else {
        h = bh;
        w = bh * ip;
      }
    } // Set the current y position to below the image if it is in the document flow


    if (this.y === y) {
      this.y += h;
    }

    this.save();
    this.transform(w, 0, 0, -h, x, y + h);
    this.addContent("/" + image.label + " Do");
    this.restore();
    return this;
  },
  openImage: function openImage(src) {
    var image;

    if (typeof src === 'string') {
      image = this._imageRegistry[src];
    }

    if (!image) {
      image = PDFImage.open(src, "I" + ++this._imageCount);

      if (typeof src === 'string') {
        this._imageRegistry[src] = image;
      }
    }

    return image;
  }
};

var AnnotationsMixin = {
  annotate: function annotate(x, y, w, h, options) {
    options.Type = 'Annot';
    options.Rect = this._convertRect(x, y, w, h);
    options.Border = [0, 0, 0];

    if (options.Subtype === 'Link' && typeof options.F === 'undefined') {
      options.F = 1 << 2; // Print Annotation Flag
    }

    if (options.Subtype !== 'Link') {
      if (options.C == null) {
        options.C = this._normalizeColor(options.color || [0, 0, 0]);
      }
    } // convert colors


    delete options.color;

    if (typeof options.Dest === 'string') {
      options.Dest = new String(options.Dest);
    } // Capitalize keys


    for (var key in options) {
      var val = options[key];
      options[key[0].toUpperCase() + key.slice(1)] = val;
    }

    var ref = this.ref(options);
    this.page.annotations.push(ref);
    ref.end();
    return this;
  },
  note: function note(x, y, w, h, contents, options) {
    if (options === void 0) {
      options = {};
    }

    options.Subtype = 'Text';
    options.Contents = new String(contents);
    options.Name = 'Comment';

    if (options.color == null) {
      options.color = [243, 223, 92];
    }

    options.Border = [0, 0, options.borderWidth || 0];
    delete options.borderWidth;
    return this.annotate(x, y, w, h, options);
  },
  goTo: function goTo(x, y, w, h, name, options) {
    if (options === void 0) {
      options = {};
    }

    options.Subtype = 'Link';
    options.A = this.ref({
      S: 'GoTo',
      D: new String(name)
    });
    options.A.end();
    return this.annotate(x, y, w, h, options);
  },
  link: function link(x, y, w, h, url, options) {
    if (options === void 0) {
      options = {};
    }

    options.Subtype = 'Link';

    if (typeof url === 'number') {
      // Link to a page in the document (the page must already exist)
      var pages = this._root.data.Pages.data;

      if (url >= 0 && url < pages.Kids.length) {
        options.A = this.ref({
          S: 'GoTo',
          D: [pages.Kids[url], 'XYZ', null, null, null]
        });
        options.A.end();
      } else {
        throw new Error("The document has no page " + url);
      }
    } else {
      // Link to an external url
      options.A = this.ref({
        S: 'URI',
        URI: new String(url)
      });
      options.A.end();
    }

    return this.annotate(x, y, w, h, options);
  },
  _markup: function _markup(x, y, w, h, options) {
    if (options === void 0) {
      options = {};
    }

    var _this$_convertRect = this._convertRect(x, y, w, h),
        x1 = _this$_convertRect[0],
        y1 = _this$_convertRect[1],
        x2 = _this$_convertRect[2],
        y2 = _this$_convertRect[3];

    options.QuadPoints = [x1, y2, x2, y2, x1, y1, x2, y1];
    options.Contents = new String();
    return this.annotate(x, y, w, h, options);
  },
  highlight: function highlight(x, y, w, h, options) {
    if (options === void 0) {
      options = {};
    }

    options.Subtype = 'Highlight';

    if (options.color == null) {
      options.color = [241, 238, 148];
    }

    return this._markup(x, y, w, h, options);
  },
  fileAnnotation: function fileAnnotation(x, y, w, h, file, options) {
    if (file === void 0) {
      file = {};
    }

    if (options === void 0) {
      options = {};
    }

    // create hidden file
    var filespec = this.file(file.src, Object.assign({
      hidden: true
    }, file));
    options.Subtype = 'FileAttachment';
    options.FS = filespec; // add description from filespec unless description (Contents) has already been set

    if (options.Contents) {
      options.Contents = new String(options.Contents);
    } else if (filespec.data.Desc) {
      options.Contents = filespec.data.Desc;
    }

    return this.annotate(x, y, w, h, options);
  },
  _convertRect: function _convertRect(x1, y1, w, h) {
    // flip y1 and y2
    var y2 = y1;
    y1 += h; // make x2

    var x2 = x1 + w; // apply current transformation matrix to points

    var _this$_ctm = this._ctm,
        m0 = _this$_ctm[0],
        m1 = _this$_ctm[1],
        m2 = _this$_ctm[2],
        m3 = _this$_ctm[3],
        m4 = _this$_ctm[4],
        m5 = _this$_ctm[5];
    x1 = m0 * x1 + m2 * y1 + m4;
    y1 = m1 * x1 + m3 * y1 + m5;
    x2 = m0 * x2 + m2 * y2 + m4;
    y2 = m1 * x2 + m3 * y2 + m5;
    return [x1, y1, x2, y2];
  }
};

var DEFAULT_OPTIONS = {
  top: 0,
  left: 0,
  zoom: 0,
  fit: false,
  pageNumber: null,
  expanded: false
};

var PDFOutline = /*#__PURE__*/function () {
  function PDFOutline(document, parent, title, dest, options) {
    if (options === void 0) {
      options = DEFAULT_OPTIONS;
    }

    this.document = document;
    this.options = options;
    this.outlineData = {};

    if (dest !== null) {
      var destWidth = dest.data.MediaBox[2];
      var destHeight = dest.data.MediaBox[3];
      var top = destHeight - (options.top || 0);
      var left = destWidth - (options.left || 0);
      var zoom = options.zoom || 0;
      this.outlineData.Dest = options.fit ? [dest, 'Fit'] : [dest, 'XYZ', left, top, zoom];
    }

    if (parent !== null) {
      this.outlineData.Parent = parent;
    }

    if (title !== null) {
      this.outlineData.Title = new String(title);
    }

    this.dictionary = this.document.ref(this.outlineData);
    this.children = [];
  }

  var _proto = PDFOutline.prototype;

  _proto.addItem = function addItem(title, options) {
    if (options === void 0) {
      options = DEFAULT_OPTIONS;
    }

    var pages = this.document._root.data.Pages.data.Kids;
    var dest = options.pageNumber !== null ? pages[options.pageNumber] : this.document.page.dictionary;
    var result = new PDFOutline(this.document, this.dictionary, title, dest, options);
    this.children.push(result);
    return result;
  };

  _proto.endOutline = function endOutline() {
    if (this.children.length > 0) {
      if (this.options.expanded) {
        this.outlineData.Count = this.children.length;
      }

      var first = this.children[0];
      var last = this.children[this.children.length - 1];
      this.outlineData.First = first.dictionary;
      this.outlineData.Last = last.dictionary;

      for (var i = 0, len = this.children.length; i < len; i++) {
        var child = this.children[i];

        if (i > 0) {
          child.outlineData.Prev = this.children[i - 1].dictionary;
        }

        if (i < this.children.length - 1) {
          child.outlineData.Next = this.children[i + 1].dictionary;
        }

        child.endOutline();
      }
    }

    return this.dictionary.end();
  };

  return PDFOutline;
}();

var OutlineMixin = {
  initOutline: function initOutline() {
    this.outline = new PDFOutline(this, null, null, null);
  },
  endOutline: function endOutline() {
    this.outline.endOutline();

    if (this.outline.children.length > 0) {
      this._root.data.Outlines = this.outline.dictionary;
      this._root.data.PageMode = this._root.data.PageMode || 'UseOutlines';
    }
  }
};

var FIELD_FLAGS = {
  readOnly: 1,
  required: 2,
  noExport: 4,
  multiline: 0x1000,
  password: 0x2000,
  toggleToOffButton: 0x4000,
  radioButton: 0x8000,
  pushButton: 0x10000,
  combo: 0x20000,
  edit: 0x40000,
  sort: 0x80000,
  multiSelect: 0x200000,
  noSpell: 0x400000
};
var FIELD_JUSTIFY = {
  left: 0,
  center: 1,
  right: 2
};
var VALUE_MAP = {
  value: 'V',
  defaultValue: 'DV'
};
var FORMAT_SPECIAL = {
  zip: '0',
  zipPlus4: '1',
  zip4: '1',
  phone: '2',
  ssn: '3'
};
var FORMAT_DEFAULT = {
  number: {
    nDec: 0,
    sepComma: false,
    negStyle: 'MinusBlack',
    currency: '',
    currencyPrepend: true
  },
  percent: {
    nDec: 0,
    sepComma: false
  }
};
var AcroFormMixin = {
  /**
   * Must call if adding AcroForms to a document. Must also call font() before
   * this method to set the default font.
   */
  initForm: function initForm() {
    if (!this._font) {
      throw new Error('Must set a font before calling initForm method');
    }

    this._acroform = {
      fonts: {},
      defaultFont: this._font.name
    };
    this._acroform.fonts[this._font.id] = this._font.ref();
    var data = {
      Fields: [],
      NeedAppearances: true,
      DA: new String("/" + this._font.id + " 0 Tf 0 g"),
      DR: {
        Font: {}
      }
    };
    data.DR.Font[this._font.id] = this._font.ref();
    var AcroForm = this.ref(data);
    this._root.data.AcroForm = AcroForm;
    return this;
  },

  /**
   * Called automatically by document.js
   */
  endAcroForm: function endAcroForm() {
    var _this = this;

    if (this._root.data.AcroForm) {
      if (!Object.keys(this._acroform.fonts).length && !this._acroform.defaultFont) {
        throw new Error('No fonts specified for PDF form');
      }

      var fontDict = this._root.data.AcroForm.data.DR.Font;
      Object.keys(this._acroform.fonts).forEach(function (name) {
        fontDict[name] = _this._acroform.fonts[name];
      });

      this._root.data.AcroForm.data.Fields.forEach(function (fieldRef) {
        _this._endChild(fieldRef);
      });

      this._root.data.AcroForm.end();
    }

    return this;
  },
  _endChild: function _endChild(ref) {
    var _this2 = this;

    if (Array.isArray(ref.data.Kids)) {
      ref.data.Kids.forEach(function (childRef) {
        _this2._endChild(childRef);
      });
      ref.end();
    }

    return this;
  },

  /**
   * Creates and adds a form field to the document. Form fields are intermediate
   * nodes in a PDF form that are used to specify form name heirarchy and form
   * value defaults.
   * @param {string} name - field name (T attribute in field dictionary)
   * @param {object} options  - other attributes to include in field dictionary
   */
  formField: function formField(name, options) {
    if (options === void 0) {
      options = {};
    }

    var fieldDict = this._fieldDict(name, null, options);

    var fieldRef = this.ref(fieldDict);

    this._addToParent(fieldRef);

    return fieldRef;
  },

  /**
   * Creates and adds a Form Annotation to the document. Form annotations are
   * called Widget annotations internally within a PDF file.
   * @param {string} name - form field name (T attribute of widget annotation
   * dictionary)
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @param {object} options
   */
  formAnnotation: function formAnnotation(name, type, x, y, w, h, options) {
    if (options === void 0) {
      options = {};
    }

    var fieldDict = this._fieldDict(name, type, options);

    fieldDict.Subtype = 'Widget';

    if (fieldDict.F === undefined) {
      fieldDict.F = 4; // print the annotation
    } // Add Field annot to page, and get it's ref


    this.annotate(x, y, w, h, fieldDict);
    var annotRef = this.page.annotations[this.page.annotations.length - 1];
    return this._addToParent(annotRef);
  },
  formText: function formText(name, x, y, w, h, options) {
    if (options === void 0) {
      options = {};
    }

    return this.formAnnotation(name, 'text', x, y, w, h, options);
  },
  formPushButton: function formPushButton(name, x, y, w, h, options) {
    if (options === void 0) {
      options = {};
    }

    return this.formAnnotation(name, 'pushButton', x, y, w, h, options);
  },
  formCombo: function formCombo(name, x, y, w, h, options) {
    if (options === void 0) {
      options = {};
    }

    return this.formAnnotation(name, 'combo', x, y, w, h, options);
  },
  formList: function formList(name, x, y, w, h, options) {
    if (options === void 0) {
      options = {};
    }

    return this.formAnnotation(name, 'list', x, y, w, h, options);
  },
  formRadioButton: function formRadioButton(name, x, y, w, h, options) {
    if (options === void 0) {
      options = {};
    }

    return this.formAnnotation(name, 'radioButton', x, y, w, h, options);
  },
  formCheckbox: function formCheckbox(name, x, y, w, h, options) {
    if (options === void 0) {
      options = {};
    }

    return this.formAnnotation(name, 'checkbox', x, y, w, h, options);
  },
  _addToParent: function _addToParent(fieldRef) {
    var parent = fieldRef.data.Parent;

    if (parent) {
      if (!parent.data.Kids) {
        parent.data.Kids = [];
      }

      parent.data.Kids.push(fieldRef);
    } else {
      this._root.data.AcroForm.data.Fields.push(fieldRef);
    }

    return this;
  },
  _fieldDict: function _fieldDict(name, type, options) {
    if (options === void 0) {
      options = {};
    }

    if (!this._acroform) {
      throw new Error('Call document.initForms() method before adding form elements to document');
    }

    var opts = Object.assign({}, options);

    if (type !== null) {
      opts = this._resolveType(type, options);
    }

    opts = this._resolveFlags(opts);
    opts = this._resolveJustify(opts);
    opts = this._resolveFont(opts);
    opts = this._resolveStrings(opts);
    opts = this._resolveColors(opts);
    opts = this._resolveFormat(opts);
    opts.T = new String(name);

    if (opts.parent) {
      opts.Parent = opts.parent;
      delete opts.parent;
    }

    return opts;
  },
  _resolveType: function _resolveType(type, opts) {
    if (type === 'text') {
      opts.FT = 'Tx';
    } else if (type === 'pushButton') {
      opts.FT = 'Btn';
      opts.pushButton = true;
    } else if (type === 'radioButton') {
      opts.FT = 'Btn';
      opts.radioButton = true;
    } else if (type === 'checkbox') {
      opts.FT = 'Btn';
    } else if (type === 'combo') {
      opts.FT = 'Ch';
      opts.combo = true;
    } else if (type === 'list') {
      opts.FT = 'Ch';
    } else {
      throw new Error("Invalid form annotation type '" + type + "'");
    }

    return opts;
  },
  _resolveFormat: function _resolveFormat(opts) {
    var f = opts.format;

    if (f && f.type) {
      var fnKeystroke;
      var fnFormat;
      var params = '';

      if (FORMAT_SPECIAL[f.type] !== undefined) {
        fnKeystroke = "AFSpecial_Keystroke";
        fnFormat = "AFSpecial_Format";
        params = FORMAT_SPECIAL[f.type];
      } else {
        var format = f.type.charAt(0).toUpperCase() + f.type.slice(1);
        fnKeystroke = "AF" + format + "_Keystroke";
        fnFormat = "AF" + format + "_Format";

        if (f.type === 'date') {
          fnKeystroke += 'Ex';
          params = String(f.param);
        } else if (f.type === 'time') {
          params = String(f.param);
        } else if (f.type === 'number') {
          var p = Object.assign({}, FORMAT_DEFAULT.number, f);
          params = String([String(p.nDec), p.sepComma ? '0' : '1', '"' + p.negStyle + '"', 'null', '"' + p.currency + '"', String(p.currencyPrepend)].join(','));
        } else if (f.type === 'percent') {
          var _p = Object.assign({}, FORMAT_DEFAULT.percent, f);

          params = String([String(_p.nDec), _p.sepComma ? '0' : '1'].join(','));
        }
      }

      opts.AA = opts.AA ? opts.AA : {};
      opts.AA.K = {
        S: 'JavaScript',
        JS: new String(fnKeystroke + "(" + params + ");")
      };
      opts.AA.F = {
        S: 'JavaScript',
        JS: new String(fnFormat + "(" + params + ");")
      };
    }

    delete opts.format;
    return opts;
  },
  _resolveColors: function _resolveColors(opts) {
    var color = this._normalizeColor(opts.backgroundColor);

    if (color) {
      if (!opts.MK) {
        opts.MK = {};
      }

      opts.MK.BG = color;
    }

    color = this._normalizeColor(opts.borderColor);

    if (color) {
      if (!opts.MK) {
        opts.MK = {};
      }

      opts.MK.BC = color;
    }

    delete opts.backgroundColor;
    delete opts.borderColor;
    return opts;
  },
  _resolveFlags: function _resolveFlags(options) {
    var result = 0;
    Object.keys(options).forEach(function (key) {
      if (FIELD_FLAGS[key]) {
        result |= FIELD_FLAGS[key];
        delete options[key];
      }
    });

    if (result !== 0) {
      options.Ff = options.Ff ? options.Ff : 0;
      options.Ff |= result;
    }

    return options;
  },
  _resolveJustify: function _resolveJustify(options) {
    var result = 0;

    if (options.align !== undefined) {
      if (typeof FIELD_JUSTIFY[options.align] === 'number') {
        result = FIELD_JUSTIFY[options.align];
      }

      delete options.align;
    }

    if (result !== 0) {
      options.Q = result; // default
    }

    return options;
  },
  _resolveFont: function _resolveFont(options) {
    // add current font to document-level AcroForm dict if necessary
    if (this._acroform.fonts[this._font.id] === null) {
      this._acroform.fonts[this._font.id] = this._font.ref();
    } // add current font to field's resource dict (RD) if not the default acroform font


    if (this._acroform.defaultFont !== this._font.name) {
      options.DR = {
        Font: {}
      }; // Get the fontSize option. If not set use auto sizing

      var fontSize = options.fontSize || 0;
      options.DR.Font[this._font.id] = this._font.ref();
      options.DA = new String("/" + this._font.id + " " + fontSize + " Tf 0 g");
    }

    return options;
  },
  _resolveStrings: function _resolveStrings(options) {
    var select = [];

    function appendChoices(a) {
      if (Array.isArray(a)) {
        for (var idx = 0; idx < a.length; idx++) {
          if (typeof a[idx] === 'string') {
            select.push(new String(a[idx]));
          } else {
            select.push(a[idx]);
          }
        }
      }
    }

    appendChoices(options.Opt);

    if (options.select) {
      appendChoices(options.select);
      delete options.select;
    }

    if (select.length) {
      options.Opt = select;
    }

    Object.keys(VALUE_MAP).forEach(function (key) {
      if (options[key] !== undefined) {
        options[VALUE_MAP[key]] = options[key];
        delete options[key];
      }
    });
    ['V', 'DV'].forEach(function (key) {
      if (typeof options[key] === 'string') {
        options[key] = new String(options[key]);
      }
    });

    if (options.MK && options.MK.CA) {
      options.MK.CA = new String(options.MK.CA);
    }

    if (options.label) {
      options.MK = options.MK ? options.MK : {};
      options.MK.CA = new String(options.label);
      delete options.label;
    }

    return options;
  }
};

var AttachmentsMixin = {
  /**
   * Embed contents of `src` in PDF
   * @param {Buffer | ArrayBuffer | string} src input Buffer, ArrayBuffer, base64 encoded string or path to file
   * @param {object} options
   *  * options.name: filename to be shown in PDF, will use `src` if none set
   *  * options.type: filetype to be shown in PDF
   *  * options.description: description to be shown in PDF
   *  * options.hidden: if true, do not add attachment to EmbeddedFiles dictionary. Useful for file attachment annotations
   *  * options.creationDate: override creation date
   *  * options.modifiedDate: override modified date
   * @returns filespec reference
   */
  file: function file(src, options) {
    if (options === void 0) {
      options = {};
    }

    options.name = options.name || src;
    var refBody = {
      Type: 'EmbeddedFile',
      Params: {}
    };
    var data;

    if (!src) {
      throw new Error('No src specified');
    }

    if (Buffer$4.isBuffer(src)) {
      data = src;
    } else if (src instanceof ArrayBuffer) {
      data = Buffer$4.from(new Uint8Array(src));
    } else {
      var match;

      if (match = /^data:(.*);base64,(.*)$/.exec(src)) {
        if (match[1]) {
          refBody.Subtype = match[1].replace('/', '#2F');
        }

        data = Buffer$4.from(match[2], 'base64');
      } else {
        throw new Error("Could not find file " + src);
      }
    } // override creation date and modified date


    if (options.creationDate instanceof Date) {
      refBody.Params.CreationDate = options.creationDate;
    }

    if (options.modifiedDate instanceof Date) {
      refBody.Params.ModDate = options.modifiedDate;
    } // add optional subtype


    if (options.type) {
      refBody.Subtype = options.type.replace('/', '#2F');
    } // add checksum and size information


    var checksum = crypto_js_md5__WEBPACK_IMPORTED_MODULE_4___default().MD5(crypto_js_md5__WEBPACK_IMPORTED_MODULE_4___default().lib.WordArray.create(new Uint8Array(data)));
    refBody.Params.CheckSum = new String(checksum);
    refBody.Params.Size = data.byteLength; // save some space when embedding the same file again
    // if a file with the same name and metadata exists, reuse its reference

    var ref;
    if (!this._fileRegistry) this._fileRegistry = {};
    var file = this._fileRegistry[options.name];

    if (file && isEqual(refBody, file)) {
      ref = file.ref;
    } else {
      ref = this.ref(refBody);
      ref.end(data);
      this._fileRegistry[options.name] = (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z)({}, refBody, {
        ref: ref
      });
    } // add filespec for embedded file


    var fileSpecBody = {
      Type: 'Filespec',
      F: new String(options.name),
      EF: {
        F: ref
      },
      UF: new String(options.name)
    };

    if (options.description) {
      fileSpecBody.Desc = new String(options.description);
    }

    var filespec = this.ref(fileSpecBody);
    filespec.end();

    if (!options.hidden) {
      this.addNamedEmbeddedFile(options.name, filespec);
    }

    return filespec;
  }
};
/** check two embedded file metadata objects for equality */

function isEqual(a, b) {
  if (a.Subtype !== b.Subtype || a.Params.CheckSum.toString() !== b.Params.CheckSum.toString() || a.Params.Size !== b.Params.Size || a.Params.CreationDate !== b.Params.CreationDate || a.Params.ModDate !== b.Params.ModDate) {
    return false;
  }

  return true;
}

var capitalize = function capitalize(v) {
  return v[0].toUpperCase() + v.slice(1);
};

var PDFDocument = /*#__PURE__*/function (_stream$Readable) {
  (0,_babel_runtime_helpers_inheritsLoose__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z)(PDFDocument, _stream$Readable);

  function PDFDocument(options) {
    var _this;

    if (options === void 0) {
      options = {};
    }

    _this = _stream$Readable.call(this) || this;
    _this.options = options; // PDF version

    switch (options.pdfVersion) {
      case '1.4':
        _this.version = 1.4;
        break;

      case '1.5':
        _this.version = 1.5;
        break;

      case '1.6':
        _this.version = 1.6;
        break;

      case '1.7':
      case '1.7ext3':
        _this.version = 1.7;
        break;

      default:
        _this.version = 1.3;
        break;
    } // Whether streams should be compressed


    _this.compress = _this.options.compress != null ? _this.options.compress : true;
    _this._pageBuffer = [];
    _this._pageBufferStart = 0; // The PDF object store

    _this._offsets = [];
    _this._waiting = 0;
    _this._ended = false;
    _this._offset = 0;

    var Pages = _this.ref({
      Type: 'Pages',
      Count: 0,
      Kids: []
    });

    var Names = _this.ref({
      Dests: new PDFNameTree()
    });

    _this._root = _this.ref({
      Type: 'Catalog',
      Pages: Pages,
      Names: Names
    });

    if (_this.options.lang) {
      _this._root.data.Lang = new String(_this.options.lang);
    }

    if (_this.options.pageLayout) {
      _this._root.data.PageLayout = capitalize(_this.options.pageLayout);
    }

    if (_this.options.pageMode) {
      _this._root.data.PageMode = capitalize(_this.options.pageMode);
    } // The current page


    _this.page = null; // Initialize mixins

    _this.initColor();

    _this.initVector();

    _this.initFonts();

    _this.initText();

    _this.initImages();

    _this.initOutline(); // this.initMarkings(options)
    // Initialize the metadata


    _this.info = {
      Producer: 'PDFKit',
      Creator: 'PDFKit',
      CreationDate: new Date()
    };

    if (_this.options.info) {
      for (var key in _this.options.info) {
        var val = _this.options.info[key];
        _this.info[key] = val;
      }
    }

    if (_this.options.displayTitle) {
      _this._root.data.ViewerPreferences = _this.ref({
        DisplayDocTitle: true
      });
    } // Generate file ID


    _this._id = PDFSecurity.generateFileID(_this.info); // Initialize security settings
    // this._security = PDFSecurity.create(this, options);
    // Write the header PDF version

    _this._write("%PDF-" + _this.version); // 4 binary chars, as recommended by the spec


    _this._write('%\xFF\xFF\xFF\xFF'); // Add the first page


    if (_this.options.autoFirstPage !== false) {
      _this.addPage();
    }

    return _this;
  }

  var _proto = PDFDocument.prototype;

  _proto.addPage = function addPage(options) {
    // end the current page if needed
    if (options == null) {
      options = this.options;
    } // end the current page if needed


    if (!this.options.bufferPages) {
      this.flushPages();
    } // create a page object


    this.page = new PDFPage(this, options);

    this._pageBuffer.push(this.page); // add the page to the object store


    var pages = this._root.data.Pages.data;
    pages.Kids.push(this.page.dictionary);
    pages.Count++; // flip PDF coordinate system so that the origin is in
    // the top left rather than the bottom left

    this._ctm = [1, 0, 0, 1, 0, 0];
    this.transform(1, 0, 0, -1, 0, this.page.height); // this.emit('pageAdded');

    return this;
  };

  _proto.flushPages = function flushPages() {
    // this local variable exists so we're future-proof against
    // reentrant calls to flushPages.
    var pages = this._pageBuffer;
    this._pageBuffer = [];
    this._pageBufferStart += pages.length;

    for (var _i = 0, _Array$from = Array.from(pages); _i < _Array$from.length; _i++) {
      var page = _Array$from[_i];
      // this.endPageMarkings(page);
      page.end();
    }
  };

  _proto.addNamedDestination = function addNamedDestination(name) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (args.length === 0) {
      args = ['XYZ', null, null, null];
    }

    if (args[0] === 'XYZ' && args[2] !== null) {
      args[2] = this.page.height - args[2];
    }

    args.unshift(this.page.dictionary);

    this._root.data.Names.data.Dests.add(name, args);
  };

  _proto.addNamedEmbeddedFile = function addNamedEmbeddedFile(name, ref) {
    if (!this._root.data.Names.data.EmbeddedFiles) {
      // disabling /Limits for this tree fixes attachments not showing in Adobe Reader
      this._root.data.Names.data.EmbeddedFiles = new PDFNameTree({
        limits: false
      });
    } // add filespec to EmbeddedFiles


    this._root.data.Names.data.EmbeddedFiles.add(name, ref);
  };

  _proto.addNamedJavaScript = function addNamedJavaScript(name, js) {
    if (!this._root.data.Names.data.JavaScript) {
      this._root.data.Names.data.JavaScript = new PDFNameTree();
    }

    var data = {
      JS: new String(js),
      S: 'JavaScript'
    };

    this._root.data.Names.data.JavaScript.add(name, data);
  };

  _proto.ref = function ref(data) {
    var ref = new PDFReference(this, this._offsets.length + 1, data);

    this._offsets.push(null); // placeholder for this object's offset once it is finalized


    this._waiting++;
    return ref;
  };

  _proto._read = function _read() {// do nothing, but this method is required by node
  };

  _proto._write = function _write(data) {
    if (!Buffer$4.isBuffer(data)) {
      data = Buffer$4.from(data + '\n', 'binary');
    }

    this.push(data);
    return this._offset += data.length;
  };

  _proto.addContent = function addContent(data) {
    this.page.write(data);
    return this;
  };

  _proto._refEnd = function _refEnd(ref) {
    this._offsets[ref.id - 1] = ref.offset;

    if (--this._waiting === 0 && this._ended) {
      this._finalize();

      return this._ended = false;
    }
  };

  _proto.end = function end() {
    this.flushPages();
    this._info = this.ref();

    for (var key in this.info) {
      var val = this.info[key];

      if (typeof val === 'string') {
        val = new String(val);
      }

      var entry = this.ref(val);
      entry.end();
      this._info.data[key] = entry;
    }

    this._info.end();

    for (var name in this._fontFamilies) {
      var font = this._fontFamilies[name];
      font.finalize();
    }

    this.endOutline(); // this.endMarkings();

    this._root.end();

    this._root.data.Pages.end();

    this._root.data.Names.end();

    this.endAcroForm();

    if (this._root.data.ViewerPreferences) {
      this._root.data.ViewerPreferences.end();
    } // if (this._security) {
    //   this._security.end();
    // }


    if (this._waiting === 0) {
      return this._finalize();
    }

    this._ended = true;
  };

  _proto._finalize = function _finalize() {
    // generate xref
    var xRefOffset = this._offset;

    this._write('xref');

    this._write("0 " + (this._offsets.length + 1));

    this._write('0000000000 65535 f ');

    for (var _i2 = 0, _Array$from2 = Array.from(this._offsets); _i2 < _Array$from2.length; _i2++) {
      var offset = _Array$from2[_i2];
      offset = ("0000000000" + offset).slice(-10);

      this._write(offset + ' 00000 n ');
    } // trailer


    var trailer = {
      Size: this._offsets.length + 1,
      Root: this._root,
      Info: this._info,
      ID: [this._id, this._id]
    }; // if (this._security) {
    //   trailer.Encrypt = this._security.dictionary;
    // }

    this._write('trailer');

    this._write(PDFObject$1.convert(trailer));

    this._write('startxref');

    this._write("" + xRefOffset);

    this._write('%%EOF'); // end the stream


    return this.push(null);
  };

  _proto.toString = function toString() {
    return '[object PDFDocument]';
  };

  return PDFDocument;
}(stream.Readable);

var mixin = function mixin(methods) {
  Object.assign(PDFDocument.prototype, methods);
}; // Load mixins


mixin(ColorMixin);
mixin(VectorMixin);
mixin(FontsMixin);
mixin(TextMixin);
mixin(ImagesMixin);
mixin(AnnotationsMixin);
mixin(OutlineMixin); // mixin(MarkingsMixin);

mixin(AcroFormMixin);
mixin(AttachmentsMixin);




/***/ })

}]);