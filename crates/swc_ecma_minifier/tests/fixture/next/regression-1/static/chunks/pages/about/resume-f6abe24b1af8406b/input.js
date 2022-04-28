(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[711],{

/***/ 6966:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "__N_SSG": function() { return /* binding */ __N_SSG; },
  "default": function() { return /* binding */ ResumeRoute; }
});

// EXTERNAL MODULE: ../../node_modules/next/head.js
var head = __webpack_require__(7729);
var head_default = /*#__PURE__*/__webpack_require__.n(head);
// EXTERNAL MODULE: ./src/layouts/main/head/index.ts + 3 modules
var main_head = __webpack_require__(2592);
// EXTERNAL MODULE: ../../node_modules/@emotion/react/jsx-runtime/dist/emotion-react-jsx-runtime.browser.esm.js
var emotion_react_jsx_runtime_browser_esm = __webpack_require__(2903);
;// CONCATENATED MODULE: ./src/features/about/layouts/resume/Head/ResumeLayoutMeta.tsx

const ResumeLayoutMeta = () => {
  return (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)("meta", {
    name: "viewport",
    content: "width=device-width, initial-scale=1.0"
  }, "viewport");
};
// EXTERNAL MODULE: ../../node_modules/@fontsource/inter/400.css
var _400 = __webpack_require__(8843);
// EXTERNAL MODULE: ../../node_modules/@fontsource/inter/700.css
var _700 = __webpack_require__(7868);
// EXTERNAL MODULE: ../../node_modules/@fontsource/rubik/variable.css
var variable = __webpack_require__(8213);
// EXTERNAL MODULE: ../../node_modules/@fontsource/inter/variable.css
var inter_variable = __webpack_require__(3615);
;// CONCATENATED MODULE: ./src/features/about/layouts/resume/Head/ResumeLayoutFonts.tsx
/**
 * Local fonts
 * @link https://fontsource.org/docs/guides/nextjs
 */

 // @link https://fontsource.org/docs/variable-fonts





const ResumeLayoutFonts = () => {
  return (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(emotion_react_jsx_runtime_browser_esm/* Fragment */.HY, {});
};
;// CONCATENATED MODULE: ./src/features/about/layouts/resume/Head/index.ts


;// CONCATENATED MODULE: ./src/features/about/layouts/resume/ResumeLayout.tsx






const ResumeLayout = props => {
  const {
    children
  } = props;
  return (0,emotion_react_jsx_runtime_browser_esm/* jsxs */.BX)(emotion_react_jsx_runtime_browser_esm/* Fragment */.HY, {
    children: [(0,emotion_react_jsx_runtime_browser_esm/* jsxs */.BX)((head_default()), {
      children: [(0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(ResumeLayoutMeta, {}), (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(main_head/* MainLayoutFavicon */.So, {}), (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(ResumeLayoutFonts, {})]
    }), children]
  });
};
;// CONCATENATED MODULE: ./src/features/about/layouts/resume/index.ts

// EXTERNAL MODULE: ./src/features/about/pages/index.ts + 8 modules
var pages = __webpack_require__(5507);
;// CONCATENATED MODULE: ./src/pages/about/resume.tsx



var __N_SSG = true;
function ResumeRoute(_props) {
  return (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(pages/* ResumePage */.u, {});
}

ResumeRoute.getLayout = function getLayout(page) {
  return (0,emotion_react_jsx_runtime_browser_esm/* jsx */.tZ)(ResumeLayout, {
    children: page
  });
};

/***/ }),

/***/ 3513:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/about/resume",
      function () {
        return __webpack_require__(6966);
      }
    ]);
    if(false) {}
  

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [351,832,507,774,888,179], function() { return __webpack_exec__(3513); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);