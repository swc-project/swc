// Loaded from https://cdn.skypack.dev/-/bson@v4.2.2-kgdFkBIpILByFdPjvZHZ/dist=es2020,mode=imports/optimized/bson.js


import __commonjs_module0 from "/-/buffer@v5.7.1-Crl6ndaY0FyV50ZOgBvz/dist=es2020,mode=imports/optimized/buffer.js";
const {Buffer} = __commonjs_module0;
;
var global$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global$1 !== "undefined" ? global$1 : typeof self !== "undefined" ? self : {};
function unwrapExports(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function createCommonjsModule(fn, module) {
  return module = {exports: {}}, fn(module, module.exports), module.exports;
}
var byteLength_1 = byteLength;
var toByteArray_1 = toByteArray;
var fromByteArray_1 = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}
revLookup["-".charCodeAt(0)] = 62;
revLookup["_".charCodeAt(0)] = 63;
function getLens(b64) {
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error("Invalid string. Length must be a multiple of 4");
  }
  var validLen = b64.indexOf("=");
  if (validLen === -1)
    validLen = len;
  var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
}
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
  var curByte = 0;
  var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
  var i;
  for (i = 0; i < len; i += 4) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = tmp >> 16 & 255;
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  }
  return arr;
}
function tripletToBase64(num) {
  return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
}
function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (uint8[i + 2] & 255);
    output.push(tripletToBase64(tmp));
  }
  return output.join("");
}
function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3;
  var parts = [];
  var maxChunkLength = 16383;
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
  }
  return parts.join("");
}
var base64Js = {
  byteLength: byteLength_1,
  toByteArray: toByteArray_1,
  fromByteArray: fromByteArray_1
};
var read = function read2(buffer3, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer3[offset + i];
  i += d;
  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer3[offset + i], i += d, nBits -= 8) {
  }
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer3[offset + i], i += d, nBits -= 8) {
  }
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
var write = function write2(buffer3, value, offset, isLE, mLen, nBytes) {
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
  for (; mLen >= 8; buffer3[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
  }
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer3[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
  }
  buffer3[offset + i - d] |= s * 128;
};
var ieee754 = {
  read,
  write
};
var buffer2 = createCommonjsModule(function(module, exports) {
  var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
  exports.Buffer = Buffer2;
  exports.SlowBuffer = SlowBuffer;
  exports.INSPECT_MAX_BYTES = 50;
  var K_MAX_LENGTH = 2147483647;
  exports.kMaxLength = K_MAX_LENGTH;
  Buffer2.TYPED_ARRAY_SUPPORT = typedArraySupport();
  if (!Buffer2.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
    console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
  }
  function typedArraySupport() {
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
  Object.defineProperty(Buffer2.prototype, "parent", {
    enumerable: true,
    get: function get() {
      if (!Buffer2.isBuffer(this))
        return void 0;
      return this.buffer;
    }
  });
  Object.defineProperty(Buffer2.prototype, "offset", {
    enumerable: true,
    get: function get() {
      if (!Buffer2.isBuffer(this))
        return void 0;
      return this.byteOffset;
    }
  });
  function createBuffer(length) {
    if (length > K_MAX_LENGTH) {
      throw new RangeError('The value "' + length + '" is invalid for option "size"');
    }
    var buf = new Uint8Array(length);
    Object.setPrototypeOf(buf, Buffer2.prototype);
    return buf;
  }
  function Buffer2(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
      if (typeof encodingOrOffset === "string") {
        throw new TypeError('The "string" argument must be of type string. Received type number');
      }
      return allocUnsafe(arg);
    }
    return from(arg, encodingOrOffset, length);
  }
  Buffer2.poolSize = 8192;
  function from(value, encodingOrOffset, length) {
    if (typeof value === "string") {
      return fromString(value, encodingOrOffset);
    }
    if (ArrayBuffer.isView(value)) {
      return fromArrayLike(value);
    }
    if (value == null) {
      throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + babelHelpers["typeof"](value));
    }
    if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
      return fromArrayBuffer(value, encodingOrOffset, length);
    }
    if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
      return fromArrayBuffer(value, encodingOrOffset, length);
    }
    if (typeof value === "number") {
      throw new TypeError('The "value" argument must not be of type number. Received type number');
    }
    var valueOf = value.valueOf && value.valueOf();
    if (valueOf != null && valueOf !== value) {
      return Buffer2.from(valueOf, encodingOrOffset, length);
    }
    var b = fromObject(value);
    if (b)
      return b;
    if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
      return Buffer2.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
    }
    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + babelHelpers["typeof"](value));
  }
  Buffer2.from = function(value, encodingOrOffset, length) {
    return from(value, encodingOrOffset, length);
  };
  Object.setPrototypeOf(Buffer2.prototype, Uint8Array.prototype);
  Object.setPrototypeOf(Buffer2, Uint8Array);
  function assertSize(size) {
    if (typeof size !== "number") {
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
    if (fill !== void 0) {
      return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
    }
    return createBuffer(size);
  }
  Buffer2.alloc = function(size, fill, encoding) {
    return alloc(size, fill, encoding);
  };
  function allocUnsafe(size) {
    assertSize(size);
    return createBuffer(size < 0 ? 0 : checked(size) | 0);
  }
  Buffer2.allocUnsafe = function(size) {
    return allocUnsafe(size);
  };
  Buffer2.allocUnsafeSlow = function(size) {
    return allocUnsafe(size);
  };
  function fromString(string, encoding) {
    if (typeof encoding !== "string" || encoding === "") {
      encoding = "utf8";
    }
    if (!Buffer2.isEncoding(encoding)) {
      throw new TypeError("Unknown encoding: " + encoding);
    }
    var length = byteLength2(string, encoding) | 0;
    var buf = createBuffer(length);
    var actual = buf.write(string, encoding);
    if (actual !== length) {
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
  function fromArrayBuffer(array, byteOffset, length) {
    if (byteOffset < 0 || array.byteLength < byteOffset) {
      throw new RangeError('"offset" is outside of buffer bounds');
    }
    if (array.byteLength < byteOffset + (length || 0)) {
      throw new RangeError('"length" is outside of buffer bounds');
    }
    var buf;
    if (byteOffset === void 0 && length === void 0) {
      buf = new Uint8Array(array);
    } else if (length === void 0) {
      buf = new Uint8Array(array, byteOffset);
    } else {
      buf = new Uint8Array(array, byteOffset, length);
    }
    Object.setPrototypeOf(buf, Buffer2.prototype);
    return buf;
  }
  function fromObject(obj) {
    if (Buffer2.isBuffer(obj)) {
      var len = checked(obj.length) | 0;
      var buf = createBuffer(len);
      if (buf.length === 0) {
        return buf;
      }
      obj.copy(buf, 0, 0, len);
      return buf;
    }
    if (obj.length !== void 0) {
      if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
        return createBuffer(0);
      }
      return fromArrayLike(obj);
    }
    if (obj.type === "Buffer" && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data);
    }
  }
  function checked(length) {
    if (length >= K_MAX_LENGTH) {
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
    }
    return length | 0;
  }
  function SlowBuffer(length) {
    if (+length != length) {
      length = 0;
    }
    return Buffer2.alloc(+length);
  }
  Buffer2.isBuffer = function isBuffer2(b) {
    return b != null && b._isBuffer === true && b !== Buffer2.prototype;
  };
  Buffer2.compare = function compare(a, b) {
    if (isInstance(a, Uint8Array))
      a = Buffer2.from(a, a.offset, a.byteLength);
    if (isInstance(b, Uint8Array))
      b = Buffer2.from(b, b.offset, b.byteLength);
    if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
      throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
    }
    if (a === b)
      return 0;
    var x = a.length;
    var y = b.length;
    for (var i = 0, len = Math.min(x, y); i < len; ++i) {
      if (a[i] !== b[i]) {
        x = a[i];
        y = b[i];
        break;
      }
    }
    if (x < y)
      return -1;
    if (y < x)
      return 1;
    return 0;
  };
  Buffer2.isEncoding = function isEncoding(encoding) {
    switch (String(encoding).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return true;
      default:
        return false;
    }
  };
  Buffer2.concat = function concat(list, length) {
    if (!Array.isArray(list)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    if (list.length === 0) {
      return Buffer2.alloc(0);
    }
    var i;
    if (length === void 0) {
      length = 0;
      for (i = 0; i < list.length; ++i) {
        length += list[i].length;
      }
    }
    var buffer3 = Buffer2.allocUnsafe(length);
    var pos = 0;
    for (i = 0; i < list.length; ++i) {
      var buf = list[i];
      if (isInstance(buf, Uint8Array)) {
        buf = Buffer2.from(buf);
      }
      if (!Buffer2.isBuffer(buf)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      buf.copy(buffer3, pos);
      pos += buf.length;
    }
    return buffer3;
  };
  function byteLength2(string, encoding) {
    if (Buffer2.isBuffer(string)) {
      return string.length;
    }
    if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
      return string.byteLength;
    }
    if (typeof string !== "string") {
      throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + babelHelpers["typeof"](string));
    }
    var len = string.length;
    var mustMatch = arguments.length > 2 && arguments[2] === true;
    if (!mustMatch && len === 0)
      return 0;
    var loweredCase = false;
    for (; ; ) {
      switch (encoding) {
        case "ascii":
        case "latin1":
        case "binary":
          return len;
        case "utf8":
        case "utf-8":
          return utf8ToBytes(string).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return len * 2;
        case "hex":
          return len >>> 1;
        case "base64":
          return base64ToBytes(string).length;
        default:
          if (loweredCase) {
            return mustMatch ? -1 : utf8ToBytes(string).length;
          }
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  }
  Buffer2.byteLength = byteLength2;
  function slowToString(encoding, start, end) {
    var loweredCase = false;
    if (start === void 0 || start < 0) {
      start = 0;
    }
    if (start > this.length) {
      return "";
    }
    if (end === void 0 || end > this.length) {
      end = this.length;
    }
    if (end <= 0) {
      return "";
    }
    end >>>= 0;
    start >>>= 0;
    if (end <= start) {
      return "";
    }
    if (!encoding)
      encoding = "utf8";
    while (true) {
      switch (encoding) {
        case "hex":
          return hexSlice(this, start, end);
        case "utf8":
        case "utf-8":
          return utf8Slice(this, start, end);
        case "ascii":
          return asciiSlice(this, start, end);
        case "latin1":
        case "binary":
          return latin1Slice(this, start, end);
        case "base64":
          return base64Slice(this, start, end);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return utf16leSlice(this, start, end);
        default:
          if (loweredCase)
            throw new TypeError("Unknown encoding: " + encoding);
          encoding = (encoding + "").toLowerCase();
          loweredCase = true;
      }
    }
  }
  Buffer2.prototype._isBuffer = true;
  function swap(b, n, m) {
    var i = b[n];
    b[n] = b[m];
    b[m] = i;
  }
  Buffer2.prototype.swap16 = function swap16() {
    var len = this.length;
    if (len % 2 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    }
    for (var i = 0; i < len; i += 2) {
      swap(this, i, i + 1);
    }
    return this;
  };
  Buffer2.prototype.swap32 = function swap32() {
    var len = this.length;
    if (len % 4 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    }
    for (var i = 0; i < len; i += 4) {
      swap(this, i, i + 3);
      swap(this, i + 1, i + 2);
    }
    return this;
  };
  Buffer2.prototype.swap64 = function swap64() {
    var len = this.length;
    if (len % 8 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    }
    for (var i = 0; i < len; i += 8) {
      swap(this, i, i + 7);
      swap(this, i + 1, i + 6);
      swap(this, i + 2, i + 5);
      swap(this, i + 3, i + 4);
    }
    return this;
  };
  Buffer2.prototype.toString = function toString() {
    var length = this.length;
    if (length === 0)
      return "";
    if (arguments.length === 0)
      return utf8Slice(this, 0, length);
    return slowToString.apply(this, arguments);
  };
  Buffer2.prototype.toLocaleString = Buffer2.prototype.toString;
  Buffer2.prototype.equals = function equals(b) {
    if (!Buffer2.isBuffer(b))
      throw new TypeError("Argument must be a Buffer");
    if (this === b)
      return true;
    return Buffer2.compare(this, b) === 0;
  };
  Buffer2.prototype.inspect = function inspect2() {
    var str = "";
    var max = exports.INSPECT_MAX_BYTES;
    str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
    if (this.length > max)
      str += " ... ";
    return "<Buffer " + str + ">";
  };
  if (customInspectSymbol) {
    Buffer2.prototype[customInspectSymbol] = Buffer2.prototype.inspect;
  }
  Buffer2.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
    if (isInstance(target, Uint8Array)) {
      target = Buffer2.from(target, target.offset, target.byteLength);
    }
    if (!Buffer2.isBuffer(target)) {
      throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + babelHelpers["typeof"](target));
    }
    if (start === void 0) {
      start = 0;
    }
    if (end === void 0) {
      end = target ? target.length : 0;
    }
    if (thisStart === void 0) {
      thisStart = 0;
    }
    if (thisEnd === void 0) {
      thisEnd = this.length;
    }
    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
      throw new RangeError("out of range index");
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
    if (this === target)
      return 0;
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
    if (x < y)
      return -1;
    if (y < x)
      return 1;
    return 0;
  };
  function bidirectionalIndexOf(buffer3, val, byteOffset, encoding, dir) {
    if (buffer3.length === 0)
      return -1;
    if (typeof byteOffset === "string") {
      encoding = byteOffset;
      byteOffset = 0;
    } else if (byteOffset > 2147483647) {
      byteOffset = 2147483647;
    } else if (byteOffset < -2147483648) {
      byteOffset = -2147483648;
    }
    byteOffset = +byteOffset;
    if (numberIsNaN(byteOffset)) {
      byteOffset = dir ? 0 : buffer3.length - 1;
    }
    if (byteOffset < 0)
      byteOffset = buffer3.length + byteOffset;
    if (byteOffset >= buffer3.length) {
      if (dir)
        return -1;
      else
        byteOffset = buffer3.length - 1;
    } else if (byteOffset < 0) {
      if (dir)
        byteOffset = 0;
      else
        return -1;
    }
    if (typeof val === "string") {
      val = Buffer2.from(val, encoding);
    }
    if (Buffer2.isBuffer(val)) {
      if (val.length === 0) {
        return -1;
      }
      return arrayIndexOf(buffer3, val, byteOffset, encoding, dir);
    } else if (typeof val === "number") {
      val = val & 255;
      if (typeof Uint8Array.prototype.indexOf === "function") {
        if (dir) {
          return Uint8Array.prototype.indexOf.call(buffer3, val, byteOffset);
        } else {
          return Uint8Array.prototype.lastIndexOf.call(buffer3, val, byteOffset);
        }
      }
      return arrayIndexOf(buffer3, [val], byteOffset, encoding, dir);
    }
    throw new TypeError("val must be string, number or Buffer");
  }
  function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
    var indexSize = 1;
    var arrLength = arr.length;
    var valLength = val.length;
    if (encoding !== void 0) {
      encoding = String(encoding).toLowerCase();
      if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
        if (arr.length < 2 || val.length < 2) {
          return -1;
        }
        indexSize = 2;
        arrLength /= 2;
        valLength /= 2;
        byteOffset /= 2;
      }
    }
    function read3(buf, i2) {
      if (indexSize === 1) {
        return buf[i2];
      } else {
        return buf.readUInt16BE(i2 * indexSize);
      }
    }
    var i;
    if (dir) {
      var foundIndex = -1;
      for (i = byteOffset; i < arrLength; i++) {
        if (read3(arr, i) === read3(val, foundIndex === -1 ? 0 : i - foundIndex)) {
          if (foundIndex === -1)
            foundIndex = i;
          if (i - foundIndex + 1 === valLength)
            return foundIndex * indexSize;
        } else {
          if (foundIndex !== -1)
            i -= i - foundIndex;
          foundIndex = -1;
        }
      }
    } else {
      if (byteOffset + valLength > arrLength)
        byteOffset = arrLength - valLength;
      for (i = byteOffset; i >= 0; i--) {
        var found = true;
        for (var j = 0; j < valLength; j++) {
          if (read3(arr, i + j) !== read3(val, j)) {
            found = false;
            break;
          }
        }
        if (found)
          return i;
      }
    }
    return -1;
  }
  Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
  };
  Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
  };
  Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
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
      if (numberIsNaN(parsed))
        return i;
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
  function latin1Write(buf, string, offset, length) {
    return asciiWrite(buf, string, offset, length);
  }
  function base64Write(buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length);
  }
  function ucs2Write(buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
  }
  Buffer2.prototype.write = function write3(string, offset, length, encoding) {
    if (offset === void 0) {
      encoding = "utf8";
      length = this.length;
      offset = 0;
    } else if (length === void 0 && typeof offset === "string") {
      encoding = offset;
      length = this.length;
      offset = 0;
    } else if (isFinite(offset)) {
      offset = offset >>> 0;
      if (isFinite(length)) {
        length = length >>> 0;
        if (encoding === void 0)
          encoding = "utf8";
      } else {
        encoding = length;
        length = void 0;
      }
    } else {
      throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
    }
    var remaining = this.length - offset;
    if (length === void 0 || length > remaining)
      length = remaining;
    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
      throw new RangeError("Attempt to write outside buffer bounds");
    }
    if (!encoding)
      encoding = "utf8";
    var loweredCase = false;
    for (; ; ) {
      switch (encoding) {
        case "hex":
          return hexWrite(this, string, offset, length);
        case "utf8":
        case "utf-8":
          return utf8Write(this, string, offset, length);
        case "ascii":
          return asciiWrite(this, string, offset, length);
        case "latin1":
        case "binary":
          return latin1Write(this, string, offset, length);
        case "base64":
          return base64Write(this, string, offset, length);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return ucs2Write(this, string, offset, length);
        default:
          if (loweredCase)
            throw new TypeError("Unknown encoding: " + encoding);
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  };
  Buffer2.prototype.toJSON = function toJSON() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function base64Slice(buf, start, end) {
    if (start === 0 && end === buf.length) {
      return base64Js.fromByteArray(buf);
    } else {
      return base64Js.fromByteArray(buf.slice(start, end));
    }
  }
  function utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end);
    var res = [];
    var i = start;
    while (i < end) {
      var firstByte = buf[i];
      var codePoint = null;
      var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
      if (i + bytesPerSequence <= end) {
        var secondByte, thirdByte, fourthByte, tempCodePoint;
        switch (bytesPerSequence) {
          case 1:
            if (firstByte < 128) {
              codePoint = firstByte;
            }
            break;
          case 2:
            secondByte = buf[i + 1];
            if ((secondByte & 192) === 128) {
              tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
              if (tempCodePoint > 127) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 3:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
              tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
              if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 4:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            fourthByte = buf[i + 3];
            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
              tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
              if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                codePoint = tempCodePoint;
              }
            }
        }
      }
      if (codePoint === null) {
        codePoint = 65533;
        bytesPerSequence = 1;
      } else if (codePoint > 65535) {
        codePoint -= 65536;
        res.push(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | codePoint & 1023;
      }
      res.push(codePoint);
      i += bytesPerSequence;
    }
    return decodeCodePointsArray(res);
  }
  var MAX_ARGUMENTS_LENGTH = 4096;
  function decodeCodePointsArray(codePoints) {
    var len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) {
      return String.fromCharCode.apply(String, codePoints);
    }
    var res = "";
    var i = 0;
    while (i < len) {
      res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
    }
    return res;
  }
  function asciiSlice(buf, start, end) {
    var ret = "";
    end = Math.min(buf.length, end);
    for (var i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i] & 127);
    }
    return ret;
  }
  function latin1Slice(buf, start, end) {
    var ret = "";
    end = Math.min(buf.length, end);
    for (var i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i]);
    }
    return ret;
  }
  function hexSlice(buf, start, end) {
    var len = buf.length;
    if (!start || start < 0)
      start = 0;
    if (!end || end < 0 || end > len)
      end = len;
    var out = "";
    for (var i = start; i < end; ++i) {
      out += hexSliceLookupTable[buf[i]];
    }
    return out;
  }
  function utf16leSlice(buf, start, end) {
    var bytes = buf.slice(start, end);
    var res = "";
    for (var i = 0; i < bytes.length; i += 2) {
      res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    }
    return res;
  }
  Buffer2.prototype.slice = function slice(start, end) {
    var len = this.length;
    start = ~~start;
    end = end === void 0 ? len : ~~end;
    if (start < 0) {
      start += len;
      if (start < 0)
        start = 0;
    } else if (start > len) {
      start = len;
    }
    if (end < 0) {
      end += len;
      if (end < 0)
        end = 0;
    } else if (end > len) {
      end = len;
    }
    if (end < start)
      end = start;
    var newBuf = this.subarray(start, end);
    Object.setPrototypeOf(newBuf, Buffer2.prototype);
    return newBuf;
  };
  function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0)
      throw new RangeError("offset is not uint");
    if (offset + ext > length)
      throw new RangeError("Trying to access beyond buffer length");
  }
  Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert)
      checkOffset(offset, byteLength3, this.length);
    var val = this[offset];
    var mul = 1;
    var i = 0;
    while (++i < byteLength3 && (mul *= 256)) {
      val += this[offset + i] * mul;
    }
    return val;
  };
  Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      checkOffset(offset, byteLength3, this.length);
    }
    var val = this[offset + --byteLength3];
    var mul = 1;
    while (byteLength3 > 0 && (mul *= 256)) {
      val += this[offset + --byteLength3] * mul;
    }
    return val;
  };
  Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 1, this.length);
    return this[offset];
  };
  Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
  };
  Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
  };
  Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
  };
  Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
  };
  Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert)
      checkOffset(offset, byteLength3, this.length);
    var val = this[offset];
    var mul = 1;
    var i = 0;
    while (++i < byteLength3 && (mul *= 256)) {
      val += this[offset + i] * mul;
    }
    mul *= 128;
    if (val >= mul)
      val -= Math.pow(2, 8 * byteLength3);
    return val;
  };
  Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert)
      checkOffset(offset, byteLength3, this.length);
    var i = byteLength3;
    var mul = 1;
    var val = this[offset + --i];
    while (i > 0 && (mul *= 256)) {
      val += this[offset + --i] * mul;
    }
    mul *= 128;
    if (val >= mul)
      val -= Math.pow(2, 8 * byteLength3);
    return val;
  };
  Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 1, this.length);
    if (!(this[offset] & 128))
      return this[offset];
    return (255 - this[offset] + 1) * -1;
  };
  Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    var val = this[offset] | this[offset + 1] << 8;
    return val & 32768 ? val | 4294901760 : val;
  };
  Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    var val = this[offset + 1] | this[offset] << 8;
    return val & 32768 ? val | 4294901760 : val;
  };
  Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
  };
  Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
  };
  Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, true, 23, 4);
  };
  Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, false, 23, 4);
  };
  Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, true, 52, 8);
  };
  Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, false, 52, 8);
  };
  function checkInt(buf, value, offset, ext, max, min) {
    if (!Buffer2.isBuffer(buf))
      throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value > max || value < min)
      throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length)
      throw new RangeError("Index out of range");
  }
  Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength3, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      var maxBytes = Math.pow(2, 8 * byteLength3) - 1;
      checkInt(this, value, offset, byteLength3, maxBytes, 0);
    }
    var mul = 1;
    var i = 0;
    this[offset] = value & 255;
    while (++i < byteLength3 && (mul *= 256)) {
      this[offset + i] = value / mul & 255;
    }
    return offset + byteLength3;
  };
  Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength3, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      var maxBytes = Math.pow(2, 8 * byteLength3) - 1;
      checkInt(this, value, offset, byteLength3, maxBytes, 0);
    }
    var i = byteLength3 - 1;
    var mul = 1;
    this[offset + i] = value & 255;
    while (--i >= 0 && (mul *= 256)) {
      this[offset + i] = value / mul & 255;
    }
    return offset + byteLength3;
  };
  Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 1, 255, 0);
    this[offset] = value & 255;
    return offset + 1;
  };
  Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 2, 65535, 0);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    return offset + 2;
  };
  Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 2, 65535, 0);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
    return offset + 2;
  };
  Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 4, 4294967295, 0);
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 255;
    return offset + 4;
  };
  Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 4, 4294967295, 0);
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
    return offset + 4;
  };
  Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength3, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      var limit = Math.pow(2, 8 * byteLength3 - 1);
      checkInt(this, value, offset, byteLength3, limit - 1, -limit);
    }
    var i = 0;
    var mul = 1;
    var sub = 0;
    this[offset] = value & 255;
    while (++i < byteLength3 && (mul *= 256)) {
      if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
        sub = 1;
      }
      this[offset + i] = (value / mul >> 0) - sub & 255;
    }
    return offset + byteLength3;
  };
  Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength3, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      var limit = Math.pow(2, 8 * byteLength3 - 1);
      checkInt(this, value, offset, byteLength3, limit - 1, -limit);
    }
    var i = byteLength3 - 1;
    var mul = 1;
    var sub = 0;
    this[offset + i] = value & 255;
    while (--i >= 0 && (mul *= 256)) {
      if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
        sub = 1;
      }
      this[offset + i] = (value / mul >> 0) - sub & 255;
    }
    return offset + byteLength3;
  };
  Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 1, 127, -128);
    if (value < 0)
      value = 255 + value + 1;
    this[offset] = value & 255;
    return offset + 1;
  };
  Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 2, 32767, -32768);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    return offset + 2;
  };
  Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 2, 32767, -32768);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
    return offset + 2;
  };
  Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 4, 2147483647, -2147483648);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
    return offset + 4;
  };
  Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 4, 2147483647, -2147483648);
    if (value < 0)
      value = 4294967295 + value + 1;
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
    return offset + 4;
  };
  function checkIEEE754(buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length)
      throw new RangeError("Index out of range");
    if (offset < 0)
      throw new RangeError("Index out of range");
  }
  function writeFloat(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 4);
    }
    ieee754.write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
  }
  Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert);
  };
  Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert);
  };
  function writeDouble(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 8);
    }
    ieee754.write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
  }
  Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert);
  };
  Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert);
  };
  Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
    if (!Buffer2.isBuffer(target))
      throw new TypeError("argument should be a Buffer");
    if (!start)
      start = 0;
    if (!end && end !== 0)
      end = this.length;
    if (targetStart >= target.length)
      targetStart = target.length;
    if (!targetStart)
      targetStart = 0;
    if (end > 0 && end < start)
      end = start;
    if (end === start)
      return 0;
    if (target.length === 0 || this.length === 0)
      return 0;
    if (targetStart < 0) {
      throw new RangeError("targetStart out of bounds");
    }
    if (start < 0 || start >= this.length)
      throw new RangeError("Index out of range");
    if (end < 0)
      throw new RangeError("sourceEnd out of bounds");
    if (end > this.length)
      end = this.length;
    if (target.length - targetStart < end - start) {
      end = target.length - targetStart + start;
    }
    var len = end - start;
    if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
      this.copyWithin(targetStart, start, end);
    } else if (this === target && start < targetStart && targetStart < end) {
      for (var i = len - 1; i >= 0; --i) {
        target[i + targetStart] = this[i + start];
      }
    } else {
      Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
    }
    return len;
  };
  Buffer2.prototype.fill = function fill(val, start, end, encoding) {
    if (typeof val === "string") {
      if (typeof start === "string") {
        encoding = start;
        start = 0;
        end = this.length;
      } else if (typeof end === "string") {
        encoding = end;
        end = this.length;
      }
      if (encoding !== void 0 && typeof encoding !== "string") {
        throw new TypeError("encoding must be a string");
      }
      if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      if (val.length === 1) {
        var code2 = val.charCodeAt(0);
        if (encoding === "utf8" && code2 < 128 || encoding === "latin1") {
          val = code2;
        }
      }
    } else if (typeof val === "number") {
      val = val & 255;
    } else if (typeof val === "boolean") {
      val = Number(val);
    }
    if (start < 0 || this.length < start || this.length < end) {
      throw new RangeError("Out of range index");
    }
    if (end <= start) {
      return this;
    }
    start = start >>> 0;
    end = end === void 0 ? this.length : end >>> 0;
    if (!val)
      val = 0;
    var i;
    if (typeof val === "number") {
      for (i = start; i < end; ++i) {
        this[i] = val;
      }
    } else {
      var bytes = Buffer2.isBuffer(val) ? val : Buffer2.from(val, encoding);
      var len = bytes.length;
      if (len === 0) {
        throw new TypeError('The value "' + val + '" is invalid for argument "value"');
      }
      for (i = 0; i < end - start; ++i) {
        this[i + start] = bytes[i % len];
      }
    }
    return this;
  };
  var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
  function base64clean(str) {
    str = str.split("=")[0];
    str = str.trim().replace(INVALID_BASE64_RE, "");
    if (str.length < 2)
      return "";
    while (str.length % 4 !== 0) {
      str = str + "=";
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
      codePoint = string.charCodeAt(i);
      if (codePoint > 55295 && codePoint < 57344) {
        if (!leadSurrogate) {
          if (codePoint > 56319) {
            if ((units -= 3) > -1)
              bytes.push(239, 191, 189);
            continue;
          } else if (i + 1 === length) {
            if ((units -= 3) > -1)
              bytes.push(239, 191, 189);
            continue;
          }
          leadSurrogate = codePoint;
          continue;
        }
        if (codePoint < 56320) {
          if ((units -= 3) > -1)
            bytes.push(239, 191, 189);
          leadSurrogate = codePoint;
          continue;
        }
        codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
      } else if (leadSurrogate) {
        if ((units -= 3) > -1)
          bytes.push(239, 191, 189);
      }
      leadSurrogate = null;
      if (codePoint < 128) {
        if ((units -= 1) < 0)
          break;
        bytes.push(codePoint);
      } else if (codePoint < 2048) {
        if ((units -= 2) < 0)
          break;
        bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128);
      } else if (codePoint < 65536) {
        if ((units -= 3) < 0)
          break;
        bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
      } else if (codePoint < 1114112) {
        if ((units -= 4) < 0)
          break;
        bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
      } else {
        throw new Error("Invalid code point");
      }
    }
    return bytes;
  }
  function asciiToBytes(str) {
    var byteArray = [];
    for (var i = 0; i < str.length; ++i) {
      byteArray.push(str.charCodeAt(i) & 255);
    }
    return byteArray;
  }
  function utf16leToBytes(str, units) {
    var c, hi, lo;
    var byteArray = [];
    for (var i = 0; i < str.length; ++i) {
      if ((units -= 2) < 0)
        break;
      c = str.charCodeAt(i);
      hi = c >> 8;
      lo = c % 256;
      byteArray.push(lo);
      byteArray.push(hi);
    }
    return byteArray;
  }
  function base64ToBytes(str) {
    return base64Js.toByteArray(base64clean(str));
  }
  function blitBuffer(src, dst, offset, length) {
    for (var i = 0; i < length; ++i) {
      if (i + offset >= dst.length || i >= src.length)
        break;
      dst[i + offset] = src[i];
    }
    return i;
  }
  function isInstance(obj, type) {
    return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
  }
  function numberIsNaN(obj) {
    return obj !== obj;
  }
  var hexSliceLookupTable = function() {
    var alphabet = "0123456789abcdef";
    var table = new Array(256);
    for (var i = 0; i < 16; ++i) {
      var i16 = i * 16;
      for (var j = 0; j < 16; ++j) {
        table[i16 + j] = alphabet[i] + alphabet[j];
      }
    }
    return table;
  }();
});
var buffer_1 = buffer2.Buffer;
var buffer_2 = buffer2.SlowBuffer;
var buffer_3 = buffer2.INSPECT_MAX_BYTES;
var buffer_4 = buffer2.kMaxLength;
var require$$0 = {};
var inherits;
if (typeof Object.create === "function") {
  inherits = function inherits2(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  inherits = function inherits2(ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function TempCtor2() {
    };
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}
var inherits$1 = inherits;
var formatRegExp = /%[sdj%]/g;
function format(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(" ");
  }
  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x2) {
    if (x2 === "%%")
      return "%";
    if (i >= len)
      return x2;
    switch (x2) {
      case "%s":
        return String(args[i++]);
      case "%d":
        return Number(args[i++]);
      case "%j":
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return "[Circular]";
        }
      default:
        return x2;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += " " + x;
    } else {
      str += " " + inspect(x);
    }
  }
  return str;
}
function deprecate(fn, msg) {
  if (isUndefined(global$1.process)) {
    return function() {
      return deprecate(fn, msg).apply(this, arguments);
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
}
var debugs = {};
var debugEnviron;
function debuglog(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = "";
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp("\\b" + set + "\\b", "i").test(debugEnviron)) {
      var pid = 0;
      debugs[set] = function() {
        var msg = format.apply(null, arguments);
        console.error("%s %d: %s", set, pid, msg);
      };
    } else {
      debugs[set] = function() {
      };
    }
  }
  return debugs[set];
}
function inspect(obj, opts) {
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  if (arguments.length >= 3)
    ctx.depth = arguments[2];
  if (arguments.length >= 4)
    ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    ctx.showHidden = opts;
  } else if (opts) {
    _extend(ctx, opts);
  }
  if (isUndefined(ctx.showHidden))
    ctx.showHidden = false;
  if (isUndefined(ctx.depth))
    ctx.depth = 2;
  if (isUndefined(ctx.colors))
    ctx.colors = false;
  if (isUndefined(ctx.customInspect))
    ctx.customInspect = true;
  if (ctx.colors)
    ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
