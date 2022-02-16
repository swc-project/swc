(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[26],{

/***/ 7791:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/dashboard",
      function () {
        return __webpack_require__(449);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 1440:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "p": function() { return /* binding */ withAuthWall; }
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4246);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6677);
/* harmony import */ var _context_UserContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(505);



var AuthWallWrapper = function(param) {
    var Content = param.Content;
    var router = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();
    var user = (0,_context_UserContext__WEBPACK_IMPORTED_MODULE_2__/* .useUser */ .a)().user;
    if (user === "loading" || !true) {
        return null;
    }
    if (!(user === null || user === void 0 ? void 0 : user.isSignedUp)) {
        void router.push("/");
        return null;
    }
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Content, {
        user: user
    }));
};
/**
 * We don’t know if a user is logged in during server-side-rendering, but we want
 * some pages to be available behind the auth wall. Once UserContext is populated
 * with the result of /api/me, we want to redirect guest users from to /.
 * use `withAuthWall` to enable this behavior.
 *
 * You can also get user object from Content props and thus avoid extra checks.
 */ var withAuthWall = function(Content) {
    return function() {
        /*#__PURE__*/ return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(AuthWallWrapper, {
            Content: Content
        });
    };
};


/***/ }),

/***/ 2421:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "g": function() { return /* binding */ TopNavigationTabs; }
});

// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4246);
// EXTERNAL MODULE: ../node_modules/@mui/material/Box/Box.js + 1 modules
var Box = __webpack_require__(5310);
// EXTERNAL MODULE: ../node_modules/@mui/material/Container/Container.js + 1 modules
var Container = __webpack_require__(6456);
// EXTERNAL MODULE: ../node_modules/@mui/material/Tabs/Tabs.js + 8 modules
var Tabs = __webpack_require__(2588);
// EXTERNAL MODULE: ../node_modules/@mui/material/Tab/Tab.js + 1 modules
var Tab = __webpack_require__(9485);
// EXTERNAL MODULE: ../node_modules/next/router.js
var next_router = __webpack_require__(6677);
;// CONCATENATED MODULE: ./src/components/pages/dashboard/utils.ts
var dashboardPages = [
    {
        tabTitle: "Dashboard",
        tabHref: "/dashboard"
    },
    {
        tabTitle: "API Keys",
        tabHref: "/settings/api-keys"
    }, 
];

;// CONCATENATED MODULE: ./src/components/pages/dashboard/TopNavigationTabs.tsx
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




var a11yProps = function(index) {
    return {
        id: "simple-tab-".concat(index),
        "aria-controls": "simple-tabpanel-".concat(index)
    };
};
var TopNavigationTabs = function() {
    var ref;
    var router = (0,next_router.useRouter)();
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
        sx: {
            borderBottom: 1,
            borderColor: function(param) {
                var palette = param.palette;
                return palette.gray[20];
            },
            borderBottomStyle: "solid",
            marginTop: {
                xs: 2,
                md: 0
            }
        },
        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Container/* default */.Z, {
            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Tabs/* default */.Z, {
                value: (ref = dashboardPages.find(function(dashboardPage) {
                    return router.asPath.includes(dashboardPage.tabHref);
                })) === null || ref === void 0 ? void 0 : ref.tabHref,
                onChange: function(_, newHref) {
                    return router.push(newHref);
                },
                "aria-label": "settings-tabs",
                children: dashboardPages.map(function(param, i) {
                    var tabTitle = param.tabTitle, tabHref = param.tabHref;
                    /*#__PURE__*/ return (0,jsx_runtime.jsx)(Tab/* default */.Z, _objectSpread({
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
    }));
};


/***/ }),

/***/ 449:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ dashboard_page; }
});

// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4246);
// EXTERNAL MODULE: ../node_modules/@mui/material/Box/Box.js + 1 modules
var Box = __webpack_require__(5310);
// EXTERNAL MODULE: ../node_modules/@mui/material/Container/Container.js + 1 modules
var Container = __webpack_require__(6456);
// EXTERNAL MODULE: ../node_modules/@mui/material/Typography/Typography.js + 1 modules
var Typography = __webpack_require__(2750);
// EXTERNAL MODULE: ../node_modules/next/head.js
var head = __webpack_require__(8038);
// EXTERNAL MODULE: ../node_modules/@mui/material/Link/Link.js + 1 modules
var Link = __webpack_require__(9510);
// EXTERNAL MODULE: ./src/components/icons/index.ts + 14 modules
var icons = __webpack_require__(9829);
;// CONCATENATED MODULE: ./src/components/pages/dashboard/DashboardCard.tsx



