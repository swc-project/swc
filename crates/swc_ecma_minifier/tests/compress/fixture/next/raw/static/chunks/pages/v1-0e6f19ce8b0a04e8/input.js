(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[361],{

/***/ 3370:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/v1",
      function () {
        return __webpack_require__(3772);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 3772:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Users_kdy1_projects_lab_next_swc_react_pdf_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4051);
/* harmony import */ var _Users_kdy1_projects_lab_next_swc_react_pdf_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Users_kdy1_projects_lab_next_swc_react_pdf_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7294);
/* harmony import */ var _react_pdf_renderer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9337);




function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
var V1Page = function() {
    var onClick = function() {
        var _ref = _asyncToGenerator(_Users_kdy1_projects_lab_next_swc_react_pdf_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
            var PDFExample, blob;
            return _Users_kdy1_projects_lab_next_swc_react_pdf_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return __webpack_require__.e(/* import() */ 213).then(__webpack_require__.bind(__webpack_require__, 7213));
                    case 2:
                        PDFExample = _ctx.sent.PDFExample;
                        _ctx.next = 5;
                        return (0,_react_pdf_renderer__WEBPACK_IMPORTED_MODULE_3__/* .pdf */ .eA)(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(PDFExample, {})).toBlob();
                    case 5:
                        blob = _ctx.sent;
                        console.log('blob: ', blob);
                    case 7:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }));
        return function onClick() {
            return _ref.apply(this, arguments);
        };
    }();
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        onClick: onClick,
        children: "Generate PDF"
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (V1Page);


/***/ }),

/***/ 2480:
/***/ (function() {

/* (ignored) */

/***/ }),

/***/ 8066:
/***/ (function() {

/* (ignored) */

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [728,186,708,536,774,888,179], function() { return __webpack_exec__(3370); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);