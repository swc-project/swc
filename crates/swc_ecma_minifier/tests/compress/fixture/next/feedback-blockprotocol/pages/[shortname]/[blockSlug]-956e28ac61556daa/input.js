(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[761],{

/***/ 4859:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/[shortname]/[blockSlug]",
      function () {
        return __webpack_require__(4827);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 5397:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "p": function() { return /* binding */ Snippet; }
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4246);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7378);
/* harmony import */ var prismjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7282);
/* harmony import */ var prismjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prismjs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5310);
/* harmony import */ var prismjs_components_prism_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5094);
/* harmony import */ var prismjs_components_prism_json__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prismjs_components_prism_json__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var prismjs_components_prism_json5__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5095);
/* harmony import */ var prismjs_components_prism_json5__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(prismjs_components_prism_json5__WEBPACK_IMPORTED_MODULE_4__);
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




/**
 * Add support for another language:
 *
 * - import the grammar package from "prismjs/components/prism-[language]"
 * - eventually you may have to re-build and download the prism.css
 *   to support the new language at https://prismjs.com/download.html
 *   that file resides at src/styles/prism.css and has to be imported by
 *   nextjs' _app.tsx as per nextjs convention.
 *
 * @see https://prismjs.com
 */ 

var Snippet = function(_param) {
    var source = _param.source, language = _param.language, boxProps = _objectWithoutProperties(_param, [
        "source",
        "language"
    ]);
    var grammar = (prismjs__WEBPACK_IMPORTED_MODULE_2___default().languages)[language];
    if (!grammar) {
        return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z, _objectSpread({
            component: "code"
        }, boxProps, {
            children: source
        })));
    }
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z, _objectSpread({
        component: "code"
    }, boxProps, {
        // trust prism to properly escape the source
        dangerouslySetInnerHTML: {
            __html: prismjs__WEBPACK_IMPORTED_MODULE_2___default().highlight(source, grammar, language)
        }
    })));
};



/***/ }),

/***/ 4827:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "__N_SSG": function() { return /* binding */ __N_SSG; },
  "default": function() { return /* binding */ _blockSlug_page; }
});

// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4246);
// EXTERNAL MODULE: ../node_modules/@mui/material/Box/Box.js + 1 modules
var Box = __webpack_require__(5310);
// EXTERNAL MODULE: ../node_modules/@mui/material/styles/useTheme.js
var useTheme = __webpack_require__(4776);
// EXTERNAL MODULE: ../node_modules/@mui/material/useMediaQuery/useMediaQuery.js
var useMediaQuery = __webpack_require__(8181);
// EXTERNAL MODULE: ../node_modules/@mui/material/Container/Container.js + 1 modules
var Container = __webpack_require__(6456);
// EXTERNAL MODULE: ../node_modules/@mui/material/Breadcrumbs/Breadcrumbs.js + 3 modules
var Breadcrumbs = __webpack_require__(9017);
// EXTERNAL MODULE: ../node_modules/@mui/material/Icon/Icon.js + 1 modules
var Icon = __webpack_require__(9762);
// EXTERNAL MODULE: ../node_modules/@mui/material/Typography/Typography.js + 1 modules
var Typography = __webpack_require__(2750);
// EXTERNAL MODULE: ../node_modules/next/head.js
var head = __webpack_require__(8038);
// EXTERNAL MODULE: ../node_modules/next/router.js
var router = __webpack_require__(6677);
// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(7378);
// EXTERNAL MODULE: ../node_modules/date-fns/esm/formatDistance/index.js + 11 modules
var formatDistance = __webpack_require__(8615);
// EXTERNAL MODULE: ./src/components/BlocksSlider.tsx
var BlocksSlider = __webpack_require__(2751);
// EXTERNAL MODULE: ../node_modules/next/dist/compiled/regenerator-runtime/runtime.js
var runtime = __webpack_require__(5230);
var runtime_default = /*#__PURE__*/__webpack_require__.n(runtime);
;// CONCATENATED MODULE: ./src/components/pages/hub/HubUtils.tsx
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

