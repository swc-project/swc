(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        378
    ],
    {
        1185: function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/test",
                function() {
                    return __webpack_require__(9929);
                }
            ]);
        },
        9929: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893), next_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5152), next_dynamic__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(next_dynamic__WEBPACK_IMPORTED_MODULE_1__), _react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3775), PDFViewer = next_dynamic__WEBPACK_IMPORTED_MODULE_1___default()(function() {
                return Promise.resolve().then(__webpack_require__.bind(__webpack_require__, 3775)).then(function(component) {
                    return component.PDFViewer;
                });
            }, {
                loadableGenerated: {
                    webpack: function() {
                        return [
                            3775
                        ];
                    }
                },
                ssr: !1
            }), styles = _react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__.StyleSheet.create({
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
            function BasicDocument() {
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                    children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("style", {
                            children: "\n        body {\n          overflow: hidden;\n        }\n      "
                        }),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(PDFViewer, {
                            style: styles.viewer,
                            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__.Document, {
                                children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__.Page, {
                                    size: "A4",
                                    style: styles.page,
                                    children: [
                                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__.View, {
                                            style: styles.section,
                                            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__.Text, {
                                                children: "Hello"
                                            })
                                        }),
                                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__.View, {
                                            style: styles.section,
                                            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_react_pdf_renderer__WEBPACK_IMPORTED_MODULE_2__.Text, {
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
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(BasicDocument, {});
            };
            __webpack_exports__.default = TestPage;
        },
        2480: function() {}
    },
    function(__webpack_require__) {
        __webpack_require__.O(0, [
            111,
            474,
            445,
            186,
            545,
            774,
            888,
            179
        ], function() {
            return function(moduleId) {
                return __webpack_require__(__webpack_require__.s = moduleId);
            }(1185);
        }), _N_E = __webpack_require__.O();
    }
]);
