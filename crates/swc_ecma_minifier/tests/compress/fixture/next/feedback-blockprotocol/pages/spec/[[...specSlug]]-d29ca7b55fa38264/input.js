(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[574],{

/***/ 1301:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/spec/[[...specSlug]]",
      function () {
        return __webpack_require__(6874);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 6874:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "__N_SSG": function() { return /* binding */ __N_SSG; },
  "default": function() { return /* binding */ _specSlug_page; }
});

// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4246);
// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(7378);
// EXTERNAL MODULE: ../node_modules/@mui/material/Paper/Paper.js + 1 modules
var Paper = __webpack_require__(4919);
// EXTERNAL MODULE: ../node_modules/@mui/material/Box/Box.js + 1 modules
var Box = __webpack_require__(5310);
// EXTERNAL MODULE: ../node_modules/@mui/material/Icon/Icon.js + 1 modules
var Icon = __webpack_require__(9762);
// EXTERNAL MODULE: ../node_modules/@mui/material/Typography/Typography.js + 1 modules
var Typography = __webpack_require__(2750);
// EXTERNAL MODULE: ../node_modules/@mui/material/styles/useTheme.js
var useTheme = __webpack_require__(4776);
// EXTERNAL MODULE: ../node_modules/@mui/material/useMediaQuery/useMediaQuery.js
var useMediaQuery = __webpack_require__(8181);
// EXTERNAL MODULE: ../node_modules/@mui/material/Container/Container.js + 1 modules
var Container = __webpack_require__(6456);
// EXTERNAL MODULE: ../node_modules/next/head.js
var head = __webpack_require__(8038);
// EXTERNAL MODULE: ../node_modules/next/router.js
var router = __webpack_require__(6677);
// EXTERNAL MODULE: ./src/components/Link.tsx
var Link = __webpack_require__(1131);
// EXTERNAL MODULE: ./src/components/PageSidebar.tsx
var PageSidebar = __webpack_require__(550);
// EXTERNAL MODULE: ./src/context/SiteMapContext.ts
var SiteMapContext = __webpack_require__(5511);
// EXTERNAL MODULE: ./src/components/MdxPageContent.tsx + 4 modules
var MdxPageContent = __webpack_require__(6023);
// EXTERNAL MODULE: ../node_modules/@mui/material/styles/styled.js + 2 modules
var styled = __webpack_require__(5608);
;// CONCATENATED MODULE: ./src/components/PageNavLinks.tsx
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
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}



var NavArrowIcon = (0,styled/* default */.ZP)(Icon/* default */.Z)(function(param) {
    var theme = param.theme;
    return {
        color: theme.palette.purple[300],
        fontSize: 15,
        marginTop: theme.spacing(0.8),
        position: "relative",
        left: 0,
        transition: theme.transitions.create("left")
    };
});
var PageNavLinks = function(_param) {
    var prevPage = _param.prevPage, nextPage = _param.nextPage, boxProps = _objectWithoutProperties(_param, [
        "prevPage",
        "nextPage"
    ]);
    var theme = (0,useTheme/* default */.Z)();
    var hideIcons = (0,useMediaQuery/* default */.Z)(theme.breakpoints.down(1050));
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, _objectSpread({
        display: "flex",
        justifyContent: "space-between"
    }, boxProps, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                children: prevPage && /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                    display: "flex",
                    alignItems: "flex-end",
                    children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                sx: {
                                    color: theme.palette.gray[60]
                                },
                                component: "p",
                                variant: "bpSmallCopy",
                                children: "Previous"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                                display: "flex",
                                sx: {
                                    marginLeft: hideIcons ? 0 : "-31px",
                                    "& svg": {
                                        display: hideIcons ? "none" : "inherit",
                                        ":hover": {
                                            left: "-".concat(theme.spacing(1))
                                        }
                                    }
                                },
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(NavArrowIcon, {
                                        sx: {
                                            marginRight: 2
                                        },
                                        className: "fas fa-arrow-left"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* Link */.rU, {
                                        sx: {
                                            maxWidth: hideIcons ? 150 : 200,
                                            ":hover": {
                                                color: theme.palette.purple[800]
                                            }
                                        },
                                        href: prevPage.href,
                                        children: prevPage.title
                                    })
                                ]
                            })
                        ]
                    })
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                children: nextPage && /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                            sx: {
                                color: theme.palette.gray[60]
                            },
                            component: "p",
                            variant: "bpSmallCopy",
                            children: "Next"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                            display: "flex",
                            sx: {
                                marginRight: hideIcons ? 0 : "-31px",
                                "& svg": {
                                    display: hideIcons ? "none" : "inherit",
                                    ":hover": {
                                        left: theme.spacing(1)
                                    }
                                }
                            },
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* Link */.rU, {
                                    sx: {
                                        textAlign: "right",
                                        maxWidth: hideIcons ? 150 : 200,
                                        ":hover": {
                                            color: theme.palette.purple[800]
                                        }
                                    },
                                    href: nextPage.href,
                                    children: nextPage.title
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(NavArrowIcon, {
                                    sx: {
                                        marginLeft: 2
                                    },
                                    className: "fas fa-arrow-right"
                                })
                            ]
                        })
                    ]
                })
            })
        ]
    })));
};


