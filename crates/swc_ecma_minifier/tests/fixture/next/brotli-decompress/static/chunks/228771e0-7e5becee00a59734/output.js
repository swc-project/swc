"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        445
    ],
    {
        1852: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            __webpack_require__.d(__webpack_exports__, {
                Z: function() {
                    return PNG;
                }
            });
            var global$1 = void 0 !== __webpack_require__.g ? __webpack_require__.g : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {};
            var lookup$1 = [];
            var revLookup$1 = [];
            var Arr$1 = 'undefined' != typeof Uint8Array ? Uint8Array : Array;
            var inited = false;
            function init() {
                inited = true;
                var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                for(var i = 0, len = code.length; i < len; ++i){
                    lookup$1[i] = code[i];
                    revLookup$1[code.charCodeAt(i)] = i;
                }
                revLookup$1['-'.charCodeAt(0)] = 62;
                revLookup$1['_'.charCodeAt(0)] = 63;
            }
            function toByteArray$1(b64) {
                if (!inited) init();
                var i, j, l, tmp, placeHolders, arr;
                var len = b64.length;
                if (len % 4 > 0) {
                    throw Error('Invalid string. Length must be a multiple of 4');
                }
                placeHolders = '=' === b64[len - 2] ? 2 : '=' === b64[len - 1] ? 1 : 0;
                arr = new Arr$1(3 * len / 4 - placeHolders);
                l = placeHolders > 0 ? len - 4 : len;
                var L = 0;
                for(i = 0, j = 0; i < l; i += 4, j += 3){
                    tmp = revLookup$1[b64.charCodeAt(i)] << 18 | revLookup$1[b64.charCodeAt(i + 1)] << 12 | revLookup$1[b64.charCodeAt(i + 2)] << 6 | revLookup$1[b64.charCodeAt(i + 3)];
                    arr[L++] = tmp >> 16 & 0xFF;
                    arr[L++] = tmp >> 8 & 0xFF;
                    arr[L++] = 0xFF & tmp;
                }
                if (2 === placeHolders) {
                    tmp = revLookup$1[b64.charCodeAt(i)] << 2 | revLookup$1[b64.charCodeAt(i + 1)] >> 4;
                    arr[L++] = 0xFF & tmp;
                } else if (1 === placeHolders) {
                    tmp = revLookup$1[b64.charCodeAt(i)] << 10 | revLookup$1[b64.charCodeAt(i + 1)] << 4 | revLookup$1[b64.charCodeAt(i + 2)] >> 2;
                    arr[L++] = tmp >> 8 & 0xFF;
                    arr[L++] = 0xFF & tmp;
                }
                return arr;
            }
            function tripletToBase64$1(num) {
                return lookup$1[num >> 18 & 0x3F] + lookup$1[num >> 12 & 0x3F] + lookup$1[num >> 6 & 0x3F] + lookup$1[0x3F & num];
            }
            function encodeChunk$1(uint8, start, end) {
                var tmp;
                var output = [];
                for(var i = start; i < end; i += 3){
                    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
                    output.push(tripletToBase64$1(tmp));
                }
                return output.join('');
            }
            function fromByteArray$1(uint8) {
                if (!inited) init();
                var tmp;
                var len = uint8.length;
                var extraBytes = len % 3;
                var output = '';
                var parts = [];
                var maxChunkLength = 16383;
                for(var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength)parts.push(encodeChunk$1(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
                if (1 === extraBytes) {
                    tmp = uint8[len - 1];
                    output += lookup$1[tmp >> 2];
                    output += lookup$1[tmp << 4 & 0x3F];
                    output += '==';
                } else if (2 === extraBytes) {
                    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
                    output += lookup$1[tmp >> 10];
                    output += lookup$1[tmp >> 4 & 0x3F];
                    output += lookup$1[tmp << 2 & 0x3F];
                    output += '=';
                }
                parts.push(output);
                return parts.join('');
            }
            function read(buffer, offset, isLE, mLen, nBytes) {
                var e, m;
                var eLen = 8 * nBytes - mLen - 1;
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
                for(; nBits > 0; e = 256 * e + buffer[offset + i], i += d, nBits -= 8);
                m = e & (1 << -nBits) - 1;
                e >>= -nBits;
                nBits += mLen;
                for(; nBits > 0; m = 256 * m + buffer[offset + i], i += d, nBits -= 8);
                if (0 === e) e = 1 - eBias;
                else if (e === eMax) {
                    return m ? NaN : (s ? -1 : 1) * (1 / 0);
                } else {
                    m += Math.pow(2, mLen);
                    e -= eBias;
                }
                return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
            }
            function write(buffer, value, offset, isLE, mLen, nBytes) {
                var e, m, c;
                var eLen = 8 * nBytes - mLen - 1;
                var eMax = (1 << eLen) - 1;
                var eBias = eMax >> 1;
                var rt = 23 === mLen ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
                var i = isLE ? 0 : nBytes - 1;
                var d = isLE ? 1 : -1;
                var s = value < 0 || 0 === value && 1 / value < 0 ? 1 : 0;
                value = Math.abs(value);
                if (isNaN(value) || value === 1 / 0) {
                    m = isNaN(value) ? 1 : 0;
                    e = eMax;
                } else {
                    e = Math.floor(Math.log(value) / Math.LN2);
                    if (value * (c = Math.pow(2, -e)) < 1) {
                        e--;
                        c *= 2;
                    }
                    if (e + eBias >= 1) value += rt / c;
                    else value += rt * Math.pow(2, 1 - eBias);
                    if (value * c >= 2) {
                        e++;
                        c /= 2;
                    }
                    if (e + eBias >= eMax) {
                        m = 0;
                        e = eMax;
                    } else if (e + eBias >= 1) {
                        m = (value * c - 1) * Math.pow(2, mLen);
                        e += eBias;
                    } else {
                        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
                        e = 0;
                    }
                }
                for(; mLen >= 8; buffer[offset + i] = 0xff & m, i += d, m /= 256, mLen -= 8);
                e = e << mLen | m;
                eLen += mLen;
                for(; eLen > 0; buffer[offset + i] = 0xff & e, i += d, e /= 256, eLen -= 8);
                buffer[offset + i - d] |= 128 * s;
            }
            var toString$1 = {}.toString;
            var isArray = Array.isArray || function(arr) {
                return '[object Array]' == toString$1.call(arr);
            };
            var INSPECT_MAX_BYTES = 50;
            Buffer$1.TYPED_ARRAY_SUPPORT = void 0 === global$1.TYPED_ARRAY_SUPPORT || global$1.TYPED_ARRAY_SUPPORT;
            function kMaxLength() {
                return Buffer$1.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
            }
            function createBuffer(that, length) {
                if (kMaxLength() < length) {
                    throw RangeError('Invalid typed array length');
                }
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    that = new Uint8Array(length);
                    that.__proto__ = Buffer$1.prototype;
                } else {
                    if (null === that) that = new Buffer$1(length);
                    that.length = length;
                }
                return that;
            }
            function Buffer$1(arg, encodingOrOffset, length) {
                if (!Buffer$1.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer$1)) {
                    return new Buffer$1(arg, encodingOrOffset, length);
                }
                if ('number' == typeof arg) {
                    if ('string' == typeof encodingOrOffset) {
                        throw Error('If encoding is specified then the first argument must be a string');
                    }
                    return allocUnsafe(this, arg);
                }
                return from(this, arg, encodingOrOffset, length);
            }
            Buffer$1.poolSize = 8192;
            Buffer$1._augment = function(arr) {
                arr.__proto__ = Buffer$1.prototype;
                return arr;
            };
            function from(that, value, encodingOrOffset, length) {
                if ('number' == typeof value) {
                    throw TypeError('"value" argument must not be a number');
                }
                if ('undefined' != typeof ArrayBuffer && value instanceof ArrayBuffer) {
                    return fromArrayBuffer(that, value, encodingOrOffset, length);
                }
                if ('string' == typeof value) {
                    return fromString(that, value, encodingOrOffset);
                }
                return fromObject(that, value);
            }
            Buffer$1.from = function(value, encodingOrOffset, length) {
                return from(null, value, encodingOrOffset, length);
            };
            if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                Buffer$1.prototype.__proto__ = Uint8Array.prototype;
                Buffer$1.__proto__ = Uint8Array;
            }
            function assertSize(size) {
                if ('number' != typeof size) {
                    throw TypeError('"size" argument must be a number');
                }
                if (size < 0) {
                    throw RangeError('"size" argument must not be negative');
                }
            }
            function alloc(that, size, fill, encoding) {
                assertSize(size);
                if (size <= 0) {
                    return createBuffer(that, size);
                }
                if (void 0 !== fill) {
                    return 'string' == typeof encoding ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
                }
                return createBuffer(that, size);
            }
            Buffer$1.alloc = function(size, fill, encoding) {
                return alloc(null, size, fill, encoding);
            };
            function allocUnsafe(that, size) {
                assertSize(size);
                that = createBuffer(that, size < 0 ? 0 : 0 | checked(size));
                if (!Buffer$1.TYPED_ARRAY_SUPPORT) {
                    for(var i = 0; i < size; ++i)that[i] = 0;
                }
                return that;
            }
            Buffer$1.allocUnsafe = function(size) {
                return allocUnsafe(null, size);
            };
            Buffer$1.allocUnsafeSlow = function(size) {
                return allocUnsafe(null, size);
            };
            function fromString(that, string, encoding) {
                if ('string' != typeof encoding || '' === encoding) encoding = 'utf8';
                if (!Buffer$1.isEncoding(encoding)) {
                    throw TypeError('"encoding" must be a valid string encoding');
                }
                var length = 0 | byteLength$1(string, encoding);
                that = createBuffer(that, length);
                var actual = that.write(string, encoding);
                if (actual !== length) that = that.slice(0, actual);
                return that;
            }
            function fromArrayLike(that, array) {
                var length = array.length < 0 ? 0 : 0 | checked(array.length);
                that = createBuffer(that, length);
                for(var i = 0; i < length; i += 1)that[i] = 255 & array[i];
                return that;
            }
            function fromArrayBuffer(that, array, byteOffset, length) {
                array.byteLength;
                if (byteOffset < 0 || array.byteLength < byteOffset) {
                    throw RangeError('\'offset\' is out of bounds');
                }
                if (array.byteLength < byteOffset + (length || 0)) {
                    throw RangeError('\'length\' is out of bounds');
                }
                array = void 0 === byteOffset && void 0 === length ? new Uint8Array(array) : void 0 === length ? new Uint8Array(array, byteOffset) : new Uint8Array(array, byteOffset, length);
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    that = array;
                    that.__proto__ = Buffer$1.prototype;
                } else {
                    that = fromArrayLike(that, array);
                }
                return that;
            }
            function fromObject(that, obj) {
                if (internalIsBuffer(obj)) {
                    var len = 0 | checked(obj.length);
                    that = createBuffer(that, len);
                    if (0 === that.length) {
                        return that;
                    }
                    obj.copy(that, 0, 0, len);
                    return that;
                }
                if (obj) {
                    if ('undefined' != typeof ArrayBuffer && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
                        if ('number' != typeof obj.length || isnan(obj.length)) {
                            return createBuffer(that, 0);
                        }
                        return fromArrayLike(that, obj);
                    }
                    if ('Buffer' === obj.type && isArray(obj.data)) {
                        return fromArrayLike(that, obj.data);
                    }
                }
                throw TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
            }
            function checked(length) {
                if (length >= kMaxLength()) {
                    throw RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + kMaxLength().toString(16) + ' bytes');
                }
                return 0 | length;
            }
            Buffer$1.isBuffer = isBuffer;
            function internalIsBuffer(b) {
                return !!(null != b && b._isBuffer);
            }
            Buffer$1.compare = function compare(a, b) {
                if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
                    throw TypeError('Arguments must be Buffers');
                }
                if (a === b) return 0;
                var x = a.length;
                var y = b.length;
                for(var i = 0, len = Math.min(x, y); i < len; ++i)if (a[i] !== b[i]) {
                    x = a[i];
                    y = b[i];
                    break;
                }
                if (x < y) return -1;
                if (y < x) return 1;
                return 0;
            };
            Buffer$1.isEncoding = function isEncoding(encoding) {
                switch(String(encoding).toLowerCase()){
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
            Buffer$1.concat = function concat(list, length) {
                if (!isArray(list)) {
                    throw TypeError('"list" argument must be an Array of Buffers');
                }
                if (0 === list.length) {
                    return Buffer$1.alloc(0);
                }
                var i;
                if (void 0 === length) {
                    length = 0;
                    for(i = 0; i < list.length; ++i)length += list[i].length;
                }
                var buffer = Buffer$1.allocUnsafe(length);
                var pos = 0;
                for(i = 0; i < list.length; ++i){
                    var buf = list[i];
                    if (!internalIsBuffer(buf)) {
                        throw TypeError('"list" argument must be an Array of Buffers');
                    }
                    buf.copy(buffer, pos);
                    pos += buf.length;
                }
                return buffer;
            };
            function byteLength$1(string, encoding) {
                if (internalIsBuffer(string)) {
                    return string.length;
                }
                if ('undefined' != typeof ArrayBuffer && 'function' == typeof ArrayBuffer.isView && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
                    return string.byteLength;
                }
                if ('string' != typeof string) string = '' + string;
                var len = string.length;
                if (0 === len) return 0;
                var loweredCase = false;
                for(;;){
                    switch(encoding){
                        case 'ascii':
                        case 'latin1':
                        case 'binary':
                            return len;
                        case 'utf8':
                        case 'utf-8':
                        case void 0:
                            return utf8ToBytes(string).length;
                        case 'ucs2':
                        case 'ucs-2':
                        case 'utf16le':
                        case 'utf-16le':
                            return 2 * len;
                        case 'hex':
                            return len >>> 1;
                        case 'base64':
                            return base64ToBytes(string).length;
                        default:
                            if (loweredCase) return utf8ToBytes(string).length;
                            encoding = ('' + encoding).toLowerCase();
                            loweredCase = true;
                    }
                }
            }
            Buffer$1.byteLength = byteLength$1;
            function slowToString(encoding, start, end) {
                var loweredCase = false;
                if (void 0 === start || start < 0) start = 0;
                if (start > this.length) {
                    return '';
                }
                if (void 0 === end || end > this.length) end = this.length;
                if (end <= 0) {
                    return '';
                }
                end >>>= 0;
                start >>>= 0;
                if (end <= start) {
                    return '';
                }
                if (!encoding) encoding = 'utf8';
                while(true){
                    switch(encoding){
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
                            if (loweredCase) throw TypeError('Unknown encoding: ' + encoding);
                            encoding = (encoding + '').toLowerCase();
                            loweredCase = true;
                    }
                }
            }
            Buffer$1.prototype._isBuffer = true;
            function swap(b, n, m) {
                var i = b[n];
                b[n] = b[m];
                b[m] = i;
            }
            Buffer$1.prototype.swap16 = function swap16() {
                var len = this.length;
                if (len % 2 !== 0) {
                    throw RangeError('Buffer size must be a multiple of 16-bits');
                }
                for(var i = 0; i < len; i += 2)swap(this, i, i + 1);
                return this;
            };
            Buffer$1.prototype.swap32 = function swap32() {
                var len = this.length;
                if (len % 4 !== 0) {
                    throw RangeError('Buffer size must be a multiple of 32-bits');
                }
                for(var i = 0; i < len; i += 4){
                    swap(this, i, i + 3);
                    swap(this, i + 1, i + 2);
                }
                return this;
            };
            Buffer$1.prototype.swap64 = function swap64() {
                var len = this.length;
                if (len % 8 !== 0) {
                    throw RangeError('Buffer size must be a multiple of 64-bits');
                }
                for(var i = 0; i < len; i += 8){
                    swap(this, i, i + 7);
                    swap(this, i + 1, i + 6);
                    swap(this, i + 2, i + 5);
                    swap(this, i + 3, i + 4);
                }
                return this;
            };
            Buffer$1.prototype.toString = function toString() {
                var length = 0 | this.length;
                if (0 === length) return '';
                if (0 === arguments.length) return utf8Slice(this, 0, length);
                return slowToString.apply(this, arguments);
            };
            Buffer$1.prototype.equals = function equals(b) {
                if (!internalIsBuffer(b)) throw TypeError('Argument must be a Buffer');
                if (this === b) return true;
                return 0 === Buffer$1.compare(this, b);
            };
            Buffer$1.prototype.inspect = function inspect() {
                var str = '';
                var max = INSPECT_MAX_BYTES;
                if (this.length > 0) {
                    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
                    if (this.length > max) str += ' ... ';
                }
                return '<Buffer ' + str + '>';
            };
            Buffer$1.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
                if (!internalIsBuffer(target)) {
                    throw TypeError('Argument must be a Buffer');
                }
                if (void 0 === start) start = 0;
                if (void 0 === end) end = target ? target.length : 0;
                if (void 0 === thisStart) thisStart = 0;
                if (void 0 === thisEnd) thisEnd = this.length;
                if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
                    throw RangeError('out of range index');
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
                for(var i = 0; i < len; ++i)if (thisCopy[i] !== targetCopy[i]) {
                    x = thisCopy[i];
                    y = targetCopy[i];
                    break;
                }
                if (x < y) return -1;
                if (y < x) return 1;
                return 0;
            };
            function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
                if (0 === buffer.length) return -1;
                if ('string' == typeof byteOffset) {
                    encoding = byteOffset;
                    byteOffset = 0;
                } else if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff;
                else if (byteOffset < -2147483648) byteOffset = -2147483648;
                byteOffset = +byteOffset;
                if (isNaN(byteOffset)) byteOffset = dir ? 0 : buffer.length - 1;
                if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
                if (byteOffset >= buffer.length) {
                    if (dir) return -1;
                    byteOffset = buffer.length - 1;
                } else if (byteOffset < 0) {
                    if (!dir) return -1;
                    byteOffset = 0;
                }
                if ('string' == typeof val) val = Buffer$1.from(val, encoding);
                if (internalIsBuffer(val)) {
                    if (0 === val.length) {
                        return -1;
                    }
                    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
                }
                if ('number' == typeof val) {
                    val &= 0xFF;
                    if (Buffer$1.TYPED_ARRAY_SUPPORT && 'function' == typeof Uint8Array.prototype.indexOf) {
                        if (dir) {
                            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
                        }
                        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
                    }
                    return arrayIndexOf(buffer, [
                        val
                    ], byteOffset, encoding, dir);
                }
                throw TypeError('val must be string, number or Buffer');
            }
            function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
                var indexSize = 1;
                var arrLength = arr.length;
                var valLength = val.length;
                if (void 0 !== encoding) {
                    encoding = String(encoding).toLowerCase();
                    if ('ucs2' === encoding || 'ucs-2' === encoding || 'utf16le' === encoding || 'utf-16le' === encoding) {
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
                    if (1 === indexSize) {
                        return buf[i];
                    }
                    return buf.readUInt16BE(i * indexSize);
                }
                var i;
                if (dir) {
                    var foundIndex = -1;
                    for(i = byteOffset; i < arrLength; i++)if (read(arr, i) === read(val, -1 === foundIndex ? 0 : i - foundIndex)) {
                        if (-1 === foundIndex) foundIndex = i;
                        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
                    } else {
                        if (-1 !== foundIndex) i -= i - foundIndex;
                        foundIndex = -1;
                    }
                } else {
                    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
                    for(i = byteOffset; i >= 0; i--){
                        var found = true;
                        for(var j = 0; j < valLength; j++)if (read(arr, i + j) !== read(val, j)) {
                            found = false;
                            break;
                        }
                        if (found) return i;
                    }
                }
                return -1;
            }
            Buffer$1.prototype.includes = function includes(val, byteOffset, encoding) {
                return -1 !== this.indexOf(val, byteOffset, encoding);
            };
            Buffer$1.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
                return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
            };
            Buffer$1.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
                return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
            };
            function hexWrite(buf, string, offset, length) {
                offset = Number(offset) || 0;
                var remaining = buf.length - offset;
                if (length) {
                    length = Number(length);
                    if (length > remaining) length = remaining;
                } else {
                    length = remaining;
                }
                var strLen = string.length;
                if (strLen % 2 !== 0) throw TypeError('Invalid hex string');
                if (length > strLen / 2) length = strLen / 2;
                for(var i = 0; i < length; ++i){
                    var parsed = parseInt(string.substr(2 * i, 2), 16);
                    if (isNaN(parsed)) return i;
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
            Buffer$1.prototype.write = function write(string, offset, length, encoding) {
                if (void 0 === offset) {
                    encoding = 'utf8';
                    length = this.length;
                    offset = 0;
                } else if (void 0 === length && 'string' == typeof offset) {
                    encoding = offset;
                    length = this.length;
                    offset = 0;
                } else if (isFinite(offset)) {
                    offset |= 0;
                    if (isFinite(length)) {
                        length |= 0;
                        if (void 0 === encoding) encoding = 'utf8';
                    } else {
                        encoding = length;
                        length = void 0;
                    }
                } else {
                    throw Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
                }
                var remaining = this.length - offset;
                if (void 0 === length || length > remaining) length = remaining;
                if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
                    throw RangeError('Attempt to write outside buffer bounds');
                }
                if (!encoding) encoding = 'utf8';
                var loweredCase = false;
                for(;;){
                    switch(encoding){
                        case 'hex':
                            return hexWrite(this, string, offset, length);
                        case 'utf8':
                        case 'utf-8':
                            return utf8Write(this, string, offset, length);
                        case 'ascii':
                            return asciiWrite(this, string, offset, length);
                        case 'latin1':
                        case 'binary':
                            return latin1Write(this, string, offset, length);
                        case 'base64':
                            return base64Write(this, string, offset, length);
                        case 'ucs2':
                        case 'ucs-2':
                        case 'utf16le':
                        case 'utf-16le':
                            return ucs2Write(this, string, offset, length);
                        default:
                            if (loweredCase) throw TypeError('Unknown encoding: ' + encoding);
                            encoding = ('' + encoding).toLowerCase();
                            loweredCase = true;
                    }
                }
            };
            Buffer$1.prototype.toJSON = function toJSON() {
                return {
                    type: 'Buffer',
                    data: Array.prototype.slice.call(this._arr || this, 0)
                };
            };
            function base64Slice(buf, start, end) {
                if (0 === start && end === buf.length) {
                    return fromByteArray$1(buf);
                }
                return fromByteArray$1(buf.slice(start, end));
            }
            function utf8Slice(buf, start, end) {
                end = Math.min(buf.length, end);
                var res = [];
                var i = start;
                while(i < end){
                    var firstByte = buf[i];
                    var codePoint = null;
                    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;
                    if (i + bytesPerSequence <= end) {
                        var secondByte, thirdByte, fourthByte, tempCodePoint;
                        switch(bytesPerSequence){
                            case 1:
                                if (firstByte < 0x80) codePoint = firstByte;
                                break;
                            case 2:
                                secondByte = buf[i + 1];
                                if ((0xC0 & secondByte) === 0x80) {
                                    tempCodePoint = (0x1F & firstByte) << 0x6 | 0x3F & secondByte;
                                    if (tempCodePoint > 0x7F) codePoint = tempCodePoint;
                                }
                                break;
                            case 3:
                                secondByte = buf[i + 1];
                                thirdByte = buf[i + 2];
                                if ((0xC0 & secondByte) === 0x80 && (0xC0 & thirdByte) === 0x80) {
                                    tempCodePoint = (0xF & firstByte) << 0xC | (0x3F & secondByte) << 0x6 | 0x3F & thirdByte;
                                    if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) codePoint = tempCodePoint;
                                }
                                break;
                            case 4:
                                secondByte = buf[i + 1];
                                thirdByte = buf[i + 2];
                                fourthByte = buf[i + 3];
                                if ((0xC0 & secondByte) === 0x80 && (0xC0 & thirdByte) === 0x80 && (0xC0 & fourthByte) === 0x80) {
                                    tempCodePoint = (0xF & firstByte) << 0x12 | (0x3F & secondByte) << 0xC | (0x3F & thirdByte) << 0x6 | 0x3F & fourthByte;
                                    if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) codePoint = tempCodePoint;
                                }
                        }
                    }
                    if (null === codePoint) {
                        codePoint = 0xFFFD;
                        bytesPerSequence = 1;
                    } else if (codePoint > 0xFFFF) {
                        codePoint -= 0x10000;
                        res.push(codePoint >>> 10 & 0x3FF | 0xD800);
                        codePoint = 0xDC00 | 0x3FF & codePoint;
                    }
                    res.push(codePoint);
                    i += bytesPerSequence;
                }
                return decodeCodePointsArray(res);
            }
            var MAX_ARGUMENTS_LENGTH = 0x1000;
            function decodeCodePointsArray(codePoints) {
                var len = codePoints.length;
                if (len <= MAX_ARGUMENTS_LENGTH) {
                    return String.fromCharCode.apply(String, codePoints);
                }
                var res = '';
                var i = 0;
                while(i < len){
                    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
                }
                return res;
            }
            function asciiSlice(buf, start, end) {
                var ret = '';
                end = Math.min(buf.length, end);
                for(var i = start; i < end; ++i)ret += String.fromCharCode(0x7F & buf[i]);
                return ret;
            }
            function latin1Slice(buf, start, end) {
                var ret = '';
                end = Math.min(buf.length, end);
                for(var i = start; i < end; ++i)ret += String.fromCharCode(buf[i]);
                return ret;
            }
            function hexSlice(buf, start, end) {
                var len = buf.length;
                if (!start || start < 0) start = 0;
                if (!end || end < 0 || end > len) end = len;
                var out = '';
                for(var i = start; i < end; ++i)out += toHex(buf[i]);
                return out;
            }
            function utf16leSlice(buf, start, end) {
                var bytes = buf.slice(start, end);
                var res = '';
                for(var i = 0; i < bytes.length; i += 2)res += String.fromCharCode(bytes[i] + 256 * bytes[i + 1]);
                return res;
            }
            Buffer$1.prototype.slice = function slice(start, end) {
                var len = this.length;
                start = ~~start;
                end = void 0 === end ? len : ~~end;
                if (start < 0) {
                    start += len;
                    if (start < 0) start = 0;
                } else if (start > len) start = len;
                if (end < 0) {
                    end += len;
                    if (end < 0) end = 0;
                } else if (end > len) end = len;
                if (end < start) end = start;
                var newBuf;
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    newBuf = this.subarray(start, end);
                    newBuf.__proto__ = Buffer$1.prototype;
                } else {
                    var sliceLen = end - start;
                    newBuf = new Buffer$1(sliceLen, void 0);
                    for(var i = 0; i < sliceLen; ++i)newBuf[i] = this[i + start];
                }
                return newBuf;
            };
            function checkOffset(offset, ext, length) {
                if (offset % 1 !== 0 || offset < 0) throw RangeError('offset is not uint');
                if (offset + ext > length) throw RangeError('Trying to access beyond buffer length');
            }
            Buffer$1.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
                offset |= 0;
                byteLength |= 0;
                if (!noAssert) checkOffset(offset, byteLength, this.length);
                var val = this[offset];
                var mul = 1;
                var i = 0;
                while(++i < byteLength && (mul *= 0x100)){
                    val += this[offset + i] * mul;
                }
                return val;
            };
            Buffer$1.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
                offset |= 0;
                byteLength |= 0;
                if (!noAssert) checkOffset(offset, byteLength, this.length);
                var val = this[offset + --byteLength];
                var mul = 1;
                while(byteLength > 0 && (mul *= 0x100)){
                    val += this[offset + --byteLength] * mul;
                }
                return val;
            };
            Buffer$1.prototype.readUInt8 = function readUInt8(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 1, this.length);
                return this[offset];
            };
            Buffer$1.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 2, this.length);
                return this[offset] | this[offset + 1] << 8;
            };
            Buffer$1.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 2, this.length);
                return this[offset] << 8 | this[offset + 1];
            };
            Buffer$1.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 4, this.length);
                return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + 0x1000000 * this[offset + 3];
            };
            Buffer$1.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 4, this.length);
                return 0x1000000 * this[offset] + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
            };
            Buffer$1.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
                offset |= 0;
                byteLength |= 0;
                if (!noAssert) checkOffset(offset, byteLength, this.length);
                var val = this[offset];
                var mul = 1;
                var i = 0;
                while(++i < byteLength && (mul *= 0x100)){
                    val += this[offset + i] * mul;
                }
                mul *= 0x80;
                if (val >= mul) val -= Math.pow(2, 8 * byteLength);
                return val;
            };
            Buffer$1.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
                offset |= 0;
                byteLength |= 0;
                if (!noAssert) checkOffset(offset, byteLength, this.length);
                var i = byteLength;
                var mul = 1;
                var val = this[offset + --i];
                while(i > 0 && (mul *= 0x100)){
                    val += this[offset + --i] * mul;
                }
                mul *= 0x80;
                if (val >= mul) val -= Math.pow(2, 8 * byteLength);
                return val;
            };
            Buffer$1.prototype.readInt8 = function readInt8(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 1, this.length);
                if (!(0x80 & this[offset])) return this[offset];
                return (0xff - this[offset] + 1) * -1;
            };
            Buffer$1.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 2, this.length);
                var val = this[offset] | this[offset + 1] << 8;
                return 0x8000 & val ? 0xFFFF0000 | val : val;
            };
            Buffer$1.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 2, this.length);
                var val = this[offset + 1] | this[offset] << 8;
                return 0x8000 & val ? 0xFFFF0000 | val : val;
            };
            Buffer$1.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 4, this.length);
                return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
            };
            Buffer$1.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 4, this.length);
                return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
            };
            Buffer$1.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 4, this.length);
                return read(this, offset, true, 23, 4);
            };
            Buffer$1.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 4, this.length);
                return read(this, offset, false, 23, 4);
            };
            Buffer$1.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 8, this.length);
                return read(this, offset, true, 52, 8);
            };
            Buffer$1.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 8, this.length);
                return read(this, offset, false, 52, 8);
            };
            function checkInt(buf, value, offset, ext, max, min) {
                if (!internalIsBuffer(buf)) throw TypeError('"buffer" argument must be a Buffer instance');
                if (value > max || value < min) throw RangeError('"value" argument is out of bounds');
                if (offset + ext > buf.length) throw RangeError('Index out of range');
            }
            Buffer$1.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
                value = +value;
                offset |= 0;
                byteLength |= 0;
                if (!noAssert) {
                    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                    checkInt(this, value, offset, byteLength, maxBytes, 0);
                }
                var mul = 1;
                var i = 0;
                this[offset] = 0xFF & value;
                while(++i < byteLength && (mul *= 0x100)){
                    this[offset + i] = value / mul & 0xFF;
                }
                return offset + byteLength;
            };
            Buffer$1.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
                value = +value;
                offset |= 0;
                byteLength |= 0;
                if (!noAssert) {
                    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                    checkInt(this, value, offset, byteLength, maxBytes, 0);
                }
                var i = byteLength - 1;
                var mul = 1;
                this[offset + i] = 0xFF & value;
                while(--i >= 0 && (mul *= 0x100)){
                    this[offset + i] = value / mul & 0xFF;
                }
                return offset + byteLength;
            };
            Buffer$1.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
                value = +value;
                offset |= 0;
                if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
                if (!Buffer$1.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
                this[offset] = 0xff & value;
                return offset + 1;
            };
            function objectWriteUInt16(buf, value, offset, littleEndian) {
                if (value < 0) value = 0xffff + value + 1;
                for(var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i)buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
            }
            Buffer$1.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
                value = +value;
                offset |= 0;
                if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    this[offset] = 0xff & value;
                    this[offset + 1] = value >>> 8;
                } else {
                    objectWriteUInt16(this, value, offset, true);
                }
                return offset + 2;
            };
            Buffer$1.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
                value = +value;
                offset |= 0;
                if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    this[offset] = value >>> 8;
                    this[offset + 1] = 0xff & value;
                } else {
                    objectWriteUInt16(this, value, offset, false);
                }
                return offset + 2;
            };
            function objectWriteUInt32(buf, value, offset, littleEndian) {
                if (value < 0) value = 0xffffffff + value + 1;
                for(var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i)buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
            }
            Buffer$1.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
                value = +value;
                offset |= 0;
                if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    this[offset + 3] = value >>> 24;
                    this[offset + 2] = value >>> 16;
                    this[offset + 1] = value >>> 8;
                    this[offset] = 0xff & value;
                } else {
                    objectWriteUInt32(this, value, offset, true);
                }
                return offset + 4;
            };
            Buffer$1.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
                value = +value;
                offset |= 0;
                if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    this[offset] = value >>> 24;
                    this[offset + 1] = value >>> 16;
                    this[offset + 2] = value >>> 8;
                    this[offset + 3] = 0xff & value;
                } else {
                    objectWriteUInt32(this, value, offset, false);
                }
                return offset + 4;
            };
            Buffer$1.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
                value = +value;
                offset |= 0;
                if (!noAssert) {
                    var limit = Math.pow(2, 8 * byteLength - 1);
                    checkInt(this, value, offset, byteLength, limit - 1, -limit);
                }
                var i = 0;
                var mul = 1;
                var sub = 0;
                this[offset] = 0xFF & value;
                while(++i < byteLength && (mul *= 0x100)){
                    if (value < 0 && 0 === sub && 0 !== this[offset + i - 1]) sub = 1;
                    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
                }
                return offset + byteLength;
            };
            Buffer$1.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
                value = +value;
                offset |= 0;
                if (!noAssert) {
                    var limit = Math.pow(2, 8 * byteLength - 1);
                    checkInt(this, value, offset, byteLength, limit - 1, -limit);
                }
                var i = byteLength - 1;
                var mul = 1;
                var sub = 0;
                this[offset + i] = 0xFF & value;
                while(--i >= 0 && (mul *= 0x100)){
                    if (value < 0 && 0 === sub && 0 !== this[offset + i + 1]) sub = 1;
                    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
                }
                return offset + byteLength;
            };
            Buffer$1.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
                value = +value;
                offset |= 0;
                if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -128);
                if (!Buffer$1.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
                if (value < 0) value = 0xff + value + 1;
                this[offset] = 0xff & value;
                return offset + 1;
            };
            Buffer$1.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
                value = +value;
                offset |= 0;
                if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -32768);
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    this[offset] = 0xff & value;
                    this[offset + 1] = value >>> 8;
                } else {
                    objectWriteUInt16(this, value, offset, true);
                }
                return offset + 2;
            };
            Buffer$1.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
                value = +value;
                offset |= 0;
                if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -32768);
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    this[offset] = value >>> 8;
                    this[offset + 1] = 0xff & value;
                } else {
                    objectWriteUInt16(this, value, offset, false);
                }
                return offset + 2;
            };
            Buffer$1.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
                value = +value;
                offset |= 0;
                if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -2147483648);
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    this[offset] = 0xff & value;
                    this[offset + 1] = value >>> 8;
                    this[offset + 2] = value >>> 16;
                    this[offset + 3] = value >>> 24;
                } else {
                    objectWriteUInt32(this, value, offset, true);
                }
                return offset + 4;
            };
            Buffer$1.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
                value = +value;
                offset |= 0;
                if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -2147483648);
                if (value < 0) value = 0xffffffff + value + 1;
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    this[offset] = value >>> 24;
                    this[offset + 1] = value >>> 16;
                    this[offset + 2] = value >>> 8;
                    this[offset + 3] = 0xff & value;
                } else {
                    objectWriteUInt32(this, value, offset, false);
                }
                return offset + 4;
            };
            function checkIEEE754(buf, value, offset, ext, max, min) {
                if (offset + ext > buf.length) throw RangeError('Index out of range');
                if (offset < 0) throw RangeError('Index out of range');
            }
            function writeFloat(buf, value, offset, littleEndian, noAssert) {
                if (!noAssert) checkIEEE754(buf, value, offset, 4);
                write(buf, value, offset, littleEndian, 23, 4);
                return offset + 4;
            }
            Buffer$1.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
                return writeFloat(this, value, offset, true, noAssert);
            };
            Buffer$1.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
                return writeFloat(this, value, offset, false, noAssert);
            };
            function writeDouble(buf, value, offset, littleEndian, noAssert) {
                if (!noAssert) checkIEEE754(buf, value, offset, 8);
                write(buf, value, offset, littleEndian, 52, 8);
                return offset + 8;
            }
            Buffer$1.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
                return writeDouble(this, value, offset, true, noAssert);
            };
            Buffer$1.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
                return writeDouble(this, value, offset, false, noAssert);
            };
            Buffer$1.prototype.copy = function copy(target, targetStart, start, end) {
                if (!start) start = 0;
                if (!end && 0 !== end) end = this.length;
                if (targetStart >= target.length) targetStart = target.length;
                if (!targetStart) targetStart = 0;
                if (end > 0 && end < start) end = start;
                if (end === start) return 0;
                if (0 === target.length || 0 === this.length) return 0;
                if (targetStart < 0) {
                    throw RangeError('targetStart out of bounds');
                }
                if (start < 0 || start >= this.length) throw RangeError('sourceStart out of bounds');
                if (end < 0) throw RangeError('sourceEnd out of bounds');
                if (end > this.length) end = this.length;
                if (target.length - targetStart < end - start) end = target.length - targetStart + start;
                var len = end - start;
                var i;
                if (this === target && start < targetStart && targetStart < end) {
                    for(i = len - 1; i >= 0; --i)target[i + targetStart] = this[i + start];
                } else if (len < 1000 || !Buffer$1.TYPED_ARRAY_SUPPORT) {
                    for(i = 0; i < len; ++i)target[i + targetStart] = this[i + start];
                } else Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
                return len;
            };
            Buffer$1.prototype.fill = function fill(val, start, end, encoding) {
                if ('string' == typeof val) {
                    if ('string' == typeof start) {
                        encoding = start;
                        start = 0;
                        end = this.length;
                    } else if ('string' == typeof end) {
                        encoding = end;
                        end = this.length;
                    }
                    if (1 === val.length) {
                        var code = val.charCodeAt(0);
                        if (code < 256) val = code;
                    }
                    if (void 0 !== encoding && 'string' != typeof encoding) {
                        throw TypeError('encoding must be a string');
                    }
                    if ('string' == typeof encoding && !Buffer$1.isEncoding(encoding)) {
                        throw TypeError('Unknown encoding: ' + encoding);
                    }
                } else if ('number' == typeof val) val &= 255;
                if (start < 0 || this.length < start || this.length < end) {
                    throw RangeError('Out of range index');
                }
                if (end <= start) {
                    return this;
                }
                start >>>= 0;
                end = void 0 === end ? this.length : end >>> 0;
                if (!val) val = 0;
                var i;
                if ('number' == typeof val) {
                    for(i = start; i < end; ++i)this[i] = val;
                } else {
                    var bytes = internalIsBuffer(val) ? val : utf8ToBytes(new Buffer$1(val, encoding).toString());
                    var len = bytes.length;
                    for(i = 0; i < end - start; ++i)this[i + start] = bytes[i % len];
                }
                return this;
            };
            var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
            function base64clean(str) {
                str = stringtrim(str).replace(INVALID_BASE64_RE, '');
                if (str.length < 2) return '';
                while(str.length % 4 !== 0){
                    str += '=';
                }
                return str;
            }
            function stringtrim(str) {
                if (str.trim) return str.trim();
                return str.replace(/^\s+|\s+$/g, '');
            }
            function toHex(n) {
                if (n < 16) return '0' + n.toString(16);
                return n.toString(16);
            }
            function utf8ToBytes(string, units) {
                units = units || 1 / 0;
                var codePoint;
                var length = string.length;
                var leadSurrogate = null;
                var bytes = [];
                for(var i = 0; i < length; ++i){
                    codePoint = string.charCodeAt(i);
                    if (codePoint > 0xD7FF && codePoint < 0xE000) {
                        if (!leadSurrogate) {
                            if (codePoint > 0xDBFF) {
                                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                                continue;
                            }
                            if (i + 1 === length) {
                                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                                continue;
                            }
                            leadSurrogate = codePoint;
                            continue;
                        }
                        if (codePoint < 0xDC00) {
                            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                            leadSurrogate = codePoint;
                            continue;
                        }
                        codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
                    } else if (leadSurrogate) {
                        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                    }
                    leadSurrogate = null;
                    if (codePoint < 0x80) {
                        if ((units -= 1) < 0) break;
                        bytes.push(codePoint);
                    } else if (codePoint < 0x800) {
                        if ((units -= 2) < 0) break;
                        bytes.push(codePoint >> 0x6 | 0xC0, 0x3F & codePoint | 0x80);
                    } else if (codePoint < 0x10000) {
                        if ((units -= 3) < 0) break;
                        bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, 0x3F & codePoint | 0x80);
                    } else if (codePoint < 0x110000) {
                        if ((units -= 4) < 0) break;
                        bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, 0x3F & codePoint | 0x80);
                    } else {
                        throw Error('Invalid code point');
                    }
                }
                return bytes;
            }
            function asciiToBytes(str) {
                var byteArray = [];
                for(var i = 0; i < str.length; ++i)byteArray.push(0xFF & str.charCodeAt(i));
                return byteArray;
            }
            function utf16leToBytes(str, units) {
                var c, hi, lo;
                var byteArray = [];
                for(var i = 0; i < str.length; ++i){
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
                return toByteArray$1(base64clean(str));
            }
            function blitBuffer(src, dst, offset, length) {
                for(var i = 0; i < length; ++i){
                    if (i + offset >= dst.length || i >= src.length) break;
                    dst[i + offset] = src[i];
                }
                return i;
            }
            function isnan(val) {
                return val !== val;
            }
            function isBuffer(obj) {
                return null != obj && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj));
            }
            function isFastBuffer(obj) {
                return !!obj.constructor && 'function' == typeof obj.constructor.isBuffer && obj.constructor.isBuffer(obj);
            }
            function isSlowBuffer(obj) {
                return 'function' == typeof obj.readFloatLE && 'function' == typeof obj.slice && isFastBuffer(obj.slice(0, 0));
            }
            function defaultSetTimout$1() {
                throw Error('setTimeout has not been defined');
            }
            function defaultClearTimeout$1() {
                throw Error('clearTimeout has not been defined');
            }
            var cachedSetTimeout$1 = defaultSetTimout$1;
            var cachedClearTimeout$1 = defaultClearTimeout$1;
            if ('function' == typeof global$1.setTimeout) cachedSetTimeout$1 = setTimeout;
            if ('function' == typeof global$1.clearTimeout) cachedClearTimeout$1 = clearTimeout;
            function runTimeout$1(fun) {
                if (cachedSetTimeout$1 === setTimeout) {
                    return setTimeout(fun, 0);
                }
                if ((cachedSetTimeout$1 === defaultSetTimout$1 || !cachedSetTimeout$1) && setTimeout) {
                    cachedSetTimeout$1 = setTimeout;
                    return setTimeout(fun, 0);
                }
                try {
                    return cachedSetTimeout$1(fun, 0);
                } catch (e1) {
                    try {
                        return cachedSetTimeout$1.call(null, fun, 0);
                    } catch (e) {
                        return cachedSetTimeout$1.call(this, fun, 0);
                    }
                }
            }
            function runClearTimeout$1(marker) {
                if (cachedClearTimeout$1 === clearTimeout) {
                    return clearTimeout(marker);
                }
                if ((cachedClearTimeout$1 === defaultClearTimeout$1 || !cachedClearTimeout$1) && clearTimeout) {
                    cachedClearTimeout$1 = clearTimeout;
                    return clearTimeout(marker);
                }
                try {
                    return cachedClearTimeout$1(marker);
                } catch (e1) {
                    try {
                        return cachedClearTimeout$1.call(null, marker);
                    } catch (e) {
                        return cachedClearTimeout$1.call(this, marker);
                    }
                }
            }
            var queue$1 = [];
            var draining$1 = false;
            var currentQueue$1;
            var queueIndex$1 = -1;
            function cleanUpNextTick$1() {
                if (!draining$1 || !currentQueue$1) {
                    return;
                }
                draining$1 = false;
                if (currentQueue$1.length) queue$1 = currentQueue$1.concat(queue$1);
                else queueIndex$1 = -1;
                if (queue$1.length) drainQueue$1();
            }
            function drainQueue$1() {
                if (draining$1) {
                    return;
                }
                var timeout = runTimeout$1(cleanUpNextTick$1);
                draining$1 = true;
                var len = queue$1.length;
                while(len){
                    currentQueue$1 = queue$1;
                    queue$1 = [];
                    while(++queueIndex$1 < len){
                        if (currentQueue$1) currentQueue$1[queueIndex$1].run();
                    }
                    queueIndex$1 = -1;
                    len = queue$1.length;
                }
                currentQueue$1 = null;
                draining$1 = false;
                runClearTimeout$1(timeout);
            }
            function nextTick(fun) {
                var args = Array(arguments.length - 1);
                if (arguments.length > 1) {
                    for(var i = 1; i < arguments.length; i++)args[i - 1] = arguments[i];
                }
                queue$1.push(new Item$1(fun, args));
                if (1 === queue$1.length && !draining$1) runTimeout$1(drainQueue$1);
            }
            function Item$1(fun, array) {
                this.fun = fun;
                this.array = array;
            }
            Item$1.prototype.run = function() {
                this.fun.apply(null, this.array);
            };
            var title = 'browser';
            var platform = 'browser';
            var browser$1 = true;
            var env = {};
            var argv = [];
            var version = '';
            var versions = {};
            var release = {};
            var config = {};
            function noop$1() {}
            var on = noop$1;
            var addListener = noop$1;
            var once$1 = noop$1;
            var off = noop$1;
            var removeListener = noop$1;
            var removeAllListeners = noop$1;
            var emit = noop$1;
            function binding$1(name) {
                throw Error('process.binding is not supported');
            }
            function cwd() {
                return '/';
            }
            function chdir(dir) {
                throw Error('process.chdir is not supported');
            }
            function umask() {
                return 0;
            }
            var performance = global$1.performance || {};
            var performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function() {
                return new Date().getTime();
            };
            function hrtime(previousTimestamp) {
                var clocktime = 1e-3 * performanceNow.call(performance);
                var seconds = Math.floor(clocktime);
                var nanoseconds = Math.floor(clocktime % 1 * 1e9);
                if (previousTimestamp) {
                    seconds -= previousTimestamp[0];
                    nanoseconds -= previousTimestamp[1];
                    if (nanoseconds < 0) {
                        seconds--;
                        nanoseconds += 1e9;
                    }
                }
                return [
                    seconds,
                    nanoseconds
                ];
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
                once: once$1,
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
                config: config,
                uptime: uptime
            };
            var commonjsGlobal = 'undefined' != typeof globalThis ? globalThis : 'undefined' != typeof window ? window : void 0 !== __webpack_require__.g ? __webpack_require__.g : 'undefined' != typeof self ? self : {};
            function getAugmentedNamespace(n) {
                if (n.__esModule) return n;
                var a = Object.defineProperty({}, '__esModule', {
                    value: true
                });
                Object.keys(n).forEach(function(k) {
                    var d = Object.getOwnPropertyDescriptor(n, k);
                    Object.defineProperty(a, k, d.get ? d : {
                        enumerable: true,
                        get: function() {
                            return n[k];
                        }
                    });
                });
                return a;
            }
            var lib = {};
            var buffer = {};
            var base64Js = {};
            base64Js.byteLength = byteLength;
            base64Js.toByteArray = toByteArray;
            base64Js.fromByteArray = fromByteArray;
            var lookup = [];
            var revLookup = [];
            var Arr = 'undefined' != typeof Uint8Array ? Uint8Array : Array;
            var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            for(var i = 0, len = code.length; i < len; ++i){
                lookup[i] = code[i];
                revLookup[code.charCodeAt(i)] = i;
            }
            revLookup['-'.charCodeAt(0)] = 62;
            revLookup['_'.charCodeAt(0)] = 63;
            function getLens(b64) {
                var len = b64.length;
                if (len % 4 > 0) {
                    throw Error('Invalid string. Length must be a multiple of 4');
                }
                var validLen = b64.indexOf('=');
                if (-1 === validLen) validLen = len;
                var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
                return [
                    validLen,
                    placeHoldersLen
                ];
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
                for(i = 0; i < len; i += 4){
                    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
                    arr[curByte++] = tmp >> 16 & 0xFF;
                    arr[curByte++] = tmp >> 8 & 0xFF;
                    arr[curByte++] = 0xFF & tmp;
                }
                if (2 === placeHoldersLen) {
                    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
                    arr[curByte++] = 0xFF & tmp;
                }
                if (1 === placeHoldersLen) {
                    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
                    arr[curByte++] = tmp >> 8 & 0xFF;
                    arr[curByte++] = 0xFF & tmp;
                }
                return arr;
            }
            function tripletToBase64(num) {
                return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[0x3F & num];
            }
            function encodeChunk(uint8, start, end) {
                var tmp;
                var output = [];
                for(var i = start; i < end; i += 3){
                    tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (0xFF & uint8[i + 2]);
                    output.push(tripletToBase64(tmp));
                }
                return output.join('');
            }
            function fromByteArray(uint8) {
                var tmp;
                var len = uint8.length;
                var extraBytes = len % 3;
                var parts = [];
                var maxChunkLength = 16383;
                for(var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength)parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
                if (1 === extraBytes) {
                    tmp = uint8[len - 1];
                    parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
                } else if (2 === extraBytes) {
                    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
                    parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
                }
                return parts.join('');
            }
            var ieee754 = {};
            ieee754.read = function(buffer, offset, isLE, mLen, nBytes) {
                var e, m;
                var eLen = 8 * nBytes - mLen - 1;
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
                for(; nBits > 0; e = 256 * e + buffer[offset + i], i += d, nBits -= 8);
                m = e & (1 << -nBits) - 1;
                e >>= -nBits;
                nBits += mLen;
                for(; nBits > 0; m = 256 * m + buffer[offset + i], i += d, nBits -= 8);
                if (0 === e) e = 1 - eBias;
                else if (e === eMax) {
                    return m ? NaN : (s ? -1 : 1) * (1 / 0);
                } else {
                    m += Math.pow(2, mLen);
                    e -= eBias;
                }
                return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
            };
            ieee754.write = function(buffer, value, offset, isLE, mLen, nBytes) {
                var e, m, c;
                var eLen = 8 * nBytes - mLen - 1;
                var eMax = (1 << eLen) - 1;
                var eBias = eMax >> 1;
                var rt = 23 === mLen ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
                var i = isLE ? 0 : nBytes - 1;
                var d = isLE ? 1 : -1;
                var s = value < 0 || 0 === value && 1 / value < 0 ? 1 : 0;
                value = Math.abs(value);
                if (isNaN(value) || value === 1 / 0) {
                    m = isNaN(value) ? 1 : 0;
                    e = eMax;
                } else {
                    e = Math.floor(Math.log(value) / Math.LN2);
                    if (value * (c = Math.pow(2, -e)) < 1) {
                        e--;
                        c *= 2;
                    }
                    if (e + eBias >= 1) value += rt / c;
                    else value += rt * Math.pow(2, 1 - eBias);
                    if (value * c >= 2) {
                        e++;
                        c /= 2;
                    }
                    if (e + eBias >= eMax) {
                        m = 0;
                        e = eMax;
                    } else if (e + eBias >= 1) {
                        m = (value * c - 1) * Math.pow(2, mLen);
                        e += eBias;
                    } else {
                        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
                        e = 0;
                    }
                }
                for(; mLen >= 8; buffer[offset + i] = 0xff & m, i += d, m /= 256, mLen -= 8);
                e = e << mLen | m;
                eLen += mLen;
                for(; eLen > 0; buffer[offset + i] = 0xff & e, i += d, e /= 256, eLen -= 8);
                buffer[offset + i - d] |= 128 * s;
            };
            (function(exports) {
                var base64 = base64Js;
                var ieee754$1 = ieee754;
                var customInspectSymbol = 'function' == typeof Symbol && 'function' == typeof Symbol['for'] ? Symbol['for']('nodejs.util.inspect.custom') : null;
                exports.Buffer = Buffer;
                exports.SlowBuffer = SlowBuffer;
                exports.INSPECT_MAX_BYTES = 50;
                var K_MAX_LENGTH = 0x7fffffff;
                exports.kMaxLength = K_MAX_LENGTH;
                Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
                if (!Buffer.TYPED_ARRAY_SUPPORT && 'undefined' != typeof console && 'function' == typeof console.error) console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
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
                        return 42 === arr.foo();
                    } catch (e) {
                        return false;
                    }
                }
                Object.defineProperty(Buffer.prototype, 'parent', {
                    enumerable: true,
                    get: function get() {
                        if (!Buffer.isBuffer(this)) return;
                        return this.buffer;
                    }
                });
                Object.defineProperty(Buffer.prototype, 'offset', {
                    enumerable: true,
                    get: function get() {
                        if (!Buffer.isBuffer(this)) return;
                        return this.byteOffset;
                    }
                });
                function createBuffer(length) {
                    if (length > K_MAX_LENGTH) {
                        throw RangeError('The value "' + length + '" is invalid for option "size"');
                    }
                    var buf = new Uint8Array(length);
                    Object.setPrototypeOf(buf, Buffer.prototype);
                    return buf;
                }
                function Buffer(arg, encodingOrOffset, length) {
                    if ('number' == typeof arg) {
                        if ('string' == typeof encodingOrOffset) {
                            throw TypeError('The "string" argument must be of type string. Received type number');
                        }
                        return allocUnsafe(arg);
                    }
                    return from(arg, encodingOrOffset, length);
                }
                Buffer.poolSize = 8192;
                function from(value, encodingOrOffset, length) {
                    if ('string' == typeof value) {
                        return fromString(value, encodingOrOffset);
                    }
                    if (ArrayBuffer.isView(value)) {
                        return fromArrayView(value);
                    }
                    if (null == value) {
                        throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
                    }
                    if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
                        return fromArrayBuffer(value, encodingOrOffset, length);
                    }
                    if ('undefined' != typeof SharedArrayBuffer && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
                        return fromArrayBuffer(value, encodingOrOffset, length);
                    }
                    if ('number' == typeof value) {
                        throw TypeError('The "value" argument must not be of type number. Received type number');
                    }
                    var valueOf = value.valueOf && value.valueOf();
                    if (null != valueOf && valueOf !== value) {
                        return Buffer.from(valueOf, encodingOrOffset, length);
                    }
                    var b = fromObject(value);
                    if (b) return b;
                    if ('undefined' != typeof Symbol && null != Symbol.toPrimitive && 'function' == typeof value[Symbol.toPrimitive]) {
                        return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length);
                    }
                    throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
                }
                Buffer.from = function(value, encodingOrOffset, length) {
                    return from(value, encodingOrOffset, length);
                };
                Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
                Object.setPrototypeOf(Buffer, Uint8Array);
                function assertSize(size) {
                    if ('number' != typeof size) {
                        throw TypeError('"size" argument must be of type number');
                    }
                    if (size < 0) {
                        throw RangeError('The value "' + size + '" is invalid for option "size"');
                    }
                }
                function alloc(size, fill, encoding) {
                    assertSize(size);
                    if (size <= 0) {
                        return createBuffer(size);
                    }
                    if (void 0 !== fill) {
                        return 'string' == typeof encoding ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
                    }
                    return createBuffer(size);
                }
                Buffer.alloc = function(size, fill, encoding) {
                    return alloc(size, fill, encoding);
                };
                function allocUnsafe(size) {
                    assertSize(size);
                    return createBuffer(size < 0 ? 0 : 0 | checked(size));
                }
                Buffer.allocUnsafe = function(size) {
                    return allocUnsafe(size);
                };
                Buffer.allocUnsafeSlow = function(size) {
                    return allocUnsafe(size);
                };
                function fromString(string, encoding) {
                    if ('string' != typeof encoding || '' === encoding) encoding = 'utf8';
                    if (!Buffer.isEncoding(encoding)) {
                        throw TypeError('Unknown encoding: ' + encoding);
                    }
                    var length = 0 | byteLength(string, encoding);
                    var buf = createBuffer(length);
                    var actual = buf.write(string, encoding);
                    if (actual !== length) buf = buf.slice(0, actual);
                    return buf;
                }
                function fromArrayLike(array) {
                    var length = array.length < 0 ? 0 : 0 | checked(array.length);
                    var buf = createBuffer(length);
                    for(var i = 0; i < length; i += 1)buf[i] = 255 & array[i];
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
                        throw RangeError('"offset" is outside of buffer bounds');
                    }
                    if (array.byteLength < byteOffset + (length || 0)) {
                        throw RangeError('"length" is outside of buffer bounds');
                    }
                    var buf;
                    buf = void 0 === byteOffset && void 0 === length ? new Uint8Array(array) : void 0 === length ? new Uint8Array(array, byteOffset) : new Uint8Array(array, byteOffset, length);
                    Object.setPrototypeOf(buf, Buffer.prototype);
                    return buf;
                }
                function fromObject(obj) {
                    if (Buffer.isBuffer(obj)) {
                        var len = 0 | checked(obj.length);
                        var buf = createBuffer(len);
                        if (0 === buf.length) {
                            return buf;
                        }
                        obj.copy(buf, 0, 0, len);
                        return buf;
                    }
                    if (void 0 !== obj.length) {
                        if ('number' != typeof obj.length || numberIsNaN(obj.length)) {
                            return createBuffer(0);
                        }
                        return fromArrayLike(obj);
                    }
                    if ('Buffer' === obj.type && Array.isArray(obj.data)) {
                        return fromArrayLike(obj.data);
                    }
                }
                function checked(length) {
                    if (length >= K_MAX_LENGTH) {
                        throw RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + ' bytes');
                    }
                    return 0 | length;
                }
                function SlowBuffer(length) {
                    if (+length != length) length = 0;
                    return Buffer.alloc(+length);
                }
                Buffer.isBuffer = function isBuffer(b) {
                    return null != b && true === b._isBuffer && b !== Buffer.prototype;
                };
                Buffer.compare = function compare(a, b) {
                    if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
                    if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);
                    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
                        throw TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                    }
                    if (a === b) return 0;
                    var x = a.length;
                    var y = b.length;
                    for(var i = 0, len = Math.min(x, y); i < len; ++i)if (a[i] !== b[i]) {
                        x = a[i];
                        y = b[i];
                        break;
                    }
                    if (x < y) return -1;
                    if (y < x) return 1;
                    return 0;
                };
                Buffer.isEncoding = function isEncoding(encoding) {
                    switch(String(encoding).toLowerCase()){
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
                        throw TypeError('"list" argument must be an Array of Buffers');
                    }
                    if (0 === list.length) {
                        return Buffer.alloc(0);
                    }
                    var i;
                    if (void 0 === length) {
                        length = 0;
                        for(i = 0; i < list.length; ++i)length += list[i].length;
                    }
                    var buffer = Buffer.allocUnsafe(length);
                    var pos = 0;
                    for(i = 0; i < list.length; ++i){
                        var buf = list[i];
                        if (isInstance(buf, Uint8Array)) if (pos + buf.length > buffer.length) Buffer.from(buf).copy(buffer, pos);
                        else Uint8Array.prototype.set.call(buffer, buf, pos);
                        else if (Buffer.isBuffer(buf)) buf.copy(buffer, pos);
                        else {
                            throw TypeError('"list" argument must be an Array of Buffers');
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
                    if ('string' != typeof string) {
                        throw TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string);
                    }
                    var len = string.length;
                    var mustMatch = arguments.length > 2 && true === arguments[2];
                    if (!mustMatch && 0 === len) return 0;
                    var loweredCase = false;
                    for(;;){
                        switch(encoding){
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
                                return 2 * len;
                            case 'hex':
                                return len >>> 1;
                            case 'base64':
                                return base64ToBytes(string).length;
                            default:
                                if (loweredCase) {
                                    return mustMatch ? -1 : utf8ToBytes(string).length;
                                }
                                encoding = ('' + encoding).toLowerCase();
                                loweredCase = true;
                        }
                    }
                }
                Buffer.byteLength = byteLength;
                function slowToString(encoding, start, end) {
                    var loweredCase = false;
                    if (void 0 === start || start < 0) start = 0;
                    if (start > this.length) {
                        return '';
                    }
                    if (void 0 === end || end > this.length) end = this.length;
                    if (end <= 0) {
                        return '';
                    }
                    end >>>= 0;
                    start >>>= 0;
                    if (end <= start) {
                        return '';
                    }
                    if (!encoding) encoding = 'utf8';
                    while(true){
                        switch(encoding){
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
                                if (loweredCase) throw TypeError('Unknown encoding: ' + encoding);
                                encoding = (encoding + '').toLowerCase();
                                loweredCase = true;
                        }
                    }
                }
                Buffer.prototype._isBuffer = true;
                function swap(b, n, m) {
                    var i = b[n];
                    b[n] = b[m];
                    b[m] = i;
                }
                Buffer.prototype.swap16 = function swap16() {
                    var len = this.length;
                    if (len % 2 !== 0) {
                        throw RangeError('Buffer size must be a multiple of 16-bits');
                    }
                    for(var i = 0; i < len; i += 2)swap(this, i, i + 1);
                    return this;
                };
                Buffer.prototype.swap32 = function swap32() {
                    var len = this.length;
                    if (len % 4 !== 0) {
                        throw RangeError('Buffer size must be a multiple of 32-bits');
                    }
                    for(var i = 0; i < len; i += 4){
                        swap(this, i, i + 3);
                        swap(this, i + 1, i + 2);
                    }
                    return this;
                };
                Buffer.prototype.swap64 = function swap64() {
                    var len = this.length;
                    if (len % 8 !== 0) {
                        throw RangeError('Buffer size must be a multiple of 64-bits');
                    }
                    for(var i = 0; i < len; i += 8){
                        swap(this, i, i + 7);
                        swap(this, i + 1, i + 6);
                        swap(this, i + 2, i + 5);
                        swap(this, i + 3, i + 4);
                    }
                    return this;
                };
                Buffer.prototype.toString = function toString() {
                    var length = this.length;
                    if (0 === length) return '';
                    if (0 === arguments.length) return utf8Slice(this, 0, length);
                    return slowToString.apply(this, arguments);
                };
                Buffer.prototype.toLocaleString = Buffer.prototype.toString;
                Buffer.prototype.equals = function equals(b) {
                    if (!Buffer.isBuffer(b)) throw TypeError('Argument must be a Buffer');
                    if (this === b) return true;
                    return 0 === Buffer.compare(this, b);
                };
                Buffer.prototype.inspect = function inspect() {
                    var str = '';
                    var max = exports.INSPECT_MAX_BYTES;
                    str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim();
                    if (this.length > max) str += ' ... ';
                    return '<Buffer ' + str + '>';
                };
                if (customInspectSymbol) Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
                Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
                    if (isInstance(target, Uint8Array)) target = Buffer.from(target, target.offset, target.byteLength);
                    if (!Buffer.isBuffer(target)) {
                        throw TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target);
                    }
                    if (void 0 === start) start = 0;
                    if (void 0 === end) end = target ? target.length : 0;
                    if (void 0 === thisStart) thisStart = 0;
                    if (void 0 === thisEnd) thisEnd = this.length;
                    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
                        throw RangeError('out of range index');
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
                    for(var i = 0; i < len; ++i)if (thisCopy[i] !== targetCopy[i]) {
                        x = thisCopy[i];
                        y = targetCopy[i];
                        break;
                    }
                    if (x < y) return -1;
                    if (y < x) return 1;
                    return 0;
                };
                function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
                    if (0 === buffer.length) return -1;
                    if ('string' == typeof byteOffset) {
                        encoding = byteOffset;
                        byteOffset = 0;
                    } else if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff;
                    else if (byteOffset < -2147483648) byteOffset = -2147483648;
                    byteOffset = +byteOffset;
                    if (numberIsNaN(byteOffset)) byteOffset = dir ? 0 : buffer.length - 1;
                    if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
                    if (byteOffset >= buffer.length) {
                        if (dir) return -1;
                        byteOffset = buffer.length - 1;
                    } else if (byteOffset < 0) {
                        if (!dir) return -1;
                        byteOffset = 0;
                    }
                    if ('string' == typeof val) val = Buffer.from(val, encoding);
                    if (Buffer.isBuffer(val)) {
                        if (0 === val.length) {
                            return -1;
                        }
                        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
                    }
                    if ('number' == typeof val) {
                        val &= 0xFF;
                        if ('function' == typeof Uint8Array.prototype.indexOf) {
                            if (dir) {
                                return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
                            }
                            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
                        }
                        return arrayIndexOf(buffer, [
                            val
                        ], byteOffset, encoding, dir);
                    }
                    throw TypeError('val must be string, number or Buffer');
                }
                function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
                    var indexSize = 1;
                    var arrLength = arr.length;
                    var valLength = val.length;
                    if (void 0 !== encoding) {
                        encoding = String(encoding).toLowerCase();
                        if ('ucs2' === encoding || 'ucs-2' === encoding || 'utf16le' === encoding || 'utf-16le' === encoding) {
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
                        if (1 === indexSize) {
                            return buf[i];
                        }
                        return buf.readUInt16BE(i * indexSize);
                    }
                    var i;
                    if (dir) {
                        var foundIndex = -1;
                        for(i = byteOffset; i < arrLength; i++)if (read(arr, i) === read(val, -1 === foundIndex ? 0 : i - foundIndex)) {
                            if (-1 === foundIndex) foundIndex = i;
                            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
                        } else {
                            if (-1 !== foundIndex) i -= i - foundIndex;
                            foundIndex = -1;
                        }
                    } else {
                        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
                        for(i = byteOffset; i >= 0; i--){
                            var found = true;
                            for(var j = 0; j < valLength; j++)if (read(arr, i + j) !== read(val, j)) {
                                found = false;
                                break;
                            }
                            if (found) return i;
                        }
                    }
                    return -1;
                }
                Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
                    return -1 !== this.indexOf(val, byteOffset, encoding);
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
                    if (length) {
                        length = Number(length);
                        if (length > remaining) length = remaining;
                    } else {
                        length = remaining;
                    }
                    var strLen = string.length;
                    if (length > strLen / 2) length = strLen / 2;
                    for(var i = 0; i < length; ++i){
                        var parsed = parseInt(string.substr(2 * i, 2), 16);
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
                    if (void 0 === offset) {
                        encoding = 'utf8';
                        length = this.length;
                        offset = 0;
                    } else if (void 0 === length && 'string' == typeof offset) {
                        encoding = offset;
                        length = this.length;
                        offset = 0;
                    } else if (isFinite(offset)) {
                        offset >>>= 0;
                        if (isFinite(length)) {
                            length >>>= 0;
                            if (void 0 === encoding) encoding = 'utf8';
                        } else {
                            encoding = length;
                            length = void 0;
                        }
                    } else {
                        throw Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
                    }
                    var remaining = this.length - offset;
                    if (void 0 === length || length > remaining) length = remaining;
                    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
                        throw RangeError('Attempt to write outside buffer bounds');
                    }
                    if (!encoding) encoding = 'utf8';
                    var loweredCase = false;
                    for(;;){
                        switch(encoding){
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
                                return base64Write(this, string, offset, length);
                            case 'ucs2':
                            case 'ucs-2':
                            case 'utf16le':
                            case 'utf-16le':
                                return ucs2Write(this, string, offset, length);
                            default:
                                if (loweredCase) throw TypeError('Unknown encoding: ' + encoding);
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
                    if (0 === start && end === buf.length) {
                        return base64.fromByteArray(buf);
                    }
                    return base64.fromByteArray(buf.slice(start, end));
                }
                function utf8Slice(buf, start, end) {
                    end = Math.min(buf.length, end);
                    var res = [];
                    var i = start;
                    while(i < end){
                        var firstByte = buf[i];
                        var codePoint = null;
                        var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;
                        if (i + bytesPerSequence <= end) {
                            var secondByte, thirdByte, fourthByte, tempCodePoint;
                            switch(bytesPerSequence){
                                case 1:
                                    if (firstByte < 0x80) codePoint = firstByte;
                                    break;
                                case 2:
                                    secondByte = buf[i + 1];
                                    if ((0xC0 & secondByte) === 0x80) {
                                        tempCodePoint = (0x1F & firstByte) << 0x6 | 0x3F & secondByte;
                                        if (tempCodePoint > 0x7F) codePoint = tempCodePoint;
                                    }
                                    break;
                                case 3:
                                    secondByte = buf[i + 1];
                                    thirdByte = buf[i + 2];
                                    if ((0xC0 & secondByte) === 0x80 && (0xC0 & thirdByte) === 0x80) {
                                        tempCodePoint = (0xF & firstByte) << 0xC | (0x3F & secondByte) << 0x6 | 0x3F & thirdByte;
                                        if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) codePoint = tempCodePoint;
                                    }
                                    break;
                                case 4:
                                    secondByte = buf[i + 1];
                                    thirdByte = buf[i + 2];
                                    fourthByte = buf[i + 3];
                                    if ((0xC0 & secondByte) === 0x80 && (0xC0 & thirdByte) === 0x80 && (0xC0 & fourthByte) === 0x80) {
                                        tempCodePoint = (0xF & firstByte) << 0x12 | (0x3F & secondByte) << 0xC | (0x3F & thirdByte) << 0x6 | 0x3F & fourthByte;
                                        if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) codePoint = tempCodePoint;
                                    }
                            }
                        }
                        if (null === codePoint) {
                            codePoint = 0xFFFD;
                            bytesPerSequence = 1;
                        } else if (codePoint > 0xFFFF) {
                            codePoint -= 0x10000;
                            res.push(codePoint >>> 10 & 0x3FF | 0xD800);
                            codePoint = 0xDC00 | 0x3FF & codePoint;
                        }
                        res.push(codePoint);
                        i += bytesPerSequence;
                    }
                    return decodeCodePointsArray(res);
                }
                var MAX_ARGUMENTS_LENGTH = 0x1000;
                function decodeCodePointsArray(codePoints) {
                    var len = codePoints.length;
                    if (len <= MAX_ARGUMENTS_LENGTH) {
                        return String.fromCharCode.apply(String, codePoints);
                    }
                    var res = '';
                    var i = 0;
                    while(i < len){
                        res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
                    }
                    return res;
                }
                function asciiSlice(buf, start, end) {
                    var ret = '';
                    end = Math.min(buf.length, end);
                    for(var i = start; i < end; ++i)ret += String.fromCharCode(0x7F & buf[i]);
                    return ret;
                }
                function latin1Slice(buf, start, end) {
                    var ret = '';
                    end = Math.min(buf.length, end);
                    for(var i = start; i < end; ++i)ret += String.fromCharCode(buf[i]);
                    return ret;
                }
                function hexSlice(buf, start, end) {
                    var len = buf.length;
                    if (!start || start < 0) start = 0;
                    if (!end || end < 0 || end > len) end = len;
                    var out = '';
                    for(var i = start; i < end; ++i)out += hexSliceLookupTable[buf[i]];
                    return out;
                }
                function utf16leSlice(buf, start, end) {
                    var bytes = buf.slice(start, end);
                    var res = '';
                    for(var i = 0; i < bytes.length - 1; i += 2)res += String.fromCharCode(bytes[i] + 256 * bytes[i + 1]);
                    return res;
                }
                Buffer.prototype.slice = function slice(start, end) {
                    var len = this.length;
                    start = ~~start;
                    end = void 0 === end ? len : ~~end;
                    if (start < 0) {
                        start += len;
                        if (start < 0) start = 0;
                    } else if (start > len) start = len;
                    if (end < 0) {
                        end += len;
                        if (end < 0) end = 0;
                    } else if (end > len) end = len;
                    if (end < start) end = start;
                    var newBuf = this.subarray(start, end);
                    Object.setPrototypeOf(newBuf, Buffer.prototype);
                    return newBuf;
                };
                function checkOffset(offset, ext, length) {
                    if (offset % 1 !== 0 || offset < 0) throw RangeError('offset is not uint');
                    if (offset + ext > length) throw RangeError('Trying to access beyond buffer length');
                }
                Buffer.prototype.readUintLE = Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
                    offset >>>= 0;
                    byteLength >>>= 0;
                    if (!noAssert) checkOffset(offset, byteLength, this.length);
                    var val = this[offset];
                    var mul = 1;
                    var i = 0;
                    while(++i < byteLength && (mul *= 0x100)){
                        val += this[offset + i] * mul;
                    }
                    return val;
                };
                Buffer.prototype.readUintBE = Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
                    offset >>>= 0;
                    byteLength >>>= 0;
                    if (!noAssert) checkOffset(offset, byteLength, this.length);
                    var val = this[offset + --byteLength];
                    var mul = 1;
                    while(byteLength > 0 && (mul *= 0x100)){
                        val += this[offset + --byteLength] * mul;
                    }
                    return val;
                };
                Buffer.prototype.readUint8 = Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
                    offset >>>= 0;
                    if (!noAssert) checkOffset(offset, 1, this.length);
                    return this[offset];
                };
                Buffer.prototype.readUint16LE = Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
                    offset >>>= 0;
                    if (!noAssert) checkOffset(offset, 2, this.length);
                    return this[offset] | this[offset + 1] << 8;
                };
                Buffer.prototype.readUint16BE = Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
                    offset >>>= 0;
                    if (!noAssert) checkOffset(offset, 2, this.length);
                    return this[offset] << 8 | this[offset + 1];
                };
                Buffer.prototype.readUint32LE = Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
                    offset >>>= 0;
                    if (!noAssert) checkOffset(offset, 4, this.length);
                    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + 0x1000000 * this[offset + 3];
                };
                Buffer.prototype.readUint32BE = Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
                    offset >>>= 0;
                    if (!noAssert) checkOffset(offset, 4, this.length);
                    return 0x1000000 * this[offset] + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
                };
                Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
                    offset >>>= 0;
                    byteLength >>>= 0;
                    if (!noAssert) checkOffset(offset, byteLength, this.length);
                    var val = this[offset];
                    var mul = 1;
                    var i = 0;
                    while(++i < byteLength && (mul *= 0x100)){
                        val += this[offset + i] * mul;
                    }
                    mul *= 0x80;
                    if (val >= mul) val -= Math.pow(2, 8 * byteLength);
                    return val;
                };
                Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
                    offset >>>= 0;
                    byteLength >>>= 0;
                    if (!noAssert) checkOffset(offset, byteLength, this.length);
                    var i = byteLength;
                    var mul = 1;
                    var val = this[offset + --i];
                    while(i > 0 && (mul *= 0x100)){
                        val += this[offset + --i] * mul;
                    }
                    mul *= 0x80;
                    if (val >= mul) val -= Math.pow(2, 8 * byteLength);
                    return val;
                };
                Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
                    offset >>>= 0;
                    if (!noAssert) checkOffset(offset, 1, this.length);
                    if (!(0x80 & this[offset])) return this[offset];
                    return (0xff - this[offset] + 1) * -1;
                };
                Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
                    offset >>>= 0;
                    if (!noAssert) checkOffset(offset, 2, this.length);
                    var val = this[offset] | this[offset + 1] << 8;
                    return 0x8000 & val ? 0xFFFF0000 | val : val;
                };
                Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
                    offset >>>= 0;
                    if (!noAssert) checkOffset(offset, 2, this.length);
                    var val = this[offset + 1] | this[offset] << 8;
                    return 0x8000 & val ? 0xFFFF0000 | val : val;
                };
                Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
                    offset >>>= 0;
                    if (!noAssert) checkOffset(offset, 4, this.length);
                    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
                };
                Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
                    offset >>>= 0;
                    if (!noAssert) checkOffset(offset, 4, this.length);
                    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
                };
                Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
                    offset >>>= 0;
                    if (!noAssert) checkOffset(offset, 4, this.length);
                    return ieee754$1.read(this, offset, true, 23, 4);
                };
                Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
                    offset >>>= 0;
                    if (!noAssert) checkOffset(offset, 4, this.length);
                    return ieee754$1.read(this, offset, false, 23, 4);
                };
                Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
                    offset >>>= 0;
                    if (!noAssert) checkOffset(offset, 8, this.length);
                    return ieee754$1.read(this, offset, true, 52, 8);
                };
                Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
                    offset >>>= 0;
                    if (!noAssert) checkOffset(offset, 8, this.length);
                    return ieee754$1.read(this, offset, false, 52, 8);
                };
                function checkInt(buf, value, offset, ext, max, min) {
                    if (!Buffer.isBuffer(buf)) throw TypeError('"buffer" argument must be a Buffer instance');
                    if (value > max || value < min) throw RangeError('"value" argument is out of bounds');
                    if (offset + ext > buf.length) throw RangeError('Index out of range');
                }
                Buffer.prototype.writeUintLE = Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
                    value = +value;
                    offset >>>= 0;
                    byteLength >>>= 0;
                    if (!noAssert) {
                        var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                        checkInt(this, value, offset, byteLength, maxBytes, 0);
                    }
                    var mul = 1;
                    var i = 0;
                    this[offset] = 0xFF & value;
                    while(++i < byteLength && (mul *= 0x100)){
                        this[offset + i] = value / mul & 0xFF;
                    }
                    return offset + byteLength;
                };
                Buffer.prototype.writeUintBE = Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
                    value = +value;
                    offset >>>= 0;
                    byteLength >>>= 0;
                    if (!noAssert) {
                        var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                        checkInt(this, value, offset, byteLength, maxBytes, 0);
                    }
                    var i = byteLength - 1;
                    var mul = 1;
                    this[offset + i] = 0xFF & value;
                    while(--i >= 0 && (mul *= 0x100)){
                        this[offset + i] = value / mul & 0xFF;
                    }
                    return offset + byteLength;
                };
                Buffer.prototype.writeUint8 = Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
                    value = +value;
                    offset >>>= 0;
                    if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
                    this[offset] = 0xff & value;
                    return offset + 1;
                };
                Buffer.prototype.writeUint16LE = Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
                    value = +value;
                    offset >>>= 0;
                    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
                    this[offset] = 0xff & value;
                    this[offset + 1] = value >>> 8;
                    return offset + 2;
                };
                Buffer.prototype.writeUint16BE = Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
                    value = +value;
                    offset >>>= 0;
                    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
                    this[offset] = value >>> 8;
                    this[offset + 1] = 0xff & value;
                    return offset + 2;
                };
                Buffer.prototype.writeUint32LE = Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
                    value = +value;
                    offset >>>= 0;
                    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
                    this[offset + 3] = value >>> 24;
                    this[offset + 2] = value >>> 16;
                    this[offset + 1] = value >>> 8;
                    this[offset] = 0xff & value;
                    return offset + 4;
                };
                Buffer.prototype.writeUint32BE = Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
                    value = +value;
                    offset >>>= 0;
                    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
                    this[offset] = value >>> 24;
                    this[offset + 1] = value >>> 16;
                    this[offset + 2] = value >>> 8;
                    this[offset + 3] = 0xff & value;
                    return offset + 4;
                };
                Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
                    value = +value;
                    offset >>>= 0;
                    if (!noAssert) {
                        var limit = Math.pow(2, 8 * byteLength - 1);
                        checkInt(this, value, offset, byteLength, limit - 1, -limit);
                    }
                    var i = 0;
                    var mul = 1;
                    var sub = 0;
                    this[offset] = 0xFF & value;
                    while(++i < byteLength && (mul *= 0x100)){
                        if (value < 0 && 0 === sub && 0 !== this[offset + i - 1]) sub = 1;
                        this[offset + i] = (value / mul >> 0) - sub & 0xFF;
                    }
                    return offset + byteLength;
                };
                Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
                    value = +value;
                    offset >>>= 0;
                    if (!noAssert) {
                        var limit = Math.pow(2, 8 * byteLength - 1);
                        checkInt(this, value, offset, byteLength, limit - 1, -limit);
                    }
                    var i = byteLength - 1;
                    var mul = 1;
                    var sub = 0;
                    this[offset + i] = 0xFF & value;
                    while(--i >= 0 && (mul *= 0x100)){
                        if (value < 0 && 0 === sub && 0 !== this[offset + i + 1]) sub = 1;
                        this[offset + i] = (value / mul >> 0) - sub & 0xFF;
                    }
                    return offset + byteLength;
                };
                Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
                    value = +value;
                    offset >>>= 0;
                    if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -128);
                    if (value < 0) value = 0xff + value + 1;
                    this[offset] = 0xff & value;
                    return offset + 1;
                };
                Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
                    value = +value;
                    offset >>>= 0;
                    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -32768);
                    this[offset] = 0xff & value;
                    this[offset + 1] = value >>> 8;
                    return offset + 2;
                };
                Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
                    value = +value;
                    offset >>>= 0;
                    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -32768);
                    this[offset] = value >>> 8;
                    this[offset + 1] = 0xff & value;
                    return offset + 2;
                };
                Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
                    value = +value;
                    offset >>>= 0;
                    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -2147483648);
                    this[offset] = 0xff & value;
                    this[offset + 1] = value >>> 8;
                    this[offset + 2] = value >>> 16;
                    this[offset + 3] = value >>> 24;
                    return offset + 4;
                };
                Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
                    value = +value;
                    offset >>>= 0;
                    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -2147483648);
                    if (value < 0) value = 0xffffffff + value + 1;
                    this[offset] = value >>> 24;
                    this[offset + 1] = value >>> 16;
                    this[offset + 2] = value >>> 8;
                    this[offset + 3] = 0xff & value;
                    return offset + 4;
                };
                function checkIEEE754(buf, value, offset, ext, max, min) {
                    if (offset + ext > buf.length) throw RangeError('Index out of range');
                    if (offset < 0) throw RangeError('Index out of range');
                }
                function writeFloat(buf, value, offset, littleEndian, noAssert) {
                    value = +value;
                    offset >>>= 0;
                    if (!noAssert) checkIEEE754(buf, value, offset, 4);
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
                    offset >>>= 0;
                    if (!noAssert) checkIEEE754(buf, value, offset, 8);
                    ieee754$1.write(buf, value, offset, littleEndian, 52, 8);
                    return offset + 8;
                }
                Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
                    return writeDouble(this, value, offset, true, noAssert);
                };
                Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
                    return writeDouble(this, value, offset, false, noAssert);
                };
                Buffer.prototype.copy = function copy(target, targetStart, start, end) {
                    if (!Buffer.isBuffer(target)) throw TypeError('argument should be a Buffer');
                    if (!start) start = 0;
                    if (!end && 0 !== end) end = this.length;
                    if (targetStart >= target.length) targetStart = target.length;
                    if (!targetStart) targetStart = 0;
                    if (end > 0 && end < start) end = start;
                    if (end === start) return 0;
                    if (0 === target.length || 0 === this.length) return 0;
                    if (targetStart < 0) {
                        throw RangeError('targetStart out of bounds');
                    }
                    if (start < 0 || start >= this.length) throw RangeError('Index out of range');
                    if (end < 0) throw RangeError('sourceEnd out of bounds');
                    if (end > this.length) end = this.length;
                    if (target.length - targetStart < end - start) end = target.length - targetStart + start;
                    var len = end - start;
                    if (this === target && 'function' == typeof Uint8Array.prototype.copyWithin) this.copyWithin(targetStart, start, end);
                    else Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
                    return len;
                };
                Buffer.prototype.fill = function fill(val, start, end, encoding) {
                    if ('string' == typeof val) {
                        if ('string' == typeof start) {
                            encoding = start;
                            start = 0;
                            end = this.length;
                        } else if ('string' == typeof end) {
                            encoding = end;
                            end = this.length;
                        }
                        if (void 0 !== encoding && 'string' != typeof encoding) {
                            throw TypeError('encoding must be a string');
                        }
                        if ('string' == typeof encoding && !Buffer.isEncoding(encoding)) {
                            throw TypeError('Unknown encoding: ' + encoding);
                        }
                        if (1 === val.length) {
                            var code = val.charCodeAt(0);
                            if ('utf8' === encoding && code < 128 || 'latin1' === encoding) val = code;
                        }
                    } else if ('number' == typeof val) val &= 255;
                    else if ('boolean' == typeof val) val = Number(val);
                    if (start < 0 || this.length < start || this.length < end) {
                        throw RangeError('Out of range index');
                    }
                    if (end <= start) {
                        return this;
                    }
                    start >>>= 0;
                    end = void 0 === end ? this.length : end >>> 0;
                    if (!val) val = 0;
                    var i;
                    if ('number' == typeof val) {
                        for(i = start; i < end; ++i)this[i] = val;
                    } else {
                        var bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, encoding);
                        var len = bytes.length;
                        if (0 === len) {
                            throw TypeError('The value "' + val + '" is invalid for argument "value"');
                        }
                        for(i = 0; i < end - start; ++i)this[i + start] = bytes[i % len];
                    }
                    return this;
                };
                var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
                function base64clean(str) {
                    str = str.split('=')[0];
                    str = str.trim().replace(INVALID_BASE64_RE, '');
                    if (str.length < 2) return '';
                    while(str.length % 4 !== 0){
                        str += '=';
                    }
                    return str;
                }
                function utf8ToBytes(string, units) {
                    units = units || 1 / 0;
                    var codePoint;
                    var length = string.length;
                    var leadSurrogate = null;
                    var bytes = [];
                    for(var i = 0; i < length; ++i){
                        codePoint = string.charCodeAt(i);
                        if (codePoint > 0xD7FF && codePoint < 0xE000) {
                            if (!leadSurrogate) {
                                if (codePoint > 0xDBFF) {
                                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                                    continue;
                                }
                                if (i + 1 === length) {
                                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                                    continue;
                                }
                                leadSurrogate = codePoint;
                                continue;
                            }
                            if (codePoint < 0xDC00) {
                                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                                leadSurrogate = codePoint;
                                continue;
                            }
                            codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
                        } else if (leadSurrogate) {
                            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                        }
                        leadSurrogate = null;
                        if (codePoint < 0x80) {
                            if ((units -= 1) < 0) break;
                            bytes.push(codePoint);
                        } else if (codePoint < 0x800) {
                            if ((units -= 2) < 0) break;
                            bytes.push(codePoint >> 0x6 | 0xC0, 0x3F & codePoint | 0x80);
                        } else if (codePoint < 0x10000) {
                            if ((units -= 3) < 0) break;
                            bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, 0x3F & codePoint | 0x80);
                        } else if (codePoint < 0x110000) {
                            if ((units -= 4) < 0) break;
                            bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, 0x3F & codePoint | 0x80);
                        } else {
                            throw Error('Invalid code point');
                        }
                    }
                    return bytes;
                }
                function asciiToBytes(str) {
                    var byteArray = [];
                    for(var i = 0; i < str.length; ++i)byteArray.push(0xFF & str.charCodeAt(i));
                    return byteArray;
                }
                function utf16leToBytes(str, units) {
                    var c, hi, lo;
                    var byteArray = [];
                    for(var i = 0; i < str.length; ++i){
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
                    for(var i = 0; i < length; ++i){
                        if (i + offset >= dst.length || i >= src.length) break;
                        dst[i + offset] = src[i];
                    }
                    return i;
                }
                function isInstance(obj, type) {
                    return obj instanceof type || null != obj && null != obj.constructor && null != obj.constructor.name && obj.constructor.name === type.name;
                }
                function numberIsNaN(obj) {
                    return obj !== obj;
                }
                var hexSliceLookupTable = function() {
                    var alphabet = '0123456789abcdef';
                    var table = Array(256);
                    for(var i = 0; i < 16; ++i){
                        var i16 = 16 * i;
                        for(var j = 0; j < 16; ++j)table[i16 + j] = alphabet[i] + alphabet[j];
                    }
                    return table;
                }();
            })(buffer);
            var events = {
                exports: {}
            };
            var R = 'object' == typeof Reflect ? Reflect : null;
            var ReflectApply = R && 'function' == typeof R.apply ? R.apply : function ReflectApply(target, receiver, args) {
                return Function.prototype.apply.call(target, receiver, args);
            };
            var ReflectOwnKeys;
            ReflectOwnKeys = R && 'function' == typeof R.ownKeys ? R.ownKeys : Object.getOwnPropertySymbols ? function ReflectOwnKeys(target) {
                return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
            } : function ReflectOwnKeys(target) {
                return Object.getOwnPropertyNames(target);
            };
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
            events.exports.once = once;
            EventEmitter.EventEmitter = EventEmitter;
            EventEmitter.prototype._events = void 0;
            EventEmitter.prototype._eventsCount = 0;
            EventEmitter.prototype._maxListeners = void 0;
            var defaultMaxListeners = 10;
            function checkListener(listener) {
                if ('function' != typeof listener) {
                    throw TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
                }
            }
            Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
                enumerable: true,
                get: function get() {
                    return defaultMaxListeners;
                },
                set: function set(arg) {
                    if ('number' != typeof arg || arg < 0 || NumberIsNaN(arg)) {
                        throw RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
                    }
                    defaultMaxListeners = arg;
                }
            });
            EventEmitter.init = function() {
                if (void 0 === this._events || this._events === Object.getPrototypeOf(this)._events) {
                    this._events = Object.create(null);
                    this._eventsCount = 0;
                }
                this._maxListeners = this._maxListeners || void 0;
            };
            EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
                if ('number' != typeof n || n < 0 || NumberIsNaN(n)) {
                    throw RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
                }
                this._maxListeners = n;
                return this;
            };
            function _getMaxListeners(that) {
                if (void 0 === that._maxListeners) return EventEmitter.defaultMaxListeners;
                return that._maxListeners;
            }
            EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
                return _getMaxListeners(this);
            };
            EventEmitter.prototype.emit = function emit(type) {
                var args = [];
                for(var i = 1; i < arguments.length; i++)args.push(arguments[i]);
                var doError = 'error' === type;
                var events = this._events;
                if (void 0 !== events) doError = doError && void 0 === events.error;
                else if (!doError) return false;
                if (doError) {
                    var er;
                    if (args.length > 0) er = args[0];
                    if (er instanceof Error) {
                        throw er;
                    }
                    var err = Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
                    err.context = er;
                    throw err;
                }
                var handler = events[type];
                if (void 0 === handler) return false;
                if ('function' == typeof handler) ReflectApply(handler, this, args);
                else {
                    var len = handler.length;
                    var listeners = arrayClone(handler, len);
                    for(var i = 0; i < len; ++i)ReflectApply(listeners[i], this, args);
                }
                return true;
            };
            function _addListener(target, type, listener, prepend) {
                var m;
                var events;
                var existing;
                checkListener(listener);
                events = target._events;
                if (void 0 === events) {
                    events = target._events = Object.create(null);
                    target._eventsCount = 0;
                } else {
                    if (void 0 !== events.newListener) {
                        target.emit('newListener', type, listener.listener ? listener.listener : listener);
                        events = target._events;
                    }
                    existing = events[type];
                }
                if (void 0 === existing) {
                    existing = events[type] = listener;
                    ++target._eventsCount;
                } else {
                    if ('function' == typeof existing) existing = events[type] = prepend ? [
                        listener,
                        existing
                    ] : [
                        existing,
                        listener
                    ];
                    else if (prepend) existing.unshift(listener);
                    else existing.push(listener);
                    m = _getMaxListeners(target);
                    if (m > 0 && existing.length > m && !existing.warned) {
                        existing.warned = true;
                        var w = Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
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
                    if (0 === arguments.length) return this.listener.call(this.target);
                    return this.listener.apply(this.target, arguments);
                }
            }
            function _onceWrap(target, type, listener) {
                var state = {
                    fired: false,
                    wrapFn: void 0,
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
            };
            EventEmitter.prototype.removeListener = function removeListener(type, listener) {
                var list, events, position, i, originalListener;
                checkListener(listener);
                events = this._events;
                if (void 0 === events) return this;
                list = events[type];
                if (void 0 === list) return this;
                if (list === listener || list.listener === listener) if (0 === --this._eventsCount) this._events = Object.create(null);
                else {
                    delete events[type];
                    if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
                }
                else if ('function' != typeof list) {
                    position = -1;
                    for(i = list.length - 1; i >= 0; i--)if (list[i] === listener || list[i].listener === listener) {
                        originalListener = list[i].listener;
                        position = i;
                        break;
                    }
                    if (position < 0) return this;
                    if (0 === position) list.shift();
                    else spliceOne(list, position);
                    if (1 === list.length) events[type] = list[0];
                    if (void 0 !== events.removeListener) this.emit('removeListener', type, originalListener || listener);
                }
                return this;
            };
            EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
            EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
                var listeners, events, i;
                events = this._events;
                if (void 0 === events) return this;
                if (void 0 === events.removeListener) {
                    if (0 === arguments.length) {
                        this._events = Object.create(null);
                        this._eventsCount = 0;
                    } else if (void 0 !== events[type]) if (0 === --this._eventsCount) this._events = Object.create(null);
                    else delete events[type];
                    return this;
                }
                if (0 === arguments.length) {
                    var keys = Object.keys(events);
                    var key;
                    for(i = 0; i < keys.length; ++i){
                        key = keys[i];
                        if ('removeListener' !== key) this.removeAllListeners(key);
                    }
                    this.removeAllListeners('removeListener');
                    this._events = Object.create(null);
                    this._eventsCount = 0;
                    return this;
                }
                listeners = events[type];
                if ('function' == typeof listeners) this.removeListener(type, listeners);
                else if (void 0 !== listeners) {
                    for(i = listeners.length - 1; i >= 0; i--)this.removeListener(type, listeners[i]);
                }
                return this;
            };
            function _listeners(target, type, unwrap) {
                var events = target._events;
                if (void 0 === events) return [];
                var evlistener = events[type];
                if (void 0 === evlistener) return [];
                if ('function' == typeof evlistener) return unwrap ? [
                    evlistener.listener || evlistener
                ] : [
                    evlistener
                ];
                return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
            }
            EventEmitter.prototype.listeners = function listeners(type) {
                return _listeners(this, type, true);
            };
            EventEmitter.prototype.rawListeners = function rawListeners(type) {
                return _listeners(this, type, false);
            };
            EventEmitter.listenerCount = function(emitter, type) {
                if ('function' == typeof emitter.listenerCount) {
                    return emitter.listenerCount(type);
                }
                return listenerCount$1.call(emitter, type);
            };
            EventEmitter.prototype.listenerCount = listenerCount$1;
            function listenerCount$1(type) {
                var events = this._events;
                if (void 0 !== events) {
                    var evlistener = events[type];
                    if ('function' == typeof evlistener) {
                        return 1;
                    }
                    if (void 0 !== evlistener) {
                        return evlistener.length;
                    }
                }
                return 0;
            }
            EventEmitter.prototype.eventNames = function eventNames() {
                return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
            };
            function arrayClone(arr, n) {
                var copy = Array(n);
                for(var i = 0; i < n; ++i)copy[i] = arr[i];
                return copy;
            }
            function spliceOne(list, index) {
                for(; index + 1 < list.length; index++)list[index] = list[index + 1];
                list.pop();
            }
            function unwrapListeners(arr) {
                var ret = Array(arr.length);
                for(var i = 0; i < ret.length; ++i)ret[i] = arr[i].listener || arr[i];
                return ret;
            }
            function once(emitter, name) {
                return new Promise(function(resolve, reject) {
                    function errorListener(err) {
                        emitter.removeListener(name, resolver);
                        reject(err);
                    }
                    function resolver() {
                        if ('function' == typeof emitter.removeListener) emitter.removeListener('error', errorListener);
                        resolve([].slice.call(arguments));
                    }
                    eventTargetAgnosticAddListener(emitter, name, resolver, {
                        once: true
                    });
                    if ('error' !== name) addErrorHandlerIfEventEmitter(emitter, errorListener, {
                        once: true
                    });
                });
            }
            function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
                if ('function' == typeof emitter.on) eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
            }
            function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
                if ('function' == typeof emitter.on) if (flags.once) emitter.once(name, listener);
                else emitter.on(name, listener);
                else if ('function' == typeof emitter.addEventListener) emitter.addEventListener(name, function wrapListener(arg) {
                    if (flags.once) emitter.removeEventListener(name, wrapListener);
                    listener(arg);
                });
                else {
                    throw TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
                }
            }
            var EE = events.exports;
            var util$1 = {};
            var types = {};
            var shams$1 = function hasSymbols() {
                if ('function' != typeof Symbol || 'function' != typeof Object.getOwnPropertySymbols) {
                    return false;
                }
                if ('symbol' == typeof Symbol.iterator) {
                    return true;
                }
                var obj = {};
                var sym = Symbol('test');
                var symObj = Object(sym);
                if ('string' == typeof sym) {
                    return false;
                }
                if ('[object Symbol]' !== Object.prototype.toString.call(sym)) {
                    return false;
                }
                if ('[object Symbol]' !== Object.prototype.toString.call(symObj)) {
                    return false;
                }
                var symVal = 42;
                obj[sym] = symVal;
                for(sym in obj){
                    return false;
                }
                if ('function' == typeof Object.keys && 0 !== Object.keys(obj).length) {
                    return false;
                }
                if ('function' == typeof Object.getOwnPropertyNames && 0 !== Object.getOwnPropertyNames(obj).length) {
                    return false;
                }
                var syms = Object.getOwnPropertySymbols(obj);
                if (1 !== syms.length || syms[0] !== sym) {
                    return false;
                }
                if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
                    return false;
                }
                if ('function' == typeof Object.getOwnPropertyDescriptor) {
                    var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
                    if (descriptor.value !== symVal || true !== descriptor.enumerable) {
                        return false;
                    }
                }
                return true;
            };
            var origSymbol = 'undefined' != typeof Symbol && Symbol;
            var hasSymbolSham = shams$1;
            var hasSymbols$3 = function hasNativeSymbols() {
                if ('function' != typeof origSymbol) {
                    return false;
                }
                if ('function' != typeof Symbol) {
                    return false;
                }
                if ('symbol' != typeof origSymbol('foo')) {
                    return false;
                }
                if ('symbol' != typeof Symbol('bar')) {
                    return false;
                }
                return hasSymbolSham();
            };
            var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
            var slice$1 = Array.prototype.slice;
            var toStr$4 = Object.prototype.toString;
            var funcType = '[object Function]';
            var implementation$8 = function bind(that) {
                var target = this;
                if ('function' != typeof target || toStr$4.call(target) !== funcType) {
                    throw TypeError(ERROR_MESSAGE + target);
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
                    }
                    return target.apply(that, args.concat(slice$1.call(arguments)));
                };
                var boundLength = Math.max(0, target.length - args.length);
                var boundArgs = [];
                for(var i = 0; i < boundLength; i++)boundArgs.push('$' + i);
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
            var $TypeError = TypeError;
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
                    $gOPD$1 = null;
                }
            }
            var throwTypeError = function throwTypeError() {
                throw new $TypeError();
            };
            var ThrowTypeError = $gOPD$1 ? function() {
                try {
                    arguments.callee;
                    return throwTypeError;
                } catch (calleeThrows) {
                    try {
                        return $gOPD$1(arguments, 'callee').get;
                    } catch (gOPDthrows) {
                        return throwTypeError;
                    }
                }
            }() : throwTypeError;
            var hasSymbols$2 = hasSymbols$3();
            var getProto$1 = Object.getPrototypeOf || function(x) {
                return x.__proto__;
            };
            var needsEval = {};
            var TypedArray = 'undefined' == typeof Uint8Array ? undefined$1 : getProto$1(Uint8Array);
            var INTRINSICS = {
                '%AggregateError%': 'undefined' == typeof AggregateError ? undefined$1 : AggregateError,
                '%Array%': Array,
                '%ArrayBuffer%': 'undefined' == typeof ArrayBuffer ? undefined$1 : ArrayBuffer,
                '%ArrayIteratorPrototype%': hasSymbols$2 ? getProto$1([][Symbol.iterator]()) : undefined$1,
                '%AsyncFromSyncIteratorPrototype%': undefined$1,
                '%AsyncFunction%': needsEval,
                '%AsyncGenerator%': needsEval,
                '%AsyncGeneratorFunction%': needsEval,
                '%AsyncIteratorPrototype%': needsEval,
                '%Atomics%': 'undefined' == typeof Atomics ? undefined$1 : Atomics,
                '%BigInt%': 'undefined' == typeof BigInt ? undefined$1 : BigInt,
                '%Boolean%': Boolean,
                '%DataView%': 'undefined' == typeof DataView ? undefined$1 : DataView,
                '%Date%': Date,
                '%decodeURI%': decodeURI,
                '%decodeURIComponent%': decodeURIComponent,
                '%encodeURI%': encodeURI,
                '%encodeURIComponent%': encodeURIComponent,
                '%Error%': Error,
                '%eval%': eval,
                '%EvalError%': EvalError,
                '%Float32Array%': 'undefined' == typeof Float32Array ? undefined$1 : Float32Array,
                '%Float64Array%': 'undefined' == typeof Float64Array ? undefined$1 : Float64Array,
                '%FinalizationRegistry%': 'undefined' == typeof FinalizationRegistry ? undefined$1 : FinalizationRegistry,
                '%Function%': $Function,
                '%GeneratorFunction%': needsEval,
                '%Int8Array%': 'undefined' == typeof Int8Array ? undefined$1 : Int8Array,
                '%Int16Array%': 'undefined' == typeof Int16Array ? undefined$1 : Int16Array,
                '%Int32Array%': 'undefined' == typeof Int32Array ? undefined$1 : Int32Array,
                '%isFinite%': isFinite,
                '%isNaN%': isNaN,
                '%IteratorPrototype%': hasSymbols$2 ? getProto$1(getProto$1([][Symbol.iterator]())) : undefined$1,
                '%JSON%': 'object' == typeof JSON ? JSON : undefined$1,
                '%Map%': 'undefined' == typeof Map ? undefined$1 : Map,
                '%MapIteratorPrototype%': 'undefined' != typeof Map && hasSymbols$2 ? getProto$1(new Map()[Symbol.iterator]()) : undefined$1,
                '%Math%': Math,
                '%Number%': Number,
                '%Object%': Object,
                '%parseFloat%': parseFloat,
                '%parseInt%': parseInt,
                '%Promise%': 'undefined' == typeof Promise ? undefined$1 : Promise,
                '%Proxy%': 'undefined' == typeof Proxy ? undefined$1 : Proxy,
                '%RangeError%': RangeError,
                '%ReferenceError%': ReferenceError,
                '%Reflect%': 'undefined' == typeof Reflect ? undefined$1 : Reflect,
                '%RegExp%': RegExp,
                '%Set%': 'undefined' == typeof Set ? undefined$1 : Set,
                '%SetIteratorPrototype%': 'undefined' != typeof Set && hasSymbols$2 ? getProto$1(new Set()[Symbol.iterator]()) : undefined$1,
                '%SharedArrayBuffer%': 'undefined' == typeof SharedArrayBuffer ? undefined$1 : SharedArrayBuffer,
                '%String%': String,
                '%StringIteratorPrototype%': hasSymbols$2 ? getProto$1(''[Symbol.iterator]()) : undefined$1,
                '%Symbol%': hasSymbols$2 ? Symbol : undefined$1,
                '%SyntaxError%': $SyntaxError,
                '%ThrowTypeError%': ThrowTypeError,
                '%TypedArray%': TypedArray,
                '%TypeError%': $TypeError,
                '%Uint8Array%': 'undefined' == typeof Uint8Array ? undefined$1 : Uint8Array,
                '%Uint8ClampedArray%': 'undefined' == typeof Uint8ClampedArray ? undefined$1 : Uint8ClampedArray,
                '%Uint16Array%': 'undefined' == typeof Uint16Array ? undefined$1 : Uint16Array,
                '%Uint32Array%': 'undefined' == typeof Uint32Array ? undefined$1 : Uint32Array,
                '%URIError%': URIError,
                '%WeakMap%': 'undefined' == typeof WeakMap ? undefined$1 : WeakMap,
                '%WeakRef%': 'undefined' == typeof WeakRef ? undefined$1 : WeakRef,
                '%WeakSet%': 'undefined' == typeof WeakSet ? undefined$1 : WeakSet
            };
            var doEval = function doEval(name) {
                var value;
                if ('%AsyncFunction%' === name) value = getEvalledConstructor('async function () {}');
                else if ('%GeneratorFunction%' === name) value = getEvalledConstructor('function* () {}');
                else if ('%AsyncGeneratorFunction%' === name) value = getEvalledConstructor('async function* () {}');
                else if ('%AsyncGenerator%' === name) {
                    var fn = doEval('%AsyncGeneratorFunction%');
                    if (fn) value = fn.prototype;
                } else if ('%AsyncIteratorPrototype%' === name) {
                    var gen = doEval('%AsyncGenerator%');
                    if (gen) value = getProto$1(gen.prototype);
                }
                INTRINSICS[name] = value;
                return value;
            };
            var LEGACY_ALIASES = {
                '%ArrayBufferPrototype%': [
                    'ArrayBuffer',
                    'prototype'
                ],
                '%ArrayPrototype%': [
                    'Array',
                    'prototype'
                ],
                '%ArrayProto_entries%': [
                    'Array',
                    'prototype',
                    'entries'
                ],
                '%ArrayProto_forEach%': [
                    'Array',
                    'prototype',
                    'forEach'
                ],
                '%ArrayProto_keys%': [
                    'Array',
                    'prototype',
                    'keys'
                ],
                '%ArrayProto_values%': [
                    'Array',
                    'prototype',
                    'values'
                ],
                '%AsyncFunctionPrototype%': [
                    'AsyncFunction',
                    'prototype'
                ],
                '%AsyncGenerator%': [
                    'AsyncGeneratorFunction',
                    'prototype'
                ],
                '%AsyncGeneratorPrototype%': [
                    'AsyncGeneratorFunction',
                    'prototype',
                    'prototype'
                ],
                '%BooleanPrototype%': [
                    'Boolean',
                    'prototype'
                ],
                '%DataViewPrototype%': [
                    'DataView',
                    'prototype'
                ],
                '%DatePrototype%': [
                    'Date',
                    'prototype'
                ],
                '%ErrorPrototype%': [
                    'Error',
                    'prototype'
                ],
                '%EvalErrorPrototype%': [
                    'EvalError',
                    'prototype'
                ],
                '%Float32ArrayPrototype%': [
                    'Float32Array',
                    'prototype'
                ],
                '%Float64ArrayPrototype%': [
                    'Float64Array',
                    'prototype'
                ],
                '%FunctionPrototype%': [
                    'Function',
                    'prototype'
                ],
                '%Generator%': [
                    'GeneratorFunction',
                    'prototype'
                ],
                '%GeneratorPrototype%': [
                    'GeneratorFunction',
                    'prototype',
                    'prototype'
                ],
                '%Int8ArrayPrototype%': [
                    'Int8Array',
                    'prototype'
                ],
                '%Int16ArrayPrototype%': [
                    'Int16Array',
                    'prototype'
                ],
                '%Int32ArrayPrototype%': [
                    'Int32Array',
                    'prototype'
                ],
                '%JSONParse%': [
                    'JSON',
                    'parse'
                ],
                '%JSONStringify%': [
                    'JSON',
                    'stringify'
                ],
                '%MapPrototype%': [
                    'Map',
                    'prototype'
                ],
                '%NumberPrototype%': [
                    'Number',
                    'prototype'
                ],
                '%ObjectPrototype%': [
                    'Object',
                    'prototype'
                ],
                '%ObjProto_toString%': [
                    'Object',
                    'prototype',
                    'toString'
                ],
                '%ObjProto_valueOf%': [
                    'Object',
                    'prototype',
                    'valueOf'
                ],
                '%PromisePrototype%': [
                    'Promise',
                    'prototype'
                ],
                '%PromiseProto_then%': [
                    'Promise',
                    'prototype',
                    'then'
                ],
                '%Promise_all%': [
                    'Promise',
                    'all'
                ],
                '%Promise_reject%': [
                    'Promise',
                    'reject'
                ],
                '%Promise_resolve%': [
                    'Promise',
                    'resolve'
                ],
                '%RangeErrorPrototype%': [
                    'RangeError',
                    'prototype'
                ],
                '%ReferenceErrorPrototype%': [
                    'ReferenceError',
                    'prototype'
                ],
                '%RegExpPrototype%': [
                    'RegExp',
                    'prototype'
                ],
                '%SetPrototype%': [
                    'Set',
                    'prototype'
                ],
                '%SharedArrayBufferPrototype%': [
                    'SharedArrayBuffer',
                    'prototype'
                ],
                '%StringPrototype%': [
                    'String',
                    'prototype'
                ],
                '%SymbolPrototype%': [
                    'Symbol',
                    'prototype'
                ],
                '%SyntaxErrorPrototype%': [
                    'SyntaxError',
                    'prototype'
                ],
                '%TypedArrayPrototype%': [
                    'TypedArray',
                    'prototype'
                ],
                '%TypeErrorPrototype%': [
                    'TypeError',
                    'prototype'
                ],
                '%Uint8ArrayPrototype%': [
                    'Uint8Array',
                    'prototype'
                ],
                '%Uint8ClampedArrayPrototype%': [
                    'Uint8ClampedArray',
                    'prototype'
                ],
                '%Uint16ArrayPrototype%': [
                    'Uint16Array',
                    'prototype'
                ],
                '%Uint32ArrayPrototype%': [
                    'Uint32Array',
                    'prototype'
                ],
                '%URIErrorPrototype%': [
                    'URIError',
                    'prototype'
                ],
                '%WeakMapPrototype%': [
                    'WeakMap',
                    'prototype'
                ],
                '%WeakSetPrototype%': [
                    'WeakSet',
                    'prototype'
                ]
            };
            var bind = functionBind;
            var hasOwn$1 = src;
            var $concat = bind.call(Function.call, Array.prototype.concat);
            var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
            var $replace = bind.call(Function.call, String.prototype.replace);
            var $strSlice = bind.call(Function.call, String.prototype.slice);
            var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
            var reEscapeChar = /\\(\\)?/g;
            var stringToPath = function stringToPath(string) {
                var first = $strSlice(string, 0, 1);
                var last = $strSlice(string, -1);
                if ('%' === first && '%' !== last) {
                    throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
                }
                if ('%' === last && '%' !== first) {
                    throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
                }
                var result = [];
                $replace(string, rePropName, function(match, number, quote, subString) {
                    result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
                });
                return result;
            };
            var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
                var intrinsicName = name;
                var alias;
                if (hasOwn$1(LEGACY_ALIASES, intrinsicName)) {
                    alias = LEGACY_ALIASES[intrinsicName];
                    intrinsicName = '%' + alias[0] + '%';
                }
                if (hasOwn$1(INTRINSICS, intrinsicName)) {
                    var value = INTRINSICS[intrinsicName];
                    if (value === needsEval) value = doEval(intrinsicName);
                    if (void 0 === value && !allowMissing) {
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
                if ('string' != typeof name || 0 === name.length) {
                    throw new $TypeError('intrinsic name must be a non-empty string');
                }
                if (arguments.length > 1 && 'boolean' != typeof allowMissing) {
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
                    $spliceApply(parts, $concat([
                        0,
                        1
                    ], alias));
                }
                for(var i = 1, isOwn = true; i < parts.length; i += 1){
                    var part = parts[i];
                    var first = $strSlice(part, 0, 1);
                    var last = $strSlice(part, -1);
                    if (('"' === first || "'" === first || '`' === first || '"' === last || "'" === last || '`' === last) && first !== last) {
                        throw new $SyntaxError('property names with quotes must have matching quotes');
                    }
                    if ('constructor' === part || !isOwn) skipFurtherCaching = true;
                    intrinsicBaseName += '.' + part;
                    intrinsicRealName = '%' + intrinsicBaseName + '%';
                    if (hasOwn$1(INTRINSICS, intrinsicRealName)) value = INTRINSICS[intrinsicRealName];
                    else if (null != value) {
                        if (!(part in value)) {
                            if (!allowMissing) {
                                throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
                            }
                            return;
                        }
                        if ($gOPD$1 && i + 1 >= parts.length) {
                            var desc = $gOPD$1(value, part);
                            isOwn = !!desc;
                            value = isOwn && 'get' in desc && !('originalValue' in desc.get) ? desc.get : value[part];
                        } else {
                            isOwn = hasOwn$1(value, part);
                            value = value[part];
                        }
                        if (isOwn && !skipFurtherCaching) INTRINSICS[intrinsicRealName] = value;
                    }
                }
                return value;
            };
            var callBind$3 = {
                exports: {}
            };
            (function(module) {
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
                        $defineProperty = null;
                    }
                }
                module.exports = function callBind(originalFunction) {
                    var func = $reflectApply(bind, $call, arguments);
                    if ($gOPD && $defineProperty) {
                        var desc = $gOPD(func, 'length');
                        if (desc.configurable) $defineProperty(func, 'length', {
                            value: 1 + $max(0, originalFunction.length - (arguments.length - 1))
                        });
                    }
                    return func;
                };
                var applyBind = function applyBind() {
                    return $reflectApply(bind, $apply, arguments);
                };
                if ($defineProperty) $defineProperty(module.exports, 'apply', {
                    value: applyBind
                });
                else module.exports.apply = applyBind;
            })(callBind$3);
            var GetIntrinsic$1 = getIntrinsic;
            var callBind$2 = callBind$3.exports;
            var $indexOf$1 = callBind$2(GetIntrinsic$1('String.prototype.indexOf'));
            var callBound$3 = function callBoundIntrinsic(name, allowMissing) {
                var intrinsic = GetIntrinsic$1(name, !!allowMissing);
                if ('function' == typeof intrinsic && $indexOf$1(name, '.prototype.') > -1) {
                    return callBind$2(intrinsic);
                }
                return intrinsic;
            };
            var hasToStringTag$3 = 'function' == typeof Symbol && 'symbol' == typeof Symbol.toStringTag;
            var callBound$2 = callBound$3;
            var $toString$2 = callBound$2('Object.prototype.toString');
            var isStandardArguments = function isArguments(value) {
                if (hasToStringTag$3 && value && 'object' == typeof value && Symbol.toStringTag in value) {
                    return false;
                }
                return '[object Arguments]' === $toString$2(value);
            };
            var isLegacyArguments = function isArguments(value) {
                if (isStandardArguments(value)) {
                    return true;
                }
                return null !== value && 'object' == typeof value && 'number' == typeof value.length && value.length >= 0 && '[object Array]' !== $toString$2(value) && '[object Function]' === $toString$2(value.callee);
            };
            var supportsStandardArguments = function() {
                return isStandardArguments(arguments);
            }();
            isStandardArguments.isLegacyArguments = isLegacyArguments;
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
                if (!hasToStringTag$2) {
                    return false;
                }
                try {
                    return Function('return function*() {}')();
                } catch (e) {}
            };
            var GeneratorFunction;
            var isGeneratorFunction = function isGeneratorFunction(fn) {
                if ('function' != typeof fn) {
                    return false;
                }
                if (isFnRegex.test(fnToStr.call(fn))) {
                    return true;
                }
                if (!hasToStringTag$2) {
                    var str = toStr$3.call(fn);
                    return '[object GeneratorFunction]' === str;
                }
                if (!getProto) {
                    return false;
                }
                if (void 0 === GeneratorFunction) {
                    var generatorFunc = getGeneratorFunc();
                    GeneratorFunction = !!generatorFunc && getProto(generatorFunc);
                }
                return getProto(fn) === GeneratorFunction;
            };
            var hasOwn = Object.prototype.hasOwnProperty;
            var toString = Object.prototype.toString;
            var foreach = function forEach(obj, fn, ctx) {
                if ('[object Function]' !== toString.call(fn)) {
                    throw TypeError('iterator must be a function');
                }
                var l = obj.length;
                if (l === +l) {
                    for(var i = 0; i < l; i++)fn.call(ctx, obj[i], i, obj);
                } else {
                    for(var k in obj)if (hasOwn.call(obj, k)) fn.call(ctx, obj[k], k, obj);
                }
            };
            var possibleNames = [
                'BigInt64Array',
                'BigUint64Array',
                'Float32Array',
                'Float64Array',
                'Int16Array',
                'Int32Array',
                'Int8Array',
                'Uint16Array',
                'Uint32Array',
                'Uint8Array',
                'Uint8ClampedArray'
            ];
            var g$2 = 'undefined' == typeof globalThis ? commonjsGlobal : globalThis;
            var availableTypedArrays$2 = function availableTypedArrays() {
                var out = [];
                for(var i = 0; i < possibleNames.length; i++)if ('function' == typeof g$2[possibleNames[i]]) out[out.length] = possibleNames[i];
                return out;
            };
            var GetIntrinsic = getIntrinsic;
            var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
            if ($gOPD) {
                try {
                    $gOPD([], 'length');
                } catch (e) {
                    $gOPD = null;
                }
            }
            var getOwnPropertyDescriptor = $gOPD;
            var forEach$2 = foreach;
            var availableTypedArrays$1 = availableTypedArrays$2;
            var callBound$1 = callBound$3;
            var $toString$1 = callBound$1('Object.prototype.toString');
            var hasToStringTag$1 = shams();
            var g$1 = 'undefined' == typeof globalThis ? commonjsGlobal : globalThis;
            var typedArrays$1 = availableTypedArrays$1();
            var $indexOf = callBound$1('Array.prototype.indexOf', true) || function indexOf(array, value) {
                for(var i = 0; i < array.length; i += 1)if (array[i] === value) {
                    return i;
                }
                return -1;
            };
            var $slice$1 = callBound$1('String.prototype.slice');
            var toStrTags$1 = {};
            var gOPD$1 = getOwnPropertyDescriptor;
            var getPrototypeOf$1 = Object.getPrototypeOf;
            if (hasToStringTag$1 && gOPD$1 && getPrototypeOf$1) forEach$2(typedArrays$1, function(typedArray) {
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
            var tryTypedArrays$1 = function tryAllTypedArrays(value) {
                var anyTrue = false;
                forEach$2(toStrTags$1, function(getter, typedArray) {
                    if (!anyTrue) {
                        try {
                            anyTrue = getter.call(value) === typedArray;
                        } catch (e) {}
                    }
                });
                return anyTrue;
            };
            var isTypedArray$1 = function isTypedArray(value) {
                if (!value || 'object' != typeof value) {
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
            var forEach$1 = foreach;
            var availableTypedArrays = availableTypedArrays$2;
            var callBound = callBound$3;
            var $toString = callBound('Object.prototype.toString');
            var hasToStringTag = shams();
            var g = 'undefined' == typeof globalThis ? commonjsGlobal : globalThis;
            var typedArrays = availableTypedArrays();
            var $slice = callBound('String.prototype.slice');
            var toStrTags = {};
            var gOPD = getOwnPropertyDescriptor;
            var getPrototypeOf = Object.getPrototypeOf;
            if (hasToStringTag && gOPD && getPrototypeOf) forEach$1(typedArrays, function(typedArray) {
                if ('function' == typeof g[typedArray]) {
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
            var tryTypedArrays = function tryAllTypedArrays(value) {
                var foundName = false;
                forEach$1(toStrTags, function(getter, typedArray) {
                    if (!foundName) {
                        try {
                            var name = getter.call(value);
                            if (name === typedArray) foundName = name;
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
            (function(exports) {
                var isArgumentsObject = isArguments$1;
                var isGeneratorFunction$1 = isGeneratorFunction;
                var whichTypedArray$1 = whichTypedArray;
                var isTypedArray = isTypedArray$1;
                function uncurryThis(f) {
                    return f.call.bind(f);
                }
                var BigIntSupported = 'undefined' != typeof BigInt;
                var SymbolSupported = 'undefined' != typeof Symbol;
                var ObjectToString = uncurryThis(Object.prototype.toString);
                var numberValue = uncurryThis(Number.prototype.valueOf);
                var stringValue = uncurryThis(String.prototype.valueOf);
                var booleanValue = uncurryThis(Boolean.prototype.valueOf);
                if (BigIntSupported) var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
                if (SymbolSupported) var symbolValue = uncurryThis(Symbol.prototype.valueOf);
                function checkBoxedPrimitive(value, prototypeValueOf) {
                    if ('object' != typeof value) {
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
                exports.isTypedArray = isTypedArray;
                function isPromise(input) {
                    return 'undefined' != typeof Promise && input instanceof Promise || null !== input && 'object' == typeof input && 'function' == typeof input.then && 'function' == typeof input.catch;
                }
                exports.isPromise = isPromise;
                function isArrayBufferView(value) {
                    if ('undefined' != typeof ArrayBuffer && ArrayBuffer.isView) {
                        return ArrayBuffer.isView(value);
                    }
                    return isTypedArray(value) || isDataView(value);
                }
                exports.isArrayBufferView = isArrayBufferView;
                function isUint8Array(value) {
                    return 'Uint8Array' === whichTypedArray$1(value);
                }
                exports.isUint8Array = isUint8Array;
                function isUint8ClampedArray(value) {
                    return 'Uint8ClampedArray' === whichTypedArray$1(value);
                }
                exports.isUint8ClampedArray = isUint8ClampedArray;
                function isUint16Array(value) {
                    return 'Uint16Array' === whichTypedArray$1(value);
                }
                exports.isUint16Array = isUint16Array;
                function isUint32Array(value) {
                    return 'Uint32Array' === whichTypedArray$1(value);
                }
                exports.isUint32Array = isUint32Array;
                function isInt8Array(value) {
                    return 'Int8Array' === whichTypedArray$1(value);
                }
                exports.isInt8Array = isInt8Array;
                function isInt16Array(value) {
                    return 'Int16Array' === whichTypedArray$1(value);
                }
                exports.isInt16Array = isInt16Array;
                function isInt32Array(value) {
                    return 'Int32Array' === whichTypedArray$1(value);
                }
                exports.isInt32Array = isInt32Array;
                function isFloat32Array(value) {
                    return 'Float32Array' === whichTypedArray$1(value);
                }
                exports.isFloat32Array = isFloat32Array;
                function isFloat64Array(value) {
                    return 'Float64Array' === whichTypedArray$1(value);
                }
                exports.isFloat64Array = isFloat64Array;
                function isBigInt64Array(value) {
                    return 'BigInt64Array' === whichTypedArray$1(value);
                }
                exports.isBigInt64Array = isBigInt64Array;
                function isBigUint64Array(value) {
                    return 'BigUint64Array' === whichTypedArray$1(value);
                }
                exports.isBigUint64Array = isBigUint64Array;
                function isMapToString(value) {
                    return '[object Map]' === ObjectToString(value);
                }
                isMapToString.working = 'undefined' != typeof Map && isMapToString(new Map());
                function isMap(value) {
                    if ('undefined' == typeof Map) {
                        return false;
                    }
                    return isMapToString.working ? isMapToString(value) : value instanceof Map;
                }
                exports.isMap = isMap;
                function isSetToString(value) {
                    return '[object Set]' === ObjectToString(value);
                }
                isSetToString.working = 'undefined' != typeof Set && isSetToString(new Set());
                function isSet(value) {
                    if ('undefined' == typeof Set) {
                        return false;
                    }
                    return isSetToString.working ? isSetToString(value) : value instanceof Set;
                }
                exports.isSet = isSet;
                function isWeakMapToString(value) {
                    return '[object WeakMap]' === ObjectToString(value);
                }
                isWeakMapToString.working = 'undefined' != typeof WeakMap && isWeakMapToString(new WeakMap());
                function isWeakMap(value) {
                    if ('undefined' == typeof WeakMap) {
                        return false;
                    }
                    return isWeakMapToString.working ? isWeakMapToString(value) : value instanceof WeakMap;
                }
                exports.isWeakMap = isWeakMap;
                function isWeakSetToString(value) {
                    return '[object WeakSet]' === ObjectToString(value);
                }
                isWeakSetToString.working = 'undefined' != typeof WeakSet && isWeakSetToString(new WeakSet());
                function isWeakSet(value) {
                    return isWeakSetToString(value);
                }
                exports.isWeakSet = isWeakSet;
                function isArrayBufferToString(value) {
                    return '[object ArrayBuffer]' === ObjectToString(value);
                }
                isArrayBufferToString.working = 'undefined' != typeof ArrayBuffer && isArrayBufferToString(new ArrayBuffer());
                function isArrayBuffer(value) {
                    if ('undefined' == typeof ArrayBuffer) {
                        return false;
                    }
                    return isArrayBufferToString.working ? isArrayBufferToString(value) : value instanceof ArrayBuffer;
                }
                exports.isArrayBuffer = isArrayBuffer;
                function isDataViewToString(value) {
                    return '[object DataView]' === ObjectToString(value);
                }
                isDataViewToString.working = 'undefined' != typeof ArrayBuffer && 'undefined' != typeof DataView && isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1));
                function isDataView(value) {
                    if ('undefined' == typeof DataView) {
                        return false;
                    }
                    return isDataViewToString.working ? isDataViewToString(value) : value instanceof DataView;
                }
                exports.isDataView = isDataView;
                var SharedArrayBufferCopy = 'undefined' != typeof SharedArrayBuffer ? SharedArrayBuffer : void 0;
                function isSharedArrayBufferToString(value) {
                    return '[object SharedArrayBuffer]' === ObjectToString(value);
                }
                function isSharedArrayBuffer(value) {
                    if (void 0 === SharedArrayBufferCopy) {
                        return false;
                    }
                    if (void 0 === isSharedArrayBufferToString.working) isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
                    return isSharedArrayBufferToString.working ? isSharedArrayBufferToString(value) : value instanceof SharedArrayBufferCopy;
                }
                exports.isSharedArrayBuffer = isSharedArrayBuffer;
                function isAsyncFunction(value) {
                    return '[object AsyncFunction]' === ObjectToString(value);
                }
                exports.isAsyncFunction = isAsyncFunction;
                function isMapIterator(value) {
                    return '[object Map Iterator]' === ObjectToString(value);
                }
                exports.isMapIterator = isMapIterator;
                function isSetIterator(value) {
                    return '[object Set Iterator]' === ObjectToString(value);
                }
                exports.isSetIterator = isSetIterator;
                function isGeneratorObject(value) {
                    return '[object Generator]' === ObjectToString(value);
                }
                exports.isGeneratorObject = isGeneratorObject;
                function isWebAssemblyCompiledModule(value) {
                    return '[object WebAssembly.Module]' === ObjectToString(value);
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
                    return 'undefined' != typeof Uint8Array && (isArrayBuffer(value) || isSharedArrayBuffer(value));
                }
                exports.isAnyArrayBuffer = isAnyArrayBuffer;
                [
                    'isProxy',
                    'isExternal',
                    'isModuleNamespaceObject'
                ].forEach(function(method) {
                    Object.defineProperty(exports, method, {
                        enumerable: false,
                        value: function value() {
                            throw Error(method + ' is not supported in userland');
                        }
                    });
                });
            })(types);
            var isBufferBrowser = function isBuffer(arg) {
                return arg && 'object' == typeof arg && 'function' == typeof arg.copy && 'function' == typeof arg.fill && 'function' == typeof arg.readUInt8;
            };
            var inherits_browser = {
                exports: {}
            };
            if ('function' == typeof Object.create) inherits_browser.exports = function inherits(ctor, superCtor) {
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
            else inherits_browser.exports = function inherits(ctor, superCtor) {
                if (superCtor) {
                    ctor.super_ = superCtor;
                    var TempCtor = function TempCtor() {};
                    TempCtor.prototype = superCtor.prototype;
                    ctor.prototype = new TempCtor();
                    ctor.prototype.constructor = ctor;
                }
            };
            (function(exports) {
                var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors(obj) {
                    var keys = Object.keys(obj);
                    var descriptors = {};
                    for(var i = 0; i < keys.length; i++)descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
                    return descriptors;
                };
                var formatRegExp = /%[sdj%]/g;
                exports.format = function(f) {
                    if (!isString(f)) {
                        var objects = [];
                        for(var i = 0; i < arguments.length; i++)objects.push(inspect(arguments[i]));
                        return objects.join(' ');
                    }
                    var i = 1;
                    var args = arguments;
                    var len = args.length;
                    var str = String(f).replace(formatRegExp, function(x) {
                        if ('%%' === x) return '%';
                        if (i >= len) return x;
                        switch(x){
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
                    for(var x = args[i]; i < len; x = args[++i])if (isNull(x) || !isObject(x)) str += ' ' + x;
                    else str += ' ' + inspect(x);
                    return str;
                };
                exports.deprecate = function(fn, msg) {
                    if (void 0 !== browser$1$1 && true === browser$1$1.noDeprecation) {
                        return fn;
                    }
                    if (void 0 === browser$1$1) {
                        return function() {
                            return exports.deprecate(fn, msg).apply(this, arguments);
                        };
                    }
                    var warned = false;
                    function deprecated() {
                        if (!warned) {
                            console.error(msg);
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
                    debugEnvRegex = RegExp('^' + debugEnv + '$', 'i');
                }
                exports.debuglog = function(set) {
                    set = set.toUpperCase();
                    if (!debugs[set]) if (debugEnvRegex.test(set)) {
                        var pid = browser$1$1.pid;
                        debugs[set] = function() {
                            var msg = exports.format.apply(exports, arguments);
                            console.error('%s %d: %s', set, pid, msg);
                        };
                    } else {
                        debugs[set] = function() {};
                    }
                    return debugs[set];
                };
                function inspect(obj, opts) {
                    var ctx = {
                        seen: [],
                        stylize: stylizeNoColor
                    };
                    if (arguments.length >= 3) ctx.depth = arguments[2];
                    if (arguments.length >= 4) ctx.colors = arguments[3];
                    if (isBoolean(opts)) ctx.showHidden = opts;
                    else if (opts) exports._extend(ctx, opts);
                    if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
                    if (isUndefined(ctx.depth)) ctx.depth = 2;
                    if (isUndefined(ctx.colors)) ctx.colors = false;
                    if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
                    if (ctx.colors) ctx.stylize = stylizeWithColor;
                    return formatValue(ctx, obj, ctx.depth);
                }
                exports.inspect = inspect;
                inspect.colors = {
                    bold: [
                        1,
                        22
                    ],
                    italic: [
                        3,
                        23
                    ],
                    underline: [
                        4,
                        24
                    ],
                    inverse: [
                        7,
                        27
                    ],
                    white: [
                        37,
                        39
                    ],
                    grey: [
                        90,
                        39
                    ],
                    black: [
                        30,
                        39
                    ],
                    blue: [
                        34,
                        39
                    ],
                    cyan: [
                        36,
                        39
                    ],
                    green: [
                        32,
                        39
                    ],
                    magenta: [
                        35,
                        39
                    ],
                    red: [
                        31,
                        39
                    ],
                    yellow: [
                        33,
                        39
                    ]
                };
                inspect.styles = {
                    special: 'cyan',
                    number: 'yellow',
                    boolean: 'yellow',
                    undefined: 'grey',
                    null: 'bold',
                    string: 'green',
                    date: 'magenta',
                    regexp: 'red'
                };
                function stylizeWithColor(str, styleType) {
                    var style = inspect.styles[styleType];
                    if (style) {
                        return "\x1B[" + inspect.colors[style][0] + 'm' + str + "\x1B[" + inspect.colors[style][1] + 'm';
                    }
                    return str;
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
                    if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== exports.inspect && !(value.constructor && value.constructor.prototype === value)) {
                        var ret = value.inspect(recurseTimes, ctx);
                        if (!isString(ret)) ret = formatValue(ctx, ret, recurseTimes);
                        return ret;
                    }
                    var primitive = formatPrimitive(ctx, value);
                    if (primitive) {
                        return primitive;
                    }
                    var keys = Object.keys(value);
                    var visibleKeys = arrayToHash(keys);
                    if (ctx.showHidden) keys = Object.getOwnPropertyNames(value);
                    if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
                        return formatError(value);
                    }
                    if (0 === keys.length) {
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
                    var base = '', array = false, braces = [
                        '{',
                        '}'
                    ];
                    if (isArray(value)) {
                        array = true;
                        braces = [
                            '[',
                            ']'
                        ];
                    }
                    if (isFunction(value)) {
                        var n = value.name ? ': ' + value.name : '';
                        base = ' [Function' + n + ']';
                    }
                    if (isRegExp(value)) base = ' ' + RegExp.prototype.toString.call(value);
                    if (isDate(value)) base = ' ' + Date.prototype.toUTCString.call(value);
                    if (isError(value)) base = ' ' + formatError(value);
                    if (0 === keys.length && (!array || 0 == value.length)) {
                        return braces[0] + base + braces[1];
                    }
                    if (recurseTimes < 0) {
                        if (isRegExp(value)) {
                            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
                        }
                        return ctx.stylize('[Object]', 'special');
                    }
                    ctx.seen.push(value);
                    var output;
                    output = array ? formatArray(ctx, value, recurseTimes, visibleKeys, keys) : keys.map(function(key) {
                        return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
                    });
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
                    if (isBoolean(value)) return ctx.stylize('' + value, 'boolean');
                    if (isNull(value)) return ctx.stylize('null', 'null');
                }
                function formatError(value) {
                    return '[' + Error.prototype.toString.call(value) + ']';
                }
                function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
                    var output = [];
                    for(var i = 0, l = value.length; i < l; ++i)if (hasOwnProperty(value, String(i))) output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
                    else output.push('');
                    keys.forEach(function(key) {
                        if (!key.match(/^\d+$/)) output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
                    });
                    return output;
                }
                function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
                    var name, str, desc;
                    desc = Object.getOwnPropertyDescriptor(value, key) || {
                        value: value[key]
                    };
                    if (desc.get) str = desc.set ? ctx.stylize('[Getter/Setter]', 'special') : ctx.stylize('[Getter]', 'special');
                    else if (desc.set) str = ctx.stylize('[Setter]', 'special');
                    if (!hasOwnProperty(visibleKeys, key)) name = '[' + key + ']';
                    if (!str) if (ctx.seen.indexOf(desc.value) < 0) {
                        str = isNull(recurseTimes) ? formatValue(ctx, desc.value, null) : formatValue(ctx, desc.value, recurseTimes - 1);
                        if (str.indexOf('\n') > -1) str = array ? str.split('\n').map(function(line) {
                            return '  ' + line;
                        }).join('\n').substr(2) : '\n' + str.split('\n').map(function(line) {
                            return '   ' + line;
                        }).join('\n');
                    } else {
                        str = ctx.stylize('[Circular]', 'special');
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
                    var length = output.reduce(function(prev, cur) {
                        if (cur.indexOf('\n') >= 0) ;
                        return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
                    }, 0);
                    if (length > 60) {
                        return braces[0] + ('' === base ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
                    }
                    return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
                }
                exports.types = types;
                function isArray(ar) {
                    return Array.isArray(ar);
                }
                exports.isArray = isArray;
                function isBoolean(arg) {
                    return 'boolean' == typeof arg;
                }
                exports.isBoolean = isBoolean;
                function isNull(arg) {
                    return null === arg;
                }
                exports.isNull = isNull;
                function isNullOrUndefined(arg) {
                    return null == arg;
                }
                exports.isNullOrUndefined = isNullOrUndefined;
                function isNumber(arg) {
                    return 'number' == typeof arg;
                }
                exports.isNumber = isNumber;
                function isString(arg) {
                    return 'string' == typeof arg;
                }
                exports.isString = isString;
                function isSymbol(arg) {
                    return 'symbol' == typeof arg;
                }
                exports.isSymbol = isSymbol;
                function isUndefined(arg) {
                    return void 0 === arg;
                }
                exports.isUndefined = isUndefined;
                function isRegExp(re) {
                    return isObject(re) && '[object RegExp]' === objectToString(re);
                }
                exports.isRegExp = isRegExp;
                exports.types.isRegExp = isRegExp;
                function isObject(arg) {
                    return 'object' == typeof arg && null !== arg;
                }
                exports.isObject = isObject;
                function isDate(d) {
                    return isObject(d) && '[object Date]' === objectToString(d);
                }
                exports.isDate = isDate;
                exports.types.isDate = isDate;
                function isError(e) {
                    return isObject(e) && ('[object Error]' === objectToString(e) || e instanceof Error);
                }
                exports.isError = isError;
                exports.types.isNativeError = isError;
                function isFunction(arg) {
                    return 'function' == typeof arg;
                }
                exports.isFunction = isFunction;
                function isPrimitive(arg) {
                    return null === arg || 'boolean' == typeof arg || 'number' == typeof arg || 'string' == typeof arg || 'symbol' == typeof arg || void 0 === arg;
                }
                exports.isPrimitive = isPrimitive;
                exports.isBuffer = isBufferBrowser;
                function objectToString(o) {
                    return Object.prototype.toString.call(o);
                }
                function pad(n) {
                    return n < 10 ? '0' + n.toString(10) : n.toString(10);
                }
                var months = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ];
                function timestamp() {
                    var d = new Date();
                    var time = [
                        pad(d.getHours()),
                        pad(d.getMinutes()),
                        pad(d.getSeconds())
                    ].join(':');
                    return [
                        d.getDate(),
                        months[d.getMonth()],
                        time
                    ].join(' ');
                }
                exports.log = function() {
                    console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
                };
                exports.inherits = inherits_browser.exports;
                exports._extend = function(origin, add) {
                    if (!add || !isObject(add)) return origin;
                    var keys = Object.keys(add);
                    var i = keys.length;
                    while(i--){
                        origin[keys[i]] = add[keys[i]];
                    }
                    return origin;
                };
                function hasOwnProperty(obj, prop) {
                    return Object.prototype.hasOwnProperty.call(obj, prop);
                }
                var kCustomPromisifiedSymbol = 'undefined' != typeof Symbol ? Symbol('util.promisify.custom') : void 0;
                exports.promisify = function promisify(original) {
                    if ('function' != typeof original) throw TypeError('The "original" argument must be of type Function');
                    if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
                        var fn = original[kCustomPromisifiedSymbol];
                        if ('function' != typeof fn) {
                            throw TypeError('The "util.promisify.custom" argument must be of type Function');
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
                        var promise = new Promise(function(resolve, reject) {
                            promiseResolve = resolve;
                            promiseReject = reject;
                        });
                        var args = [];
                        for(var i = 0; i < arguments.length; i++)args.push(arguments[i]);
                        args.push(function(err, value) {
                            if (err) promiseReject(err);
                            else promiseResolve(value);
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
                    if (!reason) {
                        var newReason = Error('Promise was rejected with a falsy value');
                        newReason.reason = reason;
                        reason = newReason;
                    }
                    return cb(reason);
                }
                function callbackify(original) {
                    if ('function' != typeof original) {
                        throw TypeError('The "original" argument must be of type Function');
                    }
                    function callbackified() {
                        var args = [];
                        for(var i = 0; i < arguments.length; i++)args.push(arguments[i]);
                        var maybeCb = args.pop();
                        if ('function' != typeof maybeCb) {
                            throw TypeError('The last argument must be of type Function');
                        }
                        var self1 = this;
                        var cb = function cb() {
                            return maybeCb.apply(self1, arguments);
                        };
                        original.apply(this, args).then(function(ret) {
                            browser$1$1.nextTick(cb.bind(null, null, ret));
                        }, function(rej) {
                            browser$1$1.nextTick(callbackifyOnRejected.bind(null, rej, cb));
                        });
                    }
                    Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
                    Object.defineProperties(callbackified, getOwnPropertyDescriptors(original));
                    return callbackified;
                }
                exports.callbackify = callbackify;
            })(util$1);
            var browser = {
                exports: {}
            };
            var process = browser.exports = {};
            var cachedSetTimeout;
            var cachedClearTimeout;
            function defaultSetTimout() {
                throw Error('setTimeout has not been defined');
            }
            function defaultClearTimeout() {
                throw Error('clearTimeout has not been defined');
            }
            (function() {
                try {
                    cachedSetTimeout = 'function' == typeof setTimeout ? setTimeout : defaultSetTimout;
                } catch (e) {
                    cachedSetTimeout = defaultSetTimout;
                }
                try {
                    cachedClearTimeout = 'function' == typeof clearTimeout ? clearTimeout : defaultClearTimeout;
                } catch (e1) {
                    cachedClearTimeout = defaultClearTimeout;
                }
            })();
            function runTimeout(fun) {
                if (cachedSetTimeout === setTimeout) {
                    return setTimeout(fun, 0);
                }
                if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                    cachedSetTimeout = setTimeout;
                    return setTimeout(fun, 0);
                }
                try {
                    return cachedSetTimeout(fun, 0);
                } catch (e1) {
                    try {
                        return cachedSetTimeout.call(null, fun, 0);
                    } catch (e) {
                        return cachedSetTimeout.call(this, fun, 0);
                    }
                }
            }
            function runClearTimeout(marker) {
                if (cachedClearTimeout === clearTimeout) {
                    return clearTimeout(marker);
                }
                if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                    cachedClearTimeout = clearTimeout;
                    return clearTimeout(marker);
                }
                try {
                    return cachedClearTimeout(marker);
                } catch (e1) {
                    try {
                        return cachedClearTimeout.call(null, marker);
                    } catch (e) {
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
                if (currentQueue.length) queue = currentQueue.concat(queue);
                else queueIndex = -1;
                if (queue.length) drainQueue();
            }
            function drainQueue() {
                if (draining) {
                    return;
                }
                var timeout = runTimeout(cleanUpNextTick);
                draining = true;
                var len = queue.length;
                while(len){
                    currentQueue = queue;
                    queue = [];
                    while(++queueIndex < len){
                        if (currentQueue) currentQueue[queueIndex].run();
                    }
                    queueIndex = -1;
                    len = queue.length;
                }
                currentQueue = null;
                draining = false;
                runClearTimeout(timeout);
            }
            process.nextTick = function(fun) {
                var args = Array(arguments.length - 1);
                if (arguments.length > 1) {
                    for(var i = 1; i < arguments.length; i++)args[i - 1] = arguments[i];
                }
                queue.push(new Item(fun, args));
                if (1 === queue.length && !draining) runTimeout(drainQueue);
            };
            function Item(fun, array) {
                this.fun = fun;
                this.array = array;
            }
            Item.prototype.run = function() {
                this.fun.apply(null, this.array);
            };
            process.title = 'browser';
            process.browser = true;
            process.env = {};
            process.argv = [];
            process.version = '';
            process.versions = {};
            function noop() {}
            process.on = noop;
            process.addListener = noop;
            process.once = noop;
            process.off = noop;
            process.removeListener = noop;
            process.removeAllListeners = noop;
            process.emit = noop;
            process.prependListener = noop;
            process.prependOnceListener = noop;
            process.listeners = function(name) {
                return [];
            };
            process.binding = function(name) {
                throw Error('process.binding is not supported');
            };
            process.cwd = function() {
                return '/';
            };
            process.chdir = function(dir) {
                throw Error('process.chdir is not supported');
            };
            process.umask = function() {
                return 0;
            };
            function BufferList() {
                this.head = null;
                this.tail = null;
                this.length = 0;
            }
            BufferList.prototype.push = function(v) {
                var entry = {
                    data: v,
                    next: null
                };
                if (this.length > 0) this.tail.next = entry;
                else this.head = entry;
                this.tail = entry;
                ++this.length;
            };
            BufferList.prototype.unshift = function(v) {
                var entry = {
                    data: v,
                    next: this.head
                };
                if (0 === this.length) this.tail = entry;
                this.head = entry;
                ++this.length;
            };
            BufferList.prototype.shift = function() {
                if (0 === this.length) return;
                var ret = this.head.data;
                if (1 === this.length) this.head = this.tail = null;
                else this.head = this.head.next;
                --this.length;
                return ret;
            };
            BufferList.prototype.clear = function() {
                this.head = this.tail = null;
                this.length = 0;
            };
            BufferList.prototype.join = function(s) {
                if (0 === this.length) return '';
                var p = this.head;
                var ret = '' + p.data;
                while(p = p.next){
                    ret += s + p.data;
                }
                return ret;
            };
            BufferList.prototype.concat = function(n) {
                if (0 === this.length) return buffer.Buffer.alloc(0);
                if (1 === this.length) return this.head.data;
                var ret = buffer.Buffer.allocUnsafe(n >>> 0);
                var p = this.head;
                var i = 0;
                while(p){
                    p.data.copy(ret, i);
                    i += p.data.length;
                    p = p.next;
                }
                return ret;
            };
            var safeBuffer = {
                exports: {}
            };
            (function(module, exports) {
                var buffer$1 = buffer;
                var Buffer = buffer$1.Buffer;
                function copyProps(src, dst) {
                    for(var key in src)dst[key] = src[key];
                }
                if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) module.exports = buffer$1;
                else {
                    copyProps(buffer$1, exports);
                    exports.Buffer = SafeBuffer;
                }
                function SafeBuffer(arg, encodingOrOffset, length) {
                    return Buffer(arg, encodingOrOffset, length);
                }
                SafeBuffer.prototype = Object.create(Buffer.prototype);
                copyProps(Buffer, SafeBuffer);
                SafeBuffer.from = function(arg, encodingOrOffset, length) {
                    if ('number' == typeof arg) {
                        throw TypeError('Argument must not be a number');
                    }
                    return Buffer(arg, encodingOrOffset, length);
                };
                SafeBuffer.alloc = function(size, fill, encoding) {
                    if ('number' != typeof size) {
                        throw TypeError('Argument must be a number');
                    }
                    var buf = Buffer(size);
                    if (void 0 !== fill) if ('string' == typeof encoding) buf.fill(fill, encoding);
                    else buf.fill(fill);
                    else buf.fill(0);
                    return buf;
                };
                SafeBuffer.allocUnsafe = function(size) {
                    if ('number' != typeof size) {
                        throw TypeError('Argument must be a number');
                    }
                    return Buffer(size);
                };
                SafeBuffer.allocUnsafeSlow = function(size) {
                    if ('number' != typeof size) {
                        throw TypeError('Argument must be a number');
                    }
                    return buffer$1.SlowBuffer(size);
                };
            })(safeBuffer, safeBuffer.exports);
            var Buffer = safeBuffer.exports.Buffer;
            var isEncoding = Buffer.isEncoding || function(encoding) {
                encoding = '' + encoding;
                switch(encoding && encoding.toLowerCase()){
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
                while(true){
                    switch(enc){
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
                            if (retried) return;
                            enc = ('' + enc).toLowerCase();
                            retried = true;
                    }
                }
            }
            function normalizeEncoding(enc) {
                var nenc = _normalizeEncoding(enc);
                if ('string' != typeof nenc && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw Error('Unknown encoding: ' + enc);
                return nenc || enc;
            }
            var StringDecoder_1 = StringDecoder;
            function StringDecoder(encoding) {
                this.encoding = normalizeEncoding(encoding);
                var nb;
                switch(this.encoding){
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
                this.lastChar = Buffer.allocUnsafe(nb);
            }
            StringDecoder.prototype.write = function(buf) {
                if (0 === buf.length) return '';
                var r;
                var i;
                if (this.lastNeed) {
                    r = this.fillLast(buf);
                    if (void 0 === r) return '';
                    i = this.lastNeed;
                    this.lastNeed = 0;
                } else {
                    i = 0;
                }
                if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
                return r || '';
            };
            StringDecoder.prototype.end = utf8End;
            StringDecoder.prototype.text = utf8Text;
            StringDecoder.prototype.fillLast = function(buf) {
                if (this.lastNeed <= buf.length) {
                    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
                    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
                }
                buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
                this.lastNeed -= buf.length;
            };
            function utf8CheckByte(byte) {
                if (byte <= 0x7F) return 0;
                if (byte >> 5 === 0x06) return 2;
                if (byte >> 4 === 0x0E) return 3;
                if (byte >> 3 === 0x1E) return 4;
                return byte >> 6 === 0x02 ? -1 : -2;
            }
            function utf8CheckIncomplete(self1, buf, i) {
                var j = buf.length - 1;
                if (j < i) return 0;
                var nb = utf8CheckByte(buf[j]);
                if (nb >= 0) {
                    if (nb > 0) self1.lastNeed = nb - 1;
                    return nb;
                }
                if (--j < i || -2 === nb) return 0;
                nb = utf8CheckByte(buf[j]);
                if (nb >= 0) {
                    if (nb > 0) self1.lastNeed = nb - 2;
                    return nb;
                }
                if (--j < i || -2 === nb) return 0;
                nb = utf8CheckByte(buf[j]);
                if (nb >= 0) {
                    if (nb > 0) if (2 === nb) nb = 0;
                    else self1.lastNeed = nb - 3;
                    return nb;
                }
                return 0;
            }
            function utf8CheckExtraBytes(self1, buf, p) {
                if ((0xC0 & buf[0]) !== 0x80) {
                    self1.lastNeed = 0;
                    return "\uFFFD";
                }
                if (self1.lastNeed > 1 && buf.length > 1) {
                    if ((0xC0 & buf[1]) !== 0x80) {
                        self1.lastNeed = 1;
                        return "\uFFFD";
                    }
                    if (self1.lastNeed > 2 && buf.length > 2) {
                        if ((0xC0 & buf[2]) !== 0x80) {
                            self1.lastNeed = 2;
                            return "\uFFFD";
                        }
                    }
                }
            }
            function utf8FillLast(buf) {
                var p = this.lastTotal - this.lastNeed;
                var r = utf8CheckExtraBytes(this, buf);
                if (void 0 !== r) return r;
                if (this.lastNeed <= buf.length) {
                    buf.copy(this.lastChar, p, 0, this.lastNeed);
                    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
                }
                buf.copy(this.lastChar, p, 0, buf.length);
                this.lastNeed -= buf.length;
            }
            function utf8Text(buf, i) {
                var total = utf8CheckIncomplete(this, buf, i);
                if (!this.lastNeed) return buf.toString('utf8', i);
                this.lastTotal = total;
                var end = buf.length - (total - this.lastNeed);
                buf.copy(this.lastChar, 0, end);
                return buf.toString('utf8', i, end);
            }
            function utf8End(buf) {
                var r = buf && buf.length ? this.write(buf) : '';
                if (this.lastNeed) return r + "\uFFFD";
                return r;
            }
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
            }
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
                if (0 === n) return buf.toString('base64', i);
                this.lastNeed = 3 - n;
                this.lastTotal = 3;
                if (1 === n) this.lastChar[0] = buf[buf.length - 1];
                else {
                    this.lastChar[0] = buf[buf.length - 2];
                    this.lastChar[1] = buf[buf.length - 1];
                }
                return buf.toString('base64', i, buf.length - n);
            }
            function base64End(buf) {
                var r = buf && buf.length ? this.write(buf) : '';
                if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
                return r;
            }
            function simpleWrite(buf) {
                return buf.toString(this.encoding);
            }
            function simpleEnd(buf) {
                return buf && buf.length ? this.write(buf) : '';
            }
            Readable.ReadableState = ReadableState;
            var debug = util$1.debuglog('stream');
            util$1.inherits(Readable, EE);
            function prependListener(emitter, event, fn) {
                if ('function' == typeof emitter.prependListener) {
                    return emitter.prependListener(event, fn);
                }
                if (emitter._events && emitter._events[event]) if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);
                else emitter._events[event] = [
                    fn,
                    emitter._events[event]
                ];
                else emitter.on(event, fn);
            }
            function listenerCount(emitter, type) {
                return emitter.listeners(type).length;
            }
            function ReadableState(options, stream) {
                options = options || {};
                this.objectMode = !!options.objectMode;
                if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;
                var hwm = options.highWaterMark;
                var defaultHwm = this.objectMode ? 16 : 16384;
                this.highWaterMark = hwm || 0 === hwm ? hwm : defaultHwm;
                this.highWaterMark = ~~this.highWaterMark;
                this.buffer = new BufferList();
                this.length = 0;
                this.pipes = null;
                this.pipesCount = 0;
                this.flowing = null;
                this.ended = false;
                this.endEmitted = false;
                this.reading = false;
                this.sync = true;
                this.needReadable = false;
                this.emittedReadable = false;
                this.readableListening = false;
                this.resumeScheduled = false;
                this.defaultEncoding = options.defaultEncoding || 'utf8';
                this.ranOut = false;
                this.awaitDrain = 0;
                this.readingMore = false;
                this.decoder = null;
                this.encoding = null;
                if (options.encoding) {
                    this.decoder = new StringDecoder_1(options.encoding);
                    this.encoding = options.encoding;
                }
            }
            function Readable(options) {
                if (!(this instanceof Readable)) return new Readable(options);
                this._readableState = new ReadableState(options, this);
                this.readable = true;
                if (options && 'function' == typeof options.read) this._read = options.read;
                EE.call(this);
            }
            Readable.prototype.push = function(chunk, encoding) {
                var state = this._readableState;
                if (!state.objectMode && 'string' == typeof chunk) {
                    encoding = encoding || state.defaultEncoding;
                    if (encoding !== state.encoding) {
                        chunk = Buffer$1.from(chunk, encoding);
                        encoding = '';
                    }
                }
                return readableAddChunk(this, state, chunk, encoding, false);
            };
            Readable.prototype.unshift = function(chunk) {
                var state = this._readableState;
                return readableAddChunk(this, state, chunk, '', true);
            };
            Readable.prototype.isPaused = function() {
                return false === this._readableState.flowing;
            };
            function readableAddChunk(stream, state, chunk, encoding, addToFront) {
                var er = chunkInvalid(state, chunk);
                if (er) stream.emit('error', er);
                else if (null === chunk) {
                    state.reading = false;
                    onEofChunk(stream, state);
                } else if (state.objectMode || chunk && chunk.length > 0) if (state.ended && !addToFront) {
                    var e = Error('stream.push() after EOF');
                    stream.emit('error', e);
                } else if (state.endEmitted && addToFront) {
                    var _e = Error('stream.unshift() after end event');
                    stream.emit('error', _e);
                } else {
                    var skipAdd;
                    if (state.decoder && !addToFront && !encoding) {
                        chunk = state.decoder.write(chunk);
                        skipAdd = !state.objectMode && 0 === chunk.length;
                    }
                    if (!addToFront) state.reading = false;
                    if (!skipAdd) if (state.flowing && 0 === state.length && !state.sync) {
                        stream.emit('data', chunk);
                        stream.read(0);
                    } else {
                        state.length += state.objectMode ? 1 : chunk.length;
                        if (addToFront) state.buffer.unshift(chunk);
                        else state.buffer.push(chunk);
                        if (state.needReadable) emitReadable(stream);
                    }
                    maybeReadMore(stream, state);
                }
                else if (!addToFront) state.reading = false;
                return needMoreData(state);
            }
            function needMoreData(state) {
                return !state.ended && (state.needReadable || state.length < state.highWaterMark || 0 === state.length);
            }
            Readable.prototype.setEncoding = function(enc) {
                this._readableState.decoder = new StringDecoder_1(enc);
                this._readableState.encoding = enc;
                return this;
            };
            var MAX_HWM = 0x800000;
            function computeNewHighWaterMark(n) {
                if (n >= MAX_HWM) n = MAX_HWM;
                else {
                    n--;
                    n |= n >>> 1;
                    n |= n >>> 2;
                    n |= n >>> 4;
                    n |= n >>> 8;
                    n |= n >>> 16;
                    n++;
                }
                return n;
            }
            function howMuchToRead(n, state) {
                if (n <= 0 || 0 === state.length && state.ended) return 0;
                if (state.objectMode) return 1;
                if (n !== n) {
                    if (state.flowing && state.length) return state.buffer.head.data.length;
                    return state.length;
                }
                if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
                if (n <= state.length) return n;
                if (!state.ended) {
                    state.needReadable = true;
                    return 0;
                }
                return state.length;
            }
            Readable.prototype.read = function(n) {
                debug('read', n);
                n = parseInt(n, 10);
                var state = this._readableState;
                var nOrig = n;
                if (0 !== n) state.emittedReadable = false;
                if (0 === n && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
                    debug('read: emitReadable', state.length, state.ended);
                    if (0 === state.length && state.ended) endReadable(this);
                    else emitReadable(this);
                    return null;
                }
                n = howMuchToRead(n, state);
                if (0 === n && state.ended) {
                    if (0 === state.length) endReadable(this);
                    return null;
                }
                var doRead = state.needReadable;
                debug('need readable', doRead);
                if (0 === state.length || state.length - n < state.highWaterMark) {
                    doRead = true;
                    debug('length less than watermark', doRead);
                }
                if (state.ended || state.reading) {
                    doRead = false;
                    debug('reading or ended', doRead);
                } else if (doRead) {
                    debug('do read');
                    state.reading = true;
                    state.sync = true;
                    if (0 === state.length) state.needReadable = true;
                    this._read(state.highWaterMark);
                    state.sync = false;
                    if (!state.reading) n = howMuchToRead(nOrig, state);
                }
                var ret;
                ret = n > 0 ? fromList(n, state) : null;
                if (null === ret) {
                    state.needReadable = true;
                    n = 0;
                } else {
                    state.length -= n;
                }
                if (0 === state.length) {
                    if (!state.ended) state.needReadable = true;
                    if (nOrig !== n && state.ended) endReadable(this);
                }
                if (null !== ret) this.emit('data', ret);
                return ret;
            };
            function chunkInvalid(state, chunk) {
                var er = null;
                if (!Buffer$1.isBuffer(chunk) && 'string' != typeof chunk && null != chunk && !state.objectMode) er = TypeError('Invalid non-string/buffer chunk');
                return er;
            }
            function onEofChunk(stream, state) {
                if (state.ended) return;
                if (state.decoder) {
                    var chunk = state.decoder.end();
                    if (chunk && chunk.length) {
                        state.buffer.push(chunk);
                        state.length += state.objectMode ? 1 : chunk.length;
                    }
                }
                state.ended = true;
                emitReadable(stream);
            }
            function emitReadable(stream) {
                var state = stream._readableState;
                state.needReadable = false;
                if (!state.emittedReadable) {
                    debug('emitReadable', state.flowing);
                    state.emittedReadable = true;
                    if (state.sync) browser.exports.nextTick(emitReadable_, stream);
                    else emitReadable_(stream);
                }
            }
            function emitReadable_(stream) {
                debug('emit readable');
                stream.emit('readable');
                flow(stream);
            }
            function maybeReadMore(stream, state) {
                if (!state.readingMore) {
                    state.readingMore = true;
                    browser.exports.nextTick(maybeReadMore_, stream, state);
                }
            }
            function maybeReadMore_(stream, state) {
                var len = state.length;
                while(!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark){
                    debug('maybeReadMore read 0');
                    stream.read(0);
                    if (len === state.length) break;
                    len = state.length;
                }
                state.readingMore = false;
            }
            Readable.prototype._read = function(n) {
                this.emit('error', Error('not implemented'));
            };
            Readable.prototype.pipe = function(dest, pipeOpts) {
                var src = this;
                var state = this._readableState;
                switch(state.pipesCount){
                    case 0:
                        state.pipes = dest;
                        break;
                    case 1:
                        state.pipes = [
                            state.pipes,
                            dest
                        ];
                        break;
                    default:
                        state.pipes.push(dest);
                        break;
                }
                state.pipesCount += 1;
                debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
                var doEnd = !pipeOpts || false !== pipeOpts.end;
                var endFn = doEnd ? onend : cleanup;
                if (state.endEmitted) browser.exports.nextTick(endFn);
                else src.once('end', endFn);
                dest.on('unpipe', onunpipe);
                function onunpipe(readable) {
                    debug('onunpipe');
                    if (readable === src) cleanup();
                }
                function onend() {
                    debug('onend');
                    dest.end();
                }
                var ondrain = pipeOnDrain(src);
                dest.on('drain', ondrain);
                var cleanedUp = false;
                function cleanup() {
                    debug('cleanup');
                    dest.removeListener('close', onclose);
                    dest.removeListener('finish', onfinish);
                    dest.removeListener('drain', ondrain);
                    dest.removeListener('error', onerror);
                    dest.removeListener('unpipe', onunpipe);
                    src.removeListener('end', onend);
                    src.removeListener('end', cleanup);
                    src.removeListener('data', ondata);
                    cleanedUp = true;
                    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
                }
                var increasedAwaitDrain = false;
                src.on('data', ondata);
                function ondata(chunk) {
                    debug('ondata');
                    increasedAwaitDrain = false;
                    var ret = dest.write(chunk);
                    if (false === ret && !increasedAwaitDrain) {
                        if ((1 === state.pipesCount && state.pipes === dest || state.pipesCount > 1 && -1 !== indexOf(state.pipes, dest)) && !cleanedUp) {
                            debug('false write response, pause', src._readableState.awaitDrain);
                            src._readableState.awaitDrain++;
                            increasedAwaitDrain = true;
                        }
                        src.pause();
                    }
                }
                function onerror(er) {
                    debug('onerror', er);
                    unpipe();
                    dest.removeListener('error', onerror);
                    if (0 === listenerCount(dest, 'error')) dest.emit('error', er);
                }
                prependListener(dest, 'error', onerror);
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
                }
                dest.emit('pipe', src);
                if (!state.flowing) {
                    debug('pipe resume');
                    src.resume();
                }
                return dest;
            };
            function pipeOnDrain(src) {
                return function() {
                    var state = src._readableState;
                    debug('pipeOnDrain', state.awaitDrain);
                    if (state.awaitDrain) state.awaitDrain--;
                    if (0 === state.awaitDrain && src.listeners('data').length) {
                        state.flowing = true;
                        flow(src);
                    }
                };
            }
            Readable.prototype.unpipe = function(dest) {
                var state = this._readableState;
                if (0 === state.pipesCount) return this;
                if (1 === state.pipesCount) {
                    if (dest && dest !== state.pipes) return this;
                    if (!dest) dest = state.pipes;
                    state.pipes = null;
                    state.pipesCount = 0;
                    state.flowing = false;
                    if (dest) dest.emit('unpipe', this);
                    return this;
                }
                if (!dest) {
                    var dests = state.pipes;
                    var len = state.pipesCount;
                    state.pipes = null;
                    state.pipesCount = 0;
                    state.flowing = false;
                    for(var _i = 0; _i < len; _i++)dests[_i].emit('unpipe', this);
                    return this;
                }
                var i = indexOf(state.pipes, dest);
                if (-1 === i) return this;
                state.pipes.splice(i, 1);
                state.pipesCount -= 1;
                if (1 === state.pipesCount) state.pipes = state.pipes[0];
                dest.emit('unpipe', this);
                return this;
            };
            Readable.prototype.on = function(ev, fn) {
                var res = EE.prototype.on.call(this, ev, fn);
                if ('data' === ev) {
                    if (false !== this._readableState.flowing) this.resume();
                } else if ('readable' === ev) {
                    var state = this._readableState;
                    if (!state.endEmitted && !state.readableListening) {
                        state.readableListening = state.needReadable = true;
                        state.emittedReadable = false;
                        if (state.reading) {
                            if (state.length) emitReadable(this);
                        } else browser.exports.nextTick(nReadingNextTick, this);
                    }
                }
                return res;
            };
            Readable.prototype.addListener = Readable.prototype.on;
            function nReadingNextTick(self1) {
                debug('readable nexttick read 0');
                self1.read(0);
            }
            Readable.prototype.resume = function() {
                var state = this._readableState;
                if (!state.flowing) {
                    debug('resume');
                    state.flowing = true;
                    resume(this, state);
                }
                return this;
            };
            function resume(stream, state) {
                if (!state.resumeScheduled) {
                    state.resumeScheduled = true;
                    browser.exports.nextTick(resume_, stream, state);
                }
            }
            function resume_(stream, state) {
                if (!state.reading) {
                    debug('resume read 0');
                    stream.read(0);
                }
                state.resumeScheduled = false;
                state.awaitDrain = 0;
                stream.emit('resume');
                flow(stream);
                if (state.flowing && !state.reading) stream.read(0);
            }
            Readable.prototype.pause = function() {
                debug('call pause flowing=%j', this._readableState.flowing);
                if (false !== this._readableState.flowing) {
                    debug('pause');
                    this._readableState.flowing = false;
                    this.emit('pause');
                }
                return this;
            };
            function flow(stream) {
                var state = stream._readableState;
                debug('flow', state.flowing);
                while(state.flowing && null !== stream.read());
            }
            Readable.prototype.wrap = function(stream) {
                var state = this._readableState;
                var paused = false;
                var self1 = this;
                stream.on('end', function() {
                    debug('wrapped end');
                    if (state.decoder && !state.ended) {
                        var chunk = state.decoder.end();
                        if (chunk && chunk.length) self1.push(chunk);
                    }
                    self1.push(null);
                });
                stream.on('data', function(chunk) {
                    debug('wrapped data');
                    if (state.decoder) chunk = state.decoder.write(chunk);
                    if (state.objectMode && null == chunk) return;
                    if (!state.objectMode && (!chunk || !chunk.length)) return;
                    var ret = self1.push(chunk);
                    if (!ret) {
                        paused = true;
                        stream.pause();
                    }
                });
                for(var i in stream)if (void 0 === this[i] && 'function' == typeof stream[i]) this[i] = function(method) {
                    return function() {
                        return stream[method].apply(stream, arguments);
                    };
                }(i);
                var events = [
                    'error',
                    'close',
                    'destroy',
                    'pause',
                    'resume'
                ];
                forEach(events, function(ev) {
                    stream.on(ev, self1.emit.bind(self1, ev));
                });
                self1._read = function(n) {
                    debug('wrapped _read', n);
                    if (paused) {
                        paused = false;
                        stream.resume();
                    }
                };
                return self1;
            };
            Readable._fromList = fromList;
            function fromList(n, state) {
                if (0 === state.length) return null;
                var ret;
                if (state.objectMode) ret = state.buffer.shift();
                else if (!n || n >= state.length) {
                    ret = state.decoder ? state.buffer.join('') : 1 === state.buffer.length ? state.buffer.head.data : state.buffer.concat(state.length);
                    state.buffer.clear();
                } else {
                    ret = fromListPartial(n, state.buffer, state.decoder);
                }
                return ret;
            }
            function fromListPartial(n, list, hasStrings) {
                var ret;
                if (n < list.head.data.length) {
                    ret = list.head.data.slice(0, n);
                    list.head.data = list.head.data.slice(n);
                } else ret = n === list.head.data.length ? list.shift() : hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
                return ret;
            }
            function copyFromBufferString(n, list) {
                var p = list.head;
                var c = 1;
                var ret = p.data;
                n -= ret.length;
                while(p = p.next){
                    var str = p.data;
                    var nb = n > str.length ? str.length : n;
                    if (nb === str.length) ret += str;
                    else ret += str.slice(0, n);
                    n -= nb;
                    if (0 === n) {
                        if (nb === str.length) {
                            ++c;
                            if (p.next) list.head = p.next;
                            else list.head = list.tail = null;
                        } else {
                            list.head = p;
                            p.data = str.slice(nb);
                        }
                        break;
                    }
                    ++c;
                }
                list.length -= c;
                return ret;
            }
            function copyFromBuffer(n, list) {
                var ret = Buffer$1.allocUnsafe(n);
                var p = list.head;
                var c = 1;
                p.data.copy(ret);
                n -= p.data.length;
                while(p = p.next){
                    var buf = p.data;
                    var nb = n > buf.length ? buf.length : n;
                    buf.copy(ret, ret.length - n, 0, nb);
                    n -= nb;
                    if (0 === n) {
                        if (nb === buf.length) {
                            ++c;
                            if (p.next) list.head = p.next;
                            else list.head = list.tail = null;
                        } else {
                            list.head = p;
                            p.data = buf.slice(nb);
                        }
                        break;
                    }
                    ++c;
                }
                list.length -= c;
                return ret;
            }
            function endReadable(stream) {
                var state = stream._readableState;
                if (state.length > 0) throw Error('"endReadable()" called on non-empty stream');
                if (!state.endEmitted) {
                    state.ended = true;
                    browser.exports.nextTick(endReadableNT, state, stream);
                }
            }
            function endReadableNT(state, stream) {
                if (!state.endEmitted && 0 === state.length) {
                    state.endEmitted = true;
                    stream.readable = false;
                    stream.emit('end');
                }
            }
            function forEach(xs, f) {
                for(var i = 0, l = xs.length; i < l; i++)f(xs[i], i);
            }
            function indexOf(xs, x) {
                for(var i = 0, l = xs.length; i < l; i++)if (xs[i] === x) return i;
                return -1;
            }
            Writable.WritableState = WritableState;
            util$1.inherits(Writable, events.exports.EventEmitter);
            function nop() {}
            function WriteReq(chunk, encoding, cb) {
                this.chunk = chunk;
                this.encoding = encoding;
                this.callback = cb;
                this.next = null;
            }
            function WritableState(options, stream) {
                Object.defineProperty(this, 'buffer', {
                    get: util$1.deprecate(function() {
                        return this.getBuffer();
                    }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.")
                });
                options = options || {};
                this.objectMode = !!options.objectMode;
                if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;
                var hwm = options.highWaterMark;
                var defaultHwm = this.objectMode ? 16 : 16384;
                this.highWaterMark = hwm || 0 === hwm ? hwm : defaultHwm;
                this.highWaterMark = ~~this.highWaterMark;
                this.needDrain = false;
                this.ending = false;
                this.ended = false;
                this.finished = false;
                var noDecode = false === options.decodeStrings;
                this.decodeStrings = !noDecode;
                this.defaultEncoding = options.defaultEncoding || 'utf8';
                this.length = 0;
                this.writing = false;
                this.corked = 0;
                this.sync = true;
                this.bufferProcessing = false;
                this.onwrite = function(er) {
                    onwrite(stream, er);
                };
                this.writecb = null;
                this.writelen = 0;
                this.bufferedRequest = null;
                this.lastBufferedRequest = null;
                this.pendingcb = 0;
                this.prefinished = false;
                this.errorEmitted = false;
                this.bufferedRequestCount = 0;
                this.corkedRequestsFree = new CorkedRequest(this);
            }
            WritableState.prototype.getBuffer = function writableStateGetBuffer() {
                var current = this.bufferedRequest;
                var out = [];
                while(current){
                    out.push(current);
                    current = current.next;
                }
                return out;
            };
            function Writable(options) {
                if (!(this instanceof Writable) && !(this instanceof Duplex)) return new Writable(options);
                this._writableState = new WritableState(options, this);
                this.writable = true;
                if (options) {
                    if ('function' == typeof options.write) this._write = options.write;
                    if ('function' == typeof options.writev) this._writev = options.writev;
                }
                events.exports.EventEmitter.call(this);
            }
            Writable.prototype.pipe = function() {
                this.emit('error', Error('Cannot pipe, not readable'));
            };
            function writeAfterEnd(stream, cb) {
                var er = Error('write after end');
                stream.emit('error', er);
                browser.exports.nextTick(cb, er);
            }
            function validChunk(stream, state, chunk, cb) {
                var valid = true;
                var er = false;
                if (null === chunk) er = TypeError('May not write null values to stream');
                else if (!buffer.Buffer.isBuffer(chunk) && 'string' != typeof chunk && void 0 !== chunk && !state.objectMode) er = TypeError('Invalid non-string/buffer chunk');
                if (er) {
                    stream.emit('error', er);
                    browser.exports.nextTick(cb, er);
                    valid = false;
                }
                return valid;
            }
            Writable.prototype.write = function(chunk, encoding, cb) {
                var state = this._writableState;
                var ret = false;
                if ('function' == typeof encoding) {
                    cb = encoding;
                    encoding = null;
                }
                if (buffer.Buffer.isBuffer(chunk)) encoding = 'buffer';
                else if (!encoding) encoding = state.defaultEncoding;
                if ('function' != typeof cb) cb = nop;
                if (state.ended) writeAfterEnd(this, cb);
                else if (validChunk(this, state, chunk, cb)) {
                    state.pendingcb++;
                    ret = writeOrBuffer(this, state, chunk, encoding, cb);
                }
                return ret;
            };
            Writable.prototype.cork = function() {
                var state = this._writableState;
                state.corked++;
            };
            Writable.prototype.uncork = function() {
                var state = this._writableState;
                if (state.corked) {
                    state.corked--;
                    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
                }
            };
            Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
                if ('string' == typeof encoding) encoding = encoding.toLowerCase();
                if (!([
                    'hex',
                    'utf8',
                    'utf-8',
                    'ascii',
                    'binary',
                    'base64',
                    'ucs2',
                    'ucs-2',
                    'utf16le',
                    'utf-16le',
                    'raw'
                ].indexOf((encoding + '').toLowerCase()) > -1)) throw TypeError('Unknown encoding: ' + encoding);
                this._writableState.defaultEncoding = encoding;
                return this;
            };
            function decodeChunk(state, chunk, encoding) {
                if (!state.objectMode && false !== state.decodeStrings && 'string' == typeof chunk) chunk = buffer.Buffer.from(chunk, encoding);
                return chunk;
            }
            function writeOrBuffer(stream, state, chunk, encoding, cb) {
                chunk = decodeChunk(state, chunk, encoding);
                if (buffer.Buffer.isBuffer(chunk)) encoding = 'buffer';
                var len = state.objectMode ? 1 : chunk.length;
                state.length += len;
                var ret = state.length < state.highWaterMark;
                if (!ret) state.needDrain = true;
                if (state.writing || state.corked) {
                    var last = state.lastBufferedRequest;
                    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
                    if (last) last.next = state.lastBufferedRequest;
                    else state.bufferedRequest = state.lastBufferedRequest;
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
                if (writev) stream._writev(chunk, state.onwrite);
                else stream._write(chunk, encoding, state.onwrite);
                state.sync = false;
            }
            function onwriteError(stream, state, sync, er, cb) {
                --state.pendingcb;
                if (sync) browser.exports.nextTick(cb, er);
                else cb(er);
                stream._writableState.errorEmitted = true;
                stream.emit('error', er);
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
                onwriteStateUpdate(state);
                if (er) onwriteError(stream, state, sync, er, cb);
                else {
                    var finished = needFinish(state);
                    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(stream, state);
                    if (sync) browser.exports.nextTick(afterWrite, stream, state, finished, cb);
                    else afterWrite(stream, state, finished, cb);
                }
            }
            function afterWrite(stream, state, finished, cb) {
                if (!finished) onwriteDrain(stream, state);
                state.pendingcb--;
                cb();
                finishMaybe(stream, state);
            }
            function onwriteDrain(stream, state) {
                if (0 === state.length && state.needDrain) {
                    state.needDrain = false;
                    stream.emit('drain');
                }
            }
            function clearBuffer(stream, state) {
                state.bufferProcessing = true;
                var entry = state.bufferedRequest;
                if (stream._writev && entry && entry.next) {
                    var l = state.bufferedRequestCount;
                    var buffer = Array(l);
                    var holder = state.corkedRequestsFree;
                    holder.entry = entry;
                    var count = 0;
                    while(entry){
                        buffer[count] = entry;
                        entry = entry.next;
                        count += 1;
                    }
                    doWrite(stream, state, true, state.length, buffer, '', holder.finish);
                    state.pendingcb++;
                    state.lastBufferedRequest = null;
                    if (holder.next) {
                        state.corkedRequestsFree = holder.next;
                        holder.next = null;
                    } else {
                        state.corkedRequestsFree = new CorkedRequest(state);
                    }
                } else {
                    while(entry){
                        var chunk = entry.chunk;
                        var encoding = entry.encoding;
                        var cb = entry.callback;
                        var len = state.objectMode ? 1 : chunk.length;
                        doWrite(stream, state, false, len, chunk, encoding, cb);
                        entry = entry.next;
                        if (state.writing) {
                            break;
                        }
                    }
                    if (null === entry) state.lastBufferedRequest = null;
                }
                state.bufferedRequestCount = 0;
                state.bufferedRequest = entry;
                state.bufferProcessing = false;
            }
            Writable.prototype._write = function(chunk, encoding, cb) {
                cb(Error('not implemented'));
            };
            Writable.prototype._writev = null;
            Writable.prototype.end = function(chunk, encoding, cb) {
                var state = this._writableState;
                if ('function' == typeof chunk) {
                    cb = chunk;
                    chunk = null;
                    encoding = null;
                } else if ('function' == typeof encoding) {
                    cb = encoding;
                    encoding = null;
                }
                if (null != chunk) this.write(chunk, encoding);
                if (state.corked) {
                    state.corked = 1;
                    this.uncork();
                }
                if (!state.ending && !state.finished) endWritable(this, state, cb);
            };
            function needFinish(state) {
                return state.ending && 0 === state.length && null === state.bufferedRequest && !state.finished && !state.writing;
            }
            function prefinish(stream, state) {
                if (!state.prefinished) {
                    state.prefinished = true;
                    stream.emit('prefinish');
                }
            }
            function finishMaybe(stream, state) {
                var need = needFinish(state);
                if (need) if (0 === state.pendingcb) {
                    prefinish(stream, state);
                    state.finished = true;
                    stream.emit('finish');
                } else {
                    prefinish(stream, state);
                }
                return need;
            }
            function endWritable(stream, state, cb) {
                state.ending = true;
                finishMaybe(stream, state);
                if (cb) if (state.finished) browser.exports.nextTick(cb);
                else stream.once('finish', cb);
                state.ended = true;
                stream.writable = false;
            }
            function CorkedRequest(state) {
                var _this = this;
                this.next = null;
                this.entry = null;
                this.finish = function(err) {
                    var entry = _this.entry;
                    _this.entry = null;
                    while(entry){
                        var cb = entry.callback;
                        state.pendingcb--;
                        cb(err);
                        entry = entry.next;
                    }
                    if (state.corkedRequestsFree) state.corkedRequestsFree.next = _this;
                    else state.corkedRequestsFree = _this;
                };
            }
            util$1.inherits(Duplex, Readable);
            var keys$1 = Object.keys(Writable.prototype);
            for(var v = 0; v < keys$1.length; v++){
                var method = keys$1[v];
                if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
            }
            function Duplex(options) {
                if (!(this instanceof Duplex)) return new Duplex(options);
                Readable.call(this, options);
                Writable.call(this, options);
                if (options && false === options.readable) this.readable = false;
                if (options && false === options.writable) this.writable = false;
                this.allowHalfOpen = true;
                if (options && false === options.allowHalfOpen) this.allowHalfOpen = false;
                this.once('end', onend);
            }
            function onend() {
                if (this.allowHalfOpen || this._writableState.ended) return;
                browser.exports.nextTick(onEndNT, this);
            }
            function onEndNT(self1) {
                self1.end();
            }
            util$1.inherits(Transform, Duplex);
            function TransformState(stream) {
                this.afterTransform = function(er, data) {
                    return afterTransform(stream, er, data);
                };
                this.needTransform = false;
                this.transforming = false;
                this.writecb = null;
                this.writechunk = null;
                this.writeencoding = null;
            }
            function afterTransform(stream, er, data) {
                var ts = stream._transformState;
                ts.transforming = false;
                var cb = ts.writecb;
                if (!cb) return stream.emit('error', Error('no writecb in Transform class'));
                ts.writechunk = null;
                ts.writecb = null;
                if (null != data) stream.push(data);
                cb(er);
                var rs = stream._readableState;
                rs.reading = false;
                if (rs.needReadable || rs.length < rs.highWaterMark) stream._read(rs.highWaterMark);
            }
            function Transform(options) {
                if (!(this instanceof Transform)) return new Transform(options);
                Duplex.call(this, options);
                this._transformState = new TransformState(this);
                var stream = this;
                this._readableState.needReadable = true;
                this._readableState.sync = false;
                if (options) {
                    if ('function' == typeof options.transform) this._transform = options.transform;
                    if ('function' == typeof options.flush) this._flush = options.flush;
                }
                this.once('prefinish', function() {
                    if ('function' == typeof this._flush) this._flush(function(er) {
                        done(stream, er);
                    });
                    else done(stream);
                });
            }
            Transform.prototype.push = function(chunk, encoding) {
                this._transformState.needTransform = false;
                return Duplex.prototype.push.call(this, chunk, encoding);
            };
            Transform.prototype._transform = function(chunk, encoding, cb) {
                throw Error('Not implemented');
            };
            Transform.prototype._write = function(chunk, encoding, cb) {
                var ts = this._transformState;
                ts.writecb = cb;
                ts.writechunk = chunk;
                ts.writeencoding = encoding;
                if (!ts.transforming) {
                    var rs = this._readableState;
                    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
                }
            };
            Transform.prototype._read = function(n) {
                var ts = this._transformState;
                if (null !== ts.writechunk && ts.writecb && !ts.transforming) {
                    ts.transforming = true;
                    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
                } else {
                    ts.needTransform = true;
                }
            };
            function done(stream, er) {
                if (er) return stream.emit('error', er);
                var ws = stream._writableState;
                var ts = stream._transformState;
                if (ws.length) throw Error('Calling transform done when ws.length != 0');
                if (ts.transforming) throw Error('Calling transform done when still transforming');
                return stream.push(null);
            }
            util$1.inherits(PassThrough, Transform);
            function PassThrough(options) {
                if (!(this instanceof PassThrough)) return new PassThrough(options);
                Transform.call(this, options);
            }
            PassThrough.prototype._transform = function(chunk, encoding, cb) {
                cb(null, chunk);
            };
            util$1.inherits(Stream, EE);
            Stream.Readable = Readable;
            Stream.Writable = Writable;
            Stream.Duplex = Duplex;
            Stream.Transform = Transform;
            Stream.PassThrough = PassThrough;
            Stream.Stream = Stream;
            function Stream() {
                EE.call(this);
            }
            Stream.prototype.pipe = function(dest, options) {
                var source = this;
                function ondata(chunk) {
                    if (dest.writable) {
                        if (false === dest.write(chunk) && source.pause) source.pause();
                    }
                }
                source.on('data', ondata);
                function ondrain() {
                    if (source.readable && source.resume) source.resume();
                }
                dest.on('drain', ondrain);
                if (!dest._isStdio && (!options || false !== options.end)) {
                    source.on('end', onend);
                    source.on('close', onclose);
                }
                var didOnEnd = false;
                function onend() {
                    if (didOnEnd) return;
                    didOnEnd = true;
                    dest.end();
                }
                function onclose() {
                    if (didOnEnd) return;
                    didOnEnd = true;
                    if ('function' == typeof dest.destroy) dest.destroy();
                }
                function onerror(er) {
                    cleanup();
                    if (0 === EE.listenerCount(this, 'error')) {
                        throw er;
                    }
                }
                source.on('error', onerror);
                dest.on('error', onerror);
                function cleanup() {
                    source.removeListener('data', ondata);
                    dest.removeListener('drain', ondrain);
                    source.removeListener('end', onend);
                    source.removeListener('close', onclose);
                    source.removeListener('error', onerror);
                    dest.removeListener('error', onerror);
                    source.removeListener('end', cleanup);
                    source.removeListener('close', cleanup);
                    dest.removeListener('close', cleanup);
                }
                source.on('end', cleanup);
                source.on('close', cleanup);
                dest.on('close', cleanup);
                dest.emit('pipe', source);
                return dest;
            };
            var _polyfillNode_stream = Object.freeze({
                __proto__: null,
                default: Stream,
                Readable: Readable,
                Writable: Writable,
                Duplex: Duplex,
                Transform: Transform,
                PassThrough: PassThrough,
                Stream: Stream
            });
            var require$$1 = getAugmentedNamespace(_polyfillNode_stream);
            var binding = {};
            var assert$2 = {
                exports: {}
            };
            var errors = {};
            function _typeof$3(obj) {
                _typeof$3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function _typeof(obj) {
                    return typeof obj;
                } : function _typeof(obj) {
                    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                };
                return _typeof$3(obj);
            }
            function _classCallCheck$2(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw TypeError("Cannot call a class as a function");
                }
            }
            function _possibleConstructorReturn$1(self1, call) {
                if (call && ("object" === _typeof$3(call) || "function" == typeof call)) {
                    return call;
                }
                return _assertThisInitialized$1(self1);
            }
            function _assertThisInitialized$1(self1) {
                if (void 0 === self1) {
                    throw ReferenceError("this hasn't been initialised - super() hasn't been called");
                }
                return self1;
            }
            function _getPrototypeOf$1(o) {
                _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
                    return o.__proto__ || Object.getPrototypeOf(o);
                };
                return _getPrototypeOf$1(o);
            }
            function _inherits$1(subClass, superClass) {
                if ("function" != typeof superClass && null !== superClass) {
                    throw TypeError("Super expression must either be null or a function");
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
            var codes = {};
            var assert$1;
            var util;
            function createErrorType(code, message, Base) {
                if (!Base) Base = Error;
                function getMessage(arg1, arg2, arg3) {
                    if ('string' == typeof message) {
                        return message;
                    }
                    return message(arg1, arg2, arg3);
                }
                var NodeError = function(_Base) {
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
            }
            function oneOf(expected, thing) {
                if (Array.isArray(expected)) {
                    var len = expected.length;
                    expected = expected.map(function(i) {
                        return String(i);
                    });
                    if (len > 2) {
                        return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(', '), ", or ") + expected[len - 1];
                    }
                    if (2 === len) {
                        return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
                    }
                    return "of ".concat(thing, " ").concat(expected[0]);
                }
                return "of ".concat(thing, " ").concat(String(expected));
            }
            function startsWith(str, search, pos) {
                return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
            }
            function endsWith$1(str, search, this_len) {
                if (void 0 === this_len || this_len > str.length) this_len = str.length;
                return str.substring(this_len - search.length, this_len) === search;
            }
            function includes(str, search, start) {
                if ('number' != typeof start) start = 0;
                if (start + search.length > str.length) {
                    return false;
                }
                return -1 !== str.indexOf(search, start);
            }
            createErrorType('ERR_AMBIGUOUS_ARGUMENT', 'The "%s" argument is ambiguous. %s', TypeError);
            createErrorType('ERR_INVALID_ARG_TYPE', function(name, expected, actual) {
                if (void 0 === assert$1) assert$1 = assert$2.exports;
                assert$1('string' == typeof name, "'name' must be a string");
                var determiner;
                if ('string' == typeof expected && startsWith(expected, 'not ')) {
                    determiner = 'must not be';
                    expected = expected.replace(/^not /, '');
                } else {
                    determiner = 'must be';
                }
                var msg;
                if (endsWith$1(name, ' argument')) msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
                else {
                    var type = includes(name, '.') ? 'property' : 'argument';
                    msg = "The \"".concat(name, "\" ").concat(type, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
                }
                msg += ". Received type ".concat(_typeof$3(actual));
                return msg;
            }, TypeError);
            createErrorType('ERR_INVALID_ARG_VALUE', function(name, value) {
                var reason = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 'is invalid';
                if (void 0 === util) util = util$1;
                var inspected = util.inspect(value);
                if (inspected.length > 128) inspected = "".concat(inspected.slice(0, 128), "...");
                return "The argument '".concat(name, "' ").concat(reason, ". Received ").concat(inspected);
            }, TypeError);
            createErrorType('ERR_INVALID_RETURN_VALUE', function(input, name, value) {
                var type;
                type = value && value.constructor && value.constructor.name ? "instance of ".concat(value.constructor.name) : "type ".concat(_typeof$3(value));
                return "Expected ".concat(input, " to be returned from the \"").concat(name, "\"") + " function but got ".concat(type, ".");
            }, TypeError);
            createErrorType('ERR_MISSING_ARGS', function() {
                for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                if (void 0 === assert$1) assert$1 = assert$2.exports;
                assert$1(args.length > 0, 'At least one arg needs to be specified');
                var msg = 'The ';
                var len = args.length;
                args = args.map(function(a) {
                    return "\"".concat(a, "\"");
                });
                switch(len){
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
                for(var i = 1; i < arguments.length; i++){
                    var source = null != arguments[i] ? arguments[i] : {};
                    var ownKeys = Object.keys(source);
                    if ('function' == typeof Object.getOwnPropertySymbols) ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
                    }));
                    ownKeys.forEach(function(key) {
                        _defineProperty(target, key, source[key]);
                    });
                }
                return target;
            }
            function _defineProperty(obj, key, value) {
                if (key in obj) Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: true,
                    configurable: true,
                    writable: true
                });
                else obj[key] = value;
                return obj;
            }
            function _classCallCheck$1(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw TypeError("Cannot call a class as a function");
                }
            }
            function _defineProperties(target, props) {
                for(var i = 0; i < props.length; i++){
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
                return Constructor;
            }
            function _possibleConstructorReturn(self1, call) {
                if (call && ("object" === _typeof$2(call) || "function" == typeof call)) {
                    return call;
                }
                return _assertThisInitialized(self1);
            }
            function _assertThisInitialized(self1) {
                if (void 0 === self1) {
                    throw ReferenceError("this hasn't been initialised - super() hasn't been called");
                }
                return self1;
            }
            function _inherits(subClass, superClass) {
                if ("function" != typeof superClass && null !== superClass) {
                    throw TypeError("Super expression must either be null or a function");
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
                var _cache = "function" == typeof Map ? new Map() : void 0;
                _wrapNativeSuper = function _wrapNativeSuper(Class) {
                    if (null === Class || !_isNativeFunction(Class)) return Class;
                    if ("function" != typeof Class) {
                        throw TypeError("Super expression must either be null or a function");
                    }
                    if (void 0 !== _cache) {
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
                if ("undefined" == typeof Reflect || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if ("function" == typeof Proxy) return true;
                try {
                    Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
                    return true;
                } catch (e) {
                    return false;
                }
            }
            function _construct(Parent, args, Class) {
                _construct = isNativeReflectConstruct() ? Reflect.construct : function _construct(Parent, args, Class) {
                    var a = [
                        null
                    ];
                    a.push.apply(a, args);
                    var Constructor = Function.bind.apply(Parent, a);
                    var instance = new Constructor();
                    if (Class) _setPrototypeOf(instance, Class.prototype);
                    return instance;
                };
                return _construct.apply(null, arguments);
            }
            function _isNativeFunction(fn) {
                return -1 !== Function.toString.call(fn).indexOf("[native code]");
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
                _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function _typeof(obj) {
                    return typeof obj;
                } : function _typeof(obj) {
                    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                };
                return _typeof$2(obj);
            }
            var _require$1 = util$1, inspect$1 = _require$1.inspect;
            var _require2$1 = errors, ERR_INVALID_ARG_TYPE$1 = _require2$1.codes.ERR_INVALID_ARG_TYPE;
            function endsWith(str, search, this_len) {
                if (void 0 === this_len || this_len > str.length) this_len = str.length;
                return str.substring(this_len - search.length, this_len) === search;
            }
            function repeat(str, count) {
                count = Math.floor(count);
                if (0 == str.length || 0 == count) return '';
                var maxCount = str.length * count;
                count = Math.floor(Math.log(count) / Math.log(2));
                while(count){
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
            };
            var kMaxShortLength = 10;
            function copyError(source) {
                var keys = Object.keys(source);
                var target = Object.create(Object.getPrototypeOf(source));
                keys.forEach(function(key) {
                    target[key] = source[key];
                });
                Object.defineProperty(target, 'message', {
                    value: source.message
                });
                return target;
            }
            function inspectValue(val) {
                return inspect$1(val, {
                    compact: false,
                    customInspect: false,
                    depth: 1000,
                    maxArrayLength: 1 / 0,
                    showHidden: false,
                    breakLength: 1 / 0,
                    showProxy: false,
                    sorted: true,
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
                var indicator = '';
                if ('strictEqual' === operator && 'object' === _typeof$2(actual) && 'object' === _typeof$2(expected) && null !== actual && null !== expected) operator = 'strictEqualObject';
                if (1 === actualLines.length && 1 === expectedLines.length && actualLines[0] !== expectedLines[0]) {
                    var inputLength = actualLines[0].length + expectedLines[0].length;
                    if (inputLength <= kMaxShortLength) {
                        if (('object' !== _typeof$2(actual) || null === actual) && ('object' !== _typeof$2(expected) || null === expected) && (0 !== actual || 0 !== expected)) {
                            return "".concat(kReadableOperator[operator], "\n\n") + "".concat(actualLines[0], " !== ").concat(expectedLines[0], "\n");
                        }
                    } else if ('strictEqualObject' !== operator) {
                        var maxLength = 80;
                        if (inputLength < maxLength) {
                            while(actualLines[0][i] === expectedLines[0][i]){
                                i++;
                            }
                            if (i > 2) {
                                indicator = "\n  ".concat(repeat(' ', i), "^");
                                i = 0;
                            }
                        }
                    }
                }
                var a = actualLines[actualLines.length - 1];
                var b = expectedLines[expectedLines.length - 1];
                while(a === b){
                    if (i++ < 2) end = "\n  ".concat(a).concat(end);
                    else other = a;
                    actualLines.pop();
                    expectedLines.pop();
                    if (0 === actualLines.length || 0 === expectedLines.length) break;
                    a = actualLines[actualLines.length - 1];
                    b = expectedLines[expectedLines.length - 1];
                }
                var maxLines = Math.max(actualLines.length, expectedLines.length);
                if (0 === maxLines) {
                    var _actualLines = actualInspected.split('\n');
                    if (_actualLines.length > 30) {
                        _actualLines[26] = "".concat(blue, "...").concat(white);
                        while(_actualLines.length > 27){
                            _actualLines.pop();
                        }
                    }
                    return "".concat(kReadableOperator.notIdentical, "\n\n").concat(_actualLines.join('\n'), "\n");
                }
                if (i > 3) {
                    end = "\n".concat(blue, "...").concat(white).concat(end);
                    skipped = true;
                }
                if ('' !== other) {
                    end = "\n  ".concat(other).concat(end);
                    other = '';
                }
                var printedLines = 0;
                var msg = kReadableOperator[operator] + "\n".concat(green, "+ actual").concat(white, " ").concat(red, "- expected").concat(white);
                var skippedMsg = " ".concat(blue, "...").concat(white, " Lines skipped");
                for(i = 0; i < maxLines; i++){
                    var cur = i - lastPos;
                    if (actualLines.length < i + 1) {
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
                        }
                        lastPos = i;
                        other += "\n".concat(red, "-").concat(white, " ").concat(expectedLines[i]);
                        printedLines++;
                    } else if (expectedLines.length < i + 1) {
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
                        }
                        lastPos = i;
                        res += "\n".concat(green, "+").concat(white, " ").concat(actualLines[i]);
                        printedLines++;
                    } else {
                        var expectedLine = expectedLines[i];
                        var actualLine = actualLines[i];
                        var divergingLines = actualLine !== expectedLine && (!endsWith(actualLine, ',') || actualLine.slice(0, -1) !== expectedLine);
                        if (divergingLines && endsWith(expectedLine, ',') && expectedLine.slice(0, -1) === actualLine) {
                            divergingLines = false;
                            actualLine += ',';
                        }
                        if (divergingLines) {
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
                            }
                            lastPos = i;
                            res += "\n".concat(green, "+").concat(white, " ").concat(actualLine);
                            other += "\n".concat(red, "-").concat(white, " ").concat(expectedLine);
                            printedLines += 2;
                        } else {
                            res += other;
                            other = '';
                            if (1 === cur || 0 === i) {
                                res += "\n  ".concat(actualLine);
                                printedLines++;
                            }
                        }
                    }
                    if (printedLines > 20 && i < maxLines - 2) {
                        return "".concat(msg).concat(skippedMsg, "\n").concat(res, "\n").concat(blue, "...").concat(white).concat(other, "\n") + "".concat(blue, "...").concat(white);
                    }
                }
                return "".concat(msg).concat(skipped ? skippedMsg : '', "\n").concat(res).concat(other).concat(end).concat(indicator);
            }
            var AssertionError$1 = function(_Error) {
                _inherits(AssertionError, _Error);
                function AssertionError(options) {
                    var _this;
                    _classCallCheck$1(this, AssertionError);
                    if ('object' !== _typeof$2(options) || null === options) {
                        throw new ERR_INVALID_ARG_TYPE$1('options', 'Object', options);
                    }
                    var message = options.message, operator = options.operator, stackStartFn = options.stackStartFn;
                    var actual = options.actual, expected = options.expected;
                    var limit = Error.stackTraceLimit;
                    Error.stackTraceLimit = 0;
                    if (null != message) _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, String(message)));
                    else {
                        if ('object' === _typeof$2(actual) && null !== actual && 'object' === _typeof$2(expected) && null !== expected && 'stack' in actual && actual instanceof Error && 'stack' in expected && expected instanceof Error) {
                            actual = copyError(actual);
                            expected = copyError(expected);
                        }
                        if ('deepStrictEqual' === operator || 'strictEqual' === operator) _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, createErrDiff(actual, expected, operator)));
                        else if ('notDeepStrictEqual' === operator || 'notStrictEqual' === operator) {
                            var base = kReadableOperator[operator];
                            var res = inspectValue(actual).split('\n');
                            if ('notStrictEqual' === operator && 'object' === _typeof$2(actual) && null !== actual) base = kReadableOperator.notStrictEqualObject;
                            if (res.length > 30) {
                                res[26] = "".concat(blue, "...").concat(white);
                                while(res.length > 27){
                                    res.pop();
                                }
                            }
                            _this = 1 === res.length ? _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, "".concat(base, " ").concat(res[0]))) : _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, "".concat(base, "\n\n").concat(res.join('\n'), "\n")));
                        } else {
                            var _res = inspectValue(actual);
                            var other = '';
                            var knownOperators = kReadableOperator[operator];
                            if ('notDeepEqual' === operator || 'notEqual' === operator) {
                                _res = "".concat(kReadableOperator[operator], "\n\n").concat(_res);
                                if (_res.length > 1024) _res = "".concat(_res.slice(0, 1021), "...");
                            } else {
                                other = "".concat(inspectValue(expected));
                                if (_res.length > 512) _res = "".concat(_res.slice(0, 509), "...");
                                if (other.length > 512) other = "".concat(other.slice(0, 509), "...");
                                if ('deepEqual' === operator || 'equal' === operator) _res = "".concat(knownOperators, "\n\n").concat(_res, "\n\nshould equal\n\n");
                                else other = " ".concat(operator, " ").concat(other);
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
                    if (Error.captureStackTrace) Error.captureStackTrace(_assertThisInitialized(_this), stackStartFn);
                    _this.stack;
                    _this.name = 'AssertionError';
                    return _possibleConstructorReturn(_this);
                }
                _createClass(AssertionError, [
                    {
                        key: "toString",
                        value: function toString() {
                            return "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message);
                        }
                    },
                    {
                        key: inspect$1.custom,
                        value: function value(recurseTimes, ctx) {
                            return inspect$1(this, _objectSpread({}, ctx, {
                                customInspect: false,
                                depth: 0
                            }));
                        }
                    }
                ]);
                return AssertionError;
            }(_wrapNativeSuper(Error));
            var assertion_error = AssertionError$1;
            function assign(target, firstSource) {
                if (null == target) {
                    throw TypeError('Cannot convert first argument to object');
                }
                var to = Object(target);
                for(var i = 1; i < arguments.length; i++){
                    var nextSource = arguments[i];
                    if (null == nextSource) {
                        continue;
                    }
                    var keysArray = Object.keys(Object(nextSource));
                    for(var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++){
                        var nextKey = keysArray[nextIndex];
                        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                        if (void 0 !== desc && desc.enumerable) to[nextKey] = nextSource[nextKey];
                    }
                }
                return to;
            }
            function polyfill$4() {
                if (!Object.assign) Object.defineProperty(Object, 'assign', {
                    enumerable: false,
                    configurable: true,
                    writable: true,
                    value: assign
                });
            }
            var es6ObjectAssign = {
                assign: assign,
                polyfill: polyfill$4
            };
            var toStr$2 = Object.prototype.toString;
            var isArguments = function isArguments(value) {
                var str = toStr$2.call(value);
                var isArgs = '[object Arguments]' === str;
                if (!isArgs) isArgs = '[object Array]' !== str && null !== value && 'object' == typeof value && 'number' == typeof value.length && value.length >= 0 && '[object Function]' === toStr$2.call(value.callee);
                return isArgs;
            };
            var keysShim$1;
            if (!Object.keys) {
                var has = Object.prototype.hasOwnProperty;
                var toStr$1 = Object.prototype.toString;
                var isArgs$1 = isArguments;
                var isEnumerable = Object.prototype.propertyIsEnumerable;
                var hasDontEnumBug = !isEnumerable.call({
                    toString: null
                }, 'toString');
                var hasProtoEnumBug = isEnumerable.call(function() {}, 'prototype');
                var dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ];
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
                var hasAutomationEqualityBug = function() {
                    if ('undefined' == typeof window) {
                        return false;
                    }
                    for(var k in window){
                        try {
                            if (!excludedKeys['$' + k] && has.call(window, k) && null !== window[k] && 'object' == typeof window[k]) {
                                try {
                                    equalsConstructorPrototype(window[k]);
                                } catch (e) {
                                    return true;
                                }
                            }
                        } catch (e1) {
                            return true;
                        }
                    }
                    return false;
                }();
                var equalsConstructorPrototypeIfNotBuggy = function equalsConstructorPrototypeIfNotBuggy(o) {
                    if ('undefined' == typeof window || !hasAutomationEqualityBug) {
                        return equalsConstructorPrototype(o);
                    }
                    try {
                        return equalsConstructorPrototype(o);
                    } catch (e) {
                        return false;
                    }
                };
                keysShim$1 = function keys(object) {
                    var isObject = null !== object && 'object' == typeof object;
                    var isFunction = '[object Function]' === toStr$1.call(object);
                    var isArguments = isArgs$1(object);
                    var isString = isObject && '[object String]' === toStr$1.call(object);
                    var theKeys = [];
                    if (!isObject && !isFunction && !isArguments) {
                        throw TypeError('Object.keys called on a non-object');
                    }
                    var skipProto = hasProtoEnumBug && isFunction;
                    if (isString && object.length > 0 && !has.call(object, 0)) {
                        for(var i = 0; i < object.length; ++i)theKeys.push(String(i));
                    }
                    if (isArguments && object.length > 0) {
                        for(var j = 0; j < object.length; ++j)theKeys.push(String(j));
                    } else {
                        for(var name in object)if (!(skipProto && 'prototype' === name) && has.call(object, name)) theKeys.push(String(name));
                    }
                    if (hasDontEnumBug) {
                        var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
                        for(var k = 0; k < dontEnums.length; ++k)if (!(skipConstructor && 'constructor' === dontEnums[k]) && has.call(object, dontEnums[k])) theKeys.push(dontEnums[k]);
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
                    var keysWorksWithArguments = function() {
                        var args = Object.keys(arguments);
                        return args && args.length === arguments.length;
                    }(1, 2);
                    if (!keysWorksWithArguments) Object.keys = function keys(object) {
                        if (isArgs(object)) {
                            return originalKeys(slice.call(object));
                        }
                        return originalKeys(object);
                    };
                } else {
                    Object.keys = keysShim;
                }
                return Object.keys || keysShim;
            };
            var objectKeys = keysShim;
            var keys = objectKeys;
            var hasSymbols = 'function' == typeof Symbol && 'symbol' == typeof Symbol('foo');
            var toStr = Object.prototype.toString;
            var concat = Array.prototype.concat;
            var origDefineProperty = Object.defineProperty;
            var isFunction = function isFunction(fn) {
                return 'function' == typeof fn && '[object Function]' === toStr.call(fn);
            };
            var arePropertyDescriptorsSupported = function arePropertyDescriptorsSupported() {
                var obj = {};
                try {
                    origDefineProperty(obj, 'x', {
                        enumerable: false,
                        value: obj
                    });
                    for(var _ in obj){
                        return false;
                    }
                    return obj.x === obj;
                } catch (e) {
                    return false;
                }
            };
            var supportsDescriptors = origDefineProperty && arePropertyDescriptorsSupported();
            var defineProperty = function defineProperty(object, name, value, predicate) {
                if (name in object && (!isFunction(predicate) || !predicate())) {
                    return;
                }
                if (supportsDescriptors) origDefineProperty(object, name, {
                    configurable: true,
                    enumerable: false,
                    value: value,
                    writable: true
                });
                else object[name] = value;
            };
            var defineProperties = function defineProperties(object, map) {
                var predicates = arguments.length > 2 ? arguments[2] : {};
                var props = keys(map);
                if (hasSymbols) props = concat.call(props, Object.getOwnPropertySymbols(map));
                for(var i = 0; i < props.length; i += 1)defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
            };
            defineProperties.supportsDescriptors = !!supportsDescriptors;
            var defineProperties_1 = defineProperties;
            var numberIsNaN$1 = function numberIsNaN(value) {
                return value !== value;
            };
            var implementation$5 = function is(a, b) {
                if (0 === a && 0 === b) {
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
                return 'function' == typeof Object.is ? Object.is : implementation$4;
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
            var implementation$2 = function isNaN1(value) {
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
                throw TypeError("Invalid attempt to destructure non-iterable instance");
            }
            function _iterableToArrayLimit(arr, i) {
                var _arr = [];
                var _n = true;
                var _d = false;
                var _e = void 0;
                try {
                    for(var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true){
                        _arr.push(_s.value);
                        if (i && _arr.length === i) break;
                    }
                } catch (err) {
                    _d = true;
                    _e = err;
                } finally{
                    try {
                        if (!_n && null != _i["return"]) _i["return"]();
                    } finally{
                        if (_d) throw _e;
                    }
                }
                return _arr;
            }
            function _arrayWithHoles(arr) {
                if (Array.isArray(arr)) return arr;
            }
            function _typeof$1(obj) {
                _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function _typeof(obj) {
                    return typeof obj;
                } : function _typeof(obj) {
                    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                };
                return _typeof$1(obj);
            }
            var regexFlagsSupported = void 0 !== /a/g.flags;
            var arrayFromSet = function arrayFromSet(set) {
                var array = [];
                set.forEach(function(value) {
                    return array.push(value);
                });
                return array;
            };
            var arrayFromMap = function arrayFromMap(map) {
                var array = [];
                map.forEach(function(value, key) {
                    return array.push([
                        key,
                        value
                    ]);
                });
                return array;
            };
            var objectIs$1 = Object.is ? Object.is : objectIs$2;
            var objectGetOwnPropertySymbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols : function() {
                return [];
            };
            var numberIsNaN = Number.isNaN ? Number.isNaN : isNan;
            function uncurryThis(f) {
                return f.call.bind(f);
            }
            var hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);
            var propertyIsEnumerable = uncurryThis(Object.prototype.propertyIsEnumerable);
            var objectToString = uncurryThis(Object.prototype.toString);
            var _require$types$1 = util$1.types, isAnyArrayBuffer = _require$types$1.isAnyArrayBuffer, isArrayBufferView = _require$types$1.isArrayBufferView, isDate = _require$types$1.isDate, isMap = _require$types$1.isMap, isRegExp$1 = _require$types$1.isRegExp, isSet = _require$types$1.isSet, isNativeError = _require$types$1.isNativeError, isBoxedPrimitive = _require$types$1.isBoxedPrimitive, isNumberObject = _require$types$1.isNumberObject, isStringObject = _require$types$1.isStringObject, isBooleanObject = _require$types$1.isBooleanObject, isBigIntObject = _require$types$1.isBigIntObject, isSymbolObject = _require$types$1.isSymbolObject, isFloat32Array = _require$types$1.isFloat32Array, isFloat64Array = _require$types$1.isFloat64Array;
            function isNonIndex(key) {
                if (0 === key.length || key.length > 10) return true;
                for(var i = 0; i < key.length; i++){
                    var code = key.charCodeAt(i);
                    if (code < 48 || code > 57) return true;
                }
                return 10 === key.length && key >= Math.pow(2, 32);
            }
            function getOwnNonIndexProperties(value) {
                return Object.keys(value).filter(isNonIndex).concat(objectGetOwnPropertySymbols(value).filter(Object.prototype.propertyIsEnumerable.bind(value)));
            }
            function compare(a, b) {
                if (a === b) {
                    return 0;
                }
                var x = a.length;
                var y = b.length;
                for(var i = 0, len = Math.min(x, y); i < len; ++i)if (a[i] !== b[i]) {
                    x = a[i];
                    y = b[i];
                    break;
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
            var kIsMap = 3;
            function areSimilarRegExps(a, b) {
                return regexFlagsSupported ? a.source === b.source && a.flags === b.flags : RegExp.prototype.toString.call(a) === RegExp.prototype.toString.call(b);
            }
            function areSimilarFloatArrays(a, b) {
                if (a.byteLength !== b.byteLength) {
                    return false;
                }
                for(var offset = 0; offset < a.byteLength; offset++)if (a[offset] !== b[offset]) {
                    return false;
                }
                return true;
            }
            function areSimilarTypedArrays(a, b) {
                if (a.byteLength !== b.byteLength) {
                    return false;
                }
                return 0 === compare(new Uint8Array(a.buffer, a.byteOffset, a.byteLength), new Uint8Array(b.buffer, b.byteOffset, b.byteLength));
            }
            function areEqualArrayBuffers(buf1, buf2) {
                return buf1.byteLength === buf2.byteLength && 0 === compare(new Uint8Array(buf1), new Uint8Array(buf2));
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
            }
            function innerDeepEqual(val1, val2, strict, memos) {
                if (val1 === val2) {
                    if (0 !== val1) return true;
                    return !strict || objectIs$1(val1, val2);
                }
                if (strict) {
                    if ('object' !== _typeof$1(val1)) {
                        return 'number' == typeof val1 && numberIsNaN(val1) && numberIsNaN(val2);
                    }
                    if ('object' !== _typeof$1(val2) || null === val1 || null === val2) {
                        return false;
                    }
                    if (Object.getPrototypeOf(val1) !== Object.getPrototypeOf(val2)) {
                        return false;
                    }
                } else {
                    if (null === val1 || 'object' !== _typeof$1(val1)) {
                        if (null === val2 || 'object' !== _typeof$1(val2)) {
                            return val1 == val2;
                        }
                        return false;
                    }
                    if (null === val2 || 'object' !== _typeof$1(val2)) {
                        return false;
                    }
                }
                var val1Tag = objectToString(val1);
                var val2Tag = objectToString(val2);
                if (val1Tag !== val2Tag) {
                    return false;
                }
                if (Array.isArray(val1)) {
                    if (val1.length !== val2.length) {
                        return false;
                    }
                    var keys1 = getOwnNonIndexProperties(val1);
                    var keys2 = getOwnNonIndexProperties(val2);
                    if (keys1.length !== keys2.length) {
                        return false;
                    }
                    return keyCheck(val1, val2, strict, memos, kIsArray, keys1);
                }
                if ('[object Object]' === val1Tag) {
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
                    }
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
                return keys.filter(function(k) {
                    return propertyIsEnumerable(val, k);
                });
            }
            function keyCheck(val1, val2, strict, memos, iterationType, aKeys) {
                if (5 === arguments.length) {
                    aKeys = Object.keys(val1);
                    var bKeys = Object.keys(val2);
                    if (aKeys.length !== bKeys.length) {
                        return false;
                    }
                }
                var i = 0;
                for(; i < aKeys.length; i++)if (!hasOwnProperty(val2, aKeys[i])) {
                    return false;
                }
                if (strict && 5 === arguments.length) {
                    var symbolKeysA = objectGetOwnPropertySymbols(val1);
                    if (0 !== symbolKeysA.length) {
                        var count = 0;
                        for(i = 0; i < symbolKeysA.length; i++){
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
                        if (0 !== _symbolKeysB.length && 0 !== getEnumerables(val2, _symbolKeysB).length) {
                            return false;
                        }
                    }
                }
                if (0 === aKeys.length && (iterationType === kNoIterator || iterationType === kIsArray && 0 === val1.length || 0 === val1.size)) {
                    return true;
                }
                if (void 0 === memos) memos = {
                    val1: new Map(),
                    val2: new Map(),
                    position: 0
                };
                else {
                    var val2MemoA = memos.val1.get(val1);
                    if (void 0 !== val2MemoA) {
                        var val2MemoB = memos.val2.get(val2);
                        if (void 0 !== val2MemoB) {
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
                var setValues = arrayFromSet(set);
                for(var i = 0; i < setValues.length; i++){
                    var val2 = setValues[i];
                    if (innerDeepEqual(val1, val2, strict, memo)) {
                        set.delete(val2);
                        return true;
                    }
                }
                return false;
            }
            function findLooseMatchingPrimitives(prim) {
                switch(_typeof$1(prim)){
                    case 'undefined':
                        return null;
                    case 'object':
                        return;
                    case 'symbol':
                        return false;
                    case 'string':
                        prim = +prim;
                    case 'number':
                        if (numberIsNaN(prim)) {
                            return false;
                        }
                }
                return true;
            }
            function setMightHaveLoosePrim(a, b, prim) {
                var altValue = findLooseMatchingPrimitives(prim);
                if (null != altValue) return altValue;
                return b.has(altValue) && !a.has(altValue);
            }
            function mapMightHaveLoosePrim(a, b, prim, item, memo) {
                var altValue = findLooseMatchingPrimitives(prim);
                if (null != altValue) {
                    return altValue;
                }
                var curB = b.get(altValue);
                if (void 0 === curB && !b.has(altValue) || !innerDeepEqual(item, curB, false, memo)) {
                    return false;
                }
                return !a.has(altValue) && innerDeepEqual(item, curB, false, memo);
            }
            function setEquiv(a, b, strict, memo) {
                var set = null;
                var aValues = arrayFromSet(a);
                for(var i = 0; i < aValues.length; i++){
                    var val = aValues[i];
                    if ('object' === _typeof$1(val) && null !== val) {
                        if (null === set) set = new Set();
                        set.add(val);
                    } else if (!b.has(val)) {
                        if (strict) return false;
                        if (!setMightHaveLoosePrim(a, b, val)) {
                            return false;
                        }
                        if (null === set) set = new Set();
                        set.add(val);
                    }
                }
                if (null !== set) {
                    var bValues = arrayFromSet(b);
                    for(var _i = 0; _i < bValues.length; _i++){
                        var _val = bValues[_i];
                        if ('object' === _typeof$1(_val) && null !== _val) {
                            if (!setHasEqualElement(set, _val, strict, memo)) return false;
                        } else if (!strict && !a.has(_val) && !setHasEqualElement(set, _val, strict, memo)) {
                            return false;
                        }
                    }
                    return 0 === set.size;
                }
                return true;
            }
            function mapHasEqualEntry(set, map, key1, item1, strict, memo) {
                var setValues = arrayFromSet(set);
                for(var i = 0; i < setValues.length; i++){
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
                for(var i = 0; i < aEntries.length; i++){
                    var _aEntries$i = _slicedToArray(aEntries[i], 2), key = _aEntries$i[0], item1 = _aEntries$i[1];
                    if ('object' === _typeof$1(key) && null !== key) {
                        if (null === set) set = new Set();
                        set.add(key);
                    } else {
                        var item2 = b.get(key);
                        if (void 0 === item2 && !b.has(key) || !innerDeepEqual(item1, item2, strict, memo)) {
                            if (strict) return false;
                            if (!mapMightHaveLoosePrim(a, b, key, item1, memo)) return false;
                            if (null === set) set = new Set();
                            set.add(key);
                        }
                    }
                }
                if (null !== set) {
                    var bEntries = arrayFromMap(b);
                    for(var _i2 = 0; _i2 < bEntries.length; _i2++){
                        var _bEntries$_i = _slicedToArray(bEntries[_i2], 2), key = _bEntries$_i[0], item = _bEntries$_i[1];
                        if ('object' === _typeof$1(key) && null !== key) {
                            if (!mapHasEqualEntry(set, a, key, item, strict, memo)) return false;
                        } else if (!strict && (!a.has(key) || !innerDeepEqual(a.get(key), item, false, memo)) && !mapHasEqualEntry(set, a, key, item, false, memo)) {
                            return false;
                        }
                    }
                    return 0 === set.size;
                }
                return true;
            }
            function objEquiv(a, b, strict, keys, memos, iterationType) {
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
                    for(; i < a.length; i++)if (hasOwnProperty(a, i)) {
                        if (!hasOwnProperty(b, i) || !innerDeepEqual(a[i], b[i], strict, memos)) {
                            return false;
                        }
                    } else if (hasOwnProperty(b, i)) {
                        return false;
                    } else {
                        var keysA = Object.keys(a);
                        for(; i < keysA.length; i++){
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
                for(i = 0; i < keys.length; i++){
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
                _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function _typeof(obj) {
                    return typeof obj;
                } : function _typeof(obj) {
                    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                };
                return _typeof(obj);
            }
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw TypeError("Cannot call a class as a function");
                }
            }
            var _require = errors, _require$codes = _require.codes, ERR_AMBIGUOUS_ARGUMENT = _require$codes.ERR_AMBIGUOUS_ARGUMENT, ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE, ERR_INVALID_ARG_VALUE = _require$codes.ERR_INVALID_ARG_VALUE, ERR_INVALID_RETURN_VALUE = _require$codes.ERR_INVALID_RETURN_VALUE, ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS;
            var AssertionError = assertion_error;
            var _require2 = util$1, inspect = _require2.inspect;
            var _require$types = util$1.types, isPromise = _require$types.isPromise, isRegExp = _require$types.isRegExp;
            var objectAssign = Object.assign ? Object.assign : es6ObjectAssign.assign;
            var objectIs = Object.is ? Object.is : objectIs$2;
            var isDeepEqual;
            var isDeepStrictEqual;
            function lazyLoadComparison() {
                var comparison = comparisons;
                isDeepEqual = comparison.isDeepEqual;
                isDeepStrictEqual = comparison.isDeepStrictEqual;
            }
            var warned = false;
            var assert = assert$2.exports = ok;
            var NO_EXCEPTION_SENTINEL = {};
            function innerFail(obj) {
                if (obj.message instanceof Error) throw obj.message;
                throw new AssertionError(obj);
            }
            function fail(actual, expected, message, operator, stackStartFn) {
                var argsLen = arguments.length;
                var internalMessage;
                if (0 === argsLen) internalMessage = 'Failed';
                else if (1 === argsLen) {
                    message = actual;
                    actual = void 0;
                } else {
                    if (false === warned) {
                        warned = true;
                        var warn = console.warn.bind(console);
                        warn("assert.fail() with more than one argument is deprecated. Please use assert.strictEqual() instead or only pass a message.", 'DeprecationWarning', 'DEP0094');
                    }
                    if (2 === argsLen) operator = '!=';
                }
                if (message instanceof Error) throw message;
                var errArgs = {
                    actual: actual,
                    expected: expected,
                    operator: void 0 === operator ? 'fail' : operator,
                    stackStartFn: stackStartFn || fail
                };
                if (void 0 !== message) errArgs.message = message;
                var err = new AssertionError(errArgs);
                if (internalMessage) {
                    err.message = internalMessage;
                    err.generatedMessage = true;
                }
                throw err;
            }
            assert.fail = fail;
            assert.AssertionError = AssertionError;
            function innerOk(fn, argLen, value, message) {
                if (!value) {
                    var generatedMessage = false;
                    if (0 === argLen) {
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
            }
            function ok() {
                for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                innerOk.apply(void 0, [
                    ok,
                    args.length
                ].concat(args));
            }
            assert.ok = ok;
            assert.equal = function equal(actual, expected, message) {
                if (arguments.length < 2) {
                    throw new ERR_MISSING_ARGS('actual', 'expected');
                }
                if (actual != expected) innerFail({
                    actual: actual,
                    expected: expected,
                    message: message,
                    operator: '==',
                    stackStartFn: equal
                });
            };
            assert.notEqual = function notEqual(actual, expected, message) {
                if (arguments.length < 2) {
                    throw new ERR_MISSING_ARGS('actual', 'expected');
                }
                if (actual == expected) innerFail({
                    actual: actual,
                    expected: expected,
                    message: message,
                    operator: '!=',
                    stackStartFn: notEqual
                });
            };
            assert.deepEqual = function deepEqual(actual, expected, message) {
                if (arguments.length < 2) {
                    throw new ERR_MISSING_ARGS('actual', 'expected');
                }
                if (void 0 === isDeepEqual) lazyLoadComparison();
                if (!isDeepEqual(actual, expected)) innerFail({
                    actual: actual,
                    expected: expected,
                    message: message,
                    operator: 'deepEqual',
                    stackStartFn: deepEqual
                });
            };
            assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
                if (arguments.length < 2) {
                    throw new ERR_MISSING_ARGS('actual', 'expected');
                }
                if (void 0 === isDeepEqual) lazyLoadComparison();
                if (isDeepEqual(actual, expected)) innerFail({
                    actual: actual,
                    expected: expected,
                    message: message,
                    operator: 'notDeepEqual',
                    stackStartFn: notDeepEqual
                });
            };
            assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
                if (arguments.length < 2) {
                    throw new ERR_MISSING_ARGS('actual', 'expected');
                }
                if (void 0 === isDeepEqual) lazyLoadComparison();
                if (!isDeepStrictEqual(actual, expected)) innerFail({
                    actual: actual,
                    expected: expected,
                    message: message,
                    operator: 'deepStrictEqual',
                    stackStartFn: deepStrictEqual
                });
            };
            assert.notDeepStrictEqual = notDeepStrictEqual;
            function notDeepStrictEqual(actual, expected, message) {
                if (arguments.length < 2) {
                    throw new ERR_MISSING_ARGS('actual', 'expected');
                }
                if (void 0 === isDeepEqual) lazyLoadComparison();
                if (isDeepStrictEqual(actual, expected)) innerFail({
                    actual: actual,
                    expected: expected,
                    message: message,
                    operator: 'notDeepStrictEqual',
                    stackStartFn: notDeepStrictEqual
                });
            }
            assert.strictEqual = function strictEqual(actual, expected, message) {
                if (arguments.length < 2) {
                    throw new ERR_MISSING_ARGS('actual', 'expected');
                }
                if (!objectIs(actual, expected)) innerFail({
                    actual: actual,
                    expected: expected,
                    message: message,
                    operator: 'strictEqual',
                    stackStartFn: strictEqual
                });
            };
            assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
                if (arguments.length < 2) {
                    throw new ERR_MISSING_ARGS('actual', 'expected');
                }
                if (objectIs(actual, expected)) innerFail({
                    actual: actual,
                    expected: expected,
                    message: message,
                    operator: 'notStrictEqual',
                    stackStartFn: notStrictEqual
                });
            };
            var Comparison = function Comparison(obj, keys, actual) {
                var _this = this;
                _classCallCheck(this, Comparison);
                keys.forEach(function(key) {
                    if (key in obj) if (void 0 !== actual && 'string' == typeof actual[key] && isRegExp(obj[key]) && obj[key].test(actual[key])) _this[key] = actual[key];
                    else _this[key] = obj[key];
                });
            };
            function compareExceptionKey(actual, expected, key, message, keys, fn) {
                if (!(key in actual) || !isDeepStrictEqual(actual[key], expected[key])) {
                    if (!message) {
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
                if ('function' != typeof expected) {
                    if (isRegExp(expected)) return expected.test(actual);
                    if (2 === arguments.length) {
                        throw new ERR_INVALID_ARG_TYPE('expected', [
                            'Function',
                            'RegExp'
                        ], expected);
                    }
                    if ('object' !== _typeof(actual) || null === actual) {
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
                    var keys = Object.keys(expected);
                    if (expected instanceof Error) keys.push('name', 'message');
                    else if (0 === keys.length) {
                        throw new ERR_INVALID_ARG_VALUE('error', expected, 'may not be an empty object');
                    }
                    if (void 0 === isDeepEqual) lazyLoadComparison();
                    keys.forEach(function(key) {
                        if ('string' == typeof actual[key] && isRegExp(expected[key]) && expected[key].test(actual[key])) {
                            return;
                        }
                        compareExceptionKey(actual, expected, key, msg, keys, fn);
                    });
                    return true;
                }
                if (void 0 !== expected.prototype && actual instanceof expected) {
                    return true;
                }
                if (Error.isPrototypeOf(expected)) {
                    return false;
                }
                return true === expected.call({}, actual);
            }
            function getActual(fn) {
                if ('function' != typeof fn) {
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
                return isPromise(obj) || null !== obj && 'object' === _typeof(obj) && 'function' == typeof obj.then && 'function' == typeof obj.catch;
            }
            function waitForActual(promiseFn) {
                return Promise.resolve().then(function() {
                    var resultPromise;
                    if ('function' == typeof promiseFn) {
                        resultPromise = promiseFn();
                        if (!checkIsPromise(resultPromise)) {
                            throw new ERR_INVALID_RETURN_VALUE('instance of Promise', 'promiseFn', resultPromise);
                        }
                    } else if (checkIsPromise(promiseFn)) resultPromise = promiseFn;
                    else {
                        throw new ERR_INVALID_ARG_TYPE('promiseFn', [
                            'Function',
                            'Promise'
                        ], promiseFn);
                    }
                    return Promise.resolve().then(function() {
                        return resultPromise;
                    }).then(function() {
                        return NO_EXCEPTION_SENTINEL;
                    }).catch(function(e) {
                        return e;
                    });
                });
            }
            function expectsError(stackStartFn, actual, error, message) {
                if ('string' == typeof error) {
                    if (4 === arguments.length) {
                        throw new ERR_INVALID_ARG_TYPE('error', [
                            'Object',
                            'Error',
                            'Function',
                            'RegExp'
                        ], error);
                    }
                    if ('object' === _typeof(actual) && null !== actual) {
                        if (actual.message === error) {
                            throw new ERR_AMBIGUOUS_ARGUMENT('error/message', "The error message \"".concat(actual.message, "\" is identical to the message."));
                        }
                    } else if (actual === error) {
                        throw new ERR_AMBIGUOUS_ARGUMENT('error/message', "The error \"".concat(actual, "\" is identical to the message."));
                    }
                    message = error;
                    error = void 0;
                } else if (null != error && 'object' !== _typeof(error) && 'function' != typeof error) {
                    throw new ERR_INVALID_ARG_TYPE('error', [
                        'Object',
                        'Error',
                        'Function',
                        'RegExp'
                    ], error);
                }
                if (actual === NO_EXCEPTION_SENTINEL) {
                    var details = '';
                    if (error && error.name) details += " (".concat(error.name, ")");
                    details += message ? ": ".concat(message) : '.';
                    var fnType = 'rejects' === stackStartFn.name ? 'rejection' : 'exception';
                    innerFail({
                        actual: void 0,
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
                if ('string' == typeof error) {
                    message = error;
                    error = void 0;
                }
                if (!error || expectedException(actual, error)) {
                    var details = message ? ": ".concat(message) : '.';
                    var fnType = 'doesNotReject' === stackStartFn.name ? 'rejection' : 'exception';
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
                for(var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++)args[_key2 - 1] = arguments[_key2];
                expectsError.apply(void 0, [
                    throws,
                    getActual(promiseFn)
                ].concat(args));
            };
            assert.rejects = function rejects(promiseFn) {
                for(var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++)args[_key3 - 1] = arguments[_key3];
                return waitForActual(promiseFn).then(function(result) {
                    return expectsError.apply(void 0, [
                        rejects,
                        result
                    ].concat(args));
                });
            };
            assert.doesNotThrow = function doesNotThrow(fn) {
                for(var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++)args[_key4 - 1] = arguments[_key4];
                expectsNoError.apply(void 0, [
                    doesNotThrow,
                    getActual(fn)
                ].concat(args));
            };
            assert.doesNotReject = function doesNotReject(fn) {
                for(var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++)args[_key5 - 1] = arguments[_key5];
                return waitForActual(fn).then(function(result) {
                    return expectsNoError.apply(void 0, [
                        doesNotReject,
                        result
                    ].concat(args));
                });
            };
            assert.ifError = function ifError(err) {
                if (null != err) {
                    var message = 'ifError got unwanted exception: ';
                    if ('object' === _typeof(err) && 'string' == typeof err.message) if (0 === err.message.length && err.constructor) message += err.constructor.name;
                    else message += err.message;
                    else message += inspect(err);
                    var newErr = new AssertionError({
                        actual: err,
                        expected: null,
                        operator: 'ifError',
                        message: message,
                        stackStartFn: ifError
                    });
                    var origStack = err.stack;
                    if ('string' == typeof origStack) {
                        var tmp2 = origStack.split('\n');
                        tmp2.shift();
                        var tmp1 = newErr.stack.split('\n');
                        for(var i = 0; i < tmp2.length; i++){
                            var pos = tmp1.indexOf(tmp2[i]);
                            if (-1 !== pos) {
                                tmp1 = tmp1.slice(0, pos);
                                break;
                            }
                        }
                        newErr.stack = "".concat(tmp1.join('\n'), "\n").concat(tmp2.join('\n'));
                    }
                    throw newErr;
                }
            };
            function strict() {
                for(var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++)args[_key6] = arguments[_key6];
                innerOk.apply(void 0, [
                    strict,
                    args.length
                ].concat(args));
            }
            assert.strict = objectAssign(strict, assert, {
                equal: assert.strictEqual,
                deepEqual: assert.deepStrictEqual,
                notEqual: assert.notStrictEqual,
                notDeepEqual: assert.notDeepStrictEqual
            });
            assert.strict.strict = assert.strict;
            function ZStream() {
                this.input = null;
                this.next_in = 0;
                this.avail_in = 0;
                this.total_in = 0;
                this.output = null;
                this.next_out = 0;
                this.avail_out = 0;
                this.total_out = 0;
                this.msg = '';
                this.state = null;
                this.data_type = 2;
                this.adler = 0;
            }
            var zstream = ZStream;
            var deflate$1 = {};
            var common = {};
            (function(exports) {
                var TYPED_OK = 'undefined' != typeof Uint8Array && 'undefined' != typeof Uint16Array && 'undefined' != typeof Int32Array;
                function _has(obj, key) {
                    return Object.prototype.hasOwnProperty.call(obj, key);
                }
                exports.assign = function(obj) {
                    var sources = Array.prototype.slice.call(arguments, 1);
                    while(sources.length){
                        var source = sources.shift();
                        if (!source) {
                            continue;
                        }
                        if ('object' != typeof source) {
                            throw TypeError(source + 'must be non-object');
                        }
                        for(var p in source)if (_has(source, p)) obj[p] = source[p];
                    }
                    return obj;
                };
                exports.shrinkBuf = function(buf, size) {
                    if (buf.length === size) {
                        return buf;
                    }
                    if (buf.subarray) {
                        return buf.subarray(0, size);
                    }
                    buf.length = size;
                    return buf;
                };
                var fnTyped = {
                    arraySet: function arraySet(dest, src, src_offs, len, dest_offs) {
                        if (src.subarray && dest.subarray) {
                            dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
                            return;
                        }
                        for(var i = 0; i < len; i++)dest[dest_offs + i] = src[src_offs + i];
                    },
                    flattenChunks: function flattenChunks(chunks) {
                        var i, l, len, pos, chunk, result;
                        len = 0;
                        for(i = 0, l = chunks.length; i < l; i++)len += chunks[i].length;
                        result = new Uint8Array(len);
                        pos = 0;
                        for(i = 0, l = chunks.length; i < l; i++){
                            chunk = chunks[i];
                            result.set(chunk, pos);
                            pos += chunk.length;
                        }
                        return result;
                    }
                };
                var fnUntyped = {
                    arraySet: function arraySet(dest, src, src_offs, len, dest_offs) {
                        for(var i = 0; i < len; i++)dest[dest_offs + i] = src[src_offs + i];
                    },
                    flattenChunks: function flattenChunks(chunks) {
                        return [].concat.apply([], chunks);
                    }
                };
                exports.setTyped = function(on) {
                    if (on) {
                        exports.Buf8 = Uint8Array;
                        exports.Buf16 = Uint16Array;
                        exports.Buf32 = Int32Array;
                        exports.assign(exports, fnTyped);
                    } else {
                        exports.Buf8 = Array;
                        exports.Buf16 = Array;
                        exports.Buf32 = Array;
                        exports.assign(exports, fnUntyped);
                    }
                };
                exports.setTyped(TYPED_OK);
            })(common);
            var trees$1 = {};
            var utils$3 = common;
            var Z_FIXED$1 = 4;
            var Z_BINARY = 0;
            var Z_TEXT = 1;
            var Z_UNKNOWN$1 = 2;
            function zero$1(buf) {
                var len = buf.length;
                while(--len >= 0){
                    buf[len] = 0;
                }
            }
            var STORED_BLOCK = 0;
            var STATIC_TREES = 1;
            var DYN_TREES = 2;
            var MIN_MATCH$1 = 3;
            var MAX_MATCH$1 = 258;
            var LENGTH_CODES$1 = 29;
            var LITERALS$1 = 256;
            var L_CODES$1 = LITERALS$1 + 1 + LENGTH_CODES$1;
            var D_CODES$1 = 30;
            var BL_CODES$1 = 19;
            var HEAP_SIZE$1 = 2 * L_CODES$1 + 1;
            var MAX_BITS$1 = 15;
            var Buf_size = 16;
            var MAX_BL_BITS = 7;
            var END_BLOCK = 256;
            var REP_3_6 = 16;
            var REPZ_3_10 = 17;
            var REPZ_11_138 = 18;
            var extra_lbits = [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                1,
                1,
                1,
                1,
                2,
                2,
                2,
                2,
                3,
                3,
                3,
                3,
                4,
                4,
                4,
                4,
                5,
                5,
                5,
                5,
                0
            ];
            var extra_dbits = [
                0,
                0,
                0,
                0,
                1,
                1,
                2,
                2,
                3,
                3,
                4,
                4,
                5,
                5,
                6,
                6,
                7,
                7,
                8,
                8,
                9,
                9,
                10,
                10,
                11,
                11,
                12,
                12,
                13,
                13
            ];
            var extra_blbits = [
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
                0,
                0,
                2,
                3,
                7
            ];
            var bl_order = [
                16,
                17,
                18,
                0,
                8,
                7,
                9,
                6,
                10,
                5,
                11,
                4,
                12,
                3,
                13,
                2,
                14,
                1,
                15
            ];
            var DIST_CODE_LEN = 512;
            var static_ltree = Array((L_CODES$1 + 2) * 2);
            zero$1(static_ltree);
            var static_dtree = Array(2 * D_CODES$1);
            zero$1(static_dtree);
            var _dist_code = Array(DIST_CODE_LEN);
            zero$1(_dist_code);
            var _length_code = Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);
            zero$1(_length_code);
            var base_length = Array(LENGTH_CODES$1);
            zero$1(base_length);
            var base_dist = Array(D_CODES$1);
            zero$1(base_dist);
            function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
                this.static_tree = static_tree;
                this.extra_bits = extra_bits;
                this.extra_base = extra_base;
                this.elems = elems;
                this.max_length = max_length;
                this.has_stree = static_tree && static_tree.length;
            }
            var static_l_desc;
            var static_d_desc;
            var static_bl_desc;
            function TreeDesc(dyn_tree, stat_desc) {
                this.dyn_tree = dyn_tree;
                this.max_code = 0;
                this.stat_desc = stat_desc;
            }
            function d_code(dist) {
                return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
            }
            function put_short(s, w) {
                s.pending_buf[s.pending++] = 0xff & w;
                s.pending_buf[s.pending++] = w >>> 8 & 0xff;
            }
            function send_bits(s, value, length) {
                if (s.bi_valid > Buf_size - length) {
                    s.bi_buf |= value << s.bi_valid & 0xffff;
                    put_short(s, s.bi_buf);
                    s.bi_buf = value >> Buf_size - s.bi_valid;
                    s.bi_valid += length - Buf_size;
                } else {
                    s.bi_buf |= value << s.bi_valid & 0xffff;
                    s.bi_valid += length;
                }
            }
            function send_code(s, c, tree) {
                send_bits(s, tree[2 * c], tree[2 * c + 1]);
            }
            function bi_reverse(code, len) {
                var res = 0;
                do {
                    res |= 1 & code;
                    code >>>= 1;
                    res <<= 1;
                }while (--len > 0)
                return res >>> 1;
            }
            function bi_flush(s) {
                if (16 === s.bi_valid) {
                    put_short(s, s.bi_buf);
                    s.bi_buf = 0;
                    s.bi_valid = 0;
                } else if (s.bi_valid >= 8) {
                    s.pending_buf[s.pending++] = 0xff & s.bi_buf;
                    s.bi_buf >>= 8;
                    s.bi_valid -= 8;
                }
            }
            function gen_bitlen(s, desc) {
                var tree = desc.dyn_tree;
                var max_code = desc.max_code;
                var stree = desc.stat_desc.static_tree;
                var has_stree = desc.stat_desc.has_stree;
                var extra = desc.stat_desc.extra_bits;
                var base = desc.stat_desc.extra_base;
                var max_length = desc.stat_desc.max_length;
                var h;
                var n, m;
                var bits;
                var xbits;
                var f;
                var overflow = 0;
                for(bits = 0; bits <= MAX_BITS$1; bits++)s.bl_count[bits] = 0;
                tree[2 * s.heap[s.heap_max] + 1] = 0;
                for(h = s.heap_max + 1; h < HEAP_SIZE$1; h++){
                    n = s.heap[h];
                    bits = tree[2 * tree[2 * n + 1] + 1] + 1;
                    if (bits > max_length) {
                        bits = max_length;
                        overflow++;
                    }
                    tree[2 * n + 1] = bits;
                    if (n > max_code) {
                        continue;
                    }
                    s.bl_count[bits]++;
                    xbits = 0;
                    if (n >= base) xbits = extra[n - base];
                    f = tree[2 * n];
                    s.opt_len += f * (bits + xbits);
                    if (has_stree) s.static_len += f * (stree[2 * n + 1] + xbits);
                }
                if (0 === overflow) {
                    return;
                }
                do {
                    bits = max_length - 1;
                    while(0 === s.bl_count[bits]){
                        bits--;
                    }
                    s.bl_count[bits]--;
                    s.bl_count[bits + 1] += 2;
                    s.bl_count[max_length]--;
                    overflow -= 2;
                }while (overflow > 0)
                for(bits = max_length; 0 !== bits; bits--){
                    n = s.bl_count[bits];
                    while(0 !== n){
                        m = s.heap[--h];
                        if (m > max_code) {
                            continue;
                        }
                        if (tree[2 * m + 1] !== bits) {
                            s.opt_len += (bits - tree[2 * m + 1]) * tree[2 * m];
                            tree[2 * m + 1] = bits;
                        }
                        n--;
                    }
                }
            }
            function gen_codes(tree, max_code, bl_count) {
                var next_code = Array(MAX_BITS$1 + 1);
                var code = 0;
                var bits;
                var n;
                for(bits = 1; bits <= MAX_BITS$1; bits++)next_code[bits] = code = code + bl_count[bits - 1] << 1;
                for(n = 0; n <= max_code; n++){
                    var len = tree[2 * n + 1];
                    if (0 === len) {
                        continue;
                    }
                    tree[2 * n] = bi_reverse(next_code[len]++, len);
                }
            }
            function tr_static_init() {
                var n;
                var bits;
                var length;
                var code;
                var dist;
                var bl_count = Array(MAX_BITS$1 + 1);
                length = 0;
                for(code = 0; code < LENGTH_CODES$1 - 1; code++){
                    base_length[code] = length;
                    for(n = 0; n < 1 << extra_lbits[code]; n++)_length_code[length++] = code;
                }
                _length_code[length - 1] = code;
                dist = 0;
                for(code = 0; code < 16; code++){
                    base_dist[code] = dist;
                    for(n = 0; n < 1 << extra_dbits[code]; n++)_dist_code[dist++] = code;
                }
                dist >>= 7;
                for(; code < D_CODES$1; code++){
                    base_dist[code] = dist << 7;
                    for(n = 0; n < 1 << extra_dbits[code] - 7; n++)_dist_code[256 + dist++] = code;
                }
                for(bits = 0; bits <= MAX_BITS$1; bits++)bl_count[bits] = 0;
                n = 0;
                while(n <= 143){
                    static_ltree[2 * n + 1] = 8;
                    n++;
                    bl_count[8]++;
                }
                while(n <= 255){
                    static_ltree[2 * n + 1] = 9;
                    n++;
                    bl_count[9]++;
                }
                while(n <= 279){
                    static_ltree[2 * n + 1] = 7;
                    n++;
                    bl_count[7]++;
                }
                while(n <= 287){
                    static_ltree[2 * n + 1] = 8;
                    n++;
                    bl_count[8]++;
                }
                gen_codes(static_ltree, L_CODES$1 + 1, bl_count);
                for(n = 0; n < D_CODES$1; n++){
                    static_dtree[2 * n + 1] = 5;
                    static_dtree[2 * n] = bi_reverse(n, 5);
                }
                static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS$1 + 1, L_CODES$1, MAX_BITS$1);
                static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES$1, MAX_BITS$1);
                static_bl_desc = new StaticTreeDesc([], extra_blbits, 0, BL_CODES$1, MAX_BL_BITS);
            }
            function init_block(s) {
                var n;
                for(n = 0; n < L_CODES$1; n++)s.dyn_ltree[2 * n] = 0;
                for(n = 0; n < D_CODES$1; n++)s.dyn_dtree[2 * n] = 0;
                for(n = 0; n < BL_CODES$1; n++)s.bl_tree[2 * n] = 0;
                s.dyn_ltree[2 * END_BLOCK] = 1;
                s.opt_len = s.static_len = 0;
                s.last_lit = s.matches = 0;
            }
            function bi_windup(s) {
                if (s.bi_valid > 8) put_short(s, s.bi_buf);
                else if (s.bi_valid > 0) s.pending_buf[s.pending++] = s.bi_buf;
                s.bi_buf = 0;
                s.bi_valid = 0;
            }
            function copy_block(s, buf, len, header) {
                bi_windup(s);
                if (header) {
                    put_short(s, len);
                    put_short(s, ~len);
                }
                utils$3.arraySet(s.pending_buf, s.window, buf, len, s.pending);
                s.pending += len;
            }
            function smaller(tree, n, m, depth) {
                var _n2 = 2 * n;
                var _m2 = 2 * m;
                return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
            }
            function pqdownheap(s, tree, k) {
                var v = s.heap[k];
                var j = k << 1;
                while(j <= s.heap_len){
                    if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) j++;
                    if (smaller(tree, v, s.heap[j], s.depth)) {
                        break;
                    }
                    s.heap[k] = s.heap[j];
                    k = j;
                    j <<= 1;
                }
                s.heap[k] = v;
            }
            function compress_block(s, ltree, dtree) {
                var dist;
                var lc;
                var lx = 0;
                var code;
                var extra;
                if (0 !== s.last_lit) {
                    do {
                        dist = s.pending_buf[s.d_buf + 2 * lx] << 8 | s.pending_buf[s.d_buf + 2 * lx + 1];
                        lc = s.pending_buf[s.l_buf + lx];
                        lx++;
                        if (0 === dist) send_code(s, lc, ltree);
                        else {
                            code = _length_code[lc];
                            send_code(s, code + LITERALS$1 + 1, ltree);
                            extra = extra_lbits[code];
                            if (0 !== extra) {
                                lc -= base_length[code];
                                send_bits(s, lc, extra);
                            }
                            dist--;
                            code = d_code(dist);
                            send_code(s, code, dtree);
                            extra = extra_dbits[code];
                            if (0 !== extra) {
                                dist -= base_dist[code];
                                send_bits(s, dist, extra);
                            }
                        }
                    }while (lx < s.last_lit)
                }
                send_code(s, END_BLOCK, ltree);
            }
            function build_tree(s, desc) {
                var tree = desc.dyn_tree;
                var stree = desc.stat_desc.static_tree;
                var has_stree = desc.stat_desc.has_stree;
                var elems = desc.stat_desc.elems;
                var n, m;
                var max_code = -1;
                var node;
                s.heap_len = 0;
                s.heap_max = HEAP_SIZE$1;
                for(n = 0; n < elems; n++)if (0 !== tree[2 * n]) {
                    s.heap[++s.heap_len] = max_code = n;
                    s.depth[n] = 0;
                } else {
                    tree[2 * n + 1] = 0;
                }
                while(s.heap_len < 2){
                    node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
                    tree[2 * node] = 1;
                    s.depth[node] = 0;
                    s.opt_len--;
                    if (has_stree) s.static_len -= stree[2 * node + 1];
                }
                desc.max_code = max_code;
                for(n = s.heap_len >> 1; n >= 1; n--)pqdownheap(s, tree, n);
                node = elems;
                do {
                    n = s.heap[1];
                    s.heap[1] = s.heap[s.heap_len--];
                    pqdownheap(s, tree, 1);
                    m = s.heap[1];
                    s.heap[--s.heap_max] = n;
                    s.heap[--s.heap_max] = m;
                    tree[2 * node] = tree[2 * n] + tree[2 * m];
                    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
                    tree[2 * n + 1] = tree[2 * m + 1] = node;
                    s.heap[1] = node++;
                    pqdownheap(s, tree, 1);
                }while (s.heap_len >= 2)
                s.heap[--s.heap_max] = s.heap[1];
                gen_bitlen(s, desc);
                gen_codes(tree, max_code, s.bl_count);
            }
            function scan_tree(s, tree, max_code) {
                var n;
                var prevlen = -1;
                var curlen;
                var nextlen = tree[1];
                var count = 0;
                var max_count = 7;
                var min_count = 4;
                if (0 === nextlen) {
                    max_count = 138;
                    min_count = 3;
                }
                tree[(max_code + 1) * 2 + 1] = 0xffff;
                for(n = 0; n <= max_code; n++){
                    curlen = nextlen;
                    nextlen = tree[(n + 1) * 2 + 1];
                    if (++count < max_count && curlen === nextlen) {
                        continue;
                    }
                    if (count < min_count) s.bl_tree[2 * curlen] += count;
                    else if (0 !== curlen) {
                        if (curlen !== prevlen) s.bl_tree[2 * curlen]++;
                        s.bl_tree[2 * REP_3_6]++;
                    } else if (count <= 10) s.bl_tree[2 * REPZ_3_10]++;
                    else s.bl_tree[2 * REPZ_11_138]++;
                    count = 0;
                    prevlen = curlen;
                    if (0 === nextlen) {
                        max_count = 138;
                        min_count = 3;
                    } else if (curlen === nextlen) {
                        max_count = 6;
                        min_count = 3;
                    } else {
                        max_count = 7;
                        min_count = 4;
                    }
                }
            }
            function send_tree(s, tree, max_code) {
                var n;
                var prevlen = -1;
                var curlen;
                var nextlen = tree[1];
                var count = 0;
                var max_count = 7;
                var min_count = 4;
                if (0 === nextlen) {
                    max_count = 138;
                    min_count = 3;
                }
                for(n = 0; n <= max_code; n++){
                    curlen = nextlen;
                    nextlen = tree[(n + 1) * 2 + 1];
                    if (++count < max_count && curlen === nextlen) {
                        continue;
                    }
                    if (count < min_count) {
                        do {
                            send_code(s, curlen, s.bl_tree);
                        }while (0 !== --count)
                    } else if (0 !== curlen) {
                        if (curlen !== prevlen) {
                            send_code(s, curlen, s.bl_tree);
                            count--;
                        }
                        send_code(s, REP_3_6, s.bl_tree);
                        send_bits(s, count - 3, 2);
                    } else if (count <= 10) {
                        send_code(s, REPZ_3_10, s.bl_tree);
                        send_bits(s, count - 3, 3);
                    } else {
                        send_code(s, REPZ_11_138, s.bl_tree);
                        send_bits(s, count - 11, 7);
                    }
                    count = 0;
                    prevlen = curlen;
                    if (0 === nextlen) {
                        max_count = 138;
                        min_count = 3;
                    } else if (curlen === nextlen) {
                        max_count = 6;
                        min_count = 3;
                    } else {
                        max_count = 7;
                        min_count = 4;
                    }
                }
            }
            function build_bl_tree(s) {
                var max_blindex;
                scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
                scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
                build_tree(s, s.bl_desc);
                for(max_blindex = BL_CODES$1 - 1; max_blindex >= 3; max_blindex--)if (0 !== s.bl_tree[2 * bl_order[max_blindex] + 1]) {
                    break;
                }
                s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
                return max_blindex;
            }
            function send_all_trees(s, lcodes, dcodes, blcodes) {
                var rank;
                send_bits(s, lcodes - 257, 5);
                send_bits(s, dcodes - 1, 5);
                send_bits(s, blcodes - 4, 4);
                for(rank = 0; rank < blcodes; rank++)send_bits(s, s.bl_tree[2 * bl_order[rank] + 1], 3);
                send_tree(s, s.dyn_ltree, lcodes - 1);
                send_tree(s, s.dyn_dtree, dcodes - 1);
            }
            function detect_data_type(s) {
                var black_mask = 0xf3ffc07f;
                var n;
                for(n = 0; n <= 31; n++, black_mask >>>= 1)if (1 & black_mask && 0 !== s.dyn_ltree[2 * n]) {
                    return Z_BINARY;
                }
                if (0 !== s.dyn_ltree[18] || 0 !== s.dyn_ltree[20] || 0 !== s.dyn_ltree[26]) {
                    return Z_TEXT;
                }
                for(n = 32; n < LITERALS$1; n++)if (0 !== s.dyn_ltree[2 * n]) {
                    return Z_TEXT;
                }
                return Z_BINARY;
            }
            var static_init_done = false;
            function _tr_init(s) {
                if (!static_init_done) {
                    tr_static_init();
                    static_init_done = true;
                }
                s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
                s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
                s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
                s.bi_buf = 0;
                s.bi_valid = 0;
                init_block(s);
            }
            function _tr_stored_block(s, buf, stored_len, last) {
                send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
                copy_block(s, buf, stored_len, true);
            }
            function _tr_align(s) {
                send_bits(s, STATIC_TREES << 1, 3);
                send_code(s, END_BLOCK, static_ltree);
                bi_flush(s);
            }
            function _tr_flush_block(s, buf, stored_len, last) {
                var opt_lenb, static_lenb;
                var max_blindex = 0;
                if (s.level > 0) {
                    if (s.strm.data_type === Z_UNKNOWN$1) s.strm.data_type = detect_data_type(s);
                    build_tree(s, s.l_desc);
                    build_tree(s, s.d_desc);
                    max_blindex = build_bl_tree(s);
                    opt_lenb = s.opt_len + 3 + 7 >>> 3;
                    static_lenb = s.static_len + 3 + 7 >>> 3;
                    if (static_lenb <= opt_lenb) opt_lenb = static_lenb;
                } else {
                    opt_lenb = static_lenb = stored_len + 5;
                }
                if (stored_len + 4 <= opt_lenb && -1 !== buf) _tr_stored_block(s, buf, stored_len, last);
                else if (s.strategy === Z_FIXED$1 || static_lenb === opt_lenb) {
                    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
                    compress_block(s, static_ltree, static_dtree);
                } else {
                    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
                    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
                    compress_block(s, s.dyn_ltree, s.dyn_dtree);
                }
                init_block(s);
                if (last) bi_windup(s);
            }
            function _tr_tally(s, dist, lc) {
                s.pending_buf[s.d_buf + 2 * s.last_lit] = dist >>> 8 & 0xff;
                s.pending_buf[s.d_buf + 2 * s.last_lit + 1] = 0xff & dist;
                s.pending_buf[s.l_buf + s.last_lit] = 0xff & lc;
                s.last_lit++;
                if (0 === dist) s.dyn_ltree[2 * lc]++;
                else {
                    s.matches++;
                    dist--;
                    s.dyn_ltree[(_length_code[lc] + LITERALS$1 + 1) * 2]++;
                    s.dyn_dtree[2 * d_code(dist)]++;
                }
                return s.last_lit === s.lit_bufsize - 1;
            }
            trees$1._tr_init = _tr_init;
            trees$1._tr_stored_block = _tr_stored_block;
            trees$1._tr_flush_block = _tr_flush_block;
            trees$1._tr_tally = _tr_tally;
            trees$1._tr_align = _tr_align;
            function adler32$2(adler, buf, len, pos) {
                var s1 = 0xffff & adler | 0, s2 = adler >>> 16 & 0xffff | 0, n = 0;
                while(0 !== len){
                    n = len > 2000 ? 2000 : len;
                    len -= n;
                    do {
                        s1 = s1 + buf[pos++] | 0;
                        s2 = s2 + s1 | 0;
                    }while (--n)
                    s1 %= 65521;
                    s2 %= 65521;
                }
                return s1 | s2 << 16 | 0;
            }
            var adler32_1 = adler32$2;
            function makeTable() {
                var c, table = [];
                for(var n = 0; n < 256; n++){
                    c = n;
                    for(var k = 0; k < 8; k++)c = 1 & c ? 0xEDB88320 ^ c >>> 1 : c >>> 1;
                    table[n] = c;
                }
                return table;
            }
            var crcTable = makeTable();
            function crc32$2(crc, buf, len, pos) {
                var t = crcTable, end = pos + len;
                crc ^= -1;
                for(var i = pos; i < end; i++)crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 0xFF];
                return -1 ^ crc;
            }
            var crc32_1 = crc32$2;
            var messages = {
                2: 'need dictionary',
                1: 'stream end',
                0: '',
                '-1': 'file error',
                '-2': 'stream error',
                '-3': 'data error',
                '-4': 'insufficient memory',
                '-5': 'buffer error',
                '-6': 'incompatible version'
            };
            var utils$2 = common;
            var trees = trees$1;
            var adler32$1 = adler32_1;
            var crc32$1 = crc32_1;
            var msg = messages;
            var Z_NO_FLUSH = 0;
            var Z_PARTIAL_FLUSH = 1;
            var Z_FULL_FLUSH = 3;
            var Z_FINISH$1 = 4;
            var Z_BLOCK$1 = 5;
            var Z_OK$1 = 0;
            var Z_STREAM_END$1 = 1;
            var Z_STREAM_ERROR$1 = -2;
            var Z_DATA_ERROR$1 = -3;
            var Z_BUF_ERROR$1 = -5;
            var Z_DEFAULT_COMPRESSION = -1;
            var Z_FILTERED = 1;
            var Z_HUFFMAN_ONLY = 2;
            var Z_RLE = 3;
            var Z_FIXED = 4;
            var Z_DEFAULT_STRATEGY = 0;
            var Z_UNKNOWN = 2;
            var Z_DEFLATED$1 = 8;
            var MAX_MEM_LEVEL = 9;
            var MAX_WBITS$1 = 15;
            var DEF_MEM_LEVEL = 8;
            var LENGTH_CODES = 29;
            var LITERALS = 256;
            var L_CODES = LITERALS + 1 + LENGTH_CODES;
            var D_CODES = 30;
            var BL_CODES = 19;
            var HEAP_SIZE = 2 * L_CODES + 1;
            var MAX_BITS = 15;
            var MIN_MATCH = 3;
            var MAX_MATCH = 258;
            var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
            var PRESET_DICT = 0x20;
            var INIT_STATE = 42;
            var EXTRA_STATE = 69;
            var NAME_STATE = 73;
            var COMMENT_STATE = 91;
            var HCRC_STATE = 103;
            var BUSY_STATE = 113;
            var FINISH_STATE = 666;
            var BS_NEED_MORE = 1;
            var BS_BLOCK_DONE = 2;
            var BS_FINISH_STARTED = 3;
            var BS_FINISH_DONE = 4;
            var OS_CODE = 0x03;
            function err(strm, errorCode) {
                strm.msg = msg[errorCode];
                return errorCode;
            }
            function rank(f) {
                return (f << 1) - (f > 4 ? 9 : 0);
            }
            function zero(buf) {
                var len = buf.length;
                while(--len >= 0){
                    buf[len] = 0;
                }
            }
            function flush_pending(strm) {
                var s = strm.state;
                var len = s.pending;
                if (len > strm.avail_out) len = strm.avail_out;
                if (0 === len) {
                    return;
                }
                utils$2.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
                strm.next_out += len;
                s.pending_out += len;
                strm.total_out += len;
                strm.avail_out -= len;
                s.pending -= len;
                if (0 === s.pending) s.pending_out = 0;
            }
            function flush_block_only(s, last) {
                trees._tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
                s.block_start = s.strstart;
                flush_pending(s.strm);
            }
            function put_byte(s, b) {
                s.pending_buf[s.pending++] = b;
            }
            function putShortMSB(s, b) {
                s.pending_buf[s.pending++] = b >>> 8 & 0xff;
                s.pending_buf[s.pending++] = 0xff & b;
            }
            function read_buf(strm, buf, start, size) {
                var len = strm.avail_in;
                if (len > size) len = size;
                if (0 === len) {
                    return 0;
                }
                strm.avail_in -= len;
                utils$2.arraySet(buf, strm.input, strm.next_in, len, start);
                if (1 === strm.state.wrap) strm.adler = adler32$1(strm.adler, buf, len, start);
                else if (2 === strm.state.wrap) strm.adler = crc32$1(strm.adler, buf, len, start);
                strm.next_in += len;
                strm.total_in += len;
                return len;
            }
            function longest_match(s, cur_match) {
                var chain_length = s.max_chain_length;
                var scan = s.strstart;
                var match;
                var len;
                var best_len = s.prev_length;
                var nice_match = s.nice_match;
                var limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
                var _win = s.window;
                var wmask = s.w_mask;
                var prev = s.prev;
                var strend = s.strstart + MAX_MATCH;
                var scan_end1 = _win[scan + best_len - 1];
                var scan_end = _win[scan + best_len];
                if (s.prev_length >= s.good_match) chain_length >>= 2;
                if (nice_match > s.lookahead) nice_match = s.lookahead;
                do {
                    match = cur_match;
                    if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
                        continue;
                    }
                    scan += 2;
                    match++;
                    do ;
                    while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend)
                    len = MAX_MATCH - (strend - scan);
                    scan = strend - MAX_MATCH;
                    if (len > best_len) {
                        s.match_start = cur_match;
                        best_len = len;
                        if (len >= nice_match) {
                            break;
                        }
                        scan_end1 = _win[scan + best_len - 1];
                        scan_end = _win[scan + best_len];
                    }
                }while ((cur_match = prev[cur_match & wmask]) > limit && 0 !== --chain_length)
                if (best_len <= s.lookahead) {
                    return best_len;
                }
                return s.lookahead;
            }
            function fill_window(s) {
                var _w_size = s.w_size;
                var p, n, m, more, str;
                do {
                    more = s.window_size - s.lookahead - s.strstart;
                    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
                        utils$2.arraySet(s.window, s.window, _w_size, _w_size, 0);
                        s.match_start -= _w_size;
                        s.strstart -= _w_size;
                        s.block_start -= _w_size;
                        n = s.hash_size;
                        p = n;
                        do {
                            m = s.head[--p];
                            s.head[p] = m >= _w_size ? m - _w_size : 0;
                        }while (--n)
                        n = _w_size;
                        p = n;
                        do {
                            m = s.prev[--p];
                            s.prev[p] = m >= _w_size ? m - _w_size : 0;
                        }while (--n)
                        more += _w_size;
                    }
                    if (0 === s.strm.avail_in) {
                        break;
                    }
                    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
                    s.lookahead += n;
                    if (s.lookahead + s.insert >= MIN_MATCH) {
                        str = s.strstart - s.insert;
                        s.ins_h = s.window[str];
                        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 1]) & s.hash_mask;
                        while(s.insert){
                            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
                            s.prev[str & s.w_mask] = s.head[s.ins_h];
                            s.head[s.ins_h] = str;
                            str++;
                            s.insert--;
                            if (s.lookahead + s.insert < MIN_MATCH) {
                                break;
                            }
                        }
                    }
                }while (s.lookahead < MIN_LOOKAHEAD && 0 !== s.strm.avail_in)
            }
            function deflate_stored(s, flush) {
                var max_block_size = 0xffff;
                if (max_block_size > s.pending_buf_size - 5) max_block_size = s.pending_buf_size - 5;
                for(;;){
                    if (s.lookahead <= 1) {
                        fill_window(s);
                        if (0 === s.lookahead && flush === Z_NO_FLUSH) {
                            return BS_NEED_MORE;
                        }
                        if (0 === s.lookahead) {
                            break;
                        }
                    }
                    s.strstart += s.lookahead;
                    s.lookahead = 0;
                    var max_start = s.block_start + max_block_size;
                    if (0 === s.strstart || s.strstart >= max_start) {
                        s.lookahead = s.strstart - max_start;
                        s.strstart = max_start;
                        flush_block_only(s, false);
                        if (0 === s.strm.avail_out) {
                            return BS_NEED_MORE;
                        }
                    }
                    if (s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD) {
                        flush_block_only(s, false);
                        if (0 === s.strm.avail_out) {
                            return BS_NEED_MORE;
                        }
                    }
                }
                s.insert = 0;
                if (flush === Z_FINISH$1) {
                    flush_block_only(s, true);
                    if (0 === s.strm.avail_out) {
                        return BS_FINISH_STARTED;
                    }
                    return BS_FINISH_DONE;
                }
                if (s.strstart > s.block_start) {
                    flush_block_only(s, false);
                    if (0 === s.strm.avail_out) {
                        return BS_NEED_MORE;
                    }
                }
                return BS_NEED_MORE;
            }
            function deflate_fast(s, flush) {
                var hash_head;
                var bflush;
                for(;;){
                    if (s.lookahead < MIN_LOOKAHEAD) {
                        fill_window(s);
                        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
                            return BS_NEED_MORE;
                        }
                        if (0 === s.lookahead) {
                            break;
                        }
                    }
                    hash_head = 0;
                    if (s.lookahead >= MIN_MATCH) {
                        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
                        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                        s.head[s.ins_h] = s.strstart;
                    }
                    if (0 !== hash_head && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) s.match_length = longest_match(s, hash_head);
                    if (s.match_length >= MIN_MATCH) {
                        bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
                        s.lookahead -= s.match_length;
                        if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
                            s.match_length--;
                            do {
                                s.strstart++;
                                s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
                                hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                                s.head[s.ins_h] = s.strstart;
                            }while (0 !== --s.match_length)
                            s.strstart++;
                        } else {
                            s.strstart += s.match_length;
                            s.match_length = 0;
                            s.ins_h = s.window[s.strstart];
                            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask;
                        }
                    } else {
                        bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
                        s.lookahead--;
                        s.strstart++;
                    }
                    if (bflush) {
                        flush_block_only(s, false);
                        if (0 === s.strm.avail_out) {
                            return BS_NEED_MORE;
                        }
                    }
                }
                s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
                if (flush === Z_FINISH$1) {
                    flush_block_only(s, true);
                    if (0 === s.strm.avail_out) {
                        return BS_FINISH_STARTED;
                    }
                    return BS_FINISH_DONE;
                }
                if (s.last_lit) {
                    flush_block_only(s, false);
                    if (0 === s.strm.avail_out) {
                        return BS_NEED_MORE;
                    }
                }
                return BS_BLOCK_DONE;
            }
            function deflate_slow(s, flush) {
                var hash_head;
                var bflush;
                var max_insert;
                for(;;){
                    if (s.lookahead < MIN_LOOKAHEAD) {
                        fill_window(s);
                        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
                            return BS_NEED_MORE;
                        }
                        if (0 === s.lookahead) {
                            break;
                        }
                    }
                    hash_head = 0;
                    if (s.lookahead >= MIN_MATCH) {
                        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
                        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                        s.head[s.ins_h] = s.strstart;
                    }
                    s.prev_length = s.match_length;
                    s.prev_match = s.match_start;
                    s.match_length = MIN_MATCH - 1;
                    if (0 !== hash_head && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
                        s.match_length = longest_match(s, hash_head);
                        if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) s.match_length = MIN_MATCH - 1;
                    }
                    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
                        max_insert = s.strstart + s.lookahead - MIN_MATCH;
                        bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
                        s.lookahead -= s.prev_length - 1;
                        s.prev_length -= 2;
                        do {
                            if (++s.strstart <= max_insert) {
                                s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
                                hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                                s.head[s.ins_h] = s.strstart;
                            }
                        }while (0 !== --s.prev_length)
                        s.match_available = 0;
                        s.match_length = MIN_MATCH - 1;
                        s.strstart++;
                        if (bflush) {
                            flush_block_only(s, false);
                            if (0 === s.strm.avail_out) {
                                return BS_NEED_MORE;
                            }
                        }
                    } else if (s.match_available) {
                        bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
                        if (bflush) flush_block_only(s, false);
                        s.strstart++;
                        s.lookahead--;
                        if (0 === s.strm.avail_out) {
                            return BS_NEED_MORE;
                        }
                    } else {
                        s.match_available = 1;
                        s.strstart++;
                        s.lookahead--;
                    }
                }
                if (s.match_available) {
                    bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
                    s.match_available = 0;
                }
                s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
                if (flush === Z_FINISH$1) {
                    flush_block_only(s, true);
                    if (0 === s.strm.avail_out) {
                        return BS_FINISH_STARTED;
                    }
                    return BS_FINISH_DONE;
                }
                if (s.last_lit) {
                    flush_block_only(s, false);
                    if (0 === s.strm.avail_out) {
                        return BS_NEED_MORE;
                    }
                }
                return BS_BLOCK_DONE;
            }
            function deflate_rle(s, flush) {
                var bflush;
                var prev;
                var scan, strend;
                var _win = s.window;
                for(;;){
                    if (s.lookahead <= MAX_MATCH) {
                        fill_window(s);
                        if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
                            return BS_NEED_MORE;
                        }
                        if (0 === s.lookahead) {
                            break;
                        }
                    }
                    s.match_length = 0;
                    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
                        scan = s.strstart - 1;
                        prev = _win[scan];
                        if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
                            strend = s.strstart + MAX_MATCH;
                            do ;
                            while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend)
                            s.match_length = MAX_MATCH - (strend - scan);
                            if (s.match_length > s.lookahead) s.match_length = s.lookahead;
                        }
                    }
                    if (s.match_length >= MIN_MATCH) {
                        bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);
                        s.lookahead -= s.match_length;
                        s.strstart += s.match_length;
                        s.match_length = 0;
                    } else {
                        bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
                        s.lookahead--;
                        s.strstart++;
                    }
                    if (bflush) {
                        flush_block_only(s, false);
                        if (0 === s.strm.avail_out) {
                            return BS_NEED_MORE;
                        }
                    }
                }
                s.insert = 0;
                if (flush === Z_FINISH$1) {
                    flush_block_only(s, true);
                    if (0 === s.strm.avail_out) {
                        return BS_FINISH_STARTED;
                    }
                    return BS_FINISH_DONE;
                }
                if (s.last_lit) {
                    flush_block_only(s, false);
                    if (0 === s.strm.avail_out) {
                        return BS_NEED_MORE;
                    }
                }
                return BS_BLOCK_DONE;
            }
            function deflate_huff(s, flush) {
                var bflush;
                for(;;){
                    if (0 === s.lookahead) {
                        fill_window(s);
                        if (0 === s.lookahead) {
                            if (flush === Z_NO_FLUSH) {
                                return BS_NEED_MORE;
                            }
                            break;
                        }
                    }
                    s.match_length = 0;
                    bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
                    s.lookahead--;
                    s.strstart++;
                    if (bflush) {
                        flush_block_only(s, false);
                        if (0 === s.strm.avail_out) {
                            return BS_NEED_MORE;
                        }
                    }
                }
                s.insert = 0;
                if (flush === Z_FINISH$1) {
                    flush_block_only(s, true);
                    if (0 === s.strm.avail_out) {
                        return BS_FINISH_STARTED;
                    }
                    return BS_FINISH_DONE;
                }
                if (s.last_lit) {
                    flush_block_only(s, false);
                    if (0 === s.strm.avail_out) {
                        return BS_NEED_MORE;
                    }
                }
                return BS_BLOCK_DONE;
            }
            function Config(good_length, max_lazy, nice_length, max_chain, func) {
                this.good_length = good_length;
                this.max_lazy = max_lazy;
                this.nice_length = nice_length;
                this.max_chain = max_chain;
                this.func = func;
            }
            var configuration_table;
            configuration_table = [
                new Config(0, 0, 0, 0, deflate_stored),
                new Config(4, 4, 8, 4, deflate_fast),
                new Config(4, 5, 16, 8, deflate_fast),
                new Config(4, 6, 32, 32, deflate_fast),
                new Config(4, 4, 16, 16, deflate_slow),
                new Config(8, 16, 32, 32, deflate_slow),
                new Config(8, 16, 128, 128, deflate_slow),
                new Config(8, 32, 128, 256, deflate_slow),
                new Config(32, 128, 258, 1024, deflate_slow),
                new Config(32, 258, 258, 4096, deflate_slow)
            ];
            function lm_init(s) {
                s.window_size = 2 * s.w_size;
                zero(s.head);
                s.max_lazy_match = configuration_table[s.level].max_lazy;
                s.good_match = configuration_table[s.level].good_length;
                s.nice_match = configuration_table[s.level].nice_length;
                s.max_chain_length = configuration_table[s.level].max_chain;
                s.strstart = 0;
                s.block_start = 0;
                s.lookahead = 0;
                s.insert = 0;
                s.match_length = s.prev_length = MIN_MATCH - 1;
                s.match_available = 0;
                s.ins_h = 0;
            }
            function DeflateState() {
                this.strm = null;
                this.status = 0;
                this.pending_buf = null;
                this.pending_buf_size = 0;
                this.pending_out = 0;
                this.pending = 0;
                this.wrap = 0;
                this.gzhead = null;
                this.gzindex = 0;
                this.method = Z_DEFLATED$1;
                this.last_flush = -1;
                this.w_size = 0;
                this.w_bits = 0;
                this.w_mask = 0;
                this.window = null;
                this.window_size = 0;
                this.prev = null;
                this.head = null;
                this.ins_h = 0;
                this.hash_size = 0;
                this.hash_bits = 0;
                this.hash_mask = 0;
                this.hash_shift = 0;
                this.block_start = 0;
                this.match_length = 0;
                this.prev_match = 0;
                this.match_available = 0;
                this.strstart = 0;
                this.match_start = 0;
                this.lookahead = 0;
                this.prev_length = 0;
                this.max_chain_length = 0;
                this.max_lazy_match = 0;
                this.level = 0;
                this.strategy = 0;
                this.good_match = 0;
                this.nice_match = 0;
                this.dyn_ltree = new utils$2.Buf16(2 * HEAP_SIZE);
                this.dyn_dtree = new utils$2.Buf16((2 * D_CODES + 1) * 2);
                this.bl_tree = new utils$2.Buf16((2 * BL_CODES + 1) * 2);
                zero(this.dyn_ltree);
                zero(this.dyn_dtree);
                zero(this.bl_tree);
                this.l_desc = null;
                this.d_desc = null;
                this.bl_desc = null;
                this.bl_count = new utils$2.Buf16(MAX_BITS + 1);
                this.heap = new utils$2.Buf16(2 * L_CODES + 1);
                zero(this.heap);
                this.heap_len = 0;
                this.heap_max = 0;
                this.depth = new utils$2.Buf16(2 * L_CODES + 1);
                zero(this.depth);
                this.l_buf = 0;
                this.lit_bufsize = 0;
                this.last_lit = 0;
                this.d_buf = 0;
                this.opt_len = 0;
                this.static_len = 0;
                this.matches = 0;
                this.insert = 0;
                this.bi_buf = 0;
                this.bi_valid = 0;
            }
            function deflateResetKeep(strm) {
                var s;
                if (!strm || !strm.state) {
                    return err(strm, Z_STREAM_ERROR$1);
                }
                strm.total_in = strm.total_out = 0;
                strm.data_type = Z_UNKNOWN;
                s = strm.state;
                s.pending = 0;
                s.pending_out = 0;
                if (s.wrap < 0) s.wrap = -s.wrap;
                s.status = s.wrap ? INIT_STATE : BUSY_STATE;
                strm.adler = 2 === s.wrap ? 0 : 1;
                s.last_flush = Z_NO_FLUSH;
                trees._tr_init(s);
                return Z_OK$1;
            }
            function deflateReset(strm) {
                var ret = deflateResetKeep(strm);
                if (ret === Z_OK$1) lm_init(strm.state);
                return ret;
            }
            function deflateSetHeader(strm, head) {
                if (!strm || !strm.state) {
                    return Z_STREAM_ERROR$1;
                }
                if (2 !== strm.state.wrap) {
                    return Z_STREAM_ERROR$1;
                }
                strm.state.gzhead = head;
                return Z_OK$1;
            }
            function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
                if (!strm) {
                    return Z_STREAM_ERROR$1;
                }
                var wrap = 1;
                if (level === Z_DEFAULT_COMPRESSION) level = 6;
                if (windowBits < 0) {
                    wrap = 0;
                    windowBits = -windowBits;
                } else if (windowBits > 15) {
                    wrap = 2;
                    windowBits -= 16;
                }
                if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED$1 || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED) {
                    return err(strm, Z_STREAM_ERROR$1);
                }
                if (8 === windowBits) windowBits = 9;
                var s = new DeflateState();
                strm.state = s;
                s.strm = strm;
                s.wrap = wrap;
                s.gzhead = null;
                s.w_bits = windowBits;
                s.w_size = 1 << s.w_bits;
                s.w_mask = s.w_size - 1;
                s.hash_bits = memLevel + 7;
                s.hash_size = 1 << s.hash_bits;
                s.hash_mask = s.hash_size - 1;
                s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
                s.window = new utils$2.Buf8(2 * s.w_size);
                s.head = new utils$2.Buf16(s.hash_size);
                s.prev = new utils$2.Buf16(s.w_size);
                s.lit_bufsize = 1 << memLevel + 6;
                s.pending_buf_size = 4 * s.lit_bufsize;
                s.pending_buf = new utils$2.Buf8(s.pending_buf_size);
                s.d_buf = 1 * s.lit_bufsize;
                s.l_buf = 3 * s.lit_bufsize;
                s.level = level;
                s.strategy = strategy;
                s.method = method;
                return deflateReset(strm);
            }
            function deflateInit(strm, level) {
                return deflateInit2(strm, level, Z_DEFLATED$1, MAX_WBITS$1, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
            }
            function deflate(strm, flush) {
                var old_flush, s;
                var beg, val;
                if (!strm || !strm.state || flush > Z_BLOCK$1 || flush < 0) {
                    return strm ? err(strm, Z_STREAM_ERROR$1) : Z_STREAM_ERROR$1;
                }
                s = strm.state;
                if (!strm.output || !strm.input && 0 !== strm.avail_in || s.status === FINISH_STATE && flush !== Z_FINISH$1) {
                    return err(strm, 0 === strm.avail_out ? Z_BUF_ERROR$1 : Z_STREAM_ERROR$1);
                }
                s.strm = strm;
                old_flush = s.last_flush;
                s.last_flush = flush;
                if (s.status === INIT_STATE) if (2 === s.wrap) {
                    strm.adler = 0;
                    put_byte(s, 31);
                    put_byte(s, 139);
                    put_byte(s, 8);
                    if (s.gzhead) {
                        put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (s.gzhead.extra ? 4 : 0) + (s.gzhead.name ? 8 : 0) + (s.gzhead.comment ? 16 : 0));
                        put_byte(s, 0xff & s.gzhead.time);
                        put_byte(s, s.gzhead.time >> 8 & 0xff);
                        put_byte(s, s.gzhead.time >> 16 & 0xff);
                        put_byte(s, s.gzhead.time >> 24 & 0xff);
                        put_byte(s, 9 === s.level ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
                        put_byte(s, 0xff & s.gzhead.os);
                        if (s.gzhead.extra && s.gzhead.extra.length) {
                            put_byte(s, 0xff & s.gzhead.extra.length);
                            put_byte(s, s.gzhead.extra.length >> 8 & 0xff);
                        }
                        if (s.gzhead.hcrc) strm.adler = crc32$1(strm.adler, s.pending_buf, s.pending, 0);
                        s.gzindex = 0;
                        s.status = EXTRA_STATE;
                    } else {
                        put_byte(s, 0);
                        put_byte(s, 0);
                        put_byte(s, 0);
                        put_byte(s, 0);
                        put_byte(s, 0);
                        put_byte(s, 9 === s.level ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
                        put_byte(s, OS_CODE);
                        s.status = BUSY_STATE;
                    }
                } else {
                    var header = Z_DEFLATED$1 + (s.w_bits - 8 << 4) << 8;
                    var level_flags = -1;
                    level_flags = s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 0 : s.level < 6 ? 1 : 6 === s.level ? 2 : 3;
                    header |= level_flags << 6;
                    if (0 !== s.strstart) header |= PRESET_DICT;
                    header += 31 - header % 31;
                    s.status = BUSY_STATE;
                    putShortMSB(s, header);
                    if (0 !== s.strstart) {
                        putShortMSB(s, strm.adler >>> 16);
                        putShortMSB(s, 0xffff & strm.adler);
                    }
                    strm.adler = 1;
                }
                if (s.status === EXTRA_STATE) if (s.gzhead.extra) {
                    beg = s.pending;
                    while(s.gzindex < (0xffff & s.gzhead.extra.length)){
                        if (s.pending === s.pending_buf_size) {
                            if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32$1(strm.adler, s.pending_buf, s.pending - beg, beg);
                            flush_pending(strm);
                            beg = s.pending;
                            if (s.pending === s.pending_buf_size) {
                                break;
                            }
                        }
                        put_byte(s, 0xff & s.gzhead.extra[s.gzindex]);
                        s.gzindex++;
                    }
                    if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32$1(strm.adler, s.pending_buf, s.pending - beg, beg);
                    if (s.gzindex === s.gzhead.extra.length) {
                        s.gzindex = 0;
                        s.status = NAME_STATE;
                    }
                } else {
                    s.status = NAME_STATE;
                }
                if (s.status === NAME_STATE) if (s.gzhead.name) {
                    beg = s.pending;
                    do {
                        if (s.pending === s.pending_buf_size) {
                            if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32$1(strm.adler, s.pending_buf, s.pending - beg, beg);
                            flush_pending(strm);
                            beg = s.pending;
                            if (s.pending === s.pending_buf_size) {
                                val = 1;
                                break;
                            }
                        }
                        val = s.gzindex < s.gzhead.name.length ? 0xff & s.gzhead.name.charCodeAt(s.gzindex++) : 0;
                        put_byte(s, val);
                    }while (0 !== val)
                    if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32$1(strm.adler, s.pending_buf, s.pending - beg, beg);
                    if (0 === val) {
                        s.gzindex = 0;
                        s.status = COMMENT_STATE;
                    }
                } else {
                    s.status = COMMENT_STATE;
                }
                if (s.status === COMMENT_STATE) if (s.gzhead.comment) {
                    beg = s.pending;
                    do {
                        if (s.pending === s.pending_buf_size) {
                            if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32$1(strm.adler, s.pending_buf, s.pending - beg, beg);
                            flush_pending(strm);
                            beg = s.pending;
                            if (s.pending === s.pending_buf_size) {
                                val = 1;
                                break;
                            }
                        }
                        val = s.gzindex < s.gzhead.comment.length ? 0xff & s.gzhead.comment.charCodeAt(s.gzindex++) : 0;
                        put_byte(s, val);
                    }while (0 !== val)
                    if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32$1(strm.adler, s.pending_buf, s.pending - beg, beg);
                    if (0 === val) s.status = HCRC_STATE;
                } else {
                    s.status = HCRC_STATE;
                }
                if (s.status === HCRC_STATE) if (s.gzhead.hcrc) {
                    if (s.pending + 2 > s.pending_buf_size) flush_pending(strm);
                    if (s.pending + 2 <= s.pending_buf_size) {
                        put_byte(s, 0xff & strm.adler);
                        put_byte(s, strm.adler >> 8 & 0xff);
                        strm.adler = 0;
                        s.status = BUSY_STATE;
                    }
                } else {
                    s.status = BUSY_STATE;
                }
                if (0 !== s.pending) {
                    flush_pending(strm);
                    if (0 === strm.avail_out) {
                        s.last_flush = -1;
                        return Z_OK$1;
                    }
                } else if (0 === strm.avail_in && rank(flush) <= rank(old_flush) && flush !== Z_FINISH$1) {
                    return err(strm, Z_BUF_ERROR$1);
                }
                if (s.status === FINISH_STATE && 0 !== strm.avail_in) {
                    return err(strm, Z_BUF_ERROR$1);
                }
                if (0 !== strm.avail_in || 0 !== s.lookahead || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
                    var bstate = s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
                    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) s.status = FINISH_STATE;
                    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
                        if (0 === strm.avail_out) s.last_flush = -1;
                        return Z_OK$1;
                    }
                    if (bstate === BS_BLOCK_DONE) {
                        if (flush === Z_PARTIAL_FLUSH) trees._tr_align(s);
                        else if (flush !== Z_BLOCK$1) {
                            trees._tr_stored_block(s, 0, 0, false);
                            if (flush === Z_FULL_FLUSH) {
                                zero(s.head);
                                if (0 === s.lookahead) {
                                    s.strstart = 0;
                                    s.block_start = 0;
                                    s.insert = 0;
                                }
                            }
                        }
                        flush_pending(strm);
                        if (0 === strm.avail_out) {
                            s.last_flush = -1;
                            return Z_OK$1;
                        }
                    }
                }
                if (flush !== Z_FINISH$1) {
                    return Z_OK$1;
                }
                if (s.wrap <= 0) {
                    return Z_STREAM_END$1;
                }
                if (2 === s.wrap) {
                    put_byte(s, 0xff & strm.adler);
                    put_byte(s, strm.adler >> 8 & 0xff);
                    put_byte(s, strm.adler >> 16 & 0xff);
                    put_byte(s, strm.adler >> 24 & 0xff);
                    put_byte(s, 0xff & strm.total_in);
                    put_byte(s, strm.total_in >> 8 & 0xff);
                    put_byte(s, strm.total_in >> 16 & 0xff);
                    put_byte(s, strm.total_in >> 24 & 0xff);
                } else {
                    putShortMSB(s, strm.adler >>> 16);
                    putShortMSB(s, 0xffff & strm.adler);
                }
                flush_pending(strm);
                if (s.wrap > 0) s.wrap = -s.wrap;
                return 0 !== s.pending ? Z_OK$1 : Z_STREAM_END$1;
            }
            function deflateEnd(strm) {
                var status;
                if (!strm || !strm.state) {
                    return Z_STREAM_ERROR$1;
                }
                status = strm.state.status;
                if (status !== INIT_STATE && status !== EXTRA_STATE && status !== NAME_STATE && status !== COMMENT_STATE && status !== HCRC_STATE && status !== BUSY_STATE && status !== FINISH_STATE) {
                    return err(strm, Z_STREAM_ERROR$1);
                }
                strm.state = null;
                return status === BUSY_STATE ? err(strm, Z_DATA_ERROR$1) : Z_OK$1;
            }
            function deflateSetDictionary(strm, dictionary) {
                var dictLength = dictionary.length;
                var s;
                var str, n;
                var wrap;
                var avail;
                var next;
                var input;
                var tmpDict;
                if (!strm || !strm.state) {
                    return Z_STREAM_ERROR$1;
                }
                s = strm.state;
                wrap = s.wrap;
                if (2 === wrap || 1 === wrap && s.status !== INIT_STATE || s.lookahead) {
                    return Z_STREAM_ERROR$1;
                }
                if (1 === wrap) strm.adler = adler32$1(strm.adler, dictionary, dictLength, 0);
                s.wrap = 0;
                if (dictLength >= s.w_size) {
                    if (0 === wrap) {
                        zero(s.head);
                        s.strstart = 0;
                        s.block_start = 0;
                        s.insert = 0;
                    }
                    tmpDict = new utils$2.Buf8(s.w_size);
                    utils$2.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
                    dictionary = tmpDict;
                    dictLength = s.w_size;
                }
                avail = strm.avail_in;
                next = strm.next_in;
                input = strm.input;
                strm.avail_in = dictLength;
                strm.next_in = 0;
                strm.input = dictionary;
                fill_window(s);
                while(s.lookahead >= MIN_MATCH){
                    str = s.strstart;
                    n = s.lookahead - (MIN_MATCH - 1);
                    do {
                        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
                        s.prev[str & s.w_mask] = s.head[s.ins_h];
                        s.head[s.ins_h] = str;
                        str++;
                    }while (--n)
                    s.strstart = str;
                    s.lookahead = MIN_MATCH - 1;
                    fill_window(s);
                }
                s.strstart += s.lookahead;
                s.block_start = s.strstart;
                s.insert = s.lookahead;
                s.lookahead = 0;
                s.match_length = s.prev_length = MIN_MATCH - 1;
                s.match_available = 0;
                strm.next_in = next;
                strm.input = input;
                strm.avail_in = avail;
                s.wrap = wrap;
                return Z_OK$1;
            }
            deflate$1.deflateInit = deflateInit;
            deflate$1.deflateInit2 = deflateInit2;
            deflate$1.deflateReset = deflateReset;
            deflate$1.deflateResetKeep = deflateResetKeep;
            deflate$1.deflateSetHeader = deflateSetHeader;
            deflate$1.deflate = deflate;
            deflate$1.deflateEnd = deflateEnd;
            deflate$1.deflateSetDictionary = deflateSetDictionary;
            deflate$1.deflateInfo = 'pako deflate (from Nodeca project)';
            var inflate$1 = {};
            var BAD$1 = 30;
            var TYPE$1 = 12;
            var inffast = function inflate_fast(strm, start) {
                var state;
                var _in;
                var last;
                var _out;
                var beg;
                var end;
                var dmax;
                var wsize;
                var whave;
                var wnext;
                var s_window;
                var hold;
                var bits;
                var lcode;
                var dcode;
                var lmask;
                var dmask;
                var here;
                var op;
                var len;
                var dist;
                var from;
                var from_source;
                var input, output;
                state = strm.state;
                _in = strm.next_in;
                input = strm.input;
                last = _in + (strm.avail_in - 5);
                _out = strm.next_out;
                output = strm.output;
                beg = _out - (start - strm.avail_out);
                end = _out + (strm.avail_out - 257);
                dmax = state.dmax;
                wsize = state.wsize;
                whave = state.whave;
                wnext = state.wnext;
                s_window = state.window;
                hold = state.hold;
                bits = state.bits;
                lcode = state.lencode;
                dcode = state.distcode;
                lmask = (1 << state.lenbits) - 1;
                dmask = (1 << state.distbits) - 1;
                top: do {
                    if (bits < 15) {
                        hold += input[_in++] << bits;
                        bits += 8;
                        hold += input[_in++] << bits;
                        bits += 8;
                    }
                    here = lcode[hold & lmask];
                    dolen: for(;;){
                        op = here >>> 24;
                        hold >>>= op;
                        bits -= op;
                        op = here >>> 16 & 0xff;
                        if (0 === op) output[_out++] = 0xffff & here;
                        else if (16 & op) {
                            len = 0xffff & here;
                            op &= 15;
                            if (op) {
                                if (bits < op) {
                                    hold += input[_in++] << bits;
                                    bits += 8;
                                }
                                len += hold & (1 << op) - 1;
                                hold >>>= op;
                                bits -= op;
                            }
                            if (bits < 15) {
                                hold += input[_in++] << bits;
                                bits += 8;
                                hold += input[_in++] << bits;
                                bits += 8;
                            }
                            here = dcode[hold & dmask];
                            dodist: for(;;){
                                op = here >>> 24;
                                hold >>>= op;
                                bits -= op;
                                op = here >>> 16 & 0xff;
                                if (16 & op) {
                                    dist = 0xffff & here;
                                    op &= 15;
                                    if (bits < op) {
                                        hold += input[_in++] << bits;
                                        bits += 8;
                                        if (bits < op) {
                                            hold += input[_in++] << bits;
                                            bits += 8;
                                        }
                                    }
                                    dist += hold & (1 << op) - 1;
                                    if (dist > dmax) {
                                        strm.msg = 'invalid distance too far back';
                                        state.mode = BAD$1;
                                        break top;
                                    }
                                    hold >>>= op;
                                    bits -= op;
                                    op = _out - beg;
                                    if (dist > op) {
                                        op = dist - op;
                                        if (op > whave) {
                                            if (state.sane) {
                                                strm.msg = 'invalid distance too far back';
                                                state.mode = BAD$1;
                                                break top;
                                            }
                                        }
                                        from = 0;
                                        from_source = s_window;
                                        if (0 === wnext) {
                                            from += wsize - op;
                                            if (op < len) {
                                                len -= op;
                                                do {
                                                    output[_out++] = s_window[from++];
                                                }while (--op)
                                                from = _out - dist;
                                                from_source = output;
                                            }
                                        } else if (wnext < op) {
                                            from += wsize + wnext - op;
                                            op -= wnext;
                                            if (op < len) {
                                                len -= op;
                                                do {
                                                    output[_out++] = s_window[from++];
                                                }while (--op)
                                                from = 0;
                                                if (wnext < len) {
                                                    op = wnext;
                                                    len -= op;
                                                    do {
                                                        output[_out++] = s_window[from++];
                                                    }while (--op)
                                                    from = _out - dist;
                                                    from_source = output;
                                                }
                                            }
                                        } else {
                                            from += wnext - op;
                                            if (op < len) {
                                                len -= op;
                                                do {
                                                    output[_out++] = s_window[from++];
                                                }while (--op)
                                                from = _out - dist;
                                                from_source = output;
                                            }
                                        }
                                        while(len > 2){
                                            output[_out++] = from_source[from++];
                                            output[_out++] = from_source[from++];
                                            output[_out++] = from_source[from++];
                                            len -= 3;
                                        }
                                        if (len) {
                                            output[_out++] = from_source[from++];
                                            if (len > 1) output[_out++] = from_source[from++];
                                        }
                                    } else {
                                        from = _out - dist;
                                        do {
                                            output[_out++] = output[from++];
                                            output[_out++] = output[from++];
                                            output[_out++] = output[from++];
                                            len -= 3;
                                        }while (len > 2)
                                        if (len) {
                                            output[_out++] = output[from++];
                                            if (len > 1) output[_out++] = output[from++];
                                        }
                                    }
                                } else if ((64 & op) === 0) {
                                    here = dcode[(0xffff & here) + (hold & (1 << op) - 1)];
                                    continue dodist;
                                } else {
                                    strm.msg = 'invalid distance code';
                                    state.mode = BAD$1;
                                    break top;
                                }
                                break;
                            }
                        } else if ((64 & op) === 0) {
                            here = lcode[(0xffff & here) + (hold & (1 << op) - 1)];
                            continue dolen;
                        } else if (32 & op) {
                            state.mode = TYPE$1;
                            break top;
                        } else {
                            strm.msg = 'invalid literal/length code';
                            state.mode = BAD$1;
                            break top;
                        }
                        break;
                    }
                }while (_in < last && _out < end)
                len = bits >> 3;
                _in -= len;
                bits -= len << 3;
                hold &= (1 << bits) - 1;
                strm.next_in = _in;
                strm.next_out = _out;
                strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
                strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
                state.hold = hold;
                state.bits = bits;
                return;
            };
            var utils$1 = common;
            var MAXBITS = 15;
            var ENOUGH_LENS$1 = 852;
            var ENOUGH_DISTS$1 = 592;
            var CODES$1 = 0;
            var LENS$1 = 1;
            var DISTS$1 = 2;
            var lbase = [
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                13,
                15,
                17,
                19,
                23,
                27,
                31,
                35,
                43,
                51,
                59,
                67,
                83,
                99,
                115,
                131,
                163,
                195,
                227,
                258,
                0,
                0
            ];
            var lext = [
                16,
                16,
                16,
                16,
                16,
                16,
                16,
                16,
                17,
                17,
                17,
                17,
                18,
                18,
                18,
                18,
                19,
                19,
                19,
                19,
                20,
                20,
                20,
                20,
                21,
                21,
                21,
                21,
                16,
                72,
                78
            ];
            var dbase = [
                1,
                2,
                3,
                4,
                5,
                7,
                9,
                13,
                17,
                25,
                33,
                49,
                65,
                97,
                129,
                193,
                257,
                385,
                513,
                769,
                1025,
                1537,
                2049,
                3073,
                4097,
                6145,
                8193,
                12289,
                16385,
                24577,
                0,
                0
            ];
            var dext = [
                16,
                16,
                16,
                16,
                17,
                17,
                18,
                18,
                19,
                19,
                20,
                20,
                21,
                21,
                22,
                22,
                23,
                23,
                24,
                24,
                25,
                25,
                26,
                26,
                27,
                27,
                28,
                28,
                29,
                29,
                64,
                64
            ];
            var inftrees = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
                var bits = opts.bits;
                var len = 0;
                var sym = 0;
                var min = 0, max = 0;
                var root = 0;
                var curr = 0;
                var drop = 0;
                var left = 0;
                var used = 0;
                var huff = 0;
                var incr;
                var fill;
                var low;
                var mask;
                var next;
                var base = null;
                var base_index = 0;
                var end;
                var count = new utils$1.Buf16(MAXBITS + 1);
                var offs = new utils$1.Buf16(MAXBITS + 1);
                var extra = null;
                var extra_index = 0;
                var here_bits, here_op, here_val;
                for(len = 0; len <= MAXBITS; len++)count[len] = 0;
                for(sym = 0; sym < codes; sym++)count[lens[lens_index + sym]]++;
                root = bits;
                for(max = MAXBITS; max >= 1; max--)if (0 !== count[max]) {
                    break;
                }
                if (root > max) root = max;
                if (0 === max) {
                    table[table_index++] = 20971520;
                    table[table_index++] = 20971520;
                    opts.bits = 1;
                    return 0;
                }
                for(min = 1; min < max; min++)if (0 !== count[min]) {
                    break;
                }
                if (root < min) root = min;
                left = 1;
                for(len = 1; len <= MAXBITS; len++){
                    left <<= 1;
                    left -= count[len];
                    if (left < 0) {
                        return -1;
                    }
                }
                if (left > 0 && (type === CODES$1 || 1 !== max)) {
                    return -1;
                }
                offs[1] = 0;
                for(len = 1; len < MAXBITS; len++)offs[len + 1] = offs[len] + count[len];
                for(sym = 0; sym < codes; sym++)if (0 !== lens[lens_index + sym]) work[offs[lens[lens_index + sym]]++] = sym;
                if (type === CODES$1) {
                    base = extra = work;
                    end = 19;
                } else if (type === LENS$1) {
                    base = lbase;
                    base_index -= 257;
                    extra = lext;
                    extra_index -= 257;
                    end = 256;
                } else {
                    base = dbase;
                    extra = dext;
                    end = -1;
                }
                huff = 0;
                sym = 0;
                len = min;
                next = table_index;
                curr = root;
                drop = 0;
                low = -1;
                used = 1 << root;
                mask = used - 1;
                if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
                    return 1;
                }
                for(;;){
                    here_bits = len - drop;
                    if (work[sym] < end) {
                        here_op = 0;
                        here_val = work[sym];
                    } else if (work[sym] > end) {
                        here_op = extra[extra_index + work[sym]];
                        here_val = base[base_index + work[sym]];
                    } else {
                        here_op = 96;
                        here_val = 0;
                    }
                    incr = 1 << len - drop;
                    fill = 1 << curr;
                    min = fill;
                    do {
                        fill -= incr;
                        table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
                    }while (0 !== fill)
                    incr = 1 << len - 1;
                    while(huff & incr){
                        incr >>= 1;
                    }
                    if (0 !== incr) {
                        huff &= incr - 1;
                        huff += incr;
                    } else {
                        huff = 0;
                    }
                    sym++;
                    if (0 === --count[len]) {
                        if (len === max) {
                            break;
                        }
                        len = lens[lens_index + work[sym]];
                    }
                    if (len > root && (huff & mask) !== low) {
                        if (0 === drop) drop = root;
                        next += min;
                        curr = len - drop;
                        left = 1 << curr;
                        while(curr + drop < max){
                            left -= count[curr + drop];
                            if (left <= 0) {
                                break;
                            }
                            curr++;
                            left <<= 1;
                        }
                        used += 1 << curr;
                        if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
                            return 1;
                        }
                        low = huff & mask;
                        table[low] = root << 24 | curr << 16 | next - table_index | 0;
                    }
                }
                if (0 !== huff) table[next + huff] = len - drop << 24 | 4194304;
                opts.bits = root;
                return 0;
            };
            var utils = common;
            var adler32 = adler32_1;
            var crc32 = crc32_1;
            var inflate_fast = inffast;
            var inflate_table = inftrees;
            var CODES = 0;
            var LENS = 1;
            var DISTS = 2;
            var Z_FINISH = 4;
            var Z_BLOCK = 5;
            var Z_TREES = 6;
            var Z_OK = 0;
            var Z_STREAM_END = 1;
            var Z_NEED_DICT = 2;
            var Z_STREAM_ERROR = -2;
            var Z_DATA_ERROR = -3;
            var Z_MEM_ERROR = -4;
            var Z_BUF_ERROR = -5;
            var Z_DEFLATED = 8;
            var HEAD = 1;
            var FLAGS = 2;
            var TIME = 3;
            var OS = 4;
            var EXLEN = 5;
            var EXTRA = 6;
            var NAME = 7;
            var COMMENT = 8;
            var HCRC = 9;
            var DICTID = 10;
            var DICT = 11;
            var TYPE = 12;
            var TYPEDO = 13;
            var STORED = 14;
            var COPY_ = 15;
            var COPY = 16;
            var TABLE = 17;
            var LENLENS = 18;
            var CODELENS = 19;
            var LEN_ = 20;
            var LEN = 21;
            var LENEXT = 22;
            var DIST = 23;
            var DISTEXT = 24;
            var MATCH = 25;
            var LIT = 26;
            var CHECK = 27;
            var LENGTH = 28;
            var DONE = 29;
            var BAD = 30;
            var MEM = 31;
            var SYNC = 32;
            var ENOUGH_LENS = 852;
            var ENOUGH_DISTS = 592;
            var MAX_WBITS = 15;
            var DEF_WBITS = MAX_WBITS;
            function zswap32(q) {
                return (q >>> 24 & 0xff) + (q >>> 8 & 0xff00) + ((0xff00 & q) << 8) + ((0xff & q) << 24);
            }
            function InflateState() {
                this.mode = 0;
                this.last = false;
                this.wrap = 0;
                this.havedict = false;
                this.flags = 0;
                this.dmax = 0;
                this.check = 0;
                this.total = 0;
                this.head = null;
                this.wbits = 0;
                this.wsize = 0;
                this.whave = 0;
                this.wnext = 0;
                this.window = null;
                this.hold = 0;
                this.bits = 0;
                this.length = 0;
                this.offset = 0;
                this.extra = 0;
                this.lencode = null;
                this.distcode = null;
                this.lenbits = 0;
                this.distbits = 0;
                this.ncode = 0;
                this.nlen = 0;
                this.ndist = 0;
                this.have = 0;
                this.next = null;
                this.lens = new utils.Buf16(320);
                this.work = new utils.Buf16(288);
                this.lendyn = null;
                this.distdyn = null;
                this.sane = 0;
                this.back = 0;
                this.was = 0;
            }
            function inflateResetKeep(strm) {
                var state;
                if (!strm || !strm.state) {
                    return Z_STREAM_ERROR;
                }
                state = strm.state;
                strm.total_in = strm.total_out = state.total = 0;
                strm.msg = '';
                if (state.wrap) strm.adler = 1 & state.wrap;
                state.mode = HEAD;
                state.last = 0;
                state.havedict = 0;
                state.dmax = 32768;
                state.head = null;
                state.hold = 0;
                state.bits = 0;
                state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
                state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);
                state.sane = 1;
                state.back = -1;
                return Z_OK;
            }
            function inflateReset(strm) {
                var state;
                if (!strm || !strm.state) {
                    return Z_STREAM_ERROR;
                }
                state = strm.state;
                state.wsize = 0;
                state.whave = 0;
                state.wnext = 0;
                return inflateResetKeep(strm);
            }
            function inflateReset2(strm, windowBits) {
                var wrap;
                var state;
                if (!strm || !strm.state) {
                    return Z_STREAM_ERROR;
                }
                state = strm.state;
                if (windowBits < 0) {
                    wrap = 0;
                    windowBits = -windowBits;
                } else {
                    wrap = (windowBits >> 4) + 1;
                    if (windowBits < 48) windowBits &= 15;
                }
                if (windowBits && (windowBits < 8 || windowBits > 15)) {
                    return Z_STREAM_ERROR;
                }
                if (null !== state.window && state.wbits !== windowBits) state.window = null;
                state.wrap = wrap;
                state.wbits = windowBits;
                return inflateReset(strm);
            }
            function inflateInit2(strm, windowBits) {
                var ret;
                var state;
                if (!strm) {
                    return Z_STREAM_ERROR;
                }
                state = new InflateState();
                strm.state = state;
                state.window = null;
                ret = inflateReset2(strm, windowBits);
                if (ret !== Z_OK) strm.state = null;
                return ret;
            }
            function inflateInit(strm) {
                return inflateInit2(strm, DEF_WBITS);
            }
            var virgin = true;
            var lenfix, distfix;
            function fixedtables(state) {
                if (virgin) {
                    var sym;
                    lenfix = new utils.Buf32(512);
                    distfix = new utils.Buf32(32);
                    sym = 0;
                    while(sym < 144){
                        state.lens[sym++] = 8;
                    }
                    while(sym < 256){
                        state.lens[sym++] = 9;
                    }
                    while(sym < 280){
                        state.lens[sym++] = 7;
                    }
                    while(sym < 288){
                        state.lens[sym++] = 8;
                    }
                    inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, {
                        bits: 9
                    });
                    sym = 0;
                    while(sym < 32){
                        state.lens[sym++] = 5;
                    }
                    inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, {
                        bits: 5
                    });
                    virgin = false;
                }
                state.lencode = lenfix;
                state.lenbits = 9;
                state.distcode = distfix;
                state.distbits = 5;
            }
            function updatewindow(strm, src, end, copy) {
                var dist;
                var state = strm.state;
                if (null === state.window) {
                    state.wsize = 1 << state.wbits;
                    state.wnext = 0;
                    state.whave = 0;
                    state.window = new utils.Buf8(state.wsize);
                }
                if (copy >= state.wsize) {
                    utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
                    state.wnext = 0;
                    state.whave = state.wsize;
                } else {
                    dist = state.wsize - state.wnext;
                    if (dist > copy) dist = copy;
                    utils.arraySet(state.window, src, end - copy, dist, state.wnext);
                    copy -= dist;
                    if (copy) {
                        utils.arraySet(state.window, src, end - copy, copy, 0);
                        state.wnext = copy;
                        state.whave = state.wsize;
                    } else {
                        state.wnext += dist;
                        if (state.wnext === state.wsize) state.wnext = 0;
                        if (state.whave < state.wsize) state.whave += dist;
                    }
                }
                return 0;
            }
            function inflate(strm, flush) {
                var state;
                var input, output;
                var next;
                var put;
                var have, left;
                var hold;
                var bits;
                var _in, _out;
                var copy;
                var from;
                var from_source;
                var here = 0;
                var here_bits, here_op, here_val;
                var last_bits, last_op, last_val;
                var len;
                var ret;
                var hbuf = new utils.Buf8(4);
                var opts;
                var n;
                var order = [
                    16,
                    17,
                    18,
                    0,
                    8,
                    7,
                    9,
                    6,
                    10,
                    5,
                    11,
                    4,
                    12,
                    3,
                    13,
                    2,
                    14,
                    1,
                    15
                ];
                if (!strm || !strm.state || !strm.output || !strm.input && 0 !== strm.avail_in) {
                    return Z_STREAM_ERROR;
                }
                state = strm.state;
                if (state.mode === TYPE) state.mode = TYPEDO;
                put = strm.next_out;
                output = strm.output;
                left = strm.avail_out;
                next = strm.next_in;
                input = strm.input;
                have = strm.avail_in;
                hold = state.hold;
                bits = state.bits;
                _in = have;
                _out = left;
                ret = Z_OK;
                inf_leave: for(;;){
                    switch(state.mode){
                        case HEAD:
                            if (0 === state.wrap) {
                                state.mode = TYPEDO;
                                break;
                            }
                            while(bits < 16){
                                if (0 === have) {
                                    break inf_leave;
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8;
                            }
                            if (2 & state.wrap && 0x8b1f === hold) {
                                state.check = 0;
                                hbuf[0] = 0xff & hold;
                                hbuf[1] = hold >>> 8 & 0xff;
                                state.check = crc32(state.check, hbuf, 2, 0);
                                hold = 0;
                                bits = 0;
                                state.mode = FLAGS;
                                break;
                            }
                            state.flags = 0;
                            if (state.head) state.head.done = false;
                            if (!(1 & state.wrap) || (((0xff & hold) << 8) + (hold >> 8)) % 31) {
                                strm.msg = 'incorrect header check';
                                state.mode = BAD;
                                break;
                            }
                            if ((0x0f & hold) !== Z_DEFLATED) {
                                strm.msg = 'unknown compression method';
                                state.mode = BAD;
                                break;
                            }
                            hold >>>= 4;
                            bits -= 4;
                            len = (0x0f & hold) + 8;
                            if (0 === state.wbits) state.wbits = len;
                            else if (len > state.wbits) {
                                strm.msg = 'invalid window size';
                                state.mode = BAD;
                                break;
                            }
                            state.dmax = 1 << len;
                            strm.adler = state.check = 1;
                            state.mode = 0x200 & hold ? DICTID : TYPE;
                            hold = 0;
                            bits = 0;
                            break;
                        case FLAGS:
                            while(bits < 16){
                                if (0 === have) {
                                    break inf_leave;
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8;
                            }
                            state.flags = hold;
                            if ((0xff & state.flags) !== Z_DEFLATED) {
                                strm.msg = 'unknown compression method';
                                state.mode = BAD;
                                break;
                            }
                            if (0xe000 & state.flags) {
                                strm.msg = 'unknown header flags set';
                                state.mode = BAD;
                                break;
                            }
                            if (state.head) state.head.text = hold >> 8 & 1;
                            if (0x0200 & state.flags) {
                                hbuf[0] = 0xff & hold;
                                hbuf[1] = hold >>> 8 & 0xff;
                                state.check = crc32(state.check, hbuf, 2, 0);
                            }
                            hold = 0;
                            bits = 0;
                            state.mode = TIME;
                        case TIME:
                            while(bits < 32){
                                if (0 === have) {
                                    break inf_leave;
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8;
                            }
                            if (state.head) state.head.time = hold;
                            if (0x0200 & state.flags) {
                                hbuf[0] = 0xff & hold;
                                hbuf[1] = hold >>> 8 & 0xff;
                                hbuf[2] = hold >>> 16 & 0xff;
                                hbuf[3] = hold >>> 24 & 0xff;
                                state.check = crc32(state.check, hbuf, 4, 0);
                            }
                            hold = 0;
                            bits = 0;
                            state.mode = OS;
                        case OS:
                            while(bits < 16){
                                if (0 === have) {
                                    break inf_leave;
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8;
                            }
                            if (state.head) {
                                state.head.xflags = 0xff & hold;
                                state.head.os = hold >> 8;
                            }
                            if (0x0200 & state.flags) {
                                hbuf[0] = 0xff & hold;
                                hbuf[1] = hold >>> 8 & 0xff;
                                state.check = crc32(state.check, hbuf, 2, 0);
                            }
                            hold = 0;
                            bits = 0;
                            state.mode = EXLEN;
                        case EXLEN:
                            if (0x0400 & state.flags) {
                                while(bits < 16){
                                    if (0 === have) {
                                        break inf_leave;
                                    }
                                    have--;
                                    hold += input[next++] << bits;
                                    bits += 8;
                                }
                                state.length = hold;
                                if (state.head) state.head.extra_len = hold;
                                if (0x0200 & state.flags) {
                                    hbuf[0] = 0xff & hold;
                                    hbuf[1] = hold >>> 8 & 0xff;
                                    state.check = crc32(state.check, hbuf, 2, 0);
                                }
                                hold = 0;
                                bits = 0;
                            } else if (state.head) state.head.extra = null;
                            state.mode = EXTRA;
                        case EXTRA:
                            if (0x0400 & state.flags) {
                                copy = state.length;
                                if (copy > have) copy = have;
                                if (copy) {
                                    if (state.head) {
                                        len = state.head.extra_len - state.length;
                                        if (!state.head.extra) state.head.extra = Array(state.head.extra_len);
                                        utils.arraySet(state.head.extra, input, next, copy, len);
                                    }
                                    if (0x0200 & state.flags) state.check = crc32(state.check, input, copy, next);
                                    have -= copy;
                                    next += copy;
                                    state.length -= copy;
                                }
                                if (state.length) {
                                    break inf_leave;
                                }
                            }
                            state.length = 0;
                            state.mode = NAME;
                        case NAME:
                            if (0x0800 & state.flags) {
                                if (0 === have) {
                                    break inf_leave;
                                }
                                copy = 0;
                                do {
                                    len = input[next + copy++];
                                    if (state.head && len && state.length < 65536) state.head.name += String.fromCharCode(len);
                                }while (len && copy < have)
                                if (0x0200 & state.flags) state.check = crc32(state.check, input, copy, next);
                                have -= copy;
                                next += copy;
                                if (len) {
                                    break inf_leave;
                                }
                            } else if (state.head) state.head.name = null;
                            state.length = 0;
                            state.mode = COMMENT;
                        case COMMENT:
                            if (0x1000 & state.flags) {
                                if (0 === have) {
                                    break inf_leave;
                                }
                                copy = 0;
                                do {
                                    len = input[next + copy++];
                                    if (state.head && len && state.length < 65536) state.head.comment += String.fromCharCode(len);
                                }while (len && copy < have)
                                if (0x0200 & state.flags) state.check = crc32(state.check, input, copy, next);
                                have -= copy;
                                next += copy;
                                if (len) {
                                    break inf_leave;
                                }
                            } else if (state.head) state.head.comment = null;
                            state.mode = HCRC;
                        case HCRC:
                            if (0x0200 & state.flags) {
                                while(bits < 16){
                                    if (0 === have) {
                                        break inf_leave;
                                    }
                                    have--;
                                    hold += input[next++] << bits;
                                    bits += 8;
                                }
                                if (hold !== (0xffff & state.check)) {
                                    strm.msg = 'header crc mismatch';
                                    state.mode = BAD;
                                    break;
                                }
                                hold = 0;
                                bits = 0;
                            }
                            if (state.head) {
                                state.head.hcrc = state.flags >> 9 & 1;
                                state.head.done = true;
                            }
                            strm.adler = state.check = 0;
                            state.mode = TYPE;
                            break;
                        case DICTID:
                            while(bits < 32){
                                if (0 === have) {
                                    break inf_leave;
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8;
                            }
                            strm.adler = state.check = zswap32(hold);
                            hold = 0;
                            bits = 0;
                            state.mode = DICT;
                        case DICT:
                            if (0 === state.havedict) {
                                strm.next_out = put;
                                strm.avail_out = left;
                                strm.next_in = next;
                                strm.avail_in = have;
                                state.hold = hold;
                                state.bits = bits;
                                return Z_NEED_DICT;
                            }
                            strm.adler = state.check = 1;
                            state.mode = TYPE;
                        case TYPE:
                            if (flush === Z_BLOCK || flush === Z_TREES) {
                                break inf_leave;
                            }
                        case TYPEDO:
                            if (state.last) {
                                hold >>>= 7 & bits;
                                bits -= 7 & bits;
                                state.mode = CHECK;
                                break;
                            }
                            while(bits < 3){
                                if (0 === have) {
                                    break inf_leave;
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8;
                            }
                            state.last = 0x01 & hold;
                            hold >>>= 1;
                            bits -= 1;
                            switch(0x03 & hold){
                                case 0:
                                    state.mode = STORED;
                                    break;
                                case 1:
                                    fixedtables(state);
                                    state.mode = LEN_;
                                    if (flush === Z_TREES) {
                                        hold >>>= 2;
                                        bits -= 2;
                                        break inf_leave;
                                    }
                                    break;
                                case 2:
                                    state.mode = TABLE;
                                    break;
                                case 3:
                                    strm.msg = 'invalid block type';
                                    state.mode = BAD;
                            }
                            hold >>>= 2;
                            bits -= 2;
                            break;
                        case STORED:
                            hold >>>= 7 & bits;
                            bits -= 7 & bits;
                            while(bits < 32){
                                if (0 === have) {
                                    break inf_leave;
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8;
                            }
                            if ((0xffff & hold) !== (hold >>> 16 ^ 0xffff)) {
                                strm.msg = 'invalid stored block lengths';
                                state.mode = BAD;
                                break;
                            }
                            state.length = 0xffff & hold;
                            hold = 0;
                            bits = 0;
                            state.mode = COPY_;
                            if (flush === Z_TREES) {
                                break inf_leave;
                            }
                        case COPY_:
                            state.mode = COPY;
                        case COPY:
                            copy = state.length;
                            if (copy) {
                                if (copy > have) copy = have;
                                if (copy > left) copy = left;
                                if (0 === copy) {
                                    break inf_leave;
                                }
                                utils.arraySet(output, input, next, copy, put);
                                have -= copy;
                                next += copy;
                                left -= copy;
                                put += copy;
                                state.length -= copy;
                                break;
                            }
                            state.mode = TYPE;
                            break;
                        case TABLE:
                            while(bits < 14){
                                if (0 === have) {
                                    break inf_leave;
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8;
                            }
                            state.nlen = (0x1f & hold) + 257;
                            hold >>>= 5;
                            bits -= 5;
                            state.ndist = (0x1f & hold) + 1;
                            hold >>>= 5;
                            bits -= 5;
                            state.ncode = (0x0f & hold) + 4;
                            hold >>>= 4;
                            bits -= 4;
                            if (state.nlen > 286 || state.ndist > 30) {
                                strm.msg = 'too many length or distance symbols';
                                state.mode = BAD;
                                break;
                            }
                            state.have = 0;
                            state.mode = LENLENS;
                        case LENLENS:
                            while(state.have < state.ncode){
                                while(bits < 3){
                                    if (0 === have) {
                                        break inf_leave;
                                    }
                                    have--;
                                    hold += input[next++] << bits;
                                    bits += 8;
                                }
                                state.lens[order[state.have++]] = 0x07 & hold;
                                hold >>>= 3;
                                bits -= 3;
                            }
                            while(state.have < 19){
                                state.lens[order[state.have++]] = 0;
                            }
                            state.lencode = state.lendyn;
                            state.lenbits = 7;
                            opts = {
                                bits: state.lenbits
                            };
                            ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
                            state.lenbits = opts.bits;
                            if (ret) {
                                strm.msg = 'invalid code lengths set';
                                state.mode = BAD;
                                break;
                            }
                            state.have = 0;
                            state.mode = CODELENS;
                        case CODELENS:
                            while(state.have < state.nlen + state.ndist){
                                for(;;){
                                    here = state.lencode[hold & (1 << state.lenbits) - 1];
                                    here_bits = here >>> 24;
                                    here_op = here >>> 16 & 0xff;
                                    here_val = 0xffff & here;
                                    if (here_bits <= bits) {
                                        break;
                                    }
                                    if (0 === have) {
                                        break inf_leave;
                                    }
                                    have--;
                                    hold += input[next++] << bits;
                                    bits += 8;
                                }
                                if (here_val < 16) {
                                    hold >>>= here_bits;
                                    bits -= here_bits;
                                    state.lens[state.have++] = here_val;
                                } else {
                                    if (16 === here_val) {
                                        n = here_bits + 2;
                                        while(bits < n){
                                            if (0 === have) {
                                                break inf_leave;
                                            }
                                            have--;
                                            hold += input[next++] << bits;
                                            bits += 8;
                                        }
                                        hold >>>= here_bits;
                                        bits -= here_bits;
                                        if (0 === state.have) {
                                            strm.msg = 'invalid bit length repeat';
                                            state.mode = BAD;
                                            break;
                                        }
                                        len = state.lens[state.have - 1];
                                        copy = 3 + (0x03 & hold);
                                        hold >>>= 2;
                                        bits -= 2;
                                    } else if (17 === here_val) {
                                        n = here_bits + 3;
                                        while(bits < n){
                                            if (0 === have) {
                                                break inf_leave;
                                            }
                                            have--;
                                            hold += input[next++] << bits;
                                            bits += 8;
                                        }
                                        hold >>>= here_bits;
                                        bits -= here_bits;
                                        len = 0;
                                        copy = 3 + (0x07 & hold);
                                        hold >>>= 3;
                                        bits -= 3;
                                    } else {
                                        n = here_bits + 7;
                                        while(bits < n){
                                            if (0 === have) {
                                                break inf_leave;
                                            }
                                            have--;
                                            hold += input[next++] << bits;
                                            bits += 8;
                                        }
                                        hold >>>= here_bits;
                                        bits -= here_bits;
                                        len = 0;
                                        copy = 11 + (0x7f & hold);
                                        hold >>>= 7;
                                        bits -= 7;
                                    }
                                    if (state.have + copy > state.nlen + state.ndist) {
                                        strm.msg = 'invalid bit length repeat';
                                        state.mode = BAD;
                                        break;
                                    }
                                    while(copy--){
                                        state.lens[state.have++] = len;
                                    }
                                }
                            }
                            if (state.mode === BAD) {
                                break;
                            }
                            if (0 === state.lens[256]) {
                                strm.msg = 'invalid code -- missing end-of-block';
                                state.mode = BAD;
                                break;
                            }
                            state.lenbits = 9;
                            opts = {
                                bits: state.lenbits
                            };
                            ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
                            state.lenbits = opts.bits;
                            if (ret) {
                                strm.msg = 'invalid literal/lengths set';
                                state.mode = BAD;
                                break;
                            }
                            state.distbits = 6;
                            state.distcode = state.distdyn;
                            opts = {
                                bits: state.distbits
                            };
                            ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
                            state.distbits = opts.bits;
                            if (ret) {
                                strm.msg = 'invalid distances set';
                                state.mode = BAD;
                                break;
                            }
                            state.mode = LEN_;
                            if (flush === Z_TREES) {
                                break inf_leave;
                            }
                        case LEN_:
                            state.mode = LEN;
                        case LEN:
                            if (have >= 6 && left >= 258) {
                                strm.next_out = put;
                                strm.avail_out = left;
                                strm.next_in = next;
                                strm.avail_in = have;
                                state.hold = hold;
                                state.bits = bits;
                                inflate_fast(strm, _out);
                                put = strm.next_out;
                                output = strm.output;
                                left = strm.avail_out;
                                next = strm.next_in;
                                input = strm.input;
                                have = strm.avail_in;
                                hold = state.hold;
                                bits = state.bits;
                                if (state.mode === TYPE) state.back = -1;
                                break;
                            }
                            state.back = 0;
                            for(;;){
                                here = state.lencode[hold & (1 << state.lenbits) - 1];
                                here_bits = here >>> 24;
                                here_op = here >>> 16 & 0xff;
                                here_val = 0xffff & here;
                                if (here_bits <= bits) {
                                    break;
                                }
                                if (0 === have) {
                                    break inf_leave;
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8;
                            }
                            if (here_op && (0xf0 & here_op) === 0) {
                                last_bits = here_bits;
                                last_op = here_op;
                                last_val = here_val;
                                for(;;){
                                    here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                                    here_bits = here >>> 24;
                                    here_op = here >>> 16 & 0xff;
                                    here_val = 0xffff & here;
                                    if (last_bits + here_bits <= bits) {
                                        break;
                                    }
                                    if (0 === have) {
                                        break inf_leave;
                                    }
                                    have--;
                                    hold += input[next++] << bits;
                                    bits += 8;
                                }
                                hold >>>= last_bits;
                                bits -= last_bits;
                                state.back += last_bits;
                            }
                            hold >>>= here_bits;
                            bits -= here_bits;
                            state.back += here_bits;
                            state.length = here_val;
                            if (0 === here_op) {
                                state.mode = LIT;
                                break;
                            }
                            if (32 & here_op) {
                                state.back = -1;
                                state.mode = TYPE;
                                break;
                            }
                            if (64 & here_op) {
                                strm.msg = 'invalid literal/length code';
                                state.mode = BAD;
                                break;
                            }
                            state.extra = 15 & here_op;
                            state.mode = LENEXT;
                        case LENEXT:
                            if (state.extra) {
                                n = state.extra;
                                while(bits < n){
                                    if (0 === have) {
                                        break inf_leave;
                                    }
                                    have--;
                                    hold += input[next++] << bits;
                                    bits += 8;
                                }
                                state.length += hold & (1 << state.extra) - 1;
                                hold >>>= state.extra;
                                bits -= state.extra;
                                state.back += state.extra;
                            }
                            state.was = state.length;
                            state.mode = DIST;
                        case DIST:
                            for(;;){
                                here = state.distcode[hold & (1 << state.distbits) - 1];
                                here_bits = here >>> 24;
                                here_op = here >>> 16 & 0xff;
                                here_val = 0xffff & here;
                                if (here_bits <= bits) {
                                    break;
                                }
                                if (0 === have) {
                                    break inf_leave;
                                }
                                have--;
                                hold += input[next++] << bits;
                                bits += 8;
                            }
                            if ((0xf0 & here_op) === 0) {
                                last_bits = here_bits;
                                last_op = here_op;
                                last_val = here_val;
                                for(;;){
                                    here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                                    here_bits = here >>> 24;
                                    here_op = here >>> 16 & 0xff;
                                    here_val = 0xffff & here;
                                    if (last_bits + here_bits <= bits) {
                                        break;
                                    }
                                    if (0 === have) {
                                        break inf_leave;
                                    }
                                    have--;
                                    hold += input[next++] << bits;
                                    bits += 8;
                                }
                                hold >>>= last_bits;
                                bits -= last_bits;
                                state.back += last_bits;
                            }
                            hold >>>= here_bits;
                            bits -= here_bits;
                            state.back += here_bits;
                            if (64 & here_op) {
                                strm.msg = 'invalid distance code';
                                state.mode = BAD;
                                break;
                            }
                            state.offset = here_val;
                            state.extra = 15 & here_op;
                            state.mode = DISTEXT;
                        case DISTEXT:
                            if (state.extra) {
                                n = state.extra;
                                while(bits < n){
                                    if (0 === have) {
                                        break inf_leave;
                                    }
                                    have--;
                                    hold += input[next++] << bits;
                                    bits += 8;
                                }
                                state.offset += hold & (1 << state.extra) - 1;
                                hold >>>= state.extra;
                                bits -= state.extra;
                                state.back += state.extra;
                            }
                            if (state.offset > state.dmax) {
                                strm.msg = 'invalid distance too far back';
                                state.mode = BAD;
                                break;
                            }
                            state.mode = MATCH;
                        case MATCH:
                            if (0 === left) {
                                break inf_leave;
                            }
                            copy = _out - left;
                            if (state.offset > copy) {
                                copy = state.offset - copy;
                                if (copy > state.whave) {
                                    if (state.sane) {
                                        strm.msg = 'invalid distance too far back';
                                        state.mode = BAD;
                                        break;
                                    }
                                }
                                if (copy > state.wnext) {
                                    copy -= state.wnext;
                                    from = state.wsize - copy;
                                } else {
                                    from = state.wnext - copy;
                                }
                                if (copy > state.length) copy = state.length;
                                from_source = state.window;
                            } else {
                                from_source = output;
                                from = put - state.offset;
                                copy = state.length;
                            }
                            if (copy > left) copy = left;
                            left -= copy;
                            state.length -= copy;
                            do {
                                output[put++] = from_source[from++];
                            }while (--copy)
                            if (0 === state.length) state.mode = LEN;
                            break;
                        case LIT:
                            if (0 === left) {
                                break inf_leave;
                            }
                            output[put++] = state.length;
                            left--;
                            state.mode = LEN;
                            break;
                        case CHECK:
                            if (state.wrap) {
                                while(bits < 32){
                                    if (0 === have) {
                                        break inf_leave;
                                    }
                                    have--;
                                    hold |= input[next++] << bits;
                                    bits += 8;
                                }
                                _out -= left;
                                strm.total_out += _out;
                                state.total += _out;
                                if (_out) strm.adler = state.check = state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out);
                                _out = left;
                                if ((state.flags ? hold : zswap32(hold)) !== state.check) {
                                    strm.msg = 'incorrect data check';
                                    state.mode = BAD;
                                    break;
                                }
                                hold = 0;
                                bits = 0;
                            }
                            state.mode = LENGTH;
                        case LENGTH:
                            if (state.wrap && state.flags) {
                                while(bits < 32){
                                    if (0 === have) {
                                        break inf_leave;
                                    }
                                    have--;
                                    hold += input[next++] << bits;
                                    bits += 8;
                                }
                                if (hold !== (0xffffffff & state.total)) {
                                    strm.msg = 'incorrect length check';
                                    state.mode = BAD;
                                    break;
                                }
                                hold = 0;
                                bits = 0;
                            }
                            state.mode = DONE;
                        case DONE:
                            ret = Z_STREAM_END;
                            break inf_leave;
                        case BAD:
                            ret = Z_DATA_ERROR;
                            break inf_leave;
                        case MEM:
                            return Z_MEM_ERROR;
                        case SYNC:
                        default:
                            return Z_STREAM_ERROR;
                    }
                }
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH)) {
                    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
                }
                _in -= strm.avail_in;
                _out -= strm.avail_out;
                strm.total_in += _in;
                strm.total_out += _out;
                state.total += _out;
                if (state.wrap && _out) strm.adler = state.check = state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out);
                strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
                if ((0 === _in && 0 === _out || flush === Z_FINISH) && ret === Z_OK) ret = Z_BUF_ERROR;
                return ret;
            }
            function inflateEnd(strm) {
                if (!strm || !strm.state) {
                    return Z_STREAM_ERROR;
                }
                var state = strm.state;
                if (state.window) state.window = null;
                strm.state = null;
                return Z_OK;
            }
            function inflateGetHeader(strm, head) {
                var state;
                if (!strm || !strm.state) {
                    return Z_STREAM_ERROR;
                }
                state = strm.state;
                if ((2 & state.wrap) === 0) {
                    return Z_STREAM_ERROR;
                }
                state.head = head;
                head.done = false;
                return Z_OK;
            }
            function inflateSetDictionary(strm, dictionary) {
                var dictLength = dictionary.length;
                var state;
                var dictid;
                var ret;
                if (!strm || !strm.state) {
                    return Z_STREAM_ERROR;
                }
                state = strm.state;
                if (0 !== state.wrap && state.mode !== DICT) {
                    return Z_STREAM_ERROR;
                }
                if (state.mode === DICT) {
                    dictid = 1;
                    dictid = adler32(dictid, dictionary, dictLength, 0);
                    if (dictid !== state.check) {
                        return Z_DATA_ERROR;
                    }
                }
                ret = updatewindow(strm, dictionary, dictLength, dictLength);
                if (ret) {
                    state.mode = MEM;
                    return Z_MEM_ERROR;
                }
                state.havedict = 1;
                return Z_OK;
            }
            inflate$1.inflateReset = inflateReset;
            inflate$1.inflateReset2 = inflateReset2;
            inflate$1.inflateResetKeep = inflateResetKeep;
            inflate$1.inflateInit = inflateInit;
            inflate$1.inflateInit2 = inflateInit2;
            inflate$1.inflate = inflate;
            inflate$1.inflateEnd = inflateEnd;
            inflate$1.inflateGetHeader = inflateGetHeader;
            inflate$1.inflateSetDictionary = inflateSetDictionary;
            inflate$1.inflateInfo = 'pako inflate (from Nodeca project)';
            var constants = {
                Z_NO_FLUSH: 0,
                Z_PARTIAL_FLUSH: 1,
                Z_SYNC_FLUSH: 2,
                Z_FULL_FLUSH: 3,
                Z_FINISH: 4,
                Z_BLOCK: 5,
                Z_TREES: 6,
                Z_OK: 0,
                Z_STREAM_END: 1,
                Z_NEED_DICT: 2,
                Z_ERRNO: -1,
                Z_STREAM_ERROR: -2,
                Z_DATA_ERROR: -3,
                Z_BUF_ERROR: -5,
                Z_NO_COMPRESSION: 0,
                Z_BEST_SPEED: 1,
                Z_BEST_COMPRESSION: 9,
                Z_DEFAULT_COMPRESSION: -1,
                Z_FILTERED: 1,
                Z_HUFFMAN_ONLY: 2,
                Z_RLE: 3,
                Z_FIXED: 4,
                Z_DEFAULT_STRATEGY: 0,
                Z_BINARY: 0,
                Z_TEXT: 1,
                Z_UNKNOWN: 2,
                Z_DEFLATED: 8
            };
            (function(exports) {
                var assert = assert$2.exports;
                var Zstream = zstream;
                var zlib_deflate = deflate$1;
                var zlib_inflate = inflate$1;
                var constants$1 = constants;
                for(var key in constants$1)exports[key] = constants$1[key];
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
                function Zlib(mode) {
                    if ('number' != typeof mode || mode < exports.DEFLATE || mode > exports.UNZIP) {
                        throw TypeError('Bad argument');
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
                Zlib.prototype.close = function() {
                    if (this.write_in_progress) {
                        this.pending_close = true;
                        return;
                    }
                    this.pending_close = false;
                    assert(this.init_done, 'close before init');
                    assert(this.mode <= exports.UNZIP);
                    if (this.mode === exports.DEFLATE || this.mode === exports.GZIP || this.mode === exports.DEFLATERAW) zlib_deflate.deflateEnd(this.strm);
                    else if (this.mode === exports.INFLATE || this.mode === exports.GUNZIP || this.mode === exports.INFLATERAW || this.mode === exports.UNZIP) zlib_inflate.inflateEnd(this.strm);
                    this.mode = exports.NONE;
                    this.dictionary = null;
                };
                Zlib.prototype.write = function(flush, input, in_off, in_len, out, out_off, out_len) {
                    return this._write(true, flush, input, in_off, in_len, out, out_off, out_len);
                };
                Zlib.prototype.writeSync = function(flush, input, in_off, in_len, out, out_off, out_len) {
                    return this._write(false, flush, input, in_off, in_len, out, out_off, out_len);
                };
                Zlib.prototype._write = function(async, flush, input, in_off, in_len, out, out_off, out_len) {
                    assert.equal(arguments.length, 8);
                    assert(this.init_done, 'write before init');
                    assert(this.mode !== exports.NONE, 'already finalized');
                    assert.equal(false, this.write_in_progress, 'write already in progress');
                    assert.equal(false, this.pending_close, 'close is pending');
                    this.write_in_progress = true;
                    assert.equal(false, void 0 === flush, 'must provide flush value');
                    this.write_in_progress = true;
                    if (flush !== exports.Z_NO_FLUSH && flush !== exports.Z_PARTIAL_FLUSH && flush !== exports.Z_SYNC_FLUSH && flush !== exports.Z_FULL_FLUSH && flush !== exports.Z_FINISH && flush !== exports.Z_BLOCK) {
                        throw Error('Invalid flush value');
                    }
                    if (null == input) {
                        input = Buffer$1.alloc(0);
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
                        this._process();
                        if (this._checkError()) {
                            return this._afterSync();
                        }
                        return;
                    }
                    var self1 = this;
                    browser$1$1.nextTick(function() {
                        self1._process();
                        self1._after();
                    });
                    return this;
                };
                Zlib.prototype._afterSync = function() {
                    var avail_out = this.strm.avail_out;
                    var avail_in = this.strm.avail_in;
                    this.write_in_progress = false;
                    return [
                        avail_in,
                        avail_out
                    ];
                };
                Zlib.prototype._process = function() {
                    var next_expected_header_byte = null;
                    switch(this.mode){
                        case exports.DEFLATE:
                        case exports.GZIP:
                        case exports.DEFLATERAW:
                            this.err = zlib_deflate.deflate(this.strm, this.flush);
                            break;
                        case exports.UNZIP:
                            if (this.strm.avail_in > 0) next_expected_header_byte = this.strm.next_in;
                            switch(this.gzip_id_bytes_read){
                                case 0:
                                    if (null === next_expected_header_byte) {
                                        break;
                                    }
                                    if (this.strm.input[next_expected_header_byte] === GZIP_HEADER_ID1) {
                                        this.gzip_id_bytes_read = 1;
                                        next_expected_header_byte++;
                                        if (1 === this.strm.avail_in) {
                                            break;
                                        }
                                    } else {
                                        this.mode = exports.INFLATE;
                                        break;
                                    }
                                case 1:
                                    if (null === next_expected_header_byte) {
                                        break;
                                    }
                                    if (this.strm.input[next_expected_header_byte] === GZIP_HEADER_ID2) {
                                        this.gzip_id_bytes_read = 2;
                                        this.mode = exports.GUNZIP;
                                    } else {
                                        this.mode = exports.INFLATE;
                                    }
                                    break;
                                default:
                                    throw Error('invalid number of gzip magic number bytes read');
                            }
                        case exports.INFLATE:
                        case exports.GUNZIP:
                        case exports.INFLATERAW:
                            this.err = zlib_inflate.inflate(this.strm, this.flush);
                            if (this.err === exports.Z_NEED_DICT && this.dictionary) {
                                this.err = zlib_inflate.inflateSetDictionary(this.strm, this.dictionary);
                                if (this.err === exports.Z_OK) this.err = zlib_inflate.inflate(this.strm, this.flush);
                                else if (this.err === exports.Z_DATA_ERROR) this.err = exports.Z_NEED_DICT;
                            }
                            while(this.strm.avail_in > 0 && this.mode === exports.GUNZIP && this.err === exports.Z_STREAM_END && 0x00 !== this.strm.next_in[0]){
                                this.reset();
                                this.err = zlib_inflate.inflate(this.strm, this.flush);
                            }
                            break;
                        default:
                            throw Error('Unknown mode ' + this.mode);
                    }
                };
                Zlib.prototype._checkError = function() {
                    switch(this.err){
                        case exports.Z_OK:
                        case exports.Z_BUF_ERROR:
                            if (0 !== this.strm.avail_out && this.flush === exports.Z_FINISH) {
                                this._error('unexpected end of file');
                                return false;
                            }
                            break;
                        case exports.Z_STREAM_END:
                            break;
                        case exports.Z_NEED_DICT:
                            if (null == this.dictionary) this._error('Missing dictionary');
                            else this._error('Bad dictionary');
                            return false;
                        default:
                            this._error('Zlib error');
                            return false;
                    }
                    return true;
                };
                Zlib.prototype._after = function() {
                    if (!this._checkError()) {
                        return;
                    }
                    var avail_out = this.strm.avail_out;
                    var avail_in = this.strm.avail_in;
                    this.write_in_progress = false;
                    this.callback(avail_in, avail_out);
                    if (this.pending_close) this.close();
                };
                Zlib.prototype._error = function(message) {
                    if (this.strm.msg) message = this.strm.msg;
                    this.onerror(message, this.err);
                    this.write_in_progress = false;
                    if (this.pending_close) this.close();
                };
                Zlib.prototype.init = function(windowBits, level, memLevel, strategy, dictionary) {
                    assert(4 === arguments.length || 5 === arguments.length, 'init(windowBits, level, memLevel, strategy, [dictionary])');
                    assert(windowBits >= 8 && windowBits <= 15, 'invalid windowBits');
                    assert(level >= -1 && level <= 9, 'invalid compression level');
                    assert(memLevel >= 1 && memLevel <= 9, 'invalid memlevel');
                    assert(strategy === exports.Z_FILTERED || strategy === exports.Z_HUFFMAN_ONLY || strategy === exports.Z_RLE || strategy === exports.Z_FIXED || strategy === exports.Z_DEFAULT_STRATEGY, 'invalid strategy');
                    this._init(level, windowBits, memLevel, strategy, dictionary);
                    this._setDictionary();
                };
                Zlib.prototype.params = function() {
                    throw Error('deflateParams Not supported');
                };
                Zlib.prototype.reset = function() {
                    this._reset();
                    this._setDictionary();
                };
                Zlib.prototype._init = function(level, windowBits, memLevel, strategy, dictionary) {
                    this.level = level;
                    this.windowBits = windowBits;
                    this.memLevel = memLevel;
                    this.strategy = strategy;
                    this.flush = exports.Z_NO_FLUSH;
                    this.err = exports.Z_OK;
                    if (this.mode === exports.GZIP || this.mode === exports.GUNZIP) this.windowBits += 16;
                    if (this.mode === exports.UNZIP) this.windowBits += 32;
                    if (this.mode === exports.DEFLATERAW || this.mode === exports.INFLATERAW) this.windowBits = -1 * this.windowBits;
                    this.strm = new Zstream();
                    switch(this.mode){
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
                            throw Error('Unknown mode ' + this.mode);
                    }
                    if (this.err !== exports.Z_OK) this._error('Init error');
                    this.dictionary = dictionary;
                    this.write_in_progress = false;
                    this.init_done = true;
                };
                Zlib.prototype._setDictionary = function() {
                    if (null == this.dictionary) {
                        return;
                    }
                    this.err = exports.Z_OK;
                    switch(this.mode){
                        case exports.DEFLATE:
                        case exports.DEFLATERAW:
                            this.err = zlib_deflate.deflateSetDictionary(this.strm, this.dictionary);
                            break;
                    }
                    if (this.err !== exports.Z_OK) this._error('Failed to set dictionary');
                };
                Zlib.prototype._reset = function() {
                    this.err = exports.Z_OK;
                    switch(this.mode){
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
                    if (this.err !== exports.Z_OK) this._error('Failed to reset stream');
                };
                exports.Zlib = Zlib;
            })(binding);
            (function(exports) {
                var Buffer = buffer.Buffer;
                var Transform = require$$1.Transform;
                var binding$1 = binding;
                var util = util$1;
                var assert = assert$2.exports.ok;
                var kMaxLength = buffer.kMaxLength;
                var kRangeErrorMessage = "Cannot create final Buffer. It would be larger than 0x" + kMaxLength.toString(16) + ' bytes';
                binding$1.Z_MIN_WINDOWBITS = 8;
                binding$1.Z_MAX_WINDOWBITS = 15;
                binding$1.Z_DEFAULT_WINDOWBITS = 15;
                binding$1.Z_MIN_CHUNK = 64;
                binding$1.Z_MAX_CHUNK = 1 / 0;
                binding$1.Z_DEFAULT_CHUNK = 16384;
                binding$1.Z_MIN_MEMLEVEL = 1;
                binding$1.Z_MAX_MEMLEVEL = 9;
                binding$1.Z_DEFAULT_MEMLEVEL = 8;
                binding$1.Z_MIN_LEVEL = -1;
                binding$1.Z_MAX_LEVEL = 9;
                binding$1.Z_DEFAULT_LEVEL = binding$1.Z_DEFAULT_COMPRESSION;
                var bkeys = Object.keys(binding$1);
                for(var bk = 0; bk < bkeys.length; bk++){
                    var bkey = bkeys[bk];
                    if (bkey.match(/^Z/)) Object.defineProperty(exports, bkey, {
                        enumerable: true,
                        value: binding$1[bkey],
                        writable: false
                    });
                }
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
                for(var ck = 0; ck < ckeys.length; ck++){
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
                exports.createDeflate = function(o) {
                    return new Deflate(o);
                };
                exports.createInflate = function(o) {
                    return new Inflate(o);
                };
                exports.createDeflateRaw = function(o) {
                    return new DeflateRaw(o);
                };
                exports.createInflateRaw = function(o) {
                    return new InflateRaw(o);
                };
                exports.createGzip = function(o) {
                    return new Gzip(o);
                };
                exports.createGunzip = function(o) {
                    return new Gunzip(o);
                };
                exports.createUnzip = function(o) {
                    return new Unzip(o);
                };
                exports.deflate = function(buffer1, opts, callback) {
                    if ('function' == typeof opts) {
                        callback = opts;
                        opts = {};
                    }
                    return zlibBuffer(new Deflate(opts), buffer1, callback);
                };
                exports.deflateSync = function(buffer1, opts) {
                    return zlibBufferSync(new Deflate(opts), buffer1);
                };
                exports.gzip = function(buffer1, opts, callback) {
                    if ('function' == typeof opts) {
                        callback = opts;
                        opts = {};
                    }
                    return zlibBuffer(new Gzip(opts), buffer1, callback);
                };
                exports.gzipSync = function(buffer1, opts) {
                    return zlibBufferSync(new Gzip(opts), buffer1);
                };
                exports.deflateRaw = function(buffer1, opts, callback) {
                    if ('function' == typeof opts) {
                        callback = opts;
                        opts = {};
                    }
                    return zlibBuffer(new DeflateRaw(opts), buffer1, callback);
                };
                exports.deflateRawSync = function(buffer1, opts) {
                    return zlibBufferSync(new DeflateRaw(opts), buffer1);
                };
                exports.unzip = function(buffer1, opts, callback) {
                    if ('function' == typeof opts) {
                        callback = opts;
                        opts = {};
                    }
                    return zlibBuffer(new Unzip(opts), buffer1, callback);
                };
                exports.unzipSync = function(buffer1, opts) {
                    return zlibBufferSync(new Unzip(opts), buffer1);
                };
                exports.inflate = function(buffer1, opts, callback) {
                    if ('function' == typeof opts) {
                        callback = opts;
                        opts = {};
                    }
                    return zlibBuffer(new Inflate(opts), buffer1, callback);
                };
                exports.inflateSync = function(buffer1, opts) {
                    return zlibBufferSync(new Inflate(opts), buffer1);
                };
                exports.gunzip = function(buffer1, opts, callback) {
                    if ('function' == typeof opts) {
                        callback = opts;
                        opts = {};
                    }
                    return zlibBuffer(new Gunzip(opts), buffer1, callback);
                };
                exports.gunzipSync = function(buffer1, opts) {
                    return zlibBufferSync(new Gunzip(opts), buffer1);
                };
                exports.inflateRaw = function(buffer1, opts, callback) {
                    if ('function' == typeof opts) {
                        callback = opts;
                        opts = {};
                    }
                    return zlibBuffer(new InflateRaw(opts), buffer1, callback);
                };
                exports.inflateRawSync = function(buffer1, opts) {
                    return zlibBufferSync(new InflateRaw(opts), buffer1);
                };
                function zlibBuffer(engine, buffer1, callback) {
                    var buffers = [];
                    var nread = 0;
                    engine.on('error', onError);
                    engine.on('end', onEnd);
                    engine.end(buffer1);
                    flow();
                    function flow() {
                        var chunk;
                        while(null !== (chunk = engine.read())){
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
                        if (nread >= kMaxLength) err = RangeError(kRangeErrorMessage);
                        else buf = Buffer.concat(buffers, nread);
                        buffers = [];
                        engine.close();
                        callback(err, buf);
                    }
                }
                function zlibBufferSync(engine, buffer1) {
                    if ('string' == typeof buffer1) buffer1 = Buffer.from(buffer1);
                    if (!Buffer.isBuffer(buffer1)) throw TypeError('Not a string or buffer');
                    var flushFlag = engine._finishFlushFlag;
                    return engine._processChunk(buffer1, flushFlag);
                }
                function Deflate(opts) {
                    if (!(this instanceof Deflate)) return new Deflate(opts);
                    Zlib.call(this, opts, binding$1.DEFLATE);
                }
                function Inflate(opts) {
                    if (!(this instanceof Inflate)) return new Inflate(opts);
                    Zlib.call(this, opts, binding$1.INFLATE);
                }
                function Gzip(opts) {
                    if (!(this instanceof Gzip)) return new Gzip(opts);
                    Zlib.call(this, opts, binding$1.GZIP);
                }
                function Gunzip(opts) {
                    if (!(this instanceof Gunzip)) return new Gunzip(opts);
                    Zlib.call(this, opts, binding$1.GUNZIP);
                }
                function DeflateRaw(opts) {
                    if (!(this instanceof DeflateRaw)) return new DeflateRaw(opts);
                    Zlib.call(this, opts, binding$1.DEFLATERAW);
                }
                function InflateRaw(opts) {
                    if (!(this instanceof InflateRaw)) return new InflateRaw(opts);
                    Zlib.call(this, opts, binding$1.INFLATERAW);
                }
                function Unzip(opts) {
                    if (!(this instanceof Unzip)) return new Unzip(opts);
                    Zlib.call(this, opts, binding$1.UNZIP);
                }
                function isValidFlushFlag(flag) {
                    return flag === binding$1.Z_NO_FLUSH || flag === binding$1.Z_PARTIAL_FLUSH || flag === binding$1.Z_SYNC_FLUSH || flag === binding$1.Z_FULL_FLUSH || flag === binding$1.Z_FINISH || flag === binding$1.Z_BLOCK;
                }
                function Zlib(opts, mode) {
                    var _this = this;
                    this._opts = opts = opts || {};
                    this._chunkSize = opts.chunkSize || exports.Z_DEFAULT_CHUNK;
                    Transform.call(this, opts);
                    if (opts.flush && !isValidFlushFlag(opts.flush)) {
                        throw Error('Invalid flush flag: ' + opts.flush);
                    }
                    if (opts.finishFlush && !isValidFlushFlag(opts.finishFlush)) {
                        throw Error('Invalid flush flag: ' + opts.finishFlush);
                    }
                    this._flushFlag = opts.flush || binding$1.Z_NO_FLUSH;
                    this._finishFlushFlag = void 0 !== opts.finishFlush ? opts.finishFlush : binding$1.Z_FINISH;
                    if (opts.chunkSize) {
                        if (opts.chunkSize < exports.Z_MIN_CHUNK || opts.chunkSize > exports.Z_MAX_CHUNK) {
                            throw Error('Invalid chunk size: ' + opts.chunkSize);
                        }
                    }
                    if (opts.windowBits) {
                        if (opts.windowBits < exports.Z_MIN_WINDOWBITS || opts.windowBits > exports.Z_MAX_WINDOWBITS) {
                            throw Error('Invalid windowBits: ' + opts.windowBits);
                        }
                    }
                    if (opts.level) {
                        if (opts.level < exports.Z_MIN_LEVEL || opts.level > exports.Z_MAX_LEVEL) {
                            throw Error('Invalid compression level: ' + opts.level);
                        }
                    }
                    if (opts.memLevel) {
                        if (opts.memLevel < exports.Z_MIN_MEMLEVEL || opts.memLevel > exports.Z_MAX_MEMLEVEL) {
                            throw Error('Invalid memLevel: ' + opts.memLevel);
                        }
                    }
                    if (opts.strategy) {
                        if (opts.strategy != exports.Z_FILTERED && opts.strategy != exports.Z_HUFFMAN_ONLY && opts.strategy != exports.Z_RLE && opts.strategy != exports.Z_FIXED && opts.strategy != exports.Z_DEFAULT_STRATEGY) {
                            throw Error('Invalid strategy: ' + opts.strategy);
                        }
                    }
                    if (opts.dictionary) {
                        if (!Buffer.isBuffer(opts.dictionary)) {
                            throw Error('Invalid dictionary: it should be a Buffer instance');
                        }
                    }
                    this._handle = new binding$1.Zlib(mode);
                    var self1 = this;
                    this._hadError = false;
                    this._handle.onerror = function(message, errno) {
                        _close(self1);
                        self1._hadError = true;
                        var error = Error(message);
                        error.errno = errno;
                        error.code = exports.codes[errno];
                        self1.emit('error', error);
                    };
                    var level = exports.Z_DEFAULT_COMPRESSION;
                    if ('number' == typeof opts.level) level = opts.level;
                    var strategy = exports.Z_DEFAULT_STRATEGY;
                    if ('number' == typeof opts.strategy) strategy = opts.strategy;
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
                Zlib.prototype.params = function(level, strategy, callback) {
                    if (level < exports.Z_MIN_LEVEL || level > exports.Z_MAX_LEVEL) {
                        throw RangeError('Invalid compression level: ' + level);
                    }
                    if (strategy != exports.Z_FILTERED && strategy != exports.Z_HUFFMAN_ONLY && strategy != exports.Z_RLE && strategy != exports.Z_FIXED && strategy != exports.Z_DEFAULT_STRATEGY) {
                        throw TypeError('Invalid strategy: ' + strategy);
                    }
                    if (this._level !== level || this._strategy !== strategy) {
                        var self1 = this;
                        this.flush(binding$1.Z_SYNC_FLUSH, function() {
                            assert(self1._handle, 'zlib binding closed');
                            self1._handle.params(level, strategy);
                            if (!self1._hadError) {
                                self1._level = level;
                                self1._strategy = strategy;
                                if (callback) callback();
                            }
                        });
                    } else {
                        browser$1$1.nextTick(callback);
                    }
                };
                Zlib.prototype.reset = function() {
                    assert(this._handle, 'zlib binding closed');
                    return this._handle.reset();
                };
                Zlib.prototype._flush = function(callback) {
                    this._transform(Buffer.alloc(0), '', callback);
                };
                Zlib.prototype.flush = function(kind, callback) {
                    var _this2 = this;
                    var ws = this._writableState;
                    if ('function' == typeof kind || void 0 === kind && !callback) {
                        callback = kind;
                        kind = binding$1.Z_FULL_FLUSH;
                    }
                    if (ws.ended) {
                        if (callback) browser$1$1.nextTick(callback);
                    } else if (ws.ending) {
                        if (callback) this.once('end', callback);
                    } else if (ws.needDrain) {
                        if (callback) this.once('drain', function() {
                            return _this2.flush(kind, callback);
                        });
                    } else {
                        this._flushFlag = kind;
                        this.write(Buffer.alloc(0), '', callback);
                    }
                };
                Zlib.prototype.close = function(callback) {
                    _close(this, callback);
                    browser$1$1.nextTick(emitCloseNT, this);
                };
                function _close(engine, callback) {
                    if (callback) browser$1$1.nextTick(callback);
                    if (!engine._handle) return;
                    engine._handle.close();
                    engine._handle = null;
                }
                function emitCloseNT(self1) {
                    self1.emit('close');
                }
                Zlib.prototype._transform = function(chunk, encoding, cb) {
                    var flushFlag;
                    var ws = this._writableState;
                    var ending = ws.ending || ws.ended;
                    var last = ending && (!chunk || ws.length === chunk.length);
                    if (null !== chunk && !Buffer.isBuffer(chunk)) return cb(Error('invalid input'));
                    if (!this._handle) return cb(Error('zlib binding closed'));
                    if (last) flushFlag = this._finishFlushFlag;
                    else {
                        flushFlag = this._flushFlag;
                        if (chunk.length >= ws.length) this._flushFlag = this._opts.flush || binding$1.Z_NO_FLUSH;
                    }
                    this._processChunk(chunk, flushFlag, cb);
                };
                Zlib.prototype._processChunk = function(chunk, flushFlag, cb) {
                    var availInBefore = chunk && chunk.length;
                    var availOutBefore = this._chunkSize - this._offset;
                    var inOff = 0;
                    var self1 = this;
                    var async = 'function' == typeof cb;
                    if (!async) {
                        var buffers = [];
                        var nread = 0;
                        var error;
                        this.on('error', function(er) {
                            error = er;
                        });
                        assert(this._handle, 'zlib binding closed');
                        do var res = this._handle.writeSync(flushFlag, chunk, inOff, availInBefore, this._buffer, this._offset, availOutBefore);
                        while (!this._hadError && callback(res[0], res[1]))
                        if (this._hadError) {
                            throw error;
                        }
                        if (nread >= kMaxLength) {
                            _close(this);
                            throw RangeError(kRangeErrorMessage);
                        }
                        var buf = Buffer.concat(buffers, nread);
                        _close(this);
                        return buf;
                    }
                    assert(this._handle, 'zlib binding closed');
                    var req = this._handle.write(flushFlag, chunk, inOff, availInBefore, this._buffer, this._offset, availOutBefore);
                    req.buffer = chunk;
                    req.callback = callback;
                    function callback(availInAfter, availOutAfter) {
                        if (this) {
                            this.buffer = null;
                            this.callback = null;
                        }
                        if (self1._hadError) return;
                        var have = availOutBefore - availOutAfter;
                        assert(have >= 0, 'have should not go down');
                        if (have > 0) {
                            var out = self1._buffer.slice(self1._offset, self1._offset + have);
                            self1._offset += have;
                            if (async) self1.push(out);
                            else {
                                buffers.push(out);
                                nread += out.length;
                            }
                        }
                        if (0 === availOutAfter || self1._offset >= self1._chunkSize) {
                            availOutBefore = self1._chunkSize;
                            self1._offset = 0;
                            self1._buffer = Buffer.allocUnsafe(self1._chunkSize);
                        }
                        if (0 === availOutAfter) {
                            inOff += availInBefore - availInAfter;
                            availInBefore = availInAfter;
                            if (!async) return true;
                            var newReq = self1._handle.write(flushFlag, chunk, inOff, availInBefore, self1._buffer, self1._offset, self1._chunkSize);
                            newReq.callback = callback;
                            newReq.buffer = chunk;
                            return;
                        }
                        if (!async) return false;
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
            var PNG = function() {
                PNG.decode = function decode(path, fn) {
                    throw Error('PNG.decode not available in browser build');
                };
                PNG.load = function load(path) {
                    throw Error('PNG.load not available in browser build');
                };
                function PNG(data) {
                    var i;
                    this.data = data;
                    this.pos = 8;
                    this.palette = [];
                    this.imgData = [];
                    this.transparency = {};
                    this.text = {};
                    while(true){
                        var chunkSize = this.readUInt32();
                        var section = '';
                        for(i = 0; i < 4; i++)section += String.fromCharCode(this.data[this.pos++]);
                        switch(section){
                            case 'IHDR':
                                this.width = this.readUInt32();
                                this.height = this.readUInt32();
                                this.bits = this.data[this.pos++];
                                this.colorType = this.data[this.pos++];
                                this.compressionMethod = this.data[this.pos++];
                                this.filterMethod = this.data[this.pos++];
                                this.interlaceMethod = this.data[this.pos++];
                                break;
                            case 'PLTE':
                                this.palette = this.read(chunkSize);
                                break;
                            case 'IDAT':
                                for(i = 0; i < chunkSize; i++)this.imgData.push(this.data[this.pos++]);
                                break;
                            case 'tRNS':
                                this.transparency = {};
                                switch(this.colorType){
                                    case 3:
                                        this.transparency.indexed = this.read(chunkSize);
                                        var short = 255 - this.transparency.indexed.length;
                                        if (short > 0) {
                                            for(i = 0; i < short; i++)this.transparency.indexed.push(255);
                                        }
                                        break;
                                    case 0:
                                        this.transparency.grayscale = this.read(chunkSize)[0];
                                        break;
                                    case 2:
                                        this.transparency.rgb = this.read(chunkSize);
                                        break;
                                }
                                break;
                            case 'tEXt':
                                var text = this.read(chunkSize);
                                var index = text.indexOf(0);
                                var key = String.fromCharCode.apply(String, text.slice(0, index));
                                this.text[key] = String.fromCharCode.apply(String, text.slice(index + 1));
                                break;
                            case 'IEND':
                                switch(this.colorType){
                                    case 0:
                                    case 3:
                                    case 4:
                                        this.colors = 1;
                                        break;
                                    case 2:
                                    case 6:
                                        this.colors = 3;
                                        break;
                                }
                                this.hasAlphaChannel = [
                                    4,
                                    6
                                ].includes(this.colorType);
                                var colors = this.colors + (this.hasAlphaChannel ? 1 : 0);
                                this.pixelBitlength = this.bits * colors;
                                switch(this.colors){
                                    case 1:
                                        this.colorSpace = 'DeviceGray';
                                        break;
                                    case 3:
                                        this.colorSpace = 'DeviceRGB';
                                        break;
                                }
                                this.imgData = Buffer$1.from(this.imgData);
                                return;
                            default:
                                this.pos += chunkSize;
                        }
                        this.pos += 4;
                        if (this.pos > this.data.length) {
                            throw Error('Incomplete or corrupt PNG file');
                        }
                    }
                }
                var _proto = PNG.prototype;
                _proto.read = function read(bytes) {
                    var result = Array(bytes);
                    for(var i = 0; i < bytes; i++)result[i] = this.data[this.pos++];
                    return result;
                };
                _proto.readUInt32 = function readUInt32() {
                    var b1 = this.data[this.pos++] << 24;
                    var b2 = this.data[this.pos++] << 16;
                    var b3 = this.data[this.pos++] << 8;
                    var b4 = this.data[this.pos++];
                    return b1 | b2 | b3 | b4;
                };
                _proto.readUInt16 = function readUInt16() {
                    var b1 = this.data[this.pos++] << 8;
                    var b2 = this.data[this.pos++];
                    return b1 | b2;
                };
                _proto.decodePixels = function decodePixels(fn) {
                    var _this = this;
                    return lib.inflate(this.imgData, function(err, data) {
                        if (err) throw err;
                        var pos = 0;
                        var width = _this.width, height = _this.height;
                        var pixelBytes = _this.pixelBitlength / 8;
                        var pixels = Buffer$1.alloc(width * height * pixelBytes);
                        function pass(x0, y0, dx, dy, singlePass) {
                            if (void 0 === singlePass) singlePass = false;
                            var w = Math.ceil((width - x0) / dx);
                            var h = Math.ceil((height - y0) / dy);
                            var scanlineLength = pixelBytes * w;
                            var buffer = singlePass ? pixels : Buffer$1.alloc(scanlineLength * h);
                            var row = 0;
                            var c = 0;
                            while(row < h && pos < data.length){
                                var byte;
                                var col;
                                var i;
                                var left;
                                var upper;
                                switch(data[pos++]){
                                    case 0:
                                        for(i = 0; i < scanlineLength; i++)buffer[c++] = data[pos++];
                                        break;
                                    case 1:
                                        for(i = 0; i < scanlineLength; i++){
                                            byte = data[pos++];
                                            left = i < pixelBytes ? 0 : buffer[c - pixelBytes];
                                            buffer[c++] = (byte + left) % 256;
                                        }
                                        break;
                                    case 2:
                                        for(i = 0; i < scanlineLength; i++){
                                            byte = data[pos++];
                                            col = (i - i % pixelBytes) / pixelBytes;
                                            upper = row && buffer[(row - 1) * scanlineLength + col * pixelBytes + i % pixelBytes];
                                            buffer[c++] = (upper + byte) % 256;
                                        }
                                        break;
                                    case 3:
                                        for(i = 0; i < scanlineLength; i++){
                                            byte = data[pos++];
                                            col = (i - i % pixelBytes) / pixelBytes;
                                            left = i < pixelBytes ? 0 : buffer[c - pixelBytes];
                                            upper = row && buffer[(row - 1) * scanlineLength + col * pixelBytes + i % pixelBytes];
                                            buffer[c++] = (byte + Math.floor((left + upper) / 2)) % 256;
                                        }
                                        break;
                                    case 4:
                                        for(i = 0; i < scanlineLength; i++){
                                            var paeth;
                                            var upperLeft;
                                            byte = data[pos++];
                                            col = (i - i % pixelBytes) / pixelBytes;
                                            left = i < pixelBytes ? 0 : buffer[c - pixelBytes];
                                            if (0 === row) upper = upperLeft = 0;
                                            else {
                                                upper = buffer[(row - 1) * scanlineLength + col * pixelBytes + i % pixelBytes];
                                                upperLeft = col && buffer[(row - 1) * scanlineLength + (col - 1) * pixelBytes + i % pixelBytes];
                                            }
                                            var p = left + upper - upperLeft;
                                            var pa = Math.abs(p - left);
                                            var pb = Math.abs(p - upper);
                                            var pc = Math.abs(p - upperLeft);
                                            paeth = pa <= pb && pa <= pc ? left : pb <= pc ? upper : upperLeft;
                                            buffer[c++] = (byte + paeth) % 256;
                                        }
                                        break;
                                    default:
                                        throw Error("Invalid filter algorithm: " + data[pos - 1]);
                                }
                                if (!singlePass) {
                                    var pixelsPos = ((y0 + row * dy) * width + x0) * pixelBytes;
                                    var bufferPos = row * scanlineLength;
                                    for(i = 0; i < w; i++){
                                        for(var j = 0; j < pixelBytes; j++)pixels[pixelsPos++] = buffer[bufferPos++];
                                        pixelsPos += (dx - 1) * pixelBytes;
                                    }
                                }
                                row++;
                            }
                        }
                        if (1 === _this.interlaceMethod) {
                            pass(0, 0, 8, 8);
                            pass(4, 0, 8, 8);
                            pass(0, 4, 4, 8);
                            pass(2, 0, 4, 4);
                            pass(0, 2, 2, 4);
                            pass(1, 0, 2, 2);
                            pass(0, 1, 1, 2);
                        } else {
                            pass(0, 0, 1, 1, true);
                        }
                        return fn(pixels);
                    });
                };
                _proto.decodePalette = function decodePalette() {
                    var palette = this.palette;
                    var length = palette.length;
                    var transparency = this.transparency.indexed || [];
                    var ret = Buffer$1.alloc(transparency.length + length);
                    var pos = 0;
                    var c = 0;
                    for(var i = 0; i < length; i += 3){
                        var left;
                        ret[pos++] = palette[i];
                        ret[pos++] = palette[i + 1];
                        ret[pos++] = palette[i + 2];
                        ret[pos++] = null != (left = transparency[c++]) ? left : 255;
                    }
                    return ret;
                };
                _proto.copyToImageData = function copyToImageData(imageData, pixels) {
                    var j;
                    var k;
                    var colors = this.colors;
                    var palette = null;
                    var alpha = this.hasAlphaChannel;
                    if (this.palette.length) {
                        palette = this._decodedPalette || (this._decodedPalette = this.decodePalette());
                        colors = 4;
                        alpha = true;
                    }
                    var data = imageData.data || imageData;
                    var length = data.length;
                    var input = palette || pixels;
                    var i = j = 0;
                    if (1 === colors) {
                        while(i < length){
                            k = palette ? 4 * pixels[i / 4] : j;
                            var v = input[k++];
                            data[i++] = v;
                            data[i++] = v;
                            data[i++] = v;
                            data[i++] = alpha ? input[k++] : 255;
                            j = k;
                        }
                    } else {
                        while(i < length){
                            k = palette ? 4 * pixels[i / 4] : j;
                            data[i++] = input[k++];
                            data[i++] = input[k++];
                            data[i++] = input[k++];
                            data[i++] = alpha ? input[k++] : 255;
                            j = k;
                        }
                    }
                };
                _proto.decode = function decode(fn) {
                    var _this2 = this;
                    var ret = Buffer$1.alloc(this.width * this.height * 4);
                    return this.decodePixels(function(pixels) {
                        _this2.copyToImageData(ret, pixels);
                        return fn(ret);
                    });
                };
                return PNG;
            }();
        }
    }
]);
