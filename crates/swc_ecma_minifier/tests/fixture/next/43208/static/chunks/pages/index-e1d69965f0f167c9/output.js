(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        405
    ],
    {
        /***/ 4186: /***/ function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__), /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ default: function() {
                    return /* binding */ Home;
                }
            });
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893), react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7294), _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7160), _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/ __webpack_require__.n(_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_4__), _gmod_binary_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9996), binary_parser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9567), Buffer = __webpack_require__(1876).Buffer;
            function Home() {
                return (0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
                    const ipHeader1 = new _gmod_binary_parser__WEBPACK_IMPORTED_MODULE_2__ /* .Parser */ ._().uint8("compressionMethod", {
                        formatter: (b)=>{
                            const method = [
                                "raw"
                            ][b];
                            return method || // never gets here
                            console.log("in @gmod/binary-parser"), method;
                        }
                    }), ipHeader2 = new binary_parser__WEBPACK_IMPORTED_MODULE_3__ /* .Parser */ ._().uint8("compressionMethod", {
                        formatter: (b)=>{
                            const method = [
                                "raw"
                            ][b];
                            return method || console.log("in binary-parser"), method;
                        }
                    });
                    console.log({
                        ipHeader1,
                        ipHeader2
                    });
                    // wouldn't actually parse correctly, just shows minification crash
                    const buf = Buffer.from("450002c5939900002c06ef98adc24f6c850186d1", "hex");
                    console.log(ipHeader2.parse(buf)), console.log(ipHeader1.parse(buf));
                }, []), /*#__PURE__*/ (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                    className: _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_4___default().container,
                    children: "hello"
                });
            }
        /***/ }
    },
    /******/ function(__webpack_require__) {
        /******/ __webpack_require__.O(0, [
            390,
            774,
            888,
            179
        ], function() {
            return __webpack_require__(__webpack_require__.s = 8312);
        }), /******/ _N_E = __webpack_require__.O();
    /******/ }
]);
