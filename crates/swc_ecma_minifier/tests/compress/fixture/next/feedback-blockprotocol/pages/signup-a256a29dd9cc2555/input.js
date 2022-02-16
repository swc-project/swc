(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[616],{

/***/ 9917:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/signup",
      function () {
        return __webpack_require__(450);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 450:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ signup_page; }
});

// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4246);
// EXTERNAL MODULE: ../node_modules/next/router.js
var next_router = __webpack_require__(6677);
// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(7378);
// EXTERNAL MODULE: ../node_modules/@mui/material/Box/Box.js + 1 modules
var Box = __webpack_require__(5310);
// EXTERNAL MODULE: ../node_modules/@mui/material/Container/Container.js + 1 modules
var Container = __webpack_require__(6456);
// EXTERNAL MODULE: ../node_modules/@mui/material/Paper/Paper.js + 1 modules
var Paper = __webpack_require__(4919);
// EXTERNAL MODULE: ../node_modules/@mui/material/Fade/Fade.js
var Fade = __webpack_require__(9761);
// EXTERNAL MODULE: ../node_modules/@mui/material/Icon/Icon.js + 1 modules
var Icon = __webpack_require__(9762);
// EXTERNAL MODULE: ../node_modules/@mui/material/Typography/Typography.js + 1 modules
var Typography = __webpack_require__(2750);
// EXTERNAL MODULE: ./src/components/Button.tsx + 3 modules
var Button = __webpack_require__(6437);
// EXTERNAL MODULE: ../node_modules/next/dist/compiled/regenerator-runtime/runtime.js
var runtime = __webpack_require__(5230);
var runtime_default = /*#__PURE__*/__webpack_require__.n(runtime);
// EXTERNAL MODULE: ./src/lib/apiClient.ts
var apiClient = __webpack_require__(3280);
// EXTERNAL MODULE: ./src/components/TextField.tsx + 8 modules
var TextField = __webpack_require__(9601);
// EXTERNAL MODULE: ./src/components/Link.tsx
var Link = __webpack_require__(1131);
// EXTERNAL MODULE: ./src/components/icons/index.ts + 14 modules
var icons = __webpack_require__(9829);
// EXTERNAL MODULE: ./src/components/hooks/useEmailTextField.ts
var useEmailTextField = __webpack_require__(2705);
;// CONCATENATED MODULE: ./src/components/Screens/SignupScreen.tsx
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










