"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
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
            var currentQueue$1, ReflectOwnKeys, undefined$1, GeneratorFunction, cachedSetTimeout, cachedClearTimeout, currentQueue, assert$1, util, keysShim$1, isDeepEqual, isDeepStrictEqual, static_l_desc, static_d_desc, static_bl_desc, configuration_table, lenfix, distfix, global$1 = void 0 !== __webpack_require__.g ? __webpack_require__.g : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, lookup$1 = [], revLookup$1 = [], Arr$1 = 'undefined' != typeof Uint8Array ? Uint8Array : Array, inited = !1;
            function init() {
                inited = !0;
                for(var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', i = 0, len = code.length; i < len; ++i)lookup$1[i] = code[i], revLookup$1[code.charCodeAt(i)] = i;
                revLookup$1['-'.charCodeAt(0)] = 62, revLookup$1['_'.charCodeAt(0)] = 63;
            }
            function toByteArray$1(b64) {
                inited || init();
                var i, j, l, tmp, placeHolders, arr, len = b64.length;
                if (len % 4 > 0) throw Error('Invalid string. Length must be a multiple of 4');
                placeHolders = '=' === b64[len - 2] ? 2 : '=' === b64[len - 1] ? 1 : 0, arr = new Arr$1(3 * len / 4 - placeHolders), l = placeHolders > 0 ? len - 4 : len;
                var L = 0;
                for(i = 0, j = 0; i < l; i += 4, j += 3)tmp = revLookup$1[b64.charCodeAt(i)] << 18 | revLookup$1[b64.charCodeAt(i + 1)] << 12 | revLookup$1[b64.charCodeAt(i + 2)] << 6 | revLookup$1[b64.charCodeAt(i + 3)], arr[L++] = tmp >> 16 & 0xFF, arr[L++] = tmp >> 8 & 0xFF, arr[L++] = 0xFF & tmp;
                return 2 === placeHolders ? (tmp = revLookup$1[b64.charCodeAt(i)] << 2 | revLookup$1[b64.charCodeAt(i + 1)] >> 4, arr[L++] = 0xFF & tmp) : 1 === placeHolders && (tmp = revLookup$1[b64.charCodeAt(i)] << 10 | revLookup$1[b64.charCodeAt(i + 1)] << 4 | revLookup$1[b64.charCodeAt(i + 2)] >> 2, arr[L++] = tmp >> 8 & 0xFF, arr[L++] = 0xFF & tmp), arr;
            }
            function tripletToBase64$1(num) {
                return lookup$1[num >> 18 & 0x3F] + lookup$1[num >> 12 & 0x3F] + lookup$1[num >> 6 & 0x3F] + lookup$1[0x3F & num];
            }
            function encodeChunk$1(uint8, start, end) {
                for(var output = [], i = start; i < end; i += 3)output.push(tripletToBase64$1((uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2]));
                return output.join('');
            }
            function fromByteArray$1(uint8) {
                inited || init();
                for(var tmp, len = uint8.length, extraBytes = len % 3, output = '', parts = [], maxChunkLength = 16383, i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength)parts.push(encodeChunk$1(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
                return 1 === extraBytes ? (output += lookup$1[(tmp = uint8[len - 1]) >> 2], output += lookup$1[tmp << 4 & 0x3F], output += '==') : 2 === extraBytes && (output += lookup$1[(tmp = (uint8[len - 2] << 8) + uint8[len - 1]) >> 10], output += lookup$1[tmp >> 4 & 0x3F], output += lookup$1[tmp << 2 & 0x3F], output += '='), parts.push(output), parts.join('');
            }
            function read(buffer, offset, isLE, mLen, nBytes) {
                var e, m, eLen = 8 * nBytes - mLen - 1, eMax = (1 << eLen) - 1, eBias = eMax >> 1, nBits = -7, i = isLE ? nBytes - 1 : 0, d = isLE ? -1 : 1, s = buffer[offset + i];
                for(i += d, e = s & (1 << -nBits) - 1, s >>= -nBits, nBits += eLen; nBits > 0; e = 256 * e + buffer[offset + i], i += d, nBits -= 8);
                for(m = e & (1 << -nBits) - 1, e >>= -nBits, nBits += mLen; nBits > 0; m = 256 * m + buffer[offset + i], i += d, nBits -= 8);
                if (0 === e) e = 1 - eBias;
                else {
                    if (e === eMax) return m ? NaN : (s ? -1 : 1) * (1 / 0);
                    m += Math.pow(2, mLen), e -= eBias;
                }
                return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
            }
            function write(buffer, value, offset, isLE, mLen, nBytes) {
                var e, m, c, eLen = 8 * nBytes - mLen - 1, eMax = (1 << eLen) - 1, eBias = eMax >> 1, rt = 23 === mLen ? 0.00000005960464477539062 : 0, i = isLE ? 0 : nBytes - 1, d = isLE ? 1 : -1, s = value < 0 || 0 === value && 1 / value < 0 ? 1 : 0;
                for(value = Math.abs(value), isNaN(value) || value === 1 / 0 ? (m = isNaN(value) ? 1 : 0, e = eMax) : (e = Math.floor(Math.log(value) / Math.LN2), value * (c = Math.pow(2, -e)) < 1 && (e--, c *= 2), e + eBias >= 1 ? value += rt / c : value += rt * Math.pow(2, 1 - eBias), value * c >= 2 && (e++, c /= 2), e + eBias >= eMax ? (m = 0, e = eMax) : e + eBias >= 1 ? (m = (value * c - 1) * Math.pow(2, mLen), e += eBias) : (m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen), e = 0)); mLen >= 8; buffer[offset + i] = 0xff & m, i += d, m /= 256, mLen -= 8);
                for(e = e << mLen | m, eLen += mLen; eLen > 0; buffer[offset + i] = 0xff & e, i += d, e /= 256, eLen -= 8);
                buffer[offset + i - d] |= 128 * s;
            }
            var toString$1 = {}.toString, isArray = Array.isArray || function(arr) {
                return '[object Array]' == toString$1.call(arr);
            };
            function kMaxLength() {
                return Buffer$1.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
            }
            function createBuffer(that, length) {
                if (kMaxLength() < length) throw RangeError('Invalid typed array length');
                return Buffer$1.TYPED_ARRAY_SUPPORT ? (that = new Uint8Array(length)).__proto__ = Buffer$1.prototype : (null === that && (that = new Buffer$1(length)), that.length = length), that;
            }
            function Buffer$1(arg, encodingOrOffset, length) {
                if (!Buffer$1.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer$1)) return new Buffer$1(arg, encodingOrOffset, length);
                if ('number' == typeof arg) {
                    if ('string' == typeof encodingOrOffset) throw Error('If encoding is specified then the first argument must be a string');
                    return allocUnsafe(this, arg);
                }
                return from(this, arg, encodingOrOffset, length);
            }
            function from(that, value, encodingOrOffset, length) {
                if ('number' == typeof value) throw TypeError('"value" argument must not be a number');
                return 'undefined' != typeof ArrayBuffer && value instanceof ArrayBuffer ? fromArrayBuffer(that, value, encodingOrOffset, length) : 'string' == typeof value ? fromString(that, value, encodingOrOffset) : fromObject(that, value);
            }
            function assertSize(size) {
                if ('number' != typeof size) throw TypeError('"size" argument must be a number');
                if (size < 0) throw RangeError('"size" argument must not be negative');
            }
            function alloc(that, size, fill, encoding) {
                return (assertSize(size), size <= 0) ? createBuffer(that, size) : void 0 !== fill ? 'string' == typeof encoding ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill) : createBuffer(that, size);
            }
            function allocUnsafe(that, size) {
                if (assertSize(size), that = createBuffer(that, size < 0 ? 0 : 0 | checked(size)), !Buffer$1.TYPED_ARRAY_SUPPORT) for(var i = 0; i < size; ++i)that[i] = 0;
                return that;
            }
            function fromString(that, string, encoding) {
                if (('string' != typeof encoding || '' === encoding) && (encoding = 'utf8'), !Buffer$1.isEncoding(encoding)) throw TypeError('"encoding" must be a valid string encoding');
                var length = 0 | byteLength$1(string, encoding), actual = (that = createBuffer(that, length)).write(string, encoding);
                return actual !== length && (that = that.slice(0, actual)), that;
            }
            function fromArrayLike(that, array) {
                var length = array.length < 0 ? 0 : 0 | checked(array.length);
                that = createBuffer(that, length);
                for(var i = 0; i < length; i += 1)that[i] = 255 & array[i];
                return that;
            }
            function fromArrayBuffer(that, array, byteOffset, length) {
                if (array.byteLength, byteOffset < 0 || array.byteLength < byteOffset) throw RangeError('\'offset\' is out of bounds');
                if (array.byteLength < byteOffset + (length || 0)) throw RangeError('\'length\' is out of bounds');
                return array = void 0 === byteOffset && void 0 === length ? new Uint8Array(array) : void 0 === length ? new Uint8Array(array, byteOffset) : new Uint8Array(array, byteOffset, length), Buffer$1.TYPED_ARRAY_SUPPORT ? (that = array).__proto__ = Buffer$1.prototype : that = fromArrayLike(that, array), that;
            }
            function fromObject(that, obj) {
                if (internalIsBuffer(obj)) {
                    var len = 0 | checked(obj.length);
                    return 0 === (that = createBuffer(that, len)).length || obj.copy(that, 0, 0, len), that;
                }
                if (obj) {
                    if ('undefined' != typeof ArrayBuffer && obj.buffer instanceof ArrayBuffer || 'length' in obj) return 'number' != typeof obj.length || isnan(obj.length) ? createBuffer(that, 0) : fromArrayLike(that, obj);
                    if ('Buffer' === obj.type && isArray(obj.data)) return fromArrayLike(that, obj.data);
                }
                throw TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
            }
            function checked(length) {
                if (length >= kMaxLength()) throw RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + kMaxLength().toString(16) + ' bytes');
                return 0 | length;
            }
            function internalIsBuffer(b) {
                return !!(null != b && b._isBuffer);
            }
            function byteLength$1(string, encoding) {
                if (internalIsBuffer(string)) return string.length;
                if ('undefined' != typeof ArrayBuffer && 'function' == typeof ArrayBuffer.isView && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) return string.byteLength;
                'string' != typeof string && (string = '' + string);
                var len = string.length;
                if (0 === len) return 0;
                for(var loweredCase = !1;;)switch(encoding){
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
                        encoding = ('' + encoding).toLowerCase(), loweredCase = !0;
                }
            }
            function slowToString(encoding, start, end) {
                var loweredCase = !1;
                if ((void 0 === start || start < 0) && (start = 0), start > this.length || ((void 0 === end || end > this.length) && (end = this.length), end <= 0 || (end >>>= 0) <= (start >>>= 0))) return '';
                for(encoding || (encoding = 'utf8');;)switch(encoding){
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
                        encoding = (encoding + '').toLowerCase(), loweredCase = !0;
                }
            }
            function swap(b, n, m) {
                var i = b[n];
                b[n] = b[m], b[m] = i;
            }
            function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
                if (0 === buffer.length) return -1;
                if ('string' == typeof byteOffset ? (encoding = byteOffset, byteOffset = 0) : byteOffset > 0x7fffffff ? byteOffset = 0x7fffffff : byteOffset < -2147483648 && (byteOffset = -2147483648), isNaN(byteOffset = +byteOffset) && (byteOffset = dir ? 0 : buffer.length - 1), byteOffset < 0 && (byteOffset = buffer.length + byteOffset), byteOffset >= buffer.length) {
                    if (dir) return -1;
                    byteOffset = buffer.length - 1;
                } else if (byteOffset < 0) {
                    if (!dir) return -1;
                    byteOffset = 0;
                }
                if ('string' == typeof val && (val = Buffer$1.from(val, encoding)), internalIsBuffer(val)) return 0 === val.length ? -1 : arrayIndexOf(buffer, val, byteOffset, encoding, dir);
                if ('number' == typeof val) return (val &= 0xFF, Buffer$1.TYPED_ARRAY_SUPPORT && 'function' == typeof Uint8Array.prototype.indexOf) ? dir ? Uint8Array.prototype.indexOf.call(buffer, val, byteOffset) : Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset) : arrayIndexOf(buffer, [
                    val
                ], byteOffset, encoding, dir);
                throw TypeError('val must be string, number or Buffer');
            }
            function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
                var i, indexSize = 1, arrLength = arr.length, valLength = val.length;
                if (void 0 !== encoding && ('ucs2' === (encoding = String(encoding).toLowerCase()) || 'ucs-2' === encoding || 'utf16le' === encoding || 'utf-16le' === encoding)) {
                    if (arr.length < 2 || val.length < 2) return -1;
                    indexSize = 2, arrLength /= 2, valLength /= 2, byteOffset /= 2;
                }
                function read(buf, i) {
                    return 1 === indexSize ? buf[i] : buf.readUInt16BE(i * indexSize);
                }
                if (dir) {
                    var foundIndex = -1;
                    for(i = byteOffset; i < arrLength; i++)if (read(arr, i) === read(val, -1 === foundIndex ? 0 : i - foundIndex)) {
                        if (-1 === foundIndex && (foundIndex = i), i - foundIndex + 1 === valLength) return foundIndex * indexSize;
                    } else -1 !== foundIndex && (i -= i - foundIndex), foundIndex = -1;
                } else for(byteOffset + valLength > arrLength && (byteOffset = arrLength - valLength), i = byteOffset; i >= 0; i--){
                    for(var found = !0, j = 0; j < valLength; j++)if (read(arr, i + j) !== read(val, j)) {
                        found = !1;
                        break;
                    }
                    if (found) return i;
                }
                return -1;
            }
            function hexWrite(buf, string, offset, length) {
                offset = Number(offset) || 0;
                var remaining = buf.length - offset;
                length ? (length = Number(length)) > remaining && (length = remaining) : length = remaining;
                var strLen = string.length;
                if (strLen % 2 != 0) throw TypeError('Invalid hex string');
                length > strLen / 2 && (length = strLen / 2);
                for(var i = 0; i < length; ++i){
                    var parsed = parseInt(string.substr(2 * i, 2), 16);
                    if (isNaN(parsed)) break;
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
            function base64Slice(buf, start, end) {
                return 0 === start && end === buf.length ? fromByteArray$1(buf) : fromByteArray$1(buf.slice(start, end));
            }
            function utf8Slice(buf, start, end) {
                end = Math.min(buf.length, end);
                for(var res = [], i = start; i < end;){
                    var secondByte, thirdByte, fourthByte, tempCodePoint, firstByte = buf[i], codePoint = null, bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;
                    if (i + bytesPerSequence <= end) switch(bytesPerSequence){
                        case 1:
                            firstByte < 0x80 && (codePoint = firstByte);
                            break;
                        case 2:
                            (0xC0 & (secondByte = buf[i + 1])) == 0x80 && (tempCodePoint = (0x1F & firstByte) << 0x6 | 0x3F & secondByte) > 0x7F && (codePoint = tempCodePoint);
                            break;
                        case 3:
                            secondByte = buf[i + 1], thirdByte = buf[i + 2], (0xC0 & secondByte) == 0x80 && (0xC0 & thirdByte) == 0x80 && (tempCodePoint = (0xF & firstByte) << 0xC | (0x3F & secondByte) << 0x6 | 0x3F & thirdByte) > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF) && (codePoint = tempCodePoint);
                            break;
                        case 4:
                            secondByte = buf[i + 1], thirdByte = buf[i + 2], fourthByte = buf[i + 3], (0xC0 & secondByte) == 0x80 && (0xC0 & thirdByte) == 0x80 && (0xC0 & fourthByte) == 0x80 && (tempCodePoint = (0xF & firstByte) << 0x12 | (0x3F & secondByte) << 0xC | (0x3F & thirdByte) << 0x6 | 0x3F & fourthByte) > 0xFFFF && tempCodePoint < 0x110000 && (codePoint = tempCodePoint);
                    }
                    null === codePoint ? (codePoint = 0xFFFD, bytesPerSequence = 1) : codePoint > 0xFFFF && (codePoint -= 0x10000, res.push(codePoint >>> 10 & 0x3FF | 0xD800), codePoint = 0xDC00 | 0x3FF & codePoint), res.push(codePoint), i += bytesPerSequence;
                }
                return decodeCodePointsArray(res);
            }
            Buffer$1.TYPED_ARRAY_SUPPORT = void 0 === global$1.TYPED_ARRAY_SUPPORT || global$1.TYPED_ARRAY_SUPPORT, Buffer$1.poolSize = 8192, Buffer$1._augment = function(arr) {
                return arr.__proto__ = Buffer$1.prototype, arr;
            }, Buffer$1.from = function(value, encodingOrOffset, length) {
                return from(null, value, encodingOrOffset, length);
            }, Buffer$1.TYPED_ARRAY_SUPPORT && (Buffer$1.prototype.__proto__ = Uint8Array.prototype, Buffer$1.__proto__ = Uint8Array), Buffer$1.alloc = function(size, fill, encoding) {
                return alloc(null, size, fill, encoding);
            }, Buffer$1.allocUnsafe = function(size) {
                return allocUnsafe(null, size);
            }, Buffer$1.allocUnsafeSlow = function(size) {
                return allocUnsafe(null, size);
            }, Buffer$1.isBuffer = isBuffer, Buffer$1.compare = function(a, b) {
                if (!internalIsBuffer(a) || !internalIsBuffer(b)) throw TypeError('Arguments must be Buffers');
                if (a === b) return 0;
                for(var x = a.length, y = b.length, i = 0, len = Math.min(x, y); i < len; ++i)if (a[i] !== b[i]) {
                    x = a[i], y = b[i];
                    break;
                }
                return x < y ? -1 : y < x ? 1 : 0;
            }, Buffer$1.isEncoding = function(encoding) {
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
                        return !0;
                    default:
                        return !1;
                }
            }, Buffer$1.concat = function(list, length) {
                if (!isArray(list)) throw TypeError('"list" argument must be an Array of Buffers');
                if (0 === list.length) return Buffer$1.alloc(0);
                if (void 0 === length) for(i = 0, length = 0; i < list.length; ++i)length += list[i].length;
                var i, buffer = Buffer$1.allocUnsafe(length), pos = 0;
                for(i = 0; i < list.length; ++i){
                    var buf = list[i];
                    if (!internalIsBuffer(buf)) throw TypeError('"list" argument must be an Array of Buffers');
                    buf.copy(buffer, pos), pos += buf.length;
                }
                return buffer;
            }, Buffer$1.byteLength = byteLength$1, Buffer$1.prototype._isBuffer = !0, Buffer$1.prototype.swap16 = function() {
                var len = this.length;
                if (len % 2 != 0) throw RangeError('Buffer size must be a multiple of 16-bits');
                for(var i = 0; i < len; i += 2)swap(this, i, i + 1);
                return this;
            }, Buffer$1.prototype.swap32 = function() {
                var len = this.length;
                if (len % 4 != 0) throw RangeError('Buffer size must be a multiple of 32-bits');
                for(var i = 0; i < len; i += 4)swap(this, i, i + 3), swap(this, i + 1, i + 2);
                return this;
            }, Buffer$1.prototype.swap64 = function() {
                var len = this.length;
                if (len % 8 != 0) throw RangeError('Buffer size must be a multiple of 64-bits');
                for(var i = 0; i < len; i += 8)swap(this, i, i + 7), swap(this, i + 1, i + 6), swap(this, i + 2, i + 5), swap(this, i + 3, i + 4);
                return this;
            }, Buffer$1.prototype.toString = function() {
                var length = 0 | this.length;
                return 0 === length ? '' : 0 === arguments.length ? utf8Slice(this, 0, length) : slowToString.apply(this, arguments);
            }, Buffer$1.prototype.equals = function(b) {
                if (!internalIsBuffer(b)) throw TypeError('Argument must be a Buffer');
                return this === b || 0 === Buffer$1.compare(this, b);
            }, Buffer$1.prototype.inspect = function() {
                var str = '', max = 50;
                return this.length > 0 && (str = this.toString('hex', 0, max).match(/.{2}/g).join(' '), this.length > max && (str += ' ... ')), '<Buffer ' + str + '>';
            }, Buffer$1.prototype.compare = function(target, start, end, thisStart, thisEnd) {
                if (!internalIsBuffer(target)) throw TypeError('Argument must be a Buffer');
                if (void 0 === start && (start = 0), void 0 === end && (end = target ? target.length : 0), void 0 === thisStart && (thisStart = 0), void 0 === thisEnd && (thisEnd = this.length), start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) throw RangeError('out of range index');
                if (thisStart >= thisEnd && start >= end) return 0;
                if (thisStart >= thisEnd) return -1;
                if (start >= end) return 1;
                if (start >>>= 0, end >>>= 0, thisStart >>>= 0, thisEnd >>>= 0, this === target) return 0;
                for(var x = thisEnd - thisStart, y = end - start, len = Math.min(x, y), thisCopy = this.slice(thisStart, thisEnd), targetCopy = target.slice(start, end), i = 0; i < len; ++i)if (thisCopy[i] !== targetCopy[i]) {
                    x = thisCopy[i], y = targetCopy[i];
                    break;
                }
                return x < y ? -1 : y < x ? 1 : 0;
            }, Buffer$1.prototype.includes = function(val, byteOffset, encoding) {
                return -1 !== this.indexOf(val, byteOffset, encoding);
            }, Buffer$1.prototype.indexOf = function(val, byteOffset, encoding) {
                return bidirectionalIndexOf(this, val, byteOffset, encoding, !0);
            }, Buffer$1.prototype.lastIndexOf = function(val, byteOffset, encoding) {
                return bidirectionalIndexOf(this, val, byteOffset, encoding, !1);
            }, Buffer$1.prototype.write = function(string, offset, length, encoding) {
                if (void 0 === offset) encoding = 'utf8', length = this.length, offset = 0;
                else if (void 0 === length && 'string' == typeof offset) encoding = offset, length = this.length, offset = 0;
                else if (isFinite(offset)) offset |= 0, isFinite(length) ? (length |= 0, void 0 === encoding && (encoding = 'utf8')) : (encoding = length, length = void 0);
                else throw Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
                var remaining = this.length - offset;
                if ((void 0 === length || length > remaining) && (length = remaining), string.length > 0 && (length < 0 || offset < 0) || offset > this.length) throw RangeError('Attempt to write outside buffer bounds');
                encoding || (encoding = 'utf8');
                for(var loweredCase = !1;;)switch(encoding){
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
                        encoding = ('' + encoding).toLowerCase(), loweredCase = !0;
                }
            }, Buffer$1.prototype.toJSON = function() {
                return {
                    type: 'Buffer',
                    data: Array.prototype.slice.call(this._arr || this, 0)
                };
            };
            var MAX_ARGUMENTS_LENGTH = 0x1000;
            function decodeCodePointsArray(codePoints) {
                var len = codePoints.length;
                if (len <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, codePoints);
                for(var res = '', i = 0; i < len;)res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
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
                (!start || start < 0) && (start = 0), (!end || end < 0 || end > len) && (end = len);
                for(var out = '', i = start; i < end; ++i)out += toHex(buf[i]);
                return out;
            }
            function utf16leSlice(buf, start, end) {
                for(var bytes = buf.slice(start, end), res = '', i = 0; i < bytes.length; i += 2)res += String.fromCharCode(bytes[i] + 256 * bytes[i + 1]);
                return res;
            }
            function checkOffset(offset, ext, length) {
                if (offset % 1 != 0 || offset < 0) throw RangeError('offset is not uint');
                if (offset + ext > length) throw RangeError('Trying to access beyond buffer length');
            }
            function checkInt(buf, value, offset, ext, max, min) {
                if (!internalIsBuffer(buf)) throw TypeError('"buffer" argument must be a Buffer instance');
                if (value > max || value < min) throw RangeError('"value" argument is out of bounds');
                if (offset + ext > buf.length) throw RangeError('Index out of range');
            }
            function objectWriteUInt16(buf, value, offset, littleEndian) {
                value < 0 && (value = 0xffff + value + 1);
                for(var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i)buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
            }
            function objectWriteUInt32(buf, value, offset, littleEndian) {
                value < 0 && (value = 0xffffffff + value + 1);
                for(var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i)buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
            }
            function checkIEEE754(buf, value, offset, ext, max, min) {
                if (offset + ext > buf.length || offset < 0) throw RangeError('Index out of range');
            }
            function writeFloat(buf, value, offset, littleEndian, noAssert) {
                return noAssert || checkIEEE754(buf, value, offset, 4), write(buf, value, offset, littleEndian, 23, 4), offset + 4;
            }
            function writeDouble(buf, value, offset, littleEndian, noAssert) {
                return noAssert || checkIEEE754(buf, value, offset, 8), write(buf, value, offset, littleEndian, 52, 8), offset + 8;
            }
            Buffer$1.prototype.slice = function(start, end) {
                var newBuf, len = this.length;
                if (start = ~~start, end = void 0 === end ? len : ~~end, start < 0 ? (start += len) < 0 && (start = 0) : start > len && (start = len), end < 0 ? (end += len) < 0 && (end = 0) : end > len && (end = len), end < start && (end = start), Buffer$1.TYPED_ARRAY_SUPPORT) (newBuf = this.subarray(start, end)).__proto__ = Buffer$1.prototype;
                else {
                    var sliceLen = end - start;
                    newBuf = new Buffer$1(sliceLen, void 0);
                    for(var i = 0; i < sliceLen; ++i)newBuf[i] = this[i + start];
                }
                return newBuf;
            }, Buffer$1.prototype.readUIntLE = function(offset, byteLength, noAssert) {
                offset |= 0, byteLength |= 0, noAssert || checkOffset(offset, byteLength, this.length);
                for(var val = this[offset], mul = 1, i = 0; ++i < byteLength && (mul *= 0x100);)val += this[offset + i] * mul;
                return val;
            }, Buffer$1.prototype.readUIntBE = function(offset, byteLength, noAssert) {
                offset |= 0, byteLength |= 0, noAssert || checkOffset(offset, byteLength, this.length);
                for(var val = this[offset + --byteLength], mul = 1; byteLength > 0 && (mul *= 0x100);)val += this[offset + --byteLength] * mul;
                return val;
            }, Buffer$1.prototype.readUInt8 = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 1, this.length), this[offset];
            }, Buffer$1.prototype.readUInt16LE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 2, this.length), this[offset] | this[offset + 1] << 8;
            }, Buffer$1.prototype.readUInt16BE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 2, this.length), this[offset] << 8 | this[offset + 1];
            }, Buffer$1.prototype.readUInt32LE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 4, this.length), (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + 0x1000000 * this[offset + 3];
            }, Buffer$1.prototype.readUInt32BE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 4, this.length), 0x1000000 * this[offset] + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
            }, Buffer$1.prototype.readIntLE = function(offset, byteLength, noAssert) {
                offset |= 0, byteLength |= 0, noAssert || checkOffset(offset, byteLength, this.length);
                for(var val = this[offset], mul = 1, i = 0; ++i < byteLength && (mul *= 0x100);)val += this[offset + i] * mul;
                return val >= (mul *= 0x80) && (val -= Math.pow(2, 8 * byteLength)), val;
            }, Buffer$1.prototype.readIntBE = function(offset, byteLength, noAssert) {
                offset |= 0, byteLength |= 0, noAssert || checkOffset(offset, byteLength, this.length);
                for(var i = byteLength, mul = 1, val = this[offset + --i]; i > 0 && (mul *= 0x100);)val += this[offset + --i] * mul;
                return val >= (mul *= 0x80) && (val -= Math.pow(2, 8 * byteLength)), val;
            }, Buffer$1.prototype.readInt8 = function(offset, noAssert) {
                return (noAssert || checkOffset(offset, 1, this.length), 0x80 & this[offset]) ? -((0xff - this[offset] + 1) * 1) : this[offset];
            }, Buffer$1.prototype.readInt16LE = function(offset, noAssert) {
                noAssert || checkOffset(offset, 2, this.length);
                var val = this[offset] | this[offset + 1] << 8;
                return 0x8000 & val ? 0xFFFF0000 | val : val;
            }, Buffer$1.prototype.readInt16BE = function(offset, noAssert) {
                noAssert || checkOffset(offset, 2, this.length);
                var val = this[offset + 1] | this[offset] << 8;
                return 0x8000 & val ? 0xFFFF0000 | val : val;
            }, Buffer$1.prototype.readInt32LE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 4, this.length), this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
            }, Buffer$1.prototype.readInt32BE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 4, this.length), this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
            }, Buffer$1.prototype.readFloatLE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 4, this.length), read(this, offset, !0, 23, 4);
            }, Buffer$1.prototype.readFloatBE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 4, this.length), read(this, offset, !1, 23, 4);
            }, Buffer$1.prototype.readDoubleLE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 8, this.length), read(this, offset, !0, 52, 8);
            }, Buffer$1.prototype.readDoubleBE = function(offset, noAssert) {
                return noAssert || checkOffset(offset, 8, this.length), read(this, offset, !1, 52, 8);
            }, Buffer$1.prototype.writeUIntLE = function(value, offset, byteLength, noAssert) {
                value = +value, offset |= 0, byteLength |= 0, noAssert || checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength) - 1, 0);
                var mul = 1, i = 0;
                for(this[offset] = 0xFF & value; ++i < byteLength && (mul *= 0x100);)this[offset + i] = value / mul & 0xFF;
                return offset + byteLength;
            }, Buffer$1.prototype.writeUIntBE = function(value, offset, byteLength, noAssert) {
                value = +value, offset |= 0, byteLength |= 0, noAssert || checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength) - 1, 0);
                var i = byteLength - 1, mul = 1;
                for(this[offset + i] = 0xFF & value; --i >= 0 && (mul *= 0x100);)this[offset + i] = value / mul & 0xFF;
                return offset + byteLength;
            }, Buffer$1.prototype.writeUInt8 = function(value, offset, noAssert) {
                return value = +value, offset |= 0, noAssert || checkInt(this, value, offset, 1, 0xff, 0), Buffer$1.TYPED_ARRAY_SUPPORT || (value = Math.floor(value)), this[offset] = 0xff & value, offset + 1;
            }, Buffer$1.prototype.writeUInt16LE = function(value, offset, noAssert) {
                return value = +value, offset |= 0, noAssert || checkInt(this, value, offset, 2, 0xffff, 0), Buffer$1.TYPED_ARRAY_SUPPORT ? (this[offset] = 0xff & value, this[offset + 1] = value >>> 8) : objectWriteUInt16(this, value, offset, !0), offset + 2;
            }, Buffer$1.prototype.writeUInt16BE = function(value, offset, noAssert) {
                return value = +value, offset |= 0, noAssert || checkInt(this, value, offset, 2, 0xffff, 0), Buffer$1.TYPED_ARRAY_SUPPORT ? (this[offset] = value >>> 8, this[offset + 1] = 0xff & value) : objectWriteUInt16(this, value, offset, !1), offset + 2;
            }, Buffer$1.prototype.writeUInt32LE = function(value, offset, noAssert) {
                return value = +value, offset |= 0, noAssert || checkInt(this, value, offset, 4, 0xffffffff, 0), Buffer$1.TYPED_ARRAY_SUPPORT ? (this[offset + 3] = value >>> 24, this[offset + 2] = value >>> 16, this[offset + 1] = value >>> 8, this[offset] = 0xff & value) : objectWriteUInt32(this, value, offset, !0), offset + 4;
            }, Buffer$1.prototype.writeUInt32BE = function(value, offset, noAssert) {
                return value = +value, offset |= 0, noAssert || checkInt(this, value, offset, 4, 0xffffffff, 0), Buffer$1.TYPED_ARRAY_SUPPORT ? (this[offset] = value >>> 24, this[offset + 1] = value >>> 16, this[offset + 2] = value >>> 8, this[offset + 3] = 0xff & value) : objectWriteUInt32(this, value, offset, !1), offset + 4;
            }, Buffer$1.prototype.writeIntLE = function(value, offset, byteLength, noAssert) {
                if (value = +value, offset |= 0, !noAssert) {
                    var limit = Math.pow(2, 8 * byteLength - 1);
                    checkInt(this, value, offset, byteLength, limit - 1, -limit);
                }
                var i = 0, mul = 1, sub = 0;
                for(this[offset] = 0xFF & value; ++i < byteLength && (mul *= 0x100);)value < 0 && 0 === sub && 0 !== this[offset + i - 1] && (sub = 1), this[offset + i] = (value / mul >> 0) - sub & 0xFF;
                return offset + byteLength;
            }, Buffer$1.prototype.writeIntBE = function(value, offset, byteLength, noAssert) {
                if (value = +value, offset |= 0, !noAssert) {
                    var limit = Math.pow(2, 8 * byteLength - 1);
                    checkInt(this, value, offset, byteLength, limit - 1, -limit);
                }
                var i = byteLength - 1, mul = 1, sub = 0;
                for(this[offset + i] = 0xFF & value; --i >= 0 && (mul *= 0x100);)value < 0 && 0 === sub && 0 !== this[offset + i + 1] && (sub = 1), this[offset + i] = (value / mul >> 0) - sub & 0xFF;
                return offset + byteLength;
            }, Buffer$1.prototype.writeInt8 = function(value, offset, noAssert) {
                return value = +value, offset |= 0, noAssert || checkInt(this, value, offset, 1, 0x7f, -128), Buffer$1.TYPED_ARRAY_SUPPORT || (value = Math.floor(value)), value < 0 && (value = 0xff + value + 1), this[offset] = 0xff & value, offset + 1;
            }, Buffer$1.prototype.writeInt16LE = function(value, offset, noAssert) {
                return value = +value, offset |= 0, noAssert || checkInt(this, value, offset, 2, 0x7fff, -32768), Buffer$1.TYPED_ARRAY_SUPPORT ? (this[offset] = 0xff & value, this[offset + 1] = value >>> 8) : objectWriteUInt16(this, value, offset, !0), offset + 2;
            }, Buffer$1.prototype.writeInt16BE = function(value, offset, noAssert) {
                return value = +value, offset |= 0, noAssert || checkInt(this, value, offset, 2, 0x7fff, -32768), Buffer$1.TYPED_ARRAY_SUPPORT ? (this[offset] = value >>> 8, this[offset + 1] = 0xff & value) : objectWriteUInt16(this, value, offset, !1), offset + 2;
            }, Buffer$1.prototype.writeInt32LE = function(value, offset, noAssert) {
                return value = +value, offset |= 0, noAssert || checkInt(this, value, offset, 4, 0x7fffffff, -2147483648), Buffer$1.TYPED_ARRAY_SUPPORT ? (this[offset] = 0xff & value, this[offset + 1] = value >>> 8, this[offset + 2] = value >>> 16, this[offset + 3] = value >>> 24) : objectWriteUInt32(this, value, offset, !0), offset + 4;
            }, Buffer$1.prototype.writeInt32BE = function(value, offset, noAssert) {
                return value = +value, offset |= 0, noAssert || checkInt(this, value, offset, 4, 0x7fffffff, -2147483648), value < 0 && (value = 0xffffffff + value + 1), Buffer$1.TYPED_ARRAY_SUPPORT ? (this[offset] = value >>> 24, this[offset + 1] = value >>> 16, this[offset + 2] = value >>> 8, this[offset + 3] = 0xff & value) : objectWriteUInt32(this, value, offset, !1), offset + 4;
            }, Buffer$1.prototype.writeFloatLE = function(value, offset, noAssert) {
                return writeFloat(this, value, offset, !0, noAssert);
            }, Buffer$1.prototype.writeFloatBE = function(value, offset, noAssert) {
                return writeFloat(this, value, offset, !1, noAssert);
            }, Buffer$1.prototype.writeDoubleLE = function(value, offset, noAssert) {
                return writeDouble(this, value, offset, !0, noAssert);
            }, Buffer$1.prototype.writeDoubleBE = function(value, offset, noAssert) {
                return writeDouble(this, value, offset, !1, noAssert);
            }, Buffer$1.prototype.copy = function(target, targetStart, start, end) {
                if (start || (start = 0), end || 0 === end || (end = this.length), targetStart >= target.length && (targetStart = target.length), targetStart || (targetStart = 0), end > 0 && end < start && (end = start), end === start || 0 === target.length || 0 === this.length) return 0;
                if (targetStart < 0) throw RangeError('targetStart out of bounds');
                if (start < 0 || start >= this.length) throw RangeError('sourceStart out of bounds');
                if (end < 0) throw RangeError('sourceEnd out of bounds');
                end > this.length && (end = this.length), target.length - targetStart < end - start && (end = target.length - targetStart + start);
                var i, len = end - start;
                if (this === target && start < targetStart && targetStart < end) for(i = len - 1; i >= 0; --i)target[i + targetStart] = this[i + start];
                else if (len < 1000 || !Buffer$1.TYPED_ARRAY_SUPPORT) for(i = 0; i < len; ++i)target[i + targetStart] = this[i + start];
                else Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
                return len;
            }, Buffer$1.prototype.fill = function(val, start, end, encoding) {
                if ('string' == typeof val) {
                    if ('string' == typeof start ? (encoding = start, start = 0, end = this.length) : 'string' == typeof end && (encoding = end, end = this.length), 1 === val.length) {
                        var i, code = val.charCodeAt(0);
                        code < 256 && (val = code);
                    }
                    if (void 0 !== encoding && 'string' != typeof encoding) throw TypeError('encoding must be a string');
                    if ('string' == typeof encoding && !Buffer$1.isEncoding(encoding)) throw TypeError('Unknown encoding: ' + encoding);
                } else 'number' == typeof val && (val &= 255);
                if (start < 0 || this.length < start || this.length < end) throw RangeError('Out of range index');
                if (end <= start) return this;
                if (start >>>= 0, end = void 0 === end ? this.length : end >>> 0, val || (val = 0), 'number' == typeof val) for(i = start; i < end; ++i)this[i] = val;
                else {
                    var bytes = internalIsBuffer(val) ? val : utf8ToBytes(new Buffer$1(val, encoding).toString()), len = bytes.length;
                    for(i = 0; i < end - start; ++i)this[i + start] = bytes[i % len];
                }
                return this;
            };
            var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
            function base64clean(str) {
                if ((str = stringtrim(str).replace(INVALID_BASE64_RE, '')).length < 2) return '';
                for(; str.length % 4 != 0;)str += '=';
                return str;
            }
            function stringtrim(str) {
                return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
            }
            function toHex(n) {
                return n < 16 ? '0' + n.toString(16) : n.toString(16);
            }
            function utf8ToBytes(string, units) {
                units = units || 1 / 0;
                for(var codePoint, length = string.length, leadSurrogate = null, bytes = [], i = 0; i < length; ++i){
                    if ((codePoint = string.charCodeAt(i)) > 0xD7FF && codePoint < 0xE000) {
                        if (!leadSurrogate) {
                            if (codePoint > 0xDBFF || i + 1 === length) {
                                (units -= 3) > -1 && bytes.push(0xEF, 0xBF, 0xBD);
                                continue;
                            }
                            leadSurrogate = codePoint;
                            continue;
                        }
                        if (codePoint < 0xDC00) {
                            (units -= 3) > -1 && bytes.push(0xEF, 0xBF, 0xBD), leadSurrogate = codePoint;
                            continue;
                        }
                        codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
                    } else leadSurrogate && (units -= 3) > -1 && bytes.push(0xEF, 0xBF, 0xBD);
                    if (leadSurrogate = null, codePoint < 0x80) {
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
                    } else throw Error('Invalid code point');
                }
                return bytes;
            }
            function asciiToBytes(str) {
                for(var byteArray = [], i = 0; i < str.length; ++i)byteArray.push(0xFF & str.charCodeAt(i));
                return byteArray;
            }
            function utf16leToBytes(str, units) {
                for(var c, hi, byteArray = [], i = 0; i < str.length && !((units -= 2) < 0); ++i)hi = (c = str.charCodeAt(i)) >> 8, byteArray.push(c % 256), byteArray.push(hi);
                return byteArray;
            }
            function base64ToBytes(str) {
                return toByteArray$1(base64clean(str));
            }
            function blitBuffer(src, dst, offset, length) {
                for(var i = 0; i < length && !(i + offset >= dst.length) && !(i >= src.length); ++i)dst[i + offset] = src[i];
                return i;
            }
            function isnan(val) {
                return val != val;
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
            var cachedSetTimeout$1 = defaultSetTimout$1, cachedClearTimeout$1 = defaultClearTimeout$1;
            function runTimeout$1(fun) {
                if (cachedSetTimeout$1 === setTimeout) return setTimeout(fun, 0);
                if ((cachedSetTimeout$1 === defaultSetTimout$1 || !cachedSetTimeout$1) && setTimeout) return cachedSetTimeout$1 = setTimeout, setTimeout(fun, 0);
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
                if (cachedClearTimeout$1 === clearTimeout) return clearTimeout(marker);
                if ((cachedClearTimeout$1 === defaultClearTimeout$1 || !cachedClearTimeout$1) && clearTimeout) return cachedClearTimeout$1 = clearTimeout, clearTimeout(marker);
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
            'function' == typeof global$1.setTimeout && (cachedSetTimeout$1 = setTimeout), 'function' == typeof global$1.clearTimeout && (cachedClearTimeout$1 = clearTimeout);
            var queue$1 = [], draining$1 = !1, queueIndex$1 = -1;
            function cleanUpNextTick$1() {
                draining$1 && currentQueue$1 && (draining$1 = !1, currentQueue$1.length ? queue$1 = currentQueue$1.concat(queue$1) : queueIndex$1 = -1, queue$1.length && drainQueue$1());
            }
            function drainQueue$1() {
                if (!draining$1) {
                    var timeout = runTimeout$1(cleanUpNextTick$1);
                    draining$1 = !0;
                    for(var len = queue$1.length; len;){
                        for(currentQueue$1 = queue$1, queue$1 = []; ++queueIndex$1 < len;)currentQueue$1 && currentQueue$1[queueIndex$1].run();
                        queueIndex$1 = -1, len = queue$1.length;
                    }
                    currentQueue$1 = null, draining$1 = !1, runClearTimeout$1(timeout);
                }
            }
            function nextTick(fun) {
                var args = Array(arguments.length - 1);
                if (arguments.length > 1) for(var i = 1; i < arguments.length; i++)args[i - 1] = arguments[i];
                queue$1.push(new Item$1(fun, args)), 1 !== queue$1.length || draining$1 || runTimeout$1(drainQueue$1);
            }
            function Item$1(fun, array) {
                this.fun = fun, this.array = array;
            }
            function noop$1() {}
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
            Item$1.prototype.run = function() {
                this.fun.apply(null, this.array);
            };
            var performance = global$1.performance || {}, performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function() {
                return new Date().getTime();
            };
            function hrtime(previousTimestamp) {
                var clocktime = 1e-3 * performanceNow.call(performance), seconds = Math.floor(clocktime), nanoseconds = Math.floor(clocktime % 1 * 1e9);
                return previousTimestamp && (seconds -= previousTimestamp[0], (nanoseconds -= previousTimestamp[1]) < 0 && (seconds--, nanoseconds += 1e9)), [
                    seconds,
                    nanoseconds
                ];
            }
            var startTime = new Date();
            function uptime() {
                return (new Date() - startTime) / 1000;
            }
            var browser$1$1 = {
                nextTick: nextTick,
                title: 'browser',
                browser: !0,
                env: {},
                argv: [],
                version: '',
                versions: {},
                on: noop$1,
                addListener: noop$1,
                once: noop$1,
                off: noop$1,
                removeListener: noop$1,
                removeAllListeners: noop$1,
                emit: noop$1,
                binding: binding$1,
                cwd: cwd,
                chdir: chdir,
                umask: umask,
                hrtime: hrtime,
                platform: 'browser',
                release: {},
                config: {},
                uptime: uptime
            }, commonjsGlobal = 'undefined' != typeof globalThis ? globalThis : 'undefined' != typeof window ? window : void 0 !== __webpack_require__.g ? __webpack_require__.g : 'undefined' != typeof self ? self : {};
            function getAugmentedNamespace(n) {
                if (n.__esModule) return n;
                var a = Object.defineProperty({}, '__esModule', {
                    value: !0
                });
                return Object.keys(n).forEach(function(k) {
                    var d = Object.getOwnPropertyDescriptor(n, k);
                    Object.defineProperty(a, k, d.get ? d : {
                        enumerable: !0,
                        get: function() {
                            return n[k];
                        }
                    });
                }), a;
            }
            var lib = {}, buffer = {}, base64Js = {};
            base64Js.byteLength = byteLength, base64Js.toByteArray = toByteArray, base64Js.fromByteArray = fromByteArray;
            for(var lookup = [], revLookup = [], Arr = 'undefined' != typeof Uint8Array ? Uint8Array : Array, code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', i = 0, len = code.length; i < len; ++i)lookup[i] = code[i], revLookup[code.charCodeAt(i)] = i;
            function getLens(b64) {
                var len = b64.length;
                if (len % 4 > 0) throw Error('Invalid string. Length must be a multiple of 4');
                var validLen = b64.indexOf('=');
                -1 === validLen && (validLen = len);
                var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
                return [
                    validLen,
                    placeHoldersLen
                ];
            }
            function byteLength(b64) {
                var lens = getLens(b64), validLen = lens[0], placeHoldersLen = lens[1];
                return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
            }
            function _byteLength(b64, validLen, placeHoldersLen) {
                return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
            }
            function toByteArray(b64) {
                var tmp, i, lens = getLens(b64), validLen = lens[0], placeHoldersLen = lens[1], arr = new Arr(_byteLength(b64, validLen, placeHoldersLen)), curByte = 0, len = placeHoldersLen > 0 ? validLen - 4 : validLen;
                for(i = 0; i < len; i += 4)tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)], arr[curByte++] = tmp >> 16 & 0xFF, arr[curByte++] = tmp >> 8 & 0xFF, arr[curByte++] = 0xFF & tmp;
                return 2 === placeHoldersLen && (tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4, arr[curByte++] = 0xFF & tmp), 1 === placeHoldersLen && (tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2, arr[curByte++] = tmp >> 8 & 0xFF, arr[curByte++] = 0xFF & tmp), arr;
            }
            function tripletToBase64(num) {
                return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[0x3F & num];
            }
            function encodeChunk(uint8, start, end) {
                for(var output = [], i = start; i < end; i += 3)output.push(tripletToBase64((uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (0xFF & uint8[i + 2])));
                return output.join('');
            }
            function fromByteArray(uint8) {
                for(var tmp, len = uint8.length, extraBytes = len % 3, parts = [], maxChunkLength = 16383, i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength)parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
                return 1 === extraBytes ? parts.push(lookup[(tmp = uint8[len - 1]) >> 2] + lookup[tmp << 4 & 0x3F] + '==') : 2 === extraBytes && parts.push(lookup[(tmp = (uint8[len - 2] << 8) + uint8[len - 1]) >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '='), parts.join('');
            }
            revLookup['-'.charCodeAt(0)] = 62, revLookup['_'.charCodeAt(0)] = 63;
            var ieee754 = {};
            ieee754.read = function(buffer, offset, isLE, mLen, nBytes) {
                var e, m, eLen = 8 * nBytes - mLen - 1, eMax = (1 << eLen) - 1, eBias = eMax >> 1, nBits = -7, i = isLE ? nBytes - 1 : 0, d = isLE ? -1 : 1, s = buffer[offset + i];
                for(i += d, e = s & (1 << -nBits) - 1, s >>= -nBits, nBits += eLen; nBits > 0; e = 256 * e + buffer[offset + i], i += d, nBits -= 8);
                for(m = e & (1 << -nBits) - 1, e >>= -nBits, nBits += mLen; nBits > 0; m = 256 * m + buffer[offset + i], i += d, nBits -= 8);
                if (0 === e) e = 1 - eBias;
                else {
                    if (e === eMax) return m ? NaN : (s ? -1 : 1) * (1 / 0);
                    m += Math.pow(2, mLen), e -= eBias;
                }
                return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
            }, ieee754.write = function(buffer, value, offset, isLE, mLen, nBytes) {
                var e, m, c, eLen = 8 * nBytes - mLen - 1, eMax = (1 << eLen) - 1, eBias = eMax >> 1, rt = 23 === mLen ? 0.00000005960464477539062 : 0, i = isLE ? 0 : nBytes - 1, d = isLE ? 1 : -1, s = value < 0 || 0 === value && 1 / value < 0 ? 1 : 0;
                for(value = Math.abs(value), isNaN(value) || value === 1 / 0 ? (m = isNaN(value) ? 1 : 0, e = eMax) : (e = Math.floor(Math.log(value) / Math.LN2), value * (c = Math.pow(2, -e)) < 1 && (e--, c *= 2), e + eBias >= 1 ? value += rt / c : value += rt * Math.pow(2, 1 - eBias), value * c >= 2 && (e++, c /= 2), e + eBias >= eMax ? (m = 0, e = eMax) : e + eBias >= 1 ? (m = (value * c - 1) * Math.pow(2, mLen), e += eBias) : (m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen), e = 0)); mLen >= 8; buffer[offset + i] = 0xff & m, i += d, m /= 256, mLen -= 8);
                for(e = e << mLen | m, eLen += mLen; eLen > 0; buffer[offset + i] = 0xff & e, i += d, e /= 256, eLen -= 8);
                buffer[offset + i - d] |= 128 * s;
            }, function(exports) {
                var base64 = base64Js, ieee754$1 = ieee754, customInspectSymbol = 'function' == typeof Symbol && 'function' == typeof Symbol.for ? Symbol.for('nodejs.util.inspect.custom') : null;
                exports.Buffer = Buffer, exports.SlowBuffer = SlowBuffer, exports.INSPECT_MAX_BYTES = 50;
                var K_MAX_LENGTH = 0x7fffffff;
                function typedArraySupport() {
                    try {
                        var arr = new Uint8Array(1), proto = {
                            foo: function() {
                                return 42;
                            }
                        };
                        return Object.setPrototypeOf(proto, Uint8Array.prototype), Object.setPrototypeOf(arr, proto), 42 === arr.foo();
                    } catch (e) {
                        return !1;
                    }
                }
                function createBuffer(length) {
                    if (length > K_MAX_LENGTH) throw RangeError('The value "' + length + '" is invalid for option "size"');
                    var buf = new Uint8Array(length);
                    return Object.setPrototypeOf(buf, Buffer.prototype), buf;
                }
                function Buffer(arg, encodingOrOffset, length) {
                    if ('number' == typeof arg) {
                        if ('string' == typeof encodingOrOffset) throw TypeError('The "string" argument must be of type string. Received type number');
                        return allocUnsafe(arg);
                    }
                    return from(arg, encodingOrOffset, length);
                }
                function from(value, encodingOrOffset, length) {
                    if ('string' == typeof value) return fromString(value, encodingOrOffset);
                    if (ArrayBuffer.isView(value)) return fromArrayView(value);
                    if (null == value) throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
                    if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer) || 'undefined' != typeof SharedArrayBuffer && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) return fromArrayBuffer(value, encodingOrOffset, length);
                    if ('number' == typeof value) throw TypeError('The "value" argument must not be of type number. Received type number');
                    var valueOf = value.valueOf && value.valueOf();
                    if (null != valueOf && valueOf !== value) return Buffer.from(valueOf, encodingOrOffset, length);
                    var b = fromObject(value);
                    if (b) return b;
                    if ('undefined' != typeof Symbol && null != Symbol.toPrimitive && 'function' == typeof value[Symbol.toPrimitive]) return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length);
                    throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
                }
                function assertSize(size) {
                    if ('number' != typeof size) throw TypeError('"size" argument must be of type number');
                    if (size < 0) throw RangeError('The value "' + size + '" is invalid for option "size"');
                }
                function alloc(size, fill, encoding) {
                    return (assertSize(size), size <= 0) ? createBuffer(size) : void 0 !== fill ? 'string' == typeof encoding ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill) : createBuffer(size);
                }
                function allocUnsafe(size) {
                    return assertSize(size), createBuffer(size < 0 ? 0 : 0 | checked(size));
                }
                function fromString(string, encoding) {
                    if (('string' != typeof encoding || '' === encoding) && (encoding = 'utf8'), !Buffer.isEncoding(encoding)) throw TypeError('Unknown encoding: ' + encoding);
                    var length = 0 | byteLength(string, encoding), buf = createBuffer(length), actual = buf.write(string, encoding);
                    return actual !== length && (buf = buf.slice(0, actual)), buf;
                }
                function fromArrayLike(array) {
                    for(var length = array.length < 0 ? 0 : 0 | checked(array.length), buf = createBuffer(length), i = 0; i < length; i += 1)buf[i] = 255 & array[i];
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
                    var buf;
                    if (byteOffset < 0 || array.byteLength < byteOffset) throw RangeError('"offset" is outside of buffer bounds');
                    if (array.byteLength < byteOffset + (length || 0)) throw RangeError('"length" is outside of buffer bounds');
                    return Object.setPrototypeOf(buf = void 0 === byteOffset && void 0 === length ? new Uint8Array(array) : void 0 === length ? new Uint8Array(array, byteOffset) : new Uint8Array(array, byteOffset, length), Buffer.prototype), buf;
                }
                function fromObject(obj) {
                    if (Buffer.isBuffer(obj)) {
                        var len = 0 | checked(obj.length), buf = createBuffer(len);
                        return 0 === buf.length || obj.copy(buf, 0, 0, len), buf;
                    }
                    return void 0 !== obj.length ? 'number' != typeof obj.length || numberIsNaN(obj.length) ? createBuffer(0) : fromArrayLike(obj) : 'Buffer' === obj.type && Array.isArray(obj.data) ? fromArrayLike(obj.data) : void 0;
                }
                function checked(length) {
                    if (length >= K_MAX_LENGTH) throw RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + ' bytes');
                    return 0 | length;
                }
                function SlowBuffer(length) {
                    return +length != length && (length = 0), Buffer.alloc(+length);
                }
                function byteLength(string, encoding) {
                    if (Buffer.isBuffer(string)) return string.length;
                    if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) return string.byteLength;
                    if ('string' != typeof string) throw TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string);
                    var len = string.length, mustMatch = arguments.length > 2 && !0 === arguments[2];
                    if (!mustMatch && 0 === len) return 0;
                    for(var loweredCase = !1;;)switch(encoding){
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
                            if (loweredCase) return mustMatch ? -1 : utf8ToBytes(string).length;
                            encoding = ('' + encoding).toLowerCase(), loweredCase = !0;
                    }
                }
                function slowToString(encoding, start, end) {
                    var loweredCase = !1;
                    if ((void 0 === start || start < 0) && (start = 0), start > this.length || ((void 0 === end || end > this.length) && (end = this.length), end <= 0 || (end >>>= 0) <= (start >>>= 0))) return '';
                    for(encoding || (encoding = 'utf8');;)switch(encoding){
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
                            encoding = (encoding + '').toLowerCase(), loweredCase = !0;
                    }
                }
                function swap(b, n, m) {
                    var i = b[n];
                    b[n] = b[m], b[m] = i;
                }
                function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
                    if (0 === buffer.length) return -1;
                    if ('string' == typeof byteOffset ? (encoding = byteOffset, byteOffset = 0) : byteOffset > 0x7fffffff ? byteOffset = 0x7fffffff : byteOffset < -2147483648 && (byteOffset = -2147483648), numberIsNaN(byteOffset = +byteOffset) && (byteOffset = dir ? 0 : buffer.length - 1), byteOffset < 0 && (byteOffset = buffer.length + byteOffset), byteOffset >= buffer.length) {
                        if (dir) return -1;
                        byteOffset = buffer.length - 1;
                    } else if (byteOffset < 0) {
                        if (!dir) return -1;
                        byteOffset = 0;
                    }
                    if ('string' == typeof val && (val = Buffer.from(val, encoding)), Buffer.isBuffer(val)) return 0 === val.length ? -1 : arrayIndexOf(buffer, val, byteOffset, encoding, dir);
                    if ('number' == typeof val) return (val &= 0xFF, 'function' == typeof Uint8Array.prototype.indexOf) ? dir ? Uint8Array.prototype.indexOf.call(buffer, val, byteOffset) : Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset) : arrayIndexOf(buffer, [
                        val
                    ], byteOffset, encoding, dir);
                    throw TypeError('val must be string, number or Buffer');
                }
                function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
                    var i, indexSize = 1, arrLength = arr.length, valLength = val.length;
                    if (void 0 !== encoding && ('ucs2' === (encoding = String(encoding).toLowerCase()) || 'ucs-2' === encoding || 'utf16le' === encoding || 'utf-16le' === encoding)) {
                        if (arr.length < 2 || val.length < 2) return -1;
                        indexSize = 2, arrLength /= 2, valLength /= 2, byteOffset /= 2;
                    }
                    function read(buf, i) {
                        return 1 === indexSize ? buf[i] : buf.readUInt16BE(i * indexSize);
                    }
                    if (dir) {
                        var foundIndex = -1;
                        for(i = byteOffset; i < arrLength; i++)if (read(arr, i) === read(val, -1 === foundIndex ? 0 : i - foundIndex)) {
                            if (-1 === foundIndex && (foundIndex = i), i - foundIndex + 1 === valLength) return foundIndex * indexSize;
                        } else -1 !== foundIndex && (i -= i - foundIndex), foundIndex = -1;
                    } else for(byteOffset + valLength > arrLength && (byteOffset = arrLength - valLength), i = byteOffset; i >= 0; i--){
                        for(var found = !0, j = 0; j < valLength; j++)if (read(arr, i + j) !== read(val, j)) {
                            found = !1;
                            break;
                        }
                        if (found) return i;
                    }
                    return -1;
                }
                function hexWrite(buf, string, offset, length) {
                    offset = Number(offset) || 0;
                    var remaining = buf.length - offset;
                    length ? (length = Number(length)) > remaining && (length = remaining) : length = remaining;
                    var strLen = string.length;
                    length > strLen / 2 && (length = strLen / 2);
                    for(var i = 0; i < length; ++i){
                        var parsed = parseInt(string.substr(2 * i, 2), 16);
                        if (numberIsNaN(parsed)) break;
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
                function base64Slice(buf, start, end) {
                    return 0 === start && end === buf.length ? base64.fromByteArray(buf) : base64.fromByteArray(buf.slice(start, end));
                }
                function utf8Slice(buf, start, end) {
                    end = Math.min(buf.length, end);
                    for(var res = [], i = start; i < end;){
                        var secondByte, thirdByte, fourthByte, tempCodePoint, firstByte = buf[i], codePoint = null, bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;
                        if (i + bytesPerSequence <= end) switch(bytesPerSequence){
                            case 1:
                                firstByte < 0x80 && (codePoint = firstByte);
                                break;
                            case 2:
                                (0xC0 & (secondByte = buf[i + 1])) == 0x80 && (tempCodePoint = (0x1F & firstByte) << 0x6 | 0x3F & secondByte) > 0x7F && (codePoint = tempCodePoint);
                                break;
                            case 3:
                                secondByte = buf[i + 1], thirdByte = buf[i + 2], (0xC0 & secondByte) == 0x80 && (0xC0 & thirdByte) == 0x80 && (tempCodePoint = (0xF & firstByte) << 0xC | (0x3F & secondByte) << 0x6 | 0x3F & thirdByte) > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF) && (codePoint = tempCodePoint);
                                break;
                            case 4:
                                secondByte = buf[i + 1], thirdByte = buf[i + 2], fourthByte = buf[i + 3], (0xC0 & secondByte) == 0x80 && (0xC0 & thirdByte) == 0x80 && (0xC0 & fourthByte) == 0x80 && (tempCodePoint = (0xF & firstByte) << 0x12 | (0x3F & secondByte) << 0xC | (0x3F & thirdByte) << 0x6 | 0x3F & fourthByte) > 0xFFFF && tempCodePoint < 0x110000 && (codePoint = tempCodePoint);
                        }
                        null === codePoint ? (codePoint = 0xFFFD, bytesPerSequence = 1) : codePoint > 0xFFFF && (codePoint -= 0x10000, res.push(codePoint >>> 10 & 0x3FF | 0xD800), codePoint = 0xDC00 | 0x3FF & codePoint), res.push(codePoint), i += bytesPerSequence;
                    }
                    return decodeCodePointsArray(res);
                }
                exports.kMaxLength = K_MAX_LENGTH, Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport(), Buffer.TYPED_ARRAY_SUPPORT || 'undefined' == typeof console || 'function' != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(Buffer.prototype, 'parent', {
                    enumerable: !0,
                    get: function() {
                        if (Buffer.isBuffer(this)) return this.buffer;
                    }
                }), Object.defineProperty(Buffer.prototype, 'offset', {
                    enumerable: !0,
                    get: function() {
                        if (Buffer.isBuffer(this)) return this.byteOffset;
                    }
                }), Buffer.poolSize = 8192, Buffer.from = function(value, encodingOrOffset, length) {
                    return from(value, encodingOrOffset, length);
                }, Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype), Object.setPrototypeOf(Buffer, Uint8Array), Buffer.alloc = function(size, fill, encoding) {
                    return alloc(size, fill, encoding);
                }, Buffer.allocUnsafe = function(size) {
                    return allocUnsafe(size);
                }, Buffer.allocUnsafeSlow = function(size) {
                    return allocUnsafe(size);
                }, Buffer.isBuffer = function(b) {
                    return null != b && !0 === b._isBuffer && b !== Buffer.prototype;
                }, Buffer.compare = function(a, b) {
                    if (isInstance(a, Uint8Array) && (a = Buffer.from(a, a.offset, a.byteLength)), isInstance(b, Uint8Array) && (b = Buffer.from(b, b.offset, b.byteLength)), !Buffer.isBuffer(a) || !Buffer.isBuffer(b)) throw TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                    if (a === b) return 0;
                    for(var x = a.length, y = b.length, i = 0, len = Math.min(x, y); i < len; ++i)if (a[i] !== b[i]) {
                        x = a[i], y = b[i];
                        break;
                    }
                    return x < y ? -1 : y < x ? 1 : 0;
                }, Buffer.isEncoding = function(encoding) {
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
                            return !0;
                        default:
                            return !1;
                    }
                }, Buffer.concat = function(list, length) {
                    if (!Array.isArray(list)) throw TypeError('"list" argument must be an Array of Buffers');
                    if (0 === list.length) return Buffer.alloc(0);
                    if (void 0 === length) for(i = 0, length = 0; i < list.length; ++i)length += list[i].length;
                    var i, buffer = Buffer.allocUnsafe(length), pos = 0;
                    for(i = 0; i < list.length; ++i){
                        var buf = list[i];
                        if (isInstance(buf, Uint8Array)) pos + buf.length > buffer.length ? Buffer.from(buf).copy(buffer, pos) : Uint8Array.prototype.set.call(buffer, buf, pos);
                        else if (Buffer.isBuffer(buf)) buf.copy(buffer, pos);
                        else throw TypeError('"list" argument must be an Array of Buffers');
                        pos += buf.length;
                    }
                    return buffer;
                }, Buffer.byteLength = byteLength, Buffer.prototype._isBuffer = !0, Buffer.prototype.swap16 = function() {
                    var len = this.length;
                    if (len % 2 != 0) throw RangeError('Buffer size must be a multiple of 16-bits');
                    for(var i = 0; i < len; i += 2)swap(this, i, i + 1);
                    return this;
                }, Buffer.prototype.swap32 = function() {
                    var len = this.length;
                    if (len % 4 != 0) throw RangeError('Buffer size must be a multiple of 32-bits');
                    for(var i = 0; i < len; i += 4)swap(this, i, i + 3), swap(this, i + 1, i + 2);
                    return this;
                }, Buffer.prototype.swap64 = function() {
                    var len = this.length;
                    if (len % 8 != 0) throw RangeError('Buffer size must be a multiple of 64-bits');
                    for(var i = 0; i < len; i += 8)swap(this, i, i + 7), swap(this, i + 1, i + 6), swap(this, i + 2, i + 5), swap(this, i + 3, i + 4);
                    return this;
                }, Buffer.prototype.toString = function() {
                    var length = this.length;
                    return 0 === length ? '' : 0 === arguments.length ? utf8Slice(this, 0, length) : slowToString.apply(this, arguments);
                }, Buffer.prototype.toLocaleString = Buffer.prototype.toString, Buffer.prototype.equals = function(b) {
                    if (!Buffer.isBuffer(b)) throw TypeError('Argument must be a Buffer');
                    return this === b || 0 === Buffer.compare(this, b);
                }, Buffer.prototype.inspect = function() {
                    var str = '', max = exports.INSPECT_MAX_BYTES;
                    return str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim(), this.length > max && (str += ' ... '), '<Buffer ' + str + '>';
                }, customInspectSymbol && (Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect), Buffer.prototype.compare = function(target, start, end, thisStart, thisEnd) {
                    if (isInstance(target, Uint8Array) && (target = Buffer.from(target, target.offset, target.byteLength)), !Buffer.isBuffer(target)) throw TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target);
                    if (void 0 === start && (start = 0), void 0 === end && (end = target ? target.length : 0), void 0 === thisStart && (thisStart = 0), void 0 === thisEnd && (thisEnd = this.length), start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) throw RangeError('out of range index');
                    if (thisStart >= thisEnd && start >= end) return 0;
                    if (thisStart >= thisEnd) return -1;
                    if (start >= end) return 1;
                    if (start >>>= 0, end >>>= 0, thisStart >>>= 0, thisEnd >>>= 0, this === target) return 0;
                    for(var x = thisEnd - thisStart, y = end - start, len = Math.min(x, y), thisCopy = this.slice(thisStart, thisEnd), targetCopy = target.slice(start, end), i = 0; i < len; ++i)if (thisCopy[i] !== targetCopy[i]) {
                        x = thisCopy[i], y = targetCopy[i];
                        break;
                    }
                    return x < y ? -1 : y < x ? 1 : 0;
                }, Buffer.prototype.includes = function(val, byteOffset, encoding) {
                    return -1 !== this.indexOf(val, byteOffset, encoding);
                }, Buffer.prototype.indexOf = function(val, byteOffset, encoding) {
                    return bidirectionalIndexOf(this, val, byteOffset, encoding, !0);
                }, Buffer.prototype.lastIndexOf = function(val, byteOffset, encoding) {
                    return bidirectionalIndexOf(this, val, byteOffset, encoding, !1);
                }, Buffer.prototype.write = function(string, offset, length, encoding) {
                    if (void 0 === offset) encoding = 'utf8', length = this.length, offset = 0;
                    else if (void 0 === length && 'string' == typeof offset) encoding = offset, length = this.length, offset = 0;
                    else if (isFinite(offset)) offset >>>= 0, isFinite(length) ? (length >>>= 0, void 0 === encoding && (encoding = 'utf8')) : (encoding = length, length = void 0);
                    else throw Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
                    var remaining = this.length - offset;
                    if ((void 0 === length || length > remaining) && (length = remaining), string.length > 0 && (length < 0 || offset < 0) || offset > this.length) throw RangeError('Attempt to write outside buffer bounds');
                    encoding || (encoding = 'utf8');
                    for(var loweredCase = !1;;)switch(encoding){
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
                            encoding = ('' + encoding).toLowerCase(), loweredCase = !0;
                    }
                }, Buffer.prototype.toJSON = function() {
                    return {
                        type: 'Buffer',
                        data: Array.prototype.slice.call(this._arr || this, 0)
                    };
                };
                var MAX_ARGUMENTS_LENGTH = 0x1000;
                function decodeCodePointsArray(codePoints) {
                    var len = codePoints.length;
                    if (len <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, codePoints);
                    for(var res = '', i = 0; i < len;)res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
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
                    (!start || start < 0) && (start = 0), (!end || end < 0 || end > len) && (end = len);
                    for(var out = '', i = start; i < end; ++i)out += hexSliceLookupTable[buf[i]];
                    return out;
                }
                function utf16leSlice(buf, start, end) {
                    for(var bytes = buf.slice(start, end), res = '', i = 0; i < bytes.length - 1; i += 2)res += String.fromCharCode(bytes[i] + 256 * bytes[i + 1]);
                    return res;
                }
                function checkOffset(offset, ext, length) {
                    if (offset % 1 != 0 || offset < 0) throw RangeError('offset is not uint');
                    if (offset + ext > length) throw RangeError('Trying to access beyond buffer length');
                }
                function checkInt(buf, value, offset, ext, max, min) {
                    if (!Buffer.isBuffer(buf)) throw TypeError('"buffer" argument must be a Buffer instance');
                    if (value > max || value < min) throw RangeError('"value" argument is out of bounds');
                    if (offset + ext > buf.length) throw RangeError('Index out of range');
                }
                function checkIEEE754(buf, value, offset, ext, max, min) {
                    if (offset + ext > buf.length || offset < 0) throw RangeError('Index out of range');
                }
                function writeFloat(buf, value, offset, littleEndian, noAssert) {
                    return value = +value, offset >>>= 0, noAssert || checkIEEE754(buf, value, offset, 4), ieee754$1.write(buf, value, offset, littleEndian, 23, 4), offset + 4;
                }
                function writeDouble(buf, value, offset, littleEndian, noAssert) {
                    return value = +value, offset >>>= 0, noAssert || checkIEEE754(buf, value, offset, 8), ieee754$1.write(buf, value, offset, littleEndian, 52, 8), offset + 8;
                }
                Buffer.prototype.slice = function(start, end) {
                    var len = this.length;
                    start = ~~start, end = void 0 === end ? len : ~~end, start < 0 ? (start += len) < 0 && (start = 0) : start > len && (start = len), end < 0 ? (end += len) < 0 && (end = 0) : end > len && (end = len), end < start && (end = start);
                    var newBuf = this.subarray(start, end);
                    return Object.setPrototypeOf(newBuf, Buffer.prototype), newBuf;
                }, Buffer.prototype.readUintLE = Buffer.prototype.readUIntLE = function(offset, byteLength, noAssert) {
                    offset >>>= 0, byteLength >>>= 0, noAssert || checkOffset(offset, byteLength, this.length);
                    for(var val = this[offset], mul = 1, i = 0; ++i < byteLength && (mul *= 0x100);)val += this[offset + i] * mul;
                    return val;
                }, Buffer.prototype.readUintBE = Buffer.prototype.readUIntBE = function(offset, byteLength, noAssert) {
                    offset >>>= 0, byteLength >>>= 0, noAssert || checkOffset(offset, byteLength, this.length);
                    for(var val = this[offset + --byteLength], mul = 1; byteLength > 0 && (mul *= 0x100);)val += this[offset + --byteLength] * mul;
                    return val;
                }, Buffer.prototype.readUint8 = Buffer.prototype.readUInt8 = function(offset, noAssert) {
                    return offset >>>= 0, noAssert || checkOffset(offset, 1, this.length), this[offset];
                }, Buffer.prototype.readUint16LE = Buffer.prototype.readUInt16LE = function(offset, noAssert) {
                    return offset >>>= 0, noAssert || checkOffset(offset, 2, this.length), this[offset] | this[offset + 1] << 8;
                }, Buffer.prototype.readUint16BE = Buffer.prototype.readUInt16BE = function(offset, noAssert) {
                    return offset >>>= 0, noAssert || checkOffset(offset, 2, this.length), this[offset] << 8 | this[offset + 1];
                }, Buffer.prototype.readUint32LE = Buffer.prototype.readUInt32LE = function(offset, noAssert) {
                    return offset >>>= 0, noAssert || checkOffset(offset, 4, this.length), (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + 0x1000000 * this[offset + 3];
                }, Buffer.prototype.readUint32BE = Buffer.prototype.readUInt32BE = function(offset, noAssert) {
                    return offset >>>= 0, noAssert || checkOffset(offset, 4, this.length), 0x1000000 * this[offset] + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
                }, Buffer.prototype.readIntLE = function(offset, byteLength, noAssert) {
                    offset >>>= 0, byteLength >>>= 0, noAssert || checkOffset(offset, byteLength, this.length);
                    for(var val = this[offset], mul = 1, i = 0; ++i < byteLength && (mul *= 0x100);)val += this[offset + i] * mul;
                    return val >= (mul *= 0x80) && (val -= Math.pow(2, 8 * byteLength)), val;
                }, Buffer.prototype.readIntBE = function(offset, byteLength, noAssert) {
                    offset >>>= 0, byteLength >>>= 0, noAssert || checkOffset(offset, byteLength, this.length);
                    for(var i = byteLength, mul = 1, val = this[offset + --i]; i > 0 && (mul *= 0x100);)val += this[offset + --i] * mul;
                    return val >= (mul *= 0x80) && (val -= Math.pow(2, 8 * byteLength)), val;
                }, Buffer.prototype.readInt8 = function(offset, noAssert) {
                    return (offset >>>= 0, noAssert || checkOffset(offset, 1, this.length), 0x80 & this[offset]) ? -((0xff - this[offset] + 1) * 1) : this[offset];
                }, Buffer.prototype.readInt16LE = function(offset, noAssert) {
                    offset >>>= 0, noAssert || checkOffset(offset, 2, this.length);
                    var val = this[offset] | this[offset + 1] << 8;
                    return 0x8000 & val ? 0xFFFF0000 | val : val;
                }, Buffer.prototype.readInt16BE = function(offset, noAssert) {
                    offset >>>= 0, noAssert || checkOffset(offset, 2, this.length);
                    var val = this[offset + 1] | this[offset] << 8;
                    return 0x8000 & val ? 0xFFFF0000 | val : val;
                }, Buffer.prototype.readInt32LE = function(offset, noAssert) {
                    return offset >>>= 0, noAssert || checkOffset(offset, 4, this.length), this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
                }, Buffer.prototype.readInt32BE = function(offset, noAssert) {
                    return offset >>>= 0, noAssert || checkOffset(offset, 4, this.length), this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
                }, Buffer.prototype.readFloatLE = function(offset, noAssert) {
                    return offset >>>= 0, noAssert || checkOffset(offset, 4, this.length), ieee754$1.read(this, offset, !0, 23, 4);
                }, Buffer.prototype.readFloatBE = function(offset, noAssert) {
                    return offset >>>= 0, noAssert || checkOffset(offset, 4, this.length), ieee754$1.read(this, offset, !1, 23, 4);
                }, Buffer.prototype.readDoubleLE = function(offset, noAssert) {
                    return offset >>>= 0, noAssert || checkOffset(offset, 8, this.length), ieee754$1.read(this, offset, !0, 52, 8);
                }, Buffer.prototype.readDoubleBE = function(offset, noAssert) {
                    return offset >>>= 0, noAssert || checkOffset(offset, 8, this.length), ieee754$1.read(this, offset, !1, 52, 8);
                }, Buffer.prototype.writeUintLE = Buffer.prototype.writeUIntLE = function(value, offset, byteLength, noAssert) {
                    value = +value, offset >>>= 0, byteLength >>>= 0, noAssert || checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength) - 1, 0);
                    var mul = 1, i = 0;
                    for(this[offset] = 0xFF & value; ++i < byteLength && (mul *= 0x100);)this[offset + i] = value / mul & 0xFF;
                    return offset + byteLength;
                }, Buffer.prototype.writeUintBE = Buffer.prototype.writeUIntBE = function(value, offset, byteLength, noAssert) {
                    value = +value, offset >>>= 0, byteLength >>>= 0, noAssert || checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength) - 1, 0);
                    var i = byteLength - 1, mul = 1;
                    for(this[offset + i] = 0xFF & value; --i >= 0 && (mul *= 0x100);)this[offset + i] = value / mul & 0xFF;
                    return offset + byteLength;
                }, Buffer.prototype.writeUint8 = Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
                    return value = +value, offset >>>= 0, noAssert || checkInt(this, value, offset, 1, 0xff, 0), this[offset] = 0xff & value, offset + 1;
                }, Buffer.prototype.writeUint16LE = Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
                    return value = +value, offset >>>= 0, noAssert || checkInt(this, value, offset, 2, 0xffff, 0), this[offset] = 0xff & value, this[offset + 1] = value >>> 8, offset + 2;
                }, Buffer.prototype.writeUint16BE = Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
                    return value = +value, offset >>>= 0, noAssert || checkInt(this, value, offset, 2, 0xffff, 0), this[offset] = value >>> 8, this[offset + 1] = 0xff & value, offset + 2;
                }, Buffer.prototype.writeUint32LE = Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
                    return value = +value, offset >>>= 0, noAssert || checkInt(this, value, offset, 4, 0xffffffff, 0), this[offset + 3] = value >>> 24, this[offset + 2] = value >>> 16, this[offset + 1] = value >>> 8, this[offset] = 0xff & value, offset + 4;
                }, Buffer.prototype.writeUint32BE = Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
                    return value = +value, offset >>>= 0, noAssert || checkInt(this, value, offset, 4, 0xffffffff, 0), this[offset] = value >>> 24, this[offset + 1] = value >>> 16, this[offset + 2] = value >>> 8, this[offset + 3] = 0xff & value, offset + 4;
                }, Buffer.prototype.writeIntLE = function(value, offset, byteLength, noAssert) {
                    if (value = +value, offset >>>= 0, !noAssert) {
                        var limit = Math.pow(2, 8 * byteLength - 1);
                        checkInt(this, value, offset, byteLength, limit - 1, -limit);
                    }
                    var i = 0, mul = 1, sub = 0;
                    for(this[offset] = 0xFF & value; ++i < byteLength && (mul *= 0x100);)value < 0 && 0 === sub && 0 !== this[offset + i - 1] && (sub = 1), this[offset + i] = (value / mul >> 0) - sub & 0xFF;
                    return offset + byteLength;
                }, Buffer.prototype.writeIntBE = function(value, offset, byteLength, noAssert) {
                    if (value = +value, offset >>>= 0, !noAssert) {
                        var limit = Math.pow(2, 8 * byteLength - 1);
                        checkInt(this, value, offset, byteLength, limit - 1, -limit);
                    }
                    var i = byteLength - 1, mul = 1, sub = 0;
                    for(this[offset + i] = 0xFF & value; --i >= 0 && (mul *= 0x100);)value < 0 && 0 === sub && 0 !== this[offset + i + 1] && (sub = 1), this[offset + i] = (value / mul >> 0) - sub & 0xFF;
                    return offset + byteLength;
                }, Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
                    return value = +value, offset >>>= 0, noAssert || checkInt(this, value, offset, 1, 0x7f, -128), value < 0 && (value = 0xff + value + 1), this[offset] = 0xff & value, offset + 1;
                }, Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
                    return value = +value, offset >>>= 0, noAssert || checkInt(this, value, offset, 2, 0x7fff, -32768), this[offset] = 0xff & value, this[offset + 1] = value >>> 8, offset + 2;
                }, Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
                    return value = +value, offset >>>= 0, noAssert || checkInt(this, value, offset, 2, 0x7fff, -32768), this[offset] = value >>> 8, this[offset + 1] = 0xff & value, offset + 2;
                }, Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
                    return value = +value, offset >>>= 0, noAssert || checkInt(this, value, offset, 4, 0x7fffffff, -2147483648), this[offset] = 0xff & value, this[offset + 1] = value >>> 8, this[offset + 2] = value >>> 16, this[offset + 3] = value >>> 24, offset + 4;
                }, Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
                    return value = +value, offset >>>= 0, noAssert || checkInt(this, value, offset, 4, 0x7fffffff, -2147483648), value < 0 && (value = 0xffffffff + value + 1), this[offset] = value >>> 24, this[offset + 1] = value >>> 16, this[offset + 2] = value >>> 8, this[offset + 3] = 0xff & value, offset + 4;
                }, Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
                    return writeFloat(this, value, offset, !0, noAssert);
                }, Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
                    return writeFloat(this, value, offset, !1, noAssert);
                }, Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
                    return writeDouble(this, value, offset, !0, noAssert);
                }, Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
                    return writeDouble(this, value, offset, !1, noAssert);
                }, Buffer.prototype.copy = function(target, targetStart, start, end) {
                    if (!Buffer.isBuffer(target)) throw TypeError('argument should be a Buffer');
                    if (start || (start = 0), end || 0 === end || (end = this.length), targetStart >= target.length && (targetStart = target.length), targetStart || (targetStart = 0), end > 0 && end < start && (end = start), end === start || 0 === target.length || 0 === this.length) return 0;
                    if (targetStart < 0) throw RangeError('targetStart out of bounds');
                    if (start < 0 || start >= this.length) throw RangeError('Index out of range');
                    if (end < 0) throw RangeError('sourceEnd out of bounds');
                    end > this.length && (end = this.length), target.length - targetStart < end - start && (end = target.length - targetStart + start);
                    var len = end - start;
                    return this === target && 'function' == typeof Uint8Array.prototype.copyWithin ? this.copyWithin(targetStart, start, end) : Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart), len;
                }, Buffer.prototype.fill = function(val, start, end, encoding) {
                    if ('string' == typeof val) {
                        if ('string' == typeof start ? (encoding = start, start = 0, end = this.length) : 'string' == typeof end && (encoding = end, end = this.length), void 0 !== encoding && 'string' != typeof encoding) throw TypeError('encoding must be a string');
                        if ('string' == typeof encoding && !Buffer.isEncoding(encoding)) throw TypeError('Unknown encoding: ' + encoding);
                        if (1 === val.length) {
                            var i, code = val.charCodeAt(0);
                            ('utf8' === encoding && code < 128 || 'latin1' === encoding) && (val = code);
                        }
                    } else 'number' == typeof val ? val &= 255 : 'boolean' == typeof val && (val = Number(val));
                    if (start < 0 || this.length < start || this.length < end) throw RangeError('Out of range index');
                    if (end <= start) return this;
                    if (start >>>= 0, end = void 0 === end ? this.length : end >>> 0, val || (val = 0), 'number' == typeof val) for(i = start; i < end; ++i)this[i] = val;
                    else {
                        var bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, encoding), len = bytes.length;
                        if (0 === len) throw TypeError('The value "' + val + '" is invalid for argument "value"');
                        for(i = 0; i < end - start; ++i)this[i + start] = bytes[i % len];
                    }
                    return this;
                };
                var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
                function base64clean(str) {
                    if ((str = (str = str.split('=')[0]).trim().replace(INVALID_BASE64_RE, '')).length < 2) return '';
                    for(; str.length % 4 != 0;)str += '=';
                    return str;
                }
                function utf8ToBytes(string, units) {
                    units = units || 1 / 0;
                    for(var codePoint, length = string.length, leadSurrogate = null, bytes = [], i = 0; i < length; ++i){
                        if ((codePoint = string.charCodeAt(i)) > 0xD7FF && codePoint < 0xE000) {
                            if (!leadSurrogate) {
                                if (codePoint > 0xDBFF || i + 1 === length) {
                                    (units -= 3) > -1 && bytes.push(0xEF, 0xBF, 0xBD);
                                    continue;
                                }
                                leadSurrogate = codePoint;
                                continue;
                            }
                            if (codePoint < 0xDC00) {
                                (units -= 3) > -1 && bytes.push(0xEF, 0xBF, 0xBD), leadSurrogate = codePoint;
                                continue;
                            }
                            codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
                        } else leadSurrogate && (units -= 3) > -1 && bytes.push(0xEF, 0xBF, 0xBD);
                        if (leadSurrogate = null, codePoint < 0x80) {
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
                        } else throw Error('Invalid code point');
                    }
                    return bytes;
                }
                function asciiToBytes(str) {
                    for(var byteArray = [], i = 0; i < str.length; ++i)byteArray.push(0xFF & str.charCodeAt(i));
                    return byteArray;
                }
                function utf16leToBytes(str, units) {
                    for(var c, hi, byteArray = [], i = 0; i < str.length && !((units -= 2) < 0); ++i)hi = (c = str.charCodeAt(i)) >> 8, byteArray.push(c % 256), byteArray.push(hi);
                    return byteArray;
                }
                function base64ToBytes(str) {
                    return base64.toByteArray(base64clean(str));
                }
                function blitBuffer(src, dst, offset, length) {
                    for(var i = 0; i < length && !(i + offset >= dst.length) && !(i >= src.length); ++i)dst[i + offset] = src[i];
                    return i;
                }
                function isInstance(obj, type) {
                    return obj instanceof type || null != obj && null != obj.constructor && null != obj.constructor.name && obj.constructor.name === type.name;
                }
                function numberIsNaN(obj) {
                    return obj != obj;
                }
                var hexSliceLookupTable = function() {
                    for(var alphabet = '0123456789abcdef', table = Array(256), i = 0; i < 16; ++i)for(var i16 = 16 * i, j = 0; j < 16; ++j)table[i16 + j] = alphabet[i] + alphabet[j];
                    return table;
                }();
            }(buffer);
            var events = {
                exports: {}
            }, R = 'object' == typeof Reflect ? Reflect : null, ReflectApply = R && 'function' == typeof R.apply ? R.apply : function(target, receiver, args) {
                return Function.prototype.apply.call(target, receiver, args);
            };
            function ProcessEmitWarning(warning) {
                console && console.warn && console.warn(warning);
            }
            ReflectOwnKeys = R && 'function' == typeof R.ownKeys ? R.ownKeys : Object.getOwnPropertySymbols ? function(target) {
                return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
            } : function(target) {
                return Object.getOwnPropertyNames(target);
            };
            var NumberIsNaN = Number.isNaN || function(value) {
                return value != value;
            };
            function EventEmitter() {
                EventEmitter.init.call(this);
            }
            events.exports = EventEmitter, events.exports.once = once, EventEmitter.EventEmitter = EventEmitter, EventEmitter.prototype._events = void 0, EventEmitter.prototype._eventsCount = 0, EventEmitter.prototype._maxListeners = void 0;
            var defaultMaxListeners = 10;
            function checkListener(listener) {
                if ('function' != typeof listener) throw TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
            }
            function _getMaxListeners(that) {
                return void 0 === that._maxListeners ? EventEmitter.defaultMaxListeners : that._maxListeners;
            }
            function _addListener(target, type, listener, prepend) {
                if (checkListener(listener), void 0 === (events = target._events) ? (events = target._events = Object.create(null), target._eventsCount = 0) : (void 0 !== events.newListener && (target.emit('newListener', type, listener.listener ? listener.listener : listener), events = target._events), existing = events[type]), void 0 === existing) existing = events[type] = listener, ++target._eventsCount;
                else if ('function' == typeof existing ? existing = events[type] = prepend ? [
                    listener,
                    existing
                ] : [
                    existing,
                    listener
                ] : prepend ? existing.unshift(listener) : existing.push(listener), (m = _getMaxListeners(target)) > 0 && existing.length > m && !existing.warned) {
                    existing.warned = !0;
                    var m, events, existing, w = Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
                    w.name = 'MaxListenersExceededWarning', w.emitter = target, w.type = type, w.count = existing.length, ProcessEmitWarning(w);
                }
                return target;
            }
            function onceWrapper() {
                if (!this.fired) return (this.target.removeListener(this.type, this.wrapFn), this.fired = !0, 0 === arguments.length) ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
            }
            function _onceWrap(target, type, listener) {
                var state = {
                    fired: !1,
                    wrapFn: void 0,
                    target: target,
                    type: type,
                    listener: listener
                }, wrapped = onceWrapper.bind(state);
                return wrapped.listener = listener, state.wrapFn = wrapped, wrapped;
            }
            function _listeners(target, type, unwrap) {
                var events = target._events;
                if (void 0 === events) return [];
                var evlistener = events[type];
                return void 0 === evlistener ? [] : 'function' == typeof evlistener ? unwrap ? [
                    evlistener.listener || evlistener
                ] : [
                    evlistener
                ] : unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
            }
            function listenerCount$1(type) {
                var events = this._events;
                if (void 0 !== events) {
                    var evlistener = events[type];
                    if ('function' == typeof evlistener) return 1;
                    if (void 0 !== evlistener) return evlistener.length;
                }
                return 0;
            }
            function arrayClone(arr, n) {
                for(var copy = Array(n), i = 0; i < n; ++i)copy[i] = arr[i];
                return copy;
            }
            function spliceOne(list, index) {
                for(; index + 1 < list.length; index++)list[index] = list[index + 1];
                list.pop();
            }
            function unwrapListeners(arr) {
                for(var ret = Array(arr.length), i = 0; i < ret.length; ++i)ret[i] = arr[i].listener || arr[i];
                return ret;
            }
            function once(emitter, name) {
                return new Promise(function(resolve, reject) {
                    function errorListener(err) {
                        emitter.removeListener(name, resolver), reject(err);
                    }
                    function resolver() {
                        'function' == typeof emitter.removeListener && emitter.removeListener('error', errorListener), resolve([].slice.call(arguments));
                    }
                    eventTargetAgnosticAddListener(emitter, name, resolver, {
                        once: !0
                    }), 'error' !== name && addErrorHandlerIfEventEmitter(emitter, errorListener, {
                        once: !0
                    });
                });
            }
            function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
                'function' == typeof emitter.on && eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
            }
            function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
                if ('function' == typeof emitter.on) flags.once ? emitter.once(name, listener) : emitter.on(name, listener);
                else if ('function' == typeof emitter.addEventListener) emitter.addEventListener(name, function wrapListener(arg) {
                    flags.once && emitter.removeEventListener(name, wrapListener), listener(arg);
                });
                else throw TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
            }
            Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
                enumerable: !0,
                get: function() {
                    return defaultMaxListeners;
                },
                set: function(arg) {
                    if ('number' != typeof arg || arg < 0 || NumberIsNaN(arg)) throw RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
                    defaultMaxListeners = arg;
                }
            }), EventEmitter.init = function() {
                (void 0 === this._events || this._events === Object.getPrototypeOf(this)._events) && (this._events = Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
            }, EventEmitter.prototype.setMaxListeners = function(n) {
                if ('number' != typeof n || n < 0 || NumberIsNaN(n)) throw RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
                return this._maxListeners = n, this;
            }, EventEmitter.prototype.getMaxListeners = function() {
                return _getMaxListeners(this);
            }, EventEmitter.prototype.emit = function(type) {
                for(var args = [], i = 1; i < arguments.length; i++)args.push(arguments[i]);
                var doError = 'error' === type, events = this._events;
                if (void 0 !== events) doError = doError && void 0 === events.error;
                else if (!doError) return !1;
                if (doError) {
                    if (args.length > 0 && (er = args[0]), er instanceof Error) throw er;
                    var er, err = Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
                    throw err.context = er, err;
                }
                var handler = events[type];
                if (void 0 === handler) return !1;
                if ('function' == typeof handler) ReflectApply(handler, this, args);
                else for(var len = handler.length, listeners = arrayClone(handler, len), i = 0; i < len; ++i)ReflectApply(listeners[i], this, args);
                return !0;
            }, EventEmitter.prototype.addListener = function(type, listener) {
                return _addListener(this, type, listener, !1);
            }, EventEmitter.prototype.on = EventEmitter.prototype.addListener, EventEmitter.prototype.prependListener = function(type, listener) {
                return _addListener(this, type, listener, !0);
            }, EventEmitter.prototype.once = function(type, listener) {
                return checkListener(listener), this.on(type, _onceWrap(this, type, listener)), this;
            }, EventEmitter.prototype.prependOnceListener = function(type, listener) {
                return checkListener(listener), this.prependListener(type, _onceWrap(this, type, listener)), this;
            }, EventEmitter.prototype.removeListener = function(type, listener) {
                var list, events, position, i, originalListener;
                if (checkListener(listener), void 0 === (events = this._events) || void 0 === (list = events[type])) return this;
                if (list === listener || list.listener === listener) 0 == --this._eventsCount ? this._events = Object.create(null) : (delete events[type], events.removeListener && this.emit('removeListener', type, list.listener || listener));
                else if ('function' != typeof list) {
                    for(position = -1, i = list.length - 1; i >= 0; i--)if (list[i] === listener || list[i].listener === listener) {
                        originalListener = list[i].listener, position = i;
                        break;
                    }
                    if (position < 0) return this;
                    0 === position ? list.shift() : spliceOne(list, position), 1 === list.length && (events[type] = list[0]), void 0 !== events.removeListener && this.emit('removeListener', type, originalListener || listener);
                }
                return this;
            }, EventEmitter.prototype.off = EventEmitter.prototype.removeListener, EventEmitter.prototype.removeAllListeners = function(type) {
                var listeners, events, i;
                if (void 0 === (events = this._events)) return this;
                if (void 0 === events.removeListener) return 0 === arguments.length ? (this._events = Object.create(null), this._eventsCount = 0) : void 0 !== events[type] && (0 == --this._eventsCount ? this._events = Object.create(null) : delete events[type]), this;
                if (0 === arguments.length) {
                    var key, keys = Object.keys(events);
                    for(i = 0; i < keys.length; ++i)'removeListener' !== (key = keys[i]) && this.removeAllListeners(key);
                    return this.removeAllListeners('removeListener'), this._events = Object.create(null), this._eventsCount = 0, this;
                }
                if ('function' == typeof (listeners = events[type])) this.removeListener(type, listeners);
                else if (void 0 !== listeners) for(i = listeners.length - 1; i >= 0; i--)this.removeListener(type, listeners[i]);
                return this;
            }, EventEmitter.prototype.listeners = function(type) {
                return _listeners(this, type, !0);
            }, EventEmitter.prototype.rawListeners = function(type) {
                return _listeners(this, type, !1);
            }, EventEmitter.listenerCount = function(emitter, type) {
                return 'function' == typeof emitter.listenerCount ? emitter.listenerCount(type) : listenerCount$1.call(emitter, type);
            }, EventEmitter.prototype.listenerCount = listenerCount$1, EventEmitter.prototype.eventNames = function() {
                return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
            };
            var EE = events.exports, util$1 = {}, types = {}, shams$1 = function() {
                if ('function' != typeof Symbol || 'function' != typeof Object.getOwnPropertySymbols) return !1;
                if ('symbol' == typeof Symbol.iterator) return !0;
                var obj = {}, sym = Symbol('test'), symObj = Object(sym);
                if ('string' == typeof sym || '[object Symbol]' !== Object.prototype.toString.call(sym) || '[object Symbol]' !== Object.prototype.toString.call(symObj)) return !1;
                var symVal = 42;
                for(sym in obj[sym] = symVal, obj)return !1;
                if ('function' == typeof Object.keys && 0 !== Object.keys(obj).length || 'function' == typeof Object.getOwnPropertyNames && 0 !== Object.getOwnPropertyNames(obj).length) return !1;
                var syms = Object.getOwnPropertySymbols(obj);
                if (1 !== syms.length || syms[0] !== sym || !Object.prototype.propertyIsEnumerable.call(obj, sym)) return !1;
                if ('function' == typeof Object.getOwnPropertyDescriptor) {
                    var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
                    if (descriptor.value !== symVal || !0 !== descriptor.enumerable) return !1;
                }
                return !0;
            }, origSymbol = 'undefined' != typeof Symbol && Symbol, slice$1 = Array.prototype.slice, toStr$4 = Object.prototype.toString, implementation$8 = function(that) {
                var bound, target = this;
                if ('function' != typeof target || '[object Function]' !== toStr$4.call(target)) throw TypeError('Function.prototype.bind called on incompatible ' + target);
                for(var args = slice$1.call(arguments, 1), binder = function() {
                    if (!(this instanceof bound)) return target.apply(that, args.concat(slice$1.call(arguments)));
                    var result = target.apply(this, args.concat(slice$1.call(arguments)));
                    return Object(result) === result ? result : this;
                }, boundLength = Math.max(0, target.length - args.length), boundArgs = [], i = 0; i < boundLength; i++)boundArgs.push('$' + i);
                if (bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder), target.prototype) {
                    var Empty = function() {};
                    Empty.prototype = target.prototype, bound.prototype = new Empty(), Empty.prototype = null;
                }
                return bound;
            }, functionBind = Function.prototype.bind || implementation$8, src = functionBind.call(Function.call, Object.prototype.hasOwnProperty), $SyntaxError = SyntaxError, $Function = Function, $TypeError = TypeError, getEvalledConstructor = function(expressionSyntax) {
                try {
                    return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
                } catch (e) {}
            }, $gOPD$1 = Object.getOwnPropertyDescriptor;
            if ($gOPD$1) try {
                $gOPD$1({}, '');
            } catch (e) {
                $gOPD$1 = null;
            }
            var throwTypeError = function() {
                throw new $TypeError();
            }, ThrowTypeError = $gOPD$1 ? function() {
                try {
                    return arguments.callee, throwTypeError;
                } catch (calleeThrows) {
                    try {
                        return $gOPD$1(arguments, 'callee').get;
                    } catch (gOPDthrows) {
                        return throwTypeError;
                    }
                }
            }() : throwTypeError, hasSymbols$2 = function() {
                return 'function' == typeof origSymbol && 'function' == typeof Symbol && 'symbol' == typeof origSymbol('foo') && 'symbol' == typeof Symbol('bar') && shams$1();
            }(), getProto$1 = Object.getPrototypeOf || function(x) {
                return x.__proto__;
            }, needsEval = {}, TypedArray = 'undefined' == typeof Uint8Array ? undefined$1 : getProto$1(Uint8Array), INTRINSICS = {
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
            }, doEval = function doEval(name) {
                var value;
                if ('%AsyncFunction%' === name) value = getEvalledConstructor('async function () {}');
                else if ('%GeneratorFunction%' === name) value = getEvalledConstructor('function* () {}');
                else if ('%AsyncGeneratorFunction%' === name) value = getEvalledConstructor('async function* () {}');
                else if ('%AsyncGenerator%' === name) {
                    var fn = doEval('%AsyncGeneratorFunction%');
                    fn && (value = fn.prototype);
                } else if ('%AsyncIteratorPrototype%' === name) {
                    var gen = doEval('%AsyncGenerator%');
                    gen && (value = getProto$1(gen.prototype));
                }
                return INTRINSICS[name] = value, value;
            }, LEGACY_ALIASES = {
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
            }, bind = functionBind, hasOwn$1 = src, $concat = bind.call(Function.call, Array.prototype.concat), $spliceApply = bind.call(Function.apply, Array.prototype.splice), $replace = bind.call(Function.call, String.prototype.replace), $strSlice = bind.call(Function.call, String.prototype.slice), rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, reEscapeChar = /\\(\\)?/g, stringToPath = function(string) {
                var first = $strSlice(string, 0, 1), last = $strSlice(string, -1);
                if ('%' === first && '%' !== last) throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
                if ('%' === last && '%' !== first) throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
                var result = [];
                return $replace(string, rePropName, function(match, number, quote, subString) {
                    result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
                }), result;
            }, getBaseIntrinsic = function(name, allowMissing) {
                var alias, intrinsicName = name;
                if (hasOwn$1(LEGACY_ALIASES, intrinsicName) && (intrinsicName = '%' + (alias = LEGACY_ALIASES[intrinsicName])[0] + '%'), hasOwn$1(INTRINSICS, intrinsicName)) {
                    var value = INTRINSICS[intrinsicName];
                    if (value === needsEval && (value = doEval(intrinsicName)), void 0 === value && !allowMissing) throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
                    return {
                        alias: alias,
                        name: intrinsicName,
                        value: value
                    };
                }
                throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
            }, getIntrinsic = function(name, allowMissing) {
                if ('string' != typeof name || 0 === name.length) throw new $TypeError('intrinsic name must be a non-empty string');
                if (arguments.length > 1 && 'boolean' != typeof allowMissing) throw new $TypeError('"allowMissing" argument must be a boolean');
                var parts = stringToPath(name), intrinsicBaseName = parts.length > 0 ? parts[0] : '', intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing), intrinsicRealName = intrinsic.name, value = intrinsic.value, skipFurtherCaching = !1, alias = intrinsic.alias;
                alias && (intrinsicBaseName = alias[0], $spliceApply(parts, $concat([
                    0,
                    1
                ], alias)));
                for(var i = 1, isOwn = !0; i < parts.length; i += 1){
                    var part = parts[i], first = $strSlice(part, 0, 1), last = $strSlice(part, -1);
                    if (('"' === first || "'" === first || '`' === first || '"' === last || "'" === last || '`' === last) && first !== last) throw new $SyntaxError('property names with quotes must have matching quotes');
                    if ('constructor' !== part && isOwn || (skipFurtherCaching = !0), intrinsicBaseName += '.' + part, hasOwn$1(INTRINSICS, intrinsicRealName = '%' + intrinsicBaseName + '%')) value = INTRINSICS[intrinsicRealName];
                    else if (null != value) {
                        if (!(part in value)) {
                            if (!allowMissing) throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
                            return;
                        }
                        if ($gOPD$1 && i + 1 >= parts.length) {
                            var desc = $gOPD$1(value, part);
                            value = (isOwn = !!desc) && 'get' in desc && !('originalValue' in desc.get) ? desc.get : value[part];
                        } else isOwn = hasOwn$1(value, part), value = value[part];
                        isOwn && !skipFurtherCaching && (INTRINSICS[intrinsicRealName] = value);
                    }
                }
                return value;
            }, callBind$3 = {
                exports: {}
            };
            !function(module) {
                var bind = functionBind, GetIntrinsic = getIntrinsic, $apply = GetIntrinsic('%Function.prototype.apply%'), $call = GetIntrinsic('%Function.prototype.call%'), $reflectApply = GetIntrinsic('%Reflect.apply%', !0) || bind.call($call, $apply), $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', !0), $defineProperty = GetIntrinsic('%Object.defineProperty%', !0), $max = GetIntrinsic('%Math.max%');
                if ($defineProperty) try {
                    $defineProperty({}, 'a', {
                        value: 1
                    });
                } catch (e) {
                    $defineProperty = null;
                }
                module.exports = function(originalFunction) {
                    var func = $reflectApply(bind, $call, arguments);
                    return $gOPD && $defineProperty && $gOPD(func, 'length').configurable && $defineProperty(func, 'length', {
                        value: 1 + $max(0, originalFunction.length - (arguments.length - 1))
                    }), func;
                };
                var applyBind = function() {
                    return $reflectApply(bind, $apply, arguments);
                };
                $defineProperty ? $defineProperty(module.exports, 'apply', {
                    value: applyBind
                }) : module.exports.apply = applyBind;
            }(callBind$3);
            var GetIntrinsic$1 = getIntrinsic, callBind$2 = callBind$3.exports, $indexOf$1 = callBind$2(GetIntrinsic$1('String.prototype.indexOf')), callBound$3 = function(name, allowMissing) {
                var intrinsic = GetIntrinsic$1(name, !!allowMissing);
                return 'function' == typeof intrinsic && $indexOf$1(name, '.prototype.') > -1 ? callBind$2(intrinsic) : intrinsic;
            }, hasToStringTag$3 = 'function' == typeof Symbol && 'symbol' == typeof Symbol.toStringTag, $toString$2 = callBound$3('Object.prototype.toString'), isStandardArguments = function(value) {
                return (!hasToStringTag$3 || !value || 'object' != typeof value || !(Symbol.toStringTag in value)) && '[object Arguments]' === $toString$2(value);
            }, isLegacyArguments = function(value) {
                return !!isStandardArguments(value) || null !== value && 'object' == typeof value && 'number' == typeof value.length && value.length >= 0 && '[object Array]' !== $toString$2(value) && '[object Function]' === $toString$2(value.callee);
            }, supportsStandardArguments = function() {
                return isStandardArguments(arguments);
            }();
            isStandardArguments.isLegacyArguments = isLegacyArguments;
            var isArguments$1 = supportsStandardArguments ? isStandardArguments : isLegacyArguments, shams = function() {
                return shams$1() && !!Symbol.toStringTag;
            }, toStr$3 = Object.prototype.toString, fnToStr = Function.prototype.toString, isFnRegex = /^\s*(?:function)?\*/, hasToStringTag$2 = shams(), getProto = Object.getPrototypeOf, getGeneratorFunc = function() {
                if (!hasToStringTag$2) return !1;
                try {
                    return Function('return function*() {}')();
                } catch (e) {}
            }, isGeneratorFunction = function(fn) {
                if ('function' != typeof fn) return !1;
                if (isFnRegex.test(fnToStr.call(fn))) return !0;
                if (!hasToStringTag$2) return '[object GeneratorFunction]' === toStr$3.call(fn);
                if (!getProto) return !1;
                if (void 0 === GeneratorFunction) {
                    var generatorFunc = getGeneratorFunc();
                    GeneratorFunction = !!generatorFunc && getProto(generatorFunc);
                }
                return getProto(fn) === GeneratorFunction;
            }, hasOwn = Object.prototype.hasOwnProperty, toString = Object.prototype.toString, foreach = function(obj, fn, ctx) {
                if ('[object Function]' !== toString.call(fn)) throw TypeError('iterator must be a function');
                var l = obj.length;
                if (l === +l) for(var i = 0; i < l; i++)fn.call(ctx, obj[i], i, obj);
                else for(var k in obj)hasOwn.call(obj, k) && fn.call(ctx, obj[k], k, obj);
            }, possibleNames = [
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
            ], g$2 = 'undefined' == typeof globalThis ? commonjsGlobal : globalThis, availableTypedArrays$2 = function() {
                for(var out = [], i = 0; i < possibleNames.length; i++)'function' == typeof g$2[possibleNames[i]] && (out[out.length] = possibleNames[i]);
                return out;
            }, $gOPD = getIntrinsic('%Object.getOwnPropertyDescriptor%', !0);
            if ($gOPD) try {
                $gOPD([], 'length');
            } catch (e) {
                $gOPD = null;
            }
            var getOwnPropertyDescriptor = $gOPD, forEach$2 = foreach, callBound$1 = callBound$3, $toString$1 = callBound$1('Object.prototype.toString'), hasToStringTag$1 = shams(), g$1 = 'undefined' == typeof globalThis ? commonjsGlobal : globalThis, typedArrays$1 = availableTypedArrays$2(), $indexOf = callBound$1('Array.prototype.indexOf', !0) || function(array, value) {
                for(var i = 0; i < array.length; i += 1)if (array[i] === value) return i;
                return -1;
            }, $slice$1 = callBound$1('String.prototype.slice'), toStrTags$1 = {}, gOPD$1 = getOwnPropertyDescriptor, getPrototypeOf$1 = Object.getPrototypeOf;
            hasToStringTag$1 && gOPD$1 && getPrototypeOf$1 && forEach$2(typedArrays$1, function(typedArray) {
                var arr = new g$1[typedArray]();
                if (Symbol.toStringTag in arr) {
                    var proto = getPrototypeOf$1(arr), descriptor = gOPD$1(proto, Symbol.toStringTag);
                    if (!descriptor) {
                        var superProto = getPrototypeOf$1(proto);
                        descriptor = gOPD$1(superProto, Symbol.toStringTag);
                    }
                    toStrTags$1[typedArray] = descriptor.get;
                }
            });
            var tryTypedArrays$1 = function(value) {
                var anyTrue = !1;
                return forEach$2(toStrTags$1, function(getter, typedArray) {
                    if (!anyTrue) try {
                        anyTrue = getter.call(value) === typedArray;
                    } catch (e) {}
                }), anyTrue;
            }, isTypedArray$1 = function(value) {
                if (!value || 'object' != typeof value) return !1;
                if (!hasToStringTag$1 || !(Symbol.toStringTag in value)) {
                    var tag = $slice$1($toString$1(value), 8, -1);
                    return $indexOf(typedArrays$1, tag) > -1;
                }
                return !!gOPD$1 && tryTypedArrays$1(value);
            }, forEach$1 = foreach, callBound = callBound$3, $toString = callBound('Object.prototype.toString'), hasToStringTag = shams(), g = 'undefined' == typeof globalThis ? commonjsGlobal : globalThis, typedArrays = availableTypedArrays$2(), $slice = callBound('String.prototype.slice'), toStrTags = {}, gOPD = getOwnPropertyDescriptor, getPrototypeOf = Object.getPrototypeOf;
            hasToStringTag && gOPD && getPrototypeOf && forEach$1(typedArrays, function(typedArray) {
                if ('function' == typeof g[typedArray]) {
                    var arr = new g[typedArray]();
                    if (Symbol.toStringTag in arr) {
                        var proto = getPrototypeOf(arr), descriptor = gOPD(proto, Symbol.toStringTag);
                        if (!descriptor) {
                            var superProto = getPrototypeOf(proto);
                            descriptor = gOPD(superProto, Symbol.toStringTag);
                        }
                        toStrTags[typedArray] = descriptor.get;
                    }
                }
            });
            var tryTypedArrays = function(value) {
                var foundName = !1;
                return forEach$1(toStrTags, function(getter, typedArray) {
                    if (!foundName) try {
                        var name = getter.call(value);
                        name === typedArray && (foundName = name);
                    } catch (e) {}
                }), foundName;
            }, whichTypedArray = function(value) {
                return !!isTypedArray$1(value) && (hasToStringTag && Symbol.toStringTag in value ? tryTypedArrays(value) : $slice($toString(value), 8, -1));
            };
            !function(exports) {
                var whichTypedArray$1 = whichTypedArray, isTypedArray = isTypedArray$1;
                function uncurryThis(f) {
                    return f.call.bind(f);
                }
                var BigIntSupported = 'undefined' != typeof BigInt, SymbolSupported = 'undefined' != typeof Symbol, ObjectToString = uncurryThis(Object.prototype.toString), numberValue = uncurryThis(Number.prototype.valueOf), stringValue = uncurryThis(String.prototype.valueOf), booleanValue = uncurryThis(Boolean.prototype.valueOf);
                if (BigIntSupported) var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
                if (SymbolSupported) var symbolValue = uncurryThis(Symbol.prototype.valueOf);
                function checkBoxedPrimitive(value, prototypeValueOf) {
                    if ('object' != typeof value) return !1;
                    try {
                        return prototypeValueOf(value), !0;
                    } catch (e) {
                        return !1;
                    }
                }
                function isPromise(input) {
                    return 'undefined' != typeof Promise && input instanceof Promise || null !== input && 'object' == typeof input && 'function' == typeof input.then && 'function' == typeof input.catch;
                }
                function isArrayBufferView(value) {
                    return 'undefined' != typeof ArrayBuffer && ArrayBuffer.isView ? ArrayBuffer.isView(value) : isTypedArray(value) || isDataView(value);
                }
                function isUint8Array(value) {
                    return 'Uint8Array' === whichTypedArray$1(value);
                }
                function isUint8ClampedArray(value) {
                    return 'Uint8ClampedArray' === whichTypedArray$1(value);
                }
                function isUint16Array(value) {
                    return 'Uint16Array' === whichTypedArray$1(value);
                }
                function isUint32Array(value) {
                    return 'Uint32Array' === whichTypedArray$1(value);
                }
                function isInt8Array(value) {
                    return 'Int8Array' === whichTypedArray$1(value);
                }
                function isInt16Array(value) {
                    return 'Int16Array' === whichTypedArray$1(value);
                }
                function isInt32Array(value) {
                    return 'Int32Array' === whichTypedArray$1(value);
                }
                function isFloat32Array(value) {
                    return 'Float32Array' === whichTypedArray$1(value);
                }
                function isFloat64Array(value) {
                    return 'Float64Array' === whichTypedArray$1(value);
                }
                function isBigInt64Array(value) {
                    return 'BigInt64Array' === whichTypedArray$1(value);
                }
                function isBigUint64Array(value) {
                    return 'BigUint64Array' === whichTypedArray$1(value);
                }
                function isMapToString(value) {
                    return '[object Map]' === ObjectToString(value);
                }
                function isMap(value) {
                    return 'undefined' != typeof Map && (isMapToString.working ? isMapToString(value) : value instanceof Map);
                }
                function isSetToString(value) {
                    return '[object Set]' === ObjectToString(value);
                }
                function isSet(value) {
                    return 'undefined' != typeof Set && (isSetToString.working ? isSetToString(value) : value instanceof Set);
                }
                function isWeakMapToString(value) {
                    return '[object WeakMap]' === ObjectToString(value);
                }
                function isWeakMap(value) {
                    return 'undefined' != typeof WeakMap && (isWeakMapToString.working ? isWeakMapToString(value) : value instanceof WeakMap);
                }
                function isWeakSetToString(value) {
                    return '[object WeakSet]' === ObjectToString(value);
                }
                function isWeakSet(value) {
                    return isWeakSetToString(value);
                }
                function isArrayBufferToString(value) {
                    return '[object ArrayBuffer]' === ObjectToString(value);
                }
                function isArrayBuffer(value) {
                    return 'undefined' != typeof ArrayBuffer && (isArrayBufferToString.working ? isArrayBufferToString(value) : value instanceof ArrayBuffer);
                }
                function isDataViewToString(value) {
                    return '[object DataView]' === ObjectToString(value);
                }
                function isDataView(value) {
                    return 'undefined' != typeof DataView && (isDataViewToString.working ? isDataViewToString(value) : value instanceof DataView);
                }
                exports.isArgumentsObject = isArguments$1, exports.isGeneratorFunction = isGeneratorFunction, exports.isTypedArray = isTypedArray, exports.isPromise = isPromise, exports.isArrayBufferView = isArrayBufferView, exports.isUint8Array = isUint8Array, exports.isUint8ClampedArray = isUint8ClampedArray, exports.isUint16Array = isUint16Array, exports.isUint32Array = isUint32Array, exports.isInt8Array = isInt8Array, exports.isInt16Array = isInt16Array, exports.isInt32Array = isInt32Array, exports.isFloat32Array = isFloat32Array, exports.isFloat64Array = isFloat64Array, exports.isBigInt64Array = isBigInt64Array, exports.isBigUint64Array = isBigUint64Array, isMapToString.working = 'undefined' != typeof Map && isMapToString(new Map()), exports.isMap = isMap, isSetToString.working = 'undefined' != typeof Set && isSetToString(new Set()), exports.isSet = isSet, isWeakMapToString.working = 'undefined' != typeof WeakMap && isWeakMapToString(new WeakMap()), exports.isWeakMap = isWeakMap, isWeakSetToString.working = 'undefined' != typeof WeakSet && isWeakSetToString(new WeakSet()), exports.isWeakSet = isWeakSet, isArrayBufferToString.working = 'undefined' != typeof ArrayBuffer && isArrayBufferToString(new ArrayBuffer()), exports.isArrayBuffer = isArrayBuffer, isDataViewToString.working = 'undefined' != typeof ArrayBuffer && 'undefined' != typeof DataView && isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1)), exports.isDataView = isDataView;
                var SharedArrayBufferCopy = 'undefined' != typeof SharedArrayBuffer ? SharedArrayBuffer : void 0;
                function isSharedArrayBufferToString(value) {
                    return '[object SharedArrayBuffer]' === ObjectToString(value);
                }
                function isSharedArrayBuffer(value) {
                    return void 0 !== SharedArrayBufferCopy && (void 0 === isSharedArrayBufferToString.working && (isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy())), isSharedArrayBufferToString.working ? isSharedArrayBufferToString(value) : value instanceof SharedArrayBufferCopy);
                }
                function isAsyncFunction(value) {
                    return '[object AsyncFunction]' === ObjectToString(value);
                }
                function isMapIterator(value) {
                    return '[object Map Iterator]' === ObjectToString(value);
                }
                function isSetIterator(value) {
                    return '[object Set Iterator]' === ObjectToString(value);
                }
                function isGeneratorObject(value) {
                    return '[object Generator]' === ObjectToString(value);
                }
                function isWebAssemblyCompiledModule(value) {
                    return '[object WebAssembly.Module]' === ObjectToString(value);
                }
                function isNumberObject(value) {
                    return checkBoxedPrimitive(value, numberValue);
                }
                function isStringObject(value) {
                    return checkBoxedPrimitive(value, stringValue);
                }
                function isBooleanObject(value) {
                    return checkBoxedPrimitive(value, booleanValue);
                }
                function isBigIntObject(value) {
                    return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
                }
                function isSymbolObject(value) {
                    return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
                }
                function isBoxedPrimitive(value) {
                    return isNumberObject(value) || isStringObject(value) || isBooleanObject(value) || isBigIntObject(value) || isSymbolObject(value);
                }
                function isAnyArrayBuffer(value) {
                    return 'undefined' != typeof Uint8Array && (isArrayBuffer(value) || isSharedArrayBuffer(value));
                }
                exports.isSharedArrayBuffer = isSharedArrayBuffer, exports.isAsyncFunction = isAsyncFunction, exports.isMapIterator = isMapIterator, exports.isSetIterator = isSetIterator, exports.isGeneratorObject = isGeneratorObject, exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule, exports.isNumberObject = isNumberObject, exports.isStringObject = isStringObject, exports.isBooleanObject = isBooleanObject, exports.isBigIntObject = isBigIntObject, exports.isSymbolObject = isSymbolObject, exports.isBoxedPrimitive = isBoxedPrimitive, exports.isAnyArrayBuffer = isAnyArrayBuffer, [
                    'isProxy',
                    'isExternal',
                    'isModuleNamespaceObject'
                ].forEach(function(method) {
                    Object.defineProperty(exports, method, {
                        enumerable: !1,
                        value: function() {
                            throw Error(method + ' is not supported in userland');
                        }
                    });
                });
            }(types);
            var isBufferBrowser = function(arg) {
                return arg && 'object' == typeof arg && 'function' == typeof arg.copy && 'function' == typeof arg.fill && 'function' == typeof arg.readUInt8;
            }, inherits_browser = {
                exports: {}
            };
            'function' == typeof Object.create ? inherits_browser.exports = function(ctor, superCtor) {
                superCtor && (ctor.super_ = superCtor, ctor.prototype = Object.create(superCtor.prototype, {
                    constructor: {
                        value: ctor,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }));
            } : inherits_browser.exports = function(ctor, superCtor) {
                if (superCtor) {
                    ctor.super_ = superCtor;
                    var TempCtor = function() {};
                    TempCtor.prototype = superCtor.prototype, ctor.prototype = new TempCtor(), ctor.prototype.constructor = ctor;
                }
            }, function(exports) {
                var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function(obj) {
                    for(var keys = Object.keys(obj), descriptors = {}, i = 0; i < keys.length; i++)descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
                    return descriptors;
                }, formatRegExp = /%[sdj%]/g;
                exports.format = function(f) {
                    if (!isString(f)) {
                        for(var objects = [], i = 0; i < arguments.length; i++)objects.push(inspect(arguments[i]));
                        return objects.join(' ');
                    }
                    for(var i = 1, args = arguments, len = args.length, str = String(f).replace(formatRegExp, function(x) {
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
                    }), x = args[i]; i < len; x = args[++i])isNull(x) || !isObject(x) ? str += ' ' + x : str += ' ' + inspect(x);
                    return str;
                }, exports.deprecate = function(fn, msg) {
                    if (void 0 !== browser$1$1 && !0 === browser$1$1.noDeprecation) return fn;
                    if (void 0 === browser$1$1) return function() {
                        return exports.deprecate(fn, msg).apply(this, arguments);
                    };
                    var warned = !1;
                    function deprecated() {
                        return warned || (console.error(msg), warned = !0), fn.apply(this, arguments);
                    }
                    return deprecated;
                };
                var debugs = {}, debugEnvRegex = /^$/;
                if (browser$1$1.env.NODE_DEBUG) {
                    var debugEnv = browser$1$1.env.NODE_DEBUG;
                    debugEnvRegex = RegExp('^' + (debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&').replace(/\*/g, '.*').replace(/,/g, '$|^').toUpperCase()) + '$', 'i');
                }
                function inspect(obj, opts) {
                    var ctx = {
                        seen: [],
                        stylize: stylizeNoColor
                    };
                    return arguments.length >= 3 && (ctx.depth = arguments[2]), arguments.length >= 4 && (ctx.colors = arguments[3]), isBoolean(opts) ? ctx.showHidden = opts : opts && exports._extend(ctx, opts), isUndefined(ctx.showHidden) && (ctx.showHidden = !1), isUndefined(ctx.depth) && (ctx.depth = 2), isUndefined(ctx.colors) && (ctx.colors = !1), isUndefined(ctx.customInspect) && (ctx.customInspect = !0), ctx.colors && (ctx.stylize = stylizeWithColor), formatValue(ctx, obj, ctx.depth);
                }
                function stylizeWithColor(str, styleType) {
                    var style = inspect.styles[styleType];
                    return style ? "\x1B[" + inspect.colors[style][0] + 'm' + str + "\x1B[" + inspect.colors[style][1] + 'm' : str;
                }
                function stylizeNoColor(str, styleType) {
                    return str;
                }
                function arrayToHash(array) {
                    var hash = {};
                    return array.forEach(function(val, idx) {
                        hash[val] = !0;
                    }), hash;
                }
                function formatValue(ctx, value, recurseTimes) {
                    if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== exports.inspect && !(value.constructor && value.constructor.prototype === value)) {
                        var output, ret = value.inspect(recurseTimes, ctx);
                        return isString(ret) || (ret = formatValue(ctx, ret, recurseTimes)), ret;
                    }
                    var primitive = formatPrimitive(ctx, value);
                    if (primitive) return primitive;
                    var keys = Object.keys(value), visibleKeys = arrayToHash(keys);
                    if (ctx.showHidden && (keys = Object.getOwnPropertyNames(value)), isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) return formatError(value);
                    if (0 === keys.length) {
                        if (isFunction(value)) {
                            var name = value.name ? ': ' + value.name : '';
                            return ctx.stylize('[Function' + name + ']', 'special');
                        }
                        if (isRegExp(value)) return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
                        if (isDate(value)) return ctx.stylize(Date.prototype.toString.call(value), 'date');
                        if (isError(value)) return formatError(value);
                    }
                    var base = '', array = !1, braces = [
                        '{',
                        '}'
                    ];
                    return (isArray(value) && (array = !0, braces = [
                        '[',
                        ']'
                    ]), isFunction(value) && (base = ' [Function' + (value.name ? ': ' + value.name : '') + ']'), isRegExp(value) && (base = ' ' + RegExp.prototype.toString.call(value)), isDate(value) && (base = ' ' + Date.prototype.toUTCString.call(value)), isError(value) && (base = ' ' + formatError(value)), 0 !== keys.length || array && 0 != value.length) ? recurseTimes < 0 ? isRegExp(value) ? ctx.stylize(RegExp.prototype.toString.call(value), 'regexp') : ctx.stylize('[Object]', 'special') : (ctx.seen.push(value), output = array ? formatArray(ctx, value, recurseTimes, visibleKeys, keys) : keys.map(function(key) {
                        return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
                    }), ctx.seen.pop(), reduceToSingleString(output, base, braces)) : braces[0] + base + braces[1];
                }
                function formatPrimitive(ctx, value) {
                    if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');
                    if (isString(value)) {
                        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
                        return ctx.stylize(simple, 'string');
                    }
                    return isNumber(value) ? ctx.stylize('' + value, 'number') : isBoolean(value) ? ctx.stylize('' + value, 'boolean') : isNull(value) ? ctx.stylize('null', 'null') : void 0;
                }
                function formatError(value) {
                    return '[' + Error.prototype.toString.call(value) + ']';
                }
                function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
                    for(var output = [], i = 0, l = value.length; i < l; ++i)hasOwnProperty(value, String(i)) ? output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), !0)) : output.push('');
                    return keys.forEach(function(key) {
                        key.match(/^\d+$/) || output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, !0));
                    }), output;
                }
                function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
                    var name, str, desc;
                    if ((desc = Object.getOwnPropertyDescriptor(value, key) || {
                        value: value[key]
                    }).get ? str = desc.set ? ctx.stylize('[Getter/Setter]', 'special') : ctx.stylize('[Getter]', 'special') : desc.set && (str = ctx.stylize('[Setter]', 'special')), hasOwnProperty(visibleKeys, key) || (name = '[' + key + ']'), !str && (0 > ctx.seen.indexOf(desc.value) ? (str = isNull(recurseTimes) ? formatValue(ctx, desc.value, null) : formatValue(ctx, desc.value, recurseTimes - 1)).indexOf('\n') > -1 && (str = array ? str.split('\n').map(function(line) {
                        return '  ' + line;
                    }).join('\n').substr(2) : '\n' + str.split('\n').map(function(line) {
                        return '   ' + line;
                    }).join('\n')) : str = ctx.stylize('[Circular]', 'special')), isUndefined(name)) {
                        if (array && key.match(/^\d+$/)) return str;
                        (name = JSON.stringify('' + key)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (name = name.substr(1, name.length - 2), name = ctx.stylize(name, 'name')) : (name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), name = ctx.stylize(name, 'string'));
                    }
                    return name + ': ' + str;
                }
                function reduceToSingleString(output, base, braces) {
                    return output.reduce(function(prev, cur) {
                        return cur.indexOf('\n'), prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
                    }, 0) > 60 ? braces[0] + ('' === base ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1] : braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
                }
                function isArray(ar) {
                    return Array.isArray(ar);
                }
                function isBoolean(arg) {
                    return 'boolean' == typeof arg;
                }
                function isNull(arg) {
                    return null === arg;
                }
                function isNullOrUndefined(arg) {
                    return null == arg;
                }
                function isNumber(arg) {
                    return 'number' == typeof arg;
                }
                function isString(arg) {
                    return 'string' == typeof arg;
                }
                function isSymbol(arg) {
                    return 'symbol' == typeof arg;
                }
                function isUndefined(arg) {
                    return void 0 === arg;
                }
                function isRegExp(re) {
                    return isObject(re) && '[object RegExp]' === objectToString(re);
                }
                function isObject(arg) {
                    return 'object' == typeof arg && null !== arg;
                }
                function isDate(d) {
                    return isObject(d) && '[object Date]' === objectToString(d);
                }
                function isError(e) {
                    return isObject(e) && ('[object Error]' === objectToString(e) || e instanceof Error);
                }
                function isFunction(arg) {
                    return 'function' == typeof arg;
                }
                function isPrimitive(arg) {
                    return null === arg || 'boolean' == typeof arg || 'number' == typeof arg || 'string' == typeof arg || 'symbol' == typeof arg || void 0 === arg;
                }
                function objectToString(o) {
                    return Object.prototype.toString.call(o);
                }
                function pad(n) {
                    return n < 10 ? '0' + n.toString(10) : n.toString(10);
                }
                exports.debuglog = function(set) {
                    if (!debugs[set = set.toUpperCase()]) {
                        if (debugEnvRegex.test(set)) {
                            var pid = browser$1$1.pid;
                            debugs[set] = function() {
                                var msg = exports.format.apply(exports, arguments);
                                console.error('%s %d: %s', set, pid, msg);
                            };
                        } else debugs[set] = function() {};
                    }
                    return debugs[set];
                }, exports.inspect = inspect, inspect.colors = {
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
                }, inspect.styles = {
                    special: 'cyan',
                    number: 'yellow',
                    boolean: 'yellow',
                    undefined: 'grey',
                    null: 'bold',
                    string: 'green',
                    date: 'magenta',
                    regexp: 'red'
                }, exports.types = types, exports.isArray = isArray, exports.isBoolean = isBoolean, exports.isNull = isNull, exports.isNullOrUndefined = isNullOrUndefined, exports.isNumber = isNumber, exports.isString = isString, exports.isSymbol = isSymbol, exports.isUndefined = isUndefined, exports.isRegExp = isRegExp, exports.types.isRegExp = isRegExp, exports.isObject = isObject, exports.isDate = isDate, exports.types.isDate = isDate, exports.isError = isError, exports.types.isNativeError = isError, exports.isFunction = isFunction, exports.isPrimitive = isPrimitive, exports.isBuffer = isBufferBrowser;
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
                    var d = new Date(), time = [
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
                function hasOwnProperty(obj, prop) {
                    return Object.prototype.hasOwnProperty.call(obj, prop);
                }
                exports.log = function() {
                    console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
                }, exports.inherits = inherits_browser.exports, exports._extend = function(origin, add) {
                    if (!add || !isObject(add)) return origin;
                    for(var keys = Object.keys(add), i = keys.length; i--;)origin[keys[i]] = add[keys[i]];
                    return origin;
                };
                var kCustomPromisifiedSymbol = 'undefined' != typeof Symbol ? Symbol('util.promisify.custom') : void 0;
                function callbackifyOnRejected(reason, cb) {
                    if (!reason) {
                        var newReason = Error('Promise was rejected with a falsy value');
                        newReason.reason = reason, reason = newReason;
                    }
                    return cb(reason);
                }
                function callbackify(original) {
                    if ('function' != typeof original) throw TypeError('The "original" argument must be of type Function');
                    function callbackified() {
                        for(var args = [], i = 0; i < arguments.length; i++)args.push(arguments[i]);
                        var maybeCb = args.pop();
                        if ('function' != typeof maybeCb) throw TypeError('The last argument must be of type Function');
                        var self1 = this, cb = function() {
                            return maybeCb.apply(self1, arguments);
                        };
                        original.apply(this, args).then(function(ret) {
                            browser$1$1.nextTick(cb.bind(null, null, ret));
                        }, function(rej) {
                            browser$1$1.nextTick(callbackifyOnRejected.bind(null, rej, cb));
                        });
                    }
                    return Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original)), Object.defineProperties(callbackified, getOwnPropertyDescriptors(original)), callbackified;
                }
                exports.promisify = function(original) {
                    if ('function' != typeof original) throw TypeError('The "original" argument must be of type Function');
                    if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
                        var fn = original[kCustomPromisifiedSymbol];
                        if ('function' != typeof fn) throw TypeError('The "util.promisify.custom" argument must be of type Function');
                        return Object.defineProperty(fn, kCustomPromisifiedSymbol, {
                            value: fn,
                            enumerable: !1,
                            writable: !1,
                            configurable: !0
                        }), fn;
                    }
                    function fn() {
                        for(var promiseResolve, promiseReject, promise = new Promise(function(resolve, reject) {
                            promiseResolve = resolve, promiseReject = reject;
                        }), args = [], i = 0; i < arguments.length; i++)args.push(arguments[i]);
                        args.push(function(err, value) {
                            err ? promiseReject(err) : promiseResolve(value);
                        });
                        try {
                            original.apply(this, args);
                        } catch (err) {
                            promiseReject(err);
                        }
                        return promise;
                    }
                    return Object.setPrototypeOf(fn, Object.getPrototypeOf(original)), kCustomPromisifiedSymbol && Object.defineProperty(fn, kCustomPromisifiedSymbol, {
                        value: fn,
                        enumerable: !1,
                        writable: !1,
                        configurable: !0
                    }), Object.defineProperties(fn, getOwnPropertyDescriptors(original));
                }, exports.promisify.custom = kCustomPromisifiedSymbol, exports.callbackify = callbackify;
            }(util$1);
            var browser = {
                exports: {}
            }, process = browser.exports = {};
            function defaultSetTimout() {
                throw Error('setTimeout has not been defined');
            }
            function defaultClearTimeout() {
                throw Error('clearTimeout has not been defined');
            }
            function runTimeout(fun) {
                if (cachedSetTimeout === setTimeout) return setTimeout(fun, 0);
                if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) return cachedSetTimeout = setTimeout, setTimeout(fun, 0);
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
                if (cachedClearTimeout === clearTimeout) return clearTimeout(marker);
                if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) return cachedClearTimeout = clearTimeout, clearTimeout(marker);
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
            !function() {
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
            }();
            var queue = [], draining = !1, queueIndex = -1;
            function cleanUpNextTick() {
                draining && currentQueue && (draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, queue.length && drainQueue());
            }
            function drainQueue() {
                if (!draining) {
                    var timeout = runTimeout(cleanUpNextTick);
                    draining = !0;
                    for(var len = queue.length; len;){
                        for(currentQueue = queue, queue = []; ++queueIndex < len;)currentQueue && currentQueue[queueIndex].run();
                        queueIndex = -1, len = queue.length;
                    }
                    currentQueue = null, draining = !1, runClearTimeout(timeout);
                }
            }
            function Item(fun, array) {
                this.fun = fun, this.array = array;
            }
            function noop() {}
            function BufferList() {
                this.head = null, this.tail = null, this.length = 0;
            }
            process.nextTick = function(fun) {
                var args = Array(arguments.length - 1);
                if (arguments.length > 1) for(var i = 1; i < arguments.length; i++)args[i - 1] = arguments[i];
                queue.push(new Item(fun, args)), 1 !== queue.length || draining || runTimeout(drainQueue);
            }, Item.prototype.run = function() {
                this.fun.apply(null, this.array);
            }, process.title = 'browser', process.browser = !0, process.env = {}, process.argv = [], process.version = '', process.versions = {}, process.on = noop, process.addListener = noop, process.once = noop, process.off = noop, process.removeListener = noop, process.removeAllListeners = noop, process.emit = noop, process.prependListener = noop, process.prependOnceListener = noop, process.listeners = function(name) {
                return [];
            }, process.binding = function(name) {
                throw Error('process.binding is not supported');
            }, process.cwd = function() {
                return '/';
            }, process.chdir = function(dir) {
                throw Error('process.chdir is not supported');
            }, process.umask = function() {
                return 0;
            }, BufferList.prototype.push = function(v) {
                var entry = {
                    data: v,
                    next: null
                };
                this.length > 0 ? this.tail.next = entry : this.head = entry, this.tail = entry, ++this.length;
            }, BufferList.prototype.unshift = function(v) {
                var entry = {
                    data: v,
                    next: this.head
                };
                0 === this.length && (this.tail = entry), this.head = entry, ++this.length;
            }, BufferList.prototype.shift = function() {
                if (0 !== this.length) {
                    var ret = this.head.data;
                    return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, ret;
                }
            }, BufferList.prototype.clear = function() {
                this.head = this.tail = null, this.length = 0;
            }, BufferList.prototype.join = function(s) {
                if (0 === this.length) return '';
                for(var p = this.head, ret = '' + p.data; p = p.next;)ret += s + p.data;
                return ret;
            }, BufferList.prototype.concat = function(n) {
                if (0 === this.length) return buffer.Buffer.alloc(0);
                if (1 === this.length) return this.head.data;
                for(var ret = buffer.Buffer.allocUnsafe(n >>> 0), p = this.head, i = 0; p;)p.data.copy(ret, i), i += p.data.length, p = p.next;
                return ret;
            };
            var safeBuffer = {
                exports: {}
            };
            !function(module, exports) {
                var buffer$1 = buffer, Buffer = buffer$1.Buffer;
                function copyProps(src, dst) {
                    for(var key in src)dst[key] = src[key];
                }
                function SafeBuffer(arg, encodingOrOffset, length) {
                    return Buffer(arg, encodingOrOffset, length);
                }
                Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow ? module.exports = buffer$1 : (copyProps(buffer$1, exports), exports.Buffer = SafeBuffer), SafeBuffer.prototype = Object.create(Buffer.prototype), copyProps(Buffer, SafeBuffer), SafeBuffer.from = function(arg, encodingOrOffset, length) {
                    if ('number' == typeof arg) throw TypeError('Argument must not be a number');
                    return Buffer(arg, encodingOrOffset, length);
                }, SafeBuffer.alloc = function(size, fill, encoding) {
                    if ('number' != typeof size) throw TypeError('Argument must be a number');
                    var buf = Buffer(size);
                    return void 0 !== fill ? 'string' == typeof encoding ? buf.fill(fill, encoding) : buf.fill(fill) : buf.fill(0), buf;
                }, SafeBuffer.allocUnsafe = function(size) {
                    if ('number' != typeof size) throw TypeError('Argument must be a number');
                    return Buffer(size);
                }, SafeBuffer.allocUnsafeSlow = function(size) {
                    if ('number' != typeof size) throw TypeError('Argument must be a number');
                    return buffer$1.SlowBuffer(size);
                };
            }(safeBuffer, safeBuffer.exports);
            var Buffer = safeBuffer.exports.Buffer, isEncoding = Buffer.isEncoding || function(encoding) {
                switch((encoding = '' + encoding) && encoding.toLowerCase()){
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
                        return !0;
                    default:
                        return !1;
                }
            };
            function _normalizeEncoding(enc) {
                var retried;
                if (!enc) return 'utf8';
                for(;;)switch(enc){
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
                        enc = ('' + enc).toLowerCase(), retried = !0;
                }
            }
            function normalizeEncoding(enc) {
                var nenc = _normalizeEncoding(enc);
                if ('string' != typeof nenc && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw Error('Unknown encoding: ' + enc);
                return nenc || enc;
            }
            var StringDecoder_1 = StringDecoder;
            function StringDecoder(encoding) {
                var nb;
                switch(this.encoding = normalizeEncoding(encoding), this.encoding){
                    case 'utf16le':
                        this.text = utf16Text, this.end = utf16End, nb = 4;
                        break;
                    case 'utf8':
                        this.fillLast = utf8FillLast, nb = 4;
                        break;
                    case 'base64':
                        this.text = base64Text, this.end = base64End, nb = 3;
                        break;
                    default:
                        this.write = simpleWrite, this.end = simpleEnd;
                        return;
                }
                this.lastNeed = 0, this.lastTotal = 0, this.lastChar = Buffer.allocUnsafe(nb);
            }
            function utf8CheckByte(byte) {
                return byte <= 0x7F ? 0 : byte >> 5 == 0x06 ? 2 : byte >> 4 == 0x0E ? 3 : byte >> 3 == 0x1E ? 4 : byte >> 6 == 0x02 ? -1 : -2;
            }
            function utf8CheckIncomplete(self1, buf, i) {
                var j = buf.length - 1;
                if (j < i) return 0;
                var nb = utf8CheckByte(buf[j]);
                return nb >= 0 ? (nb > 0 && (self1.lastNeed = nb - 1), nb) : --j < i || -2 === nb ? 0 : (nb = utf8CheckByte(buf[j])) >= 0 ? (nb > 0 && (self1.lastNeed = nb - 2), nb) : --j < i || -2 === nb ? 0 : (nb = utf8CheckByte(buf[j])) >= 0 ? (nb > 0 && (2 === nb ? nb = 0 : self1.lastNeed = nb - 3), nb) : 0;
            }
            function utf8CheckExtraBytes(self1, buf, p) {
                if ((0xC0 & buf[0]) != 0x80) return self1.lastNeed = 0, "\uFFFD";
                if (self1.lastNeed > 1 && buf.length > 1) {
                    if ((0xC0 & buf[1]) != 0x80) return self1.lastNeed = 1, "\uFFFD";
                    if (self1.lastNeed > 2 && buf.length > 2 && (0xC0 & buf[2]) != 0x80) return self1.lastNeed = 2, "\uFFFD";
                }
            }
            function utf8FillLast(buf) {
                var p = this.lastTotal - this.lastNeed, r = utf8CheckExtraBytes(this, buf);
                return void 0 !== r ? r : this.lastNeed <= buf.length ? (buf.copy(this.lastChar, p, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : void (buf.copy(this.lastChar, p, 0, buf.length), this.lastNeed -= buf.length);
            }
            function utf8Text(buf, i) {
                var total = utf8CheckIncomplete(this, buf, i);
                if (!this.lastNeed) return buf.toString('utf8', i);
                this.lastTotal = total;
                var end = buf.length - (total - this.lastNeed);
                return buf.copy(this.lastChar, 0, end), buf.toString('utf8', i, end);
            }
            function utf8End(buf) {
                var r = buf && buf.length ? this.write(buf) : '';
                return this.lastNeed ? r + "\uFFFD" : r;
            }
            function utf16Text(buf, i) {
                if ((buf.length - i) % 2 == 0) {
                    var r = buf.toString('utf16le', i);
                    if (r) {
                        var c = r.charCodeAt(r.length - 1);
                        if (c >= 0xD800 && c <= 0xDBFF) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = buf[buf.length - 2], this.lastChar[1] = buf[buf.length - 1], r.slice(0, -1);
                    }
                    return r;
                }
                return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = buf[buf.length - 1], buf.toString('utf16le', i, buf.length - 1);
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
                return 0 === n ? buf.toString('base64', i) : (this.lastNeed = 3 - n, this.lastTotal = 3, 1 === n ? this.lastChar[0] = buf[buf.length - 1] : (this.lastChar[0] = buf[buf.length - 2], this.lastChar[1] = buf[buf.length - 1]), buf.toString('base64', i, buf.length - n));
            }
            function base64End(buf) {
                var r = buf && buf.length ? this.write(buf) : '';
                return this.lastNeed ? r + this.lastChar.toString('base64', 0, 3 - this.lastNeed) : r;
            }
            function simpleWrite(buf) {
                return buf.toString(this.encoding);
            }
            function simpleEnd(buf) {
                return buf && buf.length ? this.write(buf) : '';
            }
            StringDecoder.prototype.write = function(buf) {
                var r, i;
                if (0 === buf.length) return '';
                if (this.lastNeed) {
                    if (void 0 === (r = this.fillLast(buf))) return '';
                    i = this.lastNeed, this.lastNeed = 0;
                } else i = 0;
                return i < buf.length ? r ? r + this.text(buf, i) : this.text(buf, i) : r || '';
            }, StringDecoder.prototype.end = utf8End, StringDecoder.prototype.text = utf8Text, StringDecoder.prototype.fillLast = function(buf) {
                if (this.lastNeed <= buf.length) return buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
                buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length), this.lastNeed -= buf.length;
            }, Readable.ReadableState = ReadableState;
            var debug = util$1.debuglog('stream');
            function prependListener(emitter, event, fn) {
                if ('function' == typeof emitter.prependListener) return emitter.prependListener(event, fn);
                emitter._events && emitter._events[event] ? Array.isArray(emitter._events[event]) ? emitter._events[event].unshift(fn) : emitter._events[event] = [
                    fn,
                    emitter._events[event]
                ] : emitter.on(event, fn);
            }
            function listenerCount(emitter, type) {
                return emitter.listeners(type).length;
            }
            function ReadableState(options, stream) {
                options = options || {}, this.objectMode = !!options.objectMode, stream instanceof Duplex && (this.objectMode = this.objectMode || !!options.readableObjectMode);
                var hwm = options.highWaterMark, defaultHwm = this.objectMode ? 16 : 16384;
                this.highWaterMark = hwm || 0 === hwm ? hwm : defaultHwm, this.highWaterMark = ~~this.highWaterMark, this.buffer = new BufferList(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.defaultEncoding = options.defaultEncoding || 'utf8', this.ranOut = !1, this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, options.encoding && (this.decoder = new StringDecoder_1(options.encoding), this.encoding = options.encoding);
            }
            function Readable(options) {
                if (!(this instanceof Readable)) return new Readable(options);
                this._readableState = new ReadableState(options, this), this.readable = !0, options && 'function' == typeof options.read && (this._read = options.read), EE.call(this);
            }
            function readableAddChunk(stream, state, chunk, encoding, addToFront) {
                var er = chunkInvalid(state, chunk);
                if (er) stream.emit('error', er);
                else if (null === chunk) state.reading = !1, onEofChunk(stream, state);
                else if (state.objectMode || chunk && chunk.length > 0) {
                    if (state.ended && !addToFront) {
                        var skipAdd, e = Error('stream.push() after EOF');
                        stream.emit('error', e);
                    } else if (state.endEmitted && addToFront) {
                        var _e = Error('stream.unshift() after end event');
                        stream.emit('error', _e);
                    } else !state.decoder || addToFront || encoding || (chunk = state.decoder.write(chunk), skipAdd = !state.objectMode && 0 === chunk.length), addToFront || (state.reading = !1), !skipAdd && (state.flowing && 0 === state.length && !state.sync ? (stream.emit('data', chunk), stream.read(0)) : (state.length += state.objectMode ? 1 : chunk.length, addToFront ? state.buffer.unshift(chunk) : state.buffer.push(chunk), state.needReadable && emitReadable(stream))), maybeReadMore(stream, state);
                } else addToFront || (state.reading = !1);
                return needMoreData(state);
            }
            function needMoreData(state) {
                return !state.ended && (state.needReadable || state.length < state.highWaterMark || 0 === state.length);
            }
            util$1.inherits(Readable, EE), Readable.prototype.push = function(chunk, encoding) {
                var state = this._readableState;
                return state.objectMode || 'string' != typeof chunk || (encoding = encoding || state.defaultEncoding) === state.encoding || (chunk = Buffer$1.from(chunk, encoding), encoding = ''), readableAddChunk(this, state, chunk, encoding, !1);
            }, Readable.prototype.unshift = function(chunk) {
                return readableAddChunk(this, this._readableState, chunk, '', !0);
            }, Readable.prototype.isPaused = function() {
                return !1 === this._readableState.flowing;
            }, Readable.prototype.setEncoding = function(enc) {
                return this._readableState.decoder = new StringDecoder_1(enc), this._readableState.encoding = enc, this;
            };
            var MAX_HWM = 0x800000;
            function computeNewHighWaterMark(n) {
                return n >= MAX_HWM ? n = MAX_HWM : (n--, n |= n >>> 1, n |= n >>> 2, n |= n >>> 4, n |= n >>> 8, n |= n >>> 16, n++), n;
            }
            function howMuchToRead(n, state) {
                return n <= 0 || 0 === state.length && state.ended ? 0 : state.objectMode ? 1 : n != n ? state.flowing && state.length ? state.buffer.head.data.length : state.length : (n > state.highWaterMark && (state.highWaterMark = computeNewHighWaterMark(n)), n <= state.length) ? n : state.ended ? state.length : (state.needReadable = !0, 0);
            }
            function chunkInvalid(state, chunk) {
                var er = null;
                return Buffer$1.isBuffer(chunk) || 'string' == typeof chunk || null == chunk || state.objectMode || (er = TypeError('Invalid non-string/buffer chunk')), er;
            }
            function onEofChunk(stream, state) {
                if (!state.ended) {
                    if (state.decoder) {
                        var chunk = state.decoder.end();
                        chunk && chunk.length && (state.buffer.push(chunk), state.length += state.objectMode ? 1 : chunk.length);
                    }
                    state.ended = !0, emitReadable(stream);
                }
            }
            function emitReadable(stream) {
                var state = stream._readableState;
                state.needReadable = !1, state.emittedReadable || (debug('emitReadable', state.flowing), state.emittedReadable = !0, state.sync ? browser.exports.nextTick(emitReadable_, stream) : emitReadable_(stream));
            }
            function emitReadable_(stream) {
                debug('emit readable'), stream.emit('readable'), flow(stream);
            }
            function maybeReadMore(stream, state) {
                state.readingMore || (state.readingMore = !0, browser.exports.nextTick(maybeReadMore_, stream, state));
            }
            function maybeReadMore_(stream, state) {
                for(var len = state.length; !state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark && (debug('maybeReadMore read 0'), stream.read(0), len !== state.length);)len = state.length;
                state.readingMore = !1;
            }
            function pipeOnDrain(src) {
                return function() {
                    var state = src._readableState;
                    debug('pipeOnDrain', state.awaitDrain), state.awaitDrain && state.awaitDrain--, 0 === state.awaitDrain && src.listeners('data').length && (state.flowing = !0, flow(src));
                };
            }
            function nReadingNextTick(self1) {
                debug('readable nexttick read 0'), self1.read(0);
            }
            function resume(stream, state) {
                state.resumeScheduled || (state.resumeScheduled = !0, browser.exports.nextTick(resume_, stream, state));
            }
            function resume_(stream, state) {
                state.reading || (debug('resume read 0'), stream.read(0)), state.resumeScheduled = !1, state.awaitDrain = 0, stream.emit('resume'), flow(stream), state.flowing && !state.reading && stream.read(0);
            }
            function flow(stream) {
                var state = stream._readableState;
                for(debug('flow', state.flowing); state.flowing && null !== stream.read(););
            }
            function fromList(n, state) {
                var ret;
                return 0 === state.length ? null : (state.objectMode ? ret = state.buffer.shift() : !n || n >= state.length ? (ret = state.decoder ? state.buffer.join('') : 1 === state.buffer.length ? state.buffer.head.data : state.buffer.concat(state.length), state.buffer.clear()) : ret = fromListPartial(n, state.buffer, state.decoder), ret);
            }
            function fromListPartial(n, list, hasStrings) {
                var ret;
                return n < list.head.data.length ? (ret = list.head.data.slice(0, n), list.head.data = list.head.data.slice(n)) : ret = n === list.head.data.length ? list.shift() : hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list), ret;
            }
            function copyFromBufferString(n, list) {
                var p = list.head, c = 1, ret = p.data;
                for(n -= ret.length; p = p.next;){
                    var str = p.data, nb = n > str.length ? str.length : n;
                    if (nb === str.length ? ret += str : ret += str.slice(0, n), 0 == (n -= nb)) {
                        nb === str.length ? (++c, p.next ? list.head = p.next : list.head = list.tail = null) : (list.head = p, p.data = str.slice(nb));
                        break;
                    }
                    ++c;
                }
                return list.length -= c, ret;
            }
            function copyFromBuffer(n, list) {
                var ret = Buffer$1.allocUnsafe(n), p = list.head, c = 1;
                for(p.data.copy(ret), n -= p.data.length; p = p.next;){
                    var buf = p.data, nb = n > buf.length ? buf.length : n;
                    if (buf.copy(ret, ret.length - n, 0, nb), 0 == (n -= nb)) {
                        nb === buf.length ? (++c, p.next ? list.head = p.next : list.head = list.tail = null) : (list.head = p, p.data = buf.slice(nb));
                        break;
                    }
                    ++c;
                }
                return list.length -= c, ret;
            }
            function endReadable(stream) {
                var state = stream._readableState;
                if (state.length > 0) throw Error('"endReadable()" called on non-empty stream');
                state.endEmitted || (state.ended = !0, browser.exports.nextTick(endReadableNT, state, stream));
            }
            function endReadableNT(state, stream) {
                state.endEmitted || 0 !== state.length || (state.endEmitted = !0, stream.readable = !1, stream.emit('end'));
            }
            function forEach(xs, f) {
                for(var i = 0, l = xs.length; i < l; i++)f(xs[i], i);
            }
            function indexOf(xs, x) {
                for(var i = 0, l = xs.length; i < l; i++)if (xs[i] === x) return i;
                return -1;
            }
            function nop() {}
            function WriteReq(chunk, encoding, cb) {
                this.chunk = chunk, this.encoding = encoding, this.callback = cb, this.next = null;
            }
            function WritableState(options, stream) {
                Object.defineProperty(this, 'buffer', {
                    get: util$1.deprecate(function() {
                        return this.getBuffer();
                    }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.")
                }), options = options || {}, this.objectMode = !!options.objectMode, stream instanceof Duplex && (this.objectMode = this.objectMode || !!options.writableObjectMode);
                var hwm = options.highWaterMark, defaultHwm = this.objectMode ? 16 : 16384;
                this.highWaterMark = hwm || 0 === hwm ? hwm : defaultHwm, this.highWaterMark = ~~this.highWaterMark, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
                var noDecode = !1 === options.decodeStrings;
                this.decodeStrings = !noDecode, this.defaultEncoding = options.defaultEncoding || 'utf8', this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(er) {
                    onwrite(stream, er);
                }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new CorkedRequest(this);
            }
            function Writable(options) {
                if (!(this instanceof Writable) && !(this instanceof Duplex)) return new Writable(options);
                this._writableState = new WritableState(options, this), this.writable = !0, options && ('function' == typeof options.write && (this._write = options.write), 'function' == typeof options.writev && (this._writev = options.writev)), events.exports.EventEmitter.call(this);
            }
            function writeAfterEnd(stream, cb) {
                var er = Error('write after end');
                stream.emit('error', er), browser.exports.nextTick(cb, er);
            }
            function validChunk(stream, state, chunk, cb) {
                var valid = !0, er = !1;
                return null === chunk ? er = TypeError('May not write null values to stream') : buffer.Buffer.isBuffer(chunk) || 'string' == typeof chunk || void 0 === chunk || state.objectMode || (er = TypeError('Invalid non-string/buffer chunk')), er && (stream.emit('error', er), browser.exports.nextTick(cb, er), valid = !1), valid;
            }
            function decodeChunk(state, chunk, encoding) {
                return state.objectMode || !1 === state.decodeStrings || 'string' != typeof chunk || (chunk = buffer.Buffer.from(chunk, encoding)), chunk;
            }
            function writeOrBuffer(stream, state, chunk, encoding, cb) {
                chunk = decodeChunk(state, chunk, encoding), buffer.Buffer.isBuffer(chunk) && (encoding = 'buffer');
                var len = state.objectMode ? 1 : chunk.length;
                state.length += len;
                var ret = state.length < state.highWaterMark;
                if (ret || (state.needDrain = !0), state.writing || state.corked) {
                    var last = state.lastBufferedRequest;
                    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb), last ? last.next = state.lastBufferedRequest : state.bufferedRequest = state.lastBufferedRequest, state.bufferedRequestCount += 1;
                } else doWrite(stream, state, !1, len, chunk, encoding, cb);
                return ret;
            }
            function doWrite(stream, state, writev, len, chunk, encoding, cb) {
                state.writelen = len, state.writecb = cb, state.writing = !0, state.sync = !0, writev ? stream._writev(chunk, state.onwrite) : stream._write(chunk, encoding, state.onwrite), state.sync = !1;
            }
            function onwriteError(stream, state, sync, er, cb) {
                --state.pendingcb, sync ? browser.exports.nextTick(cb, er) : cb(er), stream._writableState.errorEmitted = !0, stream.emit('error', er);
            }
            function onwriteStateUpdate(state) {
                state.writing = !1, state.writecb = null, state.length -= state.writelen, state.writelen = 0;
            }
            function onwrite(stream, er) {
                var state = stream._writableState, sync = state.sync, cb = state.writecb;
                if (onwriteStateUpdate(state), er) onwriteError(stream, state, sync, er, cb);
                else {
                    var finished = needFinish(state);
                    finished || state.corked || state.bufferProcessing || !state.bufferedRequest || clearBuffer(stream, state), sync ? browser.exports.nextTick(afterWrite, stream, state, finished, cb) : afterWrite(stream, state, finished, cb);
                }
            }
            function afterWrite(stream, state, finished, cb) {
                finished || onwriteDrain(stream, state), state.pendingcb--, cb(), finishMaybe(stream, state);
            }
            function onwriteDrain(stream, state) {
                0 === state.length && state.needDrain && (state.needDrain = !1, stream.emit('drain'));
            }
            function clearBuffer(stream, state) {
                state.bufferProcessing = !0;
                var entry = state.bufferedRequest;
                if (stream._writev && entry && entry.next) {
                    var buffer = Array(state.bufferedRequestCount), holder = state.corkedRequestsFree;
                    holder.entry = entry;
                    for(var count = 0; entry;)buffer[count] = entry, entry = entry.next, count += 1;
                    doWrite(stream, state, !0, state.length, buffer, '', holder.finish), state.pendingcb++, state.lastBufferedRequest = null, holder.next ? (state.corkedRequestsFree = holder.next, holder.next = null) : state.corkedRequestsFree = new CorkedRequest(state);
                } else {
                    for(; entry;){
                        var chunk = entry.chunk, encoding = entry.encoding, cb = entry.callback, len = state.objectMode ? 1 : chunk.length;
                        if (doWrite(stream, state, !1, len, chunk, encoding, cb), entry = entry.next, state.writing) break;
                    }
                    null === entry && (state.lastBufferedRequest = null);
                }
                state.bufferedRequestCount = 0, state.bufferedRequest = entry, state.bufferProcessing = !1;
            }
            function needFinish(state) {
                return state.ending && 0 === state.length && null === state.bufferedRequest && !state.finished && !state.writing;
            }
            function prefinish(stream, state) {
                state.prefinished || (state.prefinished = !0, stream.emit('prefinish'));
            }
            function finishMaybe(stream, state) {
                var need = needFinish(state);
                return need && (0 === state.pendingcb ? (prefinish(stream, state), state.finished = !0, stream.emit('finish')) : prefinish(stream, state)), need;
            }
            function endWritable(stream, state, cb) {
                state.ending = !0, finishMaybe(stream, state), cb && (state.finished ? browser.exports.nextTick(cb) : stream.once('finish', cb)), state.ended = !0, stream.writable = !1;
            }
            function CorkedRequest(state) {
                var _this = this;
                this.next = null, this.entry = null, this.finish = function(err) {
                    var entry = _this.entry;
                    for(_this.entry = null; entry;){
                        var cb = entry.callback;
                        state.pendingcb--, cb(err), entry = entry.next;
                    }
                    state.corkedRequestsFree ? state.corkedRequestsFree.next = _this : state.corkedRequestsFree = _this;
                };
            }
            Readable.prototype.read = function(n) {
                debug('read', n), n = parseInt(n, 10);
                var ret, state = this._readableState, nOrig = n;
                if (0 !== n && (state.emittedReadable = !1), 0 === n && state.needReadable && (state.length >= state.highWaterMark || state.ended)) return debug('read: emitReadable', state.length, state.ended), 0 === state.length && state.ended ? endReadable(this) : emitReadable(this), null;
                if (0 === (n = howMuchToRead(n, state)) && state.ended) return 0 === state.length && endReadable(this), null;
                var doRead = state.needReadable;
                return debug('need readable', doRead), (0 === state.length || state.length - n < state.highWaterMark) && debug('length less than watermark', doRead = !0), state.ended || state.reading ? debug('reading or ended', doRead = !1) : doRead && (debug('do read'), state.reading = !0, state.sync = !0, 0 === state.length && (state.needReadable = !0), this._read(state.highWaterMark), state.sync = !1, state.reading || (n = howMuchToRead(nOrig, state))), null === (ret = n > 0 ? fromList(n, state) : null) ? (state.needReadable = !0, n = 0) : state.length -= n, 0 === state.length && (state.ended || (state.needReadable = !0), nOrig !== n && state.ended && endReadable(this)), null !== ret && this.emit('data', ret), ret;
            }, Readable.prototype._read = function(n) {
                this.emit('error', Error('not implemented'));
            }, Readable.prototype.pipe = function(dest, pipeOpts) {
                var src = this, state = this._readableState;
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
                }
                state.pipesCount += 1, debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
                var endFn = pipeOpts && !1 === pipeOpts.end ? cleanup : onend;
                function onunpipe(readable) {
                    debug('onunpipe'), readable === src && cleanup();
                }
                function onend() {
                    debug('onend'), dest.end();
                }
                state.endEmitted ? browser.exports.nextTick(endFn) : src.once('end', endFn), dest.on('unpipe', onunpipe);
                var ondrain = pipeOnDrain(src);
                dest.on('drain', ondrain);
                var cleanedUp = !1;
                function cleanup() {
                    debug('cleanup'), dest.removeListener('close', onclose), dest.removeListener('finish', onfinish), dest.removeListener('drain', ondrain), dest.removeListener('error', onerror), dest.removeListener('unpipe', onunpipe), src.removeListener('end', onend), src.removeListener('end', cleanup), src.removeListener('data', ondata), cleanedUp = !0, state.awaitDrain && (!dest._writableState || dest._writableState.needDrain) && ondrain();
                }
                var increasedAwaitDrain = !1;
                function ondata(chunk) {
                    debug('ondata'), increasedAwaitDrain = !1, !1 !== dest.write(chunk) || increasedAwaitDrain || ((1 === state.pipesCount && state.pipes === dest || state.pipesCount > 1 && -1 !== indexOf(state.pipes, dest)) && !cleanedUp && (debug('false write response, pause', src._readableState.awaitDrain), src._readableState.awaitDrain++, increasedAwaitDrain = !0), src.pause());
                }
                function onerror(er) {
                    debug('onerror', er), unpipe(), dest.removeListener('error', onerror), 0 === listenerCount(dest, 'error') && dest.emit('error', er);
                }
                function onclose() {
                    dest.removeListener('finish', onfinish), unpipe();
                }
                function onfinish() {
                    debug('onfinish'), dest.removeListener('close', onclose), unpipe();
                }
                function unpipe() {
                    debug('unpipe'), src.unpipe(dest);
                }
                return src.on('data', ondata), prependListener(dest, 'error', onerror), dest.once('close', onclose), dest.once('finish', onfinish), dest.emit('pipe', src), state.flowing || (debug('pipe resume'), src.resume()), dest;
            }, Readable.prototype.unpipe = function(dest) {
                var state = this._readableState;
                if (0 === state.pipesCount) return this;
                if (1 === state.pipesCount) return dest && dest !== state.pipes || (dest || (dest = state.pipes), state.pipes = null, state.pipesCount = 0, state.flowing = !1, dest && dest.emit('unpipe', this)), this;
                if (!dest) {
                    var dests = state.pipes, len = state.pipesCount;
                    state.pipes = null, state.pipesCount = 0, state.flowing = !1;
                    for(var _i = 0; _i < len; _i++)dests[_i].emit('unpipe', this);
                    return this;
                }
                var i = indexOf(state.pipes, dest);
                return -1 === i || (state.pipes.splice(i, 1), state.pipesCount -= 1, 1 === state.pipesCount && (state.pipes = state.pipes[0]), dest.emit('unpipe', this)), this;
            }, Readable.prototype.on = function(ev, fn) {
                var res = EE.prototype.on.call(this, ev, fn);
                if ('data' === ev) !1 !== this._readableState.flowing && this.resume();
                else if ('readable' === ev) {
                    var state = this._readableState;
                    state.endEmitted || state.readableListening || (state.readableListening = state.needReadable = !0, state.emittedReadable = !1, state.reading ? state.length && emitReadable(this) : browser.exports.nextTick(nReadingNextTick, this));
                }
                return res;
            }, Readable.prototype.addListener = Readable.prototype.on, Readable.prototype.resume = function() {
                var state = this._readableState;
                return state.flowing || (debug('resume'), state.flowing = !0, resume(this, state)), this;
            }, Readable.prototype.pause = function() {
                return debug('call pause flowing=%j', this._readableState.flowing), !1 !== this._readableState.flowing && (debug('pause'), this._readableState.flowing = !1, this.emit('pause')), this;
            }, Readable.prototype.wrap = function(stream) {
                var state = this._readableState, paused = !1, self1 = this;
                for(var i in stream.on('end', function() {
                    if (debug('wrapped end'), state.decoder && !state.ended) {
                        var chunk = state.decoder.end();
                        chunk && chunk.length && self1.push(chunk);
                    }
                    self1.push(null);
                }), stream.on('data', function(chunk) {
                    debug('wrapped data'), state.decoder && (chunk = state.decoder.write(chunk)), (!state.objectMode || null != chunk) && (state.objectMode || chunk && chunk.length) && (self1.push(chunk) || (paused = !0, stream.pause()));
                }), stream)void 0 === this[i] && 'function' == typeof stream[i] && (this[i] = function(method) {
                    return function() {
                        return stream[method].apply(stream, arguments);
                    };
                }(i));
                return forEach([
                    'error',
                    'close',
                    'destroy',
                    'pause',
                    'resume'
                ], function(ev) {
                    stream.on(ev, self1.emit.bind(self1, ev));
                }), self1._read = function(n) {
                    debug('wrapped _read', n), paused && (paused = !1, stream.resume());
                }, self1;
            }, Readable._fromList = fromList, Writable.WritableState = WritableState, util$1.inherits(Writable, events.exports.EventEmitter), WritableState.prototype.getBuffer = function() {
                for(var current = this.bufferedRequest, out = []; current;)out.push(current), current = current.next;
                return out;
            }, Writable.prototype.pipe = function() {
                this.emit('error', Error('Cannot pipe, not readable'));
            }, Writable.prototype.write = function(chunk, encoding, cb) {
                var state = this._writableState, ret = !1;
                return 'function' == typeof encoding && (cb = encoding, encoding = null), buffer.Buffer.isBuffer(chunk) ? encoding = 'buffer' : encoding || (encoding = state.defaultEncoding), 'function' != typeof cb && (cb = nop), state.ended ? writeAfterEnd(this, cb) : validChunk(this, state, chunk, cb) && (state.pendingcb++, ret = writeOrBuffer(this, state, chunk, encoding, cb)), ret;
            }, Writable.prototype.cork = function() {
                var state = this._writableState;
                state.corked++;
            }, Writable.prototype.uncork = function() {
                var state = this._writableState;
                !state.corked || (state.corked--, state.writing || state.corked || state.finished || state.bufferProcessing || !state.bufferedRequest || clearBuffer(this, state));
            }, Writable.prototype.setDefaultEncoding = function(encoding) {
                if ('string' == typeof encoding && (encoding = encoding.toLowerCase()), !([
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
                return this._writableState.defaultEncoding = encoding, this;
            }, Writable.prototype._write = function(chunk, encoding, cb) {
                cb(Error('not implemented'));
            }, Writable.prototype._writev = null, Writable.prototype.end = function(chunk, encoding, cb) {
                var state = this._writableState;
                'function' == typeof chunk ? (cb = chunk, chunk = null, encoding = null) : 'function' == typeof encoding && (cb = encoding, encoding = null), null != chunk && this.write(chunk, encoding), state.corked && (state.corked = 1, this.uncork()), state.ending || state.finished || endWritable(this, state, cb);
            }, util$1.inherits(Duplex, Readable);
            for(var keys$1 = Object.keys(Writable.prototype), v = 0; v < keys$1.length; v++){
                var method = keys$1[v];
                Duplex.prototype[method] || (Duplex.prototype[method] = Writable.prototype[method]);
            }
            function Duplex(options) {
                if (!(this instanceof Duplex)) return new Duplex(options);
                Readable.call(this, options), Writable.call(this, options), options && !1 === options.readable && (this.readable = !1), options && !1 === options.writable && (this.writable = !1), this.allowHalfOpen = !0, options && !1 === options.allowHalfOpen && (this.allowHalfOpen = !1), this.once('end', onend);
            }
            function onend() {
                this.allowHalfOpen || this._writableState.ended || browser.exports.nextTick(onEndNT, this);
            }
            function onEndNT(self1) {
                self1.end();
            }
            function TransformState(stream) {
                this.afterTransform = function(er, data) {
                    return afterTransform(stream, er, data);
                }, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null, this.writeencoding = null;
            }
            function afterTransform(stream, er, data) {
                var ts = stream._transformState;
                ts.transforming = !1;
                var cb = ts.writecb;
                if (!cb) return stream.emit('error', Error('no writecb in Transform class'));
                ts.writechunk = null, ts.writecb = null, null != data && stream.push(data), cb(er);
                var rs = stream._readableState;
                rs.reading = !1, (rs.needReadable || rs.length < rs.highWaterMark) && stream._read(rs.highWaterMark);
            }
            function Transform(options) {
                if (!(this instanceof Transform)) return new Transform(options);
                Duplex.call(this, options), this._transformState = new TransformState(this);
                var stream = this;
                this._readableState.needReadable = !0, this._readableState.sync = !1, options && ('function' == typeof options.transform && (this._transform = options.transform), 'function' == typeof options.flush && (this._flush = options.flush)), this.once('prefinish', function() {
                    'function' == typeof this._flush ? this._flush(function(er) {
                        done(stream, er);
                    }) : done(stream);
                });
            }
            function done(stream, er) {
                if (er) return stream.emit('error', er);
                var ws = stream._writableState, ts = stream._transformState;
                if (ws.length) throw Error('Calling transform done when ws.length != 0');
                if (ts.transforming) throw Error('Calling transform done when still transforming');
                return stream.push(null);
            }
            function PassThrough(options) {
                if (!(this instanceof PassThrough)) return new PassThrough(options);
                Transform.call(this, options);
            }
            function Stream() {
                EE.call(this);
            }
            util$1.inherits(Transform, Duplex), Transform.prototype.push = function(chunk, encoding) {
                return this._transformState.needTransform = !1, Duplex.prototype.push.call(this, chunk, encoding);
            }, Transform.prototype._transform = function(chunk, encoding, cb) {
                throw Error('Not implemented');
            }, Transform.prototype._write = function(chunk, encoding, cb) {
                var ts = this._transformState;
                if (ts.writecb = cb, ts.writechunk = chunk, ts.writeencoding = encoding, !ts.transforming) {
                    var rs = this._readableState;
                    (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) && this._read(rs.highWaterMark);
                }
            }, Transform.prototype._read = function(n) {
                var ts = this._transformState;
                null !== ts.writechunk && ts.writecb && !ts.transforming ? (ts.transforming = !0, this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform)) : ts.needTransform = !0;
            }, util$1.inherits(PassThrough, Transform), PassThrough.prototype._transform = function(chunk, encoding, cb) {
                cb(null, chunk);
            }, util$1.inherits(Stream, EE), Stream.Readable = Readable, Stream.Writable = Writable, Stream.Duplex = Duplex, Stream.Transform = Transform, Stream.PassThrough = PassThrough, Stream.Stream = Stream, Stream.prototype.pipe = function(dest, options) {
                var source = this;
                function ondata(chunk) {
                    dest.writable && !1 === dest.write(chunk) && source.pause && source.pause();
                }
                function ondrain() {
                    source.readable && source.resume && source.resume();
                }
                source.on('data', ondata), dest.on('drain', ondrain), dest._isStdio || options && !1 === options.end || (source.on('end', onend), source.on('close', onclose));
                var didOnEnd = !1;
                function onend() {
                    didOnEnd || (didOnEnd = !0, dest.end());
                }
                function onclose() {
                    didOnEnd || (didOnEnd = !0, 'function' == typeof dest.destroy && dest.destroy());
                }
                function onerror(er) {
                    if (cleanup(), 0 === EE.listenerCount(this, 'error')) throw er;
                }
                function cleanup() {
                    source.removeListener('data', ondata), dest.removeListener('drain', ondrain), source.removeListener('end', onend), source.removeListener('close', onclose), source.removeListener('error', onerror), dest.removeListener('error', onerror), source.removeListener('end', cleanup), source.removeListener('close', cleanup), dest.removeListener('close', cleanup);
                }
                return source.on('error', onerror), dest.on('error', onerror), source.on('end', cleanup), source.on('close', cleanup), dest.on('close', cleanup), dest.emit('pipe', source), dest;
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
            }), require$$1 = getAugmentedNamespace(_polyfillNode_stream), binding = {}, assert$2 = {
                exports: {}
            }, errors = {};
            function _typeof$3(obj) {
                return (_typeof$3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                    return typeof obj;
                } : function(obj) {
                    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                })(obj);
            }
            function _classCallCheck$2(instance, Constructor) {
                if (!(instance instanceof Constructor)) throw TypeError("Cannot call a class as a function");
            }
            function _possibleConstructorReturn$1(self1, call) {
                return call && ("object" === _typeof$3(call) || "function" == typeof call) ? call : _assertThisInitialized$1(self1);
            }
            function _assertThisInitialized$1(self1) {
                if (void 0 === self1) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
                return self1;
            }
            function _getPrototypeOf$1(o) {
                return (_getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
                    return o.__proto__ || Object.getPrototypeOf(o);
                })(o);
            }
            function _inherits$1(subClass, superClass) {
                if ("function" != typeof superClass && null !== superClass) throw TypeError("Super expression must either be null or a function");
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        writable: !0,
                        configurable: !0
                    }
                }), superClass && _setPrototypeOf$1(subClass, superClass);
            }
            function _setPrototypeOf$1(o, p) {
                return (_setPrototypeOf$1 = Object.setPrototypeOf || function(o, p) {
                    return o.__proto__ = p, o;
                })(o, p);
            }
            var codes = {};
            function createErrorType(code, message, Base) {
                function getMessage(arg1, arg2, arg3) {
                    return 'string' == typeof message ? message : message(arg1, arg2, arg3);
                }
                Base || (Base = Error);
                var NodeError = function(_Base) {
                    function NodeError(arg1, arg2, arg3) {
                        var _this;
                        return _classCallCheck$2(this, NodeError), (_this = _possibleConstructorReturn$1(this, _getPrototypeOf$1(NodeError).call(this, getMessage(arg1, arg2, arg3)))).code = code, _this;
                    }
                    return _inherits$1(NodeError, _Base), NodeError;
                }(Base);
                codes[code] = NodeError;
            }
            function oneOf(expected, thing) {
                if (!Array.isArray(expected)) return "of ".concat(thing, " ").concat(String(expected));
                var len = expected.length;
                return (expected = expected.map(function(i) {
                    return String(i);
                }), len > 2) ? "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(', '), ", or ") + expected[len - 1] : 2 === len ? "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]) : "of ".concat(thing, " ").concat(expected[0]);
            }
            function startsWith(str, search, pos) {
                return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
            }
            function endsWith$1(str, search, this_len) {
                return (void 0 === this_len || this_len > str.length) && (this_len = str.length), str.substring(this_len - search.length, this_len) === search;
            }
            function includes(str, search, start) {
                return 'number' != typeof start && (start = 0), !(start + search.length > str.length) && -1 !== str.indexOf(search, start);
            }
            function _objectSpread(target) {
                for(var i = 1; i < arguments.length; i++){
                    var source = null != arguments[i] ? arguments[i] : {}, ownKeys = Object.keys(source);
                    'function' == typeof Object.getOwnPropertySymbols && (ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
                    }))), ownKeys.forEach(function(key) {
                        _defineProperty(target, key, source[key]);
                    });
                }
                return target;
            }
            function _defineProperty(obj, key, value) {
                return key in obj ? Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : obj[key] = value, obj;
            }
            function _classCallCheck$1(instance, Constructor) {
                if (!(instance instanceof Constructor)) throw TypeError("Cannot call a class as a function");
            }
            function _defineProperties(target, props) {
                for(var i = 0; i < props.length; i++){
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            function _createClass(Constructor, protoProps, staticProps) {
                return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
            }
            function _possibleConstructorReturn(self1, call) {
                return call && ("object" === _typeof$2(call) || "function" == typeof call) ? call : _assertThisInitialized(self1);
            }
            function _assertThisInitialized(self1) {
                if (void 0 === self1) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
                return self1;
            }
            function _inherits(subClass, superClass) {
                if ("function" != typeof superClass && null !== superClass) throw TypeError("Super expression must either be null or a function");
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        writable: !0,
                        configurable: !0
                    }
                }), superClass && _setPrototypeOf(subClass, superClass);
            }
            function _wrapNativeSuper(Class) {
                var _cache = "function" == typeof Map ? new Map() : void 0;
                return (_wrapNativeSuper = function(Class) {
                    if (null === Class || !_isNativeFunction(Class)) return Class;
                    if ("function" != typeof Class) throw TypeError("Super expression must either be null or a function");
                    if (void 0 !== _cache) {
                        if (_cache.has(Class)) return _cache.get(Class);
                        _cache.set(Class, Wrapper);
                    }
                    function Wrapper() {
                        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
                    }
                    return Wrapper.prototype = Object.create(Class.prototype, {
                        constructor: {
                            value: Wrapper,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }), _setPrototypeOf(Wrapper, Class);
                })(Class);
            }
            function isNativeReflectConstruct() {
                if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Date.prototype.toString.call(Reflect.construct(Date, [], function() {})), !0;
                } catch (e) {
                    return !1;
                }
            }
            function _construct(Parent, args, Class) {
                return (_construct = isNativeReflectConstruct() ? Reflect.construct : function(Parent, args, Class) {
                    var a = [
                        null
                    ];
                    a.push.apply(a, args);
                    var instance = new (Function.bind.apply(Parent, a))();
                    return Class && _setPrototypeOf(instance, Class.prototype), instance;
                }).apply(null, arguments);
            }
            function _isNativeFunction(fn) {
                return -1 !== Function.toString.call(fn).indexOf("[native code]");
            }
            function _setPrototypeOf(o, p) {
                return (_setPrototypeOf = Object.setPrototypeOf || function(o, p) {
                    return o.__proto__ = p, o;
                })(o, p);
            }
            function _getPrototypeOf(o) {
                return (_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function(o) {
                    return o.__proto__ || Object.getPrototypeOf(o);
                })(o);
            }
            function _typeof$2(obj) {
                return (_typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                    return typeof obj;
                } : function(obj) {
                    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                })(obj);
            }
            createErrorType('ERR_AMBIGUOUS_ARGUMENT', 'The "%s" argument is ambiguous. %s', TypeError), createErrorType('ERR_INVALID_ARG_TYPE', function(name, expected, actual) {
                if (void 0 === assert$1 && (assert$1 = assert$2.exports), assert$1('string' == typeof name, "'name' must be a string"), 'string' == typeof expected && startsWith(expected, 'not ') ? (determiner = 'must not be', expected = expected.replace(/^not /, '')) : determiner = 'must be', endsWith$1(name, ' argument')) msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
                else {
                    var determiner, msg, type = includes(name, '.') ? 'property' : 'argument';
                    msg = "The \"".concat(name, "\" ").concat(type, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
                }
                return msg + ". Received type ".concat(_typeof$3(actual));
            }, TypeError), createErrorType('ERR_INVALID_ARG_VALUE', function(name, value) {
                var reason = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 'is invalid';
                void 0 === util && (util = util$1);
                var inspected = util.inspect(value);
                return inspected.length > 128 && (inspected = "".concat(inspected.slice(0, 128), "...")), "The argument '".concat(name, "' ").concat(reason, ". Received ").concat(inspected);
            }, TypeError), createErrorType('ERR_INVALID_RETURN_VALUE', function(input, name, value) {
                var type;
                return type = value && value.constructor && value.constructor.name ? "instance of ".concat(value.constructor.name) : "type ".concat(_typeof$3(value)), "Expected ".concat(input, " to be returned from the \"").concat(name, "\"") + " function but got ".concat(type, ".");
            }, TypeError), createErrorType('ERR_MISSING_ARGS', function() {
                for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                void 0 === assert$1 && (assert$1 = assert$2.exports), assert$1(args.length > 0, 'At least one arg needs to be specified');
                var msg = 'The ', len = args.length;
                switch(args = args.map(function(a) {
                    return "\"".concat(a, "\"");
                }), len){
                    case 1:
                        msg += "".concat(args[0], " argument");
                        break;
                    case 2:
                        msg += "".concat(args[0], " and ").concat(args[1], " arguments");
                        break;
                    default:
                        msg += args.slice(0, len - 1).join(', '), msg += ", and ".concat(args[len - 1], " arguments");
                }
                return "".concat(msg, " must be specified");
            }, TypeError), errors.codes = codes;
            var inspect$1 = util$1.inspect, ERR_INVALID_ARG_TYPE$1 = errors.codes.ERR_INVALID_ARG_TYPE;
            function endsWith(str, search, this_len) {
                return (void 0 === this_len || this_len > str.length) && (this_len = str.length), str.substring(this_len - search.length, this_len) === search;
            }
            function repeat(str, count) {
                if (count = Math.floor(count), 0 == str.length || 0 == count) return '';
                var maxCount = str.length * count;
                for(count = Math.floor(Math.log(count) / Math.log(2)); count;)str += str, count--;
                return str + str.substring(0, maxCount - str.length);
            }
            var blue = '', green = '', red = '', white = '', kReadableOperator = {
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
            function copyError(source) {
                var keys = Object.keys(source), target = Object.create(Object.getPrototypeOf(source));
                return keys.forEach(function(key) {
                    target[key] = source[key];
                }), Object.defineProperty(target, 'message', {
                    value: source.message
                }), target;
            }
            function inspectValue(val) {
                return inspect$1(val, {
                    compact: !1,
                    customInspect: !1,
                    depth: 1000,
                    maxArrayLength: 1 / 0,
                    showHidden: !1,
                    breakLength: 1 / 0,
                    showProxy: !1,
                    sorted: !0,
                    getters: !0
                });
            }
            function createErrDiff(actual, expected, operator) {
                var other = '', res = '', lastPos = 0, end = '', skipped = !1, actualInspected = inspectValue(actual), actualLines = actualInspected.split('\n'), expectedLines = inspectValue(expected).split('\n'), i = 0, indicator = '';
                if ('strictEqual' === operator && 'object' === _typeof$2(actual) && 'object' === _typeof$2(expected) && null !== actual && null !== expected && (operator = 'strictEqualObject'), 1 === actualLines.length && 1 === expectedLines.length && actualLines[0] !== expectedLines[0]) {
                    var inputLength = actualLines[0].length + expectedLines[0].length;
                    if (inputLength <= 10) {
                        if (('object' !== _typeof$2(actual) || null === actual) && ('object' !== _typeof$2(expected) || null === expected) && (0 !== actual || 0 !== expected)) return "".concat(kReadableOperator[operator], "\n\n") + "".concat(actualLines[0], " !== ").concat(expectedLines[0], "\n");
                    } else if ('strictEqualObject' !== operator && inputLength < 80) {
                        for(; actualLines[0][i] === expectedLines[0][i];)i++;
                        i > 2 && (indicator = "\n  ".concat(repeat(' ', i), "^"), i = 0);
                    }
                }
                for(var a = actualLines[actualLines.length - 1], b = expectedLines[expectedLines.length - 1]; a === b && (i++ < 2 ? end = "\n  ".concat(a).concat(end) : other = a, actualLines.pop(), expectedLines.pop(), 0 !== actualLines.length && 0 !== expectedLines.length);)a = actualLines[actualLines.length - 1], b = expectedLines[expectedLines.length - 1];
                var maxLines = Math.max(actualLines.length, expectedLines.length);
                if (0 === maxLines) {
                    var _actualLines = actualInspected.split('\n');
                    if (_actualLines.length > 30) for(_actualLines[26] = "".concat(blue, "...").concat(white); _actualLines.length > 27;)_actualLines.pop();
                    return "".concat(kReadableOperator.notIdentical, "\n\n").concat(_actualLines.join('\n'), "\n");
                }
                i > 3 && (end = "\n".concat(blue, "...").concat(white).concat(end), skipped = !0), '' !== other && (end = "\n  ".concat(other).concat(end), other = '');
                var printedLines = 0, msg = kReadableOperator[operator] + "\n".concat(green, "+ actual").concat(white, " ").concat(red, "- expected").concat(white), skippedMsg = " ".concat(blue, "...").concat(white, " Lines skipped");
                for(i = 0; i < maxLines; i++){
                    var cur = i - lastPos;
                    if (actualLines.length < i + 1) cur > 1 && i > 2 && (cur > 4 ? (res += "\n".concat(blue, "...").concat(white), skipped = !0) : cur > 3 && (res += "\n  ".concat(expectedLines[i - 2]), printedLines++), res += "\n  ".concat(expectedLines[i - 1]), printedLines++), lastPos = i, other += "\n".concat(red, "-").concat(white, " ").concat(expectedLines[i]), printedLines++;
                    else if (expectedLines.length < i + 1) cur > 1 && i > 2 && (cur > 4 ? (res += "\n".concat(blue, "...").concat(white), skipped = !0) : cur > 3 && (res += "\n  ".concat(actualLines[i - 2]), printedLines++), res += "\n  ".concat(actualLines[i - 1]), printedLines++), lastPos = i, res += "\n".concat(green, "+").concat(white, " ").concat(actualLines[i]), printedLines++;
                    else {
                        var expectedLine = expectedLines[i], actualLine = actualLines[i], divergingLines = actualLine !== expectedLine && (!endsWith(actualLine, ',') || actualLine.slice(0, -1) !== expectedLine);
                        divergingLines && endsWith(expectedLine, ',') && expectedLine.slice(0, -1) === actualLine && (divergingLines = !1, actualLine += ','), divergingLines ? (cur > 1 && i > 2 && (cur > 4 ? (res += "\n".concat(blue, "...").concat(white), skipped = !0) : cur > 3 && (res += "\n  ".concat(actualLines[i - 2]), printedLines++), res += "\n  ".concat(actualLines[i - 1]), printedLines++), lastPos = i, res += "\n".concat(green, "+").concat(white, " ").concat(actualLine), other += "\n".concat(red, "-").concat(white, " ").concat(expectedLine), printedLines += 2) : (res += other, other = '', (1 === cur || 0 === i) && (res += "\n  ".concat(actualLine), printedLines++));
                    }
                    if (printedLines > 20 && i < maxLines - 2) return "".concat(msg).concat(skippedMsg, "\n").concat(res, "\n").concat(blue, "...").concat(white).concat(other, "\n") + "".concat(blue, "...").concat(white);
                }
                return "".concat(msg).concat(skipped ? skippedMsg : '', "\n").concat(res).concat(other).concat(end).concat(indicator);
            }
            var AssertionError$1 = function(_Error) {
                function AssertionError(options) {
                    if (_classCallCheck$1(this, AssertionError), 'object' !== _typeof$2(options) || null === options) throw new ERR_INVALID_ARG_TYPE$1('options', 'Object', options);
                    var _this, message = options.message, operator = options.operator, stackStartFn = options.stackStartFn, actual = options.actual, expected = options.expected, limit = Error.stackTraceLimit;
                    if (Error.stackTraceLimit = 0, null != message) _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, String(message)));
                    else if ('object' === _typeof$2(actual) && null !== actual && 'object' === _typeof$2(expected) && null !== expected && 'stack' in actual && actual instanceof Error && 'stack' in expected && expected instanceof Error && (actual = copyError(actual), expected = copyError(expected)), 'deepStrictEqual' === operator || 'strictEqual' === operator) _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, createErrDiff(actual, expected, operator)));
                    else if ('notDeepStrictEqual' === operator || 'notStrictEqual' === operator) {
                        var base = kReadableOperator[operator], res = inspectValue(actual).split('\n');
                        if ('notStrictEqual' === operator && 'object' === _typeof$2(actual) && null !== actual && (base = kReadableOperator.notStrictEqualObject), res.length > 30) for(res[26] = "".concat(blue, "...").concat(white); res.length > 27;)res.pop();
                        _this = 1 === res.length ? _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, "".concat(base, " ").concat(res[0]))) : _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, "".concat(base, "\n\n").concat(res.join('\n'), "\n")));
                    } else {
                        var _res = inspectValue(actual), other = '', knownOperators = kReadableOperator[operator];
                        'notDeepEqual' === operator || 'notEqual' === operator ? (_res = "".concat(kReadableOperator[operator], "\n\n").concat(_res)).length > 1024 && (_res = "".concat(_res.slice(0, 1021), "...")) : (other = "".concat(inspectValue(expected)), _res.length > 512 && (_res = "".concat(_res.slice(0, 509), "...")), other.length > 512 && (other = "".concat(other.slice(0, 509), "...")), 'deepEqual' === operator || 'equal' === operator ? _res = "".concat(knownOperators, "\n\n").concat(_res, "\n\nshould equal\n\n") : other = " ".concat(operator, " ").concat(other)), _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, "".concat(_res).concat(other)));
                    }
                    return Error.stackTraceLimit = limit, _this.generatedMessage = !message, Object.defineProperty(_assertThisInitialized(_this), 'name', {
                        value: 'AssertionError [ERR_ASSERTION]',
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }), _this.code = 'ERR_ASSERTION', _this.actual = actual, _this.expected = expected, _this.operator = operator, Error.captureStackTrace && Error.captureStackTrace(_assertThisInitialized(_this), stackStartFn), _this.stack, _this.name = 'AssertionError', _possibleConstructorReturn(_this);
                }
                return _inherits(AssertionError, _Error), _createClass(AssertionError, [
                    {
                        key: "toString",
                        value: function() {
                            return "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message);
                        }
                    },
                    {
                        key: inspect$1.custom,
                        value: function(recurseTimes, ctx) {
                            return inspect$1(this, _objectSpread({}, ctx, {
                                customInspect: !1,
                                depth: 0
                            }));
                        }
                    }
                ]), AssertionError;
            }(_wrapNativeSuper(Error));
            function assign(target, firstSource) {
                if (null == target) throw TypeError('Cannot convert first argument to object');
                for(var to = Object(target), i = 1; i < arguments.length; i++){
                    var nextSource = arguments[i];
                    if (null != nextSource) for(var keysArray = Object.keys(Object(nextSource)), nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++){
                        var nextKey = keysArray[nextIndex], desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                        void 0 !== desc && desc.enumerable && (to[nextKey] = nextSource[nextKey]);
                    }
                }
                return to;
            }
            var toStr$2 = Object.prototype.toString, isArguments = function(value) {
                var str = toStr$2.call(value), isArgs = '[object Arguments]' === str;
                return isArgs || (isArgs = '[object Array]' !== str && null !== value && 'object' == typeof value && 'number' == typeof value.length && value.length >= 0 && '[object Function]' === toStr$2.call(value.callee)), isArgs;
            };
            if (!Object.keys) {
                var has = Object.prototype.hasOwnProperty, toStr$1 = Object.prototype.toString, isEnumerable = Object.prototype.propertyIsEnumerable, hasDontEnumBug = !isEnumerable.call({
                    toString: null
                }, 'toString'), hasProtoEnumBug = isEnumerable.call(function() {}, 'prototype'), dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ], equalsConstructorPrototype = function(o) {
                    var ctor = o.constructor;
                    return ctor && ctor.prototype === o;
                }, excludedKeys = {
                    $applicationCache: !0,
                    $console: !0,
                    $external: !0,
                    $frame: !0,
                    $frameElement: !0,
                    $frames: !0,
                    $innerHeight: !0,
                    $innerWidth: !0,
                    $onmozfullscreenchange: !0,
                    $onmozfullscreenerror: !0,
                    $outerHeight: !0,
                    $outerWidth: !0,
                    $pageXOffset: !0,
                    $pageYOffset: !0,
                    $parent: !0,
                    $scrollLeft: !0,
                    $scrollTop: !0,
                    $scrollX: !0,
                    $scrollY: !0,
                    $self: !0,
                    $webkitIndexedDB: !0,
                    $webkitStorageInfo: !0,
                    $window: !0
                }, hasAutomationEqualityBug = function() {
                    if ('undefined' == typeof window) return !1;
                    for(var k in window)try {
                        if (!excludedKeys['$' + k] && has.call(window, k) && null !== window[k] && 'object' == typeof window[k]) try {
                            equalsConstructorPrototype(window[k]);
                        } catch (e) {
                            return !0;
                        }
                    } catch (e1) {
                        return !0;
                    }
                    return !1;
                }(), equalsConstructorPrototypeIfNotBuggy = function(o) {
                    if ('undefined' == typeof window || !hasAutomationEqualityBug) return equalsConstructorPrototype(o);
                    try {
                        return equalsConstructorPrototype(o);
                    } catch (e) {
                        return !1;
                    }
                };
                keysShim$1 = function(object) {
                    var isObject = null !== object && 'object' == typeof object, isFunction = '[object Function]' === toStr$1.call(object), isArguments1 = isArguments(object), isString = isObject && '[object String]' === toStr$1.call(object), theKeys = [];
                    if (!isObject && !isFunction && !isArguments1) throw TypeError('Object.keys called on a non-object');
                    var skipProto = hasProtoEnumBug && isFunction;
                    if (isString && object.length > 0 && !has.call(object, 0)) for(var i = 0; i < object.length; ++i)theKeys.push(String(i));
                    if (isArguments1 && object.length > 0) for(var j = 0; j < object.length; ++j)theKeys.push(String(j));
                    else for(var name in object)!(skipProto && 'prototype' === name) && has.call(object, name) && theKeys.push(String(name));
                    if (hasDontEnumBug) for(var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object), k = 0; k < dontEnums.length; ++k)!(skipConstructor && 'constructor' === dontEnums[k]) && has.call(object, dontEnums[k]) && theKeys.push(dontEnums[k]);
                    return theKeys;
                };
            }
            var implementation$6 = keysShim$1, slice = Array.prototype.slice, origKeys = Object.keys, keysShim = origKeys ? function(o) {
                return origKeys(o);
            } : implementation$6, originalKeys = Object.keys;
            keysShim.shim = function() {
                return Object.keys ? !function() {
                    var args = Object.keys(arguments);
                    return args && args.length === arguments.length;
                }(1, 2) && (Object.keys = function(object) {
                    return isArguments(object) ? originalKeys(slice.call(object)) : originalKeys(object);
                }) : Object.keys = keysShim, Object.keys || keysShim;
            };
            var hasSymbols = 'function' == typeof Symbol && 'symbol' == typeof Symbol('foo'), toStr = Object.prototype.toString, concat = Array.prototype.concat, origDefineProperty = Object.defineProperty, supportsDescriptors = origDefineProperty && function() {
                var obj = {};
                try {
                    for(var _ in origDefineProperty(obj, 'x', {
                        enumerable: !1,
                        value: obj
                    }), obj)return !1;
                    return obj.x === obj;
                } catch (e) {
                    return !1;
                }
            }(), defineProperty = function(object, name, value, predicate) {
                (!(name in object) || function(fn) {
                    return 'function' == typeof fn && '[object Function]' === toStr.call(fn);
                }(predicate) && predicate()) && (supportsDescriptors ? origDefineProperty(object, name, {
                    configurable: !0,
                    enumerable: !1,
                    value: value,
                    writable: !0
                }) : object[name] = value);
            }, defineProperties = function(object, map) {
                var predicates = arguments.length > 2 ? arguments[2] : {}, props = keysShim(map);
                hasSymbols && (props = concat.call(props, Object.getOwnPropertySymbols(map)));
                for(var i = 0; i < props.length; i += 1)defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
            };
            defineProperties.supportsDescriptors = !!supportsDescriptors;
            var defineProperties_1 = defineProperties, numberIsNaN$1 = function(value) {
                return value != value;
            }, implementation$5 = function(a, b) {
                return 0 === a && 0 === b ? 1 / a == 1 / b : !!(a === b || numberIsNaN$1(a) && numberIsNaN$1(b));
            }, polyfill$3 = function() {
                return 'function' == typeof Object.is ? Object.is : implementation$5;
            }, shim$3 = function() {
                var polyfill = polyfill$3();
                return defineProperties_1(Object, {
                    is: polyfill
                }, {
                    is: function() {
                        return Object.is !== polyfill;
                    }
                }), polyfill;
            }, callBind$1 = callBind$3.exports, getPolyfill$2 = polyfill$3, polyfill$2 = callBind$1(getPolyfill$2(), Object);
            defineProperties_1(polyfill$2, {
                getPolyfill: getPolyfill$2,
                implementation: implementation$5,
                shim: shim$3
            });
            var objectIs$2 = polyfill$2, implementation$2 = function(value) {
                return value != value;
            }, polyfill$1 = function() {
                return Number.isNaN && Number.isNaN(NaN) && !Number.isNaN('a') ? Number.isNaN : implementation$2;
            }, shim$1 = function() {
                var polyfill = polyfill$1();
                return defineProperties_1(Number, {
                    isNaN: polyfill
                }, {
                    isNaN: function() {
                        return Number.isNaN !== polyfill;
                    }
                }), polyfill;
            }, callBind = callBind$3.exports, getPolyfill = polyfill$1, polyfill = callBind(getPolyfill(), Number);
            function _slicedToArray(arr, i) {
                return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
            }
            function _nonIterableRest() {
                throw TypeError("Invalid attempt to destructure non-iterable instance");
            }
            function _iterableToArrayLimit(arr, i) {
                var _arr = [], _n = !0, _d = !1, _e = void 0;
                try {
                    for(var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !i || _arr.length !== i); _n = !0);
                } catch (err) {
                    _d = !0, _e = err;
                } finally{
                    try {
                        _n || null == _i.return || _i.return();
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
                return (_typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                    return typeof obj;
                } : function(obj) {
                    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                })(obj);
            }
            defineProperties_1(polyfill, {
                getPolyfill: getPolyfill,
                implementation: implementation$2,
                shim: shim$1
            });
            var regexFlagsSupported = void 0 !== /a/g.flags, arrayFromSet = function(set) {
                var array = [];
                return set.forEach(function(value) {
                    return array.push(value);
                }), array;
            }, arrayFromMap = function(map) {
                var array = [];
                return map.forEach(function(value, key) {
                    return array.push([
                        key,
                        value
                    ]);
                }), array;
            }, objectIs$1 = Object.is ? Object.is : objectIs$2, objectGetOwnPropertySymbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols : function() {
                return [];
            }, numberIsNaN = Number.isNaN ? Number.isNaN : polyfill;
            function uncurryThis(f) {
                return f.call.bind(f);
            }
            var hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty), propertyIsEnumerable = uncurryThis(Object.prototype.propertyIsEnumerable), objectToString = uncurryThis(Object.prototype.toString), _require$types$1 = util$1.types, isAnyArrayBuffer = _require$types$1.isAnyArrayBuffer, isArrayBufferView = _require$types$1.isArrayBufferView, isDate = _require$types$1.isDate, isMap = _require$types$1.isMap, isRegExp$1 = _require$types$1.isRegExp, isSet = _require$types$1.isSet, isNativeError = _require$types$1.isNativeError, isBoxedPrimitive = _require$types$1.isBoxedPrimitive, isNumberObject = _require$types$1.isNumberObject, isStringObject = _require$types$1.isStringObject, isBooleanObject = _require$types$1.isBooleanObject, isBigIntObject = _require$types$1.isBigIntObject, isSymbolObject = _require$types$1.isSymbolObject, isFloat32Array = _require$types$1.isFloat32Array, isFloat64Array = _require$types$1.isFloat64Array;
            function isNonIndex(key) {
                if (0 === key.length || key.length > 10) return !0;
                for(var i = 0; i < key.length; i++){
                    var code = key.charCodeAt(i);
                    if (code < 48 || code > 57) return !0;
                }
                return 10 === key.length && key >= 4294967296;
            }
            function getOwnNonIndexProperties(value) {
                return Object.keys(value).filter(isNonIndex).concat(objectGetOwnPropertySymbols(value).filter(Object.prototype.propertyIsEnumerable.bind(value)));
            }
            function compare(a, b) {
                if (a === b) return 0;
                for(var x = a.length, y = b.length, i = 0, len = Math.min(x, y); i < len; ++i)if (a[i] !== b[i]) {
                    x = a[i], y = b[i];
                    break;
                }
                return x < y ? -1 : y < x ? 1 : 0;
            }
            var kNoIterator = 0, kIsArray = 1, kIsSet = 2, kIsMap = 3;
            function areSimilarRegExps(a, b) {
                return regexFlagsSupported ? a.source === b.source && a.flags === b.flags : RegExp.prototype.toString.call(a) === RegExp.prototype.toString.call(b);
            }
            function areSimilarFloatArrays(a, b) {
                if (a.byteLength !== b.byteLength) return !1;
                for(var offset = 0; offset < a.byteLength; offset++)if (a[offset] !== b[offset]) return !1;
                return !0;
            }
            function areSimilarTypedArrays(a, b) {
                return a.byteLength === b.byteLength && 0 === compare(new Uint8Array(a.buffer, a.byteOffset, a.byteLength), new Uint8Array(b.buffer, b.byteOffset, b.byteLength));
            }
            function areEqualArrayBuffers(buf1, buf2) {
                return buf1.byteLength === buf2.byteLength && 0 === compare(new Uint8Array(buf1), new Uint8Array(buf2));
            }
            function isEqualBoxedPrimitive(val1, val2) {
                return isNumberObject(val1) ? isNumberObject(val2) && objectIs$1(Number.prototype.valueOf.call(val1), Number.prototype.valueOf.call(val2)) : isStringObject(val1) ? isStringObject(val2) && String.prototype.valueOf.call(val1) === String.prototype.valueOf.call(val2) : isBooleanObject(val1) ? isBooleanObject(val2) && Boolean.prototype.valueOf.call(val1) === Boolean.prototype.valueOf.call(val2) : isBigIntObject(val1) ? isBigIntObject(val2) && BigInt.prototype.valueOf.call(val1) === BigInt.prototype.valueOf.call(val2) : isSymbolObject(val2) && Symbol.prototype.valueOf.call(val1) === Symbol.prototype.valueOf.call(val2);
            }
            function innerDeepEqual(val1, val2, strict, memos) {
                if (val1 === val2) return 0 !== val1 || !strict || objectIs$1(val1, val2);
                if (strict) {
                    if ('object' !== _typeof$1(val1)) return 'number' == typeof val1 && numberIsNaN(val1) && numberIsNaN(val2);
                    if ('object' !== _typeof$1(val2) || null === val1 || null === val2 || Object.getPrototypeOf(val1) !== Object.getPrototypeOf(val2)) return !1;
                } else {
                    if (null === val1 || 'object' !== _typeof$1(val1)) return (null === val2 || 'object' !== _typeof$1(val2)) && val1 == val2;
                    if (null === val2 || 'object' !== _typeof$1(val2)) return !1;
                }
                var val1Tag = objectToString(val1), val2Tag = objectToString(val2);
                if (val1Tag !== val2Tag) return !1;
                if (Array.isArray(val1)) {
                    if (val1.length !== val2.length) return !1;
                    var keys1 = getOwnNonIndexProperties(val1), keys2 = getOwnNonIndexProperties(val2);
                    return keys1.length === keys2.length && keyCheck(val1, val2, strict, memos, kIsArray, keys1);
                }
                if ('[object Object]' === val1Tag && (!isMap(val1) && isMap(val2) || !isSet(val1) && isSet(val2))) return !1;
                if (isDate(val1)) {
                    if (!isDate(val2) || Date.prototype.getTime.call(val1) !== Date.prototype.getTime.call(val2)) return !1;
                } else if (isRegExp$1(val1)) {
                    if (!isRegExp$1(val2) || !areSimilarRegExps(val1, val2)) return !1;
                } else if (isNativeError(val1) || val1 instanceof Error) {
                    if (val1.message !== val2.message || val1.name !== val2.name) return !1;
                } else if (isArrayBufferView(val1)) {
                    if (!strict && (isFloat32Array(val1) || isFloat64Array(val1))) {
                        if (!areSimilarFloatArrays(val1, val2)) return !1;
                    } else if (!areSimilarTypedArrays(val1, val2)) return !1;
                    var _keys = getOwnNonIndexProperties(val1), _keys2 = getOwnNonIndexProperties(val2);
                    return _keys.length === _keys2.length && keyCheck(val1, val2, strict, memos, kNoIterator, _keys);
                } else if (isSet(val1)) return !!isSet(val2) && val1.size === val2.size && keyCheck(val1, val2, strict, memos, kIsSet);
                else if (isMap(val1)) return !!isMap(val2) && val1.size === val2.size && keyCheck(val1, val2, strict, memos, kIsMap);
                else if (isAnyArrayBuffer(val1)) {
                    if (!areEqualArrayBuffers(val1, val2)) return !1;
                } else if (isBoxedPrimitive(val1) && !isEqualBoxedPrimitive(val1, val2)) return !1;
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
                    if (aKeys.length !== bKeys.length) return !1;
                }
                for(var i = 0; i < aKeys.length; i++)if (!hasOwnProperty(val2, aKeys[i])) return !1;
                if (strict && 5 === arguments.length) {
                    var symbolKeysA = objectGetOwnPropertySymbols(val1);
                    if (0 !== symbolKeysA.length) {
                        var count = 0;
                        for(i = 0; i < symbolKeysA.length; i++){
                            var key = symbolKeysA[i];
                            if (propertyIsEnumerable(val1, key)) {
                                if (!propertyIsEnumerable(val2, key)) return !1;
                                aKeys.push(key), count++;
                            } else if (propertyIsEnumerable(val2, key)) return !1;
                        }
                        var symbolKeysB = objectGetOwnPropertySymbols(val2);
                        if (symbolKeysA.length !== symbolKeysB.length && getEnumerables(val2, symbolKeysB).length !== count) return !1;
                    } else {
                        var _symbolKeysB = objectGetOwnPropertySymbols(val2);
                        if (0 !== _symbolKeysB.length && 0 !== getEnumerables(val2, _symbolKeysB).length) return !1;
                    }
                }
                if (0 === aKeys.length && (iterationType === kNoIterator || iterationType === kIsArray && 0 === val1.length || 0 === val1.size)) return !0;
                if (void 0 === memos) memos = {
                    val1: new Map(),
                    val2: new Map(),
                    position: 0
                };
                else {
                    var val2MemoA = memos.val1.get(val1);
                    if (void 0 !== val2MemoA) {
                        var val2MemoB = memos.val2.get(val2);
                        if (void 0 !== val2MemoB) return val2MemoA === val2MemoB;
                    }
                    memos.position++;
                }
                memos.val1.set(val1, memos.position), memos.val2.set(val2, memos.position);
                var areEq = objEquiv(val1, val2, strict, aKeys, memos, iterationType);
                return memos.val1.delete(val1), memos.val2.delete(val2), areEq;
            }
            function setHasEqualElement(set, val1, strict, memo) {
                for(var setValues = arrayFromSet(set), i = 0; i < setValues.length; i++){
                    var val2 = setValues[i];
                    if (innerDeepEqual(val1, val2, strict, memo)) return set.delete(val2), !0;
                }
                return !1;
            }
            function findLooseMatchingPrimitives(prim) {
                switch(_typeof$1(prim)){
                    case 'undefined':
                        return null;
                    case 'object':
                        return;
                    case 'symbol':
                        return !1;
                    case 'string':
                        prim = +prim;
                    case 'number':
                        if (numberIsNaN(prim)) return !1;
                }
                return !0;
            }
            function setMightHaveLoosePrim(a, b, prim) {
                var altValue = findLooseMatchingPrimitives(prim);
                return null != altValue ? altValue : b.has(altValue) && !a.has(altValue);
            }
            function mapMightHaveLoosePrim(a, b, prim, item, memo) {
                var altValue = findLooseMatchingPrimitives(prim);
                if (null != altValue) return altValue;
                var curB = b.get(altValue);
                return !!((void 0 !== curB || b.has(altValue)) && innerDeepEqual(item, curB, !1, memo)) && !a.has(altValue) && innerDeepEqual(item, curB, !1, memo);
            }
            function setEquiv(a, b, strict, memo) {
                for(var set = null, aValues = arrayFromSet(a), i = 0; i < aValues.length; i++){
                    var val = aValues[i];
                    if ('object' === _typeof$1(val) && null !== val) null === set && (set = new Set()), set.add(val);
                    else if (!b.has(val)) {
                        if (strict || !setMightHaveLoosePrim(a, b, val)) return !1;
                        null === set && (set = new Set()), set.add(val);
                    }
                }
                if (null !== set) {
                    for(var bValues = arrayFromSet(b), _i = 0; _i < bValues.length; _i++){
                        var _val = bValues[_i];
                        if ('object' === _typeof$1(_val) && null !== _val) {
                            if (!setHasEqualElement(set, _val, strict, memo)) return !1;
                        } else if (!strict && !a.has(_val) && !setHasEqualElement(set, _val, strict, memo)) return !1;
                    }
                    return 0 === set.size;
                }
                return !0;
            }
            function mapHasEqualEntry(set, map, key1, item1, strict, memo) {
                for(var setValues = arrayFromSet(set), i = 0; i < setValues.length; i++){
                    var key2 = setValues[i];
                    if (innerDeepEqual(key1, key2, strict, memo) && innerDeepEqual(item1, map.get(key2), strict, memo)) return set.delete(key2), !0;
                }
                return !1;
            }
            function mapEquiv(a, b, strict, memo) {
                for(var set = null, aEntries = arrayFromMap(a), i = 0; i < aEntries.length; i++){
                    var _aEntries$i = _slicedToArray(aEntries[i], 2), key = _aEntries$i[0], item1 = _aEntries$i[1];
                    if ('object' === _typeof$1(key) && null !== key) null === set && (set = new Set()), set.add(key);
                    else {
                        var item2 = b.get(key);
                        if (void 0 === item2 && !b.has(key) || !innerDeepEqual(item1, item2, strict, memo)) {
                            if (strict || !mapMightHaveLoosePrim(a, b, key, item1, memo)) return !1;
                            null === set && (set = new Set()), set.add(key);
                        }
                    }
                }
                if (null !== set) {
                    for(var bEntries = arrayFromMap(b), _i2 = 0; _i2 < bEntries.length; _i2++){
                        var _bEntries$_i = _slicedToArray(bEntries[_i2], 2), key = _bEntries$_i[0], item = _bEntries$_i[1];
                        if ('object' === _typeof$1(key) && null !== key) {
                            if (!mapHasEqualEntry(set, a, key, item, strict, memo)) return !1;
                        } else if (!strict && (!a.has(key) || !innerDeepEqual(a.get(key), item, !1, memo)) && !mapHasEqualEntry(set, a, key, item, !1, memo)) return !1;
                    }
                    return 0 === set.size;
                }
                return !0;
            }
            function objEquiv(a, b, strict, keys, memos, iterationType) {
                var i = 0;
                if (iterationType === kIsSet) {
                    if (!setEquiv(a, b, strict, memos)) return !1;
                } else if (iterationType === kIsMap) {
                    if (!mapEquiv(a, b, strict, memos)) return !1;
                } else if (iterationType === kIsArray) for(; i < a.length; i++)if (hasOwnProperty(a, i)) {
                    if (!hasOwnProperty(b, i) || !innerDeepEqual(a[i], b[i], strict, memos)) return !1;
                } else {
                    if (hasOwnProperty(b, i)) return !1;
                    for(var keysA = Object.keys(a); i < keysA.length; i++){
                        var key = keysA[i];
                        if (!hasOwnProperty(b, key) || !innerDeepEqual(a[key], b[key], strict, memos)) return !1;
                    }
                    if (keysA.length !== Object.keys(b).length) return !1;
                    return !0;
                }
                for(i = 0; i < keys.length; i++){
                    var _key = keys[i];
                    if (!innerDeepEqual(a[_key], b[_key], strict, memos)) return !1;
                }
                return !0;
            }
            function isDeepEqual$1(val1, val2) {
                return innerDeepEqual(val1, val2, !1);
            }
            function isDeepStrictEqual$1(val1, val2) {
                return innerDeepEqual(val1, val2, !0);
            }
            var comparisons = {
                isDeepEqual: isDeepEqual$1,
                isDeepStrictEqual: isDeepStrictEqual$1
            };
            function _typeof(obj) {
                return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                    return typeof obj;
                } : function(obj) {
                    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                })(obj);
            }
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) throw TypeError("Cannot call a class as a function");
            }
            var _require$codes = errors.codes, ERR_AMBIGUOUS_ARGUMENT = _require$codes.ERR_AMBIGUOUS_ARGUMENT, ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE, ERR_INVALID_ARG_VALUE = _require$codes.ERR_INVALID_ARG_VALUE, ERR_INVALID_RETURN_VALUE = _require$codes.ERR_INVALID_RETURN_VALUE, ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS, AssertionError = AssertionError$1, inspect = util$1.inspect, _require$types = util$1.types, isPromise = _require$types.isPromise, isRegExp = _require$types.isRegExp, objectAssign = Object.assign ? Object.assign : assign, objectIs = Object.is ? Object.is : objectIs$2;
            function lazyLoadComparison() {
                var comparison = comparisons;
                isDeepEqual = comparison.isDeepEqual, isDeepStrictEqual = comparison.isDeepStrictEqual;
            }
            var warned = !1, assert = assert$2.exports = ok, NO_EXCEPTION_SENTINEL = {};
            function innerFail(obj) {
                if (obj.message instanceof Error) throw obj.message;
                throw new AssertionError(obj);
            }
            function fail(actual, expected, message, operator, stackStartFn) {
                var internalMessage, argsLen = arguments.length;
                if (0 === argsLen ? internalMessage = 'Failed' : 1 === argsLen ? (message = actual, actual = void 0) : (!1 === warned && (warned = !0, console.warn.bind(console)("assert.fail() with more than one argument is deprecated. Please use assert.strictEqual() instead or only pass a message.", 'DeprecationWarning', 'DEP0094')), 2 === argsLen && (operator = '!=')), message instanceof Error) throw message;
                var errArgs = {
                    actual: actual,
                    expected: expected,
                    operator: void 0 === operator ? 'fail' : operator,
                    stackStartFn: stackStartFn || fail
                };
                void 0 !== message && (errArgs.message = message);
                var err = new AssertionError(errArgs);
                throw internalMessage && (err.message = internalMessage, err.generatedMessage = !0), err;
            }
            function innerOk(fn, argLen, value, message) {
                if (!value) {
                    var generatedMessage = !1;
                    if (0 === argLen) generatedMessage = !0, message = 'No value argument passed to `assert.ok()`';
                    else if (message instanceof Error) throw message;
                    var err = new AssertionError({
                        actual: value,
                        expected: !0,
                        message: message,
                        operator: '==',
                        stackStartFn: fn
                    });
                    throw err.generatedMessage = generatedMessage, err;
                }
            }
            function ok() {
                for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
                innerOk.apply(void 0, [
                    ok,
                    args.length
                ].concat(args));
            }
            function notDeepStrictEqual(actual, expected, message) {
                if (arguments.length < 2) throw new ERR_MISSING_ARGS('actual', 'expected');
                void 0 === isDeepEqual && lazyLoadComparison(), isDeepStrictEqual(actual, expected) && innerFail({
                    actual: actual,
                    expected: expected,
                    message: message,
                    operator: 'notDeepStrictEqual',
                    stackStartFn: notDeepStrictEqual
                });
            }
            assert.fail = fail, assert.AssertionError = AssertionError, assert.ok = ok, assert.equal = function equal(actual, expected, message) {
                if (arguments.length < 2) throw new ERR_MISSING_ARGS('actual', 'expected');
                actual != expected && innerFail({
                    actual: actual,
                    expected: expected,
                    message: message,
                    operator: '==',
                    stackStartFn: equal
                });
            }, assert.notEqual = function notEqual(actual, expected, message) {
                if (arguments.length < 2) throw new ERR_MISSING_ARGS('actual', 'expected');
                actual == expected && innerFail({
                    actual: actual,
                    expected: expected,
                    message: message,
                    operator: '!=',
                    stackStartFn: notEqual
                });
            }, assert.deepEqual = function deepEqual(actual, expected, message) {
                if (arguments.length < 2) throw new ERR_MISSING_ARGS('actual', 'expected');
                void 0 === isDeepEqual && lazyLoadComparison(), isDeepEqual(actual, expected) || innerFail({
                    actual: actual,
                    expected: expected,
                    message: message,
                    operator: 'deepEqual',
                    stackStartFn: deepEqual
                });
            }, assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
                if (arguments.length < 2) throw new ERR_MISSING_ARGS('actual', 'expected');
                void 0 === isDeepEqual && lazyLoadComparison(), isDeepEqual(actual, expected) && innerFail({
                    actual: actual,
                    expected: expected,
                    message: message,
                    operator: 'notDeepEqual',
                    stackStartFn: notDeepEqual
                });
            }, assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
                if (arguments.length < 2) throw new ERR_MISSING_ARGS('actual', 'expected');
                void 0 === isDeepEqual && lazyLoadComparison(), isDeepStrictEqual(actual, expected) || innerFail({
                    actual: actual,
                    expected: expected,
                    message: message,
                    operator: 'deepStrictEqual',
                    stackStartFn: deepStrictEqual
                });
            }, assert.notDeepStrictEqual = notDeepStrictEqual, assert.strictEqual = function strictEqual(actual, expected, message) {
                if (arguments.length < 2) throw new ERR_MISSING_ARGS('actual', 'expected');
                objectIs(actual, expected) || innerFail({
                    actual: actual,
                    expected: expected,
                    message: message,
                    operator: 'strictEqual',
                    stackStartFn: strictEqual
                });
            }, assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
                if (arguments.length < 2) throw new ERR_MISSING_ARGS('actual', 'expected');
                objectIs(actual, expected) && innerFail({
                    actual: actual,
                    expected: expected,
                    message: message,
                    operator: 'notStrictEqual',
                    stackStartFn: notStrictEqual
                });
            };
            var Comparison = function Comparison(obj, keys, actual) {
                var _this = this;
                _classCallCheck(this, Comparison), keys.forEach(function(key) {
                    key in obj && (void 0 !== actual && 'string' == typeof actual[key] && isRegExp(obj[key]) && obj[key].test(actual[key]) ? _this[key] = actual[key] : _this[key] = obj[key]);
                });
            };
            function compareExceptionKey(actual, expected, key, message, keys, fn) {
                if (!(key in actual) || !isDeepStrictEqual(actual[key], expected[key])) {
                    if (!message) {
                        var a = new Comparison(actual, keys), b = new Comparison(expected, keys, actual), err = new AssertionError({
                            actual: a,
                            expected: b,
                            operator: 'deepStrictEqual',
                            stackStartFn: fn
                        });
                        throw err.actual = actual, err.expected = expected, err.operator = fn.name, err;
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
                    if (2 === arguments.length) throw new ERR_INVALID_ARG_TYPE('expected', [
                        'Function',
                        'RegExp'
                    ], expected);
                    if ('object' !== _typeof(actual) || null === actual) {
                        var err = new AssertionError({
                            actual: actual,
                            expected: expected,
                            message: msg,
                            operator: 'deepStrictEqual',
                            stackStartFn: fn
                        });
                        throw err.operator = fn.name, err;
                    }
                    var keys = Object.keys(expected);
                    if (expected instanceof Error) keys.push('name', 'message');
                    else if (0 === keys.length) throw new ERR_INVALID_ARG_VALUE('error', expected, 'may not be an empty object');
                    return void 0 === isDeepEqual && lazyLoadComparison(), keys.forEach(function(key) {
                        'string' == typeof actual[key] && isRegExp(expected[key]) && expected[key].test(actual[key]) || compareExceptionKey(actual, expected, key, msg, keys, fn);
                    }), !0;
                }
                return void 0 !== expected.prototype && actual instanceof expected || !Error.isPrototypeOf(expected) && !0 === expected.call({}, actual);
            }
            function getActual(fn) {
                if ('function' != typeof fn) throw new ERR_INVALID_ARG_TYPE('fn', 'Function', fn);
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
                        if (!checkIsPromise(resultPromise = promiseFn())) throw new ERR_INVALID_RETURN_VALUE('instance of Promise', 'promiseFn', resultPromise);
                    } else if (checkIsPromise(promiseFn)) resultPromise = promiseFn;
                    else throw new ERR_INVALID_ARG_TYPE('promiseFn', [
                        'Function',
                        'Promise'
                    ], promiseFn);
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
                    if (4 === arguments.length) throw new ERR_INVALID_ARG_TYPE('error', [
                        'Object',
                        'Error',
                        'Function',
                        'RegExp'
                    ], error);
                    if ('object' === _typeof(actual) && null !== actual) {
                        if (actual.message === error) throw new ERR_AMBIGUOUS_ARGUMENT('error/message', "The error message \"".concat(actual.message, "\" is identical to the message."));
                    } else if (actual === error) throw new ERR_AMBIGUOUS_ARGUMENT('error/message', "The error \"".concat(actual, "\" is identical to the message."));
                    message = error, error = void 0;
                } else if (null != error && 'object' !== _typeof(error) && 'function' != typeof error) throw new ERR_INVALID_ARG_TYPE('error', [
                    'Object',
                    'Error',
                    'Function',
                    'RegExp'
                ], error);
                if (actual === NO_EXCEPTION_SENTINEL) {
                    var details = '';
                    error && error.name && (details += " (".concat(error.name, ")")), details += message ? ": ".concat(message) : '.';
                    var fnType = 'rejects' === stackStartFn.name ? 'rejection' : 'exception';
                    innerFail({
                        actual: void 0,
                        expected: error,
                        operator: stackStartFn.name,
                        message: "Missing expected ".concat(fnType).concat(details),
                        stackStartFn: stackStartFn
                    });
                }
                if (error && !expectedException(actual, error, message, stackStartFn)) throw actual;
            }
            function expectsNoError(stackStartFn, actual, error, message) {
                if (actual !== NO_EXCEPTION_SENTINEL) {
                    if ('string' == typeof error && (message = error, error = void 0), !error || expectedException(actual, error)) {
                        var details = message ? ": ".concat(message) : '.', fnType = 'doesNotReject' === stackStartFn.name ? 'rejection' : 'exception';
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
            }
            function strict() {
                for(var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++)args[_key6] = arguments[_key6];
                innerOk.apply(void 0, [
                    strict,
                    args.length
                ].concat(args));
            }
            function ZStream() {
                this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = '', this.state = null, this.data_type = 2, this.adler = 0;
            }
            assert.throws = function throws(promiseFn) {
                for(var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++)args[_key2 - 1] = arguments[_key2];
                expectsError.apply(void 0, [
                    throws,
                    getActual(promiseFn)
                ].concat(args));
            }, assert.rejects = function rejects(promiseFn) {
                for(var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++)args[_key3 - 1] = arguments[_key3];
                return waitForActual(promiseFn).then(function(result) {
                    return expectsError.apply(void 0, [
                        rejects,
                        result
                    ].concat(args));
                });
            }, assert.doesNotThrow = function doesNotThrow(fn) {
                for(var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++)args[_key4 - 1] = arguments[_key4];
                expectsNoError.apply(void 0, [
                    doesNotThrow,
                    getActual(fn)
                ].concat(args));
            }, assert.doesNotReject = function doesNotReject(fn) {
                for(var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++)args[_key5 - 1] = arguments[_key5];
                return waitForActual(fn).then(function(result) {
                    return expectsNoError.apply(void 0, [
                        doesNotReject,
                        result
                    ].concat(args));
                });
            }, assert.ifError = function ifError(err) {
                if (null != err) {
                    var message = 'ifError got unwanted exception: ';
                    'object' === _typeof(err) && 'string' == typeof err.message ? 0 === err.message.length && err.constructor ? message += err.constructor.name : message += err.message : message += inspect(err);
                    var newErr = new AssertionError({
                        actual: err,
                        expected: null,
                        operator: 'ifError',
                        message: message,
                        stackStartFn: ifError
                    }), origStack = err.stack;
                    if ('string' == typeof origStack) {
                        var tmp2 = origStack.split('\n');
                        tmp2.shift();
                        for(var tmp1 = newErr.stack.split('\n'), i = 0; i < tmp2.length; i++){
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
            }, assert.strict = objectAssign(strict, assert, {
                equal: assert.strictEqual,
                deepEqual: assert.deepStrictEqual,
                notEqual: assert.notStrictEqual,
                notDeepEqual: assert.notDeepStrictEqual
            }), assert.strict.strict = assert.strict;
            var deflate$1 = {}, common = {};
            !function(exports) {
                var TYPED_OK = 'undefined' != typeof Uint8Array && 'undefined' != typeof Uint16Array && 'undefined' != typeof Int32Array;
                function _has(obj, key) {
                    return Object.prototype.hasOwnProperty.call(obj, key);
                }
                exports.assign = function(obj) {
                    for(var sources = Array.prototype.slice.call(arguments, 1); sources.length;){
                        var source = sources.shift();
                        if (source) {
                            if ('object' != typeof source) throw TypeError(source + 'must be non-object');
                            for(var p in source)_has(source, p) && (obj[p] = source[p]);
                        }
                    }
                    return obj;
                }, exports.shrinkBuf = function(buf, size) {
                    return buf.length === size ? buf : buf.subarray ? buf.subarray(0, size) : (buf.length = size, buf);
                };
                var fnTyped = {
                    arraySet: function(dest, src, src_offs, len, dest_offs) {
                        if (src.subarray && dest.subarray) {
                            dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
                            return;
                        }
                        for(var i = 0; i < len; i++)dest[dest_offs + i] = src[src_offs + i];
                    },
                    flattenChunks: function(chunks) {
                        var i, l, len, pos, chunk, result;
                        for(i = 0, len = 0, l = chunks.length; i < l; i++)len += chunks[i].length;
                        for(i = 0, result = new Uint8Array(len), pos = 0, l = chunks.length; i < l; i++)chunk = chunks[i], result.set(chunk, pos), pos += chunk.length;
                        return result;
                    }
                }, fnUntyped = {
                    arraySet: function(dest, src, src_offs, len, dest_offs) {
                        for(var i = 0; i < len; i++)dest[dest_offs + i] = src[src_offs + i];
                    },
                    flattenChunks: function(chunks) {
                        return [].concat.apply([], chunks);
                    }
                };
                exports.setTyped = function(on) {
                    on ? (exports.Buf8 = Uint8Array, exports.Buf16 = Uint16Array, exports.Buf32 = Int32Array, exports.assign(exports, fnTyped)) : (exports.Buf8 = Array, exports.Buf16 = Array, exports.Buf32 = Array, exports.assign(exports, fnUntyped));
                }, exports.setTyped(TYPED_OK);
            }(common);
            var trees$1 = {}, Z_BINARY = 0, Z_TEXT = 1;
            function zero$1(buf) {
                for(var len = buf.length; --len >= 0;)buf[len] = 0;
            }
            var STATIC_TREES = 1, LENGTH_CODES$1 = 29, LITERALS$1 = 256, L_CODES$1 = LITERALS$1 + 1 + LENGTH_CODES$1, D_CODES$1 = 30, BL_CODES$1 = 19, HEAP_SIZE$1 = 2 * L_CODES$1 + 1, MAX_BITS$1 = 15, Buf_size = 16, END_BLOCK = 256, REP_3_6 = 16, REPZ_3_10 = 17, REPZ_11_138 = 18, extra_lbits = [
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
            ], extra_dbits = [
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
            ], extra_blbits = [
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
            ], bl_order = [
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
            ], static_ltree = Array((L_CODES$1 + 2) * 2);
            zero$1(static_ltree);
            var static_dtree = Array(2 * D_CODES$1);
            zero$1(static_dtree);
            var _dist_code = Array(512);
            zero$1(_dist_code);
            var _length_code = Array(256);
            zero$1(_length_code);
            var base_length = Array(LENGTH_CODES$1);
            zero$1(base_length);
            var base_dist = Array(D_CODES$1);
            function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
                this.static_tree = static_tree, this.extra_bits = extra_bits, this.extra_base = extra_base, this.elems = elems, this.max_length = max_length, this.has_stree = static_tree && static_tree.length;
            }
            function TreeDesc(dyn_tree, stat_desc) {
                this.dyn_tree = dyn_tree, this.max_code = 0, this.stat_desc = stat_desc;
            }
            function d_code(dist) {
                return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
            }
            function put_short(s, w) {
                s.pending_buf[s.pending++] = 0xff & w, s.pending_buf[s.pending++] = w >>> 8 & 0xff;
            }
            function send_bits(s, value, length) {
                s.bi_valid > Buf_size - length ? (s.bi_buf |= value << s.bi_valid & 0xffff, put_short(s, s.bi_buf), s.bi_buf = value >> Buf_size - s.bi_valid, s.bi_valid += length - Buf_size) : (s.bi_buf |= value << s.bi_valid & 0xffff, s.bi_valid += length);
            }
            function send_code(s, c, tree) {
                send_bits(s, tree[2 * c], tree[2 * c + 1]);
            }
            function bi_reverse(code, len) {
                var res = 0;
                do res |= 1 & code, code >>>= 1, res <<= 1;
                while (--len > 0)
                return res >>> 1;
            }
            function bi_flush(s) {
                16 === s.bi_valid ? (put_short(s, s.bi_buf), s.bi_buf = 0, s.bi_valid = 0) : s.bi_valid >= 8 && (s.pending_buf[s.pending++] = 0xff & s.bi_buf, s.bi_buf >>= 8, s.bi_valid -= 8);
            }
            function gen_bitlen(s, desc) {
                var h, n, m, bits, xbits, f, tree = desc.dyn_tree, max_code = desc.max_code, stree = desc.stat_desc.static_tree, has_stree = desc.stat_desc.has_stree, extra = desc.stat_desc.extra_bits, base = desc.stat_desc.extra_base, max_length = desc.stat_desc.max_length, overflow = 0;
                for(bits = 0; bits <= MAX_BITS$1; bits++)s.bl_count[bits] = 0;
                for(tree[2 * s.heap[s.heap_max] + 1] = 0, h = s.heap_max + 1; h < HEAP_SIZE$1; h++)(bits = tree[2 * tree[2 * (n = s.heap[h]) + 1] + 1] + 1) > max_length && (bits = max_length, overflow++), tree[2 * n + 1] = bits, !(n > max_code) && (s.bl_count[bits]++, xbits = 0, n >= base && (xbits = extra[n - base]), f = tree[2 * n], s.opt_len += f * (bits + xbits), has_stree && (s.static_len += f * (stree[2 * n + 1] + xbits)));
                if (0 !== overflow) {
                    do {
                        for(bits = max_length - 1; 0 === s.bl_count[bits];)bits--;
                        s.bl_count[bits]--, s.bl_count[bits + 1] += 2, s.bl_count[max_length]--, overflow -= 2;
                    }while (overflow > 0)
                    for(bits = max_length; 0 !== bits; bits--)for(n = s.bl_count[bits]; 0 !== n;)!((m = s.heap[--h]) > max_code) && (tree[2 * m + 1] !== bits && (s.opt_len += (bits - tree[2 * m + 1]) * tree[2 * m], tree[2 * m + 1] = bits), n--);
                }
            }
            function gen_codes(tree, max_code, bl_count) {
                var bits, n, next_code = Array(MAX_BITS$1 + 1), code = 0;
                for(bits = 1; bits <= MAX_BITS$1; bits++)next_code[bits] = code = code + bl_count[bits - 1] << 1;
                for(n = 0; n <= max_code; n++){
                    var len = tree[2 * n + 1];
                    0 !== len && (tree[2 * n] = bi_reverse(next_code[len]++, len));
                }
            }
            function tr_static_init() {
                var n, bits, length, code, dist, bl_count = Array(MAX_BITS$1 + 1);
                for(code = 0, length = 0; code < LENGTH_CODES$1 - 1; code++)for(n = 0, base_length[code] = length; n < 1 << extra_lbits[code]; n++)_length_code[length++] = code;
                for(_length_code[length - 1] = code, dist = 0, code = 0; code < 16; code++)for(n = 0, base_dist[code] = dist; n < 1 << extra_dbits[code]; n++)_dist_code[dist++] = code;
                for(dist >>= 7; code < D_CODES$1; code++)for(n = 0, base_dist[code] = dist << 7; n < 1 << extra_dbits[code] - 7; n++)_dist_code[256 + dist++] = code;
                for(bits = 0; bits <= MAX_BITS$1; bits++)bl_count[bits] = 0;
                for(n = 0; n <= 143;)static_ltree[2 * n + 1] = 8, n++, bl_count[8]++;
                for(; n <= 255;)static_ltree[2 * n + 1] = 9, n++, bl_count[9]++;
                for(; n <= 279;)static_ltree[2 * n + 1] = 7, n++, bl_count[7]++;
                for(; n <= 287;)static_ltree[2 * n + 1] = 8, n++, bl_count[8]++;
                for(gen_codes(static_ltree, L_CODES$1 + 1, bl_count), n = 0; n < D_CODES$1; n++)static_dtree[2 * n + 1] = 5, static_dtree[2 * n] = bi_reverse(n, 5);
                static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS$1 + 1, L_CODES$1, MAX_BITS$1), static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES$1, MAX_BITS$1), static_bl_desc = new StaticTreeDesc([], extra_blbits, 0, BL_CODES$1, 7);
            }
            function init_block(s) {
                var n;
                for(n = 0; n < L_CODES$1; n++)s.dyn_ltree[2 * n] = 0;
                for(n = 0; n < D_CODES$1; n++)s.dyn_dtree[2 * n] = 0;
                for(n = 0; n < BL_CODES$1; n++)s.bl_tree[2 * n] = 0;
                s.dyn_ltree[2 * END_BLOCK] = 1, s.opt_len = s.static_len = 0, s.last_lit = s.matches = 0;
            }
            function bi_windup(s) {
                s.bi_valid > 8 ? put_short(s, s.bi_buf) : s.bi_valid > 0 && (s.pending_buf[s.pending++] = s.bi_buf), s.bi_buf = 0, s.bi_valid = 0;
            }
            function copy_block(s, buf, len, header) {
                bi_windup(s), header && (put_short(s, len), put_short(s, ~len)), common.arraySet(s.pending_buf, s.window, buf, len, s.pending), s.pending += len;
            }
            function smaller(tree, n, m, depth) {
                var _n2 = 2 * n, _m2 = 2 * m;
                return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
            }
            function pqdownheap(s, tree, k) {
                for(var v = s.heap[k], j = k << 1; j <= s.heap_len && (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth) && j++, !smaller(tree, v, s.heap[j], s.depth));)s.heap[k] = s.heap[j], k = j, j <<= 1;
                s.heap[k] = v;
            }
            function compress_block(s, ltree, dtree) {
                var dist, lc, code, extra, lx = 0;
                if (0 !== s.last_lit) do dist = s.pending_buf[s.d_buf + 2 * lx] << 8 | s.pending_buf[s.d_buf + 2 * lx + 1], lc = s.pending_buf[s.l_buf + lx], lx++, 0 === dist ? send_code(s, lc, ltree) : (send_code(s, (code = _length_code[lc]) + LITERALS$1 + 1, ltree), 0 !== (extra = extra_lbits[code]) && send_bits(s, lc -= base_length[code], extra), send_code(s, code = d_code(--dist), dtree), 0 !== (extra = extra_dbits[code]) && send_bits(s, dist -= base_dist[code], extra));
                while (lx < s.last_lit)
                send_code(s, END_BLOCK, ltree);
            }
            function build_tree(s, desc) {
                var n, m, node, tree = desc.dyn_tree, stree = desc.stat_desc.static_tree, has_stree = desc.stat_desc.has_stree, elems = desc.stat_desc.elems, max_code = -1;
                for(n = 0, s.heap_len = 0, s.heap_max = HEAP_SIZE$1; n < elems; n++)0 !== tree[2 * n] ? (s.heap[++s.heap_len] = max_code = n, s.depth[n] = 0) : tree[2 * n + 1] = 0;
                for(; s.heap_len < 2;)tree[2 * (node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0)] = 1, s.depth[node] = 0, s.opt_len--, has_stree && (s.static_len -= stree[2 * node + 1]);
                for(desc.max_code = max_code, n = s.heap_len >> 1; n >= 1; n--)pqdownheap(s, tree, n);
                node = elems;
                do n = s.heap[1], s.heap[1] = s.heap[s.heap_len--], pqdownheap(s, tree, 1), m = s.heap[1], s.heap[--s.heap_max] = n, s.heap[--s.heap_max] = m, tree[2 * node] = tree[2 * n] + tree[2 * m], s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1, tree[2 * n + 1] = tree[2 * m + 1] = node, s.heap[1] = node++, pqdownheap(s, tree, 1);
                while (s.heap_len >= 2)
                s.heap[--s.heap_max] = s.heap[1], gen_bitlen(s, desc), gen_codes(tree, max_code, s.bl_count);
            }
            function scan_tree(s, tree, max_code) {
                var n, curlen, prevlen = -1, nextlen = tree[1], count = 0, max_count = 7, min_count = 4;
                for(0 === nextlen && (max_count = 138, min_count = 3), tree[(max_code + 1) * 2 + 1] = 0xffff, n = 0; n <= max_code; n++)curlen = nextlen, nextlen = tree[(n + 1) * 2 + 1], ++count < max_count && curlen === nextlen || (count < min_count ? s.bl_tree[2 * curlen] += count : 0 !== curlen ? (curlen !== prevlen && s.bl_tree[2 * curlen]++, s.bl_tree[2 * REP_3_6]++) : count <= 10 ? s.bl_tree[2 * REPZ_3_10]++ : s.bl_tree[2 * REPZ_11_138]++, count = 0, prevlen = curlen, 0 === nextlen ? (max_count = 138, min_count = 3) : curlen === nextlen ? (max_count = 6, min_count = 3) : (max_count = 7, min_count = 4));
            }
            function send_tree(s, tree, max_code) {
                var n, curlen, prevlen = -1, nextlen = tree[1], count = 0, max_count = 7, min_count = 4;
                for(0 === nextlen && (max_count = 138, min_count = 3), n = 0; n <= max_code; n++)if (curlen = nextlen, nextlen = tree[(n + 1) * 2 + 1], !(++count < max_count) || curlen !== nextlen) {
                    if (count < min_count) do send_code(s, curlen, s.bl_tree);
                    while (0 != --count)
                    else 0 !== curlen ? (curlen !== prevlen && (send_code(s, curlen, s.bl_tree), count--), send_code(s, REP_3_6, s.bl_tree), send_bits(s, count - 3, 2)) : count <= 10 ? (send_code(s, REPZ_3_10, s.bl_tree), send_bits(s, count - 3, 3)) : (send_code(s, REPZ_11_138, s.bl_tree), send_bits(s, count - 11, 7));
                    count = 0, prevlen = curlen, 0 === nextlen ? (max_count = 138, min_count = 3) : curlen === nextlen ? (max_count = 6, min_count = 3) : (max_count = 7, min_count = 4);
                }
            }
            function build_bl_tree(s) {
                var max_blindex;
                for(scan_tree(s, s.dyn_ltree, s.l_desc.max_code), scan_tree(s, s.dyn_dtree, s.d_desc.max_code), build_tree(s, s.bl_desc), max_blindex = BL_CODES$1 - 1; max_blindex >= 3 && 0 === s.bl_tree[2 * bl_order[max_blindex] + 1]; max_blindex--);
                return s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4, max_blindex;
            }
            function send_all_trees(s, lcodes, dcodes, blcodes) {
                var rank;
                for(send_bits(s, lcodes - 257, 5), send_bits(s, dcodes - 1, 5), send_bits(s, blcodes - 4, 4), rank = 0; rank < blcodes; rank++)send_bits(s, s.bl_tree[2 * bl_order[rank] + 1], 3);
                send_tree(s, s.dyn_ltree, lcodes - 1), send_tree(s, s.dyn_dtree, dcodes - 1);
            }
            function detect_data_type(s) {
                var n, black_mask = 0xf3ffc07f;
                for(n = 0; n <= 31; n++, black_mask >>>= 1)if (1 & black_mask && 0 !== s.dyn_ltree[2 * n]) return Z_BINARY;
                if (0 !== s.dyn_ltree[18] || 0 !== s.dyn_ltree[20] || 0 !== s.dyn_ltree[26]) return Z_TEXT;
                for(n = 32; n < LITERALS$1; n++)if (0 !== s.dyn_ltree[2 * n]) return Z_TEXT;
                return Z_BINARY;
            }
            zero$1(base_dist);
            var static_init_done = !1;
            function _tr_init(s) {
                static_init_done || (tr_static_init(), static_init_done = !0), s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc), s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc), s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc), s.bi_buf = 0, s.bi_valid = 0, init_block(s);
            }
            function _tr_stored_block(s, buf, stored_len, last) {
                send_bits(s, 0 + (last ? 1 : 0), 3), copy_block(s, buf, stored_len, !0);
            }
            function _tr_align(s) {
                send_bits(s, STATIC_TREES << 1, 3), send_code(s, END_BLOCK, static_ltree), bi_flush(s);
            }
            function _tr_flush_block(s, buf, stored_len, last) {
                var opt_lenb, static_lenb, max_blindex = 0;
                s.level > 0 ? (2 === s.strm.data_type && (s.strm.data_type = detect_data_type(s)), build_tree(s, s.l_desc), build_tree(s, s.d_desc), max_blindex = build_bl_tree(s), opt_lenb = s.opt_len + 3 + 7 >>> 3, (static_lenb = s.static_len + 3 + 7 >>> 3) <= opt_lenb && (opt_lenb = static_lenb)) : opt_lenb = static_lenb = stored_len + 5, stored_len + 4 <= opt_lenb && -1 !== buf ? _tr_stored_block(s, buf, stored_len, last) : 4 === s.strategy || static_lenb === opt_lenb ? (send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3), compress_block(s, static_ltree, static_dtree)) : (send_bits(s, 4 + (last ? 1 : 0), 3), send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1), compress_block(s, s.dyn_ltree, s.dyn_dtree)), init_block(s), last && bi_windup(s);
            }
            function _tr_tally(s, dist, lc) {
                return s.pending_buf[s.d_buf + 2 * s.last_lit] = dist >>> 8 & 0xff, s.pending_buf[s.d_buf + 2 * s.last_lit + 1] = 0xff & dist, s.pending_buf[s.l_buf + s.last_lit] = 0xff & lc, s.last_lit++, 0 === dist ? s.dyn_ltree[2 * lc]++ : (s.matches++, dist--, s.dyn_ltree[(_length_code[lc] + LITERALS$1 + 1) * 2]++, s.dyn_dtree[2 * d_code(dist)]++), s.last_lit === s.lit_bufsize - 1;
            }
            function adler32$2(adler, buf, len, pos) {
                for(var s1 = 0xffff & adler | 0, s2 = adler >>> 16 & 0xffff | 0, n = 0; 0 !== len;){
                    n = len > 2000 ? 2000 : len, len -= n;
                    do s2 = s2 + (s1 = s1 + buf[pos++] | 0) | 0;
                    while (--n)
                    s1 %= 65521, s2 %= 65521;
                }
                return s1 | s2 << 16 | 0;
            }
            trees$1._tr_init = _tr_init, trees$1._tr_stored_block = _tr_stored_block, trees$1._tr_flush_block = _tr_flush_block, trees$1._tr_tally = _tr_tally, trees$1._tr_align = _tr_align;
            var adler32_1 = adler32$2;
            function makeTable() {
                for(var c, table = [], n = 0; n < 256; n++){
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
            var crc32_1 = crc32$2, utils$2 = common, trees = trees$1, adler32$1 = adler32_1, crc32$1 = crc32_1, msg = {
                2: 'need dictionary',
                1: 'stream end',
                0: '',
                '-1': 'file error',
                '-2': 'stream error',
                '-3': 'data error',
                '-4': 'insufficient memory',
                '-5': 'buffer error',
                '-6': 'incompatible version'
            }, Z_NO_FLUSH = 0, Z_FINISH$1 = 4, Z_BLOCK$1 = 5, Z_OK$1 = 0, Z_STREAM_END$1 = 1, Z_STREAM_ERROR$1 = -2, Z_BUF_ERROR$1 = -5, Z_HUFFMAN_ONLY = 2, Z_DEFLATED$1 = 8, L_CODES = 286, HEAP_SIZE = 2 * L_CODES + 1, MIN_MATCH = 3, MAX_MATCH = 258, MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1, INIT_STATE = 42, EXTRA_STATE = 69, NAME_STATE = 73, COMMENT_STATE = 91, HCRC_STATE = 103, BUSY_STATE = 113, FINISH_STATE = 666, BS_NEED_MORE = 1, BS_BLOCK_DONE = 2, BS_FINISH_STARTED = 3, BS_FINISH_DONE = 4;
            function err(strm, errorCode) {
                return strm.msg = msg[errorCode], errorCode;
            }
            function rank(f) {
                return (f << 1) - (f > 4 ? 9 : 0);
            }
            function zero(buf) {
                for(var len = buf.length; --len >= 0;)buf[len] = 0;
            }
            function flush_pending(strm) {
                var s = strm.state, len = s.pending;
                len > strm.avail_out && (len = strm.avail_out), 0 !== len && (utils$2.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out), strm.next_out += len, s.pending_out += len, strm.total_out += len, strm.avail_out -= len, s.pending -= len, 0 === s.pending && (s.pending_out = 0));
            }
            function flush_block_only(s, last) {
                trees._tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last), s.block_start = s.strstart, flush_pending(s.strm);
            }
            function put_byte(s, b) {
                s.pending_buf[s.pending++] = b;
            }
            function putShortMSB(s, b) {
                s.pending_buf[s.pending++] = b >>> 8 & 0xff, s.pending_buf[s.pending++] = 0xff & b;
            }
            function read_buf(strm, buf, start, size) {
                var len = strm.avail_in;
                return (len > size && (len = size), 0 === len) ? 0 : (strm.avail_in -= len, utils$2.arraySet(buf, strm.input, strm.next_in, len, start), 1 === strm.state.wrap ? strm.adler = adler32$1(strm.adler, buf, len, start) : 2 === strm.state.wrap && (strm.adler = crc32$1(strm.adler, buf, len, start)), strm.next_in += len, strm.total_in += len, len);
            }
            function longest_match(s, cur_match) {
                var match, len, chain_length = s.max_chain_length, scan = s.strstart, best_len = s.prev_length, nice_match = s.nice_match, limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0, _win = s.window, wmask = s.w_mask, prev = s.prev, strend = s.strstart + MAX_MATCH, scan_end1 = _win[scan + best_len - 1], scan_end = _win[scan + best_len];
                s.prev_length >= s.good_match && (chain_length >>= 2), nice_match > s.lookahead && (nice_match = s.lookahead);
                do {
                    if (_win[(match = cur_match) + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) continue;
                    scan += 2, match++;
                    do ;
                    while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend)
                    if (len = MAX_MATCH - (strend - scan), scan = strend - MAX_MATCH, len > best_len) {
                        if (s.match_start = cur_match, best_len = len, len >= nice_match) break;
                        scan_end1 = _win[scan + best_len - 1], scan_end = _win[scan + best_len];
                    }
                }while ((cur_match = prev[cur_match & wmask]) > limit && 0 != --chain_length)
                return best_len <= s.lookahead ? best_len : s.lookahead;
            }
            function fill_window(s) {
                var p, n, m, more, str, _w_size = s.w_size;
                do {
                    if (more = s.window_size - s.lookahead - s.strstart, s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
                        utils$2.arraySet(s.window, s.window, _w_size, _w_size, 0), s.match_start -= _w_size, s.strstart -= _w_size, s.block_start -= _w_size, p = n = s.hash_size;
                        do m = s.head[--p], s.head[p] = m >= _w_size ? m - _w_size : 0;
                        while (--n)
                        p = n = _w_size;
                        do m = s.prev[--p], s.prev[p] = m >= _w_size ? m - _w_size : 0;
                        while (--n)
                        more += _w_size;
                    }
                    if (0 === s.strm.avail_in) break;
                    if (n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more), s.lookahead += n, s.lookahead + s.insert >= MIN_MATCH) for(str = s.strstart - s.insert, s.ins_h = s.window[str], s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 1]) & s.hash_mask; s.insert && (s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask, s.prev[str & s.w_mask] = s.head[s.ins_h], s.head[s.ins_h] = str, str++, s.insert--, !(s.lookahead + s.insert < MIN_MATCH)););
                }while (s.lookahead < MIN_LOOKAHEAD && 0 !== s.strm.avail_in)
            }
            function deflate_stored(s, flush) {
                var max_block_size = 0xffff;
                for(max_block_size > s.pending_buf_size - 5 && (max_block_size = s.pending_buf_size - 5);;){
                    if (s.lookahead <= 1) {
                        if (fill_window(s), 0 === s.lookahead && flush === Z_NO_FLUSH) return BS_NEED_MORE;
                        if (0 === s.lookahead) break;
                    }
                    s.strstart += s.lookahead, s.lookahead = 0;
                    var max_start = s.block_start + max_block_size;
                    if ((0 === s.strstart || s.strstart >= max_start) && (s.lookahead = s.strstart - max_start, s.strstart = max_start, flush_block_only(s, !1), 0 === s.strm.avail_out) || s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD && (flush_block_only(s, !1), 0 === s.strm.avail_out)) return BS_NEED_MORE;
                }
                return (s.insert = 0, flush === Z_FINISH$1) ? (flush_block_only(s, !0), 0 === s.strm.avail_out) ? BS_FINISH_STARTED : BS_FINISH_DONE : (s.strstart > s.block_start && (flush_block_only(s, !1), s.strm.avail_out), BS_NEED_MORE);
            }
            function deflate_fast(s, flush) {
                for(var hash_head, bflush;;){
                    if (s.lookahead < MIN_LOOKAHEAD) {
                        if (fill_window(s), s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) return BS_NEED_MORE;
                        if (0 === s.lookahead) break;
                    }
                    if (hash_head = 0, s.lookahead >= MIN_MATCH && (s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask, hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h], s.head[s.ins_h] = s.strstart), 0 !== hash_head && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD && (s.match_length = longest_match(s, hash_head)), s.match_length >= MIN_MATCH) {
                        if (bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH), s.lookahead -= s.match_length, s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
                            s.match_length--;
                            do s.strstart++, s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask, hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h], s.head[s.ins_h] = s.strstart;
                            while (0 != --s.match_length)
                            s.strstart++;
                        } else s.strstart += s.match_length, s.match_length = 0, s.ins_h = s.window[s.strstart], s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask;
                    } else bflush = trees._tr_tally(s, 0, s.window[s.strstart]), s.lookahead--, s.strstart++;
                    if (bflush && (flush_block_only(s, !1), 0 === s.strm.avail_out)) return BS_NEED_MORE;
                }
                return (s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1, flush === Z_FINISH$1) ? (flush_block_only(s, !0), 0 === s.strm.avail_out) ? BS_FINISH_STARTED : BS_FINISH_DONE : s.last_lit && (flush_block_only(s, !1), 0 === s.strm.avail_out) ? BS_NEED_MORE : BS_BLOCK_DONE;
            }
            function deflate_slow(s, flush) {
                for(var hash_head, bflush, max_insert;;){
                    if (s.lookahead < MIN_LOOKAHEAD) {
                        if (fill_window(s), s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) return BS_NEED_MORE;
                        if (0 === s.lookahead) break;
                    }
                    if (hash_head = 0, s.lookahead >= MIN_MATCH && (s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask, hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h], s.head[s.ins_h] = s.strstart), s.prev_length = s.match_length, s.prev_match = s.match_start, s.match_length = MIN_MATCH - 1, 0 !== hash_head && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD && (s.match_length = longest_match(s, hash_head), s.match_length <= 5 && (1 === s.strategy || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096) && (s.match_length = MIN_MATCH - 1)), s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
                        max_insert = s.strstart + s.lookahead - MIN_MATCH, bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH), s.lookahead -= s.prev_length - 1, s.prev_length -= 2;
                        do ++s.strstart <= max_insert && (s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask, hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h], s.head[s.ins_h] = s.strstart);
                        while (0 != --s.prev_length)
                        if (s.match_available = 0, s.match_length = MIN_MATCH - 1, s.strstart++, bflush && (flush_block_only(s, !1), 0 === s.strm.avail_out)) return BS_NEED_MORE;
                    } else if (s.match_available) {
                        if ((bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1])) && flush_block_only(s, !1), s.strstart++, s.lookahead--, 0 === s.strm.avail_out) return BS_NEED_MORE;
                    } else s.match_available = 1, s.strstart++, s.lookahead--;
                }
                return (s.match_available && (bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]), s.match_available = 0), s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1, flush === Z_FINISH$1) ? (flush_block_only(s, !0), 0 === s.strm.avail_out) ? BS_FINISH_STARTED : BS_FINISH_DONE : s.last_lit && (flush_block_only(s, !1), 0 === s.strm.avail_out) ? BS_NEED_MORE : BS_BLOCK_DONE;
            }
            function deflate_rle(s, flush) {
                for(var bflush, prev, scan, strend, _win = s.window;;){
                    if (s.lookahead <= MAX_MATCH) {
                        if (fill_window(s), s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) return BS_NEED_MORE;
                        if (0 === s.lookahead) break;
                    }
                    if (s.match_length = 0, s.lookahead >= MIN_MATCH && s.strstart > 0 && (prev = _win[scan = s.strstart - 1]) === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
                        strend = s.strstart + MAX_MATCH;
                        do ;
                        while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend)
                        s.match_length = MAX_MATCH - (strend - scan), s.match_length > s.lookahead && (s.match_length = s.lookahead);
                    }
                    if (s.match_length >= MIN_MATCH ? (bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH), s.lookahead -= s.match_length, s.strstart += s.match_length, s.match_length = 0) : (bflush = trees._tr_tally(s, 0, s.window[s.strstart]), s.lookahead--, s.strstart++), bflush && (flush_block_only(s, !1), 0 === s.strm.avail_out)) return BS_NEED_MORE;
                }
                return (s.insert = 0, flush === Z_FINISH$1) ? (flush_block_only(s, !0), 0 === s.strm.avail_out) ? BS_FINISH_STARTED : BS_FINISH_DONE : s.last_lit && (flush_block_only(s, !1), 0 === s.strm.avail_out) ? BS_NEED_MORE : BS_BLOCK_DONE;
            }
            function deflate_huff(s, flush) {
                for(var bflush;;){
                    if (0 === s.lookahead && (fill_window(s), 0 === s.lookahead)) {
                        if (flush === Z_NO_FLUSH) return BS_NEED_MORE;
                        break;
                    }
                    if (s.match_length = 0, bflush = trees._tr_tally(s, 0, s.window[s.strstart]), s.lookahead--, s.strstart++, bflush && (flush_block_only(s, !1), 0 === s.strm.avail_out)) return BS_NEED_MORE;
                }
                return (s.insert = 0, flush === Z_FINISH$1) ? (flush_block_only(s, !0), 0 === s.strm.avail_out) ? BS_FINISH_STARTED : BS_FINISH_DONE : s.last_lit && (flush_block_only(s, !1), 0 === s.strm.avail_out) ? BS_NEED_MORE : BS_BLOCK_DONE;
            }
            function Config(good_length, max_lazy, nice_length, max_chain, func) {
                this.good_length = good_length, this.max_lazy = max_lazy, this.nice_length = nice_length, this.max_chain = max_chain, this.func = func;
            }
            function lm_init(s) {
                s.window_size = 2 * s.w_size, zero(s.head), s.max_lazy_match = configuration_table[s.level].max_lazy, s.good_match = configuration_table[s.level].good_length, s.nice_match = configuration_table[s.level].nice_length, s.max_chain_length = configuration_table[s.level].max_chain, s.strstart = 0, s.block_start = 0, s.lookahead = 0, s.insert = 0, s.match_length = s.prev_length = MIN_MATCH - 1, s.match_available = 0, s.ins_h = 0;
            }
            function DeflateState() {
                this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = Z_DEFLATED$1, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new utils$2.Buf16(2 * HEAP_SIZE), this.dyn_dtree = new utils$2.Buf16(122), this.bl_tree = new utils$2.Buf16(78), zero(this.dyn_ltree), zero(this.dyn_dtree), zero(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new utils$2.Buf16(16), this.heap = new utils$2.Buf16(2 * L_CODES + 1), zero(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new utils$2.Buf16(2 * L_CODES + 1), zero(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
            }
            function deflateResetKeep(strm) {
                var s;
                return strm && strm.state ? (strm.total_in = strm.total_out = 0, strm.data_type = 2, (s = strm.state).pending = 0, s.pending_out = 0, s.wrap < 0 && (s.wrap = -s.wrap), s.status = s.wrap ? INIT_STATE : BUSY_STATE, strm.adler = 2 === s.wrap ? 0 : 1, s.last_flush = Z_NO_FLUSH, trees._tr_init(s), Z_OK$1) : err(strm, Z_STREAM_ERROR$1);
            }
            function deflateReset(strm) {
                var ret = deflateResetKeep(strm);
                return ret === Z_OK$1 && lm_init(strm.state), ret;
            }
            function deflateSetHeader(strm, head) {
                return strm && strm.state && 2 === strm.state.wrap ? (strm.state.gzhead = head, Z_OK$1) : Z_STREAM_ERROR$1;
            }
            function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
                if (!strm) return Z_STREAM_ERROR$1;
                var wrap = 1;
                if (-1 === level && (level = 6), windowBits < 0 ? (wrap = 0, windowBits = -windowBits) : windowBits > 15 && (wrap = 2, windowBits -= 16), memLevel < 1 || memLevel > 9 || method !== Z_DEFLATED$1 || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > 4) return err(strm, Z_STREAM_ERROR$1);
                8 === windowBits && (windowBits = 9);
                var s = new DeflateState();
                return strm.state = s, s.strm = strm, s.wrap = wrap, s.gzhead = null, s.w_bits = windowBits, s.w_size = 1 << s.w_bits, s.w_mask = s.w_size - 1, s.hash_bits = memLevel + 7, s.hash_size = 1 << s.hash_bits, s.hash_mask = s.hash_size - 1, s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH), s.window = new utils$2.Buf8(2 * s.w_size), s.head = new utils$2.Buf16(s.hash_size), s.prev = new utils$2.Buf16(s.w_size), s.lit_bufsize = 1 << memLevel + 6, s.pending_buf_size = 4 * s.lit_bufsize, s.pending_buf = new utils$2.Buf8(s.pending_buf_size), s.d_buf = 1 * s.lit_bufsize, s.l_buf = 3 * s.lit_bufsize, s.level = level, s.strategy = strategy, s.method = method, deflateReset(strm);
            }
            function deflateInit(strm, level) {
                return deflateInit2(strm, level, Z_DEFLATED$1, 15, 8, 0);
            }
            function deflate(strm, flush) {
                if (!strm || !strm.state || flush > Z_BLOCK$1 || flush < 0) return strm ? err(strm, Z_STREAM_ERROR$1) : Z_STREAM_ERROR$1;
                if (s = strm.state, !strm.output || !strm.input && 0 !== strm.avail_in || s.status === FINISH_STATE && flush !== Z_FINISH$1) return err(strm, 0 === strm.avail_out ? Z_BUF_ERROR$1 : Z_STREAM_ERROR$1);
                if (s.strm = strm, old_flush = s.last_flush, s.last_flush = flush, s.status === INIT_STATE) {
                    if (2 === s.wrap) strm.adler = 0, put_byte(s, 31), put_byte(s, 139), put_byte(s, 8), s.gzhead ? (put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (s.gzhead.extra ? 4 : 0) + (s.gzhead.name ? 8 : 0) + (s.gzhead.comment ? 16 : 0)), put_byte(s, 0xff & s.gzhead.time), put_byte(s, s.gzhead.time >> 8 & 0xff), put_byte(s, s.gzhead.time >> 16 & 0xff), put_byte(s, s.gzhead.time >> 24 & 0xff), put_byte(s, 9 === s.level ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0), put_byte(s, 0xff & s.gzhead.os), s.gzhead.extra && s.gzhead.extra.length && (put_byte(s, 0xff & s.gzhead.extra.length), put_byte(s, s.gzhead.extra.length >> 8 & 0xff)), s.gzhead.hcrc && (strm.adler = crc32$1(strm.adler, s.pending_buf, s.pending, 0)), s.gzindex = 0, s.status = EXTRA_STATE) : (put_byte(s, 0), put_byte(s, 0), put_byte(s, 0), put_byte(s, 0), put_byte(s, 0), put_byte(s, 9 === s.level ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0), put_byte(s, 0x03), s.status = BUSY_STATE);
                    else {
                        var old_flush, s, beg, val, header = Z_DEFLATED$1 + (s.w_bits - 8 << 4) << 8;
                        header |= (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 0 : s.level < 6 ? 1 : 6 === s.level ? 2 : 3) << 6, 0 !== s.strstart && (header |= 0x20), header += 31 - header % 31, s.status = BUSY_STATE, putShortMSB(s, header), 0 !== s.strstart && (putShortMSB(s, strm.adler >>> 16), putShortMSB(s, 0xffff & strm.adler)), strm.adler = 1;
                    }
                }
                if (s.status === EXTRA_STATE) {
                    if (s.gzhead.extra) {
                        for(beg = s.pending; s.gzindex < (0xffff & s.gzhead.extra.length) && (s.pending !== s.pending_buf_size || (s.gzhead.hcrc && s.pending > beg && (strm.adler = crc32$1(strm.adler, s.pending_buf, s.pending - beg, beg)), flush_pending(strm), beg = s.pending, s.pending !== s.pending_buf_size));)put_byte(s, 0xff & s.gzhead.extra[s.gzindex]), s.gzindex++;
                        s.gzhead.hcrc && s.pending > beg && (strm.adler = crc32$1(strm.adler, s.pending_buf, s.pending - beg, beg)), s.gzindex === s.gzhead.extra.length && (s.gzindex = 0, s.status = NAME_STATE);
                    } else s.status = NAME_STATE;
                }
                if (s.status === NAME_STATE) {
                    if (s.gzhead.name) {
                        beg = s.pending;
                        do {
                            if (s.pending === s.pending_buf_size && (s.gzhead.hcrc && s.pending > beg && (strm.adler = crc32$1(strm.adler, s.pending_buf, s.pending - beg, beg)), flush_pending(strm), beg = s.pending, s.pending === s.pending_buf_size)) {
                                val = 1;
                                break;
                            }
                            val = s.gzindex < s.gzhead.name.length ? 0xff & s.gzhead.name.charCodeAt(s.gzindex++) : 0, put_byte(s, val);
                        }while (0 !== val)
                        s.gzhead.hcrc && s.pending > beg && (strm.adler = crc32$1(strm.adler, s.pending_buf, s.pending - beg, beg)), 0 === val && (s.gzindex = 0, s.status = COMMENT_STATE);
                    } else s.status = COMMENT_STATE;
                }
                if (s.status === COMMENT_STATE) {
                    if (s.gzhead.comment) {
                        beg = s.pending;
                        do {
                            if (s.pending === s.pending_buf_size && (s.gzhead.hcrc && s.pending > beg && (strm.adler = crc32$1(strm.adler, s.pending_buf, s.pending - beg, beg)), flush_pending(strm), beg = s.pending, s.pending === s.pending_buf_size)) {
                                val = 1;
                                break;
                            }
                            val = s.gzindex < s.gzhead.comment.length ? 0xff & s.gzhead.comment.charCodeAt(s.gzindex++) : 0, put_byte(s, val);
                        }while (0 !== val)
                        s.gzhead.hcrc && s.pending > beg && (strm.adler = crc32$1(strm.adler, s.pending_buf, s.pending - beg, beg)), 0 === val && (s.status = HCRC_STATE);
                    } else s.status = HCRC_STATE;
                }
                if (s.status === HCRC_STATE && (s.gzhead.hcrc ? (s.pending + 2 > s.pending_buf_size && flush_pending(strm), s.pending + 2 <= s.pending_buf_size && (put_byte(s, 0xff & strm.adler), put_byte(s, strm.adler >> 8 & 0xff), strm.adler = 0, s.status = BUSY_STATE)) : s.status = BUSY_STATE), 0 !== s.pending) {
                    if (flush_pending(strm), 0 === strm.avail_out) return s.last_flush = -1, Z_OK$1;
                } else if (0 === strm.avail_in && rank(flush) <= rank(old_flush) && flush !== Z_FINISH$1) return err(strm, Z_BUF_ERROR$1);
                if (s.status === FINISH_STATE && 0 !== strm.avail_in) return err(strm, Z_BUF_ERROR$1);
                if (0 !== strm.avail_in || 0 !== s.lookahead || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
                    var bstate = s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : 3 === s.strategy ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
                    if ((bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) && (s.status = FINISH_STATE), bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) return 0 === strm.avail_out && (s.last_flush = -1), Z_OK$1;
                    if (bstate === BS_BLOCK_DONE && (1 === flush ? trees._tr_align(s) : flush !== Z_BLOCK$1 && (trees._tr_stored_block(s, 0, 0, !1), 3 === flush && (zero(s.head), 0 === s.lookahead && (s.strstart = 0, s.block_start = 0, s.insert = 0))), flush_pending(strm), 0 === strm.avail_out)) return s.last_flush = -1, Z_OK$1;
                }
                return flush !== Z_FINISH$1 ? Z_OK$1 : s.wrap <= 0 ? Z_STREAM_END$1 : (2 === s.wrap ? (put_byte(s, 0xff & strm.adler), put_byte(s, strm.adler >> 8 & 0xff), put_byte(s, strm.adler >> 16 & 0xff), put_byte(s, strm.adler >> 24 & 0xff), put_byte(s, 0xff & strm.total_in), put_byte(s, strm.total_in >> 8 & 0xff), put_byte(s, strm.total_in >> 16 & 0xff), put_byte(s, strm.total_in >> 24 & 0xff)) : (putShortMSB(s, strm.adler >>> 16), putShortMSB(s, 0xffff & strm.adler)), flush_pending(strm), s.wrap > 0 && (s.wrap = -s.wrap), 0 !== s.pending ? Z_OK$1 : Z_STREAM_END$1);
            }
            function deflateEnd(strm) {
                var status;
                return strm && strm.state ? (status = strm.state.status) !== INIT_STATE && status !== EXTRA_STATE && status !== NAME_STATE && status !== COMMENT_STATE && status !== HCRC_STATE && status !== BUSY_STATE && status !== FINISH_STATE ? err(strm, Z_STREAM_ERROR$1) : (strm.state = null, status === BUSY_STATE ? err(strm, -3) : Z_OK$1) : Z_STREAM_ERROR$1;
            }
            function deflateSetDictionary(strm, dictionary) {
                var s, str, n, wrap, avail, next, input, tmpDict, dictLength = dictionary.length;
                if (!strm || !strm.state || 2 === (wrap = (s = strm.state).wrap) || 1 === wrap && s.status !== INIT_STATE || s.lookahead) return Z_STREAM_ERROR$1;
                for(1 === wrap && (strm.adler = adler32$1(strm.adler, dictionary, dictLength, 0)), s.wrap = 0, dictLength >= s.w_size && (0 === wrap && (zero(s.head), s.strstart = 0, s.block_start = 0, s.insert = 0), tmpDict = new utils$2.Buf8(s.w_size), utils$2.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0), dictionary = tmpDict, dictLength = s.w_size), avail = strm.avail_in, next = strm.next_in, input = strm.input, strm.avail_in = dictLength, strm.next_in = 0, strm.input = dictionary, fill_window(s); s.lookahead >= MIN_MATCH;){
                    str = s.strstart, n = s.lookahead - (MIN_MATCH - 1);
                    do s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask, s.prev[str & s.w_mask] = s.head[s.ins_h], s.head[s.ins_h] = str, str++;
                    while (--n)
                    s.strstart = str, s.lookahead = MIN_MATCH - 1, fill_window(s);
                }
                return s.strstart += s.lookahead, s.block_start = s.strstart, s.insert = s.lookahead, s.lookahead = 0, s.match_length = s.prev_length = MIN_MATCH - 1, s.match_available = 0, strm.next_in = next, strm.input = input, strm.avail_in = avail, s.wrap = wrap, Z_OK$1;
            }
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
            ], deflate$1.deflateInit = deflateInit, deflate$1.deflateInit2 = deflateInit2, deflate$1.deflateReset = deflateReset, deflate$1.deflateResetKeep = deflateResetKeep, deflate$1.deflateSetHeader = deflateSetHeader, deflate$1.deflate = deflate, deflate$1.deflateEnd = deflateEnd, deflate$1.deflateSetDictionary = deflateSetDictionary, deflate$1.deflateInfo = 'pako deflate (from Nodeca project)';
            var inflate$1 = {}, BAD$1 = 30, utils$1 = common, MAXBITS = 15, ENOUGH_LENS$1 = 852, ENOUGH_DISTS$1 = 592, CODES$1 = 0, LENS$1 = 1, DISTS$1 = 2, lbase = [
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
            ], lext = [
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
            ], dbase = [
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
            ], dext = [
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
            ], utils = common, adler32 = adler32_1, crc32 = crc32_1, inflate_fast = function(strm, start) {
                var state, _in, last, _out, beg, end, dmax, wsize, whave, wnext, s_window, hold, bits, lcode, dcode, lmask, dmask, here, op, len, dist, from, from_source, input, output;
                state = strm.state, _in = strm.next_in, input = strm.input, last = _in + (strm.avail_in - 5), _out = strm.next_out, output = strm.output, beg = _out - (start - strm.avail_out), end = _out + (strm.avail_out - 257), dmax = state.dmax, wsize = state.wsize, whave = state.whave, wnext = state.wnext, s_window = state.window, hold = state.hold, bits = state.bits, lcode = state.lencode, dcode = state.distcode, lmask = (1 << state.lenbits) - 1, dmask = (1 << state.distbits) - 1;
                top: do {
                    bits < 15 && (hold += input[_in++] << bits, bits += 8, hold += input[_in++] << bits, bits += 8), here = lcode[hold & lmask];
                    dolen: for(;;){
                        if (hold >>>= op = here >>> 24, bits -= op, 0 == (op = here >>> 16 & 0xff)) output[_out++] = 0xffff & here;
                        else if (16 & op) {
                            len = 0xffff & here, (op &= 15) && (bits < op && (hold += input[_in++] << bits, bits += 8), len += hold & (1 << op) - 1, hold >>>= op, bits -= op), bits < 15 && (hold += input[_in++] << bits, bits += 8, hold += input[_in++] << bits, bits += 8), here = dcode[hold & dmask];
                            dodist: for(;;){
                                if (hold >>>= op = here >>> 24, bits -= op, 16 & (op = here >>> 16 & 0xff)) {
                                    if (dist = 0xffff & here, bits < (op &= 15) && (hold += input[_in++] << bits, (bits += 8) < op && (hold += input[_in++] << bits, bits += 8)), (dist += hold & (1 << op) - 1) > dmax) {
                                        strm.msg = 'invalid distance too far back', state.mode = BAD$1;
                                        break top;
                                    }
                                    if (hold >>>= op, bits -= op, dist > (op = _out - beg)) {
                                        if ((op = dist - op) > whave && state.sane) {
                                            strm.msg = 'invalid distance too far back', state.mode = BAD$1;
                                            break top;
                                        }
                                        if (from = 0, from_source = s_window, 0 === wnext) {
                                            if (from += wsize - op, op < len) {
                                                len -= op;
                                                do output[_out++] = s_window[from++];
                                                while (--op)
                                                from = _out - dist, from_source = output;
                                            }
                                        } else if (wnext < op) {
                                            if (from += wsize + wnext - op, (op -= wnext) < len) {
                                                len -= op;
                                                do output[_out++] = s_window[from++];
                                                while (--op)
                                                if (from = 0, wnext < len) {
                                                    len -= op = wnext;
                                                    do output[_out++] = s_window[from++];
                                                    while (--op)
                                                    from = _out - dist, from_source = output;
                                                }
                                            }
                                        } else if (from += wnext - op, op < len) {
                                            len -= op;
                                            do output[_out++] = s_window[from++];
                                            while (--op)
                                            from = _out - dist, from_source = output;
                                        }
                                        for(; len > 2;)output[_out++] = from_source[from++], output[_out++] = from_source[from++], output[_out++] = from_source[from++], len -= 3;
                                        len && (output[_out++] = from_source[from++], len > 1 && (output[_out++] = from_source[from++]));
                                    } else {
                                        from = _out - dist;
                                        do output[_out++] = output[from++], output[_out++] = output[from++], output[_out++] = output[from++], len -= 3;
                                        while (len > 2)
                                        len && (output[_out++] = output[from++], len > 1 && (output[_out++] = output[from++]));
                                    }
                                } else if ((64 & op) == 0) {
                                    here = dcode[(0xffff & here) + (hold & (1 << op) - 1)];
                                    continue dodist;
                                } else {
                                    strm.msg = 'invalid distance code', state.mode = BAD$1;
                                    break top;
                                }
                                break;
                            }
                        } else if ((64 & op) == 0) {
                            here = lcode[(0xffff & here) + (hold & (1 << op) - 1)];
                            continue dolen;
                        } else if (32 & op) {
                            state.mode = 12;
                            break top;
                        } else {
                            strm.msg = 'invalid literal/length code', state.mode = BAD$1;
                            break top;
                        }
                        break;
                    }
                }while (_in < last && _out < end)
                _in -= len = bits >> 3, bits -= len << 3, hold &= (1 << bits) - 1, strm.next_in = _in, strm.next_out = _out, strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last), strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end), state.hold = hold, state.bits = bits;
            }, inflate_table = function(type, lens, lens_index, codes, table, table_index, work, opts) {
                var incr, fill, low, mask, next, end, here_bits, here_op, here_val, bits = opts.bits, len = 0, sym = 0, min = 0, max = 0, root = 0, curr = 0, drop = 0, left = 0, used = 0, huff = 0, base = null, base_index = 0, count = new utils$1.Buf16(MAXBITS + 1), offs = new utils$1.Buf16(MAXBITS + 1), extra = null, extra_index = 0;
                for(len = 0; len <= MAXBITS; len++)count[len] = 0;
                for(sym = 0; sym < codes; sym++)count[lens[lens_index + sym]]++;
                for(root = bits, max = MAXBITS; max >= 1 && 0 === count[max]; max--);
                if (root > max && (root = max), 0 === max) return table[table_index++] = 20971520, table[table_index++] = 20971520, opts.bits = 1, 0;
                for(min = 1; min < max && 0 === count[min]; min++);
                for(root < min && (root = min), left = 1, len = 1; len <= MAXBITS; len++)if (left <<= 1, (left -= count[len]) < 0) return -1;
                if (left > 0 && (type === CODES$1 || 1 !== max)) return -1;
                for(len = 1, offs[1] = 0; len < MAXBITS; len++)offs[len + 1] = offs[len] + count[len];
                for(sym = 0; sym < codes; sym++)0 !== lens[lens_index + sym] && (work[offs[lens[lens_index + sym]]++] = sym);
                if (type === CODES$1 ? (base = extra = work, end = 19) : type === LENS$1 ? (base = lbase, base_index -= 257, extra = lext, extra_index -= 257, end = 256) : (base = dbase, extra = dext, end = -1), huff = 0, sym = 0, len = min, next = table_index, curr = root, drop = 0, low = -1, mask = (used = 1 << root) - 1, type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) return 1;
                for(;;){
                    here_bits = len - drop, work[sym] < end ? (here_op = 0, here_val = work[sym]) : work[sym] > end ? (here_op = extra[extra_index + work[sym]], here_val = base[base_index + work[sym]]) : (here_op = 96, here_val = 0), incr = 1 << len - drop, min = fill = 1 << curr;
                    do table[next + (huff >> drop) + (fill -= incr)] = here_bits << 24 | here_op << 16 | here_val | 0;
                    while (0 !== fill)
                    for(incr = 1 << len - 1; huff & incr;)incr >>= 1;
                    if (0 !== incr ? (huff &= incr - 1, huff += incr) : huff = 0, sym++, 0 == --count[len]) {
                        if (len === max) break;
                        len = lens[lens_index + work[sym]];
                    }
                    if (len > root && (huff & mask) !== low) {
                        for(0 === drop && (drop = root), next += min, left = 1 << (curr = len - drop); curr + drop < max && !((left -= count[curr + drop]) <= 0);)curr++, left <<= 1;
                        if (used += 1 << curr, type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) return 1;
                        table[low = huff & mask] = root << 24 | curr << 16 | next - table_index | 0;
                    }
                }
                return 0 !== huff && (table[next + huff] = len - drop << 24 | 4194304), opts.bits = root, 0;
            }, LENS = 1, DISTS = 2, Z_FINISH = 4, Z_TREES = 6, Z_OK = 0, Z_STREAM_END = 1, Z_STREAM_ERROR = -2, Z_DATA_ERROR = -3, Z_MEM_ERROR = -4, Z_DEFLATED = 8, HEAD = 1, FLAGS = 2, TIME = 3, OS = 4, EXLEN = 5, EXTRA = 6, NAME = 7, COMMENT = 8, HCRC = 9, DICTID = 10, DICT = 11, TYPE = 12, TYPEDO = 13, STORED = 14, COPY_ = 15, COPY = 16, TABLE = 17, LENLENS = 18, CODELENS = 19, LEN_ = 20, LEN = 21, LENEXT = 22, DIST = 23, DISTEXT = 24, MATCH = 25, LIT = 26, CHECK = 27, LENGTH = 28, DONE = 29, BAD = 30, MEM = 31;
            function zswap32(q) {
                return (q >>> 24 & 0xff) + (q >>> 8 & 0xff00) + ((0xff00 & q) << 8) + ((0xff & q) << 24);
            }
            function InflateState() {
                this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new utils.Buf16(320), this.work = new utils.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
            }
            function inflateResetKeep(strm) {
                var state;
                return strm && strm.state ? (state = strm.state, strm.total_in = strm.total_out = state.total = 0, strm.msg = '', state.wrap && (strm.adler = 1 & state.wrap), state.mode = HEAD, state.last = 0, state.havedict = 0, state.dmax = 32768, state.head = null, state.hold = 0, state.bits = 0, state.lencode = state.lendyn = new utils.Buf32(852), state.distcode = state.distdyn = new utils.Buf32(592), state.sane = 1, state.back = -1, Z_OK) : Z_STREAM_ERROR;
            }
            function inflateReset(strm) {
                var state;
                return strm && strm.state ? ((state = strm.state).wsize = 0, state.whave = 0, state.wnext = 0, inflateResetKeep(strm)) : Z_STREAM_ERROR;
            }
            function inflateReset2(strm, windowBits) {
                var wrap, state;
                return strm && strm.state ? (state = strm.state, windowBits < 0 ? (wrap = 0, windowBits = -windowBits) : (wrap = (windowBits >> 4) + 1, windowBits < 48 && (windowBits &= 15)), windowBits && (windowBits < 8 || windowBits > 15)) ? Z_STREAM_ERROR : (null !== state.window && state.wbits !== windowBits && (state.window = null), state.wrap = wrap, state.wbits = windowBits, inflateReset(strm)) : Z_STREAM_ERROR;
            }
            function inflateInit2(strm, windowBits) {
                var ret, state;
                return strm ? (state = new InflateState(), strm.state = state, state.window = null, (ret = inflateReset2(strm, windowBits)) !== Z_OK && (strm.state = null), ret) : Z_STREAM_ERROR;
            }
            function inflateInit(strm) {
                return inflateInit2(strm, 15);
            }
            var virgin = !0;
            function fixedtables(state) {
                if (virgin) {
                    var sym;
                    for(lenfix = new utils.Buf32(512), distfix = new utils.Buf32(32), sym = 0; sym < 144;)state.lens[sym++] = 8;
                    for(; sym < 256;)state.lens[sym++] = 9;
                    for(; sym < 280;)state.lens[sym++] = 7;
                    for(; sym < 288;)state.lens[sym++] = 8;
                    for(inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, {
                        bits: 9
                    }), sym = 0; sym < 32;)state.lens[sym++] = 5;
                    inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, {
                        bits: 5
                    }), virgin = !1;
                }
                state.lencode = lenfix, state.lenbits = 9, state.distcode = distfix, state.distbits = 5;
            }
            function updatewindow(strm, src, end, copy) {
                var dist, state = strm.state;
                return null === state.window && (state.wsize = 1 << state.wbits, state.wnext = 0, state.whave = 0, state.window = new utils.Buf8(state.wsize)), copy >= state.wsize ? (utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0), state.wnext = 0, state.whave = state.wsize) : ((dist = state.wsize - state.wnext) > copy && (dist = copy), utils.arraySet(state.window, src, end - copy, dist, state.wnext), (copy -= dist) ? (utils.arraySet(state.window, src, end - copy, copy, 0), state.wnext = copy, state.whave = state.wsize) : (state.wnext += dist, state.wnext === state.wsize && (state.wnext = 0), state.whave < state.wsize && (state.whave += dist))), 0;
            }
            function inflate(strm, flush) {
                var state, input, output, next, put, have, left, hold, bits, _in, _out, copy, from, from_source, here_bits, here_op, here_val, last_bits, last_op, last_val, len, ret, opts, n, here = 0, hbuf = new utils.Buf8(4), order = [
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
                if (!strm || !strm.state || !strm.output || !strm.input && 0 !== strm.avail_in) return Z_STREAM_ERROR;
                (state = strm.state).mode === TYPE && (state.mode = TYPEDO), put = strm.next_out, output = strm.output, left = strm.avail_out, next = strm.next_in, input = strm.input, have = strm.avail_in, hold = state.hold, bits = state.bits, _in = have, _out = left, ret = Z_OK;
                inf_leave: for(;;)switch(state.mode){
                    case HEAD:
                        if (0 === state.wrap) {
                            state.mode = TYPEDO;
                            break;
                        }
                        for(; bits < 16;){
                            if (0 === have) break inf_leave;
                            have--, hold += input[next++] << bits, bits += 8;
                        }
                        if (2 & state.wrap && 0x8b1f === hold) {
                            state.check = 0, hbuf[0] = 0xff & hold, hbuf[1] = hold >>> 8 & 0xff, state.check = crc32(state.check, hbuf, 2, 0), hold = 0, bits = 0, state.mode = FLAGS;
                            break;
                        }
                        if (state.flags = 0, state.head && (state.head.done = !1), !(1 & state.wrap) || (((0xff & hold) << 8) + (hold >> 8)) % 31) {
                            strm.msg = 'incorrect header check', state.mode = BAD;
                            break;
                        }
                        if ((0x0f & hold) !== Z_DEFLATED) {
                            strm.msg = 'unknown compression method', state.mode = BAD;
                            break;
                        }
                        if (hold >>>= 4, bits -= 4, len = (0x0f & hold) + 8, 0 === state.wbits) state.wbits = len;
                        else if (len > state.wbits) {
                            strm.msg = 'invalid window size', state.mode = BAD;
                            break;
                        }
                        state.dmax = 1 << len, strm.adler = state.check = 1, state.mode = 0x200 & hold ? DICTID : TYPE, hold = 0, bits = 0;
                        break;
                    case FLAGS:
                        for(; bits < 16;){
                            if (0 === have) break inf_leave;
                            have--, hold += input[next++] << bits, bits += 8;
                        }
                        if (state.flags = hold, (0xff & state.flags) !== Z_DEFLATED) {
                            strm.msg = 'unknown compression method', state.mode = BAD;
                            break;
                        }
                        if (0xe000 & state.flags) {
                            strm.msg = 'unknown header flags set', state.mode = BAD;
                            break;
                        }
                        state.head && (state.head.text = hold >> 8 & 1), 0x0200 & state.flags && (hbuf[0] = 0xff & hold, hbuf[1] = hold >>> 8 & 0xff, state.check = crc32(state.check, hbuf, 2, 0)), hold = 0, bits = 0, state.mode = TIME;
                    case TIME:
                        for(; bits < 32;){
                            if (0 === have) break inf_leave;
                            have--, hold += input[next++] << bits, bits += 8;
                        }
                        state.head && (state.head.time = hold), 0x0200 & state.flags && (hbuf[0] = 0xff & hold, hbuf[1] = hold >>> 8 & 0xff, hbuf[2] = hold >>> 16 & 0xff, hbuf[3] = hold >>> 24 & 0xff, state.check = crc32(state.check, hbuf, 4, 0)), hold = 0, bits = 0, state.mode = OS;
                    case OS:
                        for(; bits < 16;){
                            if (0 === have) break inf_leave;
                            have--, hold += input[next++] << bits, bits += 8;
                        }
                        state.head && (state.head.xflags = 0xff & hold, state.head.os = hold >> 8), 0x0200 & state.flags && (hbuf[0] = 0xff & hold, hbuf[1] = hold >>> 8 & 0xff, state.check = crc32(state.check, hbuf, 2, 0)), hold = 0, bits = 0, state.mode = EXLEN;
                    case EXLEN:
                        if (0x0400 & state.flags) {
                            for(; bits < 16;){
                                if (0 === have) break inf_leave;
                                have--, hold += input[next++] << bits, bits += 8;
                            }
                            state.length = hold, state.head && (state.head.extra_len = hold), 0x0200 & state.flags && (hbuf[0] = 0xff & hold, hbuf[1] = hold >>> 8 & 0xff, state.check = crc32(state.check, hbuf, 2, 0)), hold = 0, bits = 0;
                        } else state.head && (state.head.extra = null);
                        state.mode = EXTRA;
                    case EXTRA:
                        if (0x0400 & state.flags && ((copy = state.length) > have && (copy = have), copy && (state.head && (len = state.head.extra_len - state.length, state.head.extra || (state.head.extra = Array(state.head.extra_len)), utils.arraySet(state.head.extra, input, next, copy, len)), 0x0200 & state.flags && (state.check = crc32(state.check, input, copy, next)), have -= copy, next += copy, state.length -= copy), state.length)) break inf_leave;
                        state.length = 0, state.mode = NAME;
                    case NAME:
                        if (0x0800 & state.flags) {
                            if (0 === have) break inf_leave;
                            copy = 0;
                            do len = input[next + copy++], state.head && len && state.length < 65536 && (state.head.name += String.fromCharCode(len));
                            while (len && copy < have)
                            if (0x0200 & state.flags && (state.check = crc32(state.check, input, copy, next)), have -= copy, next += copy, len) break inf_leave;
                        } else state.head && (state.head.name = null);
                        state.length = 0, state.mode = COMMENT;
                    case COMMENT:
                        if (0x1000 & state.flags) {
                            if (0 === have) break inf_leave;
                            copy = 0;
                            do len = input[next + copy++], state.head && len && state.length < 65536 && (state.head.comment += String.fromCharCode(len));
                            while (len && copy < have)
                            if (0x0200 & state.flags && (state.check = crc32(state.check, input, copy, next)), have -= copy, next += copy, len) break inf_leave;
                        } else state.head && (state.head.comment = null);
                        state.mode = HCRC;
                    case HCRC:
                        if (0x0200 & state.flags) {
                            for(; bits < 16;){
                                if (0 === have) break inf_leave;
                                have--, hold += input[next++] << bits, bits += 8;
                            }
                            if (hold !== (0xffff & state.check)) {
                                strm.msg = 'header crc mismatch', state.mode = BAD;
                                break;
                            }
                            hold = 0, bits = 0;
                        }
                        state.head && (state.head.hcrc = state.flags >> 9 & 1, state.head.done = !0), strm.adler = state.check = 0, state.mode = TYPE;
                        break;
                    case DICTID:
                        for(; bits < 32;){
                            if (0 === have) break inf_leave;
                            have--, hold += input[next++] << bits, bits += 8;
                        }
                        strm.adler = state.check = zswap32(hold), hold = 0, bits = 0, state.mode = DICT;
                    case DICT:
                        if (0 === state.havedict) return strm.next_out = put, strm.avail_out = left, strm.next_in = next, strm.avail_in = have, state.hold = hold, state.bits = bits, 2;
                        strm.adler = state.check = 1, state.mode = TYPE;
                    case TYPE:
                        if (5 === flush || flush === Z_TREES) break inf_leave;
                    case TYPEDO:
                        if (state.last) {
                            hold >>>= 7 & bits, bits -= 7 & bits, state.mode = CHECK;
                            break;
                        }
                        for(; bits < 3;){
                            if (0 === have) break inf_leave;
                            have--, hold += input[next++] << bits, bits += 8;
                        }
                        switch(state.last = 0x01 & hold, bits -= 1, 0x03 & (hold >>>= 1)){
                            case 0:
                                state.mode = STORED;
                                break;
                            case 1:
                                if (fixedtables(state), state.mode = LEN_, flush === Z_TREES) {
                                    hold >>>= 2, bits -= 2;
                                    break inf_leave;
                                }
                                break;
                            case 2:
                                state.mode = TABLE;
                                break;
                            case 3:
                                strm.msg = 'invalid block type', state.mode = BAD;
                        }
                        hold >>>= 2, bits -= 2;
                        break;
                    case STORED:
                        for(hold >>>= 7 & bits, bits -= 7 & bits; bits < 32;){
                            if (0 === have) break inf_leave;
                            have--, hold += input[next++] << bits, bits += 8;
                        }
                        if ((0xffff & hold) != (hold >>> 16 ^ 0xffff)) {
                            strm.msg = 'invalid stored block lengths', state.mode = BAD;
                            break;
                        }
                        if (state.length = 0xffff & hold, hold = 0, bits = 0, state.mode = COPY_, flush === Z_TREES) break inf_leave;
                    case COPY_:
                        state.mode = COPY;
                    case COPY:
                        if (copy = state.length) {
                            if (copy > have && (copy = have), copy > left && (copy = left), 0 === copy) break inf_leave;
                            utils.arraySet(output, input, next, copy, put), have -= copy, next += copy, left -= copy, put += copy, state.length -= copy;
                            break;
                        }
                        state.mode = TYPE;
                        break;
                    case TABLE:
                        for(; bits < 14;){
                            if (0 === have) break inf_leave;
                            have--, hold += input[next++] << bits, bits += 8;
                        }
                        if (state.nlen = (0x1f & hold) + 257, hold >>>= 5, bits -= 5, state.ndist = (0x1f & hold) + 1, hold >>>= 5, bits -= 5, state.ncode = (0x0f & hold) + 4, hold >>>= 4, bits -= 4, state.nlen > 286 || state.ndist > 30) {
                            strm.msg = 'too many length or distance symbols', state.mode = BAD;
                            break;
                        }
                        state.have = 0, state.mode = LENLENS;
                    case LENLENS:
                        for(; state.have < state.ncode;){
                            for(; bits < 3;){
                                if (0 === have) break inf_leave;
                                have--, hold += input[next++] << bits, bits += 8;
                            }
                            state.lens[order[state.have++]] = 0x07 & hold, hold >>>= 3, bits -= 3;
                        }
                        for(; state.have < 19;)state.lens[order[state.have++]] = 0;
                        if (state.lencode = state.lendyn, state.lenbits = 7, opts = {
                            bits: state.lenbits
                        }, ret = inflate_table(0, state.lens, 0, 19, state.lencode, 0, state.work, opts), state.lenbits = opts.bits, ret) {
                            strm.msg = 'invalid code lengths set', state.mode = BAD;
                            break;
                        }
                        state.have = 0, state.mode = CODELENS;
                    case CODELENS:
                        for(; state.have < state.nlen + state.ndist;){
                            for(; here_bits = (here = state.lencode[hold & (1 << state.lenbits) - 1]) >>> 24, here_op = here >>> 16 & 0xff, here_val = 0xffff & here, !(here_bits <= bits);){
                                if (0 === have) break inf_leave;
                                have--, hold += input[next++] << bits, bits += 8;
                            }
                            if (here_val < 16) hold >>>= here_bits, bits -= here_bits, state.lens[state.have++] = here_val;
                            else {
                                if (16 === here_val) {
                                    for(n = here_bits + 2; bits < n;){
                                        if (0 === have) break inf_leave;
                                        have--, hold += input[next++] << bits, bits += 8;
                                    }
                                    if (hold >>>= here_bits, bits -= here_bits, 0 === state.have) {
                                        strm.msg = 'invalid bit length repeat', state.mode = BAD;
                                        break;
                                    }
                                    len = state.lens[state.have - 1], copy = 3 + (0x03 & hold), hold >>>= 2, bits -= 2;
                                } else if (17 === here_val) {
                                    for(n = here_bits + 3; bits < n;){
                                        if (0 === have) break inf_leave;
                                        have--, hold += input[next++] << bits, bits += 8;
                                    }
                                    hold >>>= here_bits, bits -= here_bits, len = 0, copy = 3 + (0x07 & hold), hold >>>= 3, bits -= 3;
                                } else {
                                    for(n = here_bits + 7; bits < n;){
                                        if (0 === have) break inf_leave;
                                        have--, hold += input[next++] << bits, bits += 8;
                                    }
                                    hold >>>= here_bits, bits -= here_bits, len = 0, copy = 11 + (0x7f & hold), hold >>>= 7, bits -= 7;
                                }
                                if (state.have + copy > state.nlen + state.ndist) {
                                    strm.msg = 'invalid bit length repeat', state.mode = BAD;
                                    break;
                                }
                                for(; copy--;)state.lens[state.have++] = len;
                            }
                        }
                        if (state.mode === BAD) break;
                        if (0 === state.lens[256]) {
                            strm.msg = 'invalid code -- missing end-of-block', state.mode = BAD;
                            break;
                        }
                        if (state.lenbits = 9, opts = {
                            bits: state.lenbits
                        }, ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts), state.lenbits = opts.bits, ret) {
                            strm.msg = 'invalid literal/lengths set', state.mode = BAD;
                            break;
                        }
                        if (state.distbits = 6, state.distcode = state.distdyn, opts = {
                            bits: state.distbits
                        }, ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts), state.distbits = opts.bits, ret) {
                            strm.msg = 'invalid distances set', state.mode = BAD;
                            break;
                        }
                        if (state.mode = LEN_, flush === Z_TREES) break inf_leave;
                    case LEN_:
                        state.mode = LEN;
                    case LEN:
                        if (have >= 6 && left >= 258) {
                            strm.next_out = put, strm.avail_out = left, strm.next_in = next, strm.avail_in = have, state.hold = hold, state.bits = bits, inflate_fast(strm, _out), put = strm.next_out, output = strm.output, left = strm.avail_out, next = strm.next_in, input = strm.input, have = strm.avail_in, hold = state.hold, bits = state.bits, state.mode === TYPE && (state.back = -1);
                            break;
                        }
                        for(state.back = 0; here_bits = (here = state.lencode[hold & (1 << state.lenbits) - 1]) >>> 24, here_op = here >>> 16 & 0xff, here_val = 0xffff & here, !(here_bits <= bits);){
                            if (0 === have) break inf_leave;
                            have--, hold += input[next++] << bits, bits += 8;
                        }
                        if (here_op && (0xf0 & here_op) == 0) {
                            for(last_bits = here_bits, last_op = here_op, last_val = here_val; here_bits = (here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)]) >>> 24, here_op = here >>> 16 & 0xff, here_val = 0xffff & here, !(last_bits + here_bits <= bits);){
                                if (0 === have) break inf_leave;
                                have--, hold += input[next++] << bits, bits += 8;
                            }
                            hold >>>= last_bits, bits -= last_bits, state.back += last_bits;
                        }
                        if (hold >>>= here_bits, bits -= here_bits, state.back += here_bits, state.length = here_val, 0 === here_op) {
                            state.mode = LIT;
                            break;
                        }
                        if (32 & here_op) {
                            state.back = -1, state.mode = TYPE;
                            break;
                        }
                        if (64 & here_op) {
                            strm.msg = 'invalid literal/length code', state.mode = BAD;
                            break;
                        }
                        state.extra = 15 & here_op, state.mode = LENEXT;
                    case LENEXT:
                        if (state.extra) {
                            for(n = state.extra; bits < n;){
                                if (0 === have) break inf_leave;
                                have--, hold += input[next++] << bits, bits += 8;
                            }
                            state.length += hold & (1 << state.extra) - 1, hold >>>= state.extra, bits -= state.extra, state.back += state.extra;
                        }
                        state.was = state.length, state.mode = DIST;
                    case DIST:
                        for(; here_bits = (here = state.distcode[hold & (1 << state.distbits) - 1]) >>> 24, here_op = here >>> 16 & 0xff, here_val = 0xffff & here, !(here_bits <= bits);){
                            if (0 === have) break inf_leave;
                            have--, hold += input[next++] << bits, bits += 8;
                        }
                        if ((0xf0 & here_op) == 0) {
                            for(last_bits = here_bits, last_op = here_op, last_val = here_val; here_bits = (here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)]) >>> 24, here_op = here >>> 16 & 0xff, here_val = 0xffff & here, !(last_bits + here_bits <= bits);){
                                if (0 === have) break inf_leave;
                                have--, hold += input[next++] << bits, bits += 8;
                            }
                            hold >>>= last_bits, bits -= last_bits, state.back += last_bits;
                        }
                        if (hold >>>= here_bits, bits -= here_bits, state.back += here_bits, 64 & here_op) {
                            strm.msg = 'invalid distance code', state.mode = BAD;
                            break;
                        }
                        state.offset = here_val, state.extra = 15 & here_op, state.mode = DISTEXT;
                    case DISTEXT:
                        if (state.extra) {
                            for(n = state.extra; bits < n;){
                                if (0 === have) break inf_leave;
                                have--, hold += input[next++] << bits, bits += 8;
                            }
                            state.offset += hold & (1 << state.extra) - 1, hold >>>= state.extra, bits -= state.extra, state.back += state.extra;
                        }
                        if (state.offset > state.dmax) {
                            strm.msg = 'invalid distance too far back', state.mode = BAD;
                            break;
                        }
                        state.mode = MATCH;
                    case MATCH:
                        if (0 === left) break inf_leave;
                        if (copy = _out - left, state.offset > copy) {
                            if ((copy = state.offset - copy) > state.whave && state.sane) {
                                strm.msg = 'invalid distance too far back', state.mode = BAD;
                                break;
                            }
                            copy > state.wnext ? (copy -= state.wnext, from = state.wsize - copy) : from = state.wnext - copy, copy > state.length && (copy = state.length), from_source = state.window;
                        } else from_source = output, from = put - state.offset, copy = state.length;
                        copy > left && (copy = left), left -= copy, state.length -= copy;
                        do output[put++] = from_source[from++];
                        while (--copy)
                        0 === state.length && (state.mode = LEN);
                        break;
                    case LIT:
                        if (0 === left) break inf_leave;
                        output[put++] = state.length, left--, state.mode = LEN;
                        break;
                    case CHECK:
                        if (state.wrap) {
                            for(; bits < 32;){
                                if (0 === have) break inf_leave;
                                have--, hold |= input[next++] << bits, bits += 8;
                            }
                            if (_out -= left, strm.total_out += _out, state.total += _out, _out && (strm.adler = state.check = state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out)), _out = left, (state.flags ? hold : zswap32(hold)) !== state.check) {
                                strm.msg = 'incorrect data check', state.mode = BAD;
                                break;
                            }
                            hold = 0, bits = 0;
                        }
                        state.mode = LENGTH;
                    case LENGTH:
                        if (state.wrap && state.flags) {
                            for(; bits < 32;){
                                if (0 === have) break inf_leave;
                                have--, hold += input[next++] << bits, bits += 8;
                            }
                            if (hold !== (0xffffffff & state.total)) {
                                strm.msg = 'incorrect length check', state.mode = BAD;
                                break;
                            }
                            hold = 0, bits = 0;
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
                    default:
                        return Z_STREAM_ERROR;
                }
                return strm.next_out = put, strm.avail_out = left, strm.next_in = next, strm.avail_in = have, state.hold = hold, state.bits = bits, (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH)) && updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out), _in -= strm.avail_in, _out -= strm.avail_out, strm.total_in += _in, strm.total_out += _out, state.total += _out, state.wrap && _out && (strm.adler = state.check = state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out)), strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0), (0 === _in && 0 === _out || flush === Z_FINISH) && ret === Z_OK && (ret = -5), ret;
            }
            function inflateEnd(strm) {
                if (!strm || !strm.state) return Z_STREAM_ERROR;
                var state = strm.state;
                return state.window && (state.window = null), strm.state = null, Z_OK;
            }
            function inflateGetHeader(strm, head) {
                var state;
                return strm && strm.state && (2 & (state = strm.state).wrap) != 0 ? (state.head = head, head.done = !1, Z_OK) : Z_STREAM_ERROR;
            }
            function inflateSetDictionary(strm, dictionary) {
                var state, dictLength = dictionary.length;
                return strm && strm.state && (0 === (state = strm.state).wrap || state.mode === DICT) ? state.mode === DICT && adler32(1, dictionary, dictLength, 0) !== state.check ? Z_DATA_ERROR : updatewindow(strm, dictionary, dictLength, dictLength) ? (state.mode = MEM, Z_MEM_ERROR) : (state.havedict = 1, Z_OK) : Z_STREAM_ERROR;
            }
            inflate$1.inflateReset = inflateReset, inflate$1.inflateReset2 = inflateReset2, inflate$1.inflateResetKeep = inflateResetKeep, inflate$1.inflateInit = inflateInit, inflate$1.inflateInit2 = inflateInit2, inflate$1.inflate = inflate, inflate$1.inflateEnd = inflateEnd, inflate$1.inflateGetHeader = inflateGetHeader, inflate$1.inflateSetDictionary = inflateSetDictionary, inflate$1.inflateInfo = 'pako inflate (from Nodeca project)';
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
            !function(exports) {
                var assert = assert$2.exports, zlib_deflate = deflate$1, zlib_inflate = inflate$1, constants$1 = constants;
                for(var key in constants$1)exports[key] = constants$1[key];
                function Zlib(mode) {
                    if ('number' != typeof mode || mode < exports.DEFLATE || mode > exports.UNZIP) throw TypeError('Bad argument');
                    this.dictionary = null, this.err = 0, this.flush = 0, this.init_done = !1, this.level = 0, this.memLevel = 0, this.mode = mode, this.strategy = 0, this.windowBits = 0, this.write_in_progress = !1, this.pending_close = !1, this.gzip_id_bytes_read = 0;
                }
                exports.NONE = 0, exports.DEFLATE = 1, exports.INFLATE = 2, exports.GZIP = 3, exports.GUNZIP = 4, exports.DEFLATERAW = 5, exports.INFLATERAW = 6, exports.UNZIP = 7, Zlib.prototype.close = function() {
                    if (this.write_in_progress) {
                        this.pending_close = !0;
                        return;
                    }
                    this.pending_close = !1, assert(this.init_done, 'close before init'), assert(this.mode <= exports.UNZIP), this.mode === exports.DEFLATE || this.mode === exports.GZIP || this.mode === exports.DEFLATERAW ? zlib_deflate.deflateEnd(this.strm) : (this.mode === exports.INFLATE || this.mode === exports.GUNZIP || this.mode === exports.INFLATERAW || this.mode === exports.UNZIP) && zlib_inflate.inflateEnd(this.strm), this.mode = exports.NONE, this.dictionary = null;
                }, Zlib.prototype.write = function(flush, input, in_off, in_len, out, out_off, out_len) {
                    return this._write(!0, flush, input, in_off, in_len, out, out_off, out_len);
                }, Zlib.prototype.writeSync = function(flush, input, in_off, in_len, out, out_off, out_len) {
                    return this._write(!1, flush, input, in_off, in_len, out, out_off, out_len);
                }, Zlib.prototype._write = function(async, flush, input, in_off, in_len, out, out_off, out_len) {
                    if (assert.equal(arguments.length, 8), assert(this.init_done, 'write before init'), assert(this.mode !== exports.NONE, 'already finalized'), assert.equal(!1, this.write_in_progress, 'write already in progress'), assert.equal(!1, this.pending_close, 'close is pending'), this.write_in_progress = !0, assert.equal(!1, void 0 === flush, 'must provide flush value'), this.write_in_progress = !0, flush !== exports.Z_NO_FLUSH && flush !== exports.Z_PARTIAL_FLUSH && flush !== exports.Z_SYNC_FLUSH && flush !== exports.Z_FULL_FLUSH && flush !== exports.Z_FINISH && flush !== exports.Z_BLOCK) throw Error('Invalid flush value');
                    if (null == input && (input = Buffer$1.alloc(0), in_len = 0, in_off = 0), this.strm.avail_in = in_len, this.strm.input = input, this.strm.next_in = in_off, this.strm.avail_out = out_len, this.strm.output = out, this.strm.next_out = out_off, this.flush = flush, !async) return (this._process(), this._checkError()) ? this._afterSync() : void 0;
                    var self1 = this;
                    return browser$1$1.nextTick(function() {
                        self1._process(), self1._after();
                    }), this;
                }, Zlib.prototype._afterSync = function() {
                    var avail_out = this.strm.avail_out, avail_in = this.strm.avail_in;
                    return this.write_in_progress = !1, [
                        avail_in,
                        avail_out
                    ];
                }, Zlib.prototype._process = function() {
                    var next_expected_header_byte = null;
                    switch(this.mode){
                        case exports.DEFLATE:
                        case exports.GZIP:
                        case exports.DEFLATERAW:
                            this.err = zlib_deflate.deflate(this.strm, this.flush);
                            break;
                        case exports.UNZIP:
                            switch(this.strm.avail_in > 0 && (next_expected_header_byte = this.strm.next_in), this.gzip_id_bytes_read){
                                case 0:
                                    if (null === next_expected_header_byte) break;
                                    if (0x1f === this.strm.input[next_expected_header_byte]) {
                                        if (this.gzip_id_bytes_read = 1, next_expected_header_byte++, 1 === this.strm.avail_in) break;
                                    } else {
                                        this.mode = exports.INFLATE;
                                        break;
                                    }
                                case 1:
                                    if (null === next_expected_header_byte) break;
                                    0x8b === this.strm.input[next_expected_header_byte] ? (this.gzip_id_bytes_read = 2, this.mode = exports.GUNZIP) : this.mode = exports.INFLATE;
                                    break;
                                default:
                                    throw Error('invalid number of gzip magic number bytes read');
                            }
                        case exports.INFLATE:
                        case exports.GUNZIP:
                        case exports.INFLATERAW:
                            for(this.err = zlib_inflate.inflate(this.strm, this.flush), this.err === exports.Z_NEED_DICT && this.dictionary && (this.err = zlib_inflate.inflateSetDictionary(this.strm, this.dictionary), this.err === exports.Z_OK ? this.err = zlib_inflate.inflate(this.strm, this.flush) : this.err === exports.Z_DATA_ERROR && (this.err = exports.Z_NEED_DICT)); this.strm.avail_in > 0 && this.mode === exports.GUNZIP && this.err === exports.Z_STREAM_END && 0x00 !== this.strm.next_in[0];)this.reset(), this.err = zlib_inflate.inflate(this.strm, this.flush);
                            break;
                        default:
                            throw Error('Unknown mode ' + this.mode);
                    }
                }, Zlib.prototype._checkError = function() {
                    switch(this.err){
                        case exports.Z_OK:
                        case exports.Z_BUF_ERROR:
                            if (0 !== this.strm.avail_out && this.flush === exports.Z_FINISH) return this._error('unexpected end of file'), !1;
                            break;
                        case exports.Z_STREAM_END:
                            break;
                        case exports.Z_NEED_DICT:
                            return null == this.dictionary ? this._error('Missing dictionary') : this._error('Bad dictionary'), !1;
                        default:
                            return this._error('Zlib error'), !1;
                    }
                    return !0;
                }, Zlib.prototype._after = function() {
                    if (this._checkError()) {
                        var avail_out = this.strm.avail_out, avail_in = this.strm.avail_in;
                        this.write_in_progress = !1, this.callback(avail_in, avail_out), this.pending_close && this.close();
                    }
                }, Zlib.prototype._error = function(message) {
                    this.strm.msg && (message = this.strm.msg), this.onerror(message, this.err), this.write_in_progress = !1, this.pending_close && this.close();
                }, Zlib.prototype.init = function(windowBits, level, memLevel, strategy, dictionary) {
                    assert(4 === arguments.length || 5 === arguments.length, 'init(windowBits, level, memLevel, strategy, [dictionary])'), assert(windowBits >= 8 && windowBits <= 15, 'invalid windowBits'), assert(level >= -1 && level <= 9, 'invalid compression level'), assert(memLevel >= 1 && memLevel <= 9, 'invalid memlevel'), assert(strategy === exports.Z_FILTERED || strategy === exports.Z_HUFFMAN_ONLY || strategy === exports.Z_RLE || strategy === exports.Z_FIXED || strategy === exports.Z_DEFAULT_STRATEGY, 'invalid strategy'), this._init(level, windowBits, memLevel, strategy, dictionary), this._setDictionary();
                }, Zlib.prototype.params = function() {
                    throw Error('deflateParams Not supported');
                }, Zlib.prototype.reset = function() {
                    this._reset(), this._setDictionary();
                }, Zlib.prototype._init = function(level, windowBits, memLevel, strategy, dictionary) {
                    switch(this.level = level, this.windowBits = windowBits, this.memLevel = memLevel, this.strategy = strategy, this.flush = exports.Z_NO_FLUSH, this.err = exports.Z_OK, (this.mode === exports.GZIP || this.mode === exports.GUNZIP) && (this.windowBits += 16), this.mode === exports.UNZIP && (this.windowBits += 32), (this.mode === exports.DEFLATERAW || this.mode === exports.INFLATERAW) && (this.windowBits = -1 * this.windowBits), this.strm = new ZStream(), this.mode){
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
                    this.err !== exports.Z_OK && this._error('Init error'), this.dictionary = dictionary, this.write_in_progress = !1, this.init_done = !0;
                }, Zlib.prototype._setDictionary = function() {
                    if (null != this.dictionary) {
                        switch(this.err = exports.Z_OK, this.mode){
                            case exports.DEFLATE:
                            case exports.DEFLATERAW:
                                this.err = zlib_deflate.deflateSetDictionary(this.strm, this.dictionary);
                        }
                        this.err !== exports.Z_OK && this._error('Failed to set dictionary');
                    }
                }, Zlib.prototype._reset = function() {
                    switch(this.err = exports.Z_OK, this.mode){
                        case exports.DEFLATE:
                        case exports.DEFLATERAW:
                        case exports.GZIP:
                            this.err = zlib_deflate.deflateReset(this.strm);
                            break;
                        case exports.INFLATE:
                        case exports.INFLATERAW:
                        case exports.GUNZIP:
                            this.err = zlib_inflate.inflateReset(this.strm);
                    }
                    this.err !== exports.Z_OK && this._error('Failed to reset stream');
                }, exports.Zlib = Zlib;
            }(binding), function(exports) {
                var Buffer = buffer.Buffer, Transform = require$$1.Transform, binding$1 = binding, util = util$1, assert = assert$2.exports.ok, kMaxLength = buffer.kMaxLength, kRangeErrorMessage = "Cannot create final Buffer. It would be larger than 0x" + kMaxLength.toString(16) + ' bytes';
                binding$1.Z_MIN_WINDOWBITS = 8, binding$1.Z_MAX_WINDOWBITS = 15, binding$1.Z_DEFAULT_WINDOWBITS = 15, binding$1.Z_MIN_CHUNK = 64, binding$1.Z_MAX_CHUNK = 1 / 0, binding$1.Z_DEFAULT_CHUNK = 16384, binding$1.Z_MIN_MEMLEVEL = 1, binding$1.Z_MAX_MEMLEVEL = 9, binding$1.Z_DEFAULT_MEMLEVEL = 8, binding$1.Z_MIN_LEVEL = -1, binding$1.Z_MAX_LEVEL = 9, binding$1.Z_DEFAULT_LEVEL = binding$1.Z_DEFAULT_COMPRESSION;
                for(var bkeys = Object.keys(binding$1), bk = 0; bk < bkeys.length; bk++){
                    var bkey = bkeys[bk];
                    bkey.match(/^Z/) && Object.defineProperty(exports, bkey, {
                        enumerable: !0,
                        value: binding$1[bkey],
                        writable: !1
                    });
                }
                for(var codes = {
                    Z_OK: binding$1.Z_OK,
                    Z_STREAM_END: binding$1.Z_STREAM_END,
                    Z_NEED_DICT: binding$1.Z_NEED_DICT,
                    Z_ERRNO: binding$1.Z_ERRNO,
                    Z_STREAM_ERROR: binding$1.Z_STREAM_ERROR,
                    Z_DATA_ERROR: binding$1.Z_DATA_ERROR,
                    Z_MEM_ERROR: binding$1.Z_MEM_ERROR,
                    Z_BUF_ERROR: binding$1.Z_BUF_ERROR,
                    Z_VERSION_ERROR: binding$1.Z_VERSION_ERROR
                }, ckeys = Object.keys(codes), ck = 0; ck < ckeys.length; ck++){
                    var ckey = ckeys[ck];
                    codes[codes[ckey]] = ckey;
                }
                function zlibBuffer(engine, buffer1, callback) {
                    var buffers = [], nread = 0;
                    function flow() {
                        for(var chunk; null !== (chunk = engine.read());)buffers.push(chunk), nread += chunk.length;
                        engine.once('readable', flow);
                    }
                    function onError(err) {
                        engine.removeListener('end', onEnd), engine.removeListener('readable', flow), callback(err);
                    }
                    function onEnd() {
                        var buf, err = null;
                        nread >= kMaxLength ? err = RangeError(kRangeErrorMessage) : buf = Buffer.concat(buffers, nread), buffers = [], engine.close(), callback(err, buf);
                    }
                    engine.on('error', onError), engine.on('end', onEnd), engine.end(buffer1), flow();
                }
                function zlibBufferSync(engine, buffer1) {
                    if ('string' == typeof buffer1 && (buffer1 = Buffer.from(buffer1)), !Buffer.isBuffer(buffer1)) throw TypeError('Not a string or buffer');
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
                    if (this._opts = opts = opts || {}, this._chunkSize = opts.chunkSize || exports.Z_DEFAULT_CHUNK, Transform.call(this, opts), opts.flush && !isValidFlushFlag(opts.flush)) throw Error('Invalid flush flag: ' + opts.flush);
                    if (opts.finishFlush && !isValidFlushFlag(opts.finishFlush)) throw Error('Invalid flush flag: ' + opts.finishFlush);
                    if (this._flushFlag = opts.flush || binding$1.Z_NO_FLUSH, this._finishFlushFlag = void 0 !== opts.finishFlush ? opts.finishFlush : binding$1.Z_FINISH, opts.chunkSize && (opts.chunkSize < exports.Z_MIN_CHUNK || opts.chunkSize > exports.Z_MAX_CHUNK)) throw Error('Invalid chunk size: ' + opts.chunkSize);
                    if (opts.windowBits && (opts.windowBits < exports.Z_MIN_WINDOWBITS || opts.windowBits > exports.Z_MAX_WINDOWBITS)) throw Error('Invalid windowBits: ' + opts.windowBits);
                    if (opts.level && (opts.level < exports.Z_MIN_LEVEL || opts.level > exports.Z_MAX_LEVEL)) throw Error('Invalid compression level: ' + opts.level);
                    if (opts.memLevel && (opts.memLevel < exports.Z_MIN_MEMLEVEL || opts.memLevel > exports.Z_MAX_MEMLEVEL)) throw Error('Invalid memLevel: ' + opts.memLevel);
                    if (opts.strategy && opts.strategy != exports.Z_FILTERED && opts.strategy != exports.Z_HUFFMAN_ONLY && opts.strategy != exports.Z_RLE && opts.strategy != exports.Z_FIXED && opts.strategy != exports.Z_DEFAULT_STRATEGY) throw Error('Invalid strategy: ' + opts.strategy);
                    if (opts.dictionary && !Buffer.isBuffer(opts.dictionary)) throw Error('Invalid dictionary: it should be a Buffer instance');
                    this._handle = new binding$1.Zlib(mode);
                    var self1 = this;
                    this._hadError = !1, this._handle.onerror = function(message, errno) {
                        _close(self1), self1._hadError = !0;
                        var error = Error(message);
                        error.errno = errno, error.code = exports.codes[errno], self1.emit('error', error);
                    };
                    var level = exports.Z_DEFAULT_COMPRESSION;
                    'number' == typeof opts.level && (level = opts.level);
                    var strategy = exports.Z_DEFAULT_STRATEGY;
                    'number' == typeof opts.strategy && (strategy = opts.strategy), this._handle.init(opts.windowBits || exports.Z_DEFAULT_WINDOWBITS, level, opts.memLevel || exports.Z_DEFAULT_MEMLEVEL, strategy, opts.dictionary), this._buffer = Buffer.allocUnsafe(this._chunkSize), this._offset = 0, this._level = level, this._strategy = strategy, this.once('end', this.close), Object.defineProperty(this, '_closed', {
                        get: function() {
                            return !_this._handle;
                        },
                        configurable: !0,
                        enumerable: !0
                    });
                }
                function _close(engine, callback) {
                    callback && browser$1$1.nextTick(callback), engine._handle && (engine._handle.close(), engine._handle = null);
                }
                function emitCloseNT(self1) {
                    self1.emit('close');
                }
                Object.defineProperty(exports, 'codes', {
                    enumerable: !0,
                    value: Object.freeze(codes),
                    writable: !1
                }), exports.Deflate = Deflate, exports.Inflate = Inflate, exports.Gzip = Gzip, exports.Gunzip = Gunzip, exports.DeflateRaw = DeflateRaw, exports.InflateRaw = InflateRaw, exports.Unzip = Unzip, exports.createDeflate = function(o) {
                    return new Deflate(o);
                }, exports.createInflate = function(o) {
                    return new Inflate(o);
                }, exports.createDeflateRaw = function(o) {
                    return new DeflateRaw(o);
                }, exports.createInflateRaw = function(o) {
                    return new InflateRaw(o);
                }, exports.createGzip = function(o) {
                    return new Gzip(o);
                }, exports.createGunzip = function(o) {
                    return new Gunzip(o);
                }, exports.createUnzip = function(o) {
                    return new Unzip(o);
                }, exports.deflate = function(buffer1, opts, callback) {
                    return 'function' == typeof opts && (callback = opts, opts = {}), zlibBuffer(new Deflate(opts), buffer1, callback);
                }, exports.deflateSync = function(buffer1, opts) {
                    return zlibBufferSync(new Deflate(opts), buffer1);
                }, exports.gzip = function(buffer1, opts, callback) {
                    return 'function' == typeof opts && (callback = opts, opts = {}), zlibBuffer(new Gzip(opts), buffer1, callback);
                }, exports.gzipSync = function(buffer1, opts) {
                    return zlibBufferSync(new Gzip(opts), buffer1);
                }, exports.deflateRaw = function(buffer1, opts, callback) {
                    return 'function' == typeof opts && (callback = opts, opts = {}), zlibBuffer(new DeflateRaw(opts), buffer1, callback);
                }, exports.deflateRawSync = function(buffer1, opts) {
                    return zlibBufferSync(new DeflateRaw(opts), buffer1);
                }, exports.unzip = function(buffer1, opts, callback) {
                    return 'function' == typeof opts && (callback = opts, opts = {}), zlibBuffer(new Unzip(opts), buffer1, callback);
                }, exports.unzipSync = function(buffer1, opts) {
                    return zlibBufferSync(new Unzip(opts), buffer1);
                }, exports.inflate = function(buffer1, opts, callback) {
                    return 'function' == typeof opts && (callback = opts, opts = {}), zlibBuffer(new Inflate(opts), buffer1, callback);
                }, exports.inflateSync = function(buffer1, opts) {
                    return zlibBufferSync(new Inflate(opts), buffer1);
                }, exports.gunzip = function(buffer1, opts, callback) {
                    return 'function' == typeof opts && (callback = opts, opts = {}), zlibBuffer(new Gunzip(opts), buffer1, callback);
                }, exports.gunzipSync = function(buffer1, opts) {
                    return zlibBufferSync(new Gunzip(opts), buffer1);
                }, exports.inflateRaw = function(buffer1, opts, callback) {
                    return 'function' == typeof opts && (callback = opts, opts = {}), zlibBuffer(new InflateRaw(opts), buffer1, callback);
                }, exports.inflateRawSync = function(buffer1, opts) {
                    return zlibBufferSync(new InflateRaw(opts), buffer1);
                }, util.inherits(Zlib, Transform), Zlib.prototype.params = function(level, strategy, callback) {
                    if (level < exports.Z_MIN_LEVEL || level > exports.Z_MAX_LEVEL) throw RangeError('Invalid compression level: ' + level);
                    if (strategy != exports.Z_FILTERED && strategy != exports.Z_HUFFMAN_ONLY && strategy != exports.Z_RLE && strategy != exports.Z_FIXED && strategy != exports.Z_DEFAULT_STRATEGY) throw TypeError('Invalid strategy: ' + strategy);
                    if (this._level !== level || this._strategy !== strategy) {
                        var self1 = this;
                        this.flush(binding$1.Z_SYNC_FLUSH, function() {
                            assert(self1._handle, 'zlib binding closed'), self1._handle.params(level, strategy), !self1._hadError && (self1._level = level, self1._strategy = strategy, callback && callback());
                        });
                    } else browser$1$1.nextTick(callback);
                }, Zlib.prototype.reset = function() {
                    return assert(this._handle, 'zlib binding closed'), this._handle.reset();
                }, Zlib.prototype._flush = function(callback) {
                    this._transform(Buffer.alloc(0), '', callback);
                }, Zlib.prototype.flush = function(kind, callback) {
                    var _this2 = this, ws = this._writableState;
                    'function' != typeof kind && (void 0 !== kind || callback) || (callback = kind, kind = binding$1.Z_FULL_FLUSH), ws.ended ? callback && browser$1$1.nextTick(callback) : ws.ending ? callback && this.once('end', callback) : ws.needDrain ? callback && this.once('drain', function() {
                        return _this2.flush(kind, callback);
                    }) : (this._flushFlag = kind, this.write(Buffer.alloc(0), '', callback));
                }, Zlib.prototype.close = function(callback) {
                    _close(this, callback), browser$1$1.nextTick(emitCloseNT, this);
                }, Zlib.prototype._transform = function(chunk, encoding, cb) {
                    var flushFlag, ws = this._writableState, last = (ws.ending || ws.ended) && (!chunk || ws.length === chunk.length);
                    return null === chunk || Buffer.isBuffer(chunk) ? this._handle ? void (last ? flushFlag = this._finishFlushFlag : (flushFlag = this._flushFlag, chunk.length >= ws.length && (this._flushFlag = this._opts.flush || binding$1.Z_NO_FLUSH)), this._processChunk(chunk, flushFlag, cb)) : cb(Error('zlib binding closed')) : cb(Error('invalid input'));
                }, Zlib.prototype._processChunk = function(chunk, flushFlag, cb) {
                    var availInBefore = chunk && chunk.length, availOutBefore = this._chunkSize - this._offset, inOff = 0, self1 = this, async = 'function' == typeof cb;
                    if (!async) {
                        var error, buffers = [], nread = 0;
                        this.on('error', function(er) {
                            error = er;
                        }), assert(this._handle, 'zlib binding closed');
                        do var res = this._handle.writeSync(flushFlag, chunk, inOff, availInBefore, this._buffer, this._offset, availOutBefore);
                        while (!this._hadError && callback(res[0], res[1]))
                        if (this._hadError) throw error;
                        if (nread >= kMaxLength) throw _close(this), RangeError(kRangeErrorMessage);
                        var buf = Buffer.concat(buffers, nread);
                        return _close(this), buf;
                    }
                    assert(this._handle, 'zlib binding closed');
                    var req = this._handle.write(flushFlag, chunk, inOff, availInBefore, this._buffer, this._offset, availOutBefore);
                    function callback(availInAfter, availOutAfter) {
                        if (this && (this.buffer = null, this.callback = null), !self1._hadError) {
                            var have = availOutBefore - availOutAfter;
                            if (assert(have >= 0, 'have should not go down'), have > 0) {
                                var out = self1._buffer.slice(self1._offset, self1._offset + have);
                                self1._offset += have, async ? self1.push(out) : (buffers.push(out), nread += out.length);
                            }
                            if ((0 === availOutAfter || self1._offset >= self1._chunkSize) && (availOutBefore = self1._chunkSize, self1._offset = 0, self1._buffer = Buffer.allocUnsafe(self1._chunkSize)), 0 === availOutAfter) {
                                if (inOff += availInBefore - availInAfter, availInBefore = availInAfter, !async) return !0;
                                var newReq = self1._handle.write(flushFlag, chunk, inOff, availInBefore, self1._buffer, self1._offset, self1._chunkSize);
                                return newReq.callback = callback, void (newReq.buffer = chunk);
                            }
                            if (!async) return !1;
                            cb();
                        }
                    }
                    req.buffer = chunk, req.callback = callback;
                }, util.inherits(Deflate, Zlib), util.inherits(Inflate, Zlib), util.inherits(Gzip, Zlib), util.inherits(Gunzip, Zlib), util.inherits(DeflateRaw, Zlib), util.inherits(InflateRaw, Zlib), util.inherits(Unzip, Zlib);
            }(lib);
            var PNG = function() {
                function PNG(data) {
                    var i;
                    for(this.data = data, this.pos = 8, this.palette = [], this.imgData = [], this.transparency = {}, this.text = {};;){
                        var chunkSize = this.readUInt32(), section = '';
                        for(i = 0; i < 4; i++)section += String.fromCharCode(this.data[this.pos++]);
                        switch(section){
                            case 'IHDR':
                                this.width = this.readUInt32(), this.height = this.readUInt32(), this.bits = this.data[this.pos++], this.colorType = this.data[this.pos++], this.compressionMethod = this.data[this.pos++], this.filterMethod = this.data[this.pos++], this.interlaceMethod = this.data[this.pos++];
                                break;
                            case 'PLTE':
                                this.palette = this.read(chunkSize);
                                break;
                            case 'IDAT':
                                for(i = 0; i < chunkSize; i++)this.imgData.push(this.data[this.pos++]);
                                break;
                            case 'tRNS':
                                switch(this.transparency = {}, this.colorType){
                                    case 3:
                                        this.transparency.indexed = this.read(chunkSize);
                                        var short = 255 - this.transparency.indexed.length;
                                        if (short > 0) for(i = 0; i < short; i++)this.transparency.indexed.push(255);
                                        break;
                                    case 0:
                                        this.transparency.grayscale = this.read(chunkSize)[0];
                                        break;
                                    case 2:
                                        this.transparency.rgb = this.read(chunkSize);
                                }
                                break;
                            case 'tEXt':
                                var text = this.read(chunkSize), index = text.indexOf(0), key = String.fromCharCode.apply(String, text.slice(0, index));
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
                                }
                                this.hasAlphaChannel = [
                                    4,
                                    6
                                ].includes(this.colorType);
                                var colors = this.colors + (this.hasAlphaChannel ? 1 : 0);
                                switch(this.pixelBitlength = this.bits * colors, this.colors){
                                    case 1:
                                        this.colorSpace = 'DeviceGray';
                                        break;
                                    case 3:
                                        this.colorSpace = 'DeviceRGB';
                                }
                                this.imgData = Buffer$1.from(this.imgData);
                                return;
                            default:
                                this.pos += chunkSize;
                        }
                        if (this.pos += 4, this.pos > this.data.length) throw Error('Incomplete or corrupt PNG file');
                    }
                }
                PNG.decode = function(path, fn) {
                    throw Error('PNG.decode not available in browser build');
                }, PNG.load = function(path) {
                    throw Error('PNG.load not available in browser build');
                };
                var _proto = PNG.prototype;
                return _proto.read = function(bytes) {
                    for(var result = Array(bytes), i = 0; i < bytes; i++)result[i] = this.data[this.pos++];
                    return result;
                }, _proto.readUInt32 = function() {
                    return this.data[this.pos++] << 24 | this.data[this.pos++] << 16 | this.data[this.pos++] << 8 | this.data[this.pos++];
                }, _proto.readUInt16 = function() {
                    return this.data[this.pos++] << 8 | this.data[this.pos++];
                }, _proto.decodePixels = function(fn) {
                    var _this = this;
                    return lib.inflate(this.imgData, function(err, data) {
                        if (err) throw err;
                        var pos = 0, width = _this.width, height = _this.height, pixelBytes = _this.pixelBitlength / 8, pixels = Buffer$1.alloc(width * height * pixelBytes);
                        function pass(x0, y0, dx, dy, singlePass) {
                            void 0 === singlePass && (singlePass = !1);
                            for(var w = Math.ceil((width - x0) / dx), h = Math.ceil((height - y0) / dy), scanlineLength = pixelBytes * w, buffer = singlePass ? pixels : Buffer$1.alloc(scanlineLength * h), row = 0, c = 0; row < h && pos < data.length;){
                                switch(data[pos++]){
                                    case 0:
                                        for(i = 0; i < scanlineLength; i++)buffer[c++] = data[pos++];
                                        break;
                                    case 1:
                                        for(i = 0; i < scanlineLength; i++)byte = data[pos++], left = i < pixelBytes ? 0 : buffer[c - pixelBytes], buffer[c++] = (byte + left) % 256;
                                        break;
                                    case 2:
                                        for(i = 0; i < scanlineLength; i++)byte = data[pos++], col = (i - i % pixelBytes) / pixelBytes, upper = row && buffer[(row - 1) * scanlineLength + col * pixelBytes + i % pixelBytes], buffer[c++] = (upper + byte) % 256;
                                        break;
                                    case 3:
                                        for(i = 0; i < scanlineLength; i++)byte = data[pos++], col = (i - i % pixelBytes) / pixelBytes, left = i < pixelBytes ? 0 : buffer[c - pixelBytes], upper = row && buffer[(row - 1) * scanlineLength + col * pixelBytes + i % pixelBytes], buffer[c++] = (byte + Math.floor((left + upper) / 2)) % 256;
                                        break;
                                    case 4:
                                        for(i = 0; i < scanlineLength; i++){
                                            byte = data[pos++], col = (i - i % pixelBytes) / pixelBytes, left = i < pixelBytes ? 0 : buffer[c - pixelBytes], 0 === row ? upper = upperLeft = 0 : (upper = buffer[(row - 1) * scanlineLength + col * pixelBytes + i % pixelBytes], upperLeft = col && buffer[(row - 1) * scanlineLength + (col - 1) * pixelBytes + i % pixelBytes]);
                                            var byte, col, i, left, upper, paeth, upperLeft, p = left + upper - upperLeft, pa = Math.abs(p - left), pb = Math.abs(p - upper), pc = Math.abs(p - upperLeft);
                                            paeth = pa <= pb && pa <= pc ? left : pb <= pc ? upper : upperLeft, buffer[c++] = (byte + paeth) % 256;
                                        }
                                        break;
                                    default:
                                        throw Error("Invalid filter algorithm: " + data[pos - 1]);
                                }
                                if (!singlePass) {
                                    var pixelsPos = ((y0 + row * dy) * width + x0) * pixelBytes, bufferPos = row * scanlineLength;
                                    for(i = 0; i < w; i++){
                                        for(var j = 0; j < pixelBytes; j++)pixels[pixelsPos++] = buffer[bufferPos++];
                                        pixelsPos += (dx - 1) * pixelBytes;
                                    }
                                }
                                row++;
                            }
                        }
                        return 1 === _this.interlaceMethod ? (pass(0, 0, 8, 8), pass(4, 0, 8, 8), pass(0, 4, 4, 8), pass(2, 0, 4, 4), pass(0, 2, 2, 4), pass(1, 0, 2, 2), pass(0, 1, 1, 2)) : pass(0, 0, 1, 1, !0), fn(pixels);
                    });
                }, _proto.decodePalette = function() {
                    for(var left, palette = this.palette, length = palette.length, transparency = this.transparency.indexed || [], ret = Buffer$1.alloc(transparency.length + length), pos = 0, c = 0, i = 0; i < length; i += 3)ret[pos++] = palette[i], ret[pos++] = palette[i + 1], ret[pos++] = palette[i + 2], ret[pos++] = null != (left = transparency[c++]) ? left : 255;
                    return ret;
                }, _proto.copyToImageData = function(imageData, pixels) {
                    var j, k, colors = this.colors, palette = null, alpha = this.hasAlphaChannel;
                    this.palette.length && (palette = this._decodedPalette || (this._decodedPalette = this.decodePalette()), colors = 4, alpha = !0);
                    var data = imageData.data || imageData, length = data.length, input = palette || pixels, i = j = 0;
                    if (1 === colors) for(; i < length;){
                        k = palette ? 4 * pixels[i / 4] : j;
                        var v = input[k++];
                        data[i++] = v, data[i++] = v, data[i++] = v, data[i++] = alpha ? input[k++] : 255, j = k;
                    }
                    else for(; i < length;)k = palette ? 4 * pixels[i / 4] : j, data[i++] = input[k++], data[i++] = input[k++], data[i++] = input[k++], data[i++] = alpha ? input[k++] : 255, j = k;
                }, _proto.decode = function(fn) {
                    var _this2 = this, ret = Buffer$1.alloc(this.width * this.height * 4);
                    return this.decodePixels(function(pixels) {
                        return _this2.copyToImageData(ret, pixels), fn(ret);
                    });
                }, PNG;
            }();
        }
    }
]);
