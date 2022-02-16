(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[148],{

/***/ 7978:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/settings/api-keys",
      function () {
        return __webpack_require__(4722);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 180:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "u": function() { return /* binding */ Modal; }
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4246);
/* harmony import */ var _mui_material_Box__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5310);
/* harmony import */ var _mui_material_Modal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5904);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7378);
/* harmony import */ var _util_muiUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7723);
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





var style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {
        xs: "90%",
        sm: 520
    },
    bgcolor: "white",
    boxShadow: "0px 20px 41px rgba(61, 78, 133, 0.07), 0px 16px 25px rgba(61, 78, 133, 0.0531481), 0px 12px 12px rgba(61, 78, 133, 0.0325), 0px 2px 3.13px rgba(61, 78, 133, 0.02)",
    borderRadius: 2,
    p: {
        xs: 2,
        md: 4
    }
};
var Modal = function(param) {
    var open = param.open, children = param.children, _disableScrollLock = param.disableScrollLock, disableScrollLock = _disableScrollLock === void 0 ? false : _disableScrollLock, onClose = param.onClose, contentStyle = param.contentStyle;
    (0,_util_muiUtils__WEBPACK_IMPORTED_MODULE_2__/* .useScrollLock */ .P)(!disableScrollLock && open);
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material_Modal__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z, {
        open: open,
        onClose: onClose,
        "aria-labelledby": "modal-modal-title",
        "aria-describedby": "modal-modal-description",
        disableScrollLock: true,
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material_Box__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z, {
            sx: _objectSpread({}, style, contentStyle),
            children: children
        })
    }));
};


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

/***/ 4722:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ api_keys_page; }
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
// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(7378);
// EXTERNAL MODULE: ./src/components/Link.tsx
var Link = __webpack_require__(1131);
// EXTERNAL MODULE: ./src/components/Button.tsx + 3 modules
var Button = __webpack_require__(6437);
// EXTERNAL MODULE: ./src/components/Modal.tsx
var Modal = __webpack_require__(180);
// EXTERNAL MODULE: ./src/components/icons/index.ts + 14 modules
var icons = __webpack_require__(9829);
;// CONCATENATED MODULE: ./src/components/pages/dashboard/ApiKeyRenderer.tsx





var ApiKeyRenderer = function(param) {
    var apiKey = param.apiKey, closeModal = param.closeModal, regenerate = param.regenerate, keyName = param.keyName;
    var ref = (0,react.useState)(false), copied = ref[0], setCopied = ref[1];
    var copyApiKey = function() {
        if (navigator.clipboard !== undefined) {
            // Chrome
            setCopied(true);
            return navigator.clipboard.writeText(apiKey);
        }
    };
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
        sx: {
            textAlign: "center"
        },
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                sx: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    marginBottom: 2
                },
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(icons/* ApiKeyGeneratedIcon */.KX, {
                    sx: {
                        fontSize: "52px"
                    }
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Typography/* default */.Z, {
                sx: {
                    fontFamily: "Apercu Pro",
                    fontSize: "35.1625px",
                    lineHeight: "120%",
                    color: "#37434F",
                    marginBottom: 2
                },
                children: [
                    keyName,
                    " ",
                    regenerate ? "regenerated" : "generated"
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Typography/* default */.Z, {
                sx: {
                    marginBottom: 2
                },
                children: [
                    "Your key ",
                    keyName,
                    " has been ",
                    regenerate ? "regenerated" : "generated",
                    ".",
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("br", {}),
                    regenerate ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("strong", {
                        children: [
                            "The previous key will no longer work.",
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("br", {})
                        ]
                    }) : null,
                    "Here is your new key - make a note of it, ",
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("br", {}),
                    "we can't show it to you again!"
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                onMouseLeave: function() {
                    return setCopied(false);
                },
                sx: {
                    marginBottom: 2,
                    border: "1px solid #F2F5FA",
                    borderRadius: 2,
                    p: 2,
                    position: "relative"
                },
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                        sx: {
                            overflowWrap: "anywhere",
                            textAlign: "left",
                            color: "#91A5BA"
                        },
                        children: apiKey
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                        sx: {
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        },
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* Button */.z, {
                            sx: {
                                transition: "all 0.2s ease-in-out",
                                display: "flex",
                                alignItems: "center"
                            },
                            onClick: copyApiKey,
                            children: copied ? "✓ Copied" : /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(icons/* CopyIcon */.TI, {
                                        width: "auto",
                                        height: "1em",
                                        sx: {
                                            fontSize: "1em",
                                            marginRight: 1
                                        }
                                    }),
                                    "Copy to Clipboard"
                                ]
                            })
                        })
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                sx: {
                    display: "grid",
                    gridTemplateColumns: "1fr"
                },
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* Button */.z, {
                    onClick: closeModal,
                    sx: {
                        borderRadius: 2
                    },
                    children: "Go back"
                })
            })
        ]
    }));
};