var SignupScreen = function(param1) {
    var initialEmail = param1.initialEmail, onSignup = param1.onSignup, onClose = param1.onClose;
    var emailInputRef = (0,react.useRef)(null);
    (0,react.useEffect)(function() {
        if (emailInputRef.current) {
            emailInputRef.current.select();
        }
    }, [
        emailInputRef
    ]);
    var ref4 = (0,useEmailTextField/* useEmailTextField */.n)({
        initialEmail: initialEmail
    }), emailValue = ref4.emailValue, setEmailValue = ref4.setEmailValue, isEmailInputValid = ref4.isEmailValid, emailHelperText = ref4.emailHelperText;
    var ref1 = (0,react.useState)(false), touchedEmailInput = ref1[0], setTouchedEmailInput = ref1[1];
    var ref2 = (0,react.useState)(false), signingUp = ref2[0], setSigningUp = ref2[1];
    var ref3 = (0,react.useState)(), apiErrorMessage = ref3[0], setApiErrorMessage = ref3[1];
    var handleSubmit = function() {
        var _ref = _asyncToGenerator(runtime_default().mark(function _callee(event) {
            var ref, verificationCodeInfo, error;
            return runtime_default().wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        event.preventDefault();
                        setApiErrorMessage(undefined);
                        setTouchedEmailInput(true);
                        if (!isEmailInputValid) {
                            _ctx.next = 12;
                            break;
                        }
                        setSigningUp(true);
                        _ctx.next = 7;
                        return apiClient/* apiClient.signup */.x.signup({
                            email: emailValue
                        });
                    case 7:
                        ref = _ctx.sent;
                        verificationCodeInfo = ref.data;
                        error = ref.error;
                        setSigningUp(false);
                        if (error) {
                            setApiErrorMessage(error.message);
                        } else if (verificationCodeInfo) {
                            onSignup({
                                verificationCodeInfo: verificationCodeInfo,
                                email: emailValue
                            });
                        }
                    case 12:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }));
        return function handleSubmit(event) {
            return _ref.apply(this, arguments);
        };
    }();
    var reset = function() {
        setEmailValue("");
        setTouchedEmailInput(false);
        setSigningUp(false);
        setApiErrorMessage(undefined);
    };
    var handleClose = function() {
        reset();
        if (onClose) onClose();
    };
    var helperText = touchedEmailInput ? apiErrorMessage !== null && apiErrorMessage !== void 0 ? apiErrorMessage : emailHelperText : undefined;
    var isEmailInvalid = !!apiErrorMessage || !isEmailInputValid;
    var displayError = touchedEmailInput && isEmailInvalid;
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(icons/* BlockProtocolIcon */.lu, {
                sx: {
                    color: function(theme) {
                        return theme.palette.purple[700];
                    },
                    marginBottom: 3
                }
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                mb: 3,
                variant: "bpHeading3",
                textAlign: "center",
                sx: {
                    color: function(param) {
                        var palette = param.palette;
                        return palette.gray[80];
                    }
                },
                children: "Create your Block Protocol account"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                width: "100%",
                component: "form",
                onSubmit: handleSubmit,
                noValidate: true,
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(TextField/* TextField */.n, {
                        sx: {
                            marginBottom: 2
                        },
                        required: true,
                        type: "email",
                        onBlur: function() {
                            return setTouchedEmailInput(true);
                        },
                        error: displayError,
                        helperText: helperText,
                        inputRef: emailInputRef,
                        fullWidth: true,
                        label: "Email address",
                        placeholder: "claude@shannon.com",
                        variant: "outlined",
                        value: emailValue,
                        onChange: function(param) {
                            var target = param.target;
                            if (apiErrorMessage) setApiErrorMessage(undefined);
                            setEmailValue(target.value);
                        }
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* Button */.z, {
                        loading: signingUp,
                        disabled: displayError,
                        fullWidth: true,
                        squared: true,
                        type: "submit",
                        sx: {
                            marginBottom: 3
                        },
                        children: "Continue"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Typography/* default */.Z, {
                textAlign: "center",
                children: [
                    "Have an account?",
                    " ",
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* Link */.rU, {
                        href: {
                            pathname: "/login",
                            query: emailValue ? {
                                email: emailValue
                            } : undefined
                        },
                        onClick: handleClose,
                        children: "Log in"
                    })
                ]
            })
        ]
    }));
};

// EXTERNAL MODULE: ./src/components/Screens/VerificationCodeScreen.tsx + 1 modules
var VerificationCodeScreen = __webpack_require__(64);
// EXTERNAL MODULE: ./src/context/UserContext.ts
var UserContext = __webpack_require__(505);
// EXTERNAL MODULE: ../node_modules/@mui/material/Collapse/Collapse.js + 1 modules
var Collapse = __webpack_require__(1449);
// EXTERNAL MODULE: ../node_modules/@mui/material/FormHelperText/FormHelperText.js + 1 modules
var FormHelperText = __webpack_require__(6274);
// EXTERNAL MODULE: ../node_modules/lodash/lodash.js
var lodash = __webpack_require__(8784);
;// CONCATENATED MODULE: ./src/components/hooks/useShortnameTextField.ts
function useShortnameTextField_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
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
function useShortnameTextField_asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                useShortnameTextField_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                useShortnameTextField_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}




