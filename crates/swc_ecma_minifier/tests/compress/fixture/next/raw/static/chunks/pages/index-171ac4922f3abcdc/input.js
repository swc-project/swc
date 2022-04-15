(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[405],{

/***/ 8581:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/",
      function () {
        return __webpack_require__(4369);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 4369:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7294);
/* harmony import */ var react_text_transition__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3863);



var titleTexts = [
    "Test",
    "Test2",
    "Test3",
    "Test4",
    "Test5"
];
var Example = function() {
    var ref = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0), index1 = ref[0], setIndex = ref[1];
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function() {
        var intervalId = setInterval(function() {
            return setIndex(function(index) {
                return index + 1;
            });
        }, 1 * 1000);
        return function() {
            return clearTimeout(intervalId);
        };
    }, []);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_text_transition__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z, {
        text: titleTexts[index1 % titleTexts.length],
        springConfig: react_text_transition__WEBPACK_IMPORTED_MODULE_2__/* .presets.gentle */ .u.gentle,
        inline: true
    });
};
/* harmony default export */ __webpack_exports__["default"] = (Example);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774,863,888,179], function() { return __webpack_exec__(8581); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);