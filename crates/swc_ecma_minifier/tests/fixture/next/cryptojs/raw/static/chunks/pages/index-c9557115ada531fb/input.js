(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[405],{

/***/ 8312:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/",
      function () {
        return __webpack_require__(2627);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 2627:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var crypto_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1354);
/* harmony import */ var crypto_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(crypto_js__WEBPACK_IMPORTED_MODULE_1__);


const Index = (param)=>{
    let { foo } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        children: [
            "Hello ",
            foo,
            "!"
        ]
    });
};
const createHmacString = (privateKey, message)=>{
    const key = crypto_js__WEBPACK_IMPORTED_MODULE_1__.enc.Utf8.parse(privateKey);
    const timestamp = crypto_js__WEBPACK_IMPORTED_MODULE_1__.enc.Utf8.parse(message);
    const hmac = crypto_js__WEBPACK_IMPORTED_MODULE_1__.enc.Hex.stringify((0,crypto_js__WEBPACK_IMPORTED_MODULE_1__.HmacSHA256)(timestamp, key));
    return hmac;
};
Index.getInitialProps = ()=>{
    const foo = createHmacString("foo", "bar");
    return {
        foo
    };
};
/* harmony default export */ __webpack_exports__["default"] = (Index);


/***/ }),

/***/ 2480:
/***/ (function() {

/* (ignored) */

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774,354,888,179], function() { return __webpack_exec__(8312); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);