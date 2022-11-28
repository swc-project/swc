(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[405],{

/***/ 8312:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/",
      function () {
        return __webpack_require__(4186);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 4186:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Home; }
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7294);
/* harmony import */ var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7160);
/* harmony import */ var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _gmod_binary_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9996);
/* harmony import */ var binary_parser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9567);
/* provided dependency */ var Buffer = __webpack_require__(1876)["Buffer"];





function Home() {
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const ipHeader1 = new _gmod_binary_parser__WEBPACK_IMPORTED_MODULE_2__/* .Parser */ ._().uint8("compressionMethod", {
            formatter: (b)=>{
                const method = [
                    "raw"
                ][b];
                if (!method) {
                    // never gets here
                    console.log("in @gmod/binary-parser");
                }
                return method;
            }
        });
        const ipHeader2 = new binary_parser__WEBPACK_IMPORTED_MODULE_3__/* .Parser */ ._().uint8("compressionMethod", {
            formatter: (b)=>{
                const method = [
                    "raw"
                ][b];
                if (!method) {
                    console.log("in binary-parser");
                }
                return method;
            }
        });
        console.log({
            ipHeader1,
            ipHeader2
        });
        // wouldn't actually parse correctly, just shows minification crash
        const buf = Buffer.from("450002c5939900002c06ef98adc24f6c850186d1", "hex");
        console.log(ipHeader2.parse(buf));
        console.log(ipHeader1.parse(buf));
    }, []);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        className: (_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_4___default().container),
        children: "hello"
    });
}


/***/ }),

/***/ 7160:
/***/ (function(module) {

// extracted by mini-css-extract-plugin
module.exports = {"container":"Home_container__bCOhY","main":"Home_main__nLjiQ","footer":"Home_footer____T7K","title":"Home_title__T09hD","description":"Home_description__41Owk","code":"Home_code__suPER","grid":"Home_grid__GxQ85","card":"Home_card___LpL1","logo":"Home_logo__27_tb"};

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [390,774,888,179], function() { return __webpack_exec__(8312); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);