inspect.colors = {
  bold: [1, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  white: [37, 39],
  grey: [90, 39],
  black: [30, 39],
  blue: [34, 39],
  cyan: [36, 39],
  green: [32, 39],
  magenta: [35, 39],
  red: [31, 39],
  yellow: [33, 39]
};
inspect.styles = {
  special: "cyan",
  number: "yellow",
  boolean: "yellow",
  undefined: "grey",
  null: "bold",
  string: "green",
  date: "magenta",
  regexp: "red"
};
function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];
  if (style) {
    return "[" + inspect.colors[style][0] + "m" + str + "[" + inspect.colors[style][1] + "m";
  } else {
    return str;
  }
}
function stylizeNoColor(str, styleType) {
  return str;
}
function arrayToHash(array) {
  var hash = {};
  array.forEach(function(val, idx) {
    hash[val] = true;
  });
  return hash;
}
function formatValue(ctx, value, recurseTimes) {
  if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== inspect && !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);
  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }
  if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
    return formatError(value);
  }
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ": " + value.name : "";
      return ctx.stylize("[Function" + name + "]", "special");
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), "date");
    }
    if (isError(value)) {
      return formatError(value);
    }
  }
  var base = "", array = false, braces = ["{", "}"];
  if (isArray(value)) {
    array = true;
    braces = ["[", "]"];
  }
  if (isFunction(value)) {
    var n = value.name ? ": " + value.name : "";
    base = " [Function" + n + "]";
  }
  if (isRegExp(value)) {
    base = " " + RegExp.prototype.toString.call(value);
  }
  if (isDate(value)) {
    base = " " + Date.prototype.toUTCString.call(value);
  }
  if (isError(value)) {
    base = " " + formatError(value);
  }
  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }
  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
    } else {
      return ctx.stylize("[Object]", "special");
    }
  }
  ctx.seen.push(value);
  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }
  ctx.seen.pop();
  return reduceToSingleString(output, base, braces);
}
function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize("undefined", "undefined");
  if (isString(value)) {
    var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
    return ctx.stylize(simple, "string");
  }
  if (isNumber(value))
    return ctx.stylize("" + value, "number");
  if (isBoolean(value))
    return ctx.stylize("" + value, "boolean");
  if (isNull(value))
    return ctx.stylize("null", "null");
}
function formatError(value) {
  return "[" + Error.prototype.toString.call(value) + "]";
}
function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
    } else {
      output.push("");
    }
  }
  keys.forEach(function(key) {
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
      str = ctx.stylize("[Getter/Setter]", "special");
    } else {
      str = ctx.stylize("[Getter]", "special");
    }
  } else {
    if (desc.set) {
      str = ctx.stylize("[Setter]", "special");
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = "[" + key + "]";
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf("\n") > -1) {
        if (array) {
          str = str.split("\n").map(function(line) {
            return "  " + line;
          }).join("\n").substr(2);
        } else {
          str = "\n" + str.split("\n").map(function(line) {
            return "   " + line;
          }).join("\n");
        }
      }
    } else {
      str = ctx.stylize("[Circular]", "special");
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify("" + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, "name");
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, "string");
    }
  }
  return name + ": " + str;
}
function reduceToSingleString(output, base, braces) {
  var length = output.reduce(function(prev, cur) {
    if (cur.indexOf("\n") >= 0)
      ;
    return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
  }, 0);
  if (length > 60) {
    return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
  }
  return braces[0] + base + " " + output.join(", ") + " " + braces[1];
}
function isArray(ar) {
  return Array.isArray(ar);
}
function isBoolean(arg) {
  return typeof arg === "boolean";
}
function isNull(arg) {
  return arg === null;
}
function isNullOrUndefined(arg) {
  return arg == null;
}
function isNumber(arg) {
  return typeof arg === "number";
}
function isString(arg) {
  return typeof arg === "string";
}
function isSymbol(arg) {
  return babelHelpers["typeof"](arg) === "symbol";
}
function isUndefined(arg) {
  return arg === void 0;
}
function isRegExp(re) {
  return isObject(re) && objectToString(re) === "[object RegExp]";
}
function isObject(arg) {
  return babelHelpers["typeof"](arg) === "object" && arg !== null;
}
function isDate(d) {
  return isObject(d) && objectToString(d) === "[object Date]";
}
function isError(e) {
  return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
}
function isFunction(arg) {
  return typeof arg === "function";
}
function isPrimitive(arg) {
  return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || babelHelpers["typeof"](arg) === "symbol" || typeof arg === "undefined";
}
function isBuffer(maybeBuf) {
  return Buffer.isBuffer(maybeBuf);
}
function objectToString(o) {
  return Object.prototype.toString.call(o);
}
function pad(n) {
  return n < 10 ? "0" + n.toString(10) : n.toString(10);
}
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(":");
  return [d.getDate(), months[d.getMonth()], time].join(" ");
}
function log() {
  console.log("%s - %s", timestamp(), format.apply(null, arguments));
}
function _extend(origin, add) {
  if (!add || !isObject(add))
    return origin;
  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
}
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
var require$$1 = {
  inherits: inherits$1,
  _extend,
  log,
  isBuffer,
  isPrimitive,
  isFunction,
  isError,
  isDate,
  isObject,
  isRegExp,
  isUndefined,
  isSymbol,
  isString,
  isNumber,
  isNullOrUndefined,
  isNull,
  isBoolean,
  isArray,
  inspect,
  deprecate,
  format,
  debuglog
};
var utils = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.deprecate = exports.isObjectLike = exports.isDate = exports.isBuffer = exports.haveBuffer = exports.isBigUInt64Array = exports.isBigInt64Array = exports.isUint8Array = exports.randomBytes = exports.normalizedFunctionString = void 0;
  function normalizedFunctionString(fn) {
    return fn.toString().replace("function(", "function (");
  }
  exports.normalizedFunctionString = normalizedFunctionString;
  function insecureRandomBytes(size) {
    const result = buffer2.Buffer.alloc(size);
    for (let i = 0; i < size; ++i)
      result[i] = Math.floor(Math.random() * 256);
    return result;
  }
  exports.randomBytes = insecureRandomBytes;
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    exports.randomBytes = (size) => window.crypto.getRandomValues(buffer2.Buffer.alloc(size));
  } else {
    try {
      exports.randomBytes = require$$0.randomBytes;
    } catch (e) {
    }
    if (exports.randomBytes == null) {
      exports.randomBytes = insecureRandomBytes;
    }
  }
  function isUint8Array(value) {
    return Object.prototype.toString.call(value) === "[object Uint8Array]";
  }
  exports.isUint8Array = isUint8Array;
  function isBigInt64Array(value) {
    return Object.prototype.toString.call(value) === "[object BigInt64Array]";
  }
  exports.isBigInt64Array = isBigInt64Array;
  function isBigUInt64Array(value) {
    return Object.prototype.toString.call(value) === "[object BigUint64Array]";
  }
  exports.isBigUInt64Array = isBigUInt64Array;
  function haveBuffer() {
    return typeof commonjsGlobal !== "undefined" && typeof commonjsGlobal.Buffer !== "undefined";
  }
  exports.haveBuffer = haveBuffer;
  function isBuffer2(value) {
    var _a;
    return typeof value === "object" && ((_a = value === null || value === void 0 ? void 0 : value.constructor) === null || _a === void 0 ? void 0 : _a.name) === "Buffer";
  }
  exports.isBuffer = isBuffer2;
  function isDate2(d) {
    return isObjectLike(d) && Object.prototype.toString.call(d) === "[object Date]";
  }
  exports.isDate = isDate2;
  function isObjectLike(candidate) {
    return typeof candidate === "object" && candidate !== null;
  }
  exports.isObjectLike = isObjectLike;
  function deprecate2(fn, message) {
    if (typeof window === "undefined" || typeof self === "undefined") {
      return require$$1.deprecate(fn, message);
    }
    let warned = false;
    function deprecated(...args) {
      if (!warned) {
        console.warn(message);
        warned = true;
      }
      return fn.apply(this, ...args);
    }
    return deprecated;
  }
  exports.deprecate = deprecate2;
});
unwrapExports(utils);
var utils_1 = utils.deprecate;
var utils_2 = utils.isObjectLike;
var utils_3 = utils.isDate;
var utils_4 = utils.isBuffer;
var utils_5 = utils.haveBuffer;
var utils_6 = utils.isBigUInt64Array;
var utils_7 = utils.isBigInt64Array;
var utils_8 = utils.isUint8Array;
var utils_9 = utils.randomBytes;
var utils_10 = utils.normalizedFunctionString;
var ensure_buffer = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.ensureBuffer = void 0;
  function ensureBuffer(potentialBuffer) {
    if (utils.isBuffer(potentialBuffer)) {
      return potentialBuffer;
    }
    if (ArrayBuffer.isView(potentialBuffer)) {
      return buffer2.Buffer.from(potentialBuffer.buffer);
    }
    if (potentialBuffer instanceof ArrayBuffer) {
      return buffer2.Buffer.from(potentialBuffer);
    }
    throw new TypeError("Must use either Buffer or TypedArray");
  }
  exports.ensureBuffer = ensureBuffer;
});
unwrapExports(ensure_buffer);
var ensure_buffer_1 = ensure_buffer.ensureBuffer;
var uuid = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.parseUUID = void 0;
  const UUID_RX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
  function parseUUID(uuid2) {
    if (typeof uuid2 !== "string") {
      throw new TypeError("Invalid type for UUID, expected string but got " + typeof uuid2);
    }
    if (!UUID_RX.test(uuid2)) {
      throw new TypeError("Invalid format for UUID: " + uuid2);
    }
    let v;
    const arr = new Uint8Array(16);
    arr[0] = (v = parseInt(uuid2.slice(0, 8), 16)) >>> 24;
    arr[1] = v >>> 16 & 255;
    arr[2] = v >>> 8 & 255;
    arr[3] = v & 255;
    arr[4] = (v = parseInt(uuid2.slice(9, 13), 16)) >>> 8;
    arr[5] = v & 255;
    arr[6] = (v = parseInt(uuid2.slice(14, 18), 16)) >>> 8;
    arr[7] = v & 255;
    arr[8] = (v = parseInt(uuid2.slice(19, 23), 16)) >>> 8;
    arr[9] = v & 255;
    arr[10] = (v = parseInt(uuid2.slice(24, 36), 16)) / 1099511627776 & 255;
    arr[11] = v / 4294967296 & 255;
    arr[12] = v >>> 24 & 255;
    arr[13] = v >>> 16 & 255;
    arr[14] = v >>> 8 & 255;
    arr[15] = v & 255;
    return arr;
  }
  exports.parseUUID = parseUUID;
});
unwrapExports(uuid);
var uuid_1 = uuid.parseUUID;
var binary = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Binary = void 0;
  class Binary {
    constructor(buffer$1, subType) {
      if (!(buffer$1 == null) && !(typeof buffer$1 === "string") && !ArrayBuffer.isView(buffer$1) && !(buffer$1 instanceof ArrayBuffer) && !Array.isArray(buffer$1)) {
        throw new TypeError("Binary can only be constructed from string, Buffer, TypedArray, or Array<number>");
      }
      this.sub_type = subType !== null && subType !== void 0 ? subType : Binary.BSON_BINARY_SUBTYPE_DEFAULT;
      if (buffer$1 == null) {
        this.buffer = buffer2.Buffer.alloc(Binary.BUFFER_SIZE);
        this.position = 0;
      } else {
        if (typeof buffer$1 === "string") {
          this.buffer = buffer2.Buffer.from(buffer$1, "binary");
        } else if (Array.isArray(buffer$1)) {
          this.buffer = buffer2.Buffer.from(buffer$1);
        } else {
          this.buffer = ensure_buffer.ensureBuffer(buffer$1);
        }
        this.position = this.buffer.byteLength;
      }
    }
    put(byteValue) {
      if (typeof byteValue === "string" && byteValue.length !== 1) {
        throw new TypeError("only accepts single character String");
      } else if (typeof byteValue !== "number" && byteValue.length !== 1)
        throw new TypeError("only accepts single character Uint8Array or Array");
      let decodedByte;
      if (typeof byteValue === "string") {
        decodedByte = byteValue.charCodeAt(0);
      } else if (typeof byteValue === "number") {
        decodedByte = byteValue;
      } else {
        decodedByte = byteValue[0];
      }
      if (decodedByte < 0 || decodedByte > 255) {
        throw new TypeError("only accepts number in a valid unsigned byte range 0-255");
      }
      if (this.buffer.length > this.position) {
        this.buffer[this.position++] = decodedByte;
      } else {
        const buffer$1 = buffer2.Buffer.alloc(Binary.BUFFER_SIZE + this.buffer.length);
        this.buffer.copy(buffer$1, 0, 0, this.buffer.length);
        this.buffer = buffer$1;
        this.buffer[this.position++] = decodedByte;
      }
    }
    write(sequence, offset) {
      offset = typeof offset === "number" ? offset : this.position;
      if (this.buffer.length < offset + sequence.length) {
        const buffer$1 = buffer2.Buffer.alloc(this.buffer.length + sequence.length);
        this.buffer.copy(buffer$1, 0, 0, this.buffer.length);
        this.buffer = buffer$1;
      }
      if (ArrayBuffer.isView(sequence)) {
        this.buffer.set(ensure_buffer.ensureBuffer(sequence), offset);
        this.position = offset + sequence.byteLength > this.position ? offset + sequence.length : this.position;
      } else if (typeof sequence === "string") {
        this.buffer.write(sequence, offset, sequence.length, "binary");
        this.position = offset + sequence.length > this.position ? offset + sequence.length : this.position;
      }
    }
    read(position, length) {
      length = length && length > 0 ? length : this.position;
      return this.buffer.slice(position, position + length);
    }
    value(asRaw) {
      asRaw = !!asRaw;
      if (asRaw && this.buffer.length === this.position) {
        return this.buffer;
      }
      if (asRaw) {
        return this.buffer.slice(0, this.position);
      }
      return this.buffer.toString("binary", 0, this.position);
    }
    length() {
      return this.position;
    }
    toJSON() {
      return this.buffer.toString("base64");
    }
    toString(format2) {
      return this.buffer.toString(format2);
    }
    toExtendedJSON(options) {
      options = options || {};
      const base64String = this.buffer.toString("base64");
      const subType = Number(this.sub_type).toString(16);
      if (options.legacy) {
        return {
          $binary: base64String,
          $type: subType.length === 1 ? "0" + subType : subType
        };
      }
      return {
        $binary: {
          base64: base64String,
          subType: subType.length === 1 ? "0" + subType : subType
        }
      };
    }
    static fromExtendedJSON(doc, options) {
      options = options || {};
      let data;
      let type;
      if ("$binary" in doc) {
        if (options.legacy && typeof doc.$binary === "string" && "$type" in doc) {
          type = doc.$type ? parseInt(doc.$type, 16) : 0;
          data = buffer2.Buffer.from(doc.$binary, "base64");
        } else {
          if (typeof doc.$binary !== "string") {
            type = doc.$binary.subType ? parseInt(doc.$binary.subType, 16) : 0;
            data = buffer2.Buffer.from(doc.$binary.base64, "base64");
          }
        }
      } else if ("$uuid" in doc) {
        type = 4;
        data = buffer2.Buffer.from(uuid.parseUUID(doc.$uuid));
      }
      if (!data) {
        throw new TypeError(`Unexpected Binary Extended JSON format ${JSON.stringify(doc)}`);
      }
      return new Binary(data, type);
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.inspect();
    }
    inspect() {
      const asBuffer = this.value(true);
      return `Binary("${asBuffer.toString("hex")}", ${this.sub_type})`;
    }
  }
  exports.Binary = Binary;
  Binary.BSON_BINARY_SUBTYPE_DEFAULT = 0;
  Binary.BUFFER_SIZE = 256;
  Binary.SUBTYPE_DEFAULT = 0;
  Binary.SUBTYPE_FUNCTION = 1;
  Binary.SUBTYPE_BYTE_ARRAY = 2;
  Binary.SUBTYPE_UUID_OLD = 3;
  Binary.SUBTYPE_UUID = 4;
  Binary.SUBTYPE_MD5 = 5;
  Binary.SUBTYPE_USER_DEFINED = 128;
  Object.defineProperty(Binary.prototype, "_bsontype", {value: "Binary"});
});
unwrapExports(binary);
var binary_1 = binary.Binary;
var code$1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Code = void 0;
  class Code {
    constructor(code2, scope) {
      this.code = code2;
      this.scope = scope;
    }
    toJSON() {
      return {code: this.code, scope: this.scope};
    }
    toExtendedJSON() {
      if (this.scope) {
        return {$code: this.code, $scope: this.scope};
      }
      return {$code: this.code};
    }
    static fromExtendedJSON(doc) {
      return new Code(doc.$code, doc.$scope);
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.inspect();
    }
    inspect() {
      const codeJson = this.toJSON();
      return `Code("${codeJson.code}"${codeJson.scope ? `, ${JSON.stringify(codeJson.scope)}` : ""})`;
    }
  }
  exports.Code = Code;
  Object.defineProperty(Code.prototype, "_bsontype", {value: "Code"});
});
unwrapExports(code$1);
var code_1 = code$1.Code;
var db_ref = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.DBRef = exports.isDBRefLike = void 0;
  function isDBRefLike(value) {
    return utils.isObjectLike(value) && value["$id"] != null && value["$ref"] != null;
  }
  exports.isDBRefLike = isDBRefLike;
  class DBRef {
    constructor(collection, oid, db, fields) {
      const parts = collection.split(".");
      if (parts.length === 2) {
        db = parts.shift();
        collection = parts.shift();
      }
      this.collection = collection;
      this.oid = oid;
      this.db = db;
      this.fields = fields || {};
    }
    get namespace() {
      return this.collection;
    }
    set namespace(value) {
      this.collection = value;
    }
    toJSON() {
      const o = Object.assign({
        $ref: this.collection,
        $id: this.oid
      }, this.fields);
      if (this.db != null)
        o.$db = this.db;
      return o;
    }
    toExtendedJSON(options) {
      options = options || {};
      let o = {
        $ref: this.collection,
        $id: this.oid
      };
      if (options.legacy) {
        return o;
      }
      if (this.db)
        o.$db = this.db;
      o = Object.assign(o, this.fields);
      return o;
    }
    static fromExtendedJSON(doc) {
      const copy = Object.assign({}, doc);
      delete copy.$ref;
      delete copy.$id;
      delete copy.$db;
      return new DBRef(doc.$ref, doc.$id, doc.$db, copy);
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.inspect();
    }
    inspect() {
      const oid = this.oid === void 0 || this.oid.toString === void 0 ? this.oid : this.oid.toString();
      return `DBRef("${this.namespace}", "${oid}"${this.db ? `, "${this.db}"` : ""})`;
    }
  }
  exports.DBRef = DBRef;
  Object.defineProperty(DBRef.prototype, "_bsontype", {value: "DBRef"});
});
unwrapExports(db_ref);
var db_ref_1 = db_ref.DBRef;
var db_ref_2 = db_ref.isDBRefLike;
var long_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Long = void 0;
  let wasm = void 0;
  try {
    wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11])), {}).exports;
  } catch (_a) {
  }
  const TWO_PWR_16_DBL = 1 << 16;
  const TWO_PWR_24_DBL = 1 << 24;
  const TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
  const TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
  const TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
  const INT_CACHE = {};
  const UINT_CACHE = {};
  class Long {
    constructor(low = 0, high = 0, unsigned) {
      this.low = low | 0;
      this.high = high | 0;
      this.unsigned = !!unsigned;
      Object.defineProperty(this, "__isLong__", {
        value: true,
        configurable: false,
        writable: false,
        enumerable: false
      });
    }
    static fromBits(lowBits, highBits, unsigned) {
      return new Long(lowBits, highBits, unsigned);
    }
    static fromInt(value, unsigned) {
      let obj, cachedObj, cache;
      if (unsigned) {
        value >>>= 0;
        if (cache = 0 <= value && value < 256) {
          cachedObj = UINT_CACHE[value];
          if (cachedObj)
            return cachedObj;
        }
        obj = Long.fromBits(value, (value | 0) < 0 ? -1 : 0, true);
        if (cache)
          UINT_CACHE[value] = obj;
        return obj;
      } else {
        value |= 0;
        if (cache = -128 <= value && value < 128) {
          cachedObj = INT_CACHE[value];
          if (cachedObj)
            return cachedObj;
        }
        obj = Long.fromBits(value, value < 0 ? -1 : 0, false);
        if (cache)
          INT_CACHE[value] = obj;
        return obj;
      }
    }
    static fromNumber(value, unsigned) {
      if (isNaN(value))
        return unsigned ? Long.UZERO : Long.ZERO;
      if (unsigned) {
        if (value < 0)
          return Long.UZERO;
        if (value >= TWO_PWR_64_DBL)
          return Long.MAX_UNSIGNED_VALUE;
      } else {
        if (value <= -TWO_PWR_63_DBL)
          return Long.MIN_VALUE;
        if (value + 1 >= TWO_PWR_63_DBL)
          return Long.MAX_VALUE;
      }
      if (value < 0)
        return Long.fromNumber(-value, unsigned).neg();
      return Long.fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
    }
    static fromBigInt(value, unsigned) {
      return Long.fromString(value.toString(), unsigned);
    }
    static fromString(str, unsigned, radix) {
      if (str.length === 0)
        throw Error("empty string");
      if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
        return Long.ZERO;
      if (typeof unsigned === "number") {
        radix = unsigned, unsigned = false;
      } else {
        unsigned = !!unsigned;
      }
      radix = radix || 10;
      if (radix < 2 || 36 < radix)
        throw RangeError("radix");
      let p;
      if ((p = str.indexOf("-")) > 0)
        throw Error("interior hyphen");
      else if (p === 0) {
        return Long.fromString(str.substring(1), unsigned, radix).neg();
      }
      const radixToPower = Long.fromNumber(Math.pow(radix, 8));
      let result = Long.ZERO;
      for (let i = 0; i < str.length; i += 8) {
        const size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
        if (size < 8) {
          const power = Long.fromNumber(Math.pow(radix, size));
          result = result.mul(power).add(Long.fromNumber(value));
        } else {
          result = result.mul(radixToPower);
          result = result.add(Long.fromNumber(value));
        }
      }
      result.unsigned = unsigned;
      return result;
    }
    static fromBytes(bytes, unsigned, le) {
      return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
    }
    static fromBytesLE(bytes, unsigned) {
      return new Long(bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24, bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24, unsigned);
    }
    static fromBytesBE(bytes, unsigned) {
      return new Long(bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7], bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], unsigned);
    }
    static isLong(value) {
      return utils.isObjectLike(value) && value["__isLong__"] === true;
    }
    static fromValue(val, unsigned) {
      if (typeof val === "number")
        return Long.fromNumber(val, unsigned);
      if (typeof val === "string")
        return Long.fromString(val, unsigned);
      return Long.fromBits(val.low, val.high, typeof unsigned === "boolean" ? unsigned : val.unsigned);
    }
    add(addend) {
      if (!Long.isLong(addend))
        addend = Long.fromValue(addend);
      const a48 = this.high >>> 16;
      const a32 = this.high & 65535;
      const a16 = this.low >>> 16;
      const a00 = this.low & 65535;
      const b48 = addend.high >>> 16;
      const b32 = addend.high & 65535;
      const b16 = addend.low >>> 16;
      const b00 = addend.low & 65535;
      let c48 = 0, c32 = 0, c16 = 0, c00 = 0;
      c00 += a00 + b00;
      c16 += c00 >>> 16;
      c00 &= 65535;
      c16 += a16 + b16;
      c32 += c16 >>> 16;
      c16 &= 65535;
      c32 += a32 + b32;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c48 += a48 + b48;
      c48 &= 65535;
      return Long.fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
    }
    and(other) {
      if (!Long.isLong(other))
        other = Long.fromValue(other);
      return Long.fromBits(this.low & other.low, this.high & other.high, this.unsigned);
    }
    compare(other) {
      if (!Long.isLong(other))
        other = Long.fromValue(other);
      if (this.eq(other))
        return 0;
      const thisNeg = this.isNegative(), otherNeg = other.isNegative();
      if (thisNeg && !otherNeg)
        return -1;
      if (!thisNeg && otherNeg)
        return 1;
      if (!this.unsigned)
        return this.sub(other).isNegative() ? -1 : 1;
      return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
    }
    comp(other) {
      return this.compare(other);
    }
    divide(divisor) {
      if (!Long.isLong(divisor))
        divisor = Long.fromValue(divisor);
      if (divisor.isZero())
        throw Error("division by zero");
      if (wasm) {
        if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1) {
          return this;
        }
        const low = (this.unsigned ? wasm.div_u : wasm.div_s)(this.low, this.high, divisor.low, divisor.high);
        return Long.fromBits(low, wasm.get_high(), this.unsigned);
      }
      if (this.isZero())
        return this.unsigned ? Long.UZERO : Long.ZERO;
      let approx, rem, res;
      if (!this.unsigned) {
        if (this.eq(Long.MIN_VALUE)) {
          if (divisor.eq(Long.ONE) || divisor.eq(Long.NEG_ONE))
            return Long.MIN_VALUE;
          else if (divisor.eq(Long.MIN_VALUE))
            return Long.ONE;
          else {
            const halfThis = this.shr(1);
            approx = halfThis.div(divisor).shl(1);
            if (approx.eq(Long.ZERO)) {
              return divisor.isNegative() ? Long.ONE : Long.NEG_ONE;
            } else {
              rem = this.sub(divisor.mul(approx));
              res = approx.add(rem.div(divisor));
              return res;
            }
          }
        } else if (divisor.eq(Long.MIN_VALUE))
          return this.unsigned ? Long.UZERO : Long.ZERO;
        if (this.isNegative()) {
          if (divisor.isNegative())
            return this.neg().div(divisor.neg());
          return this.neg().div(divisor).neg();
        } else if (divisor.isNegative())
          return this.div(divisor.neg()).neg();
        res = Long.ZERO;
      } else {
        if (!divisor.unsigned)
          divisor = divisor.toUnsigned();
        if (divisor.gt(this))
          return Long.UZERO;
        if (divisor.gt(this.shru(1)))
          return Long.UONE;
        res = Long.UZERO;
      }
      rem = this;
      while (rem.gte(divisor)) {
        approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
        const log2 = Math.ceil(Math.log(approx) / Math.LN2);
        const delta = log2 <= 48 ? 1 : Math.pow(2, log2 - 48);
        let approxRes = Long.fromNumber(approx);
        let approxRem = approxRes.mul(divisor);
        while (approxRem.isNegative() || approxRem.gt(rem)) {
          approx -= delta;
          approxRes = Long.fromNumber(approx, this.unsigned);
          approxRem = approxRes.mul(divisor);
        }
        if (approxRes.isZero())
          approxRes = Long.ONE;
        res = res.add(approxRes);
        rem = rem.sub(approxRem);
      }
      return res;
    }
    div(divisor) {
      return this.divide(divisor);
    }
    equals(other) {
      if (!Long.isLong(other))
        other = Long.fromValue(other);
      if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1)
        return false;
      return this.high === other.high && this.low === other.low;
    }
    eq(other) {
      return this.equals(other);
    }
    getHighBits() {
      return this.high;
    }
    getHighBitsUnsigned() {
      return this.high >>> 0;
    }
    getLowBits() {
      return this.low;
    }
    getLowBitsUnsigned() {
      return this.low >>> 0;
    }
    getNumBitsAbs() {
      if (this.isNegative()) {
        return this.eq(Long.MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
      }
      const val = this.high !== 0 ? this.high : this.low;
      let bit;
      for (bit = 31; bit > 0; bit--)
        if ((val & 1 << bit) !== 0)
          break;
      return this.high !== 0 ? bit + 33 : bit + 1;
    }
    greaterThan(other) {
      return this.comp(other) > 0;
    }
    gt(other) {
      return this.greaterThan(other);
    }
    greaterThanOrEqual(other) {
      return this.comp(other) >= 0;
    }
    gte(other) {
      return this.greaterThanOrEqual(other);
    }
    ge(other) {
      return this.greaterThanOrEqual(other);
    }
    isEven() {
      return (this.low & 1) === 0;
    }
    isNegative() {
      return !this.unsigned && this.high < 0;
    }
    isOdd() {
      return (this.low & 1) === 1;
    }
    isPositive() {
      return this.unsigned || this.high >= 0;
    }
    isZero() {
      return this.high === 0 && this.low === 0;
    }
    lessThan(other) {
      return this.comp(other) < 0;
    }
    lt(other) {
      return this.lessThan(other);
    }
    lessThanOrEqual(other) {
      return this.comp(other) <= 0;
    }
    lte(other) {
      return this.lessThanOrEqual(other);
    }
    modulo(divisor) {
      if (!Long.isLong(divisor))
        divisor = Long.fromValue(divisor);
      if (wasm) {
        const low = (this.unsigned ? wasm.rem_u : wasm.rem_s)(this.low, this.high, divisor.low, divisor.high);
        return Long.fromBits(low, wasm.get_high(), this.unsigned);
      }
      return this.sub(this.div(divisor).mul(divisor));
    }
    mod(divisor) {
      return this.modulo(divisor);
    }
    rem(divisor) {
      return this.modulo(divisor);
    }
    multiply(multiplier) {
      if (this.isZero())
        return Long.ZERO;
      if (!Long.isLong(multiplier))
        multiplier = Long.fromValue(multiplier);
      if (wasm) {
        const low = wasm.mul(this.low, this.high, multiplier.low, multiplier.high);
        return Long.fromBits(low, wasm.get_high(), this.unsigned);
      }
      if (multiplier.isZero())
        return Long.ZERO;
      if (this.eq(Long.MIN_VALUE))
        return multiplier.isOdd() ? Long.MIN_VALUE : Long.ZERO;
      if (multiplier.eq(Long.MIN_VALUE))
        return this.isOdd() ? Long.MIN_VALUE : Long.ZERO;
      if (this.isNegative()) {
        if (multiplier.isNegative())
          return this.neg().mul(multiplier.neg());
        else
          return this.neg().mul(multiplier).neg();
      } else if (multiplier.isNegative())
        return this.mul(multiplier.neg()).neg();
      if (this.lt(Long.TWO_PWR_24) && multiplier.lt(Long.TWO_PWR_24))
        return Long.fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
      const a48 = this.high >>> 16;
      const a32 = this.high & 65535;
      const a16 = this.low >>> 16;
      const a00 = this.low & 65535;
      const b48 = multiplier.high >>> 16;
      const b32 = multiplier.high & 65535;
      const b16 = multiplier.low >>> 16;
      const b00 = multiplier.low & 65535;
      let c48 = 0, c32 = 0, c16 = 0, c00 = 0;
      c00 += a00 * b00;
      c16 += c00 >>> 16;
      c00 &= 65535;
      c16 += a16 * b00;
      c32 += c16 >>> 16;
      c16 &= 65535;
      c16 += a00 * b16;
      c32 += c16 >>> 16;
      c16 &= 65535;
      c32 += a32 * b00;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c32 += a16 * b16;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c32 += a00 * b32;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
      c48 &= 65535;
      return Long.fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
    }
    mul(multiplier) {
      return this.multiply(multiplier);
    }
    negate() {
      if (!this.unsigned && this.eq(Long.MIN_VALUE))
        return Long.MIN_VALUE;
      return this.not().add(Long.ONE);
    }
    neg() {
      return this.negate();
    }
    not() {
      return Long.fromBits(~this.low, ~this.high, this.unsigned);
    }
    notEquals(other) {
      return !this.equals(other);
    }
    neq(other) {
      return this.notEquals(other);
    }
    ne(other) {
      return this.notEquals(other);
    }
    or(other) {
      if (!Long.isLong(other))
        other = Long.fromValue(other);
      return Long.fromBits(this.low | other.low, this.high | other.high, this.unsigned);
    }
    shiftLeft(numBits) {
      if (Long.isLong(numBits))
        numBits = numBits.toInt();
      if ((numBits &= 63) === 0)
        return this;
      else if (numBits < 32)
        return Long.fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned);
      else
        return Long.fromBits(0, this.low << numBits - 32, this.unsigned);
    }
    shl(numBits) {
      return this.shiftLeft(numBits);
    }
    shiftRight(numBits) {
      if (Long.isLong(numBits))
        numBits = numBits.toInt();
      if ((numBits &= 63) === 0)
        return this;
      else if (numBits < 32)
        return Long.fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned);
      else
        return Long.fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
    }
    shr(numBits) {
      return this.shiftRight(numBits);
    }
    shiftRightUnsigned(numBits) {
      if (Long.isLong(numBits))
        numBits = numBits.toInt();
      numBits &= 63;
      if (numBits === 0)
        return this;
      else {
        const high = this.high;
        if (numBits < 32) {
          const low = this.low;
          return Long.fromBits(low >>> numBits | high << 32 - numBits, high >>> numBits, this.unsigned);
        } else if (numBits === 32)
          return Long.fromBits(high, 0, this.unsigned);
        else
          return Long.fromBits(high >>> numBits - 32, 0, this.unsigned);
      }
    }
    shr_u(numBits) {
      return this.shiftRightUnsigned(numBits);
    }
    shru(numBits) {
      return this.shiftRightUnsigned(numBits);
    }
    subtract(subtrahend) {
      if (!Long.isLong(subtrahend))
        subtrahend = Long.fromValue(subtrahend);
      return this.add(subtrahend.neg());
    }
    sub(subtrahend) {
      return this.subtract(subtrahend);
    }
    toInt() {
      return this.unsigned ? this.low >>> 0 : this.low;
    }
    toNumber() {
      if (this.unsigned)
        return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
      return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
    }
    toBigInt() {
      return BigInt(this.toString());
    }
    toBytes(le) {
      return le ? this.toBytesLE() : this.toBytesBE();
    }
    toBytesLE() {
      const hi = this.high, lo = this.low;
      return [
        lo & 255,
        lo >>> 8 & 255,
        lo >>> 16 & 255,
        lo >>> 24,
        hi & 255,
        hi >>> 8 & 255,
        hi >>> 16 & 255,
        hi >>> 24
      ];
    }
    toBytesBE() {
      const hi = this.high, lo = this.low;
      return [
        hi >>> 24,
        hi >>> 16 & 255,
        hi >>> 8 & 255,
        hi & 255,
        lo >>> 24,
        lo >>> 16 & 255,
        lo >>> 8 & 255,
        lo & 255
      ];
    }
    toSigned() {
      if (!this.unsigned)
        return this;
      return Long.fromBits(this.low, this.high, false);
    }
    toString(radix) {
      radix = radix || 10;
      if (radix < 2 || 36 < radix)
        throw RangeError("radix");
      if (this.isZero())
        return "0";
      if (this.isNegative()) {
        if (this.eq(Long.MIN_VALUE)) {
          const radixLong = Long.fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
          return div.toString(radix) + rem1.toInt().toString(radix);
        } else
          return "-" + this.neg().toString(radix);
      }
      const radixToPower = Long.fromNumber(Math.pow(radix, 6), this.unsigned);
      let rem = this;
      let result = "";
      while (true) {
        const remDiv = rem.div(radixToPower);
        const intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0;
        let digits = intval.toString(radix);
        rem = remDiv;
        if (rem.isZero()) {
          return digits + result;
        } else {
          while (digits.length < 6)
            digits = "0" + digits;
          result = "" + digits + result;
        }
      }
    }
    toUnsigned() {
      if (this.unsigned)
        return this;
      return Long.fromBits(this.low, this.high, true);
    }
    xor(other) {
      if (!Long.isLong(other))
        other = Long.fromValue(other);
      return Long.fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
    }
    eqz() {
      return this.isZero();
    }
    le(other) {
      return this.lessThanOrEqual(other);
    }
    toExtendedJSON(options) {
      if (options && options.relaxed)
        return this.toNumber();
      return {$numberLong: this.toString()};
    }
    static fromExtendedJSON(doc, options) {
      const result = Long.fromString(doc.$numberLong);
      return options && options.relaxed ? result.toNumber() : result;
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.inspect();
    }
    inspect() {
      return `Long("${this.toString()}")`;
    }
  }
  exports.Long = Long;
  Long.TWO_PWR_24 = Long.fromInt(TWO_PWR_24_DBL);
  Long.MAX_UNSIGNED_VALUE = Long.fromBits(4294967295 | 0, 4294967295 | 0, true);
  Long.ZERO = Long.fromInt(0);
  Long.UZERO = Long.fromInt(0, true);
  Long.ONE = Long.fromInt(1);
  Long.UONE = Long.fromInt(1, true);
  Long.NEG_ONE = Long.fromInt(-1);
  Long.MAX_VALUE = Long.fromBits(4294967295 | 0, 2147483647 | 0, false);
  Long.MIN_VALUE = Long.fromBits(0, 2147483648 | 0, false);
  Object.defineProperty(Long.prototype, "__isLong__", {value: true});
  Object.defineProperty(Long.prototype, "_bsontype", {value: "Long"});
});
unwrapExports(long_1);
var long_2 = long_1.Long;
var decimal128 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Decimal128 = void 0;
  const PARSE_STRING_REGEXP = /^(\+|-)?(\d+|(\d*\.\d*))?(E|e)?([-+])?(\d+)?$/;
  const PARSE_INF_REGEXP = /^(\+|-)?(Infinity|inf)$/i;
  const PARSE_NAN_REGEXP = /^(\+|-)?NaN$/i;
  const EXPONENT_MAX = 6111;
  const EXPONENT_MIN = -6176;
  const EXPONENT_BIAS = 6176;
  const MAX_DIGITS = 34;
  const NAN_BUFFER = [
    124,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ].reverse();
  const INF_NEGATIVE_BUFFER = [
    248,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ].reverse();
  const INF_POSITIVE_BUFFER = [
    120,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ].reverse();
  const EXPONENT_REGEX = /^([-+])?(\d+)?$/;
  const COMBINATION_MASK = 31;
  const EXPONENT_MASK = 16383;
  const COMBINATION_INFINITY = 30;
  const COMBINATION_NAN = 31;
  function isDigit(value) {
    return !isNaN(parseInt(value, 10));
  }
  function divideu128(value) {
    const DIVISOR = long_1.Long.fromNumber(1e3 * 1e3 * 1e3);
    let _rem = long_1.Long.fromNumber(0);
    if (!value.parts[0] && !value.parts[1] && !value.parts[2] && !value.parts[3]) {
      return {quotient: value, rem: _rem};
    }
    for (let i = 0; i <= 3; i++) {
      _rem = _rem.shiftLeft(32);
      _rem = _rem.add(new long_1.Long(value.parts[i], 0));
      value.parts[i] = _rem.div(DIVISOR).low;
      _rem = _rem.modulo(DIVISOR);
    }
    return {quotient: value, rem: _rem};
  }
  function multiply64x2(left, right) {
    if (!left && !right) {
      return {high: long_1.Long.fromNumber(0), low: long_1.Long.fromNumber(0)};
    }
    const leftHigh = left.shiftRightUnsigned(32);
    const leftLow = new long_1.Long(left.getLowBits(), 0);
    const rightHigh = right.shiftRightUnsigned(32);
    const rightLow = new long_1.Long(right.getLowBits(), 0);
    let productHigh = leftHigh.multiply(rightHigh);
    let productMid = leftHigh.multiply(rightLow);
    const productMid2 = leftLow.multiply(rightHigh);
    let productLow = leftLow.multiply(rightLow);
    productHigh = productHigh.add(productMid.shiftRightUnsigned(32));
    productMid = new long_1.Long(productMid.getLowBits(), 0).add(productMid2).add(productLow.shiftRightUnsigned(32));
    productHigh = productHigh.add(productMid.shiftRightUnsigned(32));
    productLow = productMid.shiftLeft(32).add(new long_1.Long(productLow.getLowBits(), 0));
    return {high: productHigh, low: productLow};
  }
  function lessThan(left, right) {
    const uhleft = left.high >>> 0;
    const uhright = right.high >>> 0;
    if (uhleft < uhright) {
      return true;
    } else if (uhleft === uhright) {
      const ulleft = left.low >>> 0;
      const ulright = right.low >>> 0;
      if (ulleft < ulright)
        return true;
    }
    return false;
  }
  function invalidErr(string, message) {
    throw new TypeError(`"${string}" is not a valid Decimal128 string - ${message}`);
  }
  class Decimal128 {
    constructor(bytes) {
      this.bytes = bytes;
    }
    static fromString(representation) {
      let isNegative = false;
      let sawRadix = false;
      let foundNonZero = false;
      let significantDigits = 0;
      let nDigitsRead = 0;
      let nDigits = 0;
      let radixPosition = 0;
      let firstNonZero = 0;
      const digits = [0];
      let nDigitsStored = 0;
      let digitsInsert = 0;
      let firstDigit = 0;
      let lastDigit = 0;
      let exponent = 0;
      let i = 0;
      let significandHigh = new long_1.Long(0, 0);
      let significandLow = new long_1.Long(0, 0);
      let biasedExponent = 0;
      let index = 0;
      if (representation.length >= 7e3) {
        throw new TypeError("" + representation + " not a valid Decimal128 string");
      }
      const stringMatch = representation.match(PARSE_STRING_REGEXP);
      const infMatch = representation.match(PARSE_INF_REGEXP);
      const nanMatch = representation.match(PARSE_NAN_REGEXP);
      if (!stringMatch && !infMatch && !nanMatch || representation.length === 0) {
        throw new TypeError("" + representation + " not a valid Decimal128 string");
      }
      if (stringMatch) {
        const unsignedNumber = stringMatch[2];
        const e = stringMatch[4];
        const expSign = stringMatch[5];
        const expNumber = stringMatch[6];
        if (e && expNumber === void 0)
          invalidErr(representation, "missing exponent power");
        if (e && unsignedNumber === void 0)
          invalidErr(representation, "missing exponent base");
        if (e === void 0 && (expSign || expNumber)) {
          invalidErr(representation, "missing e before exponent");
        }
      }
      if (representation[index] === "+" || representation[index] === "-") {
        isNegative = representation[index++] === "-";
      }
      if (!isDigit(representation[index]) && representation[index] !== ".") {
        if (representation[index] === "i" || representation[index] === "I") {
          return new Decimal128(buffer2.Buffer.from(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER));
        } else if (representation[index] === "N") {
          return new Decimal128(buffer2.Buffer.from(NAN_BUFFER));
        }
      }
      while (isDigit(representation[index]) || representation[index] === ".") {
        if (representation[index] === ".") {
          if (sawRadix)
            invalidErr(representation, "contains multiple periods");
          sawRadix = true;
          index = index + 1;
          continue;
        }
        if (nDigitsStored < 34) {
          if (representation[index] !== "0" || foundNonZero) {
            if (!foundNonZero) {
              firstNonZero = nDigitsRead;
            }
            foundNonZero = true;
            digits[digitsInsert++] = parseInt(representation[index], 10);
            nDigitsStored = nDigitsStored + 1;
          }
        }
        if (foundNonZero)
          nDigits = nDigits + 1;
        if (sawRadix)
          radixPosition = radixPosition + 1;
        nDigitsRead = nDigitsRead + 1;
        index = index + 1;
      }
      if (sawRadix && !nDigitsRead)
        throw new TypeError("" + representation + " not a valid Decimal128 string");
      if (representation[index] === "e" || representation[index] === "E") {
        const match = representation.substr(++index).match(EXPONENT_REGEX);
        if (!match || !match[2])
          return new Decimal128(buffer2.Buffer.from(NAN_BUFFER));
        exponent = parseInt(match[0], 10);
        index = index + match[0].length;
      }
      if (representation[index])
        return new Decimal128(buffer2.Buffer.from(NAN_BUFFER));
      firstDigit = 0;
      if (!nDigitsStored) {
        firstDigit = 0;
        lastDigit = 0;
        digits[0] = 0;
        nDigits = 1;
        nDigitsStored = 1;
        significantDigits = 0;
      } else {
        lastDigit = nDigitsStored - 1;
        significantDigits = nDigits;
        if (significantDigits !== 1) {
          while (representation[firstNonZero + significantDigits - 1] === "0") {
            significantDigits = significantDigits - 1;
          }
        }
      }
      if (exponent <= radixPosition && radixPosition - exponent > 1 << 14) {
        exponent = EXPONENT_MIN;
      } else {
        exponent = exponent - radixPosition;
      }
      while (exponent > EXPONENT_MAX) {
        lastDigit = lastDigit + 1;
        if (lastDigit - firstDigit > MAX_DIGITS) {
          const digitsString = digits.join("");
          if (digitsString.match(/^0+$/)) {
            exponent = EXPONENT_MAX;
            break;
          }
          invalidErr(representation, "overflow");
        }
        exponent = exponent - 1;
      }
      while (exponent < EXPONENT_MIN || nDigitsStored < nDigits) {
        if (lastDigit === 0 && significantDigits < nDigitsStored) {
          exponent = EXPONENT_MIN;
          significantDigits = 0;
          break;
        }
        if (nDigitsStored < nDigits) {
          nDigits = nDigits - 1;
        } else {
          lastDigit = lastDigit - 1;
        }
        if (exponent < EXPONENT_MAX) {
          exponent = exponent + 1;
        } else {
          const digitsString = digits.join("");
          if (digitsString.match(/^0+$/)) {
            exponent = EXPONENT_MAX;
            break;
          }
          invalidErr(representation, "overflow");
        }
      }
      if (lastDigit - firstDigit + 1 < significantDigits) {
        let endOfString = nDigitsRead;
        if (sawRadix) {
          firstNonZero = firstNonZero + 1;
          endOfString = endOfString + 1;
        }
        if (isNegative) {
          firstNonZero = firstNonZero + 1;
          endOfString = endOfString + 1;
        }
        const roundDigit = parseInt(representation[firstNonZero + lastDigit + 1], 10);
        let roundBit = 0;
        if (roundDigit >= 5) {
          roundBit = 1;
          if (roundDigit === 5) {
            roundBit = digits[lastDigit] % 2 === 1 ? 1 : 0;
            for (i = firstNonZero + lastDigit + 2; i < endOfString; i++) {
              if (parseInt(representation[i], 10)) {
                roundBit = 1;
                break;
              }
            }
          }
        }
        if (roundBit) {
          let dIdx = lastDigit;
          for (; dIdx >= 0; dIdx--) {
            if (++digits[dIdx] > 9) {
              digits[dIdx] = 0;
              if (dIdx === 0) {
                if (exponent < EXPONENT_MAX) {
                  exponent = exponent + 1;
                  digits[dIdx] = 1;
                } else {
                  return new Decimal128(buffer2.Buffer.from(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER));
                }
              }
            }
          }
        }
      }
      significandHigh = long_1.Long.fromNumber(0);
      significandLow = long_1.Long.fromNumber(0);
      if (significantDigits === 0) {
        significandHigh = long_1.Long.fromNumber(0);
        significandLow = long_1.Long.fromNumber(0);
      } else if (lastDigit - firstDigit < 17) {
        let dIdx = firstDigit;
        significandLow = long_1.Long.fromNumber(digits[dIdx++]);
        significandHigh = new long_1.Long(0, 0);
        for (; dIdx <= lastDigit; dIdx++) {
          significandLow = significandLow.multiply(long_1.Long.fromNumber(10));
          significandLow = significandLow.add(long_1.Long.fromNumber(digits[dIdx]));
        }
      } else {
        let dIdx = firstDigit;
        significandHigh = long_1.Long.fromNumber(digits[dIdx++]);
        for (; dIdx <= lastDigit - 17; dIdx++) {
          significandHigh = significandHigh.multiply(long_1.Long.fromNumber(10));
          significandHigh = significandHigh.add(long_1.Long.fromNumber(digits[dIdx]));
        }
        significandLow = long_1.Long.fromNumber(digits[dIdx++]);
        for (; dIdx <= lastDigit; dIdx++) {
          significandLow = significandLow.multiply(long_1.Long.fromNumber(10));
          significandLow = significandLow.add(long_1.Long.fromNumber(digits[dIdx]));
        }
      }
      const significand = multiply64x2(significandHigh, long_1.Long.fromString("100000000000000000"));
      significand.low = significand.low.add(significandLow);
      if (lessThan(significand.low, significandLow)) {
        significand.high = significand.high.add(long_1.Long.fromNumber(1));
      }
      biasedExponent = exponent + EXPONENT_BIAS;
      const dec = {low: long_1.Long.fromNumber(0), high: long_1.Long.fromNumber(0)};
      if (significand.high.shiftRightUnsigned(49).and(long_1.Long.fromNumber(1)).equals(long_1.Long.fromNumber(1))) {
        dec.high = dec.high.or(long_1.Long.fromNumber(3).shiftLeft(61));
        dec.high = dec.high.or(long_1.Long.fromNumber(biasedExponent).and(long_1.Long.fromNumber(16383).shiftLeft(47)));
        dec.high = dec.high.or(significand.high.and(long_1.Long.fromNumber(140737488355327)));
      } else {
        dec.high = dec.high.or(long_1.Long.fromNumber(biasedExponent & 16383).shiftLeft(49));
        dec.high = dec.high.or(significand.high.and(long_1.Long.fromNumber(562949953421311)));
      }
      dec.low = significand.low;
      if (isNegative) {
        dec.high = dec.high.or(long_1.Long.fromString("9223372036854775808"));
      }
      const buffer$1 = buffer2.Buffer.alloc(16);
      index = 0;
      buffer$1[index++] = dec.low.low & 255;
      buffer$1[index++] = dec.low.low >> 8 & 255;
      buffer$1[index++] = dec.low.low >> 16 & 255;
      buffer$1[index++] = dec.low.low >> 24 & 255;
      buffer$1[index++] = dec.low.high & 255;
      buffer$1[index++] = dec.low.high >> 8 & 255;
      buffer$1[index++] = dec.low.high >> 16 & 255;
      buffer$1[index++] = dec.low.high >> 24 & 255;
      buffer$1[index++] = dec.high.low & 255;
      buffer$1[index++] = dec.high.low >> 8 & 255;
      buffer$1[index++] = dec.high.low >> 16 & 255;
      buffer$1[index++] = dec.high.low >> 24 & 255;
      buffer$1[index++] = dec.high.high & 255;
      buffer$1[index++] = dec.high.high >> 8 & 255;
      buffer$1[index++] = dec.high.high >> 16 & 255;
      buffer$1[index++] = dec.high.high >> 24 & 255;
      return new Decimal128(buffer$1);
    }
    toString() {
      let biased_exponent;
      let significand_digits = 0;
      const significand = new Array(36);
      for (let i = 0; i < significand.length; i++)
        significand[i] = 0;
      let index = 0;
      let is_zero = false;
      let significand_msb;
      let significand128 = {parts: [0, 0, 0, 0]};
      let j, k;
      const string = [];
      index = 0;
      const buffer3 = this.bytes;
      const low = buffer3[index++] | buffer3[index++] << 8 | buffer3[index++] << 16 | buffer3[index++] << 24;
      const midl = buffer3[index++] | buffer3[index++] << 8 | buffer3[index++] << 16 | buffer3[index++] << 24;
      const midh = buffer3[index++] | buffer3[index++] << 8 | buffer3[index++] << 16 | buffer3[index++] << 24;
      const high = buffer3[index++] | buffer3[index++] << 8 | buffer3[index++] << 16 | buffer3[index++] << 24;
      index = 0;
      const dec = {
        low: new long_1.Long(low, midl),
        high: new long_1.Long(midh, high)
      };
      if (dec.high.lessThan(long_1.Long.ZERO)) {
        string.push("-");
      }
      const combination = high >> 26 & COMBINATION_MASK;
      if (combination >> 3 === 3) {
        if (combination === COMBINATION_INFINITY) {
          return string.join("") + "Infinity";
        } else if (combination === COMBINATION_NAN) {
          return "NaN";
        } else {
          biased_exponent = high >> 15 & EXPONENT_MASK;
          significand_msb = 8 + (high >> 14 & 1);
        }
      } else {
        significand_msb = high >> 14 & 7;
        biased_exponent = high >> 17 & EXPONENT_MASK;
      }
      const exponent = biased_exponent - EXPONENT_BIAS;
      significand128.parts[0] = (high & 16383) + ((significand_msb & 15) << 14);
      significand128.parts[1] = midh;
      significand128.parts[2] = midl;
      significand128.parts[3] = low;
      if (significand128.parts[0] === 0 && significand128.parts[1] === 0 && significand128.parts[2] === 0 && significand128.parts[3] === 0) {
        is_zero = true;
      } else {
        for (k = 3; k >= 0; k--) {
          let least_digits = 0;
          const result = divideu128(significand128);
          significand128 = result.quotient;
          least_digits = result.rem.low;
          if (!least_digits)
            continue;
          for (j = 8; j >= 0; j--) {
            significand[k * 9 + j] = least_digits % 10;
            least_digits = Math.floor(least_digits / 10);
          }
        }
      }
      if (is_zero) {
        significand_digits = 1;
        significand[index] = 0;
      } else {
        significand_digits = 36;
        while (!significand[index]) {
          significand_digits = significand_digits - 1;
          index = index + 1;
        }
      }
      const scientific_exponent = significand_digits - 1 + exponent;
      if (scientific_exponent >= 34 || scientific_exponent <= -7 || exponent > 0) {
        if (significand_digits > 34) {
          string.push(`${0}`);
          if (exponent > 0)
            string.push("E+" + exponent);
          else if (exponent < 0)
            string.push("E" + exponent);
          return string.join("");
        }
        string.push(`${significand[index++]}`);
        significand_digits = significand_digits - 1;
        if (significand_digits) {
          string.push(".");
        }
        for (let i = 0; i < significand_digits; i++) {
          string.push(`${significand[index++]}`);
        }
        string.push("E");
        if (scientific_exponent > 0) {
          string.push("+" + scientific_exponent);
        } else {
          string.push(`${scientific_exponent}`);
        }
      } else {
        if (exponent >= 0) {
          for (let i = 0; i < significand_digits; i++) {
            string.push(`${significand[index++]}`);
          }
        } else {
          let radix_position = significand_digits + exponent;
          if (radix_position > 0) {
            for (let i = 0; i < radix_position; i++) {
              string.push(`${significand[index++]}`);
            }
          } else {
            string.push("0");
          }
          string.push(".");
          while (radix_position++ < 0) {
            string.push("0");
          }
          for (let i = 0; i < significand_digits - Math.max(radix_position - 1, 0); i++) {
            string.push(`${significand[index++]}`);
          }
        }
      }
      return string.join("");
    }
    toJSON() {
      return {$numberDecimal: this.toString()};
    }
    toExtendedJSON() {
      return {$numberDecimal: this.toString()};
    }
    static fromExtendedJSON(doc) {
      return Decimal128.fromString(doc.$numberDecimal);
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.inspect();
    }
    inspect() {
      return `Decimal128("${this.toString()}")`;
    }
  }
  exports.Decimal128 = Decimal128;
  Object.defineProperty(Decimal128.prototype, "_bsontype", {value: "Decimal128"});
});
unwrapExports(decimal128);
var decimal128_1 = decimal128.Decimal128;
var double_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Double = void 0;
  class Double {
    constructor(value) {
      if (value instanceof Number) {
        value = value.valueOf();
      }
      this.value = +value;
    }
    valueOf() {
      return this.value;
    }
    toJSON() {
      return this.value;
    }
    toExtendedJSON(options) {
      if (options && (options.legacy || options.relaxed && isFinite(this.value))) {
        return this.value;
      }
      if (Object.is(Math.sign(this.value), -0)) {
        return {$numberDouble: `-${this.value.toFixed(1)}`};
      }
      let $numberDouble;
      if (Number.isInteger(this.value)) {
        $numberDouble = this.value.toFixed(1);
        if ($numberDouble.length >= 13) {
          $numberDouble = this.value.toExponential(13).toUpperCase();
        }
      } else {
        $numberDouble = this.value.toString();
      }
      return {$numberDouble};
    }
    static fromExtendedJSON(doc, options) {
      const doubleValue = parseFloat(doc.$numberDouble);
      return options && options.relaxed ? doubleValue : new Double(doubleValue);
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.inspect();
    }
    inspect() {
      const eJSON = this.toExtendedJSON();
      return `Double(${eJSON.$numberDouble})`;
    }
  }
  exports.Double = Double;
  Object.defineProperty(Double.prototype, "_bsontype", {value: "Double"});
});
unwrapExports(double_1);
var double_2 = double_1.Double;
var int_32 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Int32 = void 0;
  class Int32 {
    constructor(value) {
      if (value instanceof Number) {
        value = value.valueOf();
      }
      this.value = +value;
    }
    valueOf() {
      return this.value;
    }
    toJSON() {
      return this.value;
    }
    toExtendedJSON(options) {
      if (options && (options.relaxed || options.legacy))
        return this.value;
      return {$numberInt: this.value.toString()};
    }
    static fromExtendedJSON(doc, options) {
      return options && options.relaxed ? parseInt(doc.$numberInt, 10) : new Int32(doc.$numberInt);
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.inspect();
    }
    inspect() {
      return `Int32(${this.valueOf()})`;
    }
  }
  exports.Int32 = Int32;
  Object.defineProperty(Int32.prototype, "_bsontype", {value: "Int32"});
});
unwrapExports(int_32);
var int_32_1 = int_32.Int32;
var max_key = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.MaxKey = void 0;
  class MaxKey {
    toExtendedJSON() {
      return {$maxKey: 1};
    }
    static fromExtendedJSON() {
      return new MaxKey();
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.inspect();
    }
    inspect() {
      return "MaxKey()";
    }
  }
  exports.MaxKey = MaxKey;
  Object.defineProperty(MaxKey.prototype, "_bsontype", {value: "MaxKey"});
});
unwrapExports(max_key);
var max_key_1 = max_key.MaxKey;
var min_key = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.MinKey = void 0;
  class MinKey {
    toExtendedJSON() {
      return {$minKey: 1};
    }
    static fromExtendedJSON() {
      return new MinKey();
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.inspect();
    }
    inspect() {
      return "MinKey()";
    }
  }
  exports.MinKey = MinKey;
  Object.defineProperty(MinKey.prototype, "_bsontype", {value: "MinKey"});
});
unwrapExports(min_key);
var min_key_1 = min_key.MinKey;
var objectid = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.ObjectId = void 0;
  const PROCESS_UNIQUE = utils.randomBytes(5);
  const checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
  const hexTable = [];
  for (let i2 = 0; i2 < 256; i2++) {
    hexTable[i2] = (i2 <= 15 ? "0" : "") + i2.toString(16);
  }
  const decodeLookup = [];
  let i = 0;
  while (i < 10)
    decodeLookup[48 + i] = i++;
  while (i < 16)
    decodeLookup[65 - 10 + i] = decodeLookup[97 - 10 + i] = i++;
  const kId = Symbol("id");
  class ObjectId {
    constructor(id) {
      if (id instanceof ObjectId) {
        this[kId] = id.id;
        this.__id = id.__id;
      }
      if (typeof id === "object" && id && "id" in id) {
        if ("toHexString" in id && typeof id.toHexString === "function") {
          this[kId] = buffer2.Buffer.from(id.toHexString(), "hex");
        } else {
          this[kId] = typeof id.id === "string" ? buffer2.Buffer.from(id.id) : id.id;
        }
      }
      if (id == null || typeof id === "number") {
        this[kId] = ObjectId.generate(typeof id === "number" ? id : void 0);
        if (ObjectId.cacheHexString) {
          this.__id = this.id.toString("hex");
        }
      }
      if (ArrayBuffer.isView(id) && id.byteLength === 12) {
        this[kId] = ensure_buffer.ensureBuffer(id);
      }
      if (typeof id === "string") {
        if (id.length === 12) {
          const bytes = buffer2.Buffer.from(id);
          if (bytes.byteLength === 12) {
            this[kId] = bytes;
          }
        } else if (id.length === 24 && checkForHexRegExp.test(id)) {
          this[kId] = buffer2.Buffer.from(id, "hex");
        } else {
          throw new TypeError("Argument passed in must be a Buffer or string of 12 bytes or a string of 24 hex characters");
        }
      }
      if (ObjectId.cacheHexString) {
        this.__id = this.id.toString("hex");
      }
    }
    get id() {
      return this[kId];
    }
    set id(value) {
      this[kId] = value;
      if (ObjectId.cacheHexString) {
        this.__id = value.toString("hex");
      }
    }
    get generationTime() {
      return this.id.readInt32BE(0);
    }
    set generationTime(value) {
      this.id.writeUInt32BE(value, 0);
    }
    toHexString() {
      if (ObjectId.cacheHexString && this.__id) {
        return this.__id;
      }
      const hexString = this.id.toString("hex");
      if (ObjectId.cacheHexString && !this.__id) {
        this.__id = hexString;
      }
      return hexString;
    }
    static getInc() {
      return ObjectId.index = (ObjectId.index + 1) % 16777215;
    }
    static generate(time) {
      if (typeof time !== "number") {
        time = ~~(Date.now() / 1e3);
      }
      const inc = ObjectId.getInc();
      const buffer$1 = buffer2.Buffer.alloc(12);
      buffer$1.writeUInt32BE(time, 0);
      buffer$1[4] = PROCESS_UNIQUE[0];
      buffer$1[5] = PROCESS_UNIQUE[1];
      buffer$1[6] = PROCESS_UNIQUE[2];
      buffer$1[7] = PROCESS_UNIQUE[3];
      buffer$1[8] = PROCESS_UNIQUE[4];
      buffer$1[11] = inc & 255;
      buffer$1[10] = inc >> 8 & 255;
      buffer$1[9] = inc >> 16 & 255;
      return buffer$1;
    }
    toString(format2) {
      if (format2)
        return this.id.toString(format2);
      return this.toHexString();
    }
    toJSON() {
      return this.toHexString();
    }
    equals(otherId) {
      if (otherId === void 0 || otherId === null) {
        return false;
      }
      if (otherId instanceof ObjectId) {
        return this.toString() === otherId.toString();
      }
      if (typeof otherId === "string" && ObjectId.isValid(otherId) && otherId.length === 12 && this.id instanceof buffer2.Buffer) {
        return otherId === this.id.toString("binary");
      }
      if (typeof otherId === "string" && ObjectId.isValid(otherId) && otherId.length === 24) {
        return otherId.toLowerCase() === this.toHexString();
      }
      if (typeof otherId === "string" && ObjectId.isValid(otherId) && otherId.length === 12) {
        return buffer2.Buffer.from(otherId).equals(this.id);
      }
      if (typeof otherId === "object" && "toHexString" in otherId && typeof otherId.toHexString === "function") {
        return otherId.toHexString() === this.toHexString();
      }
      return false;
    }
    getTimestamp() {
      const timestamp2 = new Date();
      const time = this.id.readUInt32BE(0);
      timestamp2.setTime(Math.floor(time) * 1e3);
      return timestamp2;
    }
    static createPk() {
      return new ObjectId();
    }
    static createFromTime(time) {
      const buffer$1 = buffer2.Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      buffer$1.writeUInt32BE(time, 0);
      return new ObjectId(buffer$1);
    }
    static createFromHexString(hexString) {
      if (typeof hexString === "undefined" || hexString != null && hexString.length !== 24) {
        throw new TypeError("Argument passed in must be a single String of 12 bytes or a string of 24 hex characters");
      }
      return new ObjectId(buffer2.Buffer.from(hexString, "hex"));
    }
    static isValid(id) {
      if (id == null)
        return false;
      if (typeof id === "number") {
        return true;
      }
      if (typeof id === "string") {
        return id.length === 12 || id.length === 24 && checkForHexRegExp.test(id);
      }
      if (id instanceof ObjectId) {
        return true;
      }
      if (id instanceof buffer2.Buffer && id.length === 12) {
        return true;
      }
      if (typeof id === "object" && "toHexString" in id && typeof id.toHexString === "function") {
        if (typeof id.id === "string") {
          return id.id.length === 12;
        }
        return id.toHexString().length === 24 && checkForHexRegExp.test(id.id.toString("hex"));
      }
      return false;
    }
    toExtendedJSON() {
      if (this.toHexString)
        return {$oid: this.toHexString()};
      return {$oid: this.toString("hex")};
    }
    static fromExtendedJSON(doc) {
      return new ObjectId(doc.$oid);
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.inspect();
    }
    inspect() {
      return `ObjectId("${this.toHexString()}")`;
    }
  }
  exports.ObjectId = ObjectId;
  ObjectId.index = ~~(Math.random() * 16777215);
  Object.defineProperty(ObjectId.prototype, "generate", {
    value: utils.deprecate((time) => ObjectId.generate(time), "Please use the static `ObjectId.generate(time)` instead")
  });
  Object.defineProperty(ObjectId.prototype, "getInc", {
    value: utils.deprecate(() => ObjectId.getInc(), "Please use the static `ObjectId.getInc()` instead")
  });
  Object.defineProperty(ObjectId.prototype, "get_inc", {
    value: utils.deprecate(() => ObjectId.getInc(), "Please use the static `ObjectId.getInc()` instead")
  });
  Object.defineProperty(ObjectId, "get_inc", {
    value: utils.deprecate(() => ObjectId.getInc(), "Please use the static `ObjectId.getInc()` instead")
  });
  Object.defineProperty(ObjectId.prototype, "_bsontype", {value: "ObjectID"});
});
unwrapExports(objectid);
var objectid_1 = objectid.ObjectId;
var regexp = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.BSONRegExp = void 0;
  function alphabetize(str) {
    return str.split("").sort().join("");
  }
  class BSONRegExp {
    constructor(pattern, options) {
      this.pattern = pattern;
      this.options = options !== null && options !== void 0 ? options : "";
      alphabetize(this.options);
      for (let i = 0; i < this.options.length; i++) {
        if (!(this.options[i] === "i" || this.options[i] === "m" || this.options[i] === "x" || this.options[i] === "l" || this.options[i] === "s" || this.options[i] === "u")) {
          throw new Error(`The regular expression option [${this.options[i]}] is not supported`);
        }
      }
    }
    static parseOptions(options) {
      return options ? options.split("").sort().join("") : "";
    }
    toExtendedJSON(options) {
      options = options || {};
      if (options.legacy) {
        return {$regex: this.pattern, $options: this.options};
      }
      return {$regularExpression: {pattern: this.pattern, options: this.options}};
    }
    static fromExtendedJSON(doc) {
      if ("$regex" in doc) {
        if (typeof doc.$regex !== "string") {
          if (doc.$regex._bsontype === "BSONRegExp") {
            return doc;
          }
        } else {
          return new BSONRegExp(doc.$regex, BSONRegExp.parseOptions(doc.$options));
        }
      }
      if ("$regularExpression" in doc) {
        return new BSONRegExp(doc.$regularExpression.pattern, BSONRegExp.parseOptions(doc.$regularExpression.options));
      }
      throw new TypeError(`Unexpected BSONRegExp EJSON object form: ${JSON.stringify(doc)}`);
    }
  }
  exports.BSONRegExp = BSONRegExp;
  Object.defineProperty(BSONRegExp.prototype, "_bsontype", {value: "BSONRegExp"});
});
unwrapExports(regexp);
var regexp_1 = regexp.BSONRegExp;
var symbol = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.BSONSymbol = void 0;
  class BSONSymbol {
    constructor(value) {
      this.value = value;
    }
    valueOf() {
      return this.value;
    }
    toString() {
      return this.value;
    }
    inspect() {
      return `BSONSymbol("${this.value}")`;
    }
    toJSON() {
      return this.value;
    }
    toExtendedJSON() {
      return {$symbol: this.value};
    }
    static fromExtendedJSON(doc) {
      return new BSONSymbol(doc.$symbol);
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.inspect();
    }
  }
  exports.BSONSymbol = BSONSymbol;
  Object.defineProperty(BSONSymbol.prototype, "_bsontype", {value: "Symbol"});
});
unwrapExports(symbol);
var symbol_1 = symbol.BSONSymbol;
var timestamp$1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Timestamp = exports.LongWithoutOverridesClass = void 0;
  exports.LongWithoutOverridesClass = long_1.Long;
  class Timestamp extends exports.LongWithoutOverridesClass {
    constructor(low, high) {
      if (long_1.Long.isLong(low)) {
        super(low.low, low.high, true);
      } else {
        super(low, high, true);
      }
      Object.defineProperty(this, "_bsontype", {
        value: "Timestamp",
        writable: false,
        configurable: false,
        enumerable: false
      });
    }
    toJSON() {
      return {
        $timestamp: this.toString()
      };
    }
    static fromInt(value) {
      return new Timestamp(long_1.Long.fromInt(value, true));
    }
    static fromNumber(value) {
      return new Timestamp(long_1.Long.fromNumber(value, true));
    }
    static fromBits(lowBits, highBits) {
      return new Timestamp(lowBits, highBits);
    }
    static fromString(str, optRadix) {
      return new Timestamp(long_1.Long.fromString(str, true, optRadix));
    }
    toExtendedJSON() {
      return {$timestamp: {t: this.high >>> 0, i: this.low >>> 0}};
    }
    static fromExtendedJSON(doc) {
      return new Timestamp(doc.$timestamp.i, doc.$timestamp.t);
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return this.inspect();
    }
    inspect() {
      return `Timestamp(${this.getLowBits().toString()}, ${this.getHighBits().toString()})`;
    }
  }
  exports.Timestamp = Timestamp;
  Timestamp.MAX_VALUE = long_1.Long.MAX_UNSIGNED_VALUE;
});
unwrapExports(timestamp$1);
var timestamp_1 = timestamp$1.Timestamp;
var timestamp_2 = timestamp$1.LongWithoutOverridesClass;
var extended_json = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.EJSON = exports.isBSONType = void 0;
  function isBSONType(value) {
    return utils.isObjectLike(value) && Reflect.has(value, "_bsontype") && typeof value._bsontype === "string";
  }
  exports.isBSONType = isBSONType;
  const BSON_INT32_MAX = 2147483647;
  const BSON_INT32_MIN = -2147483648;
  const BSON_INT64_MAX = 9223372036854776e3;
  const BSON_INT64_MIN = -9223372036854776e3;
  const keysToCodecs = {
    $oid: objectid.ObjectId,
    $binary: binary.Binary,
    $uuid: binary.Binary,
    $symbol: symbol.BSONSymbol,
    $numberInt: int_32.Int32,
    $numberDecimal: decimal128.Decimal128,
    $numberDouble: double_1.Double,
    $numberLong: long_1.Long,
    $minKey: min_key.MinKey,
    $maxKey: max_key.MaxKey,
    $regex: regexp.BSONRegExp,
    $regularExpression: regexp.BSONRegExp,
    $timestamp: timestamp$1.Timestamp
  };
  function deserializeValue(value, options = {}) {
    if (typeof value === "number") {
      if (options.relaxed || options.legacy) {
        return value;
      }
      if (Math.floor(value) === value) {
        if (value >= BSON_INT32_MIN && value <= BSON_INT32_MAX)
          return new int_32.Int32(value);
        if (value >= BSON_INT64_MIN && value <= BSON_INT64_MAX)
          return long_1.Long.fromNumber(value);
      }
      return new double_1.Double(value);
    }
    if (value == null || typeof value !== "object")
      return value;
    if (value.$undefined)
      return null;
    const keys = Object.keys(value).filter((k) => k.startsWith("$") && value[k] != null);
    for (let i = 0; i < keys.length; i++) {
      const c = keysToCodecs[keys[i]];
      if (c)
        return c.fromExtendedJSON(value, options);
    }
    if (value.$date != null) {
      const d = value.$date;
      const date = new Date();
      if (options.legacy) {
        if (typeof d === "number")
          date.setTime(d);
        else if (typeof d === "string")
          date.setTime(Date.parse(d));
      } else {
        if (typeof d === "string")
          date.setTime(Date.parse(d));
        else if (long_1.Long.isLong(d))
          date.setTime(d.toNumber());
        else if (typeof d === "number" && options.relaxed)
          date.setTime(d);
      }
      return date;
    }
    if (value.$code != null) {
      const copy = Object.assign({}, value);
      if (value.$scope) {
        copy.$scope = deserializeValue(value.$scope);
      }
      return code$1.Code.fromExtendedJSON(value);
    }
    if (value.$ref != null || value.$dbPointer != null) {
      const v = value.$ref ? value : value.$dbPointer;
      if (v instanceof db_ref.DBRef)
        return v;
      const dollarKeys = Object.keys(v).filter((k) => k.startsWith("$"));
      let valid = true;
      dollarKeys.forEach((k) => {
        if (["$ref", "$id", "$db"].indexOf(k) === -1)
          valid = false;
      });
      if (valid)
        return db_ref.DBRef.fromExtendedJSON(v);
    }
    return value;
  }
  function serializeArray(array, options) {
    return array.map((v) => serializeValue(v, options));
  }
  function getISOString(date) {
    const isoStr = date.toISOString();
    return date.getUTCMilliseconds() !== 0 ? isoStr : isoStr.slice(0, -5) + "Z";
  }
  function serializeValue(value, options) {
    if (Array.isArray(value))
      return serializeArray(value, options);
    if (value === void 0)
      return null;
    if (value instanceof Date) {
      const dateNum = value.getTime(), inRange = dateNum > -1 && dateNum < 2534023188e5;
      if (options.legacy) {
        return options.relaxed && inRange ? {$date: value.getTime()} : {$date: getISOString(value)};
      }
      return options.relaxed && inRange ? {$date: getISOString(value)} : {$date: {$numberLong: value.getTime().toString()}};
    }
    if (typeof value === "number" && !options.relaxed) {
      if (Math.floor(value) === value) {
        const int32Range = value >= BSON_INT32_MIN && value <= BSON_INT32_MAX, int64Range = value >= BSON_INT64_MIN && value <= BSON_INT64_MAX;
        if (int32Range)
          return {$numberInt: value.toString()};
        if (int64Range)
          return {$numberLong: value.toString()};
      }
      return {$numberDouble: value.toString()};
    }
    if (value instanceof RegExp) {
      let flags = value.flags;
      if (flags === void 0) {
        const match = value.toString().match(/[gimuy]*$/);
        if (match) {
          flags = match[0];
        }
      }
      const rx = new regexp.BSONRegExp(value.source, flags);
      return rx.toExtendedJSON(options);
    }
    if (value != null && typeof value === "object")
      return serializeDocument(value, options);
    return value;
  }
  const BSON_TYPE_MAPPINGS = {
    Binary: (o) => new binary.Binary(o.value(), o.sub_type),
    Code: (o) => new code$1.Code(o.code, o.scope),
    DBRef: (o) => new db_ref.DBRef(o.collection || o.namespace, o.oid, o.db, o.fields),
    Decimal128: (o) => new decimal128.Decimal128(o.bytes),
    Double: (o) => new double_1.Double(o.value),
    Int32: (o) => new int_32.Int32(o.value),
    Long: (o) => long_1.Long.fromBits(o.low != null ? o.low : o.low_, o.low != null ? o.high : o.high_, o.low != null ? o.unsigned : o.unsigned_),
    MaxKey: () => new max_key.MaxKey(),
    MinKey: () => new min_key.MinKey(),
    ObjectID: (o) => new objectid.ObjectId(o),
    ObjectId: (o) => new objectid.ObjectId(o),
    BSONRegExp: (o) => new regexp.BSONRegExp(o.pattern, o.options),
    Symbol: (o) => new symbol.BSONSymbol(o.value),
    Timestamp: (o) => timestamp$1.Timestamp.fromBits(o.low, o.high)
  };
  function serializeDocument(doc, options) {
    if (doc == null || typeof doc !== "object")
      throw new Error("not an object instance");
    const bsontype = doc._bsontype;
    if (typeof bsontype === "undefined") {
      const _doc = {};
      for (const name in doc) {
        _doc[name] = serializeValue(doc[name], options);
      }
      return _doc;
    } else if (isBSONType(doc)) {
      let outDoc = doc;
      if (typeof outDoc.toExtendedJSON !== "function") {
        const mapper = BSON_TYPE_MAPPINGS[doc._bsontype];
        if (!mapper) {
          throw new TypeError("Unrecognized or invalid _bsontype: " + doc._bsontype);
        }
        outDoc = mapper(outDoc);
      }
      if (bsontype === "Code" && outDoc.scope) {
        outDoc = new code$1.Code(outDoc.code, serializeValue(outDoc.scope, options));
      } else if (bsontype === "DBRef" && outDoc.oid) {
        outDoc = new db_ref.DBRef(outDoc.collection, serializeValue(outDoc.oid, options), outDoc.db, outDoc.fields);
      }
      return outDoc.toExtendedJSON(options);
    } else {
      throw new Error("_bsontype must be a string, but was: " + typeof bsontype);
    }
  }
  var EJSON;
  (function(EJSON2) {
    function parse(text, options) {
      const finalOptions = Object.assign({}, {relaxed: true, legacy: false}, options);
      if (typeof finalOptions.relaxed === "boolean")
        finalOptions.strict = !finalOptions.relaxed;
      if (typeof finalOptions.strict === "boolean")
        finalOptions.relaxed = !finalOptions.strict;
      return JSON.parse(text, (_key, value) => deserializeValue(value, finalOptions));
    }
    EJSON2.parse = parse;
    function stringify(value, replacer, space, options) {
      if (space != null && typeof space === "object") {
        options = space;
        space = 0;
      }
      if (replacer != null && typeof replacer === "object" && !Array.isArray(replacer)) {
        options = replacer;
        replacer = void 0;
        space = 0;
      }
      options = Object.assign({}, {relaxed: true, legacy: false}, options);
      const doc = serializeValue(value, options);
      return JSON.stringify(doc, replacer, space);
    }
    EJSON2.stringify = stringify;
    function serialize(value, options) {
      options = options || {};
      return JSON.parse(stringify(value, options));
    }
    EJSON2.serialize = serialize;
    function deserialize(ejson, options) {
      options = options || {};
      return parse(JSON.stringify(ejson), options);
    }
    EJSON2.deserialize = deserialize;
  })(EJSON = exports.EJSON || (exports.EJSON = {}));
});
unwrapExports(extended_json);
var extended_json_1 = extended_json.EJSON;
var extended_json_2 = extended_json.isBSONType;
var map = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Map = void 0;
  let bsonMap;
  exports.Map = bsonMap;
  const check = function(potentialGlobal) {
    return potentialGlobal && potentialGlobal.Math == Math && potentialGlobal;
  };
  function getGlobal() {
    return check(typeof globalThis === "object" && globalThis) || check(typeof window === "object" && window) || check(typeof self === "object" && self) || check(typeof commonjsGlobal === "object" && commonjsGlobal) || Function("return this")();
  }
  const bsonGlobal = getGlobal();
  if (Object.prototype.hasOwnProperty.call(bsonGlobal, "Map")) {
    exports.Map = bsonMap = bsonGlobal.Map;
  } else {
    exports.Map = bsonMap = class Map {
      constructor(array = []) {
        this._keys = [];
        this._values = {};
        for (let i = 0; i < array.length; i++) {
          if (array[i] == null)
            continue;
          const entry = array[i];
          const key = entry[0];
          const value = entry[1];
          this._keys.push(key);
          this._values[key] = {v: value, i: this._keys.length - 1};
        }
      }
      clear() {
        this._keys = [];
        this._values = {};
      }
      delete(key) {
        const value = this._values[key];
        if (value == null)
          return false;
        delete this._values[key];
        this._keys.splice(value.i, 1);
        return true;
      }
      entries() {
        let index = 0;
        return {
          next: () => {
            const key = this._keys[index++];
            return {
              value: key !== void 0 ? [key, this._values[key].v] : void 0,
              done: key !== void 0 ? false : true
            };
          }
        };
      }
      forEach(callback, self2) {
        self2 = self2 || this;
        for (let i = 0; i < this._keys.length; i++) {
          const key = this._keys[i];
          callback.call(self2, this._values[key].v, key, self2);
        }
      }
      get(key) {
        return this._values[key] ? this._values[key].v : void 0;
      }
      has(key) {
        return this._values[key] != null;
      }
      keys() {
        let index = 0;
        return {
          next: () => {
            const key = this._keys[index++];
            return {
              value: key !== void 0 ? key : void 0,
              done: key !== void 0 ? false : true
            };
          }
        };
      }
      set(key, value) {
        if (this._values[key]) {
          this._values[key].v = value;
          return this;
        }
        this._keys.push(key);
        this._values[key] = {v: value, i: this._keys.length - 1};
        return this;
      }
      values() {
        let index = 0;
        return {
          next: () => {
            const key = this._keys[index++];
            return {
              value: key !== void 0 ? this._values[key].v : void 0,
              done: key !== void 0 ? false : true
            };
          }
        };
      }
      get size() {
        return this._keys.length;
      }
    };
  }
});
unwrapExports(map);
var map_1 = map.Map;
var constants = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.BSON_BINARY_SUBTYPE_USER_DEFINED = exports.BSON_BINARY_SUBTYPE_MD5 = exports.BSON_BINARY_SUBTYPE_UUID_NEW = exports.BSON_BINARY_SUBTYPE_UUID = exports.BSON_BINARY_SUBTYPE_BYTE_ARRAY = exports.BSON_BINARY_SUBTYPE_FUNCTION = exports.BSON_BINARY_SUBTYPE_DEFAULT = exports.BSON_DATA_MAX_KEY = exports.BSON_DATA_MIN_KEY = exports.BSON_DATA_DECIMAL128 = exports.BSON_DATA_LONG = exports.BSON_DATA_TIMESTAMP = exports.BSON_DATA_INT = exports.BSON_DATA_CODE_W_SCOPE = exports.BSON_DATA_SYMBOL = exports.BSON_DATA_CODE = exports.BSON_DATA_DBPOINTER = exports.BSON_DATA_REGEXP = exports.BSON_DATA_NULL = exports.BSON_DATA_DATE = exports.BSON_DATA_BOOLEAN = exports.BSON_DATA_OID = exports.BSON_DATA_UNDEFINED = exports.BSON_DATA_BINARY = exports.BSON_DATA_ARRAY = exports.BSON_DATA_OBJECT = exports.BSON_DATA_STRING = exports.BSON_DATA_NUMBER = exports.JS_INT_MIN = exports.JS_INT_MAX = exports.BSON_INT64_MIN = exports.BSON_INT64_MAX = exports.BSON_INT32_MIN = exports.BSON_INT32_MAX = void 0;
  exports.BSON_INT32_MAX = 2147483647;
  exports.BSON_INT32_MIN = -2147483648;
  exports.BSON_INT64_MAX = Math.pow(2, 63) - 1;
  exports.BSON_INT64_MIN = -Math.pow(2, 63);
  exports.JS_INT_MAX = Math.pow(2, 53);
  exports.JS_INT_MIN = -Math.pow(2, 53);
  exports.BSON_DATA_NUMBER = 1;
  exports.BSON_DATA_STRING = 2;
  exports.BSON_DATA_OBJECT = 3;
  exports.BSON_DATA_ARRAY = 4;
  exports.BSON_DATA_BINARY = 5;
  exports.BSON_DATA_UNDEFINED = 6;
  exports.BSON_DATA_OID = 7;
  exports.BSON_DATA_BOOLEAN = 8;
  exports.BSON_DATA_DATE = 9;
  exports.BSON_DATA_NULL = 10;
  exports.BSON_DATA_REGEXP = 11;
  exports.BSON_DATA_DBPOINTER = 12;
  exports.BSON_DATA_CODE = 13;
  exports.BSON_DATA_SYMBOL = 14;
  exports.BSON_DATA_CODE_W_SCOPE = 15;
  exports.BSON_DATA_INT = 16;
  exports.BSON_DATA_TIMESTAMP = 17;
  exports.BSON_DATA_LONG = 18;
  exports.BSON_DATA_DECIMAL128 = 19;
  exports.BSON_DATA_MIN_KEY = 255;
  exports.BSON_DATA_MAX_KEY = 127;
  exports.BSON_BINARY_SUBTYPE_DEFAULT = 0;
  exports.BSON_BINARY_SUBTYPE_FUNCTION = 1;
  exports.BSON_BINARY_SUBTYPE_BYTE_ARRAY = 2;
  exports.BSON_BINARY_SUBTYPE_UUID = 3;
  exports.BSON_BINARY_SUBTYPE_UUID_NEW = 4;
  exports.BSON_BINARY_SUBTYPE_MD5 = 5;
  exports.BSON_BINARY_SUBTYPE_USER_DEFINED = 128;
});
unwrapExports(constants);
var constants_1 = constants.BSON_BINARY_SUBTYPE_USER_DEFINED;
var constants_2 = constants.BSON_BINARY_SUBTYPE_MD5;
var constants_3 = constants.BSON_BINARY_SUBTYPE_UUID_NEW;
var constants_4 = constants.BSON_BINARY_SUBTYPE_UUID;
var constants_5 = constants.BSON_BINARY_SUBTYPE_BYTE_ARRAY;
var constants_6 = constants.BSON_BINARY_SUBTYPE_FUNCTION;
var constants_7 = constants.BSON_BINARY_SUBTYPE_DEFAULT;
var constants_8 = constants.BSON_DATA_MAX_KEY;
var constants_9 = constants.BSON_DATA_MIN_KEY;
var constants_10 = constants.BSON_DATA_DECIMAL128;
var constants_11 = constants.BSON_DATA_LONG;
var constants_12 = constants.BSON_DATA_TIMESTAMP;
var constants_13 = constants.BSON_DATA_INT;
var constants_14 = constants.BSON_DATA_CODE_W_SCOPE;
var constants_15 = constants.BSON_DATA_SYMBOL;
var constants_16 = constants.BSON_DATA_CODE;
var constants_17 = constants.BSON_DATA_DBPOINTER;
var constants_18 = constants.BSON_DATA_REGEXP;
var constants_19 = constants.BSON_DATA_NULL;
var constants_20 = constants.BSON_DATA_DATE;
var constants_21 = constants.BSON_DATA_BOOLEAN;
var constants_22 = constants.BSON_DATA_OID;
var constants_23 = constants.BSON_DATA_UNDEFINED;
var constants_24 = constants.BSON_DATA_BINARY;
var constants_25 = constants.BSON_DATA_ARRAY;
var constants_26 = constants.BSON_DATA_OBJECT;
var constants_27 = constants.BSON_DATA_STRING;
var constants_28 = constants.BSON_DATA_NUMBER;
var constants_29 = constants.JS_INT_MIN;
var constants_30 = constants.JS_INT_MAX;
var constants_31 = constants.BSON_INT64_MIN;
var constants_32 = constants.BSON_INT64_MAX;
var constants_33 = constants.BSON_INT32_MIN;
var constants_34 = constants.BSON_INT32_MAX;
var calculate_size = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.calculateObjectSize = void 0;
  function calculateObjectSize(object, serializeFunctions, ignoreUndefined) {
    let totalLength = 4 + 1;
    if (Array.isArray(object)) {
      for (let i = 0; i < object.length; i++) {
        totalLength += calculateElement(i.toString(), object[i], serializeFunctions, true, ignoreUndefined);
      }
    } else {
      if (object.toBSON) {
        object = object.toBSON();
      }
      for (const key in object) {
        totalLength += calculateElement(key, object[key], serializeFunctions, false, ignoreUndefined);
      }
    }
    return totalLength;
  }
  exports.calculateObjectSize = calculateObjectSize;
  function calculateElement(name, value, serializeFunctions = false, isArray2 = false, ignoreUndefined = false) {
    if (value && value.toBSON) {
      value = value.toBSON();
    }
    switch (typeof value) {
      case "string":
        return 1 + buffer2.Buffer.byteLength(name, "utf8") + 1 + 4 + buffer2.Buffer.byteLength(value, "utf8") + 1;
      case "number":
        if (Math.floor(value) === value && value >= constants.JS_INT_MIN && value <= constants.JS_INT_MAX) {
          if (value >= constants.BSON_INT32_MIN && value <= constants.BSON_INT32_MAX) {
            return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + (4 + 1);
          } else {
            return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + (8 + 1);
          }
        } else {
          return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + (8 + 1);
        }
      case "undefined":
        if (isArray2 || !ignoreUndefined)
          return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + 1;
        return 0;
      case "boolean":
        return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + (1 + 1);
      case "object":
        if (value == null || value["_bsontype"] === "MinKey" || value["_bsontype"] === "MaxKey") {
          return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + 1;
        } else if (value["_bsontype"] === "ObjectId" || value["_bsontype"] === "ObjectID") {
          return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + (12 + 1);
        } else if (value instanceof Date || utils.isDate(value)) {
          return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + (8 + 1);
        } else if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer) {
          return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + (1 + 4 + 1) + value.byteLength;
        } else if (value["_bsontype"] === "Long" || value["_bsontype"] === "Double" || value["_bsontype"] === "Timestamp") {
          return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + (8 + 1);
        } else if (value["_bsontype"] === "Decimal128") {
          return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + (16 + 1);
        } else if (value["_bsontype"] === "Code") {
          if (value.scope != null && Object.keys(value.scope).length > 0) {
            return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + 1 + 4 + 4 + buffer2.Buffer.byteLength(value.code.toString(), "utf8") + 1 + calculateObjectSize(value.scope, serializeFunctions, ignoreUndefined);
          } else {
            return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + 1 + 4 + buffer2.Buffer.byteLength(value.code.toString(), "utf8") + 1;
          }
        } else if (value["_bsontype"] === "Binary") {
          if (value.sub_type === binary.Binary.SUBTYPE_BYTE_ARRAY) {
            return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + (value.position + 1 + 4 + 1 + 4);
          } else {
            return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + (value.position + 1 + 4 + 1);
          }
        } else if (value["_bsontype"] === "Symbol") {
          return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + buffer2.Buffer.byteLength(value.value, "utf8") + 4 + 1 + 1;
        } else if (value["_bsontype"] === "DBRef") {
          const ordered_values = Object.assign({
            $ref: value.collection,
            $id: value.oid
          }, value.fields);
          if (value.db != null) {
            ordered_values["$db"] = value.db;
          }
          return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + 1 + calculateObjectSize(ordered_values, serializeFunctions, ignoreUndefined);
        } else if (value instanceof RegExp || Object.prototype.toString.call(value) === "[object RegExp]") {
          return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + 1 + buffer2.Buffer.byteLength(value.source, "utf8") + 1 + (value.global ? 1 : 0) + (value.ignoreCase ? 1 : 0) + (value.multiline ? 1 : 0) + 1;
        } else if (value["_bsontype"] === "BSONRegExp") {
          return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + 1 + buffer2.Buffer.byteLength(value.pattern, "utf8") + 1 + buffer2.Buffer.byteLength(value.options, "utf8") + 1;
        } else {
          return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + calculateObjectSize(value, serializeFunctions, ignoreUndefined) + 1;
        }
      case "function":
        if (value instanceof RegExp || Object.prototype.toString.call(value) === "[object RegExp]" || String.call(value) === "[object RegExp]") {
          return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + 1 + buffer2.Buffer.byteLength(value.source, "utf8") + 1 + (value.global ? 1 : 0) + (value.ignoreCase ? 1 : 0) + (value.multiline ? 1 : 0) + 1;
        } else {
          if (serializeFunctions && value.scope != null && Object.keys(value.scope).length > 0) {
            return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + 1 + 4 + 4 + buffer2.Buffer.byteLength(utils.normalizedFunctionString(value), "utf8") + 1 + calculateObjectSize(value.scope, serializeFunctions, ignoreUndefined);
          } else if (serializeFunctions) {
            return (name != null ? buffer2.Buffer.byteLength(name, "utf8") + 1 : 0) + 1 + 4 + buffer2.Buffer.byteLength(utils.normalizedFunctionString(value), "utf8") + 1;
          }
        }
    }
    return 0;
  }
});
unwrapExports(calculate_size);
var calculate_size_1 = calculate_size.calculateObjectSize;
var validate_utf8 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.validateUtf8 = void 0;
  const FIRST_BIT = 128;
  const FIRST_TWO_BITS = 192;
  const FIRST_THREE_BITS = 224;
  const FIRST_FOUR_BITS = 240;
  const FIRST_FIVE_BITS = 248;
  const TWO_BIT_CHAR = 192;
  const THREE_BIT_CHAR = 224;
  const FOUR_BIT_CHAR = 240;
  const CONTINUING_CHAR = 128;
  function validateUtf8(bytes, start, end) {
    let continuation = 0;
    for (let i = start; i < end; i += 1) {
      const byte = bytes[i];
      if (continuation) {
        if ((byte & FIRST_TWO_BITS) !== CONTINUING_CHAR) {
          return false;
        }
        continuation -= 1;
      } else if (byte & FIRST_BIT) {
        if ((byte & FIRST_THREE_BITS) === TWO_BIT_CHAR) {
          continuation = 1;
        } else if ((byte & FIRST_FOUR_BITS) === THREE_BIT_CHAR) {
          continuation = 2;
        } else if ((byte & FIRST_FIVE_BITS) === FOUR_BIT_CHAR) {
          continuation = 3;
        } else {
          return false;
        }
      }
    }
    return !continuation;
  }
  exports.validateUtf8 = validateUtf8;
});
unwrapExports(validate_utf8);
var validate_utf8_1 = validate_utf8.validateUtf8;
var deserializer = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.deserialize = void 0;
  const JS_INT_MAX_LONG = long_1.Long.fromNumber(constants.JS_INT_MAX);
  const JS_INT_MIN_LONG = long_1.Long.fromNumber(constants.JS_INT_MIN);
  const functionCache = {};
  function deserialize(buffer3, options, isArray2) {
    options = options == null ? {} : options;
    const index = options && options.index ? options.index : 0;
    const size = buffer3[index] | buffer3[index + 1] << 8 | buffer3[index + 2] << 16 | buffer3[index + 3] << 24;
    if (size < 5) {
      throw new Error(`bson size must be >= 5, is ${size}`);
    }
    if (options.allowObjectSmallerThanBufferSize && buffer3.length < size) {
      throw new Error(`buffer length ${buffer3.length} must be >= bson size ${size}`);
    }
    if (!options.allowObjectSmallerThanBufferSize && buffer3.length !== size) {
      throw new Error(`buffer length ${buffer3.length} must === bson size ${size}`);
    }
    if (size + index > buffer3.byteLength) {
      throw new Error(`(bson size ${size} + options.index ${index} must be <= buffer length ${buffer3.byteLength})`);
    }
    if (buffer3[index + size - 1] !== 0) {
      throw new Error("One object, sized correctly, with a spot for an EOO, but the EOO isn't 0x00");
    }
    return deserializeObject(buffer3, index, options, isArray2);
  }
  exports.deserialize = deserialize;
  function deserializeObject(buffer$1, index, options, isArray2 = false) {
    const evalFunctions = options["evalFunctions"] == null ? false : options["evalFunctions"];
    const cacheFunctions = options["cacheFunctions"] == null ? false : options["cacheFunctions"];
    const fieldsAsRaw = options["fieldsAsRaw"] == null ? null : options["fieldsAsRaw"];
    const raw = options["raw"] == null ? false : options["raw"];
    const bsonRegExp = typeof options["bsonRegExp"] === "boolean" ? options["bsonRegExp"] : false;
    const promoteBuffers = options["promoteBuffers"] == null ? false : options["promoteBuffers"];
    const promoteLongs = options["promoteLongs"] == null ? true : options["promoteLongs"];
    const promoteValues = options["promoteValues"] == null ? true : options["promoteValues"];
    const startIndex = index;
    if (buffer$1.length < 5)
      throw new Error("corrupt bson message < 5 bytes long");
    const size = buffer$1[index++] | buffer$1[index++] << 8 | buffer$1[index++] << 16 | buffer$1[index++] << 24;
    if (size < 5 || size > buffer$1.length)
      throw new Error("corrupt bson message");
    const object = isArray2 ? [] : {};
    let arrayIndex = 0;
    const done = false;
    while (!done) {
      const elementType = buffer$1[index++];
      if (elementType === 0)
        break;
      let i = index;
      while (buffer$1[i] !== 0 && i < buffer$1.length) {
        i++;
      }
      if (i >= buffer$1.byteLength)
        throw new Error("Bad BSON Document: illegal CString");
      const name = isArray2 ? arrayIndex++ : buffer$1.toString("utf8", index, i);
      index = i + 1;
      if (elementType === constants.BSON_DATA_STRING) {
        const stringSize = buffer$1[index++] | buffer$1[index++] << 8 | buffer$1[index++] << 16 | buffer$1[index++] << 24;
        if (stringSize <= 0 || stringSize > buffer$1.length - index || buffer$1[index + stringSize - 1] !== 0)
          throw new Error("bad string length in bson");
        if (!validate_utf8.validateUtf8(buffer$1, index, index + stringSize - 1)) {
          throw new Error("Invalid UTF-8 string in BSON document");
        }
        const s = buffer$1.toString("utf8", index, index + stringSize - 1);
        object[name] = s;
        index = index + stringSize;
      } else if (elementType === constants.BSON_DATA_OID) {
        const oid = buffer2.Buffer.alloc(12);
        buffer$1.copy(oid, 0, index, index + 12);
        object[name] = new objectid.ObjectId(oid);
        index = index + 12;
      } else if (elementType === constants.BSON_DATA_INT && promoteValues === false) {
        object[name] = new int_32.Int32(buffer$1[index++] | buffer$1[index++] << 8 | buffer$1[index++] << 16 | buffer$1[index++] << 24);
      } else if (elementType === constants.BSON_DATA_INT) {
        object[name] = buffer$1[index++] | buffer$1[index++] << 8 | buffer$1[index++] << 16 | buffer$1[index++] << 24;
      } else if (elementType === constants.BSON_DATA_NUMBER && promoteValues === false) {
        object[name] = new double_1.Double(buffer$1.readDoubleLE(index));
        index = index + 8;
      } else if (elementType === constants.BSON_DATA_NUMBER) {
        object[name] = buffer$1.readDoubleLE(index);
        index = index + 8;
      } else if (elementType === constants.BSON_DATA_DATE) {
        const lowBits = buffer$1[index++] | buffer$1[index++] << 8 | buffer$1[index++] << 16 | buffer$1[index++] << 24;
        const highBits = buffer$1[index++] | buffer$1[index++] << 8 | buffer$1[index++] << 16 | buffer$1[index++] << 24;
        object[name] = new Date(new long_1.Long(lowBits, highBits).toNumber());
      } else if (elementType === constants.BSON_DATA_BOOLEAN) {
        if (buffer$1[index] !== 0 && buffer$1[index] !== 1)
          throw new Error("illegal boolean type value");
        object[name] = buffer$1[index++] === 1;
      } else if (elementType === constants.BSON_DATA_OBJECT) {
        const _index = index;
        const objectSize = buffer$1[index] | buffer$1[index + 1] << 8 | buffer$1[index + 2] << 16 | buffer$1[index + 3] << 24;
        if (objectSize <= 0 || objectSize > buffer$1.length - index)
          throw new Error("bad embedded document length in bson");
        if (raw) {
          object[name] = buffer$1.slice(index, index + objectSize);
        } else {
          object[name] = deserializeObject(buffer$1, _index, options, false);
        }
        index = index + objectSize;
      } else if (elementType === constants.BSON_DATA_ARRAY) {
        const _index = index;
        const objectSize = buffer$1[index] | buffer$1[index + 1] << 8 | buffer$1[index + 2] << 16 | buffer$1[index + 3] << 24;
        let arrayOptions = options;
        const stopIndex = index + objectSize;
        if (fieldsAsRaw && fieldsAsRaw[name]) {
          arrayOptions = {};
          for (const n in options) {
            arrayOptions[n] = options[n];
          }
          arrayOptions["raw"] = true;
        }
        object[name] = deserializeObject(buffer$1, _index, arrayOptions, true);
        index = index + objectSize;
        if (buffer$1[index - 1] !== 0)
          throw new Error("invalid array terminator byte");
        if (index !== stopIndex)
          throw new Error("corrupted array bson");
      } else if (elementType === constants.BSON_DATA_UNDEFINED) {
        object[name] = void 0;
      } else if (elementType === constants.BSON_DATA_NULL) {
        object[name] = null;
      } else if (elementType === constants.BSON_DATA_LONG) {
        const lowBits = buffer$1[index++] | buffer$1[index++] << 8 | buffer$1[index++] << 16 | buffer$1[index++] << 24;
        const highBits = buffer$1[index++] | buffer$1[index++] << 8 | buffer$1[index++] << 16 | buffer$1[index++] << 24;
        const long = new long_1.Long(lowBits, highBits);
        if (promoteLongs && promoteValues === true) {
          object[name] = long.lessThanOrEqual(JS_INT_MAX_LONG) && long.greaterThanOrEqual(JS_INT_MIN_LONG) ? long.toNumber() : long;
        } else {
          object[name] = long;
        }
      } else if (elementType === constants.BSON_DATA_DECIMAL128) {
        const bytes = buffer2.Buffer.alloc(16);
        buffer$1.copy(bytes, 0, index, index + 16);
        index = index + 16;
        const decimal128$1 = new decimal128.Decimal128(bytes);
        if ("toObject" in decimal128$1 && typeof decimal128$1.toObject === "function") {
          object[name] = decimal128$1.toObject();
        } else {
          object[name] = decimal128$1;
        }
      } else if (elementType === constants.BSON_DATA_BINARY) {
        let binarySize = buffer$1[index++] | buffer$1[index++] << 8 | buffer$1[index++] << 16 | buffer$1[index++] << 24;
        const totalBinarySize = binarySize;
        const subType = buffer$1[index++];
        if (binarySize < 0)
          throw new Error("Negative binary type element size found");
        if (binarySize > buffer$1.byteLength)
          throw new Error("Binary type size larger than document size");
        if (buffer$1["slice"] != null) {
          if (subType === binary.Binary.SUBTYPE_BYTE_ARRAY) {
            binarySize = buffer$1[index++] | buffer$1[index++] << 8 | buffer$1[index++] << 16 | buffer$1[index++] << 24;
            if (binarySize < 0)
              throw new Error("Negative binary type element size found for subtype 0x02");
            if (binarySize > totalBinarySize - 4)
              throw new Error("Binary type with subtype 0x02 contains too long binary size");
            if (binarySize < totalBinarySize - 4)
              throw new Error("Binary type with subtype 0x02 contains too short binary size");
          }
          if (promoteBuffers && promoteValues) {
            object[name] = buffer$1.slice(index, index + binarySize);
          } else {
            object[name] = new binary.Binary(buffer$1.slice(index, index + binarySize), subType);
          }
        } else {
          const _buffer = buffer2.Buffer.alloc(binarySize);
          if (subType === binary.Binary.SUBTYPE_BYTE_ARRAY) {
            binarySize = buffer$1[index++] | buffer$1[index++] << 8 | buffer$1[index++] << 16 | buffer$1[index++] << 24;
            if (binarySize < 0)
              throw new Error("Negative binary type element size found for subtype 0x02");
            if (binarySize > totalBinarySize - 4)
              throw new Error("Binary type with subtype 0x02 contains too long binary size");
            if (binarySize < totalBinarySize - 4)
              throw new Error("Binary type with subtype 0x02 contains too short binary size");
          }
          for (i = 0; i < binarySize; i++) {
            _buffer[i] = buffer$1[index + i];
          }
          if (promoteBuffers && promoteValues) {
            object[name] = _buffer;
          } else {
            object[name] = new binary.Binary(_buffer, subType);
          }
        }
        index = index + binarySize;
      } else if (elementType === constants.BSON_DATA_REGEXP && bsonRegExp === false) {
        i = index;
        while (buffer$1[i] !== 0 && i < buffer$1.length) {
          i++;
        }
        if (i >= buffer$1.length)
          throw new Error("Bad BSON Document: illegal CString");
        const source = buffer$1.toString("utf8", index, i);
        index = i + 1;
        i = index;
        while (buffer$1[i] !== 0 && i < buffer$1.length) {
          i++;
        }
        if (i >= buffer$1.length)
          throw new Error("Bad BSON Document: illegal CString");
        const regExpOptions = buffer$1.toString("utf8", index, i);
        index = i + 1;
        const optionsArray = new Array(regExpOptions.length);
        for (i = 0; i < regExpOptions.length; i++) {
          switch (regExpOptions[i]) {
            case "m":
              optionsArray[i] = "m";
              break;
            case "s":
              optionsArray[i] = "g";
              break;
            case "i":
              optionsArray[i] = "i";
              break;
          }
        }
        object[name] = new RegExp(source, optionsArray.join(""));
      } else if (elementType === constants.BSON_DATA_REGEXP && bsonRegExp === true) {
        i = index;
        while (buffer$1[i] !== 0 && i < buffer$1.length) {
          i++;
        }
        if (i >= buffer$1.length)
          throw new Error("Bad BSON Document: illegal CString");
        const source = buffer$1.toString("utf8", index, i);
        index = i + 1;
        i = index;
        while (buffer$1[i] !== 0 && i < buffer$1.length) {
          i++;
        }
        if (i >= buffer$1.length)
          throw new Error("Bad BSON Document: illegal CString");
        const regExpOptions = buffer$1.toString("utf8", index, i);
        index = i + 1;
        object[name] = new regexp.BSONRegExp(source, regExpOptions);
      } else if (elementType === constants.BSON_DATA_SYMBOL) {
        const stringSize = buffer$1[index++] | buffer$1[index++] << 8 | buffer$1[index++] << 16 | buffer$1[index++] << 24;
        if (stringSize <= 0 || stringSize > buffer$1.length - index || buffer$1[index + stringSize - 1] !== 0)
          throw new Error("bad string length in bson");
        const symbol$1 = buffer$1.toString("utf8", index, index + stringSize - 1);
        object[name] = promoteValues ? symbol$1 : new symbol.BSONSymbol(symbol$1);
        index = index + stringSize;
      } else if (elementType === constants.BSON_DATA_TIMESTAMP) {
        const lowBits = buffer$1[index++] | buffer$1[index++] << 8 | buffer$1[index++] << 16 | buffer$1[index++] << 24;
        const highBits = buffer$1[index++] | buffer$1[index++] << 8 | buffer$1[index++] << 16 | buffer$1[index++] << 24;
        object[name] = new timestamp$1.Timestamp(lowBits, highBits);
      } else if (elementType === constants.BSON_DATA_MIN_KEY) {
        object[name] = new min_key.MinKey();
      } else if (elementType === constants.BSON_DATA_MAX_KEY) {
        object[name] = new max_key.MaxKey();
      } else if (elementType === constants.BSON_DATA_CODE) {
        const stringSize = buffer$1[index++] | buffer$1[index++] << 8 | buffer$1[index++] << 16 | buffer$1[index++] << 24;
        if (stringSize <= 0 || stringSize > buffer$1.length - index || buffer$1[index + stringSize - 1] !== 0)
          throw new Error("bad string length in bson");
        const functionString = buffer$1.toString("utf8", index, index + stringSize - 1);
        if (evalFunctions) {
          if (cacheFunctions) {
            object[name] = isolateEval(functionString, functionCache, object);
          } else {
            object[name] = isolateEval(functionString);
          }
        } else {
          object[name] = new code$1.Code(functionString);
        }
        index = index + stringSize;
      } else if (elementType === constants.BSON_DATA_CODE_W_SCOPE) {
        const totalSize = buffer$1[index++] | buffer$1[index++] << 8 | buffer$1[index++] << 16 | buffer$1[index++] << 24;
        if (totalSize < 4 + 4 + 4 + 1) {
          throw new Error("code_w_scope total size shorter minimum expected length");
        }
        const stringSize = buffer$1[index++] | buffer$1[index++] << 8 | buffer$1[index++] << 16 | buffer$1[index++] << 24;
        if (stringSize <= 0 || stringSize > buffer$1.length - index || buffer$1[index + stringSize - 1] !== 0)
          throw new Error("bad string length in bson");
        const functionString = buffer$1.toString("utf8", index, index + stringSize - 1);
        index = index + stringSize;
        const _index = index;
        const objectSize = buffer$1[index] | buffer$1[index + 1] << 8 | buffer$1[index + 2] << 16 | buffer$1[index + 3] << 24;
        const scopeObject = deserializeObject(buffer$1, _index, options, false);
        index = index + objectSize;
        if (totalSize < 4 + 4 + objectSize + stringSize) {
          throw new Error("code_w_scope total size is too short, truncating scope");
        }
        if (totalSize > 4 + 4 + objectSize + stringSize) {
          throw new Error("code_w_scope total size is too long, clips outer document");
        }
        if (evalFunctions) {
          if (cacheFunctions) {
            object[name] = isolateEval(functionString, functionCache, object);
          } else {
            object[name] = isolateEval(functionString);
          }
          object[name].scope = scopeObject;
        } else {
          object[name] = new code$1.Code(functionString, scopeObject);
        }
      } else if (elementType === constants.BSON_DATA_DBPOINTER) {
        const stringSize = buffer$1[index++] | buffer$1[index++] << 8 | buffer$1[index++] << 16 | buffer$1[index++] << 24;
        if (stringSize <= 0 || stringSize > buffer$1.length - index || buffer$1[index + stringSize - 1] !== 0)
          throw new Error("bad string length in bson");
        if (!validate_utf8.validateUtf8(buffer$1, index, index + stringSize - 1)) {
          throw new Error("Invalid UTF-8 string in BSON document");
        }
        const namespace = buffer$1.toString("utf8", index, index + stringSize - 1);
        index = index + stringSize;
        const oidBuffer = buffer2.Buffer.alloc(12);
        buffer$1.copy(oidBuffer, 0, index, index + 12);
        const oid = new objectid.ObjectId(oidBuffer);
        index = index + 12;
        object[name] = new db_ref.DBRef(namespace, oid);
      } else {
        throw new Error("Detected unknown BSON type " + elementType.toString(16) + ' for fieldname "' + name + '"');
      }
    }
    if (size !== index - startIndex) {
      if (isArray2)
        throw new Error("corrupt array bson");
      throw new Error("corrupt object bson");
    }
    const dollarKeys = Object.keys(object).filter((k) => k.startsWith("$"));
    let valid = true;
    dollarKeys.forEach((k) => {
      if (["$ref", "$id", "$db"].indexOf(k) === -1)
        valid = false;
    });
    if (!valid)
      return object;
    if (db_ref.isDBRefLike(object)) {
      const copy = Object.assign({}, object);
      delete copy.$ref;
      delete copy.$id;
      delete copy.$db;
      return new db_ref.DBRef(object.$ref, object.$id, object.$db, copy);
    }
    return object;
  }
  function isolateEval(functionString, functionCache2, object) {
    if (!functionCache2)
      return new Function(functionString);
    if (functionCache2[functionString] == null) {
      functionCache2[functionString] = new Function(functionString);
    }
    return functionCache2[functionString].bind(object);
  }
});
unwrapExports(deserializer);
var deserializer_1 = deserializer.deserialize;
var float_parser = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.writeIEEE754 = exports.readIEEE754 = void 0;
  function readIEEE754(buffer3, offset, endian, mLen, nBytes) {
    let e;
    let m;
    const bBE = endian === "big";
    const eLen = nBytes * 8 - mLen - 1;
    const eMax = (1 << eLen) - 1;
    const eBias = eMax >> 1;
    let nBits = -7;
    let i = bBE ? 0 : nBytes - 1;
    const d = bBE ? 1 : -1;
    let s = buffer3[offset + i];
    i += d;
    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;
    for (; nBits > 0; e = e * 256 + buffer3[offset + i], i += d, nBits -= 8)
      ;
    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;
    for (; nBits > 0; m = m * 256 + buffer3[offset + i], i += d, nBits -= 8)
      ;
    if (e === 0) {
      e = 1 - eBias;
    } else if (e === eMax) {
      return m ? NaN : (s ? -1 : 1) * Infinity;
    } else {
      m = m + Math.pow(2, mLen);
      e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
  }
  exports.readIEEE754 = readIEEE754;
  function writeIEEE754(buffer3, value, offset, endian, mLen, nBytes) {
    let e;
    let m;
    let c;
    const bBE = endian === "big";
    let eLen = nBytes * 8 - mLen - 1;
    const eMax = (1 << eLen) - 1;
    const eBias = eMax >> 1;
    const rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    let i = bBE ? nBytes - 1 : 0;
    const d = bBE ? -1 : 1;
    const s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
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
    if (isNaN(value))
      m = 0;
    while (mLen >= 8) {
      buffer3[offset + i] = m & 255;
      i += d;
      m /= 256;
      mLen -= 8;
    }
    e = e << mLen | m;
    if (isNaN(value))
      e += 8;
    eLen += mLen;
    while (eLen > 0) {
      buffer3[offset + i] = e & 255;
      i += d;
      e /= 256;
      eLen -= 8;
    }
    buffer3[offset + i - d] |= s * 128;
  }
  exports.writeIEEE754 = writeIEEE754;
});
unwrapExports(float_parser);
var float_parser_1 = float_parser.writeIEEE754;
var float_parser_2 = float_parser.readIEEE754;
var serializer = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.serializeInto = void 0;
  const regexp2 = /\x00/;
  const ignoreKeys = new Set(["$db", "$ref", "$id", "$clusterTime"]);
  function isRegExp2(d) {
    return Object.prototype.toString.call(d) === "[object RegExp]";
  }
  function serializeString(buffer3, key, value, index, isArray2) {
    buffer3[index++] = constants.BSON_DATA_STRING;
    const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
    index = index + numberOfWrittenBytes + 1;
    buffer3[index - 1] = 0;
    const size = buffer3.write(value, index + 4, void 0, "utf8");
    buffer3[index + 3] = size + 1 >> 24 & 255;
    buffer3[index + 2] = size + 1 >> 16 & 255;
    buffer3[index + 1] = size + 1 >> 8 & 255;
    buffer3[index] = size + 1 & 255;
    index = index + 4 + size;
    buffer3[index++] = 0;
    return index;
  }
  function serializeNumber(buffer3, key, value, index, isArray2) {
    if (Number.isInteger(value) && value >= constants.BSON_INT32_MIN && value <= constants.BSON_INT32_MAX) {
      buffer3[index++] = constants.BSON_DATA_INT;
      const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
      index = index + numberOfWrittenBytes;
      buffer3[index++] = 0;
      buffer3[index++] = value & 255;
      buffer3[index++] = value >> 8 & 255;
      buffer3[index++] = value >> 16 & 255;
      buffer3[index++] = value >> 24 & 255;
    } else {
      buffer3[index++] = constants.BSON_DATA_NUMBER;
      const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
      index = index + numberOfWrittenBytes;
      buffer3[index++] = 0;
      float_parser.writeIEEE754(buffer3, value, index, "little", 52, 8);
      index = index + 8;
    }
    return index;
  }
  function serializeNull(buffer3, key, _, index, isArray2) {
    buffer3[index++] = constants.BSON_DATA_NULL;
    const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
    index = index + numberOfWrittenBytes;
    buffer3[index++] = 0;
    return index;
  }
  function serializeBoolean(buffer3, key, value, index, isArray2) {
    buffer3[index++] = constants.BSON_DATA_BOOLEAN;
    const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
    index = index + numberOfWrittenBytes;
    buffer3[index++] = 0;
    buffer3[index++] = value ? 1 : 0;
    return index;
  }
  function serializeDate(buffer3, key, value, index, isArray2) {
    buffer3[index++] = constants.BSON_DATA_DATE;
    const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
    index = index + numberOfWrittenBytes;
    buffer3[index++] = 0;
    const dateInMilis = long_1.Long.fromNumber(value.getTime());
    const lowBits = dateInMilis.getLowBits();
    const highBits = dateInMilis.getHighBits();
    buffer3[index++] = lowBits & 255;
    buffer3[index++] = lowBits >> 8 & 255;
    buffer3[index++] = lowBits >> 16 & 255;
    buffer3[index++] = lowBits >> 24 & 255;
    buffer3[index++] = highBits & 255;
    buffer3[index++] = highBits >> 8 & 255;
    buffer3[index++] = highBits >> 16 & 255;
    buffer3[index++] = highBits >> 24 & 255;
    return index;
  }
  function serializeRegExp(buffer3, key, value, index, isArray2) {
    buffer3[index++] = constants.BSON_DATA_REGEXP;
    const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
    index = index + numberOfWrittenBytes;
    buffer3[index++] = 0;
    if (value.source && value.source.match(regexp2) != null) {
      throw Error("value " + value.source + " must not contain null bytes");
    }
    index = index + buffer3.write(value.source, index, void 0, "utf8");
    buffer3[index++] = 0;
    if (value.ignoreCase)
      buffer3[index++] = 105;
    if (value.global)
      buffer3[index++] = 115;
    if (value.multiline)
      buffer3[index++] = 109;
    buffer3[index++] = 0;
    return index;
  }
  function serializeBSONRegExp(buffer3, key, value, index, isArray2) {
    buffer3[index++] = constants.BSON_DATA_REGEXP;
    const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
    index = index + numberOfWrittenBytes;
    buffer3[index++] = 0;
    if (value.pattern.match(regexp2) != null) {
      throw Error("pattern " + value.pattern + " must not contain null bytes");
    }
    index = index + buffer3.write(value.pattern, index, void 0, "utf8");
    buffer3[index++] = 0;
    index = index + buffer3.write(value.options.split("").sort().join(""), index, void 0, "utf8");
    buffer3[index++] = 0;
    return index;
  }
  function serializeMinMax(buffer3, key, value, index, isArray2) {
    if (value === null) {
      buffer3[index++] = constants.BSON_DATA_NULL;
    } else if (value._bsontype === "MinKey") {
      buffer3[index++] = constants.BSON_DATA_MIN_KEY;
    } else {
      buffer3[index++] = constants.BSON_DATA_MAX_KEY;
    }
    const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
    index = index + numberOfWrittenBytes;
    buffer3[index++] = 0;
    return index;
  }
  function serializeObjectId(buffer3, key, value, index, isArray2) {
    buffer3[index++] = constants.BSON_DATA_OID;
    const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
    index = index + numberOfWrittenBytes;
    buffer3[index++] = 0;
    if (typeof value.id === "string") {
      buffer3.write(value.id, index, void 0, "binary");
    } else if (value.id && value.id.copy) {
      value.id.copy(buffer3, index, 0, 12);
    } else {
      throw new TypeError("object [" + JSON.stringify(value) + "] is not a valid ObjectId");
    }
    return index + 12;
  }
  function serializeBuffer(buffer3, key, value, index, isArray2) {
    buffer3[index++] = constants.BSON_DATA_BINARY;
    const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
    index = index + numberOfWrittenBytes;
    buffer3[index++] = 0;
    const size = value.length;
    buffer3[index++] = size & 255;
    buffer3[index++] = size >> 8 & 255;
    buffer3[index++] = size >> 16 & 255;
    buffer3[index++] = size >> 24 & 255;
    buffer3[index++] = constants.BSON_BINARY_SUBTYPE_DEFAULT;
    buffer3.set(ensure_buffer.ensureBuffer(value), index);
    index = index + size;
    return index;
  }
  function serializeObject(buffer3, key, value, index, checkKeys = false, depth = 0, serializeFunctions = false, ignoreUndefined = true, isArray2 = false, path = []) {
    for (let i = 0; i < path.length; i++) {
      if (path[i] === value)
        throw new Error("cyclic dependency detected");
    }
    path.push(value);
    buffer3[index++] = Array.isArray(value) ? constants.BSON_DATA_ARRAY : constants.BSON_DATA_OBJECT;
    const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
    index = index + numberOfWrittenBytes;
    buffer3[index++] = 0;
    const endIndex = serializeInto(buffer3, value, checkKeys, index, depth + 1, serializeFunctions, ignoreUndefined, path);
    path.pop();
    return endIndex;
  }
  function serializeDecimal128(buffer3, key, value, index, isArray2) {
    buffer3[index++] = constants.BSON_DATA_DECIMAL128;
    const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
    index = index + numberOfWrittenBytes;
    buffer3[index++] = 0;
    value.bytes.copy(buffer3, index, 0, 16);
    return index + 16;
  }
  function serializeLong(buffer3, key, value, index, isArray2) {
    buffer3[index++] = value._bsontype === "Long" ? constants.BSON_DATA_LONG : constants.BSON_DATA_TIMESTAMP;
    const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
    index = index + numberOfWrittenBytes;
    buffer3[index++] = 0;
    const lowBits = value.getLowBits();
    const highBits = value.getHighBits();
    buffer3[index++] = lowBits & 255;
    buffer3[index++] = lowBits >> 8 & 255;
    buffer3[index++] = lowBits >> 16 & 255;
    buffer3[index++] = lowBits >> 24 & 255;
    buffer3[index++] = highBits & 255;
    buffer3[index++] = highBits >> 8 & 255;
    buffer3[index++] = highBits >> 16 & 255;
    buffer3[index++] = highBits >> 24 & 255;
    return index;
  }
  function serializeInt32(buffer3, key, value, index, isArray2) {
    value = value.valueOf();
    buffer3[index++] = constants.BSON_DATA_INT;
    const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
    index = index + numberOfWrittenBytes;
    buffer3[index++] = 0;
    buffer3[index++] = value & 255;
    buffer3[index++] = value >> 8 & 255;
    buffer3[index++] = value >> 16 & 255;
    buffer3[index++] = value >> 24 & 255;
    return index;
  }
  function serializeDouble(buffer3, key, value, index, isArray2) {
    buffer3[index++] = constants.BSON_DATA_NUMBER;
    const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
    index = index + numberOfWrittenBytes;
    buffer3[index++] = 0;
    float_parser.writeIEEE754(buffer3, value.value, index, "little", 52, 8);
    index = index + 8;
    return index;
  }
  function serializeFunction(buffer3, key, value, index, _checkKeys = false, _depth = 0, isArray2) {
    buffer3[index++] = constants.BSON_DATA_CODE;
    const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
    index = index + numberOfWrittenBytes;
    buffer3[index++] = 0;
    const functionString = utils.normalizedFunctionString(value);
    const size = buffer3.write(functionString, index + 4, void 0, "utf8") + 1;
    buffer3[index] = size & 255;
    buffer3[index + 1] = size >> 8 & 255;
    buffer3[index + 2] = size >> 16 & 255;
    buffer3[index + 3] = size >> 24 & 255;
    index = index + 4 + size - 1;
    buffer3[index++] = 0;
    return index;
  }
  function serializeCode(buffer3, key, value, index, checkKeys = false, depth = 0, serializeFunctions = false, ignoreUndefined = true, isArray2 = false) {
    if (value.scope && typeof value.scope === "object") {
      buffer3[index++] = constants.BSON_DATA_CODE_W_SCOPE;
      const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
      index = index + numberOfWrittenBytes;
      buffer3[index++] = 0;
      let startIndex = index;
      const functionString = typeof value.code === "string" ? value.code : value.code.toString();
      index = index + 4;
      const codeSize = buffer3.write(functionString, index + 4, void 0, "utf8") + 1;
      buffer3[index] = codeSize & 255;
      buffer3[index + 1] = codeSize >> 8 & 255;
      buffer3[index + 2] = codeSize >> 16 & 255;
      buffer3[index + 3] = codeSize >> 24 & 255;
      buffer3[index + 4 + codeSize - 1] = 0;
      index = index + codeSize + 4;
      const endIndex = serializeInto(buffer3, value.scope, checkKeys, index, depth + 1, serializeFunctions, ignoreUndefined);
      index = endIndex - 1;
      const totalSize = endIndex - startIndex;
      buffer3[startIndex++] = totalSize & 255;
      buffer3[startIndex++] = totalSize >> 8 & 255;
      buffer3[startIndex++] = totalSize >> 16 & 255;
      buffer3[startIndex++] = totalSize >> 24 & 255;
      buffer3[index++] = 0;
    } else {
      buffer3[index++] = constants.BSON_DATA_CODE;
      const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
      index = index + numberOfWrittenBytes;
      buffer3[index++] = 0;
      const functionString = value.code.toString();
      const size = buffer3.write(functionString, index + 4, void 0, "utf8") + 1;
      buffer3[index] = size & 255;
      buffer3[index + 1] = size >> 8 & 255;
      buffer3[index + 2] = size >> 16 & 255;
      buffer3[index + 3] = size >> 24 & 255;
      index = index + 4 + size - 1;
      buffer3[index++] = 0;
    }
    return index;
  }
  function serializeBinary(buffer3, key, value, index, isArray2) {
    buffer3[index++] = constants.BSON_DATA_BINARY;
    const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
    index = index + numberOfWrittenBytes;
    buffer3[index++] = 0;
    const data = value.value(true);
    let size = value.position;
    if (value.sub_type === binary.Binary.SUBTYPE_BYTE_ARRAY)
      size = size + 4;
    buffer3[index++] = size & 255;
    buffer3[index++] = size >> 8 & 255;
    buffer3[index++] = size >> 16 & 255;
    buffer3[index++] = size >> 24 & 255;
    buffer3[index++] = value.sub_type;
    if (value.sub_type === binary.Binary.SUBTYPE_BYTE_ARRAY) {
      size = size - 4;
      buffer3[index++] = size & 255;
      buffer3[index++] = size >> 8 & 255;
      buffer3[index++] = size >> 16 & 255;
      buffer3[index++] = size >> 24 & 255;
    }
    buffer3.set(data, index);
    index = index + value.position;
    return index;
  }
  function serializeSymbol(buffer3, key, value, index, isArray2) {
    buffer3[index++] = constants.BSON_DATA_SYMBOL;
    const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
    index = index + numberOfWrittenBytes;
    buffer3[index++] = 0;
    const size = buffer3.write(value.value, index + 4, void 0, "utf8") + 1;
    buffer3[index] = size & 255;
    buffer3[index + 1] = size >> 8 & 255;
    buffer3[index + 2] = size >> 16 & 255;
    buffer3[index + 3] = size >> 24 & 255;
    index = index + 4 + size - 1;
    buffer3[index++] = 0;
    return index;
  }
  function serializeDBRef(buffer3, key, value, index, depth, serializeFunctions, isArray2) {
    buffer3[index++] = constants.BSON_DATA_OBJECT;
    const numberOfWrittenBytes = !isArray2 ? buffer3.write(key, index, void 0, "utf8") : buffer3.write(key, index, void 0, "ascii");
    index = index + numberOfWrittenBytes;
    buffer3[index++] = 0;
    let startIndex = index;
    let output = {
      $ref: value.collection || value.namespace,
      $id: value.oid
    };
    if (value.db != null) {
      output.$db = value.db;
    }
    output = Object.assign(output, value.fields);
    const endIndex = serializeInto(buffer3, output, false, index, depth + 1, serializeFunctions);
    const size = endIndex - startIndex;
    buffer3[startIndex++] = size & 255;
    buffer3[startIndex++] = size >> 8 & 255;
    buffer3[startIndex++] = size >> 16 & 255;
    buffer3[startIndex++] = size >> 24 & 255;
    return endIndex;
  }
  function serializeInto(buffer3, object, checkKeys = false, startingIndex = 0, depth = 0, serializeFunctions = false, ignoreUndefined = true, path = []) {
    startingIndex = startingIndex || 0;
    path = path || [];
    path.push(object);
    let index = startingIndex + 4;
    if (Array.isArray(object)) {
      for (let i = 0; i < object.length; i++) {
        const key = "" + i;
        let value = object[i];
        if (value && value.toBSON) {
          if (typeof value.toBSON !== "function")
            throw new TypeError("toBSON is not a function");
          value = value.toBSON();
        }
        if (typeof value === "string") {
          index = serializeString(buffer3, key, value, index, true);
        } else if (typeof value === "number") {
          index = serializeNumber(buffer3, key, value, index, true);
        } else if (typeof value === "bigint") {
          throw new TypeError("Unsupported type BigInt, please use Decimal128");
        } else if (typeof value === "boolean") {
          index = serializeBoolean(buffer3, key, value, index, true);
        } else if (value instanceof Date || utils.isDate(value)) {
          index = serializeDate(buffer3, key, value, index, true);
        } else if (value === void 0) {
          index = serializeNull(buffer3, key, value, index, true);
        } else if (value === null) {
          index = serializeNull(buffer3, key, value, index, true);
        } else if (value["_bsontype"] === "ObjectId" || value["_bsontype"] === "ObjectID") {
          index = serializeObjectId(buffer3, key, value, index, true);
        } else if (utils.isBuffer(value) || utils.isUint8Array(value)) {
          index = serializeBuffer(buffer3, key, value, index, true);
        } else if (value instanceof RegExp || isRegExp2(value)) {
          index = serializeRegExp(buffer3, key, value, index, true);
        } else if (typeof value === "object" && value["_bsontype"] == null) {
          index = serializeObject(buffer3, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, true, path);
        } else if (typeof value === "object" && extended_json.isBSONType(value) && value._bsontype === "Decimal128") {
          index = serializeDecimal128(buffer3, key, value, index, true);
        } else if (value["_bsontype"] === "Long" || value["_bsontype"] === "Timestamp") {
          index = serializeLong(buffer3, key, value, index, true);
        } else if (value["_bsontype"] === "Double") {
          index = serializeDouble(buffer3, key, value, index, true);
        } else if (typeof value === "function" && serializeFunctions) {
          index = serializeFunction(buffer3, key, value, index, checkKeys, depth, true);
        } else if (value["_bsontype"] === "Code") {
          index = serializeCode(buffer3, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, true);
        } else if (value["_bsontype"] === "Binary") {
          index = serializeBinary(buffer3, key, value, index, true);
        } else if (value["_bsontype"] === "Symbol") {
          index = serializeSymbol(buffer3, key, value, index, true);
        } else if (value["_bsontype"] === "DBRef") {
          index = serializeDBRef(buffer3, key, value, index, depth, serializeFunctions, true);
        } else if (value["_bsontype"] === "BSONRegExp") {
          index = serializeBSONRegExp(buffer3, key, value, index, true);
        } else if (value["_bsontype"] === "Int32") {
          index = serializeInt32(buffer3, key, value, index, true);
        } else if (value["_bsontype"] === "MinKey" || value["_bsontype"] === "MaxKey") {
          index = serializeMinMax(buffer3, key, value, index, true);
        } else if (typeof value["_bsontype"] !== "undefined") {
          throw new TypeError("Unrecognized or invalid _bsontype: " + value["_bsontype"]);
        }
      }
    } else if (object instanceof map.Map) {
      const iterator = object.entries();
      let done = false;
      while (!done) {
        const entry = iterator.next();
        done = !!entry.done;
        if (done)
          continue;
        const key = entry.value[0];
        const value = entry.value[1];
        const type = typeof value;
        if (typeof key === "string" && !ignoreKeys.has(key)) {
          if (key.match(regexp2) != null) {
            throw Error("key " + key + " must not contain null bytes");
          }
          if (checkKeys) {
            if (key[0] === "$") {
              throw Error("key " + key + " must not start with '$'");
            } else if (~key.indexOf(".")) {
              throw Error("key " + key + " must not contain '.'");
            }
          }
        }
        if (type === "string") {
          index = serializeString(buffer3, key, value, index);
        } else if (type === "number") {
          index = serializeNumber(buffer3, key, value, index);
        } else if (type === "bigint" || utils.isBigInt64Array(value) || utils.isBigUInt64Array(value)) {
          throw new TypeError("Unsupported type BigInt, please use Decimal128");
        } else if (type === "boolean") {
          index = serializeBoolean(buffer3, key, value, index);
        } else if (value instanceof Date || utils.isDate(value)) {
          index = serializeDate(buffer3, key, value, index);
        } else if (value === null || value === void 0 && ignoreUndefined === false) {
          index = serializeNull(buffer3, key, value, index);
        } else if (value["_bsontype"] === "ObjectId" || value["_bsontype"] === "ObjectID") {
          index = serializeObjectId(buffer3, key, value, index);
        } else if (utils.isBuffer(value) || utils.isUint8Array(value)) {
          index = serializeBuffer(buffer3, key, value, index);
        } else if (value instanceof RegExp || isRegExp2(value)) {
          index = serializeRegExp(buffer3, key, value, index);
        } else if (type === "object" && value["_bsontype"] == null) {
          index = serializeObject(buffer3, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, false, path);
        } else if (type === "object" && value["_bsontype"] === "Decimal128") {
          index = serializeDecimal128(buffer3, key, value, index);
        } else if (value["_bsontype"] === "Long" || value["_bsontype"] === "Timestamp") {
          index = serializeLong(buffer3, key, value, index);
        } else if (value["_bsontype"] === "Double") {
          index = serializeDouble(buffer3, key, value, index);
        } else if (value["_bsontype"] === "Code") {
          index = serializeCode(buffer3, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined);
        } else if (typeof value === "function" && serializeFunctions) {
          index = serializeFunction(buffer3, key, value, index, checkKeys, depth, serializeFunctions);
        } else if (value["_bsontype"] === "Binary") {
          index = serializeBinary(buffer3, key, value, index);
        } else if (value["_bsontype"] === "Symbol") {
          index = serializeSymbol(buffer3, key, value, index);
        } else if (value["_bsontype"] === "DBRef") {
          index = serializeDBRef(buffer3, key, value, index, depth, serializeFunctions);
        } else if (value["_bsontype"] === "BSONRegExp") {
          index = serializeBSONRegExp(buffer3, key, value, index);
        } else if (value["_bsontype"] === "Int32") {
          index = serializeInt32(buffer3, key, value, index);
        } else if (value["_bsontype"] === "MinKey" || value["_bsontype"] === "MaxKey") {
          index = serializeMinMax(buffer3, key, value, index);
        } else if (typeof value["_bsontype"] !== "undefined") {
          throw new TypeError("Unrecognized or invalid _bsontype: " + value["_bsontype"]);
        }
      }
    } else {
      if (object.toBSON) {
        if (typeof object.toBSON !== "function")
          throw new TypeError("toBSON is not a function");
        object = object.toBSON();
        if (object != null && typeof object !== "object")
          throw new TypeError("toBSON function did not return an object");
      }
      for (const key in object) {
        let value = object[key];
        if (value && value.toBSON) {
          if (typeof value.toBSON !== "function")
            throw new TypeError("toBSON is not a function");
          value = value.toBSON();
        }
        const type = typeof value;
        if (typeof key === "string" && !ignoreKeys.has(key)) {
          if (key.match(regexp2) != null) {
            throw Error("key " + key + " must not contain null bytes");
          }
          if (checkKeys) {
            if (key[0] === "$") {
              throw Error("key " + key + " must not start with '$'");
            } else if (~key.indexOf(".")) {
              throw Error("key " + key + " must not contain '.'");
            }
          }
        }
        if (type === "string") {
          index = serializeString(buffer3, key, value, index);
        } else if (type === "number") {
          index = serializeNumber(buffer3, key, value, index);
        } else if (type === "bigint") {
          throw new TypeError("Unsupported type BigInt, please use Decimal128");
        } else if (type === "boolean") {
          index = serializeBoolean(buffer3, key, value, index);
        } else if (value instanceof Date || utils.isDate(value)) {
          index = serializeDate(buffer3, key, value, index);
        } else if (value === void 0) {
          if (ignoreUndefined === false)
            index = serializeNull(buffer3, key, value, index);
        } else if (value === null) {
          index = serializeNull(buffer3, key, value, index);
        } else if (value["_bsontype"] === "ObjectId" || value["_bsontype"] === "ObjectID") {
          index = serializeObjectId(buffer3, key, value, index);
        } else if (utils.isBuffer(value) || utils.isUint8Array(value)) {
          index = serializeBuffer(buffer3, key, value, index);
        } else if (value instanceof RegExp || isRegExp2(value)) {
          index = serializeRegExp(buffer3, key, value, index);
        } else if (type === "object" && value["_bsontype"] == null) {
          index = serializeObject(buffer3, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, false, path);
        } else if (type === "object" && value["_bsontype"] === "Decimal128") {
          index = serializeDecimal128(buffer3, key, value, index);
        } else if (value["_bsontype"] === "Long" || value["_bsontype"] === "Timestamp") {
          index = serializeLong(buffer3, key, value, index);
        } else if (value["_bsontype"] === "Double") {
          index = serializeDouble(buffer3, key, value, index);
        } else if (value["_bsontype"] === "Code") {
          index = serializeCode(buffer3, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined);
        } else if (typeof value === "function" && serializeFunctions) {
          index = serializeFunction(buffer3, key, value, index, checkKeys, depth, serializeFunctions);
        } else if (value["_bsontype"] === "Binary") {
          index = serializeBinary(buffer3, key, value, index);
        } else if (value["_bsontype"] === "Symbol") {
          index = serializeSymbol(buffer3, key, value, index);
        } else if (value["_bsontype"] === "DBRef") {
          index = serializeDBRef(buffer3, key, value, index, depth, serializeFunctions);
        } else if (value["_bsontype"] === "BSONRegExp") {
          index = serializeBSONRegExp(buffer3, key, value, index);
        } else if (value["_bsontype"] === "Int32") {
          index = serializeInt32(buffer3, key, value, index);
        } else if (value["_bsontype"] === "MinKey" || value["_bsontype"] === "MaxKey") {
          index = serializeMinMax(buffer3, key, value, index);
        } else if (typeof value["_bsontype"] !== "undefined") {
          throw new TypeError("Unrecognized or invalid _bsontype: " + value["_bsontype"]);
        }
      }
    }
    path.pop();
    buffer3[index++] = 0;
    const size = index - startingIndex;
    buffer3[startingIndex++] = size & 255;
    buffer3[startingIndex++] = size >> 8 & 255;
    buffer3[startingIndex++] = size >> 16 & 255;
    buffer3[startingIndex++] = size >> 24 & 255;
    return index;
  }
  exports.serializeInto = serializeInto;
});
unwrapExports(serializer);
var serializer_1 = serializer.serializeInto;
var bson = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.deserializeStream = exports.calculateObjectSize = exports.deserialize = exports.serializeWithBufferAndIndex = exports.serialize = exports.setInternalBufferSize = exports.ObjectID = exports.Decimal128 = exports.BSONRegExp = exports.MaxKey = exports.MinKey = exports.Int32 = exports.Double = exports.Timestamp = exports.Long = exports.ObjectId = exports.Binary = exports.DBRef = exports.BSONSymbol = exports.Map = exports.Code = exports.LongWithoutOverridesClass = exports.EJSON = exports.BSON_INT64_MIN = exports.BSON_INT64_MAX = exports.BSON_INT32_MIN = exports.BSON_INT32_MAX = exports.BSON_DATA_UNDEFINED = exports.BSON_DATA_TIMESTAMP = exports.BSON_DATA_SYMBOL = exports.BSON_DATA_STRING = exports.BSON_DATA_REGEXP = exports.BSON_DATA_OID = exports.BSON_DATA_OBJECT = exports.BSON_DATA_NUMBER = exports.BSON_DATA_NULL = exports.BSON_DATA_MIN_KEY = exports.BSON_DATA_MAX_KEY = exports.BSON_DATA_LONG = exports.BSON_DATA_INT = exports.BSON_DATA_DECIMAL128 = exports.BSON_DATA_DBPOINTER = exports.BSON_DATA_DATE = exports.BSON_DATA_CODE_W_SCOPE = exports.BSON_DATA_CODE = exports.BSON_DATA_BOOLEAN = exports.BSON_DATA_BINARY = exports.BSON_DATA_ARRAY = exports.BSON_BINARY_SUBTYPE_UUID_NEW = exports.BSON_BINARY_SUBTYPE_UUID = exports.BSON_BINARY_SUBTYPE_USER_DEFINED = exports.BSON_BINARY_SUBTYPE_MD5 = exports.BSON_BINARY_SUBTYPE_FUNCTION = exports.BSON_BINARY_SUBTYPE_DEFAULT = exports.BSON_BINARY_SUBTYPE_BYTE_ARRAY = void 0;
  Object.defineProperty(exports, "Binary", {enumerable: true, get: function() {
    return binary.Binary;
  }});
  Object.defineProperty(exports, "Code", {enumerable: true, get: function() {
    return code$1.Code;
  }});
  Object.defineProperty(exports, "DBRef", {enumerable: true, get: function() {
    return db_ref.DBRef;
  }});
  Object.defineProperty(exports, "Decimal128", {enumerable: true, get: function() {
    return decimal128.Decimal128;
  }});
  Object.defineProperty(exports, "Double", {enumerable: true, get: function() {
    return double_1.Double;
  }});
  Object.defineProperty(exports, "Int32", {enumerable: true, get: function() {
    return int_32.Int32;
  }});
  Object.defineProperty(exports, "Long", {enumerable: true, get: function() {
    return long_1.Long;
  }});
  Object.defineProperty(exports, "Map", {enumerable: true, get: function() {
    return map.Map;
  }});
  Object.defineProperty(exports, "MaxKey", {enumerable: true, get: function() {
    return max_key.MaxKey;
  }});
  Object.defineProperty(exports, "MinKey", {enumerable: true, get: function() {
    return min_key.MinKey;
  }});
  Object.defineProperty(exports, "ObjectId", {enumerable: true, get: function() {
    return objectid.ObjectId;
  }});
  Object.defineProperty(exports, "ObjectID", {enumerable: true, get: function() {
    return objectid.ObjectId;
  }});
  Object.defineProperty(exports, "BSONRegExp", {enumerable: true, get: function() {
    return regexp.BSONRegExp;
  }});
  Object.defineProperty(exports, "BSONSymbol", {enumerable: true, get: function() {
    return symbol.BSONSymbol;
  }});
  Object.defineProperty(exports, "Timestamp", {enumerable: true, get: function() {
    return timestamp$1.Timestamp;
  }});
  Object.defineProperty(exports, "BSON_BINARY_SUBTYPE_BYTE_ARRAY", {enumerable: true, get: function() {
    return constants.BSON_BINARY_SUBTYPE_BYTE_ARRAY;
  }});
  Object.defineProperty(exports, "BSON_BINARY_SUBTYPE_DEFAULT", {enumerable: true, get: function() {
    return constants.BSON_BINARY_SUBTYPE_DEFAULT;
  }});
  Object.defineProperty(exports, "BSON_BINARY_SUBTYPE_FUNCTION", {enumerable: true, get: function() {
    return constants.BSON_BINARY_SUBTYPE_FUNCTION;
  }});
  Object.defineProperty(exports, "BSON_BINARY_SUBTYPE_MD5", {enumerable: true, get: function() {
    return constants.BSON_BINARY_SUBTYPE_MD5;
  }});
  Object.defineProperty(exports, "BSON_BINARY_SUBTYPE_USER_DEFINED", {enumerable: true, get: function() {
    return constants.BSON_BINARY_SUBTYPE_USER_DEFINED;
  }});
  Object.defineProperty(exports, "BSON_BINARY_SUBTYPE_UUID", {enumerable: true, get: function() {
    return constants.BSON_BINARY_SUBTYPE_UUID;
  }});
  Object.defineProperty(exports, "BSON_BINARY_SUBTYPE_UUID_NEW", {enumerable: true, get: function() {
    return constants.BSON_BINARY_SUBTYPE_UUID_NEW;
  }});
  Object.defineProperty(exports, "BSON_DATA_ARRAY", {enumerable: true, get: function() {
    return constants.BSON_DATA_ARRAY;
  }});
  Object.defineProperty(exports, "BSON_DATA_BINARY", {enumerable: true, get: function() {
    return constants.BSON_DATA_BINARY;
  }});
  Object.defineProperty(exports, "BSON_DATA_BOOLEAN", {enumerable: true, get: function() {
    return constants.BSON_DATA_BOOLEAN;
  }});
  Object.defineProperty(exports, "BSON_DATA_CODE", {enumerable: true, get: function() {
    return constants.BSON_DATA_CODE;
  }});
  Object.defineProperty(exports, "BSON_DATA_CODE_W_SCOPE", {enumerable: true, get: function() {
    return constants.BSON_DATA_CODE_W_SCOPE;
  }});
  Object.defineProperty(exports, "BSON_DATA_DATE", {enumerable: true, get: function() {
    return constants.BSON_DATA_DATE;
  }});
  Object.defineProperty(exports, "BSON_DATA_DBPOINTER", {enumerable: true, get: function() {
    return constants.BSON_DATA_DBPOINTER;
  }});
  Object.defineProperty(exports, "BSON_DATA_DECIMAL128", {enumerable: true, get: function() {
    return constants.BSON_DATA_DECIMAL128;
  }});
  Object.defineProperty(exports, "BSON_DATA_INT", {enumerable: true, get: function() {
    return constants.BSON_DATA_INT;
  }});
  Object.defineProperty(exports, "BSON_DATA_LONG", {enumerable: true, get: function() {
    return constants.BSON_DATA_LONG;
  }});
  Object.defineProperty(exports, "BSON_DATA_MAX_KEY", {enumerable: true, get: function() {
    return constants.BSON_DATA_MAX_KEY;
  }});
  Object.defineProperty(exports, "BSON_DATA_MIN_KEY", {enumerable: true, get: function() {
    return constants.BSON_DATA_MIN_KEY;
  }});
  Object.defineProperty(exports, "BSON_DATA_NULL", {enumerable: true, get: function() {
    return constants.BSON_DATA_NULL;
  }});
  Object.defineProperty(exports, "BSON_DATA_NUMBER", {enumerable: true, get: function() {
    return constants.BSON_DATA_NUMBER;
  }});
  Object.defineProperty(exports, "BSON_DATA_OBJECT", {enumerable: true, get: function() {
    return constants.BSON_DATA_OBJECT;
  }});
  Object.defineProperty(exports, "BSON_DATA_OID", {enumerable: true, get: function() {
    return constants.BSON_DATA_OID;
  }});
  Object.defineProperty(exports, "BSON_DATA_REGEXP", {enumerable: true, get: function() {
    return constants.BSON_DATA_REGEXP;
  }});
  Object.defineProperty(exports, "BSON_DATA_STRING", {enumerable: true, get: function() {
    return constants.BSON_DATA_STRING;
  }});
  Object.defineProperty(exports, "BSON_DATA_SYMBOL", {enumerable: true, get: function() {
    return constants.BSON_DATA_SYMBOL;
  }});
  Object.defineProperty(exports, "BSON_DATA_TIMESTAMP", {enumerable: true, get: function() {
    return constants.BSON_DATA_TIMESTAMP;
  }});
  Object.defineProperty(exports, "BSON_DATA_UNDEFINED", {enumerable: true, get: function() {
    return constants.BSON_DATA_UNDEFINED;
  }});
  Object.defineProperty(exports, "BSON_INT32_MAX", {enumerable: true, get: function() {
    return constants.BSON_INT32_MAX;
  }});
  Object.defineProperty(exports, "BSON_INT32_MIN", {enumerable: true, get: function() {
    return constants.BSON_INT32_MIN;
  }});
  Object.defineProperty(exports, "BSON_INT64_MAX", {enumerable: true, get: function() {
    return constants.BSON_INT64_MAX;
  }});
  Object.defineProperty(exports, "BSON_INT64_MIN", {enumerable: true, get: function() {
    return constants.BSON_INT64_MIN;
  }});
  var extended_json_22 = extended_json;
  Object.defineProperty(exports, "EJSON", {enumerable: true, get: function() {
    return extended_json_22.EJSON;
  }});
  var timestamp_22 = timestamp$1;
  Object.defineProperty(exports, "LongWithoutOverridesClass", {enumerable: true, get: function() {
    return timestamp_22.LongWithoutOverridesClass;
  }});
  const MAXSIZE = 1024 * 1024 * 17;
  let buffer$1 = buffer2.Buffer.alloc(MAXSIZE);
  function setInternalBufferSize(size) {
    if (buffer$1.length < size) {
      buffer$1 = buffer2.Buffer.alloc(size);
    }
  }
  exports.setInternalBufferSize = setInternalBufferSize;
  function serialize(object, options = {}) {
    const checkKeys = typeof options.checkKeys === "boolean" ? options.checkKeys : false;
    const serializeFunctions = typeof options.serializeFunctions === "boolean" ? options.serializeFunctions : false;
    const ignoreUndefined = typeof options.ignoreUndefined === "boolean" ? options.ignoreUndefined : true;
    const minInternalBufferSize = typeof options.minInternalBufferSize === "number" ? options.minInternalBufferSize : MAXSIZE;
    if (buffer$1.length < minInternalBufferSize) {
      buffer$1 = buffer2.Buffer.alloc(minInternalBufferSize);
    }
    const serializationIndex = serializer.serializeInto(buffer$1, object, checkKeys, 0, 0, serializeFunctions, ignoreUndefined, []);
    const finishedBuffer = buffer2.Buffer.alloc(serializationIndex);
    buffer$1.copy(finishedBuffer, 0, 0, finishedBuffer.length);
    return finishedBuffer;
  }
  exports.serialize = serialize;
  function serializeWithBufferAndIndex(object, finalBuffer, options = {}) {
    const checkKeys = typeof options.checkKeys === "boolean" ? options.checkKeys : false;
    const serializeFunctions = typeof options.serializeFunctions === "boolean" ? options.serializeFunctions : false;
    const ignoreUndefined = typeof options.ignoreUndefined === "boolean" ? options.ignoreUndefined : true;
    const startIndex = typeof options.index === "number" ? options.index : 0;
    const serializationIndex = serializer.serializeInto(buffer$1, object, checkKeys, 0, 0, serializeFunctions, ignoreUndefined);
    buffer$1.copy(finalBuffer, startIndex, 0, serializationIndex);
    return startIndex + serializationIndex - 1;
  }
  exports.serializeWithBufferAndIndex = serializeWithBufferAndIndex;
  function deserialize(buffer3, options = {}) {
    return deserializer.deserialize(ensure_buffer.ensureBuffer(buffer3), options);
  }
  exports.deserialize = deserialize;
  function calculateObjectSize(object, options = {}) {
    options = options || {};
    const serializeFunctions = typeof options.serializeFunctions === "boolean" ? options.serializeFunctions : false;
    const ignoreUndefined = typeof options.ignoreUndefined === "boolean" ? options.ignoreUndefined : true;
    return calculate_size.calculateObjectSize(object, serializeFunctions, ignoreUndefined);
  }
  exports.calculateObjectSize = calculateObjectSize;
  function deserializeStream(data, startIndex, numberOfDocuments, documents, docStartIndex, options) {
    const internalOptions = Object.assign({allowObjectSmallerThanBufferSize: true, index: 0}, options);
    const bufferData = ensure_buffer.ensureBuffer(data);
    let index = startIndex;
    for (let i = 0; i < numberOfDocuments; i++) {
      const size = bufferData[index] | bufferData[index + 1] << 8 | bufferData[index + 2] << 16 | bufferData[index + 3] << 24;
      internalOptions.index = index;
      documents[docStartIndex + i] = deserializer.deserialize(bufferData, internalOptions);
      index = index + size;
    }
    return index;
  }
  exports.deserializeStream = deserializeStream;
  const BSON = {
    Binary: binary.Binary,
    Code: code$1.Code,
    DBRef: db_ref.DBRef,
    Decimal128: decimal128.Decimal128,
    Double: double_1.Double,
    Int32: int_32.Int32,
    Long: long_1.Long,
    Map: map.Map,
    MaxKey: max_key.MaxKey,
    MinKey: min_key.MinKey,
    ObjectId: objectid.ObjectId,
    ObjectID: objectid.ObjectId,
    BSONRegExp: regexp.BSONRegExp,
    BSONSymbol: symbol.BSONSymbol,
    Timestamp: timestamp$1.Timestamp,
    EJSON: extended_json.EJSON,
    setInternalBufferSize,
    serialize,
    serializeWithBufferAndIndex,
    deserialize,
    calculateObjectSize,
    deserializeStream
  };
  exports.default = BSON;
});
var bson$1 = unwrapExports(bson);
var bson_1 = bson.deserializeStream;
var bson_2 = bson.calculateObjectSize;
var bson_3 = bson.deserialize;
var bson_4 = bson.serializeWithBufferAndIndex;
var bson_5 = bson.serialize;
var bson_6 = bson.setInternalBufferSize;
var bson_7 = bson.ObjectID;
var bson_8 = bson.Decimal128;
var bson_9 = bson.BSONRegExp;
var bson_10 = bson.MaxKey;
var bson_11 = bson.MinKey;
var bson_12 = bson.Int32;
var bson_13 = bson.Double;
var bson_14 = bson.Timestamp;
var bson_15 = bson.Long;
var bson_16 = bson.ObjectId;
var bson_17 = bson.Binary;
var bson_18 = bson.DBRef;
var bson_19 = bson.BSONSymbol;
var bson_20 = bson.Map;
var bson_21 = bson.Code;
var bson_22 = bson.LongWithoutOverridesClass;
var bson_23 = bson.EJSON;
var bson_24 = bson.BSON_INT64_MIN;
var bson_25 = bson.BSON_INT64_MAX;
var bson_26 = bson.BSON_INT32_MIN;
var bson_27 = bson.BSON_INT32_MAX;
var bson_28 = bson.BSON_DATA_UNDEFINED;
var bson_29 = bson.BSON_DATA_TIMESTAMP;
var bson_30 = bson.BSON_DATA_SYMBOL;
var bson_31 = bson.BSON_DATA_STRING;
var bson_32 = bson.BSON_DATA_REGEXP;
var bson_33 = bson.BSON_DATA_OID;
var bson_34 = bson.BSON_DATA_OBJECT;
var bson_35 = bson.BSON_DATA_NUMBER;
var bson_36 = bson.BSON_DATA_NULL;
var bson_37 = bson.BSON_DATA_MIN_KEY;
var bson_38 = bson.BSON_DATA_MAX_KEY;
var bson_39 = bson.BSON_DATA_LONG;
var bson_40 = bson.BSON_DATA_INT;
var bson_41 = bson.BSON_DATA_DECIMAL128;
var bson_42 = bson.BSON_DATA_DBPOINTER;
var bson_43 = bson.BSON_DATA_DATE;
var bson_44 = bson.BSON_DATA_CODE_W_SCOPE;
var bson_45 = bson.BSON_DATA_CODE;
var bson_46 = bson.BSON_DATA_BOOLEAN;
var bson_47 = bson.BSON_DATA_BINARY;
var bson_48 = bson.BSON_DATA_ARRAY;
var bson_49 = bson.BSON_BINARY_SUBTYPE_UUID_NEW;
var bson_50 = bson.BSON_BINARY_SUBTYPE_UUID;
var bson_51 = bson.BSON_BINARY_SUBTYPE_USER_DEFINED;
var bson_52 = bson.BSON_BINARY_SUBTYPE_MD5;
var bson_53 = bson.BSON_BINARY_SUBTYPE_FUNCTION;
var bson_54 = bson.BSON_BINARY_SUBTYPE_DEFAULT;
var bson_55 = bson.BSON_BINARY_SUBTYPE_BYTE_ARRAY;
export default bson$1;
export {bson_9 as BSONRegExp, bson_19 as BSONSymbol, bson_55 as BSON_BINARY_SUBTYPE_BYTE_ARRAY, bson_54 as BSON_BINARY_SUBTYPE_DEFAULT, bson_53 as BSON_BINARY_SUBTYPE_FUNCTION, bson_52 as BSON_BINARY_SUBTYPE_MD5, bson_51 as BSON_BINARY_SUBTYPE_USER_DEFINED, bson_50 as BSON_BINARY_SUBTYPE_UUID, bson_49 as BSON_BINARY_SUBTYPE_UUID_NEW, bson_48 as BSON_DATA_ARRAY, bson_47 as BSON_DATA_BINARY, bson_46 as BSON_DATA_BOOLEAN, bson_45 as BSON_DATA_CODE, bson_44 as BSON_DATA_CODE_W_SCOPE, bson_43 as BSON_DATA_DATE, bson_42 as BSON_DATA_DBPOINTER, bson_41 as BSON_DATA_DECIMAL128, bson_40 as BSON_DATA_INT, bson_39 as BSON_DATA_LONG, bson_38 as BSON_DATA_MAX_KEY, bson_37 as BSON_DATA_MIN_KEY, bson_36 as BSON_DATA_NULL, bson_35 as BSON_DATA_NUMBER, bson_34 as BSON_DATA_OBJECT, bson_33 as BSON_DATA_OID, bson_32 as BSON_DATA_REGEXP, bson_31 as BSON_DATA_STRING, bson_30 as BSON_DATA_SYMBOL, bson_29 as BSON_DATA_TIMESTAMP, bson_28 as BSON_DATA_UNDEFINED, bson_27 as BSON_INT32_MAX, bson_26 as BSON_INT32_MIN, bson_25 as BSON_INT64_MAX, bson_24 as BSON_INT64_MIN, bson_17 as Binary, bson_21 as Code, bson_18 as DBRef, bson_8 as Decimal128, bson_13 as Double, bson_23 as EJSON, bson_12 as Int32, bson_15 as Long, bson_22 as LongWithoutOverridesClass, bson_20 as Map, bson_10 as MaxKey, bson_11 as MinKey, bson_7 as ObjectID, bson_16 as ObjectId, bson_14 as Timestamp, bson_2 as calculateObjectSize, bson_3 as deserialize, bson_1 as deserializeStream, bson_5 as serialize, bson_4 as serializeWithBufferAndIndex, bson_6 as setInternalBufferSize};
