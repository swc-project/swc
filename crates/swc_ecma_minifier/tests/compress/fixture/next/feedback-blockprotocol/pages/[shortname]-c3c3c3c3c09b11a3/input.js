(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[864],{

/***/ 105:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/[shortname]",
      function () {
        return __webpack_require__(1065);
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

/***/ 1065:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "__N_SSP": function() { return /* binding */ __N_SSP; },
  "default": function() { return /* binding */ index_page; }
});

// EXTERNAL MODULE: ../node_modules/next/dist/compiled/regenerator-runtime/runtime.js
var runtime = __webpack_require__(5230);
var runtime_default = /*#__PURE__*/__webpack_require__.n(runtime);
// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4246);
// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(7378);
// EXTERNAL MODULE: ../node_modules/@mui/material/styles/useTheme.js
var useTheme = __webpack_require__(4776);
// EXTERNAL MODULE: ../node_modules/@mui/material/useMediaQuery/useMediaQuery.js
var useMediaQuery = __webpack_require__(8181);
// EXTERNAL MODULE: ../node_modules/@mui/material/Divider/Divider.js
var Divider = __webpack_require__(9119);
// EXTERNAL MODULE: ../node_modules/@mui/material/Box/Box.js + 1 modules
var Box = __webpack_require__(5310);
// EXTERNAL MODULE: ../node_modules/@mui/material/Container/Container.js + 1 modules
var Container = __webpack_require__(6456);
// EXTERNAL MODULE: ../node_modules/@mui/material/Grid/Grid.js + 2 modules
var Grid = __webpack_require__(4384);
// EXTERNAL MODULE: ../node_modules/@mui/material/Typography/Typography.js + 1 modules
var Typography = __webpack_require__(2750);
// EXTERNAL MODULE: ../node_modules/next/head.js
var head = __webpack_require__(8038);
// EXTERNAL MODULE: ../node_modules/next/router.js
var next_router = __webpack_require__(6677);
// EXTERNAL MODULE: ../node_modules/@mui/material/Icon/Icon.js + 1 modules
var Icon = __webpack_require__(9762);
// EXTERNAL MODULE: ../node_modules/date-fns/esm/formatDistance/index.js + 11 modules
var formatDistance = __webpack_require__(8615);
// EXTERNAL MODULE: ./src/components/Link.tsx
var Link = __webpack_require__(1131);
;// CONCATENATED MODULE: ./src/components/pages/user/utils.ts
/**
 * Insert shy hypen indicators at capital letters within single words to improve wrapping ability
 */ var shy = function(text) {
    return text.replace(/([a-z])([A-Z])/g, "$1\xad$2");
};

;// CONCATENATED MODULE: ./src/components/pages/user/ListViewCard.tsx





var ListViewCard = function(param1) {
    var title = param1.title, description = param1.description, icon = param1.icon, lastUpdated = param1.lastUpdated, url = param1.url;
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* Link */.rU, {
        href: url,
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
            sx: {
                display: "flex",
                pt: 3,
                pb: 3,
                borderBottom: function(param) {
                    var palette = param.palette;
                    return "1px solid ".concat(palette.gray[30]);
                },
                "&:hover": {
                    "& .list-view__title": {
                        color: function(param) {
                            var palette = param.palette;
                            return palette.purple[600];
                        }
                    }
                }
            },
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                    sx: {
                        mr: 2,
                        minWidth: 24
                    },
                    children: icon ? /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                        component: "img",
                        src: icon,
                        sx: {
                            height: 24,
                            width: 24
                        }
                    }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(Icon/* default */.Z, {
                        sx: {
                            height: 24,
                            width: 24,
                            color: function(param) {
                                var palette = param.palette;
                                return palette.gray[80];
                            }
                        },
                        className: "fa-solid fa-table-tree"
                    })
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                    sx: {
                        display: "flex",
                        flexDirection: "column"
                    },
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                            className: "list-view__title",
                            sx: {
                                fontWeight: 600,
                                color: function(param) {
                                    var palette = param.palette;
                                    return palette.gray[80];
                                },
                                mb: 1,
                                lineHeight: 1
                            },
                            children: shy(title)
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                            variant: "bpSmallCopy",
                            sx: {
                                color: function(param) {
                                    var palette = param.palette;
                                    return palette.gray[70];
                                },
                                mb: 1
                            },
                            children: description
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                            variant: "bpMicroCopy",
                            sx: {
                                color: function(param) {
                                    var palette = param.palette;
                                    return palette.gray[60];
                                }
                            },
                            children: lastUpdated ? "Updated \n              ".concat((0,formatDistance/* default */.Z)(new Date(lastUpdated), new Date(), {
                                addSuffix: true
                            })) : ""
                        })
                    ]
                })
            ]
        })
    }));
};

