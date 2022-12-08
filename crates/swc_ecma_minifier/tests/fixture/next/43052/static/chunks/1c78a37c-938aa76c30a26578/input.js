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
							/*! noble-ed25519 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
							BigInt("6853475219497561581579357271197624642482790079785650197046958215289687604742");



























							async function verify(e, t, r) {
							}


							var varint$1 = {
							},
								_brrp_varint = varint$1;
							const decode$l = (e, t = 0) => [_brrp_varint.decode(e, t), _brrp_varint.decode.bytes],
								encodingLength = e => _brrp_varint.encodingLength(e),
								coerce = e => {
									if (e instanceof Uint8Array && "Uint8Array" === e.constructor.name) return e;
									if (e instanceof ArrayBuffer) return new Uint8Array(e);
									if (ArrayBuffer.isView(e)) return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
									throw new Error("Unknown type, must be binary type")
								},
								create$7 = () => {
								},
								decode$k = () => {
								};

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
							}
							const from$2 = ({
							}) => new Codec(e, t, r, n),
								baseX = ({
								}) => {
								},
								rfc4648 = ({
								}) => from$2({
								}),
								base58btc = baseX({
								});
							baseX({
							});
							rfc4648({
							}), rfc4648({
							}), rfc4648({
							}), rfc4648({
							}), rfc4648({
							}), rfc4648({
							}), rfc4648({
							}), rfc4648({
							});
							class CID {
							}
							const from$1 = ({
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


							const Kinds = {
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