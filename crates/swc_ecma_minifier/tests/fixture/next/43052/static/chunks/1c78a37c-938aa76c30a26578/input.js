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

							var retry_operation = RetryOperation,
								e, t;
							RetryOperation.prototype.reset = function () {
								this._attempts = 1, this._timeouts = this._originalTimeouts.slice(0)
							}, RetryOperation.prototype.stop = function () {
								this._timeout && clearTimeout(this._timeout), this._timer && clearTimeout(this._timer), this._timeouts = [], this._cachedTimeouts = null
							}, RetryOperation.prototype.retry = function (e) {
								if (this._timeout && clearTimeout(this._timeout), !e) return !1;
								var t = (new Date).getTime();
								if (e && t - this._operationStart >= this._maxRetryTime) return this._errors.push(e), this._errors.unshift(new Error("RetryOperation timeout occurred")), !1;
								this._errors.push(e);
								var r = this._timeouts.shift();
								if (void 0 === r) {
									if (!this._cachedTimeouts) return !1;
									this._errors.splice(0, this._errors.length - 1), r = this._cachedTimeouts.slice(-1)
								}
								var n = this;
								return this._timer = setTimeout((function () {
									n._attempts++, n._operationTimeoutCb && (n._timeout = setTimeout((function () {
										n._operationTimeoutCb(n._attempts)
									}), n._operationTimeout), n._options.unref && n._timeout.unref()), n._fn(n._attempts)
								}), r), this._options.unref && this._timer.unref(), !0
							}, RetryOperation.prototype.attempt = function (e, t) {
								this._fn = e, t && (t.timeout && (this._operationTimeout = t.timeout), t.cb && (this._operationTimeoutCb = t.cb));
								var r = this;
								this._operationTimeoutCb && (this._timeout = setTimeout((function () {
									r._operationTimeoutCb()
								}), r._operationTimeout)), this._operationStart = (new Date).getTime(), this._fn(this._attempts)
							}, RetryOperation.prototype.try = function (e) {
								console.log("Using RetryOperation.try() is deprecated"), this.attempt(e)
							}, RetryOperation.prototype.start = function (e) {
								console.log("Using RetryOperation.start() is deprecated"), this.attempt(e)
							}, RetryOperation.prototype.start = RetryOperation.prototype.try, RetryOperation.prototype.errors = function () {
								return this._errors
							}, RetryOperation.prototype.attempts = function () {
								return this._attempts
							}, RetryOperation.prototype.mainError = function () {
								if (0 === this._errors.length) return null;
								for (var e = {}, t = null, r = 0, n = 0; n < this._errors.length; n++) {
									var o = this._errors[n],
										i = o.message,
										s = (e[i] || 0) + 1;
									e[i] = s, s >= r && (t = o, r = s)
								}
								return t
							}, e = retry$1, t = retry_operation, e.operation = function (r) {
								var n = e.timeouts(r);
								return new t(n, {
									forever: r && (r.forever || r.retries === 1 / 0),
									unref: r && r.unref,
									maxRetryTime: r && r.maxRetryTime
								})
							}, e.timeouts = function (e) {
								if (e instanceof Array) return [].concat(e);
								var t = {
									retries: 10,
									factor: 2,
									minTimeout: 1e3,
									maxTimeout: 1 / 0,
									randomize: !1
								};
								for (var r in e) t[r] = e[r];
								if (t.minTimeout > t.maxTimeout) throw new Error("minTimeout is greater than maxTimeout");
								for (var n = [], o = 0; o < t.retries; o++) n.push(this.createTimeout(o, t));
								return e && e.forever && !n.length && n.push(this.createTimeout(o, t)), n.sort((function (e, t) {
									return e - t
								})), n
							}, e.createTimeout = function (e, t) {
								var r = t.randomize ? Math.random() + 1 : 1,
									n = Math.round(r * Math.max(t.minTimeout, 1) * Math.pow(t.factor, e));
								return Math.min(n, t.maxTimeout)
							}, e.wrap = function (t, r, n) {
								if (r instanceof Array && (n = r, r = null), !n)
									for (var o in n = [], t) "function" == typeof t[o] && n.push(o);
								for (var i = 0; i < n.length; i++) {
									var s = n[i],
										a = t[s];
									t[s] = function (n) {
										var o = e.operation(r),
											i = Array.prototype.slice.call(arguments, 1),
											s = i.pop();
										i.push((function (e) {
											o.retry(e) || (e && (arguments[0] = o.mainError()), s.apply(this, arguments))
										})), o.attempt((function () {
											n.apply(t, i)
										}))
									}.bind(t, a), t[s].options = r
								}
							},
								function (e) {
									e.exports = retry$1
								}(retry$2);

							function getIterator(e) {
								if ("function" == typeof e.next) return e;
								if ("function" == typeof e[Symbol.iterator]) return e[Symbol.iterator]();
								if ("function" == typeof e[Symbol.asyncIterator]) return e[Symbol.asyncIterator]();
								throw new TypeError('"values" does not to conform to any of the iterator or iterable protocols')
							}

							function defer() {
								let e, t;
								return {
									promise: new Promise(((r, n) => {
										t = r, e = n
									})),
									reject: e,
									resolve: t
								}
							}

							function _transform(e, t, r) {
								const n = getIterator(r),
									o = [],
									i = [];
								let s = !1,
									a = !1,
									c = 0,
									u = null;

								function d() {
									for (; i.length > 0 && o.length > 0;) {
										const {
											resolve: e
										} = i.shift();
										e({
											done: !1,
											value: o.shift()
										})
									}
									for (; i.length > 0 && 0 === c && s;) {
										const {
											resolve: e,
											reject: t
										} = i.shift();
										u ? (t(u), u = null) : e({
											done: !0,
											value: void 0
										})
									}
								}
								async function l() {
									if (s) d();
									else if (!(a || c + o.length >= e)) {
										a = !0, c++;
										try {
											const {
												done: e,
												value: r
											} = await n.next();
											e ? (s = !0, c--, d()) : async function (e) {
												try {
													const r = await t(e);
													o.push(r)
												} catch (e) {
													s = !0, u = e
												}
												c--, d(), l()
											}(r)
										} catch (e) {
											s = !0, c--, u = e, d()
										}
										a = !1, l()
									}
								}
								const f = {
									next: async function () {
										if (0 === o.length) {
											const e = defer();
											return i.push(e), l(), e.promise
										}
										const e = o.shift();
										return l(), {
											done: !1,
											value: e
										}
									},
									[Symbol.asyncIterator]: () => f
								};
								return f
							}

							function transform(e, t, r) {
								return void 0 === t ? (t, r) => r ? transform(e, t, r) : transform(e, t) : void 0 === r ? r => transform(e, t, r) : _transform(e, t, r)
							}
							var id = 0;


							const textDecoder = new TextDecoder;

							function decodeVarint(e, t) {
								let r = 0;
								for (let n = 0; ; n += 7) {
									if (n >= 64) throw new Error("protobuf: varint overflow");
									if (t >= e.length) throw new Error("protobuf: unexpected end of data");
									const o = e[t++];
									if (r += n < 28 ? (127 & o) << n : (127 & o) * 2 ** n, o < 128) break
								}
								return [r, t]
							}

							function decodeBytes(e, t) {
								let r;
								[r, t] = decodeVarint(e, t);
								const n = t + r;
								if (r < 0 || n < 0) throw new Error("protobuf: invalid length");
								if (n > e.length) throw new Error("protobuf: unexpected end of data");
								return [e.subarray(t, n), n]
							}

							function decodeKey(e, t) {
								let r;
								return [r, t] = decodeVarint(e, t), [7 & r, r >> 3, t]
							}

							function decodeLink(e) {
								const t = {},
									r = e.length;
								let n = 0;
								for (; n < r;) {
									let r, o;
									if ([r, o, n] = decodeKey(e, n), 1 === o) {
										if (t.Hash) throw new Error("protobuf: (PBLink) duplicate Hash section");
										if (2 !== r) throw new Error(`protobuf: (PBLink) wrong wireType (${r}) for Hash`);
										if (void 0 !== t.Name) throw new Error("protobuf: (PBLink) invalid order, found Name before Hash");
										if (void 0 !== t.Tsize) throw new Error("protobuf: (PBLink) invalid order, found Tsize before Hash");
										[t.Hash, n] = decodeBytes(e, n)
									} else if (2 === o) {
										if (void 0 !== t.Name) throw new Error("protobuf: (PBLink) duplicate Name section");
										if (2 !== r) throw new Error(`protobuf: (PBLink) wrong wireType (${r}) for Name`);
										if (void 0 !== t.Tsize) throw new Error("protobuf: (PBLink) invalid order, found Tsize before Name");
										let o;
										[o, n] = decodeBytes(e, n), t.Name = textDecoder.decode(o)
									} else {
										if (3 !== o) throw new Error(`protobuf: (PBLink) invalid fieldNumber, expected 1, 2 or 3, got ${o}`);
										if (void 0 !== t.Tsize) throw new Error("protobuf: (PBLink) duplicate Tsize section");
										if (0 !== r) throw new Error(`protobuf: (PBLink) wrong wireType (${r}) for Tsize`);
										[t.Tsize, n] = decodeVarint(e, n)
									}
								}
								if (n > r) throw new Error("protobuf: (PBLink) unexpected end of data");
								return t
							}

							function decodeNode(e) {
								const t = e.length;
								let r, n, o = 0,
									i = !1;
								for (; o < t;) {
									let t, s;
									if ([t, s, o] = decodeKey(e, o), 2 !== t) throw new Error(`protobuf: (PBNode) invalid wireType, expected 2, got ${t}`);
									if (1 === s) {
										if (n) throw new Error("protobuf: (PBNode) duplicate Data section");
										[n, o] = decodeBytes(e, o), r && (i = !0)
									} else {
										if (2 !== s) throw new Error(`protobuf: (PBNode) invalid fieldNumber, expected 1 or 2, got ${s}`); {
											if (i) throw new Error("protobuf: (PBNode) duplicate Links section");
											let t;
											r || (r = []), [t, o] = decodeBytes(e, o), r.push(decodeLink(t))
										}
									}
								}
								if (o > t) throw new Error("protobuf: (PBNode) unexpected end of data");
								const s = {};
								return n && (s.Data = n), s.Links = r || [], s
							}
							const textEncoder$1 = new TextEncoder,
								maxInt32 = 2 ** 32,
								maxUInt32 = 2 ** 31;

							function encodeLink$1(e, t) {
								let r = t.length;
								if ("number" == typeof e.Tsize) {
									if (e.Tsize < 0) throw new Error("Tsize cannot be negative");
									if (!Number.isSafeInteger(e.Tsize)) throw new Error("Tsize too large for encoding");
									r = encodeVarint(t, r, e.Tsize) - 1, t[r] = 24
								}
								if ("string" == typeof e.Name) {
									const n = textEncoder$1.encode(e.Name);
									r -= n.length, t.set(n, r), r = encodeVarint(t, r, n.length) - 1, t[r] = 18
								}
								return e.Hash && (r -= e.Hash.length, t.set(e.Hash, r), r = encodeVarint(t, r, e.Hash.length) - 1, t[r] = 10), t.length - r
							}

							function encodeNode(e) {
								const t = sizeNode(e),
									r = new Uint8Array(t);
								let n = t;
								if (e.Data && (n -= e.Data.length, r.set(e.Data, n), n = encodeVarint(r, n, e.Data.length) - 1, r[n] = 10), e.Links)
									for (let t = e.Links.length - 1; t >= 0; t--) {
										const o = encodeLink$1(e.Links[t], r.subarray(0, n));
										n -= o, n = encodeVarint(r, n, o) - 1, r[n] = 18
									}
								return r
							}

							function sizeLink(e) {
								let t = 0;
								if (e.Hash) {
									const r = e.Hash.length;
									t += 1 + r + sov(r)
								}
								if ("string" == typeof e.Name) {
									const r = textEncoder$1.encode(e.Name).length;
									t += 1 + r + sov(r)
								}
								return "number" == typeof e.Tsize && (t += 1 + sov(e.Tsize)), t
							}

							function sizeNode(e) {
								let t = 0;
								if (e.Data) {
									const r = e.Data.length;
									t += 1 + r + sov(r)
								}
								if (e.Links)
									for (const r of e.Links) {
										const e = sizeLink(r);
										t += 1 + e + sov(e)
									}
								return t
							}

							function encodeVarint(e, t, r) {
								const n = t -= sov(r);
								for (; r >= maxUInt32;) e[t++] = 127 & r | 128, r /= 128;
								for (; r >= 128;) e[t++] = 127 & r | 128, r >>>= 7;
								return e[t] = r, n
							}

							function sov(e) {
								return e % 2 == 0 && e++, Math.floor((len64(e) + 6) / 7)
							}

							function len64(e) {
								let t = 0;
								return e >= maxInt32 && (e = Math.floor(e / maxInt32), t = 32), e >= 65536 && (e >>>= 16, t += 16), e >= 256 && (e >>>= 8, t += 8), t + len8tab[e]
							}
							const len8tab = [0, 1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
								pbNodeProperties = ["Data", "Links"],
								pbLinkProperties = ["Hash", "Name", "Tsize"],
								textEncoder = new TextEncoder;

							function linkComparator(e, t) {
								if (e === t) return 0;
								const r = e.Name ? textEncoder.encode(e.Name) : [],
									n = t.Name ? textEncoder.encode(t.Name) : [];
								let o = r.length,
									i = n.length;
								for (let e = 0, t = Math.min(o, i); e < t; ++e)
									if (r[e] !== n[e]) {
										o = r[e], i = n[e];
										break
									} return o < i ? -1 : i < o ? 1 : 0
							}

							function hasOnlyProperties(e, t) {
								return !Object.keys(e).some((e => !t.includes(e)))
							}

							function asLink(e) {
								if ("object" == typeof e.asCID) {
									const t = CID.asCID(e);
									if (!t) throw new TypeError("Invalid DAG-PB form");
									return {
										Hash: t
									}
								}
								if ("object" != typeof e || Array.isArray(e)) throw new TypeError("Invalid DAG-PB form");
								const t = {};
								if (e.Hash) {
									let r = CID.asCID(e.Hash);
									try {
										r || ("string" == typeof e.Hash ? r = CID.parse(e.Hash) : e.Hash instanceof Uint8Array && (r = CID.decode(e.Hash)))
									} catch (e) {
										throw new TypeError(`Invalid DAG-PB form: ${e.message}`)
									}
									r && (t.Hash = r)
								}
								if (!t.Hash) throw new TypeError("Invalid DAG-PB form");
								return "string" == typeof e.Name && (t.Name = e.Name), "number" == typeof e.Tsize && (t.Tsize = e.Tsize), t
							}


							function validate(e) {
								if (!e || "object" != typeof e || Array.isArray(e)) throw new TypeError("Invalid DAG-PB form");
								if (!hasOnlyProperties(e, pbNodeProperties)) throw new TypeError("Invalid DAG-PB form (extraneous properties)");
								if (void 0 !== e.Data && !(e.Data instanceof Uint8Array)) throw new TypeError("Invalid DAG-PB form (Data must be a Uint8Array)");
								if (!Array.isArray(e.Links)) throw new TypeError("Invalid DAG-PB form (Links must be an array)");
								for (let t = 0; t < e.Links.length; t++) {
									const r = e.Links[t];
									if (!r || "object" != typeof r || Array.isArray(r)) throw new TypeError("Invalid DAG-PB form (bad link object)");
									if (!hasOnlyProperties(r, pbLinkProperties)) throw new TypeError("Invalid DAG-PB form (extraneous properties on link object)");
									if (!r.Hash) throw new TypeError("Invalid DAG-PB form (link must have a Hash)");
									if (r.Hash.asCID !== r.Hash) throw new TypeError("Invalid DAG-PB form (link Hash must be a CID)");
									if (void 0 !== r.Name && "string" != typeof r.Name) throw new TypeError("Invalid DAG-PB form (link Name must be a string)");
									if (void 0 !== r.Tsize && ("number" != typeof r.Tsize || r.Tsize % 1 != 0)) throw new TypeError("Invalid DAG-PB form (link Tsize must be an integer)");
									if (t > 0 && -1 === linkComparator(r, e.Links[t - 1])) throw new TypeError("Invalid DAG-PB form (links must be sorted by Name bytes)")
								}
							}


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
							var writer = Writer$1,
								util$4 = requireMinimal(),
								BufferWriter$1, LongBits$1 = util$4.LongBits,
								base64 = util$4.base64,
								utf8$1 = util$4.utf8;

							function Op(e, t, r) {
								this.fn = e, this.len = t, this.next = void 0, this.val = r
							}

							function noop$1() { }

							function State(e) {
								this.head = e.head, this.tail = e.tail, this.len = e.len, this.next = e.states
							}

							function Writer$1() {
								this.len = 0, this.head = new Op(noop$1, 0, 0), this.tail = this.head, this.states = null
							}
							var create$4 = function () {
								return util$4.Buffer ? function () {
									return (Writer$1.create = function () {
										return new BufferWriter$1
									})()
								} : function () {
									return new Writer$1
								}
							};

							function writeByte(e, t, r) {
								t[r] = 255 & e
							}

							function writeVarint32(e, t, r) {
								for (; e > 127;) t[r++] = 127 & e | 128, e >>>= 7;
								t[r] = e
							}

							function VarintOp(e, t) {
								this.len = e, this.next = void 0, this.val = t
							}

							function writeVarint64(e, t, r) {
								for (; e.hi;) t[r++] = 127 & e.lo | 128, e.lo = (e.lo >>> 7 | e.hi << 25) >>> 0, e.hi >>>= 7;
								for (; e.lo > 127;) t[r++] = 127 & e.lo | 128, e.lo = e.lo >>> 7;
								t[r++] = e.lo
							}

							function writeFixed32(e, t, r) {
								t[r] = 255 & e, t[r + 1] = e >>> 8 & 255, t[r + 2] = e >>> 16 & 255, t[r + 3] = e >>> 24
							}
							Writer$1.create = create$4(), Writer$1.alloc = function (e) {
								return new util$4.Array(e)
							}, util$4.Array !== Array && (Writer$1.alloc = util$4.pool(Writer$1.alloc, util$4.Array.prototype.subarray)), Writer$1.prototype._push = function (e, t, r) {
								return this.tail = this.tail.next = new Op(e, t, r), this.len += t, this
							}, VarintOp.prototype = Object.create(Op.prototype), VarintOp.prototype.fn = writeVarint32, Writer$1.prototype.uint32 = function (e) {
								return this.len += (this.tail = this.tail.next = new VarintOp((e >>>= 0) < 128 ? 1 : e < 16384 ? 2 : e < 2097152 ? 3 : e < 268435456 ? 4 : 5, e)).len, this
							}, Writer$1.prototype.int32 = function (e) {
								return e < 0 ? this._push(writeVarint64, 10, LongBits$1.fromNumber(e)) : this.uint32(e)
							}, Writer$1.prototype.sint32 = function (e) {
								return this.uint32((e << 1 ^ e >> 31) >>> 0)
							}, Writer$1.prototype.uint64 = function (e) {
								var t = LongBits$1.from(e);
								return this._push(writeVarint64, t.length(), t)
							}, Writer$1.prototype.int64 = Writer$1.prototype.uint64, Writer$1.prototype.sint64 = function (e) {
								var t = LongBits$1.from(e).zzEncode();
								return this._push(writeVarint64, t.length(), t)
							}, Writer$1.prototype.bool = function (e) {
								return this._push(writeByte, 1, e ? 1 : 0)
							}, Writer$1.prototype.fixed32 = function (e) {
								return this._push(writeFixed32, 4, e >>> 0)
							}, Writer$1.prototype.sfixed32 = Writer$1.prototype.fixed32, Writer$1.prototype.fixed64 = function (e) {
								var t = LongBits$1.from(e);
								return this._push(writeFixed32, 4, t.lo)._push(writeFixed32, 4, t.hi)
							}, Writer$1.prototype.sfixed64 = Writer$1.prototype.fixed64, Writer$1.prototype.float = function (e) {
								return this._push(util$4.float.writeFloatLE, 4, e)
							}, Writer$1.prototype.double = function (e) {
								return this._push(util$4.float.writeDoubleLE, 8, e)
							};
							var writeBytes = util$4.Array.prototype.set ? function (e, t, r) {
								t.set(e, r)
							} : function (e, t, r) {
								for (var n = 0; n < e.length; ++n) t[r + n] = e[n]
							};
							Writer$1.prototype.bytes = function (e) {
								var t = e.length >>> 0;
								if (!t) return this._push(writeByte, 1, 0);
								if (util$4.isString(e)) {
									var r = Writer$1.alloc(t = base64.length(e));
									base64.decode(e, r, 0), e = r
								}
								return this.uint32(t)._push(writeBytes, t, e)
							}, Writer$1.prototype.string = function (e) {
								var t = utf8$1.length(e);
								return t ? this.uint32(t)._push(utf8$1.write, t, e) : this._push(writeByte, 1, 0)
							}, Writer$1.prototype.fork = function () {
								return this.states = new State(this), this.head = this.tail = new Op(noop$1, 0, 0), this.len = 0, this
							}, Writer$1.prototype.reset = function () {
								return this.states ? (this.head = this.states.head, this.tail = this.states.tail, this.len = this.states.len, this.states = this.states.next) : (this.head = this.tail = new Op(noop$1, 0, 0), this.len = 0), this
							}, Writer$1.prototype.ldelim = function () {
								var e = this.head,
									t = this.tail,
									r = this.len;
								return this.reset().uint32(r), r && (this.tail.next = e.next, this.tail = t, this.len += r), this
							}, Writer$1.prototype.finish = function () {
								for (var e = this.head.next, t = this.constructor.alloc(this.len), r = 0; e;) e.fn(e.val, t, r), r += e.len, e = e.next;
								return t
							}, Writer$1._configure = function (e) {
								BufferWriter$1 = e, Writer$1.create = create$4(), BufferWriter$1._configure()
							};
							var Writer = writer;
							(BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
							var util$3 = requireMinimal();

							function BufferWriter() {
								Writer.call(this)
							}

							function writeStringBuffer(e, t, r) {
								e.length < 40 ? util$3.utf8.write(e, t, r) : t.utf8Write ? t.utf8Write(e, r) : t.write(e, r)
							}
							BufferWriter._configure = function () {
								BufferWriter.alloc = util$3._Buffer_allocUnsafe, BufferWriter.writeBytesBuffer = util$3.Buffer && util$3.Buffer.prototype instanceof Uint8Array && "set" === util$3.Buffer.prototype.set.name ? function (e, t, r) {
									t.set(e, r)
								} : function (e, t, r) {
									if (e.copy) e.copy(t, r, 0, e.length);
									else
										for (var n = 0; n < e.length;) t[r++] = e[n++]
								}
							}, BufferWriter.prototype.bytes = function (e) {
								util$3.isString(e) && (e = util$3._Buffer_from(e, "base64"));
								var t = e.length >>> 0;
								return this.uint32(t), t && this._push(BufferWriter.writeBytesBuffer, t, e), this
							}, BufferWriter.prototype.string = function (e) {
								var t = util$3.Buffer.byteLength(e);
								return this.uint32(t), t && this._push(writeStringBuffer, t, e), this
							}, BufferWriter._configure();
							var reader = Reader$1,
								util$2 = requireMinimal(),
								BufferReader$1, LongBits = util$2.LongBits,
								utf8 = util$2.utf8;

							function indexOutOfRange(e, t) {
								return RangeError("index out of range: " + e.pos + " + " + (t || 1) + " > " + e.len)
							}

							function Reader$1(e) {
								this.buf = e, this.pos = 0, this.len = e.length
							}
							var create_array = "undefined" != typeof Uint8Array ? function (e) {
								if (e instanceof Uint8Array || Array.isArray(e)) return new Reader$1(e);
								throw Error("illegal buffer")
							} : function (e) {
								if (Array.isArray(e)) return new Reader$1(e);
								throw Error("illegal buffer")
							},
								create$3 = function () {
									return util$2.Buffer ? function (e) {
										return (Reader$1.create = function (e) {
											return util$2.Buffer.isBuffer(e) ? new BufferReader$1(e) : create_array(e)
										})(e)
									} : create_array
								},
								value;

							function readLongVarint() {
								var e = new LongBits(0, 0),
									t = 0;
								if (!(this.len - this.pos > 4)) {
									for (; t < 3; ++t) {
										if (this.pos >= this.len) throw indexOutOfRange(this);
										if (e.lo = (e.lo | (127 & this.buf[this.pos]) << 7 * t) >>> 0, this.buf[this.pos++] < 128) return e
									}
									return e.lo = (e.lo | (127 & this.buf[this.pos++]) << 7 * t) >>> 0, e
								}
								for (; t < 4; ++t)
									if (e.lo = (e.lo | (127 & this.buf[this.pos]) << 7 * t) >>> 0, this.buf[this.pos++] < 128) return e;
								if (e.lo = (e.lo | (127 & this.buf[this.pos]) << 28) >>> 0, e.hi = (e.hi | (127 & this.buf[this.pos]) >> 4) >>> 0, this.buf[this.pos++] < 128) return e;
								if (t = 0, this.len - this.pos > 4) {
									for (; t < 5; ++t)
										if (e.hi = (e.hi | (127 & this.buf[this.pos]) << 7 * t + 3) >>> 0, this.buf[this.pos++] < 128) return e
								} else
									for (; t < 5; ++t) {
										if (this.pos >= this.len) throw indexOutOfRange(this);
										if (e.hi = (e.hi | (127 & this.buf[this.pos]) << 7 * t + 3) >>> 0, this.buf[this.pos++] < 128) return e
									}
								throw Error("invalid varint encoding")
							}

							function readFixed32_end(e, t) {
								return (e[t - 4] | e[t - 3] << 8 | e[t - 2] << 16 | e[t - 1] << 24) >>> 0
							}

							function readFixed64() {
								if (this.pos + 8 > this.len) throw indexOutOfRange(this, 8);
								return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4))
							}
							Reader$1.create = create$3(), Reader$1.prototype._slice = util$2.Array.prototype.subarray || util$2.Array.prototype.slice, Reader$1.prototype.uint32 = (value = 4294967295, function () {
								if (value = (127 & this.buf[this.pos]) >>> 0, this.buf[this.pos++] < 128) return value;
								if (value = (value | (127 & this.buf[this.pos]) << 7) >>> 0, this.buf[this.pos++] < 128) return value;
								if (value = (value | (127 & this.buf[this.pos]) << 14) >>> 0, this.buf[this.pos++] < 128) return value;
								if (value = (value | (127 & this.buf[this.pos]) << 21) >>> 0, this.buf[this.pos++] < 128) return value;
								if (value = (value | (15 & this.buf[this.pos]) << 28) >>> 0, this.buf[this.pos++] < 128) return value;
								if ((this.pos += 5) > this.len) throw this.pos = this.len, indexOutOfRange(this, 10);
								return value
							}), Reader$1.prototype.int32 = function () {
								return 0 | this.uint32()
							}, Reader$1.prototype.sint32 = function () {
								var e = this.uint32();
								return e >>> 1 ^ -(1 & e) | 0
							}, Reader$1.prototype.bool = function () {
								return 0 !== this.uint32()
							}, Reader$1.prototype.fixed32 = function () {
								if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
								return readFixed32_end(this.buf, this.pos += 4)
							}, Reader$1.prototype.sfixed32 = function () {
								if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
								return 0 | readFixed32_end(this.buf, this.pos += 4)
							}, Reader$1.prototype.float = function () {
								if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
								var e = util$2.float.readFloatLE(this.buf, this.pos);
								return this.pos += 4, e
							}, Reader$1.prototype.double = function () {
								if (this.pos + 8 > this.len) throw indexOutOfRange(this, 4);
								var e = util$2.float.readDoubleLE(this.buf, this.pos);
								return this.pos += 8, e
							}, Reader$1.prototype.bytes = function () {
								var e = this.uint32(),
									t = this.pos,
									r = this.pos + e;
								if (r > this.len) throw indexOutOfRange(this, e);
								return this.pos += e, Array.isArray(this.buf) ? this.buf.slice(t, r) : t === r ? new this.buf.constructor(0) : this._slice.call(this.buf, t, r)
							}, Reader$1.prototype.string = function () {
								var e = this.bytes();
								return utf8.read(e, 0, e.length)
							}, Reader$1.prototype.skip = function (e) {
								if ("number" == typeof e) {
									if (this.pos + e > this.len) throw indexOutOfRange(this, e);
									this.pos += e
								} else
									do {
										if (this.pos >= this.len) throw indexOutOfRange(this)
									} while (128 & this.buf[this.pos++]);
								return this
							}, Reader$1.prototype.skipType = function (e) {
								switch (e) {
									case 0:
										this.skip();
										break;
									case 1:
										this.skip(8);
										break;
									case 2:
										this.skip(this.uint32());
										break;
									case 3:
										for (; 4 != (e = 7 & this.uint32());) this.skipType(e);
										break;
									case 5:
										this.skip(4);
										break;
									default:
										throw Error("invalid wire type " + e + " at offset " + this.pos)
								}
								return this
							}, Reader$1._configure = function (e) {
								BufferReader$1 = e, Reader$1.create = create$3(), BufferReader$1._configure();
								var t = util$2.Long ? "toLong" : "toNumber";
								util$2.merge(Reader$1.prototype, {
									int64: function () {
										return readLongVarint.call(this)[t](!1)
									},
									uint64: function () {
										return readLongVarint.call(this)[t](!0)
									},
									sint64: function () {
										return readLongVarint.call(this).zzDecode()[t](!1)
									},
									fixed64: function () {
										return readFixed64.call(this)[t](!0)
									},
									sfixed64: function () {
										return readFixed64.call(this)[t](!1)
									}
								})
							};
							var Reader = reader;
							(BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
							var util$1 = requireMinimal();

							function BufferReader(e) {
								Reader.call(this, e)
							}
							BufferReader._configure = function () {
								util$1.Buffer && (BufferReader.prototype._slice = util$1.Buffer.prototype.slice)
							}, BufferReader.prototype.string = function () {
								var e = this.uint32();
								return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + e, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + e, this.len))
							}, BufferReader._configure();



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