/* eslint-disable global-require */ var blockDependencies = {
    react: __webpack_require__(7378),
    "react-dom": __webpack_require__(1542),
    twind: __webpack_require__(4209),
    lodash: __webpack_require__(8784)
};
// @todo temporary fallback until block implements workarounds for CORS-blocked oembed endpoints
function getEmbedBlock(url) {
    return _getEmbedBlock.apply(this, arguments);
}
function _getEmbedBlock() {
    _getEmbedBlock = _asyncToGenerator(runtime_default().mark(function _callee(url) {
        var embedResponse, html, error, provider_name, height, width;
        return runtime_default().wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    embedResponse = null;
                    _ctx.prev = 1;
                    _ctx.next = 4;
                    return fetch("/api/fetchEmbedCode?url=".concat(url)).then(function(response) {
                        return response.json();
                    });
                case 4:
                    embedResponse = _ctx.sent;
                    _ctx.next = 10;
                    break;
                case 7:
                    _ctx.prev = 7;
                    _ctx.t0 = _ctx["catch"](1);
                    return _ctx.abrupt("return", {
                        html: "",
                        error: "Embed Code for URL ".concat(url, " not found")
                    });
                case 10:
                    if (embedResponse) {
                        _ctx.next = 12;
                        break;
                    }
                    return _ctx.abrupt("return", {
                        html: "",
                        error: "Embed Code for URL ".concat(url, " not found")
                    });
                case 12:
                    html = embedResponse.html, error = embedResponse.error, provider_name = embedResponse.provider_name, height = embedResponse.height, width = embedResponse.width;
                    if (!error) {
                        _ctx.next = 15;
                        break;
                    }
                    return _ctx.abrupt("return", {
                        html: "",
                        error: "Embed Code for URL ".concat(url, " not found")
                    });
                case 15:
                    return _ctx.abrupt("return", {
                        html: html,
                        providerName: provider_name,
                        height: height,
                        width: width
                    });
                case 16:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                1,
                7
            ]
        ]);
    }));
    return _getEmbedBlock.apply(this, arguments);
}

// EXTERNAL MODULE: ../node_modules/@mui/material/Tabs/Tabs.js + 8 modules
var Tabs = __webpack_require__(2588);
// EXTERNAL MODULE: ../node_modules/@mui/material/Tab/Tab.js + 1 modules
var Tab = __webpack_require__(9485);
// EXTERNAL MODULE: ../node_modules/jsonschema/lib/index.js
var lib = __webpack_require__(634);
// EXTERNAL MODULE: ./src/components/Snippet.tsx
var Snippet = __webpack_require__(5397);
;// CONCATENATED MODULE: ./src/components/pages/hub/TabPanel.tsx
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


var TabPanel = function(_param) {
    var value = _param.value, index = _param.index, children = _param.children, boxProps = _objectWithoutProperties(_param, [
        "value",
        "index",
        "children"
    ]);
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, _objectSpread({
        role: "tabpanel",
        hidden: value !== index,
        id: "simple-tabpanel-".concat(index),
        "aria-labelledby": "simple-tab-".concat(index),
        sx: _objectSpread({
            height: "100%"
        }, boxProps.sx)
    }, boxProps, {
        children: value === index ? children : null
    })));
};


;// CONCATENATED MODULE: ./src/components/pages/hub/BlockDataTabPanels.tsx




