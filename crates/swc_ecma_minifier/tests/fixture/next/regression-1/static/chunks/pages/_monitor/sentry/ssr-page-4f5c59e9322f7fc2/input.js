(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[947],{

/***/ 6716:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__N_SSP": function() { return /* binding */ __N_SSP; },
/* harmony export */   "default": function() { return /* binding */ MonitorSentrySsrRoute; }
/* harmony export */ });
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2903);


var __N_SSP = true;
function MonitorSentrySsrRoute(_props) {
  return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__/* .jsxs */ .BX)("div", {
    children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__/* .jsx */ .tZ)("h1", {
      children: "Unexpected error"
    }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__/* .jsx */ .tZ)("p", {
      children: "If you see this message, it means that the an error thrown in the `getServerSideProps()` function wasn't caught by the global error handler (pages/_error.tsx). This is a bug in the application and may affect the ability to display error pages and log errors on Sentry. See the monitoring page in /pages/_monitor/sentry/ssr-page.tsx."
    })]
  });
}
/**
 * Always throws an error on purpose for monitoring
 */

/***/ }),

/***/ 6185:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/_monitor/sentry/ssr-page",
      function () {
        return __webpack_require__(6716);
      }
    ]);
    if(false) {}
  

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774,888,179], function() { return __webpack_exec__(6185); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);