// EXTERNAL MODULE: ./src/lib/apiClient.ts
var apiClient = __webpack_require__(3280);
;// CONCATENATED MODULE: ./src/components/pages/dashboard/GenerateApiModal.tsx








var GenerateApiModal = function(param1) {
    var close = param1.close, keyNameToRegenerate = param1.keyNameToRegenerate, refetchKeyList = param1.refetchKeyList;
    var ref = (0,react.useState)(""), apiKey = ref[0], setApiKey = ref[1];
    var ref1 = (0,react.useState)(keyNameToRegenerate || ""), keyName = ref1[0], setKeyName = ref1[1];
    var regenerate = !!keyNameToRegenerate;
    var createKey = function(event) {
        event.preventDefault();
        /** @todo handle errors and show the user a msg */ void apiClient/* apiClient.generateApiKey */.x.generateApiKey({
            displayName: keyName
        }).then(function(param) {
            var data = param.data;
            if (data) {
                setApiKey(data.apiKey);
            }
            refetchKeyList();
        });
    };
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Modal/* Modal */.u, {
        open: true,
        onClose: close,
        children: apiKey ? /*#__PURE__*/ (0,jsx_runtime.jsx)(ApiKeyRenderer, {
            keyName: keyName,
            apiKey: apiKey,
            closeModal: close,
            regenerate: regenerate
        }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
            sx: {
                textAlign: "center"
            },
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                    sx: {
                        background: "#FFF6ED",
                        borderRadius: "100%",
                        width: "52px",
                        height: "52px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                        marginBottom: 2
                    },
                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(icons/* WarningIcon */.aN, {
                        width: "auto",
                        height: "1em"
                    })
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                    sx: {
                        fontFamily: "Apercu Pro",
                        fontSize: "35.1625px",
                        lineHeight: "120%",
                        color: "#37434F",
                        marginBottom: 2
                    },
                    children: regenerate ? "Regenerate ".concat(keyName) : "Generate API Key"
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                    sx: {
                        marginBottom: 1.5
                    },
                    children: regenerate ? /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                        children: [
                            "Regenerating the ",
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("b", {
                                children: keyName
                            }),
                            " key will invalidate it. ",
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("br", {}),
                            "This could break any application that relies on it. ",
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("br", {}),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("b", {
                                children: "Are you sure you want to regenerate it?"
                            })
                        ]
                    }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                children: "Name your key."
                            }),
                            "Key names usually describe where they’re used, ",
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("br", {}),
                            "such as “Production”."
                        ]
                    })
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("form", {
                    onSubmit: createKey,
                    children: [
                        regenerate ? null : /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                            value: keyName,
                            onChange: function(event) {
                                setKeyName(event.target.value);
                            },
                            component: "input",
                            sx: function(theme) {
                                return {
                                    background: "#FFFFFF",
                                    border: "1px solid ".concat(theme.palette.gray[30]),
                                    width: "100%",
                                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
                                    borderRadius: "6px",
                                    marginBottom: 2
                                };
                            },
                            py: 1,
                            px: 2,
                            placeholder: "Key Name",
                            required: true
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                            sx: {
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "1fr 1fr"
                                },
                                columnGap: 2
                            },
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* Button */.z, {
                                    color: regenerate ? "warning" : "purple",
                                    type: "submit",
                                    variant: "tertiary",
                                    sx: {
                                        marginBottom: 1
                                    },
                                    squared: true,
                                    children: regenerate ? "Regenerate Key" : "Create Key"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* Button */.z, {
                                    onClick: close,
                                    color: "gray",
                                    variant: "tertiary",
                                    sx: {
                                        marginBottom: 1
                                    },
                                    squared: true,
                                    children: "Cancel"
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    }));
};

