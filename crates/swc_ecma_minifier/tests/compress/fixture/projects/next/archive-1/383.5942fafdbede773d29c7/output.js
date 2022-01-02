"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        383, 
    ],
    {
        6086: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
                try {
                    var info = gen[key](arg), value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }
                info.done ? resolve(value) : Promise.resolve(value).then(_next, _throw);
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
                        _next(void 0);
                    });
                };
            }
            __webpack_require__.d(__webpack_exports__, {
                Z: function() {
                    return _asyncToGenerator;
                }
            });
        },
        1383: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            __webpack_require__.r(__webpack_exports__);
            var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4512), _Users_timneutkens_projects_next_js_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7945), _Users_timneutkens_projects_next_js_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(_Users_timneutkens_projects_next_js_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__), _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6086), next_dynamic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4652), BrowserLoaded = (0, next_dynamic__WEBPACK_IMPORTED_MODULE_2__.default)((0, _Users_timneutkens_projects_next_js_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__.Z)(_Users_timneutkens_projects_next_js_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee() {
                return _Users_timneutkens_projects_next_js_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function(_context) {
                    for(;;)switch(_context.prev = _context.next){
                        case 0:
                            return _context.abrupt("return", function() {
                                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                    children: "Browser hydrated"
                                });
                            });
                        case 1:
                        case "end":
                            return _context.stop();
                    }
                }, _callee);
            })), {
                ssr: !1
            });
            __webpack_exports__.default = function() {
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                            children: "Nested 2"
                        }),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(BrowserLoaded, {}), 
                    ]
                });
            };
        }
    }, 
]);