// EXTERNAL MODULE: ./src/util/muiUtils.tsx
var muiUtils = __webpack_require__(7723);
// EXTERNAL MODULE: ./src/components/pages/docs/Search/index.tsx + 7 modules
var Search = __webpack_require__(6056);
// EXTERNAL MODULE: ./src/components/LinkButton.tsx
var LinkButton = __webpack_require__(8068);
;// CONCATENATED MODULE: ./src/pages/spec/[[...specSlug]].page.tsx













var GitHubInfoCard = /*#__PURE__*/ (0,jsx_runtime.jsxs)(Paper/* default */.Z, {
    variant: "teal",
    sx: {
        marginBottom: {
            xs: 3,
            md: 4
        },
        padding: 3,
        display: "flex",
        alignItems: "stretch",
        flexDirection: {
            xs: "column",
            md: "row"
        },
        maxWidth: {
            xs: "100%",
            lg: "1012px"
        }
    },
    children: [
        /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
            mr: 2,
            sx: {
                display: {
                    xs: "none",
                    md: "block"
                }
            },
            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Icon/* default */.Z, {
                sx: {
                    color: function(param) {
                        var palette = param.palette;
                        return palette.teal[600];
                    },
                    fontSize: 18
                },
                fontSize: "inherit",
                className: "fas fa-exclamation-triangle"
            })
        }),
        /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
            mr: 2,
            flexGrow: 1,
            sx: {
                marginBottom: {
                    xs: 2,
                    md: 0
                }
            },
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                    variant: "bpLargeText",
                    sx: {
                        fontSize: 18,
                        fontWeight: 600,
                        color: function(param) {
                            var palette = param.palette;
                            return palette.teal[600];
                        }
                    },
                    marginBottom: 1,
                    children: "This document is a working draft"
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)(Typography/* default */.Z, {
                    variant: "bpBodyCopy",
                    sx: function(theme) {
                        return {
                            color: theme.palette.teal[600],
                            fontSize: 15,
                            lineHeight: 1.5,
                            a: {
                                color: theme.palette.teal[600],
                                borderColor: theme.palette.teal[600],
                                ":hover": {
                                    color: theme.palette.teal[700],
                                    borderColor: theme.palette.teal[700]
                                }
                            }
                        };
                    },
                    maxWidth: "62ch",
                    children: [
                        "This specification is currently in progress. We’re drafting it in public to gather feedback and improve the final document. If you have any suggestions or improvements you would like to add, or questions you would like to ask, feel free to submit a PR or open a discussion on",
                        " ",
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* Link */.rU, {
                            href: "https://github.com/blockprotocol/blockprotocol",
                            sx: {
                                ":focus-visible": {
                                    outlineColor: "currentcolor"
                                }
                            },
                            children: "our GitHub repo"
                        }),
                        "."
                    ]
                })
            ]
        }),
        /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
            display: "flex",
            flexShrink: 0,
            alignItems: "flex-end",
            sx: {
                justifyContent: {
                    xs: "center",
                    sm: "flex-start"
                }
            },
            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(LinkButton/* LinkButton */.Q, {
                href: "https://github.com/blockprotocol/blockprotocol/tree/main/site/src/_pages/spec",
                variant: "primary",
                color: "teal",
                size: "small",
                startIcon: /*#__PURE__*/ (0,jsx_runtime.jsx)(Icon/* default */.Z, {
                    className: "fab fa-github"
                }),
                sx: {
                    textTransform: "none"
                },
                children: "View the spec on GitHub"
            })
        })
    ]
});
var SpecPage = function(param1) {
    var serializedPage = param1.serializedPage;
    var theme = (0,useTheme/* default */.Z)();
    var asPath = (0,router.useRouter)().asPath;
    var ref = (0,react.useContext)(SiteMapContext/* default */.Z), allPages = ref.pages;
    var ref1 = allPages.find(function(param) {
        var title = param.title;
        return title === "Specification";
    }), specificationPages = ref1.subPages;
    var currentPageIndex = specificationPages.findIndex(function(param) {
        var href = param.href;
        return asPath === href || asPath.startsWith("".concat(href, "#"));
    });
    var prevPage = currentPageIndex > 0 ? specificationPages[currentPageIndex - 1] : undefined;
    var nextPage = currentPageIndex < specificationPages.length - 1 ? specificationPages[currentPageIndex + 1] : undefined;
    var md = (0,useMediaQuery/* default */.Z)(theme.breakpoints.up("md"));
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(head["default"], {
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("title", {
                    children: "Block Protocol - Specification"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Container/* default */.Z, {
                sx: {
                    marginTop: {
                        xs: 6,
                        md: 8
                    }
                },
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                        variant: "bpTitle",
                        sx: {
                            marginBottom: 2
                        },
                        children: "Specification"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                        variant: "bpSubtitle",
                        maxWidth: 750,
                        sx: {
                            marginBottom: {
                                xs: 4,
                                md: 4
                            }
                        },
                        children: "The open-source protocol for creating interactive, data-driven blocks"
                    }),
                    GitHubInfoCard,
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                        mb: 4,
                        py: 4,
                        display: "flex",
                        alignItems: "flex-start",
                        children: [
                            md ? /*#__PURE__*/ (0,jsx_runtime.jsx)(PageSidebar/* Sidebar */.Y, {
                                flexGrow: 0,
                                marginRight: 6,
                                pages: specificationPages.filter(function(param) {
                                    var title = param.title;
                                    return !title.startsWith("Appendix");
                                }),
                                appendices: specificationPages.filter(function(param) {
                                    var title = param.title;
                                    return title.startsWith("Appendix");
                                }),
                                header: /*#__PURE__*/ (0,jsx_runtime.jsx)(Search/* default */.Z, {
                                    variant: "desktop"
                                })
                            }) : null,
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(MdxPageContent/* MdxPageContent */.v, {
                                flexGrow: 1,
                                serializedPage: serializedPage
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(PageNavLinks, {
                        prevPage: prevPage,
                        nextPage: nextPage,
                        sx: {
                            marginLeft: {
                                xs: 0,
                                md: "".concat(PageSidebar/* SIDEBAR_WIDTH */.Z + (0,muiUtils/* parseIntFromPixelString */.y)(theme.spacing(6)), "px")
                            },
                            maxWidth: {
                                sx: "100%",
                                sm: MdxPageContent/* MDX_TEXT_CONTENT_MAX_WIDTH */.$
                            },
                            marginBottom: {
                                xs: 8,
                                md: 14
                            }
                        }
                    })
                ]
            })
        ]
    }));
};
var __N_SSG = true;
/* harmony default export */ var _specSlug_page = (SpecPage);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [386,804,774,888,179], function() { return __webpack_exec__(1301); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);