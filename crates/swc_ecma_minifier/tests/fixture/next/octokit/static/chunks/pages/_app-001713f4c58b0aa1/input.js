(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[888],{

/***/ 6840:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/_app",
      function () {
        return __webpack_require__(7571);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 7571:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ _app; }
});

;// CONCATENATED MODULE: ./node_modules/@swc/helpers/src/_define_property.mjs
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

;// CONCATENATED MODULE: ./node_modules/@swc/helpers/src/_object_spread.mjs


function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
// EXTERNAL MODULE: ./styles/globals.css
var globals = __webpack_require__(906);
;// CONCATENATED MODULE: ./pages/_app.tsx



function MyApp(param) {
    var Component = param.Component, pageProps = param.pageProps;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(Component, _objectSpread({}, pageProps));
}
/* harmony default export */ var _app = (MyApp);


/***/ }),

/***/ 906:
/***/ (function() {

// extracted by mini-css-extract-plugin

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774,179], function() { return __webpack_exec__(6840), __webpack_exec__(387); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);