var BlockDataTabPanels = function(param) {
    var blockDataTab = param.blockDataTab, schema = param.schema, text = param.text, setText = param.setText, modalOpen = param.modalOpen;
    var modalHeight = modalOpen ? "60vh" : 450;
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(TabPanel, {
                value: blockDataTab,
                index: 1,
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                    component: "pre",
                    sx: function(theme) {
                        return {
                            height: modalHeight,
                            fontSize: 14,
                            backgroundColor: theme.palette.gray[80],
                            borderBottomLeftRadius: 6,
                            borderBottomRightRadius: 6,
                            overflow: "auto",
                            width: "100%"
                        };
                    },
                    p: 4,
                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Snippet/* Snippet */.p, {
                        sx: {
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace",
                            overflow: "auto",
                            height: "100%",
                            whiteSpace: "break-spaces"
                        },
                        source: JSON.stringify(schema, null, 2),
                        language: "json"
                    })
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(TabPanel, {
                value: blockDataTab,
                index: 0,
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                    sx: {
                        height: modalHeight,
                        fontSize: 14,
                        width: "100%"
                    },
                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                        component: "textarea",
                        value: text,
                        onChange: function(event) {
                            return setText(event.target.value);
                        },
                        sx: function(theme) {
                            return {
                                minHeight: "100%",
                                backgroundColor: theme.palette.gray[80],
                                color: "white",
                                borderBottomLeftRadius: 6,
                                borderBottomRightRadius: 6,
                                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace",
                                resize: "none",
                                width: "100%",
                                overflow: "auto"
                            };
                        },
                        p: 2,
                        placeholder: "Your block input goes here..."
                    })
                })
            })
        ]
    }));
};

;// CONCATENATED MODULE: ./src/components/pages/hub/BlockDataTabs.tsx


var BlockDataTabs = function(param) {
    var blockDataTab = param.blockDataTab, setBlockDataTab = param.setBlockDataTab, modalOpen = param.modalOpen;
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(Tabs/* default */.Z, {
        value: blockDataTab,
        onChange: function(_event, newValue) {
            return setBlockDataTab(newValue);
        },
        TabIndicatorProps: {
            style: {
                display: "none"
            }
        },
        sx: function(theme) {
            return {
                "& .MuiTab-root": {
                    textTransform: "none",
                    color: theme.palette.gray[modalOpen ? 60 : 80],
                    backgroundColor: modalOpen ? "#313D48" : theme.palette.common.white,
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                    border: "1px solid transparent",
                    borderBottom: "0px",
                    transition: "0.25s all ease-in-out",
                    margin: 0,
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    ":hover": {
                        backgroundColor: modalOpen ? theme.palette.common.white : undefined,
                        color: modalOpen ? "black" : undefined,
                        "&:not(.Mui-selected)": {
                            border: !modalOpen ? "1px solid #e5e5e5" : undefined,
                            borderBottom: "0px"
                        }
                    }
                },
                "& .MuiTab-root.Mui-selected": {
                    backgroundColor: theme.palette.gray[80],
                    color: theme.palette.common.white
                }
            };
        },
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Tab/* default */.Z, {
                label: "Data Source"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Tab/* default */.Z, {
                label: "Block Schema"
            })
        ]
    }));
};

// EXTERNAL MODULE: ./src/components/icons/index.ts + 14 modules
var icons = __webpack_require__(9829);
;// CONCATENATED MODULE: ./src/components/pages/hub/BlockModalButton.tsx



var BlockModalButton = function(param) {
    var setBlockModalOpen = param.setBlockModalOpen, modalOpen = param.modalOpen;
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
        component: "button",
        onClick: function() {
            return setBlockModalOpen(function(oldValue) {
                return !oldValue;
            });
        },
        sx: {
            padding: 0,
            margin: "29px 20px 20px auto",
            display: "flex",
            color: "white",
            ".expand-text": {
                opacity: 0
            },
            svg: {
                path: {
                    transition: "0.25s all ease-in-out"
                },
                rect: {
                    transition: "0.25s all ease-in-out"
                }
            },
            ":hover": {
                ".expand-text": {
                    opacity: 1
                },
                svg: {
                    path: {
                        fill: "white"
                    },
                    rect: {
                        stroke: "white"
                    }
                }
            }
        },
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                sx: {
                    transition: "0.25s all ease-in-out"
                },
                className: "expand-text",
                children: modalOpen ? "Collapse" : "Expand"
            }),
            modalOpen ? /*#__PURE__*/ (0,jsx_runtime.jsx)(icons/* CollapseIcon */.W5, {
                sx: {
                    marginLeft: function(theme) {
                        return theme.spacing(1);
                    },
                    color: "#64778C"
                }
            }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(icons/* ExpandIcon */.Qq, {
                sx: {
                    marginLeft: function(theme) {
                        return theme.spacing(1);
                    },
                    color: "#64778C"
                }
            })
        ]
    }));
};

