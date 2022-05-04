(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [405],
    {
        /***/ 5301: /***/ function (
            __unused_webpack_module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/",
                function () {
                    return __webpack_require__(5075);
                },
            ]);
            if (false) {
            }

            /***/
        },

        /***/ 5075: /***/ function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ =
                __webpack_require__(5893);
            /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ =
                __webpack_require__(7294);
            /* harmony import */ var react_map_gl__WEBPACK_IMPORTED_MODULE_2__ =
                __webpack_require__(6785);
            /* harmony import */ var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3__ =
                __webpack_require__(214);
            /* harmony import */ var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default =
                /*#__PURE__*/ __webpack_require__.n(
                    _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3__
                );

            function _defineProperty(obj, key, value) {
                if (key in obj) {
                    Object.defineProperty(obj, key, {
                        value: value,
                        enumerable: true,
                        configurable: true,
                        writable: true,
                    });
                } else {
                    obj[key] = value;
                }
                return obj;
            }
            function _objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    var ownKeys = Object.keys(source);
                    if (typeof Object.getOwnPropertySymbols === "function") {
                        ownKeys = ownKeys.concat(
                            Object.getOwnPropertySymbols(source).filter(
                                function (sym) {
                                    return Object.getOwnPropertyDescriptor(
                                        source,
                                        sym
                                    ).enumerable;
                                }
                            )
                        );
                    }
                    ownKeys.forEach(function (key) {
                        _defineProperty(target, key, source[key]);
                    });
                }
                return target;
            }
            var Home = function () {
                var ref = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)({
                        width: 800,
                        height: 600,
                        latitude: 37.7577,
                        longitude: -122.4376,
                        zoom: 8,
                    }),
                    viewport = ref[0];
                return /*#__PURE__*/ (0,
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                    className:
                        _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_3___default()
                            .container,
                    children: /*#__PURE__*/ (0,
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        react_map_gl__WEBPACK_IMPORTED_MODULE_2__ /* ["default"] */.ZP,
                        _objectSpread({}, viewport, {
                            // mapStyle="mapbox://styles/mapbox/dark-v9" // WORKS
                            mapStyle: "mapbox://styles/mapbox/dark-v10", // DOES NOT WORKS if swcMinify is `true`
                            mapboxApiAccessToken:
                                "pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg",
                        })
                    ),
                });
            };
            /* harmony default export */ __webpack_exports__["default"] = Home;

            /***/
        },

        /***/ 214: /***/ function (module) {
            // extracted by mini-css-extract-plugin
            module.exports = {
                container: "Home_container__bCOhY",
                main: "Home_main__nLjiQ",
                footer: "Home_footer____T7K",
                title: "Home_title__T09hD",
                description: "Home_description__41Owk",
                code: "Home_code__suPER",
                grid: "Home_grid__GxQ85",
                card: "Home_card___LpL1",
                logo: "Home_logo__27_tb",
            };

            /***/
        },
    },
    /******/ function (__webpack_require__) {
        // webpackRuntimeModules
        /******/ var __webpack_exec__ = function (moduleId) {
            return __webpack_require__((__webpack_require__.s = moduleId));
        };
        /******/ __webpack_require__.O(
            0,
            [634, 785, 774, 888, 179],
            function () {
                return __webpack_exec__(5301);
            }
        );
        /******/ var __webpack_exports__ = __webpack_require__.O();
        /******/ _N_E = __webpack_exports__;
        /******/
    },
]);