// EXTERNAL MODULE: ../node_modules/@mui/material/Table/Table.js + 1 modules
var Table = __webpack_require__(3049);
// EXTERNAL MODULE: ../node_modules/@mui/material/TableBody/TableBody.js + 1 modules
var TableBody = __webpack_require__(8196);
// EXTERNAL MODULE: ../node_modules/@mui/material/TableCell/TableCell.js + 1 modules
var TableCell = __webpack_require__(4447);
// EXTERNAL MODULE: ../node_modules/@mui/material/TableContainer/TableContainer.js + 1 modules
var TableContainer = __webpack_require__(5705);
// EXTERNAL MODULE: ../node_modules/@mui/material/TableHead/TableHead.js + 1 modules
var TableHead = __webpack_require__(8238);
// EXTERNAL MODULE: ../node_modules/@mui/material/TableRow/TableRow.js + 1 modules
var TableRow = __webpack_require__(2222);
;// CONCATENATED MODULE: ./src/components/Table.tsx







var Table_Table = function(param) {
    var header = param.header, rows = param.rows;
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(TableContainer/* default */.Z, {
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Table/* default */.Z, {
            sx: {
                minWidth: 650
            },
            "aria-label": "simple table",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)(TableHead/* default */.Z, {
                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(TableRow/* default */.Z, {
                        children: header.map(function(title) {
                            /*#__PURE__*/ return (0,jsx_runtime.jsx)(TableCell/* default */.Z, {
                                sx: {
                                    color: "#4D5C6C",
                                    fontWeight: 500,
                                    whiteSpace: "nowrap"
                                },
                                children: title
                            }, title);
                        })
                    })
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)(TableBody/* default */.Z, {
                    children: rows.map(function(row, rowIndex) {
                        /*#__PURE__*/ return (0,jsx_runtime.jsx)(TableRow/* default */.Z, {
                            sx: {
                                "&:last-child td, &:last-child th": {
                                    border: 0
                                }
                            },
                            children: row.map(function(cell) {
                                return typeof cell === "string" ? /*#__PURE__*/ (0,jsx_runtime.jsx)(TableCell/* default */.Z, {
                                    children: cell
                                }) : cell;
                            })
                        }, "row-".concat(rowIndex));
                    })
                })
            ]
        })
    }));
};

// EXTERNAL MODULE: ../node_modules/date-fns/esm/formatDistance/index.js + 11 modules
var formatDistance = __webpack_require__(8615);
// EXTERNAL MODULE: ../node_modules/date-fns/esm/formatRelative/index.js + 22 modules
var formatRelative = __webpack_require__(9662);
;// CONCATENATED MODULE: ./src/components/TableCells.tsx



var DateTimeCell = function(param) {
    var timestamp = param.timestamp;
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(TableCell/* default */.Z, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                sx: {
                    marginBottom: 1
                },
                children: (0,formatDistance/* default */.Z)(typeof timestamp === "string" ? new Date(timestamp) : timestamp, new Date(), {
                    addSuffix: true
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                sx: {
                    fontSize: "0.9rem",
                    color: "#64778C"
                },
                children: (0,formatRelative/* default */.Z)(typeof timestamp === "string" ? new Date(timestamp) : timestamp, new Date())
            })
        ]
    }));
};

// EXTERNAL MODULE: ./src/components/pages/dashboard/TopNavigationTabs.tsx + 1 modules
var TopNavigationTabs = __webpack_require__(2421);
// EXTERNAL MODULE: ./src/components/pages/authWall.tsx
var authWall = __webpack_require__(1440);
;// CONCATENATED MODULE: ./src/pages/settings/api-keys.page.tsx













