(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[405],{

/***/ 8581:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/",
      function () {
        return __webpack_require__(3678);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 3678:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Index; }
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7294);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7948);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5333);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6548);
/* harmony import */ var react_input_mask__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6627);
/* harmony import */ var react_input_mask__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_input_mask__WEBPACK_IMPORTED_MODULE_2__);




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
        var source = arguments[i] != null ? arguments[i] : {};
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
function Index() {
    var ref = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(""), dob = ref[0], setDob = ref[1];
    console.log(dob);
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z, {
        maxWidth: "sm",
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z, {
            sx: {
                my: 4
            },
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)((react_input_mask__WEBPACK_IMPORTED_MODULE_2___default()), {
                mask: "99/99/9999",
                value: dob,
                onChange: function(event) {
                    console.log(event);
                    setDob(event.target.value);
                },
                children: function(props) {
                    console.log(props);
                    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z, _objectSpread({
                        fullWidth: true
                    }, props, {
                        value: dob,
                        placeholder: "MM/DD/YYYY",
                        name: "dob"
                    })));
                }
            })
        })
    }));
};


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [838,774,888,179], function() { return __webpack_exec__(8581); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);