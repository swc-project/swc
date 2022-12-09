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
							}(utf8$2);

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

							async function* chunkBlocks(e, t = {}) { }

							async function uploadCarChunks(e, t, r = {}) { }
							async function createUpload(e, t, r) { }
							async function uploadCarBytes(e, t, r = {}) {

							}
							exports.chunkBlocks = chunkBlocks, exports.createUpload = createUpload, exports.encodeDirectory = encodeDirectory, exports.encodeFile = encodeFile, exports.uploadCarBytes = uploadCarBytes, exports.uploadCarChunks = uploadCarChunks, Object.defineProperty(exports, "__esModule", {
								value: !0
							})
						}, t(exports)
					})(index_production, index_production.exports);
					const UploaderContext = React.createContext([{
						uploadedCarChunks: []
					}, {}]);

					function UploaderProvider({ }) {

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