// EXTERNAL MODULE: ../node_modules/@mui/material/Modal/Modal.js + 8 modules
var Modal = __webpack_require__(5904);
// EXTERNAL MODULE: ../node_modules/@mui/system/esm/colorManipulator.js
var colorManipulator = __webpack_require__(7818);
;// CONCATENATED MODULE: ./src/components/pages/hub/BlockTabsModal.tsx





var BlockTabsModal = function(param1) {
    var open = param1.open, setOpen = param1.setOpen, blockDataTab = param1.blockDataTab, setBlockDataTab = param1.setBlockDataTab, schema = param1.schema, text = param1.text, setText = param1.setText;
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Modal/* default */.Z, {
        open: open,
        onClose: function() {
            return setOpen(function(oldValue) {
                return !oldValue;
            });
        },
        BackdropProps: {
            sx: {
                backgroundColor: function(param) {
                    var palette = param.palette;
                    return (0,colorManipulator/* alpha */.Fq)(palette.gray[70], 0.6);
                }
            }
        },
        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
            sx: {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "50vw",
                boxShadow: 24,
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6
            },
            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                position: "relative",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(BlockDataTabs, {
                        blockDataTab: blockDataTab,
                        setBlockDataTab: setBlockDataTab,
                        modalOpen: true
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(BlockDataTabPanels, {
                        blockDataTab: blockDataTab,
                        schema: schema,
                        text: text,
                        setText: setText,
                        modalOpen: true
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                        style: {
                            position: "absolute",
                            height: "80px",
                            width: "100%",
                            bottom: 0,
                            borderBottomLeftRadius: 6,
                            borderBottomRightRadius: 6,
                            textAlign: "right"
                        },
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(BlockModalButton, {
                            modalOpen: open,
                            setBlockModalOpen: setOpen
                        })
                    })
                ]
            })
        })
    }));
};

;// CONCATENATED MODULE: ./src/components/pages/hub/BlockDataContainer.tsx
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'mock-block-dock'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
function BlockDataContainer_defineProperty(obj, key, value) {
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
function BlockDataContainer_objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            BlockDataContainer_defineProperty(target, key, source[key]);
        });
    }
    return target;
}