// EXTERNAL MODULE: ./src/lib/apiClient.ts
var apiClient = __webpack_require__(3280);
;// CONCATENATED MODULE: ./src/components/pages/user/Avatar.tsx
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



var getInitial = function(name) {
    if (name.length > 0) {
        return name[0];
    }
    return "U";
};
var Avatar = function(_param) {
    var _size = _param.size, size = _size === void 0 ? 250 : _size, _name = _param.name, name = _name === void 0 ? "A" : _name, boxProps = _objectWithoutProperties(_param, [
        "size",
        "name"
    ]);
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
        sx: _objectSpread({
            height: size,
            width: size,
            background: "linear-gradient(359.31deg, #7158FF 0.28%, #7F68FF 99.11%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px"
        }, boxProps.sx),
        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
            sx: {
                fontSize: 0.64 * size,
                lineHeight: 1.2,
                color: function(param) {
                    var palette = param.palette;
                    return palette.common.white;
                },
                fontWeight: 900
            },
            children: getInitial(name)
        })
    }));
};


;// CONCATENATED MODULE: ./src/components/pages/user/Sidebar.tsx



var Sidebar = function(param1) {
    var isMobile = param1.isMobile, user = param1.user;
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
        sx: {
            width: "100%",
            mt: {
                xs: 0,
                md: -4
            },
            display: "flex",
            flexDirection: {
                xs: "row",
                md: "column"
            }
        },
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Avatar, {
                size: isMobile ? 72 : 250,
                name: user.preferredName || user.shortname,
                sx: {
                    mb: 2,
                    mr: {
                        xs: 2,
                        md: 0
                    }
                }
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                        variant: "bpHeading3",
                        sx: {
                            mb: 0.5
                        },
                        children: user.preferredName
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                        variant: "bpLargeText",
                        sx: {
                            color: function(param) {
                                var palette = param.palette;
                                return palette.gray[60];
                            }
                        },
                        children: "@".concat(user.shortname)
                    })
                ]
            })
        ]
    }));
};

// EXTERNAL MODULE: ./src/components/Spacer.tsx
var Spacer = __webpack_require__(7747);
;// CONCATENATED MODULE: ./src/components/pages/user/OverviewCard.tsx






