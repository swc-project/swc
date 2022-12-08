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

					var commonjsGlobal = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof __webpack_require__.g ? __webpack_require__.g : "undefined" != typeof self ? self : {},
						index_production = {
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
							var _nodeResolve_empty = {},
								nodeCrypto = Object.freeze({
									__proto__: null,
									default: _nodeResolve_empty
								});
							/*! noble-ed25519 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
							const CU_O = BigInt("7237005577332262213973186563042994240857116359379907606001950938285454250989"),
								CURVE = Object.freeze({
									a: BigInt(-1),
									d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
									P: BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949"),
									l: CU_O,
									n: CU_O,
									h: BigInt(8),
									Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
									Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960")
								});
							BigInt("6853475219497561581579357271197624642482790079785650197046958215289687604742");



























							async function verify(e, t, r) {
							}
							var REST$2 = 127;

							function encode$i(e, t, r) {
							}

							function read$1(e, t) {
							}
							var N1$1 = Math.pow(2, 7),
								N2$1 = Math.pow(2, 14),
								N3$1 = Math.pow(2, 21),
								N4$1 = Math.pow(2, 28),
								N5$1 = Math.pow(2, 35),
								N6$1 = Math.pow(2, 42),
								N7$1 = Math.pow(2, 49),
								N8$1 = Math.pow(2, 56),
								N9$1 = Math.pow(2, 63),
								varint$1 = {
								},
								_brrp_varint = varint$1;
							const decode$l = (e, t = 0) => [_brrp_varint.decode(e, t), _brrp_varint.decode.bytes],
								encodeTo = (e, t, r = 0) => (_brrp_varint.encode(e, t, r), t),
								encodingLength = e => _brrp_varint.encodingLength(e),
								equals$1 = (e, t) => {
									if (e === t) return !0;
									if (e.byteLength !== t.byteLength) return !1;
									for (let r = 0; r < e.byteLength; r++)
										if (e[r] !== t[r]) return !1;
									return !0
								},
								coerce = e => {
									if (e instanceof Uint8Array && "Uint8Array" === e.constructor.name) return e;
									if (e instanceof ArrayBuffer) return new Uint8Array(e);
									if (ArrayBuffer.isView(e)) return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
									throw new Error("Unknown type, must be binary type")
								},
								create$7 = (e, t) => {
									const r = t.byteLength,
										n = encodingLength(e),
										o = n + encodingLength(r),
										i = new Uint8Array(o + r);
									return encodeTo(e, i, 0), encodeTo(r, i, n), i.set(t, o), new Digest(e, r, t, i)
								},
								decode$k = e => {
									const t = coerce(e),
										[r, n] = decode$l(t),
										[o, i] = decode$l(t.subarray(n)),
										s = t.subarray(n + i);
									if (s.byteLength !== o) throw new Error("Incorrect length");
									return new Digest(r, o, s, t)
								},
								equals = (e, t) => e === t || e.code === t.code && e.size === t.size && equals$1(e.bytes, t.bytes);
							class Digest {
							}

							function base$2(e, t) {
							}
							var src = base$2,
								_brrp__multiformats_scope_baseX = src;
							class Encoder {
							}
							class Decoder {
							}
							class ComposedDecoder {
								constructor(e) {
									this.decoders = e
								}
								or(e) {
									return or$1(this, e)
								}
								decode(e) {
									const t = e[0],
										r = this.decoders[t];
									if (r) return r.decode(e);
									throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)
								}
							}
							const or$1 = (e, t) => new ComposedDecoder({
								...e.decoders || {
									[e.prefix]: e
								},
								...t.decoders || {
									[t.prefix]: t
								}
							});
							class Codec {
								constructor(e, t, r, n) {
									this.name = e, this.prefix = t, this.baseEncode = r, this.baseDecode = n, this.encoder = new Encoder(e, t, r), this.decoder = new Decoder(e, t, n)
								}
								encode(e) {
									return this.encoder.encode(e)
								}
								decode(e) {
									return this.decoder.decode(e)
								}
							}
							const from$2 = ({
								name: e,
								prefix: t,
								encode: r,
								decode: n
							}) => new Codec(e, t, r, n),
								baseX = ({
									prefix: e,
									name: t,
									alphabet: r
								}) => {
									const {
										encode: n,
										decode: o
									} = _brrp__multiformats_scope_baseX(r, t);
									return from$2({
										prefix: e,
										name: t,
										encode: n,
										decode: e => coerce(o(e))
									})
								},
								decode$j = (e, t, r, n) => {
									const o = {};
									for (let e = 0; e < t.length; ++e) o[t[e]] = e;
									let i = e.length;
									for (;
										"=" === e[i - 1];) --i;
									const s = new Uint8Array(i * r / 8 | 0);
									let a = 0,
										c = 0,
										u = 0;
									for (let t = 0; t < i; ++t) {
										const i = o[e[t]];
										if (void 0 === i) throw new SyntaxError(`Non-${n} character`);
										c = c << r | i, a += r, a >= 8 && (a -= 8, s[u++] = 255 & c >> a)
									}
									if (a >= r || 255 & c << 8 - a) throw new SyntaxError("Unexpected end of data");
									return s
								},
								encode$h = (e, t, r) => {
									const n = "=" === t[t.length - 1],
										o = (1 << r) - 1;
									let i = "",
										s = 0,
										a = 0;
									for (let n = 0; n < e.length; ++n)
										for (a = a << 8 | e[n], s += 8; s > r;) s -= r, i += t[o & a >> s];
									if (s && (i += t[o & a << r - s]), n)
										for (; i.length * r & 7;) i += "=";
									return i
								},
								rfc4648 = ({
									name: e,
									prefix: t,
									bitsPerChar: r,
									alphabet: n
								}) => from$2({
									prefix: t,
									name: e,
									encode: e => encode$h(e, n, r),
									decode: t => decode$j(t, n, r, e)
								}),
								base58btc = baseX({
									name: "base58btc",
									prefix: "z",
									alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
								});
							baseX({
								name: "base58flickr",
								prefix: "Z",
								alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
							});
							const base32 = rfc4648({
								prefix: "b",
								name: "base32",
								alphabet: "abcdefghijklmnopqrstuvwxyz234567",
								bitsPerChar: 5
							});
							rfc4648({
								prefix: "B",
								name: "base32upper",
								alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
								bitsPerChar: 5
							}), rfc4648({
								prefix: "c",
								name: "base32pad",
								alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
								bitsPerChar: 5
							}), rfc4648({
								prefix: "C",
								name: "base32padupper",
								alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
								bitsPerChar: 5
							}), rfc4648({
								prefix: "v",
								name: "base32hex",
								alphabet: "0123456789abcdefghijklmnopqrstuv",
								bitsPerChar: 5
							}), rfc4648({
								prefix: "V",
								name: "base32hexupper",
								alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
								bitsPerChar: 5
							}), rfc4648({
								prefix: "t",
								name: "base32hexpad",
								alphabet: "0123456789abcdefghijklmnopqrstuv=",
								bitsPerChar: 5
							}), rfc4648({
								prefix: "T",
								name: "base32hexpadupper",
								alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
								bitsPerChar: 5
							}), rfc4648({
								prefix: "h",
								name: "base32z",
								alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
								bitsPerChar: 5
							});
							class CID {
								constructor(e, t, r, n) {
									this.code = t, this.version = e, this.multihash = r, this.bytes = n, this.byteOffset = n.byteOffset, this.byteLength = n.byteLength, this.asCID = this, this._baseCache = new Map, Object.defineProperties(this, {
										byteOffset: hidden,
										byteLength: hidden,
										code: readonly,
										version: readonly,
										multihash: readonly,
										bytes: readonly,
										_baseCache: hidden,
										asCID: hidden
									})
								}
								toV0() {
									if (0 === this.version) return this; {
										const {
											code: e,
											multihash: t
										} = this;
										if (e !== DAG_PB_CODE) throw new Error("Cannot convert a non dag-pb CID to CIDv0");
										if (t.code !== SHA_256_CODE) throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");
										return CID.createV0(t)
									}
								}
								toV1() {
									switch (this.version) {
										case 0: {
											const {
												code: e,
												digest: t
											} = this.multihash, r = create$7(e, t);
											return CID.createV1(this.code, r)
										}
										case 1:
											return this;
										default:
											throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`)
									}
								}
								equals(e) {
									return e && this.code === e.code && this.version === e.version && equals(this.multihash, e.multihash)
								}
								toString(e) {
									const {
										bytes: t,
										version: r,
										_baseCache: n
									} = this;
									return 0 === r ? toStringV0(t, n, e || base58btc.encoder) : toStringV1(t, n, e || base32.encoder)
								}
								toJSON() {
									return {
										code: this.code,
										version: this.version,
										hash: this.multihash.bytes
									}
								}
								get [Symbol.toStringTag]() {
									return "CID"
								} [Symbol.for("nodejs.util.inspect.custom")]() {
									return "CID(" + this.toString() + ")"
								}
								static isCID(e) {
									return deprecate(/^0\.0/, IS_CID_DEPRECATION), !(!e || !e[cidSymbol] && e.asCID !== e)
								}
								get toBaseEncodedString() {
									throw new Error("Deprecated, use .toString()")
								}
								get codec() {
									throw new Error('"codec" property is deprecated, use integer "code" property instead')
								}
								get buffer() {
									throw new Error("Deprecated .buffer property, use .bytes to get Uint8Array instead")
								}
								get multibaseName() {
									throw new Error('"multibaseName" property is deprecated')
								}
								get prefix() {
									throw new Error('"prefix" property is deprecated')
								}
								static asCID(e) {
									if (e instanceof CID) return e;
									if (null != e && e.asCID === e) {
										const {
											version: t,
											code: r,
											multihash: n,
											bytes: o
										} = e;
										return new CID(t, r, n, o || encodeCID(t, r, n.bytes))
									}
									if (null != e && !0 === e[cidSymbol]) {
										const {
											version: t,
											multihash: r,
											code: n
										} = e, o = decode$k(r);
										return CID.create(t, n, o)
									}
									return null
								}
								static create(e, t, r) {
									if ("number" != typeof t) throw new Error("String codecs are no longer supported");
									switch (e) {
										case 0:
											if (t !== DAG_PB_CODE) throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`);
											return new CID(e, t, r, r.bytes);
										case 1: {
											const n = encodeCID(e, t, r.bytes);
											return new CID(e, t, r, n)
										}
										default:
											throw new Error("Invalid version")
									}
								}
								static createV0(e) {
									return CID.create(0, DAG_PB_CODE, e)
								}
								static createV1(e, t) {
									return CID.create(1, e, t)
								}
								static decode(e) {
									const [t, r] = CID.decodeFirst(e);
									if (r.length) throw new Error("Incorrect length");
									return t
								}
								static decodeFirst(e) {
									const t = CID.inspectBytes(e),
										r = t.size - t.multihashSize,
										n = coerce(e.subarray(r, r + t.multihashSize));
									if (n.byteLength !== t.multihashSize) throw new Error("Incorrect length");
									const o = n.subarray(t.multihashSize - t.digestSize),
										i = new Digest(t.multihashCode, t.digestSize, o, n);
									return [0 === t.version ? CID.createV0(i) : CID.createV1(t.codec, i), e.subarray(t.size)]
								}
								static inspectBytes(e) {
									let t = 0;
									const r = () => {
										const [r, n] = decode$l(e.subarray(t));
										return t += n, r
									};
									let n = r(),
										o = DAG_PB_CODE;
									if (18 === n ? (n = 0, t = 0) : 1 === n && (o = r()), 0 !== n && 1 !== n) throw new RangeError(`Invalid CID version ${n}`);
									const i = t,
										s = r(),
										a = r(),
										c = t + a;
									return {
										version: n,
										codec: o,
										multihashCode: s,
										digestSize: a,
										multihashSize: c - i,
										size: c
									}
								}
								static parse(e, t) {
									const [r, n] = parseCIDtoBytes(e, t), o = CID.decode(n);
									return o._baseCache.set(r, e), o
								}
							}
							const parseCIDtoBytes = (e, t) => {
								switch (e[0]) {
									case "Q": {
										const r = t || base58btc;
										return [base58btc.prefix, r.decode(`${base58btc.prefix}${e}`)]
									}
									case base58btc.prefix: {
										const r = t || base58btc;
										return [base58btc.prefix, r.decode(e)]
									}
									case base32.prefix: {
										const r = t || base32;
										return [base32.prefix, r.decode(e)]
									}
									default:
										if (null == t) throw Error("To parse non base32 or base58btc encoded CID multibase decoder must be provided");
										return [e[0], t.decode(e)]
								}
							},
								toStringV0 = (e, t, r) => {
									const {
										prefix: n
									} = r;
									if (n !== base58btc.prefix) throw Error(`Cannot string encode V0 in ${r.name} encoding`);
									const o = t.get(n);
									if (null == o) {
										const o = r.encode(e).slice(1);
										return t.set(n, o), o
									}
									return o
								},
								toStringV1 = (e, t, r) => {
									const {
										prefix: n
									} = r, o = t.get(n);
									if (null == o) {
										const o = r.encode(e);
										return t.set(n, o), o
									}
									return o
								},
								DAG_PB_CODE = 112,
								SHA_256_CODE = 18,
								encodeCID = (e, t, r) => {
									const n = encodingLength(e),
										o = n + encodingLength(t),
										i = new Uint8Array(o + r.byteLength);
									return encodeTo(e, i, 0), encodeTo(t, i, n), i.set(r, o), i
								},
								cidSymbol = Symbol.for("@ipld/js-cid/CID"),
								readonly = {
									writable: !1,
									configurable: !1,
									enumerable: !0
								},
								hidden = {
									writable: !1,
									enumerable: !1,
									configurable: !1
								},
								version = "0.0.0-dev",
								deprecate = (e, t) => {
									if (!e.test(version)) throw new Error(t);
									console.warn(t)
								},
								IS_CID_DEPRECATION = "CID.isCID(v) is deprecated and will be removed in the next major release.\nFollowing code pattern:\n\nif (CID.isCID(value)) {\n  doSomethingWithCID(value)\n}\n\nIs replaced with:\n\nconst cid = CID.asCID(value)\nif (cid) {\n  // Make sure to use cid instead of value\n  doSomethingWithCID(cid)\n}\n",
								from$1 = ({
									name: e,
									code: t,
									encode: r
								}) => new Hasher(e, t, r);
							class Hasher {
								constructor(e, t, r) {
									this.name = e, this.code = t, this.encode = r
								}
								digest(e) {
									if (e instanceof Uint8Array) {
										const t = this.encode(e);
										return t instanceof Uint8Array ? create$7(this.code, t) : t.then((e => create$7(this.code, e)))
									}
									throw Error("Unknown type, must be binary type")
								}
							}
							const DID_KEY_PREFIX = "did:key:",
								ED25519 = 237,
								RSA = 4613,
								P256 = 4608,
								algorithm = e => {
									const [t] = decode$l(e);
									switch (t) {
										case ED25519:
										case RSA:
											return t;
										case P256:
											if (e.length > 35) throw new RangeError("Only p256-pub compressed is supported.");
											return t;
										default:
											throw new RangeError(`Unsupported key algorithm with multicode 0x${t.toString(16)}.`)
									}
								},
								parse$4 = e => {
									if (!e.startsWith(DID_KEY_PREFIX)) throw new RangeError(`Invalid DID "${e}", must start with 'did:key:'`);
									return decode$i(base58btc.decode(e.slice(DID_KEY_PREFIX.length)))
								},
								format$3 = e => `${DID_KEY_PREFIX}${base58btc.encode(encode$g(e))}`,
								decode$i = e => (algorithm(e), new DID(e.buffer, e.byteOffset, e.byteLength)),
								encode$g = e => e,
								from = e => e instanceof DID ? e : e instanceof Uint8Array ? decode$i(e) : parse$4(e);
							class DID extends Uint8Array {
								did() {
									return format$3(this)
								}
							}
							const code$8 = 237,
								PUBLIC_TAG_SIZE = encodingLength(code$8),
								SIZE = 32 + PUBLIC_TAG_SIZE,
								parse$3 = e => decode$h(parse$4(e)),
								decode$h = e => {
									const [t] = decode$l(e);
									if (t !== code$8) throw new RangeError(`Unsupported key algorithm with multicode 0x${code$8.toString(16)}`);
									if (e.byteLength !== SIZE) throw new RangeError(`Expected Uint8Array with byteLength ${SIZE}, instead got Uint8Array with byteLength ${e.byteLength}`);
									return new Principal(e.buffer, e.byteOffset)
								},
								format$2 = e => format$3(e.bytes);
							class Principal {
								constructor(e, t = 0) {
									this.buffer = e, this.byteOffset = t, this.byteLength = SIZE
								}
								get bytes() {
									const e = new Uint8Array(this.buffer, this.byteOffset, this.byteLength);
									return Object.defineProperties(this, {
										bytes: {
											value: e
										}
									}), e
								}
								get publicKey() {
									const e = new Uint8Array(this.buffer, this.byteOffset + PUBLIC_TAG_SIZE);
									return Object.defineProperties(this, {
										publicKey: {
											value: e
										}
									}), e
								}
								did() {
									return format$2(this)
								}
								verify(e, t) {
									return verify(t, e, this.publicKey)
								}
							}
							const base64$2 = rfc4648({
								prefix: "m",
								name: "base64",
								alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
								bitsPerChar: 6
							});
							rfc4648({
								prefix: "M",
								name: "base64pad",
								alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
								bitsPerChar: 6
							});
							const base64url = rfc4648({
								prefix: "u",
								name: "base64url",
								alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
								bitsPerChar: 6
							});
							rfc4648({
								prefix: "U",
								name: "base64urlpad",
								alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
								bitsPerChar: 6
							});
							const typeofs = ["string", "number", "bigint", "symbol"],
								objectTypeNames = ["Function", "Generator", "AsyncGenerator", "GeneratorFunction", "AsyncGeneratorFunction", "AsyncFunction", "Observable", "Array", "Buffer", "Object", "RegExp", "Date", "Error", "Map", "Set", "WeakMap", "WeakSet", "ArrayBuffer", "SharedArrayBuffer", "DataView", "Promise", "URL", "HTMLElement", "Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Uint16Array", "Int32Array", "Uint32Array", "Float32Array", "Float64Array", "BigInt64Array", "BigUint64Array"];

							function is(e) {
								if (null === e) return "null";
								if (void 0 === e) return "undefined";
								if (!0 === e || !1 === e) return "boolean";
								const t = typeof e;
								return typeofs.includes(t) ? t : "function" === t ? "Function" : Array.isArray(e) ? "Array" : isBuffer$1(e) ? "Buffer" : getObjectType(e) || "Object"
							}

							function isBuffer$1(e) {
								return e && e.constructor && e.constructor.isBuffer && e.constructor.isBuffer.call(null, e)
							}

							function getObjectType(e) {
								const t = Object.prototype.toString.call(e).slice(8, -1);
								if (objectTypeNames.includes(t)) return t
							}
							class Type {
								constructor(e, t, r) {
									this.major = e, this.majorEncoded = e << 5, this.name = t, this.terminal = r
								}
								toString() {
									return `Type[${this.major}].${this.name}`
								}
								compare(e) {
									return this.major < e.major ? -1 : this.major > e.major ? 1 : 0
								}
							}
							Type.uint = new Type(0, "uint", !0), Type.negint = new Type(1, "negint", !0), Type.bytes = new Type(2, "bytes", !0), Type.string = new Type(3, "string", !0), Type.array = new Type(4, "array", !1), Type.map = new Type(5, "map", !1), Type.tag = new Type(6, "tag", !1), Type.float = new Type(7, "float", !0), Type.false = new Type(7, "false", !0), Type.true = new Type(7, "true", !0), Type.null = new Type(7, "null", !0), Type.undefined = new Type(7, "undefined", !0), Type.break = new Type(7, "break", !0);
							class Token {
								constructor(e, t, r) {
									this.type = e, this.value = t, this.encodedLength = r, this.encodedBytes = void 0, this.byteValue = void 0
								}
								toString() {
									return `Token[${this.type}].${this.value}`
								}
							}
							const useBuffer = globalThis.process && !globalThis.process.browser && globalThis.Buffer && "function" == typeof globalThis.Buffer.isBuffer,
								textDecoder$1 = new TextDecoder,
								textEncoder$2 = new TextEncoder;

							function isBuffer(e) {
								return useBuffer && globalThis.Buffer.isBuffer(e)
							}

							function asU8A(e) {
								return e instanceof Uint8Array ? isBuffer(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength) : e : Uint8Array.from(e)
							}
							const toString = useBuffer ? (e, t, r) => r - t > 64 ? globalThis.Buffer.from(e.subarray(t, r)).toString("utf8") : utf8Slice(e, t, r) : (e, t, r) => r - t > 64 ? textDecoder$1.decode(e.subarray(t, r)) : utf8Slice(e, t, r),
								fromString = useBuffer ? e => e.length > 64 ? globalThis.Buffer.from(e) : utf8ToBytes(e) : e => e.length > 64 ? textEncoder$2.encode(e) : utf8ToBytes(e),
								fromArray = e => Uint8Array.from(e),
								slice$1 = useBuffer ? (e, t, r) => isBuffer(e) ? new Uint8Array(e.subarray(t, r)) : e.slice(t, r) : (e, t, r) => e.slice(t, r),
								concat = useBuffer ? (e, t) => (e = e.map((e => e instanceof Uint8Array ? e : globalThis.Buffer.from(e))), asU8A(globalThis.Buffer.concat(e, t))) : (e, t) => {
									const r = new Uint8Array(t);
									let n = 0;
									for (let t of e) n + t.length > r.length && (t = t.subarray(0, r.length - n)), r.set(t, n), n += t.length;
									return r
								},
								alloc = useBuffer ? e => globalThis.Buffer.allocUnsafe(e) : e => new Uint8Array(e);

							function compare(e, t) {
								if (isBuffer(e) && isBuffer(t)) return e.compare(t);
								for (let r = 0; r < e.length; r++)
									if (e[r] !== t[r]) return e[r] < t[r] ? -1 : 1;
								return 0
							}

							function utf8ToBytes(e, t = 1 / 0) {
								let r;
								const n = e.length;
								let o = null;
								const i = [];
								for (let s = 0; s < n; ++s) {
									if (r = e.charCodeAt(s), r > 55295 && r < 57344) {
										if (!o) {
											if (r > 56319) {
												(t -= 3) > -1 && i.push(239, 191, 189);
												continue
											}
											if (s + 1 === n) {
												(t -= 3) > -1 && i.push(239, 191, 189);
												continue
											}
											o = r;
											continue
										}
										if (r < 56320) {
											(t -= 3) > -1 && i.push(239, 191, 189), o = r;
											continue
										}
										r = 65536 + (o - 55296 << 10 | r - 56320)
									} else o && (t -= 3) > -1 && i.push(239, 191, 189);
									if (o = null, r < 128) {
										if ((t -= 1) < 0) break;
										i.push(r)
									} else if (r < 2048) {
										if ((t -= 2) < 0) break;
										i.push(r >> 6 | 192, 63 & r | 128)
									} else if (r < 65536) {
										if ((t -= 3) < 0) break;
										i.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
									} else {
										if (!(r < 1114112)) throw new Error("Invalid code point");
										if ((t -= 4) < 0) break;
										i.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
									}
								}
								return i
							}

							function utf8Slice(e, t, r) {
								const n = [];
								for (; t < r;) {
									const o = e[t];
									let i = null,
										s = o > 239 ? 4 : o > 223 ? 3 : o > 191 ? 2 : 1;
									if (t + s <= r) {
										let r, n, a, c;
										switch (s) {
											case 1:
												o < 128 && (i = o);
												break;
											case 2:
												r = e[t + 1], 128 == (192 & r) && (c = (31 & o) << 6 | 63 & r, c > 127 && (i = c));
												break;
											case 3:
												r = e[t + 1], n = e[t + 2], 128 == (192 & r) && 128 == (192 & n) && (c = (15 & o) << 12 | (63 & r) << 6 | 63 & n, c > 2047 && (c < 55296 || c > 57343) && (i = c));
												break;
											case 4:
												r = e[t + 1], n = e[t + 2], a = e[t + 3], 128 == (192 & r) && 128 == (192 & n) && 128 == (192 & a) && (c = (15 & o) << 18 | (63 & r) << 12 | (63 & n) << 6 | 63 & a, c > 65535 && c < 1114112 && (i = c))
										}
									}
									null === i ? (i = 65533, s = 1) : i > 65535 && (i -= 65536, n.push(i >>> 10 & 1023 | 55296), i = 56320 | 1023 & i), n.push(i), t += s
								}
								return decodeCodePointsArray(n)
							}
							const MAX_ARGUMENTS_LENGTH = 4096;

							function decodeCodePointsArray(e) {
								const t = e.length;
								if (t <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, e);
								let r = "",
									n = 0;
								for (; n < t;) r += String.fromCharCode.apply(String, e.slice(n, n += MAX_ARGUMENTS_LENGTH));
								return r
							}
							const defaultChunkSize = 256;
							class Bl {
								constructor(e = defaultChunkSize) {
									this.chunkSize = e, this.cursor = 0, this.maxCursor = -1, this.chunks = [], this._initReuseChunk = null
								}
								reset() {
									this.cursor = 0, this.maxCursor = -1, this.chunks.length && (this.chunks = []), null !== this._initReuseChunk && (this.chunks.push(this._initReuseChunk), this.maxCursor = this._initReuseChunk.length - 1)
								}
								push(e) {
									let t = this.chunks[this.chunks.length - 1];
									if (this.cursor + e.length <= this.maxCursor + 1) {
										const r = t.length - (this.maxCursor - this.cursor) - 1;
										t.set(e, r)
									} else {
										if (t) {
											const e = t.length - (this.maxCursor - this.cursor) - 1;
											e < t.length && (this.chunks[this.chunks.length - 1] = t.subarray(0, e), this.maxCursor = this.cursor - 1)
										}
										e.length < 64 && e.length < this.chunkSize ? (t = alloc(this.chunkSize), this.chunks.push(t), this.maxCursor += t.length, null === this._initReuseChunk && (this._initReuseChunk = t), t.set(e, 0)) : (this.chunks.push(e), this.maxCursor += e.length)
									}
									this.cursor += e.length
								}
								toBytes(e = !1) {
									let t;
									if (1 === this.chunks.length) {
										const r = this.chunks[0];
										e && this.cursor > r.length / 2 ? (t = this.cursor === r.length ? r : r.subarray(0, this.cursor), this._initReuseChunk = null, this.chunks = []) : t = slice$1(r, 0, this.cursor)
									} else t = concat(this.chunks, this.cursor);
									return e && this.reset(), t
								}
							}
							const decodeErrPrefix = "CBOR decode error:",
								encodeErrPrefix = "CBOR encode error:";

							function assertEnoughData(e, t, r) {
								if (e.length - t < r) throw new Error(`${decodeErrPrefix} not enough data for type`)
							}
							const uintBoundaries = [24, 256, 65536, 4294967296, BigInt("18446744073709551616")];

							function readUint8(e, t, r) {
								assertEnoughData(e, t, 1);
								const n = e[t];
								if (!0 === r.strict && n < uintBoundaries[0]) throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
								return n
							}

							function readUint16(e, t, r) {
								assertEnoughData(e, t, 2);
								const n = e[t] << 8 | e[t + 1];
								if (!0 === r.strict && n < uintBoundaries[1]) throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
								return n
							}

							function readUint32(e, t, r) {
								assertEnoughData(e, t, 4);
								const n = 16777216 * e[t] + (e[t + 1] << 16) + (e[t + 2] << 8) + e[t + 3];
								if (!0 === r.strict && n < uintBoundaries[2]) throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
								return n
							}

							function readUint64(e, t, r) {
								assertEnoughData(e, t, 8);
								const n = 16777216 * e[t] + (e[t + 1] << 16) + (e[t + 2] << 8) + e[t + 3],
									o = 16777216 * e[t + 4] + (e[t + 5] << 16) + (e[t + 6] << 8) + e[t + 7],
									i = (BigInt(n) << BigInt(32)) + BigInt(o);
								if (!0 === r.strict && i < uintBoundaries[3]) throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
								if (i <= Number.MAX_SAFE_INTEGER) return Number(i);
								if (!0 === r.allowBigInt) return i;
								throw new Error(`${decodeErrPrefix} integers outside of the safe integer range are not supported`)
							}

							function decodeUint8(e, t, r, n) {
								return new Token(Type.uint, readUint8(e, t + 1, n), 2)
							}

							function decodeUint16(e, t, r, n) {
								return new Token(Type.uint, readUint16(e, t + 1, n), 3)
							}

							function decodeUint32(e, t, r, n) {
								return new Token(Type.uint, readUint32(e, t + 1, n), 5)
							}

							function decodeUint64(e, t, r, n) {
								return new Token(Type.uint, readUint64(e, t + 1, n), 9)
							}

							function encodeUint(e, t) {
								return encodeUintValue(e, 0, t.value)
							}

							function encodeUintValue(e, t, r) {
								if (r < uintBoundaries[0]) {
									const n = Number(r);
									e.push([t | n])
								} else if (r < uintBoundaries[1]) {
									const n = Number(r);
									e.push([24 | t, n])
								} else if (r < uintBoundaries[2]) {
									const n = Number(r);
									e.push([25 | t, n >>> 8, 255 & n])
								} else if (r < uintBoundaries[3]) {
									const n = Number(r);
									e.push([26 | t, n >>> 24 & 255, n >>> 16 & 255, n >>> 8 & 255, 255 & n])
								} else {
									const n = BigInt(r);
									if (!(n < uintBoundaries[4])) throw new Error(`${decodeErrPrefix} encountered BigInt larger than allowable range`); {
										const r = [27 | t, 0, 0, 0, 0, 0, 0, 0];
										let o = Number(n & BigInt(4294967295)),
											i = Number(n >> BigInt(32) & BigInt(4294967295));
										r[8] = 255 & o, o >>= 8, r[7] = 255 & o, o >>= 8, r[6] = 255 & o, o >>= 8, r[5] = 255 & o, r[4] = 255 & i, i >>= 8, r[3] = 255 & i, i >>= 8, r[2] = 255 & i, i >>= 8, r[1] = 255 & i, e.push(r)
									}
								}
							}

							function decodeNegint8(e, t, r, n) {
								return new Token(Type.negint, -1 - readUint8(e, t + 1, n), 2)
							}

							function decodeNegint16(e, t, r, n) {
								return new Token(Type.negint, -1 - readUint16(e, t + 1, n), 3)
							}

							function decodeNegint32(e, t, r, n) {
								return new Token(Type.negint, -1 - readUint32(e, t + 1, n), 5)
							}
							encodeUint.encodedSize = function (e) {
								return encodeUintValue.encodedSize(e.value)
							}, encodeUintValue.encodedSize = function (e) {
								return e < uintBoundaries[0] ? 1 : e < uintBoundaries[1] ? 2 : e < uintBoundaries[2] ? 3 : e < uintBoundaries[3] ? 5 : 9
							}, encodeUint.compareTokens = function (e, t) {
								return e.value < t.value ? -1 : e.value > t.value ? 1 : 0
							};
							const neg1b = BigInt(-1),
								pos1b = BigInt(1);

							function decodeNegint64(e, t, r, n) {
								const o = readUint64(e, t + 1, n);
								if ("bigint" != typeof o) {
									const e = -1 - o;
									if (e >= Number.MIN_SAFE_INTEGER) return new Token(Type.negint, e, 9)
								}
								if (!0 !== n.allowBigInt) throw new Error(`${decodeErrPrefix} integers outside of the safe integer range are not supported`);
								return new Token(Type.negint, neg1b - BigInt(o), 9)
							}

							function encodeNegint(e, t) {
								const r = t.value,
									n = "bigint" == typeof r ? r * neg1b - pos1b : -1 * r - 1;
								encodeUintValue(e, t.type.majorEncoded, n)
							}

							function toToken$3(e, t, r, n) {
								assertEnoughData(e, t, r + n);
								const o = slice$1(e, t + r, t + r + n);
								return new Token(Type.bytes, o, r + n)
							}

							function decodeBytesCompact(e, t, r, n) {
								return toToken$3(e, t, 1, r)
							}

							function decodeBytes8(e, t, r, n) {
								return toToken$3(e, t, 2, readUint8(e, t + 1, n))
							}

							function decodeBytes16(e, t, r, n) {
								return toToken$3(e, t, 3, readUint16(e, t + 1, n))
							}

							function decodeBytes32(e, t, r, n) {
								return toToken$3(e, t, 5, readUint32(e, t + 1, n))
							}

							function decodeBytes64(e, t, r, n) {
								const o = readUint64(e, t + 1, n);
								if ("bigint" == typeof o) throw new Error(`${decodeErrPrefix} 64-bit integer bytes lengths not supported`);
								return toToken$3(e, t, 9, o)
							}

							function tokenBytes(e) {
								return void 0 === e.encodedBytes && (e.encodedBytes = e.type === Type.string ? fromString(e.value) : e.value), e.encodedBytes
							}

							function encodeBytes(e, t) {
								const r = tokenBytes(t);
								encodeUintValue(e, t.type.majorEncoded, r.length), e.push(r)
							}

							function compareBytes(e, t) {
								return e.length < t.length ? -1 : e.length > t.length ? 1 : compare(e, t)
							}

							function toToken$2(e, t, r, n, o) {
								const i = r + n;
								assertEnoughData(e, t, i);
								const s = new Token(Type.string, toString(e, t + r, t + i), i);
								return !0 === o.retainStringBytes && (s.byteValue = slice$1(e, t + r, t + i)), s
							}

							function decodeStringCompact(e, t, r, n) {
								return toToken$2(e, t, 1, r, n)
							}

							function decodeString8(e, t, r, n) {
								return toToken$2(e, t, 2, readUint8(e, t + 1, n), n)
							}

							function decodeString16(e, t, r, n) {
								return toToken$2(e, t, 3, readUint16(e, t + 1, n), n)
							}

							function decodeString32(e, t, r, n) {
								return toToken$2(e, t, 5, readUint32(e, t + 1, n), n)
							}

							function decodeString64(e, t, r, n) {
								const o = readUint64(e, t + 1, n);
								if ("bigint" == typeof o) throw new Error(`${decodeErrPrefix} 64-bit integer string lengths not supported`);
								return toToken$2(e, t, 9, o, n)
							}
							encodeNegint.encodedSize = function (e) {
								const t = e.value,
									r = "bigint" == typeof t ? t * neg1b - pos1b : -1 * t - 1;
								return r < uintBoundaries[0] ? 1 : r < uintBoundaries[1] ? 2 : r < uintBoundaries[2] ? 3 : r < uintBoundaries[3] ? 5 : 9
							}, encodeNegint.compareTokens = function (e, t) {
								return e.value < t.value ? 1 : e.value > t.value ? -1 : 0
							}, encodeBytes.encodedSize = function (e) {
								const t = tokenBytes(e);
								return encodeUintValue.encodedSize(t.length) + t.length
							}, encodeBytes.compareTokens = function (e, t) {
								return compareBytes(tokenBytes(e), tokenBytes(t))
							};
							const encodeString = encodeBytes;

							function toToken$1(e, t, r, n) {
								return new Token(Type.array, n, r)
							}

							function decodeArrayCompact(e, t, r, n) {
								return toToken$1(e, t, 1, r)
							}

							function decodeArray8(e, t, r, n) {
								return toToken$1(e, t, 2, readUint8(e, t + 1, n))
							}

							function decodeArray16(e, t, r, n) {
								return toToken$1(e, t, 3, readUint16(e, t + 1, n))
							}

							function decodeArray32(e, t, r, n) {
								return toToken$1(e, t, 5, readUint32(e, t + 1, n))
							}

							function decodeArray64(e, t, r, n) {
								const o = readUint64(e, t + 1, n);
								if ("bigint" == typeof o) throw new Error(`${decodeErrPrefix} 64-bit integer array lengths not supported`);
								return toToken$1(e, t, 9, o)
							}

							function decodeArrayIndefinite(e, t, r, n) {
								if (!1 === n.allowIndefinite) throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
								return toToken$1(e, t, 1, 1 / 0)
							}

							function encodeArray(e, t) {
								encodeUintValue(e, Type.array.majorEncoded, t.value)
							}

							function toToken(e, t, r, n) {
								return new Token(Type.map, n, r)
							}

							function decodeMapCompact(e, t, r, n) {
								return toToken(e, t, 1, r)
							}

							function decodeMap8(e, t, r, n) {
								return toToken(e, t, 2, readUint8(e, t + 1, n))
							}

							function decodeMap16(e, t, r, n) {
								return toToken(e, t, 3, readUint16(e, t + 1, n))
							}

							function decodeMap32(e, t, r, n) {
								return toToken(e, t, 5, readUint32(e, t + 1, n))
							}

							function decodeMap64(e, t, r, n) {
								const o = readUint64(e, t + 1, n);
								if ("bigint" == typeof o) throw new Error(`${decodeErrPrefix} 64-bit integer map lengths not supported`);
								return toToken(e, t, 9, o)
							}

							function decodeMapIndefinite(e, t, r, n) {
								if (!1 === n.allowIndefinite) throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
								return toToken(e, t, 1, 1 / 0)
							}

							function encodeMap(e, t) {
								encodeUintValue(e, Type.map.majorEncoded, t.value)
							}

							function decodeTagCompact(e, t, r, n) {
								return new Token(Type.tag, r, 1)
							}

							function decodeTag8(e, t, r, n) {
								return new Token(Type.tag, readUint8(e, t + 1, n), 2)
							}

							function decodeTag16(e, t, r, n) {
								return new Token(Type.tag, readUint16(e, t + 1, n), 3)
							}

							function decodeTag32(e, t, r, n) {
								return new Token(Type.tag, readUint32(e, t + 1, n), 5)
							}

							function decodeTag64(e, t, r, n) {
								return new Token(Type.tag, readUint64(e, t + 1, n), 9)
							}

							function encodeTag(e, t) {
								encodeUintValue(e, Type.tag.majorEncoded, t.value)
							}
							encodeArray.compareTokens = encodeUint.compareTokens, encodeArray.encodedSize = function (e) {
								return encodeUintValue.encodedSize(e.value)
							}, encodeMap.compareTokens = encodeUint.compareTokens, encodeMap.encodedSize = function (e) {
								return encodeUintValue.encodedSize(e.value)
							}, encodeTag.compareTokens = encodeUint.compareTokens, encodeTag.encodedSize = function (e) {
								return encodeUintValue.encodedSize(e.value)
							};
							const MINOR_FALSE = 20,
								MINOR_TRUE = 21,
								MINOR_NULL = 22,
								MINOR_UNDEFINED = 23;

							function decodeUndefined(e, t, r, n) {
								if (!1 === n.allowUndefined) throw new Error(`${decodeErrPrefix} undefined values are not supported`);
								return !0 === n.coerceUndefinedToNull ? new Token(Type.null, null, 1) : new Token(Type.undefined, void 0, 1)
							}

							function decodeBreak(e, t, r, n) {
								if (!1 === n.allowIndefinite) throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
								return new Token(Type.break, void 0, 1)
							}

							function createToken(e, t, r) {
								if (r) {
									if (!1 === r.allowNaN && Number.isNaN(e)) throw new Error(`${decodeErrPrefix} NaN values are not supported`);
									if (!1 === r.allowInfinity && (e === 1 / 0 || e === -1 / 0)) throw new Error(`${decodeErrPrefix} Infinity values are not supported`)
								}
								return new Token(Type.float, e, t)
							}

							function decodeFloat16(e, t, r, n) {
								return createToken(readFloat16(e, t + 1), 3, n)
							}

							function decodeFloat32(e, t, r, n) {
								return createToken(readFloat32(e, t + 1), 5, n)
							}

							function decodeFloat64(e, t, r, n) {
								return createToken(readFloat64(e, t + 1), 9, n)
							}

							function encodeFloat(e, t, r) {
								const n = t.value;
								if (!1 === n) e.push([Type.float.majorEncoded | MINOR_FALSE]);
								else if (!0 === n) e.push([Type.float.majorEncoded | MINOR_TRUE]);
								else if (null === n) e.push([Type.float.majorEncoded | MINOR_NULL]);
								else if (void 0 === n) e.push([Type.float.majorEncoded | MINOR_UNDEFINED]);
								else {
									let t, o = !1;
									r && !0 === r.float64 || (encodeFloat16(n), t = readFloat16(ui8a, 1), n === t || Number.isNaN(n) ? (ui8a[0] = 249, e.push(ui8a.slice(0, 3)), o = !0) : (encodeFloat32(n), t = readFloat32(ui8a, 1), n === t && (ui8a[0] = 250, e.push(ui8a.slice(0, 5)), o = !0))), o || (encodeFloat64(n), t = readFloat64(ui8a, 1), ui8a[0] = 251, e.push(ui8a.slice(0, 9)))
								}
							}
							encodeFloat.encodedSize = function (e, t) {
								const r = e.value;
								if (!1 === r || !0 === r || null == r) return 1;
								if (!t || !0 !== t.float64) {
									encodeFloat16(r);
									let e = readFloat16(ui8a, 1);
									if (r === e || Number.isNaN(r)) return 3;
									if (encodeFloat32(r), e = readFloat32(ui8a, 1), r === e) return 5
								}
								return 9
							};
							const buffer = new ArrayBuffer(9),
								dataView = new DataView(buffer, 1),
								ui8a = new Uint8Array(buffer, 0);

							function encodeFloat16(e) {
								if (e === 1 / 0) dataView.setUint16(0, 31744, !1);
								else if (e === -1 / 0) dataView.setUint16(0, 64512, !1);
								else if (Number.isNaN(e)) dataView.setUint16(0, 32256, !1);
								else {
									dataView.setFloat32(0, e);
									const t = dataView.getUint32(0),
										r = (2139095040 & t) >> 23,
										n = 8388607 & t;
									if (255 === r) dataView.setUint16(0, 31744, !1);
									else if (0 === r) dataView.setUint16(0, (2147483648 & e) >> 16 | n >> 13, !1);
									else {
										const e = r - 127;
										e < -24 ? dataView.setUint16(0, 0) : e < -14 ? dataView.setUint16(0, (2147483648 & t) >> 16 | 1 << 24 + e, !1) : dataView.setUint16(0, (2147483648 & t) >> 16 | e + 15 << 10 | n >> 13, !1)
									}
								}
							}

							function readFloat16(e, t) {
								if (e.length - t < 2) throw new Error(`${decodeErrPrefix} not enough data for float16`);
								const r = (e[t] << 8) + e[t + 1];
								if (31744 === r) return 1 / 0;
								if (64512 === r) return -1 / 0;
								if (32256 === r) return NaN;
								const n = r >> 10 & 31,
									o = 1023 & r;
								let i;
								return i = 0 === n ? o * 2 ** -24 : 31 !== n ? (o + 1024) * 2 ** (n - 25) : 0 === o ? 1 / 0 : NaN, 32768 & r ? -i : i
							}

							function encodeFloat32(e) {
								dataView.setFloat32(0, e, !1)
							}

							function readFloat32(e, t) {
								if (e.length - t < 4) throw new Error(`${decodeErrPrefix} not enough data for float32`);
								const r = (e.byteOffset || 0) + t;
								return new DataView(e.buffer, r, 4).getFloat32(0, !1)
							}

							function encodeFloat64(e) {
								dataView.setFloat64(0, e, !1)
							}

							function readFloat64(e, t) {
								if (e.length - t < 8) throw new Error(`${decodeErrPrefix} not enough data for float64`);
								const r = (e.byteOffset || 0) + t;
								return new DataView(e.buffer, r, 8).getFloat64(0, !1)
							}

							function invalidMinor(e, t, r) {
								throw new Error(`${decodeErrPrefix} encountered invalid minor (${r}) for major ${e[t] >>> 5}`)
							}

							function errorer(e) {
								return () => {
									throw new Error(`${decodeErrPrefix} ${e}`)
								}
							}
							encodeFloat.compareTokens = encodeUint.compareTokens;
							const jump = [];
							for (let e = 0; e <= 23; e++) jump[e] = invalidMinor;
							jump[24] = decodeUint8, jump[25] = decodeUint16, jump[26] = decodeUint32, jump[27] = decodeUint64, jump[28] = invalidMinor, jump[29] = invalidMinor, jump[30] = invalidMinor, jump[31] = invalidMinor;
							for (let e = 32; e <= 55; e++) jump[e] = invalidMinor;
							jump[56] = decodeNegint8, jump[57] = decodeNegint16, jump[58] = decodeNegint32, jump[59] = decodeNegint64, jump[60] = invalidMinor, jump[61] = invalidMinor, jump[62] = invalidMinor, jump[63] = invalidMinor;
							for (let e = 64; e <= 87; e++) jump[e] = decodeBytesCompact;
							jump[88] = decodeBytes8, jump[89] = decodeBytes16, jump[90] = decodeBytes32, jump[91] = decodeBytes64, jump[92] = invalidMinor, jump[93] = invalidMinor, jump[94] = invalidMinor, jump[95] = errorer("indefinite length bytes/strings are not supported");
							for (let e = 96; e <= 119; e++) jump[e] = decodeStringCompact;
							jump[120] = decodeString8, jump[121] = decodeString16, jump[122] = decodeString32, jump[123] = decodeString64, jump[124] = invalidMinor, jump[125] = invalidMinor, jump[126] = invalidMinor, jump[127] = errorer("indefinite length bytes/strings are not supported");
							for (let e = 128; e <= 151; e++) jump[e] = decodeArrayCompact;
							jump[152] = decodeArray8, jump[153] = decodeArray16, jump[154] = decodeArray32, jump[155] = decodeArray64, jump[156] = invalidMinor, jump[157] = invalidMinor, jump[158] = invalidMinor, jump[159] = decodeArrayIndefinite;
							for (let e = 160; e <= 183; e++) jump[e] = decodeMapCompact;
							jump[184] = decodeMap8, jump[185] = decodeMap16, jump[186] = decodeMap32, jump[187] = decodeMap64, jump[188] = invalidMinor, jump[189] = invalidMinor, jump[190] = invalidMinor, jump[191] = decodeMapIndefinite;
							for (let e = 192; e <= 215; e++) jump[e] = decodeTagCompact;
							jump[216] = decodeTag8, jump[217] = decodeTag16, jump[218] = decodeTag32, jump[219] = decodeTag64, jump[220] = invalidMinor, jump[221] = invalidMinor, jump[222] = invalidMinor, jump[223] = invalidMinor;
							for (let e = 224; e <= 243; e++) jump[e] = errorer("simple values are not supported");
							jump[244] = invalidMinor, jump[245] = invalidMinor, jump[246] = invalidMinor, jump[247] = decodeUndefined, jump[248] = errorer("simple values are not supported"), jump[249] = decodeFloat16, jump[250] = decodeFloat32, jump[251] = decodeFloat64, jump[252] = invalidMinor, jump[253] = invalidMinor, jump[254] = invalidMinor, jump[255] = decodeBreak;
							const quick = [];
							for (let e = 0; e < 24; e++) quick[e] = new Token(Type.uint, e, 1);
							for (let e = -1; e >= -24; e--) quick[31 - e] = new Token(Type.negint, e, 1);

							function quickEncodeToken(e) {
								switch (e.type) {
									case Type.false:
										return fromArray([244]);
									case Type.true:
										return fromArray([245]);
									case Type.null:
										return fromArray([246]);
									case Type.bytes:
										return e.value.length ? void 0 : fromArray([64]);
									case Type.string:
										return "" === e.value ? fromArray([96]) : void 0;
									case Type.array:
										return 0 === e.value ? fromArray([128]) : void 0;
									case Type.map:
										return 0 === e.value ? fromArray([160]) : void 0;
									case Type.uint:
										return e.value < 24 ? fromArray([Number(e.value)]) : void 0;
									case Type.negint:
										if (e.value >= -24) return fromArray([31 - Number(e.value)])
								}
							}
							quick[64] = new Token(Type.bytes, new Uint8Array(0), 1), quick[96] = new Token(Type.string, "", 1), quick[128] = new Token(Type.array, 0, 1), quick[160] = new Token(Type.map, 0, 1), quick[244] = new Token(Type.false, !1, 1), quick[245] = new Token(Type.true, !0, 1), quick[246] = new Token(Type.null, null, 1);
							const defaultEncodeOptions$2 = {
								float64: !1,
								mapSorter: mapSorter$1,
								quickEncodeToken: quickEncodeToken
							};

							function makeCborEncoders() {
								const e = [];
								return e[Type.uint.major] = encodeUint, e[Type.negint.major] = encodeNegint, e[Type.bytes.major] = encodeBytes, e[Type.string.major] = encodeString, e[Type.array.major] = encodeArray, e[Type.map.major] = encodeMap, e[Type.tag.major] = encodeTag, e[Type.float.major] = encodeFloat, e
							}
							const cborEncoders$1 = makeCborEncoders(),
								buf = new Bl;
							class Ref {
								constructor(e, t) {
									this.obj = e, this.parent = t
								}
								includes(e) {
									let t = this;
									do {
										if (t.obj === e) return !0
									} while (t = t.parent);
									return !1
								}
								static createCheck(e, t) {
									if (e && e.includes(t)) throw new Error(`${encodeErrPrefix} object contains circular references`);
									return new Ref(t, e)
								}
							}
							const simpleTokens = {
								null: new Token(Type.null, null),
								undefined: new Token(Type.undefined, void 0),
								true: new Token(Type.true, !0),
								false: new Token(Type.false, !1),
								emptyArray: new Token(Type.array, 0),
								emptyMap: new Token(Type.map, 0)
							},
								typeEncoders = {
									number: (e) => Number.isInteger(e) && Number.isSafeInteger(e) ? new Token(e >= 0 ? Type.uint : Type.negint, e) : new Token(Type.float, e),
									bigint: (e) => e >= BigInt(0) ? new Token(Type.uint, e) : new Token(Type.negint, e),
									Uint8Array: (e) => new Token(Type.bytes, e),
									string: (e) => new Token(Type.string, e),
									boolean: (e) => e ? simpleTokens.true : simpleTokens.false,
									null: () => simpleTokens.null,
									undefined: () => simpleTokens.undefined,
									ArrayBuffer: (e) => new Token(Type.bytes, new Uint8Array(e)),
									DataView: (e) => new Token(Type.bytes, new Uint8Array(e.buffer, e.byteOffset, e.byteLength)),
									Array(e, r, n) {
										if (!e.length) return !0 === r.addBreakTokens ? [simpleTokens.emptyArray, new Token(Type.break)] : simpleTokens.emptyArray;
										n = Ref.createCheck(n, e);
										const o = [];
										let i = 0;
										for (const t of e) o[i++] = objectToTokens(t, r, n);
										return r.addBreakTokens ? [new Token(Type.array, e.length), o, new Token(Type.break)] : [new Token(Type.array, e.length), o]
									},
									Object(e, t, r, n) {
										const o = "Object" !== t,
											i = o ? e.keys() : Object.keys(e),
											s = o ? e.size : i.length;
										if (!s) return !0 === r.addBreakTokens ? [simpleTokens.emptyMap, new Token(Type.break)] : simpleTokens.emptyMap;
										n = Ref.createCheck(n, e);
										const a = [];
										let c = 0;
										for (const t of i) a[c++] = [objectToTokens(t, r, n), objectToTokens(o ? e.get(t) : e[t], r, n)];
										return sortMapEntries(a, r), r.addBreakTokens ? [new Token(Type.map, s), a, new Token(Type.break)] : [new Token(Type.map, s), a]
									}
								};
							typeEncoders.Map = typeEncoders.Object, typeEncoders.Buffer = typeEncoders.Uint8Array;
							for (const e of "Uint8Clamped Uint16 Uint32 Int8 Int16 Int32 BigUint64 BigInt64 Float32 Float64".split(" ")) typeEncoders[`${e}Array`] = typeEncoders.DataView;

							function objectToTokens(e, t = {}, r) {
								const n = is(e),
									o = t && t.typeEncoders && t.typeEncoders[n] || typeEncoders[n];
								if ("function" == typeof o) {
									const i = o(e, n, t, r);
									if (null != i) return i
								}
								const i = typeEncoders[n];
								if (!i) throw new Error(`${encodeErrPrefix} unsupported type: ${n}`);
								return i(e, n, t, r)
							}

							function sortMapEntries(e, t) {
								t.mapSorter && e.sort(t.mapSorter)
							}

							function mapSorter$1(e, t) {
								const r = Array.isArray(e[0]) ? e[0][0] : e[0],
									n = Array.isArray(t[0]) ? t[0][0] : t[0];
								if (r.type !== n.type) return r.type.compare(n.type);
								const o = r.type.major,
									i = cborEncoders$1[o].compareTokens(r, n);
								return 0 === i && console.warn("WARNING: complex key types used, CBOR key sorting guarantees are gone"), i
							}

							function tokensToEncoded(e, t, r, n) {
								if (Array.isArray(t))
									for (const o of t) tokensToEncoded(e, o, r, n);
								else r[t.type.major](e, t, n)
							}

							function encodeCustom(e, t, r) {
								const n = objectToTokens(e, r);
								if (!Array.isArray(n) && r.quickEncodeToken) {
									const e = r.quickEncodeToken(n);
									if (e) return e;
									const o = t[n.type.major];
									if (o.encodedSize) {
										const e = o.encodedSize(n, r),
											t = new Bl(e);
										if (o(t, n, r), 1 !== t.chunks.length) throw new Error(`Unexpected error: pre-calculated length for ${n} was wrong`);
										return asU8A(t.chunks[0])
									}
								}
								return buf.reset(), tokensToEncoded(buf, n, t, r), buf.toBytes(!0)
							}

							function encode$f(e, t) {
								return t = Object.assign({}, defaultEncodeOptions$2, t), encodeCustom(e, cborEncoders$1, t)
							}
							const defaultDecodeOptions = {
								strict: !1,
								allowIndefinite: !0,
								allowUndefined: !0,
								allowBigInt: !0
							};
							class Tokeniser {
								constructor(e, t = {}) {
									this.pos = 0, this.data = e, this.options = t
								}
								done() {
									return this.pos >= this.data.length
								}
								next() {
									const e = this.data[this.pos];
									let t = quick[e];
									if (void 0 === t) {
										const r = jump[e];
										if (!r) throw new Error(`${decodeErrPrefix} no decoder for major type ${e >>> 5} (byte 0x${e.toString(16).padStart(2, "0")})`);
										const n = 31 & e;
										t = r(this.data, this.pos, n, this.options)
									}
									return this.pos += t.encodedLength, t
								}
							}
							const DONE = Symbol.for("DONE"),
								BREAK = Symbol.for("BREAK");

							function tokenToArray(e, t, r) {
								const n = [];
								for (let o = 0; o < e.value; o++) {
									const i = tokensToObject(t, r);
									if (i === BREAK) {
										if (e.value === 1 / 0) break;
										throw new Error(`${decodeErrPrefix} got unexpected break to lengthed array`)
									}
									if (i === DONE) throw new Error(`${decodeErrPrefix} found array but not enough entries (got ${o}, expected ${e.value})`);
									n[o] = i
								}
								return n
							}

							function tokenToMap(e, t, r) {
								const n = !0 === r.useMaps,
									o = n ? void 0 : {},
									i = n ? new Map : void 0;
								for (let s = 0; s < e.value; s++) {
									const a = tokensToObject(t, r);
									if (a === BREAK) {
										if (e.value === 1 / 0) break;
										throw new Error(`${decodeErrPrefix} got unexpected break to lengthed map`)
									}
									if (a === DONE) throw new Error(`${decodeErrPrefix} found map but not enough entries (got ${s} [no key], expected ${e.value})`);
									if (!0 !== n && "string" != typeof a) throw new Error(`${decodeErrPrefix} non-string keys not supported (got ${typeof a})`);
									const c = tokensToObject(t, r);
									if (c === DONE) throw new Error(`${decodeErrPrefix} found map but not enough entries (got ${s} [no value], expected ${e.value})`);
									n ? i.set(a, c) : o[a] = c
								}
								return n ? i : o
							}

							function tokensToObject(e, t) {
								if (e.done()) return DONE;
								const r = e.next();
								if (r.type === Type.break) return BREAK;
								if (r.type.terminal) return r.value;
								if (r.type === Type.array) return tokenToArray(r, e, t);
								if (r.type === Type.map) return tokenToMap(r, e, t);
								if (r.type === Type.tag) {
									if (t.tags && "function" == typeof t.tags[r.value]) {
										const n = tokensToObject(e, t);
										return t.tags[r.value](n)
									}
									throw new Error(`${decodeErrPrefix} tag not supported (${r.value})`)
								}
								throw new Error("unsupported")
							}

							function decode$g(e, t) {
								if (!(e instanceof Uint8Array)) throw new Error(`${decodeErrPrefix} data to decode must be a Uint8Array`);
								const r = (t = Object.assign({}, defaultDecodeOptions, t)).tokenizer || new Tokeniser(e, t),
									n = tokensToObject(r, t);
								if (n === DONE) throw new Error(`${decodeErrPrefix} did not find any content to decode`);
								if (n === BREAK) throw new Error(`${decodeErrPrefix} got unexpected break`);
								if (!r.done()) throw new Error(`${decodeErrPrefix} too many terminals, data makes no sense`);
								return n
							}
							const CID_CBOR_TAG = 42;

							function cidEncoder$1(e) {
								if (e.asCID !== e) return null;
								const t = CID.asCID(e);
								if (!t) return null;
								const r = new Uint8Array(t.bytes.byteLength + 1);
								return r.set(t.bytes, 1), [new Token(Type.tag, CID_CBOR_TAG), new Token(Type.bytes, r)]
							}

							function undefinedEncoder$1() {
								throw new Error("`undefined` is not supported by the IPLD Data Model and cannot be encoded")
							}

							function numberEncoder$1(e) {
								if (Number.isNaN(e)) throw new Error("`NaN` is not supported by the IPLD Data Model and cannot be encoded");
								if (e === 1 / 0 || e === -1 / 0) throw new Error("`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded");
								return null
							}
							const encodeOptions$1 = {
								float64: !0,
								typeEncoders: {
									Object: cidEncoder$1,
									undefined: undefinedEncoder$1,
									number: numberEncoder$1
								}
							};

							function cidDecoder(e) {
								if (0 !== e[0]) throw new Error("Invalid CID for CBOR tag 42; expected leading 0x00");
								return CID.decode(e.subarray(1))
							}
							const decodeOptions$1 = {
								allowIndefinite: !1,
								coerceUndefinedToNull: !0,
								allowNaN: !1,
								allowInfinity: !1,
								allowBigInt: !0,
								strict: !0,
								useMaps: !1,
								tags: []
							};
							decodeOptions$1.tags[CID_CBOR_TAG] = cidDecoder;
							const code$7 = 113,
								encode$e = e => encode$f(e, encodeOptions$1),
								decode$f = e => decode$g(e, decodeOptions$1),
								sha = e => async t => new Uint8Array(await crypto.subtle.digest(e, t)), sha256 = from$1({
									name: "sha2-256",
									code: 18,
									encode: sha("SHA-256")
								});
							from$1({
								name: "sha2-512",
								code: 19,
								encode: sha("SHA-512")
							});
							const encoder = new TextEncoder,
								decoder = new TextDecoder,
								encode$d = e => encoder.encode(e),
								decode$e = e => decoder.decode(e);
							class JSONEncoder extends Array {
								constructor() {
									super(), this.inRecursive = []
								}
								prefix(e) {
									const t = this.inRecursive[this.inRecursive.length - 1];
									t && (t.type === Type.array && (t.elements++, 1 !== t.elements && e.push([44])), t.type === Type.map && (t.elements++, 1 !== t.elements && (t.elements % 2 == 1 ? e.push([44]) : e.push([58]))))
								} [Type.uint.major](e, t) {
									this.prefix(e);
									const r = String(t.value),
										n = [];
									for (let e = 0; e < r.length; e++) n[e] = r.charCodeAt(e);
									e.push(n)
								} [Type.negint.major](e, t) {
									this[Type.uint.major](e, t)
								} [Type.bytes.major]() {
									throw new Error(`${encodeErrPrefix} unsupported type: Uint8Array`)
								} [Type.string.major](e, t) {
									this.prefix(e);
									const r = fromString(JSON.stringify(t.value));
									e.push(r.length > 32 ? asU8A(r) : r)
								} [Type.array.major](e) {
									this.prefix(e), this.inRecursive.push({
										type: Type.array,
										elements: 0
									}), e.push([91])
								} [Type.map.major](e) {
									this.prefix(e), this.inRecursive.push({
										type: Type.map,
										elements: 0
									}), e.push([123])
								} [Type.tag.major]() { } [Type.float.major](e, t) {
									if ("break" === t.type.name) {
										const t = this.inRecursive.pop();
										if (t) {
											if (t.type === Type.array) e.push([93]);
											else {
												if (t.type !== Type.map) throw new Error("Unexpected recursive type; this should not happen!");
												e.push([125])
											}
											return
										}
										throw new Error("Unexpected break; this should not happen!")
									}
									if (void 0 === t.value) throw new Error(`${encodeErrPrefix} unsupported type: undefined`);
									if (this.prefix(e), "true" === t.type.name) return void e.push([116, 114, 117, 101]);
									if ("false" === t.type.name) return void e.push([102, 97, 108, 115, 101]);
									if ("null" === t.type.name) return void e.push([110, 117, 108, 108]);
									const r = String(t.value),
										n = [];
									let o = !1;
									for (let e = 0; e < r.length; e++) n[e] = r.charCodeAt(e), o || 46 !== n[e] && 101 !== n[e] && 69 !== n[e] || (o = !0);
									o || (n.push(46), n.push(48)), e.push(n)
								}
							}

							function mapSorter(e, t) {
								if (Array.isArray(e[0]) || Array.isArray(t[0])) throw new Error(`${encodeErrPrefix} complex map keys are not supported`);
								const r = e[0],
									n = t[0];
								if (r.type !== Type.string || n.type !== Type.string) throw new Error(`${encodeErrPrefix} non-string map keys are not supported`);
								if (r < n) return -1;
								if (r > n) return 1;
								throw new Error(`${encodeErrPrefix} unexpected duplicate map keys, this is not supported`)
							}
							const defaultEncodeOptions$1 = {
								addBreakTokens: !0,
								mapSorter: mapSorter
							};

							function encode$c(e, t) {
								return t = Object.assign({}, defaultEncodeOptions$1, t), encodeCustom(e, new JSONEncoder, t)
							}
							class Tokenizer {
								constructor(e, t = {}) {
									this.pos = 0, this.data = e, this.options = t, this.modeStack = ["value"], this.lastToken = ""
								}
								done() {
									return this.pos >= this.data.length
								}
								ch() {
									return this.data[this.pos]
								}
								currentMode() {
									return this.modeStack[this.modeStack.length - 1]
								}
								skipWhitespace() {
									let e = this.ch();
									for (; 32 === e || 9 === e || 13 === e || 10 === e;) e = this.data[++this.pos]
								}
								expect(e) {
									if (this.data.length - this.pos < e.length) throw new Error(`${decodeErrPrefix} unexpected end of input at position ${this.pos}`);
									for (let t = 0; t < e.length; t++)
										if (this.data[this.pos++] !== e[t]) throw new Error(`${decodeErrPrefix} unexpected token at position ${this.pos}, expected to find '${String.fromCharCode(...e)}'`)
								}
								parseNumber() {
									const e = this.pos;
									let t = !1,
										r = !1;
									const n = e => {
										for (; !this.done();) {
											const t = this.ch();
											if (!e.includes(t)) break;
											this.pos++
										}
									};
									if (45 === this.ch() && (t = !0, this.pos++), 48 === this.ch()) {
										if (this.pos++, 46 !== this.ch()) return new Token(Type.uint, 0, this.pos - e);
										this.pos++, r = !0
									}
									if (n([48, 49, 50, 51, 52, 53, 54, 55, 56, 57]), t && this.pos === e + 1) throw new Error(`${decodeErrPrefix} unexpected token at position ${this.pos}`);
									if (!this.done() && 46 === this.ch()) {
										if (r) throw new Error(`${decodeErrPrefix} unexpected token at position ${this.pos}`);
										r = !0, this.pos++, n([48, 49, 50, 51, 52, 53, 54, 55, 56, 57])
									}
									this.done() || 101 !== this.ch() && 69 !== this.ch() || (r = !0, this.pos++, this.done() || 43 !== this.ch() && 45 !== this.ch() || this.pos++, n([48, 49, 50, 51, 52, 53, 54, 55, 56, 57]));
									const o = String.fromCharCode.apply(null, this.data.subarray(e, this.pos)),
										i = parseFloat(o);
									return r ? new Token(Type.float, i, this.pos - e) : !0 !== this.options.allowBigInt || Number.isSafeInteger(i) ? new Token(i >= 0 ? Type.uint : Type.negint, i, this.pos - e) : new Token(i >= 0 ? Type.uint : Type.negint, BigInt(o), this.pos - e)
								}
								parseString() {
									if (34 !== this.ch()) throw new Error(`${decodeErrPrefix} unexpected character at position ${this.pos}; this shouldn't happen`);
									this.pos++;
									for (let e = this.pos, t = 0; e < this.data.length && t < 65536; e++, t++) {
										const r = this.data[e];
										if (92 === r || r < 32 || r >= 128) break;
										if (34 === r) {
											const r = String.fromCharCode.apply(null, this.data.subarray(this.pos, e));
											return this.pos = e + 1, new Token(Type.string, r, t)
										}
									}
									const e = this.pos,
										t = [],
										r = () => {
											if (this.pos + 4 >= this.data.length) throw new Error(`${decodeErrPrefix} unexpected end of unicode escape sequence at position ${this.pos}`);
											let e = 0;
											for (let t = 0; t < 4; t++) {
												let t = this.ch();
												if (t >= 48 && t <= 57) t -= 48;
												else if (t >= 97 && t <= 102) t = t - 97 + 10;
												else {
													if (!(t >= 65 && t <= 70)) throw new Error(`${decodeErrPrefix} unexpected unicode escape character at position ${this.pos}`);
													t = t - 65 + 10
												}
												e = 16 * e + t, this.pos++
											}
											return e
										},
										n = () => {
											const e = this.ch();
											let r, n, o, i, s = null,
												a = e > 239 ? 4 : e > 223 ? 3 : e > 191 ? 2 : 1;
											if (this.pos + a > this.data.length) throw new Error(`${decodeErrPrefix} unexpected unicode sequence at position ${this.pos}`);
											switch (a) {
												case 1:
													e < 128 && (s = e);
													break;
												case 2:
													r = this.data[this.pos + 1], 128 == (192 & r) && (i = (31 & e) << 6 | 63 & r, i > 127 && (s = i));
													break;
												case 3:
													r = this.data[this.pos + 1], n = this.data[this.pos + 2], 128 == (192 & r) && 128 == (192 & n) && (i = (15 & e) << 12 | (63 & r) << 6 | 63 & n, i > 2047 && (i < 55296 || i > 57343) && (s = i));
													break;
												case 4:
													r = this.data[this.pos + 1], n = this.data[this.pos + 2], o = this.data[this.pos + 3], 128 == (192 & r) && 128 == (192 & n) && 128 == (192 & o) && (i = (15 & e) << 18 | (63 & r) << 12 | (63 & n) << 6 | 63 & o, i > 65535 && i < 1114112 && (s = i))
											}
											null === s ? (s = 65533, a = 1) : s > 65535 && (s -= 65536, t.push(s >>> 10 & 1023 | 55296), s = 56320 | 1023 & s), t.push(s), this.pos += a
										};
									for (; !this.done();) {
										const o = this.ch();
										let i;
										switch (o) {
											case 92:
												if (this.pos++, this.done()) throw new Error(`${decodeErrPrefix} unexpected string termination at position ${this.pos}`);
												switch (i = this.ch(), this.pos++, i) {
													case 34:
													case 39:
													case 92:
													case 47:
														t.push(i);
														break;
													case 98:
														t.push(8);
														break;
													case 116:
														t.push(9);
														break;
													case 110:
														t.push(10);
														break;
													case 102:
														t.push(12);
														break;
													case 114:
														t.push(13);
														break;
													case 117:
														t.push(r());
														break;
													default:
														throw new Error(`${decodeErrPrefix} unexpected string escape character at position ${this.pos}`)
												}
												break;
											case 34:
												return this.pos++, new Token(Type.string, decodeCodePointsArray(t), this.pos - e);
											default:
												if (o < 32) throw new Error(`${decodeErrPrefix} invalid control character at position ${this.pos}`);
												o < 128 ? (t.push(o), this.pos++) : n()
										}
									}
									throw new Error(`${decodeErrPrefix} unexpected end of string at position ${this.pos}`)
								}
								parseValue() {
									switch (this.ch()) {
										case 123:
											return this.modeStack.push("obj-start"), this.pos++, new Token(Type.map, 1 / 0, 1);
										case 91:
											return this.modeStack.push("array-start"), this.pos++, new Token(Type.array, 1 / 0, 1);
										case 34:
											return this.parseString();
										case 110:
											return this.expect([110, 117, 108, 108]), new Token(Type.null, null, 4);
										case 102:
											return this.expect([102, 97, 108, 115, 101]), new Token(Type.false, !1, 5);
										case 116:
											return this.expect([116, 114, 117, 101]), new Token(Type.true, !0, 4);
										case 45:
										case 48:
										case 49:
										case 50:
										case 51:
										case 52:
										case 53:
										case 54:
										case 55:
										case 56:
										case 57:
											return this.parseNumber();
										default:
											throw new Error(`${decodeErrPrefix} unexpected character at position ${this.pos}`)
									}
								}
								next() {
									switch (this.skipWhitespace(), this.currentMode()) {
										case "value":
											return this.modeStack.pop(), this.parseValue();
										case "array-value":
											if (this.modeStack.pop(), 93 === this.ch()) return this.pos++, this.skipWhitespace(), new Token(Type.break, void 0, 1);
											if (44 !== this.ch()) throw new Error(`${decodeErrPrefix} unexpected character at position ${this.pos}, was expecting array delimiter but found '${String.fromCharCode(this.ch())}'`);
											return this.pos++, this.modeStack.push("array-value"), this.skipWhitespace(), this.parseValue();
										case "array-start":
											return this.modeStack.pop(), 93 === this.ch() ? (this.pos++, this.skipWhitespace(), new Token(Type.break, void 0, 1)) : (this.modeStack.push("array-value"), this.skipWhitespace(), this.parseValue());
										case "obj-key":
											if (125 === this.ch()) return this.modeStack.pop(), this.pos++, this.skipWhitespace(), new Token(Type.break, void 0, 1);
											if (44 !== this.ch()) throw new Error(`${decodeErrPrefix} unexpected character at position ${this.pos}, was expecting object delimiter but found '${String.fromCharCode(this.ch())}'`);
											this.pos++, this.skipWhitespace();
										case "obj-start": {
											if (this.modeStack.pop(), 125 === this.ch()) return this.pos++, this.skipWhitespace(), new Token(Type.break, void 0, 1);
											const e = this.parseString();
											if (this.skipWhitespace(), 58 !== this.ch()) throw new Error(`${decodeErrPrefix} unexpected character at position ${this.pos}, was expecting key/value delimiter ':' but found '${String.fromCharCode(this.ch())}'`);
											return this.pos++, this.modeStack.push("obj-value"), e
										}
										case "obj-value":
											return this.modeStack.pop(), this.modeStack.push("obj-key"), this.skipWhitespace(), this.parseValue();
										default:
											throw new Error(`${decodeErrPrefix} unexpected parse state at position ${this.pos}; this shouldn't happen`)
									}
								}
							}

							function decode$d(e, t) {
								return decode$g(e, t = Object.assign({
									tokenizer: new Tokenizer(e, t)
								}, t))
							}

							function cidEncoder(e) {
								if (e.asCID !== e) return null;
								const t = CID.asCID(e);
								if (!t) return null;
								const r = t.toString();
								return [new Token(Type.map, 1 / 0, 1), new Token(Type.string, "/", 1), new Token(Type.string, r, r.length), new Token(Type.break, void 0, 1)]
							}

							function bytesEncoder(e) {
								const t = base64$2.encode(e).slice(1);
								return [new Token(Type.map, 1 / 0, 1), new Token(Type.string, "/", 1), new Token(Type.map, 1 / 0, 1), new Token(Type.string, "bytes", 5), new Token(Type.string, t, t.length), new Token(Type.break, void 0, 1), new Token(Type.break, void 0, 1)]
							}

							function undefinedEncoder() {
								throw new Error("`undefined` is not supported by the IPLD Data Model and cannot be encoded")
							}

							function numberEncoder(e) {
								if (Number.isNaN(e)) throw new Error("`NaN` is not supported by the IPLD Data Model and cannot be encoded");
								if (e === 1 / 0 || e === -1 / 0) throw new Error("`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded");
								return null
							}
							const encodeOptions = {
								typeEncoders: {
									Object: cidEncoder,
									Uint8Array: bytesEncoder,
									Buffer: bytesEncoder,
									undefined: undefinedEncoder,
									number: numberEncoder
								}
							};
							class DagJsonTokenizer extends Tokenizer {
								constructor(e, t) {
									super(e, t), this.tokenBuffer = []
								}
								done() {
									return 0 === this.tokenBuffer.length && super.done()
								}
								_next() {
									return this.tokenBuffer.length > 0 ? this.tokenBuffer.pop() : super.next()
								}
								next() {
									const e = this._next();
									if (e.type === Type.map) {
										const e = this._next();
										if (e.type === Type.string && "/" === e.value) {
											const e = this._next();
											if (e.type === Type.string) {
												if (this._next().type !== Type.break) throw new Error("Invalid encoded CID form");
												return this.tokenBuffer.push(e), new Token(Type.tag, 42, 0)
											}
											if (e.type === Type.map) {
												const e = this._next();
												if (e.type === Type.string && "bytes" === e.value) {
													const e = this._next();
													if (e.type === Type.string) {
														for (let e = 0; e < 2; e++)
															if (this._next().type !== Type.break) throw new Error("Invalid encoded Bytes form");
														const t = base64$2.decode(`m${e.value}`);
														return new Token(Type.bytes, t, e.value.length)
													}
													this.tokenBuffer.push(e)
												}
												this.tokenBuffer.push(e)
											}
											this.tokenBuffer.push(e)
										}
										this.tokenBuffer.push(e)
									}
									return e
								}
							}
							const decodeOptions = {
								allowIndefinite: !1,
								allowUndefined: !1,
								allowNaN: !1,
								allowInfinity: !1,
								allowBigInt: !0,
								strict: !0,
								useMaps: !1,
								tags: []
							};
							decodeOptions.tags[42] = CID.parse;
							const encode$b = e => encode$c(e, encodeOptions),
								decode$c = e => decode$d(e, Object.assign(decodeOptions, {
									tokenizer: new DagJsonTokenizer(e, decodeOptions)
								})),
								code$6 = 0,
								name$3 = "identity",
								encode$a = coerce,
								digest = e => create$7(code$6, encode$a(e)),
								identity = {
									code: code$6,
									name: name$3,
									encode: encode$a,
									digest: digest
								},
								name$2 = "raw",
								code$5 = 85,
								encode$9 = e => coerce(e),
								decode$b = e => coerce(e);
							var raw = Object.freeze({
								__proto__: null,
								name: name$2,
								code: code$5,
								encode: encode$9,
								decode: decode$b
							});
							const parse$2 = e => {
								const t = e.split("."),
									[r, n, o] = 3 === t.length ? t : ParseError.throw(`Can't parse UCAN: ${e}: Expected JWT format: 3 dot-separated base64url-encoded values.`);
								return {
									...parseHeader(r),
									...parsePayload(n),
									signature: base64url.baseDecode(o)
								}
							},
								parseHeader = e => {
									const {
										ucv: t,
										alg: r,
										typ: n
									} = decode$c(base64url.baseDecode(e));
									return parseJWT(n), parseAlgorithm(r), {
										version: parseVersion(t, "ucv")
									}
								},
								parsePayload = e => {
									const t = decode$c(base64url.baseDecode(e));
									return {
										issuer: parseDID$2(t.iss, "iss"),
										audience: parseDID$2(t.aud, "aud"),
										expiration: parseInt$1(t.exp, "exp"),
										nonce: parseOptionalString(t.nnc, "nnc"),
										notBefore: parseOptionalInt(t.nbf, "nbf"),
										facts: parseOptionalArray(t.fct, parseFact, "fct") || [],
										proofs: parseProofs(t.prf, "prf"),
										capabilities: parseCapabilities(t.att, "att")
									}
								},
								parseInt$1 = (e, t) => Number.isInteger(e) ? e : ParseError.throw(`Expected integer but instead got '${t}: ${JSON.stringify(e)}'`),
								parseCapability = (e, t) => parseStruct(e, asCapability, t),
								parseCapabilities = (e, t) => parseArray(e, parseCapability, t),
								asCapability = e => {
									const t = {
										...e,
										can: parseAbility(e.can),
										with: parseResource(e.with)
									},
										r = t.with;
									return r.endsWith("*") && "*" !== t.can && (r.startsWith("my:") || r.startsWith("as:did:")) ? ParseError.throw(`Capability has invalid 'can: ${JSON.stringify(e.can)}', for all 'my:*' or 'as:<did>:*' it must be '*'.`) : t
								},
								parseAbility = e => "string" != typeof e ? ParseError.throw(`Capability has invalid 'can: ${JSON.stringify(e)}', value must be a string`) : e.slice(1, -1).includes("/") ? e.toLocaleLowerCase() : "*" === e ? e : ParseError.throw(`Capability has invalid 'can: "${e}"', value must have at least one path segment`),
								parseResource = e => "string" != typeof e ? ParseError.throw(`Capability has invalid 'with: ${JSON.stringify(e)}', value must be a string`) : parseURL(e) || ParseError.throw(`Capability has invalid 'with: "${e}"', value must be a valid URI string`),
								parseURL = e => {
									try {
										return new URL(e), e
									} catch (e) {
										return null
									}
								},
								parseArray = (e, t, r) => Array.isArray(e) ? e.map(((e, n) => t(e, `${r}[${n}]`))) : ParseError.throw(`${r} must be an array`),
								parseOptionalArray = (e, t, r) => void 0 === e ? e : parseArray(e, t, r),
								parseStruct = (e, t, r) => null != e && "object" == typeof e ? t(e) : ParseError.throw(`${r} must be of type object, instead got ${e}`),
								parseFact = (e, t) => parseStruct(e, Object, t),
								parseProofs = (e, t) => Array.isArray(e) ? parseArray(e, parseProof$1, t) : [parseProof$1(e, t)],
								parseProof$1 = (e, t) => {
									const r = "string" == typeof e ? e : ParseError.throw(`${t} has invalid value ${JSON.stringify(e)}, must be a string`);
									try {
										return CID.parse(r)
									} catch (e) {
										return CID.create(1, code$5, identity.digest(encode$d(r)))
									}
								},
								parseDID$2 = (e, t) => "string" == typeof e && e.startsWith("did:") ? parse$4(e) : ParseError.throw(`DID has invalid representation '${t}: ${JSON.stringify(e)}'`),
								parseOptionalString = (e, t = "Field") => {
									switch (typeof e) {
										case "string":
										case "undefined":
											return e;
										default:
											return ParseError.throw(`${t} has invalid value ${e}`)
									}
								},
								parseOptionalInt = (e, t) => {
									switch (typeof e) {
										case "undefined":
											return;
										case "number":
											return parseInt$1(e, t);
										default:
											return ParseError.throw(`${t} has invalid value ${JSON.stringify(e)}`)
									}
								},
								parseVersion = (e, t) => /\d+\.\d+\.\d+/.test(e) ? e : ParseError.throw(`Invalid version '${t}: ${JSON.stringify(e)}'`),
								parseBytes = (e, t) => e instanceof Uint8Array ? e : ParseError.throw(`${t} must be Uint8Array, instead got ${JSON.stringify(e)}`),
								parseJWT = e => "JWT" === e ? e : ParseError.throw(`Header has invalid type 'typ: "${e}"'`),
								parseAlgorithm = e => {
									switch (e) {
										case "EdDSA":
											return 237;
										case "RS256":
											return 4613;
										default:
											return ParseError.throw(`Header has invalid algorithm 'alg: ${JSON.stringify(e)}'`)
									}
								};
							class ParseError extends TypeError {
								get name() {
									return "ParseError"
								}
								static
									throw(e) {
									throw new this(e)
								}
							}
							class View$1 {
								constructor(e) {
									this.model = e
								}
								get version() {
									return this.model.version
								}
								get issuer() {
									return from(this.model.issuer)
								}
								get audience() {
									return from(this.model.audience)
								}
								get capabilities() {
									return this.model.capabilities
								}
								get expiration() {
									return this.model.expiration
								}
								get notBefore() {
									return this.model.notBefore
								}
								get nonce() {
									return this.model.nonce
								}
								get facts() {
									return this.model.facts
								}
								get proofs() {
									return this.model.proofs
								}
								get signature() {
									return this.model.signature
								}
							}
							class JWTView extends Uint8Array {
								constructor(e, {
									buffer: t,
									byteOffset: r = 0,
									byteLength: n = t.byteLength
								}) {
									super(t, r, n), this.model = e
								}
								get version() {
									return this.model.version
								}
								get issuer() {
									return from(this.model.issuer)
								}
								get audience() {
									return from(this.model.audience)
								}
								get capabilities() {
									return this.model.capabilities
								}
								get expiration() {
									return this.model.expiration
								}
								get notBefore() {
									return this.model.notBefore
								}
								get nonce() {
									return this.model.nonce
								}
								get facts() {
									return this.model.facts
								}
								get proofs() {
									return this.model.proofs
								}
								get signature() {
									return this.model.signature
								}
							}
							const cbor = e => new View$1(e),
								jwt = (e, t) => new JWTView(e, t),
								code$4 = code$7,
								encode$8 = e => {
									const {
										facts: t,
										nonce: r,
										notBefore: n,
										...o
									} = match$2(e);
									return encode$e({
										...o,
										...t.length > 0 && {
											facts: t
										},
										...e.nonce && {
											nonce: r
										},
										...e.notBefore && {
											notBefore: e.notBefore
										},
										signature: parseBytes(e.signature, "signature")
									})
								},
								decode$a = e => cbor(match$2(decode$f(e))),
								match$2 = e => ({
									version: parseVersion(e.version, "version"),
									issuer: parseDID$1(e.issuer, "issuer"),
									audience: parseDID$1(e.audience, "audience"),
									capabilities: parseCapabilities(e.capabilities, "capabilities"),
									expiration: parseInt$1(e.expiration, "expiration"),
									proofs: parseOptionalArray(e.proofs, parseProof, "proofs") || [],
									signature: parseBytes(e.signature, "signature"),
									nonce: parseOptionalString(e.nonce, "nonce"),
									facts: parseOptionalArray(e.facts, parseFact, "facts") || [],
									notBefore: parseOptionalInt(e.notBefore, "notBefore")
								}),
								parseProof = (e, t) => CID.asCID(e) || ParseError.throw(`Expected ${t} to be CID, instead got ${JSON.stringify(e)}`),
								parseDID$1 = (e, t) => e instanceof Uint8Array ? decode$i(e) : ParseError.throw(`Expected ${t} to be Uint8Array, instead got ${JSON.stringify(e)}`),
								code$3 = code$5,
								encode$7 = e => new Uint8Array(e.buffer, e.byteOffset, e.byteLength),
								format$1 = e => `${formatHeader(e)}.${formatPayload(e)}.${formatSignature(e.signature)}`,
								formatSignPayload = e => `${formatHeader(e)}.${formatPayload(e)}`,
								formatHeader = e => base64url.baseEncode(encodeHeader(e)),
								formatPayload = e => base64url.baseEncode(encodePayload(e)),
								formatSignature = e => base64url.baseEncode(e),
								encodeHeader = e => encode$b({
									alg: encodeAgorithm(e),
									ucv: e.version,
									typ: "JWT"
								}),
								encodePayload = e => encode$b({
									iss: format$3(e.issuer),
									aud: format$3(e.audience),
									att: e.capabilities,
									exp: e.expiration,
									prf: e.proofs.map(encodeProof),
									...e.facts.length > 0 && {
										fct: e.facts
									},
									...e.nonce && {
										nnc: e.nonce
									},
									...e.notBefore && {
										nbf: e.notBefore
									}
								}),
								encodeProof = e => e.toString(),
								encodeAgorithm = e => {
									switch (algorithm(e.issuer)) {
										case ED25519:
											return "EdDSA";
										case RSA:
											return "RS256";
										default:
											throw new RangeError(`Unknown KeyType "${algorithm(e.issuer)}"`)
									}
								},
								VERSION = "0.8.1",
								decode$9 = e => {
									try {
										return decode$a(e)
									} catch (t) {
										const r = decode$e(e);
										return parse$1(r)
									}
								},
								write$6 = async (e, t) => {
									const r = t?.hasher || sha256,
										[n, o] = e instanceof Uint8Array ? [code$3, encode$7(e)] : [code$4, encode$8(e)];
									return {
										cid: CID.createV1(n, await r.digest(o)),
										bytes: o,
										data: e
									}
								}, parse$1 = e => {
									const t = parse$2(e);
									return format$1(t) === e ? cbor(t) : jwt(t, encode$d(e))
								}, issue = async ({
									issuer: e,
									audience: t,
									capabilities: r,
									lifetimeInSeconds: n = 30,
									expiration: o = Math.floor(Date.now() / 1e3) + n,
									notBefore: i,
									facts: s = [],
									proofs: a = [],
									nonce: c
								}) => {
									const u = match$2({
										version: VERSION,
										issuer: parseDID(e, "issuer"),
										audience: parseDID(t, "audience"),
										capabilities: r,
										facts: s,
										expiration: o,
										notBefore: i,
										proofs: a,
										nonce: c,
										signature: EMPTY$4
									}),
										d = encode$d(formatSignPayload(u)),
										l = await e.sign(d);
									return cbor({
										...u,
										signature: l
									})
								}, parseDID = (e, t) => e && "function" == typeof e.did ? parseDID$2(e.did(), `${t}.did()`) : ParseError.throw(`The ${t}.did() must be a function that returns DID`), EMPTY$4 = new Uint8Array, create$6 = (e, t) => CID.createV1(e, t), isLink = e => null != e && e.asCID === e, asLink$1 = CID.asCID;
							CID.parse, CID.decode;
							const isDelegation = e => !isLink(e);
							class Delegation {
								constructor(e, t = new Map) {
									this.root = e, this.blocks = t, Object.defineProperties(this, {
										blocks: {
											enumerable: !1
										}
									})
								}
								get version() {
									return this.data.version
								}
								get signature() {
									return this.data.signature
								}
								get cid() {
									return this.root.cid
								}
								get asCID() {
									return this.cid
								}
								get bytes() {
									return this.root.bytes
								}
								get data() {
									const e = decode$8(this.root);
									return Object.defineProperties(this, {
										data: {
											value: e,
											enumerable: !1
										}
									}), e
								}
								export() {
									return exportDAG(this.root, this.blocks)
								}
								get proofs() {
									return proofs(this)
								}
								get issuer() {
									return this.data.issuer
								}
								get audience() {
									return this.data.audience
								}
								get capabilities() {
									return this.data.capabilities
								}
								get expiration() {
									return this.data.expiration
								}
								get notBefore() {
									return this.data.notBefore
								}
								get nonce() {
									return this.data.nonce
								}
								get facts() {
									return this.data.facts
								}
								iterate() {
									return it(this)
								}
							}
							const it = function* (e) {
								for (const t of e.proofs) isDelegation(t) && (yield* it(t), yield t)
							},
								decodeCache = new WeakMap,
								decode$8 = ({
									bytes: e
								}) => {
									const t = decodeCache.get(e);
									if (!t) {
										const t = decode$9(e);
										return decodeCache.set(e, t), t
									}
									return t
								},
								delegate = async ({
									issuer: e,
									audience: t,
									proofs: r = [],
									...n
								}, o) => {
									const i = [],
										s = new Map;
									for (const e of r)
										if (isDelegation(e)) {
											i.push(e.cid);
											for (const t of e.export()) s.set(t.cid.toString(), t)
										} else i.push(e);
									const a = await issue({
										...n,
										issuer: e,
										audience: t,
										proofs: i
									}),
										{
											cid: c,
											bytes: u
										} = await write$6(a, o);
									decodeCache.set(c, a);
									const d = new Delegation({
										cid: c,
										bytes: u
									}, s);
									return Object.defineProperties(d, {
										proofs: {
											value: r
										}
									}), d
								}, exportDAG = function* (e, t) {
									for (const r of decode$8(e).proofs) {
										const e = t.get(r.toString());
										e && (yield* exportDAG(e, t))
									}
									yield e
								}, create$5 = ({
									root: e,
									blocks: t
								}) => new Delegation(e, t), proofs = e => {
									const t = [],
										{
											root: r,
											blocks: n
										} = e;
									for (const e of decode$8(r).proofs) {
										const r = n.get(e.toString());
										t.push(r ? create$5({
											root: r,
											blocks: n
										}) : e)
									}
									return Object.defineProperty(e, "proofs", {
										value: t
									}), t
								}, invoke = e => new IssuedInvocation(e);
							class IssuedInvocation {
								constructor({
									issuer: e,
									audience: t,
									capability: r,
									proofs: n = [],
									expiration: o,
									lifetimeInSeconds: i,
									notBefore: s,
									nonce: a,
									facts: c = []
								}) {
									this.issuer = e, this.audience = t, this.proofs = n, this.capabilities = [r], this.expiration = o, this.lifetimeInSeconds = i, this.notBefore = s, this.nonce = a, this.facts = c
								}
								delegate() {
									return delegate(this)
								}
								async execute(e) {
									const [t] = await e.execute(this);
									return t
								}
							}
							const prepare$1 = (e, t) => {
								if (t.has(e)) throw new TypeError("Can not encode circular structure");
								if (void 0 === e && 0 === t.size) return null;
								if (null === e) return null;
								if ("symbol" == typeof e && 0 === t.size) return null;
								const r = asLink$1(e);
								if (r) return r;
								if (ArrayBuffer.isView(e)) return e;
								if (Array.isArray(e)) {
									t.add(e);
									const r = [];
									for (const n of e) r.push(void 0 === n || "symbol" == typeof n ? null : prepare$1(n, t));
									return r
								}
								if ("function" == typeof e.toJSON) {
									t.add(e);
									const r = e.toJSON();
									return prepare$1(r, t)
								}
								if ("object" == typeof e) {
									t.add(e);
									const r = {};
									for (const [n, o] of Object.entries(e)) void 0 !== o && "symbol" != typeof o && (r[n] = prepare$1(o, t));
									return r
								}
								return e
							},
								encode$6 = e => encode$e(prepare$1(e, new Set)),
								link$2 = async (e, {
									hasher: t = sha256
								} = {}) => create$6(code$7, await t.digest(e));
							var commonjsGlobal$1 = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : void 0 !== commonjsGlobal ? commonjsGlobal : "undefined" != typeof self ? self : {};

							function getDefaultExportFromCjs(e) {
								return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e
							}
							var encode_1 = encode$4,
								MSB$1 = 128,
								REST$1 = 127,
								MSBALL = ~REST$1,
								INT = Math.pow(2, 31);

							function encode$4(e, t, r) {
								if (Number.MAX_SAFE_INTEGER && e > Number.MAX_SAFE_INTEGER) throw encode$4.bytes = 0, new RangeError("Could not encode varint");
								t = t || [];
								for (var n = r = r || 0; e >= INT;) t[r++] = 255 & e | MSB$1, e /= 128;
								for (; e & MSBALL;) t[r++] = 255 & e | MSB$1, e >>>= 7;
								return t[r] = 0 | e, encode$4.bytes = r - n + 1, t
							}
							var decode$6 = read,
								MSB = 128,
								REST = 127;

							function read(e, t) {
								var r, n = 0,
									o = 0,
									i = t = t || 0,
									s = e.length;
								do {
									if (i >= s || o > 49) throw read.bytes = 0, new RangeError("Could not decode varint");
									r = e[i++], n += o < 28 ? (r & REST) << o : (r & REST) * Math.pow(2, o), o += 7
								} while (r >= MSB);
								return read.bytes = i - t, n
							}
							var N1 = Math.pow(2, 7),
								N2 = Math.pow(2, 14),
								N3 = Math.pow(2, 21),
								N4 = Math.pow(2, 28),
								N5 = Math.pow(2, 35),
								N6 = Math.pow(2, 42),
								N7 = Math.pow(2, 49),
								N8 = Math.pow(2, 56),
								N9 = Math.pow(2, 63),
								length = function (e) {
									return e < N1 ? 1 : e < N2 ? 2 : e < N3 ? 3 : e < N4 ? 4 : e < N5 ? 5 : e < N6 ? 6 : e < N7 ? 7 : e < N8 ? 8 : e < N9 ? 9 : 10
								},
								varint = {
									encode: encode_1,
									decode: decode$6,
									encodingLength: length
								};
							const cborEncoders = makeCborEncoders(),
								defaultEncodeOptions = {
									float64: !1,
									quickEncodeToken: quickEncodeToken
								};

							function tokensToLength(e, t = cborEncoders, r = defaultEncodeOptions) {
								if (Array.isArray(e)) {
									let n = 0;
									for (const o of e) n += tokensToLength(o, t, r);
									return n
								} {
									const n = t[e.type.major];
									if (void 0 === n.encodedSize || "function" != typeof n.encodedSize) throw new Error(`Encoder for ${e.type.name} does not have an encodedSize()`);
									return n.encodedSize(e, r)
								}
							}
							class CarBufferWriter {
								constructor(e, t) {
									this.bytes = e, this.byteOffset = t, this.roots = [], this.headerSize = t
								}
								addRoot(e, t) {
									return addRoot(this, e, t), this
								}
								write(e) {
									return addBlock(this, e), this
								}
								close(e) {
									return close$6(this, e)
								}
							}
							const addRoot = (e, t, r = {}) => {
								const {
									resize: n = !1
								} = r, {
									bytes: o,
									headerSize: i,
									byteOffset: s,
									roots: a
								} = e;
								e.roots.push(t);
								const c = headerLength(e);
								if (c > i) {
									if (!(c - i + s < o.byteLength)) throw a.pop(), new RangeError(`Buffer has no capacity for a new root ${t}`);
									if (!n) throw a.pop(), new RangeError(`Header of size ${i} has no capacity for new root ${t}.\n  However there is a space in the buffer and you could call addRoot(root, { resize: root }) to resize header to make a space for this root.`);
									resizeHeader(e, c)
								}
							},
								blockLength = ({
									cid: e,
									bytes: t
								}) => {
									const r = e.bytes.byteLength + t.byteLength;
									return varint.encodingLength(r) + r
								},
								addBlock = (e, {
									cid: t,
									bytes: r
								}) => {
									const n = t.bytes.byteLength + r.byteLength,
										o = varint.encode(n);
									if (e.byteOffset + o.length + n > e.bytes.byteLength) throw new RangeError("Buffer has no capacity for this block");
									writeBytes$1(e, o), writeBytes$1(e, t.bytes), writeBytes$1(e, r)
								},
								close$6 = (e, t = {}) => {
									const {
										resize: r = !1
									} = t, {
										roots: n,
										bytes: o,
										byteOffset: i,
										headerSize: s
									} = e, a = encode$e({
										version: 1,
										roots: n
									}), c = varint.encode(a.length), u = c.length + a.byteLength;
									if (0 == s - u) return writeHeader(e, c, a), o.subarray(0, i);
									if (r) return resizeHeader(e, u), writeHeader(e, c, a), o.subarray(0, e.byteOffset);
									throw new RangeError("Header size was overestimated.\nYou can use close({ resize: true }) to resize header")
								},
								resizeHeader = (e, t) => {
									const {
										bytes: r,
										headerSize: n
									} = e;
									r.set(r.subarray(n, e.byteOffset), t), e.byteOffset += t - n, e.headerSize = t
								},
								writeBytes$1 = (e, t) => {
									e.bytes.set(t, e.byteOffset), e.byteOffset += t.length
								},
								writeHeader = ({
									bytes: e
								}, t, r) => {
									e.set(t), e.set(r, t.length)
								},
								headerPreludeTokens = [new Token(Type.map, 2), new Token(Type.string, "version"), new Token(Type.uint, 1), new Token(Type.string, "roots")],
								CID_TAG = new Token(Type.tag, 42),
								calculateHeaderLength = e => {
									const t = [...headerPreludeTokens];
									t.push(new Token(Type.array, e.length));
									for (const r of e) t.push(CID_TAG), t.push(new Token(Type.bytes, {
										length: r + 1
									}));
									const r = tokensToLength(t);
									return varint.encodingLength(r) + r
								},
								headerLength = ({
									roots: e
								}) => calculateHeaderLength(e.map((e => e.bytes.byteLength))),
								createWriter$2 = (e, t = {}) => {
									const {
										roots: r = [],
										byteOffset: n = 0,
										byteLength: o = e.byteLength,
										headerSize: i = headerLength({
											roots: r
										})
									} = t, s = new Uint8Array(e, n, o), a = new CarBufferWriter(s, i);
									for (const e of r) a.addRoot(e);
									return a
								},
								Kinds = {
									Null: e => null === e,
									Int: e => Number.isInteger(e),
									Float: e => "number" == typeof e && Number.isFinite(e),
									String: e => "string" == typeof e,
									Bool: e => "boolean" == typeof e,
									Bytes: e => e instanceof Uint8Array,
									Link: e => !Kinds.Null(e) && "object" == typeof e && e.asCID === e,
									List: e => Array.isArray(e),
									Map: e => !Kinds.Null(e) && "object" == typeof e && e.asCID !== e && !Kinds.List(e) && !Kinds.Bytes(e)
								},
								Types = {
									Int: Kinds.Int,
									"CarHeader > version": e => Types.Int(e),
									"CarHeader > roots (anon) > valueType (anon)": Kinds.Link,
									"CarHeader > roots (anon)": e => Kinds.List(e) && Array.prototype.every.call(e, Types["CarHeader > roots (anon) > valueType (anon)"]),
									"CarHeader > roots": e => Types["CarHeader > roots (anon)"](e),
									CarHeader: e => {
										const t = e && Object.keys(e);
										return Kinds.Map(e) && ["version"].every((e => t.includes(e))) && Object.entries(e).every((([e, t]) => Types["CarHeader > " + e] && Types["CarHeader > " + e](t)))
									}
								},
								CarHeader = Types.CarHeader,
								CIDV0_BYTES = {
									SHA2_256: 18,
									LENGTH: 32,
									DAG_PB: 112
								},
								V2_HEADER_LENGTH = 40;
							async function readVarint(e) {
								const t = await e.upTo(8);
								if (!t.length) throw new Error("Unexpected end of data");
								const r = varint.decode(t);
								return e.seek(varint.decode.bytes), r
							}
							async function readV2Header(e) {
								const t = await e.exactly(V2_HEADER_LENGTH),
									r = new DataView(t.buffer, t.byteOffset, t.byteLength);
								let n = 0;
								const o = {
									version: 2,
									characteristics: [r.getBigUint64(n, !0), r.getBigUint64(n += 8, !0)],
									dataOffset: Number(r.getBigUint64(n += 8, !0)),
									dataSize: Number(r.getBigUint64(n += 8, !0)),
									indexOffset: Number(r.getBigUint64(n += 8, !0))
								};
								return e.seek(V2_HEADER_LENGTH), o
							}
							async function readHeader(e, t) {
								const r = await readVarint(e);
								if (0 === r) throw new Error("Invalid CAR header (zero length)");
								const n = await e.exactly(r);
								e.seek(r);
								const o = decode$f(n);
								if (!CarHeader(o)) throw new Error("Invalid CAR header format");
								if (1 !== o.version && 2 !== o.version || void 0 !== t && o.version !== t) throw new Error(`Invalid CAR version: ${o.version}${void 0 !== t ? ` (expected ${t})` : ""}`);
								const i = Array.isArray(o.roots);
								if (1 === o.version && !i || 2 === o.version && i) throw new Error("Invalid CAR header format");
								if (1 === o.version) return o;
								const s = await readV2Header(e);
								e.seek(s.dataOffset - e.pos);
								const a = await readHeader(e, 1);
								return Object.assign(a, s)
							}
							async function readMultihash(e) {
								const t = await e.upTo(8);
								varint.decode(t);
								const r = varint.decode.bytes,
									n = varint.decode(t.subarray(varint.decode.bytes)),
									o = r + varint.decode.bytes + n,
									i = await e.exactly(o);
								return e.seek(o), i
							}
							async function readCid(e) {
								const t = await e.exactly(2);
								if (t[0] === CIDV0_BYTES.SHA2_256 && t[1] === CIDV0_BYTES.LENGTH) {
									const t = await e.exactly(34);
									e.seek(34);
									const r = decode$k(t);
									return CID.create(0, CIDV0_BYTES.DAG_PB, r)
								}
								const r = await readVarint(e);
								if (1 !== r) throw new Error(`Unexpected CID version (${r})`);
								const n = await readVarint(e),
									o = await readMultihash(e),
									i = decode$k(o);
								return CID.create(r, n, i)
							}
							async function readBlockHead(e) {
								const t = e.pos;
								let r = await readVarint(e);
								if (0 === r) throw new Error("Invalid CAR section (zero length)");
								return r += e.pos - t, {
									cid: await readCid(e),
									length: r,
									blockLength: r - Number(e.pos - t)
								}
							}
							async function readBlock(e) {
								const {
									cid: t,
									blockLength: r
								} = await readBlockHead(e), n = await e.exactly(r);
								return e.seek(r), {
									bytes: n,
									cid: t
								}
							}
							async function readBlockIndex(e) {
								const t = e.pos,
									{
										cid: r,
										length: n,
										blockLength: o
									} = await readBlockHead(e),
									i = {
										cid: r,
										length: n,
										blockLength: o,
										offset: t,
										blockOffset: e.pos
									};
								return e.seek(i.blockLength), i
							}

							function createDecoder(e) {
								const t = (async () => {
									const t = await readHeader(e);
									if (2 === t.version) {
										const r = e.pos - t.dataOffset;
										e = limitReader(e, t.dataSize - r)
									}
									return t
								})();
								return {
									header: () => t,
									async * blocks() {
										for (await t;
											(await e.upTo(8)).length > 0;) yield await readBlock(e)
									},
									async * blocksIndex() {
										for (await t;
											(await e.upTo(8)).length > 0;) yield await readBlockIndex(e)
									}
								}
							}

							function bytesReader(e) {
								let t = 0;
								return {
									upTo: async r => e.subarray(t, t + Math.min(r, e.length - t)),
									async exactly(r) {
										if (r > e.length - t) throw new Error("Unexpected end of data");
										return e.subarray(t, t + r)
									},
									seek(e) {
										t += e
									},
									get pos() {
										return t
									}
								}
							}

							function chunkReader(e) {
								let t = 0,
									r = 0,
									n = 0,
									o = new Uint8Array(0);
								const i = async t => {
									r = o.length - n;
									const i = [o.subarray(n)];
									for (; r < t;) {
										const t = await e();
										if (null == t) break;
										r < 0 ? t.length > r && i.push(t.subarray(-r)) : i.push(t), r += t.length
									}
									o = new Uint8Array(i.reduce(((e, t) => e + t.length), 0));
									let s = 0;
									for (const e of i) o.set(e, s), s += e.length;
									n = 0
								};
								return {
									upTo: async e => (o.length - n < e && await i(e), o.subarray(n, n + Math.min(o.length - n, e))),
									async exactly(e) {
										if (o.length - n < e && await i(e), o.length - n < e) throw new Error("Unexpected end of data");
										return o.subarray(n, n + e)
									},
									seek(e) {
										t += e, n += e
									},
									get pos() {
										return t
									}
								}
							}

							function asyncIterableReader(e) {
								const t = e[Symbol.asyncIterator]();
								return chunkReader((async function () {
									const e = await t.next();
									return e.done ? null : e.value
								}))
							}

							function limitReader(e, t) {
								let r = 0;
								return {
									async upTo(n) {
										let o = await e.upTo(n);
										return o.length + r > t && (o = o.subarray(0, t - r)), o
									},
									async exactly(n) {
										const o = await e.exactly(n);
										if (o.length + r > t) throw new Error("Unexpected end of data");
										return o
									},
									seek(t) {
										r += t, e.seek(t)
									},
									get pos() {
										return e.pos
									}
								}
							}
							class CarReader {
								constructor(e, t) {
									this._header = e, this._blocks = t, this._keys = t.map((e => e.cid.toString()))
								}
								get version() {
									return this._header.version
								}
								async getRoots() {
									return this._header.roots
								}
								async has(e) {
									return this._keys.indexOf(e.toString()) > -1
								}
								async get(e) {
									const t = this._keys.indexOf(e.toString());
									return t > -1 ? this._blocks[t] : void 0
								}
								async * blocks() {
									for (const e of this._blocks) yield e
								}
								async * cids() {
									for (const e of this._blocks) yield e.cid
								}
								static async fromBytes(e) {
									if (!(e instanceof Uint8Array)) throw new TypeError("fromBytes() requires a Uint8Array");
									return decodeReaderComplete(bytesReader(e))
								}
								static async fromIterable(e) {
									if (!e || "function" != typeof e[Symbol.asyncIterator]) throw new TypeError("fromIterable() requires an async iterable");
									return decodeReaderComplete(asyncIterableReader(e))
								}
							}
							async function decodeReaderComplete(e) {
								const t = createDecoder(e),
									r = await t.header(),
									n = [];
								for await (const e of t.blocks()) n.push(e);
								return new CarReader(r, n)
							}
							const code$2 = 514;
							class Writer$2 {
								constructor(e = [], t = 0) {
									this.written = new Set, this.blocks = e, this.byteLength = t
								}
								write(...e) {
									for (const t of e) {
										const e = t.cid.toString(base32);
										this.written.has(e) || (this.blocks.push(t), this.byteLength += blockLength(t), this.written.add(e))
									}
									return this
								}
								flush(...e) {
									const t = [];
									for (const r of e.reverse()) {
										const e = r.cid.toString(base32);
										this.written.has(e) || (this.blocks.unshift(r), this.byteLength += blockLength({
											cid: r.cid,
											bytes: r.bytes
										}), this.written.add(e)), t.push(r.cid)
									}
									this.byteLength += headerLength({
										roots: t
									});
									const r = new ArrayBuffer(this.byteLength),
										n = createWriter$2(r, {
											roots: t
										});
									for (const e of this.blocks) n.write(e);
									return n.close()
								}
							}
							new TextEncoder, new TextDecoder, Object.freeze({
								"content-type": "application/json"
							});
							const the = e => e,
								entries = e => Object.entries(e),
								combine = ([e, ...t]) => {
									const r = e.map((e => [e]));
									for (const e of t) {
										const t = r.splice(0);
										for (const n of e)
											for (const e of t) r.push([...e, n])
									}
									return r
								},
								intersection = (e, t) => {
									const [r, n] = e.length < t.length ? [new Set(e), new Set(t)] : [new Set(t), new Set(e)];
									for (const e of r) n.has(e) || r.delete(e);
									return [...r]
								};
							class Failure extends Error {
								get error() {
									return !0
								}
								describe() {
									return this.name
								}
								get message() {
									return this.describe()
								}
								toJSON() {
									const {
										error: e,
										name: t,
										message: r
									} = this;
									return {
										error: e,
										name: t,
										message: r
									}
								}
							}
							class EscalatedCapability extends Failure {
								constructor(e, t, r) {
									super(), this.claimed = e, this.delegated = t, this.cause = r, this.name = the("EscalatedCapability")
								}
								describe() {
									return `Constraint violation: ${this.cause.message}`
								}
							}
							class DelegationError extends Failure {
								constructor(e, t) {
									super(), this.name = the("InvalidClaim"), this.causes = e, this.context = t
								}
								describe() {
									return [`Can not derive ${this.context} from delegated capabilities:`, ...this.causes.map((e => li(e.message)))].join("\n")
								}
								get cause() {
									if (1 !== this.causes.length) return this; {
										const [e] = this.causes, t = "InvalidClaim" === e.name ? e.cause : e;
										return Object.defineProperties(this, {
											cause: {
												value: t
											}
										}), t
									}
								}
							}
							class MalformedCapability extends Failure {
								constructor(e, t) {
									super(), this.name = the("MalformedCapability"), this.capability = e, this.cause = t
								}
								describe() {
									return [`Encountered malformed '${this.capability.can}' capability: ${format(this.capability)}`, li(this.cause.message)].join("\n")
								}
							}
							class UnknownCapability extends Failure {
								constructor(e) {
									super(), this.name = the("UnknownCapability"), this.capability = e
								}
								describe() {
									return `Encountered unknown capability: ${format(this.capability)}`
								}
							}
							const format = (e, t) => JSON.stringify(e, ((e, t) => t && t.asCID === t ? t.toString() : t), t),
								indent = (e, t = "  ") => `${t}${e.split("\n").join(`\n${t}`)}`,
								li = e => indent(`- ${e}`),
								capability = e => new Capability(e),
								or = (e, t) => new Or(e, t),
								and = (...e) => new And(e),
								derive = ({
									from: e,
									to: t,
									derives: r
								}) => new Derive(e, t, r);
							class View {
								match(e) {
									return new UnknownCapability(e.capability)
								}
								select(e) {
									return select(this, e)
								}
								derive({
									derives: e,
									to: t
								}) {
									return derive({
										derives: e,
										to: t,
										from: this
									})
								}
							}
							class Unit extends View {
								or(e) {
									return or(this, e)
								}
								and(e) {
									return and(this, e)
								}
							}
							class Capability extends Unit {
								constructor(e) {
									super(), this.descriptor = {
										derives: derives$1,
										...e
									}
								}
								create(e) {
									const {
										descriptor: t,
										can: r
									} = this, n = t.caveats, o = e.caveats || {}, i = t.with.decode(e.with);
									if (i.error) throw Object.assign(new Error(`Invalid 'with' - ${i.message}`), {
										cause: i
									});
									const s = {};
									for (const [e, t] of Object.entries(n || {})) {
										const r = e,
											n = t.decode(o[r]);
										if (n?.error) throw Object.assign(new Error(`Invalid 'caveats.${r}' - ${n.message}`), {
											cause: n
										});
										void 0 !== n && (s[e] = n)
									}
									return {
										...s,
										can: r,
										with: i.href
									}
								}
								invoke({
									with: e,
									caveats: t,
									...r
								}) {
									return invoke({
										...r,
										capability: this.create({
											with: e,
											caveats: t
										})
									})
								}
								get can() {
									return this.descriptor.can
								}
								match(e) {
									const t = parse(this, e);
									return t.error ? t : new Match(e, t, this.descriptor)
								}
								toString() {
									return JSON.stringify({
										can: this.descriptor.can
									})
								}
							}
							class Or extends Unit {
								constructor(e, t) {
									super(), this.left = e, this.right = t
								}
								match(e) {
									const t = this.left.match(e);
									if (t.error) {
										const r = this.right.match(e);
										return r.error ? "MalformedCapability" === r.name ? r : t : r
									}
									return t
								}
								toString() {
									return `${this.left.toString()}|${this.right.toString()}`
								}
							}
							class And extends View {
								constructor(e) {
									super(), this.selectors = e
								}
								match(e) {
									const t = [];
									for (const r of this.selectors) {
										const n = r.match(e);
										if (n.error) return n;
										t.push(n)
									}
									return new AndMatch(t)
								}
								select(e) {
									return selectGroup(this, e)
								}
								and(e) {
									return new And([...this.selectors, e])
								}
								toString() {
									return `[${this.selectors.map(String).join(", ")}]`
								}
							}
							class Derive extends Unit {
								constructor(e, t, r) {
									super(), this.from = e, this.to = t, this.derives = r
								}
								create(e) {
									return this.to.create(e)
								}
								invoke(e) {
									return this.to.invoke(e)
								}
								get can() {
									return this.to.can
								}
								match(e) {
									const t = this.to.match(e);
									return t.error ? t : new DerivedMatch(t, this.from, this.derives)
								}
								toString() {
									return this.to.toString()
								}
							}
							class Match {
								constructor(e, t, r) {
									this.source = [e], this.value = t, this.descriptor = {
										derives: derives$1,
										...r
									}
								}
								get can() {
									return this.value.can
								}
								get proofs() {
									const e = [this.source[0].delegation];
									return Object.defineProperties(this, {
										proofs: {
											value: e
										}
									}), e
								}
								prune(e) {
									return e.canIssue(this.value, this.source[0].delegation.issuer.did()) ? null : this
								}
								select(e) {
									const t = [],
										r = [],
										n = [];
									for (const o of e) {
										const e = parse(this, o);
										if (e.error) "UnknownCapability" === e.name ? t.push(e.capability) : r.push(new DelegationError([e], this));
										else {
											const t = this.descriptor.derives(this.value, e);
											t.error ? r.push(new DelegationError([new EscalatedCapability(this.value, e, t)], this)) : n.push(new Match(o, e, this.descriptor))
										}
									}
									return {
										matches: n,
										unknown: t,
										errors: r
									}
								}
								toString() {
									return JSON.stringify({
										can: this.descriptor.can,
										with: this.value.uri.href,
										caveats: Object.keys(this.value.caveats).length > 0 ? this.value.caveats : void 0
									})
								}
							}
							class DerivedMatch {
								constructor(e, t, r) {
									this.selected = e, this.from = t, this.derives = r
								}
								get can() {
									return this.value.can
								}
								get source() {
									return this.selected.source
								}
								get proofs() {
									const e = [];
									for (const {
										delegation: t
									}
										of this.selected.source) e.push(t);
									return Object.defineProperties(this, {
										proofs: {
											value: e
										}
									}), e
								}
								get value() {
									return this.selected.value
								}
								prune(e) {
									const t = this.selected.prune(e);
									return t ? new DerivedMatch(t, this.from, this.derives) : null
								}
								select(e) {
									const {
										derives: t,
										selected: r,
										from: n
									} = this, {
										value: o
									} = r, i = r.select(e), s = n.select(e), a = [], c = [];
									for (const e of s.matches) {
										const r = t(o, e.value);
										r.error ? c.push(new DelegationError([new EscalatedCapability(o, e.value, r)], this)) : a.push(e)
									}
									return {
										unknown: intersection(i.unknown, s.unknown),
										errors: [...c, ...i.errors, ...s.errors.map((e => new DelegationError([e], this)))],
										matches: [...i.matches.map((e => new DerivedMatch(e, n, t))), ...a]
									}
								}
								toString() {
									return this.selected.toString()
								}
							}
							class AndMatch {
								constructor(e) {
									this.matches = e
								}
								get selectors() {
									return this.matches
								}
								get source() {
									const e = [];
									for (const t of this.matches) e.push(...t.source);
									return Object.defineProperties(this, {
										source: {
											value: e
										}
									}), e
								}
								prune(e) {
									const t = [];
									for (const r of this.matches) {
										const n = r.prune(e);
										n && t.push(n)
									}
									return 0 === t.length ? null : new AndMatch(t)
								}
								get proofs() {
									const e = [];
									for (const {
										delegation: t
									}
										of this.source) e.push(t);
									return Object.defineProperties(this, {
										source: {
											value: e
										}
									}), e
								}
								get value() {
									const e = [];
									for (const t of this.matches) e.push(t.value);
									return Object.defineProperties(this, {
										value: {
											value: e
										}
									}), e
								}
								select(e) {
									return selectGroup(this, e)
								}
								toString() {
									return `[${this.matches.map((e => e.toString())).join(", ")}]`
								}
							}
							const parse = (e, t) => {
								const {
									can: r,
									with: n,
									caveats: o
								} = e.descriptor, {
									delegation: i } = t, a = t.capability;
								if (a.can !== r) return new UnknownCapability(a);
								const c = n.decode(a.with);
								if (c.error) return new MalformedCapability(a, c);
								const u = {};
								if (o)
									for (const [e, t] of entries(o)) {
										const r = e,
											n = a[r],
											o = t.decode(n);
										if (o?.error) return new MalformedCapability(a, o);
										null != o && (u[r] = o)
									}
								return new CapabilityView(r, a.with, c, u, i)
							};
							class CapabilityView {
								constructor(e, t, r, n, o) {
									this.can = e, this.with = t, this.uri = r, this.delegation = o, this.caveats = n
								}
							}
							const select = (e, t) => {
								const r = [],
									n = [],
									o = [];
								for (const i of t) {
									const t = e.match(i);
									t.error ? "UnknownCapability" === t.name ? r.push(t.capability) : o.push(new DelegationError([t], t.capability)) : n.push(t)
								}
								return {
									matches: n,
									errors: o,
									unknown: r
								}
							},
								selectGroup = (e, t) => {
									let r;
									const n = [],
										o = [];
									for (const i of e.selectors) {
										const s = i.select(t);
										r = r ? intersection(r, s.unknown) : s.unknown;
										for (const t of s.errors) o.push(new DelegationError([t], e));
										n.push(s.matches)
									}
									const i = combine(n).map((e => new AndMatch(e)));
									return {
										unknown: r || [],
										errors: o,
										matches: i
									}
								},
								derives$1 = (e, t) => {
									if (t.with.endsWith("*")) {
										if (!e.with.startsWith(t.with.slice(0, -1))) return new Failure(`Resource ${e.with} does not match delegated ${t.with} `)
									} else if (t.with !== e.with) return new Failure(`Resource ${e.with} does not contain ${t.with}`);
									for (const [r, n] of entries(t.caveats))
										if (e.caveats[r] != n) return new Failure(`${String(r)}: ${e.caveats[r]} violates ${n}`);
									return !0
								},
								decode$3 = (e, {
									protocol: t
								} = {}) => {
									if ("string" != typeof e && !(e instanceof URL)) return new Failure("Expected URI but got " + typeof e);
									try {
										const r = new URL(String(e));
										return null != t && r.protocol !== t ? new Failure(`Expected ${t} URI instead got ${r.href}`) : r
									} catch (e) {
										return new Failure("Invalid URI")
									}
								},
								match$1 = e => ({
									decode: t => decode$3(t, e)
								}),
								decode$2 = (e, t = {}) => {
									if (null == e) return new Failure(`Expected link but got ${e} instead`); {
										const r = asLink$1(e);
										return null == r ? new Failure(`Expected link to be a CID instead of ${e}`) : null != t.code && r.code !== t.code ? new Failure(`Expected link to be CID with 0x${t.code.toString(16)} codec`) : null != t.algorithm && r.multihash.code !== t.algorithm ? new Failure(`Expected link to be CID with 0x${t.algorithm.toString(16)} hashing algorithm`) : null != t.version && r.version !== t.version ? new Failure(`Expected link to be CID version ${t.version} instead of ${r.version}`) : r
									}
								},
								optional = e => ({
									decode: t => void 0 === t ? void 0 : decode$2(t, e)
								});

							function equalWith(e, t) {
								return e.with === t.with || new Failure(`Can not derive ${e.can} with ${e.with} from ${t.with}`)
							}

							function equal(e, t, r) {
								return void 0 === t || "*" === t || String(e) === String(t) || new Failure(`Contastraint vilation: ${e} violates imposed ${r} constraint ${t}`)
							}
							const derives = (e, t) => e.uri.href !== t.uri.href ? new Failure(`Expected 'with: "${t.uri.href}"' instead got '${e.uri.href}'`) : !t.caveats.link || `${t.caveats.link}` == `${e.caveats.link}` || new Failure(`Link ${null == e.caveats.link ? "" : `${e.caveats.link} `}violates imposed ${t.caveats.link} constraint`);

							function fail(e) {
								return !0 === e ? void 0 : e
							}
							class Never {
								decode(e) {
									return new Failure("Given input is not valid")
								}
								optional() {
									return new Optional(this)
								}
							}
							class Optional {
								constructor(e) {
									this.decoder = e
								}
								optional() {
									return this
								}
								decode(e) {
									return void 0 === e ? void 0 : this.decoder.decode(e)
								}
							}
							class IntegerDecoder extends Never {
								constructor({
									min: e = -1 / 0,
									max: t = 1 / 0
								} = {}) {
									super(), this.min = e, this.max = t
								}
								static isInteger(e) {
									return Number.isInteger(e)
								}
								decode(e) {
									const {
										min: t,
										max: r
									} = this;
									return IntegerDecoder.isInteger(e) ? t > e ? new Failure(`Expecting an Integer > ${t} but instead got ${e}`) : r < e ? new Failure(`Expecting an Integer < ${r} but instead got ${e}`) : e : new Failure(`Expecting an Integer but instead got: ${typeof e} ${e}`)
								}
								greater(e) {
									return new IntegerDecoder({
										min: e,
										max: this.max
									})
								}
								less(e) {
									return new IntegerDecoder({
										min: this.min,
										max: e
									})
								}
							}
							const Integer = new IntegerDecoder,
								any = capability({
									can: "*",
									with: match$1({
										protocol: "did:"
									}),
									derives: equalWith
								}),
								store = any.derive({
									to: capability({
										can: "store/*",
										with: match$1({
											protocol: "did:"
										}),
										derives: equalWith
									}),
									derives: equalWith
								}),
								base$1 = any.or(store),
								add$1 = base$1.derive({
									to: capability({
										can: "store/add",
										with: match$1({
											protocol: "did:"
										}),
										caveats: {
											link: optional(),
											origin: optional(),
											size: Integer.optional()
										},
										derives: (e, t) => {
											const r = derives(e, t);
											return r.error ? r : null == e.caveats.size || null == t.caveats.size || !(e.caveats.size > t.caveats.size) || new Failure(`Size constraint violation: ${e.caveats.size} > ${t.caveats.size}`)
										}
									}),
									derives: equalWith
								}),
								remove$1 = base$1.derive({
									to: capability({
										can: "store/remove",
										with: match$1({
											protocol: "did:"
										}),
										caveats: {
											link: optional()
										},
										derives: derives
									}),
									derives: equalWith
								}),
								list = base$1.derive({
									to: capability({
										can: "store/list",
										with: match$1({
											protocol: "did:"
										}),
										derives: (e, t) => e.uri.href === t.uri.href || new Failure(`Expected 'with: "${t.uri.href}"' instead got '${e.uri.href}'`)
									}),
									derives: equalWith
								});
							add$1.or(remove$1).or(list);
							const upload = any.derive({
								to: capability({
									can: "upload/*",
									with: match$1({
										protocol: "did:"
									}),
									derives: equalWith
								}),
								derives: equalWith
							}),
								base = any.or(upload);
							base.derive({
								to: capability({
									can: "upload/remove",
									with: match$1({
										protocol: "did:"
									}),
									caveats: {
										root: optional()
									},
									derives: (e, t) => fail(equalWith(e, t)) || fail(equal(e.caveats.root, t.caveats.root, "root")) || !0
								}),
								derives: equalWith
							}), base.derive({
								to: capability({
									can: "upload/list",
									with: match$1({
										protocol: "did:"
									})
								}),
								derives: equalWith
							});

							parse$3("did:key:z6MkkHafoFWxxWVNpNXocFdU6PL2RVLyTEgS1qTnD3bRP7V9");
							var retry$2 = {
								exports: {}
							},
								retry$1 = {};

							function RetryOperation(e, t) {
								"boolean" == typeof t && (t = {
									forever: t
								}), this._originalTimeouts = JSON.parse(JSON.stringify(e)), this._timeouts = e, this._options = t || {}, this._maxRetryTime = t && t.maxRetryTime || 1 / 0, this._fn = null, this._errors = [], this._attempts = 1, this._operationTimeout = null, this._operationTimeoutCb = null, this._timeout = null, this._operationStart = null, this._timer = null, this._options.forever && (this._cachedTimeouts = this._timeouts.slice(0))
							}
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

							function _classPrivateFieldLooseKey(e) {
								return "__private_" + id++ + "_" + e
							}

							function _classPrivateFieldLooseBase(e, t) {
								if (!Object.prototype.hasOwnProperty.call(e, t)) throw new TypeError("attempted to use private field on non-instance");
								return e
							}
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

							function prepare(e) {
								if ((e instanceof Uint8Array || "string" == typeof e) && (e = {
									Data: e
								}), "object" != typeof e || Array.isArray(e)) throw new TypeError("Invalid DAG-PB form");
								const t = {};
								if (void 0 !== e.Data)
									if ("string" == typeof e.Data) t.Data = textEncoder.encode(e.Data);
									else {
										if (!(e.Data instanceof Uint8Array)) throw new TypeError("Invalid DAG-PB form");
										t.Data = e.Data
									} if (void 0 !== e.Links) {
										if (!Array.isArray(e.Links)) throw new TypeError("Invalid DAG-PB form");
										t.Links = e.Links.map(asLink), t.Links.sort(linkComparator)
									} else t.Links = [];
								return t
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
							const code$1 = 112;

							function encode$1(e) {
								validate(e);
								const t = {};
								return e.Links && (t.Links = e.Links.map((e => {
									const t = {};
									return e.Hash && (t.Hash = e.Hash.bytes), void 0 !== e.Name && (t.Name = e.Name), void 0 !== e.Tsize && (t.Tsize = e.Tsize), t
								}))), e.Data && (t.Data = e.Data), encodeNode(t)
							}

							function decode$1(e) {
								const t = decodeNode(e),
									r = {};
								return t.Data && (r.Data = t.Data), t.Links && (r.Links = t.Links.map((e => {
									const t = {};
									try {
										t.Hash = CID.decode(e.Hash)
									} catch (e) { }
									if (!t.Hash) throw new Error("Invalid Hash field found in link, expected CID");
									return void 0 !== e.Name && (t.Name = e.Name), void 0 !== e.Tsize && (t.Tsize = e.Tsize), t
								}))), r
							}
							var minimal$1 = {
								exports: {}
							},
								indexMinimal = {},
								minimal = {},
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
							var writer_buffer = BufferWriter,
								Writer = writer;
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
							var reader_buffer = BufferReader,
								Reader = reader;
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
							var rpc = {},
								service = Service,
								util = requireMinimal();

							function Service(e, t, r) {
								if ("function" != typeof e) throw TypeError("rpcImpl must be a function");
								util.EventEmitter.call(this), this.rpcImpl = e, this.requestDelimited = Boolean(t), this.responseDelimited = Boolean(r)
							} (Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service, Service.prototype.rpcCall = function e(t, r, n, o, i) {
								if (!o) throw TypeError("request must be specified");
								var s = this;
								if (!i) return util.asPromise(e, s, t, r, n, o);
								if (s.rpcImpl) try {
									return s.rpcImpl(t, r[s.requestDelimited ? "encodeDelimited" : "encode"](o).finish(), (function (e, r) {
										if (e) return s.emit("error", e, t), i(e);
										if (null !== r) {
											if (!(r instanceof n)) try {
												r = n[s.responseDelimited ? "decodeDelimited" : "decode"](r)
											} catch (e) {
												return s.emit("error", e, t), i(e)
											}
											return s.emit("data", r, t), i(null, r)
										}
										s.end(!0)
									}))
								} catch (e) {
									return s.emit("error", e, t), void setTimeout((function () {
										i(e)
									}), 0)
								} else setTimeout((function () {
									i(Error("already ended"))
								}), 0)
							}, Service.prototype.end = function (e) {
								return this.rpcImpl && (e || this.rpcImpl(null, null, null), this.rpcImpl = null, this.emit("end").off()), this
							},
								function (e) {
									e.Service = service
								}(rpc);
							var roots = {};
							! function (e) {
								var t = e;

								function r() {
									t.util._configure(), t.Writer._configure(t.BufferWriter), t.Reader._configure(t.BufferReader)
								}
								t.build = "minimal", t.Writer = writer, t.BufferWriter = writer_buffer, t.Reader = reader, t.BufferReader = reader_buffer, t.util = requireMinimal(), t.rpc = rpc, t.roots = roots, t.configure = r, r()
							}(indexMinimal),
								function (e) {
									e.exports = indexMinimal
								}(minimal$1);
							var $protobuf = getDefaultExportFromCjs(minimal$1.exports);
							const $Reader = $protobuf.Reader,
								$Writer = $protobuf.Writer,
								$util = $protobuf.util,
								$root = $protobuf.roots.unixfs || ($protobuf.roots.unixfs = {}),
								Data = $root.Data = (() => {
									function e(e) {
										if (this.blocksizes = [], e)
											for (var t = Object.keys(e), r = 0; r < t.length; ++r) null != e[t[r]] && (this[t[r]] = e[t[r]])
									}
									return e.prototype.Type = 0, e.prototype.Data = $util.newBuffer([]), e.prototype.filesize = $util.Long ? $util.Long.fromBits(0, 0, !0) : 0, e.prototype.blocksizes = $util.emptyArray, e.prototype.hashType = $util.Long ? $util.Long.fromBits(0, 0, !0) : 0, e.prototype.fanout = $util.Long ? $util.Long.fromBits(0, 0, !0) : 0, e.prototype.mode = 0, e.prototype.mtime = null, e.encode = function (e, t) {
										if (t || (t = $Writer.create()), t.uint32(8).int32(e.Type), null != e.Data && Object.hasOwnProperty.call(e, "Data") && t.uint32(18).bytes(e.Data), null != e.filesize && Object.hasOwnProperty.call(e, "filesize") && t.uint32(24).uint64(e.filesize), null != e.blocksizes && e.blocksizes.length)
											for (var r = 0; r < e.blocksizes.length; ++r) t.uint32(32).uint64(e.blocksizes[r]);
										return null != e.hashType && Object.hasOwnProperty.call(e, "hashType") && t.uint32(40).uint64(e.hashType), null != e.fanout && Object.hasOwnProperty.call(e, "fanout") && t.uint32(48).uint64(e.fanout), null != e.mode && Object.hasOwnProperty.call(e, "mode") && t.uint32(56).uint32(e.mode), null != e.mtime && Object.hasOwnProperty.call(e, "mtime") && $root.UnixTime.encode(e.mtime, t.uint32(66).fork()).ldelim(), t
									}, e.decode = function (e, t) {
										e instanceof $Reader || (e = $Reader.create(e));
										for (var r = void 0 === t ? e.len : e.pos + t, n = new $root.Data; e.pos < r;) {
											var o = e.uint32();
											switch (o >>> 3) {
												case 1:
													n.Type = e.int32();
													break;
												case 2:
													n.Data = e.bytes();
													break;
												case 3:
													n.filesize = e.uint64();
													break;
												case 4:
													if (n.blocksizes && n.blocksizes.length || (n.blocksizes = []), 2 == (7 & o))
														for (var i = e.uint32() + e.pos; e.pos < i;) n.blocksizes.push(e.uint64());
													else n.blocksizes.push(e.uint64());
													break;
												case 5:
													n.hashType = e.uint64();
													break;
												case 6:
													n.fanout = e.uint64();
													break;
												case 7:
													n.mode = e.uint32();
													break;
												case 8:
													n.mtime = $root.UnixTime.decode(e, e.uint32());
													break;
												default:
													e.skipType(7 & o)
											}
										}
										if (!n.hasOwnProperty("Type")) throw $util.ProtocolError("missing required 'Type'", {
											instance: n
										});
										return n
									}, e.fromObject = function (e) {
										if (e instanceof $root.Data) return e;
										var t = new $root.Data;
										switch (e.Type) {
											case "Raw":
											case 0:
												t.Type = 0;
												break;
											case "Directory":
											case 1:
												t.Type = 1;
												break;
											case "File":
											case 2:
												t.Type = 2;
												break;
											case "Metadata":
											case 3:
												t.Type = 3;
												break;
											case "Symlink":
											case 4:
												t.Type = 4;
												break;
											case "HAMTShard":
											case 5:
												t.Type = 5
										}
										if (null != e.Data && ("string" == typeof e.Data ? $util.base64.decode(e.Data, t.Data = $util.newBuffer($util.base64.length(e.Data)), 0) : e.Data.length && (t.Data = e.Data)), null != e.filesize && ($util.Long ? (t.filesize = $util.Long.fromValue(e.filesize)).unsigned = !0 : "string" == typeof e.filesize ? t.filesize = parseInt(e.filesize, 10) : "number" == typeof e.filesize ? t.filesize = e.filesize : "object" == typeof e.filesize && (t.filesize = new $util.LongBits(e.filesize.low >>> 0, e.filesize.high >>> 0).toNumber(!0))), e.blocksizes) {
											if (!Array.isArray(e.blocksizes)) throw TypeError(".Data.blocksizes: array expected");
											t.blocksizes = [];
											for (var r = 0; r < e.blocksizes.length; ++r) $util.Long ? (t.blocksizes[r] = $util.Long.fromValue(e.blocksizes[r])).unsigned = !0 : "string" == typeof e.blocksizes[r] ? t.blocksizes[r] = parseInt(e.blocksizes[r], 10) : "number" == typeof e.blocksizes[r] ? t.blocksizes[r] = e.blocksizes[r] : "object" == typeof e.blocksizes[r] && (t.blocksizes[r] = new $util.LongBits(e.blocksizes[r].low >>> 0, e.blocksizes[r].high >>> 0).toNumber(!0))
										}
										if (null != e.hashType && ($util.Long ? (t.hashType = $util.Long.fromValue(e.hashType)).unsigned = !0 : "string" == typeof e.hashType ? t.hashType = parseInt(e.hashType, 10) : "number" == typeof e.hashType ? t.hashType = e.hashType : "object" == typeof e.hashType && (t.hashType = new $util.LongBits(e.hashType.low >>> 0, e.hashType.high >>> 0).toNumber(!0))), null != e.fanout && ($util.Long ? (t.fanout = $util.Long.fromValue(e.fanout)).unsigned = !0 : "string" == typeof e.fanout ? t.fanout = parseInt(e.fanout, 10) : "number" == typeof e.fanout ? t.fanout = e.fanout : "object" == typeof e.fanout && (t.fanout = new $util.LongBits(e.fanout.low >>> 0, e.fanout.high >>> 0).toNumber(!0))), null != e.mode && (t.mode = e.mode >>> 0), null != e.mtime) {
											if ("object" != typeof e.mtime) throw TypeError(".Data.mtime: object expected");
											t.mtime = $root.UnixTime.fromObject(e.mtime)
										}
										return t
									}, e.toObject = function (e, t) {
										t || (t = {});
										var r = {};
										if ((t.arrays || t.defaults) && (r.blocksizes = []), t.defaults) {
											if (r.Type = t.enums === String ? "Raw" : 0, t.bytes === String ? r.Data = "" : (r.Data = [], t.bytes !== Array && (r.Data = $util.newBuffer(r.Data))), $util.Long) {
												var n = new $util.Long(0, 0, !0);
												r.filesize = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n
											} else r.filesize = t.longs === String ? "0" : 0;
											$util.Long ? (n = new $util.Long(0, 0, !0), r.hashType = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n) : r.hashType = t.longs === String ? "0" : 0, $util.Long ? (n = new $util.Long(0, 0, !0), r.fanout = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n) : r.fanout = t.longs === String ? "0" : 0, r.mode = 0, r.mtime = null
										}
										if (null != e.Type && e.hasOwnProperty("Type") && (r.Type = t.enums === String ? $root.Data.DataType[e.Type] : e.Type), null != e.Data && e.hasOwnProperty("Data") && (r.Data = t.bytes === String ? $util.base64.encode(e.Data, 0, e.Data.length) : t.bytes === Array ? Array.prototype.slice.call(e.Data) : e.Data), null != e.filesize && e.hasOwnProperty("filesize") && ("number" == typeof e.filesize ? r.filesize = t.longs === String ? String(e.filesize) : e.filesize : r.filesize = t.longs === String ? $util.Long.prototype.toString.call(e.filesize) : t.longs === Number ? new $util.LongBits(e.filesize.low >>> 0, e.filesize.high >>> 0).toNumber(!0) : e.filesize), e.blocksizes && e.blocksizes.length) {
											r.blocksizes = [];
											for (var o = 0; o < e.blocksizes.length; ++o) "number" == typeof e.blocksizes[o] ? r.blocksizes[o] = t.longs === String ? String(e.blocksizes[o]) : e.blocksizes[o] : r.blocksizes[o] = t.longs === String ? $util.Long.prototype.toString.call(e.blocksizes[o]) : t.longs === Number ? new $util.LongBits(e.blocksizes[o].low >>> 0, e.blocksizes[o].high >>> 0).toNumber(!0) : e.blocksizes[o]
										}
										return null != e.hashType && e.hasOwnProperty("hashType") && ("number" == typeof e.hashType ? r.hashType = t.longs === String ? String(e.hashType) : e.hashType : r.hashType = t.longs === String ? $util.Long.prototype.toString.call(e.hashType) : t.longs === Number ? new $util.LongBits(e.hashType.low >>> 0, e.hashType.high >>> 0).toNumber(!0) : e.hashType), null != e.fanout && e.hasOwnProperty("fanout") && ("number" == typeof e.fanout ? r.fanout = t.longs === String ? String(e.fanout) : e.fanout : r.fanout = t.longs === String ? $util.Long.prototype.toString.call(e.fanout) : t.longs === Number ? new $util.LongBits(e.fanout.low >>> 0, e.fanout.high >>> 0).toNumber(!0) : e.fanout), null != e.mode && e.hasOwnProperty("mode") && (r.mode = e.mode), null != e.mtime && e.hasOwnProperty("mtime") && (r.mtime = $root.UnixTime.toObject(e.mtime, t)), r
									}, e.prototype.toJSON = function () {
										return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
									}, e.DataType = function () {
										const e = {},
											t = Object.create(e);
										return t[e[0] = "Raw"] = 0, t[e[1] = "Directory"] = 1, t[e[2] = "File"] = 2, t[e[3] = "Metadata"] = 3, t[e[4] = "Symlink"] = 4, t[e[5] = "HAMTShard"] = 5, t
									}(), e
								})();
							$root.UnixTime = (() => {
								function e(e) {
									if (e)
										for (var t = Object.keys(e), r = 0; r < t.length; ++r) null != e[t[r]] && (this[t[r]] = e[t[r]])
								}
								return e.prototype.Seconds = $util.Long ? $util.Long.fromBits(0, 0, !1) : 0, e.prototype.FractionalNanoseconds = 0, e.encode = function (e, t) {
									return t || (t = $Writer.create()), t.uint32(8).int64(e.Seconds), null != e.FractionalNanoseconds && Object.hasOwnProperty.call(e, "FractionalNanoseconds") && t.uint32(21).fixed32(e.FractionalNanoseconds), t
								}, e.decode = function (e, t) {
									e instanceof $Reader || (e = $Reader.create(e));
									for (var r = void 0 === t ? e.len : e.pos + t, n = new $root.UnixTime; e.pos < r;) {
										var o = e.uint32();
										switch (o >>> 3) {
											case 1:
												n.Seconds = e.int64();
												break;
											case 2:
												n.FractionalNanoseconds = e.fixed32();
												break;
											default:
												e.skipType(7 & o)
										}
									}
									if (!n.hasOwnProperty("Seconds")) throw $util.ProtocolError("missing required 'Seconds'", {
										instance: n
									});
									return n
								}, e.fromObject = function (e) {
									if (e instanceof $root.UnixTime) return e;
									var t = new $root.UnixTime;
									return null != e.Seconds && ($util.Long ? (t.Seconds = $util.Long.fromValue(e.Seconds)).unsigned = !1 : "string" == typeof e.Seconds ? t.Seconds = parseInt(e.Seconds, 10) : "number" == typeof e.Seconds ? t.Seconds = e.Seconds : "object" == typeof e.Seconds && (t.Seconds = new $util.LongBits(e.Seconds.low >>> 0, e.Seconds.high >>> 0).toNumber())), null != e.FractionalNanoseconds && (t.FractionalNanoseconds = e.FractionalNanoseconds >>> 0), t
								}, e.toObject = function (e, t) {
									t || (t = {});
									var r = {};
									if (t.defaults) {
										if ($util.Long) {
											var n = new $util.Long(0, 0, !1);
											r.Seconds = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n
										} else r.Seconds = t.longs === String ? "0" : 0;
										r.FractionalNanoseconds = 0
									}
									return null != e.Seconds && e.hasOwnProperty("Seconds") && ("number" == typeof e.Seconds ? r.Seconds = t.longs === String ? String(e.Seconds) : e.Seconds : r.Seconds = t.longs === String ? $util.Long.prototype.toString.call(e.Seconds) : t.longs === Number ? new $util.LongBits(e.Seconds.low >>> 0, e.Seconds.high >>> 0).toNumber() : e.Seconds), null != e.FractionalNanoseconds && e.hasOwnProperty("FractionalNanoseconds") && (r.FractionalNanoseconds = e.FractionalNanoseconds), r
								}, e.prototype.toJSON = function () {
									return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
								}, e
							})(), $root.Metadata = (() => {
								function e(e) {
									if (e)
										for (var t = Object.keys(e), r = 0; r < t.length; ++r) null != e[t[r]] && (this[t[r]] = e[t[r]])
								}
								return e.prototype.MimeType = "", e.encode = function (e, t) {
									return t || (t = $Writer.create()), null != e.MimeType && Object.hasOwnProperty.call(e, "MimeType") && t.uint32(10).string(e.MimeType), t
								}, e.decode = function (e, t) {
									e instanceof $Reader || (e = $Reader.create(e));
									for (var r = void 0 === t ? e.len : e.pos + t, n = new $root.Metadata; e.pos < r;) {
										var o = e.uint32();
										o >>> 3 == 1 ? n.MimeType = e.string() : e.skipType(7 & o)
									}
									return n
								}, e.fromObject = function (e) {
									if (e instanceof $root.Metadata) return e;
									var t = new $root.Metadata;
									return null != e.MimeType && (t.MimeType = String(e.MimeType)), t
								}, e.toObject = function (e, t) {
									t || (t = {});
									var r = {};
									return t.defaults && (r.MimeType = ""), null != e.MimeType && e.hasOwnProperty("MimeType") && (r.MimeType = e.MimeType), r
								}, e.prototype.toJSON = function () {
									return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
								}, e
							})();
							const NodeType = Data.DataType,
								EMPTY$3 = Object.freeze([]),
								EMPTY_BUFFER$1 = new Uint8Array(0),
								BLANK$2 = Object.freeze({}),
								DEFAULT_FILE_MODE = parseInt("0644", 8),
								DEFAULT_DIRECTORY_MODE = parseInt("0755", 8),
								code = code$1,
								name$1 = "UnixFS",
								encodePB = (e, t) => (Object(globalThis).debug && console.log({
									data: e,
									links: t
								}), encode$1(prepare({
									Data: Data.encode(e).finish(),
									Links: t
								}))),
								createRaw = e => ({
									type: NodeType.Raw,
									content: e
								}),
								createEmptyFile = e => createSimpleFile(EMPTY_BUFFER$1, e),
								createSimpleFile = (e, t) => ({
									type: NodeType.File,
									layout: "simple",
									content: e,
									metadata: decodeMetadata(t)
								}),
								createFileChunk = e => ({
									type: NodeType.File,
									layout: "simple",
									content: e
								}),
								createAdvancedFile = (e, t) => ({
									type: NodeType.File,
									layout: "advanced",
									parts: e,
									metadata: decodeMetadata(t)
								}),
								createFileShard = e => ({
									type: NodeType.File,
									layout: "advanced",
									parts: e
								}),
								createComplexFile = (e, t, r) => ({
									type: NodeType.File,
									layout: "complex",
									content: e,
									parts: t,
									metadata: decodeMetadata(r)
								}),
								createFlatDirectory = (e, t) => ({
									type: NodeType.Directory,
									metadata: decodeMetadata(t),
									entries: e
								}),
								createShardedDirectory = (e, t, r, n, o = BLANK$2) => ({
									type: NodeType.HAMTShard,
									bitfield: t,
									fanout: readFanout(r),
									hashType: readInt(n),
									entries: e,
									metadata: decodeMetadata(o)
								}),
								createDirectoryShard = (e, t, r, n) => ({
									type: NodeType.HAMTShard,
									bitfield: t,
									fanout: readFanout(r),
									hashType: readInt(n),
									entries: e
								}),
								encodeRaw = e => encodePB({
									Type: NodeType.Raw,
									Data: e.byteLength > 0 ? e : void 0,
									filesize: e.byteLength,
									blocksizes: EMPTY$3
								}, []),
								encodeFile$1 = (e, t = !1) => {
									const r = t ? BLANK$2 : Object(e).metadata;
									switch (e.layout) {
										case "simple":
											return encodeSimpleFile(e.content, r);
										case "advanced":
											return encodeAdvancedFile(e.parts, r);
										case "complex":
											return encodeComplexFile(e.content, e.parts, r);
										default:
											throw new TypeError(`File with unknown layout "${Object(e).layout}" was passed`)
									}
								},
								encodeFileChunk = e => encodeSimpleFile(e, BLANK$2),
								encodeFileShard = e => encodePB({
									Type: NodeType.File,
									blocksizes: e.map(contentByteLength),
									filesize: cumulativeContentByteLength(e)
								}, e.map(encodeLink)),
								encodeAdvancedFile = (e, t = BLANK$2) => encodePB({
									Type: NodeType.File,
									blocksizes: e.map(contentByteLength),
									filesize: cumulativeContentByteLength(e),
									...encodeMetadata(t)
								}, e.map(encodeLink)),
								encodeLink = e => ({
									Name: "",
									Tsize: e.dagByteLength,
									Hash: e.cid
								}),
								encodeSimpleFile = (e, t = BLANK$2) => encodePB({
									Type: NodeType.File,
									Data: e.byteLength > 0 ? e : void 0,
									filesize: e.byteLength,
									blocksizes: [],
									...encodeMetadata(t)
								}, []),
								encodeComplexFile = (e, t, r = BLANK$2) => encodePB({
									Type: NodeType.File,
									Data: e,
									filesize: e.byteLength + cumulativeContentByteLength(t),
									blocksizes: t.map(contentByteLength)
								}, t.map(encodeLink)),
								encodeDirectory$1 = e => encodePB({
									Type: e.type,
									...encodeDirectoryMetadata(e.metadata || BLANK$2)
								}, e.entries.map(encodeNamedLink)),
								encodeHAMTShard = ({
									bitfield: e,
									fanout: t,
									hashType: r,
									entries: n,
									metadata: o = BLANK$2
								}) => encodePB({
									Type: NodeType.HAMTShard,
									Data: e.byteLength > 0 ? e : void 0,
									fanout: readFanout(t),
									hashType: readInt(r),
									...encodeDirectoryMetadata(o)
								}, n.map(encodeNamedLink)),
								readFanout = e => {
									if (Math.log2(e) % 1 == 0) return e;
									throw new TypeError(`Expected hamt size to be a power of two instead got ${e}`)
								},
								readInt = e => {
									if (Number.isInteger(e)) return e;
									throw new TypeError(`Expected an integer value instead got ${e}`)
								},
								createSymlink = (e, t = BLANK$2) => ({
									type: NodeType.Symlink,
									content: e,
									metadata: decodeMetadata(t)
								}),
								encodeSymlink = (e, t = !1) => {
									const r = t ? BLANK$2 : Object(e).metadata;
									return encodePB({
										Type: NodeType.Symlink,
										Data: e.content,
										...encodeMetadata(r || BLANK$2)
									}, [])
								},
								encode = (e, t = !0) => {
									switch (e.type) {
										case NodeType.Raw:
											return encodeRaw(e.content);
										case NodeType.File:
											return encodeFile$1(e);
										case NodeType.Directory:
											return encodeDirectory$1(e);
										case NodeType.HAMTShard:
											return encodeHAMTShard(e);
										case NodeType.Symlink:
											return encodeSymlink(e);
										default:
											throw new Error(`Unknown node type ${Object(e).type}`)
									}
								},
								decode = e => {
									const t = decode$1(e),
										r = Data.decode(t.Data),
										{
											Type: n,
											Data: o,
											mtime: i,
											mode: s,
											blocksizes: a,
											...c
										} = Data.toObject(r, {
											defaults: !1,
											arrays: !0,
											longs: Number,
											objects: !1
										}),
										u = {
											...s && {
												mode: s
											},
											...decodeMtime(i)
										},
										d = t.Links;
									switch (r.Type) {
										case NodeType.Raw:
											return createRaw(o);
										case NodeType.File:
											return 0 === d.length ? new SimpleFileView(o, u) : 0 === o.byteLength ? new AdvancedFileView(decodeFileLinks(c.blocksizes, d), u) : new ComplexFileView(o, decodeFileLinks(c.blocksizes, d), u);
										case NodeType.Directory:
											return createFlatDirectory(decodeDirectoryLinks(d), u);
										case NodeType.HAMTShard:
											return createShardedDirectory(decodeDirectoryLinks(t.Links), o || EMPTY_BUFFER$1, c.fanout, c.hashType, u);
										case NodeType.Symlink:
											return createSymlink(o, u);
										default:
											throw new TypeError(`Unsupported node type ${r.Type}`)
									}
								},
								decodeMtime = e => null == e ? void 0 : {
									mtime: {
										secs: e.Seconds,
										nsecs: e.FractionalNanoseconds || 0
									}
								},
								decodeFileLinks = (e, t) => {
									const r = [],
										n = e.length;
									for (; 0 < n;) r.push({
										cid: t[0].Hash,
										dagByteLength: t[0].Tsize || 0,
										contentByteLength: e[0]
									});
									return r
								},
								decodeDirectoryLinks = e => e.map((e => ({
									cid: e.Hash,
									name: e.Name || "",
									dagByteLength: e.Tsize || 0
								}))),
								cumulativeContentByteLength = e => e.reduce(((e, t) => e + t.contentByteLength), 0),
								cumulativeDagByteLength = (e, t) => t.reduce(((e, t) => e + t.dagByteLength), e.byteLength),
								contentByteLength = e => e.contentByteLength,
								encodeNamedLink = ({
									name: e,
									dagByteLength: t,
									cid: r
								}) => ({
									Name: e,
									Tsize: t,
									Hash: r
								}),
								encodeDirectoryMetadata = e => encodeMetadata(e, DEFAULT_DIRECTORY_MODE),
								encodeMetadata = ({
									mode: e,
									mtime: t
								}, r = DEFAULT_FILE_MODE) => ({
									mode: null != e ? encodeMode(e, r) : void 0,
									mtime: null != t ? encodeMTime(t) : void 0
								}),
								decodeMetadata = e => null == e ? BLANK$2 : {
									...null == e.mode ? void 0 : {
										mode: decodeMode(e.mode)
									},
									...null == e.mtime ? void 0 : {
										mtime: e.mtime
									}
								},
								encodeMTime = e => null == e ? void 0 : 0 !== e.nsecs ? {
									Seconds: e.secs,
									FractionalNanoseconds: e.nsecs
								} : {
									Seconds: e.secs
								},
								encodeMode = (e, t) => {
									const r = null == e ? void 0 : decodeMode(e);
									return r === t || null == r ? void 0 : r
								},
								decodeMode = e => 4095 & e | 4294963200 & e,
								matchFile = ({
									content: e = EMPTY_BUFFER$1,
									parts: t = EMPTY$3,
									metadata: r = BLANK$2 }) => 0 === t.length ? new SimpleFileView(e, r) : 0 === e.byteLength ? new AdvancedFileView(t, r) : new ComplexFileView(e, t, r);
							class SimpleFileView {
								constructor(e, t) {
									this.content = e, this.metadata = t, this.layout = "simple", this.type = NodeType.File
								}
								get filesize() {
									return this.content.byteLength
								}
								encode() {
									return encodeSimpleFile(this.content, this.metadata)
								}
							}
							class AdvancedFileView {
								constructor(e, t) {
									this.parts = e, this.metadata = t
								}
								get layout() {
									return "advanced"
								}
								get type() {
									return NodeType.File
								}
								get fileSize() {
									return cumulativeContentByteLength(this.parts)
								}
								get blockSizes() {
									return this.parts.map(contentByteLength)
								}
								encode() {
									return encodeAdvancedFile(this.parts, this.metadata)
								}
							}
							class ComplexFileView {
								constructor(e, t, r) {
									this.content = e, this.parts = t, this.metadata = r
								}
								get layout() {
									return "complex"
								}
								get type() {
									return NodeType.File
								}
								get fileSize() {
									return this.content.byteLength + cumulativeContentByteLength(this.parts)
								}
								get blockSizes() {
									return this.parts.map(contentByteLength)
								}
								encode() {
									return encodeComplexFile(this.content, this.parts, this.metadata)
								}
							}
							const filesize = e => {
								switch (e.type) {
									case NodeType.Raw:
									case NodeType.Symlink:
										return e.content.byteLength;
									case NodeType.File:
										switch (e.layout) {
											case "simple":
												return e.content.byteLength;
											case "advanced":
												return cumulativeContentByteLength(e.parts);
											case "complex":
												return e.content.byteLength + cumulativeContentByteLength(e.parts)
										}
									default:
										return 0
								}
							};
							var UnixFS = Object.freeze({
								__proto__: null,
								DEFAULT_FILE_MODE: DEFAULT_FILE_MODE,
								DEFAULT_DIRECTORY_MODE: DEFAULT_DIRECTORY_MODE,
								code: code,
								name: name$1,
								createRaw: createRaw,
								createEmptyFile: createEmptyFile,
								createSimpleFile: createSimpleFile,
								createFileChunk: createFileChunk,
								createAdvancedFile: createAdvancedFile,
								createFileShard: createFileShard,
								createComplexFile: createComplexFile,
								createFlatDirectory: createFlatDirectory,
								createShardedDirectory: createShardedDirectory,
								createDirectoryShard: createDirectoryShard,
								encodeRaw: encodeRaw,
								encodeFile: encodeFile$1,
								encodeFileChunk: encodeFileChunk,
								encodeFileShard: encodeFileShard,
								encodeAdvancedFile: encodeAdvancedFile,
								encodeLink: encodeLink,
								encodeSimpleFile: encodeSimpleFile,
								encodeComplexFile: encodeComplexFile,
								encodeDirectory: encodeDirectory$1,
								encodeHAMTShard: encodeHAMTShard,
								createSymlink: createSymlink,
								encodeSymlink: encodeSymlink,
								encode: encode,
								decode: decode,
								cumulativeContentByteLength: cumulativeContentByteLength,
								cumulativeDagByteLength: cumulativeDagByteLength,
								encodeDirectoryMetadata: encodeDirectoryMetadata,
								encodeMetadata: encodeMetadata,
								decodeMetadata: decodeMetadata,
								encodeMode: encodeMode,
								matchFile: matchFile,
								filesize: filesize,
								NodeType: NodeType
							});
							const effect = function* (e) {
								const t = yield* e;
								yield* send(t)
							};

							function* current() {
								return yield CURRENT
							}
							const suspend = function* () {
								yield SUSPEND
							},
								wait = function* (e) {
									const t = yield* current();
									if (isAsync(e)) {
										let r, n = !1;
										if (e.then((e => {
											n = !1, r = e, enqueue(t)
										}), (e => {
											n = !0, r = e, enqueue(t)
										})), yield* suspend(), n) throw r;
										return r
									}
									return main(wake(t)), yield* suspend(), e
								};

							function* wake(e) {
								enqueue(e)
							}
							const isAsync = e => null != e && "function" == typeof e.then,
								send = function* (e) {
									yield e
								},
								listen = function* (e) {
									const t = [];
									for (const r of Object.entries(e)) {
										const [e, n] = r;
										n !== NONE && t.push(yield* fork$1(tag(n, e)))
									}
									yield* group(t)
								},
								effects = e => e.length > 0 ? batch(e.map(effect)) : NONE;

							function* batch(e) {
								const t = [];
								for (const r of e) t.push(yield* fork$1(r));
								yield* group(t)
							}
							const tag = (e, t) => e === NONE ? NONE : e instanceof Tagger ? new Tagger([...e.tags, t], e.source) : new Tagger([t], e);
							class Tagger {
								constructor(e, t) {
									this.tags = e, this.source = t, this.controller
								} [Symbol.iterator]() {
									return this.controller || (this.controller = this.source[Symbol.iterator]()), this
								}
								box(e) {
									if (e.done) return e;
									switch (e.value) {
										case SUSPEND:
										case CURRENT:
											return e;
										default: {
											const t = e;
											let {
												value: r
											} = t;
											for (const e of this.tags) r = withTag(e, r);
											return t.value = r, t
										}
									}
								}
								next(e) {
									return this.box(this.controller.next(e))
								}
								throw(e) {
									return this.box(this.controller.throw(e))
								}
								return(e) {
									return this.box(this.controller.return(e))
								}
								get [Symbol.toStringTag]() {
									return "TaggedEffect"
								}
							}
							const none = () => NONE,
								withTag = (e, t) => ({
									type: e,
									[e]: t
								}),
								CURRENT = Symbol("current"),
								SUSPEND = Symbol("suspend");
							class Group {
								static of(e) {
									return e.group || MAIN
								}
								static enqueue(e, t) {
									e.group = t, t.stack.active.push(e)
								}
								constructor(e, t = [], r = new Set, n = new Stack(t, r)) {
									this.driver = e, this.parent = Group.of(e), this.stack = n, this.id = ++ID
								}
							}
							class Main {
								constructor() {
									this.status = IDLE, this.stack = new Stack, this.id = 0
								}
							}
							class Stack {
								constructor(e = [], t = new Set) {
									this.active = e, this.idle = t
								}
								static size({
									active: e,
									idle: t
								}) {
									return e.length + t.size
								}
							}
							const main = e => enqueue(e[Symbol.iterator]()),
								enqueue = e => {
									let t = Group.of(e);
									for (t.stack.active.push(e), t.stack.idle.delete(e); t.parent;) {
										const {
											idle: e,
											active: r
										} = t.parent.stack;
										if (!e.has(t.driver)) break;
										e.delete(t.driver), r.push(t.driver), t = t.parent
									}
									if (MAIN.status === IDLE)
										for (MAIN.status = ACTIVE; ;) try {
											for (const { } of step(MAIN));
											MAIN.status = IDLE;
											break
										} catch (e) {
											MAIN.stack.active.shift()
										}
								},
								resume = e => enqueue(e),
								step = function* (e) {
									const {
										active: t
									} = e.stack;
									let r = t[0];
									for (e.stack.idle.delete(r); r;) {
										let n = INIT;
										e: for (; !n.done && r === t[0];) {
											const t = n.value;
											switch (t) {
												case SUSPEND:
													e.stack.idle.add(r);
													break e;
												case CURRENT:
													n = r.next(r);
													break;
												default:
													n = r.next(yield t)
											}
										}
										t.shift(), r = t[0], e.stack.idle.delete(r)
									}
								},
								fork$1 = (e, t) => new Fork(e, t),
								exit = (e, t) => conclude(e, {
									ok: !0,
									value: t
								}),
								abort = (e, t) => conclude(e, {
									ok: !1,
									error: t
								});

							function* conclude(e, t) {
								try {
									const r = e,
										n = t.ok ? r.return(t.value) : r.throw(t.error);
									if (!n.done)
										if (n.value === SUSPEND) {
											const {
												idle: e
											} = Group.of(r).stack;
											e.add(r)
										} else enqueue(r)
								} catch (e) { }
							}

							function* group(e) {
								if (0 === e.length) return;
								const t = yield* current(), r = new Group(t);
								let n = null;
								for (const t of e) {
									const {
										result: e
									} = t;
									e ? e.ok || n || (n = e) : move(t, r)
								}
								try {
									if (n) throw n.error;
									for (; yield* step(r), Stack.size(r.stack) > 0;) yield* suspend()
								} catch (e) {
									for (const t of r.stack.active) yield* abort(t, e);
									for (const t of r.stack.idle) yield* abort(t, e), enqueue(t);
									throw e
								}
							}
							const move = (e, t) => {
								const r = Group.of(e);
								if (r !== t) {
									const {
										active: n,
										idle: o
									} = r.stack, i = t.stack;
									if (e.group = t, o.has(e)) o.delete(e), i.idle.add(e);
									else {
										const t = n.indexOf(e);
										t >= 0 && (n.splice(t, 1), i.active.push(e))
									}
								}
							};

							function* join(e) {
								e.status === IDLE && (yield* e), e.result || (yield* group([e]));
								const t = e.result;
								if (t.ok) return t.value;
								throw t.error
							}
							class Future {
								constructor(e) {
									this.handler = e, this.result
								}
								get promise() {
									const {
										result: e
									} = this, t = null == e ? new Promise(((e, t) => {
										this.handler.onsuccess = e, this.handler.onfailure = t
									})) : e.ok ? Promise.resolve(e.value) : Promise.reject(e.error);
									return Object.defineProperty(this, "promise", {
										value: t
									}), t
								}
								then(e, t) {
									return this.activate().promise.then(e, t)
								} catch(e) {
									return this.activate().promise.catch(e)
								} finally(e) {
									return this.activate().promise.finally(e)
								}
								activate() {
									return this
								}
							}
							class Fork extends Future {
								constructor(e, t = BLANK$1, r = {}, n = INIT) {
									super(r), this.id = ++ID, this.name = t.name || "", this.task = e, this.state = n, this.status = IDLE, this.result, this.handler = r, this.controller
								} * resume() {
									resume(this)
								}
								join() {
									return join(this)
								}
								abort(e) {
									return abort(this, e)
								}
								exit(e) {
									return exit(this, e)
								}
								get [Symbol.toStringTag]() {
									return "Fork"
								} *[Symbol.iterator]() {
									return this.activate()
								}
								activate() {
									return this.controller = this.task[Symbol.iterator](), this.status = ACTIVE, enqueue(this), this
								}
								panic(e) {
									this.result = {
										ok: !1,
										error: e
									}, this.status = FINISHED;
									const {
										handler: t
									} = this;
									throw t.onfailure && t.onfailure(e), e
								}
								step(e) {
									if (this.state = e, e.done) {
										this.result = {
											ok: !0,
											value: e.value
										}, this.status = FINISHED;
										const {
											handler: t
										} = this;
										t.onsuccess && t.onsuccess(e.value)
									}
									return e
								}
								next(e) {
									try {
										return this.step(this.controller.next(e))
									} catch (e) {
										return this.panic(e)
									}
								}
								return(e) {
									try {
										return this.step(this.controller.return(e))
									} catch (e) {
										return this.panic(e)
									}
								}
								throw(e) {
									try {
										return this.step(this.controller.throw(e))
									} catch (e) {
										return this.panic(e)
									}
								}
							}
							const loop = function* (e, t) {
								const r = yield* current(), n = new Group(r);
								for (Group.enqueue(e[Symbol.iterator](), n); ;) {
									for (const e of step(n)) Group.enqueue(t(e)[Symbol.iterator](), n);
									if (!(Stack.size(n.stack) > 0)) break;
									yield* suspend()
								}
							};
							let ID = 0;
							const IDLE = "idle",
								ACTIVE = "active",
								FINISHED = "finished",
								INIT = {
									done: !1,
									value: CURRENT
								},
								BLANK$1 = {},
								NONE = function* () { }(),
								MAIN = new Main;

							function Indexed() { }
							Object.defineProperties(Indexed, {
								prototype: {
									value: new Proxy(Object.prototype, {
										get: (e, t, r) => "symbol" == typeof t ? Reflect.get(e, t, r) : r.get(t)
									})
								}
							});
							const empty = () => new BufferView,
								slice = (e, t = 0, r = e.byteLength) => {
									const n = [],
										o = t < 0 ? e.byteLength - t : t,
										i = r < 0 ? e.byteLength - r : r;
									if (0 === o && i >= e.byteLength) return e;
									if (o > i || o > e.byteLength || i <= 0) return empty();
									let s = 0,
										a = 0;
									for (const t of e.segments) {
										const e = a + t.byteLength;
										if (0 === s) {
											if (i <= e) {
												const e = t.subarray(o - a, i - a);
												n.push(e), s = e.byteLength;
												break
											}
											if (o < e) {
												const e = o === a ? t : t.subarray(o - a);
												n.push(e), s = e.byteLength
											}
										} else {
											if (i <= e) {
												const r = i === e ? t : t.subarray(0, i - a);
												n.push(r), s += r.byteLength;
												break
											}
											n.push(t), s += t.byteLength
										}
										a = e
									}
									return new BufferView(n, e.byteOffset + o, s)
								},
								push = (e, t) => t.byteLength > 0 ? (e.segments.push(t), new BufferView(e.segments, e.byteOffset, e.byteLength + t.byteLength)) : e,
								get = (e, t) => {
									if (t < e.byteLength) {
										let r = 0;
										for (const n of e.segments) {
											if (t < r + n.byteLength) return n[t - r];
											r += n.byteLength
										}
									}
								},
								copyTo = (e, t, r) => {
									let n = r;
									for (const r of e.segments) t.set(r, n), n += r.byteLength;
									return t
								};

							function* iterate(e) {
								for (const t of e.segments) yield* t
							}
							class BufferView extends Indexed {
								constructor(e = [], t = 0, r = 0) {
									super(), this.segments = e, this.byteLength = r, this.length = r, this.byteOffset = t
								} [Symbol.iterator]() {
									return iterate(this)
								}
								slice(e, t) {
									return slice(this, e, t)
								}
								subarray(e, t) {
									return slice(this, e, t)
								}
								push(e) {
									return push(this, e)
								}
								get(e) {
									return get(this, e)
								}
								copyTo(e, t) {
									return copyTo(this, e, t)
								}
							}
							const panic = e => {
								throw new Error(e)
							},
								unreachable = (e, t, ...r) => panic(String.raw(e, JSON.stringify(t), ...r)),
								EMPTY_BUFFER = new Uint8Array(0),
								EMPTY$2 = [],
								open$1 = e => ({
									config: e,
									buffer: empty()
								}),
								write$3 = (e, t) => t.byteLength > 0 ? split(e.config, e.buffer.push(t), !1) : {
									...e,
									chunks: EMPTY$2
								},
								close$5 = e => split(e.config, e.buffer, !0),
								split = (e, t, r) => {
									const n = e.chunker,
										o = [];
									let i = 0;
									for (const e of n.cut(n.context, t, r))
										if (e > 0) {
											const r = t.subarray(i, i + e);
											o.push(r), i += e
										} return {
											config: e,
											chunks: o,
											buffer: t.subarray(i)
										}
								},
								mutable = () => ({
									mutable: !0,
									needs: {},
									nodes: {},
									links: {},
									linked: EMPTY$1
								}),
								addNodes = (e, t) => {
									let r = patch(t, {});
									for (const t of e) {
										const {
											ready: e,
											has: n,
											wants: o
										} = collect$1(t.children, r.links);
										r = 0 === o.length ? patch(r, {
											links: assign(void 0, n),
											linked: [{
												id: t.id,
												links: e
											}]
										}) : patch(r, {
											needs: assign(t.id, o),
											nodes: {
												[t.id]: {
													children: t.children,
													count: o.length
												}
											}
										})
									}
									return r
								},
								addLink = (e, t, r) => {
									const n = r.needs[e],
										o = r.nodes[n];
									if (null != o) {
										if (1 === o.count) {
											const {
												ready: i,
												has: s
											} = collect$1(o.children, {
												...r.links,
												[e]: t
											});
											return patch(r, {
												needs: {
													[e]: void 0
												},
												links: assign(void 0, s),
												nodes: {
													[n]: void 0
												},
												linked: [{
													id: n,
													links: i
												}]
											})
										}
										return patch(r, {
											needs: {
												[e]: void 0
											},
											links: {
												[e]: t
											},
											nodes: {
												[n]: {
													...o,
													count: o.count - 1
												}
											}
										})
									}
									return patch(r, {
										links: {
											[e]: t
										}
									})
								},
								patch = (e, {
									needs: t,
									nodes: r,
									links: n,
									linked: o
								}) => {
									const i = e.mutable ? e : {
										...e
									},
										s = e.mutable ? BLANK : void 0;
									return t && (i.needs = patchDict(e.needs, t, s)), r && (i.nodes = patchDict(e.nodes, r, s)), n && (i.links = patchDict(e.links, n, s)), i.linked = o ? append(e.linked || EMPTY$1, o, EMPTY$1) : e.linked || [], i
								},
								assign = (e, t) => {
									const r = {};
									for (const n of t) r[n] = e;
									return r
								},
								patchDict = (e, t, r = e) => {
									const n = e === r ? {
										...e
									} : e;
									for (const e of Object.entries(t)) {
										const [t, r] = e;
										null == r ? delete n[t] : n[t] = r
									}
									return n
								},
								append = (e, t, r = e) => {
									if (e === r) return [...e, ...t];
									for (const r of t) e.push(r);
									return e
								},
								collect$1 = (e, t) => {
									const r = [],
										n = [],
										o = [];
									for (const i of e) {
										const e = t[i];
										e ? (r.push(i), o.push(e)) : n.push(i)
									}
									return {
										has: r,
										wants: n,
										ready: o
									}
								},
								EMPTY$1 = Object.freeze([]),
								BLANK = Object.freeze({}),
								update = (e, t) => {
									switch (e.type) {
										case "write":
											return write$2(t, e.bytes);
										case "link":
											return link(t, e.link);
										case "block":
										case "end":
											return {
												state: t, effect: none()
											};
										case "close":
											return close$4(t);
										default:
											return unreachable`File Writer got unknown message ${e}`
									}
								},
								init = (e, t, r) => ({
									status: "open",
									metadata: t,
									config: r,
									writer: e,
									chunker: open$1({
										chunker: r.chunker
									}),
									layout: r.fileLayout.open(),
									nodeQueue: mutable()
								}),
								write$2 = (e, t) => {
									if ("open" === e.status) {
										const {
											chunks: r,
											...n
										} = write$3(e.chunker, t), {
											nodes: o,
											leaves: i,
											layout: s
										} = e.config.fileLayout.write(e.layout, r), {
											linked: a,
											...c
										} = addNodes(o, e.nodeQueue), u = [...encodeLeaves(i, e.config), ...encodeBranches(a, e.config)];
										return {
											state: {
												...e,
												chunker: n,
												layout: s,
												nodeQueue: c
											},
											effect: listen({
												link: effects(u)
											})
										}
									}
									return panic("Unable to perform write on closed file")
								},
								link = (e, {
									id: t,
									link: r,
									block: n
								}) => {
									let {
										linked: o,
										...i
									} = addLink(t, r, e.nodeQueue);
									const s = encodeBranches(o, e.config),
										a = "closed" === e.status && t === e.rootID ? {
											...e,
											status: "linked",
											link: r,
											nodeQueue: i
										} : {
											...e,
											nodeQueue: i
										},
										c = "closed" === e.status && t === e.rootID && e.end ? e.end.resume() : none();
									return {
										state: a,
										effect: listen({
											link: effects(s),
											block: writeBlock(e.writer, n),
											end: c
										})
									}
								},
								close$4 = e => {
									if ("open" === e.status) {
										const {
											chunks: t
										} = close$5(e.chunker), {
											layout: r,
											...n
										} = e.config.fileLayout.write(e.layout, t), {
											root: o,
											...i
										} = e.config.fileLayout.close(r, e.metadata), [s, a] = isLeafNode(o) ? [
											[...n.nodes, ...i.nodes],
											[...n.leaves, ...i.leaves, o]
										] : [
											[...n.nodes, ...i.nodes, o],
											[...n.leaves, ...i.leaves]
										], {
											linked: c,
											...u
										} = addNodes(s, e.nodeQueue), d = [...encodeLeaves(a, e.config), ...encodeBranches(c, e.config)], l = fork$1(suspend());
										return {
											state: {
												...e,
												chunker: null,
												layout: null,
												rootID: o.id,
												status: "closed",
												end: l,
												nodeQueue: u
											},
											effect: listen({
												link: effects(d),
												end: join(l)
											})
										}
									}
									return {
										state: e,
										effect: none()
									}
								},
								encodeLeaves = (e, t) => e.map((e => encodeLeaf(t, e, t.fileChunkEncoder))),
								encodeLeaf = function* ({
									hasher: e,
									linker: t
								}, {
									id: r,
									content: n
								}, o) {
									const i = o.encode(n ? asUint8Array(n) : EMPTY_BUFFER),
										s = yield* wait(e.digest(i)), a = t.createLink(o.code, s);
									return {
										id: r,
										block: {
											cid: a,
											bytes: i
										},
										link: {
											cid: a,
											contentByteLength: n ? n.byteLength : 0,
											dagByteLength: i.byteLength
										}
									}
								},
								encodeBranches = (e, t) => e.map((e => encodeBranch(t, e))),
								encodeBranch = function* (e, {
									id: t,
									links: r
								}, n) {
									const o = e.fileEncoder.encode({
										type: NodeType.File,
										layout: "advanced",
										parts: r,
										metadata: n
									}),
										i = yield* wait(Promise.resolve(e.hasher.digest(o))), s = e.linker.createLink(e.fileEncoder.code, i);
									return {
										id: t,
										block: {
											bytes: o,
											cid: s
										},
										link: {
											cid: s,
											contentByteLength: cumulativeContentByteLength(r),
											dagByteLength: cumulativeDagByteLength(o, r)
										}
									}
								},
								writeBlock = function* (e, t) {
									(e.desiredSize || 0) <= 0 && (yield* wait(e.ready)), e.write(t)
								},
								asUint8Array = e => e instanceof Uint8Array ? e : e.copyTo(new Uint8Array(e.byteLength), 0),
								isLeafNode = e => null == e.children,
								name = "fixed",
								context = {
									maxChunkSize: 262144
								},
								type = "Stateless",
								withMaxChunkSize = e => ({
									type: "Stateless",
									context: {
										maxChunkSize: e
									},
									name: name,
									cut: cut
								}),
								cut = ({
									maxChunkSize: e
								}, {
									byteLength: t
								}, r) => {
									const n = t / e | 0,
										o = new Array(n).fill(e),
										i = r ? t - n * e : 0;
									return i > 0 && o.push(i), o
								};
							var FixedSize = Object.freeze({
								__proto__: null,
								name: name,
								context: context,
								type: type,
								withMaxChunkSize: withMaxChunkSize,
								cut: cut
							});
							class Node {
								constructor(e, t, r) {
									this.id = e, this.children = t, this.metadata = r
								}
							}
							const withWidth = e => ({
								open: () => open({
									width: e
								}),
								write: write$1,
								close: close$3
							}),
								defaults$2 = {
									width: 174
								},
								open = ({
									width: e
								} = defaults$2) => ({
									width: e,
									head: null,
									leafIndex: [],
									nodeIndex: [],
									lastID: 0
								}),
								write$1 = (e, t) => {
									if (0 === t.length) return {
										layout: e,
										nodes: EMPTY,
										leaves: EMPTY
									}; {
										let {
											lastID: r
										} = e;
										const [n, o] = e.head ? [null, (t.unshift(e.head), t)] : 1 === t.length && 0 === e.leafIndex.length ? [t[0], EMPTY] : [null, t];
										if (0 === o.length) return {
											layout: {
												...e,
												head: n
											},
											nodes: EMPTY,
											leaves: EMPTY
										}; {
											const t = [...e.leafIndex],
												i = [];
											for (const e of o) {
												const n = {
													id: ++r,
													content: e
												};
												i.push(n), t.push(n.id)
											}
											return t.length >= e.width ? flush({
												...e,
												leafIndex: t,
												head: n,
												lastID: r
											}, i) : {
												layout: {
													...e,
													head: n,
													leafIndex: t,
													lastID: r
												},
												leaves: i,
												nodes: EMPTY
											}
										}
									}
								},
								flush = (e, t = EMPTY, r = [], n = !1) => {
									let {
										lastID: o
									} = e;
									const i = e.nodeIndex.map((e => [...e])),
										s = [...e.leafIndex],
										{
											width: a
										} = e;
									for (; s.length >= a || s.length > 0 && n;) {
										grow(i, 1);
										const e = new Node(++o, s.splice(0, a));
										i[0].push(e.id), r.push(e)
									}
									let c = 0;
									for (; c < i.length;) {
										const e = i[c];
										for (c++; e.length >= a || e.length > 0 && n && c < i.length;) {
											const t = new Node(++o, e.splice(0, a));
											grow(i, c + 1), i[c].push(t.id), r.push(t)
										}
									}
									return {
										layout: {
											...e,
											lastID: o,
											leafIndex: s,
											nodeIndex: i
										},
										leaves: t,
										nodes: r
									}
								},
								close$3 = (e, t) => {
									const r = e;
									if (e.head) return {
										root: {
											id: 1,
											content: e.head,
											metadata: t
										},
										leaves: EMPTY,
										nodes: EMPTY
									};
									if (0 === e.leafIndex.length) return {
										root: {
											id: 1,
											metadata: t
										},
										leaves: EMPTY,
										nodes: EMPTY
									}; {
										const {
											nodes: e,
											layout: n
										} = flush(r, EMPTY, [], !0), {
											nodeIndex: o
										} = n, i = o[o.length - 1];
										if (1 === i.length) {
											const t = e[e.length - 1];
											return e.length = e.length - 1, {
												root: t,
												nodes: e,
												leaves: EMPTY
											}
										}
										return {
											root: new Node(n.lastID + 1, i, t),
											nodes: e,
											leaves: EMPTY
										}
									}
								},
								grow = (e, t) => {
									for (; e.length < t;) e.push([]);
									return e
								},
								EMPTY = [],
								defaults$1 = () => ({
									chunker: FixedSize,
									fileChunkEncoder: UnixFSLeaf,
									smallFileEncoder: UnixFSLeaf,
									fileEncoder: UnixFS,
									fileLayout: withWidth(174),
									hasher: sha256,
									linker: {
										createLink: CID.createV1
									}
								}),
								configure = e => ({
								}),
								UnixFSLeaf = {
								},
								create$2 = ({
								}) => new FileWriterView(init(e, t, configure(r))),
								write = async (e, t) => (await perform(e, send({
								})), e), close$2 = async (e, {
								} = {}) => {
								}, perform = (e, t) => fork$1(loop(t, (t => {
									const {
										state: r,
										effect: n
									} = update(t, e.state);
									return e.state = r, n
								})));
							class FileWriterView {

							}
							const defaults = defaults$1,
								create$1 = ({
								}) => new DirectoryWriter({
								}),
								set = (e, t, r, {
									overwrite: n = !1
								} = {}) => {
									const o = asWritable(e.state);
									if (t.includes("/")) throw new Error(`Directory entry name "${t}" contains forbidden "/" character`);
									if (!n && o.entries.has(t)) throw new Error(`Directory already contains entry with name "${t}"`);
									return o.entries.set(t, r), e
								},
								remove = (e, t) => (asWritable(e.state).entries.delete(t), e),
								asWritable = e => {
									if (e.closed) throw new Error("Can not change written directory, but you can .fork() and make changes to it");
									return e
								},
								close$1 = async (e, {
									closeWriter: t = !1,
									releaseLock: r = !1
								} = {}) => {
									const {
										writer: n,
										settings: o,
										metadata: i
									} = asWritable(e.state);
									e.state.closed = !0;
									const s = [...links(e)],
										a = createFlatDirectory(s, i),
										c = encodeDirectory$1(a),
										u = await o.hasher.digest(c),
										d = o.linker.createLink(code, u);
									return (n.desiredSize || 0) <= 0 && await n.ready, n.write({
										cid: d,
										bytes: c
									}), t ? await n.close() : r && n.releaseLock(), {
										cid: d,
										dagByteLength: cumulativeDagByteLength(c, s)
									}
								}, links = function* ({
									state: e
								}) {
									for (const [t, {
										dagByteLength: r,
										cid: n
									}] of e.entries) yield {
										name: t,
										dagByteLength: r,
										cid: n
									}
								}, fork = ({
									state: e
								}, {
									writer: t = e.writer,
									metadata: r = e.metadata,
									settings: n = e.settings
								} = {}) => new DirectoryWriter({
									writer: t,
									metadata: r,
									settings: n,
									entries: new Map(e.entries.entries()),
									closed: !1
								});
							class DirectoryWriter {
								constructor(e) {
									this.state = e
								}
								get writer() {
									return this.state.writer
								}
								get settings() {
									return this.state.settings
								}
								links() {
									return links(this)
								}
								set(e, t, r) {
									return set(this, e, t, r)
								}
								remove(e) {
									return remove(this, e)
								}
								fork(e) {
									return fork(this, e)
								}
								close(e) {
									return close$1(this, e)
								}
								entries() {
									return this.state.entries.entries()
								}
								has(e) {
									return this.state.entries.has(e)
								}
								get size() {
									return this.state.entries.size
								}
							}
							const createWriter = ({
								writable: e,
								settings: t = defaults$1()
							}) => new FileSystemWriter({
								writer: e.getWriter(),
								settings: t
							}),
								close = async (e, {
									releaseLock: t = !0,
									closeWriter: r = !0
								} = {}) => (r ? await e.writer.close() : t && e.writer.releaseLock(), e);
							class FileSystemWriter {
								constructor({
									writer: e,
									settings: t
								}) {
									this.writer = e, this.settings = configure(t)
								}
								createFileWriter({
									settings: e = this.settings,
									metadata: t
								} = {}) {
									return create$2({
										writer: this.writer,
										settings: e,
										metadata: t
									})
								}
								createDirectoryWriter({
									settings: e = this.settings,
									metadata: t
								} = {}) {
									return create$1({
										writer: this.writer,
										settings: e,
										metadata: t
									})
								}
								close(e) {
									return close(this, e)
								}
							}
							const BLOCK_SIZE_LIMIT = 1048576,
								defaultCapacity = 100 * BLOCK_SIZE_LIMIT,
								withCapacity = (e = defaultCapacity) => ({
									highWaterMark: e,
									size: e => e.bytes.length
								});

							function toIterable(e) {
								if (null != e[Symbol.asyncIterator]) return e;
								if ("getReader" in e) return async function* () {
									const t = e.getReader();
									try {
										for (; ;) {
											const {
												done: e,
												value: r
											} = await t.read();
											if (e) return;
											yield r
										}
									} finally {
										t.releaseLock()
									}
								}();
								throw new Error("unknown stream")
							}
							const queuingStrategy = withCapacity(183500800),
								settings = configure({
									fileChunkEncoder: raw,
									smallFileEncoder: raw
								});

							function encodeFile(e) {
								const {
									readable: t,
									writable: r
								} = new TransformStream({}, queuingStrategy), n = createWriter({
									writable: r,
									settings: settings
								}), o = new UnixFsFileBuilder(e);
								return {
									cid: (async () => {
										const {
											cid: e
										} = await o.finalize(n);
										return await n.close(), e
									})(),
									blocks: t
								}
							}
							var _file = _classPrivateFieldLooseKey("file");
							class UnixFsFileBuilder {
								constructor(e) {
									Object.defineProperty(this, _file, {
										writable: !0,
										value: void 0
									}), _classPrivateFieldLooseBase(this, _file)[_file] = e
								}
								async finalize(e) {
									const t = create$2(e),
										r = toIterable(_classPrivateFieldLooseBase(this, _file)[_file].stream());
									for await (const e of r) await t.write(e);
									return await t.close()
								}
							}
							class UnixFSDirectoryBuilder {
								constructor() {
									this.entries = new Map
								}
								async finalize(e) {
									const t = create$1(e);
									for (const [r, n] of this.entries) {
										const o = await n.finalize(e);
										t.set(r, o)
									}
									return await t.close()
								}
							}

							function encodeDirectory(e) {
								const t = new UnixFSDirectoryBuilder;
								for (const r of e) {
									const e = r.name.split("/");
									"" !== e[0] && "." !== e[0] || e.shift();
									let n = t;
									for (const [t, o] of e.entries()) {
										if (t === e.length - 1) {
											n.entries.set(o, new UnixFsFileBuilder(r));
											break
										}
										let i = n.entries.get(o);
										if (null == i && (i = new UnixFSDirectoryBuilder, n.entries.set(o, i)), !(i instanceof UnixFSDirectoryBuilder)) throw new Error(`"${o}" cannot be a file and a directory`);
										n = i
									}
								}
								const {
									readable: r,
									writable: n
								} = new TransformStream({}, queuingStrategy), o = createWriter({
									writable: n,
									settings: settings
								});
								return {
									cid: (async () => {
										const {
											cid: e
										} = await t.finalize(o);
										return await o.close(), e
									})(),
									blocks: r
								}
							}

							function createHeader(e) {
								const t = encode$e({
									version: 1,
									roots: e
								}),
									r = varint.encode(t.length),
									n = new Uint8Array(r.length + t.length);
								return n.set(r, 0), n.set(t, r.length), n
							}

							function createEncoder(e) {
								return {
									async setRoots(t) {
										const r = createHeader(t);
										await e.write(r)
									},
									async writeBlock(t) {
										const {
											cid: r,
											bytes: n
										} = t;
										await e.write(new Uint8Array(varint.encode(r.bytes.length + n.length))), await e.write(r.bytes), n.length && await e.write(n)
									},
									async close() {
										await e.end()
									}
								}
							}

							function noop() { }

							function create() {
								const e = [];
								let t = null,
									r = noop,
									n = !1,
									o = null,
									i = noop;
								const s = () => (t || (t = new Promise((e => {
									r = () => {
										t = null, r = noop, e()
									}
								}))), t),
									a = {
										write(t) {
											e.push(t);
											const r = s();
											return i(), r
										},
										async end() {
											n = !0;
											const e = s();
											i(), await e
										}
									},
									c = {
										async next() {
											const t = e.shift();
											return t ? (0 === e.length && r(), {
												done: !1,
												value: t
											}) : n ? (r(), {
												done: !0,
												value: void 0
											}) : (o || (o = new Promise((e => {
												i = () => (o = null, i = noop, e(c.next()))
											}))), o)
										}
									};
								return {
									writer: a,
									iterator: c
								}
							}
							class CarWriter {
								constructor(e, t) {
									this._encoder = t, this._mutex = t.setRoots(e), this._ended = !1
								}
								async put(e) {
									if (!(e.bytes instanceof Uint8Array && e.cid)) throw new TypeError("Can only write {cid, bytes} objects");
									if (this._ended) throw new Error("Already closed");
									const t = CID.asCID(e.cid);
									if (!t) throw new TypeError("Can only write {cid, bytes} objects");
									return this._mutex = this._mutex.then((() => this._encoder.writeBlock({
										cid: t,
										bytes: e.bytes
									}))), this._mutex
								}
								async close() {
									if (this._ended) throw new Error("Already closed");
									return await this._mutex, this._ended = !0, this._encoder.close()
								}
								static create(e) {
									e = toRoots(e);
									const {
										encoder: t,
										iterator: r
									} = encodeWriter();
									return {
										writer: new CarWriter(e, t),
										out: new CarWriterOut(r)
									}
								}
								static createAppender() {
									const {
										encoder: e,
										iterator: t
									} = encodeWriter();
									return e.setRoots = () => Promise.resolve(), {
										writer: new CarWriter([], e),
										out: new CarWriterOut(t)
									}
								}
								static async updateRootsInBytes(e, t) {
									const r = bytesReader(e);
									await readHeader(r);
									const n = createHeader(t);
									if (Number(r.pos) !== n.length) throw new Error(`updateRoots() can only overwrite a header of the same length (old header is ${r.pos} bytes, new header is ${n.length} bytes)`);
									return e.set(n, 0), e
								}
							}
							class CarWriterOut {

							}

							function encodeWriter() {

							}

							function toRoots(e) {

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