var parseShortnameInput = function(input) {
    return input.replaceAll(/[^a-zA-Z0-9-_]/g, "").toLowerCase();
};
var useShortnameTextField = function(param) {
    var touched = param.touched;
    var ref2 = (0,react.useState)(""), shortname = ref2[0], setShortname = ref2[1];
    var ref1 = (0,react.useState)(), isTaken = ref1[0], setIsTaken = ref1[1];
    var isEmpty = !shortname;
    var isTooShort = shortname.length < 4;
    var isTooLong = shortname.length > 24;
    var shortnameInputIsValid = !(isEmpty || isTooShort || isTooLong);
    var debouncedCheckIfShortnameIsValid = (0,react.useMemo)(function() {
        return (0,lodash.debounce)(function() {
            var _ref = useShortnameTextField_asyncToGenerator(runtime_default().mark(function _callee(params) {
                var ref, isShortnameTaken, error;
                return runtime_default().wrap(function _callee$(_ctx) {
                    while(1)switch(_ctx.prev = _ctx.next){
                        case 0:
                            _ctx.next = 2;
                            return apiClient/* apiClient.get */.x.get("isShortnameTaken", params);
                        case 2:
                            ref = _ctx.sent;
                            isShortnameTaken = ref.data;
                            error = ref.error;
                            if (!error) {
                                _ctx.next = 9;
                                break;
                            }
                            throw error;
                        case 9:
                            if (isShortnameTaken !== undefined) {
                                setIsTaken(isShortnameTaken);
                            }
                        case 10:
                        case "end":
                            return _ctx.stop();
                    }
                }, _callee);
            }));
            return function(params) {
                return _ref.apply(this, arguments);
            };
        }(), 300);
    }, []);
    (0,react.useEffect)(function() {
        if (shortnameInputIsValid) {
            setIsTaken(undefined);
            void debouncedCheckIfShortnameIsValid({
                shortname: shortname
            });
        }
    }, [
        shortnameInputIsValid,
        shortname,
        debouncedCheckIfShortnameIsValid
    ]);
    var isShortnameValid = shortnameInputIsValid && isTaken === false;
    var shortnameHelperText = isEmpty && touched ? "You must choose a username" : isTooShort && touched ? "Must be at least 4 characters" : isTooLong ? "Must be shorter than 24 characters" : isTaken ? "This user has already been taken" : isShortnameValid ? "We’ll use this as your public display name" : undefined;
    return {
        shortname: shortname,
        setShortname: function(updatedShortname) {
            return setShortname(parseShortnameInput(updatedShortname));
        },
        isShortnameValid: isShortnameValid,
        shortnameHelperText: shortnameHelperText
    };
};

;// CONCATENATED MODULE: ./src/components/Screens/CompleteSignupScreen.tsx
function CompleteSignupScreen_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
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
function CompleteSignupScreen_asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                CompleteSignupScreen_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                CompleteSignupScreen_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}









