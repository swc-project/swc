(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        931
    ],
    {
        821: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__), __webpack_require__.d(__webpack_exports__, {
                ClientCompoenent: function() {
                    return ClientCompoenent;
                }
            });
            var jsx_runtime = __webpack_require__(7437), react = __webpack_require__(2265);
            const Context = (0, react.createContext)({}), ContextDemo_Provider = (param)=>{
                let { children } = param;
                return (0, jsx_runtime.jsx)(Context.Provider, {
                    value: {},
                    children: children
                });
            }, ClientCompoenent = ()=>{
                const [count, setCount] = (0, react.useState)(0);
                return (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                    children: [
                        (0, jsx_runtime.jsx)(ContextDemo_Provider, {
                            children: (0, jsx_runtime.jsx)("input", {})
                        }),
                        (0, jsx_runtime.jsx)("button", {
                            onClick: ()=>{
                                console.log("click"), setCount(count + 1);
                            },
                            children: "+1 (rerender)"
                        })
                    ]
                });
            };
        }
    },
    function(__webpack_require__) {
        __webpack_require__.O(0, [
            971,
            596,
            744
        ], function() {
            return __webpack_require__(__webpack_require__.s = 8835);
        }), _N_E = __webpack_require__.O();
    }
]);
