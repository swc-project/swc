(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[459],{

/***/ 1470:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/login",
      function () {
        return __webpack_require__(2887);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 2887:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4246);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6677);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7378);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(5310);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(6456);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(4919);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(9761);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(9762);
/* harmony import */ var _lib_apiClient__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3280);
/* harmony import */ var _components_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6437);
/* harmony import */ var _components_Screens_SendLoginCodeScreen__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4939);
/* harmony import */ var _context_UserContext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(505);
/* harmony import */ var _components_Screens_VerificationCodeScreen__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(64);
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









var toStringElseUndefined = function(item) {
    return typeof item === "string" ? item : undefined;
};
var LoginPage = function() {
    var ref = (0,_context_UserContext__WEBPACK_IMPORTED_MODULE_6__/* .useUser */ .a)(), user = ref.user, setUser = ref.setUser;
    var router = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();
    var parsedQuery = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(function() {
        var query = router.query;
        return {
            redirectPath: toStringElseUndefined(query.redirectPath),
            email: toStringElseUndefined(query.email),
            userId: toStringElseUndefined(query.userId),
            verificationCodeId: toStringElseUndefined(query.verificationCodeId),
            code: toStringElseUndefined(query.code)
        };
    }, [
        router
    ]);
    var ref1 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)("Email"), currentScreen = ref1[0], setCurrentScreen = ref1[1];
    var ref2 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(), email = ref2[0], setEmail = ref2[1];
    var ref3 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(), redirectPath = ref3[0], setRedirectPath = ref3[1];
    var ref4 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(), initialVerificationCode = ref4[0], setInitialVerificationCode = ref4[1];
    var ref5 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(), verificationCodeInfo = ref5[0], setVerificationCodeInfo = ref5[1];
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function() {
        if (Object.values(parsedQuery).filter(function(value) {
            return !!value;
        }).length > 0) {
            if (parsedQuery.email) setEmail(parsedQuery.email);
            if (parsedQuery.redirectPath) setRedirectPath(parsedQuery.redirectPath);
            var userId = parsedQuery.userId, verificationCodeId = parsedQuery.verificationCodeId, code = parsedQuery.code;
            if (parsedQuery.email && userId && verificationCodeId && code) {
                setVerificationCodeInfo({
                    userId: userId,
                    verificationCodeId: verificationCodeId
                });
                setInitialVerificationCode(code);
                setCurrentScreen("VerificationCode");
            }
            void router.replace(router.route, undefined, {
                shallow: true
            });
        }
    }, [
        parsedQuery,
        router
    ]);
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function() {
        if (user) {
            void router.push("/");
        }
    }, [
        user,
        router
    ]);
    var handleLoginCodeSent = function(params) {
        setVerificationCodeInfo(params.verificationCodeInfo);
        setEmail(params.email);
        setCurrentScreen("VerificationCode");
    };
    // Router reference invalidates after page load because isReady changes from false to true.
    // We also update redirectPath in useEffect, which changes its reference too. Avoiding both
    // variables inside handleLogin dependencies saves us from triggering multiple API calls.
    var redirectRef = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(function() {});
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function() {
        redirectRef.current = function() {
            void router.push(redirectPath !== null && redirectPath !== void 0 ? redirectPath : "/");
        };
    }, [
        router,
        redirectPath
    ]);
    var handleLogin = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(function(loggedInUser) {
        if (!loggedInUser.isSignedUp) {
        /** @todo: redirect to signup page if user hasn't completed signup */ }
        setUser(loggedInUser);
        redirectRef.current();
    }, [
        setUser
    ]);
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z, {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        sx: {
            flexGrow: 1,
            background: "radial-gradient(141.84% 147.92% at 50% 122.49%, #FFB172 0%, #9482FF 32.87%, #84E6FF 100%)"
        },
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z, {
            sx: {
                paddingTop: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            },
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z, {
                sx: {
                    borderRadius: "6px",
                    padding: 2.5,
                    maxWidth: 600
                },
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z, {
                        marginTop: "-3px",
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z, {
                            in: currentScreen !== "Email",
                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z, {
                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_Button__WEBPACK_IMPORTED_MODULE_4__/* .Button */ .z, {
                                    onClick: function() {
                                        return setCurrentScreen("Email");
                                    },
                                    variant: "transparent",
                                    startIcon: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_12__/* ["default"] */ .Z, {
                                        sx: {
                                            fontSize: 16
                                        },
                                        className: "fas fa-arrow-left"
                                    }),
                                    sx: {
                                        fontSize: 15
                                    },
                                    children: "Back"
                                })
                            })
                        })
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z, {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        sx: function(theme) {
                            return {
                                transition: theme.transitions.create("padding"),
                                padding: {
                                    xs: theme.spacing(2, 0),
                                    sm: 4
                                }
                            };
                        },
                        children: [
                            currentScreen === "Email" ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_Screens_SendLoginCodeScreen__WEBPACK_IMPORTED_MODULE_5__/* .SendLoginCodeScreen */ .o, {
                                initialEmail: email,
                                onLoginCodeSent: handleLoginCodeSent
                            }) : null,
                            currentScreen === "VerificationCode" && verificationCodeInfo && email ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_Screens_VerificationCodeScreen__WEBPACK_IMPORTED_MODULE_7__/* .VerificationCodeScreen */ .u, {
                                verificationCodeInfo: verificationCodeInfo,
                                email: email,
                                setVerificationCodeId: function(verificationCodeId) {
                                    setVerificationCodeInfo(_objectSpread({}, verificationCodeInfo, {
                                        verificationCodeId: verificationCodeId
                                    }));
                                },
                                initialVerificationCode: initialVerificationCode,
                                onSubmit: handleLogin,
                                onChangeEmail: function() {
                                    return setCurrentScreen("Email");
                                },
                                resend: _lib_apiClient__WEBPACK_IMPORTED_MODULE_3__/* .apiClient.sendLoginCode */ .x.sendLoginCode,
                                submit: _lib_apiClient__WEBPACK_IMPORTED_MODULE_3__/* .apiClient.loginWithLoginCode */ .x.loginWithLoginCode
                            }) : null
                        ]
                    })
                ]
            })
        })
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (LoginPage);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774,888,179], function() { return __webpack_exec__(1470); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);