(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[276],{

/***/ 6664:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DynamicPDFExport": function() { return /* binding */ DynamicPDFExport; }
/* harmony export */ });
/* harmony import */ var _Users_kdy1_projects_lab_next_swc_react_pdf_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4051);
/* harmony import */ var _Users_kdy1_projects_lab_next_swc_react_pdf_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Users_kdy1_projects_lab_next_swc_react_pdf_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5893);
/* harmony import */ var _react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9337);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7294);




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
var DynamicPDFExport = function() {
    var onGenerateClick = function() {
        var _ref = _asyncToGenerator(_Users_kdy1_projects_lab_next_swc_react_pdf_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
            var blob;
            return _Users_kdy1_projects_lab_next_swc_react_pdf_node_modules_next_dist_compiled_regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return (0,_react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__/* .pdf */ .eA)(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__/* .Document */ .BB, {
                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__/* .Page */ .T3, {
                                size: "A4",
                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__/* .View */ .G7, {
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__/* .Text */ .xv, {
                                        children: "NextJS is awesome 🚀"
                                    })
                                })
                            })
                        })).toBlob();
                    case 2:
                        blob = _ctx.sent;
                        console.log('Blob: ', blob);
                    case 4:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }));
        return function onGenerateClick() {
            return _ref.apply(this, arguments);
        };
    }();
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        onClick: onGenerateClick,
        children: "Generate PDF"
    }));
};


/***/ }),

/***/ 2480:
/***/ (function() {

/* (ignored) */

/***/ }),

/***/ 8066:
/***/ (function() {

/* (ignored) */

/***/ })

}]);