var validator = new lib.Validator();
var BlockDataContainer = function(param1) {
    var metadata = param1.metadata, schema = param1.schema, blockModule = param1.blockModule;
    var ref;
    var ref1 = (0,react.useState)(0), blockDataTab = ref1[0], setBlockDataTab = ref1[1];
    var ref2 = (0,react.useState)(0), blockTab = ref2[0], setBlockTab = ref2[1];
    var ref3 = (0,react.useState)(false), blockModalOpen = ref3[0], setBlockModalOpen = ref3[1];
    var example = (ref = metadata.examples) === null || ref === void 0 ? void 0 : ref[0];
    var ref4 = (0,react.useState)(example ? JSON.stringify(example, undefined, 2) : "{}"), text = ref4[0], setText = ref4[1];
    var theme = (0,useTheme/* default */.Z)();
    var isMobile = (0,useMediaQuery/* default */.Z)(theme.breakpoints.down("md"));
    var ref5 = (0,react.useState)(0), activeMobileTab = ref5[0], setActiveMobileTab = ref5[1];
    var prevPackage = (0,react.useRef)(metadata.packagePath);
    (0,react.useEffect)(function() {
        if (prevPackage.current !== metadata.packagePath) {
            // reset data source input when switching blocks
            if (example) {
                setText(JSON.stringify(example, undefined, 2));
            } else {
                setText("");
            }
        }
        prevPackage.current = metadata.packagePath;
    }, [
        example,
        metadata.packagePath,
        text
    ]);
    /** used to recompute props and errors on dep changes (caching has no benefit here) */ var ref6 = (0,react.useMemo)(function() {
        var result = {
            accountId: "test-account-1",
            entityId: "test-entity-1",
            getEmbedBlock: getEmbedBlock
        };
        try {
            Object.assign(result, JSON.parse(text));
        } catch (err1) {
            return [
                result,
                [
                    err1.message
                ]
            ];
        }
        var errorsToEat = [
            "uploadFile",
            "getEmbedBlock"
        ];
        var errorMessages = validator.validate(result, schema !== null && schema !== void 0 ? schema : {}).errors.map(function(err) {
            return "ValidationError: ".concat(err.stack);
        }).filter(function(err) {
            return !errorsToEat.some(function(errorToEat) {
                return err.includes(errorToEat);
            });
        });
        return [
            result,
            errorMessages
        ];
    }, [
        text,
        schema
    ]), props = ref6[0], errors = ref6[1];
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
        children: [
            isMobile && /*#__PURE__*/ (0,jsx_runtime.jsxs)(Tabs/* default */.Z, {
                value: activeMobileTab,
                onChange: function(_event, newValue) {
                    return setActiveMobileTab(newValue);
                },
                sx: {
                    backgroundColor: theme.palette.gray[10],
                    border: "1px solid ".concat(theme.palette.gray[20]),
                    borderRadius: "6px",
                    display: "flex",
                    position: "relative",
                    "& .MuiTab-root": {
                        flex: 1,
                        zIndex: 2,
                        display: "flex",
                        justifyContent: "center",
                        marginRight: 0
                    }
                },
                TabIndicatorProps: {
                    style: {
                        backgroundColor: theme.palette.common.white,
                        borderRadius: "6px",
                        position: "absolute",
                        top: 4,
                        bottom: 4,
                        marginLeft: "4px",
                        height: "unset",
                        boxShadow: theme.shadows[1],
                        width: "48% !important"
                    }
                },
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Tab/* default */.Z, {
                        label: "Preview"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Tab/* default */.Z, {
                        label: "Source Code"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                mt: {
                    xs: 2,
                    md: 5
                },
                sx: {
                    display: {
                        xs: "flex",
                        md: "grid"
                    },
                    flexDirection: {
                        xs: "column",
                        md: "unset"
                    },
                    gridTemplateColumns: {
                        md: "60% 40%"
                    }
                },
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                        sx: BlockDataContainer_objectSpread({}, isMobile && {
                            display: activeMobileTab === 0 ? "block" : "none"
                        }),
                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                            sx: {
                                height: 450,
                                backgroundColor: "white"
                            },
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Tabs/* default */.Z, {
                                    TabIndicatorProps: {
                                        style: {
                                            display: "none"
                                        }
                                    },
                                    sx: {
                                        "& .MuiTab-root": {
                                            textTransform: "none",
                                            color: function(param) {
                                                var palette = param.palette;
                                                return palette.gray[60];
                                            },
                                            "&.Mui-selected": {
                                                backgroundColor: theme.palette.gray[10],
                                                color: theme.palette.purple[700],
                                                borderTopLeftRadius: 6,
                                                borderTopRightRadius: 6
                                            }
                                        }
                                    },
                                    value: blockTab,
                                    onChange: function(_event, newValue) {
                                        return setBlockTab(newValue);
                                    },
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Tab/* default */.Z, {
                                        label: metadata.displayName
                                    })
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(TabPanel, {
                                    value: blockTab,
                                    index: 0,
                                    sx: {
                                        overflow: "auto",
                                        padding: theme.spacing(4, 4),
                                        height: "100%",
                                        backgroundColor: "#F7FAFC"
                                    },
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                                        display: "flex",
                                        alignItems: "center",
                                        sx: {
                                            height: "max-content",
                                            minHeight: "100%",
                                            mx: "auto"
                                        },
                                        children: blockModule && /*#__PURE__*/ (0,jsx_runtime.jsx)(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'mock-block-dock'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(blockModule.default, BlockDataContainer_objectSpread({}, props))
                                        })
                                    })
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                        sx: BlockDataContainer_objectSpread({}, isMobile && {
                            // @todo use an enum value instead
                            display: activeMobileTab === 1 ? "block" : "none"
                        }),
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(BlockDataTabs, {
                                blockDataTab: blockDataTab,
                                setBlockDataTab: setBlockDataTab
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                                sx: {
                                    position: "relative",
                                    borderBottomLeftRadius: 6,
                                    borderBottomRightRadius: 6
                                },
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(BlockDataTabPanels, {
                                        blockDataTab: blockDataTab,
                                        text: text,
                                        setText: setText,
                                        schema: schema
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                                        sx: {
                                            position: "absolute",
                                            height: 80,
                                            width: "100%",
                                            bottom: 0,
                                            background: "linear-gradient(0deg, #39444F 18.14%, rgba(57, 68, 79, 0) 100%)",
                                            borderBottomLeftRadius: 6,
                                            borderBottomRightRadius: 6,
                                            textAlign: "right"
                                        },
                                        children: !isMobile && /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(BlockModalButton, {
                                                    setBlockModalOpen: setBlockModalOpen
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime.jsx)(BlockTabsModal, {
                                                    open: blockModalOpen,
                                                    setOpen: setBlockModalOpen,
                                                    blockDataTab: blockDataTab,
                                                    setBlockDataTab: setBlockDataTab,
                                                    schema: schema,
                                                    text: text,
                                                    setText: setText
                                                })
                                            ]
                                        })
                                    })
                                ]
                            }),
                            errors.length > 0 && /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                                component: "details",
                                mt: 2,
                                px: 3,
                                py: 2,
                                sx: {
                                    borderRadius: "6px",
                                    backgroundColor: "#fecaca"
                                },
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                                        component: "summary",
                                        sx: {
                                            cursor: "pointer"
                                        },
                                        children: "Errors"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                                        component: "ul",
                                        px: 4,
                                        py: 2,
                                        sx: {
                                            listStyleType: "square"
                                        },
                                        children: errors.map(function(err) {
                                            /*#__PURE__*/ return (0,jsx_runtime.jsx)("li", {
                                                children: err
                                            }, err);
                                        })
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    }));
};

