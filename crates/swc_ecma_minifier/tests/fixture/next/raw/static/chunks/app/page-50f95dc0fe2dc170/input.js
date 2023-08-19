(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[931],{

/***/ 8835:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 821))

/***/ }),

/***/ 821:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  ClientCompoenent: function() { return /* binding */ ClientCompoenent; }
});

// EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(7437);
// EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/index.js
var react = __webpack_require__(2265);
;// CONCATENATED MODULE: ./app/ContextExample.tsx


const Context = /*#__PURE__*/ (0,react.createContext)({});
const ContextProvider = (param)=>{
    let { children } = param;
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(Context.Provider, {
        value: {},
        children: children
    });
};
const ContextDemo = {
    Provider: ContextProvider
};

;// CONCATENATED MODULE: ./app/ClientCompoenent.tsx
/* __next_internal_client_entry_do_not_use__ ClientCompoenent auto */ 


const ClientCompoenent = ()=>{
    const [count, setCount] = (0,react.useState)(0);
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(ContextDemo.Provider, {
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {})
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                onClick: ()=>{
                    console.log("click");
                    setCount(count + 1);
                },
                children: "+1 (rerender)"
            })
        ]
    });
};


/***/ }),

/***/ 622:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f=__webpack_require__(2265),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};
function q(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}exports.Fragment=l;exports.jsx=q;exports.jsxs=q;


/***/ }),

/***/ 7437:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


if (true) {
  module.exports = __webpack_require__(622);
} else {}


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [971,596,744], function() { return __webpack_exec__(8835); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);