(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[487],{

/***/ 9243:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/docs/[[...docsSlug]]",
      function () {
        return __webpack_require__(7954);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 7954:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__N_SSG": function() { return /* binding */ __N_SSG; }
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4246);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6677);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(4776);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(8181);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(5310);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(6456);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(2588);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(9485);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(2750);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8038);
/* harmony import */ var _site_map_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8305);
/* harmony import */ var _components_PageSidebar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(550);
/* harmony import */ var _components_MdxPageContent__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6023);
/* harmony import */ var _components_pages_docs_Search__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6056);
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}








var documentationPages = _site_map_json__WEBPACK_IMPORTED_MODULE_3__.pages.find(function(param) {
    var title = param.title;
    return title === "Documentation";
}).subPages;
var DOCS_PAGE_SUBTITLES = {
    Introduction: "Getting started with the Block Protocol",
    "Developing Blocks": "A quick start guide to developing blocks",
    "Publishing Blocks": "Built a block? Share it with the world",
    "Embedding Blocks": "A guide for embedding applications"
};
var a11yProps = function(index) {
    return {
        id: "simple-tab-".concat(index),
        "aria-controls": "simple-tabpanel-".concat(index)
    };
};
var DocsPage = function(param1) {
    var tabPage = param1.tabPage, tabPageSerializedContent = param1.tabPageSerializedContent;
    var router = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();
    var theme = (0,_mui_material__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z)();
    var href = tabPage.href, title = tabPage.title;
    var md = (0,_mui_material__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(theme.breakpoints.up("md"));
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_head__WEBPACK_IMPORTED_MODULE_2__["default"], {
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("title", {
                    children: "Block Protocol - Documentation"
                })
            }),
            md && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z, {
                sx: {
                    borderBottom: 1,
                    borderColor: function(param) {
                        var palette = param.palette;
                        return palette.gray[20];
                    },
                    borderBottomStyle: "solid"
                },
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z, {
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z, {
                        value: href,
                        onChange: function(_, newHref) {
                            return router.push(newHref);
                        },
                        "aria-label": "documentation-tabs",
                        children: documentationPages.map(function(param, i) {
                            var tabTitle = param.title, tabHref = param.href;
                            /*#__PURE__*/ return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_12__/* ["default"] */ .Z, _objectSpread({
                                label: tabTitle,
                                value: tabHref,
                                href: tabHref,
                                component: "a",
                                onClick: function(event) {
                                    event.preventDefault();
                                }
                            }, a11yProps(i)), tabHref);
                        })
                    })
                })
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z, {
                sx: {
                    marginTop: {
                        xs: 5,
                        md: 9
                    }
                },
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_13__/* ["default"] */ .Z, {
                        variant: "bpTitle",
                        sx: {
                            marginBottom: 2
                        },
                        children: title
                    }),
                    DOCS_PAGE_SUBTITLES[title] ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_13__/* ["default"] */ .Z, {
                        variant: "bpSubtitle",
                        maxWidth: 750,
                        sx: {
                            marginBottom: {
                                xs: 2,
                                md: 3
                            }
                        },
                        children: DOCS_PAGE_SUBTITLES[title]
                    }) : null,
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z, {
                        py: 4,
                        display: "flex",
                        alignItems: "flex-start",
                        children: [
                            md ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_PageSidebar__WEBPACK_IMPORTED_MODULE_4__/* .Sidebar */ .Y, {
                                flexGrow: 0,
                                marginRight: 6,
                                pages: [
                                    tabPage
                                ],
                                header: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_pages_docs_Search__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z, {
                                    variant: "desktop"
                                })
                            }) : null,
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_MdxPageContent__WEBPACK_IMPORTED_MODULE_5__/* .MdxPageContent */ .v, {
                                flexGrow: 1,
                                serializedPage: tabPageSerializedContent
                            })
                        ]
                    })
                ]
            })
        ]
    }));
};
var __N_SSG = true;
/* harmony default export */ __webpack_exports__["default"] = (DocsPage);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [905,386,804,774,888,179], function() { return __webpack_exec__(9243); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);