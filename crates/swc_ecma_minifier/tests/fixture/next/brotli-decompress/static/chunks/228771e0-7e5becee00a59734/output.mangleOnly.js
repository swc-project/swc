"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        445
    ],
    {
        1852: (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            __webpack_require__.d(__webpack_exports__, {
                "Z": function() {
                    return PNG;
                }
            });
            var global$1 = (typeof __webpack_require__.g !== "undefined" ? __webpack_require__.g : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
            var lookup$1 = [];
            var revLookup$1 = [];
            var Arr$1 = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
            var inited = false;
            function init() {
                inited = true;
                var e = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                for(var t = 0, r = e.length; t < r; ++t){
                    lookup$1[t] = e[t];
                    revLookup$1[e.charCodeAt(t)] = t;
                }
                revLookup$1['-'.charCodeAt(0)] = 62;
                revLookup$1['_'.charCodeAt(0)] = 63;
            }
            function toByteArray$1(e) {
                if (!inited) {
                    init();
                }
                var t, r, n, i, a, o;
                var f = e.length;
                if (f % 4 > 0) {
                    throw new Error('Invalid string. Length must be a multiple of 4');
                }
                a = e[f - 2] === '=' ? 2 : e[f - 1] === '=' ? 1 : 0;
                o = new Arr$1(f * 3 / 4 - a);
                n = a > 0 ? f - 4 : f;
                var s = 0;
                for(t = 0, r = 0; t < n; t += 4, r += 3){
                    i = (revLookup$1[e.charCodeAt(t)] << 18) | (revLookup$1[e.charCodeAt(t + 1)] << 12) | (revLookup$1[e.charCodeAt(t + 2)] << 6) | revLookup$1[e.charCodeAt(t + 3)];
                    o[s++] = (i >> 16) & 0xFF;
                    o[s++] = (i >> 8) & 0xFF;
                    o[s++] = i & 0xFF;
                }
                if (a === 2) {
                    i = (revLookup$1[e.charCodeAt(t)] << 2) | (revLookup$1[e.charCodeAt(t + 1)] >> 4);
                    o[s++] = i & 0xFF;
                } else if (a === 1) {
                    i = (revLookup$1[e.charCodeAt(t)] << 10) | (revLookup$1[e.charCodeAt(t + 1)] << 4) | (revLookup$1[e.charCodeAt(t + 2)] >> 2);
                    o[s++] = (i >> 8) & 0xFF;
                    o[s++] = i & 0xFF;
                }
                return o;
            }
            function tripletToBase64$1(e) {
                return lookup$1[e >> 18 & 0x3F] + lookup$1[e >> 12 & 0x3F] + lookup$1[e >> 6 & 0x3F] + lookup$1[e & 0x3F];
            }
            function encodeChunk$1(e, t, r) {
                var n;
                var i = [];
                for(var a = t; a < r; a += 3){
                    n = (e[a] << 16) + (e[a + 1] << 8) + (e[a + 2]);
                    i.push(tripletToBase64$1(n));
                }
                return i.join('');
            }
            function fromByteArray$1(e) {
                if (!inited) {
                    init();
                }
                var t;
                var r = e.length;
                var n = r % 3;
                var i = '';
                var a = [];
                var o = 16383;
                for(var f = 0, s = r - n; f < s; f += o){
                    a.push(encodeChunk$1(e, f, (f + o) > s ? s : (f + o)));
                }
                if (n === 1) {
                    t = e[r - 1];
                    i += lookup$1[t >> 2];
                    i += lookup$1[(t << 4) & 0x3F];
                    i += '==';
                } else if (n === 2) {
                    t = (e[r - 2] << 8) + (e[r - 1]);
                    i += lookup$1[t >> 10];
                    i += lookup$1[(t >> 4) & 0x3F];
                    i += lookup$1[(t << 2) & 0x3F];
                    i += '=';
                }
                a.push(i);
                return a.join('');
            }
            function read(e, t, r, n, i) {
                var a, o;
                var f = i * 8 - n - 1;
                var s = (1 << f) - 1;
                var u = s >> 1;
                var l = -7;
                var c = r ? (i - 1) : 0;
                var h = r ? -1 : 1;
                var p = e[t + c];
                c += h;
                a = p & ((1 << (-l)) - 1);
                p >>= (-l);
                l += f;
                for(; l > 0; a = a * 256 + e[t + c], c += h, l -= 8){}
                o = a & ((1 << (-l)) - 1);
                a >>= (-l);
                l += n;
                for(; l > 0; o = o * 256 + e[t + c], c += h, l -= 8){}
                if (a === 0) {
                    a = 1 - u;
                } else if (a === s) {
                    return o ? NaN : ((p ? -1 : 1) * Infinity);
                } else {
                    o = o + Math.pow(2, n);
                    a = a - u;
                }
                return (p ? -1 : 1) * o * Math.pow(2, a - n);
            }
            function write(e, t, r, n, i, a) {
                var o, f, s;
                var u = a * 8 - i - 1;
                var l = (1 << u) - 1;
                var c = l >> 1;
                var h = (i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
                var p = n ? 0 : (a - 1);
                var d = n ? 1 : -1;
                var v = t < 0 || (t === 0 && 1 / t < 0) ? 1 : 0;
                t = Math.abs(t);
                if (isNaN(t) || t === Infinity) {
                    f = isNaN(t) ? 1 : 0;
                    o = l;
                } else {
                    o = Math.floor(Math.log(t) / Math.LN2);
                    if (t * (s = Math.pow(2, -o)) < 1) {
                        o--;
                        s *= 2;
                    }
                    if (o + c >= 1) {
                        t += h / s;
                    } else {
                        t += h * Math.pow(2, 1 - c);
                    }
                    if (t * s >= 2) {
                        o++;
                        s /= 2;
                    }
                    if (o + c >= l) {
                        f = 0;
                        o = l;
                    } else if (o + c >= 1) {
                        f = (t * s - 1) * Math.pow(2, i);
                        o = o + c;
                    } else {
                        f = t * Math.pow(2, c - 1) * Math.pow(2, i);
                        o = 0;
                    }
                }
                for(; i >= 8; e[r + p] = f & 0xff, p += d, f /= 256, i -= 8){}
                o = (o << i) | f;
                u += i;
                for(; u > 0; e[r + p] = o & 0xff, p += d, o /= 256, u -= 8){}
                e[r + p - d] |= v * 128;
            }
            var toString$1 = {}.toString;
            var isArray = Array.isArray || function(e) {
                return toString$1.call(e) == '[object Array]';
            };
            var INSPECT_MAX_BYTES = 50;
            Buffer$1.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined ? global$1.TYPED_ARRAY_SUPPORT : true;
            function kMaxLength() {
                return Buffer$1.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
            }
            function createBuffer(e, t) {
                if (kMaxLength() < t) {
                    throw new RangeError('Invalid typed array length');
                }
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    e = new Uint8Array(t);
                    e.__proto__ = Buffer$1.prototype;
                } else {
                    if (e === null) {
                        e = new Buffer$1(t);
                    }
                    e.length = t;
                }
                return e;
            }
            function Buffer$1(e, t, r) {
                if (!Buffer$1.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer$1)) {
                    return new Buffer$1(e, t, r);
                }
                if (typeof e === 'number') {
                    if (typeof t === 'string') {
                        throw new Error('If encoding is specified then the first argument must be a string');
                    }
                    return allocUnsafe(this, e);
                }
                return from(this, e, t, r);
            }
            Buffer$1.poolSize = 8192;
            Buffer$1._augment = function(e) {
                e.__proto__ = Buffer$1.prototype;
                return e;
            };
            function from(e, t, r, n) {
                if (typeof t === 'number') {
                    throw new TypeError('"value" argument must not be a number');
                }
                if (typeof ArrayBuffer !== 'undefined' && t instanceof ArrayBuffer) {
                    return fromArrayBuffer(e, t, r, n);
                }
                if (typeof t === 'string') {
                    return fromString(e, t, r);
                }
                return fromObject(e, t);
            }
            Buffer$1.from = function(e, t, r) {
                return from(null, e, t, r);
            };
            if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                Buffer$1.prototype.__proto__ = Uint8Array.prototype;
                Buffer$1.__proto__ = Uint8Array;
            }
            function assertSize(e) {
                if (typeof e !== 'number') {
                    throw new TypeError('"size" argument must be a number');
                } else if (e < 0) {
                    throw new RangeError('"size" argument must not be negative');
                }
            }
            function alloc(e, t, r, n) {
                assertSize(t);
                if (t <= 0) {
                    return createBuffer(e, t);
                }
                if (r !== undefined) {
                    return typeof n === 'string' ? createBuffer(e, t).fill(r, n) : createBuffer(e, t).fill(r);
                }
                return createBuffer(e, t);
            }
            Buffer$1.alloc = function(e, t, r) {
                return alloc(null, e, t, r);
            };
            function allocUnsafe(e, t) {
                assertSize(t);
                e = createBuffer(e, t < 0 ? 0 : checked(t) | 0);
                if (!Buffer$1.TYPED_ARRAY_SUPPORT) {
                    for(var r = 0; r < t; ++r){
                        e[r] = 0;
                    }
                }
                return e;
            }
            Buffer$1.allocUnsafe = function(e) {
                return allocUnsafe(null, e);
            };
            Buffer$1.allocUnsafeSlow = function(e) {
                return allocUnsafe(null, e);
            };
            function fromString(e, t, r) {
                if (typeof r !== 'string' || r === '') {
                    r = 'utf8';
                }
                if (!Buffer$1.isEncoding(r)) {
                    throw new TypeError('"encoding" must be a valid string encoding');
                }
                var n = byteLength$1(t, r) | 0;
                e = createBuffer(e, n);
                var i = e.write(t, r);
                if (i !== n) {
                    e = e.slice(0, i);
                }
                return e;
            }
            function fromArrayLike(e, t) {
                var r = t.length < 0 ? 0 : checked(t.length) | 0;
                e = createBuffer(e, r);
                for(var n = 0; n < r; n += 1){
                    e[n] = t[n] & 255;
                }
                return e;
            }
            function fromArrayBuffer(e, t, r, n) {
                t.byteLength;
                if (r < 0 || t.byteLength < r) {
                    throw new RangeError('\'offset\' is out of bounds');
                }
                if (t.byteLength < r + (n || 0)) {
                    throw new RangeError('\'length\' is out of bounds');
                }
                if (r === undefined && n === undefined) {
                    t = new Uint8Array(t);
                } else if (n === undefined) {
                    t = new Uint8Array(t, r);
                } else {
                    t = new Uint8Array(t, r, n);
                }
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    e = t;
                    e.__proto__ = Buffer$1.prototype;
                } else {
                    e = fromArrayLike(e, t);
                }
                return e;
            }
            function fromObject(e, t) {
                if (internalIsBuffer(t)) {
                    var r = checked(t.length) | 0;
                    e = createBuffer(e, r);
                    if (e.length === 0) {
                        return e;
                    }
                    t.copy(e, 0, 0, r);
                    return e;
                }
                if (t) {
                    if ((typeof ArrayBuffer !== 'undefined' && t.buffer instanceof ArrayBuffer) || 'length' in t) {
                        if (typeof t.length !== 'number' || isnan(t.length)) {
                            return createBuffer(e, 0);
                        }
                        return fromArrayLike(e, t);
                    }
                    if (t.type === 'Buffer' && isArray(t.data)) {
                        return fromArrayLike(e, t.data);
                    }
                }
                throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
            }
            function checked(e) {
                if (e >= kMaxLength()) {
                    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
                }
                return e | 0;
            }
            Buffer$1.isBuffer = isBuffer;
            function internalIsBuffer(e) {
                return !!(e != null && e._isBuffer);
            }
            Buffer$1.compare = function e(t, r) {
                if (!internalIsBuffer(t) || !internalIsBuffer(r)) {
                    throw new TypeError('Arguments must be Buffers');
                }
                if (t === r) return 0;
                var n = t.length;
                var i = r.length;
                for(var a = 0, o = Math.min(n, i); a < o; ++a){
                    if (t[a] !== r[a]) {
                        n = t[a];
                        i = r[a];
                        break;
                    }
                }
                if (n < i) return -1;
                if (i < n) return 1;
                return 0;
            };
            Buffer$1.isEncoding = function e(t) {
                switch(String(t).toLowerCase()){
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
            Buffer$1.concat = function e(t, r) {
                if (!isArray(t)) {
                    throw new TypeError('"list" argument must be an Array of Buffers');
                }
                if (t.length === 0) {
                    return Buffer$1.alloc(0);
                }
                var n;
                if (r === undefined) {
                    r = 0;
                    for(n = 0; n < t.length; ++n){
                        r += t[n].length;
                    }
                }
                var i = Buffer$1.allocUnsafe(r);
                var a = 0;
                for(n = 0; n < t.length; ++n){
                    var o = t[n];
                    if (!internalIsBuffer(o)) {
                        throw new TypeError('"list" argument must be an Array of Buffers');
                    }
                    o.copy(i, a);
                    a += o.length;
                }
                return i;
            };
            function byteLength$1(e, t) {
                if (internalIsBuffer(e)) {
                    return e.length;
                }
                if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) {
                    return e.byteLength;
                }
                if (typeof e !== 'string') {
                    e = '' + e;
                }
                var r = e.length;
                if (r === 0) return 0;
                var n = false;
                for(;;){
                    switch(t){
                        case 'ascii':
                        case 'latin1':
                        case 'binary':
                            return r;
                        case 'utf8':
                        case 'utf-8':
                        case undefined:
                            return utf8ToBytes(e).length;
                        case 'ucs2':
                        case 'ucs-2':
                        case 'utf16le':
                        case 'utf-16le':
                            return r * 2;
                        case 'hex':
                            return r >>> 1;
                        case 'base64':
                            return base64ToBytes(e).length;
                        default:
                            if (n) return utf8ToBytes(e).length;
                            t = ('' + t).toLowerCase();
                            n = true;
                    }
                }
            }
            Buffer$1.byteLength = byteLength$1;
            function slowToString(e, t, r) {
                var n = false;
                if (t === undefined || t < 0) {
                    t = 0;
                }
                if (t > this.length) {
                    return '';
                }
                if (r === undefined || r > this.length) {
                    r = this.length;
                }
                if (r <= 0) {
                    return '';
                }
                r >>>= 0;
                t >>>= 0;
                if (r <= t) {
                    return '';
                }
                if (!e) e = 'utf8';
                while(true){
                    switch(e){
                        case 'hex':
                            return hexSlice(this, t, r);
                        case 'utf8':
                        case 'utf-8':
                            return utf8Slice(this, t, r);
                        case 'ascii':
                            return asciiSlice(this, t, r);
                        case 'latin1':
                        case 'binary':
                            return latin1Slice(this, t, r);
                        case 'base64':
                            return base64Slice(this, t, r);
                        case 'ucs2':
                        case 'ucs-2':
                        case 'utf16le':
                        case 'utf-16le':
                            return utf16leSlice(this, t, r);
                        default:
                            if (n) throw new TypeError('Unknown encoding: ' + e);
                            e = (e + '').toLowerCase();
                            n = true;
                    }
                }
            }
            Buffer$1.prototype._isBuffer = true;
            function swap(e, t, r) {
                var n = e[t];
                e[t] = e[r];
                e[r] = n;
            }
            Buffer$1.prototype.swap16 = function e() {
                var t = this.length;
                if (t % 2 !== 0) {
                    throw new RangeError('Buffer size must be a multiple of 16-bits');
                }
                for(var r = 0; r < t; r += 2){
                    swap(this, r, r + 1);
                }
                return this;
            };
            Buffer$1.prototype.swap32 = function e() {
                var t = this.length;
                if (t % 4 !== 0) {
                    throw new RangeError('Buffer size must be a multiple of 32-bits');
                }
                for(var r = 0; r < t; r += 4){
                    swap(this, r, r + 3);
                    swap(this, r + 1, r + 2);
                }
                return this;
            };
            Buffer$1.prototype.swap64 = function e() {
                var t = this.length;
                if (t % 8 !== 0) {
                    throw new RangeError('Buffer size must be a multiple of 64-bits');
                }
                for(var r = 0; r < t; r += 8){
                    swap(this, r, r + 7);
                    swap(this, r + 1, r + 6);
                    swap(this, r + 2, r + 5);
                    swap(this, r + 3, r + 4);
                }
                return this;
            };
            Buffer$1.prototype.toString = function e() {
                var t = this.length | 0;
                if (t === 0) return '';
                if (arguments.length === 0) return utf8Slice(this, 0, t);
                return slowToString.apply(this, arguments);
            };
            Buffer$1.prototype.equals = function e(t) {
                if (!internalIsBuffer(t)) throw new TypeError('Argument must be a Buffer');
                if (this === t) return true;
                return Buffer$1.compare(this, t) === 0;
            };
            Buffer$1.prototype.inspect = function e() {
                var t = '';
                var r = INSPECT_MAX_BYTES;
                if (this.length > 0) {
                    t = this.toString('hex', 0, r).match(/.{2}/g).join(' ');
                    if (this.length > r) t += ' ... ';
                }
                return '<Buffer ' + t + '>';
            };
            Buffer$1.prototype.compare = function e(t, r, n, i, a) {
                if (!internalIsBuffer(t)) {
                    throw new TypeError('Argument must be a Buffer');
                }
                if (r === undefined) {
                    r = 0;
                }
                if (n === undefined) {
                    n = t ? t.length : 0;
                }
                if (i === undefined) {
                    i = 0;
                }
                if (a === undefined) {
                    a = this.length;
                }
                if (r < 0 || n > t.length || i < 0 || a > this.length) {
                    throw new RangeError('out of range index');
                }
                if (i >= a && r >= n) {
                    return 0;
                }
                if (i >= a) {
                    return -1;
                }
                if (r >= n) {
                    return 1;
                }
                r >>>= 0;
                n >>>= 0;
                i >>>= 0;
                a >>>= 0;
                if (this === t) return 0;
                var o = a - i;
                var f = n - r;
                var s = Math.min(o, f);
                var u = this.slice(i, a);
                var l = t.slice(r, n);
                for(var c = 0; c < s; ++c){
                    if (u[c] !== l[c]) {
                        o = u[c];
                        f = l[c];
                        break;
                    }
                }
                if (o < f) return -1;
                if (f < o) return 1;
                return 0;
            };
            function bidirectionalIndexOf(e, t, r, n, i) {
                if (e.length === 0) return -1;
                if (typeof r === 'string') {
                    n = r;
                    r = 0;
                } else if (r > 0x7fffffff) {
                    r = 0x7fffffff;
                } else if (r < -0x80000000) {
                    r = -0x80000000;
                }
                r = +r;
                if (isNaN(r)) {
                    r = i ? 0 : (e.length - 1);
                }
                if (r < 0) r = e.length + r;
                if (r >= e.length) {
                    if (i) return -1;
                    else r = e.length - 1;
                } else if (r < 0) {
                    if (i) r = 0;
                    else return -1;
                }
                if (typeof t === 'string') {
                    t = Buffer$1.from(t, n);
                }
                if (internalIsBuffer(t)) {
                    if (t.length === 0) {
                        return -1;
                    }
                    return arrayIndexOf(e, t, r, n, i);
                } else if (typeof t === 'number') {
                    t = t & 0xFF;
                    if (Buffer$1.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === 'function') {
                        if (i) {
                            return Uint8Array.prototype.indexOf.call(e, t, r);
                        } else {
                            return Uint8Array.prototype.lastIndexOf.call(e, t, r);
                        }
                    }
                    return arrayIndexOf(e, [
                        t
                    ], r, n, i);
                }
                throw new TypeError('val must be string, number or Buffer');
            }
            function arrayIndexOf(e, t, r, n, i) {
                var a = 1;
                var o = e.length;
                var f = t.length;
                if (n !== undefined) {
                    n = String(n).toLowerCase();
                    if (n === 'ucs2' || n === 'ucs-2' || n === 'utf16le' || n === 'utf-16le') {
                        if (e.length < 2 || t.length < 2) {
                            return -1;
                        }
                        a = 2;
                        o /= 2;
                        f /= 2;
                        r /= 2;
                    }
                }
                function s(e, t) {
                    if (a === 1) {
                        return e[t];
                    } else {
                        return e.readUInt16BE(t * a);
                    }
                }
                var u;
                if (i) {
                    var l = -1;
                    for(u = r; u < o; u++){
                        if (s(e, u) === s(t, l === -1 ? 0 : u - l)) {
                            if (l === -1) l = u;
                            if (u - l + 1 === f) return l * a;
                        } else {
                            if (l !== -1) u -= u - l;
                            l = -1;
                        }
                    }
                } else {
                    if (r + f > o) r = o - f;
                    for(u = r; u >= 0; u--){
                        var c = true;
                        for(var h = 0; h < f; h++){
                            if (s(e, u + h) !== s(t, h)) {
                                c = false;
                                break;
                            }
                        }
                        if (c) return u;
                    }
                }
                return -1;
            }
            Buffer$1.prototype.includes = function e(t, r, n) {
                return this.indexOf(t, r, n) !== -1;
            };
            Buffer$1.prototype.indexOf = function e(t, r, n) {
                return bidirectionalIndexOf(this, t, r, n, true);
            };
            Buffer$1.prototype.lastIndexOf = function e(t, r, n) {
                return bidirectionalIndexOf(this, t, r, n, false);
            };
            function hexWrite(e, t, r, n) {
                r = Number(r) || 0;
                var i = e.length - r;
                if (!n) {
                    n = i;
                } else {
                    n = Number(n);
                    if (n > i) {
                        n = i;
                    }
                }
                var a = t.length;
                if (a % 2 !== 0) throw new TypeError('Invalid hex string');
                if (n > a / 2) {
                    n = a / 2;
                }
                for(var o = 0; o < n; ++o){
                    var f = parseInt(t.substr(o * 2, 2), 16);
                    if (isNaN(f)) return o;
                    e[r + o] = f;
                }
                return o;
            }
            function utf8Write(e, t, r, n) {
                return blitBuffer(utf8ToBytes(t, e.length - r), e, r, n);
            }
            function asciiWrite(e, t, r, n) {
                return blitBuffer(asciiToBytes(t), e, r, n);
            }
            function latin1Write(e, t, r, n) {
                return asciiWrite(e, t, r, n);
            }
            function base64Write(e, t, r, n) {
                return blitBuffer(base64ToBytes(t), e, r, n);
            }
            function ucs2Write(e, t, r, n) {
                return blitBuffer(utf16leToBytes(t, e.length - r), e, r, n);
            }
            Buffer$1.prototype.write = function e(t, r, n, i) {
                if (r === undefined) {
                    i = 'utf8';
                    n = this.length;
                    r = 0;
                } else if (n === undefined && typeof r === 'string') {
                    i = r;
                    n = this.length;
                    r = 0;
                } else if (isFinite(r)) {
                    r = r | 0;
                    if (isFinite(n)) {
                        n = n | 0;
                        if (i === undefined) i = 'utf8';
                    } else {
                        i = n;
                        n = undefined;
                    }
                } else {
                    throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
                }
                var a = this.length - r;
                if (n === undefined || n > a) n = a;
                if ((t.length > 0 && (n < 0 || r < 0)) || r > this.length) {
                    throw new RangeError('Attempt to write outside buffer bounds');
                }
                if (!i) i = 'utf8';
                var o = false;
                for(;;){
                    switch(i){
                        case 'hex':
                            return hexWrite(this, t, r, n);
                        case 'utf8':
                        case 'utf-8':
                            return utf8Write(this, t, r, n);
                        case 'ascii':
                            return asciiWrite(this, t, r, n);
                        case 'latin1':
                        case 'binary':
                            return latin1Write(this, t, r, n);
                        case 'base64':
                            return base64Write(this, t, r, n);
                        case 'ucs2':
                        case 'ucs-2':
                        case 'utf16le':
                        case 'utf-16le':
                            return ucs2Write(this, t, r, n);
                        default:
                            if (o) throw new TypeError('Unknown encoding: ' + i);
                            i = ('' + i).toLowerCase();
                            o = true;
                    }
                }
            };
            Buffer$1.prototype.toJSON = function e() {
                return {
                    type: 'Buffer',
                    data: Array.prototype.slice.call(this._arr || this, 0)
                };
            };
            function base64Slice(e, t, r) {
                if (t === 0 && r === e.length) {
                    return fromByteArray$1(e);
                } else {
                    return fromByteArray$1(e.slice(t, r));
                }
            }
            function utf8Slice(e, t, r) {
                r = Math.min(e.length, r);
                var n = [];
                var i = t;
                while(i < r){
                    var a = e[i];
                    var o = null;
                    var f = (a > 0xEF) ? 4 : (a > 0xDF) ? 3 : (a > 0xBF) ? 2 : 1;
                    if (i + f <= r) {
                        var s, u, l, c;
                        switch(f){
                            case 1:
                                if (a < 0x80) {
                                    o = a;
                                }
                                break;
                            case 2:
                                s = e[i + 1];
                                if ((s & 0xC0) === 0x80) {
                                    c = (a & 0x1F) << 0x6 | (s & 0x3F);
                                    if (c > 0x7F) {
                                        o = c;
                                    }
                                }
                                break;
                            case 3:
                                s = e[i + 1];
                                u = e[i + 2];
                                if ((s & 0xC0) === 0x80 && (u & 0xC0) === 0x80) {
                                    c = (a & 0xF) << 0xC | (s & 0x3F) << 0x6 | (u & 0x3F);
                                    if (c > 0x7FF && (c < 0xD800 || c > 0xDFFF)) {
                                        o = c;
                                    }
                                }
                                break;
                            case 4:
                                s = e[i + 1];
                                u = e[i + 2];
                                l = e[i + 3];
                                if ((s & 0xC0) === 0x80 && (u & 0xC0) === 0x80 && (l & 0xC0) === 0x80) {
                                    c = (a & 0xF) << 0x12 | (s & 0x3F) << 0xC | (u & 0x3F) << 0x6 | (l & 0x3F);
                                    if (c > 0xFFFF && c < 0x110000) {
                                        o = c;
                                    }
                                }
                        }
                    }
                    if (o === null) {
                        o = 0xFFFD;
                        f = 1;
                    } else if (o > 0xFFFF) {
                        o -= 0x10000;
                        n.push(o >>> 10 & 0x3FF | 0xD800);
                        o = 0xDC00 | o & 0x3FF;
                    }
                    n.push(o);
                    i += f;
                }
                return decodeCodePointsArray(n);
            }
            var MAX_ARGUMENTS_LENGTH = 0x1000;
            function decodeCodePointsArray(e) {
                var t = e.length;
                if (t <= MAX_ARGUMENTS_LENGTH) {
                    return String.fromCharCode.apply(String, e);
                }
                var r = '';
                var n = 0;
                while(n < t){
                    r += String.fromCharCode.apply(String, e.slice(n, n += MAX_ARGUMENTS_LENGTH));
                }
                return r;
            }
            function asciiSlice(e, t, r) {
                var n = '';
                r = Math.min(e.length, r);
                for(var i = t; i < r; ++i){
                    n += String.fromCharCode(e[i] & 0x7F);
                }
                return n;
            }
            function latin1Slice(e, t, r) {
                var n = '';
                r = Math.min(e.length, r);
                for(var i = t; i < r; ++i){
                    n += String.fromCharCode(e[i]);
                }
                return n;
            }
            function hexSlice(e, t, r) {
                var n = e.length;
                if (!t || t < 0) t = 0;
                if (!r || r < 0 || r > n) r = n;
                var i = '';
                for(var a = t; a < r; ++a){
                    i += toHex(e[a]);
                }
                return i;
            }
            function utf16leSlice(e, t, r) {
                var n = e.slice(t, r);
                var i = '';
                for(var a = 0; a < n.length; a += 2){
                    i += String.fromCharCode(n[a] + n[a + 1] * 256);
                }
                return i;
            }
            Buffer$1.prototype.slice = function e(t, r) {
                var n = this.length;
                t = ~~t;
                r = r === undefined ? n : ~~r;
                if (t < 0) {
                    t += n;
                    if (t < 0) t = 0;
                } else if (t > n) {
                    t = n;
                }
                if (r < 0) {
                    r += n;
                    if (r < 0) r = 0;
                } else if (r > n) {
                    r = n;
                }
                if (r < t) r = t;
                var i;
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    i = this.subarray(t, r);
                    i.__proto__ = Buffer$1.prototype;
                } else {
                    var a = r - t;
                    i = new Buffer$1(a, undefined);
                    for(var o = 0; o < a; ++o){
                        i[o] = this[o + t];
                    }
                }
                return i;
            };
            function checkOffset(e, t, r) {
                if ((e % 1) !== 0 || e < 0) throw new RangeError('offset is not uint');
                if (e + t > r) throw new RangeError('Trying to access beyond buffer length');
            }
            Buffer$1.prototype.readUIntLE = function e(t, r, n) {
                t = t | 0;
                r = r | 0;
                if (!n) checkOffset(t, r, this.length);
                var i = this[t];
                var a = 1;
                var o = 0;
                while(++o < r && (a *= 0x100)){
                    i += this[t + o] * a;
                }
                return i;
            };
            Buffer$1.prototype.readUIntBE = function e(t, r, n) {
                t = t | 0;
                r = r | 0;
                if (!n) {
                    checkOffset(t, r, this.length);
                }
                var i = this[t + --r];
                var a = 1;
                while(r > 0 && (a *= 0x100)){
                    i += this[t + --r] * a;
                }
                return i;
            };
            Buffer$1.prototype.readUInt8 = function e(t, r) {
                if (!r) checkOffset(t, 1, this.length);
                return this[t];
            };
            Buffer$1.prototype.readUInt16LE = function e(t, r) {
                if (!r) checkOffset(t, 2, this.length);
                return this[t] | (this[t + 1] << 8);
            };
            Buffer$1.prototype.readUInt16BE = function e(t, r) {
                if (!r) checkOffset(t, 2, this.length);
                return (this[t] << 8) | this[t + 1];
            };
            Buffer$1.prototype.readUInt32LE = function e(t, r) {
                if (!r) checkOffset(t, 4, this.length);
                return ((this[t]) | (this[t + 1] << 8) | (this[t + 2] << 16)) + (this[t + 3] * 0x1000000);
            };
            Buffer$1.prototype.readUInt32BE = function e(t, r) {
                if (!r) checkOffset(t, 4, this.length);
                return (this[t] * 0x1000000) + ((this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3]);
            };
            Buffer$1.prototype.readIntLE = function e(t, r, n) {
                t = t | 0;
                r = r | 0;
                if (!n) checkOffset(t, r, this.length);
                var i = this[t];
                var a = 1;
                var o = 0;
                while(++o < r && (a *= 0x100)){
                    i += this[t + o] * a;
                }
                a *= 0x80;
                if (i >= a) i -= Math.pow(2, 8 * r);
                return i;
            };
            Buffer$1.prototype.readIntBE = function e(t, r, n) {
                t = t | 0;
                r = r | 0;
                if (!n) checkOffset(t, r, this.length);
                var i = r;
                var a = 1;
                var o = this[t + --i];
                while(i > 0 && (a *= 0x100)){
                    o += this[t + --i] * a;
                }
                a *= 0x80;
                if (o >= a) o -= Math.pow(2, 8 * r);
                return o;
            };
            Buffer$1.prototype.readInt8 = function e(t, r) {
                if (!r) checkOffset(t, 1, this.length);
                if (!(this[t] & 0x80)) return (this[t]);
                return ((0xff - this[t] + 1) * -1);
            };
            Buffer$1.prototype.readInt16LE = function e(t, r) {
                if (!r) checkOffset(t, 2, this.length);
                var n = this[t] | (this[t + 1] << 8);
                return (n & 0x8000) ? n | 0xFFFF0000 : n;
            };
            Buffer$1.prototype.readInt16BE = function e(t, r) {
                if (!r) checkOffset(t, 2, this.length);
                var n = this[t + 1] | (this[t] << 8);
                return (n & 0x8000) ? n | 0xFFFF0000 : n;
            };
            Buffer$1.prototype.readInt32LE = function e(t, r) {
                if (!r) checkOffset(t, 4, this.length);
                return (this[t]) | (this[t + 1] << 8) | (this[t + 2] << 16) | (this[t + 3] << 24);
            };
            Buffer$1.prototype.readInt32BE = function e(t, r) {
                if (!r) checkOffset(t, 4, this.length);
                return (this[t] << 24) | (this[t + 1] << 16) | (this[t + 2] << 8) | (this[t + 3]);
            };
            Buffer$1.prototype.readFloatLE = function e(t, r) {
                if (!r) checkOffset(t, 4, this.length);
                return read(this, t, true, 23, 4);
            };
            Buffer$1.prototype.readFloatBE = function e(t, r) {
                if (!r) checkOffset(t, 4, this.length);
                return read(this, t, false, 23, 4);
            };
            Buffer$1.prototype.readDoubleLE = function e(t, r) {
                if (!r) checkOffset(t, 8, this.length);
                return read(this, t, true, 52, 8);
            };
            Buffer$1.prototype.readDoubleBE = function e(t, r) {
                if (!r) checkOffset(t, 8, this.length);
                return read(this, t, false, 52, 8);
            };
            function checkInt(e, t, r, n, i, a) {
                if (!internalIsBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
                if (t > i || t < a) throw new RangeError('"value" argument is out of bounds');
                if (r + n > e.length) throw new RangeError('Index out of range');
            }
            Buffer$1.prototype.writeUIntLE = function e(t, r, n, i) {
                t = +t;
                r = r | 0;
                n = n | 0;
                if (!i) {
                    var a = Math.pow(2, 8 * n) - 1;
                    checkInt(this, t, r, n, a, 0);
                }
                var o = 1;
                var f = 0;
                this[r] = t & 0xFF;
                while(++f < n && (o *= 0x100)){
                    this[r + f] = (t / o) & 0xFF;
                }
                return r + n;
            };
            Buffer$1.prototype.writeUIntBE = function e(t, r, n, i) {
                t = +t;
                r = r | 0;
                n = n | 0;
                if (!i) {
                    var a = Math.pow(2, 8 * n) - 1;
                    checkInt(this, t, r, n, a, 0);
                }
                var o = n - 1;
                var f = 1;
                this[r + o] = t & 0xFF;
                while(--o >= 0 && (f *= 0x100)){
                    this[r + o] = (t / f) & 0xFF;
                }
                return r + n;
            };
            Buffer$1.prototype.writeUInt8 = function e(t, r, n) {
                t = +t;
                r = r | 0;
                if (!n) checkInt(this, t, r, 1, 0xff, 0);
                if (!Buffer$1.TYPED_ARRAY_SUPPORT) t = Math.floor(t);
                this[r] = (t & 0xff);
                return r + 1;
            };
            function objectWriteUInt16(e, t, r, n) {
                if (t < 0) t = 0xffff + t + 1;
                for(var i = 0, a = Math.min(e.length - r, 2); i < a; ++i){
                    e[r + i] = (t & (0xff << (8 * (n ? i : 1 - i)))) >>> (n ? i : 1 - i) * 8;
                }
            }
            Buffer$1.prototype.writeUInt16LE = function e(t, r, n) {
                t = +t;
                r = r | 0;
                if (!n) checkInt(this, t, r, 2, 0xffff, 0);
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    this[r] = (t & 0xff);
                    this[r + 1] = (t >>> 8);
                } else {
                    objectWriteUInt16(this, t, r, true);
                }
                return r + 2;
            };
            Buffer$1.prototype.writeUInt16BE = function e(t, r, n) {
                t = +t;
                r = r | 0;
                if (!n) checkInt(this, t, r, 2, 0xffff, 0);
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    this[r] = (t >>> 8);
                    this[r + 1] = (t & 0xff);
                } else {
                    objectWriteUInt16(this, t, r, false);
                }
                return r + 2;
            };
            function objectWriteUInt32(e, t, r, n) {
                if (t < 0) t = 0xffffffff + t + 1;
                for(var i = 0, a = Math.min(e.length - r, 4); i < a; ++i){
                    e[r + i] = (t >>> (n ? i : 3 - i) * 8) & 0xff;
                }
            }
            Buffer$1.prototype.writeUInt32LE = function e(t, r, n) {
                t = +t;
                r = r | 0;
                if (!n) checkInt(this, t, r, 4, 0xffffffff, 0);
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    this[r + 3] = (t >>> 24);
                    this[r + 2] = (t >>> 16);
                    this[r + 1] = (t >>> 8);
                    this[r] = (t & 0xff);
                } else {
                    objectWriteUInt32(this, t, r, true);
                }
                return r + 4;
            };
            Buffer$1.prototype.writeUInt32BE = function e(t, r, n) {
                t = +t;
                r = r | 0;
                if (!n) checkInt(this, t, r, 4, 0xffffffff, 0);
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    this[r] = (t >>> 24);
                    this[r + 1] = (t >>> 16);
                    this[r + 2] = (t >>> 8);
                    this[r + 3] = (t & 0xff);
                } else {
                    objectWriteUInt32(this, t, r, false);
                }
                return r + 4;
            };
            Buffer$1.prototype.writeIntLE = function e(t, r, n, i) {
                t = +t;
                r = r | 0;
                if (!i) {
                    var a = Math.pow(2, 8 * n - 1);
                    checkInt(this, t, r, n, a - 1, -a);
                }
                var o = 0;
                var f = 1;
                var s = 0;
                this[r] = t & 0xFF;
                while(++o < n && (f *= 0x100)){
                    if (t < 0 && s === 0 && this[r + o - 1] !== 0) {
                        s = 1;
                    }
                    this[r + o] = ((t / f) >> 0) - s & 0xFF;
                }
                return r + n;
            };
            Buffer$1.prototype.writeIntBE = function e(t, r, n, i) {
                t = +t;
                r = r | 0;
                if (!i) {
                    var a = Math.pow(2, 8 * n - 1);
                    checkInt(this, t, r, n, a - 1, -a);
                }
                var o = n - 1;
                var f = 1;
                var s = 0;
                this[r + o] = t & 0xFF;
                while(--o >= 0 && (f *= 0x100)){
                    if (t < 0 && s === 0 && this[r + o + 1] !== 0) {
                        s = 1;
                    }
                    this[r + o] = ((t / f) >> 0) - s & 0xFF;
                }
                return r + n;
            };
            Buffer$1.prototype.writeInt8 = function e(t, r, n) {
                t = +t;
                r = r | 0;
                if (!n) checkInt(this, t, r, 1, 0x7f, -0x80);
                if (!Buffer$1.TYPED_ARRAY_SUPPORT) t = Math.floor(t);
                if (t < 0) t = 0xff + t + 1;
                this[r] = (t & 0xff);
                return r + 1;
            };
            Buffer$1.prototype.writeInt16LE = function e(t, r, n) {
                t = +t;
                r = r | 0;
                if (!n) checkInt(this, t, r, 2, 0x7fff, -0x8000);
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    this[r] = (t & 0xff);
                    this[r + 1] = (t >>> 8);
                } else {
                    objectWriteUInt16(this, t, r, true);
                }
                return r + 2;
            };
            Buffer$1.prototype.writeInt16BE = function e(t, r, n) {
                t = +t;
                r = r | 0;
                if (!n) checkInt(this, t, r, 2, 0x7fff, -0x8000);
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    this[r] = (t >>> 8);
                    this[r + 1] = (t & 0xff);
                } else {
                    objectWriteUInt16(this, t, r, false);
                }
                return r + 2;
            };
            Buffer$1.prototype.writeInt32LE = function e(t, r, n) {
                t = +t;
                r = r | 0;
                if (!n) checkInt(this, t, r, 4, 0x7fffffff, -0x80000000);
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    this[r] = (t & 0xff);
                    this[r + 1] = (t >>> 8);
                    this[r + 2] = (t >>> 16);
                    this[r + 3] = (t >>> 24);
                } else {
                    objectWriteUInt32(this, t, r, true);
                }
                return r + 4;
            };
            Buffer$1.prototype.writeInt32BE = function e(t, r, n) {
                t = +t;
                r = r | 0;
                if (!n) checkInt(this, t, r, 4, 0x7fffffff, -0x80000000);
                if (t < 0) t = 0xffffffff + t + 1;
                if (Buffer$1.TYPED_ARRAY_SUPPORT) {
                    this[r] = (t >>> 24);
                    this[r + 1] = (t >>> 16);
                    this[r + 2] = (t >>> 8);
                    this[r + 3] = (t & 0xff);
                } else {
                    objectWriteUInt32(this, t, r, false);
                }
                return r + 4;
            };
            function checkIEEE754(e, t, r, n, i, a) {
                if (r + n > e.length) throw new RangeError('Index out of range');
                if (r < 0) throw new RangeError('Index out of range');
            }
            function writeFloat(e, t, r, n, i) {
                if (!i) {
                    checkIEEE754(e, t, r, 4);
                }
                write(e, t, r, n, 23, 4);
                return r + 4;
            }
            Buffer$1.prototype.writeFloatLE = function e(t, r, n) {
                return writeFloat(this, t, r, true, n);
            };
            Buffer$1.prototype.writeFloatBE = function e(t, r, n) {
                return writeFloat(this, t, r, false, n);
            };
            function writeDouble(e, t, r, n, i) {
                if (!i) {
                    checkIEEE754(e, t, r, 8);
                }
                write(e, t, r, n, 52, 8);
                return r + 8;
            }
            Buffer$1.prototype.writeDoubleLE = function e(t, r, n) {
                return writeDouble(this, t, r, true, n);
            };
            Buffer$1.prototype.writeDoubleBE = function e(t, r, n) {
                return writeDouble(this, t, r, false, n);
            };
            Buffer$1.prototype.copy = function e(t, r, n, i) {
                if (!n) n = 0;
                if (!i && i !== 0) i = this.length;
                if (r >= t.length) r = t.length;
                if (!r) r = 0;
                if (i > 0 && i < n) i = n;
                if (i === n) return 0;
                if (t.length === 0 || this.length === 0) return 0;
                if (r < 0) {
                    throw new RangeError('targetStart out of bounds');
                }
                if (n < 0 || n >= this.length) throw new RangeError('sourceStart out of bounds');
                if (i < 0) throw new RangeError('sourceEnd out of bounds');
                if (i > this.length) i = this.length;
                if (t.length - r < i - n) {
                    i = t.length - r + n;
                }
                var a = i - n;
                var o;
                if (this === t && n < r && r < i) {
                    for(o = a - 1; o >= 0; --o){
                        t[o + r] = this[o + n];
                    }
                } else if (a < 1000 || !Buffer$1.TYPED_ARRAY_SUPPORT) {
                    for(o = 0; o < a; ++o){
                        t[o + r] = this[o + n];
                    }
                } else {
                    Uint8Array.prototype.set.call(t, this.subarray(n, n + a), r);
                }
                return a;
            };
            Buffer$1.prototype.fill = function e(t, r, n, i) {
                if (typeof t === 'string') {
                    if (typeof r === 'string') {
                        i = r;
                        r = 0;
                        n = this.length;
                    } else if (typeof n === 'string') {
                        i = n;
                        n = this.length;
                    }
                    if (t.length === 1) {
                        var a = t.charCodeAt(0);
                        if (a < 256) {
                            t = a;
                        }
                    }
                    if (i !== undefined && typeof i !== 'string') {
                        throw new TypeError('encoding must be a string');
                    }
                    if (typeof i === 'string' && !Buffer$1.isEncoding(i)) {
                        throw new TypeError('Unknown encoding: ' + i);
                    }
                } else if (typeof t === 'number') {
                    t = t & 255;
                }
                if (r < 0 || this.length < r || this.length < n) {
                    throw new RangeError('Out of range index');
                }
                if (n <= r) {
                    return this;
                }
                r = r >>> 0;
                n = n === undefined ? this.length : n >>> 0;
                if (!t) t = 0;
                var o;
                if (typeof t === 'number') {
                    for(o = r; o < n; ++o){
                        this[o] = t;
                    }
                } else {
                    var f = internalIsBuffer(t) ? t : utf8ToBytes(new Buffer$1(t, i).toString());
                    var s = f.length;
                    for(o = 0; o < n - r; ++o){
                        this[o + r] = f[o % s];
                    }
                }
                return this;
            };
            var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
            function base64clean(e) {
                e = stringtrim(e).replace(INVALID_BASE64_RE, '');
                if (e.length < 2) return '';
                while(e.length % 4 !== 0){
                    e = e + '=';
                }
                return e;
            }
            function stringtrim(e) {
                if (e.trim) return e.trim();
                return e.replace(/^\s+|\s+$/g, '');
            }
            function toHex(e) {
                if (e < 16) return '0' + e.toString(16);
                return e.toString(16);
            }
            function utf8ToBytes(e, t) {
                t = t || Infinity;
                var r;
                var n = e.length;
                var i = null;
                var a = [];
                for(var o = 0; o < n; ++o){
                    r = e.charCodeAt(o);
                    if (r > 0xD7FF && r < 0xE000) {
                        if (!i) {
                            if (r > 0xDBFF) {
                                if ((t -= 3) > -1) a.push(0xEF, 0xBF, 0xBD);
                                continue;
                            } else if (o + 1 === n) {
                                if ((t -= 3) > -1) a.push(0xEF, 0xBF, 0xBD);
                                continue;
                            }
                            i = r;
                            continue;
                        }
                        if (r < 0xDC00) {
                            if ((t -= 3) > -1) a.push(0xEF, 0xBF, 0xBD);
                            i = r;
                            continue;
                        }
                        r = (i - 0xD800 << 10 | r - 0xDC00) + 0x10000;
                    } else if (i) {
                        if ((t -= 3) > -1) a.push(0xEF, 0xBF, 0xBD);
                    }
                    i = null;
                    if (r < 0x80) {
                        if ((t -= 1) < 0) break;
                        a.push(r);
                    } else if (r < 0x800) {
                        if ((t -= 2) < 0) break;
                        a.push(r >> 0x6 | 0xC0, r & 0x3F | 0x80);
                    } else if (r < 0x10000) {
                        if ((t -= 3) < 0) break;
                        a.push(r >> 0xC | 0xE0, r >> 0x6 & 0x3F | 0x80, r & 0x3F | 0x80);
                    } else if (r < 0x110000) {
                        if ((t -= 4) < 0) break;
                        a.push(r >> 0x12 | 0xF0, r >> 0xC & 0x3F | 0x80, r >> 0x6 & 0x3F | 0x80, r & 0x3F | 0x80);
                    } else {
                        throw new Error('Invalid code point');
                    }
                }
                return a;
            }
            function asciiToBytes(e) {
                var t = [];
                for(var r = 0; r < e.length; ++r){
                    t.push(e.charCodeAt(r) & 0xFF);
                }
                return t;
            }
            function utf16leToBytes(e, t) {
                var r, n, i;
                var a = [];
                for(var o = 0; o < e.length; ++o){
                    if ((t -= 2) < 0) break;
                    r = e.charCodeAt(o);
                    n = r >> 8;
                    i = r % 256;
                    a.push(i);
                    a.push(n);
                }
                return a;
            }
            function base64ToBytes(e) {
                return toByteArray$1(base64clean(e));
            }
            function blitBuffer(e, t, r, n) {
                for(var i = 0; i < n; ++i){
                    if ((i + r >= t.length) || (i >= e.length)) break;
                    t[i + r] = e[i];
                }
                return i;
            }
            function isnan(e) {
                return e !== e;
            }
            function isBuffer(e) {
                return e != null && (!!e._isBuffer || isFastBuffer(e) || isSlowBuffer(e));
            }
            function isFastBuffer(e) {
                return !!e.constructor && typeof e.constructor.isBuffer === 'function' && e.constructor.isBuffer(e);
            }
            function isSlowBuffer(e) {
                return typeof e.readFloatLE === 'function' && typeof e.slice === 'function' && isFastBuffer(e.slice(0, 0));
            }
            function defaultSetTimout$1() {
                throw new Error('setTimeout has not been defined');
            }
            function defaultClearTimeout$1() {
                throw new Error('clearTimeout has not been defined');
            }
            var cachedSetTimeout$1 = defaultSetTimout$1;
            var cachedClearTimeout$1 = defaultClearTimeout$1;
            if (typeof global$1.setTimeout === 'function') {
                cachedSetTimeout$1 = setTimeout;
            }
            if (typeof global$1.clearTimeout === 'function') {
                cachedClearTimeout$1 = clearTimeout;
            }
            function runTimeout$1(e) {
                if (cachedSetTimeout$1 === setTimeout) {
                    return setTimeout(e, 0);
                }
                if ((cachedSetTimeout$1 === defaultSetTimout$1 || !cachedSetTimeout$1) && setTimeout) {
                    cachedSetTimeout$1 = setTimeout;
                    return setTimeout(e, 0);
                }
                try {
                    return cachedSetTimeout$1(e, 0);
                } catch (r) {
                    try {
                        return cachedSetTimeout$1.call(null, e, 0);
                    } catch (t) {
                        return cachedSetTimeout$1.call(this, e, 0);
                    }
                }
            }
            function runClearTimeout$1(e) {
                if (cachedClearTimeout$1 === clearTimeout) {
                    return clearTimeout(e);
                }
                if ((cachedClearTimeout$1 === defaultClearTimeout$1 || !cachedClearTimeout$1) && clearTimeout) {
                    cachedClearTimeout$1 = clearTimeout;
                    return clearTimeout(e);
                }
                try {
                    return cachedClearTimeout$1(e);
                } catch (r) {
                    try {
                        return cachedClearTimeout$1.call(null, e);
                    } catch (t) {
                        return cachedClearTimeout$1.call(this, e);
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
                if (currentQueue$1.length) {
                    queue$1 = currentQueue$1.concat(queue$1);
                } else {
                    queueIndex$1 = -1;
                }
                if (queue$1.length) {
                    drainQueue$1();
                }
            }
            function drainQueue$1() {
                if (draining$1) {
                    return;
                }
                var e = runTimeout$1(cleanUpNextTick$1);
                draining$1 = true;
                var t = queue$1.length;
                while(t){
                    currentQueue$1 = queue$1;
                    queue$1 = [];
                    while(++queueIndex$1 < t){
                        if (currentQueue$1) {
                            currentQueue$1[queueIndex$1].run();
                        }
                    }
                    queueIndex$1 = -1;
                    t = queue$1.length;
                }
                currentQueue$1 = null;
                draining$1 = false;
                runClearTimeout$1(e);
            }
            function nextTick(e) {
                var t = new Array(arguments.length - 1);
                if (arguments.length > 1) {
                    for(var r = 1; r < arguments.length; r++){
                        t[r - 1] = arguments[r];
                    }
                }
                queue$1.push(new Item$1(e, t));
                if (queue$1.length === 1 && !draining$1) {
                    runTimeout$1(drainQueue$1);
                }
            }
            function Item$1(e, t) {
                this.fun = e;
                this.array = t;
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
            function binding$1(e) {
                throw new Error('process.binding is not supported');
            }
            function cwd() {
                return '/';
            }
            function chdir(e) {
                throw new Error('process.chdir is not supported');
            }
            function umask() {
                return 0;
            }
            var performance = global$1.performance || {};
            var performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function() {
                return (new Date()).getTime();
            };
            function hrtime(e) {
                var t = performanceNow.call(performance) * 1e-3;
                var r = Math.floor(t);
                var n = Math.floor((t % 1) * 1e9);
                if (e) {
                    r = r - e[0];
                    n = n - e[1];
                    if (n < 0) {
                        r--;
                        n += 1e9;
                    }
                }
                return [
                    r,
                    n
                ];
            }
            var startTime = new Date();
            function uptime() {
                var e = new Date();
                var t = e - startTime;
                return t / 1000;
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
            var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : typeof self !== 'undefined' ? self : {};
            function getAugmentedNamespace(e) {
                if (e.__esModule) return e;
                var t = Object.defineProperty({}, '__esModule', {
                    value: true
                });
                Object.keys(e).forEach(function(r) {
                    var n = Object.getOwnPropertyDescriptor(e, r);
                    Object.defineProperty(t, r, n.get ? n : {
                        enumerable: true,
                        get: function() {
                            return e[r];
                        }
                    });
                });
                return t;
            }
            var lib = {};
            var buffer = {};
            var base64Js = {};
            base64Js.byteLength = byteLength;
            base64Js.toByteArray = toByteArray;
            base64Js.fromByteArray = fromByteArray;
            var lookup = [];
            var revLookup = [];
            var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
            var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            for(var i = 0, len = code.length; i < len; ++i){
                lookup[i] = code[i];
                revLookup[code.charCodeAt(i)] = i;
            }
            revLookup['-'.charCodeAt(0)] = 62;
            revLookup['_'.charCodeAt(0)] = 63;
            function getLens(e) {
                var t = e.length;
                if (t % 4 > 0) {
                    throw new Error('Invalid string. Length must be a multiple of 4');
                }
                var r = e.indexOf('=');
                if (r === -1) r = t;
                var n = r === t ? 0 : 4 - r % 4;
                return [
                    r,
                    n
                ];
            }
            function byteLength(e) {
                var t = getLens(e);
                var r = t[0];
                var n = t[1];
                return (r + n) * 3 / 4 - n;
            }
            function _byteLength(e, t, r) {
                return (t + r) * 3 / 4 - r;
            }
            function toByteArray(e) {
                var t;
                var r = getLens(e);
                var n = r[0];
                var i = r[1];
                var a = new Arr(_byteLength(e, n, i));
                var o = 0;
                var f = i > 0 ? n - 4 : n;
                var s;
                for(s = 0; s < f; s += 4){
                    t = revLookup[e.charCodeAt(s)] << 18 | revLookup[e.charCodeAt(s + 1)] << 12 | revLookup[e.charCodeAt(s + 2)] << 6 | revLookup[e.charCodeAt(s + 3)];
                    a[o++] = t >> 16 & 0xFF;
                    a[o++] = t >> 8 & 0xFF;
                    a[o++] = t & 0xFF;
                }
                if (i === 2) {
                    t = revLookup[e.charCodeAt(s)] << 2 | revLookup[e.charCodeAt(s + 1)] >> 4;
                    a[o++] = t & 0xFF;
                }
                if (i === 1) {
                    t = revLookup[e.charCodeAt(s)] << 10 | revLookup[e.charCodeAt(s + 1)] << 4 | revLookup[e.charCodeAt(s + 2)] >> 2;
                    a[o++] = t >> 8 & 0xFF;
                    a[o++] = t & 0xFF;
                }
                return a;
            }
            function tripletToBase64(e) {
                return lookup[e >> 18 & 0x3F] + lookup[e >> 12 & 0x3F] + lookup[e >> 6 & 0x3F] + lookup[e & 0x3F];
            }
            function encodeChunk(e, t, r) {
                var n;
                var i = [];
                for(var a = t; a < r; a += 3){
                    n = (e[a] << 16 & 0xFF0000) + (e[a + 1] << 8 & 0xFF00) + (e[a + 2] & 0xFF);
                    i.push(tripletToBase64(n));
                }
                return i.join('');
            }
            function fromByteArray(e) {
                var t;
                var r = e.length;
                var n = r % 3;
                var i = [];
                var a = 16383;
                for(var o = 0, f = r - n; o < f; o += a){
                    i.push(encodeChunk(e, o, o + a > f ? f : o + a));
                }
                if (n === 1) {
                    t = e[r - 1];
                    i.push(lookup[t >> 2] + lookup[t << 4 & 0x3F] + '==');
                } else if (n === 2) {
                    t = (e[r - 2] << 8) + e[r - 1];
                    i.push(lookup[t >> 10] + lookup[t >> 4 & 0x3F] + lookup[t << 2 & 0x3F] + '=');
                }
                return i.join('');
            }
            var ieee754 = {};
            ieee754.read = function(e, t, r, n, i) {
                var a, o;
                var f = i * 8 - n - 1;
                var s = (1 << f) - 1;
                var u = s >> 1;
                var l = -7;
                var c = r ? i - 1 : 0;
                var h = r ? -1 : 1;
                var p = e[t + c];
                c += h;
                a = p & (1 << -l) - 1;
                p >>= -l;
                l += f;
                for(; l > 0; a = a * 256 + e[t + c], c += h, l -= 8){}
                o = a & (1 << -l) - 1;
                a >>= -l;
                l += n;
                for(; l > 0; o = o * 256 + e[t + c], c += h, l -= 8){}
                if (a === 0) {
                    a = 1 - u;
                } else if (a === s) {
                    return o ? NaN : (p ? -1 : 1) * Infinity;
                } else {
                    o = o + Math.pow(2, n);
                    a = a - u;
                }
                return (p ? -1 : 1) * o * Math.pow(2, a - n);
            };
            ieee754.write = function(e, t, r, n, i, a) {
                var o, f, s;
                var u = a * 8 - i - 1;
                var l = (1 << u) - 1;
                var c = l >> 1;
                var h = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
                var p = n ? 0 : a - 1;
                var d = n ? 1 : -1;
                var v = t < 0 || t === 0 && 1 / t < 0 ? 1 : 0;
                t = Math.abs(t);
                if (isNaN(t) || t === Infinity) {
                    f = isNaN(t) ? 1 : 0;
                    o = l;
                } else {
                    o = Math.floor(Math.log(t) / Math.LN2);
                    if (t * (s = Math.pow(2, -o)) < 1) {
                        o--;
                        s *= 2;
                    }
                    if (o + c >= 1) {
                        t += h / s;
                    } else {
                        t += h * Math.pow(2, 1 - c);
                    }
                    if (t * s >= 2) {
                        o++;
                        s /= 2;
                    }
                    if (o + c >= l) {
                        f = 0;
                        o = l;
                    } else if (o + c >= 1) {
                        f = (t * s - 1) * Math.pow(2, i);
                        o = o + c;
                    } else {
                        f = t * Math.pow(2, c - 1) * Math.pow(2, i);
                        o = 0;
                    }
                }
                for(; i >= 8; e[r + p] = f & 0xff, p += d, f /= 256, i -= 8){}
                o = o << i | f;
                u += i;
                for(; u > 0; e[r + p] = o & 0xff, p += d, o /= 256, u -= 8){}
                e[r + p - d] |= v * 128;
            };
            (function(e) {
                var t = base64Js;
                var r = ieee754;
                var n = typeof Symbol === 'function' && typeof Symbol['for'] === 'function' ? Symbol['for']('nodejs.util.inspect.custom') : null;
                e.Buffer = f;
                e.SlowBuffer = b;
                e.INSPECT_MAX_BYTES = 50;
                var i = 0x7fffffff;
                e.kMaxLength = i;
                f.TYPED_ARRAY_SUPPORT = a();
                if (!f.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' && typeof console.error === 'function') {
                    console.error('This browser lacks typed array (Uint8Array) support which is required by ' + '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.');
                }
                function a() {
                    try {
                        var e = new Uint8Array(1);
                        var t = {
                            foo: function e() {
                                return 42;
                            }
                        };
                        Object.setPrototypeOf(t, Uint8Array.prototype);
                        Object.setPrototypeOf(e, t);
                        return e.foo() === 42;
                    } catch (r) {
                        return false;
                    }
                }
                Object.defineProperty(f.prototype, 'parent', {
                    enumerable: true,
                    get: function e() {
                        if (!f.isBuffer(this)) return undefined;
                        return this.buffer;
                    }
                });
                Object.defineProperty(f.prototype, 'offset', {
                    enumerable: true,
                    get: function e() {
                        if (!f.isBuffer(this)) return undefined;
                        return this.byteOffset;
                    }
                });
                function o(e) {
                    if (e > i) {
                        throw new RangeError('The value "' + e + '" is invalid for option "size"');
                    }
                    var t = new Uint8Array(e);
                    Object.setPrototypeOf(t, f.prototype);
                    return t;
                }
                function f(e, t, r) {
                    if (typeof e === 'number') {
                        if (typeof t === 'string') {
                            throw new TypeError('The "string" argument must be of type string. Received type number');
                        }
                        return c(e);
                    }
                    return s(e, t, r);
                }
                f.poolSize = 8192;
                function s(e, t, r) {
                    if (typeof e === 'string') {
                        return h(e, t);
                    }
                    if (ArrayBuffer.isView(e)) {
                        return d(e);
                    }
                    if (e == null) {
                        throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + typeof e);
                    }
                    if ($(e, ArrayBuffer) || e && $(e.buffer, ArrayBuffer)) {
                        return v(e, t, r);
                    }
                    if (typeof SharedArrayBuffer !== 'undefined' && ($(e, SharedArrayBuffer) || e && $(e.buffer, SharedArrayBuffer))) {
                        return v(e, t, r);
                    }
                    if (typeof e === 'number') {
                        throw new TypeError('The "value" argument must not be of type number. Received type number');
                    }
                    var n = e.valueOf && e.valueOf();
                    if (n != null && n !== e) {
                        return f.from(n, t, r);
                    }
                    var i = y(e);
                    if (i) return i;
                    if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null && typeof e[Symbol.toPrimitive] === 'function') {
                        return f.from(e[Symbol.toPrimitive]('string'), t, r);
                    }
                    throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + typeof e);
                }
                f.from = function(e, t, r) {
                    return s(e, t, r);
                };
                Object.setPrototypeOf(f.prototype, Uint8Array.prototype);
                Object.setPrototypeOf(f, Uint8Array);
                function u(e) {
                    if (typeof e !== 'number') {
                        throw new TypeError('"size" argument must be of type number');
                    } else if (e < 0) {
                        throw new RangeError('The value "' + e + '" is invalid for option "size"');
                    }
                }
                function l(e, t, r) {
                    u(e);
                    if (e <= 0) {
                        return o(e);
                    }
                    if (t !== undefined) {
                        return typeof r === 'string' ? o(e).fill(t, r) : o(e).fill(t);
                    }
                    return o(e);
                }
                f.alloc = function(e, t, r) {
                    return l(e, t, r);
                };
                function c(e) {
                    u(e);
                    return o(e < 0 ? 0 : g(e) | 0);
                }
                f.allocUnsafe = function(e) {
                    return c(e);
                };
                f.allocUnsafeSlow = function(e) {
                    return c(e);
                };
                function h(e, t) {
                    if (typeof t !== 'string' || t === '') {
                        t = 'utf8';
                    }
                    if (!f.isEncoding(t)) {
                        throw new TypeError('Unknown encoding: ' + t);
                    }
                    var r = w(e, t) | 0;
                    var n = o(r);
                    var i = n.write(e, t);
                    if (i !== r) {
                        n = n.slice(0, i);
                    }
                    return n;
                }
                function p(e) {
                    var t = e.length < 0 ? 0 : g(e.length) | 0;
                    var r = o(t);
                    for(var n = 0; n < t; n += 1){
                        r[n] = e[n] & 255;
                    }
                    return r;
                }
                function d(e) {
                    if ($(e, Uint8Array)) {
                        var t = new Uint8Array(e);
                        return v(t.buffer, t.byteOffset, t.byteLength);
                    }
                    return p(e);
                }
                function v(e, t, r) {
                    if (t < 0 || e.byteLength < t) {
                        throw new RangeError('"offset" is outside of buffer bounds');
                    }
                    if (e.byteLength < t + (r || 0)) {
                        throw new RangeError('"length" is outside of buffer bounds');
                    }
                    var n;
                    if (t === undefined && r === undefined) {
                        n = new Uint8Array(e);
                    } else if (r === undefined) {
                        n = new Uint8Array(e, t);
                    } else {
                        n = new Uint8Array(e, t, r);
                    }
                    Object.setPrototypeOf(n, f.prototype);
                    return n;
                }
                function y(e) {
                    if (f.isBuffer(e)) {
                        var t = g(e.length) | 0;
                        var r = o(t);
                        if (r.length === 0) {
                            return r;
                        }
                        e.copy(r, 0, 0, t);
                        return r;
                    }
                    if (e.length !== undefined) {
                        if (typeof e.length !== 'number' || K(e.length)) {
                            return o(0);
                        }
                        return p(e);
                    }
                    if (e.type === 'Buffer' && Array.isArray(e.data)) {
                        return p(e.data);
                    }
                }
                function g(e) {
                    if (e >= i) {
                        throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + i.toString(16) + ' bytes');
                    }
                    return e | 0;
                }
                function b(e) {
                    if (+e != e) {
                        e = 0;
                    }
                    return f.alloc(+e);
                }
                f.isBuffer = function e(t) {
                    return t != null && t._isBuffer === true && t !== f.prototype;
                };
                f.compare = function e(t, r) {
                    if ($(t, Uint8Array)) t = f.from(t, t.offset, t.byteLength);
                    if ($(r, Uint8Array)) r = f.from(r, r.offset, r.byteLength);
                    if (!f.isBuffer(t) || !f.isBuffer(r)) {
                        throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                    }
                    if (t === r) return 0;
                    var n = t.length;
                    var i = r.length;
                    for(var a = 0, o = Math.min(n, i); a < o; ++a){
                        if (t[a] !== r[a]) {
                            n = t[a];
                            i = r[a];
                            break;
                        }
                    }
                    if (n < i) return -1;
                    if (i < n) return 1;
                    return 0;
                };
                f.isEncoding = function e(t) {
                    switch(String(t).toLowerCase()){
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
                f.concat = function e(t, r) {
                    if (!Array.isArray(t)) {
                        throw new TypeError('"list" argument must be an Array of Buffers');
                    }
                    if (t.length === 0) {
                        return f.alloc(0);
                    }
                    var n;
                    if (r === undefined) {
                        r = 0;
                        for(n = 0; n < t.length; ++n){
                            r += t[n].length;
                        }
                    }
                    var i = f.allocUnsafe(r);
                    var a = 0;
                    for(n = 0; n < t.length; ++n){
                        var o = t[n];
                        if ($(o, Uint8Array)) {
                            if (a + o.length > i.length) {
                                f.from(o).copy(i, a);
                            } else {
                                Uint8Array.prototype.set.call(i, o, a);
                            }
                        } else if (!f.isBuffer(o)) {
                            throw new TypeError('"list" argument must be an Array of Buffers');
                        } else {
                            o.copy(i, a);
                        }
                        a += o.length;
                    }
                    return i;
                };
                function w(e, t) {
                    if (f.isBuffer(e)) {
                        return e.length;
                    }
                    if (ArrayBuffer.isView(e) || $(e, ArrayBuffer)) {
                        return e.byteLength;
                    }
                    if (typeof e !== 'string') {
                        throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + 'Received type ' + typeof e);
                    }
                    var r = e.length;
                    var n = arguments.length > 2 && arguments[2] === true;
                    if (!n && r === 0) return 0;
                    var i = false;
                    for(;;){
                        switch(t){
                            case 'ascii':
                            case 'latin1':
                            case 'binary':
                                return r;
                            case 'utf8':
                            case 'utf-8':
                                return W(e).length;
                            case 'ucs2':
                            case 'ucs-2':
                            case 'utf16le':
                            case 'utf-16le':
                                return r * 2;
                            case 'hex':
                                return r >>> 1;
                            case 'base64':
                                return H(e).length;
                            default:
                                if (i) {
                                    return n ? -1 : W(e).length;
                                }
                                t = ('' + t).toLowerCase();
                                i = true;
                        }
                    }
                }
                f.byteLength = w;
                function _(e, t, r) {
                    var n = false;
                    if (t === undefined || t < 0) {
                        t = 0;
                    }
                    if (t > this.length) {
                        return '';
                    }
                    if (r === undefined || r > this.length) {
                        r = this.length;
                    }
                    if (r <= 0) {
                        return '';
                    }
                    r >>>= 0;
                    t >>>= 0;
                    if (r <= t) {
                        return '';
                    }
                    if (!e) e = 'utf8';
                    while(true){
                        switch(e){
                            case 'hex':
                                return B(this, t, r);
                            case 'utf8':
                            case 'utf-8':
                                return j(this, t, r);
                            case 'ascii':
                                return P(this, t, r);
                            case 'latin1':
                            case 'binary':
                                return U(this, t, r);
                            case 'base64':
                                return T(this, t, r);
                            case 'ucs2':
                            case 'ucs-2':
                            case 'utf16le':
                            case 'utf-16le':
                                return N(this, t, r);
                            default:
                                if (n) throw new TypeError('Unknown encoding: ' + e);
                                e = (e + '').toLowerCase();
                                n = true;
                        }
                    }
                }
                f.prototype._isBuffer = true;
                function m(e, t, r) {
                    var n = e[t];
                    e[t] = e[r];
                    e[r] = n;
                }
                f.prototype.swap16 = function e() {
                    var t = this.length;
                    if (t % 2 !== 0) {
                        throw new RangeError('Buffer size must be a multiple of 16-bits');
                    }
                    for(var r = 0; r < t; r += 2){
                        m(this, r, r + 1);
                    }
                    return this;
                };
                f.prototype.swap32 = function e() {
                    var t = this.length;
                    if (t % 4 !== 0) {
                        throw new RangeError('Buffer size must be a multiple of 32-bits');
                    }
                    for(var r = 0; r < t; r += 4){
                        m(this, r, r + 3);
                        m(this, r + 1, r + 2);
                    }
                    return this;
                };
                f.prototype.swap64 = function e() {
                    var t = this.length;
                    if (t % 8 !== 0) {
                        throw new RangeError('Buffer size must be a multiple of 64-bits');
                    }
                    for(var r = 0; r < t; r += 8){
                        m(this, r, r + 7);
                        m(this, r + 1, r + 6);
                        m(this, r + 2, r + 5);
                        m(this, r + 3, r + 4);
                    }
                    return this;
                };
                f.prototype.toString = function e() {
                    var t = this.length;
                    if (t === 0) return '';
                    if (arguments.length === 0) return j(this, 0, t);
                    return _.apply(this, arguments);
                };
                f.prototype.toLocaleString = f.prototype.toString;
                f.prototype.equals = function e(t) {
                    if (!f.isBuffer(t)) throw new TypeError('Argument must be a Buffer');
                    if (this === t) return true;
                    return f.compare(this, t) === 0;
                };
                f.prototype.inspect = function t() {
                    var r = '';
                    var n = e.INSPECT_MAX_BYTES;
                    r = this.toString('hex', 0, n).replace(/(.{2})/g, '$1 ').trim();
                    if (this.length > n) r += ' ... ';
                    return '<Buffer ' + r + '>';
                };
                if (n) {
                    f.prototype[n] = f.prototype.inspect;
                }
                f.prototype.compare = function e(t, r, n, i, a) {
                    if ($(t, Uint8Array)) {
                        t = f.from(t, t.offset, t.byteLength);
                    }
                    if (!f.isBuffer(t)) {
                        throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. ' + 'Received type ' + typeof t);
                    }
                    if (r === undefined) {
                        r = 0;
                    }
                    if (n === undefined) {
                        n = t ? t.length : 0;
                    }
                    if (i === undefined) {
                        i = 0;
                    }
                    if (a === undefined) {
                        a = this.length;
                    }
                    if (r < 0 || n > t.length || i < 0 || a > this.length) {
                        throw new RangeError('out of range index');
                    }
                    if (i >= a && r >= n) {
                        return 0;
                    }
                    if (i >= a) {
                        return -1;
                    }
                    if (r >= n) {
                        return 1;
                    }
                    r >>>= 0;
                    n >>>= 0;
                    i >>>= 0;
                    a >>>= 0;
                    if (this === t) return 0;
                    var o = a - i;
                    var s = n - r;
                    var u = Math.min(o, s);
                    var l = this.slice(i, a);
                    var c = t.slice(r, n);
                    for(var h = 0; h < u; ++h){
                        if (l[h] !== c[h]) {
                            o = l[h];
                            s = c[h];
                            break;
                        }
                    }
                    if (o < s) return -1;
                    if (s < o) return 1;
                    return 0;
                };
                function E(e, t, r, n, i) {
                    if (e.length === 0) return -1;
                    if (typeof r === 'string') {
                        n = r;
                        r = 0;
                    } else if (r > 0x7fffffff) {
                        r = 0x7fffffff;
                    } else if (r < -0x80000000) {
                        r = -0x80000000;
                    }
                    r = +r;
                    if (K(r)) {
                        r = i ? 0 : e.length - 1;
                    }
                    if (r < 0) r = e.length + r;
                    if (r >= e.length) {
                        if (i) return -1;
                        else r = e.length - 1;
                    } else if (r < 0) {
                        if (i) r = 0;
                        else return -1;
                    }
                    if (typeof t === 'string') {
                        t = f.from(t, n);
                    }
                    if (f.isBuffer(t)) {
                        if (t.length === 0) {
                            return -1;
                        }
                        return k(e, t, r, n, i);
                    } else if (typeof t === 'number') {
                        t = t & 0xFF;
                        if (typeof Uint8Array.prototype.indexOf === 'function') {
                            if (i) {
                                return Uint8Array.prototype.indexOf.call(e, t, r);
                            } else {
                                return Uint8Array.prototype.lastIndexOf.call(e, t, r);
                            }
                        }
                        return k(e, [
                            t
                        ], r, n, i);
                    }
                    throw new TypeError('val must be string, number or Buffer');
                }
                function k(e, t, r, n, i) {
                    var a = 1;
                    var o = e.length;
                    var f = t.length;
                    if (n !== undefined) {
                        n = String(n).toLowerCase();
                        if (n === 'ucs2' || n === 'ucs-2' || n === 'utf16le' || n === 'utf-16le') {
                            if (e.length < 2 || t.length < 2) {
                                return -1;
                            }
                            a = 2;
                            o /= 2;
                            f /= 2;
                            r /= 2;
                        }
                    }
                    function s(e, t) {
                        if (a === 1) {
                            return e[t];
                        } else {
                            return e.readUInt16BE(t * a);
                        }
                    }
                    var u;
                    if (i) {
                        var l = -1;
                        for(u = r; u < o; u++){
                            if (s(e, u) === s(t, l === -1 ? 0 : u - l)) {
                                if (l === -1) l = u;
                                if (u - l + 1 === f) return l * a;
                            } else {
                                if (l !== -1) u -= u - l;
                                l = -1;
                            }
                        }
                    } else {
                        if (r + f > o) r = o - f;
                        for(u = r; u >= 0; u--){
                            var c = true;
                            for(var h = 0; h < f; h++){
                                if (s(e, u + h) !== s(t, h)) {
                                    c = false;
                                    break;
                                }
                            }
                            if (c) return u;
                        }
                    }
                    return -1;
                }
                f.prototype.includes = function e(t, r, n) {
                    return this.indexOf(t, r, n) !== -1;
                };
                f.prototype.indexOf = function e(t, r, n) {
                    return E(this, t, r, n, true);
                };
                f.prototype.lastIndexOf = function e(t, r, n) {
                    return E(this, t, r, n, false);
                };
                function A(e, t, r, n) {
                    r = Number(r) || 0;
                    var i = e.length - r;
                    if (!n) {
                        n = i;
                    } else {
                        n = Number(n);
                        if (n > i) {
                            n = i;
                        }
                    }
                    var a = t.length;
                    if (n > a / 2) {
                        n = a / 2;
                    }
                    for(var o = 0; o < n; ++o){
                        var f = parseInt(t.substr(o * 2, 2), 16);
                        if (K(f)) return o;
                        e[r + o] = f;
                    }
                    return o;
                }
                function S(e, t, r, n) {
                    return V(W(t, e.length - r), e, r, n);
                }
                function O(e, t, r, n) {
                    return V(G(t), e, r, n);
                }
                function x(e, t, r, n) {
                    return V(H(t), e, r, n);
                }
                function R(e, t, r, n) {
                    return V(Y(t, e.length - r), e, r, n);
                }
                f.prototype.write = function e(t, r, n, i) {
                    if (r === undefined) {
                        i = 'utf8';
                        n = this.length;
                        r = 0;
                    } else if (n === undefined && typeof r === 'string') {
                        i = r;
                        n = this.length;
                        r = 0;
                    } else if (isFinite(r)) {
                        r = r >>> 0;
                        if (isFinite(n)) {
                            n = n >>> 0;
                            if (i === undefined) i = 'utf8';
                        } else {
                            i = n;
                            n = undefined;
                        }
                    } else {
                        throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
                    }
                    var a = this.length - r;
                    if (n === undefined || n > a) n = a;
                    if (t.length > 0 && (n < 0 || r < 0) || r > this.length) {
                        throw new RangeError('Attempt to write outside buffer bounds');
                    }
                    if (!i) i = 'utf8';
                    var o = false;
                    for(;;){
                        switch(i){
                            case 'hex':
                                return A(this, t, r, n);
                            case 'utf8':
                            case 'utf-8':
                                return S(this, t, r, n);
                            case 'ascii':
                            case 'latin1':
                            case 'binary':
                                return O(this, t, r, n);
                            case 'base64':
                                return x(this, t, r, n);
                            case 'ucs2':
                            case 'ucs-2':
                            case 'utf16le':
                            case 'utf-16le':
                                return R(this, t, r, n);
                            default:
                                if (o) throw new TypeError('Unknown encoding: ' + i);
                                i = ('' + i).toLowerCase();
                                o = true;
                        }
                    }
                };
                f.prototype.toJSON = function e() {
                    return {
                        type: 'Buffer',
                        data: Array.prototype.slice.call(this._arr || this, 0)
                    };
                };
                function T(e, r, n) {
                    if (r === 0 && n === e.length) {
                        return t.fromByteArray(e);
                    } else {
                        return t.fromByteArray(e.slice(r, n));
                    }
                }
                function j(e, t, r) {
                    r = Math.min(e.length, r);
                    var n = [];
                    var i = t;
                    while(i < r){
                        var a = e[i];
                        var o = null;
                        var f = a > 0xEF ? 4 : a > 0xDF ? 3 : a > 0xBF ? 2 : 1;
                        if (i + f <= r) {
                            var s, u, l, c;
                            switch(f){
                                case 1:
                                    if (a < 0x80) {
                                        o = a;
                                    }
                                    break;
                                case 2:
                                    s = e[i + 1];
                                    if ((s & 0xC0) === 0x80) {
                                        c = (a & 0x1F) << 0x6 | s & 0x3F;
                                        if (c > 0x7F) {
                                            o = c;
                                        }
                                    }
                                    break;
                                case 3:
                                    s = e[i + 1];
                                    u = e[i + 2];
                                    if ((s & 0xC0) === 0x80 && (u & 0xC0) === 0x80) {
                                        c = (a & 0xF) << 0xC | (s & 0x3F) << 0x6 | u & 0x3F;
                                        if (c > 0x7FF && (c < 0xD800 || c > 0xDFFF)) {
                                            o = c;
                                        }
                                    }
                                    break;
                                case 4:
                                    s = e[i + 1];
                                    u = e[i + 2];
                                    l = e[i + 3];
                                    if ((s & 0xC0) === 0x80 && (u & 0xC0) === 0x80 && (l & 0xC0) === 0x80) {
                                        c = (a & 0xF) << 0x12 | (s & 0x3F) << 0xC | (u & 0x3F) << 0x6 | l & 0x3F;
                                        if (c > 0xFFFF && c < 0x110000) {
                                            o = c;
                                        }
                                    }
                            }
                        }
                        if (o === null) {
                            o = 0xFFFD;
                            f = 1;
                        } else if (o > 0xFFFF) {
                            o -= 0x10000;
                            n.push(o >>> 10 & 0x3FF | 0xD800);
                            o = 0xDC00 | o & 0x3FF;
                        }
                        n.push(o);
                        i += f;
                    }
                    return L(n);
                }
                var I = 0x1000;
                function L(e) {
                    var t = e.length;
                    if (t <= I) {
                        return String.fromCharCode.apply(String, e);
                    }
                    var r = '';
                    var n = 0;
                    while(n < t){
                        r += String.fromCharCode.apply(String, e.slice(n, n += I));
                    }
                    return r;
                }
                function P(e, t, r) {
                    var n = '';
                    r = Math.min(e.length, r);
                    for(var i = t; i < r; ++i){
                        n += String.fromCharCode(e[i] & 0x7F);
                    }
                    return n;
                }
                function U(e, t, r) {
                    var n = '';
                    r = Math.min(e.length, r);
                    for(var i = t; i < r; ++i){
                        n += String.fromCharCode(e[i]);
                    }
                    return n;
                }
                function B(e, t, r) {
                    var n = e.length;
                    if (!t || t < 0) t = 0;
                    if (!r || r < 0 || r > n) r = n;
                    var i = '';
                    for(var a = t; a < r; ++a){
                        i += X[e[a]];
                    }
                    return i;
                }
                function N(e, t, r) {
                    var n = e.slice(t, r);
                    var i = '';
                    for(var a = 0; a < n.length - 1; a += 2){
                        i += String.fromCharCode(n[a] + n[a + 1] * 256);
                    }
                    return i;
                }
                f.prototype.slice = function e(t, r) {
                    var n = this.length;
                    t = ~~t;
                    r = r === undefined ? n : ~~r;
                    if (t < 0) {
                        t += n;
                        if (t < 0) t = 0;
                    } else if (t > n) {
                        t = n;
                    }
                    if (r < 0) {
                        r += n;
                        if (r < 0) r = 0;
                    } else if (r > n) {
                        r = n;
                    }
                    if (r < t) r = t;
                    var i = this.subarray(t, r);
                    Object.setPrototypeOf(i, f.prototype);
                    return i;
                };
                function M(e, t, r) {
                    if (e % 1 !== 0 || e < 0) throw new RangeError('offset is not uint');
                    if (e + t > r) throw new RangeError('Trying to access beyond buffer length');
                }
                f.prototype.readUintLE = f.prototype.readUIntLE = function e(t, r, n) {
                    t = t >>> 0;
                    r = r >>> 0;
                    if (!n) M(t, r, this.length);
                    var i = this[t];
                    var a = 1;
                    var o = 0;
                    while(++o < r && (a *= 0x100)){
                        i += this[t + o] * a;
                    }
                    return i;
                };
                f.prototype.readUintBE = f.prototype.readUIntBE = function e(t, r, n) {
                    t = t >>> 0;
                    r = r >>> 0;
                    if (!n) {
                        M(t, r, this.length);
                    }
                    var i = this[t + --r];
                    var a = 1;
                    while(r > 0 && (a *= 0x100)){
                        i += this[t + --r] * a;
                    }
                    return i;
                };
                f.prototype.readUint8 = f.prototype.readUInt8 = function e(t, r) {
                    t = t >>> 0;
                    if (!r) M(t, 1, this.length);
                    return this[t];
                };
                f.prototype.readUint16LE = f.prototype.readUInt16LE = function e(t, r) {
                    t = t >>> 0;
                    if (!r) M(t, 2, this.length);
                    return this[t] | this[t + 1] << 8;
                };
                f.prototype.readUint16BE = f.prototype.readUInt16BE = function e(t, r) {
                    t = t >>> 0;
                    if (!r) M(t, 2, this.length);
                    return this[t] << 8 | this[t + 1];
                };
                f.prototype.readUint32LE = f.prototype.readUInt32LE = function e(t, r) {
                    t = t >>> 0;
                    if (!r) M(t, 4, this.length);
                    return (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + this[t + 3] * 0x1000000;
                };
                f.prototype.readUint32BE = f.prototype.readUInt32BE = function e(t, r) {
                    t = t >>> 0;
                    if (!r) M(t, 4, this.length);
                    return this[t] * 0x1000000 + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
                };
                f.prototype.readIntLE = function e(t, r, n) {
                    t = t >>> 0;
                    r = r >>> 0;
                    if (!n) M(t, r, this.length);
                    var i = this[t];
                    var a = 1;
                    var o = 0;
                    while(++o < r && (a *= 0x100)){
                        i += this[t + o] * a;
                    }
                    a *= 0x80;
                    if (i >= a) i -= Math.pow(2, 8 * r);
                    return i;
                };
                f.prototype.readIntBE = function e(t, r, n) {
                    t = t >>> 0;
                    r = r >>> 0;
                    if (!n) M(t, r, this.length);
                    var i = r;
                    var a = 1;
                    var o = this[t + --i];
                    while(i > 0 && (a *= 0x100)){
                        o += this[t + --i] * a;
                    }
                    a *= 0x80;
                    if (o >= a) o -= Math.pow(2, 8 * r);
                    return o;
                };
                f.prototype.readInt8 = function e(t, r) {
                    t = t >>> 0;
                    if (!r) M(t, 1, this.length);
                    if (!(this[t] & 0x80)) return this[t];
                    return (0xff - this[t] + 1) * -1;
                };
                f.prototype.readInt16LE = function e(t, r) {
                    t = t >>> 0;
                    if (!r) M(t, 2, this.length);
                    var n = this[t] | this[t + 1] << 8;
                    return n & 0x8000 ? n | 0xFFFF0000 : n;
                };
                f.prototype.readInt16BE = function e(t, r) {
                    t = t >>> 0;
                    if (!r) M(t, 2, this.length);
                    var n = this[t + 1] | this[t] << 8;
                    return n & 0x8000 ? n | 0xFFFF0000 : n;
                };
                f.prototype.readInt32LE = function e(t, r) {
                    t = t >>> 0;
                    if (!r) M(t, 4, this.length);
                    return this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
                };
                f.prototype.readInt32BE = function e(t, r) {
                    t = t >>> 0;
                    if (!r) M(t, 4, this.length);
                    return this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
                };
                f.prototype.readFloatLE = function e(t, n) {
                    t = t >>> 0;
                    if (!n) M(t, 4, this.length);
                    return r.read(this, t, true, 23, 4);
                };
                f.prototype.readFloatBE = function e(t, n) {
                    t = t >>> 0;
                    if (!n) M(t, 4, this.length);
                    return r.read(this, t, false, 23, 4);
                };
                f.prototype.readDoubleLE = function e(t, n) {
                    t = t >>> 0;
                    if (!n) M(t, 8, this.length);
                    return r.read(this, t, true, 52, 8);
                };
                f.prototype.readDoubleBE = function e(t, n) {
                    t = t >>> 0;
                    if (!n) M(t, 8, this.length);
                    return r.read(this, t, false, 52, 8);
                };
                function F(e, t, r, n, i, a) {
                    if (!f.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
                    if (t > i || t < a) throw new RangeError('"value" argument is out of bounds');
                    if (r + n > e.length) throw new RangeError('Index out of range');
                }
                f.prototype.writeUintLE = f.prototype.writeUIntLE = function e(t, r, n, i) {
                    t = +t;
                    r = r >>> 0;
                    n = n >>> 0;
                    if (!i) {
                        var a = Math.pow(2, 8 * n) - 1;
                        F(this, t, r, n, a, 0);
                    }
                    var o = 1;
                    var f = 0;
                    this[r] = t & 0xFF;
                    while(++f < n && (o *= 0x100)){
                        this[r + f] = t / o & 0xFF;
                    }
                    return r + n;
                };
                f.prototype.writeUintBE = f.prototype.writeUIntBE = function e(t, r, n, i) {
                    t = +t;
                    r = r >>> 0;
                    n = n >>> 0;
                    if (!i) {
                        var a = Math.pow(2, 8 * n) - 1;
                        F(this, t, r, n, a, 0);
                    }
                    var o = n - 1;
                    var f = 1;
                    this[r + o] = t & 0xFF;
                    while(--o >= 0 && (f *= 0x100)){
                        this[r + o] = t / f & 0xFF;
                    }
                    return r + n;
                };
                f.prototype.writeUint8 = f.prototype.writeUInt8 = function e(t, r, n) {
                    t = +t;
                    r = r >>> 0;
                    if (!n) F(this, t, r, 1, 0xff, 0);
                    this[r] = t & 0xff;
                    return r + 1;
                };
                f.prototype.writeUint16LE = f.prototype.writeUInt16LE = function e(t, r, n) {
                    t = +t;
                    r = r >>> 0;
                    if (!n) F(this, t, r, 2, 0xffff, 0);
                    this[r] = t & 0xff;
                    this[r + 1] = t >>> 8;
                    return r + 2;
                };
                f.prototype.writeUint16BE = f.prototype.writeUInt16BE = function e(t, r, n) {
                    t = +t;
                    r = r >>> 0;
                    if (!n) F(this, t, r, 2, 0xffff, 0);
                    this[r] = t >>> 8;
                    this[r + 1] = t & 0xff;
                    return r + 2;
                };
                f.prototype.writeUint32LE = f.prototype.writeUInt32LE = function e(t, r, n) {
                    t = +t;
                    r = r >>> 0;
                    if (!n) F(this, t, r, 4, 0xffffffff, 0);
                    this[r + 3] = t >>> 24;
                    this[r + 2] = t >>> 16;
                    this[r + 1] = t >>> 8;
                    this[r] = t & 0xff;
                    return r + 4;
                };
                f.prototype.writeUint32BE = f.prototype.writeUInt32BE = function e(t, r, n) {
                    t = +t;
                    r = r >>> 0;
                    if (!n) F(this, t, r, 4, 0xffffffff, 0);
                    this[r] = t >>> 24;
                    this[r + 1] = t >>> 16;
                    this[r + 2] = t >>> 8;
                    this[r + 3] = t & 0xff;
                    return r + 4;
                };
                f.prototype.writeIntLE = function e(t, r, n, i) {
                    t = +t;
                    r = r >>> 0;
                    if (!i) {
                        var a = Math.pow(2, 8 * n - 1);
                        F(this, t, r, n, a - 1, -a);
                    }
                    var o = 0;
                    var f = 1;
                    var s = 0;
                    this[r] = t & 0xFF;
                    while(++o < n && (f *= 0x100)){
                        if (t < 0 && s === 0 && this[r + o - 1] !== 0) {
                            s = 1;
                        }
                        this[r + o] = (t / f >> 0) - s & 0xFF;
                    }
                    return r + n;
                };
                f.prototype.writeIntBE = function e(t, r, n, i) {
                    t = +t;
                    r = r >>> 0;
                    if (!i) {
                        var a = Math.pow(2, 8 * n - 1);
                        F(this, t, r, n, a - 1, -a);
                    }
                    var o = n - 1;
                    var f = 1;
                    var s = 0;
                    this[r + o] = t & 0xFF;
                    while(--o >= 0 && (f *= 0x100)){
                        if (t < 0 && s === 0 && this[r + o + 1] !== 0) {
                            s = 1;
                        }
                        this[r + o] = (t / f >> 0) - s & 0xFF;
                    }
                    return r + n;
                };
                f.prototype.writeInt8 = function e(t, r, n) {
                    t = +t;
                    r = r >>> 0;
                    if (!n) F(this, t, r, 1, 0x7f, -0x80);
                    if (t < 0) t = 0xff + t + 1;
                    this[r] = t & 0xff;
                    return r + 1;
                };
                f.prototype.writeInt16LE = function e(t, r, n) {
                    t = +t;
                    r = r >>> 0;
                    if (!n) F(this, t, r, 2, 0x7fff, -0x8000);
                    this[r] = t & 0xff;
                    this[r + 1] = t >>> 8;
                    return r + 2;
                };
                f.prototype.writeInt16BE = function e(t, r, n) {
                    t = +t;
                    r = r >>> 0;
                    if (!n) F(this, t, r, 2, 0x7fff, -0x8000);
                    this[r] = t >>> 8;
                    this[r + 1] = t & 0xff;
                    return r + 2;
                };
                f.prototype.writeInt32LE = function e(t, r, n) {
                    t = +t;
                    r = r >>> 0;
                    if (!n) F(this, t, r, 4, 0x7fffffff, -0x80000000);
                    this[r] = t & 0xff;
                    this[r + 1] = t >>> 8;
                    this[r + 2] = t >>> 16;
                    this[r + 3] = t >>> 24;
                    return r + 4;
                };
                f.prototype.writeInt32BE = function e(t, r, n) {
                    t = +t;
                    r = r >>> 0;
                    if (!n) F(this, t, r, 4, 0x7fffffff, -0x80000000);
                    if (t < 0) t = 0xffffffff + t + 1;
                    this[r] = t >>> 24;
                    this[r + 1] = t >>> 16;
                    this[r + 2] = t >>> 8;
                    this[r + 3] = t & 0xff;
                    return r + 4;
                };
                function D(e, t, r, n, i, a) {
                    if (r + n > e.length) throw new RangeError('Index out of range');
                    if (r < 0) throw new RangeError('Index out of range');
                }
                function z(e, t, n, i, a) {
                    t = +t;
                    n = n >>> 0;
                    if (!a) {
                        D(e, t, n, 4);
                    }
                    r.write(e, t, n, i, 23, 4);
                    return n + 4;
                }
                f.prototype.writeFloatLE = function e(t, r, n) {
                    return z(this, t, r, true, n);
                };
                f.prototype.writeFloatBE = function e(t, r, n) {
                    return z(this, t, r, false, n);
                };
                function C(e, t, n, i, a) {
                    t = +t;
                    n = n >>> 0;
                    if (!a) {
                        D(e, t, n, 8);
                    }
                    r.write(e, t, n, i, 52, 8);
                    return n + 8;
                }
                f.prototype.writeDoubleLE = function e(t, r, n) {
                    return C(this, t, r, true, n);
                };
                f.prototype.writeDoubleBE = function e(t, r, n) {
                    return C(this, t, r, false, n);
                };
                f.prototype.copy = function e(t, r, n, i) {
                    if (!f.isBuffer(t)) throw new TypeError('argument should be a Buffer');
                    if (!n) n = 0;
                    if (!i && i !== 0) i = this.length;
                    if (r >= t.length) r = t.length;
                    if (!r) r = 0;
                    if (i > 0 && i < n) i = n;
                    if (i === n) return 0;
                    if (t.length === 0 || this.length === 0) return 0;
                    if (r < 0) {
                        throw new RangeError('targetStart out of bounds');
                    }
                    if (n < 0 || n >= this.length) throw new RangeError('Index out of range');
                    if (i < 0) throw new RangeError('sourceEnd out of bounds');
                    if (i > this.length) i = this.length;
                    if (t.length - r < i - n) {
                        i = t.length - r + n;
                    }
                    var a = i - n;
                    if (this === t && typeof Uint8Array.prototype.copyWithin === 'function') {
                        this.copyWithin(r, n, i);
                    } else {
                        Uint8Array.prototype.set.call(t, this.subarray(n, i), r);
                    }
                    return a;
                };
                f.prototype.fill = function e(t, r, n, i) {
                    if (typeof t === 'string') {
                        if (typeof r === 'string') {
                            i = r;
                            r = 0;
                            n = this.length;
                        } else if (typeof n === 'string') {
                            i = n;
                            n = this.length;
                        }
                        if (i !== undefined && typeof i !== 'string') {
                            throw new TypeError('encoding must be a string');
                        }
                        if (typeof i === 'string' && !f.isEncoding(i)) {
                            throw new TypeError('Unknown encoding: ' + i);
                        }
                        if (t.length === 1) {
                            var a = t.charCodeAt(0);
                            if (i === 'utf8' && a < 128 || i === 'latin1') {
                                t = a;
                            }
                        }
                    } else if (typeof t === 'number') {
                        t = t & 255;
                    } else if (typeof t === 'boolean') {
                        t = Number(t);
                    }
                    if (r < 0 || this.length < r || this.length < n) {
                        throw new RangeError('Out of range index');
                    }
                    if (n <= r) {
                        return this;
                    }
                    r = r >>> 0;
                    n = n === undefined ? this.length : n >>> 0;
                    if (!t) t = 0;
                    var o;
                    if (typeof t === 'number') {
                        for(o = r; o < n; ++o){
                            this[o] = t;
                        }
                    } else {
                        var s = f.isBuffer(t) ? t : f.from(t, i);
                        var u = s.length;
                        if (u === 0) {
                            throw new TypeError('The value "' + t + '" is invalid for argument "value"');
                        }
                        for(o = 0; o < n - r; ++o){
                            this[o + r] = s[o % u];
                        }
                    }
                    return this;
                };
                var Z = /[^+/0-9A-Za-z-_]/g;
                function q(e) {
                    e = e.split('=')[0];
                    e = e.trim().replace(Z, '');
                    if (e.length < 2) return '';
                    while(e.length % 4 !== 0){
                        e = e + '=';
                    }
                    return e;
                }
                function W(e, t) {
                    t = t || Infinity;
                    var r;
                    var n = e.length;
                    var i = null;
                    var a = [];
                    for(var o = 0; o < n; ++o){
                        r = e.charCodeAt(o);
                        if (r > 0xD7FF && r < 0xE000) {
                            if (!i) {
                                if (r > 0xDBFF) {
                                    if ((t -= 3) > -1) a.push(0xEF, 0xBF, 0xBD);
                                    continue;
                                } else if (o + 1 === n) {
                                    if ((t -= 3) > -1) a.push(0xEF, 0xBF, 0xBD);
                                    continue;
                                }
                                i = r;
                                continue;
                            }
                            if (r < 0xDC00) {
                                if ((t -= 3) > -1) a.push(0xEF, 0xBF, 0xBD);
                                i = r;
                                continue;
                            }
                            r = (i - 0xD800 << 10 | r - 0xDC00) + 0x10000;
                        } else if (i) {
                            if ((t -= 3) > -1) a.push(0xEF, 0xBF, 0xBD);
                        }
                        i = null;
                        if (r < 0x80) {
                            if ((t -= 1) < 0) break;
                            a.push(r);
                        } else if (r < 0x800) {
                            if ((t -= 2) < 0) break;
                            a.push(r >> 0x6 | 0xC0, r & 0x3F | 0x80);
                        } else if (r < 0x10000) {
                            if ((t -= 3) < 0) break;
                            a.push(r >> 0xC | 0xE0, r >> 0x6 & 0x3F | 0x80, r & 0x3F | 0x80);
                        } else if (r < 0x110000) {
                            if ((t -= 4) < 0) break;
                            a.push(r >> 0x12 | 0xF0, r >> 0xC & 0x3F | 0x80, r >> 0x6 & 0x3F | 0x80, r & 0x3F | 0x80);
                        } else {
                            throw new Error('Invalid code point');
                        }
                    }
                    return a;
                }
                function G(e) {
                    var t = [];
                    for(var r = 0; r < e.length; ++r){
                        t.push(e.charCodeAt(r) & 0xFF);
                    }
                    return t;
                }
                function Y(e, t) {
                    var r, n, i;
                    var a = [];
                    for(var o = 0; o < e.length; ++o){
                        if ((t -= 2) < 0) break;
                        r = e.charCodeAt(o);
                        n = r >> 8;
                        i = r % 256;
                        a.push(i);
                        a.push(n);
                    }
                    return a;
                }
                function H(e) {
                    return t.toByteArray(q(e));
                }
                function V(e, t, r, n) {
                    for(var i = 0; i < n; ++i){
                        if (i + r >= t.length || i >= e.length) break;
                        t[i + r] = e[i];
                    }
                    return i;
                }
                function $(e, t) {
                    return e instanceof t || e != null && e.constructor != null && e.constructor.name != null && e.constructor.name === t.name;
                }
                function K(e) {
                    return e !== e;
                }
                var X = function() {
                    var e = '0123456789abcdef';
                    var t = new Array(256);
                    for(var r = 0; r < 16; ++r){
                        var n = r * 16;
                        for(var i = 0; i < 16; ++i){
                            t[n + i] = e[r] + e[i];
                        }
                    }
                    return t;
                }();
            })(buffer);
            var events = {
                exports: {}
            };
            var R = typeof Reflect === 'object' ? Reflect : null;
            var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function e(t, r, n) {
                return Function.prototype.apply.call(t, r, n);
            };
            var ReflectOwnKeys;
            if (R && typeof R.ownKeys === 'function') {
                ReflectOwnKeys = R.ownKeys;
            } else if (Object.getOwnPropertySymbols) {
                ReflectOwnKeys = function e(t) {
                    return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t));
                };
            } else {
                ReflectOwnKeys = function e(t) {
                    return Object.getOwnPropertyNames(t);
                };
            }
            function ProcessEmitWarning(e) {
                if (console && console.warn) console.warn(e);
            }
            var NumberIsNaN = Number.isNaN || function e(t) {
                return t !== t;
            };
            function EventEmitter() {
                EventEmitter.init.call(this);
            }
            events.exports = EventEmitter;
            events.exports.once = once;
            EventEmitter.EventEmitter = EventEmitter;
            EventEmitter.prototype._events = undefined;
            EventEmitter.prototype._eventsCount = 0;
            EventEmitter.prototype._maxListeners = undefined;
            var defaultMaxListeners = 10;
            function checkListener(e) {
                if (typeof e !== 'function') {
                    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof e);
                }
            }
            Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
                enumerable: true,
                get: function e() {
                    return defaultMaxListeners;
                },
                set: function e(t) {
                    if (typeof t !== 'number' || t < 0 || NumberIsNaN(t)) {
                        throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + t + '.');
                    }
                    defaultMaxListeners = t;
                }
            });
            EventEmitter.init = function() {
                if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
                    this._events = Object.create(null);
                    this._eventsCount = 0;
                }
                this._maxListeners = this._maxListeners || undefined;
            };
            EventEmitter.prototype.setMaxListeners = function e(t) {
                if (typeof t !== 'number' || t < 0 || NumberIsNaN(t)) {
                    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + t + '.');
                }
                this._maxListeners = t;
                return this;
            };
            function _getMaxListeners(e) {
                if (e._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
                return e._maxListeners;
            }
            EventEmitter.prototype.getMaxListeners = function e() {
                return _getMaxListeners(this);
            };
            EventEmitter.prototype.emit = function e(t) {
                var r = [];
                for(var n = 1; n < arguments.length; n++){
                    r.push(arguments[n]);
                }
                var i = t === 'error';
                var a = this._events;
                if (a !== undefined) i = i && a.error === undefined;
                else if (!i) return false;
                if (i) {
                    var o;
                    if (r.length > 0) o = r[0];
                    if (o instanceof Error) {
                        throw o;
                    }
                    var f = new Error('Unhandled error.' + (o ? ' (' + o.message + ')' : ''));
                    f.context = o;
                    throw f;
                }
                var s = a[t];
                if (s === undefined) return false;
                if (typeof s === 'function') {
                    ReflectApply(s, this, r);
                } else {
                    var u = s.length;
                    var l = arrayClone(s, u);
                    for(var n = 0; n < u; ++n){
                        ReflectApply(l[n], this, r);
                    }
                }
                return true;
            };
            function _addListener(e, t, r, n) {
                var i;
                var a;
                var o;
                checkListener(r);
                a = e._events;
                if (a === undefined) {
                    a = e._events = Object.create(null);
                    e._eventsCount = 0;
                } else {
                    if (a.newListener !== undefined) {
                        e.emit('newListener', t, r.listener ? r.listener : r);
                        a = e._events;
                    }
                    o = a[t];
                }
                if (o === undefined) {
                    o = a[t] = r;
                    ++e._eventsCount;
                } else {
                    if (typeof o === 'function') {
                        o = a[t] = n ? [
                            r,
                            o
                        ] : [
                            o,
                            r
                        ];
                    } else if (n) {
                        o.unshift(r);
                    } else {
                        o.push(r);
                    }
                    i = _getMaxListeners(e);
                    if (i > 0 && o.length > i && !o.warned) {
                        o.warned = true;
                        var f = new Error('Possible EventEmitter memory leak detected. ' + o.length + ' ' + String(t) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
                        f.name = 'MaxListenersExceededWarning';
                        f.emitter = e;
                        f.type = t;
                        f.count = o.length;
                        ProcessEmitWarning(f);
                    }
                }
                return e;
            }
            EventEmitter.prototype.addListener = function e(t, r) {
                return _addListener(this, t, r, false);
            };
            EventEmitter.prototype.on = EventEmitter.prototype.addListener;
            EventEmitter.prototype.prependListener = function e(t, r) {
                return _addListener(this, t, r, true);
            };
            function onceWrapper() {
                if (!this.fired) {
                    this.target.removeListener(this.type, this.wrapFn);
                    this.fired = true;
                    if (arguments.length === 0) return this.listener.call(this.target);
                    return this.listener.apply(this.target, arguments);
                }
            }
            function _onceWrap(e, t, r) {
                var n = {
                    fired: false,
                    wrapFn: undefined,
                    target: e,
                    type: t,
                    listener: r
                };
                var i = onceWrapper.bind(n);
                i.listener = r;
                n.wrapFn = i;
                return i;
            }
            EventEmitter.prototype.once = function e(t, r) {
                checkListener(r);
                this.on(t, _onceWrap(this, t, r));
                return this;
            };
            EventEmitter.prototype.prependOnceListener = function e(t, r) {
                checkListener(r);
                this.prependListener(t, _onceWrap(this, t, r));
                return this;
            };
            EventEmitter.prototype.removeListener = function e(t, r) {
                var n, i, a, o, f;
                checkListener(r);
                i = this._events;
                if (i === undefined) return this;
                n = i[t];
                if (n === undefined) return this;
                if (n === r || n.listener === r) {
                    if (--this._eventsCount === 0) this._events = Object.create(null);
                    else {
                        delete i[t];
                        if (i.removeListener) this.emit('removeListener', t, n.listener || r);
                    }
                } else if (typeof n !== 'function') {
                    a = -1;
                    for(o = n.length - 1; o >= 0; o--){
                        if (n[o] === r || n[o].listener === r) {
                            f = n[o].listener;
                            a = o;
                            break;
                        }
                    }
                    if (a < 0) return this;
                    if (a === 0) n.shift();
                    else {
                        spliceOne(n, a);
                    }
                    if (n.length === 1) i[t] = n[0];
                    if (i.removeListener !== undefined) this.emit('removeListener', t, f || r);
                }
                return this;
            };
            EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
            EventEmitter.prototype.removeAllListeners = function e(t) {
                var r, n, i;
                n = this._events;
                if (n === undefined) return this;
                if (n.removeListener === undefined) {
                    if (arguments.length === 0) {
                        this._events = Object.create(null);
                        this._eventsCount = 0;
                    } else if (n[t] !== undefined) {
                        if (--this._eventsCount === 0) this._events = Object.create(null);
                        else delete n[t];
                    }
                    return this;
                }
                if (arguments.length === 0) {
                    var a = Object.keys(n);
                    var o;
                    for(i = 0; i < a.length; ++i){
                        o = a[i];
                        if (o === 'removeListener') continue;
                        this.removeAllListeners(o);
                    }
                    this.removeAllListeners('removeListener');
                    this._events = Object.create(null);
                    this._eventsCount = 0;
                    return this;
                }
                r = n[t];
                if (typeof r === 'function') {
                    this.removeListener(t, r);
                } else if (r !== undefined) {
                    for(i = r.length - 1; i >= 0; i--){
                        this.removeListener(t, r[i]);
                    }
                }
                return this;
            };
            function _listeners(e, t, r) {
                var n = e._events;
                if (n === undefined) return [];
                var i = n[t];
                if (i === undefined) return [];
                if (typeof i === 'function') return r ? [
                    i.listener || i
                ] : [
                    i
                ];
                return r ? unwrapListeners(i) : arrayClone(i, i.length);
            }
            EventEmitter.prototype.listeners = function e(t) {
                return _listeners(this, t, true);
            };
            EventEmitter.prototype.rawListeners = function e(t) {
                return _listeners(this, t, false);
            };
            EventEmitter.listenerCount = function(e, t) {
                if (typeof e.listenerCount === 'function') {
                    return e.listenerCount(t);
                } else {
                    return listenerCount$1.call(e, t);
                }
            };
            EventEmitter.prototype.listenerCount = listenerCount$1;
            function listenerCount$1(e) {
                var t = this._events;
                if (t !== undefined) {
                    var r = t[e];
                    if (typeof r === 'function') {
                        return 1;
                    } else if (r !== undefined) {
                        return r.length;
                    }
                }
                return 0;
            }
            EventEmitter.prototype.eventNames = function e() {
                return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
            };
            function arrayClone(e, t) {
                var r = new Array(t);
                for(var n = 0; n < t; ++n){
                    r[n] = e[n];
                }
                return r;
            }
            function spliceOne(e, t) {
                for(; t + 1 < e.length; t++){
                    e[t] = e[t + 1];
                }
                e.pop();
            }
            function unwrapListeners(e) {
                var t = new Array(e.length);
                for(var r = 0; r < t.length; ++r){
                    t[r] = e[r].listener || e[r];
                }
                return t;
            }
            function once(e, t) {
                return new Promise(function(r, n) {
                    function i(r) {
                        e.removeListener(t, a);
                        n(r);
                    }
                    function a() {
                        if (typeof e.removeListener === 'function') {
                            e.removeListener('error', i);
                        }
                        r([].slice.call(arguments));
                    }
                    eventTargetAgnosticAddListener(e, t, a, {
                        once: true
                    });
                    if (t !== 'error') {
                        addErrorHandlerIfEventEmitter(e, i, {
                            once: true
                        });
                    }
                });
            }
            function addErrorHandlerIfEventEmitter(e, t, r) {
                if (typeof e.on === 'function') {
                    eventTargetAgnosticAddListener(e, 'error', t, r);
                }
            }
            function eventTargetAgnosticAddListener(e, t, r, n) {
                if (typeof e.on === 'function') {
                    if (n.once) {
                        e.once(t, r);
                    } else {
                        e.on(t, r);
                    }
                } else if (typeof e.addEventListener === 'function') {
                    e.addEventListener(t, function i(a) {
                        if (n.once) {
                            e.removeEventListener(t, i);
                        }
                        r(a);
                    });
                } else {
                    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof e);
                }
            }
            var EE = events.exports;
            var util$1 = {};
            var types = {};
            var shams$1 = function e() {
                if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') {
                    return false;
                }
                if (typeof Symbol.iterator === 'symbol') {
                    return true;
                }
                var t = {};
                var r = Symbol('test');
                var n = Object(r);
                if (typeof r === 'string') {
                    return false;
                }
                if (Object.prototype.toString.call(r) !== '[object Symbol]') {
                    return false;
                }
                if (Object.prototype.toString.call(n) !== '[object Symbol]') {
                    return false;
                }
                var i = 42;
                t[r] = i;
                for(r in t){
                    return false;
                }
                if (typeof Object.keys === 'function' && Object.keys(t).length !== 0) {
                    return false;
                }
                if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(t).length !== 0) {
                    return false;
                }
                var a = Object.getOwnPropertySymbols(t);
                if (a.length !== 1 || a[0] !== r) {
                    return false;
                }
                if (!Object.prototype.propertyIsEnumerable.call(t, r)) {
                    return false;
                }
                if (typeof Object.getOwnPropertyDescriptor === 'function') {
                    var o = Object.getOwnPropertyDescriptor(t, r);
                    if (o.value !== i || o.enumerable !== true) {
                        return false;
                    }
                }
                return true;
            };
            var origSymbol = typeof Symbol !== 'undefined' && Symbol;
            var hasSymbolSham = shams$1;
            var hasSymbols$3 = function e() {
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
            var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
            var slice$1 = Array.prototype.slice;
            var toStr$4 = Object.prototype.toString;
            var funcType = '[object Function]';
            var implementation$8 = function e(t) {
                var r = this;
                if (typeof r !== 'function' || toStr$4.call(r) !== funcType) {
                    throw new TypeError(ERROR_MESSAGE + r);
                }
                var n = slice$1.call(arguments, 1);
                var i;
                var a = function e() {
                    if (this instanceof i) {
                        var a = r.apply(this, n.concat(slice$1.call(arguments)));
                        if (Object(a) === a) {
                            return a;
                        }
                        return this;
                    } else {
                        return r.apply(t, n.concat(slice$1.call(arguments)));
                    }
                };
                var o = Math.max(0, r.length - n.length);
                var f = [];
                for(var s = 0; s < o; s++){
                    f.push('$' + s);
                }
                i = Function('binder', 'return function (' + f.join(',') + '){ return binder.apply(this,arguments); }')(a);
                if (r.prototype) {
                    var u = function e() {};
                    u.prototype = r.prototype;
                    i.prototype = new u();
                    u.prototype = null;
                }
                return i;
            };
            var implementation$7 = implementation$8;
            var functionBind = Function.prototype.bind || implementation$7;
            var bind$1 = functionBind;
            var src = bind$1.call(Function.call, Object.prototype.hasOwnProperty);
            var undefined$1;
            var $SyntaxError = SyntaxError;
            var $Function = Function;
            var $TypeError = TypeError;
            var getEvalledConstructor = function e(t) {
                try {
                    return $Function('"use strict"; return (' + t + ').constructor;')();
                } catch (r) {}
            };
            var $gOPD$1 = Object.getOwnPropertyDescriptor;
            if ($gOPD$1) {
                try {
                    $gOPD$1({}, '');
                } catch (e) {
                    $gOPD$1 = null;
                }
            }
            var throwTypeError = function e() {
                throw new $TypeError();
            };
            var ThrowTypeError = $gOPD$1 ? function() {
                try {
                    arguments.callee;
                    return throwTypeError;
                } catch (t) {
                    try {
                        return $gOPD$1(arguments, 'callee').get;
                    } catch (e) {
                        return throwTypeError;
                    }
                }
            }() : throwTypeError;
            var hasSymbols$2 = hasSymbols$3();
            var getProto$1 = Object.getPrototypeOf || function(e) {
                return e.__proto__;
            };
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
            var doEval = function e(t) {
                var r;
                if (t === '%AsyncFunction%') {
                    r = getEvalledConstructor('async function () {}');
                } else if (t === '%GeneratorFunction%') {
                    r = getEvalledConstructor('function* () {}');
                } else if (t === '%AsyncGeneratorFunction%') {
                    r = getEvalledConstructor('async function* () {}');
                } else if (t === '%AsyncGenerator%') {
                    var n = e('%AsyncGeneratorFunction%');
                    if (n) {
                        r = n.prototype;
                    }
                } else if (t === '%AsyncIteratorPrototype%') {
                    var i = e('%AsyncGenerator%');
                    if (i) {
                        r = getProto$1(i.prototype);
                    }
                }
                INTRINSICS[t] = r;
                return r;
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
            var stringToPath = function e(t) {
                var r = $strSlice(t, 0, 1);
                var n = $strSlice(t, -1);
                if (r === '%' && n !== '%') {
                    throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
                } else if (n === '%' && r !== '%') {
                    throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
                }
                var i = [];
                $replace(t, rePropName, function(e, t, r, n) {
                    i[i.length] = r ? $replace(n, reEscapeChar, '$1') : t || e;
                });
                return i;
            };
            var getBaseIntrinsic = function e(t, r) {
                var n = t;
                var i;
                if (hasOwn$1(LEGACY_ALIASES, n)) {
                    i = LEGACY_ALIASES[n];
                    n = '%' + i[0] + '%';
                }
                if (hasOwn$1(INTRINSICS, n)) {
                    var a = INTRINSICS[n];
                    if (a === needsEval) {
                        a = doEval(n);
                    }
                    if (typeof a === 'undefined' && !r) {
                        throw new $TypeError('intrinsic ' + t + ' exists, but is not available. Please file an issue!');
                    }
                    return {
                        alias: i,
                        name: n,
                        value: a
                    };
                }
                throw new $SyntaxError('intrinsic ' + t + ' does not exist!');
            };
            var getIntrinsic = function e(t, r) {
                if (typeof t !== 'string' || t.length === 0) {
                    throw new $TypeError('intrinsic name must be a non-empty string');
                }
                if (arguments.length > 1 && typeof r !== 'boolean') {
                    throw new $TypeError('"allowMissing" argument must be a boolean');
                }
                var n = stringToPath(t);
                var i = n.length > 0 ? n[0] : '';
                var a = getBaseIntrinsic('%' + i + '%', r);
                var o = a.name;
                var f = a.value;
                var s = false;
                var u = a.alias;
                if (u) {
                    i = u[0];
                    $spliceApply(n, $concat([
                        0,
                        1
                    ], u));
                }
                for(var l = 1, c = true; l < n.length; l += 1){
                    var h = n[l];
                    var p = $strSlice(h, 0, 1);
                    var d = $strSlice(h, -1);
                    if ((p === '"' || p === "'" || p === '`' || d === '"' || d === "'" || d === '`') && p !== d) {
                        throw new $SyntaxError('property names with quotes must have matching quotes');
                    }
                    if (h === 'constructor' || !c) {
                        s = true;
                    }
                    i += '.' + h;
                    o = '%' + i + '%';
                    if (hasOwn$1(INTRINSICS, o)) {
                        f = INTRINSICS[o];
                    } else if (f != null) {
                        if (!(h in f)) {
                            if (!r) {
                                throw new $TypeError('base intrinsic for ' + t + ' exists, but the property is not available.');
                            }
                            return void undefined$1;
                        }
                        if ($gOPD$1 && l + 1 >= n.length) {
                            var v = $gOPD$1(f, h);
                            c = !!v;
                            if (c && 'get' in v && !('originalValue' in v.get)) {
                                f = v.get;
                            } else {
                                f = f[h];
                            }
                        } else {
                            c = hasOwn$1(f, h);
                            f = f[h];
                        }
                        if (c && !s) {
                            INTRINSICS[o] = f;
                        }
                    }
                }
                return f;
            };
            var callBind$3 = {
                exports: {}
            };
            (function(e) {
                var t = functionBind;
                var r = getIntrinsic;
                var n = r('%Function.prototype.apply%');
                var i = r('%Function.prototype.call%');
                var a = r('%Reflect.apply%', true) || t.call(i, n);
                var o = r('%Object.getOwnPropertyDescriptor%', true);
                var f = r('%Object.defineProperty%', true);
                var s = r('%Math.max%');
                if (f) {
                    try {
                        f({}, 'a', {
                            value: 1
                        });
                    } catch (u) {
                        f = null;
                    }
                }
                e.exports = function e(r) {
                    var n = a(t, i, arguments);
                    if (o && f) {
                        var u = o(n, 'length');
                        if (u.configurable) {
                            f(n, 'length', {
                                value: 1 + s(0, r.length - (arguments.length - 1))
                            });
                        }
                    }
                    return n;
                };
                var l = function e() {
                    return a(t, n, arguments);
                };
                if (f) {
                    f(e.exports, 'apply', {
                        value: l
                    });
                } else {
                    e.exports.apply = l;
                }
            })(callBind$3);
            var GetIntrinsic$1 = getIntrinsic;
            var callBind$2 = callBind$3.exports;
            var $indexOf$1 = callBind$2(GetIntrinsic$1('String.prototype.indexOf'));
            var callBound$3 = function e(t, r) {
                var n = GetIntrinsic$1(t, !!r);
                if (typeof n === 'function' && $indexOf$1(t, '.prototype.') > -1) {
                    return callBind$2(n);
                }
                return n;
            };
            var hasToStringTag$3 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
            var callBound$2 = callBound$3;
            var $toString$2 = callBound$2('Object.prototype.toString');
            var isStandardArguments = function e(t) {
                if (hasToStringTag$3 && t && typeof t === 'object' && Symbol.toStringTag in t) {
                    return false;
                }
                return $toString$2(t) === '[object Arguments]';
            };
            var isLegacyArguments = function e(t) {
                if (isStandardArguments(t)) {
                    return true;
                }
                return t !== null && typeof t === 'object' && typeof t.length === 'number' && t.length >= 0 && $toString$2(t) !== '[object Array]' && $toString$2(t.callee) === '[object Function]';
            };
            var supportsStandardArguments = function() {
                return isStandardArguments(arguments);
            }();
            isStandardArguments.isLegacyArguments = isLegacyArguments;
            var isArguments$1 = supportsStandardArguments ? isStandardArguments : isLegacyArguments;
            var hasSymbols$1 = shams$1;
            var shams = function e() {
                return hasSymbols$1() && !!Symbol.toStringTag;
            };
            var toStr$3 = Object.prototype.toString;
            var fnToStr = Function.prototype.toString;
            var isFnRegex = /^\s*(?:function)?\*/;
            var hasToStringTag$2 = shams();
            var getProto = Object.getPrototypeOf;
            var getGeneratorFunc = function e() {
                if (!hasToStringTag$2) {
                    return false;
                }
                try {
                    return Function('return function*() {}')();
                } catch (t) {}
            };
            var GeneratorFunction;
            var isGeneratorFunction = function e(t) {
                if (typeof t !== 'function') {
                    return false;
                }
                if (isFnRegex.test(fnToStr.call(t))) {
                    return true;
                }
                if (!hasToStringTag$2) {
                    var r = toStr$3.call(t);
                    return r === '[object GeneratorFunction]';
                }
                if (!getProto) {
                    return false;
                }
                if (typeof GeneratorFunction === 'undefined') {
                    var n = getGeneratorFunc();
                    GeneratorFunction = n ? getProto(n) : false;
                }
                return getProto(t) === GeneratorFunction;
            };
            var hasOwn = Object.prototype.hasOwnProperty;
            var toString = Object.prototype.toString;
            var foreach = function e(t, r, n) {
                if (toString.call(r) !== '[object Function]') {
                    throw new TypeError('iterator must be a function');
                }
                var i = t.length;
                if (i === +i) {
                    for(var a = 0; a < i; a++){
                        r.call(n, t[a], a, t);
                    }
                } else {
                    for(var o in t){
                        if (hasOwn.call(t, o)) {
                            r.call(n, t[o], o, t);
                        }
                    }
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
            var g$2 = typeof globalThis === 'undefined' ? commonjsGlobal : globalThis;
            var availableTypedArrays$2 = function e() {
                var t = [];
                for(var r = 0; r < possibleNames.length; r++){
                    if (typeof g$2[possibleNames[r]] === 'function') {
                        t[t.length] = possibleNames[r];
                    }
                }
                return t;
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
            var g$1 = typeof globalThis === 'undefined' ? commonjsGlobal : globalThis;
            var typedArrays$1 = availableTypedArrays$1();
            var $indexOf = callBound$1('Array.prototype.indexOf', true) || function e(t, r) {
                for(var n = 0; n < t.length; n += 1){
                    if (t[n] === r) {
                        return n;
                    }
                }
                return -1;
            };
            var $slice$1 = callBound$1('String.prototype.slice');
            var toStrTags$1 = {};
            var gOPD$1 = getOwnPropertyDescriptor;
            var getPrototypeOf$1 = Object.getPrototypeOf;
            if (hasToStringTag$1 && gOPD$1 && getPrototypeOf$1) {
                forEach$2(typedArrays$1, function(e) {
                    var t = new g$1[e]();
                    if (Symbol.toStringTag in t) {
                        var r = getPrototypeOf$1(t);
                        var n = gOPD$1(r, Symbol.toStringTag);
                        if (!n) {
                            var i = getPrototypeOf$1(r);
                            n = gOPD$1(i, Symbol.toStringTag);
                        }
                        toStrTags$1[e] = n.get;
                    }
                });
            }
            var tryTypedArrays$1 = function e(t) {
                var r = false;
                forEach$2(toStrTags$1, function(e, n) {
                    if (!r) {
                        try {
                            r = e.call(t) === n;
                        } catch (i) {}
                    }
                });
                return r;
            };
            var isTypedArray$1 = function e(t) {
                if (!t || typeof t !== 'object') {
                    return false;
                }
                if (!hasToStringTag$1 || !(Symbol.toStringTag in t)) {
                    var r = $slice$1($toString$1(t), 8, -1);
                    return $indexOf(typedArrays$1, r) > -1;
                }
                if (!gOPD$1) {
                    return false;
                }
                return tryTypedArrays$1(t);
            };
            var forEach$1 = foreach;
            var availableTypedArrays = availableTypedArrays$2;
            var callBound = callBound$3;
            var $toString = callBound('Object.prototype.toString');
            var hasToStringTag = shams();
            var g = typeof globalThis === 'undefined' ? commonjsGlobal : globalThis;
            var typedArrays = availableTypedArrays();
            var $slice = callBound('String.prototype.slice');
            var toStrTags = {};
            var gOPD = getOwnPropertyDescriptor;
            var getPrototypeOf = Object.getPrototypeOf;
            if (hasToStringTag && gOPD && getPrototypeOf) {
                forEach$1(typedArrays, function(e) {
                    if (typeof g[e] === 'function') {
                        var t = new g[e]();
                        if (Symbol.toStringTag in t) {
                            var r = getPrototypeOf(t);
                            var n = gOPD(r, Symbol.toStringTag);
                            if (!n) {
                                var i = getPrototypeOf(r);
                                n = gOPD(i, Symbol.toStringTag);
                            }
                            toStrTags[e] = n.get;
                        }
                    }
                });
            }
            var tryTypedArrays = function e(t) {
                var r = false;
                forEach$1(toStrTags, function(e, n) {
                    if (!r) {
                        try {
                            var i = e.call(t);
                            if (i === n) {
                                r = i;
                            }
                        } catch (a) {}
                    }
                });
                return r;
            };
            var isTypedArray = isTypedArray$1;
            var whichTypedArray = function e(t) {
                if (!isTypedArray(t)) {
                    return false;
                }
                if (!hasToStringTag || !(Symbol.toStringTag in t)) {
                    return $slice($toString(t), 8, -1);
                }
                return tryTypedArrays(t);
            };
            (function(e) {
                var t = isArguments$1;
                var r = isGeneratorFunction;
                var n = whichTypedArray;
                var i = isTypedArray$1;
                function a(e) {
                    return e.call.bind(e);
                }
                var o = typeof BigInt !== 'undefined';
                var f = typeof Symbol !== 'undefined';
                var s = a(Object.prototype.toString);
                var u = a(Number.prototype.valueOf);
                var l = a(String.prototype.valueOf);
                var c = a(Boolean.prototype.valueOf);
                if (o) {
                    var h = a(BigInt.prototype.valueOf);
                }
                if (f) {
                    var p = a(Symbol.prototype.valueOf);
                }
                function d(e, t) {
                    if (typeof e !== 'object') {
                        return false;
                    }
                    try {
                        t(e);
                        return true;
                    } catch (r) {
                        return false;
                    }
                }
                e.isArgumentsObject = t;
                e.isGeneratorFunction = r;
                e.isTypedArray = i;
                function v(e) {
                    return typeof Promise !== 'undefined' && e instanceof Promise || e !== null && typeof e === 'object' && typeof e.then === 'function' && typeof e.catch === 'function';
                }
                e.isPromise = v;
                function y(e) {
                    if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
                        return ArrayBuffer.isView(e);
                    }
                    return i(e) || D(e);
                }
                e.isArrayBufferView = y;
                function g(e) {
                    return n(e) === 'Uint8Array';
                }
                e.isUint8Array = g;
                function b(e) {
                    return n(e) === 'Uint8ClampedArray';
                }
                e.isUint8ClampedArray = b;
                function w(e) {
                    return n(e) === 'Uint16Array';
                }
                e.isUint16Array = w;
                function _(e) {
                    return n(e) === 'Uint32Array';
                }
                e.isUint32Array = _;
                function m(e) {
                    return n(e) === 'Int8Array';
                }
                e.isInt8Array = m;
                function E(e) {
                    return n(e) === 'Int16Array';
                }
                e.isInt16Array = E;
                function k(e) {
                    return n(e) === 'Int32Array';
                }
                e.isInt32Array = k;
                function A(e) {
                    return n(e) === 'Float32Array';
                }
                e.isFloat32Array = A;
                function S(e) {
                    return n(e) === 'Float64Array';
                }
                e.isFloat64Array = S;
                function O(e) {
                    return n(e) === 'BigInt64Array';
                }
                e.isBigInt64Array = O;
                function x(e) {
                    return n(e) === 'BigUint64Array';
                }
                e.isBigUint64Array = x;
                function R(e) {
                    return s(e) === '[object Map]';
                }
                R.working = typeof Map !== 'undefined' && R(new Map());
                function T(e) {
                    if (typeof Map === 'undefined') {
                        return false;
                    }
                    return R.working ? R(e) : e instanceof Map;
                }
                e.isMap = T;
                function j(e) {
                    return s(e) === '[object Set]';
                }
                j.working = typeof Set !== 'undefined' && j(new Set());
                function I(e) {
                    if (typeof Set === 'undefined') {
                        return false;
                    }
                    return j.working ? j(e) : e instanceof Set;
                }
                e.isSet = I;
                function L(e) {
                    return s(e) === '[object WeakMap]';
                }
                L.working = typeof WeakMap !== 'undefined' && L(new WeakMap());
                function P(e) {
                    if (typeof WeakMap === 'undefined') {
                        return false;
                    }
                    return L.working ? L(e) : e instanceof WeakMap;
                }
                e.isWeakMap = P;
                function U(e) {
                    return s(e) === '[object WeakSet]';
                }
                U.working = typeof WeakSet !== 'undefined' && U(new WeakSet());
                function B(e) {
                    return U(e);
                }
                e.isWeakSet = B;
                function N(e) {
                    return s(e) === '[object ArrayBuffer]';
                }
                N.working = typeof ArrayBuffer !== 'undefined' && N(new ArrayBuffer());
                function M(e) {
                    if (typeof ArrayBuffer === 'undefined') {
                        return false;
                    }
                    return N.working ? N(e) : e instanceof ArrayBuffer;
                }
                e.isArrayBuffer = M;
                function F(e) {
                    return s(e) === '[object DataView]';
                }
                F.working = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined' && F(new DataView(new ArrayBuffer(1), 0, 1));
                function D(e) {
                    if (typeof DataView === 'undefined') {
                        return false;
                    }
                    return F.working ? F(e) : e instanceof DataView;
                }
                e.isDataView = D;
                var z = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : undefined;
                function C(e) {
                    return s(e) === '[object SharedArrayBuffer]';
                }
                function Z(e) {
                    if (typeof z === 'undefined') {
                        return false;
                    }
                    if (typeof C.working === 'undefined') {
                        C.working = C(new z());
                    }
                    return C.working ? C(e) : e instanceof z;
                }
                e.isSharedArrayBuffer = Z;
                function q(e) {
                    return s(e) === '[object AsyncFunction]';
                }
                e.isAsyncFunction = q;
                function W(e) {
                    return s(e) === '[object Map Iterator]';
                }
                e.isMapIterator = W;
                function G(e) {
                    return s(e) === '[object Set Iterator]';
                }
                e.isSetIterator = G;
                function Y(e) {
                    return s(e) === '[object Generator]';
                }
                e.isGeneratorObject = Y;
                function H(e) {
                    return s(e) === '[object WebAssembly.Module]';
                }
                e.isWebAssemblyCompiledModule = H;
                function V(e) {
                    return d(e, u);
                }
                e.isNumberObject = V;
                function $(e) {
                    return d(e, l);
                }
                e.isStringObject = $;
                function K(e) {
                    return d(e, c);
                }
                e.isBooleanObject = K;
                function X(e) {
                    return o && d(e, h);
                }
                e.isBigIntObject = X;
                function J(e) {
                    return f && d(e, p);
                }
                e.isSymbolObject = J;
                function Q(e) {
                    return V(e) || $(e) || K(e) || X(e) || J(e);
                }
                e.isBoxedPrimitive = Q;
                function ee(e) {
                    return typeof Uint8Array !== 'undefined' && (M(e) || Z(e));
                }
                e.isAnyArrayBuffer = ee;
                [
                    'isProxy',
                    'isExternal',
                    'isModuleNamespaceObject'
                ].forEach(function(t) {
                    Object.defineProperty(e, t, {
                        enumerable: false,
                        value: function e() {
                            throw new Error(t + ' is not supported in userland');
                        }
                    });
                });
            })(types);
            var isBufferBrowser = function e(t) {
                return t && typeof t === 'object' && typeof t.copy === 'function' && typeof t.fill === 'function' && typeof t.readUInt8 === 'function';
            };
            var inherits_browser = {
                exports: {}
            };
            if (typeof Object.create === 'function') {
                inherits_browser.exports = function e(t, r) {
                    if (r) {
                        t.super_ = r;
                        t.prototype = Object.create(r.prototype, {
                            constructor: {
                                value: t,
                                enumerable: false,
                                writable: true,
                                configurable: true
                            }
                        });
                    }
                };
            } else {
                inherits_browser.exports = function e(t, r) {
                    if (r) {
                        t.super_ = r;
                        var n = function e() {};
                        n.prototype = r.prototype;
                        t.prototype = new n();
                        t.prototype.constructor = t;
                    }
                };
            }
            (function(e) {
                var t = Object.getOwnPropertyDescriptors || function e(t) {
                    var r = Object.keys(t);
                    var n = {};
                    for(var i = 0; i < r.length; i++){
                        n[r[i]] = Object.getOwnPropertyDescriptor(t, r[i]);
                    }
                    return n;
                };
                var r = /%[sdj%]/g;
                e.format = function(e) {
                    if (!m(e)) {
                        var t = [];
                        for(var n = 0; n < arguments.length; n++){
                            t.push(o(arguments[n]));
                        }
                        return t.join(' ');
                    }
                    var n = 1;
                    var i = arguments;
                    var a = i.length;
                    var f = String(e).replace(r, function(e) {
                        if (e === '%%') return '%';
                        if (n >= a) return e;
                        switch(e){
                            case '%s':
                                return String(i[n++]);
                            case '%d':
                                return Number(i[n++]);
                            case '%j':
                                try {
                                    return JSON.stringify(i[n++]);
                                } catch (t) {
                                    return '[Circular]';
                                }
                            default:
                                return e;
                        }
                    });
                    for(var s = i[n]; n < a; s = i[++n]){
                        if (b(s) || !S(s)) {
                            f += ' ' + s;
                        } else {
                            f += ' ' + o(s);
                        }
                    }
                    return f;
                };
                e.deprecate = function(t, r) {
                    if (typeof browser$1$1 !== 'undefined' && browser$1$1.noDeprecation === true) {
                        return t;
                    }
                    if (typeof browser$1$1 === 'undefined') {
                        return function() {
                            return e.deprecate(t, r).apply(this, arguments);
                        };
                    }
                    var n = false;
                    function i() {
                        if (!n) {
                            {
                                console.error(r);
                            }
                            n = true;
                        }
                        return t.apply(this, arguments);
                    }
                    return i;
                };
                var n = {};
                var i = /^$/;
                if (browser$1$1.env.NODE_DEBUG) {
                    var a = browser$1$1.env.NODE_DEBUG;
                    a = a.replace(/[|\\{}()[\]^$+?.]/g, '\\$&').replace(/\*/g, '.*').replace(/,/g, '$|^').toUpperCase();
                    i = new RegExp('^' + a + '$', 'i');
                }
                e.debuglog = function(t) {
                    t = t.toUpperCase();
                    if (!n[t]) {
                        if (i.test(t)) {
                            var r = browser$1$1.pid;
                            n[t] = function() {
                                var n = e.format.apply(e, arguments);
                                console.error('%s %d: %s', t, r, n);
                            };
                        } else {
                            n[t] = function() {};
                        }
                    }
                    return n[t];
                };
                function o(t, r) {
                    var n = {
                        seen: [],
                        stylize: s
                    };
                    if (arguments.length >= 3) n.depth = arguments[2];
                    if (arguments.length >= 4) n.colors = arguments[3];
                    if (g(r)) {
                        n.showHidden = r;
                    } else if (r) {
                        e._extend(n, r);
                    }
                    if (k(n.showHidden)) n.showHidden = false;
                    if (k(n.depth)) n.depth = 2;
                    if (k(n.colors)) n.colors = false;
                    if (k(n.customInspect)) n.customInspect = true;
                    if (n.colors) n.stylize = f;
                    return l(n, t, n.depth);
                }
                e.inspect = o;
                o.colors = {
                    'bold': [
                        1,
                        22
                    ],
                    'italic': [
                        3,
                        23
                    ],
                    'underline': [
                        4,
                        24
                    ],
                    'inverse': [
                        7,
                        27
                    ],
                    'white': [
                        37,
                        39
                    ],
                    'grey': [
                        90,
                        39
                    ],
                    'black': [
                        30,
                        39
                    ],
                    'blue': [
                        34,
                        39
                    ],
                    'cyan': [
                        36,
                        39
                    ],
                    'green': [
                        32,
                        39
                    ],
                    'magenta': [
                        35,
                        39
                    ],
                    'red': [
                        31,
                        39
                    ],
                    'yellow': [
                        33,
                        39
                    ]
                };
                o.styles = {
                    'special': 'cyan',
                    'number': 'yellow',
                    'boolean': 'yellow',
                    'undefined': 'grey',
                    'null': 'bold',
                    'string': 'green',
                    'date': 'magenta',
                    'regexp': 'red'
                };
                function f(e, t) {
                    var r = o.styles[t];
                    if (r) {
                        return "\x1B[" + o.colors[r][0] + 'm' + e + "\x1B[" + o.colors[r][1] + 'm';
                    } else {
                        return e;
                    }
                }
                function s(e, t) {
                    return e;
                }
                function u(e) {
                    var t = {};
                    e.forEach(function(e, r) {
                        t[e] = true;
                    });
                    return t;
                }
                function l(t, r, n) {
                    if (t.customInspect && r && R(r.inspect) && r.inspect !== e.inspect && !(r.constructor && r.constructor.prototype === r)) {
                        var i = r.inspect(n, t);
                        if (!m(i)) {
                            i = l(t, i, n);
                        }
                        return i;
                    }
                    var a = c(t, r);
                    if (a) {
                        return a;
                    }
                    var o = Object.keys(r);
                    var f = u(o);
                    if (t.showHidden) {
                        o = Object.getOwnPropertyNames(r);
                    }
                    if (x(r) && (o.indexOf('message') >= 0 || o.indexOf('description') >= 0)) {
                        return h(r);
                    }
                    if (o.length === 0) {
                        if (R(r)) {
                            var s = r.name ? ': ' + r.name : '';
                            return t.stylize('[Function' + s + ']', 'special');
                        }
                        if (A(r)) {
                            return t.stylize(RegExp.prototype.toString.call(r), 'regexp');
                        }
                        if (O(r)) {
                            return t.stylize(Date.prototype.toString.call(r), 'date');
                        }
                        if (x(r)) {
                            return h(r);
                        }
                    }
                    var g = '', b = false, w = [
                        '{',
                        '}'
                    ];
                    if (y(r)) {
                        b = true;
                        w = [
                            '[',
                            ']'
                        ];
                    }
                    if (R(r)) {
                        var _ = r.name ? ': ' + r.name : '';
                        g = ' [Function' + _ + ']';
                    }
                    if (A(r)) {
                        g = ' ' + RegExp.prototype.toString.call(r);
                    }
                    if (O(r)) {
                        g = ' ' + Date.prototype.toUTCString.call(r);
                    }
                    if (x(r)) {
                        g = ' ' + h(r);
                    }
                    if (o.length === 0 && (!b || r.length == 0)) {
                        return w[0] + g + w[1];
                    }
                    if (n < 0) {
                        if (A(r)) {
                            return t.stylize(RegExp.prototype.toString.call(r), 'regexp');
                        } else {
                            return t.stylize('[Object]', 'special');
                        }
                    }
                    t.seen.push(r);
                    var E;
                    if (b) {
                        E = p(t, r, n, f, o);
                    } else {
                        E = o.map(function(e) {
                            return d(t, r, n, f, e, b);
                        });
                    }
                    t.seen.pop();
                    return v(E, g, w);
                }
                function c(e, t) {
                    if (k(t)) return e.stylize('undefined', 'undefined');
                    if (m(t)) {
                        var r = '\'' + JSON.stringify(t).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
                        return e.stylize(r, 'string');
                    }
                    if (_(t)) return e.stylize('' + t, 'number');
                    if (g(t)) return e.stylize('' + t, 'boolean');
                    if (b(t)) return e.stylize('null', 'null');
                }
                function h(e) {
                    return '[' + Error.prototype.toString.call(e) + ']';
                }
                function p(e, t, r, n, i) {
                    var a = [];
                    for(var o = 0, f = t.length; o < f; ++o){
                        if (U(t, String(o))) {
                            a.push(d(e, t, r, n, String(o), true));
                        } else {
                            a.push('');
                        }
                    }
                    i.forEach(function(i) {
                        if (!i.match(/^\d+$/)) {
                            a.push(d(e, t, r, n, i, true));
                        }
                    });
                    return a;
                }
                function d(e, t, r, n, i, a) {
                    var o, f, s;
                    s = Object.getOwnPropertyDescriptor(t, i) || {
                        value: t[i]
                    };
                    if (s.get) {
                        if (s.set) {
                            f = e.stylize('[Getter/Setter]', 'special');
                        } else {
                            f = e.stylize('[Getter]', 'special');
                        }
                    } else {
                        if (s.set) {
                            f = e.stylize('[Setter]', 'special');
                        }
                    }
                    if (!U(n, i)) {
                        o = '[' + i + ']';
                    }
                    if (!f) {
                        if (e.seen.indexOf(s.value) < 0) {
                            if (b(r)) {
                                f = l(e, s.value, null);
                            } else {
                                f = l(e, s.value, r - 1);
                            }
                            if (f.indexOf('\n') > -1) {
                                if (a) {
                                    f = f.split('\n').map(function(e) {
                                        return '  ' + e;
                                    }).join('\n').substr(2);
                                } else {
                                    f = '\n' + f.split('\n').map(function(e) {
                                        return '   ' + e;
                                    }).join('\n');
                                }
                            }
                        } else {
                            f = e.stylize('[Circular]', 'special');
                        }
                    }
                    if (k(o)) {
                        if (a && i.match(/^\d+$/)) {
                            return f;
                        }
                        o = JSON.stringify('' + i);
                        if (o.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                            o = o.substr(1, o.length - 2);
                            o = e.stylize(o, 'name');
                        } else {
                            o = o.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
                            o = e.stylize(o, 'string');
                        }
                    }
                    return o + ': ' + f;
                }
                function v(e, t, r) {
                    var n = e.reduce(function(e, t) {
                        if (t.indexOf('\n') >= 0) ;
                        return e + t.replace(/\u001b\[\d\d?m/g, '').length + 1;
                    }, 0);
                    if (n > 60) {
                        return r[0] + (t === '' ? '' : t + '\n ') + ' ' + e.join(',\n  ') + ' ' + r[1];
                    }
                    return r[0] + t + ' ' + e.join(', ') + ' ' + r[1];
                }
                e.types = types;
                function y(e) {
                    return Array.isArray(e);
                }
                e.isArray = y;
                function g(e) {
                    return typeof e === 'boolean';
                }
                e.isBoolean = g;
                function b(e) {
                    return e === null;
                }
                e.isNull = b;
                function w(e) {
                    return e == null;
                }
                e.isNullOrUndefined = w;
                function _(e) {
                    return typeof e === 'number';
                }
                e.isNumber = _;
                function m(e) {
                    return typeof e === 'string';
                }
                e.isString = m;
                function E(e) {
                    return typeof e === 'symbol';
                }
                e.isSymbol = E;
                function k(e) {
                    return e === void 0;
                }
                e.isUndefined = k;
                function A(e) {
                    return S(e) && j(e) === '[object RegExp]';
                }
                e.isRegExp = A;
                e.types.isRegExp = A;
                function S(e) {
                    return typeof e === 'object' && e !== null;
                }
                e.isObject = S;
                function O(e) {
                    return S(e) && j(e) === '[object Date]';
                }
                e.isDate = O;
                e.types.isDate = O;
                function x(e) {
                    return S(e) && (j(e) === '[object Error]' || e instanceof Error);
                }
                e.isError = x;
                e.types.isNativeError = x;
                function R(e) {
                    return typeof e === 'function';
                }
                e.isFunction = R;
                function T(e) {
                    return e === null || typeof e === 'boolean' || typeof e === 'number' || typeof e === 'string' || typeof e === 'symbol' || typeof e === 'undefined';
                }
                e.isPrimitive = T;
                e.isBuffer = isBufferBrowser;
                function j(e) {
                    return Object.prototype.toString.call(e);
                }
                function I(e) {
                    return e < 10 ? '0' + e.toString(10) : e.toString(10);
                }
                var L = [
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
                function P() {
                    var e = new Date();
                    var t = [
                        I(e.getHours()),
                        I(e.getMinutes()),
                        I(e.getSeconds())
                    ].join(':');
                    return [
                        e.getDate(),
                        L[e.getMonth()],
                        t
                    ].join(' ');
                }
                e.log = function() {
                    console.log('%s - %s', P(), e.format.apply(e, arguments));
                };
                e.inherits = inherits_browser.exports;
                e._extend = function(e, t) {
                    if (!t || !S(t)) return e;
                    var r = Object.keys(t);
                    var n = r.length;
                    while(n--){
                        e[r[n]] = t[r[n]];
                    }
                    return e;
                };
                function U(e, t) {
                    return Object.prototype.hasOwnProperty.call(e, t);
                }
                var B = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;
                e.promisify = function e(r) {
                    if (typeof r !== 'function') throw new TypeError('The "original" argument must be of type Function');
                    if (B && r[B]) {
                        var n = r[B];
                        if (typeof n !== 'function') {
                            throw new TypeError('The "util.promisify.custom" argument must be of type Function');
                        }
                        Object.defineProperty(n, B, {
                            value: n,
                            enumerable: false,
                            writable: false,
                            configurable: true
                        });
                        return n;
                    }
                    function n() {
                        var e, t;
                        var n = new Promise(function(r, n) {
                            e = r;
                            t = n;
                        });
                        var i = [];
                        for(var a = 0; a < arguments.length; a++){
                            i.push(arguments[a]);
                        }
                        i.push(function(r, n) {
                            if (r) {
                                t(r);
                            } else {
                                e(n);
                            }
                        });
                        try {
                            r.apply(this, i);
                        } catch (o) {
                            t(o);
                        }
                        return n;
                    }
                    Object.setPrototypeOf(n, Object.getPrototypeOf(r));
                    if (B) Object.defineProperty(n, B, {
                        value: n,
                        enumerable: false,
                        writable: false,
                        configurable: true
                    });
                    return Object.defineProperties(n, t(r));
                };
                e.promisify.custom = B;
                function N(e, t) {
                    if (!e) {
                        var r = new Error('Promise was rejected with a falsy value');
                        r.reason = e;
                        e = r;
                    }
                    return t(e);
                }
                function M(e) {
                    if (typeof e !== 'function') {
                        throw new TypeError('The "original" argument must be of type Function');
                    }
                    function r() {
                        var t = [];
                        for(var r = 0; r < arguments.length; r++){
                            t.push(arguments[r]);
                        }
                        var n = t.pop();
                        if (typeof n !== 'function') {
                            throw new TypeError('The last argument must be of type Function');
                        }
                        var i = this;
                        var a = function e() {
                            return n.apply(i, arguments);
                        };
                        e.apply(this, t).then(function(e) {
                            browser$1$1.nextTick(a.bind(null, null, e));
                        }, function(e) {
                            browser$1$1.nextTick(N.bind(null, e, a));
                        });
                    }
                    Object.setPrototypeOf(r, Object.getPrototypeOf(e));
                    Object.defineProperties(r, t(e));
                    return r;
                }
                e.callbackify = M;
            })(util$1);
            var browser = {
                exports: {}
            };
            var process = browser.exports = {};
            var cachedSetTimeout;
            var cachedClearTimeout;
            function defaultSetTimout() {
                throw new Error('setTimeout has not been defined');
            }
            function defaultClearTimeout() {
                throw new Error('clearTimeout has not been defined');
            }
            (function() {
                try {
                    if (typeof setTimeout === 'function') {
                        cachedSetTimeout = setTimeout;
                    } else {
                        cachedSetTimeout = defaultSetTimout;
                    }
                } catch (e) {
                    cachedSetTimeout = defaultSetTimout;
                }
                try {
                    if (typeof clearTimeout === 'function') {
                        cachedClearTimeout = clearTimeout;
                    } else {
                        cachedClearTimeout = defaultClearTimeout;
                    }
                } catch (t) {
                    cachedClearTimeout = defaultClearTimeout;
                }
            })();
            function runTimeout(e) {
                if (cachedSetTimeout === setTimeout) {
                    return setTimeout(e, 0);
                }
                if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                    cachedSetTimeout = setTimeout;
                    return setTimeout(e, 0);
                }
                try {
                    return cachedSetTimeout(e, 0);
                } catch (r) {
                    try {
                        return cachedSetTimeout.call(null, e, 0);
                    } catch (t) {
                        return cachedSetTimeout.call(this, e, 0);
                    }
                }
            }
            function runClearTimeout(e) {
                if (cachedClearTimeout === clearTimeout) {
                    return clearTimeout(e);
                }
                if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                    cachedClearTimeout = clearTimeout;
                    return clearTimeout(e);
                }
                try {
                    return cachedClearTimeout(e);
                } catch (r) {
                    try {
                        return cachedClearTimeout.call(null, e);
                    } catch (t) {
                        return cachedClearTimeout.call(this, e);
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
                var e = runTimeout(cleanUpNextTick);
                draining = true;
                var t = queue.length;
                while(t){
                    currentQueue = queue;
                    queue = [];
                    while(++queueIndex < t){
                        if (currentQueue) {
                            currentQueue[queueIndex].run();
                        }
                    }
                    queueIndex = -1;
                    t = queue.length;
                }
                currentQueue = null;
                draining = false;
                runClearTimeout(e);
            }
            process.nextTick = function(e) {
                var t = new Array(arguments.length - 1);
                if (arguments.length > 1) {
                    for(var r = 1; r < arguments.length; r++){
                        t[r - 1] = arguments[r];
                    }
                }
                queue.push(new Item(e, t));
                if (queue.length === 1 && !draining) {
                    runTimeout(drainQueue);
                }
            };
            function Item(e, t) {
                this.fun = e;
                this.array = t;
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
            process.listeners = function(e) {
                return [];
            };
            process.binding = function(e) {
                throw new Error('process.binding is not supported');
            };
            process.cwd = function() {
                return '/';
            };
            process.chdir = function(e) {
                throw new Error('process.chdir is not supported');
            };
            process.umask = function() {
                return 0;
            };
            function BufferList() {
                this.head = null;
                this.tail = null;
                this.length = 0;
            }
            BufferList.prototype.push = function(e) {
                var t = {
                    data: e,
                    next: null
                };
                if (this.length > 0) this.tail.next = t;
                else this.head = t;
                this.tail = t;
                ++this.length;
            };
            BufferList.prototype.unshift = function(e) {
                var t = {
                    data: e,
                    next: this.head
                };
                if (this.length === 0) this.tail = t;
                this.head = t;
                ++this.length;
            };
            BufferList.prototype.shift = function() {
                if (this.length === 0) return;
                var e = this.head.data;
                if (this.length === 1) this.head = this.tail = null;
                else this.head = this.head.next;
                --this.length;
                return e;
            };
            BufferList.prototype.clear = function() {
                this.head = this.tail = null;
                this.length = 0;
            };
            BufferList.prototype.join = function(e) {
                if (this.length === 0) return '';
                var t = this.head;
                var r = '' + t.data;
                while(t = t.next){
                    r += e + t.data;
                }
                return r;
            };
            BufferList.prototype.concat = function(e) {
                if (this.length === 0) return buffer.Buffer.alloc(0);
                if (this.length === 1) return this.head.data;
                var t = buffer.Buffer.allocUnsafe(e >>> 0);
                var r = this.head;
                var n = 0;
                while(r){
                    r.data.copy(t, n);
                    n += r.data.length;
                    r = r.next;
                }
                return t;
            };
            var safeBuffer = {
                exports: {}
            };
            (function(e, t) {
                var r = buffer;
                var n = r.Buffer;
                function i(e, t) {
                    for(var r in e){
                        t[r] = e[r];
                    }
                }
                if (n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow) {
                    e.exports = r;
                } else {
                    i(r, t);
                    t.Buffer = a;
                }
                function a(e, t, r) {
                    return n(e, t, r);
                }
                a.prototype = Object.create(n.prototype);
                i(n, a);
                a.from = function(e, t, r) {
                    if (typeof e === 'number') {
                        throw new TypeError('Argument must not be a number');
                    }
                    return n(e, t, r);
                };
                a.alloc = function(e, t, r) {
                    if (typeof e !== 'number') {
                        throw new TypeError('Argument must be a number');
                    }
                    var i = n(e);
                    if (t !== undefined) {
                        if (typeof r === 'string') {
                            i.fill(t, r);
                        } else {
                            i.fill(t);
                        }
                    } else {
                        i.fill(0);
                    }
                    return i;
                };
                a.allocUnsafe = function(e) {
                    if (typeof e !== 'number') {
                        throw new TypeError('Argument must be a number');
                    }
                    return n(e);
                };
                a.allocUnsafeSlow = function(e) {
                    if (typeof e !== 'number') {
                        throw new TypeError('Argument must be a number');
                    }
                    return r.SlowBuffer(e);
                };
            })(safeBuffer, safeBuffer.exports);
            var Buffer = safeBuffer.exports.Buffer;
            var isEncoding = Buffer.isEncoding || function(e) {
                e = '' + e;
                switch(e && e.toLowerCase()){
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
            function _normalizeEncoding(e) {
                if (!e) return 'utf8';
                var t;
                while(true){
                    switch(e){
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
                            return e;
                        default:
                            if (t) return;
                            e = ('' + e).toLowerCase();
                            t = true;
                    }
                }
            }
            function normalizeEncoding(e) {
                var t = _normalizeEncoding(e);
                if (typeof t !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(e))) throw new Error('Unknown encoding: ' + e);
                return t || e;
            }
            var StringDecoder_1 = StringDecoder;
            function StringDecoder(e) {
                this.encoding = normalizeEncoding(e);
                var t;
                switch(this.encoding){
                    case 'utf16le':
                        this.text = utf16Text;
                        this.end = utf16End;
                        t = 4;
                        break;
                    case 'utf8':
                        this.fillLast = utf8FillLast;
                        t = 4;
                        break;
                    case 'base64':
                        this.text = base64Text;
                        this.end = base64End;
                        t = 3;
                        break;
                    default:
                        this.write = simpleWrite;
                        this.end = simpleEnd;
                        return;
                }
                this.lastNeed = 0;
                this.lastTotal = 0;
                this.lastChar = Buffer.allocUnsafe(t);
            }
            StringDecoder.prototype.write = function(e) {
                if (e.length === 0) return '';
                var t;
                var r;
                if (this.lastNeed) {
                    t = this.fillLast(e);
                    if (t === undefined) return '';
                    r = this.lastNeed;
                    this.lastNeed = 0;
                } else {
                    r = 0;
                }
                if (r < e.length) return t ? t + this.text(e, r) : this.text(e, r);
                return t || '';
            };
            StringDecoder.prototype.end = utf8End;
            StringDecoder.prototype.text = utf8Text;
            StringDecoder.prototype.fillLast = function(e) {
                if (this.lastNeed <= e.length) {
                    e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
                    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
                }
                e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length);
                this.lastNeed -= e.length;
            };
            function utf8CheckByte(e) {
                if (e <= 0x7F) return 0;
                else if (e >> 5 === 0x06) return 2;
                else if (e >> 4 === 0x0E) return 3;
                else if (e >> 3 === 0x1E) return 4;
                return e >> 6 === 0x02 ? -1 : -2;
            }
            function utf8CheckIncomplete(e, t, r) {
                var n = t.length - 1;
                if (n < r) return 0;
                var i = utf8CheckByte(t[n]);
                if (i >= 0) {
                    if (i > 0) e.lastNeed = i - 1;
                    return i;
                }
                if (--n < r || i === -2) return 0;
                i = utf8CheckByte(t[n]);
                if (i >= 0) {
                    if (i > 0) e.lastNeed = i - 2;
                    return i;
                }
                if (--n < r || i === -2) return 0;
                i = utf8CheckByte(t[n]);
                if (i >= 0) {
                    if (i > 0) {
                        if (i === 2) i = 0;
                        else e.lastNeed = i - 3;
                    }
                    return i;
                }
                return 0;
            }
            function utf8CheckExtraBytes(e, t, r) {
                if ((t[0] & 0xC0) !== 0x80) {
                    e.lastNeed = 0;
                    return "\uFFFD";
                }
                if (e.lastNeed > 1 && t.length > 1) {
                    if ((t[1] & 0xC0) !== 0x80) {
                        e.lastNeed = 1;
                        return "\uFFFD";
                    }
                    if (e.lastNeed > 2 && t.length > 2) {
                        if ((t[2] & 0xC0) !== 0x80) {
                            e.lastNeed = 2;
                            return "\uFFFD";
                        }
                    }
                }
            }
            function utf8FillLast(e) {
                var t = this.lastTotal - this.lastNeed;
                var r = utf8CheckExtraBytes(this, e);
                if (r !== undefined) return r;
                if (this.lastNeed <= e.length) {
                    e.copy(this.lastChar, t, 0, this.lastNeed);
                    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
                }
                e.copy(this.lastChar, t, 0, e.length);
                this.lastNeed -= e.length;
            }
            function utf8Text(e, t) {
                var r = utf8CheckIncomplete(this, e, t);
                if (!this.lastNeed) return e.toString('utf8', t);
                this.lastTotal = r;
                var n = e.length - (r - this.lastNeed);
                e.copy(this.lastChar, 0, n);
                return e.toString('utf8', t, n);
            }
            function utf8End(e) {
                var t = e && e.length ? this.write(e) : '';
                if (this.lastNeed) return t + "\uFFFD";
                return t;
            }
            function utf16Text(e, t) {
                if ((e.length - t) % 2 === 0) {
                    var r = e.toString('utf16le', t);
                    if (r) {
                        var n = r.charCodeAt(r.length - 1);
                        if (n >= 0xD800 && n <= 0xDBFF) {
                            this.lastNeed = 2;
                            this.lastTotal = 4;
                            this.lastChar[0] = e[e.length - 2];
                            this.lastChar[1] = e[e.length - 1];
                            return r.slice(0, -1);
                        }
                    }
                    return r;
                }
                this.lastNeed = 1;
                this.lastTotal = 2;
                this.lastChar[0] = e[e.length - 1];
                return e.toString('utf16le', t, e.length - 1);
            }
            function utf16End(e) {
                var t = e && e.length ? this.write(e) : '';
                if (this.lastNeed) {
                    var r = this.lastTotal - this.lastNeed;
                    return t + this.lastChar.toString('utf16le', 0, r);
                }
                return t;
            }
            function base64Text(e, t) {
                var r = (e.length - t) % 3;
                if (r === 0) return e.toString('base64', t);
                this.lastNeed = 3 - r;
                this.lastTotal = 3;
                if (r === 1) {
                    this.lastChar[0] = e[e.length - 1];
                } else {
                    this.lastChar[0] = e[e.length - 2];
                    this.lastChar[1] = e[e.length - 1];
                }
                return e.toString('base64', t, e.length - r);
            }
            function base64End(e) {
                var t = e && e.length ? this.write(e) : '';
                if (this.lastNeed) return t + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
                return t;
            }
            function simpleWrite(e) {
                return e.toString(this.encoding);
            }
            function simpleEnd(e) {
                return e && e.length ? this.write(e) : '';
            }
            Readable.ReadableState = ReadableState;
            var debug = util$1.debuglog('stream');
            util$1.inherits(Readable, EE);
            function prependListener(e, t, r) {
                if (typeof e.prependListener === 'function') {
                    return e.prependListener(t, r);
                } else {
                    if (!e._events || !e._events[t]) e.on(t, r);
                    else if (Array.isArray(e._events[t])) e._events[t].unshift(r);
                    else e._events[t] = [
                        r,
                        e._events[t]
                    ];
                }
            }
            function listenerCount(e, t) {
                return e.listeners(t).length;
            }
            function ReadableState(e, t) {
                e = e || {};
                this.objectMode = !!e.objectMode;
                if (t instanceof Duplex) this.objectMode = this.objectMode || !!e.readableObjectMode;
                var r = e.highWaterMark;
                var n = this.objectMode ? 16 : 16 * 1024;
                this.highWaterMark = r || r === 0 ? r : n;
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
                this.defaultEncoding = e.defaultEncoding || 'utf8';
                this.ranOut = false;
                this.awaitDrain = 0;
                this.readingMore = false;
                this.decoder = null;
                this.encoding = null;
                if (e.encoding) {
                    this.decoder = new StringDecoder_1(e.encoding);
                    this.encoding = e.encoding;
                }
            }
            function Readable(e) {
                if (!(this instanceof Readable)) return new Readable(e);
                this._readableState = new ReadableState(e, this);
                this.readable = true;
                if (e && typeof e.read === 'function') this._read = e.read;
                EE.call(this);
            }
            Readable.prototype.push = function(e, t) {
                var r = this._readableState;
                if (!r.objectMode && typeof e === 'string') {
                    t = t || r.defaultEncoding;
                    if (t !== r.encoding) {
                        e = Buffer$1.from(e, t);
                        t = '';
                    }
                }
                return readableAddChunk(this, r, e, t, false);
            };
            Readable.prototype.unshift = function(e) {
                var t = this._readableState;
                return readableAddChunk(this, t, e, '', true);
            };
            Readable.prototype.isPaused = function() {
                return this._readableState.flowing === false;
            };
            function readableAddChunk(e, t, r, n, i) {
                var a = chunkInvalid(t, r);
                if (a) {
                    e.emit('error', a);
                } else if (r === null) {
                    t.reading = false;
                    onEofChunk(e, t);
                } else if (t.objectMode || r && r.length > 0) {
                    if (t.ended && !i) {
                        var o = new Error('stream.push() after EOF');
                        e.emit('error', o);
                    } else if (t.endEmitted && i) {
                        var f = new Error('stream.unshift() after end event');
                        e.emit('error', f);
                    } else {
                        var s;
                        if (t.decoder && !i && !n) {
                            r = t.decoder.write(r);
                            s = !t.objectMode && r.length === 0;
                        }
                        if (!i) t.reading = false;
                        if (!s) {
                            if (t.flowing && t.length === 0 && !t.sync) {
                                e.emit('data', r);
                                e.read(0);
                            } else {
                                t.length += t.objectMode ? 1 : r.length;
                                if (i) t.buffer.unshift(r);
                                else t.buffer.push(r);
                                if (t.needReadable) emitReadable(e);
                            }
                        }
                        maybeReadMore(e, t);
                    }
                } else if (!i) {
                    t.reading = false;
                }
                return needMoreData(t);
            }
            function needMoreData(e) {
                return !e.ended && (e.needReadable || e.length < e.highWaterMark || e.length === 0);
            }
            Readable.prototype.setEncoding = function(e) {
                this._readableState.decoder = new StringDecoder_1(e);
                this._readableState.encoding = e;
                return this;
            };
            var MAX_HWM = 0x800000;
            function computeNewHighWaterMark(e) {
                if (e >= MAX_HWM) {
                    e = MAX_HWM;
                } else {
                    e--;
                    e |= e >>> 1;
                    e |= e >>> 2;
                    e |= e >>> 4;
                    e |= e >>> 8;
                    e |= e >>> 16;
                    e++;
                }
                return e;
            }
            function howMuchToRead(e, t) {
                if (e <= 0 || t.length === 0 && t.ended) return 0;
                if (t.objectMode) return 1;
                if (e !== e) {
                    if (t.flowing && t.length) return t.buffer.head.data.length;
                    else return t.length;
                }
                if (e > t.highWaterMark) t.highWaterMark = computeNewHighWaterMark(e);
                if (e <= t.length) return e;
                if (!t.ended) {
                    t.needReadable = true;
                    return 0;
                }
                return t.length;
            }
            Readable.prototype.read = function(e) {
                debug('read', e);
                e = parseInt(e, 10);
                var t = this._readableState;
                var r = e;
                if (e !== 0) t.emittedReadable = false;
                if (e === 0 && t.needReadable && (t.length >= t.highWaterMark || t.ended)) {
                    debug('read: emitReadable', t.length, t.ended);
                    if (t.length === 0 && t.ended) endReadable(this);
                    else emitReadable(this);
                    return null;
                }
                e = howMuchToRead(e, t);
                if (e === 0 && t.ended) {
                    if (t.length === 0) endReadable(this);
                    return null;
                }
                var n = t.needReadable;
                debug('need readable', n);
                if (t.length === 0 || t.length - e < t.highWaterMark) {
                    n = true;
                    debug('length less than watermark', n);
                }
                if (t.ended || t.reading) {
                    n = false;
                    debug('reading or ended', n);
                } else if (n) {
                    debug('do read');
                    t.reading = true;
                    t.sync = true;
                    if (t.length === 0) t.needReadable = true;
                    this._read(t.highWaterMark);
                    t.sync = false;
                    if (!t.reading) e = howMuchToRead(r, t);
                }
                var i;
                if (e > 0) i = fromList(e, t);
                else i = null;
                if (i === null) {
                    t.needReadable = true;
                    e = 0;
                } else {
                    t.length -= e;
                }
                if (t.length === 0) {
                    if (!t.ended) t.needReadable = true;
                    if (r !== e && t.ended) endReadable(this);
                }
                if (i !== null) this.emit('data', i);
                return i;
            };
            function chunkInvalid(e, t) {
                var r = null;
                if (!Buffer$1.isBuffer(t) && typeof t !== 'string' && t !== null && t !== undefined && !e.objectMode) {
                    r = new TypeError('Invalid non-string/buffer chunk');
                }
                return r;
            }
            function onEofChunk(e, t) {
                if (t.ended) return;
                if (t.decoder) {
                    var r = t.decoder.end();
                    if (r && r.length) {
                        t.buffer.push(r);
                        t.length += t.objectMode ? 1 : r.length;
                    }
                }
                t.ended = true;
                emitReadable(e);
            }
            function emitReadable(e) {
                var t = e._readableState;
                t.needReadable = false;
                if (!t.emittedReadable) {
                    debug('emitReadable', t.flowing);
                    t.emittedReadable = true;
                    if (t.sync) browser.exports.nextTick(emitReadable_, e);
                    else emitReadable_(e);
                }
            }
            function emitReadable_(e) {
                debug('emit readable');
                e.emit('readable');
                flow(e);
            }
            function maybeReadMore(e, t) {
                if (!t.readingMore) {
                    t.readingMore = true;
                    browser.exports.nextTick(maybeReadMore_, e, t);
                }
            }
            function maybeReadMore_(e, t) {
                var r = t.length;
                while(!t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark){
                    debug('maybeReadMore read 0');
                    e.read(0);
                    if (r === t.length) break;
                    else r = t.length;
                }
                t.readingMore = false;
            }
            Readable.prototype._read = function(e) {
                this.emit('error', new Error('not implemented'));
            };
            Readable.prototype.pipe = function(e, t) {
                var r = this;
                var n = this._readableState;
                switch(n.pipesCount){
                    case 0:
                        n.pipes = e;
                        break;
                    case 1:
                        n.pipes = [
                            n.pipes,
                            e
                        ];
                        break;
                    default:
                        n.pipes.push(e);
                        break;
                }
                n.pipesCount += 1;
                debug('pipe count=%d opts=%j', n.pipesCount, t);
                var i = (!t || t.end !== false);
                var a = i ? f : l;
                if (n.endEmitted) browser.exports.nextTick(a);
                else r.once('end', a);
                e.on('unpipe', o);
                function o(e) {
                    debug('onunpipe');
                    if (e === r) {
                        l();
                    }
                }
                function f() {
                    debug('onend');
                    e.end();
                }
                var s = pipeOnDrain(r);
                e.on('drain', s);
                var u = false;
                function l() {
                    debug('cleanup');
                    e.removeListener('close', d);
                    e.removeListener('finish', v);
                    e.removeListener('drain', s);
                    e.removeListener('error', p);
                    e.removeListener('unpipe', o);
                    r.removeListener('end', f);
                    r.removeListener('end', l);
                    r.removeListener('data', h);
                    u = true;
                    if (n.awaitDrain && (!e._writableState || e._writableState.needDrain)) s();
                }
                var c = false;
                r.on('data', h);
                function h(t) {
                    debug('ondata');
                    c = false;
                    var i = e.write(t);
                    if (false === i && !c) {
                        if ((n.pipesCount === 1 && n.pipes === e || n.pipesCount > 1 && indexOf(n.pipes, e) !== -1) && !u) {
                            debug('false write response, pause', r._readableState.awaitDrain);
                            r._readableState.awaitDrain++;
                            c = true;
                        }
                        r.pause();
                    }
                }
                function p(t) {
                    debug('onerror', t);
                    y();
                    e.removeListener('error', p);
                    if (listenerCount(e, 'error') === 0) e.emit('error', t);
                }
                prependListener(e, 'error', p);
                function d() {
                    e.removeListener('finish', v);
                    y();
                }
                e.once('close', d);
                function v() {
                    debug('onfinish');
                    e.removeListener('close', d);
                    y();
                }
                e.once('finish', v);
                function y() {
                    debug('unpipe');
                    r.unpipe(e);
                }
                e.emit('pipe', r);
                if (!n.flowing) {
                    debug('pipe resume');
                    r.resume();
                }
                return e;
            };
            function pipeOnDrain(e) {
                return function() {
                    var t = e._readableState;
                    debug('pipeOnDrain', t.awaitDrain);
                    if (t.awaitDrain) t.awaitDrain--;
                    if (t.awaitDrain === 0 && e.listeners('data').length) {
                        t.flowing = true;
                        flow(e);
                    }
                };
            }
            Readable.prototype.unpipe = function(e) {
                var t = this._readableState;
                if (t.pipesCount === 0) return this;
                if (t.pipesCount === 1) {
                    if (e && e !== t.pipes) return this;
                    if (!e) e = t.pipes;
                    t.pipes = null;
                    t.pipesCount = 0;
                    t.flowing = false;
                    if (e) e.emit('unpipe', this);
                    return this;
                }
                if (!e) {
                    var r = t.pipes;
                    var n = t.pipesCount;
                    t.pipes = null;
                    t.pipesCount = 0;
                    t.flowing = false;
                    for(var i = 0; i < n; i++){
                        r[i].emit('unpipe', this);
                    }
                    return this;
                }
                var a = indexOf(t.pipes, e);
                if (a === -1) return this;
                t.pipes.splice(a, 1);
                t.pipesCount -= 1;
                if (t.pipesCount === 1) t.pipes = t.pipes[0];
                e.emit('unpipe', this);
                return this;
            };
            Readable.prototype.on = function(e, t) {
                var r = EE.prototype.on.call(this, e, t);
                if (e === 'data') {
                    if (this._readableState.flowing !== false) this.resume();
                } else if (e === 'readable') {
                    var n = this._readableState;
                    if (!n.endEmitted && !n.readableListening) {
                        n.readableListening = n.needReadable = true;
                        n.emittedReadable = false;
                        if (!n.reading) {
                            browser.exports.nextTick(nReadingNextTick, this);
                        } else if (n.length) {
                            emitReadable(this);
                        }
                    }
                }
                return r;
            };
            Readable.prototype.addListener = Readable.prototype.on;
            function nReadingNextTick(e) {
                debug('readable nexttick read 0');
                e.read(0);
            }
            Readable.prototype.resume = function() {
                var e = this._readableState;
                if (!e.flowing) {
                    debug('resume');
                    e.flowing = true;
                    resume(this, e);
                }
                return this;
            };
            function resume(e, t) {
                if (!t.resumeScheduled) {
                    t.resumeScheduled = true;
                    browser.exports.nextTick(resume_, e, t);
                }
            }
            function resume_(e, t) {
                if (!t.reading) {
                    debug('resume read 0');
                    e.read(0);
                }
                t.resumeScheduled = false;
                t.awaitDrain = 0;
                e.emit('resume');
                flow(e);
                if (t.flowing && !t.reading) e.read(0);
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
            function flow(e) {
                var t = e._readableState;
                debug('flow', t.flowing);
                while(t.flowing && e.read() !== null){}
            }
            Readable.prototype.wrap = function(e) {
                var t = this._readableState;
                var r = false;
                var n = this;
                e.on('end', function() {
                    debug('wrapped end');
                    if (t.decoder && !t.ended) {
                        var e = t.decoder.end();
                        if (e && e.length) n.push(e);
                    }
                    n.push(null);
                });
                e.on('data', function(i) {
                    debug('wrapped data');
                    if (t.decoder) i = t.decoder.write(i);
                    if (t.objectMode && (i === null || i === undefined)) return;
                    else if (!t.objectMode && (!i || !i.length)) return;
                    var a = n.push(i);
                    if (!a) {
                        r = true;
                        e.pause();
                    }
                });
                for(var i in e){
                    if (this[i] === undefined && typeof e[i] === 'function') {
                        this[i] = function(t) {
                            return function() {
                                return e[t].apply(e, arguments);
                            };
                        }(i);
                    }
                }
                var a = [
                    'error',
                    'close',
                    'destroy',
                    'pause',
                    'resume'
                ];
                forEach(a, function(t) {
                    e.on(t, n.emit.bind(n, t));
                });
                n._read = function(t) {
                    debug('wrapped _read', t);
                    if (r) {
                        r = false;
                        e.resume();
                    }
                };
                return n;
            };
            Readable._fromList = fromList;
            function fromList(e, t) {
                if (t.length === 0) return null;
                var r;
                if (t.objectMode) r = t.buffer.shift();
                else if (!e || e >= t.length) {
                    if (t.decoder) r = t.buffer.join('');
                    else if (t.buffer.length === 1) r = t.buffer.head.data;
                    else r = t.buffer.concat(t.length);
                    t.buffer.clear();
                } else {
                    r = fromListPartial(e, t.buffer, t.decoder);
                }
                return r;
            }
            function fromListPartial(e, t, r) {
                var n;
                if (e < t.head.data.length) {
                    n = t.head.data.slice(0, e);
                    t.head.data = t.head.data.slice(e);
                } else if (e === t.head.data.length) {
                    n = t.shift();
                } else {
                    n = r ? copyFromBufferString(e, t) : copyFromBuffer(e, t);
                }
                return n;
            }
            function copyFromBufferString(e, t) {
                var r = t.head;
                var n = 1;
                var i = r.data;
                e -= i.length;
                while(r = r.next){
                    var a = r.data;
                    var o = e > a.length ? a.length : e;
                    if (o === a.length) i += a;
                    else i += a.slice(0, e);
                    e -= o;
                    if (e === 0) {
                        if (o === a.length) {
                            ++n;
                            if (r.next) t.head = r.next;
                            else t.head = t.tail = null;
                        } else {
                            t.head = r;
                            r.data = a.slice(o);
                        }
                        break;
                    }
                    ++n;
                }
                t.length -= n;
                return i;
            }
            function copyFromBuffer(e, t) {
                var r = Buffer$1.allocUnsafe(e);
                var n = t.head;
                var i = 1;
                n.data.copy(r);
                e -= n.data.length;
                while(n = n.next){
                    var a = n.data;
                    var o = e > a.length ? a.length : e;
                    a.copy(r, r.length - e, 0, o);
                    e -= o;
                    if (e === 0) {
                        if (o === a.length) {
                            ++i;
                            if (n.next) t.head = n.next;
                            else t.head = t.tail = null;
                        } else {
                            t.head = n;
                            n.data = a.slice(o);
                        }
                        break;
                    }
                    ++i;
                }
                t.length -= i;
                return r;
            }
            function endReadable(e) {
                var t = e._readableState;
                if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream');
                if (!t.endEmitted) {
                    t.ended = true;
                    browser.exports.nextTick(endReadableNT, t, e);
                }
            }
            function endReadableNT(e, t) {
                if (!e.endEmitted && e.length === 0) {
                    e.endEmitted = true;
                    t.readable = false;
                    t.emit('end');
                }
            }
            function forEach(e, t) {
                for(var r = 0, n = e.length; r < n; r++){
                    t(e[r], r);
                }
            }
            function indexOf(e, t) {
                for(var r = 0, n = e.length; r < n; r++){
                    if (e[r] === t) return r;
                }
                return -1;
            }
            Writable.WritableState = WritableState;
            util$1.inherits(Writable, events.exports.EventEmitter);
            function nop() {}
            function WriteReq(e, t, r) {
                this.chunk = e;
                this.encoding = t;
                this.callback = r;
                this.next = null;
            }
            function WritableState(e, t) {
                Object.defineProperty(this, 'buffer', {
                    get: util$1.deprecate(function() {
                        return this.getBuffer();
                    }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
                });
                e = e || {};
                this.objectMode = !!e.objectMode;
                if (t instanceof Duplex) this.objectMode = this.objectMode || !!e.writableObjectMode;
                var r = e.highWaterMark;
                var n = this.objectMode ? 16 : 16 * 1024;
                this.highWaterMark = r || r === 0 ? r : n;
                this.highWaterMark = ~~this.highWaterMark;
                this.needDrain = false;
                this.ending = false;
                this.ended = false;
                this.finished = false;
                var i = e.decodeStrings === false;
                this.decodeStrings = !i;
                this.defaultEncoding = e.defaultEncoding || 'utf8';
                this.length = 0;
                this.writing = false;
                this.corked = 0;
                this.sync = true;
                this.bufferProcessing = false;
                this.onwrite = function(e) {
                    onwrite(t, e);
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
            WritableState.prototype.getBuffer = function e() {
                var t = this.bufferedRequest;
                var r = [];
                while(t){
                    r.push(t);
                    t = t.next;
                }
                return r;
            };
            function Writable(e) {
                if (!(this instanceof Writable) && !(this instanceof Duplex)) return new Writable(e);
                this._writableState = new WritableState(e, this);
                this.writable = true;
                if (e) {
                    if (typeof e.write === 'function') this._write = e.write;
                    if (typeof e.writev === 'function') this._writev = e.writev;
                }
                events.exports.EventEmitter.call(this);
            }
            Writable.prototype.pipe = function() {
                this.emit('error', new Error('Cannot pipe, not readable'));
            };
            function writeAfterEnd(e, t) {
                var r = new Error('write after end');
                e.emit('error', r);
                browser.exports.nextTick(t, r);
            }
            function validChunk(e, t, r, n) {
                var i = true;
                var a = false;
                if (r === null) {
                    a = new TypeError('May not write null values to stream');
                } else if (!buffer.Buffer.isBuffer(r) && typeof r !== 'string' && r !== undefined && !t.objectMode) {
                    a = new TypeError('Invalid non-string/buffer chunk');
                }
                if (a) {
                    e.emit('error', a);
                    browser.exports.nextTick(n, a);
                    i = false;
                }
                return i;
            }
            Writable.prototype.write = function(e, t, r) {
                var n = this._writableState;
                var i = false;
                if (typeof t === 'function') {
                    r = t;
                    t = null;
                }
                if (buffer.Buffer.isBuffer(e)) t = 'buffer';
                else if (!t) t = n.defaultEncoding;
                if (typeof r !== 'function') r = nop;
                if (n.ended) writeAfterEnd(this, r);
                else if (validChunk(this, n, e, r)) {
                    n.pendingcb++;
                    i = writeOrBuffer(this, n, e, t, r);
                }
                return i;
            };
            Writable.prototype.cork = function() {
                var e = this._writableState;
                e.corked++;
            };
            Writable.prototype.uncork = function() {
                var e = this._writableState;
                if (e.corked) {
                    e.corked--;
                    if (!e.writing && !e.corked && !e.finished && !e.bufferProcessing && e.bufferedRequest) clearBuffer(this, e);
                }
            };
            Writable.prototype.setDefaultEncoding = function e(t) {
                if (typeof t === 'string') t = t.toLowerCase();
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
                ].indexOf((t + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + t);
                this._writableState.defaultEncoding = t;
                return this;
            };
            function decodeChunk(e, t, r) {
                if (!e.objectMode && e.decodeStrings !== false && typeof t === 'string') {
                    t = buffer.Buffer.from(t, r);
                }
                return t;
            }
            function writeOrBuffer(e, t, r, n, i) {
                r = decodeChunk(t, r, n);
                if (buffer.Buffer.isBuffer(r)) n = 'buffer';
                var a = t.objectMode ? 1 : r.length;
                t.length += a;
                var o = t.length < t.highWaterMark;
                if (!o) t.needDrain = true;
                if (t.writing || t.corked) {
                    var f = t.lastBufferedRequest;
                    t.lastBufferedRequest = new WriteReq(r, n, i);
                    if (f) {
                        f.next = t.lastBufferedRequest;
                    } else {
                        t.bufferedRequest = t.lastBufferedRequest;
                    }
                    t.bufferedRequestCount += 1;
                } else {
                    doWrite(e, t, false, a, r, n, i);
                }
                return o;
            }
            function doWrite(e, t, r, n, i, a, o) {
                t.writelen = n;
                t.writecb = o;
                t.writing = true;
                t.sync = true;
                if (r) e._writev(i, t.onwrite);
                else e._write(i, a, t.onwrite);
                t.sync = false;
            }
            function onwriteError(e, t, r, n, i) {
                --t.pendingcb;
                if (r) browser.exports.nextTick(i, n);
                else i(n);
                e._writableState.errorEmitted = true;
                e.emit('error', n);
            }
            function onwriteStateUpdate(e) {
                e.writing = false;
                e.writecb = null;
                e.length -= e.writelen;
                e.writelen = 0;
            }
            function onwrite(e, t) {
                var r = e._writableState;
                var n = r.sync;
                var i = r.writecb;
                onwriteStateUpdate(r);
                if (t) onwriteError(e, r, n, t, i);
                else {
                    var a = needFinish(r);
                    if (!a && !r.corked && !r.bufferProcessing && r.bufferedRequest) {
                        clearBuffer(e, r);
                    }
                    if (n) {
                        browser.exports.nextTick(afterWrite, e, r, a, i);
                    } else {
                        afterWrite(e, r, a, i);
                    }
                }
            }
            function afterWrite(e, t, r, n) {
                if (!r) onwriteDrain(e, t);
                t.pendingcb--;
                n();
                finishMaybe(e, t);
            }
            function onwriteDrain(e, t) {
                if (t.length === 0 && t.needDrain) {
                    t.needDrain = false;
                    e.emit('drain');
                }
            }
            function clearBuffer(e, t) {
                t.bufferProcessing = true;
                var r = t.bufferedRequest;
                if (e._writev && r && r.next) {
                    var n = t.bufferedRequestCount;
                    var i = new Array(n);
                    var a = t.corkedRequestsFree;
                    a.entry = r;
                    var o = 0;
                    while(r){
                        i[o] = r;
                        r = r.next;
                        o += 1;
                    }
                    doWrite(e, t, true, t.length, i, '', a.finish);
                    t.pendingcb++;
                    t.lastBufferedRequest = null;
                    if (a.next) {
                        t.corkedRequestsFree = a.next;
                        a.next = null;
                    } else {
                        t.corkedRequestsFree = new CorkedRequest(t);
                    }
                } else {
                    while(r){
                        var f = r.chunk;
                        var s = r.encoding;
                        var u = r.callback;
                        var l = t.objectMode ? 1 : f.length;
                        doWrite(e, t, false, l, f, s, u);
                        r = r.next;
                        if (t.writing) {
                            break;
                        }
                    }
                    if (r === null) t.lastBufferedRequest = null;
                }
                t.bufferedRequestCount = 0;
                t.bufferedRequest = r;
                t.bufferProcessing = false;
            }
            Writable.prototype._write = function(e, t, r) {
                r(new Error('not implemented'));
            };
            Writable.prototype._writev = null;
            Writable.prototype.end = function(e, t, r) {
                var n = this._writableState;
                if (typeof e === 'function') {
                    r = e;
                    e = null;
                    t = null;
                } else if (typeof t === 'function') {
                    r = t;
                    t = null;
                }
                if (e !== null && e !== undefined) this.write(e, t);
                if (n.corked) {
                    n.corked = 1;
                    this.uncork();
                }
                if (!n.ending && !n.finished) endWritable(this, n, r);
            };
            function needFinish(e) {
                return e.ending && e.length === 0 && e.bufferedRequest === null && !e.finished && !e.writing;
            }
            function prefinish(e, t) {
                if (!t.prefinished) {
                    t.prefinished = true;
                    e.emit('prefinish');
                }
            }
            function finishMaybe(e, t) {
                var r = needFinish(t);
                if (r) {
                    if (t.pendingcb === 0) {
                        prefinish(e, t);
                        t.finished = true;
                        e.emit('finish');
                    } else {
                        prefinish(e, t);
                    }
                }
                return r;
            }
            function endWritable(e, t, r) {
                t.ending = true;
                finishMaybe(e, t);
                if (r) {
                    if (t.finished) browser.exports.nextTick(r);
                    else e.once('finish', r);
                }
                t.ended = true;
                e.writable = false;
            }
            function CorkedRequest(e) {
                var t = this;
                this.next = null;
                this.entry = null;
                this.finish = function(r) {
                    var n = t.entry;
                    t.entry = null;
                    while(n){
                        var i = n.callback;
                        e.pendingcb--;
                        i(r);
                        n = n.next;
                    }
                    if (e.corkedRequestsFree) {
                        e.corkedRequestsFree.next = t;
                    } else {
                        e.corkedRequestsFree = t;
                    }
                };
            }
            util$1.inherits(Duplex, Readable);
            var keys$1 = Object.keys(Writable.prototype);
            for(var v = 0; v < keys$1.length; v++){
                var method = keys$1[v];
                if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
            }
            function Duplex(e) {
                if (!(this instanceof Duplex)) return new Duplex(e);
                Readable.call(this, e);
                Writable.call(this, e);
                if (e && e.readable === false) this.readable = false;
                if (e && e.writable === false) this.writable = false;
                this.allowHalfOpen = true;
                if (e && e.allowHalfOpen === false) this.allowHalfOpen = false;
                this.once('end', onend);
            }
            function onend() {
                if (this.allowHalfOpen || this._writableState.ended) return;
                browser.exports.nextTick(onEndNT, this);
            }
            function onEndNT(e) {
                e.end();
            }
            util$1.inherits(Transform, Duplex);
            function TransformState(e) {
                this.afterTransform = function(t, r) {
                    return afterTransform(e, t, r);
                };
                this.needTransform = false;
                this.transforming = false;
                this.writecb = null;
                this.writechunk = null;
                this.writeencoding = null;
            }
            function afterTransform(e, t, r) {
                var n = e._transformState;
                n.transforming = false;
                var i = n.writecb;
                if (!i) return e.emit('error', new Error('no writecb in Transform class'));
                n.writechunk = null;
                n.writecb = null;
                if (r !== null && r !== undefined) e.push(r);
                i(t);
                var a = e._readableState;
                a.reading = false;
                if (a.needReadable || a.length < a.highWaterMark) {
                    e._read(a.highWaterMark);
                }
            }
            function Transform(e) {
                if (!(this instanceof Transform)) return new Transform(e);
                Duplex.call(this, e);
                this._transformState = new TransformState(this);
                var t = this;
                this._readableState.needReadable = true;
                this._readableState.sync = false;
                if (e) {
                    if (typeof e.transform === 'function') this._transform = e.transform;
                    if (typeof e.flush === 'function') this._flush = e.flush;
                }
                this.once('prefinish', function() {
                    if (typeof this._flush === 'function') this._flush(function(e) {
                        done(t, e);
                    });
                    else done(t);
                });
            }
            Transform.prototype.push = function(e, t) {
                this._transformState.needTransform = false;
                return Duplex.prototype.push.call(this, e, t);
            };
            Transform.prototype._transform = function(e, t, r) {
                throw new Error('Not implemented');
            };
            Transform.prototype._write = function(e, t, r) {
                var n = this._transformState;
                n.writecb = r;
                n.writechunk = e;
                n.writeencoding = t;
                if (!n.transforming) {
                    var i = this._readableState;
                    if (n.needTransform || i.needReadable || i.length < i.highWaterMark) this._read(i.highWaterMark);
                }
            };
            Transform.prototype._read = function(e) {
                var t = this._transformState;
                if (t.writechunk !== null && t.writecb && !t.transforming) {
                    t.transforming = true;
                    this._transform(t.writechunk, t.writeencoding, t.afterTransform);
                } else {
                    t.needTransform = true;
                }
            };
            function done(e, t) {
                if (t) return e.emit('error', t);
                var r = e._writableState;
                var n = e._transformState;
                if (r.length) throw new Error('Calling transform done when ws.length != 0');
                if (n.transforming) throw new Error('Calling transform done when still transforming');
                return e.push(null);
            }
            util$1.inherits(PassThrough, Transform);
            function PassThrough(e) {
                if (!(this instanceof PassThrough)) return new PassThrough(e);
                Transform.call(this, e);
            }
            PassThrough.prototype._transform = function(e, t, r) {
                r(null, e);
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
            Stream.prototype.pipe = function(e, t) {
                var r = this;
                function n(t) {
                    if (e.writable) {
                        if (false === e.write(t) && r.pause) {
                            r.pause();
                        }
                    }
                }
                r.on('data', n);
                function i() {
                    if (r.readable && r.resume) {
                        r.resume();
                    }
                }
                e.on('drain', i);
                if (!e._isStdio && (!t || t.end !== false)) {
                    r.on('end', o);
                    r.on('close', f);
                }
                var a = false;
                function o() {
                    if (a) return;
                    a = true;
                    e.end();
                }
                function f() {
                    if (a) return;
                    a = true;
                    if (typeof e.destroy === 'function') e.destroy();
                }
                function s(e) {
                    u();
                    if (EE.listenerCount(this, 'error') === 0) {
                        throw e;
                    }
                }
                r.on('error', s);
                e.on('error', s);
                function u() {
                    r.removeListener('data', n);
                    e.removeListener('drain', i);
                    r.removeListener('end', o);
                    r.removeListener('close', f);
                    r.removeListener('error', s);
                    e.removeListener('error', s);
                    r.removeListener('end', u);
                    r.removeListener('close', u);
                    e.removeListener('close', u);
                }
                r.on('end', u);
                r.on('close', u);
                e.on('close', u);
                e.emit('pipe', r);
                return e;
            };
            var _polyfillNode_stream = Object.freeze({
                __proto__: null,
                'default': Stream,
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
            function _typeof$3(e) {
                if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                    _typeof$3 = function e(t) {
                        return typeof t;
                    };
                } else {
                    _typeof$3 = function e(t) {
                        return t && typeof Symbol === "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
                    };
                }
                return _typeof$3(e);
            }
            function _classCallCheck$2(e, t) {
                if (!(e instanceof t)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
            function _possibleConstructorReturn$1(e, t) {
                if (t && (_typeof$3(t) === "object" || typeof t === "function")) {
                    return t;
                }
                return _assertThisInitialized$1(e);
            }
            function _assertThisInitialized$1(e) {
                if (e === void 0) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }
                return e;
            }
            function _getPrototypeOf$1(e) {
                _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function e(t) {
                    return t.__proto__ || Object.getPrototypeOf(t);
                };
                return _getPrototypeOf$1(e);
            }
            function _inherits$1(e, t) {
                if (typeof t !== "function" && t !== null) {
                    throw new TypeError("Super expression must either be null or a function");
                }
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        writable: true,
                        configurable: true
                    }
                });
                if (t) _setPrototypeOf$1(e, t);
            }
            function _setPrototypeOf$1(e, t) {
                _setPrototypeOf$1 = Object.setPrototypeOf || function e(t, r) {
                    t.__proto__ = r;
                    return t;
                };
                return _setPrototypeOf$1(e, t);
            }
            var codes = {};
            var assert$1;
            var util;
            function createErrorType(e, t, r) {
                if (!r) {
                    r = Error;
                }
                function n(e, r, n) {
                    if (typeof t === 'string') {
                        return t;
                    } else {
                        return t(e, r, n);
                    }
                }
                var i = function(t) {
                    _inherits$1(r, t);
                    function r(t, i, a) {
                        var o;
                        _classCallCheck$2(this, r);
                        o = _possibleConstructorReturn$1(this, _getPrototypeOf$1(r).call(this, n(t, i, a)));
                        o.code = e;
                        return o;
                    }
                    return r;
                }(r);
                codes[e] = i;
            }
            function oneOf(e, t) {
                if (Array.isArray(e)) {
                    var r = e.length;
                    e = e.map(function(e) {
                        return String(e);
                    });
                    if (r > 2) {
                        return "one of ".concat(t, " ").concat(e.slice(0, r - 1).join(', '), ", or ") + e[r - 1];
                    } else if (r === 2) {
                        return "one of ".concat(t, " ").concat(e[0], " or ").concat(e[1]);
                    } else {
                        return "of ".concat(t, " ").concat(e[0]);
                    }
                } else {
                    return "of ".concat(t, " ").concat(String(e));
                }
            }
            function startsWith(e, t, r) {
                return e.substr(!r || r < 0 ? 0 : +r, t.length) === t;
            }
            function endsWith$1(e, t, r) {
                if (r === undefined || r > e.length) {
                    r = e.length;
                }
                return e.substring(r - t.length, r) === t;
            }
            function includes(e, t, r) {
                if (typeof r !== 'number') {
                    r = 0;
                }
                if (r + t.length > e.length) {
                    return false;
                } else {
                    return e.indexOf(t, r) !== -1;
                }
            }
            createErrorType('ERR_AMBIGUOUS_ARGUMENT', 'The "%s" argument is ambiguous. %s', TypeError);
            createErrorType('ERR_INVALID_ARG_TYPE', function(e, t, r) {
                if (assert$1 === undefined) assert$1 = assert$2.exports;
                assert$1(typeof e === 'string', "'name' must be a string");
                var n;
                if (typeof t === 'string' && startsWith(t, 'not ')) {
                    n = 'must not be';
                    t = t.replace(/^not /, '');
                } else {
                    n = 'must be';
                }
                var i;
                if (endsWith$1(e, ' argument')) {
                    i = "The ".concat(e, " ").concat(n, " ").concat(oneOf(t, 'type'));
                } else {
                    var a = includes(e, '.') ? 'property' : 'argument';
                    i = "The \"".concat(e, "\" ").concat(a, " ").concat(n, " ").concat(oneOf(t, 'type'));
                }
                i += ". Received type ".concat(_typeof$3(r));
                return i;
            }, TypeError);
            createErrorType('ERR_INVALID_ARG_VALUE', function(e, t) {
                var r = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'is invalid';
                if (util === undefined) util = util$1;
                var n = util.inspect(t);
                if (n.length > 128) {
                    n = "".concat(n.slice(0, 128), "...");
                }
                return "The argument '".concat(e, "' ").concat(r, ". Received ").concat(n);
            }, TypeError);
            createErrorType('ERR_INVALID_RETURN_VALUE', function(e, t, r) {
                var n;
                if (r && r.constructor && r.constructor.name) {
                    n = "instance of ".concat(r.constructor.name);
                } else {
                    n = "type ".concat(_typeof$3(r));
                }
                return "Expected ".concat(e, " to be returned from the \"").concat(t, "\"") + " function but got ".concat(n, ".");
            }, TypeError);
            createErrorType('ERR_MISSING_ARGS', function() {
                for(var e = arguments.length, t = new Array(e), r = 0; r < e; r++){
                    t[r] = arguments[r];
                }
                if (assert$1 === undefined) assert$1 = assert$2.exports;
                assert$1(t.length > 0, 'At least one arg needs to be specified');
                var n = 'The ';
                var i = t.length;
                t = t.map(function(e) {
                    return "\"".concat(e, "\"");
                });
                switch(i){
                    case 1:
                        n += "".concat(t[0], " argument");
                        break;
                    case 2:
                        n += "".concat(t[0], " and ").concat(t[1], " arguments");
                        break;
                    default:
                        n += t.slice(0, i - 1).join(', ');
                        n += ", and ".concat(t[i - 1], " arguments");
                        break;
                }
                return "".concat(n, " must be specified");
            }, TypeError);
            errors.codes = codes;
            function _objectSpread(e) {
                for(var t = 1; t < arguments.length; t++){
                    var r = arguments[t] != null ? arguments[t] : {};
                    var n = Object.keys(r);
                    if (typeof Object.getOwnPropertySymbols === 'function') {
                        n = n.concat(Object.getOwnPropertySymbols(r).filter(function(e) {
                            return Object.getOwnPropertyDescriptor(r, e).enumerable;
                        }));
                    }
                    n.forEach(function(t) {
                        _defineProperty(e, t, r[t]);
                    });
                }
                return e;
            }
            function _defineProperty(e, t, r) {
                if (t in e) {
                    Object.defineProperty(e, t, {
                        value: r,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    e[t] = r;
                }
                return e;
            }
            function _classCallCheck$1(e, t) {
                if (!(e instanceof t)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
            function _defineProperties(e, t) {
                for(var r = 0; r < t.length; r++){
                    var n = t[r];
                    n.enumerable = n.enumerable || false;
                    n.configurable = true;
                    if ("value" in n) n.writable = true;
                    Object.defineProperty(e, n.key, n);
                }
            }
            function _createClass(e, t, r) {
                if (t) _defineProperties(e.prototype, t);
                if (r) _defineProperties(e, r);
                return e;
            }
            function _possibleConstructorReturn(e, t) {
                if (t && (_typeof$2(t) === "object" || typeof t === "function")) {
                    return t;
                }
                return _assertThisInitialized(e);
            }
            function _assertThisInitialized(e) {
                if (e === void 0) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }
                return e;
            }
            function _inherits(e, t) {
                if (typeof t !== "function" && t !== null) {
                    throw new TypeError("Super expression must either be null or a function");
                }
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        writable: true,
                        configurable: true
                    }
                });
                if (t) _setPrototypeOf(e, t);
            }
            function _wrapNativeSuper(e) {
                var t = typeof Map === "function" ? new Map() : undefined;
                _wrapNativeSuper = function e(r) {
                    if (r === null || !_isNativeFunction(r)) return r;
                    if (typeof r !== "function") {
                        throw new TypeError("Super expression must either be null or a function");
                    }
                    if (typeof t !== "undefined") {
                        if (t.has(r)) return t.get(r);
                        t.set(r, n);
                    }
                    function n() {
                        return _construct(r, arguments, _getPrototypeOf(this).constructor);
                    }
                    n.prototype = Object.create(r.prototype, {
                        constructor: {
                            value: n,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    });
                    return _setPrototypeOf(n, r);
                };
                return _wrapNativeSuper(e);
            }
            function isNativeReflectConstruct() {
                if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
                    return true;
                } catch (e) {
                    return false;
                }
            }
            function _construct(e, t, r) {
                if (isNativeReflectConstruct()) {
                    _construct = Reflect.construct;
                } else {
                    _construct = function e(t, r, n) {
                        var i = [
                            null
                        ];
                        i.push.apply(i, r);
                        var a = Function.bind.apply(t, i);
                        var o = new a();
                        if (n) _setPrototypeOf(o, n.prototype);
                        return o;
                    };
                }
                return _construct.apply(null, arguments);
            }
            function _isNativeFunction(e) {
                return Function.toString.call(e).indexOf("[native code]") !== -1;
            }
            function _setPrototypeOf(e, t) {
                _setPrototypeOf = Object.setPrototypeOf || function e(t, r) {
                    t.__proto__ = r;
                    return t;
                };
                return _setPrototypeOf(e, t);
            }
            function _getPrototypeOf(e) {
                _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function e(t) {
                    return t.__proto__ || Object.getPrototypeOf(t);
                };
                return _getPrototypeOf(e);
            }
            function _typeof$2(e) {
                if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                    _typeof$2 = function e(t) {
                        return typeof t;
                    };
                } else {
                    _typeof$2 = function e(t) {
                        return t && typeof Symbol === "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
                    };
                }
                return _typeof$2(e);
            }
            var _require$1 = util$1, inspect$1 = _require$1.inspect;
            var _require2$1 = errors, ERR_INVALID_ARG_TYPE$1 = _require2$1.codes.ERR_INVALID_ARG_TYPE;
            function endsWith(e, t, r) {
                if (r === undefined || r > e.length) {
                    r = e.length;
                }
                return e.substring(r - t.length, r) === t;
            }
            function repeat(e, t) {
                t = Math.floor(t);
                if (e.length == 0 || t == 0) return '';
                var r = e.length * t;
                t = Math.floor(Math.log(t) / Math.log(2));
                while(t){
                    e += e;
                    t--;
                }
                e += e.substring(0, r - e.length);
                return e;
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
            function copyError(e) {
                var t = Object.keys(e);
                var r = Object.create(Object.getPrototypeOf(e));
                t.forEach(function(t) {
                    r[t] = e[t];
                });
                Object.defineProperty(r, 'message', {
                    value: e.message
                });
                return r;
            }
            function inspectValue(e) {
                return inspect$1(e, {
                    compact: false,
                    customInspect: false,
                    depth: 1000,
                    maxArrayLength: Infinity,
                    showHidden: false,
                    breakLength: Infinity,
                    showProxy: false,
                    sorted: true,
                    getters: true
                });
            }
            function createErrDiff(e, t, r) {
                var n = '';
                var i = '';
                var a = 0;
                var o = '';
                var f = false;
                var s = inspectValue(e);
                var u = s.split('\n');
                var l = inspectValue(t).split('\n');
                var c = 0;
                var h = '';
                if (r === 'strictEqual' && _typeof$2(e) === 'object' && _typeof$2(t) === 'object' && e !== null && t !== null) {
                    r = 'strictEqualObject';
                }
                if (u.length === 1 && l.length === 1 && u[0] !== l[0]) {
                    var p = u[0].length + l[0].length;
                    if (p <= kMaxShortLength) {
                        if ((_typeof$2(e) !== 'object' || e === null) && (_typeof$2(t) !== 'object' || t === null) && (e !== 0 || t !== 0)) {
                            return "".concat(kReadableOperator[r], "\n\n") + "".concat(u[0], " !== ").concat(l[0], "\n");
                        }
                    } else if (r !== 'strictEqualObject') {
                        var d = 80;
                        if (p < d) {
                            while(u[0][c] === l[0][c]){
                                c++;
                            }
                            if (c > 2) {
                                h = "\n  ".concat(repeat(' ', c), "^");
                                c = 0;
                            }
                        }
                    }
                }
                var v = u[u.length - 1];
                var y = l[l.length - 1];
                while(v === y){
                    if (c++ < 2) {
                        o = "\n  ".concat(v).concat(o);
                    } else {
                        n = v;
                    }
                    u.pop();
                    l.pop();
                    if (u.length === 0 || l.length === 0) break;
                    v = u[u.length - 1];
                    y = l[l.length - 1];
                }
                var g = Math.max(u.length, l.length);
                if (g === 0) {
                    var b = s.split('\n');
                    if (b.length > 30) {
                        b[26] = "".concat(blue, "...").concat(white);
                        while(b.length > 27){
                            b.pop();
                        }
                    }
                    return "".concat(kReadableOperator.notIdentical, "\n\n").concat(b.join('\n'), "\n");
                }
                if (c > 3) {
                    o = "\n".concat(blue, "...").concat(white).concat(o);
                    f = true;
                }
                if (n !== '') {
                    o = "\n  ".concat(n).concat(o);
                    n = '';
                }
                var w = 0;
                var _ = kReadableOperator[r] + "\n".concat(green, "+ actual").concat(white, " ").concat(red, "- expected").concat(white);
                var m = " ".concat(blue, "...").concat(white, " Lines skipped");
                for(c = 0; c < g; c++){
                    var E = c - a;
                    if (u.length < c + 1) {
                        if (E > 1 && c > 2) {
                            if (E > 4) {
                                i += "\n".concat(blue, "...").concat(white);
                                f = true;
                            } else if (E > 3) {
                                i += "\n  ".concat(l[c - 2]);
                                w++;
                            }
                            i += "\n  ".concat(l[c - 1]);
                            w++;
                        }
                        a = c;
                        n += "\n".concat(red, "-").concat(white, " ").concat(l[c]);
                        w++;
                    } else if (l.length < c + 1) {
                        if (E > 1 && c > 2) {
                            if (E > 4) {
                                i += "\n".concat(blue, "...").concat(white);
                                f = true;
                            } else if (E > 3) {
                                i += "\n  ".concat(u[c - 2]);
                                w++;
                            }
                            i += "\n  ".concat(u[c - 1]);
                            w++;
                        }
                        a = c;
                        i += "\n".concat(green, "+").concat(white, " ").concat(u[c]);
                        w++;
                    } else {
                        var k = l[c];
                        var A = u[c];
                        var S = A !== k && (!endsWith(A, ',') || A.slice(0, -1) !== k);
                        if (S && endsWith(k, ',') && k.slice(0, -1) === A) {
                            S = false;
                            A += ',';
                        }
                        if (S) {
                            if (E > 1 && c > 2) {
                                if (E > 4) {
                                    i += "\n".concat(blue, "...").concat(white);
                                    f = true;
                                } else if (E > 3) {
                                    i += "\n  ".concat(u[c - 2]);
                                    w++;
                                }
                                i += "\n  ".concat(u[c - 1]);
                                w++;
                            }
                            a = c;
                            i += "\n".concat(green, "+").concat(white, " ").concat(A);
                            n += "\n".concat(red, "-").concat(white, " ").concat(k);
                            w += 2;
                        } else {
                            i += n;
                            n = '';
                            if (E === 1 || c === 0) {
                                i += "\n  ".concat(A);
                                w++;
                            }
                        }
                    }
                    if (w > 20 && c < g - 2) {
                        return "".concat(_).concat(m, "\n").concat(i, "\n").concat(blue, "...").concat(white).concat(n, "\n") + "".concat(blue, "...").concat(white);
                    }
                }
                return "".concat(_).concat(f ? m : '', "\n").concat(i).concat(n).concat(o).concat(h);
            }
            var AssertionError$1 = function(e) {
                _inherits(t, e);
                function t(e) {
                    var r;
                    _classCallCheck$1(this, t);
                    if (_typeof$2(e) !== 'object' || e === null) {
                        throw new ERR_INVALID_ARG_TYPE$1('options', 'Object', e);
                    }
                    var n = e.message, i = e.operator, a = e.stackStartFn;
                    var o = e.actual, f = e.expected;
                    var s = Error.stackTraceLimit;
                    Error.stackTraceLimit = 0;
                    if (n != null) {
                        r = _possibleConstructorReturn(this, _getPrototypeOf(t).call(this, String(n)));
                    } else {
                        if (_typeof$2(o) === 'object' && o !== null && _typeof$2(f) === 'object' && f !== null && 'stack' in o && o instanceof Error && 'stack' in f && f instanceof Error) {
                            o = copyError(o);
                            f = copyError(f);
                        }
                        if (i === 'deepStrictEqual' || i === 'strictEqual') {
                            r = _possibleConstructorReturn(this, _getPrototypeOf(t).call(this, createErrDiff(o, f, i)));
                        } else if (i === 'notDeepStrictEqual' || i === 'notStrictEqual') {
                            var u = kReadableOperator[i];
                            var l = inspectValue(o).split('\n');
                            if (i === 'notStrictEqual' && _typeof$2(o) === 'object' && o !== null) {
                                u = kReadableOperator.notStrictEqualObject;
                            }
                            if (l.length > 30) {
                                l[26] = "".concat(blue, "...").concat(white);
                                while(l.length > 27){
                                    l.pop();
                                }
                            }
                            if (l.length === 1) {
                                r = _possibleConstructorReturn(this, _getPrototypeOf(t).call(this, "".concat(u, " ").concat(l[0])));
                            } else {
                                r = _possibleConstructorReturn(this, _getPrototypeOf(t).call(this, "".concat(u, "\n\n").concat(l.join('\n'), "\n")));
                            }
                        } else {
                            var c = inspectValue(o);
                            var h = '';
                            var p = kReadableOperator[i];
                            if (i === 'notDeepEqual' || i === 'notEqual') {
                                c = "".concat(kReadableOperator[i], "\n\n").concat(c);
                                if (c.length > 1024) {
                                    c = "".concat(c.slice(0, 1021), "...");
                                }
                            } else {
                                h = "".concat(inspectValue(f));
                                if (c.length > 512) {
                                    c = "".concat(c.slice(0, 509), "...");
                                }
                                if (h.length > 512) {
                                    h = "".concat(h.slice(0, 509), "...");
                                }
                                if (i === 'deepEqual' || i === 'equal') {
                                    c = "".concat(p, "\n\n").concat(c, "\n\nshould equal\n\n");
                                } else {
                                    h = " ".concat(i, " ").concat(h);
                                }
                            }
                            r = _possibleConstructorReturn(this, _getPrototypeOf(t).call(this, "".concat(c).concat(h)));
                        }
                    }
                    Error.stackTraceLimit = s;
                    r.generatedMessage = !n;
                    Object.defineProperty(_assertThisInitialized(r), 'name', {
                        value: 'AssertionError [ERR_ASSERTION]',
                        enumerable: false,
                        writable: true,
                        configurable: true
                    });
                    r.code = 'ERR_ASSERTION';
                    r.actual = o;
                    r.expected = f;
                    r.operator = i;
                    if (Error.captureStackTrace) {
                        Error.captureStackTrace(_assertThisInitialized(r), a);
                    }
                    r.stack;
                    r.name = 'AssertionError';
                    return _possibleConstructorReturn(r);
                }
                _createClass(t, [
                    {
                        key: "toString",
                        value: function e() {
                            return "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message);
                        }
                    },
                    {
                        key: inspect$1.custom,
                        value: function e(t, r) {
                            return inspect$1(this, _objectSpread({}, r, {
                                customInspect: false,
                                depth: 0
                            }));
                        }
                    }
                ]);
                return t;
            }(_wrapNativeSuper(Error));
            var assertion_error = AssertionError$1;
            function assign(e, t) {
                if (e === undefined || e === null) {
                    throw new TypeError('Cannot convert first argument to object');
                }
                var r = Object(e);
                for(var n = 1; n < arguments.length; n++){
                    var i = arguments[n];
                    if (i === undefined || i === null) {
                        continue;
                    }
                    var a = Object.keys(Object(i));
                    for(var o = 0, f = a.length; o < f; o++){
                        var s = a[o];
                        var u = Object.getOwnPropertyDescriptor(i, s);
                        if (u !== undefined && u.enumerable) {
                            r[s] = i[s];
                        }
                    }
                }
                return r;
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
            var isArguments = function e(t) {
                var r = toStr$2.call(t);
                var n = r === '[object Arguments]';
                if (!n) {
                    n = r !== '[object Array]' && t !== null && typeof t === 'object' && typeof t.length === 'number' && t.length >= 0 && toStr$2.call(t.callee) === '[object Function]';
                }
                return n;
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
                var equalsConstructorPrototype = function e(t) {
                    var r = t.constructor;
                    return r && r.prototype === t;
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
                    if (typeof window === 'undefined') {
                        return false;
                    }
                    for(var e in window){
                        try {
                            if (!excludedKeys['$' + e] && has.call(window, e) && window[e] !== null && typeof window[e] === 'object') {
                                try {
                                    equalsConstructorPrototype(window[e]);
                                } catch (t) {
                                    return true;
                                }
                            }
                        } catch (r) {
                            return true;
                        }
                    }
                    return false;
                }();
                var equalsConstructorPrototypeIfNotBuggy = function e(t) {
                    if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
                        return equalsConstructorPrototype(t);
                    }
                    try {
                        return equalsConstructorPrototype(t);
                    } catch (r) {
                        return false;
                    }
                };
                keysShim$1 = function e(t) {
                    var r = t !== null && typeof t === 'object';
                    var n = toStr$1.call(t) === '[object Function]';
                    var i = isArgs$1(t);
                    var a = r && toStr$1.call(t) === '[object String]';
                    var o = [];
                    if (!r && !n && !i) {
                        throw new TypeError('Object.keys called on a non-object');
                    }
                    var f = hasProtoEnumBug && n;
                    if (a && t.length > 0 && !has.call(t, 0)) {
                        for(var s = 0; s < t.length; ++s){
                            o.push(String(s));
                        }
                    }
                    if (i && t.length > 0) {
                        for(var u = 0; u < t.length; ++u){
                            o.push(String(u));
                        }
                    } else {
                        for(var l in t){
                            if (!(f && l === 'prototype') && has.call(t, l)) {
                                o.push(String(l));
                            }
                        }
                    }
                    if (hasDontEnumBug) {
                        var c = equalsConstructorPrototypeIfNotBuggy(t);
                        for(var h = 0; h < dontEnums.length; ++h){
                            if (!(c && dontEnums[h] === 'constructor') && has.call(t, dontEnums[h])) {
                                o.push(dontEnums[h]);
                            }
                        }
                    }
                    return o;
                };
            }
            var implementation$6 = keysShim$1;
            var slice = Array.prototype.slice;
            var isArgs = isArguments;
            var origKeys = Object.keys;
            var keysShim = origKeys ? function e(t) {
                return origKeys(t);
            } : implementation$6;
            var originalKeys = Object.keys;
            keysShim.shim = function e() {
                if (Object.keys) {
                    var t = function() {
                        var e = Object.keys(arguments);
                        return e && e.length === arguments.length;
                    }(1, 2);
                    if (!t) {
                        Object.keys = function e(t) {
                            if (isArgs(t)) {
                                return originalKeys(slice.call(t));
                            }
                            return originalKeys(t);
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
            var isFunction = function e(t) {
                return typeof t === 'function' && toStr.call(t) === '[object Function]';
            };
            var arePropertyDescriptorsSupported = function e() {
                var t = {};
                try {
                    origDefineProperty(t, 'x', {
                        enumerable: false,
                        value: t
                    });
                    for(var r in t){
                        return false;
                    }
                    return t.x === t;
                } catch (n) {
                    return false;
                }
            };
            var supportsDescriptors = origDefineProperty && arePropertyDescriptorsSupported();
            var defineProperty = function e(t, r, n, i) {
                if (r in t && (!isFunction(i) || !i())) {
                    return;
                }
                if (supportsDescriptors) {
                    origDefineProperty(t, r, {
                        configurable: true,
                        enumerable: false,
                        value: n,
                        writable: true
                    });
                } else {
                    t[r] = n;
                }
            };
            var defineProperties = function e(t, r) {
                var n = arguments.length > 2 ? arguments[2] : {};
                var i = keys(r);
                if (hasSymbols) {
                    i = concat.call(i, Object.getOwnPropertySymbols(r));
                }
                for(var a = 0; a < i.length; a += 1){
                    defineProperty(t, i[a], r[i[a]], n[i[a]]);
                }
            };
            defineProperties.supportsDescriptors = !!supportsDescriptors;
            var defineProperties_1 = defineProperties;
            var numberIsNaN$1 = function e(t) {
                return t !== t;
            };
            var implementation$5 = function e(t, r) {
                if (t === 0 && r === 0) {
                    return 1 / t === 1 / r;
                }
                if (t === r) {
                    return true;
                }
                if (numberIsNaN$1(t) && numberIsNaN$1(r)) {
                    return true;
                }
                return false;
            };
            var implementation$4 = implementation$5;
            var polyfill$3 = function e() {
                return typeof Object.is === 'function' ? Object.is : implementation$4;
            };
            var getPolyfill$3 = polyfill$3;
            var define$3 = defineProperties_1;
            var shim$3 = function e() {
                var t = getPolyfill$3();
                define$3(Object, {
                    is: t
                }, {
                    is: function e() {
                        return Object.is !== t;
                    }
                });
                return t;
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
            var implementation$2 = function e(t) {
                return t !== t;
            };
            var implementation$1 = implementation$2;
            var polyfill$1 = function e() {
                if (Number.isNaN && Number.isNaN(NaN) && !Number.isNaN('a')) {
                    return Number.isNaN;
                }
                return implementation$1;
            };
            var define$1 = defineProperties_1;
            var getPolyfill$1 = polyfill$1;
            var shim$1 = function e() {
                var t = getPolyfill$1();
                define$1(Number, {
                    isNaN: t
                }, {
                    isNaN: function e() {
                        return Number.isNaN !== t;
                    }
                });
                return t;
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
            function _slicedToArray(e, t) {
                return _arrayWithHoles(e) || _iterableToArrayLimit(e, t) || _nonIterableRest();
            }
            function _nonIterableRest() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
            function _iterableToArrayLimit(e, t) {
                var r = [];
                var n = true;
                var i = false;
                var a = undefined;
                try {
                    for(var o = e[Symbol.iterator](), f; !(n = (f = o.next()).done); n = true){
                        r.push(f.value);
                        if (t && r.length === t) break;
                    }
                } catch (s) {
                    i = true;
                    a = s;
                } finally{
                    try {
                        if (!n && o["return"] != null) o["return"]();
                    } finally{
                        if (i) throw a;
                    }
                }
                return r;
            }
            function _arrayWithHoles(e) {
                if (Array.isArray(e)) return e;
            }
            function _typeof$1(e) {
                if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                    _typeof$1 = function e(t) {
                        return typeof t;
                    };
                } else {
                    _typeof$1 = function e(t) {
                        return t && typeof Symbol === "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
                    };
                }
                return _typeof$1(e);
            }
            var regexFlagsSupported = /a/g.flags !== undefined;
            var arrayFromSet = function e(t) {
                var r = [];
                t.forEach(function(e) {
                    return r.push(e);
                });
                return r;
            };
            var arrayFromMap = function e(t) {
                var r = [];
                t.forEach(function(e, t) {
                    return r.push([
                        t,
                        e
                    ]);
                });
                return r;
            };
            var objectIs$1 = Object.is ? Object.is : objectIs$2;
            var objectGetOwnPropertySymbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols : function() {
                return [];
            };
            var numberIsNaN = Number.isNaN ? Number.isNaN : isNan;
            function uncurryThis(e) {
                return e.call.bind(e);
            }
            var hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);
            var propertyIsEnumerable = uncurryThis(Object.prototype.propertyIsEnumerable);
            var objectToString = uncurryThis(Object.prototype.toString);
            var _require$types$1 = util$1.types, isAnyArrayBuffer = _require$types$1.isAnyArrayBuffer, isArrayBufferView = _require$types$1.isArrayBufferView, isDate = _require$types$1.isDate, isMap = _require$types$1.isMap, isRegExp$1 = _require$types$1.isRegExp, isSet = _require$types$1.isSet, isNativeError = _require$types$1.isNativeError, isBoxedPrimitive = _require$types$1.isBoxedPrimitive, isNumberObject = _require$types$1.isNumberObject, isStringObject = _require$types$1.isStringObject, isBooleanObject = _require$types$1.isBooleanObject, isBigIntObject = _require$types$1.isBigIntObject, isSymbolObject = _require$types$1.isSymbolObject, isFloat32Array = _require$types$1.isFloat32Array, isFloat64Array = _require$types$1.isFloat64Array;
            function isNonIndex(e) {
                if (e.length === 0 || e.length > 10) return true;
                for(var t = 0; t < e.length; t++){
                    var r = e.charCodeAt(t);
                    if (r < 48 || r > 57) return true;
                }
                return e.length === 10 && e >= Math.pow(2, 32);
            }
            function getOwnNonIndexProperties(e) {
                return Object.keys(e).filter(isNonIndex).concat(objectGetOwnPropertySymbols(e).filter(Object.prototype.propertyIsEnumerable.bind(e)));
            }
            function compare(e, t) {
                if (e === t) {
                    return 0;
                }
                var r = e.length;
                var n = t.length;
                for(var i = 0, a = Math.min(r, n); i < a; ++i){
                    if (e[i] !== t[i]) {
                        r = e[i];
                        n = t[i];
                        break;
                    }
                }
                if (r < n) {
                    return -1;
                }
                if (n < r) {
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
            function areSimilarRegExps(e, t) {
                return regexFlagsSupported ? e.source === t.source && e.flags === t.flags : RegExp.prototype.toString.call(e) === RegExp.prototype.toString.call(t);
            }
            function areSimilarFloatArrays(e, t) {
                if (e.byteLength !== t.byteLength) {
                    return false;
                }
                for(var r = 0; r < e.byteLength; r++){
                    if (e[r] !== t[r]) {
                        return false;
                    }
                }
                return true;
            }
            function areSimilarTypedArrays(e, t) {
                if (e.byteLength !== t.byteLength) {
                    return false;
                }
                return compare(new Uint8Array(e.buffer, e.byteOffset, e.byteLength), new Uint8Array(t.buffer, t.byteOffset, t.byteLength)) === 0;
            }
            function areEqualArrayBuffers(e, t) {
                return e.byteLength === t.byteLength && compare(new Uint8Array(e), new Uint8Array(t)) === 0;
            }
            function isEqualBoxedPrimitive(e, t) {
                if (isNumberObject(e)) {
                    return isNumberObject(t) && objectIs$1(Number.prototype.valueOf.call(e), Number.prototype.valueOf.call(t));
                }
                if (isStringObject(e)) {
                    return isStringObject(t) && String.prototype.valueOf.call(e) === String.prototype.valueOf.call(t);
                }
                if (isBooleanObject(e)) {
                    return isBooleanObject(t) && Boolean.prototype.valueOf.call(e) === Boolean.prototype.valueOf.call(t);
                }
                if (isBigIntObject(e)) {
                    return isBigIntObject(t) && BigInt.prototype.valueOf.call(e) === BigInt.prototype.valueOf.call(t);
                }
                return isSymbolObject(t) && Symbol.prototype.valueOf.call(e) === Symbol.prototype.valueOf.call(t);
            }
            function innerDeepEqual(e, t, r, n) {
                if (e === t) {
                    if (e !== 0) return true;
                    return r ? objectIs$1(e, t) : true;
                }
                if (r) {
                    if (_typeof$1(e) !== 'object') {
                        return typeof e === 'number' && numberIsNaN(e) && numberIsNaN(t);
                    }
                    if (_typeof$1(t) !== 'object' || e === null || t === null) {
                        return false;
                    }
                    if (Object.getPrototypeOf(e) !== Object.getPrototypeOf(t)) {
                        return false;
                    }
                } else {
                    if (e === null || _typeof$1(e) !== 'object') {
                        if (t === null || _typeof$1(t) !== 'object') {
                            return e == t;
                        }
                        return false;
                    }
                    if (t === null || _typeof$1(t) !== 'object') {
                        return false;
                    }
                }
                var i = objectToString(e);
                var a = objectToString(t);
                if (i !== a) {
                    return false;
                }
                if (Array.isArray(e)) {
                    if (e.length !== t.length) {
                        return false;
                    }
                    var o = getOwnNonIndexProperties(e);
                    var f = getOwnNonIndexProperties(t);
                    if (o.length !== f.length) {
                        return false;
                    }
                    return keyCheck(e, t, r, n, kIsArray, o);
                }
                if (i === '[object Object]') {
                    if (!isMap(e) && isMap(t) || !isSet(e) && isSet(t)) {
                        return false;
                    }
                }
                if (isDate(e)) {
                    if (!isDate(t) || Date.prototype.getTime.call(e) !== Date.prototype.getTime.call(t)) {
                        return false;
                    }
                } else if (isRegExp$1(e)) {
                    if (!isRegExp$1(t) || !areSimilarRegExps(e, t)) {
                        return false;
                    }
                } else if (isNativeError(e) || e instanceof Error) {
                    if (e.message !== t.message || e.name !== t.name) {
                        return false;
                    }
                } else if (isArrayBufferView(e)) {
                    if (!r && (isFloat32Array(e) || isFloat64Array(e))) {
                        if (!areSimilarFloatArrays(e, t)) {
                            return false;
                        }
                    } else if (!areSimilarTypedArrays(e, t)) {
                        return false;
                    }
                    var s = getOwnNonIndexProperties(e);
                    var u = getOwnNonIndexProperties(t);
                    if (s.length !== u.length) {
                        return false;
                    }
                    return keyCheck(e, t, r, n, kNoIterator, s);
                } else if (isSet(e)) {
                    if (!isSet(t) || e.size !== t.size) {
                        return false;
                    }
                    return keyCheck(e, t, r, n, kIsSet);
                } else if (isMap(e)) {
                    if (!isMap(t) || e.size !== t.size) {
                        return false;
                    }
                    return keyCheck(e, t, r, n, kIsMap);
                } else if (isAnyArrayBuffer(e)) {
                    if (!areEqualArrayBuffers(e, t)) {
                        return false;
                    }
                } else if (isBoxedPrimitive(e) && !isEqualBoxedPrimitive(e, t)) {
                    return false;
                }
                return keyCheck(e, t, r, n, kNoIterator);
            }
            function getEnumerables(e, t) {
                return t.filter(function(t) {
                    return propertyIsEnumerable(e, t);
                });
            }
            function keyCheck(e, t, r, n, i, a) {
                if (arguments.length === 5) {
                    a = Object.keys(e);
                    var o = Object.keys(t);
                    if (a.length !== o.length) {
                        return false;
                    }
                }
                var f = 0;
                for(; f < a.length; f++){
                    if (!hasOwnProperty(t, a[f])) {
                        return false;
                    }
                }
                if (r && arguments.length === 5) {
                    var s = objectGetOwnPropertySymbols(e);
                    if (s.length !== 0) {
                        var u = 0;
                        for(f = 0; f < s.length; f++){
                            var l = s[f];
                            if (propertyIsEnumerable(e, l)) {
                                if (!propertyIsEnumerable(t, l)) {
                                    return false;
                                }
                                a.push(l);
                                u++;
                            } else if (propertyIsEnumerable(t, l)) {
                                return false;
                            }
                        }
                        var c = objectGetOwnPropertySymbols(t);
                        if (s.length !== c.length && getEnumerables(t, c).length !== u) {
                            return false;
                        }
                    } else {
                        var h = objectGetOwnPropertySymbols(t);
                        if (h.length !== 0 && getEnumerables(t, h).length !== 0) {
                            return false;
                        }
                    }
                }
                if (a.length === 0 && (i === kNoIterator || i === kIsArray && e.length === 0 || e.size === 0)) {
                    return true;
                }
                if (n === undefined) {
                    n = {
                        val1: new Map(),
                        val2: new Map(),
                        position: 0
                    };
                } else {
                    var p = n.val1.get(e);
                    if (p !== undefined) {
                        var d = n.val2.get(t);
                        if (d !== undefined) {
                            return p === d;
                        }
                    }
                    n.position++;
                }
                n.val1.set(e, n.position);
                n.val2.set(t, n.position);
                var v = objEquiv(e, t, r, a, n, i);
                n.val1.delete(e);
                n.val2.delete(t);
                return v;
            }
            function setHasEqualElement(e, t, r, n) {
                var i = arrayFromSet(e);
                for(var a = 0; a < i.length; a++){
                    var o = i[a];
                    if (innerDeepEqual(t, o, r, n)) {
                        e.delete(o);
                        return true;
                    }
                }
                return false;
            }
            function findLooseMatchingPrimitives(e) {
                switch(_typeof$1(e)){
                    case 'undefined':
                        return null;
                    case 'object':
                        return undefined;
                    case 'symbol':
                        return false;
                    case 'string':
                        e = +e;
                    case 'number':
                        if (numberIsNaN(e)) {
                            return false;
                        }
                }
                return true;
            }
            function setMightHaveLoosePrim(e, t, r) {
                var n = findLooseMatchingPrimitives(r);
                if (n != null) return n;
                return t.has(n) && !e.has(n);
            }
            function mapMightHaveLoosePrim(e, t, r, n, i) {
                var a = findLooseMatchingPrimitives(r);
                if (a != null) {
                    return a;
                }
                var o = t.get(a);
                if (o === undefined && !t.has(a) || !innerDeepEqual(n, o, false, i)) {
                    return false;
                }
                return !e.has(a) && innerDeepEqual(n, o, false, i);
            }
            function setEquiv(e, t, r, n) {
                var i = null;
                var a = arrayFromSet(e);
                for(var o = 0; o < a.length; o++){
                    var f = a[o];
                    if (_typeof$1(f) === 'object' && f !== null) {
                        if (i === null) {
                            i = new Set();
                        }
                        i.add(f);
                    } else if (!t.has(f)) {
                        if (r) return false;
                        if (!setMightHaveLoosePrim(e, t, f)) {
                            return false;
                        }
                        if (i === null) {
                            i = new Set();
                        }
                        i.add(f);
                    }
                }
                if (i !== null) {
                    var s = arrayFromSet(t);
                    for(var u = 0; u < s.length; u++){
                        var l = s[u];
                        if (_typeof$1(l) === 'object' && l !== null) {
                            if (!setHasEqualElement(i, l, r, n)) return false;
                        } else if (!r && !e.has(l) && !setHasEqualElement(i, l, r, n)) {
                            return false;
                        }
                    }
                    return i.size === 0;
                }
                return true;
            }
            function mapHasEqualEntry(e, t, r, n, i, a) {
                var o = arrayFromSet(e);
                for(var f = 0; f < o.length; f++){
                    var s = o[f];
                    if (innerDeepEqual(r, s, i, a) && innerDeepEqual(n, t.get(s), i, a)) {
                        e.delete(s);
                        return true;
                    }
                }
                return false;
            }
            function mapEquiv(e, t, r, n) {
                var i = null;
                var a = arrayFromMap(e);
                for(var o = 0; o < a.length; o++){
                    var f = _slicedToArray(a[o], 2), s = f[0], u = f[1];
                    if (_typeof$1(s) === 'object' && s !== null) {
                        if (i === null) {
                            i = new Set();
                        }
                        i.add(s);
                    } else {
                        var l = t.get(s);
                        if (l === undefined && !t.has(s) || !innerDeepEqual(u, l, r, n)) {
                            if (r) return false;
                            if (!mapMightHaveLoosePrim(e, t, s, u, n)) return false;
                            if (i === null) {
                                i = new Set();
                            }
                            i.add(s);
                        }
                    }
                }
                if (i !== null) {
                    var c = arrayFromMap(t);
                    for(var h = 0; h < c.length; h++){
                        var p = _slicedToArray(c[h], 2), s = p[0], d = p[1];
                        if (_typeof$1(s) === 'object' && s !== null) {
                            if (!mapHasEqualEntry(i, e, s, d, r, n)) return false;
                        } else if (!r && (!e.has(s) || !innerDeepEqual(e.get(s), d, false, n)) && !mapHasEqualEntry(i, e, s, d, false, n)) {
                            return false;
                        }
                    }
                    return i.size === 0;
                }
                return true;
            }
            function objEquiv(e, t, r, n, i, a) {
                var o = 0;
                if (a === kIsSet) {
                    if (!setEquiv(e, t, r, i)) {
                        return false;
                    }
                } else if (a === kIsMap) {
                    if (!mapEquiv(e, t, r, i)) {
                        return false;
                    }
                } else if (a === kIsArray) {
                    for(; o < e.length; o++){
                        if (hasOwnProperty(e, o)) {
                            if (!hasOwnProperty(t, o) || !innerDeepEqual(e[o], t[o], r, i)) {
                                return false;
                            }
                        } else if (hasOwnProperty(t, o)) {
                            return false;
                        } else {
                            var f = Object.keys(e);
                            for(; o < f.length; o++){
                                var s = f[o];
                                if (!hasOwnProperty(t, s) || !innerDeepEqual(e[s], t[s], r, i)) {
                                    return false;
                                }
                            }
                            if (f.length !== Object.keys(t).length) {
                                return false;
                            }
                            return true;
                        }
                    }
                }
                for(o = 0; o < n.length; o++){
                    var u = n[o];
                    if (!innerDeepEqual(e[u], t[u], r, i)) {
                        return false;
                    }
                }
                return true;
            }
            function isDeepEqual$1(e, t) {
                return innerDeepEqual(e, t, kLoose);
            }
            function isDeepStrictEqual$1(e, t) {
                return innerDeepEqual(e, t, kStrict);
            }
            var comparisons = {
                isDeepEqual: isDeepEqual$1,
                isDeepStrictEqual: isDeepStrictEqual$1
            };
            function _typeof(e) {
                if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                    _typeof = function e(t) {
                        return typeof t;
                    };
                } else {
                    _typeof = function e(t) {
                        return t && typeof Symbol === "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
                    };
                }
                return _typeof(e);
            }
            function _classCallCheck(e, t) {
                if (!(e instanceof t)) {
                    throw new TypeError("Cannot call a class as a function");
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
                var e = comparisons;
                isDeepEqual = e.isDeepEqual;
                isDeepStrictEqual = e.isDeepStrictEqual;
            }
            var warned = false;
            var assert = assert$2.exports = ok;
            var NO_EXCEPTION_SENTINEL = {};
            function innerFail(e) {
                if (e.message instanceof Error) throw e.message;
                throw new AssertionError(e);
            }
            function fail(e, t, r, n, i) {
                var a = arguments.length;
                var o;
                if (a === 0) {
                    o = 'Failed';
                } else if (a === 1) {
                    r = e;
                    e = undefined;
                } else {
                    if (warned === false) {
                        warned = true;
                        var f = console.warn.bind(console);
                        f('assert.fail() with more than one argument is deprecated. ' + 'Please use assert.strictEqual() instead or only pass a message.', 'DeprecationWarning', 'DEP0094');
                    }
                    if (a === 2) n = '!=';
                }
                if (r instanceof Error) throw r;
                var s = {
                    actual: e,
                    expected: t,
                    operator: n === undefined ? 'fail' : n,
                    stackStartFn: i || fail
                };
                if (r !== undefined) {
                    s.message = r;
                }
                var u = new AssertionError(s);
                if (o) {
                    u.message = o;
                    u.generatedMessage = true;
                }
                throw u;
            }
            assert.fail = fail;
            assert.AssertionError = AssertionError;
            function innerOk(e, t, r, n) {
                if (!r) {
                    var i = false;
                    if (t === 0) {
                        i = true;
                        n = 'No value argument passed to `assert.ok()`';
                    } else if (n instanceof Error) {
                        throw n;
                    }
                    var a = new AssertionError({
                        actual: r,
                        expected: true,
                        message: n,
                        operator: '==',
                        stackStartFn: e
                    });
                    a.generatedMessage = i;
                    throw a;
                }
            }
            function ok() {
                for(var e = arguments.length, t = new Array(e), r = 0; r < e; r++){
                    t[r] = arguments[r];
                }
                innerOk.apply(void 0, [
                    ok,
                    t.length
                ].concat(t));
            }
            assert.ok = ok;
            assert.equal = function e(t, r, n) {
                if (arguments.length < 2) {
                    throw new ERR_MISSING_ARGS('actual', 'expected');
                }
                if (t != r) {
                    innerFail({
                        actual: t,
                        expected: r,
                        message: n,
                        operator: '==',
                        stackStartFn: e
                    });
                }
            };
            assert.notEqual = function e(t, r, n) {
                if (arguments.length < 2) {
                    throw new ERR_MISSING_ARGS('actual', 'expected');
                }
                if (t == r) {
                    innerFail({
                        actual: t,
                        expected: r,
                        message: n,
                        operator: '!=',
                        stackStartFn: e
                    });
                }
            };
            assert.deepEqual = function e(t, r, n) {
                if (arguments.length < 2) {
                    throw new ERR_MISSING_ARGS('actual', 'expected');
                }
                if (isDeepEqual === undefined) lazyLoadComparison();
                if (!isDeepEqual(t, r)) {
                    innerFail({
                        actual: t,
                        expected: r,
                        message: n,
                        operator: 'deepEqual',
                        stackStartFn: e
                    });
                }
            };
            assert.notDeepEqual = function e(t, r, n) {
                if (arguments.length < 2) {
                    throw new ERR_MISSING_ARGS('actual', 'expected');
                }
                if (isDeepEqual === undefined) lazyLoadComparison();
                if (isDeepEqual(t, r)) {
                    innerFail({
                        actual: t,
                        expected: r,
                        message: n,
                        operator: 'notDeepEqual',
                        stackStartFn: e
                    });
                }
            };
            assert.deepStrictEqual = function e(t, r, n) {
                if (arguments.length < 2) {
                    throw new ERR_MISSING_ARGS('actual', 'expected');
                }
                if (isDeepEqual === undefined) lazyLoadComparison();
                if (!isDeepStrictEqual(t, r)) {
                    innerFail({
                        actual: t,
                        expected: r,
                        message: n,
                        operator: 'deepStrictEqual',
                        stackStartFn: e
                    });
                }
            };
            assert.notDeepStrictEqual = notDeepStrictEqual;
            function notDeepStrictEqual(e, t, r) {
                if (arguments.length < 2) {
                    throw new ERR_MISSING_ARGS('actual', 'expected');
                }
                if (isDeepEqual === undefined) lazyLoadComparison();
                if (isDeepStrictEqual(e, t)) {
                    innerFail({
                        actual: e,
                        expected: t,
                        message: r,
                        operator: 'notDeepStrictEqual',
                        stackStartFn: notDeepStrictEqual
                    });
                }
            }
            assert.strictEqual = function e(t, r, n) {
                if (arguments.length < 2) {
                    throw new ERR_MISSING_ARGS('actual', 'expected');
                }
                if (!objectIs(t, r)) {
                    innerFail({
                        actual: t,
                        expected: r,
                        message: n,
                        operator: 'strictEqual',
                        stackStartFn: e
                    });
                }
            };
            assert.notStrictEqual = function e(t, r, n) {
                if (arguments.length < 2) {
                    throw new ERR_MISSING_ARGS('actual', 'expected');
                }
                if (objectIs(t, r)) {
                    innerFail({
                        actual: t,
                        expected: r,
                        message: n,
                        operator: 'notStrictEqual',
                        stackStartFn: e
                    });
                }
            };
            var Comparison = function e(t, r, n) {
                var i = this;
                _classCallCheck(this, e);
                r.forEach(function(e) {
                    if (e in t) {
                        if (n !== undefined && typeof n[e] === 'string' && isRegExp(t[e]) && t[e].test(n[e])) {
                            i[e] = n[e];
                        } else {
                            i[e] = t[e];
                        }
                    }
                });
            };
            function compareExceptionKey(e, t, r, n, i, a) {
                if (!(r in e) || !isDeepStrictEqual(e[r], t[r])) {
                    if (!n) {
                        var o = new Comparison(e, i);
                        var f = new Comparison(t, i, e);
                        var s = new AssertionError({
                            actual: o,
                            expected: f,
                            operator: 'deepStrictEqual',
                            stackStartFn: a
                        });
                        s.actual = e;
                        s.expected = t;
                        s.operator = a.name;
                        throw s;
                    }
                    innerFail({
                        actual: e,
                        expected: t,
                        message: n,
                        operator: a.name,
                        stackStartFn: a
                    });
                }
            }
            function expectedException(e, t, r, n) {
                if (typeof t !== 'function') {
                    if (isRegExp(t)) return t.test(e);
                    if (arguments.length === 2) {
                        throw new ERR_INVALID_ARG_TYPE('expected', [
                            'Function',
                            'RegExp'
                        ], t);
                    }
                    if (_typeof(e) !== 'object' || e === null) {
                        var i = new AssertionError({
                            actual: e,
                            expected: t,
                            message: r,
                            operator: 'deepStrictEqual',
                            stackStartFn: n
                        });
                        i.operator = n.name;
                        throw i;
                    }
                    var a = Object.keys(t);
                    if (t instanceof Error) {
                        a.push('name', 'message');
                    } else if (a.length === 0) {
                        throw new ERR_INVALID_ARG_VALUE('error', t, 'may not be an empty object');
                    }
                    if (isDeepEqual === undefined) lazyLoadComparison();
                    a.forEach(function(i) {
                        if (typeof e[i] === 'string' && isRegExp(t[i]) && t[i].test(e[i])) {
                            return;
                        }
                        compareExceptionKey(e, t, i, r, a, n);
                    });
                    return true;
                }
                if (t.prototype !== undefined && e instanceof t) {
                    return true;
                }
                if (Error.isPrototypeOf(t)) {
                    return false;
                }
                return t.call({}, e) === true;
            }
            function getActual(e) {
                if (typeof e !== 'function') {
                    throw new ERR_INVALID_ARG_TYPE('fn', 'Function', e);
                }
                try {
                    e();
                } catch (t) {
                    return t;
                }
                return NO_EXCEPTION_SENTINEL;
            }
            function checkIsPromise(e) {
                return isPromise(e) || e !== null && _typeof(e) === 'object' && typeof e.then === 'function' && typeof e.catch === 'function';
            }
            function waitForActual(e) {
                return Promise.resolve().then(function() {
                    var t;
                    if (typeof e === 'function') {
                        t = e();
                        if (!checkIsPromise(t)) {
                            throw new ERR_INVALID_RETURN_VALUE('instance of Promise', 'promiseFn', t);
                        }
                    } else if (checkIsPromise(e)) {
                        t = e;
                    } else {
                        throw new ERR_INVALID_ARG_TYPE('promiseFn', [
                            'Function',
                            'Promise'
                        ], e);
                    }
                    return Promise.resolve().then(function() {
                        return t;
                    }).then(function() {
                        return NO_EXCEPTION_SENTINEL;
                    }).catch(function(e) {
                        return e;
                    });
                });
            }
            function expectsError(e, t, r, n) {
                if (typeof r === 'string') {
                    if (arguments.length === 4) {
                        throw new ERR_INVALID_ARG_TYPE('error', [
                            'Object',
                            'Error',
                            'Function',
                            'RegExp'
                        ], r);
                    }
                    if (_typeof(t) === 'object' && t !== null) {
                        if (t.message === r) {
                            throw new ERR_AMBIGUOUS_ARGUMENT('error/message', "The error message \"".concat(t.message, "\" is identical to the message."));
                        }
                    } else if (t === r) {
                        throw new ERR_AMBIGUOUS_ARGUMENT('error/message', "The error \"".concat(t, "\" is identical to the message."));
                    }
                    n = r;
                    r = undefined;
                } else if (r != null && _typeof(r) !== 'object' && typeof r !== 'function') {
                    throw new ERR_INVALID_ARG_TYPE('error', [
                        'Object',
                        'Error',
                        'Function',
                        'RegExp'
                    ], r);
                }
                if (t === NO_EXCEPTION_SENTINEL) {
                    var i = '';
                    if (r && r.name) {
                        i += " (".concat(r.name, ")");
                    }
                    i += n ? ": ".concat(n) : '.';
                    var a = e.name === 'rejects' ? 'rejection' : 'exception';
                    innerFail({
                        actual: undefined,
                        expected: r,
                        operator: e.name,
                        message: "Missing expected ".concat(a).concat(i),
                        stackStartFn: e
                    });
                }
                if (r && !expectedException(t, r, n, e)) {
                    throw t;
                }
            }
            function expectsNoError(e, t, r, n) {
                if (t === NO_EXCEPTION_SENTINEL) return;
                if (typeof r === 'string') {
                    n = r;
                    r = undefined;
                }
                if (!r || expectedException(t, r)) {
                    var i = n ? ": ".concat(n) : '.';
                    var a = e.name === 'doesNotReject' ? 'rejection' : 'exception';
                    innerFail({
                        actual: t,
                        expected: r,
                        operator: e.name,
                        message: "Got unwanted ".concat(a).concat(i, "\n") + "Actual message: \"".concat(t && t.message, "\""),
                        stackStartFn: e
                    });
                }
                throw t;
            }
            assert.throws = function e(t) {
                for(var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), i = 1; i < r; i++){
                    n[i - 1] = arguments[i];
                }
                expectsError.apply(void 0, [
                    e,
                    getActual(t)
                ].concat(n));
            };
            assert.rejects = function e(t) {
                for(var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), i = 1; i < r; i++){
                    n[i - 1] = arguments[i];
                }
                return waitForActual(t).then(function(t) {
                    return expectsError.apply(void 0, [
                        e,
                        t
                    ].concat(n));
                });
            };
            assert.doesNotThrow = function e(t) {
                for(var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), i = 1; i < r; i++){
                    n[i - 1] = arguments[i];
                }
                expectsNoError.apply(void 0, [
                    e,
                    getActual(t)
                ].concat(n));
            };
            assert.doesNotReject = function e(t) {
                for(var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), i = 1; i < r; i++){
                    n[i - 1] = arguments[i];
                }
                return waitForActual(t).then(function(t) {
                    return expectsNoError.apply(void 0, [
                        e,
                        t
                    ].concat(n));
                });
            };
            assert.ifError = function e(t) {
                if (t !== null && t !== undefined) {
                    var r = 'ifError got unwanted exception: ';
                    if (_typeof(t) === 'object' && typeof t.message === 'string') {
                        if (t.message.length === 0 && t.constructor) {
                            r += t.constructor.name;
                        } else {
                            r += t.message;
                        }
                    } else {
                        r += inspect(t);
                    }
                    var n = new AssertionError({
                        actual: t,
                        expected: null,
                        operator: 'ifError',
                        message: r,
                        stackStartFn: e
                    });
                    var i = t.stack;
                    if (typeof i === 'string') {
                        var a = i.split('\n');
                        a.shift();
                        var o = n.stack.split('\n');
                        for(var f = 0; f < a.length; f++){
                            var s = o.indexOf(a[f]);
                            if (s !== -1) {
                                o = o.slice(0, s);
                                break;
                            }
                        }
                        n.stack = "".concat(o.join('\n'), "\n").concat(a.join('\n'));
                    }
                    throw n;
                }
            };
            function strict() {
                for(var e = arguments.length, t = new Array(e), r = 0; r < e; r++){
                    t[r] = arguments[r];
                }
                innerOk.apply(void 0, [
                    strict,
                    t.length
                ].concat(t));
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
            (function(e) {
                var t = typeof Uint8Array !== 'undefined' && typeof Uint16Array !== 'undefined' && typeof Int32Array !== 'undefined';
                function r(e, t) {
                    return Object.prototype.hasOwnProperty.call(e, t);
                }
                e.assign = function(e) {
                    var t = Array.prototype.slice.call(arguments, 1);
                    while(t.length){
                        var n = t.shift();
                        if (!n) {
                            continue;
                        }
                        if (typeof n !== 'object') {
                            throw new TypeError(n + 'must be non-object');
                        }
                        for(var i in n){
                            if (r(n, i)) {
                                e[i] = n[i];
                            }
                        }
                    }
                    return e;
                };
                e.shrinkBuf = function(e, t) {
                    if (e.length === t) {
                        return e;
                    }
                    if (e.subarray) {
                        return e.subarray(0, t);
                    }
                    e.length = t;
                    return e;
                };
                var n = {
                    arraySet: function e(t, r, n, i, a) {
                        if (r.subarray && t.subarray) {
                            t.set(r.subarray(n, n + i), a);
                            return;
                        }
                        for(var o = 0; o < i; o++){
                            t[a + o] = r[n + o];
                        }
                    },
                    flattenChunks: function e(t) {
                        var r, n, i, a, o, f;
                        i = 0;
                        for(r = 0, n = t.length; r < n; r++){
                            i += t[r].length;
                        }
                        f = new Uint8Array(i);
                        a = 0;
                        for(r = 0, n = t.length; r < n; r++){
                            o = t[r];
                            f.set(o, a);
                            a += o.length;
                        }
                        return f;
                    }
                };
                var i = {
                    arraySet: function e(t, r, n, i, a) {
                        for(var o = 0; o < i; o++){
                            t[a + o] = r[n + o];
                        }
                    },
                    flattenChunks: function e(t) {
                        return [].concat.apply([], t);
                    }
                };
                e.setTyped = function(t) {
                    if (t) {
                        e.Buf8 = Uint8Array;
                        e.Buf16 = Uint16Array;
                        e.Buf32 = Int32Array;
                        e.assign(e, n);
                    } else {
                        e.Buf8 = Array;
                        e.Buf16 = Array;
                        e.Buf32 = Array;
                        e.assign(e, i);
                    }
                };
                e.setTyped(t);
            })(common);
            var trees$1 = {};
            var utils$3 = common;
            var Z_FIXED$1 = 4;
            var Z_BINARY = 0;
            var Z_TEXT = 1;
            var Z_UNKNOWN$1 = 2;
            function zero$1(e) {
                var t = e.length;
                while(--t >= 0){
                    e[t] = 0;
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
            var static_ltree = new Array((L_CODES$1 + 2) * 2);
            zero$1(static_ltree);
            var static_dtree = new Array(D_CODES$1 * 2);
            zero$1(static_dtree);
            var _dist_code = new Array(DIST_CODE_LEN);
            zero$1(_dist_code);
            var _length_code = new Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);
            zero$1(_length_code);
            var base_length = new Array(LENGTH_CODES$1);
            zero$1(base_length);
            var base_dist = new Array(D_CODES$1);
            zero$1(base_dist);
            function StaticTreeDesc(e, t, r, n, i) {
                this.static_tree = e;
                this.extra_bits = t;
                this.extra_base = r;
                this.elems = n;
                this.max_length = i;
                this.has_stree = e && e.length;
            }
            var static_l_desc;
            var static_d_desc;
            var static_bl_desc;
            function TreeDesc(e, t) {
                this.dyn_tree = e;
                this.max_code = 0;
                this.stat_desc = t;
            }
            function d_code(e) {
                return e < 256 ? _dist_code[e] : _dist_code[256 + (e >>> 7)];
            }
            function put_short(e, t) {
                e.pending_buf[e.pending++] = t & 0xff;
                e.pending_buf[e.pending++] = t >>> 8 & 0xff;
            }
            function send_bits(e, t, r) {
                if (e.bi_valid > Buf_size - r) {
                    e.bi_buf |= t << e.bi_valid & 0xffff;
                    put_short(e, e.bi_buf);
                    e.bi_buf = t >> Buf_size - e.bi_valid;
                    e.bi_valid += r - Buf_size;
                } else {
                    e.bi_buf |= t << e.bi_valid & 0xffff;
                    e.bi_valid += r;
                }
            }
            function send_code(e, t, r) {
                send_bits(e, r[t * 2], r[t * 2 + 1]);
            }
            function bi_reverse(e, t) {
                var r = 0;
                do {
                    r |= e & 1;
                    e >>>= 1;
                    r <<= 1;
                }while (--t > 0)
                return r >>> 1;
            }
            function bi_flush(e) {
                if (e.bi_valid === 16) {
                    put_short(e, e.bi_buf);
                    e.bi_buf = 0;
                    e.bi_valid = 0;
                } else if (e.bi_valid >= 8) {
                    e.pending_buf[e.pending++] = e.bi_buf & 0xff;
                    e.bi_buf >>= 8;
                    e.bi_valid -= 8;
                }
            }
            function gen_bitlen(e, t) {
                var r = t.dyn_tree;
                var n = t.max_code;
                var i = t.stat_desc.static_tree;
                var a = t.stat_desc.has_stree;
                var o = t.stat_desc.extra_bits;
                var f = t.stat_desc.extra_base;
                var s = t.stat_desc.max_length;
                var u;
                var l, c;
                var h;
                var p;
                var d;
                var v = 0;
                for(h = 0; h <= MAX_BITS$1; h++){
                    e.bl_count[h] = 0;
                }
                r[e.heap[e.heap_max] * 2 + 1] = 0;
                for(u = e.heap_max + 1; u < HEAP_SIZE$1; u++){
                    l = e.heap[u];
                    h = r[r[l * 2 + 1] * 2 + 1] + 1;
                    if (h > s) {
                        h = s;
                        v++;
                    }
                    r[l * 2 + 1] = h;
                    if (l > n) {
                        continue;
                    }
                    e.bl_count[h]++;
                    p = 0;
                    if (l >= f) {
                        p = o[l - f];
                    }
                    d = r[l * 2];
                    e.opt_len += d * (h + p);
                    if (a) {
                        e.static_len += d * (i[l * 2 + 1] + p);
                    }
                }
                if (v === 0) {
                    return;
                }
                do {
                    h = s - 1;
                    while(e.bl_count[h] === 0){
                        h--;
                    }
                    e.bl_count[h]--;
                    e.bl_count[h + 1] += 2;
                    e.bl_count[s]--;
                    v -= 2;
                }while (v > 0)
                for(h = s; h !== 0; h--){
                    l = e.bl_count[h];
                    while(l !== 0){
                        c = e.heap[--u];
                        if (c > n) {
                            continue;
                        }
                        if (r[c * 2 + 1] !== h) {
                            e.opt_len += (h - r[c * 2 + 1]) * r[c * 2];
                            r[c * 2 + 1] = h;
                        }
                        l--;
                    }
                }
            }
            function gen_codes(e, t, r) {
                var n = new Array(MAX_BITS$1 + 1);
                var i = 0;
                var a;
                var o;
                for(a = 1; a <= MAX_BITS$1; a++){
                    n[a] = i = i + r[a - 1] << 1;
                }
                for(o = 0; o <= t; o++){
                    var f = e[o * 2 + 1];
                    if (f === 0) {
                        continue;
                    }
                    e[o * 2] = bi_reverse(n[f]++, f);
                }
            }
            function tr_static_init() {
                var e;
                var t;
                var r;
                var n;
                var i;
                var a = new Array(MAX_BITS$1 + 1);
                r = 0;
                for(n = 0; n < LENGTH_CODES$1 - 1; n++){
                    base_length[n] = r;
                    for(e = 0; e < 1 << extra_lbits[n]; e++){
                        _length_code[r++] = n;
                    }
                }
                _length_code[r - 1] = n;
                i = 0;
                for(n = 0; n < 16; n++){
                    base_dist[n] = i;
                    for(e = 0; e < 1 << extra_dbits[n]; e++){
                        _dist_code[i++] = n;
                    }
                }
                i >>= 7;
                for(; n < D_CODES$1; n++){
                    base_dist[n] = i << 7;
                    for(e = 0; e < 1 << extra_dbits[n] - 7; e++){
                        _dist_code[256 + i++] = n;
                    }
                }
                for(t = 0; t <= MAX_BITS$1; t++){
                    a[t] = 0;
                }
                e = 0;
                while(e <= 143){
                    static_ltree[e * 2 + 1] = 8;
                    e++;
                    a[8]++;
                }
                while(e <= 255){
                    static_ltree[e * 2 + 1] = 9;
                    e++;
                    a[9]++;
                }
                while(e <= 279){
                    static_ltree[e * 2 + 1] = 7;
                    e++;
                    a[7]++;
                }
                while(e <= 287){
                    static_ltree[e * 2 + 1] = 8;
                    e++;
                    a[8]++;
                }
                gen_codes(static_ltree, L_CODES$1 + 1, a);
                for(e = 0; e < D_CODES$1; e++){
                    static_dtree[e * 2 + 1] = 5;
                    static_dtree[e * 2] = bi_reverse(e, 5);
                }
                static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS$1 + 1, L_CODES$1, MAX_BITS$1);
                static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES$1, MAX_BITS$1);
                static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES$1, MAX_BL_BITS);
            }
            function init_block(e) {
                var t;
                for(t = 0; t < L_CODES$1; t++){
                    e.dyn_ltree[t * 2] = 0;
                }
                for(t = 0; t < D_CODES$1; t++){
                    e.dyn_dtree[t * 2] = 0;
                }
                for(t = 0; t < BL_CODES$1; t++){
                    e.bl_tree[t * 2] = 0;
                }
                e.dyn_ltree[END_BLOCK * 2] = 1;
                e.opt_len = e.static_len = 0;
                e.last_lit = e.matches = 0;
            }
            function bi_windup(e) {
                if (e.bi_valid > 8) {
                    put_short(e, e.bi_buf);
                } else if (e.bi_valid > 0) {
                    e.pending_buf[e.pending++] = e.bi_buf;
                }
                e.bi_buf = 0;
                e.bi_valid = 0;
            }
            function copy_block(e, t, r, n) {
                bi_windup(e);
                if (n) {
                    put_short(e, r);
                    put_short(e, ~r);
                }
                utils$3.arraySet(e.pending_buf, e.window, t, r, e.pending);
                e.pending += r;
            }
            function smaller(e, t, r, n) {
                var i = t * 2;
                var a = r * 2;
                return e[i] < e[a] || e[i] === e[a] && n[t] <= n[r];
            }
            function pqdownheap(e, t, r) {
                var n = e.heap[r];
                var i = r << 1;
                while(i <= e.heap_len){
                    if (i < e.heap_len && smaller(t, e.heap[i + 1], e.heap[i], e.depth)) {
                        i++;
                    }
                    if (smaller(t, n, e.heap[i], e.depth)) {
                        break;
                    }
                    e.heap[r] = e.heap[i];
                    r = i;
                    i <<= 1;
                }
                e.heap[r] = n;
            }
            function compress_block(e, t, r) {
                var n;
                var i;
                var a = 0;
                var o;
                var f;
                if (e.last_lit !== 0) {
                    do {
                        n = e.pending_buf[e.d_buf + a * 2] << 8 | e.pending_buf[e.d_buf + a * 2 + 1];
                        i = e.pending_buf[e.l_buf + a];
                        a++;
                        if (n === 0) {
                            send_code(e, i, t);
                        } else {
                            o = _length_code[i];
                            send_code(e, o + LITERALS$1 + 1, t);
                            f = extra_lbits[o];
                            if (f !== 0) {
                                i -= base_length[o];
                                send_bits(e, i, f);
                            }
                            n--;
                            o = d_code(n);
                            send_code(e, o, r);
                            f = extra_dbits[o];
                            if (f !== 0) {
                                n -= base_dist[o];
                                send_bits(e, n, f);
                            }
                        }
                    }while (a < e.last_lit)
                }
                send_code(e, END_BLOCK, t);
            }
            function build_tree(e, t) {
                var r = t.dyn_tree;
                var n = t.stat_desc.static_tree;
                var i = t.stat_desc.has_stree;
                var a = t.stat_desc.elems;
                var o, f;
                var s = -1;
                var u;
                e.heap_len = 0;
                e.heap_max = HEAP_SIZE$1;
                for(o = 0; o < a; o++){
                    if (r[o * 2] !== 0) {
                        e.heap[++e.heap_len] = s = o;
                        e.depth[o] = 0;
                    } else {
                        r[o * 2 + 1] = 0;
                    }
                }
                while(e.heap_len < 2){
                    u = e.heap[++e.heap_len] = s < 2 ? ++s : 0;
                    r[u * 2] = 1;
                    e.depth[u] = 0;
                    e.opt_len--;
                    if (i) {
                        e.static_len -= n[u * 2 + 1];
                    }
                }
                t.max_code = s;
                for(o = e.heap_len >> 1; o >= 1; o--){
                    pqdownheap(e, r, o);
                }
                u = a;
                do {
                    o = e.heap[1];
                    e.heap[1] = e.heap[e.heap_len--];
                    pqdownheap(e, r, 1);
                    f = e.heap[1];
                    e.heap[--e.heap_max] = o;
                    e.heap[--e.heap_max] = f;
                    r[u * 2] = r[o * 2] + r[f * 2];
                    e.depth[u] = (e.depth[o] >= e.depth[f] ? e.depth[o] : e.depth[f]) + 1;
                    r[o * 2 + 1] = r[f * 2 + 1] = u;
                    e.heap[1] = u++;
                    pqdownheap(e, r, 1);
                }while (e.heap_len >= 2)
                e.heap[--e.heap_max] = e.heap[1];
                gen_bitlen(e, t);
                gen_codes(r, s, e.bl_count);
            }
            function scan_tree(e, t, r) {
                var n;
                var i = -1;
                var a;
                var o = t[0 * 2 + 1];
                var f = 0;
                var s = 7;
                var u = 4;
                if (o === 0) {
                    s = 138;
                    u = 3;
                }
                t[(r + 1) * 2 + 1] = 0xffff;
                for(n = 0; n <= r; n++){
                    a = o;
                    o = t[(n + 1) * 2 + 1];
                    if (++f < s && a === o) {
                        continue;
                    } else if (f < u) {
                        e.bl_tree[a * 2] += f;
                    } else if (a !== 0) {
                        if (a !== i) {
                            e.bl_tree[a * 2]++;
                        }
                        e.bl_tree[REP_3_6 * 2]++;
                    } else if (f <= 10) {
                        e.bl_tree[REPZ_3_10 * 2]++;
                    } else {
                        e.bl_tree[REPZ_11_138 * 2]++;
                    }
                    f = 0;
                    i = a;
                    if (o === 0) {
                        s = 138;
                        u = 3;
                    } else if (a === o) {
                        s = 6;
                        u = 3;
                    } else {
                        s = 7;
                        u = 4;
                    }
                }
            }
            function send_tree(e, t, r) {
                var n;
                var i = -1;
                var a;
                var o = t[0 * 2 + 1];
                var f = 0;
                var s = 7;
                var u = 4;
                if (o === 0) {
                    s = 138;
                    u = 3;
                }
                for(n = 0; n <= r; n++){
                    a = o;
                    o = t[(n + 1) * 2 + 1];
                    if (++f < s && a === o) {
                        continue;
                    } else if (f < u) {
                        do {
                            send_code(e, a, e.bl_tree);
                        }while (--f !== 0)
                    } else if (a !== 0) {
                        if (a !== i) {
                            send_code(e, a, e.bl_tree);
                            f--;
                        }
                        send_code(e, REP_3_6, e.bl_tree);
                        send_bits(e, f - 3, 2);
                    } else if (f <= 10) {
                        send_code(e, REPZ_3_10, e.bl_tree);
                        send_bits(e, f - 3, 3);
                    } else {
                        send_code(e, REPZ_11_138, e.bl_tree);
                        send_bits(e, f - 11, 7);
                    }
                    f = 0;
                    i = a;
                    if (o === 0) {
                        s = 138;
                        u = 3;
                    } else if (a === o) {
                        s = 6;
                        u = 3;
                    } else {
                        s = 7;
                        u = 4;
                    }
                }
            }
            function build_bl_tree(e) {
                var t;
                scan_tree(e, e.dyn_ltree, e.l_desc.max_code);
                scan_tree(e, e.dyn_dtree, e.d_desc.max_code);
                build_tree(e, e.bl_desc);
                for(t = BL_CODES$1 - 1; t >= 3; t--){
                    if (e.bl_tree[bl_order[t] * 2 + 1] !== 0) {
                        break;
                    }
                }
                e.opt_len += 3 * (t + 1) + 5 + 5 + 4;
                return t;
            }
            function send_all_trees(e, t, r, n) {
                var i;
                send_bits(e, t - 257, 5);
                send_bits(e, r - 1, 5);
                send_bits(e, n - 4, 4);
                for(i = 0; i < n; i++){
                    send_bits(e, e.bl_tree[bl_order[i] * 2 + 1], 3);
                }
                send_tree(e, e.dyn_ltree, t - 1);
                send_tree(e, e.dyn_dtree, r - 1);
            }
            function detect_data_type(e) {
                var t = 0xf3ffc07f;
                var r;
                for(r = 0; r <= 31; r++, t >>>= 1){
                    if (t & 1 && e.dyn_ltree[r * 2] !== 0) {
                        return Z_BINARY;
                    }
                }
                if (e.dyn_ltree[9 * 2] !== 0 || e.dyn_ltree[10 * 2] !== 0 || e.dyn_ltree[13 * 2] !== 0) {
                    return Z_TEXT;
                }
                for(r = 32; r < LITERALS$1; r++){
                    if (e.dyn_ltree[r * 2] !== 0) {
                        return Z_TEXT;
                    }
                }
                return Z_BINARY;
            }
            var static_init_done = false;
            function _tr_init(e) {
                if (!static_init_done) {
                    tr_static_init();
                    static_init_done = true;
                }
                e.l_desc = new TreeDesc(e.dyn_ltree, static_l_desc);
                e.d_desc = new TreeDesc(e.dyn_dtree, static_d_desc);
                e.bl_desc = new TreeDesc(e.bl_tree, static_bl_desc);
                e.bi_buf = 0;
                e.bi_valid = 0;
                init_block(e);
            }
            function _tr_stored_block(e, t, r, n) {
                send_bits(e, (STORED_BLOCK << 1) + (n ? 1 : 0), 3);
                copy_block(e, t, r, true);
            }
            function _tr_align(e) {
                send_bits(e, STATIC_TREES << 1, 3);
                send_code(e, END_BLOCK, static_ltree);
                bi_flush(e);
            }
            function _tr_flush_block(e, t, r, n) {
                var i, a;
                var o = 0;
                if (e.level > 0) {
                    if (e.strm.data_type === Z_UNKNOWN$1) {
                        e.strm.data_type = detect_data_type(e);
                    }
                    build_tree(e, e.l_desc);
                    build_tree(e, e.d_desc);
                    o = build_bl_tree(e);
                    i = e.opt_len + 3 + 7 >>> 3;
                    a = e.static_len + 3 + 7 >>> 3;
                    if (a <= i) {
                        i = a;
                    }
                } else {
                    i = a = r + 5;
                }
                if (r + 4 <= i && t !== -1) {
                    _tr_stored_block(e, t, r, n);
                } else if (e.strategy === Z_FIXED$1 || a === i) {
                    send_bits(e, (STATIC_TREES << 1) + (n ? 1 : 0), 3);
                    compress_block(e, static_ltree, static_dtree);
                } else {
                    send_bits(e, (DYN_TREES << 1) + (n ? 1 : 0), 3);
                    send_all_trees(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, o + 1);
                    compress_block(e, e.dyn_ltree, e.dyn_dtree);
                }
                init_block(e);
                if (n) {
                    bi_windup(e);
                }
            }
            function _tr_tally(e, t, r) {
                e.pending_buf[e.d_buf + e.last_lit * 2] = t >>> 8 & 0xff;
                e.pending_buf[e.d_buf + e.last_lit * 2 + 1] = t & 0xff;
                e.pending_buf[e.l_buf + e.last_lit] = r & 0xff;
                e.last_lit++;
                if (t === 0) {
                    e.dyn_ltree[r * 2]++;
                } else {
                    e.matches++;
                    t--;
                    e.dyn_ltree[(_length_code[r] + LITERALS$1 + 1) * 2]++;
                    e.dyn_dtree[d_code(t) * 2]++;
                }
                return e.last_lit === e.lit_bufsize - 1;
            }
            trees$1._tr_init = _tr_init;
            trees$1._tr_stored_block = _tr_stored_block;
            trees$1._tr_flush_block = _tr_flush_block;
            trees$1._tr_tally = _tr_tally;
            trees$1._tr_align = _tr_align;
            function adler32$2(e, t, r, n) {
                var i = e & 0xffff | 0, a = e >>> 16 & 0xffff | 0, o = 0;
                while(r !== 0){
                    o = r > 2000 ? 2000 : r;
                    r -= o;
                    do {
                        i = i + t[n++] | 0;
                        a = a + i | 0;
                    }while (--o)
                    i %= 65521;
                    a %= 65521;
                }
                return i | a << 16 | 0;
            }
            var adler32_1 = adler32$2;
            function makeTable() {
                var e, t = [];
                for(var r = 0; r < 256; r++){
                    e = r;
                    for(var n = 0; n < 8; n++){
                        e = e & 1 ? 0xEDB88320 ^ e >>> 1 : e >>> 1;
                    }
                    t[r] = e;
                }
                return t;
            }
            var crcTable = makeTable();
            function crc32$2(e, t, r, n) {
                var i = crcTable, a = n + r;
                e ^= -1;
                for(var o = n; o < a; o++){
                    e = e >>> 8 ^ i[(e ^ t[o]) & 0xFF];
                }
                return e ^ -1;
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
            function err(e, t) {
                e.msg = msg[t];
                return t;
            }
            function rank(e) {
                return (e << 1) - (e > 4 ? 9 : 0);
            }
            function zero(e) {
                var t = e.length;
                while(--t >= 0){
                    e[t] = 0;
                }
            }
            function flush_pending(e) {
                var t = e.state;
                var r = t.pending;
                if (r > e.avail_out) {
                    r = e.avail_out;
                }
                if (r === 0) {
                    return;
                }
                utils$2.arraySet(e.output, t.pending_buf, t.pending_out, r, e.next_out);
                e.next_out += r;
                t.pending_out += r;
                e.total_out += r;
                e.avail_out -= r;
                t.pending -= r;
                if (t.pending === 0) {
                    t.pending_out = 0;
                }
            }
            function flush_block_only(e, t) {
                trees._tr_flush_block(e, e.block_start >= 0 ? e.block_start : -1, e.strstart - e.block_start, t);
                e.block_start = e.strstart;
                flush_pending(e.strm);
            }
            function put_byte(e, t) {
                e.pending_buf[e.pending++] = t;
            }
            function putShortMSB(e, t) {
                e.pending_buf[e.pending++] = t >>> 8 & 0xff;
                e.pending_buf[e.pending++] = t & 0xff;
            }
            function read_buf(e, t, r, n) {
                var i = e.avail_in;
                if (i > n) {
                    i = n;
                }
                if (i === 0) {
                    return 0;
                }
                e.avail_in -= i;
                utils$2.arraySet(t, e.input, e.next_in, i, r);
                if (e.state.wrap === 1) {
                    e.adler = adler32$1(e.adler, t, i, r);
                } else if (e.state.wrap === 2) {
                    e.adler = crc32$1(e.adler, t, i, r);
                }
                e.next_in += i;
                e.total_in += i;
                return i;
            }
            function longest_match(e, t) {
                var r = e.max_chain_length;
                var n = e.strstart;
                var i;
                var a;
                var o = e.prev_length;
                var f = e.nice_match;
                var s = e.strstart > e.w_size - MIN_LOOKAHEAD ? e.strstart - (e.w_size - MIN_LOOKAHEAD) : 0;
                var u = e.window;
                var l = e.w_mask;
                var c = e.prev;
                var h = e.strstart + MAX_MATCH;
                var p = u[n + o - 1];
                var d = u[n + o];
                if (e.prev_length >= e.good_match) {
                    r >>= 2;
                }
                if (f > e.lookahead) {
                    f = e.lookahead;
                }
                do {
                    i = t;
                    if (u[i + o] !== d || u[i + o - 1] !== p || u[i] !== u[n] || u[++i] !== u[n + 1]) {
                        continue;
                    }
                    n += 2;
                    i++;
                    do {}while (u[++n] === u[++i] && u[++n] === u[++i] && u[++n] === u[++i] && u[++n] === u[++i] && u[++n] === u[++i] && u[++n] === u[++i] && u[++n] === u[++i] && u[++n] === u[++i] && n < h)
                    a = MAX_MATCH - (h - n);
                    n = h - MAX_MATCH;
                    if (a > o) {
                        e.match_start = t;
                        o = a;
                        if (a >= f) {
                            break;
                        }
                        p = u[n + o - 1];
                        d = u[n + o];
                    }
                }while ((t = c[t & l]) > s && --r !== 0)
                if (o <= e.lookahead) {
                    return o;
                }
                return e.lookahead;
            }
            function fill_window(e) {
                var t = e.w_size;
                var r, n, i, a, o;
                do {
                    a = e.window_size - e.lookahead - e.strstart;
                    if (e.strstart >= t + (t - MIN_LOOKAHEAD)) {
                        utils$2.arraySet(e.window, e.window, t, t, 0);
                        e.match_start -= t;
                        e.strstart -= t;
                        e.block_start -= t;
                        n = e.hash_size;
                        r = n;
                        do {
                            i = e.head[--r];
                            e.head[r] = i >= t ? i - t : 0;
                        }while (--n)
                        n = t;
                        r = n;
                        do {
                            i = e.prev[--r];
                            e.prev[r] = i >= t ? i - t : 0;
                        }while (--n)
                        a += t;
                    }
                    if (e.strm.avail_in === 0) {
                        break;
                    }
                    n = read_buf(e.strm, e.window, e.strstart + e.lookahead, a);
                    e.lookahead += n;
                    if (e.lookahead + e.insert >= MIN_MATCH) {
                        o = e.strstart - e.insert;
                        e.ins_h = e.window[o];
                        e.ins_h = (e.ins_h << e.hash_shift ^ e.window[o + 1]) & e.hash_mask;
                        while(e.insert){
                            e.ins_h = (e.ins_h << e.hash_shift ^ e.window[o + MIN_MATCH - 1]) & e.hash_mask;
                            e.prev[o & e.w_mask] = e.head[e.ins_h];
                            e.head[e.ins_h] = o;
                            o++;
                            e.insert--;
                            if (e.lookahead + e.insert < MIN_MATCH) {
                                break;
                            }
                        }
                    }
                }while (e.lookahead < MIN_LOOKAHEAD && e.strm.avail_in !== 0)
            }
            function deflate_stored(e, t) {
                var r = 0xffff;
                if (r > e.pending_buf_size - 5) {
                    r = e.pending_buf_size - 5;
                }
                for(;;){
                    if (e.lookahead <= 1) {
                        fill_window(e);
                        if (e.lookahead === 0 && t === Z_NO_FLUSH) {
                            return BS_NEED_MORE;
                        }
                        if (e.lookahead === 0) {
                            break;
                        }
                    }
                    e.strstart += e.lookahead;
                    e.lookahead = 0;
                    var n = e.block_start + r;
                    if (e.strstart === 0 || e.strstart >= n) {
                        e.lookahead = e.strstart - n;
                        e.strstart = n;
                        flush_block_only(e, false);
                        if (e.strm.avail_out === 0) {
                            return BS_NEED_MORE;
                        }
                    }
                    if (e.strstart - e.block_start >= e.w_size - MIN_LOOKAHEAD) {
                        flush_block_only(e, false);
                        if (e.strm.avail_out === 0) {
                            return BS_NEED_MORE;
                        }
                    }
                }
                e.insert = 0;
                if (t === Z_FINISH$1) {
                    flush_block_only(e, true);
                    if (e.strm.avail_out === 0) {
                        return BS_FINISH_STARTED;
                    }
                    return BS_FINISH_DONE;
                }
                if (e.strstart > e.block_start) {
                    flush_block_only(e, false);
                    if (e.strm.avail_out === 0) {
                        return BS_NEED_MORE;
                    }
                }
                return BS_NEED_MORE;
            }
            function deflate_fast(e, t) {
                var r;
                var n;
                for(;;){
                    if (e.lookahead < MIN_LOOKAHEAD) {
                        fill_window(e);
                        if (e.lookahead < MIN_LOOKAHEAD && t === Z_NO_FLUSH) {
                            return BS_NEED_MORE;
                        }
                        if (e.lookahead === 0) {
                            break;
                        }
                    }
                    r = 0;
                    if (e.lookahead >= MIN_MATCH) {
                        e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + MIN_MATCH - 1]) & e.hash_mask;
                        r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h];
                        e.head[e.ins_h] = e.strstart;
                    }
                    if (r !== 0 && e.strstart - r <= e.w_size - MIN_LOOKAHEAD) {
                        e.match_length = longest_match(e, r);
                    }
                    if (e.match_length >= MIN_MATCH) {
                        n = trees._tr_tally(e, e.strstart - e.match_start, e.match_length - MIN_MATCH);
                        e.lookahead -= e.match_length;
                        if (e.match_length <= e.max_lazy_match && e.lookahead >= MIN_MATCH) {
                            e.match_length--;
                            do {
                                e.strstart++;
                                e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + MIN_MATCH - 1]) & e.hash_mask;
                                r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h];
                                e.head[e.ins_h] = e.strstart;
                            }while (--e.match_length !== 0)
                            e.strstart++;
                        } else {
                            e.strstart += e.match_length;
                            e.match_length = 0;
                            e.ins_h = e.window[e.strstart];
                            e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 1]) & e.hash_mask;
                        }
                    } else {
                        n = trees._tr_tally(e, 0, e.window[e.strstart]);
                        e.lookahead--;
                        e.strstart++;
                    }
                    if (n) {
                        flush_block_only(e, false);
                        if (e.strm.avail_out === 0) {
                            return BS_NEED_MORE;
                        }
                    }
                }
                e.insert = e.strstart < MIN_MATCH - 1 ? e.strstart : MIN_MATCH - 1;
                if (t === Z_FINISH$1) {
                    flush_block_only(e, true);
                    if (e.strm.avail_out === 0) {
                        return BS_FINISH_STARTED;
                    }
                    return BS_FINISH_DONE;
                }
                if (e.last_lit) {
                    flush_block_only(e, false);
                    if (e.strm.avail_out === 0) {
                        return BS_NEED_MORE;
                    }
                }
                return BS_BLOCK_DONE;
            }
            function deflate_slow(e, t) {
                var r;
                var n;
                var i;
                for(;;){
                    if (e.lookahead < MIN_LOOKAHEAD) {
                        fill_window(e);
                        if (e.lookahead < MIN_LOOKAHEAD && t === Z_NO_FLUSH) {
                            return BS_NEED_MORE;
                        }
                        if (e.lookahead === 0) {
                            break;
                        }
                    }
                    r = 0;
                    if (e.lookahead >= MIN_MATCH) {
                        e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + MIN_MATCH - 1]) & e.hash_mask;
                        r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h];
                        e.head[e.ins_h] = e.strstart;
                    }
                    e.prev_length = e.match_length;
                    e.prev_match = e.match_start;
                    e.match_length = MIN_MATCH - 1;
                    if (r !== 0 && e.prev_length < e.max_lazy_match && e.strstart - r <= e.w_size - MIN_LOOKAHEAD) {
                        e.match_length = longest_match(e, r);
                        if (e.match_length <= 5 && (e.strategy === Z_FILTERED || e.match_length === MIN_MATCH && e.strstart - e.match_start > 4096)) {
                            e.match_length = MIN_MATCH - 1;
                        }
                    }
                    if (e.prev_length >= MIN_MATCH && e.match_length <= e.prev_length) {
                        i = e.strstart + e.lookahead - MIN_MATCH;
                        n = trees._tr_tally(e, e.strstart - 1 - e.prev_match, e.prev_length - MIN_MATCH);
                        e.lookahead -= e.prev_length - 1;
                        e.prev_length -= 2;
                        do {
                            if (++e.strstart <= i) {
                                e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + MIN_MATCH - 1]) & e.hash_mask;
                                r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h];
                                e.head[e.ins_h] = e.strstart;
                            }
                        }while (--e.prev_length !== 0)
                        e.match_available = 0;
                        e.match_length = MIN_MATCH - 1;
                        e.strstart++;
                        if (n) {
                            flush_block_only(e, false);
                            if (e.strm.avail_out === 0) {
                                return BS_NEED_MORE;
                            }
                        }
                    } else if (e.match_available) {
                        n = trees._tr_tally(e, 0, e.window[e.strstart - 1]);
                        if (n) {
                            flush_block_only(e, false);
                        }
                        e.strstart++;
                        e.lookahead--;
                        if (e.strm.avail_out === 0) {
                            return BS_NEED_MORE;
                        }
                    } else {
                        e.match_available = 1;
                        e.strstart++;
                        e.lookahead--;
                    }
                }
                if (e.match_available) {
                    n = trees._tr_tally(e, 0, e.window[e.strstart - 1]);
                    e.match_available = 0;
                }
                e.insert = e.strstart < MIN_MATCH - 1 ? e.strstart : MIN_MATCH - 1;
                if (t === Z_FINISH$1) {
                    flush_block_only(e, true);
                    if (e.strm.avail_out === 0) {
                        return BS_FINISH_STARTED;
                    }
                    return BS_FINISH_DONE;
                }
                if (e.last_lit) {
                    flush_block_only(e, false);
                    if (e.strm.avail_out === 0) {
                        return BS_NEED_MORE;
                    }
                }
                return BS_BLOCK_DONE;
            }
            function deflate_rle(e, t) {
                var r;
                var n;
                var i, a;
                var o = e.window;
                for(;;){
                    if (e.lookahead <= MAX_MATCH) {
                        fill_window(e);
                        if (e.lookahead <= MAX_MATCH && t === Z_NO_FLUSH) {
                            return BS_NEED_MORE;
                        }
                        if (e.lookahead === 0) {
                            break;
                        }
                    }
                    e.match_length = 0;
                    if (e.lookahead >= MIN_MATCH && e.strstart > 0) {
                        i = e.strstart - 1;
                        n = o[i];
                        if (n === o[++i] && n === o[++i] && n === o[++i]) {
                            a = e.strstart + MAX_MATCH;
                            do {}while (n === o[++i] && n === o[++i] && n === o[++i] && n === o[++i] && n === o[++i] && n === o[++i] && n === o[++i] && n === o[++i] && i < a)
                            e.match_length = MAX_MATCH - (a - i);
                            if (e.match_length > e.lookahead) {
                                e.match_length = e.lookahead;
                            }
                        }
                    }
                    if (e.match_length >= MIN_MATCH) {
                        r = trees._tr_tally(e, 1, e.match_length - MIN_MATCH);
                        e.lookahead -= e.match_length;
                        e.strstart += e.match_length;
                        e.match_length = 0;
                    } else {
                        r = trees._tr_tally(e, 0, e.window[e.strstart]);
                        e.lookahead--;
                        e.strstart++;
                    }
                    if (r) {
                        flush_block_only(e, false);
                        if (e.strm.avail_out === 0) {
                            return BS_NEED_MORE;
                        }
                    }
                }
                e.insert = 0;
                if (t === Z_FINISH$1) {
                    flush_block_only(e, true);
                    if (e.strm.avail_out === 0) {
                        return BS_FINISH_STARTED;
                    }
                    return BS_FINISH_DONE;
                }
                if (e.last_lit) {
                    flush_block_only(e, false);
                    if (e.strm.avail_out === 0) {
                        return BS_NEED_MORE;
                    }
                }
                return BS_BLOCK_DONE;
            }
            function deflate_huff(e, t) {
                var r;
                for(;;){
                    if (e.lookahead === 0) {
                        fill_window(e);
                        if (e.lookahead === 0) {
                            if (t === Z_NO_FLUSH) {
                                return BS_NEED_MORE;
                            }
                            break;
                        }
                    }
                    e.match_length = 0;
                    r = trees._tr_tally(e, 0, e.window[e.strstart]);
                    e.lookahead--;
                    e.strstart++;
                    if (r) {
                        flush_block_only(e, false);
                        if (e.strm.avail_out === 0) {
                            return BS_NEED_MORE;
                        }
                    }
                }
                e.insert = 0;
                if (t === Z_FINISH$1) {
                    flush_block_only(e, true);
                    if (e.strm.avail_out === 0) {
                        return BS_FINISH_STARTED;
                    }
                    return BS_FINISH_DONE;
                }
                if (e.last_lit) {
                    flush_block_only(e, false);
                    if (e.strm.avail_out === 0) {
                        return BS_NEED_MORE;
                    }
                }
                return BS_BLOCK_DONE;
            }
            function Config(e, t, r, n, i) {
                this.good_length = e;
                this.max_lazy = t;
                this.nice_length = r;
                this.max_chain = n;
                this.func = i;
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
            function lm_init(e) {
                e.window_size = 2 * e.w_size;
                zero(e.head);
                e.max_lazy_match = configuration_table[e.level].max_lazy;
                e.good_match = configuration_table[e.level].good_length;
                e.nice_match = configuration_table[e.level].nice_length;
                e.max_chain_length = configuration_table[e.level].max_chain;
                e.strstart = 0;
                e.block_start = 0;
                e.lookahead = 0;
                e.insert = 0;
                e.match_length = e.prev_length = MIN_MATCH - 1;
                e.match_available = 0;
                e.ins_h = 0;
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
                this.dyn_ltree = new utils$2.Buf16(HEAP_SIZE * 2);
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
            function deflateResetKeep(e) {
                var t;
                if (!e || !e.state) {
                    return err(e, Z_STREAM_ERROR$1);
                }
                e.total_in = e.total_out = 0;
                e.data_type = Z_UNKNOWN;
                t = e.state;
                t.pending = 0;
                t.pending_out = 0;
                if (t.wrap < 0) {
                    t.wrap = -t.wrap;
                }
                t.status = t.wrap ? INIT_STATE : BUSY_STATE;
                e.adler = t.wrap === 2 ? 0 : 1;
                t.last_flush = Z_NO_FLUSH;
                trees._tr_init(t);
                return Z_OK$1;
            }
            function deflateReset(e) {
                var t = deflateResetKeep(e);
                if (t === Z_OK$1) {
                    lm_init(e.state);
                }
                return t;
            }
            function deflateSetHeader(e, t) {
                if (!e || !e.state) {
                    return Z_STREAM_ERROR$1;
                }
                if (e.state.wrap !== 2) {
                    return Z_STREAM_ERROR$1;
                }
                e.state.gzhead = t;
                return Z_OK$1;
            }
            function deflateInit2(e, t, r, n, i, a) {
                if (!e) {
                    return Z_STREAM_ERROR$1;
                }
                var o = 1;
                if (t === Z_DEFAULT_COMPRESSION) {
                    t = 6;
                }
                if (n < 0) {
                    o = 0;
                    n = -n;
                } else if (n > 15) {
                    o = 2;
                    n -= 16;
                }
                if (i < 1 || i > MAX_MEM_LEVEL || r !== Z_DEFLATED$1 || n < 8 || n > 15 || t < 0 || t > 9 || a < 0 || a > Z_FIXED) {
                    return err(e, Z_STREAM_ERROR$1);
                }
                if (n === 8) {
                    n = 9;
                }
                var f = new DeflateState();
                e.state = f;
                f.strm = e;
                f.wrap = o;
                f.gzhead = null;
                f.w_bits = n;
                f.w_size = 1 << f.w_bits;
                f.w_mask = f.w_size - 1;
                f.hash_bits = i + 7;
                f.hash_size = 1 << f.hash_bits;
                f.hash_mask = f.hash_size - 1;
                f.hash_shift = ~~((f.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
                f.window = new utils$2.Buf8(f.w_size * 2);
                f.head = new utils$2.Buf16(f.hash_size);
                f.prev = new utils$2.Buf16(f.w_size);
                f.lit_bufsize = 1 << i + 6;
                f.pending_buf_size = f.lit_bufsize * 4;
                f.pending_buf = new utils$2.Buf8(f.pending_buf_size);
                f.d_buf = 1 * f.lit_bufsize;
                f.l_buf = (1 + 2) * f.lit_bufsize;
                f.level = t;
                f.strategy = a;
                f.method = r;
                return deflateReset(e);
            }
            function deflateInit(e, t) {
                return deflateInit2(e, t, Z_DEFLATED$1, MAX_WBITS$1, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
            }
            function deflate(e, t) {
                var r, n;
                var i, a;
                if (!e || !e.state || t > Z_BLOCK$1 || t < 0) {
                    return e ? err(e, Z_STREAM_ERROR$1) : Z_STREAM_ERROR$1;
                }
                n = e.state;
                if (!e.output || !e.input && e.avail_in !== 0 || n.status === FINISH_STATE && t !== Z_FINISH$1) {
                    return err(e, e.avail_out === 0 ? Z_BUF_ERROR$1 : Z_STREAM_ERROR$1);
                }
                n.strm = e;
                r = n.last_flush;
                n.last_flush = t;
                if (n.status === INIT_STATE) {
                    if (n.wrap === 2) {
                        e.adler = 0;
                        put_byte(n, 31);
                        put_byte(n, 139);
                        put_byte(n, 8);
                        if (!n.gzhead) {
                            put_byte(n, 0);
                            put_byte(n, 0);
                            put_byte(n, 0);
                            put_byte(n, 0);
                            put_byte(n, 0);
                            put_byte(n, n.level === 9 ? 2 : n.strategy >= Z_HUFFMAN_ONLY || n.level < 2 ? 4 : 0);
                            put_byte(n, OS_CODE);
                            n.status = BUSY_STATE;
                        } else {
                            put_byte(n, (n.gzhead.text ? 1 : 0) + (n.gzhead.hcrc ? 2 : 0) + (!n.gzhead.extra ? 0 : 4) + (!n.gzhead.name ? 0 : 8) + (!n.gzhead.comment ? 0 : 16));
                            put_byte(n, n.gzhead.time & 0xff);
                            put_byte(n, n.gzhead.time >> 8 & 0xff);
                            put_byte(n, n.gzhead.time >> 16 & 0xff);
                            put_byte(n, n.gzhead.time >> 24 & 0xff);
                            put_byte(n, n.level === 9 ? 2 : n.strategy >= Z_HUFFMAN_ONLY || n.level < 2 ? 4 : 0);
                            put_byte(n, n.gzhead.os & 0xff);
                            if (n.gzhead.extra && n.gzhead.extra.length) {
                                put_byte(n, n.gzhead.extra.length & 0xff);
                                put_byte(n, n.gzhead.extra.length >> 8 & 0xff);
                            }
                            if (n.gzhead.hcrc) {
                                e.adler = crc32$1(e.adler, n.pending_buf, n.pending, 0);
                            }
                            n.gzindex = 0;
                            n.status = EXTRA_STATE;
                        }
                    } else {
                        var o = Z_DEFLATED$1 + (n.w_bits - 8 << 4) << 8;
                        var f = -1;
                        if (n.strategy >= Z_HUFFMAN_ONLY || n.level < 2) {
                            f = 0;
                        } else if (n.level < 6) {
                            f = 1;
                        } else if (n.level === 6) {
                            f = 2;
                        } else {
                            f = 3;
                        }
                        o |= f << 6;
                        if (n.strstart !== 0) {
                            o |= PRESET_DICT;
                        }
                        o += 31 - o % 31;
                        n.status = BUSY_STATE;
                        putShortMSB(n, o);
                        if (n.strstart !== 0) {
                            putShortMSB(n, e.adler >>> 16);
                            putShortMSB(n, e.adler & 0xffff);
                        }
                        e.adler = 1;
                    }
                }
                if (n.status === EXTRA_STATE) {
                    if (n.gzhead.extra) {
                        i = n.pending;
                        while(n.gzindex < (n.gzhead.extra.length & 0xffff)){
                            if (n.pending === n.pending_buf_size) {
                                if (n.gzhead.hcrc && n.pending > i) {
                                    e.adler = crc32$1(e.adler, n.pending_buf, n.pending - i, i);
                                }
                                flush_pending(e);
                                i = n.pending;
                                if (n.pending === n.pending_buf_size) {
                                    break;
                                }
                            }
                            put_byte(n, n.gzhead.extra[n.gzindex] & 0xff);
                            n.gzindex++;
                        }
                        if (n.gzhead.hcrc && n.pending > i) {
                            e.adler = crc32$1(e.adler, n.pending_buf, n.pending - i, i);
                        }
                        if (n.gzindex === n.gzhead.extra.length) {
                            n.gzindex = 0;
                            n.status = NAME_STATE;
                        }
                    } else {
                        n.status = NAME_STATE;
                    }
                }
                if (n.status === NAME_STATE) {
                    if (n.gzhead.name) {
                        i = n.pending;
                        do {
                            if (n.pending === n.pending_buf_size) {
                                if (n.gzhead.hcrc && n.pending > i) {
                                    e.adler = crc32$1(e.adler, n.pending_buf, n.pending - i, i);
                                }
                                flush_pending(e);
                                i = n.pending;
                                if (n.pending === n.pending_buf_size) {
                                    a = 1;
                                    break;
                                }
                            }
                            if (n.gzindex < n.gzhead.name.length) {
                                a = n.gzhead.name.charCodeAt(n.gzindex++) & 0xff;
                            } else {
                                a = 0;
                            }
                            put_byte(n, a);
                        }while (a !== 0)
                        if (n.gzhead.hcrc && n.pending > i) {
                            e.adler = crc32$1(e.adler, n.pending_buf, n.pending - i, i);
                        }
                        if (a === 0) {
                            n.gzindex = 0;
                            n.status = COMMENT_STATE;
                        }
                    } else {
                        n.status = COMMENT_STATE;
                    }
                }
                if (n.status === COMMENT_STATE) {
                    if (n.gzhead.comment) {
                        i = n.pending;
                        do {
                            if (n.pending === n.pending_buf_size) {
                                if (n.gzhead.hcrc && n.pending > i) {
                                    e.adler = crc32$1(e.adler, n.pending_buf, n.pending - i, i);
                                }
                                flush_pending(e);
                                i = n.pending;
                                if (n.pending === n.pending_buf_size) {
                                    a = 1;
                                    break;
                                }
                            }
                            if (n.gzindex < n.gzhead.comment.length) {
                                a = n.gzhead.comment.charCodeAt(n.gzindex++) & 0xff;
                            } else {
                                a = 0;
                            }
                            put_byte(n, a);
                        }while (a !== 0)
                        if (n.gzhead.hcrc && n.pending > i) {
                            e.adler = crc32$1(e.adler, n.pending_buf, n.pending - i, i);
                        }
                        if (a === 0) {
                            n.status = HCRC_STATE;
                        }
                    } else {
                        n.status = HCRC_STATE;
                    }
                }
                if (n.status === HCRC_STATE) {
                    if (n.gzhead.hcrc) {
                        if (n.pending + 2 > n.pending_buf_size) {
                            flush_pending(e);
                        }
                        if (n.pending + 2 <= n.pending_buf_size) {
                            put_byte(n, e.adler & 0xff);
                            put_byte(n, e.adler >> 8 & 0xff);
                            e.adler = 0;
                            n.status = BUSY_STATE;
                        }
                    } else {
                        n.status = BUSY_STATE;
                    }
                }
                if (n.pending !== 0) {
                    flush_pending(e);
                    if (e.avail_out === 0) {
                        n.last_flush = -1;
                        return Z_OK$1;
                    }
                } else if (e.avail_in === 0 && rank(t) <= rank(r) && t !== Z_FINISH$1) {
                    return err(e, Z_BUF_ERROR$1);
                }
                if (n.status === FINISH_STATE && e.avail_in !== 0) {
                    return err(e, Z_BUF_ERROR$1);
                }
                if (e.avail_in !== 0 || n.lookahead !== 0 || t !== Z_NO_FLUSH && n.status !== FINISH_STATE) {
                    var s = n.strategy === Z_HUFFMAN_ONLY ? deflate_huff(n, t) : n.strategy === Z_RLE ? deflate_rle(n, t) : configuration_table[n.level].func(n, t);
                    if (s === BS_FINISH_STARTED || s === BS_FINISH_DONE) {
                        n.status = FINISH_STATE;
                    }
                    if (s === BS_NEED_MORE || s === BS_FINISH_STARTED) {
                        if (e.avail_out === 0) {
                            n.last_flush = -1;
                        }
                        return Z_OK$1;
                    }
                    if (s === BS_BLOCK_DONE) {
                        if (t === Z_PARTIAL_FLUSH) {
                            trees._tr_align(n);
                        } else if (t !== Z_BLOCK$1) {
                            trees._tr_stored_block(n, 0, 0, false);
                            if (t === Z_FULL_FLUSH) {
                                zero(n.head);
                                if (n.lookahead === 0) {
                                    n.strstart = 0;
                                    n.block_start = 0;
                                    n.insert = 0;
                                }
                            }
                        }
                        flush_pending(e);
                        if (e.avail_out === 0) {
                            n.last_flush = -1;
                            return Z_OK$1;
                        }
                    }
                }
                if (t !== Z_FINISH$1) {
                    return Z_OK$1;
                }
                if (n.wrap <= 0) {
                    return Z_STREAM_END$1;
                }
                if (n.wrap === 2) {
                    put_byte(n, e.adler & 0xff);
                    put_byte(n, e.adler >> 8 & 0xff);
                    put_byte(n, e.adler >> 16 & 0xff);
                    put_byte(n, e.adler >> 24 & 0xff);
                    put_byte(n, e.total_in & 0xff);
                    put_byte(n, e.total_in >> 8 & 0xff);
                    put_byte(n, e.total_in >> 16 & 0xff);
                    put_byte(n, e.total_in >> 24 & 0xff);
                } else {
                    putShortMSB(n, e.adler >>> 16);
                    putShortMSB(n, e.adler & 0xffff);
                }
                flush_pending(e);
                if (n.wrap > 0) {
                    n.wrap = -n.wrap;
                }
                return n.pending !== 0 ? Z_OK$1 : Z_STREAM_END$1;
            }
            function deflateEnd(e) {
                var t;
                if (!e || !e.state) {
                    return Z_STREAM_ERROR$1;
                }
                t = e.state.status;
                if (t !== INIT_STATE && t !== EXTRA_STATE && t !== NAME_STATE && t !== COMMENT_STATE && t !== HCRC_STATE && t !== BUSY_STATE && t !== FINISH_STATE) {
                    return err(e, Z_STREAM_ERROR$1);
                }
                e.state = null;
                return t === BUSY_STATE ? err(e, Z_DATA_ERROR$1) : Z_OK$1;
            }
            function deflateSetDictionary(e, t) {
                var r = t.length;
                var n;
                var i, a;
                var o;
                var f;
                var s;
                var u;
                var l;
                if (!e || !e.state) {
                    return Z_STREAM_ERROR$1;
                }
                n = e.state;
                o = n.wrap;
                if (o === 2 || o === 1 && n.status !== INIT_STATE || n.lookahead) {
                    return Z_STREAM_ERROR$1;
                }
                if (o === 1) {
                    e.adler = adler32$1(e.adler, t, r, 0);
                }
                n.wrap = 0;
                if (r >= n.w_size) {
                    if (o === 0) {
                        zero(n.head);
                        n.strstart = 0;
                        n.block_start = 0;
                        n.insert = 0;
                    }
                    l = new utils$2.Buf8(n.w_size);
                    utils$2.arraySet(l, t, r - n.w_size, n.w_size, 0);
                    t = l;
                    r = n.w_size;
                }
                f = e.avail_in;
                s = e.next_in;
                u = e.input;
                e.avail_in = r;
                e.next_in = 0;
                e.input = t;
                fill_window(n);
                while(n.lookahead >= MIN_MATCH){
                    i = n.strstart;
                    a = n.lookahead - (MIN_MATCH - 1);
                    do {
                        n.ins_h = (n.ins_h << n.hash_shift ^ n.window[i + MIN_MATCH - 1]) & n.hash_mask;
                        n.prev[i & n.w_mask] = n.head[n.ins_h];
                        n.head[n.ins_h] = i;
                        i++;
                    }while (--a)
                    n.strstart = i;
                    n.lookahead = MIN_MATCH - 1;
                    fill_window(n);
                }
                n.strstart += n.lookahead;
                n.block_start = n.strstart;
                n.insert = n.lookahead;
                n.lookahead = 0;
                n.match_length = n.prev_length = MIN_MATCH - 1;
                n.match_available = 0;
                e.next_in = s;
                e.input = u;
                e.avail_in = f;
                n.wrap = o;
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
            var inffast = function e(t, r) {
                var n;
                var i;
                var a;
                var o;
                var f;
                var s;
                var u;
                var l;
                var c;
                var h;
                var p;
                var d;
                var v;
                var y;
                var g;
                var b;
                var w;
                var _;
                var m;
                var E;
                var k;
                var A;
                var S;
                var O, x;
                n = t.state;
                i = t.next_in;
                O = t.input;
                a = i + (t.avail_in - 5);
                o = t.next_out;
                x = t.output;
                f = o - (r - t.avail_out);
                s = o + (t.avail_out - 257);
                u = n.dmax;
                l = n.wsize;
                c = n.whave;
                h = n.wnext;
                p = n.window;
                d = n.hold;
                v = n.bits;
                y = n.lencode;
                g = n.distcode;
                b = (1 << n.lenbits) - 1;
                w = (1 << n.distbits) - 1;
                e: do {
                    if (v < 15) {
                        d += O[i++] << v;
                        v += 8;
                        d += O[i++] << v;
                        v += 8;
                    }
                    _ = y[d & b];
                    t: for(;;){
                        m = _ >>> 24;
                        d >>>= m;
                        v -= m;
                        m = _ >>> 16 & 0xff;
                        if (m === 0) {
                            x[o++] = _ & 0xffff;
                        } else if (m & 16) {
                            E = _ & 0xffff;
                            m &= 15;
                            if (m) {
                                if (v < m) {
                                    d += O[i++] << v;
                                    v += 8;
                                }
                                E += d & (1 << m) - 1;
                                d >>>= m;
                                v -= m;
                            }
                            if (v < 15) {
                                d += O[i++] << v;
                                v += 8;
                                d += O[i++] << v;
                                v += 8;
                            }
                            _ = g[d & w];
                            r: for(;;){
                                m = _ >>> 24;
                                d >>>= m;
                                v -= m;
                                m = _ >>> 16 & 0xff;
                                if (m & 16) {
                                    k = _ & 0xffff;
                                    m &= 15;
                                    if (v < m) {
                                        d += O[i++] << v;
                                        v += 8;
                                        if (v < m) {
                                            d += O[i++] << v;
                                            v += 8;
                                        }
                                    }
                                    k += d & (1 << m) - 1;
                                    if (k > u) {
                                        t.msg = 'invalid distance too far back';
                                        n.mode = BAD$1;
                                        break e;
                                    }
                                    d >>>= m;
                                    v -= m;
                                    m = o - f;
                                    if (k > m) {
                                        m = k - m;
                                        if (m > c) {
                                            if (n.sane) {
                                                t.msg = 'invalid distance too far back';
                                                n.mode = BAD$1;
                                                break e;
                                            }
                                        }
                                        A = 0;
                                        S = p;
                                        if (h === 0) {
                                            A += l - m;
                                            if (m < E) {
                                                E -= m;
                                                do {
                                                    x[o++] = p[A++];
                                                }while (--m)
                                                A = o - k;
                                                S = x;
                                            }
                                        } else if (h < m) {
                                            A += l + h - m;
                                            m -= h;
                                            if (m < E) {
                                                E -= m;
                                                do {
                                                    x[o++] = p[A++];
                                                }while (--m)
                                                A = 0;
                                                if (h < E) {
                                                    m = h;
                                                    E -= m;
                                                    do {
                                                        x[o++] = p[A++];
                                                    }while (--m)
                                                    A = o - k;
                                                    S = x;
                                                }
                                            }
                                        } else {
                                            A += h - m;
                                            if (m < E) {
                                                E -= m;
                                                do {
                                                    x[o++] = p[A++];
                                                }while (--m)
                                                A = o - k;
                                                S = x;
                                            }
                                        }
                                        while(E > 2){
                                            x[o++] = S[A++];
                                            x[o++] = S[A++];
                                            x[o++] = S[A++];
                                            E -= 3;
                                        }
                                        if (E) {
                                            x[o++] = S[A++];
                                            if (E > 1) {
                                                x[o++] = S[A++];
                                            }
                                        }
                                    } else {
                                        A = o - k;
                                        do {
                                            x[o++] = x[A++];
                                            x[o++] = x[A++];
                                            x[o++] = x[A++];
                                            E -= 3;
                                        }while (E > 2)
                                        if (E) {
                                            x[o++] = x[A++];
                                            if (E > 1) {
                                                x[o++] = x[A++];
                                            }
                                        }
                                    }
                                } else if ((m & 64) === 0) {
                                    _ = g[(_ & 0xffff) + (d & (1 << m) - 1)];
                                    continue r;
                                } else {
                                    t.msg = 'invalid distance code';
                                    n.mode = BAD$1;
                                    break e;
                                }
                                break;
                            }
                        } else if ((m & 64) === 0) {
                            _ = y[(_ & 0xffff) + (d & (1 << m) - 1)];
                            continue t;
                        } else if (m & 32) {
                            n.mode = TYPE$1;
                            break e;
                        } else {
                            t.msg = 'invalid literal/length code';
                            n.mode = BAD$1;
                            break e;
                        }
                        break;
                    }
                }while (i < a && o < s)
                E = v >> 3;
                i -= E;
                v -= E << 3;
                d &= (1 << v) - 1;
                t.next_in = i;
                t.next_out = o;
                t.avail_in = i < a ? 5 + (a - i) : 5 - (i - a);
                t.avail_out = o < s ? 257 + (s - o) : 257 - (o - s);
                n.hold = d;
                n.bits = v;
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
            var inftrees = function e(t, r, n, i, a, o, f, s) {
                var u = s.bits;
                var l = 0;
                var c = 0;
                var h = 0, p = 0;
                var d = 0;
                var v = 0;
                var y = 0;
                var g = 0;
                var b = 0;
                var w = 0;
                var _;
                var m;
                var E;
                var k;
                var A;
                var S = null;
                var O = 0;
                var x;
                var R = new utils$1.Buf16(MAXBITS + 1);
                var T = new utils$1.Buf16(MAXBITS + 1);
                var j = null;
                var I = 0;
                var L, P, U;
                for(l = 0; l <= MAXBITS; l++){
                    R[l] = 0;
                }
                for(c = 0; c < i; c++){
                    R[r[n + c]]++;
                }
                d = u;
                for(p = MAXBITS; p >= 1; p--){
                    if (R[p] !== 0) {
                        break;
                    }
                }
                if (d > p) {
                    d = p;
                }
                if (p === 0) {
                    a[o++] = 1 << 24 | 64 << 16 | 0;
                    a[o++] = 1 << 24 | 64 << 16 | 0;
                    s.bits = 1;
                    return 0;
                }
                for(h = 1; h < p; h++){
                    if (R[h] !== 0) {
                        break;
                    }
                }
                if (d < h) {
                    d = h;
                }
                g = 1;
                for(l = 1; l <= MAXBITS; l++){
                    g <<= 1;
                    g -= R[l];
                    if (g < 0) {
                        return -1;
                    }
                }
                if (g > 0 && (t === CODES$1 || p !== 1)) {
                    return -1;
                }
                T[1] = 0;
                for(l = 1; l < MAXBITS; l++){
                    T[l + 1] = T[l] + R[l];
                }
                for(c = 0; c < i; c++){
                    if (r[n + c] !== 0) {
                        f[T[r[n + c]]++] = c;
                    }
                }
                if (t === CODES$1) {
                    S = j = f;
                    x = 19;
                } else if (t === LENS$1) {
                    S = lbase;
                    O -= 257;
                    j = lext;
                    I -= 257;
                    x = 256;
                } else {
                    S = dbase;
                    j = dext;
                    x = -1;
                }
                w = 0;
                c = 0;
                l = h;
                A = o;
                v = d;
                y = 0;
                E = -1;
                b = 1 << d;
                k = b - 1;
                if (t === LENS$1 && b > ENOUGH_LENS$1 || t === DISTS$1 && b > ENOUGH_DISTS$1) {
                    return 1;
                }
                for(;;){
                    L = l - y;
                    if (f[c] < x) {
                        P = 0;
                        U = f[c];
                    } else if (f[c] > x) {
                        P = j[I + f[c]];
                        U = S[O + f[c]];
                    } else {
                        P = 32 + 64;
                        U = 0;
                    }
                    _ = 1 << l - y;
                    m = 1 << v;
                    h = m;
                    do {
                        m -= _;
                        a[A + (w >> y) + m] = L << 24 | P << 16 | U | 0;
                    }while (m !== 0)
                    _ = 1 << l - 1;
                    while(w & _){
                        _ >>= 1;
                    }
                    if (_ !== 0) {
                        w &= _ - 1;
                        w += _;
                    } else {
                        w = 0;
                    }
                    c++;
                    if (--R[l] === 0) {
                        if (l === p) {
                            break;
                        }
                        l = r[n + f[c]];
                    }
                    if (l > d && (w & k) !== E) {
                        if (y === 0) {
                            y = d;
                        }
                        A += h;
                        v = l - y;
                        g = 1 << v;
                        while(v + y < p){
                            g -= R[v + y];
                            if (g <= 0) {
                                break;
                            }
                            v++;
                            g <<= 1;
                        }
                        b += 1 << v;
                        if (t === LENS$1 && b > ENOUGH_LENS$1 || t === DISTS$1 && b > ENOUGH_DISTS$1) {
                            return 1;
                        }
                        E = w & k;
                        a[E] = d << 24 | v << 16 | A - o | 0;
                    }
                }
                if (w !== 0) {
                    a[A + w] = l - y << 24 | 64 << 16 | 0;
                }
                s.bits = d;
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
            function zswap32(e) {
                return (e >>> 24 & 0xff) + (e >>> 8 & 0xff00) + ((e & 0xff00) << 8) + ((e & 0xff) << 24);
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
            function inflateResetKeep(e) {
                var t;
                if (!e || !e.state) {
                    return Z_STREAM_ERROR;
                }
                t = e.state;
                e.total_in = e.total_out = t.total = 0;
                e.msg = '';
                if (t.wrap) {
                    e.adler = t.wrap & 1;
                }
                t.mode = HEAD;
                t.last = 0;
                t.havedict = 0;
                t.dmax = 32768;
                t.head = null;
                t.hold = 0;
                t.bits = 0;
                t.lencode = t.lendyn = new utils.Buf32(ENOUGH_LENS);
                t.distcode = t.distdyn = new utils.Buf32(ENOUGH_DISTS);
                t.sane = 1;
                t.back = -1;
                return Z_OK;
            }
            function inflateReset(e) {
                var t;
                if (!e || !e.state) {
                    return Z_STREAM_ERROR;
                }
                t = e.state;
                t.wsize = 0;
                t.whave = 0;
                t.wnext = 0;
                return inflateResetKeep(e);
            }
            function inflateReset2(e, t) {
                var r;
                var n;
                if (!e || !e.state) {
                    return Z_STREAM_ERROR;
                }
                n = e.state;
                if (t < 0) {
                    r = 0;
                    t = -t;
                } else {
                    r = (t >> 4) + 1;
                    if (t < 48) {
                        t &= 15;
                    }
                }
                if (t && (t < 8 || t > 15)) {
                    return Z_STREAM_ERROR;
                }
                if (n.window !== null && n.wbits !== t) {
                    n.window = null;
                }
                n.wrap = r;
                n.wbits = t;
                return inflateReset(e);
            }
            function inflateInit2(e, t) {
                var r;
                var n;
                if (!e) {
                    return Z_STREAM_ERROR;
                }
                n = new InflateState();
                e.state = n;
                n.window = null;
                r = inflateReset2(e, t);
                if (r !== Z_OK) {
                    e.state = null;
                }
                return r;
            }
            function inflateInit(e) {
                return inflateInit2(e, DEF_WBITS);
            }
            var virgin = true;
            var lenfix, distfix;
            function fixedtables(e) {
                if (virgin) {
                    var t;
                    lenfix = new utils.Buf32(512);
                    distfix = new utils.Buf32(32);
                    t = 0;
                    while(t < 144){
                        e.lens[t++] = 8;
                    }
                    while(t < 256){
                        e.lens[t++] = 9;
                    }
                    while(t < 280){
                        e.lens[t++] = 7;
                    }
                    while(t < 288){
                        e.lens[t++] = 8;
                    }
                    inflate_table(LENS, e.lens, 0, 288, lenfix, 0, e.work, {
                        bits: 9
                    });
                    t = 0;
                    while(t < 32){
                        e.lens[t++] = 5;
                    }
                    inflate_table(DISTS, e.lens, 0, 32, distfix, 0, e.work, {
                        bits: 5
                    });
                    virgin = false;
                }
                e.lencode = lenfix;
                e.lenbits = 9;
                e.distcode = distfix;
                e.distbits = 5;
            }
            function updatewindow(e, t, r, n) {
                var i;
                var a = e.state;
                if (a.window === null) {
                    a.wsize = 1 << a.wbits;
                    a.wnext = 0;
                    a.whave = 0;
                    a.window = new utils.Buf8(a.wsize);
                }
                if (n >= a.wsize) {
                    utils.arraySet(a.window, t, r - a.wsize, a.wsize, 0);
                    a.wnext = 0;
                    a.whave = a.wsize;
                } else {
                    i = a.wsize - a.wnext;
                    if (i > n) {
                        i = n;
                    }
                    utils.arraySet(a.window, t, r - n, i, a.wnext);
                    n -= i;
                    if (n) {
                        utils.arraySet(a.window, t, r - n, n, 0);
                        a.wnext = n;
                        a.whave = a.wsize;
                    } else {
                        a.wnext += i;
                        if (a.wnext === a.wsize) {
                            a.wnext = 0;
                        }
                        if (a.whave < a.wsize) {
                            a.whave += i;
                        }
                    }
                }
                return 0;
            }
            function inflate(e, t) {
                var r;
                var n, i;
                var a;
                var o;
                var f, s;
                var u;
                var l;
                var c, h;
                var p;
                var d;
                var v;
                var y = 0;
                var g, b, w;
                var _, m, E;
                var k;
                var A;
                var S = new utils.Buf8(4);
                var O;
                var x;
                var R = [
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
                if (!e || !e.state || !e.output || !e.input && e.avail_in !== 0) {
                    return Z_STREAM_ERROR;
                }
                r = e.state;
                if (r.mode === TYPE) {
                    r.mode = TYPEDO;
                }
                o = e.next_out;
                i = e.output;
                s = e.avail_out;
                a = e.next_in;
                n = e.input;
                f = e.avail_in;
                u = r.hold;
                l = r.bits;
                c = f;
                h = s;
                A = Z_OK;
                n: for(;;){
                    switch(r.mode){
                        case HEAD:
                            if (r.wrap === 0) {
                                r.mode = TYPEDO;
                                break;
                            }
                            while(l < 16){
                                if (f === 0) {
                                    break n;
                                }
                                f--;
                                u += n[a++] << l;
                                l += 8;
                            }
                            if (r.wrap & 2 && u === 0x8b1f) {
                                r.check = 0;
                                S[0] = u & 0xff;
                                S[1] = u >>> 8 & 0xff;
                                r.check = crc32(r.check, S, 2, 0);
                                u = 0;
                                l = 0;
                                r.mode = FLAGS;
                                break;
                            }
                            r.flags = 0;
                            if (r.head) {
                                r.head.done = false;
                            }
                            if (!(r.wrap & 1) || (((u & 0xff) << 8) + (u >> 8)) % 31) {
                                e.msg = 'incorrect header check';
                                r.mode = BAD;
                                break;
                            }
                            if ((u & 0x0f) !== Z_DEFLATED) {
                                e.msg = 'unknown compression method';
                                r.mode = BAD;
                                break;
                            }
                            u >>>= 4;
                            l -= 4;
                            k = (u & 0x0f) + 8;
                            if (r.wbits === 0) {
                                r.wbits = k;
                            } else if (k > r.wbits) {
                                e.msg = 'invalid window size';
                                r.mode = BAD;
                                break;
                            }
                            r.dmax = 1 << k;
                            e.adler = r.check = 1;
                            r.mode = u & 0x200 ? DICTID : TYPE;
                            u = 0;
                            l = 0;
                            break;
                        case FLAGS:
                            while(l < 16){
                                if (f === 0) {
                                    break n;
                                }
                                f--;
                                u += n[a++] << l;
                                l += 8;
                            }
                            r.flags = u;
                            if ((r.flags & 0xff) !== Z_DEFLATED) {
                                e.msg = 'unknown compression method';
                                r.mode = BAD;
                                break;
                            }
                            if (r.flags & 0xe000) {
                                e.msg = 'unknown header flags set';
                                r.mode = BAD;
                                break;
                            }
                            if (r.head) {
                                r.head.text = u >> 8 & 1;
                            }
                            if (r.flags & 0x0200) {
                                S[0] = u & 0xff;
                                S[1] = u >>> 8 & 0xff;
                                r.check = crc32(r.check, S, 2, 0);
                            }
                            u = 0;
                            l = 0;
                            r.mode = TIME;
                        case TIME:
                            while(l < 32){
                                if (f === 0) {
                                    break n;
                                }
                                f--;
                                u += n[a++] << l;
                                l += 8;
                            }
                            if (r.head) {
                                r.head.time = u;
                            }
                            if (r.flags & 0x0200) {
                                S[0] = u & 0xff;
                                S[1] = u >>> 8 & 0xff;
                                S[2] = u >>> 16 & 0xff;
                                S[3] = u >>> 24 & 0xff;
                                r.check = crc32(r.check, S, 4, 0);
                            }
                            u = 0;
                            l = 0;
                            r.mode = OS;
                        case OS:
                            while(l < 16){
                                if (f === 0) {
                                    break n;
                                }
                                f--;
                                u += n[a++] << l;
                                l += 8;
                            }
                            if (r.head) {
                                r.head.xflags = u & 0xff;
                                r.head.os = u >> 8;
                            }
                            if (r.flags & 0x0200) {
                                S[0] = u & 0xff;
                                S[1] = u >>> 8 & 0xff;
                                r.check = crc32(r.check, S, 2, 0);
                            }
                            u = 0;
                            l = 0;
                            r.mode = EXLEN;
                        case EXLEN:
                            if (r.flags & 0x0400) {
                                while(l < 16){
                                    if (f === 0) {
                                        break n;
                                    }
                                    f--;
                                    u += n[a++] << l;
                                    l += 8;
                                }
                                r.length = u;
                                if (r.head) {
                                    r.head.extra_len = u;
                                }
                                if (r.flags & 0x0200) {
                                    S[0] = u & 0xff;
                                    S[1] = u >>> 8 & 0xff;
                                    r.check = crc32(r.check, S, 2, 0);
                                }
                                u = 0;
                                l = 0;
                            } else if (r.head) {
                                r.head.extra = null;
                            }
                            r.mode = EXTRA;
                        case EXTRA:
                            if (r.flags & 0x0400) {
                                p = r.length;
                                if (p > f) {
                                    p = f;
                                }
                                if (p) {
                                    if (r.head) {
                                        k = r.head.extra_len - r.length;
                                        if (!r.head.extra) {
                                            r.head.extra = new Array(r.head.extra_len);
                                        }
                                        utils.arraySet(r.head.extra, n, a, p, k);
                                    }
                                    if (r.flags & 0x0200) {
                                        r.check = crc32(r.check, n, p, a);
                                    }
                                    f -= p;
                                    a += p;
                                    r.length -= p;
                                }
                                if (r.length) {
                                    break n;
                                }
                            }
                            r.length = 0;
                            r.mode = NAME;
                        case NAME:
                            if (r.flags & 0x0800) {
                                if (f === 0) {
                                    break n;
                                }
                                p = 0;
                                do {
                                    k = n[a + p++];
                                    if (r.head && k && r.length < 65536) {
                                        r.head.name += String.fromCharCode(k);
                                    }
                                }while (k && p < f)
                                if (r.flags & 0x0200) {
                                    r.check = crc32(r.check, n, p, a);
                                }
                                f -= p;
                                a += p;
                                if (k) {
                                    break n;
                                }
                            } else if (r.head) {
                                r.head.name = null;
                            }
                            r.length = 0;
                            r.mode = COMMENT;
                        case COMMENT:
                            if (r.flags & 0x1000) {
                                if (f === 0) {
                                    break n;
                                }
                                p = 0;
                                do {
                                    k = n[a + p++];
                                    if (r.head && k && r.length < 65536) {
                                        r.head.comment += String.fromCharCode(k);
                                    }
                                }while (k && p < f)
                                if (r.flags & 0x0200) {
                                    r.check = crc32(r.check, n, p, a);
                                }
                                f -= p;
                                a += p;
                                if (k) {
                                    break n;
                                }
                            } else if (r.head) {
                                r.head.comment = null;
                            }
                            r.mode = HCRC;
                        case HCRC:
                            if (r.flags & 0x0200) {
                                while(l < 16){
                                    if (f === 0) {
                                        break n;
                                    }
                                    f--;
                                    u += n[a++] << l;
                                    l += 8;
                                }
                                if (u !== (r.check & 0xffff)) {
                                    e.msg = 'header crc mismatch';
                                    r.mode = BAD;
                                    break;
                                }
                                u = 0;
                                l = 0;
                            }
                            if (r.head) {
                                r.head.hcrc = r.flags >> 9 & 1;
                                r.head.done = true;
                            }
                            e.adler = r.check = 0;
                            r.mode = TYPE;
                            break;
                        case DICTID:
                            while(l < 32){
                                if (f === 0) {
                                    break n;
                                }
                                f--;
                                u += n[a++] << l;
                                l += 8;
                            }
                            e.adler = r.check = zswap32(u);
                            u = 0;
                            l = 0;
                            r.mode = DICT;
                        case DICT:
                            if (r.havedict === 0) {
                                e.next_out = o;
                                e.avail_out = s;
                                e.next_in = a;
                                e.avail_in = f;
                                r.hold = u;
                                r.bits = l;
                                return Z_NEED_DICT;
                            }
                            e.adler = r.check = 1;
                            r.mode = TYPE;
                        case TYPE:
                            if (t === Z_BLOCK || t === Z_TREES) {
                                break n;
                            }
                        case TYPEDO:
                            if (r.last) {
                                u >>>= l & 7;
                                l -= l & 7;
                                r.mode = CHECK;
                                break;
                            }
                            while(l < 3){
                                if (f === 0) {
                                    break n;
                                }
                                f--;
                                u += n[a++] << l;
                                l += 8;
                            }
                            r.last = u & 0x01;
                            u >>>= 1;
                            l -= 1;
                            switch(u & 0x03){
                                case 0:
                                    r.mode = STORED;
                                    break;
                                case 1:
                                    fixedtables(r);
                                    r.mode = LEN_;
                                    if (t === Z_TREES) {
                                        u >>>= 2;
                                        l -= 2;
                                        break n;
                                    }
                                    break;
                                case 2:
                                    r.mode = TABLE;
                                    break;
                                case 3:
                                    e.msg = 'invalid block type';
                                    r.mode = BAD;
                            }
                            u >>>= 2;
                            l -= 2;
                            break;
                        case STORED:
                            u >>>= l & 7;
                            l -= l & 7;
                            while(l < 32){
                                if (f === 0) {
                                    break n;
                                }
                                f--;
                                u += n[a++] << l;
                                l += 8;
                            }
                            if ((u & 0xffff) !== (u >>> 16 ^ 0xffff)) {
                                e.msg = 'invalid stored block lengths';
                                r.mode = BAD;
                                break;
                            }
                            r.length = u & 0xffff;
                            u = 0;
                            l = 0;
                            r.mode = COPY_;
                            if (t === Z_TREES) {
                                break n;
                            }
                        case COPY_:
                            r.mode = COPY;
                        case COPY:
                            p = r.length;
                            if (p) {
                                if (p > f) {
                                    p = f;
                                }
                                if (p > s) {
                                    p = s;
                                }
                                if (p === 0) {
                                    break n;
                                }
                                utils.arraySet(i, n, a, p, o);
                                f -= p;
                                a += p;
                                s -= p;
                                o += p;
                                r.length -= p;
                                break;
                            }
                            r.mode = TYPE;
                            break;
                        case TABLE:
                            while(l < 14){
                                if (f === 0) {
                                    break n;
                                }
                                f--;
                                u += n[a++] << l;
                                l += 8;
                            }
                            r.nlen = (u & 0x1f) + 257;
                            u >>>= 5;
                            l -= 5;
                            r.ndist = (u & 0x1f) + 1;
                            u >>>= 5;
                            l -= 5;
                            r.ncode = (u & 0x0f) + 4;
                            u >>>= 4;
                            l -= 4;
                            if (r.nlen > 286 || r.ndist > 30) {
                                e.msg = 'too many length or distance symbols';
                                r.mode = BAD;
                                break;
                            }
                            r.have = 0;
                            r.mode = LENLENS;
                        case LENLENS:
                            while(r.have < r.ncode){
                                while(l < 3){
                                    if (f === 0) {
                                        break n;
                                    }
                                    f--;
                                    u += n[a++] << l;
                                    l += 8;
                                }
                                r.lens[R[r.have++]] = u & 0x07;
                                u >>>= 3;
                                l -= 3;
                            }
                            while(r.have < 19){
                                r.lens[R[r.have++]] = 0;
                            }
                            r.lencode = r.lendyn;
                            r.lenbits = 7;
                            O = {
                                bits: r.lenbits
                            };
                            A = inflate_table(CODES, r.lens, 0, 19, r.lencode, 0, r.work, O);
                            r.lenbits = O.bits;
                            if (A) {
                                e.msg = 'invalid code lengths set';
                                r.mode = BAD;
                                break;
                            }
                            r.have = 0;
                            r.mode = CODELENS;
                        case CODELENS:
                            while(r.have < r.nlen + r.ndist){
                                for(;;){
                                    y = r.lencode[u & (1 << r.lenbits) - 1];
                                    g = y >>> 24;
                                    b = y >>> 16 & 0xff;
                                    w = y & 0xffff;
                                    if (g <= l) {
                                        break;
                                    }
                                    if (f === 0) {
                                        break n;
                                    }
                                    f--;
                                    u += n[a++] << l;
                                    l += 8;
                                }
                                if (w < 16) {
                                    u >>>= g;
                                    l -= g;
                                    r.lens[r.have++] = w;
                                } else {
                                    if (w === 16) {
                                        x = g + 2;
                                        while(l < x){
                                            if (f === 0) {
                                                break n;
                                            }
                                            f--;
                                            u += n[a++] << l;
                                            l += 8;
                                        }
                                        u >>>= g;
                                        l -= g;
                                        if (r.have === 0) {
                                            e.msg = 'invalid bit length repeat';
                                            r.mode = BAD;
                                            break;
                                        }
                                        k = r.lens[r.have - 1];
                                        p = 3 + (u & 0x03);
                                        u >>>= 2;
                                        l -= 2;
                                    } else if (w === 17) {
                                        x = g + 3;
                                        while(l < x){
                                            if (f === 0) {
                                                break n;
                                            }
                                            f--;
                                            u += n[a++] << l;
                                            l += 8;
                                        }
                                        u >>>= g;
                                        l -= g;
                                        k = 0;
                                        p = 3 + (u & 0x07);
                                        u >>>= 3;
                                        l -= 3;
                                    } else {
                                        x = g + 7;
                                        while(l < x){
                                            if (f === 0) {
                                                break n;
                                            }
                                            f--;
                                            u += n[a++] << l;
                                            l += 8;
                                        }
                                        u >>>= g;
                                        l -= g;
                                        k = 0;
                                        p = 11 + (u & 0x7f);
                                        u >>>= 7;
                                        l -= 7;
                                    }
                                    if (r.have + p > r.nlen + r.ndist) {
                                        e.msg = 'invalid bit length repeat';
                                        r.mode = BAD;
                                        break;
                                    }
                                    while(p--){
                                        r.lens[r.have++] = k;
                                    }
                                }
                            }
                            if (r.mode === BAD) {
                                break;
                            }
                            if (r.lens[256] === 0) {
                                e.msg = 'invalid code -- missing end-of-block';
                                r.mode = BAD;
                                break;
                            }
                            r.lenbits = 9;
                            O = {
                                bits: r.lenbits
                            };
                            A = inflate_table(LENS, r.lens, 0, r.nlen, r.lencode, 0, r.work, O);
                            r.lenbits = O.bits;
                            if (A) {
                                e.msg = 'invalid literal/lengths set';
                                r.mode = BAD;
                                break;
                            }
                            r.distbits = 6;
                            r.distcode = r.distdyn;
                            O = {
                                bits: r.distbits
                            };
                            A = inflate_table(DISTS, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, O);
                            r.distbits = O.bits;
                            if (A) {
                                e.msg = 'invalid distances set';
                                r.mode = BAD;
                                break;
                            }
                            r.mode = LEN_;
                            if (t === Z_TREES) {
                                break n;
                            }
                        case LEN_:
                            r.mode = LEN;
                        case LEN:
                            if (f >= 6 && s >= 258) {
                                e.next_out = o;
                                e.avail_out = s;
                                e.next_in = a;
                                e.avail_in = f;
                                r.hold = u;
                                r.bits = l;
                                inflate_fast(e, h);
                                o = e.next_out;
                                i = e.output;
                                s = e.avail_out;
                                a = e.next_in;
                                n = e.input;
                                f = e.avail_in;
                                u = r.hold;
                                l = r.bits;
                                if (r.mode === TYPE) {
                                    r.back = -1;
                                }
                                break;
                            }
                            r.back = 0;
                            for(;;){
                                y = r.lencode[u & (1 << r.lenbits) - 1];
                                g = y >>> 24;
                                b = y >>> 16 & 0xff;
                                w = y & 0xffff;
                                if (g <= l) {
                                    break;
                                }
                                if (f === 0) {
                                    break n;
                                }
                                f--;
                                u += n[a++] << l;
                                l += 8;
                            }
                            if (b && (b & 0xf0) === 0) {
                                _ = g;
                                m = b;
                                E = w;
                                for(;;){
                                    y = r.lencode[E + ((u & (1 << _ + m) - 1) >> _)];
                                    g = y >>> 24;
                                    b = y >>> 16 & 0xff;
                                    w = y & 0xffff;
                                    if (_ + g <= l) {
                                        break;
                                    }
                                    if (f === 0) {
                                        break n;
                                    }
                                    f--;
                                    u += n[a++] << l;
                                    l += 8;
                                }
                                u >>>= _;
                                l -= _;
                                r.back += _;
                            }
                            u >>>= g;
                            l -= g;
                            r.back += g;
                            r.length = w;
                            if (b === 0) {
                                r.mode = LIT;
                                break;
                            }
                            if (b & 32) {
                                r.back = -1;
                                r.mode = TYPE;
                                break;
                            }
                            if (b & 64) {
                                e.msg = 'invalid literal/length code';
                                r.mode = BAD;
                                break;
                            }
                            r.extra = b & 15;
                            r.mode = LENEXT;
                        case LENEXT:
                            if (r.extra) {
                                x = r.extra;
                                while(l < x){
                                    if (f === 0) {
                                        break n;
                                    }
                                    f--;
                                    u += n[a++] << l;
                                    l += 8;
                                }
                                r.length += u & (1 << r.extra) - 1;
                                u >>>= r.extra;
                                l -= r.extra;
                                r.back += r.extra;
                            }
                            r.was = r.length;
                            r.mode = DIST;
                        case DIST:
                            for(;;){
                                y = r.distcode[u & (1 << r.distbits) - 1];
                                g = y >>> 24;
                                b = y >>> 16 & 0xff;
                                w = y & 0xffff;
                                if (g <= l) {
                                    break;
                                }
                                if (f === 0) {
                                    break n;
                                }
                                f--;
                                u += n[a++] << l;
                                l += 8;
                            }
                            if ((b & 0xf0) === 0) {
                                _ = g;
                                m = b;
                                E = w;
                                for(;;){
                                    y = r.distcode[E + ((u & (1 << _ + m) - 1) >> _)];
                                    g = y >>> 24;
                                    b = y >>> 16 & 0xff;
                                    w = y & 0xffff;
                                    if (_ + g <= l) {
                                        break;
                                    }
                                    if (f === 0) {
                                        break n;
                                    }
                                    f--;
                                    u += n[a++] << l;
                                    l += 8;
                                }
                                u >>>= _;
                                l -= _;
                                r.back += _;
                            }
                            u >>>= g;
                            l -= g;
                            r.back += g;
                            if (b & 64) {
                                e.msg = 'invalid distance code';
                                r.mode = BAD;
                                break;
                            }
                            r.offset = w;
                            r.extra = b & 15;
                            r.mode = DISTEXT;
                        case DISTEXT:
                            if (r.extra) {
                                x = r.extra;
                                while(l < x){
                                    if (f === 0) {
                                        break n;
                                    }
                                    f--;
                                    u += n[a++] << l;
                                    l += 8;
                                }
                                r.offset += u & (1 << r.extra) - 1;
                                u >>>= r.extra;
                                l -= r.extra;
                                r.back += r.extra;
                            }
                            if (r.offset > r.dmax) {
                                e.msg = 'invalid distance too far back';
                                r.mode = BAD;
                                break;
                            }
                            r.mode = MATCH;
                        case MATCH:
                            if (s === 0) {
                                break n;
                            }
                            p = h - s;
                            if (r.offset > p) {
                                p = r.offset - p;
                                if (p > r.whave) {
                                    if (r.sane) {
                                        e.msg = 'invalid distance too far back';
                                        r.mode = BAD;
                                        break;
                                    }
                                }
                                if (p > r.wnext) {
                                    p -= r.wnext;
                                    d = r.wsize - p;
                                } else {
                                    d = r.wnext - p;
                                }
                                if (p > r.length) {
                                    p = r.length;
                                }
                                v = r.window;
                            } else {
                                v = i;
                                d = o - r.offset;
                                p = r.length;
                            }
                            if (p > s) {
                                p = s;
                            }
                            s -= p;
                            r.length -= p;
                            do {
                                i[o++] = v[d++];
                            }while (--p)
                            if (r.length === 0) {
                                r.mode = LEN;
                            }
                            break;
                        case LIT:
                            if (s === 0) {
                                break n;
                            }
                            i[o++] = r.length;
                            s--;
                            r.mode = LEN;
                            break;
                        case CHECK:
                            if (r.wrap) {
                                while(l < 32){
                                    if (f === 0) {
                                        break n;
                                    }
                                    f--;
                                    u |= n[a++] << l;
                                    l += 8;
                                }
                                h -= s;
                                e.total_out += h;
                                r.total += h;
                                if (h) {
                                    e.adler = r.check = r.flags ? crc32(r.check, i, h, o - h) : adler32(r.check, i, h, o - h);
                                }
                                h = s;
                                if ((r.flags ? u : zswap32(u)) !== r.check) {
                                    e.msg = 'incorrect data check';
                                    r.mode = BAD;
                                    break;
                                }
                                u = 0;
                                l = 0;
                            }
                            r.mode = LENGTH;
                        case LENGTH:
                            if (r.wrap && r.flags) {
                                while(l < 32){
                                    if (f === 0) {
                                        break n;
                                    }
                                    f--;
                                    u += n[a++] << l;
                                    l += 8;
                                }
                                if (u !== (r.total & 0xffffffff)) {
                                    e.msg = 'incorrect length check';
                                    r.mode = BAD;
                                    break;
                                }
                                u = 0;
                                l = 0;
                            }
                            r.mode = DONE;
                        case DONE:
                            A = Z_STREAM_END;
                            break n;
                        case BAD:
                            A = Z_DATA_ERROR;
                            break n;
                        case MEM:
                            return Z_MEM_ERROR;
                        case SYNC:
                        default:
                            return Z_STREAM_ERROR;
                    }
                }
                e.next_out = o;
                e.avail_out = s;
                e.next_in = a;
                e.avail_in = f;
                r.hold = u;
                r.bits = l;
                if (r.wsize || h !== e.avail_out && r.mode < BAD && (r.mode < CHECK || t !== Z_FINISH)) {
                    if (updatewindow(e, e.output, e.next_out, h - e.avail_out)) ;
                }
                c -= e.avail_in;
                h -= e.avail_out;
                e.total_in += c;
                e.total_out += h;
                r.total += h;
                if (r.wrap && h) {
                    e.adler = r.check = r.flags ? crc32(r.check, i, h, e.next_out - h) : adler32(r.check, i, h, e.next_out - h);
                }
                e.data_type = r.bits + (r.last ? 64 : 0) + (r.mode === TYPE ? 128 : 0) + (r.mode === LEN_ || r.mode === COPY_ ? 256 : 0);
                if ((c === 0 && h === 0 || t === Z_FINISH) && A === Z_OK) {
                    A = Z_BUF_ERROR;
                }
                return A;
            }
            function inflateEnd(e) {
                if (!e || !e.state) {
                    return Z_STREAM_ERROR;
                }
                var t = e.state;
                if (t.window) {
                    t.window = null;
                }
                e.state = null;
                return Z_OK;
            }
            function inflateGetHeader(e, t) {
                var r;
                if (!e || !e.state) {
                    return Z_STREAM_ERROR;
                }
                r = e.state;
                if ((r.wrap & 2) === 0) {
                    return Z_STREAM_ERROR;
                }
                r.head = t;
                t.done = false;
                return Z_OK;
            }
            function inflateSetDictionary(e, t) {
                var r = t.length;
                var n;
                var i;
                var a;
                if (!e || !e.state) {
                    return Z_STREAM_ERROR;
                }
                n = e.state;
                if (n.wrap !== 0 && n.mode !== DICT) {
                    return Z_STREAM_ERROR;
                }
                if (n.mode === DICT) {
                    i = 1;
                    i = adler32(i, t, r, 0);
                    if (i !== n.check) {
                        return Z_DATA_ERROR;
                    }
                }
                a = updatewindow(e, t, r, r);
                if (a) {
                    n.mode = MEM;
                    return Z_MEM_ERROR;
                }
                n.havedict = 1;
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
            (function(e) {
                var t = assert$2.exports;
                var r = zstream;
                var n = deflate$1;
                var i = inflate$1;
                var a = constants;
                for(var o in a){
                    e[o] = a[o];
                }
                e.NONE = 0;
                e.DEFLATE = 1;
                e.INFLATE = 2;
                e.GZIP = 3;
                e.GUNZIP = 4;
                e.DEFLATERAW = 5;
                e.INFLATERAW = 6;
                e.UNZIP = 7;
                var f = 0x1f;
                var s = 0x8b;
                function u(t) {
                    if (typeof t !== 'number' || t < e.DEFLATE || t > e.UNZIP) {
                        throw new TypeError('Bad argument');
                    }
                    this.dictionary = null;
                    this.err = 0;
                    this.flush = 0;
                    this.init_done = false;
                    this.level = 0;
                    this.memLevel = 0;
                    this.mode = t;
                    this.strategy = 0;
                    this.windowBits = 0;
                    this.write_in_progress = false;
                    this.pending_close = false;
                    this.gzip_id_bytes_read = 0;
                }
                u.prototype.close = function() {
                    if (this.write_in_progress) {
                        this.pending_close = true;
                        return;
                    }
                    this.pending_close = false;
                    t(this.init_done, 'close before init');
                    t(this.mode <= e.UNZIP);
                    if (this.mode === e.DEFLATE || this.mode === e.GZIP || this.mode === e.DEFLATERAW) {
                        n.deflateEnd(this.strm);
                    } else if (this.mode === e.INFLATE || this.mode === e.GUNZIP || this.mode === e.INFLATERAW || this.mode === e.UNZIP) {
                        i.inflateEnd(this.strm);
                    }
                    this.mode = e.NONE;
                    this.dictionary = null;
                };
                u.prototype.write = function(e, t, r, n, i, a, o) {
                    return this._write(true, e, t, r, n, i, a, o);
                };
                u.prototype.writeSync = function(e, t, r, n, i, a, o) {
                    return this._write(false, e, t, r, n, i, a, o);
                };
                u.prototype._write = function(r, n, i, a, o, f, s, u) {
                    t.equal(arguments.length, 8);
                    t(this.init_done, 'write before init');
                    t(this.mode !== e.NONE, 'already finalized');
                    t.equal(false, this.write_in_progress, 'write already in progress');
                    t.equal(false, this.pending_close, 'close is pending');
                    this.write_in_progress = true;
                    t.equal(false, n === undefined, 'must provide flush value');
                    this.write_in_progress = true;
                    if (n !== e.Z_NO_FLUSH && n !== e.Z_PARTIAL_FLUSH && n !== e.Z_SYNC_FLUSH && n !== e.Z_FULL_FLUSH && n !== e.Z_FINISH && n !== e.Z_BLOCK) {
                        throw new Error('Invalid flush value');
                    }
                    if (i == null) {
                        i = Buffer$1.alloc(0);
                        o = 0;
                        a = 0;
                    }
                    this.strm.avail_in = o;
                    this.strm.input = i;
                    this.strm.next_in = a;
                    this.strm.avail_out = u;
                    this.strm.output = f;
                    this.strm.next_out = s;
                    this.flush = n;
                    if (!r) {
                        this._process();
                        if (this._checkError()) {
                            return this._afterSync();
                        }
                        return;
                    }
                    var l = this;
                    browser$1$1.nextTick(function() {
                        l._process();
                        l._after();
                    });
                    return this;
                };
                u.prototype._afterSync = function() {
                    var e = this.strm.avail_out;
                    var t = this.strm.avail_in;
                    this.write_in_progress = false;
                    return [
                        t,
                        e
                    ];
                };
                u.prototype._process = function() {
                    var t = null;
                    switch(this.mode){
                        case e.DEFLATE:
                        case e.GZIP:
                        case e.DEFLATERAW:
                            this.err = n.deflate(this.strm, this.flush);
                            break;
                        case e.UNZIP:
                            if (this.strm.avail_in > 0) {
                                t = this.strm.next_in;
                            }
                            switch(this.gzip_id_bytes_read){
                                case 0:
                                    if (t === null) {
                                        break;
                                    }
                                    if (this.strm.input[t] === f) {
                                        this.gzip_id_bytes_read = 1;
                                        t++;
                                        if (this.strm.avail_in === 1) {
                                            break;
                                        }
                                    } else {
                                        this.mode = e.INFLATE;
                                        break;
                                    }
                                case 1:
                                    if (t === null) {
                                        break;
                                    }
                                    if (this.strm.input[t] === s) {
                                        this.gzip_id_bytes_read = 2;
                                        this.mode = e.GUNZIP;
                                    } else {
                                        this.mode = e.INFLATE;
                                    }
                                    break;
                                default:
                                    throw new Error('invalid number of gzip magic number bytes read');
                            }
                        case e.INFLATE:
                        case e.GUNZIP:
                        case e.INFLATERAW:
                            this.err = i.inflate(this.strm, this.flush);
                            if (this.err === e.Z_NEED_DICT && this.dictionary) {
                                this.err = i.inflateSetDictionary(this.strm, this.dictionary);
                                if (this.err === e.Z_OK) {
                                    this.err = i.inflate(this.strm, this.flush);
                                } else if (this.err === e.Z_DATA_ERROR) {
                                    this.err = e.Z_NEED_DICT;
                                }
                            }
                            while(this.strm.avail_in > 0 && this.mode === e.GUNZIP && this.err === e.Z_STREAM_END && this.strm.next_in[0] !== 0x00){
                                this.reset();
                                this.err = i.inflate(this.strm, this.flush);
                            }
                            break;
                        default:
                            throw new Error('Unknown mode ' + this.mode);
                    }
                };
                u.prototype._checkError = function() {
                    switch(this.err){
                        case e.Z_OK:
                        case e.Z_BUF_ERROR:
                            if (this.strm.avail_out !== 0 && this.flush === e.Z_FINISH) {
                                this._error('unexpected end of file');
                                return false;
                            }
                            break;
                        case e.Z_STREAM_END:
                            break;
                        case e.Z_NEED_DICT:
                            if (this.dictionary == null) {
                                this._error('Missing dictionary');
                            } else {
                                this._error('Bad dictionary');
                            }
                            return false;
                        default:
                            this._error('Zlib error');
                            return false;
                    }
                    return true;
                };
                u.prototype._after = function() {
                    if (!this._checkError()) {
                        return;
                    }
                    var e = this.strm.avail_out;
                    var t = this.strm.avail_in;
                    this.write_in_progress = false;
                    this.callback(t, e);
                    if (this.pending_close) {
                        this.close();
                    }
                };
                u.prototype._error = function(e) {
                    if (this.strm.msg) {
                        e = this.strm.msg;
                    }
                    this.onerror(e, this.err);
                    this.write_in_progress = false;
                    if (this.pending_close) {
                        this.close();
                    }
                };
                u.prototype.init = function(r, n, i, a, o) {
                    t(arguments.length === 4 || arguments.length === 5, 'init(windowBits, level, memLevel, strategy, [dictionary])');
                    t(r >= 8 && r <= 15, 'invalid windowBits');
                    t(n >= -1 && n <= 9, 'invalid compression level');
                    t(i >= 1 && i <= 9, 'invalid memlevel');
                    t(a === e.Z_FILTERED || a === e.Z_HUFFMAN_ONLY || a === e.Z_RLE || a === e.Z_FIXED || a === e.Z_DEFAULT_STRATEGY, 'invalid strategy');
                    this._init(n, r, i, a, o);
                    this._setDictionary();
                };
                u.prototype.params = function() {
                    throw new Error('deflateParams Not supported');
                };
                u.prototype.reset = function() {
                    this._reset();
                    this._setDictionary();
                };
                u.prototype._init = function(t, a, o, f, s) {
                    this.level = t;
                    this.windowBits = a;
                    this.memLevel = o;
                    this.strategy = f;
                    this.flush = e.Z_NO_FLUSH;
                    this.err = e.Z_OK;
                    if (this.mode === e.GZIP || this.mode === e.GUNZIP) {
                        this.windowBits += 16;
                    }
                    if (this.mode === e.UNZIP) {
                        this.windowBits += 32;
                    }
                    if (this.mode === e.DEFLATERAW || this.mode === e.INFLATERAW) {
                        this.windowBits = -1 * this.windowBits;
                    }
                    this.strm = new r();
                    switch(this.mode){
                        case e.DEFLATE:
                        case e.GZIP:
                        case e.DEFLATERAW:
                            this.err = n.deflateInit2(this.strm, this.level, e.Z_DEFLATED, this.windowBits, this.memLevel, this.strategy);
                            break;
                        case e.INFLATE:
                        case e.GUNZIP:
                        case e.INFLATERAW:
                        case e.UNZIP:
                            this.err = i.inflateInit2(this.strm, this.windowBits);
                            break;
                        default:
                            throw new Error('Unknown mode ' + this.mode);
                    }
                    if (this.err !== e.Z_OK) {
                        this._error('Init error');
                    }
                    this.dictionary = s;
                    this.write_in_progress = false;
                    this.init_done = true;
                };
                u.prototype._setDictionary = function() {
                    if (this.dictionary == null) {
                        return;
                    }
                    this.err = e.Z_OK;
                    switch(this.mode){
                        case e.DEFLATE:
                        case e.DEFLATERAW:
                            this.err = n.deflateSetDictionary(this.strm, this.dictionary);
                            break;
                    }
                    if (this.err !== e.Z_OK) {
                        this._error('Failed to set dictionary');
                    }
                };
                u.prototype._reset = function() {
                    this.err = e.Z_OK;
                    switch(this.mode){
                        case e.DEFLATE:
                        case e.DEFLATERAW:
                        case e.GZIP:
                            this.err = n.deflateReset(this.strm);
                            break;
                        case e.INFLATE:
                        case e.INFLATERAW:
                        case e.GUNZIP:
                            this.err = i.inflateReset(this.strm);
                            break;
                    }
                    if (this.err !== e.Z_OK) {
                        this._error('Failed to reset stream');
                    }
                };
                e.Zlib = u;
            })(binding);
            (function(e) {
                var t = buffer.Buffer;
                var r = require$$1.Transform;
                var n = binding;
                var i = util$1;
                var a = assert$2.exports.ok;
                var o = buffer.kMaxLength;
                var f = 'Cannot create final Buffer. It would be larger ' + 'than 0x' + o.toString(16) + ' bytes';
                n.Z_MIN_WINDOWBITS = 8;
                n.Z_MAX_WINDOWBITS = 15;
                n.Z_DEFAULT_WINDOWBITS = 15;
                n.Z_MIN_CHUNK = 64;
                n.Z_MAX_CHUNK = Infinity;
                n.Z_DEFAULT_CHUNK = 16 * 1024;
                n.Z_MIN_MEMLEVEL = 1;
                n.Z_MAX_MEMLEVEL = 9;
                n.Z_DEFAULT_MEMLEVEL = 8;
                n.Z_MIN_LEVEL = -1;
                n.Z_MAX_LEVEL = 9;
                n.Z_DEFAULT_LEVEL = n.Z_DEFAULT_COMPRESSION;
                var s = Object.keys(n);
                for(var u = 0; u < s.length; u++){
                    var l = s[u];
                    if (l.match(/^Z/)) {
                        Object.defineProperty(e, l, {
                            enumerable: true,
                            value: n[l],
                            writable: false
                        });
                    }
                }
                var c = {
                    Z_OK: n.Z_OK,
                    Z_STREAM_END: n.Z_STREAM_END,
                    Z_NEED_DICT: n.Z_NEED_DICT,
                    Z_ERRNO: n.Z_ERRNO,
                    Z_STREAM_ERROR: n.Z_STREAM_ERROR,
                    Z_DATA_ERROR: n.Z_DATA_ERROR,
                    Z_MEM_ERROR: n.Z_MEM_ERROR,
                    Z_BUF_ERROR: n.Z_BUF_ERROR,
                    Z_VERSION_ERROR: n.Z_VERSION_ERROR
                };
                var h = Object.keys(c);
                for(var p = 0; p < h.length; p++){
                    var d = h[p];
                    c[c[d]] = d;
                }
                Object.defineProperty(e, 'codes', {
                    enumerable: true,
                    value: Object.freeze(c),
                    writable: false
                });
                e.Deflate = g;
                e.Inflate = b;
                e.Gzip = w;
                e.Gunzip = _;
                e.DeflateRaw = m;
                e.InflateRaw = E;
                e.Unzip = k;
                e.createDeflate = function(e) {
                    return new g(e);
                };
                e.createInflate = function(e) {
                    return new b(e);
                };
                e.createDeflateRaw = function(e) {
                    return new m(e);
                };
                e.createInflateRaw = function(e) {
                    return new E(e);
                };
                e.createGzip = function(e) {
                    return new w(e);
                };
                e.createGunzip = function(e) {
                    return new _(e);
                };
                e.createUnzip = function(e) {
                    return new k(e);
                };
                e.deflate = function(e, t, r) {
                    if (typeof t === 'function') {
                        r = t;
                        t = {};
                    }
                    return v(new g(t), e, r);
                };
                e.deflateSync = function(e, t) {
                    return y(new g(t), e);
                };
                e.gzip = function(e, t, r) {
                    if (typeof t === 'function') {
                        r = t;
                        t = {};
                    }
                    return v(new w(t), e, r);
                };
                e.gzipSync = function(e, t) {
                    return y(new w(t), e);
                };
                e.deflateRaw = function(e, t, r) {
                    if (typeof t === 'function') {
                        r = t;
                        t = {};
                    }
                    return v(new m(t), e, r);
                };
                e.deflateRawSync = function(e, t) {
                    return y(new m(t), e);
                };
                e.unzip = function(e, t, r) {
                    if (typeof t === 'function') {
                        r = t;
                        t = {};
                    }
                    return v(new k(t), e, r);
                };
                e.unzipSync = function(e, t) {
                    return y(new k(t), e);
                };
                e.inflate = function(e, t, r) {
                    if (typeof t === 'function') {
                        r = t;
                        t = {};
                    }
                    return v(new b(t), e, r);
                };
                e.inflateSync = function(e, t) {
                    return y(new b(t), e);
                };
                e.gunzip = function(e, t, r) {
                    if (typeof t === 'function') {
                        r = t;
                        t = {};
                    }
                    return v(new _(t), e, r);
                };
                e.gunzipSync = function(e, t) {
                    return y(new _(t), e);
                };
                e.inflateRaw = function(e, t, r) {
                    if (typeof t === 'function') {
                        r = t;
                        t = {};
                    }
                    return v(new E(t), e, r);
                };
                e.inflateRawSync = function(e, t) {
                    return y(new E(t), e);
                };
                function v(e, r, n) {
                    var i = [];
                    var a = 0;
                    e.on('error', u);
                    e.on('end', l);
                    e.end(r);
                    s();
                    function s() {
                        var t;
                        while(null !== (t = e.read())){
                            i.push(t);
                            a += t.length;
                        }
                        e.once('readable', s);
                    }
                    function u(t) {
                        e.removeListener('end', l);
                        e.removeListener('readable', s);
                        n(t);
                    }
                    function l() {
                        var r;
                        var s = null;
                        if (a >= o) {
                            s = new RangeError(f);
                        } else {
                            r = t.concat(i, a);
                        }
                        i = [];
                        e.close();
                        n(s, r);
                    }
                }
                function y(e, r) {
                    if (typeof r === 'string') r = t.from(r);
                    if (!t.isBuffer(r)) throw new TypeError('Not a string or buffer');
                    var n = e._finishFlushFlag;
                    return e._processChunk(r, n);
                }
                function g(e) {
                    if (!(this instanceof g)) return new g(e);
                    S.call(this, e, n.DEFLATE);
                }
                function b(e) {
                    if (!(this instanceof b)) return new b(e);
                    S.call(this, e, n.INFLATE);
                }
                function w(e) {
                    if (!(this instanceof w)) return new w(e);
                    S.call(this, e, n.GZIP);
                }
                function _(e) {
                    if (!(this instanceof _)) return new _(e);
                    S.call(this, e, n.GUNZIP);
                }
                function m(e) {
                    if (!(this instanceof m)) return new m(e);
                    S.call(this, e, n.DEFLATERAW);
                }
                function E(e) {
                    if (!(this instanceof E)) return new E(e);
                    S.call(this, e, n.INFLATERAW);
                }
                function k(e) {
                    if (!(this instanceof k)) return new k(e);
                    S.call(this, e, n.UNZIP);
                }
                function A(e) {
                    return e === n.Z_NO_FLUSH || e === n.Z_PARTIAL_FLUSH || e === n.Z_SYNC_FLUSH || e === n.Z_FULL_FLUSH || e === n.Z_FINISH || e === n.Z_BLOCK;
                }
                function S(i, a) {
                    var o = this;
                    this._opts = i = i || {};
                    this._chunkSize = i.chunkSize || e.Z_DEFAULT_CHUNK;
                    r.call(this, i);
                    if (i.flush && !A(i.flush)) {
                        throw new Error('Invalid flush flag: ' + i.flush);
                    }
                    if (i.finishFlush && !A(i.finishFlush)) {
                        throw new Error('Invalid flush flag: ' + i.finishFlush);
                    }
                    this._flushFlag = i.flush || n.Z_NO_FLUSH;
                    this._finishFlushFlag = typeof i.finishFlush !== 'undefined' ? i.finishFlush : n.Z_FINISH;
                    if (i.chunkSize) {
                        if (i.chunkSize < e.Z_MIN_CHUNK || i.chunkSize > e.Z_MAX_CHUNK) {
                            throw new Error('Invalid chunk size: ' + i.chunkSize);
                        }
                    }
                    if (i.windowBits) {
                        if (i.windowBits < e.Z_MIN_WINDOWBITS || i.windowBits > e.Z_MAX_WINDOWBITS) {
                            throw new Error('Invalid windowBits: ' + i.windowBits);
                        }
                    }
                    if (i.level) {
                        if (i.level < e.Z_MIN_LEVEL || i.level > e.Z_MAX_LEVEL) {
                            throw new Error('Invalid compression level: ' + i.level);
                        }
                    }
                    if (i.memLevel) {
                        if (i.memLevel < e.Z_MIN_MEMLEVEL || i.memLevel > e.Z_MAX_MEMLEVEL) {
                            throw new Error('Invalid memLevel: ' + i.memLevel);
                        }
                    }
                    if (i.strategy) {
                        if (i.strategy != e.Z_FILTERED && i.strategy != e.Z_HUFFMAN_ONLY && i.strategy != e.Z_RLE && i.strategy != e.Z_FIXED && i.strategy != e.Z_DEFAULT_STRATEGY) {
                            throw new Error('Invalid strategy: ' + i.strategy);
                        }
                    }
                    if (i.dictionary) {
                        if (!t.isBuffer(i.dictionary)) {
                            throw new Error('Invalid dictionary: it should be a Buffer instance');
                        }
                    }
                    this._handle = new n.Zlib(a);
                    var f = this;
                    this._hadError = false;
                    this._handle.onerror = function(t, r) {
                        O(f);
                        f._hadError = true;
                        var n = new Error(t);
                        n.errno = r;
                        n.code = e.codes[r];
                        f.emit('error', n);
                    };
                    var s = e.Z_DEFAULT_COMPRESSION;
                    if (typeof i.level === 'number') s = i.level;
                    var u = e.Z_DEFAULT_STRATEGY;
                    if (typeof i.strategy === 'number') u = i.strategy;
                    this._handle.init(i.windowBits || e.Z_DEFAULT_WINDOWBITS, s, i.memLevel || e.Z_DEFAULT_MEMLEVEL, u, i.dictionary);
                    this._buffer = t.allocUnsafe(this._chunkSize);
                    this._offset = 0;
                    this._level = s;
                    this._strategy = u;
                    this.once('end', this.close);
                    Object.defineProperty(this, '_closed', {
                        get: function e() {
                            return !o._handle;
                        },
                        configurable: true,
                        enumerable: true
                    });
                }
                i.inherits(S, r);
                S.prototype.params = function(t, r, i) {
                    if (t < e.Z_MIN_LEVEL || t > e.Z_MAX_LEVEL) {
                        throw new RangeError('Invalid compression level: ' + t);
                    }
                    if (r != e.Z_FILTERED && r != e.Z_HUFFMAN_ONLY && r != e.Z_RLE && r != e.Z_FIXED && r != e.Z_DEFAULT_STRATEGY) {
                        throw new TypeError('Invalid strategy: ' + r);
                    }
                    if (this._level !== t || this._strategy !== r) {
                        var o = this;
                        this.flush(n.Z_SYNC_FLUSH, function() {
                            a(o._handle, 'zlib binding closed');
                            o._handle.params(t, r);
                            if (!o._hadError) {
                                o._level = t;
                                o._strategy = r;
                                if (i) i();
                            }
                        });
                    } else {
                        browser$1$1.nextTick(i);
                    }
                };
                S.prototype.reset = function() {
                    a(this._handle, 'zlib binding closed');
                    return this._handle.reset();
                };
                S.prototype._flush = function(e) {
                    this._transform(t.alloc(0), '', e);
                };
                S.prototype.flush = function(e, r) {
                    var i = this;
                    var a = this._writableState;
                    if (typeof e === 'function' || e === undefined && !r) {
                        r = e;
                        e = n.Z_FULL_FLUSH;
                    }
                    if (a.ended) {
                        if (r) browser$1$1.nextTick(r);
                    } else if (a.ending) {
                        if (r) this.once('end', r);
                    } else if (a.needDrain) {
                        if (r) {
                            this.once('drain', function() {
                                return i.flush(e, r);
                            });
                        }
                    } else {
                        this._flushFlag = e;
                        this.write(t.alloc(0), '', r);
                    }
                };
                S.prototype.close = function(e) {
                    O(this, e);
                    browser$1$1.nextTick(x, this);
                };
                function O(e, t) {
                    if (t) browser$1$1.nextTick(t);
                    if (!e._handle) return;
                    e._handle.close();
                    e._handle = null;
                }
                function x(e) {
                    e.emit('close');
                }
                S.prototype._transform = function(e, r, i) {
                    var a;
                    var o = this._writableState;
                    var f = o.ending || o.ended;
                    var s = f && (!e || o.length === e.length);
                    if (e !== null && !t.isBuffer(e)) return i(new Error('invalid input'));
                    if (!this._handle) return i(new Error('zlib binding closed'));
                    if (s) a = this._finishFlushFlag;
                    else {
                        a = this._flushFlag;
                        if (e.length >= o.length) {
                            this._flushFlag = this._opts.flush || n.Z_NO_FLUSH;
                        }
                    }
                    this._processChunk(e, a, i);
                };
                S.prototype._processChunk = function(e, r, n) {
                    var i = e && e.length;
                    var s = this._chunkSize - this._offset;
                    var u = 0;
                    var l = this;
                    var c = typeof n === 'function';
                    if (!c) {
                        var h = [];
                        var p = 0;
                        var d;
                        this.on('error', function(e) {
                            d = e;
                        });
                        a(this._handle, 'zlib binding closed');
                        do {
                            var v = this._handle.writeSync(r, e, u, i, this._buffer, this._offset, s);
                        }while (!this._hadError && b(v[0], v[1]))
                        if (this._hadError) {
                            throw d;
                        }
                        if (p >= o) {
                            O(this);
                            throw new RangeError(f);
                        }
                        var y = t.concat(h, p);
                        O(this);
                        return y;
                    }
                    a(this._handle, 'zlib binding closed');
                    var g = this._handle.write(r, e, u, i, this._buffer, this._offset, s);
                    g.buffer = e;
                    g.callback = b;
                    function b(o, f) {
                        if (this) {
                            this.buffer = null;
                            this.callback = null;
                        }
                        if (l._hadError) return;
                        var d = s - f;
                        a(d >= 0, 'have should not go down');
                        if (d > 0) {
                            var v = l._buffer.slice(l._offset, l._offset + d);
                            l._offset += d;
                            if (c) {
                                l.push(v);
                            } else {
                                h.push(v);
                                p += v.length;
                            }
                        }
                        if (f === 0 || l._offset >= l._chunkSize) {
                            s = l._chunkSize;
                            l._offset = 0;
                            l._buffer = t.allocUnsafe(l._chunkSize);
                        }
                        if (f === 0) {
                            u += i - o;
                            i = o;
                            if (!c) return true;
                            var y = l._handle.write(r, e, u, i, l._buffer, l._offset, l._chunkSize);
                            y.callback = b;
                            y.buffer = e;
                            return;
                        }
                        if (!c) return false;
                        n();
                    }
                };
                i.inherits(g, S);
                i.inherits(b, S);
                i.inherits(w, S);
                i.inherits(_, S);
                i.inherits(m, S);
                i.inherits(E, S);
                i.inherits(k, S);
            })(lib);
            var PNG = function() {
                e.decode = function e(t, r) {
                    {
                        throw new Error('PNG.decode not available in browser build');
                    }
                };
                e.load = function e(t) {
                    {
                        throw new Error('PNG.load not available in browser build');
                    }
                };
                function e(e) {
                    var t;
                    this.data = e;
                    this.pos = 8;
                    this.palette = [];
                    this.imgData = [];
                    this.transparency = {};
                    this.text = {};
                    while(true){
                        var r = this.readUInt32();
                        var n = '';
                        for(t = 0; t < 4; t++){
                            n += String.fromCharCode(this.data[this.pos++]);
                        }
                        switch(n){
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
                                this.palette = this.read(r);
                                break;
                            case 'IDAT':
                                for(t = 0; t < r; t++){
                                    this.imgData.push(this.data[this.pos++]);
                                }
                                break;
                            case 'tRNS':
                                this.transparency = {};
                                switch(this.colorType){
                                    case 3:
                                        this.transparency.indexed = this.read(r);
                                        var i = 255 - this.transparency.indexed.length;
                                        if (i > 0) {
                                            for(t = 0; t < i; t++){
                                                this.transparency.indexed.push(255);
                                            }
                                        }
                                        break;
                                    case 0:
                                        this.transparency.grayscale = this.read(r)[0];
                                        break;
                                    case 2:
                                        this.transparency.rgb = this.read(r);
                                        break;
                                }
                                break;
                            case 'tEXt':
                                var a = this.read(r);
                                var o = a.indexOf(0);
                                var f = String.fromCharCode.apply(String, a.slice(0, o));
                                this.text[f] = String.fromCharCode.apply(String, a.slice(o + 1));
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
                                var s = this.colors + (this.hasAlphaChannel ? 1 : 0);
                                this.pixelBitlength = this.bits * s;
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
                                this.pos += r;
                        }
                        this.pos += 4;
                        if (this.pos > this.data.length) {
                            throw new Error('Incomplete or corrupt PNG file');
                        }
                    }
                }
                var t = e.prototype;
                t.read = function e(t) {
                    var r = new Array(t);
                    for(var n = 0; n < t; n++){
                        r[n] = this.data[this.pos++];
                    }
                    return r;
                };
                t.readUInt32 = function e() {
                    var t = this.data[this.pos++] << 24;
                    var r = this.data[this.pos++] << 16;
                    var n = this.data[this.pos++] << 8;
                    var i = this.data[this.pos++];
                    return t | r | n | i;
                };
                t.readUInt16 = function e() {
                    var t = this.data[this.pos++] << 8;
                    var r = this.data[this.pos++];
                    return t | r;
                };
                t.decodePixels = function e(t) {
                    var r = this;
                    return lib.inflate(this.imgData, function(e, n) {
                        if (e) throw e;
                        var i = 0;
                        var a = r.width, o = r.height;
                        var f = r.pixelBitlength / 8;
                        var s = Buffer$1.alloc(a * o * f);
                        function u(e, t, r, u, l) {
                            if (l === void 0) {
                                l = false;
                            }
                            var c = Math.ceil((a - e) / r);
                            var h = Math.ceil((o - t) / u);
                            var p = f * c;
                            var d = l ? s : Buffer$1.alloc(p * h);
                            var v = 0;
                            var y = 0;
                            while(v < h && i < n.length){
                                var g;
                                var b;
                                var w;
                                var _;
                                var m;
                                switch(n[i++]){
                                    case 0:
                                        for(w = 0; w < p; w++){
                                            d[y++] = n[i++];
                                        }
                                        break;
                                    case 1:
                                        for(w = 0; w < p; w++){
                                            g = n[i++];
                                            _ = w < f ? 0 : d[y - f];
                                            d[y++] = (g + _) % 256;
                                        }
                                        break;
                                    case 2:
                                        for(w = 0; w < p; w++){
                                            g = n[i++];
                                            b = (w - w % f) / f;
                                            m = v && d[(v - 1) * p + b * f + w % f];
                                            d[y++] = (m + g) % 256;
                                        }
                                        break;
                                    case 3:
                                        for(w = 0; w < p; w++){
                                            g = n[i++];
                                            b = (w - w % f) / f;
                                            _ = w < f ? 0 : d[y - f];
                                            m = v && d[(v - 1) * p + b * f + w % f];
                                            d[y++] = (g + Math.floor((_ + m) / 2)) % 256;
                                        }
                                        break;
                                    case 4:
                                        for(w = 0; w < p; w++){
                                            var E;
                                            var k;
                                            g = n[i++];
                                            b = (w - w % f) / f;
                                            _ = w < f ? 0 : d[y - f];
                                            if (v === 0) {
                                                m = k = 0;
                                            } else {
                                                m = d[(v - 1) * p + b * f + w % f];
                                                k = b && d[(v - 1) * p + (b - 1) * f + w % f];
                                            }
                                            var A = _ + m - k;
                                            var S = Math.abs(A - _);
                                            var O = Math.abs(A - m);
                                            var x = Math.abs(A - k);
                                            if (S <= O && S <= x) {
                                                E = _;
                                            } else if (O <= x) {
                                                E = m;
                                            } else {
                                                E = k;
                                            }
                                            d[y++] = (g + E) % 256;
                                        }
                                        break;
                                    default:
                                        throw new Error("Invalid filter algorithm: " + n[i - 1]);
                                }
                                if (!l) {
                                    var R = ((t + v * u) * a + e) * f;
                                    var T = v * p;
                                    for(w = 0; w < c; w++){
                                        for(var j = 0; j < f; j++){
                                            s[R++] = d[T++];
                                        }
                                        R += (r - 1) * f;
                                    }
                                }
                                v++;
                            }
                        }
                        if (r.interlaceMethod === 1) {
                            u(0, 0, 8, 8);
                            u(4, 0, 8, 8);
                            u(0, 4, 4, 8);
                            u(2, 0, 4, 4);
                            u(0, 2, 2, 4);
                            u(1, 0, 2, 2);
                            u(0, 1, 1, 2);
                        } else {
                            u(0, 0, 1, 1, true);
                        }
                        return t(s);
                    });
                };
                t.decodePalette = function e() {
                    var t = this.palette;
                    var r = t.length;
                    var n = this.transparency.indexed || [];
                    var i = Buffer$1.alloc(n.length + r);
                    var a = 0;
                    var o = 0;
                    for(var f = 0; f < r; f += 3){
                        var s;
                        i[a++] = t[f];
                        i[a++] = t[f + 1];
                        i[a++] = t[f + 2];
                        i[a++] = (s = n[o++]) != null ? s : 255;
                    }
                    return i;
                };
                t.copyToImageData = function e(t, r) {
                    var n;
                    var i;
                    var a = this.colors;
                    var o = null;
                    var f = this.hasAlphaChannel;
                    if (this.palette.length) {
                        o = this._decodedPalette || (this._decodedPalette = this.decodePalette());
                        a = 4;
                        f = true;
                    }
                    var s = t.data || t;
                    var u = s.length;
                    var l = o || r;
                    var c = n = 0;
                    if (a === 1) {
                        while(c < u){
                            i = o ? r[c / 4] * 4 : n;
                            var h = l[i++];
                            s[c++] = h;
                            s[c++] = h;
                            s[c++] = h;
                            s[c++] = f ? l[i++] : 255;
                            n = i;
                        }
                    } else {
                        while(c < u){
                            i = o ? r[c / 4] * 4 : n;
                            s[c++] = l[i++];
                            s[c++] = l[i++];
                            s[c++] = l[i++];
                            s[c++] = f ? l[i++] : 255;
                            n = i;
                        }
                    }
                };
                t.decode = function e(t) {
                    var r = this;
                    var n = Buffer$1.alloc(this.width * this.height * 4);
                    return this.decodePixels(function(e) {
                        r.copyToImageData(n, e);
                        return t(n);
                    });
                };
                return e;
            }();
        })
    }
]);
