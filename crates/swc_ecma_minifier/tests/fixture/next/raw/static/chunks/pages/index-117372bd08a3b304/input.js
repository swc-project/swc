(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [405],
    {
        /***/ 5557: /***/ function (
            __unused_webpack_module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/",
                function () {
                    return __webpack_require__(4369);
                },
            ]);
            if (false) {
            }

            /***/
        },

        /***/ 4369: /***/ function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ default: function () {
                    return /* binding */ PrivatePage;
                },
                /* harmony export */
            });
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ =
                __webpack_require__(5893);
            /* harmony import */ var _uppy_react__WEBPACK_IMPORTED_MODULE_1__ =
                __webpack_require__(6214);
            /* harmony import */ var _uppy_core__WEBPACK_IMPORTED_MODULE_2__ =
                __webpack_require__(9429);
            /* harmony import */ var _uppy_core__WEBPACK_IMPORTED_MODULE_2___default =
                /*#__PURE__*/ __webpack_require__.n(
                    _uppy_core__WEBPACK_IMPORTED_MODULE_2__
                );

            function PrivatePage(props) {
                var uppy = (0,
                _uppy_react__WEBPACK_IMPORTED_MODULE_1__ /* .useUppy */.vo)(
                    function () {
                        return new (_uppy_core__WEBPACK_IMPORTED_MODULE_2___default())(
                            {
                                autoProceed: true,
                                allowMultipleUploads: false,
                                restrictions: {
                                    maxNumberOfFiles: 1,
                                },
                                debug: false,
                            }
                        );
                    }
                );
                return /*#__PURE__*/ (0,
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                    children: /*#__PURE__*/ (0,
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                        "div",
                        {
                            children: [
                                /*#__PURE__*/ (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    "h4",
                                    {
                                        children: "Select Image",
                                    }
                                ),
                                /*#__PURE__*/ (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    _uppy_react__WEBPACK_IMPORTED_MODULE_1__ /* .FileInput */.S2,
                                    {
                                        uppy: uppy,
                                        pretty: true,
                                        inputName: "files",
                                    }
                                ),
                            ],
                        }
                    ),
                });
            }

            /***/
        },
    },
    /******/ function (__webpack_require__) {
        // webpackRuntimeModules
        /******/ var __webpack_exec__ = function (moduleId) {
            return __webpack_require__((__webpack_require__.s = moduleId));
        };
        /******/ __webpack_require__.O(0, [774, 214, 888, 179], function () {
            return __webpack_exec__(5557);
        });
        /******/ var __webpack_exports__ = __webpack_require__.O();
        /******/ _N_E = __webpack_exports__;
        /******/
    },
]);