var DashboardCard = function(param) {
    var title = param.title, colorGradient = param.colorGradient, description = param.description, link = param.link;
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* default */.Z, {
        href: link.href,
        sx: {
            marginBottom: 4
        },
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
            sx: {
                boxShadow: "0px 4px 11px rgba(39, 50, 86, 0.02), 0px 2.59259px 6.44213px rgba(39, 50, 86, 0.04), 0px 0.5px 1px rgba(39, 50, 86, 0.15)",
                borderRadius: 2
            },
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                    sx: {
                        background: colorGradient,
                        borderTopLeftRadius: 2,
                        borderTopRightRadius: 2
                    },
                    height: 8
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                    p: 4,
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                            sx: {
                                fontFamily: "Apercu Pro",
                                fontSize: "28.128px",
                                lineHeight: "120%",
                                color: "#37434F"
                            },
                            children: title
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                            color: "#4D5C6C",
                            paddingTop: 1,
                            children: description
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                            sx: {
                                color: "#6048E5",
                                fontWeight: 600,
                                path: {
                                    fill: "#6F59EC"
                                },
                                display: "flex",
                                alignItems: "center",
                                marginTop: 2
                            },
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                                    component: "span",
                                    paddingRight: 1,
                                    children: link.title
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(icons/* ArrowRightIcon */.LZ, {
                                    sx: {
                                        width: "auto",
                                        height: "0.8em"
                                    }
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    }));
};

// EXTERNAL MODULE: ./src/components/pages/dashboard/TopNavigationTabs.tsx + 1 modules
var TopNavigationTabs = __webpack_require__(2421);
// EXTERNAL MODULE: ./src/components/pages/authWall.tsx
var authWall = __webpack_require__(1440);
;// CONCATENATED MODULE: ./src/pages/dashboard.page.tsx
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






var dashboardCardData = [
    {
        title: "Read our quick start guide to building blocks",
        colorGradient: "linear-gradient(291.34deg, #FFB172 -4.12%, #D082DE 53.49%, #9482FF 91.74%, #84E6FF 151.68%)",
        description: "Learn how to build blocks that can integrate with the block protocol and be published to the registry.",
        link: {
            title: "Read the guide",
            href: "/docs/developing-blocks"
        }
    },
    {
        title: "Test out blocks in the playground",
        colorGradient: "linear-gradient(310.17deg, #FFB172 -167.67%, #9482FF 13.54%, #84E6FF 126.83%)",
        description: "Try out our most popular blocks to learn how they consume and render different data structures",
        link: {
            title: "Try out blocks",
            href: "/hub"
        }
    },
    {
        title: "Generate your API key",
        colorGradient: "linear-gradient(91.21deg, #FFB172 -84.62%, #9482FF 62.56%, #84E6FF 154.58%)",
        description: "Your API key will allow you to search for blocks by name, author, or compatible data structure.",
        link: {
            title: "Generate Key",
            href: "/settings/api-keys"
        }
    }, 
];
var Dashboard = function(param) {
    var user = param.user;
    var ref = user !== null && user !== void 0 ? user : {}, userName = ref.preferredName;
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(head["default"], {
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("title", {
                    children: "Block Protocol - Dashboard"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(TopNavigationTabs/* TopNavigationTabs */.g, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                sx: {
                    background: "linear-gradient(180deg, #FAFBFC 0%, rgba(250, 251, 252, 0) 100%)"
                },
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Container/* default */.Z, {
                    sx: {
                        paddingTop: {
                            xs: 5,
                            md: 9
                        },
                        paddingBottom: {
                            xs: 5,
                            md: 9
                        }
                    },
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(Typography/* default */.Z, {
                            variant: "bpTitle",
                            sx: {
                                marginBottom: 2
                            },
                            children: [
                                "Welcome Back, ",
                                userName,
                                "!"
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                            maxWidth: 750,
                            sx: {
                                marginTop: {
                                    xs: 3,
                                    md: 6
                                },
                                textTransform: "uppercase",
                                color: "#64778C",
                                fontWeight: 600
                            },
                            children: "Start Exploring"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr",
                                md: "1fr 1fr 1fr"
                            },
                            columnGap: 2,
                            paddingTop: 2,
                            paddingBottom: 4,
                            children: dashboardCardData.map(function(dashboardCard) {
                                /*#__PURE__*/ return (0,jsx_runtime.jsx)(DashboardCard, _objectSpread({}, dashboardCard), "dashboardCard-".concat(dashboardCard.link.href));
                            })
                        })
                    ]
                })
            })
        ]
    }));
};
/* harmony default export */ var dashboard_page = ((0,authWall/* withAuthWall */.p)(Dashboard));


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [905,774,888,179], function() { return __webpack_exec__(7791); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);