var ApiKeys = function() {
    var ref;
    var ref1 = (0,react.useState)([]), activeApiKeys = ref1[0], setActiveApiKeys = ref1[1];
    var ref2 = (0,react.useState)({
        showModal: false
    }), generateKeyStatus = ref2[0], setGenerateStatus = ref2[1];
    var fetchAndSetApiKeys = function() {
        return apiClient/* apiClient.getUserApiKeys */.x.getUserApiKeys().then(function(param) {
            var data = param.data;
            return data ? setActiveApiKeys(data.apiKeysMetadata.filter(function(key) {
                return !key.revokedAt;
            })) : null;
        });
    };
    (0,react.useEffect)(function() {
        /** @todo handle errors and show the user a msg */ void fetchAndSetApiKeys();
    }, []);
    var tableRows = (0,react.useMemo)(function() {
        return activeApiKeys.map(function(key) {
            return [
                key.displayName,
                key.publicId,
                key.lastUsedAt ? /*#__PURE__*/ (0,jsx_runtime.jsx)(DateTimeCell, {
                    timestamp: key.lastUsedAt
                }, "lastUsed") : "Never",
                /*#__PURE__*/ (0,jsx_runtime.jsx)(DateTimeCell, {
                    timestamp: key.createdAt
                }, "createdAt"), 
            ];
        });
    }, [
        activeApiKeys
    ]);
    var activeKey = activeApiKeys[0];
    var closeGenerateModal = function() {
        setGenerateStatus({
            showModal: false,
            keyToRegenerate: undefined
        });
    };
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
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                            variant: "bpTitle",
                            sx: {
                                marginBottom: 2
                            },
                            children: "Access the API"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                            py: 4,
                            display: {
                                xs: "block",
                                md: "flex"
                            },
                            alignItems: "flex-start",
                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                                sx: {
                                    boxShadow: "0px 4px 11px rgba(39, 50, 86, 0.04), 0px 2.59259px 6.44213px rgba(39, 50, 86, 0.08), 0px 0.5px 1px rgba(39, 50, 86, 0.15)",
                                    background: "white",
                                    width: "100%",
                                    borderRadius: 2
                                },
                                p: {
                                    xs: 3,
                                    md: 6
                                },
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                        sx: {
                                            typography: "bpLargeText",
                                            fontWeight: "500"
                                        },
                                        children: "API Keys"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                                        sx: {
                                            my: 2
                                        },
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                                sx: {
                                                    typography: "bpBodyCopy"
                                                },
                                                children: "These keys allow you to access the block protocol from within your application."
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Typography/* default */.Z, {
                                                sx: {
                                                    typography: "bpBodyCopy"
                                                },
                                                children: [
                                                    "Keep them private to prevent other people from accessing your account. ",
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("br", {}),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* Link */.rU, {
                                                        href: "/docs/embedding-blocks#discovering-blocks",
                                                        children: "Learn More"
                                                    })
                                                ]
                                            })
                                        ]
                                    }),
                                    !!tableRows.length && /*#__PURE__*/ (0,jsx_runtime.jsx)(Table_Table, {
                                        header: [
                                            "Name",
                                            "Public ID",
                                            "Last Used",
                                            "Created"
                                        ],
                                        rows: tableRows
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                                        sx: {
                                            paddingTop: 2
                                        },
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* Button */.z, {
                                                color: activeKey ? "warning" : "gray",
                                                onClick: function() {
                                                    return setGenerateStatus({
                                                        showModal: true,
                                                        keyToRegenerate: activeKey
                                                    });
                                                },
                                                sx: {
                                                    width: {
                                                        xs: "100%",
                                                        md: "auto"
                                                    }
                                                },
                                                variant: "tertiary",
                                                children: activeKey ? /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(icons/* WarningIcon */.aN, {
                                                            width: "auto",
                                                            height: "1em",
                                                            sx: {
                                                                fontSize: "1em",
                                                                marginRight: 1
                                                            }
                                                        }),
                                                        " ",
                                                        "Regenerate API Key"
                                                    ]
                                                }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(jsx_runtime.Fragment, {
                                                    children: "Create new key"
                                                })
                                            }),
                                            generateKeyStatus.showModal ? /*#__PURE__*/ (0,jsx_runtime.jsx)(GenerateApiModal, {
                                                close: closeGenerateModal,
                                                keyNameToRegenerate: (ref = generateKeyStatus.keyToRegenerate) === null || ref === void 0 ? void 0 : ref.displayName,
                                                refetchKeyList: fetchAndSetApiKeys
                                            }) : null
                                        ]
                                    })
                                ]
                            })
                        })
                    ]
                })
            })
        ]
    }));
};
/* harmony default export */ var api_keys_page = ((0,authWall/* withAuthWall */.p)(ApiKeys));


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [905,615,692,774,888,179], function() { return __webpack_exec__(7978); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);