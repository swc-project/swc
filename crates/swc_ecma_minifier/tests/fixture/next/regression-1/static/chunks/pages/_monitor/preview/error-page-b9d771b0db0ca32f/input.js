(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[122],{

/***/ 4267:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "m": function() { return /* binding */ ErrorPage; }
/* harmony export */ });
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7729);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2903);




const ErrorPage = props => {
  const {
    error,
    errorId,
    message,
    statusCode
  } = props;
  return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsxs */ .BX)(_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .Fragment */ .HY, {
    children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsx */ .tZ)((next_head__WEBPACK_IMPORTED_MODULE_0___default()), {
      children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsxs */ .BX)("title", {
        children: ["Error ", statusCode]
      })
    }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsxs */ .BX)("div", {
      className: "container text-2xl md:text-xl bg-white",
      children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsxs */ .BX)("div", {
        className: "flex flex-col items-center justify-center w-screen h-screen",
        children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsx */ .tZ)("h1", {
          className: "m-5 text-5xl text-black md:text-4xl",
          children: "Woops !"
        }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsx */ .tZ)("p", {
          className: "text-2xl text-black md:text-2xl",
          children: "Something went wrong. Please try again later."
        })]
      }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsxs */ .BX)("div", {
        className: "absolute bottom-0 right-0 p-5 border-solid border-2 border-indigo-400 rounded-lg text-left m-5 text-gray-700 text-sm",
        children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsxs */ .BX)("p", {
          "data-testid": "error-status-code",
          children: ["Code: ", statusCode]
        }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsxs */ .BX)("p", {
          children: ["Message: ", message]
        }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsxs */ .BX)("p", {
          children: ["Error id: ", errorId]
        }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsxs */ .BX)("p", {
          children: ["ErrorMessage: ", error === null || error === void 0 ? void 0 : error.message]
        })]
      })]
    })]
  });
};

/***/ }),

/***/ 6012:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "m": function() { return /* reexport */ ErrorPage/* ErrorPage */.m; },
  "A": function() { return /* reexport */ NotFoundPage; }
});

// EXTERNAL MODULE: ../../node_modules/next-i18next/dist/esm/index.js + 27 modules
var esm = __webpack_require__(6094);
// EXTERNAL MODULE: ../../node_modules/next/head.js
var head = __webpack_require__(7729);
var head_default = /*#__PURE__*/__webpack_require__.n(head);
;// CONCATENATED MODULE: ./src/features/system/system.config.ts
const systemConfig = {
  i18nNamespaces: ['system']
};
// EXTERNAL MODULE: ../../node_modules/@emotion/react/jsx-runtime/dist/emotion-react-jsx-runtime.browser.esm.js
var emotion_react_jsx_runtime_browser_esm = __webpack_require__(2903);
;// CONCATENATED MODULE: ./src/features/system/pages/NotFoundPage.tsx






const NotFoundPage = props => {
  var _props$title;

  const {
    t
  } = (0,esm/* useTranslation */.$G)(systemConfig.i18nNamespaces);
  const title = (_props$title = props.title) !== null && _props$title !== void 0 ? _props$title : t('system:notFound.title');
  return (0,emotion_react_jsx_runtime_browser_esm/* jsxs */.BX)(emotion_react_jsx_runtime_browser_esm/* Fragment */.HY, {
    children: [(0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)((head_default()), {
      children: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("title", {
        children: title
      })
    }), (0,emotion_react_jsx_runtime_browser_esm/* jsxs */.BX)("div", {
      className: "flex flex-col items-center justify-center w-screen h-screen bg-white",
      children: [(0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("h1", {
        "data-testid": "not-found-title",
        className: "text-5xl text-black md:text-4xl lg:text-5xl",
        children: title
      }), (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("p", {
        className: "text-center mt-5 no-underline hover:underline text-xl",
        children: (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("a", {
          href: '/',
          children: t('system:links.backToHome')
        })
      })]
    })]
  });
};
// EXTERNAL MODULE: ./src/features/system/pages/ErrorPage.tsx
var ErrorPage = __webpack_require__(4267);
;// CONCATENATED MODULE: ./src/features/system/pages/index.ts



/***/ }),

/***/ 4099:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ErrorPageRoute; }
/* harmony export */ });
/* harmony import */ var _features_system_pages__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6012);
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2903);


const exampleError = new Error('ErrorPage example error');
function ErrorPageRoute() {
  return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__/* .jsx */ .tZ)(_features_system_pages__WEBPACK_IMPORTED_MODULE_0__/* .ErrorPage */ .m, {
    statusCode: 500,
    message: 'ErrorPage preview',
    errorId: 'xxxxx-xxxxx-xxxxx-xxxxx',
    error: exampleError
  });
}

/***/ }),

/***/ 2990:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/_monitor/preview/error-page",
      function () {
        return __webpack_require__(4099);
      }
    ]);
    if(false) {}
  

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774,888,179], function() { return __webpack_exec__(2990); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);