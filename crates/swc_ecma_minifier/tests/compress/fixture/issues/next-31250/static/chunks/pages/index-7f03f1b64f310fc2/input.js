(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[405],{

/***/ 5301:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/",
      function () {
        return __webpack_require__(5075);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 5075:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var _biomedit_next_widgets__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(812);
/* harmony import */ var _biomedit_next_widgets__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2052);
/* harmony import */ var _biomedit_next_widgets__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1809);
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2283);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7294);




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
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
var Home = function() {
    // @ts-ignore
    var form = (0,_biomedit_next_widgets__WEBPACK_IMPORTED_MODULE_3__/* .useEnhancedForm */ .ty)();
    var choices = [
        {
            key: 1,
            value: 1,
            label: "User 1"
        },
        {
            key: 2,
            value: 2,
            label: "User 2"
        }, 
    ];
    var flag = {
        user: 2
    };
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_hook_form__WEBPACK_IMPORTED_MODULE_1__/* .FormProvider */ .RV, _objectSpread({
    }, form, {
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_biomedit_next_widgets__WEBPACK_IMPORTED_MODULE_4__/* .FormDialog */ .D, {
            title: "New Flag",
            open: true,
            onSubmit: function() {
                return console.log("Submit");
            },
            isSubmitting: false,
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_biomedit_next_widgets__WEBPACK_IMPORTED_MODULE_5__/* .AutocompleteField */ .w, {
                name: "user",
                label: "User",
                initialValues: flag,
                choices: choices
            })
        })
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (Home);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774,743,888,179], function() { return __webpack_exec__(5301); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);