var CompleteSignupScreen = function(param1) {
    var email = param1.email;
    var setUser = (0,UserContext/* useUser */.a)().setUser;
    var shortnameInputRef = (0,react.useRef)(null);
    var preferredNameInputRef = (0,react.useRef)(null);
    var ref6 = (0,react.useState)(false), touchedPreferredNameInput = ref6[0], setTouchedPreferredNameInput = ref6[1];
    var ref1 = (0,react.useState)(false), touchedShortnameInput = ref1[0], setTouchedShortnameInput = ref1[1];
    var ref2 = (0,react.useState)(false), completingSignup = ref2[0], setCompletingSignup = ref2[1];
    var ref3 = (0,react.useState)(), completeSignupError = ref3[0], setCompleteSignupError = ref3[1];
    var ref4 = useShortnameTextField({
        touched: touchedShortnameInput
    }), shortname = ref4.shortname, setShortname = ref4.setShortname, isShortnameValid = ref4.isShortnameValid, shortnameHelperText = ref4.shortnameHelperText;
    var ref5 = (0,react.useState)(""), preferredName = ref5[0], setPreferredName = ref5[1];
    var isPreferredNameEmpty = !preferredName;
    var isPreferredNameValid = !isPreferredNameEmpty;
    var preferredNameHelperText = isPreferredNameEmpty ? "You must choose a preferred name" : undefined;
    var handleSubmit = function() {
        var _ref = CompleteSignupScreen_asyncToGenerator(runtime_default().mark(function _callee(event) {
            var ref, data, error;
            return runtime_default().wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        event.preventDefault();
                        if (!(isShortnameValid && isPreferredNameValid)) {
                            _ctx.next = 10;
                            break;
                        }
                        setCompletingSignup(true);
                        _ctx.next = 5;
                        return apiClient/* apiClient.post */.x.post("completeSignup", {
                            shortname: shortname,
                            preferredName: preferredName
                        });
                    case 5:
                        ref = _ctx.sent;
                        data = ref.data;
                        error = ref.error;
                        setCompletingSignup(false);
                        if (error) {
                            setCompleteSignupError(error.message);
                        } else if (data) {
                            setUser(data.user);
                        }
                    case 10:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }));
        return function handleSubmit(event) {
            return _ref.apply(this, arguments);
        };
    }();
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Icon/* default */.Z, {
                className: "fa-solid fa-badge-check",
                sx: {
                    fontSize: 50,
                    color: function(param) {
                        var palette = param.palette;
                        return palette.purple[600];
                    },
                    marginBottom: 3
                }
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Typography/* default */.Z, {
                variant: "bpBodyCopy",
                textAlign: "center",
                marginBottom: 1,
                sx: {
                    maxWidth: {
                        xs: "unset",
                        sm: "70%"
                    }
                },
                children: [
                    "Thanks for confirming your email ",
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                        children: email
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                variant: "bpHeading3",
                textAlign: "center",
                marginBottom: 2,
                sx: {
                    color: function(param) {
                        var palette = param.palette;
                        return palette.gray[80];
                    },
                    fontWeight: 500
                },
                children: "Add your account details"
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                width: "100%",
                component: "form",
                onSubmit: handleSubmit,
                marginBottom: 3,
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(TextField/* TextField */.n, {
                        sx: {
                            marginBottom: 2
                        },
                        fullWidth: true,
                        label: "Username",
                        placeholder: "claudeshannon",
                        variant: "outlined",
                        error: touchedShortnameInput && !isShortnameValid && !!shortnameHelperText,
                        value: shortname,
                        helperText: touchedShortnameInput ? shortnameHelperText : undefined,
                        onBlur: function() {
                            return setTouchedShortnameInput(true);
                        },
                        onChange: function(param) {
                            var target = param.target;
                            setShortname(target.value);
                        },
                        inputRef: shortnameInputRef
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(TextField/* TextField */.n, {
                        sx: {
                            marginBottom: 2
                        },
                        fullWidth: true,
                        label: "First or preferred name",
                        placeholder: "Claude",
                        variant: "outlined",
                        error: touchedPreferredNameInput && !isPreferredNameValid && !!preferredNameHelperText,
                        value: preferredName,
                        helperText: preferredNameHelperText,
                        onBlur: function() {
                            return setTouchedPreferredNameInput(true);
                        },
                        onChange: function(param) {
                            var target = param.target;
                            setPreferredName(target.value.trim());
                        },
                        inputRef: preferredNameInputRef
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* Button */.z, {
                        fullWidth: true,
                        squared: true,
                        disabled: !isShortnameValid,
                        loading: completingSignup,
                        type: "submit",
                        children: "Continue"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Collapse/* default */.Z, {
                        in: !!completeSignupError,
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(FormHelperText/* default */.Z, {
                            error: true,
                            sx: {
                                marginTop: 1,
                                fontSize: 15
                            },
                            children: completeSignupError
                        })
                    })
                ]
            })
        ]
    }));
};

;// CONCATENATED MODULE: ./src/pages/signup.page.tsx
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