var OverviewCard = function(param1) {
    var image = param1.image, type = param1.type, title = param1.title, description = param1.description, icon = param1.icon, lastUpdated = param1.lastUpdated, version = param1.version, url = param1.url, hideImage = param1.hideImage;
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* Link */.rU, {
        href: url,
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
            sx: {
                borderRadius: "8px",
                boxShadow: 1,
                backgroundColor: function(param) {
                    var palette = param.palette;
                    return palette.common.white;
                },
                "&:hover": {
                    boxShadow: 3,
                    "& .overview-card__name": {
                        color: function(param) {
                            var palette = param.palette;
                            return palette.purple[600];
                        }
                    }
                },
                cursor: "pointer"
            },
            children: [
                image && !hideImage && /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                    sx: {
                        backgroundColor: function(param) {
                            var palette = param.palette;
                            return palette.gray[20];
                        },
                        py: 3,
                        px: 2.75,
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px"
                    },
                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                        sx: {
                            paddingTop: "66.67%",
                            backgroundColor: function(param) {
                                var palette = param.palette;
                                return image ? "transparent" : palette.gray[70];
                            },
                            borderRadius: "4px",
                            position: "relative"
                        },
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                            sx: {
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0
                            },
                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                                component: "img",
                                sx: {
                                    display: "block",
                                    height: "100%",
                                    width: "100%",
                                    objectFit: "contain",
                                    borderRadius: "4px",
                                    filter: "\n                        drop-shadow(0px 2px 8px rgba(39, 50, 86, 0.04))\n                        drop-shadow(0px 2.59259px 6.44213px rgba(39, 50, 86, 0.06))\n                        drop-shadow(0px 0.5px 1px rgba(39, 50, 86, 0.10))\n                      "
                                },
                                src: image
                            })
                        })
                    })
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                    sx: {
                        p: 3
                    },
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                            sx: {
                                mb: 2,
                                display: "flex",
                                alignItems: "center",
                                position: "relative"
                            },
                            children: [
                                icon ? /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                                    sx: {
                                        mr: 1.5,
                                        width: 24,
                                        height: 24
                                    },
                                    component: "img",
                                    src: icon !== null && icon !== void 0 ? icon : undefined
                                }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(Icon/* default */.Z, {
                                    sx: {
                                        height: 24,
                                        width: 24,
                                        mr: 1.5,
                                        color: function(param) {
                                            var palette = param.palette;
                                            return palette.gray[80];
                                        }
                                    },
                                    className: "fa-solid fa-table-tree"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                    className: "overview-card__name",
                                    fontWeight: "600",
                                    variant: "bpLargeText",
                                    sx: {
                                        mr: "80px"
                                    },
                                    children: shy(title)
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                                    sx: {
                                        position: "absolute",
                                        right: 0,
                                        top: 0,
                                        border: function(param) {
                                            var palette = param.palette;
                                            return "1px solid ".concat(palette.gray[30]);
                                        },
                                        minHeight: 25,
                                        px: 1.25,
                                        borderRadius: "30px",
                                        display: "flex",
                                        alignItems: "center"
                                    },
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                        variant: "bpMicroCopy",
                                        sx: {
                                            lineHeight: 1,
                                            color: function(param) {
                                                var palette = param.palette;
                                                return palette.gray[60];
                                            }
                                        },
                                        children: type === "block" ? "Block" : "Schema"
                                    })
                                })
                            ]
                        }),
                        description && /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                            variant: "bpSmallCopy",
                            sx: {
                                display: "block",
                                color: "gray.70"
                            },
                            children: description.length <= 100 ? description : "".concat(description === null || description === void 0 ? void 0 : description.slice(0, 100), "...")
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Spacer/* Spacer */.L, {
                            height: 3
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                            sx: {
                                typography: "bpMicroCopy",
                                display: "flex",
                                flexWrap: "wrap"
                            },
                            children: [
                                version && /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                    sx: {
                                        mr: 1.5,
                                        mb: 1.5
                                    },
                                    color: "gray.60",
                                    variant: "bpMicroCopy",
                                    children: version
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                    color: "gray.60",
                                    variant: "bpMicroCopy",
                                    children: lastUpdated ? "Updated \n              ".concat((0,formatDistance/* default */.Z)(new Date(lastUpdated), new Date(), {
                                        addSuffix: true
                                    })) : ""
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    }));
};

