(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[378],{

/***/ 1185:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/test",
      function () {
        return __webpack_require__(9929);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 9929:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var next_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5152);
/* harmony import */ var next_dynamic__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_dynamic__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3775);



var PDFViewer = next_dynamic__WEBPACK_IMPORTED_MODULE_1___default()(function() {
    return Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 3775)).then(function(component) {
        return component.PDFViewer;
    });
}, {
    loadableGenerated: {
        webpack: function() {
            return [
                /*require.resolve*/(3775)
            ];
        }
    },
    ssr: false
});
// Create styles
var styles = _react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__.StyleSheet.create({
    page: {
        backgroundColor: "#d11fb6",
        color: "white"
    },
    section: {
        margin: 10,
        padding: 10
    },
    viewer: {
        width: "100vw",
        height: "100vh",
        border: "none"
    }
});
// Create Document Component
function BasicDocument() {
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("style", {
                children: "\n        body {\n          overflow: hidden;\n        }\n      "
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(PDFViewer, {
                style: styles.viewer,
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__.Document, {
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__.Page, {
                        size: "A4",
                        style: styles.page,
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__.View, {
                                style: styles.section,
                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__.Text, {
                                    children: "Hello"
                                })
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__.View, {
                                style: styles.section,
                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__.Text, {
                                    children: "World"
                                })
                            })
                        ]
                    })
                })
            })
        ]
    });
}
var TestPage = function() {
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(BasicDocument, {});
};
/* harmony default export */ __webpack_exports__["default"] = (TestPage);


/***/ }),

/***/ 2480:
/***/ (function() {

/* (ignored) */

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [111,474,445,186,545,774,888,179], function() { return __webpack_exec__(1185); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);