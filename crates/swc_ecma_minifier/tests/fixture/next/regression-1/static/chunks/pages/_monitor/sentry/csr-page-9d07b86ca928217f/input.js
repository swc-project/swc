(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[734],{

/***/ 9258:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2784);
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2903);




const getAsyncError = async () => {
  throw new Error('Error purposely crafted for monitoring sentry (/pages/_monitor/sentry/csr-page.tsx)');
};

const MonitorSentryCsrRoute = () => {
  const {
    0: error,
    1: setError
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    getAsyncError().catch(err => setError(err));
  }, []);

  if (error) {
    throw error;
  }

  return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsxs */ .BX)("div", {
    children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsx */ .tZ)("h1", {
      children: "Unexpected error"
    }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsx */ .tZ)("p", {
      children: "If you see this message, it means that an error thrown in a static NextJs page wasn't caught by the global error handler (pages/_error.tsx). This is a bug in the application and may affect the ability to display error pages and log errors on Sentry. See the monitoring page in /pages/_monitor/sentry/csr-page.tsx."
    })]
  });
};

/* harmony default export */ __webpack_exports__["default"] = (MonitorSentryCsrRoute);

/***/ }),

/***/ 4309:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/_monitor/sentry/csr-page",
      function () {
        return __webpack_require__(9258);
      }
    ]);
    if(false) {}
  

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774,888,179], function() { return __webpack_exec__(4309); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);