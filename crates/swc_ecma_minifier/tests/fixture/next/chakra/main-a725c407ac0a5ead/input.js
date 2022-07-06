(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [179],
    {
        /***/ 5300: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = _arrayLikeToArray;
            function _arrayLikeToArray(arr, len) {
                if (len == null || len > arr.length) len = arr.length;
                for (var i = 0, arr2 = new Array(len); i < len; i++)
                    arr2[i] = arr[i];
                return arr2;
            }

            /***/
        },

        /***/ 6564: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = _arrayWithHoles;
            function _arrayWithHoles(arr) {
                if (Array.isArray(arr)) return arr;
            }

            /***/
        },

        /***/ 2568: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = _arrayWithoutHoles;
            var _arrayLikeToArrayMjs = _interopRequireDefault(
                __webpack_require__(5300)
            );
            function _arrayWithoutHoles(arr) {
                if (Array.isArray(arr))
                    return (0, _arrayLikeToArrayMjs).default(arr);
            }
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            /***/
        },

        /***/ 8646: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = _assertThisInitialized;
            function _assertThisInitialized(self) {
                if (self === void 0) {
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                }
                return self;
            }

            /***/
        },

        /***/ 932: /***/ function (__unused_webpack_module, exports) {
            "use strict";
            var __webpack_unused_export__;

            __webpack_unused_export__ = {
                value: true,
            };
            exports.Z = _asyncToGenerator;
            function _asyncToGenerator(fn) {
                return function () {
                    var self = this,
                        args = arguments;
                    return new Promise(function (resolve, reject) {
                        var gen = fn.apply(self, args);
                        function _next(value) {
                            asyncGeneratorStep(
                                gen,
                                resolve,
                                reject,
                                _next,
                                _throw,
                                "next",
                                value
                            );
                        }
                        function _throw(err) {
                            asyncGeneratorStep(
                                gen,
                                resolve,
                                reject,
                                _next,
                                _throw,
                                "throw",
                                err
                            );
                        }
                        _next(undefined);
                    });
                };
            }
            function asyncGeneratorStep(
                gen,
                resolve,
                reject,
                _next,
                _throw,
                key,
                arg
            ) {
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

            /***/
        },

        /***/ 9658: /***/ function (__unused_webpack_module, exports) {
            "use strict";
            var __webpack_unused_export__;

            __webpack_unused_export__ = {
                value: true,
            };
            exports.Z = _classCallCheck;
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            /***/
        },

        /***/ 5317: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = _construct;
            var _setPrototypeOfMjs = _interopRequireDefault(
                __webpack_require__(5814)
            );
            function _construct(Parent, args, Class) {
                return construct.apply(null, arguments);
            }
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            function isNativeReflectConstruct() {
                if (typeof Reflect === "undefined" || !Reflect.construct)
                    return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Date.prototype.toString.call(
                        Reflect.construct(Date, [], function () {})
                    );
                    return true;
                } catch (e) {
                    return false;
                }
            }
            function construct(Parent1, args1, Class1) {
                if (isNativeReflectConstruct()) {
                    construct = Reflect.construct;
                } else {
                    construct = function construct(Parent, args, Class) {
                        var a = [null];
                        a.push.apply(a, args);
                        var Constructor = Function.bind.apply(Parent, a);
                        var instance = new Constructor();
                        if (Class)
                            (0, _setPrototypeOfMjs).default(
                                instance,
                                Class.prototype
                            );
                        return instance;
                    };
                }
                return construct.apply(null, arguments);
            }

            /***/
        },

        /***/ 7222: /***/ function (__unused_webpack_module, exports) {
            "use strict";
            var __webpack_unused_export__;

            __webpack_unused_export__ = {
                value: true,
            };
            exports.Z = _createClass;
            function _createClass(Constructor, protoProps, staticProps) {
                if (protoProps)
                    _defineProperties(Constructor.prototype, protoProps);
                if (staticProps) _defineProperties(Constructor, staticProps);
                return Constructor;
            }
            function _defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            /***/
        },

        /***/ 7735: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";
            var __webpack_unused_export__;

            __webpack_unused_export__ = {
                value: true,
            };
            exports.Z = _createSuper;
            var _isNativeReflectConstructMjs = _interopRequireDefault(
                __webpack_require__(9158)
            );
            var _getPrototypeOfMjs = _interopRequireDefault(
                __webpack_require__(898)
            );
            var _possibleConstructorReturnMjs = _interopRequireDefault(
                __webpack_require__(9241)
            );
            function _createSuper(Derived) {
                var hasNativeReflectConstruct = (0,
                _isNativeReflectConstructMjs).default();
                return function _createSuperInternal() {
                    var Super = (0, _getPrototypeOfMjs).default(Derived),
                        result;
                    if (hasNativeReflectConstruct) {
                        var NewTarget = (0, _getPrototypeOfMjs).default(
                            this
                        ).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else {
                        result = Super.apply(this, arguments);
                    }
                    return (0, _possibleConstructorReturnMjs).default(
                        this,
                        result
                    );
                };
            }
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            /***/
        },

        /***/ 9361: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = _defineProperty;
            function _defineProperty(obj, key, value) {
                if (key in obj) {
                    Object.defineProperty(obj, key, {
                        value: value,
                        enumerable: true,
                        configurable: true,
                        writable: true,
                    });
                } else {
                    obj[key] = value;
                }
                return obj;
            }

            /***/
        },

        /***/ 898: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = _getPrototypeOf;
            function _getPrototypeOf(o) {
                return getPrototypeOf(o);
            }
            function getPrototypeOf(o1) {
                getPrototypeOf = Object.setPrototypeOf
                    ? Object.getPrototypeOf
                    : function getPrototypeOf(o) {
                          return o.__proto__ || Object.getPrototypeOf(o);
                      };
                return getPrototypeOf(o1);
            }

            /***/
        },

        /***/ 7788: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";
            var __webpack_unused_export__;

            __webpack_unused_export__ = {
                value: true,
            };
            exports.Z = _inherits;
            var _setPrototypeOfMjs = _interopRequireDefault(
                __webpack_require__(5814)
            );
            function _inherits(subClass, superClass) {
                if (typeof superClass !== "function" && superClass !== null) {
                    throw new TypeError(
                        "Super expression must either be null or a function"
                    );
                }
                subClass.prototype = Object.create(
                    superClass && superClass.prototype,
                    {
                        constructor: {
                            value: subClass,
                            writable: true,
                            configurable: true,
                        },
                    }
                );
                if (superClass)
                    (0, _setPrototypeOfMjs).default(subClass, superClass);
            }
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            /***/
        },

        /***/ 6856: /***/ function (__unused_webpack_module, exports) {
            "use strict";
            var __webpack_unused_export__;

            __webpack_unused_export__ = {
                value: true,
            };
            exports.Z = _instanceof;
            function _instanceof(left, right) {
                if (
                    right != null &&
                    typeof Symbol !== "undefined" &&
                    right[Symbol.hasInstance]
                ) {
                    return !!right[Symbol.hasInstance](left);
                } else {
                    return left instanceof right;
                }
            }

            /***/
        },

        /***/ 2648: /***/ function (__unused_webpack_module, exports) {
            "use strict";
            var __webpack_unused_export__;

            __webpack_unused_export__ = {
                value: true,
            };
            exports.Z = _interopRequireDefault;
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            /***/
        },

        /***/ 1598: /***/ function (__unused_webpack_module, exports) {
            "use strict";
            var __webpack_unused_export__;

            __webpack_unused_export__ = {
                value: true,
            };
            exports.Z = _interopRequireWildcard;
            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                }
                if (
                    obj === null ||
                    (typeof obj !== "object" && typeof obj !== "function")
                ) {
                    return {
                        default: obj,
                    };
                }
                var cache = _getRequireWildcardCache();
                if (cache && cache.has(obj)) {
                    return cache.get(obj);
                }
                var newObj = {};
                var hasPropertyDescriptor =
                    Object.defineProperty && Object.getOwnPropertyDescriptor;
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        var desc = hasPropertyDescriptor
                            ? Object.getOwnPropertyDescriptor(obj, key)
                            : null;
                        if (desc && (desc.get || desc.set)) {
                            Object.defineProperty(newObj, key, desc);
                        } else {
                            newObj[key] = obj[key];
                        }
                    }
                }
                newObj.default = obj;
                if (cache) {
                    cache.set(obj, newObj);
                }
                return newObj;
            }
            function _getRequireWildcardCache() {
                if (typeof WeakMap !== "function") return null;
                var cache = new WeakMap();
                _getRequireWildcardCache = function () {
                    return cache;
                };
                return cache;
            }

            /***/
        },

        /***/ 4499: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = _isNativeFunction;
            function _isNativeFunction(fn) {
                return (
                    Function.toString.call(fn).indexOf("[native code]") !== -1
                );
            }

            /***/
        },

        /***/ 9158: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = _isNativeReflectConstruct;
            function _isNativeReflectConstruct() {
                if (typeof Reflect === "undefined" || !Reflect.construct)
                    return false;
                if (Reflect.construct.sham) return false;
                if (typeof Proxy === "function") return true;
                try {
                    Boolean.prototype.valueOf.call(
                        Reflect.construct(Boolean, [], function () {})
                    );
                    return true;
                } catch (e) {
                    return false;
                }
            }

            /***/
        },

        /***/ 1301: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = _iterableToArray;
            function _iterableToArray(iter) {
                if (
                    (typeof Symbol !== "undefined" &&
                        iter[Symbol.iterator] != null) ||
                    iter["@@iterator"] != null
                )
                    return Array.from(iter);
            }

            /***/
        },

        /***/ 6936: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = _nonIterableRest;
            function _nonIterableRest() {
                throw new TypeError(
                    "Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                );
            }

            /***/
        },

        /***/ 4162: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = _nonIterableSpread;
            function _nonIterableSpread() {
                throw new TypeError(
                    "Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                );
            }

            /***/
        },

        /***/ 337: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";
            var __webpack_unused_export__;

            __webpack_unused_export__ = {
                value: true,
            };
            exports.Z = _objectSpread;
            var _definePropertyMjs = _interopRequireDefault(
                __webpack_require__(9361)
            );
            function _objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    var ownKeys = Object.keys(source);
                    if (typeof Object.getOwnPropertySymbols === "function") {
                        ownKeys = ownKeys.concat(
                            Object.getOwnPropertySymbols(source).filter(
                                function (sym) {
                                    return Object.getOwnPropertyDescriptor(
                                        source,
                                        sym
                                    ).enumerable;
                                }
                            )
                        );
                    }
                    ownKeys.forEach(function (key) {
                        (0, _definePropertyMjs).default(
                            target,
                            key,
                            source[key]
                        );
                    });
                }
                return target;
            }
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            /***/
        },

        /***/ 9961: /***/ function (__unused_webpack_module, exports) {
            "use strict";
            var __webpack_unused_export__;

            __webpack_unused_export__ = {
                value: true,
            };
            exports.Z = _objectSpreadProps;
            function _objectSpreadProps(target, source) {
                source = source != null ? source : {};
                if (Object.getOwnPropertyDescriptors) {
                    Object.defineProperties(
                        target,
                        Object.getOwnPropertyDescriptors(source)
                    );
                } else {
                    ownKeys(Object(source)).forEach(function (key) {
                        Object.defineProperty(
                            target,
                            key,
                            Object.getOwnPropertyDescriptor(source, key)
                        );
                    });
                }
                return target;
            }
            function ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly) {
                        symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(
                                object,
                                sym
                            ).enumerable;
                        });
                    }
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            /***/
        },

        /***/ 9241: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = _possibleConstructorReturn;
            var _assertThisInitializedMjs = _interopRequireDefault(
                __webpack_require__(8646)
            );
            var _typeOfMjs = _interopRequireDefault(__webpack_require__(5753));
            function _possibleConstructorReturn(self, call) {
                if (
                    call &&
                    ((0, _typeOfMjs).default(call) === "object" ||
                        typeof call === "function")
                ) {
                    return call;
                }
                return (0, _assertThisInitializedMjs).default(self);
            }
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            /***/
        },

        /***/ 5814: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = _setPrototypeOf;
            function _setPrototypeOf(o, p) {
                return setPrototypeOf(o, p);
            }
            function setPrototypeOf(o1, p1) {
                setPrototypeOf =
                    Object.setPrototypeOf ||
                    function setPrototypeOf(o, p) {
                        o.__proto__ = p;
                        return o;
                    };
                return setPrototypeOf(o1, p1);
            }

            /***/
        },

        /***/ 4941: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";
            var __webpack_unused_export__;

            __webpack_unused_export__ = {
                value: true,
            };
            exports.Z = _slicedToArray;
            var _arrayWithHolesMjs = _interopRequireDefault(
                __webpack_require__(6564)
            );
            var _iterableToArrayMjs = _interopRequireDefault(
                __webpack_require__(1301)
            );
            var _nonIterableRestMjs = _interopRequireDefault(
                __webpack_require__(6936)
            );
            var _unsupportedIterableToArrayMjs = _interopRequireDefault(
                __webpack_require__(2149)
            );
            function _slicedToArray(arr, i) {
                return (
                    (0, _arrayWithHolesMjs).default(arr) ||
                    (0, _iterableToArrayMjs).default(arr, i) ||
                    (0, _unsupportedIterableToArrayMjs).default(arr, i) ||
                    (0, _nonIterableRestMjs).default()
                );
            }
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            /***/
        },

        /***/ 3929: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";
            var __webpack_unused_export__;

            __webpack_unused_export__ = {
                value: true,
            };
            exports.Z = _toConsumableArray;
            var _arrayWithoutHolesMjs = _interopRequireDefault(
                __webpack_require__(2568)
            );
            var _iterableToArrayMjs = _interopRequireDefault(
                __webpack_require__(1301)
            );
            var _nonIterableSpreadMjs = _interopRequireDefault(
                __webpack_require__(4162)
            );
            var _unsupportedIterableToArrayMjs = _interopRequireDefault(
                __webpack_require__(2149)
            );
            function _toConsumableArray(arr) {
                return (
                    (0, _arrayWithoutHolesMjs).default(arr) ||
                    (0, _iterableToArrayMjs).default(arr) ||
                    (0, _unsupportedIterableToArrayMjs).default(arr) ||
                    (0, _nonIterableSpreadMjs).default()
                );
            }
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            /***/
        },

        /***/ 5753: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = _typeof;
            function _typeof(obj) {
                "@swc/helpers - typeof";
                return obj && obj.constructor === Symbol
                    ? "symbol"
                    : typeof obj;
            }

            /***/
        },

        /***/ 2149: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = _unsupportedIterableToArray;
            var _arrayLikeToArrayMjs = _interopRequireDefault(
                __webpack_require__(5300)
            );
            function _unsupportedIterableToArray(o, minLen) {
                if (!o) return;
                if (typeof o === "string")
                    return (0, _arrayLikeToArrayMjs).default(o, minLen);
                var n = Object.prototype.toString.call(o).slice(8, -1);
                if (n === "Object" && o.constructor) n = o.constructor.name;
                if (n === "Map" || n === "Set") return Array.from(n);
                if (
                    n === "Arguments" ||
                    /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                )
                    return (0, _arrayLikeToArrayMjs).default(o, minLen);
            }
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            /***/
        },

        /***/ 9968: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";
            var __webpack_unused_export__;

            __webpack_unused_export__ = {
                value: true,
            };
            exports.Z = _wrapNativeSuper;
            var _constructMjs = _interopRequireDefault(
                __webpack_require__(5317)
            );
            var _isNativeFunctionMjs = _interopRequireDefault(
                __webpack_require__(4499)
            );
            var _getPrototypeOfMjs = _interopRequireDefault(
                __webpack_require__(898)
            );
            var _setPrototypeOfMjs = _interopRequireDefault(
                __webpack_require__(5814)
            );
            function _wrapNativeSuper(Class) {
                return wrapNativeSuper(Class);
            }
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            function wrapNativeSuper(Class1) {
                var _cache = typeof Map === "function" ? new Map() : undefined;
                wrapNativeSuper = function wrapNativeSuper(Class) {
                    if (
                        Class === null ||
                        !(0, _isNativeFunctionMjs).default(Class)
                    )
                        return Class;
                    if (typeof Class !== "function") {
                        throw new TypeError(
                            "Super expression must either be null or a function"
                        );
                    }
                    if (typeof _cache !== "undefined") {
                        if (_cache.has(Class)) return _cache.get(Class);
                        _cache.set(Class, Wrapper);
                    }
                    function Wrapper() {
                        return (0, _constructMjs).default(
                            Class,
                            arguments,
                            (0, _getPrototypeOfMjs).default(this).constructor
                        );
                    }
                    Wrapper.prototype = Object.create(Class.prototype, {
                        constructor: {
                            value: Wrapper,
                            enumerable: false,
                            writable: true,
                            configurable: true,
                        },
                    });
                    return (0, _setPrototypeOfMjs).default(Wrapper, Class);
                };
                return wrapNativeSuper(Class1);
            }

            /***/
        },

        /***/ 37: /***/ function () {
            "trimStart" in String.prototype ||
                (String.prototype.trimStart = String.prototype.trimLeft),
                "trimEnd" in String.prototype ||
                    (String.prototype.trimEnd = String.prototype.trimRight),
                "description" in Symbol.prototype ||
                    Object.defineProperty(Symbol.prototype, "description", {
                        configurable: !0,
                        get: function () {
                            var t = /\((.*)\)/.exec(this.toString());
                            return t ? t[1] : void 0;
                        },
                    }),
                Array.prototype.flat ||
                    ((Array.prototype.flat = function (t, r) {
                        return (
                            (r = this.concat.apply([], this)),
                            t > 1 && r.some(Array.isArray) ? r.flat(t - 1) : r
                        );
                    }),
                    (Array.prototype.flatMap = function (t, r) {
                        return this.map(t, r).flat();
                    })),
                Promise.prototype.finally ||
                    (Promise.prototype.finally = function (t) {
                        if ("function" != typeof t) return this.then(t, t);
                        var r = this.constructor || Promise;
                        return this.then(
                            function (o) {
                                return r.resolve(t()).then(function () {
                                    return o;
                                });
                            },
                            function (o) {
                                return r.resolve(t()).then(function () {
                                    throw o;
                                });
                            }
                        );
                    });

            /***/
        },

        /***/ 8684: /***/ function (module, exports, __webpack_require__) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.addBasePath = addBasePath;
            var _addPathPrefix = __webpack_require__(5391);
            var _normalizeTrailingSlash = __webpack_require__(2392);
            var basePath = false || "";
            function addBasePath(path, required) {
                if (false) {
                }
                return (0, _normalizeTrailingSlash).normalizePathTrailingSlash(
                    (0, _addPathPrefix).addPathPrefix(path, basePath)
                );
            }
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=add-base-path.js.map

            /***/
        },

        /***/ 2725: /***/ function (module, exports, __webpack_require__) {
            "use strict";

            var _to_consumable_array =
                __webpack_require__(3929) /* ["default"] */.Z;
            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.addLocale = void 0;
            var _normalizeTrailingSlash = __webpack_require__(2392);
            var addLocale = function (path) {
                for (
                    var _len = arguments.length,
                        args = new Array(_len > 1 ? _len - 1 : 0),
                        _key = 1;
                    _key < _len;
                    _key++
                ) {
                    args[_key - 1] = arguments[_key];
                }
                if (false) {
                    var _instance;
                }
                return path;
            };
            exports.addLocale = addLocale;
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=add-locale.js.map

            /***/
        },

        /***/ 8748: /***/ function (module, exports, __webpack_require__) {
            "use strict";

            var _to_consumable_array =
                __webpack_require__(3929) /* ["default"] */.Z;
            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.detectDomainLocale = void 0;
            var detectDomainLocale = function () {
                for (
                    var _len = arguments.length,
                        args = new Array(_len),
                        _key = 0;
                    _key < _len;
                    _key++
                ) {
                    args[_key] = arguments[_key];
                }
                if (false) {
                    var _instance;
                }
            };
            exports.detectDomainLocale = detectDomainLocale;
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=detect-domain-locale.js.map

            /***/
        },

        /***/ 4119: /***/ function (module, exports, __webpack_require__) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.hasBasePath = hasBasePath;
            var _pathHasPrefix = __webpack_require__(1259);
            var basePath = false || "";
            function hasBasePath(path) {
                return (0, _pathHasPrefix).pathHasPrefix(path, basePath);
            }
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=has-base-path.js.map

            /***/
        },

        /***/ 6007: /***/ function (module, exports, __webpack_require__) {
            "use strict";

            var _instanceof = __webpack_require__(6856) /* ["default"] */.Z;
            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = initHeadManager;
            exports.isEqualNode = isEqualNode;
            exports.DOMAttributeNames = void 0;
            function initHeadManager() {
                return {
                    mountedInstances: new Set(),
                    updateHead: function (head) {
                        var tags = {};
                        head.forEach(function (h) {
                            if (
                                // it won't be inlined. In this case revert to the original behavior
                                h.type === "link" &&
                                h.props["data-optimized-fonts"]
                            ) {
                                if (
                                    document.querySelector(
                                        'style[data-href="'.concat(
                                            h.props["data-href"],
                                            '"]'
                                        )
                                    )
                                ) {
                                    return;
                                } else {
                                    h.props.href = h.props["data-href"];
                                    h.props["data-href"] = undefined;
                                }
                            }
                            var components = tags[h.type] || [];
                            components.push(h);
                            tags[h.type] = components;
                        });
                        var titleComponent = tags.title ? tags.title[0] : null;
                        var title = "";
                        if (titleComponent) {
                            var children = titleComponent.props.children;
                            title =
                                typeof children === "string"
                                    ? children
                                    : Array.isArray(children)
                                    ? children.join("")
                                    : "";
                        }
                        if (title !== document.title) document.title = title;
                        ["meta", "base", "link", "style", "script"].forEach(
                            function (type) {
                                updateElements(type, tags[type] || []);
                            }
                        );
                    },
                };
            }
            var DOMAttributeNames = {
                acceptCharset: "accept-charset",
                className: "class",
                htmlFor: "for",
                httpEquiv: "http-equiv",
                noModule: "noModule",
            };
            exports.DOMAttributeNames = DOMAttributeNames;
            function reactElementToDOM(param) {
                var type = param.type,
                    props = param.props;
                var el = document.createElement(type);
                for (var p in props) {
                    if (!props.hasOwnProperty(p)) continue;
                    if (p === "children" || p === "dangerouslySetInnerHTML")
                        continue;
                    // we don't render undefined props to the DOM
                    if (props[p] === undefined) continue;
                    var attr = DOMAttributeNames[p] || p.toLowerCase();
                    if (
                        type === "script" &&
                        (attr === "async" ||
                            attr === "defer" ||
                            attr === "noModule")
                    ) {
                        el[attr] = !!props[p];
                    } else {
                        el.setAttribute(attr, props[p]);
                    }
                }
                var children = props.children,
                    dangerouslySetInnerHTML = props.dangerouslySetInnerHTML;
                if (dangerouslySetInnerHTML) {
                    el.innerHTML = dangerouslySetInnerHTML.__html || "";
                } else if (children) {
                    el.textContent =
                        typeof children === "string"
                            ? children
                            : Array.isArray(children)
                            ? children.join("")
                            : "";
                }
                return el;
            }
            function isEqualNode(oldTag, newTag) {
                if (
                    _instanceof(oldTag, HTMLElement) &&
                    _instanceof(newTag, HTMLElement)
                ) {
                    var nonce = newTag.getAttribute("nonce");
                    // Only strip the nonce if `oldTag` has had it stripped. An element's nonce attribute will not
                    // be stripped if there is no content security policy response header that includes a nonce.
                    if (nonce && !oldTag.getAttribute("nonce")) {
                        var cloneTag = newTag.cloneNode(true);
                        cloneTag.setAttribute("nonce", "");
                        cloneTag.nonce = nonce;
                        return (
                            nonce === oldTag.nonce &&
                            oldTag.isEqualNode(cloneTag)
                        );
                    }
                }
                return oldTag.isEqualNode(newTag);
            }
            function updateElements(type, components) {
                var headEl = document.getElementsByTagName("head")[0];
                var headCountEl = headEl.querySelector(
                    "meta[name=next-head-count]"
                );
                if (false) {
                }
                var headCount = Number(headCountEl.content);
                var oldTags = [];
                for (
                    var i = 0, j = headCountEl.previousElementSibling;
                    i < headCount;
                    i++,
                        j =
                            (j == null ? void 0 : j.previousElementSibling) ||
                            null
                ) {
                    var ref;
                    if (
                        (j == null
                            ? void 0
                            : (ref = j.tagName) == null
                            ? void 0
                            : ref.toLowerCase()) === type
                    ) {
                        oldTags.push(j);
                    }
                }
                var newTags = components
                    .map(reactElementToDOM)
                    .filter(function (newTag) {
                        for (var k = 0, len = oldTags.length; k < len; k++) {
                            var oldTag = oldTags[k];
                            if (isEqualNode(oldTag, newTag)) {
                                oldTags.splice(k, 1);
                                return false;
                            }
                        }
                        return true;
                    });
                oldTags.forEach(function (t) {
                    var ref;
                    return (ref = t.parentNode) == null
                        ? void 0
                        : ref.removeChild(t);
                });
                newTags.forEach(function (t) {
                    return headEl.insertBefore(t, headCountEl);
                });
                headCountEl.content = (
                    headCount -
                    oldTags.length +
                    newTags.length
                ).toString();
            }
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=head-manager.js.map

            /***/
        },

        /***/ 7339: /***/ function (module, exports, __webpack_require__) {
            "use strict";

            var _class_call_check =
                __webpack_require__(9658) /* ["default"] */.Z;
            var _create_class = __webpack_require__(7222) /* ["default"] */.Z;
            var _inherits = __webpack_require__(7788) /* ["default"] */.Z;
            var _interop_require_default =
                __webpack_require__(2648) /* ["default"] */.Z;
            var _interop_require_wildcard =
                __webpack_require__(1598) /* ["default"] */.Z;
            var _sliced_to_array =
                __webpack_require__(4941) /* ["default"] */.Z;
            var _create_super = __webpack_require__(7735) /* ["default"] */.Z;
            var _runtimeJs = _interop_require_default(
                __webpack_require__(4051)
            );
            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.initialize = initialize;
            exports.hydrate = hydrate;
            exports.emitter = exports.router = exports.version = void 0;
            __webpack_require__(37);
            var _react = _interopRequireWildcard(__webpack_require__(7294));
            var _headManagerContext = __webpack_require__(8404);
            var _mitt = _interopRequireDefault(__webpack_require__(5660));
            var _routerContext = __webpack_require__(3462);
            var _isDynamic = __webpack_require__(8689);
            var _querystring = __webpack_require__(466);
            var _runtimeConfig = __webpack_require__(8027);
            var _utils = __webpack_require__(3794);
            var _portal = __webpack_require__(2207);
            var _headManager = _interopRequireDefault(
                __webpack_require__(6007)
            );
            var _pageLoader = _interopRequireDefault(__webpack_require__(5181));
            var _performanceRelayer = _interopRequireDefault(
                __webpack_require__(9302)
            );
            var _routeAnnouncer = __webpack_require__(8982);
            var _router = __webpack_require__(387);
            var _isError = __webpack_require__(676);
            var _imageConfigContext = __webpack_require__(9977);
            var _removeBasePath = __webpack_require__(9320);
            var _hasBasePath = __webpack_require__(4119);
            function asyncGeneratorStep(
                gen,
                resolve,
                reject,
                _next,
                _throw,
                key,
                arg
            ) {
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
                return function () {
                    var _$self = this,
                        args = arguments;
                    return new Promise(function (resolve, reject) {
                        var gen = fn.apply(_$self, args);
                        function _next(value) {
                            asyncGeneratorStep(
                                gen,
                                resolve,
                                reject,
                                _next,
                                _throw,
                                "next",
                                value
                            );
                        }
                        function _throw(err) {
                            asyncGeneratorStep(
                                gen,
                                resolve,
                                reject,
                                _next,
                                _throw,
                                "throw",
                                err
                            );
                        }
                        _next(undefined);
                    });
                };
            }
            function _extends() {
                _extends =
                    Object.assign ||
                    function (target) {
                        for (var i = 1; i < arguments.length; i++) {
                            var source = arguments[i];
                            for (var key in source) {
                                if (
                                    Object.prototype.hasOwnProperty.call(
                                        source,
                                        key
                                    )
                                ) {
                                    target[key] = source[key];
                                }
                            }
                        }
                        return target;
                    };
                return _extends.apply(this, arguments);
            }
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            function _getRequireWildcardCache() {
                if (typeof WeakMap !== "function") return null;
                var cache = new WeakMap();
                _getRequireWildcardCache = function _getRequireWildcardCache() {
                    return cache;
                };
                return cache;
            }
            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                }
                if (
                    obj === null ||
                    (typeof obj !== "object" && typeof obj !== "function")
                ) {
                    return {
                        default: obj,
                    };
                }
                var cache = _getRequireWildcardCache();
                if (cache && cache.has(obj)) {
                    return cache.get(obj);
                }
                var newObj = {};
                var hasPropertyDescriptor =
                    Object.defineProperty && Object.getOwnPropertyDescriptor;
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        var desc = hasPropertyDescriptor
                            ? Object.getOwnPropertyDescriptor(obj, key)
                            : null;
                        if (desc && (desc.get || desc.set)) {
                            Object.defineProperty(newObj, key, desc);
                        } else {
                            newObj[key] = obj[key];
                        }
                    }
                }
                newObj.default = obj;
                if (cache) {
                    cache.set(obj, newObj);
                }
                return newObj;
            }
            var ReactDOM = true ? __webpack_require__(745) : 0;
            var version = "12.2.0";
            exports.version = version;
            var router;
            exports.router = router;
            var emitter = (0, _mitt).default();
            exports.emitter = emitter;
            var looseToArray = function (input) {
                return [].slice.call(input);
            };
            var initialData;
            var defaultLocale = undefined;
            var asPath;
            var pageLoader;
            var appElement;
            var headManager;
            var initialMatchesMiddleware = false;
            var lastRenderReject;
            var webpackHMR;
            var CachedApp, onPerfEntry;
            var CachedComponent;
            self.__next_require__ = __webpack_require__;
            var Container = /*#__PURE__*/ (function (_Component) {
                _inherits(Container, _Component);
                var _super = _create_super(Container);
                function Container() {
                    _class_call_check(this, Container);
                    return _super.apply(this, arguments);
                }
                _create_class(Container, [
                    {
                        key: "componentDidCatch",
                        value: function componentDidCatch(componentErr, info) {
                            this.props.fn(componentErr, info);
                        },
                    },
                    {
                        key: "componentDidMount",
                        value: function componentDidMount() {
                            this.scrollToHash();
                            // We need to replace the router state if:
                            // - the page was (auto) exported and has a query string or search (hash)
                            // - it was auto exported and is a dynamic route (to provide params)
                            // - if it is a client-side skeleton (fallback render)
                            // - if middleware matches the current page (may have rewrite params)
                            // - if rewrites in next.config.js match (may have rewrite params)
                            if (
                                router.isSsr && // the asPath unexpectedly e.g. adding basePath when
                                // it wasn't originally present
                                initialData.page !== "/404" &&
                                initialData.page !== "/_error" &&
                                (initialData.isFallback ||
                                    (initialData.nextExport &&
                                        ((0, _isDynamic).isDynamicRoute(
                                            router.pathname
                                        ) ||
                                            location.search ||
                                            false ||
                                            initialMatchesMiddleware)) ||
                                    (initialData.props &&
                                        initialData.props.__N_SSG &&
                                        (location.search ||
                                            false ||
                                            initialMatchesMiddleware)))
                            ) {
                                // update query on mount for exported pages
                                router
                                    .replace(
                                        router.pathname +
                                            "?" +
                                            String(
                                                (0, _querystring).assign(
                                                    (0,
                                                    _querystring).urlQueryToSearchParams(
                                                        router.query
                                                    ),
                                                    new URLSearchParams(
                                                        location.search
                                                    )
                                                )
                                            ),
                                        asPath,
                                        {
                                            // @ts-ignore
                                            // WARNING: `_h` is an internal option for handing Next.js
                                            // client-side hydration. Your app should _never_ use this property.
                                            // It may change at any time without notice.
                                            _h: 1,
                                            // Fallback pages must trigger the data fetch, so the transition is
                                            // not shallow.
                                            // Other pages (strictly updating query) happens shallowly, as data
                                            // requirements would already be present.
                                            shallow:
                                                !initialData.isFallback &&
                                                !initialMatchesMiddleware,
                                        }
                                    )
                                    .catch(function (err) {
                                        if (!err.cancelled) throw err;
                                    });
                            }
                        },
                    },
                    {
                        key: "componentDidUpdate",
                        value: function componentDidUpdate() {
                            this.scrollToHash();
                        },
                    },
                    {
                        key: "scrollToHash",
                        value: function scrollToHash() {
                            var hash = location.hash;
                            hash = hash && hash.substring(1);
                            if (!hash) return;
                            var el = document.getElementById(hash);
                            if (!el) return;
                            // If we call scrollIntoView() in here without a setTimeout
                            // it won't scroll properly.
                            setTimeout(function () {
                                return el.scrollIntoView();
                            }, 0);
                        },
                    },
                    {
                        key: "render",
                        value: function render() {
                            if (true) {
                                return this.props.children;
                            } else {
                                var ReactDevOverlay;
                            }
                        },
                    },
                ]);
                return Container;
            })(_react.default.Component);
            function initialize() {
                return _initialize.apply(this, arguments);
            }
            function _initialize() {
                _initialize = _asyncToGenerator(
                    _runtimeJs.default.mark(function _callee() {
                        var opts,
                            prefix,
                            normalizeLocalePath,
                            detectDomainLocale,
                            parseRelativeUrl,
                            formatUrl,
                            parsedAs,
                            localePathResult,
                            detectedDomain,
                            initScriptLoader,
                            register,
                            _args = arguments;
                        return _runtimeJs.default.wrap(function _callee$(_ctx) {
                            while (1)
                                switch ((_ctx.prev = _ctx.next)) {
                                    case 0:
                                        opts =
                                            _args.length > 0 &&
                                            _args[0] !== void 0
                                                ? _args[0]
                                                : {};
                                        // This makes sure this specific lines are removed in production
                                        if (false) {
                                        }
                                        initialData = JSON.parse(
                                            document.getElementById(
                                                "__NEXT_DATA__"
                                            ).textContent
                                        );
                                        window.__NEXT_DATA__ = initialData;
                                        defaultLocale =
                                            initialData.defaultLocale;
                                        prefix = initialData.assetPrefix || "";
                                        // With dynamic assetPrefix it's no longer possible to set assetPrefix at the build time
                                        // So, this is how we do it in the client side at runtime
                                        __webpack_require__.p = "".concat(
                                            prefix,
                                            "/_next/"
                                        ); //eslint-disable-line
                                        // Initialize next/config with the environment configuration
                                        (0, _runtimeConfig).setConfig({
                                            serverRuntimeConfig: {},
                                            publicRuntimeConfig:
                                                initialData.runtimeConfig || {},
                                        });
                                        asPath = (0, _utils).getURL();
                                        // make sure not to attempt stripping basePath for 404s
                                        if (
                                            (0, _hasBasePath).hasBasePath(
                                                asPath
                                            )
                                        ) {
                                            asPath = (0,
                                            _removeBasePath).removeBasePath(
                                                asPath
                                            );
                                        }
                                        if (false) {
                                        }
                                        if (initialData.scriptLoader) {
                                            initScriptLoader =
                                                __webpack_require__(
                                                    699
                                                ).initScriptLoader;
                                            initScriptLoader(
                                                initialData.scriptLoader
                                            );
                                        }
                                        pageLoader = new _pageLoader.default(
                                            initialData.buildId,
                                            prefix
                                        );
                                        register = function (param) {
                                            var _param = _sliced_to_array(
                                                    param,
                                                    2
                                                ),
                                                r = _param[0],
                                                f = _param[1];
                                            return pageLoader.routeLoader.onEntrypoint(
                                                r,
                                                f
                                            );
                                        };
                                        if (window.__NEXT_P) {
                                            // Defer page registration for another tick. This will increase the overall
                                            // latency in hydrating the page, but reduce the total blocking time.
                                            window.__NEXT_P.map(function (p) {
                                                return setTimeout(function () {
                                                    return register(p);
                                                }, 0);
                                            });
                                        }
                                        window.__NEXT_P = [];
                                        window.__NEXT_P.push = register;
                                        headManager = (0,
                                        _headManager).default();
                                        headManager.getIsSsr = function () {
                                            return router.isSsr;
                                        };
                                        appElement =
                                            document.getElementById("__next");
                                        return _ctx.abrupt("return", {
                                            assetPrefix: prefix,
                                        });
                                    case 21:
                                    case "end":
                                        return _ctx.stop();
                                }
                        }, _callee);
                    })
                );
                return _initialize.apply(this, arguments);
            }
            function hydrate(opts) {
                return _hydrate.apply(this, arguments);
            }
            function _hydrate() {
                _hydrate = _asyncToGenerator(
                    _runtimeJs.default.mark(function _callee(opts) {
                        var initialErr,
                            appEntrypoint,
                            app,
                            mod,
                            pageEntrypoint,
                            isValidElementType,
                            getServerError,
                            renderCtx;
                        return _runtimeJs.default.wrap(
                            function _callee$(_ctx) {
                                while (1)
                                    switch ((_ctx.prev = _ctx.next)) {
                                        case 0:
                                            initialErr = initialData.err;
                                            _ctx.prev = 1;
                                            _ctx.next = 4;
                                            return pageLoader.routeLoader.whenEntrypoint(
                                                "/_app"
                                            );
                                        case 4:
                                            appEntrypoint = _ctx.sent;
                                            if (!("error" in appEntrypoint)) {
                                                _ctx.next = 7;
                                                break;
                                            }
                                            throw appEntrypoint.error;
                                        case 7:
                                            (app = appEntrypoint.component),
                                                (mod = appEntrypoint.exports);
                                            CachedApp = app;
                                            if (mod && mod.reportWebVitals) {
                                                onPerfEntry = function (param) {
                                                    var id = param.id,
                                                        name = param.name,
                                                        startTime =
                                                            param.startTime,
                                                        value = param.value,
                                                        duration =
                                                            param.duration,
                                                        entryType =
                                                            param.entryType,
                                                        entries = param.entries;
                                                    // Combines timestamp with random number for unique ID
                                                    var uniqueID = ""
                                                        .concat(Date.now(), "-")
                                                        .concat(
                                                            Math.floor(
                                                                Math.random() *
                                                                    (9e12 - 1)
                                                            ) + 1e12
                                                        );
                                                    var perfStartEntry;
                                                    if (
                                                        entries &&
                                                        entries.length
                                                    ) {
                                                        perfStartEntry =
                                                            entries[0]
                                                                .startTime;
                                                    }
                                                    var webVitals = {
                                                        id: id || uniqueID,
                                                        name: name,
                                                        startTime:
                                                            startTime ||
                                                            perfStartEntry,
                                                        value:
                                                            value == null
                                                                ? duration
                                                                : value,
                                                        label:
                                                            entryType ===
                                                                "mark" ||
                                                            entryType ===
                                                                "measure"
                                                                ? "custom"
                                                                : "web-vital",
                                                    };
                                                    mod.reportWebVitals(
                                                        webVitals
                                                    );
                                                };
                                            }
                                            if (
                                                // error, so we need to skip waiting for the entrypoint.
                                                true
                                            ) {
                                                _ctx.next = 14;
                                                break;
                                            }
                                            _ctx.t0 = {
                                                error: initialData.err,
                                            };
                                            _ctx.next = 17;
                                            break;
                                        case 14:
                                            _ctx.next = 16;
                                            return pageLoader.routeLoader.whenEntrypoint(
                                                initialData.page
                                            );
                                        case 16:
                                            _ctx.t0 = _ctx.sent;
                                        case 17:
                                            pageEntrypoint = _ctx.t0;
                                            if (!("error" in pageEntrypoint)) {
                                                _ctx.next = 20;
                                                break;
                                            }
                                            throw pageEntrypoint.error;
                                        case 20:
                                            CachedComponent =
                                                pageEntrypoint.component;
                                            if (true) {
                                                _ctx.next = 25;
                                                break;
                                            }
                                            isValidElementType = Object(
                                                (function webpackMissingModule() {
                                                    var e = new Error(
                                                        "Cannot find module 'next/dist/compiled/react-is'"
                                                    );
                                                    e.code = "MODULE_NOT_FOUND";
                                                    throw e;
                                                })()
                                            );
                                            if (
                                                isValidElementType(
                                                    CachedComponent
                                                )
                                            ) {
                                                _ctx.next = 25;
                                                break;
                                            }
                                            throw new Error(
                                                'The default export is not a React Component in page: "'.concat(
                                                    initialData.page,
                                                    '"'
                                                )
                                            );
                                        case 25:
                                            _ctx.next = 30;
                                            break;
                                        case 27:
                                            _ctx.prev = 27;
                                            _ctx.t1 = _ctx["catch"](1);
                                            // This catches errors like throwing in the top level of a module
                                            initialErr = (0,
                                            _isError).getProperError(_ctx.t1);
                                        case 30:
                                            if (false) {
                                            }
                                            if (!window.__NEXT_PRELOADREADY) {
                                                _ctx.next = 34;
                                                break;
                                            }
                                            _ctx.next = 34;
                                            return window.__NEXT_PRELOADREADY(
                                                initialData.dynamicIds
                                            );
                                        case 34:
                                            exports.router = router = (0,
                                            _router).createRouter(
                                                initialData.page,
                                                initialData.query,
                                                asPath,
                                                {
                                                    initialProps:
                                                        initialData.props,
                                                    pageLoader: pageLoader,
                                                    App: CachedApp,
                                                    Component: CachedComponent,
                                                    wrapApp: wrapApp,
                                                    err: initialErr,
                                                    isFallback: Boolean(
                                                        initialData.isFallback
                                                    ),
                                                    subscription: function (
                                                        info,
                                                        App,
                                                        scroll
                                                    ) {
                                                        return render(
                                                            Object.assign(
                                                                {},
                                                                info,
                                                                {
                                                                    App: App,
                                                                    scroll: scroll,
                                                                }
                                                            )
                                                        );
                                                    },
                                                    locale: initialData.locale,
                                                    locales:
                                                        initialData.locales,
                                                    defaultLocale:
                                                        defaultLocale,
                                                    domainLocales:
                                                        initialData.domainLocales,
                                                    isPreview:
                                                        initialData.isPreview,
                                                    isRsc: initialData.rsc,
                                                }
                                            );
                                            _ctx.next = 37;
                                            return router._initialMatchesMiddlewarePromise;
                                        case 37:
                                            initialMatchesMiddleware =
                                                _ctx.sent;
                                            renderCtx = {
                                                App: CachedApp,
                                                initial: true,
                                                Component: CachedComponent,
                                                props: initialData.props,
                                                err: initialErr,
                                            };
                                            if (
                                                !(opts == null
                                                    ? void 0
                                                    : opts.beforeRender)
                                            ) {
                                                _ctx.next = 42;
                                                break;
                                            }
                                            _ctx.next = 42;
                                            return opts.beforeRender();
                                        case 42:
                                            render(renderCtx);
                                        case 43:
                                        case "end":
                                            return _ctx.stop();
                                    }
                            },
                            _callee,
                            null,
                            [[1, 27]]
                        );
                    })
                );
                return _hydrate.apply(this, arguments);
            }
            function render(renderingProps) {
                return _render.apply(this, arguments);
            }
            function _render() {
                _render = _asyncToGenerator(
                    _runtimeJs.default.mark(function _callee(renderingProps) {
                        var renderErr;
                        return _runtimeJs.default.wrap(
                            function _callee$(_ctx) {
                                while (1)
                                    switch ((_ctx.prev = _ctx.next)) {
                                        case 0:
                                            if (!renderingProps.err) {
                                                _ctx.next = 4;
                                                break;
                                            }
                                            _ctx.next = 3;
                                            return renderError(renderingProps);
                                        case 3:
                                            return _ctx.abrupt("return");
                                        case 4:
                                            _ctx.prev = 4;
                                            _ctx.next = 7;
                                            return doRender(renderingProps);
                                        case 7:
                                            _ctx.next = 17;
                                            break;
                                        case 9:
                                            _ctx.prev = 9;
                                            _ctx.t0 = _ctx["catch"](4);
                                            renderErr = (0,
                                            _isError).getProperError(_ctx.t0);
                                            if (!renderErr.cancelled) {
                                                _ctx.next = 14;
                                                break;
                                            }
                                            throw renderErr;
                                        case 14:
                                            if (false) {
                                            }
                                            _ctx.next = 17;
                                            return renderError(
                                                _extends({}, renderingProps, {
                                                    err: renderErr,
                                                })
                                            );
                                        case 17:
                                        case "end":
                                            return _ctx.stop();
                                    }
                            },
                            _callee,
                            null,
                            [[4, 9]]
                        );
                    })
                );
                return _render.apply(this, arguments);
            }
            // This method handles all runtime and debug errors.
            // 404 and 500 errors are special kind of errors
            // and they are still handle via the main render method.
            function renderError(renderErrorProps) {
                var App = renderErrorProps.App,
                    err = renderErrorProps.err;
                // In development runtime errors are caught by our overlay
                // In production we catch runtime errors using componentDidCatch which will trigger renderError
                if (false) {
                }
                // Make sure we log the error to the console, otherwise users can't track down issues.
                console.error(err);
                console.error(
                    "A client-side exception has occurred, see here for more info: https://nextjs.org/docs/messages/client-side-exception-occurred"
                );
                return pageLoader
                    .loadPage("/_error")
                    .then(function (param) {
                        var ErrorComponent = param.page,
                            styleSheets = param.styleSheets;
                        return (lastAppProps == null
                            ? void 0
                            : lastAppProps.Component) === ErrorComponent
                            ? Promise.resolve()
                                  .then(function () {
                                      return _interop_require_wildcard(
                                          __webpack_require__(9185)
                                      );
                                  })
                                  .then(function (m) {
                                      return {
                                          ErrorComponent: m.default,
                                          styleSheets: [],
                                      };
                                  })
                            : {
                                  ErrorComponent: ErrorComponent,
                                  styleSheets: styleSheets,
                              };
                    })
                    .then(function (param) {
                        var ErrorComponent = param.ErrorComponent,
                            styleSheets = param.styleSheets;
                        // In production we do a normal render with the `ErrorComponent` as component.
                        // If we've gotten here upon initial render, we can use the props from the server.
                        // Otherwise, we need to call `getInitialProps` on `App` before mounting.
                        var AppTree = wrapApp(App);
                        var appCtx = {
                            Component: ErrorComponent,
                            AppTree: AppTree,
                            router: router,
                            ctx: {
                                err: err,
                                pathname: initialData.page,
                                query: initialData.query,
                                asPath: asPath,
                                AppTree: AppTree,
                            },
                        };
                        return Promise.resolve(
                            renderErrorProps.props
                                ? renderErrorProps.props
                                : (0, _utils).loadGetInitialProps(App, appCtx)
                        ).then(function (initProps) {
                            return doRender(
                                _extends({}, renderErrorProps, {
                                    err: err,
                                    Component: ErrorComponent,
                                    styleSheets: styleSheets,
                                    props: initProps,
                                })
                            );
                        });
                    });
            }
            var reactRoot = null;
            // On initial render a hydrate should always happen
            var shouldHydrate = true;
            function renderReactElement(domEl, fn) {
                // mark start of hydrate/render
                if (_utils.ST) {
                    performance.mark("beforeRender");
                }
                var reactEl = fn(
                    shouldHydrate ? markHydrateComplete : markRenderComplete
                );
                if (true) {
                    if (!reactRoot) {
                        // Unlike with createRoot, you don't need a separate root.render() call here
                        reactRoot = ReactDOM.hydrateRoot(domEl, reactEl);
                        // TODO: Remove shouldHydrate variable when React 18 is stable as it can depend on `reactRoot` existing
                        shouldHydrate = false;
                    } else {
                        var startTransition = _react.default.startTransition;
                        startTransition(function () {
                            reactRoot.render(reactEl);
                        });
                    }
                } else {
                }
            }
            function markHydrateComplete() {
                if (!_utils.ST) return;
                performance.mark("afterHydrate"); // mark end of hydration
                performance.measure(
                    "Next.js-before-hydration",
                    "navigationStart",
                    "beforeRender"
                );
                performance.measure(
                    "Next.js-hydration",
                    "beforeRender",
                    "afterHydrate"
                );
                if (onPerfEntry) {
                    performance
                        .getEntriesByName("Next.js-hydration")
                        .forEach(onPerfEntry);
                }
                clearMarks();
            }
            function markRenderComplete() {
                if (!_utils.ST) return;
                performance.mark("afterRender"); // mark end of render
                var navStartEntries = performance.getEntriesByName(
                    "routeChange",
                    "mark"
                );
                if (!navStartEntries.length) return;
                performance.measure(
                    "Next.js-route-change-to-render",
                    navStartEntries[0].name,
                    "beforeRender"
                );
                performance.measure(
                    "Next.js-render",
                    "beforeRender",
                    "afterRender"
                );
                if (onPerfEntry) {
                    performance
                        .getEntriesByName("Next.js-render")
                        .forEach(onPerfEntry);
                    performance
                        .getEntriesByName("Next.js-route-change-to-render")
                        .forEach(onPerfEntry);
                }
                clearMarks();
                ["Next.js-route-change-to-render", "Next.js-render"].forEach(
                    function (measure) {
                        return performance.clearMeasures(measure);
                    }
                );
            }
            function clearMarks() {
                [
                    "beforeRender",
                    "afterHydrate",
                    "afterRender",
                    "routeChange",
                ].forEach(function (mark) {
                    return performance.clearMarks(mark);
                });
            }
            function AppContainer(param) {
                var children = param.children;
                return /*#__PURE__*/ _react.default.createElement(
                    Container,
                    {
                        fn: function (error) {
                            return renderError({
                                App: CachedApp,
                                err: error,
                            }).catch(function (err) {
                                return console.error(
                                    "Error rendering page: ",
                                    err
                                );
                            });
                        },
                    },
                    /*#__PURE__*/ _react.default.createElement(
                        _routerContext.RouterContext.Provider,
                        {
                            value: (0, _router).makePublicRouterInstance(
                                router
                            ),
                        },
                        /*#__PURE__*/ _react.default.createElement(
                            _headManagerContext.HeadManagerContext.Provider,
                            {
                                value: headManager,
                            },
                            /*#__PURE__*/ _react.default.createElement(
                                _imageConfigContext.ImageConfigContext.Provider,
                                {
                                    value: {
                                        deviceSizes: [
                                            640, 750, 828, 1080, 1200, 1920,
                                            2048, 3840,
                                        ],
                                        imageSizes: [
                                            16, 32, 48, 64, 96, 128, 256, 384,
                                        ],
                                        path: "/_next/image",
                                        loader: "default",
                                        experimentalLayoutRaw: false,
                                    },
                                },
                                children
                            )
                        )
                    )
                );
            }
            function renderApp(App, appProps) {
                return /*#__PURE__*/ _react.default.createElement(
                    App,
                    Object.assign({}, appProps)
                );
            }
            var wrapApp = function (App) {
                return function (wrappedAppProps) {
                    var appProps = _extends({}, wrappedAppProps, {
                        Component: CachedComponent,
                        err: initialData.err,
                        router: router,
                    });
                    return /*#__PURE__*/ _react.default.createElement(
                        AppContainer,
                        null,
                        renderApp(App, appProps)
                    );
                };
            };
            var RSCComponent;
            if (false) {
                var ServerRoot,
                    rscCache,
                    nextServerDataLoadingGlobal,
                    DOMContentLoaded,
                    initialServerDataFlushed,
                    initialServerDataLoaded,
                    initialServerDataWriter,
                    initialServerDataBuffer,
                    encoder,
                    RefreshContext,
                    ref,
                    createFromFetch,
                    createFromReadableStream,
                    getCacheKey,
                    useServerResponse,
                    fetchFlight,
                    createResponseCache,
                    nextServerDataRegisterWriter,
                    nextServerDataCallback;
            }
            var lastAppProps;
            function doRender(input) {
                var onStart = // This function has a return type to ensure it doesn't start returning a
                    // Promise. It should remain synchronous.
                    function onStart() {
                        if (
                            !styleSheets || // unless we're in production:
                            "production" !== "production"
                        ) {
                            return false;
                        }
                        var currentStyleTags = looseToArray(
                            document.querySelectorAll("style[data-n-href]")
                        );
                        var currentHrefs = new Set(
                            currentStyleTags.map(function (tag) {
                                return tag.getAttribute("data-n-href");
                            })
                        );
                        var noscript = document.querySelector(
                            "noscript[data-n-css]"
                        );
                        var nonce =
                            noscript == null
                                ? void 0
                                : noscript.getAttribute("data-n-css");
                        styleSheets.forEach(function (param) {
                            var href = param.href,
                                text = param.text;
                            if (!currentHrefs.has(href)) {
                                var styleTag = document.createElement("style");
                                styleTag.setAttribute("data-n-href", href);
                                styleTag.setAttribute("media", "x");
                                if (nonce) {
                                    styleTag.setAttribute("nonce", nonce);
                                }
                                document.head.appendChild(styleTag);
                                styleTag.appendChild(
                                    document.createTextNode(text)
                                );
                            }
                        });
                        return true;
                    };
                var onHeadCommit = function onHeadCommit() {
                    if (
                        // unless we're in production:
                        true && // we may as well save the CPU cycles:
                        styleSheets &&
                        !canceled
                    ) {
                        var desiredHrefs = new Set(
                            styleSheets.map(function (s) {
                                return s.href;
                            })
                        );
                        var currentStyleTags = looseToArray(
                            document.querySelectorAll("style[data-n-href]")
                        );
                        var currentHrefs = currentStyleTags.map(function (tag) {
                            return tag.getAttribute("data-n-href");
                        });
                        // Toggle `<style>` tags on or off depending on if they're needed:
                        for (var idx = 0; idx < currentHrefs.length; ++idx) {
                            if (desiredHrefs.has(currentHrefs[idx])) {
                                currentStyleTags[idx].removeAttribute("media");
                            } else {
                                currentStyleTags[idx].setAttribute(
                                    "media",
                                    "x"
                                );
                            }
                        }
                        // Reorder styles into intended order:
                        var referenceNode = document.querySelector(
                            "noscript[data-n-css]"
                        );
                        if (referenceNode) {
                            styleSheets.forEach(function (param) {
                                var href = param.href;
                                var targetTag = document.querySelector(
                                    'style[data-n-href="'.concat(href, '"]')
                                );
                                if (targetTag) {
                                    referenceNode.parentNode.insertBefore(
                                        targetTag,
                                        referenceNode.nextSibling
                                    );
                                    referenceNode = targetTag;
                                }
                            });
                        }
                        // Finally, clean up server rendered stylesheets:
                        looseToArray(
                            document.querySelectorAll("link[data-n-p]")
                        ).forEach(function (el) {
                            el.parentNode.removeChild(el);
                        });
                    }
                    if (input.scroll) {
                        window.scrollTo(input.scroll.x, input.scroll.y);
                    }
                };
                var onRootCommit = function onRootCommit() {
                    resolvePromise();
                };
                var App = input.App,
                    Component = input.Component,
                    props = input.props,
                    err = input.err,
                    __N_RSC = input.__N_RSC;
                var styleSheets =
                    "initial" in input ? undefined : input.styleSheets;
                Component = Component || lastAppProps.Component;
                props = props || lastAppProps.props;
                var isRSC = false ? 0 : !!__N_RSC;
                var appProps = _extends({}, props, {
                    Component: isRSC ? RSCComponent : Component,
                    err: err,
                    router: router,
                });
                // lastAppProps has to be set before ReactDom.render to account for ReactDom throwing an error.
                lastAppProps = appProps;
                var canceled = false;
                var resolvePromise;
                var renderPromise = new Promise(function (resolve, reject) {
                    if (lastRenderReject) {
                        lastRenderReject();
                    }
                    resolvePromise = function () {
                        lastRenderReject = null;
                        resolve();
                    };
                    lastRenderReject = function () {
                        canceled = true;
                        lastRenderReject = null;
                        var error = new Error("Cancel rendering route");
                        error.cancelled = true;
                        reject(error);
                    };
                });
                onStart();
                var elem = /*#__PURE__*/ _react.default.createElement(
                    _react.default.Fragment,
                    null,
                    /*#__PURE__*/ _react.default.createElement(Head, {
                        callback: onHeadCommit,
                    }),
                    /*#__PURE__*/ _react.default.createElement(
                        AppContainer,
                        null,
                        renderApp(App, appProps),
                        /*#__PURE__*/ _react.default.createElement(
                            _portal.Portal,
                            {
                                type: "next-route-announcer",
                            },
                            /*#__PURE__*/ _react.default.createElement(
                                _routeAnnouncer.RouteAnnouncer,
                                null
                            )
                        )
                    )
                );
                // We catch runtime errors using componentDidCatch which will trigger renderError
                renderReactElement(appElement, function (callback) {
                    return /*#__PURE__*/ _react.default.createElement(
                        Root,
                        {
                            callbacks: [callback, onRootCommit],
                        },
                        true
                            ? /*#__PURE__*/ _react.default.createElement(
                                  _react.default.StrictMode,
                                  null,
                                  elem
                              )
                            : 0
                    );
                });
                return renderPromise;
            }
            function Root(param) {
                var callbacks = param.callbacks,
                    children = param.children;
                // We use `useLayoutEffect` to guarantee the callbacks are executed
                // as soon as React flushes the update
                _react.default.useLayoutEffect(
                    function () {
                        return callbacks.forEach(function (callback) {
                            return callback();
                        });
                    },
                    [callbacks]
                );
                // We should ask to measure the Web Vitals after rendering completes so we
                // don't cause any hydration delay:
                _react.default.useEffect(function () {
                    (0, _performanceRelayer).default(onPerfEntry);
                }, []);
                if (false) {
                }
                return children;
            }
            // Dummy component that we render as a child of Root so that we can
            // toggle the correct styles before the page is rendered.
            function Head(param) {
                var callback = param.callback;
                // We use `useLayoutEffect` to guarantee the callback is executed
                // as soon as React flushes the update.
                _react.default.useLayoutEffect(
                    function () {
                        return callback();
                    },
                    [callback]
                );
                return null;
            }
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=index.js.map

            /***/
        },

        /***/ 2870: /***/ function (module, exports, __webpack_require__) {
            "use strict";

            var _ = __webpack_require__(7339);
            window.next = {
                version: _.version,
                // router is initialized later so it has to be live-binded
                get router() {
                    return _.router;
                },
                emitter: _.emitter,
            };
            (0, _)
                .initialize({})
                .then(function () {
                    return (0, _).hydrate();
                })
                .catch(console.error);
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=next.js.map

            /***/
        },

        /***/ 2392: /***/ function (module, exports, __webpack_require__) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.normalizePathTrailingSlash = void 0;
            var _removeTrailingSlash = __webpack_require__(6316);
            var _parsePath = __webpack_require__(4943);
            var normalizePathTrailingSlash = function (path) {
                if (!path.startsWith("/")) {
                    return path;
                }
                var ref = (0, _parsePath).parsePath(path),
                    pathname = ref.pathname,
                    query = ref.query,
                    hash = ref.hash;
                if (false) {
                }
                return ""
                    .concat(
                        (0, _removeTrailingSlash).removeTrailingSlash(pathname)
                    )
                    .concat(query)
                    .concat(hash);
            };
            exports.normalizePathTrailingSlash = normalizePathTrailingSlash;
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=normalize-trailing-slash.js.map

            /***/
        },

        /***/ 5181: /***/ function (module, exports, __webpack_require__) {
            "use strict";

            var _class_call_check =
                __webpack_require__(9658) /* ["default"] */.Z;
            var _create_class = __webpack_require__(7222) /* ["default"] */.Z;
            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = void 0;
            var _addBasePath = __webpack_require__(8684);
            var _router = __webpack_require__(6273);
            var _getAssetPathFromRoute = _interopRequireDefault(
                __webpack_require__(3891)
            );
            var _addLocale = __webpack_require__(2725);
            var _isDynamic = __webpack_require__(8689);
            var _parseRelativeUrl = __webpack_require__(6305);
            var _removeTrailingSlash = __webpack_require__(6316);
            var _routeLoader = __webpack_require__(2669);
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            var PageLoader = /*#__PURE__*/ (function () {
                function PageLoader(buildId, assetPrefix) {
                    _class_call_check(this, PageLoader);
                    this.routeLoader = (0, _routeLoader).createRouteLoader(
                        assetPrefix
                    );
                    this.buildId = buildId;
                    this.assetPrefix = assetPrefix;
                    this.promisedSsgManifest = new Promise(function (resolve) {
                        if (window.__SSG_MANIFEST) {
                            resolve(window.__SSG_MANIFEST);
                        } else {
                            window.__SSG_MANIFEST_CB = function () {
                                resolve(window.__SSG_MANIFEST);
                            };
                        }
                    });
                }
                _create_class(PageLoader, [
                    {
                        key: "getPageList",
                        value: function getPageList() {
                            if (true) {
                                return (0, _routeLoader)
                                    .getClientBuildManifest()
                                    .then(function (manifest) {
                                        return manifest.sortedPages;
                                    });
                            } else {
                            }
                        },
                    },
                    {
                        key: "getMiddlewareList",
                        value: function getMiddlewareList() {
                            if (true) {
                                var middlewareRegex = "";
                                window.__MIDDLEWARE_MANIFEST = middlewareRegex
                                    ? [[middlewareRegex, false]]
                                    : [];
                                return window.__MIDDLEWARE_MANIFEST;
                            } else {
                            }
                        },
                    },
                    {
                        key: "getDataHref",
                        value: function getDataHref(params) {
                            var _this = this;
                            var asPath = params.asPath,
                                href = params.href,
                                locale = params.locale;
                            var ref = (0, _parseRelativeUrl).parseRelativeUrl(
                                    href
                                ),
                                hrefPathname = ref.pathname,
                                query = ref.query,
                                search = ref.search;
                            var ref1 = (0, _parseRelativeUrl).parseRelativeUrl(
                                    asPath
                                ),
                                asPathname = ref1.pathname;
                            var route = (0,
                            _removeTrailingSlash).removeTrailingSlash(
                                hrefPathname
                            );
                            if (route[0] !== "/") {
                                throw new Error(
                                    'Route name should start with a "/", got "'.concat(
                                        route,
                                        '"'
                                    )
                                );
                            }
                            var getHrefForSlug = function (path) {
                                var dataRoute = (0,
                                _getAssetPathFromRoute).default(
                                    (0,
                                    _removeTrailingSlash).removeTrailingSlash(
                                        (0, _addLocale).addLocale(path, locale)
                                    ),
                                    ".json"
                                );
                                return (0, _addBasePath).addBasePath(
                                    "/_next/data/"
                                        .concat(_this.buildId)
                                        .concat(dataRoute)
                                        .concat(search),
                                    true
                                );
                            };
                            return getHrefForSlug(
                                params.skipInterpolation
                                    ? asPathname
                                    : (0, _isDynamic).isDynamicRoute(route)
                                    ? (0, _router).interpolateAs(
                                          hrefPathname,
                                          asPathname,
                                          query
                                      ).result
                                    : route
                            );
                        },
                    },
                    {
                        /**
                         * @param {string} route - the route (file-system path)
                         */ key: "_isSsg",
                        value: function _isSsg(route) {
                            return this.promisedSsgManifest.then(function (
                                manifest
                            ) {
                                return manifest.has(route);
                            });
                        },
                    },
                    {
                        key: "loadPage",
                        value: function loadPage(route) {
                            return this.routeLoader
                                .loadRoute(route)
                                .then(function (res) {
                                    if ("component" in res) {
                                        return {
                                            page: res.component,
                                            mod: res.exports,
                                            styleSheets: res.styles.map(
                                                function (o) {
                                                    return {
                                                        href: o.href,
                                                        text: o.content,
                                                    };
                                                }
                                            ),
                                        };
                                    }
                                    throw res.error;
                                });
                        },
                    },
                    {
                        key: "prefetch",
                        value: function prefetch(route) {
                            return this.routeLoader.prefetch(route);
                        },
                    },
                ]);
                return PageLoader;
            })();
            exports["default"] = PageLoader;
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=page-loader.js.map

            /***/
        },

        /***/ 9302: /***/ function (module, exports, __webpack_require__) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = void 0;
            var _webVitals = __webpack_require__(8745);
            var initialHref = location.href;
            var isRegistered = false;
            var userReportHandler;
            function onReport(metric) {
                if (userReportHandler) {
                    userReportHandler(metric);
                }
                // This code is not shipped, executed, or present in the client-side
                // JavaScript bundle unless explicitly enabled in your application.
                //
                // When this feature is enabled, we'll make it very clear by printing a
                // message during the build (`next build`).
                if (false) {
                    var send, vitalsUrl, blob, body, fallbackSend;
                }
            }
            var _default = function (onPerfEntry) {
                // Update function if it changes:
                userReportHandler = onPerfEntry;
                // Only register listeners once:
                if (isRegistered) {
                    return;
                }
                isRegistered = true;
                (0, _webVitals).onCLS(onReport);
                (0, _webVitals).onFID(onReport);
                (0, _webVitals).onFCP(onReport);
                (0, _webVitals).onLCP(onReport);
                (0, _webVitals).onTTFB(onReport);
                (0, _webVitals).onINP(onReport);
            };
            exports["default"] = _default;
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=performance-relayer.js.map

            /***/
        },

        /***/ 2207: /***/ function (module, exports, __webpack_require__) {
            "use strict";

            var _sliced_to_array =
                __webpack_require__(4941) /* ["default"] */.Z;
            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.Portal = void 0;
            var _react = _interopRequireDefault(__webpack_require__(7294));
            var _reactDom = __webpack_require__(3935);
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            var Portal = function (param) {
                var children = param.children,
                    type = param.type;
                var portalNode = _react.default.useRef(null);
                var ref = _sliced_to_array(_react.default.useState(), 2),
                    forceUpdate = ref[1];
                _react.default.useEffect(
                    function () {
                        portalNode.current = document.createElement(type);
                        document.body.appendChild(portalNode.current);
                        forceUpdate({});
                        return function () {
                            if (portalNode.current) {
                                document.body.removeChild(portalNode.current);
                            }
                        };
                    },
                    [type]
                );
                return portalNode.current
                    ? /*#__PURE__*/ (0, _reactDom).createPortal(
                          children,
                          portalNode.current
                      )
                    : null;
            };
            exports.Portal = Portal;
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=index.js.map

            /***/
        },

        /***/ 9320: /***/ function (module, exports, __webpack_require__) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.removeBasePath = removeBasePath;
            var _hasBasePath = __webpack_require__(4119);
            var basePath = false || "";
            function removeBasePath(path) {
                if (false) {
                }
                path = path.slice(basePath.length);
                if (!path.startsWith("/")) path = "/".concat(path);
                return path;
            }
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=remove-base-path.js.map

            /***/
        },

        /***/ 5776: /***/ function (module, exports, __webpack_require__) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.removeLocale = removeLocale;
            var _parsePath = __webpack_require__(4943);
            function removeLocale(path, locale) {
                if (false) {
                    var localeLower, pathLower, pathname;
                }
                return path;
            }
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=remove-locale.js.map

            /***/
        },

        /***/ 9311: /***/ function (module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.cancelIdleCallback = exports.requestIdleCallback = void 0;
            var requestIdleCallback =
                (typeof self !== "undefined" &&
                    self.requestIdleCallback &&
                    self.requestIdleCallback.bind(window)) ||
                function (cb) {
                    var start = Date.now();
                    return setTimeout(function () {
                        cb({
                            didTimeout: false,
                            timeRemaining: function timeRemaining() {
                                return Math.max(0, 50 - (Date.now() - start));
                            },
                        });
                    }, 1);
                };
            exports.requestIdleCallback = requestIdleCallback;
            var cancelIdleCallback =
                (typeof self !== "undefined" &&
                    self.cancelIdleCallback &&
                    self.cancelIdleCallback.bind(window)) ||
                function (id) {
                    return clearTimeout(id);
                };
            exports.cancelIdleCallback = cancelIdleCallback;
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=request-idle-callback.js.map

            /***/
        },

        /***/ 8982: /***/ function (module, exports, __webpack_require__) {
            "use strict";

            var _sliced_to_array =
                __webpack_require__(4941) /* ["default"] */.Z;
            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.RouteAnnouncer = RouteAnnouncer;
            exports["default"] = void 0;
            var _react = _interopRequireDefault(__webpack_require__(7294));
            var _router = __webpack_require__(387);
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            function RouteAnnouncer() {
                var asPath = (0, _router).useRouter().asPath;
                var ref = _sliced_to_array(_react.default.useState(""), 2),
                    routeAnnouncement = ref[0],
                    setRouteAnnouncement = ref[1];
                // Only announce the path change, but not for the first load because screen
                // reader will do that automatically.
                var previouslyLoadedPath = _react.default.useRef(asPath);
                // Every time the path changes, announce the new page’s title following this
                // priority: first the document title (from head), otherwise the first h1, or
                // if none of these exist, then the pathname from the URL. This methodology is
                // inspired by Marcy Sutton’s accessible client routing user testing. More
                // information can be found here:
                // https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/
                _react.default.useEffect(
                    function () {
                        // If the path hasn't change, we do nothing.
                        if (previouslyLoadedPath.current === asPath) return;
                        previouslyLoadedPath.current = asPath;
                        if (document.title) {
                            setRouteAnnouncement(document.title);
                        } else {
                            var pageHeader = document.querySelector("h1");
                            var ref;
                            var content =
                                (ref =
                                    pageHeader == null
                                        ? void 0
                                        : pageHeader.innerText) != null
                                    ? ref
                                    : pageHeader == null
                                    ? void 0
                                    : pageHeader.textContent;
                            setRouteAnnouncement(content || asPath);
                        }
                    },
                    [asPath]
                );
                return /*#__PURE__*/ _react.default.createElement(
                    "p",
                    {
                        "aria-live": "assertive", // Make the announcement immediately.
                        id: "__next-route-announcer__",
                        role: "alert",
                        style: {
                            border: 0,
                            clip: "rect(0 0 0 0)",
                            height: "1px",
                            margin: "-1px",
                            overflow: "hidden",
                            padding: 0,
                            position: "absolute",
                            width: "1px",
                            // https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe
                            whiteSpace: "nowrap",
                            wordWrap: "normal",
                        },
                    },
                    routeAnnouncement
                );
            }
            var _default = RouteAnnouncer;
            exports["default"] = _default;
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=route-announcer.js.map

            /***/
        },

        /***/ 2669: /***/ function (module, exports, __webpack_require__) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.markAssetError = markAssetError;
            exports.isAssetError = isAssetError;
            exports.getClientBuildManifest = getClientBuildManifest;
            exports.createRouteLoader = createRouteLoader;
            var _getAssetPathFromRoute = _interopRequireDefault(
                __webpack_require__(3891)
            );
            var _trustedTypes = __webpack_require__(4991);
            var _requestIdleCallback = __webpack_require__(9311);
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            // 3.8s was arbitrarily chosen as it's what https://web.dev/interactive
            // considers as "Good" time-to-interactive. We must assume something went
            // wrong beyond this point, and then fall-back to a full page transition to
            // show the user something of value.
            var MS_MAX_IDLE_DELAY = 3800;
            function withFuture(key, map, generator) {
                var entry = map.get(key);
                if (entry) {
                    if ("future" in entry) {
                        return entry.future;
                    }
                    return Promise.resolve(entry);
                }
                var resolver;
                var prom = new Promise(function (resolve) {
                    resolver = resolve;
                });
                map.set(
                    key,
                    (entry = {
                        resolve: resolver,
                        future: prom,
                    })
                );
                return generator
                    ? generator() // eslint-disable-next-line no-sequences
                          .then(function (value) {
                              return resolver(value), value;
                          })
                          .catch(function (err) {
                              map.delete(key);
                              throw err;
                          })
                    : prom;
            }
            function hasPrefetch(link) {
                try {
                    link = document.createElement("link");
                    return (
                        // with relList.support
                        (!!window.MSInputMethodContext &&
                            !!document.documentMode) ||
                        link.relList.supports("prefetch")
                    );
                } catch (e) {
                    return false;
                }
            }
            var canPrefetch = hasPrefetch();
            function prefetchViaDom(href, as, link) {
                return new Promise(function (res, rej) {
                    var selector = '\n      link[rel="prefetch"][href^="'
                        .concat(href, '"],\n      link[rel="preload"][href^="')
                        .concat(href, '"],\n      script[src^="')
                        .concat(href, '"]');
                    if (document.querySelector(selector)) {
                        return res();
                    }
                    link = document.createElement("link");
                    // The order of property assignment here is intentional:
                    if (as) link.as = as;
                    link.rel = "prefetch";
                    link.crossOrigin = undefined;
                    link.onload = res;
                    link.onerror = rej;
                    // `href` should always be last:
                    link.href = href;
                    document.head.appendChild(link);
                });
            }
            var ASSET_LOAD_ERROR = Symbol("ASSET_LOAD_ERROR");
            function markAssetError(err) {
                return Object.defineProperty(err, ASSET_LOAD_ERROR, {});
            }
            function isAssetError(err) {
                return err && ASSET_LOAD_ERROR in err;
            }
            function appendScript(src, script) {
                return new Promise(function (resolve, reject) {
                    script = document.createElement("script");
                    // The order of property assignment here is intentional.
                    // 1. Setup success/failure hooks in case the browser synchronously
                    //    executes when `src` is set.
                    script.onload = resolve;
                    script.onerror = function () {
                        return reject(
                            markAssetError(
                                new Error("Failed to load script: ".concat(src))
                            )
                        );
                    };
                    // 2. Configure the cross-origin attribute before setting `src` in case the
                    //    browser begins to fetch.
                    script.crossOrigin = undefined;
                    // 3. Finally, set the source and inject into the DOM in case the child
                    //    must be appended for fetching to start.
                    script.src = src;
                    document.body.appendChild(script);
                });
            }
            // We wait for pages to be built in dev before we start the route transition
            // timeout to prevent an un-necessary hard navigation in development.
            var devBuildPromise;
            // Resolve a promise that times out after given amount of milliseconds.
            function resolvePromiseWithTimeout(p, ms, err) {
                return new Promise(function (resolve, reject) {
                    var cancelled = false;
                    p.then(function (r) {
                        // Resolved, cancel the timeout
                        cancelled = true;
                        resolve(r);
                    }).catch(reject);
                    // We wrap these checks separately for better dead-code elimination in
                    // production bundles.
                    if (false) {
                    }
                    if (true) {
                        (0, _requestIdleCallback).requestIdleCallback(
                            function () {
                                return setTimeout(function () {
                                    if (!cancelled) {
                                        reject(err);
                                    }
                                }, ms);
                            }
                        );
                    }
                });
            }
            function getClientBuildManifest() {
                if (self.__BUILD_MANIFEST) {
                    return Promise.resolve(self.__BUILD_MANIFEST);
                }
                var onBuildManifest = new Promise(function (resolve) {
                    // Mandatory because this is not concurrent safe:
                    var cb = self.__BUILD_MANIFEST_CB;
                    self.__BUILD_MANIFEST_CB = function () {
                        resolve(self.__BUILD_MANIFEST);
                        cb && cb();
                    };
                });
                return resolvePromiseWithTimeout(
                    onBuildManifest,
                    MS_MAX_IDLE_DELAY,
                    markAssetError(
                        new Error("Failed to load client build manifest")
                    )
                );
            }
            function getFilesForRoute(assetPrefix, route) {
                if (false) {
                    var scriptUrl;
                }
                return getClientBuildManifest().then(function (manifest) {
                    if (!(route in manifest)) {
                        throw markAssetError(
                            new Error("Failed to lookup route: ".concat(route))
                        );
                    }
                    var allFiles = manifest[route].map(function (entry) {
                        return assetPrefix + "/_next/" + encodeURI(entry);
                    });
                    return {
                        scripts: allFiles
                            .filter(function (v) {
                                return v.endsWith(".js");
                            })
                            .map(function (v) {
                                return (0,
                                _trustedTypes).__unsafeCreateTrustedScriptURL(
                                    v
                                );
                            }),
                        css: allFiles.filter(function (v) {
                            return v.endsWith(".css");
                        }),
                    };
                });
            }
            function createRouteLoader(assetPrefix) {
                var maybeExecuteScript = function maybeExecuteScript(src) {
                    // With HMR we might need to "reload" scripts when they are
                    // disposed and readded. Executing scripts twice has no functional
                    // differences
                    if (true) {
                        var prom = loadedScripts.get(src.toString());
                        if (prom) {
                            return prom;
                        }
                        // Skip executing script if it's already in the DOM:
                        if (
                            document.querySelector(
                                'script[src^="'.concat(src, '"]')
                            )
                        ) {
                            return Promise.resolve();
                        }
                        loadedScripts.set(
                            src.toString(),
                            (prom = appendScript(src))
                        );
                        return prom;
                    } else {
                    }
                };
                var fetchStyleSheet = function fetchStyleSheet(href) {
                    var prom = styleSheets.get(href);
                    if (prom) {
                        return prom;
                    }
                    styleSheets.set(
                        href,
                        (prom = fetch(href)
                            .then(function (res) {
                                if (!res.ok) {
                                    throw new Error(
                                        "Failed to load stylesheet: ".concat(
                                            href
                                        )
                                    );
                                }
                                return res.text().then(function (text) {
                                    return {
                                        href: href,
                                        content: text,
                                    };
                                });
                            })
                            .catch(function (err) {
                                throw markAssetError(err);
                            }))
                    );
                    return prom;
                };
                var entrypoints = new Map();
                var loadedScripts = new Map();
                var styleSheets = new Map();
                var routes = new Map();
                return {
                    whenEntrypoint: function whenEntrypoint(route) {
                        return withFuture(route, entrypoints);
                    },
                    onEntrypoint: function onEntrypoint(route, execute) {
                        (execute
                            ? Promise.resolve()
                                  .then(function () {
                                      return execute();
                                  })
                                  .then(
                                      function (exports1) {
                                          return {
                                              component:
                                                  (exports1 &&
                                                      exports1.default) ||
                                                  exports1,
                                              exports: exports1,
                                          };
                                      },
                                      function (err) {
                                          return {
                                              error: err,
                                          };
                                      }
                                  )
                            : Promise.resolve(undefined)
                        ).then(function (input) {
                            var old = entrypoints.get(route);
                            if (old && "resolve" in old) {
                                if (input) {
                                    entrypoints.set(route, input);
                                    old.resolve(input);
                                }
                            } else {
                                if (input) {
                                    entrypoints.set(route, input);
                                } else {
                                    entrypoints.delete(route);
                                }
                                // when this entrypoint has been resolved before
                                // the route is outdated and we want to invalidate
                                // this cache entry
                                routes.delete(route);
                            }
                        });
                    },
                    loadRoute: function loadRoute(route, prefetch) {
                        var _this = this;
                        return withFuture(route, routes, function () {
                            var _this1 = _this;
                            var devBuildPromiseResolve;
                            if (false) {
                            }
                            return resolvePromiseWithTimeout(
                                getFilesForRoute(assetPrefix, route)
                                    .then(function (param) {
                                        var scripts = param.scripts,
                                            css = param.css;
                                        return Promise.all([
                                            entrypoints.has(route)
                                                ? []
                                                : Promise.all(
                                                      scripts.map(
                                                          maybeExecuteScript
                                                      )
                                                  ),
                                            Promise.all(
                                                css.map(fetchStyleSheet)
                                            ),
                                        ]);
                                    })
                                    .then(function (res) {
                                        return _this1
                                            .whenEntrypoint(route)
                                            .then(function (entrypoint) {
                                                return {
                                                    entrypoint: entrypoint,
                                                    styles: res[1],
                                                };
                                            });
                                    }),
                                MS_MAX_IDLE_DELAY,
                                markAssetError(
                                    new Error(
                                        "Route did not complete loading: ".concat(
                                            route
                                        )
                                    )
                                )
                            )
                                .then(function (param) {
                                    var entrypoint = param.entrypoint,
                                        styles = param.styles;
                                    var res = Object.assign(
                                        {
                                            styles: styles,
                                        },
                                        entrypoint
                                    );
                                    return "error" in entrypoint
                                        ? entrypoint
                                        : res;
                                })
                                .catch(function (err) {
                                    if (prefetch) {
                                        // we don't want to cache errors during prefetch
                                        throw err;
                                    }
                                    return {
                                        error: err,
                                    };
                                })
                                .finally(function () {
                                    return devBuildPromiseResolve == null
                                        ? void 0
                                        : devBuildPromiseResolve();
                                });
                        });
                    },
                    prefetch: function prefetch(route) {
                        var _this = this;
                        // https://github.com/GoogleChromeLabs/quicklink/blob/453a661fa1fa940e2d2e044452398e38c67a98fb/src/index.mjs#L115-L118
                        // License: Apache 2.0
                        var cn;
                        if ((cn = navigator.connection)) {
                            // Don't prefetch if using 2G or if Save-Data is enabled.
                            if (cn.saveData || /2g/.test(cn.effectiveType))
                                return Promise.resolve();
                        }
                        return getFilesForRoute(assetPrefix, route)
                            .then(function (output) {
                                return Promise.all(
                                    canPrefetch
                                        ? output.scripts.map(function (script) {
                                              return prefetchViaDom(
                                                  script.toString(),
                                                  "script"
                                              );
                                          })
                                        : []
                                );
                            })
                            .then(function () {
                                var _this1 = _this;
                                (0, _requestIdleCallback).requestIdleCallback(
                                    function () {
                                        return _this1
                                            .loadRoute(route, true)
                                            .catch(function () {});
                                    }
                                );
                            })
                            .catch(function () {});
                    },
                };
            }
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=route-loader.js.map

            /***/
        },

        /***/ 387: /***/ function (module, exports, __webpack_require__) {
            "use strict";

            var _construct = __webpack_require__(5317)["default"];
            var _to_consumable_array =
                __webpack_require__(3929) /* ["default"] */.Z;
            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            Object.defineProperty(exports, "Router", {
                enumerable: true,
                get: function get() {
                    return _router.default;
                },
            });
            Object.defineProperty(exports, "withRouter", {
                enumerable: true,
                get: function get() {
                    return _withRouter.default;
                },
            });
            exports.useRouter = useRouter;
            exports.createRouter = createRouter;
            exports.makePublicRouterInstance = makePublicRouterInstance;
            exports["default"] = void 0;
            var _react = _interopRequireDefault(__webpack_require__(7294));
            var _router = _interopRequireDefault(__webpack_require__(6273));
            var _routerContext = __webpack_require__(3462);
            var _isError = _interopRequireDefault(__webpack_require__(676));
            var _withRouter = _interopRequireDefault(__webpack_require__(8981));
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            var singletonRouter = {
                router: null,
                readyCallbacks: [],
                ready: function ready(cb) {
                    if (this.router) return cb();
                    if (true) {
                        this.readyCallbacks.push(cb);
                    }
                },
            };
            // Create public properties and methods of the router in the singletonRouter
            var urlPropertyFields = [
                "pathname",
                "route",
                "query",
                "asPath",
                "components",
                "isFallback",
                "basePath",
                "locale",
                "locales",
                "defaultLocale",
                "isReady",
                "isPreview",
                "isLocaleDomain",
                "domainLocales",
            ];
            var routerEvents = [
                "routeChangeStart",
                "beforeHistoryChange",
                "routeChangeComplete",
                "routeChangeError",
                "hashChangeStart",
                "hashChangeComplete",
            ];
            var coreMethodFields = [
                "push",
                "replace",
                "reload",
                "back",
                "prefetch",
                "beforePopState",
            ];
            // Events is a static property on the router, the router doesn't have to be initialized to use it
            Object.defineProperty(singletonRouter, "events", {
                get: function get() {
                    return _router.default.events;
                },
            });
            urlPropertyFields.forEach(function (field) {
                // Here we need to use Object.defineProperty because we need to return
                // the property assigned to the actual router
                // The value might get changed as we change routes and this is the
                // proper way to access it
                Object.defineProperty(singletonRouter, field, {
                    get: function get() {
                        var router = getRouter();
                        return router[field];
                    },
                });
            });
            coreMethodFields.forEach(function (field) {
                singletonRouter[field] = function () {
                    for (
                        var _len = arguments.length,
                            args = new Array(_len),
                            _key = 0;
                        _key < _len;
                        _key++
                    ) {
                        args[_key] = arguments[_key];
                    }
                    var _router;
                    var router = getRouter();
                    return (_router = router)[field].apply(
                        _router,
                        _to_consumable_array(args)
                    );
                };
            });
            routerEvents.forEach(function (event) {
                singletonRouter.ready(function () {
                    _router.default.events.on(event, function () {
                        for (
                            var _len = arguments.length,
                                args = new Array(_len),
                                _key = 0;
                            _key < _len;
                            _key++
                        ) {
                            args[_key] = arguments[_key];
                        }
                        var eventField = "on"
                            .concat(event.charAt(0).toUpperCase())
                            .concat(event.substring(1));
                        var _singletonRouter = singletonRouter;
                        if (_singletonRouter[eventField]) {
                            try {
                                var __singletonRouter;
                                (__singletonRouter = _singletonRouter)[
                                    eventField
                                ].apply(
                                    __singletonRouter,
                                    _to_consumable_array(args)
                                );
                            } catch (err) {
                                console.error(
                                    "Error when running the Router event: ".concat(
                                        eventField
                                    )
                                );
                                console.error(
                                    (0, _isError).default(err)
                                        ? ""
                                              .concat(err.message, "\n")
                                              .concat(err.stack)
                                        : err + ""
                                );
                            }
                        }
                    });
                });
            });
            function getRouter() {
                if (!singletonRouter.router) {
                    var message =
                        "No router instance found.\n" +
                        'You should only use "next/router" on the client side of your app.\n';
                    throw new Error(message);
                }
                return singletonRouter.router;
            }
            var _default = singletonRouter;
            exports["default"] = _default;
            function useRouter() {
                return _react.default.useContext(_routerContext.RouterContext);
            }
            function createRouter() {
                for (
                    var _len = arguments.length,
                        args = new Array(_len),
                        _key = 0;
                    _key < _len;
                    _key++
                ) {
                    args[_key] = arguments[_key];
                }
                singletonRouter.router = _construct(
                    _router.default,
                    _to_consumable_array(args)
                );
                singletonRouter.readyCallbacks.forEach(function (cb) {
                    return cb();
                });
                singletonRouter.readyCallbacks = [];
                return singletonRouter.router;
            }
            function makePublicRouterInstance(router) {
                var scopedRouter = router;
                var instance = {};
                var _iteratorNormalCompletion = true,
                    _didIteratorError = false,
                    _iteratorError = undefined;
                try {
                    for (
                        var _iterator = urlPropertyFields[Symbol.iterator](),
                            _step;
                        !(_iteratorNormalCompletion = (_step = _iterator.next())
                            .done);
                        _iteratorNormalCompletion = true
                    ) {
                        var property = _step.value;
                        if (typeof scopedRouter[property] === "object") {
                            instance[property] = Object.assign(
                                Array.isArray(scopedRouter[property]) ? [] : {},
                                scopedRouter[property]
                            ); // makes sure query is not stateful
                            continue;
                        }
                        instance[property] = scopedRouter[property];
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (
                            !_iteratorNormalCompletion &&
                            _iterator.return != null
                        ) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                // Events is a static property on the router, the router doesn't have to be initialized to use it
                instance.events = _router.default.events;
                coreMethodFields.forEach(function (field) {
                    instance[field] = function () {
                        for (
                            var _len = arguments.length,
                                args = new Array(_len),
                                _key = 0;
                            _key < _len;
                            _key++
                        ) {
                            args[_key] = arguments[_key];
                        }
                        var _scopedRouter;
                        return (_scopedRouter = scopedRouter)[field].apply(
                            _scopedRouter,
                            _to_consumable_array(args)
                        );
                    };
                });
                return instance;
            }
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=router.js.map

            /***/
        },

        /***/ 699: /***/ function (module, exports, __webpack_require__) {
            "use strict";

            var _sliced_to_array =
                __webpack_require__(4941) /* ["default"] */.Z;
            var _to_consumable_array =
                __webpack_require__(3929) /* ["default"] */.Z;
            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.handleClientScriptLoad = handleClientScriptLoad;
            exports.initScriptLoader = initScriptLoader;
            exports["default"] = void 0;
            var _react = _interopRequireWildcard(__webpack_require__(7294));
            var _headManagerContext = __webpack_require__(8404);
            var _headManager = __webpack_require__(6007);
            var _requestIdleCallback = __webpack_require__(9311);
            function _extends() {
                _extends =
                    Object.assign ||
                    function (target) {
                        for (var i = 1; i < arguments.length; i++) {
                            var source = arguments[i];
                            for (var key in source) {
                                if (
                                    Object.prototype.hasOwnProperty.call(
                                        source,
                                        key
                                    )
                                ) {
                                    target[key] = source[key];
                                }
                            }
                        }
                        return target;
                    };
                return _extends.apply(this, arguments);
            }
            function _getRequireWildcardCache() {
                if (typeof WeakMap !== "function") return null;
                var cache = new WeakMap();
                _getRequireWildcardCache = function _getRequireWildcardCache() {
                    return cache;
                };
                return cache;
            }
            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                }
                if (
                    obj === null ||
                    (typeof obj !== "object" && typeof obj !== "function")
                ) {
                    return {
                        default: obj,
                    };
                }
                var cache = _getRequireWildcardCache();
                if (cache && cache.has(obj)) {
                    return cache.get(obj);
                }
                var newObj = {};
                var hasPropertyDescriptor =
                    Object.defineProperty && Object.getOwnPropertyDescriptor;
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        var desc = hasPropertyDescriptor
                            ? Object.getOwnPropertyDescriptor(obj, key)
                            : null;
                        if (desc && (desc.get || desc.set)) {
                            Object.defineProperty(newObj, key, desc);
                        } else {
                            newObj[key] = obj[key];
                        }
                    }
                }
                newObj.default = obj;
                if (cache) {
                    cache.set(obj, newObj);
                }
                return newObj;
            }
            function _objectWithoutPropertiesLoose(source, excluded) {
                if (source == null) return {};
                var target = {};
                var sourceKeys = Object.keys(source);
                var key, i;
                for (i = 0; i < sourceKeys.length; i++) {
                    key = sourceKeys[i];
                    if (excluded.indexOf(key) >= 0) continue;
                    target[key] = source[key];
                }
                return target;
            }
            var ScriptCache = new Map();
            var LoadCache = new Set();
            var ignoreProps = [
                "onLoad",
                "dangerouslySetInnerHTML",
                "children",
                "onError",
                "strategy",
            ];
            var loadScript = function (props) {
                var src = props.src,
                    id = props.id,
                    _onLoad = props.onLoad,
                    onLoad = _onLoad === void 0 ? function () {} : _onLoad,
                    dangerouslySetInnerHTML = props.dangerouslySetInnerHTML,
                    _children = props.children,
                    children = _children === void 0 ? "" : _children,
                    _strategy = props.strategy,
                    strategy =
                        _strategy === void 0 ? "afterInteractive" : _strategy,
                    onError = props.onError;
                var cacheKey = id || src;
                // Script has already loaded
                if (cacheKey && LoadCache.has(cacheKey)) {
                    return;
                }
                // Contents of this script are already loading/loaded
                if (ScriptCache.has(src)) {
                    LoadCache.add(cacheKey);
                    // Execute onLoad since the script loading has begun
                    ScriptCache.get(src).then(onLoad, onError);
                    return;
                }
                var el = document.createElement("script");
                var loadPromise = new Promise(function (resolve, reject) {
                    el.addEventListener("load", function (e) {
                        resolve();
                        if (onLoad) {
                            onLoad.call(this, e);
                        }
                    });
                    el.addEventListener("error", function (e) {
                        reject(e);
                    });
                }).catch(function (e) {
                    if (onError) {
                        onError(e);
                    }
                });
                if (src) {
                    ScriptCache.set(src, loadPromise);
                }
                LoadCache.add(cacheKey);
                if (dangerouslySetInnerHTML) {
                    el.innerHTML = dangerouslySetInnerHTML.__html || "";
                } else if (children) {
                    el.textContent =
                        typeof children === "string"
                            ? children
                            : Array.isArray(children)
                            ? children.join("")
                            : "";
                } else if (src) {
                    el.src = src;
                }
                var _iteratorNormalCompletion = true,
                    _didIteratorError = false,
                    _iteratorError = undefined;
                try {
                    for (
                        var _iterator =
                                Object.entries(props)[Symbol.iterator](),
                            _step;
                        !(_iteratorNormalCompletion = (_step = _iterator.next())
                            .done);
                        _iteratorNormalCompletion = true
                    ) {
                        var _value = _sliced_to_array(_step.value, 2),
                            k = _value[0],
                            value = _value[1];
                        if (value === undefined || ignoreProps.includes(k)) {
                            continue;
                        }
                        var attr =
                            _headManager.DOMAttributeNames[k] ||
                            k.toLowerCase();
                        el.setAttribute(attr, value);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (
                            !_iteratorNormalCompletion &&
                            _iterator.return != null
                        ) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                if (strategy === "worker") {
                    el.setAttribute("type", "text/partytown");
                }
                el.setAttribute("data-nscript", strategy);
                document.body.appendChild(el);
            };
            function handleClientScriptLoad(props) {
                var _strategy = props.strategy,
                    strategy =
                        _strategy === void 0 ? "afterInteractive" : _strategy;
                if (strategy === "lazyOnload") {
                    window.addEventListener("load", function () {
                        (0, _requestIdleCallback).requestIdleCallback(
                            function () {
                                return loadScript(props);
                            }
                        );
                    });
                } else {
                    loadScript(props);
                }
            }
            function loadLazyScript(props) {
                if (document.readyState === "complete") {
                    (0, _requestIdleCallback).requestIdleCallback(function () {
                        return loadScript(props);
                    });
                } else {
                    window.addEventListener("load", function () {
                        (0, _requestIdleCallback).requestIdleCallback(
                            function () {
                                return loadScript(props);
                            }
                        );
                    });
                }
            }
            function addBeforeInteractiveToCache() {
                var scripts = _to_consumable_array(
                    document.querySelectorAll(
                        '[data-nscript="beforeInteractive"]'
                    )
                ).concat(
                    _to_consumable_array(
                        document.querySelectorAll(
                            '[data-nscript="beforePageRender"]'
                        )
                    )
                );
                scripts.forEach(function (script) {
                    var cacheKey = script.id || script.getAttribute("src");
                    LoadCache.add(cacheKey);
                });
            }
            function initScriptLoader(scriptLoaderItems) {
                scriptLoaderItems.forEach(handleClientScriptLoad);
                addBeforeInteractiveToCache();
            }
            function Script(props) {
                var _src = props.src,
                    src = _src === void 0 ? "" : _src,
                    _onLoad = props.onLoad,
                    onLoad = _onLoad === void 0 ? function () {} : _onLoad,
                    _strategy = props.strategy,
                    strategy =
                        _strategy === void 0 ? "afterInteractive" : _strategy,
                    onError = props.onError,
                    restProps = _objectWithoutPropertiesLoose(props, [
                        "src",
                        "onLoad",
                        "strategy",
                        "onError",
                    ]);
                // Context is available only during SSR
                var ref = (0, _react).useContext(
                        _headManagerContext.HeadManagerContext
                    ),
                    updateScripts = ref.updateScripts,
                    scripts = ref.scripts,
                    getIsSsr = ref.getIsSsr;
                (0, _react).useEffect(
                    function () {
                        if (strategy === "afterInteractive") {
                            loadScript(props);
                        } else if (strategy === "lazyOnload") {
                            loadLazyScript(props);
                        }
                    },
                    [props, strategy]
                );
                if (strategy === "beforeInteractive" || strategy === "worker") {
                    if (updateScripts) {
                        scripts[strategy] = (scripts[strategy] || []).concat([
                            _extends(
                                {
                                    src: src,
                                    onLoad: onLoad,
                                    onError: onError,
                                },
                                restProps
                            ),
                        ]);
                        updateScripts(scripts);
                    } else if (getIsSsr && getIsSsr()) {
                        // Script has already loaded during SSR
                        LoadCache.add(restProps.id || src);
                    } else if (getIsSsr && !getIsSsr()) {
                        loadScript(props);
                    }
                }
                return null;
            }
            var _default = Script;
            exports["default"] = _default;
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=script.js.map

            /***/
        },

        /***/ 4991: /***/ function (module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.__unsafeCreateTrustedScriptURL =
                __unsafeCreateTrustedScriptURL;
            /**
             * Stores the Trusted Types Policy. Starts as undefined and can be set to null
             * if Trusted Types is not supported in the browser.
             */ var policy;
            /**
             * Getter for the Trusted Types Policy. If it is undefined, it is instantiated
             * here or set to null if Trusted Types is not supported in the browser.
             */ function getPolicy() {
                if (typeof policy === "undefined" && "object" !== "undefined") {
                    var ref;
                    policy =
                        ((ref = window.trustedTypes) == null
                            ? void 0
                            : ref.createPolicy("nextjs", {
                                  createHTML: function (input) {
                                      return input;
                                  },
                                  createScript: function (input) {
                                      return input;
                                  },
                                  createScriptURL: function (input) {
                                      return input;
                                  },
                              })) || null;
                }
                return policy;
            }
            function __unsafeCreateTrustedScriptURL(url) {
                var ref;
                return (
                    ((ref = getPolicy()) == null
                        ? void 0
                        : ref.createScriptURL(url)) || url
                );
            }
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=trusted-types.js.map

            /***/
        },

        /***/ 8981: /***/ function (module, exports, __webpack_require__) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = withRouter;
            var _react = _interopRequireDefault(__webpack_require__(7294));
            var _router = __webpack_require__(387);
            function withRouter(ComposedComponent) {
                var WithRouterWrapper = function WithRouterWrapper(props) {
                    return /*#__PURE__*/ _react.default.createElement(
                        ComposedComponent,
                        Object.assign(
                            {
                                router: (0, _router).useRouter(),
                            },
                            props
                        )
                    );
                };
                WithRouterWrapper.getInitialProps =
                    ComposedComponent.getInitialProps;
                WithRouterWrapper.origGetInitialProps =
                    ComposedComponent.origGetInitialProps;
                if (false) {
                    var name;
                }
                return WithRouterWrapper;
            }
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=with-router.js.map

            /***/
        },

        /***/ 9185: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _class_call_check =
                __webpack_require__(9658) /* ["default"] */.Z;
            var _create_class = __webpack_require__(7222) /* ["default"] */.Z;
            var _inherits = __webpack_require__(7788) /* ["default"] */.Z;
            var _create_super = __webpack_require__(7735) /* ["default"] */.Z;
            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = void 0;
            var _react = _interopRequireDefault(__webpack_require__(7294));
            var _head = _interopRequireDefault(__webpack_require__(5443));
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            var statusCodes = {
                400: "Bad Request",
                404: "This page could not be found",
                405: "Method Not Allowed",
                500: "Internal Server Error",
            };
            function _getInitialProps(param) {
                var res = param.res,
                    err = param.err;
                var statusCode =
                    res && res.statusCode
                        ? res.statusCode
                        : err
                        ? err.statusCode
                        : 404;
                return {
                    statusCode: statusCode,
                };
            }
            var _Component;
            var Error = /*#__PURE__*/ (function (_superClass) {
                _inherits(Error, _superClass);
                var _super = _create_super(Error);
                function Error() {
                    _class_call_check(this, Error);
                    return _super.apply(this, arguments);
                }
                _create_class(Error, [
                    {
                        key: "render",
                        value: function render() {
                            var _props = this.props,
                                statusCode = _props.statusCode,
                                _withDarkMode = _props.withDarkMode,
                                withDarkMode =
                                    _withDarkMode === void 0
                                        ? true
                                        : _withDarkMode;
                            var title =
                                this.props.title ||
                                statusCodes[statusCode] ||
                                "An unexpected error has occurred";
                            return /*#__PURE__*/ _react.default.createElement(
                                "div",
                                {
                                    style: styles.error,
                                },
                                /*#__PURE__*/ _react.default.createElement(
                                    _head.default,
                                    null,
                                    /*#__PURE__*/ _react.default.createElement(
                                        "title",
                                        null,
                                        statusCode
                                            ? ""
                                                  .concat(statusCode, ": ")
                                                  .concat(title)
                                            : "Application error: a client-side exception has occurred"
                                    )
                                ),
                                /*#__PURE__*/ _react.default.createElement(
                                    "div",
                                    null,
                                    /*#__PURE__*/ _react.default.createElement(
                                        "style",
                                        {
                                            dangerouslySetInnerHTML: {
                                                __html: "\n                body { margin: 0; color: #000; background: #fff; }\n                .next-error-h1 {\n                  border-right: 1px solid rgba(0, 0, 0, .3);\n                }\n                \n                ".concat(
                                                    withDarkMode
                                                        ? "@media (prefers-color-scheme: dark) {\n                  body { color: #fff; background: #000; }\n                  .next-error-h1 {\n                    border-right: 1px solid rgba(255, 255, 255, .3);\n                  }\n                }"
                                                        : ""
                                                ),
                                            },
                                        }
                                    ),
                                    statusCode
                                        ? /*#__PURE__*/ _react.default.createElement(
                                              "h1",
                                              {
                                                  className: "next-error-h1",
                                                  style: styles.h1,
                                              },
                                              statusCode
                                          )
                                        : null,
                                    /*#__PURE__*/ _react.default.createElement(
                                        "div",
                                        {
                                            style: styles.desc,
                                        },
                                        /*#__PURE__*/ _react.default.createElement(
                                            "h2",
                                            {
                                                style: styles.h2,
                                            },
                                            this.props.title || statusCode
                                                ? title
                                                : /*#__PURE__*/ _react.default.createElement(
                                                      _react.default.Fragment,
                                                      null,
                                                      "Application error: a client-side exception has occurred (see the browser console for more information)"
                                                  ),
                                            "."
                                        )
                                    )
                                )
                            );
                        },
                    },
                ]);
                return Error;
            })((_Component = _react.default.Component));
            Error.displayName = "ErrorPage";
            Error.getInitialProps = _getInitialProps;
            Error.origGetInitialProps = _getInitialProps;
            var styles = {
                error: {
                    fontFamily:
                        '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
                    height: "100vh",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                },
                desc: {
                    display: "inline-block",
                    textAlign: "left",
                    lineHeight: "49px",
                    height: "49px",
                    verticalAlign: "middle",
                },
                h1: {
                    display: "inline-block",
                    margin: 0,
                    marginRight: "20px",
                    padding: "10px 23px 10px 0",
                    fontSize: "24px",
                    fontWeight: 500,
                    verticalAlign: "top",
                },
                h2: {
                    fontSize: "14px",
                    fontWeight: "normal",
                    lineHeight: "inherit",
                    margin: 0,
                    padding: 0,
                },
            };
            exports["default"] = Error; //# sourceMappingURL=_error.js.map

            /***/
        },

        /***/ 2227: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.AmpStateContext = void 0;
            var _react = _interopRequireDefault(__webpack_require__(7294));
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            var AmpStateContext = _react.default.createContext({});
            exports.AmpStateContext = AmpStateContext;
            if (false) {
            } //# sourceMappingURL=amp-context.js.map

            /***/
        },

        /***/ 7363: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.isInAmpMode = isInAmpMode;
            function isInAmpMode() {
                var ref =
                        arguments.length > 0 && arguments[0] !== void 0
                            ? arguments[0]
                            : {},
                    _ampFirst = ref.ampFirst,
                    ampFirst = _ampFirst === void 0 ? false : _ampFirst,
                    _hybrid = ref.hybrid,
                    hybrid = _hybrid === void 0 ? false : _hybrid,
                    _hasQuery = ref.hasQuery,
                    hasQuery = _hasQuery === void 0 ? false : _hasQuery;
                return ampFirst || (hybrid && hasQuery);
            } //# sourceMappingURL=amp-mode.js.map

            /***/
        },

        /***/ 489: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.escapeStringRegexp = escapeStringRegexp;
            // regexp is based on https://github.com/sindresorhus/escape-string-regexp
            var reHasRegExp = /[|\\{}()[\]^$+*?.-]/;
            var reReplaceRegExp = /[|\\{}()[\]^$+*?.-]/g;
            function escapeStringRegexp(str) {
                // see also: https://github.com/lodash/lodash/blob/2da024c3b4f9947a48517639de7560457cd4ec6c/escapeRegExp.js#L23
                if (reHasRegExp.test(str)) {
                    return str.replace(reReplaceRegExp, "\\$&");
                }
                return str;
            } //# sourceMappingURL=escape-regexp.js.map

            /***/
        },

        /***/ 8404: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.HeadManagerContext = void 0;
            var _react = _interopRequireDefault(__webpack_require__(7294));
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            var HeadManagerContext = _react.default.createContext({});
            exports.HeadManagerContext = HeadManagerContext;
            if (false) {
            } //# sourceMappingURL=head-manager-context.js.map

            /***/
        },

        /***/ 5443: /***/ function (module, exports, __webpack_require__) {
            "use strict";

            var _object_spread = __webpack_require__(337) /* ["default"] */.Z;
            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.defaultHead = defaultHead;
            exports["default"] = void 0;
            var _react = _interopRequireWildcard(__webpack_require__(7294));
            var _sideEffect = _interopRequireDefault(__webpack_require__(5188));
            var _ampContext = __webpack_require__(2227);
            var _headManagerContext = __webpack_require__(8404);
            var _ampMode = __webpack_require__(7363);
            var _utils = __webpack_require__(3794);
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            function _getRequireWildcardCache() {
                if (typeof WeakMap !== "function") return null;
                var cache = new WeakMap();
                _getRequireWildcardCache = function _getRequireWildcardCache() {
                    return cache;
                };
                return cache;
            }
            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                }
                if (
                    obj === null ||
                    (typeof obj !== "object" && typeof obj !== "function")
                ) {
                    return {
                        default: obj,
                    };
                }
                var cache = _getRequireWildcardCache();
                if (cache && cache.has(obj)) {
                    return cache.get(obj);
                }
                var newObj = {};
                var hasPropertyDescriptor =
                    Object.defineProperty && Object.getOwnPropertyDescriptor;
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        var desc = hasPropertyDescriptor
                            ? Object.getOwnPropertyDescriptor(obj, key)
                            : null;
                        if (desc && (desc.get || desc.set)) {
                            Object.defineProperty(newObj, key, desc);
                        } else {
                            newObj[key] = obj[key];
                        }
                    }
                }
                newObj.default = obj;
                if (cache) {
                    cache.set(obj, newObj);
                }
                return newObj;
            }
            function defaultHead() {
                var inAmpMode =
                    arguments.length > 0 && arguments[0] !== void 0
                        ? arguments[0]
                        : false;
                var head = [
                    /*#__PURE__*/ _react.default.createElement("meta", {
                        charSet: "utf-8",
                    }),
                ];
                if (!inAmpMode) {
                    head.push(
                        /*#__PURE__*/ _react.default.createElement("meta", {
                            name: "viewport",
                            content: "width=device-width",
                        })
                    );
                }
                return head;
            }
            function onlyReactElement(list, child) {
                // React children can be "string" or "number" in this case we ignore them for backwards compat
                if (typeof child === "string" || typeof child === "number") {
                    return list;
                }
                // Adds support for React.Fragment
                if (child.type === _react.default.Fragment) {
                    return list.concat(
                        _react.default.Children.toArray(
                            child.props.children
                        ).reduce(function (fragmentList, fragmentChild) {
                            if (
                                typeof fragmentChild === "string" ||
                                typeof fragmentChild === "number"
                            ) {
                                return fragmentList;
                            }
                            return fragmentList.concat(fragmentChild);
                        }, [])
                    );
                }
                return list.concat(child);
            }
            var METATYPES = ["name", "httpEquiv", "charSet", "itemProp"];
            /*
 returns a function for filtering head child elements
 which shouldn't be duplicated, like <title/>
 Also adds support for deduplicated `key` properties
*/ function unique() {
                var keys = new Set();
                var tags = new Set();
                var metaTypes = new Set();
                var metaCategories = {};
                return function (h) {
                    var isUnique = true;
                    var hasKey = false;
                    if (
                        h.key &&
                        typeof h.key !== "number" &&
                        h.key.indexOf("$") > 0
                    ) {
                        hasKey = true;
                        var key = h.key.slice(h.key.indexOf("$") + 1);
                        if (keys.has(key)) {
                            isUnique = false;
                        } else {
                            keys.add(key);
                        }
                    }
                    // eslint-disable-next-line default-case
                    switch (h.type) {
                        case "title":
                        case "base":
                            if (tags.has(h.type)) {
                                isUnique = false;
                            } else {
                                tags.add(h.type);
                            }
                            break;
                        case "meta":
                            for (
                                var i = 0, len = METATYPES.length;
                                i < len;
                                i++
                            ) {
                                var metatype = METATYPES[i];
                                if (!h.props.hasOwnProperty(metatype)) continue;
                                if (metatype === "charSet") {
                                    if (metaTypes.has(metatype)) {
                                        isUnique = false;
                                    } else {
                                        metaTypes.add(metatype);
                                    }
                                } else {
                                    var category = h.props[metatype];
                                    var categories =
                                        metaCategories[metatype] || new Set();
                                    if (
                                        (metatype !== "name" || !hasKey) &&
                                        categories.has(category)
                                    ) {
                                        isUnique = false;
                                    } else {
                                        categories.add(category);
                                        metaCategories[metatype] = categories;
                                    }
                                }
                            }
                            break;
                    }
                    return isUnique;
                };
            }
            /**
             *
             * @param headChildrenElements List of children of <Head>
             */ function reduceComponents(headChildrenElements, props) {
                return headChildrenElements
                    .reduce(onlyReactElement, [])
                    .reverse()
                    .concat(defaultHead(props.inAmpMode).reverse())
                    .filter(unique())
                    .reverse()
                    .map(function (c, i) {
                        var key = c.key || i;
                        if (true && !props.inAmpMode) {
                            if (
                                c.type === "link" &&
                                c.props["href"] &&
                                [
                                    "https://fonts.googleapis.com/css",
                                    "https://use.typekit.net/",
                                ].some(function (url) {
                                    return c.props["href"].startsWith(url);
                                })
                            ) {
                                var newProps = _object_spread(
                                    {},
                                    c.props || {}
                                );
                                newProps["data-href"] = newProps["href"];
                                newProps["href"] = undefined;
                                // Add this attribute to make it easy to identify optimized tags
                                newProps["data-optimized-fonts"] = true;
                                return /*#__PURE__*/ _react.default.cloneElement(
                                    c,
                                    newProps
                                );
                            }
                        }
                        if (false) {
                            var srcMessage;
                        }
                        return /*#__PURE__*/ _react.default.cloneElement(c, {
                            key: key,
                        });
                    });
            }
            /**
             * This component injects elements to `<head>` of your page.
             * To avoid duplicated `tags` in `<head>` you can use the `key` property, which will make sure every tag is only rendered once.
             */ function Head(param) {
                var children = param.children;
                var ampState = (0, _react).useContext(
                    _ampContext.AmpStateContext
                );
                var headManager = (0, _react).useContext(
                    _headManagerContext.HeadManagerContext
                );
                return /*#__PURE__*/ _react.default.createElement(
                    _sideEffect.default,
                    {
                        reduceComponentsToState: reduceComponents,
                        headManager: headManager,
                        inAmpMode: (0, _ampMode).isInAmpMode(ampState),
                    },
                    children
                );
            }
            var _default = Head;
            exports["default"] = _default;
            if (
                (typeof exports.default === "function" ||
                    (typeof exports.default === "object" &&
                        exports.default !== null)) &&
                typeof exports.default.__esModule === "undefined"
            ) {
                Object.defineProperty(exports.default, "__esModule", {
                    value: true,
                });
                Object.assign(exports.default, exports);
                module.exports = exports.default;
            } //# sourceMappingURL=head.js.map

            /***/
        },

        /***/ 4317: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.normalizeLocalePath = normalizeLocalePath;
            function normalizeLocalePath(pathname, locales) {
                var detectedLocale;
                // first item will be empty string from splitting at first char
                var pathnameParts = pathname.split("/");
                (locales || []).some(function (locale) {
                    if (
                        pathnameParts[1] &&
                        pathnameParts[1].toLowerCase() === locale.toLowerCase()
                    ) {
                        detectedLocale = locale;
                        pathnameParts.splice(1, 1);
                        pathname = pathnameParts.join("/") || "/";
                        return true;
                    }
                    return false;
                });
                return {
                    pathname: pathname,
                    detectedLocale: detectedLocale,
                };
            } //# sourceMappingURL=normalize-locale-path.js.map

            /***/
        },

        /***/ 9977: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.ImageConfigContext = void 0;
            var _react = _interopRequireDefault(__webpack_require__(7294));
            var _imageConfig = __webpack_require__(9309);
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            var ImageConfigContext = _react.default.createContext(
                _imageConfig.imageConfigDefault
            );
            exports.ImageConfigContext = ImageConfigContext;
            if (false) {
            } //# sourceMappingURL=image-config-context.js.map

            /***/
        },

        /***/ 9309: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.imageConfigDefault = exports.VALID_LOADERS = void 0;
            var VALID_LOADERS = [
                "default",
                "imgix",
                "cloudinary",
                "akamai",
                "custom",
            ];
            exports.VALID_LOADERS = VALID_LOADERS;
            var imageConfigDefault = {
                deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
                imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
                path: "/_next/image",
                loader: "default",
                domains: [],
                disableStaticImages: false,
                minimumCacheTTL: 60,
                formats: ["image/webp"],
                dangerouslyAllowSVG: false,
                contentSecurityPolicy:
                    "script-src 'none'; frame-src 'none'; sandbox;",
            };
            exports.imageConfigDefault = imageConfigDefault; //# sourceMappingURL=image-config.js.map

            /***/
        },

        /***/ 8887: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.getObjectClassLabel = getObjectClassLabel;
            exports.isPlainObject = isPlainObject;
            function getObjectClassLabel(value) {
                return Object.prototype.toString.call(value);
            }
            function isPlainObject(value) {
                if (getObjectClassLabel(value) !== "[object Object]") {
                    return false;
                }
                var prototype = Object.getPrototypeOf(value);
                /**
                 * this used to be previously:
                 *
                 * `return prototype === null || prototype === Object.prototype`
                 *
                 * but Edge Runtime expose Object from vm, being that kind of type-checking wrongly fail.
                 *
                 * It was changed to the current implementation since it's resilient to serialization.
                 */ return (
                    prototype === null ||
                    prototype.hasOwnProperty("isPrototypeOf")
                );
            } //# sourceMappingURL=is-plain-object.js.map

            /***/
        },

        /***/ 5660: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _to_consumable_array =
                __webpack_require__(3929) /* ["default"] */.Z;
            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = mitt;
            function mitt() {
                var all = Object.create(null);
                return {
                    on: function on(type, handler) {
                        (all[type] || (all[type] = [])).push(handler);
                    },
                    off: function off(type, handler) {
                        if (all[type]) {
                            all[type].splice(
                                all[type].indexOf(handler) >>> 0,
                                1
                            );
                        }
                    },
                    emit: function emit(type) {
                        for (
                            var _len = arguments.length,
                                evts = new Array(_len > 1 ? _len - 1 : 0),
                                _key = 1;
                            _key < _len;
                            _key++
                        ) {
                            evts[_key - 1] = arguments[_key];
                        }
                        (all[type] || []).slice().map(function (handler) {
                            handler.apply(void 0, _to_consumable_array(evts));
                        });
                    },
                };
            } //# sourceMappingURL=mitt.js.map

            /***/
        },

        /***/ 8317: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.denormalizePagePath = denormalizePagePath;
            var _utils = __webpack_require__(418);
            var _normalizePathSep = __webpack_require__(9892);
            function denormalizePagePath(page) {
                var _page = (0, _normalizePathSep).normalizePathSep(page);
                return _page.startsWith("/index/") &&
                    !(0, _utils).isDynamicRoute(_page)
                    ? _page.slice(6)
                    : _page !== "/index"
                    ? _page
                    : "/";
            } //# sourceMappingURL=denormalize-page-path.js.map

            /***/
        },

        /***/ 9892: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.normalizePathSep = normalizePathSep;
            function normalizePathSep(path) {
                return path.replace(/\\/g, "/");
            } //# sourceMappingURL=normalize-path-sep.js.map

            /***/
        },

        /***/ 3462: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.RouterContext = void 0;
            var _react = _interopRequireDefault(__webpack_require__(7294));
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            var RouterContext = _react.default.createContext(null);
            exports.RouterContext = RouterContext;
            if (false) {
            } //# sourceMappingURL=router-context.js.map

            /***/
        },

        /***/ 6273: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _async_to_generator =
                __webpack_require__(932) /* ["default"] */.Z;
            var _class_call_check =
                __webpack_require__(9658) /* ["default"] */.Z;
            var _create_class = __webpack_require__(7222) /* ["default"] */.Z;
            var _define_property = __webpack_require__(9361)["default"];
            var _interop_require_default =
                __webpack_require__(2648) /* ["default"] */.Z;
            var _object_spread = __webpack_require__(337) /* ["default"] */.Z;
            var _object_spread_props =
                __webpack_require__(9961) /* ["default"] */.Z;
            var _sliced_to_array =
                __webpack_require__(4941) /* ["default"] */.Z;
            var _runtimeJs = _interop_require_default(
                __webpack_require__(4051)
            );
            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.isLocalURL = isLocalURL;
            exports.interpolateAs = interpolateAs;
            exports.resolveHref = resolveHref;
            exports.createKey = createKey;
            exports["default"] = void 0;
            var _normalizeTrailingSlash = __webpack_require__(2392);
            var _removeTrailingSlash = __webpack_require__(6316);
            var _routeLoader = __webpack_require__(2669);
            var _script = __webpack_require__(699);
            var _isError = _interopRequireWildcard(__webpack_require__(676));
            var _denormalizePagePath = __webpack_require__(8317);
            var _normalizeLocalePath = __webpack_require__(4317);
            var _mitt = _interopRequireDefault(__webpack_require__(5660));
            var _utils = __webpack_require__(3794);
            var _isDynamic = __webpack_require__(8689);
            var _parseRelativeUrl = __webpack_require__(6305);
            var _querystring = __webpack_require__(466);
            var _resolveRewrites = _interopRequireDefault(
                __webpack_require__(2431)
            );
            var _routeMatcher = __webpack_require__(3888);
            var _routeRegex = __webpack_require__(4095);
            var _formatUrl = __webpack_require__(4611);
            var _detectDomainLocale = __webpack_require__(8748);
            var _parsePath = __webpack_require__(4943);
            var _addLocale = __webpack_require__(2725);
            var _removeLocale = __webpack_require__(5776);
            var _removeBasePath = __webpack_require__(9320);
            var _addBasePath = __webpack_require__(8684);
            var _hasBasePath = __webpack_require__(4119);
            var _getNextPathnameInfo = __webpack_require__(159);
            var _formatNextPathnameInfo = __webpack_require__(4022);
            var Router = /*#__PURE__*/ (function () {
                function Router(pathname, query, as, param) {
                    var initialProps = param.initialProps,
                        pageLoader = param.pageLoader,
                        App = param.App,
                        wrapApp = param.wrapApp,
                        Component = param.Component,
                        err = param.err,
                        subscription = param.subscription,
                        isFallback = param.isFallback,
                        locale = param.locale,
                        locales = param.locales,
                        defaultLocale = param.defaultLocale,
                        domainLocales = param.domainLocales,
                        isPreview = param.isPreview,
                        isRsc = param.isRsc;
                    var _this = this;
                    _class_call_check(this, Router);
                    // Server Data Cache
                    _define_property(this, "sdc", {});
                    _define_property(this, "isFirstPopStateEvent", true);
                    _define_property(this, "_key", createKey());
                    _define_property(this, "onPopState", function (e) {
                        var isFirstPopStateEvent = _this.isFirstPopStateEvent;
                        _this.isFirstPopStateEvent = false;
                        var state = e.state;
                        if (!state) {
                            // We get state as undefined for two reasons.
                            //  1. With older safari (< 8) and older chrome (< 34)
                            //  2. When the URL changed with #
                            //
                            // In the both cases, we don't need to proceed and change the route.
                            // (as it's already changed)
                            // But we can simply replace the state with the new changes.
                            // Actually, for (1) we don't need to nothing. But it's hard to detect that event.
                            // So, doing the following for (1) does no harm.
                            var _$pathname = _this.pathname,
                                _$query = _this.query;
                            _this.changeState(
                                "replaceState",
                                (0, _formatUrl).formatWithValidation({
                                    pathname: (0, _addBasePath).addBasePath(
                                        _$pathname
                                    ),
                                    query: _$query,
                                }),
                                (0, _utils).getURL()
                            );
                            return;
                        }
                        if (!state.__N) {
                            return;
                        }
                        // Safari fires popstateevent when reopening the browser.
                        if (
                            isFirstPopStateEvent &&
                            _this.locale === state.options.locale &&
                            state.as === _this.asPath
                        ) {
                            return;
                        }
                        var forcedScroll;
                        var url = state.url,
                            _$as = state.as,
                            options = state.options,
                            key = state.key;
                        if (false) {
                            var v;
                        }
                        _this._key = key;
                        var _$pathname1 = (0,
                        _parseRelativeUrl).parseRelativeUrl(url).pathname;
                        // Make sure we don't re-render on initial load,
                        // can be caused by navigating back from an external site
                        if (
                            _this.isSsr &&
                            _$as ===
                                (0, _addBasePath).addBasePath(_this.asPath) &&
                            _$pathname1 ===
                                (0, _addBasePath).addBasePath(_this.pathname)
                        ) {
                            return;
                        }
                        // If the downstream application returns falsy, return.
                        // They will then be responsible for handling the event.
                        if (_this._bps && !_this._bps(state)) {
                            return;
                        }
                        _this.change(
                            "replaceState",
                            url,
                            _$as,
                            Object.assign({}, options, {
                                shallow: options.shallow && _this._shallow,
                                locale: options.locale || _this.defaultLocale,
                                // @ts-ignore internal value not exposed on types
                                _h: 0,
                            }),
                            forcedScroll
                        );
                    });
                    // represents the current component key
                    var route = (0, _removeTrailingSlash).removeTrailingSlash(
                        pathname
                    );
                    // set up the component cache (by route keys)
                    this.components = {};
                    // We should not keep the cache, if there's an error
                    // Otherwise, this cause issues when when going back and
                    // come again to the errored page.
                    if (pathname !== "/_error") {
                        this.components[route] = {
                            Component: Component,
                            initial: true,
                            props: initialProps,
                            err: err,
                            __N_SSG: initialProps && initialProps.__N_SSG,
                            __N_SSP: initialProps && initialProps.__N_SSP,
                            __N_RSC: !!isRsc,
                        };
                    }
                    this.components["/_app"] = {
                        Component: App,
                        styleSheets: [],
                    };
                    // Backwards compat for Router.router.events
                    // TODO: Should be remove the following major version as it was never documented
                    this.events = Router.events;
                    this.pageLoader = pageLoader;
                    // if auto prerendered and dynamic route wait to update asPath
                    // until after mount to prevent hydration mismatch
                    var autoExportDynamic =
                        (0, _isDynamic).isDynamicRoute(pathname) &&
                        self.__NEXT_DATA__.autoExport;
                    this.basePath = false || "";
                    this.sub = subscription;
                    this.clc = null;
                    this._wrapApp = wrapApp;
                    // make sure to ignore extra popState in safari on navigating
                    // back from external site
                    this.isSsr = true;
                    this.isLocaleDomain = false;
                    this.isReady = !!(
                        self.__NEXT_DATA__.gssp ||
                        self.__NEXT_DATA__.gip ||
                        (self.__NEXT_DATA__.appGip &&
                            !self.__NEXT_DATA__.gsp) ||
                        (!autoExportDynamic && !self.location.search && !false)
                    );
                    if (false) {
                    }
                    this.state = {
                        route: route,
                        pathname: pathname,
                        query: query,
                        asPath: autoExportDynamic ? pathname : as,
                        isPreview: !!isPreview,
                        locale: false ? 0 : undefined,
                        isFallback: isFallback,
                    };
                    this._initialMatchesMiddlewarePromise =
                        Promise.resolve(false);
                    if (true) {
                        // make sure "as" doesn't start with double slashes or else it can
                        // throw an error as it's considered invalid
                        if (!as.startsWith("//")) {
                            var _this1 = this;
                            // in order for `e.state` to work on the `onpopstate` event
                            // we have to register the initial route upon initialization
                            var options = {
                                locale: locale,
                            };
                            var asPath = (0, _utils).getURL();
                            this._initialMatchesMiddlewarePromise =
                                matchesMiddleware({
                                    router: this,
                                    locale: locale,
                                    asPath: asPath,
                                }).then(function (matches) {
                                    options._shouldResolveHref =
                                        as !== pathname;
                                    _this1.changeState(
                                        "replaceState",
                                        matches
                                            ? asPath
                                            : (0,
                                              _formatUrl).formatWithValidation({
                                                  pathname: (0,
                                                  _addBasePath).addBasePath(
                                                      pathname
                                                  ),
                                                  query: query,
                                              }),
                                        asPath,
                                        options
                                    );
                                    return matches;
                                });
                        }
                        window.addEventListener("popstate", this.onPopState);
                        // enable custom scroll restoration handling when available
                        // otherwise fallback to browser's default handling
                        if (false) {
                        }
                    }
                }
                _create_class(Router, [
                    {
                        key: "reload",
                        value: function reload() {
                            window.location.reload();
                        },
                    },
                    {
                        /**
                         * Go back in history
                         */ key: "back",
                        value: function back() {
                            window.history.back();
                        },
                    },
                    {
                        /**
                         * Performs a `pushState` with arguments
                         * @param url of the route
                         * @param as masks `url` for the browser
                         * @param options object you can define `shallow` and other options
                         */ key: "push",
                        value: function push(url, as) {
                            var options =
                                arguments.length > 2 && arguments[2] !== void 0
                                    ? arguments[2]
                                    : {};
                            if (false) {
                            }
                            var ref;
                            (ref = prepareUrlAs(this, url, as)),
                                (url = ref.url),
                                (as = ref.as),
                                ref;
                            return this.change("pushState", url, as, options);
                        },
                    },
                    {
                        /**
                         * Performs a `replaceState` with arguments
                         * @param url of the route
                         * @param as masks `url` for the browser
                         * @param options object you can define `shallow` and other options
                         */ key: "replace",
                        value: function replace(url, as) {
                            var options =
                                arguments.length > 2 && arguments[2] !== void 0
                                    ? arguments[2]
                                    : {};
                            var ref;
                            (ref = prepareUrlAs(this, url, as)),
                                (url = ref.url),
                                (as = ref.as),
                                ref;
                            return this.change(
                                "replaceState",
                                url,
                                as,
                                options
                            );
                        },
                    },
                    {
                        key: "change",
                        value: function change(
                            method,
                            url,
                            as,
                            options,
                            forcedScroll
                        ) {
                            var _this = this;
                            return _async_to_generator(
                                _runtimeJs.default.mark(function _callee() {
                                    var isQueryUpdating,
                                        shouldResolveHref,
                                        nextState,
                                        isSsr,
                                        prevLocale,
                                        parsedAs,
                                        localePathResult,
                                        didNavigate,
                                        ref,
                                        detectedDomain,
                                        asNoBasePath,
                                        _shallow,
                                        shallow,
                                        _scroll,
                                        scroll,
                                        routeProps,
                                        cleanedAs,
                                        localeChange,
                                        parsed,
                                        pathname,
                                        query,
                                        pages,
                                        rewrites,
                                        ref1,
                                        ref2,
                                        resolvedAs,
                                        isMiddlewareMatch,
                                        rewritesResult,
                                        route,
                                        routeMatch,
                                        parsedAs1,
                                        asPathname,
                                        routeRegex,
                                        shouldInterpolate,
                                        interpolatedAs,
                                        missingParams,
                                        ref11,
                                        ref21,
                                        routeInfo,
                                        prefixedAs,
                                        rewriteAs,
                                        localeResult,
                                        routeRegex1,
                                        curRouteMatch,
                                        error,
                                        props,
                                        __N_SSG,
                                        __N_SSP,
                                        component,
                                        scripts,
                                        destination,
                                        parsedHref,
                                        ref3,
                                        newUrl,
                                        newAs,
                                        notFoundRoute,
                                        _route,
                                        isValidShallowRoute,
                                        _scroll1,
                                        shouldScroll,
                                        resetScroll,
                                        hashRegex;
                                    return _runtimeJs.default.wrap(
                                        function _callee$(_ctx) {
                                            while (1)
                                                switch (
                                                    (_ctx.prev = _ctx.next)
                                                ) {
                                                    case 0:
                                                        if (isLocalURL(url)) {
                                                            _ctx.next = 3;
                                                            break;
                                                        }
                                                        handleHardNavigation({
                                                            url: url,
                                                            router: _this,
                                                        });
                                                        return _ctx.abrupt(
                                                            "return",
                                                            false
                                                        );
                                                    case 3:
                                                        isQueryUpdating =
                                                            options._h;
                                                        shouldResolveHref =
                                                            isQueryUpdating ||
                                                            options._shouldResolveHref ||
                                                            (0,
                                                            _parsePath).parsePath(
                                                                url
                                                            ).pathname ===
                                                                (0,
                                                                _parsePath).parsePath(
                                                                    as
                                                                ).pathname;
                                                        nextState =
                                                            _object_spread(
                                                                {},
                                                                _this.state
                                                            );
                                                        // for static pages with query params in the URL we delay
                                                        // marking the router ready until after the query is updated
                                                        // or a navigation has occurred
                                                        _this.isReady = true;
                                                        isSsr = _this.isSsr;
                                                        if (!isQueryUpdating) {
                                                            _this.isSsr = false;
                                                        }
                                                        if (
                                                            !(
                                                                isQueryUpdating &&
                                                                _this.clc
                                                            )
                                                        ) {
                                                            _ctx.next = 11;
                                                            break;
                                                        }
                                                        return _ctx.abrupt(
                                                            "return",
                                                            false
                                                        );
                                                    case 11:
                                                        prevLocale =
                                                            nextState.locale;
                                                        if (true) {
                                                            _ctx.next = 24;
                                                            break;
                                                        }
                                                        nextState.locale =
                                                            options.locale ===
                                                            false
                                                                ? _this.defaultLocale
                                                                : options.locale ||
                                                                  nextState.locale;
                                                        if (
                                                            typeof options.locale ===
                                                            "undefined"
                                                        ) {
                                                            options.locale =
                                                                nextState.locale;
                                                        }
                                                        parsedAs = (0,
                                                        _parseRelativeUrl).parseRelativeUrl(
                                                            (0,
                                                            _hasBasePath).hasBasePath(
                                                                as
                                                            )
                                                                ? (0,
                                                                  _removeBasePath).removeBasePath(
                                                                      as
                                                                  )
                                                                : as
                                                        );
                                                        localePathResult = (0,
                                                        _normalizeLocalePath).normalizeLocalePath(
                                                            parsedAs.pathname,
                                                            _this.locales
                                                        );
                                                        if (
                                                            localePathResult.detectedLocale
                                                        ) {
                                                            nextState.locale =
                                                                localePathResult.detectedLocale;
                                                            parsedAs.pathname =
                                                                (0,
                                                                _addBasePath).addBasePath(
                                                                    parsedAs.pathname
                                                                );
                                                            as = (0,
                                                            _formatUrl).formatWithValidation(
                                                                parsedAs
                                                            );
                                                            url = (0,
                                                            _addBasePath).addBasePath(
                                                                (0,
                                                                _normalizeLocalePath).normalizeLocalePath(
                                                                    (0,
                                                                    _hasBasePath).hasBasePath(
                                                                        url
                                                                    )
                                                                        ? (0,
                                                                          _removeBasePath).removeBasePath(
                                                                              url
                                                                          )
                                                                        : url,
                                                                    _this.locales
                                                                ).pathname
                                                            );
                                                        }
                                                        didNavigate = false;
                                                        // we need to wrap this in the env check again since regenerator runtime
                                                        // moves this on its own due to the return
                                                        if (false) {
                                                        }
                                                        detectedDomain = (0,
                                                        _detectDomainLocale).detectDomainLocale(
                                                            _this.domainLocales,
                                                            undefined,
                                                            nextState.locale
                                                        );
                                                        // we need to wrap this in the env check again since regenerator runtime
                                                        // moves this on its own due to the return
                                                        if (false) {
                                                        }
                                                        if (!didNavigate) {
                                                            _ctx.next = 24;
                                                            break;
                                                        }
                                                        return _ctx.abrupt(
                                                            "return",
                                                            new Promise(
                                                                function () {}
                                                            )
                                                        );
                                                    case 24:
                                                        // marking route changes as a navigation start entry
                                                        if (_utils.ST) {
                                                            performance.mark(
                                                                "routeChange"
                                                            );
                                                        }
                                                        (_shallow =
                                                            options.shallow),
                                                            (shallow =
                                                                _shallow ===
                                                                void 0
                                                                    ? false
                                                                    : _shallow),
                                                            (_scroll =
                                                                options.scroll),
                                                            (scroll =
                                                                _scroll ===
                                                                void 0
                                                                    ? true
                                                                    : _scroll);
                                                        routeProps = {
                                                            shallow: shallow,
                                                        };
                                                        if (
                                                            _this._inFlightRoute &&
                                                            _this.clc
                                                        ) {
                                                            if (!isSsr) {
                                                                Router.events.emit(
                                                                    "routeChangeError",
                                                                    buildCancellationError(),
                                                                    _this._inFlightRoute,
                                                                    routeProps
                                                                );
                                                            }
                                                            _this.clc();
                                                            _this.clc = null;
                                                        }
                                                        as = (0,
                                                        _addBasePath).addBasePath(
                                                            (0,
                                                            _addLocale).addLocale(
                                                                (0,
                                                                _hasBasePath).hasBasePath(
                                                                    as
                                                                )
                                                                    ? (0,
                                                                      _removeBasePath).removeBasePath(
                                                                          as
                                                                      )
                                                                    : as,
                                                                options.locale,
                                                                _this.defaultLocale
                                                            )
                                                        );
                                                        cleanedAs = (0,
                                                        _removeLocale).removeLocale(
                                                            (0,
                                                            _hasBasePath).hasBasePath(
                                                                as
                                                            )
                                                                ? (0,
                                                                  _removeBasePath).removeBasePath(
                                                                      as
                                                                  )
                                                                : as,
                                                            nextState.locale
                                                        );
                                                        _this._inFlightRoute =
                                                            as;
                                                        localeChange =
                                                            prevLocale !==
                                                            nextState.locale;
                                                        if (
                                                            !(
                                                                !isQueryUpdating &&
                                                                _this.onlyAHashChange(
                                                                    cleanedAs
                                                                ) &&
                                                                !localeChange
                                                            )
                                                        ) {
                                                            _ctx.next = 48;
                                                            break;
                                                        }
                                                        nextState.asPath =
                                                            cleanedAs;
                                                        Router.events.emit(
                                                            "hashChangeStart",
                                                            as,
                                                            routeProps
                                                        );
                                                        // TODO: do we need the resolved href when only a hash change?
                                                        _this.changeState(
                                                            method,
                                                            url,
                                                            as,
                                                            _object_spread_props(
                                                                _object_spread(
                                                                    {},
                                                                    options
                                                                ),
                                                                {
                                                                    scroll: false,
                                                                }
                                                            )
                                                        );
                                                        if (scroll) {
                                                            _this.scrollToHash(
                                                                cleanedAs
                                                            );
                                                        }
                                                        _ctx.prev = 37;
                                                        _ctx.next = 40;
                                                        return _this.set(
                                                            nextState,
                                                            _this.components[
                                                                nextState.route
                                                            ],
                                                            null
                                                        );
                                                    case 40:
                                                        _ctx.next = 46;
                                                        break;
                                                    case 42:
                                                        _ctx.prev = 42;
                                                        _ctx.t0 =
                                                            _ctx["catch"](37);
                                                        if (
                                                            (0,
                                                            _isError).default(
                                                                _ctx.t0
                                                            ) &&
                                                            _ctx.t0.cancelled
                                                        ) {
                                                            Router.events.emit(
                                                                "routeChangeError",
                                                                _ctx.t0,
                                                                cleanedAs,
                                                                routeProps
                                                            );
                                                        }
                                                        throw _ctx.t0;
                                                    case 46:
                                                        Router.events.emit(
                                                            "hashChangeComplete",
                                                            as,
                                                            routeProps
                                                        );
                                                        return _ctx.abrupt(
                                                            "return",
                                                            true
                                                        );
                                                    case 48:
                                                        parsed = (0,
                                                        _parseRelativeUrl).parseRelativeUrl(
                                                            url
                                                        );
                                                        (pathname =
                                                            parsed.pathname),
                                                            (query =
                                                                parsed.query);
                                                        _ctx.prev = 51;
                                                        _ctx.t1 =
                                                            _sliced_to_array;
                                                        _ctx.next = 56;
                                                        return Promise.all([
                                                            _this.pageLoader.getPageList(),
                                                            (0,
                                                            _routeLoader).getClientBuildManifest(),
                                                            _this.pageLoader.getMiddlewareList(),
                                                        ]);
                                                    case 56:
                                                        _ctx.t2 = _ctx.sent;
                                                        ref1 = (0, _ctx.t1)(
                                                            _ctx.t2,
                                                            2
                                                        );
                                                        pages = ref1[0];
                                                        (ref2 = ref1[1]),
                                                            (rewrites =
                                                                ref2.__rewrites),
                                                            ref2;
                                                        ref1;
                                                        _ctx.next = 67;
                                                        break;
                                                    case 63:
                                                        _ctx.prev = 63;
                                                        _ctx.t3 =
                                                            _ctx["catch"](51);
                                                        // If we fail to resolve the page list or client-build manifest, we must
                                                        // do a server-side transition:
                                                        handleHardNavigation({
                                                            url: as,
                                                            router: _this,
                                                        });
                                                        return _ctx.abrupt(
                                                            "return",
                                                            false
                                                        );
                                                    case 67:
                                                        // If asked to change the current URL we should reload the current page
                                                        // (not location.reload() but reload getInitialProps and other Next.js stuffs)
                                                        // We also need to set the method = replaceState always
                                                        // as this should not go into the history (That's how browsers work)
                                                        // We should compare the new asPath to the current asPath, not the url
                                                        if (
                                                            !_this.urlIsNew(
                                                                cleanedAs
                                                            ) &&
                                                            !localeChange
                                                        ) {
                                                            method =
                                                                "replaceState";
                                                        }
                                                        resolvedAs = as;
                                                        // url and as should always be prefixed with basePath by this
                                                        // point by either next/link or router.push/replace so strip the
                                                        // basePath from the pathname to match the pages dir 1-to-1
                                                        pathname = pathname
                                                            ? (0,
                                                              _removeTrailingSlash).removeTrailingSlash(
                                                                  (0,
                                                                  _removeBasePath).removeBasePath(
                                                                      pathname
                                                                  )
                                                              )
                                                            : pathname;
                                                        _ctx.t4 =
                                                            !options.shallow;
                                                        if (!_ctx.t4) {
                                                            _ctx.next = 75;
                                                            break;
                                                        }
                                                        _ctx.next = 74;
                                                        return matchesMiddleware(
                                                            {
                                                                asPath: as,
                                                                locale: nextState.locale,
                                                                router: _this,
                                                            }
                                                        );
                                                    case 74:
                                                        _ctx.t4 = _ctx.sent;
                                                    case 75:
                                                        isMiddlewareMatch =
                                                            _ctx.t4;
                                                        if (
                                                            !(
                                                                shouldResolveHref &&
                                                                pathname !==
                                                                    "/_error"
                                                            )
                                                        ) {
                                                            _ctx.next = 88;
                                                            break;
                                                        }
                                                        options._shouldResolveHref = true;
                                                        if (true) {
                                                            _ctx.next = 87;
                                                            break;
                                                        }
                                                        rewritesResult = (0,
                                                        _resolveRewrites).default(
                                                            (0,
                                                            _addBasePath).addBasePath(
                                                                (0,
                                                                _addLocale).addLocale(
                                                                    cleanedAs,
                                                                    nextState.locale
                                                                ),
                                                                true
                                                            ),
                                                            pages,
                                                            rewrites,
                                                            query,
                                                            function (p) {
                                                                return resolveDynamicRoute(
                                                                    p,
                                                                    pages
                                                                );
                                                            },
                                                            _this.locales
                                                        );
                                                        if (
                                                            !rewritesResult.externalDest
                                                        ) {
                                                            _ctx.next = 83;
                                                            break;
                                                        }
                                                        handleHardNavigation({
                                                            url: as,
                                                            router: _this,
                                                        });
                                                        return _ctx.abrupt(
                                                            "return",
                                                            true
                                                        );
                                                    case 83:
                                                        if (
                                                            !isMiddlewareMatch
                                                        ) {
                                                            resolvedAs =
                                                                rewritesResult.asPath;
                                                        }
                                                        if (
                                                            rewritesResult.matchedPage &&
                                                            rewritesResult.resolvedHref
                                                        ) {
                                                            // if this directly matches a page we need to update the href to
                                                            // allow the correct page chunk to be loaded
                                                            pathname =
                                                                rewritesResult.resolvedHref;
                                                            parsed.pathname =
                                                                (0,
                                                                _addBasePath).addBasePath(
                                                                    pathname
                                                                );
                                                            if (
                                                                !isMiddlewareMatch
                                                            ) {
                                                                url = (0,
                                                                _formatUrl).formatWithValidation(
                                                                    parsed
                                                                );
                                                            }
                                                        }
                                                        _ctx.next = 88;
                                                        break;
                                                    case 87: {
                                                        parsed.pathname =
                                                            resolveDynamicRoute(
                                                                pathname,
                                                                pages
                                                            );
                                                        if (
                                                            parsed.pathname !==
                                                            pathname
                                                        ) {
                                                            pathname =
                                                                parsed.pathname;
                                                            parsed.pathname =
                                                                (0,
                                                                _addBasePath).addBasePath(
                                                                    pathname
                                                                );
                                                            if (
                                                                !isMiddlewareMatch
                                                            ) {
                                                                url = (0,
                                                                _formatUrl).formatWithValidation(
                                                                    parsed
                                                                );
                                                            }
                                                        }
                                                    }
                                                    case 88:
                                                        if (isLocalURL(as)) {
                                                            _ctx.next = 93;
                                                            break;
                                                        }
                                                        if (true) {
                                                            _ctx.next = 91;
                                                            break;
                                                        }
                                                        throw new Error(
                                                            'Invalid href: "'
                                                                .concat(
                                                                    url,
                                                                    '" and as: "'
                                                                )
                                                                .concat(
                                                                    as,
                                                                    '", received relative href and external as'
                                                                ) +
                                                                "\nSee more info: https://nextjs.org/docs/messages/invalid-relative-url-external-as"
                                                        );
                                                    case 91:
                                                        handleHardNavigation({
                                                            url: as,
                                                            router: _this,
                                                        });
                                                        return _ctx.abrupt(
                                                            "return",
                                                            false
                                                        );
                                                    case 93:
                                                        resolvedAs = (0,
                                                        _removeLocale).removeLocale(
                                                            (0,
                                                            _removeBasePath).removeBasePath(
                                                                resolvedAs
                                                            ),
                                                            nextState.locale
                                                        );
                                                        route = (0,
                                                        _removeTrailingSlash).removeTrailingSlash(
                                                            pathname
                                                        );
                                                        routeMatch = false;
                                                        if (
                                                            !(0,
                                                            _isDynamic).isDynamicRoute(
                                                                route
                                                            )
                                                        ) {
                                                            _ctx.next = 111;
                                                            break;
                                                        }
                                                        parsedAs1 = (0,
                                                        _parseRelativeUrl).parseRelativeUrl(
                                                            resolvedAs
                                                        );
                                                        asPathname =
                                                            parsedAs1.pathname;
                                                        routeRegex = (0,
                                                        _routeRegex).getRouteRegex(
                                                            route
                                                        );
                                                        routeMatch = (0,
                                                        _routeMatcher).getRouteMatcher(
                                                            routeRegex
                                                        )(asPathname);
                                                        shouldInterpolate =
                                                            route ===
                                                            asPathname;
                                                        interpolatedAs =
                                                            shouldInterpolate
                                                                ? interpolateAs(
                                                                      route,
                                                                      asPathname,
                                                                      query
                                                                  )
                                                                : {};
                                                        if (
                                                            !(
                                                                !routeMatch ||
                                                                (shouldInterpolate &&
                                                                    !interpolatedAs.result)
                                                            )
                                                        ) {
                                                            _ctx.next = 110;
                                                            break;
                                                        }
                                                        missingParams =
                                                            Object.keys(
                                                                routeRegex.groups
                                                            ).filter(function (
                                                                param
                                                            ) {
                                                                return !query[
                                                                    param
                                                                ];
                                                            });
                                                        if (
                                                            !(
                                                                missingParams.length >
                                                                    0 &&
                                                                !isMiddlewareMatch
                                                            )
                                                        ) {
                                                            _ctx.next = 108;
                                                            break;
                                                        }
                                                        if (false) {
                                                        }
                                                        throw new Error(
                                                            (shouldInterpolate
                                                                ? "The provided `href` ("
                                                                      .concat(
                                                                          url,
                                                                          ") value is missing query values ("
                                                                      )
                                                                      .concat(
                                                                          missingParams.join(
                                                                              ", "
                                                                          ),
                                                                          ") to be interpolated properly. "
                                                                      )
                                                                : "The provided `as` value ("
                                                                      .concat(
                                                                          asPathname,
                                                                          ") is incompatible with the `href` value ("
                                                                      )
                                                                      .concat(
                                                                          route,
                                                                          "). "
                                                                      )) +
                                                                "Read more: https://nextjs.org/docs/messages/".concat(
                                                                    shouldInterpolate
                                                                        ? "href-interpolation-failed"
                                                                        : "incompatible-href-as"
                                                                )
                                                        );
                                                    case 108:
                                                        _ctx.next = 111;
                                                        break;
                                                    case 110:
                                                        if (shouldInterpolate) {
                                                            as = (0,
                                                            _formatUrl).formatWithValidation(
                                                                Object.assign(
                                                                    {},
                                                                    parsedAs1,
                                                                    {
                                                                        pathname:
                                                                            interpolatedAs.result,
                                                                        query: omit(
                                                                            query,
                                                                            interpolatedAs.params
                                                                        ),
                                                                    }
                                                                )
                                                            );
                                                        } else {
                                                            // Merge params into `query`, overwriting any specified in search
                                                            Object.assign(
                                                                query,
                                                                routeMatch
                                                            );
                                                        }
                                                    case 111:
                                                        if (!isQueryUpdating) {
                                                            Router.events.emit(
                                                                "routeChangeStart",
                                                                as,
                                                                routeProps
                                                            );
                                                        }
                                                        _ctx.prev = 112;
                                                        _ctx.next = 116;
                                                        return _this.getRouteInfo(
                                                            {
                                                                route: route,
                                                                pathname:
                                                                    pathname,
                                                                query: query,
                                                                as: as,
                                                                resolvedAs:
                                                                    resolvedAs,
                                                                routeProps:
                                                                    routeProps,
                                                                locale: nextState.locale,
                                                                isPreview:
                                                                    nextState.isPreview,
                                                                hasMiddleware:
                                                                    isMiddlewareMatch,
                                                            }
                                                        );
                                                    case 116:
                                                        routeInfo = _ctx.sent;
                                                        if (
                                                            "route" in
                                                                routeInfo &&
                                                            isMiddlewareMatch
                                                        ) {
                                                            pathname =
                                                                routeInfo.route ||
                                                                route;
                                                            route = pathname;
                                                            query =
                                                                Object.assign(
                                                                    {},
                                                                    routeInfo.query ||
                                                                        {},
                                                                    query
                                                                );
                                                            if (
                                                                routeMatch &&
                                                                pathname !==
                                                                    parsed.pathname
                                                            ) {
                                                                Object.keys(
                                                                    routeMatch
                                                                ).forEach(
                                                                    function (
                                                                        key
                                                                    ) {
                                                                        if (
                                                                            routeMatch &&
                                                                            query[
                                                                                key
                                                                            ] ===
                                                                                routeMatch[
                                                                                    key
                                                                                ]
                                                                        ) {
                                                                            delete query[
                                                                                key
                                                                            ];
                                                                        }
                                                                    }
                                                                );
                                                            }
                                                            if (
                                                                (0,
                                                                _isDynamic).isDynamicRoute(
                                                                    pathname
                                                                )
                                                            ) {
                                                                prefixedAs =
                                                                    routeInfo.resolvedAs ||
                                                                    (0,
                                                                    _addBasePath).addBasePath(
                                                                        (0,
                                                                        _addLocale).addLocale(
                                                                            as,
                                                                            nextState.locale
                                                                        ),
                                                                        true
                                                                    );
                                                                rewriteAs =
                                                                    prefixedAs;
                                                                if (
                                                                    (0,
                                                                    _hasBasePath).hasBasePath(
                                                                        rewriteAs
                                                                    )
                                                                ) {
                                                                    rewriteAs =
                                                                        (0,
                                                                        _removeBasePath).removeBasePath(
                                                                            rewriteAs
                                                                        );
                                                                }
                                                                if (false) {
                                                                }
                                                                routeRegex1 =
                                                                    (0,
                                                                    _routeRegex).getRouteRegex(
                                                                        pathname
                                                                    );
                                                                curRouteMatch =
                                                                    (0,
                                                                    _routeMatcher).getRouteMatcher(
                                                                        routeRegex1
                                                                    )(
                                                                        rewriteAs
                                                                    );
                                                                if (
                                                                    curRouteMatch
                                                                ) {
                                                                    Object.assign(
                                                                        query,
                                                                        curRouteMatch
                                                                    );
                                                                }
                                                            }
                                                        }
                                                        if (
                                                            !(
                                                                "type" in
                                                                routeInfo
                                                            )
                                                        ) {
                                                            _ctx.next = 125;
                                                            break;
                                                        }
                                                        if (
                                                            !(
                                                                routeInfo.type ===
                                                                "redirect-internal"
                                                            )
                                                        ) {
                                                            _ctx.next = 123;
                                                            break;
                                                        }
                                                        return _ctx.abrupt(
                                                            "return",
                                                            _this.change(
                                                                method,
                                                                routeInfo.newUrl,
                                                                routeInfo.newAs,
                                                                options
                                                            )
                                                        );
                                                    case 123:
                                                        handleHardNavigation({
                                                            url: routeInfo.destination,
                                                            router: _this,
                                                        });
                                                        return _ctx.abrupt(
                                                            "return",
                                                            new Promise(
                                                                function () {}
                                                            )
                                                        );
                                                    case 125:
                                                        (error =
                                                            routeInfo.error),
                                                            (props =
                                                                routeInfo.props),
                                                            (__N_SSG =
                                                                routeInfo.__N_SSG),
                                                            (__N_SSP =
                                                                routeInfo.__N_SSP);
                                                        component =
                                                            routeInfo.Component;
                                                        if (
                                                            component &&
                                                            component.unstable_scriptLoader
                                                        ) {
                                                            scripts = [].concat(
                                                                component.unstable_scriptLoader()
                                                            );
                                                            scripts.forEach(
                                                                function (
                                                                    script
                                                                ) {
                                                                    (0,
                                                                    _script).handleClientScriptLoad(
                                                                        script.props
                                                                    );
                                                                }
                                                            );
                                                        }
                                                        if (
                                                            !(
                                                                (__N_SSG ||
                                                                    __N_SSP) &&
                                                                props
                                                            )
                                                        ) {
                                                            _ctx.next = 156;
                                                            break;
                                                        }
                                                        if (
                                                            !(
                                                                props.pageProps &&
                                                                props.pageProps
                                                                    .__N_REDIRECT
                                                            )
                                                        ) {
                                                            _ctx.next = 139;
                                                            break;
                                                        }
                                                        // Use the destination from redirect without adding locale
                                                        options.locale = false;
                                                        destination =
                                                            props.pageProps
                                                                .__N_REDIRECT;
                                                        if (
                                                            !(
                                                                destination.startsWith(
                                                                    "/"
                                                                ) &&
                                                                props.pageProps
                                                                    .__N_REDIRECT_BASE_PATH !==
                                                                    false
                                                            )
                                                        ) {
                                                            _ctx.next = 137;
                                                            break;
                                                        }
                                                        parsedHref = (0,
                                                        _parseRelativeUrl).parseRelativeUrl(
                                                            destination
                                                        );
                                                        parsedHref.pathname =
                                                            resolveDynamicRoute(
                                                                parsedHref.pathname,
                                                                pages
                                                            );
                                                        (ref3 = prepareUrlAs(
                                                            _this,
                                                            destination,
                                                            destination
                                                        )),
                                                            (newUrl = ref3.url),
                                                            (newAs = ref3.as);
                                                        return _ctx.abrupt(
                                                            "return",
                                                            _this.change(
                                                                method,
                                                                newUrl,
                                                                newAs,
                                                                options
                                                            )
                                                        );
                                                    case 137:
                                                        handleHardNavigation({
                                                            url: destination,
                                                            router: _this,
                                                        });
                                                        return _ctx.abrupt(
                                                            "return",
                                                            new Promise(
                                                                function () {}
                                                            )
                                                        );
                                                    case 139:
                                                        nextState.isPreview =
                                                            !!props.__N_PREVIEW;
                                                        if (
                                                            !(
                                                                props.notFound ===
                                                                SSG_DATA_NOT_FOUND
                                                            )
                                                        ) {
                                                            _ctx.next = 156;
                                                            break;
                                                        }
                                                        _ctx.prev = 142;
                                                        _ctx.next = 145;
                                                        return _this.fetchComponent(
                                                            "/404"
                                                        );
                                                    case 145:
                                                        notFoundRoute = "/404";
                                                        _ctx.next = 151;
                                                        break;
                                                    case 148:
                                                        _ctx.prev = 148;
                                                        _ctx.t5 =
                                                            _ctx["catch"](142);
                                                        notFoundRoute =
                                                            "/_error";
                                                    case 151:
                                                        _ctx.next = 153;
                                                        return _this.getRouteInfo(
                                                            {
                                                                route: notFoundRoute,
                                                                pathname:
                                                                    notFoundRoute,
                                                                query: query,
                                                                as: as,
                                                                resolvedAs:
                                                                    resolvedAs,
                                                                routeProps: {
                                                                    shallow: false,
                                                                },
                                                                locale: nextState.locale,
                                                                isPreview:
                                                                    nextState.isPreview,
                                                            }
                                                        );
                                                    case 153:
                                                        routeInfo = _ctx.sent;
                                                        if (
                                                            !(
                                                                "type" in
                                                                routeInfo
                                                            )
                                                        ) {
                                                            _ctx.next = 156;
                                                            break;
                                                        }
                                                        throw new Error(
                                                            "Unexpected middleware effect on /404"
                                                        );
                                                    case 156:
                                                        Router.events.emit(
                                                            "beforeHistoryChange",
                                                            as,
                                                            routeProps
                                                        );
                                                        _this.changeState(
                                                            method,
                                                            url,
                                                            as,
                                                            options
                                                        );
                                                        if (
                                                            isQueryUpdating &&
                                                            pathname ===
                                                                "/_error" &&
                                                            ((ref11 =
                                                                self
                                                                    .__NEXT_DATA__
                                                                    .props) ==
                                                            null
                                                                ? void 0
                                                                : (ref21 =
                                                                      ref11.pageProps) ==
                                                                  null
                                                                ? void 0
                                                                : ref21.statusCode) ===
                                                                500 &&
                                                            (props == null
                                                                ? void 0
                                                                : props.pageProps)
                                                        ) {
                                                            // ensure statusCode is still correct for static 500 page
                                                            // when updating query information
                                                            props.pageProps.statusCode = 500;
                                                        }
                                                        isValidShallowRoute =
                                                            options.shallow &&
                                                            nextState.route ===
                                                                ((_route =
                                                                    routeInfo.route) !=
                                                                null
                                                                    ? _route
                                                                    : route);
                                                        shouldScroll =
                                                            (_scroll1 =
                                                                options.scroll) !=
                                                            null
                                                                ? _scroll1
                                                                : !isValidShallowRoute;
                                                        resetScroll =
                                                            shouldScroll
                                                                ? {
                                                                      x: 0,
                                                                      y: 0,
                                                                  }
                                                                : null;
                                                        _ctx.next = 166;
                                                        return _this
                                                            .set(
                                                                _object_spread_props(
                                                                    _object_spread(
                                                                        {},
                                                                        nextState
                                                                    ),
                                                                    {
                                                                        route: route,
                                                                        pathname:
                                                                            pathname,
                                                                        query: query,
                                                                        asPath: cleanedAs,
                                                                        isFallback: false,
                                                                    }
                                                                ),
                                                                routeInfo,
                                                                forcedScroll !=
                                                                    null
                                                                    ? forcedScroll
                                                                    : resetScroll
                                                            )
                                                            .catch(function (
                                                                e
                                                            ) {
                                                                if (e.cancelled)
                                                                    error =
                                                                        error ||
                                                                        e;
                                                                else throw e;
                                                            });
                                                    case 166:
                                                        if (!error) {
                                                            _ctx.next = 169;
                                                            break;
                                                        }
                                                        if (!isQueryUpdating) {
                                                            Router.events.emit(
                                                                "routeChangeError",
                                                                error,
                                                                cleanedAs,
                                                                routeProps
                                                            );
                                                        }
                                                        throw error;
                                                    case 169:
                                                        if (false) {
                                                        }
                                                        if (!isQueryUpdating) {
                                                            Router.events.emit(
                                                                "routeChangeComplete",
                                                                as,
                                                                routeProps
                                                            );
                                                        }
                                                        hashRegex = /#.+$/;
                                                        if (
                                                            shouldScroll &&
                                                            hashRegex.test(as)
                                                        ) {
                                                            _this.scrollToHash(
                                                                as
                                                            );
                                                        }
                                                        return _ctx.abrupt(
                                                            "return",
                                                            true
                                                        );
                                                    case 176:
                                                        _ctx.prev = 176;
                                                        _ctx.t6 =
                                                            _ctx["catch"](112);
                                                        if (
                                                            !(
                                                                (0,
                                                                _isError).default(
                                                                    _ctx.t6
                                                                ) &&
                                                                _ctx.t6
                                                                    .cancelled
                                                            )
                                                        ) {
                                                            _ctx.next = 180;
                                                            break;
                                                        }
                                                        return _ctx.abrupt(
                                                            "return",
                                                            false
                                                        );
                                                    case 180:
                                                        throw _ctx.t6;
                                                    case 181:
                                                    case "end":
                                                        return _ctx.stop();
                                                }
                                        },
                                        _callee,
                                        null,
                                        [
                                            [37, 42],
                                            [51, 63],
                                            [112, 176],
                                            [142, 148],
                                        ]
                                    );
                                })
                            )();
                        },
                    },
                    {
                        key: "changeState",
                        value: function changeState(method, url, as) {
                            var options =
                                arguments.length > 3 && arguments[3] !== void 0
                                    ? arguments[3]
                                    : {};
                            if (false) {
                            }
                            if (
                                method !== "pushState" ||
                                (0, _utils).getURL() !== as
                            ) {
                                this._shallow = options.shallow;
                                window.history[method](
                                    {
                                        url: url,
                                        as: as,
                                        options: options,
                                        __N: true,
                                        key: (this._key =
                                            method !== "pushState"
                                                ? this._key
                                                : createKey()),
                                    }, // Passing the empty string here should be safe against future changes to the method.
                                    // https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
                                    "",
                                    as
                                );
                            }
                        },
                    },
                    {
                        key: "handleRouteInfoError",
                        value: function handleRouteInfoError(
                            err,
                            pathname,
                            query,
                            as,
                            routeProps,
                            loadErrorFail
                        ) {
                            var _this = this;
                            return _async_to_generator(
                                _runtimeJs.default.mark(function _callee() {
                                    var Component,
                                        styleSheets,
                                        props,
                                        ref,
                                        routeInfo;
                                    return _runtimeJs.default.wrap(
                                        function _callee$(_ctx) {
                                            while (1)
                                                switch (
                                                    (_ctx.prev = _ctx.next)
                                                ) {
                                                    case 0:
                                                        console.error(err);
                                                        if (!err.cancelled) {
                                                            _ctx.next = 3;
                                                            break;
                                                        }
                                                        // bubble up cancellation errors
                                                        throw err;
                                                    case 3:
                                                        if (
                                                            !(
                                                                (0,
                                                                _routeLoader).isAssetError(
                                                                    err
                                                                ) ||
                                                                loadErrorFail
                                                            )
                                                        ) {
                                                            _ctx.next = 7;
                                                            break;
                                                        }
                                                        Router.events.emit(
                                                            "routeChangeError",
                                                            err,
                                                            as,
                                                            routeProps
                                                        );
                                                        // If we can't load the page it could be one of following reasons
                                                        //  1. Page doesn't exists
                                                        //  2. Page does exist in a different zone
                                                        //  3. Internal error while loading the page
                                                        // So, doing a hard reload is the proper way to deal with this.
                                                        handleHardNavigation({
                                                            url: as,
                                                            router: _this,
                                                        });
                                                        // Changing the URL doesn't block executing the current code path.
                                                        // So let's throw a cancellation error stop the routing logic.
                                                        throw buildCancellationError();
                                                    case 7:
                                                        _ctx.prev = 7;
                                                        if (
                                                            !(
                                                                typeof Component ===
                                                                    "undefined" ||
                                                                typeof styleSheets ===
                                                                    "undefined"
                                                            )
                                                        ) {
                                                            _ctx.next = 19;
                                                            break;
                                                        }
                                                        _ctx.next = 15;
                                                        return _this.fetchComponent(
                                                            "/_error"
                                                        );
                                                    case 15:
                                                        ref = _ctx.sent;
                                                        Component = ref.page;
                                                        styleSheets =
                                                            ref.styleSheets;
                                                        ref;
                                                    case 19:
                                                        routeInfo = {
                                                            props: props,
                                                            Component:
                                                                Component,
                                                            styleSheets:
                                                                styleSheets,
                                                            err: err,
                                                            error: err,
                                                        };
                                                        if (routeInfo.props) {
                                                            _ctx.next = 31;
                                                            break;
                                                        }
                                                        _ctx.prev = 21;
                                                        _ctx.next = 24;
                                                        return _this.getInitialProps(
                                                            Component,
                                                            {
                                                                err: err,
                                                                pathname:
                                                                    pathname,
                                                                query: query,
                                                            }
                                                        );
                                                    case 24:
                                                        routeInfo.props =
                                                            _ctx.sent;
                                                        _ctx.next = 31;
                                                        break;
                                                    case 27:
                                                        _ctx.prev = 27;
                                                        _ctx.t0 =
                                                            _ctx["catch"](21);
                                                        console.error(
                                                            "Error in error page `getInitialProps`: ",
                                                            _ctx.t0
                                                        );
                                                        routeInfo.props = {};
                                                    case 31:
                                                        return _ctx.abrupt(
                                                            "return",
                                                            routeInfo
                                                        );
                                                    case 34:
                                                        _ctx.prev = 34;
                                                        _ctx.t1 =
                                                            _ctx["catch"](7);
                                                        return _ctx.abrupt(
                                                            "return",
                                                            _this.handleRouteInfoError(
                                                                (0,
                                                                _isError).default(
                                                                    _ctx.t1
                                                                )
                                                                    ? _ctx.t1
                                                                    : new Error(
                                                                          _ctx.t1 +
                                                                              ""
                                                                      ),
                                                                pathname,
                                                                query,
                                                                as,
                                                                routeProps,
                                                                true
                                                            )
                                                        );
                                                    case 37:
                                                    case "end":
                                                        return _ctx.stop();
                                                }
                                        },
                                        _callee,
                                        null,
                                        [
                                            [7, 34],
                                            [21, 27],
                                        ]
                                    );
                                })
                            )();
                        },
                    },
                    {
                        key: "getRouteInfo",
                        value: function getRouteInfo(param) {
                            var requestedRoute = param.route,
                                pathname = param.pathname,
                                query = param.query,
                                as = param.as,
                                resolvedAs = param.resolvedAs,
                                routeProps = param.routeProps,
                                locale = param.locale,
                                hasMiddleware = param.hasMiddleware,
                                isPreview = param.isPreview,
                                unstable_skipClientCache =
                                    param.unstable_skipClientCache;
                            var _this = this;
                            return _async_to_generator(
                                _runtimeJs.default.mark(function _callee() {
                                    var route,
                                        ref,
                                        ref3,
                                        ref4,
                                        handleCancelled,
                                        existingInfo,
                                        cachedRouteInfo,
                                        fetchNextDataParams,
                                        data,
                                        routeInfo,
                                        isValidElementType,
                                        useStreamedFlightData,
                                        shouldFetchData,
                                        props,
                                        cacheKey;
                                    return _runtimeJs.default.wrap(
                                        function _callee$(_ctx) {
                                            while (1)
                                                switch (
                                                    (_ctx.prev = _ctx.next)
                                                ) {
                                                    case 0:
                                                        route = requestedRoute;
                                                        _ctx.prev = 1;
                                                        handleCancelled =
                                                            getCancelledHandler(
                                                                {
                                                                    route: route,
                                                                    router: _this,
                                                                }
                                                            );
                                                        existingInfo =
                                                            _this.components[
                                                                route
                                                            ];
                                                        if (
                                                            !(
                                                                !hasMiddleware &&
                                                                routeProps.shallow &&
                                                                existingInfo &&
                                                                _this.route ===
                                                                    route
                                                            )
                                                        ) {
                                                            _ctx.next = 7;
                                                            break;
                                                        }
                                                        return _ctx.abrupt(
                                                            "return",
                                                            existingInfo
                                                        );
                                                    case 7:
                                                        cachedRouteInfo =
                                                            existingInfo &&
                                                            !(
                                                                "initial" in
                                                                existingInfo
                                                            ) &&
                                                            "production" !==
                                                                "development"
                                                                ? existingInfo
                                                                : undefined;
                                                        fetchNextDataParams = {
                                                            dataHref:
                                                                _this.pageLoader.getDataHref(
                                                                    {
                                                                        href: (0,
                                                                        _formatUrl).formatWithValidation(
                                                                            {
                                                                                pathname:
                                                                                    pathname,
                                                                                query: query,
                                                                            }
                                                                        ),
                                                                        skipInterpolation: true,
                                                                        asPath: resolvedAs,
                                                                        locale: locale,
                                                                    }
                                                                ),
                                                            hasMiddleware: true,
                                                            isServerRender:
                                                                _this.isSsr,
                                                            parseJSON: true,
                                                            inflightCache:
                                                                _this.sdc,
                                                            persistCache:
                                                                !isPreview,
                                                            isPrefetch: false,
                                                            unstable_skipClientCache:
                                                                unstable_skipClientCache,
                                                        };
                                                        _ctx.next = 11;
                                                        return withMiddlewareEffects(
                                                            {
                                                                fetchData:
                                                                    function () {
                                                                        return fetchNextData(
                                                                            fetchNextDataParams
                                                                        );
                                                                    },
                                                                asPath: resolvedAs,
                                                                locale: locale,
                                                                router: _this,
                                                            }
                                                        );
                                                    case 11:
                                                        data = _ctx.sent;
                                                        handleCancelled();
                                                        if (
                                                            !(
                                                                (data == null
                                                                    ? void 0
                                                                    : (ref =
                                                                          data.effect) ==
                                                                      null
                                                                    ? void 0
                                                                    : ref.type) ===
                                                                    "redirect-internal" ||
                                                                (data == null
                                                                    ? void 0
                                                                    : (ref3 =
                                                                          data.effect) ==
                                                                      null
                                                                    ? void 0
                                                                    : ref3.type) ===
                                                                    "redirect-external"
                                                            )
                                                        ) {
                                                            _ctx.next = 15;
                                                            break;
                                                        }
                                                        return _ctx.abrupt(
                                                            "return",
                                                            data.effect
                                                        );
                                                    case 15:
                                                        if (
                                                            !(
                                                                (data == null
                                                                    ? void 0
                                                                    : (ref4 =
                                                                          data.effect) ==
                                                                      null
                                                                    ? void 0
                                                                    : ref4.type) ===
                                                                "rewrite"
                                                            )
                                                        ) {
                                                            _ctx.next = 25;
                                                            break;
                                                        }
                                                        route = (0,
                                                        _removeTrailingSlash).removeTrailingSlash(
                                                            data.effect
                                                                .resolvedHref
                                                        );
                                                        pathname =
                                                            data.effect
                                                                .resolvedHref;
                                                        query = _object_spread(
                                                            {},
                                                            query,
                                                            data.effect.parsedAs
                                                                .query
                                                        );
                                                        resolvedAs =
                                                            data.effect.parsedAs
                                                                .pathname;
                                                        // Check again the cache with the new destination.
                                                        existingInfo =
                                                            _this.components[
                                                                route
                                                            ];
                                                        if (
                                                            !(
                                                                routeProps.shallow &&
                                                                existingInfo &&
                                                                _this.route ===
                                                                    route &&
                                                                !hasMiddleware
                                                            )
                                                        ) {
                                                            _ctx.next = 24;
                                                            break;
                                                        }
                                                        // If we have a match with the current route due to rewrite,
                                                        // we can copy the existing information to the rewritten one.
                                                        // Then, we return the information along with the matched route.
                                                        _this.components[
                                                            requestedRoute
                                                        ] = _object_spread_props(
                                                            _object_spread(
                                                                {},
                                                                existingInfo
                                                            ),
                                                            {
                                                                route: route,
                                                            }
                                                        );
                                                        return _ctx.abrupt(
                                                            "return",
                                                            _object_spread_props(
                                                                _object_spread(
                                                                    {},
                                                                    existingInfo
                                                                ),
                                                                {
                                                                    route: route,
                                                                }
                                                            )
                                                        );
                                                    case 24:
                                                        cachedRouteInfo =
                                                            existingInfo &&
                                                            !(
                                                                "initial" in
                                                                existingInfo
                                                            ) &&
                                                            "production" !==
                                                                "development"
                                                                ? existingInfo
                                                                : undefined;
                                                    case 25:
                                                        if (
                                                            !(
                                                                route ===
                                                                    "/api" ||
                                                                route.startsWith(
                                                                    "/api/"
                                                                )
                                                            )
                                                        ) {
                                                            _ctx.next = 28;
                                                            break;
                                                        }
                                                        handleHardNavigation({
                                                            url: resolvedAs,
                                                            router: _this,
                                                        });
                                                        return _ctx.abrupt(
                                                            "return",
                                                            new Promise(
                                                                function () {}
                                                            )
                                                        );
                                                    case 28:
                                                        _ctx.t0 =
                                                            cachedRouteInfo;
                                                        if (_ctx.t0) {
                                                            _ctx.next = 33;
                                                            break;
                                                        }
                                                        _ctx.next = 32;
                                                        return _this
                                                            .fetchComponent(
                                                                route
                                                            )
                                                            .then(function (
                                                                res
                                                            ) {
                                                                return {
                                                                    Component:
                                                                        res.page,
                                                                    styleSheets:
                                                                        res.styleSheets,
                                                                    __N_SSG:
                                                                        res.mod
                                                                            .__N_SSG,
                                                                    __N_SSP:
                                                                        res.mod
                                                                            .__N_SSP,
                                                                    __N_RSC:
                                                                        !!res
                                                                            .mod
                                                                            .__next_rsc__,
                                                                };
                                                            });
                                                    case 32:
                                                        _ctx.t0 = _ctx.sent;
                                                    case 33:
                                                        routeInfo = _ctx.t0;
                                                        if (true) {
                                                            _ctx.next = 38;
                                                            break;
                                                        }
                                                        isValidElementType =
                                                            Object(
                                                                (function webpackMissingModule() {
                                                                    var e =
                                                                        new Error(
                                                                            "Cannot find module 'next/dist/compiled/react-is'"
                                                                        );
                                                                    e.code =
                                                                        "MODULE_NOT_FOUND";
                                                                    throw e;
                                                                })()
                                                            );
                                                        if (
                                                            isValidElementType(
                                                                routeInfo.Component
                                                            )
                                                        ) {
                                                            _ctx.next = 38;
                                                            break;
                                                        }
                                                        throw new Error(
                                                            'The default export is not a React Component in page: "'.concat(
                                                                pathname,
                                                                '"'
                                                            )
                                                        );
                                                    case 38:
                                                        useStreamedFlightData =
                                                            routeInfo.__N_RSC &&
                                                            (false ||
                                                                routeInfo.__N_SSP);
                                                        shouldFetchData =
                                                            routeInfo.__N_SSG ||
                                                            routeInfo.__N_SSP ||
                                                            routeInfo.__N_RSC;
                                                        _ctx.next = 42;
                                                        return _this._getData(
                                                            _async_to_generator(
                                                                _runtimeJs.default.mark(
                                                                    function _callee() {
                                                                        var json;
                                                                        return _runtimeJs.default.wrap(
                                                                            function _callee$(
                                                                                _ctx
                                                                            ) {
                                                                                while (
                                                                                    1
                                                                                )
                                                                                    switch (
                                                                                        (_ctx.prev =
                                                                                            _ctx.next)
                                                                                    ) {
                                                                                        case 0:
                                                                                            if (
                                                                                                !(
                                                                                                    shouldFetchData &&
                                                                                                    !useStreamedFlightData
                                                                                                )
                                                                                            ) {
                                                                                                _ctx.next = 8;
                                                                                                break;
                                                                                            }
                                                                                            _ctx.t0 =
                                                                                                data;
                                                                                            if (
                                                                                                _ctx.t0
                                                                                            ) {
                                                                                                _ctx.next = 6;
                                                                                                break;
                                                                                            }
                                                                                            _ctx.next = 5;
                                                                                            return fetchNextData(
                                                                                                {
                                                                                                    dataHref:
                                                                                                        _this.pageLoader.getDataHref(
                                                                                                            {
                                                                                                                href: (0,
                                                                                                                _formatUrl).formatWithValidation(
                                                                                                                    {
                                                                                                                        pathname:
                                                                                                                            pathname,
                                                                                                                        query: query,
                                                                                                                    }
                                                                                                                ),
                                                                                                                asPath: resolvedAs,
                                                                                                                locale: locale,
                                                                                                            }
                                                                                                        ),
                                                                                                    isServerRender:
                                                                                                        _this.isSsr,
                                                                                                    parseJSON: true,
                                                                                                    inflightCache:
                                                                                                        _this.sdc,
                                                                                                    persistCache:
                                                                                                        !isPreview,
                                                                                                    isPrefetch: false,
                                                                                                    unstable_skipClientCache:
                                                                                                        unstable_skipClientCache,
                                                                                                }
                                                                                            );
                                                                                        case 5:
                                                                                            _ctx.t0 =
                                                                                                _ctx.sent;
                                                                                        case 6:
                                                                                            json =
                                                                                                _ctx
                                                                                                    .t0
                                                                                                    .json;
                                                                                            return _ctx.abrupt(
                                                                                                "return",
                                                                                                {
                                                                                                    props: json,
                                                                                                }
                                                                                            );
                                                                                        case 8:
                                                                                            _ctx.t1 =
                                                                                                {};
                                                                                            _ctx.next = 11;
                                                                                            return _this.getInitialProps(
                                                                                                routeInfo.Component,
                                                                                                {
                                                                                                    pathname:
                                                                                                        pathname,
                                                                                                    query: query,
                                                                                                    asPath: as,
                                                                                                    locale: locale,
                                                                                                    locales:
                                                                                                        _this.locales,
                                                                                                    defaultLocale:
                                                                                                        _this.defaultLocale,
                                                                                                }
                                                                                            );
                                                                                        case 11:
                                                                                            _ctx.t2 =
                                                                                                _ctx.sent;
                                                                                            return _ctx.abrupt(
                                                                                                "return",
                                                                                                {
                                                                                                    headers:
                                                                                                        _ctx.t1,
                                                                                                    props: _ctx.t2,
                                                                                                }
                                                                                            );
                                                                                        case 13:
                                                                                        case "end":
                                                                                            return _ctx.stop();
                                                                                    }
                                                                            },
                                                                            _callee
                                                                        );
                                                                    }
                                                                )
                                                            )
                                                        );
                                                    case 42:
                                                        props = _ctx.sent.props;
                                                        // Only bust the data cache for SSP routes although
                                                        // middleware can skip cache per request with
                                                        // x-middleware-cache: no-cache as well
                                                        if (
                                                            routeInfo.__N_SSP &&
                                                            fetchNextDataParams.dataHref
                                                        ) {
                                                            cacheKey = new URL(
                                                                fetchNextDataParams.dataHref,
                                                                window.location.href
                                                            ).href;
                                                            delete _this.sdc[
                                                                cacheKey
                                                            ];
                                                        }
                                                        // we kick off a HEAD request in the background
                                                        // when a non-prefetch request is made to signal revalidation
                                                        if (
                                                            !_this.isPreview &&
                                                            routeInfo.__N_SSG &&
                                                            "production" !==
                                                                "development"
                                                        ) {
                                                            fetchNextData(
                                                                Object.assign(
                                                                    {},
                                                                    fetchNextDataParams,
                                                                    {
                                                                        isBackground: true,
                                                                        persistCache: false,
                                                                        inflightCache:
                                                                            backgroundCache,
                                                                    }
                                                                )
                                                            ).catch(
                                                                function () {}
                                                            );
                                                        }
                                                        if (
                                                            !routeInfo.__N_RSC
                                                        ) {
                                                            _ctx.next = 58;
                                                            break;
                                                        }
                                                        _ctx.t1 = Object;
                                                        _ctx.t2 =
                                                            props.pageProps;
                                                        if (
                                                            !useStreamedFlightData
                                                        ) {
                                                            _ctx.next = 54;
                                                            break;
                                                        }
                                                        _ctx.next = 51;
                                                        return _this._getData(
                                                            function () {
                                                                return _this._getFlightData(
                                                                    (0,
                                                                    _formatUrl).formatWithValidation(
                                                                        {
                                                                            query: _object_spread_props(
                                                                                _object_spread(
                                                                                    {},
                                                                                    query
                                                                                ),
                                                                                {
                                                                                    __flight__:
                                                                                        "1",
                                                                                }
                                                                            ),
                                                                            pathname:
                                                                                (0,
                                                                                _isDynamic).isDynamicRoute(
                                                                                    route
                                                                                )
                                                                                    ? interpolateAs(
                                                                                          pathname,
                                                                                          (0,
                                                                                          _parseRelativeUrl).parseRelativeUrl(
                                                                                              resolvedAs
                                                                                          )
                                                                                              .pathname,
                                                                                          query
                                                                                      )
                                                                                          .result
                                                                                    : pathname,
                                                                        }
                                                                    )
                                                                );
                                                            }
                                                        );
                                                    case 51:
                                                        _ctx.t3 =
                                                            _ctx.sent.data;
                                                        _ctx.next = 55;
                                                        break;
                                                    case 54:
                                                        _ctx.t3 =
                                                            props.__flight__;
                                                    case 55:
                                                        _ctx.t4 = _ctx.t3;
                                                        _ctx.t5 = {
                                                            __flight__: _ctx.t4,
                                                        };
                                                        props.pageProps =
                                                            _ctx.t1.assign.call(
                                                                _ctx.t1,
                                                                _ctx.t2,
                                                                _ctx.t5
                                                            );
                                                    case 58:
                                                        routeInfo.props = props;
                                                        routeInfo.route = route;
                                                        routeInfo.query = query;
                                                        routeInfo.resolvedAs =
                                                            resolvedAs;
                                                        _this.components[
                                                            route
                                                        ] = routeInfo;
                                                        // If the route was rewritten in the process of fetching data,
                                                        // we update the cache to allow hitting the same data for shallow requests.
                                                        if (
                                                            route !==
                                                            requestedRoute
                                                        ) {
                                                            _this.components[
                                                                requestedRoute
                                                            ] = _object_spread_props(
                                                                _object_spread(
                                                                    {},
                                                                    routeInfo
                                                                ),
                                                                {
                                                                    route: route,
                                                                }
                                                            );
                                                        }
                                                        return _ctx.abrupt(
                                                            "return",
                                                            routeInfo
                                                        );
                                                    case 67:
                                                        _ctx.prev = 67;
                                                        _ctx.t6 =
                                                            _ctx["catch"](1);
                                                        return _ctx.abrupt(
                                                            "return",
                                                            _this.handleRouteInfoError(
                                                                (0,
                                                                _isError).getProperError(
                                                                    _ctx.t6
                                                                ),
                                                                pathname,
                                                                query,
                                                                as,
                                                                routeProps
                                                            )
                                                        );
                                                    case 70:
                                                    case "end":
                                                        return _ctx.stop();
                                                }
                                        },
                                        _callee,
                                        null,
                                        [[1, 67]]
                                    );
                                })
                            )();
                        },
                    },
                    {
                        key: "set",
                        value: function set(state, data, resetScroll) {
                            this.state = state;
                            return this.sub(
                                data,
                                this.components["/_app"].Component,
                                resetScroll
                            );
                        },
                    },
                    {
                        /**
                         * Callback to execute before replacing router state
                         * @param cb callback to be executed
                         */ key: "beforePopState",
                        value: function beforePopState(cb) {
                            this._bps = cb;
                        },
                    },
                    {
                        key: "onlyAHashChange",
                        value: function onlyAHashChange(as) {
                            if (!this.asPath) return false;
                            var ref = _sliced_to_array(
                                    this.asPath.split("#"),
                                    2
                                ),
                                oldUrlNoHash = ref[0],
                                oldHash = ref[1];
                            var ref1 = _sliced_to_array(as.split("#"), 2),
                                newUrlNoHash = ref1[0],
                                newHash = ref1[1];
                            // Makes sure we scroll to the provided hash if the url/hash are the same
                            if (
                                newHash &&
                                oldUrlNoHash === newUrlNoHash &&
                                oldHash === newHash
                            ) {
                                return true;
                            }
                            // If the urls are change, there's more than a hash change
                            if (oldUrlNoHash !== newUrlNoHash) {
                                return false;
                            }
                            // If the hash has changed, then it's a hash only change.
                            // This check is necessary to handle both the enter and
                            // leave hash === '' cases. The identity case falls through
                            // and is treated as a next reload.
                            return oldHash !== newHash;
                        },
                    },
                    {
                        key: "scrollToHash",
                        value: function scrollToHash(as) {
                            var ref = _sliced_to_array(as.split("#"), 2),
                                tmp = ref[1],
                                hash = tmp === void 0 ? "" : tmp;
                            // Scroll to top if the hash is just `#` with no value or `#top`
                            // To mirror browsers
                            if (hash === "" || hash === "top") {
                                window.scrollTo(0, 0);
                                return;
                            }
                            // Decode hash to make non-latin anchor works.
                            var rawHash = decodeURIComponent(hash);
                            // First we check if the element by id is found
                            var idEl = document.getElementById(rawHash);
                            if (idEl) {
                                idEl.scrollIntoView();
                                return;
                            }
                            // If there's no element with the id, we check the `name` property
                            // To mirror browsers
                            var nameEl = document.getElementsByName(rawHash)[0];
                            if (nameEl) {
                                nameEl.scrollIntoView();
                            }
                        },
                    },
                    {
                        key: "urlIsNew",
                        value: function urlIsNew(asPath) {
                            return this.asPath !== asPath;
                        },
                    },
                    {
                        key: "prefetch",
                        value: /**
                         * Prefetch page code, you may wait for the data during page rendering.
                         * This feature only works in production!
                         * @param url the href of prefetched page
                         * @param asPath the as path of the prefetched page
                         */ function prefetch(url) {
                            var asPath =
                                    arguments.length > 1 &&
                                    arguments[1] !== void 0
                                        ? arguments[1]
                                        : url,
                                options =
                                    arguments.length > 2 &&
                                    arguments[2] !== void 0
                                        ? arguments[2]
                                        : {};
                            var _this = this;
                            return _async_to_generator(
                                _runtimeJs.default.mark(function _callee() {
                                    var parsed,
                                        pathname,
                                        query,
                                        parsedAs,
                                        localePathResult,
                                        pages,
                                        resolvedAs,
                                        locale,
                                        isMiddlewareMatch,
                                        rewrites,
                                        ref,
                                        rewritesResult,
                                        data,
                                        route;
                                    return _runtimeJs.default.wrap(
                                        function _callee$(_ctx) {
                                            while (1)
                                                switch (
                                                    (_ctx.prev = _ctx.next)
                                                ) {
                                                    case 0:
                                                        parsed = (0,
                                                        _parseRelativeUrl).parseRelativeUrl(
                                                            url
                                                        );
                                                        (pathname =
                                                            parsed.pathname),
                                                            (query =
                                                                parsed.query);
                                                        if (false) {
                                                        }
                                                        _ctx.next = 5;
                                                        return _this.pageLoader.getPageList();
                                                    case 5:
                                                        pages = _ctx.sent;
                                                        resolvedAs = asPath;
                                                        locale =
                                                            typeof options.locale !==
                                                            "undefined"
                                                                ? options.locale ||
                                                                  undefined
                                                                : _this.locale;
                                                        _ctx.next = 10;
                                                        return matchesMiddleware(
                                                            {
                                                                asPath: asPath,
                                                                locale: locale,
                                                                router: _this,
                                                            }
                                                        );
                                                    case 10:
                                                        isMiddlewareMatch =
                                                            _ctx.sent;
                                                        if (true) {
                                                            _ctx.next = 24;
                                                            break;
                                                        }
                                                        _ctx.next = 16;
                                                        return (0,
                                                        _routeLoader).getClientBuildManifest();
                                                    case 16:
                                                        ref = _ctx.sent;
                                                        rewrites =
                                                            ref.__rewrites;
                                                        ref;
                                                        rewritesResult = (0,
                                                        _resolveRewrites).default(
                                                            (0,
                                                            _addBasePath).addBasePath(
                                                                (0,
                                                                _addLocale).addLocale(
                                                                    asPath,
                                                                    _this.locale
                                                                ),
                                                                true
                                                            ),
                                                            pages,
                                                            rewrites,
                                                            parsed.query,
                                                            function (p) {
                                                                return resolveDynamicRoute(
                                                                    p,
                                                                    pages
                                                                );
                                                            },
                                                            _this.locales
                                                        );
                                                        if (
                                                            !rewritesResult.externalDest
                                                        ) {
                                                            _ctx.next = 22;
                                                            break;
                                                        }
                                                        return _ctx.abrupt(
                                                            "return"
                                                        );
                                                    case 22:
                                                        resolvedAs = (0,
                                                        _removeLocale).removeLocale(
                                                            (0,
                                                            _removeBasePath).removeBasePath(
                                                                rewritesResult.asPath
                                                            ),
                                                            _this.locale
                                                        );
                                                        if (
                                                            rewritesResult.matchedPage &&
                                                            rewritesResult.resolvedHref
                                                        ) {
                                                            // if this directly matches a page we need to update the href to
                                                            // allow the correct page chunk to be loaded
                                                            pathname =
                                                                rewritesResult.resolvedHref;
                                                            parsed.pathname =
                                                                pathname;
                                                            if (
                                                                !isMiddlewareMatch
                                                            ) {
                                                                url = (0,
                                                                _formatUrl).formatWithValidation(
                                                                    parsed
                                                                );
                                                            }
                                                        }
                                                    case 24:
                                                        parsed.pathname =
                                                            resolveDynamicRoute(
                                                                parsed.pathname,
                                                                pages
                                                            );
                                                        if (
                                                            (0,
                                                            _isDynamic).isDynamicRoute(
                                                                parsed.pathname
                                                            )
                                                        ) {
                                                            pathname =
                                                                parsed.pathname;
                                                            parsed.pathname =
                                                                pathname;
                                                            Object.assign(
                                                                query,
                                                                (0,
                                                                _routeMatcher).getRouteMatcher(
                                                                    (0,
                                                                    _routeRegex).getRouteRegex(
                                                                        parsed.pathname
                                                                    )
                                                                )(
                                                                    (0,
                                                                    _parsePath).parsePath(
                                                                        asPath
                                                                    ).pathname
                                                                ) || {}
                                                            );
                                                            if (
                                                                !isMiddlewareMatch
                                                            ) {
                                                                url = (0,
                                                                _formatUrl).formatWithValidation(
                                                                    parsed
                                                                );
                                                            }
                                                        }
                                                        if (true) {
                                                            _ctx.next = 28;
                                                            break;
                                                        }
                                                        return _ctx.abrupt(
                                                            "return"
                                                        );
                                                    case 28:
                                                        _ctx.next = 30;
                                                        return withMiddlewareEffects(
                                                            {
                                                                fetchData:
                                                                    function () {
                                                                        return fetchNextData(
                                                                            {
                                                                                dataHref:
                                                                                    _this.pageLoader.getDataHref(
                                                                                        {
                                                                                            href: (0,
                                                                                            _formatUrl).formatWithValidation(
                                                                                                {
                                                                                                    pathname:
                                                                                                        pathname,
                                                                                                    query: query,
                                                                                                }
                                                                                            ),
                                                                                            skipInterpolation: true,
                                                                                            asPath: resolvedAs,
                                                                                            locale: locale,
                                                                                        }
                                                                                    ),
                                                                                hasMiddleware: true,
                                                                                isServerRender:
                                                                                    _this.isSsr,
                                                                                parseJSON: true,
                                                                                inflightCache:
                                                                                    _this.sdc,
                                                                                persistCache:
                                                                                    !_this.isPreview,
                                                                                isPrefetch: true,
                                                                            }
                                                                        );
                                                                    },
                                                                asPath: asPath,
                                                                locale: locale,
                                                                router: _this,
                                                            }
                                                        );
                                                    case 30:
                                                        data = _ctx.sent;
                                                        /**
                                                         * If there was a rewrite we apply the effects of the rewrite on the
                                                         * current parameters for the prefetch.
                                                         */ if (
                                                            (data == null
                                                                ? void 0
                                                                : data.effect
                                                                      .type) ===
                                                            "rewrite"
                                                        ) {
                                                            parsed.pathname =
                                                                data.effect.resolvedHref;
                                                            pathname =
                                                                data.effect
                                                                    .resolvedHref;
                                                            query =
                                                                _object_spread(
                                                                    {},
                                                                    query,
                                                                    data.effect
                                                                        .parsedAs
                                                                        .query
                                                                );
                                                            resolvedAs =
                                                                data.effect
                                                                    .parsedAs
                                                                    .pathname;
                                                            url = (0,
                                                            _formatUrl).formatWithValidation(
                                                                parsed
                                                            );
                                                        }
                                                        if (
                                                            !(
                                                                (data == null
                                                                    ? void 0
                                                                    : data
                                                                          .effect
                                                                          .type) ===
                                                                "redirect-external"
                                                            )
                                                        ) {
                                                            _ctx.next = 34;
                                                            break;
                                                        }
                                                        return _ctx.abrupt(
                                                            "return"
                                                        );
                                                    case 34:
                                                        route = (0,
                                                        _removeTrailingSlash).removeTrailingSlash(
                                                            pathname
                                                        );
                                                        _ctx.next = 37;
                                                        return Promise.all([
                                                            _this.pageLoader
                                                                ._isSsg(route)
                                                                .then(function (
                                                                    isSsg
                                                                ) {
                                                                    return isSsg
                                                                        ? fetchNextData(
                                                                              {
                                                                                  dataHref:
                                                                                      (data ==
                                                                                      null
                                                                                          ? void 0
                                                                                          : data.dataHref) ||
                                                                                      _this.pageLoader.getDataHref(
                                                                                          {
                                                                                              href: url,
                                                                                              asPath: resolvedAs,
                                                                                              locale: locale,
                                                                                          }
                                                                                      ),
                                                                                  isServerRender: false,
                                                                                  parseJSON: true,
                                                                                  inflightCache:
                                                                                      _this.sdc,
                                                                                  persistCache:
                                                                                      !_this.isPreview,
                                                                                  isPrefetch: true,
                                                                                  unstable_skipClientCache:
                                                                                      options.unstable_skipClientCache ||
                                                                                      options.priority,
                                                                              }
                                                                          ).then(
                                                                              function () {
                                                                                  return false;
                                                                              }
                                                                          )
                                                                        : false;
                                                                }),
                                                            _this.pageLoader[
                                                                options.priority
                                                                    ? "loadPage"
                                                                    : "prefetch"
                                                            ](route),
                                                        ]);
                                                    case 37:
                                                    case "end":
                                                        return _ctx.stop();
                                                }
                                        },
                                        _callee
                                    );
                                })
                            )();
                        },
                    },
                    {
                        key: "fetchComponent",
                        value: function fetchComponent(route) {
                            var _this = this;
                            return _async_to_generator(
                                _runtimeJs.default.mark(function _callee() {
                                    var handleCancelled, componentResult;
                                    return _runtimeJs.default.wrap(
                                        function _callee$(_ctx) {
                                            while (1)
                                                switch (
                                                    (_ctx.prev = _ctx.next)
                                                ) {
                                                    case 0:
                                                        handleCancelled =
                                                            getCancelledHandler(
                                                                {
                                                                    route: route,
                                                                    router: _this,
                                                                }
                                                            );
                                                        _ctx.prev = 1;
                                                        _ctx.next = 4;
                                                        return _this.pageLoader.loadPage(
                                                            route
                                                        );
                                                    case 4:
                                                        componentResult =
                                                            _ctx.sent;
                                                        handleCancelled();
                                                        return _ctx.abrupt(
                                                            "return",
                                                            componentResult
                                                        );
                                                    case 9:
                                                        _ctx.prev = 9;
                                                        _ctx.t0 =
                                                            _ctx["catch"](1);
                                                        handleCancelled();
                                                        throw _ctx.t0;
                                                    case 13:
                                                    case "end":
                                                        return _ctx.stop();
                                                }
                                        },
                                        _callee,
                                        null,
                                        [[1, 9]]
                                    );
                                })
                            )();
                        },
                    },
                    {
                        key: "_getData",
                        value: function _getData(fn) {
                            var _this = this;
                            var cancelled = false;
                            var cancel = function () {
                                cancelled = true;
                            };
                            this.clc = cancel;
                            return fn().then(function (data) {
                                if (cancel === _this.clc) {
                                    _this.clc = null;
                                }
                                if (cancelled) {
                                    var err = new Error(
                                        "Loading initial props cancelled"
                                    );
                                    err.cancelled = true;
                                    throw err;
                                }
                                return data;
                            });
                        },
                    },
                    {
                        key: "_getFlightData",
                        value: function _getFlightData(dataHref) {
                            // Do not cache RSC flight response since it's not a static resource
                            return fetchNextData({
                                dataHref: dataHref,
                                isServerRender: true,
                                parseJSON: false,
                                inflightCache: this.sdc,
                                persistCache: false,
                                isPrefetch: false,
                            }).then(function (param) {
                                var text = param.text;
                                return {
                                    data: text,
                                };
                            });
                        },
                    },
                    {
                        key: "getInitialProps",
                        value: function getInitialProps(Component, ctx) {
                            var ref = this.components["/_app"],
                                App = ref.Component;
                            var AppTree = this._wrapApp(App);
                            ctx.AppTree = AppTree;
                            return (0, _utils).loadGetInitialProps(App, {
                                AppTree: AppTree,
                                Component: Component,
                                router: this,
                                ctx: ctx,
                            });
                        },
                    },
                    {
                        key: "route",
                        get: function get() {
                            return this.state.route;
                        },
                    },
                    {
                        key: "pathname",
                        get: function get() {
                            return this.state.pathname;
                        },
                    },
                    {
                        key: "query",
                        get: function get() {
                            return this.state.query;
                        },
                    },
                    {
                        key: "asPath",
                        get: function get() {
                            return this.state.asPath;
                        },
                    },
                    {
                        key: "locale",
                        get: function get() {
                            return this.state.locale;
                        },
                    },
                    {
                        key: "isFallback",
                        get: function get() {
                            return this.state.isFallback;
                        },
                    },
                    {
                        key: "isPreview",
                        get: function get() {
                            return this.state.isPreview;
                        },
                    },
                ]);
                return Router;
            })();
            _define_property(Router, "events", (0, _mitt).default());
            exports["default"] = Router;
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            function _getRequireWildcardCache() {
                if (typeof WeakMap !== "function") return null;
                var cache = new WeakMap();
                _getRequireWildcardCache = function _getRequireWildcardCache() {
                    return cache;
                };
                return cache;
            }
            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                }
                if (
                    obj === null ||
                    (typeof obj !== "object" && typeof obj !== "function")
                ) {
                    return {
                        default: obj,
                    };
                }
                var cache = _getRequireWildcardCache();
                if (cache && cache.has(obj)) {
                    return cache.get(obj);
                }
                var newObj = {};
                var hasPropertyDescriptor =
                    Object.defineProperty && Object.getOwnPropertyDescriptor;
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        var desc = hasPropertyDescriptor
                            ? Object.getOwnPropertyDescriptor(obj, key)
                            : null;
                        if (desc && (desc.get || desc.set)) {
                            Object.defineProperty(newObj, key, desc);
                        } else {
                            newObj[key] = obj[key];
                        }
                    }
                }
                newObj.default = obj;
                if (cache) {
                    cache.set(obj, newObj);
                }
                return newObj;
            }
            function buildCancellationError() {
                return Object.assign(new Error("Route Cancelled"), {
                    cancelled: true,
                });
            }
            function isLocalURL(url) {
                // prevent a hydration mismatch on href for url with anchor refs
                if (!(0, _utils).isAbsoluteUrl(url)) return true;
                try {
                    // absolute urls can be local if they are on the same origin
                    var locationOrigin = (0, _utils).getLocationOrigin();
                    var resolved = new URL(url, locationOrigin);
                    return (
                        resolved.origin === locationOrigin &&
                        (0, _hasBasePath).hasBasePath(resolved.pathname)
                    );
                } catch (_) {
                    return false;
                }
            }
            function interpolateAs(route, asPathname, query) {
                var interpolatedRoute = "";
                var dynamicRegex = (0, _routeRegex).getRouteRegex(route);
                var dynamicGroups = dynamicRegex.groups;
                var dynamicMatches =
                    (asPathname !== route
                        ? (0, _routeMatcher).getRouteMatcher(dynamicRegex)(
                              asPathname
                          )
                        : "") || // TODO: should this take priority; also need to change in the router.
                    query;
                interpolatedRoute = route;
                var params = Object.keys(dynamicGroups);
                if (
                    !params.every(function (param) {
                        var value = dynamicMatches[param] || "";
                        var _param = dynamicGroups[param],
                            repeat = _param.repeat,
                            optional = _param.optional;
                        // support single-level catch-all
                        // TODO: more robust handling for user-error (passing `/`)
                        var replaced = "["
                            .concat(repeat ? "..." : "")
                            .concat(param, "]");
                        if (optional) {
                            replaced = ""
                                .concat(!value ? "/" : "", "[")
                                .concat(replaced, "]");
                        }
                        if (repeat && !Array.isArray(value)) value = [value];
                        return (
                            (optional || param in dynamicMatches) &&
                            (interpolatedRoute =
                                interpolatedRoute.replace(
                                    replaced,
                                    repeat
                                        ? value
                                              .map(
                                                  // path delimiter escaped since they are being inserted
                                                  // into the URL and we expect URL encoded segments
                                                  // when parsing dynamic route params
                                                  function (segment) {
                                                      return encodeURIComponent(
                                                          segment
                                                      );
                                                  }
                                              )
                                              .join("/")
                                        : encodeURIComponent(value)
                                ) || "/")
                        );
                    })
                ) {
                    interpolatedRoute = ""; // did not satisfy all requirements
                    // n.b. We ignore this error because we handle warning for this case in
                    // development in the `<Link>` component directly.
                }
                return {
                    params: params,
                    result: interpolatedRoute,
                };
            }
            function omit(object, keys) {
                var omitted = {};
                Object.keys(object).forEach(function (key) {
                    if (!keys.includes(key)) {
                        omitted[key] = object[key];
                    }
                });
                return omitted;
            }
            function resolveHref(router, href, resolveAs) {
                // we use a dummy base url for relative urls
                var base;
                var urlAsString =
                    typeof href === "string"
                        ? href
                        : (0, _formatUrl).formatWithValidation(href);
                // repeated slashes and backslashes in the URL are considered
                // invalid and will never match a Next.js page/file
                var urlProtoMatch = urlAsString.match(/^[a-zA-Z]{1,}:\/\//);
                var urlAsStringNoProto = urlProtoMatch
                    ? urlAsString.slice(urlProtoMatch[0].length)
                    : urlAsString;
                var urlParts = urlAsStringNoProto.split("?");
                if ((urlParts[0] || "").match(/(\/\/|\\)/)) {
                    console.error(
                        "Invalid href passed to next/router: ".concat(
                            urlAsString,
                            ", repeated forward-slashes (//) or backslashes \\ are not valid in the href"
                        )
                    );
                    var normalizedUrl = (0, _utils).normalizeRepeatedSlashes(
                        urlAsStringNoProto
                    );
                    urlAsString =
                        (urlProtoMatch ? urlProtoMatch[0] : "") + normalizedUrl;
                }
                // Return because it cannot be routed by the Next.js router
                if (!isLocalURL(urlAsString)) {
                    return resolveAs ? [urlAsString] : urlAsString;
                }
                try {
                    base = new URL(
                        urlAsString.startsWith("#")
                            ? router.asPath
                            : router.pathname,
                        "http://n"
                    );
                } catch (_) {
                    // fallback to / for invalid asPath values e.g. //
                    base = new URL("/", "http://n");
                }
                try {
                    var finalUrl = new URL(urlAsString, base);
                    finalUrl.pathname = (0,
                    _normalizeTrailingSlash).normalizePathTrailingSlash(
                        finalUrl.pathname
                    );
                    var interpolatedAs = "";
                    if (
                        (0, _isDynamic).isDynamicRoute(finalUrl.pathname) &&
                        finalUrl.searchParams &&
                        resolveAs
                    ) {
                        var query = (0, _querystring).searchParamsToUrlQuery(
                            finalUrl.searchParams
                        );
                        var ref = interpolateAs(
                                finalUrl.pathname,
                                finalUrl.pathname,
                                query
                            ),
                            result = ref.result,
                            params = ref.params;
                        if (result) {
                            interpolatedAs = (0,
                            _formatUrl).formatWithValidation({
                                pathname: result,
                                hash: finalUrl.hash,
                                query: omit(query, params),
                            });
                        }
                    }
                    // if the origin didn't change, it means we received a relative href
                    var resolvedHref =
                        finalUrl.origin === base.origin
                            ? finalUrl.href.slice(finalUrl.origin.length)
                            : finalUrl.href;
                    return resolveAs
                        ? [resolvedHref, interpolatedAs || resolvedHref]
                        : resolvedHref;
                } catch (_1) {
                    return resolveAs ? [urlAsString] : urlAsString;
                }
            }
            function stripOrigin(url) {
                var origin = (0, _utils).getLocationOrigin();
                return url.startsWith(origin)
                    ? url.substring(origin.length)
                    : url;
            }
            function prepareUrlAs(router, url, as) {
                // If url and as provided as an object representation,
                // we'll format them into the string version here.
                var ref = _sliced_to_array(resolveHref(router, url, true), 2),
                    resolvedHref = ref[0],
                    resolvedAs = ref[1];
                var origin = (0, _utils).getLocationOrigin();
                var hrefHadOrigin = resolvedHref.startsWith(origin);
                var asHadOrigin = resolvedAs && resolvedAs.startsWith(origin);
                resolvedHref = stripOrigin(resolvedHref);
                resolvedAs = resolvedAs ? stripOrigin(resolvedAs) : resolvedAs;
                var preparedUrl = hrefHadOrigin
                    ? resolvedHref
                    : (0, _addBasePath).addBasePath(resolvedHref);
                var preparedAs = as
                    ? stripOrigin(resolveHref(router, as))
                    : resolvedAs || resolvedHref;
                return {
                    url: preparedUrl,
                    as: asHadOrigin
                        ? preparedAs
                        : (0, _addBasePath).addBasePath(preparedAs),
                };
            }
            function resolveDynamicRoute(pathname, pages) {
                var cleanPathname = (0,
                _removeTrailingSlash).removeTrailingSlash(
                    (0, _denormalizePagePath).denormalizePagePath(pathname)
                );
                if (cleanPathname === "/404" || cleanPathname === "/_error") {
                    return pathname;
                }
                // handle resolving href for dynamic routes
                if (!pages.includes(cleanPathname)) {
                    // eslint-disable-next-line array-callback-return
                    pages.some(function (page) {
                        if (
                            (0, _isDynamic).isDynamicRoute(page) &&
                            (0, _routeRegex)
                                .getRouteRegex(page)
                                .re.test(cleanPathname)
                        ) {
                            pathname = page;
                            return true;
                        }
                    });
                }
                return (0, _removeTrailingSlash).removeTrailingSlash(pathname);
            }
            var manualScrollRestoration =
                /* unused pure expression or super */ null && false && 0;
            var SSG_DATA_NOT_FOUND = Symbol("SSG_DATA_NOT_FOUND");
            function fetchRetry(url, attempts, options) {
                return fetch(url, {
                    // Cookies are required to be present for Next.js' SSG "Preview Mode".
                    // Cookies may also be required for `getServerSideProps`.
                    //
                    // > `fetch` won’t send cookies, unless you set the credentials init
                    // > option.
                    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
                    //
                    // > For maximum browser compatibility when it comes to sending &
                    // > receiving cookies, always supply the `credentials: 'same-origin'`
                    // > option instead of relying on the default.
                    // https://github.com/github/fetch#caveats
                    credentials: "same-origin",
                    method: options.method || "GET",
                    headers: Object.assign({}, options.headers, {
                        "x-nextjs-data": "1",
                    }),
                }).then(function (response) {
                    return !response.ok &&
                        attempts > 1 &&
                        response.status >= 500
                        ? fetchRetry(url, attempts - 1, options)
                        : response;
                });
            }
            var backgroundCache = {};
            function fetchNextData(param) {
                var dataHref = param.dataHref,
                    inflightCache = param.inflightCache,
                    isPrefetch = param.isPrefetch,
                    hasMiddleware = param.hasMiddleware,
                    isServerRender = param.isServerRender,
                    parseJSON = param.parseJSON,
                    persistCache = param.persistCache,
                    isBackground = param.isBackground,
                    unstable_skipClientCache = param.unstable_skipClientCache;
                var ref = new URL(dataHref, window.location.href),
                    cacheKey = ref.href;
                var ref5;
                var getData = function (params) {
                    return fetchRetry(dataHref, isServerRender ? 3 : 1, {
                        headers: isPrefetch
                            ? {
                                  purpose: "prefetch",
                              }
                            : {},
                        method:
                            (ref5 = params == null ? void 0 : params.method) !=
                            null
                                ? ref5
                                : "GET",
                    })
                        .then(function (response) {
                            if (
                                response.ok &&
                                (params == null ? void 0 : params.method) ===
                                    "HEAD"
                            ) {
                                return {
                                    dataHref: dataHref,
                                    response: response,
                                    text: "",
                                    json: {},
                                };
                            }
                            return response.text().then(function (text) {
                                if (!response.ok) {
                                    /**
                                     * When the data response is a redirect because of a middleware
                                     * we do not consider it an error. The headers must bring the
                                     * mapped location.
                                     * TODO: Change the status code in the handler.
                                     */ if (
                                        hasMiddleware &&
                                        [301, 302, 307, 308].includes(
                                            response.status
                                        )
                                    ) {
                                        return {
                                            dataHref: dataHref,
                                            response: response,
                                            text: text,
                                            json: {},
                                        };
                                    }
                                    if (response.status === 404) {
                                        var ref;
                                        if (
                                            (ref = tryToParseAsJSON(text)) ==
                                            null
                                                ? void 0
                                                : ref.notFound
                                        ) {
                                            return {
                                                dataHref: dataHref,
                                                json: {
                                                    notFound:
                                                        SSG_DATA_NOT_FOUND,
                                                },
                                                response: response,
                                                text: text,
                                            };
                                        }
                                        /**
                                         * If there is a 404 that is not for SSG we used to fail but if
                                         * there is a middleware we must respond with an empty object.
                                         * For now we will return the data when there is a middleware.
                                         * TODO: Update the server to success on these requests.
                                         */ if (hasMiddleware) {
                                            return {
                                                dataHref: dataHref,
                                                response: response,
                                                text: text,
                                                json: {},
                                            };
                                        }
                                    }
                                    var error = new Error(
                                        "Failed to load static props"
                                    );
                                    /**
                                     * We should only trigger a server-side transition if this was
                                     * caused on a client-side transition. Otherwise, we'd get into
                                     * an infinite loop.
                                     */ if (!isServerRender) {
                                        (0, _routeLoader).markAssetError(error);
                                    }
                                    throw error;
                                }
                                return {
                                    dataHref: dataHref,
                                    json: parseJSON
                                        ? tryToParseAsJSON(text)
                                        : {},
                                    response: response,
                                    text: text,
                                };
                            });
                        })
                        .then(function (data) {
                            if (
                                !persistCache ||
                                "production" !== "production" ||
                                data.response.headers.get(
                                    "x-middleware-cache"
                                ) === "no-cache"
                            ) {
                                delete inflightCache[cacheKey];
                            }
                            return data;
                        })
                        .catch(function (err) {
                            delete inflightCache[cacheKey];
                            throw err;
                        });
                };
                // when skipping client cache we wait to update
                // inflight cache until successful data response
                // this allows racing click event with fetching newer data
                // without blocking navigation when stale data is available
                if (unstable_skipClientCache && persistCache) {
                    return getData({}).then(function (data) {
                        inflightCache[cacheKey] = Promise.resolve(data);
                        return data;
                    });
                }
                if (inflightCache[cacheKey] !== undefined) {
                    return inflightCache[cacheKey];
                }
                return (inflightCache[cacheKey] = getData(
                    isBackground
                        ? {
                              method: "HEAD",
                          }
                        : {}
                ));
            }
            function tryToParseAsJSON(text) {
                try {
                    return JSON.parse(text);
                } catch (error) {
                    return {};
                }
            }
            function createKey() {
                return Math.random().toString(36).slice(2, 10);
            }
            function handleHardNavigation(param) {
                var url = param.url,
                    router = param.router;
                // ensure we don't trigger a hard navigation to the same
                // URL as this can end up with an infinite refresh
                if (
                    url ===
                    (0, _addBasePath).addBasePath(
                        (0, _addLocale).addLocale(router.asPath, router.locale)
                    )
                ) {
                    throw new Error(
                        "Invariant: attempted to hard navigate to the same URL "
                            .concat(url, " ")
                            .concat(location.href)
                    );
                }
                window.location.href = url;
            }
            var getCancelledHandler = function (param) {
                var route = param.route,
                    router = param.router;
                var cancelled = false;
                var cancel = (router.clc = function () {
                    cancelled = true;
                });
                var handleCancelled = function () {
                    if (cancelled) {
                        var error = new Error(
                            'Abort fetching component for route: "'.concat(
                                route,
                                '"'
                            )
                        );
                        error.cancelled = true;
                        throw error;
                    }
                    if (cancel === router.clc) {
                        router.clc = null;
                    }
                };
                return handleCancelled;
            };
            function matchesMiddleware(options) {
                return Promise.resolve(
                    options.router.pageLoader.getMiddlewareList()
                ).then(function (items) {
                    var ref = (0, _parsePath).parsePath(options.asPath),
                        asPathname = ref.pathname;
                    var cleanedAs = (0, _hasBasePath).hasBasePath(asPathname)
                        ? (0, _removeBasePath).removeBasePath(asPathname)
                        : asPathname;
                    return !!(items == null
                        ? void 0
                        : items.some(function (param) {
                              var _param = _sliced_to_array(param, 2),
                                  regex = _param[0],
                                  ssr = _param[1];
                              return (
                                  !ssr &&
                                  new RegExp(regex).test(
                                      (0, _addLocale).addLocale(
                                          cleanedAs,
                                          options.locale
                                      )
                                  )
                              );
                          }));
                });
            }
            function withMiddlewareEffects(options) {
                return matchesMiddleware(options).then(function (matches) {
                    if (matches && options.fetchData) {
                        return options
                            .fetchData()
                            .then(function (data) {
                                return getMiddlewareData(
                                    data.dataHref,
                                    data.response,
                                    options
                                ).then(function (effect) {
                                    return {
                                        dataHref: data.dataHref,
                                        json: data.json,
                                        response: data.response,
                                        text: data.text,
                                        effect: effect,
                                    };
                                });
                            })
                            .catch(function (_err) {
                                /**
                                 * TODO: Revisit this in the future.
                                 * For now we will not consider middleware data errors to be fatal.
                                 * maybe we should revisit in the future.
                                 */ return null;
                            });
                    }
                    return null;
                });
            }
            function getMiddlewareData(source, response, options) {
                var nextConfig = {
                    basePath: options.router.basePath,
                    i18n: {
                        locales: options.router.locales,
                    },
                    trailingSlash: Boolean(false),
                };
                var rewriteHeader = response.headers.get("x-nextjs-rewrite");
                var rewriteTarget =
                    rewriteHeader ||
                    response.headers.get("x-nextjs-matched-path");
                var matchedPath = response.headers.get("x-matched-path");
                if (
                    !rewriteTarget &&
                    !(matchedPath == null
                        ? void 0
                        : matchedPath.includes("__next_data_catchall"))
                ) {
                    rewriteTarget = matchedPath;
                }
                if (rewriteTarget) {
                    if (rewriteTarget.startsWith("/")) {
                        var parsedRewriteTarget = (0,
                        _parseRelativeUrl).parseRelativeUrl(rewriteTarget);
                        var pathnameInfo = (0,
                        _getNextPathnameInfo).getNextPathnameInfo(
                            parsedRewriteTarget.pathname,
                            {
                                nextConfig: nextConfig,
                                parseData: true,
                            }
                        );
                        var fsPathname = (0,
                        _removeTrailingSlash).removeTrailingSlash(
                            pathnameInfo.pathname
                        );
                        return Promise.all([
                            options.router.pageLoader.getPageList(),
                            (0, _routeLoader).getClientBuildManifest(),
                        ]).then(function (param) {
                            var _param = _sliced_to_array(param, 2),
                                pages = _param[0],
                                ref = _param[1],
                                rewrites = ref.__rewrites;
                            var as = (0, _addLocale).addLocale(
                                pathnameInfo.pathname,
                                pathnameInfo.locale
                            );
                            if (
                                (0, _isDynamic).isDynamicRoute(as) ||
                                (!rewriteHeader &&
                                    pages.includes(
                                        (0,
                                        _normalizeLocalePath).normalizeLocalePath(
                                            (0, _removeBasePath).removeBasePath(
                                                as
                                            ),
                                            options.router.locales
                                        ).pathname
                                    ))
                            ) {
                                var parsedSource = (0,
                                _getNextPathnameInfo).getNextPathnameInfo(
                                    (0, _parseRelativeUrl).parseRelativeUrl(
                                        source
                                    ).pathname,
                                    {
                                        parseData: true,
                                    }
                                );
                                as = (0, _addBasePath).addBasePath(
                                    parsedSource.pathname
                                );
                                parsedRewriteTarget.pathname = as;
                            }
                            if (false) {
                                var result;
                            }
                            var resolvedHref = !pages.includes(fsPathname)
                                ? resolveDynamicRoute(
                                      (0,
                                      _normalizeLocalePath).normalizeLocalePath(
                                          (0, _removeBasePath).removeBasePath(
                                              parsedRewriteTarget.pathname
                                          ),
                                          options.router.locales
                                      ).pathname,
                                      pages
                                  )
                                : fsPathname;
                            if ((0, _isDynamic).isDynamicRoute(resolvedHref)) {
                                var matches = (0,
                                _routeMatcher).getRouteMatcher(
                                    (0, _routeRegex).getRouteRegex(resolvedHref)
                                )(as);
                                Object.assign(
                                    parsedRewriteTarget.query,
                                    matches || {}
                                );
                            }
                            return {
                                type: "rewrite",
                                parsedAs: parsedRewriteTarget,
                                resolvedHref: resolvedHref,
                            };
                        });
                    }
                    var src = (0, _parsePath).parsePath(source);
                    var pathname = (0,
                    _formatNextPathnameInfo).formatNextPathnameInfo(
                        _object_spread_props(
                            _object_spread(
                                {},
                                (0, _getNextPathnameInfo).getNextPathnameInfo(
                                    src.pathname,
                                    {
                                        nextConfig: nextConfig,
                                        parseData: true,
                                    }
                                )
                            ),
                            {
                                defaultLocale: options.router.defaultLocale,
                                buildId: "",
                            }
                        )
                    );
                    return Promise.resolve({
                        type: "redirect-external",
                        destination: ""
                            .concat(pathname)
                            .concat(src.query)
                            .concat(src.hash),
                    });
                }
                var redirectTarget = response.headers.get("x-nextjs-redirect");
                if (redirectTarget) {
                    if (redirectTarget.startsWith("/")) {
                        var src1 = (0, _parsePath).parsePath(redirectTarget);
                        var pathname1 = (0,
                        _formatNextPathnameInfo).formatNextPathnameInfo(
                            _object_spread_props(
                                _object_spread(
                                    {},
                                    (0,
                                    _getNextPathnameInfo).getNextPathnameInfo(
                                        src1.pathname,
                                        {
                                            nextConfig: nextConfig,
                                            parseData: true,
                                        }
                                    )
                                ),
                                {
                                    defaultLocale: options.router.defaultLocale,
                                    buildId: "",
                                }
                            )
                        );
                        return Promise.resolve({
                            type: "redirect-internal",
                            newAs: ""
                                .concat(pathname1)
                                .concat(src1.query)
                                .concat(src1.hash),
                            newUrl: ""
                                .concat(pathname1)
                                .concat(src1.query)
                                .concat(src1.hash),
                        });
                    }
                    return Promise.resolve({
                        type: "redirect-external",
                        destination: redirectTarget,
                    });
                }
                return Promise.resolve({
                    type: "next",
                });
            } //# sourceMappingURL=router.js.map

            /***/
        },

        /***/ 7459: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.addLocale = addLocale;
            var _addPathPrefix = __webpack_require__(5391);
            var _pathHasPrefix = __webpack_require__(1259);
            function addLocale(path, locale, defaultLocale, ignorePrefix) {
                if (
                    locale &&
                    locale !== defaultLocale &&
                    (ignorePrefix ||
                        (!(0, _pathHasPrefix).pathHasPrefix(
                            path.toLowerCase(),
                            "/".concat(locale.toLowerCase())
                        ) &&
                            !(0, _pathHasPrefix).pathHasPrefix(
                                path.toLowerCase(),
                                "/api"
                            )))
                ) {
                    return (0, _addPathPrefix).addPathPrefix(
                        path,
                        "/".concat(locale)
                    );
                }
                return path;
            } //# sourceMappingURL=add-locale.js.map

            /***/
        },

        /***/ 5391: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.addPathPrefix = addPathPrefix;
            var _parsePath = __webpack_require__(4943);
            function addPathPrefix(path, prefix) {
                if (!path.startsWith("/") || !prefix) {
                    return path;
                }
                var ref = (0, _parsePath).parsePath(path),
                    pathname = ref.pathname,
                    query = ref.query,
                    hash = ref.hash;
                return ""
                    .concat(prefix)
                    .concat(pathname)
                    .concat(query)
                    .concat(hash);
            } //# sourceMappingURL=add-path-prefix.js.map

            /***/
        },

        /***/ 4156: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.addPathSuffix = addPathSuffix;
            var _parsePath = __webpack_require__(4943);
            function addPathSuffix(path, suffix) {
                if (!path.startsWith("/") || !suffix) {
                    return path;
                }
                var ref = (0, _parsePath).parsePath(path),
                    pathname = ref.pathname,
                    query = ref.query,
                    hash = ref.hash;
                return ""
                    .concat(pathname)
                    .concat(suffix)
                    .concat(query)
                    .concat(hash);
            } //# sourceMappingURL=add-path-suffix.js.map

            /***/
        },

        /***/ 4022: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.formatNextPathnameInfo = formatNextPathnameInfo;
            var _removeTrailingSlash = __webpack_require__(6316);
            var _addPathPrefix = __webpack_require__(5391);
            var _addPathSuffix = __webpack_require__(4156);
            var _addLocale = __webpack_require__(7459);
            function formatNextPathnameInfo(info) {
                var pathname = (0, _addLocale).addLocale(
                    info.pathname,
                    info.locale,
                    info.buildId ? undefined : info.defaultLocale,
                    info.ignorePrefix
                );
                if (info.buildId) {
                    pathname = (0, _addPathSuffix).addPathSuffix(
                        (0, _addPathPrefix).addPathPrefix(
                            pathname,
                            "/_next/data/".concat(info.buildId)
                        ),
                        info.pathname === "/" ? "index.json" : ".json"
                    );
                }
                pathname = (0, _addPathPrefix).addPathPrefix(
                    pathname,
                    info.basePath
                );
                return info.trailingSlash
                    ? !info.buildId && !pathname.endsWith("/")
                        ? (0, _addPathSuffix).addPathSuffix(pathname, "/")
                        : pathname
                    : (0, _removeTrailingSlash).removeTrailingSlash(pathname);
            } //# sourceMappingURL=format-next-pathname-info.js.map

            /***/
        },

        /***/ 4611: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.formatUrl = formatUrl;
            exports.formatWithValidation = formatWithValidation;
            exports.urlObjectKeys = void 0;
            var querystring = _interopRequireWildcard(__webpack_require__(466));
            function _getRequireWildcardCache() {
                if (typeof WeakMap !== "function") return null;
                var cache = new WeakMap();
                _getRequireWildcardCache = function _getRequireWildcardCache() {
                    return cache;
                };
                return cache;
            }
            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                }
                if (
                    obj === null ||
                    (typeof obj !== "object" && typeof obj !== "function")
                ) {
                    return {
                        default: obj,
                    };
                }
                var cache = _getRequireWildcardCache();
                if (cache && cache.has(obj)) {
                    return cache.get(obj);
                }
                var newObj = {};
                var hasPropertyDescriptor =
                    Object.defineProperty && Object.getOwnPropertyDescriptor;
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        var desc = hasPropertyDescriptor
                            ? Object.getOwnPropertyDescriptor(obj, key)
                            : null;
                        if (desc && (desc.get || desc.set)) {
                            Object.defineProperty(newObj, key, desc);
                        } else {
                            newObj[key] = obj[key];
                        }
                    }
                }
                newObj.default = obj;
                if (cache) {
                    cache.set(obj, newObj);
                }
                return newObj;
            }
            var slashedProtocols = /https?|ftp|gopher|file/;
            function formatUrl(urlObj) {
                var auth = urlObj.auth,
                    hostname = urlObj.hostname;
                var protocol = urlObj.protocol || "";
                var pathname = urlObj.pathname || "";
                var hash = urlObj.hash || "";
                var query = urlObj.query || "";
                var host = false;
                auth = auth
                    ? encodeURIComponent(auth).replace(/%3A/i, ":") + "@"
                    : "";
                if (urlObj.host) {
                    host = auth + urlObj.host;
                } else if (hostname) {
                    host =
                        auth +
                        (~hostname.indexOf(":")
                            ? "[".concat(hostname, "]")
                            : hostname);
                    if (urlObj.port) {
                        host += ":" + urlObj.port;
                    }
                }
                if (query && typeof query === "object") {
                    query = String(querystring.urlQueryToSearchParams(query));
                }
                var search =
                    urlObj.search || (query && "?".concat(query)) || "";
                if (protocol && !protocol.endsWith(":")) protocol += ":";
                if (
                    urlObj.slashes ||
                    ((!protocol || slashedProtocols.test(protocol)) &&
                        host !== false)
                ) {
                    host = "//" + (host || "");
                    if (pathname && pathname[0] !== "/")
                        pathname = "/" + pathname;
                } else if (!host) {
                    host = "";
                }
                if (hash && hash[0] !== "#") hash = "#" + hash;
                if (search && search[0] !== "?") search = "?" + search;
                pathname = pathname.replace(/[?#]/g, encodeURIComponent);
                search = search.replace("#", "%23");
                return ""
                    .concat(protocol)
                    .concat(host)
                    .concat(pathname)
                    .concat(search)
                    .concat(hash);
            }
            var urlObjectKeys = [
                "auth",
                "hash",
                "host",
                "hostname",
                "href",
                "path",
                "pathname",
                "port",
                "protocol",
                "query",
                "search",
                "slashes",
            ];
            exports.urlObjectKeys = urlObjectKeys;
            function formatWithValidation(url) {
                if (false) {
                }
                return formatUrl(url);
            } //# sourceMappingURL=format-url.js.map

            /***/
        },

        /***/ 3891: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = getAssetPathFromRoute;
            function getAssetPathFromRoute(route) {
                var ext =
                    arguments.length > 1 && arguments[1] !== void 0
                        ? arguments[1]
                        : "";
                var path =
                    route === "/"
                        ? "/index"
                        : /^\/index(\/|$)/.test(route)
                        ? "/index".concat(route)
                        : "".concat(route);
                return path + ext;
            } //# sourceMappingURL=get-asset-path-from-route.js.map

            /***/
        },

        /***/ 159: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.getNextPathnameInfo = getNextPathnameInfo;
            var _normalizeLocalePath = __webpack_require__(4317);
            var _removePathPrefix = __webpack_require__(9244);
            var _pathHasPrefix = __webpack_require__(1259);
            function getNextPathnameInfo(pathname, options) {
                var _nextConfig;
                var ref =
                        (_nextConfig = options.nextConfig) != null
                            ? _nextConfig
                            : {},
                    basePath = ref.basePath,
                    i18n = ref.i18n,
                    trailingSlash = ref.trailingSlash;
                var info = {
                    pathname: pathname,
                    trailingSlash:
                        pathname !== "/"
                            ? pathname.endsWith("/")
                            : trailingSlash,
                };
                if (
                    basePath &&
                    (0, _pathHasPrefix).pathHasPrefix(info.pathname, basePath)
                ) {
                    info.pathname = (0, _removePathPrefix).removePathPrefix(
                        info.pathname,
                        basePath
                    );
                    info.basePath = basePath;
                }
                if (
                    options.parseData === true &&
                    info.pathname.startsWith("/_next/data/") &&
                    info.pathname.endsWith(".json")
                ) {
                    var paths = info.pathname
                        .replace(/^\/_next\/data\//, "")
                        .replace(/\.json$/, "")
                        .split("/");
                    var buildId = paths[0];
                    info.pathname =
                        paths[1] !== "index"
                            ? "/".concat(paths.slice(1).join("/"))
                            : "/";
                    info.buildId = buildId;
                }
                if (i18n) {
                    var pathLocale = (0,
                    _normalizeLocalePath).normalizeLocalePath(
                        info.pathname,
                        i18n.locales
                    );
                    info.locale =
                        pathLocale == null ? void 0 : pathLocale.detectedLocale;
                    info.pathname =
                        (pathLocale == null ? void 0 : pathLocale.pathname) ||
                        info.pathname;
                }
                return info;
            } //# sourceMappingURL=get-next-pathname-info.js.map

            /***/
        },

        /***/ 418: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            Object.defineProperty(exports, "getSortedRoutes", {
                enumerable: true,
                get: function get() {
                    return _sortedRoutes.getSortedRoutes;
                },
            });
            Object.defineProperty(exports, "isDynamicRoute", {
                enumerable: true,
                get: function get() {
                    return _isDynamic.isDynamicRoute;
                },
            });
            var _sortedRoutes = __webpack_require__(3907);
            var _isDynamic = __webpack_require__(8689); //# sourceMappingURL=index.js.map

            /***/
        },

        /***/ 8689: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.isDynamicRoute = isDynamicRoute;
            // Identify /[param]/ in route string
            var TEST_ROUTE = /\/\[[^/]+?\](?=\/|$)/;
            function isDynamicRoute(route) {
                return TEST_ROUTE.test(route);
            } //# sourceMappingURL=is-dynamic.js.map

            /***/
        },

        /***/ 4943: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.parsePath = parsePath;
            function parsePath(path) {
                var hashIndex = path.indexOf("#");
                var queryIndex = path.indexOf("?");
                if (queryIndex > -1 || hashIndex > -1) {
                    return {
                        pathname: path.substring(
                            0,
                            queryIndex > -1 ? queryIndex : hashIndex
                        ),
                        query:
                            queryIndex > -1
                                ? path.substring(
                                      queryIndex,
                                      hashIndex > -1 ? hashIndex : undefined
                                  )
                                : "",
                        hash: hashIndex > -1 ? path.slice(hashIndex) : "",
                    };
                }
                return {
                    pathname: path,
                    query: "",
                    hash: "",
                };
            } //# sourceMappingURL=parse-path.js.map

            /***/
        },

        /***/ 6305: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.parseRelativeUrl = parseRelativeUrl;
            var _utils = __webpack_require__(3794);
            var _querystring = __webpack_require__(466);
            function parseRelativeUrl(url, base) {
                var globalBase = new URL(
                    false ? 0 : (0, _utils).getLocationOrigin()
                );
                var resolvedBase = base
                    ? new URL(base, globalBase)
                    : url.startsWith(".")
                    ? new URL(false ? 0 : window.location.href)
                    : globalBase;
                var ref = new URL(url, resolvedBase),
                    pathname = ref.pathname,
                    searchParams = ref.searchParams,
                    search = ref.search,
                    hash = ref.hash,
                    href = ref.href,
                    origin = ref.origin;
                if (origin !== globalBase.origin) {
                    throw new Error(
                        "invariant: invalid relative URL, router received ".concat(
                            url
                        )
                    );
                }
                return {
                    pathname: pathname,
                    query: (0, _querystring).searchParamsToUrlQuery(
                        searchParams
                    ),
                    search: search,
                    hash: hash,
                    href: href.slice(globalBase.origin.length),
                };
            } //# sourceMappingURL=parse-relative-url.js.map

            /***/
        },

        /***/ 1259: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.pathHasPrefix = pathHasPrefix;
            var _parsePath = __webpack_require__(4943);
            function pathHasPrefix(path, prefix) {
                if (typeof path !== "string") {
                    return false;
                }
                var pathname = (0, _parsePath).parsePath(path).pathname;
                return pathname === prefix || pathname.startsWith(prefix + "/");
            } //# sourceMappingURL=path-has-prefix.js.map

            /***/
        },

        /***/ 466: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _sliced_to_array =
                __webpack_require__(4941) /* ["default"] */.Z;
            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.searchParamsToUrlQuery = searchParamsToUrlQuery;
            exports.urlQueryToSearchParams = urlQueryToSearchParams;
            exports.assign = assign;
            function searchParamsToUrlQuery(searchParams) {
                var query = {};
                searchParams.forEach(function (value, key) {
                    if (typeof query[key] === "undefined") {
                        query[key] = value;
                    } else if (Array.isArray(query[key])) {
                        query[key].push(value);
                    } else {
                        query[key] = [query[key], value];
                    }
                });
                return query;
            }
            function stringifyUrlQueryParam(param) {
                if (
                    typeof param === "string" ||
                    (typeof param === "number" && !isNaN(param)) ||
                    typeof param === "boolean"
                ) {
                    return String(param);
                } else {
                    return "";
                }
            }
            function urlQueryToSearchParams(urlQuery) {
                var result = new URLSearchParams();
                Object.entries(urlQuery).forEach(function (param) {
                    var _param = _sliced_to_array(param, 2),
                        key = _param[0],
                        value = _param[1];
                    if (Array.isArray(value)) {
                        value.forEach(function (item) {
                            return result.append(
                                key,
                                stringifyUrlQueryParam(item)
                            );
                        });
                    } else {
                        result.set(key, stringifyUrlQueryParam(value));
                    }
                });
                return result;
            }
            function assign(target) {
                for (
                    var _len = arguments.length,
                        searchParamsList = new Array(_len > 1 ? _len - 1 : 0),
                        _key = 1;
                    _key < _len;
                    _key++
                ) {
                    searchParamsList[_key - 1] = arguments[_key];
                }
                searchParamsList.forEach(function (searchParams) {
                    Array.from(searchParams.keys()).forEach(function (key) {
                        return target.delete(key);
                    });
                    searchParams.forEach(function (value, key) {
                        return target.append(key, value);
                    });
                });
                return target;
            } //# sourceMappingURL=querystring.js.map

            /***/
        },

        /***/ 9244: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.removePathPrefix = removePathPrefix;
            var _pathHasPrefix = __webpack_require__(1259);
            function removePathPrefix(path, prefix) {
                if ((0, _pathHasPrefix).pathHasPrefix(path, prefix)) {
                    var withoutPrefix = path.slice(prefix.length);
                    return withoutPrefix.startsWith("/")
                        ? withoutPrefix
                        : "/".concat(withoutPrefix);
                }
                return path;
            } //# sourceMappingURL=remove-path-prefix.js.map

            /***/
        },

        /***/ 6316: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.removeTrailingSlash = removeTrailingSlash;
            function removeTrailingSlash(route) {
                return route.replace(/\/$/, "") || "/";
            } //# sourceMappingURL=remove-trailing-slash.js.map

            /***/
        },

        /***/ 3888: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.getRouteMatcher = getRouteMatcher;
            var _utils = __webpack_require__(3794);
            function getRouteMatcher(param) {
                var re = param.re,
                    groups = param.groups;
                return function (pathname) {
                    var routeMatch = re.exec(pathname);
                    if (!routeMatch) {
                        return false;
                    }
                    var decode = function (param) {
                        try {
                            return decodeURIComponent(param);
                        } catch (_) {
                            throw new _utils.DecodeError(
                                "failed to decode param"
                            );
                        }
                    };
                    var params = {};
                    Object.keys(groups).forEach(function (slugName) {
                        var g = groups[slugName];
                        var m = routeMatch[g.pos];
                        if (m !== undefined) {
                            params[slugName] = ~m.indexOf("/")
                                ? m.split("/").map(function (entry) {
                                      return decode(entry);
                                  })
                                : g.repeat
                                ? [decode(m)]
                                : decode(m);
                        }
                    });
                    return params;
                };
            } //# sourceMappingURL=route-matcher.js.map

            /***/
        },

        /***/ 4095: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _object_spread = __webpack_require__(337) /* ["default"] */.Z;
            var _object_spread_props =
                __webpack_require__(9961) /* ["default"] */.Z;
            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.getRouteRegex = getRouteRegex;
            exports.getNamedRouteRegex = getNamedRouteRegex;
            exports.getMiddlewareRegex = getMiddlewareRegex;
            exports.getNamedMiddlewareRegex = getNamedMiddlewareRegex;
            var _escapeRegexp = __webpack_require__(489);
            var _removeTrailingSlash = __webpack_require__(6316);
            function getRouteRegex(normalizedRoute) {
                var ref = getParametrizedRoute(normalizedRoute),
                    parameterizedRoute = ref.parameterizedRoute,
                    groups = ref.groups;
                return {
                    re: new RegExp("^".concat(parameterizedRoute, "(?:/)?$")),
                    groups: groups,
                };
            }
            function getNamedRouteRegex(normalizedRoute) {
                var result = getNamedParametrizedRoute(normalizedRoute);
                return _object_spread_props(
                    _object_spread({}, getRouteRegex(normalizedRoute)),
                    {
                        namedRegex: "^".concat(
                            result.namedParameterizedRoute,
                            "(?:/)?$"
                        ),
                        routeKeys: result.routeKeys,
                    }
                );
            }
            function getParametrizedRoute(route) {
                var segments = (0, _removeTrailingSlash)
                    .removeTrailingSlash(route)
                    .slice(1)
                    .split("/");
                var groups = {};
                var groupIndex = 1;
                return {
                    parameterizedRoute: segments
                        .map(function (segment) {
                            if (
                                segment.startsWith("[") &&
                                segment.endsWith("]")
                            ) {
                                var ref = parseParameter(segment.slice(1, -1)),
                                    key = ref.key,
                                    optional = ref.optional,
                                    repeat = ref.repeat;
                                groups[key] = {
                                    pos: groupIndex++,
                                    repeat: repeat,
                                    optional: optional,
                                };
                                return repeat
                                    ? optional
                                        ? "(?:/(.+?))?"
                                        : "/(.+?)"
                                    : "/([^/]+?)";
                            } else {
                                return "/".concat(
                                    (0, _escapeRegexp).escapeStringRegexp(
                                        segment
                                    )
                                );
                            }
                        })
                        .join(""),
                    groups: groups,
                };
            }
            function getNamedParametrizedRoute(route) {
                var segments = (0, _removeTrailingSlash)
                    .removeTrailingSlash(route)
                    .slice(1)
                    .split("/");
                var getSafeRouteKey = buildGetSafeRouteKey();
                var routeKeys = {};
                return {
                    namedParameterizedRoute: segments
                        .map(function (segment) {
                            if (
                                segment.startsWith("[") &&
                                segment.endsWith("]")
                            ) {
                                var ref = parseParameter(segment.slice(1, -1)),
                                    key = ref.key,
                                    optional = ref.optional,
                                    repeat = ref.repeat;
                                // replace any non-word characters since they can break
                                // the named regex
                                var cleanedKey = key.replace(/\W/g, "");
                                var invalidKey = false;
                                // check if the key is still invalid and fallback to using a known
                                // safe key
                                if (
                                    cleanedKey.length === 0 ||
                                    cleanedKey.length > 30
                                ) {
                                    invalidKey = true;
                                }
                                if (!isNaN(parseInt(cleanedKey.slice(0, 1)))) {
                                    invalidKey = true;
                                }
                                if (invalidKey) {
                                    cleanedKey = getSafeRouteKey();
                                }
                                routeKeys[cleanedKey] = key;
                                return repeat
                                    ? optional
                                        ? "(?:/(?<".concat(
                                              cleanedKey,
                                              ">.+?))?"
                                          )
                                        : "/(?<".concat(cleanedKey, ">.+?)")
                                    : "/(?<".concat(cleanedKey, ">[^/]+?)");
                            } else {
                                return "/".concat(
                                    (0, _escapeRegexp).escapeStringRegexp(
                                        segment
                                    )
                                );
                            }
                        })
                        .join(""),
                    routeKeys: routeKeys,
                };
            }
            /**
             * Parses a given parameter from a route to a data structure that can be used
             * to generate the parametrized route. Examples:
             *   - `[...slug]` -> `{ name: 'slug', repeat: true, optional: true }`
             *   - `[foo]` -> `{ name: 'foo', repeat: false, optional: true }`
             *   - `bar` -> `{ name: 'bar', repeat: false, optional: false }`
             */ function parseParameter(param) {
                var optional = param.startsWith("[") && param.endsWith("]");
                if (optional) {
                    param = param.slice(1, -1);
                }
                var repeat = param.startsWith("...");
                if (repeat) {
                    param = param.slice(3);
                }
                return {
                    key: param,
                    repeat: repeat,
                    optional: optional,
                };
            }
            /**
             * Builds a function to generate a minimal routeKey using only a-z and minimal
             * number of characters.
             */ function buildGetSafeRouteKey() {
                var routeKeyCharCode = 97;
                var routeKeyCharLength = 1;
                return function () {
                    var routeKey = "";
                    for (var i = 0; i < routeKeyCharLength; i++) {
                        routeKey += String.fromCharCode(routeKeyCharCode);
                        routeKeyCharCode++;
                        if (routeKeyCharCode > 122) {
                            routeKeyCharLength++;
                            routeKeyCharCode = 97;
                        }
                    }
                    return routeKey;
                };
            }
            function getMiddlewareRegex(normalizedRoute, options) {
                var ref = getParametrizedRoute(normalizedRoute),
                    parameterizedRoute = ref.parameterizedRoute,
                    groups = ref.groups;
                var ref1 = options != null ? options : {},
                    _catchAll = ref1.catchAll,
                    catchAll = _catchAll === void 0 ? true : _catchAll;
                if (parameterizedRoute === "/") {
                    var catchAllRegex = catchAll ? ".*" : "";
                    return {
                        groups: {},
                        re: new RegExp("^/".concat(catchAllRegex, "$")),
                    };
                }
                var catchAllGroupedRegex = catchAll ? "(?:(/.*)?)" : "";
                return {
                    groups: groups,
                    re: new RegExp(
                        "^"
                            .concat(parameterizedRoute)
                            .concat(catchAllGroupedRegex, "$")
                    ),
                };
            }
            function getNamedMiddlewareRegex(normalizedRoute, options) {
                var parameterizedRoute =
                    getParametrizedRoute(normalizedRoute).parameterizedRoute;
                var _catchAll = options.catchAll,
                    catchAll = _catchAll === void 0 ? true : _catchAll;
                if (parameterizedRoute === "/") {
                    var catchAllRegex = catchAll ? ".*" : "";
                    return {
                        namedRegex: "^/".concat(catchAllRegex, "$"),
                    };
                }
                var namedParameterizedRoute =
                    getNamedParametrizedRoute(
                        normalizedRoute
                    ).namedParameterizedRoute;
                var catchAllGroupedRegex = catchAll ? "(?:(/.*)?)" : "";
                return {
                    namedRegex: "^"
                        .concat(namedParameterizedRoute)
                        .concat(catchAllGroupedRegex, "$"),
                };
            } //# sourceMappingURL=route-regex.js.map

            /***/
        },

        /***/ 3907: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _class_call_check =
                __webpack_require__(9658) /* ["default"] */.Z;
            var _create_class = __webpack_require__(7222) /* ["default"] */.Z;
            var _define_property = __webpack_require__(9361)["default"];
            var _to_consumable_array =
                __webpack_require__(3929) /* ["default"] */.Z;
            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.getSortedRoutes = getSortedRoutes;
            var UrlNode = /*#__PURE__*/ (function () {
                function UrlNode() {
                    _class_call_check(this, UrlNode);
                    _define_property(this, "placeholder", true);
                    _define_property(this, "children", new Map());
                    _define_property(this, "slugName", null);
                    _define_property(this, "restSlugName", null);
                    _define_property(this, "optionalRestSlugName", null);
                }
                _create_class(UrlNode, [
                    {
                        key: "insert",
                        value: function insert(urlPath) {
                            this._insert(
                                urlPath.split("/").filter(Boolean),
                                [],
                                false
                            );
                        },
                    },
                    {
                        key: "smoosh",
                        value: function smoosh() {
                            return this._smoosh();
                        },
                    },
                    {
                        key: "_smoosh",
                        value: function _smoosh() {
                            var prefix =
                                arguments.length > 0 && arguments[0] !== void 0
                                    ? arguments[0]
                                    : "/";
                            var _this = this;
                            var childrenPaths = _to_consumable_array(
                                this.children.keys()
                            ).sort();
                            if (this.slugName !== null) {
                                childrenPaths.splice(
                                    childrenPaths.indexOf("[]"),
                                    1
                                );
                            }
                            if (this.restSlugName !== null) {
                                childrenPaths.splice(
                                    childrenPaths.indexOf("[...]"),
                                    1
                                );
                            }
                            if (this.optionalRestSlugName !== null) {
                                childrenPaths.splice(
                                    childrenPaths.indexOf("[[...]]"),
                                    1
                                );
                            }
                            var routes = childrenPaths
                                .map(function (c) {
                                    return _this.children
                                        .get(c)
                                        ._smoosh(
                                            "".concat(prefix).concat(c, "/")
                                        );
                                })
                                .reduce(function (prev, curr) {
                                    return _to_consumable_array(prev).concat(
                                        _to_consumable_array(curr)
                                    );
                                }, []);
                            if (this.slugName !== null) {
                                var _routes;
                                (_routes = routes).push.apply(
                                    _routes,
                                    _to_consumable_array(
                                        this.children
                                            .get("[]")
                                            ._smoosh(
                                                ""
                                                    .concat(prefix, "[")
                                                    .concat(this.slugName, "]/")
                                            )
                                    )
                                );
                            }
                            if (!this.placeholder) {
                                var r =
                                    prefix === "/" ? "/" : prefix.slice(0, -1);
                                if (this.optionalRestSlugName != null) {
                                    throw new Error(
                                        'You cannot define a route with the same specificity as a optional catch-all route ("'
                                            .concat(r, '" and "')
                                            .concat(r, "[[...")
                                            .concat(
                                                this.optionalRestSlugName,
                                                ']]").'
                                            )
                                    );
                                }
                                routes.unshift(r);
                            }
                            if (this.restSlugName !== null) {
                                var _routes1;
                                (_routes1 = routes).push.apply(
                                    _routes1,
                                    _to_consumable_array(
                                        this.children
                                            .get("[...]")
                                            ._smoosh(
                                                ""
                                                    .concat(prefix, "[...")
                                                    .concat(
                                                        this.restSlugName,
                                                        "]/"
                                                    )
                                            )
                                    )
                                );
                            }
                            if (this.optionalRestSlugName !== null) {
                                var _routes2;
                                (_routes2 = routes).push.apply(
                                    _routes2,
                                    _to_consumable_array(
                                        this.children
                                            .get("[[...]]")
                                            ._smoosh(
                                                ""
                                                    .concat(prefix, "[[...")
                                                    .concat(
                                                        this
                                                            .optionalRestSlugName,
                                                        "]]/"
                                                    )
                                            )
                                    )
                                );
                            }
                            return routes;
                        },
                    },
                    {
                        key: "_insert",
                        value: function _insert(
                            urlPaths,
                            slugNames,
                            isCatchAll
                        ) {
                            if (urlPaths.length === 0) {
                                this.placeholder = false;
                                return;
                            }
                            if (isCatchAll) {
                                throw new Error(
                                    "Catch-all must be the last part of the URL."
                                );
                            }
                            // The next segment in the urlPaths list
                            var nextSegment = urlPaths[0];
                            // Check if the segment matches `[something]`
                            if (
                                nextSegment.startsWith("[") &&
                                nextSegment.endsWith("]")
                            ) {
                                var handleSlug = function handleSlug(
                                    previousSlug,
                                    nextSlug
                                ) {
                                    if (previousSlug !== null) {
                                        // If the specific segment already has a slug but the slug is not `something`
                                        // This prevents collisions like:
                                        // pages/[post]/index.js
                                        // pages/[id]/index.js
                                        // Because currently multiple dynamic params on the same segment level are not supported
                                        if (previousSlug !== nextSlug) {
                                            // TODO: This error seems to be confusing for users, needs an error link, the description can be based on above comment.
                                            throw new Error(
                                                "You cannot use different slug names for the same dynamic path ('"
                                                    .concat(
                                                        previousSlug,
                                                        "' !== '"
                                                    )
                                                    .concat(nextSlug, "').")
                                            );
                                        }
                                    }
                                    slugNames.forEach(function (slug) {
                                        if (slug === nextSlug) {
                                            throw new Error(
                                                'You cannot have the same slug name "'.concat(
                                                    nextSlug,
                                                    '" repeat within a single dynamic path'
                                                )
                                            );
                                        }
                                        if (
                                            slug.replace(/\W/g, "") ===
                                            nextSegment.replace(/\W/g, "")
                                        ) {
                                            throw new Error(
                                                'You cannot have the slug names "'
                                                    .concat(slug, '" and "')
                                                    .concat(
                                                        nextSlug,
                                                        '" differ only by non-word symbols within a single dynamic path'
                                                    )
                                            );
                                        }
                                    });
                                    slugNames.push(nextSlug);
                                };
                                // Strip `[` and `]`, leaving only `something`
                                var segmentName = nextSegment.slice(1, -1);
                                var isOptional = false;
                                if (
                                    segmentName.startsWith("[") &&
                                    segmentName.endsWith("]")
                                ) {
                                    // Strip optional `[` and `]`, leaving only `something`
                                    segmentName = segmentName.slice(1, -1);
                                    isOptional = true;
                                }
                                if (segmentName.startsWith("...")) {
                                    // Strip `...`, leaving only `something`
                                    segmentName = segmentName.substring(3);
                                    isCatchAll = true;
                                }
                                if (
                                    segmentName.startsWith("[") ||
                                    segmentName.endsWith("]")
                                ) {
                                    throw new Error(
                                        "Segment names may not start or end with extra brackets ('".concat(
                                            segmentName,
                                            "')."
                                        )
                                    );
                                }
                                if (segmentName.startsWith(".")) {
                                    throw new Error(
                                        "Segment names may not start with erroneous periods ('".concat(
                                            segmentName,
                                            "')."
                                        )
                                    );
                                }
                                if (isCatchAll) {
                                    if (isOptional) {
                                        if (this.restSlugName != null) {
                                            throw new Error(
                                                'You cannot use both an required and optional catch-all route at the same level ("[...'
                                                    .concat(
                                                        this.restSlugName,
                                                        ']" and "'
                                                    )
                                                    .concat(urlPaths[0], '" ).')
                                            );
                                        }
                                        handleSlug(
                                            this.optionalRestSlugName,
                                            segmentName
                                        );
                                        // slugName is kept as it can only be one particular slugName
                                        this.optionalRestSlugName = segmentName;
                                        // nextSegment is overwritten to [[...]] so that it can later be sorted specifically
                                        nextSegment = "[[...]]";
                                    } else {
                                        if (this.optionalRestSlugName != null) {
                                            throw new Error(
                                                'You cannot use both an optional and required catch-all route at the same level ("[[...'
                                                    .concat(
                                                        this
                                                            .optionalRestSlugName,
                                                        ']]" and "'
                                                    )
                                                    .concat(urlPaths[0], '").')
                                            );
                                        }
                                        handleSlug(
                                            this.restSlugName,
                                            segmentName
                                        );
                                        // slugName is kept as it can only be one particular slugName
                                        this.restSlugName = segmentName;
                                        // nextSegment is overwritten to [...] so that it can later be sorted specifically
                                        nextSegment = "[...]";
                                    }
                                } else {
                                    if (isOptional) {
                                        throw new Error(
                                            'Optional route parameters are not yet supported ("'.concat(
                                                urlPaths[0],
                                                '").'
                                            )
                                        );
                                    }
                                    handleSlug(this.slugName, segmentName);
                                    // slugName is kept as it can only be one particular slugName
                                    this.slugName = segmentName;
                                    // nextSegment is overwritten to [] so that it can later be sorted specifically
                                    nextSegment = "[]";
                                }
                            }
                            // If this UrlNode doesn't have the nextSegment yet we create a new child UrlNode
                            if (!this.children.has(nextSegment)) {
                                this.children.set(nextSegment, new UrlNode());
                            }
                            this.children
                                .get(nextSegment)
                                ._insert(
                                    urlPaths.slice(1),
                                    slugNames,
                                    isCatchAll
                                );
                        },
                    },
                ]);
                return UrlNode;
            })();
            function getSortedRoutes(normalizedPages) {
                // First the UrlNode is created, and every UrlNode can have only 1 dynamic segment
                // Eg you can't have pages/[post]/abc.js and pages/[hello]/something-else.js
                // Only 1 dynamic segment per nesting level
                // So in the case that is test/integration/dynamic-routing it'll be this:
                // pages/[post]/comments.js
                // pages/blog/[post]/comment/[id].js
                // Both are fine because `pages/[post]` and `pages/blog` are on the same level
                // So in this case `UrlNode` created here has `this.slugName === 'post'`
                // And since your PR passed through `slugName` as an array basically it'd including it in too many possibilities
                // Instead what has to be passed through is the upwards path's dynamic names
                var root = new UrlNode();
                // Here the `root` gets injected multiple paths, and insert will break them up into sublevels
                normalizedPages.forEach(function (pagePath) {
                    return root.insert(pagePath);
                });
                // Smoosh will then sort those sublevels up to the point where you get the correct route definition priority
                return root.smoosh();
            } //# sourceMappingURL=sorted-routes.js.map

            /***/
        },

        /***/ 8027: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.setConfig = setConfig;
            exports["default"] = void 0;
            var runtimeConfig;
            var _default = function () {
                return runtimeConfig;
            };
            exports["default"] = _default;
            function setConfig(configValue) {
                runtimeConfig = configValue;
            } //# sourceMappingURL=runtime-config.js.map

            /***/
        },

        /***/ 5188: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = SideEffect;
            var _react = _interopRequireWildcard(__webpack_require__(7294));
            function SideEffect(props) {
                var emitChange = function emitChange() {
                    if (headManager && headManager.mountedInstances) {
                        var headElements = _react.Children.toArray(
                            headManager.mountedInstances
                        ).filter(Boolean);
                        headManager.updateHead(
                            reduceComponentsToState(headElements, props)
                        );
                    }
                };
                var headManager = props.headManager,
                    reduceComponentsToState = props.reduceComponentsToState;
                if (isServer) {
                    var ref;
                    headManager == null
                        ? void 0
                        : (ref = headManager.mountedInstances) == null
                        ? void 0
                        : ref.add(props.children);
                    emitChange();
                }
                useClientOnlyLayoutEffect(function () {
                    var ref1;
                    headManager == null
                        ? void 0
                        : (ref1 = headManager.mountedInstances) == null
                        ? void 0
                        : ref1.add(props.children);
                    return function () {
                        var ref;
                        headManager == null
                            ? void 0
                            : (ref = headManager.mountedInstances) == null
                            ? void 0
                            : ref.delete(props.children);
                    };
                });
                // We need to call `updateHead` method whenever the `SideEffect` is trigger in all
                // life-cycles: mount, update, unmount. However, if there are multiple `SideEffect`s
                // being rendered, we only trigger the method from the last one.
                // This is ensured by keeping the last unflushed `updateHead` in the `_pendingUpdate`
                // singleton in the layout effect pass, and actually trigger it in the effect pass.
                useClientOnlyLayoutEffect(function () {
                    if (headManager) {
                        headManager._pendingUpdate = emitChange;
                    }
                    return function () {
                        if (headManager) {
                            headManager._pendingUpdate = emitChange;
                        }
                    };
                });
                useClientOnlyEffect(function () {
                    if (headManager && headManager._pendingUpdate) {
                        headManager._pendingUpdate();
                        headManager._pendingUpdate = null;
                    }
                    return function () {
                        if (headManager && headManager._pendingUpdate) {
                            headManager._pendingUpdate();
                            headManager._pendingUpdate = null;
                        }
                    };
                });
                return null;
            }
            function _getRequireWildcardCache() {
                if (typeof WeakMap !== "function") return null;
                var cache = new WeakMap();
                _getRequireWildcardCache = function _getRequireWildcardCache() {
                    return cache;
                };
                return cache;
            }
            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                }
                if (
                    obj === null ||
                    (typeof obj !== "object" && typeof obj !== "function")
                ) {
                    return {
                        default: obj,
                    };
                }
                var cache = _getRequireWildcardCache();
                if (cache && cache.has(obj)) {
                    return cache.get(obj);
                }
                var newObj = {};
                var hasPropertyDescriptor =
                    Object.defineProperty && Object.getOwnPropertyDescriptor;
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        var desc = hasPropertyDescriptor
                            ? Object.getOwnPropertyDescriptor(obj, key)
                            : null;
                        if (desc && (desc.get || desc.set)) {
                            Object.defineProperty(newObj, key, desc);
                        } else {
                            newObj[key] = obj[key];
                        }
                    }
                }
                newObj.default = obj;
                if (cache) {
                    cache.set(obj, newObj);
                }
                return newObj;
            }
            var isServer = "object" === "undefined";
            var useClientOnlyLayoutEffect = isServer
                ? function () {}
                : _react.useLayoutEffect;
            var useClientOnlyEffect = isServer
                ? function () {}
                : _react.useEffect; //# sourceMappingURL=side-effect.js.map

            /***/
        },

        /***/ 3794: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _async_to_generator =
                __webpack_require__(932) /* ["default"] */.Z;
            var _class_call_check =
                __webpack_require__(9658) /* ["default"] */.Z;
            var _inherits = __webpack_require__(7788) /* ["default"] */.Z;
            var _interop_require_default =
                __webpack_require__(2648) /* ["default"] */.Z;
            var _to_consumable_array =
                __webpack_require__(3929) /* ["default"] */.Z;
            var _wrap_native_super =
                __webpack_require__(9968) /* ["default"] */.Z;
            var _create_super = __webpack_require__(7735) /* ["default"] */.Z;
            var _runtimeJs = _interop_require_default(
                __webpack_require__(4051)
            );
            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.execOnce = execOnce;
            exports.getLocationOrigin = getLocationOrigin;
            exports.getURL = getURL;
            exports.getDisplayName = getDisplayName;
            exports.isResSent = isResSent;
            exports.normalizeRepeatedSlashes = normalizeRepeatedSlashes;
            exports.loadGetInitialProps = loadGetInitialProps;
            exports.ST =
                exports.SP =
                exports.warnOnce =
                exports.isAbsoluteUrl =
                    void 0;
            function execOnce(fn) {
                var used = false;
                var result;
                return function () {
                    for (
                        var _len = arguments.length,
                            args = new Array(_len),
                            _key = 0;
                        _key < _len;
                        _key++
                    ) {
                        args[_key] = arguments[_key];
                    }
                    if (!used) {
                        used = true;
                        result = fn.apply(void 0, _to_consumable_array(args));
                    }
                    return result;
                };
            }
            // Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
            // Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
            var ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
            var isAbsoluteUrl = function (url) {
                return ABSOLUTE_URL_REGEX.test(url);
            };
            exports.isAbsoluteUrl = isAbsoluteUrl;
            function getLocationOrigin() {
                var _location = window.location,
                    protocol = _location.protocol,
                    hostname = _location.hostname,
                    port = _location.port;
                return ""
                    .concat(protocol, "//")
                    .concat(hostname)
                    .concat(port ? ":" + port : "");
            }
            function getURL() {
                var href = window.location.href;
                var origin = getLocationOrigin();
                return href.substring(origin.length);
            }
            function getDisplayName(Component) {
                return typeof Component === "string"
                    ? Component
                    : Component.displayName || Component.name || "Unknown";
            }
            function isResSent(res) {
                return res.finished || res.headersSent;
            }
            function normalizeRepeatedSlashes(url) {
                var urlParts = url.split("?");
                var urlNoQuery = urlParts[0];
                return (
                    urlNoQuery // first we replace any non-encoded backslashes with forward
                        // then normalize repeated forward slashes
                        .replace(/\\/g, "/")
                        .replace(/\/\/+/g, "/") +
                    (urlParts[1] ? "?".concat(urlParts.slice(1).join("?")) : "")
                );
            }
            function loadGetInitialProps(App, ctx) {
                return _loadGetInitialProps.apply(this, arguments);
            }
            function _loadGetInitialProps() {
                _loadGetInitialProps = _async_to_generator(
                    _runtimeJs.default.mark(function _callee(App, ctx) {
                        var ref, message, res, props, message1;
                        return _runtimeJs.default.wrap(function _callee$(_ctx) {
                            while (1)
                                switch ((_ctx.prev = _ctx.next)) {
                                    case 0:
                                        if (true) {
                                            _ctx.next = 5;
                                            break;
                                        }
                                        if (
                                            !((ref = App.prototype) == null
                                                ? void 0
                                                : ref.getInitialProps)
                                        ) {
                                            _ctx.next = 5;
                                            break;
                                        }
                                        message = '"'.concat(
                                            getDisplayName(App),
                                            '.getInitialProps()" is defined as an instance method - visit https://nextjs.org/docs/messages/get-initial-props-as-an-instance-method for more information.'
                                        );
                                        throw new Error(message);
                                    case 5:
                                        res =
                                            ctx.res || (ctx.ctx && ctx.ctx.res);
                                        if (App.getInitialProps) {
                                            _ctx.next = 13;
                                            break;
                                        }
                                        if (!(ctx.ctx && ctx.Component)) {
                                            _ctx.next = 12;
                                            break;
                                        }
                                        _ctx.next = 10;
                                        return loadGetInitialProps(
                                            ctx.Component,
                                            ctx.ctx
                                        );
                                    case 10:
                                        _ctx.t0 = _ctx.sent;
                                        return _ctx.abrupt("return", {
                                            pageProps: _ctx.t0,
                                        });
                                    case 12:
                                        return _ctx.abrupt("return", {});
                                    case 13:
                                        _ctx.next = 15;
                                        return App.getInitialProps(ctx);
                                    case 15:
                                        props = _ctx.sent;
                                        if (!(res && isResSent(res))) {
                                            _ctx.next = 18;
                                            break;
                                        }
                                        return _ctx.abrupt("return", props);
                                    case 18:
                                        if (props) {
                                            _ctx.next = 21;
                                            break;
                                        }
                                        message1 = '"'
                                            .concat(
                                                getDisplayName(App),
                                                '.getInitialProps()" should resolve to an object. But found "'
                                            )
                                            .concat(props, '" instead.');
                                        throw new Error(message1);
                                    case 21:
                                        if (false) {
                                        }
                                        return _ctx.abrupt("return", props);
                                    case 23:
                                    case "end":
                                        return _ctx.stop();
                                }
                        }, _callee);
                    })
                );
                return _loadGetInitialProps.apply(this, arguments);
            }
            var warnOnce = function (_) {};
            if (false) {
                var warnings;
            }
            var SP = typeof performance !== "undefined";
            exports.SP = SP;
            var ST =
                SP &&
                typeof performance.mark === "function" &&
                typeof performance.measure === "function";
            exports.ST = ST;
            var DecodeError = /*#__PURE__*/ (function (Error1) {
                _inherits(DecodeError, Error1);
                var _super = _create_super(DecodeError);
                function DecodeError() {
                    _class_call_check(this, DecodeError);
                    return _super.apply(this, arguments);
                }
                return DecodeError;
            })(_wrap_native_super(Error));
            exports.DecodeError = DecodeError;
            var NormalizeError = /*#__PURE__*/ (function (Error1) {
                _inherits(NormalizeError, Error1);
                var _super = _create_super(NormalizeError);
                function NormalizeError() {
                    _class_call_check(this, NormalizeError);
                    return _super.apply(this, arguments);
                }
                return NormalizeError;
            })(_wrap_native_super(Error));
            exports.NormalizeError = NormalizeError;
            var PageNotFoundError = /*#__PURE__*/ (function (Error1) {
                _inherits(PageNotFoundError, Error1);
                var _super = _create_super(PageNotFoundError);
                function PageNotFoundError(page) {
                    _class_call_check(this, PageNotFoundError);
                    var _this;
                    _this = _super.call(this);
                    _this.code = "ENOENT";
                    _this.message = "Cannot find module for page: ".concat(
                        page
                    );
                    return _this;
                }
                return PageNotFoundError;
            })(_wrap_native_super(Error));
            exports.PageNotFoundError = PageNotFoundError;
            var MissingStaticPage = /*#__PURE__*/ (function (Error1) {
                _inherits(MissingStaticPage, Error1);
                var _super = _create_super(MissingStaticPage);
                function MissingStaticPage(page, message) {
                    _class_call_check(this, MissingStaticPage);
                    var _this;
                    _this = _super.call(this);
                    _this.message = "Failed to load static file for page: "
                        .concat(page, " ")
                        .concat(message);
                    return _this;
                }
                return MissingStaticPage;
            })(_wrap_native_super(Error));
            exports.MissingStaticPage = MissingStaticPage;
            var MiddlewareNotFoundError = /*#__PURE__*/ (function (Error1) {
                _inherits(MiddlewareNotFoundError, Error1);
                var _super = _create_super(MiddlewareNotFoundError);
                function MiddlewareNotFoundError() {
                    _class_call_check(this, MiddlewareNotFoundError);
                    var _this;
                    _this = _super.call(this);
                    _this.code = "ENOENT";
                    _this.message = "Cannot find the middleware module";
                    return _this;
                }
                return MiddlewareNotFoundError;
            })(_wrap_native_super(Error));
            exports.MiddlewareNotFoundError = MiddlewareNotFoundError;
            exports.warnOnce = warnOnce; //# sourceMappingURL=utils.js.map

            /***/
        },

        /***/ 4051: /***/ function (module) {
            /**
             * Copyright (c) 2014-present, Facebook, Inc.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */

            var runtime = (function (exports) {
                "use strict";

                var Op = Object.prototype;
                var hasOwn = Op.hasOwnProperty;
                var undefined; // More compressible than void 0.
                var $Symbol = typeof Symbol === "function" ? Symbol : {};
                var iteratorSymbol = $Symbol.iterator || "@@iterator";
                var asyncIteratorSymbol =
                    $Symbol.asyncIterator || "@@asyncIterator";
                var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

                function wrap(innerFn, outerFn, self, tryLocsList) {
                    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
                    var protoGenerator =
                        outerFn && outerFn.prototype instanceof Generator
                            ? outerFn
                            : Generator;
                    var generator = Object.create(protoGenerator.prototype);
                    var context = new Context(tryLocsList || []);

                    // The ._invoke method unifies the implementations of the .next,
                    // .throw, and .return methods.
                    generator._invoke = makeInvokeMethod(
                        innerFn,
                        self,
                        context
                    );

                    return generator;
                }
                exports.wrap = wrap;

                // Try/catch helper to minimize deoptimizations. Returns a completion
                // record like context.tryEntries[i].completion. This interface could
                // have been (and was previously) designed to take a closure to be
                // invoked without arguments, but in all the cases we care about we
                // already have an existing method we want to call, so there's no need
                // to create a new function object. We can even get away with assuming
                // the method takes exactly one argument, since that happens to be true
                // in every case, so we don't have to touch the arguments object. The
                // only additional allocation required is the completion record, which
                // has a stable shape and so hopefully should be cheap to allocate.
                function tryCatch(fn, obj, arg) {
                    try {
                        return { type: "normal", arg: fn.call(obj, arg) };
                    } catch (err) {
                        return { type: "throw", arg: err };
                    }
                }

                var GenStateSuspendedStart = "suspendedStart";
                var GenStateSuspendedYield = "suspendedYield";
                var GenStateExecuting = "executing";
                var GenStateCompleted = "completed";

                // Returning this object from the innerFn has the same effect as
                // breaking out of the dispatch switch statement.
                var ContinueSentinel = {};

                // Dummy constructor functions that we use as the .constructor and
                // .constructor.prototype properties for functions that return Generator
                // objects. For full spec compliance, you may wish to configure your
                // minifier not to mangle the names of these two functions.
                function Generator() {}
                function GeneratorFunction() {}
                function GeneratorFunctionPrototype() {}

                // This is a polyfill for %IteratorPrototype% for environments that
                // don't natively support it.
                var IteratorPrototype = {};
                IteratorPrototype[iteratorSymbol] = function () {
                    return this;
                };

                var getProto = Object.getPrototypeOf;
                var NativeIteratorPrototype =
                    getProto && getProto(getProto(values([])));
                if (
                    NativeIteratorPrototype &&
                    NativeIteratorPrototype !== Op &&
                    hasOwn.call(NativeIteratorPrototype, iteratorSymbol)
                ) {
                    // This environment has a native %IteratorPrototype%; use it instead
                    // of the polyfill.
                    IteratorPrototype = NativeIteratorPrototype;
                }

                var Gp =
                    (GeneratorFunctionPrototype.prototype =
                    Generator.prototype =
                        Object.create(IteratorPrototype));
                GeneratorFunction.prototype = Gp.constructor =
                    GeneratorFunctionPrototype;
                GeneratorFunctionPrototype.constructor = GeneratorFunction;
                GeneratorFunctionPrototype[toStringTagSymbol] =
                    GeneratorFunction.displayName = "GeneratorFunction";

                // Helper for defining the .next, .throw, and .return methods of the
                // Iterator interface in terms of a single ._invoke method.
                function defineIteratorMethods(prototype) {
                    ["next", "throw", "return"].forEach(function (method) {
                        prototype[method] = function (arg) {
                            return this._invoke(method, arg);
                        };
                    });
                }

                exports.isGeneratorFunction = function (genFun) {
                    var ctor =
                        typeof genFun === "function" && genFun.constructor;
                    return ctor
                        ? ctor === GeneratorFunction ||
                              // For the native GeneratorFunction constructor, the best we can
                              // do is to check its .name property.
                              (ctor.displayName || ctor.name) ===
                                  "GeneratorFunction"
                        : false;
                };

                exports.mark = function (genFun) {
                    if (Object.setPrototypeOf) {
                        Object.setPrototypeOf(
                            genFun,
                            GeneratorFunctionPrototype
                        );
                    } else {
                        genFun.__proto__ = GeneratorFunctionPrototype;
                        if (!(toStringTagSymbol in genFun)) {
                            genFun[toStringTagSymbol] = "GeneratorFunction";
                        }
                    }
                    genFun.prototype = Object.create(Gp);
                    return genFun;
                };

                // Within the body of any async function, `await x` is transformed to
                // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
                // `hasOwn.call(value, "__await")` to determine if the yielded value is
                // meant to be awaited.
                exports.awrap = function (arg) {
                    return { __await: arg };
                };

                function AsyncIterator(generator, PromiseImpl) {
                    function invoke(method, arg, resolve, reject) {
                        var record = tryCatch(
                            generator[method],
                            generator,
                            arg
                        );
                        if (record.type === "throw") {
                            reject(record.arg);
                        } else {
                            var result = record.arg;
                            var value = result.value;
                            if (
                                value &&
                                typeof value === "object" &&
                                hasOwn.call(value, "__await")
                            ) {
                                return PromiseImpl.resolve(value.__await).then(
                                    function (value) {
                                        invoke("next", value, resolve, reject);
                                    },
                                    function (err) {
                                        invoke("throw", err, resolve, reject);
                                    }
                                );
                            }

                            return PromiseImpl.resolve(value).then(
                                function (unwrapped) {
                                    // When a yielded Promise is resolved, its final value becomes
                                    // the .value of the Promise<{value,done}> result for the
                                    // current iteration.
                                    result.value = unwrapped;
                                    resolve(result);
                                },
                                function (error) {
                                    // If a rejected Promise was yielded, throw the rejection back
                                    // into the async generator function so it can be handled there.
                                    return invoke(
                                        "throw",
                                        error,
                                        resolve,
                                        reject
                                    );
                                }
                            );
                        }
                    }

                    var previousPromise;

                    function enqueue(method, arg) {
                        function callInvokeWithMethodAndArg() {
                            return new PromiseImpl(function (resolve, reject) {
                                invoke(method, arg, resolve, reject);
                            });
                        }

                        return (previousPromise =
                            // If enqueue has been called before, then we want to wait until
                            // all previous Promises have been resolved before calling invoke,
                            // so that results are always delivered in the correct order. If
                            // enqueue has not been called before, then it is important to
                            // call invoke immediately, without waiting on a callback to fire,
                            // so that the async generator function has the opportunity to do
                            // any necessary setup in a predictable way. This predictability
                            // is why the Promise constructor synchronously invokes its
                            // executor callback, and why async functions synchronously
                            // execute code before the first await. Since we implement simple
                            // async functions in terms of async generators, it is especially
                            // important to get this right, even though it requires care.
                            previousPromise
                                ? previousPromise.then(
                                      callInvokeWithMethodAndArg,
                                      // Avoid propagating failures to Promises returned by later
                                      // invocations of the iterator.
                                      callInvokeWithMethodAndArg
                                  )
                                : callInvokeWithMethodAndArg());
                    }

                    // Define the unified helper method that is used to implement .next,
                    // .throw, and .return (see defineIteratorMethods).
                    this._invoke = enqueue;
                }

                defineIteratorMethods(AsyncIterator.prototype);
                AsyncIterator.prototype[asyncIteratorSymbol] = function () {
                    return this;
                };
                exports.AsyncIterator = AsyncIterator;

                // Note that simple async functions are implemented on top of
                // AsyncIterator objects; they just return a Promise for the value of
                // the final result produced by the iterator.
                exports.async = function (
                    innerFn,
                    outerFn,
                    self,
                    tryLocsList,
                    PromiseImpl
                ) {
                    if (PromiseImpl === void 0) PromiseImpl = Promise;

                    var iter = new AsyncIterator(
                        wrap(innerFn, outerFn, self, tryLocsList),
                        PromiseImpl
                    );

                    return exports.isGeneratorFunction(outerFn)
                        ? iter // If outerFn is a generator, return the full iterator.
                        : iter.next().then(function (result) {
                              return result.done ? result.value : iter.next();
                          });
                };

                function makeInvokeMethod(innerFn, self, context) {
                    var state = GenStateSuspendedStart;

                    return function invoke(method, arg) {
                        if (state === GenStateExecuting) {
                            throw new Error("Generator is already running");
                        }

                        if (state === GenStateCompleted) {
                            if (method === "throw") {
                                throw arg;
                            }

                            // Be forgiving, per 25.3.3.3.3 of the spec:
                            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
                            return doneResult();
                        }

                        context.method = method;
                        context.arg = arg;

                        while (true) {
                            var delegate = context.delegate;
                            if (delegate) {
                                var delegateResult = maybeInvokeDelegate(
                                    delegate,
                                    context
                                );
                                if (delegateResult) {
                                    if (delegateResult === ContinueSentinel)
                                        continue;
                                    return delegateResult;
                                }
                            }

                            if (context.method === "next") {
                                // Setting context._sent for legacy support of Babel's
                                // function.sent implementation.
                                context.sent = context._sent = context.arg;
                            } else if (context.method === "throw") {
                                if (state === GenStateSuspendedStart) {
                                    state = GenStateCompleted;
                                    throw context.arg;
                                }

                                context.dispatchException(context.arg);
                            } else if (context.method === "return") {
                                context.abrupt("return", context.arg);
                            }

                            state = GenStateExecuting;

                            var record = tryCatch(innerFn, self, context);
                            if (record.type === "normal") {
                                // If an exception is thrown from innerFn, we leave state ===
                                // GenStateExecuting and loop back for another invocation.
                                state = context.done
                                    ? GenStateCompleted
                                    : GenStateSuspendedYield;

                                if (record.arg === ContinueSentinel) {
                                    continue;
                                }

                                return {
                                    value: record.arg,
                                    done: context.done,
                                };
                            } else if (record.type === "throw") {
                                state = GenStateCompleted;
                                // Dispatch the exception by looping back around to the
                                // context.dispatchException(context.arg) call above.
                                context.method = "throw";
                                context.arg = record.arg;
                            }
                        }
                    };
                }

                // Call delegate.iterator[context.method](context.arg) and handle the
                // result, either by returning a { value, done } result from the
                // delegate iterator, or by modifying context.method and context.arg,
                // setting context.delegate to null, and returning the ContinueSentinel.
                function maybeInvokeDelegate(delegate, context) {
                    var method = delegate.iterator[context.method];
                    if (method === undefined) {
                        // A .throw or .return when the delegate iterator has no .throw
                        // method always terminates the yield* loop.
                        context.delegate = null;

                        if (context.method === "throw") {
                            // Note: ["return"] must be used for ES3 parsing compatibility.
                            if (delegate.iterator["return"]) {
                                // If the delegate iterator has a return method, give it a
                                // chance to clean up.
                                context.method = "return";
                                context.arg = undefined;
                                maybeInvokeDelegate(delegate, context);

                                if (context.method === "throw") {
                                    // If maybeInvokeDelegate(context) changed context.method from
                                    // "return" to "throw", let that override the TypeError below.
                                    return ContinueSentinel;
                                }
                            }

                            context.method = "throw";
                            context.arg = new TypeError(
                                "The iterator does not provide a 'throw' method"
                            );
                        }

                        return ContinueSentinel;
                    }

                    var record = tryCatch(
                        method,
                        delegate.iterator,
                        context.arg
                    );

                    if (record.type === "throw") {
                        context.method = "throw";
                        context.arg = record.arg;
                        context.delegate = null;
                        return ContinueSentinel;
                    }

                    var info = record.arg;

                    if (!info) {
                        context.method = "throw";
                        context.arg = new TypeError(
                            "iterator result is not an object"
                        );
                        context.delegate = null;
                        return ContinueSentinel;
                    }

                    if (info.done) {
                        // Assign the result of the finished delegate to the temporary
                        // variable specified by delegate.resultName (see delegateYield).
                        context[delegate.resultName] = info.value;

                        // Resume execution at the desired location (see delegateYield).
                        context.next = delegate.nextLoc;

                        // If context.method was "throw" but the delegate handled the
                        // exception, let the outer generator proceed normally. If
                        // context.method was "next", forget context.arg since it has been
                        // "consumed" by the delegate iterator. If context.method was
                        // "return", allow the original .return call to continue in the
                        // outer generator.
                        if (context.method !== "return") {
                            context.method = "next";
                            context.arg = undefined;
                        }
                    } else {
                        // Re-yield the result returned by the delegate method.
                        return info;
                    }

                    // The delegate iterator is finished, so forget it and continue with
                    // the outer generator.
                    context.delegate = null;
                    return ContinueSentinel;
                }

                // Define Generator.prototype.{next,throw,return} in terms of the
                // unified ._invoke helper method.
                defineIteratorMethods(Gp);

                Gp[toStringTagSymbol] = "Generator";

                // A Generator should always return itself as the iterator object when the
                // @@iterator function is called on it. Some browsers' implementations of the
                // iterator prototype chain incorrectly implement this, causing the Generator
                // object to not be returned from this call. This ensures that doesn't happen.
                // See https://github.com/facebook/regenerator/issues/274 for more details.
                Gp[iteratorSymbol] = function () {
                    return this;
                };

                Gp.toString = function () {
                    return "[object Generator]";
                };

                function pushTryEntry(locs) {
                    var entry = { tryLoc: locs[0] };

                    if (1 in locs) {
                        entry.catchLoc = locs[1];
                    }

                    if (2 in locs) {
                        entry.finallyLoc = locs[2];
                        entry.afterLoc = locs[3];
                    }

                    this.tryEntries.push(entry);
                }

                function resetTryEntry(entry) {
                    var record = entry.completion || {};
                    record.type = "normal";
                    delete record.arg;
                    entry.completion = record;
                }

                function Context(tryLocsList) {
                    // The root entry object (effectively a try statement without a catch
                    // or a finally block) gives us a place to store values thrown from
                    // locations where there is no enclosing try statement.
                    this.tryEntries = [{ tryLoc: "root" }];
                    tryLocsList.forEach(pushTryEntry, this);
                    this.reset(true);
                }

                exports.keys = function (object) {
                    var keys = [];
                    for (var key in object) {
                        keys.push(key);
                    }
                    keys.reverse();

                    // Rather than returning an object with a next method, we keep
                    // things simple and return the next function itself.
                    return function next() {
                        while (keys.length) {
                            var key = keys.pop();
                            if (key in object) {
                                next.value = key;
                                next.done = false;
                                return next;
                            }
                        }

                        // To avoid creating an additional object, we just hang the .value
                        // and .done properties off the next function object itself. This
                        // also ensures that the minifier will not anonymize the function.
                        next.done = true;
                        return next;
                    };
                };

                function values(iterable) {
                    if (iterable) {
                        var iteratorMethod = iterable[iteratorSymbol];
                        if (iteratorMethod) {
                            return iteratorMethod.call(iterable);
                        }

                        if (typeof iterable.next === "function") {
                            return iterable;
                        }

                        if (!isNaN(iterable.length)) {
                            var i = -1,
                                next = function next() {
                                    while (++i < iterable.length) {
                                        if (hasOwn.call(iterable, i)) {
                                            next.value = iterable[i];
                                            next.done = false;
                                            return next;
                                        }
                                    }

                                    next.value = undefined;
                                    next.done = true;

                                    return next;
                                };

                            return (next.next = next);
                        }
                    }

                    // Return an iterator with no values.
                    return { next: doneResult };
                }
                exports.values = values;

                function doneResult() {
                    return { value: undefined, done: true };
                }

                Context.prototype = {
                    constructor: Context,

                    reset: function (skipTempReset) {
                        this.prev = 0;
                        this.next = 0;
                        // Resetting context._sent for legacy support of Babel's
                        // function.sent implementation.
                        this.sent = this._sent = undefined;
                        this.done = false;
                        this.delegate = null;

                        this.method = "next";
                        this.arg = undefined;

                        this.tryEntries.forEach(resetTryEntry);

                        if (!skipTempReset) {
                            for (var name in this) {
                                // Not sure about the optimal order of these conditions:
                                if (
                                    name.charAt(0) === "t" &&
                                    hasOwn.call(this, name) &&
                                    !isNaN(+name.slice(1))
                                ) {
                                    this[name] = undefined;
                                }
                            }
                        }
                    },

                    stop: function () {
                        this.done = true;

                        var rootEntry = this.tryEntries[0];
                        var rootRecord = rootEntry.completion;
                        if (rootRecord.type === "throw") {
                            throw rootRecord.arg;
                        }

                        return this.rval;
                    },

                    dispatchException: function (exception) {
                        if (this.done) {
                            throw exception;
                        }

                        var context = this;
                        function handle(loc, caught) {
                            record.type = "throw";
                            record.arg = exception;
                            context.next = loc;

                            if (caught) {
                                // If the dispatched exception was caught by a catch block,
                                // then let that catch block handle the exception normally.
                                context.method = "next";
                                context.arg = undefined;
                            }

                            return !!caught;
                        }

                        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                            var entry = this.tryEntries[i];
                            var record = entry.completion;

                            if (entry.tryLoc === "root") {
                                // Exception thrown outside of any try block that could handle
                                // it, so set the completion value of the entire function to
                                // throw the exception.
                                return handle("end");
                            }

                            if (entry.tryLoc <= this.prev) {
                                var hasCatch = hasOwn.call(entry, "catchLoc");
                                var hasFinally = hasOwn.call(
                                    entry,
                                    "finallyLoc"
                                );

                                if (hasCatch && hasFinally) {
                                    if (this.prev < entry.catchLoc) {
                                        return handle(entry.catchLoc, true);
                                    } else if (this.prev < entry.finallyLoc) {
                                        return handle(entry.finallyLoc);
                                    }
                                } else if (hasCatch) {
                                    if (this.prev < entry.catchLoc) {
                                        return handle(entry.catchLoc, true);
                                    }
                                } else if (hasFinally) {
                                    if (this.prev < entry.finallyLoc) {
                                        return handle(entry.finallyLoc);
                                    }
                                } else {
                                    throw new Error(
                                        "try statement without catch or finally"
                                    );
                                }
                            }
                        }
                    },

                    abrupt: function (type, arg) {
                        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                            var entry = this.tryEntries[i];
                            if (
                                entry.tryLoc <= this.prev &&
                                hasOwn.call(entry, "finallyLoc") &&
                                this.prev < entry.finallyLoc
                            ) {
                                var finallyEntry = entry;
                                break;
                            }
                        }

                        if (
                            finallyEntry &&
                            (type === "break" || type === "continue") &&
                            finallyEntry.tryLoc <= arg &&
                            arg <= finallyEntry.finallyLoc
                        ) {
                            // Ignore the finally entry if control is not jumping to a
                            // location outside the try/catch block.
                            finallyEntry = null;
                        }

                        var record = finallyEntry
                            ? finallyEntry.completion
                            : {};
                        record.type = type;
                        record.arg = arg;

                        if (finallyEntry) {
                            this.method = "next";
                            this.next = finallyEntry.finallyLoc;
                            return ContinueSentinel;
                        }

                        return this.complete(record);
                    },

                    complete: function (record, afterLoc) {
                        if (record.type === "throw") {
                            throw record.arg;
                        }

                        if (
                            record.type === "break" ||
                            record.type === "continue"
                        ) {
                            this.next = record.arg;
                        } else if (record.type === "return") {
                            this.rval = this.arg = record.arg;
                            this.method = "return";
                            this.next = "end";
                        } else if (record.type === "normal" && afterLoc) {
                            this.next = afterLoc;
                        }

                        return ContinueSentinel;
                    },

                    finish: function (finallyLoc) {
                        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                            var entry = this.tryEntries[i];
                            if (entry.finallyLoc === finallyLoc) {
                                this.complete(entry.completion, entry.afterLoc);
                                resetTryEntry(entry);
                                return ContinueSentinel;
                            }
                        }
                    },

                    catch: function (tryLoc) {
                        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                            var entry = this.tryEntries[i];
                            if (entry.tryLoc === tryLoc) {
                                var record = entry.completion;
                                if (record.type === "throw") {
                                    var thrown = record.arg;
                                    resetTryEntry(entry);
                                }
                                return thrown;
                            }
                        }

                        // The context.catch method must only be called with a location
                        // argument that corresponds to a known catch block.
                        throw new Error("illegal catch attempt");
                    },

                    delegateYield: function (iterable, resultName, nextLoc) {
                        this.delegate = {
                            iterator: values(iterable),
                            resultName: resultName,
                            nextLoc: nextLoc,
                        };

                        if (this.method === "next") {
                            // Deliberately forget the last sent value so that we don't
                            // accidentally pass it on to the delegate.
                            this.arg = undefined;
                        }

                        return ContinueSentinel;
                    },
                };

                // Regardless of whether this script is executing as a CommonJS module
                // or not, return the runtime object so that we can declare the variable
                // regeneratorRuntime in the outer scope, which allows this module to be
                // injected easily by `bin/regenerator --include-runtime script.js`.
                return exports;
            })(
                // If this script is executing as a CommonJS module, use module.exports
                // as the regeneratorRuntime namespace. Otherwise create a new empty
                // object. Either way, the resulting object will be used to initialize
                // the regeneratorRuntime variable at the top of this file.
                true ? module.exports : 0
            );

            try {
                regeneratorRuntime = runtime;
            } catch (accidentalStrictMode) {
                // This module should not be running in strict mode, so the above
                // assignment should always work unless something is misconfigured. Just
                // in case runtime.js accidentally runs in strict mode, we can escape
                // strict mode using a global Function call. This could conceivably fail
                // if a Content Security Policy forbids using Function, but in that case
                // the proper solution is to fix the accidental strict mode problem. If
                // you've misconfigured your bundler to force strict mode and applied a
                // CSP to forbid Function, and you're not willing to fix either of those
                // problems, please detail your unique predicament in a GitHub issue.
                Function("r", "regeneratorRuntime = r")(runtime);
            }

            /***/
        },

        /***/ 8745: /***/ function (module) {
            var __dirname = "/";
            (function () {
                var e = {
                    61: function (e, n) {
                        !(function (e, o) {
                            true ? o(n) : 0;
                        })(this, function (e) {
                            "use strict";
                            var n,
                                o,
                                y,
                                T,
                                w,
                                C = !1,
                                c = function (e) {
                                    addEventListener(
                                        "pageshow",
                                        function (n) {
                                            n.persisted && ((C = !0), e(n));
                                        },
                                        !0
                                    );
                                },
                                u = function () {
                                    return (
                                        window.performance &&
                                        ((performance.getEntriesByType &&
                                            performance.getEntriesByType(
                                                "navigation"
                                            )[0]) ||
                                            (function () {
                                                var e = performance.timing,
                                                    n = {
                                                        entryType: "navigation",
                                                        startTime: 0,
                                                    };
                                                for (var o in e)
                                                    "navigationStart" !== o &&
                                                        "toJSON" !== o &&
                                                        (n[o] = Math.max(
                                                            e[o] -
                                                                e.navigationStart,
                                                            0
                                                        ));
                                                return n;
                                            })())
                                    );
                                },
                                f = function (e, n) {
                                    var o = u();
                                    return {
                                        name: e,
                                        value: void 0 === n ? -1 : n,
                                        delta: 0,
                                        entries: [],
                                        id: "v2-"
                                            .concat(Date.now(), "-")
                                            .concat(
                                                Math.floor(
                                                    8999999999999 *
                                                        Math.random()
                                                ) + 1e12
                                            ),
                                        navigationType: C
                                            ? "back_forward_cache"
                                            : o && o.type,
                                    };
                                },
                                s = function (e, n, o) {
                                    try {
                                        if (
                                            PerformanceObserver.supportedEntryTypes.includes(
                                                e
                                            )
                                        ) {
                                            var y = new PerformanceObserver(
                                                function (e) {
                                                    n(e.getEntries());
                                                }
                                            );
                                            return (
                                                y.observe(
                                                    Object.assign(
                                                        {
                                                            type: e,
                                                            buffered: !0,
                                                        },
                                                        o || {}
                                                    )
                                                ),
                                                y
                                            );
                                        }
                                    } catch (e) {}
                                },
                                l = function (e, n) {
                                    var o = function t(o) {
                                        ("pagehide" !== o.type &&
                                            "hidden" !==
                                                document.visibilityState) ||
                                            (e(o),
                                            n &&
                                                (removeEventListener(
                                                    "visibilitychange",
                                                    t,
                                                    !0
                                                ),
                                                removeEventListener(
                                                    "pagehide",
                                                    t,
                                                    !0
                                                )));
                                    };
                                    addEventListener("visibilitychange", o, !0),
                                        addEventListener("pagehide", o, !0);
                                },
                                d = function (e, n, o) {
                                    var y;
                                    return function (T) {
                                        n.value >= 0 &&
                                            (T || o) &&
                                            ((n.delta = n.value - (y || 0)),
                                            (n.delta || void 0 === y) &&
                                                ((y = n.value), e(n)));
                                    };
                                },
                                I = -1,
                                v = function () {
                                    return "hidden" === document.visibilityState
                                        ? 0
                                        : 1 / 0;
                                },
                                m = function () {
                                    l(function (e) {
                                        var n = e.timeStamp;
                                        I = n;
                                    }, !0);
                                },
                                h = function () {
                                    return (
                                        I < 0 &&
                                            ((I = v()),
                                            m(),
                                            c(function () {
                                                setTimeout(function () {
                                                    (I = v()), m();
                                                }, 0);
                                            })),
                                        {
                                            get firstHiddenTime() {
                                                return I;
                                            },
                                        }
                                    );
                                },
                                g = function (e, n) {
                                    n = n || {};
                                    var o,
                                        y = h(),
                                        T = f("FCP"),
                                        a = function (e) {
                                            e.forEach(function (e) {
                                                "first-contentful-paint" ===
                                                    e.name &&
                                                    (C && C.disconnect(),
                                                    e.startTime <
                                                        y.firstHiddenTime &&
                                                        ((T.value =
                                                            e.startTime),
                                                        T.entries.push(e),
                                                        o(!0)));
                                            });
                                        },
                                        w =
                                            window.performance &&
                                            window.performance
                                                .getEntriesByName &&
                                            window.performance.getEntriesByName(
                                                "first-contentful-paint"
                                            )[0],
                                        C = w ? null : s("paint", a);
                                    (w || C) &&
                                        ((o = d(e, T, n.reportAllChanges)),
                                        w && a([w]),
                                        c(function (y) {
                                            (T = f("FCP")),
                                                (o = d(
                                                    e,
                                                    T,
                                                    n.reportAllChanges
                                                )),
                                                requestAnimationFrame(
                                                    function () {
                                                        requestAnimationFrame(
                                                            function () {
                                                                (T.value =
                                                                    performance.now() -
                                                                    y.timeStamp),
                                                                    o(!0);
                                                            }
                                                        );
                                                    }
                                                );
                                        }));
                                },
                                P = !1,
                                M = -1,
                                E = function (e, n) {
                                    (n = n || {}),
                                        P ||
                                            (g(function (e) {
                                                M = e.value;
                                            }),
                                            (P = !0));
                                    var o,
                                        i = function (n) {
                                            M > -1 && e(n);
                                        },
                                        y = f("CLS", 0),
                                        T = 0,
                                        w = [],
                                        u = function (e) {
                                            e.forEach(function (e) {
                                                if (!e.hadRecentInput) {
                                                    var n = w[0],
                                                        C = w[w.length - 1];
                                                    T &&
                                                    e.startTime - C.startTime <
                                                        1e3 &&
                                                    e.startTime - n.startTime <
                                                        5e3
                                                        ? ((T += e.value),
                                                          w.push(e))
                                                        : ((T = e.value),
                                                          (w = [e])),
                                                        T > y.value &&
                                                            ((y.value = T),
                                                            (y.entries = w),
                                                            o());
                                                }
                                            });
                                        },
                                        C = s("layout-shift", u);
                                    C &&
                                        ((o = d(i, y, n.reportAllChanges)),
                                        l(function () {
                                            u(C.takeRecords()), o(!0);
                                        }),
                                        c(function () {
                                            (T = 0),
                                                (M = -1),
                                                (y = f("CLS", 0)),
                                                (o = d(
                                                    i,
                                                    y,
                                                    n.reportAllChanges
                                                ));
                                        }));
                                },
                                N = { passive: !0, capture: !0 },
                                O = new Date(),
                                L = function (e, T) {
                                    n ||
                                        ((n = T),
                                        (o = e),
                                        (y = new Date()),
                                        A(removeEventListener),
                                        S());
                                },
                                S = function () {
                                    if (o >= 0 && o < y - O) {
                                        var e = {
                                            entryType: "first-input",
                                            name: n.type,
                                            target: n.target,
                                            cancelable: n.cancelable,
                                            startTime: n.timeStamp,
                                            processingStart: n.timeStamp + o,
                                        };
                                        T.forEach(function (n) {
                                            n(e);
                                        }),
                                            (T = []);
                                    }
                                },
                                b = function (e) {
                                    if (e.cancelable) {
                                        var n =
                                            (e.timeStamp > 1e12
                                                ? new Date()
                                                : performance.now()) -
                                            e.timeStamp;
                                        "pointerdown" == e.type
                                            ? (function (e, n) {
                                                  var t = function () {
                                                          L(e, n), r();
                                                      },
                                                      i = function () {
                                                          r();
                                                      },
                                                      r = function () {
                                                          removeEventListener(
                                                              "pointerup",
                                                              t,
                                                              N
                                                          ),
                                                              removeEventListener(
                                                                  "pointercancel",
                                                                  i,
                                                                  N
                                                              );
                                                      };
                                                  addEventListener(
                                                      "pointerup",
                                                      t,
                                                      N
                                                  ),
                                                      addEventListener(
                                                          "pointercancel",
                                                          i,
                                                          N
                                                      );
                                              })(n, e)
                                            : L(n, e);
                                    }
                                },
                                A = function (e) {
                                    [
                                        "mousedown",
                                        "keydown",
                                        "touchstart",
                                        "pointerdown",
                                    ].forEach(function (n) {
                                        return e(n, b, N);
                                    });
                                },
                                F = function (e, y) {
                                    y = y || {};
                                    var w,
                                        C = h(),
                                        I = f("FID"),
                                        p = function (e) {
                                            e.startTime < C.firstHiddenTime &&
                                                ((I.value =
                                                    e.processingStart -
                                                    e.startTime),
                                                I.entries.push(e),
                                                w(!0));
                                        },
                                        v = function (e) {
                                            e.forEach(p);
                                        },
                                        P = s("first-input", v);
                                    (w = d(e, I, y.reportAllChanges)),
                                        P &&
                                            l(function () {
                                                v(P.takeRecords()),
                                                    P.disconnect();
                                            }, !0),
                                        P &&
                                            c(function () {
                                                var C;
                                                (I = f("FID")),
                                                    (w = d(
                                                        e,
                                                        I,
                                                        y.reportAllChanges
                                                    )),
                                                    (T = []),
                                                    (o = -1),
                                                    (n = null),
                                                    A(addEventListener),
                                                    (C = p),
                                                    T.push(C),
                                                    S();
                                            });
                                },
                                R = 0,
                                H = 1 / 0,
                                J = 0,
                                k = function (e) {
                                    e.forEach(function (e) {
                                        e.interactionId &&
                                            ((H = Math.min(H, e.interactionId)),
                                            (J = Math.max(J, e.interactionId)),
                                            (R = J ? (J - H) / 7 + 1 : 0));
                                    });
                                },
                                B = function () {
                                    return w
                                        ? R
                                        : performance.interactionCount || 0;
                                },
                                D = function () {
                                    "interactionCount" in performance ||
                                        w ||
                                        (w = s("event", k, {
                                            type: "event",
                                            buffered: !0,
                                            durationThreshold: 0,
                                        }));
                                },
                                z = 0,
                                x = function () {
                                    return B() - z;
                                },
                                G = [],
                                K = {},
                                q = function (e, n) {
                                    (n = n || {}), D();
                                    var o,
                                        y = f("INP"),
                                        r = function (e) {
                                            e.forEach(function (e) {
                                                e.interactionId &&
                                                    (function (e) {
                                                        var n = G[G.length - 1],
                                                            o =
                                                                K[
                                                                    e
                                                                        .interactionId
                                                                ];
                                                        if (
                                                            o ||
                                                            G.length < 10 ||
                                                            e.duration >
                                                                n.latency
                                                        ) {
                                                            if (o)
                                                                o.entries.push(
                                                                    e
                                                                ),
                                                                    (o.latency =
                                                                        Math.max(
                                                                            o.latency,
                                                                            e.duration
                                                                        ));
                                                            else {
                                                                var y = {
                                                                    id: e.interactionId,
                                                                    latency:
                                                                        e.duration,
                                                                    entries: [
                                                                        e,
                                                                    ],
                                                                };
                                                                (K[y.id] = y),
                                                                    G.push(y);
                                                            }
                                                            G.sort(function (
                                                                e,
                                                                n
                                                            ) {
                                                                return (
                                                                    n.latency -
                                                                    e.latency
                                                                );
                                                            }),
                                                                G.splice(
                                                                    10
                                                                ).forEach(
                                                                    function (
                                                                        e
                                                                    ) {
                                                                        delete K[
                                                                            e.id
                                                                        ];
                                                                    }
                                                                );
                                                        }
                                                    })(e);
                                            });
                                            var n,
                                                T =
                                                    ((n = Math.min(
                                                        G.length - 1,
                                                        Math.floor(x() / 50)
                                                    )),
                                                    G[n]);
                                            T &&
                                                T.latency !== y.value &&
                                                ((y.value = T.latency),
                                                (y.entries = T.entries),
                                                o());
                                        },
                                        T = s("event", r, {
                                            durationThreshold:
                                                n.durationThreshold || 40,
                                        });
                                    (o = d(e, y, n.reportAllChanges)),
                                        T &&
                                            (l(function () {
                                                r(T.takeRecords()),
                                                    y.value < 0 &&
                                                        x() > 0 &&
                                                        ((y.value = 0),
                                                        (y.entries = [])),
                                                    o(!0);
                                            }),
                                            c(function () {
                                                (G = []),
                                                    (z = B()),
                                                    (y = f("INP")),
                                                    (o = d(
                                                        e,
                                                        y,
                                                        n.reportAllChanges
                                                    ));
                                            }));
                                },
                                Q = {},
                                _ = function (e, n) {
                                    n = n || {};
                                    var o,
                                        y = h(),
                                        T = f("LCP"),
                                        a = function (e) {
                                            var n = e[e.length - 1];
                                            if (n) {
                                                var w = n.startTime;
                                                w < y.firstHiddenTime &&
                                                    ((T.value = w),
                                                    (T.entries = [n]),
                                                    o());
                                            }
                                        },
                                        w = s("largest-contentful-paint", a);
                                    if (w) {
                                        o = d(e, T, n.reportAllChanges);
                                        var u = function () {
                                            Q[T.id] ||
                                                (a(w.takeRecords()),
                                                w.disconnect(),
                                                (Q[T.id] = !0),
                                                o(!0));
                                        };
                                        ["keydown", "click"].forEach(function (
                                            e
                                        ) {
                                            addEventListener(e, u, {
                                                once: !0,
                                                capture: !0,
                                            });
                                        }),
                                            l(u, !0),
                                            c(function (y) {
                                                (T = f("LCP")),
                                                    (o = d(
                                                        e,
                                                        T,
                                                        n.reportAllChanges
                                                    )),
                                                    requestAnimationFrame(
                                                        function () {
                                                            requestAnimationFrame(
                                                                function () {
                                                                    (T.value =
                                                                        performance.now() -
                                                                        y.timeStamp),
                                                                        (Q[
                                                                            T.id
                                                                        ] = !0),
                                                                        o(!0);
                                                                }
                                                            );
                                                        }
                                                    );
                                            });
                                    }
                                },
                                j = function (e, n) {
                                    n = n || {};
                                    var o,
                                        y = f("TTFB"),
                                        T = d(e, y, n.reportAllChanges);
                                    (o = function () {
                                        var e = u();
                                        if (e) {
                                            if (
                                                ((y.value = e.responseStart),
                                                y.value < 0 ||
                                                    y.value > performance.now())
                                            )
                                                return;
                                            (y.entries = [e]), T(!0);
                                        }
                                    }),
                                        "complete" === document.readyState
                                            ? setTimeout(o, 0)
                                            : addEventListener(
                                                  "load",
                                                  function () {
                                                      return setTimeout(o, 0);
                                                  }
                                              ),
                                        c(function (o) {
                                            (y = f("TTFB")),
                                                (T = d(
                                                    e,
                                                    y,
                                                    n.reportAllChanges
                                                )),
                                                (y.value =
                                                    performance.now() -
                                                    o.timeStamp),
                                                T(!0);
                                        });
                                };
                            (e.getCLS = E),
                                (e.getFCP = g),
                                (e.getFID = F),
                                (e.getINP = q),
                                (e.getLCP = _),
                                (e.getTTFB = j),
                                (e.onCLS = E),
                                (e.onFCP = g),
                                (e.onFID = F),
                                (e.onINP = q),
                                (e.onLCP = _),
                                (e.onTTFB = j),
                                Object.defineProperty(e, "__esModule", {
                                    value: !0,
                                });
                        });
                    },
                };
                if (typeof __nccwpck_require__ !== "undefined")
                    __nccwpck_require__.ab = __dirname + "/";
                var n = {};
                e[61](0, n);
                module.exports = n;
            })();

            /***/
        },

        /***/ 676: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports["default"] = isError;
            exports.getProperError = getProperError;
            var _isPlainObject = __webpack_require__(8887);
            function isError(err) {
                return (
                    typeof err === "object" &&
                    err !== null &&
                    "name" in err &&
                    "message" in err
                );
            }
            function getProperError(err) {
                if (isError(err)) {
                    return err;
                }
                if (false) {
                }
                return new Error(
                    (0, _isPlainObject).isPlainObject(err)
                        ? JSON.stringify(err)
                        : err + ""
                );
            }

            //# sourceMappingURL=is-error.js.map

            /***/
        },

        /***/ 2431: /***/ function () {
            /* (ignored) */
            /***/
        },
    },
    /******/ function (__webpack_require__) {
        // webpackRuntimeModules
        /******/ var __webpack_exec__ = function (moduleId) {
            return __webpack_require__((__webpack_require__.s = moduleId));
        };
        /******/ __webpack_require__.O(0, [774], function () {
            return __webpack_exec__(2870);
        });
        /******/ var __webpack_exports__ = __webpack_require__.O();
        /******/ _N_E = __webpack_exports__;
        /******/
    },
]);
