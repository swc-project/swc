(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[405],{

/***/ 8282:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/",
      function () {
        return __webpack_require__(3823);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 3823:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ App; }
});

// EXTERNAL MODULE: ./node_modules/.pnpm/react@17.0.2/node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4637);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+react@1.6.10_ef216fd07ecfbd7a9aaa3879b655b45c/node_modules/@chakra-ui/react/dist/esm/index.js
var esm = __webpack_require__(113);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+layout@1.4.10_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/layout/dist/esm/box.js
var box = __webpack_require__(5560);
// EXTERNAL MODULE: ./node_modules/.pnpm/next@12.0.8-canary.20_react-dom@17.0.2+react@17.0.2/node_modules/next/dynamic.js
var dynamic = __webpack_require__(9723);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+layout@1.4.10_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/layout/dist/esm/flex.js
var flex = __webpack_require__(4294);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+layout@1.4.10_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/layout/dist/esm/stack.js + 3 modules
var stack = __webpack_require__(7783);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+button@1.4.5_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/button/dist/esm/button.js + 6 modules
var esm_button = __webpack_require__(8328);
// EXTERNAL MODULE: ./node_modules/.pnpm/@chakra-ui+layout@1.4.10_abf521da32678fe96b8c3046cf20739f/node_modules/@chakra-ui/layout/dist/esm/link.js
var esm_link = __webpack_require__(3364);
// EXTERNAL MODULE: ./node_modules/.pnpm/next@12.0.8-canary.20_react-dom@17.0.2+react@17.0.2/node_modules/next/image.js
var next_image = __webpack_require__(4954);
// EXTERNAL MODULE: ./node_modules/.pnpm/react-icons@4.3.1_react@17.0.2/node_modules/react-icons/cg/index.esm.js
var index_esm = __webpack_require__(7511);
;// CONCATENATED MODULE: ./src/components/HeaderBar.tsx




var logoURL = /* asset import */ new __webpack_require__.U(__webpack_require__(1887)).toString();
function HeaderBar() {
    var ref = (0,esm.useColorMode)(), colorMode = ref.colorMode, toggleColorMode = ref.toggleColorMode;
    var bg = (0,esm.useColorModeValue)('gray.100', 'gray.900');
    var borderColor = (0,esm.useColorModeValue)('gray.300', 'gray.700');
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(flex/* Flex */.k, {
        as: "header",
        justifyContent: "space-between",
        h: "56px",
        px: [
            2,
            2,
            5
        ],
        py: "2",
        bg: bg,
        borderBottomWidth: "1px",
        borderBottomColor: borderColor,
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("a", {
                href: "http://swc.rs",
                target: "_blank",
                rel: "noopener noreferrer",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(next_image["default"], {
                    src: logoURL,
                    alt: "swc",
                    width: "120",
                    height: "43"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(stack/* HStack */.Ug, {
                spacing: "4",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_button/* Button */.z, {
                        variant: "ghost",
                        onClick: toggleColorMode,
                        children: colorMode === 'dark' ? /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* CgMoon */.Tgg, {}) : /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* CgSun */.rNF, {})
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(esm_link/* Link */.r, {
                        href: "https://github.com/swc-project/swc-playground",
                        isExternal: true,
                        display: "flex",
                        alignItems: "center",
                        children: [
                            "GitHub",
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(box/* Box */.xu, {
                                display: "inline-block",
                                ml: "1px",
                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(index_esm/* CgExternal */.RZY, {})
                            })
                        ]
                    })
                ]
            })
        ]
    }));
};

;// CONCATENATED MODULE: ./src/pages/index.tsx




var Workspace = (0,dynamic["default"])(function() {
    return Promise.all(/* import() */[__webpack_require__.e(567), __webpack_require__.e(603), __webpack_require__.e(982), __webpack_require__.e(717)]).then(__webpack_require__.bind(__webpack_require__, 717));
}, {
    loadableGenerated: {
        webpack: function() {
            return [
                /*require.resolve*/(717)
            ];
        }
    },
    ssr: false
});
function App() {
    var bg = (0,esm.useColorModeValue)('gray.50', 'gray.800');
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(box/* Box */.xu, {
        minHeight: "100vh",
        bg: bg,
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(HeaderBar, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Workspace, {})
        ]
    }));
};


/***/ }),

/***/ 1887:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "static/media/swc.ad410af5.svg";

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774,511,870,888,179], function() { return __webpack_exec__(8282); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);