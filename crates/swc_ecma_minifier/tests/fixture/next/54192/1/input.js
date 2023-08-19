(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [931], {
        /***/
        821:
            /***/
            (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                // ESM COMPAT FLAG
                __webpack_require__.r(__webpack_exports__);

                // EXPORTS
                __webpack_require__.d(__webpack_exports__, {
                    ClientCompoenent: function () {
                        return /* binding */ ClientCompoenent;
                    }
                });

                // EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/jsx-runtime.js
                var jsx_runtime = __webpack_require__(7437);
                // EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/index.js
                var react = __webpack_require__(2265);; // CONCATENATED MODULE: ./app/ContextExample.tsx


                const Context = /*#__PURE__*/ (0, react.createContext)({});
                const ContextProvider = (param) => {
                    let {
                        children
                    } = param;
                    return /*#__PURE__*/ (0, jsx_runtime.jsx)(Context.Provider, {
                        value: {},
                        children: children
                    });
                };
                const ContextDemo = {
                    Provider: ContextProvider
                };

                ; // CONCATENATED MODULE: ./app/ClientCompoenent.tsx
                /* __next_internal_client_entry_do_not_use__ ClientCompoenent auto */


                const ClientCompoenent = () => {
                    const [count, setCount] = (0, react.useState)(0);
                    return /*#__PURE__*/ (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                        children: [
                            /*#__PURE__*/
                            (0, jsx_runtime.jsx)(ContextDemo.Provider, {
                                children: /*#__PURE__*/ (0, jsx_runtime.jsx)("input", {})
                            }),
                            /*#__PURE__*/
                            (0, jsx_runtime.jsx)("button", {
                                onClick: () => {
                                    console.log("click");
                                    setCount(count + 1);
                                },
                                children: "+1 (rerender)"
                            })
                        ]
                    });
                };


                /***/
            }),




    },
    /******/
    function (__webpack_require__) { // webpackRuntimeModules
        /******/
        var __webpack_exec__ = function (moduleId) {
            return __webpack_require__(__webpack_require__.s = moduleId);
        }
        /******/
        __webpack_require__.O(0, [971, 596, 744], function () {
            return __webpack_exec__(8835);
        });
        /******/
        var __webpack_exports__ = __webpack_require__.O();
        /******/
        _N_E = __webpack_exports__;
        /******/
    }
]);