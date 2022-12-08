(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
	[610], {

		/***/
		1522:
			/***/
			(function (__unused_webpack_module, exports, __webpack_require__) {

				/**
				 * react-uploader
				 *
				 * Copyright (c) Web3.Storage
				 *
				 * This source code is licensed under Apache-2.0 OR MIT license found in the
				 * LICENSE.md file in the root directory of this source tree.
				 *
				 * @license Apache-2.0 OR MIT
				 */
				! function (e, t) {
					true ? t(exports, __webpack_require__(7294), __webpack_require__(1321)) : 0
				}(this, (function (exports, React) {
					"use strict";

					var index_production = {
						exports: {}
					};
					/**
					 * uploader-core
					 *
					 * Copyright (c) Web3.Storage
					 *
					 * This source code is licensed under Apache-2.0 OR MIT license found in the
					 * LICENSE.md file in the root directory of this source tree.
					 *
					 * @license Apache-2.0 OR MIT
					 */
					(function (module, exports) {
						var t;
						t = function (exports) {
							var minimal = {},
								aspromise = asPromise;

							function asPromise(e, t) {
								for (var r = new Array(arguments.length - 1), n = 0, o = 2, i = !0; o < arguments.length;) r[n++] = arguments[o++];
								return new Promise((function (o, s) {
									r[n] = function (e) {
										if (i)
											if (i = !1, e) s(e);
											else {
												for (var t = new Array(arguments.length - 1), r = 0; r < t.length;) t[r++] = arguments[r];
												o.apply(null, t)
											}
									};
									try {
										e.apply(t || null, r)
									} catch (e) {
										i && (i = !1, s(e))
									}
								}))
							}
							var base64$1 = {};
							! function (e) {
								var t = e;
								t.length = function (e) {
									var t = e.length;
									if (!t) return 0;
									for (var r = 0; --t % 4 > 1 && "=" === e.charAt(t);) ++r;
									return Math.ceil(3 * e.length) / 4 - r
								};
								for (var r = new Array(64), n = new Array(123), o = 0; o < 64;) n[r[o] = o < 26 ? o + 65 : o < 52 ? o + 71 : o < 62 ? o - 4 : o - 59 | 43] = o++;
								t.encode = function (e, t, n) {
									for (var o, i = null, s = [], a = 0, c = 0; t < n;) {
										var u = e[t++];
										switch (c) {
											case 0:
												s[a++] = r[u >> 2], o = (3 & u) << 4, c = 1;
												break;
											case 1:
												s[a++] = r[o | u >> 4], o = (15 & u) << 2, c = 2;
												break;
											case 2:
												s[a++] = r[o | u >> 6], s[a++] = r[63 & u], c = 0
										}
										a > 8191 && ((i || (i = [])).push(String.fromCharCode.apply(String, s)), a = 0)
									}
									return c && (s[a++] = r[o], s[a++] = 61, 1 === c && (s[a++] = 61)), i ? (a && i.push(String.fromCharCode.apply(String, s.slice(0, a))), i.join("")) : String.fromCharCode.apply(String, s.slice(0, a))
								};
								var i = "invalid encoding";
								t.decode = function (e, t, r) {
									for (var o, s = r, a = 0, c = 0; c < e.length;) {
										var u = e.charCodeAt(c++);
										if (61 === u && a > 1) break;
										if (void 0 === (u = n[u])) throw Error(i);
										switch (a) {
											case 0:
												o = u, a = 1;
												break;
											case 1:
												t[r++] = o << 2 | (48 & u) >> 4, o = u, a = 2;
												break;
											case 2:
												t[r++] = (15 & o) << 4 | (60 & u) >> 2, o = u, a = 3;
												break;
											case 3:
												t[r++] = (3 & o) << 6 | u, a = 0
										}
									}
									if (1 === a) throw Error(i);
									return r - s
								}, t.test = function (e) {
									return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e)
								}
							}(base64$1);
							var eventemitter = EventEmitter;

							function EventEmitter() {
								this._listeners = {}
							}
							EventEmitter.prototype.on = function (e, t, r) {
								return (this._listeners[e] || (this._listeners[e] = [])).push({
									fn: t,
									ctx: r || this
								}), this
							}, EventEmitter.prototype.off = function (e, t) {
								if (void 0 === e) this._listeners = {};
								else if (void 0 === t) this._listeners[e] = [];
								else
									for (var r = this._listeners[e], n = 0; n < r.length;) r[n].fn === t ? r.splice(n, 1) : ++n;
								return this
							}, EventEmitter.prototype.emit = function (e) {
								var t = this._listeners[e];
								if (t) {
									for (var r = [], n = 1; n < arguments.length;) r.push(arguments[n++]);
									for (n = 0; n < t.length;) t[n].fn.apply(t[n++].ctx, r)
								}
								return this
							};
							var float = factory(factory);

							function factory(e) {
								return "undefined" != typeof Float32Array ? function () {
									var t = new Float32Array([-0]),
										r = new Uint8Array(t.buffer),
										n = 128 === r[3];

									function o(e, n, o) {
										t[0] = e, n[o] = r[0], n[o + 1] = r[1], n[o + 2] = r[2], n[o + 3] = r[3]
									}

									function i(e, n, o) {
										t[0] = e, n[o] = r[3], n[o + 1] = r[2], n[o + 2] = r[1], n[o + 3] = r[0]
									}

									function s(e, n) {
										return r[0] = e[n], r[1] = e[n + 1], r[2] = e[n + 2], r[3] = e[n + 3], t[0]
									}

									function a(e, n) {
										return r[3] = e[n], r[2] = e[n + 1], r[1] = e[n + 2], r[0] = e[n + 3], t[0]
									}
									e.writeFloatLE = n ? o : i, e.writeFloatBE = n ? i : o, e.readFloatLE = n ? s : a, e.readFloatBE = n ? a : s
								}() : function () {
									function t(e, t, r, n) {
										var o = t < 0 ? 1 : 0;
										if (o && (t = -t), 0 === t) e(1 / t > 0 ? 0 : 2147483648, r, n);
										else if (isNaN(t)) e(2143289344, r, n);
										else if (t > 34028234663852886e22) e((o << 31 | 2139095040) >>> 0, r, n);
										else if (t < 11754943508222875e-54) e((o << 31 | Math.round(t / 1401298464324817e-60)) >>> 0, r, n);
										else {
											var i = Math.floor(Math.log(t) / Math.LN2);
											e((o << 31 | i + 127 << 23 | 8388607 & Math.round(t * Math.pow(2, -i) * 8388608)) >>> 0, r, n)
										}
									}

									function r(e, t, r) {
										var n = e(t, r),
											o = 2 * (n >> 31) + 1,
											i = n >>> 23 & 255,
											s = 8388607 & n;
										return 255 === i ? s ? NaN : o * (1 / 0) : 0 === i ? 1401298464324817e-60 * o * s : o * Math.pow(2, i - 150) * (s + 8388608)
									}
									e.writeFloatLE = t.bind(null, writeUintLE), e.writeFloatBE = t.bind(null, writeUintBE), e.readFloatLE = r.bind(null, readUintLE), e.readFloatBE = r.bind(null, readUintBE)
								}(), "undefined" != typeof Float64Array ? function () {
									var t = new Float64Array([-0]),
										r = new Uint8Array(t.buffer),
										n = 128 === r[7];

									function o(e, n, o) {
										t[0] = e, n[o] = r[0], n[o + 1] = r[1], n[o + 2] = r[2], n[o + 3] = r[3], n[o + 4] = r[4], n[o + 5] = r[5], n[o + 6] = r[6], n[o + 7] = r[7]
									}

									function i(e, n, o) {
										t[0] = e, n[o] = r[7], n[o + 1] = r[6], n[o + 2] = r[5], n[o + 3] = r[4], n[o + 4] = r[3], n[o + 5] = r[2], n[o + 6] = r[1], n[o + 7] = r[0]
									}

									function s(e, n) {
										return r[0] = e[n], r[1] = e[n + 1], r[2] = e[n + 2], r[3] = e[n + 3], r[4] = e[n + 4], r[5] = e[n + 5], r[6] = e[n + 6], r[7] = e[n + 7], t[0]
									}

									function a(e, n) {
										return r[7] = e[n], r[6] = e[n + 1], r[5] = e[n + 2], r[4] = e[n + 3], r[3] = e[n + 4], r[2] = e[n + 5], r[1] = e[n + 6], r[0] = e[n + 7], t[0]
									}
									e.writeDoubleLE = n ? o : i, e.writeDoubleBE = n ? i : o, e.readDoubleLE = n ? s : a, e.readDoubleBE = n ? a : s
								}() : function () {
									function t(e, t, r, n, o, i) {
										var s = n < 0 ? 1 : 0;
										if (s && (n = -n), 0 === n) e(0, o, i + t), e(1 / n > 0 ? 0 : 2147483648, o, i + r);
										else if (isNaN(n)) e(0, o, i + t), e(2146959360, o, i + r);
										else if (n > 17976931348623157e292) e(0, o, i + t), e((s << 31 | 2146435072) >>> 0, o, i + r);
										else {
											var a;
											if (n < 22250738585072014e-324) e((a = n / 5e-324) >>> 0, o, i + t), e((s << 31 | a / 4294967296) >>> 0, o, i + r);
											else {
												var c = Math.floor(Math.log(n) / Math.LN2);
												1024 === c && (c = 1023), e(4503599627370496 * (a = n * Math.pow(2, -c)) >>> 0, o, i + t), e((s << 31 | c + 1023 << 20 | 1048576 * a & 1048575) >>> 0, o, i + r)
											}
										}
									}

									function r(e, t, r, n, o) {
										var i = e(n, o + t),
											s = e(n, o + r),
											a = 2 * (s >> 31) + 1,
											c = s >>> 20 & 2047,
											u = 4294967296 * (1048575 & s) + i;
										return 2047 === c ? u ? NaN : a * (1 / 0) : 0 === c ? 5e-324 * a * u : a * Math.pow(2, c - 1075) * (u + 4503599627370496)
									}
									e.writeDoubleLE = t.bind(null, writeUintLE, 0, 4), e.writeDoubleBE = t.bind(null, writeUintBE, 4, 0), e.readDoubleLE = r.bind(null, readUintLE, 0, 4), e.readDoubleBE = r.bind(null, readUintBE, 4, 0)
								}(), e
							}

							function writeUintLE(e, t, r) {
								t[r] = 255 & e, t[r + 1] = e >>> 8 & 255, t[r + 2] = e >>> 16 & 255, t[r + 3] = e >>> 24
							}

							function writeUintBE(e, t, r) {
								t[r] = e >>> 24, t[r + 1] = e >>> 16 & 255, t[r + 2] = e >>> 8 & 255, t[r + 3] = 255 & e
							}

							function readUintLE(e, t) {
								return (e[t] | e[t + 1] << 8 | e[t + 2] << 16 | e[t + 3] << 24) >>> 0
							}

							function readUintBE(e, t) {
								return (e[t] << 24 | e[t + 1] << 16 | e[t + 2] << 8 | e[t + 3]) >>> 0
							}
							var inquire_1 = inquire;

							function inquire(moduleName) {
								try {
									var mod = eval("quire".replace(/^/, "re"))(moduleName);
									if (mod && (mod.length || Object.keys(mod).length)) return mod
								} catch (e) { }
								return null
							}
							var utf8$2 = {};
							! function (e) {
								var t = e;
								t.length = function (e) {
									for (var t = 0, r = 0, n = 0; n < e.length; ++n)(r = e.charCodeAt(n)) < 128 ? t += 1 : r < 2048 ? t += 2 : 55296 == (64512 & r) && 56320 == (64512 & e.charCodeAt(n + 1)) ? (++n, t += 4) : t += 3;
									return t
								}, t.read = function (e, t, r) {
									if (r - t < 1) return "";
									for (var n, o = null, i = [], s = 0; t < r;)(n = e[t++]) < 128 ? i[s++] = n : n > 191 && n < 224 ? i[s++] = (31 & n) << 6 | 63 & e[t++] : n > 239 && n < 365 ? (n = ((7 & n) << 18 | (63 & e[t++]) << 12 | (63 & e[t++]) << 6 | 63 & e[t++]) - 65536, i[s++] = 55296 + (n >> 10), i[s++] = 56320 + (1023 & n)) : i[s++] = (15 & n) << 12 | (63 & e[t++]) << 6 | 63 & e[t++], s > 8191 && ((o || (o = [])).push(String.fromCharCode.apply(String, i)), s = 0);
									return o ? (s && o.push(String.fromCharCode.apply(String, i.slice(0, s))), o.join("")) : String.fromCharCode.apply(String, i.slice(0, s))
								}, t.write = function (e, t, r) {
									for (var n, o, i = r, s = 0; s < e.length; ++s)(n = e.charCodeAt(s)) < 128 ? t[r++] = n : n < 2048 ? (t[r++] = n >> 6 | 192, t[r++] = 63 & n | 128) : 55296 == (64512 & n) && 56320 == (64512 & (o = e.charCodeAt(s + 1))) ? (n = 65536 + ((1023 & n) << 10) + (1023 & o), ++s, t[r++] = n >> 18 | 240, t[r++] = n >> 12 & 63 | 128, t[r++] = n >> 6 & 63 | 128, t[r++] = 63 & n | 128) : (t[r++] = n >> 12 | 224, t[r++] = n >> 6 & 63 | 128, t[r++] = 63 & n | 128);
									return r - i
								}
							}(utf8$2);
							var pool_1 = pool,
								longbits, hasRequiredLongbits, hasRequiredMinimal;

							function pool(e, t, r) {
								var n = r || 8192,
									o = n >>> 1,
									i = null,
									s = n;
								return function (r) {
									if (r < 1 || r > o) return e(r);
									s + r > n && (i = e(n), s = 0);
									var a = t.call(i, s, s += r);
									return 7 & s && (s = 1 + (7 | s)), a
								}
							}

							function requireLongbits() {
								if (hasRequiredLongbits) return longbits;
								hasRequiredLongbits = 1, longbits = t;
								var e = requireMinimal();

								function t(e, t) {
									this.lo = e >>> 0, this.hi = t >>> 0
								}
								var r = t.zero = new t(0, 0);
								r.toNumber = function () {
									return 0
								}, r.zzEncode = r.zzDecode = function () {
									return this
								}, r.length = function () {
									return 1
								};
								var n = t.zeroHash = "\0\0\0\0\0\0\0\0";
								t.fromNumber = function (e) {
									if (0 === e) return r;
									var n = e < 0;
									n && (e = -e);
									var o = e >>> 0,
										i = (e - o) / 4294967296 >>> 0;
									return n && (i = ~i >>> 0, o = ~o >>> 0, ++o > 4294967295 && (o = 0, ++i > 4294967295 && (i = 0))), new t(o, i)
								}, t.from = function (n) {
									if ("number" == typeof n) return t.fromNumber(n);
									if (e.isString(n)) {
										if (!e.Long) return t.fromNumber(parseInt(n, 10));
										n = e.Long.fromString(n)
									}
									return n.low || n.high ? new t(n.low >>> 0, n.high >>> 0) : r
								}, t.prototype.toNumber = function (e) {
									if (!e && this.hi >>> 31) {
										var t = 1 + ~this.lo >>> 0,
											r = ~this.hi >>> 0;
										return t || (r = r + 1 >>> 0), -(t + 4294967296 * r)
									}
									return this.lo + 4294967296 * this.hi
								}, t.prototype.toLong = function (t) {
									return e.Long ? new e.Long(0 | this.lo, 0 | this.hi, Boolean(t)) : {
										low: 0 | this.lo,
										high: 0 | this.hi,
										unsigned: Boolean(t)
									}
								};
								var o = String.prototype.charCodeAt;
								return t.fromHash = function (e) {
									return e === n ? r : new t((o.call(e, 0) | o.call(e, 1) << 8 | o.call(e, 2) << 16 | o.call(e, 3) << 24) >>> 0, (o.call(e, 4) | o.call(e, 5) << 8 | o.call(e, 6) << 16 | o.call(e, 7) << 24) >>> 0)
								}, t.prototype.toHash = function () {
									return String.fromCharCode(255 & this.lo, this.lo >>> 8 & 255, this.lo >>> 16 & 255, this.lo >>> 24, 255 & this.hi, this.hi >>> 8 & 255, this.hi >>> 16 & 255, this.hi >>> 24)
								}, t.prototype.zzEncode = function () {
									var e = this.hi >> 31;
									return this.hi = ((this.hi << 1 | this.lo >>> 31) ^ e) >>> 0, this.lo = (this.lo << 1 ^ e) >>> 0, this
								}, t.prototype.zzDecode = function () {
									var e = -(1 & this.lo);
									return this.lo = ((this.lo >>> 1 | this.hi << 31) ^ e) >>> 0, this.hi = (this.hi >>> 1 ^ e) >>> 0, this
								}, t.prototype.length = function () {
									var e = this.lo,
										t = (this.lo >>> 28 | this.hi << 4) >>> 0,
										r = this.hi >>> 24;
									return 0 === r ? 0 === t ? e < 16384 ? e < 128 ? 1 : 2 : e < 2097152 ? 3 : 4 : t < 16384 ? t < 128 ? 5 : 6 : t < 2097152 ? 7 : 8 : r < 128 ? 9 : 10
								}, longbits
							}

							function requireMinimal() {
								return hasRequiredMinimal || (hasRequiredMinimal = 1, function (e) {
									var t = e;

									function r(e, t, r) {
										for (var n = Object.keys(t), o = 0; o < n.length; ++o) void 0 !== e[n[o]] && r || (e[n[o]] = t[n[o]]);
										return e
									}

									function n(e) {
										function t(e, n) {
											if (!(this instanceof t)) return new t(e, n);
											Object.defineProperty(this, "message", {
												get: function () {
													return e
												}
											}), Error.captureStackTrace ? Error.captureStackTrace(this, t) : Object.defineProperty(this, "stack", {
												value: (new Error).stack || ""
											}), n && r(this, n)
										}
										return (t.prototype = Object.create(Error.prototype)).constructor = t, Object.defineProperty(t.prototype, "name", {
											get: function () {
												return e
											}
										}), t.prototype.toString = function () {
											return this.name + ": " + this.message
										}, t
									}
									t.asPromise = aspromise, t.base64 = base64$1, t.EventEmitter = eventemitter, t.float = float, t.inquire = inquire_1, t.utf8 = utf8$2, t.pool = pool_1, t.LongBits = requireLongbits(), t.isNode = Boolean(void 0 !== commonjsGlobal$1 && commonjsGlobal$1 && commonjsGlobal$1.process && commonjsGlobal$1.process.versions && commonjsGlobal$1.process.versions.node), t.global = t.isNode && commonjsGlobal$1 || "undefined" != typeof window && window || "undefined" != typeof self && self || commonjsGlobal$1, t.emptyArray = Object.freeze ? Object.freeze([]) : [], t.emptyObject = Object.freeze ? Object.freeze({}) : {}, t.isInteger = Number.isInteger || function (e) {
										return "number" == typeof e && isFinite(e) && Math.floor(e) === e
									}, t.isString = function (e) {
										return "string" == typeof e || e instanceof String
									}, t.isObject = function (e) {
										return e && "object" == typeof e
									}, t.isset = t.isSet = function (e, t) {
										var r = e[t];
										return !(null == r || !e.hasOwnProperty(t)) && ("object" != typeof r || (Array.isArray(r) ? r.length : Object.keys(r).length) > 0)
									}, t.Buffer = function () {
										try {
											var e = t.inquire("buffer").Buffer;
											return e.prototype.utf8Write ? e : null
										} catch (e) {
											return null
										}
									}(), t._Buffer_from = null, t._Buffer_allocUnsafe = null, t.newBuffer = function (e) {
										return "number" == typeof e ? t.Buffer ? t._Buffer_allocUnsafe(e) : new t.Array(e) : t.Buffer ? t._Buffer_from(e) : "undefined" == typeof Uint8Array ? e : new Uint8Array(e)
									}, t.Array = "undefined" != typeof Uint8Array ? Uint8Array : Array, t.Long = t.global.dcodeIO && t.global.dcodeIO.Long || t.global.Long || t.inquire("long"), t.key2Re = /^true|false|0|1$/, t.key32Re = /^-?(?:0|[1-9][0-9]*)$/, t.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/, t.longToHash = function (e) {
										return e ? t.LongBits.from(e).toHash() : t.LongBits.zeroHash
									}, t.longFromHash = function (e, r) {
										var n = t.LongBits.fromHash(e);
										return t.Long ? t.Long.fromBits(n.lo, n.hi, r) : n.toNumber(Boolean(r))
									}, t.merge = r, t.lcFirst = function (e) {
										return e.charAt(0).toLowerCase() + e.substring(1)
									}, t.newError = n, t.ProtocolError = n("ProtocolError"), t.oneOfGetter = function (e) {
										for (var t = {}, r = 0; r < e.length; ++r) t[e[r]] = 1;
										return function () {
											for (var e = Object.keys(this), r = e.length - 1; r > -1; --r)
												if (1 === t[e[r]] && void 0 !== this[e[r]] && null !== this[e[r]]) return e[r]
										}
									}, t.oneOfSetter = function (e) {
										return function (t) {
											for (var r = 0; r < e.length; ++r) e[r] !== t && delete this[e[r]]
										}
									}, t.toJSONOptions = {
										longs: String,
										enums: String,
										bytes: String,
										json: !0
									}, t._configure = function () {
										var e = t.Buffer;
										e ? (t._Buffer_from = e.from !== Uint8Array.from && e.from || function (t, r) {
											return new e(t, r)
										}, t._Buffer_allocUnsafe = e.allocUnsafe || function (t) {
											return new e(t)
										}) : t._Buffer_from = t._Buffer_allocUnsafe = null
									}
								}(minimal)), minimal
							}








							async function* chunkBlocks(e, t = {}) {
							}

							async function uploadCarChunks(e, t, r = {}) {
							}
							async function createUpload(e, t, r) {
							}
							async function uploadCarBytes(e, t, r = {}) {

							}
							exports.chunkBlocks = chunkBlocks, exports.createUpload = createUpload, exports.encodeDirectory = encodeDirectory, exports.encodeFile = encodeFile, exports.uploadCarBytes = uploadCarBytes, exports.uploadCarChunks = uploadCarChunks, Object.defineProperty(exports, "__esModule", {
								value: !0
							})
						}, t(exports)
					})(index_production, index_production.exports);
					const UploaderContext = React.createContext([{
						uploadedCarChunks: []
					}, {
					}]);

					function UploaderProvider({
					}) {

					}

					function useUploader() {
						return React.useContext(UploaderContext)
					}
					exports.UploaderProvider = UploaderProvider, exports.chunkBlocks = index_production.exports.chunkBlocks, exports.encodeDirectory = index_production.exports.encodeDirectory, exports.encodeFile = index_production.exports.encodeFile, exports.useUploader = useUploader, Object.defineProperty(exports, "__esModule", {
						value: !0
					})
				}));
				//# sourceMappingURL=index.production.js.map


				/***/
			})

	}
]);