// EXTERNAL MODULE: ../node_modules/@mui/material/Tabs/Tabs.js + 8 modules
var Tabs = __webpack_require__(2588);
// EXTERNAL MODULE: ../node_modules/@mui/material/Tab/Tab.js + 1 modules
var Tab = __webpack_require__(9485);
;// CONCATENATED MODULE: ./src/components/pages/user/Tabs.tsx
function Tabs_defineProperty(obj, key, value) {
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
function Tabs_objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            Tabs_defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function Tabs_objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = Tabs_objectWithoutPropertiesLoose(source, excluded);
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
function Tabs_objectWithoutPropertiesLoose(source, excluded) {
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


var TABS = [
    {
        title: "Overview",
        value: "overview"
    },
    {
        title: "Blocks",
        value: "blocks"
    },
    {
        title: "Schemas",
        value: "schemas"
    }, 
];
var TabHeader = function(param1) {
    var activeTab = param1.activeTab, setActiveTab = param1.setActiveTab, tabs = param1.tabs, tabItemsCount = param1.tabItemsCount;
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Tabs/* default */.Z, {
        value: activeTab,
        onChange: function(_, newValue) {
            return setActiveTab(newValue);
        },
        "aria-label": "user-profile-tabs",
        sx: {
            mt: {
                xs: -6,
                md: -6
            },
            mb: 4
        },
        children: tabs.map(function(param2, i) {
            var title = param2.title, value = param2.value;
            /*#__PURE__*/ return (0,jsx_runtime.jsx)(Tab/* default */.Z, {
                label: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                    sx: {
                        display: "flex",
                        alignItems: "center"
                    },
                    children: [
                        title,
                        value !== "overview" && /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                            sx: {
                                ml: 1,
                                minWidth: 25,
                                minHeight: 25,
                                borderRadius: "30px",
                                px: 1,
                                py: 0.25,
                                backgroundColor: function(param) {
                                    var palette = param.palette;
                                    return value === activeTab ? palette.purple[100] : palette.gray[20];
                                },
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            },
                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                variant: "bpMicroCopy",
                                sx: {
                                    color: function(param) {
                                        var palette = param.palette;
                                        return value === activeTab ? palette.purple[600] : palette.gray[60];
                                    }
                                },
                                children: value === "blocks" ? tabItemsCount.blocks : tabItemsCount.schemas
                            })
                        })
                    ]
                }),
                value: value,
                id: "profile-tab-".concat(i),
                "aria-controls": "profile-tabpanel-".concat(i)
            }, value);
        })
    }));
};
var TabPanel = function(_param) {
    var value = _param.value, activeTab = _param.activeTab, index = _param.index, children = _param.children, boxProps = Tabs_objectWithoutProperties(_param, [
        "value",
        "activeTab",
        "index",
        "children"
    ]);
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, Tabs_objectSpread({
        role: "tabpanel",
        hidden: value !== activeTab,
        id: "profile-tabpanel-".concat(index),
        "aria-labelledby": "profile-tab-".concat(index),
        sx: Tabs_objectSpread({
            height: "100%"
        }, boxProps.sx)
    }, boxProps, {
        children: value === activeTab ? children : null
    })));
};


// EXTERNAL MODULE: ./src/components/Button.tsx + 3 modules
var Button = __webpack_require__(6437);
// EXTERNAL MODULE: ./src/context/UserContext.ts
var UserContext = __webpack_require__(505);
// EXTERNAL MODULE: ./src/components/Modal.tsx
var Modal = __webpack_require__(180);
// EXTERNAL MODULE: ./src/components/TextField.tsx + 8 modules
var TextField = __webpack_require__(9601);
;// CONCATENATED MODULE: ./src/pages/[shortname]/index.page.tsx
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
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
            _next(undefined);
        });
    };
}















