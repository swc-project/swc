(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        405
    ],
    {
        8312: function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/",
                function() {
                    return __webpack_require__(4186);
                }
            ]);
            if (false) ;
        },
        4186: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, {
                default: function() {
                    return Home;
                }
            });
            var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
            var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7294);
            var react_joyride__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5511);
            const steps = [
                {
                    target: ".joyride1",
                    content: "This is the first step!",
                    disableBeacon: true
                },
                {
                    target: ".joyride2",
                    content: "This is the second step!",
                    disableBeacon: true
                }
            ];
            function Home() {
                const [isTourRunning, setIsTourRunning] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    style: {
                        padding: 200
                    },
                    children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                            style: {
                                paddingBottom: 50
                            },
                            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
                                onClick: ()=>setIsTourRunning(true),
                                children: "Start tour"
                            })
                        }),
                        isTourRunning && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_joyride__WEBPACK_IMPORTED_MODULE_2__.ZP, {
                            steps: steps,
                            callback: (e)=>{
                                if ("reset" === e.action) setIsTourRunning(false);
                            },
                            showProgress: true,
                            continuous: true,
                            showSkipButton: true,
                            scrollToFirstStep: false,
                            disableScrolling: true,
                            floaterProps: {
                                hideArrow: true
                            }
                        }),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            children: [
                                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
                                    className: "joyride1",
                                    children: "first feature"
                                }),
                                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
                                    className: "joyride2",
                                    children: "second feature"
                                })
                            ]
                        })
                    ]
                });
            }
        }
    },
    function(__webpack_require__) {
        var __webpack_exec__ = function(moduleId) {
            return __webpack_require__(__webpack_require__.s = moduleId);
        };
        __webpack_require__.O(0, [
            511,
            774,
            888,
            179
        ], function() {
            return __webpack_exec__(8312);
        });
        var __webpack_exports__ = __webpack_require__.O();
        _N_E = __webpack_exports__;
    }
]);
