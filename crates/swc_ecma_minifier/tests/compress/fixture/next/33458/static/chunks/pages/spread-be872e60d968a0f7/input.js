(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[217],{

/***/ 2809:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/spread",
      function () {
        return __webpack_require__(1767);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 2726:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": function() { return /* binding */ components_Form; }
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(7294);
;// CONCATENATED MODULE: ./components/Input.js

function Input(param) {
    var value = param.value, onChange = param.onChange;
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
        value: value,
        onChange: onChange
    }));
}
/* harmony default export */ var components_Input = (Input);

;// CONCATENATED MODULE: ./components/Form.js



function Form(param) {
    var value = param.value, onChange = param.onChange;
    (0,react.useEffect)(function() {
        // If parent component spreads the props,
        // will cause remount on every re-render
        console.log('EFFECT');
    }, []);
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(components_Input, {
        value: value,
        onChange: onChange
    }));
}
/* harmony default export */ var components_Form = (Form);


/***/ }),

/***/ 1767:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ PageWithSpread; }
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(7294);
// EXTERNAL MODULE: ./components/Form.js + 1 modules
var Form = __webpack_require__(2726);
;// CONCATENATED MODULE: ./components/Container.js


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
function Container(props) {
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Form/* default */.Z, _objectSpread({}, props)));
}
/* harmony default export */ var components_Container = (Container);

;// CONCATENATED MODULE: ./pages/spread.js



function PageWithSpread() {
    var ref = (0,react.useState)(''), text = ref[0], setText = ref[1];
    var handleChange = (0,react.useCallback)(function(e) {
        setText(e.target.value);
    }, []);
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(components_Container, {
        onChange: handleChange,
        value: text
    }));
};


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774,888,179], function() { return __webpack_exec__(2809); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);