var SIDEBAR_WIDTH = 300;
var UserPage = function(param1) {
    var user = param1.user, blocks = param1.blocks, entityTypes = param1.entityTypes;
    var ref7 = (0,react.useState)("overview"), activeTab = ref7[0], setActiveTab = ref7[1];
    var ref1 = (0,react.useState)(false), schemaModalOpen = ref1[0], setSchemaModalOpen = ref1[1];
    var ref2 = (0,react.useState)(""), newSchemaTitle = ref2[0], setNewSchemaTitle = ref2[1];
    var ref3 = (0,react.useState)(false), loading = ref3[0], setLoading = ref3[1];
    var ref4 = (0,react.useState)(""), error = ref4[0], setError = ref4[1];
    var theme = (0,useTheme/* default */.Z)();
    var isMobile = (0,useMediaQuery/* default */.Z)(theme.breakpoints.down("md"));
    var router = (0,next_router.useRouter)();
    var ref5 = (0,UserContext/* useUser */.a)(), currentUser = ref5.user;
    var isCurrentUserPage = (0,react.useMemo)(function() {
        if (currentUser !== "loading" && currentUser) {
            return currentUser.id === user.id;
        }
        return false;
    }, [
        user,
        currentUser
    ]);
    var handleSchemaTitleChange = function(value) {
        var formattedText = value.trim();
        // replace all empty spaces
        formattedText = formattedText.replace(/\s/g, "");
        // capitalize text
        if (formattedText.length > 1) {
            formattedText = formattedText[0].toUpperCase() + formattedText.slice(1);
        }
        setNewSchemaTitle(formattedText);
    };
    var handleCreateSchema = (0,react.useCallback)(function() {
        var _ref = _asyncToGenerator(runtime_default().mark(function _callee(evt) {
            var ref, data, apiError, ref6, schemaTitle;
            return runtime_default().wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        evt.preventDefault();
                        if (!(newSchemaTitle === "")) {
                            _ctx.next = 4;
                            break;
                        }
                        setError("Please enter a valid value");
                        return _ctx.abrupt("return");
                    case 4:
                        setLoading(true);
                        _ctx.next = 7;
                        return apiClient/* apiClient.createEntityType */.x.createEntityType({
                            schema: {
                                title: newSchemaTitle
                            }
                        });
                    case 7:
                        ref = _ctx.sent;
                        data = ref.data;
                        apiError = ref.error;
                        setLoading(false);
                        if (apiError) {
                            ;
                            if ((ref6 = apiError.response) === null || ref6 === void 0 ? void 0 : ref6.data.errors) {
                                setError(apiError.response.data.errors[0].msg);
                            } else {
                                // @todo properly handle this
                                setError("An error occured");
                            }
                        } else {
                            schemaTitle = data === null || data === void 0 ? void 0 : data.entityType.schema.title;
                            void router.push("/@".concat(user.shortname, "/types/").concat(schemaTitle));
                        }
                    case 12:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }));
        return function(evt) {
            return _ref.apply(this, arguments);
        };
    }(), [
        user,
        newSchemaTitle,
        router
    ]);
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(head["default"], {
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("title", {
                    children: user.shortname
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Divider/* default */.Z, {
                sx: {
                    borderColor: function(param) {
                        var palette = param.palette;
                        return palette.gray[20];
                    }
                }
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                sx: {
                    background: function(param) {
                        var palette = param.palette;
                        return palette.gray[10];
                    },
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "80vh",
                    pb: 10,
                    mt: {
                        xs: 4,
                        md: 10
                    }
                },
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Container/* default */.Z, {
                    sx: {
                        display: "flex",
                        flexDirection: {
                            xs: "column",
                            md: "row"
                        },
                        flex: 1,
                        justifyContent: "flex-start",
                        maxWidth: "1200px !important"
                    },
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                            sx: {
                                width: {
                                    xs: "100%",
                                    md: SIDEBAR_WIDTH
                                },
                                mr: {
                                    xs: 0,
                                    md: 8
                                },
                                background: {
                                    xs: theme.palette.common.white,
                                    md: "transparent"
                                },
                                pb: 8
                            },
                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Sidebar, {
                                isMobile: isMobile,
                                user: user
                            })
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                            sx: {
                                flex: 1
                            },
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(TabHeader, {
                                    activeTab: activeTab,
                                    setActiveTab: setActiveTab,
                                    tabs: TABS,
                                    tabItemsCount: {
                                        blocks: blocks.length,
                                        schemas: entityTypes.length
                                    }
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(TabPanel, {
                                    activeTab: activeTab,
                                    value: "overview",
                                    index: 0,
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Grid/* default */.ZP, {
                                        columnSpacing: {
                                            xs: 0,
                                            sm: 2
                                        },
                                        rowSpacing: {
                                            xs: 2,
                                            sm: 4
                                        },
                                        container: true,
                                        children: [
                                            blocks.slice(0, 4).map(function(param, index) {
                                                var displayName = param.displayName, description = param.description, icon = param.icon, lastUpdated = param.lastUpdated, version = param.version, name = param.name, image = param.image, packagePath = param.packagePath;
                                                /*#__PURE__*/ return (0,jsx_runtime.jsx)(Grid/* default */.ZP, {
                                                    item: true,
                                                    xs: 12,
                                                    md: 6,
                                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(OverviewCard, {
                                                        url: "/".concat(packagePath),
                                                        description: description,
                                                        icon: icon,
                                                        image: image,
                                                        lastUpdated: lastUpdated,
                                                        title: displayName,
                                                        type: "block",
                                                        version: version,
                                                        // we only show images for the first 2 blocks
                                                        // on desktop
                                                        hideImage: index > 1 || isMobile
                                                    })
                                                }, name);
                                            }),
                                            entityTypes.map(function(param) {
                                                var entityTypeId = param.entityTypeId, schema = param.schema, updatedAt = param.updatedAt;
                                                /*#__PURE__*/ return (0,jsx_runtime.jsx)(Grid/* default */.ZP, {
                                                    item: true,
                                                    xs: 12,
                                                    md: 6,
                                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(OverviewCard, {
                                                        url: schema.$id,
                                                        description: schema.description,
                                                        lastUpdated: typeof updatedAt === "string" ? updatedAt : updatedAt === null || updatedAt === void 0 ? void 0 : updatedAt.toISOString(),
                                                        title: schema.title,
                                                        type: "schema"
                                                    })
                                                }, entityTypeId);
                                            })
                                        ]
                                    })
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(TabPanel, {
                                    activeTab: activeTab,
                                    value: "blocks",
                                    index: 1,
                                    children: blocks.map(function(param) {
                                        var displayName = param.displayName, description = param.description, icon = param.icon, lastUpdated = param.lastUpdated, name = param.name, packagePath = param.packagePath;
                                        /*#__PURE__*/ return (0,jsx_runtime.jsx)(ListViewCard, {
                                            type: "block",
                                            icon: icon,
                                            title: displayName,
                                            description: description,
                                            lastUpdated: lastUpdated,
                                            url: "/".concat(packagePath)
                                        }, name);
                                    })
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)(TabPanel, {
                                    activeTab: activeTab,
                                    value: "schemas",
                                    index: 2,
                                    children: [
                                        isCurrentUserPage && /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                                            sx: {
                                                display: "flex",
                                                justifyContent: {
                                                    xs: "flex-start",
                                                    md: "flex-end"
                                                }
                                            },
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* Button */.z, {
                                                squared: true,
                                                size: "small",
                                                onClick: function() {
                                                    return setSchemaModalOpen(true);
                                                },
                                                children: "Create New Schema"
                                            })
                                        }),
                                        entityTypes.map(function(param) {
                                            var entityTypeId = param.entityTypeId, schema = param.schema, updatedAt = param.updatedAt;
                                            /*#__PURE__*/ return (0,jsx_runtime.jsx)(ListViewCard, {
                                                type: "schema",
                                                title: schema.title,
                                                description: schema.description,
                                                lastUpdated: updatedAt,
                                                url: schema.$id
                                            }, entityTypeId);
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Modal/* Modal */.u, {
                open: schemaModalOpen,
                onClose: function() {
                    return setSchemaModalOpen(false);
                },
                contentStyle: {
                    top: "40%"
                },
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                    sx: {},
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(Typography/* default */.Z, {
                            variant: "bpHeading4",
                            sx: {
                                mb: 2,
                                display: "block"
                            },
                            children: [
                                "Create New ",
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                                    children: "Schema"
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                            sx: {
                                mb: 4,
                                fontSize: 16,
                                lineHeight: 1.5,
                                width: {
                                    xs: "90%",
                                    md: "85%"
                                }
                            },
                            children: " Schemas are used to define the structure of entities - in other\n            words, define a ‘type’ of entity"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                            component: "form",
                            onSubmit: handleCreateSchema,
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(TextField/* TextField */.n, {
                                    sx: {
                                        mb: 3
                                    },
                                    label: "Schema Title",
                                    fullWidth: true,
                                    helperText: error,
                                    value: newSchemaTitle,
                                    onChange: function(evt) {
                                        if (error) {
                                            setError("");
                                        }
                                        handleSchemaTitleChange(evt.target.value);
                                    },
                                    required: true,
                                    error: Boolean(error)
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* Button */.z, {
                                    loading: loading,
                                    // onClick={createSchema}
                                    size: "small",
                                    squared: true,
                                    type: "submit",
                                    children: "Create"
                                })
                            ]
                        })
                    ]
                })
            })
        ]
    }));
};
var __N_SSP = true;
/* harmony default export */ var index_page = (UserPage);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [905,615,774,888,179], function() { return __webpack_exec__(105); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);