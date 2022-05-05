(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [158],
    {
        /***/ 2943: /***/ function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ __N_SSG: function () {
                    return /* binding */ __N_SSG;
                },
                /* harmony export */ default: function () {
                    return /* binding */ StaticPage;
                },
                /* harmony export */
            });
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ =
                __webpack_require__(4512);

            var __N_SSG = true;
            function StaticPage(_ref) {
                var data = _ref.data;
                return /*#__PURE__*/ (0,
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                    children: data.foo,
                });
            }

            /***/
        },

        /***/ 7139: /***/ function (
            __unused_webpack_module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/static",
                function () {
                    return __webpack_require__(2943);
                },
            ]);
            if (false) {
            }

            /***/
        },
    },
    /******/ function (__webpack_require__) {
        // webpackRuntimeModules
        /******/ var __webpack_exec__ = function (moduleId) {
            return __webpack_require__((__webpack_require__.s = moduleId));
        };
        /******/ __webpack_require__.O(0, [774, 888, 179], function () {
            return __webpack_exec__(7139);
        });
        /******/ var __webpack_exports__ = __webpack_require__.O();
        /******/ _N_E = __webpack_exports__;
        /******/
    },
]);