// EXTERNAL MODULE: ./src/components/Link.tsx
var Link = __webpack_require__(1131);
;// CONCATENATED MODULE: ./src/pages/[shortname]/[blockSlug].page.tsx










var blockRequire = function(name) {
    if (!(name in blockDependencies)) {
        throw new Error("missing dependency ".concat(name));
    }
    return blockDependencies[name];
};
var blockEval = function(source) {
    var exports_ = {};
    var module_ = {
        exports: exports_
    };
    // eslint-disable-next-line no-new-func
    var moduleFactory = new Function("require", "module", "exports", source);
    moduleFactory(blockRequire, module_, exports_);
    return module_.exports;
};
var Bullet = function() {
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
        component: "span",
        mx: 1.5,
        sx: {
            color: "#DDE7F0"
        },
        children: "•"
    }));
};
var parseQueryParams = function(params) {
    var shortname = params.shortname ? typeof params.shortname === "string" ? params.shortname : params.shortname.length === 1 ? params.shortname[0] : undefined : undefined;
    if (!shortname) {
        throw new Error("Could not parse org shortname from query");
    }
    var blockSlug = params.blockSlug ? typeof params.blockSlug === "string" ? params.blockSlug : params.blockSlug.length === 1 ? params.blockSlug[0] : undefined : undefined;
    if (!blockSlug) {
        throw new Error("Could not parse block slug from query");
    }
    return {
        shortname: shortname,
        blockSlug: blockSlug
    };
};
var BlockPage = function(param1) {
    var blockMetadata = param1.blockMetadata, schema = param1.schema, blockStringifiedSource = param1.blockStringifiedSource, catalog = param1.catalog;
    var query = (0,router.useRouter)().query;
    var shortname = parseQueryParams(query || {}).shortname;
    var blockModule = (0,react.useMemo)(function() {
        return  false ? 0 : blockEval(blockStringifiedSource);
    }, [
        blockStringifiedSource
    ]);
    var theme = (0,useTheme/* default */.Z)();
    var md = (0,useMediaQuery/* default */.Z)(theme.breakpoints.up("md"));
    var isDesktopSize = md;
    var sliderItems = (0,react.useMemo)(function() {
        return catalog.filter(function(param) {
            var name = param.name;
            return name !== blockMetadata.name;
        });
    }, [
        catalog,
        blockMetadata
    ]);
    var _icon, _icon1;
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(head["default"], {
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("title", {
                    children: [
                        "Block Protocol - ",
                        blockMetadata.displayName,
                        " Block by ",
                        shortname
                    ]
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Container/* default */.Z, {
                children: [
                    isDesktopSize ? null : /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                        mb: 1,
                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Breadcrumbs/* default */.Z, {
                            separator: /*#__PURE__*/ (0,jsx_runtime.jsx)(Icon/* default */.Z, {
                                sx: {
                                    fontSize: 14,
                                    color: function(param) {
                                        var palette = param.palette;
                                        return palette.gray[40];
                                    }
                                },
                                className: "fas fa-chevron-right"
                            }),
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* Link */.rU, {
                                    href: "/",
                                    children: "Home"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* Link */.rU, {
                                    href: "/hub",
                                    children: "Block Hub"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                    variant: "bpSmallCopy",
                                    color: "inherit",
                                    children: blockMetadata.displayName
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                        sx: {
                            display: "flex",
                            pt: {
                                xs: 4,
                                md: 10
                            },
                            mb: {
                                xs: 6,
                                md: 12
                            }
                        },
                        children: [
                            isDesktopSize ? /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                variant: "bpHeading1",
                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                                    sx: {
                                        display: "inline-block",
                                        mr: 3,
                                        height: "2em",
                                        width: "2em"
                                    },
                                    component: "img",
                                    src: (_icon = blockMetadata.icon) !== null && _icon !== void 0 ? _icon : undefined
                                })
                            }) : null,
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Typography/* default */.Z, {
                                        sx: {
                                            display: {
                                                xs: "flex",
                                                md: "unset"
                                            }
                                        },
                                        variant: "bpHeading1",
                                        mt: 2,
                                        children: [
                                            !isDesktopSize && /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                                                sx: {
                                                    display: "inline-block",
                                                    height: "1em",
                                                    width: "1em",
                                                    mr: 2
                                                },
                                                component: "img",
                                                src: (_icon1 = blockMetadata.icon) !== null && _icon1 !== void 0 ? _icon1 : undefined
                                            }),
                                            blockMetadata.displayName
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                        variant: "bpBodyCopy",
                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                                            sx: {
                                                color: theme.palette.gray[70]
                                            },
                                            children: blockMetadata.description
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)(Typography/* default */.Z, {
                                        variant: "bpSmallCopy",
                                        sx: {
                                            color: function(param) {
                                                var palette = param.palette;
                                                return palette.gray[60];
                                            }
                                        },
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                children: [
                                                    "By",
                                                    " ",
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                                                        component: "span",
                                                        sx: {
                                                            color: function(param) {
                                                                var palette = param.palette;
                                                                return palette.purple[700];
                                                            }
                                                        },
                                                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* Link */.rU, {
                                                            href: "/".concat(shortname),
                                                            children: shortname
                                                        })
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Bullet, {}),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                                children: [
                                                    "V",
                                                    blockMetadata.version
                                                ]
                                            }),
                                            blockMetadata.lastUpdated ? /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                                children: [
                                                    isDesktopSize && /*#__PURE__*/ (0,jsx_runtime.jsx)(Bullet, {}),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                                                        component: "span",
                                                        sx: {
                                                            display: {
                                                                xs: "block",
                                                                md: "inline-block"
                                                            }
                                                        },
                                                        children: "Updated ".concat((0,formatDistance/* default */.Z)(new Date(blockMetadata.lastUpdated), new Date(), {
                                                            addSuffix: true
                                                        }))
                                                    })
                                                ]
                                            }) : null
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                        sx: {
                            mb: 15
                        },
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(BlockDataContainer, {
                            metadata: blockMetadata,
                            schema: schema,
                            blockModule: blockModule
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                        textAlign: "center",
                        variant: "bpHeading2",
                        mb: 3,
                        children: "Explore more blocks"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(BlocksSlider/* BlocksSlider */.Z, {
                catalog: sliderItems
            })
        ]
    }));
};
var __N_SSG = true;
/* harmony default export */ var _blockSlug_page = (BlockPage);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [905,615,386,634,774,888,179], function() { return __webpack_exec__(4859); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);