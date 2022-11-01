(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[405],{

/***/ 8312:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/",
      function () {
        return __webpack_require__(9017);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 9017:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ pages; }
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
// EXTERNAL MODULE: ./node_modules/@nextui-org/react/esm/text/index.js + 3 modules
var esm_text = __webpack_require__(6979);
// EXTERNAL MODULE: ./node_modules/@nextui-org/react/esm/container/index.js + 2 modules
var container = __webpack_require__(3165);
// EXTERNAL MODULE: ./node_modules/@nextui-org/react/esm/grid/index.js + 4 modules
var grid = __webpack_require__(2553);
// EXTERNAL MODULE: ./node_modules/@nextui-org/react/esm/button/index.js + 23 modules
var esm_button = __webpack_require__(1694);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(7294);
// EXTERNAL MODULE: ./node_modules/next-themes/dist/index.module.js
var index_module = __webpack_require__(2010);
;// CONCATENATED MODULE: ./hooks/use-theme.ts


const useTheme = ()=>{
    const { theme , setTheme  } = (0,index_module/* useTheme */.F)();
    const isDark = (0,react.useMemo)(()=>{
        return Boolean(theme === "dark");
    }, [
        theme
    ]);
    const toggleTheme = (0,react.useCallback)(()=>{
        setTheme(isDark ? "light" : "dark");
    }, [
        isDark,
        setTheme
    ]);
    return {
        theme,
        isDark,
        toggleTheme
    };
};

;// CONCATENATED MODULE: ./hooks/index.ts


;// CONCATENATED MODULE: ./pages/index.tsx




/**
 *
 * The components that get stuck when using SWC Minifier
 *
 * Navbar, Input, Textarea, Popover, Dropdown, Text
 */ const IndexPage = ()=>{
    const { toggleTheme  } = useTheme();
    return /*#__PURE__*/ (0,jsx_runtime.jsx)(container/* default */.Z, {
        sm: true,
        css: {
            py: "$xl"
        },
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(grid/* default.Container */.ZP.Container, {
            gap: 2,
            justify: "center",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)(grid/* default */.ZP, {
                    xs: 6,
                    justify: "center",
                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_button/* default */.ZP, {
                        auto: true,
                        color: "secondary",
                        onPress: ()=>toggleTheme(),
                        children: "Toggle Theme"
                    })
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)(grid/* default */.ZP, {
                    xs: 6,
                    justify: "center",
                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(esm_text/* default */.Z, {
                        h3: true,
                        className: "nextui-text",
                        children: "Stuck when building"
                    })
                })
            ]
        })
    });
};
/* harmony default export */ var pages = (IndexPage);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [584,774,888,179], function() { return __webpack_exec__(8312); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);