var SIGNUP_PAGE_SCREENS = [
    "Email",
    "VerificationCode",
    "CompleteSignup", 
];
var toStringElseUndefined = function(item) {
    return typeof item === "string" ? item : undefined;
};
var SignupPage = function() {
    var router = (0,next_router.useRouter)();
    var parsedQuery = (0,react.useMemo)(function() {
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
    var ref = (0,UserContext/* useUser */.a)(), user = ref.user, setUser = ref.setUser;
    var ref1 = (0,react.useState)("Email"), currentScreen = ref1[0], setCurrentScreen = ref1[1];
    var ref2 = (0,react.useState)(), email = ref2[0], setEmail = ref2[1];
    var ref3 = (0,react.useState)(), redirectPath = ref3[0], setRedirectPath = ref3[1];
    var ref4 = (0,react.useState)(), initialVerificationCode = ref4[0], setInitialVerificationCode = ref4[1];
    var ref5 = (0,react.useState)(), verificationCodeInfo = ref5[0], setVerificationCodeInfo = ref5[1];
    (0,react.useEffect)(function() {
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
    (0,react.useEffect)(function() {
        if (user && user !== "loading") {
            if (user.isSignedUp) {
                void router.push(redirectPath !== null && redirectPath !== void 0 ? redirectPath : "/");
            } else if (currentScreen !== "CompleteSignup") {
                setEmail(user.email);
                setCurrentScreen("CompleteSignup");
            }
        }
    }, [
        user,
        router,
        currentScreen,
        redirectPath
    ]);
    var displayInfoSidebar = currentScreen === "Email" || currentScreen === "VerificationCode";
    var handleSignup = function(params) {
        setVerificationCodeInfo(params.verificationCodeInfo);
        setEmail(params.email);
        setCurrentScreen("VerificationCode");
    };
    var handleVerificationCodeSubmitted = function(loggedInUser) {
        setUser(loggedInUser);
    };
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        sx: {
            flexGrow: 1,
            background: "radial-gradient(141.84% 147.92% at 50% 122.49%, #FFB172 0%, #9482FF 32.87%, #84E6FF 100%)"
        },
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Container/* default */.Z, {
            sx: {
                py: 8,
                display: "flex",
                alignItems: {
                    xs: "center",
                    md: "stretch"
                },
                justifyContent: "center",
                flexDirection: {
                    xs: "column",
                    md: "row"
                }
            },
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsxs)(Paper/* default */.Z, {
                    sx: {
                        flexShrink: 0,
                        width: "100%",
                        borderTopLeftRadius: "6px",
                        borderBottomLeftRadius: {
                            xs: "".concat(displayInfoSidebar ? 0 : 6, "px"),
                            md: "6px"
                        },
                        borderTopRightRadius: {
                            xs: "6px",
                            md: "".concat(displayInfoSidebar ? 0 : 6, "px")
                        },
                        borderBottomRightRadius: "".concat(displayInfoSidebar ? 0 : 6, "px"),
                        padding: 2.5,
                        maxWidth: 500
                    },
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                            marginTop: "-3px",
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Fade/* default */.Z, {
                                in: currentScreen === "VerificationCode",
                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* Button */.z, {
                                        onClick: function() {
                                            return setCurrentScreen("Email");
                                        },
                                        disabled: currentScreen === SIGNUP_PAGE_SCREENS[0],
                                        variant: "transparent",
                                        startIcon: /*#__PURE__*/ (0,jsx_runtime.jsx)(Icon/* default */.Z, {
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
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
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
                                currentScreen === "Email" ? /*#__PURE__*/ (0,jsx_runtime.jsx)(SignupScreen, {
                                    initialEmail: email,
                                    onSignup: handleSignup
                                }) : null,
                                currentScreen === "VerificationCode" && verificationCodeInfo && email ? /*#__PURE__*/ (0,jsx_runtime.jsx)(VerificationCodeScreen/* VerificationCodeScreen */.u, {
                                    verificationCodeInfo: verificationCodeInfo,
                                    email: email,
                                    setVerificationCodeId: function(verificationCodeId) {
                                        setVerificationCodeInfo(_objectSpread({}, verificationCodeInfo, {
                                            verificationCodeId: verificationCodeId
                                        }));
                                    },
                                    initialVerificationCode: initialVerificationCode,
                                    onSubmit: handleVerificationCodeSubmitted,
                                    onChangeEmail: function() {
                                        return setCurrentScreen("Email");
                                    },
                                    submit: apiClient/* apiClient.verifyEmail */.x.verifyEmail,
                                    resend: apiClient/* apiClient.signup */.x.signup
                                }) : null,
                                currentScreen === "CompleteSignup" && email ? /*#__PURE__*/ (0,jsx_runtime.jsx)(CompleteSignupScreen, {
                                    email: email
                                }) : null
                            ]
                        })
                    ]
                }),
                displayInfoSidebar ? /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    sx: {
                        maxWidth: {
                            xs: 500,
                            md: 400
                        },
                        width: "100%",
                        borderTopRightRadius: {
                            xs: "0px",
                            md: "6px"
                        },
                        borderBottomRightRadius: "6px",
                        borderBottomLeftRadius: {
                            xs: "6px",
                            md: "0px"
                        },
                        padding: {
                            xs: 2.5,
                            md: 4
                        },
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.91) 33.6%, rgba(250, 251, 252, 0.38) 113.46%)"
                    },
                    children: [
                        {
                            icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(Icon/* default */.Z, {
                                sx: {
                                    fontSize: 16,
                                    color: function(param) {
                                        var palette = param.palette;
                                        return palette.purple[700];
                                    }
                                },
                                className: "fa-solid fa-up"
                            }),
                            heading: /*#__PURE__*/ (0,jsx_runtime.jsx)(jsx_runtime.Fragment, {
                                children: "Publish blocks to the block hub"
                            }),
                            subHeading: /*#__PURE__*/ (0,jsx_runtime.jsx)(jsx_runtime.Fragment, {
                                children: "Help make open source blocks and structured data avaliable to everyone on the web"
                            })
                        },
                        {
                            icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(Icon/* default */.Z, {
                                sx: {
                                    fontSize: 16,
                                    color: function(param) {
                                        var palette = param.palette;
                                        return palette.purple[700];
                                    }
                                },
                                className: "fa-solid fa-code-pull-request"
                            }),
                            heading: /*#__PURE__*/ (0,jsx_runtime.jsx)(jsx_runtime.Fragment, {
                                children: "Take part in a growing, open source community"
                            }),
                            subHeading: /*#__PURE__*/ (0,jsx_runtime.jsx)(jsx_runtime.Fragment, {
                                children: "Create open source, reusable blocks connected to rich data structures"
                            })
                        },
                        {
                            icon: /*#__PURE__*/ (0,jsx_runtime.jsx)(Icon/* default */.Z, {
                                sx: {
                                    fontSize: 16,
                                    color: function(param) {
                                        var palette = param.palette;
                                        return palette.purple[700];
                                    }
                                },
                                className: "fa-solid fa-user"
                            }),
                            heading: /*#__PURE__*/ (0,jsx_runtime.jsx)(jsx_runtime.Fragment, {
                                children: "Claim your favorite username"
                            }),
                            subHeading: /*#__PURE__*/ (0,jsx_runtime.jsx)(jsx_runtime.Fragment, {
                                children: "@pizza goes fast"
                            })
                        }, 
                    ].map(function(param1, i) {
                        var icon = param1.icon, heading = param1.heading, subHeading = param1.subHeading;
                        // eslint-disable-next-line react/no-array-index-key
                        /*#__PURE__*/ return (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                            mb: 3,
                            display: "flex",
                            alignItems: "flex-start",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                                    width: 40,
                                    flexShrink: 0,
                                    children: icon
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)(Box/* default */.Z, {
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                            variant: "bpBodyCopy",
                                            mb: 1,
                                            sx: {
                                                color: function(param) {
                                                    var palette = param.palette;
                                                    return palette.gray[80];
                                                },
                                                fontWeight: 600,
                                                lineHeight: "1.25em"
                                            },
                                            children: heading
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                            component: "p",
                                            variant: "bpSmallCopy",
                                            sx: {
                                                color: function(param) {
                                                    var palette = param.palette;
                                                    return palette.gray[60];
                                                },
                                                fontWeight: 400,
                                                lineHeight: "1.5em"
                                            },
                                            children: subHeading
                                        })
                                    ]
                                })
                            ]
                        }, i);
                    })
                }) : null
            ]
        })
    }));
};
/* harmony default export */ var signup_page = (SignupPage);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774,888,179], function() { return __webpack_exec__(9917); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);