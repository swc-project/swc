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
							function inquire(moduleName) {
								try {
									var mod = eval("quire".replace(/^/, "re"))(moduleName);
									if (mod && (mod.length || Object.keys(mod).length)) return mod
								} catch (e) { }
								return null
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